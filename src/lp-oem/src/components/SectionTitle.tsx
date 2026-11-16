import Phrase from "./Phrase";

export default function SectionTitle({ en, ja, sub, dark = false }: { en: string; ja: string; sub?: string; dark?: boolean }) {
  return (
    <div className="reveal mx-auto mb-12 max-w-2xl text-center md:mb-16">
      <p className="font-display text-sm tracking-[0.35em] text-gold uppercase">{en}</p>
      <h2 className={`mt-3 text-[26px] leading-snug font-bold tracking-wide md:text-4xl md:leading-snug ${dark ? "text-white" : "text-ink"}`}><Phrase text={ja} /></h2>
      <div className="grow-line mx-auto mt-5 h-px bg-gold-2" />
      {sub && <p className={`mt-5 text-[15px] leading-loose ${dark ? "text-white/65" : "text-mute"}`}><Phrase text={sub} /></p>}
    </div>
  );
}
