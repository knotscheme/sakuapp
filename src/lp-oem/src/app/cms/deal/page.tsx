"use client";

import Link from "next/link";
import { Check, ChevronRight, ExternalLink, FileText, Mail, Factory as FactoryIcon, Activity } from "lucide-react";
import { useState } from "react";
import { DOCS, FACTORY, PROD_STEPS, RATE, STAGES, amounts, modelOf, stageIndex, yenOf, OWNERS } from "@/lib/cms";
import { asset } from "@/lib/asset";
import { addLog, advance, revert, updateDeal, useDeals } from "@/components/cms/store";
import { askConfirm } from "@/components/cms/Confirm";
import { Card, CardHead, DueBadge, NoAccess, Shell, StageBadge, TechNote, useQuery } from "@/components/cms/ui";
import { useAuth } from "@/components/cms/perm";

const ICON = { mail: Mail, doc: FileText, factory: FactoryIcon, system: Activity } as const;

export default function DealPage() {
  const id = useQuery("id");
  const deals = useDeals();
  const d = deals.find((x) => x.id === id);
  const [memo, setMemo] = useState("");
  const { can } = useAuth();

  if (!can("deals.view")) return <Shell title="案件"><NoAccess /></Shell>;
  if (!d) return <Shell title="案件"><p className="text-[13px] text-mute">{id ? "案件が見つかりません。" : "読み込み中…"}</p></Shell>;

  const m = modelOf(d.model);
  const a = amounts(d);
  const si = stageIndex(d.stage);
  const cost = (d.thbCost ?? 0) * RATE;
  const profit = a.items - cost * d.lot;
  const docs = DOCS.filter((k) => stageIndex(k.at) <= si);
  const doAdvance = async () => {
    const nextDocs = DOCS.filter((k) => k.at === STAGES[si + 1]?.id).map((k) => k.ja);
    if (await askConfirm({ title: `「${STAGES[si].next}」を実行しますか？`, body: `段階が「${STAGES[si + 1].ja}」に進みます。${nextDocs.length ? `${nextDocs.join("・")}が作られ、` : ""}必要なメールが自動で送られます。`, ok: "実行する" })) advance(d.id, d.owner);
  };
  const doRevert = async () => {
    if (await askConfirm({ title: `「${STAGES[si - 1].ja}」に戻しますか？`, body: "押し間違えたときに使います。送ったメールや作った書類は取り消されません。", ok: "戻す", danger: true })) revert(d.id, d.owner);
  };

  return (
    <Shell
      bottomPad={d.stage !== "done" && can("deals.advance")}
      title={`${d.id}　${d.brand}`}
      actions={<Link href={`/cms/portal/?id=${d.id}`} className="hidden items-center gap-1.5 text-[12px] text-mute hover:text-ink sm:flex">お客様の画面 <ExternalLink size={13} /></Link>}
    >
      {/* 段階 */}
      <Card className="px-5 py-4 md:hidden">
        <div className="flex items-baseline justify-between text-[13px]"><span className="font-semibold">{STAGES[si].ja}</span><span className="text-[11.5px] text-mute">{si + 1} / {STAGES.length}</span></div>
        <div className="mt-2.5 flex gap-1">{STAGES.map((s, i) => <span key={s.id} className={`h-1.5 flex-1 rounded-full ${i <= si ? "bg-ink" : "bg-line"}`} />)}</div>
      </Card>
      <Card className="hidden overflow-x-auto md:block">
        <ol className="flex min-w-[760px] p-1.5">
          {STAGES.map((s, i) => (
            <li key={s.id} className={`flex flex-1 items-center gap-2 rounded-lg px-3 py-2.5 text-[11.5px] ${i === si ? "bg-ink text-white" : i < si ? "text-ink" : "text-mute"}`}>
              <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${i < si ? "border-ink bg-ink text-white" : i === si ? "border-white" : "border-line"}`}>{i < si && <Check size={10} />}</span>
              {s.ja}
            </li>
          ))}
        </ol>
      </Card>

      {d.stage === "done" && can("deals.advance") && (
        <div className="mt-4 text-right"><button type="button" onClick={doRevert} className="text-[12px] text-mute underline underline-offset-4 hover:text-ink">1つ前に戻す</button></div>
      )}
      {d.stage !== "done" && (
        <div className="cms-card mt-5 flex flex-wrap items-center justify-between gap-4 px-6 py-5 ring-1 ring-ink/70">
          <div>
            <p className="text-[11.5px] text-mute">次にやること</p>
            <p className="mt-0.5 text-[16px] font-semibold">{STAGES[si].next}</p>
            <TechNote className="mt-1.5">「実行する」で Supabase Edge Function が動き、書類PDFの作成と Resend でのメール送信を自動で行う</TechNote>
          </div>
          <div className="flex items-center gap-4">
            {si > 0 && can("deals.advance") && <button type="button" onClick={doRevert} className="text-[12px] text-mute underline underline-offset-4 hover:text-ink">1つ前に戻す</button>}
            <DueBadge due={d.due} stage={d.stage} />
            {can("deals.advance") && <button type="button" onClick={doAdvance} className="hidden items-center gap-2 cms-btn bg-ink px-5 py-2.5 md:inline-flex text-[13px] tracking-[0.06em] text-white transition hover:bg-gold">
              実行する <ChevronRight size={15} />
            </button>}
          </div>
        </div>
      )}

      {d.stage !== "done" && can("deals.advance") && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 px-5 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur md:hidden">
          <button type="button" onClick={doAdvance} className="cms-btn flex w-full items-center justify-center gap-2 bg-ink py-3.5 text-[14px] text-white">
            {STAGES[si].next} <ChevronRight size={16} />
          </button>
        </div>
      )}
      <div className="mt-5 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-5">
          {/* 注文内容と金額 */}
          <Card>
            <CardHead note="価格・ロット割引・版代は製品マスタ（products / price_rules テーブル）から自動計算">注文内容</CardHead>
            <div className="flex gap-5 px-5 pt-2 pb-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset(m.img)} alt="" className="aspect-[4/3] w-28 shrink-0 object-cover sm:w-36" />
              <dl className="grid flex-1 grid-cols-[5.5em_1fr] gap-y-1.5 text-[13px]">
                <dt className="text-mute">製品</dt><dd>{m.name}</dd>
                <dt className="text-mute">数量</dt><dd>{d.lot}個</dd>
                <dt className="text-mute">ロゴ加工</dt><dd>{d.finish}</dd>
                <dt className="text-mute">革の色</dt><dd>{d.color}</dd>
                <dt className="text-mute">ロゴ位置</dt><dd>{m.logo}</dd>
              </dl>
            </div>
            {can("money.view") ? (<>
            <table className="w-full border-t border-line text-[13px]">
              <tbody className="divide-y divide-line">
                <tr><td className="px-5 py-2.5 text-mute">製品（{yenOf(a.unit)}×{d.lot}個）</td><td className="px-5 py-2.5 text-right tabular-nums">{yenOf(a.items)}</td></tr>
                <tr><td className="px-5 py-2.5 text-mute">ロゴの版代（初回のみ）</td><td className="px-5 py-2.5 text-right tabular-nums">{yenOf(a.plate)}</td></tr>
                <tr><td className="px-5 py-2.5 text-mute">消費税（10%）</td><td className="px-5 py-2.5 text-right tabular-nums">{yenOf(a.tax)}</td></tr>
                <tr className="bg-[#fafafa]"><td className="px-5 py-3 font-medium">合計（税込）</td><td className="px-5 py-3 text-right text-[16px] font-medium tabular-nums">{yenOf(a.total)}</td></tr>
              </tbody>
            </table>
            <div className="grid grid-cols-3 border-t border-line text-[12px]">
              <div className="px-5 py-3"><p className="text-mute">工場の原価（1個）</p><p className="mt-0.5 tabular-nums">{d.thbCost}バーツ（約{yenOf(cost)}）</p></div>
              <div className="border-l border-line px-5 py-3"><p className="text-mute">粗利（製品分）</p><p className="mt-0.5 tabular-nums">{yenOf(profit)}</p></div>
              <div className="border-l border-line px-5 py-3"><p className="text-mute">粗利率</p><p className="mt-0.5 tabular-nums">{((profit / a.items) * 100).toFixed(1)}%</p></div>
            </div>
            </>) : <p className="border-t border-line px-5 py-4 text-[12.5px] text-mute">金額・原価を見る権限がありません。</p>}
          </Card>

          {/* 工場の進み具合 */}
          {si >= 4 && (
            <Card>
              <CardHead right={<span className="text-[11.5px] text-mute">{FACTORY}</span>} note="工場が自分の画面で更新すると、ここにリアルタイムで反映（Supabase Realtime）">工場の進み具合</CardHead>
              <ol className="grid grid-cols-4 gap-px border-t border-line bg-line">
                {PROD_STEPS.map((p, i) => {
                  const done = si > 4 || d.prodStep > i;
                  return (
                    <li key={p.ja} className={`bg-white px-3 py-3 text-center text-[12px] ${done ? "text-ink" : "text-mute"}`}>
                      <span className={`mx-auto mb-1.5 flex h-6 w-6 items-center justify-center rounded-full border ${done ? "border-ink bg-ink text-white" : "border-line"}`}>{done ? <Check size={12} /> : i + 1}</span>
                      {p.ja}
                    </li>
                  );
                })}
              </ol>
              {d.tracking && <p className="border-t border-line px-5 py-3 text-[12.5px]"><span className="text-mute">送り状番号</span>　{d.tracking}</p>}
            </Card>
          )}

          {/* 履歴 */}
          <Card>
            <CardHead note="操作・自動処理・メール送信をすべて activity_logs テーブルに記録">やり取りの履歴</CardHead>
            <form className="flex gap-2 border-b border-line px-5 pt-1 pb-4" onSubmit={(e) => { e.preventDefault(); if (!memo.trim()) return; updateDeal(d.id, (x) => addLog(x, d.owner, memo.trim())); setMemo(""); }}>
              <input value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="メモを残す（例：電話で納期を確認）" className="flex-1 rounded-lg border border-line px-3 py-2 text-[13px] outline-none focus:border-ink" />
              <button className="cms-btn border border-ink px-4 text-[12.5px]">追加</button>
            </form>
            <ul className="divide-y divide-line">
              {d.logs.map((l, i) => {
                const Icon = ICON[l.kind ?? "system"];
                return (
                  <li key={i} className="flex items-start gap-3 px-5 py-3">
                    <Icon size={15} className="mt-0.5 shrink-0 text-mute" />
                    <span className="flex-1 text-[13px] leading-relaxed">{l.text}</span>
                    <span className="shrink-0 text-[11px] text-mute">{l.at.slice(5).replace("-", "/")}・{l.who}</span>
                  </li>
                );
              })}
            </ul>
          </Card>
        </div>

        <div className="space-y-5">
          <Card>
            <CardHead note="個人情報は暗号化して保存。工場の画面には出さない（RLS）">お客様</CardHead>
            <dl className="grid grid-cols-[5em_1fr] gap-y-2.5 px-5 pt-2 pb-5 text-[13px]">
              <dt className="text-mute">ブランド</dt><dd>{d.brand}</dd>
              <dt className="text-mute">担当者</dt><dd>{can("customer.view") ? d.person : "●●●●（権限なし）"}</dd>
              <dt className="text-mute">メール</dt><dd className="break-all">{can("customer.view") ? d.email : "●●●●（権限なし）"}</dd>
              <dt className="text-mute">受付日</dt><dd>{d.createdAt}</dd>
              <dt className="text-mute">段階</dt><dd><StageBadge stage={d.stage} /></dd>
              <dt className="text-mute">担当</dt>
              <dd>
                <select value={d.owner} onChange={(e) => updateDeal(d.id, (x) => ({ ...x, owner: e.target.value }))} className="rounded-md border border-line px-2 py-1 text-[13px]">
                  {OWNERS.map((o) => <option key={o}>{o}</option>)}
                </select>
              </dd>
            </dl>
            {d.message && <p className="border-t border-line px-5 py-4 text-[12.5px] leading-relaxed text-ink/80">「{d.message}」</p>}
          </Card>

          <Card>
            <CardHead note="PDFは @react-pdf で作成し、Supabase Storage に保存">書類（自動で作成）</CardHead>
            <ul className="divide-y divide-line border-t border-line">
              {DOCS.map((k) => {
                const ready = docs.includes(k);
                return (
                  <li key={k.id} className="flex items-center gap-3 px-5 py-3 text-[13px]">
                    <FileText size={15} className={ready ? "text-ink" : "text-line"} />
                    <span className={`flex-1 ${ready ? "" : "text-mute"}`}>{k.ja}</span>
                    {ready ? (
                      <Link href={`/cms/doc/?id=${d.id}&type=${k.id}`} className="text-[12px] underline underline-offset-4">開く</Link>
                    ) : (
                      <span className="text-[11px] text-mute">{STAGES[stageIndex(k.at)].ja}で作成</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </Card>
        </div>
      </div>
    </Shell>
  );
}
