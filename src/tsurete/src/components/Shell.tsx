"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Home, ScanSearch, Settings, TrendingUp, Wand2 } from "lucide-react";

export const NAV = [
  { href: "/", label: "ホーム", short: "ホーム", icon: Home, n: "" },
  { href: "/shindan/", label: "診断する", short: "診断", icon: ScanSearch, n: "1" },
  { href: "/naosu/", label: "書き直す", short: "書き直す", icon: Wand2, n: "2" },
  { href: "/kouka/", label: "効果を見る", short: "効果", icon: TrendingUp, n: "3" },
];

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-lime text-[#03140f]"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12h9" /><path d="m10 7 5 5-5 5" /><circle cx="19" cy="12" r="2" /></svg></span>
      <span className="leading-tight"><b className={`block font-display text-[1.1rem] tracking-[.14em] ${light ? "text-white" : ""}`}>TSURETE</b><span className={`block text-[0.68rem] ${light ? "text-white/55" : "text-sub"}`}>AI集客ツール（デモ）</span></span>
    </Link>
  );
}

export default function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname() ?? "/";
  const on = (h: string) => (h === "/" ? path === "/" || path.endsWith("/tsurete/") : path.includes(h));
  const sub = [{ href: "/guide/", label: "使い方", icon: BookOpen }, { href: "/settings/", label: "設定", icon: Settings }];
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b hair bg-paper/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1080px] items-center gap-6 px-5 sm:px-8">
          <Logo />
          <nav aria-label="メニュー" className="hidden flex-1 items-center justify-center gap-1 md:flex">
            {NAV.map(({ href, label, n }) => (
              <Link key={href} href={href} aria-current={on(href) ? "page" : undefined} className={`relative flex items-center gap-1.5 rounded-full px-4 py-2 text-[0.9rem] font-bold transition ${on(href) ? "bg-white/[.06] text-ink" : "text-sub hover:text-ink"}`}>
                {n && <span className={`num grid h-5 w-5 place-items-center rounded-full text-[0.68rem] ${on(href) ? "bg-ai text-[#03140f]" : "bg-white/[.06]"}`}>{n}</span>}{label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-1 md:ml-0">
            {sub.map(({ href, label, icon: Icon }) => <Link key={href} href={href} aria-current={on(href) ? "page" : undefined} className={`flex items-center gap-1.5 rounded-full px-3 py-2 text-[0.82rem] font-bold ${on(href) ? "text-ai" : "text-sub hover:text-ink"}`}><Icon size={17} /><span className="hidden sm:inline">{label}</span></Link>)}
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-[1080px] px-5 pb-36 pt-10 sm:px-8 sm:pt-16 md:pb-28">{children}</main>
      <footer className="mx-auto hidden max-w-[1080px] px-8 pb-12 text-[0.75rem] text-sub/70 md:block">架空のスキンケアブランド「SORAE」で動くデモです。数字は模擬の結果です。</footer>
      {/* スマホは、親指で押しやすい下のタブ */}
      <nav aria-label="メニュー" className="fixed inset-x-0 bottom-0 z-40 border-t hair bg-paper/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden">
        <div className="grid grid-cols-4">
          {NAV.map(({ href, short, icon: Icon }) => (
            <Link key={href} href={href} aria-current={on(href) ? "page" : undefined} className={`flex flex-col items-center gap-0.5 py-2.5 text-[0.68rem] font-bold ${on(href) ? "text-ai" : "text-sub"}`}><Icon size={21} />{short}</Link>
          ))}
        </div>
      </nav>
    </div>
  );
}

export function Title({ n, title, lead }: { n?: string; title: string; lead: React.ReactNode }) {
  return (
    <div className="mb-10 sm:mb-14">
      {n && <p className="eyebrow">STEP {n}</p>}
      <h1 className="mt-2 text-[1.6rem] font-bold leading-[1.5] tracking-[.04em] sm:text-[2rem]">{title}</h1>
      <p className="mt-3 max-w-[38em] text-[0.95rem] leading-[2] text-sub">{lead}</p>
    </div>
  );
}
