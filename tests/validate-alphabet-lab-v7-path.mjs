import assert from 'node:assert/strict';
import {loadV61,rngFor} from './alphabet-v5-test-utils.mjs';

// V7 · Lernpfad.
//
// Der Pfad ist der Haupteinstieg für Anfänger. Geprüft wird, was ihn trägt:
//   1. Lesbarkeit – kein Wort vor seinen Buchstaben.
//   2. Keine Wiederholung innerhalb eines Durchgangs.
//   3. Jeder Auswahlschritt hat genau eine richtige Antwort.
//   4. Kein Distraktor, der noch nicht gezeigt wurde.
//   5. Fortschritt übersteht Speichern/Laden und beschädigte Daten.

const C=loadV61(),P=C.LearningPath;
assert(P,'LearningPath muss exportiert sein');

// ------------------------------------------------------------------- Daten
const lessonLetters=P.LESSONS.flatMap(lesson=>lesson.letters);
assert.equal(lessonLetters.length,33,'der Pfad muss genau 33 Buchstaben einführen');
assert.deepEqual([...lessonLetters].sort(),[...C.ALPHABET].sort(),'der Pfad muss exakt das ukrainische Alphabet abdecken');
for(const letter of C.ALPHABET){
  const info=P.LETTER_INFO[letter];
  assert(info?.say&&info?.hint,`${letter}: Lautangabe und Merksatz fehlen`);
}
assert.equal(new Set(C.ALPHABET.map(c=>P.LETTER_INFO[c].say)).size,33,'Lautangaben müssen eindeutig sein, sonst sind Antwortoptionen mehrdeutig');

const ALLOWED=new Set([...C.ALPHABET.map(c=>C.DATA[c].lower),'’']);
const seenWords=new Set(),seenMeanings=new Set();
for(const word of P.WORDS){
  assert(!seenWords.has(word.w),`doppeltes Wort ${word.w}`);seenWords.add(word.w);
  assert(!seenMeanings.has(word.de),`doppelte Bedeutung ${word.de}: Bedeutungsfragen wären mehrdeutig`);seenMeanings.add(word.de);
  assert(word.de.trim(),`${word.w}: Bedeutung fehlt`);
  for(const ch of [...word.w.toLocaleLowerCase('uk')])assert(ALLOWED.has(ch),`${word.w}: Zeichen „${ch}“ gehört nicht zum ukrainischen Alphabet`);
  assert(!/[ыэёъ]/i.test(word.w),`${word.w}: russisches Zeichen`);
  // Regel 1: Die Lektion eines Wortes ergibt sich aus seinen Buchstaben.
  const known=new Set(P.lettersUpTo(word.lesson));
  for(const letter of word.letters)assert(known.has(letter),`${word.w} braucht ${letter}, das in Lektion ${word.lesson+1} noch nicht eingeführt ist`);
  if(word.lesson>0){const before=new Set(P.lettersUpTo(word.lesson-1));assert(word.letters.some(letter=>!before.has(letter)),`${word.w} ist zu spät einsortiert`)}
}
P.LESSONS.forEach((lesson,index)=>{
  const own=P.WORDS.filter(word=>word.lesson===index&&word.cog);
  assert(own.length>=8,`Lektion ${index+1} braucht mindestens 8 erschließbare Wörter, hat ${own.length}`);
  for(const letter of lesson.letters){
    const count=P.WORDS.filter(word=>word.lesson===index&&word.letters.includes(letter)).length;
    assert(count>=2,`${letter} braucht in seiner Lektion mindestens zwei Wörter, hat ${count}`);
  }
});

