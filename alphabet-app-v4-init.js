'use strict';
const alphabetLabApi={version:C.SCHEMA_VERSION||C.VERSION,state:()=>structuredClone(S),export:()=>JSON.stringify(S,null,2),reset(){if(confirm('Alphabet-Lernstand wirklich löschen?')){[STORAGE,LEGACY2,LEGACY1].forEach(k=>localStorage.removeItem(k));S=C.freshState();persist();screen='home';render()}},startExam,startMyTraining};
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
  alphabetLabApi.debugShowDueRepair=()=>{
    const repair=session?.pendingRepairs?.find(x=>!x.done);if(!repair)return false;repair.dueAfterMainIndex=session.mainIndex;session.repairCurrent=null;session.locked=false;renderExam();return true
  };
  alphabetLabApi.debugHome=()=>{session=null;screen='home';render()};
}
window.AlphabetLab=alphabetLabApi;
render();
