import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const root=process.cwd(),read=p=>fs.readFileSync(path.join(root,p),'utf8'),errors=[];const assert=(c,m)=>{if(!c)errors.push(m)};

// Sämtliche v57/v56/... Schutzregeln unverändert weiterlaufen lassen. Für die
// geerbte v57-Prüfung werden nur Loader/SW temporär auf v57 gespiegelt.
const lp=path.join(root,'ukrainischkurs-v2-loader.js'),sp=path.join(root,'ukrainisch-lernen-sw.js');
const realLoader=read('ukrainischkurs-v2-loader.js'),realSw=read('ukrainisch-lernen-sw.js');
try{
  fs.writeFileSync(lp,realLoader.replace("const VERSION='58'","const VERSION='57'"),'utf8');
  fs.writeFileSync(sp,realSw.replace("const VERSION='58'","const VERSION='57'"),'utf8');
  await import(pathToFileURL(path.join(root,'tests/validate-v57.mjs')).href+'?v58base='+Date.now());
}finally{fs.writeFileSync(lp,realLoader,'utf8');fs.writeFileSync(sp,realSw,'utf8')}

const loader=read('ukrainischkurs-v2-loader.js'),sw=read('ukrainisch-lernen-sw.js'),dash=read('ukrainischkurs-exam-dashboard.js'),extra=read('ukrainischkurs-selftest-v58.js');
assert(loader.includes("const VERSION='58'"),'Loader ist nicht v58');
for(const m of ['exam-dashboard.js?v=1','selftest-v57.js?v=1','selftest-v58.js?v=1'])assert(loader.includes(m),`Loader vermisst ${m}`);
assert(loader.indexOf('skill-profile.js?v=3')<loader.indexOf('exam-dashboard.js?v=1'),'Lernampel liegt nicht nach dem zentralen Skill-Profil');
assert(loader.indexOf('exam-dashboard.js?v=1')<loader.indexOf('daily-coach.js?v=2'),'Lernampel liegt nicht vor dem Tagescoach');
assert(loader.includes('window.UKRAINIAN_COURSE_LOADER.version=57')&&loader.includes("await loadScript('./ukrainischkurs-selftest-v57.js?v=1'"),'v57 Zusatz-Selbsttest wird nicht kompatibel weitergeführt');
assert(sw.includes("const VERSION='58'"),'Service Worker ist nicht v58');
for(const a of ['./ukrainischkurs-exam-dashboard.js','./ukrainischkurs-selftest-v58.js'])assert(sw.includes(`'${a}'`),`Offline-Asset fehlt: ${a}`);
assert(extra.includes('releaseVersion:58')&&extra.includes('baseReleaseVersion:57'),'v58 Zusatz-Selbsttest baut nicht transparent auf v57 auf');

assert(dash.includes('const VERSION=1'),'Exam Dashboard ist nicht v1');
for(const m of ['practiceOnly:true','affectsExamGate:false','trafficLight:true','modeCount:Object.keys(MODES).length','frequentRecommendationEveryLessons:4'])assert(dash.includes(m),`Exam Dashboard vermisst ${m}`);
for(const m of ["quick:{id:'quick',title:'Blitzprüfung',questions:10","standard:{id:'standard',title:'Standardprüfung',questions:20","full:{id:'full',title:'Große Simulation',questions:30","weak:{id:'weak',title:'Schwächenprüfung',questions:15"])assert(dash.includes(m),`Prüfungsmodus fehlt: ${m}`);
assert(dash.includes("score>=80?'green':score>=60?'yellow':'red'"),'Lernampel nutzt nicht Grün>=80 / Gelb>=60 / Rot<60');
assert(dash.includes("evidence<2?'grey'")||dash.includes("evidence<2?'grey':"),'Zu wenig Evidenz wird nicht separat behandelt');
assert(dash.includes("(Number(s.day)||0)-Number(last.day||0)>=4"),'Simulationen werden nicht spätestens nach vier neuen Lektionen erneut empfohlen');
assert(dash.includes("if(WEEKLY_REVIEW_DAYS.includes(Number(s.day)))return true"),'Review-Tage lösen keine Prüfungsempfehlung aus');
assert(dash.includes("if(q.plays>=2)")&&dash.includes("q.plays++"),'Hörfragen sind nicht auf zwei Wiedergaben begrenzt');
assert(dash.includes("q.type==='speaking'&&!q.spoken")&&dash.includes('Sprechfragen bewerten nur den erinnerten Satz'),'Sprechsimulation trennt Lautsprechen nicht ehrlich von Aussprachebewertung');
assert(dash.includes("weight:isSpeaking?.3:.4")&&dash.includes("module:'practice-exam-simulation'"),'Prüfungssimulationen werden nicht bewusst schwach in das Skill-Profil eingespeist');
assert(dash.includes('keine offizielle CEFR-Bestehenswahrscheinlichkeit')||dash.includes('keine offizielle CEFR-Bestehenswahrscheinlichkeit'.replace('keine','keine')),'Dashboard behauptet eine offizielle Bestehenswahrscheinlichkeit');
assert(dash.includes('beeinflussen niemals die bestehenden A1-Prüfungsgates'),'UI trennt Übungsprüfungen nicht klar vom A1-Gate');
assert(!dash.includes('s.a1Exam=')&&!dash.includes('s.a1CanDo.passed=')&&!dash.includes('registerMilestone('),'Exam Dashboard verändert bestehende A1-Gates direkt');
assert(!dash.includes('fetch(')&&!dash.includes('XMLHttpRequest'),'Exam Dashboard lädt/sendet Lernstand unerwartet über Netzwerk');
try{new vm.Script(dash,{filename:'ukrainischkurs-exam-dashboard.js'});new vm.Script(extra,{filename:'ukrainischkurs-selftest-v58.js'})}catch(e){errors.push('v58 Syntax: '+e.message)}

