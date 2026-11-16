"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { CheckCircle2, Paperclip, Send, X } from "lucide-react";
import { LOTS, MODELS, getModel, yen, type ModelId } from "@/lib/models";
import { useLp } from "./LpContext";
import SectionTitle from "./SectionTitle";

type Errors = Partial<Record<"name" | "email" | "model" | "lot" | "message" | "file", string>>;
const MAX_FILE = 10 * 1024 * 1024;
const OK_EXT = /\.(ai|pdf|svg|png|jpe?g|eps)$/i;

export default function ContactForm() {
  const { prefill } = useLp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [model, setModel] = useState<ModelId | "">("");
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
    }
    setMessage((m) => {
      const line = prefill.note ?? `【シミュレーション条件】${getModel(prefill.model).name} / ${prefill.lot}個 / 想定販売価格 ${yen(prefill.price)}`;
      const rest = m.replace(/^【(シミュレーション条件|刻印イメージ)】.*\n?/, "");
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
    setTimeout(() => {
      setSending(false);
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
      <div className="mx-auto max-w-3xl px-5 md:px-8">
        <SectionTitle en="Contact" ja="無料見積もり・ご相談" sub="ロゴが未完成でも、|お気軽にどうぞ。" />

        <form noValidate onSubmit={onSubmit} className={`reveal border bg-white p-6 transition md:p-12 ${flash ? "border-gold ring-4 ring-gold-3" : "border-line"}`}>
          {prefill && (
            <p className="mb-6 bg-[#faf8f3] px-4 py-3 text-[13px] text-ink-2">シミュレーションの条件を入力しました。内容をご確認ください。</p>
          )}
          <div className="grid gap-6 md:grid-cols-2">
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
            <label className="block text-sm font-bold">
              希望ベースモデル<span className="ml-1 text-xs text-gold">必須</span>
              <select value={model} onChange={(e) => setModel(e.target.value as ModelId)} className={`${field} ${bd("model")}`} aria-invalid={!!errors.model} aria-describedby="err-model">
                <option value="">選択してください</option>
                {MODELS.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                <option value="undecided">まだ決めていない</option>
              </select>
              <Err k="model" />
            </label>
            <label className="block text-sm font-bold">
              希望ロット数<span className="ml-1 text-xs text-gold">必須</span>
              <select value={lot} onChange={(e) => setLot(e.target.value)} className={`${field} ${bd("lot")}`} aria-invalid={!!errors.lot} aria-describedby="err-lot">
                <option value="">選択してください</option>
                {LOTS.map((l) => <option key={l} value={l}>{l}個</option>)}
                <option value="more">300個以上・未定</option>
              </select>
              <Err k="lot" />
            </label>

            <div className="text-sm font-bold md:col-span-2">
              ロゴデータ添付<span className="ml-1 text-xs font-normal text-mute">任意（ai / pdf / svg / eps / png / jpg・10MBまで）</span>
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
            <button type="button" onClick={reset} autoFocus className="mt-7 w-full bg-ink py-3.5 font-bold text-white transition hover:bg-gold">閉じる</button>
          </div>
        </div>
      )}
    </section>
  );
}
