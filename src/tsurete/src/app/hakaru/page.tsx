"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Check, Download, ExternalLink, Lightbulb, Mail, MessageSquare, Minus, NotebookPen, Plus, RefreshCw, Search, Send, TrendingDown, TrendingUp, X } from "lucide-react";
import { toast } from "@/components/Confirm";
import Shell, { Title } from "@/components/Shell";
import Ready from "@/components/Ready";
import Fold from "@/components/Fold";
import { ChatSim, Real } from "@/components/ChatSim";
import { AIS, BRAND, FANOUT, FIXES, avgOf, brands, daily, grid, type Day, PRODUCTS, QUESTIONS, RIVAL_HAS, SIGNALS, TRIES, covers, metrics, shown, signals, winners, type Sig } from "@/lib/demo";
import { uid, update, useStore } from "@/lib/store";
import J from "@/components/J";

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
      <div className="card mt-6 grid grid-cols-1 gap-3 p-5 sm:grid-cols-[1fr_9rem_9rem_auto] sm:items-end">
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

// ---------- 毎週の推移：期間を選び、前の期間とくらべる ----------
const LINES: { k: keyof Omit<Day, "d">; l: string; c: string }[] = [
  { k: "pct", l: "すすめられた割合", c: "#1f5ad1" },
  { k: "cite", l: "自分のサイトが根拠に", c: "#38bdf8" },
  { k: "top1", l: "1位の割合", c: "#f2b84b" },
];
function DailyChart({ data, W = 680, H = 210, fs = 10 }: { data: Day[]; W?: number; H?: number; fs?: number }) {
  const P = 30, max = Math.max(20, ...data.flatMap((d) => LINES.map((l) => d[l.k]))) * 1.15;
  const x = (i: number) => P + (i * (W - P * 2)) / Math.max(1, data.length - 1), y = (v: number) => H - P - (v / max) * (H - P * 2);
  const step = Math.ceil(data.length / 7);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="毎週の推移のグラフ">
      {[0, 0.5, 1].map((f) => <g key={f}><line x1={P} x2={W - P} y1={y(max * f)} y2={y(max * f)} stroke="rgba(11,30,61,.08)" /><text x={0} y={y(max * f) + 4} fontSize={fs} fill="#6b7b98">{Math.round(max * f)}%</text></g>)}
      {LINES.map((l) => <path key={l.k} d={data.map((p, i) => `${i ? "L" : "M"}${x(i)},${y(p[l.k])}`).join(" ")} fill="none" stroke={l.c} strokeWidth="2.2" strokeLinejoin="round" />)}
      {data.map((p, i) => (i % step === 0 || i === data.length - 1) && <text key={p.d} x={x(i)} y={H - 8} fontSize={fs} fill="#6b7b98" textAnchor="middle">{p.d}</text>)}
    </svg>
  );
}
function Daily() {
  const s = useStore();
  const [days, setDays] = useState(12);
  const [left, setLeft] = useState(2); // 今すぐ測るは、プロで月2回まで
  const [now, setNow] = useState<null | "run" | "done">(null);
  const [prog, setProg] = useState(0);
  const all = daily(s.applied, days * 2), cur = all.slice(days), prev = all.slice(0, days);
  const run = () => {
    setNow("run"); setProg(0);
    AIS.forEach((_, i) => setTimeout(() => setProg(i + 1), 350 * (i + 1)));
    setTimeout(() => { setNow("done"); setLeft((x) => x - 1); toast("いまの状態で測りなおしました"); }, 350 * AIS.length + 250);
  };
  return (
    <section aria-label="毎週の推移">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex rounded-full bg-white/[.05] p-1 text-[0.8rem]" role="tablist" aria-label="期間">
          {[4, 12, 26].map((d) => <button key={d} type="button" role="tab" aria-selected={days === d} onClick={() => setDays(d)} className={`rounded-full px-3.5 py-1.5 ${days === d ? "bg-ai font-bold text-paper" : "text-sub"}`}>{d}週</button>)}
        </div>
        <button type="button" onClick={run} disabled={now === "run" || left <= 0} className="btn ml-auto px-5 ring-1 ring-white/15 disabled:opacity-60"><RefreshCw size={16} className={now === "run" ? "animate-spin" : ""} />{now === "run" ? `測っています（${prog}/${AIS.length}）` : left > 0 ? `今すぐ測る（今月あと${left}回）` : "今月の回数を使いきりました"}</button>
      </div>
      <p className="mt-3 text-[0.78rem] text-sub">毎週の自動の測定（月曜の朝）{now === "done" ? "・いま測りなおしました" : "・最後の測定：11月17日（月）"}</p>
      <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-3">
        {LINES.map((l) => {
          const a = avgOf(cur, l.k), b = avgOf(prev, l.k), d = Math.round((a - b) * 10) / 10;
          return (
            <div key={l.k} className="card min-w-0 p-3 sm:p-5">
              <p className="flex items-center gap-1.5 text-[0.7rem] leading-[1.4] text-sub sm:text-[0.8rem]"><i className="h-2 w-2 shrink-0 rounded-full" style={{ background: l.c }} /><J>{l.l}</J></p>
              <p className="mt-2"><b className="num text-[1.4rem] leading-none sm:text-[2rem]">{a}</b><span className="ml-0.5 text-[0.75rem] text-sub">%</span></p>
              <p className={`num mt-2 flex items-center gap-1 text-[0.72rem] sm:text-[0.8rem] ${d > 0 ? "text-ai" : d < 0 ? "text-warn" : "text-sub"}`}>{d > 0 ? <TrendingUp size={13} /> : d < 0 ? <TrendingDown size={13} /> : null}{d > 0 ? "+" : ""}{d}pt<span className="hidden text-sub sm:inline">（前の{days}週）</span></p>
            </div>
          );
        })}
      </div>
      <div className="mt-6"><div className="hidden sm:block"><DailyChart data={cur} /></div><div className="sm:hidden"><DailyChart data={cur} W={360} H={220} fs={12} /></div></div>
    </section>
  );
}

