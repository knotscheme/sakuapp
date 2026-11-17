"use client";

// いま作っているLP（1つ）。変えるたびに、このブラウザの中に自動で保存する
import { useSyncExternalStore } from "react";
import { dbClearImages, dbDel, dbGet, dbSet, imgKey, type StoredImg } from "./db";
import { extOf, imageSize, processImage } from "./image";
import { SAMPLES, sampleImgUrl } from "./samples";
import { getTemplate } from "./templates";
import { EMPTY_INFO, type BasicInfo, type ImgMeta, type Project } from "./types";

type State = { ready: boolean; p: Project | null; urls: Record<string, string>; saving: boolean };
let st: State = { ready: false, p: null, urls: {}, saving: false };
const subs = new Set<() => void>();
const set = (n: Partial<State>) => { st = { ...st, ...n }; subs.forEach((f) => f()); };
export const useProject = () => useSyncExternalStore((f) => { subs.add(f); return () => subs.delete(f); }, () => st, () => st);
export const getProject = () => st.p;

let timer: ReturnType<typeof setTimeout> | undefined;
function persist() {
  clearTimeout(timer);
  set({ saving: true });
  timer = setTimeout(async () => { if (st.p) await dbSet("project", st.p); set({ saving: false }); }, 400);
}
function update(fn: (p: Project) => Project) {
  if (!st.p) return;
  set({ p: { ...fn(st.p), updated: Date.now() } });
  persist();
}

let started = false;
export async function initProject() {
  if (started) return;
  started = true;
  try {
    const p = await dbGet<Project>("project");
    const urls: Record<string, string> = {};
    if (p) {
      for (const slot of Object.keys(p.imgs)) {
        const im = await dbGet<StoredImg>(imgKey(slot));
        if (im) urls[slot] = URL.createObjectURL(im.out);
      }
    }
    set({ ready: true, p: p ?? null, urls });
  } catch {
    set({ ready: true });
  }
}

function revokeAll() { Object.values(st.urls).forEach((u) => URL.revokeObjectURL(u)); }

// 新しく作る：文章は見本から始め、基本情報（名前・価格・リンク）は入れたものを使う
export async function newProject(tplId: string, info: BasicInfo = EMPTY_INFO) {
  const t = getTemplate(tplId);
  const sample = SAMPLES.find((s) => s.tpl === t.id)!;
  revokeAll();
  await dbClearImages();
  const fields = { ...sample.fields };
  const p: Project = { v: 1, tpl: t.id, info, fields: applyInfo(fields, info), colors: Object.fromEntries(t.colors.map((c) => [c.id, c.value])), imgs: {}, updated: Date.now() };
  set({ p, urls: {} });
  await dbSet("project", p);
}

// 作品例をまるごと（写真も）読み込む
export async function loadSample(id: string) {
  const s = SAMPLES.find((x) => x.id === id)!;
  const t = getTemplate(s.tpl);
  revokeAll();
  await dbClearImages();
  const p: Project = { v: 1, tpl: t.id, info: { ...s.info }, fields: { ...s.fields }, colors: { ...Object.fromEntries(t.colors.map((c) => [c.id, c.value])), ...s.colors }, imgs: {}, updated: Date.now() };
  set({ p, urls: {} });
  for (const slot of t.slots) {
    const path = s.imgs[slot.id];
    if (!path) continue;
    try {
      const blob = await (await fetch(sampleImgUrl(path))).blob();
      await putImage(slot.id, blob, "sample", path.split("/").pop() ?? slot.id);
    } catch {}
  }
  await dbSet("project", st.p);
}

export function applyInfo(fields: Record<string, string>, info: BasicInfo) {
  const f = { ...fields };
  if (info.brand.trim()) f.brand = info.brand.trim();
  if (info.price.trim() && "price" in f) f.price = info.price.trim();
  if (info.url.trim()) f.ctaUrl = info.url.trim();
  return f;
}

