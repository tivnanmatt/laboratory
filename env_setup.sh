#!/bin/bash

# Create the conda environment
conda env create --name laboratory --file environment.yml

# Activate the conda environment
source activate laboratory

# Run the post-install script
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu124

echo "Environment setup complete. Use 'conda activate laboratory' to activate the environment."