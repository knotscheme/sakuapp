// 物語からご案内へ切り替わる区切り
export default function ActBreak() {
  return (
    <div className="reveal bg-white px-6 pt-28 pb-8 text-center md:pt-36">
      <span className="mx-auto block h-16 w-px bg-line" />
      <p className="mt-8 font-display text-[12px] tracking-[0.5em] text-mute">FOR YOUR BRAND</p>
      <p className="mt-4 text-[18px] tracking-[0.12em] text-ink md:text-[22px]">
        <span className="inline-block">ここからは、</span><span className="inline-block">はじめ方のご案内です。</span>
      </p>
    </div>
  );
}
