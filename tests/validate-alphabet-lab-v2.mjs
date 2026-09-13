import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const coreSrc=fs.readFileSync(new URL('../alphabet-core-v2.js',import.meta.url),'utf8');
const appSrc=fs.readFileSync(new URL('../alphabet-app-v2.js',import.meta.url),'utf8');
const html=fs.readFileSync(new URL('../alphabet-lab.html',import.meta.url),'utf8');
const sandbox={console,Date,Math,globalThis:null};sandbox.globalThis=sandbox;
vm.runInNewContext(coreSrc,sandbox,{filename:'alphabet-core-v2.js'});
const C=sandbox.AlphabetCoreV2;
assert(C,'core export missing');
assert.equal(C.ALPHABET.length,33);
assert.equal(new Set(C.ALPHABET).size,33);
for(const c of ['Ґ','Є','І','Ї'])assert(C.ALPHABET.includes(c),`Ukrainian-specific letter missing: ${c}`);
for(const c of C.ALPHABET){assert(C.DATA[c],`missing data ${c}`);assert(C.DATA[c].lower,`missing lowercase ${c}`);assert(C.DATA[c].sound,`missing sound ${c}`)}

const legacy={version:1,xp:77,letters:{'Р':{seen:8,correct:5,wrong:3,strength:2.2,successDays:['2026-09-10'],writeDays:['2026-09-10'],confusions:{'П':3}}}};
const migrated=C.migrate(legacy);
assert.equal(migrated.version,2);assert.equal(migrated.xp,77);assert.equal(migrated.letters['Р'].wrong,3);assert.equal(migrated.letters['Р'].confusions['П'],3);assert.equal(Object.keys(migrated.letters).length,33);

let s=C.freshState();const now=Date.UTC(2026,8,13,12);
C.recordAnswer(s,{letter:'Р',good:false,kind:'reverse',selected:'П',confusedWith:'П',ms:3200,now});
assert.equal(s.letters['Р'].wrong,1);assert.equal(s.letters['Р'].confusions['П'],1);assert(s.letters['Р'].due>now&&s.letters['Р'].due<=now+3*C.MIN,'wrong answer must return quickly');
const before=C.letterMastery(s,'Р',now);
C.recordAnswer(s,{letter:'Р',good:true,kind:'reverse',selected:'Р',ms:800,now:now+3*C.MIN});
assert.equal(s.letters['Р'].correctStreak,1);assert(s.letters['Р'].due>now+3*C.MIN);assert(C.letterMastery(s,'Р',now+3*C.MIN)>=before);

let fast=C.freshState(),slow=C.freshState();for(let i=0;i<14;i++){const t=now+i*C.DAY;C.recordAnswer(fast,{letter:'А',good:true,kind:i%2?'reverse':'visual',selected:'А',ms:700,now:t});C.recordAnswer(slow,{letter:'А',good:true,kind:i%2?'reverse':'visual',selected:'А',ms:6500,now:t})}C.recordWriting(fast,'А',now);C.recordWriting(slow,'А',now);assert(C.letterMastery(fast,'А',now+15*C.DAY)>C.letterMastery(slow,'А',now+15*C.DAY),'fast correct retrieval should outrank very slow retrieval');

const rng=(()=>{let x=123456789;return()=>{x=(1103515245*x+12345)%2147483648;return x/2147483648}})();
const exam=C.buildExam(s,{size:50,scope:'standard',feedback:'learning',rng,now});assert.equal(exam.tasks.length,50);assert(exam.tasks.every(t=>C.ALPHABET.includes(t.letter)));assert(new Set(exam.tasks.map(t=>t.type)).size>=5,'standard exam should mix question types');
const variants=new Set(exam.tasks.map(t=>t.variant).filter(Boolean));for(const v of ['visual-chaos','nonsense-syllable','pair-match','odd-one-out','alphabet-order','sound-contrast'])assert(variants.has(v),`missing exam variant ${v}`);
const fake=C.buildExam(s,{size:30,scope:'fake',rng,now});assert(fake.tasks.every(t=>C.FAKE_FRIENDS.includes(t.letter)),'fake-friend exam leaked unrelated letters');
const errors=C.buildExam(s,{size:20,scope:'errors',rng,now});assert(errors.tasks.some(t=>t.letter==='Р'),'error exam should draw from persistent errors');
const diag=C.buildDiagnostic(C.freshState(),{size:50,rng});assert.equal(diag.tasks.length,50);for(const c of C.ALPHABET)assert(diag.tasks.some(t=>t.letter===c),`diagnostic must cover ${c}`);
const repair=C.repairTask({letter:'Р',type:'visual'},s,rng);assert.equal(repair.letter,'Р');assert.notEqual(repair.type,'visual');assert.equal(repair.repair,true);

let down=C.freshState();for(let day=0;day<5;day++){for(const kind of ['visual','reverse','audio','lowercase','uppercase','contrast'])C.recordAnswer(down,{letter:'Ш',good:true,kind,selected:'Ш',ms:700,now:now+day*C.DAY});}C.recordWriting(down,'Ш',now);const high=C.letterMastery(down,'Ш',now+5*C.DAY);for(let i=0;i<4;i++)C.recordAnswer(down,{letter:'Ш',good:false,kind:'visual',selected:'Щ',confusedWith:'Щ',ms:900,now:now+5*C.DAY+i*1000});const low=C.letterMastery(down,'Ш',now+5*C.DAY+5000);assert(low<high,'mastery must decrease after fresh errors');assert.equal(C.topConfusions(down,1)[0][0],'Ш ↔ Щ');

for(const token of ['Lernprüfung','Realprüfung','MEINE FEHLER TRAINIEREN','PRÜFUNG STARTEN','Startdiagnose','Schwächen-Battle','Speed-Prüfung','Audio-Prüfung'])assert(appSrc.includes(token)||html.includes(token),`missing UI capability: ${token}`);
for(const token of ['visual-chaos','nonsense-syllable','pair-match','odd-one-out','alphabet-order','sound-contrast'])assert(coreSrc.includes(token),`missing rich question variant ${token}`);
assert(html.includes('alphabet-core-v2.js'));assert(html.includes('alphabet-app-v2.js'));assert(!html.includes('<script src="alphabet-lab.js"></script>'),'legacy monolith must not be active');
assert(appSrc.includes("uk-alpha-lab-v1"),'legacy storage migration path missing');
assert(appSrc.includes('resolveConfusedLetter'),'confusion normalization missing');
assert(appSrc.includes('repairTask'),'wrong-answer repair queue missing');
assert(appSrc.includes('performance.now'),'response-time measurement missing');
assert(appSrc.includes('setupWriteCanvas'),'handwriting practice missing');
new Function(coreSrc);new Function(appSrc);
console.log('Alphabet Lab v2 behavioral validation: OK');
