// ===== 革の名前の英語・タイ語（工場向け） =====
// 追加したときに、よく使う言葉の辞書から自動で入れる（辞書にない言葉は空のまま→日本語で出す）。※本番では翻訳APIで自動翻訳
const DICT: [string, string, string][] = [
  ["イタリアンレザー", "Italian leather", "หนังอิตาลี"], ["国産レザー", "Japanese leather", "หนังญี่ปุ่น"], ["オリジナルレザー", "Original leather", "หนังออริจินัล"],
  ["シュリンクレザー", "Shrink leather", "หนังชริงค์"], ["コードバン", "Cordovan", "หนังคอร์โดแวน"], ["ゴートレザー", "Goat leather", "หนังแพะ"], ["ゴート", "Goat", "หนังแพะ"],
  ["牛革", "Cowhide", "หนังวัว"], ["本ヌメ", "natural veg-tan", "หนังฟอกฝาดธรรมชาติ"], ["ヌメ革", "Veg-tanned leather", "หนังฟอกฝาด"], ["ヌメ", "veg-tan", "ฟอกฝาด"],
  ["混合鞣し", "combination tanned", "ฟอกผสม"], ["タンニン鞣し", "vegetable tanned", "ฟอกฝาด"], ["クロム鞣し", "chrome tanned", "ฟอกโครม"],
  ["型押し", "embossed", "ปั๊มลาย"], ["スムース", "smooth", "เรียบ"], ["ヴィンテージ", "vintage", "วินเทจ"], ["ジーンズ", "jeans", "ยีนส์"],
  ["ブライドル", "Bridle", "บริดเดิล"], ["オイル", "oiled", "ออยล์"], ["スエード", "Suede", "หนังกลับ"], ["エナメル", "Patent", "หนังแก้ว"],
  ["マヤ", "Maya", "มายา"], ["ミッスーリ", "Missouri", "มิสซูรี"], ["アラスカ", "Alaska", "อลาสก้า"], ["たつの", "Tatsuno", "ทัตสึโนะ"], ["栃木", "Tochigi", "โทจิงิ"],
  ["ヴァイカウント", "Viscount", "ไวเคานต์"], ["ハイブリッド", "Hybrid", "ไฮบริด"], ["レザー", "leather", "หนัง"],
];
export function autoLeatherTr(name: string): { en?: string; th?: string } {
  let en = name, th = name;
  for (const [ja, e, t] of DICT) { en = en.split(ja).join(` ${e} `); th = th.split(ja).join(` ${t} `); }
  const tidy = (x: string) => x.replace(/（/g, " (").replace(/）/g, ")").replace(/\s+/g, " ").replace(/\( /g, "(").replace(/ \)/g, ")").trim();
  // 日本語が残ったら、訳せなかったとみなして空にする
  const ok = (x: string) => !/[\u3040-\u30ff\u4e00-\u9faf]/.test(x);
  en = tidy(en); th = tidy(th);
  return { en: ok(en) ? en.charAt(0).toUpperCase() + en.slice(1) : undefined, th: ok(th) ? th : undefined };
}
