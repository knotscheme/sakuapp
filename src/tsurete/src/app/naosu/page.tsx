"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Check, Clock, Mail, RotateCcw, Sparkles, Star, Wand2 } from "lucide-react";
import Shell, { Title } from "@/components/Shell";
import Ready from "@/components/Ready";
import { toast } from "@/components/Confirm";
import { BRAND, FIXES, PAGES, PRODUCTS, fmt, shelf, type Fix } from "@/lib/demo";
import { update, useStore } from "@/lib/store";

const fixOf = (id: string) => FIXES.find((f) => f.id === id)!;
const apply = (ids: string[], on: boolean) => update((x) => ({ ...x, applied: on ? [...new Set([...x.applied, ...ids])] : x.applied.filter((y) => !ids.includes(y)) }));

// 商品ページの1つのかたまり。未反映ならAIの書き直し案を、反映済みなら書き直した文章を出す
function Block({ id, label, before, after, gain, done }: { id: string; label: string; before: string; after: string; gain: number; done: boolean }) {
  const f = fixOf(id);
  if (done) return (
    <div className="fade-in rounded-lg border-l-[3px] border-[#10b981] bg-[#e9fbf3] px-3.5 py-3">
      <p className="flex items-center gap-1.5 text-[0.72rem] font-bold text-[#047857]"><Sparkles size={12} />AIが書き直しました<span className="font-normal text-[#6b7280]">｜{label}</span><button type="button" onClick={() => { apply([id], false); toast("もとに戻しました"); }} className="ml-auto flex items-center gap-1 font-normal text-[#6b7280] underline"><RotateCcw size={11} />戻す</button></p>
      <p className="mt-1.5 whitespace-pre-line text-[0.9rem] leading-[1.85] text-[#111827]">{after}</p>
    </div>
  );
  return (
    <div>
      {before ? <p className="whitespace-pre-line text-[0.9rem] leading-[1.85] text-[#374151]">{before}</p> : <p className="text-[0.82rem] text-[#9ca3af]">（{label}がありません）</p>}
      <div className="mt-2.5 rounded-xl border border-dashed border-[#10b981] bg-white p-3.5">
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.75rem]"><b className="flex items-center gap-1 text-[#047857]"><Wand2 size={13} />AIの書き直し案</b><span className="text-[#6b7280]">{f.why}</span></p>
        <p className="mt-2 whitespace-pre-line text-[0.88rem] leading-[1.8] text-[#111827]">{after}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => { apply([id], true); toast("商品ページに反映しました（デモ）"); }} className="btn min-h-[2.3rem] bg-[#10b981] px-4 text-[0.85rem] text-white hover:bg-[#059669]"><Check size={16} />反映する</button>
          {gain > 0 && <span className="text-[0.78rem] font-bold text-[#047857]">AIに出る回数 +{fmt(gain)}回</span>}
          {f.note && <span className="text-[0.75rem] text-[#b45309]">※{f.note}</span>}
        </div>
      </div>
    </div>
  );
}

// ショップの外でやること（レビュー依頼・記事への紹介）
function Outside({ f, done, gain }: { f: Fix; done: boolean; gain: number }) {
  const Icon = f.id === "media" ? Mail : Star;
  return (
    <li className={`card p-7 ${done ? "ring-1 ring-ok/40" : ""}`}>
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-ai-2 text-ai"><Icon size={19} /></span>
        <div className="min-w-0 flex-1">
          <b className="block text-[0.98rem] leading-[1.6]">{f.title}</b>
          <p className="mt-1 text-[0.84rem] leading-[1.7] text-sub">{f.why}</p>
          <p className="mt-2 whitespace-pre-line rounded-xl bg-paper p-3 text-[0.85rem] leading-[1.8]">{f.after}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {done ? <><span className="chip bg-ok text-[#03140f]"><Check size={13} />{f.id === "media" ? "依頼文を作りました" : "変えました"}</span><button type="button" onClick={() => apply([f.id], false)} className="text-[0.8rem] text-sub underline">戻す</button></>
              : <button type="button" onClick={() => { apply([f.id], true); toast("反映しました（デモ）"); }} className="btn btn-ai min-h-[2.4rem]">{f.id === "media" ? "依頼文を作る" : "この質問に変える"}</button>}
            {!done && gain > 0 && <span className="chip bg-ai/15 text-ai">出る回数 +{fmt(gain)}回</span>}
            {f.note && <span className="chip bg-warn/15 text-warn"><Clock size={12} />{f.note}</span>}
          </div>
        </div>
      </div>
    </li>
  );
}

