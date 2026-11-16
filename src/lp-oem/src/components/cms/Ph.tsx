"use client";

import { Children, Fragment, useSyncExternalStore } from "react";

// 日本語の見出しや短い文で「ご注|文」のような単語の途中の改行を防ぐ
// ブラウザの単語の区切り（Intl.Segmenter）で文節に分け、文節の切れ目でだけ改行させる
// 「・」「/」で並べた短い項目（例：三つ折りミニ財布・50個・素押し）は、項目ごとにまとめる
const JA = /[぀-ヿ一-鿿]/;
const HIRA = /^[぀-ゟー]+$/;
const CLOSE = /^[、。」』）)・：:／/！？!?…ー〜]+$/;
const OPEN = /[「『（(]$/;
const NUM = /[0-9０-９,，.]$/;

let seg: Intl.Segmenter | null = null;
function chunks(text: string): string[] {
  if (!JA.test(text)) return [text];
  // 短い項目の並び
  for (const sep of ["・", " / ", "/"]) {
    const items = text.split(sep);
    if (items.length > 1 && items.every((x) => x.length > 0 && x.length <= 14)) return items.map((x, i) => (i < items.length - 1 ? x + sep : x));
  }
  if (typeof Intl === "undefined" || !("Segmenter" in Intl)) return [text];
  seg ??= new Intl.Segmenter("ja", { granularity: "word" });
  const out: string[] = [];
  let glue = false; // 次の単語を前につなげる（「ご注文」の「ご」、「お客様」の「お」、カッコの直後）
  for (const { segment: s } of seg.segment(text)) {
    const prev = out[out.length - 1];
    if (glue && prev !== undefined) { out[out.length - 1] = prev + s; glue = /^[ごお御]$/.test(s) || OPEN.test(s); continue; }
    glue = /^[ごお御]$/.test(s) || OPEN.test(s);
    // 1文字の漢字（「集計|用」の「用」など）は前の漢字につなげる
    const join = prev !== undefined && ((s.length === 1 && /[\u4e00-\u9fff]/.test(s) && /[\u4e00-\u9fff]$/.test(prev)) || HIRA.test(s) || CLOSE.test(s) || OPEN.test(prev) || (NUM.test(prev) && /^[0-9０-９,，.%円個件日月年万枚か]/.test(s)) || /^\s+$/.test(s));
    if (join) out[out.length - 1] = prev + s;
    else out.push(s);
  }
  return out;
}

// tail：最後の文節が短いとき、前の文節とつなげて1行に残す文字数の目安
const noop = () => () => {};
export function Ph({ children, tail = 0 }: { children: string; tail?: number }) {
  // 区切り方はブラウザごとに少し違うため、表示した後（ブラウザ側）でだけ区切る
  const ready = useSyncExternalStore(noop, () => true, () => false);
  if (!ready) return <>{children}</>;
  const list = chunks(children);
  while (tail && list.length > 1 && list[list.length - 1].length < tail) list.splice(-2, 2, list[list.length - 2] + list[list.length - 1]);
  if (list.length === 1) return <>{children}</>;
  return (
    <>
      {list.map((p, i) => (
        <Fragment key={i}>
          <span className="whitespace-nowrap">{p}</span>
          <wbr />
        </Fragment>
      ))}
    </>
  );
}

// 文字列と要素がまざった中身（<b>など）にも使う
export function PhNodes({ children, tail = 4 }: { children: React.ReactNode; tail?: number }) {
  return <>{Children.map(children, (c) => (typeof c === "string" ? <Ph tail={tail}>{c}</Ph> : c))}</>;
}
