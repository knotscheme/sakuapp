"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, KeyRound, Lock, ShieldCheck, Smartphone } from "lucide-react";
import { effective, enrollMfa, loginAs, mfaRequired, usePermState, type Member } from "@/components/cms/perm";
import { setViewLang } from "@/components/cms/i18n";
import { TechNote } from "@/components/cms/ui";

// ログイン＋2段階認証（デモ）
// 本番では Supabase Auth（メール＋パスワード）と MFA（TOTP：認証アプリの6桁コード）。コードの確認はサーバー側で行う
type L = "ja" | "th" | "en";
const T = {
  ja: { title: "ログイン", email: "メールアドレス", pw: "パスワード", next: "次へ", bad: "メールアドレスかパスワードが違います", codeT: "2段階認証", codeB: "認証アプリに表示されている6桁のコードを入れてください", verify: "確認してログイン", wrong: (n: number) => `コードが違います（あと${n}回で一時的にロック）`, locked: (s: number) => `間違いが続いたため、${s}秒間ログインを止めています`, setupT: "2段階認証の設定", setupB: "あなたの役割では2段階認証が必須です。認証アプリ（Google Authenticator など）でQRコードを読み取り、表示された6桁のコードを入れてください。", key: "読み取れないときは、このキーを入力", setup: "設定してログイン", app: "認証アプリ（デモ）", appNote: "本番では、あなたのスマホの認証アプリに出ます", remember: "この端末では30日間コードを省略", back: "戻る", demo: "デモ用のアカウント", demoPw: "パスワードはどれも demo1234", optional: "2段階認証は任意です（オーナーが役割ごとに必須にできます）", skip: "設定せずにログイン" },
  th: { title: "เข้าสู่ระบบ", email: "อีเมล", pw: "รหัสผ่าน", next: "ถัดไป", bad: "อีเมลหรือรหัสผ่านไม่ถูกต้อง", codeT: "ยืนยันตัวตน 2 ขั้นตอน", codeB: "กรอกรหัส 6 หลักที่แสดงในแอปยืนยันตัวตน", verify: "ยืนยันและเข้าสู่ระบบ", wrong: (n: number) => `รหัสไม่ถูกต้อง (อีก ${n} ครั้งจะถูกล็อกชั่วคราว)`, locked: (s: number) => `กรอกผิดหลายครั้ง ระงับการเข้าสู่ระบบ ${s} วินาที`, setupT: "ตั้งค่ายืนยันตัวตน 2 ขั้นตอน", setupB: "ตำแหน่งของคุณต้องใช้การยืนยันตัวตน 2 ขั้นตอน สแกนคิวอาร์โค้ดด้วยแอปยืนยันตัวตน (เช่น Google Authenticator) แล้วกรอกรหัส 6 หลัก", key: "หากสแกนไม่ได้ ให้กรอกคีย์นี้", setup: "ตั้งค่าและเข้าสู่ระบบ", app: "แอปยืนยันตัวตน (เดโม)", appNote: "ในระบบจริง รหัสจะแสดงในแอปบนมือถือของคุณ", remember: "ไม่ต้องกรอกรหัสบนอุปกรณ์นี้ 30 วัน", back: "ย้อนกลับ", demo: "บัญชีสำหรับเดโม", demoPw: "รหัสผ่านทั้งหมดคือ demo1234", optional: "การยืนยัน 2 ขั้นตอนไม่บังคับสำหรับตำแหน่งนี้", skip: "เข้าสู่ระบบโดยไม่ตั้งค่า" },
  en: { title: "Log in", email: "Email", pw: "Password", next: "Next", bad: "Wrong email or password", codeT: "Two-step verification", codeB: "Enter the 6-digit code shown in your authenticator app", verify: "Verify and log in", wrong: (n: number) => `Wrong code (${n} more tries before a temporary lock)`, locked: (s: number) => `Too many attempts. Login is paused for ${s} seconds`, setupT: "Set up two-step verification", setupB: "Your role requires two-step verification. Scan the QR code with an authenticator app (e.g. Google Authenticator) and enter the 6-digit code.", key: "Can't scan? Enter this key", setup: "Set up and log in", app: "Authenticator app (demo)", appNote: "In production, the code appears in the app on your phone", remember: "Skip the code on this device for 30 days", back: "Back", demo: "Demo accounts", demoPw: "All passwords are demo1234", optional: "Two-step verification is optional for this role", skip: "Log in without setting up" },
};

// デモ用のワンタイムコード（30秒ごとに変わる）
const secretOf = (m: Member) => `CRAFT${m.id.toUpperCase()}OEMDEMOKEY`.slice(0, 16);
function codeAt(secret: string, t = Date.now()) {
  const step = Math.floor(t / 30000);
  let h = 2166136261;
  for (const c of `${secret}:${step}`) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); }
  return String(Math.abs(h) % 1000000).padStart(6, "0");
}
const MAX_TRY = 5;
const LOCK_SEC = 60;
const getLock = () => { try { return Number(sessionStorage.getItem("craftpack-mfa-lock") ?? 0); } catch { return 0; } };

