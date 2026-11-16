import type { Metadata } from "next";
import { ArrowUpRight, Bell, Database, EyeOff, Factory, FileClock, Globe, KeyRound, Link2, Lock, ShieldCheck, Users, Vault } from "lucide-react";

const SEC_ICON = { users: Users, factory: Factory, eye: EyeOff, link: Link2, db: Database, lock: Lock, key: KeyRound, log: FileClock, shield: ShieldCheck, globe: Globe, vault: Vault, bell: Bell } as const;
import { asset } from "@/lib/asset";
import NoOrphan from "@/components/NoOrphan";
import { Ph } from "@/components/cms/Ph";

export const metadata: Metadata = {
  title: "CRAFT OEM｜サービスとツールの全体像",
  description: "革小物ロゴ入れOEMのLP・見積・管理画面（CMS）・工場とのやり取り・お客様の確認画面を、ひとつにまとめた確認用ページ（ポートフォリオ用の制作サンプル）",
};

// このサービス（LP＋管理画面＋工場＋お客様）を、まとめて確認するためのページ
type Screen = { img: string; title: string; who: string; href: string; points: string[] };
const GROUPS: { en: string; ja: string; lead: string; screens: Screen[] }[] = [
  {
    en: "For customers", ja: "お客様が見る画面", lead: "集客から見積もり、ロゴの確認まで。ログインなしで使えます。",
    screens: [
      { img: "lp", title: "LP（ランディングページ）", who: "見込みのお客様", href: "/", points: ["ブランド名を入れて、実物の財布で刻印を試せる", "利益シミュレーター", "見積もり・相談のフォーム"] },
      { img: "products", title: "製品一覧", who: "見込みのお客様", href: "/products/", points: ["管理画面で登録した商品がそのまま出る", "丸のカラーピッカーで色を選べる", "選んだ色のまま相談に進める"] },
      { img: "contact", title: "見積もりフォーム", who: "見込みのお客様", href: "/#contact", points: ["カラーごとに数量を入れられる", "合計の数で数量割引（30・50・100・300個〜）", "あと何個で割引かも、その場で分かる"] },
      { img: "portal", title: "お客様の確認画面", who: "注文したお客様", href: "/cms/portal/?id=C-1028", points: ["メールの専用リンクで、自分の案件だけ見える", "見積の承諾・ロゴ配置の承認", "修正のお願いもここから"] },
    ],
  },
  {
    en: "For the team", ja: "社内で使う画面（管理画面）", lead: "問い合わせから発送までを1つで管理。スマホでも同じように使えます。",
    screens: [
      { img: "inbox", title: "確認待ち（自動の下書き）", who: "オーナー・営業", href: "/cms/inbox/", points: ["返信と見積・配置案・発注書を自動で下書き", "人は確認して「送信」を押すだけ", "工場への発注は最終確認のあと"] },
      { img: "autoflow", title: "自動化の流れ（案件ごと）", who: "オーナー・営業", href: "/cms/deal/?id=C-1027", points: ["どこが自動で、どこが人の確認かが分かる", "いまどこまで進んだか", "確認待ちへ、そのまま進める"] },
      { img: "dash", title: "ダッシュボード", who: "オーナー・営業", href: "/cms/", points: ["進行中の案件・受注金額・期日", "数字を押すと、その一覧が開く", "工場からの新しい連絡"] },
      { img: "deals", title: "案件ボード", who: "オーナー・営業", href: "/cms/deals/", points: ["段階ごとの列で、案件の今が分かる", "スマホは段階のボタンで移動", "一覧（カード）表示にも切り替え"] },
      { img: "deal", title: "案件の画面・ロゴ配置イメージ", who: "オーナー・営業", href: "/cms/deal/?id=C-1027", points: ["「次にやること」を押すだけで進む", "実物の写真にロゴを重ねた配置イメージ", "書類とメールは自動で作られる"] },
      { img: "quote", title: "見積（カラー別・数量割引）", who: "オーナー・営業", href: "/cms/deal/?id=C-1026", points: ["カラーごとの数量を入れると見積が変わる", "合計の数で数量割引が自動で入る", "原価・粗利も同じ画面で"] },
      { img: "product-edit", title: "商品登録（SKU・バリエーション）", who: "オーナー・営業", href: "/cms/products/", points: ["カラー・サイズは先に登録して選ぶだけ", "組み合わせごとにSKU品番（自動作成も）", "画像10枚・動画も登録できる"] },
      { img: "chat", title: "工場との連絡", who: "オーナー・営業", href: "/cms/messages/?id=C-1029", points: ["LINEのように、工場とのやり取りだけを並べる", "どの商品の話かが写真で分かる", "そのまま案件を開ける"] },
      { img: "manual", title: "使い方マニュアル", who: "全員", href: "/cms/manual/", points: ["役割ごとに、読むべき章を案内", "工場の人にはタイ語で表示", "困ったとき・言葉の説明"] },
    ],
  },
  {
    en: "For the factory", ja: "工場が使う画面", lead: "タイの工場の人は、ログインした時点からタイ語。お客様の情報や価格は見えません。",
    screens: [
      { img: "factory", title: "工場の画面（タイ語）", who: "工場（タイ）", href: "/cms/factory/", points: ["工程を押して進める（裁断→縫製→箔押し→仕上げ）", "日本への連絡は、日本語に変えて届く", "製造指示書は日本語・英語・タイ語"] },
    ],
  },
];

