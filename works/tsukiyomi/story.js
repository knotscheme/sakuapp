// ヒーローの3場面：スクロール位置で「場面」だけを切り替え、動きはCSSのtransitionに任せる（iPhoneでもカクつかない）
(function(){
const st=document.querySelector('.story');if(!st)return;
// 画面の向きに合わせて、横長（PC）か縦長（スマホ）の動画を選ぶ
const hv=st.querySelector('.s1 .vid');if(hv){const sp=innerWidth<861;hv.poster=sp?'img/hero-poster-sp.webp':'img/hero-poster.webp';hv.src=sp?'img/hero-sp.mp4?v=2':'img/hero-pc.mp4?v=2';hv.play&&hv.play().catch(()=>{})}
const ind=st.querySelector('.ind'),num=ind&&ind.querySelector('em');
let cur=-1,raf=0;
const set=()=>{raf=0;const r=st.getBoundingClientRect(),h=innerHeight,len=r.height-h;
 const p=Math.min(1,Math.max(0,-r.top/len));const s=p<.3?0:p<.64?1:2;
 if(s!==cur){cur=s;st.dataset.s=s;const v=st.querySelector('.vid');if(v){if(s===0){v.play&&v.play().catch(()=>{})}else v.pause()}if(num)num.textContent=s+1;ind&&ind.style.setProperty('--p',(s+1)/3)}};
addEventListener('scroll',()=>{if(!raf)raf=requestAnimationFrame(set)},{passive:true});set();
})();
