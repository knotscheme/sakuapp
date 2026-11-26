"use client";

import { Ph } from "@/components/cms/Ph";

import Link from "next/link";
import { Check, ChevronRight, ExternalLink, FileText, Mail, Factory as FactoryIcon, Activity } from "lucide-react";
import { useEffect, useState } from "react";
import { DOCS, DRAFT_LABEL, FACTORY, PROD_STEPS, RATE, STAGES, STAGE_DRAFT, amounts, modelOf, quoteLines, stageIndex, yenOf, OWNERS, colorLines, leatherName, makeDraft, type Deal } from "@/lib/cms";
import { leathersOf, minLotOf, useCatalog } from "@/components/cms/catalog";
import { getPricing } from "@/lib/pricing";
import { asset } from "@/lib/asset";
import { addLog, advance, confirmPayment, revert, updateDeal, useDeals } from "@/components/cms/store";
import { askConfirm } from "@/components/cms/Confirm";
import { Card, CardHead, DueBadge, NoAccess, Shell, StageBadge, TechNote, useNavHidden, useQuery } from "@/components/cms/ui";
import { useAuth } from "@/components/cms/perm";
import { ProofCard } from "./proof-card";
import { ItemsEditor } from "./items";
import { AutoFlow } from "./auto-flow";
import { MsgThread } from "@/components/cms/Messages";

const ICON = { mail: Mail, doc: FileText, factory: FactoryIcon, system: Activity } as const;

