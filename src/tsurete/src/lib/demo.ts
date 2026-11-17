// デモの舞台：架空の整体院「ほぐし処 そよかぜ」（架空の町・みなと台）
// AIの推薦・予約・空き予測・紹介の数字は、すべて決まった計算で作った「模擬の結果」です

export const SHOP = {
  name: "ほぐし処 そよかぜ",
  kind: "整体院",
  area: "みなと台駅",
  owner: "佐藤",
  hours: "10:00〜21:00（最終受付 20:00）",
  address: "みなと台2丁目（架空の住所）",
  menus: [
    { id: "full", name: "全身ほぐし 60分", price: 6600, min: 60 },
    { id: "neck", name: "肩・首集中 40分", price: 4400, min: 40 },
    { id: "post", name: "産後の骨盤ケア 60分", price: 7700, min: 60 },
  ],
};

// ===== ① AIに選ばれる =====
export const AIS = ["ChatGPT", "Gemini", "Claude", "Perplexity"] as const;
export type AiName = (typeof AIS)[number];

// お客様がAIに聞きそうな質問。tags は、その質問で大事になる特徴
export const QUERIES: { q: string; tags: string[] }[] = [
  { q: "みなと台駅の近くでおすすめの整体は？", tags: ["base"] },
  { q: "みなと台で肩こりに強い整体を教えて", tags: ["katakori"] },
  { q: "みなと台駅 整体 夜遅くまで やってる", tags: ["night"] },
  { q: "仕事帰りの20時に行ける整体 みなと台", tags: ["night", "today"] },
  { q: "産後の骨盤ケアができる整体 みなと台", tags: ["sango"] },
  { q: "赤ちゃん連れで行ける整体 みなと台周辺", tags: ["sango", "kids"] },
  { q: "今日空いてる整体 みなと台", tags: ["today"] },
  { q: "当日予約できるマッサージ みなと台駅", tags: ["today"] },
  { q: "デスクワークの腰痛 みなと台 整体", tags: ["katakori", "explain"] },
  { q: "説明が丁寧な整体 みなと台", tags: ["explain"] },
  { q: "みなと台 整体 駐車場あり", tags: ["parking"] },
  { q: "車で行ける整体 みなと台エリア", tags: ["parking"] },
  { q: "女性が通いやすい整体 みなと台", tags: ["women"] },
  { q: "みなと台 整体 口コミがいいところ", tags: ["reviews"] },
  { q: "初めてでも安心な整体 みなと台駅", tags: ["explain", "reviews"] },
  { q: "みなと台 整体 料金が分かりやすい", tags: ["price"] },
];

export const SIGNALS: Record<string, string> = {
  base: "基本の情報", katakori: "肩こり・腰痛", night: "夜の営業", today: "当日の空き", sango: "産後ケア", kids: "子ども連れ",
  explain: "説明の丁寧さ", parking: "駐車場", women: "女性の通いやすさ", reviews: "口コミの中身", price: "料金のわかりやすさ",
};

// 自分の店の「AIに伝わっている強さ」（0〜1）。改善を入れると上がる
export const BASE_STRENGTH: Record<string, number> = { base: 0.45, katakori: 0.7, night: 0.15, today: 0.05, sango: 0.2, kids: 0.1, explain: 0.45, parking: 0, women: 0.6, reviews: 0.3, price: 0.45 };

export const RIVALS = [
  { name: "みなと台整骨院", s: { base: 0.7, katakori: 0.6, night: 0.75, today: 0.3, sango: 0.2, kids: 0.1, explain: 0.4, parking: 0.6, women: 0.3, reviews: 0.7, price: 0.5 } as Record<string, number> },
  { name: "リラクみなと台店", s: { base: 0.6, katakori: 0.5, night: 0.6, today: 0.7, sango: 0.1, kids: 0.1, explain: 0.25, parking: 0.2, women: 0.55, reviews: 0.5, price: 0.75 } as Record<string, number> },
  { name: "からだ工房ミナト", s: { base: 0.5, katakori: 0.55, night: 0.15, today: 0.2, sango: 0.7, kids: 0.6, explain: 0.65, parking: 0.4, women: 0.65, reviews: 0.45, price: 0.4 } as Record<string, number> },
  { name: "整体院ゆるり", s: { base: 0.45, katakori: 0.45, night: 0.3, today: 0.25, sango: 0.3, kids: 0.2, explain: 0.55, parking: 0.1, women: 0.5, reviews: 0.4, price: 0.45 } as Record<string, number> },
  { name: "ボディケアMINATO", s: { base: 0.6, katakori: 0.65, night: 0.55, today: 0.5, sango: 0.15, kids: 0.1, explain: 0.35, parking: 0.5, women: 0.4, reviews: 0.6, price: 0.6 } as Record<string, number> },
  { name: "みなと台カイロ", s: { base: 0.55, katakori: 0.7, night: 0.4, today: 0.35, sango: 0.45, kids: 0.3, explain: 0.6, parking: 0.55, women: 0.45, reviews: 0.55, price: 0.35 } as Record<string, number> },
  { name: "ほねつぎ駅前院", s: { base: 0.65, katakori: 0.55, night: 0.5, today: 0.6, sango: 0.35, kids: 0.25, explain: 0.45, parking: 0.35, women: 0.35, reviews: 0.65, price: 0.55 } as Record<string, number> },
];

