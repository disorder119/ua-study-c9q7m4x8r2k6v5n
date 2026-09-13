'use strict';

const currentTaskProductionRepairBase=currentTask;
currentTask=function(){if(session)C.initProductionSession(session,S,Math.random);return currentTaskProductionRepairBase()};

submitProductionRating=function(t,rating,metrics={}){
  if(session.locked)return;session.locked=true;const isRepair=!!t.isRepair;
  const row=C.recordProductionSelfCheck(S,{letter:t.letter,family:t.family,rating,isRepair,repairId:t.repairId||'',sessionId:session.sessionId,questionId:t.questionId,audioSource:t.family==='audio-to-writing'?'human':'',...metrics});
  session.productionAnswers.push({...row,masteryAfter:C.productionMastery(S,t.letter),confidenceAfter:C.productionConfidence(S,t.letter)});session.lastProductionLetter=t.letter;
  if(isRepair&&session.repairCurrent){
    const current=session.repairCurrent;current.done=true;current.resolved=rating==='pass';
    if(rating==='pass')session.repairsResolved++;
    else{session.repairsFailed++;C.scheduleProductionRepairForSession(session,t,S,t.repairId,Math.random)}
  }else if(rating==='again')C.scheduleProductionRepairForSession(session,t,S,row.repairId,Math.random);
  persist();const el=document.getElementById('productionStatus');if(el)el.textContent=rating==='pass'?'Selbstbewertung: passt. Als Produktions-Evidenz gespeichert.':rating==='unsure'?'Selbstbewertung: unsicher. Kein voller Mastery-Erfolg; später erneut prüfen.':'Selbstbewertung: nochmal. Eine spätere, andere Reparatur wurde eingeplant.';setTimeout(nextQuestion,700);
};
