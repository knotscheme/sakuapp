"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { History, Pencil, Search, X } from "lucide-react";
import Shell from "@/components/Shell";
import Ready from "@/components/Ready";
import Help from "@/components/Help";
import { toast } from "@/components/Confirm";
import { acc } from "@/lib/accounts";
import AccIcon from "@/components/AccIcon";
import { balances, yen } from "@/lib/books";
import { validT } from "@/lib/seed";
import { editEntry, useStore, type Entry } from "@/lib/store";

const d = (s: string) => new Date(s).toLocaleDateString("ja-JP", { month: "numeric", day: "numeric" });

function Row({ e, onOpen }: { e: Entry; onOpen: () => void }) {
  const income = acc(e.credit).kind === "income";
  const use = income ? acc(e.credit) : acc(e.debit);
  return (
    <li>
      <button type="button" onClick={onOpen} className={`flex w-full items-center gap-3 border-b-2 border-line px-2 py-3.5 text-left hover:bg-[#fbfaf6] ${e.voided ? "opacity-50" : ""}`}>
        <span className="num w-14 shrink-0 text-[0.95rem] text-sub">{d(e.date)}</span>
        <AccIcon id={use.id} />
        <span className="min-w-0 flex-1"><b className={`block truncate text-[1rem] ${e.voided ? "line-through" : ""}`}>{e.partner || e.memo}</b><span className="block truncate text-[0.85rem] text-sub">{use.plain}{e.bizPct < 100 && e.bizPct > 0 ? `（仕事${e.bizPct}%）` : ""}{e.voided ? "・取り消し" : ""}{e.status === "check" ? "・確認待ち" : ""}</span></span>
        <b className={`num shrink-0 text-[1.05rem] ${income ? "text-ok" : ""}`}>{income ? "＋" : ""}{yen(e.amount)}</b>
      </button>
    </li>
  );
}

function Detail({ e, onClose }: { e: Entry; onClose: () => void }) {
  const img = e.receipt ? (() => { try { return localStorage.getItem(`jbs-rc-${e.receipt}`); } catch { return null; } })() : null;
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center bg-black/45 p-3" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label="明細のくわしい内容" className="fade-in max-h-[92vh] w-full max-w-[560px] overflow-y-auto rounded-3xl bg-white p-6" onClick={(ev) => ev.stopPropagation()}>
        <div className="flex items-start justify-between gap-3"><h2 className="text-[1.3rem] font-bold">{e.partner || e.memo}</h2><button type="button" onClick={onClose} className="btn btn-sub min-h-[2.8rem] px-3" aria-label="とじる"><X size={22} /></button></div>
        <dl className="mt-4 grid grid-cols-[7.5em_1fr] gap-y-2 text-[1rem]">
          <dt className="text-sub">日付</dt><dd>{new Date(e.date).toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" })}</dd>
          <dt className="text-sub">金額</dt><dd className="num font-bold">{yen(e.amount)}</dd>
          <dt className="text-sub">帳簿の書き方</dt><dd>{acc(e.debit).name} ／ {acc(e.credit).name}</dd>
          <dt className="text-sub">わかる言葉で</dt><dd>{acc(acc(e.credit).kind === "income" ? e.credit : e.debit).plain}</dd>
          {e.bizPct < 100 && e.bizPct > 0 && <><dt className="text-sub">仕事の割合</dt><dd>{e.bizPct}%（経費 {yen(Math.floor(e.amount * e.bizPct / 100))}）</dd></>}
          <dt className="text-sub">消費税</dt><dd>{e.taxRate ? `${e.taxRate}%` : "かからない"}</dd>
          <dt className="text-sub">登録番号</dt><dd className="num">{e.invoice ? `${e.invoice}${validT(e.invoice) ? "" : "（形が正しくありません）"}` : "なし"}</dd>
          <dt className="text-sub">メモ</dt><dd>{e.memo || "—"}</dd>
          {e.raw && <><dt className="text-sub">元の明細</dt><dd className="break-all text-[0.85rem]">{e.raw.split("|").slice(2, 3)}</dd></>}
        </dl>
        {img && <img src={img} alt="レシートの写真" className="mt-4 max-h-72 rounded-xl border-2 border-line" />}
        <h3 className="mt-5 flex items-center gap-2 text-[1.05rem] font-bold"><History size={20} />変更の記録</h3>
        <ol className="mt-2 space-y-1 text-[0.95rem]">{e.history.map((h, i) => <li key={i} className="rounded-lg bg-paper px-3 py-2"><span className="text-sub">{h.at}</span>　{h.what}</li>)}</ol>
        <p className="mt-2 text-[0.8rem] text-sub">※帳簿を直したときは、前の内容と直した日時が記録として残ります（電子帳簿保存法のため）。</p>
        {!e.voided && e.status === "ok" && (
          <button type="button" onClick={() => { editEntry(e.id, { status: "check" }, "直すために、確認待ちに戻しました"); toast("確認待ちに戻しました"); onClose(); }} className="btn btn-sub mt-5 w-full"><Pencil size={20} />この内容を直す</button>
        )}
      </div>
    </div>
  );
}

