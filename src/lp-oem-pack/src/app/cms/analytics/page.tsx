"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { STAGES, amounts, modelOf } from "@/lib/cms";
import { useDeals } from "@/components/cms/store";
import { downloadCsv } from "@/components/cms/csv";
import { ALL_MODELS } from "@/lib/models";
import { useAuth } from "@/components/cms/perm";
import { Card, CardHead, NoAccess, Shell, TechNote } from "@/components/cms/ui";

// アナリティクス（デモ用の架空の数字。月ごとの数字は毎回同じになるよう計算で作る）
const wave = (i: number, k: number) => Math.sin(i * 1.7 + k) * 0.5 + 0.5;
function months(n: number) {
  const now = new Date();
  return Array.from({ length: n }, (_, k) => {
    const i = 12 - n + k; // 12か月の中の位置（古い→新しい）
    const d = new Date(now.getFullYear(), now.getMonth() - (n - 1 - k), 1);
    const inquiries = Math.round(14 + i * 1.5 + wave(i, 1) * 8);
    const quotes = Math.round(inquiries * (0.62 + wave(i, 2) * 0.12));
    const orders = Math.round(quotes * (0.42 + wave(i, 3) * 0.14));
    const delivered = Math.max(0, orders - Math.round(wave(i, 4) * 2));
    const sales = orders * Math.round(380000 + wave(i, 5) * 260000);
    return { ym: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`, label: `${d.getMonth() + 1}月`, inquiries, quotes, orders, delivered, sales, defect: 0.8 + wave(i, 6) * 1.6, onTime: 88 + wave(i, 7) * 10 };
  });
}
type Order = "desc" | "asc" | "sales" | "orders";
const ORDERS: { id: Order; ja: string }[] = [
  { id: "desc", ja: "新しい順" },
  { id: "asc", ja: "古い順" },
  { id: "sales", ja: "売上（金額）の多い順" },
  { id: "orders", ja: "受注件数（数量）の多い順" },
];
function sortRows<T>(arr: T[], order: Order, date: (x: T) => string, money: (x: T) => number, count: (x: T) => number) {
  return [...arr].sort((a, b) => {
    if (order === "sales") return money(b) - money(a);
    if (order === "orders") return count(b) - count(a) || money(b) - money(a);
    const c = date(a) < date(b) ? -1 : date(a) > date(b) ? 1 : 0;
    return order === "asc" ? c : -c;
  });
}
const man = (n: number) => (n >= 10000 ? `${(n / 10000).toLocaleString("ja-JP", { maximumFractionDigits: 0 })}万円` : `${n.toLocaleString()}円`);

// 縦棒：1つの数字の月ごとの変化（色は1色。最新の月だけ濃く）
function Bars({ data, fmt }: { data: { label: string; v: number }[]; fmt: (n: number) => string }) {
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(...data.map((d) => d.v)) * 1.1;
  const ticks = [0, 0.5, 1].map((t) => max * t);
  return (
    <div className="relative px-5 pt-2 pb-5">
      <div className="relative h-52">
        {ticks.map((t, k) => (
          <div key={k} className="absolute inset-x-0 border-t border-line" style={{ bottom: `${(t / max) * 100}%` }}>
            <span className="absolute -top-2.5 left-0 bg-white pr-1 text-[10.5px] text-mute">{k ? fmt(t) : ""}</span>
          </div>
        ))}
        <div className="absolute inset-0 flex items-end gap-[2px] pl-12">
          {data.map((d, i) => (
            <button key={d.label} type="button" onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} onFocus={() => setHover(i)} onBlur={() => setHover(null)} onClick={() => setHover(hover === i ? null : i)}
              className="group relative flex h-full flex-1 items-end justify-center" aria-label={`${d.label}：${fmt(d.v)}`}>
              <span className={`block w-full max-w-9 rounded-t-[4px] transition ${i === data.length - 1 ? "bg-ink" : hover === i ? "bg-ink/70" : "bg-ink/25"}`} style={{ height: `${(d.v / max) * 100}%` }} />
              {hover === i && (
                <span className="pointer-events-none absolute z-10 rounded-md bg-ink px-2.5 py-1.5 text-[11.5px] whitespace-nowrap text-white shadow" style={{ bottom: `calc(${(d.v / max) * 100}% + 8px)` }}>
                  {d.label}　<b className="font-semibold">{fmt(d.v)}</b>
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-2 flex gap-[2px] pl-12 text-[10.5px] text-mute">
        {data.map((d, i) => <span key={d.label} className="flex-1 text-center">{data.length > 6 && i % 2 ? "" : d.label}</span>)}
      </div>
    </div>
  );
}

// 横棒：項目ごとの大きさ（大きい順）
function HBars({ rows, fmt }: { rows: { label: string; v: number }[]; fmt: (n: number) => string }) {
  const max = Math.max(...rows.map((r) => r.v));
  return (
    <ul className="space-y-3 px-5 pt-2 pb-5">
      {rows.map((r) => (
        <li key={r.label} title={`${r.label}：${fmt(r.v)}`}>
          <div className="flex items-baseline justify-between text-[12.5px]"><span>{r.label}</span><span className="tabular-nums text-ink/80">{fmt(r.v)}</span></div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[#f1f1f0]"><div className="h-full rounded-full bg-ink/80" style={{ width: `${(r.v / max) * 100}%` }} /></div>
        </li>
      ))}
    </ul>
  );
}

export default function Analytics() {
  const { can } = useAuth();
  const all = months(12);
  const [from, setFrom] = useState(all[6].ym);
  const [to, setTo] = useState(all[11].ym);
  const [order, setOrder] = useState<Order>("desc");
  const [table, setTable] = useState(false);
  const deals = useDeals();
  if (!can("analytics.view")) return <Shell title="アナリティクス"><NoAccess /></Shell>;

  const [lo, hi] = from <= to ? [from, to] : [to, from];
  const m = all.filter((x) => x.ym >= lo && x.ym <= hi); // グラフは月の順
  const sorted = sortRows(m, order, (x) => x.ym, (x) => x.sales, (x) => x.orders); // 表とCSVは並び順どおり
  const preset = all.length - all.findIndex((x) => x.ym === lo);
  const isPreset = hi === all[11].ym && [3, 6, 12].includes(preset) ? preset : 0;
  const sum = (k: "inquiries" | "quotes" | "orders" | "delivered" | "sales") => m.reduce((s, x) => s + x[k], 0);
  const showMoney = can("money.view");
  const kpis = [
    { k: "売上", v: showMoney ? man(sum("sales")) : "—" },
    { k: "受注件数", v: `${sum("orders")}件` },
    { k: "成約率（問い合わせ→受注）", v: `${((sum("orders") / sum("inquiries")) * 100).toFixed(1)}%` },
    { k: "平均受注額", v: showMoney ? man(sum("sales") / sum("orders")) : "—" },
    { k: "不良率", v: `${(m.reduce((s, x) => s + x.defect, 0) / m.length).toFixed(1)}%` },
    { k: "納期どおりの出荷", v: `${(m.reduce((s, x) => s + x.onTime, 0) / m.length).toFixed(0)}%` },
  ];
  const funnel = [
    { label: "問い合わせ", v: sum("inquiries") },
    { label: "見積を送付", v: sum("quotes") },
    { label: "受注", v: sum("orders") },
    { label: "納品完了", v: sum("delivered") },
  ];
  const share = [0.27, 0.18, 0.15, 0.08, 0.2, 0.12];
  const byModel = ALL_MODELS.map((x, i) => ({ label: x.short, v: Math.round(sum("sales") * share[i]) })).sort((a, b) => b.v - a.v);
  const sources = [
    { label: "利益シミュレーターから", v: 0.34 },
    { label: "製品一覧から", v: 0.26 },
    { label: "ロゴの試し押しから", v: 0.21 },
    { label: "フォームに直接", v: 0.19 },
  ].map((s) => ({ ...s, v: Math.round(sum("inquiries") * s.v) }));
  const lead = [
    { label: "問い合わせ→見積送付", v: 1.4 },
    { label: "見積→受注", v: 5.8 },
    { label: "ロゴ配置の確認", v: 2.6 },
    { label: "製造", v: 18.2 },
    { label: "タイ→日本の輸送", v: 6.1 },
    { label: "検品→発送", v: 1.8 },
  ];

  const ymLabel = (ym: string) => `${ym.slice(0, 4)}年${Number(ym.slice(5))}月`;
  const periodText = `${ymLabel(lo)}〜${ymLabel(hi)}（${m.length}か月）・${ORDERS.find((o) => o.id === order)!.ja}`;
  const csvBox = <CsvBox canMoney={showMoney} canCustomer={can("customer.view")} deals={deals} monthly={sorted} lo={lo} hi={hi} order={order} periodText={periodText} />;
  const sel = "w-full rounded-lg border border-line bg-white px-3 py-2 text-[13px] outline-none focus:border-ink";
  const filter = (
    <Card className="mb-5 px-5 py-4">
      <div className="flex flex-wrap items-end gap-x-4 gap-y-3 text-[12px]">
        <div className="flex w-full flex-col gap-1.5 sm:w-auto"><span className="text-mute">期間</span>
          <div className="flex overflow-hidden rounded-lg border border-line bg-white text-[12.5px]">
            {[3, 6, 12].map((x) => <button key={x} type="button" onClick={() => { setFrom(all[12 - x].ym); setTo(all[11].ym); }} className={`flex-1 px-3.5 py-2 whitespace-nowrap ${isPreset === x ? "bg-ink text-white" : "text-mute"}`}>直近{x}か月</button>)}
          </div>
        </div>
        <div className="flex w-full items-end gap-2 sm:w-auto">
          <label className="flex flex-1 flex-col gap-1.5"><span className="text-mute">開始月</span>
            <select value={from} onChange={(e) => setFrom(e.target.value)} className={sel}>{all.map((x) => <option key={x.ym} value={x.ym}>{ymLabel(x.ym)}</option>)}</select>
          </label>
          <span className="pb-2.5 text-mute">〜</span>
          <label className="flex flex-1 flex-col gap-1.5"><span className="text-mute">終了月</span>
            <select value={to} onChange={(e) => setTo(e.target.value)} className={sel}>{all.map((x) => <option key={x.ym} value={x.ym}>{ymLabel(x.ym)}</option>)}</select>
          </label>
        </div>
        <label className="flex w-full flex-col gap-1.5 sm:w-auto"><span className="text-mute">並び順</span>
          <select value={order} onChange={(e) => setOrder(e.target.value as Order)} className={sel}>
            {ORDERS.filter((o) => showMoney || o.id !== "sales").map((o) => <option key={o.id} value={o.id}>{o.ja}</option>)}
          </select>
        </label>
      </div>
      <p className="mt-3 text-[11.5px] text-mute">この条件で、下のすべての数字・グラフ・表・CSVが表示されます（グラフは月の順）</p>
    </Card>
  );

  return (
    <Shell title="アナリティクス" note="案件・検品のデータを Supabase の集計用ビュー（SQL）でまとめて表示。LPのアクセス数は Google アナリティクスと連携">
      {filter}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {kpis.map((x) => (
          <Card key={x.k} className="px-5 py-5">
            <p className="text-[11.5px] text-mute">{x.k}</p>
            <p className="mt-2 text-[22px] font-semibold tabular-nums">{x.v}</p>
          </Card>
        ))}
      </div>

      <Card className="mt-5">
        <CardHead right={<button type="button" onClick={() => setTable(!table)} className="tap text-[12px] text-mute underline underline-offset-4 hover:text-ink">{table ? "グラフで見る" : "表で見る"}</button>}>
          {showMoney ? "月ごとの売上" : "月ごとの受注件数"}
        </CardHead>
        {table ? (
          <div className="overflow-x-auto border-t border-line">
            <table className="w-full min-w-[520px] text-[12.5px]">
              <thead className="bg-[#fafafa] text-left text-mute"><tr>{["月", "問い合わせ", "見積", "受注", ...(showMoney ? ["売上"] : [])].map((h) => <th key={h} className="px-5 py-2.5 font-normal">{h}</th>)}</tr></thead>
              <tbody className="divide-y divide-line">
                {sorted.map((x) => <tr key={x.ym}><td className="px-5 py-2.5">{ymLabel(x.ym)}</td><td className="px-5 py-2.5 tabular-nums">{x.inquiries}</td><td className="px-5 py-2.5 tabular-nums">{x.quotes}</td><td className="px-5 py-2.5 tabular-nums">{x.orders}</td>{showMoney && <td className="px-5 py-2.5 tabular-nums">{man(x.sales)}</td>}</tr>)}
              </tbody>
            </table>
          </div>
        ) : (
          <Bars data={m.map((x) => ({ label: x.label, v: showMoney ? x.sales : x.orders }))} fmt={showMoney ? man : (v) => `${Math.round(v)}件`} />
        )}
      </Card>

      {csvBox}

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHead note="段階ごとに、何件が次に進んだか">問い合わせから納品までの流れ</CardHead>
          <ul className="space-y-3 px-5 pt-2 pb-5">
            {funnel.map((f, i) => (
              <li key={f.label}>
                <div className="flex items-baseline justify-between text-[12.5px]">
                  <span>{f.label}</span>
                  <span className="tabular-nums"><b className="font-semibold">{f.v}件</b>{i > 0 && <span className="ml-2 text-mute">前の段階から {((f.v / funnel[i - 1].v) * 100).toFixed(0)}%</span>}</span>
                </div>
                <div className="mt-1.5 h-7 overflow-hidden rounded-md bg-[#f1f1f0]"><div className="h-full rounded-md bg-ink/80" style={{ width: `${(f.v / funnel[0].v) * 100}%` }} /></div>
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <CardHead note="LPのどこを見てから問い合わせたか（フォーム送信時に記録）">問い合わせのきっかけ</CardHead>
          <HBars rows={sources} fmt={(v) => `${v}件`} />
        </Card>
        {showMoney && (
          <Card>
            <CardHead>製品ごとの売上</CardHead>
            <HBars rows={byModel} fmt={man} />
          </Card>
        )}
        <Card>
          <CardHead note="どこで時間がかかっているかを見つける">段階ごとの平均日数</CardHead>
          <HBars rows={lead} fmt={(v) => `${v.toFixed(1)}日`} />
        </Card>
      </div>
      <p className="mt-4 text-[11px] text-mute">※デモ版のため、グラフの数字は見本です。</p>
    </Shell>
  );
}

// CSVのダウンロード：期間と並び順は、ページ上部の条件をそのまま使う
function CsvBox({ canMoney, canCustomer, deals, monthly, lo, hi, order, periodText }: { canMoney: boolean; canCustomer: boolean; deals: ReturnType<typeof useDeals>; monthly: ReturnType<typeof months>; lo: string; hi: string; order: Order; periodText: string }) {
  const [kind, setKind] = useState<"monthly" | "deals">("monthly");
  const dealRows = sortRows(deals.filter((d) => d.createdAt.slice(0, 7) >= lo && d.createdAt.slice(0, 7) <= hi), order, (d) => d.createdAt, (d) => amounts(d).total, (d) => d.lot);
  const count = kind === "monthly" ? monthly.length : dealRows.length;

  const download = () => {
    if (kind === "monthly") {
      const head = ["月", "問い合わせ", "見積送付", "受注", "納品完了", ...(canMoney ? ["売上（円）"] : []), "成約率（%）", "不良率（%）", "納期どおりの出荷（%）"];
      downloadCsv(`craftpack-oem_monthly_${lo}_${hi}_${order}.csv`, [head, ...monthly.map((x) => [x.ym, x.inquiries, x.quotes, x.orders, x.delivered, ...(canMoney ? [x.sales] : []), ((x.orders / x.inquiries) * 100).toFixed(1), x.defect.toFixed(1), x.onTime.toFixed(0)])]);
    } else {
      const head = ["案件番号", "受付日", "ブランド", ...(canCustomer ? ["担当者", "メール"] : []), "製品", "数量", "ロゴ加工", "革の色", "段階", ...(canMoney ? ["金額（税込・円）"] : []), "担当", "期日"];
      downloadCsv(`craftpack-oem_deals_${lo}_${hi}_${order}.csv`, [head, ...dealRows.map((d) => [d.id, d.createdAt, d.brand, ...(canCustomer ? [d.person, d.email] : []), modelOf(d.model).name, d.lot, d.finish, d.color, STAGES.find((s) => s.id === d.stage)!.ja, ...(canMoney ? [amounts(d).total] : []), d.owner, d.due])]);
    }
  };

  return (
    <Card className="mt-5">
      <CardHead note="サーバーで作成し、誰がいつダウンロードしたかを操作履歴に記録。権限のない項目（金額・連絡先）は入らない">CSVでダウンロード</CardHead>
      <div className="px-5 pt-1 pb-5 text-[12px]">
        <p className="rounded-lg bg-[#f6f6f5] px-3.5 py-2.5 text-[12.5px]"><span className="text-mute">条件：</span>{periodText.split("・").map((t, i) => <span key={t} className="inline-block whitespace-nowrap">{i ? "・" : ""}{t}</span>)}<span className="block text-[11px] text-mute sm:inline sm:pl-2">（ページ上部で変更できます）</span></p>
        <div className="mt-3 flex flex-wrap items-end gap-3">
          <label className="flex w-full flex-col gap-1.5 sm:w-auto"><span className="text-mute">種類</span>
            <select value={kind} onChange={(e) => setKind(e.target.value as "monthly" | "deals")} className="rounded-lg border border-line bg-white px-3 py-2 text-[13px] outline-none focus:border-ink">
              <option value="monthly">月ごとの集計</option>
              <option value="deals">案件の一覧</option>
            </select>
          </label>
          <button type="button" onClick={download} disabled={!count} className="cms-btn inline-flex w-full items-center justify-center gap-2 bg-ink px-5 py-2.5 text-[13px] text-white disabled:bg-line disabled:text-mute sm:w-auto">
            <Download size={15} /> ダウンロード（{count}行）
          </button>
        </div>
      </div>
      {!canMoney && <TechNote className="px-5 pb-4">あなたの権限では、金額の列は含まれません</TechNote>}
    </Card>
  );
}
