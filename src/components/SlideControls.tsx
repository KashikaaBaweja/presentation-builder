"use client";

import { usePresentationStore } from "@/store/usePresentationStore";

export function SlideControls() {
  const slides = usePresentationStore((s) => s.slides);
  const currentSlide = usePresentationStore((s) => s.currentSlide);
  const nextSlide = usePresentationStore((s) => s.nextSlide);
  const prevSlide = usePresentationStore((s) => s.prevSlide);
  const total = slides.length;

  return (
    <div className="flex items-center justify-center gap-4 border-t border-muted-200 bg-white px-6 py-4">
      <button
        type="button"
        onClick={prevSlide}
        disabled={currentSlide === 0}
        className="rounded-xl border border-muted-200 px-5 py-2.5 text-sm font-medium text-muted-700 transition-colors hover:bg-muted-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Previous
      </button>

      <div className="flex max-w-xs items-center gap-2 overflow-hidden">
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            className="h-2 shrink-0 rounded-full transition-all"
            style={{
              width: currentSlide === i ? 24 : 8,
              backgroundColor:
                currentSlide === i ? "var(--brand)" : "var(--color-muted-200)",
            }}
          />
        ))}
      </div>

      <span className="min-w-[4rem] text-center text-sm font-medium text-muted-500">
        {currentSlide + 1} / {total}
      </span>

      <button
        type="button"
        onClick={nextSlide}
        disabled={currentSlide === total - 1}
        className="rounded-xl bg-brand px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}
