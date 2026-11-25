"use client";

import { Ph, PhNodes } from "@/components/cms/Ph";

import Link from "next/link";
import { ArrowRight, BookOpen, ChevronDown, Lightbulb } from "lucide-react";
import { useState, type ReactNode } from "react";
import { STAGES } from "@/lib/cms";
import { useAuth, type Perm } from "@/components/cms/perm";
import { Card, Shell } from "@/components/cms/ui";
import { useLang, useUI } from "@/components/cms/i18n";
import { FactoryManual } from "./factory-manual";
import VoiceGuide, { ListenButton } from "@/components/VoiceGuide";

// 使い方マニュアル：だれが読んでも分かるように、短い文と手順で書く
type Chapter = { id: string; title: string; who: string; perm?: Perm; href?: string; body: ReactNode };

const Steps = ({ items }: { items: ReactNode[] }) => (
  <ol className="mt-3 space-y-2.5">
    {items.map((t, i) => (
      <li key={i} className="flex gap-3 text-[13.5px] leading-relaxed">
        <span data-say={`手順${i + 1}、`} className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink text-[11.5px] text-white">{i + 1}</span>
        <span className="pt-0.5">{typeof t === "string" ? <Ph tail={4}>{t}</Ph> : t}</span>
      </li>
    ))}
  </ol>
);
const Tip = ({ children }: { children: ReactNode }) => (
  <p className="mt-4 flex gap-2.5 rounded-lg bg-[#fbf7ee] px-4 py-3 text-[12.5px] leading-relaxed text-ink/85"><Lightbulb size={15} className="mt-0.5 shrink-0 text-gold" /><span>{typeof children === "string" ? <Ph tail={4}>{children}</Ph> : children}</span></p>
);
const P = ({ children, className = "" }: { children: ReactNode; className?: string }) => <p className={`text-[13.5px] leading-[1.9] text-ink/85 ${className}`}><PhNodes>{children}</PhNodes></p>;
const B = ({ children }: { children: ReactNode }) => <b className="font-semibold text-ink"><PhNodes>{children}</PhNodes></b>;

