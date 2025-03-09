# organize_files.py
import os
import shutil
import pandas as pd

DATA_ROOT = r"D:\downloads\glaucoma_detection\data"
EXCEL_PATH = os.path.join(DATA_ROOT, "VF_clinical_info.xlsx")
SOURCE_IMAGES = os.path.join(DATA_ROOT, "CFPs")  # Where your current images are
TARGET_DIR = os.path.join(DATA_ROOT, "PLR3")     # Will create 0/1 subfolders here

def organize_from_excel():
    # 1. Load Excel data
    df = pd.read_excel(EXCEL_PATH, sheet_name='Baseline')
    df = df.dropna(subset=['PLR3'])
    df['PLR3'] = df['PLR3'].astype(int)
    
    # 2. Create target folders
    for label in [0, 1]:
        os.makedirs(os.path.join(TARGET_DIR, str(label)), exist_ok=True)
    
    # 3. Copy files with validation
    copied = 0
    missing = []
    
    for idx, row in df.iterrows():
        excel_name = str(row['Corresponding CFP']).strip()
        src_path = None
        
        # Try to find matching image with/without extension
        for ext in ['.jpg', '.jpeg', '.png', '']:
            test_path = os.path.join(SOURCE_IMAGES, f"{excel_name}{ext}")
            if os.path.exists(test_path):
                src_path = test_path
                break
                
        if src_path:
            dest_dir = os.path.join(TARGET_DIR, str(row['PLR3']))
            shutil.copy(src_path, dest_dir)
            copied += 1
        else:
            missing.append(excel_name)
    
    # 4. Print results
    print(f"Successfully organized {copied} files")
    if missing:
        print(f"Missing {len(missing)} files. Examples:")
        print(missing[:5])

if __name__ == "__main__":
    organize_from_excel()