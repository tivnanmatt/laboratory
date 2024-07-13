# Use the official NVIDIA CUDA image with Ubuntu as a base
FROM nvidia/cuda:12.1.1-devel-ubuntu22.04

# Set DEBIAN_FRONTEND to noninteractive to avoid prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

# Install necessary system packages including Python 3.10 and pip
RUN apt-get update && apt-get install -y wget git libgl1-mesa-glx gnupg software-properties-common ffmpeg \
    python3.10 python3.10-venv python3.10-dev python3-pip

# Set python3.10 as the default python
RUN update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.10 1 && \
    update-alternatives --install /usr/bin/pip3 pip3 /usr/bin/pip3.10 1

# Create a virtual environment named "laboratory"
RUN python3 -m venv /venv/laboratory

# Activate the virtual environment and install necessary Python packages
RUN /venv/laboratory/bin/pip install --upgrade pip && \
    /venv/laboratory/bin/pip install torch torchvision torchaudio pyyaml matplotlib scipy numpy cmake>=3.23 ffmpeg

# Copy the laboratory directory to the container
WORKDIR /opt
RUN git clone https://github.com/tivnanmatt/laboratory.git
WORKDIR /opt/laboratory/python/
RUN /venv/laboratory/bin/pip install -v .
WORKDIR /home

# Copy the startup script
COPY startup.sh /usr/local/bin/startup.sh

# Ensure the startup script is executable
RUN chmod +x /usr/local/bin/startup.sh

# Set the path to include the virtual environment bin directory
ENV PATH=/venv/laboratory/bin:$PATH

# Run the startup script
CMD ["/bin/bash", "/usr/local/bin/startup.sh"]