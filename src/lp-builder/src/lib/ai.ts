// 自分のAPIキーでAIを使う（BYOK）
// キーはこのブラウザの中だけに置き、ブラウザから各社のAIへ直接送る。LP BUILDER のサーバーには一切送らない
import Anthropic from "@anthropic-ai/sdk";
import { useSyncExternalStore } from "react";
import { copyPrompt, copySchema, fillSlotPrompt, parseCopy } from "./prompt";
import type { BasicInfo, Slot, Template } from "./types";

export type Provider = "gemini" | "openai" | "anthropic";
export type AiSettings = {
  text: Provider | "";
  image: "gemini" | "openai" | "";
  keys: Record<Provider, string>;
  models: { geminiText: string; geminiImage: string; openaiText: string; openaiImage: string; anthropicText: string };
  remember: boolean; // true: この端末に保存／false: タブを閉じたら消える
};

export const DEFAULT_MODELS: AiSettings["models"] = {
  geminiText: "gemini-3.5-flash",
  geminiImage: "gemini-3.1-flash-image",
  openaiText: "gpt-6-luna",
  openaiImage: "gpt-image-2",
  anthropicText: "claude-opus-5-5",
};
const DEFAULT: AiSettings = { text: "", image: "", keys: { gemini: "", openai: "", anthropic: "" }, models: DEFAULT_MODELS, remember: true };

export const PROVIDERS: Record<Provider, { name: string; site: string; keyUrl: string; free: string; canImage: boolean }> = {
  gemini: { name: "Gemini（Google）", site: "Google AI Studio", keyUrl: "https://aistudio.google.com/apikey", free: "無料枠あり（文章）。画像の生成は有料の場合があります", canImage: true },
  openai: { name: "ChatGPT（OpenAI）", site: "OpenAI Platform", keyUrl: "https://platform.openai.com/api-keys", free: "使った分だけ有料（前払い）", canImage: true },
  anthropic: { name: "Claude（Anthropic）", site: "Claude Console", keyUrl: "https://platform.claude.com/settings/keys", free: "使った分だけ有料（前払い）。文章だけ", canImage: false },
};

const KEY = "lpb-ai-v1";
let cur: AiSettings = DEFAULT;
let loaded = false;
const subs = new Set<() => void>();
function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = localStorage.getItem(KEY) ?? sessionStorage.getItem(KEY);
    if (raw) { const p = JSON.parse(raw); cur = { ...DEFAULT, ...p, keys: { ...DEFAULT.keys, ...p.keys }, models: { ...DEFAULT_MODELS, ...p.models } }; }
  } catch {}
}
export function getAi() { load(); return cur; }
export function saveAi(next: AiSettings) {
  cur = next;
  try {
    localStorage.removeItem(KEY); sessionStorage.removeItem(KEY);
    (next.remember ? localStorage : sessionStorage).setItem(KEY, JSON.stringify(next));
  } catch {}
  subs.forEach((f) => f());
}
export function clearAi() { saveAi({ ...DEFAULT, remember: cur.remember }); }
export function useAi() {
  return useSyncExternalStore((f) => { subs.add(f); return () => subs.delete(f); }, getAi, () => DEFAULT);
}
export const textReady = (s: AiSettings) => !!s.text && !!s.keys[s.text];
export const imageReady = (s: AiSettings) => !!s.image && !!s.keys[s.image];
export const mask = (k: string) => (k.length > 8 ? `${k.slice(0, 4)}…${k.slice(-4)}` : k ? "••••" : "");

// エラーの内容を、わかりやすい言葉にする
function friendly(status: number, body: string) {
  if (status === 400 && /api key|API_KEY_INVALID|invalid.*key/i.test(body)) return "APIキーが正しくないようです。設定画面でキーを確かめてください";
  if (status === 401 || status === 403) return "APIキーが使えませんでした（キーが違う・権限が無い・支払いの設定がまだ、など）";
  if (status === 404) return "モデルが見つかりませんでした。設定画面の「使えるモデルを読み込む」で選び直してください";
  if (status === 429) return "使える量の上限に達しました。少し時間をおくか、各社の管理画面で上限・支払いを確かめてください";
  if (status >= 500) return "AIのサービス側で一時的な不具合が起きています。少し時間をおいてもう一度試してください";
  const m = body.match(/"message"\s*:\s*"([^"]+)"/);
  return `うまくいきませんでした（${status}）${m ? `：${m[1]}` : ""}`;
}
async function req(url: string, init: RequestInit) {
  let r: Response;
  try { r = await fetch(url, init); } catch { throw new Error("AIに接続できませんでした。ネットの接続を確かめてください"); }
  const text = await r.text();
  if (!r.ok) throw new Error(friendly(r.status, text));
  return JSON.parse(text);
}

const claude = (key: string) => new Anthropic({ apiKey: key, dangerouslyAllowBrowser: true, maxRetries: 1 });

