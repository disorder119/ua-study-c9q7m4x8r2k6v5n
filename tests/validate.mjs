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
  'ukrainischkurs-pronunciation-mastery.js','ukrainischkurs-quality-hardening.js','ukrainischkurs-selftest.js','ukrainisch-lernen-sw.js'
];
for(const file of standalone){assert(fs.existsSync(path.join(root,file)),`${file} fehlt`);if(fs.existsSync(path.join(root,file)))compile(read(file),file)}

const combined=[1,2,3,4,5].map(n=>read(`ukrainischkurs-v2.part${n}`)).join('');
compile(combined,'ukrainischkurs-v2.part1–5');

for(const htmlFile of ['ukrainisch-lernen.html','ukrainischkurs-app.html','index.html']){
  const html=read(htmlFile);let i=0;
  for(const match of html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi))compile(match[1],`${htmlFile} inline-script-${++i}`);
}

try{JSON.parse(read('ukrainisch-lernen.webmanifest'))}catch(e){errors.push(`ukrainisch-lernen.webmanifest: ${e.message}`)}

const loader=read('ukrainischkurs-v2-loader.js');
for(const file of ['ukrainischkurs-native-audio.js','ukrainischkurs-pronunciation.js','ukrainischkurs-pronunciation-mastery.js','ukrainischkurs-quality-hardening.js','ukrainischkurs-selftest.js'])assert(loader.includes(file),`Loader bindet ${file} nicht ein`);

const sw=read('ukrainisch-lernen-sw.js');
for(const file of ['ukrainischkurs-native-audio.js','ukrainischkurs-pronunciation.js','ukrainischkurs-pronunciation-mastery.js','ukrainischkurs-quality-hardening.js','ukrainischkurs-selftest.js'])assert(sw.includes(`'./${file}'`),`Offline-Cache enthält ${file} nicht`);

const part1=read('ukrainischkurs-v2.part1');
const expected='А Б В Г Ґ Д Е Є Ж З И І Ї Й К Л М Н О П Р С Т У Ф Х Ц Ч Ш Щ Ь Ю Я';
assert(part1.includes(`const ORDER = '${expected}'.split(' ')`),'Ukrainische Alphabet-Reihenfolge in v2.part1 stimmt nicht');
assert((part1.match(/'[^']+':\{pair:/g)||[]).length===33,'LETTER_INFO enthält nicht genau 33 Einträge');

const hardening=read('ukrainischkurs-quality-hardening.js');
assert(hardening.includes('return LETTERS.slice(0,max)'), 'Tag-1-Buchstaben-Jagd-Härtung fehlt');
assert(hardening.includes('if(!dates.length)return 0'), 'Streak-Nullfall-Härtung fehlt');
assert(hardening.includes("if(s.day===13)return leastPractised(4)"), 'Tag-14-Aussprachehärtung fehlt');

const native=read('ukrainischkurs-native-audio.js');
const keyMatches=[...native.matchAll(/^\s*'([А-ЯІЇЄҐЬ])':\{file:/gmu)].map(m=>m[1]);
assert(keyMatches.length===33,`Menschliche Audioabdeckung enthält ${keyMatches.length} statt 33 Alphabetzeichen`);
assert(new Set(keyMatches).size===33,'Menschliche Audioabdeckung enthält doppelte Alphabetzeichen');
for(const letter of expected.split(' '))assert(keyMatches.includes(letter),`Menschliche Audioquelle für ${letter} fehlt`);
assert(native.includes('Lingua Libre / Wikimedia Commons'),'Lingua-Libre-Quelle fehlt');
assert(native.includes('Shtooka Project / Wikimedia Commons'),'Shtooka-Quelle fehlt');
assert(native.includes('CC BY 3.0 US'),'Shtooka-Lizenzhinweis fehlt');
assert(native.includes('https://commons.wikimedia.org/wiki/Special:Redirect/file/'),'Native Audioquelle ist nicht Wikimedia Commons');

const selftest=read('ukrainischkurs-selftest.js');
assert(selftest.includes('intro.length===33'),'Laufzeit-Selbsttest prüft 33 Alphabetzeichen nicht');
assert(selftest.includes('gameLetters().length===3'),'Laufzeit-Selbsttest prüft Tag-1-Buchstaben-Jagd nicht');

if(errors.length){console.error(`VALIDIERUNG FEHLGESCHLAGEN (${errors.length})`);for(const e of errors)console.error('- '+e);process.exit(1)}
console.log('VALIDIERUNG OK: Syntax, Loader, Offline-Cache, Alphabet, Aussprache-Härtung und menschliche Audioquellen für alle 33 Zeichen geprüft.');