// ---------- 気づき：数字が動いた理由と、次の一手 ----------
function Insights() {
  const s = useStore();
  const g = grid(s.applied), m = metrics(s.applied), w = winners(s.applied);
  const weakQ = [...g].sort((a, b) => a.by.reduce((x, y) => x + y, 0) - b.by.reduce((x, y) => x + y, 0))[0];
  const weakWin = w.find((r) => r.q.id === weakQ.q.id)!;
  const weakAi = [...m.byAi].sort((a, b) => a.pct - b.pct)[0];
  const done = FIXES.filter((f) => s.applied.includes(f.id));
  const next = FIXES.find((f) => !s.applied.includes(f.id));
  const miss = (FANOUT[weakQ.q.id] ?? []).filter((k) => !covers(weakQ.q.product, k.sig, s.applied));
  const items = [
    done.length ? { t: `直した${done.length}件が効きはじめています`, d: `「${done[done.length - 1].title}」などを反映したあとの数日で、すすめられた割合が上がっています。`, good: true } : { t: "まだ、何も直していません", d: "いまの数字は、直す前の状態です。下の「次の一手」から始めましょう。", good: false },
    { t: `いちばん負けている質問：「${weakQ.q.text}」`, d: `この質問では「${weakWin.top}」がよくすすめられています。${miss.length ? `AIが調べた「${miss[0].k}」に、SORAEのページが答えられていません。` : ""}`, good: false },
    { t: `いちばん弱いAI：${weakAi.ai}（${weakAi.pct}%）`, d: weakAi.ai === "Perplexity" ? "Perplexityは、外の記事を根拠にしやすいAIです。比較記事への掲載が効きます。" : "このAIは、AIが読める商品データ（構造化データ）をよく見ます。", good: false },
  ];
  return (
    <section className="mt-20" aria-labelledby="ins">
      <h2 id="ins" className="flex items-center gap-2 text-[1.2rem] font-bold tracking-[.04em]"><Lightbulb size={20} className="text-ai" />気づきと、次の一手</h2>
      <ul className="mt-6 space-y-3">{items.map((x) => <li key={x.t} className="card p-5"><b className={`block text-[0.95rem] leading-[1.6] ${x.good ? "text-ai" : ""}`}><J>{x.t}</J></b><p className="mt-1.5 text-[0.86rem] leading-[1.85] text-sub"><J>{x.d}</J></p></li>)}</ul>
      {next && <Link href="/naosu/" className="btn btn-ai mt-6 h-auto max-w-full whitespace-normal px-6 py-3 text-left leading-[1.6]"><span className="min-w-0">次の一手：<J>{next.title}</J></span><ArrowRight size={18} className="shrink-0" /></Link>}
    </section>
  );
}

