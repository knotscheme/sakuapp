import type { Metadata, Viewport } from "next";
import { Noto_Sans_JP, Outfit } from "next/font/google";
import "./globals.css";
import UpdateCheck from "@/components/UpdateCheck";
import ConfirmHost from "@/components/Confirm";

const noto = Noto_Sans_JP({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-noto", display: "swap" });
const outfit = Outfit({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-outfit", display: "swap" });

export const metadata: Metadata = {
  title: "LP BUILDER｜型を選んで、写真を入れるだけのLP作成（デモ版）",
  description: "型を選ぶ→必要な写真を確認→アップロード→プレビュー→ダウンロード。自分のAIのキーを入れれば、文章と写真も自動で作れます。※デモ版です。",
  robots: { index: false },
};

export const viewport: Viewport = { themeColor: "#f6f5f2", viewportFit: "cover" };

const FRAMED = `if(window.self!==window.top)document.documentElement.classList.add("framed")`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja" className={`${noto.variable} ${outfit.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: FRAMED }} />
        <script src="/sakuapp/works/lp-builder/pf-back.js" defer />
      </head>
      <body>{children}<ConfirmHost /><UpdateCheck /></body>
    </html>
  );
}