const FLOW = [
  { n: "01", t: "LPで相談", s: "刻印を試し、色と数で概算を見て送信" },
  { n: "02", t: "見積を送る", s: "管理画面でボタンを押すと、見積書とメール" },
  { n: "03", t: "承諾・入金", s: "お客様の画面で承諾。発注書と請求書" },
  { n: "04", t: "ロゴ配置の確認", s: "実物写真の配置イメージを承認" },
  { n: "05", t: "タイの工場で製造", s: "タイ語の画面で工程を進め、連絡もできる" },
  { n: "06", t: "日本で検品", s: "スマホでチェックし、検品報告書" },
  { n: "07", t: "発送・完了", s: "追跡番号つきのお知らせ" },
];

// 自動化：これまでの手作業 → このツールでは
const BEFORE_AFTER: [string, string, string][] = [
  ["見積の計算と見積書", "Excelで単価・割引・税を計算して、見積書を作る", "カラーと数量を入れるだけで、数量割引まで自動で計算。見積書も自動で作成"],
  ["問い合わせへの返信", "一から文面を考えて書く", "見積つきの返信がすでに下書きされていて、確認して送るだけ"],
  ["入金の確認", "通帳やカード明細と、注文を見比べる", "決済・振込を自動で照合。領収のお知らせも自動で送信"],
  ["入金の催促", "期日を自分で追いかけて、メールを書く", "期日を過ぎると、お願いのメールが下書きされて届く"],
  ["ロゴ配置の確認", "画像を加工して、メールに添付して送る", "実物写真にロゴを重ねた配置イメージを自動で作成。承認もお客様の画面で"],
  ["タイの工場への発注", "英語やタイ語で発注書を作り、数を書き写す", "承認されたら、英語・タイ語の発注書をカラー別の数量つきで自動作成。最終確認して発注"],
  ["進み具合と連絡", "電話やLINEで、そのつど確認する", "工場が工程を押すと管理画面に反映。連絡は相手の言葉で届く"],
];
// 人の確認が入るのは3か所だけ（送る・発注する前）
const AUTO_STEPS: { t: string; by: "auto" | "human" | "customer" }[] = [
  { t: "問い合わせの登録", by: "auto" },
  { t: "返信と見積の下書き", by: "auto" },
  { t: "確認して送信", by: "human" },
  { t: "見積の承諾", by: "customer" },
  { t: "注文確定・請求書", by: "auto" },
  { t: "入金の確認・領収", by: "auto" },
  { t: "配置案の下書き", by: "auto" },
  { t: "確認して送信", by: "human" },
  { t: "ロゴ配置の承認", by: "customer" },
  { t: "発注書の下書き", by: "auto" },
  { t: "最終確認して発注", by: "human" },
];

