"use client";

import { useEffect, useRef, useState } from "react";
import { Download, Eye, EyeOff, RotateCcw, ShieldCheck, Upload } from "lucide-react";
import Shell from "@/components/Shell";
import Ready from "@/components/Ready";
import Help from "@/components/Help";
import { askConfirm, toast } from "@/components/Confirm";
import { MODELS, PNAME, saveAi, useAi, type Provider } from "@/lib/ai";
import { makeBackup, openBackup } from "@/lib/backup";
import { validT } from "@/lib/seed";
import { getState, replaceState, resetDemo, update, useStore, type Profile } from "@/lib/store";

const FS = [{ v: "1", l: "ふつう" }, { v: "2", l: "大きめ" }, { v: "3", l: "とても大きい" }];

function Settings() {
  const s = useStore();
  const ai = useAi();
  const [fs, setFs] = useState("1");
  const [show, setShow] = useState(false);
  const [pass, setPass] = useState("");
  const file = useRef<HTMLInputElement>(null);
  useEffect(() => { setFs(document.documentElement.dataset.fs ?? "1"); }, []);
  const setFont = (v: string) => { setFs(v); document.documentElement.dataset.fs = v; try { localStorage.setItem("jbs-fs", v); } catch {} };
  const prof = (p: Partial<Profile>) => update((x) => ({ ...x, profile: { ...x.profile, ...p } }));
  const sec = "card mt-5 p-5 sm:p-6";
  const pill = (on: boolean) => `btn min-h-[3rem] px-5 ${on ? "btn-ink" : "btn-sub"}`;

  async function exportFile() {
    if (pass.length < 6) { toast("合言葉は6文字以上にしてください"); return; }
    const text = await makeBackup(getState(), pass);
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([text], { type: "application/json" }));
    a.download = `じぶん申告_バックアップ_${new Date().toISOString().slice(0, 10)}.json`;
    a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    toast("バックアップを書き出しました。合言葉は忘れないように控えてください");
  }
  async function importFile(f: File | undefined) {
    if (!f) return;
    if (!pass) { toast("先に、書き出したときの合言葉を入れてください"); return; }
    try {
      const { state, receipts } = await openBackup(await f.text(), pass);
      if (!(await askConfirm({ title: "バックアップから戻しますか？", body: "いまのデータは、バックアップの内容に置きかわります。", ok: "戻す", danger: true }))) return;
      for (const [k, v] of Object.entries(receipts)) try { localStorage.setItem(k, v); } catch {}
      replaceState(state); toast("バックアップから戻しました");
    } catch (e) { toast((e as Error).message); }
  }

  return (
    <>
      <Help title="設定" say="文字の大きさ、仕事の情報、AIの設定、バックアップを変えられます。">文字の大きさ・仕事の情報・AIの設定・バックアップを変えられます。</Help>

      <section className={sec} aria-labelledby="fs">
        <h2 id="fs" className="text-[1.3rem] font-bold">文字の大きさ</h2>
        <div className="mt-3 flex flex-wrap gap-2">{FS.map((f) => <button key={f.v} type="button" aria-pressed={fs === f.v} onClick={() => setFont(f.v)} className={pill(fs === f.v)}>{f.l}</button>)}</div>
      </section>

      <section className={sec} aria-labelledby="pf">
        <h2 id="pf" className="text-[1.3rem] font-bold">仕事の情報</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="text-[0.95rem] font-bold">お名前<input value={s.profile.name} onChange={(e) => prof({ name: e.target.value })} className="field mt-1" /></label>
          <label className="text-[0.95rem] font-bold">屋号（お店の名前）<input value={s.profile.shop} onChange={(e) => prof({ shop: e.target.value })} className="field mt-1" /></label>
          <label className="text-[0.95rem] font-bold sm:col-span-2">仕事の内容<input value={s.profile.job} onChange={(e) => prof({ job: e.target.value })} className="field mt-1" /></label>
        </div>
        <fieldset className="mt-4"><legend className="text-[1.05rem] font-bold">申告のしかた</legend>
          <div className="mt-2 flex flex-wrap gap-2">{([["etax", "青色・e-Taxで出す（65万円控除）"], ["paper", "青色・紙で出す（55万円控除）"], ["white", "白色申告"]] as const).map(([v, l]) => <button key={v} type="button" aria-pressed={s.profile.blue === v} onClick={() => prof({ blue: v })} className={pill(s.profile.blue === v)}>{l}</button>)}</div>
        </fieldset>
        <fieldset className="mt-4"><legend className="text-[1.05rem] font-bold">消費税</legend>
          <div className="mt-2 flex flex-wrap gap-2">{([["exempt", "払わない（インボイス登録なし）"], ["twoWari", "2割特例"], ["simple", "簡易課税"], ["general", "本則課税"]] as const).map(([v, l]) => <button key={v} type="button" aria-pressed={s.profile.ctax === v} onClick={() => prof({ ctax: v })} className={pill(s.profile.ctax === v)}>{l}</button>)}</div>
        </fieldset>
        {s.profile.ctax !== "exempt" && (
          <label className="mt-4 block text-[0.95rem] font-bold">自分のインボイス登録番号<input value={s.profile.invoiceNo} onChange={(e) => prof({ invoiceNo: e.target.value.trim().toUpperCase() })} className="field num mt-1 max-w-[20rem]" />
            <span className={`mt-1 block text-[0.9rem] ${validT(s.profile.invoiceNo) ? "text-ok" : "text-ng"}`}>{validT(s.profile.invoiceNo) ? "番号の形は正しいです" : "番号の形が正しくありません"}</span></label>
        )}
        <label className="mt-4 block text-[0.95rem] font-bold">個人事業税の税率<select value={s.profile.bizTaxRate} onChange={(e) => prof({ bizTaxRate: Number(e.target.value) })} className="field mt-1 max-w-[20rem]"><option value={0.05}>5%（デザイン業・飲食店など多くの業種）</option><option value={0.04}>4%（畜産業・水産業など）</option><option value={0.03}>3%（あんま・はり・きゅうなど）</option><option value={0}>かからない業種（著述業・農業など）</option></select></label>
      </section>

      <section className={sec} aria-labelledby="ai">
        <h2 id="ai" className="text-[1.3rem] font-bold">AIの設定（レシートの読み取り・質問）</h2>
        <p className="mt-1 flex gap-2 text-[1rem] text-sub"><ShieldCheck size={22} className="mt-0.5 shrink-0 text-ok" />キーは、この端末の中だけに保存します。AIを使うときは、この端末から各社へ直接送ります（このアプリの運営者には届きません）。</p>
        <div className="mt-3 flex flex-wrap gap-2">{(["gemini", "anthropic", "openai"] as Provider[]).map((p) => <button key={p} type="button" aria-pressed={ai.provider === p} onClick={() => saveAi({ ...ai, provider: p, model: "" })} className={pill(ai.provider === p)}>{PNAME[p]}</button>)}</div>
        {ai.provider && (
          <>
            {ai.provider === "gemini" && <p className="mt-3 rounded-2xl bg-paper p-4 text-[0.98rem]">キーの作り方：Googleの「AI Studio」（aistudio.google.com）を開き、Googleアカウントでログインして「APIキーを作成」を押します。できたキー（AIza…）をコピーして、下に貼り付けます。</p>}
            <label className="mt-3 block text-[0.95rem] font-bold">APIキー
              <span className="mt-1 flex gap-2"><input type={show ? "text" : "password"} autoComplete="off" value={ai.key} onChange={(e) => saveAi({ ...ai, key: e.target.value.trim() })} placeholder="ここに貼り付け" className="field num" />
                <button type="button" onClick={() => setShow(!show)} className="btn btn-sub min-h-[3rem] px-3" aria-label={show ? "キーを隠す" : "キーを表示"}>{show ? <EyeOff size={20} /> : <Eye size={20} />}</button></span></label>
            <label className="mt-3 block text-[0.95rem] font-bold">モデル（ふつうは変えなくて大丈夫）<input value={ai.model} placeholder={MODELS[ai.provider]} onChange={(e) => saveAi({ ...ai, model: e.target.value.trim() })} className="field num mt-1 max-w-[20rem]" /></label>
            <button type="button" onClick={() => { saveAi({ provider: "", key: "", model: "" }); toast("AIの設定を消しました"); }} className="btn btn-sub mt-3">AIの設定を消す</button>
          </>
        )}
      </section>

      <section className={sec} aria-labelledby="bk">
        <h2 id="bk" className="text-[1.3rem] font-bold">バックアップ（大切です）</h2>
        <p className="mt-1 text-[1rem] text-sub">データはこの端末の中だけにあります。端末をなくしたり、ブラウザのデータを消したりすると、帳簿も消えます。<b>月に1回</b>、ファイルに書き出しておきましょう。帳簿は7年間の保存が必要です。</p>
        <label className="mt-3 block text-[0.95rem] font-bold">合言葉（6文字以上・ファイルを開くときに使います）<input type="password" value={pass} onChange={(e) => setPass(e.target.value)} autoComplete="new-password" className="field mt-1 max-w-[20rem]" /></label>
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" onClick={exportFile} className="btn btn-main"><Download size={20} />バックアップを書き出す</button>
          <button type="button" onClick={() => file.current?.click()} className="btn btn-sub"><Upload size={20} />バックアップから戻す</button>
          <input ref={file} type="file" accept=".json,application/json" hidden onChange={(e) => { importFile(e.target.files?.[0]); e.target.value = ""; }} />
        </div>
      </section>

      <section className={sec} aria-labelledby="demo">
        <h2 id="demo" className="text-[1.3rem] font-bold">デモ</h2>
        <button type="button" onClick={async () => { if (await askConfirm({ title: "デモを最初の状態に戻しますか？", body: "取りこんだ明細や、変えた設定は消えます。", ok: "戻す", danger: true })) { resetDemo(); toast("最初の状態に戻しました"); } }} className="btn btn-sub mt-3"><RotateCcw size={20} />最初の状態に戻す</button>
      </section>
    </>
  );
}

export default function Page() { return <Shell><Ready><Settings /></Ready></Shell>; }
