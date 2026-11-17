(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,72520,96867,e=>{"use strict";let a=(0,e.i(75254).f)("ArrowRight",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"m12 5 7 7-7 7",key:"xquz4c"}]]);e.s(["f",0,a],72520);var t=e.i(43476),i=e.i(71645);e.s(["f",0,function({html:e,width:a=1280,height:o,className:l="",title:r="プレビュー",interactive:s=!1,frameRef:p,onLoad:n}){let c=(0,i.useRef)(null),[d,b]=(0,i.useState)(0),[m,f]=(0,i.useState)(0);return(0,i.useEffect)(()=>{let e=c.current;if(!e)return;let t=new ResizeObserver(()=>{b(Math.min(1,e.clientWidth/a)),f(e.clientHeight)});return t.observe(e),()=>t.disconnect()},[a]),(0,t.jsx)("div",{ref:c,className:`relative overflow-hidden ${l}`,style:o?{height:o*d}:void 0,children:d>0&&(0,t.jsx)("iframe",{ref:p,title:r,srcDoc:e,onLoad:n,tabIndex:s?0:-1,className:`absolute left-0 top-0 origin-top-left border-0 bg-white ${s?"":"pointer-events-none"}`,style:{width:a,height:o??(d?m/d:800),transform:`scale(${d})`,left:d<1?0:`calc(50% - ${a/2}px)`},sandbox:"allow-scripts allow-same-origin"})})}],96867)},28365,e=>{"use strict";function a(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;").replace(/\{/g,"&#123;").replace(/\}/g,"&#125;")}let t=e=>a(e).replace(/\r?\n/g,"<br>");function i(e){let a=e.trim();return a?/^(https?:\/\/|mailto:|tel:|#|\/)/i.test(a)?a:/^[\w.-]+\.[a-z]{2,}(\/|$)/i.test(a)?`https://${a}`:"#":"#"}let o=(e,a)=>e.colors.map(e=>`--${e.id}:${/^#[0-9a-f]{3,8}$/i.test(a.colors[e.id]??"")?a.colors[e.id]:e.value}`).join(";"),l=`.lpb{box-sizing:border-box;-webkit-text-size-adjust:100%;line-break:strict;overflow-wrap:anywhere;line-height:1.8;-webkit-font-smoothing:antialiased}
.lpb *,.lpb *::before,.lpb *::after{box-sizing:border-box;margin:0;padding:0}
.lpb img{display:block;max-width:100%;height:auto;object-fit:cover}
.lpb a{color:inherit;text-decoration:none}
.lpb h1,.lpb h2,.lpb h3,.lpb blockquote,.lpb .lpb-keep{word-break:auto-phrase;text-wrap:pretty}
.lpb details summary{cursor:pointer;list-style:none}.lpb details summary::-webkit-details-marker{display:none}
.lpb .lpb-img{width:100%}
@media (prefers-reduced-motion:reduce){.lpb *{animation:none!important;transition:none!important}}`,r=`[data-f]{outline:1px dashed transparent;outline-offset:3px;border-radius:2px;cursor:text;transition:outline-color .2s}
[data-f]:hover{outline-color:rgba(37,99,235,.55)}[data-f]:focus{outline:2px solid #2563eb}
[data-f]:empty::before{content:attr(data-ph);opacity:.35}
img[data-s]{cursor:pointer;transition:filter .2s}img[data-s]:hover{filter:brightness(.82)}`;function s(e,r,s,p){let n,c,d,b=`<div class="lpb lpb-${e.id}" style="${o(e,r)}">${e.render((n=e=>r.fields[e]??"",c=a=>e.fields.find(e=>e.id===a)?.label??a,d="edit"===p,{f:(e,i="span",o="")=>`<${i}${o?` class="${o}"`:""}${d?` data-f="${e}" data-ph="${a(c(e))}"`:""}>${t(n(e))}</${i}>`,img:(t,i="")=>{let o=e.slots.find(e=>e.id===t),l=o?`${o.ratio[0]} / ${o.ratio[1]}`:"auto",r=o?o.max:1200,p=o?Math.round(o.max*o.ratio[1]/o.ratio[0]):800;return`<img class="lpb-img${i?` ${i}`:""}" src="${s(t)}" alt="${a(o?.label??"")}" width="${r}" height="${p}" style="aspect-ratio:${l}" ${t===e.slots[0].id?'fetchpriority="high"':'loading="lazy"'} decoding="async"${d?` data-s="${t}"`:""}>`},link:(e,o,l="")=>`<a class="${l}" href="${a(i(n(o)))}"${d?` data-f="${e}" data-ph="${a(c(e))}" data-u="${o}"`:""}>${t(n(e))}</a>`,when:(e,a)=>d||e.some(e=>n(e).trim())?a:"",v:e=>a(n(e))}))}</div>`;return{css:`${l}
${e.css}`,body:b,fonts:e.fonts}}let p=e=>(e.fields.brand||e.info.brand||"LP").trim();e.s(["e",0,o,"w",0,function(e,t,i=!1){let o=Math.round(1200*t[1]/t[0]),l=i?"#7f93ad":"#8b8a85",r=Math.round(Math.min(1200,o)/11),s=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="${o}" viewBox="0 0 1200 ${o}"><rect width="100%" height="100%" fill="${i?"#0d1726":"#ecebe7"}"/><rect x="24" y="24" width="1152" height="${o-48}" fill="none" stroke="${l}" stroke-opacity=".35" stroke-width="3" stroke-dasharray="14 12"/><text x="50%" y="48%" fill="${l}" font-family="sans-serif" font-size="${r}" text-anchor="middle">${a(e)}</text><text x="50%" y="${48+100/7}%" fill="${l}" font-family="sans-serif" font-size="${Math.round(.6*r)}" text-anchor="middle" opacity=".8">${t[0]}:${t[1]}</text></svg>`;return`data:image/svg+xml;charset=utf-8,${encodeURIComponent(s)}`},"r",0,function(e,a,t){let{css:i,body:o,fonts:l}=s(e,a,t,"edit"),p=`(function(){var P=parent;
document.querySelectorAll('[data-f]').forEach(function(el){try{el.contentEditable='plaintext-only'}catch(e){el.contentEditable='true'}
el.addEventListener('input',function(){var id=el.dataset.f,v=el.innerText.replace(/\\n$/,'');document.querySelectorAll('[data-f="'+id+'"]').forEach(function(o){if(o!==el)o.innerText=v});P.postMessage({lpb:'field',id:id,value:v},'*')});
el.addEventListener('paste',function(e){if(el.contentEditable==='true'){e.preventDefault();document.execCommand('insertText',false,(e.clipboardData||window.clipboardData).getData('text'))}})});
document.querySelectorAll('details').forEach(function(d){d.open=true});
document.addEventListener('click',function(e){if(e.target.closest('summary [data-f]'))e.preventDefault();var a=e.target.closest('a');if(a)e.preventDefault();var im=e.target.closest('img[data-s]');if(im)P.postMessage({lpb:'slot',id:im.dataset.s},'*')});
window.addEventListener('message',function(e){var d=e.data||{};if(d.lpb==='set'){document.querySelectorAll('[data-f="'+d.id+'"]').forEach(function(o){if(document.activeElement!==o)o.innerText=d.value})}
if(d.lpb==='url'){document.querySelectorAll('[data-u="'+d.id+'"]').forEach(function(o){o.setAttribute('href',d.value)})}
if(d.lpb==='img'){document.querySelectorAll('img[data-s="'+d.id+'"]').forEach(function(o){o.src=d.value})}
if(d.lpb==='vars'){document.querySelector('.lpb').setAttribute('style',d.value)}
if(d.lpb==='scroll'){var el=document.querySelector('[data-s="'+d.id+'"],[data-f="'+d.id+'"]');if(el){var r=el.getBoundingClientRect();window.scrollTo({top:scrollY+r.top-innerHeight/2+r.height/2,behavior:'smooth'})}}});
document.addEventListener('keydown',function(e){if(e.key==='Escape')P.postMessage({lpb:'esc'},'*')});
P.postMessage({lpb:'ready'},'*')})();`;return`<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="${l}"><style>body{margin:0}${i}
${r}</style></head><body>${o}<script>${p}</script></body></html>`},"v",0,i,"s",0,function(e,t,i){let{css:o,body:l,fonts:r}=s(e,t,e=>`{{ '${i(e)}' | asset_url }}`,"export"),n=`LP ${e.name}`.slice(0,25);return`{% comment %}${a(p(t))}：LP BUILDER で作成したセクションです{% endcomment %}
<link rel="stylesheet" href="${r}">
<style>
${o}
</style>
${l}

{% schema %}
${JSON.stringify({name:n,tag:"section",class:"lpb-section",settings:[],presets:[{name:n}]},null,2)}
{% endschema %}
`},"t",0,function(e,t,i){let{css:o,body:l,fonts:r}=s(e,t,i,"export");return`<!-- ${a(p(t))}：LP BUILDER で作成（WordPress のカスタムHTMLブロックに、このまま貼り付けます） -->
<link rel="stylesheet" href="${r}">
<style>
${o}
</style>
${l}
`},"H",0,function(e,t,i,o){let{css:l,body:r,fonts:n}=s(e,t,i,"export"),c=a(p(t)),d=a((t.fields.heroSub||t.fields.heroCopy||"").replace(/\s+/g," ").trim().slice(0,120));return`<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${c}</title>
<meta name="description" content="${d}">
<meta property="og:type" content="website">
<meta property="og:title" content="${c}">
<meta property="og:description" content="${d}">
<meta property="og:image" content="${o}">
<meta name="twitter:card" content="summary_large_image">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${n}">
<style>
body{margin:0}
${l}
</style>
</head>
<body>
${r}
</body>
</html>
`},"_",0,function(e,a,t){let{css:i,body:o,fonts:l}=s(e,a,t,"export");return`<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="${l}"><style>body{margin:0}${i}</style><script>document.addEventListener('click',function(e){if(e.target.closest('a'))e.preventDefault()})</script></head><body>${o}</body></html>`}])},85287,e=>{"use strict";var a=e.i(28365),t=e.i(50276),i=e.i(65608);e.s(["f",0,function(e){let o=t.n.find(a=>a.id===e),l=(0,i.B)(o.tpl),r={v:1,tpl:l.id,info:o.info,fields:o.fields,colors:{...Object.fromEntries(l.colors.map(e=>[e.id,e.value])),...o.colors},imgs:{},updated:0},s="u">typeof location?location.origin:"";return(0,a._)(l,r,e=>`${s}${(0,t.t)(o.imgs[e]??"")}`)}])},50276,e=>{"use strict";e.i(47167),e.s(["n",0,[{id:"sorae",tpl:"sorae",title:"SORAE セラミドローション",lead:"敏感肌向けの化粧水。白と余白で、やさしさと清潔感を伝えるLP。",info:{brand:"SORAE",product:"セラミド配合の化粧水",target:"30代の乾燥・敏感肌に悩む女性",strengths:"ヒト型セラミド3種、無香料・無着色、国内の自社工場で製造",tone:"やさしく、上品に",price:"120mL 3,960円（税込）",url:"#"},fields:{brand:"SORAE",heroCopy:"ゆらぎやすい肌に、\n空のような透明感を。",heroSub:"3種のヒト型セラミドが、角層のすみずみまで。\n朝も夜も、一本でうるおいが続く化粧水です。",price:"120mL 3,960円（税込）",ctaLabel:"購入する",ctaUrl:"#",introTitle:"季節の変わり目に、\n肌がゆらぐあなたへ。",introBody:"乾燥やつっぱり、赤み。肌のコンディションは、気温や湿度ですぐに変わります。SORAEは「毎日、同じように安心して使えること」を大切に、敏感な肌のための処方を一から考えました。",feat1T:"3種のヒト型セラミド",feat1B:"肌にもともとある成分に近いセラミドを3種類。角層まで届いて、うるおいを守ります。",feat2T:"無香料・無着色",feat2B:"香料・着色料・アルコールは入れていません。肌がゆらいでいる日にも使いやすい処方です。",feat3T:"国内の自社工場で製造",feat3B:"原料の受け入れから充てん・検品まで、すべて国内の自社工場で行っています。",useTitle:"やさしく、なじませるだけ",use1:"洗顔のあと、500円玉くらいの量を手のひらに",use2:"顔全体を包むように、やさしくなじませます",use3:"乾燥が気になるところには、重ねづけを",labTitle:"ひと瓶ずつ、\n確かめてから届けます。",labBody:"製造ごとに、成分の量や品質を検査しています。合格したものだけを出荷し、お届けしたあとも同じ製造番号のサンプルを保管しています。",voice1:"つっぱらずに、しっとりが続くのがうれしいです。香りがないのも助かっています。",voice1Name:"30代・乾燥肌（見本の文章です）",voice2:"季節の変わり目でも、いつもと同じように使えています。",voice2Name:"40代・敏感肌（見本の文章です）",faq1Q:"敏感肌でも使えますか？",faq1A:"敏感肌の方のことを考えた処方ですが、すべての方に合うわけではありません。はじめは腕の内側などで試してからお使いください。",faq2Q:"1本でどれくらい使えますか？",faq2A:"朝晩2回のご使用で、約1か月分です。",faq3Q:"定期便はありますか？",faq3A:"はい。毎月お届けする定期便をご用意しています（いつでも休止できます）。",closing:"毎日のうるおいを、\nもっとやさしく。",note:"※このLPはツールの作品例です。商品・お客様の声は架空のものです。\n※効果の感じ方には個人差があります。"},imgs:{hero:"sorae/bottle.webp",mood:"sorae/face.webp",use:"sorae/use.webp",lab:"sorae/qc.webp"}},{id:"craft",tpl:"craft",title:"CRAFT OEM 革財布のロゴ入れ",lead:"革小物のOEM（ロゴ入れ）の受注LP。悩み→解決→工程→商品の順で納得してもらう。",info:{brand:"CRAFT OEM",product:"本革の財布",target:"自分のブランドを作りたい個人・小さなお店",strengths:"型代0円、最短30日、30個から、職人が手作業で仕上げ",tone:"誠実で、力強く",price:"1個 6,800円〜",url:"#"},fields:{brand:"CRAFT OEM",heroCopy:"型代0円で、\nあなたのブランドを。",heroSub:"職人が仕上げた定番の革財布に、ロゴを入れるだけ。\n小さなロットから、自分のブランドを始められます。",badge1:"型代 0円",badge2:"最短 30日",badge3:"30個から",ctaLabel:"無料で見積もる",ctaUrl:"#",probTitle:"オリジナル商品、\nこんな理由であきらめていませんか？",prob1:"型代が数十万円かかると言われた",prob2:"最低ロットが多すぎて、在庫を抱えられない",prob3:"品質の良い工場の探し方がわからない",solTitle:"完成した定番品に、\nロゴを入れるから。",solBody:"一から型を作らず、職人が仕上げた定番のモデルにあなたのロゴを入れます。だから型代は0円、30個から注文でき、最短30日でお届けできます。",step1T:"革をえらぶ",step1B:"傷やシワを一枚ずつ確かめ、いちばん美しい部分だけを使います。",step2T:"縫い上げる",step2B:"ほつれにくい縫い方で、職人がひとつずつ縫い上げます。",step3T:"ロゴを押す",step3B:"金・銀・素押しから選べます。熱と圧で、くっきり美しく。",step4T:"検品してお届け",step4B:"国内で一つずつ検品し、箱に入れてお届けします。",item1Name:"二つ折り財布",item1Price:"¥6,800〜",item2Name:"長財布",item2Price:"¥8,900〜",item3Name:"トートバッグ",item3Price:"¥12,800〜",faq1Q:"ロゴのデータがありません",faq1A:"手書きのラフや画像からでも、データにおこせます（別料金）。",faq2Q:"サンプルは作れますか？",faq2A:"はい。ロゴを入れたサンプルを1個からお作りします。",faq3Q:"支払いはいつですか？",faq3A:"ご注文の確定時に半額、お届け前に残りの半額をお支払いいただきます。",closing:"まずは、無料の見積もりから。",closingSub:"数量とロゴの色を選ぶだけで、すぐに金額がわかります。",note:"※このLPはツールの作品例です。社名・価格は架空のものです。"},imgs:{hero:"craft/hero-pc.webp",step1:"craft/craft-select.webp",step2:"craft/craft-sew.webp",step3:"craft/craft-press.webp",step4:"craft/craft-inspect.webp",item1:"craft/model-bifold.webp",item2:"craft/model-long.webp",item3:"craft/model-tote.webp"}},{id:"abyssia",tpl:"abyssia",title:"ABYSSIA 深海の美術館",lead:"夜だけ開く、光の水族館の告知LP。章を読み進めるように世界観へ引き込む。",info:{brand:"ABYSSIA",product:"深海をテーマにした夜の水族館",target:"大人のカップル・友人同士",strengths:"光の演出、深海の生きもの、バーラウンジ",tone:"静かで、幻想的に",price:"大人 3,200円",url:"#"},fields:{brand:"ABYSSIA",heroCopy:"光で泳ぐ、\n深海の美術館。",heroSub:"夜だけひらく、光と生きものの展示。\n音のない深い青へ、ゆっくり降りていく体験を。",ctaLabel:"チケットを予約",ctaUrl:"#",ch1Label:"Chapter I — Light",ch1Title:"闇のなかで、\nいのちが光る。",ch1Body:"深海の生きものは、自分で光をつくります。ゆらめくクラゲ、すきとおった体。息をひそめて、その光を見つめてください。",ch2Label:"Chapter II — Corridor",ch2Title:"どこまでも続く、\n青の回廊。",ch2Body:"左右に並ぶ水槽のあいだを歩くと、まるで海の底へ降りていくよう。足音さえ、やわらかく響きます。",ch3Label:"Chapter III — Together",ch3Title:"大きな青の前で、\nふたりきり。",ch3Body:"高さ8メートルの大水槽。ゆっくり泳ぐエイを見上げながら、言葉のいらない時間を。",quote:"「静けさを、見に行く夜。」",info1L:"開催期間",info1V:"2027年1月10日〜3月31日（見本）",info2L:"時間",info2V:"18:00〜23:00（最終入場 22:00）",info3L:"料金",info3V:"大人 3,200円／高校生 2,000円",info4L:"場所",info4V:"東京都（見本の住所）",closing:"深い青へ、\n降りていこう。",note:"※このLPはツールの作品例です。施設・日程は架空のものです。"},imgs:{hero:"abyssia/vortex.webp",ch1:"abyssia/jelly.webp",ch2:"abyssia/corridor.webp",ch3:"abyssia/couple.webp",gal1:"abyssia/bar.webp",gal2:"abyssia/cocktail.webp",gal3:"abyssia/art.webp"}}],"t",0,e=>`/sakuapp/works/lp-builder/samples/${e}`])},65608,e=>{"use strict";let a=[{id:"sorae",name:"SORAE",kind:"化粧品・スキンケア",desc:"白と余白を生かした、やさしく上品な型。商品写真とモデル写真で、使う気分を伝えます。",best:"化粧水・美容液・ヘアケア・サプリ・アロマなど",fonts:"https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Noto+Sans+JP:wght@300;400;500&family=Noto+Serif+JP:wght@400;500&display=swap",colors:[{id:"accent",label:"アクセント",value:"#b0846c"},{id:"bg",label:"背景",value:"#faf7f3"},{id:"ink",label:"文字",value:"#3a3330"}],slots:[{id:"hero",label:"メイン（商品）",ratio:[3,4],min:700,max:1200,where:"いちばん上の大きな写真",prompt:"{product}の商品写真。白いボトルを淡いベージュの石の台に置き、やわらかい朝の自然光、背景はクリーム色の無地、余白を広く、高級感のあるミニマルなスキンケア広告の雰囲気。文字やロゴは入れない。縦長。",tips:"白い紙を背景に、窓の横で撮ると影がやわらかくなります。商品は少し上から、ラベルが正面に見える向きで。"},{id:"mood",label:"使っている人",ratio:[4,5],min:600,max:1e3,where:"「はじめに」の横",prompt:"{target}の女性が、洗面台の前で目を閉じて頬に手を当てている。素肌感のある自然なメイク、白いタオル、やわらかい光、清潔感。顔は横向きか目を閉じた表情で。文字は入れない。縦長。",tips:"顔をはっきり出さず、手元や横顔でも雰囲気は伝わります。肖像の使用許可を必ず取ってください。"},{id:"use",label:"使い方（手元）",ratio:[4,5],min:600,max:1e3,where:"「使い方」の写真",prompt:"手のひらに{product}を少量出しているクローズアップ。白い背景、やわらかい光、肌の質感がきれいに見える。文字は入れない。縦長。",tips:"手のひらを真上から。爪や手の乾燥が目立たないよう、保湿してから撮ると仕上がりがきれいです。"},{id:"lab",label:"こだわり（製造・研究）",ratio:[4,3],min:700,max:1200,where:"「こだわり」の写真",prompt:"清潔な研究室で、白衣の研究員が{product}の品質を確認している様子。明るく白い室内、ガラス器具、信頼感のある雰囲気。顔ははっきり写さない。文字は入れない。横長。",tips:"工場や作業場の写真があれば一番説得力があります。原料や道具を並べた写真でも代わりになります。"}],fields:[{id:"brand",label:"ブランド名",group:"ファーストビュー",max:20,hint:"ブランド名（ロゴの代わりに表示）"},{id:"heroCopy",label:"キャッチコピー",group:"ファーストビュー",multiline:!0,max:24,hint:"2行までの短いキャッチコピー。改行で行を分ける"},{id:"heroSub",label:"サブコピー",group:"ファーストビュー",multiline:!0,max:60,hint:"キャッチを補う一文"},{id:"price",label:"価格",group:"ファーストビュー",max:30,hint:"例：120mL 3,960円（税込）"},{id:"ctaLabel",label:"ボタンの文字",group:"ファーストビュー",max:14,hint:"購入ボタンの文字"},{id:"ctaUrl",label:"ボタンのリンク先",group:"ファーストビュー",url:!0},{id:"introTitle",label:"はじめにの見出し",group:"はじめに",multiline:!0,max:30,hint:"悩みに寄りそう見出し"},{id:"introBody",label:"はじめにの本文",group:"はじめに",multiline:!0,max:160,hint:"悩みと、この商品が生まれた理由"},{id:"feat1T",label:"特長1の見出し",group:"3つの特長",max:20},{id:"feat1B",label:"特長1の説明",group:"3つの特長",multiline:!0,max:70},{id:"feat2T",label:"特長2の見出し",group:"3つの特長",max:20},{id:"feat2B",label:"特長2の説明",group:"3つの特長",multiline:!0,max:70},{id:"feat3T",label:"特長3の見出し",group:"3つの特長",max:20},{id:"feat3B",label:"特長3の説明",group:"3つの特長",multiline:!0,max:70},{id:"useTitle",label:"使い方の見出し",group:"使い方",max:20},{id:"use1",label:"手順1",group:"使い方",max:40},{id:"use2",label:"手順2",group:"使い方",max:40},{id:"use3",label:"手順3",group:"使い方",max:40},{id:"labTitle",label:"こだわりの見出し",group:"こだわり",multiline:!0,max:30},{id:"labBody",label:"こだわりの本文",group:"こだわり",multiline:!0,max:140,hint:"作り方・品質・安全性"},{id:"voice1",label:"お客様の声1",group:"お客様の声",multiline:!0,max:70,optional:!0,hint:"実際にいただいた声だけを書く（作り話は書かない）"},{id:"voice1Name",label:"声1の名前",group:"お客様の声",max:20,optional:!0},{id:"voice2",label:"お客様の声2",group:"お客様の声",multiline:!0,max:70,optional:!0,hint:"実際にいただいた声だけを書く"},{id:"voice2Name",label:"声2の名前",group:"お客様の声",max:20,optional:!0},{id:"faq1Q",label:"質問1",group:"よくある質問",max:40,optional:!0},{id:"faq1A",label:"答え1",group:"よくある質問",multiline:!0,max:100,optional:!0},{id:"faq2Q",label:"質問2",group:"よくある質問",max:40,optional:!0},{id:"faq2A",label:"答え2",group:"よくある質問",multiline:!0,max:100,optional:!0},{id:"faq3Q",label:"質問3",group:"よくある質問",max:40,optional:!0},{id:"faq3A",label:"答え3",group:"よくある質問",multiline:!0,max:100,optional:!0},{id:"closing",label:"最後のひとこと",group:"最後",multiline:!0,max:40},{id:"note",label:"注意書き",group:"最後",multiline:!0,max:120,optional:!0,hint:"効果の感じ方には個人差があります、など"}],css:`.lpb-sorae{--serif:"Noto Serif JP",serif;--en:"Cormorant Garamond",serif;font-family:"Noto Sans JP",sans-serif;font-weight:300;background:var(--bg);color:var(--ink);font-size:15px;letter-spacing:.04em}
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
.lpb-sorae .s-top .s-btn{display:none}}`,render:({f:e,img:a,link:t,when:i})=>`
<header class="s-top">${e("brand","div","s-logo")}${t("ctaLabel","ctaUrl","s-btn sm")}</header>
<div class="s-hero">
  ${a("hero")}
  <div class="s-hero-text">
    <p class="s-eyebrow">New Skincare</p>
    ${e("heroCopy","h1")}
    ${e("heroSub","p","s-sub")}
    ${e("price","p","s-price")}
    ${t("ctaLabel","ctaUrl","s-btn")}
  </div>
</div>
<section><div class="s-wrap s-intro">
  ${a("mood")}
  <div><span class="s-label">Introduction</span>${e("introTitle","h2","s-h2")}${e("introBody","p","s-body")}</div>
</div></section>
<section class="s-feats"><div class="s-wrap">
  <div class="s-center"><span class="s-label">Features</span><h2 class="s-h2">3つの特長</h2></div>
  <div class="s-grid3">
    <div class="s-card"><div class="s-num">01</div>${e("feat1T","h3")}${e("feat1B","p")}</div>
    <div class="s-card"><div class="s-num">02</div>${e("feat2T","h3")}${e("feat2B","p")}</div>
    <div class="s-card"><div class="s-num">03</div>${e("feat3T","h3")}${e("feat3B","p")}</div>
  </div>
</div></section>
<section><div class="s-wrap s-use">
  <div><span class="s-label">How to use</span>${e("useTitle","h2","s-h2")}
  <ol class="s-steps">${e("use1","li")}${e("use2","li")}${e("use3","li")}</ol></div>
  ${a("use")}
</div></section>
<section class="s-lab"><div class="s-wrap">
  <div class="s-labtext s-center"><span class="s-label">Quality</span>${e("labTitle","h2","s-h2")}${e("labBody","p","s-body")}</div>
  ${a("lab")}
</div></section>
${i(["voice1","voice2"],`<section><div class="s-wrap"><div class="s-center"><span class="s-label">Voice</span><h2 class="s-h2">お客様の声</h2></div>
  <div class="s-voices">
    ${i(["voice1"],`<blockquote>${e("voice1","p")}${e("voice1Name","cite")}</blockquote>`)}
    ${i(["voice2"],`<blockquote>${e("voice2","p")}${e("voice2Name","cite")}</blockquote>`)}
  </div></div></section>`)}
${i(["faq1Q","faq2Q","faq3Q"],`<section class="s-feats"><div class="s-wrap"><div class="s-center"><span class="s-label">Q&amp;A</span><h2 class="s-h2">よくある質問</h2></div>
  <div class="s-faq">
    ${i(["faq1Q"],`<details><summary>${e("faq1Q")}</summary>${e("faq1A","p")}</details>`)}
    ${i(["faq2Q"],`<details><summary>${e("faq2Q")}</summary>${e("faq2A","p")}</details>`)}
    ${i(["faq3Q"],`<details><summary>${e("faq3Q")}</summary>${e("faq3A","p")}</details>`)}
  </div></div></section>`)}
<section class="s-close"><div class="s-wrap">
  ${e("closing","h2","s-h2")}${e("price","p","s-price")}${t("ctaLabel","ctaUrl","s-btn")}
</div></section>
<footer>${e("brand","span","s-logo")}${i(["note"],e("note","p"))}</footer>`},{id:"craft",name:"CRAFT",kind:"物販・ものづくり・OEM",desc:"悩み→解決→作る工程→商品一覧の順で、きちんと納得して買ってもらう型。B2Bの受注にも向いています。",best:"革小物・雑貨・家具・食品・OEM／受注生産の案内など",fonts:"https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Noto+Sans+JP:wght@400;500;700&display=swap",colors:[{id:"accent",label:"アクセント",value:"#b8860b"},{id:"dark",label:"濃い色",value:"#1a1a1a"},{id:"bg",label:"背景",value:"#f7f6f3"}],slots:[{id:"hero",label:"メイン（商品・横長）",ratio:[16,9],min:1200,max:1920,where:"いちばん上の大きな写真（文字が重なります）",prompt:"{product}を暗めの木の作業台に置いた商品写真。斜め上から、右側に商品、左側は文字を置くための暗い余白。温かいスポットライト、職人の工房の雰囲気、高級感。文字やロゴは入れない。横長16:9。",tips:"文字が左に重なるので、商品は右寄せに。背景は暗め・シンプルに。"},{id:"step1",label:"工程1（素材えらび）",ratio:[4,3],min:700,max:1200,where:"「作る工程」の1枚目",prompt:"{product}の素材を職人の手が選んでいるクローズアップ。木の作業台、自然光、手元中心。顔は写さない。文字は入れない。横長4:3。",tips:"素材や原料を並べ、手で触れているところを撮ると伝わりやすいです。"},{id:"step2",label:"工程2（作る）",ratio:[4,3],min:700,max:1200,where:"「作る工程」の2枚目",prompt:"職人が{product}を手作業で作っている手元のクローズアップ。工具、作業台、温かい光。顔は写さない。文字は入れない。横長4:3。",tips:"手と道具が一緒に写ると「手作り感」が出ます。"},{id:"step3",label:"工程3（仕上げ）",ratio:[4,3],min:700,max:1200,where:"「作る工程」の3枚目",prompt:"{product}の仕上げ作業。ロゴや刻印を入れる、磨くなどの細かな作業の手元。温かい光。文字は入れない。横長4:3。",tips:"仕上げの道具や、完成直前の商品のアップがおすすめです。"},{id:"step4",label:"工程4（検品）",ratio:[4,3],min:700,max:1200,where:"「作る工程」の4枚目",prompt:"完成した{product}を、白い手袋をした人がライトの下で検品している手元。清潔な作業台。文字は入れない。横長4:3。",tips:"検品・梱包の様子は「安心」につながります。"},{id:"item1",label:"商品1",ratio:[4,3],min:600,max:1e3,where:"「ラインナップ」の1つ目",prompt:"{product}（1つ目の種類）の商品写真。白い背景、斜め上から、やわらかい影。文字は入れない。横長4:3。",tips:"3つの商品は、同じ背景・同じ角度でそろえると、きれいに並びます。"},{id:"item2",label:"商品2",ratio:[4,3],min:600,max:1e3,where:"「ラインナップ」の2つ目",prompt:"{product}（2つ目の種類）の商品写真。白い背景、斜め上から、やわらかい影。文字は入れない。横長4:3。",tips:"商品1と同じ置き方・同じ光で撮ってください。"},{id:"item3",label:"商品3",ratio:[4,3],min:600,max:1e3,where:"「ラインナップ」の3つ目",prompt:"{product}（3つ目の種類）の商品写真。白い背景、斜め上から、やわらかい影。文字は入れない。横長4:3。",tips:"商品1と同じ置き方・同じ光で撮ってください。"}],fields:[{id:"brand",label:"ブランド名",group:"ファーストビュー",max:20},{id:"heroCopy",label:"キャッチコピー",group:"ファーストビュー",multiline:!0,max:26,hint:"2行までの力強いキャッチコピー"},{id:"heroSub",label:"サブコピー",group:"ファーストビュー",multiline:!0,max:70},{id:"badge1",label:"数字の強み1",group:"ファーストビュー",max:12,hint:"例：型代0円"},{id:"badge2",label:"数字の強み2",group:"ファーストビュー",max:12,hint:"例：最短30日"},{id:"badge3",label:"数字の強み3",group:"ファーストビュー",max:12,hint:"例：30個から"},{id:"ctaLabel",label:"ボタンの文字",group:"ファーストビュー",max:16},{id:"ctaUrl",label:"ボタンのリンク先",group:"ファーストビュー",url:!0},{id:"probTitle",label:"悩みの見出し",group:"こんな悩み",multiline:!0,max:30},{id:"prob1",label:"悩み1",group:"こんな悩み",max:36},{id:"prob2",label:"悩み2",group:"こんな悩み",max:36},{id:"prob3",label:"悩み3",group:"こんな悩み",max:36},{id:"solTitle",label:"解決の見出し",group:"解決",multiline:!0,max:30},{id:"solBody",label:"解決の本文",group:"解決",multiline:!0,max:160},{id:"step1T",label:"工程1の見出し",group:"作る工程",max:16},{id:"step1B",label:"工程1の説明",group:"作る工程",multiline:!0,max:60},{id:"step2T",label:"工程2の見出し",group:"作る工程",max:16},{id:"step2B",label:"工程2の説明",group:"作る工程",multiline:!0,max:60},{id:"step3T",label:"工程3の見出し",group:"作る工程",max:16},{id:"step3B",label:"工程3の説明",group:"作る工程",multiline:!0,max:60},{id:"step4T",label:"工程4の見出し",group:"作る工程",max:16},{id:"step4B",label:"工程4の説明",group:"作る工程",multiline:!0,max:60},{id:"item1Name",label:"商品1の名前",group:"ラインナップ",max:20},{id:"item1Price",label:"商品1の価格",group:"ラインナップ",max:20},{id:"item2Name",label:"商品2の名前",group:"ラインナップ",max:20},{id:"item2Price",label:"商品2の価格",group:"ラインナップ",max:20},{id:"item3Name",label:"商品3の名前",group:"ラインナップ",max:20},{id:"item3Price",label:"商品3の価格",group:"ラインナップ",max:20},{id:"faq1Q",label:"質問1",group:"よくある質問",max:40,optional:!0},{id:"faq1A",label:"答え1",group:"よくある質問",multiline:!0,max:100,optional:!0},{id:"faq2Q",label:"質問2",group:"よくある質問",max:40,optional:!0},{id:"faq2A",label:"答え2",group:"よくある質問",multiline:!0,max:100,optional:!0},{id:"faq3Q",label:"質問3",group:"よくある質問",max:40,optional:!0},{id:"faq3A",label:"答え3",group:"よくある質問",multiline:!0,max:100,optional:!0},{id:"closing",label:"最後の見出し",group:"最後",multiline:!0,max:30},{id:"closingSub",label:"最後の補足",group:"最後",multiline:!0,max:60},{id:"note",label:"会社名・注意書き",group:"最後",multiline:!0,max:120,optional:!0}],css:`.lpb-craft{--en:"Cormorant Garamond",serif;font-family:"Noto Sans JP",sans-serif;color:var(--dark);background:var(--bg);font-size:15px;letter-spacing:.03em}
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
.lpb-craft .c-btn{width:100%;justify-content:center;padding:17px 20px}}`,render:({f:e,img:a,link:t,when:i})=>`
<div class="c-hero"><div class="c-hero-in">
  ${e("brand","div","c-logo")}
  ${a("hero")}
  <div class="c-hero-copy">
    ${e("heroCopy","h1")}
    ${e("heroSub","p","c-sub")}
    <div class="c-badges">${e("badge1")}${e("badge2")}${e("badge3")}</div>
    ${t("ctaLabel","ctaUrl","c-btn")}
  </div>
</div></div>
<section><div class="c-wrap">
  <div class="c-center"><span class="c-label">Problem</span>${e("probTitle","h2","c-h2")}</div>
  <ul class="c-probs">${e("prob1","li")}${e("prob2","li")}${e("prob3","li")}</ul>
</div></section>
<section class="c-sol"><div class="c-wrap">
  <span class="c-label">Solution</span>${e("solTitle","h2","c-h2")}${e("solBody","p")}
</div></section>
<section><div class="c-wrap">
  <div class="c-center"><span class="c-label">Process</span><h2 class="c-h2">ひとつずつ、手で仕上げる</h2></div>
  <div class="c-steps">
    <div class="c-step">${a("step1")}<span class="c-step-n">STEP 01</span>${e("step1T","h3")}${e("step1B","p")}</div>
    <div class="c-step">${a("step2")}<span class="c-step-n">STEP 02</span>${e("step2T","h3")}${e("step2B","p")}</div>
    <div class="c-step">${a("step3")}<span class="c-step-n">STEP 03</span>${e("step3T","h3")}${e("step3B","p")}</div>
    <div class="c-step">${a("step4")}<span class="c-step-n">STEP 04</span>${e("step4T","h3")}${e("step4B","p")}</div>
  </div>
</div></section>
<section class="c-items"><div class="c-wrap">
  <div class="c-center"><span class="c-label">Lineup</span><h2 class="c-h2">ラインナップ</h2></div>
  <div class="c-grid3">
    <div class="c-item">${a("item1")}${e("item1Name","h3")}${e("item1Price","p")}</div>
    <div class="c-item">${a("item2")}${e("item2Name","h3")}${e("item2Price","p")}</div>
    <div class="c-item">${a("item3")}${e("item3Name","h3")}${e("item3Price","p")}</div>
  </div>
</div></section>
${i(["faq1Q","faq2Q","faq3Q"],`<section><div class="c-wrap"><div class="c-center"><span class="c-label">FAQ</span><h2 class="c-h2">よくある質問</h2></div>
  <div class="c-faq">
    ${i(["faq1Q"],`<details><summary>${e("faq1Q")}</summary>${e("faq1A","p")}</details>`)}
    ${i(["faq2Q"],`<details><summary>${e("faq2Q")}</summary>${e("faq2A","p")}</details>`)}
    ${i(["faq3Q"],`<details><summary>${e("faq3Q")}</summary>${e("faq3A","p")}</details>`)}
  </div></div></section>`)}
<section class="c-close"><div class="c-wrap">
  <span class="c-label">Contact</span>${e("closing","h2","c-h2")}${e("closingSub","p")}${t("ctaLabel","ctaUrl","c-btn")}
</div></section>
<footer>${e("brand","span","c-logo")}${i(["note"],e("note","p"))}</footer>`},{id:"abyssia",name:"ABYSSIA",kind:"世界観・体験・イベント",desc:"暗い背景と大きな写真で、章を読み進めるように世界観へ引き込む型。体験や空間を売るときに。",best:"イベント・展示・カフェ／バー・ホテル・アパレル・音楽など",fonts:"https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=Noto+Sans+JP:wght@300;400;500&family=Shippori+Mincho:wght@500;600&display=swap",colors:[{id:"accent",label:"光の色",value:"#62d6ff"},{id:"bg",label:"背景",value:"#03070f"},{id:"ink",label:"文字",value:"#e8f1fb"}],slots:[{id:"hero",label:"メイン（横長）",ratio:[16,9],min:1200,max:1920,where:"いちばん上の全面の写真",prompt:"{product}の世界観を表す、暗く幻想的な風景写真。深い青の闇の中に光が差し込み、奥行きがある。映画のワンシーンのような構図、中央は文字を置くため少し暗め。文字やロゴは入れない。横長16:9。",tips:"暗い場所で、光源（照明・窓・ネオン）を画面に入れると世界観が出ます。中央に文字が重なります。"},{id:"ch1",label:"第1章（縦長）",ratio:[2,3],min:600,max:1e3,where:"第1章の写真",prompt:"{product}を象徴するモチーフが、暗闇の中で淡く光っている縦長の写真。神秘的、静か、細部まで美しい。文字は入れない。縦長2:3。",tips:"主役になるモノを1つだけ、暗い背景で撮ると印象に残ります。"},{id:"ch2",label:"第2章（横長）",ratio:[16,9],min:1e3,max:1600,where:"第2章の写真",prompt:"{product}の空間を奥へ続くように見せる写真。左右に光が並ぶ通路、深い青、人の気配は小さく。文字は入れない。横長16:9。",tips:"通路や窓など、奥へ続く線がある場所を真ん中から撮ると引き込まれます。"},{id:"ch3",label:"第3章（縦長）",ratio:[2,3],min:600,max:1e3,where:"第3章の写真",prompt:"{target}の2人が、光る大きな景色を後ろ姿で見上げている縦長の写真。シルエット、静かな感動。顔は写さない。文字は入れない。縦長2:3。",tips:"人は後ろ姿・シルエットにすると、見る人が自分を重ねやすくなります。"},{id:"gal1",label:"ギャラリー1",ratio:[4,3],min:600,max:1e3,where:"ギャラリーの1枚目",prompt:"{product}の楽しみ方の一場面。暗い空間、青い光、上質な雰囲気。文字は入れない。横長4:3。",tips:"体験している場面（飲む・見る・触れる）を3枚そろえると伝わります。"},{id:"gal2",label:"ギャラリー2",ratio:[4,3],min:600,max:1e3,where:"ギャラリーの2枚目",prompt:"{product}に関連する小物のクローズアップ。暗い背景に青い光の反射、上質。文字は入れない。横長4:3。",tips:"アップの写真を1枚入れると、ギャラリーにリズムが出ます。"},{id:"gal3",label:"ギャラリー3",ratio:[4,3],min:600,max:1e3,where:"ギャラリーの3枚目",prompt:"{product}の空間全体が分かる引きの写真。光の演出、人は小さなシルエット。文字は入れない。横長4:3。",tips:"最後は空間全体が分かる引きの写真がおすすめです。"}],fields:[{id:"brand",label:"名前（ブランド・施設）",group:"ファーストビュー",max:20},{id:"heroCopy",label:"キャッチコピー",group:"ファーストビュー",multiline:!0,max:24,hint:"詩のような短い一言。2行まで"},{id:"heroSub",label:"サブコピー",group:"ファーストビュー",multiline:!0,max:60},{id:"ctaLabel",label:"ボタンの文字",group:"ファーストビュー",max:16},{id:"ctaUrl",label:"ボタンのリンク先",group:"ファーストビュー",url:!0},{id:"ch1Label",label:"第1章の小見出し",group:"第1章",max:16,hint:"英語の短い章名（例：Chapter I — Deep）"},{id:"ch1Title",label:"第1章の見出し",group:"第1章",multiline:!0,max:24},{id:"ch1Body",label:"第1章の本文",group:"第1章",multiline:!0,max:120},{id:"ch2Label",label:"第2章の小見出し",group:"第2章",max:16},{id:"ch2Title",label:"第2章の見出し",group:"第2章",multiline:!0,max:24},{id:"ch2Body",label:"第2章の本文",group:"第2章",multiline:!0,max:120},{id:"ch3Label",label:"第3章の小見出し",group:"第3章",max:16},{id:"ch3Title",label:"第3章の見出し",group:"第3章",multiline:!0,max:24},{id:"ch3Body",label:"第3章の本文",group:"第3章",multiline:!0,max:120},{id:"quote",label:"引用・ひとこと",group:"ギャラリー",multiline:!0,max:40,optional:!0},{id:"info1L",label:"案内1の項目",group:"ご案内",max:10,hint:"例：開催期間"},{id:"info1V",label:"案内1の内容",group:"ご案内",multiline:!0,max:50},{id:"info2L",label:"案内2の項目",group:"ご案内",max:10},{id:"info2V",label:"案内2の内容",group:"ご案内",multiline:!0,max:50},{id:"info3L",label:"案内3の項目",group:"ご案内",max:10},{id:"info3V",label:"案内3の内容",group:"ご案内",multiline:!0,max:50},{id:"info4L",label:"案内4の項目",group:"ご案内",max:10,optional:!0},{id:"info4V",label:"案内4の内容",group:"ご案内",multiline:!0,max:50,optional:!0},{id:"closing",label:"最後のひとこと",group:"最後",multiline:!0,max:30},{id:"note",label:"注意書き",group:"最後",multiline:!0,max:120,optional:!0}],css:`.lpb-abyssia{--en:"Cinzel",serif;--min:"Shippori Mincho",serif;font-family:"Noto Sans JP",sans-serif;font-weight:300;background:var(--bg);color:var(--ink);font-size:15px;letter-spacing:.06em;overflow:hidden}
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
.lpb-abyssia .a-info div{grid-template-columns:1fr;gap:4px;padding:18px 4px}.lpb-abyssia .a-close{padding:100px 0}}`,render:({f:e,img:a,link:t,when:i})=>`
<div class="a-hero">
  ${a("hero")}
  ${e("brand","div","a-logo")}
  <div class="a-hero-in">${e("heroCopy","h1")}${e("heroSub","p","a-sub")}${t("ctaLabel","ctaUrl","a-btn")}</div>
  <span class="a-scroll"></span>
</div>
<section><div class="a-wrap a-chap">
  ${a("ch1")}
  <div>${e("ch1Label","span","a-label")}${e("ch1Title","h2","a-h2")}${e("ch1Body","p","a-body")}</div>
</div></section>
<section class="a-wide"><div class="a-wrap">
  ${e("ch2Label","span","a-label")}${e("ch2Title","h2","a-h2")}${e("ch2Body","p","a-body")}
  ${a("ch2")}
</div></section>
<section><div class="a-wrap a-chap rev">
  ${a("ch3")}
  <div>${e("ch3Label","span","a-label")}${e("ch3Title","h2","a-h2")}${e("ch3Body","p","a-body")}</div>
</div></section>
<section><div class="a-wrap">
  <div class="a-gal">${a("gal1")}${a("gal2")}${a("gal3")}</div>
  ${i(["quote"],e("quote","p","a-quote"))}
</div></section>
<section><div class="a-wrap">
  <div class="a-wide"><span class="a-label">Information</span><h2 class="a-h2">ご案内</h2></div>
  <dl class="a-info">
    <div>${e("info1L","dt")}${e("info1V","dd")}</div>
    <div>${e("info2L","dt")}${e("info2V","dd")}</div>
    <div>${e("info3L","dt")}${e("info3V","dd")}</div>
    ${i(["info4L","info4V"],`<div>${e("info4L","dt")}${e("info4V","dd")}</div>`)}
  </dl>
</div></section>
<section class="a-close"><div class="a-wrap">${e("closing","h2","a-h2")}${t("ctaLabel","ctaUrl","a-btn")}</div></section>
<footer>${e("brand","span","a-flogo")}${i(["note"],e("note","p"))}</footer>`}];e.s(["g",0,a,"B",0,e=>a.find(a=>a.id===e)??a[0],"l",0,e=>"abyssia"===e.id],65608)}]);