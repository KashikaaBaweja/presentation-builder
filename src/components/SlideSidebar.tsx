"use client";

import { AddSlideMenu } from "@/components/AddSlideMenu";
import { getSlideSidebarLabel } from "@/slides";
import { usePresentationStore } from "@/store/usePresentationStore";
import { useCallback, useState } from "react";

function DragHandle({
  index,
  onDragStart,
  onDragEnd,
}: {
  index: number;
  onDragStart: (index: number) => void;
  onDragEnd: () => void;
}) {
  return (
    <button
      type="button"
      draggable
      aria-label={`Drag slide ${index + 1} to reorder`}
      onDragStart={(e) => {
        onDragStart(index);
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", String(index));
      }}
      onDragEnd={onDragEnd}
      className="flex shrink-0 cursor-grab touch-none flex-col justify-center gap-0.5 rounded-md px-1 py-2 text-muted-300 opacity-0 transition-opacity hover:bg-muted-100 hover:text-muted-500 group-hover:opacity-100 active:cursor-grabbing"
    >
      <span className="block h-0.5 w-2.5 rounded-full bg-current" />
      <span className="block h-0.5 w-2.5 rounded-full bg-current" />
      <span className="block h-0.5 w-2.5 rounded-full bg-current" />
    </button>
  );
}

export function SlideSidebar() {
  const slides = usePresentationStore((s) => s.slides);
  const slideData = usePresentationStore((s) => s.slideData);
  const currentSlide = usePresentationStore((s) => s.currentSlide);
  const setCurrentSlide = usePresentationStore((s) => s.setCurrentSlide);
  const removeSlide = usePresentationStore((s) => s.removeSlide);
  const reorderSlides = usePresentationStore((s) => s.reorderSlides);
  const accentColor = usePresentationStore((s) => s.accentColor);

  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  const handleDragStart = useCallback((index: number) => {
    setDragIndex(index);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDragIndex(null);
    setOverIndex(null);
  }, []);

  const handleDrop = useCallback(
    (toIndex: number) => {
      if (dragIndex !== null && dragIndex !== toIndex) {
        reorderSlides(dragIndex, toIndex);
      }
      setDragIndex(null);
      setOverIndex(null);
    },
    [dragIndex, reorderSlides]
  );

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-muted-200 bg-white">
      <div className="flex-1 overflow-y-auto p-4">
        <h2 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-400">
          Slides
        </h2>
        <p className="mb-3 px-2 text-[11px] text-muted-400">
          Drag the handle to reorder
        </p>
        <div className="flex flex-col gap-2">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`group relative rounded-xl transition-all ${
                dragIndex === index ? "opacity-40" : ""
              } ${
                overIndex === index && dragIndex !== index
                  ? "ring-2 ring-accent/40 ring-offset-1"
                  : ""
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
                setOverIndex(index);
              }}
              onDragLeave={() => {
                setOverIndex((current) => (current === index ? null : current));
              }}
              onDrop={(e) => {
                e.preventDefault();
                handleDrop(index);
              }}
            >
              <div className="flex items-center">
                <DragHandle
                  index={index}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                />
                <button
                  type="button"
                  onClick={() => setCurrentSlide(index)}
                  className={`flex min-w-0 flex-1 items-center gap-3 rounded-xl px-2 py-2.5 text-left text-sm transition-all ${
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
              </div>
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
