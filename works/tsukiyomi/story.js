// ヒーローの3場面：スクロール位置で「場面」だけを切り替え、動きはCSSのtransitionに任せる（iPhoneでもカクつかない）
// 勢いよくはじいても場面を飛ばさないよう、場面が変わったら1場面ぶんだけ進めて、少しのあいだその場に止める
(function(){
const st=document.querySelector('.story');if(!st)return;
const hv=st.querySelector('.s1 .vid');if(hv){const sp=innerWidth<861;hv.poster=sp?'img/hero-poster-sp.webp':'img/hero-poster.webp';hv.src=sp?'img/hero-sp.mp4?v=2':'img/hero-pc.mp4?v=2';hv.play&&hv.play().catch(()=>{})}
const ind=st.querySelector('.ind'),num=ind&&ind.querySelector('em');
const CUT=[.2,.62],STOP=[0,.34,.8],HOLD=750;
const calm=matchMedia('(prefers-reduced-motion: reduce)').matches;
let cur=-1,raf=0,lockY=-1,lockT=0;
const geo=()=>{const r=st.getBoundingClientRect();return {top:r.top+scrollY,len:r.height-innerHeight}};
const sceneOf=p=>p<CUT[0]?0:p<CUT[1]?1:2;
const go=y=>{try{scrollTo({top:y,behavior:'instant'})}catch(e){scrollTo(0,y)}};
const show=s=>{cur=s;st.dataset.s=s;const v=st.querySelector('.vid');if(v){if(s===0){v.play&&v.play().catch(()=>{})}else v.pause()}if(num)num.textContent=s+1;ind&&ind.style.setProperty('--p',(s+1)/3)};
const set=()=>{raf=0;const g=geo();if(g.len<=0)return;
 if(lockY>=0&&performance.now()<lockT){if(Math.abs(scrollY-lockY)>2)go(lockY);return}lockY=-1;
 const raw=(scrollY-g.top)/g.len,p=Math.min(1,Math.max(0,raw)),s=sceneOf(p);
 if(cur<0||calm){if(s!==cur)show(s);return}
 if(s!==cur){const inside=raw>0&&raw<1;const next=cur+(s>cur?1:-1);
  if(inside||Math.abs(s-cur)>1){show(next);if(raw<1.02&&raw>-.02){lockY=Math.round(g.top+g.len*STOP[next]);lockT=performance.now()+HOLD;go(lockY)}}else show(s)}};
addEventListener('scroll',()=>{if(!raf)raf=requestAnimationFrame(set)},{passive:true});
// 指で触れたら止めるのをやめる（次のスクロールはそのまま受け付ける）
addEventListener('touchstart',()=>{lockT=0},{passive:true});addEventListener('wheel',e=>{if(performance.now()>lockT-HOLD+350)lockT=0},{passive:true});
set();
})();
