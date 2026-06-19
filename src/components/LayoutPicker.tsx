"use client";

import {
  getLayoutOptions,
  isLayoutSlideType,
  type LayoutSlideType,
} from "@/lib/layouts";
import { usePresentationStore } from "@/store/usePresentationStore";
import { useEffect, useRef, useState } from "react";

function LayoutThumbnail({
  slideType,
  layoutId,
}: {
  slideType: LayoutSlideType;
  layoutId: string;
}) {
  const accent = "var(--accent, #FF5A36)";

  if (slideType === "cover") {
    if (layoutId === "centered") {
      return (
        <div className="flex h-full flex-col items-center justify-center gap-1 bg-muted-50 p-1.5">
          <span className="h-1 w-6 rounded bg-muted-300" />
          <span className="h-0.5 w-4 rounded" style={{ backgroundColor: accent }} />
          <span className="h-0.5 w-5 rounded bg-muted-200" />
        </div>
      );
    }
    return (
      <div className="relative h-full overflow-hidden bg-slate-900 p-1.5">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background: `linear-gradient(135deg, #0f172a, ${accent}44)`,
          }}
        />
        <div className="relative flex h-full flex-col justify-between">
          <span className="h-0.5 w-3 rounded bg-white/40" />
          <span className="h-1.5 w-8 rounded bg-white/80" />
          <span className="h-0.5 w-2 rounded bg-white/30" />
        </div>
      </div>
    );
  }

  if (slideType === "solution") {
    if (layoutId === "stacked") {
      return (
        <div className="flex h-full flex-col gap-1 bg-muted-50 p-1.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex flex-1 items-center gap-1 rounded bg-white px-1">
              <span
                className="h-2 w-2 shrink-0 rounded-sm"
                style={{ backgroundColor: accent }}
              />
              <span className="h-0.5 flex-1 rounded bg-muted-200" />
            </div>
          ))}
        </div>
      );
    }
    return (
      <div className="grid h-full grid-cols-3 gap-1 bg-muted-50 p-1.5">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded bg-white p-1">
            <span
              className="mb-1 block h-2 w-2 rounded-sm"
              style={{ backgroundColor: accent }}
            />
            <span className="block h-0.5 w-full rounded bg-muted-200" />
          </div>
        ))}
      </div>
    );
  }

  if (slideType === "features") {
    if (layoutId === "list") {
      return (
        <div className="flex h-full flex-col gap-0.5 bg-muted-50 p-1.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex flex-1 items-center gap-1 border-b border-muted-100 px-0.5">
              <span className="text-[6px] font-bold" style={{ color: accent }}>
                {i + 1}
              </span>
              <span className="h-0.5 flex-1 rounded bg-muted-200" />
            </div>
          ))}
        </div>
      );
    }
    return (
      <div className="grid h-full grid-cols-3 grid-rows-2 gap-0.5 bg-muted-50 p-1.5">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="rounded bg-white p-0.5">
            <span className="block text-[5px]" style={{ color: accent }}>
              ✦
            </span>
          </div>
        ))}
      </div>
    );
  }

  if (layoutId === "table") {
    return (
      <div className="grid h-full grid-cols-4 gap-px bg-muted-200 p-1.5">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div
            key={i}
            className={`bg-white ${i < 4 ? "h-2" : "h-1.5"}`}
            style={i > 0 && i < 4 ? { borderBottom: `1px solid ${accent}` } : undefined}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid h-full grid-cols-3 gap-1 bg-muted-50 p-1.5">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="rounded bg-white p-1"
          style={i === 1 ? { boxShadow: `inset 0 0 0 1px ${accent}` } : undefined}
        >
          <span className="block h-0.5 w-3 rounded bg-muted-300" />
          <span
            className="mt-1 block h-1 w-2 rounded"
            style={{ color: accent, fontSize: 6 }}
          >
            $
          </span>
        </div>
      ))}
    </div>
  );
}

export function LayoutPicker() {
  const slides = usePresentationStore((s) => s.slides);
  const currentSlide = usePresentationStore((s) => s.currentSlide);
  const slideData = usePresentationStore((s) => s.slideData);
  const updateSlideData = usePresentationStore((s) => s.updateSlideData);

  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const active = slides[currentSlide];

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  if (!active || !isLayoutSlideType(active.type)) {
    return null;
  }

  const slideType = active.type;
  const data = slideData[active.id] as { layout?: string } | undefined;
  const currentLayout = data?.layout ?? "default";
  const options = getLayoutOptions(slideType);

  const selectLayout = (layoutId: string) => {
    updateSlideData(active.id, (current) =>
      ({ ...current, layout: layoutId }) as typeof current
    );
    setOpen(false);
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded-lg border border-muted-200 px-2.5 py-1.5 text-xs font-medium text-muted-600 transition-colors hover:bg-muted-50"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        Layout
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Slide layout options"
          className="absolute left-0 top-full z-50 mt-2 flex gap-2 rounded-xl border border-muted-200 bg-white p-2 shadow-lg"
        >
          {options.map((option) => (
            <button
              key={option.id}
              type="button"
              role="option"
              aria-selected={currentLayout === option.id}
              title={option.label}
              onClick={() => selectLayout(option.id)}
              className={`flex w-16 flex-col gap-1 rounded-lg p-1 transition-colors hover:bg-muted-50 ${
                currentLayout === option.id
                  ? "ring-2 ring-ink ring-offset-1"
                  : "ring-1 ring-muted-100"
              }`}
            >
              <div className="aspect-video w-full overflow-hidden rounded-md">
                <LayoutThumbnail slideType={slideType} layoutId={option.id} />
              </div>
              <span className="text-[10px] font-medium text-muted-600">
                {option.label}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
