"use client";

import Link from "next/link";
import { useState } from "react";
import { Award, BookOpen, Check, ChevronDown, Clock, Download, Lightbulb, RotateCcw, X } from "lucide-react";
import Shell, { Title } from "@/components/Shell";
import Ready from "@/components/Ready";
import J from "@/components/J";
import { toast } from "@/components/Confirm";
import { CHAPTERS, LESSONS, TOTAL_MIN, type Chapter, type Lesson } from "@/lib/learn";
import { BRAND } from "@/lib/demo";
import { update, useStore } from "@/lib/store";

const markRead = (id: string) => update((x) => ({ ...x, learn: [...new Set([...(x.learn ?? []), id])] }));

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
  x.strokeStyle = "rgba(16,217,160,.55)"; x.lineWidth = 3; x.strokeRect(50, 50, W - 100, H - 100);
  x.strokeStyle = "rgba(16,217,160,.18)"; x.lineWidth = 1; x.strokeRect(70, 70, W - 140, H - 140);
  x.textAlign = "center"; x.fillStyle = "#10d9a0"; x.font = "700 30px sans-serif"; x.fillText("T S U R E T E   A C A D E M Y", W / 2, 190);
  x.fillStyle = "#ffffff"; x.font = "900 96px sans-serif"; x.fillText("修 了 証", W / 2, 330);
  x.font = "700 64px sans-serif"; x.fillText(`${name} 様`, W / 2, 500);
  x.fillStyle = "#cfe7e1"; x.font = "500 34px sans-serif";
  x.fillText("「AIに選ばれる商品ページ」講座（全5章・15レッスン）を", W / 2, 620);
  x.fillText("すべて読み終え、各章の確認テストに合格したことを証します。", W / 2, 676);
  const d = new Date(); x.fillStyle = "#8fb3ad"; x.font = "500 28px sans-serif"; x.fillText(`${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`, W / 2, 820);
  x.fillStyle = "#10d9a0"; x.beginPath(); x.arc(W / 2 - 120, 940, 9, 0, Math.PI * 2); x.fill();
  x.fillStyle = "#ffffff"; x.font = "700 38px sans-serif"; x.fillText("TSURETE", W / 2 + 10, 953);
  const a = document.createElement("a"); a.href = c.toDataURL("image/png"); a.download = "tsurete-修了証.png"; a.click();
}

function Cert({ done }: { done: boolean }) {
  const [name, setName] = useState(BRAND.name);
  return (
    <section className="mt-20 rounded-[24px] p-6 ring-1 ring-ai/40 sm:p-10" aria-labelledby="cert">
      <p className="eyebrow">CERTIFICATE</p>
      <h2 id="cert" className="mt-2 flex items-center gap-2 text-[1.3rem] font-bold"><Award size={22} className="text-ai" />修了証</h2>
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
  const read = (s.learn ?? []).filter((id) => LESSONS.some((l) => l.id === id)).length;
  const passed = (s.passed ?? []).length;
  const pct = Math.round(((read + passed) / (LESSONS.length + CHAPTERS.length)) * 100);
  const done = read === LESSONS.length && passed === CHAPTERS.length;
  return (
    <>
      <Title n="ACADEMY" title="学ぶ" lead="AIに選ばれる商品ページの作り方を、小さなお店向けに短くまとめた講座です。1レッスン約3分。読んだら、そのまま自分のお店の画面で試せます。登録なし・無料です。" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[{ v: CHAPTERS.length, u: "章", l: "知る → 確かめる" }, { v: LESSONS.length, u: "レッスン", l: "1つ約3分" }, { v: TOTAL_MIN, u: "分", l: "ぜんぶ読んでも" }, { v: CHAPTERS.length, u: "つ", l: "確認テストと修了証" }].map((x) => (
          <div key={x.u} className="card p-4"><p><b className="num text-[1.8rem] leading-none">{x.v}</b><span className="ml-1 text-[0.85rem] text-sub">{x.u}</span></p><p className="mt-1.5 text-[0.75rem] text-sub">{x.l}</p></div>
        ))}
      </div>
      <div className="mt-8"><p className="flex justify-between text-[0.8rem] text-sub"><span className="flex items-center gap-1.5"><BookOpen size={14} />進み具合：レッスン {read}/{LESSONS.length}・テスト {passed}/{CHAPTERS.length}</span><b className="num text-ai">{pct}%</b></p><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[.06]"><div className="h-full rounded-full bg-ai transition-all duration-700" style={{ width: `${pct}%` }} /></div></div>

      {CHAPTERS.map((c) => (
        <section key={c.id} className="mt-16" aria-labelledby={c.id}>
          <p className="eyebrow">CHAPTER {c.n}</p>
          <h2 id={c.id} className="mt-1 text-[1.3rem] font-bold">第{c.n}章　{c.t}</h2>
          <p className="mt-1 text-[0.88rem] text-sub"><J>{c.lead}</J></p>
          <ul className="mt-5 border-t hair">{c.lessons.map((l) => <LessonRow key={l.id} l={l} open={open === l.id} onToggle={() => setOpen(open === l.id ? null : l.id)} />)}</ul>
          <QuizBox c={c} />
        </section>
      ))}
      <Cert done={done} />
    </>
  );
}

export default function Page() { return <Shell><Ready><Manabu /></Ready></Shell>; }
