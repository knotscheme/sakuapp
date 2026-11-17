import type { Template } from "../types";

// ABYSSIA：世界観・体験向け。元のLP（works/lp-aqua）のデザインと動き（光の粒・泡・魚の群れ・深さの表示）をそのまま型にしたもの
// 画面に固定する背景は、ほかのサイトに貼っても崩れないよう「LPの中だけで固定」にしてある
const split = (s: string) => s.split(/[、,，\n]+/).map((x) => x.trim()).filter(Boolean);

export const abyssia: Template = {
  id: "abyssia",
  name: "ABYSSIA",
  kind: "世界観・体験・イベント",
  desc: "深い青の中を、光の粒と魚の群れが泳ぐ。ゾーンを巡るように読み進め、最後にチケットへ導く型です。",
  best: "展示・イベント・ナイトスポット・ホテル・カフェ／バー・音楽など",
  fonts: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Noto+Sans+JP:wght@200;300;400&family=Inter:wght@200;300;400&display=swap",
  colors: [
    { id: "c1", label: "光の色", value: "#5ee7ff" },
    { id: "c2", label: "光の色2", value: "#8b7bff" },
    { id: "c3", label: "光の色3", value: "#c08bff" },
    { id: "sea", label: "上の海の色", value: "#071a33" },
    { id: "bg", label: "深い背景", value: "#02040a" },
  ],
  slots: [
    { id: "hero", label: "メイン（縦長・主役のモチーフ）", ratio: [2, 3], min: 500, max: 1000, where: "ファーストビューの中央で光る写真", prompt: "真っ暗な背景の中央で、{product}を象徴するモチーフ（例：クラゲ）が青く発光している縦長の写真。周りは完全な闇、細部まで美しく神秘的。文字は入れない。縦長2:3。", tips: "周りが真っ黒な写真を選ぶと、まわりが溶けこんで浮かび上がります。" },
    { id: "z1", label: "ゾーン1（横長）", ratio: [16, 9], min: 1000, max: 1600, where: "1つ目のゾーンの写真", prompt: "{product}の空間を奥へ続くように見せる写真。左右に光る水槽が並ぶ暗い回廊、深い青、人は小さなシルエット。文字は入れない。横長16:9。", tips: "通路など、奥へ続く線がある場所を真ん中から撮ると引き込まれます。" },
    { id: "z2", label: "ゾーン2（縦長）", ratio: [5, 7], min: 500, max: 1000, where: "2つ目のゾーンの写真", prompt: "深い闇の中で自ら光る生き物・モチーフのクローズアップ。青い光の粒が漂う。文字は入れない。縦長。", tips: "主役を1つだけ、暗い背景で。" },
    { id: "z3", label: "ゾーン3（横長）", ratio: [16, 9], min: 1000, max: 1600, where: "3つ目のゾーンの写真", prompt: "大きな円形の水槽を、人々のシルエットが見上げている写真。魚の群れが渦を巻く、深い青の光。文字は入れない。横長16:9。", tips: "人を小さく入れると、空間の大きさが伝わります。" },
    { id: "full", label: "全面の写真（横長）", ratio: [16, 9], min: 1400, max: 1920, where: "画面いっぱいに広がる写真", prompt: "床と壁いっぱいに光の海が映し出された暗い空間に、1人が立っている写真。青と水色の光の波、幻想的。文字は入れない。横長16:9。", tips: "画面いっぱいに使うので、大きくてきれいな写真を。下の方に文字が重なります。" },
    { id: "bar", label: "夜の楽しみ（横長）", ratio: [16, 10], min: 800, max: 1400, where: "夜の楽しみ方の写真", prompt: "大きな水槽の前のバーカウンターで、人が静かにお酒を楽しんでいる夜の写真。青い光、上質で落ち着いた雰囲気。文字は入れない。横長。", tips: "楽しんでいる場面（飲む・見る・くつろぐ）が伝わる写真を。" },
    { id: "cocktail", label: "小さな写真（正方形）", ratio: [1, 1], min: 400, max: 800, where: "夜の写真に重なる小さな写真（無くてもOK）", optional: true, prompt: "青紫に光るカクテルのクローズアップ。暗い背景、グラスの縁に光、上質。文字は入れない。正方形。", tips: "名物のメニューや小物のアップがおすすめです。" },
    { id: "pair", label: "ふたり（縦長）", ratio: [5, 7], min: 500, max: 1000, where: "「ふたりで」の写真", prompt: "{target}の2人が、光る大きな景色を後ろ姿で見上げている縦長の写真。シルエット、静かな感動。顔は写さない。文字は入れない。", tips: "人は後ろ姿・シルエットにすると、見る人が自分を重ねやすくなります。" },
    { id: "place", label: "場所・建物（横長）", ratio: [16, 9], min: 800, max: 1400, where: "アクセスの写真", prompt: "夜の水辺に浮かぶ、青く光るガラス張りの建物の外観。水面に光が映る。文字は入れない。横長16:9。", tips: "夜に外から撮った建物や入口の写真が合います。" },
    { id: "end", label: "最後の背景（横長）", ratio: [16, 9], min: 1000, max: 1920, where: "最後の画面の背景", prompt: "水中から水面を見上げた写真。差し込む光の筋、深い青、泡。文字は入れない。横長16:9。", tips: "暗くて、上の方が少し明るい写真が合います。" },
  ],
  fields: [
    { id: "brand", label: "名前（英字がおすすめ）", group: "ファーストビュー", max: 12, hint: "大きく1文字ずつ浮かぶ名前（英字7文字前後）" },
    { id: "kick", label: "名前の上の小さな英字", group: "ファーストビュー", max: 24 },
    { id: "heroSub", label: "キャッチコピー", group: "ファーストビュー", max: 24 },
    { id: "scroll", label: "下の小さな文字", group: "ファーストビュー", max: 20 },
    { id: "statement", label: "メッセージ（言葉ごとに空白）", group: "メッセージ", multiline: true, max: 60, hint: "光の粒が集まるように現れる文章。言葉の間に空白、色を変える言葉は＊で囲む" },
    { id: "marquee", label: "流れる文字（、で区切る）", group: "メッセージ", max: 80, hint: "ゾーン名などの英語を、、で区切って4つほど" },
    { id: "z1No", label: "ゾーン1の番号", group: "ゾーン1", max: 10 },
    { id: "z1En", label: "ゾーン1の英語名", group: "ゾーン1", max: 24 },
    { id: "z1T", label: "ゾーン1の見出し", group: "ゾーン1", multiline: true, max: 24, hint: "2行。色を変える言葉は＊で囲む" },
    { id: "z1B", label: "ゾーン1の説明", group: "ゾーン1", multiline: true, max: 60 },
    { id: "z1m1", label: "数字1の項目", group: "ゾーン1", max: 10, optional: true },
    { id: "z1v1", label: "数字1", group: "ゾーン1", max: 10, optional: true },
    { id: "z1m2", label: "数字2の項目", group: "ゾーン1", max: 10, optional: true },
    { id: "z1v2", label: "数字2", group: "ゾーン1", max: 10, optional: true },
    { id: "z2No", label: "ゾーン2の番号", group: "ゾーン2", max: 10 },
    { id: "z2En", label: "ゾーン2の英語名", group: "ゾーン2", max: 24 },
    { id: "z2T", label: "ゾーン2の見出し", group: "ゾーン2", multiline: true, max: 24 },
    { id: "z2B", label: "ゾーン2の説明", group: "ゾーン2", multiline: true, max: 60 },
    { id: "z2m1", label: "数字1の項目", group: "ゾーン2", max: 10, optional: true },
    { id: "z2v1", label: "数字1", group: "ゾーン2", max: 10, optional: true },
    { id: "z2m2", label: "数字2の項目", group: "ゾーン2", max: 10, optional: true },
    { id: "z2v2", label: "数字2", group: "ゾーン2", max: 10, optional: true },
    { id: "z3No", label: "ゾーン3の番号", group: "ゾーン3", max: 10 },
    { id: "z3En", label: "ゾーン3の英語名", group: "ゾーン3", max: 24 },
    { id: "z3T", label: "ゾーン3の見出し", group: "ゾーン3", multiline: true, max: 24 },
    { id: "z3B", label: "ゾーン3の説明", group: "ゾーン3", multiline: true, max: 60 },
    { id: "z3m1", label: "数字1の項目", group: "ゾーン3", max: 10, optional: true },
    { id: "z3v1", label: "数字1", group: "ゾーン3", max: 10, optional: true },
    { id: "z3m2", label: "数字2の項目", group: "ゾーン3", max: 10, optional: true },
    { id: "z3v2", label: "数字2", group: "ゾーン3", max: 10, optional: true },
    { id: "fullNo", label: "全面写真の番号", group: "全面の写真", max: 10 },
    { id: "fullEn", label: "全面写真の英語名", group: "全面の写真", max: 24 },
    { id: "fullT", label: "全面写真の言葉", group: "全面の写真", multiline: true, max: 24 },
    { id: "nightNo", label: "夜の小見出し", group: "夜の楽しみ", max: 14 },
    { id: "nightEn", label: "夜の英語名", group: "夜の楽しみ", max: 24 },
    { id: "nightT", label: "夜の見出し", group: "夜の楽しみ", multiline: true, max: 24 },
    { id: "nightB", label: "夜の説明", group: "夜の楽しみ", multiline: true, max: 70 },
    { id: "t1L", label: "時間1の項目", group: "夜の楽しみ", max: 20, optional: true },
    { id: "t1V", label: "時間1", group: "夜の楽しみ", max: 24, optional: true },
    { id: "t2L", label: "時間2の項目", group: "夜の楽しみ", max: 20, optional: true },
    { id: "t2V", label: "時間2", group: "夜の楽しみ", max: 24, optional: true },
    { id: "t3L", label: "時間3の項目", group: "夜の楽しみ", max: 20, optional: true },
    { id: "t3V", label: "時間3", group: "夜の楽しみ", max: 24, optional: true },
    { id: "ckCap", label: "小さな写真の説明", group: "夜の楽しみ", max: 30, optional: true, hint: "＊で囲んだところが斜体の色文字になる" },
    { id: "pairNo", label: "ふたりの小見出し", group: "ふたりで", max: 14 },
    { id: "pairEn", label: "ふたりの英語名", group: "ふたりで", max: 24 },
    { id: "pairT", label: "ふたりの見出し", group: "ふたりで", multiline: true, max: 24 },
    { id: "pairB", label: "ふたりの説明", group: "ふたりで", multiline: true, max: 60 },
    { id: "tkTitle", label: "チケットの見出し", group: "チケット", max: 20 },
    { id: "tk1E", label: "チケット1の英字", group: "チケット", max: 10 },
    { id: "tk1N", label: "チケット1の名前", group: "チケット", max: 16 },
    { id: "tk1P", label: "チケット1の価格", group: "チケット", max: 10 },
    { id: "tk1U", label: "チケット1の単位", group: "チケット", max: 8 },
    { id: "tk1B", label: "チケット1の説明", group: "チケット", multiline: true, max: 40 },
    { id: "tk2E", label: "チケット2の英字（目立つ）", group: "チケット", max: 10 },
    { id: "tk2N", label: "チケット2の名前", group: "チケット", max: 16 },
    { id: "tk2P", label: "チケット2の価格", group: "チケット", max: 10 },
    { id: "tk2U", label: "チケット2の単位", group: "チケット", max: 8 },
    { id: "tk2B", label: "チケット2の説明", group: "チケット", multiline: true, max: 40 },
    { id: "tk3E", label: "チケット3の英字", group: "チケット", max: 10 },
    { id: "tk3N", label: "チケット3の名前", group: "チケット", max: 16 },
    { id: "tk3P", label: "チケット3の価格", group: "チケット", max: 10 },
    { id: "tk3U", label: "チケット3の単位", group: "チケット", max: 8 },
    { id: "tk3B", label: "チケット3の説明", group: "チケット", multiline: true, max: 40 },
    { id: "tkNote", label: "チケットの注意書き", group: "チケット", max: 60, optional: true },
    { id: "acT", label: "アクセスの見出し", group: "アクセス", multiline: true, max: 24 },
    { id: "ac1L", label: "項目1", group: "アクセス", max: 10 },
    { id: "ac1V", label: "内容1", group: "アクセス", max: 40 },
    { id: "ac2L", label: "項目2", group: "アクセス", max: 10 },
    { id: "ac2V", label: "内容2", group: "アクセス", max: 40 },
    { id: "ac3L", label: "項目3", group: "アクセス", max: 10, optional: true },
    { id: "ac3V", label: "内容3", group: "アクセス", max: 40, optional: true },
    { id: "endLabel", label: "最後の小さな英字", group: "最後", max: 12 },
    { id: "endTitle", label: "最後の言葉（英語がおすすめ）", group: "最後", max: 30 },
    { id: "ctaLabel", label: "ボタンの文字", group: "最後", max: 16 },
    { id: "ctaUrl", label: "ボタンのリンク先", group: "最後", url: true },
    { id: "note", label: "いちばん下の文字", group: "最後", multiline: true, max: 80, optional: true },
  ],
  css: `.lpb-abyssia{--ink:#e8f1ff;--ink2:#9fb0cc;--sub:#5d6b85;--ln:rgba(140,180,255,.14);--serif:"Cormorant Garamond",serif;--sans:Inter,"Noto Sans JP",sans-serif;color:var(--ink);font:300 14px/1.9 var(--sans);letter-spacing:.06em;background:var(--bg)}
.lpb-abyssia .fxl{position:sticky;top:0;height:100vh;height:100svh;margin-bottom:-100vh;margin-bottom:-100svh;z-index:0;pointer-events:none;background:linear-gradient(180deg,var(--sea) 0%,color-mix(in srgb,var(--sea) 40%,var(--bg)) 40%,var(--bg) 100%)}
.lpb-abyssia .fxl canvas{position:absolute;inset:0;width:100%;height:100%}
.lpb-abyssia .mn{position:relative;z-index:2}
.lpb-abyssia .w{max-width:1160px;margin:0 auto;padding:0 32px}
.lpb-abyssia .hd{position:absolute;top:0;left:0;right:0;z-index:20;display:flex;align-items:center;justify-content:space-between;padding:22px 32px}
.lpb-abyssia .hd.fx{position:fixed}
.lpb-abyssia .logo{font:300 18px var(--serif);letter-spacing:.5em}
.lpb-abyssia .hd nav{display:flex;gap:28px;font-size:11px;letter-spacing:.24em;color:var(--ink2)}
.lpb-abyssia .hd nav a:hover{color:var(--ink)}
.lpb-abyssia .depth{position:absolute;right:28px;top:50%;transform:translateY(-50%);display:flex;flex-direction:column;align-items:center;gap:10px;font:300 10px var(--sans);letter-spacing:.2em;color:var(--sub)}
.lpb-abyssia .depth .bar{width:1px;height:160px;background:var(--ln);position:relative}
.lpb-abyssia .depth .bar i{position:absolute;left:-2px;top:0;width:5px;height:5px;border-radius:50%;background:var(--c1);box-shadow:0 0 10px var(--c1)}
.lpb-abyssia .depth b{font:300 22px var(--serif);color:var(--ink);letter-spacing:.06em;font-variant-numeric:tabular-nums}
.lpb-abyssia:not(.lpb-js) .depth{display:none}
.lpb-abyssia .hero{position:relative;min-height:100svh;display:flex;align-items:center;justify-content:center;text-align:center;overflow:hidden}
.lpb-abyssia .hero .jf{position:absolute;left:50%;top:50%;height:min(92vh,880px);aspect-ratio:2/3;transform:translate(-50%,-50%);transition:opacity 3s 1s;-webkit-mask-image:radial-gradient(closest-side,#000 55%,transparent);mask-image:radial-gradient(closest-side,#000 55%,transparent);opacity:.85}
.lpb-abyssia.lpb-js .hero .jf{opacity:0}.lpb-abyssia.lpb-js.on .hero .jf{opacity:.85}
.lpb-abyssia .hero .jf img{width:100%;height:100%;object-fit:cover;animation:aJf 9s ease-in-out infinite}
@keyframes aJf{50%{transform:translateY(-3%) scale(1.02)}}
.lpb-abyssia .hero .tx{position:relative;z-index:2;padding:0 16px}
.lpb-abyssia .hero .k{font-size:11px;letter-spacing:.6em;color:var(--c1);transition:opacity 2s 2s}
.lpb-abyssia .hero h1{margin:26px 0 0;font:300 clamp(54px,11vw,150px)/1 var(--serif);letter-spacing:.32em;padding-left:.32em;word-break:keep-all}
.lpb-abyssia .hero h1 .lt{display:inline-block;transition:opacity 2.2s,filter 2.2s,transform 2.2s cubic-bezier(.19,1,.22,1)}
.lpb-abyssia.lpb-js .hero h1 .lt{opacity:0;filter:blur(16px);transform:translateY(20px)}
.lpb-abyssia .hero .sub{margin:30px 0 0;font:200 clamp(15px,1.6vw,19px) var(--sans);letter-spacing:.4em;transition:opacity 2s 3s}
.lpb-abyssia .scr{position:absolute;left:50%;bottom:34px;transform:translateX(-50%);font-size:10px;letter-spacing:.4em;color:var(--sub);transition:opacity 2s 3.6s;display:flex;flex-direction:column;align-items:center;gap:12px;white-space:nowrap}
.lpb-abyssia .scr i{width:1px;height:50px;background:linear-gradient(var(--c1),transparent);animation:aDr 2.4s ease-in-out infinite;transform-origin:top}
@keyframes aDr{0%{transform:scaleY(0)}50%{transform:scaleY(1)}100%{transform:scaleY(1);opacity:0}}
.lpb-abyssia.lpb-js .hero .k,.lpb-abyssia.lpb-js .hero .sub,.lpb-abyssia.lpb-js .scr{opacity:0}
.lpb-abyssia.lpb-js.on .hero h1 .lt,.lpb-abyssia.lpb-js.on .hero .k,.lpb-abyssia.lpb-js.on .hero .sub,.lpb-abyssia.lpb-js.on .scr{opacity:1;filter:none;transform:none}
.lpb-abyssia.lpb-js.on .scr{transform:translateX(-50%)}
.lpb-abyssia section{position:relative;padding:160px 0;overflow-x:clip}
.lpb-abyssia .lbl{font-size:10.5px;letter-spacing:.5em;color:var(--c1);margin:0}
.lpb-abyssia .lbl b{font-weight:300;color:var(--sub);margin-right:14px}
.lpb-abyssia h2{margin:22px 0 0;font:200 clamp(28px,3.6vw,46px)/1.65 var(--sans);letter-spacing:.16em}
.lpb-abyssia h2 em{font:italic 300 1.1em var(--serif);color:var(--c1);letter-spacing:.04em}
.lpb-abyssia .lead{margin:28px 0 0;color:var(--ink2);max-width:30em;font-size:14px;line-height:2.2}
.lpb-abyssia .rv{transition:opacity 1.6s,transform 1.6s cubic-bezier(.19,1,.22,1),filter 1.6s}
.lpb-abyssia.lpb-js .rv{opacity:0;transform:translateY(40px);filter:blur(8px)}
.lpb-abyssia.lpb-js .rv.on{opacity:1;transform:none;filter:none}
.lpb-abyssia .intro{text-align:center}
.lpb-abyssia .intro .big{margin:0 auto;max-width:16em;font:200 clamp(24px,3.2vw,40px)/2 var(--sans);letter-spacing:.2em}
.lpb-abyssia .intro .big em{color:var(--c1)}
.lpb-abyssia .intro .wd{display:inline-block;white-space:nowrap}
.lpb-abyssia .intro .c{display:inline-block;opacity:0;filter:blur(10px);transform:translate(var(--dx),var(--dy)) scale(.4);transition:opacity 2.2s ease,filter 2.2s ease,transform 2.6s cubic-bezier(.16,1,.3,1);transition-delay:var(--d)}
.lpb-abyssia .intro.on .c{opacity:1;filter:none;transform:none;animation:aGl 2.8s ease-out both;animation-delay:var(--d)}
@keyframes aGl{0%{color:var(--c1);text-shadow:0 0 18px var(--c1),0 0 40px color-mix(in srgb,var(--c1) 60%,transparent)}60%{text-shadow:0 0 12px color-mix(in srgb,var(--c1) 50%,transparent)}100%{color:inherit;text-shadow:none}}
.lpb-abyssia .intro .ac .c{color:var(--c1)}
.lpb-abyssia .intro.on .ac .c{animation-name:aGla}
@keyframes aGla{0%{text-shadow:0 0 18px var(--c1),0 0 40px color-mix(in srgb,var(--c1) 60%,transparent)}100%{text-shadow:0 0 22px color-mix(in srgb,var(--c1) 45%,transparent)}}
.lpb-abyssia .zones{display:grid;gap:180px}
.lpb-abyssia .zone{display:grid;grid-template-columns:1.25fr 1fr;gap:80px;align-items:center}
.lpb-abyssia .zone.rev{grid-template-columns:1fr 1.25fr}
.lpb-abyssia .zone.rev .ph{order:2;max-width:440px;justify-self:end;width:100%}
.lpb-abyssia .ph{position:relative;margin:0;border-radius:4px;overflow:hidden;transition:clip-path 1.8s cubic-bezier(.77,0,.18,1)}
.lpb-abyssia.lpb-js .ph{clip-path:inset(12% 12% 12% 12% round 4px)}
.lpb-abyssia.lpb-js .ph.on{clip-path:inset(0 0 0 0 round 4px)}
.lpb-abyssia .ph img{width:100%;height:100%;object-fit:cover;transform:scale(1.06);transition:transform 2.6s cubic-bezier(.19,1,.22,1)}
.lpb-abyssia.lpb-js .ph img{transform:scale(1.25)}.lpb-abyssia.lpb-js .ph.on img{transform:scale(1.06)}
.lpb-abyssia .ph:after{content:"";position:absolute;inset:0;background:radial-gradient(120% 90% at 50% 50%,transparent 55%,color-mix(in srgb,var(--bg) 70%,transparent));pointer-events:none}
.lpb-abyssia .ph.wide{aspect-ratio:16/9}.lpb-abyssia .ph.tall{aspect-ratio:5/7}
.lpb-abyssia .zn{font:italic 300 120px/1 var(--serif);color:rgba(140,180,255,.08);position:absolute;right:-10px;top:-70px;pointer-events:none}
.lpb-abyssia .zone .tx{position:relative}
.lpb-abyssia .meta{display:flex;gap:28px;margin-top:34px;font-size:11px;letter-spacing:.2em;color:var(--sub)}
.lpb-abyssia .meta b{display:block;font:300 24px var(--serif);color:var(--ink);letter-spacing:.06em;margin-top:4px}
.lpb-abyssia .full{position:relative;height:100svh;min-height:520px;overflow:hidden;padding:0}
.lpb-abyssia .full .bg{position:absolute;inset:0;overflow:hidden}
.lpb-abyssia .full .bg img{width:100%;height:100%;object-fit:cover;object-position:50% 60%;transition:transform 2.4s cubic-bezier(.19,1,.22,1)}
.lpb-abyssia.lpb-js .full .bg img{transform:scale(1.12)}.lpb-abyssia.lpb-js .full.on .bg img{transform:scale(1)}
.lpb-abyssia .full .bg:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,var(--bg),transparent 25%,transparent 55%,color-mix(in srgb,var(--bg) 75%,transparent) 80%,var(--bg))}
.lpb-abyssia .full .cap{position:absolute;left:0;right:0;bottom:22vh;text-align:center;z-index:2;padding:0 20px}
.lpb-abyssia .full .cap .big{margin:0;font:200 clamp(22px,3vw,38px)/1.8 var(--sans);letter-spacing:.3em;text-shadow:0 0 30px rgba(0,0,0,.8)}
.lpb-abyssia .mq{overflow:hidden;padding:30px 0;border-top:1px solid var(--ln);border-bottom:1px solid var(--ln);position:relative}
.lpb-abyssia .mq div{display:flex;gap:70px;width:max-content;animation:aMq 50s linear infinite;font:italic 300 clamp(28px,4vw,52px) var(--serif);letter-spacing:.1em;color:rgba(232,241,255,.35)}
.lpb-abyssia .mq span:nth-child(even){color:var(--c2);opacity:.7}
@keyframes aMq{to{transform:translateX(-50%)}}
.lpb-abyssia .night{display:grid;grid-template-columns:1fr 1fr;gap:70px;align-items:center}
.lpb-abyssia .night .ph{aspect-ratio:16/10}
.lpb-abyssia .nimg{position:relative;padding-bottom:18%}
.lpb-abyssia .night .ph.ck{position:absolute;right:-6%;bottom:0;width:44%;aspect-ratio:1;box-shadow:0 30px 60px -20px rgba(0,0,0,.9),0 0 0 1px rgba(140,180,255,.15);z-index:2;overflow:visible}
.lpb-abyssia .ph.ck img{border-radius:4px}
.lpb-abyssia .ph.ck figcaption{position:absolute;left:10px;bottom:10px;z-index:2;font:300 10px var(--sans);letter-spacing:.16em;color:var(--ink2);white-space:nowrap;background:color-mix(in srgb,var(--bg) 55%,transparent);padding:4px 10px;border-radius:99px;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)}
.lpb-abyssia .ph.ck figcaption em{font:italic 300 13px var(--serif);color:var(--c3);letter-spacing:.04em}
.lpb-abyssia .pair{display:grid;grid-template-columns:minmax(260px,400px) 1fr;gap:70px;align-items:center}
.lpb-abyssia .time{margin-top:34px;display:grid;border-top:1px solid var(--ln)}
.lpb-abyssia .time div{display:flex;justify-content:space-between;gap:16px;padding:16px 0;border-bottom:1px solid var(--ln);font-size:13px;color:var(--ink2)}
.lpb-abyssia .time b{font:300 18px var(--serif);color:var(--ink);letter-spacing:.06em;text-align:right}
.lpb-abyssia .price{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:60px}
.lpb-abyssia .tk{position:relative;padding:36px 30px;border:1px solid var(--ln);border-radius:4px;background:rgba(10,20,45,.35);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);overflow:hidden;transition:border-color .5s,transform .6s cubic-bezier(.19,1,.22,1),opacity 1.6s,filter 1.6s}
.lpb-abyssia .tk:before{content:"";position:absolute;inset:-1px;background:radial-gradient(300px circle at var(--x,50%) var(--y,0%),color-mix(in srgb,var(--c1) 18%,transparent),transparent 60%);opacity:0;transition:opacity .4s;pointer-events:none}
.lpb-abyssia .tk:hover{border-color:color-mix(in srgb,var(--c1) 40%,transparent);transform:translateY(-4px)}
.lpb-abyssia .tk:hover:before{opacity:1}
.lpb-abyssia .tk small{font-size:10.5px;letter-spacing:.4em;color:var(--c1)}
.lpb-abyssia .tk h3{margin:14px 0 0;font-weight:300;font-size:17px;letter-spacing:.14em}
.lpb-abyssia .tk .yen{white-space:nowrap;margin-top:22px;font:300 40px/1 var(--serif);letter-spacing:.04em}
.lpb-abyssia .tk .yen span{font:300 12px var(--sans);color:var(--sub);margin-left:6px}
.lpb-abyssia .tk p{margin:16px 0 0;font-size:12.5px;color:var(--ink2);line-height:2}
.lpb-abyssia .tk.fe{border-color:color-mix(in srgb,var(--c2) 45%,transparent)}
.lpb-abyssia .tk.fe small{color:var(--c3)}
.lpb-abyssia .note{margin-top:20px;font-size:11px;color:var(--sub);text-align:center}
.lpb-abyssia .access{display:grid;grid-template-columns:1.2fr 1fr;gap:70px;align-items:center}
.lpb-abyssia .access .ph{aspect-ratio:16/9}
.lpb-abyssia .dl{margin:30px 0 0;display:grid;grid-template-columns:auto 1fr;gap:14px 26px;font-size:13px}
.lpb-abyssia .dl dt{color:var(--sub);letter-spacing:.2em;font-size:11px;padding-top:2px}
.lpb-abyssia .dl dd{margin:0;color:var(--ink2)}
.lpb-abyssia .end{position:relative;min-height:100svh;display:flex;align-items:center;justify-content:center;text-align:center;overflow:hidden;padding:0}
.lpb-abyssia .end .bg{position:absolute;inset:0}
.lpb-abyssia .end .bg img{width:100%;height:100%;object-fit:cover;opacity:.75}
.lpb-abyssia .end .bg:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,var(--bg),color-mix(in srgb,var(--bg) 20%,transparent) 40%,color-mix(in srgb,var(--bg) 50%,transparent))}
.lpb-abyssia .end .tx{position:relative;z-index:2;padding:0 20px}
.lpb-abyssia .end h2{font:300 clamp(34px,5vw,64px)/1.5 var(--serif);letter-spacing:.2em;margin:18px 0 0}
.lpb-abyssia .btn{position:relative;display:inline-flex;align-items:center;gap:16px;margin-top:44px;padding:20px 46px;border:1px solid rgba(232,241,255,.5);border-radius:99px;font-size:12.5px;letter-spacing:.32em;overflow:hidden;isolation:isolate;transition:color .5s,border-color .5s}
.lpb-abyssia .btn::after{content:"→"}
.lpb-abyssia .btn:before{content:"";position:absolute;inset:0;background:linear-gradient(90deg,var(--c1),var(--c2));transform:translateY(101%);transition:transform .6s cubic-bezier(.19,1,.22,1);z-index:-1}
.lpb-abyssia .btn:hover{color:var(--bg);border-color:transparent}
.lpb-abyssia .btn:hover:before{transform:none}
.lpb-abyssia .ft{position:relative;z-index:2;padding:40px 32px 60px;text-align:center;font-size:10.5px;letter-spacing:.2em;color:var(--sub);background:var(--bg);line-height:2}
@media (max-width:860px){
.lpb-abyssia .w{padding:0 22px}
.lpb-abyssia .hd{padding:16px 18px}.lpb-abyssia .hd nav{display:none}
.lpb-abyssia .depth{right:6px}.lpb-abyssia .depth span{display:none}.lpb-abyssia .depth .bar{height:80px}.lpb-abyssia .depth b{font-size:14px}
.lpb-abyssia .intro .w{padding:0 30px}
.lpb-abyssia section{padding:110px 0}
.lpb-abyssia .zones{gap:120px}
.lpb-abyssia .zone,.lpb-abyssia .zone.rev,.lpb-abyssia .night,.lpb-abyssia .access,.lpb-abyssia .pair{grid-template-columns:1fr;gap:44px}
.lpb-abyssia .pair .ph{max-width:300px}
.lpb-abyssia .night .ph.ck{right:0;width:46%}
.lpb-abyssia .zone.rev .ph{order:0;justify-self:start}
.lpb-abyssia .zn{font-size:80px;top:-50px;right:0}
.lpb-abyssia .price{grid-template-columns:1fr}
.lpb-abyssia .full .cap{bottom:14svh}.lpb-abyssia .full .cap .lbl{letter-spacing:.22em;white-space:nowrap}
.lpb-abyssia .hero h1{letter-spacing:.2em;padding-left:.2em}}
@media (prefers-reduced-motion:reduce){.lpb-abyssia *{animation:none!important;transition:none!important}.lpb-abyssia .intro .c,.lpb-abyssia.lpb-js .rv,.lpb-abyssia.lpb-js .hero h1 .lt,.lpb-abyssia.lpb-js .hero .k,.lpb-abyssia.lpb-js .hero .sub,.lpb-abyssia.lpb-js .scr,.lpb-abyssia.lpb-js .hero .jf{opacity:1!important;filter:none!important}.lpb-abyssia.lpb-js .ph{clip-path:none!important}}`,
  render: ({ f, img, link, when, v, has }) => {
    const mq = split(v("marquee"));
    const mqHtml = [...mq, ...mq].map((w) => `<span>${w}</span><span>✦</span>`).join("");
    const zone = (n: 1 | 2 | 3, rev: boolean) => `
 <div class="zone${rev ? " rev" : ""}">
  <figure class="ph ${rev ? "tall" : "wide"} rv">${img(`z${n}`)}</figure>
  <div class="tx rv"><span class="zn">0${n}</span><p class="lbl">${f(`z${n}No`, "b")}${f(`z${n}En`)}</p>${f(`z${n}T`, "h2")}${f(`z${n}B`, "p", "lead")}
   ${when([`z${n}m1`, `z${n}m2`], `<div class="meta">${when([`z${n}m1`], `<div>${f(`z${n}m1`)}${f(`z${n}v1`, "b")}</div>`)}${when([`z${n}m2`], `<div>${f(`z${n}m2`)}${f(`z${n}v2`, "b")}</div>`)}</div>`)}</div>
 </div>`;
    return `
<div class="fxl" aria-hidden="true"><canvas></canvas><div class="depth"><span>DEPTH</span><div class="bar"><i></i></div><b class="dp">0</b><span>m</span></div></div>
<div class="mn">
<header class="hd">${f("brand", "span", "logo")}<nav><a href="#abyssia-zones">EXHIBITS</a><a href="#abyssia-night">NIGHT</a><a href="#abyssia-ticket">TICKETS</a><a href="#abyssia-access">ACCESS</a></nav></header>
<section class="hero">
 <div class="jf" aria-hidden="true">${img("hero")}</div>
 <div class="tx">${f("kick", "p", "k")}${f("brand", "h1")}${f("heroSub", "p", "sub")}</div>
 <div class="scr">${f("scroll")}<i></i></div>
</section>
<section class="intro"><div class="w">${f("statement", "p", "big")}</div></section>
${mq.length ? `<div class="mq" aria-hidden="true"><div>${mqHtml}</div></div>` : ""}
<section id="abyssia-zones"><div class="w zones">${zone(1, false)}${zone(2, true)}${zone(3, false)}</div></section>
<section class="full"><div class="bg">${img("full")}</div><div class="cap rv"><p class="lbl" style="margin-bottom:18px">${f("fullNo", "b")}${f("fullEn")}</p>${f("fullT", "p", "big")}</div></section>
<section id="abyssia-night"><div class="w night">
 <div class="tx rv"><p class="lbl">${f("nightNo", "b")}${f("nightEn")}</p>${f("nightT", "h2")}${f("nightB", "p", "lead")}
  ${when(["t1L", "t2L", "t3L"], `<div class="time">${when(["t1L"], `<div>${f("t1L")}${f("t1V", "b")}</div>`)}${when(["t2L"], `<div>${f("t2L")}${f("t2V", "b")}</div>`)}${when(["t3L"], `<div>${f("t3L")}${f("t3V", "b")}</div>`)}</div>`)}</div>
 <div class="nimg"${has("cocktail") ? "" : ' style="padding-bottom:0"'}><figure class="ph rv">${img("bar")}</figure>${has("cocktail") ? `<figure class="ph ck rv">${img("cocktail")}${when(["ckCap"], f("ckCap", "figcaption"))}</figure>` : ""}</div>
</div></section>
<section style="padding-top:40px"><div class="w pair">
 <figure class="ph tall rv">${img("pair")}</figure>
 <div class="rv"><p class="lbl">${f("pairNo", "b")}${f("pairEn")}</p>${f("pairT", "h2")}${f("pairB", "p", "lead")}</div>
</div></section>
<section id="abyssia-ticket"><div class="w">
 <div class="rv" style="text-align:center"><p class="lbl">TICKETS</p>${f("tkTitle", "h2")}</div>
 <div class="price">
  <div class="tk rv">${f("tk1E", "small")}${f("tk1N", "h3")}<p class="yen">${f("tk1P")}<span>${f("tk1U")}</span></p>${f("tk1B", "p")}</div>
  <div class="tk fe rv">${f("tk2E", "small")}${f("tk2N", "h3")}<p class="yen">${f("tk2P")}<span>${f("tk2U")}</span></p>${f("tk2B", "p")}</div>
  <div class="tk rv">${f("tk3E", "small")}${f("tk3N", "h3")}<p class="yen">${f("tk3P")}<span>${f("tk3U")}</span></p>${f("tk3B", "p")}</div>
 </div>
 ${when(["tkNote"], f("tkNote", "p", "note rv"))}
</div></section>
<section id="abyssia-access" style="padding-top:40px"><div class="w access">
 <figure class="ph rv">${img("place")}</figure>
 <div class="rv"><p class="lbl">ACCESS</p>${f("acT", "h2")}
  <dl class="dl">${f("ac1L", "dt")}${f("ac1V", "dd")}${f("ac2L", "dt")}${f("ac2V", "dd")}${when(["ac3L"], f("ac3L", "dt") + f("ac3V", "dd"))}</dl></div>
</div></section>
<section class="end"><div class="bg">${img("end")}</div>
 <div class="tx rv">${f("endLabel", "p", "lbl")}${f("endTitle", "h2")}${link("ctaLabel", "ctaUrl", "btn")}</div>
</section>
<footer class="ft">${f("brand", "div", "logo")}${when(["note"], f("note", "p"))}</footer>
</div>`;
  },
  js: `var Q=function(s){return root.querySelector(s)},QA=function(s){return [].slice.call(root.querySelectorAll(s))},es=function(s){return s.replace(/&/g,"&amp;").replace(/</g,"&lt;")};
watch(".ph,.full");
QA(".tk").forEach(function(t){t.addEventListener("pointermove",function(e){var r=t.getBoundingClientRect();t.style.setProperty("--x",(e.clientX-r.left)+"px");t.style.setProperty("--y",(e.clientY-r.top)+"px")})});
if(!EDIT){
 var h1=Q(".hero h1");if(h1){var nm=h1.textContent;h1.setAttribute("aria-label",nm);h1.innerHTML=nm.split("").map(function(c,i){return '<span class="lt" style="transition-delay:'+(1.4+i*.18).toFixed(2)+'s">'+es(c)+'</span>'}).join("")}
 var st=Q(".intro .big");if(st){var ci=0;st.innerHTML=st.innerHTML.replace(/<br\\s*\\/?>/gi," ").split(/\\s+/).filter(Boolean).map(function(w){var ac=/<em>/.test(w);var d=document.createElement("div");d.innerHTML=w;return '<span class="wd'+(ac?" ac":"")+'">'+d.textContent.split("").map(function(ch){var a=Math.random()*6.283,R=40+Math.random()*120;ci++;return '<span class="c" style="--dx:'+(Math.cos(a)*R).toFixed(0)+'px;--dy:'+(Math.sin(a)*R+40).toFixed(0)+'px;--d:'+(ci*.045+Math.random()*.5).toFixed(2)+'s">'+es(ch)+'</span>'}).join("")+'</span>'}).join("");
  var io3=new IntersectionObserver(function(x){if(x[0].isIntersecting){Q(".intro").classList.add("on");io3.disconnect()}},{threshold:.45});io3.observe(st)}
}
var mob=matchMedia("(max-width:860px)").matches,fxl=Q(".fxl"),dp=Q(".dp"),dpi=Q(".depth .bar i"),zones=Q("#abyssia-zones");
var hd=Q(".hd");function hfx(){var r=root.getBoundingClientRect();if(hd)hd.classList.toggle("fx",r.top<0&&r.bottom>80)}addEventListener("scroll",hfx,{passive:true});hfx();
var cs=getComputedStyle(root),hex=function(h){h=h.trim().replace("#","");if(h.length===3)h=h.split("").map(function(c){return c+c}).join("");var n=parseInt(h,16);return [n>>16&255,n>>8&255,n&255]};
function sc(){var r=root.getBoundingClientRect(),H=root.offsetHeight-innerHeight,p=Math.min(1,Math.max(0,-r.top/Math.max(1,H)));
 var dep=p<.9?Math.round(p/.9*1000):Math.round(1000-(p-.9)/.1*1000);if(dp)dp.textContent=dep;if(dpi)dpi.style.top=(Math.min(p/.9,1)*96)+"%";
 try{var a=hex(cs.getPropertyValue("--sea")),b=hex(cs.getPropertyValue("--bg")),k=Math.min(1,p/.85);var c=a.map(function(v,i){return Math.round(v+(b[i]-v)*k)});fxl.style.background="linear-gradient(180deg,rgb("+c+") 0%,rgb("+b+") 100%)"}catch(e){}}
var tk=0;addEventListener("scroll",function(){if(!tk){tk=1;requestAnimationFrame(function(){tk=0;sc()})}},{passive:true});sc();
var cv=Q(".fxl canvas"),cx=cv&&cv.getContext("2d");
if(cx&&!RED){var W,H,DPR=Math.min(devicePixelRatio||1,mob?1.5:2),mx=-999,my=-999,P=[],B=[],F=[];
 function rs(){W=cv.clientWidth;H=cv.clientHeight;cv.width=W*DPR;cv.height=H*DPR;cx.setTransform(DPR,0,0,DPR,0,0)}rs();addEventListener("resize",rs);
 var NP=mob?60:130,NB=mob?14:28,NF=mob?16:60,FS=mob?.45:.7,c1=hex(cs.getPropertyValue("--c1"));
 for(var i=0;i<NP;i++)P.push({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.6+.3,vx:(Math.random()-.5)*.15,vy:-Math.random()*.25-.03,h:Math.random()<.6?190:265,a:Math.random()*.6+.2,t:Math.random()*6});
 for(i=0;i<NB;i++)B.push({x:Math.random()*W,y:H+Math.random()*H,r:Math.random()*3+1,v:Math.random()*.6+.3,w:Math.random()*6});
 for(i=0;i<NF;i++)F.push({x:W*.5+(Math.random()-.5)*200,y:H*.6+(Math.random()-.5)*120,vx:Math.random()-.5,vy:Math.random()-.5});
 addEventListener("pointermove",function(e){var r=cv.getBoundingClientRect();mx=e.clientX-r.left;my=e.clientY-r.top},{passive:true});
 var t0=performance.now(),fishVis=0;
 (function draw(now){var t=(now-t0)/1000;var rr=root.getBoundingClientRect();if(rr.bottom<0||rr.top>innerHeight){requestAnimationFrame(draw);return}
  cx.clearRect(0,0,W,H);var hz=Math.max(0,1-(-rr.top)/(innerHeight*1.2));
  if(hz>0){cx.save();cx.globalCompositeOperation="lighter";for(var k=0;k<5;k++){var x=W*(.15+k*.18)+Math.sin(t*.3+k)*40;var g=cx.createLinearGradient(x,0,x+80,H);g.addColorStop(0,"rgba("+c1+","+(.07*hz)+")");g.addColorStop(1,"rgba("+c1+",0)");cx.fillStyle=g;cx.beginPath();cx.moveTo(x-20,0);cx.lineTo(x+60,0);cx.lineTo(x+220,H);cx.lineTo(x+60,H);cx.closePath();cx.fill()}cx.restore()}
  cx.save();cx.globalCompositeOperation="lighter";
  P.forEach(function(p){var dx=p.x-mx,dy=p.y-my,dd=dx*dx+dy*dy;if(dd<14000){var f=(14000-dd)/14000*.6,dl=Math.sqrt(dd)||1;p.vx+=dx/dl*f;p.vy+=dy/dl*f}
   p.vx*=.96;p.vy=p.vy*.96-.002;p.x+=p.vx+Math.sin(t*.5+p.t)*.15;p.y+=p.vy;if(p.y<-10){p.y=H+10;p.x=Math.random()*W}if(p.x<-10)p.x=W+10;if(p.x>W+10)p.x=-10;
   var al=p.a*(.6+.4*Math.sin(t*1.3+p.t));cx.fillStyle="hsla("+p.h+",100%,75%,"+al+")";cx.beginPath();cx.arc(p.x,p.y,p.r,0,6.283);cx.fill();
   if(p.r>1.3){cx.fillStyle="hsla("+p.h+",100%,70%,"+(al*.15)+")";cx.beginPath();cx.arc(p.x,p.y,p.r*5,0,6.283);cx.fill()}});
  cx.restore();
  cx.strokeStyle="rgba(180,230,255,.35)";cx.lineWidth=1;B.forEach(function(b){b.y-=b.v;b.x+=Math.sin(t*1.5+b.w)*.3;if(b.y<-10){b.y=H+10;b.x=Math.random()*W}cx.beginPath();cx.arc(b.x,b.y,b.r,0,6.283);cx.stroke()});
  var zr=zones?zones.getBoundingClientRect():{top:9e9,bottom:-9e9},want=(zr.top<H*.6&&zr.bottom>H*.2)?1:0;fishVis+=(want-fishVis)*.03;
  if(fishVis>.02){var tx=W*.5+Math.cos(t*.25)*W*.3,ty=(mob?H*.82:H*.55)+Math.sin(t*.4)*H*(mob?.08:.2);
   F.forEach(function(f){var ax=tx-f.x,ay=ty-f.y,al=Math.sqrt(ax*ax+ay*ay)||1;f.vx+=ax/al*.08;f.vy+=ay/al*.08;
    var dx=f.x-mx,dy=f.y-my,dd=dx*dx+dy*dy;if(dd<22000){var dl=Math.sqrt(dd)||1;f.vx+=dx/dl*1.4;f.vy+=dy/dl*1.4}
    f.vx+=(Math.random()-.5)*.25;f.vy+=(Math.random()-.5)*.25;var sp=Math.sqrt(f.vx*f.vx+f.vy*f.vy),mxs=mob?2:3;if(sp>mxs){f.vx*=mxs/sp;f.vy*=mxs/sp}
    f.x+=f.vx;f.y+=f.vy;var an=Math.atan2(f.vy,f.vx);cx.save();cx.translate(f.x,f.y);cx.rotate(an);cx.scale(FS,FS);cx.fillStyle="rgba(170,215,255,"+((mob?.28:.38)*fishVis)+")";cx.beginPath();cx.moveTo(7,0);cx.quadraticCurveTo(0,-2.6,-6,0);cx.quadraticCurveTo(0,2.6,7,0);cx.fill();cx.beginPath();cx.moveTo(-6,0);cx.lineTo(-9,-2.2);cx.lineTo(-9,2.2);cx.fill();cx.restore()})}
  requestAnimationFrame(draw)})(performance.now());
}`,
};
