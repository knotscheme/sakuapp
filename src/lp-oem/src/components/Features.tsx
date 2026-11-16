import SectionTitle from "./SectionTitle";
import NoOrphan from "./NoOrphan";

const REASONS = [
  { no: "01", title: "型代・設計費は0円", body: "販売実績のある型を使うため、型代・設計費はかかりません。必要なのはロゴの版代1万円（初回のみ）だけ。数十万円の初期投資なしで、ブランドを始められます。" },
  { no: "02", title: "定番の型 ×|上質なロゴ加工", body: "定番のベースから選び、素押し・金箔・銀箔でロゴを入れます。シンプルな型だからこそ、ロゴが映えます。" },
  { no: "03", title: "最短30日で販売開始", body: "設計・試作の期間をまるごとカット。ロゴデータをいただいてから最短30日でお届けします。" },
];

export default function Features() {
  return (
    <section id="reasons" className="bg-paper py-24 md:py-36">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <SectionTitle en="Why Logo OEM" ja="選ばれる|3つの理由" />
        <div className="grid gap-14 md:grid-cols-3 md:gap-12">
          {REASONS.map(({ no, title, body }, i) => (
            <article key={no} className="reveal border-t border-ink/80 pt-7" style={{ transitionDelay: `${i * 0.12}s` }}>
              <p className="font-display text-sm text-gold">{no}</p>
              <h3 className="mt-4 text-[19px] leading-relaxed font-medium">{title.split("|").map((t) => <span key={t} className="inline-block">{t}</span>)}</h3>
              <p className="mt-4 text-[14px] leading-loose text-mute"><NoOrphan text={body} /></p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