export default function DealPage() {
  const id = useQuery("id");
  const deals = useDeals();
  const d = deals.find((x) => x.id === id);
  const [memo, setMemo] = useState("");
  const { can, me } = useAuth();
  const navHidden = useNavHidden();
  // ダッシュボードの「工場からの連絡」から来たときは、連絡の欄まで移動する
  const loaded = !!d;
  useEffect(() => { if (loaded && location.hash === "#msgs") setTimeout(() => document.getElementById("msgs")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50); }, [loaded]);

  if (!can("deals.view")) return <Shell title="案件"><NoAccess /></Shell>;
  if (!d) return <Shell title="案件"><p className="text-[13px] text-mute">{id ? "案件が見つかりません。" : "読み込み中…"}</p></Shell>;

  const m = modelOf(d.model);
  const a = amounts(d);
  const q = quoteLines(d);
  const si = stageIndex(d.stage);
  const cost = (d.thbCost ?? 0) * RATE;
  const profit = a.items - cost * d.lot;
  const docs = DOCS.filter((k) => stageIndex(k.at) <= si);
  // 次にやること：確認待ちの下書きがあれば、それを確認して送る。お客様や入金を待つ段階は「待っています」
  const pend = (d.drafts ?? []).find((x) => x.status === "draft" && x.kind === STAGE_DRAFT[d.stage]);
  const waiting = d.stage === "quote" ? "お客様の見積の承諾を待っています（承諾されると自動で注文に）" : d.stage === "order" && !d.paid ? "前金の入金を待っています（自動で確認します）" : d.stage === "proof" && !d.proofOk ? "お客様のロゴ配置の承認を待っています" : null;
  const nextText = pend ? (pend.kind === "factory" ? "工場への発注を最終確認する" : `「${DRAFT_LABEL[pend.kind]}」の下書きを確認して送る`) : waiting ?? STAGES[si].next;
  const doAdvance = async () => {
    const nextDocs = DOCS.filter((k) => k.at === STAGES[si + 1]?.id).map((k) => k.ja);
    if (await askConfirm({ title: `「${STAGES[si].next}」を実行しますか？`, body: `段階が「${STAGES[si + 1].ja}」に進みます。${nextDocs.length ? `${nextDocs.join("・")}が作られ、` : ""}必要なメールが自動で送られます。`, ok: "実行する" })) advance(d.id, d.owner);
  };
  const doRevert = async () => {
    if (await askConfirm({ title: `「${STAGES[si - 1].ja}」に戻しますか？`, body: "押し間違えたときに使います。送ったメールや作った書類は取り消されません。", ok: "戻す", danger: true })) revert(d.id, d.owner);
  };

  return (
    <Shell
      bottomPad={d.stage !== "done" && can("deals.advance") && !(d.stage === "quote" || (d.stage === "order" && !d.paid) || (d.stage === "proof" && !d.proofOk))}
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
              <span><Ph>{s.ja}</Ph></span>
            </li>
          ))}
        </ol>
      </Card>

      {d.stage === "done" && can("deals.advance") && (
        <div className="mt-4 text-right"><button type="button" onClick={doRevert} className="tap text-[12px] text-mute underline underline-offset-4 hover:text-ink">1つ前に戻す</button></div>
      )}
      {d.stage !== "done" && (
        <div className="cms-card mt-5 flex flex-wrap items-center justify-between gap-4 px-6 py-5 ring-1 ring-ink/70">
          <div>
            <p className="text-[11.5px] text-mute">次にやること</p>
            <p className={`mt-0.5 text-[16px] font-semibold ${waiting && !pend ? "text-[#8a650c]" : ""}`}>{nextText}</p>
            {pend && <p className="mt-1 text-[12px] text-[#2a4f9e]">システムが下書きを自動で作りました。確認して送るだけです。</p>}
            {waiting && !pend && can("deals.advance") && (
              <p className="mt-1 text-[12px] text-mute">
                {d.stage === "order" && <button type="button" onClick={async () => { if (await askConfirm({ title: "入金を記録しますか？", body: "銀行振込などを手で確認したときに使います（デモでは、お客様の画面からも支払えます）。", ok: "記録する" })) confirmPayment(d.id, "銀行振込（手動で記録）"); }} className="tap mr-4 underline underline-offset-4 hover:text-ink">入金を手動で記録</button>}
                <button type="button" onClick={doAdvance} className="tap underline underline-offset-4 hover:text-ink">待たずに手動で進める</button>
              </p>
            )}
            <TechNote className="mt-1.5">きっかけごとに Supabase Edge Function が動き、下書き・書類PDF・メール（Resend）を自動で作る。送るのは人が確認してから</TechNote>
          </div>
          <div className="flex items-center gap-4">
            {si > 0 && can("deals.advance") && <button type="button" onClick={doRevert} className="tap text-[12px] text-mute underline underline-offset-4 hover:text-ink">1つ前に戻す</button>}
            <DueBadge due={d.due} stage={d.stage} />
            {can("deals.advance") && pend && <Link href={`/cms/inbox/?id=${pend.id}`} className="hidden items-center gap-2 cms-btn bg-ink px-5 py-2.5 md:inline-flex text-[13px] tracking-[0.06em] text-white transition hover:bg-gold">確認する <ChevronRight size={15} /></Link>}
            {can("deals.advance") && !pend && !waiting && <button type="button" onClick={doAdvance} className="hidden items-center gap-2 cms-btn bg-ink px-5 py-2.5 md:inline-flex text-[13px] tracking-[0.06em] text-white transition hover:bg-gold">
              実行する <ChevronRight size={15} />
            </button>}
          </div>
        </div>
      )}

      {d.stage !== "done" && can("deals.advance") && !waiting && (
        <div className={`fixed inset-x-5 z-30 transition-[bottom] duration-300 md:hidden ${navHidden ? "bottom-[calc(0.75rem+env(safe-area-inset-bottom))]" : "bottom-[calc(4.75rem+env(safe-area-inset-bottom))]"}`}>
          {pend ? (
            <Link href={`/cms/inbox/?id=${pend.id}`} className="flex w-full items-center justify-center gap-2 rounded-full bg-ink py-3.5 text-[14px] text-white shadow-[0_8px_24px_rgba(0,0,0,.22)] active:scale-[.99]">{nextText} <ChevronRight size={16} /></Link>
          ) : (
            <button type="button" onClick={doAdvance} className="flex w-full items-center justify-center gap-2 rounded-full bg-ink py-3.5 text-[14px] text-white shadow-[0_8px_24px_rgba(0,0,0,.22)] active:scale-[.99]">
              {STAGES[si].next} <ChevronRight size={16} />
            </button>
          )}
        </div>
      )}
      <div className="mt-5 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-5">
          {/* 注文内容と金額 */}
          <Card>
            <CardHead note="価格・ロット割引・版代は製品マスタ（products / price_rules テーブル）から自動計算">注文内容</CardHead>
            <div className="flex gap-5 px-5 pt-2 pb-5">
              <div className="w-28 shrink-0 self-start sm:w-36">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset(m.img)} alt="" className="block aspect-[4/3] h-auto w-full object-cover" />
              </div>
              <dl className="grid flex-1 grid-cols-[5.5em_1fr] gap-y-1.5 text-[13px]">
                <dt className="text-mute">製品</dt><dd><Ph>{m.name}</Ph></dd>
                <dt className="text-mute">数量</dt><dd>合計 {d.lot}個</dd>
                {d.plan && <><dt className="text-mute">プラン</dt><dd>{d.plan}</dd></>}
                <dt className="text-mute">工場へ</dt><dd>{can("deals.advance") ? (
                  <button type="button" aria-pressed={!!d.urgent} onClick={() => updateDeal(d.id, (x) => addLog({ ...x, urgent: !x.urgent }, me?.name ?? "担当", x.urgent ? "急ぎの依頼を外しました" : "工場に急ぎで依頼しました（工場の画面で先頭に出ます）", "factory"))}
                    className={`rounded-full border px-2.5 py-0.5 text-[12px] ${d.urgent ? "border-[#9b2c2c] bg-[#9b2c2c] text-white" : "border-line text-mute hover:border-ink hover:text-ink"}`}>{d.urgent ? "急ぎ（優先）" : "通常"}</button>
                ) : d.urgent ? "急ぎ（優先）" : "通常"}</dd>
                <dt className="text-mute">革素材</dt><dd><LeatherSelect d={d} canEdit={can("deals.advance")} who={me?.name ?? "担当"} /></dd>
                <dt className="text-mute">ロゴ加工</dt><dd>{d.finish}</dd>
                <dt className="text-mute">ロゴ位置</dt><dd><Ph>{m.logo}</Ph></dd>
              </dl>
            </div>
            <ItemsEditor d={d} canEdit={can("deals.advance")} />
            {can("money.view") ? (<>
            <table className="w-full border-t border-line text-[13px]">
              <tbody className="divide-y divide-line">
                {q.lines.map((x) => (
                  <tr key={x.color}><td className="px-4 py-2.5 sm:px-5 text-mute">{x.color}<span className="block text-[11.5px] whitespace-nowrap sm:inline sm:text-[13px]">（{yenOf(x.unit)}×{x.qty}個）</span></td><td className="px-4 py-2.5 sm:px-5 text-right whitespace-nowrap tabular-nums">{yenOf(x.sum)}</td></tr>
                ))}
                {q.discount && <tr><td className="px-4 py-2.5 sm:px-5 text-[#8a650c]">数量割引<span className="block text-[11.5px] whitespace-nowrap sm:inline sm:text-[13px]">（合計{d.lot}個・{Math.round(q.discount.rate * 100)}%引き）</span></td><td className="px-4 py-2.5 sm:px-5 text-right whitespace-nowrap text-[#8a650c] tabular-nums">−{yenOf(q.discount.amount)}</td></tr>}
                {a.plate > 0 && <tr><td className="px-4 py-2.5 sm:px-5 text-mute">ロゴの版代（初回のみ）</td><td className="px-4 py-2.5 sm:px-5 text-right whitespace-nowrap tabular-nums">{yenOf(a.plate)}</td></tr>}
                <tr><td className="px-4 py-2.5 sm:px-5 text-mute">消費税（10%）</td><td className="px-4 py-2.5 sm:px-5 text-right whitespace-nowrap tabular-nums">{yenOf(a.tax)}</td></tr>
                <tr className="bg-[#fafafa]"><td className="px-4 py-3 sm:px-5 font-medium">合計（税込）</td><td className="px-4 py-3 sm:px-5 text-right text-[16px] font-medium whitespace-nowrap tabular-nums">{yenOf(a.total)}</td></tr>
              </tbody>
            </table>
            {/* スマホでは1行ずつ（項目名と金額を左右に）、PCでは3列 */}
            <div className="grid grid-cols-1 border-t border-line text-[12px] sm:grid-cols-3">
              <div className="flex items-baseline justify-between gap-3 px-5 py-3 sm:block"><p className="text-mute">工場の原価（1個）</p><p className="tabular-nums sm:mt-0.5">{d.thbCost}バーツ（約{yenOf(cost)}）</p></div>
              <div className="flex items-baseline justify-between gap-3 px-5 py-3 sm:block border-t border-line sm:border-t-0 sm:border-l"><p className="text-mute">粗利（製品分）</p><p className="tabular-nums sm:mt-0.5">{yenOf(profit)}</p></div>
              <div className="flex items-baseline justify-between gap-3 px-5 py-3 sm:block border-t border-line sm:border-t-0 sm:border-l"><p className="text-mute">粗利率</p><p className="tabular-nums sm:mt-0.5">{((profit / a.items) * 100).toFixed(1)}%</p></div>
            </div>
            </>) : <p className="border-t border-line px-5 py-4 text-[12.5px] text-mute">金額・原価を見る権限がありません。</p>}
          </Card>

          {/* 自動化の流れ */}
          <AutoFlow d={d} />

          {/* 工場との連絡 */}
          {(si >= 4 || (d.msgs?.length ?? 0) > 0) && (
            <div id="msgs" className="scroll-mt-20">
              <Card>
                <CardHead right={<Link href={`/cms/messages/?id=${d.id}`} className="tap text-[12px] text-mute underline underline-offset-4 hover:text-ink">連絡の画面で開く</Link>}>工場との連絡</CardHead>
                <div className="px-5 pb-5">
                  <MsgThread d={d} side="japan" lang="ja" who={me?.name ?? d.owner} />
                  <p className="mt-2 text-[11.5px] text-mute">工場の人には、タイ語で表示されます。</p>
                </div>
              </Card>
            </div>
          )}

          {/* ロゴ配置イメージ */}
          <ProofCard d={d} canEdit={can("deals.advance")} who={d.owner} />

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
                      <Ph>{p.ja}</Ph>
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
                    <span className="flex-1 text-[13px] leading-relaxed"><Ph tail={4}>{l.text}</Ph></span>
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
                      <Link href={`/cms/doc/?id=${d.id}&type=${k.id}`} className="tap -my-2 px-2 text-[12px] underline underline-offset-4">開く</Link>
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

