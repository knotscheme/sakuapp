"use client";

import { Ph } from "@/components/cms/Ph";

import Link from "next/link";
import { AlertTriangle, MessageSquare, Mail, FileText, Factory as FactoryIcon, Activity } from "lucide-react";
import { STAGES, amounts, daysLeft, modelOf, stageIndex, yenOf } from "@/lib/cms";
import { useDeals } from "@/components/cms/store";
import { Card, CardHead, DueBadge, Shell, StageBadge, TechNote, NoAccess } from "@/components/cms/ui";
import { useAuth } from "@/components/cms/perm";

const ICON = { mail: Mail, doc: FileText, factory: FactoryIcon, system: Activity } as const;

export default function Dashboard() {
  const deals = useDeals();
  const factoryMsgs = deals.flatMap((d) => (d.msgs ?? []).filter((m) => m.from === "factory").map((m) => ({ d, m }))).sort((a, b) => (a.m.read === b.m.read ? b.m.at.localeCompare(a.m.at) : a.m.read ? 1 : -1));
  const unread = factoryMsgs.filter((x) => !x.m.read).length;
  const { can } = useAuth();
  const active = deals.filter((d) => d.stage !== "done");
  const late = active.filter((d) => daysLeft(d.due) < 0);
  const soon = active.filter((d) => daysLeft(d.due) >= 0 && daysLeft(d.due) <= 2);
  const ordered = deals.filter((d) => stageIndex(d.stage) >= 2);
  const sales = ordered.reduce((s, d) => s + amounts(d).total, 0);
  const pieces = active.filter((d) => stageIndex(d.stage) >= 2).reduce((s, d) => s + d.lot, 0);
  const logs = deals.flatMap((d) => d.logs.map((l) => ({ ...l, deal: d }))).sort((a, b) => (a.at < b.at ? 1 : -1)).slice(0, 10);

  if (!can("deals.view")) return <Shell title="ダッシュボード"><NoAccess /></Shell>;
  const kpis = [
    { k: "進行中の案件", v: `${active.length}件`, href: "/cms/deals/?stage=active" },
    { k: "新しい問い合わせ", v: `${deals.filter((d) => d.stage === "inquiry").length}件`, href: "/cms/deals/?stage=inquiry" },
    { k: "受注金額（税込）", v: can("money.view") ? `${(sales / 10000).toLocaleString("ja-JP", { maximumFractionDigits: 1 })}万円` : "—", href: can("analytics.view") ? "/cms/analytics/" : "/cms/deals/?view=list" },
    { k: "製造・輸送中の数量", v: `${pieces.toLocaleString()}個`, href: "/cms/deals/?stage=order,proof,production,transit,inspection,shipping" },
  ];

  return (
    <Shell title="ダッシュボード" note="数字は Supabase（データベース）の案件データを集計して表示">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {kpis.map((x) => (
          <Link key={x.k} href={x.href} className="cms-card group block px-5 py-5 transition hover:shadow-md">
            <p className="flex items-center justify-between text-[11.5px] text-mute">{x.k}<span className="transition group-hover:translate-x-0.5 group-hover:text-ink">→</span></p>
            <p className="mt-2 text-[22px] font-semibold whitespace-nowrap tabular-nums sm:text-[24px]">{x.v}</p>
          </Link>
        ))}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        <Card>
          <CardHead right={<Link href="/cms/deals/" className="tap text-[12px] text-mute hover:text-ink">案件ボードへ →</Link>}>段階ごとの案件数</CardHead>
          <ul className="divide-y divide-line border-t border-line">
            {STAGES.map((s) => {
              const n = deals.filter((d) => d.stage === s.id).length;
              return (
                <li key={s.id}>
                  <Link href={`/cms/deals/?stage=${s.id}`} className="flex items-center gap-4 px-5 py-3 text-[13px] hover:bg-[#fafafa]">
                  <span className="w-32 shrink-0 text-ink/80"><Ph>{s.ja}</Ph></span>
                  <span className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-[#f1f1f0]"><span className="absolute inset-y-0 left-0 rounded-full bg-ink" style={{ width: `${(n / Math.max(1, deals.length)) * 100 * 2.5}%`, maxWidth: "100%" }} /></span>
                  <span className="w-8 text-right tabular-nums">{n}</span>
                  <span className="text-mute">›</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Card>

        <div className="space-y-5">
        {/* 工場からの連絡（新しいものを上に） */}
        <Card>
          <CardHead note="工場が連絡すると、担当に LINE・メールでも通知" right={unread > 0 ? <span className="rounded-full bg-red-600 px-2 py-0.5 text-[11px] text-white">未読 {unread}</span> : undefined}>工場からの連絡</CardHead>
          {!factoryMsgs.length && <p className="border-t border-line px-5 py-6 text-[13px] text-mute">工場からの連絡はありません。</p>}
          <ul className="divide-y divide-line border-t border-line">
            {factoryMsgs.slice(0, 3).map(({ d, m }) => (
              <li key={m.id}>
                <Link href={`/cms/messages/?id=${d.id}`} className="flex items-start gap-3 px-5 py-3.5 hover:bg-[#fafafa]">
                  <MessageSquare size={15} className={`mt-0.5 shrink-0 ${m.read ? "text-mute" : "text-red-600"}`} />
                  <span className="min-w-0 flex-1 text-[13px]">
                    <span className="block truncate"><span className={m.read ? "" : "font-semibold"}>{d.brand}</span><span className="ml-2 text-[11.5px] text-mute">{d.id}</span></span>
                    <span className="block truncate text-ink/75">{m.t ? m.t.ja : m.raw}</span>{!m.t && <span className="block text-[11px] text-mute">原文のまま（本番では日本語に自動翻訳）</span>}
                  </span>
                  {!m.read && <span className="shrink-0 rounded bg-[#fbe4e4] px-1.5 py-px text-[10.5px] text-red-700">新着</span>}
                </Link>
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <CardHead note="毎朝、Supabase の定期実行（Cron）で期日をチェックし、担当にメール通知">期日のお知らせ</CardHead>
          {late.length + soon.length === 0 && <p className="px-5 py-6 text-[13px] text-mute">期日が近い案件はありません。</p>}
          <ul className="divide-y divide-line border-t border-line">
            {[...late, ...soon].map((d) => (
              <li key={d.id}>
                <Link href={`/cms/deal/?id=${d.id}`} className="flex items-center gap-3 px-5 py-3.5 hover:bg-[#fafafa]">
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
      </div>

      <Card className="mt-5">
        <CardHead note="すべての操作を履歴テーブル（activity_logs）に記録">最近の動き</CardHead>
        <ul className="divide-y divide-line border-t border-line">
          {logs.map((l, i) => {
            const Icon = ICON[l.kind ?? "system"];
            return (
              <li key={i}>
                <Link href={`/cms/deal/?id=${l.deal.id}`} className="flex items-start gap-3 px-5 py-3.5 hover:bg-[#fafafa]">
                  <Icon size={15} className="mt-0.5 shrink-0 text-mute" />
                  <span className="flex-1 text-[13px] leading-relaxed"><b className="font-medium">{l.deal.brand}</b>　<Ph tail={4}>{l.text}</Ph></span>
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
