'use strict';

const recomputeLearningPlanV5Base=recomputeLearningPlan;
recomputeLearningPlan=function(state,now=Date.now(),opts={}){
  ensureV5State(state);
  const before=[...(state.learningPlan?.introducedLetters||[])],mainCount=(state.answerLog||[]).filter(x=>x.firstAttempt&&!x.isRepair).length,lastCount=Number(state.learningPlan.lastUnlockMainCount)||0,lastLetter=state.learningPlan.lastIntroducedLetter||before.at(-1)||'',lastAttempts=lastLetter&&state.letters[lastLetter]?CORE_SKILLS.reduce((n,k)=>n+(state.letters[lastLetter].skills[k]?.independentAttempts||0),0):0,high=before.length?before.slice(-5).filter(c=>basicReadiness(state,c,now).avg>=78).length>=4:false,allow=mainCount-lastCount>=5&&(lastAttempts>=2||high),plan=recomputeLearningPlanV5Base(state,now,opts),added=plan.introducedLetters.filter(c=>!before.includes(c));
  if(added.length&&!allow&&before.length>=5){plan.introducedLetters=before;plan.activeLetters=plan.activeLetters.filter(c=>before.includes(c));for(const c of before){if(plan.activeLetters.length>=5)break;if(!plan.activeLetters.includes(c)&&!letterReadyV4(state,c,now))plan.activeLetters.push(c)}}
  else if(added.length){plan.lastUnlockMainCount=mainCount;plan.lastIntroducedLetter=added[0]}
  plan.lastProductionRecomputedAt=now;return plan;
};
function wordUnknownCountV5(state,w,target){const introduced=new Set(state.learningPlan?.introducedLetters||[]),chars=uniq([...(w.knownLettersRequired||[...w.word.toLocaleUpperCase('uk')])].filter(ch=>ALPHABET.includes(ch)&&ch!==target));return chars.filter(ch=>!introduced.has(ch)).length}
function maxUnknownForDifficultyV5(d){return d<=0?0:d===1?1:d===2?3:99}
const pickWordV5Base=pickWord;
pickWord=function(state,letter,session,rng=Math.random,opts={}){
  const difficulty=Number(opts.difficulty??session?.currentDifficulty??2),max=maxUnknownForDifficultyV5(difficulty),multiple=!!opts.multiple,audioOnly=!!opts.audioOnly,used=new Set(session?.usedWordIds||[]);
  let pool=wordsForLetter(letter).filter(w=>(!multiple||w.targetIndexes.length>1)&&(!audioOnly||w.audioKey===letter)&&wordUnknownCountV5(state,w,letter)<=max);
  if(!pool.length&&difficulty>=3)return pickWordV5Base(state,letter,session,rng,opts);if(!pool.length)return null;
  pool.sort((a,b)=>(used.has(a.id)-used.has(b.id))||(wordStat(state,letter,a.id).seen-wordStat(state,letter,b.id).seen)||(a.level-b.level));
  return pool[Math.floor(rng()*Math.min(3,pool.length))]||pool[0];
};
function pickNegativeWordV5(state,letter,session,rng=Math.random,difficulty=2){
  const target=DATA[letter].lower,used=new Set(session?.usedWordIds||[]),max=maxUnknownForDifficultyV5(difficulty);
  let pool=WORD_BANK.filter(w=>w.letter!==letter&&!w.word.toLocaleLowerCase('uk').includes(target)&&wordUnknownCountV5(state,w,letter)<=max);
  if(!pool.length&&difficulty>=3)pool=WORD_BANK.filter(w=>w.letter!==letter&&!w.word.toLocaleLowerCase('uk').includes(target));if(!pool.length)return null;
  pool.sort((a,b)=>(used.has(a.id)-used.has(b.id))||((state.letters[a.letter]?.exposure?.wordStats?.[a.id]?.seen||0)-(state.letters[b.letter]?.exposure?.wordStats?.[b.id]?.seen||0)));
  return pool[Math.floor(rng()*Math.min(5,pool.length))]||pool[0];
}
const familyCandidatesV5Base=familyCandidates;
familyCandidates=function(state,letter,skill,difficulty,session){
  let fam=familyCandidatesV5Base(state,letter,skill,difficulty,session),hasWord=!!pickWord(state,letter,session,()=>.2,{difficulty});
  if(!hasWord)fam=fam.filter(f=>!QUESTION_FAMILIES[f]?.usesWord&&!['word-position','missing-letter','word-contains','word-choice','tap-target','multi-occurrence','word-image','word-plain','count-target'].includes(f));
  return fam.length?fam:familyCandidatesV5Base(state,letter,skill,difficulty,session).filter(f=>!QUESTION_FAMILIES[f]?.usesWord).slice(0,5);
};
const buildV4TaskV5Base=buildV4Task;
buildV4Task=function(state,letter,skill,difficulty,family,session,rng=Math.random,meta={}){
  if(PRODUCTION_FAMILIES[family])return productionTask(state,letter,family,session,rng,meta);if(session)session.currentDifficulty=difficulty;
  const wordFamilies=['count-target','word-position','missing-letter','word-contains','word-choice','tap-target','multi-occurrence','word-image','word-plain'];
  if(wordFamilies.includes(family)&&!pickWord(state,letter,session,rng,{difficulty,multiple:family==='count-target'||family==='multi-occurrence'})){
    const alternatives=familyCandidates(state,letter,skill,difficulty,session).filter(f=>!wordFamilies.includes(f)&&!QUESTION_FAMILIES[f]?.usesWord),fallback=alternatives[0]||'visual-find';
    return buildV4TaskV5Base(state,letter,skill,difficulty,fallback,session,rng,meta);
  }
  const task=buildV4TaskV5Base(state,letter,skill,difficulty,family,session,rng,meta);
  if(family==='word-contains'&&task.correct==='Nein'){const neg=pickNegativeWordV5(state,letter,session,rng,difficulty);if(neg){task.wordId=neg.id;task.display=neg.word;task.stimulusId=neg.id;task.icon=neg.icon}}
  return task;
};