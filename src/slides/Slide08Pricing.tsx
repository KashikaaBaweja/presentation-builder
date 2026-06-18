"use client";

import { EditableText } from "@/components/EditableText";
import { SlideFrame } from "@/components/SlideFrame";
import { usePresentationStore } from "@/store/usePresentationStore";

export function Slide08Pricing() {
  const { headline, plans } = usePresentationStore((s) => s.data.pricing);
  const updateData = usePresentationStore((s) => s.updateData);
  const accentColor = usePresentationStore((s) => s.accentColor);
  const showLogo = usePresentationStore((s) => s.showLogoOnAllSlides);

  return (
    <SlideFrame variant="light" showLogo={showLogo}>
      <div className="flex h-full flex-col p-16">
        <EditableText
          value={headline}
          onChange={(h) =>
            updateData((d) => ({ ...d, pricing: { ...d.pricing, headline: h } }))
          }
          placeholder="Section headline"
          className="font-heading mb-10 text-center text-5xl font-bold tracking-tight text-muted-900"
          as="h2"
        />

        <div className="grid flex-1 grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`flex flex-col rounded-2xl p-8 ${
                i === 1
                  ? "bg-white shadow-xl ring-2"
                  : "bg-white shadow-sm ring-1 ring-muted-100"
              }`}
              style={i === 1 ? { borderColor: accentColor } : undefined}
            >
              <EditableText
                value={plan.name}
                onChange={(name) =>
                  updateData((d) => {
                    const newPlans = [...d.pricing.plans];
                    newPlans[i] = { ...newPlans[i], name };
                    return { ...d, pricing: { ...d.pricing, plans: newPlans } };
                  })
                }
                placeholder="Plan name"
                className="font-heading text-xl font-bold text-muted-900"
                as="h3"
              />
              <EditableText
                value={plan.price}
                onChange={(price) =>
                  updateData((d) => {
                    const newPlans = [...d.pricing.plans];
                    newPlans[i] = { ...newPlans[i], price };
                    return { ...d, pricing: { ...d.pricing, plans: newPlans } };
                  })
                }
                placeholder="Price"
                className="font-heading my-4 text-4xl font-bold"
                style={{ color: accentColor }}
                as="div"
              />

              <div className="mt-4 flex flex-col gap-3 border-t border-muted-100 pt-6">
                {plan.features.map((feature, fi) => (
                  <div key={fi} className="flex items-start gap-3">
                    <span
                      className="mt-1 text-sm"
                      style={{ color: accentColor }}
                    >
                      ✓
                    </span>
                    <EditableText
                      value={feature}
                      onChange={(f) =>
                        updateData((d) => {
                          const newPlans = [...d.pricing.plans];
                          const newFeatures = [...newPlans[i].features];
                          newFeatures[fi] = f;
                          newPlans[i] = { ...newPlans[i], features: newFeatures };
                          return { ...d, pricing: { ...d.pricing, plans: newPlans } };
                        })
                      }
                      placeholder={`Feature ${fi + 1}`}
                      className="flex-1 text-sm text-muted-600"
                      as="div"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </SlideFrame>
  );
}
