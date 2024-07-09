
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

    def train_reconstructor(self, optimizer=None, num_epochs=100):

        if optimizer is None:
            optimizer = torch.optim.Adam(self.image_reconstructor.parameters(), lr=1e-3)
        
        for epoch in range(num_epochs):
            optimizer.zero_grad()
            true_images, measurements, reconstructions = self.sample_reconstructions()
            loss = self.task_evaluator(true_images, reconstructions)
            loss.backward()
            optimizer.step()
            if epoch % 10 == 0:
                print(f"Epoch {epoch}: Loss: {loss.item()}")
        
        return self.image_reconstructor



