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
                 device='cpu',
                 num_files=1,
                 verbose=False):
        # Load in the data
        if train:
            image_list = []
            for i in range(num_files):
                if verbose:
                    print(f'Loading {root}/training/training_TCGA_LIHC_{str(i).zfill(6)}.pt')

                image_list.append(torch.load(root + f'/training/training_TCGA_LIHC_' + str(i).zfill(6) + '.pt'))
            self.images = torch.cat(image_list)

        else:
            image_list = []
            for i in range(num_files):
                if verbose:
                    print(f'Loading {root}/testing/testingTCGA_LIHC_{str(i).zfill(6)}.pt')
                image_list.append(torch.load(root + f'/testing/testing_TCGA_LIHC_' + str(i).zfill(6) + '.pt'))
            self.images = torch.cat(image_list)

        # Add an extra dimension for channels on axis 1
        self.images = torch.unsqueeze(self.images, 1)

        # Convert to float
        self.images = self.images.float()

        # Rescale to mean 0 and std 1
        self.mu = self.images.mean()
        self.sigma = self.images.std()
        self.images = (self.images - self.mu) / self.sigma

        # define the device for output images
        self.device = device

        super(TCGA, self).__init__()

    def __len__(self):
        return len(self.images)
    
    # remove the parts that have labels
    def __getitem__(self, idx):
        return self.images[idx].to(self.device)
    
    def sample(self, batch_size=1):
        indices = torch.randint(0, len(self.images), (batch_size,))
        return self.images[indices].to(self.device)

    def to(self, device):
        self.device = device
        return self


