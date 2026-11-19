'use strict';

// Alphabet Lab V7 · Lernpfad
//
// Die adaptive Engine prüft, aber sie unterrichtet nicht: Die erste Frage an
// einen Anfänger war ein Test über ein Zeichen, das ihm niemand gezeigt hatte,
// und selbst nach hunderten Fragen gab es nichts zu LESEN. Der Lernpfad dreht
// die Reihenfolge um:
//
//   zeigen → sofort ausprobieren → echte Wörter entziffern → fertig (≈ 5 Min.)
//
// Drei Regeln, die tests/validate-alphabet-lab-v7-path.mjs absichert:
//   1. Lesbarkeit: Ein Wort erscheint erst, wenn JEDER seiner Buchstaben
//      eingeführt ist. Die Lektion eines Wortes wird aus seinen Buchstaben
//      berechnet, nie von Hand gesetzt.
//   2. Keine Wiederholung: Innerhalb eines Durchgangs kommt kein Schritt
//      zweimal vor; alte Buchstaben werden über NEUE Wörter wiederholt.
//   3. Jeder Auswahlschritt hat genau eine richtige, eindeutig belegbare Antwort.
//
// Die Wörter sind fast durchweg Internationalismen (ресторан, таксі, шоколад).
// Wer sie entziffert, versteht sie – das ist der Lohn, der bisher fehlte.

const PATH_VERSION=1;

// Die Daten (Lektionen, Lautangaben, Wörter) liegen in alphabet-path-data.js.
// Fehlen sie, gibt es keinen Lernpfad – die übrige App läuft unverändert weiter.
const PATH_DATA=globalThis.ALPHABET_PATH_DATA||null;
const PATH_LESSONS=Array.isArray(PATH_DATA?.lessons)?PATH_DATA.lessons:[];
const PATH_LETTER_INFO=PATH_DATA?.letterInfo||{};
const PATH_WORD_ROWS=Array.isArray(PATH_DATA?.wordRows)?PATH_DATA.wordRows:[];
const PATH_AVAILABLE=PATH_LESSONS.length>0&&ALPHABET.every(letter=>PATH_LETTER_INFO[letter]?.say)&&PATH_WORD_ROWS.length>0;

const PATH_LETTER_LESSON=new Map();
PATH_LESSONS.forEach((lesson,index)=>lesson.letters.forEach(letter=>PATH_LETTER_LESSON.set(letter,index)));

const pathUpper=ch=>String(ch).toLocaleUpperCase('uk');
const pathLower=word=>String(word).toLocaleLowerCase('uk');
const pathChars=word=>[...pathLower(word)];
const pathWordLetters=word=>uniq(pathChars(word).map(pathUpper).filter(ch=>ALPHABET.includes(ch)));

