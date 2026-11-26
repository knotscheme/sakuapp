import { asset } from "@/lib/asset";
import SectionTitle from "./SectionTitle";

// 選ばれる理由：写真の上に番号と見出しを重ねたカード（スマホは縦に並べる、PCは3列）
const REASONS = [
  { no: "01", img: "/images/studio-black.webp", title: "累計1億円を売った本人が、伴走する", body: "構成・リターン・告知まで、売った経験で設計。" },
  { no: "02", img: "/images/studio-tag.webp", title: "20年の革づくりを、売れる言葉に", body: "革の産地・鞣し・縫製の根拠を、写真とコピーに。" },
  { no: "03", img: "/images/ai-ecshop.webp", title: "クラファンの後まで、つながる", body: "素材はそのまま自社ECへ。追加生産もすぐに。" },
];

export default function Features() {
  return (
    <section id="reasons" className="bg-paper py-24 md:py-36">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <SectionTitle en="Why us" ja="選ばれる|3つの理由" />
        <ul className="grid gap-4 md:grid-cols-3 md:gap-5">
          {REASONS.map(({ no, img, title, body }) => (
            <li key={no} className="reveal relative aspect-[4/3] overflow-hidden bg-ink md:aspect-[3/4]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset(img)} alt="" loading="lazy" className="h-full w-full object-cover transition duration-700 hover:scale-105" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 p-5 text-white md:p-6">
                <p className="font-num text-[36px] leading-none font-light text-gold md:text-[44px]">{no}</p>
                <h3 className="mt-3 text-[20px] leading-snug font-medium">{title}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-white/80">{body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
