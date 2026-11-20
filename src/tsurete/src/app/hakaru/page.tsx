"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Check, Download, ExternalLink, Mail, Minus, NotebookPen, Plus, Search, X } from "lucide-react";
import { toast } from "@/components/Confirm";
import Shell, { Title } from "@/components/Shell";
import Ready from "@/components/Ready";
import Fold from "@/components/Fold";
import { ChatSim, Real } from "@/components/ChatSim";
import { AIS, BRAND, FANOUT, PRODUCTS, QUESTIONS, RIVAL_HAS, SIGNALS, TRIES, WEEKS, covers, fmt, metrics, shelf, shown, signals, winners, type Sig } from "@/lib/demo";
import { uid, update, useStore } from "@/lib/store";
import J from "@/components/J";

// 週ごとの推薦率の折れ線
function Trend({ data, W = 640, H = 180, fs = 10 }: { data: { w: string; p: number }[]; W?: number; H?: number; fs?: number }) {
  const P = 28, max = 80;
  const x = (i: number) => P + (i * (W - P * 2)) / (data.length - 1), y = (v: number) => H - P - (v / max) * (H - P * 2);
  const d = data.map((p, i) => `${i ? "L" : "M"}${x(i)},${y(p.p)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="週ごとのAI推薦率のグラフ">
      {[0, 40, 80].map((v) => <g key={v}><line x1={P} x2={W - P} y1={y(v)} y2={y(v)} stroke="rgba(255,255,255,.06)" /><text x={0} y={y(v) + 4} fontSize={fs} fill="#6b7b98">{v}%</text></g>)}
      <path d={d} fill="none" stroke="#10d9a0" strokeWidth="2.5" strokeLinejoin="round" />
      {data.map((p, i) => <g key={p.w}><circle cx={x(i)} cy={y(p.p)} r={i === data.length - 1 ? 5 : 3} fill={i === data.length - 1 ? "#10d9a0" : "#0b1426"} stroke="#10d9a0" strokeWidth="2" />{(W > 400 || i % 2 === 0 || i === data.length - 1) && <text x={x(i)} y={H - 6} fontSize={fs} fill={i === data.length - 1 ? "#10d9a0" : "#6b7b98"} textAnchor="middle">{p.w}</text>}</g>)}
    </svg>
  );
}

// AIが答えの根拠にしたサイト（共有の測定で集めた、架空のデータ）
const SOURCES = [
  { name: "はだガイド", title: "敏感肌の化粧水おすすめ15選", kind: "比較記事", n: 38 },
  { name: "コスメランク", title: "3,000円台の化粧水ランキング", kind: "ランキング", n: 27 },
  { name: "くちコミ広場", title: "敏感肌でも使える化粧水まとめ", kind: "口コミ", n: 21 },
  { name: "ヘルスマガジン", title: "化粧水の選び方を皮膚科医に聞いた", kind: "専門家の記事", n: 14 },
];
function Sources() {
  const s = useStore();
  const asked = s.applied.includes("media");
  return (
    <div>
      <p className="mt-2 text-[0.88rem] leading-[1.9] text-sub"><J>AIがおすすめを答えるときに、よく参考にしていたページです。ここに載ると、すすめられやすくなります。</J></p>
      <ul className="mt-8 border-t hair">
        {SOURCES.map((x) => (
          <li key={x.name} className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b hair py-4 text-[0.9rem]">
            <span className="min-w-0 flex-1"><b className="block"><J>{x.title}</J></b><span className="text-[0.78rem] text-sub"><J>{`${x.name}・${x.kind}`}</J></span></span>
            <span className="num shrink-0 text-[0.82rem] text-sub">根拠に {x.n}回</span>
            <span className="shrink-0 text-[0.78rem] font-bold text-warn">SORAEは未掲載</span>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        {asked ? <p className="flex items-center gap-2 text-[0.88rem] text-ai"><Check size={17} />掲載をお願いする文を作りました。送るかどうかは、お店で決めます。</p>
          : <button type="button" onClick={() => { update((x) => ({ ...x, applied: [...new Set([...x.applied, "media"])] })); toast("依頼文を作りました（デモ）"); }} className="btn btn-ai px-6"><Mail size={17} />掲載をお願いする文を作る</button>}
        <span className="flex items-center gap-1 text-[0.78rem] text-sub"><ExternalLink size={13} />載るかどうかは、相手しだいです</span>
      </div>
    </div>
  );
}

// 自分でAIに聞いた結果を記録する（おまけ）
const RANKS = [{ v: 1, l: "1位" }, { v: 2, l: "2位" }, { v: 3, l: "3位" }, { v: 4, l: "4位以下" }, { v: 0, l: "出なかった" }];
function SelfLog() {
  const s = useStore();
  const log = s.log ?? [];
  const [q, setQ] = useState(QUESTIONS[0].text), [ai, setAi] = useState<string>(AIS[0]), [rank, setRank] = useState(0);
  const add = () => { update((x) => ({ ...x, log: [{ id: uid(), q, ai, rank, at: new Date().toISOString() }, ...(x.log ?? [])].slice(0, 50) })); toast("記録しました"); };
  const top3 = log.filter((x) => x.rank >= 1 && x.rank <= 3).length;
  return (
    <div>
      <p className="mt-2 text-[0.88rem] leading-[1.9] text-sub"><J>ふだん使っているAIに自分で聞いてみた結果も、ここに残せます。答えは人によって変わるので、目安として使ってください。</J></p>
      <div className="card mt-6 grid gap-3 p-5 sm:grid-cols-[1fr_9rem_9rem_auto] sm:items-end">
        <label className="text-[0.82rem] font-bold">聞いた質問<select value={q} onChange={(e) => setQ(e.target.value)} className="field mt-1">{QUESTIONS.map((x) => <option key={x.id}>{x.text}</option>)}</select></label>
        <label className="text-[0.82rem] font-bold">AI<select value={ai} onChange={(e) => setAi(e.target.value)} className="field mt-1">{AIS.map((x) => <option key={x}>{x}</option>)}</select></label>
        <label className="text-[0.82rem] font-bold">SORAEは<select value={rank} onChange={(e) => setRank(Number(e.target.value))} className="field mt-1">{RANKS.map((x) => <option key={x.v} value={x.v}>{x.l}</option>)}</select></label>
        <button type="button" onClick={add} className="btn btn-ai"><Plus size={17} />記録する</button>
      </div>
      {log.length > 0 && (
        <>
          <p className="mt-6 text-[0.86rem] text-sub">記録 <b className="num text-ink">{log.length}</b>件・3位以内 <b className="num text-ai">{top3}</b>件</p>
          <ul className="mt-3 border-t hair">{log.slice(0, 8).map((x) => <li key={x.id} className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b hair py-3 text-[0.86rem]"><span className="min-w-0 flex-1"><J>{x.q}</J></span><span className="text-sub">{x.ai}</span><b className={x.rank >= 1 && x.rank <= 3 ? "text-ai" : "text-warn"}>{RANKS.find((r) => r.v === x.rank)?.l}</b></li>)}</ul>
        </>
      )}
    </div>
  );
}

// 3つの数字と、AIごとの結果
function Metrics() {
  const s = useStore();
  const m = metrics(s.applied);
  const cards = [
    { l: "すすめられた割合", v: m.pct, u: "%", d: "答えの上位3つに、SORAEが入った割合" },
    { l: "1位の割合", v: m.top1, u: "%", d: "いちばん最初にすすめられた割合" },
    { l: "自分のサイトが根拠に", v: m.cite, u: "%", d: "すすめられたとき、SORAEのページが参考にされた割合" },
    { l: "平均の順位", v: m.avg, u: "位", d: "すすめられたときの、平均の順番" },
  ];
  return (
    <section className="mt-20" aria-labelledby="mt">
      <h2 id="mt" className="text-[1.2rem] font-bold tracking-[.04em]">4つの数字</h2>
      <p className="mt-2 text-[0.88rem] text-sub"><J>名前が出たか、何番目か、自分のサイトが根拠になったか。</J></p>
      <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.l} className="card p-5">
            <p className="text-[0.8rem] text-sub"><J>{c.l}</J></p>
            <p className="mt-2"><b className="num text-[2.2rem] leading-none text-ai">{c.v}</b><span className="ml-1 text-[0.9rem] text-sub">{c.u}</span></p>
            <p className="mt-2 text-[0.75rem] leading-[1.7] text-sub"><J>{c.d}</J></p>
          </div>
        ))}
      </div>
      <h3 className="mt-14 text-[1rem] font-bold">AIごとの結果</h3>
      <ul className="mt-5 border-t hair">
        {m.byAi.map((a) => (
          <li key={a.ai} className="grid grid-cols-[6.5rem_1fr_3.2rem] items-center gap-4 border-b hair py-3.5 text-[0.9rem] sm:grid-cols-[8rem_1fr_4rem_5rem]">
            <b className="truncate">{a.ai}</b>
            <span className="h-1.5 overflow-hidden rounded-full bg-white/[.06]"><span className="block h-full rounded-full bg-ai transition-all duration-700" style={{ width: `${Math.max(2, a.pct)}%` }} /></span>
            <span className="num text-right">{a.pct}%</span>
            <span className="num hidden text-right text-[0.8rem] text-sub sm:block">1位 {a.top1}%</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

// AIが答える前に調べたキーワードと、ページが答えられているか
function Fanout() {
  const s = useStore();
  const [qid, setQid] = useState(QUESTIONS[0].id);
  const q = QUESTIONS.find((x) => x.id === qid)!;
  const ks = FANOUT[qid] ?? [];
  const miss = ks.filter((k) => !covers(q.product, k.sig, s.applied)).length;
  return (
    <div>
      <p className="mt-2 text-[0.88rem] leading-[1.9] text-sub"><J>AIは、お客様の質問をいくつかのキーワードに分けて調べてから答えます。そのキーワードに、SORAEのページが答えられているかを見ます。</J></p>
      <label className="mt-6 block text-[0.82rem] font-bold">お客様の質問<select value={qid} onChange={(e) => setQid(e.target.value)} className="field mt-1">{QUESTIONS.map((x) => <option key={x.id} value={x.id}>{x.text}</option>)}</select></label>
      <ul className="mt-6 border-t hair">
        {ks.map((k) => { const ok = covers(q.product, k.sig, s.applied); return (
          <li key={k.k} className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b hair py-3.5 text-[0.9rem]">
            <Search size={15} className="shrink-0 text-sub" /><span className="min-w-0 flex-1"><J>{k.k}</J></span>
            {ok ? <span className="flex items-center gap-1 text-[0.8rem] font-bold text-ai"><Check size={15} />ページに答えがある</span> : <span className="flex items-center gap-1 text-[0.8rem] font-bold text-warn"><X size={15} />{k.sig ? `「${SIGNALS[k.sig]}」がない` : "答えがない"}</span>}
          </li>
        ); })}
      </ul>
      {miss > 0 ? <Link href="/naosu/" className="btn btn-ai mt-8 px-7">足りない{miss}つを直す<ArrowRight size={18} /></Link> : <p className="mt-6 flex items-center gap-2 text-[0.88rem] text-ai"><Check size={17} />この質問のキーワードには、すべて答えられています。</p>}
    </div>
  );
}

// 結果をCSVで書き出す（Excelでそのまま開ける形）
function exportCsv(applied: string[]) {
  const head = ["質問", "商品", ...AIS.map((a) => `${a}（${TRIES}回中）`), "合計"];
  const rows = QUESTIONS.map((q) => { const by = AIS.map((a) => shown(q, a, applied)); return [q.text, PRODUCTS.find((p) => p.id === q.product)!.short, ...by, by.reduce((x, y) => x + y, 0)]; });
  const esc = (v: string | number) => { const t = String(v); return /[",\n]/.test(t) ? `"${t.replace(/"/g, '""')}"` : t; };
  const csv = "\ufeff" + [head, ...rows].map((r) => r.map(esc).join(",")).join("\r\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  a.download = `tsurete-ai-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  toast("CSVを書き出しました");
}

