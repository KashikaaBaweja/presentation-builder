"use client";

import { EditableText } from "@/components/EditableText";
import { SlideFrame } from "@/components/SlideFrame";
import { usePresentationStore } from "@/store/usePresentationStore";

export function Slide10CTA() {
  const data = usePresentationStore((s) => s.data.cta);
  const updateData = usePresentationStore((s) => s.updateData);
  const accentColor = usePresentationStore((s) => s.accentColor);

  return (
    <SlideFrame variant="dark" showLogo>
      <div className="flex h-full flex-col items-center justify-center p-16 text-center">
        <EditableText
          value={data.headline}
          onChange={(headline) =>
            updateData((d) => ({ ...d, cta: { ...d.cta, headline } }))
          }
          placeholder="Call to action headline"
          className="font-heading mb-6 max-w-4xl text-6xl font-bold leading-tight tracking-tight text-white"
          multiline
          as="h2"
        />

        <EditableText
          value={data.subtext}
          onChange={(subtext) =>
            updateData((d) => ({ ...d, cta: { ...d.cta, subtext } }))
          }
          placeholder="Supporting subtext"
          className="mb-10 max-w-2xl text-xl leading-relaxed text-white/70"
          multiline
          as="p"
        />

        <div
          className="mb-10 inline-flex items-center rounded-full px-10 py-4 text-lg font-semibold text-white shadow-xl"
          style={{ backgroundColor: accentColor }}
        >
          <EditableText
            value={data.buttonLabel}
            onChange={(buttonLabel) =>
              updateData((d) => ({ ...d, cta: { ...d.cta, buttonLabel } }))
            }
            placeholder="Button label"
            className="text-white"
            as="span"
          />
        </div>

        <div className="flex gap-12 text-white/60">
          <EditableText
            value={data.email}
            onChange={(email) =>
              updateData((d) => ({ ...d, cta: { ...d.cta, email } }))
            }
            placeholder="Email address"
            className="text-base"
            as="div"
          />
          <EditableText
            value={data.website}
            onChange={(website) =>
              updateData((d) => ({ ...d, cta: { ...d.cta, website } }))
            }
            placeholder="Website URL"
            className="text-base"
            as="div"
          />
        </div>
      </div>
    </SlideFrame>
  );
}
