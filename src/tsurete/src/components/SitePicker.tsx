"use client";

import { useState } from "react";
import { Check, ChevronDown, Store, X } from "lucide-react";
import { METHOD, PLATFORMS, platformOf, type Method } from "@/lib/platforms";
import { update, useStore } from "@/lib/store";

// お店のサイトを選ぶ。選んだサイトに合わせて、書き直しの届け方が変わる
export function SiteGrid({ onPick }: { onPick?: () => void }) {
  const s = useStore();
  return (
    <div className="space-y-6">
      {(["api", "csv", "copy"] as Method[]).map((m) => (
        <div key={m}>
          <p className="text-[0.78rem] font-bold text-sub">{METHOD[m]}</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {PLATFORMS.filter((p) => p.method === m).map((p) => (
              <button key={p.id} type="button" aria-pressed={s.site === p.id} onClick={() => { update((x) => ({ ...x, site: p.id })); onPick?.(); }}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-[0.92rem] font-bold transition ${s.site === p.id ? "bg-ai/15 text-ai ring-1 ring-ai" : "bg-white/[.04] hover:bg-white/[.07]"}`}>
                <span className="min-w-0 flex-1">{p.name}</span>{s.site === p.id && <Check size={17} />}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function SitePicker() {
  const s = useStore();
  const [open, setOpen] = useState(false);
  const p = platformOf(s.site);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={`flex items-center gap-2 rounded-full px-4 py-2 text-[0.86rem] font-bold ${p ? "bg-white/[.05]" : "bg-ai text-[#03140f]"}`}>
        <Store size={16} />{p ? <>お店のサイト：{p.name}</> : "お店のサイトを選ぶ"}<ChevronDown size={15} />
      </button>
      {open && (
        <div className="fixed inset-0 z-[90] grid place-items-end bg-black/60 sm:place-items-center sm:p-4" role="dialog" aria-modal="true" aria-label="お店のサイトを選ぶ" onClick={() => setOpen(false)}>
          <div className="fade-in max-h-[88vh] w-full overflow-y-auto rounded-t-[28px] bg-panel p-6 sm:max-w-[34rem] sm:rounded-[28px] sm:p-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-4"><div><p className="text-[1.15rem] font-bold">お店のサイトはどれですか？</p><p className="mt-1 text-[0.84rem] leading-[1.8] text-sub">選んだサイトに合わせて、書き直しの届け方が変わります。</p></div><button type="button" onClick={() => setOpen(false)} aria-label="とじる" className="p-1 text-sub"><X size={20} /></button></div>
            <div className="mt-6"><SiteGrid onPick={() => setOpen(false)} /></div>
          </div>
        </div>
      )}
    </>
  );
}
