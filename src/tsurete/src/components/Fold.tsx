import { ChevronDown } from "lucide-react";

// 折りたたみ：補足やくわしい情報は、押したときだけ見せる（画面をすっきりさせる）
export default function Fold({ title, sub, children, open = false }: { title: string; sub?: string; children: React.ReactNode; open?: boolean }) {
  return (
    <details open={open} className="group border-t hair">
      <summary className="flex cursor-pointer list-none items-center gap-3 py-5 [&::-webkit-details-marker]:hidden">
        <span className="min-w-0 flex-1"><b className="block text-[0.98rem]">{title}</b>{sub && <span className="mt-0.5 block text-[0.8rem] text-sub">{sub}</span>}</span>
        <ChevronDown size={18} className="shrink-0 text-sub transition group-open:rotate-180" />
      </summary>
      <div className="pb-8">{children}</div>
    </details>
  );
}
