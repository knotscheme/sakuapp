import type { NextConfig } from "next";
import { writeFileSync } from "node:fs";

// 公開した版の番号。version.txt にも書き出し、開いたままのスマホでも新しい版に切り替えられるようにする
const BUILD = String(Date.now());
writeFileSync("public/version.txt", BUILD);

// GitHub Pages（knotscheme.github.io/sakuapp/works/lp-oem/）に静的ファイルとして置くための設定
const nextConfig: NextConfig = {
  output: "export",
  basePath: "/sakuapp/works/lp-oem",
  trailingSlash: true,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BUILD: BUILD },
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
