"use client";

import { useState } from "react";
import { Eye, EyeOff, RotateCcw, ShieldCheck } from "lucide-react";
import Shell, { Title } from "@/components/Shell";
import Ready from "@/components/Ready";
import { askConfirm, toast } from "@/components/Confirm";
import { MODELS, PNAME, saveAi, useAi, type Provider } from "@/lib/ai";
import { resetDemo, update, useStore } from "@/lib/store";
import { SiteGrid } from "@/components/SitePicker";
import { AIS, QUESTIONS } from "@/lib/demo";
import J from "@/components/J";

// 測る設定：AIの利用料は、お店のAIのキーで各社に直接払う。回数を決めると、月に何回質問するかが分かる
function Measure() {
  const s = useStore();
  const m = s.measure ?? { ais: [...AIS], tries: 5 };
  const set = (x: Partial<typeof m>) => update((st) => ({ ...st, measure: { ...m, ...x } }));
  const perWeek = QUESTIONS.length * m.ais.length * m.tries;
  return (
    <section className="card mt-5 p-5 sm:p-6" aria-labelledby="ms">
      <h2 id="ms" className="text-[1.1rem] font-bold">測る設定</h2>
      <p className="mt-1 text-[0.85rem] leading-[1.8] text-sub"><J>AIの利用料は、TSURETEの料金には含みません。お店のAIのキーを使い、各社からお店に直接請求されます。</J></p>
      <p className="mt-4 text-[0.88rem] font-bold">使うAI</p>
      <div className="mt-2 flex flex-wrap gap-2">{AIS.map((a) => { const on = m.ais.includes(a); return <button key={a} type="button" aria-pressed={on} onClick={() => set({ ais: on ? m.ais.filter((x) => x !== a) : [...m.ais, a] })} className={`btn min-h-[2.5rem] px-4 ${on ? "btn-ai" : "btn-line opacity-60"}`}>{a}</button>; })}</div>
      <p className="mt-4 text-[0.88rem] font-bold">1つの質問を、毎週何回聞くか</p>
      <div className="mt-2 grid max-w-[22rem] grid-cols-4 gap-2">{[3, 5, 10, 20].map((n) => <button key={n} type="button" aria-pressed={m.tries === n} onClick={() => set({ tries: n })} className={`btn min-h-[2.5rem] px-2 ${m.tries === n ? "btn-ai" : "btn-line"}`}>{n}回</button>)}</div>
      <div className="mt-5 rounded-2xl bg-paper p-4">
        <p className="text-[0.85rem] text-sub">AIへの質問の回数</p>
        <p className="mt-1"><b className="num text-[1.6rem]">{perWeek.toLocaleString("ja-JP")}</b><span className="text-sub"> 回／週</span><span className="ml-3 text-[0.9rem] text-sub">（月に約 <span className="num">{Math.round(perWeek * 4.3).toLocaleString("ja-JP")}</span> 回）</span></p>
        <p className="mt-1 text-[0.8rem] leading-[1.8] text-sub"><J>{`質問${QUESTIONS.length}個 × AI${m.ais.length}つ × ${m.tries}回。回数を減らすと利用料は安くなりますが、数字のぶれが大きくなります。`}</J></p>
      </div>
    </section>
  );
}

