import { ArrowRight, Calculator, ShieldCheck, Package, Ruler } from "lucide-react";
import HeroStage from "./HeroStage";

const BADGES = [
  { icon: Ruler, top: "型代・設計費", main: "0円" },
  { icon: Package, top: "小ロット", main: "30個〜" },
  { icon: ShieldCheck, top: "国内検品", main: "クオリティ" },
];

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-paper pt-28 pb-20 text-ink md:pt-36 md:pb-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_60%_at_78%_45%,rgba(197,160,89,.16),transparent_70%),linear-gradient(180deg,#fff,#f6f3ec)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[.5] [background-image:linear-gradient(rgba(26,26,26,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(26,26,26,.04)_1px,transparent_1px)] [background-size:64px_64px]" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 md:px-8 lg:grid-cols-[1fr_1fr]">
        <div className="fade-up">
          <p className="font-display text-[12px] tracking-[0.22em] text-gold sm:text-sm sm:tracking-[0.4em]">LOGO OEM FOR LEATHER GOODS</p>
          <h1 className="mt-5 text-[32px] leading-[1.45] font-bold tracking-wide sm:text-[40px] md:text-[54px] md:leading-[1.4]">
            <span className="line-mask"><span>あなたのロゴで、</span></span>
            <span className="line-mask"><span style={{ animationDelay: ".12s" }}><span className="gold-text shine">上質な革財布</span>を。</span></span>
          </h1>
          <p className="mt-5 text-[15px] font-bold tracking-wide text-gold md:text-lg"><span className="inline-block">型代0円・30個から・</span><span className="inline-block">最短30日で納品</span></p>
          <p className="mt-5 max-w-xl text-[14.5px] leading-loose text-mute md:text-[15px]">
            売れている定番の型に、ブランドロゴを刻印・箔押しするだけ。設計いらずで、自分の財布ブランドを始められます。
          </p>

          <ul className="mt-8 grid max-w-lg grid-cols-3 gap-3">
            {BADGES.map(({ icon: Icon, top, main }) => (
              <li key={top} className="rounded-xl border border-line bg-white px-2 py-4 text-center shadow-[0_10px_24px_-18px_rgba(0,0,0,.3)]">
                <Icon className="mx-auto text-gold" size={20} strokeWidth={1.6} />
                <p className="mt-2 text-[11px] tracking-wide text-mute md:text-xs">{top}</p>
                <p className="mt-0.5 text-[15px] font-bold text-ink md:text-lg">{main}</p>
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href="#models" className="group inline-flex items-center justify-center gap-2 rounded-full bg-ink px-7 py-4 text-[15px] font-bold tracking-wide text-white transition hover:bg-gold">
              ベースモデルを見る
              <ArrowRight size={18} className="transition group-hover:translate-x-1" />
            </a>
            <a href="#simulator" className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/25 bg-white px-7 py-4 text-[15px] font-bold tracking-wide text-ink transition hover:border-gold hover:text-gold">
              <Calculator size={18} />
              利益をシミュレーションする
            </a>
          </div>
        </div>

        <div className="fade-up [animation-delay:.3s]">
          <HeroStage />
        </div>
      </div>
    </section>
  );
}
