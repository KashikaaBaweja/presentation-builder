"use client";

import { EditableText } from "@/components/EditableText";
import { SlideFrame } from "@/components/SlideFrame";
import { resolveCustomLayout } from "@/lib/layouts";
import { useSlideData } from "@/hooks/useSlideData";
import { usePresentationStore } from "@/store/usePresentationStore";

const MAX_BULLETS = 8;

export function SlideCustom() {
  const { data, update } = useSlideData("custom");
  const accentColor = usePresentationStore((s) => s.accentColor);
  const showLogo = usePresentationStore((s) => s.showLogoOnAllSlides);
  const layout = resolveCustomLayout(data.layout);

  const updateBullet = (index: number, value: string) => {
    update((d) => {
      const bullets = [...d.bullets];
      bullets[index] = value;
      return { ...d, bullets };
    });
  };

  const addBullet = () => {
    update((d) => {
      if (d.bullets.length >= MAX_BULLETS) return d;
      return { ...d, bullets: [...d.bullets, "New bullet point"] };
    });
  };

  const removeBullet = (index: number) => {
    update((d) => {
      if (d.bullets.length <= 1) return d;
      return { ...d, bullets: d.bullets.filter((_, i) => i !== index) };
    });
  };

  return (
    <SlideFrame variant="light" showLogo={showLogo}>
      <div className="flex h-full flex-col p-16">
        {layout === "split" ? (
          <div className="flex h-full gap-12">
            <div className="flex w-2/5 flex-col justify-center">
              <EditableText
                value={data.headline}
                onChange={(headline) => update((d) => ({ ...d, headline }))}
                placeholder="Headline"
                className="font-heading text-5xl font-bold leading-tight tracking-tight text-muted-900"
                multiline
                as="h2"
              />
              <EditableText
                value={data.subheadline}
                onChange={(subheadline) => update((d) => ({ ...d, subheadline }))}
                placeholder="Subtitle"
                className="mt-4 text-xl text-muted-500"
                multiline
                as="p"
              />
            </div>
            <div className="flex w-3/5 flex-col justify-center">
              <EditableText
                value={data.body}
                onChange={(body) => update((d) => ({ ...d, body }))}
                placeholder="Main content"
                className="text-lg leading-relaxed text-muted-600"
                multiline
                as="p"
              />
            </div>
          </div>
        ) : layout === "bullets" ? (
          <>
            <EditableText
              value={data.headline}
              onChange={(headline) => update((d) => ({ ...d, headline }))}
              placeholder="Headline"
              className="font-heading mb-3 text-5xl font-bold tracking-tight text-muted-900"
              as="h2"
            />
            <EditableText
              value={data.subheadline}
              onChange={(subheadline) => update((d) => ({ ...d, subheadline }))}
              placeholder="Subtitle (optional)"
              className="mb-8 text-lg text-muted-500"
              as="p"
            />
            <div className="flex flex-1 flex-col justify-center gap-3">
              {data.bullets.map((bullet, i) => (
                <div key={i} className="group flex items-start gap-4">
                  <span
                    className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: accentColor }}
                  />
                  <EditableText
                    value={bullet}
                    onChange={(value) => updateBullet(i, value)}
                    placeholder={`Bullet ${i + 1}`}
                    className="flex-1 text-xl leading-relaxed text-muted-700"
                    as="div"
                  />
                  {data.bullets.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeBullet(i)}
                      title="Remove bullet"
                      className="mt-1 hidden shrink-0 rounded-md px-2 py-0.5 text-xs text-muted-400 hover:bg-red-50 hover:text-red-500 group-hover:block"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              {data.bullets.length < MAX_BULLETS && (
                <button
                  type="button"
                  onClick={addBullet}
                  className="mt-2 self-start rounded-lg border border-dashed border-muted-300 px-3 py-1.5 text-xs font-medium text-muted-500 hover:border-muted-400 hover:bg-muted-50"
                >
                  + Add bullet
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="flex h-full flex-col justify-center">
            <EditableText
              value={data.headline}
              onChange={(headline) => update((d) => ({ ...d, headline }))}
              placeholder="Headline"
              className="font-heading text-5xl font-bold tracking-tight text-muted-900"
              as="h2"
            />
            <EditableText
              value={data.subheadline}
              onChange={(subheadline) => update((d) => ({ ...d, subheadline }))}
              placeholder="Subtitle (optional)"
              className="mt-4 text-xl text-muted-500"
              as="p"
            />
            <div
              className="my-8 h-1 w-20 rounded-full"
              style={{ backgroundColor: accentColor }}
            />
            <EditableText
              value={data.body}
              onChange={(body) => update((d) => ({ ...d, body }))}
              placeholder="Main content"
              className="max-w-4xl text-xl leading-relaxed text-muted-600"
              multiline
              as="p"
            />
          </div>
        )}
      </div>
    </SlideFrame>
  );
}
