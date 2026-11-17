"use client";

import Link from "next/link";
import { ArrowRight, Check, Cloud, CloudRain, MapPin, MessageCircle, Send, Sun, Zap } from "lucide-react";
import Shell, { Title } from "@/components/Shell";
import Ready from "@/components/Ready";
import { toast } from "@/components/Confirm";
import { DAYS, HOURS, SHOP, WEATHER, baseBooked, dayLabel, forecast, hash } from "@/lib/demo";
import { update, useStore } from "@/lib/store";
import { useState } from "react";

const WI = { sun: Sun, cloud: Cloud, rain: CloudRain };
const LOW = 45; // これより埋まりにくい枠を「埋めたい枠」にする

// 埋めたい枠を、日ごとのかたまりにまとめる
function blocks(isBooked: (d: string, h: number) => boolean) {
  const out: { key: string; day: string; from: number; to: number; slots: number; f: number }[] = [];
  for (const d of DAYS) {
    let cur: number[] = [];
    const flush = () => { if (cur.length) { out.push({ key: `${d}-${cur[0]}`, day: d, from: cur[0], to: cur[cur.length - 1] + 1, slots: cur.length, f: Math.round(cur.reduce((a, h) => a + forecast(d, h), 0) / cur.length) }); cur = []; } };
    for (const h of HOURS) { if (!isBooked(d, h) && forecast(d, h) < LOW) cur.push(h); else flush(); }
    flush();
  }
  return out;
}
function message(b: { day: string; from: number; to: number }) {
  const w = WEATHER[b.day];
  const rain = w?.icon === "rain";
  const when = b.day === DAYS[0] ? "今日" : b.day === DAYS[1] ? "明日" : dayLabel(b.day);
  return {
    perk: rain ? "雨の日だけ 500円引き" : b.from >= 13 && b.to <= 17 ? "お昼すぎ限定 肩・首10分延長" : "",
    text: `${rain ? "雨の日は体が冷えて、肩や腰が固まりやすい日。" : ""}${when} ${b.from}時〜${b.to}時に空きがあります。${SHOP.name}（${SHOP.area}徒歩3分）で、ゆっくりほぐしませんか。`,
  };
}

