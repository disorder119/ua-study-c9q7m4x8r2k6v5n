import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

const root=process.cwd(),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const errors=[];const assert=(ok,msg)=>{if(!ok)errors.push(msg)};

// Sämtliche v55-Regeln weiterverwenden. Nur Release- und Selbsttestmarker werden
// auf v56 gehoben. Damit bleiben Gerätewechsel, v55/v54/v53/v52/v51 sowie alle
// A1-, Alphabet-, SRS- und Diagnose-Schutzregeln vollständig aktiv.
let inherited=read('tests/validate-v55.mjs');
const replacements=[
  ["const VERSION='55'","const VERSION='56'"],
  ['selftest.js?v=44','selftest.js?v=45'],
  ['Laufzeit-Selbsttest v44','Laufzeit-Selbsttest v45'],
  ['version===55','version===56'],
  ['UKRAINIAN_COURSE_LOADER:{version:55}','UKRAINIAN_COURSE_LOADER:{version:56}'],
  ['env.courseVersion===55','env.courseVersion===56'],
  ['VALIDIERUNG OK: v55','VALIDIERUNG OK: v56']
];
for(const [from,to] of replacements){assert(inherited.includes(from),`v55-Basisschutz enthält erwarteten Marker nicht: ${from}`);inherited=inherited.split(from).join(to)}
const inheritedFile=path.join(root,'.validate-v56-inherited.mjs');
if(errors.length){console.error(`VALIDIERUNG FEHLGESCHLAGEN (${errors.length})`);errors.forEach(e=>console.error('- '+e));process.exit(1)}
fs.writeFileSync(inheritedFile,inherited,'utf8');
try{await import(pathToFileURL(inheritedFile).href+'?v56='+Date.now())}finally{try{fs.unlinkSync(inheritedFile)}catch{}}

const loader=read('ukrainischkurs-v2-loader.js'),sw=read('ukrainisch-lernen-sw.js'),selftest=read('ukrainischkurs-selftest.js'),growth=read('ukrainischkurs-progressive-growth.js');
assert(loader.includes("const VERSION='56'"),'Loader ist nicht v56');
for(const marker of ['interaction-input-expansion.js?v=1','progressive-growth.js?v=1','selftest.js?v=45'])assert(loader.includes(marker),`Loader vermisst ${marker}`);
assert(loader.indexOf('interaction-input-expansion.js?v=1')<loader.indexOf('progressive-growth.js?v=1'),'Progressive Growth liegt nicht nach dem v55-Interaktionsinput');
assert(loader.indexOf('progressive-growth.js?v=1')<loader.indexOf('a1-exam.js?v=2'),'Progressive Growth liegt nicht vor der unveränderten A1-Prüfung');
assert(sw.includes("const VERSION='56'"),'Service Worker ist nicht v56');
assert(sw.includes("'./ukrainischkurs-progressive-growth.js'"),'Progressive Growth fehlt im Offline-Cache');
assert(selftest.includes('Laufzeit-Selbsttest v45')&&selftest.includes('version===56'),'Selbsttest ist nicht auf v56 aktualisiert');
assert(selftest.includes('UKRAINIAN_PROGRESSIVE_GROWTH')&&selftest.includes('everyLessonGate')&&selftest.includes('strictlyReducedHints'),'Selbsttest prüft die Steigerungskurve nicht');
assert(selftest.includes('core?.normalize("  Я п\'ю воду! ")'),'Selbsttest nutzt nicht die bereinigte direkte ukrainische Normalisierungsprobe');

