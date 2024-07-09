
import torch
from torch import nn

from .core import Distribution

from ..linalg import LinearOperator

class GaussianDistribution(Distribution):
    def __init__(self, mu, Sigma):
        super(GaussianDistribution, self).__init__()

        assert isinstance(mu, torch.Tensor)
        assert isinstance(Sigma, LinearOperator)

        self.mu = mu
        self.Sigma = Sigma

    def sample(self):
        white_noise = torch.randn(self.mu.shape)
        sqrt_Sigma = self.Sigma.sqrt_LinearOperator()
        correlated_noise =  sqrt_Sigma @ white_noise
        return self.mu + correlated_noise
    
    def mahalanobis_distance(self, x):
        res = (x - self.mu)
        weighted_res = self.Sigma.inv_LinearOperator() @ res
        return torch.sum(res * weighted_res)
    
    def log_prob(self, x):
        d  = torch.prod(torch.tensor(self.mu.shape)).float()
        constant_term = - d * torch.log(2 * torch.tensor([3.141592653589793]))
        log_det = self.Sigma.logdet()
        mahalanobis_distance = self.mahalanobis_distance(x)
        return 0.5 * constant_term - 0.5 * log_det - 0.5 * mahalanobis_distance
