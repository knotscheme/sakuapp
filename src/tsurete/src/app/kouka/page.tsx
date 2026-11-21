"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Radio } from "lucide-react";
import { platformOf } from "@/lib/platforms";
import { tagKind } from "@/lib/tag";
import J from "@/components/J";
import Shell, { Title } from "@/components/Shell";
import Ready from "@/components/Ready";
import Fold from "@/components/Fold";
import LineChart from "@/components/LineChart";
import { PAST, PRODUCTS, fmt, sales, shelf } from "@/lib/demo";
import { useStore } from "@/lib/store";

function Uriage() {
  const s = useStore();
  const sh = shelf(s.applied), base = shelf([]);
  const m = sales(sh.pct), m0 = sales(base.pct);
  const extra = s.orders.reduce((a, o) => a + o.price, 0);
  const weeks = [...PAST, { w: "今週", o: Math.round(m.orders / 4) + s.orders.length, now: true }];
  const tot = sh.byAi.reduce((a, x) => a + x.n, 0) || 1;
  const yen = m.yen + extra;
  const plat = platformOf(s.site), kind = tagKind(s.site);
  const live = (kind === "csv" ? s.csv : s.tag === "ok") && !!plat; // 計測できているか
  const share = (n: number) => n / tot;
  const pTot = sh.byProduct.reduce((a, x) => a + x.n, 0) || 1;
  return (
    <>
      <Title n="3" title="売上" lead="AIから来たお客様と、その売上です。お店のサイトに貼った計測タグで数えます。" />

      {/* 計測のようす：タグが届いているか */}
      {live ? (
        <p className="-mt-4 mb-12 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.85rem] text-ai"><Radio size={16} />{kind === "csv" ? `${plat!.name}の注文CSVから集計しています（デモ）` : `${plat!.name}に貼った計測タグから届いています（デモ）`}</p>
      ) : (
        <div className="card -mt-4 mb-12 flex flex-col items-start gap-4 p-5 sm:flex-row sm:items-center">
          <p className="min-w-0 flex-1 text-[0.88rem] leading-[1.8]"><b className="block">いまの数字は、見込みです。</b><span className="text-sub"><J>お店のサイトに計測タグを貼ると、AIから実際に来たお客様と売上に置きかわります。</J></span></p>
          <Link href="/settings/" className="btn btn-ai px-5">計測タグを貼る<ArrowRight size={17} /></Link>
        </div>
      )}

      <section className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="今月">
        <div className="card min-w-0 p-3 min-[360px]:p-3.5 sm:p-7"><p className="text-[0.68rem] leading-[1.5] text-sub sm:text-[0.82rem]">AI経由の売上</p><p className="num mt-2 whitespace-nowrap text-[0.8rem] font-bold leading-none min-[360px]:text-[0.92rem] min-[400px]:text-[1.2rem] sm:mt-3 sm:text-[2.4rem]">{fmt(yen)}<span className="ml-0.5 text-[0.75rem] font-normal text-sub sm:ml-1 sm:text-base">円</span></p><p className={`mt-2 text-[0.66rem] leading-[1.5] sm:mt-3 sm:text-[0.8rem] ${yen > m0.yen ? "text-ai" : "text-sub"}`}>{yen > m0.yen ? <>直す前より<br />+{fmt(yen - m0.yen)}円</> : "直す前と同じ"}</p></div>
        <div className="card min-w-0 p-3 min-[360px]:p-3.5 sm:p-7"><p className="text-[0.68rem] leading-[1.5] text-sub sm:text-[0.82rem]">AIから来たお客様</p><p className="num mt-2 whitespace-nowrap text-[0.8rem] font-bold leading-none min-[360px]:text-[0.92rem] min-[400px]:text-[1.2rem] sm:mt-3 sm:text-[2.4rem]">{fmt(m.visits)}<span className="ml-0.5 text-[0.75rem] font-normal text-sub sm:ml-1 sm:text-base">人</span></p></div>
        <div className="card min-w-0 p-3 min-[360px]:p-3.5 sm:p-7"><p className="text-[0.68rem] leading-[1.5] text-sub sm:text-[0.82rem]">注文</p><p className="num mt-2 whitespace-nowrap text-[0.8rem] font-bold leading-none min-[360px]:text-[0.92rem] min-[400px]:text-[1.2rem] sm:mt-3 sm:text-[2.4rem]">{m.orders + s.orders.length}<span className="ml-0.5 text-[0.75rem] font-normal text-sub sm:ml-1 sm:text-base">件</span></p></div>
      </section>

      <section className="mt-24" aria-labelledby="wk">
        <h2 id="wk" className="text-[1.2rem] font-bold tracking-[.04em]">週ごとの注文（AI経由）</h2>
        <div className="mt-10 sm:hidden"><LineChart data={weeks.map((w) => w.o)} labels={weeks.map((w) => w.w)} color="#4d8dff" grid="rgba(255,255,255,.07)" sub="#6b7b98" W={320} H={130} head={1.8} sparse /></div>
        <div className="mt-10 hidden sm:block"><LineChart data={weeks.map((w) => w.o)} labels={weeks.map((w) => w.w)} color="#4d8dff" grid="rgba(255,255,255,.07)" sub="#6b7b98" W={900} H={220} head={1.6} /></div>
      </section>

      <div className="mt-20" />
      <Fold title="どのAIから来たか" sub="AIごとの人数と売上">
        <ul className="mt-8 border-t hair">
          {sh.byAi.map((x) => { const p = Math.round(share(x.n) * 100); return (
            <li key={x.ai} className="grid grid-cols-[6.5rem_1fr_auto] items-center gap-4 border-b hair py-4 text-[0.92rem] sm:grid-cols-[8rem_1fr_11rem]">
              <span>{x.ai}</span>
              <span className="h-1.5 overflow-hidden rounded-full bg-white/[.06]"><span className="block h-full rounded-full bg-ai" style={{ width: `${p}%` }} /></span>
              <span className="num text-right text-[0.85rem]">{fmt(Math.round(m.visits * share(x.n)))}人<span className="ml-2 text-sub">{fmt(Math.round((yen * share(x.n)) / 100) * 100)}円</span></span>
            </li>); })}
        </ul>
        <p className="mt-5 text-[0.8rem] leading-[1.9] text-sub"><J>{kind === "csv" && plat ? "モールでは、AIから来た注文を1件ずつは見分けられないため、直した商品の売上の変化から見積もっています（目安）。" : "計測タグが、どのサイトから来たかを見て、AIから来たお客様を見分けます。名前やメールアドレスなどの個人の情報は集めません。"}</J></p>
      </Fold>

      {live && kind !== "csv" && (
        <Fold title="AIから来た人が見たページ" sub="来たのに売れていないページは、直す候補">
          <ul className="mt-8 border-t hair">
            {[...sh.byProduct].sort((a, b) => b.n - a.n).map((x) => { const v = Math.round(m.visits * (x.n / pTot)); return (
              <li key={x.p.id} className="flex items-center gap-4 border-b hair py-4 text-[0.92rem]">
                <span className="min-w-0 flex-1"><J>{x.p.name}</J></span>
                <span className="num shrink-0 text-[0.85rem]">{fmt(v)}人<span className="ml-2 text-sub">注文 {Math.round(v * 0.045)}件</span></span>
              </li>); })}
          </ul>
          <p className="mt-5 flex items-start gap-2 text-[0.8rem] leading-[1.9] text-sub"><CheckCircle2 size={16} className="mt-1 shrink-0 text-ai" /><span className="min-w-0"><J>来たのに売れていないページは、書き直しの候補です。「直す」で、そのページの案から使うと効果が出やすくなります。</J></span></p>
        </Fold>
      )}

      <Fold title="無料の公式ツールもあわせて見る" sub="GoogleのSearch Console">
        <p className="mt-2 max-w-[40em] text-[0.86rem] leading-[1.9] text-sub"><J>Googleの「Search Console」を使うと、お店のサイトがGoogleの検索とAIによる概要に何回出て、何回押されたかが無料で分かります。TSURETEの計測タグとあわせて見ると、「出ている回数」と「来た人・売上」の両方がそろいます。</J></p>
        <ol className="mt-6 space-y-2 text-[0.88rem] leading-[1.9]">{["Search Consoleを開き、お店のサイトを登録する（無料）", "「検索パフォーマンス」で、表示回数とクリック数を見る", "直した商品のページが、直す前より出ているかを確かめる"].map((t, i) => <li key={t} className="flex gap-3"><span className="num text-ai">0{i + 1}</span><span className="min-w-0"><J>{t}</J></span></li>)}</ol>
        <p className="mt-4 text-[0.78rem] leading-[1.8] text-sub"><J>AIによる概要からの分は、ほかの検索と分けて見られないことがあります。</J></p>
      </Fold>

      <Fold title="デモの中で買われた注文" sub="「測る」のAIの画面から買った注文">
        {s.orders.length === 0 ? <p className="mt-4 text-[0.9rem] leading-[1.9] text-sub">まだありません。<span className="whitespace-nowrap">「<Link href="/hakaru/" className="text-ai underline underline-offset-4">測る</Link>」の</span><J>「お客様がAIに聞くと」で、SORAEの「商品を見る」→「買う」を押すと、ここに入ります。</J></p> : (
          <ul className="mt-6 border-t hair">{s.orders.slice(0, 8).map((o) => <li key={o.id} className="flex flex-wrap items-baseline gap-x-4 border-b hair py-4 text-[0.92rem]"><b>{PRODUCTS.find((p) => p.id === o.product)?.short}</b><span className="num">{fmt(o.price)}円</span><span className="text-[0.82rem] text-ai">{o.ai}経由</span><span className="num ml-auto text-[0.78rem] text-sub">{new Date(o.at).toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })}</span></li>)}</ul>
        )}
      </Fold>
      <p className="mt-10 text-[0.82rem] text-sub"><Link href="/hakaru/" className="text-ai underline underline-offset-4">AIの中での順位を見る（プロ）</Link></p>
    </>
  );
}

export default function Page() { return <Shell><Ready><Uriage /></Ready></Shell>; }
