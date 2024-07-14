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

# Define figures as global variables
true_images_fig, true_images_ax = plt.subplots(figsize=(5, 5))
measurements_fig, measurements_ax = plt.subplots(figsize=(5, 5))
reconstructions_fig, reconstructions_ax = plt.subplots(figsize=(5, 5))

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
        return measurement_simulator(images)
    else:
        raise ValueError(f"Unknown measurement simulator: {simulator_name}")

def sample_reconstructions(measurements, reconstructor_name):
    global diffusion_bridge_model
    if reconstructor_name == "Pseudoinverse Diffusion Bridge":
        if 'diffusion_bridge_model' not in globals():
            diffusion_bridge_model = get_diffusion_bridge_model(train=False)
            load_weights(diffusion_bridge_model, diffusion_backbone_weights_filename)
            diffusion_bridge_model.eval()

        reconstructions = []
        for measurement in measurements:
            with torch.no_grad():
                reconstruction = diffusion_bridge_model.image_reconstructor(measurement.unsqueeze(0), num_timesteps=32)
                reconstructions.append(reconstruction)
        return torch.cat(reconstructions)
    else:
        raise ValueError(f"Unknown reconstructor: {reconstructor_name}")

def plot_images(images, ax, title):
    ax.clear()
    ax.set_title(title)
    
    if images is None:
        if not ax.images:
            ax.text(0.5, 0.5, 'No Data', horizontalalignment='center', verticalalignment='center', transform=ax.transAxes)
    else:
        if ax.images:
            ax.images[0].set_data(images[0, 0])
        else:
            ax.imshow(images[0, 0], cmap='gray', vmin=-2, vmax=2)
    
    plt.close(ax.figure)

def update_images(dataset, measurement, reconstruction, enable_dataset, enable_measurement, enable_reconstruction):
    global true_images_global, measurements_global, reconstructions_global

    if enable_dataset and not enable_measurement:
        enable_reconstruction = False

    if enable_dataset:
        measurements_global = None
        reconstructions_global = None
        true_images_global = sample_images_from_dataset(dataset)
    if enable_measurement:
        reconstructions_global = None
        measurements_global = sample_measurements(true_images_global, measurement)
    if enable_reconstruction:
        reconstructions_global = sample_reconstructions(measurements_global, reconstruction)

    plot_images(true_images_global, true_images_ax, "True Images")
    plot_images(measurements_global, measurements_ax, "Measurements")
    plot_images(reconstructions_global, reconstructions_ax, "Reconstructions")

    return true_images_fig, measurements_fig, reconstructions_fig

def analysis(dataset, measurement, reconstruction):
    print(f"Performing analysis on {dataset} using {measurement} and {reconstruction}")
    return f"Performing analysis on {dataset} using {measurement} and {reconstruction}"

def update_timer_state(dataset_checked, measurement_checked, reconstruction_checked):
    timer_active = dataset_checked or measurement_checked or reconstruction_checked
    print(f"Timer active: {timer_active}")  # Debugging statement to check timer state
    return gr.update(active=timer_active)

print("Setting up Gradio components...")

title = gr.Markdown("# Medical Imaging Diffusion Model")

dataset_dropdown = gr.Dropdown(choices=datasets, label="Select Image Dataset", value=datasets[0])
measurement_dropdown = gr.Dropdown(choices=measurement_simulators, label="Select Measurement Model", value=measurement_simulators[0])
reconstruction_dropdown = gr.Dropdown(choices=image_reconstructors, label="Select Reconstruction Model", value=image_reconstructors[0])

dataset_gallery = gr.Plot(label="True Images")
measurement_gallery = gr.Plot(label="Simulated Measurements")
reconstruction_gallery = gr.Plot(label="Reconstruction Images")

analysis_text = gr.Textbox(label="Analysis")

sample_true_images_button = gr.Button("Sample True Images")
sample_measurements_button = gr.Button("Sample Measurements")
sample_reconstructions_button = gr.Button("Sample Reconstructions")

continuous_sampling_dataset_checkbox = gr.Checkbox(label="Enable Continuous Sampling of Dataset")
continuous_sampling_measurement_checkbox = gr.Checkbox(label="Enable Continuous Sampling of Measurements")
continuous_sampling_reconstruction_checkbox = gr.Checkbox(label="Enable Continuous Sampling of Reconstructions")

