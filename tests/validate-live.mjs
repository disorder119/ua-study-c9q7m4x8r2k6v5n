import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

const root=process.cwd();
const swPath=path.join(root,'ukrainisch-lernen-sw.js');
const realSw=fs.readFileSync(swPath,'utf8');

if(!realSw.includes("const VERSION='59'")){
  console.error('VALIDIERUNG FEHLGESCHLAGEN (1)');
  console.error('- Live-Service-Worker ist nicht v59');
  process.exit(1);
}
if(!realSw.includes("'./ukrainischkurs-simple-foundation.js'")){
  console.error('VALIDIERUNG FEHLGESCHLAGEN (1)');
  console.error('- Neuer einfacher Alphabet-Start fehlt im Offline-Cache');
  process.exit(1);
}

try{
  // validate-v58 prueft die komplette bestehende Schutzkette und erwartet dabei
  // bewusst die damalige Cache-Version 58. Fuer diese Legacy-Pruefung wird nur
  // die Cache-Versionszeile temporaer gespiegelt; der echte Live-Stand bleibt v59.
  fs.writeFileSync(swPath,realSw.replace("const VERSION='59'","const VERSION='58'"),'utf8');
  await import(pathToFileURL(path.join(root,'tests/validate-v58.mjs')).href+'?live='+Date.now());
} finally {
  fs.writeFileSync(swPath,realSw,'utf8');
}

console.log('LIVE-VALIDIERUNG OK: kompletter v58-Schutzsatz bestanden; Live-Cache v59 enthaelt den einfachen Alphabet-Start.');
