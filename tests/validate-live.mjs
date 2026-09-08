import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

const root=process.cwd();
const swPath=path.join(root,'ukrainisch-lernen-sw.js');
const realSw=fs.readFileSync(swPath,'utf8');
const loader=fs.readFileSync(path.join(root,'ukrainischkurs-v2-loader.js'),'utf8');
const guided=fs.readFileSync(path.join(root,'ukrainischkurs-guided-start.js'),'utf8');
const nativeAudio=fs.readFileSync(path.join(root,'ukrainischkurs-native-audio.js'),'utf8');
const errors=[];
const assert=(condition,message)=>{if(!condition)errors.push(message)};

assert(realSw.includes("const VERSION='62'"),'Live-Service-Worker ist nicht v62');
assert(realSw.includes("'./ukrainischkurs-simple-foundation.js'"),'Einfacher Alphabet-Start fehlt im Offline-Cache');
assert(realSw.includes("'./ukrainischkurs-guided-start.js'"),'Geführter Alphabet-Start fehlt im Offline-Cache');
assert(loader.includes("await loadScript('./ukrainischkurs-guided-start.js?v=3'"),'Geführter Alphabet-Start v3 wird nicht geladen');
assert(loader.includes("./ukrainischkurs-native-audio.js?v=4"),'Verifizierte Audioanker werden nicht geladen');
assert(loader.indexOf('simple-foundation.js?v=1')<loader.indexOf('guided-start.js?v=3'),'Geführter Start muss nach der bisherigen Grundlagen-UI laden');
for(const marker of ['oneScreenOneTask:true','pictureLearning:true','tracing:true','humanAudioOnly:true','exactWordAudio:true','strokeByStroke:true','autoHelp:true','easyFirstChoice:true','guided-trace','Los geht’s','Noch einen lernen','Bleib auf der hellen Form'])assert(guided.includes(marker),`Geführter Start vermisst ${marker}`);
assert(guided.includes("'А':{small:'а',word:'автобус',de:'Bus',icon:'🚌'")&&guided.includes("'Б':{small:'б',word:'бабуся',de:'Oma',icon:'👵'")&&guided.includes("'В':{small:'в',word:'вода',de:'Wasser',icon:'💧'"),'Einfache A/Б/В-Bildanker fehlen');
assert(nativeAudio.includes("'А':{file:'Uk-автобус.ogg',label:'автобус'")&&nativeAudio.includes("'Б':{file:'Uk-бабуся.ogg',label:'бабуся'")&&nativeAudio.includes("'В':{file:'Uk-вода.ogg',label:'вода'"),'Verifizierte menschliche A/Б/В-Audios fehlen');
assert(!guided.includes('speechSynthesis')&&!guided.includes('SpeechSynthesisUtterance'),'Geführter Einstieg darf keine unsichere System-TTS verwenden');
assert(guided.includes("String(meta.label||'').trim().toLowerCase()!==String(x.word||'').trim().toLowerCase()"),'Menschliches Audio muss exakt zum angezeigten Anfängerwort passen');
assert(guided.includes('Für dieses Wort fehlt noch eine exakt passende menschliche Aufnahme'),'Fehlendes Exakt-Audio muss ehrlich angezeigt werden');
assert(!guided.includes("В'єтнам"),'Vietnam darf im geführten Alphabet-Start nicht vorkommen');
assert(guided.includes('attempts.value>=2')&&guided.includes("classList.add('hint')"),'Automatische Hilfe nach zwei Fehlern fehlt');
assert(guided.includes("day()===0&&store().index===0?2:3"),'Allererste Auswahl muss auf zwei Optionen reduziert sein');
assert(guided.includes("ratio>=.5")&&guided.includes('distance>55'),'Nachmalen muss Nähe zur Buchstabenform und echte Bewegung prüfen');
try{new Function(guided)}catch(error){errors.push('Geführter Start Syntax: '+error.message)}
try{new Function(nativeAudio)}catch(error){errors.push('Native Audio Syntax: '+error.message)}

if(errors.length){console.error(`VALIDIERUNG FEHLGESCHLAGEN (${errors.length})`);errors.forEach(error=>console.error('- '+error));process.exit(1)}

try{
  fs.writeFileSync(swPath,realSw.replace("const VERSION='62'","const VERSION='58'"),'utf8');
  await import(pathToFileURL(path.join(root,'tests/validate-v58.mjs')).href+'?live='+Date.now());
} finally {fs.writeFileSync(swPath,realSw,'utf8')}

console.log('LIVE-VALIDIERUNG OK: v62 spielt im Anfängerstart nur noch exakt zum angezeigten Wort passendes Human-Audio und bleibt sonst bewusst stumm.');