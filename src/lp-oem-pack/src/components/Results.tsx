import { asset } from "@/lib/asset";
import { RESULTS, man } from "@/lib/packs";
import SectionTitle from "./SectionTitle";

// 実績（実際のプロジェクト）
export default function Results() {
  return (
    <section id="results" className="bg-white py-24 md:py-36">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <SectionTitle en="Results" ja="クラウドファンディング|累計1億円の実績" sub="製品は、ご依頼ごとに|あなただけのものを。|売り方のノウハウで|伴走します。" />
        <ul className="grid gap-10 md:grid-cols-3 md:gap-8">
          {RESULTS.map((r, i) => (
            <li key={r.title} className="reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
              <div className="overflow-hidden bg-paper">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={asset(r.img)} alt={r.title} loading="lazy" className="aspect-[4/3] w-full object-cover" />
              </div>
              <p className="mt-4 text-[11.5px] text-mute tabular-nums">{r.period}</p>
              <h3 className="mt-1 text-[15px] leading-snug font-medium">{r.title}</h3>
              <dl className="mt-3 grid grid-cols-3 border-y border-line py-3 text-center">
                <div><dt className="text-[10.5px] text-mute">{r.label ?? "支援総額"}</dt><dd className="mt-1 font-num text-[17px] font-medium">{man(r.total)}</dd></div>
                <div className="border-x border-line"><dt className="text-[10.5px] text-mute">達成率</dt><dd className="mt-1 font-num text-[17px] font-medium text-gold">{r.rate ? `${r.rate.toLocaleString()}%` : "達成"}</dd></div>
                <div><dt className="text-[10.5px] text-mute">支援者</dt><dd className="mt-1 font-num text-[17px] font-medium">{r.backers ? `${r.backers.toLocaleString()}人` : "—"}</dd></div>
              </dl>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-center text-[11.5px] text-mute">※金額は各プロジェクト終了時点のもの。ほかにも多数のプロジェクトで、累計1億円以上のご支援をいただいています。</p>
      </div>
    </section>
  );
}
