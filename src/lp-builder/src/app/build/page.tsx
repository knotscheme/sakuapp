"use client";

import { Suspense, useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import { initProject, useProject } from "@/lib/project";
import { getTemplate } from "@/lib/templates";
import StepTemplate from "./StepTemplate";
import StepInfo from "./StepInfo";
import StepImages from "./StepImages";
import StepFinish from "./StepFinish";
import StepDownload from "./StepDownload";

const STEPS = ["型をえらぶ", "基本情報と文章", "写真を入れる", "プレビューで仕上げ", "ダウンロード"];

function Builder() {
  const { ready, p, saving } = useProject();
  const [step, setStep] = useState(1);
  const [tplQ, setTplQ] = useState<string | null>(null);
  useEffect(() => {
    initProject();
    const q = new URLSearchParams(location.search);
    const s = Number(q.get("step"));
    if (s >= 1 && s <= 5) setStep(s);
    setTplQ(q.get("tpl"));
  }, []);
  // 作りかけが無いときは、型えらびから
  const cur = p ? step : 1;
  const go = (n: number) => {
    setStep(n);
    history.replaceState(null, "", n === 1 ? location.pathname : `?step=${n}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const t = p ? getTemplate(p.tpl) : null;
  const done = (n: number) => !!p && (n === 1 || (n === 2 && !!p.info.product) || (n === 3 && t!.slots.every((s) => p.imgs[s.id])));

  return (
    <>
      <Header />
      <div className="sticky top-14 z-30 border-b border-line bg-paper/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1280px] items-center gap-3 px-4 py-2.5 sm:px-6">
          <ol className="flex flex-1 items-center gap-1 overflow-x-auto scroll-thin">
            {STEPS.map((label, i) => {
              const n = i + 1, active = n === cur, can = !!p || n === 1;
              return (
                <li key={label} className="flex shrink-0 items-center">
                  {i > 0 && <span className="mx-1 h-px w-3 bg-line sm:w-5" />}
                  <button type="button" disabled={!can} onClick={() => go(n)} aria-current={active ? "step" : undefined}
                    className={`tap flex items-center gap-1.5 rounded-full py-1.5 pl-1.5 pr-3 text-[12.5px] transition ${active ? "bg-ink text-white" : can ? "hover:bg-white" : "opacity-40"}`}>
                    <span className={`grid h-5 w-5 place-items-center rounded-full text-[11px] font-semibold ${active ? "bg-white text-ink" : done(n) ? "bg-ok text-white" : "bg-white ring-1 ring-line"}`}>{done(n) && !active ? <Check size={12} /> : n}</span>
                    <span className={active ? "" : "hidden md:inline"}>{label}</span>
                  </button>
                </li>
              );
            })}
          </ol>
          {p && <span className="hidden shrink-0 items-center gap-1 text-[11.5px] text-mute sm:flex">{saving ? <><Loader2 size={12} className="spin" />保存中</> : <><Check size={12} />この端末に保存済み</>}</span>}
        </div>
      </div>
      <main className="mx-auto max-w-[1280px] px-4 pb-24 pt-6 sm:px-6 sm:pt-8">
        {!ready ? <p className="flex items-center gap-2 py-20 text-[14px] text-mute"><Loader2 size={16} className="spin" />読み込み中…</p>
          : cur === 1 ? <StepTemplate initial={tplQ} onDone={() => go(2)} />
          : cur === 2 ? <StepInfo onNext={() => go(3)} />
          : cur === 3 ? <StepImages onNext={() => go(4)} onBack={() => go(2)} />
          : cur === 4 ? <StepFinish onNext={() => go(5)} />
          : <StepDownload onBack={() => go(4)} />}
      </main>
    </>
  );
}

export default function Page() { return <Suspense><Builder /></Suspense>; }
