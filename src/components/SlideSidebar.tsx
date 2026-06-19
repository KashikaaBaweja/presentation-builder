"use client";

import { AddSlideMenu } from "@/components/AddSlideMenu";
import { getSlideSidebarLabel } from "@/slides";
import { usePresentationStore } from "@/store/usePresentationStore";

export function SlideSidebar() {
  const slides = usePresentationStore((s) => s.slides);
  const slideData = usePresentationStore((s) => s.slideData);
  const currentSlide = usePresentationStore((s) => s.currentSlide);
  const setCurrentSlide = usePresentationStore((s) => s.setCurrentSlide);
  const removeSlide = usePresentationStore((s) => s.removeSlide);
  const accentColor = usePresentationStore((s) => s.accentColor);

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-muted-200 bg-white">
      <div className="flex-1 overflow-y-auto p-4">
        <h2 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-400">
          Slides
        </h2>
        <div className="flex flex-col gap-2">
          {slides.map((slide, index) => (
            <div key={slide.id} className="group relative">
              <button
                type="button"
                onClick={() => setCurrentSlide(index)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-all ${
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
                    currentSlide === index
                      ? "text-white"
                      : "bg-muted-100 text-muted-500"
                  }`}
                  style={
                    currentSlide === index
                      ? { backgroundColor: accentColor }
                      : undefined
                  }
                >
                  {index + 1}
                </span>
                <span className="truncate">
                  {getSlideSidebarLabel(slide, slideData)}
                </span>
              </button>
              {slides.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSlide(slide.id)}
                  title="Remove slide"
                  className="absolute right-2 top-1/2 hidden -translate-y-1/2 rounded-md px-1.5 py-0.5 text-xs text-muted-400 hover:bg-red-50 hover:text-red-500 group-hover:block"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      <AddSlideMenu />
    </aside>
  );
}
