'use strict';

const V6_VERSION=6;
const V6_APP_VERSION='6.1.0';
const V6_AGGREGATE_SCHEMA_VERSION=2;
const V6_SEVERE_REPAIR_SKILLS=new Set(['soundToLetter','audioToLetter','confusionDiscrimination']);
const V6_OBJECTIVE_SKILLS=SKILLS.filter(k=>k!=='writing');
const V6_PRODUCTION_COVERAGE_KEYS={
  'visual-memory-writing':'visualMemory','sound-to-writing':'soundToWriting','audio-to-writing':'audioToWriting','case-writing':'caseWriting','confusion-writing':'confusionWriting'
};
function freshV6Coverage(){return {visualMemory:{},soundToWriting:{},audioToWriting:{},caseWriting:{},confusionWriting:{}}}
function freshV6LetterAggregate(){return {independentMainAttempts:0,correctIndependentAttempts:0,lastIndependentAt:0,successfulFamilies:{},coreIndependentAttempts:0,openRepairCount:0,openSevereRepairCount:0,productionFamilyExposure:{}}}
function freshV6Metrics(){return {aggregateSchemaVersion:V6_AGGREGATE_SCHEMA_VERSION,aggregateReady:false,independentMainCount:0,revision:0,productionRevision:0,readinessRevision:-1,readyProductionLetters:[],productionCoverage:freshV6Coverage(),productionPassCoverage:freshV6Coverage()}}
function positive(n){n=Number(n)||0;return Number.isFinite(n)?Math.max(0,n):0}
function mergeCountMap(a={},b={}){const out={...(a||{})};for(const [k,v] of Object.entries(b||{}))out[k]=Math.max(positive(out[k]),positive(v));return out}
function mergeCoverage(a={},b={}){const out=freshV6Coverage();for(const key of Object.keys(out))out[key]=mergeCountMap(a?.[key],b?.[key]);return out}
function normalizeLetterAggregate(raw={}){const a={...freshV6LetterAggregate(),...(raw||{})};for(const k of ['independentMainAttempts','correctIndependentAttempts','lastIndependentAt','coreIndependentAttempts','openRepairCount','openSevereRepairCount'])a[k]=positive(a[k]);a.successfulFamilies=mergeCountMap({},a.successfulFamilies);a.productionFamilyExposure=mergeCountMap({},a.productionFamilyExposure);return a}
function normalizeExamHistoryNewest(rows,limit=80){
  if(!Array.isArray(rows))return [];
  const tagged=rows.map((row,index)=>({row,index,ts:positive(row?.at||row?.finishedAt||row?.completedAt)||(row?.date?Date.parse(`${row.date}T12:00:00`):0)||0}));
  if(tagged.some(x=>x.ts>0))tagged.sort((a,b)=>b.ts-a.ts||b.index-a.index);
  return tagged.slice(0,Math.max(0,limit)).map(x=>x.row);
}
function durableObjectiveFromSkills(state,c){
  const m=state.letters[c],skills=V6_OBJECTIVE_SKILLS.filter(k=>m.skills?.[k]);
  return {
    attempts:skills.reduce((n,k)=>n+positive(m.skills[k].independentAttempts),0),
    correct:skills.reduce((n,k)=>n+positive(m.skills[k].independentCorrect),0),
    core:CORE_SKILLS.reduce((n,k)=>n+positive(m.skills?.[k]?.independentAttempts),0),
    last:skills.reduce((n,k)=>Math.max(n,positive(m.skills[k].lastIndependentAt)),0)
  };
}
function deriveV6Metrics(state){
  const metrics=freshV6Metrics(),letters={};for(const c of ALPHABET)letters[c]=freshV6LetterAggregate();
  for(const c of ALPHABET){const d=durableObjectiveFromSkills(state,c),a=letters[c];a.independentMainAttempts=d.attempts;a.correctIndependentAttempts=d.correct;a.coreIndependentAttempts=d.core;a.lastIndependentAt=d.last;metrics.independentMainCount+=d.attempts}
  let logMain=0;
  for(const row of state.answerLog||[]){if(!row?.letter||!ALPHABET.includes(row.letter)||row.isRepair||row.firstAttempt===false)continue;logMain++;const a=letters[row.letter];a.lastIndependentAt=Math.max(a.lastIndependentAt,positive(row.answeredAt||row.at));if(row.correct)a.successfulFamilies[row.family||row.type||'unknown']=(a.successfulFamilies[row.family||row.type||'unknown']||0)+1}
  metrics.independentMainCount=Math.max(metrics.independentMainCount,logMain);
  for(const row of state.productionHistory||[]){if(!row?.letter||!ALPHABET.includes(row.letter))continue;const a=letters[row.letter];a.productionFamilyExposure[row.family]=(a.productionFamilyExposure[row.family]||0)+1;if(row.isRepair)continue;const key=V6_PRODUCTION_COVERAGE_KEYS[row.family];if(key){metrics.productionCoverage[key][row.letter]=(metrics.productionCoverage[key][row.letter]||0)+1;if(row.rating==='pass')metrics.productionPassCoverage[key][row.letter]=(metrics.productionPassCoverage[key][row.letter]||0)+1}}
  return {metrics,letters};
}
function mergeDerivedV6Metrics(state){
  const derived=deriveV6Metrics(state),persisted={...freshV6Metrics(),...(state.metrics||{})};
  persisted.independentMainCount=Math.max(positive(persisted.independentMainCount),positive(derived.metrics.independentMainCount),positive(state.learningPlan?.lastUnlockMainCount));
  persisted.productionCoverage=mergeCoverage(persisted.productionCoverage,derived.metrics.productionCoverage);
  persisted.productionPassCoverage=mergeCoverage(persisted.productionPassCoverage,derived.metrics.productionPassCoverage);
  persisted.aggregateSchemaVersion=V6_AGGREGATE_SCHEMA_VERSION;persisted.aggregateReady=true;persisted.revision=positive(persisted.revision);persisted.productionRevision=positive(persisted.productionRevision);persisted.readinessRevision=-1;persisted.readyProductionLetters=[];state.metrics=persisted;
  for(const c of ALPHABET){const old=normalizeLetterAggregate(state.letters[c].learningAggregate),d=derived.letters[c];state.letters[c].learningAggregate={...old,independentMainAttempts:Math.max(old.independentMainAttempts,d.independentMainAttempts),correctIndependentAttempts:Math.max(old.correctIndependentAttempts,d.correctIndependentAttempts),lastIndependentAt:Math.max(old.lastIndependentAt,d.lastIndependentAt),coreIndependentAttempts:Math.max(old.coreIndependentAttempts,d.coreIndependentAttempts),successfulFamilies:mergeCountMap(old.successfulFamilies,d.successfulFamilies),productionFamilyExposure:mergeCountMap(old.productionFamilyExposure,d.productionFamilyExposure)}}
  syncRepairAggregates(state);return state.metrics;
}
function ensureV6Metrics(state,{rebuild=false}={}){
  state.metrics={...freshV6Metrics(),...(state.metrics||{})};state.metrics.productionCoverage=mergeCoverage({},state.metrics.productionCoverage);state.metrics.productionPassCoverage=mergeCoverage({},state.metrics.productionPassCoverage);
  for(const c of ALPHABET)state.letters[c].learningAggregate=normalizeLetterAggregate(state.letters[c].learningAggregate);
  if(rebuild||!state.metrics.aggregateReady||state.metrics.aggregateSchemaVersion!==V6_AGGREGATE_SCHEMA_VERSION)mergeDerivedV6Metrics(state);else syncRepairAggregates(state);
  return state.metrics;
}
function rebuildV6Metrics(state){return mergeDerivedV6Metrics(state)}
function syncRepairAggregates(state,letter=null){
  if(!state?.letters)return state?.metrics;state.metrics={...freshV6Metrics(),...(state.metrics||{})};const letters=letter?[letter]:ALPHABET;let changed=false;
  for(const c of letters){if(!ALPHABET.includes(c))continue;const a=state.letters[c].learningAggregate=normalizeLetterAggregate(state.letters[c].learningAggregate);let open=0,severe=0;for(const r of Object.values(state.repairs||{})){if(!r?.open||r.originLetter!==c)continue;open++;if(V6_SEVERE_REPAIR_SKILLS.has(r.originSkill))severe++}
    if(a.openRepairCount!==open||a.openSevereRepairCount!==severe)changed=true;a.openRepairCount=open;a.openSevereRepairCount=severe;
    for(const k of [...CORE_SKILLS,'writtenProduction'])if(state.letters[c].skills?.[k])syncRepairPending(state,c,k);
  }
  if(changed){state.metrics.revision=positive(state.metrics.revision)+1;state.metrics.readinessRevision=-1;state.metrics.readyProductionLetters=[]}return state.metrics;
}
function restoreV6Extensions(raw,state){
  if(!raw||typeof raw!=='object')return state;
  for(const c of ALPHABET){const src=raw.letters?.[c],dst=state.letters[c];if(!src||!dst)continue;
    if(src.exposure&&typeof src.exposure==='object'){dst.exposure={...dst.exposure,...src.exposure,recentSignatures:Array.isArray(src.exposure.recentSignatures)?src.exposure.recentSignatures.slice(-50):dst.exposure.recentSignatures,lastVariants:Array.isArray(src.exposure.lastVariants)?src.exposure.lastVariants.slice(-20):dst.exposure.lastVariants,variantCounts:{...(dst.exposure.variantCounts||{}),...(src.exposure.variantCounts||{})},promptFamilyCounts:{...(dst.exposure.promptFamilyCounts||{}),...(src.exposure.promptFamilyCounts||{})},wordStats:{...(dst.exposure.wordStats||{}),...(src.exposure.wordStats||{})},fontStats:{...(dst.exposure.fontStats||{}),...(src.exposure.fontStats||{})}}}
    if(src.skills?.writtenProduction)dst.skills.writtenProduction=normalizeProductionSkill(src.skills.writtenProduction);
    if(Array.isArray(src.productionHistory))dst.productionHistory=src.productionHistory.slice(-40);
    if(src.learningAggregate)dst.learningAggregate=normalizeLetterAggregate(src.learningAggregate);
  }
  if(raw.metrics&&typeof raw.metrics==='object')state.metrics=JSON.parse(JSON.stringify(raw.metrics));
  if(Array.isArray(raw.productionHistory))state.productionHistory=raw.productionHistory.slice(-180);
  if(Array.isArray(raw.examHistory))state.examHistory=normalizeExamHistoryNewest(raw.examHistory,80);
  return state;
}
function ensureV6State(state,{rebuild=false}={}){ensureV5State(state);state.version=V6_VERSION;state.answerLog=Array.isArray(state.answerLog)?state.answerLog.slice(-1200):[];state.productionHistory=Array.isArray(state.productionHistory)?state.productionHistory.slice(-180):[];state.examHistory=normalizeExamHistoryNewest(state.examHistory,80);ensureV6Metrics(state,{rebuild});return state}
function freshStateV6(){return ensureV6State(freshStateV5(),{rebuild:true})}
function migrateV6(raw){const state=migrateV5(raw);restoreV6Extensions(raw,state);ensureV6State(state,{rebuild:true});const count=state.metrics.independentMainCount;if(!Number.isFinite(state.learningPlan.lastUnlockMainCount)||state.learningPlan.lastUnlockMainCount<0)state.learningPlan.lastUnlockMainCount=count;state.metrics.independentMainCount=Math.max(state.metrics.independentMainCount,positive(state.learningPlan.lastUnlockMainCount));return state}

