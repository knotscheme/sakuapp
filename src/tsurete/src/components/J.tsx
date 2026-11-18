import { Fragment } from "react";
import { Parser } from "budoux/dist/parser.js";
import { model } from "budoux/dist/data/models/ja.js";

// 日本語の文章を、文節の切れ目でだけ改行する（「ます。」だけが次の行に落ちるのを防ぐ）
// iPhoneのSafariは文節での改行に対応していないため、ここで区切りを入れる
const parser = new Parser(model);
const OPEN = /[「『（(【〈《“]+$/;
export function phrases(text: string) {
  const parts = parser.parse(text);
  // 開きかっこが行の終わりに残らないよう、次の文節にくっつける
  for (let i = 0; i < parts.length - 1; i++) {
    const m = parts[i].match(OPEN);
    if (m) { parts[i] = parts[i].slice(0, -m[0].length); parts[i + 1] = m[0] + parts[i + 1]; }
  }
  // かぎかっこの中が短いとき（12文字まで）は、かっこごと1かたまりにする
  const out: string[] = [];
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    if (!p) continue;
    if (p.includes("「") && !p.includes("」")) {
      let j = i, acc = p;
      while (j + 1 < parts.length && !acc.includes("」") && acc.length < 16) acc += parts[++j];
      if (acc.includes("」") && acc.length <= 16) { out.push(acc); i = j; continue; }
    }
    out.push(p);
  }
  return out;
}
// iPhoneのSafariは、かっこの直後や句読点の前でも改行してしまうことがある。
// 5文字までの短い文節は丸ごと改行させない。それより長い文節は、かっこと次の文字・前の文字と句読点だけを離さない
// （長い文節まで丸ごと改行させないと、細い枠の中ではみ出すため）
const GLUE = /([「『（(【〈《“][^「『（(【〈《“]|[^、。」』）)】〉》”！？][、。」』）)】〉》”！？]+)/g;
function Chunk({ text }: { text: string }) {
  if (text.length <= 5) return <span className="whitespace-nowrap">{text}</span>;
  const bits = text.split(GLUE);
  return <>{bits.map((b, i) => (i % 2 ? <span key={i} className="whitespace-nowrap">{b}</span> : b))}</>;
}
export default function J({ children }: { children: string }) {
  const parts = phrases(children);
  return <span className="jp">{parts.map((p, i) => <Fragment key={i}>{i > 0 && <wbr />}<Chunk text={p} /></Fragment>)}</span>;
}
