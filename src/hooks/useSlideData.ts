"use client";

import { useSlideId } from "@/components/SlideContext";
import { createSlideData } from "@/store/slideTemplates";
import { usePresentationStore } from "@/store/usePresentationStore";
import type { SlideDataMap, SlideType } from "@/store/types";
import { useEffect } from "react";

export function useSlideData<T extends SlideType>(type: T) {
  const slideId = useSlideId();
  const data = usePresentationStore(
    (s) => s.slideData[slideId] as SlideDataMap[T] | undefined
  );
  const updateSlideData = usePresentationStore((s) => s.updateSlideData);
  const repairSlideData = usePresentationStore((s) => s.repairSlideData);

  useEffect(() => {
    if (!data) {
      repairSlideData(slideId, type);
    }
  }, [data, slideId, type, repairSlideData]);

  const safeData = data ?? createSlideData(type);

  const update = (updater: (current: SlideDataMap[T]) => SlideDataMap[T]) => {
    updateSlideData(slideId, updater);
  };

  return { slideId, data: safeData, update };
}
