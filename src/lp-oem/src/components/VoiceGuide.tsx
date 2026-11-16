"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Headphones, Pause, Play, SkipForward, Square, Volume2 } from "lucide-react";

// 音声ガイド：端末の読み上げ機能（Web Speech API）で、ページを章ごとに読み上げる。追加の費用はかからない
// 章は id で指定。text が無いときは、その章の画面の文章を読む（data-nosay は読まない、data-say は置きかえて読む）
export type VoiceSection = { id: string; title: string; text?: string };
type Lang = "ja" | "th" | "en";
const LOCALE: Record<Lang, string> = { ja: "ja-JP", th: "th-TH", en: "en-US" };
const T = {
  ja: { listen: "音声ガイド", all: "最初から聞く", this: "この章を聞く", stop: "止める", pause: "一時停止", resume: "続きから", next: "次の章", speed: "速さ", none: "この端末には日本語の読み上げ音声がありません。", unsupported: "このブラウザは読み上げに対応していません。" },
  th: { listen: "คู่มือเสียง", all: "ฟังตั้งแต่ต้น", this: "ฟังหัวข้อนี้", stop: "หยุด", pause: "หยุดชั่วคราว", resume: "ฟังต่อ", next: "หัวข้อถัดไป", speed: "ความเร็ว", none: "อุปกรณ์นี้ไม่มีเสียงอ่านภาษาไทย (เพิ่มได้ที่ การตั้งค่า > การช่วยการเข้าถึง > เนื้อหาที่พูด > เสียง)", unsupported: "เบราว์เซอร์นี้ไม่รองรับการอ่านออกเสียง" },
  en: { listen: "Audio guide", all: "Listen from the start", this: "Listen to this section", stop: "Stop", pause: "Pause", resume: "Resume", next: "Next section", speed: "Speed", none: "No English voice on this device.", unsupported: "This browser does not support speech." },
};

// 読み上げる文章を、画面の文章から作る
function textOf(id: string, lang: Lang) {
  const el = document.getElementById(id);
  if (!el) return "";
  const c = el.cloneNode(true) as HTMLElement;
  c.querySelectorAll("[data-nosay], script, style, svg, button, input, select, textarea").forEach((x) => x.remove());
  c.querySelectorAll<HTMLElement>("[data-say]").forEach((x) => { x.textContent = x.dataset.say ?? ""; });
  // 見出しや項目の終わりに区切りを入れる
  // 見出しや項目の終わりで区切る（日本語は「。」、タイ語・英語は改行）
  c.querySelectorAll("h1,h2,h3,p,li,dt,dd").forEach((x) => x.append(lang === "ja" ? "。" : "\n"));
  let t = (c.textContent ?? "").replace(/\s*→\s*/g, lang === "ja" ? "、" : ", ");
  if (lang === "ja") return t.replace(/。\s*。+/g, "。").replace(/([、。])\s*[、。]+/g, "$1").replace(/\s+/g, " ").trim();
  t = t.replace(/[ \t]+/g, " ");
  return t.split("\n").map((x) => x.trim()).filter(Boolean).join("\n");
}
// 端末によっては長い文の途中で止まるので、文ごとに分ける
function sentences(t: string) {
  return t.split(/\n|(?<=[。！？!?])\s*|(?<=\.)\s+/).flatMap((s) => (s.length > 160 ? s.split(/(?<=[、,])/) : [s])).map((s) => s.trim()).filter((s) => s.replace(/[。、\s]/g, "").length > 0);
}
function pickVoice(lang: Lang) {
  const vs = speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().startsWith(lang));
  const good = /premium|enhanced|siri|natural|neural|google|kyoko|o-ren|otoya|hattori|kanya|narisa|premwadee|samantha/i;
  return vs.find((v) => good.test(v.name)) ?? vs[0];
}
const subscribeVoices = (f: () => void) => { if (typeof speechSynthesis === "undefined") return () => {}; speechSynthesis.addEventListener("voiceschanged", f); return () => speechSynthesis.removeEventListener("voiceschanged", f); };