// セキュリティ：demo＝このデモで動いている／plan＝本番で導入する予定
const SECURITY: { icon: "users" | "factory" | "eye" | "link" | "db" | "lock" | "key" | "log" | "shield" | "globe" | "vault" | "bell"; t: string; s: string; st: "demo" | "plan" }[] = [
  { icon: "users", t: "役割ごとの権限", s: "見られる画面・押せるボタンを役割で分ける。権限を変えられるのはオーナーだけで、変更はすべて記録", st: "demo" },
  { icon: "factory", t: "工場には顧客情報を見せない", s: "工場の画面は担当の注文だけ。お客様の名前・連絡先・価格は表示しない", st: "demo" },
  { icon: "eye", t: "連絡先の伏せ字", s: "お客様の情報を見る権限がない人には、●●●● で表示", st: "demo" },
  { icon: "link", t: "お客様は自分の案件だけ", s: "期限つきの専用リンクで、ほかのお客様の情報には届かない", st: "demo" },
  { icon: "db", t: "データベース側でも守る（RLS）", s: "画面に不具合があっても、権限のないデータはデータベースが読ませない「行レベルの権限」", st: "plan" },
  { icon: "lock", t: "個人情報の暗号化", s: "電話番号・住所は AES-256 で暗号化して保存。万一データが漏れても読めない", st: "plan" },
  { icon: "key", t: "ログインの強化", s: "管理者は2段階認証。ログインの失敗が続くと一時的に止める", st: "plan" },
  { icon: "log", t: "操作の記録と通知", s: "CSVの書き出し・権限の変更・発注を記録。いつもと違う書き出しは、オーナーに通知", st: "plan" },
  { icon: "shield", t: "不正な送信を防ぐ", s: "フォームの連投制限、入力のチェック、ファイルの種類と大きさの確認、CSVの危険な文字の無害化", st: "plan" },
  { icon: "globe", t: "通信と画面の保護", s: "常に暗号化通信（HSTS）、読み込める先を限る設定（CSP）、他サイトへの埋め込みを禁止", st: "plan" },
  { icon: "vault", t: "秘密の鍵の管理", s: "APIキーは暗号化して保存。開発用のパソコンには本番の鍵を置かない", st: "plan" },
  { icon: "bell", t: "監視と事故への備え", s: "使っている部品の弱点と、鍵の混入を自動で点検。不審なアクセスの通知、バックアップ、事故の対応手順", st: "plan" },
];

const FEATURES = [
  ["下書きの自動作成", "問い合わせ・入金・承認をきっかけに、メールと発注書を自動で下書き。人は確認して送るだけ"],
  ["ロゴ配置イメージ", "お客様のロゴを、実物の写真に箔押し・素押しの見た目で重ね、修正の依頼と承認までやり取り"],
  ["カラー別の見積と数量割引", "色ごとの数量の合計で、単価が自動で下がる。あと何個で次の割引かも表示"],
  ["SKUとバリエーション", "カラー・サイズを登録しておき、組み合わせごとに品番。製品一覧には丸のカラーピッカー"],
  ["工場とのやり取り", "LINEのような画面。工場にはタイ語、日本には日本語で届く"],
  ["役割と権限", "オーナーだけが権限を変えられる。工場には顧客情報・価格を見せない"],
  ["スマホで完結", "下の小さなメニュー、押しやすい大きさ、文節で折り返す改行"],
];

const TECH = ["Next.js（App Router）", "Supabase（データベース・ログイン・ファイル保存・リアルタイム）", "行レベルの権限（RLS）", "Resend（メールの自動送信）", "@react-pdf（書類のPDF）", "翻訳API（タイ語・英語）"];

