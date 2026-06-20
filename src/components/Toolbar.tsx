"use client";

import { AccountMenu } from "@/components/AccountMenu";
import { AdminHeaderLink } from "@/components/admin/AdminHeaderLink";
import { AppLogo } from "@/components/AppLogo";
import { GenerateTopicModal } from "@/components/GenerateTopicModal";
import { AddSlideMenu } from "@/components/AddSlideMenu";
import { BrandMenu } from "@/components/toolbar/BrandMenu";
import { DesignToolbar } from "@/components/toolbar/DesignToolbar";
import { ToolbarButton } from "@/components/toolbar/ToolbarPrimitives";
import { saveDeckForUser } from "@/lib/decks/decks";
import { exportPresentationToPdf } from "@/lib/exportPdf";
import { createClient } from "@/lib/supabase/client";
import { usePresentationStore } from "@/store/usePresentationStore";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

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
  const isExporting = usePresentationStore((s) => s.isExporting);
  const setIsExporting = usePresentationStore((s) => s.setIsExporting);
  const resetPresentation = usePresentationStore((s) => s.resetPresentation);
  const deckId = usePresentationStore((s) => s.deckId);
  const setDeckId = usePresentationStore((s) => s.setDeckId);
  const isSaving = usePresentationStore((s) => s.isSaving);
  const setIsSaving = usePresentationStore((s) => s.setIsSaving);
  const getSavePayload = usePresentationStore((s) => s.getSavePayload);

  const [generateOpen, setGenerateOpen] = useState(false);

  const handleExport = useCallback(async () => {
    setIsExporting(true);
    try {
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

      <header className="sticky top-0 z-40 border-b border-muted-200 bg-white/95 backdrop-blur-sm">
        <div className="flex h-12 items-center justify-between gap-3 px-4">
          <div className="flex min-w-0 shrink-0 items-center gap-2.5">
            <AppLogo size={32} />
            <div className="hidden min-w-0 sm:block">
              <p className="truncate text-sm font-semibold text-muted-900">
                Presentation Builder
              </p>
              <p className="text-[11px] text-muted-400">
                Add slides · Reorder · Generate from topic
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <BrandMenu />

            {userEmail && !readOnlyDeck && (
              <>
                <ToolbarButton
                  onClick={() => setGenerateOpen(true)}
                  title="Generate a full deck from a topic using AI"
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
                    <path d="M12 3v2" />
                    <path d="m6.8 6.8 1.4 1.4" />
                    <path d="M3 12h2" />
                    <path d="m6.8 17.2 1.4-1.4" />
                    <path d="M12 19v2" />
                    <path d="m17.2 17.2-1.4-1.4" />
                    <path d="M19 12h2" />
                    <path d="m17.2 6.8-1.4 1.4" />
                    <circle cx="12" cy="12" r="4" />
                  </svg>
                  <span className="hidden sm:inline">Generate from topic</span>
                  <span className="sm:hidden">Generate</span>
                </ToolbarButton>

                <AddSlideMenu variant="toolbar" />

                <ToolbarButton
                  onClick={() => {
                    if (
                      window.confirm(
                        "Reset this presentation to the default deck?"
                      )
                    ) {
                      resetPresentation();
                    }
                  }}
                  title="Reset presentation"
                >
                  Reset
                </ToolbarButton>
              </>
            )}

            {userEmail && (
              <>
                <ToolbarButton
                  onClick={handleSave}
                  disabled={isSaving || readOnlyDeck}
                  title={
                    readOnlyDeck
                      ? "Saving is disabled while viewing another user's deck"
                      : "Save presentation"
                  }
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
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                    <polyline points="17 21 17 13 7 13 7 21" />
                    <polyline points="7 3 7 8 15 8" />
                  </svg>
                  {isSaving ? "Saving…" : "Save"}
                </ToolbarButton>
              </>
            )}

            <button
              type="button"
              onClick={handleExport}
              disabled={isExporting}
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-60"
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
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              {isExporting ? "Exporting…" : "Export PDF"}
            </button>

            {userEmail && (
              <>
                {isAdmin && <AdminHeaderLink />}
                <AccountMenu email={userEmail} isAdmin={isAdmin} />
              </>
            )}
          </div>
        </div>

        <div className="flex items-center justify-center overflow-x-auto border-t border-muted-100 bg-muted-50/60 px-4 py-2">
          <DesignToolbar canManageSlides={!readOnlyDeck} />
        </div>
      </header>
    </>
  );
}
