"use client";

import { useState } from "react";
import { AlertTriangle, ArrowLeft, Check, Code2, Copy, Download, FileArchive, Globe, Loader2, ShoppingBag } from "lucide-react";
import { toast } from "@/components/Confirm";
import { buildZip, download, wpSnippet, zipName, type Format } from "@/lib/export";
import { exportImages, useProject } from "@/lib/project";
import { SAMPLES } from "@/lib/samples";
import { getTemplate } from "@/lib/templates";
import { copyText } from "./StepInfo";

const FORMATS: { f: Exclude<Format, "all">; icon: typeof Globe; title: string; body: string; steps: string[] }[] = [
  { f: "html", icon: Globe, title: "単体のHTML", body: "そのまま公開できるホームページ一式（index.html と画像）。", steps: ["zipを開き、html フォルダの index.html をダブルクリックで確認", "フォルダごとサーバーや Netlify・GitHub Pages などに置けば公開できます"] },
  { f: "wordpress", icon: Code2, title: "WordPress 用", body: "固定ページの「カスタムHTML」ブロックに貼る形。", steps: ["images の画像をメディアにアップロード", "画像のURL（ファイル名の前まで）を下の欄に入れてから書き出す", "lp-snippet.html の中身を「カスタムHTML」ブロックに貼る"] },
  { f: "shopify", icon: ShoppingBag, title: "Shopify 用", body: "テーマに追加するセクション（.liquid）と画像。", steps: ["「コードを編集」→ sections に lp-〇〇.liquid を追加して貼る", "assets に画像をアップロード", "カスタマイズでページに「LP 〇〇」セクションを追加"] },
];

export default function StepDownload({ onBack }: { onBack: () => void }) {
  const { p } = useProject();
  const t = getTemplate(p!.tpl);
  const [busy, setBusy] = useState<Format | "">("");
  const [wp, setWp] = useState("");
  const sample = SAMPLES.find((s) => s.tpl === t.id)!;

  const missing = t.slots.filter((s) => !s.optional && !p!.imgs[s.id]);
  const sampleImgs = t.slots.filter((s) => p!.imgs[s.id]?.source === "sample");
  const sampleText = t.fields.filter((f) => !f.url && f.id !== "brand" && p!.fields[f.id] && p!.fields[f.id] === sample.fields[f.id]);
  const noUrl = !p!.fields.ctaUrl || p!.fields.ctaUrl.trim() === "#";
  const checks = [
    { ok: !missing.length, text: missing.length ? `写真が入っていない枠が${missing.length}つあります（仮の画像で書き出されます）：${missing.map((s) => s.label).join("・")}` : "写真がすべて入っています" },
    { ok: !sampleText.length, text: sampleText.length ? `見本のままの文章が${sampleText.length}項目あります` : "文章は見本から書きかえ済みです" },
    { ok: !sampleImgs.length, text: sampleImgs.length ? `見本の写真が${sampleImgs.length}枚入っています（公開するときは自分の写真に）` : "見本の写真は使っていません" },
    { ok: !noUrl, text: noUrl ? "ボタンのリンク先がまだ入っていません" : `ボタンのリンク先：${p!.fields.ctaUrl}` },
  ];

  async function go(f: Format) {
    setBusy(f);
    try {
      const imgs = await exportImages();
      const z = buildZip(t, p!, imgs, f, wp);
      download(z, zipName(p!, t, f));
      toast("ダウンロードしました");
    } catch (e) { toast(`書き出せませんでした：${(e as Error).message}`); } finally { setBusy(""); }
  }
  async function copyWp() { const imgs = await exportImages(); copyText(wpSnippet(t, p!, imgs, wp)); }

  return (
    <div className="fade-in">
      <h1 className="text-[22px] font-bold sm:text-[26px]">ダウンロード</h1>
      <p className="mt-2 text-[14px] leading-[1.9] text-mute">使う場所に合わせて、形をえらんでください。どの形のzipにも、続きを作るための project.json と、使い方（README.txt）が入っています。</p>

      <section className="card mt-6 p-5">
        <h2 className="text-[14px] font-bold">書き出す前の確認</h2>
        <ul className="mt-3 space-y-2">
          {checks.map((c) => (
            <li key={c.text} className="flex items-start gap-2 text-[13px] leading-[1.75]">
              {c.ok ? <Check size={16} className="mt-0.5 shrink-0 text-ok" /> : <AlertTriangle size={16} className="mt-0.5 shrink-0 text-[#b07a00]" />}<span className={c.ok ? "text-ink/75" : ""}>{c.text}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[12px] leading-[1.8] text-mute">※公開の前に、表現のルール（化粧品なら薬機法など）・写真の権利・人物の写真の許可を確かめてください。</p>
      </section>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {FORMATS.map(({ f, icon: Icon, title, body, steps }) => (
          <section key={f} className="card flex flex-col p-5">
            <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-paper"><Icon size={19} /></span><h2 className="text-[16px] font-bold">{title}</h2></div>
            <p className="mt-3 text-[13px] leading-[1.8] text-ink/80">{body}</p>
            <ol className="mt-3 space-y-1.5 text-[12.5px] leading-[1.75] text-mute">{steps.map((s, i) => <li key={s} className="flex gap-2"><span className="font-semibold text-ink">{i + 1}.</span><span>{s.replace("LP 〇〇", `LP ${t.name}`).replace("〇〇", t.id)}</span></li>)}</ol>
            {f === "wordpress" && (
              <div className="mt-4">
                <label htmlFor="wpbase" className="text-[12px] font-medium">画像のURL（任意）</label>
                <input id="wpbase" value={wp} onChange={(e) => setWp(e.target.value)} inputMode="url" placeholder="https://あなたのサイト/wp-content/uploads/2026/11/" className="field mt-1 py-2 text-[12.5px]" />
                <p className="mt-1 text-[11px] leading-[1.7] text-mute">空のままなら、貼ったあとに「__IMAGE_BASE__/」を置き換えます。</p>
              </div>
            )}
            <div className="mt-auto flex flex-wrap gap-2 pt-5">
              <button type="button" disabled={!!busy} onClick={() => go(f)} className="btn btn-ink flex-1 px-4 py-3 text-[13.5px]">{busy === f ? <Loader2 size={15} className="spin" /> : <Download size={15} />}zipをダウンロード</button>
              {f === "wordpress" && <button type="button" onClick={copyWp} className="btn btn-line px-4 py-3 text-[13px]" title="貼り付ける中身をコピー"><Copy size={14} />コードをコピー</button>}
            </div>
          </section>
        ))}
      </div>

      <section className="card mt-4 flex flex-col items-start gap-4 p-5 sm:flex-row sm:items-center">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent-2 text-accent"><FileArchive size={19} /></span>
        <div className="flex-1"><h2 className="text-[15px] font-bold">3つの形をまとめてダウンロード</h2><p className="mt-0.5 text-[12.5px] text-mute">html・wordpress・shopify のフォルダを1つのzipに入れます。迷ったらこちら。</p></div>
        <button type="button" disabled={!!busy} onClick={() => go("all")} className="btn btn-accent px-6 py-3 text-[14px]">{busy === "all" ? <Loader2 size={15} className="spin" /> : <Download size={15} />}まとめてダウンロード</button>
      </section>

      <div className="mt-8"><button type="button" onClick={onBack} className="btn btn-line px-5 py-3 text-[14px]"><ArrowLeft size={16} />プレビューに戻る</button></div>
    </div>
  );
}
