import gradio as gr
import torch
import matplotlib.pyplot as plt
from common import get_diffusion_bridge_model, load_weights

# Sample data for dropdown menus
datasets = ["Dataset 1", "Dataset 2", "Dataset 3"]
models = ["Model 1", "Model 2", "Model 3"]

# Load the model and data (Dummy data for illustration)
diffusion_bridge_model = get_diffusion_bridge_model(train=False)
load_weights(diffusion_bridge_model, 'weights/diffusion_backbone_weights.pth')

num_images = 16
true_images = torch.rand(num_images, 1, 28, 28)
measurements = torch.rand(num_images, 1, 28, 28)
reconstructions = torch.rand(num_images, 1, 28, 28)

def update_images(dataset, model):
    # For the sake of this example, we're using dummy data
    selected_images = true_images[:4]
    selected_measurements = measurements[:4]
    selected_reconstructions = reconstructions[:4]
    
    fig, axs = plt.subplots(1, 3, figsize=(15, 5))
    for ax, img_set, title in zip(axs, [selected_images, selected_measurements, selected_reconstructions], ["Dataset", "Measurement", "Reconstruction"]):
        ax.imshow(img_set[0, 0], cmap='gray', vmin=0, vmax=1)
        ax.set_title(title)
    plt.close(fig)
    return fig

def analysis(dataset, model):
    return f"Performing analysis on {dataset} using {model}"

title = gr.Markdown("# Medical Imaging Diffusion Model")

dataset_dropdown = gr.Dropdown(choices=datasets, label="Select Dataset")
model_dropdown = gr.Dropdown(choices=models, label="Select Model")

image_gallery = gr.Plot(label="Images")

analysis_text = gr.Textbox(label="Analysis")

# Create the layout
with gr.Blocks() as demo:
    title.render()
    with gr.Row():
        with gr.Column():
            gr.Markdown("### Dataset")
            dataset_dropdown.render()
            image_gallery.render()
        with gr.Column():
            gr.Markdown("### Measurements")
            model_dropdown.render()
            image_gallery.render()
        with gr.Column():
            gr.Markdown("### Reconstruction")
            model_dropdown.render()
            image_gallery.render()
    analysis_text.render()

    # Set up callbacks
    dataset_dropdown.change(update_images, [dataset_dropdown, model_dropdown], image_gallery)
    model_dropdown.change(update_images, [dataset_dropdown, model_dropdown], image_gallery)
    dataset_dropdown.change(analysis, [dataset_dropdown, model_dropdown], analysis_text)
    model_dropdown.change(analysis, [dataset_dropdown, model_dropdown], analysis_text)

demo.launch()