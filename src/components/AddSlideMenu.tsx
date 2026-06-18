"use client";

import { SLIDE_TYPE_OPTIONS } from "@/slides";
import { usePresentationStore } from "@/store/usePresentationStore";
import type { SlideType } from "@/store/types";
import { useCallback, useEffect, useRef, useState } from "react";

export function AddSlideMenu() {
  const addSlide = usePresentationStore((s) => s.addSlide);
  const accentColor = usePresentationStore((s) => s.accentColor);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleAdd = useCallback(
    (type: SlideType) => {
      addSlide(type);
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
        <div className="absolute bottom-full left-4 right-4 z-50 mb-2 max-h-64 overflow-y-auto rounded-xl border border-muted-200 bg-white py-1 shadow-xl">
          <p className="px-3 py-2 text-xs font-medium text-muted-400">
            Choose a themed layout
          </p>
          {SLIDE_TYPE_OPTIONS.map(({ type, label }) => (
            <button
              key={type}
              type="button"
              onClick={() => handleAdd(type)}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-muted-700 hover:bg-muted-50"
            >
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: accentColor }}
              />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
