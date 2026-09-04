import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';

const root=process.cwd();
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const errors=[];
const assert=(ok,msg)=>{if(!ok)errors.push(msg)};
const compile=(code,name)=>{try{new vm.Script(code,{filename:name})}catch(e){errors.push(`${name}: ${e.message}`)}};

const standalone=[
  'ukrainischkurs-v2-loader.js','ukrainischkurs-native-audio.js','ukrainischkurs-pronunciation.js',
  'ukrainischkurs-pronunciation-mastery.js','ukrainischkurs-quality-hardening.js','ukrainischkurs-adaptive-alphabet.js',
  'ukrainischkurs-alphabet-proof.js','ukrainischkurs-reading-bridge.js','ukrainischkurs-selftest.js','ukrainisch-lernen-sw.js'
];
for(const file of standalone){assert(fs.existsSync(path.join(root,file)),`${file} fehlt`);if(fs.existsSync(path.join(root,file)))compile(read(file),file)}

const combined=[1,2,3,4,5].map(n=>read(`ukrainischkurs-v2.part${n}`)).join('');
compile(combined,'ukrainischkurs-v2.part1–5');
for(const htmlFile of ['ukrainisch-lernen.html','ukrainischkurs-app.html','index.html']){
  const html=read(htmlFile);let i=0;for(const match of html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi))compile(match[1],`${htmlFile} inline-script-${++i}`);
}
try{JSON.parse(read('ukrainisch-lernen.webmanifest'))}catch(e){errors.push(`ukrainisch-lernen.webmanifest: ${e.message}`)}

const requiredModules=['ukrainischkurs-native-audio.js','ukrainischkurs-pronunciation.js','ukrainischkurs-pronunciation-mastery.js','ukrainischkurs-quality-hardening.js','ukrainischkurs-adaptive-alphabet.js','ukrainischkurs-alphabet-proof.js','ukrainischkurs-reading-bridge.js','ukrainischkurs-selftest.js'];
const loader=read('ukrainischkurs-v2-loader.js');for(const file of requiredModules)assert(loader.includes(file),`Loader bindet ${file} nicht ein`);
assert(loader.includes('ukrainischkurs-alphabet-proof.js?v=1'),'Alphabet-Proof ist nicht aktiv');
const sw=read('ukrainisch-lernen-sw.js');for(const file of requiredModules)assert(sw.includes(`'./${file}'`),`Offline-Cache enthält ${file} nicht`);
assert(sw.includes("ukrainischkurs-joel-v14"),'Service Worker ist nicht auf Cache v14');
const app=read('ukrainischkurs-app.html');assert(app.includes('ukrainischkurs-v2-loader.js?v=14'),'App-Loader ist nicht auf v14');

