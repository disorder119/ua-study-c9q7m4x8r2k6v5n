import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';

export const CORE_SOURCES=['alphabet-core-v3-data.js','alphabet-core-v3-model.js','alphabet-core-v3-exam.js','alphabet-wordbank-v4.js','alphabet-core-v4-model-a.js','alphabet-core-v4-model-b.js','alphabet-core-v4-tasks-a.js','alphabet-core-v4-tasks-b.js','alphabet-core-v4-selector-a.js','alphabet-core-v4-selector-b.js','alphabet-core-v4-hardening.js','alphabet-core-v4-completion.js','alphabet-core-v5-production-model.js','alphabet-core-v5-production-tasks.js','alphabet-core-v5-production-state.js','alphabet-core-v5-production-repairs.js','alphabet-core-v5-progression.js','alphabet-core-v6-hardening.js','alphabet-core-v6-question-fixes.js','alphabet-core-v62-question-integrity.js','alphabet-core-v63-retrieval.js','alphabet-core-v4-export.js'];
export const APP_SOURCES=['alphabet-app-v3-shell.js','alphabet-app-v3-exam.js','alphabet-app-v3-ui.js','alphabet-app-v4-style.js','alphabet-app-v4-a.js','alphabet-app-v4-b.js','alphabet-app-v4-c.js','alphabet-app-v4-d.js','alphabet-app-v4-completion.js','alphabet-app-v5-production-ui.js','alphabet-app-v5-production-session.js','alphabet-app-v5-production-repairs.js','alphabet-app-v6-media.js','alphabet-app-v6-question-fixes.js','alphabet-app-v6-word-examples.js','alphabet-app-v6-runtime.js','alphabet-app-v62-pwa.js','alphabet-app-v63-retrieval.js','alphabet-app-v4-init.js'];
export const APP_VERSION='6.1.0';
export const STATE_SCHEMA_VERSION=6;
export const AGGREGATE_SCHEMA_VERSION=2;
const SOURCE_ONLY=['alphabet-lab.template.html','alphabet-lab-sw.template.js','alphabet-lab.webmanifest','ukrainischkurs-native-audio.js','scripts/build-alphabet-lab.mjs'];
const normalize=s=>String(s).replace(/\r\n/g,'\n').replace(/\s+$/,'')+'\n';
export const digest=text=>crypto.createHash('sha256').update(text).digest('hex');
function rootFromArgs(argv=process.argv.slice(2)){const arg=argv.find(x=>x.startsWith('--root='));return path.resolve(arg?arg.slice(7):process.cwd())}
function read(root,file){return fs.readFileSync(path.join(root,file),'utf8')}
export function buildBundle(files,label,root=process.cwd()){return `'use strict';\n/* ${label} · generated deterministically */\n`+files.map(file=>`\n/* source: ${file} */\n${normalize(read(root,file))}`).join('')}
function sourceSeed(root){return [...CORE_SOURCES,...APP_SOURCES,...SOURCE_ONLY].map(file=>`\n--- ${file} ---\n${normalize(read(root,file))}`).join('')}
export function computeOutputs(root=process.cwd()){
  const core=buildBundle(CORE_SOURCES,'Alphabet Lab V6.1 core bundle',root),app=buildBundle(APP_SOURCES,'Alphabet Lab V6.1 app bundle',root),buildId=digest(sourceSeed(root)).slice(0,12);
  const html=normalize(read(root,'alphabet-lab.template.html').replaceAll('__BUILD_ID__',buildId)),sw=normalize(read(root,'alphabet-lab-sw.template.js').replaceAll('__BUILD_ID__',buildId));
  const metadata={appVersion:APP_VERSION,schemaVersion:STATE_SCHEMA_VERSION,aggregateSchemaVersion:AGGREGATE_SCHEMA_VERSION,buildId,bundles:{core:{file:'alphabet-core.bundle.js',sha256:digest(core),bytes:Buffer.byteLength(core)},app:{file:'alphabet-app.bundle.js',sha256:digest(app),bytes:Buffer.byteLength(app)}},artifacts:{htmlSha256:digest(html),serviceWorkerSha256:digest(sw)}};
  return {buildId,files:{'alphabet-core.bundle.js':core,'alphabet-app.bundle.js':app,'alphabet-lab.html':html,'alphabet-lab-sw.js':sw,'alphabet-build.json':JSON.stringify(metadata,null,2)+'\n'}};
}
export function verifyOutputs(root=process.cwd(),{log=true}={}){let bad=false;const built=computeOutputs(root);for(const [file,content] of Object.entries(built.files)){const target=path.join(root,file),current=fs.existsSync(target)?fs.readFileSync(target,'utf8'):'';if(current!==content){if(log)console.error(`${file} is stale or missing`);bad=true}else if(log)console.log(`${file} OK ${digest(content).slice(0,12)}`)}return {ok:!bad,buildId:built.buildId}}
export function writeOutputs(root=process.cwd(),{log=true}={}){const built=computeOutputs(root);for(const [file,content] of Object.entries(built.files)){fs.writeFileSync(path.join(root,file),content);if(log)console.log(`built ${file} ${Buffer.byteLength(content)} bytes ${digest(content).slice(0,12)}`)}return built}

const invoked=process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url);
if(invoked){const root=rootFromArgs(),check=process.argv.includes('--check');if(check){const result=verifyOutputs(root);if(!result.ok)process.exit(1)}else writeOutputs(root)}
