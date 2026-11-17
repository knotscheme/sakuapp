import type { Template } from "../types";

// SORAE：化粧品・スキンケア向け。元のLP（works/lp-lotion）のデザインと動きをそのまま型にしたもの
// 文章と写真だけを入れかえられる。CSS はすべて .lpb-sorae の中に閉じこめてある
const split = (s: string) => s.split(/[、,，\n]+/).map((x) => x.trim()).filter(Boolean);

export const sorae: Template = {
  id: "sorae",
  name: "SORAE",
  kind: "化粧品・スキンケア",
  desc: "透きとおる光と泡、ふわっと浮かぶボトル。やさしく澄んだ世界観で、スキンケアの心地よさを伝える型です。",
  best: "化粧水・美容液・ヘアケア・サプリ・アロマなど",
  fonts: "https://fonts.googleapis.com/css2?family=Jost:wght@200;300;400&family=Noto+Sans+JP:wght@200;300;400;500&display=swap",
  colors: [
    { id: "ac", label: "アクセント", value: "#7b8fd6" },
    { id: "ink", label: "文字・ボタン", value: "#2a3243" },
    { id: "sky", label: "光の色1", value: "#cfe3f5" },
    { id: "lav", label: "光の色2", value: "#ddd6f3" },
    { id: "bg", label: "背景", value: "#fbfcfe" },
  ],
  slots: [
    { id: "bottle", label: "商品（白背景・縦長）", ratio: [5, 16], min: 300, max: 720, where: "ファーストビューに浮かぶ商品", prompt: "{product}のボトルを1本だけ、真正面から撮った商品写真。背景は真っ白で影なし、ボトル全体が縦いっぱいに入る、ラベルがはっきり読める、清潔で上品なスキンケアの広告写真。ボトル以外は何も写さない。縦長。", tips: "白い紙の前で真正面から。背景を消した「切り抜き画像（PNG）」を入れると、背景の光の上に商品が浮かんで、いちばんきれいに見えます。" },
    { id: "face", label: "人物（縦長）", ratio: [1, 2], min: 400, max: 900, where: "メッセージの後ろにうっすら見える写真", prompt: "{target}の女性が、目を閉じて頬に両手を当てている。素肌感、白い服、明るく白い背景、やわらかい光。上半身、縦長。文字は入れない。", tips: "上に文字が重なるので、背景は白っぽく明るい写真が合います。肖像の使用許可を必ず取ってください。" },
    { id: "qc", label: "品質チェック（横長）", ratio: [4, 3], min: 700, max: 1200, where: "「8 FREE」の下の写真", prompt: "清潔な白い検査室で、白衣・帽子・手袋の検査員が、ルーペで{product}のボトルを1本ずつ確かめている。明るい自然光、信頼感。顔ははっきり写さない。文字は入れない。横長4:3。", tips: "製造・検品・梱包の様子があれば一番説得力があります。原料や道具を並べた写真でも代わりになります。" },
    { id: "use", label: "使い方（手元・縦長）", ratio: [3, 4], min: 500, max: 900, where: "「使い方」の、上が丸い写真", prompt: "手のひらに{product}を少量出しているクローズアップ。白い背景、やわらかい光、肌の質感がきれい。縦長3:4。文字は入れない。", tips: "手のひらを真上から。上が丸く切り抜かれるので、手元は写真の真ん中より少し下に。" },
  ],
  fields: [
    { id: "brand", label: "ブランド名", group: "ファーストビュー", max: 16, hint: "ロゴの代わりに出すブランド名（英字がおすすめ）" },
    { id: "kick", label: "上の小さな英字", group: "ファーストビュー", max: 30, hint: "商品の種類を英語で（例：CERAMIDE LOTION）" },
    { id: "heroCopy", label: "キャッチコピー（2行）", group: "ファーストビュー", multiline: true, max: 24, hint: "2行のキャッチコピー。1行ずつ改行。2行目は色が変わる" },
    { id: "lead", label: "サブコピー", group: "ファーストビュー", multiline: true, max: 70 },
    { id: "ctaLabel", label: "ボタンの文字", group: "ファーストビュー", max: 14 },
    { id: "ctaUrl", label: "ボタンのリンク先", group: "ファーストビュー", url: true },
    { id: "ctaNote", label: "ボタン横の小さな文字", group: "ファーストビュー", max: 20, optional: true, hint: "例：30日間 返金保証つき" },
    { id: "tag1", label: "浮かぶラベル1", group: "ファーストビュー", max: 14, hint: "商品の特長を英語の短い単語で" },
    { id: "tag2", label: "浮かぶラベル2", group: "ファーストビュー", max: 14 },
    { id: "tag3", label: "浮かぶラベル3", group: "ファーストビュー", max: 14 },
    { id: "marquee", label: "流れる文字（、で区切る）", group: "ファーストビュー", max: 90, hint: "横に流れるキーワード（英字）を、、で区切って5つほど" },
    { id: "statement", label: "メッセージ（言葉ごとに空白）", group: "メッセージ", multiline: true, max: 60, hint: "読み進めると1語ずつ浮かぶ文章。言葉と言葉の間に空白を入れ、色を変えたい言葉は＊で囲む" },
    { id: "forTitle", label: "おすすめの見出し", group: "こんな方に", max: 20 },
    { id: "for1T", label: "おすすめ1", group: "こんな方に", max: 14 },
    { id: "for1B", label: "おすすめ1の説明", group: "こんな方に", max: 30 },
    { id: "for2T", label: "おすすめ2", group: "こんな方に", max: 14 },
    { id: "for2B", label: "おすすめ2の説明", group: "こんな方に", max: 30 },
    { id: "for3T", label: "おすすめ3", group: "こんな方に", max: 14 },
    { id: "for3B", label: "おすすめ3の説明", group: "こんな方に", max: 30 },
    { id: "ringNum", label: "円の中の数字", group: "主役の成分", max: 4, hint: "数字だけ（例：80）。事実として言える数字だけ" },
    { id: "ringUnit", label: "数字の単位", group: "主役の成分", max: 4 },
    { id: "ringCap", label: "数字の説明", group: "主役の成分", max: 24 },
    { id: "keyLabel", label: "成分の英字", group: "主役の成分", max: 20 },
    { id: "keyTitle", label: "成分の見出し", group: "主役の成分", multiline: true, max: 30 },
    { id: "keyBody", label: "成分の説明", group: "主役の成分", multiline: true, max: 110 },
    { id: "duo1T", label: "小さなカード1", group: "主役の成分", max: 14 },
    { id: "duo1B", label: "カード1の説明", group: "主役の成分", max: 18 },
    { id: "duo2T", label: "小さなカード2", group: "主役の成分", max: 14 },
    { id: "duo2B", label: "カード2の説明", group: "主役の成分", max: 18 },
    { id: "igTitle", label: "美容成分の見出し", group: "美容成分", max: 22 },
    { id: "ig1E", label: "成分1の英字", group: "美容成分", max: 20 },
    { id: "ig1T", label: "成分1の名前", group: "美容成分", max: 16 },
    { id: "ig1B", label: "成分1の説明", group: "美容成分", multiline: true, max: 50 },
    { id: "ig2E", label: "成分2の英字", group: "美容成分", max: 20 },
    { id: "ig2T", label: "成分2の名前", group: "美容成分", max: 16 },
    { id: "ig2B", label: "成分2の説明", group: "美容成分", multiline: true, max: 50 },
    { id: "ig3E", label: "成分3の英字", group: "美容成分", max: 20 },
    { id: "ig3T", label: "成分3の名前", group: "美容成分", max: 16 },
    { id: "ig3B", label: "成分3の説明", group: "美容成分", multiline: true, max: 50 },
    { id: "freeLabel", label: "使わない成分の英字", group: "使わない成分", max: 12 },
    { id: "freeTitle", label: "使わない成分の見出し", group: "使わない成分", max: 22 },
    { id: "freeSub", label: "使わない成分の説明", group: "使わない成分", max: 40 },
    { id: "freeList", label: "使わない成分（、で区切る・8つ）", group: "使わない成分", multiline: true, max: 80, hint: "使っていない成分を、、で区切って8つ" },
    { id: "qcTitle", label: "品質の見出し", group: "使わない成分", multiline: true, max: 24 },
    { id: "qcBody", label: "品質の説明", group: "使わない成分", multiline: true, max: 50 },
    { id: "made1N", label: "大きな文字1", group: "使わない成分", max: 8, hint: "例：JAPAN" },
    { id: "made1B", label: "大きな文字1の説明", group: "使わない成分", max: 40 },
    { id: "made2N", label: "大きな文字2", group: "使わない成分", max: 8, hint: "例：30" },
    { id: "made2U", label: "大きな文字2の単位", group: "使わない成分", max: 6 },
    { id: "made2B", label: "大きな文字2の説明", group: "使わない成分", max: 40 },
    { id: "howTitle", label: "使い方の見出し", group: "使い方", max: 20 },
    { id: "howCap", label: "写真の上の小さな文字", group: "使い方", max: 14, optional: true },
    { id: "how1T", label: "手順1", group: "使い方", max: 16 },
    { id: "how1B", label: "手順1の説明", group: "使い方", max: 20 },
    { id: "how2T", label: "手順2", group: "使い方", max: 16 },
    { id: "how2B", label: "手順2の説明", group: "使い方", max: 20 },
    { id: "how3T", label: "手順3", group: "使い方", max: 16 },
    { id: "how3B", label: "手順3の説明", group: "使い方", max: 20 },
    { id: "priceTitle", label: "価格の見出し", group: "価格", max: 20 },
    { id: "priceTag", label: "価格の上のラベル", group: "価格", max: 10, optional: true },
    { id: "priceName", label: "商品名と容量", group: "価格", max: 24 },
    { id: "priceOld", label: "通常価格（取り消し線）", group: "価格", max: 10, optional: true },
    { id: "price", label: "価格（数字）", group: "価格", max: 10 },
    { id: "priceUnit", label: "価格の単位", group: "価格", max: 10 },
    { id: "pt1", label: "価格の特典1", group: "価格", max: 24, optional: true },
    { id: "pt2", label: "価格の特典2", group: "価格", max: 24, optional: true },
    { id: "pt3", label: "価格の特典3", group: "価格", max: 24, optional: true },
    { id: "guarN", label: "保証の数字", group: "価格", max: 4, optional: true },
    { id: "guarT", label: "保証の見出し", group: "価格", max: 16, optional: true },
    { id: "guarB", label: "保証の説明", group: "価格", multiline: true, max: 50, optional: true },
    { id: "faq1Q", label: "質問1", group: "よくある質問", max: 30, optional: true },
    { id: "faq1A", label: "答え1", group: "よくある質問", multiline: true, max: 90, optional: true },
    { id: "faq2Q", label: "質問2", group: "よくある質問", max: 30, optional: true },
    { id: "faq2A", label: "答え2", group: "よくある質問", multiline: true, max: 90, optional: true },
    { id: "faq3Q", label: "質問3", group: "よくある質問", max: 30, optional: true },
    { id: "faq3A", label: "答え3", group: "よくある質問", multiline: true, max: 90, optional: true },
    { id: "endTitle", label: "最後の見出し", group: "最後", multiline: true, max: 30 },
    { id: "endSub", label: "最後の補足", group: "最後", max: 40 },
    { id: "floatLabel", label: "下に浮かぶボタンの文字", group: "最後", max: 20 },
    { id: "note", label: "いちばん下の文字", group: "最後", multiline: true, max: 80, optional: true, hint: "会社名・注意書き（効果の感じ方には個人差があります、など）" },
  ],
  css: `.lpb-sorae{--sub:#a3abbd;--line:#e4e8f1;--ink2:#6b7488;--mint:#d7efe8;--en:"Jost",sans-serif;background:var(--bg);color:var(--ink);font-family:"Noto Sans JP",sans-serif;font-weight:300;line-height:2.1;letter-spacing:.1em}
.lpb-sorae .w{max-width:1080px;margin:0 auto;padding:0 32px}
.lpb-sorae .en{font-family:var(--en);letter-spacing:.32em;font-weight:300}
.lpb-sorae .hd{position:absolute;top:28px;left:0;right:0;z-index:5}
.lpb-sorae .hd .w{display:flex;justify-content:space-between;align-items:center;max-width:none;padding:0 44px}
.lpb-sorae .logo{font:300 20px var(--en);letter-spacing:.5em}
.lpb-sorae .btn{display:inline-flex;align-items:center;gap:14px;border-radius:999px;padding:17px 36px;font-size:13.5px;letter-spacing:.14em;background:var(--ink);color:#fff;transition:transform .4s,box-shadow .4s}
.lpb-sorae .btn:hover{transform:translateY(-2px);box-shadow:0 16px 30px -14px rgba(42,50,67,.5)}
.lpb-sorae .btn::after{content:"→"}
.lpb-sorae .hero{position:relative;min-height:100svh;overflow:hidden;display:flex;align-items:center;background:var(--bg)}
.lpb-sorae .aura{position:absolute;inset:0;pointer-events:none}
.lpb-sorae .aura i{position:absolute;border-radius:50%;filter:blur(70px);opacity:.9}
.lpb-sorae .aura i:nth-child(1){width:52vmax;height:52vmax;right:-8%;top:-12%;background:var(--sky);animation:sDr1 16s ease-in-out infinite alternate}
.lpb-sorae .aura i:nth-child(2){width:40vmax;height:40vmax;right:18%;bottom:-20%;background:var(--lav);animation:sDr2 19s ease-in-out infinite alternate}
.lpb-sorae .aura i:nth-child(3){width:30vmax;height:30vmax;left:-8%;top:30%;background:var(--mint);opacity:.6;animation:sDr1 22s ease-in-out infinite alternate-reverse}
@keyframes sDr1{to{transform:translate(-6vmax,6vmax)}}
@keyframes sDr2{to{transform:translate(6vmax,-5vmax)}}
.lpb-sorae .ripple{position:absolute;right:20%;top:50%;width:520px;height:520px;margin:-260px -260px 0 0;pointer-events:none}
.lpb-sorae .ripple span{position:absolute;inset:0;border-radius:50%;border:1px solid color-mix(in srgb,var(--ac) 35%,transparent);animation:sRp 6s cubic-bezier(.2,.6,.3,1) infinite;opacity:0}
.lpb-sorae .ripple span:nth-child(2){animation-delay:2s}.lpb-sorae .ripple span:nth-child(3){animation-delay:4s}
@keyframes sRp{0%{transform:scale(.3);opacity:.9}100%{transform:scale(1.25);opacity:0}}
.lpb-sorae .bubs{position:absolute;inset:0;pointer-events:none;overflow:hidden}
.lpb-sorae .bub{position:absolute;bottom:-40px;border-radius:50%;border:1px solid color-mix(in srgb,var(--ac) 35%,transparent);background:radial-gradient(circle at 30% 30%,rgba(255,255,255,.9),color-mix(in srgb,var(--sky) 20%,transparent));animation:sRise linear infinite;pointer-events:none}
@keyframes sRise{to{transform:translate(var(--x,20px),-110vh)}}
.lpb-sorae .hero .w{position:relative;display:grid;grid-template-columns:1.1fr .9fr;align-items:center;width:100%;max-width:1180px}
.lpb-sorae .hero .kick{font-size:12px;color:var(--ac)}
.lpb-sorae .hero h1{margin:26px 0 0;font-weight:200;font-size:clamp(34px,4.6vw,58px);line-height:1.6;letter-spacing:.16em}
.lpb-sorae .hero h1 .ln{display:block}
.lpb-sorae .hero h1 .ln:nth-child(2){color:color-mix(in srgb,var(--ac) 72%,#000)}
.lpb-sorae .hero h1 b{font-weight:200}
.lpb-sorae .ch{display:inline-block;transition:opacity 1.1s,filter 1.1s,transform 1.1s cubic-bezier(.19,1,.22,1)}
.lpb-sorae.lpb-js .ch{opacity:0;filter:blur(10px);transform:translateY(.4em)}
.lpb-sorae.lpb-js.on .ch{opacity:1;filter:none;transform:none}
.lpb-sorae .hero .lead{margin:32px 0 0;font-size:13.5px;color:var(--ink2);max-width:25em;transition:opacity 1.4s .6s}
.lpb-sorae .hero .cta{margin-top:44px;display:flex;align-items:center;gap:20px;flex-wrap:wrap;transition:opacity 1.4s .9s}
.lpb-sorae.lpb-js .hero .lead,.lpb-sorae.lpb-js .hero .cta{opacity:0}
.lpb-sorae.lpb-js.on .hero .lead,.lpb-sorae.lpb-js.on .hero .cta{opacity:1}
.lpb-sorae .hero .cta small{font-size:11.5px;color:var(--sub)}
.lpb-sorae .bwrap{position:relative;display:flex;justify-content:center;transition:transform .9s cubic-bezier(.19,1,.22,1)}
.lpb-sorae .bwrap:before{content:"";position:absolute;left:50%;top:50%;width:min(110%,560px);aspect-ratio:1;transform:translate(-50%,-48%);border-radius:50%;background:radial-gradient(closest-side,rgba(255,255,255,.95),rgba(255,255,255,.55) 45%,transparent 72%);pointer-events:none;animation:sGlow 6s ease-in-out infinite}
.lpb-sorae .bwrap:after{content:"";position:absolute;left:50%;bottom:2%;width:46%;height:26px;transform:translateX(-50%);border-radius:50%;background:radial-gradient(closest-side,rgba(80,100,160,.28),transparent);filter:blur(4px);animation:sShd 7s ease-in-out infinite;pointer-events:none}
@keyframes sGlow{50%{opacity:.75;transform:translate(-50%,-48%) scale(1.06)}}
@keyframes sShd{50%{transform:translateX(-50%) scale(.82);opacity:.7}}
.lpb-sorae .bwrap .btl{position:relative;z-index:1;height:min(72vh,600px);width:auto;filter:drop-shadow(0 50px 40px rgba(80,100,160,.22));animation:sFl 7s ease-in-out infinite;transition:opacity 1.6s .3s,transform 1.6s .3s}
.lpb-sorae.lpb-js .bwrap .btl{opacity:0;transform:translateY(40px)}
.lpb-sorae.lpb-js.on .bwrap .btl{opacity:1;transform:none}
@keyframes sFl{50%{translate:0 -14px}}
.lpb-sorae .tags{position:absolute;inset:0;z-index:2;transition:transform .9s cubic-bezier(.19,1,.22,1)}
.lpb-sorae .tags span{position:absolute;font-size:11px;letter-spacing:.14em;color:var(--ink2);background:rgba(255,255,255,.7);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,.9);border-radius:99px;padding:7px 16px;box-shadow:0 10px 30px -18px rgba(60,80,140,.4);white-space:nowrap}
.lpb-sorae .tags span:nth-child(1){left:0;top:24%}.lpb-sorae .tags span:nth-child(2){right:0;top:46%}.lpb-sorae .tags span:nth-child(3){left:6%;bottom:22%}
.lpb-sorae .mq{border-top:1px solid var(--line);border-bottom:1px solid var(--line);overflow:hidden;padding:22px 0;background:#fff}
.lpb-sorae .mq div{display:flex;gap:56px;width:max-content;animation:sMq 34s linear infinite;font:200 clamp(22px,3vw,40px) var(--en);letter-spacing:.24em;color:var(--sub)}
.lpb-sorae .mq span:nth-child(even){color:var(--ac)}
@keyframes sMq{to{transform:translateX(-50%)}}
.lpb-sorae section{padding:160px 0}
.lpb-sorae .sh{text-align:center;margin-bottom:76px}
.lpb-sorae .sh .en{font-size:11.5px;color:var(--ac)}
.lpb-sorae .sh h2{margin:18px 0 0;font-weight:200;font-size:clamp(24px,3vw,34px);line-height:1.8;letter-spacing:.18em}
.lpb-sorae .sh p{margin:22px auto 0;max-width:32em;font-size:13.5px;color:var(--ink2)}
.lpb-sorae .stm{position:relative;overflow:hidden;isolation:isolate;padding:170px 0 120px}
.lpb-sorae .stm .w{position:relative;z-index:1}
.lpb-sorae .stm .w:before{content:"";position:absolute;left:50%;top:50%;width:min(860px,120%);height:150%;transform:translate(-50%,-50%);background:radial-gradient(closest-side,color-mix(in srgb,var(--bg) 82%,transparent),color-mix(in srgb,var(--bg) 55%,transparent) 60%,transparent);z-index:-1;pointer-events:none}
.lpb-sorae .stm p{position:relative;margin:0 auto;max-width:15em;text-align:center;font-size:clamp(26px,3.8vw,48px);line-height:1.8;letter-spacing:.14em;font-weight:300}
.lpb-sorae .stm p em{color:color-mix(in srgb,var(--ac) 72%,#000)}
.lpb-sorae .stm .wd{display:inline-block;white-space:nowrap;color:rgba(42,50,67,.38);text-shadow:0 0 14px #fff,0 0 4px #fff;transition:color .5s}
.lpb-sorae .stm .wd.on{color:var(--ink)}
.lpb-sorae .stm .wd.ac.on{color:color-mix(in srgb,var(--ac) 72%,#000)}
.lpb-sorae .sbg{position:absolute;inset:0;z-index:0;overflow:hidden}
.lpb-sorae .sbg img{position:absolute;top:-4%;right:4%;height:108%;width:auto;max-width:none;filter:saturate(.95);-webkit-mask-image:linear-gradient(90deg,transparent,#000 14%,#000 97%,transparent);mask-image:linear-gradient(90deg,transparent,#000 14%,#000 97%,transparent)}
.lpb-sorae .sbg:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,var(--bg) 0%,color-mix(in srgb,var(--bg) 50%,transparent) 16%,color-mix(in srgb,var(--bg) 42%,transparent) 50%,color-mix(in srgb,var(--bg) 50%,transparent) 84%,var(--bg) 100%)}
.lpb-sorae .fy{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--line);border:1px solid var(--line)}
.lpb-sorae .fy div{background:var(--bg);padding:52px 30px;text-align:center;transition:background .5s}
.lpb-sorae .fy div:hover{background:#f2f5fb}
.lpb-sorae .fy .n{font:200 40px/1 var(--en);color:var(--sub);letter-spacing:.1em;transition:color .5s}
.lpb-sorae .fy div:hover .n{color:var(--ac)}
.lpb-sorae .fy b{display:block;margin-top:22px;font-weight:400;font-size:15px}
.lpb-sorae .fy p{margin:10px 0 0;font-size:12.5px;color:var(--ink2)}
.lpb-sorae .cr{background:linear-gradient(180deg,var(--bg),#f2f5fb)}
.lpb-sorae .cr .w{display:grid;grid-template-columns:1fr 1fr;gap:90px;align-items:center}
.lpb-sorae .ring{position:relative;aspect-ratio:1;max-width:420px;margin:0 auto;width:100%}
.lpb-sorae .ring svg{width:100%;height:auto;display:block}
.lpb-sorae .ring .arc{stroke:var(--ac);transition:stroke-dashoffset 2.4s cubic-bezier(.19,1,.22,1)}
.lpb-sorae .ring .c{position:absolute;inset:0;display:grid;place-items:center;text-align:center}
.lpb-sorae .ring .c b{display:block;font:200 88px/1 var(--en);letter-spacing:0}
.lpb-sorae .ring .c b small{font-size:.32em}
.lpb-sorae .ring .c .cap{display:block;font-size:12px;color:var(--ink2)}
.lpb-sorae .cr h2{font-weight:200;font-size:clamp(24px,2.8vw,32px);line-height:1.9;letter-spacing:.16em;margin:16px 0 0}
.lpb-sorae .cr p{font-size:13.5px;color:var(--ink2)}
.lpb-sorae .duo{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:30px}
.lpb-sorae .duo div{border:1px solid var(--line);border-radius:18px;padding:20px 22px;background:#fff}
.lpb-sorae .duo b{display:block;font-weight:400;font-size:14px}
.lpb-sorae .duo small{font-size:12px;color:var(--ink2)}
.lpb-sorae .ig{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}
.lpb-sorae .ic{position:relative;border-radius:28px;padding:44px 32px 38px;background:#fff;border:1px solid var(--line);overflow:hidden;transition:transform .6s cubic-bezier(.19,1,.22,1),box-shadow .6s}
.lpb-sorae .ic:hover{transform:translateY(-6px);box-shadow:0 30px 50px -34px rgba(60,80,140,.45)}
.lpb-sorae .ic:before{content:"";position:absolute;width:220px;height:220px;right:-70px;top:-70px;border-radius:50%;background:var(--c);filter:blur(10px);opacity:.75}
.lpb-sorae .ic .en{position:relative;font-size:11px;color:var(--ac)}
.lpb-sorae .ic h3{position:relative;margin:14px 0 0;font-weight:300;font-size:20px;letter-spacing:.14em}
.lpb-sorae .ic p{position:relative;margin:16px 0 0;font-size:12.5px;color:var(--ink2);line-height:2}
@media (min-width:861px){
.lpb-sorae.lpb-js .hzs{height:300vh;padding:0}
.lpb-sorae.lpb-js .hzs .pin{position:sticky;top:0;height:100vh;display:flex;flex-direction:column;justify-content:center;overflow:hidden}
.lpb-sorae.lpb-js .hzs .ig{display:flex;gap:28px;width:max-content;padding:0 max(32px,calc((100vw - 1080px)/2 + 32px));will-change:transform}
.lpb-sorae.lpb-js .hzs .ic{width:min(560px,42vw);min-height:420px;display:flex;flex-direction:column;justify-content:flex-end}
.lpb-sorae.lpb-js .hzs .ic:before{width:420px;height:420px;right:-120px;top:-140px}
.lpb-sorae.lpb-js .hzs .ic h3{font-size:26px}
.lpb-sorae .hzs .prog{width:220px;height:1px;background:var(--line);margin:50px auto 0;position:relative}
.lpb-sorae .hzs .prog i{position:absolute;left:0;top:0;height:1px;width:0;background:var(--ac)}
.lpb-sorae:not(.lpb-js) .hzs .prog{display:none}}
.lpb-sorae .fr{background:var(--ink);color:#fff}
.lpb-sorae .fr .sh .en{color:color-mix(in srgb,var(--ac) 45%,#fff)}.lpb-sorae .fr .sh p{color:#b9c0cf}
.lpb-sorae .fg{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;max-width:860px;margin:0 auto}
.lpb-sorae .fg span{display:grid;place-items:center;aspect-ratio:1;border-radius:50%;border:1px solid rgba(255,255,255,.18);font-size:12.5px;letter-spacing:.1em;text-align:center;padding:8px;line-height:1.6;transition:opacity .9s,transform .9s cubic-bezier(.34,1.56,.64,1),background .4s,border-color .4s}
.lpb-sorae .fg span:hover{background:rgba(185,196,239,.12);border-color:color-mix(in srgb,var(--ac) 45%,#fff)}
.lpb-sorae.lpb-js .fg span{opacity:0;transform:scale(.6) rotate(-20deg)}
.lpb-sorae.lpb-js .fg.on span{opacity:1;transform:none}
.lpb-sorae .qc{margin:80px auto 0;max-width:1000px;display:grid;grid-template-columns:1.35fr 1fr;gap:48px;align-items:center}
.lpb-sorae .qci{border-radius:20px;overflow:hidden;aspect-ratio:4/3;box-shadow:0 40px 80px -40px rgba(0,0,0,.6)}
.lpb-sorae .qci img{width:100%;height:100%;object-fit:cover;transform:scale(1.1);transition:transform 2.4s cubic-bezier(.19,1,.22,1)}
.lpb-sorae .qc.on .qci img,.lpb-sorae:not(.lpb-js) .qci img{transform:scale(1)}
.lpb-sorae .qc .en{font-size:11px;letter-spacing:.3em;color:color-mix(in srgb,var(--ac) 60%,#fff)}
.lpb-sorae .qc b{display:block;margin-top:16px;font-weight:200;font-size:clamp(20px,2.2vw,28px);line-height:1.7;letter-spacing:.1em}
.lpb-sorae .qc p{margin:14px 0 0;font-size:12.5px;color:#b9c0cf;line-height:2}
.lpb-sorae .made{display:grid;grid-template-columns:1fr 1fr;gap:20px;max-width:860px;margin:70px auto 0}
.lpb-sorae .made div{border-top:1px solid rgba(255,255,255,.18);padding-top:24px}
.lpb-sorae .made b{display:block;font:200 46px/1 var(--en)}
.lpb-sorae .made b small{font-size:.35em;margin-left:4px}
.lpb-sorae .made p{margin:12px 0 0;font-size:12.5px;color:#b9c0cf}
.lpb-sorae .hu{display:grid;grid-template-columns:minmax(260px,400px) 1fr;gap:72px;align-items:center}
.lpb-sorae .hw{display:grid;grid-template-columns:1fr;gap:38px}
.lpb-sorae .hw div{position:relative;padding-top:30px;border-top:1px solid var(--ink)}
.lpb-sorae .hw .en{font-size:11px;color:var(--ac)}
.lpb-sorae .hw b{display:block;margin-top:14px;font-weight:400;font-size:16px}
.lpb-sorae .hw p{margin:8px 0 0;font-size:12.5px;color:var(--ink2)}
.lpb-sorae .hph{position:relative;margin:0;border-radius:200px 200px 24px 24px;overflow:hidden;aspect-ratio:3/4;box-shadow:0 40px 80px -40px rgba(80,100,160,.4)}
.lpb-sorae .hph img{width:100%;height:100%;object-fit:cover;transform:scale(1.12);transition:transform 2.4s cubic-bezier(.19,1,.22,1)}
.lpb-sorae .hph.on img,.lpb-sorae:not(.lpb-js) .hph img{transform:scale(1)}
.lpb-sorae .hph figcaption{position:absolute;left:18px;bottom:16px;font-size:10.5px;letter-spacing:.2em;color:#fff;background:rgba(42,50,67,.35);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);border-radius:99px;padding:5px 12px;line-height:1.6}
.lpb-sorae .pr{max-width:640px;margin:0 auto;border-radius:36px;padding:56px;text-align:center;background:linear-gradient(160deg,#fff,#eef3fb);border:1px solid var(--line);position:relative;overflow:hidden}
.lpb-sorae .pr:before{content:"";position:absolute;width:300px;height:300px;left:-100px;bottom:-140px;border-radius:50%;background:var(--lav);filter:blur(30px);opacity:.7}
.lpb-sorae .pr>*{position:relative}
.lpb-sorae .pr .tg{display:inline-block;font-size:11.5px;letter-spacing:.14em;border:1px solid var(--ac);color:var(--ac);border-radius:99px;padding:4px 16px}
.lpb-sorae .pr h3{margin:22px 0 0;font-weight:300;font-size:18px;letter-spacing:.16em}
.lpb-sorae .pr .yen{margin:18px 0 0;font:200 64px/1 var(--en);letter-spacing:.02em}
.lpb-sorae .pr .yen s{font-size:22px;color:var(--sub);margin-right:14px}
.lpb-sorae .pr .yen small{font:300 13px "Noto Sans JP";margin-left:8px;letter-spacing:.1em}
.lpb-sorae .pr ul{list-style:none;margin:30px auto 36px;padding:0;max-width:340px;text-align:left;font-size:12.5px;color:var(--ink2)}
.lpb-sorae .pr li{padding:10px 0;border-bottom:1px solid var(--line)}
.lpb-sorae .pr li:before{content:"—";color:var(--ac);margin-right:12px}
.lpb-sorae .guar{display:flex;align-items:center;gap:20px;max-width:640px;margin:26px auto 0;padding:22px 28px;border-radius:22px;border:1px solid var(--line);background:#fff}
.lpb-sorae .guar>b{font:200 42px/1 var(--en);color:var(--ac)}
.lpb-sorae .guar p{margin:0;font-size:12.5px;color:var(--ink2);line-height:1.8}
.lpb-sorae .guar p strong{display:block;color:var(--ink);font-weight:400;font-size:14px}
.lpb-sorae .fq{max-width:760px;margin:0 auto}
.lpb-sorae .fq details{border-bottom:1px solid var(--line);padding:24px 6px}
.lpb-sorae .fq summary{font-size:14.5px;font-weight:400;display:flex;align-items:center;gap:16px}
.lpb-sorae .fq summary:after{content:"";margin-left:auto;flex:none;width:12px;height:12px;border-right:1px solid var(--ink);border-bottom:1px solid var(--ink);transform:rotate(45deg) translate(-3px,-3px);transition:transform .4s}
.lpb-sorae .fq details[open] summary:after{transform:rotate(-135deg)}
.lpb-sorae .fq p{margin:14px 0 0;font-size:13px;color:var(--ink2)}
.lpb-sorae .end{position:relative;overflow:hidden;text-align:center;padding:180px 0}
.lpb-sorae .end .w{position:relative;z-index:1}
.lpb-sorae .end h2{position:relative;margin:20px 0 0;font-weight:200;font-size:clamp(28px,3.8vw,46px);line-height:1.7;letter-spacing:.2em}
.lpb-sorae .end p{position:relative;color:var(--ink2);font-size:13px;margin:22px 0 44px}
.lpb-sorae .ft{padding:44px 16px calc(44px + env(safe-area-inset-bottom,0px));text-align:center;font-size:11px;color:var(--sub);line-height:2}
.lpb-sorae .ft .logo{font-size:16px;color:var(--ink);margin-bottom:6px}
.lpb-sorae .fb{position:fixed;left:50%;bottom:calc(16px + env(safe-area-inset-bottom,0px));transform:translate(-50%,140px);transition:transform .6s cubic-bezier(.19,1,.22,1);z-index:40}
.lpb-sorae .fb.on{transform:translate(-50%,0)}
.lpb-sorae .fb .btn{white-space:nowrap;box-shadow:0 18px 40px -16px rgba(42,50,67,.6)}
.lpb-sorae .rv{transition:opacity 1.3s cubic-bezier(.19,1,.22,1),transform 1.3s cubic-bezier(.19,1,.22,1)}
.lpb-sorae.lpb-js .rv{opacity:0;transform:translateY(34px)}
.lpb-sorae.lpb-js .rv.on{opacity:1;transform:none}
.lpb-sorae .sh h2,.lpb-sorae .cr h2{transition:clip-path 1.4s cubic-bezier(.19,1,.22,1),transform 1.4s cubic-bezier(.19,1,.22,1)}
.lpb-sorae.lpb-js .sh h2,.lpb-sorae.lpb-js .cr h2{clip-path:inset(0 0 100% 0);transform:translateY(20px)}
.lpb-sorae.lpb-js .rv.on h2,.lpb-sorae.lpb-js .rv.on .sh h2{clip-path:inset(0 0 0 0);transform:none}
@media (prefers-reduced-motion:reduce){.lpb-sorae *{animation:none!important}.lpb-sorae.lpb-js .rv,.lpb-sorae.lpb-js .ch,.lpb-sorae.lpb-js .hero .lead,.lpb-sorae.lpb-js .hero .cta,.lpb-sorae.lpb-js .bwrap .btl,.lpb-sorae.lpb-js .fg span{opacity:1!important;transform:none!important;filter:none!important;transition:none!important}.lpb-sorae.lpb-js h2{clip-path:none!important;transform:none!important}}
@media (max-width:860px){
.lpb-sorae .hero h1{font-size:clamp(26px,7.9vw,34px);letter-spacing:.08em}
.lpb-sorae .w{padding:0 24px}.lpb-sorae .hd .w{padding:0 24px}.lpb-sorae .hd .btn{display:none}
.lpb-sorae .hero .w{grid-template-columns:1fr;text-align:center;padding-top:100px;padding-bottom:70px}
.lpb-sorae .hero .lead{margin-left:auto;margin-right:auto}.lpb-sorae .hero .cta{justify-content:center}
.lpb-sorae .bwrap{order:-1;margin-bottom:10px}.lpb-sorae .bwrap .btl{height:min(52vh,380px);width:auto}
.lpb-sorae .tags span{font-size:10px;padding:5px 11px}.lpb-sorae .tags span:nth-child(1){left:2%}.lpb-sorae .tags span:nth-child(2){right:2%}
.lpb-sorae .ripple{right:50%;top:30%;width:340px;height:340px;margin:-170px -170px 0 0}
.lpb-sorae section{padding:110px 0}.lpb-sorae .sh{margin-bottom:50px}
.lpb-sorae .fy{grid-template-columns:1fr}.lpb-sorae .fy div{padding:34px 20px}
.lpb-sorae .cr .w{grid-template-columns:1fr;gap:40px}.lpb-sorae .ring{max-width:280px}.lpb-sorae .ring .c b{font-size:66px}
.lpb-sorae .ig{grid-template-columns:1fr;gap:14px}.lpb-sorae .ic{padding:34px 26px}
.lpb-sorae .fg{gap:6px}.lpb-sorae .fg span{font-size:10px;letter-spacing:.04em}
.lpb-sorae .qc{grid-template-columns:1fr;gap:26px;margin-top:56px}.lpb-sorae .qc figcaption{text-align:center}
.lpb-sorae .made{grid-template-columns:1fr;gap:26px;margin-top:50px}
.lpb-sorae .hu{grid-template-columns:1fr;gap:40px}.lpb-sorae .hph{max-width:340px;width:100%;margin:0 auto}
.lpb-sorae .pr{padding:44px 24px;border-radius:28px}.lpb-sorae .pr .yen{font-size:52px}
.lpb-sorae .guar{flex-direction:column;text-align:center;gap:8px}
.lpb-sorae .sbg img{left:0;right:auto;top:-4%;width:100%;height:108%;object-fit:cover;object-position:50% 58%;-webkit-mask-image:none;mask-image:none}}`,
  render: ({ f, img, link, when, v }) => {
    const mq = split(v("marquee"));
    const mqHtml = [...mq, ...mq].map((w) => `<span>${w}</span><span>✦</span>`).join("");
    const free = split(v("freeList")).slice(0, 8);
    const pct = Math.max(0, Math.min(100, Number(v("ringNum").replace(/[^\d.]/g, "")) || 0));
    return `
<header class="hd"><div class="w">${f("brand", "span", "logo")}${link("ctaLabel", "ctaUrl", "btn")}</div></header>
<section class="hero" style="padding:0">
 <div class="aura" aria-hidden="true"><i></i><i></i><i></i></div>
 <div class="ripple" aria-hidden="true"><span></span><span></span><span></span></div>
 <div class="bubs" aria-hidden="true"></div>
 <div class="w">
  <div>
   ${f("kick", "p", "kick en")}
   ${f("heroCopy", "h1")}
   ${f("lead", "p", "lead")}
   <div class="cta">${link("ctaLabel", "ctaUrl", "btn")}${when(["ctaNote"], f("ctaNote", "small"))}</div>
  </div>
  <div class="bwrap">
   <div class="tags">${f("tag1")}${f("tag2")}${f("tag3")}</div>
   ${img("bottle", "btl")}
  </div>
 </div>
</section>
${mq.length ? `<div class="mq" aria-hidden="true"><div>${mqHtml}</div></div>` : ""}
<section class="stm"><div class="sbg" aria-hidden="true">${img("face")}</div><div class="w">${f("statement", "p", "stm-t")}</div></section>
<section style="padding-top:40px"><div class="w">
 <div class="sh rv"><span class="en">FOR YOU</span>${f("forTitle", "h2")}</div>
 <div class="fy rv">
  <div><span class="n">01</span>${f("for1T", "b")}${f("for1B", "p")}</div>
  <div><span class="n">02</span>${f("for2T", "b")}${f("for2B", "p")}</div>
  <div><span class="n">03</span>${f("for3T", "b")}${f("for3B", "p")}</div>
 </div>
</div></section>
<section class="cr"><div class="w">
 <div class="ring rv" data-pct="${pct}">
  <svg viewBox="0 0 200 200" aria-hidden="true"><circle cx="100" cy="100" r="88" fill="none" stroke="#e4e8f1" stroke-width="1"/><circle class="arc" cx="100" cy="100" r="88" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="553" stroke-dashoffset="${(553 * (1 - pct / 100)).toFixed(1)}" transform="rotate(-90 100 100)"/></svg>
  <div class="c"><div><b><span class="cnt">${f("ringNum")}</span><small>${f("ringUnit")}</small></b>${f("ringCap", "span", "cap")}</div></div>
 </div>
 <div class="rv">
  ${f("keyLabel", "span", "en")}
  ${f("keyTitle", "h2")}
  ${f("keyBody", "p")}
  <div class="duo"><div>${f("duo1T", "b")}${f("duo1B", "small")}</div><div>${f("duo2T", "b")}${f("duo2B", "small")}</div></div>
 </div>
</div></section>
<section class="hzs"><div class="pin"><div class="w">
 <div class="sh rv"><span class="en">INGREDIENTS</span>${f("igTitle", "h2")}</div></div>
 <div class="ig">
  <div class="ic rv" style="--c:var(--mint)">${f("ig1E", "span", "en")}${f("ig1T", "h3")}${f("ig1B", "p")}</div>
  <div class="ic rv" style="--c:var(--sky)">${f("ig2E", "span", "en")}${f("ig2T", "h3")}${f("ig2B", "p")}</div>
  <div class="ic rv" style="--c:var(--lav)">${f("ig3E", "span", "en")}${f("ig3T", "h3")}${f("ig3B", "p")}</div>
 </div>
 <div class="prog"><i></i></div>
</div></section>
<section class="fr"><div class="w">
 <div class="sh rv">${f("freeLabel", "span", "en")}${f("freeTitle", "h2")}${f("freeSub", "p")}</div>
 ${free.length ? `<div class="fg">${free.map((x) => `<span>${x}</span>`).join("")}</div>` : ""}
 <figure class="qc rv"><div class="qci">${img("qc")}</div><figcaption><span class="en">QUALITY CHECK</span>${f("qcTitle", "b")}${f("qcBody", "p")}</figcaption></figure>
 <div class="made rv"><div><b>${f("made1N")}</b>${f("made1B", "p")}</div><div><b>${f("made2N")}<small>${f("made2U")}</small></b>${f("made2B", "p")}</div></div>
</div></section>
<section><div class="w">
 <div class="sh rv"><span class="en">HOW TO USE</span>${f("howTitle", "h2")}</div>
 <div class="hu">
  <figure class="hph rv">${img("use")}${when(["howCap"], f("howCap", "figcaption", "en"))}</figure>
  <div class="hw">
   <div class="rv"><span class="en">STEP 01</span>${f("how1T", "b")}${f("how1B", "p")}</div>
   <div class="rv"><span class="en">STEP 02</span>${f("how2T", "b")}${f("how2B", "p")}</div>
   <div class="rv"><span class="en">STEP 03</span>${f("how3T", "b")}${f("how3B", "p")}</div>
  </div>
 </div>
</div></section>
<section id="price" style="padding-top:40px"><div class="w">
 <div class="sh rv"><span class="en">PRICE</span>${f("priceTitle", "h2")}</div>
 <div class="pr rv">${when(["priceTag"], f("priceTag", "span", "tg"))}${f("priceName", "h3")}<div class="yen">${when(["priceOld"], f("priceOld", "s"))}${f("price")}<small>${f("priceUnit")}</small></div>
  ${when(["pt1", "pt2", "pt3"], `<ul>${when(["pt1"], f("pt1", "li"))}${when(["pt2"], f("pt2", "li"))}${when(["pt3"], f("pt3", "li"))}</ul>`)}
  ${link("ctaLabel", "ctaUrl", "btn")}</div>
 ${when(["guarT"], `<div class="guar rv">${f("guarN", "b")}<p>${f("guarT", "strong")}${f("guarB")}</p></div>`)}
</div></section>
${when(["faq1Q", "faq2Q", "faq3Q"], `<section style="padding-top:0"><div class="w">
 <div class="sh rv"><span class="en">FAQ</span><h2>よくあるご質問</h2></div>
 <div class="fq rv">
  ${when(["faq1Q"], `<details><summary>${f("faq1Q")}</summary>${f("faq1A", "p")}</details>`)}
  ${when(["faq2Q"], `<details><summary>${f("faq2Q")}</summary>${f("faq2A", "p")}</details>`)}
  ${when(["faq3Q"], `<details><summary>${f("faq3Q")}</summary>${f("faq3A", "p")}</details>`)}
 </div>
</div></section>`)}
<section class="end"><div class="aura" aria-hidden="true"><i></i><i></i></div><div class="w rv">
 ${f("brand", "span", "en")}
 ${f("endTitle", "h2")}
 ${f("endSub", "p")}
 ${link("ctaLabel", "ctaUrl", "btn")}
</div></section>
<footer class="ft">${f("brand", "div", "logo en")}${when(["note"], f("note", "p"))}</footer>
<div class="fb">${link("floatLabel", "ctaUrl", "btn")}</div>`;
  },
  js: `var Q=function(s){return root.querySelector(s)},QA=function(s){return [].slice.call(root.querySelectorAll(s))},es=function(s){return s.replace(/&/g,"&amp;").replace(/</g,"&lt;")};
watch(".fg,.hph,.qc,.ring");
if(!EDIT){
 var h1=Q(".hero h1");if(h1){h1.innerHTML=h1.innerHTML.split(/<br\\s*\\/?>/i).map(function(l,li){var d=document.createElement("div");d.innerHTML=l;return '<span class="ln"><b>'+d.textContent.split("").map(function(c,i){return '<span class="ch" style="transition-delay:'+(.35+li*.25+i*.045).toFixed(2)+'s">'+es(c)+'</span>'}).join("")+'</b></span>'}).join("")}
 var bb=Q(".bubs");if(bb&&!RED)for(var i=0;i<14;i++){var e=document.createElement("i");e.className="bub";var sz=6+Math.random()*26;e.style.cssText="width:"+sz+"px;height:"+sz+"px;left:"+(Math.random()*100)+"%;animation-duration:"+(10+Math.random()*14)+"s;animation-delay:-"+(Math.random()*20)+"s;--x:"+(Math.random()*80-40)+"px;opacity:.8";bb.appendChild(e)}
 var st=Q(".stm-t"),wds=[];if(st){st.innerHTML=st.innerHTML.replace(/<br\\s*\\/?>/gi," ").split(/\\s+/).filter(Boolean).map(function(w){var ac=/<em>/.test(w);var d=document.createElement("div");d.innerHTML=w;return '<span class="wd'+(ac?" ac":"")+'">'+es(d.textContent)+'</span>'}).join("");wds=[].slice.call(st.querySelectorAll(".wd"))}
 QA(".fg span").forEach(function(el,i){el.style.transitionDelay=(i*.08)+"s"});
 var ring=Q(".ring"),arc=Q(".ring .arc"),cnt=Q(".ring .cnt"),pct=ring?Number(ring.dataset.pct):0,goal=cnt?cnt.textContent:"";
 if(ring&&arc&&cnt&&/^\\d+$/.test(goal)){var n=Number(goal);arc.style.strokeDashoffset=553;cnt.textContent="0";var ro=new IntersectionObserver(function(x){if(!x[0].isIntersecting)return;ro.disconnect();arc.style.strokeDashoffset=553*(1-pct/100);var s0=null;(function f(t){if(!s0)s0=t;var p=Math.min(1,(t-s0)/2000);cnt.textContent=Math.round(n*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(f)})(performance.now())});ro.observe(ring)}
 var bw=Q(".bwrap"),tg=Q(".tags"),hz=Q(".hzs"),igt=Q(".hzs .ig"),igp=Q(".hzs .prog i"),fb=Q(".fb"),pr=Q("#price"),en=Q(".end"),mq=matchMedia("(max-width:860px)");
 function sc(){var vh=innerHeight,rt=root.getBoundingClientRect(),y=-rt.top;
  if(bw&&!RED)bw.style.translate="0 "+(Math.max(0,y)*.18)+"px";
  if(st){var r=st.getBoundingClientRect(),p=Math.min(1,Math.max(0,(vh*.85-r.top)/(r.height+vh*.3)));var k=Math.floor(p*wds.length);wds.forEach(function(w,i){w.classList.toggle("on",i<k)})}
  if(hz&&igt){if(!mq.matches){var hr=hz.getBoundingClientRect(),tot=hz.offsetHeight-vh,q=Math.min(1,Math.max(0,-hr.top/tot)),mx=igt.scrollWidth-innerWidth;igt.style.transform="translate3d("+(-q*Math.max(0,mx))+"px,0,0)";if(igp)igp.style.width=(q*100)+"%"}else igt.style.transform=""}
  if(fb&&pr&&en){var a=pr.getBoundingClientRect(),b=en.getBoundingClientRect();fb.classList.toggle("on",y>vh*.8&&rt.bottom>vh&&!(a.top<vh&&a.bottom>0)&&!(b.top<vh))}}
 addEventListener("scroll",function(){requestAnimationFrame(sc)},{passive:true});addEventListener("resize",sc);sc();
 if(matchMedia("(hover:hover)").matches&&!RED)addEventListener("mousemove",function(e){var ox=e.clientX/innerWidth-.5,oy=e.clientY/innerHeight-.5;if(bw)bw.style.transform="translate("+(ox*-24)+"px,"+(oy*-18)+"px)";if(tg)tg.style.transform="translate("+(ox*30)+"px,"+(oy*24)+"px)"});
}else{QA(".stm .wd").forEach(function(w){w.classList.add("on")})}`,
};
