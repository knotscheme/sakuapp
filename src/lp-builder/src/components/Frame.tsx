"use client";

import { useEffect, useRef, useState } from "react";

// LPを「実際の画面の幅」で表示し、置き場所の幅に合わせて縮小して見せる
export default function Frame({ html, width = 1280, height, className = "", title = "プレビュー", interactive = false, frameRef, onLoad }: {
  html: string; width?: number; height?: number; className?: string; title?: string; interactive?: boolean;
  frameRef?: React.RefObject<HTMLIFrameElement | null>; onLoad?: () => void;
}) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const [boxH, setBoxH] = useState(0);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(() => { setScale(Math.min(1, el.clientWidth / width)); setBoxH(el.clientHeight); });
    ro.observe(el);
    return () => ro.disconnect();
  }, [width]);
  // height が無いときは、置き場所の高さいっぱいに表示する
  const innerH = height ?? (scale ? boxH / scale : 800);
  return (
    <div ref={box} className={`relative overflow-hidden ${className}`} style={height ? { height: height * scale } : undefined}>
      {scale > 0 && (
        <iframe
          ref={frameRef}
          title={title}
          srcDoc={html}
          onLoad={onLoad}
          tabIndex={interactive ? 0 : -1}
          className={`absolute left-0 top-0 origin-top-left border-0 bg-white ${interactive ? "" : "pointer-events-none"}`}
          style={{ width, height: innerH, transform: `scale(${scale})`, left: scale < 1 ? 0 : `calc(50% - ${width / 2}px)` }}
          sandbox="allow-scripts allow-same-origin"
        />
      )}
    </div>
  );
}
