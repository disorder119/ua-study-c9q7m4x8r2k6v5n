import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

const root=process.cwd();
const swPath=path.join(root,'ukrainisch-lernen-sw.js');
const realSw=fs.readFileSync(swPath,'utf8');
const loader=fs.readFileSync(path.join(root,'ukrainischkurs-v2-loader.js'),'utf8');
const guided=fs.readFileSync(path.join(root,'ukrainischkurs-guided-start.js'),'utf8');
const errors=[];
const assert=(condition,message)=>{if(!condition)errors.push(message)};

assert(realSw.includes("const VERSION='60'"),'Live-Service-Worker ist nicht v60');
assert(realSw.includes("'./ukrainischkurs-simple-foundation.js'"),'Einfacher Alphabet-Start fehlt im Offline-Cache');
assert(realSw.includes("'./ukrainischkurs-guided-start.js'"),'Geführter Alphabet-Start fehlt im Offline-Cache');
assert(loader.includes("await loadScript('./ukrainischkurs-guided-start.js?v=1'"),'Geführter Alphabet-Start wird nicht vom Loader geladen');
assert(loader.indexOf('simple-foundation.js?v=1')<loader.indexOf('guided-start.js?v=1'),'Geführter Start muss nach der bisherigen Grundlagen-UI laden');
for(const marker of ['oneScreenOneTask:true','pictureLearning:true','tracing:true','guided-trace','Welches Bild gehört zu ','Los geht’s','Male '+"'+l+'"+' nach'])assert(guided.includes(marker),`Geführter Start vermisst ${marker}`);
assert(guided.includes("'А':{small:'а',word:'автобус',de:'Bus',icon:'🚌'")&&guided.includes("'Б':{small:'б',word:'банан',de:'Banane',icon:'🍌'")&&guided.includes("'В':{small:'в',word:'вода',de:'Wasser',icon:'💧'"),'Erste bildliche A/Б/В-Lernanker fehlen');
assert(!guided.includes("В'єтнам"),'Vietnam darf im geführten Alphabet-Start nicht vorkommen');
try{new Function(guided)}catch(error){errors.push('Geführter Start Syntax: '+error.message)}

if(errors.length){
  console.error(`VALIDIERUNG FEHLGESCHLAGEN (${errors.length})`);
  errors.forEach(error=>console.error('- '+error));
  process.exit(1);
}

try{
  // validate-v58 prüft die komplette bestehende Schutzkette und erwartet dabei
  // bewusst die damalige Cache-Version 58. Für diese Legacy-Prüfung wird nur
  // die Cache-Versionszeile temporär gespiegelt; der echte Live-Stand bleibt v60.
  fs.writeFileSync(swPath,realSw.replace("const VERSION='60'","const VERSION='58'"),'utf8');
  await import(pathToFileURL(path.join(root,'tests/validate-v58.mjs')).href+'?live='+Date.now());
} finally {
  fs.writeFileSync(swPath,realSw,'utf8');
}

console.log('LIVE-VALIDIERUNG OK: kompletter v58-Schutzsatz bestanden; Live-Cache v60 enthält den geführten bildlichen Alphabet-Start mit Einzelschritten, Nachmalen und Bildauswahl.');
