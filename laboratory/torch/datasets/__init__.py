# laboratory.torch.datasets

from ..samplers import Sampler
import torch
import numpy as np

class Medmnist_OrganA(Sampler):
    def __init__(self, 
                 root, 
                 train=True,
                 device='cpu'):
        # Load in the data
        if train:
            self.images = torch.from_numpy(np.load(root + '/organamnist_train_images.npy'))
            self.labels = torch.from_numpy(np.load(root + '/organamnist_train_labels.npy'))
        else:
            self.images = torch.from_numpy(np.load(root + '/organamnist_test_images.npy'))
            self.labels = torch.from_numpy(np.load(root + '/organamnist_test_labels.npy'))

        # Add an extra dimension for channels on axis 1
        self.images = torch.unsqueeze(self.images, 1)

        # Convert to float
        self.images = self.images.float()

        # Rescale to mean 0 and std 1
        self.mu = self.images.mean()
        self.sigma = self.images.std()
        self.images = (self.images - self.mu) / self.sigma

        # Move to device
        self.to(device)

        super(Medmnist_OrganA, self).__init__()

    def to(self, device):
        self.images = self.images.to(device)
        self.labels = self.labels.to(device)
        return self

    def __len__(self):
        return len(self.images)

    def __getitem__(self, idx):
        return self.images[idx], self.labels[idx]

    def sample(self, batch_size=1, return_labels=False):
        indices = torch.randint(0, len(self.images), (batch_size,))
        if return_labels:
            return self.images[indices], self.labels[indices]
        else:
            return self.images[indices]










class TCGA(Sampler):
    def __init__(self, 
                 root, 
                 train=True,
                 device='cpu'):
        # Load in the data
        if train:
            for i in range(8):
                self.images = torch.load(root + f'/TCGA_LIHC_00000{i}.pt')
        else:
            self.images = torch.load(root + '/evaluation_TCGA_LIHC_000000.pt')

        # Add an extra dimension for channels on axis 1
        self.images = torch.unsqueeze(self.images, 1)

        # Convert to float
        self.images = self.images.float()

        # Rescale to mean 0 and std 1
        self.mu = self.images.mean()
        self.sigma = self.images.std()
        self.images = (self.images - self.mu) / self.sigma

        # Move to device
        self.to(device)

        super(TCGA, self).__init__()

    def __len__(self):
        return len(self.images)
    
    # remove the parts that have labels
    def __getitem__(self, idx):
        return self.images[idx]
    
    def sample(self, batch_size=1):
        indices = torch.randint(0, len(self.images), (batch_size,))
        return self.images[indices]

    def to(self, device):
        self.images = self.images.to(device)
        return self
