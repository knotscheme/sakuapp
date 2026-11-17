"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Copy, Eye, EyeOff, FileUp, RotateCcw, ShieldCheck } from "lucide-react";
import Shell, { Title } from "@/components/Shell";
import Ready from "@/components/Ready";
import { askConfirm, toast } from "@/components/Confirm";
import { MODELS, PNAME, saveAi, useAi, type Provider } from "@/lib/ai";
import { resetDemo, update, useStore } from "@/lib/store";
import { SiteGrid } from "@/components/SitePicker";
import { AIS, QUESTIONS } from "@/lib/demo";
import J from "@/components/J";
import { platformOf } from "@/lib/platforms";
import { PRIVACY, SNIPPET, tagKind } from "@/lib/tag";

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

// コードを見せて、押すとコピーできる箱
function Code({ text, label }: { text: string; label: string }) {
  const copy = async () => { try { await navigator.clipboard.writeText(text); toast(`${label}をコピーしました`); } catch { toast("コピーできませんでした。選んでコピーしてください"); } };
  return (
    <div className="relative mt-2">
      <pre className="max-h-64 overflow-auto rounded-2xl bg-paper p-4 pt-12 font-mono text-[0.72rem] leading-[1.7] text-ink/90 whitespace-pre">{text}</pre>
      <button type="button" onClick={copy} aria-label={`${label}をコピー`} className="absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-full bg-white/[.06] text-sub hover:text-ink"><Copy size={16} /></button>
    </div>
  );
}

// 計測タグ：AIから来たお客様と売上を、推測ではなく実際の来店で数える
function Tag() {
  const s = useStore();
  const [busy, setBusy] = useState(false);
  const p = platformOf(s.site);
  const kind = tagKind(s.site);
  const check = () => { setBusy(true); setTimeout(() => { setBusy(false); update((x) => ({ ...x, tag: "ok" })); toast("タグから記録が届きました（デモ）"); }, 1200); };
  return (
    <section className="card mt-5 p-5 sm:p-6" aria-labelledby="tg">
      <h2 id="tg" className="text-[1.1rem] font-bold">計測タグ</h2>
      <p className="mt-1 text-[0.85rem] leading-[1.8] text-sub"><J>お店のサイトにタグを貼ると、ChatGPTなどのAIから来たお客様と、その売上を数えます。推測ではなく、実際の来店と注文です。Googleアナリティクスなどを通さないので、ほかの会社の審査はいりません。</J></p>
      {!p ? (
        <p className="mt-4 text-[0.88rem] text-sub"><J>先に、上の「お店のサイト」を選んでください。サイトに合わせた貼り方を出します。</J></p>
      ) : kind === "csv" ? (
        <div className="mt-4">
          <p className="text-[0.9rem] leading-[1.8]"><J>{`${p.name}は、お店が自由にタグを入れられないため、注文のCSVを取りこんで確かめます。`}</J></p>
          <p className="mt-2 text-[0.82rem] leading-[1.8] text-sub"><J>モールでは、どの注文がAIから来たかを1件ずつは見分けられません。直した商品の売上が、直す前とくらべてどう変わったかで確かめます（目安）。</J></p>
          <button type="button" onClick={() => { update((x) => ({ ...x, csv: true })); toast("注文CSVを取りこみました（デモ）"); }} className={`btn mt-4 ${s.csv ? "btn-line" : "btn-ai"}`}>{s.csv ? <><CheckCircle2 size={18} className="text-ai" />取りこみ済み（デモ）</> : <><FileUp size={18} />注文CSVを取りこむ（デモ）</>}</button>
        </div>
      ) : (
        <div className="mt-4">
          <p className="text-[0.88rem] font-bold">{p.name}での貼り方</p>
          <ol className="mt-2 space-y-1.5 text-[0.86rem] leading-[1.8]">{SNIPPET[kind].steps.map((t, i) => <li key={t} className="flex gap-2"><span className="num text-ai">{i + 1}.</span><span className="min-w-0"><J>{t}</J></span></li>)}</ol>
          <Code text={SNIPPET[kind].code} label="タグ" />
          {SNIPPET[kind].buy && <><p className="mt-4 text-[0.86rem] font-bold">購入のタグ（注文が終わったページだけ）</p><Code text={SNIPPET[kind].buy!} label="購入のタグ" /></>}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {s.tag === "ok"
              ? <p className="flex items-center gap-2 text-[0.9rem] text-ai"><CheckCircle2 size={18} />タグから記録が届いています（デモ）</p>
              : <button type="button" onClick={check} disabled={busy} className="btn btn-ai">{busy ? "確認しています…" : "貼ったので確認する"}</button>}
            {s.tag === "ok" && <Link href="/kouka/" className="text-[0.86rem] text-ai underline underline-offset-4">売上の画面で見る</Link>}
          </div>
        </div>
      )}
      <details className="mt-5 rounded-2xl bg-paper p-4">
        <summary className="cursor-pointer text-[0.88rem] font-bold"><J>プライバシーポリシーに足す文（ひな形）</J></summary>
        <p className="mt-2 text-[0.82rem] leading-[1.8] text-sub"><J>サイトの訪問者の情報を外の会社に送るときは、そのことをサイトで知らせる決まりがあります。下の文を、お店のプライバシーポリシーに足してください。</J></p>
        <Code text={PRIVACY} label="文" />
      </details>
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
      <Title title="設定" lead="お店のサイト、計測タグ、測る設定、お店のAIのキーを入れます。" />
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
      <Tag />
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
        <button type="button" onClick={async () => { if (await askConfirm({ title: "デモを最初の状態に戻しますか？", body: "使った書き直し案・選んだサイト・計測タグ・デモの注文が消えます。", ok: "戻す", danger: true })) { resetDemo(); toast("最初の状態に戻しました"); } }} className="btn btn-line mt-3"><RotateCcw size={18} />最初の状態に戻す</button>
      </section>
    </>
  );
}

export default function Page() { return <Shell><Ready><Settings /></Ready></Shell>; }
