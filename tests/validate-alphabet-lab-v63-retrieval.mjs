import assert from 'node:assert/strict';
import {loadV61,NOW,rngFor,primeLetter,seedSkill} from './alphabet-v5-test-utils.mjs';

// V6.3 · Abruf statt Wiedererkennung.
//
// Zwei Zusicherungen:
//   1. Die Zahl der Optionen wächst mit der Sicherheit. Wer einen Skill
//      beherrscht, bekommt weniger Auswahlhilfe – bis hin zum vollständigen
//      Alphabet. Die Ratewahrscheinlichkeit sinkt damit von 25 % auf 3 %.
//   2. Anfänger bleiben geschützt: Auf der untersten Stufe bleibt es bei vier
//      Optionen. Die Leiter darf nie rückwärts laufen.

const C=loadV61();

function stateAt(ratio){
  const state=C.freshState();
  for(const letter of C.ALPHABET)primeLetter(C,state,letter,{ratio});
  return C.migrate(state);
}

// ------------------------------------------------------------ Optionsleiter
// Für jeden Buchstaben: mehr Schwierigkeit heißt nie weniger Optionen.
{
  const state=stateAt(.9);
  const session=C.createAdaptiveSession(state,{targetMainCount:30,title:'l',preset:'l'});
  for(const family of ['sound-to-letter','visual-to-sound','lower-to-upper','missing-letter']){
    const skill=C.QUESTION_FAMILIES[family].skill;
    for(const letter of C.ALPHABET){
      if(!C.familyAllowedFor(letter,family))continue;
      let previous=0;
      for(let difficulty=C.QUESTION_FAMILIES[family].min;difficulty<=C.QUESTION_FAMILIES[family].max;difficulty++){
        const task=C.buildV4Task(state,letter,skill,difficulty,family,session,rngFor(difficulty*17+letter.codePointAt(0)),{});
        const count=(task.options||[]).length;
        if(task.family!==family)continue; // Familie wurde ersetzt (z. B. fehlendes Wort)
        assert(count>=previous,`${family}/${letter}: Optionen sinken von ${previous} auf ${count} bei Schwierigkeit ${difficulty}`);
        assert(count>=2,`${family}/${letter}: zu wenige Optionen`);
        assert(new Set(task.options).size===count,`${family}/${letter}: doppelte Optionen`);
        assert(task.options.includes(task.correct),`${family}/${letter}: richtige Antwort fehlt`);
        previous=count;
      }
    }
  }
}

// Anfänger bekommen vier Optionen, Fortgeschrittene mehr.
{
  const beginner=stateAt(.1),advanced=stateAt(.95);
  const session=C.createAdaptiveSession(beginner,{targetMainCount:30,title:'b',preset:'b'});
  const optionsFor=(state,difficulty)=>C.buildV4Task(state,'Ш','soundToLetter',difficulty,'sound-to-letter',session,rngFor(99),{}).options.length;
  assert.equal(optionsFor(beginner,0),4,'auf der untersten Stufe bleibt es bei vier Optionen');
  assert.equal(optionsFor(beginner,1),4,'Stufe 1 bleibt bei vier Optionen');
  assert(optionsFor(advanced,3)>=6,'ab mittlerer Sicherheit mindestens sechs Optionen');
  assert(optionsFor(advanced,4)>=8,'bei hoher Sicherheit mindestens acht Optionen');
}

// Kontrastfamilien behalten ihr enges Paar: dort IST die Verwechslung die Aufgabe.
{
  const state=stateAt(.95);
  const session=C.createAdaptiveSession(state,{targetMainCount:30,title:'c',preset:'c'});
  for(const letter of ['Ш','Б','И']){
    const task=C.buildV4Task(state,letter,'confusionDiscrimination',5,'sound-contrast',session,rngFor(5),{});
    assert.equal(task.options.length,2,`sound-contrast/${letter} muss ein Paar bleiben`);
  }
}

// --------------------------------------------------------- Vollalphabet-Abruf
{
  const state=stateAt(.95);
  const session=C.createAdaptiveSession(state,{targetMainCount:30,title:'r',preset:'r'});
  // Ь hat keinen eigenen isolierten Laut und bleibt ausgenommen.
  assert(!C.familyAllowedFor('Ь','alphabet-recall'),'Ь darf nicht über isolierten Buchstabenabruf laufen');
  let built=0;
  for(const letter of C.ALPHABET){
    if(!C.familyAllowedFor(letter,'alphabet-recall'))continue;
    const task=C.buildV4Task(state,letter,'soundToLetter',5,'alphabet-recall',session,rngFor(letter.codePointAt(0)),{});
    assert.equal(task.family,'alphabet-recall',`${letter}: Familie wurde ersetzt`);
    assert.equal(task.options.length,33,`${letter}: der Abruf muss das ganze Alphabet anbieten`);
    assert.equal(new Set(task.options).size,33,`${letter}: doppelte Buchstaben im Raster`);
    assert.equal(task.correct,letter,`${letter}: falsche Lösung`);
    assert.equal(task.interaction,'alphabetRecall',`${letter}: falsche Interaktion`);
    // Der Abruf ist audiogestützt und braucht eine menschliche Originalaufnahme.
    assert.equal(task.audioKind,'letter',`${letter}: Abruf braucht die isolierte Buchstabenaufnahme`);
    assert(C.HUMAN_LETTER_AUDIO_LETTERS.includes(letter),`${letter}: ohne menschliche Aufnahme unlösbar`);
    // Die Lösung darf nirgends im Stimulus stehen.
    assert(!String(task.display||'').includes(letter),`${letter}: Anzeige verrät die Lösung`);
    assert(!String(task.prompt||'').includes(letter),`${letter}: Prompt verrät die Lösung`);
    built++;
  }
  assert.equal(built,32,`32 Buchstaben müssen den Vollalphabet-Abruf anbieten, es sind ${built}`);
}

// Der Abruf erscheint nur bei hoher Sicherheit – Anfänger sehen ihn nie.
{
  const beginner=stateAt(.1),advanced=stateAt(.95);
  const session=C.createAdaptiveSession(beginner,{targetMainCount:30,title:'g',preset:'g'});
  assert(!C.familyCandidates(beginner,'Ш','soundToLetter',1,session).includes('alphabet-recall'),'Anfänger dürfen keinen Vollalphabet-Abruf bekommen');
  assert(C.familyCandidates(advanced,'Ш','soundToLetter',4,session).includes('alphabet-recall'),'ab Schwierigkeit 4 muss der Abruf angeboten werden');
}

// ------------------------------------------------- Dünne Evidenz ist kein Können
// Ein Skill mit drei Treffern meldet hohe Mastery, ist aber kaum belegt. Er muss
// mehr Bedarf haben als ein gut belegter Skill mit gleicher gemeldeter Mastery.
{
  const state=C.freshState();
  state.learningPlan.introducedLetters=['А','М'];
  state.learningPlan.activeLetters=['А','М'];
  seedSkill(C,state,'М','soundToLetter',3,3,{days:1});
  seedSkill(C,state,'М','visualToSound',15,17,{days:3});
  const migrated=C.migrate(state);
  const thin=C.calculateLearningNeed(migrated,'М','soundToLetter',NOW);
  const solid=C.calculateLearningNeed(migrated,'М','visualToSound',NOW);
  assert(thin>solid,`dünn belegter Skill braucht mehr Bedarf: dünn ${thin} vs. belegt ${solid}`);
}

console.log('Alphabet Lab V6.3 Abruf und Optionsleiter: OK');
