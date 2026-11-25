"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Award, Check, ChevronDown, ChevronRight, CircleHelp, Clock, Download, GraduationCap, Hand, Lightbulb, MonitorSmartphone, MousePointerClick, RotateCcw, Store, X } from "lucide-react";
import Shell from "@/components/Shell";
import Ready from "@/components/Ready";
import J from "@/components/J";
import { toast } from "@/components/Confirm";
import { CHAPTERS, LESSONS, TOTAL_MIN, type Chapter, type Lesson } from "@/lib/learn";
import { BRAND } from "@/lib/demo";
import { update, useStore } from "@/lib/store";

const SHOT = "/sakuapp/works/tsurete/img/lp";

// ---------- 使い方（デモの4つの画面） ----------
const USE = [
  { n: 1, href: "/kenko/", title: "診断", img: "m-kenko.webp?v=2",
    what: "全商品のページを、AIに選ばれるための8つの項目（向いている人、比較表、よくある質問、構造化データなど）で点検した画面です。AIは使わないので、AIの利用料はかかりません。",
    try: ["いちばん上の点数（ページの健康スコア）を見ます。", "商品の行を押すと、×がついた項目（足りないところ）が開きます。", "「直す」を押すと、その商品の処方箋に移ります。"],
    point: "まだ登録していない商品は、下の「URLで診断」「CSVでまとめて診断」から点検できます。" },
  { n: 2, href: "/naosu/", title: "直す", img: "m-naosu.webp?v=2",
    what: "診断で足りなかったところの、処方箋（書き直し案と貼るコード）の画面です。お店のサイトを選ぶと、届け方（コピー・CSV・自動で書きかえ）が変わります。",
    try: ["はじめに「お店のサイト」を選びます（例：Shopify、楽天市場）。", "「案を見る」で書き直し案を確かめます。", "「コピーする」（サイトによっては「反映する」）を押します。"],
    point: "反映されるのは、お店の人が「この案を使う」を押したものだけです。デモでは、実際のサイトは変わりません。" },
  { n: 3, href: "/kouka/", title: "売上", img: "m-sales.webp?v=2",
    what: "お店のサイトに貼った計測タグで、AIから来たお客様と、その売上を数える画面です。推測ではなく、実際の来店と注文です。",
    try: ["「設定」の「計測タグ」で、サイトに合った貼り方を見て、「貼ったので確認する」を押します。", "戻ってきて、どのAIから何人来て、いくら売れたかを見ます。"],
    point: "Googleの無料の公式ツール「Search Console」の使い方も、この画面で案内しています。" },
  { n: 4, href: "/hakaru/", title: "測る（プロ）", img: "m-measure.webp?v=2",
    what: "お客様が聞きそうな質問をAIにくり返し聞いて、すすめられた割合・1位の割合・自分のサイトが根拠になった割合・平均の順位を測る画面です。ほかのブランドとの比較や、数字が動いた理由も分かります。",
    try: ["期間（4週・12週・26週）を選んで、前の期間とくらべます。", "「気づきと、次の一手」で、負けている質問と直すことを見ます。", "「データに質問する」で「負けている質問は？」と聞いてみます。"],
    point: "お店がAIの利用料を払う必要はありません。数字は目安です。" },
];


