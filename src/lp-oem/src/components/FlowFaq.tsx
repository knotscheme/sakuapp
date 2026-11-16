"use client";

import { useState } from "react";
import { ChevronDown, FileImage, Factory, ScanEye } from "lucide-react";
import SectionTitle from "./SectionTitle";

const STEPS = [
  { icon: FileImage, title: "モデルとロゴを送る", body: "ご希望のベースモデルを選び、ロゴデータをフォームからお送りください。" },
  { icon: ScanEye, title: "配置イメージとお見積もり", body: "実寸の配置イメージと正式なお見積もりを、最短2営業日でご提出します。" },
  { icon: Factory, title: "生産・検品・納品", body: "ご発注後に生産を開始。国内で1点ずつ検品してからお届けします。" },
];

const FAQ = [
  { q: "最低ロット数は何個からですか？", a: "1モデルあたり30個から承ります。色違いを組み合わせる場合は、1色15個からご相談いただけます。" },
  { q: "ロゴデータはどの形式で送ればいいですか？", a: "Illustrator（.ai）またはPDF・SVGのベクターデータが最適です。お手元に画像（PNG・JPG）しかない場合も、トレースしてデータ化いたします。" },
  { q: "革の色を変えることはできますか？", a: "各モデルとも、ブラック・ダークブラウン・キャメル・ネイビーなど定番色からお選びいただけます。特別色はロット条件によりご相談となります。" },
  { q: "納期はどのくらいですか？", a: "ロゴ配置のご確認後、最短30日で納品いたします。300個以上のご注文や繁忙期は、40〜50日ほどいただく場合があります。" },
];

export default function FlowFaq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <SectionTitle en="Flow" ja="ご注文までの|3ステップ" />
        <ol className="relative grid gap-6 md:grid-cols-3">
          <span className="flow-line absolute top-[42px] right-[16%] left-[16%] hidden h-px bg-gold-2/60 md:block" aria-hidden />
          {STEPS.map(({ icon: Icon, title, body }, i) => (
            <li key={title} className="reveal relative text-center" style={{ transitionDelay: `${0.15 + i * 0.2}s` }}>
              <div className="relative mx-auto flex h-[84px] w-[84px] items-center justify-center rounded-full border border-gold-2/50 bg-white text-gold shadow-[0_10px_30px_-18px_rgba(184,134,11,.6)]">
                <Icon size={30} strokeWidth={1.3} />
                <span className="absolute -top-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-ink font-display text-xs text-gold-2">{i + 1}</span>
              </div>
              <p className="mt-5 font-display text-xs tracking-[0.3em] text-gold">STEP {i + 1}</p>
              <h3 className="mt-2 text-[17px] font-bold">{title}</h3>
              <p className="mx-auto mt-3 max-w-xs text-[14px] leading-loose text-mute">{body}</p>
            </li>
          ))}
        </ol>

        <div className="mt-24">
          <SectionTitle en="FAQ" ja="よくある質問" />
          <div className="mx-auto max-w-3xl divide-y divide-line border-y border-line">
            {FAQ.map((f, i) => {
              const isOpen = open === i;
              return (
                <div key={f.q} className="reveal">
                  <button type="button" className="flex w-full items-center gap-4 py-6 text-left" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : i)}>
                    <span className="font-display text-xl text-gold">Q</span>
                    <span className="flex-1 text-[15.5px] font-bold">{f.q}</span>
                    <ChevronDown size={20} className={`shrink-0 text-mute transition duration-300 ${isOpen ? "rotate-180 text-gold" : ""}`} />
                  </button>
                  <div className={`grid transition-[grid-template-rows] duration-500 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                    <div className="overflow-hidden">
                      <p className="flex gap-4 pb-6 text-[14.5px] leading-loose text-ink-2"><span className="font-display text-xl text-mute">A</span><span>{f.a}</span></p>
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
