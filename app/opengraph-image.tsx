import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/constants";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0E2F63 0%, #174EA6 55%, #1E63C9 100%)",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -140,
            right: -100,
            width: 480,
            height: 480,
            borderRadius: "50%",
            background: "rgba(93, 173, 226, 0.35)",
            filter: "blur(10px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -160,
            left: -120,
            width: 480,
            height: 480,
            borderRadius: "50%",
            background: "rgba(0, 200, 83, 0.25)",
            filter: "blur(10px)",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 96,
            height: 96,
            borderRadius: 24,
            background: "rgba(255,255,255,0.15)",
            marginBottom: 36,
          }}
        >
          <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.2">
            <rect x="6" y="2" width="12" height="20" rx="2.5" />
            <path d="M11 18h2" strokeLinecap="round" />
          </svg>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 68,
            fontWeight: 700,
            color: "#FFFFFF",
            letterSpacing: "-0.02em",
            textAlign: "center",
          }}
        >
          {SITE_NAME}
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 32,
            color: "rgba(255,255,255,0.85)",
            marginTop: 20,
            textAlign: "center",
          }}
        >
          Nigeria&apos;s Trusted Gadget Marketplace
        </div>

        <div
          style={{
            display: "flex",
            gap: 14,
            marginTop: 32,
            fontSize: 24,
            color: "#FFFFFF",
            fontWeight: 500,
          }}
        >
          <span>Buy</span>
          <span style={{ color: "#5DADE2" }}>•</span>
          <span>Sell</span>
          <span style={{ color: "#5DADE2" }}>•</span>
          <span>Swap</span>
          <span style={{ color: "#5DADE2" }}>•</span>
          <span>Repair</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
