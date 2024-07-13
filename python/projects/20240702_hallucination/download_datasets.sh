#!/bin/bash

# Define the virtual environment directory
VENV_DIR="medmnist_env"

# Check if the virtual environment already exists
if [ -d "$VENV_DIR" ]; then
  echo "The virtual environment 'medmnist_env' already exists. Skipping environment creation."
else
  # Create the virtual environment
  python3 -m venv $VENV_DIR

  # Activate the virtual environment
  source $VENV_DIR/bin/activate

  # Upgrade pip
  pip install --upgrade pip

  # Install required packages
  pip install -r medmnist_requirements.txt

  # Deactivate the virtual environment
  deactivate
fi

# Activate the virtual environment
source $VENV_DIR/bin/activate

# Run the Python script to download the datasets
python download_datasets.py

# Deactivate the virtual environment
deactivate