// -------------------------------------------------------------- Schrittlogik
function auditRun(run,label,{progress}){
  assert(run&&run.steps.length>=8,`${label}: zu wenige Schritte`);
  const ids=new Set(),wordTargets=new Set(),taught=new Set(P.lettersUpTo(run.kind==='lesson'?run.index-1:run.index));
  const allowedLetters=new Set(P.lettersUpTo(run.index));
  for(const step of run.steps){
    assert(!ids.has(step.id),`${label}: Schritt ${step.id} kommt doppelt vor`);ids.add(step.id);
    if(step.type==='teach'){taught.add(step.letter);assert(step.say&&step.hint,`${label}: Lernkarte ${step.letter} ohne Inhalt`);continue}
    if(step.type==='guess'){
      // Vortest: vor der Lernkarte, ausdrücklich unbewertet, mit genau der Falle als Option.
      assert(step.ungraded,`${label}: ${step.id} muss unbewertet sein`);
      assert(!taught.has(step.letter),`${label}: ${step.id} kommt nach der Lernkarte – dann ist es kein Raten mehr`);
      assert.equal(step.options.filter(o=>o===step.correct).length,1,`${label}: ${step.id} ohne eindeutige Lösung`);
      assert.equal(step.options.filter(o=>o===step.trap).length,1,`${label}: ${step.id} ohne die Falle`);
      assert.notEqual(step.trap,step.correct);
      assert.equal(new Set(step.options).size,step.options.length,`${label}: ${step.id} hat doppelte Optionen`);
      // Außer der Falle nur Laute von Zeichen, die schon gezeigt wurden.
      for(const option of step.options)if(option!==step.trap&&option!==step.correct)assert([...taught].some(c=>P.LETTER_INFO[c].say===option),`${label}: ${step.id} bietet den unbekannten Laut „${option}“ an`);
      continue;
    }
    if(step.type==='trace'){
      assert(step.ungraded,`${label}: ${step.id} muss unbewertet sein`);
      assert(taught.has(step.letter),`${label}: ${step.id} vor der Lernkarte`);
      assert(P.needsTrace(step.letter),`${label}: ${step.letter} hat eine vertraute Form und muss nicht nachgeschrieben werden`);
      continue;
    }
    const keyboardStep=['kbd','kbdletter','dictate'].includes(step.type);
    // Ohne eingerichtete Tastatur darf niemand eine Tastaturaufgabe bekommen.
    if(keyboardStep)assert.equal(progress.keyboard,true,`${label}: ${step.id} ohne eingerichtete Tastatur`);
    if(step.type==='kbdletter'||step.type==='dictate'){
      assert(taught.has(step.letter),`${label}: ${step.id} für ein noch nicht gezeigtes Zeichen`);
      assert(!step.prompt.includes(step.letter)&&!step.prompt.includes(step.lower),`${label}: ${step.id} verrät das Zeichen im Prompt`);
      assert(P.isCorrect(step,step.lower)&&P.isCorrect(step,step.letter)&&P.isCorrect(step,` ${step.letter} `),`${label}: ${step.id} akzeptiert das eigene Zeichen nicht`);
      assert(!P.isCorrect(step,'')&&!P.isCorrect(step,step.lower+step.lower),`${label}: ${step.id} akzeptiert Unsinn`);
      // Immer ein Weg ohne Tastatur – und beim Diktat zuerst einer ohne Ton.
      const typed=step.type==='dictate'?step.fallback:step;
      if(step.type==='dictate'){assert.notEqual(step.letter,'Ь',`${label}: Ь hat keine isolierte Aufnahme`);assert.equal(typed?.type,'kbdletter',`${label}: Diktat braucht die Tippaufgabe ohne Ton`)}
      assert.equal(typed.fallback?.type,'letter',`${label}: ${step.id} braucht einen Abruf ohne Tastatur`);
      continue;
    }
    if(step.type==='write'){
      assert(taught.has(step.letter),`${label}: ${step.id} für ein noch nicht gezeigtes Zeichen`);
      assert(!step.prompt.includes(step.letter)&&!step.prompt.includes(step.lower),`${label}: ${step.id} verrät die Form im Prompt`);
      assert.equal(step.fallback?.type,'letter',`${label}: ${step.id} braucht einen Abruf ohne Zeichenfläche`);
      assert(P.isCorrect(step,'self-good')&&!P.isCorrect(step,'self-bad'));
      continue;
    }
    if(step.word){
      assert(!wordTargets.has(step.word),`${label}: Wort ${step.word} ist zweimal Ziel`);wordTargets.add(step.word);
      const word=P.WORDS.find(w=>w.w===step.word);
      for(const letter of word.letters)assert(taught.has(letter),`${label}: ${step.word} enthält ${letter}, das noch nicht gezeigt wurde`);
    }
    if(step.type==='build'){
      assert.equal(step.answer.join(''),step.correct,`${label}: Bauaufgabe ${step.word} inkonsistent`);
      const tiles=[...step.tiles];for(const ch of step.answer){const at=tiles.indexOf(ch);assert(at>=0,`${label}: Plättchen ${ch} fehlt für ${step.word}`);tiles.splice(at,1)}
      continue;
    }
    if(step.type==='kbd'){
      const word=P.WORDS.find(w=>w.w===step.word);
      assert(P.kbdWordOk(word),`${label}: ${step.word} taugt nicht für die Tastatur`);
      assert(!step.options,`${label}: ${step.id} darf keine Optionen anbieten`);
      assert(P.isCorrect(step,step.word)&&P.isCorrect(step,step.word.toLocaleUpperCase('uk'))&&P.isCorrect(step,`  ${step.word} `),`${label}: ${step.word} wird nicht als richtig erkannt`);
      assert(!P.isCorrect(step,P.typePrimary(step.word)),`${label}: die lateinische Lesung darf nicht als ukrainisches Wort gelten`);
      if(step.mode==='copy')assert.equal(step.display,step.word,`${label}: Abtippen zeigt das Wort`);
      else{
        // Schreiben aus Lesung oder Bedeutung: Das Wort selbst steht nirgends.
        assert.equal(step.mode,'recall');
        assert(progress.words[step.word]?.seen>0,`${label}: ${step.word} soll geschrieben werden, wurde aber nie gelesen`);
        for(const text of [step.display,step.note,step.prompt])assert(!String(text).toLocaleLowerCase('uk').includes(step.word.toLocaleLowerCase('uk')),`${label}: ${step.id} verrät die Schreibweise`);
        assert(/^[a-zA-ZäöüÄÖÜß ()\/-]+$/.test(step.display),`${label}: ${step.id} zeigt „${step.display}“ statt Lesung oder Bedeutung`);
      }
      assert(step.fallback&&step.fallback.type==='type'&&step.fallback.word===step.word,`${label}: ${step.id} braucht einen Abruf ohne Tastatur`);
      continue;
    }
    if(step.type==='type'){
      // Freier Abruf: keine Optionen, die Musterlesung gilt, die Lookalike-Falle nicht.
      assert(!step.options,`${label}: ${step.id} darf keine Optionen anbieten`);
      assert(P.isCorrect(step,step.correct),`${label}: Musterlesung von ${step.word} wird nicht akzeptiert`);
      assert(!P.isCorrect(step,'')&&!P.isCorrect(step,'   '),`${label}: leere Eingabe darf nicht zählen`);
      continue;
    }
    assert(step.options.length>=3,`${label}: ${step.id} hat nur ${step.options.length} Optionen`);
    assert.equal(new Set(step.options).size,step.options.length,`${label}: ${step.id} hat doppelte Optionen`);
    assert.equal(step.options.filter(o=>o===step.correct).length,1,`${label}: ${step.id} enthält die richtige Antwort nicht genau einmal`);
    if(step.type==='listen'){
      assert(P.LETTER_INFO[step.letter]&&step.letter!=='Ь',`${label}: ${step.id} ohne isolierte menschliche Aufnahme`);
      assert.equal(step.fallback?.type,'letter',`${label}: ${step.id} braucht einen Abruf ohne Ton`);
      assert.deepEqual([...step.fallback.options],[...step.options]);
      assert(!step.prompt.includes(step.letter),`${label}: ${step.id} verrät die Lösung im Prompt`);
    }
    if(step.type==='sound'||step.type==='letter'||step.type==='listen'){
      // Regel 4: nur Zeichen anbieten, die schon gezeigt wurden.
      const offered=step.type!=='sound'?step.options:step.options.map(say=>C.ALPHABET.find(c=>P.LETTER_INFO[c].say===say));
      for(const letter of offered)assert(taught.has(letter),`${label}: ${step.id} bietet ${letter} an, bevor es gezeigt wurde`);
      if(step.type==='letter')assert(!step.prompt.includes(step.correct),`${label}: ${step.id} verrät die Lösung im Prompt`);
    }
    if(step.type==='find'){
      for(const option of step.options){const w=P.WORDS.find(x=>x.w===option);assert(w,`${label}: unbekannte Wortoption ${option}`);for(const letter of w.letters)assert(allowedLetters.has(letter),`${label}: Option ${option} enthält unbekanntes ${letter}`)}
    }
    if(step.type==='say'){
      assert.equal(step.correct,P.translit(step.word),`${label}: Aussprache von ${step.word} stimmt nicht`);
      for(const option of step.options)assert(/^[a-z]+$/.test(option),`${label}: Ausspracheoption „${option}“ ist keine Lesehilfe`);
    }
  }
  return run;
}

