import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';
const src=['alphabet-core-v3-data.js','alphabet-core-v3-model.js','alphabet-core-v3-exam.js','alphabet-core-v2.js'].map(f=>fs.readFileSync(new URL('../'+f,import.meta.url),'utf8')).join('\n');const sb={console,Date,Math,globalThis:null};sb.globalThis=sb;vm.runInNewContext(src,sb);const C=sb.AlphabetCoreV2;const now=Date.UTC(2026,8,13,12);
// A Nullwissen: ehrlicher Score + Repair
let a=C.freshState();const ex=C.buildExam(a,{size:30,scope:'standard',rng:()=>.17,now});const ss=C.createExamSession(ex.tasks,{feedback:'learning'});for(let i=0;i<30;i++)C.applyMainAnswer(ss,{correct:i<6,latencyValid:true,latencyMs:1800});const sc=C.sessionScore(ss);assert.equal(sc.total,30);assert.equal(sc.correct,6);
// B deutsche Fake Friends
let b=C.freshState();for(const [c,trap,other] of [['Р','P','П'],['Н','H','Г'],['В','B','Б'],['С','C','З'],['У','Y','В'],['Х','X','К']])C.recordAnswer(b,{letter:c,good:false,kind:'visual',skill:'visualToSound',selected:trap,confusedWith:other,now,latencyMs:900});for(const c of C.FAKE_FRIENDS){assert.equal(b.letters[c].trapStats.latinLookalike.wrong,1);assert(C.errorPriority(b,c)>0)}
// C Ш/Щ
let c=C.freshState();for(let i=0;i<5;i++)C.recordAnswer(c,{letter:'Ш',good:false,kind:'contrast',skill:'confusionDiscrimination',selected:'Щ',confusedWith:'Щ',now:now+i,latencyMs:800});assert.equal(C.topConfusions(c,1)[0][0],'Ш ↔ Щ');assert.equal(C.buildDistractors({state:c,letter:'Ш',skill:'confusionDiscrimination',count:1})[0],'Щ');
// D asymmetrisches Wissen
let d=C.freshState();for(let i=0;i<20;i++)C.recordAnswer(d,{letter:'Р',good:true,kind:'visual',skill:'visualToSound',now:now+i*C.HOUR,latencyMs:700});for(let i=0;i<10;i++)C.recordAnswer(d,{letter:'Р',good:i<4,kind:'reverse',skill:'soundToLetter',selected:i<4?'Р':'П',confusedWith:i<4?'':'П',now:now+C.DAY+i,latencyMs:800});assert.notEqual(C.letterStatus(d,'Р'),'Sicher');
// E Rückfall
let e=C.freshState();for(let day=0;day<5;day++)for(const k of C.CORE_SKILLS)C.recordAnswer(e,{letter:'А',good:true,kind:{visualToSound:'visual',soundToLetter:'reverse',caseRecognition:'lowercase',audioToLetter:'audio',confusionDiscrimination:'contrast'}[k],skill:k,now:now+day*C.DAY,latencyMs:600});C.recordWriting(e,'А',now);const hi=C.letterMastery(e,'А');for(let i=0;i<5;i++)C.recordAnswer(e,{letter:'А',good:false,kind:'reverse',skill:'soundToLetter',selected:'О',confusedWith:'О',now:now+6*C.DAY+i,latencyMs:600});assert(C.letterMastery(e,'А')<hi);
// F Audioausfall: Certification-State ohne menschliche Quelle darf nie bestehen
let f=C.freshState();f.masteryChecks.audio=[{date:'2026-09-13',accuracy:1,total:33,humanAudioOnly:false,coverageLetters:[...C.ALPHABET]}];assert.equal(C.mastered(f).audio,false);
// G V1-State: keine 50ms-Fake-Speed
let g=C.migrate({version:1,letters:{А:{seen:100,correct:100,wrong:0,avgMs:50,totalMs:5000}}});assert.equal(g.letters.А.skills.visualToSound.timedAttempts,0);assert.equal(C.avgSkillLatency(g.letters.А.skills.visualToSound),0);
console.log('Alphabet Lab v3 persona simulations: OK');
