"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, CheckCircle2, ChevronDown, XCircle } from "lucide-react";
import Speak from "./Speak";

// 「どの明細を入れればいい？」の案内（明細を取りこむ画面の上に出す）
const IN = [
  { t: "仕事の売上が入る口座", n: "お客様からの振込が入る銀行口座の明細" },
  { t: "仕事の支払いに使うカード", n: "仕事の物やサービスを払ったクレジットカードの明細" },
  { t: "現金で払った仕事のレシート", n: "文房具・交通費・打ち合わせのお茶など" },
  { t: "年金・保険を払っている口座", n: "国民年金・国民健康保険・iDeCo・生命保険・ふるさと納税・医療費は、税金が安くなる「控除」に使います" },
];
const OUT = [
  { t: "仕事にまったく使っていない口座やカード", n: "家族だけで使う口座などは、入れなくて大丈夫です" },
  { t: "カードで払った物のレシート", n: "カードの明細から入るので、レシートも入れると二重になります" },
  { t: "去年や来年の分", n: "1月1日〜12月31日の分だけを入れます" },
];
const NOTE = [
  "同じ明細ファイルを2回入れても、二重にはなりません（自動で見分けます）。",
  "カードの引き落としや、自分の口座どうしの移動は、「仕事と関係ないお金」などをえらびます。",
  "読みこめるのは「CSV」という形のファイルです。PDFや写真の明細は読みこめません。",
  "明細は、この端末の中だけに保存されます。どこにも送られません。",
];

export default function ImportGuide() {
  const say = `どの明細を入れればいいか。入れるもの。${IN.map((x) => `${x.t}。${x.n}。`).join("")}入れなくていいもの。${OUT.map((x) => `${x.t}。${x.n}。`).join("")}${NOTE.join("")}`;
  // 開いているかどうかを覚えておく（毎月来る人が、毎回長い案内を見なくてすむように）
  const [open, setOpen] = useState(true);
  useEffect(() => { try { setOpen(localStorage.getItem("jbs-ig-closed") !== "1"); } catch {} }, []);
  const toggle = () => { const v = !open; setOpen(v); try { localStorage.setItem("jbs-ig-closed", v ? "0" : "1"); } catch {} };
  return (
    <section className="card mb-6 p-5 sm:p-6" aria-labelledby="ig">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="ig" className="text-[1.3rem] font-bold">どの明細を入れればいい？</h2>
        <div className="flex flex-wrap gap-2">
          {open && <Speak text={say} />}
          <button type="button" onClick={toggle} aria-expanded={open} className="inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-white px-3.5 py-1.5 text-[0.85rem] font-bold">{open ? "たたむ" : "ひらく"}<ChevronDown size={18} className={`transition ${open ? "rotate-180" : ""}`} /></button>
        </div>
      </div>
      {open && <>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border-2 border-[#c9dfd3] bg-ok-2 p-4">
          <h3 className="flex items-center gap-2 text-[1.12rem] font-bold text-ok"><CheckCircle2 size={24} />入れるもの</h3>
          <ul className="mt-2 space-y-2.5">{IN.map((x) => <li key={x.t}><b className="block text-[1.02rem]">{x.t}</b><span className="text-[0.92rem] leading-[1.75] text-sub">{x.n}</span></li>)}</ul>
        </div>
        <div className="rounded-2xl border-2 border-line bg-paper p-4">
          <h3 className="flex items-center gap-2 text-[1.12rem] font-bold text-sub"><XCircle size={24} />入れなくていいもの</h3>
          <ul className="mt-2 space-y-2.5">{OUT.map((x) => <li key={x.t}><b className="block text-[1.02rem]">{x.t}</b><span className="text-[0.92rem] leading-[1.75] text-sub">{x.n}</span></li>)}</ul>
        </div>
      </div>
      <div className="mt-4 rounded-2xl border-2 border-warn bg-warn-2 p-4">
        <h3 className="flex items-center gap-2 text-[1.05rem] font-bold text-warn"><AlertTriangle size={22} />気をつけること</h3>
        <ul className="mt-2 list-disc space-y-1 pl-6 text-[0.98rem] leading-[1.8]">{NOTE.map((x) => <li key={x}>{x}</li>)}</ul>
      </div>
      <details className="group mt-4 rounded-2xl border-2 border-line p-4">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-[1.05rem] font-bold [&::-webkit-details-marker]:hidden">明細ファイル（CSV）の保存のしかた<ChevronDown size={22} className="shrink-0 transition group-open:rotate-180" /></summary>
        <div className="mt-3 grid gap-4 md:grid-cols-2">
          <div>
            <b className="text-[1.02rem]">銀行の場合</b>
            <ol className="mt-1 list-decimal space-y-1 pl-6 text-[0.98rem] leading-[1.8]">
              <li>ネットバンキングにログイン</li>
              <li>「入出金明細」または「取引明細」を開く</li>
              <li>期間を「1月1日〜」にする</li>
              <li>「CSVダウンロード」（ファイル保存）を押す</li>
            </ol>
          </div>
          <div>
            <b className="text-[1.02rem]">クレジットカードの場合</b>
            <ol className="mt-1 list-decimal space-y-1 pl-6 text-[0.98rem] leading-[1.8]">
              <li>カード会社の会員サイトにログイン</li>
              <li>「ご利用明細」を開く</li>
              <li>月をえらぶ（1か月ずつのことが多いです）</li>
              <li>「CSVダウンロード」を押す</li>
            </ol>
          </div>
        </div>
        <p className="mt-3 text-[0.9rem] text-sub">※ボタンの名前は、銀行やカード会社によって少しちがいます。見つからないときは、各社の「よくある質問」で「CSV」と調べてください。</p>
      </details>
      </>}
    </section>
  );
}
