'use strict';

const V6_STORAGE_KEY='uk-alpha-lab-v6',V6_LEGACY_STORAGE_KEYS=['uk-alpha-lab-v3','uk-alpha-lab-v2','uk-alpha-lab-v1'];
let v6PersistTimer=0,v6PersistPending=null,v6PersistError='';
function compactV6State(state){
  state.answerLog=Array.isArray(state.answerLog)?state.answerLog.slice(-1000):[];state.productionHistory=Array.isArray(state.productionHistory)?state.productionHistory.slice(-160):[];state.examHistory=Array.isArray(state.examHistory)?state.examHistory.slice(-60):[];state.sessionSnapshots=Array.isArray(state.sessionSnapshots)?state.sessionSnapshots.slice(-20):[];for(const c of C.ALPHABET){const m=state.letters[c];m.productionHistory=Array.isArray(m.productionHistory)?m.productionHistory.slice(-32):[];m.exposure.recentSignatures=Array.isArray(m.exposure?.recentSignatures)?m.exposure.recentSignatures.slice(-30):[]}return state
}
function flushPersist(state=v6PersistPending||S){clearTimeout(v6PersistTimer);v6PersistTimer=0;v6PersistPending=null;if(!state)return false;let raw='';try{raw=JSON.stringify(state);localStorage.setItem(V6_STORAGE_KEY,raw);localStorage.setItem('uk-alpha-lab-v3',raw);v6PersistError='';return true}catch(err){try{compactV6State(state);raw=JSON.stringify(state);localStorage.setItem(V6_STORAGE_KEY,raw);localStorage.setItem('uk-alpha-lab-v3',raw);v6PersistError='';return true}catch(err2){v6PersistError=String(err2?.name||err2||err);console.error('Alphabet Lab persistence failed',err2);return false}}}
persist=function(state=S,opts={}){v6PersistPending=state;if(opts===true||opts?.immediate)return flushPersist(state);clearTimeout(v6PersistTimer);v6PersistTimer=setTimeout(()=>flushPersist(),160);return true};
function bootstrapV6Storage(){let raw=null;try{raw=JSON.parse(localStorage.getItem(V6_STORAGE_KEY)||'null')}catch(_){raw=null}if(!raw){for(const key of V6_LEGACY_STORAGE_KEYS){try{raw=JSON.parse(localStorage.getItem(key)||'null')}catch(_){raw=null}if(raw)break}}S=C.migrate(raw||S);flushPersist(S)}
bootstrapV6Storage();
addEventListener('pagehide',()=>flushPersist(),{capture:true});addEventListener('beforeunload',()=>flushPersist(),{capture:true});document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')flushPersist()});

const finishExamV6PersistBase=finishExam;
finishExam=function(){const out=finishExamV6PersistBase();flushPersist();return out};

const renderExamMenuV6Base=renderExamMenu;
renderExamMenu=function(){renderExamMenuV6Base();const button=app.querySelector('[data-prod-test="33"]');if(button){button.textContent='Großer Produktionscheck';button.insertAdjacentHTML('afterend','<small class="muted production-check-note">20 repräsentative freie Produktionsaufgaben · Coverage wird über mehrere Durchgänge gespeichert.</small>')}const card=button?.closest('.production-tests');if(card){const cov=C.productionCoverageSummary(S);const line=document.createElement('p');line.className='muted';line.textContent=`Langzeit-Coverage: ${cov.totalLetters}/33 Buchstaben in mindestens einer freien Produktionsform.`;card.append(line)}};

window.AlphabetLabV6Runtime=Object.freeze({APP_VERSION:'6.0.0',STATE_SCHEMA_VERSION:6,storageKey:V6_STORAGE_KEY,flushPersist,persistError:()=>v6PersistError,stateBytes:()=>{try{return new Blob([JSON.stringify(S)]).size}catch(_){return 0}}});
