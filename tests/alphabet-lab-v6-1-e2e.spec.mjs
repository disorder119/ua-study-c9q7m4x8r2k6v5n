import './alphabet-lab-v4-e2e.spec.mjs';
import {test,expect} from '@playwright/test';

async function openLab(page){await page.goto('/alphabet-lab.html?debugLearning=1');await page.waitForFunction(()=>window.AlphabetLab?.version===6)}
async function startFamily(page,letter,family,opts={}){return page.evaluate(({letter,family,opts})=>window.AlphabetLab.debugStartFamily(letter,family,opts),{letter,family,opts})}

test('V6 canonical storage wins over stale V3 and corrupt V6 recovers once from valid legacy',async({page})=>{
  await openLab(page);const base=await page.evaluate(()=>window.AlphabetLab.state());
  await page.evaluate(base=>{localStorage.setItem('uk-alpha-lab-v6',JSON.stringify({...base,xp:222}));localStorage.setItem('uk-alpha-lab-v3',JSON.stringify({...base,xp:111}))},base);await page.reload();await page.waitForFunction(()=>window.AlphabetLab?.version===6);expect((await page.evaluate(()=>window.AlphabetLab.state().xp))).toBe(222);expect(await page.evaluate(()=>localStorage.getItem('uk-alpha-lab-v3'))).toBeNull();
  const fresh=await page.evaluate(()=>window.AlphabetLab.state());await page.evaluate(fresh=>{localStorage.setItem('uk-alpha-lab-v6','{broken');localStorage.setItem('uk-alpha-lab-v3',JSON.stringify({...fresh,xp:333}))},fresh);await page.reload();await page.waitForFunction(()=>window.AlphabetLab?.version===6);expect(await page.evaluate(()=>window.AlphabetLab.state().xp)).toBe(333);expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('uk-alpha-lab-v6')).xp)).toBe(333);expect(await page.evaluate(()=>localStorage.getItem('uk-alpha-lab-v3'))).toBeNull()
});

test('reset cannot resurrect stale legacy progress',async({page})=>{
  await openLab(page);const old=await page.evaluate(()=>window.AlphabetLab.state());await page.evaluate(old=>localStorage.setItem('uk-alpha-lab-v3',JSON.stringify({...old,xp:999})),old);await page.evaluate(()=>{window.confirm=()=>true;window.AlphabetLab.reset()});await page.waitForTimeout(220);expect(await page.evaluate(()=>window.AlphabetLab.state().xp)).toBe(0);expect(await page.evaluate(()=>localStorage.getItem('uk-alpha-lab-v3'))).toBeNull();await page.reload();await page.waitForFunction(()=>window.AlphabetLab?.version===6);expect(await page.evaluate(()=>window.AlphabetLab.state().xp)).toBe(0)
});

test('quota compaction preserves critical learning state and persistent failure is visible',async({page})=>{
  await openLab(page);const before=await page.evaluate(()=>{const s=window.AlphabetLab.state();return {version:s.version,metrics:s.metrics,learningPlan:s.learningPlan,repairs:s.repairs,masteryChecks:s.masteryChecks,letters:s.letters}});
  const recovered=await page.evaluate(()=>{const real=Storage.prototype.setItem;let n=0;Storage.prototype.setItem=function(k,v){if(k==='uk-alpha-lab-v6'&&n++===0)throw new DOMException('quota','QuotaExceededError');return real.call(this,k,v)};const ok=window.AlphabetLabV6Runtime.flushPersist();Storage.prototype.setItem=real;return ok});expect(recovered).toBeTruthy();
  const after=await page.evaluate(()=>{const s=window.AlphabetLab.state();return {version:s.version,metrics:s.metrics,learningPlan:s.learningPlan,repairs:s.repairs,masteryChecks:s.masteryChecks,letters:s.letters}});expect(after.version).toBe(before.version);expect(after.metrics.independentMainCount).toBe(before.metrics.independentMainCount);expect(after.learningPlan).toEqual(before.learningPlan);expect(after.repairs).toEqual(before.repairs);expect(after.masteryChecks).toEqual(before.masteryChecks);
  const failed=await page.evaluate(()=>{const real=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k==='uk-alpha-lab-v6')throw new DOMException('quota','QuotaExceededError');return real.call(this,k,v)};const ok=window.AlphabetLabV6Runtime.flushPersist();Storage.prototype.setItem=real;return ok});expect(failed).toBeFalsy();await expect(page.getByText('Lernstand konnte auf diesem Gerät gerade nicht gespeichert werden.')).toBeVisible();expect(await page.evaluate(()=>window.AlphabetLabV6Runtime.flushPersist())).toBeTruthy();await expect(page.locator('#persistWarning')).toHaveCount(0)
});

test('debounced answer survives immediate pagehide and double interaction records once',async({page})=>{
  await openLab(page);const task=await startFamily(page,'А','visual-to-sound',{size:1});const correct=page.locator(`[data-ans="${task.correct.replaceAll('"','\\"')}"]`);const before=await page.evaluate(()=>window.AlphabetLab.state().answerLog.length);await correct.click({clickCount:2});await page.evaluate(()=>window.dispatchEvent(new PageTransitionEvent('pagehide',{persisted:false})));await page.reload();await page.waitForFunction(()=>window.AlphabetLab?.version===6);const after=await page.evaluate(()=>window.AlphabetLab.state().answerLog.length);expect(after).toBe(before+1)
});

test('root redirect, manifest and accessibility basics remain valid',async({browser,request,page})=>{
  await page.goto('/');await page.waitForURL(/alphabet-lab\.html/);await page.waitForFunction(()=>window.AlphabetLab?.version===6);expect(await page.locator('#app[aria-live]').count()).toBe(0);await page.getByRole('button',{name:'MEIN TRAINING STARTEN'}).click();await expect(page.locator('#feedback[aria-live]')).toBeVisible();
  const manifest=await (await request.get('/alphabet-lab.webmanifest')).json();expect(manifest.start_url).toContain('alphabet-lab.html');expect(manifest.scope).toBeTruthy();expect(manifest.icons.map(x=>x.sizes)).toEqual(expect.arrayContaining(['192x192','512x512']));for(const icon of manifest.icons){const r=await request.get('/'+icon.src.replace(/^\.\//,''));expect(r.ok()).toBeTruthy()}
  const ctx=await browser.newContext({javaScriptEnabled:false});const nojs=await ctx.newPage();await nojs.goto('http://127.0.0.1:4173/');await nojs.waitForURL(/alphabet-lab\.html/,{timeout:5000});await ctx.close()
});

test('small 320px and wide 1440px core screens have no horizontal overflow',async({page})=>{
  await page.setViewportSize({width:320,height:568});await openLab(page);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2)).toBeTruthy();await page.getByRole('button',{name:'MEIN TRAINING STARTEN'}).click();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2)).toBeTruthy();await page.setViewportSize({width:1440,height:900});await page.evaluate(()=>window.AlphabetLab.debugHome());expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+2)).toBeTruthy()
});