export default function Login() {
  const router = useRouter();
  const st = usePermState();
  const [lang, setLang] = useState<L>("ja");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [who, setWho] = useState<Member | null>(null);
  const [step, setStep] = useState<"account" | "code" | "setup">("account");
  const [code, setCode] = useState("");
  const [tries, setTries] = useState(0);
  const [now, setNow] = useState(() => Date.now());
  const [remember, setRemember] = useState(false);
  const codeRef = useRef<HTMLInputElement>(null);
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  const t = T[lang];
  const lockLeft = Math.max(0, Math.ceil((getLock() - now) / 1000));

  const done = (m: Member) => {
    loginAs(m.id); setViewLang("", null);
    const perms = effective(m, st.roles);
    router.push(perms.includes("deals.view") ? "/cms/" : perms.includes("factory.use") ? "/cms/factory/" : "/cms/manual/");
  };
  const submitAccount = () => {
    const m = st.members.find((x) => x.email.toLowerCase() === email.trim().toLowerCase());
    if (!m || pw !== "demo1234") { setErr(t.bad); return; }
    setErr(""); setWho(m); setLang(m.lang ?? "ja");
    try { if (Number(localStorage.getItem(`craftpack-mfa-remember-${m.id}`) ?? 0) > Date.now() && m.mfa) return done(m); } catch {}
    setStep(m.mfa ? "code" : mfaRequired(st, m) ? "setup" : "code");
    setTimeout(() => codeRef.current?.focus(), 50);
  };
  const submitCode = () => {
    if (!who || lockLeft) return;
    if (code === codeAt(secretOf(who), now) || code === codeAt(secretOf(who), now - 30000)) {
      if (step === "setup") enrollMfa(who.id);
      if (remember) try { localStorage.setItem(`craftpack-mfa-remember-${who.id}`, String(Date.now() + 30 * 86400000)); } catch {}
      try { sessionStorage.removeItem("craftpack-mfa-lock"); } catch {}
      return done(who);
    }
    const n = tries + 1;
    setTries(n); setCode("");
    if (n >= MAX_TRY) { try { sessionStorage.setItem("craftpack-mfa-lock", String(Date.now() + LOCK_SEC * 1000)); } catch {} setTries(0); setErr(""); }
    else setErr(t.wrong(MAX_TRY - n));
  };
  const optionalNoMfa = who && !who.mfa && !mfaRequired(st, who);
  const secret = who ? secretOf(who) : "";
  const cur = who ? codeAt(secret, now) : "";
  const left = 30 - Math.floor((now / 1000) % 30);
  const field = "mt-1.5 w-full rounded-lg border border-line bg-white px-3.5 py-3 text-[16px] outline-none focus:border-ink";

  return (
    <main className="cms-bg flex min-h-[100svh] flex-col items-center justify-center px-5 py-10 text-ink">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center justify-between">
          <p className="font-display text-[15px] tracking-[0.4em]">CRAFT <span className="text-gold">CMS</span></p>
          <div className="flex gap-3 text-[12px] text-mute">
            {(["ja", "th", "en"] as L[]).map((l) => <button key={l} type="button" onClick={() => setLang(l)} className={lang === l ? "text-ink underline underline-offset-4" : ""}>{l === "ja" ? "日本語" : l === "th" ? "ไทย" : "EN"}</button>)}
          </div>
        </div>

        <div className="cms-card px-6 py-7">
          {step === "account" ? (
            <form onSubmit={(e) => { e.preventDefault(); submitAccount(); }} className="space-y-4">
              <h1 className="text-[20px] font-semibold">{t.title}</h1>
              <label className="block text-[12.5px] text-mute">{t.email}<input value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="username" className={field} /></label>
              <label className="block text-[12.5px] text-mute">{t.pw}<input value={pw} onChange={(e) => setPw(e.target.value)} type="password" autoComplete="current-password" className={field} /></label>
              {err && <p className="text-[12.5px] text-red-600">{err}</p>}
              <button className="cms-btn w-full bg-ink py-3 text-[14px] text-white">{t.next}</button>
            </form>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); submitCode(); }} className="space-y-4">
              <button type="button" onClick={() => { setStep("account"); setCode(""); setErr(""); }} className="tap -mt-2 flex items-center gap-1 text-[12.5px] text-mute"><ArrowLeft size={14} />{t.back}</button>
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-white">{step === "setup" ? <Smartphone size={17} /> : <ShieldCheck size={17} />}</span>
                <h1 className="text-[18px] font-semibold">{step === "setup" ? t.setupT : t.codeT}</h1>
              </div>
              <p className="text-[13px] leading-relaxed text-mute">{who?.name}（{who?.email}）<br />{step === "setup" ? t.setupB : t.codeB}</p>
              {step === "setup" && (
                <div className="flex items-center gap-4 rounded-xl bg-[#f6f6f5] p-3.5">
                  <FakeQr seed={secret} />
                  <div className="min-w-0 text-[11.5px] text-mute">{t.key}<p className="mt-1 font-mono text-[13px] break-all text-ink">{secret.replace(/(.{4})/g, "$1 ").trim()}</p></div>
                </div>
              )}
              <input ref={codeRef} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" placeholder="000000" aria-label={t.codeT} disabled={!!lockLeft}
                className="w-full rounded-lg border border-line bg-white py-3 text-center font-mono text-[26px] tracking-[0.5em] outline-none focus:border-ink disabled:bg-[#fafafa]" />
              {lockLeft > 0 ? <p className="flex items-center gap-1.5 text-[12.5px] text-red-600"><Lock size={13} />{t.locked(lockLeft)}</p> : err && <p className="text-[12.5px] text-red-600">{err}</p>}
              <label className="flex items-center gap-2 text-[12.5px] text-mute"><input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="h-4 w-4 accent-[#1a1a1a]" />{t.remember}</label>
              <button disabled={code.length !== 6 || !!lockLeft} className="cms-btn w-full bg-ink py-3 text-[14px] text-white disabled:bg-line disabled:text-mute">{step === "setup" ? t.setup : t.verify}</button>
              {optionalNoMfa && <p className="text-center text-[12px] text-mute">{t.optional}<br /><button type="button" onClick={() => who && done(who)} className="tap underline underline-offset-4">{t.skip}</button></p>}

              {/* デモ用：認証アプリの代わり */}
              <div className="rounded-xl border border-dashed border-gold-2/60 bg-[#fbf7ee] px-4 py-3">
                <p className="flex items-center gap-1.5 text-[11.5px] text-[#8a650c]"><KeyRound size={13} />{t.app}</p>
                <div className="mt-1 flex items-center justify-between">
                  <button type="button" onClick={() => setCode(cur)} className="font-mono text-[24px] tracking-[0.3em]" aria-label="コードを入れる">{cur.slice(0, 3)} {cur.slice(3)}</button>
                  <span className="relative flex h-8 w-8 items-center justify-center text-[11px] text-mute">
                    <svg viewBox="0 0 36 36" className="absolute inset-0 -rotate-90"><circle cx="18" cy="18" r="15" fill="none" stroke="#e5e2da" strokeWidth="3" /><circle cx="18" cy="18" r="15" fill="none" stroke="#b8860b" strokeWidth="3" strokeDasharray={`${(left / 30) * 94.2} 94.2`} /></svg>{left}
                  </span>
                </div>
                <p className="text-[10.5px] text-mute">{t.appNote}</p>
              </div>
            </form>
          )}
        </div>

        {step === "account" && (
          <div className="mt-5 rounded-xl bg-white/60 px-4 py-3 text-[12px]">
            <p className="text-mute">{t.demo}（{t.demoPw}）</p>
            <ul className="mt-2 space-y-1">
              {st.members.map((m) => (
                <li key={m.id}><button type="button" onClick={() => { setEmail(m.email); setPw("demo1234"); setErr(""); }} className="flex w-full items-center justify-between gap-2 py-0.5 text-left hover:text-gold">
                  <span>{m.name}（{st.roles.find((r) => r.id === m.role)?.name}）</span>
                  <span className={`text-[11px] ${m.mfa ? "text-[#2f7a46]" : mfaRequired(st, m) ? "text-[#8a650c]" : "text-mute"}`}>{m.mfa ? "2段階認証 ✓" : mfaRequired(st, m) ? "初回に設定" : "任意"}</span>
                </button></li>
              ))}
            </ul>
          </div>
        )}
        <TechNote className="mt-4">Supabase Auth のメール＋パスワードと MFA（TOTP）。コードの確認・回数制限はサーバー側で行い、2段階認証を済ませていない状態では、データベースの権限（RLS）でも管理データを読ませない</TechNote>
        <Link href="/cms/" className="tap mt-2 text-[12px] text-mute underline underline-offset-4">管理画面に戻る（デモ）</Link>
      </div>
    </main>
  );
}

// デモ用の見た目だけのQRコード（本番では otpauth:// のURLから作る）
function FakeQr({ seed }: { seed: string }) {
  const cells = useMemo(() => {
    let h = 7;
    return Array.from({ length: 21 * 21 }, (_, i) => {
      const x = i % 21, y = Math.floor(i / 21);
      const finder = (a: number, b: number) => x >= a && x < a + 7 && y >= b && y < b + 7;
      if (finder(0, 0) || finder(14, 0) || finder(0, 14)) {
        const fx = x % 14 === x ? x : x - 14, fy = y % 14 === y ? y : y - 14;
        const ring = Math.max(Math.abs(fx - 3), Math.abs(fy - 3));
        return ring !== 2;
      }
      h = (h * 31 + seed.charCodeAt(i % seed.length) + i) % 9973;
      return h % 3 === 0;
    });
  }, [seed]);
  return (
    <svg viewBox="-1 -1 23 23" className="h-24 w-24 shrink-0 rounded bg-white" aria-label="QRコード（デモ）">
      {cells.map((on, i) => on && <rect key={i} x={i % 21} y={Math.floor(i / 21)} width="1" height="1" fill="#1a1a1a" />)}
    </svg>
  );
}
