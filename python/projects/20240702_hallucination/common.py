# common.py

import os
import torch
import laboratory as lab

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# Define individual components
def get_image_dataset(train=True):
    return lab.torch.datasets.Medmnist_OrganA(root='medmnist_data', train=train).to(device)

def get_measurement_simulator(noise_variance=0.1):
    return lab.torch.distributions.gaussian.AdditiveWhiteGaussianNoise(noise_variance=noise_variance).to(device)

def get_noise_variance_fn(noise_variance):
    def noise_variance_fn(t):
        if isinstance(t, int) or isinstance(t, float):
            t = torch.tensor(t, dtype=torch.float32)
        t = t.view(-1, 1, 1, 1)
        return t * noise_variance
    return noise_variance_fn

def get_noise_variance_prime_fn(noise_variance):
    def noise_variance_prime_fn(t):
        t = t.view(-1, 1, 1, 1)
        return (0 * t + 1) * noise_variance
    return noise_variance_prime_fn

def get_forward_SDE(noise_variance):
    noise_variance_fn = get_noise_variance_fn(noise_variance)
    noise_variance_prime_fn = get_noise_variance_prime_fn(noise_variance)
    return lab.torch.sde.SongVarianceExplodingProcess(noise_variance=noise_variance_fn, noise_variance_prime=noise_variance_prime_fn)

def get_image_encoder():
    return lab.torch.linalg.IdentityLinearOperator().to(device)

def get_time_encoder():
    return lab.torch.networks.DenseNet(input_shape=(1,), output_shape=(1, 28, 28), hidden_channels_list=[782, 782], activation='relu').to(device)

class Unet_FinalEstimator(torch.nn.Module):
    def __init__(self):
        super(Unet_FinalEstimator, self).__init__()
        class ConvBlock(torch.nn.Module):
            def __init__(self, in_channels, out_channels, activation='relu'):
                super(ConvBlock, self).__init__()
                self.conv = torch.nn.Conv2d(in_channels, out_channels, kernel_size=3, padding=1)
                self.bn = torch.nn.BatchNorm2d(out_channels)
                self.activation = torch.nn.ReLU() if activation == 'relu' else torch.nn.Identity()

            def forward(self, x):
                return self.activation(self.bn(self.conv(x)))

        class DownConvBlock(torch.nn.Module):
            def __init__(self, in_channels, out_channels, activation='relu'):
                super(DownConvBlock, self).__init__()
                self.conv = torch.nn.Conv2d(in_channels, out_channels, kernel_size=3, padding=1, stride=2)
                self.bn = torch.nn.BatchNorm2d(out_channels)
                self.activation = torch.nn.ReLU() if activation == 'relu' else torch.nn.Identity()

            def forward(self, x):
                return self.activation(self.bn(self.conv(x)))

        class UpConvBlock(torch.nn.Module):
            def __init__(self, in_channels, out_channels, activation='relu'):
                super(UpConvBlock, self).__init__()
                self.conv = torch.nn.ConvTranspose2d(in_channels, out_channels, kernel_size=3, padding=1, stride=2, output_padding=1)
                self.bn = torch.nn.BatchNorm2d(out_channels)
                self.activation = torch.nn.ReLU() if activation == 'relu' else torch.nn.Identity()

            def forward(self, x):
                return self.activation(self.bn(self.conv(x)))

        base_channels = 32
        self.conv1 = ConvBlock(2, base_channels)
        self.conv2 = ConvBlock(base_channels, base_channels)
        self.down3 = DownConvBlock(base_channels, base_channels * 2)
        self.conv4 = ConvBlock(base_channels * 2, base_channels * 2)
        self.conv5 = ConvBlock(base_channels * 2, base_channels * 2)
        self.down6 = DownConvBlock(base_channels * 2, base_channels * 4)
        self.conv7 = ConvBlock(base_channels * 4, base_channels * 4)
        self.conv8 = ConvBlock(base_channels * 4, base_channels * 4)
        self.up9 = UpConvBlock(base_channels * 4, base_channels * 2)
        self.conv10 = ConvBlock(base_channels * 4, base_channels * 2)
        self.conv11 = ConvBlock(base_channels * 2, base_channels * 2)
        self.up12 = UpConvBlock(base_channels * 2, base_channels)
        self.conv13 = ConvBlock(base_channels * 2, base_channels)
        self.conv14 = ConvBlock(base_channels, base_channels)
        self.conv15 = ConvBlock(base_channels, 1, activation='linear')

    def forward(self, image_embedding, time_embedding):
        concatenated_data = torch.cat([image_embedding, time_embedding], dim=1)
        x1 = self.conv1(concatenated_data)
        x2 = self.conv2(x1)
        x3 = self.down3(x2)
        x4 = self.conv4(x3)
        x5 = self.conv5(x4)
        x6 = self.down6(x5)
        x7 = self.conv7(x6)
        x8 = self.conv8(x7)
        x9 = self.up9(x8)
        x10 = self.conv10(torch.cat([x9, x5], dim=1))
        x11 = self.conv11(x10)
        x12 = self.up12(x11)
        x13 = self.conv13(torch.cat([x12, x2], dim=1))
        x14 = self.conv14(x13)
        x15 = self.conv15(x14)
        return x15

