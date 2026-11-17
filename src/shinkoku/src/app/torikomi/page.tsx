"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Camera, CreditCard, FileText, Landmark, Loader2, PencilLine, Sparkles } from "lucide-react";
import Shell from "@/components/Shell";
import Ready from "@/components/Ready";
import Help from "@/components/Help";
import ImportGuide from "@/components/ImportGuide";
import { toast } from "@/components/Confirm";
import { aiReady, readReceipt, useAi, type ReceiptRead } from "@/lib/ai";
import { guess, parseStatement, type Kind } from "@/lib/importer";
import { SAMPLE_BANK_CSV, SAMPLE_CARD_CSV, makeT } from "@/lib/seed";
import { addEntries, getState, uid, useStore, type Entry } from "@/lib/store";
import { yen } from "@/lib/books";

// レシートの写真を小さくして保存する（この端末の中だけ）
async function shrink(file: File) {
  const bmp = await createImageBitmap(file);
  const k = Math.min(1, 1100 / Math.max(bmp.width, bmp.height));
  const c = document.createElement("canvas");
  c.width = Math.round(bmp.width * k); c.height = Math.round(bmp.height * k);
  c.getContext("2d")!.drawImage(bmp, 0, 0, c.width, c.height);
  return c.toDataURL("image/jpeg", 0.82);
}

