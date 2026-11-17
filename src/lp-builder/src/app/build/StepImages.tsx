"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Copy, ImagePlus, Loader2, Sparkles } from "lucide-react";
import { toast } from "@/components/Confirm";
import { generateImage, imageReady, useAi } from "@/lib/ai";
import { fillSlotPrompt } from "@/lib/prompt";
import { putImage, useProject } from "@/lib/project";
import { getTemplate } from "@/lib/templates";
import SlotCard, { addFile } from "./SlotCard";
import { copyText } from "./StepInfo";

export default function StepImages({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const { p } = useProject();
  const ai = useAi();
  const t = getTemplate(p!.tpl);
  const filled = t.slots.filter((s) => p!.imgs[s.id]).length;
  const empty = t.slots.filter((s) => !p!.imgs[s.id]);
  const multi = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const [job, setJob] = useState("");

  // まとめて入れる：空いている枠に、選んだ順で入れる
  async function bulk(files: File[]) {
    const imgs = files.filter((f) => f.type.startsWith("image/") || /\.(heic|heif)$/i.test(f.name));
    if (!imgs.length) return;
    const targets = empty.length ? empty : t.slots;
    let n = 0;
    for (const [i, f] of imgs.slice(0, targets.length).entries()) {
      setJob(`入れています… ${i + 1}/${Math.min(imgs.length, targets.length)}`);
      if (await addFile(targets[i], f)) n++;
    }
    setJob("");
    toast(imgs.length > targets.length ? `${n}枚入れました（枠が足りない ${imgs.length - targets.length}枚は入れていません）` : `${n}枚入れました。違う枠に入ったものは「入れかえる」で直せます`);
  }
  async function aiAll() {
    for (const [i, s] of empty.entries()) {
      setJob(`AIで作っています… ${i + 1}/${empty.length}（${s.label}）`);
      try { const b = await generateImage(s, p!.info); await putImage(s.id, b, "ai", `${s.id}-ai.png`); }
      catch (e) { toast(`${s.label}：${(e as Error).message}`); break; }
    }
    setJob("");
  }
  const allPrompts = () => t.slots.map((s, i) => `【${i + 1}. ${s.label}（${s.ratio[0]}:${s.ratio[1]}）】\n${fillSlotPrompt(s, p!.info)}`).join("\n\n");

  return (
    <div className="fade-in">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold sm:text-[26px]">必要な写真（{t.slots.length}枚）</h1>
          <p className="mt-2 text-[14px] leading-[1.9] text-mute">撮った写真でも、AIで作った画像でもOK。入れた画像は、枠の形に合わせて自動で切り抜き・軽くします。</p>
        </div>
        <div className="w-full max-w-[260px]">
          <div className="flex justify-between text-[12px]"><span>入っている写真</span><b>{filled} / {t.slots.length}</b></div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-line"><div className="h-full rounded-full bg-ok transition-all" style={{ width: `${(filled / t.slots.length) * 100}%` }} /></div>
        </div>
      </div>

      <div onDragOver={(e) => { e.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)} onDrop={(e) => { e.preventDefault(); setOver(false); bulk(Array.from(e.dataTransfer.files)); }}
        className={`mt-6 rounded-2xl border-2 border-dashed p-5 transition sm:p-6 ${over ? "border-accent bg-accent-2" : "border-line bg-white"}`}>
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-paper"><ImagePlus size={20} /></span>
          <div className="flex-1">
            <p className="text-[14px] font-bold">まとめてアップロード</p>
            <p className="mt-0.5 text-[12.5px] leading-[1.8] text-mute">複数の写真を選ぶか、ここにドラッグすると、空いている枠に上から順番に入ります（あとで入れかえられます）。</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" disabled={!!job} onClick={() => multi.current?.click()} className="btn btn-ink px-4 py-2.5 text-[13px]"><ImagePlus size={15} />写真をえらぶ</button>
            {imageReady(ai) && empty.length > 0 && <button type="button" disabled={!!job} onClick={aiAll} className="btn btn-accent px-4 py-2.5 text-[13px]"><Sparkles size={15} />空いている{empty.length}枚をAIで作る</button>}
            <button type="button" onClick={() => copyText(allPrompts())} className="btn btn-line px-4 py-2.5 text-[13px]"><Copy size={14} />指示文をまとめてコピー</button>
          </div>
          <input ref={multi} type="file" accept="image/*" multiple hidden onChange={(e) => { const fs = Array.from(e.target.files ?? []); e.target.value = ""; bulk(fs); }} />
        </div>
        {job && <p className="mt-4 flex items-center gap-2 text-[13px]"><Loader2 size={15} className="spin" />{job}</p>}
        {!imageReady(ai) && <p className="mt-4 text-[12px] text-mute">※<Link href="/settings/" className="underline">AIの設定</Link>で画像のAIを選ぶと、ここから画像を自動で作れます。</p>}
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        {t.slots.map((s, i) => <SlotCard key={s.id} slot={s} index={i} />)}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <button type="button" onClick={onBack} className="btn btn-line px-5 py-3 text-[14px]"><ArrowLeft size={16} />基本情報へ</button>
        <div className="flex items-center gap-3">
          {empty.length > 0 && <span className="text-[12.5px] text-mute">空いている枠は、仮の画像で表示されます</span>}
          <button type="button" onClick={onNext} className="btn btn-ink px-7 py-3 text-[14px]">次へ：プレビュー<ArrowRight size={16} /></button>
        </div>
      </div>
    </div>
  );
}
