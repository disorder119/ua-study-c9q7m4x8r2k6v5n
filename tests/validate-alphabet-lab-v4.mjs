import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
process.env.TZ='Europe/Berlin';

const files=[
  'alphabet-core-v3-data.js','alphabet-core-v3-model.js','alphabet-core-v3-exam.js',
  'alphabet-wordbank-v4.js','alphabet-core-v4-model-a.js','alphabet-core-v4-model-b.js',
  'alphabet-core-v4-tasks-a.js','alphabet-core-v4-tasks-b.js','alphabet-core-v4-selector-a.js','alphabet-core-v4-selector-b.js',
  'alphabet-core-v4-hardening.js','alphabet-core-v4-export.js'
];
const src=files.map(f=>fs.readFileSync(new URL('../'+f,import.meta.url),'utf8')).join('\n');
const sandbox={console,Date,Math,globalThis:null};sandbox.globalThis=sandbox;vm.runInNewContext(src,sandbox);const C=sandbox.AlphabetCoreV2;
const NOW=new Date('2026-09-13T12:00:00+02:00').getTime();
const EXPECTED='А Б В Г Ґ Д Е Є Ж З И І Ї Й К Л М Н О П Р С Т У Ф Х Ц Ч Ш Щ Ь Ю Я'.split(' ');
const rngFor=seed=>{let x=(seed||1)>>>0;return()=>{x=(1664525*x+1013904223)>>>0;return x/4294967296}};

assert(C&&C.SCHEMA_VERSION===4&&C.VERSION===3,'V4 schema with V3 compatibility export expected');
assert.deepEqual([...C.ALPHABET],EXPECTED);assert.equal(new Set(C.ALPHABET).size,33);for(const c of ['ы','э','ё','ъ','Ы','Э','Ё','Ъ'])assert(!C.ALPHABET.includes(c));

// Wordbank: six validated contexts for every Ukrainian letter, no Russian-only signs.
assert.equal(C.WORD_BANK.length,198);assert.equal(new Set(C.WORD_BANK.map(w=>w.id)).size,198);
for(const c of C.ALPHABET){
  const words=C.WORD_BANK.filter(w=>w.letter===c);assert.equal(words.length,6,`${c}: exactly six contexts`);assert(C.LETTER_PEDAGOGY[c],`${c}: pedagogy missing`);
  for(const w of words){
    const chars=[...w.word.toLocaleLowerCase('uk')],target=C.DATA[c].lower;
    const actual=chars.map((x,i)=>x===target?i:-1).filter(i=>i>=0);
    assert(actual.length>0,`${w.id}: target absent`);assert.deepEqual([...w.targetIndexes],actual,`${w.id}: wrong targetIndexes`);
    assert(!/[ыэёъ]/iu.test(w.word),`${w.id}: Russian-exclusive character`);
    assert(Array.isArray(w.knownLettersRequired)&&w.knownLettersRequired.includes(c),`${w.id}: knownLettersRequired missing target`);
    assert(w.knownLettersRequired.every(x=>C.ALPHABET.includes(x)),`${w.id}: invalid required letter`);
  }
}
assert.equal(C.LETTER_PEDAGOGY.Ь.special,'soft-sign');assert(Object.keys(C.QUESTION_FAMILIES).length>=31);

