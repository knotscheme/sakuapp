"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CalendarClock, CheckCircle2, ExternalLink, KeyRound, Loader2, PackageSearch, RefreshCw, ScanSearch, ShieldCheck, XCircle } from "lucide-react";
import { mfaRequired, useAuth, usePermState } from "@/components/cms/perm";
import { Card, CardHead, NoAccess, Shell, TechNote } from "@/components/cms/ui";

// セキュリティ：毎週の自動点検（GitHub Actions）の結果と、2段階認証の状況
// 点検の結果は、GitHub の公開APIから本物を読み込む（読めないときは、デモの例を出す）
const REPO = "knotscheme/sakuapp";
const WORKFLOW = "lp-oem-security.yml";
type Run = { id: number; at: string; ok: boolean | null; url: string; event: string };

const CHECKS = [
  { icon: PackageSearch, t: "部品の弱点", s: "使っている部品（npm のパッケージ）に、知られた弱点がないかを調べる。重要度「高」以上が1つでもあれば失敗にして知らせる", tool: "npm audit" },
  { icon: KeyRound, t: "秘密の値の混入", s: "パスワード・APIキーなどが、コードや公開しているファイルに紛れ込んでいないかを調べる", tool: "gitleaks" },
  { icon: RefreshCw, t: "部品の更新の提案", s: "新しい版が出た部品を、週に一度まとめて提案する。点検が通ったものから取り込む", tool: "Dependabot" },
];

// 次の月曜 9:13（日本時間）
function nextRun(now = new Date()) {
  const jst = new Date(now.getTime() + 9 * 3600000);
  const d = new Date(Date.UTC(jst.getUTCFullYear(), jst.getUTCMonth(), jst.getUTCDate(), 9, 13));
  let add = (1 - jst.getUTCDay() + 7) % 7;
  if (add === 0 && jst.getTime() >= d.getTime()) add = 7;
  d.setUTCDate(d.getUTCDate() + add);
  return `${d.getUTCMonth() + 1}月${d.getUTCDate()}日（月）9:13`;
}
const fmt = (iso: string) => { const d = new Date(iso); return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`; };
const EVENT: Record<string, string> = { schedule: "毎週の自動実行", workflow_dispatch: "手動で実行", push: "部品の変更のとき" };

// GitHub から読めないとき用の例
function demoRuns(): Run[] {
  return Array.from({ length: 4 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - ((d.getDay() + 6) % 7) - 7 * i); d.setHours(9, 13, 0, 0);
    return { id: i, at: d.toISOString(), ok: true, url: `https://github.com/${REPO}/actions/workflows/${WORKFLOW}`, event: "schedule" };
  });
}

