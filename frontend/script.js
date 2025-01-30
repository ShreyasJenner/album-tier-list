document.addEventListener("DOMContentLoaded", function () {
    const fileInput = document.getElementById("file-input");
    const uploadedImages = document.getElementById("uploaded-images");
    const loadConfigButton = document.getElementById("load-config");
    const saveConfigButton = document.getElementById("save-config");
    const configFileInput = document.getElementById("config-file-input");
    const searchInput = document.getElementById("search-input");
    let selectedImages = new Set();
    let uploadedImageMap = new Map();

    // Add click handler for load button
    loadConfigButton.addEventListener("click", function() {
        configFileInput.click();
    });

    fileInput.addEventListener("change", async function () {
        const files = fileInput.files;
        for (const file of files) {
            if (!uploadedImageMap.has(file.name)) {
                try {
                    // Convert to compressed base64
                    const compressedBase64 = await compressImage(file);
                    createImageElement(compressedBase64, file.name);
                } catch (error) {
                    console.error("Error processing image:", error);
                    alert(`Error processing image ${file.name}`);
                }
            } else {
                console.log(`Image "${file.name}" already exists`);
            }
        }
        fileInput.value = '';
    });

    // Image compression function
    async function compressImage(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = new Image();
                img.onload = function() {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;
                    
                    // Max dimension
                    const MAX_DIMENSION = 800;
                    if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
                        if (width > height) {
                            height = (height / width) * MAX_DIMENSION;
                            width = MAX_DIMENSION;
                        } else {
                            width = (width / height) * MAX_DIMENSION;
                            height = MAX_DIMENSION;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    // Compress image
                    const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);
                    resolve(compressedBase64);
                };
                img.onerror = reject;
                img.src = e.target.result;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    function createImageElement(src, name) {
        const container = document.createElement("div");
        container.classList.add("image-container");
        
        const img = document.createElement("img");
        img.src = src;
        img.alt = name;
        img.draggable = true;
        img.classList.add("uploaded-image");
        img.dataset.listened = "false";
        
        img.addEventListener("dragstart", handleDragStart);
        img.addEventListener("click", toggleSelection);
        img.addEventListener("dblclick", toggleListened);
        
        const removeButton = document.createElement("button");
        removeButton.classList.add("remove-button");
        removeButton.innerText = "✖";
        removeButton.addEventListener("click", function () {
            uploadedImageMap.delete(name);
            container.remove();
        });
        
        const tooltip = document.createElement("div");
        tooltip.classList.add("tooltip");
        tooltip.innerText = name;
        
        container.appendChild(tooltip);
        container.appendChild(img);
        container.appendChild(removeButton);
        uploadedImages.appendChild(container);

        uploadedImageMap.set(name, {
            container: container,
            src: src,
            listened: false
        });

        container.addEventListener("mouseenter", function () {
            tooltip.style.visibility = "visible";
        });
        container.addEventListener("mouseleave", function () {
            tooltip.style.visibility = "hidden";
        });
    }

    saveConfigButton.addEventListener("click", function () {
        try {
            const config = {
                tiers: {
                    S: getImagesInTier("tier-s"),
                    A: getImagesInTier("tier-a"),
                    B: getImagesInTier("tier-b"),
                    C: getImagesInTier("tier-c")
                }
            };

            // Split into chunks if needed
            const jsonStr = JSON.stringify(config);
            downloadConfig(jsonStr, "tierlist-config.json");
        } catch (error) {
            console.error("Error saving configuration:", error);
            alert("Error saving configuration. The file might be too large.");
        }
    });

    function downloadConfig(jsonStr, filename) {
        const blob = new Blob([jsonStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function getImagesInTier(tierId) {
        const tier = document.getElementById(tierId);
        return Array.from(tier.querySelectorAll(".drop-zone img")).map(img => ({
            src: img.src,
            name: img.alt,
            listened: img.dataset.listened === 'true'
        }));
    }

    configFileInput.addEventListener("change", function () {
        const file = configFileInput.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = async function (e) {
            try {
                const config = JSON.parse(e.target.result);
                await restoreConfiguration(config);
            } catch (error) {
                console.error("Error loading configuration:", error);
                alert("Error loading configuration file. Please make sure it's a valid JSON file and not too large.");
            }
        };
        reader.readAsText(file);
        configFileInput.value = '';
    });

    async function restoreConfiguration(config) {
        clearAllTiers();

        // Process each tier
        for (const [tierId, images] of Object.entries(config.tiers)) {
            const tier = document.getElementById(`tier-${tierId.toLowerCase()}`);
            const dropZone = tier.querySelector(".drop-zone");

            for (const image of images) {
                if (!uploadedImageMap.has(image.name)) {
                    createImageElement(image.src, image.name);
                }
                
                const imageData = uploadedImageMap.get(image.name);
                if (imageData) {
                    const imgElement = imageData.container.querySelector('img');
                    imgElement.dataset.listened = image.listened;
                    imgElement.classList.toggle("listened", image.listened);
                    dropZone.appendChild(imageData.container);
                }
            }
        }
    }

    function clearAllTiers() {
        document.querySelectorAll(".drop-zone").forEach(zone => {
            while (zone.firstChild) {
                const imgContainer = zone.firstChild;
                uploadedImages.appendChild(imgContainer);
            }
        });
    }

    // Existing event handlers remain the same
    function toggleSelection(event) {
        const img = event.target;
        if (selectedImages.has(img)) {
            selectedImages.delete(img);
            img.classList.remove("selected");
        } else {
            selectedImages.add(img);
            img.classList.add("selected");
        }
    }

    function toggleListened(event) {
        const img = event.target;
        img.dataset.listened = img.dataset.listened === "false" ? "true" : "false";
        img.classList.toggle("listened", img.dataset.listened === "true");
    }

    function handleDragStart(event) {
        event.dataTransfer.setData("text/plain", "dragging");
    }

    // Add click event to tiers to move selected images
    document.querySelectorAll(".tier").forEach(tier => {
        tier.addEventListener("click", function (event) {
            if (selectedImages.size > 0) {
                const dropZone = tier.querySelector(".drop-zone");
                selectedImages.forEach(img => {
                    dropZone.appendChild(img.parentElement);
                    img.classList.remove("selected");
                });
                selectedImages.clear();
            }
        });
    });

    searchInput.addEventListener("input", function () {
        const query = searchInput.value.toLowerCase();
        uploadedImageMap.forEach((data, name) => {
            const container = data.container;
            if (name.toLowerCase().includes(query)) {
                container.style.display = "inline-block";
            } else {
                container.style.display = "none";
            }
        });
    });
});
