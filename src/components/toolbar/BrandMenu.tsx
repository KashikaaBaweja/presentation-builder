"use client";

import { ToolbarButton } from "@/components/toolbar/ToolbarPrimitives";
import { processLogoImage } from "@/lib/processLogoImage";
import { usePresentationStore } from "@/store/usePresentationStore";
import { useCallback, useEffect, useRef, useState } from "react";

export function BrandMenu() {
  const logoUrl = usePresentationStore((s) => s.logoUrl);
  const setLogoUrl = usePresentationStore((s) => s.setLogoUrl);
  const showLogoOnAllSlides = usePresentationStore((s) => s.showLogoOnAllSlides);
  const setShowLogoOnAllSlides = usePresentationStore(
    (s) => s.setShowLogoOnAllSlides
  );

  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleLogoUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      try {
        const dataUrl = await processLogoImage(file);
        setLogoUrl(dataUrl);
        setOpen(false);
      } catch (error) {
        console.error("Logo upload failed:", error);
        alert("Could not process that image. Try a smaller JPG or PNG.");
      }

      e.target.value = "";
    },
    [setLogoUrl]
  );

  return (
    <div ref={menuRef} className="relative">
      <ToolbarButton
        active={open || Boolean(logoUrl)}
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        title="Logo and branding"
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
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="m21 15-5-5L5 21" />
        </svg>
        Brand
      </ToolbarButton>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-muted-200 bg-white p-2 shadow-lg"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleLogoUpload}
          />

          {logoUrl ? (
            <div className="mb-2 flex items-center gap-2 rounded-lg bg-muted-50 p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoUrl}
                alt="Uploaded logo"
                className="h-8 w-auto max-w-[5rem] object-contain"
              />
              <span className="text-[11px] text-muted-500">Logo uploaded</span>
            </div>
          ) : (
            <p className="mb-2 px-1 text-[11px] leading-relaxed text-muted-500">
              Add a logo to your cover and slides.
            </p>
          )}

          <button
            type="button"
            role="menuitem"
            onClick={() => fileInputRef.current?.click()}
            className="flex w-full rounded-lg px-2 py-2 text-left text-sm text-muted-700 hover:bg-muted-50"
          >
            {logoUrl ? "Replace logo" : "Upload logo"}
          </button>

          {logoUrl && (
            <>
              <div className="my-1 border-t border-muted-100" />
              <label className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm text-muted-700 hover:bg-muted-50">
                <input
                  type="checkbox"
                  checked={showLogoOnAllSlides}
                  onChange={(e) => setShowLogoOnAllSlides(e.target.checked)}
                  className="rounded border-muted-300"
                />
                Show on all slides
              </label>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setLogoUrl(null);
                  setOpen(false);
                }}
                className="flex w-full rounded-lg px-2 py-2 text-left text-sm text-red-600 hover:bg-red-50"
              >
                Remove logo
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
