"use client";

import { useRef, useState } from "react";
import { MessageSquareWarning, RotateCcw, Send, Upload } from "lucide-react";
import { stageIndex, type Deal } from "@/lib/cms";
import { addLog, updateDeal } from "@/components/cms/store";
import { askConfirm } from "@/components/cms/Confirm";
import { Card, CardHead, TechNote } from "@/components/cms/ui";
import { Ph } from "@/components/cms/Ph";
import { STAMP, ProofPair, logoSize, pctOfCm, placeOf, sizeText, toLogoMask, widthRange } from "@/components/cms/Proof";

// 案件の画面：ロゴ配置イメージを作る・直す・お客様に送る
export function ProofCard({ d, canEdit, who }: { d: Deal; canEdit: boolean; who: string }) {
  const si = stageIndex(d.stage);
  const editable = canEdit && si <= 3; // 製造に入るまで直せる
  const approved = si >= 4;
  const p = placeOf(d);
  const size = logoSize(d);
  const range = widthRange(d);
  const fileRef = useRef<HTMLInputElement>(null);
  const [err, setErr] = useState("");

  const set = (k: "x" | "y" | "w", v: number) => updateDeal(d.id, (x) => ({ ...x, place: { ...placeOf(x), [k]: v } }));
  const upload = async (f?: File) => {
    setErr("");
    if (!f) return;
    const r = await toLogoMask(f);
    if (!r) { setErr("png・jpg・svg の画像を選んでください（ai・pdf・eps は本番ではサーバーで画像に変換）"); return; }
    updateDeal(d.id, (x) => addLog({ ...x, logo: r.src, logoAspect: r.ar }, who, `ロゴデータを差し替えました（${f.name}）`, "system"));
  };
  const sendRevision = async () => {
    const v = (d.proofVer ?? 1) + 1;
    if (!(await askConfirm({ title: `修正版（第${v}版）を送りますか？`, body: "お客様に、修正したロゴ配置イメージがメールで届きます。", ok: "送る" }))) return;
    updateDeal(d.id, (x) => addLog({ ...x, proofVer: v, proofReq: undefined }, who, `修正したロゴ配置イメージ（第${v}版）をお客様に送りました`, "mail"));
  };

  const status = approved ? `お客様が承認済み（第${d.proofVer ?? 1}版）。この配置で製造します`
    : d.stage === "proof" ? (d.proofReq ? `お客様から修正の依頼があります（第${d.proofVer ?? 1}版）` : `お客様に送付済み（第${d.proofVer ?? 1}版）・承認待ち`)
    : si < 2 ? "ご注文（発注・入金）のあとに、お客様へ送ります。いまのうちに配置を準備できます"
    : "まだ送っていません。「ロゴ配置イメージを送る」でお客様に届きます";

  const slider = (k: "x" | "y" | "w", label: string, min: number, max: number) => (
    <label className="flex items-center gap-3 text-[12px]">
      <span className="w-16 shrink-0 text-mute">{label}</span>
      <input type="range" min={min} max={max} step={0.5} value={p[k]} onChange={(e) => set(k, Number(e.target.value))} className="min-w-0 flex-1 accent-ink" aria-label={label} />
    </label>
  );

  return (
    <Card>
      <CardHead note="お客様のロゴは Storage に保存し、配置（位置・大きさ）は版ごとに proofs テーブルに記録。承認された版が製造指示書に載る"
        right={<span className="text-[11.5px] text-mute">{d.finish}・{sizeText(d)}</span>}>ロゴ配置イメージ</CardHead>
      <div className="px-5 pb-5">
        <ProofPair d={d} />
        <p className={`mt-3 text-[12.5px] ${d.proofReq ? "text-[#8a650c]" : approved ? "text-[#2f7a46]" : "text-mute"}`}><Ph tail={4}>{status}</Ph></p>
        {d.proofReq && (
          <div className="mt-3 flex gap-2.5 rounded-lg bg-[#fbf3e2] px-4 py-3 text-[13px]">
            <MessageSquareWarning size={16} className="mt-0.5 shrink-0 text-[#8a650c]" />
            <p>お客様からの修正の依頼：「{d.proofReq}」</p>
          </div>
        )}
        {editable && (
          <div className="mt-4 space-y-3 border-t border-line pt-4">
            {slider("x", "左右", 5, 95)}
            {slider("y", "上下", 5, 95)}
            <label className="flex items-center gap-3 text-[12px]">
              <span className="w-16 shrink-0 text-mute">大きさ</span>
              <input type="range" min={range.lo} max={range.hi} step={0.1} value={Math.round(size.w * 10) / 10} onChange={(e) => set("w", pctOfCm(d.model, Number(e.target.value)))} className="min-w-0 flex-1 accent-ink" aria-label="大きさ" />
              <span className="w-12 shrink-0 text-right tabular-nums">{size.w.toFixed(1)}cm</span>
            </label>
            <p className="text-[11.5px] leading-relaxed text-mute">
              刻印できる大きさは、縦{STAMP.minH}〜{STAMP.maxH}cm × 横{STAMP.minW}〜{STAMP.maxW}cm です。
              いまのロゴ：{sizeText(d)}（版の大きさ 縦{size.plateH.toFixed(1)}×横{size.plateW.toFixed(1)}cm）
              {range.hi < STAMP.maxW && `。このロゴは縦に長いため、縦${STAMP.maxH}cmにおさまる大きさ（横${range.hi.toFixed(1)}cmまで）にしています`}
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button type="button" onClick={() => fileRef.current?.click()} className="cms-btn inline-flex items-center gap-1.5 border border-line px-3 py-2 text-[12.5px] hover:border-ink"><Upload size={14} />{d.logo ? "ロゴを差し替える" : "ロゴをアップロード"}</button>
              <button type="button" onClick={() => updateDeal(d.id, (x) => ({ ...x, place: undefined }))} className="inline-flex items-center gap-1.5 px-2 py-2 text-[12.5px] text-mute hover:text-ink"><RotateCcw size={13} />最初の位置に戻す</button>
              {d.stage === "proof" && d.proofReq && (
                <button type="button" onClick={sendRevision} className="cms-btn ml-auto inline-flex items-center gap-1.5 bg-ink px-3.5 py-2 text-[12.5px] text-white"><Send size={13} />修正版を送る</button>
              )}
              <input ref={fileRef} type="file" accept=".png,.jpg,.jpeg,.svg,.webp" className="sr-only" onChange={(e) => { upload(e.target.files?.[0]); e.target.value = ""; }} />
            </div>
            {err && <p className="text-[12px] text-red-600">{err}</p>}
            {!d.logo && <p className="text-[11.5px] text-mute">ロゴデータが届いていないため、ブランド名を仮のロゴにしています。</p>}
            <TechNote>白い背景のロゴは自動で透明にし、箔押し・素押しの見た目で重ねる</TechNote>
          </div>
        )}
      </div>
    </Card>
  );
}
