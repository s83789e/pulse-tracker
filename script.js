
function show(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  const idx={home:0,shield:1}[id];
  document.querySelectorAll('.tab')[idx].classList.add('active');
}
document.getElementById('btn-print').addEventListener('click', ()=> window.print());
document.getElementById('btn-shield').addEventListener('click', ()=>{ show('shield'); startDive(600); });

/* Pufferfish breathing orb (canvas) */
const Breath = (function(){
  let raf=null, t=0, running=false;
  const c = document.getElementById('puffer'); const ctx = c.getContext('2d');
  function draw(progress){
    const w=c.width, h=c.height; ctx.clearRect(0,0,w,h);
    // water bg
    const grd=ctx.createRadialGradient(w/2,h*0.45,20,w/2,h*0.6,180);
    grd.addColorStop(0,'#26c6ff'); grd.addColorStop(1,'#0b5370'); ctx.fillStyle=grd; ctx.fillRect(0,0,w,h);
    // puffer
    const base=60, inflate=40*progress, R=base+inflate, cx=w/2, cy=h/2;
    ctx.fillStyle='#ffdf7e'; ctx.strokeStyle='#1a1a1a'; ctx.lineWidth=2;
    ctx.beginPath(); ctx.arc(cx,cy,R,0,Math.PI*2); ctx.fill(); ctx.stroke();
    // eye
    ctx.beginPath(); ctx.arc(cx-18, cy-10, 8, 0, Math.PI*2); ctx.fillStyle='#fff'; ctx.fill();
    ctx.beginPath(); ctx.arc(cx-18, cy-10, 4, 0, Math.PI*2); ctx.fillStyle='#0b1520'; ctx.fill();
    // spikes
    for(let a=0;a<Math.PI*2;a+=Math.PI/10){
      const r=R+8+Math.sin(t*0.01+a)*2; const x=cx+Math.cos(a)*r; const y=cy+Math.sin(a)*r;
      ctx.beginPath(); ctx.arc(x,y,2,0,Math.PI*2); ctx.fillStyle='#ffe8a8'; ctx.fill();
    }
    // mouth
    ctx.beginPath(); ctx.arc(cx+20, cy+6, 8+progress*4, 0, Math.PI*2); ctx.fillStyle='#ffb703'; ctx.fill();
  }
  function loop(ts){ if(!running) return; t=ts;
    const cycle=12000; const m=t % cycle; // 4-2-6
    let p=0; if(m<4000){ p=m/4000; } else if(m<6000){ p=1; } else { p=1-((m-6000)/6000); }
    draw(p); raf=requestAnimationFrame(loop);
  }
  return { start(){ if(running) return; running=true; raf=requestAnimationFrame(loop); },
           stop(){ running=false; cancelAnimationFrame(raf); draw(0); } };
})();

/* Dive Mode */
let diveInt=null, diveSecs=0, diveTotal=600, photos=0, fishTimer=null;
function startDive(total){
  stopDive(); diveTotal=total; diveSecs=total; photos=0; document.getElementById('photos').textContent=photos;
  const ascBar=document.getElementById('ascBar'); const depthLabel=document.getElementById('depth'); const diver=document.getElementById('diver'); const dive=document.getElementById('dive');
  createFishLoop(); createBubbles();
  diveInt=setInterval(()=>{
    diveSecs--; const pct=1-(diveSecs/diveTotal); const depth=Math.max(0,Math.round((1-pct)*10));
    depthLabel.textContent="Depth: "+depth+" m"; ascBar.style.height=Math.round(pct*320)+"px"; diver.style.top=(300-pct*280)+"px";
    dive.style.background="radial-gradient(80% 60% at 50% 0%, var(--sea1) 0%, var(--sea2) "+Math.round(40+30*pct)+"%, var(--sea3) 85%)";
    document.getElementById('timerLabel').textContent=(Math.floor(diveSecs/60))+":"+(('0'+(diveSecs%60)).slice(-2));
    if(diveSecs<=0){ stopDive(); document.getElementById('timerLabel').textContent="Surface reached ✅"; }
  },1000);
}
function stopDive(){ clearInterval(diveInt); stopFishLoop(); clearBubbles(); }
function createBubbles(){ const cont=document.getElementById('bubbles'); cont.innerHTML=''; for(let i=0;i<12;i++){ const b=document.createElement('div'); b.className='bubble'; b.style.left=Math.round(Math.random()*440)+'px'; b.style.animationDuration=(5+Math.random()*4)+'s'; b.style.animationDelay=(Math.random()*3)+'s'; cont.appendChild(b);} }
function clearBubbles(){ document.getElementById('bubbles').innerHTML=''; }
function createFishLoop(){
  const layer=document.getElementById('fishLayer'); const W=480, H=360;
  fishTimer=setInterval(()=>{
    const fish=document.createElement('div'); fish.className='fish';
    const sprite=document.createElement('span'); sprite.className='sprite'; sprite.textContent='🐟'; fish.appendChild(sprite);
    let x=Math.random()<0.5?-50:W+50; let y=40+Math.random()*(H-80);
    let speedX=(x<0? 2+Math.random()*2 : -2-Math.random()*2); let speedY=(Math.random()*2-1)*(1+Math.random()*1.2);
    const rotate=()=> Math.atan2(speedY,speedX)*180/Math.PI; const face=()=>{ sprite.style.transform='rotate('+rotate()+'deg)'; };
    const move=()=>{ x+=speedX; y+=speedY; if(y<20||y>H-20) speedY*=-1; if(Math.random()<0.02){ speedY+=(Math.random()-.5)*0.8; } fish.style.left=x+'px'; fish.style.top=y+'px'; face(); if(x<-80||x>W+80){ fish.remove(); cancelAnimationFrame(anim); return;} anim=requestAnimationFrame(move); };
    let anim=requestAnimationFrame(move);
    fish.addEventListener('click',()=>{ if(!fish.classList.contains('photographed')){ fish.classList.add('photographed'); photos++; document.getElementById('photos').textContent=photos; } });
    fish.style.left=x+'px'; fish.style.top=y+'px'; layer.appendChild(fish);
  },1100);
}
function stopFishLoop(){ clearInterval(fishTimer); document.querySelectorAll('.fish').forEach(f=>f.remove()); }

