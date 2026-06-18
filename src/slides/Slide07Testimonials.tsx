"use client";

import { EditableText } from "@/components/EditableText";
import { SlideFrame } from "@/components/SlideFrame";
import { usePresentationStore } from "@/store/usePresentationStore";

export function Slide07Testimonials() {
  const { headline, items } = usePresentationStore((s) => s.data.testimonials);
  const updateData = usePresentationStore((s) => s.updateData);
  const accentColor = usePresentationStore((s) => s.accentColor);
  const showLogo = usePresentationStore((s) => s.showLogoOnAllSlides);

  return (
    <SlideFrame variant="light" showLogo={showLogo}>
      <div className="flex h-full flex-col p-16">
        <EditableText
          value={headline}
          onChange={(h) =>
            updateData((d) => ({
              ...d,
              testimonials: { ...d.testimonials, headline: h },
            }))
          }
          placeholder="Section headline"
          className="font-heading mb-10 text-center text-5xl font-bold tracking-tight text-muted-900"
          as="h2"
        />

        <div className="grid flex-1 grid-cols-2 gap-8">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex flex-col justify-between rounded-2xl bg-white p-10 shadow-md ring-1 ring-muted-100"
            >
              <div>
                <span
                  className="mb-6 block text-5xl leading-none opacity-30"
                  style={{ color: accentColor }}
                >
                  &ldquo;
                </span>
                <EditableText
                  value={item.quote}
                  onChange={(quote) =>
                    updateData((d) => {
                      const newItems = [...d.testimonials.items];
                      newItems[i] = { ...newItems[i], quote };
                      return {
                        ...d,
                        testimonials: { ...d.testimonials, items: newItems },
                      };
                    })
                  }
                  placeholder="Testimonial quote"
                  className="text-xl leading-relaxed text-muted-700 italic"
                  multiline
                  as="p"
                />
              </div>

              <div className="mt-8 flex items-center gap-4 border-t border-muted-100 pt-6">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ backgroundColor: accentColor }}
                >
                  {item.name.charAt(0)}
                </div>
                <div>
                  <EditableText
                    value={item.name}
                    onChange={(name) =>
                      updateData((d) => {
                        const newItems = [...d.testimonials.items];
                        newItems[i] = { ...newItems[i], name };
                        return {
                          ...d,
                          testimonials: { ...d.testimonials, items: newItems },
                        };
                      })
                    }
                    placeholder="Name"
                    className="font-semibold text-muted-900"
                    as="div"
                  />
                  <div className="flex gap-1 text-sm text-muted-500">
                    <EditableText
                      value={item.title}
                      onChange={(title) =>
                        updateData((d) => {
                          const newItems = [...d.testimonials.items];
                          newItems[i] = { ...newItems[i], title };
                          return {
                            ...d,
                            testimonials: { ...d.testimonials, items: newItems },
                          };
                        })
                      }
                      placeholder="Title"
                      className="inline"
                      as="span"
                    />
                    <span>,</span>
                    <EditableText
                      value={item.company}
                      onChange={(company) =>
                        updateData((d) => {
                          const newItems = [...d.testimonials.items];
                          newItems[i] = { ...newItems[i], company };
                          return {
                            ...d,
                            testimonials: { ...d.testimonials, items: newItems },
                          };
                        })
                      }
                      placeholder="Company"
                      className="inline"
                      as="span"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SlideFrame>
  );
}
