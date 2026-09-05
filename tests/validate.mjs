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

for(const file of ['ukrainischkurs-v2-loader.js','ukrainischkurs-v2-core.js',...modules,'ukrainisch-lernen-sw.js']){
  assert(exists(file),`${file} fehlt`);if(exists(file))compile(read(file),file);
}
for(const htmlFile of ['ukrainisch-lernen.html','ukrainischkurs-app.html','index.html']){
  assert(exists(htmlFile),`${htmlFile} fehlt`);if(!exists(htmlFile))continue;
  let i=0;for(const m of read(htmlFile).matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi))compile(m[1],`${htmlFile} inline-${++i}`);
}
try{JSON.parse(read('ukrainisch-lernen.webmanifest'))}catch(e){errors.push(`Manifest: ${e.message}`)}

const legacy=[1,2,3,4,5].map(n=>read(`ukrainischkurs-v2.part${n}`));
const canonical=legacy.map(x=>x.replace(/\n?$/,'')).join('\n');
const staticCore=read('ukrainischkurs-v2-core.js');
assert(staticCore===canonical,'Statischer Core weicht von historischen Fragmenten ab');
assert(staticCore.includes('function migrateState()')&&staticCore.includes('s.courseSchema = SCHEMA'),'Fortschrittsmigration fehlt');
const alphabet='А Б В Г Ґ Д Е Є Ж З И І Ї Й К Л М Н О П Р С Т У Ф Х Ц Ч Ш Щ Ь Ю Я';
assert(staticCore.includes(`const ORDER = '${alphabet}'.split(' ')`),'Alphabet-Reihenfolge beschädigt');
assert((staticCore.match(/'[^']+':\{pair:/g)||[]).length===33,'LETTER_INFO hat nicht 33 Zeichen');

const app=read('ukrainischkurs-app.html'),base=read('ukrainisch-lernen.html'),builder=read('scripts/build-app-shell.mjs');
const expectedApp=base.replace('</body>','<script src="./ukrainischkurs-v2-loader.js"></script>\n</body>');
assert(app===expectedApp,'App-Hülle ist nicht deterministisch aus Basis + stabiler Loader-URL gebaut');
assert(app.includes('ukrainischkurs-v2-loader.js"></script>'),'App-Hülle nutzt nicht die stabile Loader-URL');
assert(!app.includes('ukrainischkurs-v2-loader.js?v='),'App-Hülle ist wieder an eine Loader-Version gekoppelt');
assert(!app.includes("fetch('./ukrainisch-lernen.html")&&!app.includes('document.write(')&&!app.includes('document.open('),'Legacy-HTML-Ladepfad ist zurück');
assert(builder.includes('stabile Loader-URL')&&builder.includes('--check'),'Deterministischer stabiler App-Builder fehlt');

const buildWorkflow=read('.github/workflows/build-app-shell.yml'),validateWorkflow=read('.github/workflows/validate-course.yml');
for(const [name,wf] of [['Build',buildWorkflow],['Validate',validateWorkflow]]){
  assert(wf.includes('actions/checkout@v7'),`${name}-Workflow nutzt nicht checkout@v7`);
  assert(wf.includes('actions/setup-node@v7'),`${name}-Workflow nutzt nicht setup-node@v7`);
}
assert(!buildWorkflow.includes("'ukrainischkurs-v2-loader.js'"),'App-Builder läuft wieder bei jedem Loader-Release');
assert(buildWorkflow.includes('concurrency:')&&buildWorkflow.includes('cancel-in-progress: true'),'Build-Workflow hat keinen Race-Schutz');
assert(buildWorkflow.includes('git pull --rebase origin main'),'Build-Bot schützt sich nicht vor weitergelaufenem main');
assert(validateWorkflow.includes('node scripts/build-app-shell.mjs')&&!validateWorkflow.includes('--check'),'Validierung kann wieder wegen Generator-Reihenfolge rot werden');

const loader=read('ukrainischkurs-v2-loader.js');
assert(loader.includes("const VERSION='41'"),'Loader ist nicht v41');
for(const f of modules)assert(loader.includes(f),`Loader bindet ${f} nicht ein`);
for(const token of ['human-sentence-audio.js?v=4','speaking-bridge.js?v=3','a1-exam.js?v=1','dynamic-course-ui.js?v=2','selftest.js?v=30'])assert(loader.includes(token),`Loader vermisst ${token}`);
assert(loader.indexOf('adaptive-review.js')<loader.indexOf('a1-exam.js'),'A1-Prüfung lädt vor adaptivem Review');
assert(loader.indexOf('a1-exam.js')<loader.indexOf('a1-cando.js'),'Can-do lädt vor der neuen A1-Prüfungsphase; Abschlussreihenfolge ist falsch');
assert(loader.includes("mode:'external-core-script'")&&loader.includes('staticCore:true'),'Loader meldet statischen Core nicht');
for(const bad of ['ukrainischkurs-v2.part','response.text()','runCore(','script.textContent'])assert(!loader.includes(bad),`Legacy-Loadercode zurück: ${bad}`);
assert(!/\beval\s*\(/.test(loader),'Loader verwendet eval()');
assert(loader.indexOf('v2-core.js')<loader.indexOf('native-audio.js'),'Featuremodule laden vor Core');
assert(loader.indexOf('adaptive-srs.js')<loader.indexOf('learning-core.js'),'Lernkern lädt vor SRS');
assert(loader.indexOf('skill-profile.js')<loader.indexOf('selftest.js'),'Selbsttest lädt vor Skill-Profil');

const sw=read('ukrainisch-lernen-sw.js');
assert(sw.includes("const VERSION='41'"),'Service Worker ist nicht v41');
assert(sw.includes("'./ukrainischkurs-a1-exam.js'"),'A1-Prüfungsmodul fehlt im Offline-Cache');
assert(sw.includes('ukrainischkurs-joel-v${VERSION}'),'Cache ist nicht an VERSION gekoppelt');
assert(!sw.includes('ignoreSearch:true'),'Versionsübergreifendes Cache-Matching ist zurück');
assert(sw.includes("stableLoader=url.pathname.endsWith('/ukrainischkurs-v2-loader.js')"),'Stabile Loader-URL wird nicht separat erkannt');
assert(sw.includes('else if(stableLoader)event.respondWith(freshAssetResponse'),'Stabiler Loader ist nicht network-first');
assert(sw.includes("requestedVersion&&requestedVersion!==VERSION"),'Offline-Versionsmischung wird nicht blockiert');
assert(sw.includes('await cache.put(request,response.clone())')&&sw.includes('await cache.put(canonical,response.clone())'),'Cache-Schreibvorgänge werden nicht vollständig abgewartet');
assert(sw.includes("event.request.mode==='navigate'||event.request.destination==='document'"),'Navigation hat keinen getrennten Fallback');
assert(sw.includes("new Response('Offline-Asset nicht verfügbar'"),'Sauberer Asset-503 fehlt');
assert(!sw.includes('ukrainischkurs-v2.part'),'Historische Core-Fragmente sind wieder im Cache');

const human=read('ukrainischkurs-human-sentence-audio.js');
assert(human.includes('const VERSION=4'),'Human-Audio ist nicht v4');
assert((human.match(/file:'Uk-/g)||[]).length===12,'Human-Audio hat nicht 12 verifizierte Quellen');
assert(human.includes('function release(playback)')&&human.includes('playback.button.disabled=false'),'Unterbrochener Audio-Button bleibt potenziell gesperrt');
assert(human.includes('function stopCurrent()')&&human.includes('playback.audio.pause()'),'Vorherige Human-Aufnahme wird nicht gestoppt');
assert(human.includes('stopCurrent();\n    return baseSpeak(text,button)'),'TTS kann noch parallel zu Human-Audio starten');
assert(!human.includes('native:true'),'Unbelegter Native-Status aktiv');
const speaking=read('ukrainischkurs-speaking-bridge.js');
assert(speaking.includes('const VERSION=3'),'Speaking Bridge ist nicht v3');
assert(speaking.includes('media.ondataavailable=null;media.onstop=null;media.onerror=null'),'Recorder-Handler werden beim Reset nicht getrennt');
assert(speaking.includes('disposePlayback()')&&speaking.includes("if(rec.media?.state==='recording')"),'Playback/Retry-Reset ist nicht abgesichert');
assert(speaking.includes('safeRecorderReset:true'),'Speaking Bridge meldet sicheren Recorder-Reset nicht');

const core=read('ukrainischkurs-learning-core.js');
assert(core.includes('const VERSION=3'),'Lernkern ist nicht v3');
for(const token of ["const SKILLS=['reading','listening','writing','speaking','grammar']",'function normalize(value,opts={})','function accepts(value,answers,opts={})','function allIntroduced(requirements,opts={})','function anchorDay(requirements,opts={})','function recordSession(meta={})','function reviewFocus()','function isUnlocked(id)',"'immersion.transfer'","'a1.final'"])assert(core.includes(token),`Lernkern vermisst ${token}`);
assert(core.includes("normalize('NFC')")&&core.includes("replace(/[ʼ’‘'`]/g,'’')"),'Zentrale Unicode-/Apostrophnormalisierung fehlt');

const centralized=['ukrainischkurs-a1-grammar-bridge.js','ukrainischkurs-time-bridge.js','ukrainischkurs-genitive-bridge.js','ukrainischkurs-immersion-transfer.js','ukrainischkurs-open-dialogue.js','ukrainischkurs-conversation-chain.js','ukrainischkurs-active-production.js','ukrainischkurs-grammar-spiral.js','ukrainischkurs-dictation.js','ukrainischkurs-a1-cando.js'];
for(const file of centralized){const src=read(file);assert(!src.includes('fallbackNorm'),`${file} hat wieder lokalen fallbackNorm`);assert(!src.includes(".normalize('NFC')"),`${file} normalisiert wieder lokal`)}
for(const file of ['ukrainischkurs-comprehension-lab.js','ukrainischkurs-story-lab.js','ukrainischkurs-active-production.js','ukrainischkurs-grammar-spiral.js','ukrainischkurs-dictation.js'])assert(!/\bmin:\s*\d+/.test(read(file)),`${file} enthält wieder feste min-Tagesnummern`);
const immersion=read('ukrainischkurs-immersion-transfer.js');assert((immersion.match(/title:'Immersion /g)||[]).length===6&&immersion.includes('Immersion 5 · 8-Zug-Gespräch'),'Immersionsumfang beschädigt');
const cando=read('ukrainischkurs-a1-cando.js');assert((cando.match(/mode:'type'/g)||[]).length===12&&(cando.match(/mode:'audio'/g)||[]).length===4,'Can-do hat nicht 12 Tipp- und 4 Höraufgaben');
const native=read('ukrainischkurs-native-audio.js');assert([...native.matchAll(/^\s*'([А-ЯІЇЄҐЬ])':\{file:/gmu)].length===33,'Alphabet-Audioabdeckung ist nicht 33');

// CEFR-orientierte A1-Prüfungsphase: vier getrennte Domains, Parallelformen, Reparatur und kein Same-Day-Retake.
const exam=read('ukrainischkurs-a1-exam.js');
assert(exam.includes('const VERSION=1')&&exam.includes("const DOMAINS=['reading','listening','writing','speaking']"),'A1-Prüfung definiert nicht vier Kompetenzbereiche');
assert((exam.match(/const READING_FORMS=/g)||[]).length===1&&(exam.match(/const LISTENING_FORMS=/g)||[]).length===1&&(exam.match(/const WRITING_FORMS=/g)||[]).length===1&&(exam.match(/const SPEAKING_FORMS=/g)||[]).length===1,'A1-Parallelformen fehlen');
assert(exam.includes('parallelForms:3')&&exam.includes('retakeNextDay:true')&&exam.includes('repairRequired:true'),'A1-Prüfung meldet Parallelformen/Reparatur/Folgetag-Retake nicht');
assert(exam.includes("st.lastAttemptDate!==date()")&&exam.includes("st.lastAttemptDate===date()"),'Same-Day-Retake wird nicht technisch gesperrt');
assert(exam.includes('REPAIR={')&&exam.includes('function beginRepair')&&exam.includes('repairDone=true'),'Verpflichtende Reparatur ist nicht implementiert');
assert(exam.includes("session.correct>=7")&&exam.includes("session.correct>=8")&&exam.includes("session.correct===total"),'Strenge Les-/Hör-/Schreib-/Sprechschwellen fehlen');
assert(exam.includes('navigator.mediaDevices?.getUserMedia')&&exam.includes('window.MediaRecorder'),'Sprechprüfung verlangt keine echte lokale Aufnahme');
assert(exam.includes('SpeechRecognition||window.webkitSpeechRecognition')&&exam.includes("evidenceType='reviewer'"),'Sprechprüfung hat keinen Verständlichkeitsnachweis über Erkennung oder zweite Person');
assert(exam.includes('session.recorded||!session.replayed')||exam.includes('!session.recorded||!session.replayed'),'Sprechprüfung verlangt kein Rückhören der eigenen Aufnahme');
assert(exam.includes('officialCertificate:false')&&exam.includes('cefrAligned:true'),'A1-Prüfung behauptet amtliche Zertifizierung oder verschweigt CEFR-Ausrichtung');
assert(exam.includes('allDomainsPassed()&&!!s.a1CanDo?.passed'),'Gesamtabschluss verlangt nicht alle vier Prüfungen plus Can-do');
assert(exam.includes('const start=D.length')&&exam.includes('FINAL_DAY=start+4'),'A1-Prüfungsphase fügt nicht fünf Abschlussabschnitte an');

const dynamic=read('ukrainischkurs-dynamic-course-ui.js');
assert(dynamic.includes('const VERSION=2')&&dynamic.includes('staleCopyFixed:true'),'Dynamic Course UI v2 fehlt');
for(const text of ['Dein geführter Ukrainischkurs','Die App führt dich automatisch','Das öffnet sich automatisch im Lernweg'])assert(dynamic.includes(text),`Bereinigter UI-Text fehlt: ${text}`);
const selftest=read('ukrainischkurs-selftest.js');
assert(selftest.includes('Laufzeit-Selbsttest v30')&&selftest.includes('version===41')&&selftest.includes('UKRAINIAN_A1_EXAM'),'Selbsttest ist nicht auf v30/v41/A1-Prüfung');
assert(selftest.includes("exam?.parallelForms===3")&&selftest.includes("exam?.retakeNextDay===true")&&selftest.includes("exam?.repairRequired===true"),'Selbsttest prüft die A1-Prüfungsstrenge nicht');
assert(selftest.includes("D.length>=95"),'Selbsttest kennt die verlängerte A1-Prüfungsphase nicht');

const manifest=JSON.parse(read('ukrainisch-lernen.webmanifest'));
assert(String(manifest.description||'').includes('CEFR-orientierten A1-Prüfungen'),'PWA-Beschreibung nennt den kompetenzbasierten A1-Abschluss nicht');

if(errors.length){console.error(`VALIDIERUNG FEHLGESCHLAGEN (${errors.length})`);errors.forEach(e=>console.error('- '+e));process.exit(1)}
console.log('VALIDIERUNG OK: v41 mit kompetenzbasiertem CEFR-A1-Abschluss, getrennten Prüfungen für Lesen/Hören/Schreiben/Sprechen, drei Parallelformen, verpflichtender Reparatur, Folgetag-Retakes, Aufnahme-/Verständlichkeitsnachweis und zusätzlichem Can-do-Gate; bestehende Lern-, PWA-, Audio- und Fortschrittsregressionen geprüft.');
