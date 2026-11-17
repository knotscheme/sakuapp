// バックアップ：合言葉で暗号化して、ファイルに書き出す（AES-GCM）。合言葉はどこにも保存しない
import type { State } from "./store";

const enc = new TextEncoder(), dec = new TextDecoder();
const b64 = (u: Uint8Array) => btoa(String.fromCharCode(...u));
const unb64 = (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

async function keyFrom(pass: string, salt: Uint8Array) {
  const base = await crypto.subtle.importKey("raw", enc.encode(pass), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey({ name: "PBKDF2", salt: salt as BufferSource, iterations: 250_000, hash: "SHA-256" }, base, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
}
export async function makeBackup(state: State, pass: string) {
  const receipts: Record<string, string> = {};
  for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i)!; if (k.startsWith("jbs-rc-")) receipts[k] = localStorage.getItem(k)!; }
  const salt = crypto.getRandomValues(new Uint8Array(16)), iv = crypto.getRandomValues(new Uint8Array(12));
  const data = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, await keyFrom(pass, salt), enc.encode(JSON.stringify({ state, receipts })));
  return JSON.stringify({ app: "jibun-shinkoku", v: 1, made: new Date().toISOString(), salt: b64(salt), iv: b64(iv), data: b64(new Uint8Array(data)) });
}
export async function openBackup(text: string, pass: string): Promise<{ state: State; receipts: Record<string, string> }> {
  let j: { app?: string; salt: string; iv: string; data: string };
  try { j = JSON.parse(text); } catch { throw new Error("バックアップのファイルではないようです"); }
  if (j.app !== "jibun-shinkoku") throw new Error("じぶん申告のバックアップではありません");
  try {
    const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv: unb64(j.iv) as BufferSource }, await keyFrom(pass, unb64(j.salt)), unb64(j.data) as BufferSource);
    return JSON.parse(dec.decode(plain));
  } catch { throw new Error("合言葉がちがうようです"); }
}
