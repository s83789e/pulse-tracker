
function show(id){document.querySelectorAll('.screen').forEach(s=>s.classList.add('hidden'));document.getElementById(id).classList.remove('hidden');document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));const idx={home:0,shield:1}[id];document.querySelectorAll('.tab')[idx].classList.add('active');}
document.getElementById('btn-print').addEventListener('click',()=>window.print());document.getElementById('btn-shield').addEventListener('click',()=>{show('shield');startDive(600);} );

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

/* Dive & Fish */
let diveInt=null,diveSecs=0,diveTotal=600,photos=0,fishTimer=null;
function startDive(total){stopDive();diveTotal=total;diveSecs=total;photos=0;document.getElementById('photos').textContent=photos;
const asc=document.getElementById('ascBar'),depth=document.getElementById('depth'),diver=document.getElementById('diver'),dive=document.getElementById('dive');
createFishLoop();createBubbles();
diveInt=setInterval(()=>{diveSecs--;const pct=1-(diveSecs/diveTotal),dep=Math.max(0,Math.round((1-pct)*10));
depth.textContent='Depth: '+dep+' m';asc.style.height=Math.round(pct*320)+'px';diver.style.top=(300-pct*280)+'px';
dive.style.background='radial-gradient(80% 60% at 50% 0%, var(--sea1) 0%, var(--sea2) '+Math.round(40+30*pct)+'%, var(--sea3) 85%)';
document.getElementById('timerLabel').textContent=(Math.floor(diveSecs/60))+':'+(('0'+(diveSecs%60)).slice(-2));
if(diveSecs<=0){stopDive();document.getElementById('timerLabel').textContent='Surface reached ✅';}},1000);}
function stopDive(){clearInterval(diveInt);stopFishLoop();clearBubbles();}
function createBubbles(){const c=document.getElementById('bubbles');c.innerHTML='';for(let i=0;i<12;i++){const b=document.createElement('div');b.className='bubble';b.style.left=Math.round(Math.random()*440)+'px';b.style.animationDuration=(5+Math.random()*4)+'s';b.style.animationDelay=(Math.random()*3)+'s';c.appendChild(b);}}
function clearBubbles(){document.getElementById('bubbles').innerHTML='';}
function fishSVG(color){color=color||'#8fd3ff';return '<svg viewBox=\"0 0 120 60\" xmlns=\"http://www.w3.org/2000/svg\">'
+'<defs><linearGradient id=\"g\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\"><stop offset=\"0\" stop-color=\"'+color+'\"/><stop offset=\"1\" stop-color=\"#1a6ea1\"/></linearGradient></defs>'
+'<ellipse cx=\"50\" cy=\"30\" rx=\"32\" ry=\"18\" fill=\"url(#g)\"/><polygon points=\"82,30 110,12 110,48\" fill=\"'+color+'\"/>'
+'<circle cx=\"40\" cy=\"24\" r=\"5\" fill=\"#fff\"/><circle cx=\"40\" cy=\"24\" r=\"2\" fill=\"#0b1520\"/></svg>'; }
function createFishLoop(){const layer=document.getElementById('fishLayer');const W=480,H=360;
fishTimer=setInterval(()=>{const fish=document.createElement('div');fish.className='fish';fish.innerHTML=fishSVG();
let x=Math.random()<.5?-50:W+50;let y=40+Math.random()*(H-80);
let sx=((x<0?2+Math.random()*2:-2-Math.random()*2)*.8);let sy=((Math.random()*2-1)*(1+Math.random()*1.2)*.8);
const svg=fish.querySelector('svg');function face(){svg.style.transform=sx<0?'scaleX(-1)':'scaleX(1)';}
function move(){x+=sx;y+=sy;if(y<20||y>H-20)sy*=-1;if(Math.random()<.02)sy+=(Math.random()-.5)*.6;
fish.style.left=x+'px';fish.style.top=y+'px';face();if(x<-120||x>W+120){fish.remove();cancelAnimationFrame(anim);return;}anim=requestAnimationFrame(move);}
let anim=requestAnimationFrame(move);
fish.addEventListener('click',()=>{if(!fish.classList.contains('photographed')){fish.classList.add('photographed');photos++;document.getElementById('photos').textContent=photos;}});
fish.style.left=x+'px';fish.style.top=y+'px';layer.appendChild(fish);},1200);}
function stopFishLoop(){clearInterval(fishTimer);document.querySelectorAll('.fish').forEach(f=>f.remove());}

/* Bubble Burst */
let popInt=null,bubbleScore=0;
function startBubbles(){stopBubbles();bubbleScore=0;document.getElementById('bubbleScore').textContent=bubbleScore;
const sea=document.getElementById('popsea');sea.addEventListener('touchstart',e=>e.preventDefault(),{passive:false});
popInt=setInterval(()=>{const b=document.createElement('div');b.className='pop';b.style.left=Math.round(Math.random()*440)+'px';b.style.animationDuration=(5+Math.random()*5)+'s';
const inc=()=>{bubbleScore++;document.getElementById('bubbleScore').textContent=bubbleScore;b.remove();};
b.addEventListener('click',inc);b.addEventListener('touchstart',inc,{passive:true});sea.appendChild(b);setTimeout(()=>b.remove(),11000);},600);}
function stopBubbles(){clearInterval(popInt);document.getElementById('popsea').innerHTML='';}

