import medmnist
from medmnist import INFO
import numpy as np
import os

# Ensure the output directory exists
os.makedirs('medmnist_data', exist_ok=True)

def save_dataset(dataset, split):
    images, labels = dataset.imgs, dataset.labels
    np.save(f'medmnist_data/{dataset.flag}_{split}_images.npy', images)
    np.save(f'medmnist_data/{dataset.flag}_{split}_labels.npy', labels)

for data_flag in ['pathmnist', 'chestmnist', 'dermamnist', 'octmnist', 'pneumoniamnist', 'retinamnist', 'breastmnist', 'bloodmnist', 'tissuemnist', 'organamnist', 'organcmnist', 'organsmnist']:

    info = INFO[data_flag]
    DataClass = getattr(medmnist, info['python_class'])

    # Download and save train dataset
    train_dataset = DataClass(split='train', download=True)
    save_dataset(train_dataset, 'train')

    # Download and save test dataset
    test_dataset = DataClass(split='test', download=True)
    save_dataset(test_dataset, 'test')

    # Download and save validation dataset if available
    if info['task'] == 'multi-class':
        val_dataset = DataClass(split='val', download=True)
        save_dataset(val_dataset, 'val')

print("Datasets downloaded and saved successfully.")