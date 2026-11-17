"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Bot, RefreshCw, Search, ShoppingBag, X } from "lucide-react";
import { toast } from "@/components/Confirm";
import { AIS, BRAND, PRODUCTS, QUESTIONS, TRIES, answer, fmt, shown, type Ai, type Pick } from "@/lib/demo";
import { aiReady, askProduct, useAi } from "@/lib/ai";
import { uid, update, useStore } from "@/lib/store";

// お客様がAIに聞いたときの答え（いまの商品ページの状態で計算）
export function ChatSim() {
  const s = useStore();
  const [ai, setAi] = useState<Ai>("ChatGPT");
  const [prod, setProd] = useState(PRODUCTS[0].id);
  const qs = QUESTIONS.filter((q) => q.product === prod);
  const [qid, setQid] = useState(qs[0].id);
  const [t, setT] = useState(0);
  const [busy, setBusy] = useState(true);
  const [open, setOpen] = useState<Pick | null>(null);
  const q = QUESTIONS.find((x) => x.id === qid) ?? qs[0];
  const picks = answer(q, ai, s.applied, t);
  const n = shown(q, ai, s.applied);
  const product = PRODUCTS.find((p) => p.id === q.product)!;
  useEffect(() => { setBusy(true); const id = setTimeout(() => setBusy(false), 600); return () => clearTimeout(id); }, [qid, ai, t, s.applied.length]);
  const buy = () => { update((x) => ({ ...x, orders: [{ id: uid(), product: product.id, ai, price: product.price, at: new Date().toISOString() }, ...x.orders] })); setOpen(null); toast(`${ai}経由で「${product.short}」が売れました（デモ）`); };

  return (
    <section className="mt-24" aria-labelledby="chat">
      <h2 id="chat" className="text-[1.2rem] font-bold tracking-[.04em]">お客様がAIに聞くと</h2>
      <p className="mt-1 text-[0.86rem] text-sub">いまの商品ページの状態で、AIがどう答えるかを再現しています。</p>
      <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,21rem)] lg:gap-5">
        <div className="card min-w-0 p-4 lg:col-start-2 lg:row-start-1">
          <div className="grid grid-cols-4 gap-1.5" role="group" aria-label="AI">{AIS.map((a) => <button key={a} type="button" aria-pressed={ai === a} onClick={() => { setAi(a); setT(0); }} className={`rounded-lg border px-1 py-1.5 text-[0.72rem] font-bold sm:text-[0.8rem] ${ai === a ? "border-ai text-ai" : "border-line text-sub"}`}>{a}</button>)}</div>
          <div className="mt-3 flex flex-wrap gap-1.5" role="group" aria-label="商品">{PRODUCTS.map((p) => <button key={p.id} type="button" aria-pressed={prod === p.id} onClick={() => { setProd(p.id); setQid(QUESTIONS.find((x) => x.product === p.id)!.id); setT(0); }} className={`chip py-1 ${prod === p.id ? "bg-ai text-[#03140f]" : "bg-deep text-sub"}`}>{p.short}</button>)}</div>
          <ul className="mt-3 space-y-1.5">{qs.map((x) => <li key={x.id}><button type="button" aria-pressed={qid === x.id} onClick={() => { setQid(x.id); setT(0); }} className={`w-full rounded-lg border px-3 py-2 text-left text-[0.85rem] leading-[1.6] ${qid === x.id ? "border-ai bg-ai/10" : "border-line hover:border-ai/50"}`}>{x.text}</button></li>)}</ul>
        </div>
        <div className="card min-w-0 overflow-hidden p-0 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:self-start" aria-label="AIとの会話">
          <div className="flex items-center gap-2 border-b border-line px-4 py-3 text-[0.85rem] text-sub"><Bot size={16} className="text-ai" />{ai}<span className="num ml-auto">{t + 1}回目</span></div>
          <div className="min-h-[22rem] space-y-3 p-4" aria-live="polite">
            <p className="ml-auto w-fit max-w-[88%] rounded-2xl rounded-br-md bg-deep px-4 py-2.5 text-[0.95rem]">{q.text}</p>
            {busy ? <p className="pulse flex items-center gap-2 text-[0.85rem] text-sub"><Bot size={16} />考えています…</p> : (
              <div className="fade-in space-y-2">
                <p className="text-[0.92rem]">おすすめを3つ選びました。</p>
                <ol className="space-y-2">{picks.map((p, i) => (
                  <li key={p.brand} className={`flex gap-3 rounded-xl border p-3 ${p.me ? "border-ai bg-ai/10" : "border-line bg-paper"}`}>
                    <span className={`num grid h-7 w-7 shrink-0 place-items-center rounded-full text-[0.8rem] ${p.me ? "bg-ai text-[#03140f]" : "bg-deep"}`}>{i + 1}</span>
                    <span className="min-w-0 flex-1"><b className="block text-[0.95rem] leading-[1.5]">{p.brand}　{p.item}<span className="num block text-[0.78rem] font-normal text-sub sm:ml-2 sm:inline">{fmt(p.price)}円</span></b><span className="block text-[0.83rem] leading-[1.7] text-sub">{p.why}</span>
                      {p.me && <button type="button" onClick={() => setOpen(p)} className="btn btn-ai mt-2 min-h-[2.3rem] px-3.5 text-[0.85rem]"><ShoppingBag size={16} />商品を見る</button>}</span>
                  </li>))}</ol>
              </div>
            )}
          </div>
          <div className="border-t border-line p-3"><button type="button" onClick={() => setT((t + 1) % TRIES)} className="btn btn-line w-full"><RefreshCw size={16} />同じ質問を、もう一度聞く</button></div>
        </div>
        <div className={`card min-w-0 p-5 lg:col-start-2 lg:row-start-2 lg:self-start ${n >= 10 ? "border-ai/60" : "border-warn/50"}`}>
          <p className="text-[0.82rem] text-sub">この質問を{TRIES}回聞くと</p>
          <p className="mt-1"><b className={`num text-[2.4rem] leading-none ${n >= 10 ? "text-ai" : "text-warn"}`}>{n}</b><span className="ml-1 text-[0.95rem]">回 {BRAND.name}が出る</span></p>
          <div className="mt-3 flex gap-[3px]" aria-hidden>{Array.from({ length: TRIES }, (_, i) => <i key={i} className={`h-2 flex-1 rounded-sm ${i < n ? "bg-ai" : "bg-deep"}`} />)}</div>
          <p className="mt-3 text-[0.8rem] leading-[1.7] text-sub">AIの答えは、聞くたびに少し変わります。</p>
          {n < 10 && <Link href="/naosu/" className="mt-3 flex items-center gap-1 text-[0.88rem] font-bold text-ai">商品ページを書き直す<ArrowRight size={16} /></Link>}
        </div>
      </div>
      {open && (
        <div className="fixed inset-0 z-[90] grid place-items-center bg-black/60 p-4" role="dialog" aria-modal="true" aria-label="商品ページ" onClick={() => setOpen(null)}>
          <div className="fade-in w-full max-w-[24rem] overflow-hidden rounded-2xl border border-line bg-panel" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-line px-4 py-2.5 text-[0.78rem] text-sub"><span className="num">{BRAND.site}</span><button type="button" onClick={() => setOpen(null)} aria-label="とじる"><X size={18} /></button></div>
            <div className="p-5"><b className="block text-[1.05rem]">{product.name}</b><p className="num mt-1 text-[1.3rem] font-bold">{fmt(product.price)}円</p><p className="mt-2 text-[0.82rem] text-sub">{ai}のおすすめから来たお客様として記録されます。</p><button type="button" onClick={buy} className="btn btn-ai mt-4 w-full"><ShoppingBag size={18} />買う（デモ）</button></div>
          </div>
        </div>
      )}
    </section>
  );
}

