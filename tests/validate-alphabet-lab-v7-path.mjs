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
    assert(step.options.length>=3,`${label}: ${step.id} hat nur ${step.options.length} Optionen`);
    assert.equal(new Set(step.options).size,step.options.length,`${label}: ${step.id} hat doppelte Optionen`);
    assert.equal(step.options.filter(o=>o===step.correct).length,1,`${label}: ${step.id} enthält die richtige Antwort nicht genau einmal`);
    if(step.type==='sound'||step.type==='letter'){
      // Regel 4: nur Zeichen anbieten, die schon gezeigt wurden.
      const offered=step.type==='letter'?step.options:step.options.map(say=>C.ALPHABET.find(c=>P.LETTER_INFO[c].say===say));
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
    }
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
          const alternatives=step.word?['read','say','find','build'].filter(t=>t!==step.type):['sound','letter'].filter(t=>t!==step.type);
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

console.log('Alphabet Lab V7 Lernpfad: OK',JSON.stringify({wörter:P.WORDS.length,lektionen:lessons,schritte:steps,kurztests:checks}));
