import Link from "next/link";
import { ArrowRight, Eye, Monitor, Smartphone } from "lucide-react";
import Header from "@/components/Header";
import ShotPair from "@/components/ShotPair";
import { SAMPLES } from "@/lib/samples";
import { getTemplate } from "@/lib/templates";

// 作品例の一覧：パソコンとスマホで見た画像を並べ、そこからプレビュー（実際に操作できる画面）へ
export default function Works() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 sm:py-12">
        <h1 className="text-[24px] font-bold sm:text-[30px]">作品例</h1>
        <p className="mt-2 max-w-[44em] text-[14px] leading-[1.9] text-mute">LP BUILDER の型で作ったLPです。写真と文章を入れかえるだけで、同じ作りこみのLPができます（商品・会社・施設は架空のものです）。</p>
        <div className="mt-10 space-y-16 sm:space-y-20">
          {SAMPLES.map((s, i) => {
            const t = getTemplate(s.tpl);
            return (
              <article key={s.id} className={`grid items-center gap-8 lg:gap-14 ${i % 2 ? "lg:grid-cols-[1fr_1.35fr]" : "lg:grid-cols-[1.35fr_1fr]"}`}>
                <Link href={`/works/view/?id=${s.id}`} className={`group block transition duration-500 hover:-translate-y-1 ${i % 2 ? "lg:order-2" : ""}`} aria-label={`${s.title}のプレビューを見る`}>
                  <ShotPair id={s.id} title={s.title} />
                </Link>
                <div>
                  <p className="text-[12px] font-medium tracking-wider text-accent">0{i + 1}　型：{t.name}｜{t.kind}</p>
                  <h2 className="mt-2 text-[21px] font-bold leading-[1.5] sm:text-[24px]">{s.title}</h2>
                  <p className="mt-3 text-[14px] leading-[1.95] text-ink/80">{s.lead}</p>
                  <ul className="mt-4 flex flex-wrap gap-2 text-[12px] text-mute">
                    <li className="flex items-center gap-1 rounded-full bg-white px-3 py-1 ring-1 ring-line"><Monitor size={12} />パソコン</li>
                    <li className="flex items-center gap-1 rounded-full bg-white px-3 py-1 ring-1 ring-line"><Smartphone size={12} />スマホ</li>
                    <li className="rounded-full bg-white px-3 py-1 ring-1 ring-line">写真 {t.slots.filter((x) => !x.optional).length}枚〜</li>
                  </ul>
                  <div className="mt-6 flex flex-wrap gap-2">
                    <Link href={`/works/view/?id=${s.id}`} className="btn btn-ink px-6 py-3 text-[14px]"><Eye size={16} />プレビューを見る</Link>
                    <Link href={`/build/?tpl=${t.id}`} className="btn btn-line px-5 py-3 text-[14px]">この型で作る<ArrowRight size={15} /></Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </main>
    </>
  );
}