// ---------- よくある質問（使い方ガイドから） ----------
const QA = [
  { q: "AIに自分で聞くのと、何が違いますか？", a: "AIの答えは人や回ごとに変わるので、自分で聞いた1回の答えは当てになりません。TSURETEは、AIの答えを当てにいくのではなく、AIが読み取りやすいページかを点検して直し、効いたかどうかを計測タグで実際の来店と売上で確かめます。" },
  { q: "AIの利用料はかかりますか？", a: "お店が払う必要はありません。点検はAIを使わずに行い、書き直し案を作る分の小さな費用は、TSURETEの料金に含みます。" },
  { q: "どのサイトでも使えますか？", a: "はい。診断と処方箋は、どのサイトでも使えます。届け方は、Shopifyなどは自動で書きかえ、楽天・Amazonなどは取りこみ用のCSV、そのほかはコピーです。計測タグは、Shopify・WordPress・自作のサイトなどに貼れます。" },
  { q: "だれ向けですか？", a: "Shopify・BASE・STORESなどで自社のネットショップを持つ、小さなブランドです。スキンケア・食品・雑貨など、お客様が比べて選ぶ商品に向いています。" },
  { q: "なぜ書き直すと、AIにすすめられるのですか？", a: "AIは「敏感肌向け」「無香料」「1日あたりの値段」のように、はっきり書かれた情報や、表・質問と答えの形の情報から商品を選びます。雰囲気だけの説明では、候補に入りにくくなります。" },
  { q: "本当にショップの文章が変わりますか？", a: "デモでは変わりません。実際のツールでは、お店の人が確認したものだけを反映します。" },
  { q: "画面の数字は本物ですか？", a: "架空のブランド「SORAE」の、模擬の数字です。AIにすすめられることは保証できません。" },
];


const markRead = (id: string) => update((x) => ({ ...x, learn: [...new Set([...(x.learn ?? []), id])] }));

function UseCard({ s }: { s: (typeof USE)[number] }) {
  const st = useStore();
  const id = `g${s.n}`, done = (st.learn ?? []).includes(id);
  return (
    <li className="card flex flex-col overflow-hidden p-0">
      <div className="relative h-[13rem] overflow-hidden border-b hair bg-[#f5f7fb] sm:h-[15rem]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`${SHOT}/${s.img}`} alt={`「${s.title}」の画面`} width={1410} height={1600} loading="lazy" className="absolute inset-x-0 top-0 mx-auto block w-full max-w-[24rem] object-cover object-top" />
        <span className={`absolute left-4 top-4 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.72rem] font-bold shadow-sm ${done ? "bg-ai text-white" : "bg-white text-ink ring-1 ring-black/[.06]"}`}>{done ? <Check size={13} /> : <span className="num">STEP {s.n}</span>}{done && "試しました"}</span>
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <b className="text-[1.15rem]">{s.title}</b>
        <p className="mt-2 text-[0.88rem] leading-[1.85] text-sub"><J>{s.what}</J></p>
        <ol className="mt-4 space-y-2 rounded-[8px] bg-[#f5f7fb] p-4">{s.try.map((t, i) => <li key={t} className="flex gap-2.5 text-[0.86rem] leading-[1.7]"><span className="num mt-[0.15rem] grid h-5 w-5 shrink-0 place-items-center rounded-full bg-ai text-[0.66rem] font-bold text-white">{i + 1}</span><span className="min-w-0"><J>{t}</J></span></li>)}</ol>
        <p className="mt-3 flex gap-2 text-[0.8rem] leading-[1.75] text-sub"><Lightbulb size={15} className="mt-[0.2rem] shrink-0 text-ai" /><span className="min-w-0"><J>{s.point}</J></span></p>
        <div className="mt-auto pt-5"><Link href={s.href} onClick={() => markRead(id)} className="btn btn-ai w-full">この画面を開いて試す<ArrowRight size={17} /></Link></div>
      </div>
    </li>
  );
}