function Settings() {
  const s = useStore();
  const ai = useAi();
  const [show, setShow] = useState(false);
  const real = (p: Partial<typeof s.real>) => update((x) => ({ ...x, real: { ...x.real, ...p } }));
  return (
    <>
      <Title title="設定" lead="お店のサイト、測る設定、お店のAIのキーを入れます。" />
      <section className="card p-5 sm:p-6" aria-labelledby="sh">
        <h2 id="sh" className="text-[1.1rem] font-bold">自分のブランド</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <label className="text-[0.9rem] font-bold">ブランド名<input value={s.real.brand} onChange={(e) => real({ brand: e.target.value })} placeholder="例）SORAE" className="field mt-1" /></label>
          <label className="text-[0.9rem] font-bold">商品の種類<input value={s.real.item} onChange={(e) => real({ item: e.target.value })} placeholder="例）敏感肌向けの化粧水" className="field mt-1" /></label>
          <label className="text-[0.9rem] font-bold">ジャンル<input value={s.real.kind} onChange={(e) => real({ kind: e.target.value })} placeholder="例）スキンケア" className="field mt-1" /></label>
        </div>
        <p className="mt-2 text-[0.82rem] text-sub"><J>入れると「測る」の「本物のAIに聞いてみる」で、自分のブランドが出るかを確かめられます。</J></p>
      </section>
      <section className="card mt-5 p-5 sm:p-6" aria-labelledby="site">
        <h2 id="site" className="text-[1.1rem] font-bold">お店のサイト</h2>
        <p className="mt-1 text-[0.85rem] text-sub"><J>選んだサイトに合わせて、「直す」の届け方が変わります。</J></p>
        <div className="mt-4"><SiteGrid /></div>
      </section>
      <Measure />
      <section className="card mt-5 p-5 sm:p-6" aria-labelledby="ak">
        <h2 id="ak" className="text-[1.1rem] font-bold">お店のAIのキー</h2>
        <p className="mt-1 flex gap-2 text-[0.9rem] text-sub"><ShieldCheck size={20} className="mt-0.5 shrink-0 text-ok" /><span className="min-w-0"><J>デモでは、キーはこの端末の中だけに保存し、AIへは端末から直接送ります。本番では、毎週の自動測定のために暗号化して保管し、測る以外には使いません。利用料は、キーの持ち主（お店）に各社から請求されます。</J></span></p>
        <div className="mt-3 flex flex-wrap gap-2">{(["gemini", "anthropic", "openai"] as Provider[]).map((p) => <button key={p} type="button" aria-pressed={ai.provider === p} onClick={() => saveAi({ ...ai, provider: p, model: "" })} className={`btn ${ai.provider === p ? "btn-ink" : "btn-line"}`}>{PNAME[p]}</button>)}</div>
        {ai.provider && (
          <>
            <label className="mt-3 block text-[0.9rem] font-bold">APIキー<span className="mt-1 flex gap-2"><input type={show ? "text" : "password"} autoComplete="off" value={ai.key} onChange={(e) => saveAi({ ...ai, key: e.target.value.trim() })} className="field font-mono" placeholder="ここに貼り付け" /><button type="button" onClick={() => setShow(!show)} className="btn btn-line px-3" aria-label={show ? "キーを隠す" : "キーを表示"}>{show ? <EyeOff size={18} /> : <Eye size={18} />}</button></span></label>
            <label className="mt-3 block text-[0.9rem] font-bold">モデル（ふつうは変えなくて大丈夫）<input value={ai.model} placeholder={MODELS[ai.provider]} onChange={(e) => saveAi({ ...ai, model: e.target.value.trim() })} className="field mt-1 max-w-[20rem] font-mono" /></label>
            <button type="button" onClick={() => { saveAi({ provider: "", key: "", model: "" }); toast("消しました"); }} className="btn btn-line mt-3">キーを消す</button>
          </>
        )}
      </section>
      <section className="card mt-5 p-5 sm:p-6" aria-labelledby="dm">
        <h2 id="dm" className="text-[1.1rem] font-bold">デモ</h2>
        <button type="button" onClick={async () => { if (await askConfirm({ title: "デモを最初の状態に戻しますか？", body: "使った書き直し案・選んだサイト・デモの注文が消えます。", ok: "戻す", danger: true })) { resetDemo(); toast("最初の状態に戻しました"); } }} className="btn btn-line mt-3"><RotateCcw size={18} />最初の状態に戻す</button>
      </section>
    </>
  );
}

export default function Page() { return <Shell><Ready><Settings /></Ready></Shell>; }