const CHAPTERS: Chapter[] = [
  {
    id: "start", title: "はじめに", who: "全員",
    body: (
      <>
        <P>この管理画面は、LPから届いたお問い合わせを、<B>見積 → 発注 → 製造（タイの工場）→ 国内検品 → 発送</B>まで、1つの画面で管理するためのものです。</P>
        <P>書類（見積書・発注依頼書・製造指示書など）とお客様へのメールは、<B>ボタンを押すと自動で作られ、送られます。</B>手で作る必要はありません。</P>
        <Tip>メニュー（スマホでは左上の「≡」）に出る項目は、あなたの役割によって変わります。必要な画面が無いときは、オーナーに権限をお願いしてください。</Tip>
      </>
    ),
  },
  {
    id: "login", title: "ログインと2段階認証", who: "全員",  href: "/cms/login/",
    body: (
      <>
        <P>管理画面には、メールアドレスとパスワードに加えて、<B>スマホの認証アプリに出る6桁のコード</B>でログインします（2段階認証）。パスワードが漏れても、スマホが無ければ入れません。</P>
        <Steps items={["メールアドレスとパスワードを入れて「次へ」", "スマホの認証アプリ（Google Authenticator など）を開き、出ている6桁のコードを入れる", "初めてのときは、画面のQRコードを認証アプリで読み取ってから、コードを入れる", "自分のスマホなら「30日間コードを省略」にチェックしてもよい"]} />
        <Tip>コードを5回間違えると、しばらくログインできなくなります。スマホをなくしたときは、オーナーに「メンバーと権限」で2段階認証をリセットしてもらってください。</Tip>
      </>
    ),
  },
  {
    id: "flow", title: "全体の流れ（9つの段階）", who: "全員",
    body: (
      <>
        <P>1つの案件は、次の順に進みます。案件の画面で「実行する」を押すと、次の段階に進みます。</P>
        <ol className="mt-4 grid gap-2 sm:grid-cols-3">
          {STAGES.map((s, i) => (
            <li key={s.id} className="rounded-lg border border-line px-3.5 py-3">
              <p className="text-[11px] text-mute">STEP {i + 1}</p>
              <p className="text-[13.5px] font-semibold"><Ph>{s.ja}</Ph></p>
              {s.next && <p className="mt-1 text-[11.5px] leading-relaxed text-mute">次：{s.next}</p>}
            </li>
          ))}
        </ol>
      </>
    ),
  },
  {
    id: "dashboard", title: "ダッシュボード：今日やることを確認する", who: "営業・オーナー", perm: "deals.view", href: "/cms/",
    body: (
      <>
        <P>毎朝まずここを開きます。いま何件動いているか、期日が近い案件はどれかが分かります。</P>
        <Steps items={["上の4つの数字（進行中・新しい問い合わせ・受注金額・製造中の数量）を確認する", "「期日のお知らせ」に赤や黄色の案件があれば、先に対応する", "数字や段階の行を押すと、その案件だけを絞り込んだ一覧が開く"]} />
        <Tip>「1日遅れ」と赤く出ている案件は、期日を過ぎています。お客様や工場への連絡を優先しましょう。</Tip>
      </>
    ),
  },
  {
    id: "deals", title: "案件ボード：すべての案件を見る", who: "営業・オーナー", perm: "deals.view", href: "/cms/deals/",
    body: (
      <>
        <P>案件が段階ごとの列に並んでいます。カードを押すと、その案件の画面が開きます。</P>
        <Steps items={["右上の「ボード／一覧」で見え方を切り替える（一覧は表の形）", "検索欄にブランド名や案件番号を入れて探す", "スマホでは、列を横にスワイプして見る"]} />
      </>
    ),
  },
  {
    id: "deal", title: "案件を進める：見積から発送まで", who: "営業・オーナー", perm: "deals.advance", href: "/cms/deals/",
    body: (
      <>
        <P>案件の画面の上に<B>「次にやること」</B>が出ています。内容を確認して「実行する」を押すだけで進みます。</P>
        <Steps items={["「次にやること」を読む（例：見積を作成して送る）", "注文内容・金額に間違いがないか確認する", "「実行する」を押し、確認の画面で「実行する」をもう一度押す", "書類が自動で作られ、お客様にメールが届く（下の履歴に残る）"]} />
        <Tip>間違えて進めたときは、「1つ前に戻す」で戻せます。ただし、すでに送ったメールは取り消されないので、必要ならお客様に一言連絡してください。</Tip>
        <P className="mt-3">電話などで話した内容は、「やり取りの履歴」のメモ欄に残しておくと、ほかの人にも伝わります。</P>
      </>
    ),
  },
  {
    id: "proof", title: "ロゴ配置イメージ：お客様に確認してもらう", who: "営業・オーナー", perm: "deals.advance", href: "/cms/deals/?stage=order",
    body: (
      <>
        <P>案件の画面の「ロゴ配置イメージ」で、実際の製品の写真にお客様のロゴを重ねた画像を作ります。箔押し（金・銀）や素押しの見た目で表示されます。</P>
        <Steps items={["LPのフォームでロゴが届いていれば、自動で表示される（届いていなければ「ロゴをアップロード」）", "「左右」「上下」「大きさ」のつまみで位置を合わせる（大きさはcmで表示。刻印できる 縦1〜5cm × 横3.5〜7cm の範囲でしか動かない）", "「ロゴ配置イメージを送る」を押すと、お客様の画面に届く", "お客様が「この配置で承認する」を押すと、製造に進む"]} />
        <Tip>お客様から「修正をお願いする」が届いたら、黄色い枠に依頼の内容が出ます。位置を直してから「修正版を送る」を押すと、第2版としてお客様に届きます。承認された配置は、工場の製造指示書にもそのまま載ります。</Tip>
      </>
    ),
  },
  {
    id: "auto", title: "確認待ち：自動で作った下書きを送る", who: "営業・オーナー", perm: "deals.advance", href: "/cms/inbox/",
    body: (
      <>
        <P>問い合わせ・入金・ロゴの承認があると、システムが<B>メールや発注書の下書きを自動で作ります</B>。人は「確認待ち」で内容を確かめて、送るだけです。</P>
        <Steps items={["メニューの「確認待ち」（ダッシュボードにも出る）を開く", "下書きを選び、宛先・件名・本文・添付（見積書や配置イメージ）を確かめる。必要なら直す", "「確認して送信」を押す（送ると、案件は次の段階へ自動で進む）", "工場への発注だけは「最終確認して工場へ発注」。製品・カラーごとの数量・ロゴの大きさを確かめてから押す"]} />
        <Tip>自動で進むもの：問い合わせの登録、見積の計算、お客様の承諾による注文の確定と請求書、前金の入金確認と領収のお知らせ、入金がないときのお願いの下書き。人が決めるもの：返信・配置案の送信と、タイの工場への発注です。</Tip>
      </>
    ),
  },
  {
    id: "msgs", title: "工場との連絡：LINEのようにやり取りする", who: "営業・オーナー", perm: "deals.view", href: "/cms/messages/",
    body: (
      <>
        <P>工場とのやり取りだけを、案件ごとに並べた画面です。メニューの「工場との連絡」（スマホでは下の吹き出しのアイコン）から開きます。</P>
        <Steps items={["一覧で、ブランド名・製品の写真・最後の連絡を見る（未読は赤い数字）", "押すと会話が開く。上に、どの商品の話か（製品・数量・色・段階）が出る", "よく使う文を押すと入力欄に入る。必要なら書き足して「送る」（工場の人にはタイ語で届く）", "「案件」を押すと、その案件の画面がそのまま開く"]} />
      </>
    ),
  },
  {
    id: "docs", title: "書類を見る・印刷する", who: "営業・オーナー", perm: "deals.view",
    body: (
      <>
        <P>案件の画面の右側「書類（自動で作成）」から開きます。まだ作られていない書類は、どの段階で作られるかが表示されます。</P>
        <Steps items={["書類の「開く」を押す", "内容を確認する", "右上の「印刷・PDFで保存」を押す（PDFで保存してメールに添付もできる）"]} />
      </>
    ),
  },
  {
    id: "products", title: "商品管理：商品を登録する", who: "営業・オーナー", perm: "products.edit", href: "/cms/products/",
    body: (
      <>
        <P>ここで登録・公開した商品が、LPの「製品一覧」ページに表示されます。</P>
        <Steps items={["「商品を追加」を押す", "メイン画像を1枚選ぶ（サブ画像は10枚まで、まとめて選べる）", "カテゴリ・名前・特徴・サイズ・参考単価を入れる", "動画があれば YouTube か Vimeo のURLを入れる", "「SKU品番とバリエーション」で基本の品番を入れる。カラーやサイズがある商品は「バリエーションがある」にチェックし、種類（カラー・サイズ・自由に入力）を選ぶ。カラーとサイズは、登録してあるものを押して選ぶ", "組み合わせごとにSKUを入れる（「空欄のSKUを自動で作る」で CR-TT-BK-M のように一度に作れる。扱わない組み合わせはチェックを外す）", "「保存する」を押す（SKUに空欄や、ほかと同じ品番があると保存できない）"]} />
        <Tip>「公開中／非公開」を押すと、製品一覧に出すかどうかをすぐに切り替えられます。カテゴリ・カラー・サイズは、右側（スマホでは下）の欄で先に登録しておきます。カラーは色（製品一覧の丸に出る）と記号（BKなど、SKUの自動作成に使う）を決めます。SKUごとに、丸に出す色を変えることもできます（組み合わせの左の丸を押す）。</Tip>
      </>
    ),
  },
  {
    id: "pricing", title: "価格と割引：数量割引と版代を変える", who: "オーナー", perm: "money.view", href: "/cms/pricing/",
    body: (
      <>
        <P>数量割引（何個から何%引き）・版代・最小ロットを決める画面です。変えられるのは<B>オーナーだけ</B>です。</P>
        <Steps items={["メニューの「価格と割引」を開く", "数量割引の段階を直す（「段階を追加」で増やせる。例：500個以上で18%引き）", "版代と最小ロットを直す", "右の「単価の見本」で、製品ごとの単価を確かめてから「保存する」"]} />
        <Tip>保存すると、LPの見積もり・シミュレーター・製品一覧と、これから作る見積にすぐ反映されます。すでに見積を送った案件は、送った時点の金額のまま変わりません。</Tip>
      </>
    ),
  },
  {
    id: "factory", title: "工場の画面：製造の進み具合を入れる", who: "工場", perm: "factory.use", href: "/cms/factory/",
    body: (
      <>
        <P>タイの工場の方が使う画面です。工場の方がログインすると、<B>メニューやマニュアルも含めて最初からタイ語</B>で表示されます。お客様の名前や販売価格は表示されません。</P>
        <Steps items={["「製造指示書」を開いて、作る内容を確認する", "工程（裁断→縫製→箔押し→仕上げ・梱包）が終わるたびに「完了にする」を押す", "写真を登録する", "4つの工程が終わったら「日本へ出荷」を押す"]} />
        <P className="mt-3">工場からの連絡（「日本への連絡」）は、ダッシュボードの「工場からの連絡」と、案件の画面の「工場との連絡」に<B>日本語で</B>届き、そこから返信できます（工場の人にはタイ語で届きます）。オーナーが工場の人と同じ画面を見たいときは、右上かメニューの「表示する言語」で切り替えます。</P>
        <Tip>間違えて完了にしたときは、最後に完了したチェックマークを押すと取り消せます（出荷前のみ）。</Tip>
      </>
    ),
  },
  {
    id: "inspect", title: "国内検品：届いた商品をチェックする", who: "検品担当", perm: "inspect.use", href: "/cms/inspect/",
    body: (
      <>
        <P>日本に届いた商品を検品する画面です。スマホで使えます。</P>
        <Steps items={["6つのチェック項目を確認し、問題がなければ1つずつ押してチェックを付ける", "不良品があれば「＋」で数を入れる", "写真を登録する", "すべてチェックしたら「検品OK・発送する」を押す（検品報告書と納品書が自動で作られる）"]} />
      </>
    ),
  },
  {
    id: "portal", title: "お客様の画面：お客様に見えるもの", who: "営業・オーナー", perm: "deals.view", href: "/cms/portal/?id=C-1027",
    body: (
      <>
        <P>お客様には専用のリンクがメールで届き、ログインなしで自分の案件だけを見られます。お客様はこの画面で<B>見積の承諾</B>と<B>ロゴ配置の承認</B>（または修正の依頼）ができます。</P>
        <Tip>お客様が承諾・承認すると、自動で次の段階に進みます。営業側で「実行する」を押す必要はありません。</Tip>
      </>
    ),
  },
  {
    id: "analytics", title: "アナリティクス：数字を見る・CSVで出す", who: "オーナー・経理", perm: "analytics.view", href: "/cms/analytics/",
    body: (
      <>
        <P>売上・受注件数・成約率・不良率などを、グラフで確認できます。ページの一番上で選んだ<B>期間と並び順</B>が、すべての数字・グラフ・表・CSVに使われます。</P>
        <Steps items={["ページ上部で期間（直近3・6・12か月、または開始月〜終了月）と並び順を選ぶ", "グラフの棒に触れると、その月の数字が出る（「表で見る」で、選んだ並び順の表になる）", "「CSVでダウンロード」で種類（月ごとの集計／案件の一覧）を選ぶ", "「ダウンロード」を押すと、上の条件どおりに並んだ、Excelで開けるファイルが保存される"]} />
        <Tip>権限によって、CSVに入る項目が変わります（金額やお客様の連絡先は、見る権限がある人のファイルにだけ入ります）。</Tip>
      </>
    ),
  },
  {
    id: "members", title: "メンバーと権限：だれが何をできるか決める", who: "オーナー", perm: "members.manage", href: "/cms/members/",
    body: (
      <>
        <P>権限の付与・変更は<B>オーナーだけ</B>ができます。</P>
        <Steps items={["新しい人は、名前・メール・役割を入れて「招待する」", "役割ごとの権限は、表のチェックで変える", "1人だけ例外にしたいときは「個別設定」で、その人だけ許可・禁止する", "新しい役割（例：経理）は「役割を作る」で増やせる", "「セキュリティ」で、毎週の脆弱性チェックの結果を確認する（問題があれば、担当者にメールも届く）", "メンバーごとに、画面の言語（日本語／ไทย／English）を選べる。タイの工場の人は「ไทย」にする"]} />
        <Tip>変更はすべて「権限の変更履歴」に残ります。左下の「表示中」で人を切り替えると、その人の見え方を試せます（デモ用）。</Tip>
      </>
    ),
  },
];