function Chapter({ c, openLesson, setOpenLesson, defaultOpen }: { c: Chapter; openLesson: string | null; setOpenLesson: (x: string | null) => void; defaultOpen: boolean }) {
  const st = useStore();
  const [open, setOpen] = useState(defaultOpen);
  const read = c.lessons.filter((l) => (st.learn ?? []).includes(l.id)).length, passed = (st.passed ?? []).includes(c.id);
  const k = (read + (passed ? 1 : 0)) / (c.lessons.length + 1);
  return (
    <li className="card overflow-hidden p-0">
      <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} className="flex w-full items-center gap-4 p-5 text-left sm:p-6">
        <span className={`num grid h-12 w-12 shrink-0 place-items-center rounded-[10px] text-[1.1rem] font-bold ${passed ? "bg-ai text-white" : "bg-ai/10 text-ai"}`}>{passed ? <Award size={22} /> : String(c.n).padStart(2, "0")}</span>
        <span className="min-w-0 flex-1">
          <span className="flex items-baseline gap-2"><b className="text-[1.08rem]">第{c.n}章　{c.t}</b></span>
          <span className="mt-0.5 block text-[0.82rem] text-sub"><J>{c.lead}</J></span>
          <span className="mt-2.5 flex items-center gap-3"><span className="h-1.5 max-w-[14rem] flex-1 overflow-hidden rounded-full bg-[#eef1f7]"><span className="block h-full rounded-full bg-ai transition-all duration-700" style={{ width: `${k * 100}%` }} /></span><span className="num text-[0.72rem] text-sub">{read}/{c.lessons.length}・{passed ? "合格" : "テスト未"}</span></span>
        </span>
        <ChevronDown size={19} className={`shrink-0 text-sub transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="border-t hair px-5 pb-6 sm:px-6">
          <ul>{c.lessons.map((l) => <LessonRow key={l.id} l={l} open={openLesson === l.id} onToggle={() => setOpenLesson(openLesson === l.id ? null : l.id)} />)}</ul>
          <QuizBox c={c} />
        </div>
      )}
    </li>
  );
}

function LessonRow({ l, open, onToggle }: { l: Lesson; open: boolean; onToggle: () => void }) {
  const s = useStore();
  const read = (s.learn ?? []).includes(l.id);
  return (
    <li className="border-b hair last:border-b-0">
      <button type="button" onClick={onToggle} aria-expanded={open} className="flex w-full items-center gap-4 py-4 text-left">
        <span className={`num grid h-7 w-7 shrink-0 place-items-center rounded-full text-[0.66rem] font-bold ${read ? "bg-ai text-white" : "bg-[#eef1f7] text-sub"}`}>{read ? <Check size={15} /> : l.id}</span>
        <span className="min-w-0 flex-1"><b className="block text-[0.95rem] leading-[1.6]"><J>{l.t}</J></b><span className="flex items-center gap-1 text-[0.75rem] text-sub"><Clock size={12} />約{l.min}分で読める</span></span>
        <ChevronDown size={18} className={`shrink-0 text-sub transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="pb-8 pl-11">
          {l.body.map((p, i) => <p key={i} className="mt-3 text-[0.95rem] leading-[2]"><J>{p}</J></p>)}
          <p className="mt-6 flex gap-3 rounded-[8px] border-l-[3px] border-ai bg-ai/[.07] px-4 py-3.5 text-[0.9rem] leading-[1.8]"><Lightbulb size={18} className="mt-1 shrink-0 text-ai" /><b><J>{l.point}</J></b></p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {!read && <button type="button" onClick={() => { markRead(l.id); toast("読みました"); }} className="btn btn-ai px-6"><Check size={17} />読んだ</button>}
            {l.try && <Link href={l.try.href} onClick={() => markRead(l.id)} className="btn btn-line h-auto max-w-full whitespace-normal px-5 py-2.5 text-left leading-[1.5]">{l.try.label}（{BRAND.name}で試す）</Link>}
          </div>
        </div>
      )}
    </li>
  );
}

