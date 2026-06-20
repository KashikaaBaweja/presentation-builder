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
    <div
      draggable
      role="button"
      tabIndex={0}
      aria-label={`Drag slide ${index + 1} to reorder`}
      onDragStart={(e) => {
        onDragStart(index);
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", String(index));
        e.dataTransfer.setData("application/x-slide-index", String(index));
      }}
      onDragEnd={onDragEnd}
      className="flex shrink-0 cursor-grab select-none flex-col items-center justify-center gap-0.5 rounded-md px-1.5 py-2 text-muted-400 transition-colors hover:bg-muted-100 hover:text-muted-600 active:cursor-grabbing"
      style={{ WebkitUserDrag: "element" } as React.CSSProperties}
    >
      <span className="block h-0.5 w-2.5 rounded-full bg-current" />
      <span className="block h-0.5 w-2.5 rounded-full bg-current" />
      <span className="block h-0.5 w-2.5 rounded-full bg-current" />
    </div>
  );
}

function ReorderButtons({
  index,
  total,
  onMove,
}: {
  index: number;
  total: number;
  onMove: (from: number, to: number) => void;
}) {
  return (
    <div className="flex shrink-0 flex-col gap-0.5 pr-1">
      <button
        type="button"
        disabled={index === 0}
        onClick={() => onMove(index, index - 1)}
        title="Move slide up"
        aria-label="Move slide up"
        className="rounded px-1 text-[10px] leading-none text-muted-400 hover:bg-muted-100 hover:text-muted-700 disabled:cursor-not-allowed disabled:opacity-30"
      >
        ▲
      </button>
      <button
        type="button"
        disabled={index === total - 1}
        onClick={() => onMove(index, index + 1)}
        title="Move slide down"
        aria-label="Move slide down"
        className="rounded px-1 text-[10px] leading-none text-muted-400 hover:bg-muted-100 hover:text-muted-700 disabled:cursor-not-allowed disabled:opacity-30"
      >
        ▼
      </button>
    </div>
  );
}

export function SlideSidebar({
  canManageSlides = true,
}: {
  canManageSlides?: boolean;
}) {
  const slides = usePresentationStore((s) => s.slides);
  const slideData = usePresentationStore((s) => s.slideData);
  const currentSlide = usePresentationStore((s) => s.currentSlide);
  const setCurrentSlide = usePresentationStore((s) => s.setCurrentSlide);
  const removeSlide = usePresentationStore((s) => s.removeSlide);
  const reorderSlides = usePresentationStore((s) => s.reorderSlides);

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

  const handleMove = useCallback(
    (from: number, to: number) => {
      reorderSlides(from, to);
    },
    [reorderSlides]
  );

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-muted-200 bg-white">
      <div className="flex-1 overflow-y-auto p-4">
        <h2 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-400">
          Slides
        </h2>
        {canManageSlides ? (
          <p className="mb-3 px-2 text-[11px] leading-snug text-muted-400">
            Drag the grip, or use ▲▼ to reorder. Works in Safari too.
          </p>
        ) : (
          <p className="mb-3 px-2 text-[11px] leading-snug text-muted-400">
            Select a slide to edit its text.
          </p>
        )}
        <div className="flex flex-col gap-2">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`group relative rounded-xl transition-all ${
                canManageSlides && dragIndex === index ? "opacity-40" : ""
              } ${
                canManageSlides && overIndex === index && dragIndex !== index
                  ? "ring-2 ring-brand/40 ring-offset-1"
                  : ""
              }`}
              onDragEnter={
                canManageSlides
                  ? (e) => {
                      e.preventDefault();
                      setOverIndex(index);
                    }
                  : undefined
              }
              onDragOver={
                canManageSlides
                  ? (e) => {
                      e.preventDefault();
                      e.dataTransfer.dropEffect = "move";
                      setOverIndex(index);
                    }
                  : undefined
              }
              onDragLeave={
                canManageSlides
                  ? () => {
                      setOverIndex((current) =>
                        current === index ? null : current
                      );
                    }
                  : undefined
              }
              onDrop={
                canManageSlides
                  ? (e) => {
                      e.preventDefault();
                      handleDrop(index);
                    }
                  : undefined
              }
            >
              <div className="flex items-center">
                {canManageSlides && (
                  <DragHandle
                    index={index}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                  />
                )}
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
                      ? { boxShadow: "inset 3px 0 0 var(--brand)" }
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
                        ? { backgroundColor: "var(--brand)" }
                        : undefined
                    }
                  >
                    {index + 1}
                  </span>
                  <span className="truncate">
                    {getSlideSidebarLabel(slide, slideData)}
                  </span>
                </button>
                {canManageSlides && slides.length > 1 && (
                  <ReorderButtons
                    index={index}
                    total={slides.length}
                    onMove={handleMove}
                  />
                )}
              </div>
              {canManageSlides && slides.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSlide(slide.id)}
                  title="Remove slide"
                  className="absolute right-8 top-1/2 hidden -translate-y-1/2 rounded-md px-1.5 py-0.5 text-xs text-muted-400 hover:bg-red-50 hover:text-red-500 group-hover:block"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      {canManageSlides && <AddSlideMenu />}
    </aside>
  );
}
