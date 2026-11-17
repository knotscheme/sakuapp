"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Check, Clock, Copy, Download, Mail, RotateCcw, Rss, Sparkles, Star, Wand2 } from "lucide-react";
import Shell, { Title } from "@/components/Shell";
import Ready from "@/components/Ready";
import { toast } from "@/components/Confirm";
import { BRAND, FIXES, PAGES, PRODUCTS, fmt, shelf, type Fix } from "@/lib/demo";
import { getState, update, useStore } from "@/lib/store";
import J from "@/components/J";
import { download } from "@/lib/check";
import { METHOD, platformCsv, platformOf } from "@/lib/platforms";
import SitePicker, { SiteGrid } from "@/components/SitePicker";

const fixOf = (id: string) => FIXES.find((f) => f.id === id)!;
const apply = (ids: string[], on: boolean) => update((x) => ({ ...x, applied: on ? [...new Set([...x.applied, ...ids])] : x.applied.filter((y) => !ids.includes(y)) }));

// 案を使う：選んだサイトに合わせて届ける（デモでは実際のサイトは変わらない）
const DONE = { api: "書きかえました", csv: "CSVに入れました", copy: "コピーしました" };
async function use(ids: string[], text: string) {
  const p = platformOf(getState().site), m = p?.method ?? "copy";
  apply(ids, true);
  if (m === "copy") { try { await navigator.clipboard.writeText(text); } catch {} toast("コピーしました。サイトの編集画面に貼りつけてください"); }
  else if (m === "csv") toast(`CSVに入れました。上の「${p!.action}」から保存できます`);
  else toast(`${p!.name}の商品ページを書きかえました（デモのため、実際のサイトは変わりません）`);
}

