"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BookOpen, Calculator, CheckSquare, Download, Home, Menu, MessageCircle, PieChart, Send, Settings, X } from "lucide-react";
import { useMounted, useStore } from "@/lib/store";

export const NAV = [
  { href: "/", label: "ホーム", icon: Home, step: 0 },
  { href: "/torikomi/", label: "明細を取りこむ", icon: Download, step: 1 },
  { href: "/kakunin/", label: "内容を確認する", icon: CheckSquare, step: 2 },
  { href: "/chobo/", label: "帳簿を見る", icon: BookOpen, step: 3 },
  { href: "/kessan/", label: "1年のまとめ", icon: PieChart, step: 4 },
  { href: "/shinkoku/", label: "税金を計算する", icon: Calculator, step: 5 },
  { href: "/teishutsu/", label: "申告書を出す", icon: Send, step: 6 },
  { href: "/soudan/", label: "わからないことを聞く", icon: MessageCircle, step: 0 },
  { href: "/settings/", label: "設定", icon: Settings, step: 0 },
];

export default function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname() ?? "/";
  const s = useStore();
  const m = useMounted();
  const [open, setOpen] = useState(false);
  const pending = m ? s.entries.filter((e) => e.status === "check" && !e.voided).length : 0;
  useEffect(() => { document.documentElement.style.overflow = open ? "hidden" : ""; }, [open]);
  useEffect(() => setOpen(false), [path]);
  const isOn = (h: string) => (h === "/" ? path === "/" || path === "/sakuapp/works/shinkoku/" : path.includes(h));

  const item = (n: (typeof NAV)[number], big = false) => {
    const Icon = n.icon; const on = isOn(n.href);
    return (
      <Link key={n.href} href={n.href} aria-current={on ? "page" : undefined}
        className={`flex items-center gap-3 rounded-2xl px-4 font-bold transition ${big ? "min-h-[3.6rem] text-[1.15rem]" : "min-h-[3.1rem] text-[1rem]"} ${on ? "bg-ink text-white" : "hover:bg-white"}`}>
        {n.step ? <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-[0.85rem] ${on ? "bg-white text-ink" : "bg-ink text-white"}`}>{n.step}</span> : <Icon size={24} className="shrink-0" />}
        <span className="flex-1">{n.label}</span>
        {n.href === "/kakunin/" && pending > 0 && <span className="rounded-full bg-warn px-2.5 py-0.5 text-[0.85rem] text-white" aria-label={`確認待ち ${pending}件`}>{pending}</span>}
      </Link>
    );
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b-2 border-line bg-paper/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between gap-3 px-4">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-ok text-[1.2rem] font-bold text-white">申</span>
            <span className="whitespace-nowrap leading-tight"><b className="block text-[1.15rem]">じぶん申告</b><span className="block text-[0.72rem] text-sub">デモ版です</span></span>
          </Link>
          <div className="flex items-center gap-2">
            {m && <span className="hidden text-[0.9rem] text-sub sm:inline">{s.profile.name}さん</span>}
            <button type="button" onClick={() => setOpen(true)} className="btn btn-ink min-h-[2.9rem] px-3.5 lg:hidden" aria-expanded={open}><Menu size={22} /><span className="max-[360px]:sr-only">メニュー</span></button>
          </div>
        </div>
      </header>
      <div className="mx-auto flex max-w-[1240px] gap-6 px-4">
        <nav aria-label="メニュー" className="sticky top-20 hidden h-[calc(100vh-6rem)] w-[260px] shrink-0 overflow-y-auto py-6 lg:block">
          <div className="space-y-1">{NAV.map((n) => item(n))}</div>
          <p className="mt-6 px-2 text-[0.8rem] leading-[1.8] text-sub">数字は「1」から順に進めると、申告まで終わります。</p>
        </nav>
        <main className="min-w-0 flex-1 pb-28 pt-6 sm:pt-8">{children}</main>
      </div>
      <footer className="border-t-2 border-line px-4 py-6 text-center text-[0.8rem] leading-[1.9] text-sub">
        ※デモ版です。データはこの端末のブラウザの中だけに保存されます。<br />税額は目安です。実際の申告は、国税庁の案内に沿って、ご自身で確かめてください。
      </footer>
      {open && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-paper p-4 lg:hidden" role="dialog" aria-modal="true" aria-label="メニュー">
          <div className="mx-auto max-w-[520px]">
            <div className="mb-3 flex justify-end"><button type="button" onClick={() => setOpen(false)} className="btn btn-sub min-h-[2.9rem] px-4"><X size={22} />とじる</button></div>
            <div className="space-y-2">{NAV.map((n) => item(n, true))}</div>
          </div>
        </div>
      )}
    </div>
  );
}
