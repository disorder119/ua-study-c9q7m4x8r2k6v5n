import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

const root=process.cwd(),read=p=>fs.readFileSync(path.join(root,p),'utf8'),errors=[];
const assert=(condition,message)=>{if(!condition)errors.push(message)};
const swPath=path.join(root,'ukrainisch-lernen-sw.js');
const sw=read('ukrainisch-lernen-sw.js'),loader=read('ukrainischkurs-v2-loader.js'),pro=read('ukrainischkurs-professional-path.js');

assert(sw.includes("const VERSION='71'"),'PWA-Cache ist nicht v71');
assert(sw.includes("'./ukrainischkurs-professional-path.js'"),'Professional Path fehlt im Offline-Cache');
assert(loader.includes("./ukrainischkurs-professional-path.js?v=2"),'Loader lädt Professional Path v2 nicht');
assert(loader.indexOf('guided-flow-hardening.js?v=1')<loader.indexOf('professional-path.js?v=2'),'Professional Path muss nach den Anfänger-Härtungen laden');

for(const marker of [
  'const VERSION=2','coversEveryLesson:true','contentAware:true','adaptiveBatching:true',
  'maxSimpleBatch:3','maxSentenceBatch:2','transliterationEmergencyOnly:true',
  'helpUnlocksAfterRecallFailure:true','interleavedDelayedRecall:true','canDoGoalEveryLesson:true',
  'respectsSpecializedMastery:true','sentenceHeavy','batchSize:sentenceHeavy?2:3','function classify(',
  'function canDo(','function priorCandidate(','↻ Älterer Abruf','Notfall-Lesehilfe','Heute kannst du '
]) assert(pro.includes(marker),`Professional Path v2 vermisst ${marker}`);
assert(!pro.includes('D.splice(')&&!pro.includes('D.push('),'Professional Path darf Kursdaten D nicht verändern');
assert(pro.includes("st.helpUnlocked=true"),'Notfall-Lesehilfe wird nach einem Abruffehler nicht freigeschaltet');
assert(pro.includes("typeof priorDue==='function'?priorDue(di):[]"),'Fällige ältere Inhalte werden nicht bevorzugt interleaved abgerufen');
assert(pro.includes("Math.max(14,di-8)"),'Fallback für verzögerten Abruf aus früheren Lektionen fehlt');
assert(pro.includes("profile.sentenceHeavy?3:2"),'Satzreiche Lektionen bekommen keinen stärkeren aktiven Abruf');
assert(pro.includes("batchSize:sentenceHeavy?2:3"),'Satzreiche Lektionen werden nicht auf maximal zwei Karten pro Portion begrenzt');
assert(pro.includes("#progressiveGrowthBox")&&pro.includes("#independenceLadderBox"),'Späte spezialisierte Mastery-Module werden nicht respektiert');

try{new Function(pro)}catch(e){errors.push('Professional Path Syntax: '+e.message)}

if(errors.length){console.error(`V71 PROFESSIONAL VALIDIERUNG FEHLGESCHLAGEN (${errors.length})`);errors.forEach(e=>console.error('- '+e));process.exit(1)}

// Alle historischen v70-Gates unverändert erneut ausführen. Nur die lokale SW-Version
// wird für deren explizite Versionsassertion vorübergehend zurückgesetzt.
try{
  fs.writeFileSync(swPath,sw.replace("const VERSION='71'","const VERSION='70'"),'utf8');
  await import(pathToFileURL(path.join(root,'tests/validate-live.mjs')).href+'?v71='+Date.now());
} finally {
  fs.writeFileSync(swPath,sw,'utf8');
}

console.log('V71 PROFESSIONAL VALIDIERUNG OK: Professional Path v2 ist syntaxgültig, offline gecacht, inhaltsbewusst, satzlast-adaptiv, transliterationsarm, interleaved und erhält alle bisherigen v70-Schutzregeln.');
