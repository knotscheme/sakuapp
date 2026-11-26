"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronLeft, ExternalLink, FileText, Send, Sparkles, Trash2 } from "lucide-react";
import { DRAFT_LABEL, colorLines, leatherName, modelOf, poOf, type Deal, type Draft } from "@/lib/cms";
import { PoCard } from "@/components/cms/Messages";
import { checkReminders, discardDraft, pendingDrafts, sendDraft, useDeals } from "@/components/cms/store";
import { useAuth } from "@/components/cms/perm";
import { askConfirm } from "@/components/cms/Confirm";
import { ProofPair, ProofView, sizeText } from "@/components/cms/Proof";
import { KindBadge, NoAccess, Shell, StageBadge, TechNote, useQuery } from "@/components/cms/ui";

// 確認待ち：システムが自動で作った下書き（返信と見積・ロゴ配置案・工場への発注・入金のお願い）を、人が確認して送る
const TONE: Record<Draft["kind"], string> = { reply: "bg-[#eef4ff] text-[#2a4f9e]", proof: "bg-[#fbf3e2] text-[#8a650c]", factory: "bg-[#fde8e8] text-[#9b2c2c]", remind: "bg-[#f1f1ef] text-ink" };
const DOC: Record<Draft["kind"], { type: string; ja: string }[]> = {
  reply: [{ type: "quote", ja: "見積書" }],
  proof: [],
  factory: [{ type: "work", ja: "製造指示書（英語・タイ語）" }],
  remind: [{ type: "deposit", ja: "前金の請求書" }],
};

