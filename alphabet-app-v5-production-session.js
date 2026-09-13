'use strict';

function submitProductionRating(t,rating,metrics={}){
  if(session.locked)return;session.locked=true;const isRepair=!!t.isRepair;
  const row=C.recordProductionSelfCheck(S,{letter:t.letter,family:t.family,rating,isRepair,repairId:t.repairId||'',sessionId:session.sessionId,questionId:t.questionId,audioSource:t.family==='audio-to-writing'?'human':'',...metrics});
  session.productionAnswers.push({...row,masteryAfter:C.productionMastery(S,t.letter),confidenceAfter:C.productionConfidence(S,t.letter)});session.lastProductionLetter=t.letter;
  if(isRepair&&session.repairCurrent){
    const current=session.repairCurrent;current.done=true;current.resolved=rating==='pass';
    if(rating==='pass')session.repairsResolved++;
    else{session.repairsFailed++;C.scheduleProductionRepairForSession(session,t,S,row.repairId||t.repairId,Math.random)}
  }else if(rating==='again')C.scheduleProductionRepairForSession(session,t,S,row.repairId,Math.random);
  persist();const el=document.getElementById('productionStatus');if(el)el.textContent=rating==='pass'?'Selbstbewertung: passt. Als Produktions-Evidenz gespeichert.':rating==='unsure'?'Selbstbewertung: unsicher. Kein voller Mastery-Erfolg; später erneut prüfen.':'Selbstbewertung: nochmal. Eine spätere, andere Reparatur wurde eingeplant.';setTimeout(nextQuestion,700);
}

const currentTaskV5Base=currentTask;
currentTask=function(){
  if(!session)return null;C.initProductionSession(session,S);
  const repair=dueRepair();if(repair){session.repairCurrent=repair;return repair.task}session.repairCurrent=null;
  if(session.productionCurrent)return session.productionCurrent;
  if(C.shouldInsertProduction(S,session,Date.now())){session.productionCurrent=C.selectProductionTask(S,session,Math.random,Date.now());if(session.productionCurrent)return session.productionCurrent}
  if(session.productionOnly)return null;
  return currentTaskV5Base();
};

nextQuestion=function(){
  if(session.repairCurrent){session.repairCurrent=null}
  else if(session.productionCurrent){session.productionCurrent=null;session.lastProductionMainIndex=session.mainIndex}
  else session.mainIndex++;
  session.locked=false;
  if(C.shouldInsertProduction(S,session,Date.now())){renderExam();return}
  if(session.productionOnly){const ps=C.productionSummary(session);if(ps.total>=session.productionTargetCount){finishExam();return}renderExam();return}
  const target=targetCount();
  if(session.mainIndex>=target&&!dueRepair()){
    // Normale Repairs dürfen am Ende wie bisher vorgezogen werden. Produktions-Repairs bleiben offen,
    // wenn ihr Abstand von 3–7 objektiven Hauptfragen in dieser Session nicht mehr erreicht wird.
    const pending=session.pendingRepairs.find(x=>!x.done&&x.originSkill!=='writtenProduction');
    if(pending&&session.feedback==='learning'){pending.dueAfterMainIndex=session.mainIndex;renderExam();return}
    finishExam();
  }else renderExam();
};

const renderExamV5Base=renderExam;
renderExam=function(){
  renderExamV5Base();const t=session&&currentTask();
  if(t?.interaction==='writtenProduction'){
    setupWrittenProduction(t);const tag=app.querySelector('.lesson-head .tag');if(tag)tag.textContent=t.isRepair?'Produktions-Repair':'Freie Produktion';
    const eye=app.querySelector('.stage>.eyebrow');if(eye)eye.textContent=`${session.title} · freie Produktion${t.isRepair?' · Repair':''}`;
  }
};

