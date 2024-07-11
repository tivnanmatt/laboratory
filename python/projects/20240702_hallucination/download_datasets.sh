#!/bin/bash

# Check if the conda environment already exists
if conda env list | grep -q 'medmnist'; then
  echo "The conda environment 'medmnist' already exists. Skipping environment creation."
else
  # Create the conda environment from the environment_medmnist.yml file
  conda env create --name medmnist --file medmnist_environment.yml
fi

# Initialize conda in the current shell session
eval "$(conda shell.bash hook)"

# Activate the newly created conda environment
conda activate medmnist

# Run the Python script to download the datasets
python download_datasets.py

# Deactivate the conda environment
conda deactivate