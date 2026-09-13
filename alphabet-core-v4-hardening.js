'use strict';

// V4 production hardening: keep the adaptive architecture, but make diversity and
// skill/family matching strict enough to be testable rather than probabilistic.
for(const w of WORD_BANK){
  const required=uniq([...w.word.toLocaleUpperCase('uk')].filter(ch=>ALPHABET.includes(ch)));
  w.knownLettersRequired=required;
}

const familyCandidatesV4Base=familyCandidates;
familyCandidates=function(state,letter,skill,difficulty,session){
  let families=familyCandidatesV4Base(state,letter,skill,difficulty,session);
  if(letter==='Ь'){
    const soft={
      visualToSound:['visual-find','word-image','word-plain','word-position','word-contains','tap-target','multi-occurrence','count-target'],
      soundToLetter:['missing-letter','word-choice'],
      caseRecognition:['same-different','pair-match'],
      audioToLetter:['audio-word-position'],
      confusionDiscrimination:['odd-one-out','visual-contrast','error-correction'],
      speedRecognition:['flash-recognition'],memoryRecognition:['memory-pair'],writing:['writing-recall']
    };
    return (soft[skill]||['word-plain']).filter(f=>QUESTION_FAMILIES[f]);
  }
  families=families.filter(f=>LATIN_TRAPS[letter]||!['latin-trap','reverse-fake-friend'].includes(f));
  const matching=families.filter(f=>QUESTION_FAMILIES[f]?.skill===skill);
  if(matching.length)return matching;
  const all=Object.entries(QUESTION_FAMILIES)
    .filter(([f,m])=>m.skill===skill&&(LATIN_TRAPS[letter]||!['latin-trap','reverse-fake-friend'].includes(f)))
    .filter(([,m])=>!m.usesAudio||WORD_BANK.some(w=>w.letter===letter&&w.audioKey===letter));
  if(!all.length)return ['visual-to-sound'];
  let minDistance=Infinity;
  for(const [,m] of all){const d=difficulty<m.min?m.min-difficulty:difficulty>m.max?difficulty-m.max:0;minDistance=Math.min(minDistance,d)}
  return all.filter(([,m])=>(difficulty<m.min?m.min-difficulty:difficulty>m.max?difficulty-m.max:0)===minDistance).map(([f])=>f);
};

const pickWordV4Base=pickWord;
pickWord=function(state,letter,session,rng=Math.random,{multiple=false,audioOnly=false}={}){
  let pool=wordsForLetter(letter).filter(w=>!multiple||w.targetIndexes.length>1).filter(w=>!audioOnly||w.audioKey===letter);
  if(!pool.length)pool=wordsForLetter(letter);
  if(!pool.length)return pickWordV4Base(state,letter,session,rng,{multiple,audioOnly});
  const introduced=new Set(state.learningPlan?.introducedLetters||[]),used=new Set(session?.usedWordIds||[]);
  const score=w=>{
    const unknown=(w.knownLettersRequired||[]).filter(c=>c!==letter&&!introduced.has(c)).length;
    const stats=wordStat(state,letter,w.id);
    return (used.has(w.id)?1000:0)+unknown*24+stats.seen*7+(w.level||1)*1.5;
  };
  pool=[...pool].sort((a,b)=>score(a)-score(b)||a.id.localeCompare(b.id));
  const bestScore=score(pool[0]),best=pool.filter(w=>score(w)<=bestScore+1.5).slice(0,3);
  return best[Math.floor(rng()*best.length)]||pool[0];
};

const buildV4TaskBase=buildV4Task;
function structuralVariant(task){
  const family=task.family||task.type||'task';
  if(task.wordId)return `${family}:word`;
  if(task.fontId)return `${family}:font:${task.fontId}`;
  if(task.flashMs)return `${family}:flash:${task.flashMs}`;
  if(task.interaction==='multiSelect')return `${family}:multi`;
  if(task.interaction==='writingRecall')return `${family}:write`;
  if(task.confusionTarget)return `${family}:contrast:${task.confusionTarget}`;
  return `${family}:${task.type||'choice'}`;
}
buildV4Task=function(state,letter,skill,difficulty,family,session,rng=Math.random,meta={}){
  const task=buildV4TaskBase(state,letter,skill,difficulty,family,session,rng,meta);
  task.variant=structuralVariant(task);
  task.answerOrderKey=(task.options||[]).join('¦');
  return task;
};

