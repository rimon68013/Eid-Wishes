// ── STARS ─────────────────────────────────────────────────────────────────────
const starsC = document.getElementById('stars');
const sCtx = starsC.getContext('2d');
starsC.width = innerWidth; starsC.height = innerHeight;
window.addEventListener('resize', () => { starsC.width=innerWidth; starsC.height=innerHeight; drawStars(); });

const starList = Array.from({length:220}, () => ({
  x: Math.random()*innerWidth,
  y: Math.random()*innerHeight*0.75,
  r: Math.random()*1.8+0.3,
  t: Math.random()*Math.PI*2,
  speed: Math.random()*0.02+0.005,
}));

function drawStars() {
  sCtx.clearRect(0,0,starsC.width,starsC.height);
  starList.forEach(s => {
    s.t += s.speed;
    const alpha = 0.3 + Math.sin(s.t)*0.7;
    sCtx.beginPath();
    sCtx.arc(s.x, s.y, s.r, 0, Math.PI*2);
    sCtx.fillStyle = `rgba(255,240,180,${alpha})`;
    sCtx.fill();
  });
}
setInterval(drawStars, 50);
drawStars();

// ── LANTERNS ──────────────────────────────────────────────────────────────────
const lanternContainer = document.getElementById('lanterns');
const LANTERN_COLORS = ['#ffd060','#ff9020','#ff6040','#40d0a0','#c060ff','#60c0ff'];

function makeLanternSVG(color) {
  return `<svg width="28" height="52" viewBox="0 0 28 52" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="14" y1="0" x2="14" y2="6" stroke="${color}" stroke-width="1.5"/>
    <ellipse cx="14" cy="8" rx="6" ry="3" fill="${color}" opacity="0.9"/>
    <path d="M6 10 Q2 30 6 42 Q14 48 22 42 Q26 30 22 10 Z" fill="${color}" opacity="0.85"/>
    <path d="M9 14 Q14 16 19 14" stroke="rgba(255,255,255,0.4)" stroke-width="1" fill="none"/>
    <path d="M8 22 Q14 25 20 22" stroke="rgba(255,255,255,0.3)" stroke-width="1" fill="none"/>
    <path d="M8 30 Q14 33 20 30" stroke="rgba(255,255,255,0.3)" stroke-width="1" fill="none"/>
    <ellipse cx="14" cy="43" rx="6" ry="2.5" fill="${color}" opacity="0.7"/>
    <line x1="14" y1="45" x2="14" y2="52" stroke="${color}" stroke-width="1.2"/>
    <ellipse cx="14" cy="28" rx="5" ry="7" fill="rgba(255,255,200,0.18)"/>
  </svg>`;
}

function spawnLantern() {
  const el = document.createElement('div');
  el.className = 'lantern';
  const color = LANTERN_COLORS[Math.floor(Math.random()*LANTERN_COLORS.length)];
  el.innerHTML = makeLanternSVG(color);
  el.style.left = Math.random()*95 + '%';
  const dur = Math.random()*12 + 14;
  const swingDur = Math.random()*2 + 2;
  el.style.animationDuration = `${swingDur}s, ${dur}s`;
  el.style.animationDelay = `0s, 0s`;
  lanternContainer.appendChild(el);
  setTimeout(() => el.remove(), dur*1000+500);
}

for(let i=0;i<6;i++) setTimeout(spawnLantern, i*2200);
setInterval(spawnLantern, 2500);

// ── GOLD PARTICLES ────────────────────────────────────────────────────────────
const pC = document.getElementById('particles');
const pCtx = pC.getContext('2d');
pC.width = innerWidth; pC.height = innerHeight;
window.addEventListener('resize', ()=>{ pC.width=innerWidth; pC.height=innerHeight; });

const gParticles = Array.from({length:60}, () => resetGP({}));

