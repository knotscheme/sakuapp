"use client";

import { Ph } from "@/components/cms/Ph";

import Link from "next/link";
import { useState } from "react";
import { ProofPair, ProofView, logoCm } from "@/components/cms/Proof";
import { Check, FileText } from "lucide-react";
import { DOCS, STAGES, amounts, modelOf, stageIndex, yenOf } from "@/lib/cms";
import { asset } from "@/lib/asset";
import { addLog, advance, updateDeal, useDeals } from "@/components/cms/store";
import { NoAccess, Shell, TechNote, useQuery } from "@/components/cms/ui";
import { useAuth } from "@/components/cms/perm";
import { ConfirmHost, askConfirm } from "@/components/cms/Confirm";

// お客様の画面：自分の案件だけ。履歴は、お客様に送ったメールとお客様自身の操作だけを見せる（社内のメモや作業記録は出さない）
// お客様の画面：自分の案件だけ。見積の承諾・ロゴ配置の承認・進み具合の確認ができる
const SIMPLE = ["お問い合わせ", "お見積り", "ご注文", "ロゴの確認", "製造", "輸送", "検品", "発送", "お届け完了"];

export default function Portal() {
  const id = useQuery("id");
  const d = useDeals().find((x) => x.id === id);
  const { can } = useAuth();
  const [asking, setAsking] = useState(false);
  const [req, setReq] = useState("");
  // デモでは管理画面の人が「お客様の画面」を見る。案件を見る権限が無い人（工場など）には見せない
  // ※本番では、お客様はメールの専用リンクで、自分の案件だけを見る
  if (!can("deals.view")) return <Shell title="お客様の画面（例）"><NoAccess /></Shell>;
  if (!d) return <p className="p-8 text-[13px] text-mute">{id ? "案件が見つかりません。" : "読み込み中…"}</p>;
  const m = modelOf(d.model);
  const a = amounts(d);
  const si = stageIndex(d.stage);
  const docs = DOCS.filter((k) => stageIndex(k.at) <= si && k.id !== "work");

  return (
    <div className="cms-bg min-h-[100svh]">
      <header className="bg-white shadow-[0_1px_0_rgba(0,0,0,.06)]">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-6">
          <p className="font-display text-[15px] tracking-[0.4em]">CRAFT</p>
          <p className="text-[12px] text-mute">{d.brand} 様</p>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-10">
        <p className="text-[12px] text-mute">ご注文番号 {d.id}</p>
        <TechNote className="mt-1">お客様にはログイン不要の専用リンク（期限つき）をメールで送付。自分の案件だけ見える</TechNote>
        <h1 className="mt-1 text-[24px] font-medium tracking-[0.04em]"><Ph>{STAGES[si].id === "done" ? "お届けが完了しました" : `ただいま「${SIMPLE[si]}」の段階です`}</Ph></h1>

        <ol className="mt-8 grid grid-cols-9 gap-1">
          {SIMPLE.map((s, i) => (
            <li key={s} className="text-center">
              <span className={`block h-1 rounded-full ${i <= si ? "bg-ink" : "bg-line"}`} />
              <span className={`mt-2 hidden text-[10.5px] sm:block ${i === si ? "text-ink" : "text-mute"}`}>{s}</span>
            </li>
          ))}
        </ol>

        {d.stage === "quote" && (
          <section className="mt-8 cms-card p-6 ring-1 ring-ink/70">
            <p className="text-[15px] font-medium">お見積りをご確認ください</p>
            <p className="mt-1 text-[13px] text-mute">合計 {yenOf(a.total)}（税込）。承諾いただくと、発注依頼書と前金の請求書が届きます。</p>
            <div className="mt-4 flex gap-4">
              <button type="button" onClick={async () => { if (!(await askConfirm({ title: "このお見積りで承諾しますか？", body: `合計 ${yenOf(a.total)}（税込）。承諾すると、発注依頼書と前金の請求書が届きます。`, ok: "承諾する" }))) return; updateDeal(d.id, (x) => addLog(x, "お客様", "お客様の画面から見積を承諾しました")); advance(d.id, "お客様"); }} className="cms-btn bg-ink px-5 py-2.5 text-[13px] text-white">見積を承諾する</button>
              <Link href={`/cms/doc/?id=${d.id}&type=quote`} className="self-center text-[13px] underline underline-offset-4">見積書を見る</Link>
            </div>
          </section>
        )}
        {d.stage === "proof" && (
          <section className="mt-8 cms-card p-6 ring-1 ring-ink/70">
            <p className="text-[15px] font-medium"><Ph>ロゴの配置をご確認ください</Ph><span className="ml-2 text-[12px] font-normal text-mute">第{d.proofVer ?? 1}版</span></p>
            <p className="mt-1 text-[13px] text-mute"><Ph tail={4}>{`${d.finish}・ロゴの幅 約${logoCm(d).toFixed(1)}cm。位置や大きさを変えたいときは「修正をお願いする」からお知らせください。`}</Ph></p>
            <div className="mt-4"><ProofPair d={d} /></div>
            {d.proofReq ? (
              <p className="mt-4 rounded-lg bg-[#f6f6f5] px-4 py-3 text-[13px]"><Ph tail={4}>{`修正のご依頼を受け付けました。修正版ができたら、この画面とメールでお知らせします。（ご依頼：「${d.proofReq}」）`}</Ph></p>
            ) : asking ? (
              <form className="mt-4 space-y-2" onSubmit={(e) => { e.preventDefault(); const t = req.trim(); if (!t) return; updateDeal(d.id, (x) => addLog({ ...x, proofReq: t }, "お客様", `ロゴ配置の修正を依頼しました：「${t}」`, "mail")); setReq(""); setAsking(false); }}>
                <textarea value={req} onChange={(e) => setReq(e.target.value)} rows={3} maxLength={300} placeholder="例：ロゴをもう少し小さく、右下に寄せてください" className="w-full rounded-lg border border-line px-3 py-2 text-[14px] outline-none focus:border-ink" />
                <div className="flex gap-3">
                  <button type="submit" className="cms-btn bg-ink px-5 py-2.5 text-[13px] text-white">修正をお願いする</button>
                  <button type="button" onClick={() => setAsking(false)} className="text-[13px] text-mute underline underline-offset-4">やめる</button>
                </div>
              </form>
            ) : (
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <button type="button" onClick={async () => { if (!(await askConfirm({ title: "この配置で承認しますか？", body: "承認すると製造が始まります。修正したい場合は、承認せずに「修正をお願いする」からお知らせください。", ok: "承認する" }))) return; updateDeal(d.id, (x) => addLog(x, "お客様", `お客様の画面からロゴ配置（第${x.proofVer ?? 1}版）を承認しました`)); advance(d.id, "お客様"); }} className="cms-btn bg-ink px-5 py-2.5 text-[13px] text-white">この配置で承認する</button>
                <button type="button" onClick={() => setAsking(true)} className="text-[13px] underline underline-offset-4">修正をお願いする</button>
              </div>
            )}
          </section>
        )}

        <section className="mt-8 grid gap-6 cms-card p-6 sm:grid-cols-[160px_1fr]">
          {si >= 4 ? <ProofView d={d} label={false} className="self-start" /> : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={asset(m.img)} alt="" className="aspect-[4/3] w-full object-cover" />
          )}
          <dl className="grid grid-cols-[5.5em_1fr] gap-y-1.5 text-[13px]">
            <dt className="text-mute">製品</dt><dd><Ph>{m.name}</Ph></dd>
            <dt className="text-mute">数量</dt><dd>{d.lot}個</dd>
            <dt className="text-mute">仕様</dt><dd>{d.color}・ロゴ{d.finish}</dd>
            <dt className="text-mute">合計</dt><dd>{yenOf(a.total)}（税込）</dd>
            {d.tracking && si >= 7 && (<><dt className="text-mute">追跡番号</dt><dd>{d.tracking}</dd></>)}
          </dl>
        </section>

        <section className="mt-6 cms-card">
          <p className="border-b border-line px-6 py-3.5 text-[13.5px] font-medium">書類</p>
          <ul className="divide-y divide-line">
            {docs.map((k) => (
              <li key={k.id}><Link href={`/cms/doc/?id=${d.id}&type=${k.id}`} className="flex items-center gap-3 px-6 py-3 text-[13px] hover:bg-paper"><FileText size={15} className="text-mute" />{k.ja}<span className="ml-auto text-[12px] text-mute">開く</span></Link></li>
            ))}
            {!docs.length && <li className="px-6 py-4 text-[13px] text-mute">まだ書類はありません。</li>}
          </ul>
        </section>

        <section className="mt-6">
          <p className="text-[13.5px] font-medium">これまでの流れ</p>
          <ul className="mt-3 space-y-2">
            {d.logs.filter((l) => l.kind === "mail" || l.who === "お客様" || l.text.startsWith("LPのフォームから")).slice(0, 8).map((l, i) => (
              <li key={i} className="flex gap-3 text-[12.5px]"><Check size={14} className="mt-0.5 shrink-0 text-mute" /><span className="flex-1"><Ph tail={4}>{l.text}</Ph></span><span className="text-mute">{l.at.slice(5).replace("-", "/")}</span></li>
            ))}
          </ul>
        </section>

        <ConfirmHost />
        <p className="mt-12 text-center text-[11px] text-mute">
          お客様が見る画面のデモです。<Link href={`/cms/deal/?id=${d.id}`} className="underline underline-offset-4">管理画面に戻る</Link>
        </p>
      </main>
    </div>
  );
}
