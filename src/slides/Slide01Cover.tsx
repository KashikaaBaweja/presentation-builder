"use client";

import { EditableText } from "@/components/EditableText";
import { SlideFrame } from "@/components/SlideFrame";
import { usePresentationStore } from "@/store/usePresentationStore";

export function Slide01Cover() {
  const data = usePresentationStore((s) => s.data.cover);
  const updateData = usePresentationStore((s) => s.updateData);
  const accentColor = usePresentationStore((s) => s.accentColor);

  return (
    <SlideFrame variant="dark" showLogo>
      <div className="flex h-full flex-col justify-between p-16">
        <EditableText
          value={data.company}
          onChange={(company) => updateData((d) => ({ ...d, cover: { ...d.cover, company } }))}
          placeholder="Company name"
          className="text-lg font-medium tracking-widest uppercase text-white/70"
          as="div"
        />

        <div className="flex flex-col gap-6 max-w-4xl">
          <EditableText
            value={data.title}
            onChange={(title) => updateData((d) => ({ ...d, cover: { ...d.cover, title } }))}
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
            onChange={(tagline) => updateData((d) => ({ ...d, cover: { ...d.cover, tagline } }))}
            placeholder="Tagline or subtitle"
            className="text-2xl leading-relaxed text-white/80"
            multiline
            as="p"
          />
        </div>

        <EditableText
          value={data.date}
          onChange={(date) => updateData((d) => ({ ...d, cover: { ...d.cover, date } }))}
          placeholder="Date"
          className="text-base font-medium text-white/50"
          as="div"
        />
      </div>
    </SlideFrame>
  );
}
