import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

const root=process.cwd(),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const errors=[];const assert=(ok,msg)=>{if(!ok)errors.push(msg)};

// Sämtliche v52-Regeln weiterverwenden. Nur Versionsmarker werden auf v53 gehoben;
// damit bleiben v51-Diagnose, v52-Late-Input sowie alle A1-/Alphabet-/SRS-Gates aktiv.
let inherited=read('tests/validate-v52.mjs');
const replacements=[
  ["const VERSION='52'","const VERSION='53'"],
  ['selftest.js?v=41','selftest.js?v=42'],
  ['Laufzeit-Selbsttest v41','Laufzeit-Selbsttest v42'],
  ['version===52','version===53'],
  ['VALIDIERUNG OK: v52','VALIDIERUNG OK: v53']
];
for(const [from,to] of replacements){assert(inherited.includes(from),`v52-Basisschutz enthält erwarteten Marker nicht: ${from}`);inherited=inherited.split(from).join(to)}
const inheritedFile=path.join(root,'.validate-v53-inherited.mjs');
if(errors.length){console.error(`VALIDIERUNG FEHLGESCHLAGEN (${errors.length})`);errors.forEach(e=>console.error('- '+e));process.exit(1)}
fs.writeFileSync(inheritedFile,inherited,'utf8');
try{await import(pathToFileURL(inheritedFile).href+'?v53='+Date.now())}finally{try{fs.unlinkSync(inheritedFile)}catch{}}

const loader=read('ukrainischkurs-v2-loader.js'),sw=read('ukrainisch-lernen-sw.js'),selftest=read('ukrainischkurs-selftest.js'),natural=read('ukrainischkurs-natural-input-expansion.js');
assert(loader.includes("const VERSION='53'"),'Loader ist nicht v53');
assert(loader.includes('natural-input-expansion.js?v=1'),'Loader lädt Natural Input Expansion nicht');
assert(loader.indexOf('late-input-expansion.js?v=1')<loader.indexOf('natural-input-expansion.js?v=1'),'Natural Input liegt nicht nach dem v52-Zusatzinput');
assert(loader.indexOf('natural-input-expansion.js?v=1')<loader.indexOf('a1-exam.js?v=2'),'Natural Input liegt nicht vor der unveränderten A1-Prüfung');
assert(loader.includes('selftest.js?v=42'),'Loader lädt nicht Selbsttest v42');
assert(sw.includes("const VERSION='53'"),'Service Worker ist nicht v53');
assert(sw.includes("'./ukrainischkurs-natural-input-expansion.js'"),'Natural Input fehlt im Offline-Cache');
assert(selftest.includes('Laufzeit-Selbsttest v42')&&selftest.includes('version===53'),'Selbsttest ist nicht auf v53 aktualisiert');
assert(selftest.includes('UKRAINIAN_NATURAL_INPUT_EXPANSION')&&selftest.includes('inputTexts')&&selftest.includes('dialogCount'),'Selbsttest prüft Natural Input Expansion nicht');

assert(natural.includes('const VERSION=1'),'Natural Input Expansion ist nicht v1');
for(const marker of ['lessonCount:LESSONS.length','inputItems:LESSONS.reduce','inputTexts:Object.keys(INPUTS).length','reviewCount:reviewDays.length','dialogCount:6','centralScoring:true','errorAware:true','competencyAware:true','affectsExamGate:false'])assert(natural.includes(marker),`Natural Input Expansion vermisst ${marker}`);
for(const phrase of ['спочатку','Мені подобається','Я не їм м’яса','У вас є інший розмір?','Потяг скасовано','У мене болить голова','Інтернет не працює','Можеш допомогти?','Я буду через десять хвилин','Я втомився','Я бачив море','Можливо, завтра'])assert(natural.includes(phrase),`Natürlicher Zusatz-Input fehlt: ${phrase}`);
for(const text of ['Зазвичай я прокидаюся о сьомій','Сьогодні я в ресторані','Мій потяг скасовано','У квартирі немає гарячої води','Я вже їду','Вчора я ходив у ресторан біля моря'])assert(natural.includes(text),`Kurzer zusammenhängender Input fehlt: ${text}`);
assert(natural.includes("core.recordSession({skills:['reading']")&&natural.includes("core.recordSession({skills:['writing','grammar']"),'Natural Input liefert keine getrennte Lese-/Transfer-Evidenz');
assert(natural.includes('UKRAINIAN_ERROR_MEMORY?.record?.')&&natural.includes('UKRAINIAN_COMPETENCY_MASTERY?.record?.'),'Freie Natural-Input-Reviews speisen Diagnose nicht');
assert(!natural.includes('s.a1Exam=')&&!natural.includes('s.a1CanDo.passed=')&&!natural.includes('registerMilestone('),'Natural Input verändert bestehende A1-Gates direkt');
assert(!natural.includes('fetch('),'Natural Input ist nicht vollständig lokal/offline');

