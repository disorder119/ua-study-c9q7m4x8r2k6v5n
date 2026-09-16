import {test,expect} from '@playwright/test';

async function openLab(page){
  await page.goto('/alphabet-lab.html?debugLearning=1');
  await page.waitForFunction(()=>window.AlphabetLab?.version===6);
}

async function startFamily(page,letter,family,opts={}){
  return page.evaluate(({letter,family,opts})=>window.AlphabetLab.debugStartFamily(letter,family,opts),{letter,family,opts});
}

async function primeProduction(page,letter='А'){
  return page.evaluate(letter=>window.AlphabetLab.debugPrimeProductionLetter(letter),letter);
}

async function startProduction(page,letter,family){
  return page.evaluate(({letter,family})=>window.AlphabetLab.debugStartProductionFamily(letter,family),{letter,family});
}

async function drawProductionStroke(page){
  await page.locator('#productionCanvas').evaluate(canvas=>{
    const r=canvas.getBoundingClientRect(),emit=(type,x,y)=>canvas.dispatchEvent(new PointerEvent(type,{bubbles:true,pointerId:1,clientX:r.left+x,clientY:r.top+y,buttons:type==='pointerup'?0:1}));
    emit('pointerdown',40,40);for(let i=1;i<=12;i++)emit('pointermove',40+i*18,40+i*15);emit('pointerup',260,220)
  });
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

test('multi-select produces a real result and V6 progress survives reload',async({page})=>{
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
  const stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('uk-alpha-lab-v6')||'null'));
  expect(stored?.version).toBe(6);
  expect(stored?.letters?.А?.seen).toBeGreaterThan(0);
  await page.reload();
  await page.waitForFunction(()=>window.AlphabetLab?.version===6);
  const after=await page.evaluate(()=>window.AlphabetLab.state());
  expect(after.version).toBe(6);
  expect(after.letters.А.seen).toBeGreaterThan(0);
  expect(after.letters.А.skills.writtenProduction).toBeTruthy();
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

test('letter-to-audio-choice uses four unlabeled human candidates and never soft sign',async({page})=>{
  await openLab(page);
  const task=await startFamily(page,'Р','letter-to-audio-choice',{size:1});
  expect(task.interaction).toBe('audioChoice');expect(task.audioChoiceLetters).toHaveLength(4);expect(task.audioChoiceLetters).not.toContain('Ь');
  await expect(page.locator('[data-play-letter-audio]')).toHaveCount(4);
  await expect(page.locator('.audio-pick-candidate')).toHaveCount(4);
  for(let i=0;i<4;i++)expect(await page.locator('.audio-pick-candidate').nth(i).isDisabled()).toBeTruthy();
  await expect(page.getByText('0/4 Originalaufnahmen gehört.')).toBeVisible();
});

test('microphone practice records locally without creating mastery evidence',async({page})=>{
  await page.addInitScript(()=>{
    Object.defineProperty(navigator,'mediaDevices',{configurable:true,value:{getUserMedia:async()=>({getTracks:()=>[{stop(){}}]})}});
    class FakeRecorder{constructor(){this.state='inactive';this.mimeType='audio/webm'}start(){this.state='recording'}stop(){this.state='inactive';this.ondataavailable?.({data:new Blob(['voice'],{type:'audio/webm'})});this.onstop?.()}}
    window.MediaRecorder=FakeRecorder;URL.createObjectURL=()=> 'blob:alphabet-lab-e2e';URL.revokeObjectURL=()=>{};
  });
  await openLab(page);await page.getByRole('button',{name:'Alphabet',exact:true}).click();await page.locator('.letter-chip').first().click();
  await expect(page.getByText('Aussprache selbst vergleichen')).toBeVisible();const before=await page.evaluate(()=>window.AlphabetLab.state().letters.А.seen);
  await page.getByRole('button',{name:/Aufnahme starten/}).click();await expect(page.getByText(/Aufnahme läuft/)).toBeVisible();await page.getByRole('button',{name:/Stoppen/}).click();await expect(page.locator('#micPlayback')).toBeVisible();await expect(page.getByText(/ohne automatische Note/)).toBeVisible();
  const after=await page.evaluate(()=>window.AlphabetLab.state().letters.А.seen);expect(after).toBe(before);
});

test('20-minute intensive mode is phased but still generates only the next live question',async({page})=>{
  await openLab(page);await page.getByRole('button',{name:'Prüfen'}).click();await expect(page.getByText('20-Minuten Intensiv')).toBeVisible();await page.getByRole('button',{name:'INTENSIV STARTEN'}).click();
  const s=await page.evaluate(()=>window.AlphabetLab.debugSession());expect(s.macro).toBeTruthy();expect(s.targetMainCount).toBe(36);expect(s.phasePlan).toHaveLength(5);expect(s.mainTasks.filter(Boolean).length).toBe(1);await expect(page.getByText(/Phase: Warm-up/)).toBeVisible();
});

test('V6 visual-memory writing hides the reference, requires drawing, and stores self-check outside objective score',async({page})=>{
  await openLab(page);await primeProduction(page,'А');const task=await startProduction(page,'А','visual-memory-writing');
  expect(task.interaction).toBe('writtenProduction');expect(task.display).toBe('А');
  await expect(page.locator('#productionReference')).toHaveClass(/hidden/);await expect(page.getByRole('button',{name:'Jetzt vergleichen'})).toBeDisabled();
  await expect(page.locator('#productionCue')).toBeHidden({timeout:2500});await drawProductionStroke(page);await expect(page.getByRole('button',{name:'Jetzt vergleichen'})).toBeEnabled();
  await page.getByRole('button',{name:'Jetzt vergleichen'}).click();await expect(page.locator('#productionReference')).not.toHaveClass(/hidden/);await expect(page.getByText('Wie gut passt deine Form?')).toBeVisible();
  const before=await page.evaluate(()=>window.AlphabetLab.debugSession().mainCorrect);await page.getByRole('button',{name:'Passt',exact:true}).click();await page.waitForTimeout(850);
  const state=await page.evaluate(()=>window.AlphabetLab.state());const sess=await page.evaluate(()=>window.AlphabetLab.debugSession());expect(state.letters.А.skills.writtenProduction.independentAttempts).toBeGreaterThan(0);expect(sess.mainCorrect).toBe(before)
});

test('V6 audio-to-writing uses a human audio gate and reveals no target before drawing',async({page})=>{
  await page.addInitScript(()=>{class FakeAudio{constructor(src){this.src=src;this.onended=null;this.onerror=null}play(){setTimeout(()=>this.onended?.(),20);return Promise.resolve()}pause(){}}window.Audio=FakeAudio});
  await openLab(page);await primeProduction(page,'Р');const task=await startProduction(page,'Р','audio-to-writing');
  expect(task.requiresHumanLetterAudio).toBeTruthy();expect(task.display).toBe('');expect(task.audioStimulusId).toBe('isolated-letter-Р');
  await expect(page.locator('#productionCue')).toHaveCount(0);await expect(page.locator('#productionReference')).toHaveClass(/hidden/);await expect(page.getByRole('button',{name:'Jetzt vergleichen'})).toBeDisabled();
  await page.getByRole('button',{name:/Menschliche Aufnahme starten/}).click();await expect(page.getByText('Gehört. Jetzt aus dem Gedächtnis zeichnen.')).toBeVisible();
  await drawProductionStroke(page);await page.getByRole('button',{name:'Jetzt vergleichen'}).click();await expect(page.locator('#productionReference')).not.toHaveClass(/hidden/)
});
