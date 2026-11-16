"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { CheckCircle2, Paperclip, Send, X } from "lucide-react";
import { LOTS, MODELS, getModel, yen, type ModelId } from "@/lib/models";
import { useLp } from "./LpContext";
import SectionTitle from "./SectionTitle";
import { asset } from "@/lib/asset";
import { addInquiry } from "./cms/store";
import { toLogoMask } from "./cms/Proof";

type Errors = Partial<Record<"name" | "email" | "model" | "lot" | "message" | "file", string>>;
const MAX_FILE = 10 * 1024 * 1024;
const OK_EXT = /\.(ai|pdf|svg|png|jpe?g|eps)$/i;

export default function ContactForm() {
  const { prefill } = useLp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [model, setModel] = useState<ModelId | "" | "undecided">("");
  const [lot, setLot] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [flash, setFlash] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

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
    if (!lot) e.lot = "希望ロット数を選んでください";
    if (message.length > 1000) e.message = "相談内容は1,000文字以内で入力してください";
    if (file && (file.size > MAX_FILE || !OK_EXT.test(file.name))) e.file = "10MB以内の ai / pdf / svg / eps / png / jpg を添付してください";
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
    // 制作サンプルのため、実際には送信しない
    // 添付のロゴ（png・jpg・svg）は、管理画面のロゴ配置イメージに使えるように透明な画像にしておく
    const logo = file ? toLogoMask(file) : Promise.resolve(null);
    setTimeout(async () => {
      const lg = await logo;
      setSending(false);
      // デモ：管理画面（CMS）の案件ボードに、問い合わせとして追加する
      addInquiry({ brand: name.trim(), email: email.trim(), model: model && model !== "undecided" ? (model as ModelId) : "long", lot: lot === "more" || !lot ? 300 : Number(lot), message: message.trim() || undefined, logo: lg?.src, logoAspect: lg?.ar });
      setDone(true);
    }, 1100);
  };

  const reset = () => {
    setDone(false);
    setName(""); setEmail(""); setModel(""); setLot(""); setMessage(""); setFile(null); setErrors({});
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
            <fieldset className="min-w-0 text-sm font-bold md:col-span-2" aria-invalid={!!errors.lot} aria-describedby="err-lot">
              <legend>希望ロット数<span className="ml-1 text-xs text-gold">必須</span></legend>
              <div className="mt-3 grid grid-cols-5 gap-2">
                {[...LOTS.map((l) => [String(l), `${l}個`]), ["more", "未定"]].map(([v, t]) => (
                  <label key={v} className={`cursor-pointer border py-3 text-center text-[13px] font-medium transition ${lot === v ? "border-ink bg-ink text-white" : errors.lot ? "border-red-300" : "border-line hover:border-mute"}`}>
                    <input type="radio" name="cf-lot" value={v} checked={lot === v} onChange={() => setLot(v)} className="sr-only" />
                    {t}
                  </label>
                ))}
              </div>
              <Err k="lot" />
            </fieldset>

            <div className="text-sm font-bold md:col-span-2">
              ロゴデータ添付<span className="ml-1 text-xs font-normal text-mute">任意</span><span className="mt-1 block text-[11px] font-normal text-mute">ai / pdf / svg / eps / png / jpg・10MBまで</span>
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

            <label className="block text-sm font-bold md:col-span-2">
              ご相談内容<span className="ml-1 text-xs font-normal text-mute">任意</span>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5} maxLength={1200} className={`${field} ${bd("message")} resize-y leading-relaxed`} aria-invalid={!!errors.message} aria-describedby="err-message" placeholder="ブランドのコンセプト、希望の革の色、販売予定時期など" />
              <div className="mt-1 flex justify-between"><Err k="message" /><span className="ml-auto text-xs font-normal text-mute">{message.length} / 1000</span></div>
            </label>
          </div>

          <button type="submit" disabled={sending} className="group mt-8 inline-flex w-full items-center justify-center gap-2 bg-ink py-4 text-[15px] font-medium tracking-[0.1em] text-white transition hover:bg-gold disabled:opacity-60">
            {sending ? "送信中…" : <>無料で見積もりを依頼する <Send size={17} className="transition group-hover:translate-x-1" /></>}
          </button>
          <p className="mt-3 text-center text-xs text-mute">※制作サンプルのため、実際には送信されません。</p>
        </form>
      </div>

      {done && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-5 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="done-title" onClick={reset}>
          <div className="pop-in w-full max-w-sm bg-white p-8 text-center" onClick={(e) => e.stopPropagation()}>
            <CheckCircle2 className="mx-auto text-gold" size={56} strokeWidth={1.3} />
            <h3 id="done-title" className="mt-4 text-xl font-bold">送信が完了しました</h3>
            <p className="mt-3 text-[14px] leading-loose text-mute">お問い合わせありがとうございます。<br />2営業日以内に、担当者よりご連絡いたします。</p>
            <a href="/sakuapp/works/lp-oem/cms/deals/" className="mt-4 inline-block text-[12.5px] underline underline-offset-4">管理画面（デモ）で届いた様子を見る</a>
            <p className="mt-2 text-[10.5px] leading-relaxed text-mute">※本番では：Next.js のAPI経由で Supabase に保存し、Resend で受付メールを自動送信</p>
            <button type="button" onClick={reset} autoFocus className="mt-7 w-full bg-ink py-3.5 font-bold text-white transition hover:bg-gold">閉じる</button>
          </div>
        </div>
      )}
    </section>
  );
}
