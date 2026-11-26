"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronLeft, ExternalLink, Search } from "lucide-react";
import { FACTORY, stageIndex, type Deal } from "@/lib/cms";
import { useDeals, unreadOf } from "@/components/cms/store";
import { useAuth } from "@/components/cms/perm";
import { MsgThread } from "@/components/cms/Messages";
import { ProofView } from "@/components/cms/Proof";
import { KindBadge, NoAccess, Shell, StageBadge, TechNote, useQuery } from "@/components/cms/ui";
import { modelOf } from "@/lib/cms";

// 工場との連絡：LINEのように、工場とのやり取りだけを案件ごとに並べる
// どの商品の話かが一目で分かるよう、製品の写真（ロゴ入り）と製品名・数量を出し、そのまま案件を開ける
const time = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(iso), now = new Date();
  return d.toDateString() === now.toDateString() ? `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}` : `${d.getMonth() + 1}/${d.getDate()}`;
};
const last = (d: Deal) => d.msgs?.[d.msgs.length - 1];
const preview = (d: Deal) => { const m = last(d); return m ? `${m.from === "japan" ? "あなた：" : ""}${m.t ? m.t.ja : m.raw}` : "まだ連絡はありません"; };

export default function Messages() {
  const { can, me } = useAuth();
  const deals = useDeals();
  const qid = useQuery("id");
  // 一覧で選んだ会話（同じ画面の中で切り替えるので、URLも書き換えておく）
  const [sel, setSel] = useState<string | null | undefined>(undefined);
  const id = sel === undefined ? qid : sel;
  const open = (v: string | null) => { setSel(v); history.replaceState(null, "", v ? `?id=${v}` : location.pathname); };
  const [q, setQ] = useState("");
  if (!can("deals.view")) return <Shell title="工場との連絡"><NoAccess /></Shell>;

  // 製造に入った案件（工場とやり取りする案件）と、連絡がある案件
  const threads = deals
    .filter((d) => (d.msgs?.length ?? 0) > 0 || (stageIndex(d.stage) >= 4 && d.stage !== "done"))
    .filter((d) => !q.trim() || `${d.brand}${d.id}${modelOf(d.model).name}`.toLowerCase().includes(q.trim().toLowerCase()))
    .sort((a, b) => (last(b)?.at ?? "").localeCompare(last(a)?.at ?? ""));
  const cur = deals.find((d) => d.id === id);

  const list = (
    <div className="flex h-full flex-col">
      <div className="border-b border-line p-3">
        <label className="flex items-center gap-2 rounded-lg bg-[#f1f1f0] px-3 py-2">
          <Search size={15} className="text-mute" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="ブランド名・案件番号・製品で探す" className="min-w-0 flex-1 bg-transparent text-[13.5px] outline-none" />
        </label>
      </div>
      <ul className="flex-1 divide-y divide-line overflow-y-auto pb-20 md:pb-0">
        {!threads.length && <li className="px-5 py-10 text-center text-[13px] text-mute">やり取りはありません。</li>}
        {threads.map((d) => {
          const n = unreadOf(d, "factory");
          const m = modelOf(d.model);
          return (
            <li key={d.id}>
              <button type="button" onClick={() => open(d.id)} aria-current={cur?.id === d.id ? "true" : undefined} className={`flex w-full items-center gap-3 px-4 py-3 text-left transition ${cur?.id === d.id ? "bg-[#f1f1f0]" : "hover:bg-[#fafafa] active:bg-[#f1f1f0]"}`}>
                <div className="w-14 shrink-0 overflow-hidden rounded-lg"><ProofView d={d} label={false} /></div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className={`truncate text-[14px] ${n ? "font-semibold" : "font-medium"}`}>{d.brand}</p>
                    <span className="shrink-0 text-[11px] text-mute">{time(last(d)?.at)}</span>
                  </div>
                  <p className="truncate text-[11.5px] text-mute">{d.id}・{m.short}・{d.lot}個・{d.color}</p>
                  <div className="mt-0.5 flex items-center gap-2">
                    <p className={`min-w-0 flex-1 truncate text-[12.5px] ${n ? "text-ink" : "text-ink/60"}`}>{preview(d)}</p>
                    {n > 0 && <span className="shrink-0 rounded-full bg-red-600 px-1.5 text-[11px] leading-5 text-white">{n}</span>}
                  </div>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );

  const chat = cur && (
    <div className="flex h-full flex-col">
      {/* どの商品の話か：写真・製品名・数量・段階。案件をそのまま開ける */}
      <div className="flex items-center gap-2.5 border-b border-line bg-white px-2 py-2 md:px-4 md:py-2.5">
        <button type="button" onClick={() => open(null)} aria-label="一覧に戻る" className="rounded-full p-2 text-mute hover:bg-[#f1f1f0] md:hidden"><ChevronLeft size={20} /></button>
        <div className="w-12 shrink-0 overflow-hidden rounded-lg md:w-14"><ProofView d={cur} label={false} /></div>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-2 text-[14px] font-semibold"><KindBadge d={cur} /><span className="truncate">{cur.brand}</span><StageBadge stage={cur.stage} /></p>
          <p className="truncate text-[11.5px] text-mute">{cur.id}・{modelOf(cur.model).short}・{cur.lot}個・{cur.color}・{cur.finish}</p>
        </div>
        <Link href={`/cms/deal/?id=${cur.id}`} aria-label="案件を開く" className="flex shrink-0 items-center gap-1 rounded-full border border-line px-2.5 py-2 text-[12px] hover:border-ink"><span className="hidden sm:inline">案件を開く</span><span className="sm:hidden">案件</span><ExternalLink size={12} /></Link>
      </div>
      <div className="flex min-h-0 flex-1 flex-col bg-[#f6f6f4] px-3 pt-3 pb-3 md:px-5">
        <p className="mb-2 text-center text-[10.5px] text-mute">{FACTORY.replace("（仮）", "")}・相手にはタイ語で表示</p>
        <div className="flex min-h-0 flex-1 flex-col [&>div]:flex [&>div]:min-h-0 [&>div]:flex-1 [&>div]:flex-col">
          <MsgThread d={cur} side="japan" lang="ja" who={me?.name ?? cur.owner} listClass="min-h-0 flex-1" compact />
        </div>
      </div>
    </div>
  );

  return (
    <Shell title="工場との連絡" hideTabs={!!cur} note={undefined}>
      <TechNote className="-mt-5 mb-4">連絡は messages テーブルに保存し、Supabase Realtime で、相手の画面にすぐ届く（LINE・メールの通知も）</TechNote>
      <div className="cms-card grid h-[calc(100svh-13rem)] min-h-[28rem] overflow-hidden md:grid-cols-[320px_1fr] lg:h-[calc(100svh-12rem)]">
        <div className={`${cur ? "hidden md:block" : ""} min-h-0 border-line md:border-r`}>{list}</div>
        <div className={`${cur ? "fixed inset-x-0 top-14 bottom-0 z-30 flex bg-white pb-[env(safe-area-inset-bottom)] md:static md:z-auto md:pb-0" : "hidden md:flex"} min-h-0 flex-col`}>
          {chat ?? <div className="flex h-full items-center justify-center text-[13px] text-mute">左の一覧から、やり取りを選んでください。</div>}
        </div>
      </div>
    </Shell>
  );
}
