import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';

const root=process.cwd();
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const base=read('ukrainisch-lernen.html');
if(!base.includes('</body>'))throw new Error('Basis-App enthält kein </body>');
if(base.includes('ukrainischkurs-v2-loader.js'))throw new Error('Basis-App bindet den Upgrade-Loader bereits selbst ein');

// Absichtlich ohne Versionsquery: Die Hülle bleibt bei Loader-Releases identisch.
// Der Service Worker behandelt genau diese stabile Loader-URL network-first.
const tag='<script src="./ukrainischkurs-v2-loader.js"></script>';
const releaseMarker='<!-- Alphabet Lab V6.1 release packaging -->';
const output=base.replace('</body>',`${tag}\n${releaseMarker}\n</body>`);
const target=path.join(root,'ukrainischkurs-app.html');
if(process.argv.includes('--check')){
  const current=fs.existsSync(target)?fs.readFileSync(target,'utf8'):'';
  if(current!==output){console.error('ukrainischkurs-app.html ist nicht deterministisch aus Basis + stabilem Loader generiert');process.exit(1)}
  console.log('App-Hülle ist deterministisch aktuell (stabile Loader-URL).');
}else{
  fs.writeFileSync(target,output,'utf8');
  console.log('Statische App-Hülle mit stabiler Loader-URL generiert.');
  execFileSync(process.execPath,['scripts/build-alphabet-lab.mjs'],{cwd:root,stdio:'inherit'});
  // Temporärer Release-Packaging-Hook: Der bestehende main-only App-Shell-Workflow
  // committtet diese deterministisch generierten Artefakte gemeinsam mit der Hülle.
  execFileSync('git',['add','alphabet-core.bundle.js','alphabet-app.bundle.js','alphabet-lab.html','alphabet-lab-sw.js','alphabet-build.json'],{cwd:root,stdio:'inherit'});
}
