import gradio as gr
import torch
import matplotlib.pyplot as plt
import matplotlib
from common import (
    get_diffusion_bridge_model,
    load_weights,
    get_measurement_simulator,
    get_image_reconstructor,
    get_image_dataset
)
import time

# Ensure Matplotlib uses the 'Agg' backend
matplotlib.use('Agg')

# Sample data for dropdown menus
datasets = ["Medmnist_OrganA"]
measurement_simulators = ["Additive White Gaussian Noise"]
image_reconstructors = ["Pseudoinverse Diffusion Bridge"]

# Initialize variables
print("Loading model and data...")
diffusion_backbone_weights_filename = 'weights/diffusion_backbone_weights.pth'

num_images = 1

# Global variables to hold images, measurements, and reconstructions
true_images_global = None
measurements_global = None
reconstructions_global = None

print("Model and data loaded.")

def sample_images_from_dataset(dataset_name):
    if dataset_name == "Medmnist_OrganA":
        image_dataset = get_image_dataset(train=False)
        indices = torch.randint(0, len(image_dataset), (num_images,))
        sampled_images = torch.stack([image_dataset[i][0] for i in indices])
        return sampled_images
    else:
        raise ValueError(f"Unknown dataset: {dataset_name}")

def sample_measurements(images, simulator_name):
    if simulator_name == "Additive White Gaussian Noise":
        measurement_simulator = get_measurement_simulator()
        print("DEBUG: images.shape=", images.shape)
        return measurement_simulator(images)
    else:
        raise ValueError(f"Unknown measurement simulator: {simulator_name}")

def sample_reconstructions(measurements, reconstructor_name):
    if reconstructor_name == "Pseudoinverse Diffusion Bridge":
        # Get the model
        diffusion_bridge_model = get_diffusion_bridge_model(train=False)

        # Load pre-trained weights
        load_weights(diffusion_bridge_model, diffusion_backbone_weights_filename)

        # Set the model to evaluation mode
        diffusion_bridge_model.eval()

        reconstructions = []
        print("DEBUG: images.shape=", measurements.shape)
        for measurement in measurements:
            with torch.no_grad():
                start_time = time.time()
                reconstruction = diffusion_bridge_model.image_reconstructor(measurement.unsqueeze(0), num_timesteps=32)
                end_time = time.time()
                print(f"Reconstruction time for one measurement: {end_time - start_time} seconds")
                reconstructions.append(reconstruction)
        return torch.cat(reconstructions)
    else:
        raise ValueError(f"Unknown reconstructor: {reconstructor_name}")

def plot_images(images, title):
    start_time = time.time()
    fig, ax = plt.subplots(figsize=(5, 5))
    ax.imshow(images[0, 0], cmap='gray', vmin=-2, vmax=2)
    ax.set_title(title)
    plt.close(fig)
    end_time = time.time()
    print(f"Plotting time: {end_time - start_time} seconds")
    return fig

def update_images(dataset, measurement, reconstruction):
    global true_images_global, measurements_global, reconstructions_global
    print(f"Updating images for dataset: {dataset}, measurement: {measurement}, reconstruction: {reconstruction}")

    start_time = time.time()
    true_images_global = sample_images_from_dataset(dataset)
    end_time = time.time()
    print(f"Time to sample images: {end_time - start_time} seconds")

    start_time = time.time()
    measurements_global = sample_measurements(true_images_global, measurement)
    end_time = time.time()
    print(f"Time to sample measurements: {end_time - start_time} seconds")

    start_time = time.time()
    reconstructions_global = sample_reconstructions(measurements_global, reconstruction)
    end_time = time.time()
    print(f"Time to sample reconstructions: {end_time - start_time} seconds")

    true_images_fig = plot_images(true_images_global[:4], "True Images")
    measurements_fig = plot_images(measurements_global[:4], "Measurements")
    reconstructions_fig = plot_images(reconstructions_global[:4], "Reconstructions")

    print(f"Images updated for dataset: {dataset}, measurement: {measurement}, reconstruction: {reconstruction}")
    return true_images_fig, measurements_fig, reconstructions_fig

def update_true_images():
    global true_images_global, measurements_global, reconstructions_global
    print("Updating true images")
    
    start_time = time.time()
    true_images_global = sample_images_from_dataset(datasets[0])  # Assuming only one dataset option
    end_time = time.time()
    print(f"Time to sample true images: {end_time - start_time} seconds")
    
    start_time = time.time()
    measurements_global = sample_measurements(true_images_global, measurement_simulators[0])  # Assuming only one simulator option
    end_time = time.time()
    print(f"Time to sample measurements: {end_time - start_time} seconds")
    
    start_time = time.time()
    reconstructions_global = sample_reconstructions(measurements_global, image_reconstructors[0])  # Assuming only one reconstructor option
    end_time = time.time()
    print(f"Time to sample reconstructions: {end_time - start_time} seconds")

    true_images_fig = plot_images(true_images_global[:4], "True Images")
    measurements_fig = plot_images(measurements_global[:4], "Measurements")
    reconstructions_fig = plot_images(reconstructions_global[:4], "Reconstructions")

    return true_images_fig, measurements_fig, reconstructions_fig

