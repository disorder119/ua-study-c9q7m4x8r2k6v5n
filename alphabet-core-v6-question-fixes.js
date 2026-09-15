'use strict';

// V6.1 question-integrity hardening.
// Sound-based recognition must always have an unambiguous human-audio cue.
// Visual contrast must name the visual target explicitly, and every choice list
// must contain the correct answer exactly once.
function v61UniqueOptions(task,rng=Math.random,{min=0}={}){
  if(!task||!Array.isArray(task.options))return task;
  const unique=uniq(task.options.filter(x=>x!==undefined&&x!==null&&String(x)!==''));
  if(task.correct!==undefined&&task.correct!==null&&!unique.includes(task.correct))unique.unshift(task.correct);
  if(min>0&&ALPHABET.includes(task.correct)){
    for(const c of shuffle(ALPHABET.filter(c=>c!==task.correct&&!unique.includes(c)),rng)){
      if(unique.length>=min)break;
      unique.push(c)
    }
  }
  task.options=shuffle(unique.slice(0,min>0?Math.max(min,unique.length):unique.length),rng);
  if(min>0&&task.options.length>min)task.options=task.options.slice(0,min);
  return task
}

function v61RequireHumanLetterAudio(task,letter){
  const target=task?.letter||letter;
  if(!task||!target||target==='Ь')return task;
  task.requiresHumanAudio=true;
  task.humanAudioRequired=true;
  task.requiresHumanLetterAudio=true;
  task.letterAudioAvailable=true;
  task.audioKind='letter';
  task.audioStimulusLetter=target;
  task.audioStimulusId=`letter-${target}`;
  delete task.audioWord;
  delete task.audioIndex;
  task.display=task.family==='sound-contrast'&&task.confusionTarget?`${target} · ${task.confusionTarget}`:'';
  return task
}

function v61SoftSignContext(task){
  if(!task||task.letter!=='Ь')return task;
  task.letterAudioAvailable=false;
  task.requiresHumanLetterAudio=false;
  task.softSignContextual=true;
  if(task.type==='audio'){
    task.requiresHumanAudio=true;
    task.humanAudioRequired=true;
    task.audioKind='word-context';
    task.audioStimulusId='human-context-Ь';
    task.prompt='Höre die menschliche Originalaufnahme im Wortkontext. Welches Zeichen macht den Konsonanten weich?'
  }else{
    task.requiresHumanAudio=false;
    task.humanAudioRequired=false;
    task.audioKind='context-only';
    task.display=DATA.Ь.sound;
    task.prompt='Ь hat keinen eigenen isolierten Laut. Welches Zeichen ist das ukrainische Weichheitszeichen?'
  }
  return task
}

const makeTaskQuestionCueBase=makeTask;
makeTask=function(letter,type,state,rng=Math.random,meta={}){
  const task=makeTaskQuestionCueBase(letter,type,state,rng,meta),target=task.letter||letter;
  if(type==='reverse'||task.type==='reverse'){
    if(target==='Ь')v61SoftSignContext(task);
    else{
      task.prompt='Höre die menschliche Originalaufnahme. Welches ukrainische Zeichen hörst du?';
      v61RequireHumanLetterAudio(task,target)
    }
  }
  if(type==='audio'||task.type==='audio'){
    if(target==='Ь')v61SoftSignContext(task);
    else{
      task.prompt='Höre die menschliche Originalaufnahme. Welches Zeichen hörst du?';
      v61RequireHumanLetterAudio(task,target)
    }
  }
  return v61UniqueOptions(task,rng)
};

const variantizeTaskQuestionCueBase=variantizeTask;
variantizeTask=function(base,index,scope,rng=Math.random,state=null){
  const task=variantizeTaskQuestionCueBase(base,index,scope,rng,state),target=task?.letter;
  if(task?.variant==='sound-contrast'){
    task.prompt='Höre die menschliche Originalaufnahme. Welcher der ähnlichen Buchstaben passt?';
    if(target==='Ь')v61SoftSignContext(task);else v61RequireHumanLetterAudio(task,target);
    v61UniqueOptions(task,rng)
  }
  return task
};

const buildV4TaskQuestionCueBase=buildV4Task;
buildV4Task=function(state,letter,skill,difficulty,family,session,rng=Math.random,meta={}){
  const task=buildV4TaskQuestionCueBase(state,letter,skill,difficulty,family,session,rng,meta),target=task.letter||letter;
  if(family==='sound-to-letter'){
    if(target==='Ь')v61SoftSignContext(task);
    else{
      task.prompt='Höre die menschliche Originalaufnahme. Welches ukrainische Zeichen hörst du?';
      v61RequireHumanLetterAudio(task,target)
    }
  }
  if(family==='sound-contrast'){
    if(target==='Ь')v61SoftSignContext(task);
    else{
      task.prompt='Höre die menschliche Originalaufnahme. Welcher der ähnlichen Buchstaben passt?';
      v61RequireHumanLetterAudio(task,target)
    }
    v61UniqueOptions(task,rng)
  }
  if(family==='audio-to-letter'){
    if(target==='Ь')v61SoftSignContext(task);
    else{
      task.prompt='Höre die menschliche Originalaufnahme. Welches Zeichen hörst du?';
      v61RequireHumanLetterAudio(task,target)
    }
    v61UniqueOptions(task,rng)
  }
  if(family==='visual-contrast'){
    const conf=task.confusionTarget||task.options?.find(c=>c!==target)||'';
    task.display=conf?`${target} · ${conf}`:target;
    task.prompt=`Zielzeichen: ${target}. Welches der ähnlichen Zeichen ist exakt ${target}?`;
    v61UniqueOptions(task,rng,{min:4})
  }
  return task
};
