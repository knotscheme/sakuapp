"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Bot, CalendarCheck, Plug, Send, Store, User, Wrench } from "lucide-react";
import Shell, { Title } from "@/components/Shell";
import Ready from "@/components/Ready";
import { DAYS, HOURS, SHOP, TODAY, baseBooked, dayLabel } from "@/lib/demo";
import { getState, uid, update, useStore, type Booking } from "@/lib/store";

type Msg = { who: "user" | "ai" | "tool" | "shop"; text: string };
const SCENES = ["今日の16時、肩こりで空いてる？", "今日の19時はあいてる？", "明日の午前中に、産後の骨盤ケアを予約したい", "駐車場はありますか？"];

const taken = (d: string, h: number, bs: Booking[]) => baseBooked(d, h) || bs.some((b) => b.day === d && b.hour === h);

// お客様の言葉から、日にち・時間・メニューを読み取る（デモの簡単なしくみ）
function parse(t: string) {
  const s = t.normalize("NFKC");
  let day = TODAY;
  if (/明後日|あさって/.test(s)) day = DAYS[2]; else if (/明日|あした/.test(s)) day = DAYS[1];
  const wd = s.match(/([日月火水木金土])曜/);
  if (wd) { const idx = "日月火水木金土".indexOf(wd[1]); day = DAYS.find((d) => new Date(`${d}T00:00:00`).getDay() === idx) ?? day; }
  let hours: number[] = HOURS;
  const h = s.match(/(\d{1,2})\s*時/);
  if (h) { let v = Number(h[1]); if (v < 10) v += 12; hours = [v]; }
  else if (/午前|朝/.test(s)) hours = [10, 11]; else if (/夕方/.test(s)) hours = [16, 17, 18]; else if (/夜|仕事帰り/.test(s)) hours = [18, 19, 20]; else if (/午後|昼/.test(s)) hours = [13, 14, 15];
  const menu = /産後|骨盤/.test(s) ? SHOP.menus[2] : /肩|首/.test(s) ? SHOP.menus[1] : SHOP.menus[0];
  return { day, hours, menu, parking: /駐車|車で/.test(s), book: /予約|空い|あい/.test(s) };
}

