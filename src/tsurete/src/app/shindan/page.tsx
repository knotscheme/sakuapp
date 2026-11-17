"use client";

import Link from "next/link";
import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Check, ChevronDown, Copy, Download, FileSpreadsheet, Link2, Loader2, Upload } from "lucide-react";
import Shell, { Title } from "@/components/Shell";
import J from "@/components/J";
import Ready from "@/components/Ready";
import { toast } from "@/components/Confirm";
import { CHECKS, SAMPLE_CSV, SAMPLE_HTML, SAMPLE_REWRITES, SAMPLE_URL, diagnose, download, parseCsv, readProducts, strip, template, toCsv, type Check as Ck, type Item } from "@/lib/check";
import { PNAME, aiReadUrl, aiReady, aiRewrite, useAi } from "@/lib/ai";
import { platformCsv, platformOf } from "@/lib/platforms";
import { useStore } from "@/lib/store";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const STEPS = [
  { t: "読み取る", d: "商品ページの文章を取りこみます" },
  { t: "点検する", d: "AIが商品を選ぶときに見る7つの情報が、あるかを調べます" },
  { t: "案を作る", d: "足りないところを、AIが書き直します" },
];

function CopyBtn({ text, label = "コピー" }: { text: string; label?: string }) {
  return <button type="button" onClick={async () => { try { await navigator.clipboard.writeText(text); toast("コピーしました"); } catch { toast("コピーできませんでした"); } }} className="flex items-center gap-1.5 text-[0.8rem] font-bold text-sub hover:text-ai"><Copy size={14} />{label}</button>;
}

// 診断のしくみ。動いている間は、いまの段を光らせる
function How({ at }: { at: number }) {
  return (
    <ol className="grid gap-6 sm:grid-cols-3 sm:gap-8">
      {STEPS.map((s, i) => (
        <li key={s.t} className={`border-t pt-4 transition ${at === i ? "border-ai" : at > i ? "border-ai/40" : "hair"}`}>
          <p className="flex items-center gap-2 text-[0.9rem] font-bold"><span className="num text-[0.75rem] text-ai">0{i + 1}</span>{s.t}{at === i && <Loader2 size={15} className="animate-spin text-ai" />}{at > i && <Check size={15} className="text-ai" />}</p>
          <p className="mt-1 text-[0.82rem] leading-[1.8] text-sub"><J>{s.d}</J></p>
        </li>
      ))}
    </ol>
  );
}

function Mode() {
  const ai = useAi();
  return aiReady(ai)
    ? <p className="text-[0.8rem] text-sub">書き直し案は {PNAME[ai.provider as keyof typeof PNAME]} が作ります</p>
    : <p className="text-[0.8rem] leading-[1.9] text-sub"><J>AIのキーがないため、書き直し案は【】つきのひな形になります。</J><Link href="/settings/" className="text-ai underline underline-offset-4">キーを入れる</Link></p>;
}

