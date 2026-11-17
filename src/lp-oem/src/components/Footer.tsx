import NoOrphan from "./NoOrphan";
export default function Footer() {
  return (
    <footer className="border-t border-line bg-white py-12 text-center text-mute">
      <p className="font-display text-xl tracking-[0.3em] text-ink">CRAFT <span className="text-gold">OEM</span></p>
      <p className="mt-3 text-xs tracking-wider">革財布・革小物のロゴ入れOEM</p>
      <p className="mx-auto mt-6 max-w-md px-5 text-[11px] leading-relaxed text-mute/80">
        <NoOrphan text="※デモ版です。" />
      </p>
      <p className="mt-4 font-display text-[11px] tracking-widest text-mute/60">© CRAFT OEM (SAMPLE)</p>
    </footer>
  );
}