function Yoyaku() {
  const s = useStore();
  const [agent, setAgent] = useState("ChatGPT");
  const [text, setText] = useState("");
  const [log, setLog] = useState<Msg[]>([]);
  const [busy, setBusy] = useState(false);
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => { end.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }); }, [log]);

  const info = {
    name: SHOP.name, type: SHOP.kind, area: SHOP.area, hours: SHOP.hours, address: SHOP.address,
    menus: SHOP.menus.map((m) => ({ name: m.name, price: `${m.price.toLocaleString()}円` })),
    ...(s.applied.includes("parking") ? { parking: "店の駐車場はありません。徒歩1分の「みなと台第2パーキング」をご案内しています" } : {}),
    tools: ["check_availability（空きを確かめる）", "book（予約する）", "cancel（取り消す）"],
  };

  async function run(q: string) {
    if (!q.trim() || busy) return;
    setBusy(true); setText("");
    const p = parse(q);
    const out: Msg[] = [{ who: "user", text: q }];
    const push = async (m: Msg) => { out.push(m); setLog((l) => [...l, m]); await new Promise((r) => setTimeout(r, 450)); };
    setLog((l) => [...l, out[0]]);
    await new Promise((r) => setTimeout(r, 350));
    const on = getState().windowOn;
    if (!on) {
      await push({ who: "ai", text: `${SHOP.name}は、AIからの空きの確認や予約に対応していないようです。電話（営業時間 ${SHOP.hours}）で確認してください。代わりに、AIから予約できる近くの整体院もご案内できます。` });
      setBusy(false); return;
    }
    if (p.parking && !p.book) {
      await push({ who: "tool", text: `get_shop_info()` });
      await push({ who: "shop", text: info.parking ?? "駐車場の情報はありません" });
      await push({ who: "ai", text: info.parking ? `${SHOP.name}には専用の駐車場はありませんが、徒歩1分のコインパーキングを案内しています。` : `${SHOP.name}は駐車場の情報を出していません。電話で確認したほうがよさそうです。` });
      setBusy(false); return;
    }
    await push({ who: "tool", text: `check_availability(date="${p.day}", menu="${p.menu.name}")` });
    const bs = getState().bookings;
    const free = p.hours.filter((h) => !taken(p.day, h, bs));
    const other = HOURS.filter((h) => !taken(p.day, h, bs) && !p.hours.includes(h)).slice(0, 3);
    await push({ who: "shop", text: free.length ? `空き：${dayLabel(p.day)} ${free.map((h) => `${h}:00`).join("・")}` : `ご希望の時間は満席です。同じ日の空き：${other.map((h) => `${h}:00`).join("・") || "なし"}` });
    if (!free.length) { await push({ who: "ai", text: `${dayLabel(p.day)}のご希望の時間はうまっていました。${other.length ? `${other.map((h) => `${h}時`).join("、")}なら空いています。どれにしますか？` : "別の日を探しましょうか？"}` }); setBusy(false); return; }
    const h = free[0];
    await push({ who: "ai", text: `${dayLabel(p.day)} ${h}:00から「${p.menu.name}」（${p.menu.price.toLocaleString()}円）が空いています。予約しますね。` });
    const b: Booking = { id: uid(), day: p.day, hour: h, menu: p.menu.name, who: "山田 様（AIが代わりに入力）", via: agent, at: new Date().toLocaleString("ja-JP", { month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" }) };
    await push({ who: "tool", text: `book(date="${p.day}", time="${h}:00", menu="${p.menu.name}", name="山田")` });
    update((x) => ({ ...x, bookings: [b, ...x.bookings] }));
    await push({ who: "shop", text: `予約を受け付けました（予約番号 ${b.id.toUpperCase()}）。店の予約表にも入りました。` });
    await push({ who: "ai", text: `予約できました。${dayLabel(p.day)} ${h}:00、${SHOP.name}です。前の日にお知らせしますね。` });
    setBusy(false);
  }

  const bubble = (m: Msg, i: number) => {
    if (m.who === "user") return <div key={i} className="flex justify-end"><p className="max-w-[85%] rounded-2xl rounded-br-md bg-ink px-4 py-2.5 text-[0.95rem] text-white">{m.text}</p></div>;
    if (m.who === "ai") return <div key={i} className="flex gap-2"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ai text-white"><Bot size={17} /></span><p className="max-w-[85%] rounded-2xl rounded-tl-md bg-white px-4 py-2.5 text-[0.95rem] shadow-sm">{m.text}</p></div>;
    return (
      <div key={i} className="ml-10 flex min-w-0 items-start gap-2 text-[0.8rem]">
        {m.who === "tool" ? <Wrench size={14} className="mt-1 shrink-0 text-ai" /> : <Store size={14} className="mt-1 shrink-0 text-ok" />}
        <code className={`min-w-0 whitespace-pre-wrap break-all rounded-lg px-2.5 py-1.5 font-mono ${m.who === "tool" ? "bg-ai-2 text-ai" : "bg-[#e7f6ee] text-ok"}`}>{m.who === "tool" ? `→ 窓口へ：${m.text}` : `← 窓口から：${m.text}`}</code>
      </div>
    );
  };

  return (
    <>
      <Title n="2" title="AIが予約できる" lead={<>これからは、お客様の代わりに<b className="text-ink">AIが空きを確かめて、予約までする</b>ようになります。お店の空き状況とメニューを、AIが直接読み書きできる「AI予約窓口」として公開します（MCPという、AIとつなぐ共通の仕組みを使います）。</>} />

      <section className={`card flex flex-col gap-4 p-5 sm:flex-row sm:items-center ${s.windowOn ? "border-ok/50" : ""}`}>
        <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${s.windowOn ? "bg-ok text-white" : "bg-paper text-sub"}`}><Plug size={24} /></span>
        <div className="min-w-0 flex-1"><b className="text-[1.1rem]">AI予約窓口：{s.windowOn ? <span className="text-ok">公開中</span> : <span className="text-sub">非公開</span>}</b>
          <p className="text-[0.9rem] text-sub">{s.windowOn ? "ChatGPT・Gemini・Claude などのAIが、空きの確認と予約をできます。" : "公開すると、AIに聞いたお客様がそのまま予約できるようになります。"}</p></div>
        <button type="button" onClick={() => update((x) => ({ ...x, windowOn: !x.windowOn, applied: !x.windowOn && !x.applied.includes("today") ? [...x.applied, "today"] : x.applied }))} className={`btn shrink-0 ${s.windowOn ? "btn-line" : "btn-ai"}`}>{s.windowOn ? "非公開にする" : "公開する"}</button>
      </section>

      <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        <section className="card flex min-w-0 flex-col overflow-hidden" aria-labelledby="sim">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-5 py-3">
            <h2 id="sim" className="flex items-center gap-2 text-[1.05rem] font-bold"><User size={18} />お客様がAIに頼むと…（再現）</h2>
            <select value={agent} onChange={(e) => setAgent(e.target.value)} className="field w-auto min-h-[2.3rem] py-1 text-[0.85rem]" aria-label="お客様が使うAI">{["ChatGPT", "Gemini", "Claude"].map((a) => <option key={a}>{a}</option>)}</select>
          </div>
          <div className="min-h-[340px] flex-1 space-y-2.5 bg-paper p-4" aria-live="polite">
            {log.length === 0 && <p className="py-10 text-center text-[0.9rem] text-sub">下のボタンを押すか、お客様になったつもりで入力してください。<br />窓口を{s.windowOn ? "公開しているので、AIが予約まで進めます" : "公開していないときと、したときで、AIの答えがどう変わるかを見てください"}。</p>}
            {log.map(bubble)}
            <div ref={end} />
          </div>
          <div className="border-t border-line p-3">
            <div className="flex flex-wrap gap-1.5">{SCENES.map((q) => <button key={q} type="button" disabled={busy} onClick={() => run(q)} className="chip bg-ai-2 py-1.5 text-ai hover:bg-[#e2d9ff]">{q}</button>)}</div>
            <form className="mt-2 flex gap-2" onSubmit={(e) => { e.preventDefault(); run(text); }}>
              <input value={text} onChange={(e) => setText(e.target.value)} placeholder={`${agent}に話しかける（例：金曜の20時あいてる？）`} className="field" />
              <button type="submit" disabled={busy || !text.trim()} className="btn btn-ink px-3" aria-label="送る"><Send size={18} /></button>
            </form>
            {log.length > 0 && <button type="button" onClick={() => setLog([])} className="mt-2 text-[0.8rem] text-sub underline">会話を消す</button>}
          </div>
        </section>

        <div className="space-y-5">
          <section className="card p-5" aria-labelledby="bk">
            <h2 id="bk" className="flex items-center gap-2 text-[1.05rem] font-bold"><CalendarCheck size={18} className="text-ok" />AIからの予約（{s.bookings.length}件）</h2>
            <ul className="mt-3 space-y-2">
              {s.bookings.slice(0, 6).map((b) => <li key={b.id} className="rounded-xl bg-paper px-3 py-2 text-[0.88rem]"><b>{dayLabel(b.day)} {b.hour}:00</b>　{b.menu}<span className="block text-[0.78rem] text-sub">{b.via} 経由・{b.who}・{b.at}</span></li>)}
              {!s.bookings.length && <li className="text-[0.88rem] text-sub">まだありません</li>}
            </ul>
          </section>
          <section className="card p-5" aria-labelledby="pub">
            <h2 id="pub" className="text-[1.05rem] font-bold">AIに渡している情報</h2>
            <p className="mt-1 text-[0.82rem] text-sub">お客様の名前や電話番号は、予約のときだけ受け取ります。</p>
            <pre className="mt-3 max-h-[300px] overflow-auto rounded-xl bg-ink p-3 text-[0.72rem] leading-[1.6] text-[#d7d3ff]">{JSON.stringify(info, null, 2)}</pre>
          </section>
        </div>
      </div>
      <div className="mt-8"><Link href="/akiwaku/" className="btn btn-ai">次は「空きを自動で埋める」<ArrowRight size={18} /></Link></div>
    </>
  );
}

export default function Page() { return <Shell><Ready><Yoyaku /></Ready></Shell>; }
