import { Factory, PenTool, Rocket, Store } from "lucide-react";
import SectionTitle from "./SectionTitle";
import NoOrphan from "./NoOrphan";

// 一気通貫：つくる → 見せる → 売る → 売り続ける
const STEPS = [
  { icon: Factory, en: "Make", t: "小ロットOEM", b: "定番の型（ベースモデル）をもとに、革・色・刻印でオリジナル化。50個から、タイの提携工場で生産します。" },
  { icon: PenTool, en: "Show", t: "売れるLP制作", b: "撮影・構成・執筆までまとめて。製造の裏側を知っているから、こだわりをそのまま言葉にできます。" },
  { icon: Rocket, en: "Sell", t: "クラファン公開", b: "リターン設計から公開後の告知まで伴走。目標達成の確率を高めます。" },
  { icon: Store, en: "Keep selling", t: "自社EC・追加生産", b: "クラファンの素材でShopifyを構築。追加生産も型紙があるのですぐに。" },
];

export default function OneStop() {
  return (
    <section id="onestop" className="bg-paper py-24 md:py-24">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <SectionTitle en="One Stop" ja="つくる・見せる・売る。|ぜんぶ、ひとつの|チームで。" sub="工場・制作会社・EC構築を|別々に探す必要は|ありません。" />
        <ol className="grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(({ icon: I, en, t, b }, i) => (
            <li key={t} className="reveal relative bg-white p-7" style={{ transitionDelay: `${i * 0.1}s` }}>
              <div className="flex items-center justify-between">
                <I size={26} strokeWidth={1.3} className="text-gold" />
                <span className="font-num text-[12px] text-mute">STEP {i + 1}</span>
              </div>
              <p className="mt-6 font-display text-[11px] tracking-[0.3em] text-mute uppercase">{en}</p>
              <h3 className="mt-1.5 text-[18px] font-medium">{t}</h3>
              <p className="mt-3 text-[13.5px] leading-loose text-mute"><NoOrphan text={b} /></p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
