import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

const root=process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const errors=[];
const assert=(ok,msg)=>{if(!ok)errors.push(msg)};

// Den vollständigen v48-Regressionsumfang weiterverwenden, aber auf die bewusst
// erhöhten v49-Komponenten umbiegen. So bleiben alle bisherigen Schutzregeln aktiv.
let inherited=read('tests/validate-v48.mjs');
const replacements=[
  ["const VERSION='48'","const VERSION='49'"],
  ["learning-core.js?v=4","learning-core.js?v=5"],
  ["selftest.js?v=37","selftest.js?v=38"],
  ["Laufzeit-Selbsttest v37","Laufzeit-Selbsttest v38"],
  ["version===48","version===49"],
  ["VALIDIERUNG OK: v48","VALIDIERUNG OK: v49"]
];
for(const [from,to] of replacements){assert(inherited.includes(from),`v48-Basisschutz enthält erwarteten Marker nicht: ${from}`);inherited=inherited.split(from).join(to)}
const inheritedFile=path.join(root,'.validate-v49-inherited.mjs');
if(errors.length){console.error(`VALIDIERUNG FEHLGESCHLAGEN (${errors.length})`);errors.forEach(e=>console.error('- '+e));process.exit(1)}
fs.writeFileSync(inheritedFile,inherited,'utf8');
try{await import(pathToFileURL(inheritedFile).href+'?v49='+Date.now())}finally{try{fs.unlinkSync(inheritedFile)}catch{}}

const loader=read('ukrainischkurs-v2-loader.js');
assert(loader.includes("const VERSION='49'"),'Loader ist nicht v49');
assert(loader.includes('learning-core.js?v=5'),'Loader lädt Learning Core nicht als v5');
assert(loader.includes('skill-profile.js?v=3'),'Loader lädt Skill Profile nicht als v3');
assert(loader.includes('selftest.js?v=38'),'Loader lädt Selbsttest nicht als v38');

const sw=read('ukrainisch-lernen-sw.js');
assert(sw.includes("const VERSION='49'"),'Service Worker ist nicht v49');
const coreSource=read('ukrainischkurs-learning-core.js');
assert(coreSource.includes('const VERSION=5'),'Learning Core ist nicht v5');
for(const marker of ['function cumulativeScore','function recentScore','function staleDays','function priorityScore','Math.pow(.82,age)','entry?.assisted ? .65 : 1','clamp((stale-3)*.75,0,8)'])assert(coreSource.includes(marker),`Learning Core v5 vermisst ${marker}`);
const profileSource=read('ukrainischkurs-skill-profile.js');
assert(profileSource.includes('const VERSION=3'),'Skill Profile ist nicht v3');
assert(profileSource.includes('recencyAware:true')&&profileSource.includes('stalePriority:true'),'Skill Profile exportiert die v49-Prioritätsregeln nicht');
const selftest=read('ukrainischkurs-selftest.js');
assert(selftest.includes('Laufzeit-Selbsttest v38')&&selftest.includes('version===49'),'Selbsttest ist nicht auf v49 aktualisiert');
assert(selftest.includes("'cumulativeScore','recentScore','skillScore','staleDays','priorityScore'"),'Selbsttest prüft die neuen Core-Funktionen nicht');

// Verhalten des aktualitätsgewichteten Skill-Modells isoliert simulieren.
let today='2026-09-20';
const state={day:20,learningCore:{version:5,skills:{},focusHistory:{},seeded:true}};
const ctx={console,window:{},s:state,D:Array.from({length:30},()=>['','','',[]]),WEEKLY_REVIEW_DAYS:[20,27],date:()=>today,save(){}};
vm.createContext(ctx);
try{
  vm.runInContext(coreSource,ctx,{filename:'ukrainischkurs-learning-core.js'});
  const core=ctx.window.UKRAINIAN_LEARNING_CORE;
  assert(core?.version===5,'Simulierter Learning Core ist nicht v5');
  for(const fn of ['cumulativeScore','recentScore','skillScore','staleDays','priorityScore','rankedSkills'])assert(typeof core?.[fn]==='function',`Simulierter Core vermisst ${fn}`);

  for(let i=0;i<4;i++)core.recordSession({skills:['writing'],correct:4,total:10,passed:false,module:'old-writing',date:`2026-09-0${i+1}`,day:i});
  for(let i=0;i<4;i++)core.recordSession({skills:['writing'],correct:10,total:10,passed:true,module:'recent-writing',date:`2026-09-${17+i}`,day:16+i});
  const cumulative=core.cumulativeScore('writing'),recent=core.recentScore('writing'),adaptive=core.skillScore('writing');
  assert(recent>cumulative,'Jüngere starke Schreib-Leistungen werden nicht stärker als der alte Gesamtschnitt gewichtet');
  assert(adaptive>cumulative,'Adaptiver Schreibscore bleibt trotz klarer neuer Verbesserung am historischen Gesamtschnitt hängen');
  assert(adaptive<recent,'Adaptiver Schreibscore verwirft den stabilisierenden Langzeitanteil vollständig');

  core.recordSession({skills:['reading'],correct:8,total:10,passed:true,module:'reading',date:'2026-09-10',day:10});
  core.recordSession({skills:['listening'],correct:8,total:10,passed:true,module:'listening',date:'2026-09-20',day:20});
  assert(core.skillScore('reading')===core.skillScore('listening'),'Vergleichs-Skills starten nicht mit identischem Leistungswert');
  assert(core.staleDays('reading')===10&&core.staleDays('listening')===0,'Tage seit letzter Skill-Messung werden falsch berechnet');
  assert(core.priorityScore('reading')<core.priorityScore('listening'),'Länger nicht geprüfter Skill wird bei gleichem Leistungswert nicht leicht vorgezogen');
  const ranked=core.rankedSkills(1);assert(ranked.indexOf('reading')<ranked.indexOf('listening'),'Review-Ranking berücksichtigt die Stale-Priorität nicht');

  core.recordSession({skills:['grammar'],correct:8,total:10,passed:true,module:'grammar',date:'2026-09-18',day:18});
  assert(core.staleDays('grammar')===2,'Kurze Aktualitätsdistanz wird falsch berechnet');
  assert(core.priorityScore('grammar')===core.skillScore('grammar'),'Vor Ablauf von drei Tagen wird bereits künstlich eine Vergessensstrafe angesetzt');
  assert(core.reviewFocus()==='reading','Automatischer Review-Fokus nutzt das neue Prioritätsranking nicht');
}catch(e){errors.push(`v49-Skill-Simulation: ${e.stack||e.message}`)}

if(errors.length){console.error(`VALIDIERUNG FEHLGESCHLAGEN (${errors.length})`);errors.forEach(e=>console.error('- '+e));process.exit(1)}
console.log('VALIDIERUNG OK: v49 behält alle v48-Schutzregeln und gewichtet die adaptive Skill-Diagnose zusätzlich nach jüngerer Leistung und moderater Zeit seit der letzten Messung; alte Fehler dominieren nicht dauerhaft, frische Skills werden nicht vorschnell abgestraft und A1-Gates bleiben unverändert.');
