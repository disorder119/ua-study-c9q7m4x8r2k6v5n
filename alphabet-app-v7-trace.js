'use strict';

// V7.1 · Schreiben mit dem Finger.
//
// Wer neue Schriftzeichen mit der Hand schreibt, erkennt sie später sicherer
// als jemand, der sie nur ansieht oder tippt (Longcamp et al. 2005, 2008;
// Wiley & Rapp 2021). Zwei Formen:
//   trace – Nachfahren mit grauer Vorlage, direkt nach der Lernkarte. Zählt nicht.
//   write – aus dem Gedächtnis schreiben, danach wird die Vorlage eingeblendet
//           und man vergleicht selbst. Eine automatische Bewertung freier
//           Handschrift wäre unzuverlässig; die Selbstkontrolle ist als solche
//           ausgewiesen.
// Beide lassen sich überspringen: Niemand wird durch eine Zeichenfläche blockiert.

// Reine Bewertung auf einem Raster: mask = Vorlage, fat = Vorlage mit
// Toleranzrand, ink = gezeichnete Striche (jeweils 0/1 je Rasterpunkt).
function pathTraceScore(mask,fat,ink){
  let maskCount=0,hit=0,inkCount=0,outside=0;
  for(let i=0;i<mask.length;i++){
    if(mask[i]){maskCount++;if(ink[i])hit++}
    if(ink[i]){inkCount++;if(!fat[i])outside++}
  }
  return {covered:maskCount?hit/maskCount:0,outside:inkCount?outside/inkCount:1,ink:inkCount};
}
// Getroffen heißt: gut die Hälfte der Vorlage überdeckt und nicht überwiegend daneben.
function pathTraceVerdict(score){return !!score&&score.covered>=.55&&score.outside<=.5}

function pathTraceMarkup(step){
  const memory=step.type==='write';
  return `<div class="eyebrow center">${memory?'Schreiben · aus dem Gedächtnis':'Nachschreiben · mit dem Finger'}</div>
<div class="prompt">${esc(memory?step.prompt:`Fahre ${step.letter} und ${step.lower} nach.`)}</div>
<div class="path-trace"><canvas id="pathTraceCanvas" class="path-trace-canvas" role="img" aria-label="${memory?'Schreibfläche ohne Vorlage':`Schreibfläche mit Vorlage ${esc(step.letter)} ${esc(step.lower)}`}"></canvas></div>
<div class="actions path-actions" id="pathTraceActions"><button class="btn" id="pathTraceClear" type="button">Löschen</button><button class="btn primary xl" id="pathTraceDone" type="button" disabled>Fertig</button></div>
<button class="path-skip" id="pathTraceSkip" type="button">${memory?'Ohne Schreiben antworten':'Überspringen'}</button>`;
}

// handlers: {done(score), self(good), skip()}
function wirePathTrace(step,handlers){
  const canvas=document.getElementById('pathTraceCanvas'),doneButton=document.getElementById('pathTraceDone'),memory=step.type==='write';
  const box=canvas.getBoundingClientRect(),W=Math.max(120,Math.round(box.width)),H=Math.max(90,Math.round(box.height)),dpr=Math.min(2,window.devicePixelRatio||1);
  canvas.width=Math.round(W*dpr);canvas.height=Math.round(H*dpr);
  const ctx=canvas.getContext('2d');
  const text=`${step.letter}${step.lower}`,font=`800 ${Math.round(H*.66)}px system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif`,pen=Math.max(9,H*.055);
  const strokes=[];
  let current=null,length=0,guide=!memory,closed=false;
  const drawGuide=(c,color,fat=0)=>{c.save();c.font=font;c.textAlign='center';c.textBaseline='middle';c.fillStyle=color;c.strokeStyle=color;c.lineJoin='round';if(fat){c.lineWidth=fat;c.strokeText(text,W/2,H*.52)}c.fillText(text,W/2,H*.52);c.restore()};
  const drawInk=(c,color,width)=>{c.save();c.strokeStyle=color;c.lineWidth=width;c.lineCap='round';c.lineJoin='round';for(const stroke of strokes){c.beginPath();stroke.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));if(stroke.length===1)c.lineTo(stroke[0][0]+.5,stroke[0][1]);c.stroke()}c.restore()};
  const paint=()=>{ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,W,H);if(guide)drawGuide(ctx,'#d3d9e4');drawInk(ctx,'#1f6feb',pen)};
  const point=event=>{const r=canvas.getBoundingClientRect();return [event.clientX-r.left,event.clientY-r.top]};
  canvas.onpointerdown=event=>{
    if(closed)return;
    event.preventDefault();
    try{canvas.setPointerCapture(event.pointerId)}catch(_){}
    current=[point(event)];strokes.push(current);paint();
  };
  canvas.onpointermove=event=>{
    if(!current||closed)return;
    event.preventDefault();
    const next=point(event),last=current[current.length-1];
    length+=Math.hypot(next[0]-last[0],next[1]-last[1]);current.push(next);paint();
    // Ein Tupfer ist kein Buchstabe: erst nach einer echten Strichlänge geht es weiter.
    doneButton.disabled=length<H*.6;
  };
  canvas.onpointerup=canvas.onpointercancel=()=>{current=null};
  const score=()=>{
    const scale=96/W,gw=96,gh=Math.max(1,Math.round(H*scale));
    const layer=draw=>{const off=document.createElement('canvas');off.width=gw;off.height=gh;const c=off.getContext('2d');c.setTransform(scale,0,0,scale,0,0);draw(c);const data=c.getImageData(0,0,gw,gh).data,out=new Uint8Array(gw*gh);for(let i=0;i<out.length;i++)out[i]=data[i*4+3]>80?1:0;return out};
    return pathTraceScore(layer(c=>drawGuide(c,'#000')),layer(c=>drawGuide(c,'#000',H*.17)),layer(c=>drawInk(c,'#000',pen*1.5)));
  };
  document.getElementById('pathTraceClear').onclick=()=>{if(closed)return;strokes.length=0;length=0;current=null;doneButton.disabled=true;paint()};
  document.getElementById('pathTraceSkip').onclick=()=>{if(!closed)handlers.skip()};
  doneButton.onclick=()=>{
    if(closed||doneButton.disabled)return;
    closed=true;guide=true;paint();
    let result=null;
    try{result=score()}catch(_){result=null}
    document.getElementById('pathTraceSkip').hidden=true;
    const actions=document.getElementById('pathTraceActions');
    if(memory){
      actions.innerHTML='<button class="btn" id="pathSelfBad" type="button">Noch nicht</button><button class="btn primary xl" id="pathSelfGood" type="button">Getroffen</button>';
      document.getElementById('pathSelfGood').onclick=()=>handlers.self(true);
      document.getElementById('pathSelfBad').onclick=()=>handlers.self(false);
    }else actions.innerHTML='';
    handlers.done(result);
  };
  paint();
}