const FAQ = [
  { q: "自動で作った下書きは、そのまま送られてしまいますか？", a: "送られません。下書きは「確認待ち」に入るだけで、人が「確認して送信」を押したときだけ送られます。工場への発注も、最終確認の画面で「発注する」を押すまでは行われません。" },
  { q: "間違えてボタンを押してしまいました", a: "大事な操作の前には確認の画面が出ます。進めてしまった場合も、案件の画面の「1つ前に戻す」や、工場の画面のチェックマークを押せば戻せます。" },
  { q: "メニューに必要な画面がありません", a: "あなたの役割に、その画面の権限がありません。オーナーに「メンバーと権限」で権限を付けてもらってください。" },
  { q: "工場からの連絡は、どこで見られますか？", a: "メニューの「工場との連絡」に、案件ごとにまとまっています（未読は赤い数字）。ダッシュボードの「工場からの連絡」からも開けます。返信もここからでき、工場の人にはタイ語で届きます。" },
  { q: "スマホでも使えますか？", a: "はい。すべての画面がスマホで使えます。画面の下のタブで、よく使う画面にすぐ移動できます（ほかの画面は「その他」から）。案件の画面では、次にやることのボタンが画面の下に固定されます。「※本番では」の説明は1行だけ表示され、押すと全文が開きます。" },
  { q: "お客様の連絡先が「●●●●」になっています", a: "お客様の名前・連絡先を見る権限がない場合、伏せて表示されます。必要ならオーナーに相談してください。" },
  { q: "書類の内容を手で直したいです", a: "書類は注文内容から自動で作られます。数量や仕様を変えたいときは、案件の注文内容を直すと書類にも反映されます（本番の仕様）。" },
];