const part1=read('ukrainischkurs-v2.part1');const expected='А Б В Г Ґ Д Е Є Ж З И І Ї Й К Л М Н О П Р С Т У Ф Х Ц Ч Ш Щ Ь Ю Я';
assert(part1.includes(`const ORDER = '${expected}'.split(' ')`),'Ukrainische Alphabet-Reihenfolge in v2.part1 stimmt nicht');
assert((part1.match(/'[^']+':\{pair:/g)||[]).length===33,'LETTER_INFO enthält nicht genau 33 Einträge');

const hardening=read('ukrainischkurs-quality-hardening.js');
assert(hardening.includes('return LETTERS.slice(0,max)'), 'Tag-1-Buchstaben-Jagd-Härtung fehlt');
assert(hardening.includes('if(!dates.length)return 0'), 'Streak-Nullfall-Härtung fehlt');
assert(hardening.includes("if(s.day===13)return leastPractised(4)"), 'Tag-14-Aussprachehärtung fehlt');
assert(hardening.includes('menschliche ukrainische Referenz'),'Differenzierte Audio-Attribution fehlt');

const native=read('ukrainischkurs-native-audio.js');const keyMatches=[...native.matchAll(/^\s*'([А-ЯІЇЄҐЬ])':\{file:/gmu)].map(m=>m[1]);
assert(keyMatches.length===33,`Menschliche Audioabdeckung enthält ${keyMatches.length} statt 33 Alphabetzeichen`);assert(new Set(keyMatches).size===33,'Menschliche Audioabdeckung enthält doppelte Alphabetzeichen');for(const letter of expected.split(' '))assert(keyMatches.includes(letter),`Menschliche Audioquelle für ${letter} fehlt`);
assert(native.includes('Lingua Libre / Wikimedia Commons'),'Lingua-Libre-Quelle fehlt');assert(native.includes('Shtooka Project / Wikimedia Commons'),'Shtooka-Quelle fehlt');assert(native.includes('CC BY 3.0 US'),'Shtooka-Lizenzhinweis fehlt');

const adaptive=read('ukrainischkurs-adaptive-alphabet.js');
assert(adaptive.includes('retentionCount()===33'),'Mastery verlangt nicht alle 33 Zeichen an mehreren Tagen');assert(adaptive.includes("threshold:32"),'33-Zeichen-Check hat keine hohe Mastery-Schwelle');assert(adaptive.includes('AUDIO_TARGETS'),'Adaptives Hör-Diktat fehlt');assert(adaptive.includes('Verwechslungs-Test'),'Verwechslungs-Zertifizierung fehlt');assert(adaptive.includes('extensionDates'),'14+-Festigungstage fehlen');assert(adaptive.includes('2-Minuten-Mix'),'Gemischte Zwischenabrufe fehlen');assert(adaptive.includes('window.UKRAINIAN_PRONUNCIATION_AUDIO'),'Hör-Diktat nutzt keine menschlichen Audioquellen');assert(adaptive.includes('m.visual.passed&&m.audio.passed&&m.contrast.passed&&retentionReady()'),'Alphabetfreigabe ist nicht mehrmodal');assert(adaptive.includes('schnellen 14-Tage-Pfad'),'Onboarding erklärt Zieltempo nicht');assert(adaptive.includes('Mastery-Phase 14+'),'Fortschrittstext unterstützt Festigungstage nicht');

const proof=read('ukrainischkurs-alphabet-proof.js');
assert(proof.includes("toLocaleLowerCase('uk')"),'Isolierte Kleinbuchstaben werden nicht getestet');assert(proof.includes("dir:i%2?'soundToLetter':'lowerToSound'"),'Rückwärtsabruf Laut→Zeichen fehlt');assert(proof.includes('session.correct>=19'),'Kleinbuchstaben-/Rückwärtstest verlangt nicht mindestens 95 %');assert(proof.includes('successDays(l)>=3'),'Schwierige Zeichen brauchen keine drei getrennten Lerntage');assert(proof.includes('baseReady()&&caseReady()&&hardRetentionReady()'),'Alphabet-Proof ist nicht Teil der endgültigen Freigabe');

const bridge=read('ukrainischkurs-reading-bridge.js');for(const token of ['приві́т','дя́кую','будь ла́ска','украї́нською'])assert(bridge.includes(token),`Betonungsbeispiel ${token} fehlt`);for(const token of ['кінь','м’ясо','їжа','І/Я/Ю/Є/Ь'])assert(bridge.includes(token),`Weichheits-/Positionsregel ${token} fehlt`);assert(bridge.includes('Betonungs-Test'),'Interaktiver Betonungstest fehlt');assert(bridge.includes('Weichheits-Test'),'Interaktiver Weichheitstest fehlt');assert(bridge.includes("Number(s.day)===14&&alphabetReady()&&!complete()"),'Lese-Brücke blockiert den verfrühten Übergang nicht');

const selftest=read('ukrainischkurs-selftest.js');assert(selftest.includes('intro.length===33'),'Laufzeit-Selbsttest prüft 33 Alphabetzeichen nicht');assert(selftest.includes('gameLetters().length===3'),'Laufzeit-Selbsttest prüft Tag-1-Buchstaben-Jagd nicht');assert(selftest.includes('s.alphabetMastery'),'Laufzeit-Selbsttest prüft adaptive Mastery nicht');assert(selftest.includes('s.alphabetProof'),'Laufzeit-Selbsttest prüft Alphabet-Proof nicht');assert(selftest.includes('s.readingBridge'),'Laufzeit-Selbsttest prüft Lese-Brücke nicht');

if(errors.length){console.error(`VALIDIERUNG FEHLGESCHLAGEN (${errors.length})`);for(const e of errors)console.error('- '+e);process.exit(1)}
console.log('VALIDIERUNG OK: Syntax, Loader v14, Offline-Cache v14, 14+-Mastery, Kleinbuchstaben/Rückwärtsabruf, 3-Tage-Schwierigkeiten, 33 Audioquellen sowie Betonungs- und Weichheitsbrücke geprüft.');