// Isolierte Laufzeitsimulation: exakt 12 weitere Kurstage, 60 Lernobjekte,
// 6 zusammenhängende Inputtexte, 3 freie Reviews und kein Eingriff in den Prüfungszustand.
try{
  const D=Array.from({length:112},(_,i)=>[`Alt ${i}`,'','',[]]),WEEKLY_REVIEW_DAYS=[20,40,80,111],DIALOGS={},s={day:112,a1Exam:{sentinel:'unchanged'}};
  const core={accepts:(v,a)=>a.includes(v),recordSession(){},normalize:v=>String(v),isComplete:()=>true};
  const document={createElement(){return {id:'',className:'',hidden:false,innerHTML:'',onclick:null,scrollIntoView(){},querySelectorAll(){return[]},insertAdjacentElement(){}}},head:{append(){}},getElementById(){return null}};
  const ctx={window:{UKRAINIAN_LEARNING_CORE:core,UKRAINIAN_ERROR_MEMORY:{record(){}},UKRAINIAN_COMPETENCY_MASTERY:{record(){}}},D,WEEKLY_REVIEW_DAYS,DIALOGS,s,date:()=> '2026-10-20',save(){},render(){},toast(){},speak(){},document,console,setTimeout};
  vm.createContext(ctx);vm.runInContext(natural,ctx,{filename:'ukrainischkurs-natural-input-expansion.js'});
  const mod=ctx.window.UKRAINIAN_NATURAL_INPUT_EXPANSION;
  assert(D.length===124,'Natural Input Expansion hängt nicht exakt 12 weitere Kurstage an');
  assert(mod?.lessonCount===12&&mod?.inputItems===60&&mod?.inputTexts===6&&mod?.reviewCount===3,'Runtime-Export meldet nicht 12 Lektionen / 60 Lernobjekte / 6 Inputtexte / 3 Reviews');
  assert(Number(mod?.dialogCount)>=6,'Natural Input Expansion enthält zu wenige Dialogsituationen');
  assert(WEEKLY_REVIEW_DAYS.includes(115)&&WEEKLY_REVIEW_DAYS.includes(119)&&WEEKLY_REVIEW_DAYS.includes(123),'Die drei v53-Review-Tage liegen nicht nach jeweils vier weiteren Lektionen');
  assert(Object.keys(DIALOGS).length>=6,'Natural Input fügt zu wenige Dialoge hinzu');
  assert(s.a1Exam?.sentinel==='unchanged','Natural Input verändert vorhandenen A1-Prüfungszustand');
}catch(e){errors.push(`v53-Natural-Input-Simulation: ${e.stack||e.message}`)}

if(errors.length){console.error(`VALIDIERUNG FEHLGESCHLAGEN (${errors.length})`);errors.forEach(e=>console.error('- '+e));process.exit(1)}
console.log('VALIDIERUNG OK: v53 behält sämtliche v52/v51/A1-Schutzregeln und ergänzt vor der unveränderten A1-Prüfung zwölf weitere A1/A1+-Lektionen mit 60 Lernobjekten, sechs zusammenhängenden Kurztexten, sechs Dialogsituationen und drei freien Transferchecks. Verständnis und freie Produktion liefern zusätzliche Evidenz, ohne Prüfungs-Gates zu verändern.');