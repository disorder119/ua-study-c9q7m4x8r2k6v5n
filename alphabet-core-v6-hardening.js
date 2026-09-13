'use strict';

const V6_VERSION=6;
const V6_APP_VERSION='6.0.0';
const V6_PRODUCTION_COVERAGE_KEYS={
  'visual-memory-writing':'visualMemory','sound-to-writing':'soundToWriting','audio-to-writing':'audioToWriting','case-writing':'caseWriting','confusion-writing':'confusionWriting'
};
function freshV6LetterAggregate(){return {independentMainAttempts:0,correctIndependentAttempts:0,lastIndependentAt:0,successfulFamilies:{},coreIndependentAttempts:0,openRepairCount:0,openSevereRepairCount:0,productionFamilyExposure:{}}}
function freshV6Metrics(){return {independentMainCount:0,revision:0,productionRevision:0,readinessRevision:-1,readyProductionLetters:[],productionCoverage:{visualMemory:{},soundToWriting:{},audioToWriting:{},caseWriting:{},confusionWriting:{}}}}
function ensureV6Metrics(state,{rebuild=false}={}){
  state.metrics={...freshV6Metrics(),...(state.metrics||{})};
  state.metrics.productionCoverage={...freshV6Metrics().productionCoverage,...(state.metrics.productionCoverage||{})};
  for(const c of ALPHABET){const m=state.letters[c];m.learningAggregate={...freshV6LetterAggregate(),...(m.learningAggregate||{})};m.learningAggregate.successfulFamilies={...(m.learningAggregate.successfulFamilies||{})};m.learningAggregate.productionFamilyExposure={...(m.learningAggregate.productionFamilyExposure||{})}}
  if(rebuild||!state.metrics.aggregateReady)rebuildV6Metrics(state);
  return state.metrics;
}
function rebuildV6Metrics(state){
  state.metrics={...freshV6Metrics(),...(state.metrics||{})};const metrics=state.metrics;metrics.independentMainCount=0;metrics.productionCoverage=freshV6Metrics().productionCoverage;
  for(const c of ALPHABET)state.letters[c].learningAggregate=freshV6LetterAggregate();
  for(const row of state.answerLog||[]){if(!row?.letter||!ALPHABET.includes(row.letter)||row.isRepair||row.firstAttempt===false)continue;const a=state.letters[row.letter].learningAggregate;metrics.independentMainCount++;a.independentMainAttempts++;a.correctIndependentAttempts+=row.correct?1:0;a.lastIndependentAt=Math.max(a.lastIndependentAt,Number(row.answeredAt||row.at)||0);if(CORE_SKILLS.includes(row.skill))a.coreIndependentAttempts++;if(row.correct)a.successfulFamilies[row.family||row.type||'unknown']=(a.successfulFamilies[row.family||row.type||'unknown']||0)+1}
  for(const r of Object.values(state.repairs||{})){if(!r?.open||!ALPHABET.includes(r.originLetter))continue;const a=state.letters[r.originLetter].learningAggregate;a.openRepairCount++;if(['soundToLetter','audioToLetter','confusionDiscrimination'].includes(r.originSkill))a.openSevereRepairCount++}
  for(const row of state.productionHistory||[]){if(!row?.letter||!ALPHABET.includes(row.letter))continue;const a=state.letters[row.letter].learningAggregate;a.productionFamilyExposure[row.family]=(a.productionFamilyExposure[row.family]||0)+1;if(row.isRepair)continue;const key=V6_PRODUCTION_COVERAGE_KEYS[row.family];if(key)metrics.productionCoverage[key][row.letter]=(metrics.productionCoverage[key][row.letter]||0)+1}
  metrics.aggregateReady=true;metrics.revision=Number(metrics.revision)||0;metrics.productionRevision=Number(metrics.productionRevision)||0;metrics.readinessRevision=-1;metrics.readyProductionLetters=[];return metrics
}
function ensureV6State(state,{rebuild=false}={}){ensureV5State(state);state.version=V6_VERSION;ensureV6Metrics(state,{rebuild});state.answerLog=Array.isArray(state.answerLog)?state.answerLog.slice(-1200):[];state.productionHistory=Array.isArray(state.productionHistory)?state.productionHistory.slice(-180):[];state.examHistory=Array.isArray(state.examHistory)?state.examHistory.slice(-80):[];return state}
function freshStateV6(){return ensureV6State(freshStateV5(),{rebuild:true})}
function migrateV6(raw){const state=ensureV6State(migrateV5(raw),{rebuild:true});const count=state.metrics.independentMainCount;if(!Number.isFinite(state.learningPlan.lastUnlockMainCount)||state.learningPlan.lastUnlockMainCount<0)state.learningPlan.lastUnlockMainCount=count;return state}

function noteV6ObjectiveAnswer(state,row){ensureV6Metrics(state);if(!row||row.isRepair||row.firstAttempt===false||!ALPHABET.includes(row.letter))return row;const a=state.letters[row.letter].learningAggregate;a.independentMainAttempts++;a.correctIndependentAttempts+=row.correct?1:0;a.lastIndependentAt=Math.max(a.lastIndependentAt,Number(row.answeredAt||row.at)||Date.now());if(CORE_SKILLS.includes(row.skill))a.coreIndependentAttempts++;if(row.correct)a.successfulFamilies[row.family||row.type||'unknown']=(a.successfulFamilies[row.family||row.type||'unknown']||0)+1;state.metrics.independentMainCount++;state.metrics.revision++;state.metrics.readinessRevision=-1;return row}
function recordAnswerV6(state,opts={}){ensureV6State(state);const row=recordAnswerV4(state,opts);return noteV6ObjectiveAnswer(state,row)}
function recordProductionSelfCheckV6(state,opts={}){ensureV6State(state);const row=recordProductionSelfCheck(state,opts),a=state.letters[row.letter].learningAggregate;a.productionFamilyExposure[row.family]=(a.productionFamilyExposure[row.family]||0)+1;if(!row.isRepair){const key=V6_PRODUCTION_COVERAGE_KEYS[row.family];if(key)state.metrics.productionCoverage[key][row.letter]=(state.metrics.productionCoverage[key][row.letter]||0)+1}state.metrics.productionRevision++;state.metrics.revision++;state.metrics.readinessRevision=-1;return row}

