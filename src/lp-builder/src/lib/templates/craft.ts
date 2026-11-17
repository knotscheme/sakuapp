import type { Template } from "../types";

// CRAFT：物販・ものづくり・OEM向け。白・黒・金で、作り手の誠実さと商品の質を見せる型
export const craft: Template = {
  id: "craft",
  name: "CRAFT",
  kind: "物販・ものづくり・OEM",
  desc: "悩み→解決→作る工程→商品一覧の順で、きちんと納得して買ってもらう型。B2Bの受注にも向いています。",
  best: "革小物・雑貨・家具・食品・OEM／受注生産の案内など",
  fonts: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Noto+Sans+JP:wght@400;500;700&display=swap",
  colors: [
    { id: "accent", label: "アクセント", value: "#b8860b" },
    { id: "dark", label: "濃い色", value: "#1a1a1a" },
    { id: "bg", label: "背景", value: "#f7f6f3" },
  ],
  slots: [
    { id: "hero", label: "メイン（商品・横長）", ratio: [16, 9], min: 1200, max: 1920, where: "いちばん上の大きな写真（文字が重なります）", prompt: "{product}を暗めの木の作業台に置いた商品写真。斜め上から、右側に商品、左側は文字を置くための暗い余白。温かいスポットライト、職人の工房の雰囲気、高級感。文字やロゴは入れない。横長16:9。", tips: "文字が左に重なるので、商品は右寄せに。背景は暗め・シンプルに。" },
    { id: "step1", label: "工程1（素材えらび）", ratio: [4, 3], min: 700, max: 1200, where: "「作る工程」の1枚目", prompt: "{product}の素材を職人の手が選んでいるクローズアップ。木の作業台、自然光、手元中心。顔は写さない。文字は入れない。横長4:3。", tips: "素材や原料を並べ、手で触れているところを撮ると伝わりやすいです。" },
    { id: "step2", label: "工程2（作る）", ratio: [4, 3], min: 700, max: 1200, where: "「作る工程」の2枚目", prompt: "職人が{product}を手作業で作っている手元のクローズアップ。工具、作業台、温かい光。顔は写さない。文字は入れない。横長4:3。", tips: "手と道具が一緒に写ると「手作り感」が出ます。" },
    { id: "step3", label: "工程3（仕上げ）", ratio: [4, 3], min: 700, max: 1200, where: "「作る工程」の3枚目", prompt: "{product}の仕上げ作業。ロゴや刻印を入れる、磨くなどの細かな作業の手元。温かい光。文字は入れない。横長4:3。", tips: "仕上げの道具や、完成直前の商品のアップがおすすめです。" },
    { id: "step4", label: "工程4（検品）", ratio: [4, 3], min: 700, max: 1200, where: "「作る工程」の4枚目", prompt: "完成した{product}を、白い手袋をした人がライトの下で検品している手元。清潔な作業台。文字は入れない。横長4:3。", tips: "検品・梱包の様子は「安心」につながります。" },
    { id: "item1", label: "商品1", ratio: [4, 3], min: 600, max: 1000, where: "「ラインナップ」の1つ目", prompt: "{product}（1つ目の種類）の商品写真。白い背景、斜め上から、やわらかい影。文字は入れない。横長4:3。", tips: "3つの商品は、同じ背景・同じ角度でそろえると、きれいに並びます。" },
    { id: "item2", label: "商品2", ratio: [4, 3], min: 600, max: 1000, where: "「ラインナップ」の2つ目", prompt: "{product}（2つ目の種類）の商品写真。白い背景、斜め上から、やわらかい影。文字は入れない。横長4:3。", tips: "商品1と同じ置き方・同じ光で撮ってください。" },
    { id: "item3", label: "商品3", ratio: [4, 3], min: 600, max: 1000, where: "「ラインナップ」の3つ目", prompt: "{product}（3つ目の種類）の商品写真。白い背景、斜め上から、やわらかい影。文字は入れない。横長4:3。", tips: "商品1と同じ置き方・同じ光で撮ってください。" },
  ],
  fields: [
    { id: "brand", label: "ブランド名", group: "ファーストビュー", max: 20 },
    { id: "heroCopy", label: "キャッチコピー", group: "ファーストビュー", multiline: true, max: 26, hint: "2行までの力強いキャッチコピー" },
    { id: "heroSub", label: "サブコピー", group: "ファーストビュー", multiline: true, max: 70 },
    { id: "badge1", label: "数字の強み1", group: "ファーストビュー", max: 12, hint: "例：型代0円" },
    { id: "badge2", label: "数字の強み2", group: "ファーストビュー", max: 12, hint: "例：最短30日" },
    { id: "badge3", label: "数字の強み3", group: "ファーストビュー", max: 12, hint: "例：30個から" },
    { id: "ctaLabel", label: "ボタンの文字", group: "ファーストビュー", max: 16 },
    { id: "ctaUrl", label: "ボタンのリンク先", group: "ファーストビュー", url: true },
    { id: "probTitle", label: "悩みの見出し", group: "こんな悩み", multiline: true, max: 30 },
    { id: "prob1", label: "悩み1", group: "こんな悩み", max: 36 },
    { id: "prob2", label: "悩み2", group: "こんな悩み", max: 36 },
    { id: "prob3", label: "悩み3", group: "こんな悩み", max: 36 },
    { id: "solTitle", label: "解決の見出し", group: "解決", multiline: true, max: 30 },
    { id: "solBody", label: "解決の本文", group: "解決", multiline: true, max: 160 },
    { id: "step1T", label: "工程1の見出し", group: "作る工程", max: 16 },
    { id: "step1B", label: "工程1の説明", group: "作る工程", multiline: true, max: 60 },
    { id: "step2T", label: "工程2の見出し", group: "作る工程", max: 16 },
    { id: "step2B", label: "工程2の説明", group: "作る工程", multiline: true, max: 60 },
    { id: "step3T", label: "工程3の見出し", group: "作る工程", max: 16 },
    { id: "step3B", label: "工程3の説明", group: "作る工程", multiline: true, max: 60 },
    { id: "step4T", label: "工程4の見出し", group: "作る工程", max: 16 },
    { id: "step4B", label: "工程4の説明", group: "作る工程", multiline: true, max: 60 },
    { id: "item1Name", label: "商品1の名前", group: "ラインナップ", max: 20 },
    { id: "item1Price", label: "商品1の価格", group: "ラインナップ", max: 20 },
    { id: "item2Name", label: "商品2の名前", group: "ラインナップ", max: 20 },
    { id: "item2Price", label: "商品2の価格", group: "ラインナップ", max: 20 },
    { id: "item3Name", label: "商品3の名前", group: "ラインナップ", max: 20 },
    { id: "item3Price", label: "商品3の価格", group: "ラインナップ", max: 20 },
    { id: "faq1Q", label: "質問1", group: "よくある質問", max: 40, optional: true },
    { id: "faq1A", label: "答え1", group: "よくある質問", multiline: true, max: 100, optional: true },
    { id: "faq2Q", label: "質問2", group: "よくある質問", max: 40, optional: true },
    { id: "faq2A", label: "答え2", group: "よくある質問", multiline: true, max: 100, optional: true },
    { id: "faq3Q", label: "質問3", group: "よくある質問", max: 40, optional: true },
    { id: "faq3A", label: "答え3", group: "よくある質問", multiline: true, max: 100, optional: true },
    { id: "closing", label: "最後の見出し", group: "最後", multiline: true, max: 30 },
    { id: "closingSub", label: "最後の補足", group: "最後", multiline: true, max: 60 },
    { id: "note", label: "会社名・注意書き", group: "最後", multiline: true, max: 120, optional: true },
  ],
  css: `.lpb-craft{--en:"Cormorant Garamond",serif;font-family:"Noto Sans JP",sans-serif;color:var(--dark);background:var(--bg);font-size:15px;letter-spacing:.03em}
.lpb-craft .c-wrap{max-width:1120px;margin:0 auto;padding:0 24px}
.lpb-craft .c-btn{display:inline-flex;align-items:center;gap:.8em;background:var(--accent);color:#fff;font-weight:700;padding:18px 40px;border-radius:2px;letter-spacing:.1em;font-size:15px;transition:filter .3s,transform .3s}
.lpb-craft .c-btn::after{content:"→"}.lpb-craft .c-btn:hover{filter:brightness(1.08);transform:translateY(-2px)}
.lpb-craft .c-hero{position:relative;background:var(--dark);color:#fff;overflow:hidden}
.lpb-craft .c-hero .lpb-img{position:absolute;inset:0;z-index:0;width:100%;height:100%;opacity:.92;animation:cZoom 14s ease-out both}
.lpb-craft .c-logo,.lpb-craft .c-hero-copy{position:relative;z-index:2}
.lpb-craft .c-hero::before{content:"";position:absolute;inset:0;z-index:1;background:linear-gradient(90deg,rgba(0,0,0,.78) 0%,rgba(0,0,0,.5) 45%,rgba(0,0,0,0) 80%)}
.lpb-craft .c-hero-in{max-width:1120px;margin:0 auto;padding:28px 24px 96px;min-height:min(92vh,820px);display:flex;flex-direction:column}
.lpb-craft .c-logo{font-family:var(--en);font-size:24px;letter-spacing:.3em;font-weight:600}
.lpb-craft .c-hero-copy{margin-top:auto;max-width:620px}
.lpb-craft h1{font-size:clamp(32px,5vw,60px);line-height:1.4;font-weight:700;letter-spacing:.04em;animation:cUp 1.2s .1s ease both}
.lpb-craft .c-sub{margin:22px 0 30px;font-size:16px;line-height:2;opacity:.9}
.lpb-craft .c-badges{display:flex;flex-wrap:wrap;gap:12px;margin-bottom:34px}
.lpb-craft .c-badges span{border:1px solid color-mix(in srgb,var(--accent) 70%,#fff);color:#fff;padding:10px 18px;font-weight:700;font-size:15px;letter-spacing:.06em;background:rgba(0,0,0,.25);backdrop-filter:blur(4px)}
.lpb-craft section{padding:100px 0}
.lpb-craft .c-label{display:block;font-family:var(--en);color:var(--accent);letter-spacing:.28em;font-size:14px;margin-bottom:12px;text-transform:uppercase}
.lpb-craft .c-h2{font-size:clamp(24px,3.2vw,36px);line-height:1.6;font-weight:700;letter-spacing:.04em}
.lpb-craft .c-center{text-align:center}
.lpb-craft .c-probs{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:48px;list-style:none}
.lpb-craft .c-probs li{background:#fff;padding:30px 26px 30px 58px;position:relative;font-weight:500;line-height:1.9;border-radius:2px;box-shadow:0 1px 0 rgba(0,0,0,.04)}
.lpb-craft .c-probs li::before{content:"✓";position:absolute;left:24px;top:28px;width:22px;height:22px;border-radius:50%;background:var(--dark);color:#fff;font-size:12px;display:grid;place-items:center}
.lpb-craft .c-sol{background:var(--dark);color:#fff;text-align:center}
.lpb-craft .c-sol .c-h2 em{font-style:normal;color:var(--accent)}
.lpb-craft .c-sol p{max-width:720px;margin:26px auto 0;line-height:2.1;opacity:.88}
.lpb-craft .c-steps{display:grid;grid-template-columns:repeat(4,1fr);gap:22px;margin-top:52px}
.lpb-craft .c-step .lpb-img{border-radius:2px}
.lpb-craft .c-step-n{font-family:var(--en);color:var(--accent);font-size:15px;letter-spacing:.2em;margin-top:18px;display:block}
.lpb-craft .c-step h3{font-size:17px;margin:4px 0 8px;font-weight:700}
.lpb-craft .c-step p{font-size:13.5px;line-height:1.9;opacity:.8}
.lpb-craft .c-items{background:#fff}
.lpb-craft .c-grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:26px;margin-top:52px}
.lpb-craft .c-item .lpb-img{background:var(--bg);border-radius:2px}
.lpb-craft .c-item h3{font-size:16px;margin-top:16px;font-weight:700}
.lpb-craft .c-item p{font-family:var(--en);font-size:20px;color:var(--accent);margin-top:2px;font-weight:600}
.lpb-craft .c-faq{max-width:780px;margin:44px auto 0}
.lpb-craft details{background:#fff;margin-bottom:12px;padding:22px 26px;border-radius:2px}
.lpb-craft summary{display:flex;gap:14px;font-weight:700}
.lpb-craft summary::before{content:"Q";font-family:var(--en);color:var(--accent);font-size:20px;line-height:1.2}
.lpb-craft details p{margin-top:12px;padding-left:28px;font-size:14px;line-height:2;opacity:.85}
.lpb-craft .c-close{background:var(--dark);color:#fff;text-align:center;position:relative;overflow:hidden}
.lpb-craft .c-close::before{content:"";position:absolute;inset:auto -10% -60% -10%;height:120%;background:radial-gradient(closest-side,color-mix(in srgb,var(--accent) 35%,transparent),transparent);pointer-events:none}
.lpb-craft .c-close .c-wrap{position:relative}
.lpb-craft .c-close p{margin:18px 0 36px;opacity:.85;line-height:2}
.lpb-craft footer{background:var(--dark);color:#fff;border-top:1px solid rgba(255,255,255,.12);padding:32px 24px;text-align:center;font-size:11.5px;line-height:2;opacity:.95}
.lpb-craft footer .c-logo{display:block;font-size:18px;margin-bottom:8px}
.lpb-craft footer p{opacity:.6}
@keyframes cZoom{from{transform:scale(1.08)}to{transform:none}}
@keyframes cUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@media (max-width:900px){.lpb-craft .c-steps{grid-template-columns:repeat(2,1fr)}}
@media (max-width:760px){.lpb-craft{font-size:14px}.lpb-craft section{padding:70px 0}.lpb-craft .c-wrap{padding:0 20px}
.lpb-craft .c-hero-in{min-height:auto;padding:22px 20px 56px}.lpb-craft .c-hero .lpb-img{position:relative;height:auto;margin:20px -20px 0;width:calc(100% + 40px);max-width:none;opacity:1}
.lpb-craft .c-hero::before{display:none}.lpb-craft .c-hero-copy{margin-top:28px}
.lpb-craft .c-sub{font-size:14.5px}.lpb-craft .c-badges span{padding:8px 13px;font-size:13.5px}
.lpb-craft .c-probs,.lpb-craft .c-grid3{grid-template-columns:1fr;gap:12px}.lpb-craft .c-steps{gap:26px 14px}
.lpb-craft .c-btn{width:100%;justify-content:center;padding:17px 20px}}`,
  render: ({ f, img, link, when }) => `
<div class="c-hero"><div class="c-hero-in">
  ${f("brand", "div", "c-logo")}
  ${img("hero")}
  <div class="c-hero-copy">
    ${f("heroCopy", "h1")}
    ${f("heroSub", "p", "c-sub")}
    <div class="c-badges">${f("badge1")}${f("badge2")}${f("badge3")}</div>
    ${link("ctaLabel", "ctaUrl", "c-btn")}
  </div>
</div></div>
<section><div class="c-wrap">
  <div class="c-center"><span class="c-label">Problem</span>${f("probTitle", "h2", "c-h2")}</div>
  <ul class="c-probs">${f("prob1", "li")}${f("prob2", "li")}${f("prob3", "li")}</ul>
</div></section>
<section class="c-sol"><div class="c-wrap">
  <span class="c-label">Solution</span>${f("solTitle", "h2", "c-h2")}${f("solBody", "p")}
</div></section>
<section><div class="c-wrap">
  <div class="c-center"><span class="c-label">Process</span><h2 class="c-h2">ひとつずつ、手で仕上げる</h2></div>
  <div class="c-steps">
    <div class="c-step">${img("step1")}<span class="c-step-n">STEP 01</span>${f("step1T", "h3")}${f("step1B", "p")}</div>
    <div class="c-step">${img("step2")}<span class="c-step-n">STEP 02</span>${f("step2T", "h3")}${f("step2B", "p")}</div>
    <div class="c-step">${img("step3")}<span class="c-step-n">STEP 03</span>${f("step3T", "h3")}${f("step3B", "p")}</div>
    <div class="c-step">${img("step4")}<span class="c-step-n">STEP 04</span>${f("step4T", "h3")}${f("step4B", "p")}</div>
  </div>
</div></section>
<section class="c-items"><div class="c-wrap">
  <div class="c-center"><span class="c-label">Lineup</span><h2 class="c-h2">ラインナップ</h2></div>
  <div class="c-grid3">
    <div class="c-item">${img("item1")}${f("item1Name", "h3")}${f("item1Price", "p")}</div>
    <div class="c-item">${img("item2")}${f("item2Name", "h3")}${f("item2Price", "p")}</div>
    <div class="c-item">${img("item3")}${f("item3Name", "h3")}${f("item3Price", "p")}</div>
  </div>
</div></section>
${when(["faq1Q", "faq2Q", "faq3Q"], `<section><div class="c-wrap"><div class="c-center"><span class="c-label">FAQ</span><h2 class="c-h2">よくある質問</h2></div>
  <div class="c-faq">
    ${when(["faq1Q"], `<details><summary>${f("faq1Q")}</summary>${f("faq1A", "p")}</details>`)}
    ${when(["faq2Q"], `<details><summary>${f("faq2Q")}</summary>${f("faq2A", "p")}</details>`)}
    ${when(["faq3Q"], `<details><summary>${f("faq3Q")}</summary>${f("faq3A", "p")}</details>`)}
  </div></div></section>`)}
<section class="c-close"><div class="c-wrap">
  <span class="c-label">Contact</span>${f("closing", "h2", "c-h2")}${f("closingSub", "p")}${link("ctaLabel", "ctaUrl", "c-btn")}
</div></section>
<footer>${f("brand", "span", "c-logo")}${when(["note"], f("note", "p"))}</footer>`,
};
