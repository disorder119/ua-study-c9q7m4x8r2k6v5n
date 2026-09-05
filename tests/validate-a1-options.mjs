import fs from 'node:fs';
const src=fs.readFileSync('ukrainischkurs-a1-exam.js','utf8');
const fail=msg=>{console.error('A1-OPTIONS-REGRESSION: '+msg);process.exit(1)};
if(src.includes("[...new Set([answer,...others])].sort(()=>r()-.5).slice(0,4)"))fail('Unsichere Auswahl kann die richtige Antwort wieder entfernen.');
for(const token of ["others.filter(x=>x!==answer)",".slice(0,3)","return [answer,...distractors].sort(()=>r()-.5)"]){
  if(!src.includes(token))fail('Sichere options()-Invariante fehlt: '+token);
}
console.log('A1-OPTIONS OK: richtige Antwort bleibt garantiert enthalten, maximal drei Distraktoren werden ergänzt.');