function seedSkill(st,c,k,correct=10,total=10,{days=4,dueAt=NOW+30*C.DAY,latency=900}={}){
  const s=st.letters[c].skills[k];s.attempts=s.independentAttempts=total;s.correct=s.independentCorrect=correct;s.wrong=s.independentWrong=total-correct;
  s.evidenceWeightSum=total;s.evidenceCorrectSum=correct;s.confidenceEvidence=total;
  const good=Math.min(10,correct),bad=Math.min(10-good,total-correct);s.recentResults=[...Array.from({length:bad},()=>({good:false,independent:true,weight:1})),...Array.from({length:good},()=>({good:true,independent:true,weight:1}))].slice(-10);
  s.successDays=Array.from({length:Math.min(days,correct?days:0)},(_,i)=>`2026-09-${String(2+i*2).padStart(2,'0')}`);s.dueAt=dueAt;s.repairPending=false;s.repairTarget='';
  if(latency){s.timedAttempts=Math.min(4,total);s.totalValidLatencyMs=s.timedAttempts*latency}
}
function seedLetter(st,c,ratio=1){for(const k of C.CORE_SKILLS){const total=10,correct=Math.max(0,Math.min(total,Math.round(total*ratio)));seedSkill(st,c,k,correct,total,{days:correct>=8?4:correct>=5?2:1})}}
function markSecure(st,c){seedLetter(st,c,1);st.letters[c].writeDays=['2026-09-05'];}
function wrongChoice(t){if(t.options?.length)return t.options.find(x=>x!==t.correct)??'WRONG';if(t.interaction==='multiSelect')return '';return 'WRONG'}
function answerMain(st,sess,t,good=true,now=NOW){const selected=good?t.correct:wrongChoice(t),confused=!good&&C.ALPHABET.includes(selected)?selected:'';const row=C.recordAnswer(st,{attemptId:C.id('test'),questionId:t.questionId,sessionId:sess.sessionId,letter:t.letter,skill:t.skill,type:t.type,kind:t.type,task:t,family:t.family,evidenceWeight:t.evidenceWeight,firstAttempt:true,isRepair:false,selected,expected:t.correct,good,confusedWith:confused,latencyMs:900,latencyValid:true,now,source:sess.preset});const plus={...row,family:t.family,variant:t.variant,wordId:t.wordId,signature:C.questionSignature(t),difficulty:t.difficulty};C.applyMainAnswer(sess,plus,good?null:{letter:t.letter,skill:t.skill});return plus}
function generate(st,sess,n,rng,good=true){for(let i=0;i<n;i++){sess.mainIndex=i;const t=C.selectNextMainQuestion(st,sess,rng,NOW+i*1000);assert(t);sess.mainTasks[i]=t;answerMain(st,sess,t,good,NOW+i*1000)}return sess}

// Migration V1/V2/V3 -> V4 preserves evidence and adds V4 defaults.
for(const version of [1,2,3]){const raw={version,xp:71,letters:{Р:{seen:12,correct:9,wrong:3,writeDays:['2026-09-01'],confusions:{П:2},skills:version===3?{visualToSound:{attempts:5,independentAttempts:5,correct:4,wrong:1,independentCorrect:4,independentWrong:1,successDays:['2026-09-01']}}:undefined}}};const m=C.migrate(raw);assert.equal(m.version,4);assert.equal(m.xp,71);assert.equal(m.letters.Р.seen,12);assert(m.learningPlan&&m.repairs&&Array.isArray(m.sessionSnapshots));assert(m.letters.Р.exposure)}

// Active learning plan: secure A is review/control only; K/M/O remain active priorities.
{
  const st=C.freshState();st.learningPlan.introducedLetters=['А','І','К','М','О'];st.learningPlan.activeLetters=['А','І','К','М','О'];markSecure(st,'А');seedLetter(st,'І',.8);seedLetter(st,'К',.55);seedLetter(st,'М',.35);seedLetter(st,'О',.2);
  const p=C.recomputeLearningPlan(st,NOW,{force:true});for(const c of ['К','М','О'])assert(p.activeLetters.includes(c),`${c} should remain active`);assert(!p.activeLetters.includes('А'),'secure A should not consume active slot');assert(p.activeLetters.length>=4&&p.activeLetters.length<=8);
}

// Per-skill difficulty and need: strong visual/case must not hide weak audio/confusion.
{
  const st=C.freshState();st.learningPlan.introducedLetters=['А'];st.learningPlan.activeLetters=['А'];seedSkill(st,'А','visualToSound',10,10);seedSkill(st,'А','soundToLetter',9,10);seedSkill(st,'А','caseRecognition',10,10);seedSkill(st,'А','audioToLetter',2,8,{days:1});seedSkill(st,'А','confusionDiscrimination',4,8,{days:1});
  assert(C.difficultyFor(st,'А','visualToSound',NOW)>C.difficultyFor(st,'А','audioToLetter',NOW));
  assert(C.calculateLearningNeed(st,'А','audioToLetter',NOW)>C.calculateLearningNeed(st,'А','caseRecognition',NOW));
  assert(C.calculateLearningNeed(st,'А','confusionDiscrimination',NOW)>C.calculateLearningNeed(st,'А','caseRecognition',NOW));
  const sess=C.createFocusedSession(st,'А',{size:12}),rng=rngFor(91);const skills=[];for(let i=0;i<12;i++){sess.mainIndex=i;const t=C.selectNextMainQuestion(st,sess,rng,NOW+i);sess.mainTasks[i]=t;skills.push(t.skill)}
  assert(skills.filter(x=>x==='audioToLetter'||x==='confusionDiscrimination').length>skills.filter(x=>x==='caseRecognition').length,'weak skills should dominate focused selection');
}

