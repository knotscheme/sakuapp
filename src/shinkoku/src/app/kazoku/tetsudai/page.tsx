"use client";

import { useEffect, useState } from "react";
import { CalendarClock, CheckCircle2, HelpCircle, Loader2, Lock, Send } from "lucide-react";
import AccIcon from "@/components/AccIcon";
import SendLink from "@/components/SendLink";
import { EXPENSES, PERSONAL } from "@/lib/accounts";
import { man, yen } from "@/lib/books";
import { pack, replyUrl, unpack, type Answer, type Ask } from "@/lib/share";

// 家族が開くページ。データはこの端末にも保存しない（返事のリンクを作るだけ）
const INCOME = [{ id: "sales", plain: "仕事の売上" }, { id: "misc_income", plain: "そのほかの仕事の収入" }, { id: "ownerIn", plain: "仕事と関係ないお金" }];
const OUT = [...EXPENSES.map((a) => ({ id: a.id, plain: a.plain })), { id: "ownerOut", plain: "仕事以外（生活費・保険・年金など）" }];

export default function Tetsudai() {
  const [ask, setAsk] = useState<Ask | null>(null);
  const [err, setErr] = useState("");
  const [ans, setAns] = useState<Record<string, Answer>>({});
  const [by, setBy] = useState("");
  const [link, setLink] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    const h = location.hash.match(/p=(.+)$/);
    if (!h) { setErr("お願いのリンクから開いてください"); return; }
    unpack<Ask>(h[1]).then((a) => {
      if (a.kind !== "ask") throw new Error("お願いのリンクではありません");
      setAsk(a);
      setAns(Object.fromEntries(a.items.map((i) => [i.id, { id: i.id, acc: i.acc, pct: i.pct || 100, per: i.per, ask: false, note: "" }])));
    }).catch((e) => setErr(e.message));
  }, []);
  const set = (id: string, p: Partial<Answer>) => setAns((x) => ({ ...x, [id]: { ...x[id], ...p } }));

  async function make() {
    if (!ask) return;
    if (!by.trim()) { setErr("あなたのお名前を入れてください"); return; }
    setErr(""); setBusy(true);
    setLink(replyUrl(await pack({ v: 1, kind: "reply", req: ask.id, by: by.trim(), at: new Date().toISOString(), answers: Object.values(ans) })));
    setBusy(false);
  }

  return (
    <div className="min-h-screen">
      <header className="border-b-2 border-line bg-paper px-4 py-3">
        <div className="mx-auto flex max-w-[760px] items-center gap-2.5"><span className="grid h-10 w-10 place-items-center rounded-xl bg-ok text-[1.2rem] font-bold text-white">申</span><b className="text-[1.15rem]">じぶん申告</b><span className="ml-auto rounded-full bg-white px-3 py-1 text-[0.8rem] text-sub ring-1 ring-line">家族のお手伝い・デモ版</span></div>
      </header>
      <main className="mx-auto max-w-[760px] px-4 pb-24 pt-6">
        {err && <p role="alert" className="mb-5 rounded-2xl border-2 border-ng bg-ng-2 p-4 font-bold text-ng">{err}</p>}
        {!ask && !err && <p className="py-16 text-center text-sub"><Loader2 size={24} className="mx-auto mb-2 animate-spin" />ひらいています…</p>}
        {ask && (
          <>
            <h1 className="text-[1.6rem] font-bold leading-[1.5]">{ask.from}さんからのお願い</h1>
            <p className="mt-2 text-[1.02rem] leading-[1.9] text-sub">確定申告の明細 <b className="text-ink">{ask.items.length}件</b> の確認を、手伝ってください。「何に使ったお金か」をえらんで、いちばん下で返事のリンクを送ります。わからない物は「本人に聞く」にしてください。</p>

            <section className="card mt-5 grid gap-3 p-5 sm:grid-cols-3" aria-label="今年の数字">
              <div><p className="text-[0.9rem] text-sub">今年の売上（見込み）</p><p className="num text-[1.4rem] font-bold">{man(ask.sum.sales)}</p></div>
              <div><p className="text-[0.9rem] text-sub">経費（見込み）</p><p className="num text-[1.4rem] font-bold">{man(ask.sum.expenses)}</p></div>
              <div><p className="text-[0.9rem] text-sub">税金の目安</p><p className="num text-[1.4rem] font-bold text-ok">{man(ask.sum.tax)}</p></div>
              {ask.sum.next && <p className="flex items-center gap-2 text-[0.95rem] sm:col-span-3"><CalendarClock size={18} className="shrink-0 text-ok" />次の期限：{ask.sum.next}</p>}
            </section>

            <ol className="mt-6 space-y-3">
              {ask.items.map((it, k) => {
                const a = ans[it.id];
                const opts = it.inc ? INCOME : OUT;
                return (
                  <li key={it.id} className={`card p-4 sm:p-5 ${a.ask ? "border-warn" : ""}`}>
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                      <p className="text-[0.9rem] text-sub">{k + 1}．{new Date(it.d).toLocaleDateString("ja-JP", { month: "long", day: "numeric" })}</p>
                      <b className={`num text-[1.3rem] ${it.inc ? "text-ok" : ""}`}>{it.inc ? "＋" : "−"}{yen(it.a)}</b>
                    </div>
                    <p className="mt-1 text-[1.12rem] font-bold">{it.m || it.p}</p>
                    {!a.ask && (
                      <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_auto]">
                        <label className="flex items-center gap-2"><AccIcon id={a.acc} /><select value={a.acc} onChange={(e) => set(it.id, { acc: e.target.value })} className="field" aria-label="使い道">{opts.map((o) => <option key={o.id} value={o.id}>{o.plain}</option>)}</select></label>
                        {!it.inc && a.acc !== "ownerOut" && <select value={a.pct} onChange={(e) => set(it.id, { pct: Number(e.target.value) })} className="field sm:w-[9.5rem]" aria-label="仕事で使った割合">{[100, 80, 50, 30].map((p) => <option key={p} value={p}>{p === 100 ? "全部仕事" : `仕事 ${p}%`}</option>)}</select>}
                        {a.acc === "ownerOut" && <select value={a.per} onChange={(e) => set(it.id, { per: e.target.value })} className="field sm:w-[12rem]" aria-label="どんなお金か">{PERSONAL.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}</select>}
                      </div>
                    )}
                    <label className="mt-3 flex cursor-pointer items-center gap-2 text-[1rem] font-bold"><input type="checkbox" checked={a.ask} onChange={(e) => set(it.id, { ask: e.target.checked })} className="h-6 w-6 accent-[var(--color-warn)]" /><HelpCircle size={18} className="text-warn" />わからない・本人に聞く</label>
                    <input value={a.note} onChange={(e) => set(it.id, { note: e.target.value })} placeholder={a.ask ? "聞きたいこと（例：これは仕事で買った物？）" : "メモ（なくても大丈夫）"} className="field mt-2 text-[0.98rem]" />
                  </li>
                );
              })}
            </ol>

            <section className="card mt-6 p-5" aria-labelledby="sd">
              <h2 id="sd" className="flex items-center gap-2 text-[1.3rem] font-bold"><Send size={22} className="text-ok" />{ask.from}さんに返事を送る</h2>
              {!link ? (
                <>
                  <label className="mt-3 block text-[1rem] font-bold">あなたのお名前<input value={by} onChange={(e) => setBy(e.target.value)} placeholder="例）長女の花子" className="field mt-1" /></label>
                  <button type="button" disabled={busy} onClick={make} className="btn btn-main mt-4 min-h-[3.6rem] w-full text-[1.1rem]">{busy ? <Loader2 size={22} className="animate-spin" /> : <CheckCircle2 size={22} />}返事のリンクを作る</button>
                </>
              ) : (
                <>
                  <p className="mt-3 rounded-2xl bg-ok-2 p-4 text-[1.02rem]"><b>返事のリンクができました。</b>{ask.from}さんに送ってください。{ask.from}さんがリンクを開くと、帳簿に入れられます。</p>
                  <div className="mt-3"><SendLink url={link} subject="【じぶん申告】確認の返事" text={`【じぶん申告】${by.trim()}です。明細の確認をしました。下のリンクを開いて「帳簿に入れる」を押してください。`} /></div>
                </>
              )}
            </section>
            <p className="mt-4 flex gap-2 text-[0.9rem] leading-[1.8] text-sub"><Lock size={18} className="mt-1 shrink-0" />このページの内容は暗号化されたリンクの中にだけあり、どこにも保存されません。</p>
          </>
        )}
      </main>
    </div>
  );
}