const LOOKALIKES=new Set(['Н','Р','С','В','У','Х']);
assert.equal(C.ALPHABET.filter(c=>!P.needsTrace(c)).sort().join(''),[...'АОКМТЕНРСВУХІ'].sort().join(''),'nachgeschrieben werden genau die Zeichen mit neuer Form');
let lessons=0,steps=0;
for(let seed=1;seed<=40;seed++){
  const rng=rngFor(seed*7717);
  let progress=P.freshProgress();
  for(let index=0;index<P.LESSONS.length;index++){
    assert.equal(P.nextLessonIndex(progress),index,'Lektionen müssen der Reihe nach frei werden');
    const run=auditRun(P.buildLesson(index,progress,rng),`seed ${seed} Lektion ${index+1}`,{progress});
    // Jede Lektion zeigt jeden neuen Buchstaben und lässt ihn lesen.
    const lesson=P.LESSONS[index];
    for(const letter of lesson.letters){
      assert(run.steps.some(s=>s.type==='teach'&&s.letter===letter),`Lektion ${index+1}: ${letter} wird nicht gezeigt`);
      assert(run.steps.some(s=>s.word&&P.WORDS.find(w=>w.w===s.word).letters.includes(letter)),`Lektion ${index+1}: ${letter} kommt in keinem gelesenen Wort vor`);
      // Falsche Freunde: erst raten, direkt danach die Lernkarte.
      const teachAt=run.steps.findIndex(s=>s.type==='teach'&&s.letter===letter);
      if(LOOKALIKES.has(letter))assert.equal(run.steps[teachAt-1]?.id,`guess:${letter}`,`Lektion ${index+1}: ${letter} braucht den Vortest direkt vor der Lernkarte`);
      else assert(!run.steps.some(s=>s.type==='guess'&&s.letter===letter),`Lektion ${index+1}: ${letter} ist kein falscher Freund`);
      // Neue Formen werden direkt nach der Lernkarte nachgeschrieben.
      if(P.needsTrace(letter))assert.equal(run.steps[teachAt+1]?.id,`trace:${letter}`,`Lektion ${index+1}: ${letter} wird nicht nachgeschrieben`);
    }
    // Jede Lektion verlangt mindestens einmal freien Abruf.
    assert(run.steps.some(s=>s.type==='type'),`Lektion ${index+1}: kein getipptes Wort`);
    assert(run.steps.length<=26,`Lektion ${index+1} ist mit ${run.steps.length} Schritten zu lang für fünf Minuten`);
    // Fehler: derselbe Inhalt kommt in ANDERER Form zurück, genau einmal.
    const results=[];
    for(const step of [...run.steps]){
      const good=step.type==='teach'||rng()>.3;
      results.push({step,good});
      if(!good){
        const retry=P.retryStep(step,run,rng);
        if(retry){
          assert(retry.retry,'Wiederholung muss markiert sein');
          assert.equal(P.retryStep(retry,run,rng),null,'eine Wiederholung darf nicht endlos wiederkehren');
          if(step.word)assert.equal(retry.word,step.word,'Wiederholung muss denselben Inhalt prüfen');
          if(step.letter&&!step.word)assert.equal(retry.letter,step.letter,'Wiederholung muss denselben Buchstaben prüfen');
          const alternatives=step.word?['read','say','find','build','type'].filter(t=>t!==step.type):['sound','letter'].filter(t=>t!==step.type);
          if(alternatives.includes(retry.type))assert.notEqual(retry.type,step.type);
          run.steps.push(retry);results.push({step:retry,good:true});
        }
      }
    }
    progress=P.applyResult(progress,run,results,1000+index);
    lessons++;steps+=run.steps.length;
    // Regel 5: Speichern und Laden verändert nichts.
    const reloaded=P.normalizeProgress(JSON.parse(JSON.stringify(progress)));
    assert.deepEqual(reloaded,progress,'Fortschritt muss Speichern und Laden unverändert überstehen');
    assert.equal(P.highestDoneIndex(reloaded),index);
  }
  assert.equal(P.nextLessonIndex(progress),-1,'nach acht Lektionen ist der Pfad abgeschlossen');
  assert.equal(P.knownLetters(progress).length,33,'nach dem Pfad sind alle 33 Buchstaben eingeführt');

  // Lesetraining: neue Wörter, keine Dubletten, über viele Runden hinweg frisch.
  const practiced=new Set();
  for(let round=0;round<6;round++){
    const run=auditRun(P.buildPractice(progress,rng,10),`seed ${seed} Training ${round+1}`,{progress});
    const words=run.steps.filter(s=>s.word).map(s=>s.word);
    for(const word of words){assert(!practiced.has(word),`Training wiederholt ${word}, obwohl noch ungelesene Wörter da sind`);practiced.add(word)}
    progress=P.applyResult(progress,run,run.steps.map(step=>({step,good:true})),5000+round);
  }
}

