import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

const root=process.cwd(),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const errors=[];const assert=(ok,msg)=>{if(!ok)errors.push(msg)};

// Sämtliche v51-Regeln weiterverwenden. Nur bewusst erhöhte Versionsmarker werden
// auf v52 abgebildet; Fehlergedächtnis, Kompetenz-Mastery sowie alle älteren
// Alphabet-, SRS- und A1-Schutzregeln bleiben dadurch aktiv.
let inherited=read('tests/validate-v51.mjs');
const replacements=[
  ["const VERSION='51'","const VERSION='52'"],
  ['selftest.js?v=40','selftest.js?v=41'],
  ['Laufzeit-Selbsttest v40','Laufzeit-Selbsttest v41'],
  ['version===51','version===52'],
  ['VALIDIERUNG OK: v51','VALIDIERUNG OK: v52']
];
for(const [from,to] of replacements){assert(inherited.includes(from),`v51-Basisschutz enthält erwarteten Marker nicht: ${from}`);inherited=inherited.split(from).join(to)}
const inheritedFile=path.join(root,'.validate-v52-inherited.mjs');
if(errors.length){console.error(`VALIDIERUNG FEHLGESCHLAGEN (${errors.length})`);errors.forEach(e=>console.error('- '+e));process.exit(1)}
fs.writeFileSync(inheritedFile,inherited,'utf8');
try{await import(pathToFileURL(inheritedFile).href+'?v52='+Date.now())}finally{try{fs.unlinkSync(inheritedFile)}catch{}}

const loader=read('ukrainischkurs-v2-loader.js'),sw=read('ukrainisch-lernen-sw.js'),selftest=read('ukrainischkurs-selftest.js'),late=read('ukrainischkurs-late-input-expansion.js');
assert(loader.includes("const VERSION='52'"),'Loader ist nicht v52');
assert(loader.includes('late-input-expansion.js?v=1'),'Loader lädt die zusätzliche Input-Erweiterung nicht');
assert(loader.indexOf('immersion-textlab.js?v=1')<loader.indexOf('late-input-expansion.js?v=1'),'Zusatz-Input liegt nicht nach den bisherigen späten Lernwerkzeugen');
assert(loader.indexOf('late-input-expansion.js?v=1')<loader.indexOf('a1-exam.js?v=2'),'Zusatz-Input liegt nicht direkt vor der bestehenden A1-Prüfungsphase');
assert(loader.includes('selftest.js?v=41'),'Loader lädt nicht Selbsttest v41');
assert(sw.includes("const VERSION='52'"),'Service Worker ist nicht v52');
assert(sw.includes("'./ukrainischkurs-late-input-expansion.js'"),'Zusatz-Input fehlt im Offline-Cache');
assert(selftest.includes('Laufzeit-Selbsttest v41')&&selftest.includes('version===52'),'Selbsttest ist nicht auf v52 aktualisiert');
assert(selftest.includes('UKRAINIAN_LATE_INPUT_EXPANSION')&&selftest.includes('lessonCount')&&selftest.includes('inputItems'),'Selbsttest prüft die neue Input-Erweiterung nicht');

assert(late.includes('const VERSION=1'),'Late Input Expansion ist nicht v1');
for(const marker of ['lessonCount:LESSONS.length','inputItems:LESSONS.reduce','reviewCount:reviewDays.length','centralScoring:true','errorAware:true','affectsExamGate:false'])assert(late.includes(marker),`Late Input Expansion vermisst ${marker}`);
for(const phrase of ['Я прокидаюся о сьомій','Меню, будь ласка','Можна приміряти?','З якої колії відправляється потяг?','Поверніть праворуч','Сьогодні тепло','Де ванна кімната?','У мене ранкова зміна','Я напишу пізніше','У мене запис на десяту','Зустрінемося завтра'])assert(late.includes(phrase),`Praktischer Zusatz-Input fehlt: ${phrase}`);
assert(late.includes('UKRAINIAN_ERROR_MEMORY?.record?.')&&late.includes('UKRAINIAN_COMPETENCY_MASTERY?.record?.'),'Freie Zusatz-Reviews liefern keine Fehler-/Kompetenz-Evidenz');
assert(late.includes("core.recordSession({skills:['writing','grammar']"),'Zusatz-Reviews liefern keine zentrale Skill-Evidenz');
assert(!late.includes('s.a1Exam=')&&!late.includes('s.a1CanDo.passed=')&&!late.includes('registerMilestone('),'Zusatz-Input verändert bestehende A1-Gates direkt');
assert(!late.includes('fetch('),'Zusatz-Input ist nicht vollständig lokal/offline');

// Isolierte Laufzeitsimulation: genau 12 neue geführte Lektionen mit 60 Lernobjekten,
// drei Transfer-Reviews und keine Manipulation eines vorhandenen Prüfungszustands.
try{
  const D=Array.from({length:100},(_,i)=>[`Alt ${i}`,'','',[]]),WEEKLY_REVIEW_DAYS=[20,40,60,99],DIALOGS={},s={day:100,a1Exam:{sentinel:'unchanged'}};
  const core={accepts:(v,a)=>a.includes(v),recordSession(){},normalize:v=>String(v),isComplete:()=>true};
  const document={createElement(){return {id:'',className:'',hidden:false,innerHTML:'',scrollIntoView(){}}},head:{append(){}},getElementById(){return null}};
  const ctx={window:{UKRAINIAN_LEARNING_CORE:core,UKRAINIAN_ERROR_MEMORY:{record(){}},UKRAINIAN_COMPETENCY_MASTERY:{record(){}}},D,WEEKLY_REVIEW_DAYS,DIALOGS,s,date:()=> '2026-10-10',save(){},render(){},toast(){},document,console};
  vm.createContext(ctx);vm.runInContext(late,ctx,{filename:'ukrainischkurs-late-input-expansion.js'});
  const mod=ctx.window.UKRAINIAN_LATE_INPUT_EXPANSION;
  assert(D.length===112,'Late Input Expansion hängt nicht exakt 12 Kurstage an');
  assert(mod?.lessonCount===12&&mod?.inputItems===60&&mod?.reviewCount===3,'Runtime-Export meldet nicht 12 Lektionen / 60 Lernobjekte / 3 Reviews');
  assert(WEEKLY_REVIEW_DAYS.includes(103)&&WEEKLY_REVIEW_DAYS.includes(107)&&WEEKLY_REVIEW_DAYS.includes(111),'Die drei neuen Review-Tage liegen nicht nach jeweils vier Zusatzlektionen');
  assert(Object.keys(DIALOGS).length>=6,'Zusatz-Input enthält zu wenige echte Dialogsituationen');
  assert(s.a1Exam?.sentinel==='unchanged','Zusatz-Input verändert vorhandenen A1-Prüfungszustand');
}catch(e){errors.push(`v52-Late-Input-Simulation: ${e.stack||e.message}`)}

if(errors.length){console.error(`VALIDIERUNG FEHLGESCHLAGEN (${errors.length})`);errors.forEach(e=>console.error('- '+e));process.exit(1)}
console.log('VALIDIERUNG OK: v52 behält sämtliche v51/A1-Schutzregeln und ergänzt direkt vor der Prüfungsphase zwölf geführte A1/A1+-Lektionen mit 60 praktischen Lernobjekten, sechs Dialogsituationen und drei freien 5-Satz-Transferchecks. Die neuen Reviews speisen Fehlergedächtnis und Kompetenzdiagnose, verändern aber keine bestehenden A1-Prüfungsschwellen.');
