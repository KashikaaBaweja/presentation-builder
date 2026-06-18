"use client";

import { usePresentationStore } from "@/store/usePresentationStore";

export function SlideControls() {
  const currentSlide = usePresentationStore((s) => s.currentSlide);
  const nextSlide = usePresentationStore((s) => s.nextSlide);
  const prevSlide = usePresentationStore((s) => s.prevSlide);
  const accentColor = usePresentationStore((s) => s.accentColor);

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

      <div className="flex items-center gap-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="h-2 rounded-full transition-all"
            style={{
              width: currentSlide === i ? 24 : 8,
              backgroundColor:
                currentSlide === i ? accentColor : "var(--color-muted-200)",
            }}
          />
        ))}
      </div>

      <span className="min-w-[4rem] text-center text-sm font-medium text-muted-500">
        {currentSlide + 1} / 10
      </span>

      <button
        type="button"
        onClick={nextSlide}
        disabled={currentSlide === 9}
        className="rounded-xl px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        style={{ backgroundColor: accentColor }}
      >
        Next
      </button>
    </div>
  );
}
