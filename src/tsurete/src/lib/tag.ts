// 計測タグ：お店のサイトに貼ってもらい、AIから来たお客様と売上を数える（Googleなどを通さない）
// 集めるのは「見たページ」「どのサイトから来たか」「購入金額」だけ。名前・メールなどの個人の情報は集めない
// デモなので、送り先は架空の tsurete.example
export type TagKind = "shopify" | "script" | "csv";
export const SHOP_ID = "sorae-demo";
const ENDPOINT = "https://tag.tsurete.example";

export function tagKind(site: string): TagKind {
  if (site === "shopify") return "shopify";
  if (["wordpress", "spider", "other"].includes(site)) return "script";
  return "csv"; // 楽天・Amazon・Yahoo!・BASE・STORES は、自由にタグを入れられない
}

export const SNIPPET: Record<Exclude<TagKind, "csv">, { steps: string[]; code: string; buy?: string }> = {
  shopify: {
    steps: ["Shopifyの管理画面で「設定」→「お客様のイベント」を開く", "「カスタムピクセルを追加」を押し、名前を「TSURETE」にする", "下のコードを貼りつけて保存し、「接続」を押す"],
    code: `// TSURETE 計測（Shopify カスタムピクセル）
const T = "${ENDPOINT}/e?shop=${SHOP_ID}";
const send = (type, d) => fetch(T, { method: "POST", keepalive: true, body: JSON.stringify({ type, ...d }) });
analytics.subscribe("page_viewed", (e) => {
  const doc = e.context.document;
  send("view", { url: doc.location.href, ref: doc.referrer });
});
analytics.subscribe("checkout_completed", (e) => {
  send("purchase", { value: e.data.checkout.totalPrice?.amount });
});`,
  },
  script: {
    steps: ["サイトのすべてのページの <head> の中に、下のタグを貼る（WordPressなら、テーマの「ヘッダー」やタグ用のプラグインから）", "注文が終わったページ（サンクスページ）にだけ、下の「購入」のタグも貼る"],
    code: `<script async src="${ENDPOINT}/t.js" data-shop="${SHOP_ID}"></script>`,
    buy: `<script>window.tsurete=window.tsurete||[];tsurete.push(["purchase",{ value: 注文の合計金額 }]);</script>`,
  },
};

// お店のプライバシーポリシーに足してもらう文（外部送信の規律のため）
export const PRIVACY = `【外部へのデータの送信について】
当店では、サイトの利用状況を知るために、次の情報を外部のサービスに送信しています。
・送信先：TSURETE（AIからの来店を計測するサービス）
・送信する情報：閲覧したページのURL、どのサイトから来たか、購入金額
・利用目的：AIのサービスなどから来たお客様の数と売上を集計するため
氏名・メールアドレス・住所など、個人を特定できる情報は送信しません。`;
