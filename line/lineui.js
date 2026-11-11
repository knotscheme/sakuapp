/* サクアプ LINEミニアプリLP：LINEのトーク・リッチメニュー・ミニアプリをコードで描く */
(function(){
var CSS=`
.ph2{position:relative;container-type:inline-size;border-radius:15%/7.2%;background:linear-gradient(145deg,#2a2c30,#0e0f11 40%,#1d1f22);padding:0;box-shadow:0 0 0 1px #3a3d42,0 50px 60px -30px rgba(10,40,20,.55)}
.ph2:before{content:"";position:absolute;left:50%;top:4.6cqw;transform:translateX(-50%);width:30%;height:7cqw;border-radius:4cqw;background:#000;z-index:30}
.ph2s{position:relative;margin:3cqw;border-radius:12.6%/5.9%;overflow:hidden;background:#fff;aspect-ratio:9/19.3;font-size:4.06cqw;line-height:1.45;color:#111;font-family:"Noto Sans JP","Hiragino Sans",sans-serif;letter-spacing:.02em;isolation:isolate}
.u-sb{position:absolute;left:0;right:0;top:0;height:3.6em;display:flex;align-items:flex-end;justify-content:space-between;padding:0 2.2em .55em 2.4em;font:600 1.02em/1 Inter,sans-serif;z-index:20;color:#111;pointer-events:none}
.u-sb i{display:flex;gap:.35em;align-items:center}.u-sb svg{height:.75em;fill:currentColor}
.u-talk{position:absolute;inset:0;display:flex;flex-direction:column;background:#8fa9cf}
.u-th{flex:none;height:6.4em;padding:3.6em .8em 0;display:flex;align-items:center;gap:.5em;background:#fff;border-bottom:1px solid #e5e7ea}
.u-th .u-bk{font-size:1.5em;line-height:1;color:#111;width:1em}
.u-th .nm{flex:1;display:flex;align-items:center;gap:.35em;font-weight:800;font-size:1.06em;min-width:0}
.u-th .nm span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.u-th .vb{width:1.05em;height:1.05em;border-radius:50%;background:#00b900;color:#fff;font-size:.62em;display:grid;place-items:center;flex:none}
.u-th .ic{display:flex;gap:.8em;color:#222}.u-th .ic svg{width:1.35em;height:1.35em}
.u-chat{flex:1;overflow:hidden;padding:.8em .8em .4em;display:flex;flex-direction:column;justify-content:flex-end;gap:.55em}
.u-day{align-self:center;font-size:.72em;color:#fff;background:rgba(0,0,0,.14);border-radius:1em;padding:.1em .8em}
.u-row{display:flex;gap:.5em;align-items:flex-end}
.u-av{width:2.4em;height:2.4em;border-radius:50%;flex:none;display:grid;place-items:center;color:#fff;font:800 .95em Inter,"Noto Sans JP";align-self:flex-start}
.u-bub{background:#fff;border-radius:1.2em;padding:.65em .9em;max-width:72%;font-size:.92em;line-height:1.55;box-shadow:0 1px 1px rgba(0,0,0,.05)}
.u-bub.me{background:#86e06b;margin-left:auto}
.u-tm{font-size:.62em;color:#eef2f8;white-space:nowrap}
.u-card{background:#fff;border-radius:1.1em;overflow:hidden;width:78%;box-shadow:0 1px 2px rgba(0,0,0,.08)}
.u-card .h{display:flex;align-items:center;gap:.45em;padding:.6em .8em;border-bottom:1px solid #eef0f2;font-size:.78em;font-weight:800;color:#444}
.u-card .h i{width:1.5em;height:1.5em;border-radius:.45em;color:#fff;font:800 .9em Inter;font-style:normal;display:grid;place-items:center}
.u-card .b{padding:.75em .9em .8em;font-size:.86em;line-height:1.6}
.u-card .b b{display:block;font-size:1.12em;margin-bottom:.15em}
.u-card .kv{display:flex;justify-content:space-between;border-top:1px solid #f0f0f0;padding:.3em 0 0;margin-top:.35em;font-size:.88em;color:#777}.u-card .kv em{font-style:normal;color:#111;font-weight:700}
.u-card .bt{display:block;text-align:center;padding:.7em;border-top:1px solid #eef0f2;color:#2f6fd1;font-weight:800;font-size:.85em}
.u-card .pg{height:.45em;border-radius:.3em;background:#eee;margin-top:.5em;overflow:hidden}.u-card .pg i{display:block;height:100%;border-radius:.3em}
.u-in{flex:none;display:flex;align-items:center;gap:.6em;padding:.55em .8em;background:#fff;border-top:1px solid #e7e9ec;color:#888;font-size:.86em}
.u-in .f{flex:1;height:2.3em;border-radius:1.2em;background:#f1f2f4;display:flex;align-items:center;padding:0 1em;color:#aaa}
.u-in svg{width:1.5em;height:1.5em}
.u-rm{flex:none;background:#fff;position:relative}
.u-rmg{display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(2,5.4em);gap:1px;background:#e9e9e9}
.u-rmg .t{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.25em;font-size:.82em;font-weight:800;color:#fff;overflow:hidden;cursor:pointer;border:0;font-family:inherit;padding:0}
.u-rmg .t svg{width:2em;height:2em}
.u-rmg .t.big{grid-column:span 2}
.u-rmg .t:after{content:"";position:absolute;inset:0;background:rgba(255,255,255,0);transition:.2s}
.u-rmg .t.hot:after{background:rgba(255,255,255,.28)}
.u-rmb{display:flex;justify-content:center;align-items:center;gap:.4em;height:2.3em;font-size:.78em;color:#555;border-top:1px solid #eee;padding-bottom:.6em}
.u-tap{position:absolute;width:3.6em;height:3.6em;border-radius:50%;border:.22em solid rgba(255,255,255,.95);box-shadow:0 0 0 .2em rgba(0,0,0,.08);z-index:25;pointer-events:none;opacity:0;transform:translate(-50%,-50%) scale(.6);transition:.35s}
.u-tap.on{opacity:1;transform:translate(-50%,-50%) scale(1);animation:utap 1.2s ease-out infinite}
@keyframes utap{0%{box-shadow:0 0 0 0 rgba(255,255,255,.7)}100%{box-shadow:0 0 0 1.4em rgba(255,255,255,0)}}
.u-sh{position:absolute;left:0;right:0;bottom:0;top:4.4em;z-index:15;background:#fff;border-radius:1.2em 1.2em 0 0;display:flex;flex-direction:column;overflow:hidden;transform:translateY(105%);transition:transform .55s cubic-bezier(.2,.8,.2,1);box-shadow:0 -1em 3em -1em rgba(0,0,0,.35)}
.u-sh.on{transform:none}
.u-mh{flex:none;height:3.3em;display:flex;align-items:center;gap:.5em;padding:0 .7em 0 .9em;border-bottom:1px solid #eee;font-weight:800;font-size:.95em}
.u-mh i{width:1.7em;height:1.7em;border-radius:.5em;color:#fff;font:800 .85em Inter,"Noto Sans JP";font-style:normal;display:grid;place-items:center;flex:none}
.u-mh span{flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.u-mh .r{display:flex;gap:.35em}
.u-mh .r b,.u-mh .r button{min-width:2.4em;height:1.9em;border-radius:1em;background:#f1f3f2;display:grid;place-items:center;font-size:.8em;color:#444;border:0;padding:0 .6em;font-family:inherit;cursor:pointer}
.u-body{flex:1;overflow:hidden;position:relative}
.u-body iframe{position:absolute;inset:0;width:100%;height:100%;border:0;background:#fff}
.u-mm{padding:1em;height:100%;overflow:hidden}
.u-toast{position:absolute;left:50%;top:5em;transform:translate(-50%,-.6em);opacity:0;z-index:26;background:rgba(20,22,24,.9);color:#fff;font-size:.82em;font-weight:700;padding:.6em 1em;border-radius:1em;white-space:nowrap;display:flex;align-items:center;gap:.4em;transition:.35s}
.u-toast.on{opacity:1;transform:translate(-50%,0)}
.u-toast svg{width:1.2em;height:1.2em;color:#7ee0a3}
.u-new{animation:unew .5s cubic-bezier(.2,.8,.2,1)}
@keyframes unew{from{opacity:0;transform:translateY(1em) scale(.96)}}
/* mini app parts */
.m-card{border-radius:1.1em;padding:1em 1.1em;color:#fff;position:relative;overflow:hidden}
.m-card small{font-size:.7em;opacity:.85;letter-spacing:.12em;font-weight:700}
.m-card b{display:block;font-size:1.15em;letter-spacing:.06em;margin:.5em 0 .1em}
.m-card .no{font:600 .72em Inter;letter-spacing:.18em;opacity:.85}
.m-card:after{content:"";position:absolute;right:-2em;top:-2em;width:7em;height:7em;border-radius:50%;background:rgba(255,255,255,.1)}
.m-stamp{display:grid;grid-template-columns:repeat(5,1fr);gap:.45em;margin-top:.9em}
.m-stamp i{aspect-ratio:1;border-radius:50%;display:grid;place-items:center;font-style:normal;font-size:.7em}
.m-stamp i.on{color:#fff}
.m-stamp i.off{border:.12em dashed #d8c9b6;color:#d8c9b6}
.m-stamp i.pop{animation:mpop .5s cubic-bezier(.2,.8,.2,1.4)}
@keyframes mpop{from{transform:scale(2.2);opacity:0}}
.m-stamp svg{width:1.5em;height:1.5em}
.m-h{display:flex;justify-content:space-between;align-items:baseline;margin:1em 0 .2em;font-size:.86em;font-weight:800}
.m-h small{font-size:.8em;color:#888;font-weight:700}
.m-qr{display:flex;gap:.8em;align-items:center;border:1px solid #eee;border-radius:1em;padding:.7em;margin-top:.8em}
.m-qr .q{width:4.6em;flex:none}
.m-qr div b{display:block;font:700 .95em Inter;letter-spacing:.06em}
.m-qr div small{font-size:.7em;color:#888}
.m-cp{display:flex;align-items:center;gap:.7em;border-radius:1em;padding:.7em .8em;margin-top:.7em;color:#fff}
.m-cp b{font-size:.86em}.m-cp small{display:block;font-size:.7em;opacity:.85}
.m-cp em{margin-left:auto;font-style:normal;font-size:.72em;font-weight:800;background:rgba(255,255,255,.2);border-radius:1em;padding:.2em .7em}
.m-days{display:flex;gap:.35em;margin:.6em 0}
.m-days span{flex:1;text-align:center;border:1px solid #eee;border-radius:.7em;padding:.35em 0;font:700 .9em Inter}
.m-days span small{display:block;font:700 .7em "Noto Sans JP";color:#999}
.m-days span.on{color:#fff}
.m-sl{display:grid;grid-template-columns:repeat(3,1fr);gap:.35em}
.m-sl span{text-align:center;border:1px solid #eee;border-radius:.6em;padding:.45em 0;font:700 .8em Inter}
.m-sl span.x{color:#ccc;text-decoration:line-through;background:#fafafa}
.m-sl span.on{color:#fff}
.m-li{display:flex;gap:.7em;align-items:center;padding:.55em 0;border-bottom:1px solid #f1f1f1}
.m-li i{width:3.2em;height:3.2em;border-radius:.7em;background:#eee center/cover;flex:none}
.m-li b{display:block;font-size:.86em}.m-li small{font-size:.72em;color:#888}
.m-li em{margin-left:auto;font:700 .82em Inter;font-style:normal}
.m-btn{display:block;text-align:center;color:#fff;font-weight:800;font-size:.86em;border-radius:.8em;padding:.75em 0;margin-top:.8em}
.m-big{font:800 3em/1 Inter;letter-spacing:-.02em}
.m-dots{display:flex;gap:.25em;margin-top:.6em}.m-dots i{flex:1;height:.4em;border-radius:.2em;background:rgba(255,255,255,.3)}.m-dots i.on{background:#fff}
`;
var st=document.createElement('style');st.textContent=CSS;document.head.appendChild(st);

var SVG={
 home:'<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',
 card:'<rect x="2.5" y="5" width="19" height="14" rx="3"/><path d="M2.5 10h19M6 15h4"/>',
 star:'<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
 gift:'<rect x="3" y="9" width="18" height="12" rx="2"/><path d="M12 9v12M3 13h18M12 9C10 4 6 5 7.5 8M12 9c2-5 6-4 4.5-1"/>',
 cal:'<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/>',
 cup:'<path d="M4 8h13v5a6 6 0 0 1-6 6h-1a6 6 0 0 1-6-6z"/><path d="M17 10h1.5a2.5 2.5 0 0 1 0 5H17"/>',
 bag:'<path d="M5 8h14l-1 13H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
 pin:'<path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
 ticket:'<path d="M3 8a2 2 0 0 0 0 4 2 2 0 0 1 0 4v2h18v-2a2 2 0 0 1 0-4 2 2 0 0 0 0-4V6H3z"/>',
 bowl:'<path d="M3 11h18a9 9 0 0 1-18 0z"/><path d="M7 7c0-2 2-2 2-4M12 7c0-2 2-2 2-4"/>',
 user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
 qr:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><path d="M14 14h3v3h-3zM18 18h3v3h-3z"/>',
 srch:'<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
 phone:'<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
 menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',
 cam:'<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
 smile:'<circle cx="12" cy="12" r="9"/><path d="M8.5 14a4 4 0 0 0 7 0M9 9.5h.01M15 9.5h.01"/>',
 check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',
 ln:'<path fill="currentColor" stroke="none" d="M12 3C6.5 3 2 6.6 2 11c0 3.9 3.5 7.2 8.3 7.9.3.1.8.2.9.5.1.3.1.7 0 1l-.1.9c0 .3-.2 1 .9.5s6-3.5 8.2-6C21.4 14.3 22 12.7 22 11c0-4.4-4.5-8-10-8z"/>'
};
function I(n,f){return '<svg viewBox="0 0 24 24" fill="'+(f?'currentColor':'none')+'" stroke="currentColor" stroke-width="'+(f?0:1.9)+'" stroke-linecap="round" stroke-linejoin="round">'+SVG[n]+'</svg>'}
function qr(seed,c){var n=21,s='',r=seed||7;function R(){r=(r*9301+49297)%233280;return r/233280}
 function F(x,y){return 'M'+x+' '+y+'h7v7h-7zM'+(x+2)+' '+(y+2)+'h3v3h-3z'}
 for(var y=0;y<n;y++)for(var x=0;x<n;x++){if((x<8&&y<8)||(x>12&&y<8)||(x<8&&y>12))continue;if(R()>.5)s+='M'+x+' '+y+'h1v1h-1z'}
 return '<svg viewBox="-1 -1 23 23" style="display:block;width:100%"><path d="'+s+F(0,0)+F(14,0)+F(0,14)+'" fill="'+(c||'#111')+'" fill-rule="evenodd"/><path d="M1 1h5v5h-5zM15 1h5v5h-5zM1 15h5v5h-5z" fill="none" stroke="#fff" stroke-width="1"/></svg>'}

var SHOPS=[
 {k:'cafe',n:'Lumen',full:'Lumen 会員証',c:'#7a4f2c',c2:'#a8754b',ini:'L',hello:'友だち追加ありがとうございます！☕ 下のメニューから、会員証やクーポンがひらけます。',
  rm:[['card','会員証','#7a4f2c',1],['star','スタンプ','#946238'],['gift','クーポン','#b07b4a'],['cup','メニュー','#8a5a32'],['pin','お店の情報','#6b4426'],['bag','オンラインショップ','#a06c40']],app:'card'},
 {k:'salon',n:'HAIR ROOM sora',full:'sora 予約',c:'#2f6f73',c2:'#4d9599',ini:'S',hello:'sora です。ご予約・カルテ・クーポンは下のメニューからどうぞ。',
  rm:[['cal','予約する','#2f6f73',1],['user','マイページ','#3d7e82'],['gift','クーポン','#4d8f93'],['star','スタイル','#2a6467'],['pin','アクセス','#356f73'],['phone','お問い合わせ','#447f83']],app:'book'},
 {k:'food',n:'まんぷく亭',full:'まんぷく亭 テイクアウト',c:'#e2572b',c2:'#f08a4b',ini:'ま',hello:'まんぷく亭です。テイクアウトの事前注文は、下の「注文する」から。',
  rm:[['bowl','注文する','#e2572b',1],['card','会員証','#d14c22'],['gift','クーポン','#ec6a3b'],['cup','メニュー','#c9461f'],['pin','お店の情報','#e0592c'],['phone','電話する','#d65128']],app:'order'},
 {k:'seitai',n:'からだ整骨院',full:'からだ整骨院',c:'#2f63b0',c2:'#4b8be0',ini:'か',hello:'からだ整骨院です。回数券の残りや次回のご予約は、下のメニューから確認できます。',
  rm:[['ticket','回数券','#2f63b0',1],['cal','予約する','#3a6fbd'],['user','マイページ','#2b5aa0'],['star','セルフケア','#4479c4'],['pin','アクセス','#3366b3'],['phone','電話する','#2f5fa8']],app:'ticket'}
];
var DEMO={n:'サクアプ デモ',ini:'サ',c:'#0a8f45',hello:'サクアプのデモへようこそ！下のメニューから、業種ごとのミニアプリを開いて触ってみてください。',
 rm:[['card','カフェ会員証','#7a4f2c',0,1,'Lumen 会員証'],['cal','サロン予約','#2f6f73',0,0,'sora 予約'],['bowl','テイクアウト','#e2572b',0,6,'まんぷく亭'],['ticket','回数券','#2f63b0',0,4,'からだ整骨院'],['bag','ネットショップ','#151515',0,5,'A.I.T STORE'],['ticket','イベント','#6b4fd8',0,7,'クラフトマーケット']]};

function sbar(){return '<div class="u-sb"><span>9:41</span><i><svg viewBox="0 0 18 12"><rect x="0" y="8" width="3" height="4" rx=".8"/><rect x="5" y="5" width="3" height="7" rx=".8"/><rect x="10" y="2.5" width="3" height="9.5" rx=".8"/><rect x="15" y="0" width="3" height="12" rx=".8"/></svg><svg viewBox="0 0 27 12"><rect x=".5" y=".5" width="23" height="11" rx="3.2" fill="none" stroke="currentColor" opacity=".4"/><rect x="2" y="2" width="18" height="8" rx="2"/></svg></i></div>'}
function talkHead(sh){return '<div class="u-th"><span class="u-bk">‹</span><span class="nm"><span>'+sh.n+'</span><i class="vb">✓</i></span><span class="ic">'+I('srch')+I('phone')+I('menu')+'</span></div>'}
function rich(sh,hot){return '<div class="u-rm"><div class="u-rmg">'+sh.rm.map(function(t,i){return '<button type="button" class="t'+(i===hot?' hot':'')+'" data-i="'+i+'" style="background:'+t[2]+'">'+I(t[0])+'<span>'+t[1]+'</span></button>'}).join('')+'</div><div class="u-rmb">メニュー ▾</div></div>'}
function input(){return '<div class="u-in">'+I('plus')+I('cam')+'<span class="f">Aa</span>'+I('smile')+'</div>'}
function shopRow(sh,html,tm){return '<div class="u-row"><span class="u-av" style="background:'+sh.c+'">'+sh.ini+'</span>'+html+'<span class="u-tm">'+(tm||'')+'</span></div>'}
function svc(sh,title,body,btn,extra){return '<div class="u-row u-new"><span class="u-av" style="background:#00b900">'+I('ln',1).replace('<svg','<svg style="width:1.4em;height:1.4em"')+'</span><div class="u-card"><div class="h"><i style="background:'+sh.c+'">'+sh.ini+'</i>'+sh.full+'</div><div class="b"><b>'+title+'</b>'+body+(extra||'')+'</div><span class="bt">'+btn+'</span></div></div>'}
function miniHead(sh,closeBtn){return '<div class="u-mh"><i style="background:'+sh.c+'">'+sh.ini+'</i><span>'+sh.full+'</span><span class="r"><b>···</b>'+(closeBtn?'<button type="button" data-x aria-label="閉じる">✕</button>':'<b>✕</b>')+'</span></div>'}

function mini(sh,kind,o){o=o||{};var c=sh.c,h='';
 if(kind==='card'){var n=o.stamps||7,s='';for(var i=0;i<10;i++){var on=i<n;s+='<i class="'+(on?'on':'off')+(on&&i===n-1&&o.pop?' pop':'')+'" style="'+(on?'background:'+c:'')+'">'+(i===9?I('gift'):on?I('star',1):(i+1))+'</i>'}
  h='<div class="m-card" style="background:linear-gradient(135deg,'+c+','+sh.c2+')"><small>MEMBERS CARD</small><b>YAMADA HANAKO</b><span class="no">No. 0012-4589</span></div><div class="m-h">スタンプカード<small>'+n+' / 10</small></div><div class="m-stamp">'+s+'</div><div class="m-qr"><span class="q">'+qr(19,'#2a211b')+'</span><div><b>0012-4589</b><small>お会計のときにこの画面を見せてください</small></div></div><div class="m-cp" style="background:'+sh.c2+'"><span><small>会員限定</small><b>季節のタルト 50円引き</b></span><em>使う</em></div>'}
 if(kind==='book'){h='<div class="m-h" style="margin-top:0">メニュー</div><div class="m-li"><i style="background-image:url(../salon/img/st4.webp)"></i><span><b>カット＋カラー</b><small>120分</small></span><em>¥12,100</em></div><div class="m-li"><i style="background-image:url(../salon/img/st9.webp)"></i><span><b>カット</b><small>60分</small></span><em>¥5,500</em></div><div class="m-h">日にち<small>11月</small></div><div class="m-days">'+[['金',6],['土',7],['日',8],['月',9],['火',10]].map(function(d,i){return '<span class="'+(i===1?'on':'')+'" style="'+(i===1?'background:'+c+';border-color:'+c:'')+'"><small>'+d[0]+'</small>'+d[1]+'</span>'}).join('')+'</div><div class="m-sl">'+['10:00','11:30','13:00','14:00','15:30','17:00'].map(function(t,i){return '<span class="'+(i===3?'on':i===1||i===4?'x':'')+'" style="'+(i===3?'background:'+c+';border-color:'+c:'')+'">'+t+'</span>'}).join('')+'</div><span class="m-btn" style="background:'+c+'">11/7（土）14:00 で予約する</span>'}
 if(kind==='order'){h='<div class="m-h" style="margin-top:0">人気のメニュー<small>約15分で受け取り</small></div>'+[['../menu/img/pork.webp','生姜焼き弁当','国産豚・大盛り無料',780],['../menu/img/saba.webp','焼きさば弁当','脂ののった国産さば',820],['../menu/img/yakitori.webp','焼き鳥丼','炭火焼き・たれ',850],['../menu/img/tamagoyaki.webp','だし巻き玉子','6切れ',380]].map(function(m){return '<div class="m-li"><i style="background-image:url('+m[0]+')"></i><span><b>'+m[1]+'</b><small>'+m[2]+'</small></span><em>¥'+m[3]+'</em></div>'}).join('')+'<span class="m-btn" style="background:'+c+';display:flex;justify-content:space-between;padding:.75em 1em"><span>2点</span><span>注文へ進む</span><span>¥1,600</span></span>'}
 if(kind==='ticket'){h='<div class="m-card" style="background:linear-gradient(135deg,'+c+','+sh.c2+')"><small>10回券 ・ 2027/3/31まで</small><div style="display:flex;align-items:baseline;gap:.3em;margin:.4em 0 .2em"><span class="m-big">3</span><span style="font-size:.86em">回 残っています</span></div><div class="m-dots">'+Array.from({length:10},function(_,i){return '<i class="'+(i<3?'on':'')+'"></i>'}).join('')+'</div></div><div class="m-h">次回のご予約</div><div class="m-li"><i style="background:#eaf0fa;display:grid;place-items:center;color:'+c+'">'+I('cal').replace('<svg','<svg style="width:1.5em;height:1.5em"')+'</i><span><b>11/12（水）18:30</b><small>全身調整 ・ 40分</small></span><em style="color:'+c+'">変更</em></div><div class="m-h">ご利用履歴</div><div class="m-li"><span><b>全身調整</b><small>10/29</small></span><em>−1回</em></div><div class="m-li"><span><b>骨盤ケア</b><small>10/15</small></span><em>−1回</em></div>'}
 return '<div class="u-mm">'+h+'</div>'}

/* screen builder: talk + optional sheet */
function Screen(el,sh,opt){opt=opt||{};this.el=el;this.sh=sh;this.msgs=[];this.o=opt;this.build()}
Screen.prototype.build=function(){var sh=this.sh;
 this.el.innerHTML=sbar()+'<div class="u-talk">'+talkHead(sh)+'<div class="u-chat"></div>'+(this.o.noRich?input():rich(sh,-1))+'</div><i class="u-tap"></i><div class="u-sh">'+miniHead(sh,this.o.closable)+'<div class="u-body"></div></div><div class="u-toast"></div>';
 this.chat=this.el.querySelector('.u-chat');this.sheet=this.el.querySelector('.u-sh');this.body=this.el.querySelector('.u-body');this.tap=this.el.querySelector('.u-tap');this.toastEl=this.el.querySelector('.u-toast');this.rm=this.el.querySelector('.u-rm')};
Screen.prototype.setChat=function(html){this.chat.innerHTML=html};
Screen.prototype.add=function(html){this.chat.insertAdjacentHTML('beforeend',html);var kids=this.chat.children;while(this.chat.scrollHeight>this.chat.clientHeight+4&&kids.length>2)kids[0].remove()};
Screen.prototype.hot=function(i){if(!this.rm)return;var ts=this.rm.querySelectorAll('.t');[].forEach.call(ts,function(t,j){t.classList.toggle('hot',j===i)});
 if(i<0){this.tap.classList.remove('on');return}var t=ts[i],r=t.getBoundingClientRect(),R=this.el.getBoundingClientRect();if(!R.width)return;this.tap.style.left=((r.left+r.width/2-R.left)/R.width*100)+'%';this.tap.style.top=((r.top+r.height/2-R.top)/R.height*100)+'%';this.tap.classList.add('on')};
Screen.prototype.open=function(html,head){if(head)this.sheet.querySelector('.u-mh').outerHTML=head;if(html!=null)this.body.innerHTML=html;this.sheet.classList.add('on')};
Screen.prototype.close=function(){this.sheet.classList.remove('on')};
Screen.prototype.toast=function(m){var t=this.toastEl;t.innerHTML=I('check')+'<span>'+m+'</span>';t.classList.add('on');clearTimeout(this._tt);this._tt=setTimeout(function(){t.classList.remove('on')},1800)};

function greet(sh){return '<span class="u-day">今日</span>'+shopRow(sh,'<div class="u-bub">'+sh.hello+'</div>','10:02')}
var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- STORY ---------- */
function story(id,auto,list){var el=document.getElementById(id);if(!el)return null;var sh=SHOPS[0],s=new Screen(el,sh),cur=-1;
 function set(i){if(i===cur)return;cur=i;
  if(i<=1){s.close();s.setChat('<span class="u-day">今日</span><div class="u-row"><div class="u-bub me" style="font-size:.8em">友だち追加しました</div></div>'+shopRow(sh,'<div class="u-bub">'+sh.hello+'</div>','10:02'));s.hot(i===1?0:-1);if(i===0)s.toast('友だちに追加しました')}
  if(i===2){s.hot(-1);s.open(mini(sh,'card',{stamps:7}))}
  if(i===3){s.hot(-1);s.open(mini(sh,'card',{stamps:8,pop:1}));setTimeout(function(){s.toast('スタンプを押しました（8/10）')},300)}
  if(i===4){s.hot(-1);s.close();setTimeout(function(){s.add(svc(sh,'スタンプが押されました','あと2個でドリンク1杯無料です。','スタンプカードを見る','<div class="pg"><i style="width:80%;background:'+sh.c+'"></i></div>'))},350)}
  if(list)[].forEach.call(list.children,function(li){li.classList.toggle('on',+li.dataset.s===i)})}
 set(0);
 return {set:set}}
var hero=story('heroPh');
(function(){var L=document.getElementById('hpL'),R=document.getElementById('hpR');
 if(L){var sl=new Screen(L,SHOPS[1]);sl.setChat(greet(SHOPS[1]));sl.sheet.style.transition='none';sl.open(mini(SHOPS[1],'book'))}
 if(R){var sr=new Screen(R,SHOPS[2]);sr.setChat(greet(SHOPS[2]));sr.sheet.style.transition='none';sr.open(mini(SHOPS[2],'order'))}})();
if(hero){var hi=0;if(!RM)setInterval(function(){hi=(hi+1)%5;hero.set(hi)},2300)}
var stl=document.getElementById('stl'),sto=story('storyPh',0,stl);
if(sto&&stl){var lis=[].slice.call(stl.children),MOB=matchMedia('(max-width:860px)');
 /* PC: scroll-driven sticky story */
 if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){if(MOB.matches)return;es.forEach(function(e){if(e.isIntersecting)sto.set(+e.target.dataset.s)})},{rootMargin:'-45% 0px -45% 0px'});lis.forEach(function(li){io.observe(li)})}
 /* mobile: every step side by side (no screen swapping) */
 var cs=document.createElement('div');cs.className='st-cs';
 cs.innerHTML=lis.map(function(li,i){return '<div class="st-c"><div class="ph2"><div class="ph2s" id="stc'+i+'"></div></div><em>'+li.querySelector('em').textContent+'</em><b>'+li.querySelector('b').textContent+'</b><p>'+li.querySelector('p').textContent+'</p></div>'}).join('');
 stl.parentNode.parentNode.appendChild(cs);
 var built=false;function build(){if(built||!MOB.matches)return;built=true;lis.forEach(function(_,i){var x=story('stc'+i);if(x){x.set(i===3?2:i);if(i===3)setTimeout(function(){x.set(3)},50)}});
  [].forEach.call(cs.querySelectorAll('.u-sh'),function(el){el.style.transition='none'})}
 build();MOB.addEventListener&&MOB.addEventListener('change',build);
 lis.forEach(function(li){li.addEventListener('click',function(){sto.set(+li.dataset.s)})})}

