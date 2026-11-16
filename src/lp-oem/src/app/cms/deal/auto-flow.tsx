"use client";

import Link from "next/link";
import { Bot, Check, Clock, User } from "lucide-react";
import { stageIndex, type Deal, type DraftKind } from "@/lib/cms";
import { Card, CardHead } from "@/components/cms/ui";

// 自動化の流れ：どこを自動でやり、どこで人が確認するか。いまどこまで進んだか
type St = "done" | "review" | "wait" | "todo";
export function AutoFlow({ d }: { d: Deal }) {
  const si = stageIndex(d.stage);
  const dr = (k: DraftKind) => d.drafts?.find((x) => x.kind === k && x.status === "draft");
  const sent = (k: DraftKind) => d.drafts?.some((x) => x.kind === k && x.status === "sent");
  const steps: { t: string; by: "auto" | "auto+human" | "customer"; st: St; note: string; href?: string }[] = [
    { t: "問い合わせの受付", by: "auto", st: "done", note: "LPのフォームから、案件を自動で作成" },
    { t: "返信と見積の作成", by: "auto+human", st: si >= 1 || sent("reply") ? "done" : dr("reply") ? "review" : "todo", note: "下書きを自動で作成 → 人が確認して送信", href: dr("reply") && `/cms/inbox/?id=${dr("reply")!.id}` },
    { t: "注文の確定・請求書", by: "customer", st: si >= 2 ? "done" : si === 1 ? "wait" : "todo", note: "お客様が見積を承諾すると、自動で確定して請求書を送付" },
    { t: "前金の入金確認", by: "auto", st: d.paid ? "done" : si === 2 ? "wait" : "todo", note: "決済・振込を自動で照合（期日を過ぎたら、お願いの下書き）" },
    { t: "ロゴ配置案の送付", by: "auto+human", st: si >= 3 ? "done" : dr("proof") ? "review" : "todo", note: "入金を確認したら下書きを自動で作成 → 人が確認して送信", href: dr("proof") && `/cms/inbox/?id=${dr("proof")!.id}` },
    { t: "お客様のロゴ承認", by: "customer", st: d.proofOk || si >= 4 ? "done" : si === 3 ? "wait" : "todo", note: "お客様の画面で承認（修正の依頼もここから）" },
    { t: "タイの工場への発注", by: "auto+human", st: si >= 4 ? "done" : dr("factory") ? "review" : "todo", note: "発注書を自動で作成 → 人が最終確認して発注", href: dr("factory") && `/cms/inbox/?id=${dr("factory")!.id}` },
  ];
  const BY = { auto: { ja: "自動", icon: Bot }, "auto+human": { ja: "自動 → 人", icon: Bot }, customer: { ja: "お客様", icon: User } } as const;
  return (
    <Card>
      <CardHead note="きっかけ（問い合わせ・承諾・入金・承認）ごとに Edge Function が動き、下書き・書類・メールを自動で作る">自動化の流れ</CardHead>
      <ol className="border-t border-line px-5 py-3">
        {steps.map((s, i) => {
          const B = BY[s.by];
          return (
            <li key={s.t} className="relative flex gap-3 pb-3 last:pb-0">
              {i < steps.length - 1 && <span className="absolute top-6 bottom-0 left-[11px] w-px bg-line" />}
              <span className={`relative z-[1] mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${s.st === "done" ? "bg-ink text-white" : s.st === "review" ? "bg-[#2a4f9e] text-white" : s.st === "wait" ? "bg-[#fbf3e2] text-[#8a650c]" : "border border-line bg-white text-mute"}`}>
                {s.st === "done" ? <Check size={12} /> : s.st === "wait" ? <Clock size={12} /> : <span className="text-[10px]">{i + 1}</span>}
              </span>
              <div className="min-w-0 flex-1">
                <p className="flex flex-wrap items-center gap-x-2 text-[13px]">
                  <span className={s.st === "todo" ? "text-mute" : "font-medium"}>{s.t}</span>
                  <span className="flex items-center gap-1 rounded-full bg-[#f1f1f0] px-2 py-0.5 text-[10.5px] text-ink/70"><B.icon size={10} />{B.ja}</span>
                  {s.st === "review" && s.href && <Link href={s.href} className="tap text-[12px] font-medium text-[#2a4f9e] underline underline-offset-4">確認待ち →</Link>}
                  {s.st === "wait" && <span className="text-[11.5px] text-[#8a650c]">待っています</span>}
                </p>
                <p className="text-[11.5px] leading-relaxed text-mute">{s.note}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </Card>
  );
}
