document.getElementById("upload").addEventListener("change", function(event) {
    const imagePreview = document.getElementById("imagePreview");
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.src = e.target.result;
            imagePreview.style.display = "block";
        };
        reader.readAsDataURL(file);
    } else {
        imagePreview.style.display = "none";
    }
});

// Change attire based on selected gender
document.querySelectorAll('input[name="sex"]').forEach(radio => {
    radio.addEventListener("change", function() {
        const maleAttire = document.getElementById("maleAttire");
        const femaleAttire = document.getElementById("femaleAttire");

        if (this.value === "male") {
            maleAttire.style.display = "block";
            femaleAttire.style.display = "none";
        } else {
            maleAttire.style.display = "none";
            femaleAttire.style.display = "block";
        }
    });
});

// Navigate to another page with the edited image
document.getElementById("generateBtn").addEventListener("click", function() {
    const gender = document.querySelector('input[name="sex"]:checked')?.value;
    const size = document.getElementById("size").value;
    const imageSrc = document.getElementById("imagePreview").src;

    if (!gender || !imageSrc.includes("data:image")) {
        alert("Please upload an image and select gender.");
        return;
    }

    sessionStorage.setItem("image", imageSrc);
    sessionStorage.setItem("size", size);
    sessionStorage.setItem("gender", gender);
    
    window.location.href = "/view-id/view.html"; // Ensure view.html is in the correct folder
});
