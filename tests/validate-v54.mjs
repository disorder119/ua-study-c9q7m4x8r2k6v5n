import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

const root=process.cwd(),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const errors=[];const assert=(ok,msg)=>{if(!ok)errors.push(msg)};

// Sämtliche v53-Regeln weiterverwenden. Nur Release-/Selbsttest-Marker werden
// auf v54 gehoben; damit bleiben alle v53/v52/v51-, A1-, Alphabet- und SRS-Gates aktiv.
let inherited=read('tests/validate-v53.mjs');
const replacements=[
  ["const VERSION='53'","const VERSION='54'"],
  ['selftest.js?v=42','selftest.js?v=43'],
  ['Laufzeit-Selbsttest v42','Laufzeit-Selbsttest v43'],
  ['version===53','version===54'],
  ['VALIDIERUNG OK: v53','VALIDIERUNG OK: v54']
];
for(const [from,to] of replacements){assert(inherited.includes(from),`v53-Basisschutz enthält erwarteten Marker nicht: ${from}`);inherited=inherited.split(from).join(to)}
const inheritedFile=path.join(root,'.validate-v54-inherited.mjs');
if(errors.length){console.error(`VALIDIERUNG FEHLGESCHLAGEN (${errors.length})`);errors.forEach(e=>console.error('- '+e));process.exit(1)}
fs.writeFileSync(inheritedFile,inherited,'utf8');
try{await import(pathToFileURL(inheritedFile).href+'?v54='+Date.now())}finally{try{fs.unlinkSync(inheritedFile)}catch{}}

const loader=read('ukrainischkurs-v2-loader.js'),sw=read('ukrainisch-lernen-sw.js'),selftest=read('ukrainischkurs-selftest.js');
const continuity=read('ukrainischkurs-device-continuity.js'),bridge=read('ukrainischkurs-bridge-input-expansion.js');
assert(loader.includes("const VERSION='54'"),'Loader ist nicht v54');
for(const marker of ['device-continuity.js?v=1','bridge-input-expansion.js?v=1','selftest.js?v=43'])assert(loader.includes(marker),`Loader vermisst ${marker}`);
assert(loader.indexOf('learning-core.js?v=5')<loader.indexOf('device-continuity.js?v=1'),'Gerätewechsel wird nicht nach dem zentralen Lernkern geladen');
assert(loader.indexOf('natural-input-expansion.js?v=1')<loader.indexOf('bridge-input-expansion.js?v=1'),'v54-Brückeninput liegt nicht nach dem v53-Natural-Input');
assert(loader.indexOf('bridge-input-expansion.js?v=1')<loader.indexOf('a1-exam.js?v=2'),'v54-Brückeninput liegt nicht vor der unveränderten A1-Prüfung');
assert(sw.includes("const VERSION='54'"),'Service Worker ist nicht v54');
for(const asset of ['./ukrainischkurs-device-continuity.js','./ukrainischkurs-bridge-input-expansion.js'])assert(sw.includes(`'${asset}'`),`Offline-Asset fehlt: ${asset}`);
assert(selftest.includes('Laufzeit-Selbsttest v43')&&selftest.includes('version===54'),'Selbsttest ist nicht auf v54 aktualisiert');
assert(selftest.includes('UKRAINIAN_DEVICE_CONTINUITY')&&selftest.includes('UKRAINIAN_BRIDGE_INPUT_EXPANSION'),'Selbsttest prüft Gerätewechsel/neuen Input nicht');

// Gerätewechsel: kein Fake-Cloud-Sync, dafür Prüfsumme, Versionsschutz, ältere-Sicherung-Warnung
// und lokale Rettungspunkte vor Import/Reset.
assert(continuity.includes("const VERSION=1,FORMAT='ukrainischkurs-handoff-v1'"),'Device Continuity ist nicht v1/Handoff-v1');
for(const marker of ['manualHandoff:true','automaticCloudSync:false','checksum:true','recoveryBeforeImport:true','recoveryBeforeReset:true','olderSnapshotGuard:true','courseVersionGuard:true','storeRecovery(\'vor-import\'','storeRecovery(\'vor-reset\'','x.checksum!==checksum(x.progress)','Number(x.courseVersion)>COURSE_VERSION','window.navigator?.storage?.persist','window.navigator?.share'])assert(continuity.includes(marker),`Gerätewechsel vermisst Schutz/Übergabe: ${marker}`);
assert(continuity.includes("exportBtn.onclick=exportHandoff")&&continuity.includes("importInput.onchange="),'Alte Export-/Import-UI wird nicht auf sicheren Gerätewechsel umgestellt');
assert(!continuity.includes('fetch(')&&!continuity.includes('XMLHttpRequest'),'Gerätewechsel sendet Lernstand unerwartet an ein Netzwerkziel');
assert(!continuity.includes('localStorage.clear('),'Gerätewechsel löscht nicht zielgerichtet, sondern würde gesamten Browser-Speicher leeren');

