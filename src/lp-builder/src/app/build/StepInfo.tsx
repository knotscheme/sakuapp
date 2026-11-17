"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, ClipboardPaste, Copy, Loader2, RotateCcw, Sparkles, Wand2 } from "lucide-react";
import { toast } from "@/components/Confirm";
import { PROVIDERS, generateCopy, textReady, useAi, type Provider } from "@/lib/ai";
import { copyPrompt, parseCopy } from "@/lib/prompt";
import { resetColors, setColor, setFields, setInfo, useProject } from "@/lib/project";
import { getTemplate } from "@/lib/templates";
import type { BasicInfo } from "@/lib/types";

const INFO: { k: keyof BasicInfo; label: string; ph: string; multi?: boolean }[] = [
  { k: "brand", label: "ブランド名・お店の名前", ph: "例：SORAE" },
  { k: "product", label: "何を売りますか？（商品・サービス）", ph: "例：敏感肌向けのセラミド化粧水" },
  { k: "target", label: "どんな人に届けたい？", ph: "例：30代の乾燥・敏感肌に悩む女性" },
  { k: "strengths", label: "強み・特長（いくつでも）", ph: "例：ヒト型セラミド3種／無香料・無着色／国内の自社工場で製造", multi: true },
  { k: "tone", label: "文章の雰囲気", ph: "例：やさしく上品に／力強く／静かで幻想的に" },
  { k: "price", label: "価格", ph: "例：120mL 3,960円（税込）" },
  { k: "url", label: "ボタンを押したときのリンク先", ph: "例：https://あなたのお店.com/products/lotion" },
];

export async function copyText(s: string) {
  try { await navigator.clipboard.writeText(s); toast("コピーしました"); }
  catch { toast("コピーできませんでした。長押し・選択してコピーしてください"); }
}

