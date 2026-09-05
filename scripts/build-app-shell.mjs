import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const base=read('ukrainisch-lernen.html');
const loader=read('ukrainischkurs-v2-loader.js');
const match=loader.match(/const VERSION='(\d+)'/);
if(!match)throw new Error('Loader-Version konnte nicht ermittelt werden');
const version=match[1];
if(!base.includes('</body>'))throw new Error('Basis-App enthält kein </body>');
if(base.includes('ukrainischkurs-v2-loader.js'))throw new Error('Basis-App bindet den Upgrade-Loader bereits selbst ein');
const tag=`<script src="./ukrainischkurs-v2-loader.js?v=${version}"></script>`;
const output=base.replace('</body>',`${tag}\n</body>`);
const target=path.join(root,'ukrainischkurs-app.html');
if(process.argv.includes('--check')){
  const current=fs.existsSync(target)?fs.readFileSync(target,'utf8'):'';
  if(current!==output){console.error(`ukrainischkurs-app.html ist nicht aus Basis + Loader v${version} generiert`);process.exit(1)}
  console.log(`App-Hülle ist deterministisch aktuell (v${version}).`);
}else{
  fs.writeFileSync(target,output,'utf8');
  console.log(`Statische App-Hülle v${version} generiert.`);
}
