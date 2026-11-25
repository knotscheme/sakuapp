"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { CheckCircle2, Paperclip, Send, X } from "lucide-react";
import { getModel, yen, type ModelId } from "@/lib/models";
import { lotChoices, usePricing } from "@/lib/pricing";
import { useLp } from "./LpContext";
import SectionTitle from "./SectionTitle";
import { asset } from "@/lib/asset";
import { addInquiry } from "./cms/store";
import { imgSrc, leathersOf, useCatalog, useLpModels } from "./cms/catalog";
import { ALL_MODELS } from "@/lib/models";
import { tierInfo, unitPriceOf } from "@/lib/cms";
import { toLogoMask } from "./cms/Proof";

type Errors = Partial<Record<"name" | "email" | "model" | "lot" | "message" | "file", string>>;
const MAX_FILE = 10 * 1024 * 1024;
const OK_EXT = /\.(ai|pdf|svg|png|jpe?g|eps)$/i;

export default function ContactForm() {
  const pr = usePricing();
  const MIN_LOT = pr.minLot;
  const { prefill } = useLp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [model, setModel] = useState<ModelId | "" | "undecided">("");
  const [lot, setLot] = useState("");
  // カラーごとの数量（入れると、合計の数で数量割引を出して概算を見せる）
  const [qtys, setQtys] = useState<Record<string, number>>({});
  const { products, colors, leathers: allLeathers } = useCatalog();
  const MODELS = useLpModels(); // 商品管理で公開中のものだけ
  const prod = products.find((p) => p.id === model);
  // 革素材：商品で選べる革（先頭が標準）。選んだ革の上乗せを単価に足す
  const leatherList = prod ? leathersOf(prod, allLeathers) : [];
  const [leatherId, setLeatherId] = useState("");
  const leather = leatherList.find((l) => l.id === leatherId) ?? leatherList[0];
  const ci = (prod?.options ?? []).findIndex((o) => o.kind === "color");
  const colorChoices = ci < 0 ? [] : [...new Set((prod?.variants ?? []).filter((v) => v.visible).map((v) => v.values[ci]))];
  const total = colorChoices.reduce((s, c) => s + (qtys[c] || 0), 0);
  const inSim = ALL_MODELS.some((m) => m.id === model);
  const [message, setMessage] = useState("");
  // ロゴを入れるかどうか（無地のままでも注文できる。なしなら版代はかからない）
  const [logoOn, setLogoOn] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [flash, setFlash] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // 製品一覧で選んだ革（?leather=）を最初に選んでおく
  useEffect(() => {
    const l = new URLSearchParams(location.search).get("leather");
    if (l) setLeatherId(l); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

  // シミュレーターからの条件を自動入力する
  useEffect(() => {
    if (!prefill) return;
    /* eslint-disable react-hooks/set-state-in-effect -- 外から渡された条件をフォームに反映するため */
    if (!prefill.note) {
      setModel(prefill.model);
      setLot(String(prefill.lot));
    } else if (prefill.keepModel) {
      setModel(prefill.model);
    }
    setMessage((m) => {
      const line = prefill.note ?? `【シミュレーション条件】${getModel(prefill.model).name} / ${prefill.lot}個 / 想定販売価格 ${yen(prefill.price)}`;
      const rest = m.replace(/^【(シミュレーション条件|刻印イメージ|ご希望モデル)】.*\n?/, "");
      return `${line}\n${rest}`;
    });
    setFlash(true);
    const t = setTimeout(() => setFlash(false), 1600);
    /* eslint-enable react-hooks/set-state-in-effect */
    return () => clearTimeout(t);
  }, [prefill]);

  const validate = (): Errors => {
    const e: Errors = {};
    if (!name.trim()) e.name = "お名前（または会社名）を入力してください";
    if (!email.trim()) e.email = "メールアドレスを入力してください";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "メールアドレスの形式が正しくありません";
    if (!model) e.model = "希望ベースモデルを選んでください";
    if (total > 0 ? total < MIN_LOT : !lot) e.lot = total > 0 ? `カラーごとの数量は、合計${MIN_LOT}個からです` : "希望ロット数を選ぶか、カラーごとの数量を入れてください";
    if (message.length > 1000) e.message = "相談内容は1,000文字以内で入力してください";
    if (logoOn && file && (file.size > MAX_FILE || !OK_EXT.test(file.name))) e.file = "10MB以内の ai / pdf / svg / eps / png / jpg を添付してください";
    return e;
  };

  const onSubmit = (ev: FormEvent) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) {
      document.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      return;
    }
    setSending(true);
    // デモ版のため、実際には送信しない
    // 添付のロゴ（png・jpg・svg）は、管理画面のロゴ配置イメージに使えるように透明な画像にしておく
    const logo = logoOn && file ? toLogoMask(file) : Promise.resolve(null);
    // 希望ロットと内訳の合計がちがうときは、両方わかるように相談内容に残す
    const lotNote = total > 0 && lot && lot !== "more" && Number(lot) !== total ? `【希望ロット】${lot}個（カラーごとの内訳は合計${total}個）\n` : "";
    setTimeout(async () => {
      const lg = await logo;
      setSending(false);
      // デモ：管理画面（CMS）の案件ボードに、問い合わせとして追加する
      addInquiry({ leather: leather ? { name: leather.name, code: leather.code, add: leather.add, img: leather.img } : undefined, brand: name.trim(), email: email.trim(), model: model && model !== "undecided" ? (model as ModelId) : "long", lot: total > 0 ? total : lot === "more" || !lot ? 300 : Number(lot), message: (lotNote + message).trim() || undefined, noLogo: !logoOn, logo: lg?.src, logoAspect: lg?.ar, items: total > 0 ? colorChoices.filter((c) => qtys[c] > 0).map((c) => ({ color: c, qty: qtys[c] })) : undefined });
      setDone(true);
    }, 1100);
  };

  const reset = () => {
    setDone(false);
    setName(""); setEmail(""); setModel(""); setLot(""); setQtys({}); setMessage(""); setLogoOn(true); setLeatherId(""); setFile(null); setErrors({});
    if (fileRef.current) fileRef.current.value = "";
  };

  const field = "mt-2 w-full border bg-white px-4 py-3.5 text-[15px] outline-none transition focus:border-gold focus:ring-2 focus:ring-gold-3";
  const bd = (k: keyof Errors) => (errors[k] ? "border-red-400" : "border-line");
  const Err = ({ k }: { k: keyof Errors }) => (errors[k] ? <p className="mt-1.5 text-xs text-red-500" id={`err-${k}`}>{errors[k]}</p> : null);

  return (
    <section id="contact" className="bg-[#f5f5f4] py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-6 md:px-8">
        <SectionTitle en="Contact" ja="無料見積もり・ご相談" sub="ロゴが未完成でも、|お気軽にどうぞ。" />

        <form noValidate onSubmit={onSubmit} className={`border bg-white p-6 transition md:p-12 ${flash ? "border-gold ring-4 ring-gold-3" : "border-line"}`}>
          {prefill && (
            <p className="mb-6 bg-[#faf8f3] px-4 py-3 text-[13px] text-ink-2">シミュレーションの条件を入力しました。内容をご確認ください。</p>
          )}
          <div className="grid grid-cols-[minmax(0,1fr)] gap-6 md:grid-cols-2">
            <label className="block text-sm font-bold md:col-span-2">
              お名前（または会社名）<span className="ml-1 text-xs text-gold">必須</span>
              <input value={name} onChange={(e) => setName(e.target.value)} maxLength={100} autoComplete="name" className={`${field} ${bd("name")}`} aria-invalid={!!errors.name} aria-describedby="err-name" placeholder="例）株式会社サンプル / 山田 花子" />
              <Err k="name" />
            </label>
            <label className="block text-sm font-bold md:col-span-2">
              メールアドレス<span className="ml-1 text-xs text-gold">必須</span>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={254} autoComplete="email" className={`${field} ${bd("email")}`} aria-invalid={!!errors.email} aria-describedby="err-email" placeholder="example@mail.com" />
              <Err k="email" />
            </label>
            {/* 希望ベースモデル：写真つきで選べるように（ベースモデルの見出しと同じ名前） */}
            <fieldset className="min-w-0 text-sm font-bold md:col-span-2" aria-invalid={!!errors.model} aria-describedby="err-model">
              <legend>希望ベースモデル<span className="ml-1 text-xs text-gold">必須</span></legend>
              {/* 写真つきの小さな一覧（モデルが増えても選びやすいように、多いときは枠の中でスクロール） */}
              <div className="mt-3 grid border-t border-line sm:grid-cols-2 sm:gap-x-6">
                {[...MODELS.map((m) => ({ id: m.id as ModelId | "undecided", img: m.img as string | null, name: m.short, sub: `${yen(m.unitPrice)}〜` })), { id: "undecided" as const, img: null, name: "まだ決めていない", sub: "ご相談しながら決められます" }].map((o) => (
                  <label key={o.id} className={`flex cursor-pointer items-center gap-4 border-b border-line py-2.5 transition ${model === o.id ? "text-ink" : "text-ink/80 hover:text-ink"}`}>
                    <input type="radio" name="cf-model" value={o.id} checked={model === o.id} onChange={() => setModel(o.id)} className="sr-only" />
                    {o.img ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={asset(o.img)} alt="" loading="lazy" className="aspect-[4/3] w-14 shrink-0 object-cover" />
                    ) : (
                      <span className="flex aspect-[4/3] w-14 shrink-0 items-center justify-center bg-paper text-[16px] text-mute">?</span>
                    )}
                    <span className="flex-1">
                      <span className="block text-[13.5px] font-medium">{o.name}</span>
                      <span className="block text-[11.5px] font-normal text-mute">{o.sub}</span>
                    </span>
                    <span className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border ${model === o.id ? "border-ink" : errors.model ? "border-red-300" : "border-line"}`}>
                      {model === o.id && <span className="h-2 w-2 rounded-full bg-ink" />}
                    </span>
                  </label>
                ))}
              </div>
              <Err k="model" />
            </fieldset>
            {leatherList.length > 1 && (
              <fieldset className="min-w-0 text-sm font-bold md:col-span-2">
                <legend>革素材</legend>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {leatherList.map((l, i) => {
                    const on = leather?.id === l.id;
                    return (
                      <label key={l.id} className={`flex cursor-pointer items-center gap-3 border p-2 pr-4 transition ${on ? "border-ink bg-ink text-white" : "border-line hover:border-mute"}`}>
                        <input type="radio" name="cf-leather" checked={on} onChange={() => setLeatherId(l.id)} className="sr-only" />
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        {l.img ? <img src={imgSrc(l.img)} alt="" className="aspect-[4/3] w-12 shrink-0 object-cover" /> : <span className="aspect-[4/3] w-12 shrink-0 bg-paper" />}
                        <span className="flex-1 text-[13px] font-medium">{l.name}</span>
                        <span className={`shrink-0 text-[11.5px] font-normal ${on ? "text-white/70" : "text-mute"}`}>{i === 0 && l.add === 0 ? "標準" : `＋${yen(l.add)}／個`}</span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            )}
            <fieldset className="min-w-0 text-sm font-bold md:col-span-2">
              <legend>ロゴ入れ</legend>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {([[true, "ロゴを入れる", `＋版代${yen(pr.plate)}`], [false, "ロゴなし", "無地のまま・版代なし"]] as const).map(([v, t, sub]) => (
                  <label key={t} className={`cursor-pointer border px-3 py-3 text-center transition ${logoOn === v ? "border-ink bg-ink text-white" : "border-line hover:border-mute"}`}>
                    <input type="radio" name="cf-logo" checked={logoOn === v} onChange={() => setLogoOn(v)} className="sr-only" />
                    <span className="block text-[13px] font-medium">{t}</span>
                    <span className={`block text-[11px] font-normal ${logoOn === v ? "text-white/70" : "text-mute"}`}>{sub}</span>
                  </label>
                ))}
              </div>
              {logoOn && (
                <div className="mt-5">
                ロゴデータ添付<span className="ml-1 text-xs font-normal text-mute">任意・あとからでも大丈夫です</span><span className="mt-1 block text-[11px] font-normal text-mute">ai / pdf / svg / eps / png / jpg・10MBまで</span>
                <label className={`mt-2 flex cursor-pointer items-center gap-3 border border-dashed px-4 py-5 transition hover:border-gold hover:bg-[#faf8f3] ${errors.file ? "border-red-400" : "border-gold-2/60"}`}>
                  <Paperclip size={20} className="text-gold" />
                  <span className="flex-1 truncate font-normal text-mute">{file ? file.name : "ファイルを選択、またはここにドロップ"}</span>
                  {file && (
                    <button type="button" aria-label="添付を取り消す" onClick={(e) => { e.preventDefault(); setFile(null); if (fileRef.current) fileRef.current.value = ""; }} className="rounded-full p-1 text-mute hover:bg-line">
                      <X size={16} />
                    </button>
                  )}
                  <input ref={fileRef} type="file" accept=".ai,.pdf,.svg,.eps,.png,.jpg,.jpeg" className="sr-only" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
                </label>
                <Err k="file" />
                </div>
              )}
            </fieldset>
            <fieldset className="min-w-0 text-sm font-bold md:col-span-2" aria-invalid={!!errors.lot} aria-describedby="err-lot">
              <legend>希望ロット数<span className="ml-1 text-xs text-gold">必須</span></legend>
              <div className="mt-3 grid gap-2 [grid-template-columns:repeat(auto-fit,minmax(4.2rem,1fr))]">
                {[...lotChoices(pr).map((l) => [String(l), `${l}個`]), ["more", "未定"]].map(([v, t]) => (
                  <label key={v} className={`cursor-pointer border py-3 text-center text-[13px] font-medium transition ${lot === v ? "border-ink bg-ink text-white" : errors.lot ? "border-red-300" : "border-line hover:border-mute"}`}>
                    <input type="radio" name="cf-lot" value={v} checked={lot === v} onChange={() => setLot(v)} onClick={() => lot === v && setLot("")} className="sr-only" />
                    {t}
                  </label>
                ))}
              </div>
              {total > 0 && <LotHint lot={lot} total={total} />}
              <Err k="lot" />
            </fieldset>

            {colorChoices.length > 0 && (
              <div className="min-w-0 text-sm md:col-span-2">
                <p className="font-bold">カラーごとの数量<span className="ml-1 text-xs font-normal text-mute">任意・入れると概算が出ます</span></p>
                <ul className="mt-3 divide-y divide-line border-y border-line">
                  {colorChoices.map((c) => {
                    const v = qtys[c] || 0;
                    const set = (n: number) => setQtys((x) => ({ ...x, [c]: Math.max(0, Math.min(9999, Math.round(n))) }));
                    return (
                      <li key={c} className="flex items-center gap-2 py-2">
                        <span className="h-3.5 w-3.5 shrink-0 rounded-full ring-1 ring-black/15" style={{ background: colors.find((x) => x.name === c)?.hex ?? "#ccc" }} />
                        <span className="min-w-0 flex-1 truncate text-[12.5px] font-normal whitespace-nowrap text-ink/80">{c}</span>
                        <button type="button" onClick={() => set(v - 10)} aria-label={`${c}を10個減らす`} className="h-8 w-8 shrink-0 border border-line text-[14px] font-normal text-mute hover:border-ink hover:text-ink">−</button>
                        <input type="number" inputMode="numeric" min={0} step={10} value={v || ""} placeholder="0" onChange={(e) => set(Number(e.target.value))} aria-label={`${c}の数量`} className="h-8 w-12 shrink-0 border border-line text-center text-[16px] font-normal tabular-nums outline-none focus:border-ink" />
                        <button type="button" onClick={() => set(v + 10)} aria-label={`${c}を10個増やす`} className="h-8 w-8 shrink-0 border border-line text-[14px] font-normal text-mute hover:border-ink hover:text-ink">＋</button>
                      </li>
                    );
                  })}
                </ul>
                {total > 0 && <Estimate model={model as ModelId} total={total} show={inSim} logo={logoOn} add={leather?.add ?? 0} leatherName={leatherList.length > 1 ? leather?.name : undefined} />}
              </div>
            )}


            <label className="block text-sm font-bold md:col-span-2">
              ご相談内容<span className="ml-1 text-xs font-normal text-mute">任意</span>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5} maxLength={1200} className={`${field} ${bd("message")} resize-y leading-relaxed`} aria-invalid={!!errors.message} aria-describedby="err-message" placeholder="ブランドのコンセプト、希望の革の色、販売予定時期など" />
              <div className="mt-1 flex justify-between"><Err k="message" /><span className="ml-auto text-xs font-normal text-mute">{message.length} / 1000</span></div>
            </label>
          </div>

          <button type="submit" disabled={sending} className="group mt-8 inline-flex w-full items-center justify-center gap-2 bg-ink py-4 text-[15px] font-medium tracking-[0.1em] text-white transition hover:bg-gold disabled:opacity-60">
            {sending ? "送信中…" : <>無料で見積もりを依頼する <Send size={17} className="transition group-hover:translate-x-1" /></>}
          </button>
          <p className="mt-3 text-center text-xs text-mute">※デモ版のため、実際には送信されません。</p>
        </form>
      </div>

      {done && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-5 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="done-title" onClick={reset}>
          <div className="pop-in w-full max-w-sm bg-white p-8 text-center" onClick={(e) => e.stopPropagation()}>
            <CheckCircle2 className="mx-auto text-gold" size={56} strokeWidth={1.3} />
            <h3 id="done-title" className="mt-4 text-xl font-bold">送信が完了しました</h3>
            <p className="mt-3 text-[14px] leading-loose text-mute">お問い合わせありがとうございます。<br />2営業日以内に、担当者よりご連絡いたします。</p>
            <button type="button" onClick={reset} autoFocus className="mt-7 w-full bg-ink py-3.5 font-bold text-white transition hover:bg-gold">閉じる</button>
          </div>
        </div>
      )}
    </section>
  );
}

