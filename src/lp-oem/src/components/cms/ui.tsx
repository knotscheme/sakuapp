"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { LayoutGrid, KanbanSquare, Factory, ClipboardCheck, UserRound, ArrowLeft, RotateCcw, Menu, Cpu } from "lucide-react";
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

export function Shell({ title, children, actions, note }: { title: string; children: ReactNode; actions?: ReactNode; note?: ReactNode }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const nav = (
    <nav className="flex h-full flex-col">
      <Link href="/cms/" className="px-6 pt-7 pb-7 font-display text-[15px] tracking-[0.4em]">CRAFT <span className="text-gold">CMS</span></Link>
      <ul className="flex-1 space-y-1 px-3">
        {NAV.map(({ href, label, icon: Icon }) => {
          const on = href === "/cms/" ? path === "/cms/" || path === "/cms" : path.startsWith(href.split("?")[0].replace(/\/$/, ""));
          return (
            <li key={href}>
              <Link href={href} onClick={() => setOpen(false)} className={`flex items-center gap-3 rounded-lg px-3 py-2 text-[13.5px] transition ${on ? "bg-white font-medium text-ink shadow-[0_1px_2px_rgba(0,0,0,.08)]" : "text-ink/65 hover:bg-white/60 hover:text-ink"}`}>
                <Icon size={16} strokeWidth={1.7} /> {label}
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="space-y-1 px-3 py-4 text-[12px]">
        <TechNote className="mx-3 mb-3">ログインは Supabase Auth（スタッフ・工場・検品で権限を分ける）</TechNote>
        <button type="button" onClick={() => { if (confirm("デモのデータを最初の状態に戻しますか？")) resetDemo(); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-mute hover:bg-white/60 hover:text-ink"><RotateCcw size={14} /> デモをリセット</button>
        <a href="/sakuapp/works/lp-oem/" className="flex items-center gap-2 rounded-lg px-3 py-2 text-mute hover:bg-white/60 hover:text-ink"><ArrowLeft size={14} /> LPに戻る</a>
      </div>
    </nav>
  );
  return (
    <div className="cms-bg min-h-[100svh] text-ink">
      <aside className="fixed inset-y-0 left-0 hidden w-60 bg-[#ebebea] lg:block">{nav}</aside>
      {open && <div className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={() => setOpen(false)} />}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#ebebea] transition-transform lg:hidden ${open ? "translate-x-0" : "-translate-x-full"}`}>{nav}</aside>
      <div className="lg:pl-60">
        <div className="sticky top-0 z-30 flex h-14 items-center gap-3 bg-[#f1f1f0]/90 px-5 backdrop-blur lg:hidden">
          <button type="button" className="-ml-1 p-1" onClick={() => setOpen(true)} aria-label="メニュー"><Menu size={20} /></button>
          <span className="font-display text-[13px] tracking-[0.4em]">CRAFT <span className="text-gold">CMS</span></span>
        </div>
        <main className="mx-auto max-w-[1180px] px-5 py-6 md:px-10 md:py-10">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-[22px] font-semibold tracking-[0.02em]">{title}</h1>
              {note && <TechNote className="mt-1.5">{note}</TechNote>}
            </div>
            {actions}
          </div>
          {children}
          <p className="mt-10 text-[11px] text-mute">※ポートフォリオ用のデモです。データはすべて架空で、操作した内容はこのブラウザにだけ保存されます。</p>
        </main>
      </div>
    </div>
  );
}

// 仕組みの説明（本番ではここで何を使うか）を小さく添える
export function TechNote({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`flex items-start gap-1.5 text-[11px] leading-relaxed text-[#8a8a86] ${className}`}>
      <Cpu size={12} strokeWidth={1.6} className="mt-[2px] shrink-0" />
      <span>※本番では：{children}</span>
    </p>
  );
}

export function StageBadge({ stage }: { stage: StageId }) {
  const i = stageIndex(stage);
  const tone = stage === "done" ? "bg-ink/5 text-mute" : i >= 4 ? "bg-[#eef4ff] text-[#2a4f9e]" : i >= 2 ? "bg-[#fbf3e2] text-[#8a650c]" : "bg-[#f1f1ef] text-ink";
  return <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] whitespace-nowrap ${tone}`}>{STAGES[i].ja}</span>;
}

export function DueBadge({ due, stage }: { due: string; stage: StageId }) {
  if (stage === "done") return null;
  const n = daysLeft(due);
  const cls = n < 0 ? "text-red-600" : n <= 2 ? "text-[#b8860b]" : "text-mute";
  return <span className={`text-[11px] whitespace-nowrap ${cls}`}>{n < 0 ? `${-n}日遅れ` : n === 0 ? "今日まで" : `あと${n}日`}</span>;
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`cms-card overflow-hidden ${className}`}>{children}</section>;
}
export function CardHead({ children, right, note }: { children: ReactNode; right?: ReactNode; note?: ReactNode }) {
  return (
    <div className="px-5 pt-5 pb-3">
      <div className="flex items-center justify-between gap-3"><h2 className="text-[14px] font-semibold">{children}</h2>{right}</div>
      {note && <TechNote className="mt-1">{note}</TechNote>}
    </div>
  );
}
