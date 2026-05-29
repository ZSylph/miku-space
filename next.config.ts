import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // 允许加载任意来源的图片（coverUrl 可能是外部链接）
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
