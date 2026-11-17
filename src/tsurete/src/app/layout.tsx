import type { Metadata, Viewport } from "next";
import { Noto_Sans_JP, Outfit } from "next/font/google";
import "./globals.css";
import UpdateCheck from "@/components/UpdateCheck";
import ConfirmHost from "@/components/Confirm";

const noto = Noto_Sans_JP({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-noto", display: "swap" });
const outfit = Outfit({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-outfit", display: "swap" });

export const metadata: Metadata = {
  title: "TSURETE｜AIが、お客様をつれてくる（デモ版）",
  description: "AIに選ばれ、AIに予約され、空きは街ぐるみで埋まる。地域のお店のための、AI時代の集客ツール。※デモ版です。",
  robots: { index: false },
};
export const viewport: Viewport = { themeColor: "#0e0f1a", viewportFit: "cover" };
const FRAMED = `if(window.self!==window.top)document.documentElement.classList.add("framed")`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja" className={`${noto.variable} ${outfit.variable}`}>
      <head><script dangerouslySetInnerHTML={{ __html: FRAMED }} /><script src="/sakuapp/works/tsurete/pf-back.js" defer /></head>
      <body>{children}<ConfirmHost /><UpdateCheck /></body>
    </html>
  );
}
