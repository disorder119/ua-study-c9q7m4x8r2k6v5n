'use strict';

// Alphabet Lab V6.2 · Fragen-Integrität und Lösbarkeit
//
// Harte Invarianten, die dieses Modul herstellt und die
// tests/validate-alphabet-lab-v62-solvability.mjs für jede erzeugte Frage prüft:
//
//  I1  Zielangabe: Jede Aufgabe, deren Antwort davon abhängt zu wissen, WELCHER
//      Buchstabe gemeint ist, nennt diesen Buchstaben (oder – wo die Nennung die
//      Lösung verraten würde – seinen Laut) im Promptext. Ein deutscher Anfänger
//      wird nie nach „dem Zielzeichen“ gefragt, ohne zu erfahren, welches das ist.
//  I2  Eindeutigkeit bei Buchstabenwahl über eine angezeigte Zeichenkette
//      (word-plain, pseudoword): Genau eine angebotene Option kommt darin vor.
//  I3  Kein Positionsleak: Kein Stimulus verrät die Lösung durch ihre Position
//      (früher stand bei sound-contrast/visual-contrast das Ziel immer vorn).
//  I4  Kein konstanter Erwartungswert: Keine Familie darf über alle Buchstaben
//      hinweg fast immer dieselbe richtige Antwort haben (Auswendiglernen der App).
//  I5  Optionslisten sind dublettenfrei, enthalten die richtige Antwort genau
//      einmal und haben mindestens zwei Einträge.
//
// Die adaptive Architektur (Active Set, Mastery, Confidence, Repairs, SRS,
// Production-Gating, Audio-Readiness) bleibt unverändert; dieses Modul greift
// ausschließlich in die Aufgabenerzeugung ein.

const V62_VERSION=62;

const v62Lower=letter=>DATA[letter]?.lower||String(letter).toLocaleLowerCase('uk');
const v62Cue=letter=>`${letter} ${v62Lower(letter)}`;
const v62Sound=letter=>DATA[letter]?.sound||'';
const v62Chars=word=>[...String(word||'').toLocaleLowerCase('uk')];

// Ja/Nein- und Gleich/Verschieden-Entscheidungen dürfen nicht pro Kandidat neu
// ausgewürfelt werden: Der Selektor bewertet mehrere Kandidaten pro Frageslot und
// bevorzugt dabei den mit dem frischeren Wort. Da Negativwörter aus der gesamten
// Wordbank stammen, wirkten sie immer „frischer“ – dadurch lag die Antwort
// „Nein“ live bei 89 %. Ein stabiler Hash pro Frageslot entkoppelt die
// Klassenwahl von der Kandidatenbewertung.
function v62SlotHash(parts){let h=2166136261;for(const ch of String(parts))h=Math.imul(h^ch.charCodeAt(0),16777619)>>>0;return h>>>0}
const v62SlotCoin=(session,letter,family)=>v62SlotHash(`${session?.sessionId||''}|${session?.mainIndex??0}|${letter}|${family}`)%2===0;
const v62Contains=(word,letter)=>v62Chars(word).includes(v62Lower(letter));

// I1 · Prompttexte, die das Ziel explizit benennen.
const V62_TARGET_PROMPTS={
  'visual-find':letter=>letter==='Ь'
    ?'Gesucht ist das ukrainische Weichheitszeichen – es hat keinen eigenen Laut und macht den Konsonanten davor weich. Welches Zeichen im Feld ist es?'
    :`Ziellaut: ${v62Sound(letter)}. Welches Zeichen im Feld gehört zu diesem Laut?`,
  'multi-select':letter=>`Tippe jedes ${v62Cue(letter)} an – und nur dieses Zeichen.`,
  'count-target':letter=>`Wie oft kommt ${v62Cue(letter)} in diesem Wort vor?`,
  'word-position':letter=>`Wo steht ${v62Cue(letter)} in diesem Wort?`,
  'word-contains':letter=>`Enthält dieses Wort den Buchstaben ${v62Cue(letter)}?`,
  'word-choice':letter=>`Welches dieser Wörter enthält ${v62Cue(letter)}?`,
  'tap-target':letter=>`Tippe ${v62Cue(letter)} im Wort an.`,
  'multi-occurrence':letter=>`Tippe jedes ${v62Cue(letter)} im Wort an.`,
  'missing-letter':letter=>letter==='Ь'
    ?'In diesem Wort fehlt das Zeichen, das den Konsonanten davor weich macht. Welches ist es?'
    :`Welcher Buchstabe fehlt? Ziellaut: ${v62Sound(letter)}.`,
  'confusion-word-choice':letter=>`Welches dieser Wörter enthält ${v62Cue(letter)}?`
};

