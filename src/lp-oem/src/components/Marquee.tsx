// 流れる帯（強みのキーワード）
const WORDS = ["型代・設計費 0円", "小ロット 30個から", "最短30日で納品", "素押し・金箔・銀箔", "国内検品", "オリジナル化粧箱", "ODMにも対応"];

export default function Marquee() {
  const row = [...WORDS, ...WORDS];
  return (
    <div className="overflow-hidden border-y border-line bg-white py-4" aria-hidden>
      <div className="marquee flex w-max gap-12 whitespace-nowrap">
        {row.map((w, i) => (
          <span key={i} className="flex items-center gap-12 text-[13px] tracking-[0.2em] text-ink/55">
            {w}
            <span className="h-1.5 w-1.5 rotate-45 bg-gold-2" />
          </span>
        ))}
      </div>
    </div>
  );
}
