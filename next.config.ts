import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    // AVIF first: for this portrait it is ~25% smaller than WebP at matched
    // quality. Next falls back to WebP automatically where AVIF is not
    // accepted, so the only cost is build time.
    formats: ["image/avif", "image/webp"],
  },
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
