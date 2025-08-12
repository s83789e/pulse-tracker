
function show(id){document.querySelectorAll('.screen').forEach(s=>s.classList.add('hidden'));document.getElementById(id).classList.remove('hidden');document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));const idx={home:0,shield:1}[id];document.querySelectorAll('.tab')[idx].classList.add('active');}
document.getElementById('btn-shield').addEventListener('click',()=>{show('shield');startDive(600);} );

/* Pufferfish */
const Breath=(()=>{let raf=null,t=0,run=false;const c=document.getElementById('puffer'),x=c.getContext('2d');
function draw(p){const w=c.width,h=c.height;x.clearRect(0,0,w,h);let g=x.createRadialGradient(w/2,h*.45,20,w/2,h*.6,180);g.addColorStop(0,'#26c6ff');g.addColorStop(1,'#0b5370');x.fillStyle=g;x.fillRect(0,0,w,h);
const R=60+40*p,cx=w/2,cy=h/2;x.fillStyle='#ffdf7e';x.strokeStyle='#1a1a1a';x.lineWidth=2;x.beginPath();x.arc(cx,cy,R,0,Math.PI*2);x.fill();x.stroke();
x.fillStyle='#ffd166';x.beginPath();x.moveTo(cx+R,cy);x.quadraticCurveTo(cx+R+18, cy-8, cx+R+10, cy-24);x.lineTo(cx+R+26,cy);x.lineTo(cx+R+10, cy+24);x.quadraticCurveTo(cx+R+18, cy+8, cx+R, cy);x.fill();
x.beginPath();x.moveTo(cx-R*0.2, cy+R*0.2);x.quadraticCurveTo(cx, cy+R*0.5, cx+R*0.2, cy+R*0.2);x.fillStyle='#ffcc80';x.fill();
x.beginPath();x.arc(cx-18, cy-10, 8, 0, Math.PI*2);x.fillStyle='#fff';x.fill();x.beginPath();x.arc(cx-18, cy-10, 4, 0, Math.PI*2);x.fillStyle='#0b1520';x.fill();
for(let a=0;a<Math.PI*2;a+=Math.PI/10){const r=R+8+Math.sin(t*0.01+a)*2;const xx=cx+Math.cos(a)*r,yy=cy+Math.sin(a)*r;x.beginPath();x.arc(xx,yy,2,0,Math.PI*2);x.fillStyle='#ffe8a8';x.fill();}
x.beginPath();x.arc(cx+20, cy+6, 8+p*4, 0, Math.PI*2);x.fillStyle='#ffb703';x.fill();
}
function loop(ts){if(!run)return;t=ts;const cyc=12000,m=t%cyc;let p=0;if(m<4000){p=m/4000}else if(m<6000){p=1}else{p=1-((m-6000)/6000)};draw(p);raf=requestAnimationFrame(loop);}
return {start(){if(run)return;run=true;raf=requestAnimationFrame(loop);},stop(){run=false;cancelAnimationFrame(raf);draw(0);} };
})();

/* Urge Surf — Diver */
function injectDiver(diverEl){
  diverEl.innerHTML = `
  <svg viewBox="0 0 176 128" xmlns="http://www.w3.org/2000/svg">
    <path d="M140 92 l26 10 -26 10 z" fill="#0a6a7f" opacity=".9"/>
    <path d="M112 98 l20 10 -20 10 z" fill="#0a6a7f" opacity=".9"/>
    <rect x="46" y="48" rx="12" ry="12" width="72" height="42" fill="#155b6e"/>
    <rect x="30" y="50" rx="10" ry="10" width="26" height="44" fill="#1d8aa3"/>
    <rect x="86" y="66" rx="6" ry="6" width="22" height="14" fill="#1c6a7a"/>
    <rect x="100" y="58" rx="8" ry="8" width="34" height="24" fill="#2b3b46"/>
    <circle cx="118" cy="70" r="8" fill="#4db7ff"/>
    <circle cx="78" cy="56" r="16" fill="#eec9a8"/>
    <rect x="64" y="46" rx="8" ry="8" width="28" height="16" fill="#208bb0"/>
    <circle cx="74" cy="53" r="3" fill="#263238"/>
    <circle cx="86" cy="53" r="3" fill="#263238"/>
    <path d="M58 54 q-16 6 -22 18" fill="none" stroke="#0d3b4d" stroke-width="4" stroke-linecap="round"/>
  </svg>`;
}

/* Fish — random color & 20–200% size; eye-led direction; -20% speed */
function fishSVG(color){
  color = color || '#8fd3ff';
  return `
  <svg viewBox="0 0 160 80" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="fb" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${color}"/><stop offset="1" stop-color="#1a6ea1"/></linearGradient></defs>
    <polygon points="40,40 8,18 8,62" fill="${color}" opacity=".95"/>
    <ellipse cx="70" cy="40" rx="48" ry="26" fill="url(#fb)"/>
    <circle cx="102" cy="34" r="6" fill="#fff"/><circle cx="102" cy="34" r="3" fill="#0b1520"/>
  </svg>`;
}
function randomColor(){
  const colors=['#8fd3ff','#ffd37f','#ff8f8f','#8fff9f','#d18fff','#ffb48f','#9df1e3','#ffc2e2'];
  return colors[Math.floor(Math.random()*colors.length)];
}

