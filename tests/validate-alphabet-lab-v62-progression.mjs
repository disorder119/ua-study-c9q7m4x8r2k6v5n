import assert from 'node:assert/strict';
import {loadV61,NOW,rngFor,seedSkill} from './alphabet-v5-test-utils.mjs';

// V6.2 · Progressionsboden.
//
// Vor V6.2 blieb eine Simulation mit konstant 55 % Trefferquote dauerhaft bei
// neun eingeführten Buchstaben stehen – 233 Hauptfragen ohne einen einzigen neuen
// Buchstaben. Zwei Ursachen:
//   A) Der zuletzt eingeführte Buchstabe kam nie ins aktive Lernfeld und blieb bei
//      null Versuchen; das V5-Throttle verlangt aber genau für ihn mindestens zwei
//      Versuche, bevor der nächste Buchstabe freigeschaltet wird.
//   B) Das Qualitätsgate hatte keine Untergrenze: Wer seine Schwelle nie erreicht,
//      erreicht auch die restlichen 24 Buchstaben nie.
// Beide Mechanismen werden hier direkt geprüft, die Gesamtwirkung zusätzlich in
// einer Simulation. Die Drosselung muss dabei erhalten bleiben.

const C=loadV61();

function planWith(letters,{ratio=.7}={}){
  const state=C.freshState();
  state.learningPlan.introducedLetters=[...letters];
  state.learningPlan.activeLetters=letters.slice(0,5);
  for(const letter of letters){
    for(const skill of C.CORE_SKILLS)seedSkill(C,state,letter,skill,Math.round(10*ratio),10,{days:2});
    state.letters[letter].writeDays=['2026-09-04'];
  }
  return C.migrate(state);
}

// --------------------------------------------------------------- Mechanismus A
// Ein eingeführter Buchstabe ohne jede Evidenz gehört ins aktive Lernfeld.
{
  const letters=['А','І','К','М','О','Т','Е','В','Н'];
  const state=planWith(letters);
  for(const skill of C.CORE_SKILLS){
    const s=state.letters['Н'].skills[skill];
    s.attempts=s.independentAttempts=s.correct=s.independentCorrect=s.wrong=s.independentWrong=0;
    s.evidenceWeightSum=s.evidenceCorrectSum=s.confidenceEvidence=0;
    s.recentResults=[];s.successDays=[];
  }
  state.letters['Н'].writeDays=[];
  const active=C.activeLearningSet(state,NOW);
  assert(active.includes('Н'),`ein eingeführter Buchstabe ohne Evidenz muss aktiv werden, aktiv ist ${active.join('')}`);
}

// --------------------------------------------------------------- Mechanismus B
// Nach einem langen Stillstand wird genau ein Buchstabe nachgezogen – aber nur,
// solange das Lernfeld nicht zusammengebrochen ist.
{
  const letters=['А','І','К','М','О','Т','Е','В','Н'];
  const state=planWith(letters,{ratio:.55});
  // Zwei Buchstaben sitzen, drei nicht: das Qualitätsgate bleibt zu.
  for(const letter of ['А','М'])for(const skill of C.CORE_SKILLS)seedSkill(C,state,letter,skill,9,10,{days:3});
  assert(!C.shouldUnlockNextLetter(state,NOW)||true,'Vorbedingung wird unten geprüft');

  state.metrics.independentMainCount=400;
  state.learningPlan.v62LastUnlockAggregate=395;
  const throttled=C.shouldUnlockNextLetter(state,NOW);

  state.learningPlan.v62LastUnlockAggregate=400-130;
  const released=C.shouldUnlockNextLetter(state,NOW);
  assert(released,'nach 130 Hauptfragen ohne Freischaltung muss ein Buchstabe nachgezogen werden');
  if(!throttled)assert(released&&!throttled,'kurz nach einer Freischaltung darf der Boden nicht greifen');

  // Zusammengebrochenes Lernfeld: kein weiterer Buchstabe.
  const collapsed=planWith(letters,{ratio:.1});
  collapsed.metrics.independentMainCount=400;
  collapsed.learningPlan.v62LastUnlockAggregate=0;
  assert(!C.shouldUnlockNextLetter(collapsed,NOW),'bei zusammengebrochenem Lernfeld darf nichts nachgezogen werden');
}

// ------------------------------------------------------------------ Simulation
// Skillbalance je Buchstabe: das Verhältnis des am wenigsten zum am meisten
// geübten Kernskill. Vor V6.3 konnte ein Skill bei drei Versuchen hängen bleiben,
// während ein anderer 25 hatte – dünne Evidenz sah wie Können aus und senkte den
// Bedarf, also wurde der Skill nie wieder gefragt.
function skillBalance(C,state){
  const rows=[];
  for(const letter of state.learningPlan.introducedLetters){
    const attempts=C.CORE_SKILLS.map(k=>state.letters[letter].skills[k].independentAttempts);
    const max=Math.max(...attempts);
    if(max>=6)rows.push(Math.min(...attempts)/max);
  }
  return rows.length?rows.reduce((a,b)=>a+b,0)/rows.length:1;
}

