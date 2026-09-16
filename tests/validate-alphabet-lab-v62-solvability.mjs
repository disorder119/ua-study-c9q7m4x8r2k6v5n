import assert from 'node:assert/strict';
import {loadV61,NOW,rngFor,primeLetter} from './alphabet-v5-test-utils.mjs';

// V6.2 · Objektive Lösbarkeit jeder erzeugten Frage.
//
// Der Test prüft nicht, ob der Code „läuft“, sondern ob ein deutscher Anfänger
// die Aufgabe aus dem, was er tatsächlich sieht oder hört, eindeutig beantworten
// kann. Er deckte ursprünglich 17 % objektiv unlösbare oder ratbare Hauptfragen auf.

const C=loadV61();

// Familien, deren Antwort davon abhängt zu wissen, WELCHER Buchstabe gemeint ist.
// Sie müssen das Ziel im Prompt benennen – entweder als Zeichen oder, wo das
// Zeichen die Lösung wäre, über den Ziellaut bzw. die Funktion des Zeichens.
const TARGET_REQUIRED=new Set(['visual-find','multi-select','count-target','word-position','word-contains','word-choice','tap-target','multi-occurrence','missing-letter','confusion-word-choice']);
// Familien, bei denen genau eine angebotene Option in der Anzeige vorkommen darf.
const UNIQUE_IN_DISPLAY=new Set(['word-plain','pseudoword']);
// Familien mit kategorialer Antwort: Hier ist eine schiefe Verteilung ein echter
// Lernschaden, weil man ohne Buchstabenwissen raten kann.
const CATEGORICAL=new Set(['word-contains','word-position','same-different','count-target']);
// Stillgelegte Familien dürfen nie mehr ausgewählt werden.
const RETIRED=['odd-one-out','audio-word-position'];

const failures=[];
const fail=(message,task)=>failures.push(`${message} · ${task?.family||'?'}/${task?.letter||'?'} · prompt=${JSON.stringify(task?.prompt||'')} · display=${JSON.stringify(task?.display||'')} · options=${JSON.stringify(task?.options||[])}`);

function targetIsIdentified(task){
  const letter=task.letter,lower=C.DATA[letter]?.lower||letter.toLocaleLowerCase('uk');
  const prompt=String(task.prompt||'');
  if(prompt.includes(letter)||prompt.includes(lower))return true;
  const sound=C.DATA[letter]?.sound||'';
  if(sound&&prompt.includes(sound))return true;
  // Ь besitzt keinen eigenen Laut und wird ausschließlich über seine Funktion benannt.
  return letter==='Ь'&&/weich/i.test(prompt);
}

function auditTask(task,{context}){
  const family=task.family||task.type;
  assert(!RETIRED.includes(family),`${context}: stillgelegte Familie ${family} wurde erzeugt`);
  const options=Array.isArray(task.options)?task.options:[];
  const isChoice=options.length>0&&task.correct!=='MULTI'&&task.correct!=='SELF';

  if(isChoice){
    if(options.length<2)fail('I5 weniger als zwei Optionen',task);
    if(new Set(options.map(String)).size!==options.length)fail('I5 doppelte Optionen',task);
    if(options.filter(x=>x===task.correct).length!==1)fail('I5 richtige Antwort nicht genau einmal enthalten',task);
  }
  if(/„“|""|»«/.test(String(task.prompt||'')))fail('I1 leerer Platzhalter im Prompt',task);
  if(TARGET_REQUIRED.has(family)&&!targetIsIdentified(task))fail('I1 Ziel wird nicht benannt',task);

  if(UNIQUE_IN_DISPLAY.has(family)){
    const haystack=[...String(task.display||'').toLocaleLowerCase('uk')];
    const matching=options.filter(o=>{const low=String(o).toLocaleLowerCase('uk');return low.length===1&&haystack.includes(low)});
    if(matching.length!==1)fail(`I2 ${matching.length} Optionen kommen in der Anzeige vor`,task);
  }

  // Wortaufgaben müssen sich auf ein Wort beziehen, das den Zielbuchstaben
  // tatsächlich so enthält, wie die richtige Antwort behauptet.
  if(family==='count-target'){
    const count=[...String(task.display||'').toLocaleLowerCase('uk')].filter(ch=>ch===(C.DATA[task.letter]?.lower)).length;
    if(String(count)!==String(task.correct))fail(`I2 Zählaufgabe: sichtbar ${count}, erwartet ${task.correct}`,task);
  }
  if(family==='word-contains'){
    const contains=[...String(task.display||'').toLocaleLowerCase('uk')].includes(C.DATA[task.letter]?.lower);
    if((contains?'Ja':'Nein')!==task.correct)fail('I2 Ja/Nein widerspricht dem angezeigten Wort',task);
  }
  if(family==='word-choice'||family==='confusion-word-choice'){
    const lower=C.DATA[task.letter]?.lower;
    const hits=options.filter(w=>[...String(w).toLocaleLowerCase('uk')].includes(lower));
    if(hits.length!==1)fail(`I2 ${hits.length} Wörter enthalten den Zielbuchstaben`,task);
  }
  if(family==='word-position'){
    const chars=[...String(task.display||'').toLocaleLowerCase('uk')],lower=C.DATA[task.letter]?.lower;
    const at=chars.map((ch,i)=>ch===lower?i:-1).filter(i=>i>=0);
    const expected=at.length>1?'Mehrfach':at[0]===0?'Anfang':at[0]===chars.length-1?'Ende':'Mitte';
    if(expected!==task.correct)fail(`I2 Position widerspricht dem Wort (sichtbar ${expected})`,task);
  }
  if((family==='tap-target'||family==='multi-occurrence'||family==='multi-select')&&Array.isArray(task.tokens)){
    const idx=[...(task.correctIndexes||[])];
    if(!idx.length)fail('I2 Tippaufgabe ohne Ziel',task);
    for(const i of idx){
      const token=String(task.tokens[i]||'').toLocaleLowerCase('uk');
      if(token!==C.DATA[task.letter]?.lower&&token!==task.letter.toLocaleLowerCase('uk'))fail(`I2 markierter Token ${JSON.stringify(task.tokens[i])} ist nicht das Ziel`,task);
    }
  }
  // Eine Audiofrage darf ihre eigene Lösung nicht als Text daneben schreiben.
  // taskBody blendet bei type==='audio' mit gesetzter wordId das Wort ein.
  if(task.type==='audio'&&task.wordId){
    const shown=String(task.audioWord||'');
    if(shown&&options.map(String).includes(shown))fail('I3 Audiofrage zeigt ihre eigene Lösung als Text',task);
  }
  // Audioaufgaben: es muss eine menschliche Quelle geben, sonst entsteht eine
  // unbeantwortbare Frage.
  if(task.type==='audio'||task.requiresHumanLetterAudio===true){
    const usesLetterAudio=task.audioKind==='letter'||task.requiresHumanLetterAudio===true;
    if(usesLetterAudio&&!C.HUMAN_LETTER_AUDIO_LETTERS.includes(task.letter))fail('I1 isolierte Buchstabenaufnahme verlangt, die es nicht gibt',task);
  }
}