/* ---------- RICH MENU ---------- */
var rp=document.getElementById('richPh');
if(rp){var rs,ri=0,rt;function showR(i){ri=i;var sh=SHOPS[i];rs=new Screen(rp,sh);rs.setChat(greet(sh));
  var k=0;clearInterval(rt);if(!RM)rt=setInterval(function(){rs.hot(k%6);k++},1100);
  [].forEach.call(document.querySelectorAll('#rtabs button'),function(b){b.classList.toggle('on',+b.dataset.i===i)})}
 showR(0);[].forEach.call(document.querySelectorAll('#rtabs button'),function(b){b.addEventListener('click',function(){showR(+b.dataset.i)})})}

/* ---------- MINI APP grid ---------- */
var mk=document.getElementById('mkg');
if(mk){var L=[[0,'card','会員証・スタンプ','カフェ・パン屋・小売店'],[1,'book','予約・リマインド','サロン・整体・教室'],[2,'order','テイクアウト注文','飲食店・お弁当'],[3,'ticket','回数券・次回予約','整体・スクール']];
 mk.innerHTML=L.map(function(x,i){return '<div class="mkc"><div class="mki"><div class="ph2"><div class="ph2s" id="mk'+i+'"></div></div></div><b>'+x[2]+'</b><small>'+x[3]+'</small></div>'}).join('');
 L.forEach(function(x,i){var sh=SHOPS[x[0]],s=new Screen(document.getElementById('mk'+i),sh);s.setChat(greet(sh));s.open(mini(sh,x[1]));s.sheet.style.transition='none'})}

