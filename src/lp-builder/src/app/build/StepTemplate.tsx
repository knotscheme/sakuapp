"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, FileUp, Loader2, RotateCcw } from "lucide-react";
import Frame from "@/components/Frame";
import { askConfirm, toast } from "@/components/Confirm";
import { readZip } from "@/lib/export";
import { importProject, newProject, useProject } from "@/lib/project";
import { SAMPLES } from "@/lib/samples";
import { sampleDoc } from "@/lib/sampleDoc";
import { TEMPLATES, getTemplate } from "@/lib/templates";

export default function StepTemplate({ initial, onDone }: { initial: string | null; onDone: () => void }) {
  const { p } = useProject();
  const [pick, setPick] = useState(initial && TEMPLATES.some((t) => t.id === initial) ? initial : p?.tpl ?? TEMPLATES[0].id);
  const [docs, setDocs] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const file = useRef<HTMLInputElement>(null);
  useEffect(() => { setDocs(Object.fromEntries(SAMPLES.map((s) => [s.tpl, sampleDoc(s.id)]))); }, []);

  const start = async () => {
    if (p && !(await askConfirm({ title: "新しいLPを作りはじめますか？", body: "いま作っているLP（文章と写真）は消えます。残したい場合は、先にダウンロードしてください。", ok: "新しく作る", danger: true }))) return;
    setBusy(true);
    await newProject(pick, p?.info);
    setBusy(false);
    onDone();
  };
  const changeTpl = async () => {
    // 型だけを変える：基本情報は引き継ぎ、文章は新しい型の見本から、写真は入れ直し
    if (!(await askConfirm({ title: `型を「${getTemplate(pick).name}」に変えますか？`, body: "基本情報は引き継ぎます。文章は新しい型の見本に、写真は空に戻ります（型ごとに必要な写真が違うため）。", ok: "型を変える", danger: true }))) return;
    setBusy(true);
    await newProject(pick, p!.info);
    setBusy(false);
    onDone();
  };
  const onZip = async (f: File) => {
    try {
      const { p: pj, imgs } = readZip(new Uint8Array(await f.arrayBuffer()));
      if (p && !(await askConfirm({ title: "zipの内容で置きかえますか？", body: "いま作っているLPは消えます。", ok: "読み込む", danger: true }))) return;
      setBusy(true);
      await importProject(pj, imgs);
      toast("読み込みました");
      onDone();
    } catch (e) { toast((e as Error).message); } finally { setBusy(false); }
  };

  return (
    <div className="fade-in">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold sm:text-[26px]">どんなLPにしますか？</h1>
          <p className="mt-2 text-[14px] leading-[1.9] text-mute">型をえらぶと、その型に必要な写真と文章の項目が決まります。文章は見本から始まるので、あとで入れかえるだけです。</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => file.current?.click()} className="btn btn-line px-4 py-2.5 text-[13px]"><FileUp size={15} />zipから読み込む</button>
          <input ref={file} type="file" accept=".zip,application/zip" hidden onChange={(e) => { const f = e.target.files?.[0]; e.target.value = ""; if (f) onZip(f); }} />
        </div>
      </div>

      <div className="mt-7 grid gap-5 md:grid-cols-3" role="radiogroup" aria-label="型">
        {TEMPLATES.map((t) => {
          const on = pick === t.id;
          return (
            <button key={t.id} type="button" role="radio" aria-checked={on} onClick={() => setPick(t.id)}
              className={`tap group card overflow-hidden text-left transition ${on ? "ring-2 ring-ink" : "hover:-translate-y-0.5"}`}>
              <div className="relative aspect-[4/3] overflow-hidden border-b border-line">
                {docs[t.id] && <Frame html={docs[t.id]} className="h-full w-full" title={`${t.name}の見本`} />}
                {on && <span className="absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-full bg-ink text-white shadow"><Check size={15} /></span>}
              </div>
              <div className="p-5">
                <p className="text-[11.5px] font-medium tracking-wider text-accent">{t.kind}</p>
                <h2 className="mt-0.5 font-display text-[19px] font-semibold tracking-wider">{t.name}</h2>
                <p className="mt-1.5 text-[13px] leading-[1.85] text-ink/75">{t.desc}</p>
                <p className="mt-3 text-[12px] text-mute">写真 {t.slots.length}枚・文章 {t.fields.length}項目</p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-end gap-3">
        <Link href="/works/" className="mr-auto text-[13px] underline-offset-4 hover:underline">作品例をくわしく見る</Link>
        {p && p.tpl === pick && <button type="button" onClick={onDone} className="btn btn-line px-5 py-3 text-[14px]"><RotateCcw size={15} />作りかけの続きから</button>}
        {p && p.tpl !== pick && <button type="button" disabled={busy} onClick={changeTpl} className="btn btn-line px-5 py-3 text-[14px]">いまのLPの型を変える</button>}
        <button type="button" disabled={busy} onClick={start} className="btn btn-accent px-7 py-3 text-[14px]">{busy ? <Loader2 size={16} className="spin" /> : null}{p ? "新しく作る" : "この型で作る"}<ArrowRight size={16} /></button>
      </div>
    </div>
  );
}
