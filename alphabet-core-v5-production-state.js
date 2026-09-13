'use strict';

function scheduleProductionSkill(s,rating,now){
  if(rating==='again'){s.intervalIndex=Math.max(0,s.intervalIndex-1);s.dueAt=now+2*MIN;s.ease=Math.max(1.7,s.ease-.15);return}
  s.intervalIndex=rating==='pass'?Math.min(8,s.intervalIndex+1):Math.max(1,s.intervalIndex);
  const base=rating==='pass'?[10*MIN,30*MIN,6*HOUR,DAY,3*DAY,7*DAY,14*DAY,30*DAY,60*DAY][s.intervalIndex]:30*MIN;
  s.dueAt=now+base;s.ease=clamp(s.ease+(rating==='pass'?.05:-.04),1.7,2.7);
}
function recordProductionSelfCheck(state,{letter,family,rating='unsure',now=Date.now(),isRepair=false,repairId='',sessionId='',questionId='',audioSource='',strokeCount=0,durationMs=0,bounds=null}={}){
  if(!ALPHABET.includes(letter))throw new Error('Unknown production letter '+letter);
  if(!['pass','unsure','again'].includes(rating))throw new Error('Unknown production rating '+rating);
  const s=ensureProductionLetter(state,letter),day=localDateKey(now);touchStudy(state,now);s.attempts++;s.lastSeenAt=now;s.lastFamily=family;s.lastRating=rating;if(family==='audio-to-writing')s.lastAudioWritingAt=now;
  if(isRepair){
    s.repairAttempts++;rating==='pass'?s.repairSuccessful++:rating==='unsure'?s.repairUncertain++:s.repairFailed++;
    if(repairId&&state.repairs?.[repairId]){const r=state.repairs[repairId];r.lastRepairAt=now;r.open=rating!=='pass'}
    s.repairPending=openRepairIds(state,letter,'writtenProduction').length>0;s.dueAt=now+(rating==='pass'?30*MIN:2*MIN);
  }else{
    s.independentAttempts++;s.confidenceEvidence+=rating==='pass'?1:rating==='unsure'?.35:.15;
    if(rating==='pass'){s.successfulSelfChecks++;if(!s.successDays.includes(day))s.successDays.push(day)}else if(rating==='unsure')s.uncertainSelfChecks++;else{s.unsuccessfulSelfChecks++;s.lastWrongAt=now}
    s.recentResults.push({rating,at:now,repair:false,family});s.recentResults=s.recentResults.slice(-16);scheduleProductionSkill(s,rating,now);
    if(rating==='again'){
      const rid=repairId||id('prodrepair');state.repairs[rid]={repairId:rid,originAttemptId:questionId||id('proda'),originLetter:letter,originSkill:'writtenProduction',repairTarget:family,open:true,createdAt:now,lastRepairAt:0};s.repairPending=true;s.repairTarget=family;repairId=rid;
    }
  }
  const row={at:now,date:day,letter,family,rating,isRepair,repairId,sessionId,questionId,audioSource:audioSource||'',strokeCount:Number(strokeCount)||0,durationMs:Number(durationMs)||0,bounds:bounds&&typeof bounds==='object'?{w:Number(bounds.w)||0,h:Number(bounds.h)||0}:null};
  state.productionHistory.push(row);state.productionHistory=state.productionHistory.slice(-180);state.letters[letter].productionHistory.push(row);state.letters[letter].productionHistory=state.letters[letter].productionHistory.slice(-40);return row;
}
function productionRepairTask(state,originTask,session,rng=Math.random,meta={}){
  const c=originTask.letter,choices=productionFamiliesFor(state,c).filter(f=>f!==originTask.family);let family=choices.find(f=>f==='visual-memory-writing')||choices[0]||originTask.family;
  if(originTask.family==='audio-to-writing'&&choices.includes('sound-to-writing'))family='sound-to-writing';
  const t=productionTask(state,c,family,session,rng,{isRepair:true,repairLevel:(originTask.repairLevel||0)+1,createdFromError:true,scheduledReason:'production-repair'});
  return {...t,isRepair:true,firstAttempt:false,repairId:meta.repairId||'',originAttemptId:meta.originAttemptId||'',originLetter:c,originSkill:'writtenProduction',originalQuestionId:originTask.originalQuestionId||originTask.questionId,parentAttemptId:meta.originAttemptId||''};
}
function scheduleProductionRepairForSession(session,task,state,repairId,rng=Math.random){
  const gap=3+Math.floor(rng()*5),repair=productionRepairTask(state,task,session,rng,{repairId,originAttemptId:task.questionId});
  const row={repairId,task,dueAfterMainIndex:session.mainIndex+gap+1,gap,originQuestionId:task.questionId,originAttemptId:task.questionId,originLetter:task.letter,originSkill:'writtenProduction',done:false,resolved:false};session.pendingRepairs.push(row);return row;
}
function productionSummary(session){const rows=session?.productionAnswers||[],main=rows.filter(x=>!x.isRepair),rep=rows.filter(x=>x.isRepair);return {total:main.length,pass:main.filter(x=>x.rating==='pass').length,unsure:main.filter(x=>x.rating==='unsure').length,again:main.filter(x=>x.rating==='again').length,repairTotal:rep.length,repairPass:rep.filter(x=>x.rating==='pass').length}}
function productionGate(state,now=Date.now()){
  const stable=ALPHABET.filter(c=>productionMastery(state,c,now)>=60&&productionConfidence(state,c)>=45&&ensureProductionLetter(state,c).independentAttempts>=2);
  const audio=uniq((state.productionHistory||[]).filter(x=>!x.isRepair&&x.family==='audio-to-writing'&&x.rating==='pass'&&x.audioSource==='human').map(x=>x.letter));
  const fake=FAKE_FRIENDS.filter(c=>ensureProductionLetter(state,c).successfulSelfChecks>0),open=Object.values(state.repairs||{}).filter(r=>r.open&&r.originSkill==='writtenProduction');
  return {done:stable.length>=18&&audio.length>=8&&fake.length>=4&&!open.length,stableLetters:stable.length,audioLetters:audio.length,fakeFriends:fake.length,openRepairs:open.length};
}
const masteredV5Base=masteredV4;
function masteredV5(state,now=Date.now()){const base=masteredV5Base(state,now),production=productionGate(state,now);return {...base,production,done:base.done&&production.done}}
const summaryForLetterV5Base=summaryForLetterV4;
function summaryForLetterV5(state,c,now=Date.now()){
  const base=summaryForLetterV5Base(state,c,now),s=ensureProductionLetter(state,c),stage=productionStage(state,c,now),history=(state.productionHistory||[]).filter(x=>x.letter===c&&!x.isRepair),lastError=[...history].reverse().find(x=>x.rating==='again'),lastAudio=[...history].reverse().find(x=>x.family==='audio-to-writing');
  return {...base,production:{mastery:productionMastery(state,c,now),confidence:productionConfidence(state,c),stage,status:productionStatusLabel(stage),ready:writtenProductionReady(state,c,now),audioReady:audioWrittenProductionReady(state,c,now),attempts:s.independentAttempts,pass:s.successfulSelfChecks,unsure:s.uncertainSelfChecks,again:s.unsuccessfulSelfChecks,lastErrorAt:lastError?.at||0,lastAudioAt:lastAudio?.at||0,next:!writtenProductionReady(state,c,now)?'Grundlagen weiter festigen':audioWrittenProductionReady(state,c,now)&&productionMastery(state,c,now)<60?'Audio → Zeichen zeichnen':productionMastery(state,c,now)<70?'Aus Erinnerung schreiben':'Retention + Mischproduktion'}};
}
