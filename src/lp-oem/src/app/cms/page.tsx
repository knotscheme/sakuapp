"use client";

import Link from "next/link";
import { AlertTriangle, Mail, FileText, Factory as FactoryIcon, Activity } from "lucide-react";
import { STAGES, amounts, daysLeft, modelOf, stageIndex, yenOf } from "@/lib/cms";
import { useDeals } from "@/components/cms/store";
import { Card, CardHead, DueBadge, Shell, StageBadge } from "@/components/cms/ui";

const ICON = { mail: Mail, doc: FileText, factory: FactoryIcon, system: Activity } as const;

export default function Dashboard() {
  const deals = useDeals();
  const active = deals.filter((d) => d.stage !== "done");
  const late = active.filter((d) => daysLeft(d.due) < 0);
  const soon = active.filter((d) => daysLeft(d.due) >= 0 && daysLeft(d.due) <= 2);
  const ordered = deals.filter((d) => stageIndex(d.stage) >= 2);
  const sales = ordered.reduce((s, d) => s + amounts(d).total, 0);
  const pieces = active.filter((d) => stageIndex(d.stage) >= 2).reduce((s, d) => s + d.lot, 0);
  const logs = deals.flatMap((d) => d.logs.map((l) => ({ ...l, deal: d }))).sort((a, b) => (a.at < b.at ? 1 : -1)).slice(0, 10);

  const kpis = [
    { k: "進行中の案件", v: `${active.length}件` },
    { k: "新しい問い合わせ", v: `${deals.filter((d) => d.stage === "inquiry").length}件` },
    { k: "受注金額（税込）", v: yenOf(sales) },
    { k: "製造・輸送中の数量", v: `${pieces.toLocaleString()}個` },
  ];

  return (
    <Shell title="ダッシュボード">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpis.map((x) => (
          <Card key={x.k} className="px-5 py-4">
            <p className="text-[11.5px] text-mute">{x.k}</p>
            <p className="mt-1.5 text-[22px] font-medium tabular-nums">{x.v}</p>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Card>
          <CardHead right={<Link href="/cms/deals/" className="text-[12px] text-mute hover:text-ink">案件ボードへ →</Link>}>段階ごとの案件数</CardHead>
          <ul className="divide-y divide-line">
            {STAGES.map((s) => {
              const n = deals.filter((d) => d.stage === s.id).length;
              return (
                <li key={s.id} className="flex items-center gap-4 px-5 py-2.5 text-[13px]">
                  <span className="w-32 shrink-0 text-ink/80">{s.ja}</span>
                  <span className="relative h-1.5 flex-1 bg-paper"><span className="absolute inset-y-0 left-0 bg-ink" style={{ width: `${(n / Math.max(1, deals.length)) * 100 * 2.5}%`, maxWidth: "100%" }} /></span>
                  <span className="w-8 text-right tabular-nums">{n}</span>
                </li>
              );
            })}
          </ul>
        </Card>

        <Card>
          <CardHead>期日のお知らせ</CardHead>
          {late.length + soon.length === 0 && <p className="px-5 py-6 text-[13px] text-mute">期日が近い案件はありません。</p>}
          <ul className="divide-y divide-line">
            {[...late, ...soon].map((d) => (
              <li key={d.id}>
                <Link href={`/cms/deal/?id=${d.id}`} className="flex items-center gap-3 px-5 py-3 hover:bg-paper">
                  <AlertTriangle size={15} className={daysLeft(d.due) < 0 ? "text-red-600" : "text-gold"} />
                  <span className="flex-1 truncate text-[13px]">{d.brand}<span className="ml-2 text-mute">{modelOf(d.model).short}×{d.lot}</span></span>
                  <StageBadge stage={d.stage} />
                  <DueBadge due={d.due} stage={d.stage} />
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHead>最近の動き（自動の書類作成・メール送信を含む）</CardHead>
        <ul className="divide-y divide-line">
          {logs.map((l, i) => {
            const Icon = ICON[l.kind ?? "system"];
            return (
              <li key={i}>
                <Link href={`/cms/deal/?id=${l.deal.id}`} className="flex items-start gap-3 px-5 py-3 hover:bg-paper">
                  <Icon size={15} className="mt-0.5 shrink-0 text-mute" />
                  <span className="flex-1 text-[13px] leading-relaxed"><b className="font-medium">{l.deal.brand}</b>　{l.text}</span>
                  <span className="shrink-0 text-[11px] text-mute">{l.at.slice(5).replace("-", "/")}・{l.who}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Card>
    </Shell>
  );
}
