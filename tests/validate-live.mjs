import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

const root=process.cwd(),read=p=>fs.readFileSync(path.join(root,p),'utf8'),errors=[];
const assert=(condition,message)=>{if(!condition)errors.push(message)};
const swPath=path.join(root,'ukrainisch-lernen-sw.js'),realSw=read('ukrainisch-lernen-sw.js'),loader=read('ukrainischkurs-v2-loader.js');
const guided=read('ukrainischkurs-guided-start.js'),writingHardening=read('ukrainischkurs-guided-writing-hardening.js'),flowHardening=read('ukrainischkurs-guided-flow-hardening.js');
const nativeAudio=read('ukrainischkurs-native-audio.js'),pronunciation=read('ukrainischkurs-pronunciation.js'),mastery=read('ukrainischkurs-pronunciation-mastery.js');
const humanListening=read('ukrainischkurs-human-listening.js'),audioGate=read('ukrainischkurs-audio-quality-gate.js'),spokenTransfer=read('ukrainischkurs-spoken-transfer.js');
const a1HumanListening=read('ukrainischkurs-a1-human-listening-gate.js'),a1Writing=read('ukrainischkurs-a1-writing-quality-gate.js'),a1Evidence=read('ukrainischkurs-a1-evidence-gate.js');

assert(realSw.includes("const VERSION='69'"),'Live-Service-Worker ist nicht v69');
for(const asset of ['./ukrainischkurs-simple-foundation.js','./ukrainischkurs-guided-start.js','./ukrainischkurs-guided-writing-hardening.js','./ukrainischkurs-guided-flow-hardening.js','./ukrainischkurs-audio-quality-gate.js','./ukrainischkurs-a1-human-listening-gate.js','./ukrainischkurs-a1-writing-quality-gate.js','./ukrainischkurs-a1-evidence-gate.js'])assert(realSw.includes(`'${asset}'`),`${asset} fehlt im Offline-Cache`);
for(const marker of ['./ukrainischkurs-native-audio.js?v=6','./ukrainischkurs-pronunciation.js?v=5','./ukrainischkurs-pronunciation-mastery.js?v=5','./ukrainischkurs-audio-quality-gate.js?v=2','./ukrainischkurs-human-listening.js?v=4','./ukrainischkurs-spoken-transfer.js?v=2','./ukrainischkurs-a1-human-listening-gate.js?v=1','./ukrainischkurs-a1-writing-quality-gate.js?v=1','./ukrainischkurs-a1-evidence-gate.js?v=1','./ukrainischkurs-guided-start.js?v=4','./ukrainischkurs-guided-writing-hardening.js?v=1','./ukrainischkurs-guided-flow-hardening.js?v=1'])assert(loader.includes(marker),`Loader vermisst ${marker}`);
assert(loader.indexOf('human-sentence-audio.js?v=4')<loader.indexOf('audio-quality-gate.js?v=2'),'Audio-Integritätswache lädt zu früh');
assert(loader.indexOf('audio-quality-gate.js?v=2')<loader.indexOf('human-listening.js?v=4')&&loader.indexOf('audio-quality-gate.js?v=2')<loader.indexOf('spoken-transfer.js?v=2'),'Audio-Integritätswache muss vor Hör-/Sprechevidenz laden');
assert(loader.indexOf('a1-exam.js?v=2')<loader.indexOf('a1-human-listening-gate.js?v=1')&&loader.indexOf('a1-human-listening-gate.js?v=1')<loader.indexOf('a1-writing-quality-gate.js?v=1')&&loader.indexOf('a1-writing-quality-gate.js?v=1')<loader.indexOf('a1-evidence-gate.js?v=1')&&loader.indexOf('a1-evidence-gate.js?v=1')<loader.indexOf('a1-cando.js?v=7'),'A1-Zusatzgates laden nicht zentral vor Can-do');
assert(loader.indexOf('simple-foundation.js?v=1')<loader.indexOf('guided-start.js?v=4')&&loader.indexOf('guided-start.js?v=4')<loader.indexOf('guided-writing-hardening.js?v=1')&&loader.indexOf('guided-writing-hardening.js?v=1')<loader.indexOf('guided-flow-hardening.js?v=1'),'Anfänger-Härtungen laden nicht in sicherer Reihenfolge');