// ---------------------------------------------------------------- Teil A
// Jede erlaubte Familie für jeden Buchstaben, über mehrere Seeds.
const stateA=(()=>{const st=C.freshState();for(const c of C.ALPHABET)primeLetter(C,st,c,{ratio:.6});return C.migrate(st)})();
let forced=0;
for(let seed=1;seed<=8;seed++){
  const rng=rngFor(seed*2654435761);
  const session=C.createAdaptiveSession(stateA,{targetMainCount:30,title:'a',preset:'a',scope:'standard',feedback:'learning'});
  for(const family of Object.keys(C.QUESTION_FAMILIES)){
    if(RETIRED.includes(family))continue;
    const skill=C.QUESTION_FAMILIES[family].skill;
    for(const letter of C.ALPHABET){
      if(!C.familyAllowedFor?.(letter,family)&&typeof C.familyAllowedFor==='function')continue;
      for(let difficulty=C.QUESTION_FAMILIES[family].min;difficulty<=C.QUESTION_FAMILIES[family].max;difficulty+=2){
        const task=C.buildV4Task(stateA,letter,skill,difficulty,family,session,rng,{});
        assert(task,`buildV4Task lieferte nichts für ${family}/${letter}`);
        auditTask(task,{context:`forced ${family}/${letter}/d${difficulty}`});
        forced++;
      }
    }
  }
}

// ---------------------------------------------------------------- Teil B
// Echte Lernverläufe über den produktiven Selektor.
const personas=[
  {name:'anfaenger',correct:()=>.45},
  {name:'zufall',correct:()=>.25},
  {name:'stark',correct:()=>.92},
  {name:'verwechsler',correct:letter=>['Б','В','И','І','Ш','Щ'].includes(letter)?.25:.8}
];
const answers=new Map();
let live=0;
for(const persona of personas){
  for(let seed=1;seed<=3;seed++){
    const rng=rngFor(seed*7919+persona.name.length);
    let state=C.freshState(),now=NOW;
    for(let s=0;s<6;s++){
      const session=C.createAdaptiveSession(state,{targetMainCount:30,title:'p',preset:'p',scope:'standard',feedback:'learning'});
      for(let i=0;i<30;i++){
        now+=45000;
        const task=C.selectNextMainQuestion(state,session,rng,now);
        assert(task,`${persona.name}/${seed}: Selektor lieferte keine Frage`);
        auditTask(task,{context:`live ${persona.name}/${seed}`});
        live++;
        const family=task.family||task.type;
        if(CATEGORICAL.has(family)){
          if(!answers.has(family))answers.set(family,new Map());
          const bucket=answers.get(family),key=String(task.correct);
          bucket.set(key,(bucket.get(key)||0)+1);
        }
        const good=rng()<persona.correct(task.letter);
        C.recordAnswer(state,{letter:task.letter,skill:task.skill,type:task.type,kind:task.type,task,family:task.family,good,selected:good?task.correct:'?',expected:task.correct,firstAttempt:true,isRepair:false,questionId:task.questionId,sessionId:session.sessionId,now,latencyMs:1200,latencyValid:true});
        session.mainAnswers.push({letter:task.letter,skill:task.skill,family:task.family,correct:good});
        session.mainTasks.push(task);session.mainIndex++;
      }
      now+=6*C.HOUR;
    }
  }
}

// ---------------------------------------------------------------- Teil C
// I4 · Kategoriale Familien dürfen nicht durch blindes Raten lösbar sein.
for(const [family,bucket] of answers){
  const total=[...bucket.values()].reduce((a,b)=>a+b,0);
  if(total<40)continue;
  const [top,count]=[...bucket.entries()].sort((a,b)=>b[1]-a[1])[0];
  const share=count/total;
  assert(share<=.68,`I4 ${family}: „${top}“ ist in ${(share*100).toFixed(1)} % von ${total} Aufgaben richtig – blindes Raten würde belohnt`);
}

assert.deepEqual(failures,[],`\n${failures.slice(0,25).join('\n')}\n(${failures.length} Verletzungen gesamt)`);
console.log('Alphabet Lab V6.2 Lösbarkeit/Fragen-Integrität: OK',JSON.stringify({forced,live,categorical:[...answers.keys()]}));
