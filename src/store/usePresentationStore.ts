"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_ACCENT } from "@/lib/constants";
import { defaultPresentationData } from "./defaults";
import type { PresentationData, PresentationState } from "./types";

interface PresentationActions {
  setCurrentSlide: (index: number) => void;
  nextSlide: () => void;
  prevSlide: () => void;
  updateData: (updater: (data: PresentationData) => PresentationData) => void;
  setAccentColor: (color: string) => void;
  setLogoUrl: (url: string | null) => void;
  setShowLogoOnAllSlides: (show: boolean) => void;
  setIsExporting: (exporting: boolean) => void;
  resetPresentation: () => void;
}

type Store = PresentationState & PresentationActions;

export const usePresentationStore = create<Store>()(
  persist(
    (set, get) => ({
      data: defaultPresentationData,
      currentSlide: 0,
      accentColor: DEFAULT_ACCENT,
      logoUrl: null,
      showLogoOnAllSlides: false,
      isExporting: false,

      setCurrentSlide: (index) =>
        set({ currentSlide: Math.max(0, Math.min(9, index)) }),

      nextSlide: () => {
        const { currentSlide } = get();
        if (currentSlide < 9) set({ currentSlide: currentSlide + 1 });
      },

      prevSlide: () => {
        const { currentSlide } = get();
        if (currentSlide > 0) set({ currentSlide: currentSlide - 1 });
      },

      updateData: (updater) =>
        set((state) => ({ data: updater(state.data) })),

      setAccentColor: (color) => set({ accentColor: color }),

      setLogoUrl: (url) => set({ logoUrl: url }),

      setShowLogoOnAllSlides: (show) => set({ showLogoOnAllSlides: show }),

      setIsExporting: (exporting) => set({ isExporting: exporting }),

      resetPresentation: () =>
        set({
          data: defaultPresentationData,
          currentSlide: 0,
          accentColor: DEFAULT_ACCENT,
          logoUrl: null,
          showLogoOnAllSlides: false,
        }),
    }),
    {
      name: "presentation-builder-storage",
      partialize: (state) => ({
        data: state.data,
        accentColor: state.accentColor,
        logoUrl: state.logoUrl,
        showLogoOnAllSlides: state.showLogoOnAllSlides,
      }),
    }
  )
);
