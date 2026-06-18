"use client";

import { SLIDE_HEIGHT, SLIDE_WIDTH } from "@/lib/constants";
import { usePresentationStore } from "@/store/usePresentationStore";
import type { ReactNode } from "react";

interface SlideFrameProps {
  children: ReactNode;
  variant?: "dark" | "light";
  className?: string;
  showLogo?: boolean;
  id?: string;
}

export function SlideFrame({
  children,
  variant = "light",
  className = "",
  showLogo = false,
  id,
}: SlideFrameProps) {
  const accentColor = usePresentationStore((s) => s.accentColor);
  const logoUrl = usePresentationStore((s) => s.logoUrl);

  return (
    <div
      id={id}
      className={`slide-frame relative overflow-hidden ${className}`}
      style={{
        width: SLIDE_WIDTH,
        height: SLIDE_HEIGHT,
        fontFamily: "var(--font-body)",
        ["--accent" as string]: accentColor,
      }}
      data-variant={variant}
    >
      {variant === "dark" && (
        <>
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, ${accentColor}22 100%)`,
            }}
          />
          <div
            className="absolute -top-32 -right-32 h-96 w-96 rounded-full opacity-20 blur-3xl"
            style={{ backgroundColor: accentColor }}
          />
          <div
            className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full opacity-10 blur-3xl"
            style={{ backgroundColor: accentColor }}
          />
        </>
      )}

      {variant === "light" && (
        <div className="absolute inset-0 bg-gradient-to-br from-muted-50 to-white" />
      )}

      {showLogo && logoUrl && (
        // eslint-disable-next-line @next/next/no-img-element -- user-uploaded data URLs for PDF export
        <img
          src={logoUrl}
          alt="Logo"
          className="absolute top-10 left-12 z-20 h-10 w-auto object-contain"
          crossOrigin="anonymous"
        />
      )}

      <div className="relative z-10 h-full w-full">{children}</div>
    </div>
  );
}

interface SlideScalerProps {
  children: ReactNode;
  className?: string;
}

export function SlideScaler({ children, className = "" }: SlideScalerProps) {
  return (
    <div className={`flex items-center justify-center w-full h-full ${className}`}>
      <div
        className="slide-scaler origin-center"
        style={{
          width: SLIDE_WIDTH,
          height: SLIDE_HEIGHT,
          transform: "scale(var(--slide-scale, 1))",
        }}
      >
        {children}
      </div>
    </div>
  );
}