let diveInt=null,diveSecs=0,diveTotal=600,photos=0,fishTimer=null;
function startDive(total){
  stopDive(); diveTotal=total; diveSecs=total; photos=0;
  document.getElementById('photos').textContent=photos;
  const asc=document.getElementById('ascBar'), depth=document.getElementById('depth'), diver=document.getElementById('diver'), dive=document.getElementById('dive');
  injectDiver(diver);
  createFishLoop(); createBubbles();
  diveInt=setInterval(()=>{
    diveSecs--; const pct=1-(diveSecs/diveTotal); const dep=Math.max(0,Math.round((1-pct)*10));
    depth.textContent='Depth: '+dep+' m'; asc.style.height=Math.round(pct*320)+'px'; diver.style.top=(300-pct*280)+'px';
    dive.style.background='radial-gradient(80% 60% at 50% 0%, var(--sea1) 0%, var(--sea2) '+Math.round(40+30*pct)+'%, var(--sea3) 85%)';
    document.getElementById('timerLabel').textContent=(Math.floor(diveSecs/60))+':'+(('0'+(diveSecs%60)).slice(-2));
    if(diveSecs<=0){ stopDive(); document.getElementById('timerLabel').textContent='Surface reached ✅'; }
  },1000);
}
function stopDive(){ clearInterval(diveInt); stopFishLoop(); clearBubbles(); }

function createBubbles(){
  const c=document.getElementById('bubbles'); c.innerHTML='';
  for(let i=0;i<12;i++){ const b=document.createElement('div'); b.className='bubble';
    b.style.left=Math.round(Math.random()*440)+'px'; b.style.animationDuration=(5+Math.random()*4)+'s'; b.style.animationDelay=(Math.random()*3)+'s'; c.appendChild(b); }
}
function clearBubbles(){ document.getElementById('bubbles').innerHTML=''; }

function createFishLoop(){
  const layer=document.getElementById('fishLayer'); const W=480, H=360;
  function spawnFish(){
    const fish=document.createElement('div'); fish.className='fish';
    const color=randomColor(); fish.innerHTML=fishSVG(color);

    // 20%–200% of diver size (diver ≈ 88x64)
    const scale=0.2 + Math.random()*1.8;
    fish.style.width=(88*scale)+'px'; fish.style.height=(64*scale)+'px';

    let headingRight = Math.random()<0.5;
    let x = headingRight ? -60 : W+60;
    let y = 40 + Math.random()*(H-80);

    // -20% slower
    let vx = (headingRight?1:-1)*(2.0 + Math.random()*2.0)*0.8;
    let vy = (Math.random()*2-1)*(1+Math.random()*1.2)*0.8;

    const svg=fish.querySelector('svg');
    function face(){ svg.style.transform = (vx>=0)?'scaleX(1)':'scaleX(-1)'; }
    function move(){
      x+=vx; y+=vy;
      if(y<20||y>H-20) vy*=-1;
      if(Math.random()<0.02) vy+=(Math.random()-.5)*0.6;
      face();
      fish.style.left=x+'px'; fish.style.top=y+'px';
      if(x<-160||x>W+160){ fish.remove(); return; }
      requestAnimationFrame(move);
    }
    fish.addEventListener('click',()=>{ if(!fish.classList.contains('photographed')){ fish.classList.add('photographed'); photos++; document.getElementById('photos').textContent=photos; }});
    face(); fish.style.left=x+'px'; fish.style.top=y+'px'; layer.appendChild(fish); requestAnimationFrame(move);
  }
  stopFishLoop(); fishTimer=setInterval(spawnFish, 1100);
}
function stopFishLoop(){ clearInterval(fishTimer); document.querySelectorAll('.fish').forEach(f=>f.remove()); }

/* Bubble Burst */
let popInt=null,bubbleScore=0;
function startBubbles(){
  stopBubbles(); bubbleScore=0; document.getElementById('bubbleScore').textContent=bubbleScore;
  const sea=document.getElementById('popsea'); sea.addEventListener('touchstart', e=>e.preventDefault(), {passive:false});
  popInt=setInterval(()=>{
    const b=document.createElement('div'); b.className='pop';
    b.style.left=Math.round(Math.random()*440)+'px';
    b.style.animationDuration=(5+Math.random()*5)+'s';
    const inc=()=>{ bubbleScore++; document.getElementById('bubbleScore').textContent=bubbleScore; b.remove(); };
    b.addEventListener('click', inc); b.addEventListener('touchstart', inc, {passive:true});
    sea.appendChild(b); setTimeout(()=> b.remove(), 11000);
  },600);
}
function stopBubbles(){ clearInterval(popInt); document.getElementById('popsea').innerHTML=''; }

// SW
if('serviceWorker' in navigator){ navigator.serviceWorker.register('./sw.js').catch(()=>{}); }
