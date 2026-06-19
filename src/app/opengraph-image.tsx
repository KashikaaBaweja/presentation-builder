import { ImageResponse } from "next/og";

export const alt = "Presentation Builder — Build & Export Decks Instantly";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#12141A",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "32px",
            marginBottom: "48px",
          }}
        >
          <div
            style={{
              width: 96,
              height: 96,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#1E2129",
              borderRadius: 22,
            }}
          >
            <div
              style={{
                width: 54,
                height: 30,
                background: "#FF5A36",
                borderRadius: 4,
              }}
            />
          </div>
          <div
            style={{
              fontSize: 56,
              fontWeight: 700,
              color: "#FFFFFF",
              letterSpacing: "-0.02em",
            }}
          >
            Presentation Builder
          </div>
        </div>
        <div
          style={{
            fontSize: 36,
            fontWeight: 500,
            color: "#A8ADB8",
            lineHeight: 1.4,
            maxWidth: 900,
          }}
        >
          Build polished decks with inline editing, AI content, themes, and PDF
          export.
        </div>
      </div>
    ),
    { ...size }
  );
}