// ===== 文章を作る =====
export async function generateCopy(t: Template, info: BasicInfo, s = getAi()): Promise<Record<string, string>> {
  if (!textReady(s)) throw new Error("文章を作るAIが設定されていません");
  const p = s.text as Provider, key = s.keys[p];
  const prompt = copyPrompt(t, info);
  if (p === "gemini") {
    const j = await req(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(s.models.geminiText)}:generateContent`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig: { responseMimeType: "application/json" } }),
    });
    const text = (j.candidates?.[0]?.content?.parts ?? []).map((x: { text?: string }) => x.text ?? "").join("");
    if (!text) throw new Error("AIから文章が返ってきませんでした（内容の制限にかかった可能性があります）");
    return parseCopy(t, text);
  }
  if (p === "openai") {
    const j = await req("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
      body: JSON.stringify({ model: s.models.openaiText, messages: [{ role: "user", content: prompt }], response_format: { type: "json_object" } }),
    });
    return parseCopy(t, j.choices?.[0]?.message?.content ?? "");
  }
  // Claude：JSON の形を指定して返してもらう。断られた場合は別のモデルが自動で引き継ぐ
  try {
    const res = await claude(key).beta.messages.create({
      model: s.models.anthropicText,
      max_tokens: 16000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "low", format: { type: "json_schema", schema: copySchema(t) } },
      messages: [{ role: "user", content: prompt }],
    } as unknown as Anthropic.Beta.Messages.MessageCreateParamsNonStreaming);
    if (res.stop_reason === "refusal") throw new Error("この内容では文章を作れませんでした。商品の情報を見直してください");
    const text = res.content.map((b) => (b.type === "text" ? b.text : "")).join("");
    return parseCopy(t, text);
  } catch (e) {
    if (e instanceof Anthropic.APIError) throw new Error(friendly(e.status ?? 0, e.message));
    throw e;
  }
}

// ===== 画像を作る =====
const GEMINI_RATIOS = ["1:1", "2:3", "3:2", "3:4", "4:3", "4:5", "5:4", "9:16", "16:9", "21:9"];
function nearest(r: number, list: string[]) {
  return list.reduce((a, b) => { const v = (x: string) => { const [w, h] = x.split(":").map(Number); return Math.abs(Math.log(w / h / r)); }; return v(b) < v(a) ? b : a; });
}
const b64ToBlob = (b64: string, type: string) => {
  const bin = atob(b64); const u = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
  return new Blob([u], { type });
};

export async function generateImage(slot: Slot, info: BasicInfo, extra = "", s = getAi()): Promise<Blob> {
  if (!imageReady(s)) throw new Error("画像を作るAIが設定されていません");
  const p = s.image as "gemini" | "openai", key = s.keys[p];
  const r = slot.ratio[0] / slot.ratio[1];
  const prompt = `${fillSlotPrompt(slot, info)}${extra.trim() ? `\n追加の希望：${extra.trim()}` : ""}\n写真のように自然でリアルに。画像の中に文字・ロゴ・透かしを入れない。`;
  if (p === "gemini") {
    const j = await req(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(s.models.geminiImage)}:generateContent`, {
      method: "POST",
      headers: { "content-type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }], generationConfig: { responseModalities: ["IMAGE"], imageConfig: { aspectRatio: nearest(r, GEMINI_RATIOS) } } }),
    });
    const part = (j.candidates?.[0]?.content?.parts ?? []).find((x: { inlineData?: { data: string } }) => x.inlineData?.data);
    if (!part) throw new Error("画像が返ってきませんでした（内容の制限にかかった可能性があります。指示を変えて試してください）");
    return b64ToBlob(part.inlineData.data, part.inlineData.mimeType ?? "image/png");
  }
  const size = r > 1.2 ? "1536x1024" : r < 0.83 ? "1024x1536" : "1024x1024";
  const j = await req("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
    body: JSON.stringify({ model: s.models.openaiImage, prompt, size, n: 1 }),
  });
  const b64 = j.data?.[0]?.b64_json;
  if (!b64) throw new Error("画像が返ってきませんでした");
  return b64ToBlob(b64, "image/png");
}

// ===== キーの確認と、使えるモデルの一覧 =====
export async function listModels(p: Provider, key: string): Promise<string[]> {
  if (p === "gemini") {
    const j = await req("https://generativelanguage.googleapis.com/v1beta/models?pageSize=200", { headers: { "x-goog-api-key": key } });
    return (j.models ?? []).filter((m: { supportedGenerationMethods?: string[] }) => m.supportedGenerationMethods?.includes("generateContent")).map((m: { name: string }) => m.name.replace(/^models\//, ""));
  }
  if (p === "openai") {
    const j = await req("https://api.openai.com/v1/models", { headers: { authorization: `Bearer ${key}` } });
    return (j.data ?? []).map((m: { id: string }) => m.id).sort();
  }
  try {
    const out: string[] = [];
    for await (const m of claude(key).models.list()) out.push(m.id);
    return out;
  } catch (e) {
    if (e instanceof Anthropic.APIError) throw new Error(friendly(e.status ?? 0, e.message));
    throw e;
  }
}