export default function StepInfo({ onNext }: { onNext: () => void }) {
  const { p } = useProject();
  const ai = useAi();
  const [info, setLocal] = useState<BasicInfo>(p!.info);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [paste, setPaste] = useState("");
  const [showCopy, setShowCopy] = useState(!textReady(ai));
  useEffect(() => { setShowCopy(!textReady(ai)); }, [ai]);
  // 入力をやめて少したったら保存
  useEffect(() => {
    if (JSON.stringify(info) === JSON.stringify(p!.info)) return;
    const tm = setTimeout(() => setInfo(info), 500);
    return () => clearTimeout(tm);
  }, [info, p]);
  const t = getTemplate(p!.tpl);
  const ready = info.product.trim().length > 0;

  async function auto() {
    setInfo(info);
    setBusy(true); setErr("");
    try {
      const f = await generateCopy(t, info);
      setFields(f);
      toast(`文章を作りました（${Object.keys(f).length}項目）`);
    } catch (e) { setErr((e as Error).message); } finally { setBusy(false); }
  }
  function applyPaste() {
    setErr("");
    try {
      const f = parseCopy(t, paste);
      setFields(f); setPaste("");
      toast(`文章を入れました（${Object.keys(f).length}項目）`);
    } catch (e) { setErr((e as Error).message); }
  }

  return (
    <div className="fade-in grid gap-6 lg:grid-cols-[1.1fr_1fr]">
      <section className="card p-5 sm:p-6">
        <h1 className="text-[20px] font-bold">商品のことを教えてください</h1>
        <p className="mt-1.5 text-[13px] leading-[1.85] text-mute">ここに書いた内容から、LPの文章と、写真の指示文を作ります。わかるところだけで大丈夫です。</p>
        <div className="mt-5 space-y-4">
          {INFO.map(({ k, label, ph, multi }) => (
            <div key={k}>
              <label htmlFor={`i-${k}`} className="block text-[13px] font-medium">{label}{k === "product" && <span className="ml-1.5 text-[11px] text-accent">必須</span>}</label>
              {multi
                ? <textarea id={`i-${k}`} rows={3} value={info[k]} placeholder={ph} onChange={(e) => setLocal({ ...info, [k]: e.target.value })} className="field mt-1.5 resize-y leading-[1.8]" />
                : <input id={`i-${k}`} value={info[k]} placeholder={ph} inputMode={k === "url" ? "url" : undefined} onChange={(e) => setLocal({ ...info, [k]: e.target.value })} className="field mt-1.5" />}
            </div>
          ))}
        </div>
        <div className="mt-6 border-t border-line pt-5">
          <div className="flex items-center justify-between"><h2 className="text-[14px] font-bold">色</h2><button type="button" onClick={resetColors} className="flex items-center gap-1 text-[12px] text-mute hover:text-ink"><RotateCcw size={12} />型の色に戻す</button></div>
          <div className="mt-3 flex flex-wrap gap-3">
            {t.colors.map((c) => (
              <label key={c.id} className="flex cursor-pointer items-center gap-2 rounded-full bg-paper py-1.5 pl-1.5 pr-3.5 text-[12.5px]">
                <input type="color" value={p!.colors[c.id] ?? c.value} onChange={(e) => setColor(c.id, e.target.value)} className="h-7 w-7 cursor-pointer rounded-full border-0 bg-transparent p-0" aria-label={c.label} />{c.label}
              </label>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-5">
        <div className="card p-5 sm:p-6">
          <h2 className="flex items-center gap-2 text-[17px] font-bold"><Wand2 size={18} />LPの文章を作る</h2>
          <p className="mt-1.5 text-[13px] leading-[1.85] text-mute">いまは「{t.name}」の見本の文章が入っています。下のどちらかの方法で、あなたの商品の文章に入れかえます（あとからプレビューで1つずつ直せます）。</p>

          {textReady(ai) ? (
            <div className="mt-5 rounded-xl bg-paper p-4">
              <p className="text-[13px]"><b>自動で作る</b><span className="ml-2 text-[12px] text-mute">使うAI：{PROVIDERS[ai.text as Provider].name}</span></p>
              <button type="button" disabled={!ready || busy} onClick={auto} className="btn btn-accent mt-3 w-full py-3 text-[14px]">{busy ? <><Loader2 size={16} className="spin" />文章を作っています（20〜60秒）</> : <><Sparkles size={16} />AIで文章を作る</>}</button>
              {!ready && <p className="mt-2 text-[12px] text-accent">「何を売りますか？」を入れると押せます</p>}
            </div>
          ) : (
            <div className="mt-5 rounded-xl bg-paper p-4 text-[13px] leading-[1.85]">
              <b>自分のAIのキーを入れると、ボタン1つで作れます。</b>
              <p className="text-mute">Gemini なら無料枠で使えます。</p>
              <Link href="/settings/" className="btn btn-ink mt-3 px-4 py-2 text-[12.5px]"><Sparkles size={14} />AIを設定する</Link>
            </div>
          )}

          <div className="mt-4">
            <button type="button" onClick={() => setShowCopy(!showCopy)} className="text-[13px] font-medium underline underline-offset-4">{showCopy ? "▼" : "▶"} キーなしで作る（指示文をコピーして、ChatGPT などに貼る）</button>
            {showCopy && (
              <ol className="mt-3 space-y-4 text-[13px]">
                <li>
                  <p><b>1.</b> 指示文をコピーして、ChatGPT・Gemini・Claude などに貼り付けます</p>
                  <div className="mt-2 flex gap-2">
                    <button type="button" disabled={!ready} onClick={() => copyText(copyPrompt(t, info))} className="btn btn-ink px-4 py-2.5 text-[13px]"><Copy size={14} />指示文をコピー</button>
                    <details className="min-w-0 flex-1"><summary className="cursor-pointer py-2 text-[12px] text-mute">中身を見る</summary><pre className="mt-1 max-h-48 overflow-auto whitespace-pre-wrap rounded-lg bg-paper p-3 text-[11px] leading-[1.7]">{copyPrompt(t, info)}</pre></details>
                  </div>
                </li>
                <li>
                  <p><b>2.</b> AIの返事（{"{ }"} で囲まれた部分）を、まるごと貼り付けます</p>
                  <textarea rows={4} value={paste} onChange={(e) => setPaste(e.target.value)} placeholder='{"brand": "…", "heroCopy": "…", …}' className="field mt-2 font-mono text-[12px]" />
                  <button type="button" disabled={!paste.trim()} onClick={applyPaste} className="btn btn-line mt-2 px-4 py-2.5 text-[13px]"><ClipboardPaste size={14} />文章に反映する</button>
                </li>
              </ol>
            )}
          </div>
          {err && <p role="alert" className="mt-4 rounded-lg bg-red-50 px-3 py-2.5 text-[12.5px] leading-[1.8] text-red-700">{err}</p>}
        </div>
        <div className="flex justify-end">
          <button type="button" onClick={() => { setInfo(info); onNext(); }} className="btn btn-ink px-7 py-3 text-[14px]">次へ：写真を入れる<ArrowRight size={16} /></button>
        </div>
      </section>
    </div>
  );
}
