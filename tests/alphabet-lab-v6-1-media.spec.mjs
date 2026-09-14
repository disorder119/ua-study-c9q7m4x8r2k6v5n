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

test('sound-to-letter question requires isolated human original audio before answering',async({page})=>{
  await openLab(page);const task=await page.evaluate(()=>window.AlphabetLab.debugStartFamily('Х','sound-to-letter',{size:1}));expect(task.type).toBe('reverse');const play=page.getByRole('button',{name:'Originalaufnahme anhören'});await expect(play).toBeVisible();for(const b of await page.locator('[data-ans]').all())expect(await b.isDisabled()).toBeTruthy();await play.click();await expect.poll(()=>page.evaluate(()=>window.__audioInstances.length)).toBe(1);expect(await page.evaluate(()=>window.__audioInstances[0].src)).toContain('ukrainian.ogg');await page.evaluate(()=>window.__audioInstances.at(-1).fireEnd());await expect(page.getByText('Originalaufnahme vollständig gehört. Jetzt antworten.')).toBeVisible();const correct=page.locator(`[data-ans="${task.correct}"]`);await expect(correct).toBeEnabled()
});

test('human-only audio policy exposes provenance and no synthetic fallback',async({page})=>{
  await openLab(page);const info=await page.evaluate(()=>({policy:window.UKRAINIAN_AUDIO_POLICY,letter:window.UKRAINIAN_LETTER_AUDIO_META?.Б,word:window.UKRAINIAN_WORD_AUDIO_META?.['аптека']}));expect(info.policy.mode).toBe('human-only');expect(info.policy.ttsAllowed).toBeFalsy();expect(info.policy.aiVoiceAllowed).toBeFalsy();expect(info.letter.human).toBeTruthy();expect(info.letter.sourceVerified).toBeTruthy();expect(info.word.human).toBeTruthy();expect(info.word.sourceVerified).toBeTruthy();expect(info.word.source).toContain('commons.wikimedia.org')
});

test('visual letter learning shows six real Ukrainian word examples and reinforces with human audio after answer',async({page})=>{
  await openLab(page);const task=await page.evaluate(()=>window.AlphabetLab.debugStartFamily('Б','visual-to-sound',{size:1}));expect(task.type).toBe('visual');await expect(page.getByText('6 echte ukrainische Wörter mit Б')).toBeVisible();for(const word of ['бабуся','банк','хліб','робота','автобус','обід'])await expect(page.getByText(word,{exact:true})).toBeVisible();await expect(page.locator('.question-word-examples [data-human-word-audio]')).toHaveCount(0);const correct=page.locator(`[data-ans="${task.correct}"]`);await correct.click();await expect(page.locator('.human-answer-reinforcement')).toBeVisible();await expect.poll(()=>page.evaluate(()=>window.__audioInstances.length)).toBeGreaterThan(0);expect(await page.evaluate(()=>window.__audioInstances.at(-1).src)).toContain('Uk-%D0%B1%D0%B0%D0%B1%D1%83%D1%81%D1%8F.ogg');await page.evaluate(()=>window.__audioInstances.at(-1).fireEnd())
});

test('soft sign is never given a fake isolated sound',async({page})=>{
  await openLab(page);await page.evaluate(()=>window.AlphabetLab.debugStartFamily('Ь','sound-to-letter',{size:1}));await page.waitForTimeout(150);const task=await page.evaluate(()=>window.AlphabetLab.debugCurrentTask());expect(task.letter).toBe('Ь');expect(task.family).not.toBe('sound-to-letter');await expect(page.getByRole('button',{name:'Originalaufnahme anhören'})).toHaveCount(0)
});
