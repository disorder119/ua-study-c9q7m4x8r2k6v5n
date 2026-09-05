import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
const root=process.cwd(),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const errors=[];const assert=(ok,msg)=>{if(!ok)errors.push(msg)};const compile=(code,name)=>{try{new vm.Script(code,{filename:name})}catch(e){errors.push(`${name}: ${e.message}`)}};

for(const file of fs.readdirSync(root).filter(x=>/^ukrainischkurs-.*\.js$/.test(x)).concat('ukrainisch-lernen-sw.js'))compile(read(file),file);
for(const file of ['ukrainisch-lernen.html','ukrainischkurs-app.html','index.html']){let i=0;for(const m of read(file).matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi))compile(m[1],`${file} inline-${++i}`)}
try{JSON.parse(read('ukrainisch-lernen.webmanifest'))}catch(e){errors.push(`Manifest: ${e.message}`)}

const base=read('ukrainisch-lernen.html'),app=read('ukrainischkurs-app.html');
assert(app===base.replace('</body>','<script src="./ukrainischkurs-v2-loader.js"></script>\n</body>'),'App-Hülle ist nicht deterministisch aktuell');

const loader=read('ukrainischkurs-v2-loader.js');
assert(loader.includes("const VERSION='47'"),'Loader ist nicht v47');
for(const t of ['learning-state-guard.js?v=1','designer-alphabet.js?v=3','fashion-bridge.js?v=1','resale-practice.js?v=1','learning-core.js?v=4','a1-exam.js?v=2','selftest.js?v=36'])assert(loader.includes(t),`Loader vermisst ${t}`);
assert(loader.indexOf('quality-hardening.js')<loader.indexOf('learning-state-guard.js')&&loader.indexOf('learning-state-guard.js')<loader.indexOf('adaptive-alphabet.js'),'Learning State Guard wird nicht zwischen Qualitäts-Härtung und Alphabet-Mastery geladen');
assert(loader.indexOf('learning-core.js')<loader.indexOf('fashion-bridge.js')&&loader.indexOf('fashion-bridge.js')<loader.indexOf('resale-practice.js'),'Additive Fashion-/Resale-Reihenfolge ist falsch');

const sw=read('ukrainisch-lernen-sw.js');
assert(sw.includes("const VERSION='47'"),'Service Worker ist nicht v47');
for(const asset of ["'./ukrainischkurs-learning-state-guard.js'","'./ukrainischkurs-fashion-bridge.js'","'./ukrainischkurs-resale-practice.js'","'./ukrainischkurs-a1-exam.js'"])assert(sw.includes(asset),`Offline-Asset fehlt: ${asset}`);
assert(sw.includes('else if(stableLoader)event.respondWith(freshAssetResponse(event.request,url))'),'Stable Loader ist nicht network-first');
assert(!sw.includes('ignoreSearch:true'),'Service Worker ignoriert wieder Versions-Querys');
assert(sw.includes('await cache.put(request,response.clone())'),'Service-Worker Cache-Schreibvorgang wird nicht abgewartet');

const guard=read('ukrainischkurs-learning-state-guard.js');
for(const marker of ['startOnFirstStudy:true','perDayDailyState:true','perDayPronunciationState:true','strictAlphabetCalendar:true','completionDates:true','completed<date()'])assert(guard.includes(marker),`Learning State Guard vermisst ${marker}`);
assert(guard.includes("s.courseStartDate=dates[0]||(hasLearningEvidence()?before:'')"),'Leerer Kurs startet weiterhin beim bloßen Öffnen');
assert(guard.includes('if(!s.courseStartDate)s.courseStartDate=date()'),'Erste echte Lernaktivität verankert den Kursstart nicht');
assert(guard.includes('current.date!==d||Number(current.day)!==day'),'Allgemeiner Tagesstatus ist nicht Datum + Lektion scoped');
assert(guard.includes('s.pronunciation.dailyByLesson'),'Aussprache-Tagesstatus wird nicht pro Lektion gesichert');
assert(guard.includes("$('next').onclick=advanceLesson"),'Korrigiertes Tagesgate ist nicht an den Weiter-Button gebunden');

