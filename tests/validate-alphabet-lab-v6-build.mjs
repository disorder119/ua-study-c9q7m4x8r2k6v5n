import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {computeOutputs,verifyOutputs,writeOutputs,digest,CORE_SOURCES,APP_SOURCES} from '../scripts/build-alphabet-lab.mjs';

const root=path.resolve(new URL('..',import.meta.url).pathname);
const a=computeOutputs(root),b=computeOutputs(root);
assert.equal(a.buildId,b.buildId,'build ID must be deterministic');
for(const file of Object.keys(a.files))assert.equal(digest(a.files[file]),digest(b.files[file]),`${file} must be byte-identical across repeated builds`);
assert.equal(verifyOutputs(root,{log:false}).ok,true,'checked-in generated artifacts must be current');

const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'alphabet-v61-build-'));
const buildInputs=[...CORE_SOURCES,...APP_SOURCES,'alphabet-lab.template.html','alphabet-lab-sw.template.js','alphabet-lab.webmanifest','ukrainischkurs-native-audio.js','scripts/build-alphabet-lab.mjs'];
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
console.log('Alphabet Lab V6.1 deterministic build: OK',a.buildId);
