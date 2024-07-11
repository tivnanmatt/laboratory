
import torch
from torch import nn

from .core import Distribution

from ..linalg import LinearOperator, ScalarLinearOperator

class GaussianDistribution(Distribution):
    def __init__(self, mu, Sigma):
        super(GaussianDistribution, self).__init__()

        assert isinstance(mu, torch.Tensor)
        assert isinstance(Sigma, LinearOperator)

        self.mu = mu
        self.Sigma = Sigma

    def sample(self):
        white_noise = torch.randn(self.mu.shape, device=self.mu.device)
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
    


class ConditionalGaussianDistribution(Distribution):
    def __init__(self, mu_fn, Sigma_fn):
        super(ConditionalGaussianDistribution, self).__init__()

        self.mu_fn = mu_fn
        self.Sigma_fn = Sigma_fn
    
    def evaluate(self, y):
        mu = self.mu_fn(y)
        Sigma = self.Sigma_fn(y)
        return GaussianDistribution(mu, Sigma)
    
    def sample(self, y, *args, **kwargs):
        return self.evaluate(y).sample(*args, **kwargs)
    
    def log_prob(self, y, x):
        return self.evaluate(y).log_prob(x)
    
    def mahalanobis_distance(self, y, x):
        return self.evaluate(y).mahalanobis_distance(x)
    


class LinearSystemGaussianNoise(ConditionalGaussianDistribution):
    def __init__(self, linear_system, noise_covariance):
        mu_fn = lambda y: linear_system @ y
        Sigma_fn = lambda y: noise_covariance
        super(LinearSystemGaussianNoise, self).__init__(mu_fn, Sigma_fn)
        self.linear_system = linear_system
        self.noise_covariance = noise_covariance



class AdditiveWhiteGaussianNoise(ConditionalGaussianDistribution):
    def __init__(self, noise_variance):
        noise_covariance_linear_operator = ScalarLinearOperator(noise_variance)
        mu_fn = lambda y: y
        Sigma_fn = lambda y: noise_covariance_linear_operator
        super(AdditiveWhiteGaussianNoise, self).__init__(mu_fn, Sigma_fn)
        self.noise_variance = noise_variance