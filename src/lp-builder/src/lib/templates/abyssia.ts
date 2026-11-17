import type { Template } from "../types";

// ABYSSIA：世界観を見せる型。暗い背景に大きな写真を重ね、物語のように読ませる
export const abyssia: Template = {
  id: "abyssia",
  name: "ABYSSIA",
  kind: "世界観・体験・イベント",
  desc: "暗い背景と大きな写真で、章を読み進めるように世界観へ引き込む型。体験や空間を売るときに。",
  best: "イベント・展示・カフェ／バー・ホテル・アパレル・音楽など",
  fonts: "https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=Noto+Sans+JP:wght@300;400;500&family=Shippori+Mincho:wght@500;600&display=swap",
  colors: [
    { id: "accent", label: "光の色", value: "#62d6ff" },
    { id: "bg", label: "背景", value: "#03070f" },
    { id: "ink", label: "文字", value: "#e8f1fb" },
  ],
  slots: [
    { id: "hero", label: "メイン（横長）", ratio: [16, 9], min: 1200, max: 1920, where: "いちばん上の全面の写真", prompt: "{product}の世界観を表す、暗く幻想的な風景写真。深い青の闇の中に光が差し込み、奥行きがある。映画のワンシーンのような構図、中央は文字を置くため少し暗め。文字やロゴは入れない。横長16:9。", tips: "暗い場所で、光源（照明・窓・ネオン）を画面に入れると世界観が出ます。中央に文字が重なります。" },
    { id: "ch1", label: "第1章（縦長）", ratio: [2, 3], min: 600, max: 1000, where: "第1章の写真", prompt: "{product}を象徴するモチーフが、暗闇の中で淡く光っている縦長の写真。神秘的、静か、細部まで美しい。文字は入れない。縦長2:3。", tips: "主役になるモノを1つだけ、暗い背景で撮ると印象に残ります。" },
    { id: "ch2", label: "第2章（横長）", ratio: [16, 9], min: 1000, max: 1600, where: "第2章の写真", prompt: "{product}の空間を奥へ続くように見せる写真。左右に光が並ぶ通路、深い青、人の気配は小さく。文字は入れない。横長16:9。", tips: "通路や窓など、奥へ続く線がある場所を真ん中から撮ると引き込まれます。" },
    { id: "ch3", label: "第3章（縦長）", ratio: [2, 3], min: 600, max: 1000, where: "第3章の写真", prompt: "{target}の2人が、光る大きな景色を後ろ姿で見上げている縦長の写真。シルエット、静かな感動。顔は写さない。文字は入れない。縦長2:3。", tips: "人は後ろ姿・シルエットにすると、見る人が自分を重ねやすくなります。" },
    { id: "gal1", label: "ギャラリー1", ratio: [4, 3], min: 600, max: 1000, where: "ギャラリーの1枚目", prompt: "{product}の楽しみ方の一場面。暗い空間、青い光、上質な雰囲気。文字は入れない。横長4:3。", tips: "体験している場面（飲む・見る・触れる）を3枚そろえると伝わります。" },
    { id: "gal2", label: "ギャラリー2", ratio: [4, 3], min: 600, max: 1000, where: "ギャラリーの2枚目", prompt: "{product}に関連する小物のクローズアップ。暗い背景に青い光の反射、上質。文字は入れない。横長4:3。", tips: "アップの写真を1枚入れると、ギャラリーにリズムが出ます。" },
    { id: "gal3", label: "ギャラリー3", ratio: [4, 3], min: 600, max: 1000, where: "ギャラリーの3枚目", prompt: "{product}の空間全体が分かる引きの写真。光の演出、人は小さなシルエット。文字は入れない。横長4:3。", tips: "最後は空間全体が分かる引きの写真がおすすめです。" },
  ],
  fields: [
    { id: "brand", label: "名前（ブランド・施設）", group: "ファーストビュー", max: 20 },
    { id: "heroCopy", label: "キャッチコピー", group: "ファーストビュー", multiline: true, max: 24, hint: "詩のような短い一言。2行まで" },
    { id: "heroSub", label: "サブコピー", group: "ファーストビュー", multiline: true, max: 60 },
    { id: "ctaLabel", label: "ボタンの文字", group: "ファーストビュー", max: 16 },
    { id: "ctaUrl", label: "ボタンのリンク先", group: "ファーストビュー", url: true },
    { id: "ch1Label", label: "第1章の小見出し", group: "第1章", max: 16, hint: "英語の短い章名（例：Chapter I — Deep）" },
    { id: "ch1Title", label: "第1章の見出し", group: "第1章", multiline: true, max: 24 },
    { id: "ch1Body", label: "第1章の本文", group: "第1章", multiline: true, max: 120 },
    { id: "ch2Label", label: "第2章の小見出し", group: "第2章", max: 16 },
    { id: "ch2Title", label: "第2章の見出し", group: "第2章", multiline: true, max: 24 },
    { id: "ch2Body", label: "第2章の本文", group: "第2章", multiline: true, max: 120 },
    { id: "ch3Label", label: "第3章の小見出し", group: "第3章", max: 16 },
    { id: "ch3Title", label: "第3章の見出し", group: "第3章", multiline: true, max: 24 },
    { id: "ch3Body", label: "第3章の本文", group: "第3章", multiline: true, max: 120 },
    { id: "quote", label: "引用・ひとこと", group: "ギャラリー", multiline: true, max: 40, optional: true },
    { id: "info1L", label: "案内1の項目", group: "ご案内", max: 10, hint: "例：開催期間" },
    { id: "info1V", label: "案内1の内容", group: "ご案内", multiline: true, max: 50 },
    { id: "info2L", label: "案内2の項目", group: "ご案内", max: 10 },
    { id: "info2V", label: "案内2の内容", group: "ご案内", multiline: true, max: 50 },
    { id: "info3L", label: "案内3の項目", group: "ご案内", max: 10 },
    { id: "info3V", label: "案内3の内容", group: "ご案内", multiline: true, max: 50 },
    { id: "info4L", label: "案内4の項目", group: "ご案内", max: 10, optional: true },
    { id: "info4V", label: "案内4の内容", group: "ご案内", multiline: true, max: 50, optional: true },
    { id: "closing", label: "最後のひとこと", group: "最後", multiline: true, max: 30 },
    { id: "note", label: "注意書き", group: "最後", multiline: true, max: 120, optional: true },
  ],
  css: `.lpb-abyssia{--en:"Cinzel",serif;--min:"Shippori Mincho",serif;font-family:"Noto Sans JP",sans-serif;font-weight:300;background:var(--bg);color:var(--ink);font-size:15px;letter-spacing:.06em;overflow:hidden}
.lpb-abyssia .a-wrap{max-width:1120px;margin:0 auto;padding:0 24px}
.lpb-abyssia .a-btn{display:inline-flex;align-items:center;gap:.8em;padding:16px 40px;border:1px solid var(--accent);color:var(--ink);border-radius:999px;letter-spacing:.2em;font-size:13px;background:color-mix(in srgb,var(--accent) 10%,transparent);box-shadow:0 0 30px -8px var(--accent),inset 0 0 18px -10px var(--accent);transition:background .4s,box-shadow .4s}
.lpb-abyssia .a-btn:hover{background:color-mix(in srgb,var(--accent) 24%,transparent);box-shadow:0 0 44px -6px var(--accent)}
.lpb-abyssia .a-hero{position:relative;min-height:min(100vh,900px);display:grid;place-items:center;text-align:center;isolation:isolate}
.lpb-abyssia .a-hero .lpb-img{position:absolute;inset:0;width:100%;height:100%;z-index:-2;animation:aDrift 30s ease-in-out infinite alternate}
.lpb-abyssia .a-hero::after{content:"";position:absolute;inset:0;z-index:-1;background:radial-gradient(ellipse at center,rgba(0,0,0,.25),color-mix(in srgb,var(--bg) 85%,transparent) 75%),linear-gradient(to bottom,transparent 60%,var(--bg))}
.lpb-abyssia .a-logo{position:absolute;top:26px;left:0;right:0;font-family:var(--en);letter-spacing:.5em;font-size:15px;opacity:.9}
.lpb-abyssia h1{font-family:var(--min);font-weight:500;font-size:clamp(34px,5.6vw,72px);line-height:1.5;letter-spacing:.14em;text-shadow:0 0 40px color-mix(in srgb,var(--accent) 50%,transparent);animation:aGlow 2.6s .2s ease both}
.lpb-abyssia .a-sub{margin:26px auto 40px;max-width:560px;line-height:2.2;opacity:.85;animation:aGlow 2.6s .8s ease both}
.lpb-abyssia .a-hero-in{padding:120px 24px 100px}
.lpb-abyssia .a-scroll{position:absolute;bottom:26px;left:50%;width:1px;height:56px;background:linear-gradient(var(--accent),transparent);animation:aDrop 2.4s ease-in-out infinite}
.lpb-abyssia section{padding:110px 0;position:relative}
.lpb-abyssia .a-chap{display:grid;grid-template-columns:1fr 1fr;gap:72px;align-items:center}
.lpb-abyssia .a-chap.rev .lpb-img{order:2}
.lpb-abyssia .a-chap .lpb-img{border-radius:2px;box-shadow:0 30px 80px -30px color-mix(in srgb,var(--accent) 45%,transparent)}
.lpb-abyssia .a-label{display:block;font-family:var(--en);color:var(--accent);letter-spacing:.32em;font-size:12px;margin-bottom:18px}
.lpb-abyssia .a-h2{font-family:var(--min);font-weight:500;font-size:clamp(26px,3.4vw,40px);line-height:1.6;letter-spacing:.12em}
.lpb-abyssia .a-body{margin-top:26px;line-height:2.3;opacity:.82}
.lpb-abyssia .a-wide{text-align:center}
.lpb-abyssia .a-wide .a-body{max-width:620px;margin-left:auto;margin-right:auto}
.lpb-abyssia .a-wide .lpb-img{margin-top:56px;border-radius:2px;mask-image:linear-gradient(to bottom,#000 70%,transparent);-webkit-mask-image:linear-gradient(to bottom,#000 70%,transparent)}
.lpb-abyssia .a-gal{display:grid;grid-template-columns:1.3fr 1fr 1fr;gap:14px}
.lpb-abyssia .a-gal .lpb-img{height:100%;border-radius:2px;filter:saturate(1.1)}
.lpb-abyssia .a-quote{font-family:var(--min);font-size:clamp(20px,2.6vw,28px);text-align:center;margin-top:64px;line-height:1.9;letter-spacing:.14em}
.lpb-abyssia .a-info{max-width:760px;margin:46px auto 0;border-top:1px solid color-mix(in srgb,var(--accent) 35%,transparent)}
.lpb-abyssia .a-info div{display:grid;grid-template-columns:9em 1fr;gap:18px;padding:22px 6px;border-bottom:1px solid color-mix(in srgb,var(--ink) 14%,transparent)}
.lpb-abyssia .a-info dt{color:var(--accent);font-size:13px;letter-spacing:.16em}
.lpb-abyssia .a-info dd{line-height:2}
.lpb-abyssia .a-close{text-align:center;padding:140px 0;background:radial-gradient(ellipse at 50% 100%,color-mix(in srgb,var(--accent) 22%,transparent),transparent 65%)}
.lpb-abyssia .a-close .a-h2{margin-bottom:44px}
.lpb-abyssia footer{text-align:center;padding:36px 24px 44px;font-size:11px;opacity:.6;line-height:2}
.lpb-abyssia footer .a-flogo{display:block;font-family:var(--en);letter-spacing:.5em;font-size:14px;margin-bottom:8px}
@keyframes aDrift{from{transform:scale(1.04) translate(0,0)}to{transform:scale(1.12) translate(-1.5%,-1%)}}
@keyframes aGlow{from{opacity:0;filter:blur(8px)}to{opacity:1;filter:none}}
@keyframes aDrop{0%{transform:scaleY(0);transform-origin:top}50%{transform:scaleY(1);transform-origin:top}51%{transform-origin:bottom}100%{transform:scaleY(0);transform-origin:bottom}}
@media (max-width:760px){.lpb-abyssia{font-size:14px}.lpb-abyssia section{padding:76px 0}.lpb-abyssia .a-wrap{padding:0 20px}
.lpb-abyssia .a-hero{min-height:88vh}.lpb-abyssia .a-chap{grid-template-columns:1fr;gap:34px}.lpb-abyssia .a-chap.rev .lpb-img{order:0}
.lpb-abyssia .a-chap .lpb-img{max-width:380px;margin:0 auto;width:100%}
.lpb-abyssia .a-gal{grid-template-columns:1fr 1fr}.lpb-abyssia .a-gal .lpb-img:first-child{grid-column:1 / -1}
.lpb-abyssia .a-info div{grid-template-columns:1fr;gap:4px;padding:18px 4px}.lpb-abyssia .a-close{padding:100px 0}}`,
  render: ({ f, img, link, when }) => `
<div class="a-hero">
  ${img("hero")}
  ${f("brand", "div", "a-logo")}
  <div class="a-hero-in">${f("heroCopy", "h1")}${f("heroSub", "p", "a-sub")}${link("ctaLabel", "ctaUrl", "a-btn")}</div>
  <span class="a-scroll"></span>
</div>
<section><div class="a-wrap a-chap">
  ${img("ch1")}
  <div>${f("ch1Label", "span", "a-label")}${f("ch1Title", "h2", "a-h2")}${f("ch1Body", "p", "a-body")}</div>
</div></section>
<section class="a-wide"><div class="a-wrap">
  ${f("ch2Label", "span", "a-label")}${f("ch2Title", "h2", "a-h2")}${f("ch2Body", "p", "a-body")}
  ${img("ch2")}
</div></section>
<section><div class="a-wrap a-chap rev">
  ${img("ch3")}
  <div>${f("ch3Label", "span", "a-label")}${f("ch3Title", "h2", "a-h2")}${f("ch3Body", "p", "a-body")}</div>
</div></section>
<section><div class="a-wrap">
  <div class="a-gal">${img("gal1")}${img("gal2")}${img("gal3")}</div>
  ${when(["quote"], f("quote", "p", "a-quote"))}
</div></section>
<section><div class="a-wrap">
  <div class="a-wide"><span class="a-label">Information</span><h2 class="a-h2">ご案内</h2></div>
  <dl class="a-info">
    <div>${f("info1L", "dt")}${f("info1V", "dd")}</div>
    <div>${f("info2L", "dt")}${f("info2V", "dd")}</div>
    <div>${f("info3L", "dt")}${f("info3V", "dd")}</div>
    ${when(["info4L", "info4V"], `<div>${f("info4L", "dt")}${f("info4V", "dd")}</div>`)}
  </dl>
</div></section>
<section class="a-close"><div class="a-wrap">${f("closing", "h2", "a-h2")}${link("ctaLabel", "ctaUrl", "a-btn")}</div></section>
<footer>${f("brand", "span", "a-flogo")}${when(["note"], f("note", "p"))}</footer>`,
};
