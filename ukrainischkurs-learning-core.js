/* Ukrainischkurs für Joel · Learning Core v5
   Gemeinsame Normalisierung, Curriculum-Abhängigkeiten, dynamische Freischaltung,
   skillbasierte Evidenz und aktualitätsgewichtete automatische Review-Fokussierung.
   v59-Härtung: das bereits vorhandene Evidenzgewicht zählt nun auch im Recent-Score. */
(()=>{
  const VERSION=5;
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
  function listRequirements(requirements){return (Array.isArray(requirements)?requirements:[requirements]).map(x=>String(x??'').trim()).filter(Boolean)}
  function introductionDays(requirements,opts={}){return listRequirements(requirements).map(x=>introductionDay(x,opts))}
  function allIntroduced(requirements,opts={}){const req=listRequirements(requirements);return req.length>0&&req.every(x=>{const d=introductionDay(x,opts);return d>=0&&d<=Number(s.day)})}
  function anchorDay(requirements,opts={}){const req=listRequirements(requirements);if(!req.length)return -1;const days=introductionDays(req,opts);return days.some(d=>d<0)?-1:Math.max(...days)}
  function isIntroduced(needle,opts={}){return allIntroduced([needle],opts)}
  function addEvidence(skill,score,meta={},persist=true){
    if(!SKILLS.includes(skill))return;const root=ensure(),st=root.skills[skill],weight=clamp(Number(meta.weight)||1,.25,4),pct=clamp(Number(score)||0,0,100);
    st.sessions=(Number(st.sessions)||0)+1;st.scoreSum=(Number(st.scoreSum)||0)+pct*weight;st.weight=(Number(st.weight)||0)+weight;st.passed=(Number(st.passed)||0)+(meta.passed?1:0);st.assisted=(Number(st.assisted)||0)+(meta.assisted?1:0);st.lastDate=meta.date||date();
    st.history.push({date:st.lastDate,day:Number.isFinite(Number(meta.day))?Number(meta.day):Number(s.day),module:String(meta.module||''),score:Math.round(pct),passed:!!meta.passed,assisted:!!meta.assisted,weight});if(st.history.length>40)st.history.splice(0,st.history.length-40);
    if(persist&&typeof save==='function')save();
  }
  function recordSession(meta={}){
    const total=Math.max(1,Number(meta.total)||1),correct=clamp(Number(meta.correct)||0,0,total),score=correct/total*100,skills=[...new Set((Array.isArray(meta.skills)?meta.skills:[meta.skills]).filter(Boolean))];
    skills.forEach(k=>addEvidence(k,score,{...meta,passed:meta.passed??correct===total},false));if(typeof save==='function')save();return profile();
  }
  function cumulativeScore(skill){const st=ensure().skills[skill];return st.weight>0?Math.round(st.scoreSum/st.weight):null}
  function recentScore(skill,limit=8){
    const st=ensure().skills[skill],hist=st.history.slice(-Math.max(1,Number(limit)||8));if(!hist.length)return null;
    let scoreSum=0,weightSum=0;hist.forEach((entry,index)=>{const age=hist.length-1-index,recency=Math.pow(.82,age),assistance=entry?.assisted ? .65 : 1,evidence=clamp(Number(entry?.weight)||1,.25,4),weight=recency*assistance*evidence;scoreSum+=clamp(Number(entry?.score)||0,0,100)*weight;weightSum+=weight});
    return weightSum?Math.round(scoreSum/weightSum):null;
  }
  function skillScore(skill){
    const st=ensure().skills[skill],all=cumulativeScore(skill),recent=recentScore(skill);if(all==null)return recent;if(recent==null)return all;
    const n=Math.max(0,Number(st.history.length)||0),recentShare=n>=6?.72:n>=3?.60:.45;return Math.round(all*(1-recentShare)+recent*recentShare);
  }
  function isoDay(value){const m=String(value||'').match(/^(\d{4})-(\d{2})-(\d{2})$/);return m?Date.UTC(Number(m[1]),Number(m[2])-1,Number(m[3])):NaN}
  function staleDays(skill){const st=ensure().skills[skill],from=isoDay(st.lastDate),to=isoDay(typeof date==='function'?date():'');if(!Number.isFinite(from)||!Number.isFinite(to)||to<=from)return 0;return Math.min(365,Math.floor((to-from)/86400000))}
  function priorityScore(skill){const base=skillScore(skill);if(base==null)return null;const stale=staleDays(skill),penalty=clamp((stale-3)*.75,0,8);return Math.round(clamp(base-penalty,0,100))}
  function profile(){const root=ensure();return Object.fromEntries(SKILLS.map(k=>[k,{label:LABELS[k],score:skillScore(k),recent:recentScore(k),priority:priorityScore(k),staleDays:staleDays(k),sessions:Number(root.skills[k].sessions)||0,passed:Number(root.skills[k].passed)||0,assisted:Number(root.skills[k].assisted)||0,lastDate:root.skills[k].lastDate||''}]))}
  function rankedSkills(minSessions=1){const p=profile();return SKILLS.filter(k=>p[k].sessions>=minSessions).sort((a,b)=>(p[a].priority??101)-(p[b].priority??101)||(p[a].score??101)-(p[b].score??101)||p[a].sessions-p[b].sessions)}
  function weakest(){return rankedSkills(1)[0]||null}
  function focusForDay(day=Number(s.day),opts={}){
    const root=ensure(),key=String(day);if(root.focusHistory[key]&&SKILLS.includes(root.focusHistory[key]))return root.focusHistory[key];
    const ranked=rankedSkills(Number(opts.minSessions)||1);if(!ranked.length)return null;
    let chosen=ranked[0],previousKeys=Object.keys(root.focusHistory).map(Number).filter(Number.isFinite).filter(x=>x<day).sort((a,b)=>b-a),previous=previousKeys.length?root.focusHistory[String(previousKeys[0])]:'';
    if(previous===chosen&&ranked[1]){const p=profile(),gap=Math.abs((p[ranked[1]].priority??100)-(p[chosen].priority??100));if(gap<=Number(opts.rotateGap??6))chosen=ranked[1]}
    root.focusHistory[key]=chosen;const keys=Object.keys(root.focusHistory).map(Number).filter(Number.isFinite).sort((a,b)=>a-b);if(keys.length>30)keys.slice(0,keys.length-30).forEach(x=>delete root.focusHistory[String(x)]);if(typeof save==='function'&&opts.persist!==false)save();return chosen
  }
  function reviewFocus(){if(!WEEKLY_REVIEW_DAYS.includes(Number(s.day)))return null;return focusForDay(Number(s.day),{minSessions:1,rotateGap:6})}
  function passedMap(map,expected){const vals=Object.values(map||{});return vals.length>=expected&&vals.filter(x=>x?.passed).length>=expected}
  function speakingComplete(){const days=Object.values(s.speakingBridge?.days||{}),done=days.reduce((n,x)=>n+(Array.isArray(x?.completed)?x.completed.length:0),0);return done>=12}
  function a1ExamComplete(){return ['reading','listening','writing','speaking'].every(k=>!!s.a1Exam?.domains?.[k]?.passed&&!!s.a1Exam?.domains?.[k]?.confirmed)}
  const MILESTONES={
    'alphabet.mastery':{requires:[],complete:()=>!!s.alphabetPhase?.checkpointPassed},
    'grammar.location-direction':{requires:['alphabet.mastery'],complete:()=>passedMap(s.a1GrammarBridge?.rules,7)},
    'grammar.time':{requires:['grammar.location-direction'],complete:()=>passedMap(s.timeBridge?.rules,6)},
    'grammar.genitive':{requires:['grammar.time'],complete:()=>passedMap(s.genitiveBridge?.rules,6)},
    'listening.human':{requires:['grammar.genitive'],complete:()=>passedMap(s.humanListening?.days,3)},
    'speaking.sentences':{requires:['listening.human'],complete:speakingComplete},
    'immersion.transfer':{requires:['speaking.sentences'],complete:()=>passedMap(s.immersionTransfer?.days,6)},
    'a1.exam':{requires:['immersion.transfer'],complete:a1ExamComplete},
    'a1.final':{requires:['a1.exam'],complete:()=>!!s.a1CanDo?.passed}
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
  window.UKRAINIAN_LEARNING_CORE={version:VERSION,skills:[...SKILLS],labels:{...LABELS},normalize,accepts,introductionDay,introductionDays,isIntroduced,allIntroduced,anchorDay,recordSession,cumulativeScore,recentScore,skillScore,staleDays,priorityScore,profile,rankedSkills,weakest,focusForDay,reviewFocus,registerMilestone,isComplete,isUnlocked,unmet,curriculum,historyWeightAware:true};
})();