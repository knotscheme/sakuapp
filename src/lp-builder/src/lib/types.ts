// LPの「型（テンプレート）」の決まり
// 型ごとに「必要な画像の枠（スロット）」「文章の項目」「色」と、HTMLを作る関数を持つ

export type Slot = {
  id: string;
  label: string; // 画面に出す名前（例：メイン画像）
  ratio: [number, number]; // 縦横比（例：[16, 9]）
  min: number; // これより横幅が小さいと「小さめです」と知らせる（px）
  max: number; // 書き出すときの最大の横幅（px）
  prompt: string; // 画像生成AIに渡す指示（{brand}{product} は基本情報に置き換え）
  tips: string; // 自分で撮るときのコツ
  where: string; // LPのどこに使うか
  optional?: boolean; // 無くてもよい（無ければ、その画像は出さない）
};

export type Field = {
  id: string;
  label: string;
  group: string; // 入力画面での見出し
  multiline?: boolean;
  url?: boolean; // リンク先のURL
  max?: number; // 目安の文字数
  hint?: string; // AIに伝える、この項目の役割
  optional?: boolean; // 空なら書き出しで省く
};

export type ColorDef = { id: string; label: string; value: string };

export type Ctx = {
  /** 文章の項目を、編集できる要素として出す */
  f: (id: string, tag?: string, cls?: string) => string;
  /** 画像の枠 */
  img: (slot: string, cls?: string) => string;
  /** ボタン（文字とURLの2項目） */
  link: (label: string, url: string, cls?: string) => string;
  /** 空なら省く（書き出しのとき） */
  when: (ids: string[], html: string) => string;
  /** 項目の値（エスケープ済み・改行なし） */
  v: (id: string) => string;
  /** 画像が入っているか */
  has: (slot: string) => boolean;
};

export type Template = {
  id: string;
  name: string; // SORAE など
  kind: string; // 化粧品・コスメ など
  desc: string;
  best: string; // 向いている商品
  fonts: string; // Google Fonts のURL
  colors: ColorDef[];
  fields: Field[];
  slots: Slot[];
  css: string; // .lpb から始まるセレクタだけで書く（ほかのサイトに貼っても崩さないため）
  js?: string; // 動き（root にこの型の .lpb 要素が入る）。無くても文章と写真は表示される
  render: (c: Ctx) => string;
};

export type BasicInfo = {
  brand: string;
  product: string;
  target: string;
  strengths: string;
  tone: string;
  price: string;
  url: string;
};

export type ImgMeta = {
  name: string;
  w: number; // 元の画像の大きさ
  h: number;
  fx: number; // 切り抜きの中心（0〜1）
  fy: number;
  zoom: number; // 1 = 枠いっぱい
  source: "upload" | "ai" | "sample";
  outW: number; // 書き出す大きさ
};

export type Project = {
  v: 1;
  tpl: string;
  info: BasicInfo;
  fields: Record<string, string>;
  colors: Record<string, string>;
  imgs: Record<string, ImgMeta>;
  updated: number;
};

export const EMPTY_INFO: BasicInfo = { brand: "", product: "", target: "", strengths: "", tone: "", price: "", url: "" };