function Hakaru() {
  const s = useStore();
  const sh = shelf(s.applied);
  const data = [...WEEKS, { w: "今週", p: sh.pct }];
  const diff = sh.pct - WEEKS[WEEKS.length - 1].p;
  const rank = [...sh.rivals.slice(0, 4), { name: BRAND.name, n: sh.total }].sort((a, b) => b.n - a.n);
  const myPos = rank.findIndex((r) => r.name === BRAND.name) + 1;
  const mine = (k: Sig) => PRODUCTS.reduce((a, p) => a + signals(p.id, s.applied)[k], 0) / PRODUCTS.length >= 0.4;
  const cols = [BRAND.name, ...Object.keys(RIVAL_HAS)];
  const win = winners(s.applied);
  return (
    <>
      <Title n="PRO" title="測る" lead="同じジャンルのお店とまとめてAIに聞いた結果を、共有して見る画面です（プロプラン）。どの質問で、どの店に負けているかが分かります。お店がAIの利用料を払う必要はありません。数字は目安です。" />

      <section aria-label="今週の結果" className="grid gap-12 md:grid-cols-[auto_1fr] md:gap-16">
        <div>
          <p className="text-[0.85rem] text-sub">今週、AIにすすめられた割合</p>
          <p className="mt-2"><b className="num text-[4.2rem] leading-none text-ai">{sh.pct}</b><span className="ml-1 text-[1.2rem] text-sub">%</span></p>
          <p className={`num mt-3 text-[0.88rem] ${diff > 0 ? "text-ai" : "text-sub"}`}>{diff > 0 ? `先週より +${diff}ポイント` : diff < 0 ? `先週より ${diff}ポイント` : "先週と同じ"}</p>
          <p className="mt-6 text-[0.8rem] leading-[1.9] text-sub">ジャンル「スキンケア」の共有の測定<br />{QUESTIONS.length}個の質問 × {AIS.length}つのAI × {TRIES}回<br />次の測定：11月24日（月）</p>
        </div>
        <div className="min-w-0"><div className="hidden sm:block"><Trend data={data} /></div><div className="sm:hidden"><Trend data={data} W={360} H={200} fs={12} /></div></div>
      </section>

      <Metrics />

      <section className="mt-24" aria-labelledby="rk">
        <h2 id="rk" className="text-[1.2rem] font-bold tracking-[.04em]">AIの売り場での順位</h2>
        <p className="mt-2 text-[0.88rem] text-sub"><J>同じ質問で、どのブランドがすすめられたか。</J><span className="whitespace-nowrap">いまは <b className="text-ink">{myPos}位</b> です。</span></p>
        <ol className="mt-8 border-t hair">
          {rank.map((r, i) => {
            const me = r.name === BRAND.name;
            return (
              <li key={r.name} className="grid grid-cols-[2rem_7.5rem_1fr_3.5rem] items-center gap-4 border-b hair py-4 text-[0.92rem] sm:grid-cols-[2.5rem_10rem_1fr_4rem]">
                <span className={`num ${me ? "text-ai" : "text-sub"}`}>{i + 1}</span>
                <b className={`truncate ${me ? "text-ai" : ""}`}>{r.name}</b>
                <span className="h-1.5 overflow-hidden rounded-full bg-white/[.06]"><span className={`block h-full rounded-full transition-all duration-700 ${me ? "bg-ai" : "bg-[#2a3b5c]"}`} style={{ width: `${(r.n / rank[0].n) * 100}%` }} /></span>
                <span className="num text-right text-sub">{Math.round((r.n / sh.max) * 100)}%</span>
              </li>
            );
          })}
        </ol>
      </section>

      <div className="mt-20" />
      <Fold title="よくすすめられている店との差" sub="ページに書かれていることの比較">
        <p className="mt-2 text-[0.88rem] leading-[1.9] text-sub"><J>AIが答えるときに参考にしたページを読んで、書かれていることを比べました。</J></p>
        <div className="mt-8">
          <table className="w-full table-fixed text-[0.8rem] sm:text-[0.88rem]">
            <thead><tr className="border-b hair text-left text-[0.78rem] text-sub"><th className="w-[33%] py-3 min-[360px]:w-[38%] font-medium sm:w-auto"><J>AIが見ている情報</J></th>{cols.map((c) => <th key={c} className={`px-0.5 py-3 text-center text-[0.66rem] font-bold leading-[1.3] sm:px-2 sm:text-[0.78rem] ${c === BRAND.name ? "text-ai" : ""}`}>{c.includes(" ") ? <J>{c}</J> : <span className="whitespace-nowrap">{c}</span>}</th>)}</tr></thead>
            <tbody>
              {(Object.keys(SIGNALS) as Sig[]).map((k) => (
                <tr key={k} className="border-b hair">
                  <td className="py-3.5 pr-2 leading-[1.5]"><J>{SIGNALS[k]}</J></td>
                  {cols.map((c) => { const ok = c === BRAND.name ? mine(k) : RIVAL_HAS[c].includes(k); return <td key={c} className="px-2 text-center">{ok ? <Check size={17} className="mx-auto text-ai" /> : c === BRAND.name ? <span className="text-[0.75rem] font-bold text-warn">なし</span> : <Minus size={15} className="mx-auto text-sub/50" />}</td>; })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Link href="/naosu/" className="btn btn-ai mt-10 px-7">この差を直す<ArrowRight size={18} /></Link>
      </Fold>

      <Fold title="質問ごとの結果" sub="どの質問で、どの店がいちばんか">
        <ul className="mt-8 border-t hair">
          {win.map((r) => (
            <li key={r.q.id} className="grid gap-x-6 gap-y-1 border-b hair py-4 sm:grid-cols-[1fr_9rem_6rem] sm:items-center">
              <span className="text-[0.92rem]"><J>{r.q.text}</J></span>
              <span className="text-[0.8rem] text-sub">いちばん：<b className={r.top === BRAND.name ? "text-ai" : "text-ink"}>{r.top}</b></span>
              <span className={`num text-[0.85rem] sm:text-right ${r.me / r.max >= 0.5 ? "text-ai" : "text-warn"}`}>{BRAND.name} {Math.round((r.me / r.max) * 100)}%</span>
            </li>
          ))}
        </ul>
      </Fold>

      <Fold title="AIが調べたキーワード" sub="質問の裏で、AIが検索した言葉"><Fanout /></Fold>
      <Fold title="AIが根拠にしたサイト" sub="ここに載ると、すすめられやすくなる"><Sources /></Fold>
      <Fold title="お客様がAIに聞くと" sub="いまのページで、AIがどう答えるかの再現"><ChatSim /><Real /></Fold>
      <Fold title="自分で聞いた結果を記録する" sub="ふだん使うAIで試した結果を残す"><SelfLog /></Fold>
      <div className="mt-14 flex flex-wrap items-center gap-4"><button type="button" onClick={() => exportCsv(s.applied)} className="btn px-6 ring-1 ring-white/15"><Download size={17} />結果をCSVで書き出す</button><span className="text-[0.78rem] text-sub"><J>質問ごと・AIごとの回数。Excelで開けます。</J></span></div>
    </>
  );
}

export default function Page() { return <Shell><Ready><Hakaru /></Ready></Shell>; }
