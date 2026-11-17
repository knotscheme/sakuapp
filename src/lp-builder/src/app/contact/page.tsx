"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Copy, Mail } from "lucide-react";
import Header from "@/components/Header";
import { toast } from "@/components/Confirm";

// LP BUILDER の制作相談（サクアプとは別のサービス）。送信はメールアプリで行う（サーバー不要・費用0円）
// 宛先を変えるときは、ここだけを書きかえる
const TO = "kazuyascheme@gmail.com";

const KINDS = ["LP制作をまるごと任せたい", "型を使わずオリジナルで作りたい", "LP BUILDER で作ったLPを手直ししたい", "その他・まだ決まっていない"];
const WHEN = ["できるだけ早く", "1か月以内", "2〜3か月以内", "未定"];
const FROM: Record<string, string> = { top: "トップページ", works: "作品例", preview: "作品例のプレビュー", build: "型えらび", download: "ダウンロード画面" };

export default function Contact() {
  const [kind, setKind] = useState("");
  const [name, setName] = useState("");
  const [shop, setShop] = useState("");
  const [what, setWhat] = useState("");
  const [when, setWhen] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState(false);
  const [sent, setSent] = useState(false);
  const [ref, setRef] = useState("");
  useEffect(() => { setRef(new URLSearchParams(location.search).get("ref") ?? ""); }, []);

  const body = useMemo(() => [
    "【LP BUILDER 制作のご相談】",
    `■ご相談の内容：${kind || "（未選択）"}`,
    `■お名前：${name.trim() || "（未入力）"}`,
    shop.trim() && `■お店・会社・ブランド名：${shop.trim()}`,
    what.trim() && `■売りたいもの・LPの目的：${what.trim()}`,
    when && `■希望の時期：${when}`,
    msg.trim() && `■そのほか・参考にしたいLPなど\n${msg.trim()}`,
    FROM[ref] && `（${FROM[ref]}から）`,
  ].filter(Boolean).join("\n"), [kind, name, shop, what, when, msg, ref]);

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kind || !name.trim()) { setErr(true); return; }
    setErr(false);
    location.href = `mailto:${TO}?subject=${encodeURIComponent("【LP BUILDER】制作のご相談")}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };
  const copy = async () => {
    try { await navigator.clipboard.writeText(`宛先：${TO}\n件名：【LP BUILDER】制作のご相談\n\n${body}`); toast("コピーしました"); } catch { toast("コピーできませんでした"); }
  };
  const pill = (on: boolean) => `tap rounded-xl px-3.5 py-2.5 text-left text-[13px] ring-1 transition ${on ? "bg-ink text-white ring-ink" : "bg-white ring-line hover:ring-ink"}`;

  return (
    <>
      <Header />
      <main className="mx-auto max-w-[680px] px-4 py-10 sm:px-6 sm:py-14">
        <p className="text-center text-[12px] tracking-[.22em] text-accent">ORDER MADE</p>
        <h1 className="mt-2 text-center text-[24px] font-bold leading-[1.5] sm:text-[30px]"><span className="inline-block">LP制作の</span><span className="inline-block">ご相談</span></h1>
        <p className="mt-3 text-center text-[14px] leading-[1.95] text-mute"><span className="inline-block">全部おまかせ・一からオリジナルの制作を</span><span className="inline-block">承ります。</span><span className="inline-block">相談・お見積もりは無料です。</span></p>

        {sent ? (
          <div className="card mt-8 p-6 text-center">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#e7f5ee] text-ok"><Check size={22} /></span>
            <h2 className="mt-4 text-[17px] font-bold">メールアプリを開きました</h2>
            <p className="mt-2 text-[13.5px] leading-[1.9] text-ink/80">入力した内容が入った状態で開いています。そのまま<b>送信</b>してください。<br />開かなかった場合は、内容をコピーして <b className="select-all">{TO}</b> へ送ってください。</p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <button type="button" onClick={copy} className="btn btn-ink px-5 py-2.5 text-[13px]"><Copy size={14} />内容をコピー</button>
              <button type="button" onClick={() => setSent(false)} className="btn btn-line px-5 py-2.5 text-[13px]">入力に戻る</button>
            </div>
          </div>
        ) : (
          <form onSubmit={send} className="card mt-8 space-y-6 p-5 sm:p-7" noValidate>
            <fieldset>
              <legend className="text-[14px] font-bold">ご相談の内容 <span className="ml-1 rounded bg-[#fde8e4] px-1.5 py-0.5 text-[10.5px] text-[#c8462f]">必須</span></legend>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">{KINDS.map((k) => <button key={k} type="button" aria-pressed={kind === k} onClick={() => setKind(k)} className={pill(kind === k)}>{k}</button>)}</div>
            </fieldset>
            <div>
              <label htmlFor="c-name" className="text-[14px] font-bold">お名前 <span className="ml-1 rounded bg-[#fde8e4] px-1.5 py-0.5 text-[10.5px] text-[#c8462f]">必須</span></label>
              <input id="c-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder="例）山田 花子" className="field mt-2" />
            </div>
            <div>
              <label htmlFor="c-shop" className="text-[14px] font-bold">お店・会社・ブランド名 <span className="ml-1 text-[11px] font-normal text-mute">任意</span></label>
              <input id="c-shop" value={shop} onChange={(e) => setShop(e.target.value)} className="field mt-2" />
            </div>
            <div>
              <label htmlFor="c-what" className="text-[14px] font-bold">売りたいもの・LPの目的 <span className="ml-1 text-[11px] font-normal text-mute">任意</span></label>
              <input id="c-what" value={what} onChange={(e) => setWhat(e.target.value)} placeholder="例）化粧水の定期購入を増やしたい" className="field mt-2" />
            </div>
            <fieldset>
              <legend className="text-[14px] font-bold">希望の時期 <span className="ml-1 text-[11px] font-normal text-mute">任意</span></legend>
              <div className="mt-3 flex flex-wrap gap-2">{WHEN.map((k) => <button key={k} type="button" aria-pressed={when === k} onClick={() => setWhen(when === k ? "" : k)} className={pill(when === k)}>{k}</button>)}</div>
            </fieldset>
            <div>
              <label htmlFor="c-msg" className="text-[14px] font-bold">そのほか・参考にしたいLPなど <span className="ml-1 text-[11px] font-normal text-mute">任意</span></label>
              <textarea id="c-msg" rows={4} value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="作品例のこの雰囲気で、など" className="field mt-2 resize-y leading-[1.8]" />
            </div>
            {err && (!kind || !name.trim()) && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-[13px] text-red-700">「ご相談の内容」と「お名前」を入れてください。</p>}
            <details className="rounded-xl bg-paper p-3 text-[12px]"><summary className="cursor-pointer text-mute">送る内容を確かめる</summary><pre className="mt-2 whitespace-pre-wrap font-sans leading-[1.8]">{body}</pre></details>
            <button type="submit" className="btn btn-accent w-full py-3.5 text-[15px]"><Mail size={17} />メールで送る</button>
            <p className="text-center text-[11.5px] leading-[1.8] text-mute">ボタンを押すと、入力した内容が入った状態でメールアプリが開きます。送信はメールアプリから行ってください。</p>
          </form>
        )}
      </main>
    </>
  );
}