/* Bubble Burst */
let popInt=null, bubbleScore=0;
function startBubbles(){
  stopBubbles(); bubbleScore=0; document.getElementById('bubbleScore').textContent=bubbleScore;
  const sea=document.getElementById('popsea'); sea.addEventListener('touchstart', e=>{ e.preventDefault(); }, {passive:false});
  popInt=setInterval(()=>{ const b=document.createElement('div'); b.className='pop'; b.style.left=Math.round(Math.random()*440)+'px'; b.style.animationDuration=(5+Math.random()*5)+'s';
    const inc=()=>{ bubbleScore++; document.getElementById('bubbleScore').textContent=bubbleScore; b.remove(); };
    b.addEventListener('click', inc); b.addEventListener('touchstart', inc, {passive:true});
    sea.appendChild(b); setTimeout(()=> b.remove(), 11000);
  },550);
}
function stopBubbles(){ clearInterval(popInt); document.getElementById('popsea').innerHTML=''; }

/* Name 3 Fish — real photos (Wikimedia/NOAA) */
const FISH_PHOTOS = [
  {name:"Clownfish",    url:"https://upload.wikimedia.org/wikipedia/commons/6/6e/Common_clownfish.jpg"},
  {name:"Parrotfish",   url:"https://upload.wikimedia.org/wikipedia/commons/7/7c/Midnight_parrotfish.jpg"},
  {name:"Butterflyfish",url:"https://upload.wikimedia.org/wikipedia/commons/6/62/Butterfly_fish_2004.jpg"},
  {name:"Angelfish",    url:"https://upload.wikimedia.org/wikipedia/commons/8/8c/1_centropyge_bicolor_Bicolor_angelfish.jpg"}
];
let fishPicked=0;
function setupNameChips(){
  const box=document.getElementById('fishChips'); const photo=document.getElementById('fishPhoto');
  const correctFish = FISH_PHOTOS[Math.floor(Math.random()*FISH_PHOTOS.length)];
  photo.src=correctFish.url;
  box.innerHTML=''; fishPicked=0; document.getElementById('nameStatus').textContent='0 / 3';
  const names = FISH_PHOTOS.map(f=>f.name).sort(()=>Math.random()-0.5); const correct=new Set([correctFish.name]);
  for(const n of names){
    const chip=document.createElement('div'); chip.className='chip'; chip.textContent=n;
    chip.addEventListener('click',()=>{
      if(chip.classList.contains('correct')||chip.classList.contains('wrong'))return;
      if(correct.has(n)){ chip.classList.add('correct'); fishPicked++; }
      else{ chip.classList.add('wrong'); }
      document.getElementById('nameStatus').textContent=fishPicked+' / 3';
      if(fishPicked<3 && chip.classList.contains('correct')){
        const next=FISH_PHOTOS[Math.floor(Math.random()*FISH_PHOTOS.length)];
        photo.src=next.url; correct.clear(); correct.add(next.name);
      }
    });
    box.appendChild(chip);
  }
}
setupNameChips();

/* Quiz — static sourced facts, auto-advance on correct answer */
const QUIZ = [
  { q:"What's the usual recreational safety stop?", opts:[
      {t:"3 minutes at 5 m / 15 ft", good:true},
      {t:"1 minute at 3 m / 10 ft", good:false},
      {t:"5 minutes at 9 m / 30 ft", good:false}
    ], source:"PADI guidance" },
  { q:"Max recommended depth for recreational air diving?", opts:[
      {t:"40 m / 130 ft", good:true},
      {t:"60 m / 200 ft", good:false},
      {t:"25 m / 82 ft", good:false}
    ], source:"PADI" },
  { q:"Nitrogen narcosis is commonly noticeable around…", opts:[
      {t:"30 m / 100 ft", good:true},
      {t:"10 m / 33 ft", good:false},
      {t:"6 m / 20 ft", good:false}
    ], source:"DAN" },
  { q:"Parrotfish help reefs mainly by…", opts:[
      {t:"Grazing algae off reef surfaces", good:true},
      {t:"Hunting small reef fish", good:false},
      {t:"Cleaning parasites off sharks", good:false}
    ], source:"NOAA" }
];
let qIndex=0;
function setupQuiz(){
  const qEl=document.getElementById('quizQ'); const box=document.getElementById('quizOpts'); const msg=document.getElementById('quizMsg');
  function render(){
    const item = QUIZ[qIndex % QUIZ.length];
    qEl.textContent=item.q; box.innerHTML=''; msg.textContent='';
    item.opts.forEach(o=>{
      const chip=document.createElement('div'); chip.className='chip'; chip.textContent=o.t;
      chip.addEventListener('click', ()=>{
        if(o.good){ chip.classList.add('correct'); msg.textContent='Correct ✅'; setTimeout(()=>{ qIndex++; render(); }, 800); }
        else { chip.classList.add('wrong'); msg.textContent='Try again'; }
      });
      box.appendChild(chip);
    });
  }
  render();
}
setupQuiz();
