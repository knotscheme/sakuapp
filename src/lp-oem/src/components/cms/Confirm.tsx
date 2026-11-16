"use client";

import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { useUI } from "./i18n";

// 「本当に〜しますか？」の確認ウィンドウ。どこからでも await askConfirm({...}) で呼べる
type Opts = { title: string; body?: string; ok?: string; cancel?: string; danger?: boolean };
type Req = Opts & { resolve: (v: boolean) => void };
let push: ((r: Req) => void) | null = null;

export function askConfirm(o: Opts): Promise<boolean> {
  return new Promise((resolve) => {
    if (!push) return resolve(window.confirm(o.title));
    push({ ...o, resolve });
  });
}

export function ConfirmHost() {
  const [req, setReq] = useState<Req | null>(null);
  const t = useUI();
  useEffect(() => {
    push = setReq;
    return () => { push = null; };
  }, []);
  useEffect(() => {
    if (!req) return;
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") close(false); };
    addEventListener("keydown", key);
    return () => removeEventListener("keydown", key);
  });
  if (!req) return null;
  const close = (v: boolean) => { req.resolve(v); setReq(null); };
  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center bg-black/35 p-4 backdrop-blur-sm sm:items-center" onClick={() => close(false)}>
      <div role="alertdialog" aria-modal="true" aria-labelledby="cf-title" className="pop-in w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start gap-3">
          <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${req.danger ? "bg-red-50 text-red-600" : "bg-[#f1f1f0] text-ink"}`}><AlertTriangle size={17} /></span>
          <div>
            <p id="cf-title" className="text-[15px] font-semibold leading-snug">{req.title}</p>
            {req.body && <p className="mt-1.5 text-[13px] leading-relaxed text-mute">{req.body}</p>}
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-2">
          <button type="button" onClick={() => close(false)} className="cms-btn border border-line py-3 text-[13.5px]">{req.cancel ?? t.cancel}</button>
          <button type="button" autoFocus onClick={() => close(true)} className={`cms-btn py-3 text-[13.5px] text-white ${req.danger ? "bg-red-600" : "bg-ink"}`}>{req.ok ?? t.ok}</button>
        </div>
      </div>
    </div>
  );
}
