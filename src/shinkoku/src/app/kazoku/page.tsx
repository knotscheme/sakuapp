"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2, Eye, HeartHandshake, Inbox, Loader2, Lock, Send, UserRound } from "lucide-react";
import Shell from "@/components/Shell";
import Ready from "@/components/Ready";
import Help from "@/components/Help";
import SendLink from "@/components/SendLink";
import { toast } from "@/components/Confirm";
import { PERSONAL, acc } from "@/lib/accounts";
import { compute, consumption, man, yen } from "@/lib/books";
import { DEADLINES } from "@/lib/rules2026";
import { askUrl, pack, unpack, type Ask, type Reply } from "@/lib/share";
import { editEntry, getState, uid, useStore } from "@/lib/store";

const TODAY = "2026-11-17";

function ReplyView({ r, onDone }: { r: Reply; onDone: () => void }) {
  const s = useStore();
  const rows = r.answers.map((a) => ({ a, e: s.entries.find((x) => x.id === a.id) })).filter((x) => x.e);
  const fresh = rows.filter((x) => x.e!.status === "check");
  const apply = () => {
    for (const { a, e } of fresh) {
      if (!e) continue;
      if (a.ask) { editEntry(e.id, { note: `${r.by}さん：${a.note || "本人に聞きたい"}` }, `${r.by}さんから「本人に聞きたい」とメモが届きました`); continue; }
      const income = e.debit === "bank" && acc(e.credit).kind !== "expense";
      const personal = a.acc === "ownerOut" || a.acc === "ownerIn";
      editEntry(e.id, income ? { credit: a.acc, status: "ok", note: a.note ? `${r.by}さん：${a.note}` : undefined } : { debit: a.acc, bizPct: personal ? 0 : a.pct, personal: personal ? (a.per as typeof e.personal) || "living" : "", status: "ok", taxRate: personal || a.acc === "rent" ? 0 : e.taxRate, note: a.note ? `${r.by}さん：${a.note}` : undefined }, `${r.by}さんが確認しました：${acc(a.acc).plain}`);
    }
    toast("家族の確認を、帳簿に入れました");
    onDone();
  };
  return (
    <section className="card mb-6 border-ok p-5 sm:p-6" aria-labelledby="rp">
      <h2 id="rp" className="flex items-center gap-2 text-[1.35rem] font-bold"><Inbox size={26} className="text-ok" />{r.by}さんから返事が届きました</h2>
      <p className="mt-1 text-[1rem] text-sub">{new Date(r.at).toLocaleString("ja-JP", { month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}・{r.answers.length}件</p>
      <ul className="mt-4 space-y-2">
        {rows.map(({ a, e }) => (
          <li key={a.id} className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-paper px-4 py-3">
            <span className="min-w-0"><b className="block text-[1.02rem]">{e!.memo || e!.partner}</b><span className="text-[0.92rem] text-sub">{a.ask ? `本人に聞きたい${a.note ? `：「${a.note}」` : ""}` : `${acc(a.acc).plain}${a.acc !== "ownerOut" && a.pct < 100 ? `（仕事${a.pct}%）` : ""}${a.acc === "ownerOut" && a.per ? `・${PERSONAL.find((p) => p.id === a.per)?.label ?? ""}` : ""}${a.note ? `・メモ「${a.note}」` : ""}`}</span></span>
            <b className="num">{yen(e!.amount)}</b>
          </li>
        ))}
      </ul>
      {fresh.length > 0 ? (
        <div className="mt-5 flex flex-wrap gap-2">
          <button type="button" onClick={apply} className="btn btn-main min-h-[3.6rem] flex-1 text-[1.1rem]"><CheckCircle2 size={22} />この内容で帳簿に入れる</button>
          <button type="button" onClick={onDone} className="btn btn-sub min-h-[3.6rem]">入れない</button>
        </div>
      ) : <p className="mt-4 font-bold text-ok">この返事は、もう帳簿に入っています。</p>}
      <p className="mt-3 text-[0.9rem] text-sub">※入れたあとも「帳簿を見る」から直せます。だれが確認したかは記録に残ります。</p>
    </section>
  );
}

function Kazoku() {
  const s = useStore();
  const pending = s.entries.filter((e) => e.status === "check" && !e.voided);
  const [reply, setReply] = useState<Reply | null>(null);
  const [err, setErr] = useState("");
  const [link, setLink] = useState("");
  const [busy, setBusy] = useState(false);
  // 返事のリンクを開いたとき（このページを開いたままでも、リンクの「#」が変われば読みこむ）
  useEffect(() => {
    const read = () => {
      const h = location.hash.match(/r=(.+)$/);
      if (h) unpack<Reply>(h[1]).then((r) => { if (r.kind === "reply") { setErr(""); setReply(r); window.scrollTo({ top: 0 }); } }).catch((e) => setErr(e.message));
    };
    read();
    addEventListener("hashchange", read);
    return () => removeEventListener("hashchange", read);
  }, []);
  const clearHash = () => { setReply(null); history.replaceState(null, "", location.pathname); };

  async function make() {
    setBusy(true);
    const st = getState(), c = compute(st, { project: true }), ct = consumption(st, { project: true });
    const ctax = st.profile.ctax === "twoWari" ? ct.twoWari.total : st.profile.ctax === "simple" ? ct.simple.total : st.profile.ctax === "general" ? ct.general.total : 0;
    const next = DEADLINES.find((d) => d.date >= TODAY);
    const ask: Ask = {
      v: 1, kind: "ask", id: uid(), from: st.profile.name, at: new Date().toISOString(),
      items: pending.map((e) => { const inc = e.debit === "bank" && acc(e.credit).kind !== "expense" && e.credit !== "bank"; return { id: e.id, d: e.date, a: e.amount, m: e.memo, p: e.partner, inc, acc: inc ? e.credit : e.debit, pct: e.bizPct, per: e.personal }; }),
      sum: { sales: c.sales + c.miscIncome, expenses: c.expenses, tax: c.incomeTax + c.resident + c.bizTax + ctax, next: next ? `${next.label}（${new Date(next.date).toLocaleDateString("ja-JP", { month: "long", day: "numeric" })}）` : "" },
    };
    setLink(askUrl(await pack(ask)));
    setBusy(false);
  }
  const until = new Date(Date.now() + 14 * 86400000).toLocaleDateString("ja-JP", { month: "long", day: "numeric" });

  return (
    <>
      <Help title="家族と一緒に" say="離れて住む家族に、明細の確認を手伝ってもらえます。お願いのリンクをLINEやメールで送ると、家族が自分のスマホで答えて、返事のリンクを送り返してくれます。データはこのアプリのサーバーには送られません。">
        離れて住む家族に、明細の確認を<b>手伝ってもらえます</b>。お願いのリンクを LINE やメールで送ると、家族が自分のスマホで答えて、<b>返事のリンク</b>を送り返してくれます。
      </Help>
      {err && <p role="alert" className="mb-5 rounded-2xl border-2 border-ng bg-ng-2 p-4 font-bold text-ng">{err}</p>}
      {reply && <ReplyView r={reply} onDone={clearHash} />}

      <section className="card p-5 sm:p-6" aria-labelledby="ask">
        <h2 id="ask" className="flex items-center gap-2 text-[1.35rem] font-bold"><HeartHandshake size={26} className="text-ok" />家族にお願いする</h2>
        {pending.length === 0 ? (
          <p className="mt-3 text-[1.05rem]">いま、確認待ちの明細はありません。<Link href="/torikomi/" className="font-bold underline">明細を取りこむ</Link>と、お願いできるようになります。</p>
        ) : !link ? (
          <>
            <p className="mt-3 text-[1.05rem]">確認待ちの明細 <b>{pending.length}件</b> と、今年の数字（売上・経費・税金の目安）を、家族に見せてお願いします。</p>
            <button type="button" disabled={busy} onClick={make} className="btn btn-main mt-4 min-h-[3.6rem] w-full text-[1.1rem] sm:w-auto">{busy ? <Loader2 size={22} className="animate-spin" /> : <Send size={22} />}お願いのリンクを作る</button>
          </>
        ) : (
          <>
            <p className="mt-3 rounded-2xl bg-ok-2 p-4 text-[1.05rem]"><b>リンクができました。</b>送り先をえらんでください（{until}まで開けます）。</p>
            <div className="mt-3"><SendLink url={link} subject="【じぶん申告】明細の確認のお願い" text={`【じぶん申告】${s.profile.name}です。確定申告の明細の確認を、手伝ってもらえますか（${pending.length}件）。下のリンクを開くと見られます（${until}まで）。`} /></div>
            <button type="button" onClick={() => setLink("")} className="mt-3 text-[0.95rem] underline">作り直す</button>
          </>
        )}
        <p className="mt-4 flex gap-2 text-[0.92rem] leading-[1.8] text-sub"><Lock size={18} className="mt-1 shrink-0" /><span>リンクの中身は暗号化しています。このアプリのサーバーには送られません。ただし、<b>リンクを知っている人は見られる</b>ので、家族だけに送ってください。</span></p>
      </section>

      <section className="card mt-5 p-5 sm:p-6" aria-labelledby="how">
        <h2 id="how" className="text-[1.35rem] font-bold">しくみ</h2>
        <ol className="mt-4 grid gap-3 md:grid-cols-3">
          {[
            { i: Send, t: "お願いのリンクを送る", b: "このページで作ったリンクを、LINE やメールで家族に送ります。" },
            { i: UserRound, t: "家族が答える", b: "家族は自分のスマホで開き、「何に使ったお金か」をえらびます。わからない物は「本人に聞く」にできます。" },
            { i: Inbox, t: "返事のリンクを開く", b: "家族から届いた返事のリンクを開くと、このページに表示されます。「帳簿に入れる」を押せば完了です。" },
          ].map(({ i: I, t, b }, k) => (
            <li key={t} className="rounded-2xl bg-paper p-4"><span className="flex items-center gap-2 text-[1.08rem] font-bold"><span className="grid h-8 w-8 place-items-center rounded-full bg-ink text-[0.9rem] text-white">{k + 1}</span><I size={22} className="text-ok" />{t}</span><p className="mt-2 text-[0.98rem] leading-[1.85]">{b}</p></li>
          ))}
        </ol>
        <p className="mt-4 flex gap-2 text-[0.95rem] text-sub"><Eye size={20} className="mt-0.5 shrink-0" />家族は、今年の売上・経費・税金の目安と、次の期限も見られます（見守りにも使えます）。帳簿を直接書きかえることはできません。</p>
      </section>
      <div className="mt-6"><Link href="/kakunin/" className="btn btn-sub">自分で確認する<ArrowRight size={20} /></Link></div>
    </>
  );
}

export default function Page() { return <Shell><Ready><Kazoku /></Ready></Shell>; }
