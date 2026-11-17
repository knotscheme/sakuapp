// AIへの指示文（プロンプト）を作る
// 自分のAPIキーで自動で作るときも、ChatGPT などに貼ってコピーで作るときも、同じ指示文を使う
import type { BasicInfo, Slot, Template } from "./types";

const or = (s: string, d: string) => (s.trim() ? s.trim() : d);

export function fillSlotPrompt(s: Slot, info: BasicInfo) {
  return s.prompt.replaceAll("{product}", or(info.product, "商品")).replaceAll("{brand}", or(info.brand, "ブランド")).replaceAll("{target}", or(info.target, "大人"));
}

// 文章を作る指示。返事は JSON だけにしてもらう
export function copyPrompt(t: Template, info: BasicInfo) {
  const keys = t.fields.filter((f) => !f.url).map((f) => `- "${f.id}": ${f.label}${f.max ? `（${f.max}文字くらいまで）` : ""}${f.hint ? `。${f.hint}` : ""}${f.multiline ? "。改行は \\n" : ""}`);
  return `あなたは日本のEC・広告に強いコピーライターです。次の商品のランディングページ（LP）の文章を、日本語で書いてください。

# 商品の情報
- ブランド名：${or(info.brand, "（未定。商品に合う名前を考える）")}
- 商品・サービス：${or(info.product, "（未入力）")}
- 届けたい人：${or(info.target, "（未入力）")}
- 強み・特長：${or(info.strengths, "（未入力）")}
- 文章の雰囲気：${or(info.tone, "読みやすく、信頼できる")}
- 価格：${or(info.price, "（未入力）")}

# LPの型
「${t.name}」（${t.kind}向け）：${t.desc}

# ルール
- 事実として確かめられないこと（「No.1」「医師が推薦」「必ず効く」など）は書かない。商品の情報に無い数字は作らない
- 化粧品・健康食品は、薬機法に触れる表現（治る・効く・シミが消える 等）を使わない
- お客様の声は作り話をしない。情報が無ければ空文字 "" にする
- 一文を短く、やさしい言葉で。文字数の目安を守る（LPのデザインが崩れないよう、目安より長くしない）
- 項目の説明に「＊で囲む」とあるものは、色を変えたい言葉を ＊ で囲む（例：＊上質な革財布＊を。）
- 項目の説明に「、で区切る」「｜で区切る」「空白」とあるものは、その書き方を守る

# 返事の形
次のキーを持つ JSON だけを返してください（前後に説明や \`\`\` は付けない）。
${keys.join("\n")}`;
}

// AIの返事から JSON を取り出し、型の項目に当てはまるものだけを使う
export function parseCopy(t: Template, text: string): Record<string, string> {
  const s = text.indexOf("{"), e = text.lastIndexOf("}");
  if (s < 0 || e <= s) throw new Error("返事の中に JSON（{ } で囲まれた部分）が見つかりませんでした");
  let obj: Record<string, unknown>;
  try { obj = JSON.parse(text.slice(s, e + 1)); } catch { throw new Error("JSON の形が正しくありません。AIの返事を、そのまま全部貼り付けてください"); }
  const out: Record<string, string> = {};
  for (const f of t.fields) {
    const v = obj[f.id];
    if (typeof v === "string" && !f.url) out[f.id] = v.replace(/\\n/g, "\n").trim();
  }
  if (!Object.keys(out).length) throw new Error("この型の項目が1つも入っていませんでした");
  return out;
}

// 構造化出力（JSON の形を指定）に使う設計図
export function copySchema(t: Template) {
  const fields = t.fields.filter((f) => !f.url);
  return {
    type: "object",
    properties: Object.fromEntries(fields.map((f) => [f.id, { type: "string", description: f.label }])),
    required: fields.map((f) => f.id),
    additionalProperties: false,
  };
}
