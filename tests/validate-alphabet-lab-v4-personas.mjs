import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
const files=['alphabet-core-v3-data.js','alphabet-core-v3-model.js','alphabet-core-v3-exam.js','alphabet-wordbank-v4.js','alphabet-core-v4-model-a.js','alphabet-core-v4-model-b.js','alphabet-core-v4-tasks-a.js','alphabet-core-v4-tasks-b.js','alphabet-core-v4-selector-a.js','alphabet-core-v4-selector-b.js','alphabet-core-v4-hardening.js','alphabet-core-v4-export.js'];
const src=files.map(f=>fs.readFileSync(new URL('../'+f,import.meta.url),'utf8')).join('\n'),sb={console,Date,Math,globalThis:null};sb.globalThis=sb;vm.runInNewContext(src,sb);const C=sb.AlphabetCoreV2,NOW=Date.UTC(2026,8,13,12);
const rngFor=seed=>{let x=seed>>>0;return()=>{x=(1103515245*x+12345)>>>0;return x/4294967296}};
function seedSkill(st,c,k,good,total=10){const s=st.letters[c].skills[k];s.attempts=s.independentAttempts=total;s.correct=s.independentCorrect=good;s.wrong=s.independentWrong=total-good;s.evidenceWeightSum=total;s.evidenceCorrectSum=good;s.confidenceEvidence=total;s.recentResults=[...Array.from({length:Math.max(0,total-good)},()=>({good:false,independent:true,weight:1})),...Array.from({length:good},()=>({good:true,independent:true,weight:1}))].slice(-10);s.successDays=good>=8?['2026-09-02','2026-09-05','2026-09-08','2026-09-11']:good>=5?['2026-09-05','2026-09-10']:['2026-09-10'];s.dueAt=NOW+C.DAY}
function seedLetter(st,c,good){for(const k of C.CORE_SKILLS)seedSkill(st,c,k,good);if(good>=9)st.letters[c].writeDays=['2026-09-06']}
function wrong(t){return t.options?.find(x=>x!==t.correct)??'WRONG'}
function answer(st,sess,t,good,now){const selected=good?t.correct:wrong(t),row=C.recordAnswer(st,{attemptId:C.id('persona'),questionId:t.questionId,sessionId:sess.sessionId,letter:t.letter,skill:t.skill,type:t.type,kind:t.type,task:t,family:t.family,evidenceWeight:t.evidenceWeight,firstAttempt:true,isRepair:false,selected,expected:t.correct,good,confusedWith:!good&&C.ALPHABET.includes(selected)?selected:'',latencyMs:good?900:1800,latencyValid:true,now,source:sess.preset});const plus={...row,family:t.family,variant:t.variant,signature:C.questionSignature(t),difficulty:t.difficulty};C.applyMainAnswer(sess,plus,good?null:{letter:t.letter,skill:t.skill});if(!good&&sess.feedback==='learning')C.scheduleRepairForSession(sess,t,st,row.attemptId,rngFor(Number(String(now).slice(-6))||1));return plus}
function run(st,sess,n,rng,goodFn){for(let i=0;i<n;i++){sess.mainIndex=i;const t=C.selectNextMainQuestion(st,sess,rng,NOW+i*1000);sess.mainTasks[i]=t;answer(st,sess,t,goodFn(i,t),NOW+i*1000)}return sess}

// Session 1: almost zero knowledge, many errors, small active field, repairs without score inflation.
{
  const st=C.freshState(),sess=C.createAdaptiveSession(st,{targetMainCount:20,title:'Joel Session 1',feedback:'learning'});run(st,sess,20,rngFor(11),i=>i%3===0);const score=C.sessionScore(sess);assert.equal(score.total,20);assert(score.correct<=8);assert(sess.pendingRepairs.length>=8);assert(sess.activeLearningSet.length>=4&&sess.activeLearningSet.length<=8);assert(score.repairsTotal===0,'scheduled repairs are separate from main score until answered');assert(new Set(sess.mainTasks.map(t=>t.letter)).size<=8,'beginner should not be flooded with all 33');
}

