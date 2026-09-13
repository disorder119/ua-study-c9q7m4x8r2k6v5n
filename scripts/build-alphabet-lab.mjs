import fs from 'node:fs';
import crypto from 'node:crypto';

export const CORE_SOURCES=[
  'alphabet-core-v3-data.js','alphabet-core-v3-model.js','alphabet-core-v3-exam.js','alphabet-wordbank-v4.js',
  'alphabet-core-v4-model-a.js','alphabet-core-v4-model-b.js','alphabet-core-v4-tasks-a.js','alphabet-core-v4-tasks-b.js',
  'alphabet-core-v4-selector-a.js','alphabet-core-v4-selector-b.js','alphabet-core-v4-hardening.js','alphabet-core-v4-completion.js',
  'alphabet-core-v5-production-model.js','alphabet-core-v5-production-tasks.js','alphabet-core-v5-production-state.js','alphabet-core-v5-production-repairs.js','alphabet-core-v5-progression.js',
  'alphabet-core-v6-hardening.js','alphabet-core-v4-export.js'
];
export const APP_SOURCES=[
  'alphabet-app-v3-shell.js','alphabet-app-v3-exam.js','alphabet-app-v3-ui.js','alphabet-app-v4-style.js','alphabet-app-v4-a.js','alphabet-app-v4-b.js','alphabet-app-v4-c.js','alphabet-app-v4-d.js','alphabet-app-v4-completion.js',
  'alphabet-app-v5-production-ui.js','alphabet-app-v5-production-session.js','alphabet-app-v5-production-repairs.js','alphabet-app-v6-runtime.js','alphabet-app-v4-init.js'
];
const normalize=s=>s.replace(/\r\n/g,'\n').replace(/\s+$/,'')+'\n';
export function buildBundle(files,label){return `'use strict';\n/* ${label} · generated deterministically by scripts/build-alphabet-lab.mjs */\n`+files.map(file=>`\n/* source: ${file} */\n${normalize(fs.readFileSync(file,'utf8'))}`).join('')}
export function outputs(){return {'alphabet-core.bundle.js':buildBundle(CORE_SOURCES,'Alphabet Lab core bundle'),'alphabet-app.bundle.js':buildBundle(APP_SOURCES,'Alphabet Lab app bundle')}}
export function digest(text){return crypto.createHash('sha256').update(text).digest('hex')}
const check=process.argv.includes('--check');let bad=false;
for(const [file,content] of Object.entries(outputs())){if(check){const current=fs.existsSync(file)?fs.readFileSync(file,'utf8'):'';if(current!==content){console.error(`${file} is stale or missing`);bad=true}else console.log(`${file} OK ${digest(content).slice(0,12)}`)}else{fs.writeFileSync(file,content);console.log(`built ${file} ${Buffer.byteLength(content)} bytes ${digest(content).slice(0,12)}`)}}
if(bad)process.exit(1);
