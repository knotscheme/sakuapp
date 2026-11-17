"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

// LPを画面いっぱいに表示する（本当の大きさで、動きもそのまま見られる）。Esc か × で閉じる
export default function FullView({ html, title, onClose }: { html: string; title: string; onClose: () => void }) {
  const box = useRef<HTMLDivElement>(null);
  // 親の画面が描き直されても全画面が解除されないよう、閉じる処理は最初の1回だけ登録する
  const close = useRef(onClose);
  useEffect(() => { close.current = onClose; }, [onClose]);
  useEffect(() => {
    const onClose = () => close.current();
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    const m = (e: MessageEvent) => { if (e.data?.lpb === "esc") onClose(); };
    addEventListener("keydown", k);
    addEventListener("message", m);
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    // パソコンでは、ブラウザの枠も消して本当の全画面にする（できない端末では画面いっぱいの表示だけ）
    if (matchMedia("(pointer: fine)").matches) box.current?.requestFullscreen?.().catch(() => {});
    const fs = () => { if (!document.fullscreenElement && box.current?.dataset.fs === "1") onClose(); if (document.fullscreenElement && box.current) box.current.dataset.fs = "1"; };
    document.addEventListener("fullscreenchange", fs);
    return () => {
      removeEventListener("keydown", k);
      removeEventListener("message", m);
      document.removeEventListener("fullscreenchange", fs);
      document.documentElement.style.overflow = prev;
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    };
  }, []);
  return (
    <div ref={box} role="dialog" aria-modal="true" aria-label={`${title}（全画面）`} className="fixed inset-0 z-[120] bg-white">
      <iframe title={title} srcDoc={html} className="h-full w-full border-0" sandbox="allow-scripts allow-same-origin" />
      <button type="button" onClick={() => close.current()} aria-label="全画面を閉じる"
        className="fixed left-3 z-[121] flex h-10 items-center gap-1.5 rounded-full bg-black/55 pl-3 pr-4 text-[13px] text-white shadow-lg ring-1 ring-white/20 backdrop-blur-md transition hover:bg-black/75 sm:left-5"
        style={{ bottom: "max(16px, calc(env(safe-area-inset-bottom) + 12px))" }}>
        <X size={16} />閉じる
      </button>
    </div>
  );
}
