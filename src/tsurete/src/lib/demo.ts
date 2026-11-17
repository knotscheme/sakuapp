// TSURETE（物販版）のデモデータと、AIのおすすめの模擬計算。
// 数字はすべて架空。同じ状態なら毎回同じ結果になるよう、乱数ではなくハッシュで揺らす。

export const BRAND = { name: "SORAE", owner: "佐藤", kind: "スキンケア", site: "sorae-skin.example" };

export const AIS = ["ChatGPT", "Gemini", "Claude", "Perplexity"] as const;
export type Ai = (typeof AIS)[number];
export const TRIES = 20; // 1つの質問を、1つのAIに何回聞くか

// AIが「おすすめ」を選ぶときに見ている情報
export const SIGNALS = {
  target: "だれ向けか",
  ingredient: "成分・入っていないもの",
  spec: "容量・値段のわかりやすさ",
  faq: "よくある質問",
  review: "口コミの中身",
  data: "AIが読める商品データ",
  media: "外の記事での紹介",
} as const;
export type Sig = keyof typeof SIGNALS;

export type Product = { id: string; name: string; short: string; price: number; size: string; img: string; base: Record<Sig, number> };
export const PRODUCTS: Product[] = [
  { id: "lotion", name: "SORAE 化粧水 しっとり 150ml", short: "化粧水", price: 3300, size: "150ml", img: "lotion",
    base: { target: 0.2, ingredient: 0.3, spec: 0.3, faq: 0.1, review: 0.35, data: 0.15, media: 0.2 } },
  { id: "serum", name: "SORAE 美容液 ナイアシンアミド 30ml", short: "美容液", price: 4950, size: "30ml", img: "serum",
    base: { target: 0.25, ingredient: 0.4, spec: 0.25, faq: 0.1, review: 0.3, data: 0.15, media: 0.15 } },
  { id: "uv", name: "SORAE UVジェル SPF50 60g", short: "日焼け止め", price: 2750, size: "60g", img: "uv",
    base: { target: 0.2, ingredient: 0.25, spec: 0.3, faq: 0.1, review: 0.3, data: 0.15, media: 0.1 } },
];

// ほかのブランド（すべて架空）
export type Rival = { name: string; item: string; price: number; score: number; why: string };
const R = (name: string, item: string, price: number, score: number, why: string): Rival => ({ name, item, price, score, why });

