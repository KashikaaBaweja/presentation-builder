import { toCanvas } from "html-to-image";
import { jsPDF } from "jspdf";
import {
  PDF_FALLBACK_SCALE,
  PDF_JPEG_QUALITY,
  PDF_MAX_BYTES,
  PDF_SCALE,
  SLIDE_HEIGHT,
  SLIDE_WIDTH,
} from "./constants";

function getSlideBackground(element: HTMLElement): string {
  return element.getAttribute("data-variant") === "dark" ? "#0f172a" : "#f8fafc";
}

function getCaptureDimensions(scale: number) {
  return {
    width: Math.round(SLIDE_WIDTH * scale),
    height: Math.round(SLIDE_HEIGHT * scale),
  };
}

function normalizeCanvas(
  source: HTMLCanvasElement,
  targetWidth: number,
  targetHeight: number
): HTMLCanvasElement {
  if (source.width === targetWidth && source.height === targetHeight) {
    return source;
  }

  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Failed to normalize slide canvas");
  }

  ctx.drawImage(source, 0, 0, targetWidth, targetHeight);
  return canvas;
}

function canvasToJpeg(canvas: HTMLCanvasElement): string {
  const dataUrl = canvas.toDataURL("image/jpeg", PDF_JPEG_QUALITY);
  if (!dataUrl.startsWith("data:image/jpeg")) {
    throw new Error("Slide capture did not produce JPEG output");
  }
  return dataUrl;
}

async function buildPdf(
  slideElements: HTMLElement[],
  scale: number
): Promise<jsPDF> {
  const { width: captureWidth, height: captureHeight } =
    getCaptureDimensions(scale);

  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "px",
    format: [SLIDE_WIDTH, SLIDE_HEIGHT],
    hotfixes: ["px_scaling"],
  });

  for (let i = 0; i < slideElements.length; i++) {
    const element = slideElements[i];
    const backgroundColor = getSlideBackground(element);

    const rawCanvas = await toCanvas(element, {
      width: SLIDE_WIDTH,
      height: SLIDE_HEIGHT,
      canvasWidth: captureWidth,
      canvasHeight: captureHeight,
      pixelRatio: 1,
      cacheBust: true,
      backgroundColor,
      style: {
        transform: "none",
        margin: "0",
      },
    });

    if (i === 0) {
      console.info(
        `[PDF export] Slide 1 canvas: ${rawCanvas.width}x${rawCanvas.height} (expected ${captureWidth}x${captureHeight}, scale ${scale})`
      );
    }

    const canvas = normalizeCanvas(rawCanvas, captureWidth, captureHeight);
    const imgData = canvasToJpeg(canvas);

    if (i > 0) {
      pdf.addPage([SLIDE_WIDTH, SLIDE_HEIGHT], "landscape");
    }

    pdf.addImage(imgData, "JPEG", 0, 0, SLIDE_WIDTH, SLIDE_HEIGHT);
  }

  return pdf;
}

export async function exportPresentationToPdf(
  slideElements: HTMLElement[]
): Promise<void> {
  if (slideElements.length === 0) {
    throw new Error("No slides found to export");
  }

  await document.fonts.ready;

  let scale = PDF_SCALE;
  let pdf = await buildPdf(slideElements, scale);
  let blob = pdf.output("blob");

  if (blob.size > PDF_MAX_BYTES) {
    console.warn(
      `[PDF export] Output is ${(blob.size / (1024 * 1024)).toFixed(1)}MB; re-exporting at scale ${PDF_FALLBACK_SCALE}`
    );
    scale = PDF_FALLBACK_SCALE;
    pdf = await buildPdf(slideElements, scale);
    blob = pdf.output("blob");
    console.info(
      `[PDF export] Fallback export size: ${(blob.size / (1024 * 1024)).toFixed(1)}MB`
    );
  }

  pdf.save("presentation.pdf");
}
