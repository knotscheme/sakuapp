import type { Template } from "../types";

// SORAE：化粧品・スキンケア向け。白と余白で、やさしく上品に見せる型
export const sorae: Template = {
  id: "sorae",
  name: "SORAE",
  kind: "化粧品・スキンケア",
  desc: "白と余白を生かした、やさしく上品な型。商品写真とモデル写真で、使う気分を伝えます。",
  best: "化粧水・美容液・ヘアケア・サプリ・アロマなど",
  fonts: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Noto+Sans+JP:wght@300;400;500&family=Noto+Serif+JP:wght@400;500&display=swap",
  colors: [
    { id: "accent", label: "アクセント", value: "#b0846c" },
    { id: "bg", label: "背景", value: "#faf7f3" },
    { id: "ink", label: "文字", value: "#3a3330" },
  ],
  slots: [
    { id: "hero", label: "メイン（商品）", ratio: [3, 4], min: 700, max: 1200, where: "いちばん上の大きな写真", prompt: "{product}の商品写真。白いボトルを淡いベージュの石の台に置き、やわらかい朝の自然光、背景はクリーム色の無地、余白を広く、高級感のあるミニマルなスキンケア広告の雰囲気。文字やロゴは入れない。縦長。", tips: "白い紙を背景に、窓の横で撮ると影がやわらかくなります。商品は少し上から、ラベルが正面に見える向きで。" },
    { id: "mood", label: "使っている人", ratio: [4, 5], min: 600, max: 1000, where: "「はじめに」の横", prompt: "{target}の女性が、洗面台の前で目を閉じて頬に手を当てている。素肌感のある自然なメイク、白いタオル、やわらかい光、清潔感。顔は横向きか目を閉じた表情で。文字は入れない。縦長。", tips: "顔をはっきり出さず、手元や横顔でも雰囲気は伝わります。肖像の使用許可を必ず取ってください。" },
    { id: "use", label: "使い方（手元）", ratio: [4, 5], min: 600, max: 1000, where: "「使い方」の写真", prompt: "手のひらに{product}を少量出しているクローズアップ。白い背景、やわらかい光、肌の質感がきれいに見える。文字は入れない。縦長。", tips: "手のひらを真上から。爪や手の乾燥が目立たないよう、保湿してから撮ると仕上がりがきれいです。" },
    { id: "lab", label: "こだわり（製造・研究）", ratio: [4, 3], min: 700, max: 1200, where: "「こだわり」の写真", prompt: "清潔な研究室で、白衣の研究員が{product}の品質を確認している様子。明るく白い室内、ガラス器具、信頼感のある雰囲気。顔ははっきり写さない。文字は入れない。横長。", tips: "工場や作業場の写真があれば一番説得力があります。原料や道具を並べた写真でも代わりになります。" },
  ],
  fields: [
    { id: "brand", label: "ブランド名", group: "ファーストビュー", max: 20, hint: "ブランド名（ロゴの代わりに表示）" },
    { id: "heroCopy", label: "キャッチコピー", group: "ファーストビュー", multiline: true, max: 24, hint: "2行までの短いキャッチコピー。改行で行を分ける" },
    { id: "heroSub", label: "サブコピー", group: "ファーストビュー", multiline: true, max: 60, hint: "キャッチを補う一文" },
    { id: "price", label: "価格", group: "ファーストビュー", max: 30, hint: "例：120mL 3,960円（税込）" },
    { id: "ctaLabel", label: "ボタンの文字", group: "ファーストビュー", max: 14, hint: "購入ボタンの文字" },
    { id: "ctaUrl", label: "ボタンのリンク先", group: "ファーストビュー", url: true },
    { id: "introTitle", label: "はじめにの見出し", group: "はじめに", multiline: true, max: 30, hint: "悩みに寄りそう見出し" },
    { id: "introBody", label: "はじめにの本文", group: "はじめに", multiline: true, max: 160, hint: "悩みと、この商品が生まれた理由" },
    { id: "feat1T", label: "特長1の見出し", group: "3つの特長", max: 20 },
    { id: "feat1B", label: "特長1の説明", group: "3つの特長", multiline: true, max: 70 },
    { id: "feat2T", label: "特長2の見出し", group: "3つの特長", max: 20 },
    { id: "feat2B", label: "特長2の説明", group: "3つの特長", multiline: true, max: 70 },
    { id: "feat3T", label: "特長3の見出し", group: "3つの特長", max: 20 },
    { id: "feat3B", label: "特長3の説明", group: "3つの特長", multiline: true, max: 70 },
    { id: "useTitle", label: "使い方の見出し", group: "使い方", max: 20 },
    { id: "use1", label: "手順1", group: "使い方", max: 40 },
    { id: "use2", label: "手順2", group: "使い方", max: 40 },
    { id: "use3", label: "手順3", group: "使い方", max: 40 },
    { id: "labTitle", label: "こだわりの見出し", group: "こだわり", multiline: true, max: 30 },
    { id: "labBody", label: "こだわりの本文", group: "こだわり", multiline: true, max: 140, hint: "作り方・品質・安全性" },
    { id: "voice1", label: "お客様の声1", group: "お客様の声", multiline: true, max: 70, optional: true, hint: "実際にいただいた声だけを書く（作り話は書かない）" },
    { id: "voice1Name", label: "声1の名前", group: "お客様の声", max: 20, optional: true },
    { id: "voice2", label: "お客様の声2", group: "お客様の声", multiline: true, max: 70, optional: true, hint: "実際にいただいた声だけを書く" },
    { id: "voice2Name", label: "声2の名前", group: "お客様の声", max: 20, optional: true },
    { id: "faq1Q", label: "質問1", group: "よくある質問", max: 40, optional: true },
    { id: "faq1A", label: "答え1", group: "よくある質問", multiline: true, max: 100, optional: true },
    { id: "faq2Q", label: "質問2", group: "よくある質問", max: 40, optional: true },
    { id: "faq2A", label: "答え2", group: "よくある質問", multiline: true, max: 100, optional: true },
    { id: "faq3Q", label: "質問3", group: "よくある質問", max: 40, optional: true },
    { id: "faq3A", label: "答え3", group: "よくある質問", multiline: true, max: 100, optional: true },
    { id: "closing", label: "最後のひとこと", group: "最後", multiline: true, max: 40 },
    { id: "note", label: "注意書き", group: "最後", multiline: true, max: 120, optional: true, hint: "効果の感じ方には個人差があります、など" },
  ],
  css: `.lpb-sorae{--serif:"Noto Serif JP",serif;--en:"Cormorant Garamond",serif;font-family:"Noto Sans JP",sans-serif;font-weight:300;background:var(--bg);color:var(--ink);font-size:15px;letter-spacing:.04em}
.lpb-sorae .s-wrap{max-width:1080px;margin:0 auto;padding:0 24px}
.lpb-sorae .s-top{display:flex;justify-content:space-between;align-items:center;padding:22px 24px;max-width:1180px;margin:0 auto}
.lpb-sorae .s-logo{font-family:var(--en);font-size:24px;letter-spacing:.32em;font-weight:600}
.lpb-sorae .s-btn{display:inline-flex;align-items:center;justify-content:center;gap:.6em;background:var(--accent);color:#fff;border-radius:999px;padding:16px 38px;font-size:14px;font-weight:400;letter-spacing:.12em;transition:transform .3s,box-shadow .3s;box-shadow:0 10px 30px -12px var(--accent)}
.lpb-sorae .s-btn:hover{transform:translateY(-2px)}
.lpb-sorae .s-btn.sm{padding:10px 22px;font-size:12px;box-shadow:none}
.lpb-sorae .s-hero{display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:center;max-width:1180px;margin:0 auto;padding:24px 24px 96px}
.lpb-sorae .s-hero .lpb-img{border-radius:220px 220px 6px 6px;animation:sFade 1.6s ease both}
.lpb-sorae .s-eyebrow{font-family:var(--en);color:var(--accent);letter-spacing:.3em;font-size:14px;text-transform:uppercase}
.lpb-sorae h1{font-family:var(--serif);font-weight:400;font-size:clamp(30px,4.4vw,52px);line-height:1.55;letter-spacing:.08em;margin:18px 0 22px;animation:sUp 1.4s .2s ease both}
.lpb-sorae .s-sub{font-size:15px;line-height:2.1;opacity:.85}
.lpb-sorae .s-price{margin:30px 0 22px;font-family:var(--serif);font-size:15px;letter-spacing:.1em}
.lpb-sorae section{padding:96px 0}
.lpb-sorae .s-h2{font-family:var(--serif);font-weight:400;font-size:clamp(23px,2.8vw,32px);line-height:1.7;letter-spacing:.08em}
.lpb-sorae .s-label{display:block;font-family:var(--en);color:var(--accent);letter-spacing:.3em;font-size:13px;margin-bottom:14px}
.lpb-sorae .s-intro{display:grid;grid-template-columns:.9fr 1.1fr;gap:64px;align-items:center}
.lpb-sorae .s-intro .lpb-img{border-radius:4px}
.lpb-sorae .s-body{margin-top:24px;line-height:2.2;font-size:15px}
.lpb-sorae .s-feats{background:#fff}
.lpb-sorae .s-center{text-align:center}
.lpb-sorae .s-grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:28px;margin-top:56px}
.lpb-sorae .s-card{padding:40px 30px;border:1px solid color-mix(in srgb,var(--accent) 22%,transparent);border-radius:4px;background:var(--bg)}
.lpb-sorae .s-num{font-family:var(--en);font-size:40px;color:var(--accent);line-height:1}
.lpb-sorae .s-card h3{font-family:var(--serif);font-weight:500;font-size:18px;margin:18px 0 12px;letter-spacing:.06em}
.lpb-sorae .s-card p{font-size:14px;line-height:2}
.lpb-sorae .s-use{display:grid;grid-template-columns:1.1fr .9fr;gap:64px;align-items:center}
.lpb-sorae .s-steps{list-style:none;margin-top:30px;counter-reset:st}
.lpb-sorae .s-steps li{counter-increment:st;display:flex;gap:18px;align-items:baseline;padding:18px 0;border-bottom:1px solid color-mix(in srgb,var(--ink) 12%,transparent)}
.lpb-sorae .s-steps li::before{content:"0" counter(st);font-family:var(--en);color:var(--accent);font-size:22px}
.lpb-sorae .s-use .lpb-img{border-radius:4px}
.lpb-sorae .s-lab{background:#fff}
.lpb-sorae .s-lab .lpb-img{border-radius:4px;margin-top:44px}
.lpb-sorae .s-labtext{max-width:640px;margin:0 auto}
.lpb-sorae .s-voices{display:grid;grid-template-columns:1fr 1fr;gap:28px;margin-top:48px}
.lpb-sorae blockquote{background:#fff;padding:36px;border-radius:4px;font-family:var(--serif);font-size:15px;line-height:2.1;position:relative}
.lpb-sorae blockquote::before{content:"\\201C";font-family:var(--en);font-size:64px;color:var(--accent);position:absolute;top:-6px;left:22px;opacity:.5}
.lpb-sorae cite{display:block;margin-top:16px;font-style:normal;font-family:"Noto Sans JP",sans-serif;font-size:12px;opacity:.65}
.lpb-sorae .s-faq{max-width:760px;margin:44px auto 0}
.lpb-sorae details{border-bottom:1px solid color-mix(in srgb,var(--ink) 14%,transparent);padding:22px 4px}
.lpb-sorae summary{display:flex;justify-content:space-between;gap:16px;font-weight:400}
.lpb-sorae summary::after{content:"+";color:var(--accent);font-size:20px;line-height:1}
.lpb-sorae details[open] summary::after{content:"−"}
.lpb-sorae details p{margin-top:12px;font-size:14px;line-height:2;opacity:.85}
.lpb-sorae .s-close{background:var(--accent);color:#fff;text-align:center}
.lpb-sorae .s-close .s-h2{font-size:clamp(24px,3.2vw,36px)}
.lpb-sorae .s-close .s-btn{background:#fff;color:var(--accent);margin-top:36px;box-shadow:none}
.lpb-sorae .s-close .s-price{margin:20px 0 0}
.lpb-sorae footer{padding:40px 24px;text-align:center;font-size:11px;opacity:.7;line-height:2}
.lpb-sorae footer .s-logo{font-size:18px;display:block;margin-bottom:10px;opacity:1}
@keyframes sFade{from{opacity:0;transform:scale(1.03)}to{opacity:1;transform:none}}
@keyframes sUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
@media (max-width:760px){.lpb-sorae{font-size:14px}.lpb-sorae section{padding:68px 0}
.lpb-sorae .s-hero,.lpb-sorae .s-intro,.lpb-sorae .s-use{grid-template-columns:1fr;gap:32px}
.lpb-sorae .s-hero{padding:8px 20px 64px}.lpb-sorae .s-hero .lpb-img{max-width:420px;width:100%;margin:0 auto}
.lpb-sorae .s-hero-text{text-align:center}.lpb-sorae .s-use .lpb-img{order:-1}
.lpb-sorae .s-grid3,.lpb-sorae .s-voices{grid-template-columns:1fr;gap:16px}.lpb-sorae .s-wrap{padding:0 20px}
.lpb-sorae .s-top .s-btn{display:none}}`,
  render: ({ f, img, link, when }) => `
<header class="s-top">${f("brand", "div", "s-logo")}${link("ctaLabel", "ctaUrl", "s-btn sm")}</header>
<div class="s-hero">
  ${img("hero")}
  <div class="s-hero-text">
    <p class="s-eyebrow">New Skincare</p>
    ${f("heroCopy", "h1")}
    ${f("heroSub", "p", "s-sub")}
    ${f("price", "p", "s-price")}
    ${link("ctaLabel", "ctaUrl", "s-btn")}
  </div>
</div>
<section><div class="s-wrap s-intro">
  ${img("mood")}
  <div><span class="s-label">Introduction</span>${f("introTitle", "h2", "s-h2")}${f("introBody", "p", "s-body")}</div>
</div></section>
<section class="s-feats"><div class="s-wrap">
  <div class="s-center"><span class="s-label">Features</span><h2 class="s-h2">3つの特長</h2></div>
  <div class="s-grid3">
    <div class="s-card"><div class="s-num">01</div>${f("feat1T", "h3")}${f("feat1B", "p")}</div>
    <div class="s-card"><div class="s-num">02</div>${f("feat2T", "h3")}${f("feat2B", "p")}</div>
    <div class="s-card"><div class="s-num">03</div>${f("feat3T", "h3")}${f("feat3B", "p")}</div>
  </div>
</div></section>
<section><div class="s-wrap s-use">
  <div><span class="s-label">How to use</span>${f("useTitle", "h2", "s-h2")}
  <ol class="s-steps">${f("use1", "li")}${f("use2", "li")}${f("use3", "li")}</ol></div>
  ${img("use")}
</div></section>
<section class="s-lab"><div class="s-wrap">
  <div class="s-labtext s-center"><span class="s-label">Quality</span>${f("labTitle", "h2", "s-h2")}${f("labBody", "p", "s-body")}</div>
  ${img("lab")}
</div></section>
${when(["voice1", "voice2"], `<section><div class="s-wrap"><div class="s-center"><span class="s-label">Voice</span><h2 class="s-h2">お客様の声</h2></div>
  <div class="s-voices">
    ${when(["voice1"], `<blockquote>${f("voice1", "p")}${f("voice1Name", "cite")}</blockquote>`)}
    ${when(["voice2"], `<blockquote>${f("voice2", "p")}${f("voice2Name", "cite")}</blockquote>`)}
  </div></div></section>`)}
${when(["faq1Q", "faq2Q", "faq3Q"], `<section class="s-feats"><div class="s-wrap"><div class="s-center"><span class="s-label">Q&amp;A</span><h2 class="s-h2">よくある質問</h2></div>
  <div class="s-faq">
    ${when(["faq1Q"], `<details><summary>${f("faq1Q")}</summary>${f("faq1A", "p")}</details>`)}
    ${when(["faq2Q"], `<details><summary>${f("faq2Q")}</summary>${f("faq2A", "p")}</details>`)}
    ${when(["faq3Q"], `<details><summary>${f("faq3Q")}</summary>${f("faq3A", "p")}</details>`)}
  </div></div></section>`)}
<section class="s-close"><div class="s-wrap">
  ${f("closing", "h2", "s-h2")}${f("price", "p", "s-price")}${link("ctaLabel", "ctaUrl", "s-btn")}
</div></section>
<footer>${f("brand", "span", "s-logo")}${when(["note"], f("note", "p"))}</footer>`,
};
