"use client";

import {
  CUSTOM_SLIDE_TYPE_OPTIONS,
  TEMPLATE_SLIDE_TYPE_OPTIONS,
} from "@/slides";
import { usePresentationStore } from "@/store/usePresentationStore";
import type { CustomLayout, SlideType } from "@/store/types";
import { useCallback, useEffect, useRef, useState } from "react";

export function AddSlideMenu() {
  const addSlide = usePresentationStore((s) => s.addSlide);
  const accentColor = usePresentationStore((s) => s.accentColor);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleAddTemplate = useCallback(
    (type: SlideType) => {
      addSlide(type);
      setOpen(false);
    },
    [addSlide]
  );

  const handleAddCustom = useCallback(
    (layout: CustomLayout) => {
      addSlide("custom", { layout });
      setOpen(false);
    },
    [addSlide]
  );

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

  return (
    <div ref={menuRef} className="relative border-t border-muted-200 p-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-muted-300 px-3 py-2.5 text-sm font-medium text-muted-600 transition-colors hover:border-muted-400 hover:bg-muted-50"
      >
        <span className="text-lg leading-none">+</span>
        Add Slide
      </button>

      {open && (
        <div className="absolute bottom-full left-4 right-4 z-50 mb-2 max-h-72 overflow-y-auto rounded-xl border border-muted-200 bg-white py-1 shadow-xl">
          <p className="px-3 py-2 text-xs font-medium text-muted-400">
            Themed templates
          </p>
          {TEMPLATE_SLIDE_TYPE_OPTIONS.map(({ type, label }) => (
            <button
              key={type}
              type="button"
              onClick={() => handleAddTemplate(type)}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-muted-700 hover:bg-muted-50"
            >
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: accentColor }}
              />
              {label}
            </button>
          ))}

          <div className="my-1 border-t border-muted-100" />

          <p className="px-3 py-2 text-xs font-medium text-muted-400">
            Custom slides
          </p>
          {CUSTOM_SLIDE_TYPE_OPTIONS.map(({ label, layout }) => (
            <button
              key={layout}
              type="button"
              onClick={() => handleAddCustom(layout)}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-muted-700 hover:bg-muted-50"
            >
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded border border-muted-300 text-[10px] font-bold text-muted-500">
                +
              </span>
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
