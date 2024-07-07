# Use the official NVIDIA CUDA image with Conda pre-installed as a base
FROM nvidia/cuda:12.1.1-devel-ubuntu22.04

# Install necessary system packages
RUN apt-get update && apt-get install -y wget git libgl1-mesa-glx gnupg software-properties-common ffmpeg \
    nginx mariadb-server php-fpm php-mysql unzip

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
# RUN chmod +x /opt/laboratory/python/apps/article_writer/run.sh

# Copy WordPress and Nginx configuration files
COPY project_root/wordpress /var/www/html
COPY project_root/docker/nginx/wordpress /etc/nginx/sites-available/wordpress
COPY project_root/docker/init.sql /docker-entrypoint-initdb.d/
COPY project_root/docker/startup.sh /opt/startup.sh

# Set permissions for WordPress files
RUN chown -R www-data:www-data /var/www/html && \
    chmod -R 755 /var/www/html

# Enable the Nginx site configuration
RUN ln -s /etc/nginx/sites-available/wordpress /etc/nginx/sites-enabled/

# Expose port 5000 for your app and port 80 for Nginx
# EXPOSE 5000 80
EXPOSE 80

# Run the startup script
CMD ["/bin/bash", "/opt/startup.sh"]