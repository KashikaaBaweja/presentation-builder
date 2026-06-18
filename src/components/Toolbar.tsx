"use client";

import { THEME_PRESETS } from "@/lib/constants";
import { exportPresentationToPdf } from "@/lib/exportPdf";
import { usePresentationStore } from "@/store/usePresentationStore";
import { useCallback, useRef } from "react";

export function Toolbar() {
  const accentColor = usePresentationStore((s) => s.accentColor);
  const setAccentColor = usePresentationStore((s) => s.setAccentColor);
  const logoUrl = usePresentationStore((s) => s.logoUrl);
  const setLogoUrl = usePresentationStore((s) => s.setLogoUrl);
  const showLogoOnAllSlides = usePresentationStore((s) => s.showLogoOnAllSlides);
  const setShowLogoOnAllSlides = usePresentationStore(
    (s) => s.setShowLogoOnAllSlides
  );
  const isExporting = usePresentationStore((s) => s.isExporting);
  const setIsExporting = usePresentationStore((s) => s.setIsExporting);
  const resetPresentation = usePresentationStore((s) => s.resetPresentation);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => setLogoUrl(reader.result as string);
      reader.readAsDataURL(file);
    },
    [setLogoUrl]
  );

  const handleExport = useCallback(async () => {
    setIsExporting(true);
    try {
      // Wait for PdfExportContainer to mount and paint all slides
      await new Promise((r) => setTimeout(r, 150));

      const container = document.getElementById("pdf-export-container");
      if (!container) {
        throw new Error("Export container not ready");
      }

      const slides = Array.from(
        container.querySelectorAll<HTMLElement>(".slide-frame")
      );
      await exportPresentationToPdf(slides);
    } catch (error) {
      console.error("PDF export failed:", error);
      alert("PDF export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  }, [setIsExporting]);

  return (
    <header className="flex items-center justify-between border-b border-muted-200 bg-white px-6 py-3">
      <div className="flex items-center gap-3">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-xl text-white text-sm font-bold"
          style={{ backgroundColor: accentColor }}
        >
          PB
        </div>
        <div>
          <h1 className="text-sm font-semibold text-muted-900">
            Presentation Builder
          </h1>
          <p className="text-xs text-muted-400">Click any text to edit</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-400">Theme</span>
          <div className="flex gap-1.5">
            {THEME_PRESETS.map((preset) => (
              <button
                key={preset.value}
                type="button"
                title={preset.name}
                onClick={() => setAccentColor(preset.value)}
                className={`h-7 w-7 rounded-full border-2 transition-transform hover:scale-110 ${
                  accentColor === preset.value
                    ? "border-muted-900 scale-110"
                    : "border-transparent"
                }`}
                style={{ backgroundColor: preset.value }}
              />
            ))}
          </div>
          <input
            type="color"
            value={accentColor}
            onChange={(e) => setAccentColor(e.target.value)}
            className="h-7 w-7 cursor-pointer rounded border-0 bg-transparent"
            title="Custom accent color"
          />
        </div>

        <div className="h-6 w-px bg-muted-200" />

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleLogoUpload}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="rounded-lg border border-muted-200 px-3 py-1.5 text-xs font-medium text-muted-600 hover:bg-muted-50"
        >
          {logoUrl ? "Change Logo" : "Upload Logo"}
        </button>
        {logoUrl && (
          <>
            <label className="flex items-center gap-1.5 text-xs text-muted-500">
              <input
                type="checkbox"
                checked={showLogoOnAllSlides}
                onChange={(e) => setShowLogoOnAllSlides(e.target.checked)}
                className="rounded"
              />
              All slides
            </label>
            <button
              type="button"
              onClick={() => setLogoUrl(null)}
              className="text-xs text-muted-400 hover:text-muted-600"
            >
              Remove
            </button>
          </>
        )}

        <div className="h-6 w-px bg-muted-200" />

        <button
          type="button"
          onClick={resetPresentation}
          className="rounded-lg border border-muted-200 px-3 py-1.5 text-xs font-medium text-muted-600 hover:bg-muted-50"
        >
          Reset
        </button>

        <button
          type="button"
          onClick={handleExport}
          disabled={isExporting}
          className="rounded-xl px-5 py-2 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-60"
          style={{ backgroundColor: accentColor }}
        >
          {isExporting ? "Exporting…" : "Export to PDF"}
        </button>
      </div>
    </header>
  );
}