function Chobo() {
  const s = useStore();
  const [tab, setTab] = useState<"list" | "acc">("list");
  const [q, setQ] = useState({ text: "", from: "", to: "", min: "", max: "" });
  const [open, setOpen] = useState<Entry | null>(null);
  const [accId, setAccId] = useState("");
  const list = useMemo(() => {
    const t = q.text.trim().normalize("NFKC").toLowerCase();
    const min = Number(q.min) || 0, max = Number(q.max) || Infinity;
    return s.entries.filter((e) =>
      (!t || `${e.partner} ${e.memo} ${acc(e.debit).plain} ${acc(e.credit).plain}`.normalize("NFKC").toLowerCase().includes(t)) &&
      (!q.from || e.date >= q.from) && (!q.to || e.date <= q.to) && e.amount >= min && e.amount <= max &&
      (!accId || e.debit === accId || e.credit === accId),
    ).sort((a, b) => b.date.localeCompare(a.date));
  }, [s.entries, q, accId]);
  const bal = balances(s);
  const searching = q.text || q.from || q.to || q.min || q.max || accId;

  return (
    <>
      <Help title="3. 帳簿を見る" say="確認がすんだお金の記録です。日付、金額、お店の名前でさがせます。1件を押すと、くわしい内容と、直した記録が見られます。">
        確認がすんだ、お金の記録（帳簿）です。<b>日付・金額・お店の名前</b>でさがせます。<br />1件を押すと、くわしい内容と「直した記録」が見られます。
      </Help>
      <div className="mb-4 flex gap-2" role="tablist">
        {([["list", "日付の順に見る"], ["acc", "使い道ごとに見る"]] as const).map(([k, l]) => <button key={k} type="button" role="tab" aria-selected={tab === k} onClick={() => { setTab(k); setAccId(""); }} className={`btn flex-1 ${tab === k ? "btn-ink" : "btn-sub"}`}>{l}</button>)}
      </div>

      {tab === "acc" && !accId && (
        <ul className="grid gap-2 sm:grid-cols-2">
          {bal.map(({ a, v }) => (
            <li key={a.id}><button type="button" onClick={() => { setAccId(a.id); setTab("list"); }} className="flex w-full items-center gap-3 rounded-2xl border-2 border-line bg-white p-4 text-left hover:border-ink">
              <AccIcon id={a.id} size={24} /><span className="min-w-0 flex-1"><b className="block text-[1rem]">{a.plain}</b><span className="text-[0.85rem] text-sub">{a.name}</span></span><b className="num text-[1.05rem]">{yen(v)}</b>
            </button></li>
          ))}
        </ul>
      )}

      {tab === "list" && (
        <>
          <details className="card mb-4 p-4" open={!!searching}>
            <summary className="flex cursor-pointer items-center gap-2 text-[1.05rem] font-bold"><Search size={20} />さがす</summary>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <label className="text-[0.95rem] font-bold sm:col-span-2">お店・内容<input value={q.text} onChange={(e) => setQ({ ...q, text: e.target.value })} placeholder="例）ドコモ" className="field mt-1" /></label>
              <label className="text-[0.95rem] font-bold">日付（から）<input type="date" value={q.from} onChange={(e) => setQ({ ...q, from: e.target.value })} className="field mt-1" /></label>
              <label className="text-[0.95rem] font-bold">日付（まで）<input type="date" value={q.to} onChange={(e) => setQ({ ...q, to: e.target.value })} className="field mt-1" /></label>
              <label className="text-[0.95rem] font-bold">金額（から）<input inputMode="numeric" value={q.min} onChange={(e) => setQ({ ...q, min: e.target.value.replace(/\D/g, "") })} className="field num mt-1" /></label>
              <label className="text-[0.95rem] font-bold">金額（まで）<input inputMode="numeric" value={q.max} onChange={(e) => setQ({ ...q, max: e.target.value.replace(/\D/g, "") })} className="field num mt-1" /></label>
            </div>
            {searching && <button type="button" onClick={() => { setQ({ text: "", from: "", to: "", min: "", max: "" }); setAccId(""); }} className="btn btn-sub mt-3">条件を消す</button>}
          </details>
          {accId && <p className="mb-2 flex flex-wrap items-center gap-2 text-[1.05rem] font-bold"><AccIcon id={accId} />{acc(accId).plain} だけを表示中 <button type="button" onClick={() => setAccId("")} className="ml-2 underline">すべて表示</button></p>}
          <p className="mb-1 text-[0.95rem] text-sub">{list.length}件</p>
          <ul className="card overflow-hidden px-3">{list.slice(0, 300).map((e) => <Row key={e.id} e={e} onOpen={() => setOpen(e)} />)}</ul>
          {list.length === 0 && <p className="py-8 text-center text-[1rem] text-sub">見つかりませんでした</p>}
        </>
      )}
      <p className="mt-6 text-[0.9rem] text-sub"><Link href="/kessan/" className="font-bold underline">次は「4. 1年のまとめ」へ</Link></p>
      {open && <Detail e={s.entries.find((x) => x.id === open.id) ?? open} onClose={() => setOpen(null)} />}
    </>
  );
}

export default function Page() { return <Shell><Ready><Chobo /></Ready></Shell>; }
