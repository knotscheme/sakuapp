"use client";

import { useEffect, useRef, useState } from "react";
import { Headphones, Pause, Play, SkipForward, X } from "lucide-react";
import CH from "@/lib/lp-voice.json";

// LPの音声ガイド：VOICEVOX（No.7 アナウンス）で先に作った音声を、章ごとに続けて流す。
// 章が変わると、その場面までページを動かす。音声の作り方は scripts/voice/README.md
const BASE = "/sakuapp/works/tsurete";
const total = "約3分";

export default function LpVoice() {
  const audio = useRef<HTMLAudioElement | null>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const [cur, setCur] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const [rate, setRate] = useState(1);
  const rateRef = useRef(1);

  const go = (sec: number) => document.querySelectorAll("main > section")[sec]?.scrollIntoView({ behavior: "smooth", block: "start" });
  const play = (i: number) => {
    if (i >= CH.length) { stop(); return; }
    const a = (audio.current ??= new Audio());
    a.src = `${BASE}/audio/lp-${CH[i].id}.mp3`;
    a.playbackRate = rateRef.current;
    a.onended = () => play(i + 1);
    a.ontimeupdate = () => { if (bar.current && a.duration) bar.current.style.transform = `scaleX(${a.currentTime / a.duration})`; };
    setCur(i); setPaused(false); go(CH[i].sec);
    a.play().catch(() => { setCur(null); });
    // 次の章を先に読みこんでおく
    if (CH[i + 1]) { const n = new Audio(); n.preload = "auto"; n.src = `${BASE}/audio/lp-${CH[i + 1].id}.mp3`; }
  };
  const stop = () => { audio.current?.pause(); setCur(null); setPaused(false); };
  const toggle = () => { const a = audio.current; if (!a) return; if (a.paused) { a.play(); setPaused(false); } else { a.pause(); setPaused(true); } };
  const speed = () => { const r = rate === 1 ? 1.25 : rate === 1.25 ? 1.5 : 1; setRate(r); rateRef.current = r; if (audio.current) audio.current.playbackRate = r; };
  useEffect(() => () => audio.current?.pause(), []);
  // 再生中は、下のセクション名を隠す（同じ場所に2つ並ばないように）
  useEffect(() => { document.documentElement.toggleAttribute("data-voice", cur !== null); }, [cur]);

  return (
    <>
      <button type="button" onClick={() => (cur === null ? play(0) : stop())} className="inline-flex items-center gap-1.5 text-[0.85rem] text-[#6e6e73] transition hover:text-[#1d1d1f]">
        <Headphones size={16} strokeWidth={1.8} />{cur === null ? <>音声で聞く<span className="text-[#86868b]">（{total}）</span></> : "音声を止める"}
      </button>

      {cur !== null && (
        <div className="fixed inset-x-3 bottom-[calc(2.6rem+env(safe-area-inset-bottom))] z-[45] mx-auto max-w-[26rem] overflow-hidden rounded-full text-left border border-black/5 bg-white/90 text-[#1d1d1f] shadow-[0_10px_40px_rgba(0,0,0,.16)] backdrop-blur-xl" style={{ animation: "lp-in .4s cubic-bezier(.2,.7,.2,1) both" }} role="region" aria-label="音声ガイド">
          <div className="flex items-center gap-1.5 py-1.5 pl-4 pr-1.5">
            <span className="relative mr-1 grid h-2 w-2 place-items-center"><span className={`absolute h-2 w-2 rounded-full bg-[#00a37a] ${paused ? "" : "animate-ping"} opacity-60`} /><span className="h-2 w-2 rounded-full bg-[#00a37a]" /></span>
            <p className="min-w-0 flex-1 truncate text-[0.8rem]"><span className="num mr-1.5 text-[#86868b]">{String(cur + 1).padStart(2, "0")}/{String(CH.length).padStart(2, "0")}</span>{CH[cur].title}</p>
            <button type="button" onClick={speed} aria-label="速さ" className="num shrink-0 rounded-full px-2 py-2 text-[0.75rem] text-[#6e6e73]">×{rate}</button>
            <button type="button" onClick={toggle} aria-label={paused ? "続きから" : "一時停止"} className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#1d1d1f] text-white">{paused ? <Play size={15} /> : <Pause size={15} />}</button>
            {cur < CH.length - 1 && <button type="button" onClick={() => play(cur + 1)} aria-label="次へ" className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[#6e6e73]"><SkipForward size={15} /></button>}
            <button type="button" onClick={stop} aria-label="止める" className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-[#6e6e73]"><X size={16} /></button>
          </div>
          <span className="absolute inset-x-0 bottom-0 h-[2px] bg-black/[.04]"><span ref={bar} className="block h-full w-full origin-left bg-[#00a37a]" style={{ transform: "scaleX(0)" }} /></span>
        </div>
      )}
    </>
  );
}
