import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

const root=process.cwd(),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const errors=[];const assert=(ok,msg)=>{if(!ok)errors.push(msg)};

// Sämtliche v50-Regeln weiterverwenden. Nur bewusst erhöhte Versionsmarker werden
// auf v51 abgebildet; A1-, Alphabet-, SRS- und v50-Schutz bleiben dadurch aktiv.
let inherited=read('tests/validate-v50.mjs');
const replacements=[
  ["const VERSION='50'","const VERSION='51'"],
  ['selftest.js?v=39','selftest.js?v=40'],
  ['Laufzeit-Selbsttest v39','Laufzeit-Selbsttest v40'],
  ['version===50','version===51'],
  ['VALIDIERUNG OK: v50','VALIDIERUNG OK: v51'],
  ['grammar-decoder.js?v=1','grammar-decoder.js?v=2'],
  ['grammar-spiral.js?v=5','grammar-spiral.js?v=6'],
  ['daily-coach.js?v=1','daily-coach.js?v=2'],
  ['weekly-evaluator.js?v=1','weekly-evaluator.js?v=2'],
  ["decoder.includes('const VERSION=1')","decoder.includes('const VERSION=2')"]
];
for(const [from,to] of replacements){assert(inherited.includes(from),`v50-Basisschutz enthält erwarteten Marker nicht: ${from}`);inherited=inherited.split(from).join(to)}
const inheritedFile=path.join(root,'.validate-v51-inherited.mjs');
if(errors.length){console.error(`VALIDIERUNG FEHLGESCHLAGEN (${errors.length})`);errors.forEach(e=>console.error('- '+e));process.exit(1)}
fs.writeFileSync(inheritedFile,inherited,'utf8');
try{await import(pathToFileURL(inheritedFile).href+'?v51='+Date.now())}finally{try{fs.unlinkSync(inheritedFile)}catch{}}

const loader=read('ukrainischkurs-v2-loader.js'),sw=read('ukrainisch-lernen-sw.js'),selftest=read('ukrainischkurs-selftest.js');
assert(loader.includes("const VERSION='51'"),'Loader ist nicht v51');
for(const marker of ['error-memory.js?v=1','grammar-decoder.js?v=2','competency-mastery.js?v=1','active-production.js?v=6','grammar-spiral.js?v=6','dictation.js?v=6','weekly-evaluator.js?v=2','daily-coach.js?v=2','selftest.js?v=40'])assert(loader.includes(marker),`Loader vermisst ${marker}`);
assert(loader.indexOf('learning-core.js?v=5')<loader.indexOf('error-memory.js?v=1')&&loader.indexOf('error-memory.js?v=1')<loader.indexOf('grammar-decoder.js?v=2'),'Fehlergedächtnis/Decoder werden nicht nach dem Lernkern in richtiger Reihenfolge geladen');
assert(loader.indexOf('genitive-bridge.js?v=3')<loader.indexOf('competency-mastery.js?v=1'),'Kompetenz-Mastery wird vor vorhandener Brücken-Evidenz geladen');
assert(loader.indexOf('competency-mastery.js?v=1')<loader.indexOf('active-production.js?v=6'),'Kompetenz-Mastery steht nicht vor später Produktionspraxis bereit');
assert(sw.includes("const VERSION='51'"),'Service Worker ist nicht v51');
for(const asset of ['./ukrainischkurs-error-memory.js','./ukrainischkurs-competency-mastery.js'])assert(sw.includes(`'${asset}'`),`Offline-Asset fehlt: ${asset}`);

const memory=read('ukrainischkurs-error-memory.js');
assert(memory.includes('const VERSION=1'),'Fehlergedächtnis ist nicht v1');
for(const marker of ["'location-direction'","'accusative'","'person'","'negation'","'genitive-absence'","'past'","'future'","'origin'","'quantity'","'word-order'","'ending'","'orthography'"])assert(memory.includes(marker),`Fehlergedächtnis vermisst Kategorie ${marker}`);
for(const marker of ['pending','repairs','Math.pow(.84','competencyPriority','inferCompetencies','diagnosticOnly:true','affectsA1:false'])assert(memory.includes(marker),`Fehlergedächtnis vermisst ${marker}`);
assert(!memory.includes('core.recordSession(')&&!memory.includes('s.a1CanDo.passed=')&&!memory.includes('s.a1Exam='),'Fehlergedächtnis manipuliert Skill-/A1-Wertung');

