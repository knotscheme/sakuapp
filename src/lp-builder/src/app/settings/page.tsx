"use client";

import { useEffect, useState } from "react";
import { Check, ChevronDown, ExternalLink, Eye, EyeOff, Image as ImageIcon, KeyRound, Loader2, ShieldCheck, Trash2, Type } from "lucide-react";
import Header from "@/components/Header";
import { askConfirm, toast } from "@/components/Confirm";
import { DEFAULT_MODELS, PROVIDERS, clearAi, getAi, listModels, mask, saveAi, useAi, type AiSettings, type Provider } from "@/lib/ai";

const ORDER: Provider[] = ["gemini", "openai", "anthropic"];
// モデル名の欄（会社ごと）
const MODEL_FIELDS: Record<Provider, { k: keyof AiSettings["models"]; label: string; filter: (id: string) => boolean }[]> = {
  gemini: [
    { k: "geminiText", label: "文章のモデル", filter: (id) => /^gemini/.test(id) && !/image|tts|embedding|audio|live/.test(id) },
    { k: "geminiImage", label: "画像のモデル", filter: (id) => /image/.test(id) },
  ],
  openai: [
    { k: "openaiText", label: "文章のモデル", filter: (id) => /^(gpt|o\d|chatgpt)/.test(id) && !/image|audio|realtime|tts|transcribe|search|embedding/.test(id) },
    { k: "openaiImage", label: "画像のモデル", filter: (id) => /image/.test(id) },
  ],
  anthropic: [{ k: "anthropicText", label: "文章のモデル", filter: (id) => /^claude/.test(id) }],
};

