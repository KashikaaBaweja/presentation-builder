"use client";

import { EditableText } from "@/components/EditableText";
import { SlideFrame } from "@/components/SlideFrame";
import { useSlideData } from "@/hooks/useSlideData";
import { usePresentationStore } from "@/store/usePresentationStore";

const FEATURE_ICONS = ["✦", "◈", "◎", "⬡", "◆", "▣"];

export function Slide06Features() {
  const { data, update } = useSlideData("features");
  const accentColor = usePresentationStore((s) => s.accentColor);
  const showLogo = usePresentationStore((s) => s.showLogoOnAllSlides);

  return (
    <SlideFrame variant="light" showLogo={showLogo}>
      <div className="flex h-full flex-col p-16">
        <EditableText
          value={data.headline}
          onChange={(headline) => update((d) => ({ ...d, headline }))}
          placeholder="Section headline"
          className="font-heading mb-10 text-5xl font-bold tracking-tight text-muted-900"
          as="h2"
        />

        <div className="grid flex-1 grid-cols-3 grid-rows-2 gap-6">
          {data.items.map((item, i) => (
            <div
              key={i}
              className="flex flex-col rounded-2xl bg-white p-6 shadow-sm ring-1 ring-muted-100"
            >
              <span className="mb-4 text-2xl" style={{ color: accentColor }}>
                {FEATURE_ICONS[i]}
              </span>
              <EditableText
                value={item.title}
                onChange={(title) =>
                  update((d) => {
                    const items = [...d.items];
                    items[i] = { ...items[i], title };
                    return { ...d, items };
                  })
                }
                placeholder="Feature title"
                className="font-heading mb-2 text-lg font-bold text-muted-900"
                as="h3"
              />
              <EditableText
                value={item.description}
                onChange={(description) =>
                  update((d) => {
                    const items = [...d.items];
                    items[i] = { ...items[i], description };
                    return { ...d, items };
                  })
                }
                placeholder="Feature description"
                className="text-sm leading-relaxed text-muted-600"
                multiline
                as="p"
              />
            </div>
          ))}
        </div>
      </div>
    </SlideFrame>
  );
}
