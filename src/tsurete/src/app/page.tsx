"use client";

import Link from "next/link";
import { ArrowRight, Bot, CalendarClock, ChevronRight, Network, Sparkles } from "lucide-react";
import Shell from "@/components/Shell";
import Ready from "@/components/Ready";
import { ACTIONS, PARTNERS, SHOP, simulate } from "@/lib/demo";
import { useStore } from "@/lib/store";

function Home() {
  const s = useStore();
  const sim = simulate(s.applied);
  const refIn = PARTNERS.filter((p) => (s.partners[p.id] ?? p.status) === "on").reduce((a, p) => a + p.inN, 0);
  const sent = Object.values(s.campaigns).filter((v) => v === "sent").length;
  const todo = [
    ...(!s.windowOn ? [{ t: "AI予約窓口を公開する", n: "AIに聞いたお客様が、そのまま予約できるようになります", href: "/yoyaku/" }] : []),
    ...ACTIONS.filter((a) => !s.applied.includes(a.id) && !(a.id === "today" && !s.windowOn)).slice(0, 2).map((a) => ({ t: a.title, n: "AIに選ばれる割合が上がります", href: "/erabareru/" })),
    ...(sent === 0 ? [{ t: "今週の空いている時間に、呼びかけを出す", n: "雨の日と、お昼すぎの空きを狙います", href: "/akiwaku/" }] : []),
  ].slice(0, 3);
  const pillars = [
    { n: "1", href: "/erabareru/", icon: Sparkles, t: "AIに選ばれる", b: "お客様がAIに聞いたとき、おすすめに入っているかを測り、入るための打ち手を出します。", k: `${sim.share}%`, kl: "AI推薦シェア" },
    { n: "2", href: "/yoyaku/", icon: Bot, t: "AIが予約できる", b: "お客様のAIが、空きを確かめて予約まで済ませる「AI予約窓口」を公開します。", k: s.windowOn ? `${s.bookings.length}件` : "非公開", kl: "AIからの予約" },
    { n: "3", href: "/akiwaku/", icon: CalendarClock, t: "空きを自動で埋める", b: "天気・曜日・近所の行事から空きそうな時間を予測し、その時間だけ近所に呼びかけます。", k: `${sent}件`, kl: "出した呼びかけ" },
    { n: "4", href: "/machi/", icon: Network, t: "街ぐるみで送り合う", b: "相性のいい近所のお店とお客様を紹介し合い、QRで記録・自動で精算します。", k: `${refIn}人`, kl: "今月の紹介" },
  ];
  return (
    <>
      <section className="glow relative overflow-hidden rounded-[28px] px-6 py-10 text-white sm:px-10 sm:py-14">
        <p className="text-[0.85rem] tracking-[.2em] text-lime">AI時代の集客</p>
        <h1 className="mt-3 text-[2rem] font-bold leading-[1.35] sm:text-[2.8rem]"><span className="inline-block">AIが、</span><span className="inline-block">お客様をつれてくる。</span></h1>
        <p className="mt-4 max-w-[38em] text-[1rem] leading-[1.95] text-white/75">お客様は、お店を「検索」ではなく<b className="text-white">「AIに聞いて」</b>探しはじめています。TSURETEは、AIに選ばれ、AIに予約され、空いた時間は街ぐるみで埋める。地域のお店のための、新しい集客の仕組みです。</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/erabareru/" className="btn bg-lime px-6 text-ink hover:brightness-95">AI推薦シェアを見る<ArrowRight size={18} /></Link>
          <Link href="/yoyaku/" className="btn bg-white/10 px-5 text-white hover:bg-white/15">AIが予約するところを見る</Link>
        </div>
        <p className="mt-6 text-[0.8rem] text-white/45">デモ：架空の町「みなと台」の整体院「{SHOP.name}」（店長 {SHOP.owner}さん）。数字は模擬の結果です。</p>
      </section>

      {todo.length > 0 && (
        <section className="mt-6" aria-labelledby="td">
          <h2 id="td" className="text-[1.2rem] font-bold">今週やること</h2>
          <ul className="mt-3 space-y-2">
            {todo.map((x, i) => (
              <li key={x.t}><Link href={x.href} className="card flex items-center gap-4 p-4 hover:border-ink">
                <span className="num grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ai text-white">{i + 1}</span>
                <span className="min-w-0 flex-1"><b className="block text-[0.98rem] leading-[1.6]">{x.t}</b><span className="text-[0.85rem] text-sub">{x.n}</span></span><ChevronRight size={20} className="shrink-0 text-sub" />
              </Link></li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-8" aria-labelledby="pl">
        <h2 id="pl" className="text-[1.2rem] font-bold">4つの仕組み</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {pillars.map(({ n, href, icon: Icon, t, b, k, kl }) => (
            <Link key={n} href={href} className="card group flex flex-col p-5 transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-28px_rgba(0,0,0,.4)]">
              <div className="flex items-start justify-between gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-ai-2 text-ai"><Icon size={22} /></span>
                <span className="text-right"><b className="num block text-[1.7rem] leading-none">{k}</b><span className="text-[0.75rem] text-sub">{kl}</span></span>
              </div>
              <p className="num mt-4 text-[0.75rem] font-bold tracking-[.2em] text-ai">0{n}</p>
              <h3 className="text-[1.15rem] font-bold">{t}</h3>
              <p className="mt-1 flex-1 text-[0.9rem] leading-[1.8] text-sub">{b}</p>
              <span className="mt-3 flex items-center gap-1 text-[0.88rem] font-bold text-ai">くわしく見る<ArrowRight size={16} className="transition group-hover:translate-x-1" /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="card mt-8 grid gap-5 p-6 md:grid-cols-2" aria-labelledby="dif">
        <div>
          <h2 id="dif" className="text-[1.2rem] font-bold">これまでの集客との違い</h2>
          <p className="mt-2 text-[0.92rem] leading-[1.9] text-sub">「人に見つけてもらう集客」から、「AIと街がつれてくる集客」へ。</p>
        </div>
        <ul className="space-y-2 text-[0.92rem]">
          {[["検索・マップの順位を上げる", "AIの「おすすめ」に入る"], ["人が見て、人が予約する", "AIが空きを確かめて予約する"], ["毎日同じように投稿する", "空いている時間だけ狙って呼ぶ"], ["1軒で戦う", "近所のお店と組んで送り合う"]].map(([a, b]) => (
            <li key={a} className="grid grid-cols-[1fr_auto_1fr] items-center gap-2"><span className="text-sub line-through decoration-[#c9c7bf]">{a}</span><ArrowRight size={16} className="text-ai" /><b>{b}</b></li>
          ))}
        </ul>
      </section>
      <p className="mt-6 text-[0.8rem] leading-[1.9] text-sub">※AIに必ずおすすめされることは約束できません。TSURETEは、おすすめされる割合を測り、上げるための材料をそろえます。AIによる予約は、対応するAIやしくみが広がりはじめた段階です。</p>
    </>
  );
}

export default function Page() { return <Shell><Ready><Home /></Ready></Shell>; }
