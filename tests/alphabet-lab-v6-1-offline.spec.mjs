import fs from 'node:fs';
import path from 'node:path';
import {test,expect} from '@playwright/test';

test.beforeEach(async({},testInfo)=>{test.skip(!testInfo.project.name.includes('chromium'),'service-worker/offline release smoke is Chromium-primary')});
const fixtureDir=path.resolve('tests/.sw-update-fixture');
function writeFixture(v){
  fs.mkdirSync(fixtureDir,{recursive:true});
  const indexPath=path.join(fixtureDir,'index.html'),appPath=path.join(fixtureDir,'app.js'),swPath=path.join(fixtureDir,'sw.js');
  fs.writeFileSync(indexPath,`<!doctype html><script>navigator.serviceWorker.register('./sw.js').then(()=>navigator.serviceWorker.ready).then(()=>{if(!navigator.serviceWorker.controller)location.reload()})</script><script src="./app.js?v=${v}"></script>`);
  fs.writeFileSync(appPath,`window.__fixtureVersion='${v}'`);
  fs.writeFileSync(swPath,`const V='${v}',C='sw-fixture-'+V,U=['./index.html','./app.js?v='+V];self.addEventListener('install',e=>e.waitUntil(caches.open(C).then(c=>c.addAll(U)).then(()=>self.skipWaiting())));self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.startsWith('sw-fixture-')&&x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(u.pathname.endsWith('app.js'))e.respondWith(caches.match(e.request).then(x=>x||fetch(e.request)));});`);
  const stamp=new Date(v==='A'?'2026-01-01T00:00:00.000Z':'2026-01-01T00:00:02.000Z');
  for(const file of [indexPath,appPath,swPath])fs.utimesSync(file,stamp,stamp)
}

test('real Alphabet Lab boots after offline reload and missing JS never becomes HTML',async({page,context})=>{
  await page.goto('/alphabet-lab.html?debugLearning=1');await page.waitForFunction(()=>window.AlphabetLab?.version===6&&window.AlphabetCoreV2?.APP_VERSION==='6.1.0');await page.evaluate(async()=>{await navigator.serviceWorker.ready;if(!navigator.serviceWorker.controller)location.reload()});await page.waitForFunction(()=>navigator.serviceWorker.controller!==null);const build=await page.evaluate(()=>window.__ALPHABET_BUILD_ID__);expect(build).toBeTruthy();await context.setOffline(true);await page.reload({waitUntil:'domcontentloaded'});await page.waitForFunction(()=>window.AlphabetLab?.version===6);const miss=await page.evaluate(async build=>{const r=await fetch(`./definitely-missing.js?v=${build}`);return {status:r.status,type:r.headers.get('content-type'),body:await r.text()}},build);expect(miss.status).toBe(503);expect(miss.type||'').toMatch(/javascript/i);expect(miss.type||'').not.toMatch(/html/i);expect(miss.body).toBe('');await context.setOffline(false)
});

test('service-worker A to B update yields coherent B app on first controlled reload',async({page})=>{
  writeFixture('A');await page.goto('/tests/.sw-update-fixture/index.html');await page.waitForFunction(()=>window.__fixtureVersion==='A');await page.waitForFunction(()=>navigator.serviceWorker.controller!==null);writeFixture('B');await page.evaluate(async()=>{const r=await navigator.serviceWorker.getRegistration();await r.update();await new Promise(resolve=>{navigator.serviceWorker.addEventListener('controllerchange',resolve,{once:true});setTimeout(resolve,2500)})});await page.reload({waitUntil:'domcontentloaded'});await page.waitForFunction(()=>window.__fixtureVersion==='B');expect(await page.evaluate(()=>window.__fixtureVersion)).toBe('B')
});
