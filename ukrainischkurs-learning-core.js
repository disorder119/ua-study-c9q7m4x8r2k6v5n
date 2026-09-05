/* Ukrainischkurs für Joel · Learning Core v1
   Gemeinsame Normalisierung, Curriculum-Abhängigkeiten und skillbasierte Evidenz.
   Ziel: weniger duplizierte Bewertungslogik und stabilere Freischaltungen. */
(()=>{
  const VERSION=1;
  const SKILLS=['reading','listening','writing','speaking','grammar'];
  const LABELS={reading:'Lesen',listening:'Hören',writing:'Schreiben',speaking:'Sprechen',grammar:'Grammatik'};
  function ensure(){
    if(!s.learningCore||typeof s.learningCore!=='object')s.learningCore={version:VERSION,skills:{},focusHistory:{},seeded:false};
    s.learningCore.version=VERSION;s.learningCore.skills=s.learningCore.skills||{};s.learningCore.focusHistory=s.learningCore.focusHistory||{};
    SKILLS.forEach(k=>{const x=s.learningCore.skills[k]||(s.learningCore.skills[k]={sessions:0,scoreSum:0,weight:0,passed:0,assisted:0,lastDate:'',history:[]});x.history=Array.isArray(x.history)?x.history:[]});
    return s.learningCore;
  }
  const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
  function normalize(value,opts={}){
    let out=String(value??'').normalize('NFC').replace(/\u00a0/g,' ');
    if(opts.lower!==false)out=out.toLocaleLowerCase('uk');
    if(opts.apostrophe!==false)out=out.replace(/[ʼ’‘'`]/g,'’');
    if(opts.stripStress)out=out.normalize('NFD').replace(/\u0301/g,'').normalize('NFC');
    if(opts.punctuation!=='keep')out=out.replace(/[.!?,…:;«»"“”„()]/g,' ');
    if(opts.hyphen!=='keep')out=out.replace(/[–—-]/g,' ');
    return out.replace(/\s+/g,' ').trim();
  }
  function accepts(value,answers,opts={}){const wanted=(Array.isArray(answers)?answers:[answers]).map(x=>normalize(x,opts));return wanted.includes(normalize(value,opts))}
  function introductionDay(needle,opts={}){
    const target=normalize(needle,{stripStress:true});if(!target)return Number.isFinite(opts.fallback)?Number(opts.fallback):-1;
    for(let di=0;di<D.length;di++){
      const day=D[di]||[],parts=opts.cardOnly?(day[3]||[]).map(c=>c?.[0]):[day[0],day[1],day[2],...(day[3]||[]).flat()];
      if(parts.some(x=>{const hay=normalize(x,{stripStress:true});return hay===target||(' '+hay+' ').includes(' '+target+' ')}))return di;
    }
    return Number.isFinite(opts.fallback)?Number(opts.fallback):-1;
  }
  function addEvidence(skill,score,meta={},persist=true){
    if(!SKILLS.includes(skill))return;const root=ensure(),st=root.skills[skill],weight=clamp(Number(meta.weight)||1,.25,4),pct=clamp(Number(score)||0,0,100);
    st.sessions=(Number(st.sessions)||0)+1;st.scoreSum=(Number(st.scoreSum)||0)+pct*weight;st.weight=(Number(st.weight)||0)+weight;st.passed=(Number(st.passed)||0)+(meta.passed?1:0);st.assisted=(Number(st.assisted)||0)+(meta.assisted?1:0);st.lastDate=meta.date||date();
    st.history.push({date:st.lastDate,day:Number.isFinite(Number(meta.day))?Number(meta.day):Number(s.day),module:String(meta.module||''),score:Math.round(pct),passed:!!meta.passed,assisted:!!meta.assisted});if(st.history.length>40)st.history.splice(0,st.history.length-40);
    if(persist&&typeof save==='function')save();
  }
  function recordSession(meta={}){
    const total=Math.max(1,Number(meta.total)||1),correct=clamp(Number(meta.correct)||0,0,total),score=correct/total*100,skills=[...new Set((Array.isArray(meta.skills)?meta.skills:[meta.skills]).filter(Boolean))];
    skills.forEach(k=>addEvidence(k,score,{...meta,passed:meta.passed??correct===total},false));if(typeof save==='function')save();return profile();
  }
  function skillScore(skill){const st=ensure().skills[skill];return st.weight>0?Math.round(st.scoreSum/st.weight):null}
  function profile(){const root=ensure();return Object.fromEntries(SKILLS.map(k=>[k,{label:LABELS[k],score:skillScore(k),sessions:Number(root.skills[k].sessions)||0,passed:Number(root.skills[k].passed)||0,assisted:Number(root.skills[k].assisted)||0,lastDate:root.skills[k].lastDate||''}]))}
  function weakest(){const p=profile(),eligible=SKILLS.filter(k=>p[k].sessions>0);if(!eligible.length)return null;return eligible.sort((a,b)=>(p[a].score??101)-(p[b].score??101)||p[a].sessions-p[b].sessions)[0]}
  function passedMap(map,expected){const vals=Object.values(map||{});return vals.length>=expected&&vals.filter(x=>x?.passed).length>=expected}
  function speakingComplete(){const days=Object.values(s.speakingBridge?.days||{}),done=days.reduce((n,x)=>n+(Array.isArray(x?.completed)?x.completed.length:0),0);return done>=12}
  const MILESTONES={
    'alphabet.mastery':{requires:[],complete:()=>!!s.alphabetPhase?.checkpointPassed},
    'grammar.location-direction':{requires:['alphabet.mastery'],complete:()=>passedMap(s.a1GrammarBridge?.rules,7)},
    'grammar.time':{requires:['grammar.location-direction'],complete:()=>passedMap(s.timeBridge?.rules,6)},
    'grammar.genitive':{requires:['grammar.time'],complete:()=>passedMap(s.genitiveBridge?.rules,6)},
    'listening.human':{requires:['grammar.genitive'],complete:()=>passedMap(s.humanListening?.days,3)},
    'speaking.sentences':{requires:['listening.human'],complete:speakingComplete},
    'immersion.transfer':{requires:['speaking.sentences'],complete:()=>passedMap(s.immersionTransfer?.days,6)},
    'a1.final':{requires:['immersion.transfer'],complete:()=>!!s.a1CanDo?.passed}
  };
  function registerMilestone(id,spec){if(!id||!spec||typeof spec.complete!=='function')return false;MILESTONES[id]={requires:Array.isArray(spec.requires)?[...spec.requires]:[],complete:spec.complete};return true}
  function isComplete(id){const m=MILESTONES[id];if(!m)return false;try{return !!m.complete()}catch{return false}}
  function unmet(id){const m=MILESTONES[id];return m?m.requires.filter(x=>!isComplete(x)):[]}
  function isUnlocked(id){return unmet(id).length===0}
  function curriculum(){return Object.fromEntries(Object.entries(MILESTONES).map(([id,m])=>[id,{requires:[...m.requires],complete:isComplete(id),unmet:unmet(id)}]))}
  function seedLegacy(){
    const root=ensure();if(root.seeded)return;root.seeded=true;
    const seed=(skill,score,module)=>{if(Number(score)>0)addEvidence(skill,score,{module,passed:Number(score)>=80,weight:.75},false)};
    seed('reading',s.comprehensionLab?.bestReading,'legacy-comprehension-reading');seed('listening',s.comprehensionLab?.bestListening,'legacy-comprehension-listening');seed('writing',s.activeProduction?.best,'legacy-active-production');
    const grammarScores=[...Object.values(s.a1GrammarBridge?.rules||{}),...Object.values(s.timeBridge?.rules||{}),...Object.values(s.genitiveBridge?.rules||{})].map(x=>Number(x?.best)||0).filter(Boolean);if(grammarScores.length)seed('grammar',grammarScores.reduce((a,b)=>a+b,0)/grammarScores.length,'legacy-grammar');
    const sp=Object.values(s.speakingBridge?.days||{}).reduce((n,x)=>n+(Array.isArray(x?.completed)?x.completed.length:0),0);if(sp)seed('speaking',Math.min(100,sp/12*100),'legacy-speaking');
    if(typeof save==='function')save();
  }
  ensure();seedLegacy();
  window.UKRAINIAN_LEARNING_CORE={version:VERSION,skills:[...SKILLS],labels:{...LABELS},normalize,accepts,introductionDay,recordSession,skillScore,profile,weakest,registerMilestone,isComplete,isUnlocked,unmet,curriculum};
})();