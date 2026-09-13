'use strict';

function productionSignature(task){return [task.letter,task.family,task.caseTarget||'',task.confusionTarget||'',task.audioStimulusId||'',task.cueMs||''].join('|')}
const selectProductionTaskRepairBase=selectProductionTask;
selectProductionTask=function(state,session,rng=Math.random,now=Date.now()){
  const task=selectProductionTaskRepairBase(state,session,rng,now);if(!task)return task;
  session.productionSignatures=Array.isArray(session.productionSignatures)?session.productionSignatures:[];
  let chosen=task,sig=productionSignature(task);
  if(session.productionSignatures.includes(sig)){
    const alternatives=productionFamiliesFor(state,task.letter,now).filter(f=>f!==task.family);
    for(const f of alternatives){const alt=productionTask(state,task.letter,f,session,rng);const altSig=productionSignature(alt);if(!session.productionSignatures.includes(altSig)){chosen=alt;sig=altSig;break}}
  }
  chosen.productionSignature=sig;session.productionSignatures.push(sig);session.productionSignatures=session.productionSignatures.slice(-30);return chosen;
};

function hydrateProductionRepairs(state,session,rng=Math.random){
  if(session.productionRepairsHydrated)return session;session.productionRepairsHydrated=true;
  const existing=new Set((session.pendingRepairs||[]).map(r=>r.repairId));
  const open=Object.values(state.repairs||{}).filter(r=>r.open&&r.originSkill==='writtenProduction'&&!existing.has(r.repairId));
  for(const r of open){
    if(!ALPHABET.includes(r.originLetter))continue;
    const family=PRODUCTION_FAMILIES[r.repairTarget]?r.repairTarget:'visual-memory-writing';
    const origin=productionTask(state,r.originLetter,family,session,rng,{scheduledReason:'rehydrated-production-error'});
    const repair=productionRepairTask(state,origin,session,rng,{repairId:r.repairId,originAttemptId:r.originAttemptId||origin.questionId});
    session.pendingRepairs.push({repairId:r.repairId,task:repair,dueAfterMainIndex:session.mainIndex+3+Math.floor(rng()*5),gap:3,originQuestionId:origin.questionId,originAttemptId:r.originAttemptId||origin.questionId,originLetter:r.originLetter,originSkill:'writtenProduction',done:false,resolved:false,rehydrated:true});
  }
  return session;
}
const initProductionSessionRepairBase=initProductionSession;
initProductionSession=function(session,state=null,rng=Math.random){initProductionSessionRepairBase(session);session.productionSignatures=Array.isArray(session.productionSignatures)?session.productionSignatures:[];if(state)hydrateProductionRepairs(state,session,rng);return session};