// Familien, die ohne explizite Zielnennung objektiv unlösbar wären.
const V62_TARGET_REQUIRED=new Set(Object.keys(V62_TARGET_PROMPTS));
// Familien, bei denen der Zielbuchstabe bewusst NICHT genannt wird, weil er die
// Lösung wäre. Dort sichert I2 die Eindeutigkeit.
const V62_UNIQUE_IN_DISPLAY=new Set(['word-plain','pseudoword']);
// Familien, die dauerhaft aus der Auswahl genommen sind (Begründung unten).
const V62_RETIRED=new Set(['odd-one-out','audio-word-position']);

// Ersatz für die stillgelegten Familien, damit Varianz erhalten bleibt.
QUESTION_FAMILIES['confusion-word-choice']={skill:'confusionDiscrimination',min:1,max:5,weight:.9,usesWord:true,production:1};
QUESTION_FAMILIES['audio-word-match']={skill:'audioToLetter',min:2,max:5,weight:1,usesAudio:true,usesWord:true,production:1};
FAMILY_PROMPTS['confusion-word-choice']=['Welches dieser Wörter enthält den Zielbuchstaben?'];
FAMILY_PROMPTS['audio-word-match']=['Höre die menschliche Originalaufnahme. Welches geschriebene Wort hast du gehört?'];

// Die Wordbank ist nach dem Laden statisch. Sie wuchs in V6.2 von 198 auf 328
// Einträge und wird pro Aufgabe mehrfach gefiltert; ein einmaliger Index hält die
// Fragegenerierung schneller als vor der Erweiterung.
const v62WordsFor=letter=>wordsForLetter(letter);

function v62AudioWord(letter){
  return v62WordsFor(letter).find(w=>w.audioKey===letter)||v62WordsFor(letter)[0]||null;
}

// I5 · Optionsliste säubern: dublettenfrei, richtige Antwort genau einmal,
// bei Bedarf mit passenden Füllern auf die Zielgröße gebracht.
// Zufallsauswahl ohne vollständiges Mischen: Die Distraktorpools umfassen fast
// die ganze Wordbank; ein shuffle() über 300 Einträge pro Kandidat ist der
// teuerste Einzelposten der Fragegenerierung.
function v62Sample(list,count,rng=Math.random){
  if(!Array.isArray(list)||!list.length)return [];
  if(list.length<=count)return shuffle(list.slice(),rng);
  const out=[],used=new Set();
  for(let guard=0;out.length<count&&guard<count*12;guard++){
    const index=Math.floor(rng()*list.length);
    if(used.has(index))continue;
    used.add(index);out.push(list[index]);
  }
  // Zufälliges Ziehen kann die Quote verfehlen – bei einer konstanten RNG (Tests,
  // Debug-Einstiege) sogar immer. Dann linear ab einem Startpunkt auffüllen, damit
  // immer min(count, list.length) verschiedene Einträge zurückkommen. Sonst fiele
  // etwa audio-word-match still auf eine andere Familie zurück.
  for(let offset=0;out.length<count&&offset<list.length;offset++){
    const index=(Math.floor(rng()*list.length)+offset)%list.length;
    if(used.has(index))continue;
    used.add(index);out.push(list[index]);
  }
  return out;
}

function v62CleanOptions(task,rng=Math.random,{size=0,fill=null}={}){
  if(!task||!Array.isArray(task.options)||!task.options.length)return task;
  const correct=task.correct;
  const out=[],seen=new Set();
  const push=value=>{const key=String(value);if(value===undefined||value===null||key===''||seen.has(key))return;seen.add(key);out.push(value)};
  if(correct!=='MULTI'&&correct!=='SELF')push(correct);
  for(const option of task.options)push(option);
  const target=size||out.length;
  if(out.length<target&&typeof fill==='function'){
    for(const candidate of fill()){if(out.length>=target)break;push(candidate)}
  }
  task.options=shuffle(out.slice(0,Math.max(target,2)),rng);
  return task;
}

