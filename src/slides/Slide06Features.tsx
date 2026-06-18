"use client";

import { EditableText } from "@/components/EditableText";
import { SlideFrame } from "@/components/SlideFrame";
import { usePresentationStore } from "@/store/usePresentationStore";

const FEATURE_ICONS = ["✦", "◈", "◎", "⬡", "◆", "▣"];

export function Slide06Features() {
  const { headline, items } = usePresentationStore((s) => s.data.features);
  const updateData = usePresentationStore((s) => s.updateData);
  const accentColor = usePresentationStore((s) => s.accentColor);
  const showLogo = usePresentationStore((s) => s.showLogoOnAllSlides);

  return (
    <SlideFrame variant="light" showLogo={showLogo}>
      <div className="flex h-full flex-col p-16">
        <EditableText
          value={headline}
          onChange={(h) =>
            updateData((d) => ({ ...d, features: { ...d.features, headline: h } }))
          }
          placeholder="Section headline"
          className="font-heading mb-10 text-5xl font-bold tracking-tight text-muted-900"
          as="h2"
        />

        <div className="grid flex-1 grid-cols-3 grid-rows-2 gap-6">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex flex-col rounded-2xl bg-white p-6 shadow-sm ring-1 ring-muted-100"
            >
              <span
                className="mb-4 text-2xl"
                style={{ color: accentColor }}
              >
                {FEATURE_ICONS[i]}
              </span>
              <EditableText
                value={item.title}
                onChange={(title) =>
                  updateData((d) => {
                    const newItems = [...d.features.items];
                    newItems[i] = { ...newItems[i], title };
                    return { ...d, features: { ...d.features, items: newItems } };
                  })
                }
                placeholder="Feature title"
                className="font-heading mb-2 text-lg font-bold text-muted-900"
                as="h3"
              />
              <EditableText
                value={item.description}
                onChange={(description) =>
                  updateData((d) => {
                    const newItems = [...d.features.items];
                    newItems[i] = { ...newItems[i], description };
                    return { ...d, features: { ...d.features, items: newItems } };
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