function Torikomi() {
  const router = useRouter();
  const s = useStore();
  const ai = useAi();
  const bank = useRef<HTMLInputElement>(null), card = useRef<HTMLInputElement>(null), photo = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState("");
  const [err, setErr] = useState("");
  const [manual, setManual] = useState({ date: "2026-11-17", amount: "", what: "", pay: "cash" as "cash" | "card" | "bank" });

  function take(text: string, kind: Kind) {
    setErr("");
    try {
      const st = getState();
      const { entries, dup } = parseStatement(text, kind, st.rules, st.entries);
      if (!entries.length) { toast(dup ? "すでに取りこんだ明細でした（2回は入りません）" : "取りこめる明細がありませんでした"); return; }
      addEntries(entries);
      toast(`${entries.length}件を取りこみました${dup ? `（同じ明細${dup}件は入れていません）` : ""}`);
      router.push("/kakunin/");
    } catch (e) { setErr((e as Error).message); }
  }
  async function file(f: File | undefined, kind: Kind) {
    if (!f) return;
    const buf = await f.arrayBuffer();
    // 銀行のCSVは Shift_JIS のことが多いので、文字化けしたら読み直す
    let text = new TextDecoder("utf-8").decode(buf);
    if (text.includes("�")) text = new TextDecoder("shift_jis").decode(buf);
    take(text, kind);
  }

  function addReceipt(r: ReceiptRead, img: string) {
    const rid = uid();
    try { localStorage.setItem(`jbs-rc-${rid}`, img); } catch {}
    const g = guess(`${r.shop} ${r.item}`, false, getState().rules);
    const e: Entry = {
      id: uid(), date: r.date || manual.date, debit: g.account, credit: "cash", amount: r.amount, partner: r.shop || "お店", memo: r.item,
      taxRate: r.taxRate, invoice: r.invoice, bizPct: g.bizPct, personal: g.personal, source: "receipt", status: "check", receipt: rid,
      history: [{ at: new Date().toLocaleString("ja-JP"), what: `レシートから読み取り：${g.why}` }],
    };
    addEntries([e]);
    toast("レシートを読み取りました");
    router.push("/kakunin/");
  }
  async function onPhoto(f: File | undefined) {
    if (!f) return;
    setBusy("receipt"); setErr("");
    try {
      const img = await shrink(f);
      const r = await readReceipt(img.split(",")[1], "image/jpeg");
      addReceipt(r, img);
    } catch (e) { setErr((e as Error).message); } finally { setBusy(""); }
  }
  // AIの設定が無いときの見本（読み取った結果の例）
  function sampleReceipt() {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="420"><rect width="100%" height="100%" fill="#fff"/><g font-family="sans-serif" fill="#222"><text x="150" y="40" font-size="20" text-anchor="middle">文具のやまだ</text><text x="150" y="62" font-size="11" text-anchor="middle">登録番号 ${makeT("810000000097")}</text><text x="20" y="110" font-size="14">2026年11月17日</text><text x="20" y="150" font-size="14">プリンターインク</text><text x="280" y="150" font-size="14" text-anchor="end">¥4,180</text><text x="20" y="175" font-size="14">コピー用紙</text><text x="280" y="175" font-size="14" text-anchor="end">¥880</text><line x1="20" y1="195" x2="280" y2="195" stroke="#222"/><text x="20" y="225" font-size="18">合計</text><text x="280" y="225" font-size="18" text-anchor="end">¥5,060</text><text x="20" y="250" font-size="12">（10%対象 ¥5,060 うち消費税 ¥460）</text><text x="150" y="400" font-size="11" text-anchor="middle">※見本のレシートです</text></g></svg>`;
    addReceipt({ date: "2026-11-17", shop: "文具のやまだ", amount: 5060, taxRate: 10, invoice: makeT("810000000097"), item: "プリンターインク・コピー用紙" }, `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`);
  }
  function addManual() {
    const amount = Number(manual.amount.normalize("NFKC").replace(/[^\d]/g, ""));
    if (!amount || !manual.what.trim()) { setErr("「金額」と「何に使ったか」を入れてください"); return; }
    const g = guess(manual.what, false, getState().rules);
    addEntries([{ id: uid(), date: manual.date, debit: g.account, credit: manual.pay, amount, partner: manual.what.trim(), memo: manual.what.trim(), taxRate: 10, invoice: "", bizPct: g.bizPct, personal: g.personal, source: "manual", status: "check", history: [{ at: new Date().toLocaleString("ja-JP"), what: "手で入力しました" }] }]);
    toast("入力しました"); router.push("/kakunin/");
  }

  const pending = s.entries.filter((e) => e.status === "check" && !e.voided).length;
  const box = "card flex flex-col p-6";
  return (
    <>
      <Help title="1. 明細を取りこむ" say="銀行やクレジットカードの明細、レシートの写真を入れると、何に使ったお金かを自動で考えて、帳簿の下書きを作ります。月に一度、まとめて取りこむのがおすすめです。">
        銀行やカードの<b>明細</b>、<b>レシートの写真</b>を入れると、「何に使ったお金か」を自動で考えて、帳簿の下書きを作ります。<br />月に1回、まとめて取りこむのがおすすめです。{pending > 0 && <> いま<Link href="/kakunin/" className="font-bold underline">確認待ちが{pending}件</Link>あります。</>}
      </Help>

      <ImportGuide />
      <div className="grid gap-4 md:grid-cols-2">
        <section className={box}>
          <Landmark size={36} className="text-ok" />
          <h2 className="mt-3 text-[1.3rem] font-bold">銀行の明細</h2>
          <p className="mt-1 flex-1 text-[1rem] text-sub">ネットバンキングの「入出金明細」から、CSVという形のファイルを保存して入れます。</p>
          <button type="button" onClick={() => bank.current?.click()} className="btn btn-main mt-4 w-full"><FileText size={20} />ファイルをえらぶ</button>
          <button type="button" onClick={() => take(SAMPLE_BANK_CSV, "bank")} className="btn btn-sub mt-2 w-full">見本の明細で試す（11月分）</button>
          <input ref={bank} type="file" accept=".csv,text/csv,text/plain" hidden onChange={(e) => { file(e.target.files?.[0], "bank"); e.target.value = ""; }} />
        </section>
        <section className={box}>
          <CreditCard size={36} className="text-ok" />
          <h2 className="mt-3 text-[1.3rem] font-bold">クレジットカードの明細</h2>
          <p className="mt-1 flex-1 text-[1rem] text-sub">カード会社のサイトの「ご利用明細」から、CSVのファイルを保存して入れます。</p>
          <button type="button" onClick={() => card.current?.click()} className="btn btn-main mt-4 w-full"><FileText size={20} />ファイルをえらぶ</button>
          <button type="button" onClick={() => take(SAMPLE_CARD_CSV, "card")} className="btn btn-sub mt-2 w-full">見本の明細で試す（11月分）</button>
          <input ref={card} type="file" accept=".csv,text/csv,text/plain" hidden onChange={(e) => { file(e.target.files?.[0], "card"); e.target.value = ""; }} />
        </section>
        <section className={`${box} overflow-hidden`}>
          <img src="/sakuapp/works/shinkoku/img/receipt.webp" alt="スマホでレシートを撮っているところ" width={800} height={800} loading="lazy" className="-mx-6 -mt-6 mb-4 aspect-[16/9] w-[calc(100%+3rem)] max-w-none object-cover object-[50%_45%]" />
          <Camera size={36} className="text-ok" />
          <h2 className="mt-3 text-[1.3rem] font-bold">レシート・領収書</h2>
          <p className="mt-1 flex-1 text-[1rem] text-sub">現金で払ったものは、レシートを撮ると、日付・金額・お店を読み取ります。写真はこの端末に保管します。</p>
          {aiReady(ai) ? (
            <button type="button" disabled={!!busy} onClick={() => photo.current?.click()} className="btn btn-main mt-4 w-full">{busy ? <><Loader2 size={20} className="animate-spin" />読み取っています</> : <><Camera size={20} />写真を撮る・えらぶ</>}</button>
          ) : (
            <p className="mt-4 rounded-xl bg-paper p-3 text-[0.9rem]"><Sparkles size={16} className="mr-1 inline" />読み取りには、<Link href="/settings/" className="font-bold underline">設定</Link>でAIのキーを入れてください（Geminiなら無料枠で使えます）。</p>
          )}
          <button type="button" onClick={sampleReceipt} className="btn btn-sub mt-2 w-full">見本のレシートで試す</button>
          <input ref={photo} type="file" accept="image/*" capture="environment" hidden onChange={(e) => { onPhoto(e.target.files?.[0]); e.target.value = ""; }} />
        </section>
        <section className={box}>
          <PencilLine size={36} className="text-ok" />
          <h2 className="mt-3 text-[1.3rem] font-bold">手で入力する</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <label className="text-[0.95rem] font-bold">日付<input type="date" value={manual.date} onChange={(e) => setManual({ ...manual, date: e.target.value })} className="field mt-1" /></label>
            <label className="text-[0.95rem] font-bold">金額（円）<input inputMode="numeric" value={manual.amount} onChange={(e) => setManual({ ...manual, amount: e.target.value })} placeholder="例）1200" className="field num mt-1" /></label>
          </div>
          <label className="mt-3 text-[0.95rem] font-bold">何に使ったか<input value={manual.what} onChange={(e) => setManual({ ...manual, what: e.target.value })} placeholder="例）打ち合わせのコーヒー" className="field mt-1" /></label>
          <fieldset className="mt-3"><legend className="text-[0.95rem] font-bold">払い方</legend>
            <div className="mt-1 flex flex-wrap gap-2">{([["cash", "現金"], ["card", "カード"], ["bank", "口座から"]] as const).map(([v, l]) => <button key={v} type="button" aria-pressed={manual.pay === v} onClick={() => setManual({ ...manual, pay: v })} className={`btn min-h-[2.8rem] px-4 ${manual.pay === v ? "btn-ink" : "btn-sub"}`}>{l}</button>)}</div>
          </fieldset>
          <button type="button" onClick={addManual} className="btn btn-main mt-4 w-full">入力する</button>
        </section>
      </div>
      {err && <p role="alert" className="mt-4 rounded-2xl border-2 border-ng bg-ng-2 p-4 text-[1rem] font-bold text-ng">{err}</p>}
      <p className="mt-6 text-[0.9rem] leading-[1.9] text-sub">※同じ明細を2回入れても、2つにはなりません。<br />※今のデータ：{s.entries.filter((e) => !e.voided).length}件（{yen(s.entries.filter((e) => !e.voided && e.credit === "sales").reduce((a, e) => a + e.amount, 0))}の売上）</p>
    </>
  );
}

export default function Page() { return <Shell><Ready><Torikomi /></Ready></Shell>; }
