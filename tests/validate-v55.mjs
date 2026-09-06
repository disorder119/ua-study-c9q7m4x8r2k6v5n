import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

const root=process.cwd(),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const errors=[];const assert=(ok,msg)=>{if(!ok)errors.push(msg)};

// Sämtliche v54-Regeln weiterverwenden. Release-/Selbsttest-Marker und das bewusst
// auf v2 gehobene Gerätewechsel-Modul werden auf v55 abgebildet. Dadurch bleiben
// alle v54/v53/v52/v51-, A1-, Alphabet- und SRS-Schutzregeln aktiv.
let inherited=read('tests/validate-v54.mjs');
const replacements=[
  ["const VERSION='54'","const VERSION='55'"],
  ['device-continuity.js?v=1','device-continuity.js?v=2'],
  ['selftest.js?v=43','selftest.js?v=44'],
  ['Laufzeit-Selbsttest v43','Laufzeit-Selbsttest v44'],
  ['version===54','version===55'],
  ["const VERSION=1,FORMAT='ukrainischkurs-handoff-v1'","const VERSION=2,FORMAT='ukrainischkurs-handoff-v1'"],
  ['UKRAINIAN_COURSE_LOADER:{version:54}','UKRAINIAN_COURSE_LOADER:{version:55}'],
  ['env.courseVersion===54','env.courseVersion===55'],
  ['VALIDIERUNG OK: v54','VALIDIERUNG OK: v55']
];
for(const [from,to] of replacements){assert(inherited.includes(from),`v54-Basisschutz enthält erwarteten Marker nicht: ${from}`);inherited=inherited.split(from).join(to)}
const inheritedFile=path.join(root,'.validate-v55-inherited.mjs');
if(errors.length){console.error(`VALIDIERUNG FEHLGESCHLAGEN (${errors.length})`);errors.forEach(e=>console.error('- '+e));process.exit(1)}
fs.writeFileSync(inheritedFile,inherited,'utf8');
try{await import(pathToFileURL(inheritedFile).href+'?v55='+Date.now())}finally{try{fs.unlinkSync(inheritedFile)}catch{}}

const loader=read('ukrainischkurs-v2-loader.js'),sw=read('ukrainisch-lernen-sw.js'),selftest=read('ukrainischkurs-selftest.js');
const continuity=read('ukrainischkurs-device-continuity.js'),interaction=read('ukrainischkurs-interaction-input-expansion.js');
assert(loader.includes("const VERSION='55'"),'Loader ist nicht v55');
for(const marker of ['device-continuity.js?v=2','interaction-input-expansion.js?v=1','selftest.js?v=44'])assert(loader.includes(marker),`Loader vermisst ${marker}`);
assert(loader.indexOf('learning-core.js?v=5')<loader.indexOf('device-continuity.js?v=2'),'Geräte-Schnelltransfer wird nicht nach dem zentralen Lernkern geladen');
assert(loader.indexOf('bridge-input-expansion.js?v=1')<loader.indexOf('interaction-input-expansion.js?v=1'),'v55-Interaktionsinput liegt nicht nach dem v54-Brückeninput');
assert(loader.indexOf('interaction-input-expansion.js?v=1')<loader.indexOf('a1-exam.js?v=2'),'v55-Interaktionsinput liegt nicht vor der unveränderten A1-Prüfung');
assert(sw.includes("const VERSION='55'"),'Service Worker ist nicht v55');
for(const asset of ['./ukrainischkurs-device-continuity.js','./ukrainischkurs-interaction-input-expansion.js'])assert(sw.includes(`'${asset}'`),`Offline-Asset fehlt: ${asset}`);
assert(selftest.includes('Laufzeit-Selbsttest v44')&&selftest.includes('version===55'),'Selbsttest ist nicht auf v55 aktualisiert');
assert(selftest.includes('quickHandoff===true')&&selftest.includes('UKRAINIAN_INTERACTION_INPUT_EXPANSION'),'Selbsttest prüft Schnelltransfer/neuen Input nicht');

