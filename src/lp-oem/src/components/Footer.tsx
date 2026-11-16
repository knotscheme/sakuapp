import NoOrphan from "./NoOrphan";
export default function Footer() {
  return (
    <footer className="border-t border-line bg-white py-12 text-center text-mute">
      <p className="font-display text-xl tracking-[0.3em] text-ink">CRAFT <span className="text-gold">OEM</span></p>
      <p className="mt-3 text-xs tracking-wider">革財布・革小物のロゴ入れOEM</p>
      <p className="mx-auto mt-6 max-w-md px-5 text-[11px] leading-relaxed text-mute/80">
        <NoOrphan text="※本ページはポートフォリオ用の制作サンプルです。サービス名・価格・条件などはすべて架空のものです。" />
      </p>
      <a href="/sakuapp/works/lp-oem/cms/" className="mt-5 inline-block text-[11px] tracking-[0.2em] text-mute underline underline-offset-4 hover:text-ink">管理画面のデモを見る</a>
      <p className="mt-4 font-display text-[11px] tracking-widest text-mute/60">© CRAFT OEM (SAMPLE)</p>
    </footer>
  );
}
