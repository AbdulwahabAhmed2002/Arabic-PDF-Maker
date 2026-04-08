// PDF Generation using jsPDF and html2canvas
// Wait for libraries to load
function waitForLibs() {
  return new Promise((resolve) => {
    const checkLibs = () => {
      if (window.jspdf && window.html2canvas) {
        resolve();
      } else {
        setTimeout(checkLibs, 100);
      }
    };
    checkLibs();
  });
}

window.PDFGen = {
  async generatePDF(imageCanvases, filename = 'document') {
    await waitForLibs();
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const imgWidth = 180; // Fixed width for images
    const imgHeight = (imgWidth * pageHeight) / pageWidth;

    for (let i = 0; i < imageCanvases.length; i++) {
      const canvas = imageCanvases[i];
      const imgData = canvas.toDataURL('image/png');
      if (i > 0) doc.addPage();
      doc.addImage(imgData, 'PNG', 15, 15, imgWidth, imgHeight);
      // Page number
      doc.setFontSize(12);
      doc.text(`الصفحة ${i + 1}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
    }

    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    return { blob: pdfBlob, url: pdfUrl, filename: `${filename}.pdf` };
  }
};

console.log('PDF.js loaded');
