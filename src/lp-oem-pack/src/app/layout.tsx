import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import UpdateCheck from "@/components/UpdateCheck";
import PricingSync from "@/components/PricingSync";

const noto = Noto_Sans_JP({ subsets: ["latin"], weight: ["300", "400", "500", "700"], variable: "--font-noto", display: "swap" });
const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["500", "600"], variable: "--font-cormorant", display: "swap" });

export const metadata: Metadata = {
  title: "CRAFT OEM｜小ロットOEM×売れるLPのクラファン丸ごと支援（デモ版）",
  description: "革製品クラファンの実績者が伴走。50個からの小ロットOEMと、撮影・構成・執筆まで含む売れるLP制作、クラファン後のShopify構築までをパッケージで。※デモ版です。",
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
        <script src="/sakuapp/works/lp-oem-pack/pf-back.js" defer />
      </head>
      <body><PricingSync>{children}</PricingSync><UpdateCheck /></body>
    </html>
  );
}