export type Question = { id: string; product: string; text: string; w: Partial<Record<Sig, number>>; rivals: Rival[] };
export const QUESTIONS: Question[] = [
  { id: "l1", product: "lotion", text: "敏感肌でも使える、3,000円台の化粧水は？", w: { target: 3, ingredient: 2, spec: 1, review: 2, data: 1 },
    rivals: [R("しずく舎", "やさしい化粧水", 3080, 0.58, "敏感肌向けと明記。無香料・アルコールフリー"), R("Lunae", "バリアローション", 3520, 0.52, "皮膚科医と共同開発と書かれている"), R("NORMA BASIC", "化粧水", 1980, 0.45, "値段が手ごろで口コミが多い"), R("あおば研究所", "保湿ローション", 3300, 0.4, "セラミド配合")] },
  { id: "l2", product: "lotion", text: "乾燥肌におすすめの、詰め替えがある化粧水", w: { target: 2, spec: 3, faq: 2, data: 1 },
    rivals: [R("あおば研究所", "保湿ローション", 3300, 0.55, "詰め替え用あり。容量と価格が明記"), R("NORMA BASIC", "化粧水", 1980, 0.5, "大容量の詰め替えパック"), R("しずく舎", "やさしい化粧水", 3080, 0.42, "乾燥肌向けの口コミが多い"), R("Lunae", "バリアローション", 3520, 0.38, "保湿力の比較記事で上位")] },
  { id: "l3", product: "lotion", text: "無香料で、アルコールが入っていない化粧水は？", w: { ingredient: 3, faq: 2, data: 2 },
    rivals: [R("しずく舎", "やさしい化粧水", 3080, 0.6, "入っていない成分の一覧がある"), R("Lunae", "バリアローション", 3520, 0.48, "無香料と明記"), R("NORMA BASIC", "化粧水", 1980, 0.42, "よくある質問に成分の説明がある"), R("あおば研究所", "保湿ローション", 3300, 0.36, "低刺激と書かれている")] },
  { id: "l4", product: "lotion", text: "30代の友だちにあげる、ちょっといい化粧水", w: { review: 2, media: 3, spec: 1, target: 1 },
    rivals: [R("Lunae", "バリアローション", 3520, 0.56, "ギフト特集の記事で紹介"), R("あおば研究所", "保湿ローション", 3300, 0.48, "箱入りでギフト対応あり"), R("しずく舎", "やさしい化粧水", 3080, 0.44, "口コミで「プレゼントに」が多い"), R("NORMA BASIC", "化粧水", 1980, 0.3, "人気ランキング上位")] },
  { id: "s1", product: "serum", text: "毛穴が気になる人向けの、ナイアシンアミド美容液", w: { ingredient: 3, target: 2, review: 2, data: 1 },
    rivals: [R("ゆらぎ肌ラボ", "ナイアシン美容液", 4400, 0.57, "配合の割合まで書かれている"), R("Lunae", "クリアセラム", 5280, 0.5, "毛穴の悩み向けと明記"), R("NORMA BASIC", "美容液", 2480, 0.44, "手ごろで口コミが多い"), R("しずく舎", "美容液", 4180, 0.36, "低刺激")] },
  { id: "s2", product: "serum", text: "初めて使う、刺激の少ない美容液は？", w: { target: 3, faq: 2, ingredient: 1, review: 1 },
    rivals: [R("しずく舎", "美容液", 4180, 0.58, "初めての人向けのよくある質問がある"), R("ゆらぎ肌ラボ", "ナイアシン美容液", 4400, 0.48, "敏感肌テスト済みと明記"), R("Lunae", "クリアセラム", 5280, 0.4, "使い方の動画つき"), R("NORMA BASIC", "美容液", 2480, 0.38, "お試しサイズあり")] },
  { id: "s3", product: "serum", text: "5,000円以下で、効果を比べて選べる美容液", w: { spec: 2, media: 3, data: 2 },
    rivals: [R("ゆらぎ肌ラボ", "ナイアシン美容液", 4400, 0.55, "比較記事で1位"), R("NORMA BASIC", "美容液", 2480, 0.5, "成分と価格の比較表がある"), R("Lunae", "クリアセラム", 5280, 0.42, "人気ランキングで紹介"), R("しずく舎", "美容液", 4180, 0.36, "口コミの点数が高い")] },
  { id: "s4", product: "serum", text: "朝も夜も使える美容液のおすすめ", w: { faq: 3, spec: 1, review: 2 },
    rivals: [R("Lunae", "クリアセラム", 5280, 0.52, "使う順番がよくある質問に書かれている"), R("ゆらぎ肌ラボ", "ナイアシン美容液", 4400, 0.48, "朝晩OKと明記"), R("NORMA BASIC", "美容液", 2480, 0.42, "毎日使いやすい値段"), R("しずく舎", "美容液", 4180, 0.34, "低刺激")] },
  { id: "u1", product: "uv", text: "白くならない、顔用の日焼け止めジェル", w: { target: 2, review: 3, data: 1, faq: 1 },
    rivals: [R("NORMA BASIC", "UVジェル", 1650, 0.56, "「白くならない」の口コミが多い"), R("Lunae", "UVミルク", 3080, 0.5, "使用感の比較記事で上位"), R("あおば研究所", "UVジェル", 2420, 0.44, "SPFと使い心地が明記"), R("しずく舎", "UVクリーム", 2860, 0.36, "敏感肌向け")] },
  { id: "u2", product: "uv", text: "石けんで落とせる日焼け止めは？", w: { ingredient: 2, faq: 3, data: 2 },
    rivals: [R("しずく舎", "UVクリーム", 2860, 0.58, "石けんで落ちるとよくある質問に明記"), R("あおば研究所", "UVジェル", 2420, 0.5, "落とし方の説明がある"), R("NORMA BASIC", "UVジェル", 1650, 0.4, "手ごろ"), R("Lunae", "UVミルク", 3080, 0.36, "低刺激")] },
  { id: "u3", product: "uv", text: "子どもと一緒に使える日焼け止め", w: { target: 3, ingredient: 2, faq: 1, media: 1 },
    rivals: [R("しずく舎", "UVクリーム", 2860, 0.6, "親子で使えると明記"), R("あおば研究所", "UVジェル", 2420, 0.46, "紫外線吸収剤不使用"), R("NORMA BASIC", "UVジェル", 1650, 0.42, "大容量"), R("Lunae", "UVミルク", 3080, 0.34, "敏感肌向け")] },
  { id: "u4", product: "uv", text: "毎日使いやすい、3,000円以下の日焼け止め", w: { spec: 3, review: 1, data: 2, media: 1 },
    rivals: [R("NORMA BASIC", "UVジェル", 1650, 0.58, "値段と容量が分かりやすい"), R("あおば研究所", "UVジェル", 2420, 0.5, "1日あたりの値段が書かれている"), R("しずく舎", "UVクリーム", 2860, 0.42, "口コミが多い"), R("Lunae", "UVミルク", 3080, 0.3, "人気ランキング")] },
];

