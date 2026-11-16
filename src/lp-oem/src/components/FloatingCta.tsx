"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";

// 右下に小さく浮かぶ相談ボタン：ファーストビューを過ぎたら出て、問い合わせフォームが見えたら隠れる
export default function FloatingCta({ href = "#contact" }: { href?: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const contact = document.getElementById("contact");
        const nearContact = contact ? contact.getBoundingClientRect().top < innerHeight * 0.9 : false;
        const menuOpen = getComputedStyle(document.documentElement).overflow === "hidden";
        setShow((href !== "#contact" ? scrollY > 200 : scrollY > innerHeight * 0.8) && !nearContact && !menuOpen);
      });
    };
    on();
    addEventListener("scroll", on, { passive: true });
    addEventListener("resize", on);
    return () => { removeEventListener("scroll", on); removeEventListener("resize", on); cancelAnimationFrame(raf); };
  }, [href]);

  return (
    <a
      href={href}
      aria-hidden={!show}
      tabIndex={show ? 0 : -1}
      className={`group fixed right-4 bottom-[calc(1rem+env(safe-area-inset-bottom))] z-50 inline-flex items-center gap-2.5 border border-ink/10 bg-white/70 py-3 pr-4 pl-5 text-[12.5px] tracking-[0.14em] text-ink backdrop-blur-xl transition-all duration-500 hover:bg-ink hover:text-white md:right-8 md:bottom-8 ${show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"}`}
    >
      無料で相談する
      <ArrowUpRight size={15} strokeWidth={1.5} className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </a>
  );
}
