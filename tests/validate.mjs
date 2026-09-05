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
  assert(exists(file),`${file} fehlt`);
  if(exists(file))compile(read(file),file);
}
for(const htmlFile of ['ukrainisch-lernen.html','ukrainischkurs-app.html','index.html']){
  assert(exists(htmlFile),`${htmlFile} fehlt`);
  if(!exists(htmlFile))continue;
  const html=read(htmlFile);let i=0;
  for(const m of html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi))compile(m[1],`${htmlFile} inline-script-${++i}`);
}
try{JSON.parse(read('ukrainisch-lernen.webmanifest'))}catch(e){errors.push(`ukrainisch-lernen.webmanifest: ${e.message}`)}

// Statischer Kern muss weiter exakt dem historischen Inhalt entsprechen.
const legacyParts=[1,2,3,4,5].map(n=>read(`ukrainischkurs-v2.part${n}`));
compile(legacyParts.join(''),'ukrainischkurs-v2.part1–5');
const canonicalLegacy=legacyParts.map(part=>part.replace(/\n?$/,'')).join('\n');
const staticCore=read('ukrainischkurs-v2-core.js');
assert(staticCore===canonicalLegacy,'Statischer Core weicht inhaltlich von den historischen Fragmenten ab');
assert(staticCore.includes('function migrateState()')&&staticCore.includes('s.courseSchema = SCHEMA'),'Fortschrittsmigration fehlt im statischen Core');
const expectedAlphabet='А Б В Г Ґ Д Е Є Ж З И І Ї Й К Л М Н О П Р С Т У Ф Х Ц Ч Ш Щ Ь Ю Я';
assert(staticCore.includes(`const ORDER = '${expectedAlphabet}'.split(' ')`),'Alphabet-Reihenfolge stimmt nicht');
assert((staticCore.match(/'[^']+':\{pair:/g)||[]).length===33,'LETTER_INFO enthält nicht 33 Zeichen');

// Loader / statische App-Hülle.
const loader=read('ukrainischkurs-v2-loader.js');
for(const f of modules)assert(loader.includes(f),`Loader bindet ${f} nicht ein`);
assert(loader.includes("const VERSION='39'"),'Loader ist nicht auf v39');
assert(loader.includes("human-sentence-audio.js?v=4"),'Loader bindet Human-Audio v4 nicht ein');
assert(loader.includes("speaking-bridge.js?v=3"),'Loader bindet Speaking Bridge v3 nicht ein');
assert(loader.includes("selftest.js?v=28"),'Loader bindet Selbsttest v28 nicht ein');
assert(loader.includes("mode:'external-core-script'")&&loader.includes('staticCore:true'),'Loader meldet statischen externen Core nicht');
assert(loader.includes('ukrainischkurs-v2-core.js?v=${VERSION}'),'Loader lädt den statischen Core nicht versionsgebunden');
assert(!/\beval\s*\(/.test(loader),'Loader verwendet eval()');
for(const bad of ['ukrainischkurs-v2.part','response.text()','runCore(','script.textContent'])assert(!loader.includes(bad),`Loader enthält wieder Legacy-Code: ${bad}`);

const app=read('ukrainischkurs-app.html');
assert(app.includes('ukrainischkurs-v2-loader.js?v=39'),'Generierte App-Hülle lädt nicht v39');
assert(!app.includes("fetch('./ukrainisch-lernen.html"),'App-Hülle fetcht wieder HTML zur Laufzeit');
assert(!app.includes('document.write(')&&!app.includes('document.open('),'App-Hülle verwendet wieder document.write/open');
const buildScript=read('scripts/build-app-shell.mjs');
assert(buildScript.includes('--check')&&buildScript.includes('ukrainischkurs-app.html'),'Deterministischer App-Hüllen-Check fehlt');

// Service Worker: gezielte Regression gegen den gefundenen Versionsmischungs-/Cache-Race-Fehler.
const sw=read('ukrainisch-lernen-sw.js');
assert(sw.includes("const VERSION='39'"),'Service Worker ist nicht auf v39');
assert(sw.includes('ukrainischkurs-joel-v${VERSION}'),'Service-Worker-Cache ist nicht an VERSION gekoppelt');
assert(!sw.includes('ignoreSearch:true'),'Service Worker kann wieder versionsübergreifend alte Assets matchen');
assert(sw.includes("requestedVersion&&requestedVersion!==VERSION"),'Service Worker blockiert keine Offline-Versionsmischung');
assert(sw.includes('versionedResponse(event.request,url)'),'Versionierte Assets haben keinen eigenen Update-Pfad');
assert(sw.includes('await cache.put(request,response.clone())'),'Runtime-Cache-Schreibvorgang wird nicht abgewartet');
assert(sw.includes('await cache.put(canonical,response.clone())'),'Kanonischer Offline-Fallback wird nicht zuverlässig aktualisiert');
assert(sw.includes("event.request.mode==='navigate'||event.request.destination==='document'"),'Navigation hat keinen getrennten Offline-Pfad');
assert(sw.includes("new Response('Offline-Asset nicht verfügbar'"),'Sauberer 503-Asset-Fallback fehlt');
assert(!sw.includes('ukrainischkurs-v2.part'),'Service Worker cached wieder historische Core-Fragmente');

// Menschliche Audios: Unterbrechung darf weder Audio überlappen noch alte Buttons gesperrt lassen.
const human=read('ukrainischkurs-human-sentence-audio.js');
assert(human.includes('const VERSION=4'),'Human-Audio ist nicht v4');
assert((human.match(/file:'Uk-/g)||[]).length===12,'Human-Audio enthält nicht 12 verifizierte Quellen');
assert(human.includes('function release(playback)')&&human.includes('playback.button.disabled=false'),'Unterbrochene Human-Audio-Buttons werden nicht entsperrt');
assert(human.includes('function stopCurrent()')&&human.includes('try{playback.audio.pause()}catch{}'),'Laufende menschliche Aufnahme wird bei Wechsel nicht gestoppt');
assert(human.includes('if(item)return humanSpeak(item,button);\n    stopCurrent();\n    return baseSpeak(text,button)'),'TTS kann noch parallel zu menschlichem Audio starten');
assert(human.includes('if(failed||playback.released)return'),'Unterbrochenes Audio kann noch verspätet als erfolgreich gemeldet werden');
assert(human.includes("dataset.audioSource='human'")&&human.includes("dataset.audioSource='tts-fallback'"),'Human/TTS-Quelle wird nicht transparent markiert');
assert(!human.includes('native:true'),'Unbelegter Native-Status aktiv');

// Recorder: Reset/Retry während Aufnahme darf keinen onstop-Zugriff auf rec.media=null erzeugen.
const speaking=read('ukrainischkurs-speaking-bridge.js');
assert(speaking.includes('const VERSION=3'),'Speaking Bridge ist nicht v3');
assert(speaking.includes('function disposeRecorder()'),'Recorder besitzt keinen zentralen sicheren Cleanup');
assert(speaking.includes('media.ondataavailable=null;media.onstop=null;media.onerror=null'),'Recorder-Handler werden vor einem verworfenen Reset nicht entkoppelt');
assert(speaking.includes("try{if(media.state!=='inactive')media.stop()}catch{}"),'Laufender Recorder wird beim Reset nicht sicher gestoppt');
assert(speaking.includes('if(rec.media!==media)return'),'Veralteter MediaRecorder kann noch Sessionzustand überschreiben');
assert(speaking.includes("if(rec.media?.state==='recording'){toast('Stoppe zuerst die laufende Aufnahme.')"),'Retry ist während laufender Aufnahme nicht geschützt');
assert(speaking.includes("id=\"sbRetry\" '+(recording?'disabled':'')"),'Retry-Button wird während Aufnahme nicht deaktiviert');
assert(speaking.includes('safeRecorderReset:true'),'Speaking Bridge meldet sicheren Recorder-Reset nicht');
assert(speaking.includes('disposePlayback()'),'Lokales Aufnahme-Playback wird beim Reset nicht beendet');

// Zentrale Lernarchitektur / frühere Regressionen.
const core=read('ukrainischkurs-learning-core.js');
assert(core.includes('const VERSION=3'),'Lernkern ist nicht v3');
for(const token of ["const SKILLS=['reading','listening','writing','speaking','grammar']",'function normalize(value,opts={})','function accepts(value,answers,opts={})','function introductionDay(needle,opts={})','function allIntroduced(requirements,opts={})','function anchorDay(requirements,opts={})','function recordSession(meta={})','function reviewFocus()','function isUnlocked(id)',"'immersion.transfer'","'a1.final'"])assert(core.includes(token),`Lernkern vermisst ${token}`);
assert(core.includes("replace(/[ʼ’‘'`]/g,'’')")&&core.includes("normalize('NFC')"),'Zentrale Unicode-/Apostrophnormalisierung fehlt');
assert(core.includes("if(!WEEKLY_REVIEW_DAYS.includes(Number(s.day)))return null"),'Review-Fokus wird außerhalb Review-Tagen erzeugt');

const centralized=['ukrainischkurs-a1-grammar-bridge.js','ukrainischkurs-time-bridge.js','ukrainischkurs-genitive-bridge.js','ukrainischkurs-immersion-transfer.js','ukrainischkurs-open-dialogue.js','ukrainischkurs-conversation-chain.js','ukrainischkurs-free-reading-transfer.js','ukrainischkurs-active-production.js','ukrainischkurs-grammar-spiral.js','ukrainischkurs-dictation.js','ukrainischkurs-a1-cando.js'];
for(const file of centralized){
  const src=read(file);
  assert(!src.includes('fallbackNorm'),`${file} enthält wieder lokalen fallbackNorm`);
  assert(!src.includes(".normalize('NFC')"),`${file} normalisiert Unicode wieder lokal`);
  assert(src.includes('core.accepts'),`${file} nutzt zentrale Antwortbewertung nicht`);
}
const comp=read('ukrainischkurs-comprehension-lab.js');
assert(comp.includes('dynamicReadingDependencies:true')&&!/\bmin:\s*\d+/.test(comp),'Comprehension Lab nutzt wieder feste Tagesnummern');
const story=read('ukrainischkurs-story-lab.js');
assert(story.includes('dynamicDependencies:true')&&!/\bmin:\s*\d+/.test(story),'Story Lab nutzt wieder feste Tagesnummern');
const prod=read('ukrainischkurs-active-production.js'),grammar=read('ukrainischkurs-grammar-spiral.js'),dict=read('ukrainischkurs-dictation.js');
assert(!/\bmin:\s*\d+/.test(prod),'Active Production enthält wieder feste min-Tage');
assert(!/\bmin:\s*\d+/.test(grammar),'Grammar Spiral enthält wieder feste min-Tage');
assert(!/\bmin:\s*\d+/.test(dict),'Dictation enthält wieder feste min-Tage');

const native=read('ukrainischkurs-native-audio.js');
assert([...native.matchAll(/^\s*'([А-ЯІЇЄҐЬ])':\{file:/gmu)].length===33,'Alphabet-Audioabdeckung ist nicht 33');
const srs=read('ukrainischkurs-adaptive-srs.js');for(const t of ['meta.ease','meta.lapses','meta.interval','meta.leech','repairPending','90'])assert(srs.includes(t),`SRS vermisst ${t}`);
const immersion=read('ukrainischkurs-immersion-transfer.js');
assert((immersion.match(/title:'Immersion /g)||[]).length===6&&immersion.includes('Immersion 5 · 8-Zug-Gespräch'),'Immersionsumfang ist beschädigt');
const cando=read('ukrainischkurs-a1-cando.js');
assert((cando.match(/mode:'type'/g)||[]).length===12&&(cando.match(/mode:'audio'/g)||[]).length===4,'Can-do hat nicht 12 Tipp- und 4 Höraufgaben');
const selftest=read('ukrainischkurs-selftest.js');
assert(selftest.includes('Laufzeit-Selbsttest v28')&&selftest.includes('version===39'),'Selbsttest ist nicht auf v28/v39');
assert(selftest.includes('HUMAN_SENTENCE_AUDIO?.version>=4'),'Selbsttest prüft Human-Audio v4 nicht');
assert(selftest.includes('safeRecorderReset===true'),'Selbsttest prüft sicheren Recorder-Reset nicht');

// Workflows bleiben auf aktuellen Node-24-kompatiblen Action-Majors.
for(const workflow of ['.github/workflows/validate-course.yml','.github/workflows/build-app-shell.yml']){
  const yml=read(workflow);
  assert(yml.includes('actions/checkout@v7'),`${workflow} nutzt nicht checkout@v7`);
  assert(yml.includes('actions/setup-node@v7'),`${workflow} nutzt nicht setup-node@v7`);
}

if(errors.length){console.error(`VALIDIERUNG FEHLGESCHLAGEN (${errors.length})`);errors.forEach(e=>console.error('- '+e));process.exit(1)}
console.log('VALIDIERUNG OK: Syntax, v39 Fehlerregressionen für versionssicheren Service Worker, abgewartete Cache-Schreibvorgänge, Human-Audio-Unterbrechung und sicheren MediaRecorder-Reset; statische App/Core-Architektur, Fortschrittsmigration, zentrale Lernlogik und adaptive Skillkanäle geprüft.');