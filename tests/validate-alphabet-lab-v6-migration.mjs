import assert from 'node:assert/strict';
import {loadV5,loadV61,primeLetter,NOW} from './alphabet-v5-test-utils.mjs';
const C=loadV61();

function caseRun(name,fn){try{fn();console.log(`PASS ${name}`)}catch(e){console.error(`FAIL ${name}: ${e.message}`);throw e}}

caseRun('V1 representative progress migrates without inventing timing evidence',()=>{
  const raw={version:1,createdAt:NOW-10*C.DAY,lastStudy:'2026-09-10',studyDays:['2026-09-08','2026-09-10'],streak:2,xp:42,letters:{А:{seen:5,correct:4,wrong:1,lastAt:NOW-1000,lastWrongAt:NOW-2000,writeDays:['2026-09-09'],confusions:{О:2}}},answerLog:[],examHistory:[],masteryChecks:{final:[],fake:[],audio:[],retention:[]},bookmarks:[]};
  const m=C.migrate(JSON.parse(JSON.stringify(raw)));assert.equal(m.version,6);assert.equal(m.xp,42);assert(m.studyDays.includes('2026-09-08'));assert(m.letters.А.writeDays.includes('2026-09-09'));assert.equal(m.letters.А.confusions.О,2);for(const k of C.CORE_SKILLS)assert.equal(m.letters.А.skills[k].timedAttempts,0,'migration must not invent timing evidence')
});

caseRun('V5 production and recognition survive V6.1 migration',()=>{
  const V5=loadV5(),raw=V5.freshState();primeLetter(V5,raw,'Р');raw.xp=777;raw.learningPlan={introducedLetters:['А','Р'],activeLetters:['Р'],lastUnlockMainCount:12,lastIntroducedLetter:'Р',lastUnlockedAt:NOW};raw.letters.Р.exposure.variantCounts={'visual-to-sound':9};raw.letters.Р.skills.writtenProduction.independentAttempts=4;raw.letters.Р.skills.writtenProduction.successfulSelfChecks=3;raw.letters.Р.skills.writtenProduction.confidenceEvidence=3;raw.productionHistory=[{at:NOW,letter:'Р',family:'visual-memory-writing',rating:'pass',isRepair:false}];raw.repairs={r1:{repairId:'r1',originLetter:'Р',originSkill:'soundToLetter',open:true,createdAt:NOW}};
  const m=C.migrate(JSON.parse(JSON.stringify(raw)));assert.equal(m.xp,777);assert(m.learningPlan.introducedLetters.includes('Р'));assert.equal(m.letters.Р.exposure.variantCounts['visual-to-sound'],9);assert.equal(m.letters.Р.skills.writtenProduction.independentAttempts,4);assert.equal(m.productionHistory.length,1);assert.equal(m.repairs.r1.open,true);assert.equal(m.letters.Р.learningAggregate.openSevereRepairCount,1)
});

caseRun('existing V6 durable aggregates never shrink in V6.1',()=>{
  const raw=C.freshState();primeLetter(C,raw,'А');raw=C.migrate(raw);raw.metrics.independentMainCount=2345;raw.metrics.aggregateReady=true;raw.metrics.aggregateSchemaVersion=1;raw.letters.А.learningAggregate.independentMainAttempts=400;raw.learningPlan.lastUnlockMainCount=2200;raw.answerLog=raw.answerLog.slice(-2);raw.metrics.productionCoverage.visualMemory={А:8,Р:2};raw.productionHistory=[{at:NOW,letter:'А',family:'visual-memory-writing',rating:'pass',isRepair:false}];
  const m=C.migrate(JSON.parse(JSON.stringify(raw)));assert.equal(m.metrics.independentMainCount,2345);assert(m.metrics.productionCoverage.visualMemory.Р>=2);assert(m.learningPlan.lastUnlockMainCount>=2200);assert(m.letters.А.learningAggregate.independentMainAttempts>=400)
});

caseRun('Europe/Berlin local day boundaries and DST are stable',()=>{
  const before=process.env.TZ;process.env.TZ='Europe/Berlin';try{
    assert.equal(C.localDateKey(Date.parse('2026-09-14T21:59:00Z')),'2026-09-14');assert.equal(C.localDateKey(Date.parse('2026-09-14T22:01:00Z')),'2026-09-15');
    assert.equal(C.localDateKey(Date.parse('2026-03-29T00:59:00Z')),'2026-03-29');assert.equal(C.localDateKey(Date.parse('2026-03-29T01:01:00Z')),'2026-03-29');
    assert.equal(C.localDateKey(Date.parse('2026-10-25T00:30:00Z')),'2026-10-25');assert.equal(C.localDateKey(Date.parse('2026-10-25T01:30:00Z')),'2026-10-25');assert.equal(C.daysBetween('2026-03-29','2026-03-30'),1)
  }finally{if(before==null)delete process.env.TZ;else process.env.TZ=before}
});

console.log('Alphabet Lab V6.1 migration/local-day regressions: OK');
