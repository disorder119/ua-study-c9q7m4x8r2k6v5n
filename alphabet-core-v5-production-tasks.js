'use strict';

function productionPrompt(c,family,rng=Math.random){
  const d=DATA[c];
  if(family==='sound-to-writing')return `Zeichne den ukrainischen Buchstaben für den Laut ${d.short}.`;
  if(family==='audio-to-writing')return 'Höre genau. Zeichne den Buchstaben aus dem Gedächtnis.';
  if(family==='confusion-writing'){
    const other=LETTER_PEDAGOGY[c]?.confusions?.[0];
    return `Zeichne den ukrainischen Buchstaben für ${d.short}.${other?` Nicht mit ${other} verwechseln.`:''}`;
  }
  if(family==='case-writing')return rng()>.5?'Zeichne die Kleinform des gezeigten Buchstabens.':'Zeichne die Großform des gezeigten Buchstabens.';
  return 'Merke dir die Form. Zeichne den Buchstaben danach aus dem Gedächtnis.';
}
function productionTask(state,c,family,session,rng=Math.random,meta={}){
  const d=DATA[c],difficulty=productionDifficulty(state,c),task={questionId:id('prodq'),sessionId:session?.sessionId||meta.sessionId||'',letter:c,skill:'writtenProduction',type:'writtenProduction',family,variant:family,promptFamily:family,promptId:`${family}-1`,prompt:productionPrompt(c,family,rng),difficulty,firstAttempt:!meta.isRepair,isRepair:!!meta.isRepair,repairLevel:Number(meta.repairLevel)||0,createdFromError:!!meta.createdFromError,scheduledReason:meta.scheduledReason||'production',evidenceWeight:0,countsForMastery:false,objectiveScored:false,interaction:'writtenProduction',correct:'SELF',options:[],referenceUpper:c,referenceLower:d.lower,requiresHumanLetterAudio:false,display:'',stimulusId:`${family}-${c}`};
  if(family==='visual-memory-writing'){task.display=c;task.cueMs=difficulty>=4?900:1500;task.stimulusId=`visual-memory-${c}-${task.cueMs}`}
  if(family==='case-writing'){
    const askLower=rng()>.5;task.display=askLower?c:d.lower;task.caseTarget=askLower?'lower':'upper';task.prompt=`Zeichne die ${askLower?'Kleinform':'Großform'} des gezeigten Buchstabens.`;task.stimulusId=`case-${c}-${task.caseTarget}`;
  }
  if(family==='audio-to-writing'){task.requiresHumanLetterAudio=true;task.audioStimulusId=`isolated-letter-${c}`;task.stimulusId=`audio-writing-${c}`;task.display=''}
  if(family==='confusion-writing'){task.confusionTarget=LETTER_PEDAGOGY[c]?.confusions?.[0]||'';task.stimulusId=`confusion-writing-${c}-${task.confusionTarget}`}
  return task;
}
function selectProductionLetter(state,session,rng=Math.random,now=Date.now()){
  const fixed=session?.fixedProductionLetters?.length?session.fixedProductionLetters:[];
  const pool=uniq([...fixed,...(session?.activeLearningSet||[]),...(session?.reviewSet||[]),...ALPHABET]).filter(c=>writtenProductionReady(state,c,now));
  if(!pool.length)return null;
  return pool.map(c=>({c,score:productionNeed(state,c,now,session)+rng()*5})).sort((a,b)=>b.score-a.score)[0]?.c||null;
}
function selectProductionTask(state,session,rng=Math.random,now=Date.now()){
  const c=selectProductionLetter(state,session,rng,now);if(!c)return null;
  const families=productionFamiliesFor(state,c,now);if(!families.length)return null;
  const recent=new Set((session.productionAnswers||[]).slice(-5).filter(x=>x.letter===c).map(x=>x.family)),history=state.productionHistory||[];
  const scored=families.map(f=>{let score=100;if(recent.has(f))score-=55;score-=history.filter(x=>x.letter===c&&x.family===f).slice(-8).length*5;if(f==='audio-to-writing'&&audioWrittenProductionReady(state,c,now))score+=12;if(f==='case-writing'&&skillMasteryV4(state,c,'caseRecognition',now)>90)score-=20;return {f,score:score+rng()*8}}).sort((a,b)=>b.score-a.score);
  return productionTask(state,c,scored[0].f,session,rng);
}
function productionQuotaForSession(state,session,now=Date.now()){
  if(session?.feedback==='real'||session?.preset==='diagnostic'||session?.certification)return 0;
  if(session?.productionOnly)return Math.max(0,Number(session.productionTargetCount)||0);
  const ready=ALPHABET.filter(c=>writtenProductionReady(state,c,now));if(!ready.length)return 0;
  const avg=ready.reduce((n,c)=>n+letterMasteryV4(state,c,now),0)/ready.length;
  let q=ready.length<3?1:ready.length<8?2:ready.length<16?3:avg>=88?5:4;
  if(session?.macro){const phase=macroPhase(session)?.id;q=phase==='warmup'?0:phase==='errors'?Math.min(1,q):phase==='active'?Math.min(2,q):phase==='mixed'?Math.min(3,q):q}
  return q;
}
function shouldInsertProduction(state,session,now=Date.now()){
  if((!session?.adaptive&&!session?.productionOnly)||session?.preset==='diagnostic')return false;
  const quota=productionQuotaForSession(state,session,now),done=(session.productionAnswers||[]).filter(x=>!x.isRepair).length;
  if(done>=quota)return false;if(session.productionCurrent)return true;if(session.productionOnly)return true;if(session.mainIndex<3)return false;
  const last=Number(session.lastProductionMainIndex??-99);if(session.mainIndex-last<3)return false;
  const remaining=Math.max(0,session.targetMainCount-session.mainIndex),need=quota-done;
  return remaining<=need*3||session.mainIndex%4===0;
}
function initProductionSession(session){
  session.productionAnswers=Array.isArray(session.productionAnswers)?session.productionAnswers:[];
  session.productionCurrent=session.productionCurrent||null;
  session.lastProductionMainIndex=Number.isFinite(session.lastProductionMainIndex)?session.lastProductionMainIndex:-99;
  session.lastProductionLetter=session.lastProductionLetter||'';
  session.productionTechnicalSkips=Array.isArray(session.productionTechnicalSkips)?session.productionTechnicalSkips:[];
  session.productionTargetCount=Number(session.productionTargetCount)||0;
  return session;
}
function createProductionTestSession(state,count=5){
  const eligible=ALPHABET.filter(c=>writtenProductionReady(state,c)),n=Math.max(1,Math.min(Number(count)||5,eligible.length||1));
  const s=createAdaptiveSession(state,{targetMainCount:0,title:`Produktionstest ${n}`,preset:`production-${n}`,scope:'production',feedback:'learning'});
  s.productionOnly=true;s.productionTargetCount=n;s.fixedProductionLetters=eligible.sort((a,b)=>ensureProductionLetter(state,a).independentAttempts-ensureProductionLetter(state,b).independentAttempts).slice(0,n);s.startSnapshot=snapshotMastery(state,eligible);
  return initProductionSession(s);
}
function productionTestAvailability(state){const ready=ALPHABET.filter(c=>writtenProductionReady(state,c)).length;return {ready,test5:ready>=5,test10:ready>=10,test20:ready>=20,full:ready>=28}}
