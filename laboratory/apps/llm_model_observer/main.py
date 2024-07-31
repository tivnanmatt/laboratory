import os
import openai
import base64
import numpy as np
from PIL import Image, ImageDraw, ImageFont
import matplotlib.pyplot as plt
import tempfile

# Load the API key from a file
with open("openai_api_key.txt", "r") as f:
    api_key = f.read().strip()

# Instantiate the OpenAI client
client = openai.Client(api_key=api_key)

# Mission statement
MISSION_STATEMENT = """
This app is a virtual assistant for research, designed to generate radiology reports from medical images. It uses GPT-4 Vision capabilities for detailed image analysis and report generation.
"""

TEMPERATURE = 0.5
MAX_TOKENS = 1000
FREQUENCY_PENALTY = 0
PRESENCE_PENALTY = 0.6

def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

def add_noise(image, noise_std):
    noise = np.random.normal(0, noise_std, image.shape)
    noisy_image = image + noise
    return np.clip(noisy_image, 0, 1)

def generate_radiology_report(image_array):
    with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as temp_file:
        temp_image_path = temp_file.name
        Image.fromarray((image_array * 255).astype(np.uint8)).save(temp_image_path)

    base64_image = encode_image(temp_image_path)
    
    messages = [
        {"role": "system", "content": MISSION_STATEMENT},
        {"role": "user", "content": [
            {"type": "text", "text": "Please generate a radiology report for the following image. Even if it is very noisy, I need you to do your best to describe the radiology report details:"},
            {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{base64_image}"}}
        ]}
    ]
    
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
        temperature=TEMPERATURE,
        max_tokens=MAX_TOKENS,
        top_p=1,
        frequency_penalty=FREQUENCY_PENALTY,
        presence_penalty=PRESENCE_PENALTY,
    )

    os.remove(temp_image_path)  # Clean up the temporary file
    return response.choices[0].message.content.strip()

def radiology_report_evaluator(reference_report, estimated_report):
    evaluation_prompt = f"""
    Please evaluate the similarity between the following two radiology reports for clinical decision making purposes, and give a numerical value for similarity on a scale from 0 to 100:
    
    Reference Radiology Report:
    {reference_report}
    
    Estimated Radiology Report:
    {estimated_report}
    
    Provide only the numerical similarity score.
    """
    
    messages = [
        {"role": "system", "content": MISSION_STATEMENT},
        {"role": "user", "content": evaluation_prompt}
    ]
    
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=messages,
        temperature=TEMPERATURE,
        max_tokens=10,
        top_p=1,
        frequency_penalty=FREQUENCY_PENALTY,
        presence_penalty=PRESENCE_PENALTY,
    )

    return float(response.choices[0].message.content.strip())

def create_image_report_plot(noisy_image, report, noise_level, similarity_score, output_path):
    fig = plt.figure(figsize=(18, 6))
    
    ax1 = fig.add_axes([0.05, 0.1, 0.4, 0.8])
    ax1.imshow(noisy_image, cmap='gray')
    ax1.axis('off')
    
    # Create an image with the report text
    report_img = Image.new('RGB', (800, 512), color=(255, 255, 255))
    draw = ImageDraw.Draw(report_img)
    try:
        font = ImageFont.truetype("arial.ttf", 15)
    except IOError:
        font = ImageFont.load_default()
    draw.text((10, 10), report, fill=(0, 0, 0), font=font)
    
    # Convert to numpy array and plot on the right side
    report_array = np.array(report_img)
    ax2 = fig.add_axes([0.5, 0.1, 0.45, 0.8])
    ax2.imshow(report_array)
    ax2.axis('off')
    
    fig.suptitle(f'Noise Level: {noise_level:.2f}, Similarity Score: {similarity_score:.2f}', fontsize=16)
    plt.savefig(output_path)
    plt.close(fig)

def main():
    # Load original image from ct_example.png as a black and white image
    original_image = np.array(Image.open("ct_example.png").convert("L")) / 255.0

    reference_report = generate_radiology_report(original_image)
    
    noise_levels = np.linspace(0, 1.0, 101)
    similarity_scores = []

    for noise_std in noise_levels:
        noisy_image = add_noise(original_image, noise_std)
        estimated_report = generate_radiology_report(noisy_image)
        similarity_score = radiology_report_evaluator(reference_report, estimated_report)
        similarity_scores.append(similarity_score)
        print(f"Noise Level: {noise_std}, Similarity Score: {similarity_score}")

        output_path = f'noise_{noise_std:.2f}_report.png'
        create_image_report_plot(noisy_image, estimated_report, noise_std, similarity_score, output_path)

    plt.plot(noise_levels, similarity_scores)
    plt.xlabel('Noise Level')
    plt.ylabel('Report Similarity Score')
    plt.title('Report Similarity Score vs Noise Level')
    plt.grid(True)
    plt.savefig('similarity_scores.png')
    plt.show()

if __name__ == "__main__":
    main()