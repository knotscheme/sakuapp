import { asset } from "@/lib/asset";

// 工房・工場・オフィスの写真を、2列で左右に流し続ける（文字を読まなくても雰囲気が伝わるように）
const ROW1 = ["studio-wall", "work-totes", "studio-pick", "work-pouches", "studio-tag", "ai-shipping", "office-lounge"];
const ROW2 = ["work-parts", "studio-brown", "sewing-poster", "studio-black", "office-sign", "ai-factory"];

function Row({ list, reverse }: { list: string[]; reverse?: boolean }) {
  const all = [...list, ...list]; // 2周分並べて、つなぎ目なく流す
  return (
    <div className="overflow-hidden">
      <ul className={`flex w-max gap-3 ${reverse ? "marquee-rev" : "marquee"}`}>
        {all.map((n, i) => (
          <li key={i} className="h-[150px] w-[220px] shrink-0 overflow-hidden md:h-[230px] md:w-[340px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset(`/images/${n}.webp`)} alt="" loading="lazy" className="h-full w-full object-cover" />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function PhotoStrip() {
  return (
    <section aria-label="工房と工場の写真" className="space-y-3 bg-[#141210] py-10 md:py-14">
      <Row list={ROW1} />
      <Row list={ROW2} reverse />
      <p className="mx-auto max-w-6xl px-6 pt-3 text-[12px] tracking-[0.2em] text-white/50 md:px-8">STUDIO & FACTORY — 日本の工房とタイの提携工場</p>
    </section>
  );
}
