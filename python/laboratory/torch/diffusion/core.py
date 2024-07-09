import torch
from .sde import StochasticDifferentialEquation

class DiffusionModel(torch.nn.Module):
    def __init__(self,
                 stochastic_differential_equation=None,
                 neural_network=None,
                 batch_size=None,
                 sampler=None,
                 initializer=None,
                 time_scheduler=None,
                 load_weights_filename=None
                 ):
        """
        This is an abstract base class for diffusion models.

        It inherits from torch.nn.Module.
        
        It requires the methods sample_x_t_given_x_0 and sample_x_t_minus_dt_given_x_t to be implemented.

        parameters:
            None
        """

        assert isinstance(stochastic_differential_equation, StochasticDifferentialEquation)
        assert isinstance(neural_network, torch.nn.Module)

        super(DiffusionModel, self).__init__()
    
    def forward(self, x_0: torch.Tensor, t: torch.Tensor):
        """
        This method implements the forward pass of the linear operator, i.e. the matrix-vector product.

        parameters:
            x: torch.Tensor 
                The input tensor to the linear operator.
        returns:
            result: torch.Tensor of shape [batch_size, num_channel, *output_shape]
                The result of applying the linear operator to the input tensor.
        """

        return self.sample_x_t_given_x_0(x_0, t)
    
    def sample_x_t_given_x_0(self, x_0: torch.Tensor, t: torch.Tensor):
        """
        This method samples x_t given x_0.

        parameters:
            x_0: torch.Tensor 
                The initial condition.
            t: float
                The time step.
        returns:
            x_t: torch.Tensor
                The sample at time t.
        """

        return self.stochastic_differential_equation.sample_x_t_given_x_0(x_0, t)
    
    def sample_x_t_plus_dt_given_x_t(self, x_t: torch.Tensor, t: torch.Tensor, dt: torch.Tensor):
        return self.stochastic_differential_equation.sample_x_t_plus_dt_given_x_t(x_t, t, dt)
    




class UnconditionalScoreBasedDiffusionModel(DiffusionModel):
    def __init__(self,
                 stochastic_differential_equation,
                 backbone,
                 sampler=None,
                 ):
        """
        This is an abstract base class for unconditional score-based diffusion models.

        It inherits from torch.nn.Module.
        
        It requires the methods score, score_and_sample, and sample_x_t_given_x_0 to be implemented.

        parameters:
            None
        """

        assert isinstance(stochastic_differential_equation, StochasticDifferentialEquation)
        assert isinstance(neural_network, torch.nn.Module)

        super(UnconditionalScoreBasedDiffusionModel, self).__init__()
    
    def score(self, x: torch.Tensor, t: torch.Tensor):
        """
        This method calculates the score of the diffusion model at time t.

        parameters:
            x: torch.Tensor 
                The input tensor to the diffusion model.
            t: float
                The time step.
        returns:
            score: torch.Tensor
                The score of the diffusion model at time t.
        """

        raise NotImplementedError
    
    def score_and_sample(self, x: torch.Tensor, t: torch.Tensor):
        """
        This method calculates the score of the diffusion model at time t and samples x_t given x.

        parameters:
            x: torch.Tensor 
                The input tensor to the diffusion model.
            t: float
                The time step.
        returns:
            score: torch.Tensor
                The score of the diffusion model at time t.
            x_t: torch.Tensor
                The sample at time t.
        """

        raise NotImplementedError
    
    def sample_x_t_given_x_0(self, x_0: torch.Tensor, t: torch.Tensor):
        """
        This method samples x_t given x_0.

        parameters:
            x_0: torch.Tensor 
                The initial condition.
            t: float
                The time step.
        returns:
            x_t: torch.Tensor
                The sample at time t.
        """

        raise NotImplementedError