def update_measurements():
    global measurements_global, reconstructions_global
    print("Updating measurements")

    start_time = time.time()
    measurements_global = sample_measurements(true_images_global, measurement_simulators[0])  # Assuming only one simulator option
    end_time = time.time()
    print(f"Time to sample measurements: {end_time - start_time} seconds")

    start_time = time.time()
    reconstructions_global = sample_reconstructions(measurements_global, image_reconstructors[0])  # Assuming only one reconstructor option
    end_time = time.time()
    print(f"Time to sample reconstructions: {end_time - start_time} seconds")

    measurements_fig = plot_images(measurements_global[:4], "Measurements")
    reconstructions_fig = plot_images(reconstructions_global[:4], "Reconstructions")

    return measurements_fig, reconstructions_fig

def update_reconstructions():
    global reconstructions_global
    print("Updating reconstructions")

    start_time = time.time()
    reconstructions_global = sample_reconstructions(measurements_global, image_reconstructors[0])  # Assuming only one reconstructor option
    end_time = time.time()
    print(f"Time to sample reconstructions: {end_time - start_time} seconds")

    reconstructions_fig = plot_images(reconstructions_global[:4], "Reconstructions")
    return reconstructions_fig

def analysis(dataset, measurement, reconstruction):
    print(f"Performing analysis on {dataset} using {measurement} and {reconstruction}")
    return f"Performing analysis on {dataset} using {measurement} and {reconstruction}"

print("Setting up Gradio components...")

title = gr.Markdown("# Medical Imaging Diffusion Model")

dataset_dropdown = gr.Dropdown(choices=datasets, label="Select Image Dataset")
measurement_dropdown = gr.Dropdown(choices=measurement_simulators, label="Select Measurement Model")
reconstruction_dropdown = gr.Dropdown(choices=image_reconstructors, label="Select Reconstruction Model")

dataset_gallery = gr.Plot(label="True Images")
measurement_gallery = gr.Plot(label="Simulated Measurements")
reconstruction_gallery = gr.Plot(label="Reconstruction Images")

analysis_text = gr.Textbox(label="Analysis")

sample_true_images_button = gr.Button("Sample True Images")
sample_measurements_button = gr.Button("Sample Measurements")
sample_reconstructions_button = gr.Button("Sample Reconstructions")

print("Gradio components set up.")

# Create the layout
with gr.Blocks() as demo:
    title.render()
    with gr.Row():
        with gr.Column():
            gr.Markdown("### Dataset")
            dataset_dropdown.render()
            sample_true_images_button.render()
            dataset_gallery.render()
        with gr.Column():
            gr.Markdown("### Measurements")
            measurement_dropdown.render()
            sample_measurements_button.render()
            measurement_gallery.render()
        with gr.Column():
            gr.Markdown("### Reconstruction")
            reconstruction_dropdown.render()
            sample_reconstructions_button.render()
            reconstruction_gallery.render()
    analysis_text.render()

    # Set up callbacks
    dataset_dropdown.change(update_images, [dataset_dropdown, measurement_dropdown, reconstruction_dropdown], [dataset_gallery, measurement_gallery, reconstruction_gallery])
    measurement_dropdown.change(update_images, [dataset_dropdown, measurement_dropdown, reconstruction_dropdown], [dataset_gallery, measurement_gallery, reconstruction_gallery])
    reconstruction_dropdown.change(update_images, [dataset_dropdown, measurement_dropdown, reconstruction_dropdown], [dataset_gallery, measurement_gallery, reconstruction_gallery])

    dataset_dropdown.change(analysis, [dataset_dropdown, measurement_dropdown, reconstruction_dropdown], analysis_text)
    measurement_dropdown.change(analysis, [dataset_dropdown, measurement_dropdown, reconstruction_dropdown], analysis_text)
    reconstruction_dropdown.change(analysis, [dataset_dropdown, measurement_dropdown, reconstruction_dropdown], analysis_text)

    sample_true_images_button.click(update_true_images, [], [dataset_gallery, measurement_gallery, reconstruction_gallery])
    sample_measurements_button.click(update_measurements, [], [measurement_gallery, reconstruction_gallery])
    sample_reconstructions_button.click(update_reconstructions, [], reconstruction_gallery)

print("Launching Gradio app...")

demo.launch(server_name="0.0.0.0", server_port=7860)