// Device Continuity v2: bestehende v54-Schutzmechanismen bleiben bestehen und ein
// lokaler Schnelltransfer per URL-Fragment kommt hinzu. Kein Lernstand-Upload.
assert(continuity.includes("const VERSION=2,FORMAT='ukrainischkurs-handoff-v1',QUICK_PREFIX='UKR-H1.'"),'Device Continuity ist nicht v2 mit kompatiblem Handoff-Format');
for(const marker of ['quickHandoff:true','fragmentTransport:true','compressionWhenAvailable:true','noNetworkUpload:true','automaticCloudSync:false','CompressionStream','DecompressionStream',"'#handoff='",'history?.replaceState','navigator?.clipboard?.writeText','navigator?.share','MAX_LINK_LENGTH=60000'])assert(continuity.includes(marker),`Schnelltransfer vermisst ${marker}`);
for(const fn of ['makeQuickCode','parseQuickCode','makeHandoffLink','importQuick','consumeHashHandoff'])assert(continuity.includes(`function ${fn}`)||continuity.includes(`async function ${fn}`),`Schnelltransfer-Funktion fehlt: ${fn}`);
assert(!continuity.includes('fetch(')&&!continuity.includes('XMLHttpRequest'),'Device Continuity lädt/sendet Lernstand unerwartet über Netzwerk');
assert(continuity.includes("storeRecovery('vor-import'")&&continuity.includes("storeRecovery('vor-reset'"),'Schnelltransfer hat v54-Rettungspunkte verloren');

// Plain-Fallback des Schnelltransfer-Codes isoliert simulieren. Damit ist auch ein
// Browser ohne CompressionStream weiterhin interoperabel; Prüfsumme und Link-Import
// laufen durch denselben v54-Parser.
try{
  const mem=new Map(),localStorage={getItem:k=>mem.has(k)?mem.get(k):null,setItem:(k,v)=>mem.set(k,String(v)),removeItem:k=>mem.delete(k)};
  const D=Array.from({length:160},()=>['','','',[]]);let s={day:30,known:{a:{},b:{}},lessonProgress:{0:{testPassed:true,spoken:true,reviewDone:true}},dates:['2026-11-01','2026-11-02'],syncMeta:{schema:1,revision:7,updatedAt:'2026-11-02T10:00:00.000Z',lastDeviceId:'x'}};
  const elements=new Map();const document={createElement(tag){return {tagName:tag,id:'',className:'',innerHTML:'',value:'',style:{},append(){},appendChild(){},setAttribute(){},select(){},remove(){},click(){},querySelector(){return null},querySelectorAll(){return[]}}},body:{append(){}},head:{append(){}},getElementById(id){return elements.get(id)||null},querySelector(){return null},execCommand(){return true}};
  const location={href:'https://example.test/ukrainischkurs-app.html',hash:'',pathname:'/ukrainischkurs-app.html',search:''};
  const window={localStorage,navigator:{},crypto:{randomUUID:()=> 'device-v55'},UKRAINIAN_COURSE_LOADER:{version:55},confirm:()=>true,addEventListener(){},location,history:{replaceState(){}}};
  const ctx={window,localStorage,D,s,KEY:'ukrainischkurs-joel-v4',save(){},normal:x=>JSON.parse(JSON.stringify(x)),syncLessons(){},render(){},stats(){},toast(){},date:()=> '2026-11-02',resetProgress(){},document,console,setTimeout,clearTimeout,Blob:globalThis.Blob,Response:globalThis.Response,TextEncoder:globalThis.TextEncoder,TextDecoder:globalThis.TextDecoder,Uint8Array,URL:globalThis.URL,URLSearchParams:globalThis.URLSearchParams,btoa:globalThis.btoa,atob:globalThis.atob,File:globalThis.File};
  vm.createContext(ctx);vm.runInContext(continuity,ctx,{filename:'ukrainischkurs-device-continuity.js'});
  const dc=ctx.window.UKRAINIAN_DEVICE_CONTINUITY;
  const code=await dc.makeQuickCode(ctx.s);assert(code.startsWith('UKR-H1.P.'),'Schnelltransfer nutzt ohne CompressionStream nicht den sicheren Plain-Fallback');
  const parsed=await dc.parseQuickCode(code);assert(parsed.progress.day===30&&parsed.progress.syncMeta.revision>=7,'Schnelltransfer-Code verliert Lernstand/Revision');
  const link=await dc.makeHandoffLink(ctx.s);assert(link.includes('#handoff=UKR-H1.'),'Gerätewechsel-Link transportiert den Code nicht im URL-Fragment');
  const parsedLink=await dc.parseQuickCode(link);assert(parsedLink.progress.day===30,'Gerätewechsel-Link lässt sich nicht wieder einlesen');
}catch(e){errors.push(`v55-Quick-Handoff-Simulation: ${e.stack||e.message}`)}

