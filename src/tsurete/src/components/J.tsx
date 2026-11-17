import { Fragment } from "react";
import { Parser } from "budoux/dist/parser.js";
import { model } from "budoux/dist/data/models/ja.js";

// 日本語の文章を、文節の切れ目でだけ改行する（「ます。」だけが次の行に落ちるのを防ぐ）
const parser = new Parser(model);
export default function J({ children }: { children: string }) {
  const parts = parser.parse(children);
  return <span className="jp">{parts.map((p, i) => <Fragment key={i}>{i > 0 && <wbr />}{p}</Fragment>)}</span>;
}
