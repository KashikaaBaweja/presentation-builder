"use client";

import { AccountMenu } from "@/components/AccountMenu";
import { AppLogo } from "@/components/AppLogo";
import { GenerateTopicModal } from "@/components/GenerateTopicModal";
import { LayoutPicker } from "@/components/LayoutPicker";
import { ThemePicker } from "@/components/ThemePicker";
import { saveDeckForUser } from "@/lib/decks/decks";
import { exportPresentationToPdf } from "@/lib/exportPdf";
import { createClient } from "@/lib/supabase/client";
import { usePresentationStore } from "@/store/usePresentationStore";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";

export function Toolbar({
  userEmail,
  isAdmin = false,
  readOnlyDeck = false,
}: {
  userEmail: string;
  isAdmin?: boolean;
  readOnlyDeck?: boolean;
}) {
  const router = useRouter();
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
  const deckId = usePresentationStore((s) => s.deckId);
  const setDeckId = usePresentationStore((s) => s.setDeckId);
  const isSaving = usePresentationStore((s) => s.isSaving);
  const setIsSaving = usePresentationStore((s) => s.setIsSaving);
  const getSavePayload = usePresentationStore((s) => s.getSavePayload);

  const [generateOpen, setGenerateOpen] = useState(false);
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

  const handleSave = useCallback(async () => {
    if (!userEmail || readOnlyDeck) return;

    setIsSaving(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Not signed in");
      }

      const payload = getSavePayload();
      const savedId = await saveDeckForUser(
        supabase,
        user.id,
        deckId,
        payload
      );

      setDeckId(savedId);

      if (!deckId) {
        router.replace(`/editor?deck=${savedId}`);
      }
    } catch (error) {
      console.error("Save failed:", error);
      alert("Save failed. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }, [deckId, getSavePayload, readOnlyDeck, router, setDeckId, setIsSaving, userEmail]);

  return (
    <>
      <GenerateTopicModal
        open={generateOpen}
        onClose={() => setGenerateOpen(false)}
      />
      <header className="flex items-center justify-between border-b border-muted-200 bg-white px-6 py-3">
      <div className="flex items-center gap-3">
        <AppLogo size={36} />
        <div>
          <h1 className="text-sm font-semibold text-muted-900">
            Presentation Builder
          </h1>
          <p className="text-xs text-muted-400">Click any text to edit</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex shrink-0 items-center gap-2">
          <ThemePicker />
          <LayoutPicker />
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

        {userEmail && (
          <button
            type="button"
            onClick={() => setGenerateOpen(true)}
            className="rounded-lg border border-muted-200 px-3 py-1.5 text-xs font-medium text-muted-600 hover:bg-muted-50"
          >
            Generate from topic
          </button>
        )}

        {userEmail && (
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || readOnlyDeck}
            title={
              readOnlyDeck
                ? "Saving is disabled while viewing another user's deck"
                : undefined
            }
            className="rounded-lg border border-muted-200 px-3 py-1.5 text-xs font-medium text-muted-600 hover:bg-muted-50 disabled:opacity-60"
          >
            {isSaving ? "Saving…" : "Save"}
          </button>
        )}

        <button
          type="button"
          onClick={handleExport}
          disabled={isExporting}
          className="rounded-xl px-5 py-2 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-60"
          style={{ backgroundColor: accentColor }}
        >
          {isExporting ? "Exporting…" : "Export to PDF"}
        </button>

        {userEmail && (
          <>
            <div className="h-6 w-px bg-muted-200" />
            <AccountMenu email={userEmail} isAdmin={isAdmin} />
          </>
        )}
      </div>
    </header>
    </>
  );
}