export default function Overview() {
  return (
    <main className="min-h-[100svh] bg-white text-ink">
      <header className="mx-auto max-w-6xl px-6 pt-16 pb-12 md:px-8 md:pt-24">
        <p className="font-display text-[12px] tracking-[0.4em] text-mute">CRAFT OEM / OVERVIEW</p>
        <h1 className="mt-5 text-[26px] leading-snug font-medium tracking-[0.04em] md:text-[38px]">
          <span className="inline-block">革小物のロゴ入れOEMを、</span><span className="inline-block">集客から納品まで。</span>
        </h1>
        <p className="mt-5 max-w-2xl text-[14px] leading-loose text-mute">
          <span className="inline-block">お客様が見るLPと見積もり、</span><span className="inline-block">社内の管理画面、</span><span className="inline-block">タイの工場とのやり取り、</span><span className="inline-block">お客様の確認画面までを、</span><span className="inline-block">ひとつのサービスとしてつないでいます。</span><span className="inline-block">このページから、すべての画面を確かめられます。</span>
        </p>
        <ul className="mt-6 flex flex-wrap gap-2 text-[12.5px]">
          {["下書きまで自動、送るのは人が確認して", "タイの工場と、それぞれの言葉でつながる", "顧客情報を守る、高いセキュリティ設計"].map((x) => <li key={x} className="rounded-full border border-line px-3.5 py-1.5"><Ph>{x}</Ph></li>)}
        </ul>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href={asset("/")} className="inline-flex items-center gap-2 bg-ink px-6 py-3.5 text-[13px] tracking-[0.1em] text-white transition hover:bg-gold">LPを見る<ArrowUpRight size={15} /></a>
          <a href={asset("/cms/")} className="inline-flex items-center gap-2 border border-ink px-6 py-3.5 text-[13px] tracking-[0.1em] transition hover:bg-ink hover:text-white">管理画面を見る<ArrowUpRight size={15} /></a>
        </div>
        <p className="mt-6 text-[11.5px] text-mute"><NoOrphan text="※ポートフォリオ用の制作サンプルです。会社名・金額・データはすべて架空で、操作した内容は見ている人のブラウザにだけ保存されます。" /></p>
      </header>

      {/* 自動化 */}
      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-6xl px-6 md:px-8">
          <p className="font-display text-[12px] tracking-[0.4em] text-mute">AUTOMATION</p>
          <h2 className="mt-3 text-[22px] leading-snug font-medium tracking-[0.04em] md:text-[30px]"><span className="inline-block">人がやるのは、</span><span className="inline-block">確認して押すだけ。</span></h2>
          <p className="mt-4 max-w-2xl text-[14px] leading-loose text-mute"><NoOrphan text="問い合わせ・入金・ロゴの承認をきっかけに、システムが返信・見積・発注書の下書きまで自動で作ります。お客様に送る前と、工場に発注する前には必ず人が確認するので、間違いが外に出ません。" n={5} /></p>

          {/* 数字で */}
          <dl className="mt-8 grid grid-cols-3 gap-px overflow-hidden border border-line bg-line text-center">
            {[["3回", "人が押すのは", "返信・配置案・工場への発注"], ["6種類", "自動で作る書類", "見積書から納品書まで"], ["3か国語", "自動で切り替え", "日本語・英語・タイ語"]].map(([n, k, v]) => (
              <div key={k} className="bg-white px-2 py-5 md:py-7">
                <dt className="text-[11.5px] text-mute md:text-[12.5px]">{k}</dt>
                <dd className="mt-1 font-display text-[28px] leading-none md:text-[40px]">{n}</dd>
                <dd className="mt-2 px-1 text-[10.5px] leading-snug text-mute md:text-[12px]"><Ph>{v}</Ph></dd>
              </div>
            ))}
          </dl>

          {/* 流れの中で、どこが自動か */}
          <div className="mt-8">
            <div className="flex flex-wrap items-center gap-4 text-[12px] text-mute">
              <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-ink" />自動</span>
              <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-[#2a4f9e]" />人が確認</span>
              <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full border border-ink/40 bg-white" />お客様</span>
            </div>
            <ol className="mt-3 flex flex-wrap gap-x-1.5 gap-y-2">
              {AUTO_STEPS.map((x, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  <span className={`rounded-full px-3 py-1.5 text-[12px] whitespace-nowrap ${x.by === "auto" ? "bg-ink text-white" : x.by === "human" ? "bg-[#2a4f9e] text-white" : "border border-ink/30 bg-white"}`}>{x.t}</span>
                  {i < AUTO_STEPS.length - 1 && <span className="text-[11px] text-mute">→</span>}
                </li>
              ))}
            </ol>
          </div>

          {/* これまで → このツールでは */}
          <ul className="mt-10 divide-y divide-line border-y border-line">
            {BEFORE_AFTER.map(([k, b, a]) => (
              <li key={k} className="grid gap-2 py-5 md:grid-cols-[11em_1fr_1.3fr] md:gap-6">
                <p className="text-[14px] font-medium">{k}</p>
                <p className="text-[12.5px] leading-relaxed text-mute"><span className="mr-2 inline-block rounded bg-[#f1f1f0] px-1.5 py-0.5 text-[10.5px]">これまで</span><NoOrphan text={b} n={5} /></p>
                <p className="text-[13px] leading-relaxed"><span className="mr-2 inline-block rounded bg-ink px-1.5 py-0.5 text-[10.5px] text-white">このツール</span><NoOrphan text={a} n={5} /></p>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[11.5px] text-mute"><NoOrphan text="※デモでは、入金は「カードで支払う（デモ）」のボタンで、メールは履歴に記録するだけです。本番では Stripe・銀行の入金データ・Resend とつなぎます。" n={5} /></p>
        </div>
      </section>

      {/* 流れ */}
      <section className="border-y border-line bg-paper py-14 md:py-20">
        <div className="mx-auto max-w-6xl px-6 md:px-8">
          <p className="font-display text-[12px] tracking-[0.4em] text-mute">FLOW</p>
          <h2 className="mt-3 text-[20px] font-medium tracking-[0.04em] md:text-[24px]">問い合わせから納品までの流れ</h2>
          <ol className="mt-8 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-7">
            {FLOW.map((f) => (
              <li key={f.n} className="bg-white px-4 py-5">
                <p className="font-display text-[13px] tracking-[0.2em] text-gold">{f.n}</p>
                <p className="mt-2 text-[14px] font-medium">{f.t}</p>
                <p className="mt-1 text-[12px] leading-relaxed text-mute"><NoOrphan text={f.s} n={5} /></p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 画面ごと */}
      {GROUPS.map((g) => (
        <section key={g.en} className="mx-auto max-w-6xl px-6 py-14 md:px-8 md:py-20">
          <p className="font-display text-[12px] tracking-[0.4em] text-mute">{g.en.toUpperCase()}</p>
          <h2 className="mt-3 text-[20px] font-medium tracking-[0.04em] md:text-[24px]">{g.ja}</h2>
          <p className="mt-2 text-[13.5px] text-mute"><NoOrphan text={g.lead} n={5} /></p>
          <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
            {g.screens.map((s) => (
              <li key={s.title}>
                <a href={asset(s.href)} className="group block">
                  <div className="overflow-hidden rounded-[22px] border border-line bg-[#f4f4f2] p-1.5 shadow-[0_8px_30px_rgba(0,0,0,.06)] transition group-hover:shadow-[0_12px_40px_rgba(0,0,0,.12)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={asset(`/images/overview/${s.img}.webp`)} alt={`${s.title}の画面`} loading="lazy" width={540} height={1052} className="block h-auto w-full rounded-[16px]" />
                  </div>
                  <p className="mt-3.5 flex items-start justify-between gap-2 text-[14px] font-medium leading-snug">
                    <span><Ph>{s.title}</Ph></span><ArrowUpRight size={15} className="mt-0.5 shrink-0 text-mute transition group-hover:text-gold" />
                  </p>
                </a>
                <p className="mt-1 text-[11.5px] text-gold">{s.who}</p>
                <ul className="mt-2 space-y-1 text-[12px] leading-relaxed text-ink/75">
                  {s.points.map((x) => <li key={x} className="flex gap-1.5"><span className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-ink/30" /><span><NoOrphan text={x} n={5} /></span></li>)}
                </ul>
              </li>
            ))}
          </ul>
        </section>
      ))}

      {/* セキュリティ */}
      <section className="bg-ink py-14 text-white md:py-20">
        <div className="mx-auto max-w-6xl px-6 md:px-8">
          <p className="font-display text-[12px] tracking-[0.4em] text-white/50">SECURITY</p>
          <h2 className="mt-3 text-[22px] leading-snug font-medium tracking-[0.04em] md:text-[30px]"><span className="inline-block">お客様の情報を守る、</span><span className="inline-block">高いセキュリティ設計。</span></h2>
          <p className="mt-4 max-w-2xl text-[14px] leading-loose text-white/70"><NoOrphan text="自社で開発・運営しているECプラットフォーム「Spider」と同じ水準の対策を、本番で導入する予定です。画面・データベース・通信・運用のそれぞれで、何重にも守ります。" n={5} /></p>
          <ul className="mt-8 grid gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
            {SECURITY.map((x) => {
              const I = SEC_ICON[x.icon];
              return (
                <li key={x.t} className="bg-ink px-5 py-5">
                  <div className="flex items-center justify-between gap-2">
                    <I size={20} strokeWidth={1.5} className="text-gold" />
                    <span className={`rounded-full px-2 py-0.5 text-[10.5px] ${x.st === "demo" ? "bg-white text-ink" : "border border-white/25 text-white/70"}`}>{x.st === "demo" ? "デモで動いています" : "本番で導入予定"}</span>
                  </div>
                  <p className="mt-3 text-[14.5px] font-medium">{x.t}</p>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-white/65"><NoOrphan text={x.s} n={5} /></p>
                </li>
              );
            })}
          </ul>
          <p className="mt-4 text-[11.5px] text-white/50">※「本番で導入予定」の項目は、このデモ（ポートフォリオ用の見本）には含まれていません。</p>
        </div>
      </section>

      {/* 主な機能・使う技術 */}
      <section className="border-t border-line bg-paper py-14 md:py-20">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 md:px-8 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <p className="font-display text-[12px] tracking-[0.4em] text-mute">FEATURES</p>
            <h2 className="mt-3 text-[20px] font-medium tracking-[0.04em] md:text-[24px]">主な機能</h2>
            <dl className="mt-6 divide-y divide-line border-y border-line">
              {FEATURES.map(([k, v]) => (
                <div key={k} className="grid gap-1 py-4 sm:grid-cols-[11em_1fr] sm:gap-4">
                  <dt className="text-[14px] font-medium">{k}</dt>
                  <dd className="text-[13px] leading-relaxed text-ink/75"><NoOrphan text={v} n={5} /></dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <p className="font-display text-[12px] tracking-[0.4em] text-mute">TECH</p>
            <h2 className="mt-3 text-[20px] font-medium tracking-[0.04em] md:text-[24px]">本番で使う仕組み</h2>
            <ul className="mt-6 flex flex-wrap gap-2">
              {TECH.map((x) => <li key={x} className="rounded-full border border-line bg-white px-3.5 py-2 text-[12.5px]"><Ph>{x}</Ph></li>)}
            </ul>
            <p className="mt-4 text-[12px] leading-relaxed text-mute">このデモでは、データを見ている人のブラウザに保存しています。各画面の「※本番では」に、本番でどの仕組みを使うかを書いています。</p>
          </div>
        </div>
      </section>

      <footer className="py-10 text-center">
        <p className="font-display text-[13px] tracking-[0.3em]">CRAFT <span className="text-gold">OEM</span></p>
        <p className="mt-2 text-[11px] text-mute">© CRAFT OEM (SAMPLE)</p>
      </footer>
    </main>
  );
}
