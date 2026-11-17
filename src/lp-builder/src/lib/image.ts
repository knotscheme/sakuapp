// 画像を、枠の縦横比に合わせてブラウザの中で切り抜き・縮小し、軽い形式（WebP）にする
import type { ImgMeta, Slot } from "./types";

export async function loadBitmap(blob: Blob): Promise<ImageBitmap | HTMLImageElement> {
  if ("createImageBitmap" in window) {
    try { return await createImageBitmap(blob, { imageOrientation: "from-image" } as ImageBitmapOptions); } catch {}
  }
  const url = URL.createObjectURL(blob);
  try {
    const im = new Image();
    im.src = url;
    await im.decode();
    return im;
  } finally {
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}
const sizeOf = (b: ImageBitmap | HTMLImageElement) => ("naturalWidth" in b ? { w: b.naturalWidth, h: b.naturalHeight } : { w: b.width, h: b.height });

// 切り抜く範囲（元の画像の座標）。fx,fy は中心、zoom は 1 で枠いっぱい、大きいほど寄る
export function cropRect(w: number, h: number, ratio: [number, number], fx: number, fy: number, zoom: number) {
  const r = ratio[0] / ratio[1];
  let cw = w, ch = w / r;
  if (ch > h) { ch = h; cw = h * r; }
  cw /= zoom; ch /= zoom;
  const x = Math.min(Math.max(fx * w - cw / 2, 0), w - cw);
  const y = Math.min(Math.max(fy * h - ch / 2, 0), h - ch);
  return { x, y, cw, ch };
}

function toBlob(c: HTMLCanvasElement, type: string, q: number): Promise<Blob | null> {
  return new Promise((res) => c.toBlob(res, type, q));
}

export async function processImage(orig: Blob, slot: Slot, m: Pick<ImgMeta, "fx" | "fy" | "zoom">) {
  const bmp = await loadBitmap(orig);
  const { w, h } = sizeOf(bmp);
  const { x, y, cw, ch } = cropRect(w, h, slot.ratio, m.fx, m.fy, m.zoom);
  const outW = Math.round(Math.min(cw, slot.max));
  const outH = Math.round((outW * slot.ratio[1]) / slot.ratio[0]);
  const c = document.createElement("canvas");
  c.width = outW; c.height = outH;
  const g = c.getContext("2d")!;
  g.imageSmoothingQuality = "high";
  g.drawImage(bmp, x, y, cw, ch, 0, 0, outW, outH);
  // WebP にできないブラウザ（古いSafari）は JPEG にする
  let out = await toBlob(c, "image/webp", 0.84);
  if (!out || out.type !== "image/webp") out = await toBlob(c, "image/jpeg", 0.86);
  if ("close" in bmp) bmp.close();
  return { out: out!, w, h, outW, small: cw < slot.min };
}

export async function imageSize(blob: Blob) {
  const b = await loadBitmap(blob);
  const s = sizeOf(b);
  if ("close" in b) b.close();
  return s;
}

export const extOf = (b: Blob) => (b.type === "image/webp" ? "webp" : b.type === "image/png" ? "png" : "jpg");
