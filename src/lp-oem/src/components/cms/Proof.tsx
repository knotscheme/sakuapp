"use client";

// ロゴ配置イメージ：ロゴを消した実物の写真に、お客様のロゴを箔押し・素押しの見た目で重ねる
// ※本番では：ロゴは Supabase Storage、位置と大きさは proofs テーブルに版ごとに保存し、承認された版を製造指示書に使う
import type { CSSProperties } from "react";
import type { Deal } from "@/lib/cms";
import type { ModelId } from "@/lib/models";
import { ALL_MODELS } from "@/lib/models";
import { asset } from "@/lib/asset";

// 写真ごとの最初のロゴ位置（中心・%）と大きさ（写真の幅に対する%）。objW は写真の幅のうち製品が占める割合（実寸の目安用）
export const PHOTOS: Record<ModelId, { img: string; ar: string; x: number; y: number; w: number; objW: number }> = {
  long: { img: "blank-long", ar: "1408/768", x: 73.3, y: 73.7, w: 11, objW: 0.78 },
  bifold: { img: "blank-bifold", ar: "1408/768", x: 38.5, y: 72.7, w: 9, objW: 0.5 },
  trifold: { img: "blank-trifold", ar: "1408/768", x: 49.9, y: 50.6, w: 9, objW: 0.44 },
  fragment: { img: "blank-fragment", ar: "1408/768", x: 49.9, y: 70.3, w: 10, objW: 0.48 },
  tote: { img: "blank-tote", ar: "960/720", x: 50, y: 47.8, w: 7, objW: 0.4 },
  phone: { img: "blank-phone", ar: "960/720", x: 39.4, y: 77.4, w: 8, objW: 0.32 },
};

export const placeOf = (d: Pick<Deal, "model" | "place">) => d.place ?? { x: PHOTOS[d.model].x, y: PHOTOS[d.model].y, w: PHOTOS[d.model].w };

// ロゴの実寸の目安（cm）
export function logoCm(d: Pick<Deal, "model" | "place">) {
  const m = ALL_MODELS.find((x) => x.id === d.model);
  const W = Number(m?.size.match(/W([\d.]+)/)?.[1] ?? 10);
  return (placeOf(d).w / 100 / PHOTOS[d.model].objW) * W;
}

