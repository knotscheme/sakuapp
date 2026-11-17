import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Noto_Sans_JP, Outfit } from "next/font/google";
import "./globals.css";
import UpdateCheck from "@/components/UpdateCheck";
import ConfirmHost from "@/components/Confirm";
import Splash from "@/components/Splash";
import { SPLASH_SKIP } from "@/lib/splash";

const noto = Noto_Sans_JP({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-noto", display: "swap" });
const jbm = JetBrains_Mono({ subsets: ["latin"], weight: ["500", "700"], variable: "--font-jbm", display: "swap" });
const outfit = Outfit({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-outfit", display: "swap" });

export const metadata: Metadata = {
  title: "TSURETE｜AIに聞かれたら、うちの商品が出てくる（デモ版）",
  description: "ChatGPTなどのAIに商品を聞かれたとき、自分の商品がすすめられ、そのまま買われるようにする、ネットショップのためのAI集客ツール。※デモ版です。",
  robots: { index: false },
};
export const viewport: Viewport = { themeColor: "#060b18", viewportFit: "cover" };
const FRAMED = `if(window.self!==window.top)document.documentElement.classList.add("framed")`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja" className={`${noto.variable} ${outfit.variable} ${jbm.variable}`}>
      <head><script dangerouslySetInnerHTML={{ __html: FRAMED + SPLASH_SKIP }} /><script src="/sakuapp/works/tsurete/pf-back.js" defer /></head>
      <body><Splash />{children}<ConfirmHost /><UpdateCheck /></body>
    </html>
  );
}
