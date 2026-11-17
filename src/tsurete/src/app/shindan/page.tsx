"use client";

import Link from "next/link";
import { Suspense, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Check, ChevronDown, Copy, Download, FileSpreadsheet, Link2, Loader2, Minus, ScanSearch, Upload, Wand2, X } from "lucide-react";
import Shell, { Title } from "@/components/Shell";
import Ready from "@/components/Ready";
import { toast } from "@/components/Confirm";
import { CHECKS, SAMPLE_CSV, SAMPLE_HTML, SAMPLE_REWRITES, SAMPLE_URL, diagnose, download, parseCsv, readProducts, strip, template, toCsv, type Item, type Rewrite } from "@/lib/check";
import { PNAME, aiReadUrl, aiReady, aiRewrite, useAi } from "@/lib/ai";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const REW: [keyof Rewrite, string][] = [["target", "商品説明"], ["spec", "容量と値段"], ["ingredient", "成分"], ["faq", "よくある質問"]];

function Score({ v, size = "lg" }: { v: number; size?: "lg" | "sm" }) {
  const c = v >= 70 ? "text-ai" : v >= 40 ? "text-lime" : "text-warn";
  return size === "lg" ? <p><b className={`num text-[3rem] leading-none ${c}`}>{v}</b><span className="text-[0.9rem] text-sub"> / 100点</span></p> : <b className={`num ${c}`}>{v}</b>;
}
function CopyBtn({ text }: { text: string }) {
  return <button type="button" onClick={async () => { try { await navigator.clipboard.writeText(text); toast("コピーしました"); } catch { toast("コピーできませんでした"); } }} className="flex items-center gap-1 text-[0.78rem] text-sub hover:text-ai"><Copy size={13} />コピー</button>;
}
function Checks({ it }: { it: Item }) {
  return (
    <ul className="space-y-1.5">
      {it.checks.map((c) => (
        <li key={c.key} className="flex gap-2 text-[0.86rem] leading-[1.6]">
          <span className={`mt-[0.15rem] grid h-5 w-5 shrink-0 place-items-center rounded-full ${c.ok === null ? "bg-deep text-sub" : c.ok ? "bg-ai text-[#03140f]" : "bg-warn/20 text-warn"}`}>{c.ok === null ? <Minus size={12} /> : c.ok ? <Check size={12} /> : <X size={12} />}</span>
          <span className="min-w-0"><b>{CHECKS[c.key].label}</b><span className="text-sub">　{c.ok === null ? "CSVでは確かめられません" : c.ok ? CHECKS[c.key].ok : CHECKS[c.key].ng}</span></span>
        </li>
      ))}
    </ul>
  );
}
function Rewrites({ r, note }: { r: Rewrite; note?: string }) {
  return (
    <div className="space-y-2">
      {note && <p className="rounded-lg bg-ai/10 px-3 py-2 text-[0.85rem] text-ai">{note}</p>}
      {REW.map(([k, l]) => r[k] && (
        <div key={k} className="rounded-xl border border-line bg-paper p-3">
          <p className="flex items-center justify-between text-[0.75rem] font-bold text-sub">{l}<CopyBtn text={r[k]} /></p>
          <p className="mt-1 whitespace-pre-line text-[0.86rem] leading-[1.8]">{r[k]}</p>
        </div>
      ))}
    </div>
  );
}
function Mode() {
  const ai = useAi();
  return aiReady(ai)
    ? <p className="text-[0.82rem] text-sub"><span className="chip mr-2 bg-ai/15 text-ai">AI：{PNAME[ai.provider as keyof typeof PNAME]}</span>書き直し案はAIが作ります（費用はキーの持ち主にかかります）</p>
    : <p className="text-[0.82rem] text-sub"><span className="chip mr-2 bg-deep text-sub">AIのキーなし</span>点検はそのまま動きます。書き直し案は【】つきのひな形になります。<Link href="/settings/" className="text-ai underline">キーを入れる</Link></p>;
}

