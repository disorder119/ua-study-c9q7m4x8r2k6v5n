import assert from 'node:assert/strict';
import {loadV6,NOW,primeLetter,rngFor} from './alphabet-v5-test-utils.mjs';

const C=loadV6();
assert.equal(C.VERSION,6,'hardening tests must load the V6 engine');
assert.equal(C.APP_VERSION,'6.1.0','hardening tests must load the V6.1 engine');
assert.equal(C.AGGREGATE_SCHEMA_VERSION,2,'aggregate schema must be explicit');

function caseRun(name,fn){try{fn();console.log(`PASS ${name}`)}catch(err){console.error(`FAIL ${name}: ${err.message}`);throw err}}
function readyFixture(letter='Р'){let st=C.freshState();primeLetter(C,st,letter);st.learningPlan.introducedLetters=[letter];st.learningPlan.activeLetters=[letter];st=C.migrate(JSON.parse(JSON.stringify(st)));assert.equal(C.writtenProductionReady(st,letter,NOW),true,'fixture must start production-ready');return st}

caseRun('v6 aggregates survive bounded-log reload',()=>{
  const st=C.freshState();
  for(let i=0;i<1500;i++){const c=C.ALPHABET[i%C.ALPHABET.length];C.recordAnswer(st,{letter:c,skill:'visualToSound',kind:'visual',family:'visual-to-sound',good:true,selected:C.DATA[c].sound,expected:C.DATA[c].sound,firstAttempt:true,isRepair:false,latencyMs:800,now:NOW+i})}
  assert.equal(st.metrics.independentMainCount,1500);assert.equal(st.answerLog.length,1200,'diagnostic log is intentionally bounded');
  const reloaded=C.migrate(JSON.parse(JSON.stringify(st)));assert.equal(reloaded.metrics.independentMainCount,1500,'durable aggregate must not shrink to bounded history');
  C.recordAnswer(reloaded,{letter:'А',skill:'visualToSound',kind:'visual',family:'visual-to-sound',good:true,selected:C.DATA.А.sound,expected:C.DATA.А.sound,firstAttempt:true,isRepair:false,latencyMs:700,now:NOW+2000});assert.equal(reloaded.metrics.independentMainCount,1501,'new independent answer must increment aggregate exactly once');
  const twice=C.migrate(JSON.parse(JSON.stringify(reloaded)));assert.equal(twice.metrics.independentMainCount,1501,'second reload must not regress aggregate');
});

caseRun('independentMainCount never regresses after reload',()=>{
  const st=C.freshState();st.metrics.independentMainCount=2000;st.metrics.aggregateReady=true;st.learningPlan.lastUnlockMainCount=1400;
  st.answerLog=Array.from({length:1200},(_,i)=>({letter:'А',skill:'visualToSound',type:'visual',family:'visual-to-sound',correct:true,firstAttempt:true,isRepair:false,answeredAt:NOW+i}));
  const m=C.migrate(JSON.parse(JSON.stringify(st)));assert.equal(m.metrics.independentMainCount,2000);
});

caseRun('production coverage survives productionHistory truncation',()=>{
  const st=C.freshState();for(const c of C.ALPHABET){primeLetter(C,st,c);C.recordProductionSelfCheck(st,{letter:c,family:'visual-memory-writing',rating:'pass',now:NOW+C.ALPHABET.indexOf(c)})}
  for(let i=0;i<300;i++)C.recordProductionSelfCheck(st,{letter:'А',family:i%2?'sound-to-writing':'visual-memory-writing',rating:'pass',now:NOW+1000+i});
  assert.equal(C.productionCoverageSummary(st).totalLetters,33);assert(st.productionHistory.length<=180);const m=C.migrate(JSON.parse(JSON.stringify(st)));assert.equal(C.productionCoverageSummary(m).totalLetters,33,'long-term coverage must survive bounded production history');assert.equal(C.productionCoverageSummary(m).confirmedLetters,33,'confirmed pass coverage must survive too');
});

caseRun('unlock counter cannot stall because aggregate count dropped',()=>{
  const st=C.freshState();st.metrics.independentMainCount=1500;st.metrics.aggregateReady=true;st.learningPlan.lastUnlockMainCount=1498;st.answerLog=Array.from({length:1200},(_,i)=>({letter:'А',skill:'visualToSound',type:'visual',family:'visual-to-sound',correct:true,firstAttempt:true,isRepair:false,answeredAt:NOW+i}));const m=C.migrate(JSON.parse(JSON.stringify(st)));assert(m.metrics.independentMainCount>=m.learningPlan.lastUnlockMainCount,'reload must not move cumulative main count behind unlock watermark');
});

caseRun('new severe repair invalidates production readiness immediately',()=>{
  const st=readyFixture('Р'),sess=C.createFocusedSession(st,'Р',{size:20});sess.mainIndex=0;const task=C.buildV4Task(st,'Р','soundToLetter',2,'sound-to-letter',sess,rngFor(41),{scheduledReason:'repair-regression'});const row=C.recordAnswer(st,{letter:'Р',skill:'soundToLetter',kind:task.type,task,family:task.family,good:false,selected:'П',expected:task.correct,confusedWith:'П',firstAttempt:true,isRepair:false,questionId:task.questionId,sessionId:sess.sessionId,now:NOW+10});C.scheduleRepairForSession(sess,task,st,row.attemptId,rngFor(42));assert.equal(C.writtenProductionReady(st,'Р',NOW+11),false,'open severe repair must block production without reload');assert(!C.readyProductionLetters(st,NOW+11).includes('Р'));
});

