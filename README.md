# Laboratory: Re-Usable Python Classes for Medical Image Reconstruction

## Motivation

This project is focused on creating re-usable Python classes that represent mathematical models used in medical image reconstruction. These classes and methods facilitate research and development in medical imaging, particularly in tasks such as diffusion modeling, stochastic differential equations, Fourier transforms, and image reconstruction.

## Installation

### Local Installation (Conda Environment)

To install the necessary dependencies and set up the environment locally:

1. Clone the repository:
    ```bash
    git clone https://github.com/username/laboratory.git
    cd laboratory
    ```

2. Create and activate the Conda environment:
    ```bash
    conda env create --name laboratory --file environment.yml
    conda activate laboratory
    ```

3. Install additional dependencies:
    ```bash
    pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu124
    ```

### Docker Installation

To run the project using Docker:

1. Build the Docker image:
    ```bash
    docker build -t laboratory .
    ```

2. Run the Docker container:
    ```bash
    docker run -it --rm laboratory
    ```

## Directory Structure

The repository is organized as follows:

```
.
├── cli.py                         # Command-line interface script for the project
├── Dockerfile                     # Dockerfile for containerizing the project
├── environment.yml                # Conda environment configuration file
├── env_setup.sh                   # Script to set up the environment
├── main.py                        # Main script to run the project
├── print_code.py                  # Script to print the directory structure and code contents
├── print_readme.py                # Script to generate this README file
├── README.md                      # Project README file
├── setup.py                       # Setup script for the project
├── startup.sh                     # Script for starting services in Docker
├── laboratory/                    # Core directory containing the project modules
│   ├── __init__.py                # Initialization script for the laboratory package
│   ├── apps/                      # Applications using the core modules
│   │   ├── article_writer/        # Application for writing articles
│   │   │   ├── app.py             # Main application script
│   │   │   ├── forms.py           # Form handling logic
│   │   │   ├── models.py          # Data models for the application
│   │   │   ├── run.sh             # Script to run the article writer app
│   │   │   ├── static/            # Static files like CSS
│   │   │   │   ├── styles.css     # Stylesheet for the article writer app
│   │   │   ├── templates/         # HTML templates
│   │   │   │   ├── article.html   # Template for individual articles
│   │   │   │   ├── index.html     # Template for the index page
│   │   ├── llm_model_observer/    # Application for observing language model outputs
│   │   │   ├── main.py            # Main application script
│   │   │   ├── openai_api_key.txt # File containing OpenAI API key
│   │   │   ├── figures/           # Directory for storing generated figures
│   │   │   │   ├── out.txt        # Example output text
│   │   ├── research_assistant/    # Application for assisting in research tasks
│   │   │   ├── main.py            # Main application script
│   ├── torch/                     # Directory for PyTorch-related modules
│   │   ├── __init__.py            # Initialization script for torch package
│   │   ├── datasets/              # Modules for handling datasets
│   │   │   ├── __init__.py        # Initialization script for datasets
│   │   ├── diffusion/             # Diffusion model implementations
│   │   │   ├── core.py            # Core diffusion logic
│   │   │   ├── sde.py             # Stochastic differential equations for diffusion
│   │   │   ├── unconditional.py   # Unconditional diffusion models
│   │   ├── distributions/         # Modules for probability distributions
│   │   │   ├── core.py            # Core logic for distributions
│   │   │   ├── dataset.py         # Dataset management for distributions
│   │   │   ├── gaussian.py        # Gaussian distribution implementations
│   │   ├── linalg/                # Linear algebra modules
│   │   │   ├── core.py            # Core linear algebra operations
│   │   │   ├── fourier.py         # Fourier transforms and related operations
│   │   │   ├── interp.py          # Interpolation methods
│   │   ├── networks/              # Neural network implementations
│   │   │   ├── densenet.py        # DenseNet model
│   │   │   ├── diffusers_unet_2D.py # U-Net model for diffusion tasks
│   ├── samplers/                  # Samplers for various distributions
│   │   ├── core.py                # Core sampling logic
│   │   └── __init__.py            # Initialization script for samplers
└── docker-compose.yml             # Docker Compose configuration file
```

## Usage

### Command-Line Interface

The `cli.py` script provides a command-line interface for interacting with the project. Run it with:

```bash
python cli.py
```

### Torch Modules

The core mathematical models and neural networks are implemented in the `laboratory/torch` directory. These include classes for handling datasets, diffusion models, probability distributions, linear algebra operations, and neural network architectures.

## Contributing

Contributions to this project are welcome. Please open an issue or submit a pull request with your proposed changes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.
