"use client";

import { useState } from "react";
import { Eye, EyeOff, RotateCcw, ShieldCheck } from "lucide-react";
import Shell, { Title } from "@/components/Shell";
import Ready from "@/components/Ready";
import { askConfirm, toast } from "@/components/Confirm";
import { MODELS, PNAME, saveAi, useAi, type Provider } from "@/lib/ai";
import { resetDemo, update, useStore } from "@/lib/store";

function Settings() {
  const s = useStore();
  const ai = useAi();
  const [show, setShow] = useState(false);
  const real = (p: Partial<typeof s.real>) => update((x) => ({ ...x, real: { ...x.real, ...p } }));
  return (
    <>
      <Title title="設定" lead="自分のお店で「AIのおすすめに出るか」を本当に試すための情報と、AIのキーを入れます。" />
      <section className="card p-5 sm:p-6" aria-labelledby="sh">
        <h2 id="sh" className="text-[1.1rem] font-bold">自分のお店</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <label className="text-[0.9rem] font-bold">お店の名前<input value={s.real.name} onChange={(e) => real({ name: e.target.value })} placeholder="例）○○整体院" className="field mt-1" /></label>
          <label className="text-[0.9rem] font-bold">地域・駅<input value={s.real.area} onChange={(e) => real({ area: e.target.value })} placeholder="例）吉祥寺駅" className="field mt-1" /></label>
          <label className="text-[0.9rem] font-bold">業種<input value={s.real.kind} onChange={(e) => real({ kind: e.target.value })} placeholder="例）整体院" className="field mt-1" /></label>
        </div>
      </section>
      <section className="card mt-5 p-5 sm:p-6" aria-labelledby="ak">
        <h2 id="ak" className="text-[1.1rem] font-bold">AIのキー</h2>
        <p className="mt-1 flex gap-2 text-[0.9rem] text-sub"><ShieldCheck size={20} className="mt-0.5 shrink-0 text-ok" /><span>キーは、この端末の中だけに保存し、AIへは端末から直接送ります。TSURETEの運営者には届きません。費用は、キーの持ち主に各社から請求されます。</span></p>
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
        <button type="button" onClick={async () => { if (await askConfirm({ title: "デモを最初の状態に戻しますか？", body: "入れた改善・予約・呼びかけ・提携の状態が消えます。", ok: "戻す", danger: true })) { resetDemo(); toast("最初の状態に戻しました"); } }} className="btn btn-line mt-3"><RotateCcw size={18} />最初の状態に戻す</button>
      </section>
    </>
  );
}

export default function Page() { return <Shell><Ready><Settings /></Ready></Shell>; }