/* Name 3 Fish */
const FISH_PHOTOS=[
 {name:'Clownfish',url:'https://upload.wikimedia.org/wikipedia/commons/6/6e/Common_clownfish.jpg',fallback:'images/clownfish.jpg'},
 {name:'Parrotfish',url:'https://upload.wikimedia.org/wikipedia/commons/7/7c/Midnight_parrotfish.jpg',fallback:'images/parrotfish.jpg'},
 {name:'Butterflyfish',url:'https://upload.wikimedia.org/wikipedia/commons/6/62/Butterfly_fish_2004.jpg',fallback:'images/butterflyfish.jpg'},
 {name:'Angelfish',url:'https://upload.wikimedia.org/wikipedia/commons/8/8c/1_centropyge_bicolor_Bicolor_angelfish.jpg',fallback:'images/angelfish.jpg'}
];
let fishPicked=0;function setPhoto(img,item){img.src=item.url;img.onerror=()=>{img.src=item.fallback;};}
function setupNameChips(){const box=document.getElementById('fishChips');const photo=document.getElementById('fishPhoto');const correct=FISH_PHOTOS[Math.floor(Math.random()*FISH_PHOTOS.length)];
setPhoto(photo,correct);box.innerHTML='';fishPicked=0;document.getElementById('nameStatus').textContent='0 / 3';
const names=FISH_PHOTOS.map(f=>f.name).sort(()=>Math.random()-0.5);const set=new Set([correct.name]);
for(const n of names){const chip=document.createElement('div');chip.className='chip';chip.textContent=n;
chip.addEventListener('click',()=>{if(chip.classList.contains('correct')||chip.classList.contains('wrong'))return;
if(set.has(n)){chip.classList.add('correct');fishPicked++;}else{chip.classList.add('wrong');}
document.getElementById('nameStatus').textContent=fishPicked+' / 3';
if(fishPicked<3 && chip.classList.contains('correct')){const next=FISH_PHOTOS[Math.floor(Math.random()*FISH_PHOTOS.length)];setPhoto(photo,next);set.clear();set.add(next.name);} }); box.appendChild(chip);}}
setupNameChips();

/* Quiz (100) */
const BASE_Q=[
 ["Usual recreational safety stop?","3 min at 5 m / 15 ft","1 min at 3 m / 10 ft","5 min at 9 m / 30 ft"],
 ["Max recommended depth for recreational air diving?","40 m / 130 ft","60 m / 200 ft","25 m / 82 ft"],
 ["Narcosis often noticeable around…","30 m / 100 ft","10 m / 33 ft","6 m / 20 ft"],
 ["Parrotfish help reefs by…","Grazing algae off reefs","Hunting small fish","Cleaning sharks"],
 ["Recommended ascent rate (max)?","≤9–10 m/min (30 ft/min)","≥30 m/min (100 ft/min)","No limit"]
];
const QUIZ=[];const VAR=[" (choose best)?"," — what’s standard?"," — select the correct."];
for(let i=0;i<100;i++){const b=BASE_Q[i%BASE_Q.length];const q=i%3===0?b[0]:b[0].replace("?",VAR[i%3]);QUIZ.push({q,opts:[{t:b[1],good:true},{t:b[2],good:false},{t:b[3],good:false}]});}
let qIndex=0;
function setupQuiz(){const qEl=document.getElementById('quizQ'),box=document.getElementById('quizOpts'),msg=document.getElementById('quizMsg');
function render(){const item=QUIZ[qIndex%QUIZ.length];qEl.textContent=item.q;box.innerHTML='';msg.textContent='';
item.opts.forEach(o=>{const chip=document.createElement('div');chip.className='chip';chip.textContent=o.t;
chip.addEventListener('click',()=>{if(o.good){chip.classList.add('correct');msg.textContent='Correct ✅';setTimeout(()=>{qIndex++;render();},700);}else{chip.classList.add('wrong');msg.textContent='Try again';}});
box.appendChild(chip);});}
render();}
setupQuiz();

/* Hidden fish: rotating coral scenes */
function gardenScene(idx){const g=document.getElementById('garden');g.innerHTML='';
const palettes=[['#ff6b6b','#ffa94d','#ffd43b','#ff99c8','#b197fc','#69db7c'],['#74c0fc','#a5d8ff','#d0bfff','#ffc9c9','#ffe066','#b2f2bb'],['#f8c3cd','#f6bd60','#84dcc6','#bde0fe','#cdb4db','#ffd6a5']];
const p=palettes[idx%palettes.length];const pieces=10+Math.floor(Math.random()*8);let found=0,total=0;
for(let i=0;i<pieces;i++){const c=document.createElement('div');c.className='coral';c.style.left=(10+Math.random()*380)+'px';c.style.top=(120+Math.random()*120)+'px';
c.style.width=(30+Math.random()*80)+'px';c.style.height=(20+Math.random()*60)+'px';c.style.background=p[i%p.length];c.style.transform='rotate('+(-10+Math.random()*20)+'deg)';g.appendChild(c);}
total=3+Math.floor(Math.random()*3);document.getElementById('foundTotal').textContent=total;
for(let j=0;j<total;j++){const f=document.createElement('div');f.className='coral';f.style.left=(20+Math.random()*360)+'px';f.style.top=(140+Math.random()*90)+'px';
f.style.width='26px';f.style.height='16px';f.style.borderRadius='14px 14px 14px 4px';f.style.background='#ffd166';f.style.boxShadow='12px 0 0 -6px #ffd166,-6px 0 0 #ffb703';
f.style.cursor='pointer';f.addEventListener('click',()=>{f.style.outline='2px solid #fff';found++;document.getElementById('foundCount').textContent=found;});g.appendChild(f);}
}
let scene=0;gardenScene(scene);setInterval(()=>{scene=(scene+1)%3;gardenScene(scene);},15000);

// Register service worker
if('serviceWorker' in navigator){navigator.serviceWorker.register('./sw.js').catch(()=>{});}
