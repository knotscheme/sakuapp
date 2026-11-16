"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import SectionTitle from "./SectionTitle";
import NoOrphan from "./NoOrphan";

const STEPS = [
  { title: "モデルと|ロゴを送る", body: "ご希望のベースモデルを選び、ロゴデータをフォームからお送りください。" },
  { title: "配置イメージと|お見積もり", body: "実寸の配置イメージと正式なお見積もりを、最短2営業日でご提出します。" },
  { title: "生産・検品・|納品", body: "ご発注後に生産を開始。国内で1点ずつ検品してからお届けします。" },
];

const FAQ = [
  { q: "最低ロット数は|何個からですか？", a: "1モデルあたり30個から承ります。色違いを組み合わせる場合は、1色15個からご相談いただけます。" },
  { q: "ロゴデータは|どの形式で|送ればいいですか？", a: "Illustrator（.ai）またはPDF・SVGのベクターデータが最適です。画像（PNG・JPG）しかない場合も、トレースしてデータ化いたします。" },
  { q: "ロゴは|どのくらいの大きさで|入れられますか？", a: "縦1〜5cm・横3〜7cmの範囲で承ります。製品やロゴの形に合わせて、見やすい大きさを実寸の配置イメージでご提案します。" },
  { q: "革の色を|変えることは|できますか？", a: "ブラック・ダークブラウン・キャメル・ネイビーなどの定番色からお選びいただけます。特別色はロット条件によりご相談となります。" },
  { q: "型代のほかに|かかる費用は|ありますか？", a: "ロゴを押すための版代が、1デザインにつき1万円（初回のみ）かかります。2回目以降の追加発注では、同じ版を使うためかかりません。型代・設計費は0円です。" },
  { q: "納期は|どのくらいですか？", a: "ロゴ配置のご確認後、最短30日で納品いたします。300個以上のご注文や繁忙期は、40〜50日ほどいただく場合があります。" },
];

export default function FlowFaq() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section id="faq" className="bg-white py-24 md:py-36">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <SectionTitle en="Flow" ja="ご注文までの|3ステップ" />
        <ol className="grid gap-12 md:grid-cols-3 md:gap-12">
          {STEPS.map((s, i) => (
            <li key={s.title} className="reveal" style={{ transitionDelay: `${0.1 + i * 0.15}s` }}>
              <div className="flex items-center gap-4">
                <span className="font-display text-[40px] leading-none text-ink">{i + 1}</span>
                <span className="h-px flex-1 bg-line" />
              </div>
              <h3 className="mt-5 text-[17px] font-medium">{s.title.split("|").map((t) => <span key={t} className="inline-block">{t}</span>)}</h3>
              <p className="mt-3 text-[14px] leading-loose text-mute"><NoOrphan text={s.body} /></p>
            </li>
          ))}
        </ol>

        <div className="mt-32">
          <SectionTitle en="FAQ" ja="よくある質問" />
          <div className="mx-auto max-w-3xl border-t border-line">
            {FAQ.map((f, i) => {
              const isOpen = open === i;
              return (
                <div key={f.q} className="reveal border-b border-line">
                  <button type="button" className="flex w-full items-center gap-6 py-7 text-left" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : i)}>
                    <span className="flex-1 text-[15.5px]">{f.q.split("|").map((t) => <span key={t} className="inline-block">{t}</span>)}</span>
                    <Plus size={18} strokeWidth={1.4} className={`shrink-0 text-mute transition duration-500 ${isOpen ? "rotate-45 text-ink" : ""}`} />
                  </button>
                  <div className={`grid transition-[grid-template-rows] duration-500 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                    <div className="overflow-hidden">
                      <p className="pb-7 text-[14px] leading-loose text-mute"><NoOrphan text={f.a} /></p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
