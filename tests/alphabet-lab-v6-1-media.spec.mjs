import {test,expect} from '@playwright/test';

async function openLab(page){await page.goto('/alphabet-lab.html?debugLearning=1');await page.waitForFunction(()=>window.AlphabetLab?.version===6&&window.AlphabetCoreV2?.APP_VERSION==='6.1.0')}

test.beforeEach(async({page})=>{await page.addInitScript(()=>{window.__audioInstances=[];class FakeAudio{constructor(src){this.src=src;this.paused=false;this.currentTime=0;this.onplay=null;this.onended=null;this.onerror=null;window.__audioInstances.push(this)}play(){this.paused=false;queueMicrotask(()=>this.onplay?.());return Promise.resolve()}pause(){this.paused=true}fireEnd(){this.onended?.()}fireError(){this.onerror?.()}}window.Audio=FakeAudio})});

test('old audio is stopped on navigation and stale events cannot unlock a new question',async({page})=>{
  await openLab(page);await page.evaluate(()=>window.AlphabetLab.debugStartFamily('І','audio-to-letter',{size:1}));await page.getByRole('button',{name:'Audio starten'}).click();await expect.poll(()=>page.evaluate(()=>window.__audioInstances.length)).toBe(1);const first=await page.evaluate(()=>({paused:window.__audioInstances[0].paused}));expect(first.paused).toBeFalsy();
  await page.evaluate(()=>window.AlphabetLab.debugHome());expect(await page.evaluate(()=>window.__audioInstances[0].paused)).toBeTruthy();await page.evaluate(()=>window.__audioInstances[0].fireEnd());await page.evaluate(()=>window.AlphabetLab.debugStartFamily('Р','audio-to-letter',{size:1}));for(const b of await page.locator('[data-ans]').all())expect(await b.isDisabled()).toBeTruthy()
});

test('starting a second human audio stops the first and timing starts only after audio end',async({page})=>{
  await openLab(page);await page.evaluate(()=>window.AlphabetLab.debugStartFamily('І','audio-to-letter',{size:1}));await page.getByRole('button',{name:'Audio starten'}).click();await page.evaluate(()=>window.AlphabetLab.debugHome());await page.evaluate(()=>window.AlphabetLab.debugStartFamily('Р','audio-to-letter',{size:1}));await page.getByRole('button',{name:'Audio starten'}).click();expect(await page.evaluate(()=>window.__audioInstances[0].paused)).toBeTruthy();await page.evaluate(()=>window.__audioInstances.at(-1).fireEnd());const task=await page.evaluate(()=>window.AlphabetLab.debugCurrentTask());const correct=page.locator(`[data-ans="${task.correct}"]`);await expect(correct).toBeEnabled();await correct.click();await page.waitForTimeout(100);const row=await page.evaluate(()=>window.AlphabetLab.state().answerLog.at(-1));expect(row.latencyMs).toBeLessThan(1000)
});

test('two technical human-audio failures replace learning task without user error',async({page})=>{
  await openLab(page);await page.evaluate(()=>window.AlphabetLab.debugStartFamily('І','audio-to-letter',{size:1}));const before=await page.evaluate(()=>window.AlphabetLab.state().letters.І.wrong);await page.getByRole('button',{name:'Audio starten'}).click();await page.evaluate(()=>window.__audioInstances.at(-1).fireError());await page.waitForTimeout(80);await page.getByRole('button',{name:'Audio starten'}).click();await page.evaluate(()=>window.__audioInstances.at(-1).fireError());await page.waitForTimeout(500);expect(await page.evaluate(()=>window.AlphabetLab.state().letters.І.wrong)).toBe(before);const task=await page.evaluate(()=>window.AlphabetLab.debugCurrentTask());expect(task.type).not.toBe('audio')
});

test('audio-choice double play stops prior candidate and stale candidate end does not count',async({page})=>{
  await openLab(page);await page.evaluate(()=>window.AlphabetLab.debugStartFamily('Р','letter-to-audio-choice',{size:1}));const buttons=page.locator('[data-play-letter-audio]');await buttons.nth(0).click();await buttons.nth(1).click();expect(await page.evaluate(()=>window.__audioInstances[0].paused)).toBeTruthy();await page.evaluate(()=>window.__audioInstances[0].fireEnd());await expect(page.getByText('0/4 Aufnahmen gehört.')).toBeVisible();await page.evaluate(()=>window.__audioInstances[1].fireEnd());await expect(page.getByText('1/4 Aufnahmen gehört.')).toBeVisible()
});

test('sound-to-letter question shows a cue and can play isolated human letter audio',async({page})=>{
  await openLab(page);const task=await page.evaluate(()=>window.AlphabetLab.debugStartFamily('Х','sound-to-letter',{size:1}));expect(task.type).toBe('reverse');expect(task.display).toBeTruthy();await expect(page.getByText(task.display,{exact:true})).toBeVisible();const play=page.getByRole('button',{name:'Laut anhören'});await expect(play).toBeVisible();await play.click();await expect.poll(()=>page.evaluate(()=>window.__audioInstances.length)).toBe(1);expect(await page.evaluate(()=>window.__audioInstances[0].src)).toContain('ukrainian.ogg');await page.evaluate(()=>window.__audioInstances.at(-1).fireEnd());await expect(page.getByText('Nochmal anhören')).toBeVisible();const correct=page.locator(`[data-ans="${task.correct}"]`);await expect(correct).toBeEnabled()
});

test('soft sign sound-to-letter stays textual because Ь has no isolated sound',async({page})=>{
  await openLab(page);const task=await page.evaluate(()=>window.AlphabetLab.debugStartFamily('Ь','sound-to-letter',{size:1}));expect(task.display).toBe('kein eigener Laut');await expect(page.getByText('kein eigener Laut',{exact:true})).toBeVisible();await expect(page.getByRole('button',{name:'Laut anhören'})).toHaveCount(0)
});