// Deutsche Lesehilfe. Wörter mit з, ж, ь oder Apostroph bekommen keine
// Ausspracheaufgabe: ihre Umschrift wäre für deutsche Leser mehrdeutig.
const PATH_TRANSLIT={'а':'a','б':'b','в':'w','г':'h','ґ':'g','д':'d','е':'e','є':'je','и':'y','і':'i','ї':'ji','й':'j','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'r','с':'s','т':'t','у':'u','ф':'f','х':'ch','ц':'z','ч':'tsch','ш':'sch','щ':'schtsch','ю':'ju','я':'ja'};
// So liest ein Deutscher das Zeichen, wenn er auf die lateinische Form hereinfällt.
const PATH_LOOKALIKE={'н':'h','р':'p','с':'c','в':'b','у':'y','х':'x'};
// Echte Verwechslungspartner innerhalb der Kyrilliza.
const PATH_SWAP={'и':'і','і':'и','г':'ґ','ґ':'г','ш':'щ','щ':'ш','ц':'ч','ч':'ц','б':'в','е':'є','є':'е','ю':'я','я':'ю','ї':'і','й':'і'};
const pathSayable=word=>pathChars(word).every(ch=>PATH_TRANSLIT[ch]!==undefined);
function pathTranslit(word,override=null){return pathChars(word).map(ch=>(override&&override[ch]!==undefined?override[ch]:PATH_TRANSLIT[ch])??'').join('')}

const PATH_WORDS=PATH_WORD_ROWS.map(([w,de,flag])=>{
  const letters=pathWordLetters(w);
  const lesson=Math.max(...letters.map(letter=>PATH_LETTER_LESSON.get(letter)));
  const plain=pathChars(w).every(ch=>ALPHABET.includes(pathUpper(ch)));
  return {w,de,cog:flag!=='x',lesson,letters,sayable:pathSayable(w),buildable:plain&&w===pathLower(w)&&[...w].length>=3&&[...w].length<=8};
});
const PATH_WORD_BY_TEXT=new Map(PATH_WORDS.map(word=>[word.w,word]));
// Ein Wort ohne erschließbare Bedeutung UND ohne eindeutige Lesehilfe (ґудзик)
// taugt nur als Beispiel auf der Lernkarte, nicht als Aufgabe.
const pathUsable=word=>word.cog||(word.sayable&&pathSayDistractors(word,()=>.5).length>=2);

function pathLettersUpTo(index){return PATH_LESSONS.slice(0,Math.max(0,index+1)).flatMap(lesson=>lesson.letters)}
// advancedOpen: null = noch nie entschieden, sonst die Wahl des Nutzers.
function pathFreshProgress(){return {v:PATH_VERSION,done:{},words:{},letters:{},sound:true,practiceRuns:0,advancedOpen:null}}
function pathNormalizeProgress(raw){
  const fresh=pathFreshProgress();
  if(!raw||typeof raw!=='object')return fresh;
  const out=fresh;
  for(const lesson of PATH_LESSONS){const row=raw.done?.[lesson.id];if(row&&typeof row==='object')out.done[lesson.id]={at:Number(row.at)||0,runs:Math.max(1,Number(row.runs)||1)}}
  for(const [text,row] of Object.entries(raw.words||{})){if(!PATH_WORD_BY_TEXT.has(text)||!row)continue;out.words[text]={seen:Math.max(0,Number(row.seen)||0),ok:Math.max(0,Number(row.ok)||0),last:Number(row.last)||0,type:typeof row.type==='string'?row.type:''}}
  for(const [letter,row] of Object.entries(raw.letters||{})){if(!ALPHABET.includes(letter)||!row)continue;out.letters[letter]={ok:Math.max(0,Number(row.ok)||0),bad:Math.max(0,Number(row.bad)||0)}}
  out.sound=raw.sound!==false;
  out.practiceRuns=Math.max(0,Number(raw.practiceRuns)||0);
  out.advancedOpen=raw.advancedOpen===true?true:raw.advancedOpen===false?false:null;
  return out;
}
function pathDoneCount(progress){return PATH_LESSONS.filter(lesson=>progress?.done?.[lesson.id]).length}
// Lektionen bauen aufeinander auf: Die nächste ist die erste noch offene.
function pathNextLessonIndex(progress){const index=PATH_LESSONS.findIndex(lesson=>!progress?.done?.[lesson.id]);return index}
function pathHighestDoneIndex(progress){let highest=-1;PATH_LESSONS.forEach((lesson,index)=>{if(progress?.done?.[lesson.id]&&index===highest+1)highest=index});return highest}
function pathKnownLetters(progress){return pathLettersUpTo(pathHighestDoneIndex(progress))}
function pathWordsRead(progress){return PATH_WORDS.filter(word=>(progress?.words?.[word.w]?.ok||0)>0)}
function pathSeen(progress,word){return Number(progress?.words?.[word.w]?.seen)||0}

function pathPickFresh(pool,progress,rng,count){
  // Unbekannte Wörter zuerst, danach die am längsten nicht gelesenen; bei
  // Gleichstand zufällig.
  const last=word=>Number(progress?.words?.[word.w]?.last)||0;
  return shuffle(pool,rng).sort((a,b)=>pathSeen(progress,a)-pathSeen(progress,b)||last(a)-last(b)).slice(0,count);
}
// Wie viele Wörter mit den schon eingeführten Buchstaben noch nie dran waren.
const PATH_FRESH_MINIMUM=4;
function pathFreshWords(progress){
  const highest=pathHighestDoneIndex(progress);
  return highest<0?[]:PATH_WORDS.filter(word=>word.lesson<=highest&&pathUsable(word)&&pathSeen(progress,word)===0);
}
function pathBreakdown(word){return pathChars(word.w).map(ch=>{const letter=pathUpper(ch);return {ch,say:ALPHABET.includes(letter)?PATH_LETTER_INFO[letter].say:''}})}

function pathLetterDistractors(letter,known,rng,count){
  const near=uniq([...(LETTER_PEDAGOGY[letter]?.confusions||[]),...(SOUND_GROUPS[letter]||[])]).filter(c=>known.includes(c)&&c!==letter);
  // Nur bereits gezeigte Zeichen: Ein Distraktor, den noch niemand erklärt hat,
  // wäre eine unfaire Frage.
  const sameLesson=PATH_LESSONS[PATH_LETTER_LESSON.get(letter)].letters.filter(c=>c!==letter&&known.includes(c));
  return uniq([...shuffle(near,rng),...shuffle(sameLesson,rng),...shuffle(known.filter(c=>c!==letter),rng)]).slice(0,count);
}

function pathStepTeach(letter,index,known,taught,position,total){
  const info=PATH_LETTER_INFO[letter];
  const candidates=PATH_WORDS.filter(word=>word.letters.includes(letter)&&word.lesson<=index);
  // Beispielwort mit möglichst wenigen noch nicht gezeigten Buchstaben.
  const example=candidates.slice().sort((a,b)=>a.letters.filter(c=>!taught.has(c)&&c!==letter).length-b.letters.filter(c=>!taught.has(c)&&c!==letter).length||[...a.w].length-[...b.w].length)[0]||null;
  return {id:`teach:${letter}`,type:'teach',letter,lower:DATA[letter].lower,say:info.say,hint:info.hint,example:example?{w:example.w,de:example.de}:null,position,total};
}
function pathStepSound(letter,known,rng){
  const options=shuffle([letter,...pathLetterDistractors(letter,known,rng,3)],rng).map(c=>PATH_LETTER_INFO[c].say);
  return {id:`sound:${letter}`,type:'sound',letter,display:`${letter} ${DATA[letter].lower}`,prompt:'Wie klingt dieser Buchstabe?',options,correct:PATH_LETTER_INFO[letter].say,explain:`${letter} klingt wie „${PATH_LETTER_INFO[letter].say}“. ${PATH_LETTER_INFO[letter].hint}`};
}
function pathStepLetter(letter,known,rng){
  const options=shuffle([letter,...pathLetterDistractors(letter,known,rng,3)],rng);
  const cue=letter==='Ь'?'Welches Zeichen hat keinen eigenen Laut und macht den Konsonanten davor weich?':`Welcher Buchstabe klingt wie „${PATH_LETTER_INFO[letter].say}“?`;
  return {id:`letter:${letter}`,type:'letter',letter,prompt:cue,options,correct:letter,explain:`${letter} klingt wie „${PATH_LETTER_INFO[letter].say}“. ${PATH_LETTER_INFO[letter].hint}`};
}

function pathMeaningDistractors(word,pool,rng,count){
  const first=pathChars(word.w)[0],length=[...word.w].length;
  const scored=shuffle(pool.filter(other=>other.cog&&other.w!==word.w&&other.de!==word.de),rng)
    .map(other=>({other,score:(pathChars(other.w)[0]===first?2:0)+(Math.abs([...other.w].length-length)<=1?1:0)}))
    .sort((a,b)=>b.score-a.score);
  return uniq(scored.map(row=>row.other.de)).slice(0,count);
}
function pathStepRead(word,pool,rng){
  const options=shuffle([word.de,...pathMeaningDistractors(word,pool,rng,3)],rng);
  return {id:`read:${word.w}`,type:'read',word:word.w,display:word.w,prompt:'Lies das Wort. Was heißt es?',options,correct:word.de,meaning:word.de,breakdown:pathBreakdown(word)};
}
function pathStepFind(word,pool,rng){
  const length=[...word.w].length;
  const others=shuffle(pool.filter(other=>other.w!==word.w&&other.de!==word.de),rng).sort((a,b)=>Math.abs([...a.w].length-length)-Math.abs([...b.w].length-length)).slice(0,3).map(other=>other.w);
  return {id:`find:${word.w}`,type:'find',word:word.w,prompt:`Welches Wort heißt „${word.de}“?`,options:shuffle([word.w,...others],rng),correct:word.w,meaning:word.de,breakdown:pathBreakdown(word)};
}
function pathSayDistractors(word,rng){
  const chars=uniq(pathChars(word.w)),correct=pathTranslit(word.w),variants=[];
  const traps=chars.filter(ch=>PATH_LOOKALIKE[ch]);
  if(traps.length>1)variants.push(pathTranslit(word.w,Object.fromEntries(traps.map(ch=>[ch,PATH_LOOKALIKE[ch]]))));
  for(const ch of shuffle(traps,rng))variants.push(pathTranslit(word.w,{[ch]:PATH_LOOKALIKE[ch]}));
  for(const ch of shuffle(chars.filter(c=>PATH_SWAP[c]&&PATH_TRANSLIT[PATH_SWAP[c]]),rng))variants.push(pathTranslit(word.w,{[ch]:PATH_TRANSLIT[PATH_SWAP[ch]]}));
  return uniq(variants).filter(text=>text&&text!==correct).slice(0,3);
}
function pathStepSay(word,rng){
  const distractors=pathSayDistractors(word,rng);
  if(!word.sayable||distractors.length<2)return null;
  const correct=pathTranslit(word.w);
  return {id:`say:${word.w}`,type:'say',word:word.w,display:word.w,prompt:'Wie spricht man das aus?',options:shuffle([correct,...distractors],rng),correct,meaning:word.de,breakdown:pathBreakdown(word)};
}
function pathStepBuild(word,known,rng){
  if(!word.buildable)return null;
  const answer=pathChars(word.w);
  const decoys=shuffle(known.map(c=>DATA[c].lower).filter(ch=>!answer.includes(ch)),rng).slice(0,2);
  return {id:`build:${word.w}`,type:'build',word:word.w,prompt:`Schreibe „${word.de}“ auf Ukrainisch.`,tiles:shuffle([...answer,...decoys],rng),answer,correct:word.w,meaning:word.de,breakdown:pathBreakdown(word)};
}
// Wortschritt in der gewünschten Form, sonst in der nächsten möglichen.
function pathWordStep(word,type,ctx,rng){
  const order=uniq([type,'read','say','find','build']);
  for(const kind of order){
    let step=null;
    if(kind==='read'&&word.cog)step=pathStepRead(word,ctx.pool,rng);
    else if(kind==='find'&&word.cog&&ctx.pool.length>=4)step=pathStepFind(word,ctx.pool,rng);
    else if(kind==='say')step=pathStepSay(word,rng);
    else if(kind==='build'&&word.cog)step=pathStepBuild(word,ctx.known,rng);
    if(step)return step;
  }
  return null;
}

const PATH_WORD_ROTATION=['read','say','read','find','read','build'];

function buildPathLesson(index,progress,rng=Math.random){
  const lesson=PATH_LESSONS[index];
  if(!lesson)return null;
  const known=pathLettersUpTo(index),steps=[],usedWords=new Set();
  const pool=PATH_WORDS.filter(word=>word.lesson<=index&&pathUsable(word));
  const ctx={pool,known};
  const push=step=>{if(step&&!steps.some(existing=>existing.id===step.id)){steps.push(step);if(step.word)usedWords.add(step.word)}};

  // 1 · Aufwärmen mit NEUEN Wörtern aus alten Buchstaben.
  if(index>0)for(const word of pathPickFresh(pool.filter(w=>w.lesson<index&&w.cog),progress,rng,2))push(pathStepRead(word,pool,rng));

  // 2 · Zeigen, dann sofort ausprobieren.
  const taught=new Set(pathLettersUpTo(index-1));
  lesson.letters.forEach((letter,i)=>{
    push(pathStepTeach(letter,index,known,taught,i+1,lesson.letters.length));
    taught.add(letter);
    const shown=known.filter(c=>taught.has(c));
    if(!lesson.light||i%3===2)push(pathStepSound(letter,shown,rng));
    if(!lesson.light&&i%2===1)push(pathStepLetter(lesson.letters[i-1],shown,rng));
  });
  if(lesson.light)push(pathStepLetter(lesson.letters[lesson.letters.length-1],known,rng));

  // 3 · Wörter lesen: jeder neue Buchstabe kommt mindestens einmal vor.
  const own=pool.filter(word=>word.lesson===index&&!usedWords.has(word.w));
  const picked=[];
  for(const letter of lesson.letters){
    if(picked.some(word=>word.letters.includes(letter)))continue;
    const candidate=pathPickFresh(own.filter(word=>word.letters.includes(letter)&&!picked.includes(word)),progress,rng,1)[0];
    if(candidate)picked.push(candidate);
  }
  for(const word of pathPickFresh(own.filter(word=>!picked.includes(word)),progress,rng,Math.max(0,6-picked.length)))picked.push(word);
  shuffle(picked,rng).forEach((word,i)=>push(pathWordStep(word,PATH_WORD_ROTATION[i%PATH_WORD_ROTATION.length],ctx,rng)));

  // 4 · Ein letztes altes Wort in neuer Aufgabenform.
  if(index>0){const older=pathPickFresh(pool.filter(w=>w.lesson<index&&w.cog&&!usedWords.has(w.w)),progress,rng,1)[0];if(older)push(pathWordStep(older,'find',ctx,rng))}
  return {kind:'lesson',index,lessonId:lesson.id,steps};
}

function buildPathPractice(progress,rng=Math.random,size=10){
  const highest=pathHighestDoneIndex(progress);
  if(highest<0)return null;
  const known=pathLettersUpTo(highest),pool=PATH_WORDS.filter(word=>word.lesson<=highest&&pathUsable(word)),ctx={pool,known},steps=[];
  const push=step=>{if(step&&!steps.some(existing=>existing.id===step.id))steps.push(step)};
  // Schwächste Buchstaben zuerst – gemessen an echten Fehlern im Pfad.
  const weak=shuffle(known,rng).sort((a,b)=>((progress.letters?.[b]?.bad||0)-(progress.letters?.[b]?.ok||0))-((progress.letters?.[a]?.bad||0)-(progress.letters?.[a]?.ok||0))).slice(0,2);
  // Solange es ungelesene Wörter gibt, besteht das Training NUR aus ihnen – lieber
  // eine kürzere Runde als eine heimliche Wiederholung. Erst wenn praktisch
  // nichts Neues mehr da ist, wird es eine ausgewiesene Wiederholung: die am
  // längsten nicht gelesenen Wörter, jedes in anderer Aufgabenform als zuletzt.
  const fresh=pathFreshWords(progress),review=fresh.length<PATH_FRESH_MINIMUM;
  const words=pathPickFresh(review?pool:fresh,progress,rng,size+4);
  let rotation=0;
  for(const word of words){
    if(steps.length>=size-weak.length)break;
    // Nie dieselbe Aufgabenform wie beim letzten Mal für dieses Wort.
    let type=PATH_WORD_ROTATION[rotation++%PATH_WORD_ROTATION.length];
    if(type===progress.words?.[word.w]?.type)type=PATH_WORD_ROTATION[rotation++%PATH_WORD_ROTATION.length];
    push(pathWordStep(word,type,ctx,rng));
  }
  weak.forEach((letter,i)=>{const step=i%2?pathStepLetter(letter,known,rng):pathStepSound(letter,known,rng);steps.splice(Math.min(steps.length,2+i*3),0,step)});
  return {kind:'practice',index:highest,lessonId:'',steps,review};
}

// Kurztest für Lernende mit Vorwissen: keine Lernkarten, keine Wiederholung.
// Jeder Buchstabe der Lektion wird einmal einzeln und danach in drei Wörtern
// geprüft. Höchstens ein Fehler – sonst wäre Überspringen ein Geschenk, das
// sich in den späteren Lektionen rächt.
const PATH_CHECK_ALLOWED_MISTAKES=1;
function buildPathCheck(index,progress,rng=Math.random){
  const lesson=PATH_LESSONS[index];
  if(!lesson)return null;
  const known=pathLettersUpTo(index),pool=PATH_WORDS.filter(word=>word.lesson<=index&&pathUsable(word)),ctx={pool,known},steps=[];
  const push=step=>{if(step&&!steps.some(existing=>existing.id===step.id))steps.push(step)};
  shuffle(lesson.letters,rng).forEach((letter,i)=>push(i%2?pathStepLetter(letter,known,rng):pathStepSound(letter,known,rng)));
  const own=pool.filter(word=>word.lesson===index);
  pathPickFresh(own,progress,rng,3).forEach((word,i)=>push(pathWordStep(word,['say','read','find'][i],ctx,rng)));
  return {kind:'check',index,lessonId:lesson.id,steps,allowedMistakes:PATH_CHECK_ALLOWED_MISTAKES};
}
function pathCheckPassed(run,results){
  if(run?.kind!=='check')return false;
  const answered=(results||[]).filter(result=>result.step&&result.step.type!=='teach');
  return answered.length>=run.steps.length&&answered.filter(result=>!result.good).length<=(run.allowedMistakes??PATH_CHECK_ALLOWED_MISTAKES);
}

// Fehler werden Lernmaterial: derselbe Inhalt kommt später noch einmal – aber in
// einer ANDEREN Aufgabenform, damit nicht die Antwort von eben wiedererkannt wird.
function pathRetryStep(step,run,rng=Math.random){
  if(!step||step.retry||step.type==='teach')return null;
  const index=run.index,known=pathLettersUpTo(index),pool=PATH_WORDS.filter(word=>word.lesson<=index&&pathUsable(word)),ctx={pool,known};
  const taken=new Set(run.steps.map(existing=>existing.id));
  let next=null;
  if(step.type==='sound')next=pathStepLetter(step.letter,known,rng);
  else if(step.type==='letter')next=pathStepSound(step.letter,known,rng);
  else{
    const word=PATH_WORD_BY_TEXT.get(step.word);
    const alternatives={read:['say','find','build'],say:['read','find','build'],find:['read','say','build'],build:['read','say','find']}[step.type]||['read'];
    for(const kind of alternatives){const candidate=pathWordStep(word,kind,ctx,rng);if(candidate&&candidate.type!==step.type&&!taken.has(candidate.id)){next=candidate;break}}
    if(!next)next=pathWordStep(word,step.type,ctx,rng);
  }
  if(!next)return null;
  if(taken.has(next.id))next.id=`${next.id}:retry`;
  next.retry=true;
  return next;
}

function pathApplyResult(progress,run,results,now=Date.now()){
  for(const result of results||[]){
    const step=result.step;
    if(!step||step.type==='teach')continue;
    if(step.word){const row=progress.words[step.word]||(progress.words[step.word]={seen:0,ok:0,last:0,type:''});row.seen++;if(result.good)row.ok++;row.last=now;row.type=step.type}
    else if(step.letter){const row=progress.letters[step.letter]||(progress.letters[step.letter]={ok:0,bad:0});result.good?row.ok++:row.bad++}
  }
  // Ein bestandener Kurztest zählt wie die Lektion; ein nicht bestandener ändert nichts.
  if((run?.kind==='lesson'||pathCheckPassed(run,results))&&run.lessonId){const row=progress.done[run.lessonId]||(progress.done[run.lessonId]={at:now,runs:0});row.runs++;row.at=row.at||now}
  if(run?.kind==='practice')progress.practiceRuns=(Number(progress.practiceRuns)||0)+1;
  return progress;
}

const LEARNING_PATH_API=!PATH_AVAILABLE?null:Object.freeze({
  VERSION:PATH_VERSION,LESSONS:PATH_LESSONS,LETTER_INFO:PATH_LETTER_INFO,WORDS:PATH_WORDS,
  lettersUpTo:pathLettersUpTo,freshProgress:pathFreshProgress,normalizeProgress:pathNormalizeProgress,
  doneCount:pathDoneCount,nextLessonIndex:pathNextLessonIndex,highestDoneIndex:pathHighestDoneIndex,knownLetters:pathKnownLetters,wordsRead:pathWordsRead,freshWords:pathFreshWords,FRESH_MINIMUM:PATH_FRESH_MINIMUM,
  translit:pathTranslit,buildLesson:buildPathLesson,buildPractice:buildPathPractice,buildCheck:buildPathCheck,checkPassed:pathCheckPassed,retryStep:pathRetryStep,applyResult:pathApplyResult
});
