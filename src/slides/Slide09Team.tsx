"use client";

import { EditableText } from "@/components/EditableText";
import { SlideFrame } from "@/components/SlideFrame";
import { useSlideData } from "@/hooks/useSlideData";
import { usePresentationStore } from "@/store/usePresentationStore";

export function Slide09Team() {
  const { data, update } = useSlideData("team");
  const accentColor = usePresentationStore((s) => s.accentColor);
  const showLogo = usePresentationStore((s) => s.showLogoOnAllSlides);

  return (
    <SlideFrame variant="light" showLogo={showLogo}>
      <div className="flex h-full flex-col p-16">
        <EditableText
          value={data.headline}
          onChange={(headline) => update((d) => ({ ...d, headline }))}
          placeholder="Section headline"
          className="font-heading mb-12 text-center text-5xl font-bold tracking-tight text-muted-900"
          as="h2"
        />

        <div className="grid flex-1 grid-cols-4 items-center gap-8">
          {data.members.map((member, i) => (
            <div
              key={i}
              className="flex flex-col items-center rounded-2xl bg-white p-8 shadow-sm ring-1 ring-muted-100"
            >
              <div
                className="mb-5 flex h-28 w-28 items-center justify-center rounded-full text-3xl font-bold text-white shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${accentColor}, ${accentColor}99)`,
                }}
              >
                <EditableText
                  value={member.initials}
                  onChange={(initials) =>
                    update((d) => {
                      const members = [...d.members];
                      members[i] = { ...members[i], initials };
                      return { ...d, members };
                    })
                  }
                  placeholder="AB"
                  className="text-center text-white"
                  as="div"
                />
              </div>
              <EditableText
                value={member.name}
                onChange={(name) =>
                  update((d) => {
                    const members = [...d.members];
                    members[i] = { ...members[i], name };
                    return { ...d, members };
                  })
                }
                placeholder="Name"
                className="font-heading mb-1 text-center text-xl font-bold text-muted-900"
                as="h3"
              />
              <EditableText
                value={member.role}
                onChange={(role) =>
                  update((d) => {
                    const members = [...d.members];
                    members[i] = { ...members[i], role };
                    return { ...d, members };
                  })
                }
                placeholder="Role"
                className="text-center text-sm text-muted-500"
                as="div"
              />
            </div>
          ))}
        </div>
      </div>
    </SlideFrame>
  );
}