// ------------------------------------------- Lesetraining bei knappem Vorrat
// Nach Lektion 1 gibt es nur zwölf Wörter. Das Training darf dann nicht heimlich
// wiederholen: Solange Ungelesenes da ist, kommt NUR Ungelesenes; danach ist der
// Durchgang als Wiederholung ausgewiesen und wechselt die Aufgabenform.
for(let seed=1;seed<=30;seed++){
  const rng=rngFor(seed*31337);
  let progress=P.freshProgress();
  const lesson=P.buildLesson(0,progress,rng);
  progress=P.applyResult(progress,lesson,lesson.steps.map(step=>({step,good:true})),100);
  let sawReview=false;
  for(let round=0;round<5;round++){
    const fresh=new Set(P.freshWords(progress).map(word=>word.w));
    const run=P.buildPractice(progress,rng,10);
    const words=run.steps.filter(step=>step.word);
    assert.equal(new Set(words.map(step=>step.word)).size,words.length,'kein Wort zweimal in einem Durchgang');
    assert(words.length>=1,'ein Training ohne Wort ist kein Lesetraining');
    if(fresh.size>=P.FRESH_MINIMUM){
      assert.equal(run.review,false,`seed ${seed}: mit ${fresh.size} ungelesenen Wörtern ist es keine Wiederholung`);
      for(const step of words)assert(fresh.has(step.word),`seed ${seed}: ${step.word} wurde wiederholt, obwohl ${fresh.size} Wörter ungelesen sind`);
    }else{
      assert.equal(run.review,true,`seed ${seed}: ohne neue Wörter muss der Durchgang als Wiederholung ausgewiesen sein`);
      sawReview=true;
      // Eine Wiederholung stellt die Aufgabe anders als beim letzten Mal, wo das geht.
      const changed=words.filter(step=>progress.words[step.word]&&progress.words[step.word].type!==step.type).length;
      const repeated=words.filter(step=>progress.words[step.word]).length;
      assert(changed>=Math.ceil(repeated*.6),`seed ${seed}: nur ${changed} von ${repeated} wiederholten Wörtern in neuer Aufgabenform`);
    }
    progress=P.applyResult(progress,run,run.steps.map(step=>({step,good:true})),200+round);
  }
  assert(sawReview,'nach zwölf Wörtern muss das Training in die Wiederholung wechseln');
  assert.equal(P.freshWords(progress).length<P.FRESH_MINIMUM,true);
}
assert.equal(P.freshWords(P.freshProgress()).length,0,'vor der ersten Lektion gibt es nichts zu trainieren');

// ------------------------------------------------------ Tippen (freier Abruf)
// Großzügig bei gleichwertigen Schreibweisen, streng bei den Fallen.
{
  const yes=[['ресторан','restoran'],['ресторан',' Restoran '],['шоколад','schokolad'],['шоколад','shokolad'],['гітара','hitara'],['Київ','kyjiw'],['Київ','Kyiv'],['чай','tschaj'],['чай','chay'],['каса','kassa'],['каса','kasa'],['вода','woda'],['вода','voda'],['журнал','schurnal'],['журнал','zhurnal'],['Запоріжжя','saporischschja'],['фільм','film'],['комп’ютер','kompjuter'],['борщ','borschtsch'],['центр','zentr'],['Україна','ukrajina'],['Європа','jewropa'],['хліб','chlib']];
  const no=[['ресторан','pectopah'],['ресторан','restorah'],['ресторан','pestoran'],['ресторан','rectoran'],['гітара','gitara'],['вода','boda'],['курс','kypc'],['курс','kyrs'],['хор','xor'],['хор','hor'],['ресторан',''],['ресторан','restoran1x'],['кіт','kyt-x'],['мама','mam'],['мама','mamaa']];
  for(const [word,input] of yes)assert(P.typeMatch(word,input),`„${input}“ muss als Lesung von ${word} gelten`);
  for(const [word,input] of no)assert(!P.typeMatch(word,input),`„${input}“ darf nicht als Lesung von ${word} gelten`);
  // Jedes Wort ist tippbar, seine Musterlesung gilt, und jede Lookalike-Lesung ist falsch.
  const latin={'н':'h','р':'p','с':'c','в':'b','у':'y','х':'x'};
  let traps=0;
  for(const word of P.WORDS){
    const primary=P.typePrimary(word.w);
    assert(primary&&/^[a-z]+$/.test(primary),`${word.w}: keine Musterlesung`);
    assert(P.typeMatch(word.w,primary),`${word.w}: Musterlesung „${primary}“ wird abgelehnt`);
    if(word.sayable)assert(P.typeMatch(word.w,P.translit(word.w)),`${word.w}: Lesehilfe „${P.translit(word.w)}“ wird abgelehnt`);
    const chars=[...word.w.toLocaleLowerCase('uk')];
    chars.forEach((ch,at)=>{
      if(!latin[ch])return;
      const fooled=chars.map((c,i)=>i===at?latin[c]:P.typePrimary(c)).join('');
      assert(!P.typeMatch(word.w,fooled),`${word.w}: die Falle „${fooled}“ würde als richtig gelten`);traps++;
    });
    // Wörter ohne erratbare Bedeutung müssen über das Tippen erreichbar sein.
    if(!word.cog)assert([...word.w].length>=2,`${word.w}: zu kurz für eine Tippaufgabe`);
  }
  assert(traps>300,`zu wenige Fallen geprüft: ${traps}`);
}

