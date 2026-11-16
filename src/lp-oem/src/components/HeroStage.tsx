"use client";

import { useEffect, useRef } from "react";
import WalletArt from "./WalletArt";

// ファーストビューの演出：真鍮の刻印がロゴを押し、金色に光る／マウスで奥行きが動く／金の粒が舞う
export default function HeroStage() {
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  // マウスに合わせて少しずつずらす（奥行き）
  useEffect(() => {
    const el = stage.current;
    if (!el || matchMedia("(pointer: coarse)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
    const move = (e: MouseEvent) => { tx = e.clientX / innerWidth - 0.5; ty = e.clientY / innerHeight - 0.5; };
    const tick = () => {
      cx += (tx - cx) * 0.06; cy += (ty - cy) * 0.06;
      el.querySelectorAll<HTMLElement>("[data-depth]").forEach((n) => {
        const d = Number(n.dataset.depth);
        n.style.translate = `${cx * d * 40}px ${cy * d * 30}px`;
      });
      raf = requestAnimationFrame(tick);
    };
    addEventListener("mousemove", move);
    raf = requestAnimationFrame(tick);
    return () => { removeEventListener("mousemove", move); cancelAnimationFrame(raf); };
  }, []);

  // 金の粒
  useEffect(() => {
    const c = canvas.current;
    if (!c || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = c.getContext("2d")!;
    let w = 0, h = 0, raf = 0;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const resize = () => { w = c.clientWidth; h = c.clientHeight; c.width = w * dpr; c.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    resize();
    const N = innerWidth < 768 ? 26 : 48;
    const ps = Array.from({ length: N }, () => ({ x: Math.random(), y: Math.random(), r: Math.random() * 1.6 + 0.4, s: Math.random() * 0.00035 + 0.00012, a: Math.random() * Math.PI * 2 }));
    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const p of ps) {
        p.y -= p.s * 16; if (p.y < -0.05) { p.y = 1.05; p.x = Math.random(); }
        const tw = 0.35 + 0.65 * Math.abs(Math.sin(t / 900 + p.a));
        ctx.beginPath();
        ctx.fillStyle = `rgba(184,134,11,${0.45 * tw})`;
        ctx.arc(p.x * w + Math.sin(t / 2400 + p.a) * 12, p.y * h, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); removeEventListener("resize", resize); };
  }, []);

  return (
    <div ref={stage} className="relative mx-auto w-full max-w-[620px]">
      <canvas ref={canvas} className="pointer-events-none absolute -inset-16 h-[calc(100%+8rem)] w-[calc(100%+8rem)]" aria-hidden />
      <div className="absolute inset-[8%] rounded-full bg-gold-2/10 blur-3xl" />
      <div className="relative aspect-[5/4]">
        {/* 奥：三つ折り */}
        <div data-depth="0.5" className="absolute right-[-6%] bottom-[0%] w-[54%]">
          <div className="float-b rotate-[8deg]"><WalletArt id="trifold" color="#6e4a2e" className="w-full" /></div>
        </div>
        {/* 主役：長財布（刻印の演出） */}
        <div data-depth="1" className="absolute top-[0%] left-[-4%] w-[80%]">
          <div className="float-a -rotate-6">
            <div className="relative">
              <WalletArt id="long" logo="none" className="w-full" />
              <span className="stamp-logo absolute top-[72.7%] left-[72.5%] -translate-x-1/2 -translate-y-[78%] font-[Georgia,serif] text-[clamp(10px,2.4vw,15px)] font-semibold tracking-[3px]">CRAFT</span>
              <span className="stamp-flash absolute top-[70%] left-[72.5%] h-16 w-16 rounded-full" />
              <svg className="stamp-tool absolute left-[72.5%] w-[24%]" style={{ bottom: "26%" }} viewBox="0 0 80 120" aria-hidden>
                <defs>
                  <linearGradient id="brass" x1="0" x2="1"><stop offset="0" stopColor="#7d5c12" /><stop offset=".45" stopColor="#e2c47e" /><stop offset="1" stopColor="#9a7414" /></linearGradient>
                  <linearGradient id="wood" x1="0" x2="1"><stop offset="0" stopColor="#3a2416" /><stop offset=".5" stopColor="#6b4426" /><stop offset="1" stopColor="#2e1c11" /></linearGradient>
                </defs>
                <rect x="28" y="0" width="24" height="58" rx="10" fill="url(#wood)" />
                <rect x="24" y="54" width="32" height="10" rx="3" fill="url(#brass)" />
                <rect x="34" y="62" width="12" height="22" fill="url(#brass)" />
                <rect x="10" y="82" width="60" height="22" rx="3" fill="url(#brass)" />
                <rect x="14" y="104" width="52" height="5" rx="1.5" fill="#6b4f10" />
              </svg>
            </div>
          </div>
        </div>
        {/* 手前：フラグメントケース */}
        <div data-depth="1.6" className="absolute bottom-[4%] left-[2%] w-[44%]">
          <div className="float-c rotate-[-3deg]"><WalletArt id="fragment" color="#1f2b3a" logo="silver" className="w-full" /></div>
        </div>
      </div>
      <p className="relative mt-2 text-center font-display text-xs tracking-[0.3em] text-ink/35">YOUR LOGO, OUR CRAFTSMANSHIP</p>
    </div>
  );
}