function resetGP(p) {
  p.x = Math.random()*innerWidth;
  p.y = Math.random()*innerHeight + innerHeight;
  p.vx = (Math.random()-0.5)*0.6;
  p.vy = -(Math.random()*0.8+0.3);
  p.size = Math.random()*3+1;
  p.life = 1;
  p.decay = Math.random()*0.003+0.001;
  p.hue = Math.random()*30+35;
  return p;
}

function animParticles() {
  pCtx.clearRect(0,0,pC.width,pC.height);
  gParticles.forEach(p => {
    p.x += p.vx; p.y += p.vy; p.life -= p.decay;
    if(p.life<=0||p.y<-10) resetGP(p);
    pCtx.beginPath();
    pCtx.arc(p.x,p.y,p.size,0,Math.PI*2);
    pCtx.fillStyle = `hsla(${p.hue},90%,65%,${p.life*0.6})`;
    pCtx.fill();
  });
  requestAnimationFrame(animParticles);
}
animParticles();

// ── FIREWORKS ─────────────────────────────────────────────────────────────────
const fwC = document.getElementById('fireworks');
const fwCtx = fwC.getContext('2d');
fwC.width = innerWidth; fwC.height = innerHeight;
window.addEventListener('resize',()=>{fwC.width=innerWidth;fwC.height=innerHeight;});

const fwParticles = [];
// Store as [r,g,b] arrays for clean rgba usage
const FW_COLORS = [
  [255,208,96],   // gold
  [255,144,32],   // orange
  [255,245,192],  // pale yellow
  [64,224,192],   // teal
  [192,128,255],  // purple
  [128,208,255],  // sky blue
  [255,96,128],   // pink
];

function launchFirework() {
  const x = innerWidth*0.2 + Math.random()*innerWidth*0.6;
  const y = innerHeight*0.1 + Math.random()*innerHeight*0.3;
  const [r,g,b] = FW_COLORS[Math.floor(Math.random()*FW_COLORS.length)];
  for(let i=0;i<55;i++) {
    const angle = (i/55)*Math.PI*2;
    const speed = Math.random()*4+1.5;
    fwParticles.push({
      x, y,
      vx: Math.cos(angle)*speed,
      vy: Math.sin(angle)*speed,
      life: 1,
      decay: Math.random()*0.018+0.012,
      size: Math.random()*2.5+1,
      r, g, b,
      trail: [],
    });
  }
}

function animFW() {
  fwCtx.clearRect(0,0,fwC.width,fwC.height);
  for(let i=fwParticles.length-1;i>=0;i--) {
    const p = fwParticles[i];
    p.trail.push({x:p.x,y:p.y});
    if(p.trail.length>8) p.trail.shift();
    p.x+=p.vx; p.y+=p.vy; p.vy+=0.06;
    p.vx*=0.97; p.life-=p.decay;

    // draw trail
    for(let j=1;j<p.trail.length;j++){
      const a = (j/p.trail.length)*p.life*0.6;
      fwCtx.beginPath();
      fwCtx.moveTo(p.trail[j-1].x, p.trail[j-1].y);
      fwCtx.lineTo(p.trail[j].x, p.trail[j].y);
      fwCtx.strokeStyle = `rgba(${p.r},${p.g},${p.b},${a})`;
      fwCtx.lineWidth = p.size * 0.5;
      fwCtx.stroke();
    }

    // draw particle dot
    fwCtx.beginPath();
    fwCtx.arc(p.x, p.y, p.size, 0, Math.PI*2);
    fwCtx.fillStyle = `rgba(${p.r},${p.g},${p.b},${p.life})`;
    fwCtx.fill();

    if(p.life<=0) fwParticles.splice(i,1);
  }
  requestAnimationFrame(animFW);
}
animFW();

// Fire fireworks: burst at start, then periodically
setTimeout(launchFirework, 800);
setTimeout(launchFirework, 1400);
setTimeout(launchFirework, 2000);
setTimeout(launchFirework, 2600);
setInterval(launchFirework, 3200);