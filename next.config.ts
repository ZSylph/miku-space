import type { NextConfig } from "next";

const r2PublicUrl = process.env.R2_PUBLIC_URL;

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.githubusercontent.com" },
      { protocol: "https", hostname: "raw.githubusercontent.com" },
      // Cloudflare R2 CDN (production)
      ...(r2PublicUrl
        ? [{ protocol: "https" as const, hostname: new URL(r2PublicUrl).hostname }]
        : []),
    ],
  },
};

export default nextConfig;
