"use client";

import { EditableText } from "@/components/EditableText";
import { SlideFrame } from "@/components/SlideFrame";
import { usePresentationStore } from "@/store/usePresentationStore";

export function Slide09Team() {
  const { headline, members } = usePresentationStore((s) => s.data.team);
  const updateData = usePresentationStore((s) => s.updateData);
  const accentColor = usePresentationStore((s) => s.accentColor);
  const showLogo = usePresentationStore((s) => s.showLogoOnAllSlides);

  return (
    <SlideFrame variant="light" showLogo={showLogo}>
      <div className="flex h-full flex-col p-16">
        <EditableText
          value={headline}
          onChange={(h) =>
            updateData((d) => ({ ...d, team: { ...d.team, headline: h } }))
          }
          placeholder="Section headline"
          className="font-heading mb-12 text-center text-5xl font-bold tracking-tight text-muted-900"
          as="h2"
        />

        <div className="grid flex-1 grid-cols-4 gap-8 items-center">
          {members.map((member, i) => (
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
                    updateData((d) => {
                      const newMembers = [...d.team.members];
                      newMembers[i] = { ...newMembers[i], initials };
                      return { ...d, team: { ...d.team, members: newMembers } };
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
                  updateData((d) => {
                    const newMembers = [...d.team.members];
                    newMembers[i] = { ...newMembers[i], name };
                    return { ...d, team: { ...d.team, members: newMembers } };
                  })
                }
                placeholder="Name"
                className="font-heading mb-1 text-xl font-bold text-muted-900 text-center"
                as="h3"
              />
              <EditableText
                value={member.role}
                onChange={(role) =>
                  updateData((d) => {
                    const newMembers = [...d.team.members];
                    newMembers[i] = { ...newMembers[i], role };
                    return { ...d, team: { ...d.team, members: newMembers } };
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