const DAYMS=86400000,T0=Date.UTC(2026,10,20,12);
function finishLesson(progress,index,rng,now){const run=P.buildLesson(index,progress,rng);return P.applyResult(progress,run,run.steps.map(step=>({step,good:true})),now)}
// ------------------------------------------------- Ukrainische Tastatur
{
  // Bewertung: Groß/klein, Leerzeichen und Apostrophformen sind egal – Buchstaben nicht.
  for(const [target,input] of [['мама','мама'],['мама','Мама '],['Київ','київ'],['Київ','КИЇВ'],['ґудзик','ҐУДЗИК']])assert(P.kbdMatch(target,input),`„${input}“ muss als ${target} gelten`);
  for(const [target,input] of [['мама','мамa'],['мама','mama'],['мама','маа'],['мама',''],['мама','мамаа'],['кіт','кит'],['Київ','Киев'],['гол','ґол']])assert(!P.kbdMatch(target,input),`„${input}“ darf nicht als ${target} gelten`);
  // Falsche Tastatur wird erkannt – auch ein einzelnes lateinisches Zeichen, das gleich aussieht.
  assert.equal(P.kbdDiagnose('pectopah'),'latin');assert.equal(P.kbdDiagnose('мамa'),'latin');assert.equal(P.kbdDiagnose('Tak'),'latin');
  assert.equal(P.kbdDiagnose('рэсторан'),'russian');assert.equal(P.kbdDiagnose('ёж'),'russian');assert.equal(P.kbdDiagnose('объект'),'russian');
  for(const word of P.WORDS)assert.equal(P.kbdDiagnose(word.w),'',`${word.w} darf nicht als falsche Tastatur gelten`);
  // Die abgebildete Tastenbelegung enthält genau die Tasten der ukrainischen Tastatur (ґ liegt auf г).
  assert.equal([...P.KBD_LAYOUT.join('')].sort().join(''),C.ALPHABET.map(c=>C.DATA[c].lower).filter(c=>c!=='ґ').sort().join(''));
  let usable=0;
  for(const word of P.WORDS){if(!P.kbdWordOk(word))continue;usable++;assert(!word.w.includes('’'),`${word.w}: Apostroph liegt auf jeder Tastatur woanders`);assert(P.kbdMatch(word.w,word.w))}
  assert(usable>=400,`zu wenige Wörter für die Tastatur: ${usable}`);
  // Die Einstellung übersteht Speichern und Laden; Unsinn wird zu „nicht eingerichtet“.
  for(const [raw,expected] of [[true,true],[false,false],[null,null],['ja',null],[1,null],[undefined,null]])assert.equal(P.normalizeProgress({keyboard:raw}).keyboard,expected);
}
// Lektionen, Lesetraining und Auffrischung mit eingerichteter Tastatur.
{
  const forms=new Set();
  for(let seed=1;seed<=20;seed++){
    const rng=rngFor(seed*5381);
    let progress=P.freshProgress();progress.keyboard=true;
    for(let index=0;index<P.LESSONS.length;index++){
      const run=auditRun(P.buildLesson(index,progress,rng),`Tastatur seed ${seed} Lektion ${index+1}`,{progress});
      assert(run.steps.some(step=>step.type==='kbd'),`Lektion ${index+1}: mit Tastatur wird kein Wort geschrieben`);
      assert(!run.steps.some(step=>step.type==='build'),`Lektion ${index+1}: mit Tastatur ersetzt echtes Schreiben die Plättchen`);
      assert(run.steps.length<=26,`Lektion ${index+1} ist mit Tastatur zu lang: ${run.steps.length}`);
      run.steps.forEach(step=>forms.add(step.type));
      // Ein Schreibfehler kommt in anderer Form wieder – nicht noch einmal als Tippaufgabe.
      const typed=run.steps.find(step=>step.type==='kbd'),retry=P.retryStep(typed,run,rng);
      assert(retry&&retry.word===typed.word&&retry.type!=='kbd');
      const letterStep=run.steps.find(step=>step.type==='kbdletter');
      if(letterStep){const again=P.retryStep(letterStep,run,rng);assert(again&&again.letter===letterStep.letter&&again.type==='sound')}
      progress=P.applyResult(progress,run,run.steps.map(step=>({step,good:true})),T0+index*DAYMS);
      assert.equal(P.normalizeProgress(JSON.parse(JSON.stringify(progress))).keyboard,true);
    }
    for(let round=0;round<3;round++){
      const run=auditRun(P.buildPractice(progress,rng,10),`Tastatur seed ${seed} Training ${round+1}`,{progress});
      assert(run.steps.some(step=>step.type==='kbd'),'Lesetraining mit Tastatur enthält Schreiben');
      progress=P.applyResult(progress,run,run.steps.map(step=>({step,good:true})),T0+(20+round)*DAYMS);
    }
    // Auffrischung: Fach 2 und 3 nutzen Tippen und Diktat.
    for(const letter of C.ALPHABET){progress.srs[letter].box=2+seed%2;progress.srs[letter].reviews=Math.floor(seed/2)%4;progress.srs[letter].lapses=0;progress.srs[letter].due=P.day(T0)}
    const review=P.buildReview(progress,rng,T0);
    const known=new Set(P.knownLetters(progress));
    for(const step of review.steps){
      forms.add(step.type);
      assert(known.has(step.srsLetter));
      for(let alternative=step.fallback;alternative;alternative=alternative.fallback)assert.equal(alternative.srsLetter,step.srsLetter,'jeder Ersatzabruf zählt für denselben Buchstaben');
    }
  }
  for(const form of ['kbd','kbdletter','dictate'])assert(forms.has(form),`mit Tastatur kommt die Form ${form} nie vor`);
}
// Tastaturtraining.
{
  assert.equal(P.buildTyping(P.freshProgress(),rngFor(1)),null,'Tastaturtraining gibt es erst nach der ersten Lektion');
  let copies=0,recalls=0;
  for(let seed=1;seed<=30;seed++){
    const rng=rngFor(seed*6151);
    let progress=P.freshProgress();progress.keyboard=true;
    const count=1+seed%8;
    for(let index=0;index<count;index++)progress=finishLesson(progress,index,rng,T0+index*DAYMS);
    // Ein Buchstabe mit Fehlern muss im Training vorkommen.
    const weak=P.LESSONS[0].letters[seed%6];progress.letters[weak]=P.normalizeProgress({letters:{[weak]:{ok:0,bad:5}}}).letters[weak];
    const run=P.buildTyping(progress,rng,10);
    assert.equal(run.kind,'typing');
    assert(run.steps.length>=7&&run.steps.length<=10,`Tastaturtraining hat ${run.steps.length} Schritte`);
    assert.equal(new Set(run.steps.map(step=>step.id)).size,run.steps.length);
    const allowed=new Set(P.lettersUpTo(count-1));
    for(const step of run.steps){
      assert(['kbd','kbdletter','dictate'].includes(step.type),`Tastaturtraining enthält ${step.type}`);
      if(step.word){
        for(const letter of P.WORDS.find(w=>w.w===step.word).letters)assert(allowed.has(letter),`${step.word} enthält ${letter} aus einer späteren Lektion`);
        const seen=(progress.words[step.word]?.seen||0)>0;
        if(step.mode==='recall'){assert(seen,`${step.word} wird aus dem Gedächtnis verlangt, ohne je gelesen zu sein`);recalls++}
        else{assert(!seen||!(P.WORDS.find(w=>w.w===step.word).sayable||P.WORDS.find(w=>w.w===step.word).cog));copies++}
      }else assert(allowed.has(step.letter));
    }
    assert(run.steps.some(step=>!step.word&&step.letter===weak),`der schwache Buchstabe ${weak} fehlt im Tastaturtraining`);
    assert(run.steps.filter(step=>step.word).length>=4,'zu wenige Wörter im Tastaturtraining');
    const after=P.applyResult(progress,run,run.steps.map(step=>({step,good:true})),T0+30*DAYMS);
    assert.equal(after.typingRuns,1);
    assert.deepEqual(P.normalizeProgress(JSON.parse(JSON.stringify(after))),after);
  }
  assert(copies>20&&recalls>20,`Abtippen (${copies}) und Schreiben aus dem Gedächtnis (${recalls}) müssen beide vorkommen`);
}

