import {test,expect} from '@playwright/test';

async function openLab(page){
  await page.goto('/alphabet-lab.html?debugLearning=1');
  await page.waitForFunction(()=>window.AlphabetLab?.version===4);
}

async function startFamily(page,letter,family,opts={}){
  return page.evaluate(({letter,family,opts})=>window.AlphabetLab.debugStartFamily(letter,family,opts),{letter,family,opts});
}

test('home, adaptive training, mobile layout and service worker are operational',async({page})=>{
  await openLab(page);
  await expect(page.getByRole('button',{name:'MEIN TRAINING STARTEN'})).toBeVisible();
  await expect(page.getByText('Dein aktuelles Lernfeld')).toBeVisible();
  const noHorizontalOverflow=await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+2);
  expect(noHorizontalOverflow).toBeTruthy();
  const sw=await page.evaluate(async()=>{
    if(!('serviceWorker'in navigator))return 'unsupported';
    return Promise.race([navigator.serviceWorker.ready.then(r=>r.active?.scriptURL||''),new Promise(r=>setTimeout(()=>r('timeout'),7000))]);
  });
  expect(sw).toContain('alphabet-lab-sw.js');
  await page.getByRole('button',{name:'MEIN TRAINING STARTEN'}).click();
  await expect(page.getByText(/Hauptfrage/)).toBeVisible();
  const task=await page.evaluate(()=>window.AlphabetLab.debugCurrentTask());
  expect(task.signature).toBeTruthy();
  expect(task.selectionReason).toBeTruthy();
  await expect(page.getByText('Warum diese Frage?')).toBeVisible();
});

test('multi-select produces a real result and V4 progress survives reload',async({page})=>{
  await openLab(page);
  const task=await startFamily(page,'А','multi-select',{size:1});
  expect(task.interaction).toBe('multiSelect');
  const tokens=page.locator('[data-token]');
  expect(await tokens.count()).toBeGreaterThanOrEqual(4);
  for(const i of task.correctIndexes)await tokens.nth(i).click();
  await page.getByRole('button',{name:'Auswahl prüfen'}).click();
  await expect(page.getByText('✓ Richtig')).toBeVisible();
  await expect(page.getByText('PRÜFUNGSERGEBNIS')).toBeVisible({timeout:4000});
  await expect(page.getByText(/1\/1/).first()).toBeVisible();
  const stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('uk-alpha-lab-v3')||'null'));
  expect(stored?.version).toBe(4);
  expect(stored?.letters?.А?.seen).toBeGreaterThan(0);
  await page.reload();
  await page.waitForFunction(()=>window.AlphabetLab?.version===4);
  const after=await page.evaluate(()=>window.AlphabetLab.state());
  expect(after.version).toBe(4);
  expect(after.letters.А.seen).toBeGreaterThan(0);
});

test('word/image transfer and delayed repair render through the real UI',async({page})=>{
  await openLab(page);
  const wordTask=await startFamily(page,'А','word-image',{size:1});
  expect(wordTask.wordId).toBeTruthy();
  await expect(page.locator('.visual-anchor')).toBeVisible();
  await expect(page.locator('.word-display')).toBeVisible();
  await page.evaluate(()=>window.AlphabetLab.debugHome());
  const task=await startFamily(page,'Р','visual-to-sound',{size:3});
  const answers=page.locator('[data-ans]');
  let wrongIndex=-1;
  for(let i=0;i<await answers.count();i++)if((await answers.nth(i).getAttribute('data-ans'))!==task.correct){wrongIndex=i;break}
  expect(wrongIndex).toBeGreaterThanOrEqual(0);
  await answers.nth(wrongIndex).click();
  await expect(page.getByText('✕ Falsch')).toBeVisible();
  const openRepairs=await page.evaluate(()=>Object.values(window.AlphabetLab.state().repairs||{}).filter(r=>r.open));
  expect(openRepairs.length).toBeGreaterThan(0);
  const shown=await page.evaluate(()=>window.AlphabetLab.debugShowDueRepair());
  expect(shown).toBeTruthy();
  const repair=await page.evaluate(()=>window.AlphabetLab.debugCurrentTask());
  expect(repair.isRepair).toBeTruthy();
  expect(repair.repairId).toBe(openRepairs[0].repairId);
  await expect(page.getByText(/Reparatur/).first()).toBeVisible();
});

test('human-audio question exposes accessible controls without requiring a system keyboard',async({page})=>{
  await openLab(page);
  const task=await startFamily(page,'І','audio-to-letter',{size:1});
  expect(task.type).toBe('audio');
  await expect(page.getByRole('button',{name:'Audio starten'})).toBeVisible();
  const answerButtons=page.locator('[data-ans]');
  expect(await answerButtons.count()).toBeGreaterThanOrEqual(2);
  for(let i=0;i<await answerButtons.count();i++)expect(await answerButtons.nth(i).isDisabled()).toBeTruthy();
  const hasTextInput=await page.locator('input[type="text"], textarea').count();
  expect(hasTextInput).toBe(0);
});