/* ---------- MESSAGE ---------- */
var mp=document.getElementById('msgPh');
if(mp){var LS={n:'LINEミニアプリ通知',ini:'',c:'#00b900',rm:[]};var s=new Screen(mp,LS,{noRich:1});
 s.el.querySelector('.u-th .nm').innerHTML='<span>LINEミニアプリ通知</span>';s.el.querySelector('.u-th .ic').innerHTML='';
 var M=[[SHOPS[1],'ご予約が確定しました','11月7日（土）14:00','予約内容を見る','<div class="kv"><span>メニュー</span><em>カット＋カラー</em></div><div class="kv"><span>担当</span><em>佐藤</em></div>','10:00'],
  [SHOPS[2],'できあがりました','受け取り番号 <b style="display:inline;font-size:1em">#031</b> ・ 店頭でお受け取りください','注文を確認する','','12:16'],
  [SHOPS[0],'クーポンが届きました','スタンプが10個たまりました。ドリンク1杯無料です。','クーポンを使う','','15:40']];
 var mi=0;function nxt(){var m=M[mi%3];s.add('<span class="u-day">'+m[5]+'</span>'+svc(m[0],m[1],'<span style="display:block">'+m[2]+'</span>',m[3],m[4]));mi++}
 nxt();nxt();if(!RM)setInterval(nxt,3200)}