// Progressive Growth: jeder neue Kurstag hat ein Pflicht-Micro-Mastery. Die Hilfe
// sinkt in jeder Lektion um exakt ein Zeichen, später wächst zusätzlich die Anzahl
// der freien Abrufe. Fehler müssen repariert werden; Erstversuch bleibt separat.
assert(growth.includes('const VERSION=1'),'Progressive Growth ist nicht v1');
for(const marker of ['progressive:true','everyLessonGate:true','strictlyReducedHints:true','cumulativeRecall:true','firstAttemptPreserved:true','repairRequired:true','lessonCount:LESSONS.length','inputItems:LESSONS.reduce','textCount:Object.keys(TEXTS).length','checkpointCount:CHECKPOINT_OFFSETS.length','dialogCount:dialogs.length','affectsExamGate:false','centralScoring:true','errorAware:true','competencyAware:true'])assert(growth.includes(marker),`Progressive Growth vermisst ${marker}`);
assert(growth.includes('supportChars=i=>Math.max(0,15-i)'),'Starthilfe ist nicht als streng fallende 15→0-Kurve implementiert');
assert(growth.includes('Math.min(5,2+Math.floor(i/4))'),'Freier Aufgabenabruf wächst nicht stufenweise von 2 auf 5');
assert(growth.includes('Kumulativer Abruf aus der letzten Lektion'),'Jede spätere Micro-Mastery enthält keinen expliziten kumulativen Abruf');
assert(growth.includes("if(!gateState().passed)")&&growth.includes("if(TEXTS[i]&&!textState().passed)")&&growth.includes("if(CHECKPOINT_OFFSETS.includes(i)&&!checkpointState().passed)"),'Weiter-Button erzwingt Micro-Mastery/Lesen/Checkpoint nicht');
assert(growth.includes("gateSession.retrying=true")&&growth.includes("if(!repair)gateSession.firstCorrect++"),'Fehlerreparatur oder getrennte Erstversuchsleistung fehlt');
assert(growth.includes('UKRAINIAN_ERROR_MEMORY?.record?.')&&growth.includes('UKRAINIAN_COMPETENCY_MASTERY?.record?.'),'Progressive Growth speist Fehlergedächtnis/Kompetenz-Mastery nicht');
assert(growth.includes("core.recordSession({skills:['writing','grammar']")&&growth.includes("core.recordSession({skills:['reading']"),'Progressive Growth liefert keine getrennte Schreib-/Grammatik- und Leseevidenz');
assert(!growth.includes('s.a1Exam=')&&!growth.includes('s.a1CanDo.passed=')&&!growth.includes('registerMilestone('),'Progressive Growth verändert bestehende A1-Gates direkt');
assert(!growth.includes('fetch(')&&!growth.includes('XMLHttpRequest'),'Progressive Growth ist nicht vollständig lokal/offline');
for(const phrase of ['Зрозуміло','Спочатку я перевірю адресу','Я вибираю автобус, бо це зручно','О восьмій я виходжу з дому','Учора я запізнився на автобус','Завтра я встану раніше','Який варіант кращий?','У мене проблема з квитком','Вокзал недалеко від центру','Мені потрібно ще десять хвилин','Учора ми поїхали до моря','Завтра ми поїдемо в інше місто','Учора я працював, а сьогодні відпочиваю','Наприклад, сюди можна доїхати автобусом','Домовились, тоді до завтра','Сьогодні був довгий день'])assert(growth.includes(phrase),`Progressive Growth vermisst Stufeninhalt: ${phrase}`);
try{new vm.Script(growth,{filename:'ukrainischkurs-progressive-growth.js'})}catch(e){errors.push(`Progressive-Growth-Syntax: ${e.message}`)}

