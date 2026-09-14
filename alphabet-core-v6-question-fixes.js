'use strict';

// V6.1 question integrity fixes. Keep legacy/V4 generators compatible while
// guaranteeing that sound-to-letter questions are answerable and choice lists
// never contain duplicate visual-contrast answers.
const makeTaskQuestionCueBase=makeTask;
makeTask=function(letter,type,state,rng=Math.random,meta={}){
  const task=makeTaskQuestionCueBase(letter,type,state,rng,meta);
  if(type==='reverse'||task.type==='reverse'){
    task.display=task.display||DATA[task.letter||letter]?.sound||'';
    task.letterAudioAvailable=(task.letter||letter)!=='Ь';
    task.audioStimulusId=task.audioStimulusId||`letter-${task.letter||letter}`;
  }
  return task
};

const buildV4TaskQuestionCueBase=buildV4Task;
buildV4Task=function(state,letter,skill,difficulty,family,session,rng=Math.random,meta={}){
  const task=buildV4TaskQuestionCueBase(state,letter,skill,difficulty,family,session,rng,meta);
  if(family==='sound-to-letter'||task.type==='reverse'){
    task.display=task.display||DATA[task.letter||letter]?.sound||'';
    task.letterAudioAvailable=(task.letter||letter)!=='Ь';
    task.audioStimulusId=task.audioStimulusId||`letter-${task.letter||letter}`;
  }
  if(family==='visual-contrast'){
    const unique=uniq(task.options||[]),extras=shuffle(ALPHABET.filter(c=>c!==task.correct&&!unique.includes(c)),rng);
    while(unique.length<4&&extras.length)unique.push(extras.shift());
    task.options=shuffle(unique.slice(0,4),rng)
  }
  return task
};