// Real user bug: 20 focused A questions must remain diverse across 50 deterministic seeds.
for(let seed=1;seed<=50;seed++){
  const st=C.freshState();st.learningPlan.introducedLetters=['А'];st.learningPlan.activeLetters=['А'];seedSkill(st,'А','visualToSound',7,9,{days:2});seedSkill(st,'А','soundToLetter',6,9,{days:2});seedSkill(st,'А','caseRecognition',9,9,{days:3});seedSkill(st,'А','audioToLetter',4,8,{days:1});seedSkill(st,'А','confusionDiscrimination',5,8,{days:1});
  const sess=C.createFocusedSession(st,'А',{size:20});generate(st,sess,20,rngFor(seed),true);const q=C.sessionQualityMetrics(sess),tasks=sess.mainTasks;
  assert.equal(q.duplicateSignatureCount,0,`seed ${seed}: duplicate signature`);assert(q.uniqueFamilies>=10,`seed ${seed}: only ${q.uniqueFamilies} families`);assert(q.uniqueVariants>=10,`seed ${seed}: only ${q.uniqueVariants} variants`);
  const caseCount=tasks.filter(t=>['upper-to-lower','lower-to-upper','pair-match'].includes(t.family)).length;assert(caseCount<=3,`seed ${seed}: case spam ${caseCount}`);
  const wordCount=tasks.filter(t=>C.QUESTION_FAMILIES[t.family]?.usesWord).length;assert(wordCount>=3,`seed ${seed}: insufficient word transfer`);
  assert(tasks.some(t=>['visual-contrast','sound-contrast'].includes(t.family)),`seed ${seed}: contrast missing`);assert(tasks.some(t=>['memory-pair','flash-recognition'].includes(t.family)),`seed ${seed}: memory/speed missing`);assert(tasks.some(t=>C.QUESTION_FAMILIES[t.family]?.usesAudio),`seed ${seed}: audio missing`);
  const wordIds=tasks.filter(t=>t.wordId).map(t=>t.wordId);assert(new Set(wordIds.slice(0,Math.min(6,wordIds.length))).size===Math.min(6,wordIds.length),`seed ${seed}: word reused before alternatives`);
}

// Standard sessions: no monotonous runs or duplicate cognitive signatures over 100 seeds.
for(let seed=101;seed<=200;seed++){
  const st=C.freshState(),sess=C.createAdaptiveSession(st,{targetMainCount:20}),rng=rngFor(seed);generate(st,sess,20,rng,true);const q=C.sessionQualityMetrics(sess);
  assert.equal(q.duplicateSignatureCount,0,`standard seed ${seed}: duplicate signature`);assert(q.maxSameLetterRun<=2,`standard seed ${seed}: same-letter run ${q.maxSameLetterRun}`);assert(q.maxSameFamilyRun<=3,`standard seed ${seed}: same-family run ${q.maxSameFamilyRun}`);
}

// Current active set supplies the great majority of a normal session.
{
  const st=C.freshState();st.learningPlan.introducedLetters=['А','І','К','М','О'];st.learningPlan.activeLetters=['А','І','К','М','О'];const start=new Set(['А','І','К','М','О','Т']);const sess=C.createAdaptiveSession(st,{targetMainCount:20}),rng=rngFor(777);generate(st,sess,20,rng,true);const inField=sess.mainTasks.filter(t=>start.has(t.letter)).length;assert(inField>=15,`only ${inField}/20 from current learning field`);
}

// Overexposure is a real penalty; four recent A items must push selection elsewhere absent urgency.
{
  const st=C.freshState(),sess=C.createAdaptiveSession(st,{targetMainCount:20});sess.mainAnswers=[{letter:'А'},{letter:'І'},{letter:'А'},{letter:'К'},{letter:'А'},{letter:'М'},{letter:'А'},{letter:'А'}];assert(C.overexposurePenalty(sess,'А')>C.overexposurePenalty(sess,'О')+80);sess.mainIndex=8;const t=C.selectNextMainQuestion(st,sess,rngFor(4),NOW);assert.notEqual(t.letter,'А');
}

