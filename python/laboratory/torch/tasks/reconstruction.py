
import torch
from torch import nn

class ImageReconstructionTask(nn.Module):
    def __init__(self, 
                 image_dataset,
                 measurement_simulator,
                 image_reconstructor,
                 task_evaluator='rmse'):
        
        # assert isinstance(image_dataset, torch.utils.data.Dataset)
        assert isinstance(measurement_simulator, nn.Module)
        assert isinstance(image_reconstructor, nn.Module)

        super(ImageReconstructionTask, self).__init__()

        self.image_dataset = image_dataset
        self.measurement_simulator = measurement_simulator
        self.image_reconstructor = image_reconstructor
        
        if isinstance(task_evaluator, str):
            if task_evaluator == 'mse':
                self.task_evaluator = nn.MSELoss()
            elif task_evaluator == 'rmse':
                self.task_evaluator = lambda x, y: torch.sqrt(nn.MSELoss()(x, y))
            else:
                opts_lst = ['mse', 'rmse']
                raise ValueError(f"task_metric must be one of {opts_lst}")
            
        if isinstance(task_evaluator, nn.Module):
            self.task_evaluator = task_evaluator

    def sample_images(self, *args, **kwargs):
        true_images = self.image_dataset(*args, **kwargs)
        return true_images
    
    def sample_measurements_given_images(self, true_images):
        measurements = self.measurement_simulator(true_images)
        return measurements
    
    def sample_reconstructions_given_measurements(self, measurements):
        reconstructions = self.image_reconstructor(measurements)
        return reconstructions
    
    def sample_measurements(self, *args, **kwargs):
        true_images = self.image_dataset(*args, **kwargs)
        measurements = self.measurement_simulator(true_images)
        return true_images, measurements
    
    def sample_reconstructions(self, *args, **kwargs):
        true_images = self.image_dataset(*args, **kwargs)
        measurements = self.measurement_simulator(true_images)
        reconstructions = self.image_reconstructor(measurements)
        return true_images, measurements, reconstructions
    
    def sample_reconstructions_given_images(self, true_images):
        measurements = self.measurement_simulator(true_images)
        reconstructions = self.image_reconstructor(measurements)
        return reconstructions

    def sample(self, *args, **kwargs):
        true_images = self.image_dataset(*args, **kwargs)
        measurements = self.measurement_simulator(true_images)
        reconstructed_images = self.image_reconstructor(measurements)
        task_metrics = self.task_evaluator(true_images, reconstructed_images)
        return true_images, measurements, reconstructed_images, task_metrics

    def forward(self, *args, **kwargs):
        return self.sample(*args, **kwargs)

    def train_reconstructor(self, *args, num_epochs=100, num_iterations=100, optimizer=None, verbose=True, **kwargs):

        if optimizer is None:
            optimizer = torch.optim.Adam(self.image_reconstructor.parameters(), lr=1e-3)
        
        for epoch in range(num_epochs):
            for iteration in range(num_iterations):
                optimizer.zero_grad()
                true_images, _, reconstructions = self.sample_reconstructions(*args, **kwargs)
                loss = self.task_evaluator(true_images, reconstructions)
                loss.backward()
                optimizer.step()
            if verbose:
                print(f"Epoch {epoch}: Loss: {loss.item()}")
        
        return 








from ..diffusion import UnconditionalDiffusionModel



class DiffusionBridgeImageReconstructor(nn.Module):
            def __init__(self, initial_reconstructor, diffusion_model, final_reconstructor):
                super(DiffusionBridgeImageReconstructor, self).__init__()
                assert isinstance(initial_reconstructor, nn.Module)
                assert isinstance(diffusion_model, UnconditionalDiffusionModel)
                assert isinstance(final_reconstructor, nn.Module)
                self.initial_reconstructor = initial_reconstructor
                self.diffusion_model = diffusion_model
                self.final_reconstructor = final_reconstructor
                
            def forward(self,measurements,timesteps=None, num_timesteps=None, sampler='euler', verbose=False):

                assert isinstance(self.initial_reconstructor, nn.Module)
                assert isinstance(self.diffusion_model, UnconditionalDiffusionModel)
                assert isinstance(self.final_reconstructor, nn.Module)

                x_1 = self.initial_reconstructor(measurements)

                if timesteps is None:
                    if num_timesteps is None:
                        num_timesteps = 128
                    timesteps = torch.linspace(1, 0, num_timesteps+1).to(x_1.device)
              
                assert isinstance(timesteps, torch.Tensor)
                assert timesteps.ndim == 1
                assert timesteps.shape[0] > 1
                assert timesteps[0] == 1.0
                assert timesteps[-1] == 0.0
                for i in range(1, timesteps.shape[0]):
                    assert timesteps[i] < timesteps[i-1]

                x_0 = self.diffusion_model.reverse_sample(x_1, timesteps, sampler=sampler, return_all=False, verbose=verbose)
                
                reconstructions = self.final_reconstructor(x_0)
                return reconstructions

class DiffusionBridgeModel(ImageReconstructionTask):
    def __init__(self, 
                 image_dataset,
                 measurement_simulator,
                 image_reconstructor,                 
                 task_evaluator='rmse'):
        
        assert isinstance(image_reconstructor, DiffusionBridgeImageReconstructor)
            
        super(DiffusionBridgeModel, self).__init__(image_dataset, 
                                                    measurement_simulator, 
                                                    image_reconstructor, 
                                                    task_evaluator=task_evaluator)
        
    def train_diffusion_backbone(self, *args, num_epochs=100, num_iterations=100, optimizer=None, verbose=True, time_sampler=None,**kwargs):
                
        assert isinstance(self.image_reconstructor, DiffusionBridgeImageReconstructor)

        if optimizer is None:
            optimizer = torch.optim.Adam(self.image_reconstructor.diffusion_model.diffusion_backbone.parameters(), lr=1e-3)


        if time_sampler is None:
            assert isinstance(self.image_reconstructor.diffusion_model.diffusion_backbone, torch.nn.Module)
            time_sampler = lambda x_shape: torch.rand(x_shape)

        for epoch in range(num_epochs):
            for iteration in range(num_iterations):
                optimizer.zero_grad()
                true_images = self.sample_images(*args, **kwargs)
                batch_size = true_images.shape[0]
                measurements = self.sample_measurements_given_images(true_images)
                t = time_sampler((batch_size, 1)).to(true_images.device)
                x_0 = self.image_reconstructor.initial_reconstructor(measurements)
                x_t = self.image_reconstructor.diffusion_model.sample_x_t_given_x_0(x_0, t)
                x_0_pred = self.image_reconstructor.diffusion_model.predict_x_0_given_x_t(x_t, t)
                reconstructions = self.image_reconstructor.final_reconstructor(x_0_pred)
                loss = self.task_evaluator(true_images, reconstructions)
                loss.backward()
                optimizer.step()
            if verbose:
                print(f"Epoch {epoch}: Loss: {loss.item()}")
        
        return 

