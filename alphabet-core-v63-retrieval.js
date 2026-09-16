'use strict';

// Alphabet Lab V6.3 · Abruf statt Wiedererkennung
//
// Ausgangsproblem: Fast jede Hauptfrage war Multiple Choice mit vier Optionen.
// Das hat zwei Folgen, die den Lernerfolg systematisch überschätzen:
//
//   1. Ratebonus. Vier Optionen heißen 25 % Trefferquote ohne jedes Wissen.
//      Ein Buchstabe konnte 82 % Mastery erreichen, obwohl ein knappes Drittel
//      der Treffer geraten war.
//   2. Wiedererkennung ist leichter als Abruf. Wer „Ш" unter vier Vorgaben
//      wiedererkennt, kann ihn noch lange nicht aus dem Gedächtnis holen.
//      Für Behalten über Wochen zählt aber der Abruf.
//
// V6.3 dreht beides über eine Schwierigkeitsleiter, die an die bereits
// vorhandene Mastery gekoppelt ist (difficultyFor: 0–5 aus Skill-Mastery):
//
//   Mastery   Schwierigkeit   Optionen   Ratewahrscheinlichkeit
//   <35 %     0–1             4          25 %
//   35–75 %   2–3             6          17 %
//   75–90 %   4               8          12,5 %
//   ab 90 %   5               33         3 %   (Familie alphabet-recall)
//
// Der Lernende sieht also genau so viele Optionen, wie er verkraftet: Am Anfang
// bleibt es bei vier, damit niemand überfordert startet. Erst wenn ein Skill
// wirklich sitzt, verschwindet die Auswahlhilfe schrittweise.
//
// Unverändert bleiben bewusst:
//   - Kontrastfamilien (sound-contrast, visual-contrast): Dort IST das enge Paar
//     die Aufgabe; mehr Optionen würden den Verwechslungsfokus verwässern.
//   - Ja/Nein-, Positions-, Zähl- und Wortfragen: Deren Optionsmenge ist durch
//     die Aufgabe festgelegt, nicht durch die Schwierigkeit.

const V63_VERSION=63;

// Optionen pro Schwierigkeitsstufe 0–5.
const V63_LETTER_LADDER=[4,4,6,6,8,8];
const V63_SOUND_LADDER=[4,4,5,5,6,6];

// Familien, deren Optionsmenge fachlich festgelegt ist.
const V63_FIXED_OPTION_FAMILIES=new Set(['sound-contrast','visual-contrast','latin-trap','error-correction','pair-match','alphabet-recall']);

const V63_LOWER_TO_UPPER=new Map(ALPHABET.map(c=>[DATA[c].lower,c]));
const V63_SOUND_TO_LETTER=new Map(ALPHABET.map(c=>[DATA[c].sound,c]));

function v63OptionKind(options){
  if(options.every(o=>ALPHABET.includes(o)))return 'upper';
  if(options.every(o=>V63_LOWER_TO_UPPER.has(o)))return 'lower';
  if(options.every(o=>V63_SOUND_TO_LETTER.has(o)))return 'sound';
  return '';
}

// Ein zusätzlicher Distraktor muss plausibel sein (also aus der Verwechslungs-
// und Lautgruppe kommen), darf aber nie versehentlich zu einer zweiten richtigen
// Antwort werden. Bei word-plain und pseudoword heißt das: kein Buchstabe, der in
// der angezeigten Zeichenkette vorkommt.
function v63CandidateLetters(state,task,rng){
  const letter=task.letter;
  const personal=state&&state.letters?personalConfusions(state,letter)||[]:[];
  const near=uniq([
    ...personal,
    ...(LETTER_PEDAGOGY[letter]?.confusions||[]),
    ...(SOUND_GROUPS[letter]||[])
  ]).filter(c=>ALPHABET.includes(c)&&c!==letter);
  const introduced=(state?.learningPlan?.introducedLetters||[]).filter(c=>c!==letter);
  const rest=ALPHABET.filter(c=>c!==letter);
  return uniq([...near,...shuffle(introduced,rng),...shuffle(rest,rng)]);
}

function v63ExpandOptions(state,task,difficulty,rng){
  const options=task.options;
  if(!Array.isArray(options)||options.length<2)return task;
  if(task.correct==='MULTI'||task.correct==='SELF')return task;
  if(V63_FIXED_OPTION_FAMILIES.has(task.family))return task;
  const kind=v63OptionKind(options);
  if(!kind)return task;
  const step=clamp(Math.round(Number(difficulty)||0),0,5);
  const target=kind==='sound'?V63_SOUND_LADDER[step]:V63_LETTER_LADDER[step];
  if(options.length>=target)return task;

  // Bei word-plain/pseudoword darf keine Option in der Anzeige vorkommen,
  // sonst entstünde eine zweite richtige Antwort.
  const shown=[...String(task.display||'').toLocaleLowerCase('uk')];
  const blocked=V62_UNIQUE_IN_DISPLAY.has(task.family)?new Set(shown):new Set();

  const render=letter=>kind==='upper'?letter:kind==='lower'?DATA[letter].lower:DATA[letter].sound;
  const present=new Set(options.map(String));
  const grown=[...options];
  for(const candidate of v63CandidateLetters(state,task,rng)){
    if(grown.length>=target)break;
    if(blocked.has(DATA[candidate].lower))continue;
    const value=render(candidate);
    if(value===undefined||present.has(String(value)))continue;
    present.add(String(value));
    grown.push(value);
  }
  task.options=shuffle(grown,rng);
  task.optionLadderStep=step;
  return task;
}

