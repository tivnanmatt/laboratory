import torch
import matplotlib.pyplot as plt
from common import get_diffusion_bridge_model, load_weights
import laboratory as lab

# Get the model
diffusion_bridge_model = get_diffusion_bridge_model(train=False)

# Load pre-trained weights
diffusion_backbone_weights_filename = 'weights/diffusion_backbone_weights.pth'
load_weights(diffusion_bridge_model, diffusion_backbone_weights_filename)

# Set the model to evaluation mode
diffusion_bridge_model.eval()

# Generate samples
num_images = 16
num_measurements = 4
num_reconstructions = 4
true_images = torch.zeros(num_images, 1, 1, 1, 28, 28)
measurements = torch.zeros(num_images, num_measurements, 1, 1, 28, 28)
reconstructions = torch.zeros(num_images, num_measurements, num_reconstructions, 1, 28, 28)

for i in range(num_images):
    true_image, _ = diffusion_bridge_model.image_dataset[i:i+1]
    true_images[i] = true_image.reshape(1, 1, 1, 28, 28)


    for j in range(num_measurements):
        measurement = diffusion_bridge_model.measurement_simulator(true_image)
        measurements[i, j] = measurement
        for k in range(num_reconstructions):
            print(f"Generating sample {i+1}/{num_images}, measurement {j+1}/{num_measurements}, reconstruction {k+1}/{num_reconstructions}")
            with torch.no_grad():
                # reconstruction = diffusion_bridge_model.image_reconstructor(measurement)
                t = torch.ones(1, 1).to(measurement.device)
                assert isinstance(diffusion_bridge_model.image_reconstructor, lab.torch.tasks.reconstruction.DiffusionBridgeImageReconstructor)
                assert isinstance(diffusion_bridge_model.image_reconstructor.diffusion_model, lab.torch.diffusion.UnconditionalDiffusionModel)
                # reconstruction = diffusion_bridge_model.image_reconstructor.diffusion_model.diffusion_backbone(measurement, t)
                reconstruction = diffusion_bridge_model.image_reconstructor(measurement, num_timesteps=32)
            reconstructions[i, j, k] = reconstruction.reshape(1, 28, 28)
            
# Create animation
import matplotlib.animation as animation

fig, axs = plt.subplots(1, 3, figsize=(15, 5))
im0 = axs[0].imshow(true_images[0, 0, 0, 0], cmap='gray', vmin=-3, vmax=3)
axs[0].set_title('True Images')
im1 = axs[1].imshow(measurements[0, 0, 0, 0], cmap='gray', vmin=-3, vmax=3)
axs[1].set_title('Measurements')
im2 = axs[2].imshow(reconstructions[0, 0, 0, 0], cmap='gray', vmin=-3, vmax=3)
axs[2].set_title('Reconstructions')

def animate(i):
    print('Animating frame {}/{}'.format(i+1, num_images*num_measurements*num_reconstructions))
    i, j, k = i // (num_measurements*num_reconstructions), (i // num_reconstructions) % num_measurements, i % num_reconstructions
    im0.set_array(true_images[i, 0, 0, 0])
    im1.set_array(measurements[i, j, 0, 0])
    im2.set_array(reconstructions[i, j, k, 0])
    return im0, im1, im2
    

ani = animation.FuncAnimation(fig, animate, frames=num_images*num_measurements*num_reconstructions, interval=1000, repeat=False)

# mp4 writer ffmpeg
writer = animation.writers['ffmpeg'](fps=10)
ani.save('figures/diffusion_bridge_model.mp4', writer=writer)

plt.show()