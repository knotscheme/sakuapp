import { ArrowRight, Camera, Check, MessageCircle, PenLine, Rocket, Sparkles } from "lucide-react";

// 「全部おまかせ」「一からオリジナル」で作りたい人への案内。サクアプの無料相談フォーム（LINEで送る）へ
export const ORDER_URL = `/sakuapp/contact/?from=lpb&svc=${encodeURIComponent("LP制作のおまかせ")}`;

const POINTS = [
  { icon: PenLine, t: "構成と文章", b: "売りたいもの・届けたい人を聞きとり、伝わる順番と言葉を作ります" },
  { icon: Camera, t: "写真・画像", b: "撮影のしかたのご案内や、AIでの画像づくりまでお手伝いします" },
  { icon: Sparkles, t: "オリジナルのデザイン", b: "型にない、ブランドだけの見た目と動きを一から作ります" },
  { icon: Rocket, t: "公開まで", b: "サーバー・WordPress・Shopify への公開や、計測の設定まで" },
];

export default function OrderCta({ variant = "band", from = "" }: { variant?: "band" | "card"; from?: string }) {
  const href = from ? `${ORDER_URL}&ref=${from}` : ORDER_URL;
  if (variant === "card") {
    return (
      <aside className="rounded-2xl bg-ink p-5 text-white">
        <p className="text-[11px] tracking-[.2em] text-accent">ORDER MADE</p>
        <h2 className="mt-2 text-[16px] font-bold leading-[1.6]">全部おまかせしたい・<br />一からオリジナルで作りたい方へ</h2>
        <p className="mt-2 text-[12.5px] leading-[1.9] text-white/70">文章・写真・デザイン・公開まで、まるごと制作します。</p>
        <a href={href} className="btn mt-4 w-full bg-white py-3 text-[13.5px] text-ink hover:bg-white/90"><MessageCircle size={15} />無料で相談する</a>
      </aside>
    );
  }
  return (
    <section className="relative overflow-hidden rounded-[28px] bg-ink px-5 py-10 text-white sm:px-10 sm:py-14">
      <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent/25 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-white/[.06] blur-3xl" />
      <div className="relative grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:items-center">
        <div>
          <p className="text-[12px] tracking-[.22em] text-accent">ORDER MADE</p>
          <h2 className="mt-3 text-[23px] font-bold leading-[1.5] sm:text-[30px]"><span className="inline-block">全部おまかせしたい。</span><br /><span className="inline-block">一からオリジナルで</span><span className="inline-block">作りたい。</span></h2>
          <p className="mt-4 text-[14px] leading-[2] text-white/75">そんな方は、制作をまるごとご依頼ください。型を使わない完全オリジナルのLPも、作品例と同じ作りこみで一から作ります。</p>
          <ul className="mt-5 space-y-1.5 text-[13px] text-white/80">
            {["相談・お見積もりは無料", "LINEで気軽にやりとり", "LP BUILDER で作ったLPの手直しもOK"].map((x) => <li key={x} className="flex items-center gap-2"><Check size={14} className="text-accent" />{x}</li>)}
          </ul>
          <a href={href} className="btn btn-accent mt-7 px-7 py-3.5 text-[15px]"><MessageCircle size={17} />無料で相談する<ArrowRight size={16} /></a>
        </div>
        <ul className="grid grid-cols-2 gap-2.5 sm:gap-3">
          {POINTS.map(({ icon: Icon, t, b }) => (
            <li key={t} className="rounded-2xl bg-white/[.06] p-4 ring-1 ring-white/10 sm:p-5">
              <Icon size={20} className="text-accent" />
              <h3 className="mt-3 text-[15px] font-bold">{t}</h3>
              <p className="mt-1.5 text-[12.5px] leading-[1.85] text-white/70">{b}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