// Die höchste Stufe: kein Auswahlfeld mehr, sondern das ganze Alphabet.
// Kognitiv ist das freier Abruf – man muss den Buchstaben selbst im Kopf haben,
// bevor man ihn im Raster findet. Ь bleibt ausgenommen: Es hat keinen eigenen
// isolierten Laut und wird weiterhin ausschließlich im Wortkontext geprüft.
QUESTION_FAMILIES['alphabet-recall']={skill:'soundToLetter',min:4,max:5,weight:1.1,usesAudio:true,production:1};
FAMILY_PROMPTS['alphabet-recall']=['Höre die menschliche Originalaufnahme und finde den Buchstaben im ganzen Alphabet.'];

function v63BuildAlphabetRecall(state,letter,session,rng,task){
  if(letter==='Ь'||!HUMAN_LETTER_AUDIO_LETTERS.includes(letter))return null;
  task.type='reverse';
  task.interaction='alphabetRecall';
  task.display='';
  task.correct=letter;
  task.options=[...ALPHABET];
  task.alphabetRecall=true;
  task.requiresHumanAudio=true;
  task.humanAudioRequired=true;
  task.requiresHumanLetterAudio=true;
  task.letterAudioAvailable=true;
  task.audioKind='letter';
  task.audioStimulusLetter=letter;
  task.audioStimulusId=`letter-${letter}`;
  task.stimulusId=`alphabet-recall-${letter}`;
  task.prompt='Höre die menschliche Originalaufnahme. Tippe den Buchstaben im vollständigen Alphabet – ohne engere Auswahl.';
  delete task.audioWord;
  delete task.audioIndex;
  return task;
}

const familyAllowedForV63Base=familyAllowedFor;
familyAllowedFor=function(letter,family){
  if(family==='alphabet-recall')return letter!=='Ь'&&HUMAN_LETTER_AUDIO_LETTERS.includes(letter);
  return familyAllowedForV63Base(letter,family);
};

const familyCandidatesV63Base=familyCandidates;
familyCandidates=function(state,letter,skill,difficulty,session){
  const families=familyCandidatesV63Base(state,letter,skill,difficulty,session);
  if(skill!=='soundToLetter'||difficulty<4||!familyAllowedFor(letter,'alphabet-recall'))return families;
  return uniq([...families,'alphabet-recall']);
};

const buildV4TaskV63Base=buildV4Task;
buildV4Task=function(state,letter,skill,difficulty,family,session,rng=Math.random,meta={}){
  const task=buildV4TaskV63Base(state,letter,skill,difficulty,family,session,rng,meta);
  if(!task)return task;
  const target=task.letter||letter;
  if((task.family||family)==='alphabet-recall'){
    const built=v63BuildAlphabetRecall(state,target,session,rng,task);
    if(built)return built;
    return buildV4TaskV63Base(state,target,'soundToLetter',difficulty,'sound-to-letter',session,rng,meta);
  }
  return v63ExpandOptions(state,task,difficulty,rng);
};

// ---------------------------------------------------------------------------
// V6.3 · Dünne Evidenz ist kein Können
//
// Beobachtet in einer Simulation über 900 Fragen: Bei „М" hatte der Skill
// soundToLetter nach 30 Sitzungen drei Versuche, die übrigen Kernskills 13 bis 23.
// Ursache ist eine Rückkopplung in calculateLearningNeed:
//
//   Drei Versuche, alle richtig → recentAccuracy 100 % → gemeldete Mastery 68 %
//   → Bedarf nur 67. Ein ehrlich geübter Skill mit 15 Versuchen und echten
//   Fehlern meldet 53 % → Bedarf 116 und gewinnt jedes Mal.
//
// Der ungeübte Skill wird also gerade deshalb übersprungen, weil zu wenig über
// ihn bekannt ist. Das blockiert zusätzlich den Fortschritt: Die Freischaltung
// neuer Buchstaben verlangt ein Minimum über ALLE Basisskills – ein einziger
// ausgehungerter Skill hält den ganzen Buchstaben fest.
//
// Korrektur: Solange ein Skill die Evidenzschwelle nicht erreicht, ab der
// skillMasteryV4 seinem eigenen Wert traut (evidenceWeightSum ≥ 6), bekommt er
// einen Bedarfsaufschlag. Wir wissen schlicht noch nicht, ob er sitzt – und
// genau das ist der stärkste Grund, ihn zu fragen.
const V63_EVIDENCE_TARGET=6;
const V63_EVIDENCE_NEED=36;

const calculateLearningNeedV63Base=calculateLearningNeed;
calculateLearningNeed=function(state,letter,skill,now=Date.now(),session=null){
  const base=calculateLearningNeedV63Base(state,letter,skill,now,session);
  const s=state?.letters?.[letter]?.skills?.[skill];
  if(!s)return base;
  const evidence=Math.max(0,Number(s.evidenceWeightSum)||Number(s.independentAttempts)||0);
  const gap=clamp((V63_EVIDENCE_TARGET-evidence)/V63_EVIDENCE_TARGET,0,1);
  return Math.round(base+gap*V63_EVIDENCE_NEED);
};
