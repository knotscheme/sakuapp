"use client";

import { useEffect } from "react";

// Safari の上下のバーの色を、いま画面に見えている部分の背景色に合わせる（グレーにならないように）
function bgAt(x: number, y: number): string | null {
  const els = document.elementsFromPoint(x, y) as HTMLElement[];
  for (const el of els) {
    if (getComputedStyle(el).position === "fixed") continue; // ヘッダー・浮かぶボタンは除く
    let n: HTMLElement | null = el;
    while (n) {
      const c = getComputedStyle(n).backgroundColor;
      if (c && c !== "transparent" && !/rgba\(.*,\s*0\)$/.test(c)) return c;
      n = n.parentElement;
    }
  }
  return null;
}

export default function ThemeColor() {
  useEffect(() => {
    let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (!meta) { meta = document.createElement("meta"); meta.name = "theme-color"; document.head.appendChild(meta); }
    // 明るい・暗いモードごとのタグがあれば外して、1つにまとめる
    document.querySelectorAll('meta[name="theme-color"][media]').forEach((m) => m.remove());
    let raf = 0, last = "";
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const top = bgAt(innerWidth / 2, 2) ?? "rgb(255, 255, 255)";
        const bottom = bgAt(innerWidth / 2, innerHeight - 2) ?? top;
        if (top !== last) { meta!.content = top; last = top; }
        document.documentElement.style.backgroundColor = bottom;
      });
    };
    on();
    addEventListener("scroll", on, { passive: true });
    addEventListener("resize", on);
    return () => { removeEventListener("scroll", on); removeEventListener("resize", on); cancelAnimationFrame(raf); };
  }, []);
  return null;
}
