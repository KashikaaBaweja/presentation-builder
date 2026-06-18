import { defaultPresentationData } from "@/store/defaults";
import type { SlideDataMap } from "@/store/types";

/** Template JSON shape for AI-generated deck content (keyed by slide type). */
export const initialContent: SlideDataMap = defaultPresentationData;

export type InitialContent = typeof initialContent;