for(const marker of ['oneScreenOneTask:true','pictureLearning:true','tracing:true','humanAudioOnly:true','exactWordAudio:true','fullHumanAudio:true','strokeByStroke:true','autoHelp:true','easyFirstChoice:true','guided-trace','Los geht’s','Noch einen lernen'])assert(guided.includes(marker),`Geführter Start vermisst ${marker}`);
assert(!guided.includes('speechSynthesis')&&!guided.includes('SpeechSynthesisUtterance'),'Geführter Einstieg darf keine System-TTS verwenden');
assert(!guided.includes("В'єтнам"),'Vietnam darf im geführten Alphabet-Start nicht vorkommen');
assert(guided.includes('attempts.value>=2')&&guided.includes("day()===0&&store().index===0?2:3"),'Anfänger-Hilfe/erste vereinfachte Auswahl fehlt');
assert(guided.includes("primary('Morgen weitermachen',()=>{})"),'Baseline-Totbutton wurde unerwartet verändert; Flow-Hardening soll ihn kontrolliert reparieren');

for(const marker of ['printFirst:true','normativeStrokeOrderClaim:false','spatialCoverageRequired:true','antiScribble:true','minHitRatio:.72','minCoverage:.34','GRID=12','visited=new Set','occupied=new Set','distance>=minDistance','m.hitRatio>=.72','m.coverage>=.34','cloneNode(false)','fakeSteps.hidden=true','Druckschrift zuerst'])assert(writingHardening.includes(marker),`Schreib-Härtung vermisst ${marker}`);
assert(writingHardening.includes("st.stage='letter'")&&writingHardening.includes('done.disabled=!ready'),'Nachmalprüfung gibt zu früh frei');
assert(!writingHardening.includes('strokeOrder')&&!writingHardening.includes('Strichfolge ist korrekt'),'Schreib-Härtung behauptet unbelegte normative Strichfolge');
for(const marker of ['functionalNextDayButton:true','usesExistingNextHandler:true','directDayMutation:false','respectsCalendarGate:true',"document.getElementById('next')","next.click()",'Weiter mit den nächsten Buchstaben',"st?.stage!=='complete'",'data-guided-advance'])assert(flowHardening.includes(marker),`Geführter Flow-Fix vermisst ${marker}`);
assert(!flowHardening.includes('s.day++')&&!flowHardening.includes('s.day +=')&&!flowHardening.includes('s.day='),'Geführter Flow-Fix darf den Kurstag nicht direkt mutieren');

