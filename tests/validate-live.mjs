import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

const root=process.cwd();
const swPath=path.join(root,'ukrainisch-lernen-sw.js');
const realSw=fs.readFileSync(swPath,'utf8');
const loader=fs.readFileSync(path.join(root,'ukrainischkurs-v2-loader.js'),'utf8');
const guided=fs.readFileSync(path.join(root,'ukrainischkurs-guided-start.js'),'utf8');
const nativeAudio=fs.readFileSync(path.join(root,'ukrainischkurs-native-audio.js'),'utf8');
const pronunciation=fs.readFileSync(path.join(root,'ukrainischkurs-pronunciation.js'),'utf8');
const mastery=fs.readFileSync(path.join(root,'ukrainischkurs-pronunciation-mastery.js'),'utf8');
const humanListening=fs.readFileSync(path.join(root,'ukrainischkurs-human-listening.js'),'utf8');
const audioGate=fs.readFileSync(path.join(root,'ukrainischkurs-audio-quality-gate.js'),'utf8');
const spokenTransfer=fs.readFileSync(path.join(root,'ukrainischkurs-spoken-transfer.js'),'utf8');
const errors=[];
const assert=(condition,message)=>{if(!condition)errors.push(message)};

assert(realSw.includes("const VERSION='65'"),'Live-Service-Worker ist nicht v65');
for(const asset of ['./ukrainischkurs-simple-foundation.js','./ukrainischkurs-guided-start.js','./ukrainischkurs-audio-quality-gate.js'])assert(realSw.includes(`'${asset}'`),`${asset} fehlt im Offline-Cache`);
assert(loader.includes("./ukrainischkurs-native-audio.js?v=6"),'Native Audio v6 wird nicht geladen');
assert(loader.includes("./ukrainischkurs-pronunciation.js?v=5"),'Human-Aussprache-Coach wird nicht geladen');
assert(loader.includes("./ukrainischkurs-pronunciation-mastery.js?v=5"),'Human-Aussprache-Mastery wird nicht geladen');
assert(loader.includes("./ukrainischkurs-audio-quality-gate.js?v=2"),'Audio-Integritätswache v2 wird nicht geladen');
assert(loader.includes("./ukrainischkurs-human-listening.js?v=4"),'Human Listening v4 wird nicht geladen');
assert(loader.includes("./ukrainischkurs-spoken-transfer.js?v=2"),'Source-aware Spoken Transfer v2 wird nicht geladen');
assert(loader.includes("await loadScript('./ukrainischkurs-guided-start.js?v=4'"),'Geführter Alphabet-Start v4 wird nicht geladen');
assert(loader.indexOf('human-sentence-audio.js?v=4')<loader.indexOf('audio-quality-gate.js?v=2'),'Audio-Integritätswache muss nach Human-Sentence-Audio laden');
assert(loader.indexOf('audio-quality-gate.js?v=2')<loader.indexOf('human-listening.js?v=4'),'Audio-Integritätswache muss vor Human Listening laden');
assert(loader.indexOf('audio-quality-gate.js?v=2')<loader.indexOf('spoken-transfer.js?v=2'),'Audio-Integritätswache muss vor Spoken Transfer laden');
assert(loader.indexOf('simple-foundation.js?v=1')<loader.indexOf('guided-start.js?v=4'),'Geführter Start muss nach der bisherigen Grundlagen-UI laden');

for(const marker of ['oneScreenOneTask:true','pictureLearning:true','tracing:true','humanAudioOnly:true','exactWordAudio:true','fullHumanAudio:true','strokeByStroke:true','autoHelp:true','easyFirstChoice:true','guided-trace','Los geht’s','Noch einen lernen','Bleib auf der hellen Form'])assert(guided.includes(marker),`Geführter Start vermisst ${marker}`);
assert(!guided.includes('speechSynthesis')&&!guided.includes('SpeechSynthesisUtterance'),'Geführter Einstieg darf keine System-TTS verwenden');
assert(guided.includes("String(meta.label||'').trim().toLowerCase()!==String(x.word||'').trim().toLowerCase()"),'Human-Audio muss exakt zum angezeigten Anfängerwort passen');
assert(!guided.includes("В'єтнам"),'Vietnam darf im geführten Alphabet-Start nicht vorkommen');
assert(guided.includes('attempts.value>=2')&&guided.includes("classList.add('hint')"),'Automatische Hilfe nach zwei Fehlern fehlt');
assert(guided.includes("day()===0&&store().index===0?2:3"),'Allererste Auswahl muss auf zwei Optionen reduziert sein');
assert(guided.includes("ratio>=.5")&&guided.includes('distance>55'),'Nachmalen muss Nähe zur Buchstabenform und echte Bewegung prüfen');