// ---------- 質問 × AI の一覧（色の濃さ＝すすめられた割合） ----------
function Heat() {
  const s = useStore();
  const g = grid(s.applied);
  const col = (v: number) => v === 0 ? "rgba(11,30,61,.07)" : `rgba(77,141,255,${0.18 + v * 0.82})`;
  return (
    <section className="mt-20" aria-labelledby="ht">
      <h2 id="ht" className="text-[1.2rem] font-bold tracking-[.04em]">質問 × AI</h2>
      <p className="mt-2 text-[0.88rem] text-sub"><J>どの質問を、どのAIに聞いたときに、すすめられたか。色が濃いほど、よくすすめられています。</J></p>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[46rem] table-fixed text-[0.78rem]">
          <thead><tr className="text-sub"><th className="w-[42%] py-2 text-left font-medium">質問</th>{AIS.map((a) => <th key={a} className="px-1 py-2 text-center font-medium">{a}</th>)}</tr></thead>
          <tbody>{g.map((r) => <tr key={r.q.id} className="border-t hair"><td className="py-2.5 pr-2 leading-[1.5]"><J>{r.q.text}</J></td>{r.by.map((v, i) => <td key={i} className="p-1"><span className="num block rounded-md py-2 text-center text-[0.72rem]" style={{ background: col(v), color: v > 0.45 ? "#ffffff" : "#687387" }}>{Math.round(v * 100)}</span></td>)}</tr>)}</tbody>
        </table>
      </div>
      <p className="mt-2 text-[0.72rem] text-sub">数字は、直近の測定で、その質問をそのAIに聞いたときにすすめられた割合（%）です。</p>
    </section>
  );
}

// ---------- ブランドどうしの比較 ----------
function Brands() {
  const s = useStore();
  const b = brands(s.applied);
  return (
    <section className="mt-20" aria-labelledby="br">
      <h2 id="br" className="text-[1.2rem] font-bold tracking-[.04em]">ほかのブランドとの比較</h2>
      <p className="mt-2 text-[0.88rem] text-sub"><J>同じ質問で、どのブランドが、どれくらい、何番目にすすめられたか。</J></p>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[32rem] text-[0.86rem]">
          <thead><tr className="border-b hair text-[0.75rem] text-sub"><th className="py-2.5 text-left font-medium">ブランド</th><th className="py-2.5 text-right font-medium">すすめられた</th><th className="py-2.5 text-right font-medium">1位</th><th className="py-2.5 text-right font-medium">根拠に</th><th className="py-2.5 text-right font-medium">平均の順位</th></tr></thead>
          <tbody>{b.map((r, i) => <tr key={r.name} className={`border-b hair ${r.me ? "text-ai" : ""}`}><td className="py-3"><span className="num mr-3 text-sub">{i + 1}</span><b>{r.name}</b></td><td className="num text-right">{r.pct}%</td><td className="num text-right">{r.top1}%</td><td className="num text-right">{r.cite}%</td><td className="num text-right">{r.avg}位</td></tr>)}</tbody>
        </table>
      </div>
    </section>
  );
}

