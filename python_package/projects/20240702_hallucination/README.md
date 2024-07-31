readme_markdown_string = """
# A Spectral Analysis of Hallucinations in Generative Diffusion Models for Medical Imaging

### Matthew Tivnan

### 13 July 2024

This project focuses on using a diffusion model for medical image reconstruction. It includes scripts for setting up the environment, downloading necessary datasets, defining and training the model, and visualizing the results.

## Table of Contents
- [Setup](#setup)
- [Downloading Datasets](#downloading-datasets)
- [Model Definition](#model-definition)
- [Training the Model](#training-the-model)
- [Evaluating the Model](#evaluating-the-model)
- [Visualization](#visualization)
- [Directory Structure](#directory-structure)

## Setup

To set up the project environment, create the Conda environment specified in the `medmnist_environment.yml` file.

```bash
conda env create --file medmnist_environment.yml
```

Activate the environment:

```bash
conda activate medmnist
```

## Downloading Datasets

Use the `download_datasets.sh` script to download and prepare the datasets required for training and evaluation.

```bash
bash download_datasets.sh
```

## Model Definition

The core model is defined in `common.py` under the function `get_diffusion_bridge_model()`. This function sets up the dataset, noise simulator, SDE process, image encoder, and the U-Net-based final estimator.

## Training the Model

Train the model using the `train.py` script. This script loads the model, optionally loads pre-trained weights, trains the model, and saves the weights after training.

```bash
python train.py
```

## Evaluating the Model

Evaluate the model and generate samples using the `sample.py` script. This script generates true images, measurements, and reconstructions, and creates an animation to visualize the results.

```bash
python sample.py
```

## Visualization

The `sample.py` script includes code to create an animation of the true images, measurements, and reconstructions. The animation is saved as `figures/diffusion_bridge_model.mp4`.

## Directory Structure

```text
.
├── medmnist_environment.yml  # Conda environment configuration
├── .gitignore                # Git ignore file
├── out.txt                   # Output file (e.g., logs, results)
├── sample.py                 # Model evaluation and sample generation
├── download_datasets.sh      # Script to download and prepare datasets
├── download_datasets.py      # Python script to download datasets using medmnist
├── common.py                 # Common functions and model definition
├── train.py                  # Model training script
├── print_code.py             # Utility script to print code files to console
├── figures/                  # Directory to store generated figures and animations
│   └── .gitignore
└── weights/                  # Directory to store model weights
    └── .gitignore
``` 
"""

print(readme_markdown_string)