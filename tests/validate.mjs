import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';

const root=process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const exists=p=>fs.existsSync(path.join(root,p));
const errors=[];
const assert=(ok,msg)=>{if(!ok)errors.push(msg)};
const compile=(code,name)=>{try{new vm.Script(code,{filename:name})}catch(e){errors.push(`${name}: ${e.message}`)}};

const modules=[
  'ukrainischkurs-native-audio.js','ukrainischkurs-pronunciation.js','ukrainischkurs-pronunciation-mastery.js','ukrainischkurs-quality-hardening.js',
  'ukrainischkurs-adaptive-alphabet.js','ukrainischkurs-alphabet-proof.js','ukrainischkurs-reading-bridge.js','ukrainischkurs-reading-transfer.js',
  'ukrainischkurs-adaptive-srs.js','ukrainischkurs-learning-core.js','ukrainischkurs-foundation-expansion.js','ukrainischkurs-a1-expansion-2.js',
  'ukrainischkurs-a1-grammar-bridge.js','ukrainischkurs-time-bridge.js','ukrainischkurs-genitive-bridge.js','ukrainischkurs-word-stress.js',
  'ukrainischkurs-human-sentence-audio.js','ukrainischkurs-human-listening.js','ukrainischkurs-speaking-bridge.js','ukrainischkurs-immersion-transfer.js',
  'ukrainischkurs-open-dialogue.js','ukrainischkurs-conversation-chain.js','ukrainischkurs-free-reading-transfer.js','ukrainischkurs-comprehension-lab.js',
  'ukrainischkurs-active-production.js','ukrainischkurs-grammar-spiral.js','ukrainischkurs-story-lab.js','ukrainischkurs-dictation.js',
  'ukrainischkurs-adaptive-review.js','ukrainischkurs-a1-exam.js','ukrainischkurs-a1-cando.js','ukrainischkurs-uk-keyboard.js','ukrainischkurs-dynamic-course-ui.js',
  'ukrainischkurs-skill-profile.js','ukrainischkurs-selftest.js'
];
for(const file of ['ukrainischkurs-v2-loader.js','ukrainischkurs-v2-core.js',...modules,'ukrainisch-lernen-sw.js']){assert(exists(file),`${file} fehlt`);if(exists(file))compile(read(file),file)}
for(const htmlFile of ['ukrainisch-lernen.html','ukrainischkurs-app.html','index.html']){assert(exists(htmlFile),`${htmlFile} fehlt`);if(!exists(htmlFile))continue;let i=0;for(const m of read(htmlFile).matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi))compile(m[1],`${htmlFile} inline-${++i}`)}
try{JSON.parse(read('ukrainisch-lernen.webmanifest'))}catch(e){errors.push(`Manifest: ${e.message}`)}

