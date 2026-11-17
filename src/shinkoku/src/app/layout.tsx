import type { Metadata, Viewport } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import UpdateCheck from "@/components/UpdateCheck";
import ConfirmHost from "@/components/Confirm";

const noto = Noto_Sans_JP({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-noto", display: "swap" });

export const metadata: Metadata = {
  title: "じぶん申告｜自分でできる、やさしい確定申告（デモ版）",
  description: "銀行やカードの明細を入れるだけで、帳簿・決算書・確定申告の数字まで。大きな文字とやさしい言葉で、ひとつずつ案内します。※デモ版です。",
  robots: { index: false },
};
export const viewport: Viewport = { themeColor: "#f6f4ee", viewportFit: "cover" };

// 文字の大きさを、画面が出る前に戻す（ちらつかないように）
const FS = `try{var f=localStorage.getItem("jbs-fs");if(f)document.documentElement.dataset.fs=f}catch(e){}if(window.self!==window.top)document.documentElement.classList.add("framed")`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja" className={noto.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: FS }} />
        <script src="/sakuapp/works/shinkoku/pf-back.js" defer />
      </head>
      <body>{children}<ConfirmHost /><UpdateCheck /></body>
    </html>
  );
}
