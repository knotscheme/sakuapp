import Phrase from "./Phrase";

// 見出し：小さな英字ラベル＋日本語。装飾は最小限に
export default function SectionTitle({ en, ja, sub, align = "center" }: { en: string; ja: string; sub?: string; dark?: boolean; align?: "center" | "left" }) {
  const c = align === "center" ? "mx-auto text-center" : "";
  return (
    <div className={`reveal mb-12 max-w-2xl md:mb-14 ${c}`}>
      <p className="font-display text-[12px] tracking-[0.4em] text-mute uppercase">{en}</p>
      <h2 className="mt-4 text-[26px] leading-snug font-medium tracking-[0.06em] text-ink md:text-[30px] md:leading-snug"><Phrase text={ja} /></h2>
      {sub && <p className="mt-5 text-[14.5px] leading-loose text-mute"><Phrase text={sub} /></p>}
    </div>
  );
}
