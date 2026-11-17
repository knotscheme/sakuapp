"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Plus, Trash2 } from "lucide-react";
import Shell from "@/components/Shell";
import Ready from "@/components/Ready";
import Help from "@/components/Help";
import { askConfirm, toast } from "@/components/Confirm";
import { ACCOUNTS, acc } from "@/lib/accounts";
import AccIcon from "@/components/AccIcon";
import { balances, compute, depreciation, live, yen } from "@/lib/books";
import { update, uid, useStore, type Asset } from "@/lib/store";

const KIND = { pc: "パソコン・タブレット（4年）", furniture: "机・いすなどの家具（8年）", car: "車（6年）" } as const;

function Kessan() {
  const s = useStore();
  const [proj, setProj] = useState(false);
  const c = compute(s, { project: proj });
  const blue = s.profile.blue !== "white";
  const [na, setNa] = useState({ name: "", date: "2026-11-17", price: "", kind: "pc" as Asset["kind"] });
  const setAsset = (id: string, p: Partial<Asset>) => update((x) => ({ ...x, assets: x.assets.map((a) => (a.id === id ? { ...a, ...p } : a)) }));

  // 家と仕事の両方で使ったもの
  const split: Record<string, { all: number; biz: number }> = {};
  for (const e of live(s)) if (acc(e.debit).kind === "expense" && e.bizPct < 100) {
    const r = (split[e.debit] ??= { all: 0, biz: 0 }); r.all += e.amount; r.biz += Math.floor(e.amount * e.bizPct / 100);
  }
  const bal = balances(s);
  const bv = (id: string) => bal.find((b) => b.a.id === id)?.v ?? 0;
  const depAll = c.deps.reduce((a, d) => a + d.full, 0);
  const sec = "card mt-5 p-5 sm:p-6";
  const rowc = "flex justify-between gap-3 border-b border-line py-2 text-[1rem]";

  return (
    <>
      <Help title="4. 1年のまとめ（決算）" say="1年の終わりに、長く使う物の費用、在庫、家と仕事で分けたお金を整理して、もうけの表を作ります。青色申告決算書のもとになります。">
        1年の終わりに、<b>長く使う物</b>・<b>在庫</b>・<b>家と仕事で分けたお金</b>を整理して、「もうけの表」を作ります。<br />ここで作る表が、青色申告決算書のもとになります。
      </Help>

      <div className="flex rounded-2xl border-2 border-ink bg-white p-1" role="group" aria-label="計算のしかた">
        <button type="button" onClick={() => setProj(false)} aria-pressed={!proj} className={`flex-1 rounded-xl px-4 py-2 text-[0.95rem] font-bold ${!proj ? "bg-ink text-white" : ""}`}>今の時点（{c.months}月まで）</button>
        <button type="button" onClick={() => setProj(true)} aria-pressed={proj} className={`flex-1 rounded-xl px-4 py-2 text-[0.95rem] font-bold ${proj ? "bg-ink text-white" : ""}`}>12月までの見込み</button>
      </div>

      <section className={sec} aria-labelledby="as">
        <h2 id="as" className="text-[1.3rem] font-bold">① 長く使う物（10万円以上のパソコン・家具など）</h2>
        <p className="mt-1 text-[1rem] text-sub">高い物は、何年かに分けて経費にします（減価償却）。青色申告なら、<b>30万円未満の物は、買った年に全額を経費</b>にできます。</p>
        {c.deps.map(({ a, full, biz, how }) => (
          <div key={a.id} className="mt-4 rounded-2xl border-2 border-line p-4">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div><b className="text-[1.1rem]">{a.name}</b><p className="text-[0.95rem] text-sub">{new Date(a.date).toLocaleDateString("ja-JP")}に{yen(a.price)}で購入・{KIND[a.kind]}</p></div>
              <button type="button" onClick={async () => { if (await askConfirm({ title: `「${a.name}」を外しますか？`, ok: "外す", danger: true })) update((x) => ({ ...x, assets: x.assets.filter((y) => y.id !== a.id) })); }} className="btn btn-sub min-h-[2.6rem] px-3 text-ng" aria-label="外す"><Trash2 size={18} /></button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" aria-pressed={a.method === "small"} disabled={!blue || a.price >= 300_000} onClick={() => setAsset(a.id, { method: "small" })} className={`btn min-h-[2.8rem] px-4 ${a.method === "small" ? "btn-ink" : "btn-sub"}`}>今年まとめて経費に</button>
              <button type="button" aria-pressed={a.method === "straight"} onClick={() => setAsset(a.id, { method: "straight" })} className={`btn min-h-[2.8rem] px-4 ${a.method === "straight" ? "btn-ink" : "btn-sub"}`}>何年かに分ける</button>
              <label className="flex items-center gap-2 text-[1rem]">仕事の割合<input type="number" min={1} max={100} value={a.bizPct} onChange={(e) => setAsset(a.id, { bizPct: Math.min(100, Math.max(1, Number(e.target.value) || 1)) })} className="field num w-20" />%</label>
            </div>
            <p className="mt-3 text-[1rem]">今年の経費：<b className="num">{yen(biz)}</b><span className="text-sub">（{how}・全体{yen(full)}のうち仕事{a.bizPct}%）</span></p>
          </div>
        ))}
        <details className="mt-4 rounded-2xl bg-paper p-4">
          <summary className="cursor-pointer text-[1.05rem] font-bold"><Plus size={18} className="mr-1 inline" />長く使う物を追加する</summary>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="text-[0.95rem] font-bold sm:col-span-2">名前<input value={na.name} onChange={(e) => setNa({ ...na, name: e.target.value })} placeholder="例）仕事用のいす" className="field mt-1" /></label>
            <label className="text-[0.95rem] font-bold">買った日<input type="date" value={na.date} onChange={(e) => setNa({ ...na, date: e.target.value })} className="field mt-1" /></label>
            <label className="text-[0.95rem] font-bold">値段（税込）<input inputMode="numeric" value={na.price} onChange={(e) => setNa({ ...na, price: e.target.value.replace(/\D/g, "") })} className="field num mt-1" /></label>
            <label className="text-[0.95rem] font-bold sm:col-span-2">種類<select value={na.kind} onChange={(e) => setNa({ ...na, kind: e.target.value as Asset["kind"] })} className="field mt-1">{Object.entries(KIND).map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select></label>
          </div>
          <button type="button" onClick={() => { const price = Number(na.price); if (!na.name.trim() || !price) { toast("名前と値段を入れてください"); return; } update((x) => ({ ...x, assets: [...x.assets, { id: uid(), name: na.name.trim(), date: na.date, price, kind: na.kind, method: blue && price < 300_000 ? "small" : "straight", bizPct: 100 }] })); setNa({ ...na, name: "", price: "" }); toast("追加しました"); }} className="btn btn-main mt-3">追加する</button>
        </details>
      </section>

      <section className={sec} aria-labelledby="inv">
        <h2 id="inv" className="text-[1.3rem] font-bold">② 在庫（売る物を仕入れている人だけ）</h2>
        <p className="mt-1 text-[1rem] text-sub">12月31日に残っている商品の金額（仕入れた値段）を入れます。サービスの仕事なら「0」のままで大丈夫です。</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="text-[0.95rem] font-bold">1月1日の在庫<input inputMode="numeric" value={s.inventory.start || ""} placeholder="0" onChange={(e) => update((x) => ({ ...x, inventory: { ...x.inventory, start: Number(e.target.value.replace(/\D/g, "")) || 0 } }))} className="field num mt-1" /></label>
          <label className="text-[0.95rem] font-bold">12月31日の在庫<input inputMode="numeric" value={s.inventory.end || ""} placeholder="0" onChange={(e) => update((x) => ({ ...x, inventory: { ...x.inventory, end: Number(e.target.value.replace(/\D/g, "")) || 0 } }))} className="field num mt-1" /></label>
        </div>
      </section>

      <section className={sec} aria-labelledby="sp">
        <h2 id="sp" className="text-[1.3rem] font-bold">③ 家と仕事の両方で使ったもの（家事按分）</h2>
        <p className="mt-1 text-[1rem] text-sub">「確認する」でえらんだ割合で、仕事の分だけを経費にしています。割合は、使った時間や広さなど、説明できる決め方にしておきましょう。</p>
        <ul className="mt-3">
          {Object.entries(split).map(([id, v]) => <li key={id} className={rowc}><span className="flex items-center gap-2"><AccIcon id={id} size={20} />{acc(id).plain}</span><span className="num text-right">払った {yen(v.all)} → <b>経費 {yen(v.biz)}</b></span></li>)}
        </ul>
      </section>

      <section className={sec} aria-labelledby="pl">
        <h2 id="pl" className="text-[1.3rem] font-bold">④ もうけの表（損益計算書）</h2>
        <ul className="mt-3">
          <li className={rowc}><span>売上</span><b className="num">{yen(c.sales + c.miscIncome)}</b></li>
          {c.inv !== 0 && <li className={rowc}><span>在庫の増減</span><span className="num">{yen(-c.inv)}</span></li>}
          {ACCOUNTS.filter((a) => c.byAcc[a.id]).map((a) => <li key={a.id} className={`${rowc} pl-4 text-sub`}><span>{a.name}（{a.plain}）</span><span className="num">{yen(c.byAcc[a.id])}</span></li>)}
          <li className={rowc}><span>経費の合計</span><b className="num">{yen(c.expenses)}</b></li>
          <li className={`${rowc} text-[1.1rem]`}><b>もうけ（青色申告特別控除の前）</b><b className="num">{yen(c.beforeBlue)}</b></li>
          {blue && <li className={rowc}><span>青色申告特別控除</span><span className="num">− {yen(c.blueDed)}</span></li>}
          <li className="flex justify-between gap-3 py-3 text-[1.25rem]"><b>所得（税金の計算のもと）</b><b className="num text-ok">{yen(c.income)}</b></li>
        </ul>
      </section>

      <section className={sec} aria-labelledby="bs">
        <h2 id="bs" className="text-[1.3rem] font-bold">⑤ お金と持ち物の表（貸借対照表・今の時点の目安）</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <ul><li className="pb-1 font-bold">持っているもの</li>
            <li className={rowc}><span>銀行の口座</span><span className="num">{yen(bv("bank"))}</span></li>
            <li className={rowc}><span>手もとの現金</span><span className="num">{yen(bv("cash"))}</span></li>
            <li className={rowc}><span>長く使う物（費用にした分を引く）</span><span className="num">{yen(Math.max(0, bv("equipment") - depAll))}</span></li>
            <li className={rowc}><span>仕事以外に使ったお金</span><span className="num">{yen(-bv("ownerOut") + c.personalFromBiz)}</span></li>
          </ul>
          <ul><li className="pb-1 font-bold">これから払うもの・元手</li>
            <li className={rowc}><span>カードの未払い</span><span className="num">{yen(bv("card"))}</span></li>
            <li className={rowc}><span>年のはじめの元手</span><span className="num">{yen(bv("capital"))}</span></li>
            <li className={rowc}><span>今年のもうけ</span><span className="num">{yen(c.beforeBlue)}</span></li>
          </ul>
        </div>
        <p className="mt-3 text-[0.85rem] text-sub">※デモ版のため、入金した日を売上の日として計算しています（売掛金は使っていません）。</p>
      </section>

      <div className="mt-6"><Link href="/shinkoku/" className="btn btn-main">次は「5. 税金を計算する」へ<ArrowRight size={20} /></Link></div>
    </>
  );
}

export default function Page() { return <Shell><Ready><Kessan /></Ready></Shell>; }