def get_final_estimator():
    return Unet_FinalEstimator().to(device)

def get_diffusion_backbone(image_encoder, time_encoder, final_estimator):
    return lab.torch.diffusion.UnconditionalDiffusionBackbone(image_encoder=image_encoder, time_encoder=time_encoder, final_estimator=final_estimator).to(device)

def get_diffusion_model(forward_SDE, diffusion_backbone):
    return lab.torch.diffusion.UnconditionalDiffusionModel(forward_SDE=forward_SDE, diffusion_backbone=diffusion_backbone, estimator_type='mean').to(device)

def get_image_reconstructor(diffusion_model):
    initial_reconstructor = lab.torch.linalg.IdentityLinearOperator()
    final_reconstructor = lab.torch.linalg.IdentityLinearOperator()
    return lab.torch.tasks.reconstruction.DiffusionBridgeImageReconstructor(initial_reconstructor=initial_reconstructor, diffusion_model=diffusion_model, final_reconstructor=final_reconstructor).to(device)

def get_diffusion_bridge_model(train=True, noise_variance=0.1):
    image_dataset = get_image_dataset(train=train)
    measurement_simulator = get_measurement_simulator(noise_variance=noise_variance)
    forward_SDE = get_forward_SDE(noise_variance=noise_variance)
    image_encoder = get_image_encoder()
    time_encoder = get_time_encoder()
    final_estimator = get_final_estimator()
    diffusion_backbone = get_diffusion_backbone(image_encoder, time_encoder, final_estimator)
    diffusion_model = get_diffusion_model(forward_SDE, diffusion_backbone)
    image_reconstructor = get_image_reconstructor(diffusion_model)
    return lab.torch.tasks.reconstruction.DiffusionBridgeModel(image_dataset=image_dataset, measurement_simulator=measurement_simulator, image_reconstructor=image_reconstructor, task_evaluator='rmse').to(device)

def load_weights(diffusion_bridge_model, filename):
    if torch.cuda.is_available() and os.path.exists(filename):
        diffusion_bridge_model.image_reconstructor.diffusion_model.diffusion_backbone.load_state_dict(torch.load(filename))
    elif os.path.exists(filename):
        diffusion_bridge_model.image_reconstructor.diffusion_model.diffusion_backbone.load_state_dict(torch.load(filename, map_location=torch.device('cpu')))
    else:
        print(f"Weights file '{filename}' not found.")

def save_weights(diffusion_bridge_model, filename):
    torch.save(diffusion_bridge_model.image_reconstructor.diffusion_model.diffusion_backbone.state_dict(), filename)