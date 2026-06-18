"use client";

import { EditableText } from "@/components/EditableText";
import { SlideFrame } from "@/components/SlideFrame";
import { useSlideData } from "@/hooks/useSlideData";
import { usePresentationStore } from "@/store/usePresentationStore";

export function Slide03Problem() {
  const { data, update } = useSlideData("problem");
  const accentColor = usePresentationStore((s) => s.accentColor);
  const showLogo = usePresentationStore((s) => s.showLogoOnAllSlides);

  const updateParagraph = (index: number, value: string) => {
    update((d) => {
      const paragraphs = [...d.paragraphs];
      paragraphs[index] = value;
      return { ...d, paragraphs };
    });
  };

  return (
    <SlideFrame variant="light" showLogo={showLogo}>
      <div className="flex h-full p-16 gap-12">
        <div className="flex w-2/5 flex-col justify-center">
          <div
            className="mb-8 flex h-20 w-20 items-center justify-center rounded-2xl text-4xl shadow-lg"
            style={{ backgroundColor: `${accentColor}15`, color: accentColor }}
          >
            ⚠
          </div>
          <EditableText
            value={data.headline}
            onChange={(headline) => update((d) => ({ ...d, headline }))}
            placeholder="Problem headline"
            className="font-heading text-5xl font-bold leading-tight tracking-tight text-muted-900"
            multiline
            as="h2"
          />
        </div>

        <div className="flex w-3/5 flex-col justify-center gap-6">
          {data.paragraphs.map((p, i) => (
            <EditableText
              key={i}
              value={p}
              onChange={(v) => updateParagraph(i, v)}
              placeholder={`Supporting paragraph ${i + 1}`}
              className="text-lg leading-relaxed text-muted-600"
              multiline
              as="p"
            />
          ))}
        </div>
      </div>
    </SlideFrame>
  );
}