const finishExamV5Base=finishExam;
finishExam=function(){if(session)session.productionSummary=C.productionSummary(session);return finishExamV5Base()};
const renderResultsV5Base=renderResults;
renderResults=function(){
  const prod=session?.productionSummary||C.productionSummary(session);
  if(session?.productionOnly){
    shell(`<section class="card hero"><div class="eyebrow">PRODUKTIONSTEST</div><h1>${prod.pass}/${prod.total} selbst als „passt“ bewertet</h1><p>Freie Produktion wird ehrlich getrennt vom objektiven Prüfungs-Score geführt.</p></section><section class="card"><div class="result-grid"><div><span>Passt</span><b>${prod.pass}</b></div><div><span>Fast / unsicher</span><b>${prod.unsure}</b></div><div><span>Nochmal</span><b>${prod.again}</b></div><div><span>Production Repairs</span><b>${prod.repairPass}/${prod.repairTotal}</b></div></div><div class="actions"><button class="btn primary" data-nav="examMenu">Weitere Tests</button><button class="btn" data-nav="home">Startseite</button></div></section>`);return;
  }
  renderResultsV5Base();if(prod.total){const card=document.createElement('section');card.className='card production-result';card.innerHTML=`<h2>Freie Produktion</h2><p>Separat vom objektiven Hauptscore.</p><div class="result-grid"><div><span>Aufgaben</span><b>${prod.total}</b></div><div><span>Passt</span><b>${prod.pass}</b></div><div><span>Fast / unsicher</span><b>${prod.unsure}</b></div><div><span>Nochmal</span><b>${prod.again}</b></div></div>`;app.querySelector('.card.hero')?.insertAdjacentElement('afterend',card)}
};

const renderDetailV5Base=renderDetail;
renderDetail=function(){
  renderDetailV5Base();const c=selectedLetter||'А',x=C.summaryForLetter(S,c),p=x.production,nav=app.querySelector('.bottom-nav'),card=document.createElement('section');card.className='card production-profile';
  card.innerHTML=`<h2>Freie Produktion</h2><div class="type-grid"><div><span>Produktion</span><b>${p.mastery}%</b><small>${esc(p.status)} · Confidence ${p.confidence}%</small></div><div><span>Freie Abrufe</span><b>${p.attempts}</b><small>${p.pass} passt · ${p.unsure} unsicher · ${p.again} nochmal</small></div><div><span>Audio → Zeichnen</span><b>${p.audioReady?'freigeschaltet':'noch gesperrt'}</b><small>${p.lastAudioAt?`zuletzt ${new Date(p.lastAudioAt).toLocaleDateString('de-DE')}`:'noch kein Versuch'}</small></div><div><span>Nächster Schritt</span><b>${esc(p.next)}</b><small>${p.lastErrorAt?'letzter Produktionsfehler vorhanden':'kein aktueller Produktionsfehler'}</small></div></div>`;
  (nav||app).insertAdjacentElement(nav?'beforebegin':'beforeend',card);
};

const renderExamMenuV5Base=renderExamMenu;
renderExamMenu=function(){
  renderExamMenuV5Base();const a=C.productionTestAvailability(S),nav=app.querySelector('.bottom-nav'),card=document.createElement('section');card.className='card production-tests';
  card.innerHTML=`<div class="eyebrow">Freie Produktion</div><h2>Zeichentests</h2><p>Diese Tests erscheinen erst, wenn genügend Buchstaben stabil genug für echten Abruf ohne Antwortoptionen sind. Aktuell bereit: ${a.ready}/33.</p><div class="actions"><button class="btn" data-prod-test="5" ${a.test5?'':'disabled'}>Produktionstest 5</button><button class="btn" data-prod-test="10" ${a.test10?'':'disabled'}>Produktionstest 10</button><button class="btn" data-prod-test="20" ${a.test20?'':'disabled'}>Produktionstest 20</button><button class="btn" data-prod-test="33" ${a.full?'':'disabled'}>Vollständiger Produktionscheck</button></div>`;
  (nav||app).insertAdjacentElement(nav?'beforebegin':'beforeend',card);card.querySelectorAll('[data-prod-test]').forEach(b=>b.onclick=()=>{const requested=Number(b.dataset.prodTest),count=requested===33?20:requested;session=C.createProductionTestSession(S,count);screen='exam';renderExam()});
};