// ------------------------------------------------------ Verteiltes Wiederholen
{
  const rng=rngFor(4711);
  let progress=finishLesson(P.freshProgress(),0,rng,T0);
  const letters=P.LESSONS[0].letters;
  for(const letter of letters)assert.equal(progress.srs[letter].box,1,`${letter} startet in Fach 1`);
  assert.equal(P.dueLetters(progress,T0).length,0,'am Lerntag selbst ist nichts fällig');
  assert.equal(P.buildReview(progress,rng,T0),null,'ohne fällige Buchstaben gibt es keine Auffrischung');
  assert.equal(P.dueLetters(progress,T0+DAYMS).length,letters.length,'am nächsten Tag ist die Lektion fällig');
  assert.equal(P.srsSummary(progress,T0).nextInDays,1);
  // Kalendertage, nicht 24 Stunden: abends gelernt, morgens fällig.
  assert.equal(P.day(T0+DAYMS)-P.day(T0),1);
  // Richtige Abrufe: Abstände wachsen genau nach Plan.
  let now=T0;
  for(let box=1;box<P.SRS_INTERVALS.length-1;box++){
    now+=P.SRS_INTERVALS[box]*DAYMS;
    assert.equal(P.dueLetters(progress,now-DAYMS).length,0,`Fach ${box}: einen Tag vorher darf noch nichts fällig sein`);
    const run=P.buildReview(progress,rng,now);
    assert.equal(run.kind,'review');
    assert.equal(run.steps.length,letters.length,'ein Abruf je fälligem Buchstaben');
    assert.equal(new Set(run.steps.map(step=>step.srsLetter)).size,letters.length,'jeder fällige Buchstabe genau einmal');
    assert.equal(new Set(run.steps.map(step=>step.id)).size,run.steps.length);
    for(const step of run.steps){
      assert(letters.includes(step.srsLetter));
      assert(!step.ungraded,'Auffrischung ist immer bewerteter Abruf');
      if(step.word)assert(P.WORDS.find(w=>w.w===step.word).letters.includes(step.srsLetter),`${step.word} enthält ${step.srsLetter} nicht`);
      if(step.fallback)assert.equal(step.fallback.srsLetter,step.srsLetter,'auch der Ersatzabruf zählt für denselben Buchstaben');
    }
    progress=P.applyResult(progress,run,run.steps.map(step=>({step,good:true})),now);
    for(const letter of letters){
      assert.equal(progress.srs[letter].box,box+1);
      assert.equal(progress.srs[letter].due,P.day(now)+P.SRS_INTERVALS[box+1]);
    }
    assert.deepEqual(P.normalizeProgress(JSON.parse(JSON.stringify(progress))),progress,'der Wiederholungsplan übersteht Speichern und Laden');
  }
  assert.equal(P.srsSummary(progress,now).secure,letters.length,'nach wachsenden Abständen gelten die Buchstaben als gefestigt');
  // Über das letzte Fach hinaus geht es nicht.
  now+=P.SRS_INTERVALS.at(-1)*DAYMS;
  let run=P.buildReview(progress,rng,now);
  progress=P.applyResult(progress,run,run.steps.map(step=>({step,good:true})),now);
  for(const letter of letters)assert.equal(progress.srs[letter].box,P.SRS_INTERVALS.length-1);
  // Ein Fehler wirft genau diesen Buchstaben zurück – morgen wieder.
  now+=P.SRS_INTERVALS.at(-1)*DAYMS;
  run=P.buildReview(progress,rng,now);
  const failed=run.steps[0].srsLetter;
  progress=P.applyResult(progress,run,run.steps.map((step,i)=>({step,good:i>0})),now);
  assert.equal(progress.srs[failed].box,1);assert.equal(progress.srs[failed].lapses,1);
  assert.equal(P.dueLetters(progress,now+DAYMS).join(''),failed,'nur der vergessene Buchstabe ist morgen fällig');
  // Die Wiederholung im selben Durchgang ändert das Fach nicht noch einmal.
  const retry=P.retryStep(run.steps[0],run,rng);
  if(retry){const before=JSON.stringify(progress.srs[failed]);P.applyResult(progress,{kind:'review',index:0,steps:[retry]},[{step:retry,good:true}],now);assert.equal(JSON.stringify(progress.srs[failed]),before)}
}
// Ein Fehler im Lesetraining wirft einen gefestigten Buchstaben ebenfalls zurück.
{
  const rng=rngFor(99);
  let progress=finishLesson(P.freshProgress(),0,rng,T0);
  progress.srs['К'].box=4;progress.srs['К'].due=P.day(T0)+14;
  const step={id:'sound:К',type:'sound',letter:'К',options:['k','m'],correct:'k'};
  progress=P.applyResult(progress,{kind:'practice',index:0,steps:[step]},[{step,good:false}],T0+DAYMS);
  assert.equal(progress.srs['К'].box,1);assert.equal(progress.srs['К'].due,P.day(T0+DAYMS)+1);
  // Unbewertetes (Raten, Nachschreiben) berührt den Plan nie.
  const guess={id:'guess:К',type:'guess',ungraded:true,letter:'К',options:['k','x'],correct:'k'};
  const before=JSON.stringify(progress);
  P.applyResult(progress,{kind:'practice',index:0,steps:[guess]},[{step:guess,good:false}],T0+DAYMS);
  assert.equal(JSON.stringify({...progress,practiceRuns:0}),JSON.stringify({...JSON.parse(before),practiceRuns:0}),'ein falsch geratener Vortest ändert nichts am Lernstand');
}
// Alle Buchstaben fällig: höchstens zwölf je Auffrischung, Verwechslungspartner nebeneinander.
{
  let adjacent=0,possible=0,forms=new Set();
  for(let seed=1;seed<=40;seed++){
    const rng=rngFor(seed*977);
    const progress=P.freshProgress();
    P.LESSONS.forEach(lesson=>{progress.done[lesson.id]={at:T0,runs:1}});
    // Fortschritt aus der Zeit vor dem Plan: alles sofort fällig.
    assert.equal(P.ensureSchedule(progress,T0),true);
    assert.equal(P.ensureSchedule(progress,T0),false,'der Plan wird nur einmal angelegt');
    assert.equal(P.dueLetters(progress,T0).length,33);
    assert.equal(P.buildReview(progress,rng,T0).steps.length,P.REVIEW_LIMIT,'eine Auffrischung bleibt kurz, auch wenn alles fällig ist');
    // Zwölf fällige Buchstaben, darunter fünf Verwechslungspaare.
    const dueNow=new Set(['И','І','Г','Ґ','Ш','Щ','Ц','Ч','Ю','Я','А','Ь']);
    for(const letter of C.ALPHABET){progress.srs[letter].box=1+seed%3;progress.srs[letter].reviews=seed%4;if(!dueNow.has(letter))progress.srs[letter].due=P.day(T0)+5}
    const run=P.buildReview(progress,rng,T0);
    assert.equal(run.steps.length,dueNow.size);
    assert.equal(new Set(run.steps.map(step=>step.srsLetter)).size,dueNow.size);
    for(const step of run.steps)assert(dueNow.has(step.srsLetter),`${step.srsLetter} ist nicht fällig`);
    const order=run.steps.map(step=>step.srsLetter);
    run.steps.forEach(step=>forms.add(step.type));
    for(const [a,b] of [['И','І'],['Г','Ґ'],['Ш','Щ'],['Ц','Ч'],['Ю','Я']]){
      if(!order.includes(a)||!order.includes(b))continue;
      possible++;if(Math.abs(order.indexOf(a)-order.indexOf(b))===1)adjacent++;
    }
    // Ь hat keine isolierte Aufnahme und wird nie über das Ohr abgefragt.
    assert(!run.steps.some(step=>step.type==='listen'&&step.letter==='Ь'));
  }
  assert(possible>=20,`zu wenige Paare gemeinsam fällig: ${possible}`);
  assert(adjacent/possible>=.7,`Verwechslungspartner stehen nur in ${adjacent} von ${possible} Fällen nebeneinander`);
  for(const form of ['sound','letter','listen','type','write'])assert(forms.has(form),`Auffrischung nutzt die Form ${form} nie`);
}
// Beschädigter Plan wird bereinigt statt übernommen.
{
  const progress=P.normalizeProgress({done:{l1:{at:1,runs:1}},srs:{'А':{box:99,due:'x',lapses:-3},'Q':{box:1},'К':null,'М':'kaputt'}});
  assert.equal(JSON.stringify(Object.keys(progress.srs)),JSON.stringify(['А']));
  assert.equal(progress.srs['А'].box,P.SRS_INTERVALS.length-1);assert.equal(progress.srs['А'].lapses,0);assert.equal(progress.srs['А'].due,0);
}