// 革素材：見積を送る前なら選び直せる（上乗せは単価に入る）。送ったあとは価格が固定なので変えない
function LeatherSelect({ d, canEdit, who }: { d: Deal; canEdit: boolean; who: string }) {
  const { products, leathers } = useCatalog();
  const list = leathersOf(products.find((p) => p.id === d.model), leathers);
  const cur = d.leather?.name ?? list[0]?.name;
  // 色は革によって異なる：注文の色がこの革で作れないときは知らせる
  const curL = leathers.find((l) => l.name === cur);
  const ng = curL?.colors ? colorLines(d).map((x) => x.color).filter((c) => !curL.colors!.includes(c)) : [];
  const min = minLotOf(curL, getPricing().minLot);
  const warn = <>{ng.length > 0 && <span className="mt-1 block text-[11.5px] text-red-600">{ng.join("・")}は、この革では作れません</span>}{d.lot < min && <span className="mt-1 block text-[11.5px] text-red-600">この革は{min}個からです（いま{d.lot}個）</span>}</>;
  const label = <>{leatherName(d)}{d.leather?.add ? <span className="text-mute">（+{yenOf(d.leather.add)}/個）</span> : null}{warn}</>;
  if (!canEdit || d.lock || list.length < 2) return label;
  return (<>
    <select value={cur} aria-label="革素材" onChange={(e) => { const l = list.find((x) => x.name === e.target.value); if (l) updateDeal(d.id, (x) => { const y = { ...x, leather: { name: l.name, code: l.code, add: l.add, img: l.img, group: l.group, tan: l.tan, en: l.en, th: l.th } }; return addLog({ ...y, drafts: y.drafts?.map((dr) => (dr.status === "draft" ? { ...dr, subject: makeDraft(dr.kind, y).subject, body: makeDraft(dr.kind, y).body } : dr)) }, who, `革素材を「${l.name}」に変更しました（送る前の下書きも更新）`); }); }}
      className="-my-1 w-full rounded-md border border-line bg-white px-2 py-1 text-[13px] outline-none focus:border-ink">
      {list.map((l) => <option key={l.id} value={l.name}>{l.name}{l.add ? `（+${yenOf(l.add)}/個）` : ""}</option>)}
    </select>
    {warn}
  </>);
}