// ロゴが無いときは、ブランド名を文字のロゴにする
function textLogo(brand: string) {
  const t = brand.toUpperCase().slice(0, 20).replace(/[&<>"]/g, "");
  const w = Math.max(160, t.length * 64);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} 110"><text x="50%" y="74" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="84" letter-spacing="10" fill="#000">${t}</text></svg>`;
  return { src: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`, ar: w / 110 };
}

const FILL: Record<Deal["finish"], CSSProperties> = {
  金箔: { background: "linear-gradient(100deg, #8a650c 0%, #f4e0a4 30%, #b8860b 50%, #f1d999 70%, #8a650c 100%)" },
  銀箔: { background: "linear-gradient(100deg, #7d838a 0%, #f6f8fa 30%, #a6acb3 50%, #eef1f4 70%, #7d838a 100%)" },
  素押し: { background: "rgba(0,0,0,.55)", mixBlendMode: "multiply" },
};

// zoom：ロゴのまわりを拡大して見せる
export function ProofView({ d, className = "", label = true, zoom = false }: { d: Pick<Deal, "model" | "place" | "logo" | "logoAspect" | "brand" | "finish">; className?: string; label?: boolean; zoom?: boolean }) {
  const ph = PHOTOS[d.model];
  const p = placeOf(d);
  const lg = d.logo ? { src: d.logo, ar: d.logoAspect ?? 2 } : textLogo(d.brand);
  const mask: CSSProperties = { WebkitMaskImage: `url("${lg.src}")`, maskImage: `url("${lg.src}")`, WebkitMaskSize: "contain", maskSize: "contain", WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat", WebkitMaskPosition: "center", maskPosition: "center" };
  return (
    <div className={`relative w-full overflow-hidden bg-paper ${className}`} style={{ aspectRatio: ph.ar }}>
      <div className="absolute inset-0" style={zoom ? { transform: `translate(${50 - p.x}%, ${50 - p.y}%) scale(${Math.min(6, 42 / p.w)})`, transformOrigin: `${p.x}% ${p.y}%` } : undefined}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={asset(`/images/${ph.img}.webp`)} alt="ロゴ配置のイメージ" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute" style={{ left: `${p.x}%`, top: `${p.y}%`, width: `${p.w}%`, aspectRatio: String(lg.ar), translate: "-50% -50%", filter: d.finish === "素押し" ? "drop-shadow(0 1px 0 rgba(255,255,255,.32)) drop-shadow(0 -1px 0 rgba(0,0,0,.35))" : "drop-shadow(0 1px 0 rgba(0,0,0,.55))" }}>
        <div className="h-full w-full" style={{ ...mask, ...FILL[d.finish] }} />
      </div>
      </div>
      {label && <span className="absolute top-2 left-2 rounded bg-white/85 px-2 py-0.5 text-[10.5px] text-ink/70">{zoom ? "ロゴ部分（拡大）" : "イメージ（実際の仕上がりとは多少異なります）"}</span>}
    </div>
  );
}

// アップロードされたロゴを、透明な背景のPNGにする（白い背景は透明に、濃いところをロゴとして残す）
// ※本番では ai・pdf・eps もサーバー側で画像に変換する。デモでは png・jpg・svg に対応
export async function toLogoMask(file: File): Promise<{ src: string; ar: number } | null> {
  if (!/\.(png|jpe?g|svg|webp)$/i.test(file.name)) return null;
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((ok, ng) => { const i = new Image(); i.onload = () => ok(i); i.onerror = ng; i.src = url; });
    const W0 = img.naturalWidth || 600, H0 = img.naturalHeight || 300;
    const k = Math.min(1, 800 / Math.max(W0, H0));
    const W = Math.max(1, Math.round(W0 * k)), H = Math.max(1, Math.round(H0 * k));
    const cv = document.createElement("canvas"); cv.width = W; cv.height = H;
    const g = cv.getContext("2d")!; g.drawImage(img, 0, 0, W, H);
    const data = g.getImageData(0, 0, W, H); const px = data.data;
    let transparent = 0;
    for (let i = 3; i < px.length; i += 4) if (px[i] < 200) transparent++;
    const useAlpha = transparent > (W * H) / 20; // もともと背景が透明なロゴ
    let x0 = W, y0 = H, x1 = 0, y1 = 0;
    for (let i = 0, n = 0; i < px.length; i += 4, n++) {
      const lum = 0.299 * px[i] + 0.587 * px[i + 1] + 0.114 * px[i + 2];
      const a = useAlpha ? px[i + 3] : Math.max(0, Math.min(255, (235 - lum) * 1.8));
      px[i] = px[i + 1] = px[i + 2] = 0; px[i + 3] = a;
      if (a > 30) { const x = n % W, y = (n / W) | 0; if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    }
    if (x1 <= x0 || y1 <= y0) return null;
    g.putImageData(data, 0, 0);
    // ロゴのまわりの余白を切り落とす
    const cw = x1 - x0 + 1, ch = y1 - y0 + 1;
    const out = document.createElement("canvas"); out.width = cw; out.height = ch;
    out.getContext("2d")!.drawImage(cv, x0, y0, cw, ch, 0, 0, cw, ch);
    return { src: out.toDataURL("image/png"), ar: cw / ch };
  } catch {
    return null;
  } finally {
    URL.revokeObjectURL(url);
  }
}

// 全体と、ロゴ部分の拡大を並べて見せる
export function ProofPair({ d, label = true }: { d: Parameters<typeof ProofView>[0]["d"]; label?: boolean }) {
  return (
    <div className="grid gap-2 sm:grid-cols-[1.6fr_1fr]">
      <ProofView d={d} label={label} />
      <ProofView d={d} label={label} zoom />
    </div>
  );
}