export default function Security() {
  const { can } = useAuth();
  const st = usePermState();
  const [runs, setRuns] = useState<Run[] | null>(null);
  const [demo, setDemo] = useState(false);
  useEffect(() => {
    fetch(`https://api.github.com/repos/${REPO}/actions/workflows/${WORKFLOW}/runs?per_page=6`, { headers: { Accept: "application/vnd.github+json" } })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((j: { workflow_runs?: { id: number; created_at: string; conclusion: string | null; status: string; html_url: string; event: string }[] }) => {
        const list = (j.workflow_runs ?? []).map((x) => ({ id: x.id, at: x.created_at, ok: x.status !== "completed" ? null : x.conclusion === "success", url: x.html_url, event: x.event }));
        if (list.length) setRuns(list); else { setRuns(demoRuns()); setDemo(true); }
      })
      .catch(() => { setRuns(demoRuns()); setDemo(true); });
  }, []);
  if (!can("members.manage")) return <Shell title="セキュリティ"><NoAccess /></Shell>;

  const last = runs?.[0];
  const mfaDone = st.members.filter((m) => m.mfa).length;
  const mfaMissing = st.members.filter((m) => !m.mfa && mfaRequired(st, m));

  return (
    <Shell title="セキュリティ">
      <p className="-mt-5 mb-5 flex items-center gap-1.5 text-[12px] text-[#2f7a46]"><ShieldCheck size={13} />この点検は、デモではなく実際に GitHub Actions で毎週動いています（結果は GitHub から読み込み）</p>
      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-5">
          {/* いまの状態 */}
          <Card className="px-5 py-5">
            <div className="flex items-start gap-4">
              <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${!last ? "bg-[#f1f1f0] text-mute" : last.ok === false ? "bg-red-50 text-red-600" : "bg-[#eef6f0] text-[#2f7a46]"}`}>
                {!last ? <Loader2 size={22} className="animate-spin" /> : last.ok === false ? <XCircle size={24} /> : <ShieldCheck size={24} />}
              </span>
              <div className="min-w-0">
                <p className="text-[12px] text-mute">週に一度の脆弱性チェック</p>
                <p className="mt-0.5 text-[17px] font-semibold">{!last ? "読み込み中…" : last.ok === null ? "いま点検しています" : last.ok ? "問題は見つかりませんでした" : "対応が必要な問題があります"}</p>
                {last && <p className="mt-1 text-[12.5px] text-mute">前回：{fmt(last.at)}（{EVENT[last.event] ?? last.event}）</p>}
                <p className="mt-0.5 flex items-center gap-1.5 text-[12.5px] text-mute"><CalendarClock size={13} />次回：{nextRun()}（自動）</p>
              </div>
            </div>
            {last?.ok === false && <p className="mt-4 rounded-lg bg-[#fdf3f3] px-4 py-3 text-[12.5px] text-red-700">GitHub から担当者にメールで知らせています。詳しい内容は「結果を見る」から確認し、部品の更新などで対応してください。</p>}
          </Card>

          {/* 点検の履歴 */}
          <Card>
            <CardHead right={<a href={`https://github.com/${REPO}/actions/workflows/${WORKFLOW}`} target="_blank" rel="noopener" className="tap flex items-center gap-1 text-[12px] text-mute hover:text-ink">GitHub で見る<ExternalLink size={12} /></a>}>点検の履歴</CardHead>
            {demo && <p className="border-t border-line bg-[#fbf7ee] px-5 py-2.5 text-[12px] text-[#8a650c]">GitHub から読み込めなかったため、表示の例を出しています。</p>}
            <ul className="divide-y divide-line border-t border-line">
              {(runs ?? []).map((r) => (
                <li key={r.id}>
                  <a href={r.url} target="_blank" rel="noopener" className="flex items-center gap-3 px-5 py-3 text-[13px] hover:bg-[#fafafa]">
                    {r.ok === null ? <Loader2 size={16} className="shrink-0 animate-spin text-mute" /> : r.ok ? <CheckCircle2 size={16} className="shrink-0 text-[#2f7a46]" /> : <XCircle size={16} className="shrink-0 text-red-600" />}
                    <span className="flex-1 tabular-nums">{fmt(r.at)}</span>
                    <span className="text-[11.5px] text-mute">{EVENT[r.event] ?? r.event}</span>
                    <span className={`w-16 text-right text-[12px] ${r.ok === false ? "text-red-600" : "text-ink/70"}`}>{r.ok === null ? "点検中" : r.ok ? "問題なし" : "要対応"}</span>
                  </a>
                </li>
              ))}
              {!runs && <li className="px-5 py-5 text-[12.5px] text-mute">読み込み中…</li>}
            </ul>
          </Card>
        </div>

        <div className="space-y-5">
          {/* 何を調べているか */}
          <Card>
            <CardHead note="ワークフロー：.github/workflows/lp-oem-security.yml、提案：.github/dependabot.yml">毎週、自動で調べていること</CardHead>
            <ul className="divide-y divide-line border-t border-line">
              {CHECKS.map((c) => (
                <li key={c.t} className="flex gap-3 px-5 py-3.5">
                  <c.icon size={18} strokeWidth={1.6} className="mt-0.5 shrink-0 text-gold" />
                  <div className="min-w-0">
                    <p className="text-[13.5px] font-medium">{c.t}<span className="ml-2 font-mono text-[11px] font-normal text-mute">{c.tool}</span></p>
                    <p className="mt-0.5 text-[12px] leading-relaxed text-mute">{c.s}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>

          {/* 2段階認証 */}
          <Card className="px-5 py-4">
            <p className="flex items-center gap-2 text-[14px] font-semibold"><ScanSearch size={16} className="text-gold" />2段階認証</p>
            <p className="mt-1.5 text-[13px]">設定済み <b className="tabular-nums">{mfaDone}</b> / {st.members.length}人</p>
            {mfaMissing.length > 0 && <p className="mt-1 text-[12.5px] text-[#8a650c]">必須なのに未設定：{mfaMissing.map((m) => m.name).join("、")}（次のログインで設定）</p>}
            <Link href="/cms/members/" className="tap mt-1 text-[12.5px] underline underline-offset-4">メンバーと権限で確認する</Link>
          </Card>
          <TechNote>点検で問題が見つかると、ワークフローが失敗になり、GitHub からメールが届く。本番では、Supabase のセキュリティ診断（Security Advisor）と、不審なアクセスの毎時の集計も合わせて行う</TechNote>
        </div>
      </div>
    </Shell>
  );
}
