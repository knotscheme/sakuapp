"use client";

import { useEffect, useState } from "react";

// 「本当に〜しますか？」の確認（Promise で結果を返す）
type Ask = { title: string; body?: string; ok?: string; danger?: boolean; resolve: (v: boolean) => void };
let push: ((a: Ask) => void) | null = null;
export function askConfirm(o: Omit<Ask, "resolve">) {
  return new Promise<boolean>((resolve) => (push ? push({ ...o, resolve }) : resolve(window.confirm(o.title))));
}

// 画面の下に短く出すお知らせ
let toastPush: ((s: string) => void) | null = null;
export const toast = (s: string) => toastPush?.(s);

export default function ConfirmHost() {
  const [a, setA] = useState<Ask | null>(null);
  const [msg, setMsg] = useState("");
  useEffect(() => {
    push = setA;
    let tm: ReturnType<typeof setTimeout>;
    toastPush = (s) => { setMsg(s); clearTimeout(tm); tm = setTimeout(() => setMsg(""), 2600); };
    return () => { push = null; toastPush = null; };
  }, []);
  useEffect(() => {
    if (!a) return;
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") { a.resolve(false); setA(null); } };
    addEventListener("keydown", k);
    return () => removeEventListener("keydown", k);
  }, [a]);
  const close = (v: boolean) => { a?.resolve(v); setA(null); };
  return (
    <>
      {a && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/40 p-4 backdrop-blur-[2px]" onClick={() => close(false)}>
          <div role="dialog" aria-modal="true" aria-label={a.title} className="fade-in w-full max-w-[400px] rounded-2xl border border-line bg-panel p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-[16px] font-bold leading-[1.6]">{a.title}</h2>
            {a.body && <p className="mt-2 whitespace-pre-line text-[13.5px] leading-[1.9] text-ink/75">{a.body}</p>}
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" className="btn btn-line px-5 py-2.5 text-[13.5px]" onClick={() => close(false)}>キャンセル</button>
              <button type="button" autoFocus className={`btn px-5 py-2.5 text-[13.5px] text-white ${a.danger ? "bg-red-600 hover:bg-red-700" : "btn-ink"}`} onClick={() => close(true)}>{a.ok ?? "OK"}</button>
            </div>
          </div>
        </div>
      )}
      <div aria-live="polite" className={`pointer-events-none fixed bottom-[calc(20px+env(safe-area-inset-bottom))] left-1/2 z-[110] -translate-x-1/2 rounded-full bg-deep px-5 py-2.5 text-[13px] text-white shadow-lg transition ${msg ? "opacity-100" : "translate-y-3 opacity-0"}`}>{msg}</div>
    </>
  );
}
