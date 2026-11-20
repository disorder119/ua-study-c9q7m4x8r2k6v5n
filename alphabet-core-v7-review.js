'use strict';

// Alphabet Lab V7.1 · Verteiltes Wiederholen (Auffrischen)
//
// Einmal Gelerntes verfällt, wenn es nicht wieder abgerufen wird – und es hält
// am längsten, wenn die Abrufe über Tage verteilt sind statt gehäuft
// (Cepeda et al. 2006). Am wirksamsten ist die Kombination: abrufen, bis es
// einmal sitzt, und das in mehreren Sitzungen mit wachsendem Abstand
// wiederholen („successive relearning“, Rawson & Dunlosky 2011).
//
// Umsetzung als Fächersystem (Leitner 1972) je Buchstabe:
//   richtig  → ein Fach weiter, nächste Fälligkeit nach 1, 3, 7, 14, 30, 60 Tagen
//   falsch   → zurück in Fach 1, morgen wieder
// Ein Fehler in einer Lektion oder im Lesetraining wirft den Buchstaben
// ebenfalls zurück. Gerechnet wird in lokalen Kalendertagen: Wer abends lernt,
// ist am nächsten Morgen fällig, nicht erst nach 24 Stunden.

const PATH_SRS_INTERVALS=[0,1,3,7,14,30,60];
const PATH_SRS_MAX_BOX=PATH_SRS_INTERVALS.length-1;
// Ab diesem Fach gilt ein Buchstabe als gefestigt (mindestens drei richtige
// Abrufe an drei verschiedenen Tagen, über mehr als eine Woche verteilt).
const PATH_SRS_SECURE_BOX=4;
const PATH_REVIEW_LIMIT=12;

function pathDay(now=Date.now()){return Math.floor((now-new Date(now).getTimezoneOffset()*MIN)/DAY)}
function pathSrsNormalize(raw){
  const out={};
  if(!raw||typeof raw!=='object')return out;
  for(const [letter,row] of Object.entries(raw)){
    if(!ALPHABET.includes(letter)||!row||typeof row!=='object')continue;
    out[letter]={box:Math.min(PATH_SRS_MAX_BOX,Math.max(1,Math.round(Number(row.box)||1))),due:Math.round(Number(row.due)||0),lapses:Math.max(0,Math.round(Number(row.lapses)||0)),reviews:Math.max(0,Math.round(Number(row.reviews)||0))};
  }
  return out;
}
// Jeder eingeführte Buchstabe hat ein Fach. Fortschritt aus der Zeit vor dem
// Wiederholungsplan wird damit sofort fällig – der sicherste Startpunkt.
function pathSrsEnsure(progress,now=Date.now()){
  const day=pathDay(now),srs=progress.srs||(progress.srs={});
  let changed=false;
  for(const letter of pathKnownLetters(progress))if(!srs[letter]){srs[letter]={box:1,due:day,lapses:0,reviews:0};changed=true}
  return changed;
}
function pathSrsApply(progress,run,results,now=Date.now()){
  const day=pathDay(now),srs=progress.srs||(progress.srs={});
  for(const result of results||[]){
    const step=result.step;
    if(!step||step.ungraded||step.retry||step.type==='teach')continue;
    const letter=step.srsLetter||(step.word?'':step.letter);
    const row=letter?srs[letter]:null;
    if(!row)continue;
    if(run?.kind==='review'&&step.srsLetter){
      if(result.good)row.box=Math.min(PATH_SRS_MAX_BOX,row.box+1);else{row.box=1;row.lapses++}
      row.reviews++;row.due=day+PATH_SRS_INTERVALS[row.box];
    }else if(!result.good&&row.box>1){
      // Fehler außerhalb der Auffrischung: Der Buchstabe sitzt offenbar noch nicht.
      row.box=1;row.lapses++;row.due=day+PATH_SRS_INTERVALS[1];
    }
  }
  if((run?.kind==='lesson'||pathCheckPassed(run,results))&&PATH_LESSONS[run.index]){
    for(const letter of PATH_LESSONS[run.index].letters)if(!srs[letter])srs[letter]={box:1,due:day+PATH_SRS_INTERVALS[1],lapses:0,reviews:0};
  }
  return progress;
}
function pathDueLetters(progress,now=Date.now(),offsetDays=0){
  const day=pathDay(now)+offsetDays,srs=progress?.srs||{};
  return pathKnownLetters(progress).filter(letter=>srs[letter]&&srs[letter].due<=day).sort((a,b)=>srs[a].due-srs[b].due||srs[a].box-srs[b].box);
}
function pathSrsSummary(progress,now=Date.now()){
  const srs=progress?.srs||{},known=pathKnownLetters(progress).filter(letter=>srs[letter]);
  const day=pathDay(now),upcoming=known.map(letter=>srs[letter].due).filter(due=>due>day);
  return {
    tracked:known.length,
    due:pathDueLetters(progress,now).length,
    tomorrow:pathDueLetters(progress,now,1).length,
    secure:known.filter(letter=>srs[letter].box>=PATH_SRS_SECURE_BOX).length,
    // Tage bis zur nächsten Fälligkeit; 0 = heute, null = nichts geplant.
    nextInDays:known.some(letter=>srs[letter].due<=day)?0:upcoming.length?Math.min(...upcoming)-day:null
  };
}

