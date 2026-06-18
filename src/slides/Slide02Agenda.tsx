"use client";

import { EditableText } from "@/components/EditableText";
import { SlideFrame } from "@/components/SlideFrame";
import { usePresentationStore } from "@/store/usePresentationStore";

export function Slide02Agenda() {
  const items = usePresentationStore((s) => s.data.agenda.items);
  const updateData = usePresentationStore((s) => s.updateData);
  const accentColor = usePresentationStore((s) => s.accentColor);
  const showLogo = usePresentationStore((s) => s.showLogoOnAllSlides);

  const updateItem = (index: number, value: string) => {
    updateData((d) => {
      const newItems = [...d.agenda.items];
      newItems[index] = value;
      return { ...d, agenda: { items: newItems } };
    });
  };

  return (
    <SlideFrame variant="light" showLogo={showLogo}>
      <div className="flex h-full p-16">
        <div className="flex w-2/5 flex-col justify-center pr-12">
          <span
            className="mb-4 text-sm font-semibold uppercase tracking-widest"
            style={{ color: accentColor }}
          >
            Overview
          </span>
          <h2 className="font-heading text-5xl font-bold tracking-tight text-muted-900">
            Agenda
          </h2>
          <p className="mt-4 text-lg text-muted-500">
            What we&apos;ll cover today
          </p>
        </div>

        <div className="flex w-3/5 flex-col justify-center gap-5">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-6 rounded-2xl bg-white px-8 py-5 shadow-sm ring-1 ring-muted-100"
            >
              <span
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg font-bold text-white"
                style={{ backgroundColor: accentColor }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <EditableText
                value={item}
                onChange={(v) => updateItem(i, v)}
                placeholder={`Agenda item ${i + 1}`}
                className="flex-1 text-xl font-medium text-muted-800"
                as="div"
              />
            </div>
          ))}
        </div>
      </div>
    </SlideFrame>
  );
}
