"use client";

import { EditableText } from "@/components/EditableText";
import { SlideFrame } from "@/components/SlideFrame";
import { usePresentationStore } from "@/store/usePresentationStore";

export function Slide04Solution() {
  const { headline, cards } = usePresentationStore((s) => s.data.solution);
  const updateData = usePresentationStore((s) => s.updateData);
  const accentColor = usePresentationStore((s) => s.accentColor);
  const showLogo = usePresentationStore((s) => s.showLogoOnAllSlides);

  return (
    <SlideFrame variant="light" showLogo={showLogo}>
      <div className="flex h-full flex-col p-16">
        <EditableText
          value={headline}
          onChange={(h) =>
            updateData((d) => ({ ...d, solution: { ...d.solution, headline: h } }))
          }
          placeholder="Solution headline"
          className="font-heading mb-12 text-center text-5xl font-bold tracking-tight text-muted-900"
          as="h2"
        />

        <div className="grid flex-1 grid-cols-3 gap-8">
          {cards.map((card, i) => (
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
                  updateData((d) => {
                    const newCards = [...d.solution.cards];
                    newCards[i] = { ...newCards[i], title };
                    return { ...d, solution: { ...d.solution, cards: newCards } };
                  })
                }
                placeholder="Card title"
                className="font-heading mb-4 text-2xl font-bold text-muted-900"
                as="h3"
              />
              <EditableText
                value={card.description}
                onChange={(description) =>
                  updateData((d) => {
                    const newCards = [...d.solution.cards];
                    newCards[i] = { ...newCards[i], description };
                    return { ...d, solution: { ...d.solution, cards: newCards } };
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
      </div>
    </SlideFrame>
  );
}
