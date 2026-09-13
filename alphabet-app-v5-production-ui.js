'use strict';

const taskBodyV5Base=taskBody;
taskBody=function(t){
  if(t.interaction!=='writtenProduction')return taskBodyV5Base(t);
  const cue=t.display?`<div id="productionCue" class="big-letter">${esc(t.display)}</div>`:'',audio=t.family==='audio-to-writing'?`<div class="audio-row"><button class="btn primary" id="productionAudio">🔊 Menschliche Aufnahme starten</button></div><div id="productionAudioStatus" class="feedback" aria-live="polite">Audio noch nicht gestartet.</div>`:'';
  return `<div class="production-task">${cue}<div class="prompt">${esc(t.prompt)}</div>${audio}<p class="muted center">Zeichne aus dem Gedächtnis. Die Referenz bleibt bis zu deiner Aktion verborgen.</p><div class="canvas-wrap"><canvas class="trace-canvas" id="productionCanvas" width="600" height="600" aria-label="Schreibfläche für freie Zeichenproduktion"></canvas><div class="trace-actions"><button class="btn primary" id="productionCompare" disabled>Jetzt vergleichen</button><button class="btn" id="productionClear">Neu zeichnen</button></div></div><div id="productionReference" class="production-reference hidden"><div><span>Deine Zeichnung bleibt links sichtbar.</span><strong>${esc(t.referenceUpper)} <small>${esc(t.referenceLower)}</small></strong></div><p>Wie gut passt deine Form? Diese Schreibaufgabe wird von dir selbst bewertet und zählt nicht zum objektiven Prüfungs-Score.</p><div class="actions"><button class="btn good" data-production-rating="pass">Passt</button><button class="btn" data-production-rating="unsure">Fast / unsicher</button><button class="btn danger" data-production-rating="again">Nochmal</button></div></div><div id="productionStatus" class="feedback" role="status" aria-live="polite"></div></div>`;
};

function setupWrittenProduction(t){
  const canvas=document.getElementById('productionCanvas'),ctx=canvas?.getContext('2d'),compare=document.getElementById('productionCompare'),clear=document.getElementById('productionClear'),reference=document.getElementById('productionReference'),status=document.getElementById('productionStatus'),cue=document.getElementById('productionCue');if(!canvas||!ctx)return;
  let drawing=false,last=null,ink=0,strokeCount=0,startedAt=0,minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity,audioReady=t.family!=='audio-to-writing',audioFailures=0;
  ctx.lineWidth=18;ctx.lineCap='round';ctx.strokeStyle='#111827';
  const point=e=>{const r=canvas.getBoundingClientRect();return{x:(e.clientX-r.left)*canvas.width/r.width,y:(e.clientY-r.top)*canvas.height/r.height}};
  const updateCompare=()=>compare.disabled=ink<180||!audioReady;
  const reset=()=>{ctx.clearRect(0,0,canvas.width,canvas.height);ink=0;strokeCount=0;startedAt=0;minX=minY=Infinity;maxX=maxY=-Infinity;reference.classList.add('hidden');updateCompare()};
  canvas.onpointerdown=e=>{if(!audioReady)return;drawing=true;strokeCount++;if(!startedAt)startedAt=Date.now();last=point(e);minX=Math.min(minX,last.x);minY=Math.min(minY,last.y);maxX=Math.max(maxX,last.x);maxY=Math.max(maxY,last.y);canvas.setPointerCapture?.(e.pointerId)};
  canvas.onpointermove=e=>{if(!drawing)return;const p=point(e);ctx.beginPath();ctx.moveTo(last.x,last.y);ctx.lineTo(p.x,p.y);ctx.stroke();ink+=Math.hypot(p.x-last.x,p.y-last.y);last=p;minX=Math.min(minX,p.x);minY=Math.min(minY,p.y);maxX=Math.max(maxX,p.x);maxY=Math.max(maxY,p.y);updateCompare()};
  canvas.onpointerup=canvas.onpointercancel=()=>{drawing=false;updateCompare()};
  clear.onclick=reset;compare.onclick=()=>{reference.classList.remove('hidden');status.textContent='Vergleiche deine Form mit der Referenz. Keine automatische Handschriftbewertung.'};
  reference.querySelectorAll('[data-production-rating]').forEach(b=>b.onclick=()=>submitProductionRating(t,b.dataset.productionRating,{strokeCount,durationMs:startedAt?Date.now()-startedAt:0,bounds:{w:Number.isFinite(maxX-minX)?maxX-minX:0,h:Number.isFinite(maxY-minY)?maxY-minY:0}}));
  if(t.family==='visual-memory-writing'&&cue)setTimeout(()=>cue.classList.add('hidden'),t.cueMs||1500);
  if(t.family==='audio-to-writing'){
    canvas.style.opacity='.55';const btn=document.getElementById('productionAudio'),audioStatus=document.getElementById('productionAudioStatus');
    btn.onclick=()=>{const src=window.UKRAINIAN_LETTER_AUDIO?.[t.letter];if(!src){replaceProductionAudio(t,'Keine menschliche Buchstabenaufnahme verfügbar.');return}btn.disabled=true;audioStatus.textContent='Menschliche Aufnahme läuft …';const a=new Audio(src);let settled=false,timer=setTimeout(()=>{if(!settled){settled=true;a.pause?.();fail()}},9000);const fail=()=>{clearTimeout(timer);audioFailures++;btn.disabled=false;audioStatus.textContent=audioFailures<2?'Technischer Fehler · erneut versuchen':'Audio technisch nicht verfügbar';if(audioFailures>=2)replaceProductionAudio(t,`${t.letter}: Audio zweimal nicht erreichbar.`)};a.onended=()=>{if(settled)return;settled=true;clearTimeout(timer);audioReady=true;canvas.style.opacity='1';btn.disabled=false;audioStatus.textContent='Gehört. Jetzt aus dem Gedächtnis zeichnen.';updateCompare()};a.onerror=()=>{if(settled)return;settled=true;fail()};a.play().catch(()=>{if(settled)return;settled=true;clearTimeout(timer);btn.disabled=false;audioStatus.textContent='Tippe erneut zum Starten, falls der Browser Audio blockiert.'})};
  }
  updateCompare();
}
function replaceProductionAudio(t,msg){
  toast(msg+' Kein Benutzerfehler. Die Aufgabe wird ohne Audio ersetzt.');
  const alternatives=C.productionFamiliesFor(S,t.letter).filter(f=>f!=='audio-to-writing'),family=alternatives.includes('sound-to-writing')?'sound-to-writing':alternatives[0];
  if(!family){session.productionTechnicalSkips.push({letter:t.letter,family:t.family,at:Date.now()});session.productionCurrent=null;setTimeout(nextQuestion,250);return}
  session.productionCurrent=C.productionTask(S,t.letter,family,session,Math.random,{scheduledReason:'audio-production-fallback'});setTimeout(renderExam,250);
}

const v5ProductionStyle=document.createElement('style');
v5ProductionStyle.textContent=`.production-reference{margin-top:16px;border-top:1px solid var(--line,#d1d5db);padding-top:16px}.production-reference>div{display:flex;justify-content:space-between;align-items:center;gap:16px}.production-reference strong{font-size:64px;line-height:1}.production-reference strong small{font-size:34px}.production-task .canvas-wrap{margin-top:14px}.production-task canvas{touch-action:none}.production-profile .type-grid{margin-top:12px}@media(max-width:760px){.production-reference>div{align-items:flex-start;flex-direction:column}.production-reference strong{font-size:54px}.production-tests .actions .btn{width:100%}}`;
document.head.append(v5ProductionStyle);
