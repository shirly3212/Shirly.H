/* ============================================================
   SHIRLY HERSCOVICI — site behavior
   ============================================================ */
document.documentElement.classList.add('js');

/* ---------- loader ---------- */
(function loader(){
  const el = document.getElementById('loader');
  if(!el) return;
  const word = 'SHIRLY';
  const target = el.querySelector('span');
  let i = 1;
  const iv = setInterval(()=>{
    target.textContent = word.slice(0, i);
    i++;
    if(i > word.length){
      clearInterval(iv);
      setTimeout(()=>{
        el.style.transition = 'transform 1s cubic-bezier(.76,0,.24,1)';
        el.style.transform = 'translateY(-100%)';
        document.body.classList.add('loaded');
        runHeroIntro();
        setTimeout(()=> el.remove(), 1100);
      }, 260);
    }
  }, 90);
})();

/* ---------- lenis smooth scroll ---------- */
let lenis;
if(window.Lenis){
  lenis = new Lenis({ duration:1.1, smoothWheel:true });
  function raf(time){ lenis.raf(time); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);
  if(window.gsap && window.gsap.ticker){
    gsap.ticker.add((time)=> lenis.raf(time*1000));
  }
}

/* ---------- scroll progress ---------- */
(function progress(){
  const bar = document.getElementById('progress');
  if(!bar) return;
  window.addEventListener('scroll', ()=>{
    const h = document.documentElement;
    const pct = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    bar.style.width = pct + '%';
  }, { passive:true });
})();

/* ---------- custom cursor ---------- */
(function cursor(){
  if(matchMedia('(hover:none)').matches) return;
  const c = document.createElement('div');
  c.className = 'cursor';
  document.body.appendChild(c);
  let x=0,y=0,cx=0,cy=0;
  window.addEventListener('mousemove', e=>{ x=e.clientX; y=e.clientY; });
  (function loop(){
    cx += (x-cx)*0.18; cy += (y-cy)*0.18;
    c.style.transform = `translate(${cx}px, ${cy}px) translate(-50%,-50%)`;
    requestAnimationFrame(loop);
  })();
  document.querySelectorAll('[data-cursor]').forEach(node=>{
    node.addEventListener('mouseenter', ()=>{
      c.classList.add('grow','label');
      c.dataset.label = node.getAttribute('data-cursor');
    });
    node.addEventListener('mouseleave', ()=>{ c.classList.remove('grow','label'); });
  });
})();

/* ---------- nav toggle (mobile) ---------- */
(function nav(){
  const btn = document.querySelector('.nav-toggle');
  const menu = document.querySelector('nav.primary');
  if(!btn || !menu) return;
  btn.addEventListener('click', ()=>{
    menu.classList.toggle('open');
    btn.textContent = menu.classList.contains('open') ? 'Close' : 'Menu';
  });
  menu.querySelectorAll('a').forEach(a=> a.addEventListener('click', ()=>{
    menu.classList.remove('open'); btn.textContent = 'Menu';
  }));
})();

/* ---------- reveal on scroll ---------- */
(function reveals(){
  const items = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold:0.15 });
  items.forEach(i=> io.observe(i));
})();

/* ---------- hero intro (GSAP) ---------- */
function runHeroIntro(){
  if(!window.gsap) return;
  const lines = document.querySelectorAll('.hero-title .line span');
  gsap.set(lines, { yPercent:110 });
  gsap.to(lines, { yPercent:0, duration:1.1, ease:'expo.out', stagger:0.08, delay:0.05 });
  gsap.from('.hero-role, .hero-formula, .hero .btn, .eyebrow', { opacity:0, y:16, duration:1, ease:'power3.out', stagger:0.08, delay:0.5 });
  gsap.from('.hero-visual', { opacity:0, y:30, duration:1.2, ease:'power3.out', delay:0.5 });
  gsap.to('.floating-tag', {
    y: 'random(-14,14)', x:'random(-10,10)', duration:'random(3,4.5)',
    repeat:-1, yoyo:true, ease:'sine.inOut', stagger:{ each:0.4, from:'random' }
  });
}
/* fallback if loader missing (case study pages reuse hero-title pattern minimally) */
if(!document.getElementById('loader')) runHeroIntro();

/* ---------- page transition on internal nav ---------- */
(function transitions(){
  const overlay = document.getElementById('page-transition');
  if(!overlay) return;
  document.querySelectorAll('a[href]').forEach(a=>{
    const href = a.getAttribute('href');
    if(!href || href.startsWith('#') || href.startsWith('http') || a.target==='_blank') return;
    a.addEventListener('click', (e)=>{
      e.preventDefault();
      overlay.style.transition = 'transform .6s cubic-bezier(.76,0,.24,1)';
      overlay.style.transform = 'translateY(0)';
      setTimeout(()=>{ window.location.href = href; }, 560);
    });
  });
})();

/* ---------- studio window canvas (hero) ---------- */
(function heroCanvas(){
  const c = document.getElementById('hero-stage-canvas');
  if(c && window.StudioCanvas){
    StudioCanvas.init(c, { colors:['#C9BFEA','#F4CBDA','#8FD9D2'], bg:'#182440', blobCount:5, speed:0.7 });
  }
})();

/* ---------- work list hover preview ---------- */
(function workPreview(){
  const rows = document.querySelectorAll('.work-row');
  const preview = document.querySelector('.work-preview');
  if(!rows.length || !preview) return;
  const canvas = preview.querySelector('canvas');
  let initialized = {};
  document.addEventListener('mousemove', e=>{
    preview.style.left = (e.clientX + 24) + 'px';
    preview.style.top = (e.clientY - 100) + 'px';
  });
  rows.forEach(row=>{
    row.addEventListener('mouseenter', ()=>{
      const palette = JSON.parse(row.dataset.palette || '["#C9BFEA","#F4CBDA","#8FD9D2"]');
      preview.classList.add('is-active');
      if(!initialized[row.dataset.slug]){
        StudioCanvas.init(canvas, { colors:palette, bg:'#182440', blobCount:4, speed:0.9 });
        initialized[row.dataset.slug] = true;
      }
    });
    row.addEventListener('mouseleave', ()=> preview.classList.remove('is-active'));
    row.addEventListener('click', ()=>{
      const href = row.dataset.href;
      if(href) window.location.href = href;
    });
  });
})();

/* ---------- playground card glows ---------- */
(function glows(){
  document.querySelectorAll('.play-card').forEach(card=>{
    const color = card.dataset.glow;
    if(!color) return;
    const g = card.querySelector('.glow');
    if(g) g.style.background = color;
  });
})();
