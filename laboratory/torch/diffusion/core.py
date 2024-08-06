import torch
from ..sde import HomogeneousSDE


class UnconditionalDiffusionBackbone(torch.nn.Module):
    def __init__(self,
                 image_encoder,
                 time_encoder,
                 final_estimator):
        
        """
        This is an abstract base class for diffusion backbones.

        It inherits from torch.nn.Module.

        parameters:
            None
        """

        assert isinstance(image_encoder, torch.nn.Module)
        assert isinstance(time_encoder, torch.nn.Module)
        assert isinstance(final_estimator, torch.nn.Module)

        super(UnconditionalDiffusionBackbone, self).__init__()

        self.image_encoder = image_encoder
        self.time_encoder = time_encoder
        self.final_estimator = final_estimator

    def forward(self, x: torch.Tensor, t: torch.Tensor):

        """
        This method implements the forward pass of the linear operator, i.e. the matrix-vector product.

        parameters:
            x: torch.Tensor 
                The input tensor to the linear operator.
        returns:
            result: torch.Tensor of shape [batch_size, num_channel, *output_shape]
                The result of applying the linear operator to the input tensor.
        """
        image_embedding = self.image_encoder(x)
        time_embedding = self.time_encoder(t)

        return self.final_estimator(image_embedding, time_embedding)








class UnconditionalDiffusionModel(torch.nn.Module):
    def __init__(self,
                 forward_SDE,
                 diffusion_backbone,
                 estimator_type='score',
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

        assert isinstance(forward_SDE, HomogeneousSDE)
        assert isinstance(diffusion_backbone, torch.nn.Module)

        super(UnconditionalDiffusionModel, self).__init__()

        self.diffusion_backbone = diffusion_backbone
        self.forward_SDE = forward_SDE

        if estimator_type == 'score':
            self.reverse_SDE = self.forward_SDE.reverse_SDE_given_score_estimator(self.diffusion_backbone)
        elif estimator_type == 'mean':
            self.reverse_SDE = self.forward_SDE.reverse_SDE_given_mean_estimator(self.diffusion_backbone)
        elif estimator_type == 'noise':
            self.reverse_SDE = self.forward_SDE.reverse_SDE_given_noise_estimator(self.diffusion_backbone)

        self.estimator_type = estimator_type

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
        return self.forward_SDE.sample_x_t_given_x_0(x_0, t)
    

    def sample_x_t_given_x_0_and_noise(self, x_0: torch.Tensor, noise: torch.Tensor, t: torch.Tensor):
        """
        This method samples x_t given x_0 and noise.

        parameters:
            x_0: torch.Tensor 
                The initial condition.
            noise: torch.Tensor
                The noise.
            t: float
                The time step.
        returns:
            x_t: torch.Tensor
                The sample at time t.
        """
        return self.forward_SDE.sample_x_t_given_x_0_and_noise(x_0, noise, t)

    def forward_sample(self, x, timesteps, sampler='euler', return_all=False):
        """
        This method samples from the forward SDE.

        parameters:
            x: torch.Tensor
                The initial condition.
            timesteps: int
                The number of timesteps to sample.
            sampler: str
                The method used to compute the forward update. Currently, only 'euler' and 'heun' are supported.
        returns:
            x: torch.Tensor
                The output tensor.
        """

        return self.forward_SDE.sample(x, timesteps, sampler, return_all)

    def reverse_sample(self, x, timesteps, sampler='euler', return_all=False, verbose=False):
        """
        This method samples from the reverse SDE.

        parameters:
            x: torch.Tensor
                The initial condition.
            timesteps: int
                The number of timesteps to sample.
            sampler: str
                The method used to compute the forward update. Currently, only 'euler' and 'heun' are supported.
        returns:
            x: torch.Tensor
                The output tensor.
        """
        return self.reverse_SDE.sample(x, timesteps, sampler, return_all, verbose=verbose)
    
    def predict_x_0_given_x_t(self, x_t: torch.Tensor, t: torch.Tensor):
        """
        This method predicts x_0 given x_t.

        parameters:
            x_t: torch.Tensor
                The sample at time t.
            t: float
                The time step.
        returns:
            x_0: torch.Tensor
                The predicted initial condition.
        """

        if self.estimator_type == 'mean':
            return self.diffusion_backbone(x_t, t)
        elif self.estimator_type == 'score':
            # need to implement Tweedies formula here
            raise NotImplementedError
        elif self.estimator_type == 'noise':
            raise NotImplementedError
        
    def predict_noise_given_x_t(self, x_t: torch.Tensor, t: torch.Tensor):
        """
        This method predicts the noise given x_t.

        parameters:
            x_t: torch.Tensor
                The sample at time t.
            t: float
                The time step.
        returns:
            noise: torch.Tensor
                The predicted noise.
        """

        if self.estimator_type == 'mean':
            raise NotImplementedError
        elif self.estimator_type == 'score':
            raise NotImplementedError
        elif self.estimator_type == 'noise':
            return self.diffusion_backbone(x_t, t)
    




class UnconditionalScoreBasedDiffusionModel(UnconditionalDiffusionModel):
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