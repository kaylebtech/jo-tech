import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
  experimental: {
    // Server Actions default to a 1MB body limit — too small for real photo
    // uploads (lib/actions/upload.ts receives the raw file as FormData).
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
