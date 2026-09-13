import assert from 'node:assert/strict';import {loadV5,NOW,primeLetter,rngFor,seedSkill} from './alphabet-v5-test-utils.mjs';
const C=loadV5();

// A – absoluter Anfänger: kleines Lernfeld, praktisch keine freie Produktion.
{
  const st=C.freshState(),s=C.createAdaptiveSession(st,{targetMainCount:20,title:'Persona A'});C.initProductionSession(s,st,rngFor(1));
  assert(s.activeLearningSet.length>=4&&s.activeLearningSet.length<=8);assert.equal(C.productionQuotaForSession(st,s),0);assert.equal(C.selectProductionTask(st,s,rngFor(2),NOW),null)
}

// B – fünf Buchstaben ungefähr mittelstark: Memory kann sich annähern, Audio-Writing bleibt gesperrt.
{
  const st=C.freshState();for(const c of ['А','І','К','М','О'])primeLetter(C,st,c,{ratio:.72});st.learningPlan.introducedLetters=['А','І','К','М','О'];st.learningPlan.activeLetters=['А','І','К','М','О'];
  for(const c of ['А','І','К','М','О']){assert.equal(C.audioWrittenProductionReady(st,c,NOW),false);const fam=C.productionFamiliesFor(st,c,NOW);if(C.writtenProductionReady(st,c,NOW))assert(fam.includes('visual-memory-writing'))}
}

// C – А sehr stark: leichte Basics verlieren Priorität, Produktion/Audio/Transfer werden möglich.
{
  const st=C.freshState();primeLetter(C,st,'А');st.learningPlan.introducedLetters=['А'];st.learningPlan.activeLetters=['А'];
  assert(C.writtenProductionReady(st,'А',NOW));assert(C.audioWrittenProductionReady(st,'А',NOW));const fam=C.productionFamiliesFor(st,'А',NOW);assert(fam.includes('visual-memory-writing'));assert(fam.includes('sound-to-writing'));assert(fam.includes('audio-to-writing'))
}

// D – Р/P Fake Friend: П bleibt Confusion Target und freie R-Produktion wird verfügbar.
{
  const st=C.freshState();primeLetter(C,st,'Р');st.learningPlan.introducedLetters=['Р','П'];st.learningPlan.activeLetters=['Р','П'];st.letters.Р.confusions.П=8;st.letters.Р.trapStats.latinLookalike={attempts:8,wrong:5,recentWrong:[1,1,0,1],lastWrongAt:NOW,latinTrap:'P'};
  const fam=C.productionFamiliesFor(st,'Р',NOW);assert(fam.includes('confusion-writing'));const sess=C.createAdaptiveSession(st,{targetMainCount:20,fixedLetters:['Р'],focused:true});C.initProductionSession(sess,st,rngFor(4));const t=C.productionTask(st,'Р','confusion-writing',sess,rngFor(5));assert.equal(t.confusionTarget,'П');assert(!t.prompt.includes('P'))
}

// E – Ш/Щ: Audio, Kontrast und spätere Produktion sind gemeinsam verfügbar.
{
  const st=C.freshState();for(const c of ['Ш','Щ']){primeLetter(C,st,c);st.letters[c].confusions[c==='Ш'?'Щ':'Ш']=7}st.learningPlan.introducedLetters=['Ш','Щ'];st.learningPlan.activeLetters=['Ш','Щ'];
  for(const c of ['Ш','Щ']){const fam=C.productionFamiliesFor(st,c,NOW);assert(fam.includes('audio-to-writing'));assert(fam.includes('confusion-writing'))}
  const battle=C.createBattleSession(st,['Ш','Щ'],{size:20});assert.equal(battle.targetMainCount,20)
}

// F – fast komplettes Alphabet: mehr, aber weiterhin begrenzte Production; Audio-Writing auf vielen Zeichen.
{
  const st=C.freshState();for(const c of C.ALPHABET.filter(x=>x!=='Ь'))primeLetter(C,st,c);primeLetter(C,st,'Ь');st.learningPlan.introducedLetters=[...C.ALPHABET];st.learningPlan.activeLetters=C.ALPHABET.slice(0,8);
  const sess=C.createAdaptiveSession(st,{targetMainCount:20,title:'Persona F'});C.initProductionSession(sess,st,rngFor(6));const quota=C.productionQuotaForSession(st,sess,NOW);assert(quota>=3&&quota<=5);assert(C.productionTestAvailability(st).test20);const audioReady=C.ALPHABET.filter(c=>C.audioWrittenProductionReady(st,c,NOW));assert(audioReady.length>=20);assert(!audioReady.includes('Ь'))
}

// Relapse: späterer Produktionsfehler zieht Mastery/Confidence wieder nach unten.
{
  const st=C.freshState();primeLetter(C,st,'А');for(let i=0;i<6;i++)C.recordProductionSelfCheck(st,{letter:'А',family:i%2?'sound-to-writing':'visual-memory-writing',rating:'pass',now:NOW+i*C.DAY});const before=C.productionMastery(st,'А',NOW+6*C.DAY);for(let i=0;i<3;i++)C.recordProductionSelfCheck(st,{letter:'А',family:'audio-to-writing',rating:'again',audioSource:'human',now:NOW+(7+i)*C.DAY});assert(C.productionMastery(st,'А',NOW+11*C.DAY)<before)
}

console.log('Alphabet Lab V5 persona simulations A-F: OK');
