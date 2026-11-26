"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import { embedUrl, imgSrc, type Product } from "./cms/catalog";

// 製品の写真（メイン＋サブ）と動画を見るウィンドウ
export default function Gallery({ p, onClose }: { p: Product; onClose: () => void }) {
  const items: { kind: "img" | "video"; src: string }[] = [
    { kind: "img", src: p.img },
    ...(p.subImgs ?? []).map((src) => ({ kind: "img" as const, src })),
    ...(embedUrl(p.video) ? [{ kind: "video" as const, src: embedUrl(p.video)! }] : []),
  ];
  const [i, setI] = useState(0);
  const go = (d: number) => setI((x) => (x + d + items.length) % items.length);

  useEffect(() => {
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); if (e.key === "ArrowRight") go(1); if (e.key === "ArrowLeft") go(-1); };
    addEventListener("keydown", key);
    document.documentElement.style.overflow = "hidden";
    return () => { removeEventListener("keydown", key); document.documentElement.style.overflow = ""; };
  });

  const cur = items[i];
  return (
    <div className="fixed inset-0 z-[80] flex flex-col bg-white/80 backdrop-blur-2xl" role="dialog" aria-modal="true" aria-label={`${p.short}の写真と動画`}>
      <div className="flex items-center justify-between px-5 py-4 md:px-8">
        <p className="text-[14px] font-medium">{p.short}<span className="ml-3 text-[12px] text-mute">{i + 1} / {items.length}</span></p>
        <button type="button" onClick={onClose} aria-label="閉じる" className="p-2"><X size={22} strokeWidth={1.5} /></button>
      </div>
      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 md:px-20" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
        {cur.kind === "img" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={cur.src} src={imgSrc(cur.src)} alt="" className="fade-up max-h-full max-w-full object-contain" />
        ) : (
          <div className="aspect-video w-full max-w-4xl bg-black">
            <iframe src={cur.src} title={`${p.short}の動画`} className="h-full w-full" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen />
          </div>
        )}
        {items.length > 1 && (
          <>
            <button type="button" onClick={() => go(-1)} aria-label="前へ" className="absolute left-2 rounded-full bg-white/80 p-2.5 shadow-sm md:left-6"><ChevronLeft size={20} /></button>
            <button type="button" onClick={() => go(1)} aria-label="次へ" className="absolute right-2 rounded-full bg-white/80 p-2.5 shadow-sm md:right-6"><ChevronRight size={20} /></button>
          </>
        )}
      </div>
      <div className="flex justify-center gap-2 overflow-x-auto px-5 py-4">
        {items.map((it, k) => (
          <button key={k} type="button" onClick={() => setI(k)} aria-label={it.kind === "video" ? "動画" : `写真${k + 1}`}
            className={`relative h-12 w-16 shrink-0 overflow-hidden ring-1 transition ${k === i ? "ring-ink" : "opacity-60 ring-transparent hover:opacity-100"}`}>
            {it.kind === "img" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imgSrc(it.src)} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="flex h-full w-full items-center justify-center bg-ink text-white"><Play size={16} /></span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