timer = gr.Timer(value=0.1, active=False)

print("Gradio components set up.")

# Create the layout
with gr.Blocks() as demo:
    title.render()
    with gr.Row():
        with gr.Column():
            gr.Markdown("### Dataset")
            dataset_dropdown.render()
            continuous_sampling_dataset_checkbox.render()
            sample_true_images_button.render()
            dataset_gallery.render()
        with gr.Column():
            gr.Markdown("### Measurements")
            measurement_dropdown.render()
            continuous_sampling_measurement_checkbox.render()
            sample_measurements_button.render()
            measurement_gallery.render()
        with gr.Column():
            gr.Markdown("### Reconstruction")
            reconstruction_dropdown.render()
            continuous_sampling_reconstruction_checkbox.render()
            sample_reconstructions_button.render()
            reconstruction_gallery.render()
    analysis_text.render()
    timer.render()

    # Set up callbacks
    dataset_dropdown.change(update_images, [dataset_dropdown, measurement_dropdown, reconstruction_dropdown, continuous_sampling_dataset_checkbox, continuous_sampling_measurement_checkbox, continuous_sampling_reconstruction_checkbox], [dataset_gallery, measurement_gallery, reconstruction_gallery])
    measurement_dropdown.change(update_images, [dataset_dropdown, measurement_dropdown, reconstruction_dropdown, continuous_sampling_dataset_checkbox, continuous_sampling_measurement_checkbox, continuous_sampling_reconstruction_checkbox], [dataset_gallery, measurement_gallery, reconstruction_gallery])
    reconstruction_dropdown.change(update_images, [dataset_dropdown, measurement_dropdown, reconstruction_dropdown, continuous_sampling_dataset_checkbox, continuous_sampling_measurement_checkbox, continuous_sampling_reconstruction_checkbox], [dataset_gallery, measurement_gallery, reconstruction_gallery])

    dataset_dropdown.change(analysis, [dataset_dropdown, measurement_dropdown, reconstruction_dropdown], analysis_text)
    measurement_dropdown.change(analysis, [dataset_dropdown, measurement_dropdown, reconstruction_dropdown], analysis_text)
    reconstruction_dropdown.change(analysis, [dataset_dropdown, measurement_dropdown, reconstruction_dropdown], analysis_text)

    sample_true_images_button.click(lambda x,y,z: update_images(x,y,z,True, False, False), [dataset_dropdown, measurement_dropdown, reconstruction_dropdown], [dataset_gallery, measurement_gallery, reconstruction_gallery])
    sample_measurements_button.click(lambda x,y,z: update_images(x,y,z,False, True, False), [dataset_dropdown, measurement_dropdown, reconstruction_dropdown], [dataset_gallery, measurement_gallery, reconstruction_gallery])
    sample_reconstructions_button.click(lambda x,y,z: update_images(x,y,z,False, False, True), [dataset_dropdown, measurement_dropdown, reconstruction_dropdown], [dataset_gallery, measurement_gallery, reconstruction_gallery])

    timer.tick(
        update_images,
        inputs=[dataset_dropdown, measurement_dropdown, reconstruction_dropdown, continuous_sampling_dataset_checkbox, continuous_sampling_measurement_checkbox, continuous_sampling_reconstruction_checkbox],
        outputs=[dataset_gallery, measurement_gallery, reconstruction_gallery]
    )

    continuous_sampling_dataset_checkbox.change(
        update_timer_state, 
        [continuous_sampling_dataset_checkbox, continuous_sampling_measurement_checkbox, continuous_sampling_reconstruction_checkbox], 
        [timer]
    )
    continuous_sampling_measurement_checkbox.change(
        update_timer_state, 
        [continuous_sampling_dataset_checkbox, continuous_sampling_measurement_checkbox, continuous_sampling_reconstruction_checkbox], 
        [timer]
    )
    continuous_sampling_reconstruction_checkbox.change(
        update_timer_state, 
        [continuous_sampling_dataset_checkbox, continuous_sampling_measurement_checkbox, continuous_sampling_reconstruction_checkbox], 
        [timer]
    )

print("Launching Gradio app...")

demo.launch(server_name="0.0.0.0", server_port=7860, share=True)