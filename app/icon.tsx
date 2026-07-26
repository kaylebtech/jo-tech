import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
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
          background: "#174EA6",
          borderRadius: 16,
        }}
      >
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5">
          <rect x="6" y="2" width="12" height="20" rx="2.5" />
          <path d="M11 18h2" strokeLinecap="round" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