// ---------- データに質問する（決まった質問に、測った結果から答える） ----------
const ASKS = ["負けている質問は？", "いちばん弱いAIは？", "次に何を直せばいい？", "ほかのブランドとの差は？"];
function Ask() {
  const s = useStore();
  const [log, setLog] = useState<{ q: string; a: string }[]>([]);
  const [text, setText] = useState("");
  const reply = (q: string) => {
    const g = grid(s.applied), m = metrics(s.applied), b = brands(s.applied), w = winners(s.applied);
    const t = q.replace(/\s/g, "");
    let a = "";
    if (/負け|弱い質問|質問/.test(t) && !/AI/.test(t)) {
      const lose = w.filter((r) => r.top !== BRAND.name).sort((x, y) => x.me - y.me).slice(0, 3);
      a = `いちばん負けているのは、次の${lose.length}つです。\n` + lose.map((r, i) => `${i + 1}. 「${r.q.text}」：いちばんは${r.top}、SORAEは${Math.round((r.me / r.max) * 100)}%`).join("\n");
    } else if (/AI/.test(t)) {
      const o = [...m.byAi].sort((x, y) => x.pct - y.pct);
      a = `いちばん弱いのは${o[0].ai}（${o[0].pct}%）、いちばん強いのは${o[o.length - 1].ai}（${o[o.length - 1].pct}%）です。`;
    } else if (/直|次|やる/.test(t)) {
      const n = FIXES.filter((f) => !s.applied.includes(f.id)).slice(0, 2);
      a = n.length ? `次は「${n[0].title}」がおすすめです（目安${n[0].effort}）。${n[1] ? `そのあと「${n[1].title}」。` : ""}` : "用意した対策は、すべて反映ずみです。";
    } else if (/差|ブランド|比較|競合/.test(t)) {
      const top = b[0], me = b.find((r) => r.me)!;
      a = top.me ? `いまはSORAEがいちばんすすめられています（${me.pct}%）。` : `いちばんは${top.name}（${top.pct}%）で、SORAEは${me.pct}%です。差は${top.pct - me.pct}ポイント。根拠になった割合は${top.name}が${top.cite}%、SORAEが${me.cite}%です。`;
    } else a = "いまは、下の決まった質問に答えられます。\n" + ASKS.join("／");
    setLog((l) => [...l, { q, a }]); setText("");
    void g;
  };
  return (
    <div>
      <p className="mt-2 text-[0.88rem] leading-[1.9] text-sub"><J>測った結果について、ことばで聞けます。答えは、このページの数字から作ります（AIの利用料はかかりません）。</J></p>
      <div className="mt-5 flex flex-wrap gap-2">{ASKS.map((q) => <button key={q} type="button" onClick={() => reply(q)} className="rounded-full px-3.5 py-1.5 text-[0.82rem] ring-1 ring-white/15 hover:bg-white/[.04]">{q}</button>)}</div>
      {log.length > 0 && <ul className="mt-6 space-y-4">{log.slice(-4).map((x, i) => <li key={i}><p className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-ai/15 px-4 py-2.5 text-[0.88rem]">{x.q}</p><p className="mt-2 w-fit max-w-[92%] whitespace-pre-line rounded-2xl rounded-bl-md bg-white/[.05] px-4 py-3 text-[0.88rem] leading-[1.85]"><J>{x.a}</J></p></li>)}</ul>}
      <form onSubmit={(e) => { e.preventDefault(); if (text.trim()) reply(text.trim()); }} className="mt-5 flex gap-2">
        <label className="sr-only" htmlFor="ask">質問</label>
        <input id="ask" value={text} onChange={(e) => setText(e.target.value.slice(0, 60))} placeholder="例：負けている質問は？" className="field" />
        <button type="submit" className="btn btn-ai shrink-0 px-4" aria-label="送る"><Send size={17} /></button>
      </form>
    </div>
  );
}

function Hakaru() {
  const s = useStore();
  const mine = (k: Sig) => PRODUCTS.reduce((a, p) => a + signals(p.id, s.applied)[k], 0) / PRODUCTS.length >= 0.4;
  const cols = [BRAND.name, ...Object.keys(RIVAL_HAS)];
  const win = winners(s.applied);
  return (
    <>
      <Title n="PRO" title="測る" lead="お客様が聞きそうな質問を、4つのAIに毎週くり返し聞いた結果です（プロプラン）。名前が出たか、何番目か、自分のサイトが根拠になったか、どの店に負けているかが分かります。お店がAIの利用料を払う必要はありません。数字は架空のブランドでの模擬の結果です。" />

      <Daily />

      <Metrics />

      <Insights />
      <Heat />
      <Brands />

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
            <li key={r.q.id} className="grid grid-cols-1 gap-x-6 gap-y-1 border-b hair py-4 sm:grid-cols-[1fr_9rem_6rem] sm:items-center">
              <span className="text-[0.92rem]"><J>{r.q.text}</J></span>
              <span className="text-[0.8rem] text-sub">いちばん：<b className={r.top === BRAND.name ? "text-ai" : "text-ink"}>{r.top}</b></span>
              <span className={`num text-[0.85rem] sm:text-right ${r.me / r.max >= 0.5 ? "text-ai" : "text-warn"}`}>{BRAND.name} {Math.round((r.me / r.max) * 100)}%</span>
            </li>
          ))}
        </ul>
      </Fold>

      <Fold title="データに質問する" sub="「負けている質問は？」のように、ことばで聞く" open><Ask /></Fold>
      <Fold title="AIが調べたキーワード" sub="質問の裏で、AIが検索した言葉"><Fanout /></Fold>
      <Fold title="AIが根拠にしたサイト" sub="ここに載ると、すすめられやすくなる"><Sources /></Fold>
      <Fold title="お客様がAIに聞くと" sub="いまのページで、AIがどう答えるかの再現"><ChatSim /><Real /></Fold>
      <Fold title="自分で聞いた結果を記録する" sub="ふだん使うAIで試した結果を残す"><SelfLog /></Fold>
      <div className="mt-14 flex flex-wrap items-center gap-4"><button type="button" onClick={() => exportCsv(s.applied)} className="btn px-6 ring-1 ring-white/15"><Download size={17} />結果をCSVで書き出す</button><span className="text-[0.78rem] text-sub"><J>質問ごと・AIごとの回数。Excelで開けます。</J></span></div>
    </>
  );
}

export default function Page() { return <Shell><Ready><Hakaru /></Ready></Shell>; }