// Word novelty: an unused context wins while alternatives remain.
{
  const st=C.freshState(),sess=C.createFocusedSession(st,'А',{size:20}),rng=rngFor(44);const a=C.pickWord(st,'А',sess,rng);sess.usedWordIds.push(a.id);const b=C.pickWord(st,'А',sess,rng);assert.notEqual(a.id,b.id);
}

// Live adaptivity: same-session independent audio successes immediately reduce audio priority.
{
  const st=C.freshState();st.learningPlan.introducedLetters=['А'];st.learningPlan.activeLetters=['А'];seedSkill(st,'А','visualToSound',10,10);seedSkill(st,'А','soundToLetter',10,10);seedSkill(st,'А','caseRecognition',10,10);seedSkill(st,'А','confusionDiscrimination',8,10);seedSkill(st,'А','audioToLetter',2,8,{days:1});
  const sess=C.createFocusedSession(st,'А',{size:20}),beforeNeed=C.calculateLearningNeed(st,'А','audioToLetter',NOW,sess);
  const beforeAudioPicks=Array.from({length:40},(_,i)=>C.selectSkillV4(st,'А',sess,rngFor(800+i),NOW).skill).filter(k=>k==='audioToLetter').length;
  const rng=rngFor(808);
  for(let i=0;i<8;i++){const task=C.buildV4Task(st,'А','audioToLetter',2,'audio-to-letter',sess,rng,{scheduledReason:'live-test'});const row=C.recordAnswer(st,{attemptId:`audio-${i}`,questionId:task.questionId,sessionId:sess.sessionId,letter:'А',skill:'audioToLetter',type:'audio',kind:'audio',task,family:task.family,evidenceWeight:1,firstAttempt:true,isRepair:false,selected:'А',expected:'А',good:true,latencyMs:900,latencyValid:true,now:NOW+i*1000,source:'live-test'});C.applyMainAnswer(sess,{...row,family:task.family,signature:C.questionSignature(task)})}
  const afterNeed=C.calculateLearningNeed(st,'А','audioToLetter',NOW+9000,sess);const afterAudioPicks=Array.from({length:40},(_,i)=>C.selectSkillV4(st,'А',sess,rngFor(900+i),NOW+9000).skill).filter(k=>k==='audioToLetter').length;
  assert(afterNeed<beforeNeed-15,`audio need did not fall enough: ${beforeNeed} -> ${afterNeed}`);assert(beforeAudioPicks>afterAudioPicks,`audio selection did not fall: ${beforeAudioPicks} -> ${afterAudioPicks}`);
  sess.mainIndex=8;const next=C.selectNextMainQuestion(st,sess,rngFor(999),NOW+10000);assert(next&&next.skill!=='audioToLetter','after strong audio evidence the next task should shift to another current need');
}

// Secure letter is not an active blocker; a new letter starts at low difficulty.
{
  const st=C.freshState();markSecure(st,'К');st.learningPlan.introducedLetters=['А','І','К','М','О'];st.learningPlan.activeLetters=['А','І','К','М','О'];assert.equal(C.learningState(st,'К',NOW),'secure');assert(!C.recomputeLearningPlan(st,NOW,{force:true}).activeLetters.includes('К'));assert(C.difficultyFor(st,'Т','visualToSound',NOW)<=1);const fam=C.familyCandidates(st,'Т','visualToSound',0,null);assert(!fam.includes('flash-recognition')&&!fam.includes('pseudoword'));
}

// Repair IDs isolate simultaneous R visual/reverse failures.
{
  const st=C.freshState();const visual=C.buildV4Task(st,'Р','visualToSound',1,'visual-to-sound',C.createFocusedSession(st,'Р',{size:2}),rngFor(1));const reverse=C.buildV4Task(st,'Р','soundToLetter',1,'sound-to-letter',C.createFocusedSession(st,'Р',{size:2}),rngFor(2));
  const rv=C.recordAnswer(st,{attemptId:'rv',questionId:visual.questionId,letter:'Р',skill:'visualToSound',type:visual.type,task:visual,firstAttempt:true,isRepair:false,selected:'P',expected:visual.correct,good:false,latencyMs:700,now:NOW});
  const rr=C.recordAnswer(st,{attemptId:'rr',questionId:reverse.questionId,letter:'Р',skill:'soundToLetter',type:reverse.type,task:reverse,firstAttempt:true,isRepair:false,selected:'П',expected:reverse.correct,good:false,confusedWith:'П',latencyMs:700,now:NOW+1});
  assert(rv.repairId&&rr.repairId&&rv.repairId!==rr.repairId);assert.equal(C.openRepairIds(st,'Р','visualToSound').length,1);assert.equal(C.openRepairIds(st,'Р','soundToLetter').length,1);
  C.recordAnswer(st,{attemptId:'fix',questionId:'fix',letter:'Р',skill:'soundToLetter',type:'reverse',firstAttempt:false,isRepair:true,repairId:rv.repairId,selected:'Р',expected:'Р',good:true,latencyMs:600,now:NOW+1000});
  assert.equal(C.openRepairIds(st,'Р','visualToSound').length,0);assert.equal(C.openRepairIds(st,'Р','soundToLetter').length,1,'reverse repair must remain open');
}