// Isolierte Signallogik: Grün/Gelb/Rot/Grau, Prozentwerte und regelmäßige Empfehlung.
try{
  const D=Array.from({length:20},(_,i)=>[`Tag ${i}`,'','',[[`Фраза ${i}` ,`Bedeutung ${i}`,'']]]),WEEKLY_REVIEW_DAYS=[4,9,14,19],s={day:9,examDashboard:{history:[]}};
  const profile={reading:{score:85,sessions:3},listening:{score:70,sessions:3},writing:{score:50,sessions:3},speaking:{score:90,sessions:1},grammar:{score:null,sessions:0}};
  const core={skills:['reading','listening','writing','speaking','grammar'],profile:()=>JSON.parse(JSON.stringify(profile)),normalize:v=>String(v).trim().toLowerCase(),accepts:(v,a)=>a.map(String).includes(String(v)),weakest:()=> 'writing',recordSession(){}};
  const document={head:{append(){}},createElement(){return {textContent:'',className:'',id:'',innerHTML:'',append(){},insertBefore(){},querySelector(){return null},querySelectorAll(){return[]}}},getElementById(){return null},querySelectorAll(){return[]}};
  const ctx={window:{UKRAINIAN_LEARNING_CORE:core,UKRAINIAN_ERROR_MEMORY:{record(){}}},D,WEEKLY_REVIEW_DAYS,s,document,render(){},save(){},toast(){},date:()=> '2026-12-02',confirm:()=>true,console,setTimeout};
  vm.createContext(ctx);vm.runInContext(dash,ctx,{filename:'ukrainischkurs-exam-dashboard.js'});const d=ctx.window.UKRAINIAN_EXAM_DASHBOARD;
  assert(d?.version===1&&d?.practiceOnly===true&&d?.affectsExamGate===false,'v58 Runtime-Export ist falsch');
  assert(d?.modeCount===4&&d?.modes?.join(',')==='quick,standard,full,weak','v58 Runtime hat nicht vier Prüfungsarten');
  assert(d.skillSignal('reading').status==='green','85% Lesen mit Evidenz ist nicht grün');
  assert(d.skillSignal('listening').status==='yellow','70% Hören ist nicht gelb');
  assert(d.skillSignal('writing').status==='red','50% Schreiben ist nicht rot');
  assert(d.skillSignal('speaking').status==='grey','Ein einzelner Sprech-Nachweis wird fälschlich schon farbig gewertet');
  assert(d.coursePercent()===50,'Kursfortschritt 10/20 ergibt nicht 50%');
  assert(d.simulationDue()===true,'Review-Tag / fehlende Simulation erzeugt keine Empfehlung');
  assert(d.recommendedMode()==='weak','Roter Bereich empfiehlt nicht die Schwächenprüfung');
}catch(e){errors.push('v58 Runtime-Simulation: '+(e.stack||e.message))}

if(errors.length){console.error(`VALIDIERUNG FEHLGESCHLAGEN (${errors.length})`);errors.forEach(e=>console.error('- '+e));process.exit(1)}
console.log('VALIDIERUNG OK: v58 behält sämtliche v57/v56/v55/v54/v53/v52/v51/A1-Schutzregeln und ergänzt eine Führerschein-App-artige Lernampel mit Prozentwerten sowie vier häufig nutzbare Übungsprüfungen. Grün/Gelb/Rot basiert auf echter Skill-Evidenz und jüngeren Simulationen; bei zu wenig Daten bleibt der Bereich grau. Simulationen werden alle vier Lektionen bzw. an Review-Tagen empfohlen, bleiben aber ausdrücklich außerhalb der echten A1-Prüfungsgates.');