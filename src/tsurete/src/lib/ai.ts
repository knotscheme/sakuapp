"use client";

// 自分のAPIキーでAIを使う（BYOK）。キーはこの端末だけに保存し、ブラウザから各社へ直接送る
// ここでは「自分の店がAIのおすすめに出るか」を本当に聞いてみるときにだけ使う
import Anthropic from "@anthropic-ai/sdk";
import { useSyncExternalStore } from "react";

export type Provider = "gemini" | "anthropic" | "openai";
export type AiConf = { provider: Provider | ""; key: string; model: string };
export const MODELS: Record<Provider, string> = { gemini: "gemini-3.5-flash", anthropic: "claude-opus-5-5", openai: "gpt-6-luna" };
export const PNAME: Record<Provider, string> = { gemini: "Gemini（Google・無料枠あり）", anthropic: "Claude（Anthropic）", openai: "ChatGPT（OpenAI）" };

const KEY = "tsr-ai-v1";
let cur: AiConf = { provider: "", key: "", model: "" };
let loaded = false;
const subs = new Set<() => void>();
const get = () => { if (!loaded && typeof window !== "undefined") { loaded = true; try { cur = { ...cur, ...JSON.parse(localStorage.getItem(KEY) ?? "{}") }; } catch {} } return cur; };
export const useAi = () => useSyncExternalStore((f) => { subs.add(f); return () => subs.delete(f); }, get, () => cur);
export function saveAi(c: AiConf) { cur = c; try { localStorage.setItem(KEY, JSON.stringify(c)); } catch {} subs.forEach((f) => f()); }
export const aiReady = (c = get()) => !!c.provider && !!c.key;

function friendly(status: number) {
  if (status === 400 || status === 401 || status === 403) return "APIキーが使えませんでした。設定の画面でキーを確かめてください";
  if (status === 404) return "AIのモデルが見つかりませんでした。設定の画面でモデル名を確かめてください";
  if (status === 429) return "AIを使える量の上限になりました。少し時間をおいてください";
  return "AIにつながりませんでした。少し時間をおいて、もう一度お試しください";
}

async function call(prompt: string, image?: { b64: string; mime: string }, json = false): Promise<string> {
  const c = get();
  if (!aiReady(c)) throw new Error("AIの設定がまだです（設定の画面で、APIキーを入れてください）");
  const model = c.model || MODELS[c.provider as Provider];
  if (c.provider === "gemini") {
    const parts: unknown[] = [{ text: prompt }];
    if (image) parts.unshift({ inlineData: { mimeType: image.mime, data: image.b64 } });
    let r: Response;
    try {
      r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, { method: "POST", headers: { "content-type": "application/json", "x-goog-api-key": c.key }, body: JSON.stringify({ contents: [{ role: "user", parts }], generationConfig: json ? { responseMimeType: "application/json" } : {} }) });
    } catch { throw new Error(friendly(0)); }
    if (!r.ok) throw new Error(friendly(r.status));
    const j = await r.json();
    return (j.candidates?.[0]?.content?.parts ?? []).map((p: { text?: string }) => p.text ?? "").join("");
  }
  if (c.provider === "openai") {
    const content: unknown[] = [{ type: "text", text: prompt }];
    if (image) content.push({ type: "image_url", image_url: { url: `data:${image.mime};base64,${image.b64}` } });
    let r: Response;
    try {
      r = await fetch("https://api.openai.com/v1/chat/completions", { method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${c.key}` }, body: JSON.stringify({ model, messages: [{ role: "user", content }], ...(json ? { response_format: { type: "json_object" } } : {}) }) });
    } catch { throw new Error(friendly(0)); }
    if (!r.ok) throw new Error(friendly(r.status));
    return (await r.json()).choices?.[0]?.message?.content ?? "";
  }
  // Claude：断られたときは、別のモデルが自動で引き継ぐ
  const client = new Anthropic({ apiKey: c.key, dangerouslyAllowBrowser: true, maxRetries: 1 });
  const content: Anthropic.ContentBlockParam[] = [{ type: "text", text: prompt }];
  if (image) content.unshift({ type: "image", source: { type: "base64", media_type: image.mime as "image/jpeg", data: image.b64 } });
  try {
    const res = await client.beta.messages.create({
      model, max_tokens: 16000, betas: ["server-side-fallback-2026-07-01"], fallbacks: "default",
      output_config: { effort: "low" }, messages: [{ role: "user", content }],
    } as unknown as Anthropic.Beta.Messages.MessageCreateParamsNonStreaming);
    if (res.stop_reason === "refusal") throw new Error("この内容にはお答えできませんでした");
    return res.content.map((b) => (b.type === "text" ? b.text : "")).join("");
  } catch (e) {
    if (e instanceof Anthropic.APIError) throw new Error(friendly(e.status ?? 0));
    throw e;
  }
}

// 自分の店が、AIのおすすめに出てくるかを本当に聞いてみる
export async function askProduct(question: string) {
  return call(`${question}\nおすすめの商品を3つ選んでください。ブランド名・商品名・おすすめの理由を、1つにつき1行で短く答えてください。`);
}