// Latin trap only counts an actual P-like interpretation of Р.
{
  const st=C.freshState(),task=C.buildV4Task(st,'Р','visualToSound',1,'visual-to-sound',C.createFocusedSession(st,'Р',{size:2}),rngFor(5));
  C.recordAnswer(st,{attemptId:'latin1',questionId:'l1',letter:'Р',skill:'visualToSound',type:'visual',task,firstAttempt:true,isRepair:false,selected:'P',expected:task.correct,good:false,latencyMs:500,now:NOW});
  const afterP=st.letters.Р.trapStats.latinLookalike.wrong;C.recordAnswer(st,{attemptId:'latin2',questionId:'l2',letter:'Р',skill:'visualToSound',type:'visual',task,firstAttempt:true,isRepair:false,selected:C.DATA.О.sound,expected:task.correct,good:false,latencyMs:500,now:NOW+1});assert.equal(afterP,1);assert.equal(st.letters.Р.trapStats.latinLookalike.wrong,1);
}

// Audio failures are finite and certification failures are technical, never user errors.
{
  const st=C.freshState(),normal=C.createAdaptiveSession(st,{targetMainCount:1}),task=C.buildV4Task(st,'А','audioToLetter',1,'audio-to-letter',normal,rngFor(3));assert.equal(C.technicalAudioFailureDecision(normal,task).action,'retry');assert.equal(C.technicalAudioFailureDecision(normal,task).action,'fallback');
  const cert=C.createAdaptiveSession(st,{targetMainCount:1,preset:'mastery-audio',scope:'audio-certification',feedback:'real'});cert.certification='audio';assert.equal(C.technicalAudioFailureDecision(cert,task).action,'retry');assert.equal(C.technicalAudioFailureDecision(cert,task).action,'skip-incomplete');assert(cert.audioIncompleteLetters.includes('А'));
  st.masteryChecks.audio=[{date:'2026-09-13',accuracy:1,total:33,humanAudioOnly:true,coverageLetters:[...C.ALPHABET],technicalIncomplete:true}];assert.equal(C.mastered(st,NOW).audio,false);
}

// Ь never becomes an ordinary isolated-sound task.
{
  const st=C.freshState(),sess=C.createFocusedSession(st,'Ь',{size:20}),rng=rngFor(33);for(let i=0;i<20;i++){sess.mainIndex=i;const t=C.selectNextMainQuestion(st,sess,rng,NOW+i);sess.mainTasks[i]=t;assert(!['visual-to-sound','sound-to-letter','audio-to-letter','latin-trap','reverse-fake-friend'].includes(t.family),`soft sign invalid family ${t.family}`);assert(t.wordId||['visual-contrast','odd-one-out','error-correction','same-different','pair-match','memory-pair','writing-recall','flash-recognition'].includes(t.family));answerMain(st,sess,t,true,NOW+i)}
}

// Easy recognition cannot farm full mastery.
{
  const st=C.freshState(),sess=C.createFocusedSession(st,'А',{size:30}),rng=rngFor(98);for(let i=0;i<30;i++){const t=C.buildV4Task(st,'А','visualToSound',1,'visual-find',sess,rng);C.recordAnswer(st,{attemptId:`farm-${i}`,questionId:t.questionId,letter:'А',skill:'visualToSound',type:t.type,task:t,family:t.family,evidenceWeight:t.evidenceWeight,firstAttempt:true,isRepair:false,selected:t.correct,expected:t.correct,good:true,latencyMs:500,now:NOW+i})}assert(C.letterMastery(st,'А',NOW+100)<50);assert(!C.letterReady(st,'А',NOW+100));
}

console.log('Alphabet Lab V4 adaptive/diversity tests: OK');