// 商品ページの1つのかたまり。未反映ならAIの書き直し案を、反映済みなら書き直した文章を出す
function Block({ id, label, before, after, gain, done }: { id: string; label: string; before: string; after: string; gain: number; done: boolean }) {
  const f = fixOf(id);
  const m = platformOf(useStore().site)?.method ?? "copy";
  if (done) return (
    <div className="fade-in rounded-lg border-l-[3px] border-[#10b981] bg-[#e9fbf3] px-3.5 py-3">
      <p className="flex items-center gap-1.5 text-[0.72rem] font-bold text-[#047857]"><Sparkles size={12} />{DONE[m]}<span className="font-normal text-[#6b7280]">｜{label}</span><button type="button" onClick={() => { apply([id], false); toast("もとに戻しました"); }} className="ml-auto flex items-center gap-1 font-normal text-[#6b7280] underline"><RotateCcw size={11} />戻す</button></p>
      <p className="mt-1.5 whitespace-pre-line text-[0.9rem] leading-[1.85] text-[#111827]">{after}</p>
    </div>
  );
  return (
    <div>
      {before ? <p className="whitespace-pre-line text-[0.9rem] leading-[1.85] text-[#374151]">{before}</p> : <p className="text-[0.82rem] text-[#9ca3af]">（{label}がありません）</p>}
      <div className="mt-2.5 rounded-xl border border-dashed border-[#10b981] bg-white p-3.5">
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.75rem]"><b className="flex items-center gap-1 text-[#047857]"><Wand2 size={13} />AIの書き直し案</b><span className="text-[#6b7280]"><J>{f.why}</J></span></p>
        <p className="mt-2 whitespace-pre-line text-[0.88rem] leading-[1.8] text-[#111827]">{after}</p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => use([id], after)} className="btn min-h-[2.3rem] bg-[#10b981] px-4 text-[0.85rem] text-white hover:bg-[#059669]">{m === "copy" ? <Copy size={16} /> : <Check size={16} />}この案を使う</button>
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
    <li className={`card p-6 sm:p-7 ${done ? "ring-1 ring-ok/40" : ""}`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-ai-2 text-ai"><Icon size={19} /></span>
        <div className="min-w-0 flex-1">
          <b className="block text-[0.98rem] leading-[1.6]"><J>{f.title}</J></b>
          <p className="mt-1 text-[0.84rem] leading-[1.8] text-sub"><J>{f.why}</J></p>
          <p className="mt-2 whitespace-pre-line rounded-xl bg-paper p-3 text-[0.85rem] leading-[1.8]">{f.after}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {done ? <><span className="chip bg-ok text-[#03140f]"><Check size={13} />{f.id === "media" ? "依頼文を作りました" : "変えました"}</span><button type="button" onClick={() => apply([f.id], false)} className="text-[0.8rem] text-sub underline">戻す</button></>
              : <button type="button" onClick={() => { apply([f.id], true); toast("用意しました（デモ）"); }} className="btn btn-ai min-h-[2.4rem]">{f.id === "media" ? "依頼文を作る" : "この質問に変える"}</button>}
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
  const plat = platformOf(s.site);
  const rowsFor = (all: boolean) => PRODUCTS.map((x) => { const g = PAGES[x.id], on = (k: string) => all || s.applied.includes(k); return { id: x.id, title: x.name, desc: [on("target") ? g.target[1] : g.target[0], on("spec") ? g.spec[1] : g.spec[0], on("ingredient") ? g.ingredient[1] : ""].filter(Boolean).join("\n"), faq: on("faq") ? g.faq[1] : "" }; });
  const saveCsv = () => download(`tsurete-${plat?.id}.csv`, platformCsv(plat!.id, rowsFor(false)));
  const useAll = async () => {
    const ids = left.map((f) => f.id);
    if (plat?.method === "copy") { const t = rowsFor(true).map((r) => `■${r.title}\n${r.desc}\n${r.faq}`).join("\n\n"); apply(ids, true); try { await navigator.clipboard.writeText(t); } catch {} toast("3商品ぶんの案をコピーしました"); }
    else if (plat?.method === "csv") { apply(ids, true); toast(`CSVに入れました。「${plat.action}」から保存できます`); }
    else { apply(ids, true); toast(`${plat?.name}の3商品を書きかえました（デモのため、実際のサイトは変わりません）`); }
  };
  const data = `商品名：${p.name}\n値段：${fmt(p.price)}円（在庫あり）\n口コミ：4.6点（120件）\n${done("target") ? "向いている人：敏感肌・乾燥肌\n" : ""}${done("ingredient") ? "入っていないもの：香料・アルコール\n" : ""}→ 商品ページと、Googleショッピングの商品一覧に入れます`;

  return (
    <>
      <Title n="2" title="直す" lead="「測る」で見つかった差を、AIが商品ページの書き直し案にしました。「この案を使う」を押すと、お店のサイトに合った方法で届けます。" />

      <section className="mb-14 rounded-[24px] bg-white/[.03] p-6 sm:p-8" aria-label="届け方">
        {plat ? (
          <div className="flex flex-col gap-5 md:flex-row md:items-center">
            <div className="min-w-0 flex-1">
              <SitePicker />
              <p className="mt-4 text-[0.9rem] font-bold">届け方：{METHOD[plat.method]}</p>
              <p className="mt-1 text-[0.85rem] leading-[1.9] text-sub">{plat.note}<span className="block">デモでは、実際のサイトは変わりません。</span></p>
            </div>
            <div className="flex flex-wrap gap-3">
              {left.length > 0 && <button type="button" onClick={useAll} className="btn btn-ai px-6"><Wand2 size={17} />{plat.method === "api" ? `すべて${plat.action}` : plat.method === "csv" ? "すべての案をCSVに入れる" : "すべての案をコピー"}</button>}
              {plat.method === "csv" && s.applied.length > 0 && <button type="button" onClick={saveCsv} className="btn btn-line px-6"><Download size={17} />{plat.action}</button>}
            </div>
          </div>
        ) : (
          <div><p className="text-[1.05rem] font-bold">まず、お店のサイトを選んでください</p><p className="mt-1 text-[0.85rem] leading-[1.9] text-sub">選んだサイトに合わせて、書き直しの届け方（自動で書きかえ・CSV・コピー）が変わります。</p><div className="mt-6"><SiteGrid /></div></div>
        )}
      </section>

      <div className="mb-10 flex flex-wrap items-center gap-x-6 gap-y-4">
        <div className="flex rounded-full bg-white/[.04] p-1" role="group" aria-label="商品">
          {PRODUCTS.map((x) => <button key={x.id} type="button" aria-pressed={pid === x.id} onClick={() => setPid(x.id)} className={`rounded-full px-4 py-1.5 text-[0.86rem] font-bold transition ${pid === x.id ? "bg-ai text-[#03140f]" : "text-sub"}`}>{x.short}</button>)}
        </div>
        <p className="text-[0.9rem]"><b className="num text-[1.4rem] text-ai">{FIXES.length - left.length}</b><span className="text-sub"> / {FIXES.length} 使った案</span></p>
        <Link href="/hakaru/" className="ml-auto flex items-center gap-1 text-[0.88rem] font-bold text-ai">測った結果を見る<ArrowRight size={16} /></Link>
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

      <section className="mt-24" aria-labelledby="feed">
        <h2 id="feed" className="flex items-center gap-2 text-[1.2rem] font-bold tracking-[.04em]"><Rss size={20} className="text-ai" />商品フィード（どのサイトでも）</h2>
        <p className="mt-2 max-w-[40em] text-[0.88rem] leading-[1.95] text-sub">商品名・値段・特徴をまとめた一覧のファイルを、TSURETEが作ってネット上に置きます。Googleショッピングなど、AIが商品を探すときに読む場所に登録すると、サイトの種類に関係なく、書き直した内容が届きます。</p>
        {s.feed ? (
          <div className="fade-in mt-8 rounded-[24px] bg-white/[.03] p-6 sm:p-8">
            <p className="text-[0.78rem] font-bold text-sub">フィードのURL（デモ）</p>
            <div className="mt-2 flex flex-wrap items-center gap-3"><code className="num min-w-0 break-all text-[0.9rem] text-ai">https://feed.tsurete.example/sorae/products.xml</code><button type="button" onClick={async () => { try { await navigator.clipboard.writeText("https://feed.tsurete.example/sorae/products.xml"); toast("コピーしました"); } catch {} }} className="flex items-center gap-1 text-[0.8rem] font-bold text-sub hover:text-ai"><Copy size={14} />コピー</button></div>
            <ol className="mt-6 space-y-2 text-[0.88rem] leading-[1.9]">{["Googleマーチャントセンターに、お店を登録する（無料）", "「商品フィードを追加」で、上のURLを登録する", "あとはTSURETEが、書き直すたびにフィードを自動で新しくします"].map((t, i) => <li key={t} className="flex gap-3"><span className="num text-ai">0{i + 1}</span>{t}</li>)}</ol>
          </div>
        ) : <button type="button" onClick={() => { update((x) => ({ ...x, feed: true })); toast("商品フィードを作りました（デモ）"); }} className="btn btn-ai mt-8 px-7"><Rss size={17} />商品フィードを作る</button>}
      </section>

      <p className="mt-24 text-center text-[0.88rem] text-sub">ほかの商品も見る：<Link href="/shindan/" className="text-ai underline underline-offset-4">URLで診断</Link>　<Link href="/shindan/?csv=1" className="text-ai underline underline-offset-4">CSVでまとめて診断</Link></p>
    </>
  );
}

export default function Page() { return <Shell><Ready><Naosu /></Ready></Shell>; }
