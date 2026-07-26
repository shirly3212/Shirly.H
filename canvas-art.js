/* ============================================================
   Generative ambient canvas — stands in for footage across the
   site (hero studio window, case-study stages, hover previews).
   Soft blurred blob field drifting slowly, tuned per palette.
   ============================================================ */
(function(){
  function hexToRgb(hex){
    const v = hex.replace('#','');
    const n = parseInt(v.length===3 ? v.split('').map(c=>c+c).join('') : v, 16);
    return { r:(n>>16)&255, g:(n>>8)&255, b:n&255 };
  }

  function makeField(canvas, opts){
    opts = Object.assign({
      colors:['#C9BFEA','#F4CBDA','#8FD9D2'],
      bg:'#182440',
      blobCount:5,
      speed:1,
      grain:true
    }, opts||{});

    const ctx = canvas.getContext('2d');
    let w, h, dpr;
    const colors = opts.colors.map(hexToRgb);

    function size(){
      dpr = Math.min(window.devicePixelRatio||1, 2);
      const rect = canvas.getBoundingClientRect();
      w = Math.max(rect.width, 2); h = Math.max(rect.height, 2);
      canvas.width = w*dpr; canvas.height = h*dpr;
      ctx.setTransform(dpr,0,0,dpr,0,0);
    }
    size();
    window.addEventListener('resize', size);

    const blobs = Array.from({length:opts.blobCount}, (_,i)=>({
      x: Math.random(), y: Math.random(),
      r: 0.35 + Math.random()*0.35,
      c: colors[i % colors.length],
      vx: (Math.random()-0.5)*0.00025*opts.speed,
      vy: (Math.random()-0.5)*0.00025*opts.speed,
      p: Math.random()*Math.PI*2
    }));

    let t = 0;
    function draw(){
      t += 0.01*opts.speed;
      ctx.fillStyle = opts.bg;
      ctx.fillRect(0,0,w,h);
      ctx.filter = `blur(${Math.max(w,h)*0.12}px)`;
      blobs.forEach(b=>{
        b.x += b.vx + Math.sin(t+b.p)*0.00004;
        b.y += b.vy + Math.cos(t+b.p)*0.00004;
        if(b.x<-0.2) b.x=1.2; if(b.x>1.2) b.x=-0.2;
        if(b.y<-0.2) b.y=1.2; if(b.y>1.2) b.y=-0.2;
        const rad = b.r * Math.max(w,h);
        const grad = ctx.createRadialGradient(b.x*w, b.y*h, 0, b.x*w, b.y*h, rad);
        grad.addColorStop(0, `rgba(${b.c.r},${b.c.g},${b.c.b},0.85)`);
        grad.addColorStop(1, `rgba(${b.c.r},${b.c.g},${b.c.b},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(b.x*w, b.y*h, rad, 0, Math.PI*2);
        ctx.fill();
      });
      ctx.filter = 'none';
      requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
  }

  window.StudioCanvas = { init: makeField };
})();
