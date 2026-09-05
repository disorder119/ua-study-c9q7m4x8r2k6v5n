import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';

const root=process.cwd(),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const errors=[];const assert=(ok,msg)=>{if(!ok)errors.push(msg)};
const compile=(code,name)=>{try{new vm.Script(code,{filename:name})}catch(e){errors.push(`${name}: ${e.message}`)}};

for(const file of fs.readdirSync(root).filter(x=>/^ukrainischkurs-.*\.js$/.test(x)).concat('ukrainisch-lernen-sw.js'))compile(read(file),file);
for(const file of ['ukrainisch-lernen.html','ukrainischkurs-app.html','index.html']){let i=0;for(const m of read(file).matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi))compile(m[1],`${file} inline-${++i}`)}
try{JSON.parse(read('ukrainisch-lernen.webmanifest'))}catch(e){errors.push(`Manifest: ${e.message}`)}

const legacy=[1,2,3,4,5].map(n=>read(`ukrainischkurs-v2.part${n}`));
const staticCore=read('ukrainischkurs-v2-core.js');
assert(staticCore===legacy.map(x=>x.replace(/\n?$/,'')).join('\n'),'Statischer Core weicht von historischen Fragmenten ab');
assert(staticCore.includes('function migrateState()')&&staticCore.includes('s.courseSchema = SCHEMA'),'Fortschrittsmigration fehlt');
assert((staticCore.match(/'[^']+':\{pair:/g)||[]).length===33,'Alphabetkern enthält nicht 33 Zeichen');

const base=read('ukrainisch-lernen.html'),app=read('ukrainischkurs-app.html');
assert(app===base.replace('</body>','<script src="./ukrainischkurs-v2-loader.js"></script>\n</body>'),'Statische App-Hülle ist nicht deterministisch aktuell');
assert(!app.includes('document.write(')&&!app.includes("fetch('./ukrainisch-lernen.html")&&!app.includes('ukrainischkurs-v2-loader.js?v='),'Legacy-App-Hülle ist zurück');

const loader=read('ukrainischkurs-v2-loader.js');
assert(loader.includes("const VERSION='42'"),'Loader ist nicht v42');
for(const token of ['learning-core.js?v=4','a1-exam.js?v=2','a1-cando.js?v=7','selftest.js?v=31'])assert(loader.includes(token),`Loader vermisst ${token}`);
assert(loader.indexOf('adaptive-review.js')<loader.indexOf('a1-exam.js')&&loader.indexOf('a1-exam.js')<loader.indexOf('a1-cando.js'),'A1-Abschlussreihenfolge ist falsch');
for(const bad of ['ukrainischkurs-v2.part','response.text()','runCore(','script.textContent'])assert(!loader.includes(bad),`Legacy-Loadercode zurück: ${bad}`);
assert(!/\beval\s*\(/.test(loader),'Loader verwendet eval()');

const sw=read('ukrainisch-lernen-sw.js');
assert(sw.includes("const VERSION='42'"),'Service Worker ist nicht v42');
assert(sw.includes("'./ukrainischkurs-a1-exam.js'")&&sw.includes("'./ukrainischkurs-learning-core.js'"),'A1/Core fehlen im Offline-Cache');
assert(sw.includes('else if(stableLoader)event.respondWith(freshAssetResponse'),'Stabiler Loader ist nicht network-first');
assert(!sw.includes('ignoreSearch:true')&&sw.includes("requestedVersion&&requestedVersion!==VERSION"),'Versionsschutz im Service Worker fehlt');
assert(sw.includes('await cache.put(request,response.clone())')&&sw.includes('await cache.put(canonical,response.clone())'),'Cache-Schreibvorgänge werden nicht abgewartet');

const core=read('ukrainischkurs-learning-core.js');
assert(core.includes('const VERSION=4'),'Lernkern ist nicht v4');
assert(core.includes("'a1.exam':{requires:['immersion.transfer']"),'A1-Prüfung hängt nicht an Immersion');
assert(core.includes("'a1.final':{requires:['a1.exam']"),'Can-do hängt nicht an bestandener A1-Prüfung');
assert(core.includes("s.a1Exam?.domains?.[k]?.passed&&!!s.a1Exam?.domains?.[k]?.confirmed"),'A1-Gate verlangt keine bestätigten Doppel-Nachweise');
assert(core.includes("const SKILLS=['reading','listening','writing','speaking','grammar']"),'Fünf Skillkanäle fehlen');
assert(core.includes("normalize('NFC')")&&core.includes("replace(/[ʼ’‘'`]/g,'’')"),'Zentrale Unicode-/Apostrophnormalisierung fehlt');

const exam=read('ukrainischkurs-a1-exam.js');
assert(exam.includes('const VERSION=2'),'A1-Prüfung ist nicht v2');
assert(exam.includes("const DOMAINS=['reading','listening','writing','speaking']"),'Vier A1-Kompetenzbereiche fehlen');
for(const fn of ['readingForm','listeningForm','writingForm','speakingForm'])assert(new RegExp(`function\\s+${fn}\\s*\\(`).test(exam),`Generierte Prüfungsfunktion ${fn} fehlt`);
assert(exam.includes('function attemptRng(domain)'),'Prüfungsvarianten sind nicht deterministisch pro Versuch');
assert(exam.includes("qualified?'Bestätigung':'Qualifikation'")&&exam.includes('st.qualified=true')&&exam.includes('st.confirmed=true'),'Qualifikation und Bestätigung sind nicht getrennt');
assert(exam.includes('doublePass:true')&&exam.includes('generatedForms:true')&&exam.includes('controlledVocabulary:true'),'Doppelprüfung/generierte Form/kontrollierter Wortschatz wird nicht gemeldet');
assert(exam.includes("st.lastAttemptDate===date()")&&exam.includes("st.lastAttemptDate!==date()"),'Same-Day-Retake-Sperre fehlt');
assert(exam.includes('repairDone=false')&&exam.includes('function beginRepair')&&exam.includes('repairDone=true'),'Verpflichtende Reparatur fehlt');
assert(exam.includes('session.correct>=8')&&exam.includes('session.correct===total'),'Prüfungsschwellen sind zu weich');
assert(exam.includes('if(session.plays>=2)')&&exam.includes('maxListeningPlays:2'),'Hörwiedergabe ist nicht auf zwei begrenzt');
assert(exam.includes('minWords:8')&&exam.includes('words<task.minWords'),'Freies Schreiben hat keine Mindestproduktion');
assert(exam.includes('navigator.mediaDevices?.getUserMedia')&&exam.includes('window.MediaRecorder'),'Sprechen verlangt keine lokale Aufnahme');
assert(exam.includes('!session.recorded||!session.replayed'),'Sprechen verlangt kein vollständiges Rückhören');
assert(exam.includes('SpeechRecognition||window.webkitSpeechRecognition'),'Browser-Verständlichkeitsnachweis fehlt');
assert(exam.includes('function reviewerCheck(choice,initials)')&&exam.includes('choice!==item.meaning')&&exam.includes("trim().length<2"),'Prüfermodus prüft weder Bedeutung noch zweite Person');
assert(exam.includes('session.assisted=true')&&exam.includes('!session.assisted&&core.accepts'),'Sichtbarer Sprech-Fragetext kann noch als unassistierter Pass zählen');
assert(exam.includes('allDomainsPassed()&&!!s.a1CanDo?.passed'),'Gesamtabschluss verlangt nicht Prüfungen plus Can-do');
assert(exam.includes('officialCertificate:false')&&exam.includes('cefrAligned:true'),'CEFR-/Zertifikatsstatus ist nicht transparent');

const human=read('ukrainischkurs-human-sentence-audio.js');
assert(human.includes('const VERSION=4')&&(human.match(/file:'Uk-/g)||[]).length===12,'Human-Audio v4 / 12 Quellen beschädigt');
assert(human.includes('playback.button.disabled=false')&&human.includes('stopCurrent();\n    return baseSpeak(text,button)'),'Human-Audio-Unterbrechungsschutz fehlt');
const speaking=read('ukrainischkurs-speaking-bridge.js');
assert(speaking.includes('safeRecorderReset:true')&&speaking.includes('media.ondataavailable=null;media.onstop=null;media.onerror=null'),'Recorder-Reset-Regressionsschutz fehlt');
const immersion=read('ukrainischkurs-immersion-transfer.js');
assert((immersion.match(/title:'Immersion /g)||[]).length===6&&immersion.includes('Immersion 5 · 8-Zug-Gespräch'),'Immersionsumfang beschädigt');
const cando=read('ukrainischkurs-a1-cando.js');
assert((cando.match(/mode:'type'/g)||[]).length===12&&(cando.match(/mode:'audio'/g)||[]).length===4,'Can-do hat nicht 12 Tipp- und 4 Höraufgaben');
const native=read('ukrainischkurs-native-audio.js');
assert([...native.matchAll(/^\s*'([А-ЯІЇЄҐЬ])':\{file:/gmu)].length===33,'Alphabet-Audioabdeckung ist nicht 33');
const selftest=read('ukrainischkurs-selftest.js');
assert(selftest.includes('Laufzeit-Selbsttest v31')&&selftest.includes('version===42')&&selftest.includes('exam?.doublePass===true'),'Laufzeit-Selbsttest ist nicht auf v42/Doppelprüfung');

if(errors.length){console.error(`VALIDIERUNG FEHLGESCHLAGEN (${errors.length})`);errors.forEach(e=>console.error('- '+e));process.exit(1)}
console.log('VALIDIERUNG OK: v42 mit zentraler Immersion→A1-Prüfung→Can-do-Kette, generierten A1-Prüfungsvarianten, Qualifikation plus Bestätigung an getrennten Tagen, 8/10 Lesen/Hören/Schreiben, 6/6 Sprechen, maximal zwei Hörwiedergaben und strengem Prüfer-/Aufnahmenachweis geprüft.');