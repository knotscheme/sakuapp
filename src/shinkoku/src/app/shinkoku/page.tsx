"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, BookOpen, CheckCircle2, Info } from "lucide-react";
import Shell from "@/components/Shell";
import Ready from "@/components/Ready";
import Help from "@/components/Help";
import Speak from "@/components/Speak";
import { compute, consumption, yen } from "@/lib/books";
import { RECONSTRUCTION, YEAR_JA } from "@/lib/rules2026";
import { update, useStore, type Answers } from "@/lib/store";

function Money({ k, label, hint, s }: { k: keyof Answers; label: string; hint: string; s: Answers }) {
  return (
    <label className="block rounded-2xl border-2 border-line bg-white p-4">
      <b className="block text-[1.05rem]">{label}</b><span className="block text-[0.9rem] text-sub">{hint}</span>
      <span className="mt-2 flex items-center gap-2"><input inputMode="numeric" value={(s[k] as number) || ""} placeholder="0" onChange={(e) => update((x) => ({ ...x, answers: { ...x.answers, [k]: Number(e.target.value.replace(/\D/g, "")) || 0 } }))} className="field num max-w-[14rem]" />円</span>
    </label>
  );
}

function Shinkoku() {
  const s = useStore();
  const [proj, setProj] = useState(true);
  const c = compute(s, { project: proj });
  const ct = consumption(s, { project: proj });
  const a = s.answers;
  const row = "flex justify-between gap-3 border-b border-line py-2.5 text-[1.05rem]";
  const choice = s.profile.ctax;
  const opts = [
    { id: "twoWari", l: "2割特例", n: "売上の消費税の2割だけを払う。届け出はいらない（個人は令和8年分が最後）", v: ct.twoWari.total },
    { id: "simple", l: "簡易課税", n: `業種で決まった割合（第${s.profile.simpleType}種）で計算。前の年までに届け出が必要`, v: ct.simple.total },
    { id: "general", l: "本則課税", n: "実際に払った消費税を差し引く。インボイスの保存が必要", v: ct.general.total },
  ];
  const best = [...opts].sort((x, y) => x.v - y.v)[0];

  return (
    <>
      <Help title="5. 税金を計算する" say="帳簿から、所得税、消費税、住民税、事業税の目安を計算します。年金や保険など、税金が安くなるものを確認してください。計算は決まった式で行い、AIは使っていません。">
        帳簿から、<b>所得税・消費税・住民税・事業税</b>の目安を計算します。<br />年金や保険など「税金が安くなるもの（控除）」を確かめてください。計算は決まった式で行い、AIは使っていません。
      </Help>
      <div className="flex rounded-2xl border-2 border-ink bg-white p-1" role="group" aria-label="計算のしかた">
        <button type="button" onClick={() => setProj(false)} aria-pressed={!proj} className={`flex-1 rounded-xl px-4 py-2 text-[0.95rem] font-bold ${!proj ? "bg-ink text-white" : ""}`}>今の時点（{c.months}月まで）</button>
        <button type="button" onClick={() => setProj(true)} aria-pressed={proj} className={`flex-1 rounded-xl px-4 py-2 text-[0.95rem] font-bold ${proj ? "bg-ink text-white" : ""}`}>12月までの見込み</button>
      </div>

      <section className="card mt-5 p-5 sm:p-6" aria-labelledby="ded">
        <h2 id="ded" className="text-[1.3rem] font-bold">① 税金が安くなるもの（控除）</h2>
        <p className="mt-1 text-[1rem] text-sub">帳簿の「仕事以外のお金」から、自動で集めました。</p>
        <ul className="mt-3 space-y-2">
          {[
            ["国民年金・国民健康保険", c.social, "全額が控除になります"],
            ["iDeCo（個人型確定拠出年金）", c.ideco, "全額が控除になります"],
            ["生命保険料", c.lifePaid, "払った額に応じて、最大4万円（この区分）"],
            ["医療費（保険で戻った分を引いたあと）", c.medicalPaid, "10万円（または所得の5%）をこえた分が控除"],
            ["ふるさと納税", c.furusato, "2,000円をこえた分が控除（住民税からも引かれます）"],
          ].map(([l, v, n]) => <li key={l as string} className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-paper px-4 py-3"><span><b className="text-[1.05rem]">{l}</b><span className="block text-[0.85rem] text-sub">{n}</span></span><b className="num text-[1.1rem]">{yen(v as number)}</b></li>)}
        </ul>
        <h3 className="mt-5 text-[1.1rem] font-bold">帳簿に無いものを足す</h3>
        <div className="mt-2 grid gap-3 md:grid-cols-2">
          <Money s={a} k="earthquake" label="地震保険料" hint="火災保険のうち「地震」の分（最大5万円）" />
          <Money s={a} k="lifePaid" label="生命保険料（帳簿の外で払った分）" hint="家族の口座から払ったものなど" />
          <Money s={a} k="medicalPaid" label="医療費（帳簿の外の分）" hint="家族の分も合わせられます" />
          <Money s={a} k="medicalRefund" label="医療費で、保険から戻ったお金" hint="入院給付金・高額療養費など" />
          <Money s={a} k="extraSocial" label="家族の国民年金などを払った分" hint="自分が払った家族の分も控除になります" />
        </div>
        <p className="mt-4 flex gap-2 rounded-2xl border-2 border-warn bg-warn-2 p-4 text-[0.98rem]"><Info size={22} className="mt-0.5 shrink-0 text-warn" /><span>配偶者や、養っている家族（扶養）がいる人は、そのほかにも控除があります。くわしい条件は、申告書を作るときに国税庁の「確定申告書等作成コーナー」で入力してください（デモ版では計算に入れていません）。</span></p>
      </section>

      <section className="card mt-5 p-5 sm:p-6" aria-labelledby="it">
        <div className="flex flex-wrap items-start justify-between gap-2"><h2 id="it" className="text-[1.3rem] font-bold">② 所得税（{YEAR_JA}）</h2><Speak text={`所得は${yen(c.income)}。控除の合計は${yen(c.dedTotal)}。所得税は、復興特別所得税をふくめて、${yen(c.incomeTax)}です。`} /></div>
        <ul className="mt-3">
          <li className={row}><span>所得（もうけ − 青色申告特別控除）</span><b className="num">{yen(c.income)}</b></li>
          {c.ded.filter((d) => d.amount).map((d) => <li key={d.id} className={`${row} pl-4 text-[0.98rem] text-sub`}><span>− {d.label}</span><span className="num">{yen(d.amount)}</span></li>)}
          <li className={row}><span>税金がかかる所得（1,000円未満は切り捨て）</span><b className="num">{yen(c.it.taxableRounded)}</b></li>
          <li className={row}><span>× 税率 {Math.round(c.it.rate * 100)}%（速算表）</span><b className="num">{yen(c.it.base)}</b></li>
          <li className={row}><span>＋ 復興特別所得税（{(RECONSTRUCTION * 100).toFixed(1)}%）</span><b className="num">{yen(c.recon)}</b></li>
          <li className="flex justify-between gap-3 py-3 text-[1.3rem]"><b>納める所得税（100円未満は切り捨て）</b><b className="num text-ok">{yen(c.incomeTax)}</b></li>
        </ul>
      </section>

      <section className="card mt-5 p-5 sm:p-6" aria-labelledby="ct">
        <h2 id="ct" className="text-[1.3rem] font-bold">③ 消費税（インボイス登録をしている人）</h2>
        <p className="mt-1 text-[1rem] text-sub">10%の売上 {yen(ct.salesIncl)}（税込）から計算しました。3つの計算方法をくらべています。</p>
        <div className="mt-3 space-y-2">
          {opts.map((o) => (
            <button key={o.id} type="button" aria-pressed={choice === o.id} onClick={() => update((x) => ({ ...x, profile: { ...x.profile, ctax: o.id as typeof choice } }))}
              className={`flex w-full flex-wrap items-center justify-between gap-2 rounded-2xl border-2 p-4 text-left ${choice === o.id ? "border-ok bg-ok-2 ring-2 ring-ok" : "border-line bg-white"}`}>
              <span className="min-w-0 flex-1"><b className="text-[1.1rem]">{o.l}{best.id === o.id && <span className="ml-2 rounded-full bg-ok px-2 py-0.5 text-[0.8rem] text-white">いちばん少ない</span>}</b><span className="block text-[0.9rem] text-sub">{o.n}</span></span>
              <b className="num text-[1.25rem]">{yen(o.v)}</b>
            </button>
          ))}
        </div>
        <p className="mt-3 text-[0.9rem] leading-[1.9] text-sub">※国の消費税と地方消費税の合計です。<br />※2割特例は、個人は{YEAR_JA}が最後です。令和9年分・10年分は「3割特例」（売上の消費税の3割を払う）が使えます。簡易課税にするには、前もって届け出が必要です。</p>
      </section>

      <section className="card mt-5 p-5 sm:p-6" aria-labelledby="lt">
        <h2 id="lt" className="text-[1.3rem] font-bold">④ 来年はらう、住民税・事業税（おおよそ）</h2>
        <ul className="mt-3">
          <li className={row}><span>住民税（6月から4回、または給料から）</span><b className="num">{yen(c.resident)}</b></li>
          <li className={row}><span>個人事業税（8月と11月）</span><b className="num">{yen(c.bizTax)}</b></li>
        </ul>
        <p className="mt-2 text-[0.9rem] text-sub">※確定申告をすると、市役所・県税事務所に自動で伝わります。別の手続きはいりません。ふるさと納税の住民税からの差し引きは、この目安に入れていません。</p>
      </section>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/teishutsu/" className="btn btn-main">次は「6. 申告書を出す」へ<ArrowRight size={20} /></Link>
        <Link href="/soudan/" className="btn btn-sub"><BookOpen size={20} />わからないことを聞く</Link>
      </div>
      <p className="mt-4 flex items-center gap-2 text-[0.9rem] text-sub"><CheckCircle2 size={18} />税率・控除の金額は、{YEAR_JA}のルールで計算しています（デモ版・目安）。</p>
    </>
  );
}

export default function Page() { return <Shell><Ready><Shinkoku /></Ready></Shell>; }
