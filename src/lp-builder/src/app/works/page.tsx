"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { ArrowRight, Maximize2, Monitor, Smartphone } from "lucide-react";
import FullView from "@/components/FullView";
import Header from "@/components/Header";
import Frame from "@/components/Frame";
import { askConfirm } from "@/components/Confirm";
import { SAMPLES } from "@/lib/samples";
import { sampleDoc } from "@/lib/sampleDoc";
import { getTemplate } from "@/lib/templates";
import { getProject, initProject, loadSample } from "@/lib/project";

function Works() {
  const router = useRouter();
  const [id, setId] = useState(SAMPLES[0].id);
  const [view, setView] = useState<"pc" | "sp">("pc");
  const [doc, setDoc] = useState("");
  const [busy, setBusy] = useState(false);
  const [full, setFull] = useState(false);
  useEffect(() => {
    const q = new URLSearchParams(location.search).get("id");
    if (q && SAMPLES.some((s) => s.id === q)) setId(q);
    if (innerWidth < 640) setView("sp");
    initProject();
  }, []);
  useEffect(() => { setDoc(sampleDoc(id)); }, [id]);
  const s = SAMPLES.find((x) => x.id === id)!;
  const t = getTemplate(s.tpl);
  const pick = (x: string) => { setId(x); history.replaceState(null, "", `?id=${x}`); };
  const start = async () => {
    await initProject();
    if (getProject() && !(await askConfirm({ title: "いま作っているLPを、この見本に置きかえますか？", body: "作りかけの文章と写真は消えます。残したい場合は、先に「つくる」画面からダウンロードしてください。", ok: "置きかえる", danger: true }))) return;
    setBusy(true);
    await loadSample(id);
    router.push("/build/?step=4");
  };
  return (
    <>
      <Header />
      <main className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 sm:py-10">
        <h1 className="text-[24px] font-bold sm:text-[28px]">作品例</h1>
        <p className="mt-2 text-[14px] leading-[1.9] text-mute">LP BUILDER の型で作った見本です（商品・会社・施設は架空のものです）。気に入った見本から、そのまま作りはじめられます。</p>
        <div className="mt-6 flex gap-2 overflow-x-auto pb-1 scroll-thin" role="tablist">
          {SAMPLES.map((x) => (
            <button key={x.id} type="button" role="tab" aria-selected={x.id === id} onClick={() => pick(x.id)}
              className={`tap shrink-0 rounded-full px-4 py-2 text-[13px] transition ${x.id === id ? "bg-ink text-white" : "bg-white ring-1 ring-line hover:ring-ink"}`}>{x.title}</button>
          ))}
        </div>
        <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_300px]">
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
              <span className="hidden text-[12.5px] text-mute sm:inline">{view === "pc" ? "パソコンでの見え方" : "スマホでの見え方"}（スクロールできます）</span>
              <div className="flex items-center gap-2">
              <button type="button" onClick={() => setFull(true)} className="tap flex items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-[12.5px] text-white hover:bg-black"><Maximize2 size={13} />全画面で見る</button>
              <div className="flex rounded-full bg-paper p-1">
                {([["pc", Monitor, "パソコン"], ["sp", Smartphone, "スマホ"]] as const).map(([v, Icon, l]) => (
                  <button key={v} type="button" onClick={() => setView(v)} aria-pressed={view === v} className={`tap flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] ${view === v ? "bg-white shadow-sm" : "text-mute"}`}><Icon size={14} />{l}</button>
                ))}
              </div>
              </div>
            </div>
            <div className={`checker ${view === "sp" ? "py-5" : ""}`}>
              {doc && (view === "pc"
                ? <Frame key={`pc-${id}`} html={doc} width={1280} className="h-[70vh] min-h-[460px] w-full" interactive title={s.title} />
                : <div className="mx-auto w-[min(390px,100%)] overflow-hidden rounded-[28px] bg-white shadow-xl ring-[6px] ring-ink"><Frame key={`sp-${id}`} html={doc} width={390} className="h-[70vh] min-h-[520px] w-full" interactive title={s.title} /></div>)}
            </div>
          </div>
          <aside className="space-y-4">
            <div className="card p-5">
              <p className="text-[11.5px] font-medium tracking-wider text-accent">型：{t.name}</p>
              <h2 className="mt-1 text-[17px] font-bold">{s.title}</h2>
              <p className="mt-2 text-[13px] leading-[1.9] text-ink/75">{s.lead}</p>
              <dl className="mt-4 space-y-2 border-t border-line pt-4 text-[12.5px]">
                <div><dt className="text-mute">向いている商品</dt><dd className="mt-0.5">{t.best}</dd></div>
                <div><dt className="text-mute">必要な写真</dt><dd className="mt-0.5">{t.slots.length}枚（{t.slots.map((x) => x.label).join("・")}）</dd></div>
                <div><dt className="text-mute">文章の項目</dt><dd className="mt-0.5">{t.fields.length}項目</dd></div>
              </dl>
              <button type="button" disabled={busy} onClick={start} className="btn btn-accent mt-5 w-full py-3 text-[14px]">{busy ? "読み込み中…" : "この見本から作る"}{!busy && <ArrowRight size={16} />}</button>
              <Link href={`/build/?tpl=${t.id}`} className="btn btn-line mt-2 w-full py-3 text-[13.5px]">この型で、新しく作る</Link>
            </div>
            <p className="px-1 text-[12px] leading-[1.9] text-mute">見本から作ると、文章と写真がそのまま入った状態で始まります。写真と文章を自分のものに入れかえてください。</p>
          </aside>
        </div>
      </main>
      {full && doc && <FullView html={doc} title={s.title} onClose={() => setFull(false)} />}
    </>
  );
}

export default function Page() { return <Suspense><Works /></Suspense>; }
