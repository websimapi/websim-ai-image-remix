document.addEventListener('DOMContentLoaded', () => {
    const imageUpload = document.getElementById('image-upload');
    const imagePreview = document.getElementById('image-preview');
    const previewText = document.getElementById('preview-text');
    const promptInput = document.getElementById('prompt-input');
    const generateBtn = document.getElementById('generate-btn');
    const resultImage = document.getElementById('result-image');
    const loader = document.getElementById('loader');
    const resultPlaceholder = document.getElementById('result-placeholder');
    const uploadLabel = document.querySelector('.upload-label');

    let uploadedImageDataUrl = null;

    function handleImageFile(file) {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                uploadedImageDataUrl = e.target.result;
                imagePreview.src = uploadedImageDataUrl;
                imagePreview.style.display = 'block';
                previewText.style.display = 'none';
            };
            reader.readAsDataURL(file);
        }
    }

    uploadLabel.addEventListener('click', (e) => {
        // This is just to trigger the hidden file input.
        // The 'for' attribute on the label already handles this.
    });

    imageUpload.addEventListener('change', (event) => {
        const file = event.target.files[0];
        handleImageFile(file);
    });
    
    document.addEventListener('paste', (event) => {
        const items = (event.clipboardData || window.clipboardData).items;
        let imageFile = null;
        for (const item of items) {
            if (item.type.startsWith('image/')) {
                imageFile = item.getAsFile();
                break;
            }
        }

        if (imageFile) {
            event.preventDefault();
            handleImageFile(imageFile);
        }
    });

    generateBtn.addEventListener('click', async () => {
        if (!uploadedImageDataUrl) {
            alert('Please upload an image first.');
            return;
        }
        const prompt = promptInput.value.trim();
        if (!prompt) {
            alert('Please enter a prompt describing the changes.');
            return;
        }

        loader.classList.remove('hidden');
        resultImage.style.display = 'none';
        resultPlaceholder.style.display = 'none';
        generateBtn.disabled = true;
        generateBtn.textContent = 'Generating...';

        try {
            const result = await websim.imageGen({
                prompt: prompt,
                image_inputs: [
                    {
                        url: uploadedImageDataUrl,
                    },
                ],
            });

            if (result && result.url) {
                resultImage.src = result.url;
                resultImage.style.display = 'block';
            } else {
                throw new Error('Image generation failed to return a URL.');
            }

        } catch (error) {
            console.error('Error generating image:', error);
            alert('An error occurred while generating the image. Please check the console and try again.');
            resultPlaceholder.style.display = 'block';
        } finally {
            loader.classList.add('hidden');
            generateBtn.disabled = false;
            generateBtn.textContent = 'Generate Image';
        }
    });
});