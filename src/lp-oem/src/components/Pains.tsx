import { Coins, FileQuestion, FlaskConical, ArrowDown } from "lucide-react";
import SectionTitle from "./SectionTitle";

const PAINS = [
  { icon: Coins, text: "型紙から作ると、型代やサンプル代だけで数十万円かかる" },
  { icon: FileQuestion, text: "仕様書の作り方が分からず、何から始めればいいか迷う" },
  { icon: FlaskConical, text: "まずは小ロットで、テスト販売から始めたい" },
];

export default function Pains() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-5 md:px-8">
        <SectionTitle en="Problems" ja="こんな壁に、|ぶつかって|いませんか？" />
        <ul className="grid gap-5 md:grid-cols-3">
          {PAINS.map(({ icon: Icon, text }, i) => (
            <li key={i} className="reveal rounded-2xl border border-line bg-paper p-7 shadow-[0_10px_30px_-20px_rgba(0,0,0,.25)]" style={{ transitionDelay: `${i * 0.1}s` }}>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-gold ring-1 ring-gold-2/40">
                <Icon size={22} strokeWidth={1.6} />
              </div>
              <p className="mt-5 text-[15px] leading-loose text-ink-2">{text}</p>
            </li>
          ))}
        </ul>
        <div className="reveal mt-14 text-center">
          <ArrowDown className="mx-auto text-gold" size={28} strokeWidth={1.4} />
          <p className="mt-4 text-xl font-bold tracking-wide md:text-2xl">
            <span className="inline-block"><span className="gold-text">「ロゴ入れOEM」</span>なら、</span><span className="inline-block">すべて解決できます。</span>
          </p>
        </div>
      </div>
    </section>
  );
}
