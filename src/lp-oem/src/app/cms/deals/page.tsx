"use client";

import { Ph } from "@/components/cms/Ph";

import Link from "next/link";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { KINDS, STAGES, amounts, kindOf, modelOf, yenOf, type DealKind } from "@/lib/cms";
import { asset } from "@/lib/asset";
import { useDeals } from "@/components/cms/store";
import { DueBadge, KindBadge, NoAccess, Shell, StageBadge } from "@/components/cms/ui";
import { useAuth } from "@/components/cms/perm";

export default function Deals() {
  const deals = useDeals();
  const [view, setView] = useState<"board" | "list">("board");
  const [q, setQ] = useState("");
  const [kind, setKind] = useState<DealKind | "all">("all"); // OEM・ODMで絞り込む
  const { can } = useAuth();
  // ダッシュボードから ?stage=… で来たときは、その段階だけに絞る（active は完了以外）
  const [stages, setStages] = useState<string[] | null>(null);
  useEffect(() => {
    const q = new URLSearchParams(location.search);
    const st = q.get("stage");
    /* eslint-disable react-hooks/set-state-in-effect -- URLは表示後にしか読めないため */
    if (st) setStages(st === "active" ? STAGES.filter((x) => x.id !== "done").map((x) => x.id) : st.split(","));
    if (q.get("view") === "list") setView("list");
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);
  const clearStages = () => { setStages(null); history.replaceState(null, "", location.pathname); };
  const list = deals.filter((d) => kind === "all" || kindOf(d) === kind).filter((d) => !stages || stages.includes(d.stage)).filter((d) => !q || `${d.brand}${d.person}${d.id}${modelOf(d.model).short}`.toLowerCase().includes(q.toLowerCase()));

  if (!can("deals.view")) return <Shell title="案件ボード"><NoAccess /></Shell>;
  const toggle = (
    <div className="flex items-center gap-3">
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="検索" className="hidden w-40 rounded-lg border border-line px-3 py-1.5 text-[13px] outline-none focus:border-ink sm:block" />
      <div className="flex overflow-hidden rounded-lg border border-line bg-white text-[12.5px]">
        {(["board", "list"] as const).map((v) => (
          <button key={v} type="button" onClick={() => setView(v)} className={`px-3.5 py-2 ${view === v ? "bg-ink text-white" : "text-mute"}`}>{v === "board" ? "ボード" : "一覧"}</button>
        ))}
      </div>
    </div>
  );

  return (
    <Shell title="案件ボード" actions={toggle} note="案件は Supabase の deals テーブル。LPのフォーム送信（Next.js のAPI）で自動で1件追加">
      {stages && (
        <div className="mb-4 flex flex-wrap items-center gap-2 text-[12.5px]">
          <span className="text-mute">絞り込み中：</span>
          <span className="rounded-full bg-white px-3 py-1 shadow-[0_0_0_1px_rgba(0,0,0,.08)]">{stages.length >= STAGES.length - 1 && !stages.includes("done") ? "進行中（完了以外）" : stages.join() === "order,proof,production,transit,inspection,shipping" ? "受注後〜発送済み" : stages.map((id) => STAGES.find((x) => x.id === id)?.ja).join("・")}（{list.length}件）</span>
          <button type="button" onClick={clearStages} className="flex items-center gap-1 rounded-full px-2 py-1 text-mute hover:bg-white hover:text-ink"><X size={13} />解除</button>
        </div>
      )}
      {/* 依頼の種類で絞り込み */}
      <div className="mb-4 flex flex-wrap items-center gap-1.5 text-[12.5px]">
        {([["all", "すべて"], ...KINDS.map((k) => [k.id, k.ja])] as [DealKind | "all", string][]).map(([id, label]) => (
          <button key={id} type="button" onClick={() => setKind(id)} className={`rounded-full border px-3 py-1.5 ${kind === id ? "border-ink bg-ink text-white" : "border-line bg-white text-ink/80 hover:border-ink"}`}>
            {label}<span className={`ml-1.5 text-[11px] ${kind === id ? "text-white/70" : "text-mute"}`}>{id === "all" ? deals.length : deals.filter((d) => kindOf(d) === id).length}</span>
          </button>
        ))}
      </div>
      {view === "board" ? (<>
        {/* スマホ：段階のボタンで、その列まで移動 */}
        <div className="-mx-5 mb-3 flex gap-2 overflow-x-auto px-5 pb-1 sm:hidden">
          {STAGES.filter((s) => !stages || stages.includes(s.id)).map((s) => (
            <button key={s.id} type="button" onClick={() => document.getElementById(`col-${s.id}`)?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" })}
              className="flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-line bg-white px-3.5 text-[12.5px] whitespace-nowrap">
              {s.ja}<span className="text-mute">{list.filter((d) => d.stage === s.id).length}</span>
            </button>
          ))}
        </div>
        <div className="snap-x-cols -mx-5 overflow-x-auto scroll-px-5 px-5 pb-4 md:-mx-10 md:px-10">
          <div className="flex gap-4" style={{ width: "max-content" }}>
            {STAGES.filter((s) => !stages || stages.includes(s.id)).map((s) => {
              const items = list.filter((d) => d.stage === s.id);
              return (
                <div key={s.id} id={`col-${s.id}`} className="w-[82vw] shrink-0 snap-start rounded-xl bg-[#e8e8e6]/60 p-2.5 sm:w-64">
                  <div className="mb-2.5 flex items-center justify-between px-1.5 pt-1">
                    <p className="text-[12.5px] font-medium"><Ph>{s.ja}</Ph></p>
                    <span className="text-[11px] text-mute">{items.length}</span>
                  </div>
                  <div className="space-y-2">
                    {items.map((d) => (
                      <Link key={d.id} href={`/cms/deal/?id=${d.id}`} className="cms-card block p-3.5 transition hover:shadow-md">
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={asset(modelOf(d.model).img)} alt="" className="aspect-[4/3] w-12 object-cover" />
                          <div className="min-w-0 flex-1">
                            <p className="flex items-center gap-1.5 text-[13px] font-medium"><KindBadge d={d} /><span className="truncate">{d.brand}</span></p>
                            <p className="text-[11px] text-mute"><Ph>{`${modelOf(d.model).short}・${d.lot}個・${d.finish}`}</Ph></p>
                          </div>
                        </div>
                        <div className="mt-2.5 flex items-center justify-between border-t border-line pt-2 text-[11px]">
                          <span className="text-mute">{d.id}・{d.owner}</span>
                          <DueBadge due={d.due} stage={d.stage} />
                        </div>
                      </Link>
                    ))}
                    {!items.length && <p className="rounded-lg border border-dashed border-line px-3 py-6 text-center text-[11px] text-mute">なし</p>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </>) : (<>
        {/* スマホ：表の代わりにカードで並べる */}
        <ul className="space-y-2.5 md:hidden">
          {list.map((d) => (
            <li key={d.id}>
              <Link href={`/cms/deal/?id=${d.id}`} className="cms-card flex items-center gap-3 p-3.5 active:bg-[#fafafa]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset(modelOf(d.model).img)} alt="" className="aspect-[4/3] w-14 shrink-0 self-start object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2"><p className="flex min-w-0 items-center gap-1.5 text-[14px] font-medium"><KindBadge d={d} /><span className="truncate">{d.brand}</span></p><StageBadge stage={d.stage} /></div>
                  <p className="mt-0.5 text-[12px] text-mute"><Ph>{`${modelOf(d.model).short}・${d.lot}個`}</Ph>{can("money.view") && <span className="whitespace-nowrap">・{yenOf(amounts(d).total)}</span>}</p>
                  <div className="mt-1.5 flex items-center justify-between text-[11.5px]"><span className="text-mute">{d.id}・{d.owner}</span><DueBadge due={d.due} stage={d.stage} /></div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
        <div className="cms-card hidden overflow-x-auto md:block">
          <table className="w-full min-w-[760px] text-[13px]">
            <thead className="border-b border-line bg-[#fafafa] text-left text-[11.5px] text-mute">
              <tr>{["番号", "種類", "ブランド", "製品・数量", "段階", "金額（税込）", "担当", "期日"].map((h) => <th key={h} className="px-4 py-2.5 font-normal">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-line">
              {list.map((d) => (
                <tr key={d.id} className="hover:bg-[#fafafa]">
                  <td className="px-4 py-3 whitespace-nowrap text-mute"><Link href={`/cms/deal/?id=${d.id}`}>{d.id}</Link></td>
                  <td className="px-4 py-3"><KindBadge d={d} long /></td>
                  <td className="px-4 py-3 font-medium"><Link href={`/cms/deal/?id=${d.id}`}>{d.brand}</Link></td>
                  <td className="px-4 py-3">{modelOf(d.model).short}×{d.lot}</td>
                  <td className="px-4 py-3"><StageBadge stage={d.stage} /></td>
                  <td className="px-4 py-3 whitespace-nowrap tabular-nums">{can("money.view") ? yenOf(amounts(d).total) : "—"}</td>
                  <td className="px-4 py-3">{d.owner}</td>
                  <td className="px-4 py-3"><DueBadge due={d.due} stage={d.stage} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>)}
    </Shell>
  );
}
