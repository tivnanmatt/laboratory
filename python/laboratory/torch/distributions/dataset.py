
import torch
from torch import nn

from .core import Sampler

class DatasetSampler(Sampler):
    def __init__(self, dataset, batch_size=1):
        super(DatasetSampler, self).__init__()
        self.dataset = dataset
        self.batch_size = batch_size
    
    def sample(self, batch_size):
        self.batch_size = batch_size
        indices = torch.zeros(self.batch_size)
        for i in range(self.batch_size):
            indices[i] = torch.randint(0, len(self.dataset), (1,))
            while indices[i] in indices[:i]:
                indices[i] = torch.randint(0, len(self.dataset), (1,))
        return self.dataset[indices.long()]
    