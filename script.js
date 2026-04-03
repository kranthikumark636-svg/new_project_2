let images = [];
let pdfBlob = null;

// Load Images
document.getElementById("imageInput").addEventListener("change", function(e) {
    let files = e.target.files;

    images = [];
    document.getElementById("previewContainer").innerHTML = "";

    for (let file of files) {
        let reader = new FileReader();

        reader.onload = function(event) {
            images.push(event.target.result);

            let img = document.createElement("img");
            img.src = event.target.result;
            document.getElementById("previewContainer").appendChild(img);
        };

        reader.readAsDataURL(file);
    }
});

// Convert to PDF (FIXED SIZE)
function convertToPDF() {
    if (images.length === 0) {
        alert("Upload images first!");
        return;
    }

    const { jsPDF } = window.jspdf;
    let pdf = new jsPDF();

    images.forEach((imgData, index) => {
        let img = new Image();
        img.src = imgData;

        img.onload = function () {
            let width = pdf.internal.pageSize.getWidth();
            let height = (img.height * width) / img.width;

            if (index > 0) pdf.addPage();
            pdf.addImage(imgData, "JPEG", 0, 0, width, height);

            // Save after last image
            if (index === images.length - 1) {
                pdfBlob = pdf.output("blob");
                alert("PDF Ready!");
            }
        };
    });
}

// Download PDF
function downloadPDF() {
    if (!pdfBlob) {
        alert("Convert first!");
        return;
    }

    let link = document.createElement("a");
    link.href = URL.createObjectURL(pdfBlob);
    link.download = "images.pdf";
    link.click();
}

// Convert to JPG (FULLY FIXED)
function convertToJPG() {
    if (images.length === 0) {
        alert("Upload images first!");
        return;
    }

    images.forEach((imgData, index) => {
        let img = new Image();
        img.crossOrigin = "anonymous"; // FIX

        img.onload = function () {
            let canvas = document.createElement("canvas");
            let ctx = canvas.getContext("2d");

            canvas.width = img.width;
            canvas.height = img.height;

            // White background fix
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.drawImage(img, 0, 0);

            let jpg = canvas.toDataURL("image/jpeg", 0.95);

            let link = document.createElement("a");
            link.href = jpg;
            link.download = `converted_${index + 1}.jpg`;
            link.click();
        };

        img.src = imgData;
    });
}
