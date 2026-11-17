/* eslint-disable @next/next/no-img-element */
import { shotUrl } from "@/lib/shots";

// パソコンとスマホで見たときの画像を、並べて見せる
export default function ShotPair({ id, title, size = "lg" }: { id: string; title: string; size?: "lg" | "sm" }) {
  const lg = size === "lg";
  return (
    <div className={`relative ${lg ? "pb-[6%] pr-[13%]" : "pb-[5%] pr-[12%]"}`}>
      <figure className="overflow-hidden rounded-xl bg-white shadow-[0_24px_60px_-28px_rgba(0,0,0,.45)] ring-1 ring-black/5">
        <div className="flex h-6 items-center gap-1 border-b border-line bg-[#fafaf8] px-2.5">{[0, 1, 2].map((d) => <span key={d} className="h-1.5 w-1.5 rounded-full bg-line" />)}</div>
        <img src={shotUrl(id, "pc")} alt={`${title}をパソコンで見たところ`} width={1280} height={800} loading="lazy" className="aspect-[16/10] w-full object-cover object-top" />
        <figcaption className="sr-only">パソコン</figcaption>
      </figure>
      <figure className={`absolute bottom-0 right-0 overflow-hidden bg-white shadow-[0_24px_50px_-20px_rgba(0,0,0,.5)] ring-[5px] ring-ink ${lg ? "w-[25%] rounded-[22px]" : "w-[24%] rounded-[16px] ring-4"}`}>
        <img src={shotUrl(id, "sp")} alt={`${title}をスマホで見たところ`} width={390} height={844} loading="lazy" className="aspect-[390/844] w-full object-cover object-top" />
        <figcaption className="sr-only">スマホ</figcaption>
      </figure>
    </div>
  );
}