// ---------- URLで1商品 ----------
const STEPS = ["商品ページを読み取る", "AIに拾われる情報を点検する", "書き直し案を作る"];
function ByUrl() {
  const [url, setUrl] = useState(SAMPLE_URL);
  const [paste, setPaste] = useState(""), [needPaste, setNeedPaste] = useState(false);
  const [step, setStep] = useState(-1), [err, setErr] = useState("");
  const [it, setIt] = useState<Item | null>(null), [sample, setSample] = useState(false);
  const run = async () => {
    setErr(""); setIt(null); setStep(0);
    try {
      const isSample = url.includes("sorae-skin.example");
      let html = "", text = "";
      if (isSample) { await sleep(700); html = SAMPLE_HTML; }
      else if (paste.trim()) text = paste;
      else {
        try { const r = await fetch(url, { mode: "cors" }); if (!r.ok) throw 0; html = await r.text(); }
        catch { if (aiReady()) { try { text = await aiReadUrl(url); } catch (e) { setNeedPaste(true); throw e; } } else { setNeedPaste(true); throw new Error("このお店のページは、ブラウザから直接読み取れませんでした。下の欄に商品ページの文章を貼りつけて、もう一度押してください"); } }
      }
      const title = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? "").replace(/<[^>]+>/g, "").trim() || text.split("\n")[0]?.slice(0, 60) || "商品";
      const body = html ? strip(html.replace(/<h1[\s\S]*?<\/h1>/i, "")) : text;
      const price = (body.normalize("NFKC").match(/([\d,]+)\s*円/)?.[1] ?? "").replace(/,/g, "");
      setStep(1); await sleep(600);
      const d = diagnose({ id: "url", title, body, price, url }, html ? /application\/ld\+json[\s\S]*?"Product"/i.test(html) : null);
      setStep(2);
      if (isSample) { await sleep(900); d.rewrite = SAMPLE_REWRITES["sorae-lotion"]; }
      else if (aiReady()) { const r = await aiRewrite(title, body, price); d.rewrite = r; d.aiNote = r.note; }
      else { await sleep(300); d.rewrite = template(title, body, price); }
      setSample(isSample); setIt(d); setStep(3);
    } catch (e) { setErr((e as Error).message); setStep(-1); }
  };
  return (
    <>
      <div className="card p-5">
        <label className="block text-[0.9rem] font-bold" htmlFor="url">商品ページのURL</label>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <input id="url" value={url} onChange={(e) => setUrl(e.target.value)} className="field num" inputMode="url" placeholder="https://" />
          <button type="button" disabled={step >= 0 && step < 3} onClick={run} className="btn btn-ai shrink-0"><ScanSearch size={18} />診断する</button>
        </div>
        <p className="mt-2 text-[0.8rem] text-sub">はじめは見本のURL（架空のブランドSORAE）が入っています。</p>
        {needPaste && <label className="mt-3 block text-[0.88rem] font-bold">商品ページの文章を貼りつける<textarea value={paste} onChange={(e) => setPaste(e.target.value)} rows={5} className="field mt-1" placeholder="商品名・値段・説明など、ページの文章をそのまま貼りつけてください" /></label>}
        {err && <p className="mt-3 text-[0.88rem] text-warn">{err}</p>}
        {step >= 0 && (
          <ol className="mt-4 space-y-1.5">
            {STEPS.map((s, i) => <li key={s} className={`flex items-center gap-2 text-[0.88rem] ${i <= step ? "" : "text-sub/60"}`}>{i < step ? <Check size={16} className="text-ai" /> : i === step ? <Loader2 size={16} className="animate-spin text-ai" /> : <span className="h-4 w-4 rounded-full border border-line" />}{s}</li>)}
          </ol>
        )}
      </div>
      {it && (
        <div className="fade-in mt-5 grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <section className="card p-5" aria-label="診断結果">
            <p className="text-[0.82rem] text-sub">AIへの拾われやすさ</p>
            <Score v={it.score} />
            <b className="mt-2 block text-[0.95rem]">{it.title}</b>
            <div className="mt-4"><Checks it={it} /></div>
          </section>
          <section className="card p-5" aria-label="書き直し案">
            <h2 className="flex items-center gap-2 text-[1.05rem] font-bold"><Wand2 size={18} className="text-ai" />書き直し案</h2>
            <div className="mt-3"><Rewrites r={it.rewrite!} note={it.aiNote} /></div>
            {sample && <Link href="/naosu/" className="btn btn-ai mt-4 w-full sm:w-auto">商品ページに反映する<ArrowRight size={18} /></Link>}
          </section>
        </div>
      )}
    </>
  );
}

