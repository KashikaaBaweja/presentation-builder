"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  DEFAULT_ACCENT,
  DEFAULT_INK,
  DEFAULT_PAPER,
} from "@/lib/constants";
import type { InitialContent } from "@/lib/initialContent";
import { getDeckTitle } from "@/lib/decks/utils";
import type { DeckRow } from "@/lib/decks/types";
import type { DeckSavePayload } from "@/lib/decks/types";
import {
  CUSTOM_THEME_ID,
  DEFAULT_THEME_ID,
  getDefaultTheme,
  getThemeById,
} from "@/lib/themes";
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
  addSlide: (type: SlideType, overrides?: Partial<SlideContent>) => void;
  removeSlide: (slideId: string) => void;
  setAccentColor: (color: string) => void;
  setTheme: (themeId: string) => void;
  setLogoUrl: (url: string | null) => void;
  setShowLogoOnAllSlides: (show: boolean) => void;
  setIsExporting: (exporting: boolean) => void;
  resetPresentation: () => void;
  repairSlideData: (slideId: string, type: SlideType) => void;
  setDeckId: (deckId: string | null) => void;
  setIsSaving: (isSaving: boolean) => void;
  setIsLoadingDeck: (isLoading: boolean) => void;
  hydrateFromDeck: (deck: DeckRow) => void;
  prepareNewDeck: () => void;
  getSavePayload: () => DeckSavePayload;
  setAllContent: (content: InitialContent) => void;
}

type Store = typeof initialDeck & {
  currentSlide: number;
  accentColor: string;
  inkColor: string;
  paperColor: string;
  themeId: string;
  logoUrl: string | null;
  showLogoOnAllSlides: boolean;
  isExporting: boolean;
  deckId: string | null;
  isSaving: boolean;
  isLoadingDeck: boolean;
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
      inkColor: DEFAULT_INK,
      paperColor: DEFAULT_PAPER,
      themeId: DEFAULT_THEME_ID,
      logoUrl: null,
      showLogoOnAllSlides: false,
      isExporting: false,
      deckId: null,
      isSaving: false,
      isLoadingDeck: false,

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

      addSlide: (type, overrides) => {
        const id = createSlideId();
        const data = {
          ...createSlideData(type),
          ...(overrides ?? {}),
        } as SlideContent;

        set((state) => {
          const insertAt = state.currentSlide + 1;
          const slides = [...state.slides];
          slides.splice(insertAt, 0, { id, type });
          return {
            slides,
            slideData: { ...state.slideData, [id]: data },
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

      setAccentColor: (color) =>
        set({ accentColor: color, themeId: CUSTOM_THEME_ID }),

      setTheme: (themeId) => {
        const preset = getThemeById(themeId);
        if (!preset) return;
        set({
          themeId: preset.id,
          accentColor: preset.accent,
          inkColor: preset.ink,
          paperColor: preset.paper,
        });
      },

      setLogoUrl: (url) => set({ logoUrl: url }),

      setShowLogoOnAllSlides: (show) => set({ showLogoOnAllSlides: show }),

      setIsExporting: (exporting) => set({ isExporting: exporting }),

      resetPresentation: () => {
        const deck = createInitialDeck();
        const defaultTheme = getDefaultTheme();
        set({
          ...deck,
          currentSlide: 0,
          accentColor: defaultTheme.accent,
          inkColor: defaultTheme.ink,
          paperColor: defaultTheme.paper,
          themeId: defaultTheme.id,
          logoUrl: null,
          showLogoOnAllSlides: false,
          deckId: get().deckId,
        });
      },

      setDeckId: (deckId) => set({ deckId }),

      setIsSaving: (isSaving) => set({ isSaving }),

      setIsLoadingDeck: (isLoadingDeck) => set({ isLoadingDeck }),

      hydrateFromDeck: (deck) => {
        const { slides, slideData } = normalizeDeck(
          deck.content.slides,
          deck.content.slideData
        );

        const preset = deck.theme_id ? getThemeById(deck.theme_id) : undefined;

        if (preset) {
          set({
            slides,
            slideData,
            currentSlide: 0,
            accentColor: preset.accent,
            inkColor: preset.ink,
            paperColor: preset.paper,
            themeId: preset.id,
            logoUrl: deck.logo,
            showLogoOnAllSlides: deck.content.showLogoOnAllSlides ?? false,
            deckId: deck.id,
            isLoadingDeck: false,
          });
          return;
        }

        set({
          slides,
          slideData,
          currentSlide: 0,
          accentColor: deck.accent ?? DEFAULT_ACCENT,
          inkColor: deck.content.ink ?? DEFAULT_INK,
          paperColor: deck.content.paper ?? DEFAULT_PAPER,
          themeId: CUSTOM_THEME_ID,
          logoUrl: deck.logo,
          showLogoOnAllSlides: deck.content.showLogoOnAllSlides ?? false,
          deckId: deck.id,
          isLoadingDeck: false,
        });
      },

      prepareNewDeck: () => {
        const deck = createInitialDeck();
        const defaultTheme = getDefaultTheme();
        set({
          ...deck,
          currentSlide: 0,
          accentColor: defaultTheme.accent,
          inkColor: defaultTheme.ink,
          paperColor: defaultTheme.paper,
          themeId: defaultTheme.id,
          logoUrl: null,
          showLogoOnAllSlides: false,
          deckId: null,
          isLoadingDeck: false,
        });
      },

      getSavePayload: () => {
        const state = get();
        return {
          title: getDeckTitle(state.slides, state.slideData),
          content: {
            slides: state.slides,
            slideData: state.slideData,
            showLogoOnAllSlides: state.showLogoOnAllSlides,
            ink: state.inkColor,
            paper: state.paperColor,
          },
          theme_id:
            state.themeId === CUSTOM_THEME_ID ? null : state.themeId,
          accent: state.accentColor,
          logo: state.logoUrl,
        };
      },

      setAllContent: (content) =>
        set((state) => {
          const slideData = { ...state.slideData };
          for (const slide of state.slides) {
            const generated = content[slide.type];
            if (generated) {
              slideData[slide.id] = structuredClone(
                generated
              ) as SlideContent;
            }
          }
          return { slideData, currentSlide: 0 };
        }),

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
        inkColor: state.inkColor,
        paperColor: state.paperColor,
        themeId: state.themeId,
        logoUrl: state.logoUrl,
        showLogoOnAllSlides: state.showLogoOnAllSlides,
      }),
      merge: (persisted, current) => {
        const saved = persisted as Partial<Store> | undefined;
        if (!saved) return current;
        const { slides, slideData } = normalizeDeck(saved.slides, saved.slideData);
        const defaultTheme = getDefaultTheme();
        return {
          ...current,
          ...saved,
          slides,
          slideData,
          inkColor: saved.inkColor ?? defaultTheme.ink,
          paperColor: saved.paperColor ?? defaultTheme.paper,
          themeId: saved.themeId ?? defaultTheme.id,
          currentSlide: clampSlideIndex(current.currentSlide, slides.length),
        };
      },
    }
  )
);
