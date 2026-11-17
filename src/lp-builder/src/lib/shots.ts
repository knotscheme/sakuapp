// 作品例のスクリーンショット（パソコン・スマホ）。scripts/shots.js で作る
export const shotUrl = (id: string, kind: "pc" | "sp") => `${process.env.NEXT_PUBLIC_BASE ?? ""}/samples/shots/${id}-${kind}.webp`;
