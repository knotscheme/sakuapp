"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Hammer, LayoutGrid, Sparkles } from "lucide-react";
import { textReady, imageReady, useAi } from "@/lib/ai";

const NAV = [
  { href: "/build/", label: "つくる", icon: Hammer },
  { href: "/works/", label: "作品例", icon: LayoutGrid },
  { href: "/settings/", label: "AIの設定", icon: Sparkles },
];

export function Logo({ small = false }: { small?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2">
      <span className={`grid place-items-center rounded-lg bg-ink text-white ${small ? "h-7 w-7" : "h-8 w-8"}`}>
        <svg viewBox="0 0 24 24" width={small ? 15 : 17} height={small ? 15 : 17} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><rect x="4" y="4" width="16" height="5" rx="1.5" /><rect x="4" y="12" width="7" height="8" rx="1.5" /><path d="M14 13h6M14 17h4" /></svg>
      </span>
      <span className="font-display text-[17px] font-semibold tracking-[.08em]">LP BUILDER</span>
    </Link>
  );
}

export default function Header() {
  const path = usePathname();
  const ai = useAi();
  const on = textReady(ai) || imageReady(ai);
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-[1280px] items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Logo />
          <span className="hidden rounded-full border border-line bg-white px-2.5 py-0.5 text-[11px] text-mute sm:inline">デモ版です</span>
        </div>
        <nav className="flex items-center gap-1">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = path?.startsWith(`/sakuapp/works/lp-builder${href}`) || path?.startsWith(href);
            return (
              <Link key={href} href={href} className={`tap relative flex items-center gap-1.5 rounded-full px-3 py-2 text-[13px] transition ${active ? "bg-ink text-white" : "text-ink/75 hover:bg-white"}`}>
                <Icon size={15} />
                <span className="hidden min-[400px]:inline">{label}</span>
                {href === "/settings/" && on && <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-ok ring-2 ring-paper" aria-label="AIを使える状態" />}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
