import SectionTitle from "./SectionTitle";
import NoOrphan from "./NoOrphan";

// 選ばれる理由：実績・製造を知っている・クラファン後までつながる
const REASONS = [
  { no: "01", title: "累計1億円を売った本人が、|伴走する", body: "革製品のクラウドファンディングで累計1億円を売り上げてきた経験をもとに、構成・リターン・告知まで設計します。「作れる業者」ではなく「売ったことがあるパートナー」です。" },
  { no: "02", title: "20年の革づくりを、|そのまま売れる言葉に", body: "創業20年。革の選び方、鞣し、縫製、刻印。タイの工場と直接やり取りしているから、エイジングや収納の工夫を、根拠のあるコピーと写真で伝えられます。" },
  { no: "03", title: "クラファンの後まで、|自然につながる", body: "支援者以外からの「買いたい」に応えるShopifyの自社ECを、クラファンの写真・文章を活かして短期間で。追加生産も型紙があるのですぐに対応します。" },
];

export default function Features() {
  return (
    <section id="reasons" className="bg-paper py-24 md:py-36">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <SectionTitle en="Why us" ja="選ばれる|3つの理由" />
        <div className="grid gap-14 md:grid-cols-3 md:gap-12">
          {REASONS.map(({ no, title, body }, i) => (
            <article key={no} className="reveal border-t border-ink/80 pt-7" style={{ transitionDelay: `${i * 0.12}s` }}>
              <p className="font-num text-sm font-medium tracking-[0.1em] text-gold">{no}</p>
              <h3 className="mt-4 text-[19px] leading-relaxed font-medium">{title.split("|").map((t) => <span key={t} className="inline-block">{t}</span>)}</h3>
              <p className="mt-4 text-[14px] leading-loose text-mute"><NoOrphan text={body} /></p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