// 直すこと（押すと「反映済み」になり、上の数字が変わる）
export type Fix = {
  id: string; title: string; why: string; effort: string; how: "auto" | "draft" | "ask";
  up: Partial<Record<Sig, number>>; before: string; after: string; note?: string;
};
export const FIXES: Fix[] = [
  { id: "target", title: "商品説明に「だれ向けか」を書く", why: "AIは「敏感肌向け」のような言葉で商品を探します。今の説明は雰囲気の言葉だけです。", effort: "5分", how: "draft",
    up: { target: 0.5 }, before: "空のように澄んだ肌へ。毎日のうるおいに寄りそう、SORAEの化粧水。",
    after: "敏感肌・乾燥肌の方のために作った化粧水です。肌がゆらぎやすい季節にも、毎日やさしくうるおいを届けます。" },
  { id: "ingredient", title: "成分と「入っていないもの」を書く", why: "「無香料」「アルコールフリー」で聞かれても、ページに書いていないため候補に入りません。", effort: "5分", how: "draft",
    up: { ingredient: 0.45 }, before: "（成分の説明なし）",
    after: "主な成分：セラミド、グリセリン、ヒアルロン酸\n入っていないもの：香料、アルコール（エタノール）、着色料、鉱物油" },
  { id: "spec", title: "容量・使える期間・1日の値段を書く", why: "「3,000円台」「詰め替え」などの質問に、比べられる数字がありません。", effort: "3分", how: "draft",
    up: { spec: 0.5 }, before: "150ml　3,300円（税込）",
    after: "150ml　3,300円（税込）・朝晩使って約2か月・1日あたり約55円\n詰め替え用（300ml）4,950円もあります" },
  { id: "faq", title: "よくある質問を6つ足す", why: "AIは質問と答えの形の文章をよく引用します。今は0件です。", effort: "10分", how: "draft",
    up: { faq: 0.55, target: 0.1 }, before: "（よくある質問なし）",
    after: "Q. 敏感肌でも使えますか？\nA. パッチテスト済みです。香料・アルコールは入っていません。\nQ. 朝も使えますか？\nA. はい、朝晩お使いいただけます。\nQ. 詰め替えはありますか？\nA. 300mlの詰め替え用があります。　…ほか3つ" },
  { id: "data", title: "AIが読める商品データを入れる", why: "商品名・値段・在庫・口コミの点数を、AIが読める形でページとGoogleの商品一覧に入れます。", effort: "1分", how: "auto",
    up: { data: 0.6 }, before: "（商品データなし）",
    after: "商品名・値段・在庫・口コミ点数（4.6／120件）・対象の肌・成分\n→ ショップのページと、Googleショッピングの商品一覧に自動で入れます" },
  { id: "review", title: "レビュー依頼の質問を変える", why: "今の口コミは「よかった」だけ。AIは「どんな肌の人に合ったか」を読んでいます。", effort: "3分", how: "draft",
    up: { review: 0.4 }, before: "商品はいかがでしたか？　★をつけてください。",
    after: "1. あなたの肌のタイプは？（敏感肌・乾燥肌・混合肌）\n2. 何に悩んで買いましたか？\n3. 使ってみて、どう変わりましたか？", note: "効果が出るまで、3〜4週間かかります" },
  { id: "media", title: "AIがよく見る比較記事に、紹介を頼む", why: "AIが答えの根拠にしている記事3本に、SORAEが載っていません。", effort: "15分", how: "ask",
    up: { media: 0.45 }, before: "（掲載なし）",
    after: "「敏感肌の化粧水 比べてみた」ほか2本の書き手に、サンプル提供の依頼文を作りました（送るかどうかはお店で決めます）", note: "載るかどうかは相手しだいです" },
];

