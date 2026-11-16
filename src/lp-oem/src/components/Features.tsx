import { BadgeJapaneseYen, Stamp, Timer } from "lucide-react";
import SectionTitle from "./SectionTitle";

const REASONS = [
  { no: "01", icon: BadgeJapaneseYen, title: "型代・設計費は0円", body: "すでに販売実績のある型を使うため、型代・設計費は0円。通常のOEMで必要な数十万円の初期投資なしで、自社ブランドを始められます。" },
  { no: "02", icon: Stamp, title: "定番の型 × 上質なロゴ加工", body: "4種類の定番ベースから選び、素押し・金箔押し・銀箔押しでロゴを入れます。シンプルな型だからこそ、ロゴが映える仕上がりに。" },
  { no: "03", icon: Timer, title: "最短30日で販売開始", body: "設計・試作の期間をまるごとカット。ロゴデータをいただいてから最短30日で、販売を始められる状態でお届けします。" },
];

export default function Features() {
  return (
    <section id="reasons" className="bg-[#f4f1ea] py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <SectionTitle en="Why Logo OEM" ja="選ばれる|3つの理由" />
        <div className="grid gap-6 md:grid-cols-3">
          {REASONS.map(({ no, icon: Icon, title, body }, i) => (
            <article key={no} className="reveal relative overflow-hidden rounded-2xl border border-line bg-white p-8 shadow-[0_20px_50px_-36px_rgba(0,0,0,.4)]" style={{ transitionDelay: `${i * 0.12}s` }}>
              <span className="absolute -top-3 right-4 font-display text-[88px] leading-none text-gold-3/60">{no}</span>
              <p className="font-display text-sm tracking-[0.3em] text-gold">REASON {no}</p>
              <Icon className="mt-5 text-gold" size={34} strokeWidth={1.3} />
              <h3 className="mt-5 text-lg leading-relaxed font-bold">{title}</h3>
              <p className="mt-4 text-[14.5px] leading-loose text-mute">{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
