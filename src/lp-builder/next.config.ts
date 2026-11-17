import type { NextConfig } from "next";
import { writeFileSync } from "node:fs";

// 公開した版の番号（開いたままのブラウザでも新しい版に切り替えるため version.txt にも書く）
const BUILD = String(Date.now());
writeFileSync("public/version.txt", BUILD);

// GitHub Pages（knotscheme.github.io/sakuapp/works/lp-builder/）に静的ファイルとして置く
const nextConfig: NextConfig = {
  output: "export",
  basePath: "/sakuapp/works/lp-builder",
  trailingSlash: true,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BUILD: BUILD, NEXT_PUBLIC_BASE: "/sakuapp/works/lp-builder" },
  turbopack: { rules: { "*.css": { loaders: ["@tailwindcss/turbopack"], as: "*.css" } } },
};
export default nextConfig;