// I2 · Bei „welcher angebotene Buchstabe steckt in dieser Zeichenkette?“ darf genau
// eine Option tatsächlich vorkommen. Vorher waren bis zu 38 % dieser Aufgaben
// mehrdeutig (mehrere Optionen kamen im Wort/Pseudowort vor).
function v62EnforceUniqueLetterInDisplay(task,rng=Math.random){
  const correct=task.correct;
  if(!ALPHABET.includes(correct))return task;
  const haystack=v62Chars(task.display);
  const keep=[correct],seen=new Set([correct]);
  for(const option of task.options||[]){
    if(seen.has(option)||!ALPHABET.includes(option))continue;
    if(haystack.includes(v62Lower(option)))continue;
    seen.add(option);keep.push(option);
  }
  task.options=keep;
  return v62CleanOptions(task,rng,{size:4,fill:()=>shuffle(ALPHABET.filter(c=>!seen.has(c)&&!haystack.includes(v62Lower(c))),rng)});
}

// Wortwahl für Positionsaufgaben über alle vorhandenen Positionsklassen streuen.
// Vorher stand der Zielbuchstabe in 56 % der Fälle am Wortanfang.
function v62PickPositionDiverseWord(state,letter,session,rng,difficulty){
  const pool=v62EligibleWords(state,letter,difficulty);
  if(pool.length<2)return pickWord(state,letter,session,rng,{difficulty});
  const byPosition=new Map();
  for(const word of pool){
    if(!byPosition.has(word.position))byPosition.set(word.position,[]);
    byPosition.get(word.position).push(word);
  }
  const classes=shuffle([...byPosition.keys()],rng);
  const used=new Set(session?.usedWordIds||[]);
  for(const positionClass of classes){
    const rows=byPosition.get(positionClass),fresh=rows.filter(w=>!used.has(w.id));
    const pick=v62Sample(fresh.length?fresh:rows,1,rng)[0];
    if(pick)return pick;
  }
  return pickWord(state,letter,session,rng,{difficulty});
}

// Negativbeispiel für „enthält das Wort X?“ kommt aus pickNegativeWordV5, das den
// Unbekannt-Filter bereits kennt. Die frühere Schieflage („Nein“ war live in 81 %
// richtig) lag nicht am Pool, sondern daran, dass der Neuheitsscore Kandidaten mit
// noch ungenutzter wordId bevorzugte; deshalb trägt word-contains keine wordId mehr.
function v62NegativeWord(state,letter,session,rng,difficulty){
  if(typeof pickNegativeWordV5==='function'){
    const picked=pickNegativeWordV5(state,letter,session,rng,Number(difficulty)||2);
    if(picked)return picked;
  }
  const pool=WORD_BANK.filter(w=>w.letter!==letter&&!v62Contains(w.word,letter));
  return v62Sample(pool,1,rng)[0]||null;
}

// Anfängertauglichkeit der Wortauswahl liegt bewusst weiterhin bei
// alphabet-core-v5-progression.js: pickWord dort begrenzt die Zahl noch
// unbekannter Buchstaben abhängig von der Schwierigkeit. V6.2 baut darauf auf und
// darf diesen Filter nie lockern – jede eigene Wortwahl läuft deshalb durch
// v62EligibleWords().
function v62UnknownCap(difficulty){
  return typeof maxUnknownForDifficultyV5==='function'?maxUnknownForDifficultyV5(Number(difficulty)||0):99;
}
const V62_ELIGIBLE_CACHE=new Map();
function v62EligibleWords(state,letter,difficulty,rows){
  const pool=rows||wordsForLetter(letter);
  if(typeof wordUnknownCountV5!=='function')return pool;
  const cap=v62UnknownCap(difficulty);
  if(cap>=99)return pool;
  // Der Filter läuft pro Kandidat über bis zu 328 Wörter; das Ergebnis hängt nur
  // von Buchstabe, Kappe und dem Stand der eingeführten Buchstaben ab.
  const introduced=(state?.learningPlan?.introducedLetters||[]).join('');
  const key=`${rows?'bank':'letter'}|${letter}|${cap}|${introduced}`;
  const cached=V62_ELIGIBLE_CACHE.get(key);
  if(cached)return cached;
  const allowed=pool.filter(w=>wordUnknownCountV5(state,w,letter)<=cap);
  const result=allowed.length?allowed:pool;
  if(V62_ELIGIBLE_CACHE.size>600)V62_ELIGIBLE_CACHE.clear();
  V62_ELIGIBLE_CACHE.set(key,result);
  return result;
}

