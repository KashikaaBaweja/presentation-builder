import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { PDF_SCALE, SLIDE_HEIGHT, SLIDE_WIDTH } from "./constants";

export async function exportPresentationToPdf(
  slideElements: HTMLElement[]
): Promise<void> {
  await document.fonts.ready;

  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "px",
    format: [SLIDE_WIDTH, SLIDE_HEIGHT],
    hotfixes: ["px_scaling"],
  });

  for (let i = 0; i < slideElements.length; i++) {
    const element = slideElements[i];

    const canvas = await html2canvas(element, {
      scale: PDF_SCALE,
      width: SLIDE_WIDTH,
      height: SLIDE_HEIGHT,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
      logging: false,
      onclone: (clonedDoc) => {
        const clonedSlides = clonedDoc.querySelectorAll(".slide-frame");
        clonedSlides.forEach((slide) => {
          slide.querySelectorAll("[contenteditable]").forEach((el) => {
            el.removeAttribute("contenteditable");
            (el as HTMLElement).style.cursor = "default";
          });
          slide.querySelectorAll(".editable-text").forEach((el) => {
            el.classList.remove("hover:ring-2", "focus:ring-2");
          });
        });
      },
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.95);

    if (i > 0) {
      pdf.addPage([SLIDE_WIDTH, SLIDE_HEIGHT], "landscape");
    }

    pdf.addImage(imgData, "JPEG", 0, 0, SLIDE_WIDTH, SLIDE_HEIGHT);
  }

  pdf.save("presentation.pdf");
}
