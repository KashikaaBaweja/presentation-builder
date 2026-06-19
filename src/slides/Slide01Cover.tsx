"use client";

import { EditableText } from "@/components/EditableText";
import { SlideFrame } from "@/components/SlideFrame";
import { resolveCoverLayout } from "@/lib/layouts";
import { useSlideData } from "@/hooks/useSlideData";
import { usePresentationStore } from "@/store/usePresentationStore";

export function Slide01Cover() {
  const { data, update } = useSlideData("cover");
  const accentColor = usePresentationStore((s) => s.accentColor);
  const layout = resolveCoverLayout(data.layout);

  if (layout === "centered") {
    return (
      <SlideFrame variant="light" plain showLogo>
        <div className="flex h-full flex-col items-center justify-center gap-8 p-16 text-center">
          <EditableText
            value={data.company}
            onChange={(company) => update((d) => ({ ...d, company }))}
            placeholder="Company name"
            className="text-sm font-medium tracking-widest uppercase text-muted-500"
            as="div"
          />
          <div className="flex max-w-3xl flex-col items-center gap-6">
            <EditableText
              value={data.title}
              onChange={(title) => update((d) => ({ ...d, title }))}
              placeholder="Presentation title"
              className="font-heading text-6xl font-bold leading-tight tracking-tight text-muted-900"
              as="h1"
            />
            <div
              className="h-1 w-32 rounded-full"
              style={{ backgroundColor: accentColor }}
            />
            <EditableText
              value={data.tagline}
              onChange={(tagline) => update((d) => ({ ...d, tagline }))}
              placeholder="Tagline or subtitle"
              className="text-xl leading-relaxed text-muted-600"
              multiline
              as="p"
            />
          </div>
          <EditableText
            value={data.date}
            onChange={(date) => update((d) => ({ ...d, date }))}
            placeholder="Date"
            className="text-sm font-medium text-muted-400"
            as="div"
          />
        </div>
      </SlideFrame>
    );
  }

  return (
    <SlideFrame variant="dark" showLogo>
      <div className="flex h-full flex-col justify-between p-16">
        <EditableText
          value={data.company}
          onChange={(company) => update((d) => ({ ...d, company }))}
          placeholder="Company name"
          className="text-lg font-medium tracking-widest uppercase text-white/70"
          as="div"
        />

        <div className="flex max-w-4xl flex-col gap-6">
          <EditableText
            value={data.title}
            onChange={(title) => update((d) => ({ ...d, title }))}
            placeholder="Presentation title"
            className="font-heading text-7xl font-bold leading-[1.05] tracking-tight text-white"
            as="h1"
          />
          <div
            className="h-1.5 w-24 rounded-full"
            style={{ backgroundColor: accentColor }}
          />
          <EditableText
            value={data.tagline}
            onChange={(tagline) => update((d) => ({ ...d, tagline }))}
            placeholder="Tagline or subtitle"
            className="text-2xl leading-relaxed text-white/80"
            multiline
            as="p"
          />
        </div>

        <EditableText
          value={data.date}
          onChange={(date) => update((d) => ({ ...d, date }))}
          placeholder="Date"
          className="text-base font-medium text-white/50"
          as="div"
        />
      </div>
    </SlideFrame>
  );
}
