"use client";

import Link from "next/link";
import { useState } from "react";
import { Loader2, Phone, Send, Sparkles } from "lucide-react";
import Shell from "@/components/Shell";
import Ready from "@/components/Ready";
import Help from "@/components/Help";
import Speak from "@/components/Speak";
import { aiReady, ask, useAi } from "@/lib/ai";
import { compute } from "@/lib/books";
import { useStore } from "@/lib/store";

// よくある質問（AIを使わなくても読める）。答えは一般的な説明で、根拠は国税庁のタックスアンサー
const FAQ = [
  { q: "経費にできるのは、どんなお金ですか？", a: "仕事のために使ったお金です。仕事でも家でも使うもの（スマホ・電気・家賃など）は、仕事で使った割合の分だけを経費にします。プライベートの食事や服は経費になりません。", src: "タックスアンサー No.2210 やさしい必要経費の知識" },
  { q: "青色申告の65万円の控除をうけるには？", a: "複式簿記で帳簿をつけて、貸借対照表と損益計算書を出し、e-Tax（インターネット）で申告することなどが条件です。紙で出すと55万円になります。", src: "タックスアンサー No.2072 青色申告特別控除" },
  { q: "10万円以上のパソコンを買ったら？", a: "長く使う物は、何年かに分けて経費にします（減価償却）。青色申告をしている人は、30万円未満の物なら、買った年に全額を経費にできる特例があります（1年で合計300万円まで）。", src: "タックスアンサー No.2100 減価償却のあらまし" },
  { q: "家族の国民年金を払ったら、控除になりますか？", a: "自分と同じ家計の家族の分を自分が払ったときは、社会保険料控除に入れられます。", src: "タックスアンサー No.1130 社会保険料控除" },
  { q: "医療費控除は、いくらから使えますか？", a: "1年に払った医療費から、保険で戻ったお金を引いて、10万円（所得が200万円未満なら所得の5%）をこえた分が控除になります。家族の分も合わせられます。", src: "タックスアンサー No.1120 医療費を支払ったとき" },
  { q: "ふるさと納税をしたら、申告はいりますか？", a: "仕事をしていて確定申告をする人は、申告書に寄附した金額を書きます（ワンストップ特例は使えません）。2,000円をこえた分が、所得税と住民税から引かれます。", src: "タックスアンサー No.1150 一定の寄附金を支払ったとき" },
  { q: "消費税の「2割特例」とは？", a: "インボイス登録で消費税を払うことになった小さな事業者が、売上の消費税の2割だけを払えばよい特例です。個人は令和8年分が最後で、そのあと令和9年分・10年分は「3割特例」が使えます。", src: "国税庁「インボイス制度」の特集ページ" },
  { q: "帳簿やレシートは、いつまで保存しますか？", a: "帳簿は7年間、レシートや請求書などは5年〜7年間の保存が必要です。メールやネットで受け取った請求書は、紙に印刷せず、データのまま保存します（電子帳簿保存法）。", src: "国税庁「電子帳簿保存法」の特集ページ" },
];

function Soudan() {
  const s = useStore();
  const conf = useAi();
  const [q, setQ] = useState("");
  const [ans, setAns] = useState<{ q: string; a: string }[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const c = compute(s, { project: true });
  const go = async () => {
    if (!q.trim()) return;
    setBusy(true); setErr("");
    try {
      const a = await ask(q.trim(), `個人事業主（${s.profile.job}）・${s.profile.blue === "white" ? "白色申告" : "青色申告"}・今年の売上の見込み約${Math.round((c.sales) / 10000)}万円・消費税は${s.profile.ctax === "exempt" ? "免税" : "インボイス登録あり"}`);
      setAns([{ q: q.trim(), a }, ...ans]); setQ("");
    } catch (e) { setErr((e as Error).message); } finally { setBusy(false); }
  };
  return (
    <>
      <Help title="わからないことを聞く" say="よくある質問と答えを読めます。AIの設定をすると、自由に質問もできます。答えは一般的な説明です。自分の場合どうなるか迷うときは、税務署の電話相談か、税理士に確認してください。">
        よくある質問と答えを読めます。AIの設定をすると、自由に質問もできます。<br />答えは<b>一般的な説明</b>です。「自分の場合はどうか」で迷うときは、税務署の電話相談か、税理士に確かめてください。
      </Help>

      <section className="card p-5 sm:p-6" aria-labelledby="ai">
        <h2 id="ai" className="flex items-center gap-2 text-[1.3rem] font-bold"><Sparkles size={22} className="text-ok" />AIに質問する</h2>
        {aiReady(conf) ? (
          <>
            <textarea value={q} onChange={(e) => setQ(e.target.value)} rows={3} placeholder="例）車のガソリン代は経費になりますか？" className="field mt-3 text-[1.05rem] leading-[1.8]" />
            <button type="button" disabled={busy || !q.trim()} onClick={go} className="btn btn-main mt-3 w-full sm:w-auto">{busy ? <><Loader2 size={20} className="animate-spin" />考えています</> : <><Send size={20} />質問する</>}</button>
            {err && <p role="alert" className="mt-3 rounded-xl bg-ng-2 p-3 font-bold text-ng">{err}</p>}
            {ans.map((x, i) => (
              <div key={i} className="mt-4 rounded-2xl bg-paper p-4">
                <p className="text-[0.95rem] font-bold text-sub">Q. {x.q}</p>
                <p className="mt-2 whitespace-pre-wrap text-[1.05rem] leading-[1.9]">{x.a}</p>
                <div className="mt-2"><Speak text={x.a} label="答えを読み上げる" /></div>
              </div>
            ))}
          </>
        ) : (
          <p className="mt-3 text-[1.02rem]">AIに自由に質問するには、<Link href="/settings/" className="font-bold underline">設定</Link>で、AIのキーを入れてください（Geminiなら無料枠で使えます）。下の「よくある質問」は、キーが無くても読めます。</p>
        )}
      </section>

      <section className="mt-6" aria-labelledby="faq">
        <h2 id="faq" className="text-[1.3rem] font-bold">よくある質問</h2>
        <div className="mt-3 space-y-2">
          {FAQ.map((f) => (
            <details key={f.q} className="card p-4">
              <summary className="cursor-pointer text-[1.08rem] font-bold">{f.q}</summary>
              <p className="mt-3 text-[1.03rem] leading-[1.95]">{f.a}</p>
              <p className="mt-2 text-[0.88rem] text-sub">くわしくは：国税庁 {f.src}</p>
              <div className="mt-2"><Speak text={`${f.q}。${f.a}`} label="読み上げる" /></div>
            </details>
          ))}
        </div>
      </section>

      <section className="card mt-6 flex flex-wrap items-center gap-4 p-5" aria-label="電話で相談">
        <Phone size={34} className="shrink-0 text-ok" />
        <p className="flex-1 text-[1rem]"><b className="block text-[1.1rem]">電話で聞きたいとき</b>税務署の「電話相談センター」に、無料で相談できます（国税庁のサイトの「税についての相談窓口」に案内があります）。むずかしい判断や、金額が大きいときは、税理士への相談もおすすめです。</p>
      </section>
    </>
  );
}

export default function Page() { return <Shell><Ready><Soudan /></Ready></Shell>; }
