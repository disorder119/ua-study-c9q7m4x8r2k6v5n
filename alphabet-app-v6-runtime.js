'use strict';

const V6_STORAGE_KEY='uk-alpha-lab-v6',V6_LEGACY_STORAGE_KEYS=['uk-alpha-lab-v3','uk-alpha-lab-v2','uk-alpha-lab-v1'];
let v6PersistTimer=0,v6PersistPending=null,v6PersistError='';
function compactV6State(state){
  state.answerLog=Array.isArray(state.answerLog)?state.answerLog.slice(-1000):[];
  state.productionHistory=Array.isArray(state.productionHistory)?state.productionHistory.slice(-160):[];
  state.examHistory=Array.isArray(state.examHistory)?state.examHistory.slice(-60):[];
  state.sessionSnapshots=Array.isArray(state.sessionSnapshots)?state.sessionSnapshots.slice(-20):[];
  for(const c of C.ALPHABET){const m=state.letters[c];m.productionHistory=Array.isArray(m.productionHistory)?m.productionHistory.slice(-32):[];m.exposure=m.exposure||{};m.exposure.recentSignatures=Array.isArray(m.exposure.recentSignatures)?m.exposure.recentSignatures.slice(-30):[]}
  return state
}
function setPersistWarning(message=''){
  v6PersistError=message;
  let el=document.getElementById('persistWarning');
  if(!message){el?.remove();return}
  if(!el){el=document.createElement('div');el.id='persistWarning';el.setAttribute('role','status');el.setAttribute('aria-live','polite');el.style.cssText='position:fixed;left:12px;right:12px;top:10px;z-index:90;max-width:720px;margin:auto;padding:10px 14px;border-radius:12px;background:#fff7ed;border:1px solid #fdba74;color:#7c2d12;font-weight:750;box-shadow:0 8px 24px rgba(0,0,0,.08)';document.body.append(el)}
  el.textContent=message
}
function cleanupLegacyStorage(){for(const key of V6_LEGACY_STORAGE_KEYS){try{localStorage.removeItem(key)}catch(_){}}}
function writeCanonicalV6(state){const raw=JSON.stringify(state);localStorage.setItem(V6_STORAGE_KEY,raw);return raw}
function flushPersist(state=v6PersistPending||S){
  clearTimeout(v6PersistTimer);v6PersistTimer=0;v6PersistPending=null;if(!state)return false;
  try{writeCanonicalV6(state);cleanupLegacyStorage();setPersistWarning('');return true}catch(err){
    try{compactV6State(state);writeCanonicalV6(state);cleanupLegacyStorage();setPersistWarning('');return true}catch(err2){
      const code=String(err2?.name||err2||err);console.error('Alphabet Lab persistence failed',err2);setPersistWarning('Lernstand konnte auf diesem Gerät gerade nicht gespeichert werden.');v6PersistError=code;return false
    }
  }
}
function flushPendingPersist(){
  clearTimeout(v6PersistTimer);v6PersistTimer=0;
  if(!v6PersistPending)return true;
  return flushPersist(v6PersistPending)
}
persist=function(state=S,opts={}){v6PersistPending=state;if(opts===true||opts?.immediate)return flushPersist(state);clearTimeout(v6PersistTimer);v6PersistTimer=setTimeout(()=>flushPersist(),160);return true};
function readStored(key){try{const raw=localStorage.getItem(key);return raw?JSON.parse(raw):null}catch(_){return null}}
function bootstrapV6Storage(){
  let raw=readStored(V6_STORAGE_KEY),source=raw?V6_STORAGE_KEY:'';
  if(!raw){for(const key of V6_LEGACY_STORAGE_KEYS){raw=readStored(key);if(raw){source=key;break}}}
  S=C.migrate(raw||S);window.__ALPHABET_BOOTSTRAP_SOURCE=source||'fresh';flushPersist(S)
}
bootstrapV6Storage();
addEventListener('pagehide',()=>flushPendingPersist(),{capture:true});
addEventListener('beforeunload',()=>flushPendingPersist(),{capture:true});
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')flushPendingPersist()});

const finishExamV6PersistBase=finishExam;
finishExam=function(){const out=finishExamV6PersistBase();flushPersist();return out};

const renderExamMenuV6Base=renderExamMenu;
renderExamMenu=function(){renderExamMenuV6Base();const button=app.querySelector('[data-prod-test="33"]');if(button){button.textContent='Großer Produktionscheck';button.insertAdjacentHTML('afterend','<small class="muted production-check-note">20 repräsentative freie Produktionsaufgaben · Coverage wird über mehrere Durchgänge gespeichert.</small>')}const card=button?.closest('.production-tests');if(card){const cov=C.productionCoverageSummary(S);const line=document.createElement('p');line.className='muted';line.textContent=`Langzeit-Coverage: ${cov.totalLetters}/33 Buchstaben bereits ausprobiert.`;card.append(line)}};

window.AlphabetLabV6Runtime=Object.freeze({APP_VERSION:'6.1.0',STATE_SCHEMA_VERSION:6,storageKey:V6_STORAGE_KEY,legacyKeys:[...V6_LEGACY_STORAGE_KEYS],flushPersist,flushPendingPersist,compactV6State,persistError:()=>v6PersistError,stateBytes:()=>{try{return new Blob([JSON.stringify(S)]).size}catch(_){return 0}},resetStorage(){for(const key of [V6_STORAGE_KEY,...V6_LEGACY_STORAGE_KEYS]){try{localStorage.removeItem(key)}catch(_){}}}});