// ------------------------------------------------- Bewertung des Nachschreibens
{
  const size=400,mask=new Uint8Array(size),fat=new Uint8Array(size);
  for(let i=100;i<200;i++)mask[i]=1;
  for(let i=80;i<220;i++)fat[i]=1;
  const ink=(from,to)=>{const out=new Uint8Array(size);for(let i=from;i<to;i++)out[i]=1;return out};
  assert.equal(C.pathTraceVerdict(C.pathTraceScore(mask,fat,ink(95,205))),true,'sauber nachgezogen');
  assert.equal(C.pathTraceVerdict(C.pathTraceScore(mask,fat,ink(0,0))),false,'ohne Strich ist nichts getroffen');
  assert.equal(C.pathTraceVerdict(C.pathTraceScore(mask,fat,ink(300,400))),false,'daneben gezeichnet');
  assert.equal(C.pathTraceVerdict(C.pathTraceScore(mask,fat,ink(100,130))),false,'nur ein Stück der Form');
  assert.equal(C.pathTraceVerdict(C.pathTraceScore(mask,fat,ink(0,400))),false,'die ganze Fläche vollmalen zählt nicht');
  const score=C.pathTraceScore(mask,fat,ink(100,150));
  assert.equal(score.covered,.5);assert.equal(score.outside,0);
  assert.equal(C.pathTraceVerdict(null),false);
}