// Session 2: A/M strong, I medium, K weak -> K/I get more attention than A/M.
{
  // Adaptive Fokussierung ist ein statistischer Effekt. Ein einzelner Seed ist
  // eine Münze (auch vor V6.2 verlor ein Sechstel der Seeds); geprüft wird
  // deshalb der Mittelwert und die Mehrheit über viele Seeds.
  let weakTotal=0,strongTotal=0,weakWins=0;const SEEDS=24;
  for(let seed=0;seed<SEEDS;seed++){
    const st=C.freshState();st.learningPlan.introducedLetters=['А','І','К','М','О'];st.learningPlan.activeLetters=['А','І','К','М','О'];seedLetter(st,'А',10);seedLetter(st,'М',10);seedLetter(st,'І',7);seedLetter(st,'К',3);seedLetter(st,'О',5);
    const sess=C.createAdaptiveSession(st,{targetMainCount:24}),rng=rngFor(22+seed*101);run(st,sess,24,rng,()=>true);
    const counts=Object.fromEntries(C.ALPHABET.map(c=>[c,sess.mainTasks.filter(t=>t.letter===c).length]));
    const weak=counts.К+counts.І,strong=counts.А+counts.М;weakTotal+=weak;strongTotal+=strong;if(weak>strong)weakWins++;
  }
  assert(weakTotal/SEEDS>strongTotal/SEEDS+1,`expected K/I focus on average, got K/I ${(weakTotal/SEEDS).toFixed(2)} vs A/M ${(strongTotal/SEEDS).toFixed(2)}`);
  assert(weakWins>=SEEDS*0.6,`K/I must dominate in most seeds, got ${weakWins}/${SEEDS}`);
}

// Session 3: R/P fake-friend pattern is detected and followed by variable R training.
{
  const st=C.freshState(),base=C.createFocusedSession(st,'Р',{size:3}),rng=rngFor(33);for(let i=0;i<3;i++){const t=C.buildV4Task(st,'Р','visualToSound',1,'latin-trap',base,rng);C.recordAnswer(st,{attemptId:`p-${i}`,questionId:t.questionId,letter:'Р',skill:'visualToSound',type:t.type,task:t,family:t.family,firstAttempt:true,isRepair:false,selected:'P',expected:t.correct,good:false,latencyMs:900,now:NOW+i})}assert.equal(st.letters.Р.trapStats.latinLookalike.wrong,3);const sess=C.createFocusedSession(st,'Р',{size:20});run(st,sess,20,rngFor(34),()=>true);const q=C.sessionQualityMetrics(sess);assert.equal(q.duplicateSignatureCount,0);assert(q.uniqueFamilies>=8);assert(sess.mainTasks.some(t=>['latin-trap','reverse-fake-friend','visual-contrast','sound-contrast'].includes(t.family)));
}

// Session 4: Ш/Щ battle mixes modalities rather than repeating a binary question.
{
  const st=C.freshState();seedLetter(st,'Ш',7);seedLetter(st,'Щ',7);st.letters.Ш.confusions.Щ=8;st.letters.Щ.confusions.Ш=7;const sess=C.createBattleSession(st,['Ш','Щ'],{size:20});run(st,sess,20,rngFor(44),()=>true);const q=C.sessionQualityMetrics(sess),families=new Set(sess.mainTasks.map(t=>t.family));assert.equal(q.duplicateSignatureCount,0);assert(q.uniqueFamilies>=6);assert([...families].some(f=>f.includes('contrast')));assert([...families].some(f=>C.QUESTION_FAMILIES[f]?.usesAudio));assert([...families].some(f=>C.QUESTION_FAMILIES[f]?.usesWord));assert([...families].some(f=>['flash-recognition','memory-pair'].includes(f)));
}
console.log('Alphabet Lab V4 Joel persona simulations: OK');
