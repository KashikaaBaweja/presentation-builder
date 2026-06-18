import { toCanvas } from "html-to-image";
import { jsPDF } from "jspdf";
import { PDF_SCALE, SLIDE_HEIGHT, SLIDE_WIDTH } from "./constants";

function getSlideBackground(element: HTMLElement): string {
  return element.getAttribute("data-variant") === "dark" ? "#0f172a" : "#f8fafc";
}

export async function exportPresentationToPdf(
  slideElements: HTMLElement[]
): Promise<void> {
  if (slideElements.length === 0) {
    throw new Error("No slides found to export");
  }

  await document.fonts.ready;

  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "px",
    format: [SLIDE_WIDTH, SLIDE_HEIGHT],
    hotfixes: ["px_scaling"],
  });

  for (let i = 0; i < slideElements.length; i++) {
    const element = slideElements[i];
    const backgroundColor = getSlideBackground(element);

    const canvas = await toCanvas(element, {
      width: SLIDE_WIDTH,
      height: SLIDE_HEIGHT,
      pixelRatio: PDF_SCALE,
      cacheBust: true,
      backgroundColor,
      style: {
        transform: "none",
        margin: "0",
      },
    });

    if (canvas.width === 0 || canvas.height === 0) {
      throw new Error(`Failed to render slide ${i + 1}`);
    }

    const imgData = canvas.toDataURL("image/png");

    if (i > 0) {
      pdf.addPage([SLIDE_WIDTH, SLIDE_HEIGHT], "landscape");
    }

    pdf.addImage(imgData, "PNG", 0, 0, SLIDE_WIDTH, SLIDE_HEIGHT);
  }

  pdf.save("presentation.pdf");
}