// odd-one-out war zu 94 % mit „А“ zu lösen, weil der Außenseiter deterministisch
// der erste Alphabetbuchstabe außerhalb der Verwechslungsgruppe war; zudem konnte
// ein Anfänger die Gruppenzugehörigkeit nicht aus dem Bildschirm ableiten.
// audio-word-position hatte pro Buchstabe genau ein Audiowort und damit eine
// feste richtige Antwort („1“ in 100 % der real gezogenen Aufgaben).
// Beide sind ersetzt statt repariert, weil ihre Aufgabenform keine variierende,
// objektiv belegbare Lösung zulässt.
const familyAllowedForV62Base=familyAllowedFor;
familyAllowedFor=function(letter,family){
  if(V62_RETIRED.has(family))return false;
  // Beide Prüfungen bleiben bewusst billig: familyAllowedFor läuft pro Kandidat.
  if(family==='confusion-word-choice')return letter!=='Ь'&&!!LETTER_PEDAGOGY[letter]?.confusions?.length;
  if(family==='audio-word-match')return wordsForLetter(letter).length>0;
  return familyAllowedForV62Base(letter,family);
};

function v62ConfusionPartner(state,letter){
  const personal=state&&state.letters?personalConfusions(state,letter)||[]:[];
  const candidates=uniq([...personal,...(LETTER_PEDAGOGY[letter]?.confusions||[]),...(SOUND_GROUPS[letter]||[])]).filter(c=>ALPHABET.includes(c)&&c!==letter);
  return candidates[0]||null;
}

const familyCandidatesV62Base=familyCandidates;
familyCandidates=function(state,letter,skill,difficulty,session){
  let families=familyCandidatesV62Base(state,letter,skill,difficulty,session).filter(f=>!V62_RETIRED.has(f));
  if(skill==='audioToLetter'){
    families=uniq([...families,'audio-to-letter','audio-word-match']).filter(f=>familyAllowedFor(letter,f));
  }
  if(skill==='confusionDiscrimination'&&letter!=='Ь'&&familyAllowedFor(letter,'confusion-word-choice')){
    families=uniq([...families,'confusion-word-choice']);
  }
  return families.length?families:['visual-to-sound'];
};

// Ь bleibt ohne erfundenen Eigenlaut: audioToLetter läuft ausschließlich über den
// Wortkontext (menschliche Originalaufnahme von „кінь“).
const SOFT_SIGN_V62_FAMILIES=['audio-to-letter','audio-word-match','confusion-word-choice'];
for(const family of SOFT_SIGN_V62_FAMILIES)if(!SOFT_FOCUSED.includes(family))SOFT_FOCUSED.push(family);
for(const retired of V62_RETIRED){
  const index=SOFT_FOCUSED.indexOf(retired);
  if(index>=0)SOFT_FOCUSED.splice(index,1);
}

function v62BuildConfusionWordChoice(state,letter,session,rng,task,difficulty){
  const partner=v62ConfusionPartner(state,letter);
  const good=pickWord(state,letter,session,rng,{difficulty});
  if(!good||!partner)return null;
  const partnerWords=v62EligibleWords(state,partner,difficulty).filter(w=>w.word!==good.word&&!v62Contains(w.word,letter));
  const picked=v62Sample(partnerWords,3,rng);
  if(picked.length<3){
    const neutral=v62EligibleWords(state,letter,difficulty,WORD_BANK).filter(w=>w.word!==good.word&&!v62Contains(w.word,letter));
    picked.push(...v62Sample(neutral,3-picked.length,rng));
  }
  const distractors=uniq(picked.map(w=>w.word)).filter(w=>w!==good.word).slice(0,3);
  if(distractors.length<2)return null;
  task.type='choice';
  task.wordId=good.id;
  task.display='';
  task.icon='';
  task.correct=good.word;
  task.options=[good.word,...distractors];
  task.confusionTarget=partner;
  task.stimulusId=`confusion-word-${good.id}-${partner}`;
  task.prompt=`Welches dieser Wörter enthält ${v62Cue(letter)}? Die anderen enthalten ${v62Cue(partner)} oder keines von beiden.`;
  return v62CleanOptions(task,rng,{size:Math.min(4,1+distractors.length)});
}

