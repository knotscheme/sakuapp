import { asset } from "@/lib/asset";

// 黒い帯に、画面いっぱいの大きな数字（ページにリズムをつける）
export default function Band({ big, unit, label, img }: { big: string; unit?: string; label: string; img?: string }) {
  return (
    <section className="relative overflow-hidden bg-[#141210] py-20 text-white md:py-20">
      {img && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset(img)} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-35" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#141210] via-[#141210]/70 to-transparent" />
        </>
      )}
      <div className="reveal relative mx-auto max-w-6xl px-6 md:px-8">
        <p className="font-num text-[96px] leading-[0.9] font-medium tracking-tight sm:text-[120px] lg:text-[140px]">{big}<span className="ml-2 text-[0.3em] text-gold">{unit}</span></p>
        <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-white/80 sm:text-[17px]">{label}</p>
      </div>
    </section>
  );
}
