// script.js
document.getElementById('file-input').addEventListener('change', function (event) {
    const files = event.target.files;
    const uploadedImagesContainer = document.getElementById('uploaded-images');

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();

        reader.onload = function (e) {
            const imgContainer = document.createElement('div');
            imgContainer.classList.add('image-container');

            const img = document.createElement('img');
            img.src = e.target.result;
            img.alt = "Uploaded Image";
            img.draggable = true;
            img.id = `uploaded-img-${i}`;
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
    }
});

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
        dropZone.appendChild(draggedElement);
    }
}
