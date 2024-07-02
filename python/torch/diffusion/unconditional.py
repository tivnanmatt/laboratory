import torch
from .sde import StochasticDifferentialEquation

class UnconditionalDiffusionModel:
    def __init__(self, sde, nn_backbone, backbone_type='score'):
        
        assert isinstance(sde, StochasticDifferentialEquation)
        assert isinstance(nn_backbone, torch.nn.Module)
        assert backbone_type in ['score', 'mean', 'pushback']
        
        self.sde = sde
        self.nn_backbone = nn_backbone
        self.backbone_type = backbone_type

    def sample(self, x0, timesteps, sampler='euler', return_all=False):
        return self.sde.sample(x0, timesteps, sampler, return_all)