caseRun('resolved severe repair invalidates readiness cache immediately',()=>{
  const st=readyFixture('Р'),sess=C.createFocusedSession(st,'Р',{size:20});sess.mainIndex=0;const task=C.buildV4Task(st,'Р','soundToLetter',2,'sound-to-letter',sess,rngFor(51));const bad=C.recordAnswer(st,{letter:'Р',skill:'soundToLetter',kind:task.type,task,family:task.family,good:false,selected:'П',expected:task.correct,confusedWith:'П',firstAttempt:true,isRepair:false,questionId:task.questionId,sessionId:sess.sessionId,now:NOW+20});C.scheduleRepairForSession(sess,task,st,bad.attemptId,rngFor(52));assert.equal(C.writtenProductionReady(st,'Р',NOW+21),false);sess.mainIndex=10;const pending=C.dueRepairForSession(sess);assert(pending,'repair fixture must become due');const rt=pending.task;const good=C.recordAnswer(st,{letter:'Р',skill:rt.skill,kind:rt.type,task:rt,family:rt.family,good:true,selected:rt.correct,expected:rt.correct,firstAttempt:false,isRepair:true,repairId:pending.repairId,originAttemptId:pending.originAttemptId,originLetter:pending.originLetter,originSkill:pending.originSkill,questionId:rt.questionId,sessionId:sess.sessionId,now:NOW+30});C.applyRepairAnswer(sess,good,pending);assert.equal(C.writtenProductionReady(st,'Р',NOW+31),true,'resolved severe repair must unblock cached readiness without reload');assert(C.readyProductionLetters(st,NOW+31).includes('Р'));
});

caseRun('cached readyProductionLetters equals uncached calculation',()=>{
  const st=readyFixture('Р');for(let i=0;i<250;i++){if(i%5===0){const rid=`repair-${i}`;C.registerRepair(st,{repairId:rid,originAttemptId:`a-${i}`,originLetter:'Р',originSkill:'audioToLetter',now:NOW+i});assert.deepEqual(C.readyProductionLetters(st,NOW+i),C.readyProductionLettersUncached(st,NOW+i));C.recordAnswer(st,{letter:'Р',skill:'audioToLetter',kind:'audio',family:'audio-to-letter',good:true,selected:'Р',expected:'Р',firstAttempt:false,isRepair:true,repairId:rid,now:NOW+i+1})}else C.recordAnswer(st,{letter:'Р',skill:'visualToSound',kind:'visual',family:'visual-to-sound',good:true,selected:C.DATA.Р.sound,expected:C.DATA.Р.sound,firstAttempt:true,isRepair:false,now:NOW+i});assert.deepEqual(C.readyProductionLetters(st,NOW+i+2),C.readyProductionLettersUncached(st,NOW+i+2))}
});

caseRun('migration keeps newest exam history entries',()=>{
  const chronological=Array.from({length:100},(_,i)=>({id:i+1,at:NOW+i*1000,date:`2026-09-${String(1+Math.floor(i/10)).padStart(2,'0')}`}));const raw=C.freshState();raw.examHistory=chronological;const m=C.migrate(JSON.parse(JSON.stringify(raw)));assert.equal(m.examHistory.length,80);const ids=m.examHistory.map(x=>x.id);assert(ids.includes(100)&&ids.includes(21),'newest 80 entries must survive migration');assert(!ids.includes(1),'oldest entries must be discarded');assert(ids.indexOf(100)<ids.indexOf(21),'canonical exam history is newest-first');
});

caseRun('V6 reload preserves V4/V5/V6 per-letter extensions',()=>{
  const raw=C.freshState(),c='Щ';raw.letters[c].exposure.variantCounts['word-position']=17;raw.letters[c].skills.writtenProduction.independentAttempts=9;raw.letters[c].skills.writtenProduction.successfulSelfChecks=7;raw.letters[c].productionHistory=[{letter:c,family:'visual-memory-writing',rating:'pass',at:NOW}];raw.letters[c].learningAggregate.independentMainAttempts=321;raw.letters[c].learningAggregate.successfulFamilies={'audio-to-letter':12};const m=C.migrate(JSON.parse(JSON.stringify(raw)));assert.equal(m.letters[c].exposure.variantCounts['word-position'],17);assert.equal(m.letters[c].skills.writtenProduction.independentAttempts,9);assert.equal(m.letters[c].skills.writtenProduction.successfulSelfChecks,7);assert.equal(m.letters[c].productionHistory.length,1);assert(m.letters[c].learningAggregate.independentMainAttempts>=321);assert.equal(m.letters[c].learningAggregate.successfulFamilies['audio-to-letter'],12);
});

caseRun('state invariants hold after hardening migrations',()=>{const st=C.migrate(JSON.parse(JSON.stringify(readyFixture('Р'))));const report=C.validateStateInvariants(st);assert.equal(report.ok,true,report.errors.join('; '))});

console.log('Alphabet Lab V6.1 hardening regressions: OK');
