"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "#stamp", label: "ロゴを試し押し", en: "Experience" },
  { href: "#reasons", label: "選ばれる理由", en: "Why" },
  { href: "#models", label: "ベースモデル", en: "Models" },
  { href: "products/", label: "製品一覧", en: "Products" },
  { href: "#simulator", label: "利益シミュレーター", en: "Simulator" },
  { href: "#faq", label: "よくある質問", en: "FAQ" },
  { href: "#contact", label: "無料見積もり・相談", en: "Contact" },
];

// ミニマルなヘッダー：背景なし。ロゴとメニューボタンだけ（どんな背景でも読めるよう、色は自動で反転）
export default function Header() {
  const [open, setOpen] = useState(false);
  const home = "/sakuapp/works/lp-oem/";
  const onHome = usePathname() === "/";
  const link = (h: string) => (h.startsWith("#") ? (onHome ? h : home + h) : home + h);
  const [hidden, setHidden] = useState(false);

  // 下へスクロールしている間は隠し、上へ戻したときだけ出す
  useEffect(() => {
    let last = window.scrollY;
    const on = () => {
      const y = window.scrollY;
      if (Math.abs(y - last) > 6) { setHidden(y > last && y > 120); last = y; }
    };
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  // メニューを開いている間は、後ろのページを動かさない／Escで閉じる
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    addEventListener("keydown", key);
    return () => removeEventListener("keydown", key);
  }, [open]);

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-[60] text-white mix-blend-difference transition-transform duration-500 ease-out ${hidden && !open ? "-translate-y-full" : "translate-y-0"}`}>
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 md:h-20 md:px-8">
          <a href={onHome ? "#top" : home} onClick={() => setOpen(false)} className="font-display text-[15px] tracking-[0.45em]" aria-label="CRAFT OEM トップへ">CRAFT</a>
          <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="menu" aria-label={open ? "メニューを閉じる" : "メニューを開く"} className="group flex items-center p-2 -mr-2">
            <span className="relative block h-2 w-6">
              <span className={`absolute left-0 h-px w-full bg-current transition-all duration-500 ${open ? "top-1/2 rotate-[20deg]" : "top-0"}`} />
              <span className={`absolute left-0 h-px bg-current transition-all duration-500 ${open ? "top-1/2 w-full -rotate-[20deg]" : "top-full w-2/3 group-hover:w-full"}`} />
            </span>
          </button>
        </div>
      </header>

      {/* 全画面のメニュー */}
      <nav id="menu" aria-hidden={!open} onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }} className={`fixed inset-0 z-[55] flex items-center justify-center bg-white/45 backdrop-blur-2xl backdrop-saturate-150 transition-[opacity,visibility] duration-500 ${open ? "visible opacity-100" : "invisible opacity-0"}`}>
        <ul className="flex flex-col items-center gap-7 text-center md:gap-8">
          {NAV.map((n, i) => (
            <li key={n.href}>
              <a href={link(n.href)} onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}
                className={`block transition-all duration-700 ${open ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}
                style={{ transitionDelay: open ? `${0.1 + i * 0.05}s` : "0s" }}>
                <span className="text-[15px] tracking-[0.14em] text-ink transition hover:text-gold md:text-[16px]">{n.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
