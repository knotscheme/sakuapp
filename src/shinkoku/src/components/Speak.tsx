"use client";

import { useEffect, useState } from "react";
import { Square, Volume2 } from "lucide-react";

// 読み上げボタン（端末の音声で読み上げる）
export default function Speak({ text, label = "読み上げる" }: { text: string; label?: string }) {
  const [on, setOn] = useState(false);
  const [ok, setOk] = useState(false);
  useEffect(() => { setOk("speechSynthesis" in window); return () => { try { speechSynthesis.cancel(); } catch {} }; }, []);
  if (!ok) return null;
  const go = () => {
    speechSynthesis.cancel();
    if (on) { setOn(false); return; }
    const u = new SpeechSynthesisUtterance(text.replace(/（[^）]*）/g, ""));
    u.lang = "ja-JP"; u.rate = 0.95;
    const v = speechSynthesis.getVoices().find((x) => x.lang.startsWith("ja"));
    if (v) u.voice = v;
    u.onend = () => setOn(false); u.onerror = () => setOn(false);
    setOn(true); speechSynthesis.speak(u);
  };
  return (
    <button type="button" onClick={go} aria-pressed={on} className="inline-flex shrink-0 items-center gap-1.5 rounded-full border-2 border-ink bg-white px-3.5 py-1.5 text-[0.85rem] font-bold">
      {on ? <Square size={16} /> : <Volume2 size={18} />}{on ? "止める" : label}
    </button>
  );
}