// Verhalten der v47-Härtung in einem kleinen isolierten Zustandsmodell prüfen.
let today='2026-09-05';
const state={day:0,courseStartDate:'2026-09-05',dates:[],history:{},known:{},lessonProgress:{},done:{},daily:{date:'2026-09-05',listened:false,spoken:false,game:false,newSeen:false,recall:false,dialog:false},pronunciation:{daily:{date:'2026-09-05',reference:[],recorded:false,replayed:false,selfPassed:false,manual:false,checked:false,checkPassed:false,contrastCorrect:0,contrastTotal:0}}};
const blank=()=>({daily:{date:'',listened:false,spoken:false,game:false,newSeen:false,recall:false,dialog:false}});
const ctx={console,window:{},s:state,D:Array.from({length:20},()=>['','','',[]]),date:()=>today,blank,save(){},study(){if(!state.dates.includes(today))state.dates.push(today)},lessonComplete(di){const p=state.lessonProgress[di];return !!(p&&p.testPassed&&p.spoken&&p.reviewDone)},syncLesson(di){if(this.lessonComplete(di))state.done[di]=true;else delete state.done[di]},syncLessons(){},render(){},resetProgress(){},alphabetReady(){return true},requireAlphabet(){return true},completedLessons(){let n=0;while(state.done[n])n++;return n},$(){return null},toast(){},show(){},document:{createElement(){return {className:'',innerHTML:'',title:'',onclick:null,append(){}}}}};
vm.createContext(ctx);
try{
  vm.runInContext(guard,ctx,{filename:'ukrainischkurs-learning-state-guard.js'});
  assert(state.courseStartDate==='','Frischer Vorab-Aufruf wird nicht vom Kursstart entkoppelt');
  ctx.study();assert(state.courseStartDate==='2026-09-05','Erste echte Lernaktivität setzt den Kursstart nicht');
  state.daily.listened=true;state.day=1;ctx.ensureDaily();assert(state.daily.day===1&&state.daily.listened===false,'Hörstatus läuft in den nächsten Kurstag über');
  state.day=0;ctx.ensureDaily();assert(state.daily.listened===true,'Kurstag-spezifischer Tagesstatus wird beim Zurückwechseln nicht erhalten');
  state.pronunciation.daily.recorded=true;state.day=1;ctx.render();assert(state.pronunciation.daily.day===1&&state.pronunciation.daily.recorded===false,'Aussprache-Aufnahme läuft in den nächsten Kurstag über');
  state.day=0;ctx.render();assert(state.pronunciation.daily.recorded===true,'Aussprache-Status des ursprünglichen Kurstags wird nicht wiederhergestellt');
  state.lessonProgress[0]={testPassed:true,spoken:true,reviewDone:true,testDate:'2026-09-05'};ctx.syncLesson(0);assert(state.lessonProgress[0].completedDate==='2026-09-05','Abschlussdatum wird nicht gestempelt');
  assert(ctx.window.UKRAINIAN_LEARNING_STATE_GUARD.alphabetDayAllowed(1)===false,'Tag 2 öffnet sich noch am selben Kalendertag wie Tag 1');
  today='2026-09-06';assert(ctx.window.UKRAINIAN_LEARNING_STATE_GUARD.alphabetDayAllowed(1)===true,'Tag 2 öffnet sich am Folgetag nicht');
}catch(e){errors.push(`Learning-State-Simulation: ${e.stack||e.message}`)}

const designer=read('ukrainischkurs-designer-alphabet.js');assert(designer.includes('const VERSION=3')&&designer.includes('rotatingCues:true'),'Designer-Alphabet v3/Rotation fehlt');assert(designer.includes('alphabetGate:false'),'Designer-Merkhilfe darf Alphabet-Mastery nicht ersetzen');
const fashion=read('ukrainischkurs-fashion-bridge.js');assert(fashion.includes('const VERSION=1'),'Fashion-Brücke ist nicht v1');assert((fashion.match(/title:'/g)||[]).length===14,'Fashion-Brücke hat nicht 14 Themen');assert(fashion.includes('optional:true')&&fashion.includes('alphabetDependency:true'),'Fashion-Brücke ist nicht optional/Alphabet-abhängig');
const resale=read('ukrainischkurs-resale-practice.js');assert(resale.includes('const VERSION=1'),'Resale-Praxis ist nicht v1');assert((resale.match(/title:'/g)||[]).length===15,'Resale-Praxis hat nicht 15 Situationen');assert((resale.match(/\['[^']+','[^']+',\[/g)||[]).length===60,'Resale-Praxis hat nicht 60 Antwortzüge');assert(resale.includes('core.accepts(value,task[2])'),'Resale-Praxis nutzt nicht die zentrale Freitextbewertung');assert(resale.includes("core.isUnlocked('alphabet.mastery')"),'Resale-Praxis startet ohne Alphabet-Abhängigkeit');assert(!resale.includes("s.a1CanDo.passed=")&&!resale.includes("s.a1Exam="),'Resale-Praxis darf A1-Status nicht manipulieren');
const core=read('ukrainischkurs-learning-core.js');assert(core.includes("'a1.exam':{requires:['immersion.transfer']")&&core.includes("'a1.final':{requires:['a1.exam']"),'A1-Gates beschädigt');assert(core.includes("s.a1Exam?.domains?.[k]?.passed&&!!s.a1Exam?.domains?.[k]?.confirmed"),'A1-Doppelpass-Gate beschädigt');
const srs=read('ukrainischkurs-adaptive-srs.js');for(const t of ['repairPending','successDates','lapses','ease','interval'])assert(srs.includes(t),`Adaptives SRS vermisst ${t}`);assert(srs.includes('meta.due=dayAdd(1)'),'Sofortreparatur wird nicht am Folgetag erneut geprüft');
const exam=read('ukrainischkurs-a1-exam.js');assert(exam.includes('doublePass:true')&&exam.includes('generatedForms:true')&&exam.includes('maxListeningPlays:2'),'A1-Prüfungsstrenge beschädigt');assert(exam.includes('officialCertificate:false')&&exam.includes('cefrAligned:true'),'A1-Status ist nicht transparent');
const selftest=read('ukrainischkurs-selftest.js');assert(selftest.includes('Laufzeit-Selbsttest v36')&&selftest.includes('version===47')&&selftest.includes('UKRAINIAN_LEARNING_STATE_GUARD')&&selftest.includes('UKRAINIAN_FASHION_BRIDGE')&&selftest.includes('UKRAINIAN_RESALE_PRACTICE'),'Selbsttest ist nicht auf v47/Lernstatus aktualisiert');

if(errors.length){console.error(`VALIDIERUNG FEHLGESCHLAGEN (${errors.length})`);errors.forEach(e=>console.error('- '+e));process.exit(1)}
console.log('VALIDIERUNG OK: v47 verankert den Kursstart an echter Lernaktivität, trennt Tages- und Aussprachezustand pro Kurstag und verhindert zuverlässig zwei neue Alphabet-Tage am selben Kalendertag; SRS, Fashion/Resale und strenge A1-Gates bleiben erhalten.');