export default function Settings() {
  const saved = useAi();
  const [s, setS] = useState<AiSettings>(saved);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setS(getAi()); setLoaded(true); }, []);
  const [show, setShow] = useState<Record<string, boolean>>({});
  const [models, setModels] = useState<Partial<Record<Provider, string[]>>>({});
  const [checking, setChecking] = useState<Provider | "">("");
  const [ok, setOk] = useState<Partial<Record<Provider, string>>>({});
  const [open, setOpen] = useState<Provider | "">("gemini");

  const dirty = loaded && JSON.stringify(s) !== JSON.stringify(saved);
  const setKey = (p: Provider, v: string) => setS({ ...s, keys: { ...s.keys, [p]: v.trim() } });

  async function check(p: Provider) {
    setChecking(p);
    setOk({ ...ok, [p]: "" });
    try {
      const list = await listModels(p, s.keys[p]);
      setModels((m) => ({ ...m, [p]: list }));
      setOk((o) => ({ ...o, [p]: `使えます（モデル ${list.length}個）` }));
      // まだ文章・画像のAIを選んでいなければ、確かめたものを選んでおく
      setS((cur) => ({ ...cur, text: cur.text || p, image: cur.image || (PROVIDERS[p].canImage ? (p as "gemini" | "openai") : "") }));
    } catch (e) {
      setOk((o) => ({ ...o, [p]: `× ${(e as Error).message}` }));
    } finally { setChecking(""); }
  }
  const save = () => { saveAi(s); toast(s.remember ? "保存しました（この端末に保存）" : "保存しました（このタブを閉じると消えます）"); };
  const wipe = async () => {
    if (!(await askConfirm({ title: "保存したAPIキーをすべて消しますか？", body: "この端末から、3社分のキーとモデルの設定を消します。", ok: "消す", danger: true }))) return;
    clearAi(); setS(getAi()); setOk({}); setModels({}); toast("消しました");
  };

  const have = ORDER.filter((p) => s.keys[p]);
  return (
    <>
      <Header />
      <main className="mx-auto max-w-[880px] px-4 py-8 sm:px-6 sm:py-10">
        <h1 className="text-[24px] font-bold sm:text-[28px]">AIの設定</h1>
        <p className="mt-2 text-[14px] leading-[1.95] text-ink/75">自分のAPIキーを入れると、「つくる」画面で文章と写真をボタン1つで作れます。キーが無くても、指示文をコピーして各社のAI（無料版でも可）に貼れば同じことができます。</p>

        <div className="mt-5 flex gap-3 rounded-2xl bg-[#eef6f1] p-4 text-[13px] leading-[1.9] text-[#1d4a34]">
          <ShieldCheck size={20} className="mt-0.5 shrink-0" />
          <div><b>キーは、この端末のブラウザの中だけに置きます。</b>AIを使うときは、ブラウザから各社（Google・OpenAI・Anthropic）へ直接送ります。LP BUILDER のサーバーには送らず、こちらから見ることもできません。<br />共用のパソコンでは「この端末に保存する」をオフにしてください（タブを閉じると消えます）。</div>
        </div>

        <div className="mt-8 space-y-3">
          {ORDER.map((p) => {
            const info = PROVIDERS[p];
            const isOpen = open === p;
            return (
              <section key={p} className="card overflow-hidden">
                <button type="button" onClick={() => setOpen(isOpen ? "" : p)} aria-expanded={isOpen} className="tap flex w-full items-center gap-3 px-5 py-4 text-left">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-paper"><KeyRound size={17} /></span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-x-2 text-[15px] font-bold">{info.name}{p === "gemini" && <span className="rounded-full bg-accent-2 px-2 py-0.5 text-[11px] font-medium text-accent">おすすめ・無料枠あり</span>}</span>
                    <span className="mt-0.5 block text-[12px] text-mute">{s.keys[p] ? `キー：${mask(s.keys[p])}` : "未設定"}・{info.canImage ? "文章と画像" : "文章のみ"}</span>
                  </span>
                  {s.keys[p] && <Check size={17} className="text-ok" />}
                  <ChevronDown size={18} className={`text-mute transition ${isOpen ? "rotate-180" : ""}`} />
                </button>
                {isOpen && (
                  <div className="border-t border-line px-5 pb-5 pt-4">
                    {p === "gemini" && (
                      <ol className="mb-4 space-y-1 rounded-xl bg-paper p-4 text-[12.5px] leading-[1.9]">
                        <li><b>キーの作り方（無料・数分）</b></li>
                        <li>1. <a href={info.keyUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-0.5 underline">Google AI Studio<ExternalLink size={11} /></a> を開き、Googleアカウントでログイン</li>
                        <li>2. 「APIキーを作成」を押す（クレジットカードの登録は不要）</li>
                        <li>3. できたキー（AIza から始まる文字）をコピーして、下に貼り付け</li>
                        <li className="text-mute">※無料枠は文章の生成が中心です。画像の生成は、モデルによって支払いの設定が必要です。</li>
                      </ol>
                    )}
                    {p !== "gemini" && <p className="mb-3 text-[12.5px] leading-[1.9] text-mute">{info.free}。キーは <a href={info.keyUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-0.5 text-ink underline">{info.site}<ExternalLink size={11} /></a> で作れます。</p>}
                    <label className="block text-[12.5px] font-medium" htmlFor={`key-${p}`}>APIキー</label>
                    <div className="mt-1.5 flex gap-2">
                      <div className="relative flex-1">
                        <input id={`key-${p}`} type={show[p] ? "text" : "password"} autoComplete="off" spellCheck={false} value={s.keys[p]} onChange={(e) => setKey(p, e.target.value)} placeholder="ここに貼り付け" className="field pr-10 font-mono text-[13px]" />
                        <button type="button" onClick={() => setShow({ ...show, [p]: !show[p] })} aria-label={show[p] ? "キーを隠す" : "キーを表示"} className="absolute right-1 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center text-mute hover:text-ink">{show[p] ? <EyeOff size={15} /> : <Eye size={15} />}</button>
                      </div>
                      <button type="button" disabled={!s.keys[p] || checking === p} onClick={() => check(p)} className="btn btn-ink shrink-0 px-4 text-[13px]">{checking === p ? <Loader2 size={15} className="spin" /> : null}確かめる</button>
                    </div>
                    {ok[p] && <p className={`mt-2 text-[12.5px] ${ok[p]!.startsWith("×") ? "text-red-600" : "text-ok"}`}>{ok[p]}</p>}
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {MODEL_FIELDS[p].map(({ k, label, filter }) => {
                        const list = (models[p] ?? []).filter(filter);
                        return (
                          <div key={k}>
                            <label htmlFor={`m-${k}`} className="block text-[12.5px] font-medium">{label}</label>
                            <input id={`m-${k}`} list={`dl-${k}`} value={s.models[k]} onChange={(e) => setS({ ...s, models: { ...s.models, [k]: e.target.value.trim() } })} className="field mt-1.5 font-mono text-[12.5px]" />
                            <datalist id={`dl-${k}`}>{list.map((m) => <option key={m} value={m} />)}</datalist>
                            <p className="mt-1 text-[11px] text-mute">{list.length ? `${list.length}個から選べます（欄をクリック）` : `初期値：${DEFAULT_MODELS[k]}。「確かめる」で使えるモデルを読み込めます`}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </section>
            );
          })}
        </div>

        <section className="card mt-6 p-5">
          <h2 className="text-[15px] font-bold">どのAIを使うか</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="flex items-center gap-1.5 text-[12.5px] font-medium"><Type size={14} />文章を作るAI</p>
              <select value={s.text} onChange={(e) => setS({ ...s, text: e.target.value as AiSettings["text"] })} className="field mt-1.5">
                <option value="">使わない（指示文をコピーして使う）</option>
                {have.map((p) => <option key={p} value={p}>{PROVIDERS[p].name}</option>)}
              </select>
            </div>
            <div>
              <p className="flex items-center gap-1.5 text-[12.5px] font-medium"><ImageIcon size={14} />画像を作るAI</p>
              <select value={s.image} onChange={(e) => setS({ ...s, image: e.target.value as AiSettings["image"] })} className="field mt-1.5">
                <option value="">使わない（撮った写真・コピーで作った画像を入れる）</option>
                {have.filter((p) => PROVIDERS[p].canImage).map((p) => <option key={p} value={p}>{PROVIDERS[p].name}</option>)}
              </select>
            </div>
          </div>
          <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl bg-paper p-4">
            <input type="checkbox" checked={s.remember} onChange={(e) => setS({ ...s, remember: e.target.checked })} className="mt-1 h-4 w-4 accent-[var(--color-ink)]" />
            <span className="text-[13px] leading-[1.8]"><b>この端末に保存する</b><br /><span className="text-mute">オフにすると、このタブを閉じたときにキーが消えます（共用のパソコン向け）。</span></span>
          </label>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <button type="button" onClick={wipe} className="tap flex items-center gap-1.5 text-[12.5px] text-mute hover:text-red-600"><Trash2 size={14} />保存したキーをすべて消す</button>
            <button type="button" disabled={!dirty} onClick={save} className="btn btn-accent px-7 py-3 text-[14px]">保存する</button>
          </div>
        </section>
        <p className="mt-5 text-[12px] leading-[1.9] text-mute">※AIの利用料は、各社との契約にもとづいて、キーの持ち主に請求されます。各社の管理画面で、使える金額の上限を設定しておくと安心です。<br />※AIが作った文章・画像は、公開前に内容（事実と合っているか・権利・表現のルール）を必ず確かめてください。</p>
      </main>
    </>
  );
}
