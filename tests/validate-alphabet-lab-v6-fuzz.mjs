import assert from 'node:assert/strict';
import {loadV61,NOW,rngFor,primeLetter} from './alphabet-v5-test-utils.mjs';

const C=loadV61(),rng=rngFor(610061);assert.equal(C.VERSION,6);assert.equal(C.APP_VERSION,'6.1.0');assert.equal(typeof C.validateStateInvariants,'function');
let state=C.freshState(),previousMain=0,previousCoverage=0,now=NOW;
for(const c of C.ALPHABET.slice(0,6))primeLetter(C,state,c,{ratio:.85});state=C.migrate(state);
function check(label){const inv=C.validateStateInvariants(state);assert(inv.ok,`${label}: ${inv.errors.join(', ')}`);assert(state.metrics.independentMainCount>=previousMain,`${label}: main aggregate regressed`);previousMain=state.metrics.independentMainCount;const cov=C.productionCoverageSummary(state).totalLetters;assert(cov>=previousCoverage,`${label}: production coverage regressed`);previousCoverage=cov;assert(state.answerLog.length<=1200);assert(state.productionHistory.length<=180);assert(state.examHistory.length<=80);assert.doesNotThrow(()=>JSON.stringify(state));const cached=C.readyProductionLettersV6(state,now),uncached=C.readyProductionLettersUncachedV6(state,now);assert.deepEqual([...cached],[...uncached],`${label}: readiness cache mismatch`)}
for(let i=0;i<2500;i++){
  now+=60000;const introduced=state.learningPlan.introducedLetters?.length?state.learningPlan.introducedLetters:C.ALPHABET.slice(0,5),letter=introduced[Math.floor(rng()*introduced.length)]||'А',skill=C.CORE_SKILLS[Math.floor(rng()*C.CORE_SKILLS.length)],good=rng()>.18;
  const session=C.createAdaptiveSession(state,{targetMainCount:1,title:'fuzz',preset:'fuzz',scope:'standard',feedback:'learning',fixedLetters:[letter]});const task=C.selectNextMainQuestion(state,session,rng,now)||C.buildV4Task(state,letter,skill,Math.min(3,C.difficultyFor(state,letter,skill,now)),'visual-to-sound',session,rng,{scheduledReason:'fuzz'});
  const row=C.recordAnswer(state,{letter:task.letter,skill:task.skill,type:task.type,kind:task.type,task,family:task.family,good,selected:good?task.correct:'?',expected:task.correct,firstAttempt:true,isRepair:false,questionId:task.questionId,sessionId:session.sessionId,now,latencyMs:900,latencyValid:true});
  if(!good&&row.repairId){const repair=state.repairs[row.repairId];if(repair&&rng()>.35)C.recordAnswer(state,{letter:repair.originLetter,skill:repair.originSkill,type:'contrast',family:'visual-contrast',good:true,selected:'ok',expected:'ok',firstAttempt:false,isRepair:true,repairId:repair.repairId,originLetter:repair.originLetter,originSkill:repair.originSkill,now:now+1,latencyValid:false})}
  if(i%11===0&&C.writtenProductionReady(state,letter,now)){const families=C.productionFamiliesFor(state,letter,now);if(families.length)C.recordProductionSelfCheck(state,{letter,family:families[Math.floor(rng()*families.length)],rating:rng()>.22?'pass':rng()>.5?'unsure':'again',now:now+2,audioSource:'human'})}
  if(i%17===0)C.recordWriting(state,letter,now+3);
  C.recomputeLearningPlan(state,now,{force:true});
  if(i%50===0){state=C.migrate(JSON.parse(JSON.stringify(state)));check(`reload-${i}`)}
}
check('final');
for(const c of state.learningPlan.activeLetters||[])assert(C.ALPHABET.includes(c));
for(const [id,r] of Object.entries(state.repairs||{})){if(!r?.open)continue;const skill=state.letters[r.originLetter]?.skills?.[r.originSkill];assert(skill?.repairPending,`open repair ${id} must match repairPending`)}
console.log('Alphabet Lab V6.1 deterministic fuzz/invariants: OK',JSON.stringify({main:state.metrics.independentMainCount,coverage:C.productionCoverageSummary(state).totalLetters,repairs:Object.values(state.repairs||{}).filter(r=>r.open).length}));