// 改善の打ち手。入れると「AIに伝わる強さ」が上がる
export const ACTIONS = [
  { id: "night", title: "「夜21時まで」をGoogleマップとサイトのよくある質問に書く", why: "夜に行ける整体を探す質問で、ほかの店が選ばれています。営業時間はあるのに「仕事帰りに行ける」と書かれていないため、AIに伝わっていません。", up: { night: 0.45, today: 0.05 }, effort: "5分" },
  { id: "today", title: "当日の空き状況を、AI窓口で公開する", why: "「今日空いてる」と聞かれたとき、空きが分かる店が優先されます。②のAI予約窓口を公開すると、AIが空きを直接確かめられます。", up: { today: 0.55, night: 0.05 }, effort: "ボタン1つ" },
  { id: "sango", title: "産後の骨盤ケアのページを作り、よくある質問を3つ足す", why: "産後ケアの質問では「からだ工房ミナト」が選ばれています。メニューはあるのに、説明のページがありません。", up: { sango: 0.4, kids: 0.25 }, effort: "30分（文章はAIが下書き）" },
  { id: "review", title: "口コミのお願い文を「何が良かったか」を書いてもらう形に変える", why: "AIは口コミの中身を読んでいます。「よかった」だけの口コミが多く、「説明が丁寧」「夜でも行ける」など具体的な言葉が足りません。", up: { reviews: 0.3, explain: 0.15, night: 0.05 }, effort: "10分" },
  { id: "parking", title: "近くのコインパーキングの案内を載せる", why: "車で行ける整体の質問で、まったく選ばれていません。駐車場の情報がどこにも無いためです。", up: { parking: 0.45 }, effort: "5分" },
  { id: "schema", title: "お店の情報を、AIが読み取りやすい形（構造化データ）でサイトに入れる", why: "住所・営業時間・メニュー・料金を、AIが確実に読める形にします。すべての質問で少しずつ有利になります。", up: { base: 0.1, price: 0.12, explain: 0.03 }, effort: "コピーして貼るだけ" },
];

// 同じ入力なら必ず同じ数を返す（AIごとのくせを作る）
export function hash(s: string) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return ((h >>> 0) % 1000) / 1000; }

export function strengths(applied: string[]) {
  const s = { ...BASE_STRENGTH };
  for (const a of ACTIONS) if (applied.includes(a.id)) for (const [k, v] of Object.entries(a.up)) s[k] = Math.min(1, (s[k] ?? 0) + v);
  return s;
}
const score = (s: Record<string, number>, tags: string[], ai: string, who: string) =>
  (s.base ?? 0) * 0.6 + tags.reduce((x, t) => x + (s[t] ?? 0), 0) / tags.length * 1.6 + (hash(ai + who + tags.join()) - 0.5) * 0.35;

export type Rank = { q: string; tags: string[]; ai: AiName; top: string[]; mine: number };
export function simulate(applied: string[]) {
  const me = strengths(applied);
  const rows: Rank[] = [];
  for (const { q, tags } of QUERIES) for (const ai of AIS) {
    const list = [{ name: SHOP.name, v: score(me, tags, ai, SHOP.name) }, ...RIVALS.map((r) => ({ name: r.name, v: score(r.s, tags, ai, r.name) }))].sort((a, b) => b.v - a.v);
    const top = list.slice(0, 3).map((x) => x.name);
    rows.push({ q, tags, ai, top, mine: top.indexOf(SHOP.name) + 1 });
  }
  const share = Math.round(rows.filter((r) => r.mine > 0).length / rows.length * 100);
  const byAi = AIS.map((ai) => { const r = rows.filter((x) => x.ai === ai); return { ai, share: Math.round(r.filter((x) => x.mine > 0).length / r.length * 100) }; });
  const rival = RIVALS.map((r) => ({ name: r.name, share: Math.round(rows.filter((x) => x.top.includes(r.name)).length / rows.length * 100) }));
  // 弱い特徴（選ばれていない質問が多いもの）
  const weak = Object.keys(SIGNALS).filter((k) => k !== "base").map((k) => {
    const rs = rows.filter((r) => r.tags.includes(k));
    const miss = rs.filter((r) => r.mine === 0);
    const winners: Record<string, number> = {};
    for (const r of miss) winners[r.top[0]] = (winners[r.top[0]] ?? 0) + 1;
    const win = Object.entries(winners).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "";
    return { k, label: SIGNALS[k], total: rs.length, miss: miss.length, win };
  }).filter((w) => w.total).sort((a, b) => b.miss / b.total - a.miss / a.total);
  return { rows, share, byAi, rival, weak, me };
}

