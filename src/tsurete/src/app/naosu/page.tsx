"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Check, ChevronDown, Copy, Download, RotateCcw, Rss, Wand2 } from "lucide-react";
import Shell, { Title } from "@/components/Shell";
import Ready from "@/components/Ready";
import Fold from "@/components/Fold";
import { toast } from "@/components/Confirm";
import { BRAND, FIXES, PAGES, PRODUCTS, type Fix } from "@/lib/demo";
import { getState, update, useStore } from "@/lib/store";
import J from "@/components/J";
import { download } from "@/lib/check";
import { METHOD, platformCsv, platformOf } from "@/lib/platforms";
import SitePicker from "@/components/SitePicker";
import { healthGain } from "@/lib/health";

const apply = (ids: string[], on: boolean) => update((x) => ({ ...x, applied: on ? [...new Set([...x.applied, ...ids])] : x.applied.filter((y) => !ids.includes(y)) }));

// 案を使う：選んだサイトに合わせて届ける（デモでは実際のサイトは変わらない）
async function use(ids: string[], text: string) {
  const p = platformOf(getState().site), m = p?.method ?? "copy";
  apply(ids, true);
  if (m === "copy") { try { await navigator.clipboard.writeText(text); } catch {} toast("コピーしました。サイトの編集画面に貼りつけてください"); }
  else if (m === "csv") toast("CSVに入れました。下の「CSVを保存」から受け取れます");
  else toast(`${p!.name}に反映しました（デモのため、実際のサイトは変わりません）`);
}

// 商品ごとの案の文章
function textOf(f: Fix, pid: string) {
  const p = PRODUCTS.find((x) => x.id === pid)!, pg = PAGES[pid];
  if (f.id === "target" || f.id === "spec" || f.id === "ingredient" || f.id === "faq") return pg[f.id][1];
  if (f.id === "data") return `<script type="application/ld+json">\n${JSON.stringify({ "@context": "https://schema.org", "@type": "Product", name: p.name, brand: { "@type": "Brand", name: BRAND.name }, description: pg.target[1].split("\n")[0], offers: { "@type": "Offer", price: p.price, priceCurrency: "JPY", availability: "https://schema.org/InStock" }, aggregateRating: { "@type": "AggregateRating", ratingValue: 4.6, reviewCount: 120 } }, null, 2)}\n</script>`;
  return f.after;
}

