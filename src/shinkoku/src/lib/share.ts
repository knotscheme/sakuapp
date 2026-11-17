// 家族とのやりとり用のリンク。サーバーは使わない
// 中身は暗号化（AES-GCM）し、鍵はリンクの「#」より後ろに入れる。「#」より後ろはサーバーに送られない
import { deflateSync, inflateSync, strFromU8, strToU8 } from "fflate";

const b64u = (u: Uint8Array) => btoa(String.fromCharCode(...u)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
const unb64u = (s: string) => Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/")), (c) => c.charCodeAt(0));

export type AskItem = { id: string; d: string; a: number; m: string; p: string; inc: boolean; acc: string; pct: number; per: string };
export type Ask = { v: 1; kind: "ask"; id: string; from: string; at: string; items: AskItem[]; sum: { sales: number; expenses: number; tax: number; next: string } };
export type Answer = { id: string; acc: string; pct: number; per: string; ask: boolean; note: string };
export type Reply = { v: 1; kind: "reply"; req: string; by: string; at: string; answers: Answer[] };

const DAYS = 14; // リンクの有効期限

export async function pack(obj: Ask | Reply) {
  const key = crypto.getRandomValues(new Uint8Array(16)), iv = crypto.getRandomValues(new Uint8Array(12));
  const k = await crypto.subtle.importKey("raw", key, "AES-GCM", false, ["encrypt"]);
  const data = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, k, deflateSync(strToU8(JSON.stringify(obj)), { level: 9 })));
  const body = new Uint8Array(iv.length + data.length); body.set(iv); body.set(data, iv.length);
  return `${b64u(body)}.${b64u(key)}`;
}

export async function unpack<T extends Ask | Reply>(code: string): Promise<T> {
  const m = code.trim().match(/([A-Za-z0-9_-]{20,})\.([A-Za-z0-9_-]{20,})/);
  if (!m) throw new Error("リンクが正しくないようです。届いたリンクを、そのまま開いてください");
  try {
    const body = unb64u(m[1]), key = unb64u(m[2]);
    const k = await crypto.subtle.importKey("raw", key as BufferSource, "AES-GCM", false, ["decrypt"]);
    const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv: body.slice(0, 12) as BufferSource }, k, body.slice(12) as BufferSource);
    const obj = JSON.parse(strFromU8(inflateSync(new Uint8Array(plain)))) as T;
    if (Date.now() - new Date(obj.at).getTime() > DAYS * 86400000) throw new Error("old");
    return obj;
  } catch (e) {
    if ((e as Error).message === "old") throw new Error(`このリンクは期限（${DAYS}日）が過ぎています。新しいリンクを送ってもらってください`);
    throw new Error("リンクを開けませんでした。途中で切れていないか確かめてください");
  }
}

const BASE = "/sakuapp/works/shinkoku";
export const askUrl = (code: string) => `${location.origin}${BASE}/kazoku/tetsudai/#p=${code}`;
export const replyUrl = (code: string) => `${location.origin}${BASE}/kazoku/#r=${code}`;
export const lineUrl = (text: string) => `https://line.me/R/msg/text/?${encodeURIComponent(text)}`;
export const mailUrl = (subject: string, body: string) => `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