const WORDS = [
  ["案件", "1件のお問い合わせから納品までの、ひとまとまりの仕事"],
  ["段階", "案件がいまどこまで進んでいるか（問い合わせ・見積送付・製造中など）"],
  ["版代", "ロゴを押すための型（版）の費用。デザインごとに初回だけかかる"],
  ["箔押し", "金や銀の箔を、熱と圧で革にロゴとして押す加工"],
  ["素押し", "箔を使わず、革そのものにロゴを刻む加工"],
  ["ロット", "1回の注文の個数（30個から）"],
  ["権限", "その人が見られる画面・押せるボタンの範囲"],
];

export default function Manual() {
  const { can, role, me } = useAuth();
  const { lang } = useLang();
  const t = useUI();
  const [open, setOpen] = useState<number | null>(0);
  // タイ語・英語のときは、工場向けのマニュアルを表示
  if (lang !== "ja") return <Shell title={t.nav.manual}><FactoryManual lang={lang} name={me?.name ?? ""} canFactory={can("factory.use")} /></Shell>;
  const mine = CHAPTERS.filter((c) => c.perm && can(c.perm));

  return (
    <Shell title="使い方マニュアル">
      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        {/* 目次 */}
        <nav className="hidden lg:block">
          <div className="sticky top-8 space-y-0.5 text-[12.5px]">
            <p className="mb-2 px-3 text-[11px] text-mute">目次</p>
            {CHAPTERS.map((c) => <a key={c.id} href={`#${c.id}`} className="block rounded-md px-3 py-1.5 text-ink/70 hover:bg-white hover:text-ink">{c.title.split("：")[0]}</a>)}
            <a href="#faq" className="block rounded-md px-3 py-1.5 text-ink/70 hover:bg-white hover:text-ink">困ったとき</a>
            <a href="#words" className="block rounded-md px-3 py-1.5 text-ink/70 hover:bg-white hover:text-ink">言葉の説明</a>
          </div>
        </nav>

        <div className="space-y-5">
          <Card className="px-6 py-6">
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink text-white"><BookOpen size={19} /></span>
              <div>
                <p className="text-[15px] font-semibold">{role ? `あなたは「${role.name}」です` : "ようこそ"}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-mute">まず「はじめに」と「全体の流れ」を読み、そのあと下の、あなたに関係する章を読んでください。</p>
                <div className="mt-4"><VoiceGuide lang="ja" sections={[...CHAPTERS.map((c) => ({ id: c.id, title: c.title })), { id: "faq", title: "困ったとき", text: "困ったとき。" + FAQ.map((f) => `${f.q}。${f.a}`).join("") }, { id: "words", title: "言葉の説明" }].map((x) => ({ ...x, audio: `/audio/manual-${x.id}.mp3` }))} /></div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {mine.map((c) => <a key={c.id} href={`#${c.id}`} className="rounded-full bg-[#f1f1f0] px-3.5 py-2.5 text-[12.5px] hover:bg-ink hover:text-white">{c.title.split("：")[0]}</a>)}
                </div>
              </div>
            </div>
          </Card>

          {CHAPTERS.map((c, i) => (
            <Card key={c.id} className="scroll-mt-20" >
              <section id={c.id} className="scroll-mt-20 px-6 py-6">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h2 className="text-[17px] font-semibold"><span data-nosay className="mr-2 text-[12px] font-normal text-mute">{String(i + 1).padStart(2, "0")}</span><Ph>{c.title}</Ph></h2>
                  <span className="flex items-center gap-3"><ListenButton id={c.id} /><span data-say={`対象は${c.who}です。`} className="rounded-full bg-[#f1f1f0] px-2.5 py-0.5 text-[11px] text-mute">対象：{c.who}</span></span>
                </div>
                <div className="mt-3 space-y-2">{c.body}</div>
                {c.href && (!c.perm || can(c.perm)) && (
                  <Link data-nosay href={c.href} className="tap mt-5 inline-flex items-center gap-1.5 text-[12.5px] font-medium underline underline-offset-4 hover:text-gold">この画面を開く <ArrowRight size={14} /></Link>
                )}
              </section>
            </Card>
          ))}

          <Card>
            <section id="faq" className="scroll-mt-20 px-6 py-6">
              <h2 className="text-[17px] font-semibold">困ったとき</h2>
              <div className="mt-3 divide-y divide-line border-y border-line">
                {FAQ.map((f, i) => (
                  <div key={f.q}>
                    <button type="button" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i} className="flex w-full items-center gap-3 py-4 text-left text-[13.5px] font-medium">
                      <span className="flex-1"><Ph>{f.q}</Ph></span><ChevronDown size={16} className={`shrink-0 text-mute transition ${open === i ? "rotate-180" : ""}`} />
                    </button>
                    {open === i && <p className="pb-4 text-[13px] leading-[1.9] text-ink/80"><Ph tail={4}>{f.a}</Ph></p>}
                  </div>
                ))}
              </div>
            </section>
          </Card>

          <Card>
            <section id="words" className="scroll-mt-20 px-6 py-6">
              <h2 className="text-[17px] font-semibold">言葉の説明</h2>
              <dl className="mt-3 divide-y divide-line border-y border-line text-[13px]">
                {WORDS.map(([k, v]) => (
                  <div key={k} className="flex gap-4 py-3"><dt className="w-16 shrink-0 font-semibold">{k}</dt><dd className="leading-relaxed text-ink/80"><Ph tail={4}>{v}</Ph></dd></div>
                ))}
              </dl>
            </section>
          </Card>
        </div>
      </div>
    </Shell>
  );
}
