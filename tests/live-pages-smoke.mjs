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
const manifestResponse=await get(`alphabet-lab.webmanifest?v=${expected.buildId}&probe=${Date.now()}`);
if(!manifestResponse.ok)throw new Error(`manifest HTTP ${manifestResponse.status}`);
const manifest=await manifestResponse.json();
if(manifest.display!=='standalone')throw new Error(`manifest display must be standalone, got ${manifest.display}`);
if(manifest.start_url!=='./alphabet-lab.html')throw new Error(`unexpected manifest start_url: ${manifest.start_url}`);
if(manifest.scope!=='./')throw new Error(`unexpected manifest scope: ${manifest.scope}`);
for(const size of ['192x192','512x512'])if(!manifest.icons?.some(icon=>icon.sizes===size&&icon.type==='image/png'))throw new Error(`manifest icon missing: ${size}`);
const browser=await chromium.launch();
const page=await browser.newPage({viewport:{width:1280,height:800}});const errors=[];
page.on('console',m=>{if(m.type()==='error')errors.push(`console: ${m.text()}`)});page.on('pageerror',e=>errors.push(`pageerror: ${e.message}`));page.on('response',r=>{if(r.url().startsWith(BASE)&&r.status()===404)errors.push(`404: ${r.url()}`)});
await page.goto(BASE,{waitUntil:'domcontentloaded'});await page.waitForURL(/alphabet-lab\.html/);
await page.waitForFunction(({id,version})=>window.AlphabetLab?.version===6&&window.AlphabetCoreV2?.APP_VERSION===version&&window.__ALPHABET_BUILD_ID__===id,{id:expected.buildId,version:expected.appVersion},{timeout:15000});
const pwa=await page.evaluate(()=>({
  appleCapable:document.querySelector('meta[name="apple-mobile-web-app-capable"]')?.content,
  mobileCapable:document.querySelector('meta[name="mobile-web-app-capable"]')?.content,
  appleTitle:document.querySelector('meta[name="apple-mobile-web-app-title"]')?.content,
  statusBar:document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')?.content,
  touchIcon:document.querySelector('link[rel="apple-touch-icon"]')?.getAttribute('href')||'',
  manifest:document.querySelector('link[rel="manifest"]')?.getAttribute('href')||''
}));
if(pwa.appleCapable!=='yes'||pwa.mobileCapable!=='yes')throw new Error(`standalone capability metadata missing: ${JSON.stringify(pwa)}`);
if(pwa.appleTitle!=='Alphabet Lab')throw new Error(`unexpected Apple home-screen title: ${pwa.appleTitle}`);
if(!['default','black','black-translucent'].includes(pwa.statusBar))throw new Error(`invalid iOS status bar style: ${pwa.statusBar}`);
if(!pwa.touchIcon.includes('ukrainisch-icon-192.png')||!pwa.touchIcon.includes(expected.buildId))throw new Error(`versioned Apple touch icon missing: ${pwa.touchIcon}`);
if(!pwa.manifest.includes('alphabet-lab.webmanifest')||!pwa.manifest.includes(expected.buildId))throw new Error(`versioned manifest link missing: ${pwa.manifest}`);
if(!(await page.getByRole('button',{name:'MEIN TRAINING STARTEN'}).isVisible()))throw new Error('start button not visible');
if(errors.length)throw new Error(errors.join('\n'));
await browser.close();console.log(`Live Pages smoke OK · build ${expected.buildId} · ${expected.appVersion} · iPhone standalone metadata OK`);