// AIごとのくせ（どの情報を重く見るか）
const AI_BIAS: Record<Ai, Partial<Record<Sig, number>>> = {
  ChatGPT: { data: 0.06, review: 0.03 }, Gemini: { data: 0.08, spec: 0.03 }, Claude: { ingredient: 0.05, faq: 0.04 }, Perplexity: { media: 0.09, review: 0.04 },
};

export function hash(s: string) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return ((h >>> 0) % 10000) / 10000; }

export function signals(product: string, applied: string[]) {
  const p = PRODUCTS.find((x) => x.id === product)!;
  const s = { ...p.base };
  for (const f of FIXES) if (applied.includes(f.id)) for (const [k, v] of Object.entries(f.up)) s[k as Sig] = Math.min(1, s[k as Sig] + (v ?? 0)*0.5);
  return s;
}
function myScore(q: Question, ai: Ai, applied: string[]) {
  const s = signals(q.product, applied);
  let a = 0, w = 0;
  for (const [k, v] of Object.entries(q.w)) { a += (s[k as Sig] + (AI_BIAS[ai][k as Sig] ?? 0)) * (v ?? 0); w += v ?? 0; }
  return a / w;
}

// 1回分の答え：上位3つ
export type Pick = { brand: string; item: string; price: number; why: string; me?: boolean };
export function answer(q: Question, ai: Ai, applied: string[], t: number): Pick[] {
  const jit = (k: string) => (hash(`${q.id}|${ai}|${t}|${k}`) - 0.5) * 0.36;
  const mine: Pick & { s: number } = { brand: BRAND.name, item: PRODUCTS.find((p) => p.id === q.product)!.short, price: PRODUCTS.find((p) => p.id === q.product)!.price, why: myWhy(q.product, applied), me: true, s: myScore(q, ai, applied) + jit("me") };
  const all = [...q.rivals.map((r) => ({ brand: r.name, item: r.item, price: r.price, why: r.why, s: r.score + jit(r.name) })), mine];
  return all.sort((a, b) => b.s - a.s).slice(0, 3).map(({ s: _s, ...x }) => x);
}
// AIがSORAEをすすめるときの理由（直した内容しだいで具体的になる）
export function myWhy(product: string, applied: string[]) {
  const r: string[] = [];
  if (applied.includes("target")) r.push(product === "uv" ? "敏感肌・子どもにも使えると明記" : "敏感肌・乾燥肌向けと明記");
  if (applied.includes("ingredient")) r.push("無香料・アルコールフリー");
  if (applied.includes("spec")) r.push("1日あたり約55円で比べやすい");
  if (applied.includes("review")) r.push("敏感肌の人の口コミが多い");
  if (applied.includes("media")) r.push("比較記事で紹介されている");
  return r.length ? r.slice(0, 2).join("。") : "ブランドの世界観がすてき（理由があいまい）";
}

// 何回出たか
export function shown(q: Question, ai: Ai, applied: string[]) { let n = 0; for (let t = 0; t < TRIES; t++) if (answer(q, ai, applied, t).some((x) => x.me)) n++; return n; }
export function shelf(applied: string[]) {
  const rows = QUESTIONS.map((q) => { const by = AIS.map((a) => shown(q, a, applied)); return { q, by, n: by.reduce((x, y) => x + y, 0) }; });
  const total = rows.reduce((a, r) => a + r.n, 0), max = QUESTIONS.length * AIS.length * TRIES;
  const byAi = AIS.map((a, i) => ({ ai: a, n: rows.reduce((x, r) => x + r.by[i], 0), max: QUESTIONS.length * TRIES }));
  const byProduct = PRODUCTS.map((p) => { const rs = rows.filter((r) => r.q.product === p.id); return { p, n: rs.reduce((x, r) => x + r.n, 0), max: rs.length * AIS.length * TRIES }; });
  // 代わりに出てきたブランド
  const rivalCount: Record<string, number> = {};
  for (const q of QUESTIONS) for (const a of AIS) for (let t = 0; t < TRIES; t++) for (const x of answer(q, a, applied, t)) if (!x.me) rivalCount[x.brand] = (rivalCount[x.brand] ?? 0) + 1;
  const rivals = Object.entries(rivalCount).sort((a, b) => b[1] - a[1]).map(([name, n]) => ({ name, n }));
  return { rows, total, max, pct: Math.round((total / max) * 100), byAi, byProduct, rivals };
}

