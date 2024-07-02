
import torch
from torch import nn

class Sampler(nn.Module):
    def __init__(self):
        super(Sampler, self).__init__()

    def sample(self, *args, **kwargs):
        raise NotImplementedError
    
    def forward(self, *args, **kwargs):
        return self.sample(*args, **kwargs)
    
class Distribution(Sampler, torch.distributions.Distribution):
    def __init__(self):
        super(Distribution, self).__init__()
    
    def log_prob(self, *args, **kwargs):
        raise NotImplementedError

    
