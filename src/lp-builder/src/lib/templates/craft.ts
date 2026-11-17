import type { Template } from "../types";

// CRAFT：物販・ものづくり・OEM向け。元のLP（works/lp-oem）のデザインと動きをそのまま型にしたもの
// ・大きなブランド名が、写真の商品の“後ろ”を通る（商品だけ切り抜いた画像があるとき）
// ・文字が光の粒のように集まる / 職人の工程がスクロールで場面ごとに切り替わる
export const craft: Template = {
  id: "craft",
  name: "CRAFT",
  kind: "物販・ものづくり・OEM",
  desc: "ブランドの物語（世界観・職人の工程）と、はじめ方のご案内（悩み・理由・商品・流れ）の2幕構成。納得して申し込んでもらう型です。",
  best: "革小物・雑貨・家具・食品・OEM／受注生産の案内など",
  fonts: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;500;600&family=Noto+Sans+JP:wght@300;400;500;700&display=swap",
  colors: [
    { id: "gold", label: "アクセント（金）", value: "#b8860b" },
    { id: "ink", label: "文字・ボタン", value: "#1a1a1a" },
    { id: "paper", label: "うすい背景", value: "#fafafa" },
  ],
  slots: [
    { id: "hero", label: "メイン（パソコン・横長）", ratio: [16, 9], min: 1200, max: 1920, where: "パソコンのファーストビュー全面（左上にブランド名、左下に見出しが重なる）", prompt: "{product}を窓辺の白い石の台に置いた商品写真。斜め上から、商品は画面の右寄せ、左側は明るい余白。窓からの自然光とやわらかい影、上質で静かな雰囲気。文字やロゴは入れない。横長16:9。", tips: "左に文字が重なるので、商品は右寄せに。窓の光で撮ると、元のLPと同じ空気感になります。" },
    { id: "heroCut", label: "メインの商品だけ（切り抜き）", ratio: [16, 9], min: 1200, max: 1920, optional: true, where: "大きなブランド名を商品の後ろに通すための画像（無くてもOK）", prompt: "（メイン写真の背景を消し、商品だけを残した透明PNG。画像編集アプリの「背景を削除」で作れます）", tips: "メイン写真と同じ画像から、背景を消して商品だけ残したPNGを入れます。入れると、大きなブランド名が商品の後ろを通ります。" },
    { id: "heroSp", label: "メイン（スマホ・縦長）", ratio: [9, 16], min: 700, max: 1080, optional: true, where: "スマホのファーストビュー（無ければパソコン用を使います）", prompt: "{product}を窓辺の白い石の台に置いた商品写真。縦長の構図で、商品は画面の中央より少し下。上は明るい余白。自然光、上質。文字やロゴは入れない。縦長9:16。", tips: "スマホでは写真が画面の上6割に出ます。商品は真ん中より少し下に。" },
    { id: "heroSpCut", label: "スマホの商品だけ（切り抜き）", ratio: [9, 16], min: 700, max: 1080, optional: true, where: "スマホで、ブランド名を商品の後ろに通すための画像（無くてもOK）", prompt: "（スマホ用メイン写真の背景を消し、商品だけを残した透明PNG）", tips: "スマホ用メイン写真から背景を消したPNGを入れます。" },
    { id: "step1", label: "工程1（素材えらび）", ratio: [16, 9], min: 1200, max: 1920, where: "工程の1場面目（画面いっぱい）", prompt: "職人が{product}の素材を手で確かめている工房の写真。手元中心、木の作業台、窓の光、温かい色。顔は写さない。文字は入れない。横長16:9。", tips: "画面いっぱいに出るので、大きな写真を。下に文字が重なります。" },
    { id: "step2", label: "工程2（つくる）", ratio: [16, 9], min: 1200, max: 1920, where: "工程の2場面目", prompt: "職人が{product}を手作業で作っている手元のクローズアップ。道具、作業台、温かい光。顔は写さない。文字は入れない。横長16:9。", tips: "手と道具が一緒に写ると「手しごと」が伝わります。" },
    { id: "step3", label: "工程3（仕上げ）", ratio: [16, 9], min: 1200, max: 1920, where: "工程の3場面目", prompt: "{product}にロゴを押す・磨くなど、仕上げの細かな作業の手元。真鍮の道具、温かい光。文字は入れない。横長16:9。", tips: "仕上げの道具や、完成直前のアップがおすすめです。" },
    { id: "step4", label: "工程4（検品）", ratio: [16, 9], min: 1200, max: 1920, where: "工程の4場面目", prompt: "完成した{product}を手に取って検品している手元。清潔な作業台、やわらかい光。文字は入れない。横長16:9。", tips: "検品・梱包の様子は「安心」につながります。" },
    { id: "m1", label: "商品1", ratio: [4, 3], min: 600, max: 1000, where: "商品一覧の1つ目", prompt: "{product}（1つ目の種類）の商品写真。白に近い明るいグレーの背景、真上より少し斜めから、やわらかい影。文字は入れない。横長4:3。", tips: "商品はすべて同じ背景・同じ角度でそろえると、きれいに並びます。" },
    { id: "m2", label: "商品2", ratio: [4, 3], min: 600, max: 1000, where: "商品一覧の2つ目", prompt: "{product}（2つ目の種類）の商品写真。白に近い明るいグレーの背景、やわらかい影。文字は入れない。横長4:3。", tips: "商品1と同じ置き方・同じ光で。" },
    { id: "m3", label: "商品3", ratio: [4, 3], min: 600, max: 1000, where: "商品一覧の3つ目", prompt: "{product}（3つ目の種類）の商品写真。白に近い明るいグレーの背景、やわらかい影。文字は入れない。横長4:3。", tips: "商品1と同じ置き方・同じ光で。" },
    { id: "m4", label: "商品4", ratio: [4, 3], min: 600, max: 1000, optional: true, where: "商品一覧の4つ目（無くてもOK）", prompt: "{product}（4つ目の種類）の商品写真。白に近い明るいグレーの背景、やわらかい影。文字は入れない。横長4:3。", tips: "商品が3つなら、4〜6は空のままでかまいません。" },
    { id: "m5", label: "商品5", ratio: [4, 3], min: 600, max: 1000, optional: true, where: "商品一覧の5つ目（無くてもOK）", prompt: "{product}（5つ目の種類）の商品写真。白に近い明るいグレーの背景、やわらかい影。文字は入れない。横長4:3。", tips: "商品1と同じ置き方・同じ光で。" },
    { id: "m6", label: "商品6", ratio: [4, 3], min: 600, max: 1000, optional: true, where: "商品一覧の6つ目（無くてもOK）", prompt: "{product}（6つ目の種類）の商品写真。白に近い明るいグレーの背景、やわらかい影。文字は入れない。横長4:3。", tips: "商品1と同じ置き方・同じ光で。" },
    { id: "op1", label: "仕上げ・種類1", ratio: [16, 9], min: 900, max: 1400, where: "「選べる仕上げ」の1つ目", prompt: "{product}の細部（ロゴ・質感）のクローズアップ。仕上げの違いがわかる、斜めからの光。暗めの背景。文字は入れない。横長16:9。", tips: "色・素材・加工など、選べる違いがはっきりわかる寄りの写真を。3枚とも同じ構図にすると切り替えがきれいです。" },
    { id: "op2", label: "仕上げ・種類2", ratio: [16, 9], min: 900, max: 1400, where: "「選べる仕上げ」の2つ目", prompt: "{product}の細部の、2つ目の仕上げのクローズアップ。種類1と同じ構図・同じ光。文字は入れない。横長16:9。", tips: "種類1と同じ構図で撮ってください。" },
    { id: "op3", label: "仕上げ・種類3", ratio: [16, 9], min: 900, max: 1400, where: "「選べる仕上げ」の3つ目", prompt: "{product}の細部の、3つ目の仕上げのクローズアップ。種類1と同じ構図・同じ光。文字は入れない。横長16:9。", tips: "種類1と同じ構図で撮ってください。" },
    { id: "opt", label: "オプション（小さな写真）", ratio: [8, 5], min: 300, max: 600, optional: true, where: "オプションの小さな写真（無くてもOK）", prompt: "{product}のギフト箱・付属品の写真。白い背景、上品。文字は入れない。横長。", tips: "箱・ラッピング・付属品など、追加で選べるものの写真を。" },
  ],
  fields: [
    { id: "brand", label: "ブランド名（左上）", group: "ファーストビュー", max: 20 },
    { id: "word", label: "写真に重なる大きな英字", group: "ファーストビュー", max: 8, hint: "ブランド名を英大文字で短く（例：CRAFT）" },
    { id: "kick", label: "見出しの上の小さな英字", group: "ファーストビュー", max: 36 },
    { id: "heroCopy", label: "キャッチコピー（2行）", group: "ファーストビュー", multiline: true, max: 24, hint: "2行。金色にしたい言葉は＊で囲む" },
    { id: "badges", label: "強み（｜で区切る）", group: "ファーストビュー", max: 30, hint: "数字の強みを｜で区切って3つ（例：型代 0円｜30個から｜最短30日）" },
    { id: "ctaLabel", label: "ボタンの文字", group: "ファーストビュー", max: 16 },
    { id: "ctaUrl", label: "ボタンのリンク先", group: "ファーストビュー", url: true },
    { id: "cta2Label", label: "2つ目のリンクの文字", group: "ファーストビュー", max: 16, optional: true },
    { id: "cta2Url", label: "2つ目のリンク先", group: "ファーストビュー", url: true },
    { id: "statement", label: "想い（行ごとに改行・言葉ごとに空白）", group: "想い", multiline: true, max: 50, hint: "3行ほどの短い文。言葉の間に空白、金色にする言葉は＊で囲む" },
    { id: "craftTitle", label: "工程の見出し", group: "職人の工程", multiline: true, max: 24 },
    { id: "craftBody", label: "工程の説明", group: "職人の工程", multiline: true, max: 60 },
    { id: "s1E", label: "工程1の英字", group: "職人の工程", max: 12 },
    { id: "s1T", label: "工程1の見出し", group: "職人の工程", max: 14 },
    { id: "s1B", label: "工程1の説明", group: "職人の工程", multiline: true, max: 60 },
    { id: "s2E", label: "工程2の英字", group: "職人の工程", max: 12 },
    { id: "s2T", label: "工程2の見出し", group: "職人の工程", max: 14 },
    { id: "s2B", label: "工程2の説明", group: "職人の工程", multiline: true, max: 60 },
    { id: "s3E", label: "工程3の英字", group: "職人の工程", max: 12 },
    { id: "s3T", label: "工程3の見出し", group: "職人の工程", max: 14 },
    { id: "s3B", label: "工程3の説明", group: "職人の工程", multiline: true, max: 60 },
    { id: "s4E", label: "工程4の英字", group: "職人の工程", max: 12 },
    { id: "s4T", label: "工程4の見出し", group: "職人の工程", max: 14 },
    { id: "s4B", label: "工程4の説明", group: "職人の工程", multiline: true, max: 60 },
    { id: "actBreak", label: "区切りの文", group: "こんな壁", max: 30, hint: "物語からご案内に切りかわる一文" },
    { id: "painTitle", label: "悩みの見出し", group: "こんな壁", max: 24 },
    { id: "pain1", label: "悩み1", group: "こんな壁", max: 40 },
    { id: "pain2", label: "悩み2", group: "こんな壁", max: 40 },
    { id: "pain3", label: "悩み3", group: "こんな壁", max: 40 },
    { id: "painEnd", label: "解決のひとこと", group: "こんな壁", max: 30 },
    { id: "whyTitle", label: "理由の見出し", group: "選ばれる理由", max: 20 },
    { id: "why1T", label: "理由1", group: "選ばれる理由", max: 20 },
    { id: "why1B", label: "理由1の説明", group: "選ばれる理由", multiline: true, max: 80 },
    { id: "why2T", label: "理由2", group: "選ばれる理由", max: 20 },
    { id: "why2B", label: "理由2の説明", group: "選ばれる理由", multiline: true, max: 80 },
    { id: "why3T", label: "理由3", group: "選ばれる理由", max: 20 },
    { id: "why3B", label: "理由3の説明", group: "選ばれる理由", multiline: true, max: 80 },
    { id: "mTitle", label: "商品一覧の見出し", group: "商品一覧", max: 20 },
    { id: "mSub", label: "商品一覧の説明", group: "商品一覧", max: 40 },
    ...[1, 2, 3, 4, 5, 6].flatMap((n) => [
      { id: `m${n}N`, label: `商品${n}の名前`, group: "商品一覧", max: 20, optional: n > 3 },
      { id: `m${n}F`, label: `商品${n}の特長`, group: "商品一覧", multiline: true, max: 40, optional: n > 3 },
      { id: `m${n}S`, label: `商品${n}のサイズなど`, group: "商品一覧", max: 30, optional: true },
      { id: `m${n}P`, label: `商品${n}の価格`, group: "商品一覧", max: 14, optional: n > 3 },
    ]),
    { id: "mNote", label: "商品一覧の注意書き", group: "商品一覧", max: 50, optional: true },
    { id: "opTitle", label: "仕上げの見出し", group: "選べる仕上げ", max: 20 },
    { id: "opSub", label: "仕上げの説明", group: "選べる仕上げ", max: 30 },
    ...[1, 2, 3].flatMap((n) => [
      { id: `op${n}N`, label: `種類${n}の名前`, group: "選べる仕上げ", max: 10 },
      { id: `op${n}E`, label: `種類${n}の英字`, group: "選べる仕上げ", max: 14 },
      { id: `op${n}B`, label: `種類${n}の説明`, group: "選べる仕上げ", multiline: true, max: 50 },
    ]),
    { id: "optT", label: "オプションの名前", group: "選べる仕上げ", max: 16, optional: true },
    { id: "optB", label: "オプションの説明", group: "選べる仕上げ", max: 40, optional: true },
    { id: "spT", label: "特別注文の見出し", group: "選べる仕上げ", max: 24, optional: true },
    { id: "spB", label: "特別注文の説明", group: "選べる仕上げ", multiline: true, max: 90, optional: true },
    { id: "flowTitle", label: "流れの見出し", group: "ご注文の流れ", max: 20 },
    { id: "f1T", label: "流れ1", group: "ご注文の流れ", max: 16 },
    { id: "f1B", label: "流れ1の説明", group: "ご注文の流れ", multiline: true, max: 50 },
    { id: "f2T", label: "流れ2", group: "ご注文の流れ", max: 16 },
    { id: "f2B", label: "流れ2の説明", group: "ご注文の流れ", multiline: true, max: 50 },
    { id: "f3T", label: "流れ3", group: "ご注文の流れ", max: 16 },
    { id: "f3B", label: "流れ3の説明", group: "ご注文の流れ", multiline: true, max: 50 },
    ...[1, 2, 3, 4].flatMap((n) => [
      { id: `q${n}Q`, label: `質問${n}`, group: "よくある質問", max: 30, optional: true },
      { id: `q${n}A`, label: `答え${n}`, group: "よくある質問", multiline: true, max: 100, optional: true },
    ]),
    { id: "contactTitle", label: "最後の見出し", group: "お問い合わせ", max: 20 },
    { id: "contactSub", label: "最後の補足", group: "お問い合わせ", max: 40 },
    { id: "floatLabel", label: "右下に浮かぶボタン", group: "お問い合わせ", max: 12 },
    { id: "footSub", label: "フッターの説明", group: "お問い合わせ", max: 30 },
    { id: "note", label: "いちばん下の文字", group: "お問い合わせ", multiline: true, max: 80, optional: true },
  ],
  css: `.lpb-craft{--mute:#6b6b6b;--line:#e7e7e5;--gold2:color-mix(in srgb,var(--gold) 70%,#e7d3a1);--en:"Cormorant Garamond",serif;font-family:"Noto Sans JP",sans-serif;color:var(--ink);background:#fff;line-height:1.75}
.lpb-craft .w{max-width:1152px;margin:0 auto;padding:0 24px}
.lpb-craft .w4{max-width:896px;margin:0 auto;padding:0 24px}
.lpb-craft em{color:var(--gold)}
.lpb-craft .num{font-variant-numeric:lining-nums tabular-nums;letter-spacing:.02em}
.lpb-craft .btn{display:inline-flex;align-items:center;gap:12px;background:var(--ink);color:#fff;padding:14px 28px;font-size:13.5px;letter-spacing:.1em;white-space:nowrap;transition:background .3s}
.lpb-craft .btn::after{content:"→";transition:transform .3s}
.lpb-craft .btn:hover{background:var(--gold)}.lpb-craft .btn:hover::after{transform:translateX(4px)}
.lpb-craft .ul{display:inline-block;border-bottom:1px solid color-mix(in srgb,var(--ink) 40%,transparent);padding-bottom:2px;font-size:13px;letter-spacing:.08em;transition:color .3s,border-color .3s}
.lpb-craft .ul:hover{color:var(--gold);border-color:var(--gold)}
.lpb-craft .hd{position:absolute;top:0;left:0;right:0;z-index:60;color:#fff;mix-blend-mode:difference;transition:transform .5s ease-out,background-color .5s,color .5s}
.lpb-craft .hd.fx{position:fixed}
.lpb-craft .hd.sc{mix-blend-mode:normal;color:var(--ink);background:rgba(255,255,255,.8);border-bottom:1px solid color-mix(in srgb,var(--line) 70%,transparent);backdrop-filter:blur(24px) saturate(1.5);-webkit-backdrop-filter:blur(24px) saturate(1.5)}
.lpb-craft .hd.hide{transform:translateY(-100%)}
.lpb-craft .hd.open{mix-blend-mode:normal;color:var(--ink);background:transparent;border-color:transparent;backdrop-filter:none;-webkit-backdrop-filter:none;transform:none}
.lpb-craft .hd .w{display:flex;height:64px;justify-content:space-between;align-items:center}
.lpb-craft .hd .logo{font:500 15px var(--en);letter-spacing:.45em}
.lpb-craft .logo{font:600 15px var(--en);letter-spacing:.3em}
.lpb-craft .mb{display:flex;align-items:center;padding:8px;margin-right:-8px;border:0;background:none;color:inherit;cursor:pointer}
.lpb-craft .mb span{position:relative;display:block;height:8px;width:24px}
.lpb-craft .mb i{position:absolute;left:0;height:1px;background:currentColor;transition:all .5s}
.lpb-craft .mb i:first-child{top:0;width:100%}.lpb-craft .mb i:last-child{top:100%;width:66%}
.lpb-craft .mb:hover i:last-child{width:100%}
.lpb-craft .hd.open .mb i:first-child{top:50%;transform:rotate(20deg)}.lpb-craft .hd.open .mb i:last-child{top:50%;width:100%;transform:rotate(-20deg)}
.lpb-craft .menu{position:fixed;inset:0;z-index:55;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.45);backdrop-filter:blur(40px) saturate(1.5);-webkit-backdrop-filter:blur(40px) saturate(1.5);transition:opacity .5s,visibility .5s;opacity:0;visibility:hidden}
.lpb-craft .menu.open{opacity:1;visibility:visible}
.lpb-craft .menu ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;align-items:center;gap:28px;text-align:center}
.lpb-craft .menu a{display:block;font-size:15px;letter-spacing:.14em;color:var(--ink);transition:all .7s,color .3s;opacity:0;transform:translateY(8px)}
.lpb-craft .menu.open a{opacity:1;transform:none}
.lpb-craft .menu a:hover{color:var(--gold)}
@media (min-width:768px){.lpb-craft .hd .w{height:80px;padding:0 32px}.lpb-craft .menu a{font-size:16px}.lpb-craft .menu ul{gap:32px}}
.lpb-craft .hero{position:relative;height:100svh;min-height:600px;background:#fff}
.lpb-craft .hero .in{position:relative;height:100%;overflow:hidden}
.lpb-craft .photo{position:absolute;left:0;right:0;top:0;height:62svh;overflow:hidden}
.lpb-craft .stage{position:absolute;inset:0;will-change:transform}
.lpb-craft .zoom{position:absolute;inset:0;animation:cZoom 2.6s cubic-bezier(.2,.7,.1,1) both,cBreath 14s ease-in-out 2.6s infinite}
@keyframes cZoom{from{transform:scale(1.14)}to{transform:scale(1)}}
@keyframes cBreath{50%{transform:scale(1.04)}0%,100%{transform:scale(1)}}
.lpb-craft .ly{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 25%}
.lpb-craft .ly.cut{pointer-events:none}
.lpb-craft .ly.pc{display:none}.lpb-craft .nosp .ly.pc{display:block}
.lpb-craft .word{position:absolute;left:0;right:0;top:24%;text-align:center;font-family:var(--en);font-weight:300;line-height:1;letter-spacing:.32em;color:color-mix(in srgb,var(--ink) 75%,transparent);pointer-events:none;user-select:none;animation:cWord 1.8s cubic-bezier(.2,.7,.1,1) .1s both}
.lpb-craft .word span{display:block;margin:0 auto;max-width:1152px;padding-left:.32em;font-size:15vw}
@keyframes cWord{from{opacity:0;transform:translateY(8%);letter-spacing:.4em}to{opacity:1;transform:none}}
.lpb-craft .wlight{position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(112deg,transparent 0 9%,rgba(255,246,222,.55) 9% 17%,transparent 17% 19%,rgba(255,246,222,.4) 19% 25%,transparent 25% 46%);background-size:260% 100%;mix-blend-mode:soft-light;animation:cSweep 16s ease-in-out infinite alternate}
@keyframes cSweep{from{background-position:0% 0}to{background-position:100% 0}}
.lpb-craft .clight{position:absolute;inset:0;pointer-events:none;opacity:0;transition:opacity .7s;background:radial-gradient(260px circle at var(--mx,-999px) var(--my,-999px),rgba(255,240,205,.45),transparent 70%);mix-blend-mode:soft-light}
.lpb-craft .fadeb{position:absolute;left:0;right:0;bottom:0;height:25%;background:linear-gradient(to top,#fff,transparent);pointer-events:none}
.lpb-craft .fadel{display:none}
.lpb-craft .copy{position:absolute;left:0;right:0;bottom:0;padding:0 24px 40px}
.lpb-craft .copy .w{padding:0}
.lpb-craft .kick{font-family:var(--en);font-size:11px;letter-spacing:.22em;color:var(--mute)}
.lpb-craft .hero h1{margin-top:16px;font-size:30px;line-height:1.4;font-weight:500;letter-spacing:.04em}
.lpb-craft .hero h1 .lm{display:block;overflow:hidden}
.lpb-craft .hero h1 .lm>span{display:inline-block;animation:cLine 1s cubic-bezier(.2,.8,.2,1) both}
@keyframes cLine{from{transform:translateY(105%)}to{transform:none}}
.lpb-craft .badges{margin-top:20px;font-size:13px;letter-spacing:.12em}
.lpb-craft .badges i{font-style:normal;margin:0 12px;color:var(--line)}
.lpb-craft .ctas{margin-top:28px;display:flex;align-items:center;gap:32px;flex-wrap:wrap}
.lpb-craft .hin{animation:cUp 1s cubic-bezier(.2,.7,.2,1) both}
@keyframes cUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@media (min-width:640px){.lpb-craft .kick{font-size:12px;letter-spacing:.4em}.lpb-craft .hero h1{font-size:40px}}
@media (min-width:1024px){
 .lpb-craft .photo{height:100%}
 .lpb-craft .ly{object-position:60% 50%}.lpb-craft .ly.pc{display:block}.lpb-craft .ly.sp{display:none}
 .lpb-craft .word{top:22%;text-align:left}.lpb-craft .word span{padding-left:32px;font-size:min(8vw,112px)}
 .lpb-craft .fadeb{display:none}.lpb-craft .fadel{display:block;position:absolute;inset:0;pointer-events:none;background:linear-gradient(to top right,rgba(255,255,255,.85),rgba(255,255,255,.2) 35%,transparent 60%)}
 .lpb-craft .copy{padding-bottom:64px}.lpb-craft .copy .w{padding:0 8px}.lpb-craft .copy .bx{max-width:520px}
 .lpb-craft .hero h1{font-size:46px}}
.lpb-craft .stmt{position:relative;overflow:hidden;background:#fff;padding:112px 0}
.lpb-craft .stmt .in{max-width:896px;margin:0 auto;padding:0 24px;text-align:center}
.lpb-craft .elbl{font-family:var(--en);font-size:12px;letter-spacing:.5em;color:var(--mute)}
.lpb-craft .stmt .lines{margin-top:48px;font-size:24px;line-height:2.1;letter-spacing:.2em}
.lpb-craft .stmt .lines em,.lpb-craft .stmt .ac .c{background:linear-gradient(100deg,color-mix(in srgb,var(--gold) 85%,#000),var(--gold2) 50%,var(--gold));-webkit-background-clip:text;background-clip:text;color:transparent}
.lpb-craft .stmt .wd{display:inline-block;white-space:nowrap}
.lpb-craft .stmt .c{display:inline-block;transition:opacity 2s ease,filter 2s ease,transform 2.4s cubic-bezier(.16,1,.3,1);transition-delay:var(--d)}
.lpb-craft.lpb-js .stmt .c{opacity:0;filter:blur(10px);transform:translate(var(--dx),var(--dy)) scale(.4)}
.lpb-craft.lpb-js .stmt.on .c{opacity:1;filter:none;transform:none}
.lpb-craft .stmt .stl{display:block;margin:48px auto 0;height:1px;width:64px;background:var(--gold2);transition:transform 1.4s cubic-bezier(.6,0,.2,1) 2.4s}
.lpb-craft.lpb-js .stmt .stl{transform:scaleX(0)}.lpb-craft.lpb-js .stmt.on .stl{transform:scaleX(1)}
@media (min-width:640px){.lpb-craft .stmt .lines{font-size:34px}}
@media (min-width:768px){.lpb-craft .stmt{padding:160px 0}.lpb-craft .stmt .lines{font-size:44px}}
.lpb-craft .craft{background:var(--ink)}
.lpb-craft .craft .wrap{position:relative;height:500svh}
.lpb-craft .craft .stk{position:sticky;top:0;height:100svh;overflow:hidden;color:#fff}
.lpb-craft .scene{position:absolute;inset:0;transition:opacity 1.2s cubic-bezier(.6,0,.2,1),clip-path 1.2s cubic-bezier(.6,0,.2,1);clip-path:inset(100% 0 0 0)}
.lpb-craft .scene.now{clip-path:inset(0 0 0 0)}.lpb-craft .scene.past{clip-path:inset(0 0 0 0);opacity:0}
.lpb-craft .scene img{width:100%;height:100%;object-fit:cover;transform:scale(1.12);transition:transform .2s linear}
.lpb-craft .shade{position:absolute;inset:0;pointer-events:none;background:linear-gradient(to top,rgba(0,0,0,.75),rgba(0,0,0,.25),rgba(0,0,0,.1))}
.lpb-craft .dim{position:absolute;inset:0;pointer-events:none;background:rgba(0,0,0,.55);transition:opacity .7s}
.lpb-craft .cintro{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:0 24px;text-align:center;transition:opacity .7s,transform .7s}
.lpb-craft .cintro .elbl{color:rgba(255,255,255,.6)}
.lpb-craft .cintro h2{margin-top:20px;font-size:30px;line-height:1.6;font-weight:400;letter-spacing:.14em}
.lpb-craft .cintro p{margin-top:24px;max-width:28rem;font-size:13.5px;line-height:2;color:rgba(255,255,255,.7)}
.lpb-craft .cue{display:block;margin-top:40px;height:48px;width:1px;background:rgba(255,255,255,.5);transform-origin:top;animation:cCue 2.2s ease-in-out infinite}
@keyframes cCue{0%{transform:scaleY(0)}50%{transform:scaleY(1);transform-origin:top}51%{transform-origin:bottom}100%{transform:scaleY(0);transform-origin:bottom}}
.lpb-craft .stx{position:absolute;left:24px;right:24px;bottom:56px;transition:opacity .7s,transform .7s;opacity:0;transform:translateY(24px);pointer-events:none;z-index:3}
.lpb-craft .stx.now{opacity:1;transform:none;transition-delay:.3s}
.lpb-craft .stx .no{font-family:var(--en);font-size:clamp(56px,10vw,120px);line-height:1;color:rgba(255,255,255,.9)}
.lpb-craft .stx .se{margin-top:12px;font-family:var(--en);font-size:12px;letter-spacing:.45em;color:rgba(255,255,255,.6);text-transform:uppercase}
.lpb-craft .stx h3{margin-top:8px;font-size:24px;font-weight:500;letter-spacing:.1em}
.lpb-craft .stx p{margin-top:12px;max-width:28rem;font-size:13.5px;line-height:2;color:rgba(255,255,255,.75)}
.lpb-craft .prg{position:absolute;top:50%;right:20px;transform:translateY(-50%);display:flex;flex-direction:column;gap:12px}
.lpb-craft .prg span{position:relative;display:block;height:40px;width:1px;overflow:hidden;background:rgba(255,255,255,.25)}
.lpb-craft .prg i{position:absolute;left:0;right:0;top:0;display:block;background:#fff;height:0}
.lpb-craft .shd2{display:none;position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.7),transparent 60%)}
.lpb-craft:not(.lpb-js) .craft .wrap,.lpb-craft.lpb-edit .craft .wrap{height:auto}
.lpb-craft:not(.lpb-js) .craft .stk,.lpb-craft.lpb-edit .craft .stk{position:relative;height:auto;display:flex;flex-direction:column;gap:2px}
.lpb-craft:not(.lpb-js) .scene,.lpb-craft.lpb-edit .scene{position:relative;clip-path:none;opacity:1;height:70svh;order:2}
.lpb-craft:not(.lpb-js) .scene img,.lpb-craft.lpb-edit .scene img{transform:none}
.lpb-craft:not(.lpb-js) .stx,.lpb-craft.lpb-edit .stx{opacity:1;transform:none;pointer-events:auto}
.lpb-craft:not(.lpb-js) .cintro,.lpb-craft.lpb-edit .cintro{position:relative;padding:96px 24px;order:1}
.lpb-craft:not(.lpb-js) .shd2,.lpb-craft.lpb-edit .shd2{display:block}
.lpb-craft:not(.lpb-js) .shade,.lpb-craft:not(.lpb-js) .dim,.lpb-craft:not(.lpb-js) .prg,.lpb-craft.lpb-edit .shade,.lpb-craft.lpb-edit .dim,.lpb-craft.lpb-edit .prg{display:none}
@media (min-width:768px){.lpb-craft .cintro h2{font-size:46px}.lpb-craft .stx{left:40px;bottom:80px;max-width:36rem}.lpb-craft .stx h3{font-size:30px}.lpb-craft .stx p{font-size:14.5px}.lpb-craft .prg{right:40px}}
.lpb-craft section.s{padding:96px 0}
.lpb-craft .st{max-width:672px;margin:0 auto 56px;text-align:center}
.lpb-craft .st .elbl{letter-spacing:.4em;text-transform:uppercase}
.lpb-craft .st h2{margin-top:16px;font-size:26px;line-height:1.4;font-weight:500;letter-spacing:.06em}
.lpb-craft .st .sub{margin-top:20px;font-size:14.5px;line-height:2;color:var(--mute)}
@media (min-width:768px){.lpb-craft section.s{padding:144px 0}.lpb-craft .st{margin-bottom:80px}.lpb-craft .st h2{font-size:36px}}
.lpb-craft .rv{transition:opacity .9s cubic-bezier(.2,.7,.2,1),transform .9s cubic-bezier(.2,.7,.2,1)}
.lpb-craft.lpb-js .rv{opacity:0;transform:translateY(20px)}.lpb-craft.lpb-js .rv.on{opacity:1;transform:none}
.lpb-craft .act{background:#fff;padding:112px 24px 32px;text-align:center}
.lpb-craft .act .bar{display:block;margin:0 auto;height:64px;width:1px;background:var(--line)}
.lpb-craft .act .elbl{margin-top:32px}
.lpb-craft .act p.t{margin-top:16px;font-size:18px;letter-spacing:.12em}
@media (min-width:768px){.lpb-craft .act{padding-top:144px}.lpb-craft .act p.t{font-size:22px}}
.lpb-craft .pains{list-style:none;padding:0;margin:0;border-top:1px solid var(--line)}
.lpb-craft .pains li{display:flex;align-items:baseline;gap:24px;border-bottom:1px solid var(--line);padding:28px 0}
.lpb-craft .pains .n{flex:none;font-size:14px;font-weight:500;color:var(--gold)}
.lpb-craft .pains p{font-size:16px;line-height:1.7}
.lpb-craft .pend{margin-top:64px;text-align:center;font-size:18px;letter-spacing:.03em}
@media (min-width:768px){.lpb-craft .pains li{gap:40px}.lpb-craft .pains p{font-size:18px}.lpb-craft .pend{font-size:22px}}
.lpb-craft .bgp{background:var(--paper)}
.lpb-craft .why{display:grid;gap:56px}
.lpb-craft .why article{border-top:1px solid color-mix(in srgb,var(--ink) 80%,transparent);padding-top:28px}
.lpb-craft .why .n{font-size:14px;font-weight:500;letter-spacing:.1em;color:var(--gold)}
.lpb-craft .why h3{margin-top:16px;font-size:19px;line-height:1.7;font-weight:500}
.lpb-craft .why p{margin-top:16px;font-size:14px;line-height:2;color:var(--mute)}
@media (min-width:768px){.lpb-craft .why{grid-template-columns:repeat(3,1fr);gap:48px}}
.lpb-craft .models{display:grid;gap:64px 32px}
@media (min-width:640px){.lpb-craft .models{grid-template-columns:repeat(2,1fr)}}
@media (min-width:1024px){.lpb-craft .models{grid-template-columns:repeat(3,1fr)}}
.lpb-craft .model .ph{display:block;overflow:hidden;background:var(--paper)}
.lpb-craft .model .ph img{aspect-ratio:4/3;width:100%;object-fit:cover;transition:transform 1.2s ease-out}
.lpb-craft .model:hover .ph img{transform:scale(1.04)}
.lpb-craft .model .mn{margin-top:20px;font-family:var(--en);font-size:12px;letter-spacing:.3em;color:var(--mute)}
.lpb-craft .model h3{margin-top:6px;font-size:18px;font-weight:500}
.lpb-craft .model .f{margin-top:8px;font-size:13.5px;line-height:1.7;color:var(--mute)}
.lpb-craft .model .sz{margin-top:16px;font-size:12.5px;color:var(--mute)}
.lpb-craft .model .pr{margin-top:20px;border-top:1px solid var(--line);padding-top:16px;font-size:12px;color:var(--mute)}
.lpb-craft .model .pr b{margin-left:8px;font-size:17px;font-weight:500;color:var(--ink)}
.lpb-craft .mnote{margin-top:32px;text-align:center;font-size:12px;color:var(--mute)}
.lpb-craft .opt{display:grid;gap:48px;align-items:center}
@media (min-width:1024px){.lpb-craft .opt{grid-template-columns:1.3fr 1fr;gap:80px}}
.lpb-craft .opt .pics{position:relative;aspect-ratio:16/9;overflow:hidden}
.lpb-craft .opt .pics img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:opacity .9s,transform .9s;opacity:0;transform:scale(1.05)}
.lpb-craft .opt .pics img.now{opacity:1;transform:none}
.lpb-craft .sweep{position:absolute;inset:0;pointer-events:none;background:linear-gradient(105deg,transparent 40%,rgba(255,240,200,.55) 50%,transparent 60%);mix-blend-mode:soft-light;opacity:0}
.lpb-craft .sweep.go{animation:cSw 1.4s .25s ease-out both}
@keyframes cSw{from{transform:translateX(-60%);opacity:0}30%{opacity:1}to{transform:translateX(60%);opacity:0}}
.lpb-craft .tabs{display:flex;gap:32px;border-bottom:1px solid var(--line)}
.lpb-craft .tabs button{margin-bottom:-1px;border:0;border-bottom:1px solid transparent;background:none;padding:0 0 12px;font:inherit;font-size:15px;color:var(--mute);cursor:pointer;transition:color .3s,border-color .3s}
.lpb-craft .tabs button.now{border-color:var(--ink);color:var(--ink)}
.lpb-craft .opd{display:none}.lpb-craft .opd.now{display:block;animation:cUp .9s cubic-bezier(.2,.7,.2,1) both}
.lpb-craft:not(.lpb-js) .opd,.lpb-craft.lpb-edit .opd{display:block;margin-bottom:20px}
.lpb-craft .opd .e{margin-top:32px;font-family:var(--en);font-size:13px;letter-spacing:.3em;color:var(--gold);text-transform:uppercase}
.lpb-craft .opd p:not(.e){margin-top:12px;min-height:4em;font-size:15px;line-height:2}
.lpb-craft .ob{margin-top:48px;display:flex;align-items:center;gap:20px;border-top:1px solid var(--line);padding-top:32px}
.lpb-craft .ob img{height:80px;width:128px;flex:none;object-fit:cover}
.lpb-craft .ob small{display:block;font-size:12px;letter-spacing:.1em;color:var(--mute)}
.lpb-craft .ob b{display:block;margin-top:4px;font-size:15px;font-weight:500}
.lpb-craft .ob span{display:block;margin-top:4px;font-size:13px;line-height:1.7;color:var(--mute)}
.lpb-craft .spo{max-width:672px;margin:96px auto 0;border-top:1px solid var(--line);padding-top:40px;text-align:center}
.lpb-craft .spo small{font-size:12px;letter-spacing:.1em;color:var(--mute)}
.lpb-craft .spo b{display:block;margin-top:12px;font-size:17px;font-weight:500}
.lpb-craft .spo p{margin-top:12px;font-size:13.5px;line-height:2;color:var(--mute)}
.lpb-craft .flow{list-style:none;padding:0;margin:0;display:grid;gap:48px}
@media (min-width:768px){.lpb-craft .flow{grid-template-columns:repeat(3,1fr)}}
.lpb-craft .flow .hd2{display:flex;align-items:center;gap:16px}
.lpb-craft .flow .hd2 b{font-size:36px;line-height:1;font-weight:300}
.lpb-craft .flow .hd2 i{flex:1;height:1px;background:var(--line);transform-origin:left;transition:transform 1.6s cubic-bezier(.6,0,.2,1) .3s}
.lpb-craft.lpb-js .flow li:not(.on) .hd2 i{transform:scaleX(0)}
.lpb-craft .flow h3{margin-top:20px;font-size:17px;font-weight:500}
.lpb-craft .flow p{margin-top:12px;font-size:14px;line-height:2;color:var(--mute)}
.lpb-craft .faq{max-width:768px;margin:0 auto;border-top:1px solid var(--line)}
.lpb-craft .faq details{border-bottom:1px solid var(--line)}
.lpb-craft .faq summary{display:flex;align-items:center;gap:24px;padding:28px 0;font-size:15.5px}
.lpb-craft .faq summary span{flex:1}
.lpb-craft .faq summary::after{content:"+";font-size:22px;font-weight:300;color:var(--mute);transition:transform .5s}
.lpb-craft .faq details[open] summary::after{transform:rotate(45deg);color:var(--ink)}
.lpb-craft .faq details p{padding-bottom:28px;font-size:14px;line-height:2;color:var(--mute)}
.lpb-craft .contact{background:#f5f5f4;padding:80px 0;text-align:center}
.lpb-craft .contact .box{max-width:560px;margin:0 auto;background:#fff;padding:48px 28px;border:1px solid var(--line)}
.lpb-craft .contact .btn{padding:18px 40px;font-size:14px}
@media (min-width:768px){.lpb-craft .contact{padding:112px 0}}
.lpb-craft .ft{border-top:1px solid var(--line);background:#fff;padding:48px 20px;text-align:center;color:var(--mute)}
.lpb-craft .ft .logo{font-size:20px;color:var(--ink)}
.lpb-craft .ft .s1{margin-top:12px;font-size:12px;letter-spacing:.05em}
.lpb-craft .ft .s2{margin:24px auto 0;max-width:28rem;font-size:11px;line-height:1.8}
.lpb-craft .fb{position:fixed;right:16px;bottom:calc(16px + env(safe-area-inset-bottom,0px));z-index:50;display:inline-flex;align-items:center;gap:10px;border:1px solid color-mix(in srgb,var(--ink) 10%,transparent);background:rgba(255,255,255,.7);padding:12px 16px 12px 20px;font-size:12.5px;letter-spacing:.14em;backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);transition:all .5s;opacity:0;transform:translateY(16px);pointer-events:none}
.lpb-craft .fb::after{content:"↗"}
.lpb-craft .fb.on{opacity:1;transform:none;pointer-events:auto}
.lpb-craft .fb:hover{background:var(--ink);color:#fff}
@media (min-width:768px){.lpb-craft .fb{right:32px;bottom:32px}}
@media (prefers-reduced-motion:reduce){.lpb-craft *{animation:none!important}.lpb-craft.lpb-js .rv,.lpb-craft.lpb-js .stmt .c{opacity:1!important;transform:none!important;filter:none!important}}`,
  render: ({ f, img, link, when, v, has }) => {
    const badges = v("badges").split(/[|｜]/).map((x) => x.trim()).filter(Boolean);
    const sp = has("heroSp");
    const model = (n: number) => `<article class="model rv"><span class="ph">${img(`m${n}`)}</span><p class="mn">MODEL 0${n}</p>${f(`m${n}N`, "h3")}${f(`m${n}F`, "p", "f")}${when([`m${n}S`], f(`m${n}S`, "p", "sz"))}<p class="pr">参考価格${f(`m${n}P`, "b")}</p></article>`;
    return `
<header class="hd"><div class="w">${f("word", "a", "logo")}<button type="button" class="mb" aria-label="メニューを開く" aria-expanded="false"><span><i></i><i></i></span></button></div></header>
<nav class="menu" aria-hidden="true"><ul>${[["#craft-why", v("whyTitle") || "選ばれる理由"], ["#craft-models", v("mTitle") || "商品一覧"], ["#craft-finish", v("opTitle") || "仕上げ"], ["#craft-flow", v("flowTitle") || "ご注文の流れ"], ["#craft-contact", v("contactTitle") || "お問い合わせ"]].map(([h, l]) => `<li><a href="${h}" tabindex="-1">${l}</a></li>`).join("")}</ul></nav>
<section class="hero"><div class="in">
 <div class="photo${sp ? "" : " nosp"}">
  <div class="stage"><div class="zoom">
   ${img("hero", "ly pc")}${sp ? img("heroSp", "ly sp") : ""}
   <div class="word" aria-hidden="true">${f("word")}</div>
   ${img("heroCut", "ly cut pc")}${sp ? img("heroSpCut", "ly cut sp") : ""}
   <div class="wlight" aria-hidden="true"></div>
  </div></div>
  <div class="clight" aria-hidden="true"></div>
  <div class="fadeb"></div><div class="fadel"></div>
 </div>
 <div class="copy"><div class="w"><div class="bx">
  ${f("kick", "p", "kick hin")}
  <h1>${f("heroCopy", "span", "hc")}</h1>
  ${badges.length ? `<p class="badges hin num" style="animation-delay:.6s">${badges.join("<i>|</i>")}</p>` : ""}
  <div class="ctas hin" style="animation-delay:.75s">${link("ctaLabel", "ctaUrl", "btn")}${when(["cta2Label"], link("cta2Label", "cta2Url", "ul"))}</div>
 </div></div></div>
</div></section>
<section class="stmt"><div class="in">
 <p class="elbl">OUR PHILOSOPHY</p>
 ${f("statement", "div", "lines")}
 <span class="stl"></span>
</div></section>
<section class="craft" aria-label="工程"><div class="wrap"><div class="stk">
 ${[1, 2, 3, 4].map((n) => `<div class="scene">${img(`step${n}`)}<div class="shd2"></div><div class="stx"><p class="no">0${n}</p>${f(`s${n}E`, "p", "se")}${f(`s${n}T`, "h3")}${f(`s${n}B`, "p")}</div></div>`).join("")}
 <div class="shade"></div><div class="dim"></div>
 <div class="cintro"><p class="elbl">CRAFTSMANSHIP</p>${f("craftTitle", "h2")}${f("craftBody", "p")}<span class="cue"></span></div>
 <div class="prg">${[0, 1, 2, 3].map(() => "<span><i></i></span>").join("")}</div>
</div></div></section>
<div class="act rv"><span class="bar"></span><p class="elbl">FOR YOUR BRAND</p>${f("actBreak", "p", "t")}</div>
<section class="s"><div class="w4">
 <div class="st rv"><p class="elbl">Problems</p>${f("painTitle", "h2")}</div>
 <ol class="pains">${[1, 2, 3].map((n) => `<li class="rv"><span class="n num">0${n}</span>${f(`pain${n}`, "p")}</li>`).join("")}</ol>
 ${f("painEnd", "p", "pend rv")}
</div></section>
<section class="s bgp" id="craft-why"><div class="w">
 <div class="st rv"><p class="elbl">Why us</p>${f("whyTitle", "h2")}</div>
 <div class="why">${[1, 2, 3].map((n) => `<article class="rv"><p class="n num">0${n}</p>${f(`why${n}T`, "h3")}${f(`why${n}B`, "p")}</article>`).join("")}</div>
</div></section>
<section class="s" id="craft-models"><div class="w">
 <div class="st rv"><p class="elbl">Lineup</p>${f("mTitle", "h2")}${f("mSub", "p", "sub")}</div>
 <div class="models">${model(1)}${model(2)}${model(3)}${[4, 5, 6].map((n) => (has(`m${n}`) ? model(n) : "")).join("")}</div>
 ${when(["mNote"], f("mNote", "p", "mnote"))}
</div></section>
<section class="s bgp" id="craft-finish"><div class="w">
 <div class="st rv"><p class="elbl">Finish</p>${f("opTitle", "h2")}${f("opSub", "p", "sub")}</div>
 <div class="opt">
  <div class="pics rv">${img("op1", "now")}${img("op2")}${img("op3")}<span class="sweep"></span></div>
  <div class="rv">
   <div class="tabs" role="tablist">${[1, 2, 3].map((n) => `<button type="button" role="tab" class="${n === 1 ? "now" : ""}">${v(`op${n}N`)}</button>`).join("")}</div>
   ${[1, 2, 3].map((n) => `<div class="opd${n === 1 ? " now" : ""}">${f(`op${n}E`, "p", "e")}${f(`op${n}B`, "p")}</div>`).join("")}
   ${has("opt") ? `<div class="ob">${img("opt")}<div><small>OPTION</small>${f("optT", "b")}${f("optB", "span")}</div></div>` : ""}
  </div>
 </div>
 ${when(["spT"], `<div class="spo rv"><small>SPECIAL ORDER</small>${f("spT", "b")}${f("spB", "p")}</div>`)}
</div></section>
<section class="s" id="craft-flow"><div class="w">
 <div class="st rv"><p class="elbl">Flow</p>${f("flowTitle", "h2")}</div>
 <ol class="flow">${[1, 2, 3].map((n) => `<li class="rv"><div class="hd2"><b class="num">${n}</b><i></i></div>${f(`f${n}T`, "h3")}${f(`f${n}B`, "p")}</li>`).join("")}</ol>
 ${when(["q1Q", "q2Q", "q3Q", "q4Q"], `<div style="margin-top:128px"><div class="st rv"><p class="elbl">FAQ</p><h2>よくある質問</h2></div>
  <div class="faq">${[1, 2, 3, 4].map((n) => when([`q${n}Q`], `<details class="rv"><summary>${f(`q${n}Q`)}</summary>${f(`q${n}A`, "p")}</details>`)).join("")}</div></div>`)}
</div></section>
<section class="contact" id="craft-contact"><div class="w">
 <div class="st rv" style="margin-bottom:40px"><p class="elbl">Contact</p>${f("contactTitle", "h2")}${f("contactSub", "p", "sub")}</div>
 <div class="box rv">${link("ctaLabel", "ctaUrl", "btn")}</div>
</div></section>
<footer class="ft">${f("brand", "p", "logo")}${f("footSub", "p", "s1")}${when(["note"], f("note", "p", "s2"))}</footer>
${link("floatLabel", "ctaUrl", "fb")}`;
  },
  js: `var Q=function(s){return root.querySelector(s)},QA=function(s){return [].slice.call(root.querySelectorAll(s))},es=function(s){return s.replace(/&/g,"&amp;").replace(/</g,"&lt;")};
watch(".stmt,.flow li");
var hc=Q(".hero .hc");if(hc&&!EDIT){hc.outerHTML=hc.innerHTML.split(/<br\\s*\\/?>/i).map(function(l,i){return '<span class="lm"><span style="animation-delay:'+(.2+i*.15)+'s">'+l+'</span></span>'}).join("")}
var st=Q(".stmt .lines");
if(st&&!EDIT){var ci=0,rnd=function(n){var x=Math.sin(n*12.9898)*43758.5453;return x-Math.floor(x)};
 st.innerHTML=st.innerHTML.split(/<br\\s*\\/?>/i).map(function(line){return '<p>'+line.split(/\\s+/).filter(Boolean).map(function(w){var ac=/<em>/.test(w);var d=document.createElement("div");d.innerHTML=w;return '<span class="wd'+(ac?" ac":"")+'">'+d.textContent.split("").map(function(ch){ci++;var a=rnd(ci)*6.283,R=40+rnd(ci+99)*120;return '<span class="c" style="--dx:'+(Math.cos(a)*R).toFixed(0)+'px;--dy:'+(Math.sin(a)*R+40).toFixed(0)+'px;--d:'+(ci*.05+rnd(ci+7)*.45).toFixed(2)+'s">'+es(ch)+'</span>'}).join("")+'</span>'}).join("")+'</p>'}).join("")}
// ヘッダー：LPの中では上に固定。下へスクロール中は隠し、上へ戻すと出す。メニューは全画面
var hd=Q(".hd"),mb=Q(".mb"),menu=Q(".menu"),last=0;
function setMenu(o){if(!hd||!menu)return;hd.classList.toggle("open",o);menu.classList.toggle("open",o);menu.setAttribute("aria-hidden",o?"false":"true");mb.setAttribute("aria-expanded",o?"true":"false");mb.setAttribute("aria-label",o?"メニューを閉じる":"メニューを開く");QA(".menu a").forEach(function(a,i){a.tabIndex=o?0:-1;a.style.transitionDelay=o?(.1+i*.05)+"s":"0s"});document.documentElement.style.overflow=o?"hidden":""}
if(mb)mb.addEventListener("click",function(){setMenu(!hd.classList.contains("open"))});
if(menu){menu.addEventListener("click",function(e){if(e.target===menu||e.target.closest("a"))setMenu(false)})}
addEventListener("keydown",function(e){if(e.key==="Escape")setMenu(false)});
function hsc(){if(!hd)return;var r=root.getBoundingClientRect(),y=-r.top;hd.classList.toggle("fx",y>0&&r.bottom>80);hd.classList.toggle("sc",y>40);if(Math.abs(y-last)>6){hd.classList.toggle("hide",y>last&&y>120);last=y}}
addEventListener("scroll",hsc,{passive:true});hsc();
var tabs=QA(".tabs button"),pics=QA(".opt .pics img"),ods=QA(".opd"),sw=Q(".sweep");
tabs.forEach(function(b,i){b.addEventListener("click",function(){tabs.forEach(function(x,k){x.classList.toggle("now",k===i)});pics.forEach(function(x,k){x.classList.toggle("now",k===i)});ods.forEach(function(x,k){x.classList.toggle("now",k===i)});if(sw){sw.classList.remove("go");void sw.offsetWidth;if(i>0)sw.classList.add("go")}})});
if(!EDIT){
 var hero=Q(".hero"),stage=Q(".stage"),word=Q(".word"),copy=Q(".copy"),cl=Q(".clight");
 var wrap=Q(".craft .wrap"),scenes=QA(".scene"),stx=QA(".stx"),bars=QA(".prg i"),dim=Q(".dim"),cin=Q(".cintro"),fb=Q(".fb"),ct=Q("#craft-contact"),ft=Q(".ft");
 function sc(){var vh=innerHeight;
  if(hero&&stage&&!RED){var r=hero.getBoundingClientRect(),p=Math.min(1,Math.max(0,-r.top/Math.max(1,hero.offsetHeight)));stage.style.transform="scale("+(1+p*.18)+")";if(word)word.style.translate="0 "+(p*-120)+"px";if(copy)copy.style.transform="translateY("+(p*60)+"px)"}
  if(wrap){var w=wrap.getBoundingClientRect(),tot=w.height-vh,q=tot>0?Math.min(.9999,Math.max(0,-w.top/tot)):0,n=scenes.length+1,idx=Math.floor(q*n),act=idx-1,loc=q*n-idx,cur=Math.max(0,act);
   scenes.forEach(function(s,i){s.classList.toggle("now",i===cur);s.classList.toggle("past",i<cur);var im=s.querySelector("img");if(im)im.style.transform="scale("+(i===cur?1.12-.08*(act<0?0:loc):1.12)+")"});
   stx.forEach(function(s,i){s.classList.toggle("now",i===act)});
   bars.forEach(function(b,i){b.style.height=i<act?"100%":i===act?(loc*100)+"%":"0%"});
   if(dim)dim.style.opacity=act<0?1:0;if(cin){cin.style.opacity=act<0?1:0;cin.style.transform=act<0?"none":"translateY(-24px)";cin.style.pointerEvents=act<0?"auto":"none"}}
  if(fb){var rt=root.getBoundingClientRect(),nc=ct?ct.getBoundingClientRect().top<vh*.9:false,nf=ft?ft.getBoundingClientRect().top<vh-20:false;fb.classList.toggle("on",-rt.top>vh*.8&&rt.bottom>vh&&!nc&&!nf)}}
 addEventListener("scroll",function(){requestAnimationFrame(sc)},{passive:true});addEventListener("resize",sc);sc();
 if(cl&&matchMedia("(pointer:fine)").matches)addEventListener("mousemove",function(e){var r=cl.getBoundingClientRect();cl.style.setProperty("--mx",(e.clientX-r.left)+"px");cl.style.setProperty("--my",(e.clientY-r.top)+"px");cl.style.opacity="1"});
}`,
};
