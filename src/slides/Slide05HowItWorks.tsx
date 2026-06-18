"use client";

import { EditableText } from "@/components/EditableText";
import { SlideFrame } from "@/components/SlideFrame";
import { useSlideData } from "@/hooks/useSlideData";
import { usePresentationStore } from "@/store/usePresentationStore";

export function Slide05HowItWorks() {
  const { data, update } = useSlideData("howItWorks");
  const accentColor = usePresentationStore((s) => s.accentColor);
  const showLogo = usePresentationStore((s) => s.showLogoOnAllSlides);

  return (
    <SlideFrame variant="light" showLogo={showLogo}>
      <div className="flex h-full flex-col p-16">
        <EditableText
          value={data.headline}
          onChange={(headline) => update((d) => ({ ...d, headline }))}
          placeholder="Section headline"
          className="font-heading mb-14 text-center text-5xl font-bold tracking-tight text-muted-900"
          as="h2"
        />

        <div className="relative flex flex-1 items-center justify-between gap-8 px-8">
          <div
            className="absolute top-16 left-[16%] right-[16%] h-0.5"
            style={{ backgroundColor: `${accentColor}30` }}
          />

          {data.steps.map((step, i) => (
            <div key={i} className="relative z-10 flex flex-1 flex-col items-center text-center">
              <div
                className="mb-6 flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold text-white shadow-lg"
                style={{ backgroundColor: accentColor }}
              >
                {i + 1}
              </div>
              <EditableText
                value={step.title}
                onChange={(title) =>
                  update((d) => {
                    const steps = [...d.steps];
                    steps[i] = { ...steps[i], title };
                    return { ...d, steps };
                  })
                }
                placeholder="Step title"
                className="font-heading mb-3 text-2xl font-bold text-muted-900"
                as="h3"
              />
              <EditableText
                value={step.description}
                onChange={(description) =>
                  update((d) => {
                    const steps = [...d.steps];
                    steps[i] = { ...steps[i], description };
                    return { ...d, steps };
                  })
                }
                placeholder="Step description"
                className="max-w-xs text-base leading-relaxed text-muted-600"
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