// ===== ② AIが予約できる =====
export const TODAY = "2026-11-18"; // デモの「今日」（水曜日）
export const DAYS = Array.from({ length: 7 }, (_, i) => { const d = new Date(`${TODAY}T00:00:00`); d.setDate(d.getDate() + i); return d.toISOString().slice(0, 10); });
export const HOURS = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
export const WEATHER: Record<string, { w: string; icon: "sun" | "cloud" | "rain" }> = {
  [DAYS[0]]: { w: "晴れ", icon: "sun" }, [DAYS[1]]: { w: "雨", icon: "rain" }, [DAYS[2]]: { w: "くもり", icon: "cloud" }, [DAYS[3]]: { w: "晴れ", icon: "sun" },
  [DAYS[4]]: { w: "晴れ", icon: "sun" }, [DAYS[5]]: { w: "雨", icon: "rain" }, [DAYS[6]]: { w: "くもり", icon: "cloud" },
};
export const dayLabel = (d: string) => new Date(`${d}T00:00:00`).toLocaleDateString("ja-JP", { month: "numeric", day: "numeric", weekday: "short" });

// すでに入っている予約（電話・ホットペッパーなど、これまでの入り口から）
export function baseBooked(d: string, h: number) {
  const wd = new Date(`${d}T00:00:00`).getDay();
  const busy = (wd === 0 || wd === 6 ? 0.75 : 0.45) + (h >= 18 ? 0.25 : h <= 11 ? -0.15 : 0) + (WEATHER[d]?.icon === "rain" ? -0.25 : 0);
  return hash(d + h) < busy;
}

// ===== ③ 空きを自動で埋める =====
// 予測の埋まり具合（0〜100）。曜日・時間・天気・近所の行事から
export function forecast(d: string, h: number) {
  const wd = new Date(`${d}T00:00:00`).getDay();
  let p = 55 + (wd === 0 || wd === 6 ? 25 : 0) + (h >= 18 ? 20 : 0) + (h >= 14 && h <= 16 ? -20 : 0) + (h <= 11 ? -10 : 0);
  if (WEATHER[d]?.icon === "rain") p -= 25;
  if (d === DAYS[3] && h >= 15) p += 10; // 近所の商店街のイベント
  p += Math.round((hash(`${d}-${h}`) - 0.5) * 20);
  return Math.max(5, Math.min(100, p));
}

// ===== ④ 街ぐるみで送り合う =====
export const PARTNERS = [
  { id: "cafe", name: "こもれび珈琲", kind: "カフェ", x: 30, y: 30, match: 92, why: "お客様の年代（30〜40代）が重なり、整体のあとに寄りやすい距離（徒歩2分）です", status: "on", inN: 9, outN: 7 },
  { id: "hair", name: "HAIR nuu", kind: "美容室", x: 70, y: 24, match: 88, why: "長く座るお客様が多く、肩こりの悩みと相性がいい。営業時間も重なりません", status: "on", inN: 6, outN: 8 },
  { id: "yoga", name: "みなと台ヨガ", kind: "ヨガ教室", x: 78, y: 68, match: 85, why: "体を整えたいお客様が多く、紹介し合っても競合しません", status: "on", inN: 4, outN: 5 },
  { id: "bakery", name: "ブーランジェリー麦", kind: "パン屋", x: 22, y: 72, match: 71, why: "朝の来店が多く、昼〜夕方が中心のそよかぜとは時間がずれています", status: "ask", inN: 0, outN: 0 },
  { id: "kids", name: "こどもアトリエ そら", kind: "子ども教室", x: 52, y: 84, match: 79, why: "産後ケアのお客様と、子ども連れのお客様が重なります", status: "suggest", inN: 0, outN: 0 },
  { id: "gym", name: "24h FIT みなと台", kind: "ジム", x: 88, y: 46, match: 74, why: "運動後の体のケアを求めるお客様が多くいます", status: "suggest", inN: 0, outN: 0 },
];
export const ME_POS = { x: 50, y: 50 };