/* ---------- DEMO ---------- */
var dp=document.getElementById('demoPh');
if(dp){var ds=new Screen(dp,DEMO,{closable:1});ds.setChat(greet(DEMO)+'<div class="u-row" style="justify-content:center"><span class="u-day" style="background:rgba(0,0,0,.25)">↓ 下のメニューをタップ</span></div>');var opened=null;
 dp.addEventListener('click',function(e){var t=e.target.closest('.u-rmg .t');if(t){var r=DEMO.rm[+t.dataset.i];opened=r;
   var head='<div class="u-mh"><i style="background:'+r[2]+'">'+r[5].charAt(0)+'</i><span>'+r[5]+'</span><span class="r"><b>···</b><button type="button" data-x aria-label="閉じる">✕</button></span></div>';
   ds.open('<iframe title="'+r[1]+'のミニアプリ" src="../templates/app.html?v=20261111d&bare=1&k='+r[4]+'"></iframe>',head);return}
  if(e.target.closest('[data-x]')){ds.close();var r2=opened;if(r2){setTimeout(function(){ds.add(svc({c:r2[2],ini:r2[5].charAt(0),full:r2[5]},'ご利用ありがとうございました','また開くときは、下のメニューからどうぞ。','もう一度ひらく'))},450)}}
 })}