const mastery=read('ukrainischkurs-competency-mastery.js');
assert(mastery.includes('const VERSION=1'),'Kompetenz-Mastery ist nicht v1');
for(const marker of ["'location-direction'","'objects-accusative'","'person-verbs'","'past'","'future'","'genitive-absence'","'origin'","'quantity-price'",'successDates','recentAccuracy','errorPenalty','multiDayStability:true','errorAware:true','affectsA1:false'])assert(mastery.includes(marker),`Kompetenz-Mastery vermisst ${marker}`);
assert(mastery.includes("seedRule('a1GrammarBridge'")&&mastery.includes("seedRule('timeBridge'")&&mastery.includes("seedRule('genitiveBridge'"),'Bestehende Brücken-Erfolge werden nicht vorsichtig als Legacy-Evidenz übernommen');
assert(!mastery.includes('core.recordSession(')&&!mastery.includes('s.a1CanDo.passed=')&&!mastery.includes('s.a1Exam='),'Kompetenz-Mastery manipuliert zentrale A1-/Skill-Wertung');

const decoder=read('ukrainischkurs-grammar-decoder.js');
assert(decoder.includes('const VERSION=2')&&decoder.includes('errorMemoryAware:true'),'Grammar Decoder ist nicht v2/fehlerbewusst');
assert(decoder.includes('meta.record!==false'),'Decoder lässt doppelte Fehleraufzeichnung nicht kontrolliert verhindern');
const spiral=read('ukrainischkurs-grammar-spiral.js');
assert(spiral.includes('const VERSION=6')&&spiral.includes('errorMemoryAdaptive:true')&&spiral.includes('maxErrorFocused:2'),'Grammatik-Spirale begrenzt Fehlerfokus nicht sauber');
assert(spiral.includes('UKRAINIAN_ERROR_MEMORY?.record?.')&&spiral.includes('priorityFor?.'),'Grammatik-Spirale speichert/priorisiert wiederkehrende Fehlertypen nicht');
const active=read('ukrainischkurs-active-production.js');
assert(active.includes('const VERSION=6')&&active.includes('repairTagged:true'),'Active Production ist nicht v6 mit separater Reparaturmarkierung');
assert(active.includes("repair=session.phase==='repair'")&&active.includes('UKRAINIAN_ERROR_MEMORY?.record?.'),'Freie Produktion trennt Erstversuch und Reparatur nicht im Fehlergedächtnis');
const dictation=read('ukrainischkurs-dictation.js');
assert(dictation.includes('const VERSION=6')&&dictation.includes('errorMemory:true')&&dictation.includes('UKRAINIAN_ERROR_MEMORY?.record?.'),'Diktat liefert keine v51-Fehlerevidenz');
const weekly=read('ukrainischkurs-weekly-evaluator.js');
assert(weekly.includes('const VERSION=2')&&weekly.includes('errorMemoryAfterFinish:true')&&weekly.includes('competencyAware:true'),'Wochencheck ist nicht v51-diagnosebewusst');
assert(weekly.indexOf("function finish()")<weekly.indexOf("UKRAINIAN_ERROR_MEMORY?.record?."),'Wochencheck klassifiziert Antworten vor Abschluss');
assert(weekly.includes("session.phase='results'")&&weekly.includes('answersHiddenUntilEnd:true'),'Lösungen bleiben nicht bis zum Ende verborgen');
const coach=read('ukrainischkurs-daily-coach.js');
assert(coach.includes('const VERSION=2')&&coach.includes('errorAware:true')&&coach.includes('competencyAware:true'),'Tagesplan nutzt v51-Fokus nicht');
assert(coach.includes('UKRAINIAN_COMPETENCY_MASTERY?.needsPractice?.(1)')&&coach.includes('UKRAINIAN_ERROR_MEMORY?.top?.(1)'),'Tagesplan liest konkreten Muster-/Fehlerfokus nicht');
assert(selftest.includes('Laufzeit-Selbsttest v40')&&selftest.includes('version===51'),'Selbsttest ist nicht auf v51 aktualisiert');
for(const marker of ['UKRAINIAN_ERROR_MEMORY','UKRAINIAN_COMPETENCY_MASTERY','errorMemoryAdaptive','errorMemoryAfterFinish'])assert(selftest.includes(marker),`Selbsttest vermisst ${marker}`);

