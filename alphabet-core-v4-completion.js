'use strict';

const HUMAN_LETTER_AUDIO_LETTERS=ALPHABET.filter(c=>c!=='Ь');
const MACRO_PHASES=Object.freeze([
  {id:'warmup',label:'Warm-up',from:0,to:3,scope:'adaptive'},
  {id:'errors',label:'Fehler & Schwächen',from:4,to:11,scope:'errors'},
  {id:'active',label:'Aktives Lernfeld',from:12,to:21,scope:'adaptive'},
  {id:'mixed',label:'Mischprüfung',from:22,to:29,scope:'adaptive'},
  {id:'automation',label:'Automatisierung',from:30,to:35,scope:'speed'}
]);

QUESTION_FAMILIES['letter-to-audio-choice']={skill:'visualToSound',min:2,max:5,weight:.95,usesAudio:true,production:1,countsForMastery:true};
FAMILY_PROMPTS['letter-to-audio-choice']=[
  'Welche menschliche Aufnahme gehört zu diesem ukrainischen Buchstaben?',
  'Höre die Kandidaten. Welche Buchstabenaussprache passt zum Zeichen?',
  'Welcher Audio-Kandidat spricht genau diesen Buchstaben aus?',
  'Zeichen gesehen – welche echte Buchstabenaufnahme gehört dazu?',
  'Vergleiche die Aufnahmen: Welche gehört zu diesem Zeichen?'
];

function isolatedHumanAudioSupported(letter){return HUMAN_LETTER_AUDIO_LETTERS.includes(letter)}
function macroPhase(session){const i=Math.max(0,Number(session?.mainIndex)||0);return MACRO_PHASES.find(p=>i>=p.from&&i<=p.to)||MACRO_PHASES.at(-1)}
function createMacroSession(state,opts={}){const s=createAdaptiveSession(state,{targetMainCount:36,title:'20-Minuten Intensiv',preset:'macro-20',scope:'adaptive',feedback:'learning'});s.macro=true;s.phasePlan=MACRO_PHASES.map(x=>({...x}));s.startSnapshot=snapshotMastery(state,activeLearningSet(state));return s}

const buildV4TaskCompletionBase=buildV4Task;
buildV4Task=function(state,letter,skill,difficulty,family,session,rng=Math.random,meta={}){
  if(family==='letter-to-audio-choice'){
    if(!isolatedHumanAudioSupported(letter)){
      const fallback=familyCandidates(state,letter,'visualToSound',difficulty,session).find(f=>f!=='letter-to-audio-choice'&&!QUESTION_FAMILIES[f]?.usesAudio)||'word-plain';
      return buildV4TaskCompletionBase(state,letter,'visualToSound',difficulty,fallback,session,rng,meta);
    }
    const p=promptForFamily(family,rng),conf=uniq([...(LETTER_PEDAGOGY[letter]?.confusions||[]),...personalConfusions(state,letter),...shuffle(HUMAN_LETTER_AUDIO_LETTERS.filter(c=>c!==letter),rng)]).filter(c=>c!==letter&&c!=='Ь').slice(0,3),choices=shuffle(uniq([letter,...conf]).slice(0,4),rng);
    return {questionId:id('q'),sessionId:session?.sessionId||meta.sessionId||'',letter,skill:'visualToSound',type:'audioChoice',family,variant:family,promptFamily:family,promptId:p.id,prompt:p.text,difficulty,firstAttempt:!meta.isRepair,isRepair:!!meta.isRepair,repairLevel:Number(meta.repairLevel)||0,createdFromError:!!meta.createdFromError,scheduledReason:meta.scheduledReason||'adaptive',evidenceWeight:.95,countsForMastery:true,interaction:'audioChoice',display:letter,correct:letter,options:choices,audioChoiceLetters:choices,requiresHumanLetterAudio:true,audioStimulusId:`isolated-letter-choice-${letter}`,stimulusId:`isolated-letter-choice-${choices.slice().sort().join('')}`};
  }
  return buildV4TaskCompletionBase(state,letter,skill,difficulty,family,session,rng,meta)
};

const familyCandidatesCompletionBase=familyCandidates;
familyCandidates=function(state,letter,skill,difficulty,session){
  let fam=familyCandidatesCompletionBase(state,letter,skill,difficulty,session);
  if(letter==='Ь')return fam.filter(f=>f!=='letter-to-audio-choice');
  if(skill==='visualToSound'&&difficulty>=2&&isolatedHumanAudioSupported(letter)&&!fam.includes('letter-to-audio-choice'))fam=[...fam,'letter-to-audio-choice'];
  return fam
};

const selectNextMainQuestionCompletionBase=selectNextMainQuestion;
selectNextMainQuestion=function(state,session,rng=Math.random,now=Date.now()){
  if(!session?.macro)return selectNextMainQuestionCompletionBase(state,session,rng,now);
  const phase=macroPhase(session),oldScope=session.scope;
  if(phase.id==='errors')session.scope=errorLetters(state,now).length?'errors':'weak';
  else if(phase.id==='automation'){
    const active=session.activeLearningSet?.length?session.activeLearningSet:activeLearningSet(state,now),avg=active.length?active.reduce((n,c)=>n+letterMasteryV4(state,c,now),0)/active.length:0;
    session.scope=avg>=55?'speed':'adaptive';
  }else session.scope='adaptive';
  const task=selectNextMainQuestionCompletionBase(state,session,rng,now);session.scope=oldScope;
  if(task){task.macroPhase=phase.id;task.selectionReason=`${phase.label}; ${task.selectionReason||'adaptiv'}`}
  return task
};
