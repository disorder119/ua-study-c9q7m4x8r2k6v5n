'use strict';
const alphabetLabApi={version:C.SCHEMA_VERSION||C.VERSION,state:()=>structuredClone(S),export:()=>JSON.stringify(S,null,2),reset(){if(confirm('Alphabet-Lernstand wirklich löschen?')){[STORAGE,typeof LEGACY3!=='undefined'?LEGACY3:null,LEGACY2,LEGACY1].filter(Boolean).forEach(k=>localStorage.removeItem(k));S=C.freshState();persist();screen='home';render()}},startExam,startMyTraining};
if(typeof DEBUG_LEARNING!=='undefined'&&DEBUG_LEARNING){
  alphabetLabApi.debugCurrentTask=()=>session?structuredClone(currentTask()):null;
  alphabetLabApi.debugSession=()=>session?structuredClone(session):null;
  alphabetLabApi.debugStartFamily=(letter,family,{size=1}={})=>{
    if(!C.ALPHABET.includes(letter))throw new Error('Unknown letter '+letter);
    const meta=C.QUESTION_FAMILIES[family];if(!meta)throw new Error('Unknown family '+family);
    session=C.createFocusedSession(S,letter,{size:Math.max(1,Number(size)||1)});session.title='E2E Debug';session.preset='debug-e2e';session.scope='focused';session.targetMainCount=Math.max(1,Number(size)||1);
    const skill=meta.skill||'visualToSound',difficulty=Math.max(meta.min??0,Math.min(meta.max??5,C.difficultyFor(S,letter,skill)));
    const task=C.buildV4Task(S,letter,skill,difficulty,family,session,()=>.371,{scheduledReason:'debug-e2e'});session.mainTasks[0]=task;screen='exam';renderExam();return structuredClone(task)
  };
  alphabetLabApi.debugPrimeProductionLetter=(letter,{ratio=1}={})=>{
    if(!C.ALPHABET.includes(letter))throw new Error('Unknown letter '+letter);
    const m=S.letters[letter],day=C.localDateKey(Date.now()-2*C.DAY);m.writeDays=[day];
    for(const k of C.CORE_SKILLS){const s=m.skills[k];s.attempts=s.independentAttempts=10;s.correct=s.independentCorrect=Math.max(0,Math.min(10,Math.round(10*ratio)));s.wrong=s.independentWrong=10-s.independentCorrect;s.evidenceWeightSum=10;s.evidenceCorrectSum=s.independentCorrect;s.confidenceEvidence=10;s.recentResults=Array.from({length:10},(_,i)=>({good:i<s.independentCorrect,independent:true,weight:1}));s.successDays=[3,2,1,0].map(n=>C.localDateKey(Date.now()-n*C.DAY));s.dueAt=Date.now()+7*C.DAY;s.repairPending=false}
    S.answerLog.push({letter,type:'visual',correct:true,firstAttempt:true,isRepair:false},{letter,type:'reverse',correct:true,firstAttempt:true,isRepair:false});
    S.learningPlan.introducedLetters=C.uniq([...(S.learningPlan.introducedLetters||[]),letter]);S.learningPlan.activeLetters=C.uniq([letter,...(S.learningPlan.activeLetters||[])]).slice(0,8);persist();return C.summaryForLetter(S,letter)
  };
  alphabetLabApi.debugStartProductionFamily=(letter,family)=>{
    if(!C.ALPHABET.includes(letter))throw new Error('Unknown letter '+letter);
    if(!C.PRODUCTION_FAMILIES?.[family])throw new Error('Unknown production family '+family);
    session=C.createAdaptiveSession(S,{targetMainCount:1,title:'Production E2E',preset:'debug-production',scope:'focused',feedback:'learning',fixedLetters:[letter],focused:true});C.initProductionSession(session,S,()=>.371);session.productionCurrent=C.productionTask(S,letter,family,session,()=>.371,{scheduledReason:'debug-e2e-production'});screen='exam';renderExam();return structuredClone(session.productionCurrent)
  };
  alphabetLabApi.debugShowDueRepair=()=>{
    const repair=session?.pendingRepairs?.find(x=>!x.done);if(!repair)return false;repair.dueAfterMainIndex=session.mainIndex;session.repairCurrent=null;session.locked=false;renderExam();return true
  };
  alphabetLabApi.debugHome=()=>{session=null;screen='home';render()};
}
window.AlphabetLab=alphabetLabApi;
render();
