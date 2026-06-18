"use client";

import { createContext, useContext } from "react";

const SlideContext = createContext<string | null>(null);

export function SlideProvider({
  slideId,
  children,
}: {
  slideId: string;
  children: React.ReactNode;
}) {
  return (
    <SlideContext.Provider value={slideId}>{children}</SlideContext.Provider>
  );
}

export function useSlideId(): string {
  const slideId = useContext(SlideContext);
  if (!slideId) {
    throw new Error("useSlideId must be used within SlideProvider");
  }
  return slideId;
}
