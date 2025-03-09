import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from PIL import Image
import torch
import torch.nn as nn
from torchvision import models
from torchvision import transforms
import tqdm
from sklearn import preprocessing
from sklearn.metrics import r2_score, mean_squared_error, mean_absolute_error
import os


class Model(nn.Module):
    def __init__(self):
        super(Model, self).__init__()
        self.resnet = models.resnet50(weights=models.ResNet50_Weights.IMAGENET1K_V1)
        self.resnet.fc = nn.Sequential(nn.Linear(2048, 128), nn.ReLU(), nn.Linear(128, 59))

    def forward(self, x):
        x = self.resnet(x)
        return x


Batch = 8
Epoch = 50
device = torch.device('cuda:0' if torch.cuda.is_available() else 'cpu')

data_path = './data/'
excel_data = pd.read_excel(data_path + 'VF_clinical_info.xlsx', sheet_name=0)
excel_data = np.array(excel_data)
ids = excel_data[1:, 2]
image_transform = transforms.Compose([transforms.ToTensor(), transforms.Resize((224, 224))])  # (432, 432)
input_format = {0: 'CFPs/', 1: 'ROI images/', 2: 'Annotated Images/'}
format_index = 0  # 0 for CFPs, adjust accordingly

images = []
missing_files = []

# Extract the relevant columns from Excel
subject_numbers = excel_data[1:, 0]
laterality = excel_data[1:, 1]
visit_numbers = excel_data[1:, 6]  # Assuming 'Total Visits' represents visit number; adjust if another column specifies visit explicitly

for subj_num, lat, visit_num in zip(subject_numbers, laterality, visit_numbers):
    subj_str = str(subj_num).split('.')[0]
    lat_str = str(lat).strip()
    visit_str = str(visit_num).split('.')[0]

    filename = f"{subj_str}_{lat_str}_{visit_str}.jpg"
    image_path = os.path.join(data_path, input_format[format_index], filename)

    if os.path.exists(image_path):
        img = Image.open(image_path).convert("RGB")
        images.append(image_transform(img))
    else:
        missing_files.append(image_path)

if missing_files:
    print(f"Warning: {len(missing_files)} files not found:")
    for file in missing_files:
        print(file)

if images:
    images = torch.stack(images, dim=0)
else:
    raise ValueError("No images found. Please check the file paths and naming conventions.")
images = torch.stack(images, dim=0)
labels = np.delete(excel_data[1:, 3:], (21, 32), axis=1).astype(np.float64)

np.random.seed(0)
random_indices = np.random.permutation(len(images))
split_index = int(len(images) * 0.8)
train_data, train_label = images[random_indices[:split_index]], labels[random_indices[:split_index]]
test_data, test_label = images[random_indices[split_index:]], labels[random_indices[split_index:]]

scaler = preprocessing.StandardScaler()
scaler.fit(train_label)
train_label = scaler.transform(train_label)
train_label, test_label = torch.Tensor(train_label), torch.Tensor(test_label)
train_set = torch.utils.data.TensorDataset(train_data, train_label)
train_loader = torch.utils.data.DataLoader(train_set, batch_size=Batch, shuffle=True)
val_index = len(test_data)
val_set = torch.utils.data.TensorDataset(test_data[:val_index], test_label[:val_index])
val_loader = torch.utils.data.DataLoader(val_set, batch_size=Batch, shuffle=False)
test_set = torch.utils.data.TensorDataset(test_data[:val_index], test_label[:val_index])
test_loader = torch.utils.data.DataLoader(test_set, batch_size=Batch, shuffle=False)

model = Model()
model.to(device)

loss_function = nn.MSELoss()
optimizer = torch.optim.Adam(model.parameters(), lr=1e-4, weight_decay=1e-5)
scheduler = torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, eta_min=1e-5, T_max=(len(train_set) // Batch + 1 if len(train_set) % Batch else len(train_set) // Batch) * Epoch)
loss_list_epoch = []
for epoch in tqdm.tqdm(range(Epoch)):
    loss_list_batch = []
    for data in train_loader:
        image, label = data[0].to(device), data[1].to(device)
        pre = model(image)
        loss = loss_function(pre, label)
        optimizer.zero_grad()
        loss.backward()
        torch.nn.utils.clip_grad_norm_(model.parameters(), 1)
        optimizer.step()
        scheduler.step()
        loss_list_batch.append(loss.data.item() * len(pre) / len(train_set))
    loss_list_epoch.append(sum(loss_list_batch))

plt.figure()
plt.plot(loss_list_epoch)
plt.show()

# load model from the provided checkpoints
# model.load_state_dict(torch.load('./checkpoints/' + input_format[format_index] + 'model.pt'))
model.eval()
test_pre = []
with torch.no_grad():
    for data in test_loader:
        image = data[0].to(device)
        pre = model(image)
        test_pre.append(pre)
test_pre = torch.cat(test_pre)
test_pre = scaler.inverse_transform(test_pre.cpu().numpy())
test_pre = np.clip(test_pre, -1, 35)
rmse = mean_squared_error(test_label[:val_index], test_pre, squared=False)
mae = mean_absolute_error(test_label[:val_index], test_pre)
r2 = r2_score(test_label[:val_index], test_pre)

print('Results:', 'RMSE:', (round(rmse, 3)), '\t',
      'MAE', (round(mae, 3)), '\t',
      'R2', (round(r2, 3)))