// Neuer A1+ Interaktionsinput: weitere 12/60, sechs Texte, drei freie Reviews und
// sechs Dialoge; zentrale Diagnose ja, direkte A1-Gate-Manipulation nein.
assert(interaction.includes('const VERSION=1'),'Interaction Input Expansion ist nicht v1');
for(const marker of ['lessonCount:LESSONS.length','inputItems:LESSONS.reduce','textCount:Object.keys(TEXTS).length','reviewCount:reviewDays.length','dialogCount:6','centralScoring:true','errorAware:true','competencyAware:true','affectsExamGate:false'])assert(interaction.includes(marker),`Interaction Input Expansion vermisst ${marker}`);
for(const phrase of ['Що це означає?','Я не встигаю','Мені пів кіло, будь ласка','Я замовляв інше','Треба пересідати?','У мене бронювання','Де смітник?','Що мені робити далі?','Зв’язок поганий','Радий познайомитися','Я не купую це, бо дорого','Сьогодні в мене багато справ'])assert(interaction.includes(phrase),`v55-Interaktionsinput fehlt: ${phrase}`);
assert(interaction.includes("core.recordSession({skills:['reading']")&&interaction.includes("core.recordSession({skills:['writing','grammar']"),'v55-Input liefert keine getrennte Lese-/Transfer-Evidenz');
assert(interaction.includes('UKRAINIAN_ERROR_MEMORY?.record?.')&&interaction.includes('UKRAINIAN_COMPETENCY_MASTERY?.record?.'),'v55-Transfer speist Diagnose nicht');
assert(!interaction.includes('s.a1Exam=')&&!interaction.includes('s.a1CanDo.passed=')&&!interaction.includes('registerMilestone('),'v55-Input verändert bestehende A1-Gates direkt');
assert(!interaction.includes('fetch('),'v55-Input ist nicht vollständig lokal/offline');
try{
  const D=Array.from({length:136},(_,i)=>[`Alt ${i}`,'','',[]]),WEEKLY_REVIEW_DAYS=[20,80,120,135],DIALOGS={},s={day:136,a1Exam:{sentinel:'unchanged'}};
  const core={accepts:(v,a)=>a.includes(v),recordSession(){},normalize:v=>String(v),isComplete:()=>true};
  const document={createElement(){return {id:'',className:'',hidden:false,innerHTML:'',onclick:null,scrollIntoView(){},querySelector(){return null},querySelectorAll(){return[]},insertAdjacentElement(){},addEventListener(){}}},head:{append(){}},getElementById(){return null}};
  const ctx={window:{UKRAINIAN_LEARNING_CORE:core,UKRAINIAN_ERROR_MEMORY:{record(){}},UKRAINIAN_COMPETENCY_MASTERY:{record(){}}},D,WEEKLY_REVIEW_DAYS,DIALOGS,s,date:()=> '2026-11-10',save(){},render(){},toast(){},speak(){},document,console,setTimeout};
  vm.createContext(ctx);vm.runInContext(interaction,ctx,{filename:'ukrainischkurs-interaction-input-expansion.js'});
  const mod=ctx.window.UKRAINIAN_INTERACTION_INPUT_EXPANSION;
  assert(D.length===148,'Interaction Input Expansion hängt nicht exakt 12 weitere Kurstage an');
  assert(mod?.lessonCount===12&&mod?.inputItems===60&&mod?.textCount===6&&mod?.reviewCount===3&&mod?.dialogCount===6,'Runtime-Export meldet nicht 12/60/6 Texte/3 Reviews/6 Dialoge');
  assert(WEEKLY_REVIEW_DAYS.includes(139)&&WEEKLY_REVIEW_DAYS.includes(143)&&WEEKLY_REVIEW_DAYS.includes(147),'Die drei v55-Review-Tage liegen nicht nach jeweils vier Lektionen');
  assert(Object.keys(DIALOGS).length===6,'v55-Input fügt nicht exakt sechs Dialoge hinzu');
  assert(s.a1Exam?.sentinel==='unchanged','v55-Input verändert vorhandenen A1-Prüfungszustand');
}catch(e){errors.push(`v55-Interaction-Input-Simulation: ${e.stack||e.message}`)}

if(errors.length){console.error(`VALIDIERUNG FEHLGESCHLAGEN (${errors.length})`);errors.forEach(e=>console.error('- '+e));process.exit(1)}
console.log('VALIDIERUNG OK: v55 behält sämtliche v54/v53/v52/v51/A1-Schutzregeln, ergänzt zwölf weitere A1+-Interaktionslektionen mit 60 Lernobjekten und macht den Laptop-/iPhone-Wechsel per geprüftem URL-Fragment-Schnelltransfer deutlich einfacher. Automatischer Cloud-Sync und Netzwerk-Upload werden ohne Backend weiterhin nicht vorgetäuscht.');