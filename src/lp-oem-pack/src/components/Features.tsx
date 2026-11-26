import { asset } from "@/lib/asset";
import SectionTitle from "./SectionTitle";
import NoOrphan from "./NoOrphan";

// 選ばれる理由：写真を大きく、文字は短く（左右交互）
const REASONS = [
  { no: "01", img: "/images/studio-black.webp", title: "累計1億円を売った本人が、|伴走する", body: "革製品のクラファンで累計1億円。構成・リターン・告知まで、売った経験で設計します。" },
  { no: "02", img: "/images/studio-tag.webp", title: "20年の革づくりを、|そのまま売れる言葉に", body: "革の産地、鞣し、縫製、刻印。つくり手にしか語れない根拠を、写真とコピーにします。" },
  { no: "03", img: "/images/work-pouches.webp", title: "クラファンの後まで、|自然につながる", body: "写真と文章をそのまま自社ECへ。型紙と抜き型があるので、追加生産もすぐに。" },
];

export default function Features() {
  return (
    <section id="reasons" className="bg-paper py-24 md:py-36">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <SectionTitle en="Why us" ja="選ばれる|3つの理由" />
        <div className="space-y-16 md:space-y-24">
          {REASONS.map(({ no, img, title, body }, i) => (
            <article key={no} className={`grid items-center gap-6 md:grid-cols-2 md:gap-14 ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}>
              <div className={`${i % 2 ? "reveal-r" : "reveal-l"} relative overflow-hidden`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset(img)} alt="" loading="lazy" className="aspect-[4/3] w-full object-cover" />
                <span className="absolute top-0 left-0 bg-ink px-3 py-2 font-num text-[15px] text-gold">{no}</span>
              </div>
              <div className="reveal">
                <h3 className="text-[22px] leading-snug font-medium md:text-[28px]">{title.split("|").map((t) => <span key={t} className="inline-block">{t}</span>)}</h3>
                <p className="mt-4 text-[14.5px] leading-loose text-mute"><NoOrphan text={body} /></p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
