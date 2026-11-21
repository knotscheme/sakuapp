"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Award, BookOpen, Check, ChevronDown, ChevronRight, CircleHelp, Clock, Download, GraduationCap, Hand, Lightbulb, MonitorSmartphone, MousePointerClick, RotateCcw, Store, X } from "lucide-react";
import Shell from "@/components/Shell";
import Ready from "@/components/Ready";
import J from "@/components/J";
import { toast } from "@/components/Confirm";
import { CHAPTERS, LESSONS, TOTAL_MIN, type Chapter, type Lesson } from "@/lib/learn";
import { BRAND } from "@/lib/demo";
import { update, useStore } from "@/lib/store";

const IMG = "/sakuapp/works/tsurete/img/guide";

// ---------- 使い方（デモの4つの画面） ----------
const USE = [
  { n: 1, href: "/kenko/", title: "診断", img: "1.webp",
    what: "全商品のページを、AIに選ばれるための8つの項目（向いている人、比較表、よくある質問、構造化データなど）で点検した画面です。AIは使わないので、AIの利用料はかかりません。",
    try: ["いちばん上の点数（ページの健康スコア）を見ます。", "商品の行を押すと、×がついた項目（足りないところ）が開きます。", "「直す」を押すと、その商品の処方箋に移ります。"],
    point: "まだ登録していない商品は、下の「URLで診断」「CSVでまとめて診断」から点検できます。" },
  { n: 2, href: "/naosu/", title: "直す", img: "2.webp",
    what: "診断で足りなかったところの、処方箋（書き直し案と貼るコード）の画面です。お店のサイトを選ぶと、届け方（コピー・CSV・自動で書きかえ）が変わります。",
    try: ["はじめに「お店のサイト」を選びます（例：Shopify、楽天市場）。", "「案を見る」で書き直し案を確かめます。", "「コピーする」（サイトによっては「反映する」）を押します。"],
    point: "反映されるのは、お店の人が「この案を使う」を押したものだけです。デモでは、実際のサイトは変わりません。" },
  { n: 3, href: "/kouka/", title: "売上", img: "3.webp",
    what: "お店のサイトに貼った計測タグで、AIから来たお客様と、その売上を数える画面です。推測ではなく、実際の来店と注文です。",
    try: ["「設定」の「計測タグ」で、サイトに合った貼り方を見て、「貼ったので確認する」を押します。", "戻ってきて、どのAIから何人来て、いくら売れたかを見ます。"],
    point: "Googleの無料の公式ツール「Search Console」の使い方も、この画面で案内しています。" },
  { n: 4, href: "/hakaru/", title: "測る（プロ）", img: "4.webp",
    what: "お客様が聞きそうな質問をAIにくり返し聞いて、すすめられた割合・1位の割合・自分のサイトが根拠になった割合・平均の順位を測る画面です。ほかのブランドとの比較や、数字が動いた理由も分かります。",
    try: ["期間（7日・28日・90日）を選んで、前の期間とくらべます。", "「気づきと、次の一手」で、負けている質問と直すことを見ます。", "「データに質問する」で「負けている質問は？」と聞いてみます。"],
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

function UseStep({ s }: { s: (typeof USE)[number] }) {
  const st = useStore();
  const id = `g${s.n}`, done = (st.learn ?? []).includes(id);
  const [open, setOpen] = useState(false);
  return (
    <li className="card overflow-hidden p-0">
      <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} className="flex w-full items-center gap-4 p-4 text-left sm:p-5">
        <span className={`num grid h-9 w-9 shrink-0 place-items-center rounded-full text-[0.85rem] font-bold ${done ? "bg-ai text-paper" : "bg-white/[.06] text-sub"}`}>{done ? <Check size={16} /> : s.n}</span>
        <span className="min-w-0 flex-1"><b className="block text-[1.05rem]">{s.title}</b><span className="line-clamp-1 text-[0.8rem] text-sub"><J>{s.what}</J></span></span>
        <ChevronDown size={18} className={`shrink-0 text-sub transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="grid grid-cols-1 border-t hair lg:grid-cols-[1fr_1.1fr]">
          <div className="bg-paper px-4 pt-5 lg:p-4">
            <picture>
              <source media="(min-width: 1024px)" srcSet={`${IMG}/${s.img}?v=5`} />
              <img src={`${IMG}/${s.img.replace(".webp", "-sp.webp")}?v=5`} alt={`「${s.title}」の画面`} width={390} height={600} loading="lazy" className="mx-auto block w-full max-w-[15rem] rounded-t-[1.6rem] border-[5px] border-b-0 border-deep bg-panel lg:max-w-none lg:rounded-xl lg:border lg:border-line" />
            </picture>
          </div>
          <div className="p-5 sm:p-6">
            <p className="text-[0.95rem] leading-[1.9]"><J>{s.what}</J></p>
            <p className="mt-4 flex items-center gap-1.5 text-[0.85rem] font-bold text-ai"><MousePointerClick size={15} />押してみよう</p>
            <ol className="mt-1 space-y-1.5">{s.try.map((t, i) => <li key={t} className="flex gap-2 text-[0.92rem] leading-[1.8]"><span className="num mt-[0.2rem] grid h-5 w-5 shrink-0 place-items-center rounded-full border border-ai text-[0.7rem] text-ai">{i + 1}</span><span className="min-w-0"><J>{t}</J></span></li>)}</ol>
            <p className="mt-4 flex gap-2 rounded-xl bg-warn/10 p-3 text-[0.85rem] leading-[1.8]"><Lightbulb size={17} className="mt-[0.15rem] shrink-0 text-warn" /><span className="min-w-0"><J>{s.point}</J></span></p>
            <Link href={s.href} onClick={() => markRead(id)} className="btn btn-ai mt-4 w-full sm:w-auto">この画面を開いて試す<ArrowRight size={18} /></Link>
          </div>
        </div>
      )}
    </li>
  );
}

function LessonRow({ l, open, onToggle }: { l: Lesson; open: boolean; onToggle: () => void }) {
  const s = useStore();
  const read = (s.learn ?? []).includes(l.id);
  return (
    <li className="border-b hair">
      <button type="button" onClick={onToggle} aria-expanded={open} className="flex w-full items-center gap-4 py-4 text-left">
        <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-[0.7rem] font-bold ${read ? "bg-ai text-paper" : "bg-white/[.06] text-sub"}`}>{read ? <Check size={15} /> : l.id}</span>
        <span className="min-w-0 flex-1"><b className="block text-[0.95rem] leading-[1.6]"><J>{l.t}</J></b><span className="flex items-center gap-1 text-[0.75rem] text-sub"><Clock size={12} />約{l.min}分で読める</span></span>
        <ChevronDown size={18} className={`shrink-0 text-sub transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="pb-8 pl-11">
          {l.body.map((p, i) => <p key={i} className="mt-3 text-[0.95rem] leading-[2]"><J>{p}</J></p>)}
          <p className="mt-6 flex gap-3 rounded-2xl bg-ai/10 px-4 py-3.5 text-[0.9rem] leading-[1.8]"><Lightbulb size={18} className="mt-1 shrink-0 text-ai" /><b><J>{l.point}</J></b></p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {!read && <button type="button" onClick={() => { markRead(l.id); toast("読みました"); }} className="btn btn-ai px-6"><Check size={17} />読んだ</button>}
            {l.try && <Link href={l.try.href} onClick={() => markRead(l.id)} className="btn px-6 ring-1 ring-white/15">{l.try.label}（{BRAND.name}で試す）</Link>}
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
  if (passed && !checked) return <p className="mt-6 flex items-center gap-2 text-[0.9rem] font-bold text-ai"><Award size={18} />第{c.n}章の確認テストに合格しています</p>;
  return (
    <div className="card mt-6 p-5 sm:p-6">
      <p className="text-[0.95rem] font-bold">第{c.n}章 確認テスト（{c.quiz.length}問）</p>
      {c.quiz.map((q, i) => (
        <fieldset key={q.q} className="mt-5">
          <legend className="text-[0.92rem] leading-[1.7]"><J>{`Q${i + 1}. ${q.q}`}</J></legend>
          <div className="mt-2 grid gap-2">
            {q.a.map((a, k) => {
              const sel = ans[i] === k, right = checked && k === q.ok, wrong = checked && sel && k !== q.ok;
              return (
                <button key={a} type="button" disabled={checked} onClick={() => setAns((x) => x.map((v, j) => (j === i ? k : v)))}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left text-[0.9rem] ring-1 transition ${right ? "bg-ai/15 ring-ai" : wrong ? "bg-warn/10 ring-warn" : sel ? "bg-white/[.06] ring-white/40" : "ring-white/10 hover:bg-white/[.03]"}`}>
                  <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full ring-1 ${sel ? "bg-ai ring-ai" : "ring-white/30"}`}>{right ? <Check size={12} className="text-paper" /> : wrong ? <X size={12} /> : null}</span><span className="min-w-0"><J>{a}</J></span>
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
          : <button type="button" onClick={() => { setChecked(false); setAns(c.quiz.map(() => null)); }} className="btn px-6 ring-1 ring-white/15"><RotateCcw size={16} />もう一度（{score}/{c.quiz.length}問正解）</button>}
      </div>
    </div>
  );
}

// 修了証（画像を書き出す）
function drawCert(name: string) {
  const W = 1600, H = 1100, c = document.createElement("canvas"); c.width = W; c.height = H;
  const x = c.getContext("2d")!;
  const g = x.createLinearGradient(0, 0, W, H); g.addColorStop(0, "#03161b"); g.addColorStop(1, "#0b2a2a"); x.fillStyle = g; x.fillRect(0, 0, W, H);
  x.strokeStyle = "rgba(77,141,255,.55)"; x.lineWidth = 3; x.strokeRect(50, 50, W - 100, H - 100);
  x.strokeStyle = "rgba(77,141,255,.18)"; x.lineWidth = 1; x.strokeRect(70, 70, W - 140, H - 140);
  x.textAlign = "center"; x.fillStyle = "#1f5ad1"; x.font = "700 30px sans-serif"; x.fillText("T S U R E T E   A C A D E M Y", W / 2, 190);
  x.fillStyle = "#ffffff"; x.font = "900 96px sans-serif"; x.fillText("修 了 証", W / 2, 330);
  x.font = "700 64px sans-serif"; x.fillText(`${name} 様`, W / 2, 500);
  x.fillStyle = "#cfe7e1"; x.font = "500 34px sans-serif";
  x.fillText("「AIに選ばれる商品ページ」講座（全5章・15レッスン）を", W / 2, 620);
  x.fillText("すべて読み終え、各章の確認テストに合格したことを証します。", W / 2, 676);
  const d = new Date(); x.fillStyle = "#8fb3ad"; x.font = "500 28px sans-serif"; x.fillText(`${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`, W / 2, 820);
  x.fillStyle = "#1f5ad1"; x.beginPath(); x.arc(W / 2 - 120, 940, 9, 0, Math.PI * 2); x.fill();
  x.fillStyle = "#ffffff"; x.font = "700 38px sans-serif"; x.fillText("TSURETE", W / 2 + 10, 953);
  const a = document.createElement("a"); a.href = c.toDataURL("image/png"); a.download = "tsurete-修了証.png"; a.click();
}

function Cert({ done }: { done: boolean }) {
  const [name, setName] = useState(BRAND.name);
  return (
    <section className="mt-20 rounded-[24px] p-6 ring-1 ring-ai/40 sm:p-10" aria-labelledby="cert-h">
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
    </section>
  );
}

function Manabu() {
  const s = useStore();
  const [open, setOpen] = useState<string | null>(null);
  const learned = s.learn ?? [];
  const used = USE.filter((u) => learned.includes(`g${u.n}`)).length;
  const read = learned.filter((id) => LESSONS.some((l) => l.id === id)).length;
  const passed = (s.passed ?? []).length;
  const all = USE.length + LESSONS.length + CHAPTERS.length;
  const pct = Math.round(((used + read + passed) / all) * 100);
  const done = read === LESSONS.length && passed === CHAPTERS.length;
  const jump = [{ h: "#use", t: "使い方" }, { h: "#course", t: "講座" }, { h: "#cert", t: "修了証" }, { h: "#qa", t: "よくある質問" }];
  return (
    <>
      <p className="eyebrow">はじめての方へ</p>
      <h1 className="mt-2 text-[1.6rem] font-bold leading-[1.5] tracking-[.04em] sm:text-[2rem]">学ぶ・使い方</h1>
      <p className="mt-3 max-w-[38em] text-[0.95rem] leading-[2] text-sub"><J>まずは画面を触って使い方をつかみ、そのあと講座で「なぜ効くのか」を学ぶ、の順がおすすめです。登録なし・無料です。</J></p>

      <section className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-3" aria-label="このデモについて">
        {[
          { icon: Store, t: "お店の人が使うツール", b: "宣伝のページ（LP）ではなく、ネットショップの人が使う管理画面の見本です。" },
          { icon: Hand, t: "押して試せます", b: "架空のスキンケアブランド「SORAE」の佐藤さんになったつもりで、押してみてください。" },
          { icon: RotateCcw, t: "何度でもやり直せます", b: "押した内容はこの端末の中だけ。「設定」から最初の状態に戻せます。" },
        ].map(({ icon: Icon, t, b }) => (
          <div key={t} className="card flex gap-3 p-5">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-ai/10 text-ai"><Icon size={20} /></span>
            <span className="min-w-0"><b className="block text-[1rem] leading-[1.6]">{t}</b><span className="text-[0.86rem] leading-[1.8] text-sub"><J>{b}</J></span></span>
          </div>
        ))}
      </section>

      <div className="sticky top-14 z-30 -mx-5 mt-8 border-b hair bg-paper/90 px-5 py-3 backdrop-blur-md sm:-mx-8 sm:px-8">
        <p className="flex justify-between text-[0.78rem] text-sub"><span className="flex items-center gap-1.5"><BookOpen size={14} />使い方 {used}/{USE.length}・レッスン {read}/{LESSONS.length}・テスト {passed}/{CHAPTERS.length}</span><b className="num text-ai">{pct}%</b></p>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[.06]"><div className="h-full rounded-full bg-ai transition-all duration-700" style={{ width: `${pct}%` }} /></div>
        <nav className="mt-2.5 flex gap-4 overflow-x-auto text-[0.82rem]" aria-label="このページの目次">{jump.map((x) => <a key={x.h} href={x.h} className="shrink-0 text-sub hover:text-ink">{x.t}</a>)}</nav>
      </div>

      <section id="use" className="mt-12 scroll-mt-40" aria-labelledby="use-h">
        <p className="eyebrow">PART 1</p>
        <h2 id="use-h" className="mt-1 flex items-center gap-2 text-[1.3rem] font-bold"><MousePointerClick size={20} className="text-ai" />使い方：4つの画面を触ってみる</h2>
        <p className="mt-1 text-[0.88rem] text-sub"><J>診断 → 直す → 売上 → 測る の順に。1つ1〜2分です。</J></p>
        <ol className="mt-6 space-y-3">{USE.map((u) => <UseStep key={u.n} s={u} />)}</ol>
        <p className="mt-4 flex gap-2 text-[0.8rem] leading-[1.8] text-sub"><MonitorSmartphone size={16} className="mt-[0.2rem] shrink-0" /><span className="min-w-0">スマホでは、画面の下のボタン（ホーム・診断・直す・売上）で移れます。「測る」は、ホームと売上の画面の下から開けます。</span></p>
      </section>

      <section id="course" className="mt-24 scroll-mt-40" aria-labelledby="course-h">
        <p className="eyebrow">PART 2</p>
        <h2 id="course-h" className="mt-1 flex items-center gap-2 text-[1.3rem] font-bold"><GraduationCap size={21} className="text-ai" />講座：AIに選ばれる商品ページ</h2>
        <p className="mt-1 text-[0.88rem] text-sub"><J>1レッスン約3分。読んだら、そのまま自分のお店の画面で試せます。</J></p>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[{ v: CHAPTERS.length, u: "章", l: "知る → 確かめる" }, { v: LESSONS.length, u: "レッスン", l: "1つ約3分" }, { v: TOTAL_MIN, u: "分", l: "ぜんぶ読んでも" }, { v: CHAPTERS.length, u: "つ", l: "確認テストと修了証" }].map((x) => (
            <div key={x.u} className="card p-4"><p><b className="num text-[1.6rem] leading-none">{x.v}</b><span className="ml-1 text-[0.82rem] text-sub">{x.u}</span></p><p className="mt-1.5 text-[0.75rem] text-sub">{x.l}</p></div>
          ))}
        </div>
        {CHAPTERS.map((c) => (
          <section key={c.id} className="mt-14" aria-labelledby={c.id}>
            <p className="text-[0.75rem] font-bold tracking-[.18em] text-sub">CHAPTER {c.n}</p>
            <h3 id={c.id} className="mt-1 text-[1.15rem] font-bold">第{c.n}章　{c.t}</h3>
            <p className="mt-1 text-[0.86rem] text-sub"><J>{c.lead}</J></p>
            <ul className="mt-4 border-t hair">{c.lessons.map((l) => <LessonRow key={l.id} l={l} open={open === l.id} onToggle={() => setOpen(open === l.id ? null : l.id)} />)}</ul>
            <QuizBox c={c} />
          </section>
        ))}
      </section>

      <div id="cert" className="scroll-mt-40"><Cert done={done} /></div>

      <section id="qa" className="mt-20 scroll-mt-40" aria-labelledby="qa-h">
        <h2 id="qa-h" className="flex items-center gap-2 text-[1.25rem] font-bold"><CircleHelp size={22} className="text-ai" />よくある質問</h2>
        <div className="mt-4 space-y-2">
          {QA.map((x) => (
            <details key={x.q} className="card group p-0">
              <summary className="flex cursor-pointer list-none items-center gap-3 p-4 text-[0.96rem] font-bold [&::-webkit-details-marker]:hidden"><span className="min-w-0 flex-1">{x.q}</span><ChevronRight size={18} className="shrink-0 text-sub transition group-open:rotate-90" /></summary>
              <p className="px-4 pb-4 text-[0.9rem] leading-[1.9] text-sub"><J>{x.a}</J></p>
            </details>
          ))}
        </div>
      </section>
      <div className="mt-10"><Link href="/" className="btn btn-ai">さっそく試す（ホームへ）<ArrowRight size={18} /></Link></div>
    </>
  );
}

export default function Page() { return <Shell><Ready><Manabu /></Ready></Shell>; }
