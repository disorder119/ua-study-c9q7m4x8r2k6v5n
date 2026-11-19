import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import {computeOutputs,verifyOutputs,writeOutputs,digest,stripCommentLines,CORE_SOURCES,APP_SOURCES,SOURCE_ONLY} from '../scripts/build-alphabet-lab.mjs';

const root=path.resolve(new URL('..',import.meta.url).pathname);
const a=computeOutputs(root),b=computeOutputs(root);
assert.equal(a.buildId,b.buildId,'build ID must be deterministic');
for(const file of Object.keys(a.files))assert.equal(digest(a.files[file]),digest(b.files[file]),`${file} must be byte-identical across repeated builds`);
assert.equal(verifyOutputs(root,{log:false}).ok,true,'checked-in generated artifacts must be current');

const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'alphabet-v61-build-'));
for(const file of ['alphabet-lab.template.html','alphabet-lab-sw.template.js','alphabet-lab.webmanifest','ukrainischkurs-native-audio.js','alphabet-path-data.js','scripts/build-alphabet-lab.mjs'])assert(SOURCE_ONLY.includes(file),`${file} must be part of the build ID seed`);
const buildInputs=[...CORE_SOURCES,...APP_SOURCES,...SOURCE_ONLY];
for(const file of buildInputs){const target=path.join(tmp,file);fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(path.join(root,file),target)}
writeOutputs(tmp,{log:false});
assert.equal(verifyOutputs(tmp,{log:false}).ok,true,'fresh build must verify');
fs.appendFileSync(path.join(tmp,'alphabet-core.bundle.js'),'\n// stale\n');
assert.equal(verifyOutputs(tmp,{log:false}).ok,false,'build --check equivalent must reject stale bundle');
writeOutputs(tmp,{log:false});fs.appendFileSync(path.join(tmp,'alphabet-lab.html'),'\n<!-- stale -->\n');
assert.equal(verifyOutputs(tmp,{log:false}).ok,false,'build --check equivalent must reject stale HTML');
const meta=JSON.parse(a.files['alphabet-build.json']);
assert.equal(meta.appVersion,'6.1.0');assert.equal(meta.schemaVersion,6);assert.equal(meta.buildId,a.buildId);assert.equal(meta.bundles.core.sha256,digest(a.files['alphabet-core.bundle.js']));assert.equal(meta.bundles.app.sha256,digest(a.files['alphabet-app.bundle.js']));
assert(a.files['alphabet-lab.html'].includes(`alphabet-core.bundle.js?v=${a.buildId}`));assert(a.files['alphabet-lab.html'].includes(`alphabet-app.bundle.js?v=${a.buildId}`));assert(a.files['alphabet-lab-sw.js'].includes(a.buildId));

// Kommentarzeilen werden nicht ausgeliefert – aber nur dort, wo es sicher ist.
assert.equal(stripCommentLines('a=1;\n// weg\n\n  // auch weg\n  b=2; // bleibt\n'),'a=1;\nb=2; // bleibt\n','full-line comments, blank lines and code indentation are removed, trailing comments stay');
assert.equal(stripCommentLines('  x=`eins\n    zwei\n  `;\n  y=1;\n'),'x=`eins\n    zwei\n  `;\ny=1;\n','indentation inside a template literal is content and must survive');
assert.equal(stripCommentLines('x=`eins\n// Inhalt, kein Kommentar\n\nzwei`;\n// weg\ny=1;\n'),'x=`eins\n// Inhalt, kein Kommentar\n\nzwei`;\ny=1;\n','lines inside a template literal are content and must survive');
assert.equal(stripCommentLines('x=`a${b?`c`:\'\'}\n// bleibt\n`;\n'),'x=`a${b?`c`:\'\'}\n// bleibt\n`;\n','nested single-line templates must not confuse the template tracking');
assert.throws(()=>stripCommentLines('x=`offen\n// ?\n','kaputt.js'),/kaputt\.js/,'an unbalanced template literal must abort the build instead of guessing');
// Ein Backtick in einem String oder einer Regex-Zeichenklasse öffnet kein Literal.
assert.equal(stripCommentLines("a=s.replace(/[’'`]/g,'x');\n// weg\nb='`';\n// weg\nc=1;\n"),"a=s.replace(/[’'`]/g,'x');\nb='`';\nc=1;\n",'backticks inside regex classes and strings must not open a template literal');
assert.equal(stripCommentLines('x=`a${[1,2].map(n=>`\n// Inhalt\n${n}`).join("")}\n// Inhalt\n`;\n// weg\n'),'x=`a${[1,2].map(n=>`\n// Inhalt\n${n}`).join("")}\n// Inhalt\n`;\n','multi-line nested templates keep their content');
assert.equal(stripCommentLines('x=`a${\n// Kommentar im Ausdruck\nb}c`;\n'),'x=`a${\nb}c`;\n','a comment inside a ${} expression is code and may go');
assert.equal(stripCommentLines('/* Block\n// bleibt, ist Teil des Blocks\n*/\na=6/2/3;\n// weg\n'),'/* Block\n// bleibt, ist Teil des Blocks\n*/\na=6/2/3;\n','block comments and divisions are tracked');
// Unabhängig vom Scanner: Ausgeliefert wird eine Teilfolge der Quellzeilen
// (höchstens ohne Einrückung), und weggelassen wurde nichts außer reinen
// Kommentar- und Leerzeilen.
let dropped=0;
for(const [bundle,sources] of [['alphabet-core.bundle.js',CORE_SOURCES],['alphabet-app.bundle.js',APP_SOURCES]]){
  const shipped=a.files[bundle].split('\n');let cursor=0;
  for(const file of sources){
    const at=shipped.indexOf(`/* source: ${file} */`,cursor);assert(at>=0,`${bundle}: ${file} fehlt oder steht in falscher Reihenfolge`);cursor=at+1;
    for(const line of fs.readFileSync(path.join(root,file),'utf8').replace(/\r\n/g,'\n').replace(/\s+$/,'').split('\n')){
      if(shipped[cursor]===line||(shipped[cursor]===line.replace(/^[ \t]+/,'')&&!/^(\/\/.*)?$/.test(shipped[cursor]))){cursor++;continue}
      assert(/^\s*(\/\/.*)?$/.test(line),`${bundle}: Codezeile aus ${file} fehlt oder wurde verändert: ${line.slice(0,80)}`);dropped++;
    }
  }
  // Der Rest der App läuft gegen genau diese Bytes; hier mindestens: gültiges JavaScript.
  assert.doesNotThrow(()=>new vm.Script(a.files[bundle],{filename:bundle}),`${bundle} muss gültiges JavaScript bleiben`);
}
assert(dropped>100,`Kommentarzeilen müssen tatsächlich entfernt werden, entfernt wurden ${dropped}`);
// Die Lernpfad-Daten sind eine eigene, versionierte und offline verfügbare Datei.
assert(a.files['alphabet-lab.html'].includes(`alphabet-path-data.js?v=${a.buildId}`),'HTML must load the versioned learning-path data');
assert(a.files['alphabet-lab.html'].indexOf('alphabet-path-data.js')<a.files['alphabet-lab.html'].indexOf('alphabet-core.bundle.js'),'learning-path data must load before the core bundle');
assert(a.files['alphabet-lab-sw.js'].includes('./alphabet-path-data.js'),'service worker must precache the learning-path data');
console.log('Alphabet Lab V6.1 deterministic build: OK',a.buildId);
