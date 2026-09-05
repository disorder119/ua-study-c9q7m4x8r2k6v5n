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
assert(loader.includes("const VERSION='44'"),'Loader ist nicht v44');
for(const token of ['adaptive-alphabet.js?v=2','designer-alphabet.js?v=2','alphabet-proof.js?v=2','learning-core.js?v=4','a1-exam.js?v=2','a1-cando.js?v=7','selftest.js?v=33'])assert(loader.includes(token),`Loader vermisst ${token}`);
assert(loader.indexOf('adaptive-alphabet.js')<loader.indexOf('designer-alphabet.js')&&loader.indexOf('designer-alphabet.js')<loader.indexOf('alphabet-proof.js'),'Designer-Alphabet steht nicht direkt zwischen Alphabet-Mastery und Alphabet-Proof');
assert(loader.indexOf('adaptive-review.js')<loader.indexOf('a1-exam.js')&&loader.indexOf('a1-exam.js')<loader.indexOf('a1-cando.js'),'A1-Abschlussreihenfolge ist falsch');
for(const bad of ['ukrainischkurs-v2.part','response.text()','runCore(','script.textContent'])assert(!loader.includes(bad),`Legacy-Loadercode zurück: ${bad}`);
assert(!/\beval\s*\(/.test(loader),'Loader verwendet eval()');

const sw=read('ukrainisch-lernen-sw.js');
assert(sw.includes("const VERSION='44'"),'Service Worker ist nicht v44');
assert(sw.includes("'./ukrainischkurs-designer-alphabet.js'")&&sw.includes("'./ukrainischkurs-a1-exam.js'")&&sw.includes("'./ukrainischkurs-learning-core.js'"),'Designer-Alphabet/A1/Core fehlen im Offline-Cache');
assert(sw.includes('else if(stableLoader)event.respondWith(freshAssetResponse(event.request,url))'),'Stabiler Loader ist nicht korrekt network-first');
assert(!sw.includes('else if(stableLoader)event.respondWith(freshAssetResponse(request,url))'),'Stable-Loader-Zweig referenziert eine undefinierte request-Variable');
assert(sw.includes('async function versionedResponse(request,url){const canonical=canonicalRequest(url)'),'Versionierte Module haben keinen sauberen Offline-Fallback');
assert(!sw.includes('requestedVersion&&requestedVersion!==VERSION'),'Modulversionen werden noch fälschlich mit der globalen Kursversion verglichen');
assert(sw.includes('(await cache.match(request))||(await cache.match(canonical))||offlineAsset()'),'Versionierte Module nutzen Cache und kanonisches Asset offline nicht');
assert(sw.includes('await cache.put(request,response.clone())')&&sw.includes('await cache.put(canonical,response.clone())'),'Cache-Schreibvorgänge werden nicht abgewartet');

const designer=read('ukrainischkurs-designer-alphabet.js');
assert(designer.includes('const VERSION=2'),'Designer-Alphabet ist nicht v2');
assert(designer.includes("const ORDER='А Б В Г Ґ Д Е Є Ж З И І Ї Й К Л М Н О П Р С Т У Ф Х Ц Ч Ш Щ Ь Ю Я'"),'Designer-Alphabet hat nicht die korrekte ukrainische Reihenfolge');
assert((designer.match(/^\s*'[А-ЯІЇЄҐЬ]':\{anchor:/gmu)||[]).length===33,'Designer-Alphabet hat nicht exakt 33 Merkhaken');
for(const token of ['Alexander McQueen','Ann Demeulemeester','Balenciaga','Balmain','Vivienne Westwood','Jean Paul Gaultier','Yohji Yamamoto','Margiela','Ottolinger','Prada','Raf Simons','Rundholz','Saint Laurent','гаманець','взуття','куртка','спідниця','штани','шкіра','ціна','черевики'])assert(designer.includes(token),`Persönlicher Mode-/Shop-Merkanker fehlt: ${token}`);
assert(designer.includes("firstDay:['А','Б','В']")&&designer.includes("firstDayBrands:['Alexander McQueen','Balenciaga','Vivienne Westwood']"),'Tag 1 ist nicht persönlich auf А/Б/В gemünzt');
assert(designer.includes('d>=0&&d<=10?ORDER.slice(d*3,d*3+3):[]'),'Designer-Lektion folgt nicht den 11 Alphabet-Einführungstagen mit je drei Zeichen');
assert(designer.includes("quiz={phase:'anchor'")&&designer.includes("quiz.phase==='anchor'")&&designer.includes('quiz.anchorCorrect===3&&quiz.soundCorrect===3'),'Zweistufiger 3+3-Nachweis für Merkhaken und Laut fehlt');
assert(designer.includes('Stufe 1 · Merkhaken → Zeichen')&&designer.includes('Stufe 2 · Zeichen → Laut'),'Zwei Lernstufen sind in der Oberfläche nicht klar getrennt');
for(const trap of ["'В':'Sieht wie deutsches B aus", "'Н':'Sieht wie deutsches H aus", "'Р':'Sieht wie deutsches P aus", "'С':'Sieht wie deutsches C aus", "'У':'Sieht wie deutsches Y aus", "'Х':'Sieht wie deutsches X aus"])assert(designer.includes(trap),`Falscher-Freund-Warnung fehlt: ${trap}`);
assert(designer.includes('function reviewHint()')&&designer.includes('s.designerAlphabet.errors')&&designer.includes('10-Sekunden-Rückblick'),'Fehlerbasierter Rückblick früherer Buchstaben fehlt');
assert(designer.includes('Marken ersetzen niemals die Aussprache')&&designer.includes('echten ukrainischen Laut'),'Merkanker werden nicht sauber von echter Aussprache getrennt');
assert(designer.includes('alphabetGate:false')&&!designer.includes('alphabetReady=function'),'Designer-Merkhilfe darf die echte Alphabet-Mastery nicht ersetzen');
assert(designer.includes('twoStage:true')&&designer.includes('soundRecall:true'),'Designer-Modul meldet seinen zweistufigen Lautabruf nicht');
assert(designer.includes("falseFriends:Object.keys(FALSE_FRIENDS)"),'Falsche Freunde werden nicht exportiert');
assert(designer.includes('UKRAINIAN_PRONUNCIATION_AUDIO'),'Designer-Lektion nutzt die echten Buchstaben-Audioreferenzen nicht');

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
assert(selftest.includes('Laufzeit-Selbsttest v33')&&selftest.includes('version===44')&&selftest.includes('designer?.twoStage===true')&&selftest.includes('exam?.doublePass===true'),'Laufzeit-Selbsttest ist nicht auf v44/Designer-v2/Doppelprüfung');

if(errors.length){console.error(`VALIDIERUNG FEHLGESCHLAGEN (${errors.length})`);errors.forEach(e=>console.error('- '+e));process.exit(1)}
console.log('VALIDIERUNG OK: v44 mit zweistufigem persönlichem Disorder119-Alphabet, 33 Mode-/Shop-Ankern, Zeichen→Laut-Abruf, sechs kyrillischen falschen Freunden, fehlerbasiertem Rückblick, echten Buchstaben-Audioreferenzen, repariertem Offline-Modulcache und unverändert strenger Alphabet-/A1-Mastery geprüft.');