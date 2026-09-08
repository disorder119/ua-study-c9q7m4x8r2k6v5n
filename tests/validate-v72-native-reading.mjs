import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

const root=process.cwd(),read=p=>fs.readFileSync(path.join(root,p),'utf8'),errors=[];
const assert=(c,m)=>{if(!c)errors.push(m)};
const swPath=path.join(root,'ukrainisch-lernen-sw.js'),sw=read('ukrainisch-lernen-sw.js'),loader=read('ukrainischkurs-v2-loader.js'),guard=read('ukrainischkurs-native-reading-guard.js');

assert(sw.includes("const VERSION='72'"),'PWA-Cache ist nicht v72');
assert(sw.includes("'./ukrainischkurs-native-reading-guard.js'"),'Native Reading Guard fehlt im Offline-Cache');
assert(loader.includes("./ukrainischkurs-native-reading-guard.js?v=1"),'Loader lädt Native Reading Guard nicht');
assert(loader.indexOf('professional-path.js?v=2')<loader.indexOf('native-reading-guard.js?v=1'),'Native Reading Guard muss nach Professional Path v2 laden');
for(const marker of ['startsAfterAlphabet:true','alphabetDays:ALPHABET_DAYS','romanizationHidden:true','directCyrillicReading:true','doesNotHideAudio:true','doesNotChangeLessonData:true',"ALPHABET_DAYS=14","#cards .trans,#cards details.pronunciation,#proPronunciation","classList.remove('pro-translit-on')"])assert(guard.includes(marker),`Native Reading Guard vermisst ${marker}`);
assert(!guard.includes('speechSynthesis')&&!guard.includes('SpeechSynthesisUtterance'),'Native Reading Guard darf keine Ersatz-TTS hinzufügen');
assert(!guard.includes('D.push(')&&!guard.includes('D.splice('),'Native Reading Guard darf Lektionen nicht verändern');
try{new Function(guard)}catch(e){errors.push('Native Reading Guard Syntax: '+e.message)}
if(errors.length){console.error(`V72 NATIVE READING VALIDIERUNG FEHLGESCHLAGEN (${errors.length})`);errors.forEach(e=>console.error('- '+e));process.exit(1)}
try{
  fs.writeFileSync(swPath,sw.replace("const VERSION='72'","const VERSION='71'"),'utf8');
  await import(pathToFileURL(path.join(root,'tests/validate-v71-professional.mjs')).href+'?v72='+Date.now());
}finally{fs.writeFileSync(swPath,sw,'utf8')}
console.log('V72 NATIVE READING VALIDIERUNG OK: Nach dem Alphabet wird Romanisierung aus dem Hauptlernweg entfernt; Professional Path v2 und alle historischen Schutzregeln bleiben erhalten.');
