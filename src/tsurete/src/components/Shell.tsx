"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ScanSearch, TrendingUp, Wand2 } from "lucide-react";

export const NAV = [
  { href: "/", label: "ホーム", short: "ホーム", icon: Home, n: "" },
  { href: "/hakaru/", label: "測る", short: "測る", icon: ScanSearch, n: "1" },
  { href: "/naosu/", label: "直す", short: "直す", icon: Wand2, n: "2" },
  { href: "/kouka/", label: "売上", short: "売上", icon: TrendingUp, n: "3" },
];

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label="TSURETE ホーム">
      <span className="h-2 w-2 rounded-full bg-ai" aria-hidden />
      <b className="font-display text-[1rem] tracking-[.22em]">TSURETE</b>
    </Link>
  );
}

const SUB = [{ href: "/shindan/", label: "無料診断" }, { href: "/guide/", label: "使い方" }, { href: "/settings/", label: "設定" }];

export default function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname() ?? "/";
  const on = (h: string) => (h === "/" ? path === "/" || path.endsWith("/tsurete/") : path.includes(h));
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 bg-paper/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1080px] items-center gap-10 px-5 sm:px-8">
          <Logo />
          <nav aria-label="メニュー" className="hidden items-center gap-8 md:flex">
            {NAV.slice(1).map(({ href, label }) => (
              <Link key={href} href={href} aria-current={on(href) ? "page" : undefined} className={`relative py-2 text-[0.88rem] transition ${on(href) ? "font-bold text-ink after:absolute after:inset-x-0 after:-bottom-0.5 after:mx-auto after:h-[2px] after:w-4 after:rounded-full after:bg-ai" : "text-sub hover:text-ink"}`}>{label}</Link>
            ))}
          </nav>
          <Link href="/shindan/" aria-current={on("/shindan/") ? "page" : undefined} className={`ml-auto text-[0.84rem] ${on("/shindan/") ? "font-bold text-ai" : "text-sub hover:text-ink"}`}>無料診断</Link>
        </div>
      </header>
      <main className="mx-auto w-full max-w-[1080px] flex-1 px-5 pb-20 pt-10 sm:px-8 sm:pt-16">{children}</main>
      <footer className="pb-[calc(5.5rem+env(safe-area-inset-bottom))] md:pb-0">
        <div className="mx-auto max-w-[1080px] px-5 sm:px-8">
          <div className="flex flex-col gap-4 border-t hair py-10 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-6"><Logo /><span className="text-[0.75rem] text-sub/70">デモ版・数字は模擬です</span></div>
            <nav aria-label="そのほか" className="flex gap-6 text-[0.8rem]">{SUB.map((x) => <Link key={x.href} href={x.href} className={on(x.href) ? "text-ai" : "text-sub hover:text-ink"}>{x.label}</Link>)}</nav>
          </div>
        </div>
      </footer>
      {/* スマホは、親指で押しやすい下のタブ */}
      <nav aria-label="メニュー" className="fixed inset-x-0 bottom-0 z-40 bg-paper/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden">
        <div className="grid grid-cols-4">
          {NAV.map(({ href, short, icon: Icon }) => (
            <Link key={href} href={href} aria-current={on(href) ? "page" : undefined} className={`flex flex-col items-center gap-1 py-3 text-[0.66rem] ${on(href) ? "font-bold text-ai" : "text-sub"}`}><Icon size={20} strokeWidth={on(href) ? 2.2 : 1.6} />{short}</Link>
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
