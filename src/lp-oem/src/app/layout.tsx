import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import UpdateCheck from "@/components/UpdateCheck";

const noto = Noto_Sans_JP({ subsets: ["latin"], weight: ["300", "400", "500", "700"], variable: "--font-noto", display: "swap" });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["500", "600"], variable: "--font-cormorant", display: "swap" });

export const metadata: Metadata = {
  title: "CRAFT OEM｜型代0円の革財布ロゴ入れOEM（制作サンプル）",
  description: "型代0円・最短30日で、オリジナル財布をブランド化。高品質な定番モデルにロゴを入れるだけのスマートOEM。※ポートフォリオ用の制作サンプルです。",
  robots: { index: false },
};

export const viewport: Viewport = { themeColor: "#ffffff", viewportFit: "cover" };

// ポートフォリオ共通：埋め込み表示の判定と、?pf=1 のときの「戻る」ボタン
const FRAMED = `if(window.self!==window.top)document.documentElement.classList.add("framed")`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja" className={`${noto.variable} ${cormorant.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: FRAMED }} />
        <script src="/sakuapp/works/lp-oem/pf-back.js" defer />
      </head>
      <body>{children}<UpdateCheck /></body>
    </html>
  );
}