const registerRepairV6Base=registerRepair;
registerRepair=function(state,opts={}){const r=registerRepairV6Base(state,opts);syncRepairAggregates(state,r?.originLetter||opts.originLetter||null);return r};
function noteV6ObjectiveAnswer(state,row){ensureV6Metrics(state);if(!row||row.isRepair||row.firstAttempt===false||!ALPHABET.includes(row.letter)){syncRepairAggregates(state,row?.originLetter||row?.letter||null);return row}const a=state.letters[row.letter].learningAggregate;a.independentMainAttempts++;a.correctIndependentAttempts+=row.correct?1:0;a.lastIndependentAt=Math.max(a.lastIndependentAt,positive(row.answeredAt||row.at)||Date.now());if(CORE_SKILLS.includes(row.skill))a.coreIndependentAttempts++;if(row.correct)a.successfulFamilies[row.family||row.type||'unknown']=(a.successfulFamilies[row.family||row.type||'unknown']||0)+1;state.metrics.independentMainCount++;state.metrics.revision++;state.metrics.readinessRevision=-1;syncRepairAggregates(state,row.letter);return row}
function recordAnswerV6(state,opts={}){ensureV6State(state);const row=recordAnswerV4(state,opts);return noteV6ObjectiveAnswer(state,row)}
function recordProductionSelfCheckV6(state,opts={}){ensureV6State(state);const row=recordProductionSelfCheck(state,opts),a=state.letters[row.letter].learningAggregate;a.productionFamilyExposure[row.family]=(a.productionFamilyExposure[row.family]||0)+1;if(!row.isRepair){const key=V6_PRODUCTION_COVERAGE_KEYS[row.family];if(key){state.metrics.productionCoverage[key][row.letter]=(state.metrics.productionCoverage[key][row.letter]||0)+1;if(row.rating==='pass')state.metrics.productionPassCoverage[key][row.letter]=(state.metrics.productionPassCoverage[key][row.letter]||0)+1}}state.metrics.productionRevision++;state.metrics.revision++;state.metrics.readinessRevision=-1;syncRepairAggregates(state,row.letter);return row}

