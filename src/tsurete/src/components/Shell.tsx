"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import J from "@/components/J";
import { BookOpen, Home, ScanSearch, Settings, Stethoscope, TrendingUp, Wand2 } from "lucide-react";

export const NAV = [
  { href: "/", label: "ホーム", short: "ホーム", icon: Home, n: "" },
  { href: "/kenko/", label: "診断", short: "診断", icon: Stethoscope, n: "1" },
  { href: "/naosu/", label: "直す", short: "直す", icon: Wand2, n: "2" },
  { href: "/kouka/", label: "売上", short: "売上", icon: TrendingUp, n: "3" },
  { href: "/hakaru/", label: "測る", short: "測る", icon: ScanSearch, n: "プロ" },
];

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2" aria-label="TSURETE">
      <span className="h-2 w-2 rounded-full bg-ai" aria-hidden />
      <b className="font-display text-[1rem] tracking-[.22em]">TSURETE</b>
    </Link>
  );
}

export default function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname() ?? "/";
  const on = (h: string) => (h === "/" ? path === "/" || path.endsWith("/tsurete/") : path.includes(h));
  const icon = (href: string, label: string, Icon: typeof Home) => <Link href={href} aria-label={label} title={label} aria-current={on(href) ? "page" : undefined} className={`grid h-9 w-9 place-items-center rounded-full ${on(href) ? "text-ai" : "text-sub hover:text-ink"}`}><Icon size={18} strokeWidth={1.8} /></Link>;
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b hair bg-paper/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-[1080px] items-center gap-10 px-5 sm:px-8">
          <div className="flex items-center gap-3"><Logo /><span className="rounded-full bg-white/[.06] px-2 py-0.5 text-[0.65rem] text-sub">デモ</span></div>
          <nav aria-label="メニュー" className="hidden items-center gap-8 md:flex">
            {NAV.map(({ href, label, n }) => (
              <Link key={href} href={href} aria-current={on(href) ? "page" : undefined} className={`relative py-2 text-[0.86rem] transition ${on(href) ? "font-bold text-ink after:absolute after:inset-x-0 after:-bottom-[0.6rem] after:h-[2px] after:rounded-full after:bg-ai" : "text-sub hover:text-ink"}`}>{label}{n === "プロ" && <span className="ml-1.5 rounded-full bg-ai/15 px-1.5 py-px text-[0.6rem] font-bold text-ai">PRO</span>}</Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-1">
            <span className="mr-2 hidden items-center gap-2 text-[0.8rem] text-sub sm:flex"><span className="grid h-6 w-6 place-items-center rounded-full bg-ai/15 text-[0.62rem] font-bold text-ai">S</span>SORAE</span>
            {icon("/guide/", "使い方", BookOpen)}{icon("/settings/", "設定", Settings)}
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-[1080px] px-5 pb-[calc(7rem+env(safe-area-inset-bottom))] pt-10 sm:px-8 sm:pt-14 md:pb-24">{children}</main>
      {/* スマホは、親指で押しやすい下のタブ */}
      <nav aria-label="メニュー" className="fixed inset-x-0 bottom-0 z-40 border-t hair bg-paper/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden">
        <div className="grid grid-cols-5">
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
      {n && <p className="eyebrow">{/^\d/.test(n) ? `STEP ${n}` : n}</p>}
      <h1 className="mt-2 text-[1.6rem] font-bold leading-[1.5] tracking-[.04em] sm:text-[2rem]">{title}</h1>
      <p className="mt-3 max-w-[38em] text-[0.95rem] leading-[2] text-sub">{typeof lead === "string" ? <J>{lead}</J> : lead}</p>
    </div>
  );
}