function v62BuildAudioWordMatch(state,letter,session,rng,task,difficulty){
  const target=v62AudioWord(letter);
  if(!target)return null;
  const pool=v62EligibleWords(state,letter,difficulty,WORD_BANK);
  const distractors=uniq(v62Sample(pool,6,rng).map(w=>w.word)).filter(w=>w!==target.word).slice(0,3);
  if(distractors.length<2)return null;
  task.type='audio';
  // Bewusst ohne wordId: taskBody blendet bei Audiofragen mit wordId das Wort als
  // Text ein – bei „welches Wort hast du gehört?“ wäre das die Lösung.
  task.wordId='';
  task.display='';
  task.correct=target.word;
  task.options=[target.word,...distractors];
  task.audioWord=target.word;
  task.audioKind='word-context';
  task.requiresHumanAudio=true;
  task.humanAudioRequired=true;
  task.requiresHumanLetterAudio=false;
  task.letterAudioAvailable=false;
  task.audioStimulusId=`human-word-${letter}`;
  task.stimulusId=`audio-word-match-${target.id}`;
  task.prompt=`Höre die menschliche Originalaufnahme. Welches geschriebene Wort hast du gehört? Achte besonders auf ${v62Cue(letter)}.`;
  delete task.audioIndex;
  return v62CleanOptions(task,rng,{size:Math.min(4,1+distractors.length)});
}