// 1つの点検項目：何が足りないか → どう調べたか・なぜ大事か → 書き直し案
function Finding({ it, c, open, onToggle }: { it: Item; c: Ck; open: boolean; onToggle: () => void }) {
  const k = CHECKS[c.key];
  const text = k.fix ? it.rewrite?.[k.fix] : c.key === "title" ? `例）${it.title.replace(/\s*\d+\s*(ml|g)$/i, "")} 【容量：例）120ml】` : "";
  return (
    <li className="border-b hair">
      <button type="button" aria-expanded={open} onClick={onToggle} className="flex w-full items-center gap-4 py-5 text-left">
        <span className="h-2 w-2 shrink-0 rounded-full bg-warn" aria-hidden />
        <span className="min-w-0 flex-1"><b className="block text-[1rem]">{k.label}</b><span className="text-[0.86rem] text-sub"><J>{k.ng}</J></span></span>
        <ChevronDown size={20} className={`shrink-0 text-sub transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="fade-in grid gap-6 pb-8 pl-6 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-10">
          <dl className="space-y-4 text-[0.88rem] leading-[1.9]">
            <div><dt className="text-[0.75rem] font-bold text-sub">どうやって調べた？</dt><dd className="mt-1"><J>{k.how}</J></dd></div>
            <div><dt className="text-[0.75rem] font-bold text-sub">なぜ大事？</dt><dd className="mt-1"><J>{k.why}</J></dd></div>
          </dl>
          {text ? (
            <div className="min-w-0 rounded-2xl bg-ai/[.07] p-5">
              <p className="flex items-center justify-between text-[0.75rem] font-bold text-ai">書き直し案<CopyBtn text={text} /></p>
              <p className="mt-2 whitespace-pre-line text-[0.92rem] leading-[1.95]">{text}</p>
            </div>
          ) : <p className="self-center text-[0.86rem] text-sub">「書き直す」の画面で、自動で入れられます。</p>}
        </div>
      )}
    </li>
  );
}

function Result({ it, sample }: { it: Item; sample: boolean }) {
  const bad = it.checks.filter((c) => c.ok === false), good = it.checks.filter((c) => c.ok);
  const [open, setOpen] = useState<string | null>(bad[0]?.key ?? null);
  const all = [["商品説明", it.rewrite?.target], ["容量と値段", it.rewrite?.spec], ["成分", it.rewrite?.ingredient], ["よくある質問", it.rewrite?.faq]].filter(([, v]) => v).map(([l, v]) => `【${l}】\n${v}`).join("\n\n");
  return (
    <section className="fade-in mt-16 sm:mt-20" aria-label="診断結果">
      <p className="text-[0.82rem] text-sub">{it.title}</p>
      <div className="mt-3 flex flex-wrap items-end gap-x-10 gap-y-4">
        <p><b className={`num text-[4rem] leading-none ${it.score >= 70 ? "text-ai" : "text-warn"}`}>{it.score}</b><span className="ml-1 text-sub">点</span></p>
        <p className="pb-2 text-[1.05rem] font-bold">直すと良いところが <span className="text-warn">{bad.length}つ</span> あります</p>
      </div>
      {good.length > 0 && <p className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-[0.82rem] text-sub">{good.map((c) => <span key={c.key} className="flex items-center gap-1"><Check size={14} className="text-ai" />{CHECKS[c.key].label}</span>)}</p>}
      {it.aiNote && <p className="mt-6 text-[0.9rem] leading-[1.9]">AIのひと言：{it.aiNote}</p>}

      <ul className="mt-10 border-t hair">{bad.map((c) => <Finding key={c.key} it={it} c={c} open={open === c.key} onToggle={() => setOpen(open === c.key ? null : c.key)} />)}</ul>

      <div className="mt-10 flex flex-wrap items-center gap-5">
        {sample && <Link href="/naosu/" className="btn btn-ai px-7">商品ページに反映する<ArrowRight size={18} /></Link>}
        <CopyBtn text={all} label="書き直し案をまとめてコピー" />
      </div>
    </section>
  );
}

// ---------- URLで1商品 ----------
function ByUrl({ initial }: { initial?: string }) {
  const [url, setUrl] = useState(initial || SAMPLE_URL);
  const [paste, setPaste] = useState(""), [needPaste, setNeedPaste] = useState(false);
  const [at, setAt] = useState(-1), [err, setErr] = useState("");
  const [it, setIt] = useState<Item | null>(null), [sample, setSample] = useState(false);
  const run = async (u = url) => {
    setErr(""); setIt(null); setAt(0);
    try {
      const isSample = u.includes("sorae-skin.example");
      let html = "", text = "";
      if (isSample) { await sleep(800); html = SAMPLE_HTML; }
      else if (paste.trim()) text = paste;
      else {
        try { const r = await fetch(u, { mode: "cors" }); if (!r.ok) throw 0; html = await r.text(); }
        catch { if (aiReady()) { try { text = await aiReadUrl(u); } catch (e) { setNeedPaste(true); throw e; } } else { setNeedPaste(true); throw new Error("デモ版では、ほかのお店のページを直接読み取れません（ブラウザの安全のための決まりです）。下の欄に、商品ページの文章を貼りつけてください。本番では、URLを入れるだけで読み取れるようにします。"); } }
      }
      const title = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? "").replace(/<[^>]+>/g, "").trim() || text.split("\n")[0]?.slice(0, 60) || "商品";
      const body = html ? strip(html.replace(/<h1[\s\S]*?<\/h1>/i, "")) : text;
      const price = (body.normalize("NFKC").match(/([\d,]+)\s*円/)?.[1] ?? "").replace(/,/g, "");
      setAt(1); await sleep(800);
      const d = diagnose({ id: "url", title, body, price, url: u }, html ? /application\/ld\+json[\s\S]*?"Product"/i.test(html) : null);
      setAt(2);
      if (isSample) { await sleep(900); d.rewrite = SAMPLE_REWRITES["sorae-lotion"]; }
      else if (aiReady()) { const r = await aiRewrite(title, body, price); d.rewrite = r; d.aiNote = r.note; }
      else { await sleep(400); d.rewrite = template(title, body, price); }
      setSample(isSample); setIt(d); setAt(3);
    } catch (e) { setErr((e as Error).message); setAt(-1); }
  };
  useEffect(() => { if (initial) run(initial); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const busy = at >= 0 && at < 3;
  return (
    <>
      <form onSubmit={(e) => { e.preventDefault(); run(); }} className="flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="url">商品ページのURL</label>
        <input id="url" value={url} onChange={(e) => setUrl(e.target.value)} className="field num" inputMode="url" placeholder="https://（商品ページのURL）" />
        <button type="submit" disabled={busy} className="btn btn-ai shrink-0 px-8">{busy ? "診断しています…" : "診断する"}</button>
      </form>
      <p className="mt-3 text-[0.8rem] text-sub"><J>はじめは見本のURL（架空のブランド SORAE）が入っています。</J></p>
      {needPaste && <label className="mt-6 block text-[0.9rem] font-bold">商品ページの文章<textarea value={paste} onChange={(e) => setPaste(e.target.value)} rows={6} className="field mt-2" placeholder="商品名・値段・説明など、ページの文章をそのまま貼りつけてください" /></label>}
      {err && <p className="mt-4 text-[0.88rem] leading-[1.9] text-warn">{err}</p>}
      <div className="mt-12"><How at={at} /></div>
      {it && <Result it={it} sample={sample} />}
    </>
  );
}

// ---------- CSVでまとめて ----------
const LIMIT = 30; // AIで書き直し案を作るのは30商品まで
function ByCsv() {
  const file = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(""), [rows, setRows] = useState<ReturnType<typeof readProducts>["items"]>([]), [isSample, setIsSample] = useState(false);
  const [items, setItems] = useState<Item[]>([]), [prog, setProg] = useState<[number, number] | null>(null), [err, setErr] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const load = (text: string, n: string, sample = false) => { const r = readProducts(parseCsv(text)); setErr(r.error ?? ""); setRows(r.items); setName(n); setItems([]); setIsSample(sample); };
  const run = async () => {
    const out: Item[] = []; const useAi = !isSample && aiReady();
    for (let i = 0; i < rows.length; i++) {
      setProg([i, rows.length]);
      const d = diagnose(rows[i], null);
      try {
        if (isSample) { await sleep(160); d.rewrite = SAMPLE_REWRITES[d.id] ?? template(d.title, d.body, d.price); }
        else if (useAi && i < LIMIT) { const r = await aiRewrite(d.title, d.body, d.price); d.rewrite = r; d.aiNote = r.note; }
        else d.rewrite = template(d.title, d.body, d.price);
      } catch (e) { d.rewrite = template(d.title, d.body, d.price); d.aiNote = `AIで作れなかったため、ひな形にしました（${(e as Error).message}）`; }
      out.push(d); setItems([...out]);
    }
    setProg(null);
  };
  const sorted = [...items].sort((a, b) => a.score - b.score);
  const avg = items.length ? Math.round(items.reduce((a, x) => a + x.score, 0) / items.length) : 0;
  const ng = (Object.keys(CHECKS) as (keyof typeof CHECKS)[]).map((k) => ({ k, n: items.filter((x) => x.checks.find((c) => c.key === k)?.ok === false).length })).filter((x) => x.n).sort((a, b) => b.n - a.n);
  const site = useStore().site;
  const plat = platformOf(site);
  const saveSite = () => download(`tsurete-${plat!.id}.csv`, platformCsv(plat!.id, sorted.map((x) => ({ id: x.id, title: x.title, desc: [x.rewrite?.target, x.rewrite?.spec, x.rewrite?.ingredient].filter(Boolean).join("\n"), faq: x.rewrite?.faq ?? "" }))));
  const save = () => download("tsurete-書き直し案.csv", toCsv([["Handle", "商品名", "点数", "足りないもの", "新しい商品説明", "容量と値段", "成分", "よくある質問"], ...sorted.map((x) => [x.id, x.title, String(x.score), x.checks.filter((c) => c.ok === false).map((c) => CHECKS[c.key].label).join("・"), x.rewrite?.target ?? "", x.rewrite?.spec ?? "", x.rewrite?.ingredient ?? "", x.rewrite?.faq ?? ""])]));

  return (
    <>
      {rows.length === 0 ? (
        <div className="rounded-[24px] border border-dashed border-white/10 px-6 py-12 text-center sm:py-16">
          <FileSpreadsheet size={32} className="mx-auto text-sub" />
          <p className="mt-4 text-[1rem] font-bold">商品一覧のCSVを入れてください</p>
          <p className="mx-auto mt-2 max-w-[30em] text-[0.84rem] leading-[1.9] text-sub">Shopify・BASE・STORESの「商品の書き出し」で作ったCSVが、そのまま使えます。CSVはこの端末の中だけで読みます。</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={() => file.current?.click()} className="btn btn-ai px-7"><Upload size={18} />CSVを選ぶ</button>
            <button type="button" onClick={() => load(SAMPLE_CSV, "見本のCSV（SORAEの8商品）", true)} className="btn btn-line">見本で試す</button>
          </div>
          <button type="button" onClick={() => download("tsurete-見本.csv", SAMPLE_CSV)} className="mx-auto mt-5 flex items-center gap-1 text-[0.8rem] text-sub underline underline-offset-4"><Download size={14} />見本のCSVを保存する</button>
        </div>
      ) : (
        <div className="flex flex-col gap-4 border-b hair pb-8 sm:flex-row sm:items-center">
          <p className="min-w-0 flex-1"><b className="block">{name}</b><span className="text-[0.85rem] text-sub">{rows.length}商品を読み取りました</span></p>
          <div className="flex flex-wrap items-center gap-4">
            <button type="button" onClick={() => { setRows([]); setItems([]); }} className="text-[0.84rem] text-sub underline underline-offset-4">選びなおす</button>
            {!items.length && <button type="button" disabled={!!prog} onClick={run} className="btn btn-ai px-7">{prog ? "診断しています…" : "まとめて診断する"}</button>}
          </div>
        </div>
      )}
      <input ref={file} type="file" accept=".csv,text/csv" hidden onChange={async (e) => { const f = e.target.files?.[0]; e.target.value = ""; if (f) load(await f.text(), f.name); }} />
      {err && <p className="mt-4 text-[0.88rem] text-warn">{err}</p>}
      {!isSample && rows.length > LIMIT && aiReady() && <p className="mt-3 text-[0.8rem] text-sub"><J>{`AIで書き直し案を作るのは、先頭から${LIMIT}商品までです。残りはひな形になります。`}</J></p>}
      {prog && <div className="mt-8"><p className="num text-[0.85rem] text-sub">{prog[0] + 1} / {prog[1]}</p><div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[.06]"><div className="h-full rounded-full bg-ai transition-all" style={{ width: `${((prog[0] + 1) / prog[1]) * 100}%` }} /></div></div>}

      {items.length > 0 && !prog && (
        <div className="fade-in mt-14 space-y-16">
          <div className="grid gap-10 md:grid-cols-[auto_1fr] md:gap-16">
            <div><p className="text-[0.82rem] text-sub">{items.length}商品の平均</p><p className="mt-1"><b className={`num text-[4rem] leading-none ${avg >= 70 ? "text-ai" : "text-warn"}`}>{avg}</b><span className="ml-1 text-sub">点</span></p></div>
            <div>
              <p className="text-[0.82rem] text-sub">足りない商品が多いもの</p>
              <ul className="mt-3 space-y-3">{ng.slice(0, 4).map((x) => <li key={x.k} className="grid grid-cols-[7.5em_1fr_auto] items-center gap-4 text-[0.88rem]"><span>{CHECKS[x.k].label}</span><span className="h-1.5 overflow-hidden rounded-full bg-white/[.06]"><span className="block h-full rounded-full bg-warn" style={{ width: `${(x.n / items.length) * 100}%` }} /></span><span className="num text-sub">{x.n}/{items.length}</span></li>)}</ul>
            </div>
          </div>

          <section aria-labelledby="list">
            <div className="flex flex-wrap items-end justify-between gap-4"><h2 id="list" className="text-[1.15rem] font-bold">点数の低い順</h2><div className="flex flex-wrap gap-3">{plat?.method === "csv" && <button type="button" onClick={saveSite} className="btn btn-ai px-6"><Download size={17} />{plat.action}</button>}<button type="button" onClick={save} className={`btn px-6 ${plat?.method === "csv" ? "btn-line" : "btn-ai"}`}><Download size={17} />書き直し案をCSVで保存</button></div></div>
            <ul className="mt-6 border-t hair">
              {sorted.map((x) => (
                <li key={x.id} className="border-b hair">
                  <button type="button" aria-expanded={open === x.id} onClick={() => setOpen(open === x.id ? null : x.id)} className="flex w-full items-center gap-5 py-5 text-left">
                    <b className={`num w-10 shrink-0 text-right text-[1.4rem] ${x.score >= 70 ? "text-ai" : "text-warn"}`}>{x.score}</b>
                    <span className="min-w-0 flex-1"><b className="block truncate text-[0.98rem]">{x.title}</b><span className="text-[0.82rem] text-sub">直すと良いところ {x.checks.filter((c) => c.ok === false).length}つ</span></span>
                    <ChevronDown size={20} className={`shrink-0 text-sub transition ${open === x.id ? "rotate-180" : ""}`} />
                  </button>
                  {open === x.id && <div className="pb-6 sm:pl-14"><ul className="border-t hair">{x.checks.filter((c) => c.ok === false).map((c, i) => <CsvFinding key={c.key} it={x} c={c} first={i === 0} />)}</ul></div>}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-[0.8rem] leading-[1.9] text-sub">保存したCSVは、内容を確かめてから商品ページに反映してください。【】の部分は、お店でしか分からない内容です。</p>
          </section>
        </div>
      )}
    </>
  );
}
function CsvFinding({ it, c, first }: { it: Item; c: Ck; first: boolean }) {
  const [open, setOpen] = useState(first);
  return <Finding it={it} c={c} open={open} onToggle={() => setOpen(!open)} />;
}

function Shindan() {
  const sp = useSearchParams();
  const [pick, setTab] = useState<"url" | "csv" | null>(null);
  const tab = pick ?? (sp.get("csv") ? "csv" : "url");
  return (
    <>
      <Title title="無料診断" lead="商品ページのURLか、商品一覧のCSVを入れてください。AIに選ばれるために足りないところと、書き直し案を出します。どのサイトの商品でも使えます。" />
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex rounded-full bg-white/[.04] p-1" role="tablist" aria-label="診断のしかた">
          {([["url", "URLで1商品", Link2], ["csv", "CSVでまとめて", FileSpreadsheet]] as const).map(([v, l, I]) => <button key={v} type="button" role="tab" aria-selected={tab === v} onClick={() => setTab(v)} className={`flex items-center gap-1.5 rounded-full px-5 py-2 text-[0.88rem] font-bold transition ${tab === v ? "bg-ai text-[#03140f]" : "text-sub"}`}><I size={16} />{l}</button>)}
        </div>
        <Mode />
      </div>
      {tab === "url" ? <ByUrl initial={sp.get("url") ?? undefined} /> : <ByCsv />}
    </>
  );
}

export default function Page() { return <Shell><Ready><Suspense><Shindan /></Suspense></Ready></Shell>; }
