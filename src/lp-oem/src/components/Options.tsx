"use client";

import { useState } from "react";
import { Gift, Layers, PenTool } from "lucide-react";
import SectionTitle from "./SectionTitle";
import WalletArt from "./WalletArt";

type Finish = "plain" | "gold" | "silver";
const FINISHES: { id: Finish; name: string; en: string; body: string; swatch: string }[] = [
  { id: "plain", name: "素押し", en: "BLIND", body: "熱と圧で革そのものに刻む、控えめで上品な仕上げ。使うほどに馴染みます。", swatch: "linear-gradient(135deg,#4a3326,#2b1d16)" },
  { id: "gold", name: "金箔押し", en: "GOLD FOIL", body: "真鍮色の箔で、ロゴを華やかに。ギフト向けブランドに最も選ばれています。", swatch: "linear-gradient(135deg,#8d6a10,#e8cf8c,#b8860b)" },
  { id: "silver", name: "銀箔押し", en: "SILVER FOIL", body: "シャープで洗練された印象に。ネイビーやブラックの革と相性抜群です。", swatch: "linear-gradient(135deg,#8f949a,#f1f3f5,#a5aab0)" },
];

export default function Options() {
  const [f, setF] = useState<Finish>("gold");
  const cur = FINISHES.find((x) => x.id === f)!;
  return (
    <section className="bg-paper py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <SectionTitle en="Logo Finish" ja="ロゴ加工の種類" sub="加工ひとつで、|印象は大きく|変わります。" />

        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="reveal-l relative mx-auto w-full max-w-md">
            <div className="absolute inset-[10%] rounded-full bg-gold-2/15 blur-3xl" />
            <div key={f} className="stamp-in relative">
              <WalletArt id="bifold" color={f === "silver" ? "#1c2230" : "#2b1d16"} logo={f} className="w-full" />
              {f !== "plain" && <span className="foil-sweep" aria-hidden />}
            </div>
          </div>

          <div className="reveal-r">
            <div className="grid grid-cols-3 gap-3" role="tablist" aria-label="ロゴ加工の種類">
              {FINISHES.map((x) => (
                <button
                  key={x.id}
                  role="tab"
                  aria-selected={f === x.id}
                  onClick={() => setF(x.id)}
                  className={`rounded-2xl border p-4 text-left transition ${f === x.id ? "border-gold bg-white shadow-[0_16px_40px_-26px_rgba(0,0,0,.45)]" : "border-line bg-white/60 hover:border-gold-2"}`}
                >
                  <span className="block h-8 w-8 rounded-full ring-1 ring-black/10" style={{ background: x.swatch }} />
                  <span className="mt-3 block font-display text-[10.5px] tracking-[0.2em] text-gold">{x.en}</span>
                  <span className="block text-[15px] font-bold">{x.name}</span>
                </button>
              ))}
            </div>
            <p key={cur.id} className="fade-up mt-6 min-h-[3.5em] text-[15px] leading-loose text-ink-2">{cur.body}</p>

            <div className="mt-6 flex items-start gap-4 rounded-2xl border border-line bg-white p-5">
              <Gift className="mt-0.5 shrink-0 text-gold" size={26} strokeWidth={1.4} />
              <div>
                <p className="font-bold">オプション：オリジナル化粧箱</p>
                <p className="mt-1 text-[13.5px] leading-relaxed text-mute">ロゴ入りの貼り箱・スリーブで、開けた瞬間からブランドの世界観を。ギフト販売にもおすすめです。</p>
              </div>
            </div>
          </div>
        </div>

        <aside className="reveal mx-auto mt-16 max-w-3xl rounded-2xl border border-dashed border-gold-2/60 bg-[#fbf8f1] p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-gold ring-1 ring-gold-2/40">
              <Layers size={20} strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-[13px] font-bold text-gold">【特別対応】</p>
              <p className="mt-1 text-[16px] font-bold">完全オリジナル設計（ODM）も対応</p>
              <p className="mt-3 text-[13.5px] leading-loose text-mute">
                ポケット配置の変更や、完全オリジナルの型作成も可能です（※別途、型代・設計費が発生します）。
                <br />
                まずは手軽なロゴ入れOEMから始められるお客様が9割です。
              </p>
              <a href="#contact" className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-bold text-ink underline decoration-gold-2 underline-offset-4">
                <PenTool size={14} /> ODMについて相談する
              </a>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
