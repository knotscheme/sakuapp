/* サクアプ テンプレート 操作デモ用の小さなアプリエンジン */
var APPS=[];
var P={
 home:'<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',
 cal:'<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/>',
 user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
 users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14a6.5 6.5 0 0 1 3.5 6"/>',
 bag:'<path d="M5 8h14l-1 13H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
 ticket:'<path d="M3 8a2 2 0 0 0 0 4 2 2 0 0 1 0 4v2h18v-2a2 2 0 0 1 0-4 2 2 0 0 0 0-4V6H3z"/><path d="M14 6v12" stroke-dasharray="2 2"/>',
 chart:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
 chat:'<path d="M4 5h16v11H9l-5 4z"/>',
 star:'<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
 bell:'<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 21h4"/>',
 srch:'<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
 heart:'<path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7a4.3 4.3 0 0 1 7.5 2.8C19.5 15.4 12 20 12 20z"/>',
 back:'<path d="M15 5l-7 7 7 7"/>',
 chev:'<path d="M9 5l7 7-7 7"/>',
 x:'<path d="M6 6l12 12M18 6L6 18"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',
 minus:'<path d="M5 12h14"/>',
 check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',
 gift:'<rect x="3" y="9" width="18" height="12" rx="2"/><path d="M12 9v12M3 13h18M12 9C10 4 6 5 7.5 8M12 9c2-5 6-4 4.5-1"/>',
 pin:'<path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 video:'<rect x="3" y="6" width="13" height="12" rx="3"/><path d="M16 10l5-3v10l-5-3"/>',
 qr:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><path d="M14 14h3v3h-3zM18 18h3v3h-3zM18 14h3M14 18v3"/>',
 card:'<rect x="2.5" y="5" width="19" height="14" rx="3"/><path d="M2.5 10h19M6 15h4"/>',
 gear:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
 send:'<path d="M4 12l16-8-6 17-3-7z"/>',
 cam:'<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
 grid:'<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
 list:'<path d="M8 6h13M8 12h13M8 18h13"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/>',
 bolt:'<path d="M13 3L5 14h6l-1 7 8-11h-6z"/>',
 cup:'<path d="M4 8h13v5a6 6 0 0 1-6 6h-1a6 6 0 0 1-6-6z"/><path d="M17 10h1.5a2.5 2.5 0 0 1 0 5H17"/>',
 bowl:'<path d="M3 11h18a9 9 0 0 1-18 0z"/><path d="M7 7c0-2 2-2 2-4M12 7c0-2 2-2 2-4"/>',
 trash:'<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
 edit:'<path d="M4 20h4L19 9l-4-4L4 16z"/>',
 cmt:'<path d="M20 12a8 8 0 0 1-11.6 7.1L4 20l1-4.2A8 8 0 1 1 20 12z"/>',
 share:'<path d="M4 12v8h16v-8M12 3v12M7 8l5-5 5 5"/>',
 bkm:'<path d="M6 4h12v17l-6-4-6 4z"/>',
 dumb:'<path d="M3 10v4M6 7v10M18 7v10M21 10v4M6 12h12"/>',
 fire:'<path d="M12 21c4 0 7-2.7 7-6.5 0-3.5-2.5-5.5-4-8-1 2-2 3-3.5 3 0-2-1-4-3-6.5C8 6 5 9 5 14.5 5 18.3 8 21 12 21z"/>',
 lock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
 filter:'<path d="M3 5h18l-7 8v6l-4 2v-8z"/>',
 store:'<path d="M3 9l2-5h14l2 5M4 9v11h16V9M3 9h18M9 20v-6h6v6"/>',
 phone:'<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
 mic:'<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
 more:'<circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/>',
 yen:'<path d="M6 4l6 8 6-8M12 12v8M8 13h8M8 17h8"/>',
 receipt:'<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6M9 16h4"/>',
 truck:'<path d="M2 6h12v10H2zM14 10h4l3 3v3h-7z"/><circle cx="6" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>'
};
function I(n,fill){var p=P[n]||'';return '<svg viewBox="0 0 24 24" fill="'+(fill?'currentColor':'none')+'" stroke="currentColor" stroke-width="'+(fill?0:1.8)+'" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+p+'</svg>'}
function yen(n){return '¥'+Number(n).toLocaleString('ja-JP')}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function bg(u,pos){return 'background-image:url('+u+');background-position:'+(pos||'center')}
function hd(title,o){o=o||{};return '<div class="hd'+(o.left?' l':'')+'">'+(o.back?'<button class="ib" data-back aria-label="戻る">'+I('back')+'</button>':(o.lead||'<span class="ib"></span>'))+'<h1>'+title+'</h1>'+(o.right||'<span class="ib"></span>')+'</div>'}
function qrSvg(seed,dark){var n=25,s='',r=seed||7;function rnd(){r=(r*9301+49297)%233280;return r/233280}
 function fin(x,y){return '<path d="M'+x+' '+y+'h7v7h-7z M'+(x+1)+' '+(y+1)+'h5v5h-5z M'+(x+2)+' '+(y+2)+'h3v3h-3z" fill-rule="evenodd"/>'}
 for(var y=0;y<n;y++)for(var x=0;x<n;x++){if((x<8&&y<8)||(x>16&&y<8)||(x<8&&y>16))continue;if(rnd()>.52)s+='M'+x+' '+y+'h1v1h-1z'}
 return '<svg viewBox="-1 -1 27 27" fill="'+(dark||'#111')+'" style="display:block;width:100%;height:auto"><path d="'+s+'"/>'+fin(0,0)+fin(18,0)+fin(0,18)+'</svg>'}
function barcode(seed){var r=seed||3,s='',x=0;function rnd(){r=(r*9301+49297)%233280;return r/233280}while(x<200){var w=1+Math.floor(rnd()*3);if(rnd()>.4)s+='<rect x="'+x+'" y="0" width="'+w+'" height="40"/>';x+=w+1}return '<svg viewBox="0 0 200 40" preserveAspectRatio="none" style="display:block;width:100%;height:46px" fill="#111">'+s+'</svg>'}

var Engine=(function(){
 var app,S,stack,cur,sc,view,ov,sh,tst,ph,sheetName=null,sheetArg=null,tmT;
 function key(){var t=stack[stack.length-1];return t.id+'|'+JSON.stringify(t.arg==null?'':t.arg)}
 function top(){return stack[stack.length-1]}
 var E={
  go:function(id,arg){stack.push({id:id,arg:arg});render(false)},
  back:function(){if(stack.length>1)stack.pop();render(false)},
  tab:function(id){cur=id;stack=[{id:id}];render(false)},
  replace:function(id,arg){stack[stack.length-1]={id:id,arg:arg};render(false)},
  reset:function(id,arg){cur=app.tabs.some(function(t){return t[0]===id})?id:cur;stack=[{id:id,arg:arg}];render(false)},
  render:function(){render(true)},
  toast:function(m){tst.innerHTML=I('check')+'<span>'+m+'</span>';tst.classList.add('on');clearTimeout(tmT);tmT=setTimeout(function(){tst.classList.remove('on')},2000)},
  sheet:function(n,a){sheetName=n;sheetArg=a;sh.innerHTML=app.sheets[n](a,S,E);sh.scrollTop=0;requestAnimationFrame(function(){ov.classList.add('on');sh.classList.add('on')})},
  resheet:function(){if(sheetName){var y=sh.scrollTop;sh.innerHTML=app.sheets[sheetName](sheetArg,S,E);sh.scrollTop=y}},
  close:function(){sheetName=null;ov.classList.remove('on');sh.classList.remove('on')},
  later:function(ms,f){setTimeout(function(){f();},ms)},
  get S(){return S},
  cur:function(){return top().id}
 };
 function tabbar(){return '<nav class="tbar">'+app.tabs.map(function(t){var b=t[3]?t[3](S):0;return '<button data-tab="'+t[0]+'" class="'+(t[0]===cur?'on':'')+'">'+I(t[2],t[0]===cur&&t[4])+(b?'<span class="bdg">'+b+'</span>':'')+t[1]+'</button>'}).join('')+'</nav>'}
 function render(keep){
  var t=top(),k=key(),old=view.querySelector('.scr'),y=(keep&&old&&old.dataset.k===k)?old.scrollTop:0;
  var fa=document.activeElement,fin=fa&&fa.getAttribute&&fa.getAttribute('data-in'),ss=fin&&fa.selectionStart;
  var noTab=app.noTab&&app.noTab[t.id];
  var html=app.screens[t.id](t.arg,S,E);
  var dark=app.dark&&app.dark[t.id];
  view.innerHTML='<div class="sbar" style="'+(dark?'color:#fff;position:absolute;left:0;right:0;top:0':'')+'"><span>9:41</span><i><svg viewBox="0 0 18 12"><rect x="0" y="8" width="3" height="4" rx=".8"/><rect x="5" y="5" width="3" height="7" rx=".8"/><rect x="10" y="2.5" width="3" height="9.5" rx=".8"/><rect x="15" y="0" width="3" height="12" rx=".8"/></svg><svg viewBox="0 0 27 12"><rect x=".5" y=".5" width="23" height="11" rx="3.2" fill="none" stroke="currentColor" opacity=".4"/><rect x="2" y="2" width="18" height="8" rx="2"/><rect x="24.5" y="4" width="1.6" height="4" rx=".8" opacity=".4"/></svg></i></div>'+
   '<div class="scr" data-k="'+esc(k)+'">'+html+(noTab?'':'<div class="gap"></div>')+'</div>'+(noTab?'':tabbar());
  var nw=view.querySelector('.scr');
  /* iOS Safari: sticky inside a scaled container paints in the wrong place, so dock header/CTA outside the scroll area */
  var h0=nw.firstElementChild;if(h0&&h0.classList.contains('hd')){h0.classList.add('dock');view.insertBefore(h0,nw)}
  var tb=view.querySelector('.tbar');
  [].forEach.call(nw.querySelectorAll(':scope > .cta,:scope > .composer'),function(c){if(c.style.position==='static')return;c.classList.add('dock');view.insertBefore(c,tb||null);nw.style.paddingBottom=(c.offsetHeight+(tb?0:0))+'px'});
  nw.scrollTop=y;
  if(!keep){nw.classList.add('fade')}
  if(fin){var el=view.querySelector('[data-in="'+fin+'"]');if(el){el.focus();try{el.setSelectionRange(ss,ss)}catch(e){}}}
  if(app.mount)app.mount(t.id,view,S,E);
 }
 function fit(){var w=innerWidth-16,h=innerHeight-16,s=Math.min(w/390,h/800);ph.style.zoom=s.toFixed(4);ph.dataset.s=s}
 function onClick(e){
  var el=e.target.closest('[data-go],[data-back],[data-tab],[data-act],[data-sheet],[data-close]');if(!el||!sc.contains(el))return;
  var a=el.getAttribute('data-a');if(a!=null&&/^-?\d+(\.\d+)?$/.test(a))a=+a;
  if(el.hasAttribute('data-close')){E.close();if(!el.hasAttribute('data-act'))return}
  if(el.hasAttribute('data-tab')){E.close();E.tab(el.getAttribute('data-tab'));return}
  if(el.hasAttribute('data-back')){E.back();return}
  if(el.hasAttribute('data-sheet')){E.sheet(el.getAttribute('data-sheet'),a);return}
  if(el.hasAttribute('data-act')){var f=app.act[el.getAttribute('data-act')];if(f){var r=f(a,S,E,el);if(r!==false){render(true);E.resheet()}}return}
  if(el.hasAttribute('data-go')){E.go(el.getAttribute('data-go'),a)}
 }
 function onInput(e){var el=e.target,k=el.getAttribute&&el.getAttribute('data-in');if(!k)return;S[k]=el.value;if(el.hasAttribute('data-live')){render(true)}}
 function onKey(e){if(e.key!=='Enter')return;var el=e.target,a=el.getAttribute&&el.getAttribute('data-enter');if(!a)return;e.preventDefault();var f=app.act[a];if(f){f(null,S,E,el);render(true)}}
 return {E:E,start:function(){
  var q=new URLSearchParams(location.search),k=+(q.get('k')||0);
  app=APPS.filter(function(a){return a.key===k})[0]||APPS[0];
  ph=document.getElementById('ph');sc=document.getElementById('sc');
  for(var v in app.theme)ph.style.setProperty('--'+v,app.theme[v]);
  sc.innerHTML='<div id="view" style="display:flex;flex-direction:column;height:100%;position:relative"></div><div class="ov" data-close></div><div class="sheet"></div><div class="toast"></div>';
  view=sc.querySelector('#view');ov=sc.querySelector('.ov');sh=sc.querySelector('.sheet');tst=sc.querySelector('.toast');
  S=app.init();cur=app.tabs[0][0];stack=[{id:cur}];
  sc.addEventListener('click',onClick);sc.addEventListener('input',onInput);sc.addEventListener('keydown',onKey);addEventListener('keydown',function(e){if(e.key==='Escape')E.close()});
  render(false);fit();addEventListener('resize',fit);
 }};
})();
var E=Engine.E;
