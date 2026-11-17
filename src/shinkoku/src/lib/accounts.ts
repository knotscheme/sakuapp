// 勘定科目。画面にはむずかしい名前ではなく「わかる言葉」で出す
export type Kind = "asset" | "liability" | "equity" | "income" | "expense";
export type Account = { id: string; name: string; plain: string; kind: Kind; tax: "taxable" | "none" };

export const ACCOUNTS: Account[] = [
  // お金の置き場所
  { id: "cash", name: "現金", plain: "手もとの現金", kind: "asset", tax: "none" },
  { id: "bank", name: "普通預金", plain: "銀行の口座", kind: "asset", tax: "none" },
  { id: "receivable", name: "売掛金", plain: "まだ入金されていない売上", kind: "asset", tax: "none" },
  { id: "equipment", name: "工具器具備品", plain: "パソコンなど長く使う物", kind: "asset", tax: "none" },
  { id: "card", name: "未払金", plain: "カードで払った分（後で引き落とし）", kind: "liability", tax: "none" },
  { id: "ownerOut", name: "事業主貸", plain: "仕事以外に使ったお金（生活費など）", kind: "equity", tax: "none" },
  { id: "ownerIn", name: "事業主借", plain: "生活費の口座から仕事に入れたお金", kind: "equity", tax: "none" },
  { id: "capital", name: "元入金", plain: "年のはじめの元手", kind: "equity", tax: "none" },
  // 入ってくるお金
  { id: "sales", name: "売上高", plain: "仕事の売上", kind: "income", tax: "taxable" },
  { id: "misc_income", name: "雑収入", plain: "そのほかの仕事の収入", kind: "income", tax: "taxable" },
  // 経費
  { id: "travel", name: "旅費交通費", plain: "交通費（電車・バス・タクシー）", kind: "expense", tax: "taxable" },
  { id: "comm", name: "通信費", plain: "スマホ・ネット・切手", kind: "expense", tax: "taxable" },
  { id: "supplies", name: "消耗品費", plain: "文房具・小物（10万円未満）", kind: "expense", tax: "taxable" },
  { id: "meeting", name: "会議費", plain: "打ち合わせのお茶・食事", kind: "expense", tax: "taxable" },
  { id: "entertain", name: "接待交際費", plain: "お客様との会食・贈り物", kind: "expense", tax: "taxable" },
  { id: "rent", name: "地代家賃", plain: "家賃・事務所代", kind: "expense", tax: "none" },
  { id: "utility", name: "水道光熱費", plain: "電気・ガス・水道", kind: "expense", tax: "taxable" },
  { id: "books", name: "新聞図書費", plain: "本・新聞・資料", kind: "expense", tax: "taxable" },
  { id: "fee", name: "支払手数料", plain: "振込手数料・サービスの手数料", kind: "expense", tax: "taxable" },
  { id: "ads", name: "広告宣伝費", plain: "広告・チラシ・名刺", kind: "expense", tax: "taxable" },
  { id: "outsource", name: "外注工賃", plain: "ほかの人に頼んだ仕事の代金", kind: "expense", tax: "taxable" },
  { id: "software", name: "通信費", plain: "ソフト・アプリの利用料", kind: "expense", tax: "taxable" },
  { id: "depreciation", name: "減価償却費", plain: "長く使う物の、今年の分の費用", kind: "expense", tax: "none" },
  { id: "taxes", name: "租税公課", plain: "仕事の税金・印紙", kind: "expense", tax: "none" },
  { id: "misc", name: "雑費", plain: "そのほかの経費", kind: "expense", tax: "taxable" },
];

export const acc = (id: string) => ACCOUNTS.find((a) => a.id === id) ?? ACCOUNTS[ACCOUNTS.length - 1];
export const EXPENSES = ACCOUNTS.filter((a) => a.kind === "expense" && a.id !== "depreciation");

// 「生活費だけど申告で使う」お金（事業主貸のメモ）。確定申告の控除に使う
export type PersonalTag = "" | "pension" | "health" | "ideco" | "life" | "furusato" | "medical" | "living";
export const PERSONAL: { id: PersonalTag; label: string; hint: string }[] = [
  { id: "living", label: "生活費", hint: "申告には使いません" },
  { id: "pension", label: "国民年金", hint: "社会保険料控除になります" },
  { id: "health", label: "国民健康保険", hint: "社会保険料控除になります" },
  { id: "ideco", label: "iDeCo・小規模企業共済", hint: "全額が控除になります" },
  { id: "life", label: "生命保険料", hint: "生命保険料控除になります" },
  { id: "furusato", label: "ふるさと納税", hint: "寄附金控除になります" },
  { id: "medical", label: "医療費", hint: "医療費控除になるかもしれません" },
];
