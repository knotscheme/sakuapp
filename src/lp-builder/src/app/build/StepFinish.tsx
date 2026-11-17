"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Image as ImageIcon, Maximize2, Monitor, MousePointerClick, Palette, RotateCcw, Smartphone, Type, X } from "lucide-react";
import Frame from "@/components/Frame";
import FullView from "@/components/FullView";
import { colorVars, placeholder, previewDoc, safeUrl, viewDoc } from "@/lib/render";
import { getProject, resetColors, setColor, setField, useProject } from "@/lib/project";
import { SAMPLES } from "@/lib/samples";
import { getTemplate, isDark } from "@/lib/templates";
import type { Project, Template } from "@/lib/types";
import SlotCard from "./SlotCard";

const srcFor = (t: Template, p: Project, urls: Record<string, string>) => (slot: string) => {
  const s = t.slots.find((x) => x.id === slot)!;
  return urls[slot] ?? (s.optional ? "" : placeholder(s.label, s.ratio, isDark(t)));
};

export default function StepFinish({ onNext }: { onNext: () => void }) {
  const { p, urls } = useProject();
  const t = getTemplate(p!.tpl);
  const [view, setView] = useState<"pc" | "sp">("pc");
  const [tab, setTab] = useState<"text" | "color" | "img">("text");
  const [doc, setDoc] = useState("");
  const [slot, setSlot] = useState<string | null>(null);
  const [full, setFull] = useState("");
  const frame = useRef<HTMLIFrameElement>(null);
  const sample = SAMPLES.find((s) => s.tpl === t.id)!;
  // 「任意」の写真を入れた・外したときは、表示を作り直す（その写真の場所ごと出し入れするため）
  const optKey = t.slots.filter((s) => s.optional && urls[s.id]).map((s) => s.id).join(",");

  useEffect(() => { if (innerWidth < 640) setView("sp"); }, []);
  useEffect(() => {
    if (!slot) return;
    const k = (e: KeyboardEvent) => { if (e.key === "Escape" && !document.querySelector('[aria-label="切り抜く位置を直す"][role="dialog"]')) setSlot(null); };
    addEventListener("keydown", k);
    return () => removeEventListener("keydown", k);
  }, [slot]);
  // 表示を作り直すのは、型か表示の幅が変わったときだけ（文字の入力中にカーソルが飛ばないように）
  useEffect(() => {
    const cur = getProject()!;
    setDoc(previewDoc(t, cur, srcFor(t, cur, urls)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t.id, view, optKey]);
  const post = (m: Record<string, unknown>) => frame.current?.contentWindow?.postMessage({ ...m }, "*");

  // プレビューの中で直した文字・押した画像
  useEffect(() => {
    const on = (e: MessageEvent) => {
      if (e.source !== frame.current?.contentWindow) return;
      const d = e.data ?? {};
      if (d.lpb === "field" && typeof d.id === "string") setField(d.id, String(d.value ?? ""));
      if (d.lpb === "slot" && typeof d.id === "string") setSlot(d.id);
      if (d.lpb === "esc") setSlot(null);
    };
    addEventListener("message", on);
    return () => removeEventListener("message", on);
  }, []);
  // 画像・色が変わったら、プレビューに知らせる
  const prevUrls = useRef(urls);
  useEffect(() => {
    for (const s of t.slots) if (prevUrls.current[s.id] !== urls[s.id]) post({ lpb: "img", id: s.id, value: srcFor(t, p!, urls)(s.id) });
    prevUrls.current = urls;
  }, [urls, t, p]);
  useEffect(() => { post({ lpb: "vars", value: colorVars(t, p!) }); }, [p, t]);

  const edit = (id: string, v: string, url = false) => {
    setField(id, v);
    post(url ? { lpb: "url", id, value: safeUrl(v) } : { lpb: "set", id, value: v });
  };
  const groups = [...new Set(t.fields.map((f) => f.group))];
  const sampleLeft = t.fields.filter((f) => !f.url && f.id !== "brand" && p!.fields[f.id] && p!.fields[f.id] === sample.fields[f.id]).length;

  return (
    <div className="fade-in">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-bold sm:text-[26px]">プレビューで仕上げ</h1>
          <p className="mt-1.5 flex items-center gap-1.5 text-[13px] text-mute"><MousePointerClick size={14} />プレビューの文字をクリックするとその場で直せます。写真をクリックすると入れかえられます。</p>
        </div>
        <button type="button" onClick={onNext} className="btn btn-accent px-6 py-3 text-[14px]">次へ：ダウンロード<ArrowRight size={16} /></button>
      </div>
      {sampleLeft > 0 && <p className="mt-4 rounded-xl bg-[#fff6e0] px-4 py-3 text-[12.5px] leading-[1.8] text-[#7a5600]">見本のままの文章が <b>{sampleLeft}項目</b> あります。あなたの商品に合わせて直してください（「基本情報と文章」でAIにまとめて作らせることもできます）。</p>}

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
            <span className="hidden text-[12.5px] text-mute sm:inline">{view === "pc" ? "パソコン（横1280px）" : "スマホ（横390px）"}</span>
            <div className="flex items-center gap-2">
            <button type="button" onClick={() => setFull(viewDoc(t, p!, srcFor(t, p!, urls)))} title="動きも含めて、完成した状態を画面いっぱいで見ます" className="tap flex items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-[12.5px] text-white hover:bg-black"><Maximize2 size={13} />全画面で見る</button>
            <div className="flex rounded-full bg-paper p-1">
              {([["pc", Monitor, "パソコン"], ["sp", Smartphone, "スマホ"]] as const).map(([v, Icon, l]) => (
                <button key={v} type="button" onClick={() => setView(v)} aria-pressed={view === v} className={`tap flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] ${view === v ? "bg-white shadow-sm" : "text-mute"}`}><Icon size={14} />{l}</button>
              ))}
            </div>
            </div>
          </div>
          <div className={`checker ${view === "sp" ? "py-5" : ""}`}>
            {doc && (view === "pc"
              ? <Frame key="pc" html={doc} width={1280} frameRef={frame} interactive className="h-[72vh] min-h-[480px] w-full" />
              : <div className="mx-auto w-[min(390px,100%)] overflow-hidden rounded-[28px] bg-white shadow-xl ring-[6px] ring-ink"><Frame key="sp" html={doc} width={390} frameRef={frame} interactive className="h-[72vh] min-h-[540px] w-full" /></div>)}
          </div>
        </div>

        <aside className="card flex max-h-[calc(72vh+46px)] min-h-[420px] flex-col overflow-hidden">
          <div className="flex border-b border-line" role="tablist">
            {([["text", Type, "文章"], ["color", Palette, "色"], ["img", ImageIcon, "写真"]] as const).map(([k, Icon, l]) => (
              <button key={k} type="button" role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={`tap flex flex-1 items-center justify-center gap-1.5 py-3 text-[13px] ${tab === k ? "border-b-2 border-ink font-bold" : "text-mute"}`}><Icon size={14} />{l}</button>
            ))}
          </div>
          <div className="scroll-thin flex-1 overflow-y-auto p-4">
            {tab === "text" && groups.map((g) => (
              <fieldset key={g} className="mb-5">
                <legend className="mb-2 text-[12px] font-bold tracking-wider text-accent">{g}</legend>
                <div className="space-y-3">
                  {t.fields.filter((f) => f.group === g).map((f) => {
                    const v = p!.fields[f.id] ?? "";
                    const over = f.max && v.replace(/\n/g, "").length > f.max;
                    return (
                      <div key={f.id}>
                        <label htmlFor={`f-${f.id}`} className="flex justify-between text-[12px]"><span>{f.label}{f.optional && <span className="ml-1 text-mute">（空なら省きます）</span>}</span>{f.max && <span className={over ? "text-accent" : "text-mute"}>{v.replace(/\n/g, "").length}/{f.max}</span>}</label>
                        {f.multiline
                          ? <textarea id={`f-${f.id}`} rows={Math.min(5, Math.max(2, v.split("\n").length))} value={v} onFocus={() => post({ lpb: "scroll", id: f.id })} onChange={(e) => edit(f.id, e.target.value)} className="field mt-1 resize-y py-2 text-[13px] leading-[1.7]" />
                          : <input id={`f-${f.id}`} value={v} inputMode={f.url ? "url" : undefined} placeholder={f.url ? "https://" : ""} onFocus={() => post({ lpb: "scroll", id: f.url ? "ctaLabel" : f.id })} onChange={(e) => edit(f.id, e.target.value, f.url)} className="field mt-1 py-2 text-[13px]" />}
                      </div>
                    );
                  })}
                </div>
              </fieldset>
            ))}
            {tab === "color" && (
              <div className="space-y-3">
                {t.colors.map((c) => (
                  <label key={c.id} className="flex cursor-pointer items-center gap-3 rounded-xl bg-paper p-3 text-[13px]">
                    <input type="color" value={p!.colors[c.id] ?? c.value} onChange={(e) => setColor(c.id, e.target.value)} className="h-9 w-9 cursor-pointer rounded-lg border-0 bg-transparent p-0" />
                    <span className="flex-1">{c.label}</span><span className="font-mono text-[12px] text-mute">{p!.colors[c.id] ?? c.value}</span>
                  </label>
                ))}
                <button type="button" onClick={resetColors} className="flex items-center gap-1.5 pt-1 text-[12.5px] text-mute hover:text-ink"><RotateCcw size={13} />型の色に戻す</button>
              </div>
            )}
            {tab === "img" && (
              <ul className="grid grid-cols-2 gap-3">
                {t.slots.map((s) => (
                  <li key={s.id}>
                    <button type="button" onClick={() => { setSlot(s.id); post({ lpb: "scroll", id: s.id }); }} className="tap block w-full text-left">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={srcFor(t, p!, urls)(s.id) || placeholder(s.label, s.ratio, isDark(t))} alt="" className="w-full rounded-lg object-cover ring-1 ring-line" style={{ aspectRatio: `${s.ratio[0]} / ${s.ratio[1]}` }} />
                      <span className="mt-1 block truncate text-[12px]">{s.label}{s.optional && <span className="text-mute">（任意）</span>}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </div>

      {full && <FullView html={full} title="完成イメージ" onClose={() => setFull("")} />}
      {slot && (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-black/45 p-3 backdrop-blur-[2px]" onClick={() => setSlot(null)}>
          <div ref={(el) => el?.focus()} tabIndex={-1} className="fade-in max-h-[92vh] w-full max-w-[620px] overflow-y-auto rounded-2xl bg-white outline-none" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="写真を入れかえる">
            <div className="flex items-center justify-between px-4 pt-3"><p className="text-[13px] font-bold">写真を入れかえる</p><button type="button" onClick={() => setSlot(null)} aria-label="閉じる" className="grid h-9 w-9 place-items-center rounded-full hover:bg-paper"><X size={18} /></button></div>
            <div className="p-3 pt-1"><SlotCard slot={t.slots.find((s) => s.id === slot)!} index={t.slots.findIndex((s) => s.id === slot)} compact /></div>
          </div>
        </div>
      )}
    </div>
  );
}