export function Real() {
  const ai = useAi();
  const s = useStore();
  const brand = s.real.brand || BRAND.name;
  const [q, setQ] = useState(s.real.item ? `${s.real.item}のおすすめは？` : QUESTIONS[0].text);
  const [res, setRes] = useState(""), [err, setErr] = useState(""), [busy, setBusy] = useState(false);
  const hit = res && res.toLowerCase().includes(brand.toLowerCase());
  return (
    <section className="card mt-5 p-7" aria-labelledby="real">
      <h2 id="real" className="flex items-center gap-2 text-[1.05rem] font-bold"><Search size={18} className="text-ai" />本物のAIに聞いてみる</h2>
      <p className="mt-1 text-[0.85rem] text-sub">「設定」でAIのキーとブランド名を入れると、自分の商品で試せます（ネット検索なしの答えです）。</p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <input value={q} onChange={(e) => setQ(e.target.value)} className="field" aria-label="質問" />
        <button type="button" disabled={busy || !q.trim()} onClick={async () => { if (!aiReady(ai)) { setErr("先に「設定」でAIのキーを入れてください"); return; } setBusy(true); setErr(""); setRes(""); try { setRes(await askProduct(q)); } catch (e) { setErr((e as Error).message); } finally { setBusy(false); } }} className="btn btn-ai shrink-0">{busy ? "聞いています…" : "聞く"}</button>
      </div>
      {err && <p className="mt-2 text-[0.88rem] text-warn">{err}</p>}
      {res && <><p className={`mt-3 text-[0.9rem] font-bold ${hit ? "text-ai" : "text-warn"}`}>{hit ? `「${brand}」が答えに入っていました` : `「${brand}」は答えに入っていませんでした`}</p><p className="mt-2 whitespace-pre-wrap rounded-xl bg-paper p-3 text-[0.86rem] leading-[1.8]">{res}</p></>}
    </section>
  );
}