function Akiwaku() {
  const s = useStore();
  const isBooked = (d: string, h: number) => baseBooked(d, h) || s.bookings.some((b) => b.day === d && b.hour === h);
  const bl = blocks(isBooked);
  const [all, setAll] = useState(false);
  // 空きが多くて埋まりにくい順に並べ、はじめは6つだけ出す
  const shown = [...bl].sort((a, b) => b.slots * (100 - b.f) - a.slots * (100 - a.f)).slice(0, all ? bl.length : 6);
  const cells = DAYS.flatMap((d) => HOURS.map((h) => ({ d, h })));
  const free = cells.filter((c) => !isBooked(c.d, c.h)).length;
  const fill = (b: (typeof bl)[number]) => Math.max(1, Math.round(b.slots * (0.45 + hash(b.key) * 0.3)));
  const stOf = (k: string) => s.campaigns[k] ?? (s.autoMode === "auto" ? "sent" : "pending");
  const sent = bl.filter((b) => stOf(b.key) === "sent");
  const filled = sent.reduce((a, b) => a + fill(b), 0);
  const setC = (k: string, v: "sent" | "skip") => { update((x) => ({ ...x, campaigns: { ...x.campaigns, [k]: v } })); if (v === "sent") toast("呼びかけを出しました（デモ）"); };
  const color = (p: number) => (p >= 75 ? "bg-ai/40" : p >= 55 ? "bg-ai/22" : p >= LOW ? "bg-ai/8" : "bg-warn/15");

  return (
    <>
      <Title n="3" title="空きを自動で埋める" lead={<>曜日・時間・天気・近所の行事と、これまでの混み方から、<b className="text-ink">この先1週間の「空きそうな時間」</b>を予測します。いつも同じ投稿を出すのではなく、<b className="text-ink">埋めたい時間だけを狙って</b>近所の人に呼びかけます。</>} />

      <div className="grid gap-3 sm:grid-cols-3">
        {[{ l: "この1週間の空き", v: `${free}枠`, n: "予約が入っていない枠" }, { l: "埋めたい時間のかたまり", v: `${bl.length}つ`, n: `埋まる予測が${LOW}%未満` }, { l: "呼びかけで埋まる見込み", v: `${filled}枠`, n: `売上 +${(filled * 6600).toLocaleString()}円の見込み` }].map((k) => (
          <div key={k.l} className="card p-5"><p className="text-[0.85rem] text-sub">{k.l}</p><p className="num mt-1 text-[1.9rem] font-bold">{k.v}</p><p className="text-[0.8rem] text-sub">{k.n}</p></div>
        ))}
      </div>

      <section className="card mt-5 p-4 sm:p-5" aria-labelledby="hm">
        <div className="flex flex-wrap items-center justify-between gap-2"><h2 id="hm" className="text-[1.05rem] font-bold">埋まり具合の予測（1週間）</h2>
          <p className="flex flex-wrap gap-3 text-[0.78rem] text-sub"><span className="flex items-center gap-1"><i className="h-3 w-3 rounded bg-deep" />予約あり</span><span className="flex items-center gap-1"><i className="h-3 w-3 rounded bg-ai/40" />混みそう</span><span className="flex items-center gap-1"><i className="h-3 w-3 rounded bg-warn/15 ring-1 ring-warn" />埋めたい</span></p></div>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[620px] border-separate border-spacing-1 text-center text-[0.75rem]">
            <thead><tr><th className="w-12" />{DAYS.map((d) => { const W = WI[WEATHER[d].icon]; return <th key={d} className="font-medium"><span className="block text-[0.8rem]">{dayLabel(d)}</span><span className="flex items-center justify-center gap-1 text-sub"><W size={13} />{WEATHER[d].w}</span></th>; })}</tr></thead>
            <tbody>
              {HOURS.map((h) => (
                <tr key={h}><th className="num pr-1 text-right font-medium text-sub">{h}:00</th>
                  {DAYS.map((d) => { const b = isBooked(d, h), p = forecast(d, h), low = !b && p < LOW; return <td key={d} className={`h-8 rounded-md ${b ? "bg-deep text-sub" : color(p)} ${low ? "ring-1 ring-warn" : ""}`} title={`${dayLabel(d)} ${h}時：${b ? "予約あり" : `埋まる予測 ${p}%`}`}>{b ? "予約" : `${p}%`}</td>; })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-[0.78rem] text-sub">※11月21日（土）の午後は、近所の商店街のイベントで人通りが増える予測です。数字は模擬の結果です。</p>
      </section>

      <section className="mt-6" aria-labelledby="cp">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id="cp" className="flex items-center gap-2 text-[1.25rem] font-bold"><Zap size={22} className="text-ai" />埋めたい時間への呼びかけ</h2>
          <div className="flex rounded-xl border border-line bg-panel p-1" role="group" aria-label="出し方">
            {([["approve", "承認してから出す"], ["auto", "自動で出す"]] as const).map(([v, l]) => <button key={v} type="button" aria-pressed={s.autoMode === v} onClick={() => update((x) => ({ ...x, autoMode: v }))} className={`rounded-lg px-3 py-1.5 text-[0.85rem] font-bold ${s.autoMode === v ? "bg-ai text-[#03140f]" : "text-sub"}`}>{l}</button>)}
          </div>
        </div>
        <p className="mt-1 text-[0.9rem] text-sub">{s.autoMode === "auto" ? "埋めたい時間の前の日の夕方に、自動で出します（同じ人には週に1回まで）。" : "AIが文章と出し先を用意します。「出す」を押したものだけを出します。"}</p>
        <ul className="mt-3 grid gap-3 md:grid-cols-2">
          {shown.map((b) => {
            const m = message(b), st = stOf(b.key);
            return (
              <li key={b.key} className={`card flex flex-col p-5 ${st === "sent" ? "border-ok/50" : st === "skip" ? "opacity-55" : ""}`}>
                <div className="flex items-start justify-between gap-2">
                  <div><b className="text-[1.05rem]">{dayLabel(b.day)} {b.from}:00〜{b.to}:00</b><p className="text-[0.82rem] text-sub">空き {b.slots}枠・埋まる予測 {b.f}%・{WEATHER[b.day].w}</p></div>
                  {st === "sent" && <span className="chip bg-ok text-[#03140f]"><Check size={13} />出しました</span>}
                </div>
                <div className="mt-3 rounded-2xl bg-paper p-3">
                  <p className="text-[0.9rem] leading-[1.75]">{m.text}</p>
                  {m.perk && <p className="mt-2"><span className="chip bg-warn/15 text-warn">{m.perk}</span></p>}
                </div>
                <p className="mt-2 flex flex-wrap gap-1.5 text-[0.75rem]">
                  <span className="chip bg-ai-2 text-ai"><MapPin size={12} />Googleマップの投稿</span>
                  <span className="chip bg-ai-2 text-ai"><MessageCircle size={12} />LINE（近所の友だち）</span>
                  <span className="chip bg-ai-2 text-ai">Instagramストーリー</span>
                  <span className="chip bg-ai-2 text-ai">AI予約窓口に「空きあり」</span>
                </p>
                <p className="mt-2 text-[0.85rem]">見込み：<b>{fill(b)}枠</b>うまる</p>
                {st === "pending" && <div className="mt-3 flex gap-2"><button type="button" onClick={() => setC(b.key, "sent")} className="btn btn-ai flex-1"><Send size={16} />出す</button><button type="button" onClick={() => setC(b.key, "skip")} className="btn btn-line">出さない</button></div>}
              </li>
            );
          })}
        </ul>
        {bl.length > 6 && <button type="button" onClick={() => setAll(!all)} className="btn btn-line mt-3 w-full">{all ? "はじめの6つだけにする" : `ほかの${bl.length - 6}つも見る`}</button>}
      </section>
      <div className="mt-8"><Link href="/machi/" className="btn btn-ai">次は「街ぐるみで送り合う」<ArrowRight size={18} /></Link></div>
    </>
  );
}

export default function Page() { return <Shell><Ready><Akiwaku /></Ready></Shell>; }