const writtenProductionReadyV6Base=writtenProductionReady;
writtenProductionReady=function(state,c,now=Date.now()){
  ensureV6Metrics(state);if(!ALPHABET.includes(c))return false;const m=state.letters[c],a=m.learningAggregate,visual=skillMasteryV4(state,c,'visualToSound',now),reverse=skillMasteryV4(state,c,'soundToLetter',now),audio=skillMasteryV4(state,c,'audioToLetter',now),families=Object.keys(a.successfulFamilies).length,hasWriting=(m.writeDays||[]).length>0,days=retentionDaysForLetter(state,c).length,conf=(skillConfidence(state,c,'visualToSound')+skillConfidence(state,c,'soundToLetter')+skillConfidence(state,c,'audioToLetter'))/3,severe=a.openSevereRepairCount>0;
  if(c==='Ь')return visual>=72&&reverse>=62&&a.coreIndependentAttempts>=7&&families>=2&&hasWriting&&!severe&&(days>=2||conf>=72);
  const base=visual>=70&&reverse>=65&&audio>=60&&a.coreIndependentAttempts>=5&&families>=2&&hasWriting&&!severe;if(!base)return false;return HARD.has(c)?(days>=2||conf>=72):true
};
function readyProductionLettersUncachedV6(state,now=Date.now()){ensureV6Metrics(state);return ALPHABET.filter(c=>writtenProductionReady(state,c,now))}
function readyProductionLettersV6(state,now=Date.now()){
  ensureV6Metrics(state);if(state.metrics.readinessRevision===state.metrics.revision&&Array.isArray(state.metrics.readyProductionLetters))return state.metrics.readyProductionLetters;
  const ready=readyProductionLettersUncachedV6(state,now);state.metrics.readyProductionLetters=ready;state.metrics.readinessRevision=state.metrics.revision;return ready
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
function productionCoverageSummaryV6(state){ensureV6Metrics(state);const byFamily={},confirmedByFamily={};for(const [key,map] of Object.entries(state.metrics.productionCoverage))byFamily[key]=Object.keys(map||{}).length;for(const [key,map] of Object.entries(state.metrics.productionPassCoverage))confirmedByFamily[key]=Object.keys(map||{}).length;return {byFamily,confirmedByFamily,totalLetters:uniq(Object.values(state.metrics.productionCoverage).flatMap(map=>Object.keys(map||{}))).length,confirmedLetters:uniq(Object.values(state.metrics.productionPassCoverage).flatMap(map=>Object.keys(map||{}))).length}}
function validateStateInvariants(state){const errors=[];if(!state||typeof state!=='object')return {ok:false,errors:['state missing']};for(const c of ALPHABET){const m=state.letters?.[c];if(!m){errors.push(`missing letter ${c}`);continue}const a=normalizeLetterAggregate(m.learningAggregate);for(const [k,v] of Object.entries(a))if(typeof v==='number'&&(!Number.isFinite(v)||v<0))errors.push(`${c}.${k} invalid`)}if((state.answerLog||[]).length>1200)errors.push('answerLog too large');if((state.productionHistory||[]).length>180)errors.push('productionHistory too large');if((state.examHistory||[]).length>80)errors.push('examHistory too large');if((state.sessionSnapshots||[]).length>30)errors.push('sessionSnapshots too large');for(const c of state.learningPlan?.activeLetters||[])if(!ALPHABET.includes(c))errors.push(`unknown active letter ${c}`);const actual=readyProductionLettersUncachedV6(state);const cached=readyProductionLettersV6(state);if(actual.join('')!==cached.join(''))errors.push('readyProductionLetters cache mismatch');try{JSON.stringify(state)}catch(_){errors.push('state not serializable')}return {ok:errors.length===0,errors}}
