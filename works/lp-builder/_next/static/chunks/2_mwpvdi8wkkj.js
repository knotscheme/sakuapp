(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,72520,a=>{"use strict";let t=(0,a.i(75254).f)("ArrowRight",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"m12 5 7 7-7 7",key:"xquz4c"}]]);a.s(["f",0,t],72520)},96867,a=>{"use strict";var t=a.i(43476),e=a.i(71645);a.s(["f",0,function({html:a,width:i=1280,height:r,className:o="",title:l="プレビュー",interactive:s=!1,frameRef:n,onLoad:p}){let c=(0,e.useRef)(null),[d,b]=(0,e.useState)(0),[m,f]=(0,e.useState)(0);return(0,e.useEffect)(()=>{let a=c.current;if(!a)return;let t=new ResizeObserver(()=>{b(Math.min(1,a.clientWidth/i)),f(a.clientHeight)});return t.observe(a),()=>t.disconnect()},[i]),(0,t.jsx)("div",{ref:c,className:`relative overflow-hidden ${o}`,style:r?{height:r*d}:void 0,children:d>0&&(0,t.jsx)("iframe",{ref:n,title:l,srcDoc:a,onLoad:p,tabIndex:s?0:-1,className:`absolute left-0 top-0 origin-top-left border-0 bg-white ${s?"":"pointer-events-none"}`,style:{width:i,height:r??(d?m/d:800),transform:`scale(${d})`,left:d<1?0:`calc(50% - ${i/2}px)`},sandbox:"allow-scripts allow-same-origin"})})}])},66339,a=>{"use strict";var t=a.i(43476),e=a.i(22016),i=a.i(72520),r=a.i(75254);let o=(0,r.f)("Camera",[["path",{d:"M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z",key:"1tc9qg"}],["circle",{cx:"12",cy:"13",r:"3",key:"1vg3eu"}]]);var l=a.i(43531);let s=(0,r.f)("MessageCircle",[["path",{d:"M7.9 20A9 9 0 1 0 4 16.1L2 22Z",key:"vv11sd"}]]),n=(0,r.f)("PenLine",[["path",{d:"M12 20h9",key:"t2du7b"}],["path",{d:"M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z",key:"1ykcvy"}]]),p=(0,r.f)("Rocket",[["path",{d:"M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z",key:"m3kijz"}],["path",{d:"m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z",key:"1fmvmk"}],["path",{d:"M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0",key:"1f8sc4"}],["path",{d:"M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5",key:"qeys4"}]]);var c=a.i(83086);let d="/contact/",b=[{icon:n,t:"構成と文章",b:"売りたいもの・届けたい人を聞きとり、伝わる順番と言葉を作ります"},{icon:o,t:"写真・画像",b:"撮影のしかたのご案内や、AIでの画像づくりまでお手伝いします"},{icon:c.f,t:"オリジナルのデザイン",b:"型にない、ブランドだけの見た目と動きを一から作ります"},{icon:p,t:"公開まで",b:"サーバー・WordPress・Shopify への公開や、計測の設定まで"}];a.s(["f",0,function({variant:a="band",from:r=""}){let o=r?`${d}?ref=${r}`:d;return"card"===a?(0,t.jsxs)("aside",{className:"rounded-2xl bg-ink p-5 text-white",children:[(0,t.jsx)("p",{className:"text-[11px] tracking-[.2em] text-accent",children:"ORDER MADE"}),(0,t.jsxs)("h2",{className:"mt-2 text-[16px] font-bold leading-[1.6]",children:["全部おまかせしたい・",(0,t.jsx)("br",{}),"一からオリジナルで作りたい方へ"]}),(0,t.jsx)("p",{className:"mt-2 text-[12.5px] leading-[1.9] text-white/70",children:"文章・写真・デザイン・公開まで、まるごと制作します。"}),(0,t.jsxs)(e.default,{href:o,className:"btn mt-4 w-full bg-white py-3 text-[13.5px] text-ink hover:bg-white/90",children:[(0,t.jsx)(s,{size:15}),"無料で相談する"]})]}):(0,t.jsxs)("section",{className:"relative overflow-hidden rounded-[28px] bg-ink px-5 py-10 text-white sm:px-10 sm:py-14",children:[(0,t.jsx)("div",{"aria-hidden":!0,className:"pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent/25 blur-3xl"}),(0,t.jsx)("div",{"aria-hidden":!0,className:"pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-white/[.06] blur-3xl"}),(0,t.jsxs)("div",{className:"relative grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:items-center",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("p",{className:"text-[12px] tracking-[.22em] text-accent",children:"ORDER MADE"}),(0,t.jsxs)("h2",{className:"mt-3 text-[23px] font-bold leading-[1.5] sm:text-[30px]",children:[(0,t.jsx)("span",{className:"inline-block",children:"全部おまかせしたい。"}),(0,t.jsx)("br",{}),(0,t.jsx)("span",{className:"inline-block",children:"一からオリジナルで"}),(0,t.jsx)("span",{className:"inline-block",children:"作りたい。"})]}),(0,t.jsx)("p",{className:"mt-4 text-[14px] leading-[2] text-white/75",children:"そんな方は、制作をまるごとご依頼ください。型を使わない完全オリジナルのLPも、作品例と同じ作りこみで一から作ります。"}),(0,t.jsx)("ul",{className:"mt-5 space-y-1.5 text-[13px] text-white/80",children:["相談・お見積もりは無料","メールで気軽にやりとり","LP BUILDER で作ったLPの手直しもOK"].map(a=>(0,t.jsxs)("li",{className:"flex items-center gap-2",children:[(0,t.jsx)(l.f,{size:14,className:"text-accent"}),a]},a))}),(0,t.jsxs)(e.default,{href:o,className:"btn btn-accent mt-7 px-7 py-3.5 text-[15px]",children:[(0,t.jsx)(s,{size:17}),"無料で相談する",(0,t.jsx)(i.f,{size:16})]})]}),(0,t.jsx)("ul",{className:"grid grid-cols-2 gap-2.5 sm:gap-3",children:b.map(({icon:a,t:e,b:i})=>(0,t.jsxs)("li",{className:"rounded-2xl bg-white/[.06] p-4 ring-1 ring-white/10 sm:p-5",children:[(0,t.jsx)(a,{size:20,className:"text-accent"}),(0,t.jsx)("h3",{className:"mt-3 text-[15px] font-bold",children:e}),(0,t.jsx)("p",{className:"mt-1.5 text-[12.5px] leading-[1.85] text-white/70",children:i})]},e))})]})]})}],66339)},28365,a=>{"use strict";function t(a){return a.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;").replace(/\{/g,"&#123;").replace(/\}/g,"&#125;")}let e=a=>t(a).replace(/[*＊]([^*＊\n]+)[*＊]/g,"<em>$1</em>").replace(/\r?\n/g,"<br>");function i(a){let t=a.trim();return t?/^(https?:\/\/|mailto:|tel:|#|\/)/i.test(t)?t:/^[\w.-]+\.[a-z]{2,}(\/|$)/i.test(t)?`https://${t}`:"#":"#"}let r=(a,t)=>a.colors.map(a=>`--${a.id}:${/^#[0-9a-f]{3,8}$/i.test(t.colors[a.id]??"")?t.colors[a.id]:a.value}`).join(";"),o=`.lpb{box-sizing:border-box;-webkit-text-size-adjust:100%;line-break:strict;overflow-wrap:anywhere;-webkit-font-smoothing:antialiased;position:relative;overflow-x:clip}
.lpb *,.lpb *::before,.lpb *::after{box-sizing:border-box}
.lpb img{display:block;max-width:100%}
.lpb a{color:inherit;text-decoration:none}
.lpb h1,.lpb h2,.lpb h3,.lpb p,.lpb figure,.lpb ul,.lpb ol,.lpb dl,.lpb dd{margin:0}
.lpb h1,.lpb h2,.lpb h3,.lpb .lpb-keep{word-break:auto-phrase}
.lpb details summary{cursor:pointer;list-style:none}.lpb details summary::-webkit-details-marker{display:none}
.lpb em{font-style:normal}
.lpb.lpb-edit .rv,.lpb.lpb-edit .ph{transition-duration:.01s!important}`,l=`root.classList.add("lpb-js");var EDIT=root.classList.contains("lpb-edit"),RED=matchMedia("(prefers-reduced-motion:reduce)").matches;
var IO=("IntersectionObserver" in window)&&!EDIT?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("on");IO.unobserve(e.target)}})},{rootMargin:"0px 0px -10% 0px"}):null;
function watch(sel){root.querySelectorAll(sel).forEach(function(el){IO?IO.observe(el):el.classList.add("on")})}
watch(".rv");setTimeout(function(){root.classList.add("on")},EDIT?0:250);`,s=`[data-f]{outline:1px dashed transparent;outline-offset:3px;border-radius:2px;cursor:text;transition:outline-color .2s}
[data-f]:hover{outline-color:rgba(37,99,235,.55)}[data-f]:focus{outline:2px solid #2563eb}
[data-f]:empty::before{content:attr(data-ph);opacity:.35}
img[data-s]{cursor:pointer;transition:filter .2s}img[data-s]:hover{filter:brightness(.82)}`;function n(a,s,n,p){let c,d,b,m=`lpb lpb-${a.id}${"edit"===p?" lpb-edit":""}`,f=`<div class="${m}" style="${r(a,s)}">${a.render((c=a=>s.fields[a]??"",d=t=>a.fields.find(a=>a.id===t)?.label??t,b="edit"===p,{f:(a,i="span",r="")=>`<${i}${r?` class="${r}"`:""}${b?` data-f="${a}" data-ph="${t(d(a))}"`:""}>${e(c(a))}</${i}>`,img:(e,i="")=>{let r=a.slots.find(a=>a.id===e),o=n(e);if(!o)return"";let l=r?r.max:1200,s=r?Math.round(r.max*r.ratio[1]/r.ratio[0]):800,p=a.slots[0]?.id===e;return`<img class="lpb-img${i?` ${i}`:""}" src="${o}" alt="${t(r?.label??"")}" width="${l}" height="${s}" ${p?'fetchpriority="high"':'loading="lazy"'} decoding="async"${b?` data-s="${e}"`:""}>`},link:(a,r,o="")=>`<a class="${o}" href="${t(i(c(r)))}"${b?` data-f="${a}" data-ph="${t(d(a))}" data-u="${r}"`:""}>${e(c(a))}</a>`,when:(a,t)=>b||a.some(a=>c(a).trim())?t:"",v:a=>t(c(a)),has:a=>!!n(a)}))}</div>`;return{css:`${o}
${a.css}`,body:f,fonts:a.fonts,js:`<script>(function(){document.querySelectorAll(".lpb-${a.id}").forEach(function(root){if(root.dataset.lpbOn)return;root.dataset.lpbOn="1";${l}
${a.js??""}})})();</script>`}}let p=a=>(a.fields.brand||a.info.brand||"LP").replace(/[*＊]/g,"").trim();a.s(["e",0,r,"w",0,function(a,e,i=!1){let r=Math.round(1200*e[1]/e[0]),o=i?"#7f93ad":"#8b8a85",l=Math.round(Math.min(1200,r)/11),s=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="${r}" viewBox="0 0 1200 ${r}"><rect width="100%" height="100%" fill="${i?"#0d1726":"#ecebe7"}"/><rect x="24" y="24" width="1152" height="${r-48}" fill="none" stroke="${o}" stroke-opacity=".35" stroke-width="3" stroke-dasharray="14 12"/><text x="50%" y="48%" fill="${o}" font-family="sans-serif" font-size="${l}" text-anchor="middle">${t(a)}</text><text x="50%" y="${48+100/7}%" fill="${o}" font-family="sans-serif" font-size="${Math.round(.6*l)}" text-anchor="middle" opacity=".8">${e[0]}:${e[1]}</text></svg>`;return`data:image/svg+xml;charset=utf-8,${encodeURIComponent(s)}`},"r",0,function(a,t,e){let{css:i,body:r,fonts:o,js:l}=n(a,t,e,"edit"),p=`(function(){var P=parent;
function esc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
function fmt(s){return esc(s).replace(/[*＊]([^*＊\\n]+)[*＊]/g,'<em>$1</em>').replace(/\\r?\\n/g,'<br>')}
function ser(el){var s='';el.childNodes.forEach(function(n){if(n.nodeType===3)s+=n.nodeValue;else if(n.nodeName==='BR')s+='\\n';else if(n.nodeName==='EM')s+='*'+n.textContent+'*';else if(n.nodeName==='DIV'||n.nodeName==='P')s+=(s?'\\n':'')+ser(n);else s+=ser(n)});return s}
document.querySelectorAll('[data-f]').forEach(function(el){try{el.contentEditable='plaintext-only'}catch(e){el.contentEditable='true'}
el.addEventListener('input',function(){var id=el.dataset.f,v=ser(el).replace(/\\n$/,'');document.querySelectorAll('[data-f="'+id+'"]').forEach(function(o){if(o!==el)o.innerHTML=fmt(v)});P.postMessage({lpb:'field',id:id,value:v},'*')});
el.addEventListener('paste',function(e){e.preventDefault();document.execCommand('insertText',false,(e.clipboardData||window.clipboardData).getData('text'))})});
document.querySelectorAll('details').forEach(function(d){d.open=true});
document.addEventListener('click',function(e){if(e.target.closest('summary [data-f]'))e.preventDefault();var a=e.target.closest('a');if(a)e.preventDefault();var im=e.target.closest('img[data-s]');if(im)P.postMessage({lpb:'slot',id:im.dataset.s},'*')});
window.addEventListener('message',function(e){var d=e.data||{};if(d.lpb==='set'){document.querySelectorAll('[data-f="'+d.id+'"]').forEach(function(o){if(document.activeElement!==o)o.innerHTML=fmt(d.value)})}
if(d.lpb==='url'){document.querySelectorAll('[data-u="'+d.id+'"]').forEach(function(o){o.setAttribute('href',d.value)})}
if(d.lpb==='img'){document.querySelectorAll('img[data-s="'+d.id+'"]').forEach(function(o){o.src=d.value})}
if(d.lpb==='vars'){document.querySelector('.lpb').setAttribute('style',d.value)}
if(d.lpb==='scroll'){var el=document.querySelector('[data-s="'+d.id+'"],[data-f="'+d.id+'"]');if(el){var r=el.getBoundingClientRect();window.scrollTo({top:scrollY+r.top-innerHeight/2+r.height/2,behavior:'smooth'})}}});
document.addEventListener('keydown',function(e){if(e.key==='Escape')P.postMessage({lpb:'esc'},'*')});
P.postMessage({lpb:'ready'},'*')})();`;return`<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="${o}"><style>body{margin:0}${i}
${s}</style></head><body>${r}${l}<script>${p}</script></body></html>`},"v",0,i,"s",0,function(a,e,i){let{css:r,body:o,fonts:l,js:s}=n(a,e,a=>{let t=i(a);return t?`{{ '${t}' | asset_url }}`:""},"export"),c=`LP ${a.name}`.slice(0,25);return`{% comment %}${t(p(e))}：LP BUILDER で作成したセクションです{% endcomment %}
<link rel="stylesheet" href="${l}">
<style>
${r}
</style>
${o}
${s}

{% schema %}
${JSON.stringify({name:c,tag:"section",class:"lpb-section",settings:[],presets:[{name:c}]},null,2)}
{% endschema %}
`},"t",0,function(a,e,i){let{css:r,body:o,fonts:l,js:s}=n(a,e,i,"export");return`<!-- ${t(p(e))}：LP BUILDER で作成（WordPress のカスタムHTMLブロックに、このまま貼り付けます） -->
<link rel="stylesheet" href="${l}">
<style>
${r}
</style>
${o}
${s}
`},"H",0,function(a,e,i,r){let{css:o,body:l,fonts:s,js:c}=n(a,e,i,"export"),d=t(p(e)),b=t((e.fields.heroSub||e.fields.lead||e.fields.heroCopy||"").replace(/[*＊]/g,"").replace(/\s+/g," ").trim().slice(0,120));return`<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${d}</title>
<meta name="description" content="${b}">
<meta property="og:type" content="website">
<meta property="og:title" content="${d}">
<meta property="og:description" content="${b}">
<meta property="og:image" content="${r}">
<meta name="twitter:card" content="summary_large_image">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${s}">
<style>
html{scroll-behavior:smooth}body{margin:0}
${o}
</style>
</head>
<body>
${l}
${c}
</body>
</html>
`},"_",0,function(a,t,e){let{css:i,body:r,fonts:o,js:l}=n(a,t,e,"export");return`<!doctype html><html lang="ja"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="${o}"><style>html{scroll-behavior:smooth}body{margin:0}${i}</style><script>document.addEventListener('click',function(e){var a=e.target.closest('a');if(a&&!/^#/.test(a.getAttribute('href')||''))e.preventDefault()});document.addEventListener('keydown',function(e){if(e.key==='Escape')parent.postMessage({lpb:'esc'},'*')})</script></head><body>${r}${l}</body></html>`}])},85287,a=>{"use strict";var t=a.i(28365),e=a.i(50276),i=a.i(65608);a.s(["f",0,function(a){let r=e.n.find(t=>t.id===a),o=(0,i.B)(r.tpl),l={v:1,tpl:o.id,info:r.info,fields:r.fields,colors:{...Object.fromEntries(o.colors.map(a=>[a.id,a.value])),...r.colors},imgs:{},updated:0},s="u">typeof location?location.origin:"";return(0,t._)(o,l,a=>r.imgs[a]?`${s}${(0,e.t)(r.imgs[a])}`:"")}])},50276,a=>{"use strict";a.i(47167),a.s(["n",0,[{id:"sorae",tpl:"sorae",title:"SORAE セラミドローション",lead:"保湿化粧水のLP。浮かぶボトルと泡、1語ずつ浮かぶメッセージ、横に流れる成分カードで、澄んだ心地よさを伝えます。",info:{brand:"SORAE",product:"2種のセラミドを配合した保湿化粧水",target:"乾燥・ハリ・キメが気になる30〜40代の女性",strengths:"ヒト型セラミドと天然セラミド、CICA・ヒト幹細胞培養液・植物エキス、8つのフリー処方、国内工場で製造、30日間返金保証",tone:"透明感があり、やさしく上品に",price:"初回限定 2,640円（税込）",url:"#price"},fields:{brand:"SORAE",kick:"CERAMIDE LOTION",heroCopy:"澄んだ水のように、\nうるおいを満たす。",lead:"2種のセラミドを高濃度で配合した、贅沢な保湿化粧水。乾燥しがちな肌に、すっとなじんで、ふっくらと。",ctaLabel:"初回限定で試す",ctaUrl:"#price",ctaNote:"30日間 返金保証つき",tag1:"CERAMIDE",tag2:"CICA",tag3:"8 FREE",marquee:"CERAMIDE、CICA、HUMAN STEM CELL、8 FREE、MADE IN JAPAN",statement:"毎日の 化粧水を、 もっと *澄んだ* ものに。 肌が よろこぶ *うるおいを、* あたりまえの 習慣へ。",forTitle:"こんな方に、おすすめです。",for1T:"乾燥しやすい肌",for1B:"季節の変わり目に、つっぱりを感じる方に",for2T:"ハリが気になる肌",for2B:"ふっくら、やわらかな肌をめざしたい方に",for3T:"キメを整えたい肌",for3B:"なめらかな手ざわりを大切にしたい方に",ringNum:"80",ringUnit:"%",ringCap:"美容成分の配合率（サンプル）",keyLabel:"CERAMIDE",keyTitle:"2つのセラミドで、\nうるおいを抱えこむ。",keyBody:"肌にもともとある成分に近い「ヒト型セラミド」と、植物由来の「天然セラミド」。性質のちがう2種を組み合わせ、うるおいを長く保ちます。",duo1T:"ヒト型セラミド",duo1B:"肌なじみのよい保湿成分",duo2T:"天然セラミド",duo2B:"植物由来のやさしい保湿",igTitle:"肌を想う、3つの美容成分",ig1E:"CICA",ig1T:"ツボクサエキス",ig1B:"ゆらぎがちな肌をすこやかに保ち、毎日のコンディションを整えます。",ig2E:"HUMAN STEM CELL",ig2T:"ヒト幹細胞培養液",ig2B:"肌のキメを整え、ハリのある印象へ。年齢に応じたケアに。",ig3E:"BOTANICAL",ig3T:"4種の植物エキス",ig3B:"マンダリン、キャベツ、熟成酒粕、シアバター。天然由来の保湿成分。",freeLabel:"8 FREE",freeTitle:"入れないことも、やさしさ。",freeSub:"肌への負担を考え、8つの成分を使わない処方にしました。",freeList:"パラベン、鉱物油、シリコン、合成着色料、合成香料、合成染料、紫外線吸収剤、石油系界面活性剤",qcTitle:"出荷の前に、\n一本ずつ目で確かめて。",qcBody:"国内の工場で、容器の傷や中身の状態までチェックしています。",made1N:"JAPAN",made1B:"品質管理を徹底した、国内の工場で製造しています。",made2N:"30",made2U:"days",made2B:"開封済みでも、30日以内なら返品・返金を承ります。",howTitle:"洗顔のあと、すぐに。",howCap:"500円玉大が目安",how1T:"手のひらに、500円玉大",how1B:"適量を手のひらに取ります",how2T:"顔全体になじませる",how2B:"内側から外側へ、やさしく",how3T:"ハンドプレスで、ふたを",how3B:"手のひらで包みこむように",priceTitle:"はじめての方に。",priceTag:"初回限定",priceName:"セラミド ローション 150mL",priceOld:"5,280",price:"2,640",priceUnit:"円（税込）",pt1:"2回目以降も 10%OFF でお届け",pt2:"送料無料",pt3:"回数のしばりなし・いつでも解約OK",guarN:"30",guarT:"30日間 返金保証",guarB:"肌に合わなかった場合、開封後でも30日以内なら返金いたします。",faq1Q:"敏感肌でも使えますか？",faq1A:"8つのフリー処方で、肌へのやさしさを大切にしています。気になる方は、腕の内側などで試してからお使いください。",faq2Q:"1本でどのくらい使えますか？",faq2A:"朝晩のご使用で、約1か月分です。",faq3Q:"定期便はいつでも解約できますか？",faq3A:"回数のしばりはありません。次回お届け日の7日前までのご連絡で解約できます。",endTitle:"うるおいで、\n空気まで澄んでいく。",endSub:"初回限定 2,640円（税込）・30日間返金保証",floatLabel:"初回限定 2,640円で試す",note:"© SORAE（LP BUILDER の作品例・架空のブランドです）"},imgs:{bottle:"sorae/bottle.webp",face:"sorae/face.webp",qc:"sorae/qc.webp",use:"sorae/use.webp"}},{id:"craft",tpl:"craft",title:"CRAFT OEM 革財布のロゴ入れ",lead:"革小物のロゴ入れOEMのLP。商品の後ろを通るブランド名、光の粒のように集まる想い、場面が切り替わる職人の工程で、物語から申し込みへ導きます。",info:{brand:"CRAFT OEM",product:"本革の財布・革小物へのロゴ入れOEM",target:"自分のブランドを作りたい個人・小さなお店",strengths:"型代0円、30個から、最短30日、職人が国内で手作業・全数検品、金箔・銀箔・素押し",tone:"上質で誠実に",price:"1個 1,800円〜",url:"#craft-contact"},fields:{brand:"CRAFT OEM",word:"CRAFT",kick:"LOGO OEM FOR LEATHER GOODS",heroCopy:"あなたのロゴで、\n*上質な革財布*を。",badges:"型代 0円｜30個から｜最短30日",ctaLabel:"無料で見積もる",ctaUrl:"#craft-contact",cta2Label:"ベースモデルを見る",cta2Url:"#craft-models",statement:"革に、 あなたの *名前を* 刻む。\nその ひと押しから、\n*ブランドが* はじまる。",craftTitle:"ロゴひとつにも、\n職人の手を。",craftBody:"型は定番でも、仕上がりは妥協しません。革選びから検品まで、職人が一貫して手がけます。",s1E:"Select",s1T:"革を選ぶ",s1B:"一枚ごとに表情の違う革を、職人が手で確かめて選別。キズや厚みのムラがない部分だけを使います。",s2E:"Sew",s2T:"縫い上げる",s2B:"革専用のミシンで、ひと針ずつ均一に。ステッチの美しさが、財布の印象を決めます。",s3E:"Stamp",s3T:"ロゴを刻む",s3B:"温度と圧を革ごとに見極め、あなたのロゴを1点ずつ箔押し・刻印します。",s4E:"Inspect",s4T:"検品して届ける",s4B:"ロゴのかすれ・ズレ・縫製まで国内で全数検品。すぐに販売できる状態でお届けします。",actBreak:"ここからは、はじめ方のご案内です。",painTitle:"こんな壁に、ぶつかっていませんか？",pain1:"型紙から作ると、型代やサンプル代だけで数十万円かかる",pain2:"仕様書の作り方が分からず、何から始めればいいか迷う",pain3:"まずは小ロットで、テスト販売から始めたい",painEnd:"「ロゴ入れOEM」なら、すべて解決できます。",whyTitle:"選ばれる3つの理由",why1T:"型代・設計費は0円",why1B:"販売実績のある型を使うため、型代・設計費はかかりません。必要なのはロゴの版代1万円（初回のみ）だけです。",why2T:"定番の型 × 上質なロゴ加工",why2B:"定番のベースから選び、素押し・金箔・銀箔でロゴを入れます。シンプルな型だからこそ、ロゴが映えます。",why3T:"最短30日で販売開始",why3B:"設計・試作の期間をまるごとカット。ロゴデータをいただいてから最短30日でお届けします。",mTitle:"ベースモデル",mSub:"販売実績のある定番型から選べます。",m1N:"ラウンド長財布",m1F:"カード12枚・小銭入れ・札入れ2層。ギフト需要が最も高い定番型。",m1S:"W19.5 × H10 × D2.5cm",m1P:"3,500円〜",m2N:"二つ折り財布",m2F:"カード6枚と札入れに絞った薄型設計。メンズ・ユニセックスに人気。",m2S:"W11 × H9.5 × D1.5cm",m2P:"2,800円〜",m3N:"三つ折りミニ財布",m3F:"手のひらサイズに必要十分を収納。小さいバッグ派の女性に。",m3S:"W10 × H7.5 × D3cm",m3P:"2,400円〜",m4N:"フラグメントケース",m4F:"カード・紙幣・鍵を入れる極薄ケース。名入れノベルティにも。",m4S:"W10.5 × H7.5 × D0.6cm",m4P:"1,800円〜",m5N:"トートバッグ",m5F:"A4が入る、仕事にも休日にも使える定番トート。",m5S:"W38 × H30 × D12cm",m5P:"6,800円〜",m6N:"スマホショルダー",m6F:"スマホとカードを入れて斜めがけできる、小さなバッグ。",m6S:"W11 × H18 × D3cm",m6P:"3,200円〜",mNote:"※参考価格はロゴ加工（素押し）込み・30個発注時の目安です。",opTitle:"ロゴ加工",opSub:"加工ひとつで、印象は大きく変わります。",op1N:"素押し",op1E:"Blind",op1B:"熱と圧で革そのものに刻む、控えめで上品な仕上げ。使うほどに馴染みます。",op2N:"金箔押し",op2E:"Gold foil",op2B:"真鍮色の箔で、ロゴを華やかに。ギフト向けのブランドに選ばれています。",op3N:"銀箔押し",op3E:"Silver foil",op3B:"シャープで洗練された印象に。ネイビーやブラックの革と相性のよい仕上げです。",optT:"オリジナル化粧箱",optB:"ロゴ入りの箱で、開けた瞬間からブランドの世界観を。",spT:"完全オリジナル設計（ODM）も対応",spB:"ポケット配置の変更や、オリジナルの型作成も可能です（別途、型代・設計費がかかります）。",flowTitle:"ご注文までの3ステップ",f1T:"モデルとロゴを送る",f1B:"ご希望のベースモデルを選び、ロゴデータをお送りください。",f2T:"配置イメージとお見積もり",f2B:"実寸の配置イメージと正式なお見積もりを、最短2営業日でご提出します。",f3T:"生産・検品・納品",f3B:"ご発注後に生産を開始。国内で1点ずつ検品してからお届けします。",q1Q:"最低ロット数は何個からですか？",q1A:"1モデルあたり30個から承ります。色違いを組み合わせる場合は、1色15個からご相談いただけます。",q2Q:"ロゴデータはどの形式で送ればいいですか？",q2A:"Illustrator（.ai）またはPDF・SVGのベクターデータが最適です。画像しかない場合も、トレースしてデータ化いたします。",q3Q:"型代のほかにかかる費用はありますか？",q3A:"ロゴを押すための版代が、1デザインにつき1万円（初回のみ）かかります。型代・設計費は0円です。",q4Q:"納期はどのくらいですか？",q4A:"ロゴ配置のご確認後、最短30日で納品いたします。",contactTitle:"無料見積もり・ご相談",contactSub:"ロゴが未完成でも、お気軽にどうぞ。",floatLabel:"無料で相談する",footSub:"革財布・革小物のロゴ入れOEM",note:"※LP BUILDER の作品例です。社名・価格は架空のものです。"},imgs:{hero:"craft/hero-pc.webp",heroCut:"craft/hero-pc-cut.webp",heroSp:"craft/hero-sp.webp",heroSpCut:"craft/hero-sp-cut.webp",step1:"craft/craft-select.webp",step2:"craft/craft-sew.webp",step3:"craft/craft-press.webp",step4:"craft/craft-inspect.webp",m1:"craft/model-long.webp",m2:"craft/model-bifold.webp",m3:"craft/model-trifold.webp",m4:"craft/model-fragment.webp",m5:"craft/model-tote.webp",m6:"craft/model-phone.webp",op1:"craft/finish-blind.webp",op2:"craft/finish-gold.webp",op3:"craft/finish-silver.webp",opt:"craft/giftbox.webp"}},{id:"abyssia",tpl:"abyssia",title:"ABYSSIA 光で泳ぐ深海の美術館",lead:"夜の水族館のLP。深い青を光の粒と魚の群れが泳ぎ、スクロールで深さが変わる。ゾーンを巡るように読み進めてチケットへ。",info:{brand:"ABYSSIA",product:"大人のためのデジタル水族館",target:"大人のカップル・友人同士",strengths:"光るクラゲの回廊、深海の生き物、魚の群れの大水槽、光の海、夜のバー",tone:"静かで、幻想的に",price:"デイ ¥3,200／ナイト ¥4,800",url:"#abyssia-ticket"},fields:{brand:"ABYSSIA",kick:"DIGITAL AQUARIUM",heroSub:"光で泳ぐ、深海の美術館。",scroll:"SCROLL TO DIVE",statement:"日常の 音が 遠のいていく。 ここは、 *光だけが* 呼吸する 場所。 静かに、 *深く、* 潜っていく 夜を。",marquee:"Jellyfish Corridor、Abyssal Light、The Vortex、Sea of Light",z1No:"ZONE 01",z1En:"JELLYFISH CORRIDOR",z1T:"漂う光の、\n回廊を*歩く。*",z1B:"四十の水槽に揺れる、千のクラゲ。足音さえ吸い込まれる通路で、光のリズムに呼吸を合わせる。",z1m1:"DEPTH",z1v1:"−50m",z1m2:"SPECIES",z1v2:"24",z2No:"ZONE 02",z2En:"ABYSSAL LIGHT",z2T:"光の届かない場所で、\n生まれる*光。*",z2B:"水深一〇〇〇メートル。自ら光る生き物たちの姿を、暗闇のなかで、ひとつずつ。",z2m1:"DEPTH",z2v1:"−1000m",z2m2:"TEMP",z2v2:"2°C",z3No:"ZONE 03",z3En:"THE VORTEX",z3T:"一万の群れが、\nひとつの*渦*になる。",z3B:"円形の大水槽を巡る、銀の群れ。見上げるたびに形を変える、生きた彫刻。",z3m1:"DEPTH",z3v1:"−200m",z3m2:"FISH",z3v2:"10,000+",fullNo:"ZONE 04",fullEn:"SEA OF LIGHT",fullT:"あなたの足もとから、\n海が広がっていく。",nightNo:"AFTER DARK",nightEn:"NIGHT AQUARIUM",nightT:"水槽の灯りで、\n*一杯*だけ。",nightB:"夜八時を過ぎると、館内はバーに変わる。深海をモチーフにしたカクテルと、ゆっくり流れる音楽を。",t1L:"Night Aquarium",t1V:"20:00 — 23:00",t2L:"Abyss Bar",t2V:"20:30 — 23:00 L.O.",t3L:"対象",t3V:"20歳以上",ckCap:"Signature — *Abyss Blue*",pairNo:"FOR TWO",pairEn:"PAIR TICKET",pairT:"言葉の要らない、\nふたりの*深海。*",pairB:"見上げた先を、エイがゆっくり横切っていく。静けさを分け合う夜に。",tkTitle:"深海への、入口。",tk1E:"DAY",tk1N:"デイチケット",tk1P:"¥3,200",tk1U:"/ 1名",tk1B:"10:00 — 18:00\nすべての展示ゾーン",tk2E:"NIGHT",tk2N:"ナイトチケット",tk2P:"¥4,800",tk2U:"/ 1名",tk2B:"20:00 — 23:00\nワンドリンク付き・20歳以上",tk3E:"PAIR",tk3N:"ペアナイトチケット",tk3P:"¥8,800",tk3U:"/ 2名",tk3B:"20:00 — 23:00\nドリンク2杯・優先入場",tkNote:"※ 架空の施設のため、料金・時間はすべてサンプルです。",acT:"水辺に浮かぶ、\n光の*箱。*",ac1L:"OPEN",ac1V:"10:00 — 23:00（火曜休館）",ac2L:"PLACE",ac2V:"ベイエリア・ウォーターフロント（架空）",ac3L:"STATION",ac3V:"最寄り駅から徒歩6分（架空）",endLabel:"ASCEND",endTitle:"Return to the light.",ctaLabel:"チケットを予約する",ctaUrl:"#abyssia-ticket",note:"© ABYSSIA — LP BUILDER の作品例（架空の施設です）"},imgs:{hero:"abyssia/jelly.webp",z1:"abyssia/corridor.webp",z2:"abyssia/deep.webp",z3:"abyssia/vortex.webp",full:"abyssia/art.webp",bar:"abyssia/bar.webp",cocktail:"abyssia/cocktail.webp",pair:"abyssia/couple.webp",place:"abyssia/building.webp",end:"abyssia/surface.webp"}}],"t",0,a=>`/sakuapp/works/lp-builder/samples/${a}`])},65608,a=>{"use strict";let t=a=>a.split(/[、,，\n]+/).map(a=>a.trim()).filter(Boolean),e=[{id:"sorae",name:"SORAE",kind:"化粧品・スキンケア",desc:"透きとおる光と泡、ふわっと浮かぶボトル。やさしく澄んだ世界観で、スキンケアの心地よさを伝える型です。",best:"化粧水・美容液・ヘアケア・サプリ・アロマなど",fonts:"https://fonts.googleapis.com/css2?family=Jost:wght@200;300;400&family=Noto+Sans+JP:wght@200;300;400;500&display=swap",colors:[{id:"ac",label:"アクセント",value:"#7b8fd6"},{id:"ink",label:"文字・ボタン",value:"#2a3243"},{id:"sky",label:"光の色1",value:"#cfe3f5"},{id:"lav",label:"光の色2",value:"#ddd6f3"},{id:"bg",label:"背景",value:"#fbfcfe"}],slots:[{id:"bottle",label:"商品（白背景・縦長）",ratio:[5,16],min:300,max:720,where:"ファーストビューに浮かぶ商品",prompt:"{product}のボトルを1本だけ、真正面から撮った商品写真。背景は真っ白で影なし、ボトル全体が縦いっぱいに入る、ラベルがはっきり読める、清潔で上品なスキンケアの広告写真。ボトル以外は何も写さない。縦長。",tips:"白い紙の前で真正面から。背景を消した「切り抜き画像（PNG）」を入れると、背景の光の上に商品が浮かんで、いちばんきれいに見えます。"},{id:"face",label:"人物（縦長）",ratio:[1,2],min:400,max:900,where:"メッセージの後ろにうっすら見える写真",prompt:"{target}の女性が、目を閉じて頬に両手を当てている。素肌感、白い服、明るく白い背景、やわらかい光。上半身、縦長。文字は入れない。",tips:"上に文字が重なるので、背景は白っぽく明るい写真が合います。肖像の使用許可を必ず取ってください。"},{id:"qc",label:"品質チェック（横長）",ratio:[4,3],min:700,max:1200,where:"「8 FREE」の下の写真",prompt:"清潔な白い検査室で、白衣・帽子・手袋の検査員が、ルーペで{product}のボトルを1本ずつ確かめている。明るい自然光、信頼感。顔ははっきり写さない。文字は入れない。横長4:3。",tips:"製造・検品・梱包の様子があれば一番説得力があります。原料や道具を並べた写真でも代わりになります。"},{id:"use",label:"使い方（手元・縦長）",ratio:[3,4],min:500,max:900,where:"「使い方」の、上が丸い写真",prompt:"手のひらに{product}を少量出しているクローズアップ。白い背景、やわらかい光、肌の質感がきれい。縦長3:4。文字は入れない。",tips:"手のひらを真上から。上が丸く切り抜かれるので、手元は写真の真ん中より少し下に。"}],fields:[{id:"brand",label:"ブランド名",group:"ファーストビュー",max:16,hint:"ロゴの代わりに出すブランド名（英字がおすすめ）"},{id:"kick",label:"上の小さな英字",group:"ファーストビュー",max:30,hint:"商品の種類を英語で（例：CERAMIDE LOTION）"},{id:"heroCopy",label:"キャッチコピー（2行）",group:"ファーストビュー",multiline:!0,max:24,hint:"2行のキャッチコピー。1行ずつ改行。2行目は色が変わる"},{id:"lead",label:"サブコピー",group:"ファーストビュー",multiline:!0,max:70},{id:"ctaLabel",label:"ボタンの文字",group:"ファーストビュー",max:14},{id:"ctaUrl",label:"ボタンのリンク先",group:"ファーストビュー",url:!0},{id:"ctaNote",label:"ボタン横の小さな文字",group:"ファーストビュー",max:20,optional:!0,hint:"例：30日間 返金保証つき"},{id:"tag1",label:"浮かぶラベル1",group:"ファーストビュー",max:14,hint:"商品の特長を英語の短い単語で"},{id:"tag2",label:"浮かぶラベル2",group:"ファーストビュー",max:14},{id:"tag3",label:"浮かぶラベル3",group:"ファーストビュー",max:14},{id:"marquee",label:"流れる文字（、で区切る）",group:"ファーストビュー",max:90,hint:"横に流れるキーワード（英字）を、、で区切って5つほど"},{id:"statement",label:"メッセージ（言葉ごとに空白）",group:"メッセージ",multiline:!0,max:60,hint:"読み進めると1語ずつ浮かぶ文章。言葉と言葉の間に空白を入れ、色を変えたい言葉は＊で囲む"},{id:"forTitle",label:"おすすめの見出し",group:"こんな方に",max:20},{id:"for1T",label:"おすすめ1",group:"こんな方に",max:14},{id:"for1B",label:"おすすめ1の説明",group:"こんな方に",max:30},{id:"for2T",label:"おすすめ2",group:"こんな方に",max:14},{id:"for2B",label:"おすすめ2の説明",group:"こんな方に",max:30},{id:"for3T",label:"おすすめ3",group:"こんな方に",max:14},{id:"for3B",label:"おすすめ3の説明",group:"こんな方に",max:30},{id:"ringNum",label:"円の中の数字",group:"主役の成分",max:4,hint:"数字だけ（例：80）。事実として言える数字だけ"},{id:"ringUnit",label:"数字の単位",group:"主役の成分",max:4},{id:"ringCap",label:"数字の説明",group:"主役の成分",max:24},{id:"keyLabel",label:"成分の英字",group:"主役の成分",max:20},{id:"keyTitle",label:"成分の見出し",group:"主役の成分",multiline:!0,max:30},{id:"keyBody",label:"成分の説明",group:"主役の成分",multiline:!0,max:110},{id:"duo1T",label:"小さなカード1",group:"主役の成分",max:14},{id:"duo1B",label:"カード1の説明",group:"主役の成分",max:18},{id:"duo2T",label:"小さなカード2",group:"主役の成分",max:14},{id:"duo2B",label:"カード2の説明",group:"主役の成分",max:18},{id:"igTitle",label:"美容成分の見出し",group:"美容成分",max:22},{id:"ig1E",label:"成分1の英字",group:"美容成分",max:20},{id:"ig1T",label:"成分1の名前",group:"美容成分",max:16},{id:"ig1B",label:"成分1の説明",group:"美容成分",multiline:!0,max:50},{id:"ig2E",label:"成分2の英字",group:"美容成分",max:20},{id:"ig2T",label:"成分2の名前",group:"美容成分",max:16},{id:"ig2B",label:"成分2の説明",group:"美容成分",multiline:!0,max:50},{id:"ig3E",label:"成分3の英字",group:"美容成分",max:20},{id:"ig3T",label:"成分3の名前",group:"美容成分",max:16},{id:"ig3B",label:"成分3の説明",group:"美容成分",multiline:!0,max:50},{id:"freeLabel",label:"使わない成分の英字",group:"使わない成分",max:12},{id:"freeTitle",label:"使わない成分の見出し",group:"使わない成分",max:22},{id:"freeSub",label:"使わない成分の説明",group:"使わない成分",max:40},{id:"freeList",label:"使わない成分（、で区切る・8つ）",group:"使わない成分",multiline:!0,max:80,hint:"使っていない成分を、、で区切って8つ"},{id:"qcTitle",label:"品質の見出し",group:"使わない成分",multiline:!0,max:24},{id:"qcBody",label:"品質の説明",group:"使わない成分",multiline:!0,max:50},{id:"made1N",label:"大きな文字1",group:"使わない成分",max:8,hint:"例：JAPAN"},{id:"made1B",label:"大きな文字1の説明",group:"使わない成分",max:40},{id:"made2N",label:"大きな文字2",group:"使わない成分",max:8,hint:"例：30"},{id:"made2U",label:"大きな文字2の単位",group:"使わない成分",max:6},{id:"made2B",label:"大きな文字2の説明",group:"使わない成分",max:40},{id:"howTitle",label:"使い方の見出し",group:"使い方",max:20},{id:"howCap",label:"写真の上の小さな文字",group:"使い方",max:14,optional:!0},{id:"how1T",label:"手順1",group:"使い方",max:16},{id:"how1B",label:"手順1の説明",group:"使い方",max:20},{id:"how2T",label:"手順2",group:"使い方",max:16},{id:"how2B",label:"手順2の説明",group:"使い方",max:20},{id:"how3T",label:"手順3",group:"使い方",max:16},{id:"how3B",label:"手順3の説明",group:"使い方",max:20},{id:"priceTitle",label:"価格の見出し",group:"価格",max:20},{id:"priceTag",label:"価格の上のラベル",group:"価格",max:10,optional:!0},{id:"priceName",label:"商品名と容量",group:"価格",max:24},{id:"priceOld",label:"通常価格（取り消し線）",group:"価格",max:10,optional:!0},{id:"price",label:"価格（数字）",group:"価格",max:10},{id:"priceUnit",label:"価格の単位",group:"価格",max:10},{id:"pt1",label:"価格の特典1",group:"価格",max:24,optional:!0},{id:"pt2",label:"価格の特典2",group:"価格",max:24,optional:!0},{id:"pt3",label:"価格の特典3",group:"価格",max:24,optional:!0},{id:"guarN",label:"保証の数字",group:"価格",max:4,optional:!0},{id:"guarT",label:"保証の見出し",group:"価格",max:16,optional:!0},{id:"guarB",label:"保証の説明",group:"価格",multiline:!0,max:50,optional:!0},{id:"faq1Q",label:"質問1",group:"よくある質問",max:30,optional:!0},{id:"faq1A",label:"答え1",group:"よくある質問",multiline:!0,max:90,optional:!0},{id:"faq2Q",label:"質問2",group:"よくある質問",max:30,optional:!0},{id:"faq2A",label:"答え2",group:"よくある質問",multiline:!0,max:90,optional:!0},{id:"faq3Q",label:"質問3",group:"よくある質問",max:30,optional:!0},{id:"faq3A",label:"答え3",group:"よくある質問",multiline:!0,max:90,optional:!0},{id:"endTitle",label:"最後の見出し",group:"最後",multiline:!0,max:30},{id:"endSub",label:"最後の補足",group:"最後",max:40},{id:"floatLabel",label:"下に浮かぶボタンの文字",group:"最後",max:20},{id:"note",label:"いちばん下の文字",group:"最後",multiline:!0,max:80,optional:!0,hint:"会社名・注意書き（効果の感じ方には個人差があります、など）"}],css:`.lpb-sorae{--sub:#a3abbd;--line:#e4e8f1;--ink2:#6b7488;--mint:#d7efe8;--en:"Jost",sans-serif;background:var(--bg);color:var(--ink);font-family:"Noto Sans JP",sans-serif;font-weight:300;line-height:2.1;letter-spacing:.1em}
.lpb-sorae .w{max-width:1080px;margin:0 auto;padding:0 32px}
.lpb-sorae .en{font-family:var(--en);letter-spacing:.32em;font-weight:300}
.lpb-sorae .hd{position:absolute;top:28px;left:0;right:0;z-index:5}
.lpb-sorae .hd .w{display:flex;justify-content:space-between;align-items:center;max-width:none;padding:0 44px}
.lpb-sorae .logo{font:300 20px var(--en);letter-spacing:.5em}
.lpb-sorae .hd nav{display:flex;gap:30px;font-size:11.5px;color:var(--ink2);text-transform:capitalize}
.lpb-sorae .hd nav a{transition:color .3s}.lpb-sorae .hd nav a:hover{color:var(--ink)}
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
.lpb-sorae .w{padding:0 24px}.lpb-sorae .hd .w{padding:0 24px}.lpb-sorae .hd nav{display:none}
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
.lpb-sorae .sbg img{left:0;right:auto;top:-4%;width:100%;height:108%;object-fit:cover;object-position:50% 58%;-webkit-mask-image:none;mask-image:none}}`,render:({f:a,img:e,link:i,when:r,v:o})=>{let l=t(o("marquee")),s=[...l,...l].map(a=>`<span>${a}</span><span>✦</span>`).join(""),n=t(o("freeList")).slice(0,8),p=Math.max(0,Math.min(100,Number(o("ringNum").replace(/[^\d.]/g,""))||0));return`
<header class="hd"><div class="w">${a("brand","span","logo")}<nav><a href="#sorae-key">${o("keyLabel")||"Feature"}</a><a href="#sorae-ig">Ingredients</a><a href="#sorae-free">${o("freeLabel")||"Free"}</a><a href="#price">Price</a></nav></div></header>
<section class="hero" style="padding:0">
 <div class="aura" aria-hidden="true"><i></i><i></i><i></i></div>
 <div class="ripple" aria-hidden="true"><span></span><span></span><span></span></div>
 <div class="bubs" aria-hidden="true"></div>
 <div class="w">
  <div>
   ${a("kick","p","kick en")}
   ${a("heroCopy","h1")}
   ${a("lead","p","lead")}
   <div class="cta">${i("ctaLabel","ctaUrl","btn")}${r(["ctaNote"],a("ctaNote","small"))}</div>
  </div>
  <div class="bwrap">
   <div class="tags">${a("tag1")}${a("tag2")}${a("tag3")}</div>
   ${e("bottle","btl")}
  </div>
 </div>
</section>
${l.length?`<div class="mq" aria-hidden="true"><div>${s}</div></div>`:""}
<section class="stm"><div class="sbg" aria-hidden="true">${e("face")}</div><div class="w">${a("statement","p","stm-t")}</div></section>
<section style="padding-top:40px"><div class="w">
 <div class="sh rv"><span class="en">FOR YOU</span>${a("forTitle","h2")}</div>
 <div class="fy rv">
  <div><span class="n">01</span>${a("for1T","b")}${a("for1B","p")}</div>
  <div><span class="n">02</span>${a("for2T","b")}${a("for2B","p")}</div>
  <div><span class="n">03</span>${a("for3T","b")}${a("for3B","p")}</div>
 </div>
</div></section>
<section class="cr" id="sorae-key"><div class="w">
 <div class="ring rv" data-pct="${p}">
  <svg viewBox="0 0 200 200" aria-hidden="true"><circle cx="100" cy="100" r="88" fill="none" stroke="#e4e8f1" stroke-width="1"/><circle class="arc" cx="100" cy="100" r="88" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="553" stroke-dashoffset="${(553*(1-p/100)).toFixed(1)}" transform="rotate(-90 100 100)"/></svg>
  <div class="c"><div><b><span class="cnt">${a("ringNum")}</span><small>${a("ringUnit")}</small></b>${a("ringCap","span","cap")}</div></div>
 </div>
 <div class="rv">
  ${a("keyLabel","span","en")}
  ${a("keyTitle","h2")}
  ${a("keyBody","p")}
  <div class="duo"><div>${a("duo1T","b")}${a("duo1B","small")}</div><div>${a("duo2T","b")}${a("duo2B","small")}</div></div>
 </div>
</div></section>
<section class="hzs" id="sorae-ig"><div class="pin"><div class="w">
 <div class="sh rv"><span class="en">INGREDIENTS</span>${a("igTitle","h2")}</div></div>
 <div class="ig">
  <div class="ic rv" style="--c:var(--mint)">${a("ig1E","span","en")}${a("ig1T","h3")}${a("ig1B","p")}</div>
  <div class="ic rv" style="--c:var(--sky)">${a("ig2E","span","en")}${a("ig2T","h3")}${a("ig2B","p")}</div>
  <div class="ic rv" style="--c:var(--lav)">${a("ig3E","span","en")}${a("ig3T","h3")}${a("ig3B","p")}</div>
 </div>
 <div class="prog"><i></i></div>
</div></section>
<section class="fr" id="sorae-free"><div class="w">
 <div class="sh rv">${a("freeLabel","span","en")}${a("freeTitle","h2")}${a("freeSub","p")}</div>
 ${n.length?`<div class="fg">${n.map(a=>`<span>${a}</span>`).join("")}</div>`:""}
 <figure class="qc rv"><div class="qci">${e("qc")}</div><figcaption><span class="en">QUALITY CHECK</span>${a("qcTitle","b")}${a("qcBody","p")}</figcaption></figure>
 <div class="made rv"><div><b>${a("made1N")}</b>${a("made1B","p")}</div><div><b>${a("made2N")}<small>${a("made2U")}</small></b>${a("made2B","p")}</div></div>
</div></section>
<section><div class="w">
 <div class="sh rv"><span class="en">HOW TO USE</span>${a("howTitle","h2")}</div>
 <div class="hu">
  <figure class="hph rv">${e("use")}${r(["howCap"],a("howCap","figcaption","en"))}</figure>
  <div class="hw">
   <div class="rv"><span class="en">STEP 01</span>${a("how1T","b")}${a("how1B","p")}</div>
   <div class="rv"><span class="en">STEP 02</span>${a("how2T","b")}${a("how2B","p")}</div>
   <div class="rv"><span class="en">STEP 03</span>${a("how3T","b")}${a("how3B","p")}</div>
  </div>
 </div>
</div></section>
<section id="price" style="padding-top:40px"><div class="w">
 <div class="sh rv"><span class="en">PRICE</span>${a("priceTitle","h2")}</div>
 <div class="pr rv">${r(["priceTag"],a("priceTag","span","tg"))}${a("priceName","h3")}<div class="yen">${r(["priceOld"],a("priceOld","s"))}${a("price")}<small>${a("priceUnit")}</small></div>
  ${r(["pt1","pt2","pt3"],`<ul>${r(["pt1"],a("pt1","li"))}${r(["pt2"],a("pt2","li"))}${r(["pt3"],a("pt3","li"))}</ul>`)}
  ${i("ctaLabel","ctaUrl","btn")}</div>
 ${r(["guarT"],`<div class="guar rv">${a("guarN","b")}<p>${a("guarT","strong")}${a("guarB")}</p></div>`)}
</div></section>
${r(["faq1Q","faq2Q","faq3Q"],`<section style="padding-top:0"><div class="w">
 <div class="sh rv"><span class="en">FAQ</span><h2>よくあるご質問</h2></div>
 <div class="fq rv">
  ${r(["faq1Q"],`<details><summary>${a("faq1Q")}</summary>${a("faq1A","p")}</details>`)}
  ${r(["faq2Q"],`<details><summary>${a("faq2Q")}</summary>${a("faq2A","p")}</details>`)}
  ${r(["faq3Q"],`<details><summary>${a("faq3Q")}</summary>${a("faq3A","p")}</details>`)}
 </div>
</div></section>`)}
<section class="end"><div class="aura" aria-hidden="true"><i></i><i></i></div><div class="w rv">
 ${a("brand","span","en")}
 ${a("endTitle","h2")}
 ${a("endSub","p")}
 ${i("ctaLabel","ctaUrl","btn")}
</div></section>
<footer class="ft">${a("brand","div","logo en")}${r(["note"],a("note","p"))}</footer>
<div class="fb">${i("floatLabel","ctaUrl","btn")}</div>`},js:`var Q=function(s){return root.querySelector(s)},QA=function(s){return [].slice.call(root.querySelectorAll(s))},es=function(s){return s.replace(/&/g,"&amp;").replace(/</g,"&lt;")};
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
}else{QA(".stm .wd").forEach(function(w){w.classList.add("on")})}`},{id:"craft",name:"CRAFT",kind:"物販・ものづくり・OEM",desc:"ブランドの物語（世界観・職人の工程）と、はじめ方のご案内（悩み・理由・商品・流れ）の2幕構成。納得して申し込んでもらう型です。",best:"革小物・雑貨・家具・食品・OEM／受注生産の案内など",fonts:"https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;500;600&family=Noto+Sans+JP:wght@300;400;500;700&display=swap",colors:[{id:"gold",label:"アクセント（金）",value:"#b8860b"},{id:"ink",label:"文字・ボタン",value:"#1a1a1a"},{id:"paper",label:"うすい背景",value:"#fafafa"}],slots:[{id:"hero",label:"メイン（パソコン・横長）",ratio:[16,9],min:1200,max:1920,where:"パソコンのファーストビュー全面（左上にブランド名、左下に見出しが重なる）",prompt:"{product}を窓辺の白い石の台に置いた商品写真。斜め上から、商品は画面の右寄せ、左側は明るい余白。窓からの自然光とやわらかい影、上質で静かな雰囲気。文字やロゴは入れない。横長16:9。",tips:"左に文字が重なるので、商品は右寄せに。窓の光で撮ると、元のLPと同じ空気感になります。"},{id:"heroCut",label:"メインの商品だけ（切り抜き）",ratio:[16,9],min:1200,max:1920,optional:!0,where:"大きなブランド名を商品の後ろに通すための画像（無くてもOK）",prompt:"（メイン写真の背景を消し、商品だけを残した透明PNG。画像編集アプリの「背景を削除」で作れます）",tips:"メイン写真と同じ画像から、背景を消して商品だけ残したPNGを入れます。入れると、大きなブランド名が商品の後ろを通ります。"},{id:"heroSp",label:"メイン（スマホ・縦長）",ratio:[9,16],min:700,max:1080,optional:!0,where:"スマホのファーストビュー（無ければパソコン用を使います）",prompt:"{product}を窓辺の白い石の台に置いた商品写真。縦長の構図で、商品は画面の中央より少し下。上は明るい余白。自然光、上質。文字やロゴは入れない。縦長9:16。",tips:"スマホでは写真が画面の上6割に出ます。商品は真ん中より少し下に。"},{id:"heroSpCut",label:"スマホの商品だけ（切り抜き）",ratio:[9,16],min:700,max:1080,optional:!0,where:"スマホで、ブランド名を商品の後ろに通すための画像（無くてもOK）",prompt:"（スマホ用メイン写真の背景を消し、商品だけを残した透明PNG）",tips:"スマホ用メイン写真から背景を消したPNGを入れます。"},{id:"step1",label:"工程1（素材えらび）",ratio:[16,9],min:1200,max:1920,where:"工程の1場面目（画面いっぱい）",prompt:"職人が{product}の素材を手で確かめている工房の写真。手元中心、木の作業台、窓の光、温かい色。顔は写さない。文字は入れない。横長16:9。",tips:"画面いっぱいに出るので、大きな写真を。下に文字が重なります。"},{id:"step2",label:"工程2（つくる）",ratio:[16,9],min:1200,max:1920,where:"工程の2場面目",prompt:"職人が{product}を手作業で作っている手元のクローズアップ。道具、作業台、温かい光。顔は写さない。文字は入れない。横長16:9。",tips:"手と道具が一緒に写ると「手しごと」が伝わります。"},{id:"step3",label:"工程3（仕上げ）",ratio:[16,9],min:1200,max:1920,where:"工程の3場面目",prompt:"{product}にロゴを押す・磨くなど、仕上げの細かな作業の手元。真鍮の道具、温かい光。文字は入れない。横長16:9。",tips:"仕上げの道具や、完成直前のアップがおすすめです。"},{id:"step4",label:"工程4（検品）",ratio:[16,9],min:1200,max:1920,where:"工程の4場面目",prompt:"完成した{product}を手に取って検品している手元。清潔な作業台、やわらかい光。文字は入れない。横長16:9。",tips:"検品・梱包の様子は「安心」につながります。"},{id:"m1",label:"商品1",ratio:[4,3],min:600,max:1e3,where:"商品一覧の1つ目",prompt:"{product}（1つ目の種類）の商品写真。白に近い明るいグレーの背景、真上より少し斜めから、やわらかい影。文字は入れない。横長4:3。",tips:"商品はすべて同じ背景・同じ角度でそろえると、きれいに並びます。"},{id:"m2",label:"商品2",ratio:[4,3],min:600,max:1e3,where:"商品一覧の2つ目",prompt:"{product}（2つ目の種類）の商品写真。白に近い明るいグレーの背景、やわらかい影。文字は入れない。横長4:3。",tips:"商品1と同じ置き方・同じ光で。"},{id:"m3",label:"商品3",ratio:[4,3],min:600,max:1e3,where:"商品一覧の3つ目",prompt:"{product}（3つ目の種類）の商品写真。白に近い明るいグレーの背景、やわらかい影。文字は入れない。横長4:3。",tips:"商品1と同じ置き方・同じ光で。"},{id:"m4",label:"商品4",ratio:[4,3],min:600,max:1e3,optional:!0,where:"商品一覧の4つ目（無くてもOK）",prompt:"{product}（4つ目の種類）の商品写真。白に近い明るいグレーの背景、やわらかい影。文字は入れない。横長4:3。",tips:"商品が3つなら、4〜6は空のままでかまいません。"},{id:"m5",label:"商品5",ratio:[4,3],min:600,max:1e3,optional:!0,where:"商品一覧の5つ目（無くてもOK）",prompt:"{product}（5つ目の種類）の商品写真。白に近い明るいグレーの背景、やわらかい影。文字は入れない。横長4:3。",tips:"商品1と同じ置き方・同じ光で。"},{id:"m6",label:"商品6",ratio:[4,3],min:600,max:1e3,optional:!0,where:"商品一覧の6つ目（無くてもOK）",prompt:"{product}（6つ目の種類）の商品写真。白に近い明るいグレーの背景、やわらかい影。文字は入れない。横長4:3。",tips:"商品1と同じ置き方・同じ光で。"},{id:"op1",label:"仕上げ・種類1",ratio:[16,9],min:900,max:1400,where:"「選べる仕上げ」の1つ目",prompt:"{product}の細部（ロゴ・質感）のクローズアップ。仕上げの違いがわかる、斜めからの光。暗めの背景。文字は入れない。横長16:9。",tips:"色・素材・加工など、選べる違いがはっきりわかる寄りの写真を。3枚とも同じ構図にすると切り替えがきれいです。"},{id:"op2",label:"仕上げ・種類2",ratio:[16,9],min:900,max:1400,where:"「選べる仕上げ」の2つ目",prompt:"{product}の細部の、2つ目の仕上げのクローズアップ。種類1と同じ構図・同じ光。文字は入れない。横長16:9。",tips:"種類1と同じ構図で撮ってください。"},{id:"op3",label:"仕上げ・種類3",ratio:[16,9],min:900,max:1400,where:"「選べる仕上げ」の3つ目",prompt:"{product}の細部の、3つ目の仕上げのクローズアップ。種類1と同じ構図・同じ光。文字は入れない。横長16:9。",tips:"種類1と同じ構図で撮ってください。"},{id:"opt",label:"オプション（小さな写真）",ratio:[8,5],min:300,max:600,optional:!0,where:"オプションの小さな写真（無くてもOK）",prompt:"{product}のギフト箱・付属品の写真。白い背景、上品。文字は入れない。横長。",tips:"箱・ラッピング・付属品など、追加で選べるものの写真を。"}],fields:[{id:"brand",label:"ブランド名（左上）",group:"ファーストビュー",max:20},{id:"word",label:"写真に重なる大きな英字",group:"ファーストビュー",max:8,hint:"ブランド名を英大文字で短く（例：CRAFT）"},{id:"kick",label:"見出しの上の小さな英字",group:"ファーストビュー",max:36},{id:"heroCopy",label:"キャッチコピー（2行）",group:"ファーストビュー",multiline:!0,max:24,hint:"2行。金色にしたい言葉は＊で囲む"},{id:"badges",label:"強み（｜で区切る）",group:"ファーストビュー",max:30,hint:"数字の強みを｜で区切って3つ（例：型代 0円｜30個から｜最短30日）"},{id:"ctaLabel",label:"ボタンの文字",group:"ファーストビュー",max:16},{id:"ctaUrl",label:"ボタンのリンク先",group:"ファーストビュー",url:!0},{id:"cta2Label",label:"2つ目のリンクの文字",group:"ファーストビュー",max:16,optional:!0},{id:"cta2Url",label:"2つ目のリンク先",group:"ファーストビュー",url:!0},{id:"statement",label:"想い（行ごとに改行・言葉ごとに空白）",group:"想い",multiline:!0,max:50,hint:"3行ほどの短い文。言葉の間に空白、金色にする言葉は＊で囲む"},{id:"craftTitle",label:"工程の見出し",group:"職人の工程",multiline:!0,max:24},{id:"craftBody",label:"工程の説明",group:"職人の工程",multiline:!0,max:60},{id:"s1E",label:"工程1の英字",group:"職人の工程",max:12},{id:"s1T",label:"工程1の見出し",group:"職人の工程",max:14},{id:"s1B",label:"工程1の説明",group:"職人の工程",multiline:!0,max:60},{id:"s2E",label:"工程2の英字",group:"職人の工程",max:12},{id:"s2T",label:"工程2の見出し",group:"職人の工程",max:14},{id:"s2B",label:"工程2の説明",group:"職人の工程",multiline:!0,max:60},{id:"s3E",label:"工程3の英字",group:"職人の工程",max:12},{id:"s3T",label:"工程3の見出し",group:"職人の工程",max:14},{id:"s3B",label:"工程3の説明",group:"職人の工程",multiline:!0,max:60},{id:"s4E",label:"工程4の英字",group:"職人の工程",max:12},{id:"s4T",label:"工程4の見出し",group:"職人の工程",max:14},{id:"s4B",label:"工程4の説明",group:"職人の工程",multiline:!0,max:60},{id:"actBreak",label:"区切りの文",group:"こんな壁",max:30,hint:"物語からご案内に切りかわる一文"},{id:"painTitle",label:"悩みの見出し",group:"こんな壁",max:24},{id:"pain1",label:"悩み1",group:"こんな壁",max:40},{id:"pain2",label:"悩み2",group:"こんな壁",max:40},{id:"pain3",label:"悩み3",group:"こんな壁",max:40},{id:"painEnd",label:"解決のひとこと",group:"こんな壁",max:30},{id:"whyTitle",label:"理由の見出し",group:"選ばれる理由",max:20},{id:"why1T",label:"理由1",group:"選ばれる理由",max:20},{id:"why1B",label:"理由1の説明",group:"選ばれる理由",multiline:!0,max:80},{id:"why2T",label:"理由2",group:"選ばれる理由",max:20},{id:"why2B",label:"理由2の説明",group:"選ばれる理由",multiline:!0,max:80},{id:"why3T",label:"理由3",group:"選ばれる理由",max:20},{id:"why3B",label:"理由3の説明",group:"選ばれる理由",multiline:!0,max:80},{id:"mTitle",label:"商品一覧の見出し",group:"商品一覧",max:20},{id:"mSub",label:"商品一覧の説明",group:"商品一覧",max:40},...[1,2,3,4,5,6].flatMap(a=>[{id:`m${a}N`,label:`商品${a}の名前`,group:"商品一覧",max:20,optional:a>3},{id:`m${a}F`,label:`商品${a}の特長`,group:"商品一覧",multiline:!0,max:40,optional:a>3},{id:`m${a}S`,label:`商品${a}のサイズなど`,group:"商品一覧",max:30,optional:!0},{id:`m${a}P`,label:`商品${a}の価格`,group:"商品一覧",max:14,optional:a>3}]),{id:"mNote",label:"商品一覧の注意書き",group:"商品一覧",max:50,optional:!0},{id:"opTitle",label:"仕上げの見出し",group:"選べる仕上げ",max:20},{id:"opSub",label:"仕上げの説明",group:"選べる仕上げ",max:30},...[1,2,3].flatMap(a=>[{id:`op${a}N`,label:`種類${a}の名前`,group:"選べる仕上げ",max:10},{id:`op${a}E`,label:`種類${a}の英字`,group:"選べる仕上げ",max:14},{id:`op${a}B`,label:`種類${a}の説明`,group:"選べる仕上げ",multiline:!0,max:50}]),{id:"optT",label:"オプションの名前",group:"選べる仕上げ",max:16,optional:!0},{id:"optB",label:"オプションの説明",group:"選べる仕上げ",max:40,optional:!0},{id:"spT",label:"特別注文の見出し",group:"選べる仕上げ",max:24,optional:!0},{id:"spB",label:"特別注文の説明",group:"選べる仕上げ",multiline:!0,max:90,optional:!0},{id:"flowTitle",label:"流れの見出し",group:"ご注文の流れ",max:20},{id:"f1T",label:"流れ1",group:"ご注文の流れ",max:16},{id:"f1B",label:"流れ1の説明",group:"ご注文の流れ",multiline:!0,max:50},{id:"f2T",label:"流れ2",group:"ご注文の流れ",max:16},{id:"f2B",label:"流れ2の説明",group:"ご注文の流れ",multiline:!0,max:50},{id:"f3T",label:"流れ3",group:"ご注文の流れ",max:16},{id:"f3B",label:"流れ3の説明",group:"ご注文の流れ",multiline:!0,max:50},...[1,2,3,4].flatMap(a=>[{id:`q${a}Q`,label:`質問${a}`,group:"よくある質問",max:30,optional:!0},{id:`q${a}A`,label:`答え${a}`,group:"よくある質問",multiline:!0,max:100,optional:!0}]),{id:"contactTitle",label:"最後の見出し",group:"お問い合わせ",max:20},{id:"contactSub",label:"最後の補足",group:"お問い合わせ",max:40},{id:"floatLabel",label:"右下に浮かぶボタン",group:"お問い合わせ",max:12},{id:"footSub",label:"フッターの説明",group:"お問い合わせ",max:30},{id:"note",label:"いちばん下の文字",group:"お問い合わせ",multiline:!0,max:80,optional:!0}],css:`.lpb-craft{--mute:#6b6b6b;--line:#e7e7e5;--gold2:color-mix(in srgb,var(--gold) 70%,#e7d3a1);--en:"Cormorant Garamond",serif;font-family:"Noto Sans JP",sans-serif;color:var(--ink);background:#fff;line-height:1.75}
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
@media (prefers-reduced-motion:reduce){.lpb-craft *{animation:none!important}.lpb-craft.lpb-js .rv,.lpb-craft.lpb-js .stmt .c{opacity:1!important;transform:none!important;filter:none!important}}`,render:({f:a,img:t,link:e,when:i,v:r,has:o})=>{let l=r("badges").split(/[|｜]/).map(a=>a.trim()).filter(Boolean),s=o("heroSp"),n=e=>`<article class="model rv"><span class="ph">${t(`m${e}`)}</span><p class="mn">MODEL 0${e}</p>${a(`m${e}N`,"h3")}${a(`m${e}F`,"p","f")}${i([`m${e}S`],a(`m${e}S`,"p","sz"))}<p class="pr">参考価格${a(`m${e}P`,"b")}</p></article>`;return`
<header class="hd"><div class="w">${a("word","a","logo")}<button type="button" class="mb" aria-label="メニューを開く" aria-expanded="false"><span><i></i><i></i></span></button></div></header>
<nav class="menu" aria-hidden="true"><ul>${[["#craft-why",r("whyTitle")||"選ばれる理由"],["#craft-models",r("mTitle")||"商品一覧"],["#craft-finish",r("opTitle")||"仕上げ"],["#craft-flow",r("flowTitle")||"ご注文の流れ"],["#craft-contact",r("contactTitle")||"お問い合わせ"]].map(([a,t])=>`<li><a href="${a}" tabindex="-1">${t}</a></li>`).join("")}</ul></nav>
<section class="hero"><div class="in">
 <div class="photo${s?"":" nosp"}">
  <div class="stage"><div class="zoom">
   ${t("hero","ly pc")}${s?t("heroSp","ly sp"):""}
   <div class="word" aria-hidden="true">${a("word")}</div>
   ${t("heroCut","ly cut pc")}${s?t("heroSpCut","ly cut sp"):""}
   <div class="wlight" aria-hidden="true"></div>
  </div></div>
  <div class="clight" aria-hidden="true"></div>
  <div class="fadeb"></div><div class="fadel"></div>
 </div>
 <div class="copy"><div class="w"><div class="bx">
  ${a("kick","p","kick hin")}
  <h1>${a("heroCopy","span","hc")}</h1>
  ${l.length?`<p class="badges hin num" style="animation-delay:.6s">${l.join("<i>|</i>")}</p>`:""}
  <div class="ctas hin" style="animation-delay:.75s">${e("ctaLabel","ctaUrl","btn")}${i(["cta2Label"],e("cta2Label","cta2Url","ul"))}</div>
 </div></div></div>
</div></section>
<section class="stmt"><div class="in">
 <p class="elbl">OUR PHILOSOPHY</p>
 ${a("statement","div","lines")}
 <span class="stl"></span>
</div></section>
<section class="craft" aria-label="工程"><div class="wrap"><div class="stk">
 ${[1,2,3,4].map(e=>`<div class="scene">${t(`step${e}`)}<div class="shd2"></div><div class="stx"><p class="no">0${e}</p>${a(`s${e}E`,"p","se")}${a(`s${e}T`,"h3")}${a(`s${e}B`,"p")}</div></div>`).join("")}
 <div class="shade"></div><div class="dim"></div>
 <div class="cintro"><p class="elbl">CRAFTSMANSHIP</p>${a("craftTitle","h2")}${a("craftBody","p")}<span class="cue"></span></div>
 <div class="prg">${[0,1,2,3].map(()=>"<span><i></i></span>").join("")}</div>
</div></div></section>
<div class="act rv"><span class="bar"></span><p class="elbl">FOR YOUR BRAND</p>${a("actBreak","p","t")}</div>
<section class="s"><div class="w4">
 <div class="st rv"><p class="elbl">Problems</p>${a("painTitle","h2")}</div>
 <ol class="pains">${[1,2,3].map(t=>`<li class="rv"><span class="n num">0${t}</span>${a(`pain${t}`,"p")}</li>`).join("")}</ol>
 ${a("painEnd","p","pend rv")}
</div></section>
<section class="s bgp" id="craft-why"><div class="w">
 <div class="st rv"><p class="elbl">Why us</p>${a("whyTitle","h2")}</div>
 <div class="why">${[1,2,3].map(t=>`<article class="rv"><p class="n num">0${t}</p>${a(`why${t}T`,"h3")}${a(`why${t}B`,"p")}</article>`).join("")}</div>
</div></section>
<section class="s" id="craft-models"><div class="w">
 <div class="st rv"><p class="elbl">Lineup</p>${a("mTitle","h2")}${a("mSub","p","sub")}</div>
 <div class="models">${n(1)}${n(2)}${n(3)}${[4,5,6].map(a=>o(`m${a}`)?n(a):"").join("")}</div>
 ${i(["mNote"],a("mNote","p","mnote"))}
</div></section>
<section class="s bgp" id="craft-finish"><div class="w">
 <div class="st rv"><p class="elbl">Finish</p>${a("opTitle","h2")}${a("opSub","p","sub")}</div>
 <div class="opt">
  <div class="pics rv">${t("op1","now")}${t("op2")}${t("op3")}<span class="sweep"></span></div>
  <div class="rv">
   <div class="tabs" role="tablist">${[1,2,3].map(a=>`<button type="button" role="tab" class="${1===a?"now":""}">${r(`op${a}N`)}</button>`).join("")}</div>
   ${[1,2,3].map(t=>`<div class="opd${1===t?" now":""}">${a(`op${t}E`,"p","e")}${a(`op${t}B`,"p")}</div>`).join("")}
   ${o("opt")?`<div class="ob">${t("opt")}<div><small>OPTION</small>${a("optT","b")}${a("optB","span")}</div></div>`:""}
  </div>
 </div>
 ${i(["spT"],`<div class="spo rv"><small>SPECIAL ORDER</small>${a("spT","b")}${a("spB","p")}</div>`)}
</div></section>
<section class="s" id="craft-flow"><div class="w">
 <div class="st rv"><p class="elbl">Flow</p>${a("flowTitle","h2")}</div>
 <ol class="flow">${[1,2,3].map(t=>`<li class="rv"><div class="hd2"><b class="num">${t}</b><i></i></div>${a(`f${t}T`,"h3")}${a(`f${t}B`,"p")}</li>`).join("")}</ol>
 ${i(["q1Q","q2Q","q3Q","q4Q"],`<div style="margin-top:128px"><div class="st rv"><p class="elbl">FAQ</p><h2>よくある質問</h2></div>
  <div class="faq">${[1,2,3,4].map(t=>i([`q${t}Q`],`<details class="rv"><summary>${a(`q${t}Q`)}</summary>${a(`q${t}A`,"p")}</details>`)).join("")}</div></div>`)}
</div></section>
<section class="contact" id="craft-contact"><div class="w">
 <div class="st rv" style="margin-bottom:40px"><p class="elbl">Contact</p>${a("contactTitle","h2")}${a("contactSub","p","sub")}</div>
 <div class="box rv">${e("ctaLabel","ctaUrl","btn")}</div>
</div></section>
<footer class="ft">${a("brand","p","logo")}${a("footSub","p","s1")}${i(["note"],a("note","p","s2"))}</footer>
${e("floatLabel","ctaUrl","fb")}`},js:`var Q=function(s){return root.querySelector(s)},QA=function(s){return [].slice.call(root.querySelectorAll(s))},es=function(s){return s.replace(/&/g,"&amp;").replace(/</g,"&lt;")};
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
}`},{id:"abyssia",name:"ABYSSIA",kind:"世界観・体験・イベント",desc:"深い青の中を、光の粒と魚の群れが泳ぐ。ゾーンを巡るように読み進め、最後にチケットへ導く型です。",best:"展示・イベント・ナイトスポット・ホテル・カフェ／バー・音楽など",fonts:"https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Noto+Sans+JP:wght@200;300;400&family=Inter:wght@200;300;400&display=swap",colors:[{id:"c1",label:"光の色",value:"#5ee7ff"},{id:"c2",label:"光の色2",value:"#8b7bff"},{id:"c3",label:"光の色3",value:"#c08bff"},{id:"sea",label:"上の海の色",value:"#071a33"},{id:"bg",label:"深い背景",value:"#02040a"}],slots:[{id:"hero",label:"メイン（縦長・主役のモチーフ）",ratio:[2,3],min:500,max:1e3,where:"ファーストビューの中央で光る写真",prompt:"真っ暗な背景の中央で、{product}を象徴するモチーフ（例：クラゲ）が青く発光している縦長の写真。周りは完全な闇、細部まで美しく神秘的。文字は入れない。縦長2:3。",tips:"周りが真っ黒な写真を選ぶと、まわりが溶けこんで浮かび上がります。"},{id:"z1",label:"ゾーン1（横長）",ratio:[16,9],min:1e3,max:1600,where:"1つ目のゾーンの写真",prompt:"{product}の空間を奥へ続くように見せる写真。左右に光る水槽が並ぶ暗い回廊、深い青、人は小さなシルエット。文字は入れない。横長16:9。",tips:"通路など、奥へ続く線がある場所を真ん中から撮ると引き込まれます。"},{id:"z2",label:"ゾーン2（縦長）",ratio:[5,7],min:500,max:1e3,where:"2つ目のゾーンの写真",prompt:"深い闇の中で自ら光る生き物・モチーフのクローズアップ。青い光の粒が漂う。文字は入れない。縦長。",tips:"主役を1つだけ、暗い背景で。"},{id:"z3",label:"ゾーン3（横長）",ratio:[16,9],min:1e3,max:1600,where:"3つ目のゾーンの写真",prompt:"大きな円形の水槽を、人々のシルエットが見上げている写真。魚の群れが渦を巻く、深い青の光。文字は入れない。横長16:9。",tips:"人を小さく入れると、空間の大きさが伝わります。"},{id:"full",label:"全面の写真（横長）",ratio:[16,9],min:1400,max:1920,where:"画面いっぱいに広がる写真",prompt:"床と壁いっぱいに光の海が映し出された暗い空間に、1人が立っている写真。青と水色の光の波、幻想的。文字は入れない。横長16:9。",tips:"画面いっぱいに使うので、大きくてきれいな写真を。下の方に文字が重なります。"},{id:"bar",label:"夜の楽しみ（横長）",ratio:[16,10],min:800,max:1400,where:"夜の楽しみ方の写真",prompt:"大きな水槽の前のバーカウンターで、人が静かにお酒を楽しんでいる夜の写真。青い光、上質で落ち着いた雰囲気。文字は入れない。横長。",tips:"楽しんでいる場面（飲む・見る・くつろぐ）が伝わる写真を。"},{id:"cocktail",label:"小さな写真（正方形）",ratio:[1,1],min:400,max:800,where:"夜の写真に重なる小さな写真（無くてもOK）",optional:!0,prompt:"青紫に光るカクテルのクローズアップ。暗い背景、グラスの縁に光、上質。文字は入れない。正方形。",tips:"名物のメニューや小物のアップがおすすめです。"},{id:"pair",label:"ふたり（縦長）",ratio:[5,7],min:500,max:1e3,where:"「ふたりで」の写真",prompt:"{target}の2人が、光る大きな景色を後ろ姿で見上げている縦長の写真。シルエット、静かな感動。顔は写さない。文字は入れない。",tips:"人は後ろ姿・シルエットにすると、見る人が自分を重ねやすくなります。"},{id:"place",label:"場所・建物（横長）",ratio:[16,9],min:800,max:1400,where:"アクセスの写真",prompt:"夜の水辺に浮かぶ、青く光るガラス張りの建物の外観。水面に光が映る。文字は入れない。横長16:9。",tips:"夜に外から撮った建物や入口の写真が合います。"},{id:"end",label:"最後の背景（横長）",ratio:[16,9],min:1e3,max:1920,where:"最後の画面の背景",prompt:"水中から水面を見上げた写真。差し込む光の筋、深い青、泡。文字は入れない。横長16:9。",tips:"暗くて、上の方が少し明るい写真が合います。"}],fields:[{id:"brand",label:"名前（英字がおすすめ）",group:"ファーストビュー",max:12,hint:"大きく1文字ずつ浮かぶ名前（英字7文字前後）"},{id:"kick",label:"名前の上の小さな英字",group:"ファーストビュー",max:24},{id:"heroSub",label:"キャッチコピー",group:"ファーストビュー",max:24},{id:"scroll",label:"下の小さな文字",group:"ファーストビュー",max:20},{id:"statement",label:"メッセージ（言葉ごとに空白）",group:"メッセージ",multiline:!0,max:60,hint:"光の粒が集まるように現れる文章。言葉の間に空白、色を変える言葉は＊で囲む"},{id:"marquee",label:"流れる文字（、で区切る）",group:"メッセージ",max:80,hint:"ゾーン名などの英語を、、で区切って4つほど"},{id:"z1No",label:"ゾーン1の番号",group:"ゾーン1",max:10},{id:"z1En",label:"ゾーン1の英語名",group:"ゾーン1",max:24},{id:"z1T",label:"ゾーン1の見出し",group:"ゾーン1",multiline:!0,max:24,hint:"2行。色を変える言葉は＊で囲む"},{id:"z1B",label:"ゾーン1の説明",group:"ゾーン1",multiline:!0,max:60},{id:"z1m1",label:"数字1の項目",group:"ゾーン1",max:10,optional:!0},{id:"z1v1",label:"数字1",group:"ゾーン1",max:10,optional:!0},{id:"z1m2",label:"数字2の項目",group:"ゾーン1",max:10,optional:!0},{id:"z1v2",label:"数字2",group:"ゾーン1",max:10,optional:!0},{id:"z2No",label:"ゾーン2の番号",group:"ゾーン2",max:10},{id:"z2En",label:"ゾーン2の英語名",group:"ゾーン2",max:24},{id:"z2T",label:"ゾーン2の見出し",group:"ゾーン2",multiline:!0,max:24},{id:"z2B",label:"ゾーン2の説明",group:"ゾーン2",multiline:!0,max:60},{id:"z2m1",label:"数字1の項目",group:"ゾーン2",max:10,optional:!0},{id:"z2v1",label:"数字1",group:"ゾーン2",max:10,optional:!0},{id:"z2m2",label:"数字2の項目",group:"ゾーン2",max:10,optional:!0},{id:"z2v2",label:"数字2",group:"ゾーン2",max:10,optional:!0},{id:"z3No",label:"ゾーン3の番号",group:"ゾーン3",max:10},{id:"z3En",label:"ゾーン3の英語名",group:"ゾーン3",max:24},{id:"z3T",label:"ゾーン3の見出し",group:"ゾーン3",multiline:!0,max:24},{id:"z3B",label:"ゾーン3の説明",group:"ゾーン3",multiline:!0,max:60},{id:"z3m1",label:"数字1の項目",group:"ゾーン3",max:10,optional:!0},{id:"z3v1",label:"数字1",group:"ゾーン3",max:10,optional:!0},{id:"z3m2",label:"数字2の項目",group:"ゾーン3",max:10,optional:!0},{id:"z3v2",label:"数字2",group:"ゾーン3",max:10,optional:!0},{id:"fullNo",label:"全面写真の番号",group:"全面の写真",max:10},{id:"fullEn",label:"全面写真の英語名",group:"全面の写真",max:24},{id:"fullT",label:"全面写真の言葉",group:"全面の写真",multiline:!0,max:24},{id:"nightNo",label:"夜の小見出し",group:"夜の楽しみ",max:14},{id:"nightEn",label:"夜の英語名",group:"夜の楽しみ",max:24},{id:"nightT",label:"夜の見出し",group:"夜の楽しみ",multiline:!0,max:24},{id:"nightB",label:"夜の説明",group:"夜の楽しみ",multiline:!0,max:70},{id:"t1L",label:"時間1の項目",group:"夜の楽しみ",max:20,optional:!0},{id:"t1V",label:"時間1",group:"夜の楽しみ",max:24,optional:!0},{id:"t2L",label:"時間2の項目",group:"夜の楽しみ",max:20,optional:!0},{id:"t2V",label:"時間2",group:"夜の楽しみ",max:24,optional:!0},{id:"t3L",label:"時間3の項目",group:"夜の楽しみ",max:20,optional:!0},{id:"t3V",label:"時間3",group:"夜の楽しみ",max:24,optional:!0},{id:"ckCap",label:"小さな写真の説明",group:"夜の楽しみ",max:30,optional:!0,hint:"＊で囲んだところが斜体の色文字になる"},{id:"pairNo",label:"ふたりの小見出し",group:"ふたりで",max:14},{id:"pairEn",label:"ふたりの英語名",group:"ふたりで",max:24},{id:"pairT",label:"ふたりの見出し",group:"ふたりで",multiline:!0,max:24},{id:"pairB",label:"ふたりの説明",group:"ふたりで",multiline:!0,max:60},{id:"tkTitle",label:"チケットの見出し",group:"チケット",max:20},{id:"tk1E",label:"チケット1の英字",group:"チケット",max:10},{id:"tk1N",label:"チケット1の名前",group:"チケット",max:16},{id:"tk1P",label:"チケット1の価格",group:"チケット",max:10},{id:"tk1U",label:"チケット1の単位",group:"チケット",max:8},{id:"tk1B",label:"チケット1の説明",group:"チケット",multiline:!0,max:40},{id:"tk2E",label:"チケット2の英字（目立つ）",group:"チケット",max:10},{id:"tk2N",label:"チケット2の名前",group:"チケット",max:16},{id:"tk2P",label:"チケット2の価格",group:"チケット",max:10},{id:"tk2U",label:"チケット2の単位",group:"チケット",max:8},{id:"tk2B",label:"チケット2の説明",group:"チケット",multiline:!0,max:40},{id:"tk3E",label:"チケット3の英字",group:"チケット",max:10},{id:"tk3N",label:"チケット3の名前",group:"チケット",max:16},{id:"tk3P",label:"チケット3の価格",group:"チケット",max:10},{id:"tk3U",label:"チケット3の単位",group:"チケット",max:8},{id:"tk3B",label:"チケット3の説明",group:"チケット",multiline:!0,max:40},{id:"tkNote",label:"チケットの注意書き",group:"チケット",max:60,optional:!0},{id:"acT",label:"アクセスの見出し",group:"アクセス",multiline:!0,max:24},{id:"ac1L",label:"項目1",group:"アクセス",max:10},{id:"ac1V",label:"内容1",group:"アクセス",max:40},{id:"ac2L",label:"項目2",group:"アクセス",max:10},{id:"ac2V",label:"内容2",group:"アクセス",max:40},{id:"ac3L",label:"項目3",group:"アクセス",max:10,optional:!0},{id:"ac3V",label:"内容3",group:"アクセス",max:40,optional:!0},{id:"endLabel",label:"最後の小さな英字",group:"最後",max:12},{id:"endTitle",label:"最後の言葉（英語がおすすめ）",group:"最後",max:30},{id:"ctaLabel",label:"ボタンの文字",group:"最後",max:16},{id:"ctaUrl",label:"ボタンのリンク先",group:"最後",url:!0},{id:"note",label:"いちばん下の文字",group:"最後",multiline:!0,max:80,optional:!0}],css:`.lpb-abyssia{--ink:#e8f1ff;--ink2:#9fb0cc;--sub:#5d6b85;--ln:rgba(140,180,255,.14);--serif:"Cormorant Garamond",serif;--sans:Inter,"Noto Sans JP",sans-serif;color:var(--ink);font:300 14px/1.9 var(--sans);letter-spacing:.06em;background:var(--bg)}
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
@media (prefers-reduced-motion:reduce){.lpb-abyssia *{animation:none!important;transition:none!important}.lpb-abyssia .intro .c,.lpb-abyssia.lpb-js .rv,.lpb-abyssia.lpb-js .hero h1 .lt,.lpb-abyssia.lpb-js .hero .k,.lpb-abyssia.lpb-js .hero .sub,.lpb-abyssia.lpb-js .scr,.lpb-abyssia.lpb-js .hero .jf{opacity:1!important;filter:none!important}.lpb-abyssia.lpb-js .ph{clip-path:none!important}}`,render:({f:a,img:t,link:e,when:i,v:r,has:o})=>{let l=r("marquee").split(/[、,，\n]+/).map(a=>a.trim()).filter(Boolean),s=[...l,...l].map(a=>`<span>${a}</span><span>✦</span>`).join(""),n=(e,r)=>`
 <div class="zone${r?" rev":""}">
  <figure class="ph ${r?"tall":"wide"} rv">${t(`z${e}`)}</figure>
  <div class="tx rv"><span class="zn">0${e}</span><p class="lbl">${a(`z${e}No`,"b")}${a(`z${e}En`)}</p>${a(`z${e}T`,"h2")}${a(`z${e}B`,"p","lead")}
   ${i([`z${e}m1`,`z${e}m2`],`<div class="meta">${i([`z${e}m1`],`<div>${a(`z${e}m1`)}${a(`z${e}v1`,"b")}</div>`)}${i([`z${e}m2`],`<div>${a(`z${e}m2`)}${a(`z${e}v2`,"b")}</div>`)}</div>`)}</div>
 </div>`;return`
<div class="fxl" aria-hidden="true"><canvas></canvas><div class="depth"><span>DEPTH</span><div class="bar"><i></i></div><b class="dp">0</b><span>m</span></div></div>
<div class="mn">
<header class="hd">${a("brand","span","logo")}<nav><a href="#abyssia-zones">EXHIBITS</a><a href="#abyssia-night">NIGHT</a><a href="#abyssia-ticket">TICKETS</a><a href="#abyssia-access">ACCESS</a></nav></header>
<section class="hero">
 <div class="jf" aria-hidden="true">${t("hero")}</div>
 <div class="tx">${a("kick","p","k")}${a("brand","h1")}${a("heroSub","p","sub")}</div>
 <div class="scr">${a("scroll")}<i></i></div>
</section>
<section class="intro"><div class="w">${a("statement","p","big")}</div></section>
${l.length?`<div class="mq" aria-hidden="true"><div>${s}</div></div>`:""}
<section id="abyssia-zones"><div class="w zones">${n(1,!1)}${n(2,!0)}${n(3,!1)}</div></section>
<section class="full"><div class="bg">${t("full")}</div><div class="cap rv"><p class="lbl" style="margin-bottom:18px">${a("fullNo","b")}${a("fullEn")}</p>${a("fullT","p","big")}</div></section>
<section id="abyssia-night"><div class="w night">
 <div class="tx rv"><p class="lbl">${a("nightNo","b")}${a("nightEn")}</p>${a("nightT","h2")}${a("nightB","p","lead")}
  ${i(["t1L","t2L","t3L"],`<div class="time">${i(["t1L"],`<div>${a("t1L")}${a("t1V","b")}</div>`)}${i(["t2L"],`<div>${a("t2L")}${a("t2V","b")}</div>`)}${i(["t3L"],`<div>${a("t3L")}${a("t3V","b")}</div>`)}</div>`)}</div>
 <div class="nimg"${o("cocktail")?"":' style="padding-bottom:0"'}><figure class="ph rv">${t("bar")}</figure>${o("cocktail")?`<figure class="ph ck rv">${t("cocktail")}${i(["ckCap"],a("ckCap","figcaption"))}</figure>`:""}</div>
</div></section>
<section style="padding-top:40px"><div class="w pair">
 <figure class="ph tall rv">${t("pair")}</figure>
 <div class="rv"><p class="lbl">${a("pairNo","b")}${a("pairEn")}</p>${a("pairT","h2")}${a("pairB","p","lead")}</div>
</div></section>
<section id="abyssia-ticket"><div class="w">
 <div class="rv" style="text-align:center"><p class="lbl">TICKETS</p>${a("tkTitle","h2")}</div>
 <div class="price">
  <div class="tk rv">${a("tk1E","small")}${a("tk1N","h3")}<p class="yen">${a("tk1P")}<span>${a("tk1U")}</span></p>${a("tk1B","p")}</div>
  <div class="tk fe rv">${a("tk2E","small")}${a("tk2N","h3")}<p class="yen">${a("tk2P")}<span>${a("tk2U")}</span></p>${a("tk2B","p")}</div>
  <div class="tk rv">${a("tk3E","small")}${a("tk3N","h3")}<p class="yen">${a("tk3P")}<span>${a("tk3U")}</span></p>${a("tk3B","p")}</div>
 </div>
 ${i(["tkNote"],a("tkNote","p","note rv"))}
</div></section>
<section id="abyssia-access" style="padding-top:40px"><div class="w access">
 <figure class="ph rv">${t("place")}</figure>
 <div class="rv"><p class="lbl">ACCESS</p>${a("acT","h2")}
  <dl class="dl">${a("ac1L","dt")}${a("ac1V","dd")}${a("ac2L","dt")}${a("ac2V","dd")}${i(["ac3L"],a("ac3L","dt")+a("ac3V","dd"))}</dl></div>
</div></section>
<section class="end"><div class="bg">${t("end")}</div>
 <div class="tx rv">${a("endLabel","p","lbl")}${a("endTitle","h2")}${e("ctaLabel","ctaUrl","btn")}</div>
</section>
<footer class="ft">${a("brand","div","logo")}${i(["note"],a("note","p"))}</footer>
</div>`},js:`var Q=function(s){return root.querySelector(s)},QA=function(s){return [].slice.call(root.querySelectorAll(s))},es=function(s){return s.replace(/&/g,"&amp;").replace(/</g,"&lt;")};
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
}`}];a.s(["g",0,e,"B",0,a=>e.find(t=>t.id===a)??e[0],"l",0,a=>"abyssia"===a.id],65608)}]);