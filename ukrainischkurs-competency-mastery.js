/* Ukrainischkurs für Joel · Competency Mastery v1
   Misst konkrete Sprachmuster statt nur globale Skills. Diagnose, kein A1-Gate:
   jüngere Leistung + Mehrtages-Stabilität + Fehlergedächtnis ergeben den Mastery-Wert. */
(()=>{
  const VERSION=1;
  const SPECS={
    'survival-communication':{label:'Alltag überleben',group:'Kommunikation'},
    'location-direction':{label:'Ort ↔ Richtung',group:'Grammatik'},
    'objects-accusative':{label:'Objekte / Akkusativ',group:'Grammatik'},
    'person-verbs':{label:'Personen & Verbformen',group:'Grammatik'},
    'negation':{label:'Verneinung',group:'Grammatik'},
    'past':{label:'Vergangenheit',group:'Zeit'},
    'future':{label:'Zukunft',group:'Zeit'},
    'genitive-absence':{label:'Fehlen mit немає',group:'Genitiv'},
    'origin':{label:'Herkunft',group:'Genitiv'},
    'quantity-price':{label:'Mengen & Preis',group:'Genitiv'},
    'sentence-building':{label:'Satzbau & Endungen',group:'Produktion'},
    'writing-accuracy':{label:'Schreibgenauigkeit',group:'Produktion'}
  };
  const IDS=Object.keys(SPECS),clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
  function ensure(){
    if(!s.competencyMastery||typeof s.competencyMastery!=='object')s.competencyMastery={version:VERSION,items:{},seeded:false};
    s.competencyMastery.version=VERSION;s.competencyMastery.items=s.competencyMastery.items||{};
    IDS.forEach(id=>{const x=s.competencyMastery.items[id]||(s.competencyMastery.items[id]={attempts:0,correct:0,weight:0,scoreSum:0,successDates:[],last:'',recent:[]});x.successDates=Array.isArray(x.successDates)?[...new Set(x.successDates.filter(Boolean))]:[];x.recent=Array.isArray(x.recent)?x.recent.slice(-20):[]});return s.competencyMastery
  }
  const item=id=>ensure().items[id];
  function add(id,correct,meta={},persist=true){
    if(!SPECS[id])return;const x=item(id),weight=clamp(Number(meta.weight)||1,.2,3)*(meta.assisted?.65:1)*(meta.repair?.7:1),d=meta.date||date();
    x.attempts=(Number(x.attempts)||0)+1;x.weight=(Number(x.weight)||0)+weight;x.scoreSum=(Number(x.scoreSum)||0)+(correct?100:0)*weight;x.correct=(Number(x.correct)||0)+(correct?1:0);x.last=d;
    if(correct&&!x.successDates.includes(d))x.successDates.push(d);x.successDates=x.successDates.slice(-12);x.recent.push({date:d,correct:!!correct,weight,repair:!!meta.repair,assisted:!!meta.assisted,module:String(meta.module||'')});if(x.recent.length>20)x.recent.splice(0,x.recent.length-20);
    if(persist&&typeof save==='function')save();
  }
  function record(ids,correct,meta={}){const uniq=[...new Set((Array.isArray(ids)?ids:[ids]).filter(id=>SPECS[id]))];uniq.forEach(id=>add(id,!!correct,meta,false));if(uniq.length&&typeof save==='function')save();return profile()}
  function recentAccuracy(id){const r=item(id).recent;if(!r.length)return null;let sum=0,w=0;r.forEach((e,i)=>{const age=r.length-1-i,ww=(Number(e.weight)||1)*Math.pow(.86,age);sum+=(e.correct?100:0)*ww;w+=ww});return w?sum/w:null}
  function score(id){
    const x=item(id);if(!x.attempts&&!x.weight)return null;const lifetime=x.weight?x.scoreSum/x.weight:0,recent=recentAccuracy(id);const accuracy=recent==null?lifetime:lifetime*.28+recent*.72,days=Math.min(3,new Set(x.successDates).size),stability=days/3*14,confidence=Math.min(1,(Number(x.attempts)||0)/6)*8,errorPenalty=Math.min(12,(window.UKRAINIAN_ERROR_MEMORY?.competencyPriority?.(id)||0)*.12);return Math.round(clamp(accuracy*.78+stability+confidence-errorPenalty,0,100))
  }
  function statusFor(value,attempts=0){if(value==null||attempts<1)return 'Noch keine Evidenz';if(value>=88&&attempts>=4)return 'Robust';if(value>=75)return 'Stabil';if(value>=55)return 'Wächst';return 'Aufbau'}
  function profile(){const root=ensure();return Object.fromEntries(IDS.map(id=>{const x=root.items[id],v=score(id);return [id,{id,label:SPECS[id].label,group:SPECS[id].group,score:v,status:statusFor(v,x.attempts),attempts:Number(x.attempts)||0,successDays:new Set(x.successDates).size,last:x.last||'',errorPriority:window.UKRAINIAN_ERROR_MEMORY?.competencyPriority?.(id)||0}]}))}
  function ranked(minAttempts=1){const p=profile();return IDS.filter(id=>p[id].attempts>=minAttempts).sort((a,b)=>(p[a].score??101)-(p[b].score??101)||p[b].errorPriority-p[a].errorPriority)}
  function weakest(minAttempts=1){return ranked(minAttempts)[0]||null}
  function needsPractice(limit=3){const p=profile();return ranked(1).slice(0,limit).map(id=>p[id])}
  function seedLegacy(){
    const root=ensure();if(root.seeded)return;root.seeded=true;
    const seedRule=(stateName,offsets,ids)=>{const st=s[stateName],start=Number(st?.start);if(!Number.isFinite(start))return;offsets.forEach(off=>{const r=st?.rules?.[String(start+off)];if(r?.passed)ids.forEach(id=>add(id,true,{weight:.55,date:r.date||date(),module:'legacy-'+stateName},false))})};
    seedRule('a1GrammarBridge',[0,4,6],['location-direction']);seedRule('a1GrammarBridge',[1,5,6],['objects-accusative']);seedRule('a1GrammarBridge',[2,3,6],['person-verbs']);
    seedRule('timeBridge',[1,2,5],['past']);seedRule('timeBridge',[3,4,5],['future']);
    seedRule('genitiveBridge',[0,1,5],['genitive-absence']);seedRule('genitiveBridge',[2,5],['origin']);seedRule('genitiveBridge',[3,4,5],['quantity-price']);
    if(typeof save==='function')save();
  }
  function renderBox(){
    let box=document.getElementById('competencyMasteryBox'),p=profile(),rows=IDS.map(id=>p[id]).filter(x=>x.attempts>0);const visible=window.UKRAINIAN_LEARNING_CORE?.isComplete?.('grammar.time')&&rows.length>=3;if(!visible){if(box)box.hidden=true;return}const cards=document.getElementById('cards');if(!cards)return;if(!box){box=document.createElement('section');box.id='competencyMasteryBox';box.className='card';cards.insertAdjacentElement('afterend',box)}box.hidden=false;rows.sort((a,b)=>(a.score??101)-(b.score??101));const weak=rows[0];
    box.innerHTML='<div class="cm-head"><div><div class="label">Kompetenz-Mastery</div><h2>Nicht nur Wörter: Welche Muster sitzen?</h2></div><div class="pill">'+rows.length+' gemessen</div></div><p class="small">Der Wert kombiniert aktuelle Treffer, Wiederholung an mehreren Tagen und wiederkehrende Fehlertypen. Er ist Diagnose und verändert keine A1-Bestehensregeln.</p><div class="cm-grid">'+rows.slice(0,8).map(x=>'<div class="cm-row"><div><strong>'+x.label+'</strong><span>'+x.status+' · '+x.attempts+' Messungen</span></div><b>'+(x.score==null?'—':x.score+'%')+'</b></div>').join('')+'</div>'+(weak?'<div class="tip">Aktuell sinnvollster Muster-Fokus: <strong>'+weak.label+'</strong>. Der Tagesplan kann diesen Bereich bei passenden Reviews berücksichtigen.</div>':'');
  }
  const css=document.createElement('style');css.textContent='.cm-head{display:flex;justify-content:space-between;gap:12px}.cm-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px}.cm-row{display:flex;justify-content:space-between;gap:10px;padding:10px 11px;border-radius:12px;background:#f4f8fc}.cm-row span{display:block;font-size:.75rem;color:#526b87;margin-top:2px}.cm-row>b{font-size:1.02rem}@media(max-width:560px){.cm-grid{grid-template-columns:1fr}}';document.head.append(css);
  ensure();seedLegacy();
  window.UKRAINIAN_COMPETENCY_MASTERY={version:VERSION,ids:[...IDS],specs:{...SPECS},diagnosticOnly:true,affectsA1:false,errorAware:true,multiDayStability:true,record,score,statusFor,profile,ranked,weakest,needsPractice};
  const previousRender=render;render=function(){previousRender();renderBox()};renderBox();
})();