"use client";

import Link from "next/link";
import qrcode from "qrcode-generator";
import { ArrowRight, Handshake, QrCode, Sparkles } from "lucide-react";
import Shell, { Title } from "@/components/Shell";
import Ready from "@/components/Ready";
import { toast } from "@/components/Confirm";
import { ME_POS, PARTNERS, SHOP } from "@/lib/demo";
import { update, useStore } from "@/lib/store";

const FEE = 500; // 紹介1人あたりのお礼（デモ）

function Qr({ text }: { text: string }) {
  const q = qrcode(0, "M"); q.addData(text); q.make();
  const n = q.getModuleCount(), cells: string[] = [];
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (q.isDark(r, c)) cells.push(`M${c},${r}h1v1h-1z`);
  return <svg viewBox={`-2 -2 ${n + 4} ${n + 4}`} className="h-full w-full" role="img" aria-label="紹介用のQRコード"><rect x="-2" y="-2" width={n + 4} height={n + 4} fill="#fff" /><path d={cells.join("")} fill="#0e0f1a" /></svg>;
}

function Machi() {
  const s = useStore();
  const st = (id: string, def: string) => (s.partners[id] ?? def) as "on" | "ask" | "suggest" | "no";
  const list = PARTNERS.map((p) => ({ ...p, st: st(p.id, p.status) }));
  const on = list.filter((p) => p.st === "on");
  const inN = on.reduce((a, p) => a + p.inN, 0), outN = on.reduce((a, p) => a + p.outN, 0);
  const set = (id: string, v: "on" | "ask" | "suggest" | "no", msg: string) => { update((x) => ({ ...x, partners: { ...x.partners, [id]: v } })); toast(msg); };
  const refUrl = "https://knotscheme.github.io/sakuapp/works/tsurete/?ref=komorebi";

  return (
    <>
      <Title n="4" title="街ぐるみで送り合う" lead={<>1軒だけでは届かないお客様に、<b className="text-ink">近所のお店の常連さん</b>から届けます。競合しない近所のお店どうしを、お客様の年代・来る時間帯・悩みの相性からAIが組み合わせ、お互いにお客様を紹介し合います。だれがだれを連れてきたかは、QRで自動で記録します。</>} />

      <div className="grid gap-3 sm:grid-cols-3">
        {[{ l: "提携しているお店", v: `${on.length}店` }, { l: "今月、紹介で来たお客様", v: `${inN}人` }, { l: "今月、こちらから紹介した人", v: `${outN}人` }].map((k) => <div key={k.l} className="card p-5"><p className="text-[0.85rem] text-sub">{k.l}</p><p className="num mt-1 text-[1.9rem] font-bold">{k.v}</p></div>)}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.1fr_1fr]">
        <section className="card overflow-hidden p-0" aria-labelledby="mp">
          <h2 id="mp" className="px-5 pt-4 text-[1.05rem] font-bold">みなと台の地図（イメージ）</h2>
          <svg viewBox="0 0 100 100" className="block w-full" role="img" aria-label="近所の提携店の地図">
            <rect width="100" height="100" fill="#08111f" />
            {[18, 46, 74].map((y) => <rect key={`h${y}`} x="0" y={y} width="100" height="4" fill="#14213a" />)}
            {[14, 44, 66, 90].map((x) => <rect key={`v${x}`} x={x} y="0" width="4" height="100" fill="#14213a" />)}
            <rect x="0" y="58" width="100" height="1.4" fill="#1f3a5a" /><text x="2" y="57" fontSize="2.6" fill="#5f7090">みなと台駅前通り</text>
            {list.map((p) => p.st === "on" && <line key={`l${p.id}`} x1={ME_POS.x} y1={ME_POS.y} x2={p.x} y2={p.y} stroke="#10d9a0" strokeWidth={0.4 + (p.inN + p.outN) / 10} strokeOpacity=".55" strokeDasharray="1.5 1" />)}
            {list.map((p) => (
              <g key={p.id}>
                <circle cx={p.x} cy={p.y} r="4.2" fill={p.st === "on" ? "#10d9a0" : p.st === "ask" ? "#f2b84b" : "#0b1426"} stroke={p.st === "suggest" ? "#10d9a0" : "#060b18"} strokeWidth="0.8" strokeDasharray={p.st === "suggest" ? "1 0.8" : ""} />
                <text x={p.x} y={p.y + 8} fontSize="2.8" textAnchor="middle" fill="#c9d6ea" fontWeight="700">{p.name}</text>
              </g>
            ))}
            <circle cx={ME_POS.x} cy={ME_POS.y} r="6" fill="#3ff2c4" stroke="#060b18" strokeWidth="0.8" />
            <text x={ME_POS.x} y={ME_POS.y + 1} fontSize="2.8" textAnchor="middle" fontWeight="700" fill="#03140f">そよかぜ</text>
          </svg>
          <p className="flex flex-wrap gap-3 px-5 py-3 text-[0.78rem] text-sub"><span className="flex items-center gap-1"><i className="h-3 w-3 rounded-full bg-ai" />提携中</span><span className="flex items-center gap-1"><i className="h-3 w-3 rounded-full bg-warn" />お願い中</span><span className="flex items-center gap-1"><i className="h-3 w-3 rounded-full border border-dashed border-ai" />AIのおすすめ</span><span>線の太さ＝紹介の多さ</span></p>
        </section>

        <section className="card p-5" aria-labelledby="qr">
          <h2 id="qr" className="flex items-center gap-2 text-[1.05rem] font-bold"><QrCode size={20} className="text-ai" />紹介カード（お店に置くQR）</h2>
          <p className="mt-1 text-[0.88rem] text-sub">提携店のレジ横に置いてもらいます。読み取ると「こもれび珈琲からの紹介」として記録され、初回の特典が出ます。</p>
          <div className="mt-4 flex items-center gap-4 rounded-2xl border border-line p-4">
            <div className="h-32 w-32 shrink-0"><Qr text={refUrl} /></div>
            <div className="text-[0.88rem] leading-[1.75]"><b className="block text-[1rem]">こもれび珈琲のお客様へ</b>{SHOP.name}の初回が<b className="text-ai">500円引き</b>になります。<span className="block text-[0.78rem] text-sub">徒歩2分・{SHOP.hours}</span></div>
          </div>
          <h3 className="mt-5 text-[0.95rem] font-bold">今月の精算（紹介1人 {FEE}円のお礼）</h3>
          <table className="mt-2 w-full text-[0.85rem]">
            <thead className="text-left text-[0.78rem] text-sub"><tr><th className="py-1 font-medium">お店</th><th className="py-1 text-right font-medium">来た</th><th className="py-1 text-right font-medium">送った</th><th className="py-1 text-right font-medium">差し引き</th></tr></thead>
            <tbody className="divide-y divide-line">{on.map((p) => { const d = (p.outN - p.inN) * FEE; return <tr key={p.id}><td className="py-1.5">{p.name}</td><td className="num py-1.5 text-right">{p.inN}人</td><td className="num py-1.5 text-right">{p.outN}人</td><td className={`num py-1.5 text-right ${d >= 0 ? "text-ok" : "text-warn"}`}>{d >= 0 ? "+" : ""}{d.toLocaleString()}円</td></tr>; })}</tbody>
          </table>
          <p className="mt-2 text-[0.75rem] text-sub">※差し引きは月末に自動で計算し、提携店どうしで確認します（デモ）。</p>
        </section>
      </div>

      <section className="mt-6" aria-labelledby="pt">
        <h2 id="pt" className="flex items-center gap-2 text-[1.25rem] font-bold"><Sparkles size={20} className="text-ai" />相性のいい近所のお店（AIが見つけました）</h2>
        <ul className="mt-3 grid gap-3 md:grid-cols-2">
          {list.sort((a, b) => b.match - a.match).map((p) => (
            <li key={p.id} className="card flex flex-col p-5">
              <div className="flex items-start justify-between gap-2">
                <div><b className="text-[1.05rem]">{p.name}</b><p className="text-[0.82rem] text-sub">{p.kind}</p></div>
                <span className="num text-right"><b className="block text-[1.5rem] leading-none text-ai">{p.match}</b><span className="text-[0.7rem] text-sub">相性</span></span>
              </div>
              <p className="mt-2 flex-1 text-[0.88rem] leading-[1.8]">{p.why}</p>
              {p.st === "on" && <p className="mt-3 flex items-center gap-2 text-[0.88rem] font-bold text-ok"><Handshake size={18} />提携中・今月 来た{p.inN}人／送った{p.outN}人</p>}
              {p.st === "ask" && <p className="mt-3 text-[0.88rem] font-bold text-warn">お願いを送りました（返事待ち）</p>}
              {p.st === "suggest" && <div className="mt-3 flex gap-2"><button type="button" onClick={() => set(p.id, "ask", `${p.name}に提携のお願いを送りました（デモ）`)} className="btn btn-ai flex-1">提携をお願いする</button><button type="button" onClick={() => set(p.id, "no", "候補から外しました")} className="btn btn-line">見送る</button></div>}
              {p.st === "no" && <p className="mt-3 text-[0.85rem] text-sub">見送りました <button type="button" className="underline" onClick={() => set(p.id, "suggest", "候補に戻しました")}>もとに戻す</button></p>}
            </li>
          ))}
        </ul>
      </section>
      <div className="mt-8"><Link href="/" className="btn btn-ai">概要にもどる<ArrowRight size={18} /></Link></div>
    </>
  );
}

export default function Page() { return <Shell><Ready><Machi /></Ready></Shell>; }