// ---------- CSVでまとめて ----------
const LIMIT = 30; // AIで書き直し案を作るのは30商品まで（費用の目安を超えないように）
function ByCsv() {
  const file = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(""), [rows, setRows] = useState<ReturnType<typeof readProducts>["items"]>([]), [isSample, setIsSample] = useState(false);
  const [items, setItems] = useState<Item[]>([]), [prog, setProg] = useState<[number, number] | null>(null), [err, setErr] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const load = (text: string, n: string, sample = false) => {
    const r = readProducts(parseCsv(text));
    setErr(r.error ?? ""); setRows(r.items); setName(n); setItems([]); setIsSample(sample);
  };
  const run = async () => {
    setErr(""); const out: Item[] = []; const useAi = !isSample && aiReady();
    for (let i = 0; i < rows.length; i++) {
      setProg([i, rows.length]);
      const d = diagnose(rows[i], null);
      try {
        if (isSample) { await sleep(180); d.rewrite = SAMPLE_REWRITES[d.id] ?? template(d.title, d.body, d.price); }
        else if (useAi && i < LIMIT) { const r = await aiRewrite(d.title, d.body, d.price); d.rewrite = r; d.aiNote = r.note; }
        else d.rewrite = template(d.title, d.body, d.price);
      } catch (e) { d.rewrite = template(d.title, d.body, d.price); d.aiNote = `AIで作れなかったため、ひな形にしました（${(e as Error).message}）`; }
      out.push(d); setItems([...out]);
    }
    setProg(null);
  };
  const sorted = [...items].sort((a, b) => a.score - b.score);
  const avg = items.length ? Math.round(items.reduce((a, x) => a + x.score, 0) / items.length) : 0;
  const ng = Object.keys(CHECKS).map((k) => ({ k: k as keyof typeof CHECKS, n: items.filter((x) => x.checks.find((c) => c.key === k)?.ok === false).length })).filter((x) => x.n).sort((a, b) => b.n - a.n);
  const save = () => download("tsurete-書き直し案.csv", toCsv([["Handle", "商品名", "点数", "足りないもの", "新しい商品説明", "容量と値段", "成分", "よくある質問"], ...sorted.map((x) => [x.id, x.title, String(x.score), x.checks.filter((c) => c.ok === false).map((c) => CHECKS[c.key].label).join("・"), x.rewrite?.target ?? "", x.rewrite?.spec ?? "", x.rewrite?.ingredient ?? "", x.rewrite?.faq ?? ""])]));

  return (
    <>
      <div className="card p-5">
        <p className="text-[0.9rem] font-bold">商品一覧のCSV</p>
        <p className="mt-1 text-[0.82rem] leading-[1.7] text-sub">Shopify・BASE・STORESの「商品の書き出し」で作ったCSVや、「商品名・説明・値段」の列がある表が使えます。CSVはこの端末の中だけで読み、どこにも送りません（AIのキーがあるときは、書き直し案を作るために商品の文章だけをAIへ送ります）。</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" onClick={() => file.current?.click()} className="btn btn-ink"><Upload size={17} />CSVファイルを選ぶ</button>
          <button type="button" onClick={() => load(SAMPLE_CSV, "見本のCSV（SORAEの8商品）", true)} className="btn btn-line"><FileSpreadsheet size={17} />見本のCSVで試す</button>
          <button type="button" onClick={() => download("tsurete-見本.csv", SAMPLE_CSV)} className="flex items-center gap-1 px-2 text-[0.85rem] text-sub underline"><Download size={15} />見本のCSVを保存</button>
          <input ref={file} type="file" accept=".csv,text/csv" hidden onChange={async (e) => { const f = e.target.files?.[0]; e.target.value = ""; if (f) load(await f.text(), f.name); }} />
        </div>
        {err && <p className="mt-3 text-[0.88rem] text-warn">{err}</p>}
        {rows.length > 0 && (
          <div className="mt-4 flex flex-col gap-3 rounded-xl bg-paper p-3 sm:flex-row sm:items-center">
            <p className="min-w-0 flex-1 text-[0.88rem]"><b className="block sm:inline">{name}</b><span className="text-sub sm:ml-3">{rows.length}商品を読み取りました</span></p>
            <button type="button" disabled={!!prog} onClick={run} className="btn btn-ai"><ScanSearch size={18} />まとめて診断する</button>
          </div>
        )}
        {!isSample && rows.length > LIMIT && aiReady() && <p className="mt-2 text-[0.8rem] text-sub">AIで書き直し案を作るのは、点数の低い順ではなく先頭から{LIMIT}商品までです。残りはひな形になります。</p>}
        {prog && <div className="mt-4"><p className="num text-[0.85rem] text-sub">{prog[0] + 1} / {prog[1]} 商品を診断中…</p><div className="mt-1.5 h-2 overflow-hidden rounded-full bg-deep"><div className="h-full rounded-full bg-ai transition-all" style={{ width: `${((prog[0] + 1) / prog[1]) * 100}%` }} /></div></div>}
      </div>

      {items.length > 0 && !prog && (
        <div className="fade-in mt-5 space-y-5">
          <div className="grid gap-3 md:grid-cols-[1fr_2fr]">
            <div className="card p-5"><p className="text-[0.82rem] text-sub">{items.length}商品の平均点</p><Score v={avg} /></div>
            <div className="card p-5">
              <p className="text-[0.82rem] text-sub">足りない商品が多いもの</p>
              <ul className="mt-2 space-y-1.5">{ng.slice(0, 4).map((x) => <li key={x.k} className="flex items-center gap-3 text-[0.86rem]"><span className="w-[9em] shrink-0">{CHECKS[x.k].label}</span><span className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-deep"><span className="block h-full rounded-full bg-warn" style={{ width: `${(x.n / items.length) * 100}%` }} /></span><span className="num w-14 text-right text-sub">{x.n}商品</span></li>)}</ul>
            </div>
          </div>
          <section className="card overflow-hidden p-0" aria-labelledby="list">
            <div className="flex flex-wrap items-center justify-between gap-2 px-5 pt-4"><h2 id="list" className="text-[1.05rem] font-bold">点数の低い順</h2><button type="button" onClick={save} className="btn btn-ai min-h-[2.4rem]"><Download size={17} />書き直し案をCSVで保存</button></div>
            <ul className="mt-3 divide-y divide-line">
              {sorted.map((x) => (
                <li key={x.id}>
                  <button type="button" aria-expanded={open === x.id} onClick={() => setOpen(open === x.id ? null : x.id)} className="flex w-full items-center gap-3 px-5 py-3 text-left hover:bg-white/[.02]">
                    <span className="w-9 shrink-0 text-right text-[1.1rem]"><Score v={x.score} size="sm" /></span>
                    <span className="min-w-0 flex-1"><b className="block truncate text-[0.92rem]">{x.title}</b><span className="mt-0.5 flex flex-wrap gap-1">{x.checks.filter((c) => c.ok === false).map((c) => <span key={c.key} className="chip bg-warn/15 py-0 text-[0.7rem] text-warn">{CHECKS[c.key].label}</span>)}</span></span>
                    <ChevronDown size={18} className={`shrink-0 text-sub transition ${open === x.id ? "rotate-180" : ""}`} />
                  </button>
                  {open === x.id && <div className="fade-in grid gap-4 px-5 pb-5 md:grid-cols-2"><Checks it={x} /><Rewrites r={x.rewrite!} note={x.aiNote} /></div>}
                </li>
              ))}
            </ul>
          </section>
          <p className="text-[0.8rem] leading-[1.8] text-sub">保存したCSVは、内容を確かめてから商品ページに反映してください。【】の部分は、お店でしか分からない内容です。Shopifyなどとつなぐ版では、承認した案をそのまま反映できます。</p>
        </div>
      )}
    </>
  );
}

function Shindan() {
  const sp = useSearchParams();
  const [pick, setTab] = useState<"url" | "csv" | null>(null);
  const tab = pick ?? (sp.get("csv") ? "csv" : "url");
  return (
    <>
      <Title n="1" title="診断する" lead="商品ページのURLか、商品一覧のCSVを入れると、AIに選ばれるために足りないものと、書き直し案を出します。" />
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="flex rounded-xl border border-line bg-panel p-1" role="tablist" aria-label="診断のしかた">
          {([["url", "URLで1商品", Link2], ["csv", "CSVでまとめて", FileSpreadsheet]] as const).map(([v, l, I]) => <button key={v} type="button" role="tab" aria-selected={tab === v} onClick={() => setTab(v)} className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-[0.88rem] font-bold ${tab === v ? "bg-ai text-[#03140f]" : "text-sub"}`}><I size={16} />{l}</button>)}
        </div>
      </div>
      <div className="mb-4"><Mode /></div>
      {tab === "url" ? <ByUrl /> : <ByCsv />}
    </>
  );
}

export default function Page() { return <Shell><Ready><Suspense><Shindan /></Suspense></Ready></Shell>; }
