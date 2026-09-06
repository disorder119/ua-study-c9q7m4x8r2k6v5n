import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

const root=process.cwd(),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const errors=[];const assert=(ok,msg)=>{if(!ok)errors.push(msg)};

// Vollständigen v49-Schutz übernehmen und nur die bewusst erhöhten Versionsmarker
// auf v50 abbilden. Damit bleiben alle früheren Alphabet-, SRS-, A1- und v49-Checks aktiv.
let inherited=read('tests/validate-v49.mjs');
const replacements=[
  ["const VERSION='49'","const VERSION='50'"],
  ['selftest.js?v=38','selftest.js?v=39'],
  ['Laufzeit-Selbsttest v38','Laufzeit-Selbsttest v39'],
  ['version===49','version===50'],
  ['VALIDIERUNG OK: v49','VALIDIERUNG OK: v50']
];
for(const [from,to] of replacements){assert(inherited.includes(from),`v49-Basisschutz enthält erwarteten Marker nicht: ${from}`);inherited=inherited.split(from).join(to)}
const inheritedFile=path.join(root,'.validate-v50-inherited.mjs');
if(errors.length){console.error(`VALIDIERUNG FEHLGESCHLAGEN (${errors.length})`);errors.forEach(e=>console.error('- '+e));process.exit(1)}
fs.writeFileSync(inheritedFile,inherited,'utf8');
try{await import(pathToFileURL(inheritedFile).href+'?v50='+Date.now())}finally{try{fs.unlinkSync(inheritedFile)}catch{}}

const loader=read('ukrainischkurs-v2-loader.js'),sw=read('ukrainisch-lernen-sw.js'),selftest=read('ukrainischkurs-selftest.js');
assert(loader.includes("const VERSION='50'"),'Loader ist nicht v50');
for(const marker of ['grammar-decoder.js?v=1','personal-words.js?v=1','real-conversation.js?v=1','weekly-evaluator.js?v=1','immersion-textlab.js?v=1','daily-coach.js?v=1','selftest.js?v=39'])assert(loader.includes(marker),`Loader vermisst ${marker}`);
assert(loader.indexOf('learning-core.js?v=5')<loader.indexOf('grammar-decoder.js?v=1'),'Grammar Decoder wird vor dem Lernkern geladen');
assert(loader.indexOf('grammar-decoder.js?v=1')<loader.indexOf('grammar-spiral.js?v=5'),'Grammar Decoder wird erst nach der Grammatik-Spirale geladen');
assert(loader.indexOf('personal-words.js?v=1')<loader.indexOf('immersion-textlab.js?v=1'),'Text Lab wird vor „Meine Wörter“ geladen');
assert(loader.indexOf('weekly-evaluator.js?v=1')<loader.indexOf('daily-coach.js?v=1'),'Tagesplan kann den Wochencheck beim Rendern noch nicht erkennen');

assert(sw.includes("const VERSION='50'"),'Service Worker ist nicht v50');
for(const asset of ['./ukrainischkurs-grammar-decoder.js','./ukrainischkurs-personal-words.js','./ukrainischkurs-real-conversation.js','./ukrainischkurs-weekly-evaluator.js','./ukrainischkurs-immersion-textlab.js','./ukrainischkurs-daily-coach.js'])assert(sw.includes(`'${asset}'`),`Offline-Asset fehlt: ${asset}`);

const decoder=read('ukrainischkurs-grammar-decoder.js');
assert(decoder.includes('const VERSION=1'),'Grammar Decoder ist nicht v1');
for(const marker of ['Verneinung mit „немає“','Zukunft: Person steckt in буду / будеш / буде','Vergangenheit: auf Person und Geschlecht achten','Richtung statt Ort','Ort statt Richtung','Akkusativ bei häufigen -а-Wörtern'])assert(decoder.includes(marker),`Grammar Decoder vermisst Regel: ${marker}`);
assert(decoder.includes('centralScoringUntouched:true'),'Grammar Decoder kennzeichnet Bewertungsschutz nicht');
assert(!decoder.includes('core.recordSession(')&&!decoder.includes('s.a1CanDo.passed=')&&!decoder.includes('s.a1Exam='),'Grammar Decoder manipuliert Lern-/A1-Wertung');

const spiral=read('ukrainischkurs-grammar-spiral.js');
assert(spiral.includes('UKRAINIAN_GRAMMAR_DECODER?.show'),'Grammatik-Spirale ruft Decoder bei Fehlern nicht auf');
assert(spiral.includes('decoderFeedback:true'),'Grammatik-Spirale exportiert Decoder-Kopplung nicht');

const personal=read('ukrainischkurs-personal-words.js');
assert(personal.includes('const INTERVALS=[1,2,4,7,14,30,60]'),'Meine Wörter hat kein eigenes gestuftes Wiederholungssystem');
assert(personal.includes("core.isComplete?.('grammar.location-direction')"),'Meine Wörter erscheint nicht erst im späteren Verlauf');
assert(personal.includes('affectsA1:false')&&personal.includes('optional:true'),'Meine Wörter ist nicht freiwillig/A1-neutral');
assert(!personal.includes('core.recordSession(')&&!personal.includes('s.a1CanDo.passed=')&&!personal.includes('s.a1Exam='),'Eigene Karten beeinflussen A1-/Skill-Wertung');

