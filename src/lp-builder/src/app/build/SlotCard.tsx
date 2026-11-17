"use client";

import { useEffect, useRef, useState } from "react";
import { AlertTriangle, Copy, Crop, Lightbulb, Loader2, Sparkles, Trash2, Upload } from "lucide-react";
import { askConfirm, toast } from "@/components/Confirm";
import { generateImage, imageReady, useAi } from "@/lib/ai";
import { fillSlotPrompt } from "@/lib/prompt";
import { placeholder } from "@/lib/render";
import { putImage, removeImage, useProject } from "@/lib/project";
import { getTemplate, isDark } from "@/lib/templates";
import type { Slot } from "@/lib/types";
import { copyText } from "./StepInfo";
import CropModal from "./CropModal";

export async function addFile(slot: Slot, f: File) {
  if (!f.type.startsWith("image/") && !/\.(heic|heif|webp|avif)$/i.test(f.name)) { toast(`「${f.name}」は画像ではありません`); return false; }
  if (f.size > 40 * 1024 * 1024) { toast("40MBより大きい画像は入れられません"); return false; }
  try { await putImage(slot.id, f, "upload", f.name); return true; }
  catch { toast(`「${f.name}」を読み込めませんでした（HEICの場合は、JPEGで保存し直してください）`); return false; }
}

export default function SlotCard({ slot, index, compact = false }: { slot: Slot; index: number; compact?: boolean }) {
  const { p, urls } = useProject();
  const ai = useAi();
  const t = getTemplate(p!.tpl);
  const meta = p!.imgs[slot.id];
  const file = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState<"" | "up" | "ai">("");
  const [extra, setExtra] = useState("");
  const [crop, setCrop] = useState(false);
  const [over, setOver] = useState(false);
  const [err, setErr] = useState("");
  const [tips, setTips] = useState(false);
  useEffect(() => setErr(""), [meta]);
  const prompt = fillSlotPrompt(slot, p!.info);
  const small = meta && Math.min(meta.w, (meta.h * slot.ratio[0]) / slot.ratio[1]) / meta.zoom < slot.min;

  const upload = async (f: File) => { setBusy("up"); await addFile(slot, f); setBusy(""); };
  const gen = async () => {
    if (meta && !(await askConfirm({ title: "AIで作った画像に置きかえますか？", body: "いまの画像は消えます。", ok: "作る" }))) return;
    setBusy("ai"); setErr("");
    try { const b = await generateImage(slot, p!.info, extra); await putImage(slot.id, b, "ai", `${slot.id}-ai.png`); toast(`「${slot.label}」を作りました`); }
    catch (e) { setErr((e as Error).message); } finally { setBusy(""); }
  };
  const del = async () => { if (await askConfirm({ title: `「${slot.label}」の画像を外しますか？`, ok: "外す", danger: true })) removeImage(slot.id); };

  return (
    <div id={`slot-${slot.id}`} className={`card overflow-hidden transition ${over ? "ring-2 ring-accent" : ""}`}
      onDragOver={(e) => { e.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)}
      onDrop={(e) => { e.preventDefault(); setOver(false); const f = e.dataTransfer.files?.[0]; if (f) upload(f); }}>
      <div className={`grid ${compact ? "" : "sm:grid-cols-[minmax(0,240px)_1fr]"}`}>
        <div className="relative bg-paper p-3">
          <button type="button" onClick={() => (meta ? setCrop(true) : file.current?.click())} className="tap group relative block w-full overflow-hidden rounded-lg" aria-label={meta ? "切り抜く位置を直す" : "画像を入れる"}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={urls[slot.id] ?? placeholder(slot.label, slot.ratio, isDark(t))} alt="" className="w-full object-cover" style={{ aspectRatio: `${slot.ratio[0]} / ${slot.ratio[1]}` }} />
            {meta && <span className="absolute inset-0 grid place-items-center bg-black/0 text-white opacity-0 transition group-hover:bg-black/35 group-hover:opacity-100"><span className="flex items-center gap-1 text-[12px]"><Crop size={14} />位置を直す</span></span>}
            {busy && <span className="absolute inset-0 grid place-items-center bg-white/70"><Loader2 size={22} className="spin" /></span>}
          </button>
          <div className="mt-2 flex items-center justify-between text-[11px] text-mute">
            <span>{slot.ratio[0]}:{slot.ratio[1]}・横{slot.min}px以上</span>
            {meta && <span className="truncate pl-2">{meta.source === "ai" ? "AIで作成" : meta.source === "sample" ? "見本の写真" : "アップロード"}</span>}
          </div>
        </div>
        <div className="min-w-0 p-4 sm:p-5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="flex items-center gap-2 text-[15px] font-bold"><span className="grid h-5 w-5 place-items-center rounded-full bg-ink text-[11px] text-white">{index + 1}</span>{slot.label}{slot.optional && <span className="rounded-full bg-paper px-2 py-0.5 text-[11px] font-normal text-mute">任意</span>}</h3>
              <p className="mt-0.5 text-[12px] text-mute">使う場所：{slot.where}</p>
            </div>
            {meta && <button type="button" onClick={del} aria-label="画像を外す" className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-mute hover:bg-paper hover:text-red-600"><Trash2 size={15} /></button>}
          </div>
          {small && <p className="mt-2 flex items-center gap-1.5 text-[12px] text-[#9a6a00]"><AlertTriangle size={13} />画像が小さめです（大きな画面でぼやけることがあります）</p>}

          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" disabled={!!busy} onClick={() => file.current?.click()} className="btn btn-ink px-3.5 py-2 text-[12.5px]"><Upload size={14} />{meta ? "入れかえる" : "アップロード"}</button>
            <input ref={file} type="file" accept="image/*" hidden onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ""; if (f) upload(f); }} />
            {imageReady(ai) && <button type="button" disabled={!!busy} onClick={gen} className="btn btn-accent px-3.5 py-2 text-[12.5px]">{busy === "ai" ? <Loader2 size={14} className="spin" /> : <Sparkles size={14} />}{busy === "ai" ? "作っています…" : "AIで作る"}</button>}
            {meta && <button type="button" onClick={() => setCrop(true)} className="btn btn-line px-3.5 py-2 text-[12.5px]"><Crop size={14} />位置を直す</button>}
          </div>

          <div className="mt-3 rounded-lg bg-paper p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[11.5px] font-medium text-mute">AIに渡す指示文（画像生成AIに貼れます）</p>
              <button type="button" onClick={() => copyText(prompt)} className="flex shrink-0 items-center gap-1 text-[11.5px] font-medium hover:underline"><Copy size={12} />コピー</button>
            </div>
            <p className="mt-1 text-[12px] leading-[1.75]">{prompt}</p>
            {imageReady(ai) && <input value={extra} onChange={(e) => setExtra(e.target.value)} placeholder="追加の希望（例：背景をもっと明るく）" className="field mt-2 py-1.5 text-[12px]" />}
          </div>
          <button type="button" onClick={() => setTips(!tips)} className="mt-2 flex items-center gap-1 text-[12px] text-mute hover:text-ink"><Lightbulb size={13} />自分で撮るときのコツ</button>
          {tips && <p className="mt-1 text-[12px] leading-[1.8] text-ink/80">{slot.tips}</p>}
          {err && <p role="alert" className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-[12px] leading-[1.7] text-red-700">{err}</p>}
        </div>
      </div>
      {crop && meta && <CropModal slot={slot} onClose={() => setCrop(false)} />}
    </div>
  );
}