// Isolierte Gerätewechsel-Simulation: Paket ist prüfbar, Beschädigung wird erkannt,
// ältere Stände werden erkannt und Recovery bleibt getrennt vom eigentlichen Lernstand.
try{
  const mem=new Map();const localStorage={getItem:k=>mem.has(k)?mem.get(k):null,setItem:(k,v)=>mem.set(k,String(v)),removeItem:k=>mem.delete(k)};
  const D=Array.from({length:140},()=>['','','',[]]);let s={day:20,known:{a:{}},lessonProgress:{0:{testPassed:true,spoken:true,reviewDone:true}},dates:['2026-10-01'],syncMeta:{schema:1,revision:4,updatedAt:'2026-10-02T10:00:00.000Z',lastDeviceId:'x'}};
  const document={createElement(){return {className:'',id:'',innerHTML:'',append(){},click(){},querySelector(){return null},querySelectorAll(){return[]}}},head:{append(){}},getElementById(){return null},querySelector(){return null}};
  const ctx={window:{localStorage,navigator:{},crypto:{randomUUID:()=> 'device-test'},UKRAINIAN_COURSE_LOADER:{version:54},confirm:()=>true,addEventListener(){}},localStorage,D,s,KEY:'ukrainischkurs-joel-v4',save(){},normal:x=>JSON.parse(JSON.stringify(x)),syncLessons(){},render(){},stats(){},toast(){},date:()=> '2026-10-02',resetProgress(){},document,console,setTimeout,clearTimeout,Blob:globalThis.Blob,URL:{createObjectURL:()=>'',revokeObjectURL(){}},File:globalThis.File};
  vm.createContext(ctx);vm.runInContext(continuity,ctx,{filename:'ukrainischkurs-device-continuity.js'});
  const dc=ctx.window.UKRAINIAN_DEVICE_CONTINUITY,env=dc.makeEnvelope(ctx.s);
  assert(env.format==='ukrainischkurs-handoff-v1'&&env.courseVersion===54,'Übergabepaket hat falsches Format/Kursversion');
  assert(dc.parsePackage(JSON.stringify(env)).progress.day===20,'Gültiges Übergabepaket lässt sich nicht wieder lesen');
  const damaged=JSON.parse(JSON.stringify(env));damaged.progress.day=21;let rejected=false;try{dc.parsePackage(damaged)}catch{rejected=true}assert(rejected,'Beschädigtes Übergabepaket wird trotz falscher Prüfsumme akzeptiert');
  assert(dc.looksOlder({day:10,completed:0,known:0,studyDays:0,updatedAt:'2026-09-01T00:00:00Z'},{day:20,completed:1,known:1,studyDays:1,updatedAt:'2026-10-01T00:00:00Z'})===true,'Offensichtlich älterer Lernstand wird nicht erkannt');
  assert(dc.storeRecovery('test',ctx.s)===true&&JSON.parse(localStorage.getItem('ukrainischkurs-recovery-v1')).length===1,'Lokaler Rettungspunkt wird nicht getrennt gespeichert');
}catch(e){errors.push(`v54-Device-Continuity-Simulation: ${e.stack||e.message}`)}

