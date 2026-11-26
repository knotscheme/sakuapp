import SectionTitle from "./SectionTitle";

// 「つくった後」に困る人に向けた悩み
const PAINS = [
  { t: "つくっても、|どう売ればいいか|分からない", b: "工場は作るところまで。売り方・見せ方は自分で考えるしかない。" },
  { t: "相見積もりで|一番安い工場を探すのに|疲れた", b: "価格だけで選ぶと、品質ややり取りで結局コストがかかる。" },
  { t: "LP・撮影・EC構築を|別々に頼むと|高くて遅い", b: "制作会社とOEM工場の間で、話がうまく伝わらない。" },
];

export default function Pains() {
  return (
    <section id="problems" className="bg-white py-24 md:py-24">
      <div className="mx-auto max-w-4xl px-6 md:px-8">
        <SectionTitle en="Problems" ja="いちばんの壁は、|“売り方”では|ありませんか？" />
        <ol className="border-t border-line">
          {PAINS.map((p, i) => (
            <li key={i} className="reveal flex items-baseline gap-6 border-b border-line py-7 md:gap-10" style={{ transitionDelay: `${i * 0.1}s` }}>
              <span className="font-num text-sm font-medium text-gold">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <p className="text-[16px] leading-relaxed text-ink md:text-[18px]">{p.t.split("|").map((x) => <span key={x} className="inline-block">{x}</span>)}</p>
                <p className="mt-2 text-[13px] leading-relaxed text-mute">{p.b}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="reveal mt-16 text-center text-[18px] leading-relaxed tracking-wide text-ink md:text-[22px]">
          <span className="inline-block">つくる・見せる・売るを、</span><span className="inline-block">ひとつの窓口で。</span>
        </p>
      </div>
    </section>
  );
}
