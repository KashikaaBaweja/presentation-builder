"use client";

import { SlideScaler } from "@/components/SlideFrame";
import { SLIDE_HEIGHT, SLIDE_WIDTH } from "@/lib/constants";
import { SLIDES } from "@/slides";
import { usePresentationStore } from "@/store/usePresentationStore";
import { useEffect, useRef } from "react";

export function SlidePreview() {
  const currentSlide = usePresentationStore((s) => s.currentSlide);
  const containerRef = useRef<HTMLDivElement>(null);
  const CurrentSlideComponent = SLIDES[currentSlide];

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

  return (
    <div
      ref={containerRef}
      className="relative flex flex-1 items-center justify-center overflow-hidden bg-muted-100 p-6"
    >
      <div className="rounded-2xl shadow-2xl ring-1 ring-muted-200/80 overflow-hidden">
        <SlideScaler>
          <CurrentSlideComponent />
        </SlideScaler>
      </div>
    </div>
  );
}

export function PdfExportContainer() {
  return (
    <div
      id="pdf-export-container"
      aria-hidden="true"
      className="pointer-events-none fixed left-[-9999px] top-0"
    >
      {SLIDES.map((SlideComponent, index) => (
        <SlideComponent key={index} />
      ))}
    </div>
  );
}
