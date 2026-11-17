"use client";

import { useEffect, useRef, useState } from "react";

// 実物の比率に合わせた端末の見本。
// スマホ：iPhone（画面 390×844）。中身は390px幅で作って、枠の大きさに合わせて縮める
// パソコン：13インチのノートパソコン（画面 16:10）
const W = 390, H = 844, BAR = 47; // 画面の幅・高さ・上の時刻などの帯の高さ（いずれもiPhoneの実寸の比率）

export function Phone({ children, src, alt = "" }: { children?: React.ReactNode; src?: string; alt?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [k, setK] = useState(0);
  useEffect(() => {
    const el = box.current; if (!el) return;
    const ro = new ResizeObserver(([e]) => setK(e.contentRect.width / W));
    ro.observe(el); return () => ro.disconnect();
  }, []);
  return (
    <div className="rounded-[15%/7%] bg-[#1b1f27] p-[3.4%] shadow-[0_30px_60px_-20px_rgba(0,0,0,.7)] ring-1 ring-white/15">
      <div ref={box} className="relative overflow-hidden rounded-[12%/5.6%] bg-paper" style={{ aspectRatio: `${W} / ${H}` }}>
        {/* 上の帯（時刻・電波）と、カメラの部分 */}
        <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-[8%] font-display font-semibold text-ink" style={{ height: `${(BAR / H) * 100}%`, fontSize: 15 * k }}>
          <span>9:41</span>
          <span className="flex items-end gap-[3%]" style={{ width: "16%" }} aria-hidden>
            {[0.4, 0.6, 0.8, 1].map((h) => <i key={h} className="flex-1 rounded-[1px] bg-ink" style={{ height: 10 * k * h }} />)}
            <i className="ml-[8%] rounded-[2px] border border-ink/70" style={{ width: 22 * k, height: 11 * k }} />
          </span>
        </div>
        <div className="absolute left-1/2 top-[1.3%] z-20 -translate-x-1/2 rounded-full bg-black" style={{ width: "32%", height: "4.2%" }} aria-hidden />
        <div className="absolute inset-x-0 bottom-0 overflow-hidden" style={{ top: `${(BAR / H) * 100}%` }}>
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt={alt} className="block h-full w-full object-cover object-top" loading="lazy" />
          ) : (
            <div style={{ width: W, height: H - BAR, transform: `scale(${k})`, transformOrigin: "0 0" }}>{k > 0 && children}</div>
          )}
        </div>
        <i className="absolute bottom-[0.9%] left-1/2 z-20 h-[0.6%] w-[35%] -translate-x-1/2 rounded-full bg-white/70" aria-hidden />
      </div>
    </div>
  );
}

export function Laptop({ src, alt }: { src: string; alt: string }) {
  return (
    <div>
      <div className="rounded-t-[2.2%/3.4%] bg-[#1b1f27] px-[2.2%] pb-[2.4%] pt-[2.2%] ring-1 ring-white/15">
        <div className="relative overflow-hidden rounded-[0.6%] bg-paper" style={{ aspectRatio: "1440 / 900" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt} className="block h-full w-full object-cover object-top" loading="lazy" />
        </div>
      </div>
      {/* 台座（キーボード側の手前のふち） */}
      <div className="relative -mx-[7%] h-0 rounded-b-[40%/100%] bg-gradient-to-b from-[#3a404c] to-[#1e222a] pb-[3.2%]">
        <i className="absolute bottom-[55%] left-1/2 top-0 w-[13%] -translate-x-1/2 rounded-b-[30%/100%] bg-[#151820]" aria-hidden />
      </div>
    </div>
  );
}
