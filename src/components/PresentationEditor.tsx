"use client";

import { SlideRenderer } from "@/components/SlideRenderer";
import { SlideScaler } from "@/components/SlideFrame";
import { SLIDE_HEIGHT, SLIDE_WIDTH } from "@/lib/constants";
import { usePresentationStore } from "@/store/usePresentationStore";
import { useEffect, useRef } from "react";

export function SlidePreview() {
  const slides = usePresentationStore((s) => s.slides);
  const currentSlide = usePresentationStore((s) => s.currentSlide);
  const containerRef = useRef<HTMLDivElement>(null);
  const active = slides[currentSlide];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateScale = () => {
      const { width, height } = container.getBoundingClientRect();
      const scaleX = (width - 48) / SLIDE_WIDTH;
      const scaleY = (height - 48) / SLIDE_HEIGHT;
      const scale = Math.min(scaleX, scaleY, 1);
      container.style.setProperty("--slide-scale", String(scale));
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  if (!active) {
    return (
      <div className="flex flex-1 items-center justify-center bg-muted-100 text-sm text-muted-500">
        No slides in deck. Click &ldquo;Add Slide&rdquo; to get started.
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative flex flex-1 items-center justify-center overflow-hidden bg-muted-100 p-6"
    >
      <div className="overflow-hidden rounded-2xl shadow-2xl ring-1 ring-muted-200/80">
        <SlideScaler>
          <SlideRenderer slideId={active.id} type={active.type} />
        </SlideScaler>
      </div>
    </div>
  );
}

/** Only mounted during PDF export to avoid loading all slides on startup */
export function PdfExportContainer() {
  const slides = usePresentationStore((s) => s.slides);

  return (
    <div id="pdf-export-container" aria-hidden="true" className="pdf-export-container">
      {slides.map((slide) => (
        <SlideRenderer key={slide.id} slideId={slide.id} type={slide.type} />
      ))}
    </div>
  );
}
