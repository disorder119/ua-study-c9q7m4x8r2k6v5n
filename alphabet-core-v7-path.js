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
// Freies Tippen der Lesung (Abruf statt Auswahl). Großzügig bei gleichwertigen
// Schreibweisen (w/v, sch/sh, ja/ya), streng bei genau den Fallen, um die es
// geht: Н ist nie „h“, Р nie „p“, С nie „c“, В nie „b“, У nie „y“, Г nie „g“.
const PATH_TYPE_ALT={'а':['a'],'б':['b'],'в':['w','v'],'г':['h'],'ґ':['g'],'д':['d'],'е':['e'],'є':['je','ye','ie'],'ж':['sch','zh','sh','j'],'з':['s','z'],'и':['y','i'],'і':['i'],'ї':['ji','yi','i'],'й':['j','y','i'],'к':['k'],'л':['l'],'м':['m'],'н':['n'],'о':['o'],'п':['p'],'р':['r'],'с':['s','ss'],'т':['t'],'у':['u'],'ф':['f'],'х':['ch','kh'],'ц':['z','ts','tz'],'ч':['tsch','ch','tch'],'ш':['sch','sh'],'щ':['schtsch','shch','schch','stsch'],'ь':['','j'],'ю':['ju','yu','iu'],'я':['ja','ya','ia'],'’':['']};
const pathTypeable=word=>pathChars(word).every(ch=>PATH_TYPE_ALT[ch]!==undefined);
function pathTypePrimary(word){return pathChars(word).map(ch=>PATH_TYPE_ALT[ch]?.[0]??'').join('')}
function pathTypeNormalize(input){return String(input??'').toLowerCase().replace(/ß/g,'ss').replace(/[^a-z]/g,'')}
function pathTypeMatch(word,input){
  if(!pathTypeable(word))return false;
  const typed=pathTypeNormalize(input);
  if(!typed)return false;
  return new RegExp(`^${pathChars(word).map(ch=>`(?:${PATH_TYPE_ALT[ch].join('|')})`).join('')}$`).test(typed);
}
// Schreiben mit der ukrainischen Tastatur des Geräts: der anspruchsvollste Abruf,
// weil Form, Laut UND Tastenlage gebraucht werden. Nur wenn die Tastatur
// eingerichtet ist (progress.keyboard === true); jeder Schritt hat einen Ersatz ohne.
const PATH_KBD_LAYOUT=['йцукенгшщзхї','фівапролджє','ячсмитьбю'];
function pathKbdNormalize(input){return String(input??'').normalize('NFC').trim().toLocaleLowerCase('uk').replace(/[ʼ‘'`]/g,'’').replace(/\s+/g,'')}
// Woran eine Eingabe scheitert, bevor sie überhaupt bewertet wird: an der
// lateinischen Tastatur oder an der russischen (ы э ё ъ gibt es im Ukrainischen nicht).
function pathKbdDiagnose(input){
  const text=pathKbdNormalize(input);
  if(/[a-zäöüß]/.test(text))return 'latin';
  if(/[ыэёъ]/.test(text))return 'russian';
  return '';
}
function pathKbdMatch(target,input){const typed=pathKbdNormalize(input);return !!typed&&typed===pathKbdNormalize(target)}
// Wörter mit Apostroph bleiben außen vor: Er liegt auf jeder Tastatur woanders.
const pathKbdWordOk=word=>{const chars=pathChars(word.w);return chars.length>=2&&chars.length<=10&&chars.every(ch=>ALPHABET.includes(pathUpper(ch)))};
// Zeichen, deren FORM ein Deutscher schon kennt – alle anderen werden nachgeschrieben.
const PATH_FAMILIAR_SHAPES=new Set([...'АОКМТЕНРСВУХІ']);
function pathTranslit(word,override=null){return pathChars(word).map(ch=>(override&&override[ch]!==undefined?override[ch]:PATH_TRANSLIT[ch])??'').join('')}

const PATH_WORDS=PATH_WORD_ROWS.map(([w,de,flag])=>{
  const letters=pathWordLetters(w);
  const lesson=Math.max(...letters.map(letter=>PATH_LETTER_LESSON.get(letter)));
  const plain=pathChars(w).every(ch=>ALPHABET.includes(pathUpper(ch)));
  return {w,de,cog:flag!=='x',lesson,letters,sayable:pathSayable(w),buildable:plain&&w===pathLower(w)&&[...w].length>=3&&[...w].length<=8};
});
const PATH_WORD_BY_TEXT=new Map(PATH_WORDS.map(word=>[word.w,word]));
// Jedes Wort ab zwei Buchstaben taugt als Aufgabe: Wo die Bedeutung nicht
// erschließbar ist, wird die Lesung getippt.
const pathUsable=word=>[...word.w].length>=2&&(word.cog||pathTypeable(word.w));

function pathLettersUpTo(index){return PATH_LESSONS.slice(0,Math.max(0,index+1)).flatMap(lesson=>lesson.letters)}
// advancedOpen: null = noch nie entschieden, sonst die Wahl des Nutzers.
// srs: Wiederholungsfach und Fälligkeit je Buchstabe (alphabet-core-v7-review.js).
// keyboard: null = noch nicht eingerichtet, true/false = Wahl des Nutzers.
function pathFreshProgress(){return {v:PATH_VERSION,done:{},words:{},letters:{},srs:{},sound:true,keyboard:null,practiceRuns:0,reviewRuns:0,typingRuns:0,advancedOpen:null}}
function pathNormalizeProgress(raw){
  const fresh=pathFreshProgress();
  if(!raw||typeof raw!=='object')return fresh;
  const out=fresh;
  for(const lesson of PATH_LESSONS){const row=raw.done?.[lesson.id];if(row&&typeof row==='object')out.done[lesson.id]={at:Number(row.at)||0,runs:Math.max(1,Number(row.runs)||1)}}
  for(const [text,row] of Object.entries(raw.words||{})){if(!PATH_WORD_BY_TEXT.has(text)||!row)continue;out.words[text]={seen:Math.max(0,Number(row.seen)||0),ok:Math.max(0,Number(row.ok)||0),last:Number(row.last)||0,type:typeof row.type==='string'?row.type:''}}
  for(const [letter,row] of Object.entries(raw.letters||{})){if(!ALPHABET.includes(letter)||!row)continue;out.letters[letter]={ok:Math.max(0,Number(row.ok)||0),bad:Math.max(0,Number(row.bad)||0)}}
  out.srs=pathSrsNormalize(raw.srs);
  out.sound=raw.sound!==false;
  out.practiceRuns=Math.max(0,Number(raw.practiceRuns)||0);
  out.reviewRuns=Math.max(0,Number(raw.reviewRuns)||0);
  out.typingRuns=Math.max(0,Number(raw.typingRuns)||0);
  out.keyboard=raw.keyboard===true?true:raw.keyboard===false?false:null;
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

// Vortest für die „falschen Freunde“: erst raten, dann auflösen. Zählt nicht.
function pathStepGuess(letter,known,rng){
  const trap=PATH_LOOKALIKE[DATA[letter].lower];
  if(!trap)return null;
  const say=PATH_LETTER_INFO[letter].say;
  const others=shuffle(uniq(known.filter(c=>c!==letter).map(c=>PATH_LETTER_INFO[c].say)).filter(text=>text!==say&&text!==trap),rng).slice(0,2);
  return {id:`guess:${letter}`,type:'guess',ungraded:true,letter,lower:DATA[letter].lower,prompt:'Rate mal: Wie klingt dieser Buchstabe?',options:shuffle([trap,say,...others],rng),correct:say,trap,hint:PATH_LETTER_INFO[letter].hint};
}
// Nachschreiben mit Vorlage. Zählt nicht – es prägt die Form ein.
function pathStepTrace(letter){
  if(PATH_FAMILIAR_SHAPES.has(letter))return null;
  return {id:`trace:${letter}`,type:'trace',ungraded:true,letter,lower:DATA[letter].lower,say:PATH_LETTER_INFO[letter].say};
}
// Hören: nur mit menschlicher Originalaufnahme. fallback ist derselbe Abruf ohne
// Ton – für Geräte ohne Lautsprecher, ohne Netz oder Menschen, die nicht hören.
function pathStepListen(letter,known,rng){
  if(!HUMAN_LETTER_AUDIO_LETTERS.includes(letter))return null;
  const fallback=pathStepLetter(letter,known,rng);
  return {...fallback,id:`listen:${letter}`,type:'listen',prompt:'Hör zu: Welcher Buchstabe ist das?',fallback};
}
// Aus dem Gedächtnis schreiben, danach Selbstkontrolle an der Vorlage.
function pathStepWrite(letter,known,rng){
  const say=PATH_LETTER_INFO[letter].say;
  const prompt=letter==='Ь'?'Schreibe aus dem Gedächtnis: das Weichheitszeichen.':`Schreibe aus dem Gedächtnis: den Buchstaben für „${say}“.`;
  return {id:`write:${letter}`,type:'write',letter,lower:DATA[letter].lower,say,prompt,correct:'self-good',explain:`${letter} klingt wie „${say}“. ${PATH_LETTER_INFO[letter].hint}`,fallback:pathStepLetter(letter,known,rng)};
}
function pathStepType(word){
  if(!pathTypeable(word.w)||[...word.w].length<2)return null;
  return {id:`type:${word.w}`,type:'type',word:word.w,display:word.w,prompt:'Tippe, wie man das liest.',correct:pathTypePrimary(word.w),meaning:word.de,breakdown:pathBreakdown(word)};
}
// Ein Wort mit der ukrainischen Tastatur schreiben. Ein noch nie gelesenes Wort
// wird abgetippt (Tasten finden); ein schon gelesenes aus Lesung oder Bedeutung
// geschrieben (Schreibweise abrufen).
function pathStepKbd(word,progress){
  if(!pathKbdWordOk(word))return null;
  const recall=pathSeen(progress,word)>0&&(word.sayable||word.cog);
  const reading=word.sayable?pathTranslit(word.w):'';
  return {id:`kbd:${word.w}`,type:'kbd',mode:recall?'recall':'copy',word:word.w,
    display:recall?(reading||word.de):word.w,note:recall&&reading&&word.cog?word.de:'',
    prompt:recall?'Schreibe das Wort mit der ukrainischen Tastatur.':'Tippe das Wort mit der ukrainischen Tastatur ab.',
    correct:word.w,meaning:word.de,breakdown:pathBreakdown(word),fallback:pathStepType(word)};
}
function pathStepKbdLetter(letter,known,rng){
  const say=PATH_LETTER_INFO[letter].say;
  return {id:`kbdletter:${letter}`,type:'kbdletter',letter,lower:DATA[letter].lower,prompt:letter==='Ь'?'Tippe das Weichheitszeichen.':`Tippe den Buchstaben für „${say}“.`,correct:DATA[letter].lower,explain:`${letter} klingt wie „${say}“. ${PATH_LETTER_INFO[letter].hint}`,fallback:pathStepLetter(letter,known,rng)};
}
// Diktat: Laut hören, Buchstaben tippen. Ohne Ton wird daraus die Tippaufgabe mit Lautangabe.
function pathStepDictate(letter,known,rng){
  if(!HUMAN_LETTER_AUDIO_LETTERS.includes(letter))return null;
  const base=pathStepKbdLetter(letter,known,rng);
  return {...base,id:`dictate:${letter}`,type:'dictate',prompt:'Hör zu und tippe den Buchstaben.',fallback:base};
}
// Eine Stelle für die Bewertung – getippte Lesungen haben mehrere gültige Formen.
function pathIsCorrect(step,value){
  if(!step)return false;
  if(step.type==='type')return pathTypeMatch(step.word,value);
  if(step.type==='kbd'||step.type==='kbdletter'||step.type==='dictate')return pathKbdMatch(step.correct,value);
  return value===step.correct;
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
  const order=uniq([type,'read','say','type','find','build']);
  for(const kind of order){
    let step=null;
    if(kind==='read'&&word.cog)step=pathStepRead(word,ctx.pool,rng);
    else if(kind==='find'&&word.cog&&ctx.pool.length>=4)step=pathStepFind(word,ctx.pool,rng);
    else if(kind==='say')step=pathStepSay(word,rng);
    else if(kind==='type')step=pathStepType(word);
    else if(kind==='kbd')step=ctx.keyboard?pathStepKbd(word,ctx.progress):null;
    else if(kind==='build'&&word.cog)step=pathStepBuild(word,ctx.known,rng);
    if(step)return step;
  }
  return null;
}

// Vom Leichten zum Schweren: erst wiedererkennen, dann frei abrufen.
const PATH_WORD_ROTATION=['read','say','type','find','read','build'];
const PATH_PRACTICE_ROTATION=['type','read','say','type','find','build'];

function buildPathLesson(index,progress,rng=Math.random){
  const lesson=PATH_LESSONS[index];
  if(!lesson)return null;
  const known=pathLettersUpTo(index),steps=[],usedWords=new Set();
  const pool=PATH_WORDS.filter(word=>word.lesson<=index&&pathUsable(word));
  const keyboard=progress?.keyboard===true,ctx={pool,known,progress,keyboard};
  const push=step=>{if(step&&!steps.some(existing=>existing.id===step.id)){steps.push(step);if(step.word)usedWords.add(step.word)}};

  // 1 · Aufwärmen mit NEUEN Wörtern aus alten Buchstaben.
  if(index>0)for(const word of pathPickFresh(pool.filter(w=>w.lesson<index&&w.cog),progress,rng,2))push(pathStepRead(word,pool,rng));

  // 2 · Zeigen, dann sofort ausprobieren.
  const taught=new Set(pathLettersUpTo(index-1));
  lesson.letters.forEach((letter,i)=>{
    push(pathStepGuess(letter,known.filter(c=>taught.has(c)),rng));
    push(pathStepTeach(letter,index,known,taught,i+1,lesson.letters.length));
    taught.add(letter);
    const shown=known.filter(c=>taught.has(c));
    push(pathStepTrace(letter));
    if(!lesson.light||i%3===2)push(pathStepSound(letter,shown,rng));
    // Abwechselnd über das Ohr und über die Lautangabe zurück zum Zeichen.
    // Mit eingerichteter Tastatur wird der zweite dieser Abrufe getippt statt ausgewählt.
    if(!lesson.light&&i%2===1)push((i%4===1?pathStepListen(lesson.letters[i-1],shown,rng):keyboard?pathStepKbdLetter(lesson.letters[i-1],shown,rng):null)||pathStepLetter(lesson.letters[i-1],shown,rng));
  });
  if(lesson.light){const last=lesson.letters[lesson.letters.length-1];push(keyboard?pathStepKbdLetter(last,known,rng):pathStepLetter(last,known,rng))}

  // 3 · Wörter lesen: jeder neue Buchstabe kommt mindestens einmal vor.
  const own=pool.filter(word=>word.lesson===index&&!usedWords.has(word.w));
  const picked=[];
  for(const letter of lesson.letters){
    if(picked.some(word=>word.letters.includes(letter)))continue;
    const candidate=pathPickFresh(own.filter(word=>word.letters.includes(letter)&&!picked.includes(word)),progress,rng,1)[0];
    if(candidate)picked.push(candidate);
  }
  for(const word of pathPickFresh(own.filter(word=>!picked.includes(word)),progress,rng,Math.max(0,6-picked.length)))picked.push(word);
  // Mit Tastatur ersetzt echtes Schreiben das Legen aus Plättchen.
  const rotation=keyboard?PATH_WORD_ROTATION.map(form=>form==='build'?'kbd':form):PATH_WORD_ROTATION;
  const ordered=shuffle(picked,rng),forms=ordered.map((_,i)=>rotation[i%rotation.length]);
  // Die Schreibaufgabe braucht ein tastaturtaugliches Wort (kein Apostroph, nicht
  // zu lang). Passt das vorgesehene nicht, schreibt man das letzte, das passt.
  if(keyboard&&!ordered.some((word,i)=>forms[i]==='kbd'&&pathKbdWordOk(word))){
    let at=-1;ordered.forEach((word,i)=>{if(pathKbdWordOk(word))at=i});
    if(at>=0)forms[at]='kbd';
  }
  ordered.forEach((word,i)=>push(pathWordStep(word,forms[i],ctx,rng)));

  // 4 · Ein letztes altes Wort in neuer Aufgabenform.
  if(index>0){const older=pathPickFresh(pool.filter(w=>w.lesson<index&&w.cog&&!usedWords.has(w.w)),progress,rng,1)[0];if(older)push(pathWordStep(older,'find',ctx,rng))}
  return {kind:'lesson',index,lessonId:lesson.id,steps};
}

function buildPathPractice(progress,rng=Math.random,size=10){
  const highest=pathHighestDoneIndex(progress);
  if(highest<0)return null;
  const keyboard=progress?.keyboard===true,practiceRotation=keyboard?['type','read','kbd','say','find','kbd']:PATH_PRACTICE_ROTATION;
  const known=pathLettersUpTo(highest),pool=PATH_WORDS.filter(word=>word.lesson<=highest&&pathUsable(word)),ctx={pool,known,progress,keyboard},steps=[];
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
    let type=practiceRotation[rotation++%practiceRotation.length];
    if(type===progress.words?.[word.w]?.type)type=practiceRotation[rotation++%practiceRotation.length];
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
  const known=pathLettersUpTo(index),pool=PATH_WORDS.filter(word=>word.lesson<=index&&pathUsable(word)),ctx={pool,known,progress,keyboard:false},steps=[];
  const push=step=>{if(step&&!steps.some(existing=>existing.id===step.id))steps.push(step)};
  shuffle(lesson.letters,rng).forEach((letter,i)=>push(i%2?pathStepLetter(letter,known,rng):pathStepSound(letter,known,rng)));
  const own=pool.filter(word=>word.lesson===index);
  pathPickFresh(own,progress,rng,3).forEach((word,i)=>push(pathWordStep(word,['type','read','find'][i],ctx,rng)));
  return {kind:'check',index,lessonId:lesson.id,steps,allowedMistakes:PATH_CHECK_ALLOWED_MISTAKES};
}
function pathCheckPassed(run,results){
  if(run?.kind!=='check')return false;
  const answered=(results||[]).filter(result=>result.step&&result.step.type!=='teach'&&!result.step.ungraded);
  return answered.length>=run.steps.length&&answered.filter(result=>!result.good).length<=(run.allowedMistakes??PATH_CHECK_ALLOWED_MISTAKES);
}

// Fehler werden Lernmaterial: derselbe Inhalt kommt später noch einmal – aber in
// einer ANDEREN Aufgabenform, damit nicht die Antwort von eben wiedererkannt wird.
function pathRetryStep(step,run,rng=Math.random){
  if(!step||step.retry||step.ungraded||step.type==='teach')return null;
  const index=run.index,known=pathLettersUpTo(index),pool=PATH_WORDS.filter(word=>word.lesson<=index&&pathUsable(word)),ctx={pool,known,progress:null,keyboard:false};
  const taken=new Set(run.steps.map(existing=>existing.id));
  let next=null;
  if(step.type==='sound')next=pathStepLetter(step.letter,known,rng);
  else if(['letter','listen','write','kbdletter','dictate'].includes(step.type))next=pathStepSound(step.letter,known,rng);
  else{
    const word=PATH_WORD_BY_TEXT.get(step.word);
    const alternatives={read:['say','find','type','build'],say:['read','find','type','build'],find:['read','say','type','build'],build:['read','say','find','type'],type:['read','say','find','build'],kbd:['read','say','type','find','build']}[step.type]||['read'];
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
    if(!step||step.type==='teach'||step.ungraded)continue;
    if(step.word){const row=progress.words[step.word]||(progress.words[step.word]={seen:0,ok:0,last:0,type:''});row.seen++;if(result.good)row.ok++;row.last=now;row.type=step.type}
    else if(step.letter){const row=progress.letters[step.letter]||(progress.letters[step.letter]={ok:0,bad:0});result.good?row.ok++:row.bad++}
  }
  // Ein bestandener Kurztest zählt wie die Lektion; ein nicht bestandener ändert nichts.
  if((run?.kind==='lesson'||pathCheckPassed(run,results))&&run.lessonId){const row=progress.done[run.lessonId]||(progress.done[run.lessonId]={at:now,runs:0});row.runs++;row.at=row.at||now}
  if(run?.kind==='practice')progress.practiceRuns=(Number(progress.practiceRuns)||0)+1;
  if(run?.kind==='review')progress.reviewRuns=(Number(progress.reviewRuns)||0)+1;
  if(run?.kind==='typing')progress.typingRuns=(Number(progress.typingRuns)||0)+1;
  pathSrsApply(progress,run,results,now);
  return progress;
}

// Tastaturtraining: nur Schreiben. Drei Buchstaben (die schwächsten, einer als
// Diktat), dann Wörter – schon gelesene aus der Lesung, neue zum Abtippen.
function buildPathTyping(progress,rng=Math.random,size=10){
  const highest=pathHighestDoneIndex(progress);
  if(highest<0)return null;
  const known=pathLettersUpTo(highest),pool=PATH_WORDS.filter(word=>word.lesson<=highest&&pathKbdWordOk(word)),steps=[];
  const push=step=>{if(step&&!steps.some(existing=>existing.id===step.id))steps.push(step)};
  const weak=shuffle(known,rng).sort((a,b)=>((progress.letters?.[b]?.bad||0)-(progress.letters?.[b]?.ok||0))-((progress.letters?.[a]?.bad||0)-(progress.letters?.[a]?.ok||0))).slice(0,3);
  weak.forEach((letter,i)=>push((i===1?pathStepDictate(letter,known,rng):null)||pathStepKbdLetter(letter,known,rng)));
  // Zuletzt nicht getippte Wörter zuerst; innerhalb davon erst bekannte, dann neue.
  const typedLast=word=>progress.words?.[word.w]?.type==='kbd'?1:0;
  const readBefore=shuffle(pool.filter(word=>pathSeen(progress,word)>0),rng).sort((a,b)=>typedLast(a)-typedLast(b)).slice(0,Math.ceil((size-steps.length)/2));
  const rest=pathPickFresh(pool.filter(word=>!readBefore.includes(word)),progress,rng,size);
  for(const word of [...readBefore,...rest]){if(steps.length>=size)break;push(pathStepKbd(word,progress))}
  return {kind:'typing',index:highest,lessonId:'',steps};
}
