"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Check, CheckCircle2, Info, SkipForward, Trash2, X } from "lucide-react";
import Shell from "@/components/Shell";
import Ready from "@/components/Ready";
import Help from "@/components/Help";
import { askConfirm, toast } from "@/components/Confirm";
import { EXPENSES, PERSONAL, acc, type PersonalTag } from "@/lib/accounts";
import { yen } from "@/lib/books";
import { norm } from "@/lib/importer";
import { validT } from "@/lib/seed";
import { editEntry, learn, useStore, voidEntry, type Entry } from "@/lib/store";

const PCTS = [100, 80, 50, 30];
const ruleKey = (e: Entry) => norm(e.memo || e.partner).split(" ")[0].replace(/[0-9０-９/.,-]+$/, "").slice(0, 12);

function Card({ e, total, onDone }: { e: Entry; total: number; onDone: () => void }) {
  const income = e.debit === "bank" && e.credit !== "bank";
  const money = income ? e.debit : e.credit;
  const [account, setAccount] = useState(income ? e.credit : e.debit);
  const [personal, setPersonal] = useState<PersonalTag>(e.personal);
  const [pct, setPct] = useState(e.bizPct);
  const [partner, setPartner] = useState(e.partner);
  const [invoice, setInvoice] = useState(e.invoice);
  const [remember, setRemember] = useState(e.source === "bank" || e.source === "card");
  const [more, setMore] = useState(false);
  const isPersonal = account === "ownerOut" || account === "ownerIn";
  const img = e.receipt ? (() => { try { return localStorage.getItem(`jbs-rc-${e.receipt}`); } catch { return null; } })() : null;
  const why = e.history[0]?.what.split("：")[1];
  const tOk = invoice ? validT(invoice) : null;

  const ok = () => {
    const patch: Partial<Entry> = income
      ? { credit: account, debit: money, personal: "", bizPct: 100 }
      : { debit: account, credit: money, personal: isPersonal ? personal || "living" : "", bizPct: isPersonal ? 0 : pct };
    patch.partner = partner; patch.invoice = invoice.trim().toUpperCase(); patch.status = "ok";
    if (account === "rent" || isPersonal || account === "taxes") patch.taxRate = 0;
    editEntry(e.id, patch, `確認しました：${acc(account).plain}${!isPersonal && pct < 100 ? `（仕事の分 ${pct}%）` : ""}`);
    const key = ruleKey(e);
    if (remember && key.length >= 2) learn({ key, account, bizPct: isPersonal ? 0 : pct, personal: isPersonal ? personal || "living" : "", taxRate: patch.taxRate ?? e.taxRate, partner, invoice: invoice.trim().toUpperCase() });
    onDone();
  };

  const opt = (id: string, icon: string, label: string) => (
    <button key={id} type="button" aria-pressed={account === id} onClick={() => { setAccount(id); if (id === "ownerOut" && !personal) setPersonal("living"); }}
      className={`flex min-h-[3.6rem] items-center gap-3 rounded-2xl border-2 px-4 py-2 text-left text-[1rem] font-bold transition ${account === id ? "border-ok bg-ok-2 ring-2 ring-ok" : "border-line bg-white hover:border-ink"}`}>
      <span className="text-[1.4rem]" aria-hidden>{icon}</span><span className="flex-1">{label}</span>{account === id && <Check size={22} className="text-ok" />}
    </button>
  );
  const top = ["travel", "comm", "supplies", "meeting", "software", "books", "utility", "rent"];
  const shown = more ? EXPENSES : EXPENSES.filter((a) => top.includes(a.id) || a.id === account);

  return (
    <section className="card fade-in p-5 sm:p-7" aria-label="確認する明細">
      <p className="text-[1rem] font-bold text-sub">確認待ち のこり{total}件</p>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-4 rounded-2xl bg-paper p-5">
        <div>
          <p className="text-[1rem] text-sub">{new Date(e.date).toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric", weekday: "short" })}・{e.source === "bank" ? "銀行" : e.source === "card" ? "カード" : e.source === "receipt" ? "レシート" : "手入力"}</p>
          <p className="mt-1 text-[1.3rem] font-bold">{e.memo || e.partner}</p>
        </div>
        <p className={`num text-[2rem] font-bold ${income ? "text-ok" : ""}`}>{income ? "＋" : "−"}{yen(e.amount)}</p>
      </div>
      {img && <img src={img} alt="レシートの写真" className="mt-3 max-h-64 rounded-xl border-2 border-line" />}
      {why && <p className="mt-3 flex items-start gap-2 text-[0.95rem] text-sub"><Info size={18} className="mt-1 shrink-0" />自動で考えたこと：{why}</p>}

      <h2 className="mt-6 text-[1.25rem] font-bold">{income ? "何のお金が入ってきましたか？" : "何に使ったお金ですか？"}</h2>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {income ? <>{opt("sales", "💰", "仕事の売上")}{opt("misc_income", "🪙", "そのほかの仕事の収入")}{opt("ownerIn", "👛", "仕事と関係ないお金（自分のお金を入れた など）")}</>
          : <>{shown.map((a) => opt(a.id, a.icon, a.plain))}{opt("ownerOut", "🏠", "仕事以外（生活費・保険・年金など）")}</>}
      </div>
      {!income && !more && <button type="button" onClick={() => setMore(true)} className="mt-2 text-[1rem] font-bold underline underline-offset-4">ほかの使い道を見る</button>}

      {account === "ownerOut" && (
        <fieldset className="mt-5">
          <legend className="text-[1.1rem] font-bold">それは、どんなお金ですか？</legend>
          <p className="text-[0.95rem] text-sub">確定申告で「控除」として使えるものがあります。</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {PERSONAL.map((p) => (
              <button key={p.id} type="button" aria-pressed={personal === p.id} onClick={() => setPersonal(p.id)} className={`rounded-2xl border-2 px-4 py-2.5 text-left ${personal === p.id ? "border-ok bg-ok-2 ring-2 ring-ok" : "border-line bg-white"}`}>
                <b className="block text-[1rem]">{p.label}</b><span className="text-[0.85rem] text-sub">{p.hint}</span>
              </button>
            ))}
          </div>
        </fieldset>
      )}

      {!income && !isPersonal && (
        <fieldset className="mt-5">
          <legend className="text-[1.1rem] font-bold">仕事で使った割合は？</legend>
          <p className="text-[0.95rem] text-sub">家でも使うもの（スマホ・電気・家賃など）は、仕事の分だけが経費になります。</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {PCTS.map((p) => <button key={p} type="button" aria-pressed={pct === p} onClick={() => setPct(p)} className={`btn min-h-[3rem] px-5 ${pct === p ? "btn-ink" : "btn-sub"}`}>{p === 100 ? "全部仕事" : `${p}%`}</button>)}
            <label className="flex items-center gap-2 text-[1rem]">ほかの割合<input type="number" min={1} max={100} value={pct} onChange={(ev) => setPct(Math.min(100, Math.max(1, Number(ev.target.value) || 1)))} className="field num w-24" />%</label>
          </div>
          {pct < 100 && <p className="mt-2 text-[1rem]">経費になるのは <b className="num">{yen(Math.floor(e.amount * pct / 100))}</b> です。</p>}
        </fieldset>
      )}

      <details className="mt-5 rounded-2xl border-2 border-line p-4">
        <summary className="cursor-pointer text-[1rem] font-bold">お店の名前・インボイスの登録番号を直す</summary>
        <label className="mt-3 block text-[0.95rem] font-bold">お店・取引先の名前<input value={partner} onChange={(ev) => setPartner(ev.target.value)} className="field mt-1" /></label>
        <label className="mt-3 block text-[0.95rem] font-bold">登録番号（レシートの「T」から始まる番号）<input value={invoice} onChange={(ev) => setInvoice(ev.target.value)} placeholder="T1234567890123" className="field num mt-1" /></label>
        {tOk === true && <p className="mt-1 flex items-center gap-1 text-[0.95rem] font-bold text-ok"><CheckCircle2 size={18} />番号の形は正しいです</p>}
        {tOk === false && <p className="mt-1 flex items-center gap-1 text-[0.95rem] font-bold text-ng"><X size={18} />番号が正しくないようです。もう一度見てください</p>}
        <p className="mt-2 text-[0.85rem] text-sub">※本当に登録されているかは、国税庁の「インボイス制度 適格請求書発行事業者公表サイト」で確かめられます。</p>
      </details>

      {(e.source === "bank" || e.source === "card") && (
        <label className="mt-5 flex cursor-pointer items-center gap-3 text-[1rem] font-bold">
          <input type="checkbox" checked={remember} onChange={(ev) => setRemember(ev.target.checked)} className="h-6 w-6 accent-[var(--color-ok)]" />次から、同じ明細は自動でこの内容にする
        </label>
      )}

      <div className="mt-6 flex flex-wrap gap-2">
        <button type="button" onClick={ok} className="btn btn-main min-h-[3.6rem] flex-1 text-[1.15rem]"><Check size={24} />これでOK</button>
        <button type="button" onClick={onDone} className="btn btn-sub min-h-[3.6rem]"><SkipForward size={20} />あとで</button>
        <button type="button" onClick={async () => { if (await askConfirm({ title: "この明細を帳簿に入れないで、取り消しますか？", body: "取り消した記録は帳簿に残ります（あとから見られます）。", ok: "取り消す", danger: true })) { voidEntry(e.id); toast("取り消しました"); onDone(); } }} className="btn btn-sub min-h-[3.6rem] text-ng"><Trash2 size={20} />入れない</button>
      </div>
    </section>
  );
}

function Kakunin() {
  const s = useStore();
  const list = s.entries.filter((e) => e.status === "check" && !e.voided).sort((a, b) => a.date.localeCompare(b.date));
  const [skip, setSkip] = useState<string[]>([]);
  const queue = [...list.filter((e) => !skip.includes(e.id)), ...list.filter((e) => skip.includes(e.id))];
  const cur = queue[0];
  useEffect(() => { if (cur) window.scrollTo({ top: 0, behavior: "smooth" }); }, [cur?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Help title="2. 内容を確認する" say="取りこんだ明細を、1件ずつ確かめます。何に使ったお金かをえらんで、これでオーケーを押すだけです。家でも使うものは、仕事で使った割合もえらびます。">
        取りこんだ明細を<b>1件ずつ</b>確かめます。「何に使ったお金か」をえらんで<b>「これでOK」</b>を押すだけです。<br />家でも使うもの（スマホ・電気など）は、仕事で使った割合もえらびます。
      </Help>
      {cur ? (
        <Card key={cur.id} e={cur} total={list.length} onDone={() => setSkip((x) => (x.includes(cur.id) ? x.filter((y) => y !== cur.id).concat(cur.id) : x.concat(cur.id)))} />
      ) : (
        <div className="card p-8 text-center">
          <CheckCircle2 size={56} className="mx-auto text-ok" />
          <h2 className="mt-3 text-[1.5rem] font-bold">確認待ちは、ありません</h2>
          <p className="mt-2 text-[1.05rem] text-sub">おつかれさまでした。帳簿はできあがっています。</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/chobo/" className="btn btn-main">帳簿を見る<ArrowRight size={20} /></Link>
            <Link href="/torikomi/" className="btn btn-sub">明細を取りこむ</Link>
          </div>
        </div>
      )}
    </>
  );
}

export default function Page() { return <Shell><Ready><Kakunin /></Ready></Shell>; }