export const setInfo = (info: BasicInfo) => update((p) => ({ ...p, info, fields: applyInfo(p.fields, info) }));
export const setField = (id: string, v: string) => update((p) => ({ ...p, fields: { ...p.fields, [id]: v } }));
export const setFields = (f: Record<string, string>) => update((p) => ({ ...p, fields: { ...p.fields, ...f } }));
export const setColor = (id: string, v: string) => update((p) => ({ ...p, colors: { ...p.colors, [id]: v } }));
export const resetColors = () => update((p) => ({ ...p, colors: Object.fromEntries(getTemplate(p.tpl).colors.map((c) => [c.id, c.value])) }));

// 画像を入れる（切り抜き・縮小してから保存）
export async function putImage(slotId: string, orig: Blob, source: ImgMeta["source"], name: string, keep?: Pick<ImgMeta, "fx" | "fy" | "zoom">) {
  if (!st.p) return;
  const slot = getTemplate(st.p.tpl).slots.find((s) => s.id === slotId);
  if (!slot) return;
  const m = keep ?? { fx: 0.5, fy: 0.5, zoom: 1 };
  const r = await processImage(orig, slot, m);
  await dbSet(imgKey(slotId), { orig, out: r.out } satisfies StoredImg);
  const meta: ImgMeta = { name, w: r.w, h: r.h, ...m, source, outW: r.outW };
  const old = st.urls[slotId];
  if (old) URL.revokeObjectURL(old);
  set({ urls: { ...st.urls, [slotId]: URL.createObjectURL(r.out) } });
  update((p) => ({ ...p, imgs: { ...p.imgs, [slotId]: meta } }));
}

// 切り抜く位置・大きさを直す
export async function recrop(slotId: string, m: Pick<ImgMeta, "fx" | "fy" | "zoom">) {
  const im = await dbGet<StoredImg>(imgKey(slotId));
  const meta = st.p?.imgs[slotId];
  if (!im || !meta) return;
  await putImage(slotId, im.orig, meta.source, meta.name, m);
}

export async function removeImage(slotId: string) {
  await dbDel(imgKey(slotId));
  const u = st.urls[slotId];
  if (u) URL.revokeObjectURL(u);
  const urls = { ...st.urls }; delete urls[slotId];
  set({ urls });
  update((p) => { const imgs = { ...p.imgs }; delete imgs[slotId]; return { ...p, imgs }; });
}

// 2つの枠の画像を入れ替える
export async function swapImages(a: string, b: string) {
  const [ia, ib] = await Promise.all([dbGet<StoredImg>(imgKey(a)), dbGet<StoredImg>(imgKey(b))]);
  const ma = st.p?.imgs[a], mb = st.p?.imgs[b];
  if (ia && ma) await putImage(b, ia.orig, ma.source, ma.name); else await removeImage(b);
  if (ib && mb) await putImage(a, ib.orig, mb.source, mb.name); else await removeImage(a);
}

export async function getOrig(slotId: string) { return (await dbGet<StoredImg>(imgKey(slotId)))?.orig; }

// 書き出し用の画像
export async function exportImages() {
  const out: Record<string, { data: Uint8Array; ext: string }> = {};
  if (!st.p) return out;
  for (const slot of Object.keys(st.p.imgs)) {
    const im = await dbGet<StoredImg>(imgKey(slot));
    if (im) out[slot] = { data: new Uint8Array(await im.out.arrayBuffer()), ext: extOf(im.out) };
  }
  return out;
}

// zip から続きを読み込む
export async function importProject(p: Project, imgs: Record<string, Blob>) {
  const t = getTemplate(p.tpl);
  revokeAll();
  await dbClearImages();
  const clean: Project = { v: 1, tpl: t.id, info: { ...EMPTY_INFO, ...p.info }, fields: { ...p.fields }, colors: { ...p.colors }, imgs: {}, updated: Date.now() };
  set({ p: clean, urls: {} });
  for (const [slot, blob] of Object.entries(imgs)) {
    const meta = p.imgs?.[slot];
    await putImage(slot, blob, meta?.source ?? "upload", meta?.name ?? `${slot}`);
  }
  await dbSet("project", st.p);
}

export async function closeProject() {
  revokeAll();
  await dbClearImages();
  await dbDel("project");
  set({ p: null, urls: {} });
}

export { imageSize };