// Neuer A1+ Input: noch einmal 12/60, sechs Kurztexte, drei freie Reviews,
// sechs Dialoge und keinerlei direkte A1-Gate-Manipulation.
assert(bridge.includes('const VERSION=1'),'Bridge Input Expansion ist nicht v1');
for(const marker of ['lessonCount:LESSONS.length','inputItems:LESSONS.reduce','textCount:Object.keys(TEXTS).length','reviewCount:reviewDays.length','dialogCount:6','centralScoring:true','errorAware:true','affectsExamGate:false'])assert(bridge.includes(marker),`Bridge Input Expansion vermisst ${marker}`);
for(const phrase of ['спочатку','Мені подобається це','Я шукаю чорну куртку','Столик на двох, будь ласка','Чи є прямий автобус?','Аптека навпроти банку','У мене болить голова','Немає гарячої води','Я запізнюся','Що ти робиш у вихідні?','Учора я був у місті','Завтра я поїду в місто'])assert(bridge.includes(phrase),`v54-Zusatzinput fehlt: ${phrase}`);
assert(bridge.includes("core.recordSession({skills:['reading']")&&bridge.includes("core.recordSession({skills:['writing','grammar']"),'v54-Input liefert keine getrennte Lese-/Transfer-Evidenz');
assert(bridge.includes('UKRAINIAN_ERROR_MEMORY?.record?.')&&bridge.includes('UKRAINIAN_COMPETENCY_MASTERY?.record?.'),'v54-Transfer speist Diagnose nicht');
assert(!bridge.includes('s.a1Exam=')&&!bridge.includes('s.a1CanDo.passed=')&&!bridge.includes('registerMilestone('),'v54-Input verändert bestehende A1-Gates direkt');
assert(!bridge.includes('fetch('),'v54-Input ist nicht vollständig lokal/offline');
try{
  const D=Array.from({length:124},(_,i)=>[`Alt ${i}`,'','',[]]),WEEKLY_REVIEW_DAYS=[20,60,100,123],DIALOGS={},s={day:124,a1Exam:{sentinel:'unchanged'}};
  const core={accepts:(v,a)=>a.includes(v),recordSession(){},normalize:v=>String(v),isComplete:()=>true};
  const document={createElement(){return {id:'',className:'',hidden:false,innerHTML:'',onclick:null,scrollIntoView(){},querySelector(){return null},querySelectorAll(){return[]},insertAdjacentElement(){},addEventListener(){}}},head:{append(){}},getElementById(){return null}};
  const ctx={window:{UKRAINIAN_LEARNING_CORE:core,UKRAINIAN_ERROR_MEMORY:{record(){}},UKRAINIAN_COMPETENCY_MASTERY:{record(){}}},D,WEEKLY_REVIEW_DAYS,DIALOGS,s,date:()=> '2026-10-30',save(){},render(){},toast(){},speak(){},document,console,setTimeout};
  vm.createContext(ctx);vm.runInContext(bridge,ctx,{filename:'ukrainischkurs-bridge-input-expansion.js'});
  const mod=ctx.window.UKRAINIAN_BRIDGE_INPUT_EXPANSION;
  assert(D.length===136,'Bridge Input Expansion hängt nicht exakt 12 weitere Kurstage an');
  assert(mod?.lessonCount===12&&mod?.inputItems===60&&mod?.textCount===6&&mod?.reviewCount===3&&mod?.dialogCount===6,'Runtime-Export meldet nicht 12/60/6 Texte/3 Reviews/6 Dialoge');
  assert(WEEKLY_REVIEW_DAYS.includes(127)&&WEEKLY_REVIEW_DAYS.includes(131)&&WEEKLY_REVIEW_DAYS.includes(135),'Die drei v54-Review-Tage liegen nicht nach jeweils vier Lektionen');
  assert(Object.keys(DIALOGS).length>=6,'v54-Input fügt zu wenige Dialoge hinzu');
  assert(s.a1Exam?.sentinel==='unchanged','v54-Input verändert vorhandenen A1-Prüfungszustand');
}catch(e){errors.push(`v54-Bridge-Input-Simulation: ${e.stack||e.message}`)}

if(errors.length){console.error(`VALIDIERUNG FEHLGESCHLAGEN (${errors.length})`);errors.forEach(e=>console.error('- '+e));process.exit(1)}
console.log('VALIDIERUNG OK: v54 behält sämtliche v53/v52/v51/A1-Schutzregeln, ergänzt zwölf weitere A1+-Lektionen mit 60 Lernobjekten und macht den Laptop-/iPhone-Wechsel durch geprüfte Übergabepakete, Versions-/Prüfsummencheck, Schutz vor älteren Sicherungen und lokale Rettungspunkte deutlich sicherer. Automatischer Cloud-Sync wird ohne Backend ausdrücklich nicht vorgetäuscht.');