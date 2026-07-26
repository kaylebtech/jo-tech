import { ImageResponse } from "next/og";

export const dynamic = "force-static";

/** Square brand mark for JSON-LD (Organization.logo / LocalBusiness.image) — Google recommends a stable, roughly-square logo URL. */
export async function GET() {
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
        <svg width="280" height="280" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="1.8">
          <rect x="6" y="2" width="12" height="20" rx="2.5" />
          <path d="M11 18h2" strokeLinecap="round" />
        </svg>
      </div>
    ),
    { width: 512, height: 512 }
  );
}