const conversation=read('ukrainischkurs-real-conversation.js');
assert((conversation.match(/id:'(cafe|travel|help|daily)'/g)||[]).length===4,'Real Conversation hat nicht vier kontrollierte Situationen');
assert(conversation.includes("core.isComplete?.('speaking.sentences')"),'Real Conversation öffnet sich zu früh');
assert(conversation.includes('controlledBranches:true')&&conversation.includes('affectsA1:false'),'Real Conversation ist nicht kontrolliert/A1-neutral');
assert(!conversation.includes('fetch(')&&!conversation.includes('s.a1CanDo.passed=')&&!conversation.includes('s.a1Exam='),'Real Conversation hängt an externem Chat oder manipuliert A1');

const weekly=read('ukrainischkurs-weekly-evaluator.js');
assert(weekly.includes("['reading','listening','writing','grammar','speaking']"),'Wochencheck enthält nicht fünf Domänen');
assert(weekly.includes('questions:10')&&weekly.includes('answersHiddenUntilEnd:true'),'Wochencheck ist nicht 10-teilig oder verrät Lösungen zu früh');
assert(weekly.includes('minScoreGate:false'),'Wochencheck führt unerwünschte Mindestpunktzahl ein');
assert(weekly.includes("core.isComplete?.('grammar.time')"),'Wochencheck öffnet sich nicht erst nach später Grammatik-/Zeitbasis');
assert(weekly.includes('i%3===2'),'Wochencheck überlädt jeden Review-Tag statt periodisch zu erscheinen');
assert(weekly.includes("session.phase='results'")&&weekly.includes('Lösungen und Auswertung sind jetzt sichtbar'),'Lösungen werden nicht erst am Ende freigegeben');

const textlab=read('ukrainischkurs-immersion-textlab.js');
assert(textlab.includes("core.isComplete?.('grammar.time')"),'Immersion Text Lab öffnet sich zu früh');
assert(textlab.includes('noAutomaticTranslation:true')&&textlab.includes('affectsA1:false'),'Text Lab behauptet Übersetzung oder beeinflusst A1');
assert(textlab.includes('UKRAINIAN_PERSONAL_WORDS.prefill'),'Unbekannte Textwörter lassen sich nicht in persönliche Karten überführen');
assert(!textlab.includes('fetch('),'Immersion Text Lab ist nicht vollständig lokal/offline');

const coach=read('ukrainischkurs-daily-coach.js');
assert(coach.includes("core.isComplete?.('grammar.location-direction')"),'Tagesplan erscheint nicht erst im späteren Verlauf');
assert(coach.includes('guidedNotGenerated:true'),'Tagesplan ersetzt geführten Kurs durch Zufallsgenerierung');
assert(coach.includes('UKRAINIAN_WEEKLY_EVALUATOR?.required?.()'),'Tagesplan berücksichtigt periodischen Wochencheck nicht');

assert(selftest.includes('Laufzeit-Selbsttest v39')&&selftest.includes('version===50'),'Selbsttest ist nicht auf v50 aktualisiert');
for(const marker of ['UKRAINIAN_GRAMMAR_DECODER','UKRAINIAN_PERSONAL_WORDS','UKRAINIAN_REAL_CONVERSATION','UKRAINIAN_WEEKLY_EVALUATOR','UKRAINIAN_IMMERSION_TEXTLAB','UKRAINIAN_DAILY_COACH'])assert(selftest.includes(marker),`Selbsttest vermisst ${marker}`);

// Kernlogik des Decoders isoliert ausführen: Er soll konkrete A1-Erklärungen liefern,
// ohne Bewertung oder Kurszustand zu benötigen.
try{
  const ctx={window:{UKRAINIAN_LEARNING_CORE:{normalize:v=>String(v??'').toLocaleLowerCase('uk').replace(/[ʼ’‘'`]/g,'’').replace(/[.!?,…:;«»"“”„()]/g,' ').replace(/\s+/g,' ').trim()}},document:{createElement(){return {}},head:{append(){}}}};
  vm.createContext(ctx);vm.runInContext(decoder,ctx,{filename:'ukrainischkurs-grammar-decoder.js'});const gd=ctx.window.UKRAINIAN_GRAMMAR_DECODER;
  const future=gd.explain('Я працювати',['Я буду працювати'],'Ich werde arbeiten.');assert(future.title.includes('Zukunft'),'Decoder erkennt fehlende Zukunftsform nicht');
  const gen=gd.explain('У мене не квиток',['У мене немає квитка'],'Ich habe kein Ticket.');assert(gen.title.includes('немає'),'Decoder erkennt немає/Genitiv-Fehler nicht');
  const place=gd.explain('Я в магазин',['Я в магазині'],'Du bist im Geschäft.');assert(place.title.includes('Ort'),'Decoder erkennt Ort-vs-Richtung nicht');
}catch(e){errors.push(`Grammar-Decoder-Simulation: ${e.stack||e.message}`)}

if(errors.length){console.error(`VALIDIERUNG FEHLGESCHLAGEN (${errors.length})`);errors.forEach(e=>console.error('- '+e));process.exit(1)}
console.log('VALIDIERUNG OK: v50 behält sämtliche v49-Schutzregeln und integriert die Instagram-Ideen erst später und didaktisch kontrolliert: geführter Tagesplan statt Zufallskurs, persönliche A1-neutrale Karten, Grammar Decoder, kontrollierte Gespräche, periodischer 10-Fragen-Diagnosecheck ohne Mindestscore und lokales Immersion-Textlabor ohne erfundene Übersetzung.');