/* full-screen demo (mobile) */
var fo=document.getElementById('dfsOpen'),fs=document.getElementById('dfs'),fbd=document.getElementById('dfsBody'),dhome=dp&&dp.parentNode;
function fsOpen(){if(!dp)return;fbd.appendChild(dp);fs.hidden=false;document.body.classList.add('dfs-on')}
function fsClose(){if(!dp)return;dhome.appendChild(dp);fs.hidden=true;document.body.classList.remove('dfs-on')}
if(fo)fo.addEventListener('click',fsOpen);var fc=document.getElementById('dfsClose');if(fc)fc.addEventListener('click',fsClose);
/* hide floating bar while the demo is on screen */
var demoSec=document.getElementById('demo'),demoIn=false;
if(demoSec&&'IntersectionObserver' in window){new IntersectionObserver(function(es){demoIn=es[0].isIntersecting;sc()},{threshold:.15}).observe(demoSec)}
/* header / floating / reveal */
var hd=document.getElementById('hd'),fb=document.getElementById('fbar'),he=document.querySelector('.lx');
function sc(){var y=scrollY;if(hd)hd.classList.toggle('solid',y>40);if(fb&&he)fb.classList.toggle('on',y>he.offsetHeight*.7&&!demoIn)}
addEventListener('scroll',sc,{passive:true});sc();
var els=document.querySelectorAll('.rv,.stg');
if('IntersectionObserver' in window){var o2=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');o2.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px',threshold:.08});els.forEach(function(el){o2.observe(el)})}else [].forEach.call(els,function(el){el.classList.add('in')});
})();
