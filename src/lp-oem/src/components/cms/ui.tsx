"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { LayoutGrid, KanbanSquare, Factory, ClipboardCheck, UserRound, ArrowLeft, RotateCcw, Menu, X } from "lucide-react";
import { STAGES, daysLeft, stageIndex, type StageId } from "@/lib/cms";
import { resetDemo } from "./store";

// URLの ?id= などを読む（静的に書き出すため、表示後に読む）
export function useQuery(name: string) {
  const [v, setV] = useState<string | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- URLは表示後にしか読めないため
    setV(new URLSearchParams(location.search).get(name));
  }, [name]);
  return v;
}

const NAV = [
  { href: "/cms/", label: "ダッシュボード", icon: LayoutGrid },
  { href: "/cms/deals/", label: "案件ボード", icon: KanbanSquare },
  { href: "/cms/factory/", label: "工場の画面", icon: Factory, sub: "Factory" },
  { href: "/cms/inspect/", label: "国内検品", icon: ClipboardCheck },
  { href: "/cms/portal/?id=C-1027", label: "お客様の画面（例）", icon: UserRound },
];

export function Shell({ title, children, actions }: { title: string; children: ReactNode; actions?: ReactNode }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const nav = (
    <nav className="flex h-full flex-col">
      <Link href="/cms/" className="px-6 pt-7 pb-8 font-display text-[15px] tracking-[0.4em]">CRAFT <span className="text-gold">CMS</span></Link>
      <ul className="flex-1 space-y-0.5 px-3">
        {NAV.map(({ href, label, icon: Icon }) => {
          const on = href === "/cms/" ? path === "/cms/" || path === "/cms" : path.startsWith(href.split("?")[0].replace(/\/$/, ""));
          return (
            <li key={href}>
              <Link href={href} onClick={() => setOpen(false)} className={`flex items-center gap-3 px-3 py-2.5 text-[13.5px] transition ${on ? "bg-ink text-white" : "text-ink/70 hover:bg-paper hover:text-ink"}`}>
                <Icon size={16} strokeWidth={1.6} /> {label}
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="space-y-1 border-t border-line px-3 py-4 text-[12px]">
        <button type="button" onClick={() => { if (confirm("デモのデータを最初の状態に戻しますか？")) resetDemo(); }} className="flex w-full items-center gap-2 px-3 py-2 text-mute hover:text-ink"><RotateCcw size={14} /> デモをリセット</button>
        <a href="/sakuapp/works/lp-oem/" className="flex items-center gap-2 px-3 py-2 text-mute hover:text-ink"><ArrowLeft size={14} /> LPに戻る</a>
      </div>
    </nav>
  );
  return (
    <div className="min-h-[100svh] bg-paper text-ink">
      <aside className="fixed inset-y-0 left-0 hidden w-60 border-r border-line bg-white lg:block">{nav}</aside>
      {open && <div className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={() => setOpen(false)} />}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-line bg-white transition-transform lg:hidden ${open ? "translate-x-0" : "-translate-x-full"}`}>{nav}</aside>
      <div className="lg:pl-60">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line bg-white/90 px-5 backdrop-blur md:px-8">
          <button type="button" className="-ml-1 p-1 lg:hidden" onClick={() => setOpen(true)} aria-label="メニュー">{open ? <X size={20} /> : <Menu size={20} />}</button>
          <h1 className="flex-1 truncate text-[16px] font-medium tracking-[0.04em]">{title}</h1>
          {actions}
        </header>
        <main className="px-5 py-6 md:px-8 md:py-8">{children}</main>
        <p className="px-5 pb-8 text-[11px] text-mute md:px-8">※ポートフォリオ用のデモです。データはすべて架空で、操作した内容はこのブラウザにだけ保存されます。</p>
      </div>
    </div>
  );
}

export function StageBadge({ stage }: { stage: StageId }) {
  const i = stageIndex(stage);
  const tone = stage === "done" ? "bg-ink/5 text-mute" : i >= 4 ? "bg-[#eef4ff] text-[#2a4f9e]" : i >= 2 ? "bg-[#fbf3e2] text-[#8a650c]" : "bg-[#f1f1ef] text-ink";
  return <span className={`inline-block px-2 py-0.5 text-[11px] whitespace-nowrap ${tone}`}>{STAGES[i].ja}</span>;
}

export function DueBadge({ due, stage }: { due: string; stage: StageId }) {
  if (stage === "done") return null;
  const n = daysLeft(due);
  const cls = n < 0 ? "text-red-600" : n <= 2 ? "text-[#b8860b]" : "text-mute";
  return <span className={`text-[11px] whitespace-nowrap ${cls}`}>{n < 0 ? `${-n}日遅れ` : n === 0 ? "今日まで" : `あと${n}日`}</span>;
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`border border-line bg-white ${className}`}>{children}</section>;
}
export function CardHead({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return <div className="flex items-center justify-between border-b border-line px-5 py-3.5"><h2 className="text-[13.5px] font-medium">{children}</h2>{right}</div>;
}