const buildV4TaskV62Base=buildV4Task;
buildV4Task=function(state,letter,skill,difficulty,family,session,rng=Math.random,meta={}){
  const task=buildV4TaskV62Base(state,letter,skill,difficulty,family,session,rng,meta);
  if(!task)return task;
  const target=task.letter||letter,resolved=task.family||family;

  if(resolved==='confusion-word-choice'){
    const built=v62BuildConfusionWordChoice(state,target,session,rng,task,difficulty);
    if(built)return built;
    return buildV4TaskV62Base(state,target,'confusionDiscrimination',difficulty,'visual-contrast',session,rng,meta);
  }
  if(resolved==='audio-word-match'){
    const built=v62BuildAudioWordMatch(state,target,session,rng,task,difficulty);
    if(built)return built;
    return buildV4TaskV62Base(state,target,'audioToLetter',difficulty,'audio-to-letter',session,rng,meta);
  }

  // I1 · Ziel explizit benennen.
  if(V62_TARGET_REQUIRED.has(resolved)){
    task.targetLetter=target;
    task.targetCue=v62Cue(target);
    task.prompt=V62_TARGET_PROMPTS[resolved](target);
  }

  // Wortauswahl und Antwortverteilung je Familie korrigieren.
  if(resolved==='word-position'){
    const word=v62PickPositionDiverseWord(state,target,session,rng,difficulty);
    if(word){
    task.wordId=word.id;task.display=word.word;task.icon=word.icon;task.stimulusId=word.id;
    task.correct=targetPosition(word);
    task.options=shuffle(['Anfang','Mitte','Ende','Mehrfach'],rng);
    }
  }
  if(resolved==='word-contains'){
    const wantsYes=v62SlotCoin(session,target,'word-contains');
    const word=(wantsYes?pickWord(state,target,session,rng,{difficulty}):v62NegativeWord(state,target,session,rng,difficulty))||pickWord(state,target,session,rng,{difficulty});
    if(word){
    // Bewusst ohne wordId: noveltyScore/registerSelectedTask würden sonst die
    // Nein-Variante bevorzugen, weil deren Wort nicht von den übrigen
    // Wortfamilien desselben Buchstabens „verbraucht“ wird.
    task.wordId='';task.display=word.word;task.icon='';task.stimulusId=`contains-${word.id}`;
    task.correct=v62Contains(word.word,target)?'Ja':'Nein';
    task.options=['Ja','Nein'];
    }
  }
  if(resolved==='word-choice'){
    const good=pickWord(state,target,session,rng,{difficulty});
    if(good){
      const pool=v62EligibleWords(state,target,difficulty,WORD_BANK).filter(w=>w.word!==good.word&&!v62Contains(w.word,target));
      const distractors=uniq(v62Sample(pool,6,rng).map(w=>w.word)).slice(0,3);
      task.wordId=good.id;task.correct=good.word;task.stimulusId=good.id;
      task.options=[good.word,...distractors];
    }
  }
  if(resolved==='count-target'){
    const word=pickWord(state,target,session,rng,{difficulty,multiple:true})||pickWord(state,target,session,rng,{difficulty});
    if(word){
    const count=word.targetIndexes.length;
    task.wordId=word.id;task.display=word.word;task.icon=word.icon;task.stimulusId=word.id;
    task.correct=String(count);
    task.options=[String(count),...['1','2','3','0','4'].filter(x=>x!==String(count))].slice(0,4);
    }
  }
  if(resolved==='same-different'){
    // Vorher 55 % „Gleich“; die Verteilung wird jetzt fair ausgelost.
    const same=v62SlotCoin(session,target,'same-different'),partner=task.confusionTarget||v62ConfusionPartner(state,target)||ALPHABET.find(c=>c!==target);
    const other=same?target:partner;
    const fonts=relevantFonts(difficulty);
    const first=fonts[Math.floor(rng()*fonts.length)],second=fonts[Math.floor(rng()*fonts.length)];
    task.displayParts=[{text:target,fontId:first.id,style:first.style},{text:v62Lower(other),fontId:second.id,style:second.style}];
    task.display=`${target}|${v62Lower(other)}`;
    task.fontId=`${first.id}-${second.id}`;
    task.correct=same?'Gleich':'Verschieden';
    task.options=['Gleich','Verschieden'];
    task.stimulusId=`${same?'same':'diff'}-${other}`;
  }

  if(resolved==='visual-contrast'){
    // Der Prompt nennt das Ziel bereits; die zusätzliche Paaranzeige verriet die
    // Lösung durch ihre Reihenfolge.
    task.display='';
  }

  // I2 · Eindeutigkeit bei Buchstabenwahl über eine angezeigte Zeichenkette.
  if(V62_UNIQUE_IN_DISPLAY.has(resolved))v62EnforceUniqueLetterInDisplay(task,rng);

  // I5 · Generelle Optionshygiene für alle Auswahlaufgaben.
  if(Array.isArray(task.options)&&task.options.length&&task.correct!=='MULTI'&&task.correct!=='SELF'){
    v62CleanOptions(task,rng);
  }

  // I3 · Positionsleak beseitigen: Die Paaranzeige folgt exakt der bereits
  // gemischten Optionsreihenfolge, statt das Ziel immer vorn zu zeigen.
  if(resolved==='sound-contrast'){
    const pair=(task.options||[]).filter(c=>ALPHABET.includes(c));
    task.display=pair.length>=2?pair.join(' · '):'';
  }
  return task;
};

// ---------------------------------------------------------------------------
// V6.2 · Progressionsboden
//
// Eine Simulation mit konstant 55 % Trefferquote blieb dauerhaft bei neun
// eingeführten Buchstaben stehen: 233 Hauptfragen ohne einen einzigen neuen
// Buchstaben. Zwei Ursachen, beide hier behoben:
//
//  A) Der zuletzt eingeführte Buchstabe verhungerte. Das aktive Lernfeld ist auf
//     fünf Buchstaben begrenzt und wird nach Bedarf sortiert; bei Gleichstand
//     gewinnt die Lernreihenfolge, also nie der neueste. Der Buchstabe blieb mit
//     null Versuchen liegen – und das V5-Throttle verlangt genau für diesen
//     Buchstaben mindestens zwei Versuche, bevor der nächste freigeschaltet wird.
//     Ein eingeführter Buchstabe ohne jede Evidenz hat objektiv den höchsten
//     Lernbedarf und kommt deshalb zuerst ins aktive Lernfeld.
//
//  B) Das Qualitätsgate verlangt, dass rund zwei Drittel des aktiven Lernfelds
//     ausreichend sitzen. Wer diese Schwelle nie erreicht, erreicht auch die
//     restlichen 24 Buchstaben nie. Nach 120 unabhängigen Hauptfragen ohne
//     Freischaltung – vier volle Sitzungen ohne jeden Fortschritt – wird ein
//     einzelner Buchstabe nachgezogen, sofern das Lernfeld nicht zusammengebrochen
//     ist. Das Throttle aus V5 bleibt davon unberührt, die Drosselung bleibt also
//     erhalten; nur der dauerhafte Stillstand entfällt.

