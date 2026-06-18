"use client";

import { SLIDE_NAMES } from "@/lib/constants";
import { usePresentationStore } from "@/store/usePresentationStore";
import { SLIDES } from "@/slides";

export function SlideSidebar() {
  const currentSlide = usePresentationStore((s) => s.currentSlide);
  const setCurrentSlide = usePresentationStore((s) => s.setCurrentSlide);
  const accentColor = usePresentationStore((s) => s.accentColor);

  return (
    <aside className="flex w-56 shrink-0 flex-col gap-2 overflow-y-auto border-r border-muted-200 bg-white p-4">
      <h2 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-400">
        Slides
      </h2>
      {SLIDES.map((_, index) => (
        <button
          key={index}
          type="button"
          onClick={() => setCurrentSlide(index)}
          className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-all ${
            currentSlide === index
              ? "bg-muted-100 font-semibold text-muted-900 shadow-sm"
              : "text-muted-600 hover:bg-muted-50"
          }`}
          style={
            currentSlide === index
              ? { boxShadow: `inset 3px 0 0 ${accentColor}` }
              : undefined
          }
        >
          <span
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
              currentSlide === index ? "text-white" : "bg-muted-100 text-muted-500"
            }`}
            style={
              currentSlide === index
                ? { backgroundColor: accentColor }
                : undefined
            }
          >
            {index + 1}
          </span>
          <span className="truncate">{SLIDE_NAMES[index]}</span>
        </button>
      ))}
    </aside>
  );
}