questionSignature=function(task){
  const optionSet=[...(task.options||[])].map(String).sort((a,b)=>a.localeCompare(b,'uk')).join(',');
  const tokenStimulus=(task.tokens||[]).join('');
  const stimulus=task.stimulusId||task.wordId||task.audioStimulusId||tokenStimulus||task.display||'';
  return [task.letter,task.skill,task.family||task.type,task.variant||'',task.type||'',stimulus,task.fontId||'',task.confusionTarget||'',task.interaction||'choice',optionSet].join('|');
};

const FOCUSED_BEGINNER=['visual-to-sound','sound-to-letter','upper-to-lower','visual-find','word-image','word-contains','audio-to-letter','visual-contrast','syllable','word-plain','word-position','pair-match'];
const FOCUSED_APPLICATION=['word-position','count-target','multi-select','missing-letter','word-plain','pseudoword','sound-contrast','visual-contrast','audio-to-letter','font-recognition','memory-pair','sound-to-letter','word-choice','tap-target','pair-match'];
const FOCUSED_ADVANCED=['audio-to-letter','sound-contrast','visual-contrast','word-position','count-target','multi-select','missing-letter','pseudoword','font-recognition','flash-recognition','memory-pair','word-choice','tap-target','multi-occurrence','same-different','error-correction','writing-recall','sound-to-letter'];
const SOFT_FOCUSED=['word-image','word-plain','word-position','word-contains','tap-target','multi-occurrence','count-target','missing-letter','word-choice','visual-contrast','odd-one-out','error-correction','same-different','pair-match','audio-word-position','memory-pair','writing-recall'];
const BATTLE_COVERAGE=['visual-contrast','sound-contrast','audio-to-letter','word-plain','pseudoword','flash-recognition','sound-to-letter','multi-select','memory-pair','word-position'];
const DIRECT_CASE_FAMILIES=new Set(['upper-to-lower','lower-to-upper','pair-match']);

function familySkillFor(letter,family){
  if(letter!=='Ь')return QUESTION_FAMILIES[family]?.skill||'visualToSound';
  if(['missing-letter','word-choice'].includes(family))return 'soundToLetter';
  if(['same-different','pair-match'].includes(family))return 'caseRecognition';
  if(family==='audio-word-position')return 'audioToLetter';
  if(['odd-one-out','visual-contrast','error-correction'].includes(family))return 'confusionDiscrimination';
  if(family==='flash-recognition')return 'speedRecognition';
  if(family==='memory-pair')return 'memoryRecognition';
  if(family==='writing-recall')return 'writing';
  return 'visualToSound';
}
function familyAllowedFor(letter,family){
  if(!QUESTION_FAMILIES[family])return false;
  if(!LATIN_TRAPS[letter]&&['latin-trap','reverse-fake-friend'].includes(family))return false;
  if(letter==='Ь'&&!SOFT_FOCUSED.includes(family))return false;
  return true;
}
function focusedFamilyOrder(state,letter,session,now){
  if(letter==='Ь')return SOFT_FOCUSED;
  const mastery=letterMasteryV4(state,letter,now),caseStrong=skillMasteryV4(state,letter,'caseRecognition',now)>=75&&!openRepairIds(state,letter,'caseRecognition').length;
  const primary=mastery<35?FOCUSED_BEGINNER:mastery<75?FOCUSED_APPLICATION:FOCUSED_ADVANCED;
  const secondary=mastery<35?FOCUSED_APPLICATION:mastery<75?FOCUSED_ADVANCED:FOCUSED_APPLICATION;
  return uniq([...primary,...secondary]).filter(f=>familyAllowedFor(letter,f)).filter(f=>!caseStrong||!DIRECT_CASE_FAMILIES.has(f));
}
function candidateFamiliesFor(state,letter,skill,difficulty,session,now){
  if(session.focused)return focusedFamilyOrder(state,letter,session,now);
  if(session.battle)return uniq([...BATTLE_COVERAGE,...familyCandidates(state,letter,skill,difficulty,session)]).filter(f=>familyAllowedFor(letter,f));
  return familyCandidates(state,letter,skill,difficulty,session).filter(f=>familyAllowedFor(letter,f));
}
function registerSelectedTask(state,session,task,debugMeta,now){
  const sig=questionSignature(task),fam=task.family||task.type,key=`${task.letter}|${task.skill}`;
  task.signature=sig;
  session.recentQuestionSignatures.push(sig);session.recentQuestionSignatures=session.recentQuestionSignatures.slice(-50);
  session.coverageState.skillCounts[key]=(session.coverageState.skillCounts[key]||0)+1;
  session.coverageState.familyCounts[fam]=(session.coverageState.familyCounts[fam]||0)+1;
  session.coverageState.letterCounts[task.letter]=(session.coverageState.letterCounts[task.letter]||0)+1;
  if(task.wordId&&!session.usedWordIds.includes(task.wordId))session.usedWordIds.push(task.wordId);
  session.debug.push({letter:task.letter,skill:task.skill,mastery:skillMasteryV4(state,task.letter,task.skill,now),needScore:task.needScore,family:task.family,difficulty:task.difficulty,reason:task.selectionReason,signature:sig,...debugMeta});
  session.debug=session.debug.slice(-100);
  return task;
}

