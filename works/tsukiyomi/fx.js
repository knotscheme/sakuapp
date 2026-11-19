// ===== 幻想的な演出（星・金の粒・文字の浮かび上がり・写真の動き） =====
(function(){
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
// 見出しを1文字ずつに分ける（.split）
document.querySelectorAll('.split').forEach(el=>{
  let n=0;const walk=node=>{[...node.childNodes].forEach(c=>{
    if(c.nodeType===3){const f=document.createDocumentFragment();[...c.textContent].forEach(ch=>{if(!ch.trim()){f.append(ch);return}const s=document.createElement('span');s.className='ch';s.textContent=ch;s.style.transitionDelay=(n++*0.05)+'s';f.append(s)});c.replaceWith(f)}
    else if(c.nodeType===1&&c.tagName!=='BR')walk(c)})};walk(el);
});
// ヒーローの見出しは、読み込み後すぐに
setTimeout(()=>document.querySelectorAll('.hero .split .ch').forEach(c=>c.classList.add('go')),250);
// 画面に入ったら .in
// 写真（.wipe）は自分が隠れているので、親の要素で見えたかを判断する
const io2=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){(e.target.__t||e.target).classList.add('in');io2.unobserve(e.target)}}),{threshold:.15});
document.querySelectorAll('.split,.cardui').forEach(el=>{if(!el.closest('.hero'))io2.observe(el)});
document.querySelectorAll('.wipe').forEach(el=>{const p=el.parentElement;p.__t=el;io2.observe(p)});
document.querySelectorAll('.dots i').forEach((d,i)=>d.style.setProperty('--d',i));
if(reduce)return;
// 星と金の粒（キャンバス1枚。画面が見えないときは止める）
const cv=document.getElementById('sky');
if(cv){const x=cv.getContext('2d');let W,H,dpr=Math.min(devicePixelRatio||1,2),stars=[],dust=[];
  const mobile=innerWidth<860;
  const init=()=>{W=cv.width=innerWidth*dpr;H=cv.height=innerHeight*dpr;
    stars=Array.from({length:mobile?40:90},()=>({x:Math.random()*W,y:Math.random()*H,r:(Math.random()*1.1+.3)*dpr,p:Math.random()*6.28,s:.6+Math.random()*1.4}));
    dust=Array.from({length:mobile?7:16},()=>({x:Math.random()*W,y:Math.random()*H,r:(Math.random()*.8+.4)*dpr,v:(.06+Math.random()*.12)*dpr,a:Math.random()*6.28,w:.2+Math.random()*.4}))};
  let lw=innerWidth;init();addEventListener('resize',()=>{if(innerWidth!==lw){lw=innerWidth;init()}});
  let run=true;document.addEventListener('visibilitychange',()=>{run=!document.hidden;if(run)requestAnimationFrame(t)});
  const t=ts=>{if(!run)return;x.clearRect(0,0,W,H);const k=ts/1000;
    for(const s of stars){const a=.15+.4*(.5+.5*Math.sin(k*s.s+s.p));x.fillStyle=`rgba(230,225,210,${a})`;x.beginPath();x.arc(s.x,s.y,s.r,0,6.28);x.fill()}
    for(const d of dust){d.y-=d.v;d.a+=.01;d.x+=Math.sin(d.a)*d.w*dpr*.3;if(d.y<-10){d.y=H+10;d.x=Math.random()*W}
      const g=x.createRadialGradient(d.x,d.y,0,d.x,d.y,d.r*3);g.addColorStop(0,'rgba(240,210,150,.4)');g.addColorStop(1,'rgba(240,210,150,0)');x.fillStyle=g;x.beginPath();x.arc(d.x,d.y,d.r*3,0,6.28);x.fill()}
    requestAnimationFrame(t)};requestAnimationFrame(t)}
// 写真のゆっくりした視差（見えている間だけ）
const par=[...document.querySelectorAll('.par')];let tick=0;
const onScroll=()=>{if(tick)return;tick=requestAnimationFrame(()=>{tick=0;const h=innerHeight;
  for(const el of par){const r=el.parentElement.getBoundingClientRect();if(r.bottom<0||r.top>h)continue;const p=(r.top+r.height/2-h/2)/h;el.style.transform=`translate3d(0,${(p*-(+el.dataset.k||60)).toFixed(1)}px,0)`}})};
addEventListener('scroll',onScroll,{passive:true});onScroll();
// パソコン：マウスのまわりにほのかな灯り
const gl=document.querySelector('.glow');
if(gl&&matchMedia('(pointer:fine)').matches){addEventListener('pointermove',e=>{gl.style.opacity=1;gl.style.left=e.clientX+'px';gl.style.top=e.clientY+'px'},{passive:true})}
})();
