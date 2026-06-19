import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#12141A",
          borderRadius: 7,
        }}
      >
        <div
          style={{
            width: 18,
            height: 10,
            background: "#FF5A36",
            borderRadius: 2,
          }}
        />
      </div>
    ),
    { ...size }
  );
}
