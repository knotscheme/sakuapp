import type { NextConfig } from "next";

// GitHub Pages（knotscheme.github.io/sakuapp/works/lp-oem/）に静的ファイルとして置くための設定
const nextConfig: NextConfig = {
  output: "export",
  basePath: "/sakuapp/works/lp-oem",
  trailingSlash: true,
  images: { unoptimized: true },
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
