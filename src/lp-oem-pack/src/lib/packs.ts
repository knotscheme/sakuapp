// クラファン×OEMパッケージの内容（金額・実績はすべて例。デモ版）
export type PlanId = "light" | "standard" | "premium" | "oem";
export type Plan = { id: PlanId; name: string; en: string; price: number | null; priceNote?: string; lead: string; items: string[]; best?: boolean; qty?: number };

export const PLANS: Plan[] = [
  {
    id: "light", name: "ライト", en: "Light", price: 450000, qty: 50,
    lead: "まずは小さく、売れる設計でテストしたい方に。",
    items: ["オリジナル設計（デザイン・仕様書）", "型紙・抜き型の製作", "サンプル製作 1回", "本生産 50個（標準の革）・ロゴの刻印（版代込み）", "クラファンLPの構成案・コピー執筆（デザインはテンプレート）"],
  },
  {
    id: "standard", name: "スタンダード", en: "Standard", price: 650000, qty: 50, best: true,
    lead: "撮影からLPまで丸ごと任せて、クラファンを成功させたい方に。",
    items: ["ライトの内容すべて", "商品撮影（物撮り・イメージカット）", "クラファンLPのデザイン制作", "リターン（支援コース）の設計", "プロジェクト申請のサポート"],
  },
  {
    id: "premium", name: "プレミアム", en: "Premium", price: 950000, qty: 50,
    lead: "デザインの作り込みや動画まで、ブランドとして仕上げたい方に。",
    items: ["スタンダードの内容すべて", "デザインの作り込み（サンプル修正2回まで無料）", "紹介動画の制作（30〜60秒）", "革のアップグレード（イタリアン・国産から）", "公開後1か月の伴走（活動報告・SNS告知）"],
  },
];

// 「OEMのみ」：今までどおり、製品をつくるだけ（単価×数量・数量割引）
// ※既存の型の製品は、多くのクラファンで掲載できないため、クラファン以外（自社販売・ギフト・ノベルティ）向け
export const OEM_ONLY = { id: "oem" as const, name: "OEMのみ（クラファン以外）", lead: "自社販売・ギフト・ノベルティ向け。定番の型にロゴを入れて、製品づくりだけを承ります。", priceNote: "1個 1,800円〜（ベースモデルの参考単価）" };

export const PLAN_OPTIONS = [
  { name: "追加生産（リピート）", price: "100個 80万円〜", body: "一度つくった型紙・抜き型はあなた専用。そのまま使えるので、打ち合わせなしですぐ生産できます。" },
  { name: "Shopify 自社ECの構築", price: "30万円〜", body: "クラファンの写真・文章をそのまま使って、一般販売のストアを短期間で公開。" },
  { name: "成果報酬（レベニューシェア）", price: "支援額の○%", body: "初期費用をおさえて、売れた分だけお支払い。条件はご相談ください。" },
  { name: "追加の修正", price: "1回 3万円", body: "無料の回数（サンプル1回・LP2回）を超える修正のご依頼に。" },
];

// 安心のルール（料金と進め方を最初に決めておく）
export const RULES = [
  { k: "料金", v: "すべてパッケージ料金。個別のお見積もりを何度も往復しません。" },
  { k: "お支払い", v: "ご契約時に50%、サンプル承認時に50%。入金を確認してから工場へ発注します。" },
  { k: "サンプルの修正", v: "1回まで無料。2回目からは1回3万円。" },
  { k: "LPの修正", v: "テキスト・デザインとも2回まで無料。" },
  { k: "やり取り", v: "チャット中心で完結。打ち合わせの日程調整で止まりません。" },
  { k: "つくり方", v: "クラファンは、まだ世に出ていない製品が前提。すべてオリジナル設計で、型紙・抜き型から起こします（パッケージに込み）。" },
  { k: "型紙・抜き型", v: "あなた専用として保管し、ほかのお客様には使いません。追加生産や一般販売でそのまま使えます。" },
];

// 実績（実際のプロジェクト。画像はプロジェクトページから）
export type Result = { img: string; title: string; total: number; rate?: number; backers?: number; period: string; label?: string };
export const RESULTS: Result[] = [
  { img: "/images/cf-wallet-small.webp", title: "必要な機能をギュッと閉じ込めた『小さい財布』の至高。第2弾 最終改良版", total: 9210200, label: "購入総額", period: "2020.08.05 〜 2020.10.20" },
  { img: "/images/cf-tote-mini.webp", title: "このサイズ感が良い。小さいトートバッグ", total: 5499401, rate: 2749, backers: 230, period: "2025.01.01 〜 2025.03.16" },
  { img: "/images/cf-wallet-nobu.webp", title: "「縫わない美学」変化を楽しむ大人の財布", total: 2686459, rate: 1343, backers: 270, period: "2026.06.13 〜 2026.08.25" },
];
export const HERO_STATS = [
  { v: "累計1億円", k: "クラファン支援額" },
  { v: "創業20年", k: "革製品づくり" },
  { v: "50個〜", k: "小ロットから" },
];

// 流れと期間の目安
export const FLOW = [
  { t: "無料相談・プラン決定", d: "1〜3日", b: "チャットで、作りたいものと予算をうかがい、プランを決めます。" },
  { t: "ご契約・お支払い（50%）", d: "即日", b: "入金を確認したら、デザイン・革・ロゴの仕様を固めます。" },
  { t: "設計・型紙・抜き型", d: "約2週間", b: "デザインを図面にし、型紙と裁断用の抜き型をつくります。図面はチャットで確認します。" },
  { t: "サンプル製作", d: "約3週間", b: "タイの提携工場でサンプルを製作。届いたら実物で確認します。" },
  { t: "撮影・LP制作", d: "約2週間", b: "サンプルを撮影し、売れる構成でLPを制作。修正は2回まで無料。" },
  { t: "クラファン公開", d: "30〜60日", b: "公開後も、活動報告や告知の文面をサポート（プレミアム）。" },
  { t: "本生産・検品・発送", d: "約30〜45日", b: "国内で1点ずつ検品し、支援者さまへお届けします。" },
  { t: "一般販売（Shopify）", d: "約2週間", b: "クラファンの素材を使って自社ECを公開。追加生産も型紙ですぐ。" },
];

export const yen = (n: number) => `${n.toLocaleString("ja-JP")}円`;
export const man = (n: number) => `${(n / 10000).toLocaleString("ja-JP", { maximumFractionDigits: 1 })}万円`;

// 相談フォームでプランを選んだ状態にする（料金プランの「このプランで相談」から）
export const PLAN_EVENT = "craftpack-choose-plan";
export const PLAN_CHOICES: { id: PlanId | "undecided"; name: string }[] = [...PLANS.map((p) => ({ id: p.id, name: p.name })), { id: "oem", name: "OEMのみ" }, { id: "undecided", name: "相談して決めたい" }];