// 概算の見積もり：合計の数で単価が下がる（数量割引）。あと何個で次の割引かも出す
function Estimate({ model, total, show, logo, add, leatherName }: { model: ModelId; total: number; show: boolean; logo: boolean; add: number; leatherName?: string }) {
  const { minLot: MIN_LOT, plate } = usePricing();
  const PLATE_COST = logo ? plate : 0;
  const t = tierInfo(total);
  if (total < MIN_LOT) return <p className="mt-3 text-[12.5px] text-red-600">合計{MIN_LOT}個から承ります（いま{total}個）</p>;
  if (!show) return <p className="mt-3 text-[12.5px] text-mute">合計{total}個。お見積もりは担当者からお送りします。</p>;
  const unit = unitPriceOf(model, total, add);
  const items = unit * total;
  const sum = Math.round((items + PLATE_COST) * 1.1);
  return (
    <div className="mt-4 bg-paper px-4 py-4 text-[13px] leading-relaxed">
      <p className="flex justify-between"><span>合計数量</span><b className="tabular-nums">{total}個</b></p>
      {leatherName && <p className="flex justify-between text-mute"><span>革素材</span><span>{leatherName}{add > 0 ? `（+${yen(add)}）` : ""}</span></p>}
      <p className="flex justify-between"><span>単価{t.cur && t.cur.rate > 0 ? `（${t.cur.at}個以上で${Math.round(t.cur.rate * 100)}%引き）` : ""}</span><span className="tabular-nums">{yen(unit)}</span></p>
      <p className="flex justify-between text-mute"><span>{logo ? "ロゴの版代（初回のみ）" : "ロゴなし（版代なし）"}</span><span className="tabular-nums">{yen(PLATE_COST)}</span></p>
      <p className="mt-2 flex items-baseline justify-between border-t border-line pt-2"><span className="font-bold">概算合計（税込）</span><b className="text-[18px] tabular-nums">{yen(sum)}</b></p>
      {t.next && <p className="mt-1.5 text-[12px] text-gold">あと{t.need}個（合計{t.next.at}個）で、単価が{Math.round(t.next.rate * 100)}%引きになります</p>}
      <p className="mt-1.5 text-[11px] text-mute">※概算です。正式なお見積もりは、{logo ? "ロゴの配置を確認してから" : "内容を確認してから"}お送りします。</p>
    </div>
  );
}

// 希望ロットと、カラーごとの内訳の合計を見比べる（どちらも自由に変えられる）
function LotHint({ lot, total }: { lot: string; total: number }) {
  const want = lot && lot !== "more" ? Number(lot) : 0;
  const text = !want ? `カラーごとの内訳：合計${total}個` : want === total ? `カラーごとの内訳：合計${total}個（希望ロットと同じです）` : want > total ? `カラーごとの内訳：合計${total}個（希望${want}個まで、あと${want - total}個）` : `カラーごとの内訳：合計${total}個（希望${want}個より${total - want}個多い）`;
  return <p className={`mt-2 text-[12px] font-normal ${want && want !== total ? "text-gold" : "text-mute"}`}>{text}。見積もりは内訳の合計で出します</p>;
}