export default function VoiceGuide({ sections, lang = "ja", dark = false }: { sections: VoiceSection[]; lang?: Lang; dark?: boolean }) {
  const t = T[lang];
  const supported = useSyncExternalStore(() => () => {}, () => typeof window !== "undefined" && "speechSynthesis" in window, () => true);
  const voiceCount = useSyncExternalStore(subscribeVoices, () => (typeof speechSynthesis === "undefined" ? 0 : speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().startsWith(lang)).length), () => 1);
  const [cur, setCur] = useState<number | null>(null); // 読んでいる章
  const [paused, setPaused] = useState(false);
  const [rate, setRate] = useState(1);
  const [one, setOne] = useState(false); // この章だけ
  const pos = useRef({ sec: 0, sent: 0 });
  const runId = useRef(0);

  const highlight = (i: number | null) => {
    document.querySelectorAll("[data-voice-on]").forEach((x) => x.removeAttribute("data-voice-on"));
    if (i === null) return;
    const el = document.getElementById(sections[i].id);
    if (el) { el.setAttribute("data-voice-on", ""); el.scrollIntoView({ behavior: "smooth", block: "start" }); }
  };
  const stop = () => { runId.current++; speechSynthesis.cancel(); setCur(null); setPaused(false); highlight(null); };
  useEffect(() => () => { runId.current++; if (typeof speechSynthesis !== "undefined") speechSynthesis.cancel(); document.querySelectorAll("[data-voice-on]").forEach((x) => x.removeAttribute("data-voice-on")); }, []);

  // sec 章の sent 文から読み始める
  const play = (sec: number, sent = 0, onlyThis = one, r = rate) => {
    const id = ++runId.current;
    speechSynthesis.cancel();
    const voice = pickVoice(lang);
    const run = (s: number, k: number) => {
      if (id !== runId.current) return;
      if (s >= sections.length || (onlyThis && s !== sec)) { setCur(null); highlight(null); return; }
      const list = sentences(sections[s].text ?? textOf(sections[s].id, lang));
      if (k === 0) { setCur(s); highlight(s); }
      if (k >= list.length) return run(s + 1, 0);
      pos.current = { sec: s, sent: k };
      const u = new SpeechSynthesisUtterance(list[k]);
      u.lang = LOCALE[lang]; if (voice) u.voice = voice; u.rate = r;
      u.onend = () => run(s, k + 1);
      u.onerror = (e) => { if (e.error !== "interrupted" && e.error !== "canceled") run(s, k + 1); };
      speechSynthesis.speak(u);
    };
    setPaused(false); setOne(onlyThis);
    run(sec, sent);
  };
  // 一時停止：iPhone の pause は不安定なので、止めて位置を覚えておく
  const pause = () => { runId.current++; speechSynthesis.cancel(); setPaused(true); };
  const resume = () => play(pos.current.sec, pos.current.sent);
  const changeRate = (r: number) => { setRate(r); if (cur !== null && !paused) play(pos.current.sec, pos.current.sent, one, r); };

  // 各章の見出しに置く「この章を聞く」ボタン用に、外から呼べるようにする
  useEffect(() => {
    const on = (e: Event) => { const i = sections.findIndex((x) => x.id === (e as CustomEvent<string>).detail); if (i >= 0) play(i, 0, true); };
    addEventListener("voice-guide-play", on);
    return () => removeEventListener("voice-guide-play", on);
  });

  if (!supported) return <p className="text-[12px] text-mute">{t.unsupported}</p>;
  const playing = cur !== null;
  const btn = dark ? "border-white/25 text-white hover:bg-white hover:text-ink" : "border-ink/20 hover:border-ink";
  return (
    <>
      {/* 始めるボタン */}
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => (playing ? stop() : play(0, 0, false))} className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-[13px] transition ${btn}`}>
          {playing ? <Square size={14} /> : <Headphones size={15} />}{playing ? t.stop : `${t.listen}：${t.all}`}
        </button>
        {!voiceCount && <span className={`text-[11.5px] ${dark ? "text-white/60" : "text-mute"}`}>{t.none}</span>}
      </div>
      <style>{`[data-voice-on]{outline:2px solid #b8860b;outline-offset:6px;border-radius:12px;scroll-margin-top:80px}`}</style>

      {/* 読んでいる間だけ出る、小さな操作バー */}
      {playing && (
        <div className="fixed inset-x-3 bottom-[calc(0.75rem+env(safe-area-inset-bottom))] z-[45] mx-auto flex max-w-md items-center gap-2 rounded-full border border-black/5 bg-white/90 p-1.5 pl-4 text-ink shadow-[0_8px_30px_rgba(0,0,0,.18)] backdrop-blur-xl">
          <Volume2 size={16} className="shrink-0 text-gold" />
          <p className="min-w-0 flex-1 truncate text-[12.5px]">{sections[cur].title}</p>
          <button type="button" onClick={() => changeRate(rate === 1 ? 1.25 : rate === 1.25 ? 1.5 : rate === 1.5 ? 0.85 : 1)} aria-label={t.speed} className="shrink-0 rounded-full px-2 py-2 text-[12px] tabular-nums text-mute">×{rate}</button>
          <button type="button" onClick={paused ? resume : pause} aria-label={paused ? t.resume : t.pause} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink text-white">{paused ? <Play size={15} /> : <Pause size={15} />}</button>
          {!one && cur < sections.length - 1 && <button type="button" onClick={() => play(cur + 1, 0, false)} aria-label={t.next} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink/60"><SkipForward size={15} /></button>}
          <button type="button" onClick={stop} aria-label={t.stop} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink/60"><Square size={14} /></button>
        </div>
      )}
    </>
  );
}

// 章の見出しの横に置く「この章を聞く」ボタン
export function ListenButton({ id, label = "この章を聞く", dark = false }: { id: string; label?: string; dark?: boolean }) {
  return (
    <button type="button" data-nosay onClick={() => dispatchEvent(new CustomEvent("voice-guide-play", { detail: id }))} aria-label={label}
      className={`tap inline-flex shrink-0 items-center gap-1 text-[11.5px] transition ${dark ? "text-white/60 hover:text-white" : "text-mute hover:text-ink"}`}>
      <Play size={11} />{label}
    </button>
  );
}
