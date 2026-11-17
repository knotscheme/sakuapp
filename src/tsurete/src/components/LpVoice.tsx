"use client";

import { useEffect, useRef, useState } from "react";
import { Headphones, Pause, Play, RotateCcw, X } from "lucide-react";
import CH from "@/lib/lp-voice.json";

// LPの音声ガイド：VOICEVOX（九州そら）で先に作った音声を、いま見ているセクションに合わせて流す。
// ページを勝手に動かさない。スクロールして次の章のセクションに来たら、その章を読む。
// 読み終わった章は、戻ってきても自動では読みなおさない（再生ボタンで聞きなおせる）。
// 音声の作り方は scripts/voice/README.md
const BASE = "/sakuapp/works/tsurete";
const STAY = 700; // セクションにこれだけ留まったら読みはじめる（速いスクロールで次々に切りかわらないように）

// いま見ているセクションの章（その章の sec 以上で、次の章の sec より前）
function chapterInView() {
  const els = document.querySelectorAll<HTMLElement>("main > section");
  const mid = innerHeight * 0.45;
  let n = 0; els.forEach((e, k) => { if (e.getBoundingClientRect().top <= mid) n = k; });
  let c = 0; CH.forEach((x, k) => { if (x.sec <= n) c = k; });
  return c;
}

export default function LpVoice() {
  const audio = useRef<HTMLAudioElement | null>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const [on, setOn] = useState(false); // 音声ガイドを使っている
  const [cur, setCur] = useState(0); // いま見ている章
  const [state, setState] = useState<"play" | "pause" | "done">("play");
  const [rate, setRate] = useState(1);
  const r = useRef({ on: false, cur: -1, playing: -1, rate: 1, done: new Set<number>(), manual: false });

  const play = (i: number) => {
    const s = r.current;
    const a = (audio.current ??= new Audio());
    a.pause();
    a.src = `${BASE}/audio/lp-${CH[i].id}.mp3`;
    a.playbackRate = s.rate;
    a.onended = () => { s.done.add(i); s.playing = -1; setState("done"); if (bar.current) bar.current.style.transform = "scaleX(1)"; };
    a.ontimeupdate = () => { if (bar.current && a.duration) bar.current.style.transform = `scaleX(${a.currentTime / a.duration})`; };
    if (bar.current) bar.current.style.transform = "scaleX(0)";
    s.playing = i; s.manual = false; setCur(i); setState("play");
    a.play().catch(() => setState("pause"));
  };
  const stop = () => { audio.current?.pause(); r.current.on = false; r.current.playing = -1; setOn(false); };
  const start = () => { const s = r.current; s.on = true; s.done.clear(); setOn(true); const c = chapterInView(); s.cur = c; play(c); };

  // スクロールを見て、別の章のセクションに留まったら、その章を読む
  useEffect(() => {
    if (!on) return;
    let raf = 0, timer = 0;
    const check = () => {
      raf = 0;
      const s = r.current; const c = chapterInView();
      if (c === s.cur) return;
      s.cur = c; setCur(c); clearTimeout(timer);
      timer = window.setTimeout(() => {
        if (!s.on || s.cur !== c || s.playing === c || s.manual) return;
        if (s.done.has(c)) { audio.current?.pause(); s.playing = -1; setState("done"); if (bar.current) bar.current.style.transform = "scaleX(1)"; return; }
        play(c);
      }, STAY);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(check); };
    addEventListener("scroll", onScroll, { passive: true });
    return () => { removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); clearTimeout(timer); };
  }, [on]);
  useEffect(() => () => audio.current?.pause(), []);
  // 再生中は、下のセクション名を隠す（同じ場所に2つ並ばないように）
  useEffect(() => { document.documentElement.toggleAttribute("data-voice", on); }, [on]);

  const toggle = () => {
    const a = audio.current; if (!a) return;
    if (state === "done") { play(cur); return; }
    // 一時停止中は、スクロールしても勝手に読みはじめない
    if (a.paused) { if (r.current.playing !== cur) { play(cur); return; } a.play(); r.current.manual = false; setState("play"); } else { a.pause(); r.current.manual = true; setState("pause"); }
  };
  const speed = () => { const n = rate === 1 ? 1.25 : rate === 1.25 ? 1.5 : 1; setRate(n); r.current.rate = n; if (audio.current) audio.current.playbackRate = n; };

  return (
    <>
      <button type="button" onClick={() => (on ? stop() : start())} className="inline-flex items-center gap-1.5 text-[0.85rem] text-[#6e6e73] transition hover:text-[#1d1d1f]">
        <Headphones size={16} strokeWidth={1.8} />{on ? "音声を止める" : "音声で聞く"}
      </button>

      {on && (
        <div className="fixed inset-x-3 bottom-[calc(2.6rem+env(safe-area-inset-bottom))] z-[45] mx-auto max-w-[26rem] overflow-hidden rounded-full border border-black/5 bg-white/90 text-left text-[#1d1d1f] shadow-[0_10px_40px_rgba(0,0,0,.16)] backdrop-blur-xl" style={{ animation: "lp-in .4s cubic-bezier(.2,.7,.2,1) both" }} role="region" aria-label="音声ガイド">
          <div className="flex items-center gap-1.5 py-1.5 pl-4 pr-1.5">
            <span className="relative mr-1 grid h-2 w-2 place-items-center"><span className={`absolute h-2 w-2 rounded-full bg-[#00a37a] opacity-60 ${state === "play" ? "animate-ping" : ""}`} /><span className={`h-2 w-2 rounded-full ${state === "play" ? "bg-[#00a37a]" : "bg-[#c7c7cc]"}`} /></span>
            <p className="min-w-0 flex-1 truncate text-[0.8rem]" aria-live="polite">
              {state === "done"
                ? <span className="text-[#6e6e73]">{cur === CH.length - 1 ? "最後まで読みました" : "スクロールすると、続きを読みます"}</span>
                : <><span className="num mr-1.5 text-[#86868b]">{String(cur + 1).padStart(2, "0")}/{String(CH.length).padStart(2, "0")}</span>{CH[cur].title}</>}
            </p>
            <button type="button" onClick={speed} aria-label="速さ" className="num shrink-0 rounded-full px-2 py-2 text-[0.75rem] text-[#6e6e73]">×{rate}</button>
            <button type="button" onClick={toggle} aria-label={state === "play" ? "一時停止" : state === "done" ? "この章をもう一度" : "続きから"} className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#1d1d1f] text-white">{state === "play" ? <Pause size={15} /> : state === "done" ? <RotateCcw size={15} /> : <Play size={15} />}</button>
            <button type="button" onClick={stop} aria-label="止める" className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[#6e6e73]"><X size={16} /></button>
          </div>
          <span className="absolute inset-x-0 bottom-0 h-[2px] bg-black/[.04]"><span ref={bar} className="block h-full w-full origin-left bg-[#00a37a]" style={{ transform: "scaleX(0)" }} /></span>
        </div>
      )}
    </>
  );
}