// AIから来たお客様と売上（月の見込み）
export const AVG = 3800;
export function sales(pct: number) { const visits = Math.round(40 + pct * 6); const orders = Math.round(visits * 0.045); return { visits, orders, yen: orders * AVG }; }
export const PAST = [{ w: "9/22", o: 2 }, { w: "9/29", o: 1 }, { w: "10/6", o: 3 }, { w: "10/13", o: 2 }, { w: "10/20", o: 2 }, { w: "10/27", o: 3 }, { w: "11/3", o: 2 }, { w: "11/10", o: 3 }];

export const fmt = (n: number) => n.toLocaleString("ja-JP");

// 商品ページの中身（書き直し前 → AIの書き直し案）。キーは FIXES の id と同じ
export type PageText = { catch: string; target: [string, string]; ingredient: [string, string]; spec: [string, string]; faq: [string, string] };
export const PAGES: Record<string, PageText> = {
  lotion: {
    catch: "毎日のうるおいに",
    target: ["空のように澄んだ肌へ。毎日のうるおいに寄りそう、SORAEの化粧水。", "敏感肌・乾燥肌の方のために作った化粧水です。肌がゆらぎやすい季節にも、毎日やさしくうるおいを届けます。"],
    ingredient: ["", "主な成分：セラミド、グリセリン、ヒアルロン酸\n入っていないもの：香料、アルコール（エタノール）、着色料、鉱物油"],
    spec: ["150ml　3,300円（税込）", "150ml　3,300円（税込）\n朝晩使って約2か月・1日あたり約55円\n詰め替え用（300ml）4,950円もあります"],
    faq: ["", "Q. 敏感肌でも使えますか？\nA. パッチテスト済みで、香料・アルコールは入っていません。\nQ. 朝も使えますか？\nA. はい、朝晩お使いいただけます。\nQ. 詰め替えはありますか？\nA. 300mlの詰め替え用があります。"],
  },
  serum: {
    catch: "透明感のその先へ",
    target: ["透明感のその先へ。SORAEの美容液。", "毛穴やくすみが気になる方のための美容液です。初めて美容液を使う方でも続けやすいよう、刺激を抑えて作りました。"],
    ingredient: ["", "主な成分：ナイアシンアミド5%、パンテノール、ヒアルロン酸\n入っていないもの：香料、アルコール（エタノール）、着色料、パラベン"],
    spec: ["30ml　4,950円（税込）", "30ml　4,950円（税込）\n朝晩2〜3滴で約1.5か月・1日あたり約110円"],
    faq: ["", "Q. 朝も夜も使えますか？\nA. はい。化粧水のあとにお使いください。\nQ. 初めてでも刺激はありませんか？\nA. パッチテスト済みです。心配な方は腕の内側で試してからお使いください。\nQ. ほかの美容液と一緒に使えますか？\nA. はい。SORAEの美容液を先にお使いください。"],
  },
  uv: {
    catch: "毎日の、軽やかなUVケア",
    target: ["毎日の、軽やかなUVケア。", "敏感肌の方やお子さまとも使える、顔・からだ用の日焼け止めジェルです。白くならず、毎日のメイク下地にも使えます。"],
    ingredient: ["", "紫外線吸収剤を使っていません（ノンケミカル）\n入っていないもの：香料、アルコール（エタノール）、着色料"],
    spec: ["60g　2,750円（税込）", "60g　2,750円（税込）・SPF50 PA++++\n顔に毎日使って約1か月・1日あたり約90円"],
    faq: ["", "Q. 石けんで落とせますか？\nA. はい、ふだんの洗顔料や石けんで落とせます。\nQ. 子どもにも使えますか？\nA. 1歳ごろから使えます。\nQ. 白くなりませんか？\nA. 透明なジェルなので、白くなりにくいです。"],
  },
};
