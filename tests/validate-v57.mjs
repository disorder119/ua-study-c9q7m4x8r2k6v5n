import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const root=process.cwd(),read=p=>fs.readFileSync(path.join(root,p),'utf8'),errors=[];const assert=(c,m)=>{if(!c)errors.push(m)};

// v56 vollständig weiterlaufen lassen. Der alte v45-Laufzeit-Selbsttest bleibt als
// unveränderte Basis erhalten; für diese Regression werden nur Loader/SW kurz auf
// ihren v56-Release-Marker zurückgespiegelt und danach garantiert wiederhergestellt.
const lp=path.join(root,'ukrainischkurs-v2-loader.js'),sp=path.join(root,'ukrainisch-lernen-sw.js');
const realLoader=read('ukrainischkurs-v2-loader.js'),realSw=read('ukrainisch-lernen-sw.js');
try{
 fs.writeFileSync(lp,realLoader.replace("const VERSION='57'","const VERSION='56'"),'utf8');
 fs.writeFileSync(sp,realSw.replace("const VERSION='57'","const VERSION='56'"),'utf8');
 await import(pathToFileURL(path.join(root,'tests/validate-v56.mjs')).href+'?v57base='+Date.now());
}finally{fs.writeFileSync(lp,realLoader,'utf8');fs.writeFileSync(sp,realSw,'utf8')}

const loader=read('ukrainischkurs-v2-loader.js'),sw=read('ukrainisch-lernen-sw.js'),ladder=read('ukrainischkurs-independence-ladder.js'),extra=read('ukrainischkurs-selftest-v57.js');
assert(loader.includes("const VERSION='57'"),'Loader ist nicht v57');
for(const m of ['progressive-growth.js?v=1','independence-ladder.js?v=1','selftest.js?v=45','selftest-v57.js?v=1'])assert(loader.includes(m),`Loader vermisst ${m}`);
assert(loader.indexOf('progressive-growth.js?v=1')<loader.indexOf('independence-ladder.js?v=1'),'v57 liegt nicht nach Progressive Growth');
assert(loader.indexOf('independence-ladder.js?v=1')<loader.indexOf('a1-exam.js?v=2'),'v57 liegt nicht vor der unveränderten A1-Prüfung');
assert(loader.includes("if(legacySelftest)window.UKRAINIAN_COURSE_LOADER.version=56")&&loader.includes("if(legacySelftest)window.UKRAINIAN_COURSE_LOADER.version=Number(VERSION)"),'v45-Basis-Selbsttest wird nicht kontrolliert kompatibel ausgeführt');
assert(sw.includes("const VERSION='57'"),'Service Worker ist nicht v57');
for(const a of ['./ukrainischkurs-independence-ladder.js','./ukrainischkurs-selftest-v57.js'])assert(sw.includes(`'${a}'`),`Offline-Asset fehlt: ${a}`);
assert(extra.includes('releaseVersion:57')&&extra.includes('baseSelftestVersion:45'),'v57 Zusatz-Selbsttest baut nicht transparent auf v45 auf');
assert(extra.includes('version===57')&&extra.includes('minimumWords')&&extra.includes('speechRate')&&extra.includes('memoryDistance'),'v57 Zusatz-Selbsttest prüft die neue Steigerung nicht');

assert(ladder.includes('const VERSION=1'),'Independence Ladder ist nicht v1');
for(const m of ['lessonCount:16','inputItems:80','listeningCount:16','checkpointCount:4','dialogCount:8','progressive:true','everyLessonGate:true','systemTTSOnly:true','noHumanAudioClaim:true','maxListeningPlays:2','freeOutputNotGrammarScored:true','cumulativeRecall:true','repairRequired:true','firstAttemptPreserved:true','centralScoring:true','errorAware:true','competencyAware:true','affectsExamGate:false'])assert(ladder.includes(m),`Independence Ladder vermisst ${m}`);
assert(ladder.includes('minimumWords=i=>4+i'),'Freier Output wächst nicht 4→19');
assert(ladder.includes("speechRate=i=>Number((.78+i*.02).toFixed(2))"),'TTS-Tempo steigt nicht schrittweise');
assert(ladder.includes('memoryDistance=i=>Math.min(8,Math.max(1,Math.floor(i/2)+1))'),'Abrufabstand wächst nicht bis 8');
assert(ladder.includes('st.listeningPlays>=2'),'Audio-first ist nicht auf zwei Wiedergaben begrenzt');
assert(ladder.includes("st.listeningAssisted=true")&&ladder.includes("weight:st.listeningAssisted?.35:.75"),'TTS-Fallback wird nicht transparent schwächer gewichtet');
assert(ladder.includes("skills:['listening']")&&ladder.includes("skills:['writing','grammar']")&&ladder.includes("skills:['writing']"),'v57 liefert keine getrennte Hör-/Abruf-/Output-Evidenz');
assert(ladder.includes('Keine automatische Grammatiknote')&&ladder.includes('Nur Wortzahl + Themenanker'),'Freier Output behauptet eine nicht vorhandene Grammatikbewertung');
assert(ladder.includes('UKRAINIAN_ERROR_MEMORY?.record?.')&&ladder.includes('UKRAINIAN_COMPETENCY_MASTERY?.record?.'),'v57 speist Diagnose nicht');
assert(!ladder.includes('s.a1Exam=')&&!ladder.includes('s.a1CanDo.passed=')&&!ladder.includes('registerMilestone('),'v57 verändert A1-Gates direkt');
assert(!ladder.includes('fetch(')&&!ladder.includes('XMLHttpRequest'),'v57 lädt/sendet Lernstand oder Input unerwartet über Netzwerk');
for(const p of ['Я хочу говорити впевненіше','Мені більше подобається море, ніж гори','Наш потяг запізнюється на двадцять хвилин','Я хотів би замовити рибу без соусу','Я вже перевірив першу частину','Чи можемо зустрітися о сьомій?','У моїй кімнаті не працює кондиціонер','Якою вулицею краще йти?','Учора ми рано поїхали до моря','Якщо піде дощ, підемо в музей','Для мене розташування важливіше','Привіт, я телефоную щодо нашої зустрічі','Через це я трохи запізнився','А завтра знову буду працювати','У мене трохи інша думка','У результаті день усе одно був цікавий'])assert(ladder.includes(p),`v57 Stufeninhalt fehlt: ${p}`);
try{new vm.Script(ladder,{filename:'ukrainischkurs-independence-ladder.js'});new vm.Script(extra,{filename:'ukrainischkurs-selftest-v57.js'})}catch(e){errors.push('v57 Syntax: '+e.message)}

