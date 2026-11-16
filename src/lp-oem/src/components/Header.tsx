"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const NAV = [
  { href: "#reasons", label: "選ばれる理由" },
  { href: "#models", label: "ベースモデル" },
  { href: "#simulator", label: "利益シミュレーター" },
  { href: "#faq", label: "よくある質問" },
];

export default function Header() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setSolid(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${solid || open ? "border-b border-line bg-white/90 backdrop-blur-md" : "border-b border-transparent bg-transparent"}`}>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:h-20 md:px-8">
        <a href="#top" className="font-display text-[22px] tracking-[0.28em] text-ink" aria-label="CRAFT OEM トップへ">
          CRAFT <span className="text-gold">OEM</span>
        </a>
        <nav className="hidden items-center gap-8 lg:flex">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="text-[13px] tracking-wider text-ink/70 transition hover:text-gold">
              {n.label}
            </a>
          ))}
          <a href="#contact" className="rounded-full bg-ink px-5 py-2.5 text-[13px] font-bold tracking-wider text-white transition hover:bg-gold">
            無料見積もり・相談
          </a>
        </nav>
        <button type="button" className="text-ink lg:hidden" aria-label={open ? "メニューを閉じる" : "メニューを開く"} aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>
      {open && (
        <nav className="border-t border-line px-5 pb-6 lg:hidden">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="block border-b border-line py-4 text-[15px] text-ink/85">
              {n.label}
            </a>
          ))}
          <a href="#contact" onClick={() => setOpen(false)} className="mt-5 block rounded-full bg-ink py-3.5 text-center text-[15px] font-bold text-white">
            無料見積もり・相談
          </a>
        </nav>
      )}
    </header>
  );
}
