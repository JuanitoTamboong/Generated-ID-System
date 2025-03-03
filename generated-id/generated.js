// Handle image upload and background removal
document.getElementById("upload").addEventListener("change", async function (event) {
    const imagePreview = document.getElementById("imagePreview");
    const file = event.target.files[0];

    if (!file) {
        imagePreview.style.display = "none";
        return;
    }

    const formData = new FormData();
    formData.append("image_file", file);
    formData.append("size", "auto");

    try {
        const response = await fetch("https://api.remove.bg/v1.0/removebg", {
            method: "POST",
            headers: {
                "X-Api-Key": "xwSTochxiubuFMeaUCVN6Yf9" // Replace with your Remove.bg API key
            },
            body: formData
        });

        if (!response.ok) throw new Error("Failed to remove background");

        const data = await response.blob();
        const objectURL = URL.createObjectURL(data);

        imagePreview.src = objectURL;
        imagePreview.style.display = "block";

        updateIDPreview(); // Auto-fits head inside attire
    } catch (error) {
        console.error("Background removal failed:", error);
        alert("Failed to remove background. Please try again.");
    }
});

// Detect gender selection and update attire
document.querySelectorAll('input[name="sex"]').forEach(radio => {
    radio.addEventListener("change", updateIDPreview);
});

// Function to crop and fit only the face inside the attire
function updateIDPreview() {
    const gender = document.querySelector('input[name="sex"]:checked')?.value;
    const imagePreview = document.getElementById("imagePreview");
    const finalImage = document.getElementById("finalImage");

    if (!finalImage) {
        console.error("finalImage element is missing from the HTML.");
        return;
    }

    const maleAttire = "/attire-image/male-attire.png";
    const femaleAttire = "/attire-image/female-attire.png";

    if (!imagePreview.src.includes("blob:")) return; // Ensure an image is uploaded

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const baseImage = new Image();
    baseImage.src = imagePreview.src;

    baseImage.onload = function () {
        canvas.width = 300; // Canvas width (matches attire size)
        canvas.height = 400; // Canvas height (matches attire size)

        // **Attire Image**
        const attireImage = new Image();
        attireImage.src = gender === "male" ? maleAttire : femaleAttire;

        attireImage.onload = function () {
            // Draw the attire image first
            ctx.drawImage(attireImage, 0, 0, canvas.width, canvas.height);

            // **Crop and Position the Head**
            const headWidth = 160; // Width of the head area
            const headHeight = 180; // Height of the head area
            const headX = (canvas.width - headWidth) / 2; // Center the head horizontally
            const headY = 50; // Adjust this value to align the head vertically within the attire

            // Draw the cropped head image on top of the attire
            ctx.drawImage(
                baseImage, // Source image
                headX, headY, headWidth, headHeight // Destination position and size
            );

            // Update the final image preview
            finalImage.src = canvas.toDataURL();
            finalImage.style.display = "block";
        };
    };
}

// Generate ID button - Save & Navigate
document.getElementById("generateBtn").addEventListener("click", function () {
    const finalImage = document.getElementById("finalImage");

    if (!finalImage.src.includes("data:image")) {
        alert("Please upload an image and select a gender first.");
        return;
    }

    sessionStorage.setItem("generatedID", finalImage.src);
    window.location.href = "/view-id/view.html";
});