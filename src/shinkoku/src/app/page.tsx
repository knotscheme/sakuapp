"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AlertTriangle, ArrowRight, CalendarClock, CheckCircle2, ChevronRight, Sparkles, X } from "lucide-react";
import Shell, { NAV } from "@/components/Shell";
import Ready from "@/components/Ready";
import Speak from "@/components/Speak";
import { compute, consumption, man, yen } from "@/lib/books";
import { DEADLINES, YEAR_JA } from "@/lib/rules2026";
import { useStore } from "@/lib/store";

const TODAY = "2026-11-17"; // デモの「今日」
const days = (d: string) => Math.round((new Date(d).getTime() - new Date(TODAY).getTime()) / 86400000);

function Home() {
  const s = useStore();
  const [proj, setProj] = useState(true);
  const [first, setFirst] = useState(false);
  useEffect(() => { try { setFirst(!localStorage.getItem("jbs-guide-seen")); } catch {} }, []);
  const closeFirst = () => { setFirst(false); try { localStorage.setItem("jbs-guide-seen", "1"); } catch {} };
  const c = compute(s, { project: proj });
  const ct = consumption(s, { project: proj });
  const ctax = s.profile.ctax === "exempt" ? 0 : s.profile.ctax === "twoWari" ? ct.twoWari.total : s.profile.ctax === "simple" ? ct.simple.total : ct.general.total;
  const pending = s.entries.filter((e) => e.status === "check" && !e.voided).length;
  const next = DEADLINES.filter((d) => days(d.date) >= 0)[0];
  const total = c.incomeTax + c.resident + c.bizTax + ctax;
  const say = `${s.profile.name}さん、こんにちは。${pending ? `確認してほしい明細が${pending}件あります。` : "確認待ちの明細はありません。"}今年のもうけは、${proj ? "12月までの見込みで" : "今の時点で"}およそ${man(c.beforeBlue)}。税金はあわせて、およそ${man(total)}です。`;

  return (
    <>
      <div className="grid items-center gap-5 overflow-hidden rounded-3xl border-2 border-line bg-white md:grid-cols-[1fr_1.15fr]">
        <div className="order-2 p-6 md:order-1 md:p-8">
          <p className="text-[1rem] text-sub">{YEAR_JA}（2026年）の申告</p>
          <h1 className="mt-1 text-[1.75rem] font-bold leading-[1.45]">{s.profile.name}さん、こんにちは</h1>
          <p className="mt-2 text-[1.02rem] leading-[1.9] text-sub">明細を入れて、えらんでいくだけ。申告まで、ひとつずつご案内します。</p>
          <div className="mt-4"><Speak text={say} label="この画面を読み上げる" /></div>
        </div>
        <img src="/sakuapp/works/shinkoku/img/home.webp" alt="自宅のテーブルで、笑顔でパソコンに向かって申告の作業をする女性" width={1376} height={768} className="order-1 aspect-[16/9] h-full w-full object-cover md:order-2 md:aspect-auto md:min-h-[260px]" />
      </div>

      {first && (
        <div className="mt-5 flex flex-wrap items-center gap-4 rounded-2xl border-2 border-ok bg-ok-2 p-5">
          <Sparkles size={34} className="shrink-0 text-ok" />
          <p className="min-w-0 flex-1 text-[1.05rem]"><b className="block text-[1.2rem]">はじめての方は、かんたんガイドをどうぞ</b>6つの手順を、画面の写真といっしょに説明しています（読み上げもできます）。</p>
          <div className="flex gap-2">
            <Link href="/guide/" onClick={closeFirst} className="btn btn-main">ガイドを見る<ArrowRight size={20} /></Link>
            <button type="button" onClick={closeFirst} className="btn btn-sub px-3" aria-label="この案内を閉じる"><X size={20} /></button>
          </div>
        </div>
      )}

      {/* 今日やること */}
      <section className="mt-6" aria-labelledby="todo">
        <h2 id="todo" className="text-[1.2rem] font-bold">今日やること</h2>
        <div className="mt-3 space-y-3">
          {pending > 0 ? (
            <Link href="/kakunin/" className="flex items-center gap-4 rounded-2xl border-2 border-warn bg-warn-2 p-5 transition hover:brightness-[.98]">
              <AlertTriangle size={34} className="shrink-0 text-warn" />
              <span className="flex-1"><b className="block text-[1.2rem]">確認してほしい明細が {pending}件 あります</b><span className="text-[0.95rem] text-sub">「何に使ったお金か」をえらぶだけです</span></span>
              <span className="btn btn-main hidden sm:inline-flex">確認する<ArrowRight size={20} /></span><ChevronRight size={28} className="sm:hidden" />
            </Link>
          ) : (
            <Link href="/torikomi/" className="flex items-center gap-4 rounded-2xl border-2 border-line bg-white p-5 hover:bg-[#fbfaf6]">
              <CheckCircle2 size={34} className="shrink-0 text-ok" />
              <span className="flex-1"><b className="block text-[1.2rem]">確認待ちはありません</b><span className="text-[0.95rem] text-sub">新しい明細があれば、取りこみましょう（月に1回がおすすめ）</span></span>
              <ChevronRight size={28} />
            </Link>
          )}
          {next && (
            <div className="flex items-center gap-4 rounded-2xl border-2 border-line bg-white p-5">
              <CalendarClock size={34} className="shrink-0 text-ink" />
              <span className="flex-1"><b className="block text-[1.1rem]">次の期限：{next.label}</b><span className="text-[0.95rem] text-sub">{new Date(next.date).toLocaleDateString("ja-JP", { month: "long", day: "numeric", weekday: "short" })}（あと{days(next.date)}日）・{next.note}</span></span>
            </div>
          )}
        </div>
      </section>

      {/* 今年の数字 */}
      <section className="mt-8" aria-labelledby="nums">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="nums" className="text-[1.2rem] font-bold">今年の数字（目安）</h2>
          <div className="flex rounded-2xl border-2 border-ink bg-white p-1" role="group" aria-label="計算のしかた">
            <button type="button" onClick={() => setProj(false)} aria-pressed={!proj} className={`rounded-xl px-4 py-2 text-[0.95rem] font-bold ${!proj ? "bg-ink text-white" : ""}`}>今の時点（{c.months}月まで）</button>
            <button type="button" onClick={() => setProj(true)} aria-pressed={proj} className={`rounded-xl px-4 py-2 text-[0.95rem] font-bold ${proj ? "bg-ink text-white" : ""}`}>12月までの見込み</button>
          </div>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {[
            { l: "売上", v: c.sales + c.miscIncome, n: "入ってきたお金" },
            { l: "経費", v: c.expenses, n: "仕事に使ったお金" },
            { l: "もうけ", v: c.beforeBlue, n: "売上 − 経費" },
          ].map((x) => <div key={x.l} className="card p-5"><p className="text-[1rem] text-sub">{x.l}<span className="ml-2 text-[0.85rem]">（{x.n}）</span></p><p className="num mt-1 text-[1.8rem] font-bold">{man(x.v)}</p></div>)}
        </div>
        <div className="card mt-3 p-5">
          <p className="text-[1rem] text-sub">払う税金の目安（あわせて）</p>
          <p className="num mt-1 text-[2.2rem] font-bold text-ok">{man(total)}</p>
          <ul className="mt-3 grid gap-x-6 gap-y-1 text-[1rem] sm:grid-cols-2">
            <li className="flex justify-between border-b border-line py-1.5"><span>所得税</span><b className="num">{yen(c.incomeTax)}</b></li>
            <li className="flex justify-between border-b border-line py-1.5"><span>住民税（6月〜）</span><b className="num">{yen(c.resident)}</b></li>
            <li className="flex justify-between border-b border-line py-1.5"><span>消費税</span><b className="num">{yen(ctax)}</b></li>
            <li className="flex justify-between border-b border-line py-1.5"><span>個人事業税（8月〜）</span><b className="num">{yen(c.bizTax)}</b></li>
          </ul>
          <p className="mt-3 text-[0.85rem] leading-[1.8] text-sub">※「12月までの見込み」は、今のペースが続いた場合の計算です。住民税・事業税はおおよその額です。</p>
        </div>
      </section>

      {/* 申告までの道のり */}
      <section className="mt-8" aria-labelledby="road">
        <h2 id="road" className="text-[1.2rem] font-bold">申告までの道のり</h2>
        <ol className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {NAV.filter((n) => n.step).map((n) => {
            const st = n.step === 1 ? "ok" : n.step === 2 ? (pending ? "now" : "ok") : n.step <= 4 ? (pending ? "" : "ok") : "";
            return (
              <li key={n.href}>
                <Link href={n.href} className={`flex h-full items-center gap-3 rounded-2xl border-2 p-4 transition hover:bg-white ${st === "now" ? "border-warn bg-warn-2" : "border-line bg-[#fbfaf6]"}`}>
                  <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full text-[1.1rem] font-bold ${st === "ok" ? "bg-ok text-white" : "bg-ink text-white"}`}>{st === "ok" ? "✓" : n.step}</span>
                  <span className="flex-1 text-[1.05rem] font-bold">{n.label}</span><ChevronRight size={22} />
                </Link>
              </li>
            );
          })}
        </ol>
      </section>
    </>
  );
}

export default function Page() { return <Shell><Ready><Home /></Ready></Shell>; }