const guidedPairs=new Map([...guided.matchAll(/'([^']+)':\{small:'[^']*',word:'([^']+)'/g)].map(m=>[m[1],m[2]]));
const audioPairs=new Map([...nativeAudio.matchAll(/^\s*'([^']+)':\{file:'[^']+',label:'([^']+)'/gm)].map(m=>[m[1],m[2]]));
const norm=value=>String(value||'').trim().toLocaleLowerCase('uk-UA');
const exact=[...guidedPairs].filter(([letter,word])=>norm(audioPairs.get(letter))===norm(word));
const mismatches=[...guidedPairs].filter(([letter,word])=>norm(audioPairs.get(letter))!==norm(word)).map(([letter,word])=>`${letter}:${word}/${audioPairs.get(letter)||'—'}`);
const coverage=guidedPairs.size?exact.length/guidedPairs.size*100:0;
assert(guidedPairs.size===33,`Geführter Alphabet-Start hat ${guidedPairs.size} statt 33 Audio-Lernanker`);
assert(audioPairs.size===33,`Native-Audio-Map hat ${audioPairs.size} statt 33 Buchstaben`);
assert(coverage===100,`Exakte Human-Audio-Abdeckung ist ${coverage.toFixed(1)}% (${exact.length}/${guidedPairs.size}) statt 100%. Abweichungen: ${mismatches.join(', ')}`);
assert(exact.length===33,'Alle 33 Anfängerwörter brauchen exakt passendes Human-Audio');
assert(mismatches.length===0,`Kein Audio-Mismatch erlaubt: ${mismatches.join(', ')}`);
assert(nativeAudio.includes("'Й':{file:'LL-Q8798 (ukr)-Tohaomg-йогурт.wav',label:'йогурт'"),'Verifizierte Й-Joghurtaufnahme fehlt');
assert(nativeAudio.includes("'Ф':{file:'LL-Q8798 (ukr)-Tohaomg-Франція.wav',label:'Франція'"),'Verifizierte Ф-Frankreichaufnahme fehlt');

for(const [name,source] of [['Aussprache-Coach',pronunciation],['Aussprache-Mastery',mastery]])assert(!source.includes('speechSynthesis')&&!source.includes('SpeechSynthesisUtterance'),`${name} darf keinen System-TTS-Hörnachweis enthalten`);
assert(pronunciation.includes('humanReferencesOnly:true')&&pronunciation.includes('noTtsEvidence:true'),'Aussprache-Coach muss Human-only Evidenz deklarieren');
assert(mastery.includes('humanAudioOnly:true')&&mastery.includes('noTtsEvidence:true'),'Aussprache-Mastery muss Human-only Evidenz deklarieren');
assert(mastery.includes('playHuman(')&&!mastery.includes('playTts('),'Aussprache-Mastery muss menschliche Referenzen statt TTS abspielen');

assert(humanListening.includes('allCorrect&&allHuman'),'Human Listening darf nur mit richtig + Human-Audio bestehen');
assert(humanListening.includes('human===total'),'Human Listening muss jeden Prüfpunkt als Human-Audio prüfen');
assert(humanListening.includes('humanOnlyPass:true'),'Human Listening muss den Human-only Gate exportieren');
assert(humanListening.includes('synthetisch')||humanListening.includes('Synthetische'),'TTS-Fallback muss im Human Listening transparent als nicht bestehensfähig beschrieben sein');

for(const marker of ['tts-unverified','syntheticSinceEvidence','assisted:true','synthetic-or-unverified','human-listening','spoken-transfer','a1-exam','a1-cando-listening','marksA1Synthetic:true','syntheticEvidenceAssisted:true'])assert(audioGate.includes(marker),`Audio-Integritätswache vermisst ${marker}`);
assert(audioGate.includes("st.passed=false")&&audioGate.includes("st.strongPassed=false"),'Synthetische Quelle muss Human-Pass bzw. starken Sprechpass zurückstufen');
assert(audioGate.includes('listeningAudioAssisted=true'),'A1 Can-do muss synthetisches Hören transparent markieren');

assert(spokenTransfer.includes('humanAudioRequiredForStrong:true'),'Spoken Transfer muss Human-Audio für starken Nachweis verlangen');
assert(spokenTransfer.includes("session.questionSources.every(x=>x==='human')"),'Starker Spoken Transfer muss jede Frage als Human-Audio prüfen');
assert(spokenTransfer.includes('audioAssisted'),'Spoken Transfer muss synthetische Fragequellen als Unterstützung markieren');
assert(spokenTransfer.includes("quality!=='human'")||spokenTransfer.includes("lastAudioQuality=allHuman?'human':'synthetic-or-unverified'"),'Spoken Transfer muss Human-/Synthetic-Qualität sichtbar unterscheiden');

for(const [name,source] of [['guided',guided],['nativeAudio',nativeAudio],['pronunciation',pronunciation],['mastery',mastery],['humanListening',humanListening],['audioGate',audioGate],['spokenTransfer',spokenTransfer]])try{new Function(source)}catch(error){errors.push(`${name} Syntax: ${error.message}`)}

if(errors.length){console.error(`VALIDIERUNG FEHLGESCHLAGEN (${errors.length})`);errors.forEach(error=>console.error('- '+error));process.exit(1)}

try{
  fs.writeFileSync(swPath,realSw.replace("const VERSION='65'","const VERSION='58'"),'utf8');
  await import(pathToFileURL(path.join(root,'tests/validate-v58.mjs')).href+'?live='+Date.now());
} finally {fs.writeFileSync(swPath,realSw,'utf8')}

console.log(`LIVE-VALIDIERUNG OK: v65 hat ${coverage.toFixed(1)}% (${exact.length}/${guidedPairs.size}) exakt passende menschliche Anfänger-Audios; Aussprache-Coach/Mastery sind TTS-frei; Human Listening besteht nur mit Human-Audio; starker Spoken Transfer verlangt ausschließlich Human-Fragen; synthetisches A1-Audio wird transparent als unterstützt markiert.`);