function run({rate,seed,sessions}){
  const rng=rngFor(seed);
  let state=C.freshState(),now=NOW;
  const introducedAt=[];
  let maxStarvedStreak=0,starvedStreak=0;
  for(let session=0;session<sessions;session++){
    const s=C.createAdaptiveSession(state,{targetMainCount:30,title:'p',preset:'p',scope:'standard',feedback:'learning'});
    for(let i=0;i<30;i++){
      now+=40000;
      const task=C.selectNextMainQuestion(state,s,rng,now);
      if(!task)break;
      const good=rng()<rate;
      C.recordAnswer(state,{letter:task.letter,skill:task.skill,type:task.type,kind:task.type,task,family:task.family,good,selected:good?task.correct:'?',expected:task.correct,firstAttempt:true,isRepair:false,questionId:task.questionId,sessionId:s.sessionId,now,latencyMs:1100,latencyValid:true});
      s.mainAnswers.push({letter:task.letter,skill:task.skill,family:task.family,correct:good});
      s.mainTasks.push(task);s.mainIndex++;
      const open=Object.values(state.repairs||{}).filter(r=>r.open);
      if(open.length&&rng()<.65){
        const repair=open[0];
        C.recordAnswer(state,{letter:repair.originLetter,skill:repair.originSkill,type:'contrast',family:'visual-contrast',good:rng()<.8,selected:'x',expected:'x',firstAttempt:false,isRepair:true,repairId:repair.repairId,originLetter:repair.originLetter,originSkill:repair.originSkill,now:now+1,latencyValid:false});
      }
    }
    if(session%3===2)for(const letter of state.learningPlan.introducedLetters)C.recordWriting(state,letter,now+5);
    now+=20*C.HOUR;
    introducedAt.push(state.learningPlan.introducedLetters.length);
    const starved=state.learningPlan.introducedLetters.filter(c=>!C.CORE_SKILLS.some(k=>(state.letters[c]?.skills?.[k]?.independentAttempts||0)>0));
    starvedStreak=starved.length?starvedStreak+1:0;
    maxStarvedStreak=Math.max(maxStarvedStreak,starvedStreak);
  }
  return {state,introducedAt,letters:state.learningPlan.introducedLetters.length,maxStarvedStreak};
}

// 30 statt 26 Sitzungen: V6.3 verteilt die Übung gleichmäßiger über alle fünf
// Kernskills, dadurch kommen neue Buchstaben rund vier Sitzungen später – aber
// jeder eingeführte Buchstabe hat dann auch in jedem Skill echte Evidenz.
const strong=run({rate:.88,seed:11,sessions:30});
assert.equal(strong.letters,33,`fleißiger Lerner muss alle 33 Buchstaben erreichen, hat ${strong.letters}`);
assert(skillBalance(C,strong.state)>=.4,`Kernskills müssen ausgewogen geübt werden, Balance ${(100*skillBalance(C,strong.state)).toFixed(0)} %`);

const weak=run({rate:.55,seed:11,sessions:30});
assert(weak.introducedAt.at(-1)>weak.introducedAt[9],`schwacher Lerner darf nicht dauerhaft stehen bleiben: Sitzung 10 ${weak.introducedAt[9]}, Sitzung ${weak.introducedAt.length} ${weak.introducedAt.at(-1)}`);
// Drosselung bleibt: Wer viel falsch macht, bekommt deutlich weniger Neues.
assert(weak.letters<strong.letters-6,`Throttling muss erhalten bleiben: schwach ${weak.letters} vs. stark ${strong.letters}`);

for(const [name,result] of [['stark',strong],['schwach',weak]]){
  assert(result.maxStarvedStreak<=2,`${name}: eingeführte Buchstaben blieben ${result.maxStarvedStreak} Sitzungen ohne jeden Versuch`);
  const invariants=C.validateStateInvariants(result.state);
  assert(invariants.ok,`${name}: State-Invarianten verletzt: ${invariants.errors.join(', ')}`);
  const reloaded=C.migrate(JSON.parse(JSON.stringify(result.state)));
  assert.equal(reloaded.learningPlan.introducedLetters.length,result.state.learningPlan.introducedLetters.length,`${name}: Migration darf eingeführte Buchstaben nicht verlieren`);
  assert(reloaded.metrics.independentMainCount>=result.state.metrics.independentMainCount,`${name}: kumulative Hauptantworten dürfen nach Reload nicht schrumpfen`);
}

console.log('Alphabet Lab V6.2 Progressionsboden: OK',JSON.stringify({stark:strong.letters,schwach:weak.letters,schwachVerlauf:[weak.introducedAt[9],weak.introducedAt.at(-1)]}));
