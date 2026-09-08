import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

const root=process.cwd(),read=p=>fs.readFileSync(path.join(root,p),'utf8'),errors=[];
const assert=(c,m)=>{if(!c)errors.push(m)};
const swPath=path.join(root,'ukrainisch-lernen-sw.js'),sw=read('ukrainisch-lernen-sw.js'),loader=read('ukrainischkurs-v2-loader.js'),polish=read('ukrainischkurs-linguistic-polish.js');
assert(sw.includes("const VERSION='73'"),'PWA-Cache ist nicht v73');
assert(sw.includes("'./ukrainischkurs-linguistic-polish.js'"),'Linguistic Polish fehlt im Offline-Cache');
assert(loader.includes("./ukrainischkurs-linguistic-polish.js?v=1"),'Loader lädt Linguistic Polish nicht');
assert(loader.indexOf('guided-flow-hardening.js?v=1')<loader.indexOf('linguistic-polish.js?v=1')&&loader.indexOf('linguistic-polish.js?v=1')<loader.indexOf('professional-path.js?v=2'),'Linguistic Polish muss vor dem Professional Path auf die finalen Kursdaten wirken');
for(const marker of ['verifiedCorrectionsOnly:true','naturalBeginnerGreetings:true','progressResetOnChangedCard:true',"card[0]='Добрий день'","card[1]='Guten Tag / Hallo'","startsWith('Вітаю!')","d.answer='Привіт!"])assert(polish.includes(marker),`Linguistic Polish vermisst ${marker}`);
assert(polish.includes("delete s.known[key]"),'Geänderter Lerninhalt übernimmt fälschlich alten Karten-Mastery-Status');
try{new Function(polish)}catch(e){errors.push('Linguistic Polish Syntax: '+e.message)}
if(errors.length){console.error(`V73 LINGUISTIC VALIDIERUNG FEHLGESCHLAGEN (${errors.length})`);errors.forEach(e=>console.error('- '+e));process.exit(1)}
try{fs.writeFileSync(swPath,sw.replace("const VERSION='73'","const VERSION='72'"),'utf8');await import(pathToFileURL(path.join(root,'tests/validate-v72-native-reading.mjs')).href+'?v73='+Date.now())}finally{fs.writeFileSync(swPath,sw,'utf8')}
console.log('V73 LINGUISTIC VALIDIERUNG OK: Frühe Begrüßung nutzt natürliches Привіт / Добрий день, geänderte Karten erben keinen falschen Mastery-Status, Native Reading und alle früheren Gates bleiben aktiv.');
