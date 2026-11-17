"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BookOpen, Bot, CalendarClock, LayoutDashboard, Menu, Network, Settings, Sparkles, X } from "lucide-react";

export const NAV = [
  { href: "/", label: "概要", icon: LayoutDashboard, n: "" },
  { href: "/erabareru/", label: "AIに選ばれる", icon: Sparkles, n: "1" },
  { href: "/yoyaku/", label: "AIが予約できる", icon: Bot, n: "2" },
  { href: "/akiwaku/", label: "空きを自動で埋める", icon: CalendarClock, n: "3" },
  { href: "/machi/", label: "街ぐるみで送り合う", icon: Network, n: "4" },
  { href: "/settings/", label: "設定", icon: Settings, n: "" },
  { href: "/guide/", label: "使い方ガイド", icon: BookOpen, n: "" },
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
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [path]);
  useEffect(() => { document.documentElement.style.overflow = open ? "hidden" : ""; }, [open]);
  const on = (h: string) => (h === "/" ? path === "/" || path.endsWith("/tsurete/") : path.includes(h));
  const items = (
    <div className="space-y-1">
      {NAV.map(({ href, label, icon: Icon, n }) => (
        <Link key={href} href={href} aria-current={on(href) ? "page" : undefined} className={`flex min-h-[2.9rem] items-center gap-3 rounded-xl px-3.5 text-[0.95rem] font-bold transition ${on(href) ? "bg-white/12 text-white" : "text-white/65 hover:bg-white/6 hover:text-white"}`}>
          <Icon size={19} className={on(href) ? "text-lime" : ""} /><span className="flex-1 whitespace-nowrap">{label}</span>{n && <span className="num text-[0.75rem] text-white/40">0{n}</span>}
        </Link>
      ))}
    </div>
  );
  return (
    <div className="min-h-screen lg:flex">
      <aside className="glow sticky top-0 hidden h-screen w-[272px] shrink-0 flex-col p-5 lg:flex">
        <Logo light />
        <nav aria-label="メニュー" className="mt-8 flex-1">{items}</nav>
        <p className="text-[0.75rem] leading-[1.8] text-white/45">架空の整体院「ほぐし処 そよかぜ」で動くデモです。数字は模擬の結果です。</p>
      </aside>
      <header className="glow sticky top-0 z-40 flex h-14 items-center justify-between px-4 lg:hidden">
        <Logo light />
        <button type="button" onClick={() => setOpen(true)} className="btn min-h-[2.4rem] bg-white/10 px-3 text-white" aria-expanded={open}><Menu size={20} />メニュー</button>
      </header>
      {open && (
        <div className="glow fixed inset-0 z-50 overflow-y-auto p-5 lg:hidden" role="dialog" aria-modal="true" aria-label="メニュー">
          <div className="mb-6 flex items-center justify-between"><Logo light /><button type="button" onClick={() => setOpen(false)} className="btn min-h-[2.4rem] bg-white/10 px-3 text-white"><X size={20} />とじる</button></div>
          {items}
        </div>
      )}
      <main className="min-w-0 flex-1 px-4 pb-24 pt-6 sm:px-8 sm:pt-8"><div className="mx-auto max-w-[1100px]">{children}</div></main>
    </div>
  );
}

export function Title({ n, title, lead }: { n?: string; title: string; lead: React.ReactNode }) {
  return (
    <div className="mb-6">
      {n && <p className="num text-[0.8rem] font-bold tracking-[.2em] text-ai">0{n}</p>}
      <h1 className="mt-1 text-[1.7rem] font-bold leading-[1.4] sm:text-[2rem]">{title}</h1>
      <p className="mt-2 max-w-[46em] text-[0.98rem] leading-[1.9] text-sub">{lead}</p>
    </div>
  );
}