// 処方箋1つ：タイトル・理由・案（押すと開く）・ボタン1つ
function Rx({ f, pid, n }: { f: Fix; pid: string; n: number }) {
  const s = useStore();
  const [open, setOpen] = useState(false);
  const done = s.applied.includes(f.id);
  const m = platformOf(s.site)?.method ?? "copy";
  const gain = healthGain(f.id, s.applied);
  const text = textOf(f, pid);
  const label = m === "copy" ? "コピーする" : m === "csv" ? "CSVに入れる" : "反映する";
  return (
    <li className="border-b hair py-5">
      <div className="flex items-start gap-4">
        <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-[0.8rem] font-bold ${done ? "bg-ai text-[#03140f]" : "bg-white/[.06] text-sub"}`}>{done ? <Check size={16} /> : n}</span>
        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-baseline gap-x-3"><b className={`text-[1rem] leading-[1.6] ${done ? "text-sub" : ""}`}><J>{f.title}</J></b>{!done && gain > 0 && <span className="num text-[0.8rem] text-ai">+{gain}点</span>}</p>
          <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} className="mt-2 flex items-center gap-1 text-[0.84rem] text-ai">{open ? "案をとじる" : "案を見る"}<ChevronDown size={15} className={`transition ${open ? "rotate-180" : ""}`} /></button>
          {open && <p className="fade-in mt-2 text-[0.84rem] leading-[1.8] text-sub"><J>{f.why}</J></p>}
          {open && (f.id === "data"
            ? <pre className="fade-in mt-3 overflow-x-auto whitespace-pre rounded-2xl bg-paper p-4 font-mono text-[0.72rem] leading-[1.6]">{text}</pre>
            : <p className="fade-in mt-3 whitespace-pre-line rounded-2xl bg-paper p-4 text-[0.9rem] leading-[1.9]"><J>{text}</J></p>)}
          <div className="mt-4">
            {done
              ? <button type="button" onClick={() => { apply([f.id], false); toast("もとに戻しました"); }} className="flex items-center gap-1.5 text-[0.84rem] text-sub underline underline-offset-4"><RotateCcw size={14} />もとに戻す</button>
              : <button type="button" onClick={() => use([f.id], text)} className="btn btn-ai min-h-[2.6rem] px-5 text-[0.9rem]">{m === "copy" ? <Copy size={16} /> : <Check size={16} />}{label}</button>}
          </div>
        </div>
      </div>
    </li>
  );
}

function Naosu() {
  const s = useStore();
  const [pid, setPid] = useState(PRODUCTS[0].id);
  // 診断の画面から来たときは、その商品を開く
  useEffect(() => { const q = new URLSearchParams(location.search).get("p"); if (q && PRODUCTS.some((x) => x.id === q)) setPid(q); }, []);
  const plat = platformOf(s.site);
  const list = [...FIXES].sort((a, b) => Number(s.applied.includes(a.id)) - Number(s.applied.includes(b.id)) || healthGain(b.id, s.applied) - healthGain(a.id, s.applied));
  const doneN = FIXES.filter((f) => s.applied.includes(f.id)).length;
  const rows = () => PRODUCTS.map((x) => { const g = PAGES[x.id], on = (k: string) => s.applied.includes(k); return { id: x.id, title: x.name, desc: [on("target") ? g.target[1] : g.target[0], on("spec") ? g.spec[1] : g.spec[0], on("ingredient") ? g.ingredient[1] : ""].filter(Boolean).join("\n"), faq: on("faq") ? g.faq[1] : "" }; });
  return (
    <>
      <Title n="2" title="直す" lead="足りないところの書き直し案（処方箋）です。上から順に、案を見て、ボタンを押すだけ。" />

      {/* 進み具合と、届け方 */}
      <div className="mb-8">
        <div className="flex items-center gap-3"><span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[.06]"><span className="block h-full rounded-full bg-ai transition-all duration-700" style={{ width: `${(doneN / FIXES.length) * 100}%` }} /></span><span className="num shrink-0 text-[0.85rem] text-sub">{doneN} / {FIXES.length} 完了</span></div>
        <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.86rem] text-sub">届け方：<b className="text-ink">{plat ? METHOD[plat.method] : "コピーして貼る"}</b><SitePicker compact /></div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1" role="group" aria-label="商品">
        {PRODUCTS.map((x) => <button key={x.id} type="button" aria-pressed={pid === x.id} onClick={() => setPid(x.id)} className={`shrink-0 rounded-full px-4 py-2 text-[0.88rem] font-bold transition ${pid === x.id ? "bg-ai text-[#03140f]" : "bg-white/[.05] text-sub"}`}>{x.short}</button>)}
      </div>

      <ol className="mt-4 border-t hair">{list.map((f, i) => <Rx key={f.id} f={f} pid={pid} n={i + 1} />)}</ol>

      <div className="mt-14">
        {plat?.method === "csv" && (
          <Fold title={`${plat.name}用のCSVを保存`} sub="使った案を、取りこみ用のCSVにまとめます">
            <button type="button" onClick={() => download(`tsurete-${plat.id}.csv`, platformCsv(plat.id, rows()))} className="btn btn-line"><Download size={17} />CSVを保存</button>
          </Fold>
        )}
        <Fold title="商品フィードを作る" sub="サイトの外から、AIに商品を届けます">
          {s.feed ? (
            <div className="fade-in">
              <p className="text-[0.8rem] text-sub">フィードのURL（デモ）</p>
              <p className="num mt-1 break-all text-[0.86rem] text-ai">https://feed.tsurete.example/sorae/products.xml</p>
              <button type="button" onClick={async () => { try { await navigator.clipboard.writeText("https://feed.tsurete.example/sorae/products.xml"); toast("コピーしました"); } catch {} }} className="mt-2 flex items-center gap-1 text-[0.84rem] text-sub"><Copy size={14} />コピー</button>
              <ol className="mt-5 space-y-2 text-[0.88rem] leading-[1.9]">{["Googleマーチャントセンターに、お店を登録する（無料）", "「商品フィードを追加」で、上のURLを登録する", "あとはTSURETEが、書き直すたびに自動で新しくします"].map((t, i) => <li key={t} className="flex gap-3"><span className="num text-ai">{i + 1}.</span><span className="min-w-0"><J>{t}</J></span></li>)}</ol>
            </div>
          ) : <button type="button" onClick={() => { update((x) => ({ ...x, feed: true })); toast("商品フィードを作りました（デモ）"); }} className="btn btn-line"><Rss size={17} />作る</button>}
        </Fold>
        <Fold title="ほかの商品を診断する" sub="URLやCSVで、まだ登録していない商品も">
          <div className="flex flex-wrap gap-3"><Link href="/shindan/" className="btn btn-line">URLで診断</Link><Link href="/shindan/?csv=1" className="btn btn-line">CSVでまとめて</Link></div>
        </Fold>
      </div>
      <p className="mt-6 flex items-start gap-2 text-[0.78rem] leading-[1.8] text-sub"><Wand2 size={15} className="mt-1 shrink-0" /><span className="min-w-0"><J>サイトが変わるのは、ボタンを押した案だけです。デモでは、実際のサイトは変わりません。</J></span></p>
    </>
  );
}

export default function Page() { return <Shell><Ready><Naosu /></Ready></Shell>; }
