import SectionTitle from "./SectionTitle";

const PAINS = [
  "型紙から作ると、|型代やサンプル代だけで|数十万円かかる",
  "仕様書の作り方が分からず、|何から始めればいいか|迷う",
  "まずは小ロットで、|テスト販売から|始めたい",
];

export default function Pains() {
  return (
    <section id="problems" className="bg-white py-24 md:py-36">
      <div className="mx-auto max-w-4xl px-6 md:px-8">
        <SectionTitle en="Problems" ja="こんな壁に、|ぶつかって|いませんか？" />
        <ol className="border-t border-line">
          {PAINS.map((t, i) => (
            <li key={i} className="reveal flex items-baseline gap-6 border-b border-line py-7 md:gap-10" style={{ transitionDelay: `${i * 0.1}s` }}>
              <span className="font-num text-sm font-medium text-gold">{String(i + 1).padStart(2, "0")}</span>
              <p className="text-[16px] leading-relaxed text-ink md:text-[18px]">{t.split("|").map((x) => <span key={x} className="inline-block">{x}</span>)}</p>
            </li>
          ))}
        </ol>
        <p className="reveal mt-16 text-center text-[18px] tracking-wide text-ink md:text-[22px]">
          <span className="inline-block">「ロゴ入れOEM」なら、</span><span className="inline-block">すべて解決できます。</span>
        </p>
      </div>
    </section>
  );
}
