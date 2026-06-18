"use client";

import { SlideProvider } from "@/components/SlideContext";
import { SLIDE_COMPONENTS } from "@/slides";
import type { SlideType } from "@/store/types";

export function SlideRenderer({
  slideId,
  type,
}: {
  slideId: string;
  type: SlideType;
}) {
  const Component = SLIDE_COMPONENTS[type];
  return (
    <SlideProvider slideId={slideId}>
      <Component />
    </SlideProvider>
  );
}