// ---------------------------------------------------------------- Kurztest
// Wer Vorwissen hat, darf eine Lektion überspringen – aber nur mit Beleg.
let checks=0;
for(let seed=1;seed<=20;seed++){
  const rng=rngFor(seed*104729);
  let progress=P.freshProgress();
  for(let index=0;index<P.LESSONS.length;index++){
    const lesson=P.LESSONS[index],run=P.buildCheck(index,progress,rng);
    assert.equal(run.kind,'check');
    assert(!run.steps.some(step=>step.type==='teach'),`Kurztest ${index+1}: ein Test erklärt nicht`);
    assert.equal(new Set(run.steps.map(step=>step.id)).size,run.steps.length,`Kurztest ${index+1}: doppelter Schritt`);
    // Jeder Buchstabe der Lektion wird einzeln geprüft, dazu mindestens zwei Wörter.
    for(const letter of lesson.letters)assert(run.steps.some(step=>!step.word&&step.letter===letter),`Kurztest ${index+1}: ${letter} wird nicht einzeln geprüft`);
    assert(run.steps.filter(step=>step.word).length>=2,`Kurztest ${index+1}: zu wenige Wörter`);
    assert(run.steps.length<=10,`Kurztest ${index+1} ist mit ${run.steps.length} Schritten kein Kurztest mehr`);
    const allowed=new Set(P.lettersUpTo(index));
    for(const step of run.steps){
      if(step.word)for(const letter of P.WORDS.find(w=>w.w===step.word).letters)assert(allowed.has(letter),`Kurztest ${index+1}: ${step.word} enthält ${letter} aus einer späteren Lektion`);
      if(step.options){
        assert.equal(step.options.filter(o=>o===step.correct).length,1,`Kurztest ${index+1}: ${step.id} ohne eindeutige Lösung`);
        if(step.type==='letter')for(const option of step.options)assert(allowed.has(option),`Kurztest ${index+1}: ${option} gehört in eine spätere Lektion`);
      }
    }
    const answer=mistakes=>run.steps.map((step,i)=>({step,good:i>=mistakes}));
    // Zwei Fehler: nicht bestanden, nichts wird freigeschaltet.
    assert.equal(P.checkPassed(run,answer(2)),false,'zwei Fehler dürfen nicht reichen');
    const failed=P.applyResult(structuredClone(progress),run,answer(2),10);
    assert.equal(P.nextLessonIndex(failed),index,'ein nicht bestandener Kurztest darf keine Lektion freischalten');
    // Abgebrochen (nicht alle Schritte beantwortet): ebenfalls nicht bestanden.
    assert.equal(P.checkPassed(run,answer(0).slice(0,run.steps.length-1)),false,'ein unvollständiger Kurztest zählt nicht');
    // Höchstens ein Fehler: bestanden, die Lektion zählt als erledigt.
    assert.equal(P.checkPassed(run,answer(1)),true);
    progress=P.applyResult(progress,run,answer(seed%2),20+index);
    assert.equal(P.highestDoneIndex(progress),index,'ein bestandener Kurztest schaltet genau diese Lektion frei');
    assert.deepEqual(P.normalizeProgress(JSON.parse(JSON.stringify(progress))),progress);
    checks++;
  }
  assert.equal(P.knownLetters(progress).length,33);
}
// Ein Lektions- oder Trainingslauf ist nie ein „bestandener Kurztest“.
assert.equal(P.checkPassed(P.buildLesson(0,P.freshProgress(),rngFor(2)),[]),false);
assert.equal(P.buildCheck(99,P.freshProgress(),rngFor(2)),null);

// Beschädigte oder fremde Daten dürfen den Pfad nicht zerstören.
for(const junk of [null,undefined,42,'x',[],{done:'kaputt',words:{'нет':{seen:'a'}},letters:{Q:{ok:1}},sound:'ja'}]){
  const progress=P.normalizeProgress(junk);
  assert.equal(P.nextLessonIndex(progress),0);
  assert.deepEqual(Object.keys(progress.words),[]);
  assert.doesNotThrow(()=>P.buildLesson(0,progress,rngFor(3)));
}
assert.equal(P.buildPractice(P.freshProgress(),rngFor(1)),null,'Lesetraining gibt es erst nach der ersten Lektion');
// Eine Lücke im Verlauf schaltet nichts Späteres frei.
{const gap=P.freshProgress();gap.done.l3={at:1,runs:1};assert.equal(P.highestDoneIndex(gap),-1);assert.equal(P.knownLetters(gap).length,0)}

console.log('Alphabet Lab V7.1 Lernpfad: OK',JSON.stringify({wörter:P.WORDS.length,lektionen:lessons,schritte:steps,kurztests:checks}));