// Isolierte Laufzeitsimulation: v55 endet bei 148 Slots. v56 hängt exakt 16
// progressive Slots an, setzt vier Retention-Checkpoints, acht Lesetexte/Dialogs,
// lässt den A1-Prüfungszustand unberührt und exportiert die echte Steigerungskurve.
try{
  const D=Array.from({length:148},(_,i)=>[`Alt ${i}`,'','',[]]),WEEKLY_REVIEW_DAYS=[20,80,120,147],DIALOGS={},s={day:148,a1Exam:{sentinel:'unchanged'}};
  const core={accepts:(v,a)=>a.includes(v),recordSession(){},normalize:v=>String(v),isComplete:()=>true};
  const document={createElement(){return {id:'',className:'',hidden:false,innerHTML:'',onclick:null,style:{},scrollIntoView(){},querySelector(){return null},querySelectorAll(){return[]},insertAdjacentElement(){},addEventListener(){}}},head:{append(){}},getElementById(){return null}};
  const ctx={window:{UKRAINIAN_LEARNING_CORE:core,UKRAINIAN_ERROR_MEMORY:{record(){}},UKRAINIAN_COMPETENCY_MASTERY:{record(){}}},D,WEEKLY_REVIEW_DAYS,DIALOGS,s,date:()=> '2026-11-20',save(){},render(){},stats(){},toast(){},speak(){},document,console,setTimeout};
  vm.createContext(ctx);vm.runInContext(growth,ctx,{filename:'ukrainischkurs-progressive-growth.js'});
  const mod=ctx.window.UKRAINIAN_PROGRESSIVE_GROWTH;
  assert(D.length===164,'Progressive Growth hängt nicht exakt 16 weitere Kursslots an');
  assert(mod?.start===148&&mod?.end===163,'Progressive Growth meldet falschen Start/Endbereich');
  assert(mod?.lessonCount===16&&mod?.inputItems===80&&mod?.textCount===8&&mod?.checkpointCount===4&&mod?.dialogCount===8,'Runtime-Export meldet nicht 16/80/8 Texte/4 Checkpoints/8 Dialoge');
  assert(WEEKLY_REVIEW_DAYS.includes(151)&&WEEKLY_REVIEW_DAYS.includes(155)&&WEEKLY_REVIEW_DAYS.includes(159)&&WEEKLY_REVIEW_DAYS.includes(163),'Vier v56-Retention-Checkpoints liegen nicht nach jeweils vier Lektionen');
  assert(Object.keys(DIALOGS).length===8,'Progressive Growth fügt nicht exakt acht Dialogsituationen hinzu');
  const hints=Array.from({length:16},(_,i)=>mod.supportChars(i));assert(hints[0]===15&&hints[15]===0&&hints.every((v,i)=>i===0||v===hints[i-1]-1),'Starthilfe sinkt nicht in jeder einzelnen Lektion exakt um ein Zeichen');
  const loads=Array.from({length:16},(_,i)=>mod.gateTasks(i).length);assert(loads.slice(0,4).every(x=>x===2)&&loads.slice(4,8).every(x=>x===3)&&loads.slice(8,12).every(x=>x===4)&&loads.slice(12).every(x=>x===5),'Freier Micro-Mastery-Umfang wächst nicht 2→3→4→5');
  assert(mod.gateTasks(1).some(x=>String(x.q).includes('Kumulativer Abruf'))&&mod.gateTasks(15).some(x=>String(x.q).includes('Kumulativer Abruf')),'Kumulativer Abruf fehlt in späteren Lektionen');
  assert(s.a1Exam?.sentinel==='unchanged','Progressive Growth verändert vorhandenen A1-Prüfungszustand');
}catch(e){errors.push(`v56-Progressive-Growth-Simulation: ${e.stack||e.message}`)}

if(errors.length){console.error(`VALIDIERUNG FEHLGESCHLAGEN (${errors.length})`);errors.forEach(e=>console.error('- '+e));process.exit(1)}
console.log('VALIDIERUNG OK: v56 behält sämtliche v55/v54/v53/v52/v51/A1-Schutzregeln und ergänzt 16 weitere progressive A1+-Lektionen mit 80 Lernobjekten. Jede Lektion erzwingt freie Micro-Mastery, die sichtbare Starthilfe sinkt Tag für Tag, der Abruf wächst von 2 auf 5 Aufgaben, frühere Inhalte werden kumulativ geprüft, Fehler müssen repariert werden, acht Lesetexte und vier Retention-Checkpoints sichern den zunehmenden Transfer. A1-Prüfungsschwellen bleiben unverändert.');