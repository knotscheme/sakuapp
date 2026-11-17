"use client";

import { Check, Copy, ExternalLink } from "lucide-react";
import Shell from "@/components/Shell";
import Ready from "@/components/Ready";
import Help from "@/components/Help";
import { toast } from "@/components/Confirm";
import { ACCOUNTS } from "@/lib/accounts";
import { compute, consumption, yen } from "@/lib/books";
import { DEADLINES, YEAR_JA } from "@/lib/rules2026";
import { update, useStore } from "@/lib/store";

const PREP = [
  { id: "p-card", t: "マイナンバーカードと、読み取れるスマホ", n: "パソコンで出す場合も、スマホで読み取れます（ID・パスワード方式でも出せます）" },
  { id: "p-pension", t: "国民年金の「控除証明書」", n: "11月ごろに、はがきで届きます" },
  { id: "p-life", t: "生命保険・地震保険の「控除証明書」", n: "10月ごろに、保険会社から届きます" },
  { id: "p-furusato", t: "ふるさと納税の「受領証明書」", n: "寄附した自治体から届きます（まとめた証明書でも可）" },
  { id: "p-medical", t: "医療費の領収書の合計", n: "マイナポータルの医療費通知も使えます" },
  { id: "p-bank", t: "税金を引き落とす口座（振替納税）", n: "はじめての人は、口座の届け出をします" },
];

function Copyable({ label, v }: { label: string; v: number }) {
  return (
    <li className="flex flex-wrap items-center justify-between gap-2 border-b border-line py-2.5">
      <span className="text-[1rem]">{label}</span>
      <span className="flex items-center gap-2"><b className="num text-[1.1rem]">{yen(v)}</b>
        <button type="button" onClick={async () => { try { await navigator.clipboard.writeText(String(Math.round(v))); toast(`${label}：${Math.round(v).toLocaleString()} をコピーしました`); } catch { toast("コピーできませんでした"); } }} className="btn btn-sub min-h-[2.5rem] px-3 text-[0.9rem]" aria-label={`${label}の金額をコピー`}><Copy size={16} />コピー</button>
      </span>
    </li>
  );
}

