"use client";

import { ToolbarButton } from "@/components/toolbar/ToolbarPrimitives";
import {
  CUSTOM_SLIDE_TYPE_OPTIONS,
  TEMPLATE_SLIDE_TYPE_OPTIONS,
} from "@/slides";
import { usePresentationStore } from "@/store/usePresentationStore";
import type { CustomLayout, SlideType } from "@/store/types";
import { useCallback, useEffect, useRef, useState } from "react";

function AddSlidePanel({ onSelect }: { onSelect: () => void }) {
  const addSlide = usePresentationStore((s) => s.addSlide);

  const handleAddTemplate = useCallback(
    (type: SlideType) => {
      addSlide(type);
      onSelect();
    },
    [addSlide, onSelect]
  );

  const handleAddCustom = useCallback(
    (layout: CustomLayout) => {
      addSlide("custom", { layout });
      onSelect();
    },
    [addSlide, onSelect]
  );

  return (
    <>
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
          <span className="h-2 w-2 shrink-0 rounded-full bg-brand" />
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
    </>
  );
}

export function AddSlideMenu({
  variant = "sidebar",
}: {
  variant?: "sidebar" | "toolbar";
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  const close = useCallback(() => setOpen(false), []);

  if (variant === "toolbar") {
    return (
      <div ref={menuRef} className="relative">
        <ToolbarButton
          active={open}
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-haspopup="menu"
          title="Add a new slide"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add slide
        </ToolbarButton>

        {open && (
          <div
            role="menu"
            className="absolute right-0 top-full z-50 mt-2 max-h-72 w-56 overflow-y-auto rounded-xl border border-muted-200 bg-white py-1 shadow-xl"
          >
            <AddSlidePanel onSelect={close} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div ref={menuRef} className="relative border-t border-muted-200 p-4">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        title="Add a new slide to your deck"
        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-brand/40 bg-brand/5 px-3 py-3 text-sm font-semibold text-brand transition-colors hover:border-brand/60 hover:bg-brand/10"
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand text-base leading-none text-white">
          +
        </span>
        Add slide
      </button>

      {open && (
        <div
          role="menu"
          className="absolute bottom-full left-4 right-4 z-50 mb-2 max-h-72 overflow-y-auto rounded-xl border border-muted-200 bg-white py-1 shadow-xl"
        >
          <AddSlidePanel onSelect={close} />
        </div>
      )}
    </div>
  );
}
