import { asset } from "@/lib/asset";
import NoOrphan from "./NoOrphan";

// つくり手の言葉（写真は工房・オフィス。代表の名前と文はあとで差し替え）
export default function Maker() {
  return (
    <section id="maker" className="bg-paper py-24 md:py-36">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 md:px-8 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <div className="reveal-l grid grid-cols-2 gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset("/images/studio-black.webp")} alt="色見本を前に、黒い革の上で仕様を説明する手" loading="lazy" className="col-span-2 aspect-[16/10] w-full object-cover" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset("/images/work-parts.webp")} alt="縫製前の黒い革のパーツ" loading="lazy" className="aspect-square w-full object-cover" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset("/images/office-lounge.webp")} alt="工房のオフィス" loading="lazy" className="aspect-square w-full object-cover" />
        </div>
        <div className="reveal-r">
          <p className="font-display text-[12px] tracking-[0.4em] text-mute uppercase">Message</p>
          <h2 className="mt-4 text-[26px] leading-snug font-medium md:text-[34px]"><span className="inline-block">つくった人が、</span><span className="inline-block">売るところまで。</span></h2>
          <div className="mt-6 space-y-4 text-[14.5px] leading-loose text-ink/85">
            <p><NoOrphan text="革製品をつくり続けて20年。クラウドファンディングでは、累計1億円のご支援をいただいてきました。" /></p>
            <p><NoOrphan text="その中で分かったのは、良いものをつくるだけでは届かないということ。どんな革で、どう縫い、なぜこの形なのか。つくり手にしか語れない言葉が、いちばん人を動かします。" /></p>
            <p><NoOrphan text="だから私たちは、製造と売り方を分けません。あなたのブランドが売れるまで、同じチームで伴走します。" /></p>
          </div>
          <p className="mt-8 text-[13px] text-mute">代表　○○ ○○<span className="ml-2 text-[11px]">（お名前は差し替え）</span></p>
        </div>
      </div>
    </section>
  );
}