// Isolierte Verhaltenssimulation: Fehlertyp erkennen, Wiederholung priorisieren,
// Reparatur abbauen und Kompetenzwert über mehrere Tage stabilisieren.
let today='2026-10-01';
const state={day:60,errorMemory:{version:1,categories:{},events:[]},competencyMastery:{version:1,items:{},seeded:true}};
const normalize=v=>String(v??'').normalize('NFC').toLocaleLowerCase('uk').replace(/[ʼ’‘'`]/g,'’').replace(/[.!?,…:;«»"“”„()]/g,' ').replace(/[–—-]/g,' ').replace(/\s+/g,' ').trim();
const doc={createElement(){return {id:'',className:'',hidden:false,innerHTML:'',onclick:null,scrollIntoView(){}}},head:{append(){}},getElementById(){return null}};
const ctx={console,window:{UKRAINIAN_LEARNING_CORE:{normalize,isComplete:()=>true}},s:state,date:()=>today,save(){},render(){},document:doc};
vm.createContext(ctx);
try{
  vm.runInContext(memory,ctx,{filename:'ukrainischkurs-error-memory.js'});vm.runInContext(mastery,ctx,{filename:'ukrainischkurs-competency-mastery.js'});
  const em=ctx.window.UKRAINIAN_ERROR_MEMORY,cm=ctx.window.UKRAINIAN_COMPETENCY_MASTERY;
  assert(em.classify({input:'Я в магазин',answers:['Я в магазині'],prompt:'Du bist im Geschäft.'}).id==='location-direction','Ort-/Richtungsfehler wird nicht erkannt');
  assert(em.classify({input:'Я працювати',answers:['Я буду працювати'],prompt:'Ich werde arbeiten.'}).id==='future','Zukunftsfehler wird nicht erkannt');
  assert(em.classify({input:'Я не розумию',answers:['Я не розумію'],prompt:'Ich verstehe nicht.'}).id==='negation'||em.classify({input:'Я не розумию',answers:['Я не розумію'],prompt:'Ich verstehe nicht.'}).id==='orthography','Nahe Schreibabweichung wird nicht sinnvoll klassifiziert');
  em.record({input:'Я в магазин',answers:['Я в магазині'],prompt:'Du bist im Geschäft.',correct:false,module:'test'});em.record({input:'Я в магазин',answers:['Я в магазині'],prompt:'Du bist im Geschäft.',correct:false,module:'test'});
  const before=em.priority('location-direction'),pendingBefore=em.top(5).find(x=>x.id==='location-direction')?.pending||0;assert(before>0&&pendingBefore>=2,'Wiederholter Fehler erzeugt keine Priorität/offene Reparatur');
  today='2026-10-02';em.record({input:'Я в магазині',answers:['Я в магазині'],prompt:'Du bist im Geschäft.',correct:true,repair:true,module:'test'});const pendingAfter=em.top(5).find(x=>x.id==='location-direction')?.pending??0;assert(pendingAfter<pendingBefore,'Korrekte Reparatur baut offenen Fehlertyp nicht ab');
  const s1=cm.score('location-direction');today='2026-10-03';em.record({input:'Я в магазині',answers:['Я в магазині'],prompt:'Du bist im Geschäft.',correct:true,module:'test'});today='2026-10-05';em.record({input:'Я в ресторані',answers:['Я в ресторані'],prompt:'Du bist im Restaurant.',correct:true,module:'test'});const s2=cm.score('location-direction');assert(Number.isFinite(s2)&&s2>s1,'Mehrtagige korrekte Evidenz erhöht Kompetenz-Mastery nicht');
  assert(cm.profile()['location-direction'].successDays>=2,'Kompetenz-Mastery zählt keine Mehrtages-Stabilität');
}catch(e){errors.push(`v51-Diagnose-Simulation: ${e.stack||e.message}`)}

if(errors.length){console.error(`VALIDIERUNG FEHLGESCHLAGEN (${errors.length})`);errors.forEach(e=>console.error('- '+e));process.exit(1)}
console.log('VALIDIERUNG OK: v51 behält sämtliche v50/A1-Schutzregeln und ergänzt ein A1-neutrales Fehlergedächtnis mit Fehlertypen, Reparaturstatus und Priorität sowie musterbasierte Kompetenz-Mastery mit Aktualität, Mehrtages-Stabilität und moderatem Fehlerabzug. Bestehende Übungen liefern Evidenz, ohne neue Pflichtlektionen oder weichere A1-Gates einzuführen.');