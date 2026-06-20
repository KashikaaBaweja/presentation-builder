"use client";

import { AdminViewBanner } from "@/components/AdminViewBanner";
import { DeckHydrator } from "@/components/DeckHydrator";
import { PdfExportContainer, SlidePreview } from "@/components/PresentationEditor";
import { SlideControls } from "@/components/SlideControls";
import { SlideSidebar } from "@/components/SlideSidebar";
import { ThemeSync } from "@/components/ThemeSync";
import { Toolbar } from "@/components/Toolbar";
import { usePresentationStore } from "@/store/usePresentationStore";
import { useSyncExternalStore } from "react";

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export function PresentationBuilder({
  userEmail,
  deckId,
  isAdmin = false,
  readOnlyDeck = false,
}: {
  userEmail: string;
  deckId: string | null;
  isAdmin?: boolean;
  readOnlyDeck?: boolean;
}) {
  const isClient = useIsClient();
  const isExporting = usePresentationStore((s) => s.isExporting);

  if (!isClient) {
    return (
      <div className="flex h-screen items-center justify-center bg-muted-50">
        <div className="text-sm text-muted-400">Loading presentation…</div>
      </div>
    );
  }

  return (
    <DeckHydrator deckId={deckId}>
      <ThemeSync />
      <div className="flex h-screen flex-col bg-muted-50">
        {readOnlyDeck && <AdminViewBanner />}
        <Toolbar
          userEmail={userEmail}
          isAdmin={isAdmin}
          readOnlyDeck={readOnlyDeck}
        />
        <div className="flex flex-1 overflow-hidden">
          <SlideSidebar
            canManageSlides={isAdmin && !readOnlyDeck}
          />
          <div className="flex flex-1 flex-col overflow-hidden">
            <SlidePreview />
            <SlideControls />
          </div>
        </div>
        {isExporting && <PdfExportContainer />}
      </div>
    </DeckHydrator>
  );
}