function Naosu() {
  const s = useStore();
  const [pid, setPid] = useState(PRODUCTS[0].id);
  const p = PRODUCTS.find((x) => x.id === pid)!, pg = PAGES[pid];
  const now = shelf(s.applied);
  const gain = (id: string) => (s.applied.includes(id) ? 0 : shelf([...s.applied, id]).total - now.total);
  const done = (id: string) => s.applied.includes(id);
  const left = FIXES.filter((f) => !done(f.id));
  const blocks = [
    { id: "target", label: "商品説明", t: pg.target },
    { id: "spec", label: "容量と値段", t: pg.spec },
    { id: "ingredient", label: "成分", t: pg.ingredient },
    { id: "faq", label: "よくある質問", t: pg.faq },
  ] as const;
  const data = `商品名：${p.name}\n値段：${fmt(p.price)}円（在庫あり）\n口コミ：4.6点（120件）\n${done("target") ? "向いている人：敏感肌・乾燥肌\n" : ""}${done("ingredient") ? "入っていないもの：香料・アルコール\n" : ""}→ 商品ページと、Googleショッピングの商品一覧に入れます`;

  return (
    <>
      <Title n="2" title="商品ページを書き直す" lead="AIにすすめられるように、AIが商品ページを書き直します。案を見て「反映する」を押すだけです。" />

      <div className="mb-10 flex flex-wrap items-center gap-x-6 gap-y-4">
        <div className="flex rounded-full bg-white/[.04] p-1" role="group" aria-label="商品">
          {PRODUCTS.map((x) => <button key={x.id} type="button" aria-pressed={pid === x.id} onClick={() => setPid(x.id)} className={`rounded-full px-4 py-1.5 text-[0.86rem] font-bold transition ${pid === x.id ? "bg-ai text-[#03140f]" : "text-sub"}`}>{x.short}</button>)}
        </div>
        <p className="text-[0.9rem]"><b className="num text-[1.4rem] text-ai">{FIXES.length - left.length}</b><span className="text-sub"> / {FIXES.length} 反映</span></p>
        <div className="ml-auto flex flex-wrap items-center gap-3">
          <Link href="/kouka/" className="flex items-center gap-1 text-[0.88rem] font-bold text-ai">効果を見る<ArrowRight size={16} /></Link>
          {left.length > 0 && <button type="button" onClick={() => { apply(left.map((f) => f.id), true); toast("すべて反映しました（デモ）"); }} className="btn btn-ai"><Wand2 size={17} />すべて反映する</button>}
        </div>
      </div>

      {/* お店のネットショップの商品ページ（明るい画面で、本物のページらしく見せる） */}
      <section className="overflow-hidden rounded-[24px] ring-1 ring-white/[.06]" aria-label={`${p.short}の商品ページ`}>
        <div className="flex items-center gap-2 bg-deep px-4 py-2.5"><span className="flex gap-1.5" aria-hidden><i className="h-2.5 w-2.5 rounded-full bg-white/20" /><i className="h-2.5 w-2.5 rounded-full bg-white/20" /><i className="h-2.5 w-2.5 rounded-full bg-white/20" /></span><span className="num ml-2 min-w-0 truncate rounded-md bg-black/30 px-3 py-1 text-[0.75rem] text-sub">{BRAND.site}/products/{p.id}</span></div>
        <div className="grid bg-[#fafaf8] text-[#111827] md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          <div className="grid min-h-[13rem] place-items-center bg-[radial-gradient(circle_at_50%_40%,#e8f3ef,#d9e6e1)] md:sticky md:top-4 md:m-5 md:h-[22rem] md:min-h-0 md:self-start md:rounded-xl">
            <div className="text-center"><span className={`mx-auto block rounded-[12px_12px_8px_8px] border border-black/10 bg-gradient-to-b from-white to-[#e6efec] shadow-[0_18px_30px_-18px_rgba(0,0,0,.35)] ${pid === "serum" ? "h-24 w-10" : pid === "uv" ? "h-20 w-14 rounded-[8px]" : "h-32 w-14"}`} /><p className="mt-3 text-[0.72rem] tracking-[.3em] text-[#6b7280]">SORAE</p></div>
          </div>
          <div className="min-w-0 space-y-8 p-6 sm:p-10">
            <div><p className="text-[0.75rem] tracking-[.2em] text-[#6b7280]">SORAE</p><h2 className="mt-1 text-[1.3rem] font-bold leading-[1.5]">{p.name}</h2><p className="num mt-1 text-[1.2rem] font-bold">{fmt(p.price)}円<span className="text-[0.75rem] font-normal text-[#6b7280]">（税込）</span></p></div>
            {blocks.map((b) => <div key={b.id}><p className="mb-1.5 text-[0.72rem] font-bold tracking-[.12em] text-[#6b7280]">{b.label}</p><Block id={b.id} label={b.label} before={b.t[0]} after={b.t[1]} gain={gain(b.id)} done={done(b.id)} /></div>)}
            <div>
              <p className="mb-1.5 text-[0.72rem] font-bold tracking-[.12em] text-[#6b7280]">AIが読む商品データ（ページには表示されません）</p>
              <Block id="data" label="商品データ" before="" after={data} gain={gain("data")} done={done("data")} />
            </div>
          </div>
        </div>
      </section>

      <section className="mt-24" aria-labelledby="out">
        <h2 id="out" className="text-[1.2rem] font-bold tracking-[.04em]">ショップの外でやること</h2>
        <p className="mt-1 text-[0.86rem] text-sub">AIは、口コミや外の記事も見ています。文章はAIが用意します。</p>
        <ul className="mt-8 grid gap-5 md:grid-cols-2">{FIXES.filter((f) => f.id === "review" || f.id === "media").map((f) => <Outside key={f.id} f={f} done={done(f.id)} gain={gain(f.id)} />)}</ul>
      </section>
    </>
  );
}

export default function Page() { return <Shell><Ready><Naosu /></Ready></Shell>; }
