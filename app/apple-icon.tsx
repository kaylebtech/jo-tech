import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#174EA6",
        }}
      >
        <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.2">
          <rect x="6" y="2" width="12" height="20" rx="2.5" />
          <path d="M11 18h2" strokeLinecap="round" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
