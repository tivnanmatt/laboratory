# Use the official NVIDIA CUDA image with Conda pre-installed as a base
FROM nvidia/cuda:12.1.1-devel-ubuntu22.04

# Install necessary system packages
RUN apt-get update && apt-get install -y wget git libgl1-mesa-glx gnupg software-properties-common ffmpeg

# Download and install Miniconda
RUN wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -O miniconda.sh && \
    bash miniconda.sh -b -p /miniconda && \
    rm miniconda.sh

# Set the path to include the Conda bin directory
ENV PATH /miniconda/bin:$PATH

# Initialize Conda in bash (not necessary for activation, but can be useful for other purposes)
RUN conda init bash

# Initialize the conda environment
COPY environment.yml /environment.yml
RUN conda env create --name "laboratory" -f environment.yml

# Activate the conda environment for interactive shell sessions
SHELL ["conda", "run", "-n", "laboratory", "/bin/bash", "-c"]

# Install LEAP: a GPU-compatible CT forward projector
WORKDIR /opt
RUN git clone https://github.com/LLNL/LEAP.git
WORKDIR /opt/LEAP
RUN pip install -v .
WORKDIR /

# Copy the laboratory directory to the container
WORKDIR /opt
RUN git clone https://github.com/tivnanmatt/laboratory.git
WORKDIR /opt/laboratory/python/
RUN pip install -v .
WORKDIR /home

# Ensure the run.sh script is executable
RUN chmod +x /opt/laboratory/python/apps/article_writer/run.sh

# Expose port 5000
EXPOSE 5000

# Run the article writer app on port 5000 and keep the container running
WORKDIR /opt/laboratory/python/apps/article_writer/
RUN nohup ./run.sh --port 5000 &
CMD ["tail", "-f", "/dev/null"]