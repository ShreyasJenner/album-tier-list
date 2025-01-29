// Function to upload images and render them in the upload area
document.getElementById('file-input').addEventListener('change', function (event) {
    const files = event.target.files;
    const uploadedImagesContainer = document.getElementById('uploaded-images');
    const existingImageNames = new Set();

    // Collect all existing image names from uploaded area and tiers
    document.querySelectorAll('.uploaded-image').forEach(img => {
        existingImageNames.add(img.alt); // Use 'alt' as the unique identifier (file name)
    });

    for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Check if the image already exists
        if (existingImageNames.has(file.name)) {
            console.warn(`Duplicate image skipped: ${file.name}`);
            continue; // Skip duplicates
        }

        const reader = new FileReader();

        reader.onload = function (e) {
            const imgContainer = document.createElement('div');
            imgContainer.classList.add('image-container');

            const img = document.createElement('img');
            img.src = e.target.result;
            img.alt = file.name; // Use file name as unique identifier
            img.draggable = true;
            img.id = `uploaded-img-${Date.now()}-${i}`; // Unique ID for each uploaded image
            img.ondragstart = drag;
            img.classList.add('uploaded-image');

            const tooltip = document.createElement('span');
            tooltip.classList.add('tooltip');
            tooltip.textContent = file.name; // Set the file name as the tooltip text

            const removeButton = document.createElement('button');
            removeButton.classList.add('remove-button');
            removeButton.textContent = 'X';
            removeButton.onclick = function () {
                imgContainer.remove(); // Remove the image container when the button is clicked
            };

            imgContainer.appendChild(img);
            imgContainer.appendChild(tooltip);
            imgContainer.appendChild(removeButton);
            uploadedImagesContainer.appendChild(imgContainer);
        };

        reader.readAsDataURL(file);

        // Add the file name to the set to track it as existing
        existingImageNames.add(file.name);
    }
});

// Search functionality
document.getElementById('search-input').addEventListener('input', function (e) {
    const searchTerm = e.target.value.toLowerCase(); // Get the search term
    const images = document.querySelectorAll('.uploaded-image'); // Get all uploaded images

    images.forEach(img => {
        const fileName = img.alt.toLowerCase(); // Get the file name from the 'alt' attribute
        const imageContainer = img.parentElement; // Get the parent container of the image

        // Show or hide the image based on whether the file name matches the search term
        if (fileName.includes(searchTerm)) {
            imageContainer.style.display = 'inline-block'; // Show the image
        } else {
            imageContainer.style.display = 'none'; // Hide the image
        }
    });
});

// Drag and drop functions
function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.id);
}

function drop(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData("text");
    const draggedElement = document.getElementById(data);
    const dropZone = event.target;

    // Ensure the drop target is the drop-zone
    if (dropZone.classList.contains('drop-zone')) {
        // Check if the dragged element already has a container (to avoid duplication)
        let container = draggedElement.parentElement;
        if (!container.classList.contains('image-container')) {
            // Create a container div for the image
            container = document.createElement('div');
            container.classList.add('image-container');

            // Add the dragged element (image) to the container
            container.appendChild(draggedElement);

            // Add tooltip with file name
            const tooltip = document.createElement('span');
            tooltip.classList.add('tooltip');
            tooltip.textContent = draggedElement.getAttribute('alt') || "Uploaded Image";
            container.appendChild(tooltip);

            // Add remove button
            const removeButton = document.createElement('button');
            removeButton.classList.add('remove-button');
            removeButton.textContent = 'X';
            removeButton.onclick = function () {
                container.remove(); // Remove the container
            };
            container.appendChild(removeButton);
        }

        // Append the container to the drop zone
        dropZone.appendChild(container);
    }
}

// Save and load configuration functions (unchanged)
document.getElementById('save-config').addEventListener('click', function () {
    const tiers = document.querySelectorAll('.tier');
    const config = {};

    tiers.forEach(tier => {
        const tierId = tier.id;
        const dropZone = tier.querySelector('.drop-zone');
        const images = dropZone.querySelectorAll('.uploaded-image'); // Ensure class is correct for images
        
        // Collect image data dynamically
        config[tierId] = Array.from(images).map(img => ({
            src: img.src,
            id: img.id,
            alt: img.alt,
            tooltip: img.nextElementSibling?.textContent || "" // Ensure tooltip text is captured
        }));
    });

    const configJson = JSON.stringify(config, null, 2);
    const blob = new Blob([configJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'tier-config.json';
    a.click();
    URL.revokeObjectURL(url);
});

document.getElementById('load-config').addEventListener('click', function () {
    document.getElementById('config-file-input').click();
});

document.getElementById('config-file-input').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const config = JSON.parse(e.target.result);
        const tiers = document.querySelectorAll('.tier');

        // Clear existing images from tiers
        tiers.forEach(tier => {
            tier.querySelector('.drop-zone').innerHTML = '';
        });

        // Load images into tiers based on the configuration
        for (const [tierId, images] of Object.entries(config)) {
            const tier = document.getElementById(tierId);
            if (!tier) continue;

            const dropZone = tier.querySelector('.drop-zone');
            images.forEach(imageData => {
                const imgContainer = document.createElement('div');
                imgContainer.classList.add('image-container');

                const img = document.createElement('img');
                img.src = imageData.src;
                img.alt = imageData.alt;
                img.draggable = true;
                img.id = imageData.id;
                img.ondragstart = drag;
                img.classList.add('uploaded-image');

                const tooltip = document.createElement('span');
                tooltip.classList.add('tooltip');
                tooltip.textContent = imageData.tooltip;

                const removeButton = document.createElement('button');
                removeButton.classList.add('remove-button');
                removeButton.textContent = 'X';
                removeButton.onclick = function () {
                    imgContainer.remove();
                };

                imgContainer.appendChild(img);
                imgContainer.appendChild(tooltip);
                imgContainer.appendChild(removeButton);
                dropZone.appendChild(imgContainer);
            });
        }
    };

    reader.readAsText(file);
});
