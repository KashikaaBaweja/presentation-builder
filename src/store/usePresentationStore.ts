"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_ACCENT } from "@/lib/constants";
import { createInitialDeck } from "./initialDeck";
import { createSlideData, createSlideId } from "./slideTemplates";
import type { SlideContent, SlideDataMap, SlideType } from "./types";

const initialDeck = createInitialDeck();

interface PresentationActions {
  setCurrentSlide: (index: number) => void;
  nextSlide: () => void;
  prevSlide: () => void;
  updateSlideData: <T extends SlideType>(
    slideId: string,
    updater: (data: SlideDataMap[T]) => SlideDataMap[T]
  ) => void;
  addSlide: (type: SlideType) => void;
  removeSlide: (slideId: string) => void;
  setAccentColor: (color: string) => void;
  setLogoUrl: (url: string | null) => void;
  setShowLogoOnAllSlides: (show: boolean) => void;
  setIsExporting: (exporting: boolean) => void;
  resetPresentation: () => void;
  repairSlideData: (slideId: string, type: SlideType) => void;
}

type Store = typeof initialDeck & {
  currentSlide: number;
  accentColor: string;
  logoUrl: string | null;
  showLogoOnAllSlides: boolean;
  isExporting: boolean;
} & PresentationActions;

function clampSlideIndex(index: number, total: number) {
  return Math.max(0, Math.min(total - 1, index));
}

function normalizeDeck(
  slides: Store["slides"] | undefined,
  slideData: Store["slideData"] | undefined
) {
  const deck = createInitialDeck();
  const safeSlides = slides?.length ? slides : deck.slides;
  const safeData = { ...(slideData ?? {}) };

  for (const slide of safeSlides) {
    if (!safeData[slide.id]) {
      safeData[slide.id] = createSlideData(slide.type);
    }
  }

  return { slides: safeSlides, slideData: safeData };
}

export const usePresentationStore = create<Store>()(
  persist(
    (set, get) => ({
      ...initialDeck,
      currentSlide: 0,
      accentColor: DEFAULT_ACCENT,
      logoUrl: null,
      showLogoOnAllSlides: false,
      isExporting: false,

      setCurrentSlide: (index) => {
        const { slides } = get();
        set({ currentSlide: clampSlideIndex(index, slides.length) });
      },

      nextSlide: () => {
        const { currentSlide, slides } = get();
        if (currentSlide < slides.length - 1) {
          set({ currentSlide: currentSlide + 1 });
        }
      },

      prevSlide: () => {
        const { currentSlide } = get();
        if (currentSlide > 0) set({ currentSlide: currentSlide - 1 });
      },

      updateSlideData: (slideId, updater) =>
        set((state) => {
          const current = state.slideData[slideId];
          if (!current) return state;
          return {
            slideData: {
              ...state.slideData,
              [slideId]: updater(current as never) as SlideContent,
            },
          };
        }),

      addSlide: (type) => {
        const id = createSlideId();
        set((state) => {
          const insertAt = state.currentSlide + 1;
          const slides = [...state.slides];
          slides.splice(insertAt, 0, { id, type });
          return {
            slides,
            slideData: { ...state.slideData, [id]: createSlideData(type) },
            currentSlide: insertAt,
          };
        });
      },

      removeSlide: (slideId) => {
        set((state) => {
          if (state.slides.length <= 1) return state;
          const index = state.slides.findIndex((s) => s.id === slideId);
          if (index === -1) return state;

          const slides = state.slides.filter((s) => s.id !== slideId);
          const slideData = { ...state.slideData };
          delete slideData[slideId];

          let currentSlide = state.currentSlide;
          if (currentSlide >= slides.length) {
            currentSlide = slides.length - 1;
          } else if (index < currentSlide) {
            currentSlide -= 1;
          } else if (index === currentSlide) {
            currentSlide = clampSlideIndex(currentSlide, slides.length);
          }

          return { slides, slideData, currentSlide };
        });
      },

      setAccentColor: (color) => set({ accentColor: color }),

      setLogoUrl: (url) => set({ logoUrl: url }),

      setShowLogoOnAllSlides: (show) => set({ showLogoOnAllSlides: show }),

      setIsExporting: (exporting) => set({ isExporting: exporting }),

      resetPresentation: () => {
        const deck = createInitialDeck();
        set({
          ...deck,
          currentSlide: 0,
          accentColor: DEFAULT_ACCENT,
          logoUrl: null,
          showLogoOnAllSlides: false,
        });
      },

      repairSlideData: (slideId, type) =>
        set((state) => {
          if (state.slideData[slideId]) return state;
          return {
            slideData: {
              ...state.slideData,
              [slideId]: createSlideData(type),
            },
          };
        }),
    }),
    {
      name: "presentation-builder-storage-v2",
      partialize: (state) => ({
        slides: state.slides,
        slideData: state.slideData,
        accentColor: state.accentColor,
        logoUrl: state.logoUrl,
        showLogoOnAllSlides: state.showLogoOnAllSlides,
      }),
      merge: (persisted, current) => {
        const saved = persisted as Partial<Store> | undefined;
        if (!saved) return current;
        const { slides, slideData } = normalizeDeck(saved.slides, saved.slideData);
        return {
          ...current,
          ...saved,
          slides,
          slideData,
          currentSlide: clampSlideIndex(current.currentSlide, slides.length),
        };
      },
    }
  )
);