const guidedPairs=new Map([...guided.matchAll(/'([^']+)':\{small:'[^']*',word:'([^']+)'/g)].map(m=>[m[1],m[2]])),audioPairs=new Map([...nativeAudio.matchAll(/^\s*'([^']+)':\{file:'[^']+',label:'([^']+)'/gm)].map(m=>[m[1],m[2]])),norm=v=>String(v||'').trim().toLocaleLowerCase('uk-UA');
const exact=[...guidedPairs].filter(([l,w])=>norm(audioPairs.get(l))===norm(w)),mismatches=[...guidedPairs].filter(([l,w])=>norm(audioPairs.get(l))!==norm(w)),coverage=guidedPairs.size?exact.length/guidedPairs.size*100:0;
assert(guidedPairs.size===33&&audioPairs.size===33,'Alphabet-Audio-Maps müssen je 33 Einträge haben');assert(coverage===100&&mismatches.length===0,`Human-Audio-Abdeckung ist ${coverage.toFixed(1)}% statt 100%`);
assert(nativeAudio.includes("'Й':{file:'LL-Q8798 (ukr)-Tohaomg-йогурт.wav',label:'йогурт'")&&nativeAudio.includes("'Ф':{file:'LL-Q8798 (ukr)-Tohaomg-Франція.wav',label:'Франція'"),'Verifizierte Й/Ф-Anker fehlen');
for(const [name,source] of [['Aussprache-Coach',pronunciation],['Aussprache-Mastery',mastery]])assert(!source.includes('speechSynthesis')&&!source.includes('SpeechSynthesisUtterance'),`${name} darf keinen TTS-Hörnachweis enthalten`);
assert(pronunciation.includes('humanReferencesOnly:true')&&pronunciation.includes('noTtsEvidence:true'),'Aussprache-Coach ist nicht Human-only');assert(mastery.includes('humanAudioOnly:true')&&mastery.includes('noTtsEvidence:true')&&mastery.includes('playHuman(')&&!mastery.includes('playTts('),'Aussprache-Mastery ist nicht Human-only');
assert(humanListening.includes('allCorrect&&allHuman')&&humanListening.includes('human===total')&&humanListening.includes('humanOnlyPass:true'),'Human Listening kann noch ohne vollständiges Human-Audio bestehen');
for(const marker of ['tts-unverified','syntheticSinceEvidence','assisted:true','synthetic-or-unverified','human-listening','spoken-transfer','a1-exam','a1-cando-listening','marksA1Synthetic:true','syntheticEvidenceAssisted:true'])assert(audioGate.includes(marker),`Audio-Integritätswache vermisst ${marker}`);
assert(spokenTransfer.includes('humanAudioRequiredForStrong:true')&&spokenTransfer.includes("session.questionSources.every(x=>x==='human')")&&spokenTransfer.includes('audioAssisted'),'Starker Spoken Transfer verlangt nicht vollständig Human-Fragen');

for(const marker of ['poolSize:POOL.length','questionsPerAttempt:10','threshold:9','doublePass:true','differentCalendarDays:true','humanAudioOnly:true','noTtsFallback:true','blocksA1Milestone:true','session.plays>=2','session.correct>=9',"module:'a1-human-listening-",'weight:2.5','window.UKRAINIAN_PRONUNCIATION_AUDIO','window.UKRAINIAN_PRONUNCIATION_META'])assert(a1HumanListening.includes(marker),`A1 Human Listening vermisst ${marker}`);
assert((a1HumanListening.match(/\{letter:'/g)||[]).length===20,'A1 Human Listening braucht 20 verifizierte Pool-Einträge');assert(!a1HumanListening.includes('speechSynthesis')&&!a1HumanListening.includes('SpeechSynthesisUtterance')&&!a1HumanListening.includes('speak('),'A1 Human Listening enthält TTS-/speak-Fallback');assert(a1HumanListening.includes("core.normalize(meta.label)===core.normalize(q.text)"),'A1 Human Listening gleicht Quelle/Ziel nicht exakt ab');

for(const marker of ['taskBank:TASKS.length','tasksPerAttempt:3','doublePass:true','differentCalendarDays:true','antiKeywordStuffing:true','separateFreeResponses:true','sentenceBoundariesRequired:true','duplicatePenalty:true','repeatedWordPenalty','rawSentences','minSentences','minWords','maxWords','session.points>=8','criticalMiss','weight:2.5',"module:'a1-writing-quality-"])assert(a1Writing.includes(marker),`A1 Writing Quality vermisst ${marker}`);
assert((a1Writing.match(/\{id:'/g)||[]).length===8,'A1 Writing Quality braucht 8 Aufgabenvarianten');assert(a1Writing.includes("st.qualification?.date===date()")&&a1Writing.includes('st.qualification.date!==st.confirmation.date'),'A1 Writing Quality erzwingt keine unabhängigen Kalendertage');assert(!a1Writing.includes('choiceGrid')&&!a1Writing.includes('type="radio"'),'A1 Writing Quality darf keine Auswahlantworten enthalten');

for(const marker of ['centralized:true','requiresOriginalDoublePass:true','requiresHumanListeningDoublePass:true','requiresStructuredWritingDoublePass:true',"core.registerMilestone?.('a1.exam'",'originalDomains()','humanListening()','writingQuality()','r.originalDomains&&r.humanListening&&r.writingQuality'])assert(a1Evidence.includes(marker),`Zentrales A1-Evidence-Gate vermisst ${marker}`);
assert(!a1Evidence.includes('s.a1Exam=')&&!a1Evidence.includes('s.a1CanDo.passed='),'A1 Evidence Gate manipuliert Prüfungszustand direkt');

// Isolierte Schreibbewertung: korrekte kurze Sätze bestehen strukturell; Keyword-Salat ohne Satzgrenzen nicht.
try{
  const core={normalize:v=>String(v||'').normalize('NFC').toLocaleLowerCase('uk').replace(/[ʼ’‘'`]/g,'’').replace(/[.!?,…:;«»"“”„()]/g,' ').replace(/\s+/g,' ').trim(),recordSession(){}};
  const s={day:2,a1Exam:{start:0,domains:{writing:{qualified:true,passed:false,confirmed:false}}},a1WritingQuality:{version:1,qualification:null,confirmation:null,best:0,attempts:0}};
  const document={head:{append(){}},createElement(){return {textContent:''}},getElementById(){return null}};const ctx={window:{UKRAINIAN_LEARNING_CORE:core},s,date:()=> '2026-09-08',save(){},render(){},toast(){},document,MutationObserver:function(){},console};
  const vm=await import('node:vm');vm.createContext(ctx);vm.runInContext(a1Writing,ctx,{filename:'ukrainischkurs-a1-writing-quality-gate.js'});const api=ctx.window.UKRAINIAN_A1_WRITING_QUALITY;
  const good=api.evaluate({criteria:[['я не розумію'],['мені потрібна допомога'],['повторіть будь ласка']],minSentences:2,minWords:6,maxWords:22},'Я не розумію. Мені потрібна допомога. Повторіть, будь ласка.');
  const salad=api.evaluate({criteria:[['я не розумію'],['мені потрібна допомога'],['повторіть будь ласка']],minSentences:2,minWords:6,maxWords:22},'я не розумію мені потрібна допомога повторіть будь ласка');
  assert(good.structure&&good.points===3,'Korrekte strukturierte A1-Antwort wird nicht erkannt');assert(!salad.structure&&salad.points===0,'Keyword-Salat ohne Satzgrenzen besteht den neuen Schreib-Gate');
}catch(e){errors.push('A1-Writing-Runtime: '+(e.stack||e.message))}

for(const [name,source] of [['guided',guided],['writingHardening',writingHardening],['flowHardening',flowHardening],['nativeAudio',nativeAudio],['pronunciation',pronunciation],['mastery',mastery],['humanListening',humanListening],['audioGate',audioGate],['spokenTransfer',spokenTransfer],['a1HumanListening',a1HumanListening],['a1Writing',a1Writing],['a1Evidence',a1Evidence]])try{new Function(source)}catch(error){errors.push(`${name} Syntax: ${error.message}`)}
if(errors.length){console.error(`VALIDIERUNG FEHLGESCHLAGEN (${errors.length})`);errors.forEach(error=>console.error('- '+error));process.exit(1)}
try{fs.writeFileSync(swPath,realSw.replace("const VERSION='69'","const VERSION='58'"),'utf8');await import(pathToFileURL(path.join(root,'tests/validate-v58.mjs')).href+'?live='+Date.now())}finally{fs.writeFileSync(swPath,realSw,'utf8')}
console.log(`LIVE-VALIDIERUNG OK: v69 hat ${coverage.toFixed(1)}% Human-Audio im Anfänger-Alphabet, gehärtetes Nachmalen und Tagesnavigation, Human-only A1-Hören sowie doppelt bestätigtes strukturiertes A1-Schreiben. Das zentrale A1-Evidence-Gate verlangt alle ursprünglichen Doppelprüfungen plus beide Zusatznachweise.`);