import Speak from "./Speak";

// 画面のいちばん上に出す「この画面ですること」
export default function Help({ title, children, say }: { title: string; children: React.ReactNode; say: string }) {
  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h1 className="text-[1.6rem] font-bold leading-[1.45]">{title}</h1>
        <Speak text={`${title}。${say}`} />
      </div>
      <div className="mt-3 rounded-2xl border-2 border-[#c9dfd3] bg-ok-2 px-5 py-4 text-[1rem] leading-[1.9]">{children}</div>
    </div>
  );
}