// Ähnliches direkt hintereinander: Verwechslungspartner werden nebeneinander
// abgefragt, damit der Unterschied sichtbar wird (Kornell & Bjork 2008;
// Carvalho & Goldstone 2014).
function pathInterleave(letters,rng){
  const rest=shuffle(letters,rng),out=[];
  while(rest.length){
    const letter=rest.shift();out.push(letter);
    const lower=DATA[letter].lower,swap=PATH_SWAP[lower]?pathUpper(PATH_SWAP[lower]):'';
    const partners=uniq([swap,...(LETTER_PEDAGOGY[letter]?.confusions||[]),...(SOUND_GROUPS[letter]||[])]);
    const at=rest.findIndex(candidate=>partners.includes(candidate));
    if(at>=0)out.push(rest.splice(at,1)[0]);
  }
  return out;
}

// Auffrischung: ein Abruf je fälligem Buchstaben. Je höher das Fach, desto
// weniger Hilfe – von der Auswahl über das Hören bis zum freien Tippen eines
// noch nie gelesenen Wortes und zum Schreiben aus dem Gedächtnis.
function buildPathReview(progress,rng=Math.random,now=Date.now(),limit=PATH_REVIEW_LIMIT){
  const due=pathDueLetters(progress,now).slice(0,limit);
  if(!due.length)return null;
  const highest=pathHighestDoneIndex(progress),known=pathLettersUpTo(highest),pool=PATH_WORDS.filter(word=>word.lesson<=highest&&pathUsable(word)),steps=[],usedWords=new Set();
  // Mit eingerichteter Tastatur kommen Tippen und Diktat als Abrufformen dazu.
  const keyboard=progress?.keyboard===true;
  const forms=keyboard
    ?[null,['sound','listen','letter'],['listen','kbdletter','word'],['word','write','dictate','kbdletter']]
    :[null,['sound','listen','letter'],['listen','letter','word'],['word','write','listen']];
  pathInterleave(due,rng).forEach(letter=>{
    const row=progress.srs[letter],menu=forms[Math.min(3,row.box)];
    let step=null;
    for(let offset=0;offset<menu.length&&!step;offset++){
      const form=menu[(row.reviews+row.lapses+offset)%menu.length];
      if(form==='sound')step=pathStepSound(letter,known,rng);
      else if(form==='letter')step=pathStepLetter(letter,known,rng);
      else if(form==='listen')step=pathStepListen(letter,known,rng);
      else if(form==='write')step=pathStepWrite(letter,known,rng);
      else if(form==='kbdletter')step=pathStepKbdLetter(letter,known,rng);
      else if(form==='dictate')step=pathStepDictate(letter,known,rng);
      else if(form==='word'){
        const word=pathPickFresh(pool.filter(candidate=>candidate.letters.includes(letter)&&!usedWords.has(candidate.w)),progress,rng,1)[0];
        step=word?pathStepType(word):null;
        if(step)usedWords.add(word.w);
      }
      if(step&&steps.some(existing=>existing.id===step.id))step=null;
    }
    if(!step)step=pathStepLetter(letter,known,rng);
    step.srsLetter=letter;
    // Auch jeder Ersatzabruf (ohne Ton, ohne Tastatur) zählt für denselben Buchstaben.
    for(let alternative=step.fallback;alternative;alternative=alternative.fallback)alternative.srsLetter=letter;
    steps.push(step);
  });
  return {kind:'review',index:highest,lessonId:'',steps};
}

const LEARNING_PATH_API=!PATH_AVAILABLE?null:Object.freeze({
  VERSION:PATH_VERSION,LESSONS:PATH_LESSONS,LETTER_INFO:PATH_LETTER_INFO,WORDS:PATH_WORDS,
  lettersUpTo:pathLettersUpTo,freshProgress:pathFreshProgress,normalizeProgress:pathNormalizeProgress,
  doneCount:pathDoneCount,nextLessonIndex:pathNextLessonIndex,highestDoneIndex:pathHighestDoneIndex,knownLetters:pathKnownLetters,wordsRead:pathWordsRead,freshWords:pathFreshWords,FRESH_MINIMUM:PATH_FRESH_MINIMUM,
  translit:pathTranslit,typeMatch:pathTypeMatch,typePrimary:pathTypePrimary,isCorrect:pathIsCorrect,needsTrace:letter=>!PATH_FAMILIAR_SHAPES.has(letter),
  buildLesson:buildPathLesson,buildPractice:buildPathPractice,buildCheck:buildPathCheck,checkPassed:pathCheckPassed,retryStep:pathRetryStep,applyResult:pathApplyResult,
  SRS_INTERVALS:PATH_SRS_INTERVALS,SRS_SECURE_BOX:PATH_SRS_SECURE_BOX,REVIEW_LIMIT:PATH_REVIEW_LIMIT,day:pathDay,ensureSchedule:pathSrsEnsure,dueLetters:pathDueLetters,srsSummary:pathSrsSummary,buildReview:buildPathReview,
  KBD_LAYOUT:PATH_KBD_LAYOUT,kbdMatch:pathKbdMatch,kbdDiagnose:pathKbdDiagnose,kbdWordOk:pathKbdWordOk,buildTyping:buildPathTyping
});
// Eigener Name statt AlphabetCoreV2.LearningPath: Der Lernpfad wird als eigenes
// Bundle nach dem Core geladen.
globalThis.AlphabetLearningPath=LEARNING_PATH_API;