selectNextMainQuestion=function(state,session,rng=Math.random,now=Date.now()){
  if(!session?.adaptive)throw new Error('adaptive session required');
  if(session.mainIndex>=session.targetMainCount)return null;
  const letterPick=selectLetterV4(state,session,rng,now),letter=letterPick.letter;
  const skillPick=selectSkillV4(state,letter,session,rng,now),baseSkill=skillPick.skill,baseDifficulty=difficultyFor(state,letter,baseSkill,now);
  let families=candidateFamiliesFor(state,letter,baseSkill,baseDifficulty,session,now);
  const unseen=families.filter(f=>!session.coverageState.familyCounts[f]);
  if((session.focused||session.battle)&&unseen.length)families=[...unseen,...families.filter(f=>session.coverageState.familyCounts[f])];
  const usedSignatures=new Set(session.recentQuestionSignatures||[]);
  let bestUnique=null,bestAny=null;
  for(const family of families){
    const skill=familySkillFor(letter,family),meta=QUESTION_FAMILIES[family]||{},raw=difficultyFor(state,letter,skill,now),difficulty=clamp(raw,meta.min??0,meta.max??5);
    const need=calculateLearningNeed(state,letter,skill,now,session),coverageBonus=session.coverageState.familyCounts[family]?0:24;
    for(let attempt=0;attempt<5;attempt++){
      const task=buildV4Task(state,letter,skill,difficulty,family,session,rng,{scheduledReason:letterPick.reason});
      task.needScore=Math.round(need);task.selectionReason=`${letterPick.reason}; ${SKILL_LABELS[skill]||skill} need ${Math.round(need)}; diversity-aware`;
      const sig=questionSignature(task),novelty=noveltyScore(task,state,session),priority=novelty+coverageBonus+clamp(need,0,160)*.9;
      const row={task,novelty,priority,sig};
      if(!bestAny||priority>bestAny.priority)bestAny=row;
      if(!usedSignatures.has(sig)&&(!bestUnique||priority>bestUnique.priority))bestUnique=row;
    }
  }
  if(!bestUnique){
    const broad=Object.keys(QUESTION_FAMILIES).filter(f=>familyAllowedFor(letter,f));
    for(const family of broad){
      const skill=familySkillFor(letter,family),meta=QUESTION_FAMILIES[family],difficulty=clamp(difficultyFor(state,letter,skill,now),meta.min??0,meta.max??5),need=calculateLearningNeed(state,letter,skill,now,session);
      for(let attempt=0;attempt<8;attempt++){
        const task=buildV4Task(state,letter,skill,difficulty,family,session,rng,{scheduledReason:letterPick.reason});
        task.needScore=Math.round(need);task.selectionReason=`${letterPick.reason}; duplicate-avoidance fallback`;
        const sig=questionSignature(task),novelty=noveltyScore(task,state,session),priority=novelty+clamp(need,0,160)*.75;
        if(!usedSignatures.has(sig)&&(!bestUnique||priority>bestUnique.priority))bestUnique={task,novelty,priority,sig};
      }
    }
  }
  const chosen=bestUnique||bestAny;
  if(!chosen)throw new Error(`No adaptive task available for ${letter}`);
  return registerSelectedTask(state,session,chosen.task,{novelty:Math.round(chosen.novelty),priority:Math.round(chosen.priority)},now);
};

const masteredV4Base=masteredV4;
masteredV4=function(state,now=Date.now()){
  const r=masteredV4Base(state,now);
  const audio=(state.masteryChecks.audio||[]).some(x=>x.accuracy>=.95&&x.total>=33&&x.humanAudioOnly===true&&x.coverageLetters?.length===33&&!x.technicalIncomplete&&!x.technicallyIncomplete);
  return {...r,audio,done:r.allLetters&&r.finals&&r.fake&&audio&&r.retention&&r.speed};
};
