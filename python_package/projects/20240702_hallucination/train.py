import os
import torch
from common import get_diffusion_bridge_model, load_weights, save_weights

# Get the model
diffusion_bridge_model = get_diffusion_bridge_model()

# Load pre-trained weights if available
diffusion_backbone_weights_filename = 'weights/diffusion_backbone_weights.pth'
load_weights(diffusion_bridge_model, diffusion_backbone_weights_filename)

for i in range(100):
    # Train the model
    diffusion_bridge_model.train_diffusion_backbone(batch_size=32, num_epochs=10, num_iterations=100, verbose=True)

    # Save the weights after training
    save_weights(diffusion_bridge_model, diffusion_backbone_weights_filename)