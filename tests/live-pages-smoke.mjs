import fs from 'node:fs';
import {chromium} from 'playwright';

const BASE='https://disorder119.github.io/ua-study-c9q7m4x8r2k6v5n/';
const expected=JSON.parse(fs.readFileSync(new URL('../alphabet-build.json',import.meta.url),'utf8'));
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function get(path){return fetch(new URL(path,BASE),{cache:'no-store',redirect:'follow'})}
let published=false;
for(let i=0;i<36;i++){
  try{const r=await get(`alphabet-build.json?probe=${Date.now()}`);if(r.ok){const j=await r.json();if(j.buildId===expected.buildId&&j.appVersion===expected.appVersion){published=true;break}}}catch(_){}
  await sleep(10000);
}
if(!published)throw new Error(`Expected Pages build not published: ${expected.buildId}`);
for(const file of ['alphabet-lab.html','alphabet-core.bundle.js','alphabet-app.bundle.js','alphabet-lab.webmanifest']){
  const r=await get(`${file}?v=${expected.buildId}`);if(!r.ok)throw new Error(`${file} HTTP ${r.status}`);const type=r.headers.get('content-type')||'';if(file.endsWith('.js')&&/html/i.test(type))throw new Error(`${file} served as HTML`)
}
const browser=await chromium.launch();
const page=await browser.newPage({viewport:{width:1280,height:800}});const errors=[];
page.on('console',m=>{if(m.type()==='error')errors.push(`console: ${m.text()}`)});page.on('pageerror',e=>errors.push(`pageerror: ${e.message}`));page.on('response',r=>{if(r.url().startsWith(BASE)&&r.status()===404)errors.push(`404: ${r.url()}`)});
await page.goto(BASE,{waitUntil:'domcontentloaded'});await page.waitForURL(/alphabet-lab\.html/);
await page.waitForFunction(({id,version})=>window.AlphabetLab?.version===6&&window.AlphabetCoreV2?.APP_VERSION===version&&window.__ALPHABET_BUILD_ID__===id,{id:expected.buildId,version:expected.appVersion},{timeout:15000});
if(!(await page.getByRole('button',{name:'MEIN TRAINING STARTEN'}).isVisible()))throw new Error('start button not visible');
if(errors.length)throw new Error(errors.join('\n'));
await browser.close();console.log(`Live Pages smoke OK · build ${expected.buildId} · ${expected.appVersion}`);
