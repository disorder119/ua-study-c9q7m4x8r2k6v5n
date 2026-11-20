import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';

export const CORE_SOURCES=['alphabet-core-v3-data.js','alphabet-core-v3-model.js','alphabet-core-v3-exam.js','alphabet-wordbank-v4.js','alphabet-core-v4-model-a.js','alphabet-core-v4-model-b.js','alphabet-core-v4-tasks-a.js','alphabet-core-v4-tasks-b.js','alphabet-core-v4-selector-a.js','alphabet-core-v4-selector-b.js','alphabet-core-v4-hardening.js','alphabet-core-v4-completion.js','alphabet-core-v5-production-model.js','alphabet-core-v5-production-tasks.js','alphabet-core-v5-production-state.js','alphabet-core-v5-production-repairs.js','alphabet-core-v5-progression.js','alphabet-core-v6-hardening.js','alphabet-core-v6-question-fixes.js','alphabet-core-v62-question-integrity.js','alphabet-core-v63-retrieval.js','alphabet-core-v4-export.js'];
export const APP_SOURCES=['alphabet-app-v3-shell.js','alphabet-app-v3-exam.js','alphabet-app-v3-ui.js','alphabet-app-v4-style.js','alphabet-app-v4-a.js','alphabet-app-v4-b.js','alphabet-app-v4-c.js','alphabet-app-v4-d.js','alphabet-app-v4-completion.js','alphabet-app-v5-production-ui.js','alphabet-app-v5-production-session.js','alphabet-app-v5-production-repairs.js','alphabet-app-v6-media.js','alphabet-app-v6-question-fixes.js','alphabet-app-v6-word-examples.js','alphabet-app-v6-runtime.js','alphabet-app-v62-pwa.js','alphabet-app-v63-retrieval.js','alphabet-app-v4-init.js'];
// Der Lernpfad ist ein eigenes Bundle: Daten, Logik und Oberfläche. Er wird nach
// dem App-Bundle geladen und hängt sich in dessen Startseite ein; fehlt er, läuft
// die App mit der bisherigen Startseite weiter.
export const PATH_SOURCES=['alphabet-path-data.js','alphabet-core-v7-path.js','alphabet-core-v7-review.js','alphabet-app-v7-trace.js','alphabet-app-v7-path.js'];
export const APP_VERSION='6.1.0';
export const STATE_SCHEMA_VERSION=6;
export const AGGREGATE_SCHEMA_VERSION=2;
// Statische Dateien, die unverändert ausgeliefert werden, aber die Build-ID bestimmen.
export const SOURCE_ONLY=['alphabet-lab.template.html','alphabet-lab-sw.template.js','alphabet-lab.webmanifest','ukrainischkurs-native-audio.js','scripts/build-alphabet-lab.mjs'];
const normalize=s=>String(s).replace(/\r\n/g,'\n').replace(/\s+$/,'')+'\n';
export const digest=text=>crypto.createHash('sha256').update(text).digest('hex');
function rootFromArgs(argv=process.argv.slice(2)){const arg=argv.find(x=>x.startsWith('--root='));return path.resolve(arg?arg.slice(7):process.cwd())}
function read(root,file){return fs.readFileSync(path.join(root,file),'utf8')}
// Kommentar- und Leerzeilen werden nicht ausgeliefert: Sie erklären den Quelltext,
// kosten im Browser aber nur Bytes. Entfernt wird ausschließlich eine Zeile, die
// komplett Kommentar oder leer ist UND im Code beginnt – innerhalb eines
// Template-Literals oder Blockkommentars wäre sie Inhalt. Dafür wird der Quelltext
// einmal durchlaufen: Strings, Regex-Literale, Kommentare und verschachtelte
// Template-Literale (`a${b?`c`:''}`) werden erkannt, damit ein Backtick in einem
// String oder einer Zeichenklasse nichts verschiebt. Endet eine Datei nicht im
// Code, bricht der Build ab, statt zu raten.
const REGEX_AFTER_CHAR=new Set([...'(,=:[!&|?{};+-*%<>~^']),REGEX_AFTER_WORD=new Set(['return','typeof','case','in','of','delete','void','throw','new','else','do','instanceof','yield','await']);
function regexAllowedAt(source,index){
  let i=index-1;
  while(i>=0&&(source[i]===' '||source[i]==='\t'||source[i]==='\n'))i--;
  if(i<0)return true;
  if(REGEX_AFTER_CHAR.has(source[i]))return true;
  if(!/[\w$]/.test(source[i]))return false;
  let start=i;while(start>0&&/[\w$]/.test(source[start-1]))start--;
  return REGEX_AFTER_WORD.has(source.slice(start,i+1));
}
// Liefert je Zeile, ob sie im Code beginnt (true) oder mitten in einem
// Template-Literal bzw. Blockkommentar (false).
export function linesStartingInCode(source,file='source'){
  const text=String(source),starts=[true],frames=[];
  let mode='code',depth=0,i=0;
  while(i<text.length){
    const ch=text[i];
    if(ch==='\n'){starts.push(mode==='code');i++;continue}
    if(mode==='block'){if(ch==='*'&&text[i+1]==='/'){mode='code';i+=2}else i++;continue}
    if(mode==='template'){
      if(ch==='\\'){i+=2;continue}
      if(ch==='`'){depth=frames.pop().depth;mode='code';i++;continue}
      if(ch==='$'&&text[i+1]==='{'){frames.push({expression:true});depth=0;mode='code';i+=2;continue}
      i++;continue;
    }
    if(ch==='`'){frames.push({depth});mode='template';i++;continue}
    if(ch==='{'){depth++;i++;continue}
    if(ch==='}'){if(depth===0&&frames.at(-1)?.expression){frames.pop();mode='template'}else depth--;i++;continue}
    if(ch==="'"||ch==='"'){i++;while(i<text.length&&text[i]!==ch&&text[i]!=='\n')i+=text[i]==='\\'?2:1;if(text[i]===ch)i++;continue}
    if(ch==='/'&&text[i+1]==='/'){while(i<text.length&&text[i]!=='\n')i++;continue}
    if(ch==='/'&&text[i+1]==='*'){mode='block';i+=2;continue}
    if(ch==='/'&&regexAllowedAt(text,i)){
      // Ein Regex-Literal endet in derselben Zeile; sonst war es eine Division.
      let j=i+1,inClass=false,closed=false;
      while(j<text.length&&text[j]!=='\n'){
        if(text[j]==='\\'){j+=2;continue}
        if(text[j]==='[')inClass=true;else if(text[j]===']')inClass=false;else if(text[j]==='/'&&!inClass){closed=true;break}
        j++;
      }
      i=closed?j+1:i+1;continue;
    }
    i++;
  }
  if(mode!=='code'||frames.length)throw new Error(`${file}: Quelltext endet nicht im Code (${mode}) – Kommentarzeilen können nicht sicher entfernt werden`);
  return starts;
}
// Zeilen, die im Code beginnen, verlieren außerdem ihre Einrückung – dort ist sie
// bedeutungslos. Zeilen innerhalb eines Template-Literals bleiben Byte für Byte.
export function stripCommentLines(source,file='source'){
  const lines=String(source).split('\n'),inCode=linesStartingInCode(source,file);
  return lines.map((line,index)=>inCode[index]?line.replace(/^[ \t]+/,''):line).filter((line,index)=>!(inCode[index]&&/^(\/\/.*)?$/.test(line))).join('\n')+'\n';
}
export function buildBundle(files,label,root=process.cwd()){return `'use strict';\n/* ${label} · generated deterministically */\n`+files.map(file=>`\n/* source: ${file} */\n${stripCommentLines(normalize(read(root,file)),file)}`).join('')}
function sourceSeed(root){return [...CORE_SOURCES,...APP_SOURCES,...PATH_SOURCES,...SOURCE_ONLY].map(file=>`\n--- ${file} ---\n${normalize(read(root,file))}`).join('')}
export function computeOutputs(root=process.cwd()){
  const core=buildBundle(CORE_SOURCES,'Alphabet Lab V6.1 core bundle',root),app=buildBundle(APP_SOURCES,'Alphabet Lab V6.1 app bundle',root),learningPath=buildBundle(PATH_SOURCES,'Alphabet Lab V7 learning path bundle',root),buildId=digest(sourceSeed(root)).slice(0,12);
  const html=normalize(read(root,'alphabet-lab.template.html').replaceAll('__BUILD_ID__',buildId)),sw=normalize(read(root,'alphabet-lab-sw.template.js').replaceAll('__BUILD_ID__',buildId));
  const metadata={appVersion:APP_VERSION,schemaVersion:STATE_SCHEMA_VERSION,aggregateSchemaVersion:AGGREGATE_SCHEMA_VERSION,buildId,bundles:{core:{file:'alphabet-core.bundle.js',sha256:digest(core),bytes:Buffer.byteLength(core)},app:{file:'alphabet-app.bundle.js',sha256:digest(app),bytes:Buffer.byteLength(app)},path:{file:'alphabet-path.bundle.js',sha256:digest(learningPath),bytes:Buffer.byteLength(learningPath)}},artifacts:{htmlSha256:digest(html),serviceWorkerSha256:digest(sw)}};
  return {buildId,files:{'alphabet-core.bundle.js':core,'alphabet-app.bundle.js':app,'alphabet-path.bundle.js':learningPath,'alphabet-lab.html':html,'alphabet-lab-sw.js':sw,'alphabet-build.json':JSON.stringify(metadata,null,2)+'\n'}};
}
export function verifyOutputs(root=process.cwd(),{log=true}={}){let bad=false;const built=computeOutputs(root);for(const [file,content] of Object.entries(built.files)){const target=path.join(root,file),current=fs.existsSync(target)?fs.readFileSync(target,'utf8'):'';if(current!==content){if(log)console.error(`${file} is stale or missing`);bad=true}else if(log)console.log(`${file} OK ${digest(content).slice(0,12)}`)}return {ok:!bad,buildId:built.buildId}}
export function writeOutputs(root=process.cwd(),{log=true}={}){const built=computeOutputs(root);for(const [file,content] of Object.entries(built.files)){fs.writeFileSync(path.join(root,file),content);if(log)console.log(`built ${file} ${Buffer.byteLength(content)} bytes ${digest(content).slice(0,12)}`)}return built}

const invoked=process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url);
if(invoked){const root=rootFromArgs(),check=process.argv.includes('--check');if(check){const result=verifyOutputs(root);if(!result.ok)process.exit(1)}else writeOutputs(root)}