const V62_UNLOCK_STALL_ANSWERS=120;
const v62LetterHasEvidence=(state,letter)=>CORE_SKILLS.some(k=>(state?.letters?.[letter]?.skills?.[k]?.independentAttempts||0)>0);

const shouldUnlockNextLetterV62Base=shouldUnlockNextLetter;
shouldUnlockNextLetter=function(state,now=Date.now()){
  if(shouldUnlockNextLetterV62Base(state,now))return true;
  const plan=state?.learningPlan;
  if(!plan)return false;
  const introduced=plan.introducedLetters||[];
  if(introduced.length>=ALPHABET.length)return false;
  const aggregate=Number(state?.metrics?.independentMainCount)||0;
  const since=aggregate-(Number(plan.v62LastUnlockAggregate)||0);
  if(since<V62_UNLOCK_STALL_ANSWERS)return false;
  const active=(plan.activeLetters||[]).filter(c=>ALPHABET.includes(c));
  if(!active.length)return true;
  const rows=active.map(c=>basicReadiness(state,c,now));
  // Bei echtem Zusammenbruch wäre ein weiterer Buchstabe schädlich.
  if(rows.filter(r=>r.min<25&&r.attempted>=1).length>1)return false;
  return rows.some(r=>r.attempted>=2&&r.avg>=50);
};

const recomputeLearningPlanV62Base=recomputeLearningPlan;
recomputeLearningPlan=function(state,now=Date.now(),opts={}){
  const before=[...(state?.learningPlan?.introducedLetters||[])];
  const plan=recomputeLearningPlanV62Base(state,now,opts);
  if(!plan)return plan;
  const aggregate=Number(state?.metrics?.independentMainCount)||0;
  if(plan.v62LastUnlockAggregate===undefined)plan.v62LastUnlockAggregate=aggregate;
  if((plan.introducedLetters||[]).some(c=>!before.includes(c)))plan.v62LastUnlockAggregate=aggregate;
  const introduced=plan.introducedLetters||[];
  const starved=introduced.filter(c=>!v62LetterHasEvidence(state,c));
  if(starved.length&&Array.isArray(plan.activeLetters)&&plan.activeLetters.length){
    const size=plan.activeLetters.length;
    plan.activeLetters=uniq([...starved,...plan.activeLetters]).slice(0,Math.max(size,starved.length));
  }
  return plan;
};

// Ein eingeführter Buchstabe ohne jede Evidenz kann im aktiven Lernfeld liegen und
// trotzdem nie gefragt werden: selectLetterV4 bewertet nach Lernbedarf, und ein
// Buchstabe, der laufend Fehler produziert, sammelt Overdue-, Fehler- und
// Repair-Aufschläge, die ein unberührter Buchstabe (Bedarf ≈ 137) nie erreicht
// (beobachtet: 14 Sitzungen in Folge nicht gefragt). Erste Begegnung hat deshalb
// Vorrang – man kann nicht wissen, ob ein Buchstabe schwer ist, bevor man ihn
// einmal gestellt hat. Nach genau einer Antwort greift wieder die normale Auswahl.
const selectLetterV62Base=selectLetterV4;
selectLetterV4=function(state,session,rng=Math.random,now=Date.now()){
  const pick=selectLetterV62Base(state,session,rng,now);
  if(session?.fixedLetters?.length)return pick;
  const active=state?.learningPlan?.activeLetters||[];
  const served=session?.coverageState?.letterCounts||{};
  // Höchstens zweimal pro Sitzung erzwingen: Wird eine Frage erzeugt, aber nie
  // beantwortet (technischer Audio-Abbruch, abgebrochene Sitzung), entsteht sonst
  // eine Endlosreihe desselben Buchstabens.
  const fresh=active.filter(c=>ALPHABET.includes(c)&&!v62LetterHasEvidence(state,c)&&(Number(served[c])||0)<2);
  if(!fresh.length||fresh.includes(pick?.letter))return pick;
  return {...pick,letter:fresh[0],reason:'first-contact'};
};
