import json
import os
import shutil
import matplotlib.pyplot as plt
import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import datasets, transforms
from timm.utils import accuracy, AverageMeter
from sklearn.metrics import classification_report
from timm.data.mixup import Mixup
import timm
from ema import EMA  # Local file import

# Configuration
DATA_ROOT = r"D:\downloads\glaucoma_detection\data"
PLR3_DIR = os.path.join(DATA_ROOT, "PLR3")

# 定义训练过程
def train(model, device, train_loader, optimizer, epoch):
    model.train()
    loss_meter = AverageMeter()
    acc1_meter = AverageMeter()
    acc5_meter = AverageMeter()
    total_num = len(train_loader.dataset)
    
    for batch_idx, (data, target) in enumerate(train_loader):
        if len(data) % 2 != 0:
            if len(data) < 2: continue
            data = data[:len(data)-1]
            target = target[:len(target)-1]
            
        data, target = data.to(device), target.to(device)
        output = model(data)
        optimizer.zero_grad()
        
        loss = criterion_train(output, target)
        loss.backward()
        optimizer.step()
        
        if use_ema and epoch % ema_epoch == 0:
            ema.update()
            
        acc1, acc5 = accuracy(output, target, topk=(1, 5))
        loss_meter.update(loss.item(), target.size(0))
        acc1_meter.update(acc1.item(), target.size(0))
        
        if (batch_idx + 1) % 10 == 0:
            print(f'Train Epoch: {epoch} [{batch_idx+1}/{len(train_loader)}] Loss: {loss.item():.6f}')
            
    print(f'Epoch {epoch} - Train Loss: {loss_meter.avg:.2f}, Acc: {acc1_meter.avg:.2f}')
    return loss_meter.avg, acc1_meter.avg

# 验证过程
@torch.no_grad()
def val(model, device, test_loader):
    global Best_ACC
    model.eval()
    loss_meter = AverageMeter()
    acc1_meter = AverageMeter()
    val_list, pred_list = [], []
    
    if use_ema and epoch % ema_epoch == 0:
        ema.apply_shadow()
        
    for data, target in test_loader:
        data, target = data.to(device), target.to(device)
        output = model(data)
        loss = criterion_val(output, target)
        
        _, pred = torch.max(output, 1)
        val_list.extend(target.cpu().numpy())
        pred_list.extend(pred.cpu().numpy())
        
        acc1, _ = accuracy(output, target, topk=(1, 5))
        loss_meter.update(loss.item(), target.size(0))
        acc1_meter.update(acc1.item(), target.size(0))
        
    if use_ema and epoch % ema_epoch == 0:
        ema.restore()
        
    acc = acc1_meter.avg
    if acc > Best_ACC:
        torch.save(model.state_dict(), os.path.join(file_dir, 'best.pth'))
        Best_ACC = acc
        
    print(f'Validation - Loss: {loss_meter.avg:.4f}, Acc: {acc:.2f}%')
    return val_list, pred_list, loss_meter.avg, acc

if __name__ == '__main__':
    #创建保存模型的文件夹
    file_dir = 'checkpoints/resnet50_eye_plr3'
    if os.path.exists(file_dir):
        print('true')
        shutil.rmtree(file_dir)
        os.makedirs(file_dir,exist_ok=True)
    else:
        os.makedirs(file_dir)

    # 设置全局参数
    model_lr = 1e-4
    BATCH_SIZE = 4
    EPOCHS = 264
    DEVICE = torch.device('cuda:7' if torch.cuda.is_available() else 'cpu')
    use_amp = False
    use_dp=False
    classes = 2
    resume = False
    CLIP_GRAD = 5.0
    model_path = 'best.pth'
    Best_ACC = 0
    use_ema=False
    ema_epoch=32

    # 数据预处理
    transform = transforms.Compose([
        transforms.RandomRotation(10),
        transforms.GaussianBlur(kernel_size=(5,5),sigma=(0.1, 3.0)),
        transforms.ColorJitter(brightness=0.5, contrast=0.5, saturation=0.5),
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.68023187, 0.7164117, 0.8486238], std= [0.08319076, 0.08293499, 0.06208893])
    ])
    
    transform_test = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.68023187, 0.7164117, 0.8486238], std= [0.08319076, 0.08293499, 0.06208893])
    ])

    # 读取数据 (FIXED PATHS)
    dataset_train = datasets.ImageFolder(os.path.join(DATA_ROOT, "PLR3"), transform=transform)
    dataset_test = datasets.ImageFolder(os.path.join(DATA_ROOT, "PLR3"), transform=transform_test)
    
    # Save class mappings
    with open('class.json', 'w') as f:
        json.dump(dataset_train.class_to_idx, f)
    
    train_loader = torch.utils.data.DataLoader(dataset_train, batch_size=BATCH_SIZE, shuffle=True)
    test_loader = torch.utils.data.DataLoader(dataset_test, batch_size=BATCH_SIZE, shuffle=False)
    
    # 实例化模型
    
    model = timm.create_model('resnet50', pretrained=True, num_classes=2)
    print(model)

    # 添加损失函数定义 (CRITICAL FIX)
    criterion_train = torch.nn.CrossEntropyLoss()
    criterion_val = torch.nn.CrossEntropyLoss()

    if resume:
        model = torch.load(model_path)
    model.to(DEVICE)


    # 优化器设置
    optimizer = optim.Adam(model.parameters(), lr=model_lr)
    scheduler = optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=20)
    
    # EMA初始化
    if use_ema:
        ema = EMA(model, 0.999)
        ema.register()
    
    # 训练循环
    best_acc = 0
    for epoch in range(1, EPOCHS+1):
        train_loss, train_acc = train(model, DEVICE, train_loader, optimizer, epoch)
        val_labels, val_preds, val_loss, val_acc = val(model, DEVICE, test_loader)
        
        scheduler.step()
        print(classification_report(val_labels, val_preds, target_names=dataset_train.classes))
        
        # 保存可视化结果
        plt.figure()
        plt.plot([train_loss], label='Train Loss')
        plt.plot([val_loss], label='Val Loss')
        plt.legend()
        plt.savefig(os.path.join(file_dir, f'loss_epoch{epoch}.png'))
        plt.close()