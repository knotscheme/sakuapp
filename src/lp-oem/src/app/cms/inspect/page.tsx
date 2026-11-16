"use client";

import Link from "next/link";
import { Camera, Check, Minus, Plus } from "lucide-react";
import { CHECKS, modelOf } from "@/lib/cms";
import { asset } from "@/lib/asset";
import { addLog, advance, updateDeal, useDeals } from "@/components/cms/store";
import { Card, Shell, TechNote } from "@/components/cms/ui";
import { askConfirm } from "@/components/cms/Confirm";

// 国内検品：スマホで、チェック・不良数・写真を登録する
export default function InspectPage() {
  const list = useDeals().filter((d) => d.stage === "inspection" || d.stage === "transit");

  return (
    <Shell title="国内検品" note="検品結果は inspections テーブルに保存し、検品報告書PDFを自動作成">
      <p className="mb-6 text-[13px] text-mute">日本の検品担当がスマホで使う画面です。届いた荷物を検品し、合格したらそのまま発送に進めます。</p>
      <div className="grid gap-5 lg:grid-cols-2">
        {list.map((d) => {
          const m = modelOf(d.model);
          const arrived = d.stage === "inspection";
          const all = d.checks.every(Boolean);
          return (
            <Card key={d.id}>
              <div className="flex items-center gap-4 border-b border-line p-5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset(m.img)} alt="" className="aspect-[4/3] w-20 object-cover" />
                <div className="flex-1 text-[13px]">
                  <Link href={`/cms/deal/?id=${d.id}`} className="font-medium underline-offset-4 hover:underline">{d.id}　{d.brand}</Link>
                  <p className="text-ink/80">{m.short}・{d.lot}個・{d.color}・{d.finish}</p>
                  <p className="text-[11.5px] text-mute">{arrived ? "到着済み・検品中" : `輸送中（${d.tracking}）`}</p>
                </div>
              </div>
              {arrived ? (
                <>
                  <ul className="divide-y divide-line">
                    {CHECKS.map((c, i) => (
                      <li key={c}>
                        <button type="button" onClick={() => updateDeal(d.id, (x) => ({ ...x, checks: x.checks.map((v, k) => (k === i ? !v : v)) }))} className="flex w-full items-center gap-3 px-5 py-3.5 text-left text-[14px]">
                          <span className={`flex h-5 w-5 items-center justify-center rounded-md border ${d.checks[i] ? "border-ink bg-ink text-white" : "border-line"}`}>{d.checks[i] && <Check size={13} />}</span>
                          {c}
                        </button>
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-between border-t border-line px-5 py-3 text-[13px]">
                    <span>不良の数</span>
                    <span className="flex items-center gap-3">
                      <button type="button" aria-label="減らす" onClick={() => updateDeal(d.id, (x) => ({ ...x, defects: Math.max(0, x.defects - 1) }))} className="rounded-md border border-line p-2.5"><Minus size={13} /></button>
                      <span className="w-6 text-center tabular-nums">{d.defects}</span>
                      <button type="button" aria-label="増やす" onClick={() => updateDeal(d.id, (x) => ({ ...x, defects: x.defects + 1 }))} className="rounded-md border border-line p-2.5"><Plus size={13} /></button>
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3 border-t border-line px-5 py-3">
                    <button type="button" onClick={() => updateDeal(d.id, (x) => addLog(x, "検品", "検品の写真を登録しました"))} className="flex items-center gap-1.5 text-[12px] text-mute hover:text-ink"><Camera size={14} />写真を登録</button>
                    <TechNote className="hidden sm:flex">スマホのカメラで撮影→Storage</TechNote>
                    <button type="button" disabled={!all} onClick={async () => { if (!(await askConfirm({ title: "検品OKにして発送しますか？", body: `良品${d.lot - d.defects}個・不良${d.defects}個。検品報告書と納品書が作られ、お客様に発送のお知らせが届きます。`, ok: "発送する" }))) return; updateDeal(d.id, (x) => addLog(x, "検品", `検品が完了しました（良品${x.lot - x.defects}・不良${x.defects}）`)); advance(d.id, "検品"); }}
                      className="cms-btn bg-ink px-4 py-2 text-[12.5px] text-white disabled:bg-line disabled:text-mute">検品OK・発送する</button>
                  </div>
                </>
              ) : (
                <p className="px-5 py-4 text-[12.5px] text-mute">到着すると、ここで検品できるようになります。（デモでは案件の画面から「日本に到着」に進められます）</p>
              )}
            </Card>
          );
        })}
      </div>
    </Shell>
  );
}