function QuizBox({ c }: { c: Chapter }) {
  const s = useStore();
  const passed = (s.passed ?? []).includes(c.id);
  const [ans, setAns] = useState<(number | null)[]>(c.quiz.map(() => null));
  const [checked, setChecked] = useState(false);
  const score = c.quiz.filter((q, i) => ans[i] === q.ok).length;
  const submit = () => {
    setChecked(true);
    if (score === c.quiz.length) { update((x) => ({ ...x, passed: [...new Set([...(x.passed ?? []), c.id])] })); toast(`第${c.n}章に合格しました`); }
  };
  if (passed && !checked) return <p className="mt-5 flex items-center gap-2 rounded-[8px] bg-ai/[.07] px-4 py-3 text-[0.9rem] font-bold text-ai"><Award size={18} />第{c.n}章の確認テストに合格しています</p>;
  return (
    <div className="mt-5 rounded-[10px] border border-ai/20 bg-ai/[.04] p-5 sm:p-6">
      <p className="flex items-center gap-2 text-[0.95rem] font-bold"><Award size={17} className="text-ai" />第{c.n}章 確認テスト（{c.quiz.length}問）</p>
      {c.quiz.map((q, i) => (
        <fieldset key={q.q} className="mt-5">
          <legend className="text-[0.92rem] leading-[1.7]"><J>{`Q${i + 1}. ${q.q}`}</J></legend>
          <div className="mt-2 grid gap-2">
            {q.a.map((a, k) => {
              const sel = ans[i] === k, right = checked && k === q.ok, wrong = checked && sel && k !== q.ok;
              return (
                <button key={a} type="button" disabled={checked} onClick={() => setAns((x) => x.map((v, j) => (j === i ? k : v)))}
                  className={`flex items-center gap-3 rounded-[8px] bg-white px-4 py-3 text-left text-[0.9rem] ring-1 transition ${right ? "!bg-ai/10 ring-ai" : wrong ? "!bg-warn/10 ring-warn" : sel ? "ring-ai" : "ring-black/[.08] hover:ring-ai/50"}`}>
                  <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full ring-1 ${sel ? "bg-ai ring-ai text-white" : "ring-black/20"}`}>{right ? <Check size={12} className="text-white" /> : wrong ? <X size={12} /> : null}</span><span className="min-w-0"><J>{a}</J></span>
                </button>
              );
            })}
          </div>
          {checked && <p className={`mt-2 text-[0.82rem] leading-[1.8] ${ans[i] === q.ok ? "text-ai" : "text-warn"}`}><J>{`${ans[i] === q.ok ? "正解。" : "ちがいます。"}${q.why}`}</J></p>}
        </fieldset>
      ))}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        {!checked ? <button type="button" disabled={ans.some((a) => a === null)} onClick={submit} className="btn btn-ai px-7 disabled:opacity-40">答え合わせ</button>
          : score === c.quiz.length ? <p className="flex items-center gap-2 text-[0.9rem] font-bold text-ai"><Award size={18} />全問正解。第{c.n}章に合格です</p>
          : <button type="button" onClick={() => { setChecked(false); setAns(c.quiz.map(() => null)); }} className="btn btn-line px-6"><RotateCcw size={16} />もう一度（{score}/{c.quiz.length}問正解）</button>}
      </div>
    </div>
  );
}

// 修了証（画像を書き出す）
function drawCert(name: string) {
  const W = 1600, H = 1100, c = document.createElement("canvas"); c.width = W; c.height = H;
  const x = c.getContext("2d")!;
  x.fillStyle = "#ffffff"; x.fillRect(0, 0, W, H); x.fillStyle = "#0b1e3d"; x.fillRect(0, 0, W, 14); x.fillStyle = "#1f5ad1"; x.fillRect(0, 14, W, 4);
  x.strokeStyle = "rgba(11,30,61,.25)"; x.lineWidth = 2; x.strokeRect(50, 50, W - 100, H - 100);
  x.strokeStyle = "rgba(31,90,209,.25)"; x.lineWidth = 1; x.strokeRect(70, 70, W - 140, H - 140);
  x.textAlign = "center"; x.fillStyle = "#1f5ad1"; x.font = "700 30px sans-serif"; x.fillText("T S U R E T E   A C A D E M Y", W / 2, 190);
  x.fillStyle = "#0b1e3d"; x.font = "900 96px sans-serif"; x.fillText("修 了 証", W / 2, 330);
  x.font = "700 64px sans-serif"; x.fillText(`${name} 様`, W / 2, 500);
  x.fillStyle = "#394456"; x.font = "500 34px sans-serif";
  x.fillText("「AIに選ばれる商品ページ」講座（全5章・15レッスン）を", W / 2, 620);
  x.fillText("すべて読み終え、各章の確認テストに合格したことを証します。", W / 2, 676);
  const d = new Date(); x.fillStyle = "#687387"; x.font = "500 28px sans-serif"; x.fillText(`${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`, W / 2, 820);
  x.fillStyle = "#1f5ad1"; x.beginPath(); x.arc(W / 2 - 120, 940, 9, 0, Math.PI * 2); x.fill();
  x.fillStyle = "#0b1e3d"; x.font = "700 38px sans-serif"; x.fillText("TSURETE", W / 2 + 10, 953);
  const a = document.createElement("a"); a.href = c.toDataURL("image/png"); a.download = "tsurete-修了証.png"; a.click();
}

function Cert({ done }: { done: boolean }) {
  const [name, setName] = useState(BRAND.name);
  return (
    <section className="card mt-12 grid grid-cols-1 items-center gap-6 p-6 sm:p-8 md:grid-cols-[1fr_15rem]" aria-labelledby="cert-h"><div>
      <p className="eyebrow">CERTIFICATE</p>
      <h2 id="cert-h" className="mt-2 flex items-center gap-2 text-[1.3rem] font-bold"><Award size={22} className="text-ai" />修了証</h2>
      <p className="mt-2 text-[0.9rem] leading-[1.9] text-sub"><J>15レッスンをすべて読み、5つの確認テストに合格すると、お店の名前入りの修了証（画像）を受け取れます。</J></p>
      {done ? (
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <label className="sr-only" htmlFor="cn">修了証に入れる名前</label>
          <input id="cn" value={name} onChange={(e) => setName(e.target.value.slice(0, 20))} className="field" />
          <button type="button" onClick={() => { drawCert(name.trim() || BRAND.name); toast("修了証を保存しました"); }} className="btn btn-ai shrink-0 px-7"><Download size={17} />修了証を受け取る</button>
        </div>
      ) : <p className="mt-6 text-[0.88rem] text-sub">あと少しです。読んでいないレッスンと、合格していない確認テストを終えると受け取れます。</p>}
      </div>
      <div className="relative mx-auto aspect-[16/11] w-full max-w-[15rem] rounded-[6px] border border-black/[.08] bg-white p-3 text-center shadow-[0_18px_40px_-24px_rgba(11,30,61,.4)]" aria-hidden><i className="absolute inset-x-0 top-0 h-1.5 rounded-t-[6px] bg-ink" /><p className="mt-3 text-[0.45rem] font-bold tracking-[.3em] text-ai">TSURETE ACADEMY</p><p className="mt-1 text-[1rem] font-black tracking-[.3em]">修了証</p><p className="mt-1.5 text-[0.62rem] font-bold">{BRAND.name} 様</p><p className="mx-auto mt-1.5 h-1 w-3/4 rounded bg-[#eef1f7]" /><p className="mx-auto mt-1 h-1 w-2/3 rounded bg-[#eef1f7]" /></div>
    </section>
  );
}

function Ring({ pct }: { pct: number }) {
  const R = 42, C = 2 * Math.PI * R;
  return (
    <div className="relative h-[104px] w-[104px] shrink-0">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90"><circle cx="50" cy="50" r={R} fill="none" stroke="#eef1f7" strokeWidth="9" /><circle cx="50" cy="50" r={R} fill="none" stroke="var(--color-ai)" strokeWidth="9" strokeLinecap="round" strokeDasharray={`${(pct / 100) * C} ${C}`} style={{ transition: "stroke-dasharray .8s ease-out" }} /></svg>
      <p className="absolute inset-0 grid place-items-center"><span className="text-center"><b className="num text-[1.5rem] leading-none">{pct}</b><span className="text-[0.75rem] text-sub">%</span></span></p>
    </div>
  );
}

function Manabu() {
  const s = useStore();
  const [open, setOpen] = useState<string | null>(null);
  const [tab, setTab] = useState<"use" | "course" | "qa">(() => (typeof location !== "undefined" && location.hash === "#course" ? "course" : typeof location !== "undefined" && location.hash === "#qa" ? "qa" : "use"));
  const learned = s.learn ?? [];
  const used = USE.filter((u) => learned.includes(`g${u.n}`)).length;
  const read = learned.filter((id) => LESSONS.some((l) => l.id === id)).length;
  const passed = (s.passed ?? []).length;
  const all = USE.length + LESSONS.length + CHAPTERS.length;
  const pct = Math.round(((used + read + passed) / all) * 100);
  const done = read === LESSONS.length && passed === CHAPTERS.length;
  const firstOpen = CHAPTERS.find((c) => !(s.passed ?? []).includes(c.id))?.id ?? CHAPTERS[0].id;
  const nextUse = USE.find((u) => !learned.includes(`g${u.n}`));
  const tabs = [{ k: "use", t: "使い方", n: `${used}/${USE.length}` }, { k: "course", t: "講座", n: `${read}/${LESSONS.length}` }, { k: "qa", t: "よくある質問", n: "" }] as const;
  return (
    <>
      {/* はじめに：説明と、進み具合 */}
      <section className="grid grid-cols-1 items-center gap-6 lg:grid-cols-[1fr_22rem]">
        <div>
          <p className="eyebrow">ACADEMY</p>
          <h1 className="mt-2 text-[1.7rem] font-bold leading-[1.45] tracking-[.02em] sm:text-[2.1rem]">学ぶ・使い方</h1>
          <p className="mt-3 max-w-[36em] text-[0.95rem] leading-[1.95] text-sub"><J>まずは4つの画面を触って使い方をつかみ、そのあと講座で「なぜ効くのか」を学ぶ、の順がおすすめです。登録なし・無料です。</J></p>
          <ul className="mt-5 flex flex-wrap gap-2 text-[0.78rem]">
            {[[Store, "お店の人が使う管理画面の見本"], [Hand, "SORAEの佐藤さんになって押してみる"], [RotateCcw, "「設定」からいつでも最初に戻せる"]].map(([I, t]) => { const Ic = I as typeof Store; return <li key={t as string} className="flex items-center gap-1.5 rounded-[4px] bg-white px-2.5 py-1.5 text-sub ring-1 ring-black/[.06]"><Ic size={13} className="text-ai" />{t as string}</li>; })}
          </ul>
        </div>
        <div className="card flex items-center gap-5 p-5">
          <Ring pct={pct} />
          <div className="min-w-0 flex-1">
            <p className="text-[0.8rem] font-bold">あなたの進み具合</p>
            <dl className="mt-2 space-y-1 text-[0.8rem]">{[["使い方", used, USE.length], ["レッスン", read, LESSONS.length], ["確認テスト", passed, CHAPTERS.length]].map(([l, a, b]) => <div key={l as string} className="flex justify-between"><dt className="text-sub">{l}</dt><dd className="num font-bold">{a as number}<span className="font-normal text-sub">/{b as number}</span></dd></div>)}</dl>
          </div>
        </div>
      </section>

      {/* タブ */}
      <div className="sticky top-14 z-30 -mx-5 mt-10 bg-paper/90 px-5 pt-2 backdrop-blur-md sm:-mx-8 sm:px-8">
        <div className="flex gap-1 border-b hair" role="tablist" aria-label="このページの内容">
          {tabs.map((x) => <button key={x.k} type="button" role="tab" aria-selected={tab === x.k} onClick={() => setTab(x.k)} className={`relative -mb-px flex items-center gap-2 border-b-2 px-3.5 py-3 text-[0.9rem] font-bold transition ${tab === x.k ? "border-ai text-ink" : "border-transparent text-sub hover:text-ink"}`}>{x.t}{x.n && <span className={`num rounded-full px-1.5 py-px text-[0.68rem] ${tab === x.k ? "bg-ai/10 text-ai" : "bg-[#eef1f7] text-sub"}`}>{x.n}</span>}</button>)}
        </div>
      </div>

      {tab === "use" && (
        <section id="use" className="mt-8" aria-label="使い方">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div><h2 className="text-[1.25rem] font-bold">4つの画面を触ってみる</h2><p className="mt-1 text-[0.86rem] text-sub"><J>診断 → 直す → 売上 → 測る の順に。1つ1〜2分です。</J></p></div>
            {nextUse && <Link href={nextUse.href} onClick={() => markRead(`g${nextUse.n}`)} className="btn btn-line px-5 text-[0.85rem]">次は「{nextUse.title}」<ArrowRight size={16} /></Link>}
          </div>
          <ol className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">{USE.map((u) => <UseCard key={u.n} s={u} />)}</ol>
          <p className="mt-5 flex gap-2 text-[0.8rem] leading-[1.8] text-sub"><MonitorSmartphone size={16} className="mt-[0.2rem] shrink-0" /><span className="min-w-0">スマホでは、画面の下のボタン（ホーム・診断・直す・売上）で移れます。「測る」は、ホームと売上の画面の下から開けます。</span></p>
          <button type="button" onClick={() => { setTab("course"); scrollTo({ top: 0 }); }} className="mt-8 flex w-full items-center gap-4 rounded-[12px] bg-ink p-5 text-left text-white sm:p-6"><GraduationCap size={26} className="shrink-0 text-[#8db8ff]" /><span className="min-w-0 flex-1"><b className="block text-[1rem]">次は講座で「なぜ効くのか」を学ぶ</b><span className="text-[0.82rem] text-white/70">全5章・15レッスン・1つ約3分</span></span><ChevronRight size={20} className="shrink-0" /></button>
        </section>
      )}

      {tab === "course" && (
        <section id="course" className="mt-8" aria-label="講座">
          <h2 className="text-[1.25rem] font-bold">講座：AIに選ばれる商品ページ</h2>
          <p className="mt-1 text-[0.86rem] text-sub"><J>{`全${CHAPTERS.length}章・${LESSONS.length}レッスン・約${TOTAL_MIN}分。各章の最後に確認テスト。全部終えると修了証を受け取れます。`}</J></p>
          <ol className="mt-6 space-y-3">{CHAPTERS.map((c) => <Chapter key={c.id} c={c} openLesson={open} setOpenLesson={setOpen} defaultOpen={c.id === firstOpen} />)}</ol>
          <div id="cert"><Cert done={done} /></div>
        </section>
      )}

      {tab === "qa" && (
        <section id="qa" className="mt-8" aria-label="よくある質問">
          <h2 className="flex items-center gap-2 text-[1.25rem] font-bold"><CircleHelp size={21} className="text-ai" />よくある質問</h2>
          <div className="card mt-5 divide-y divide-[#e6eaf2] p-0">
            {QA.map((x) => (
              <details key={x.q} className="group">
                <summary className="flex cursor-pointer list-none items-center gap-3 px-5 py-4 text-[0.95rem] font-bold [&::-webkit-details-marker]:hidden"><span className="text-ai">Q</span><span className="min-w-0 flex-1">{x.q}</span><ChevronDown size={18} className="shrink-0 text-sub transition group-open:rotate-180" /></summary>
                <p className="px-5 pb-5 pl-11 text-[0.9rem] leading-[1.9] text-sub"><J>{x.a}</J></p>
              </details>
            ))}
          </div>
          <div className="mt-8"><Link href="/" className="btn btn-ai">さっそく試す（ホームへ）<ArrowRight size={18} /></Link></div>
        </section>
      )}
    </>
  );
}

export default function Page() { return <Shell><Ready><Manabu /></Ready></Shell>; }
