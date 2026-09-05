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
  'ukrainischkurs-adaptive-review.js','ukrainischkurs-a1-cando.js','ukrainischkurs-uk-keyboard.js','ukrainischkurs-dynamic-course-ui.js',
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

// Historischer Core bleibt byte-inhaltlich erhalten; Fortschrittsmigration darf nicht verschwinden.
const legacy=[1,2,3,4,5].map(n=>read(`ukrainischkurs-v2.part${n}`));
const canonical=legacy.map(x=>x.replace(/\n?$/,'')).join('\n');
const staticCore=read('ukrainischkurs-v2-core.js');
assert(staticCore===canonical,'Statischer Core weicht von historischen Fragmenten ab');
assert(staticCore.includes('function migrateState()')&&staticCore.includes('s.courseSchema = SCHEMA'),'Fortschrittsmigration fehlt');
const alphabet='А Б В Г Ґ Д Е Є Ж З И І Ї Й К Л М Н О П Р С Т У Ф Х Ц Ч Ш Щ Ь Ю Я';
assert(staticCore.includes(`const ORDER = '${alphabet}'.split(' ')`),'Alphabet-Reihenfolge beschädigt');
assert((staticCore.match(/'[^']+':\{pair:/g)||[]).length===33,'LETTER_INFO hat nicht 33 Zeichen');

// App-Hülle: stabiler Loader, kein HTML-Fetch/document.write und kein Loader-Rebuild bei Versionswechsel.
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

// Loader v40 und Modulreihenfolge.
const loader=read('ukrainischkurs-v2-loader.js');
assert(loader.includes("const VERSION='40'"),'Loader ist nicht v40');
for(const f of modules)assert(loader.includes(f),`Loader bindet ${f} nicht ein`);
for(const token of ['human-sentence-audio.js?v=4','speaking-bridge.js?v=3','dynamic-course-ui.js?v=2','selftest.js?v=29'])assert(loader.includes(token),`Loader vermisst ${token}`);
assert(loader.includes("mode:'external-core-script'")&&loader.includes('staticCore:true'),'Loader meldet statischen Core nicht');
for(const bad of ['ukrainischkurs-v2.part','response.text()','runCore(','script.textContent'])assert(!loader.includes(bad),`Legacy-Loadercode zurück: ${bad}`);
assert(!/\beval\s*\(/.test(loader),'Loader verwendet eval()');
assert(loader.indexOf('v2-core.js')<loader.indexOf('native-audio.js'),'Featuremodule laden vor Core');
assert(loader.indexOf('adaptive-srs.js')<loader.indexOf('learning-core.js'),'Lernkern lädt vor SRS');
assert(loader.indexOf('skill-profile.js')<loader.indexOf('selftest.js'),'Selbsttest lädt vor Skill-Profil');

// Service Worker v40: stabile Loader-URL muss network-first sein, Versionen dürfen offline nicht gemischt werden.
const sw=read('ukrainisch-lernen-sw.js');
assert(sw.includes("const VERSION='40'"),'Service Worker ist nicht v40');
assert(sw.includes('ukrainischkurs-joel-v${VERSION}'),'Cache ist nicht an VERSION gekoppelt');
assert(!sw.includes('ignoreSearch:true'),'Versionsübergreifendes Cache-Matching ist zurück');
assert(sw.includes("stableLoader=url.pathname.endsWith('/ukrainischkurs-v2-loader.js')"),'Stabile Loader-URL wird nicht separat erkannt');
assert(sw.includes('else if(stableLoader)event.respondWith(freshAssetResponse'),'Stabiler Loader ist nicht network-first');
assert(sw.includes("requestedVersion&&requestedVersion!==VERSION"),'Offline-Versionsmischung wird nicht blockiert');
assert(sw.includes('await cache.put(request,response.clone())')&&sw.includes('await cache.put(canonical,response.clone())'),'Cache-Schreibvorgänge werden nicht vollständig abgewartet');
assert(sw.includes("event.request.mode==='navigate'||event.request.destination==='document'"),'Navigation hat keinen getrennten Fallback');
assert(sw.includes("new Response('Offline-Asset nicht verfügbar'"),'Sauberer Asset-503 fehlt');
assert(!sw.includes('ukrainischkurs-v2.part'),'Historische Core-Fragmente sind wieder im Cache');

// Gefundene Audio-/Recorder-Regressionsfehler bleiben geschlossen.
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

// Zentrale Lernarchitektur / Kompetenz-Gates.
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

// Sichtbare Kurs-UI muss alte 30-Tage-/Monatsannahmen zur Laufzeit beseitigen.
const dynamic=read('ukrainischkurs-dynamic-course-ui.js');
assert(dynamic.includes('const VERSION=2')&&dynamic.includes('staleCopyFixed:true'),'Dynamic Course UI v2 fehlt');
for(const text of ['Dein geführter Ukrainischkurs','Die App führt dich automatisch','Das öffnet sich automatisch im Lernweg'])assert(dynamic.includes(text),`Bereinigter UI-Text fehlt: ${text}`);
const selftest=read('ukrainischkurs-selftest.js');
assert(selftest.includes('Laufzeit-Selbsttest v29')&&selftest.includes('version===40')&&selftest.includes('UKRAINIAN_DYNAMIC_COURSE_UI?.version>=2'),'Selbsttest ist nicht auf v29/v40');
assert(selftest.includes('Veralteter Monats-/30-Tage-Text ist noch sichtbar'),'Selbsttest prüft veraltete Kurskopie nicht');

if(errors.length){console.error(`VALIDIERUNG FEHLGESCHLAGEN (${errors.length})`);errors.forEach(e=>console.error('- '+e));process.exit(1)}
console.log('VALIDIERUNG OK: v40 mit race-freier stabiler App-Hülle, network-first Loader, versionssicherem PWA-Cache, Audio-/Recorder-Regressionsschutz, bereinigter Kurs-UI, statischem Core, Fortschrittsmigration, zentraler Lernlogik und adaptiven Skillkanälen geprüft.');
