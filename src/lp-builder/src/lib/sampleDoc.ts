import { viewDoc } from "./render";
import { SAMPLES, sampleImgUrl } from "./samples";
import { getTemplate } from "./templates";
import type { Project } from "./types";

// 作品例を表示するためのHTML
export function sampleDoc(id: string) {
  const s = SAMPLES.find((x) => x.id === id)!;
  const t = getTemplate(s.tpl);
  const p: Project = { v: 1, tpl: t.id, info: s.info, fields: s.fields, colors: { ...Object.fromEntries(t.colors.map((c) => [c.id, c.value])), ...s.colors }, imgs: {}, updated: 0 };
  const origin = typeof location !== "undefined" ? location.origin : "";
  return viewDoc(t, p, (slot) => `${origin}${sampleImgUrl(s.imgs[slot] ?? "")}`);
}
