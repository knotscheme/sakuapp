// クラファン×OEMパッケージの内容（金額・実績はすべて例。デモ版）
export type PlanId = "light" | "standard" | "premium" | "oem";
export type Plan = { id: PlanId; name: string; en: string; price: number | null; priceNote?: string; lead: string; items: string[]; best?: boolean; qty?: number };

export const PLANS: Plan[] = [
  {
    id: "light", name: "ライト", en: "Light", price: 450000, qty: 50,
    lead: "まずは小さく、売れる設計でテストしたい方に。",
    items: ["サンプル製作 1回", "本生産 50個（標準の革・定番の型）", "ロゴの刻印（版代込み）", "クラファンLPの構成案・コピー執筆", "LPデザインはテンプレートで制作"],
  },
  {
    id: "standard", name: "スタンダード", en: "Standard", price: 650000, qty: 50, best: true,
    lead: "撮影からLPまで丸ごと任せて、クラファンを成功させたい方に。",
    items: ["ライトの内容すべて", "商品撮影（物撮り・イメージカット）", "クラファンLPのデザイン制作", "リターン（支援コース）の設計", "プロジェクト申請のサポート"],
  },
  {
    id: "premium", name: "プレミアム", en: "Premium", price: 950000, qty: 50,
    lead: "型のアレンジや動画まで、ブランドとして作り込みたい方に。",
    items: ["スタンダードの内容すべて", "型のアレンジ（内装・ステッチ・パーツ）", "紹介動画の制作（30〜60秒）", "革のアップグレード（イタリアン・国産から）", "公開後1か月の伴走（活動報告・SNS告知）"],
  },
];

// 「OEMのみ」：今までどおり、製品をつくるだけ（単価×数量・数量割引）
export const OEM_ONLY = { id: "oem" as const, name: "OEMのみ", lead: "LPや販売はご自身で。製品づくりだけのご依頼も承ります。", priceNote: "1個 1,800円〜（ベースモデルの参考単価）" };

export const PLAN_OPTIONS = [
  { name: "追加生産（リピート）", price: "100個 80万円〜", body: "型紙と仕様が決まっているので、打ち合わせなしですぐ生産。クラファンの追加ロットにも。" },
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
  { k: "つくり方", v: "実績のある型をベースに、革・色・ステッチ・刻印・内装でオリジナル化（ODM）。サンプルが1回で決まりやすい作り方です。" },
];

// 実績（サンプル表示）
export const RESULTS = [
  { img: "/images/model-trifold.webp", title: "コンパクト三つ折りミニ財布", total: 4860000, rate: 972, backers: 1240, tag: "国産レザー・本ヌメ" },
  { img: "/images/model-long.webp", title: "ラウンドファスナー長財布", total: 10200000, rate: 1360, backers: 1610, tag: "イタリアンレザー" },
  { img: "/images/model-fragment.webp", title: "スリムフラグメントケース", total: 3120000, rate: 624, backers: 1480, tag: "シュリンクレザー" },
];
export const HERO_STATS = [
  { v: "累計1億円", k: "クラファン支援額" },
  { v: "創業20年", k: "革製品づくり" },
  { v: "50個〜", k: "小ロットから" },
];

// 流れと期間の目安
export const FLOW = [
  { t: "無料相談・プラン決定", d: "1〜3日", b: "チャットで、作りたいものと予算をうかがい、プランを決めます。" },
  { t: "ご契約・お支払い（50%）", d: "即日", b: "入金を確認したら、すぐに型・革・ロゴの仕様を固めます。" },
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