export default function Inbox() {
  const { can, me } = useAuth();
  const deals = useDeals();
  const qid = useQuery("id");
  const [sel, setSel] = useState<string | null | undefined>(undefined);
  const [tab, setTab] = useState<"draft" | "sent">("draft");
  useEffect(() => { checkReminders(); }, []);
  if (!can("deals.advance")) return <Shell title="確認待ち"><NoAccess /></Shell>;

  const id = sel === undefined ? qid : sel;
  const open = (v: string | null) => { setSel(v); history.replaceState(null, "", v ? `?id=${v}` : location.pathname); };
  const pending = pendingDrafts(deals).sort((a, b) => (a.x.kind === "factory" ? -1 : 0) - (b.x.kind === "factory" ? -1 : 0) || b.x.at.localeCompare(a.x.at));
  const sent = deals.flatMap((d) => (d.drafts ?? []).filter((x) => x.status === "sent").map((x) => ({ d, x }))).sort((a, b) => (b.x.sentAt ?? "").localeCompare(a.x.sentAt ?? ""));
  const rows = tab === "draft" ? pending : sent;
  const cur = [...pending, ...sent].find((r) => r.x.id === id);

  const list = (
    <div className="flex h-full flex-col">
      <div className="flex gap-1 border-b border-line p-2 text-[13px]">
        {([["draft", `確認待ち ${pending.length}`], ["sent", "送信済み"]] as const).map(([k, l]) => (
          <button key={k} type="button" onClick={() => setTab(k)} aria-pressed={tab === k} className={`flex-1 rounded-lg py-2 ${tab === k ? "bg-[#f1f1f0] font-medium" : "text-mute"}`}>{l}</button>
        ))}
      </div>
      <ul className="flex-1 divide-y divide-line overflow-y-auto pb-20 md:pb-0">
        {!rows.length && <li className="px-5 py-10 text-center text-[13px] text-mute">{tab === "draft" ? "確認待ちの下書きはありません。" : "まだ送ったものはありません。"}</li>}
        {rows.map(({ d, x }) => (
          <li key={x.id}>
            <button type="button" onClick={() => open(x.id)} aria-current={cur?.x.id === x.id ? "true" : undefined} className={`flex w-full items-start gap-3 px-4 py-3 text-left transition ${cur?.x.id === x.id ? "bg-[#f1f1f0]" : "hover:bg-[#fafafa]"}`}>
              <div className="w-12 shrink-0 overflow-hidden rounded-lg"><ProofView d={d} label={false} /></div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-[11px] whitespace-nowrap ${TONE[x.kind]}`}>{DRAFT_LABEL[x.kind]}</span>
                  <span className="text-[11px] text-mute">{x.to}あて</span>
                </div>
                <p className="mt-1 truncate text-[13.5px] font-medium">{d.brand}<span className="ml-2 text-[11.5px] font-normal text-mute">{d.id}</span></p>
                <p className="truncate text-[12px] text-ink/60">{x.subject}</p>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <Shell title="確認待ち" hideTabs={!!cur}>
      <TechNote className="-mt-5 mb-4">問い合わせ・入金・承認などをきっかけに、Supabase Edge Function が下書きを作る（本番ではAIで文面を整える）。送信は Resend、工場へは LINE でも通知</TechNote>
      <div className="cms-card grid h-[calc(100svh-13rem)] min-h-[30rem] overflow-hidden md:grid-cols-[340px_1fr] lg:h-[calc(100svh-12rem)]">
        <div className={`${cur ? "hidden md:block" : ""} min-h-0 border-line md:border-r`}>{list}</div>
        <div className={`${cur ? "fixed inset-x-0 top-14 bottom-0 z-30 flex bg-white pb-[env(safe-area-inset-bottom)] md:static md:z-auto md:pb-0" : "hidden md:flex"} min-h-0 flex-col`}>
          {cur ? <Editor key={cur.x.id} d={cur.d} x={cur.x} who={me?.name ?? "佐藤"} onBack={() => open(null)} /> : <div className="flex h-full items-center justify-center px-6 text-center text-[13px] text-mute">左の一覧から、確認する下書きを選んでください。</div>}
        </div>
      </div>
    </Shell>
  );
}

function Editor({ d, x, who, onBack }: { d: Deal; x: Draft; who: string; onBack: () => void }) {
  const [subject, setSubject] = useState(x.subject);
  const [body, setBody] = useState(x.body);
  const [note, setNote] = useState("");
  const done = x.status !== "draft";
  const factory = x.kind === "factory";
  const send = async () => {
    const ok = factory
      ? await askConfirm({ title: "最終確認：タイの工場へ発注しますか？", body: `${modelOf(d.model).short}・${leatherName(d)}・合計${d.lot}個（${colorLines(d).map((c) => `${c.color}${c.qty}`).join("・")}）・ロゴ${d.finish} ${sizeText(d)}。発注すると、工場とのチャットに発注カードが届き、製造が始まります。`, ok: "発注する" })
      : await askConfirm({ title: `${d.person} 様にメールを送りますか？`, body: `件名：${subject}`, ok: "送信する" });
    if (!ok) return;
    sendDraft(d.id, x.id, who, { subject, body }, factory ? note : undefined);
    onBack();
  };
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-center gap-2.5 border-b border-line px-2 py-2 md:px-4">
        <button type="button" onClick={onBack} aria-label="一覧に戻る" className="rounded-full p-2 text-mute hover:bg-[#f1f1f0] md:hidden"><ChevronLeft size={20} /></button>
        <div className="w-12 shrink-0 overflow-hidden rounded-lg"><ProofView d={d} label={false} /></div>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-2 text-[14px] font-semibold"><KindBadge d={d} /><span className="truncate">{d.brand}</span><StageBadge stage={d.stage} /></p>
          <p className="truncate text-[11.5px] text-mute">{d.id}・{modelOf(d.model).short}・合計{d.lot}個</p>
        </div>
        <Link href={`/cms/deal/?id=${d.id}`} className="flex shrink-0 items-center gap-1 rounded-full border border-line px-2.5 py-2 text-[12px] hover:border-ink"><span className="hidden sm:inline">案件を開く</span><span className="sm:hidden">案件</span><ExternalLink size={12} /></Link>
      </div>
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4 md:px-5">
        <p className="flex items-center gap-1.5 text-[12px] text-[#2a4f9e]"><Sparkles size={13} />{done ? `${x.sentAt}に ${x.sentBy} が送信しました` : "自動で作った下書きです。内容を確かめて、必要なら直してから送ってください。"}</p>
        {factory ? (
          <>
            <div className="text-[12.5px]"><span className="text-mute">送り先：</span>工場とのチャット（Bangkok Leather Factory・タイ語で表示）</div>
            <p className="text-[12px] text-mute">メールではなく、この発注カードがチャットに届きます。工場が「受けました」を押すと、ここと案件の記録に残ります。</p>
            {/* 送ったあとは、実際にチャットへ流したカード（受けたかどうかも）を見せる */}
            <PoCard d={d} po={(done && d.msgs?.findLast((m) => m.po)?.po) || poOf(d)} lang="ja" />
            {!done && (
              <label className="block text-[12px] text-mute">ひとこと添える（任意・カードのあとに送ります）
                <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} maxLength={300} placeholder="例）今回は急ぎでお願いします" className="mt-1 w-full resize-y rounded-lg border border-line px-3 py-2 font-[inherit] text-[13.5px] text-ink outline-none focus:border-ink" />
              </label>
            )}
          </>
        ) : (
          <>
            <div className="text-[12.5px]"><span className="text-mute">宛先：</span>{x.to === "工場" ? "Bangkok Leather Factory（タイ）" : `${d.person} 様 <${d.email}>`}</div>
            <label className="block text-[12px] text-mute">件名
              <input value={subject} onChange={(e) => setSubject(e.target.value)} disabled={done} className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-[14px] text-ink outline-none focus:border-ink disabled:bg-[#fafafa]" />
            </label>
            <label className="block text-[12px] text-mute">本文
              <textarea value={body} onChange={(e) => setBody(e.target.value)} disabled={done} rows={14} className="mt-1 w-full resize-y rounded-lg border border-line px-3 py-2.5 font-[inherit] text-[13.5px] leading-relaxed text-ink outline-none focus:border-ink disabled:bg-[#fafafa]" />
            </label>
            {/* 添付：自動で作った書類・ロゴ配置イメージ */}
            <div>
              <p className="text-[12px] text-mute">添付（自動で作成）</p>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {DOC[x.kind].map((doc) => <Link key={doc.type} href={`/cms/doc/?id=${d.id}&type=${doc.type}`} className="flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-[12.5px] hover:border-ink"><FileText size={13} />{doc.ja}</Link>)}
              </div>
              {x.kind === "proof" && <div className="mt-2.5"><ProofPair d={d} label={false} /><p className="mt-1 text-[11.5px] text-mute">ロゴ配置イメージ（お客様に確認をお願いする版）・{d.finish}・{sizeText(d)}</p></div>}
            </div>
          </>
        )}
      </div>
      {!done && (
        <div className="flex items-center justify-between gap-3 border-t border-line px-4 py-3">
          <button type="button" onClick={async () => { if (await askConfirm({ title: "この下書きを破棄しますか？", body: "送らずに消します。必要なら、案件の画面から進めることもできます。", ok: "破棄する", danger: true })) { discardDraft(d.id, x.id, who); onBack(); } }} className="flex items-center gap-1.5 px-2 py-2 text-[12.5px] text-mute hover:text-red-600"><Trash2 size={14} />破棄</button>
          <button type="button" onClick={send} className={`cms-btn flex items-center gap-2 px-5 py-2.5 text-[13.5px] text-white ${factory ? "bg-[#9b2c2c]" : "bg-ink"}`}><Send size={14} />{factory ? "最終確認して工場へ発注" : "確認して送信"}</button>
        </div>
      )}
    </div>
  );
}
