import type { ModelId } from "@/lib/models";

// 商品写真の代わりのイラスト（あとで実際の写真に差し替える前提）
// 写真に差し替える場合は、このコンポーネントを <img src="/images/xxx.jpg" /> に置き換えるだけでよい

type Props = { id: ModelId; color?: string; logo?: "plain" | "gold" | "silver" | "none"; className?: string };

const LOGO_FILL = { plain: "rgba(0,0,0,.35)", gold: "url(#gold)", silver: "url(#silver)", none: "transparent" } as const;

function Defs({ uid, color }: { uid: string; color: string }) {
  return (
    <defs>
      <linearGradient id={`lea-${uid}`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={color} stopOpacity="0.88" />
        <stop offset="0.55" stopColor={color} />
        <stop offset="1" stopColor="#000" stopOpacity="0.55" />
      </linearGradient>
      <linearGradient id={`sheen-${uid}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity="0.18" />
        <stop offset="0.4" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#8d6a10" />
        <stop offset="0.45" stopColor="#e8cf8c" />
        <stop offset="1" stopColor="#b8860b" />
      </linearGradient>
      <linearGradient id="silver" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#8f949a" />
        <stop offset="0.5" stopColor="#f1f3f5" />
        <stop offset="1" stopColor="#a5aab0" />
      </linearGradient>
      <filter id={`sh-${uid}`} x="-20%" y="-20%" width="140%" height="160%">
        <feDropShadow dx="0" dy="14" stdDeviation="12" floodColor="#000" floodOpacity="0.28" />
      </filter>
    </defs>
  );
}

function Logo({ x, y, fill, size = 13 }: { x: number; y: number; fill: string; size?: number }) {
  return (
    <text x={x} y={y} textAnchor="middle" fontFamily="Georgia, serif" fontSize={size} letterSpacing="3" fill={fill} style={{ fontWeight: 600 }}>
      CRAFT
    </text>
  );
}

export default function WalletArt({ id, color, logo = "gold", className }: Props) {
  const c = color ?? { long: "#2b1d16", bifold: "#1c2230", trifold: "#8a5a36", fragment: "#3d3f2e" }[id];
  const uid = `${id}-${c.replace("#", "")}-${logo}`;
  const lf = LOGO_FILL[logo];
  const stitch = { fill: "none", stroke: "rgba(255,255,255,.28)", strokeWidth: 1.1, strokeDasharray: "3 3" };

  return (
    <svg viewBox="0 0 320 220" className={className} role="img" aria-label="財布のイメージ">
      <Defs uid={uid} color={c} />
      {id === "long" && (
        <g filter={`url(#sh-${uid})`}>
          <rect x="30" y="50" width="260" height="128" rx="14" fill={`url(#lea-${uid})`} />
          <rect x="30" y="50" width="260" height="128" rx="14" fill={`url(#sheen-${uid})`} />
          <rect x="38" y="58" width="244" height="112" rx="10" {...stitch} />
          {/* ファスナー */}
          <path d="M44 50 H276 Q290 50 290 64 V164 Q290 178 276 178 H44" fill="none" stroke="#c9a85b" strokeWidth="2.2" />
          <path d="M44 50 H276 Q290 50 290 64 V164 Q290 178 276 178 H44" fill="none" stroke="#7a5c18" strokeWidth="2.2" strokeDasharray="1.5 2.5" />
          <g transform="translate(290 78)">
            <rect x="-4" y="-4" width="10" height="16" rx="2" fill="url(#gold)" />
            <rect x="2" y="10" width="22" height="9" rx="4.5" fill={c} stroke="#c9a85b" strokeWidth="1" />
          </g>
          <Logo x={232} y={160} fill={lf} />
        </g>
      )}
      {id === "bifold" && (
        <g filter={`url(#sh-${uid})`}>
          <rect x="70" y="36" width="180" height="152" rx="12" fill={`url(#lea-${uid})`} />
          <rect x="70" y="36" width="180" height="152" rx="12" fill={`url(#sheen-${uid})`} />
          <rect x="78" y="44" width="164" height="136" rx="8" {...stitch} />
          <path d="M70 112 H250" stroke="rgba(0,0,0,.35)" strokeWidth="1.5" />
          <path d="M70 114 H250" stroke="rgba(255,255,255,.08)" strokeWidth="1" />
          <Logo x={120} y={168} fill={lf} size={12} />
        </g>
      )}
      {id === "trifold" && (
        <g filter={`url(#sh-${uid})`}>
          <rect x="88" y="46" width="144" height="128" rx="14" fill={`url(#lea-${uid})`} />
          <rect x="88" y="46" width="144" height="128" rx="14" fill={`url(#sheen-${uid})`} />
          <path d="M88 96 Q160 120 232 96 V60 Q232 46 218 46 H102 Q88 46 88 60 Z" fill="rgba(0,0,0,.18)" />
          <path d="M96 92 Q160 114 224 92" {...stitch} />
          <rect x="96" y="54" width="128" height="112" rx="10" {...stitch} />
          <circle cx="160" cy="112" r="7" fill="url(#gold)" />
          <circle cx="160" cy="112" r="3" fill="rgba(0,0,0,.25)" />
          <Logo x={160} y={84} fill={lf} size={11} />
        </g>
      )}
      {id === "fragment" && (
        <g filter={`url(#sh-${uid})`}>
          <rect x="84" y="50" width="152" height="118" rx="10" fill={`url(#lea-${uid})`} />
          <rect x="84" y="50" width="152" height="118" rx="10" fill={`url(#sheen-${uid})`} />
          <rect x="92" y="58" width="136" height="102" rx="7" {...stitch} />
          <path d="M84 92 H236" stroke="rgba(0,0,0,.3)" strokeWidth="1.2" />
          <path d="M236 70 H252 Q258 70 258 76 V84 Q258 90 252 90 H236" fill="none" stroke="#c9a85b" strokeWidth="2" />
          <Logo x={160} y={134} fill={lf} size={12} />
        </g>
      )}
    </svg>
  );
}
