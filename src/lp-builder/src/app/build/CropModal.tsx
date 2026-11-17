"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, Minus, Plus, X } from "lucide-react";
import { cropRect } from "@/lib/image";
import { getOrig, recrop, useProject } from "@/lib/project";
import type { Slot } from "@/lib/types";

// 切り抜く位置と大きさを、ドラッグとスライダーで直す
export default function CropModal({ slot, onClose }: { slot: Slot; onClose: () => void }) {
  const { p } = useProject();
  const meta = p!.imgs[slot.id];
  const [url, setUrl] = useState("");
  const [m, setM] = useState({ fx: meta.fx, fy: meta.fy, zoom: meta.zoom });
  const [boxW, setBoxW] = useState(0);
  const [saving, setSaving] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; fx: number; fy: number } | null>(null);

  useEffect(() => {
    let u = "";
    getOrig(slot.id).then((b) => { if (b) { u = URL.createObjectURL(b); setUrl(u); } });
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    addEventListener("keydown", k);
    return () => { if (u) URL.revokeObjectURL(u); removeEventListener("keydown", k); };
  }, [slot.id, onClose]);
  useEffect(() => {
    const el = box.current; if (!el) return;
    const ro = new ResizeObserver(() => setBoxW(el.clientWidth)); ro.observe(el);
    return () => ro.disconnect();
  }, [url]);

  const { w, h } = meta;
  // 縦長の画像は高さを抑えて表示する
  const maxH = typeof window !== "undefined" ? window.innerHeight * 0.55 : 500;
  const dispW = Math.min(boxW, (maxH * w) / h);
  const k = dispW / w;
  const r = cropRect(w, h, slot.ratio, m.fx, m.fy, m.zoom);
  const clamp = (fx: number, fy: number, zoom = m.zoom) => {
    const c = cropRect(w, h, slot.ratio, 0.5, 0.5, zoom);
    const hx = c.cw / 2 / w, hy = c.ch / 2 / h;
    return { fx: Math.min(Math.max(fx, hx), 1 - hx), fy: Math.min(Math.max(fy, hy), 1 - hy), zoom };
  };
  const onDown = (e: React.PointerEvent) => { (e.target as HTMLElement).setPointerCapture(e.pointerId); drag.current = { x: e.clientX, y: e.clientY, ...m }; };
  const onMove = (e: React.PointerEvent) => {
    const d = drag.current; if (!d || !k) return;
    setM(clamp(d.fx + (e.clientX - d.x) / (k * w), d.fy + (e.clientY - d.y) / (k * h)));
  };
  const zoom = (z: number) => setM(clamp(m.fx, m.fy, Math.min(3, Math.max(1, z))));
  const save = async () => { setSaving(true); await recrop(slot.id, clamp(m.fx, m.fy)); setSaving(false); onClose(); };

  return (
    <div className="fixed inset-0 z-[90] grid place-items-center bg-black/50 p-3 backdrop-blur-[2px]" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label="切り抜く位置を直す" className="fade-in w-full max-w-[760px] rounded-2xl bg-white p-4 shadow-2xl sm:p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 className="text-[16px] font-bold">「{slot.label}」の切り抜き</h2>
          <button type="button" onClick={onClose} aria-label="閉じる" className="grid h-9 w-9 place-items-center rounded-full hover:bg-paper"><X size={18} /></button>
        </div>
        <p className="mt-1 text-[12.5px] text-mute">明るい枠の中が、LPに使われます。枠をドラッグして位置を、スライダーで大きさを直せます。</p>
        <div ref={box} className="checker mt-4 flex justify-center rounded-xl p-0">
          {url && boxW > 0 ? (
            <div className="relative touch-none select-none" style={{ width: dispW, height: h * k }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" draggable={false} className="h-full w-full" />
              <div onPointerDown={onDown} onPointerMove={onMove} onPointerUp={() => (drag.current = null)} onPointerCancel={() => (drag.current = null)}
                className="absolute cursor-move rounded-[2px] outline outline-2 outline-white"
                style={{ left: r.x * k, top: r.y * k, width: r.cw * k, height: r.ch * k, boxShadow: "0 0 0 9999px rgba(0,0,0,.55)" }}>
                <span className="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-3">{Array.from({ length: 9 }).map((_, i) => <span key={i} className="border border-white/25" />)}</span>
              </div>
            </div>
          ) : <div className="grid h-60 w-full place-items-center"><Loader2 size={20} className="spin" /></div>}
        </div>
        <div className="mt-4 flex items-center gap-3">
          <button type="button" onClick={() => zoom(m.zoom - 0.1)} aria-label="小さく" className="grid h-8 w-8 place-items-center rounded-full ring-1 ring-line"><Minus size={14} /></button>
          <input type="range" min={1} max={3} step={0.01} value={m.zoom} onChange={(e) => zoom(Number(e.target.value))} className="flex-1 accent-[var(--color-ink)]" aria-label="大きさ" />
          <button type="button" onClick={() => zoom(m.zoom + 0.1)} aria-label="大きく" className="grid h-8 w-8 place-items-center rounded-full ring-1 ring-line"><Plus size={14} /></button>
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
          <button type="button" onClick={() => setM({ fx: 0.5, fy: 0.5, zoom: 1 })} className="text-[12.5px] text-mute hover:text-ink">真ん中に戻す</button>
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="btn btn-line px-5 py-2.5 text-[13px]">キャンセル</button>
            <button type="button" disabled={saving} onClick={save} className="btn btn-ink px-6 py-2.5 text-[13px]">{saving && <Loader2 size={14} className="spin" />}この位置にする</button>
          </div>
        </div>
      </div>
    </div>
  );
}
