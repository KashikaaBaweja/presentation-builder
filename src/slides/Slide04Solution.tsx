"use client";

import { EditableText } from "@/components/EditableText";
import { SlideFrame } from "@/components/SlideFrame";
import { resolveSolutionLayout } from "@/lib/layouts";
import { useSlideData } from "@/hooks/useSlideData";
import { usePresentationStore } from "@/store/usePresentationStore";

export function Slide04Solution() {
  const { data, update } = useSlideData("solution");
  const accentColor = usePresentationStore((s) => s.accentColor);
  const showLogo = usePresentationStore((s) => s.showLogoOnAllSlides);
  const layout = resolveSolutionLayout(data.layout);

  return (
    <SlideFrame variant="light" showLogo={showLogo}>
      <div className="flex h-full flex-col p-16">
        <EditableText
          value={data.headline}
          onChange={(headline) => update((d) => ({ ...d, headline }))}
          placeholder="Solution headline"
          className="font-heading mb-12 text-center text-5xl font-bold tracking-tight text-muted-900"
          as="h2"
        />

        {layout === "stacked" ? (
          <div className="flex flex-1 flex-col justify-center gap-4">
            {data.cards.map((card, i) => (
              <div
                key={i}
                className="flex items-center gap-6 rounded-2xl bg-white px-8 py-6 shadow-sm ring-1 ring-muted-100"
              >
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl font-bold text-white"
                  style={{ backgroundColor: accentColor }}
                >
                  {i + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <EditableText
                    value={card.title}
                    onChange={(title) =>
                      update((d) => {
                        const cards = [...d.cards];
                        cards[i] = { ...cards[i], title };
                        return { ...d, cards };
                      })
                    }
                    placeholder="Card title"
                    className="font-heading mb-1 text-xl font-bold text-muted-900"
                    as="h3"
                  />
                  <EditableText
                    value={card.description}
                    onChange={(description) =>
                      update((d) => {
                        const cards = [...d.cards];
                        cards[i] = { ...cards[i], description };
                        return { ...d, cards };
                      })
                    }
                    placeholder="Card description"
                    className="text-sm leading-relaxed text-muted-600"
                    multiline
                    as="p"
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid flex-1 grid-cols-3 gap-8">
            {data.cards.map((card, i) => (
              <div
                key={i}
                className="flex flex-col rounded-2xl bg-white p-8 shadow-md ring-1 ring-muted-100"
              >
                <div
                  className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl text-2xl font-bold text-white"
                  style={{ backgroundColor: accentColor }}
                >
                  {i + 1}
                </div>
                <EditableText
                  value={card.title}
                  onChange={(title) =>
                    update((d) => {
                      const cards = [...d.cards];
                      cards[i] = { ...cards[i], title };
                      return { ...d, cards };
                    })
                  }
                  placeholder="Card title"
                  className="font-heading mb-4 text-2xl font-bold text-muted-900"
                  as="h3"
                />
                <EditableText
                  value={card.description}
                  onChange={(description) =>
                    update((d) => {
                      const cards = [...d.cards];
                      cards[i] = { ...cards[i], description };
                      return { ...d, cards };
                    })
                  }
                  placeholder="Card description"
                  className="flex-1 text-base leading-relaxed text-muted-600"
                  multiline
                  as="p"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </SlideFrame>
  );
}