try{
 const D=Array.from({length:164},(_,i)=>[`Alt ${i}`,'','',[]]),WEEKLY_REVIEW_DAYS=[20,80,120,163],DIALOGS={},s={day:164,a1Exam:{sentinel:'unchanged'}};
 const core={accepts:(v,a)=>a.includes(v),recordSession(){},normalize:v=>String(v).trim().toLowerCase()};
 const document={getElementById(){return null},createElement(){return {insertAdjacentElement(){},querySelector(){return null},querySelectorAll(){return[]},className:'',id:'',hidden:false,innerHTML:''}}};
 const ctx={window:{UKRAINIAN_LEARNING_CORE:core,UKRAINIAN_ERROR_MEMORY:{record(){}},UKRAINIAN_COMPETENCY_MASTERY:{record(){}}},D,WEEKLY_REVIEW_DAYS,DIALOGS,s,date:()=> '2026-12-01',save(){},render(){},toast(){},document,console,setTimeout(){},SpeechSynthesisUtterance:function(){},speechSynthesis:{cancel(){},speak(){}}};
 vm.createContext(ctx);vm.runInContext(ladder,ctx,{filename:'ukrainischkurs-independence-ladder.js'});const m=ctx.window.UKRAINIAN_INDEPENDENCE_LADDER;
 assert(D.length===180,'v57 hängt nicht exakt 16 weitere Kursslots an');
 assert(m?.start===164&&m?.end===179,'v57 Start/Ende ist falsch');
 assert(m?.lessonCount===16&&m?.inputItems===80&&m?.listeningCount===16&&m?.checkpointCount===4&&m?.dialogCount===8,'v57 Runtime-Umfang ist falsch');
 const words=Array.from({length:16},(_,i)=>m.minimumWords(i));assert(words[0]===4&&words[15]===19&&words.every((v,i)=>!i||v===words[i-1]+1),'Wortziel steigt nicht in jeder Lektion exakt +1');
 const rates=Array.from({length:16},(_,i)=>m.speechRate(i));assert(rates[0]===.78&&rates[15]===1.08&&rates.every((v,i)=>!i||v>rates[i-1]),'Hörtempo steigt nicht in jeder Lektion');
 const dist=Array.from({length:16},(_,i)=>m.memoryDistance(i));assert(dist[15]===8&&dist.every((v,i)=>!i||v>=dist[i-1]),'Abrufabstand wächst nicht kontrolliert');
 assert(WEEKLY_REVIEW_DAYS.includes(167)&&WEEKLY_REVIEW_DAYS.includes(171)&&WEEKLY_REVIEW_DAYS.includes(175)&&WEEKLY_REVIEW_DAYS.includes(179),'v57 Checkpoints liegen nicht nach jeweils vier Lektionen');
 assert(Object.keys(DIALOGS).length===8,'v57 fügt nicht exakt acht Dialoge hinzu');
 assert(s.a1Exam?.sentinel==='unchanged','v57 verändert vorhandenen A1-Prüfungszustand');
}catch(e){errors.push('v57 Runtime-Simulation: '+(e.stack||e.message))}

if(errors.length){console.error(`VALIDIERUNG FEHLGESCHLAGEN (${errors.length})`);errors.forEach(e=>console.error('- '+e));process.exit(1)}
console.log('VALIDIERUNG OK: v57 behält sämtliche v56/v55/v54/v53/v52/v51/A1-Schutzregeln und ergänzt 16 weitere Unabhängigkeitslektionen mit 80 Lernobjekten. In jeder Lektion steigen freie Eigenproduktion und System-TTS-Tempo messbar, älterer Stoff wird mit wachsendem Abstand abgerufen, Audio-first bleibt auf zwei Plays begrenzt und ehrlich als System-TTS markiert. Freier Text wird nicht als automatische Grammatiknote ausgegeben; A1-Prüfungsschwellen bleiben unverändert.');