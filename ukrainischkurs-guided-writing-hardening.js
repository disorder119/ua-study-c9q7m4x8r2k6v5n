/* Ukrainischkurs für Joel · Guided Writing Hardening v1
   Druckschrift zuerst. Keine erfundene normative Strichfolge.
   Die Nachmalprüfung verlangt Bewegung entlang der Form und räumliche Abdeckung,
   statt bloßes Kritzeln an einer einzigen Stelle zu akzeptieren. */
(()=>{
  const VERSION=1,GRID=12;
  const day=()=>Number(s?.day)||0;
  function guidedState(){
    const root=s?.guidedAlphabet?.days?.[String(day())];
    return root&&typeof root==='object'?root:null;
  }
  function advance(){
    const st=guidedState();if(!st)return;
    st.stage='letter';
    try{save()}catch{}
    try{render()}catch{}
  }
  function patchTrace(){
    const oldCanvas=document.getElementById('guidedCanvas');
    if(!oldCanvas||oldCanvas.dataset.writingQuality==='1')return;
    const trace=oldCanvas.closest('.guided-trace'),letter=trace?.querySelector('.guided-trace-letter')?.textContent?.trim();
    if(!trace||!letter)return;

    const canvas=oldCanvas.cloneNode(false);canvas.dataset.writingQuality='1';oldCanvas.replaceWith(canvas);
    canvas.setAttribute('role','img');canvas.setAttribute('aria-label','Zeichenfläche: Buchstabe '+letter+' mit der Maus oder dem Finger nachfahren.');
    const oldClear=document.getElementById('guidedClear'),oldDone=document.getElementById('guidedStrokeDone');
    if(!oldClear||!oldDone)return;
    const clear=oldClear.cloneNode(true),done=oldDone.cloneNode(true);oldClear.replaceWith(clear);oldDone.replaceWith(done);
    done.disabled=true;done.textContent='Buchstabe noch nicht fertig';

    const fakeSteps=document.querySelector('.guided-drawsteps');if(fakeSteps)fakeSteps.hidden=true;
    const guide=document.getElementById('guidedStrokeGuide');if(guide)guide.innerHTML='<b>✏️</b><span>Druckschrift: Fahre die ganze helle Form nach.</span>';
    let note=document.getElementById('guidedWritingQualityNote');
    if(!note){note=document.createElement('div');note.id='guidedWritingQualityNote';note.className='guided-writing-note';note.setAttribute('aria-live','polite');done.insertAdjacentElement('beforebegin',note)}
    note.textContent='Noch offen: Verteile deine Linie über den ganzen Buchstaben.';
    let skip=document.getElementById('guidedWritingSkip');
    if(!skip){skip=document.createElement('button');skip.id='guidedWritingSkip';skip.type='button';skip.className='guided-writing-skip';skip.textContent='Ich kann hier nicht zeichnen (Tastatur/Screenreader) — trotzdem weiter';done.insertAdjacentElement('afterend',skip)}
    skip.onclick=()=>advance();

    const ctx=canvas.getContext('2d'),mask=document.createElement('canvas'),mctx=mask.getContext('2d',{willReadFrequently:true});
    let drawing=false,last=null,distance=0,total=0,hits=0,occupied=new Set(),visited=new Set(),minDistance=180;
    const key=(x,y)=>`${x}:${y}`;
    function fit(){
      const r=canvas.getBoundingClientRect(),dpr=Math.max(1,window.devicePixelRatio||1);
      if(!r.width||!r.height)return;
      canvas.width=Math.round(r.width*dpr);canvas.height=Math.round(r.height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);ctx.lineWidth=12;ctx.lineCap='round';ctx.lineJoin='round';ctx.strokeStyle='#318c4d';
      mask.width=Math.max(1,Math.round(r.width));mask.height=Math.max(1,Math.round(r.height));mctx.clearRect(0,0,mask.width,mask.height);mctx.fillStyle='#000';mctx.textAlign='center';mctx.textBaseline='middle';mctx.font=`900 ${Math.floor(Math.min(r.height*.76,r.width*.58))}px Arial,sans-serif`;mctx.fillText(letter,r.width/2,r.height/2+r.height*.04);
      occupied=new Set();const cellW=mask.width/GRID,cellH=mask.height/GRID;
      for(let gy=0;gy<GRID;gy++)for(let gx=0;gx<GRID;gx++){
        const x=Math.floor(gx*cellW),y=Math.floor(gy*cellH),w=Math.max(1,Math.ceil(cellW)),h=Math.max(1,Math.ceil(cellH)),data=mctx.getImageData(x,y,Math.min(w,mask.width-x),Math.min(h,mask.height-y)).data;
        let on=false;for(let i=3;i<data.length;i+=4){if(data[i]>24){on=true;break}}if(on)occupied.add(key(gx,gy));
      }
      minDistance=Math.max(150,Math.min(330,r.width*.62));
      resetProgress(false);
    }
    function pos(e){const r=canvas.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}}
    function near(p){
      const x=Math.round(p.x),y=Math.round(p.y),rad=18,xx=Math.max(0,x-rad),yy=Math.max(0,y-rad),w=Math.min(mask.width-xx,rad*2),h=Math.min(mask.height-yy,rad*2);if(w<=0||h<=0)return false;
      const data=mctx.getImageData(xx,yy,w,h).data;for(let i=3;i<data.length;i+=4)if(data[i]>24)return true;return false;
    }
    function markCoverage(p){
      const gx=Math.max(0,Math.min(GRID-1,Math.floor(p.x/Math.max(1,mask.width)*GRID))),gy=Math.max(0,Math.min(GRID-1,Math.floor(p.y/Math.max(1,mask.height)*GRID)));
      for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){const x=gx+dx,y=gy+dy,k=key(x,y);if(x>=0&&x<GRID&&y>=0&&y<GRID&&occupied.has(k))visited.add(k)}
    }
    function metrics(){return{hitRatio:total?hits/total:0,coverage:occupied.size?visited.size/occupied.size:0}}
    function refresh(){
      const m=metrics(),ready=distance>=minDistance&&m.hitRatio>=.72&&m.coverage>=.34;
      done.disabled=!ready;done.textContent=ready?'Buchstabe fertig ✓':'Buchstabe noch nicht fertig';
      const pct=Math.min(100,Math.round(m.coverage/0.34*100));
      note.textContent=ready?'Gut: Die Form wurde über mehrere Bereiche nachgezogen.':`Form-Abdeckung ${pct}% · bleib auf der hellen Vorlage und gehe in noch fehlende Bereiche.`;
    }
    function resetProgress(clearInk=true){distance=0;total=0;hits=0;visited=new Set();last=null;if(clearInk){const r=canvas.getBoundingClientRect();ctx.clearRect(0,0,r.width,r.height)}refresh()}
    canvas.addEventListener('pointerdown',e=>{e.preventDefault();drawing=true;last=pos(e);try{canvas.setPointerCapture(e.pointerId)}catch{}ctx.beginPath();ctx.moveTo(last.x,last.y)});
    canvas.addEventListener('pointermove',e=>{if(!drawing)return;e.preventDefault();const p=pos(e);ctx.lineTo(p.x,p.y);ctx.stroke();if(last)distance+=Math.hypot(p.x-last.x,p.y-last.y);last=p;total++;if(near(p)){hits++;markCoverage(p)}refresh()});
    const end=e=>{if(!drawing)return;e.preventDefault();drawing=false;last=null;refresh()};canvas.addEventListener('pointerup',end);canvas.addEventListener('pointercancel',end);
    clear.onclick=()=>resetProgress(true);done.onclick=()=>{if(done.disabled)return;advance()};
    if(typeof ResizeObserver==='function'){const ro=new ResizeObserver(()=>fit());ro.observe(canvas)}else fit();
  }
  const LEAD_TEXT='Druckschrift zuerst. Fahre die helle Form möglichst vollständig nach.';
  function patchCopy(){
    if(!document.body.classList.contains('guided-alphabet'))return;
    const trace=document.getElementById('guidedCanvas');if(trace)patchTrace();
    const lead=trace?.closest('.guided-card')?.querySelector('.guided-lead');if(lead&&lead.textContent!==LEAD_TEXT)lead.textContent=LEAD_TEXT;
  }
  const observer=new MutationObserver(()=>queueMicrotask(patchCopy));
  function start(){observer.observe(document.documentElement,{childList:true,subtree:true});patchCopy()}
  const css=document.createElement('style');css.textContent='.guided-writing-note{max-width:470px;margin:10px auto 2px;padding:10px 12px;border-radius:13px;background:#f2f8f2;color:#607468;font-size:.82rem;font-weight:750}.guided-writing-note+button{margin-top:10px}.guided-writing-skip{display:block;margin:10px auto 0;background:none;border:none;color:#607468;font-size:.78rem;text-decoration:underline;cursor:pointer;padding:4px}.guided-writing-skip:focus-visible{outline:3px solid #1558b5;outline-offset:2px}';document.head.append(css);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
  window.UKRAINIAN_GUIDED_WRITING_HARDENING={version:VERSION,printFirst:true,normativeStrokeOrderClaim:false,spatialCoverageRequired:true,minHitRatio:.72,minCoverage:.34,grid:GRID,antiScribble:true};
})();