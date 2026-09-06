/* Ukrainischkurs für Joel · Error Memory v1
   Merkt sich nicht nur falsch/richtig, sondern wiederkehrende Fehlertypen.
   Diagnose-Layer: keine A1-Gates, keine künstliche Bewertung, keine neuen Kurstage. */
(()=>{
  const VERSION=1,core=window.UKRAINIAN_LEARNING_CORE;if(!core)return;
  const LABELS={
    'location-direction':'Ort ↔ Richtung','accusative':'Objekt-/Akkusativform','person':'Verbperson','negation':'Verneinung',
    'genitive-absence':'немає + Genitiv','past':'Vergangenheit','future':'Zukunft','origin':'Herkunft',
    'quantity':'Menge / Preis','word-order':'Wortstellung','ending':'Endung','orthography':'Schreibung','chunk':'Satzmuster'
  };
  const COMPETENCIES={
    'location-direction':['location-direction'],'accusative':['objects-accusative'],'person':['person-verbs'],negation:['negation'],
    'genitive-absence':['genitive-absence','negation'],past:['past'],future:['future'],origin:['origin'],quantity:['quantity-price'],
    'word-order':['sentence-building'],ending:['sentence-building'],orthography:['writing-accuracy'],chunk:['survival-communication']
  };
  const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
  const norm=v=>core.normalize(v,{stripStress:true});
  const list=v=>(Array.isArray(v)?v:[v]).map(x=>String(x??'')).filter(Boolean);
  const tokens=v=>norm(v).split(' ').filter(Boolean);
  const sameBag=(a,b)=>{const x=tokens(a).sort(),y=tokens(b).sort();return x.length===y.length&&x.every((v,i)=>v===y[i])};
  function levenshtein(a,b){a=norm(a);b=norm(b);const row=Array.from({length:b.length+1},(_,i)=>i);for(let i=1;i<=a.length;i++){let prev=row[0];row[0]=i;for(let j=1;j<=b.length;j++){const tmp=row[j];row[j]=Math.min(row[j]+1,row[j-1]+1,prev+(a[i-1]===b[j-1]?0:1));prev=tmp}}return row[b.length]}
  const containsAny=(text,arr)=>arr.some(x=>text.includes(x));
  const promptText=p=>String(p||'').toLocaleLowerCase('de');
  function classify(meta={}){
    const answers=list(meta.answers),target=norm(answers[0]||''),given=norm(meta.input),q=promptText(meta.prompt);
    if(!target)return {id:'chunk',label:LABELS.chunk,competencies:COMPETENCIES.chunk,confidence:.2};
    if(target.includes('немає'))return {id:'genitive-absence',label:LABELS['genitive-absence'],competencies:COMPETENCIES['genitive-absence'],confidence:.98};
    if(containsAny(target,['буду ','будеш ','буде ']))return {id:'future',label:LABELS.future,competencies:COMPETENCIES.future,confidence:.96};
    if(containsAny(target,['був','була','працював','працювала','говорив','говорила','хотів','хотіла','жив ','жила']))return {id:'past',label:LABELS.past,competencies:COMPETENCIES.past,confidence:.95};
    if(q.includes('woher')||q.includes('звідки')||containsAny(target,['з німеччини','з україни','з києва']))return {id:'origin',label:LABELS.origin,competencies:COMPETENCIES.origin,confidence:.94};
    if(containsAny(target,['гривень','квитків'])||q.includes('hrywnja')||q.includes('tickets')||q.includes('fünf')||q.includes('zehn')||q.includes('zwanzig'))return {id:'quantity',label:LABELS.quantity,competencies:COMPETENCIES.quantity,confidence:.9};
    if((q.includes('wohin')||q.includes('geh')||q.includes('fahr')||q.includes('куди'))&&containsAny(target,[' в магазин',' в ресторан',' в аптеку',' в київ']))return {id:'location-direction',label:LABELS['location-direction'],competencies:COMPETENCIES['location-direction'],confidence:.94};
    if((q.includes('wo ')||q.includes('bist')||q.includes('bin ')||q.includes('де'))&&containsAny(target,['магазині','ресторані','готелі','києві','вдома']))return {id:'location-direction',label:LABELS['location-direction'],competencies:COMPETENCIES['location-direction'],confidence:.92};
    if(containsAny(target,['каву','воду','аптеку']))return {id:'accusative',label:LABELS.accusative,competencies:COMPETENCIES.accusative,confidence:.9};
    if((target.startsWith('ти ')&&given.startsWith('я '))||(target.startsWith('я ')&&given.startsWith('ти '))||target.startsWith('він ')||target.startsWith('вона '))return {id:'person',label:LABELS.person,competencies:COMPETENCIES.person,confidence:.86};
    if(containsAny(target,['не розумію','не можу','не знаю']))return {id:'negation',label:LABELS.negation,competencies:COMPETENCIES.negation,confidence:.88};
    if(given&&sameBag(given,target)&&given!==target)return {id:'word-order',label:LABELS['word-order'],competencies:COMPETENCIES['word-order'],confidence:.82};
    const gt=tokens(given),tt=tokens(target);if(given&&gt.length===tt.length&&gt.length){let close=0;for(let i=0;i<gt.length;i++){if(gt[i]===tt[i])continue;const a=gt[i],b=tt[i],common=[...a].findIndex((_,j)=>a[j]!==b[j]);const prefix=common<0?Math.min(a.length,b.length):common;if(prefix>=Math.min(3,Math.max(1,b.length-2)))close++}if(close===1)return {id:'ending',label:LABELS.ending,competencies:COMPETENCIES.ending,confidence:.7}}
    if(given&&levenshtein(given,target)<=Math.max(1,Math.min(3,Math.round(target.length*.12))))return {id:'orthography',label:LABELS.orthography,competencies:COMPETENCIES.orthography,confidence:.68};
    return {id:'chunk',label:LABELS.chunk,competencies:COMPETENCIES.chunk,confidence:.45};
  }
  function ensure(){
    if(!s.errorMemory||typeof s.errorMemory!=='object')s.errorMemory={version:VERSION,categories:{},events:[]};
    s.errorMemory.version=VERSION;s.errorMemory.categories=s.errorMemory.categories||{};s.errorMemory.events=Array.isArray(s.errorMemory.events)?s.errorMemory.events:[];return s.errorMemory
  }
  function category(id){const root=ensure();return root.categories[id]||(root.categories[id]={wrong:0,correct:0,repairs:0,pending:0,last:'',lastWrong:'',recent:[]})}
  function record(meta={}){
    const result=classify(meta),st=category(result.id),correct=!!meta.correct,weight=clamp(Number(meta.weight)||1,.25,3),d=meta.date||date(),event={date:d,day:Number.isFinite(Number(meta.day))?Number(meta.day):Number(s.day),module:String(meta.module||''),type:result.id,correct,repair:!!meta.repair,weight};
    if(correct){st.correct+=weight;if(st.pending>0){st.pending=Math.max(0,st.pending-weight);if(meta.repair)st.repairs+=weight}}else{st.wrong+=weight;st.pending=Math.min(12,st.pending+weight);st.lastWrong=d}
    st.last=d;st.recent.push({date:d,correct,repair:!!meta.repair,weight});if(st.recent.length>16)st.recent.splice(0,st.recent.length-16);
    const root=ensure();root.events.push(event);if(root.events.length>120)root.events.splice(0,root.events.length-120);
    window.UKRAINIAN_COMPETENCY_MASTERY?.record?.(result.competencies,correct,{...meta,errorType:result.id,weight});
    if(typeof save==='function')save();return result
  }
  function priority(id){const st=category(id);let recentWrong=0,recentRight=0;st.recent.forEach((x,i)=>{const age=st.recent.length-1-i,w=Math.pow(.84,age)*(Number(x.weight)||1);if(x.correct)recentRight+=w;else recentWrong+=w});return Math.round(clamp(st.pending*12+recentWrong*8-recentRight*2,0,100))}
  function top(limit=3){const root=ensure();return Object.keys(root.categories).map(id=>({id,label:LABELS[id]||id,priority:priority(id),...root.categories[id]})).filter(x=>x.wrong>0&&x.priority>0).sort((a,b)=>b.priority-a.priority||b.pending-a.pending).slice(0,limit)}
  function priorityFor(meta={}){const c=classify(meta);return priority(c.id)}
  function competencyPriority(id){const ids=Object.entries(COMPETENCIES).filter(([,arr])=>arr.includes(id)).map(([k])=>k);return ids.length?Math.max(...ids.map(priority)):0}
  function inferCompetencies(meta={}){return classify(meta).competencies}
  function renderBox(){
    let box=document.getElementById('errorMemoryBox');const rows=top(3),visible=core.isComplete?.('grammar.location-direction')&&rows.length>0;if(!visible){if(box)box.hidden=true;return}const cards=document.getElementById('cards');if(!cards)return;if(!box){box=document.createElement('section');box.id='errorMemoryBox';box.className='card';cards.insertAdjacentElement('afterend',box)}box.hidden=false;
    box.innerHTML='<div class="em-head"><div><div class="label">Fehlergedächtnis</div><h2>Welche Fehler kommen wirklich wieder?</h2></div><div class="pill">'+rows.length+' Fokus'+(rows.length===1?'':'se')+'</div></div><p class="small">Einzelne Flüchtigkeitsfehler werden nicht dramatisiert. Erst wiederkehrende oder noch nicht reparierte Fehlertypen bekommen höhere Priorität.</p><div class="em-list">'+rows.map(x=>'<div><strong>'+x.label+'</strong><span>'+Math.round(x.pending)+' offen · '+Math.round(x.wrong)+' Fehler · '+x.priority+'/100 Priorität</span></div>').join('')+'</div>';
  }
  const css=document.createElement('style');css.textContent='.em-head{display:flex;justify-content:space-between;gap:12px}.em-list{display:grid;gap:7px}.em-list>div{display:flex;justify-content:space-between;gap:12px;padding:9px 11px;background:#f4f8fc;border-radius:12px}.em-list span{font-size:.78rem;color:#526b87;text-align:right}@media(max-width:560px){.em-list>div{display:block}.em-list span{display:block;text-align:left;margin-top:3px}}';document.head.append(css);
  window.UKRAINIAN_ERROR_MEMORY={version:VERSION,labels:{...LABELS},diagnosticOnly:true,affectsA1:false,classify,record,priority,priorityFor,competencyPriority,inferCompetencies,top};
  const previousRender=render;render=function(){previousRender();renderBox()};ensure();renderBox();
})();