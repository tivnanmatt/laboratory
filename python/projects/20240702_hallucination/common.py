import os
import torch
import laboratory as lab

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# Define the components of the DiffusionBridgeModel
def get_diffusion_bridge_model(measurement_noise_variance=0.1, train=True):
    # Dataset
    image_dataset = lab.torch.datasets.Medmnist_OrganA(
                            root='medmnist_data',
                            train=True).to(device)
    
    # Measurement Noise Simulator
    measurement_simulator = lab.torch.distributions.gaussian.AdditiveWhiteGaussianNoise(
                                noise_variance=measurement_noise_variance).to(device)
    
    # Noise Variance Function
    def noise_variance_fn(t):
        if isinstance(t, int) or isinstance(t, float):
            t = torch.tensor(t, dtype=torch.float32)
        t = t.view(-1, 1, 1, 1)
        return t * measurement_noise_variance

    # Noise Variance Derivative Function
    def noise_variance_prime_fn(t):
        t = t.view(-1, 1, 1, 1)
        return (0 * t + 1) * measurement_noise_variance

    # Forward SDE
    forward_SDE = lab.torch.sde.SongVarianceExplodingProcess(
                        noise_variance=noise_variance_fn, 
                        noise_variance_prime=noise_variance_prime_fn)

    # Image Encoder
    image_encoder = lab.torch.linalg.IdentityLinearOperator().to(device)

    # Time Encoder
    time_encoder = lab.torch.networks.DenseNet(input_shape=(1,), 
                                               output_shape=(1, 28, 28), 
                                               hidden_channels_list=[782, 782], 
                                               activation='relu').to(device)

    # # Final Estimator
    # class FinalEstimator(torch.nn.Module):
    #     def __init__(self):
    #         super(FinalEstimator, self).__init__()
    #         self.densenet = lab.torch.networks.DenseNet(
    #                             input_shape=(2, 28, 28), 
    #                             output_shape=(1, 28, 28), 
    #                             hidden_channels_list=[782, 782, 782, 782], 
    #                             activation='relu')
    #         self.head = lab.torch.networks.DenseNet(
    #                         input_shape=(1, 28, 28), 
    #                         output_shape=(1, 28, 28), 
    #                         hidden_channels_list=[782], 
    #                         activation='linear')

    #     def forward(self, image_embedding, time_embedding):
    #         concatenated_data = torch.cat([image_embedding, time_embedding], dim=1)
    #         densenet_output = self.densenet(concatenated_data)
    #         return self.head(densenet_output)
    
    # final_estimator = FinalEstimator().to(device)




    # lets make a final estimator that does a convolutional u-net

    class Unet_FinalEstimator(torch.nn.Module):
        def __init__(self):
            super(Unet_FinalEstimator, self).__init__()
            # input shape is 2, 28, 28
            # output shape is 1, 28, 28

            class ConvBlock(torch.nn.Module):
                def __init__(self, in_channels, out_channels, activation='relu'):
                    super(ConvBlock, self).__init__()
                    self.conv = torch.nn.Conv2d(in_channels, out_channels, kernel_size=3, padding=1)
                    self.bn = torch.nn.BatchNorm2d(out_channels)
                    if activation == 'relu':
                        self.activation = torch.nn.ReLU()
                    elif activation == 'linear':
                        self.activation = torch.nn.Identity()
                def forward(self, x):
                    return self.activation(self.bn(self.conv(x)))

            class DownConvBlock(torch.nn.Module):
                def __init__(self, in_channels, out_channels, activation='relu'):
                    super(DownConvBlock, self).__init__()
                    self.conv = torch.nn.Conv2d(in_channels, out_channels, kernel_size=3, padding=1, stride=2)
                    self.bn = torch.nn.BatchNorm2d(out_channels)
                    if activation == 'relu':
                        self.activation = torch.nn.ReLU()
                    elif activation == 'linear':
                        self.activation = torch.nn.Identity()
                def forward(self, x):
                    return self.activation(self.bn(self.conv(x)))

            class UpConvBlock(torch.nn.Module):
                def __init__(self, in_channels, out_channels, activation='relu'):
                    super(UpConvBlock, self).__init__()
                    self.conv = torch.nn.ConvTranspose2d(in_channels, out_channels, kernel_size=3, padding=1, stride=2, output_padding=1)
                    self.bn = torch.nn.BatchNorm2d(out_channels)
                    if activation == 'relu':
                        self.activation = torch.nn.ReLU()
                    elif activation == 'linear':
                        self.activation = torch.nn.Identity()
                def forward(self, x):
                    return self.activation(self.bn(self.conv(x)))

            base_channels=64
            self.conv1 = ConvBlock(2, base_channels) # -> base_channels, 28, 28
            self.conv2 = ConvBlock(base_channels, base_channels) # -> base_channels, 28, 28
            self.down3 = DownConvBlock(base_channels, base_channels * 2) # -> base_channels * 2, 14, 14
            self.conv4 = ConvBlock(base_channels * 2, base_channels * 2) # -> base_channels * 2, 14, 14
            self.conv5 = ConvBlock(base_channels * 2, base_channels * 2) # -> base_channels * 2, 14, 14
            self.down6 = DownConvBlock(base_channels * 2, base_channels * 4) # -> base_channels * 4, 7, 7
            self.conv7 = ConvBlock(base_channels * 4, base_channels * 4) # -> base_channels * 4, 7, 7
            self.flatten = torch.nn.Flatten()
            self.fc1 = torch.nn.Linear(base_channels * 4 * 7 * 7, base_channels * 4 * 7 * 7)
            self.fc2 = torch.nn.Linear(base_channels * 4 * 7 * 7, base_channels * 4 * 7 * 7)
            self.conv8 = ConvBlock(base_channels * 4, base_channels * 4) # -> base_channels * 4, 7, 7
            self.up9 = UpConvBlock(base_channels * 4, base_channels * 2) # -> base_channels * 2, 14, 14
            self.conv10 = ConvBlock(base_channels * 4, base_channels * 2) # -> base_channels * 2, 14, 14
            self.conv11 = ConvBlock(base_channels * 2, base_channels * 2) # -> base_channels * 2, 14, 14
            self.up12 = UpConvBlock(base_channels * 2, base_channels) # -> base_channels, 28, 28
            self.conv13 = ConvBlock(base_channels * 2, base_channels) # -> base_channels, 28, 28
            self.conv14 = ConvBlock(base_channels, base_channels) # -> base_channels, 28, 28
            self.conv15 = ConvBlock(base_channels, 1, activation='linear') # -> 1, 28, 28


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
        
    final_estimator = Unet_FinalEstimator().to(device)

    # Diffusion Backbone
    diffusion_backbone = lab.torch.diffusion.UnconditionalDiffusionBackbone(
                            image_encoder=image_encoder,
                            time_encoder=time_encoder,
                            final_estimator=final_estimator).to(device)

    # Diffusion Model
    diffusion_model = lab.torch.diffusion.UnconditionalDiffusionModel(
                            forward_SDE=forward_SDE,
                            diffusion_backbone=diffusion_backbone,
                            estimator_type='mean').to(device)
    

    # Initial and Final Reconstructor
    initial_reconstructor = lab.torch.linalg.IdentityLinearOperator()
    final_reconstructor = lab.torch.linalg.IdentityLinearOperator()

    # Diffusion Bridge Image Reconstructor
    image_reconstructor = lab.torch.tasks.reconstruction.DiffusionBridgeImageReconstructor(
                            initial_reconstructor=initial_reconstructor,
                            diffusion_model=diffusion_model,
                            final_reconstructor=final_reconstructor
                            ).to(device)

    # Diffusion Bridge Model
    diffusion_bridge_model = lab.torch.tasks.reconstruction.DiffusionBridgeModel(
                                image_dataset=image_dataset,
                                measurement_simulator=measurement_simulator,
                                image_reconstructor=image_reconstructor,
                                task_evaluator='rmse'
                                ).to(device)

    return diffusion_bridge_model

def load_weights(diffusion_bridge_model, filename):
    if torch.cuda.is_available() and os.path.exists(filename):
        diffusion_bridge_model.image_reconstructor.diffusion_model.diffusion_backbone.load_state_dict(torch.load(filename))
    elif os.path.exists(filename):
        diffusion_bridge_model.image_reconstructor.diffusion_model.diffusion_backbone.load_state_dict(torch.load(filename, map_location=torch.device('cpu')))
    else:
        print(f"Weights file '{filename}' not found.")

def save_weights(diffusion_bridge_model, filename):
    torch.save(diffusion_bridge_model.image_reconstructor.diffusion_model.diffusion_backbone.state_dict(), filename)