const writtenProductionReadyV6Base=writtenProductionReady;
writtenProductionReady=function(state,c,now=Date.now()){
  ensureV6Metrics(state);if(!ALPHABET.includes(c))return false;const m=state.letters[c],a=m.learningAggregate,visual=skillMasteryV4(state,c,'visualToSound',now),reverse=skillMasteryV4(state,c,'soundToLetter',now),audio=skillMasteryV4(state,c,'audioToLetter',now),families=Object.keys(a.successfulFamilies).length,hasWriting=(m.writeDays||[]).length>0,days=retentionDaysForLetter(state,c).length,conf=(skillConfidence(state,c,'visualToSound')+skillConfidence(state,c,'soundToLetter')+skillConfidence(state,c,'audioToLetter'))/3,severe=a.openSevereRepairCount>0;
  if(c==='Ь')return visual>=72&&reverse>=62&&a.coreIndependentAttempts>=7&&families>=2&&hasWriting&&!severe&&(days>=2||conf>=72);
  const base=visual>=70&&reverse>=65&&audio>=60&&a.coreIndependentAttempts>=5&&families>=2&&hasWriting&&!severe;if(!base)return false;return HARD.has(c)?(days>=2||conf>=72):true
};
function readyProductionLettersV6(state,now=Date.now()){
  ensureV6Metrics(state);if(state.metrics.readinessRevision===state.metrics.revision&&Array.isArray(state.metrics.readyProductionLetters))return state.metrics.readyProductionLetters;
  const ready=ALPHABET.filter(c=>writtenProductionReady(state,c,now));state.metrics.readyProductionLetters=ready;state.metrics.readinessRevision=state.metrics.revision;return ready
}
productionQuotaForSession=function(state,session,now=Date.now()){
  if(session?.feedback==='real'||session?.preset==='diagnostic'||session?.certification)return 0;if(session?.productionOnly)return Math.max(0,Number(session.productionTargetCount)||0);
  const ready=readyProductionLettersV6(state,now);if(!ready.length)return 0;const avg=ready.reduce((n,c)=>n+letterMasteryV4(state,c,now),0)/ready.length;let q=ready.length<3?1:ready.length<8?2:ready.length<16?3:avg>=88?5:4;if(session?.macro){const phase=macroPhase(session)?.id;q=phase==='warmup'?0:phase==='errors'?Math.min(1,q):phase==='active'?Math.min(2,q):phase==='mixed'?Math.min(3,q):q}return q
};
const selectProductionTaskV6Base=selectProductionTask;
selectProductionTask=function(state,session,rng=Math.random,now=Date.now()){
  ensureV6Metrics(state);const t=selectProductionTaskV6Base(state,session,rng,now);if(!t)return t;const ready=readyProductionLettersV6(state,now),recent=new Set((session.productionAnswers||[]).slice(-4).map(x=>`${x.letter}|${x.family}`));let best=t,bestScore=Infinity;
  for(const c of ready){if(session.lastProductionLetter===c)continue;for(const family of productionFamiliesFor(state,c,now)){const sig=`${c}|${family}`,a=state.letters[c].learningAggregate,n=a.productionFamilyExposure[family]||0,score=n+(recent.has(sig)?20:0)+(V6_PRODUCTION_COVERAGE_KEYS[family]?(state.metrics.productionCoverage[V6_PRODUCTION_COVERAGE_KEYS[family]][c]||0)*2:0);if(score<bestScore){bestScore=score;best=productionTask(state,c,family,session,rng)}}}return best
};

const recomputeLearningPlanV6Base=recomputeLearningPlan;
recomputeLearningPlan=function(state,now=Date.now(),opts={}){
  ensureV6Metrics(state);const before=[...(state.learningPlan?.introducedLetters||[])],lastCount=Number(state.learningPlan?.lastUnlockMainCount)||0,lastLetter=state.learningPlan?.lastIntroducedLetter||before.at(-1)||'',lastAttempts=lastLetter&&state.letters[lastLetter]?state.letters[lastLetter].learningAggregate.independentMainAttempts:0,high=before.length?before.slice(-5).filter(c=>basicReadiness(state,c,now).avg>=78).length>=4:false,allow=state.metrics.independentMainCount-lastCount>=5&&(lastAttempts>=2||high),plan=recomputeLearningPlanV6Base(state,now,opts),added=plan.introducedLetters.filter(c=>!before.includes(c));
  if(added.length&&!allow&&before.length>=5){plan.introducedLetters=before;plan.activeLetters=plan.activeLetters.filter(c=>before.includes(c));for(const c of before){if(plan.activeLetters.length>=5)break;if(!plan.activeLetters.includes(c)&&!letterReadyV4(state,c,now))plan.activeLetters.push(c)}}else if(added.length){plan.lastUnlockMainCount=state.metrics.independentMainCount;plan.lastIntroducedLetter=added[0]}return plan
};
function productionCoverageSummaryV6(state){ensureV6Metrics(state);const byFamily={};for(const [key,map] of Object.entries(state.metrics.productionCoverage))byFamily[key]=Object.keys(map||{}).length;return {byFamily,totalLetters:uniq(Object.values(state.metrics.productionCoverage).flatMap(map=>Object.keys(map||{}))).length}}