// Historischer Kern und Fortschrittsmigration bleiben unverändert.
const legacy=[1,2,3,4,5].map(n=>read(`ukrainischkurs-v2.part${n}`));
const canonical=legacy.map(x=>x.replace(/\n?$/,'')).join('\n'),staticCore=read('ukrainischkurs-v2-core.js');
assert(staticCore===canonical,'Statischer Core weicht von historischen Fragmenten ab');
assert(staticCore.includes('function migrateState()')&&staticCore.includes('s.courseSchema = SCHEMA'),'Fortschrittsmigration fehlt');
const alphabet='А Б В Г Ґ Д Е Є Ж З И І Ї Й К Л М Н О П Р С Т У Ф Х Ц Ч Ш Щ Ь Ю Я';
assert(staticCore.includes(`const ORDER = '${alphabet}'.split(' ')`),'Alphabet-Reihenfolge beschädigt');
assert((staticCore.match(/'[^']+':\{pair:/g)||[]).length===33,'LETTER_INFO hat nicht 33 Zeichen');

// Statische App-Hülle / Workflows.
const app=read('ukrainischkurs-app.html'),base=read('ukrainisch-lernen.html'),builder=read('scripts/build-app-shell.mjs');
assert(app===base.replace('</body>','<script src="./ukrainischkurs-v2-loader.js"></script>\n</body>'),'App-Hülle ist nicht deterministisch aktuell');
assert(!app.includes('ukrainischkurs-v2-loader.js?v=')&&!app.includes('document.write(')&&!app.includes("fetch('./ukrainisch-lernen.html"),'Legacy-App-Hülle ist zurück');
assert(builder.includes('stabile Loader-URL'),'Builder nutzt keine stabile Loader-URL');
const buildWorkflow=read('.github/workflows/build-app-shell.yml'),validateWorkflow=read('.github/workflows/validate-course.yml');
for(const [name,wf] of [['Build',buildWorkflow],['Validate',validateWorkflow]]){assert(wf.includes('actions/checkout@v7'),`${name} nicht checkout@v7`);assert(wf.includes('actions/setup-node@v7'),`${name} nicht setup-node@v7`)}
assert(buildWorkflow.includes('concurrency:')&&buildWorkflow.includes('git pull --rebase origin main'),'Build-Workflow ohne Race-Schutz');
assert(validateWorkflow.includes('node scripts/build-app-shell.mjs')&&!validateWorkflow.includes('--check'),'Validate-Workflow kann wieder Generator-Race erzeugen');

// Loader / Service Worker v42.
const loader=read('ukrainischkurs-v2-loader.js');
assert(loader.includes("const VERSION='42'"),'Loader ist nicht v42');
for(const f of modules)assert(loader.includes(f),`Loader bindet ${f} nicht ein`);
for(const token of ['learning-core.js?v=4','a1-exam.js?v=2','selftest.js?v=31'])assert(loader.includes(token),`Loader vermisst ${token}`);
assert(loader.indexOf('adaptive-review.js')<loader.indexOf('a1-exam.js')&&loader.indexOf('a1-exam.js')<loader.indexOf('a1-cando.js'),'A1-Abschlussmodule laden in falscher Reihenfolge');
for(const bad of ['ukrainischkurs-v2.part','response.text()','runCore(','script.textContent'])assert(!loader.includes(bad),`Legacy-Loadercode zurück: ${bad}`);
assert(!/\beval\s*\(/.test(loader),'Loader verwendet eval()');
const sw=read('ukrainisch-lernen-sw.js');
assert(sw.includes("const VERSION='42'"),'Service Worker ist nicht v42');
assert(sw.includes("'./ukrainischkurs-a1-exam.js'")&&sw.includes("'./ukrainischkurs-learning-core.js'"),'A1/Core fehlen im Offline-Cache');
assert(sw.includes("stableLoader=url.pathname.endsWith('/ukrainischkurs-v2-loader.js')")&&sw.includes('else if(stableLoader)event.respondWith(freshAssetResponse'),'Stabiler Loader ist nicht network-first');
assert(!sw.includes('ignoreSearch:true')&&sw.includes("requestedVersion&&requestedVersion!==VERSION"),'Versionssicherer Cache-Schutz fehlt');
assert(sw.includes('await cache.put(request,response.clone())')&&sw.includes('await cache.put(canonical,response.clone())'),'Cache-Schreibvorgänge werden nicht abgewartet');

// Zentraler Lernkern v4: Immersion -> A1-Prüfung -> Can-do.
const core=read('ukrainischkurs-learning-core.js');
assert(core.includes('const VERSION=4'),'Lernkern ist nicht v4');
for(const token of ["const SKILLS=['reading','listening','writing','speaking','grammar']",'function normalize(value,opts={})','function accepts(value,answers,opts={})','function a1ExamComplete()',"'a1.exam':{requires:['immersion.transfer']","'a1.final':{requires:['a1.exam']"])assert(core.includes(token),`Lernkern vermisst ${token}`);
assert(core.includes("s.a1Exam?.domains?.[k]?.passed&&!!s.a1Exam?.domains?.[k]?.confirmed"),'A1-Meilenstein verlangt keine bestätigten Doppel-Nachweise');
assert(core.includes("normalize('NFC')")&&core.includes("replace(/[ʼ’‘'`]/g,'’')"),'Zentrale Unicode-/Apostrophnormalisierung fehlt');

// A1-Prüfung v2: generierte Formen, zwei Tage je Domain, strikte Schwellen.
const exam=read('ukrainischkurs-a1-exam.js');
assert(exam.includes('const VERSION=2')&&exam.includes("const DOMAINS=['reading','listening','writing','speaking']"),'A1-Prüfung v2 / vier Domains fehlen');
for(const fn of ['function readingForm()','function listeningForm()','function writingForm()','function speakingForm()','function attemptRng(domain)'])assert(exam.includes(fn),`Generierte Prüfungsform fehlt: ${fn}`);
assert(exam.includes('generatedForms:true')&&exam.includes('doublePass:true')&&exam.includes('controlledVocabulary:true'),'A1-Prüfung meldet generierte kontrollierte Doppelprüfung nicht');
assert(exam.includes("st.qualified?'Bestätigung':'Qualifikation'")&&exam.includes('st.qualified=true')&&exam.includes('st.confirmed=true'),'Qualifikation/Bestätigung ist nicht technisch getrennt');
assert(exam.includes("st.lastAttemptDate===date()")&&exam.includes("st.lastAttemptDate!==date()"),'Same-Day-Retake wird nicht gesperrt');
assert(exam.includes('repairDone=false')&&exam.includes('function beginRepair')&&exam.includes('repairDone=true'),'Verpflichtende Reparatur fehlt');
assert(exam.includes('session.correct>=8')&&exam.includes('session.correct===total'),'A1-Schwellen 8/10 bzw. vollständiges Sprechen fehlen');
assert(exam.includes("if(session.plays>=2)")&&exam.includes('maxListeningPlays:2'),'Hörprüfung begrenzt Wiedergabe nicht auf zweimal');
assert(exam.includes('minWords:8')&&exam.includes('words<task.minWords'),'Schreibprüfung prüft keine Mindestproduktion');
assert(exam.includes('navigator.mediaDevices?.getUserMedia')&&exam.includes('window.MediaRecorder'),'Sprechprüfung verlangt keine Aufnahme');
assert(exam.includes('session.recorded||!session.replayed')||exam.includes('!session.recorded||!session.replayed'),'Sprechprüfung verlangt kein vollständiges Rückhören');
assert(exam.includes('SpeechRecognition||window.webkitSpeechRecognition'),'Browser-Verständlichkeitsnachweis fehlt');
assert(exam.includes('function reviewerCheck(choice,initials)')&&exam.includes('choice!==item.meaning')&&exam.includes("trim().length<2"),'Prüfermodus ist nur ein einfacher Selbstbestätigungsbutton');
assert(exam.includes('session.assisted=true')&&exam.includes('!session.assisted&&core.accepts'),'Eingeblendeter Sprech-Fragetext kann noch als unassistierter Pass zählen');
assert(exam.includes('allDomainsPassed()&&!!s.a1CanDo?.passed'),'Gesamtabschluss verlangt nicht vier Domains plus Can-do');
assert(exam.includes('officialCertificate:false')&&exam.includes('cefrAligned:true'),'Amtlicher/CEFR-Status ist nicht transparent');
assert(exam.includes('thresholds:{reading:\'8/10 × 2 Tage\'')&&exam.includes("speaking:'6/6 × 2 Tage + Verständlichkeitsnachweis'"),'Exportierte Doppel-Schwellen fehlen');

// Bestehende zentrale Lern-/Audio-Regressionsschutzregeln bleiben aktiv.
const human=read('ukrainischkurs-human-sentence-audio.js');
assert(human.includes('const VERSION=4')&&(human.match(/file:'Uk-/g)||[]).length===12,'Human-Audio v4 / 12 Quellen beschädigt');
assert(human.includes('playback.button.disabled=false')&&human.includes('stopCurrent();\n    return baseSpeak(text,button)'),'Human-Audio-Unterbrechungsschutz fehlt');
const speaking=read('ukrainischkurs-speaking-bridge.js');
assert(speaking.includes('safeRecorderReset:true')&&speaking.includes('media.ondataavailable=null;media.onstop=null;media.onerror=null'),'Recorder-Reset-Regressionsschutz fehlt');
const centralized=['ukrainischkurs-a1-grammar-bridge.js','ukrainischkurs-time-bridge.js','ukrainischkurs-genitive-bridge.js','ukrainischkurs-immersion-transfer.js','ukrainischkurs-open-dialogue.js','ukrainischkurs-conversation-chain.js','ukrainischkurs-active-production.js','ukrainischkurs-grammar-spiral.js','ukrainischkurs-dictation.js','ukrainischkurs-a1-cando.js'];
for(const file of centralized){const src=read(file);assert(!src.includes('fallbackNorm'),`${file} hat wieder lokalen fallbackNorm`);assert(!src.includes(".normalize('NFC')"),`${file} normalisiert wieder lokal`)}
const immersion=read('ukrainischkurs-immersion-transfer.js');assert((immersion.match(/title:'Immersion /g)||[]).length===6&&immersion.includes('Immersion 5 · 8-Zug-Gespräch'),'Immersionsumfang beschädigt');
const cando=read('ukrainischkurs-a1-cando.js');assert((cando.match(/mode:'type'/g)||[]).length===12&&(cando.match(/mode:'audio'/g)||[]).length===4,'Can-do hat nicht 12 Tipp- und 4 Höraufgaben');
const native=read('ukrainischkurs-native-audio.js');assert([...native.matchAll(/^\s*'([А-ЯІЇЄҐЬ])':\{file:/gmu)].length===33,'Alphabet-Audioabdeckung ist nicht 33');

const dynamic=read('ukrainischkurs-dynamic-course-ui.js');assert(dynamic.includes('const VERSION=2')&&dynamic.includes('staleCopyFixed:true'),'Dynamic Course UI v2 fehlt');
const selftest=read('ukrainischkurs-selftest.js');assert(selftest.includes('Laufzeit-Selbsttest v31')&&selftest.includes('version===42')&&selftest.includes('exam?.doublePass===true'),'Selbsttest ist nicht v31/v42/Doppelprüfung');

if(errors.length){console.error(`VALIDIERUNG FEHLGESCHLAGEN (${errors.length})`);errors.forEach(e=>console.error('- '+e));process.exit(1)}
console.log('VALIDIERUNG OK: v42 mit zentraler Immersion→A1-Prüfung→Can-do-Kette, generierten A1-Prüfungsvarianten, Qualifikation plus Bestätigung an getrennten Tagen, 8/10 Lesen/Hören/Schreiben, 6/6 Sprechen, maximal zwei Hörwiedergaben, strengem Prüfer-/Aufnahmenachweis sowie bestehenden Lern-, PWA-, Audio- und Fortschrittsregressionen geprüft.');