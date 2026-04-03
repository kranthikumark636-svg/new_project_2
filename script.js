let images = [];
let pdfBlob = null;

document.getElementById("imageInput").addEventListener("change", function(e) {
    let files = e.target.files;

    images = [];
    document.getElementById("previewContainer").innerHTML = "";

    for (let i = 0; i < files.length; i++) {
        let file = files[i];

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

function convertToPDF() {
    if (images.length === 0) {
        alert("Please upload images!");
        return;
    }

    const { jsPDF } = window.jspdf;
    let pdf = new jsPDF();

    images.forEach((imgData, index) => {
        if (index > 0) pdf.addPage();

        pdf.addImage(imgData, 'JPEG', 10, 10, 180, 160);
    });

    pdfBlob = pdf.output("blob");

    alert("PDF ready! Click Download.");
}

function downloadPDF() {
    if (!pdfBlob) {
        alert("Convert first!");
        return;
    }

    let link = document.createElement("a");
    link.href = URL.createObjectURL(pdfBlob);
    link.download = "multi-image.pdf";
    link.click();
}