function Teishutsu() {
  const s = useStore();
  const c = compute(s, { project: true });
  const ct = consumption(s, { project: true });
  const toggle = (id: string) => update((x) => ({ ...x, done: x.done.includes(id) ? x.done.filter((y) => y !== id) : [...x.done, id] }));
  const ctaxAmt = s.profile.ctax === "twoWari" ? ct.twoWari : s.profile.ctax === "simple" ? ct.simple : ct.general;
  const step = "card mt-5 p-5 sm:p-6";

  return (
    <>
      <Help title="6. 申告書を出す" say="国税庁の、確定申告書等作成コーナーで、このアプリの数字を入れて、イータックスで送ります。入れる場所と数字を、順番に案内します。コピーのボタンで、数字をそのまま貼り付けられます。">
        国税庁の<b>「確定申告書等作成コーナー」</b>に、このアプリの数字を入れて、<b>e-Tax（インターネット）</b>で送ります。入れる場所と数字を、順番に案内します。<br />「コピー」を押すと、数字をそのまま貼り付けられます。
      </Help>
      <p className="mb-2 text-[1rem]">提出の期限：<b>{new Date(DEADLINES[3].date).toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" })}</b>（消費税は {new Date(DEADLINES[4].date).toLocaleDateString("ja-JP", { month: "long", day: "numeric" })}）</p>
      <p className="mb-4 text-[0.9rem] text-sub">※下の数字は「12月までの見込み」です。12月分まで取りこんでから、もう一度この画面を開いてください。</p>

      <section className={step} aria-labelledby="s0">
        <h2 id="s0" className="text-[1.3rem] font-bold">準備するもの</h2>
        <ul className="mt-3 space-y-2">
          {PREP.map((p) => {
            const on = s.done.includes(p.id);
            return (
              <li key={p.id}><button type="button" onClick={() => toggle(p.id)} aria-pressed={on} className={`flex w-full items-center gap-3 rounded-2xl border-2 p-4 text-left ${on ? "border-ok bg-ok-2" : "border-line bg-white"}`}>
                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg border-2 ${on ? "border-ok bg-ok text-white" : "border-ink"}`}>{on && <Check size={20} />}</span>
                <span><b className="block text-[1.05rem]">{p.t}</b><span className="text-[0.9rem] text-sub">{p.n}</span></span>
              </button></li>
            );
          })}
        </ul>
      </section>

      <section className={step} aria-labelledby="s1">
        <h2 id="s1" className="text-[1.3rem] font-bold">手順1　作成コーナーを開く</h2>
        <ol className="mt-2 list-decimal space-y-1 pl-6 text-[1.02rem]">
          <li>「作成開始」→「e-Tax（マイナンバーカード方式）」をえらぶ</li>
          <li>「{YEAR_JA}の申告書等の作成」→ <b>「決算書・収支内訳書」</b>をえらぶ</li>
          <li>「青色申告決算書（一般用）」をえらぶ</li>
        </ol>
        <a href="https://www.keisan.nta.go.jp/" target="_blank" rel="noopener noreferrer" className="btn btn-ink mt-4">確定申告書等作成コーナーを開く<ExternalLink size={18} /></a>
      </section>

      <section className={step} aria-labelledby="s2">
        <h2 id="s2" className="text-[1.3rem] font-bold">手順2　青色申告決算書に入れる数字</h2>
        <ul className="mt-2">
          <Copyable label="売上（収入）金額" v={c.sales + c.miscIncome} />
          {ACCOUNTS.filter((a) => c.byAcc[a.id]).map((a) => <Copyable key={a.id} label={a.name} v={c.byAcc[a.id]} />)}
          <Copyable label="青色申告特別控除額" v={c.blueDed} />
        </ul>
        <p className="mt-2 text-[0.9rem] text-sub">※減価償却は「減価償却費の計算」の欄にも、物の名前・買った日・値段を入れます。家事按分は「家事分」の欄で入れる方法もあります（このアプリでは、すでに仕事の分だけにしています）。</p>
      </section>

      <section className={step} aria-labelledby="s3">
        <h2 id="s3" className="text-[1.3rem] font-bold">手順3　所得税の申告書に入れる数字</h2>
        <p className="mt-1 text-[1rem] text-sub">決算書を作り終えると、「所得税」の申告書に進みます。事業所得は決算書から自動で入ります。</p>
        <ul className="mt-2">
          <Copyable label="事業所得（営業等）" v={c.income} />
          {c.ded.filter((d) => d.amount && d.id !== "basic").map((d) => <Copyable key={d.id} label={d.label} v={d.id === "social" ? c.social : d.id === "ideco" ? c.ideco : d.id === "life" ? c.lifePaid : d.id === "medical" ? c.medicalPaid : d.id === "furusato" ? c.furusato : d.amount} />)}
        </ul>
        <p className="mt-2 text-[0.9rem] text-sub">※生命保険・医療費・ふるさと納税は、作成コーナーでは「払った金額」を入れると、控除の額を計算してくれます（上の数字は払った金額です）。<br />※最後に表示される所得税が、このアプリの目安（{yen(c.incomeTax)}）と大きくちがうときは、入れた数字を見直してください。</p>
      </section>

      <section className={step} aria-labelledby="s4">
        <h2 id="s4" className="text-[1.3rem] font-bold">手順4　消費税の申告書</h2>
        <ul className="mt-2">
          <Copyable label="10%の売上（税込）" v={ct.salesIncl} />
          <Copyable label="納める消費税（国と地方の合計・目安）" v={ctaxAmt.total} />
        </ul>
        <p className="mt-2 text-[0.9rem] text-sub">※{s.profile.ctax === "twoWari" ? "途中で「2割特例を使う」をえらびます。" : s.profile.ctax === "simple" ? "簡易課税をえらび、業種（事業区分）を入れます。" : "本則課税をえらび、仕入れの消費税を入れます。"}</p>
      </section>

      <section className={step} aria-labelledby="s5">
        <h2 id="s5" className="text-[1.3rem] font-bold">手順5　送信して、税金を払う</h2>
        <ol className="mt-2 list-decimal space-y-1 pl-6 text-[1.02rem]">
          <li>マイナンバーカードをスマホで読み取り、<b>e-Taxで送信</b>します（青色申告の65万円控除の条件です）</li>
          <li>送った申告書は、PDFで保存しておきます</li>
          <li>振替納税なら、4月ごろに口座から引き落とされます</li>
        </ol>
        <p className="mt-3 rounded-2xl bg-paper p-4 text-[0.95rem]">このアプリの帳簿は、<b>7年間</b>保存が必要です。「設定」から、バックアップのファイルを書き出しておきましょう。</p>
      </section>
      <p className="mt-5 text-[0.85rem] leading-[1.9] text-sub">※製品版では、e-Taxに読みこめるファイル（xtx形式）の書き出しにも対応する予定です。</p>
    </>
  );
}

export default function Page() { return <Shell><Ready><Teishutsu /></Ready></Shell>; }
