"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import SectionTitle from "./SectionTitle";

// 「作るだけの工場」と「私たち」の違い。ボタンで切り替えて見比べる
const ROWS: [string, string, string][] = [
  ["設計", "既存の型にロゴを入れるだけ（クラファンには出しにくい）", "オリジナル設計・型紙・抜き型まで込み"],
  ["どこまで", "製品を納品して終わり", "クラファンで売れて、自社ECで売れ続けるまで"],
  ["売り方", "自分で考える", "撮影・LP・リターン設計・告知まで一緒に"],
  ["在庫", "最初にまとめて作り、売れ残りのリスク", "50個から。支援が集まった分だけ追加生産"],
  ["お金の流れ", "先に製造費を払い、回収は後から", "支援金で製造費をまかなえる順番"],
  ["やり取り", "工場・制作会社・EC業者がバラバラ", "ひとつのチャットで完結"],
  ["料金", "毎回の見積もりと相見積もり", "パッケージで最初から明確"],
];

export default function Compare() {
  const [us, setUs] = useState(true);
  return (
    <section id="compare" className="bg-white py-24 md:py-24">
      <div className="mx-auto max-w-4xl px-6 md:px-8">
        <SectionTitle en="Difference" ja="“作るだけ”の工場と、|ここが違う。" />
        <div className="reveal mx-auto mb-8 grid max-w-md grid-cols-2 overflow-hidden rounded-full border border-ink p-1 text-[13px]" role="tablist">
          <button type="button" role="tab" aria-selected={!us} onClick={() => setUs(false)} className={`rounded-full py-2.5 transition ${!us ? "bg-[#8a8784] text-white" : "text-mute"}`}>作るだけの工場</button>
          <button type="button" role="tab" aria-selected={us} onClick={() => setUs(true)} className={`rounded-full py-2.5 transition ${us ? "bg-ink text-white" : "text-mute"}`}>私たち</button>
        </div>
        <dl className="reveal divide-y divide-line border-y border-line">
          {ROWS.map(([k, a, b]) => (
            <div key={k} className="grid grid-cols-[5.5em_1fr] items-start gap-4 py-5 sm:grid-cols-[8em_1fr]">
              <dt className="pt-0.5 text-[12.5px] text-mute">{k}</dt>
              <dd className={`flex gap-2.5 text-[15px] leading-relaxed transition-colors duration-500 sm:text-[17px] ${us ? "text-ink" : "text-[#8a8784]"}`}>
                {us ? <Check size={18} className="mt-1 shrink-0 text-gold" /> : <X size={18} className="mt-1 shrink-0" />}
                <span key={String(us)} className="fade-up">{us ? b : a}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
