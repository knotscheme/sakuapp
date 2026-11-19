// ヘッダー：スクロールしたら背景をつける／スマホのメニュー
const hd=document.querySelector('header');
const onS=()=>hd.classList.toggle('on',scrollY>40);onS();addEventListener('scroll',onS,{passive:true});
const tg=document.querySelector('.menu-t'),nv=document.querySelector('nav');
tg&&tg.addEventListener('click',()=>{const o=nv.classList.toggle('open');tg.setAttribute('aria-expanded',o)});
nv&&nv.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nv.classList.remove('open')));
// ふわっと表示
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.15});
document.querySelectorAll('.rv').forEach(el=>io.observe(el));
