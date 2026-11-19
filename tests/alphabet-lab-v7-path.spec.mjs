import {test,expect} from '@playwright/test';

// V7 · Lernpfad im echten Browser.
//
// Der Pfad wird hier so bedient, wie ein Anfänger ihn bedient: über sichtbare
// Schaltflächen. Die Lösung des aktuellen Schritts kommt aus der Debug-API
// (nur mit ?debugLearning=1), damit der Test gezielt richtig oder falsch
// antworten kann – geklickt wird trotzdem immer die echte Oberfläche.

const PATH_KEY='uk-alpha-path-v1';

async function openLab(page){
  await page.goto('/alphabet-lab.html?debugLearning=1');
  await page.waitForFunction(()=>window.AlphabetLab?.version===6&&!!window.AlphabetLabPath);
}
const currentStep=page=>page.evaluate(()=>window.AlphabetLabPath.currentStep());
const noOverflow=page=>page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+2);

// Beantwortet den aktuellen Schritt über die Oberfläche und geht weiter.
async function answerStep(page,{wrong=false}={}){
  const step=await currentStep(page);
  if(!step)return null;
  if(step.type==='teach'){await page.locator('#pathNext').click();return step}
  if(step.type==='build'){
    let order=step.answer;
    if(wrong){order=step.tiles.slice(0,step.answer.length);if(order.join('')===step.correct)order=[...order].reverse()}
    const used=new Set();
    for(const ch of order){
      const index=step.tiles.findIndex((tile,i)=>tile===ch&&!used.has(i));
      used.add(index);
      await page.locator(`[data-path-tile="${index}"]`).click();
    }
  }else{
    const index=wrong?step.options.findIndex(option=>option!==step.correct):step.options.indexOf(step.correct);
    await page.locator(`[data-path-ans="${index}"]`).click();
  }
  if(wrong||step.word){
    // Wortschritte und Fehler zeigen eine Auflösung und warten auf „Weiter“.
    await expect(page.locator('#pathFeedback #pathNext')).toBeVisible();
    await page.locator('#pathFeedback #pathNext').click();
  }else{
    // Richtige Buchstabenschritte laufen von selbst weiter.
    await page.waitForFunction(id=>{const now=window.AlphabetLabPath.currentStep();return !now||now.id!==id},step.id);
  }
  return step;
}
async function finishRun(page,{wrongAt=[]}={}){
  const seen=[];
  for(let guard=0;guard<60;guard++){
    if(await page.locator('.path-done').isVisible())return seen;
    const step=await answerStep(page,{wrong:wrongAt.includes(seen.length)});
    if(step)seen.push(step);
  }
  throw new Error('Durchgang endete nicht');
}

test.beforeEach(async({page})=>{
  // Keine Sprachsynthese, nie: jeder Aufruf wird gezählt.
  await page.addInitScript(()=>{
    window.__ttsCalls=0;
    if(window.speechSynthesis){const speak=window.speechSynthesis.speak?.bind(window.speechSynthesis);window.speechSynthesis.speak=(...args)=>{window.__ttsCalls++;return speak?.(...args)}}
  });
  // Externe Aufnahmen sind im Test nicht erreichbar – der Pfad muss ohne sie laufen.
  await page.route(url=>!/^https?:\/\/127\.0\.0\.1/.test(url.href),route=>route.abort());
});

test('first visit: the learning path is the entry point and lesson 1 teaches before it asks',async({page})=>{
  const errors=[];page.on('pageerror',error=>errors.push(String(error)));
  await openLab(page);
  await expect(page.locator('#pathStart')).toBeVisible();
  await expect(page.locator('#pathStart')).toHaveText('LOS GEHT’S');
  // Das adaptive Training ist noch da, aber nicht mehr das Erste, was man sieht.
  await expect(page.getByRole('button',{name:'MEIN TRAINING STARTEN'})).toBeHidden();
  await expect(page.locator('[data-path-lesson]')).toHaveCount(8);
  await expect(page.locator('[data-path-lesson="1"]')).toBeDisabled();
  expect(await page.evaluate(()=>window.AlphabetLabPath.startLesson(5))).toBe(false);

  await page.locator('#pathStart').click();
  // Der allererste Schritt ist eine Lernkarte, keine Frage.
  await expect(page.locator('[data-path-step="teach"]')).toBeVisible();
  const first=await currentStep(page);
  expect(first.type).toBe('teach');
  await expect(page.locator('.path-say')).toContainText(first.say);

  const steps=await finishRun(page);
  const taught=new Set();
  for(const step of steps){
    if(step.type==='teach'){taught.add(step.letter);continue}
    // Nichts wird gefragt, bevor es gezeigt wurde.
    if(step.letter&&!step.word)expect(taught.has(step.letter),`${step.letter} wurde gefragt, bevor es gezeigt wurde`).toBeTruthy();
  }
  expect(new Set(steps.map(step=>step.id)).size,'kein Schritt darf doppelt vorkommen').toBe(steps.length);
  const words=steps.filter(step=>step.word).map(step=>step.word);
  expect(words.length).toBeGreaterThanOrEqual(5);
  expect(new Set(words).size).toBe(words.length);

  await expect(page.locator('.path-done h1')).toHaveText('Lektion 1 geschafft');
  await expect(page.locator('.path-done')).toContainText('6 von 33 Buchstaben');
  await expect(page.locator('.path-word-list li')).toHaveCount(words.length);

  // Fortschritt übersteht einen Neustart, und die Engine kennt die Buchstaben.
  await page.reload();
  await page.waitForFunction(()=>window.AlphabetLab?.version===6&&!!window.AlphabetLabPath);
  await expect(page.locator('#pathStart')).toHaveText('LEKTION 2 STARTEN');
  await expect(page.locator('[data-path-lesson="0"]')).toHaveClass(/done/);
  await expect(page.locator('[data-path-lesson="1"]')).toBeEnabled();
  await expect(page.locator('[data-path-lesson="2"]')).toBeDisabled();
  const introduced=await page.evaluate(()=>window.AlphabetLab.state().learningPlan.introducedLetters);
  for(const letter of ['А','О','К','М','Т','Е'])expect(introduced).toContain(letter);
  expect(await page.evaluate(()=>window.__ttsCalls)).toBe(0);
  expect(errors).toEqual([]);
});

test('a mistake is explained and comes back later in a different task form',async({page})=>{
  await openLab(page);
  await page.locator('#pathStart').click();
  // Bis zur ersten Auswahlfrage zu einem Buchstaben vorgehen.
  let step=await currentStep(page);
  while(step.type==='teach'){await answerStep(page);step=await currentStep(page)}
  expect(['sound','letter']).toContain(step.type);
  const before=await page.evaluate(()=>window.AlphabetLabPath.runLength());
  const wrongIndex=step.options.findIndex(option=>option!==step.correct);
  await page.locator(`[data-path-ans="${wrongIndex}"]`).click();
  await expect(page.locator('#pathFeedback')).toContainText('Noch nicht ganz');
  await expect(page.locator('#pathFeedback')).toContainText(step.letter);
  // Lösung und Fehlgriff sind sichtbar markiert, weitere Klicks zählen nicht.
  await expect(page.locator(`[data-path-ans="${wrongIndex}"]`)).toHaveClass(/wrong/);
  await expect(page.locator(`[data-path-ans="${step.options.indexOf(step.correct)}"]`)).toHaveClass(/correct/);
  await expect(page.locator(`[data-path-ans="${wrongIndex}"]`)).toBeDisabled();
  expect(await page.evaluate(()=>window.AlphabetLabPath.runLength())).toBe(before+1);
  await page.locator('#pathFeedback #pathNext').click();

  const rest=await finishRun(page);
  const retry=rest.find(later=>later.retry);
  expect(retry,'der Fehler muss noch einmal drankommen').toBeTruthy();
  expect(retry.letter).toBe(step.letter);
  expect(retry.type).not.toBe(step.type);
  expect(rest.indexOf(retry),'nicht sofort, sondern mit Abstand').toBeGreaterThanOrEqual(2);
  // Die Statistik zählt nur Erstversuche: genau einer war falsch.
  const stats=await page.locator('.path-result-grid b').first().textContent();
  const [right,total]=stats.split(' von ').map(Number);
  expect(total-right).toBe(1);
  // Die Engine hat den Fehler als Evidenz erhalten.
  const wrong=await page.evaluate(letter=>{const s=window.AlphabetLab.state().letters[letter].skills;return s.visualToSound.wrong+s.soundToLetter.wrong},step.letter);
  expect(wrong).toBeGreaterThanOrEqual(1);
});

test('reading practice brings only unread words and says so honestly when they run out',async({page})=>{
  await openLab(page);
  await page.locator('#pathStart').click();
  const lesson=await finishRun(page);
  const read=new Set(lesson.filter(step=>step.word).map(step=>step.word));
  await page.locator('#pathHome').click();
  // Lektion 1 hat zwölf Wörter; was die Lektion nicht gebraucht hat, ist noch neu.
  const fresh=await page.evaluate(()=>window.AlphabetLabPath.freshWords());
  expect(fresh).toBe(12-read.size);
  expect(fresh).toBeGreaterThanOrEqual(4);
  await expect(page.locator('#pathPractice')).toHaveAttribute('data-path-practice','fresh');
  await expect(page.locator('#pathPractice')).toContainText(`${fresh} neue Wörter`);
  await page.locator('#pathPractice').click();
  const run=await finishRun(page);
  expect(run.some(step=>step.type==='teach'),'Training erklärt nichts neu').toBeFalsy();
  const words=run.filter(step=>step.word).map(step=>step.word);
  expect(words.length).toBeGreaterThanOrEqual(4);
  for(const word of words){expect(read.has(word),`${word} wurde wiederholt, obwohl ungelesene Wörter übrig waren`).toBeFalsy();read.add(word)}
  await expect(page.locator('.path-done h1')).toHaveText('Lesetraining geschafft');
  // Nur Buchstaben aus Lektion 1 – nichts, was noch nicht eingeführt ist.
  const known=new Set(['а','о','к','м','т','е']);
  for(const word of read)for(const ch of word.toLocaleLowerCase('uk'))expect(known.has(ch),`${word} enthält ${ch}`).toBeTruthy();

  // Jetzt ist der Vorrat aufgebraucht: Der Knopf verspricht nichts Neues mehr.
  await page.locator('#pathHome').click();
  expect(await page.evaluate(()=>window.AlphabetLabPath.freshWords())).toBeLessThan(4);
  await expect(page.locator('#pathPractice')).toHaveAttribute('data-path-practice','review');
  await expect(page.locator('#pathPractice')).toHaveText('Wiederholung');
  await expect(page.locator('.path-hero')).toContainText('neue Wörter gibt es in der nächsten Lektion');
  await page.locator('#pathPractice').click();
  await finishRun(page);
  await expect(page.locator('.path-done h1')).toHaveText('Wiederholung geschafft');
});

test('short test: passing skips the lesson, failing unlocks nothing',async({page})=>{
  await openLab(page);
  // Nicht bestanden: zwei Fehler.
  await page.locator('#pathCheck').click();
  let run=await finishRun(page,{wrongAt:[0,2]});
  expect(run.some(step=>step.type==='teach')).toBeFalsy();
  expect(run.some(step=>step.retry),'der Kurztest wiederholt nichts').toBeFalsy();
  await expect(page.locator('.path-done')).toHaveAttribute('data-path-result','failed');
  await expect(page.locator('.path-done h1')).toHaveText('Noch nicht ganz');
  expect(await page.evaluate(()=>Object.keys(window.AlphabetLabPath.progress().done))).toEqual([]);
  // Der Knopf führt in die Lektion, nicht an ihr vorbei.
  await expect(page.locator('#pathContinue')).toHaveText('Lektion 1 starten');
  await page.locator('#pathContinue').click();
  await expect(page.locator('[data-path-step="teach"]')).toBeVisible();
  await page.locator('#pathQuit').click();
  await expect(page.locator('[data-path-lesson="1"]')).toBeDisabled();

  // Bestanden: ein Fehler ist erlaubt.
  await page.locator('#pathCheck').click();
  run=await finishRun(page,{wrongAt:[1]});
  await expect(page.locator('.path-done')).toHaveAttribute('data-path-result','passed');
  await expect(page.locator('.path-done h1')).toHaveText('Lektion 1 übersprungen');
  expect(await page.evaluate(()=>Object.keys(window.AlphabetLabPath.progress().done))).toEqual(['l1']);
  await page.locator('#pathHome').click();
  await expect(page.locator('#pathStart')).toHaveText('LEKTION 2 STARTEN');
});

test('quitting a lesson saves nothing and corrupt storage falls back to a clean start',async({page})=>{
  await openLab(page);
  await page.locator('#pathStart').click();
  await answerStep(page);await answerStep(page);
  await page.locator('#pathQuit').click();
  await expect(page.locator('#pathStart')).toHaveText('LOS GEHT’S');
  expect(await page.evaluate(()=>Object.keys(window.AlphabetLabPath.progress().done))).toEqual([]);

  for(const junk of ['{kaputt','42','{"done":"x","words":[1,2],"letters":null}','null']){
    await page.evaluate(([key,value])=>localStorage.setItem(key,value),[PATH_KEY,junk]);
    await page.reload();
    await page.waitForFunction(()=>window.AlphabetLab?.version===6&&!!window.AlphabetLabPath);
    await expect(page.locator('#pathStart')).toHaveText('LOS GEHT’S');
    await expect(page.locator('[data-path-lesson="1"]')).toBeDisabled();
  }
});

test('the adaptive training stays reachable and remembers whether its section is open',async({page})=>{
  await openLab(page);
  expect(await page.locator('#advancedHome').evaluate(node=>node.open)).toBe(false);
  await page.locator('#advancedHome > summary').click();
  await expect(page.getByRole('button',{name:'MEIN TRAINING STARTEN'})).toBeVisible();
  await page.reload();
  await page.waitForFunction(()=>window.AlphabetLab?.version===6&&!!window.AlphabetLabPath);
  expect(await page.locator('#advancedHome').evaluate(node=>node.open)).toBe(true);
  await page.getByRole('button',{name:'MEIN TRAINING STARTEN'}).click();
  await expect(page.getByText(/Hauptfrage/)).toBeVisible();
});

test('keyboard: number keys answer and Enter continues',async({page})=>{
  await openLab(page);
  await page.locator('#pathStart').click();
  let step=await currentStep(page);
  // Lernkarten mit Enter weiterblättern (der Fokus liegt auf „Weiter“).
  while(step.type==='teach'){await page.keyboard.press('Enter');await page.waitForFunction(id=>window.AlphabetLabPath.currentStep()?.id!==id,step.id);step=await currentStep(page)}
  await page.keyboard.press(String(step.options.indexOf(step.correct)+1));
  await expect(page.locator('#pathFeedback')).toContainText('Richtig');
  await page.waitForFunction(id=>window.AlphabetLabPath.currentStep()?.id!==id,step.id);
});

test('320 px: no horizontal overflow and comfortable touch targets on every path screen',async({page})=>{
  // Fester Zufall: Der Test soll jede Aufgabenform sicher zu sehen bekommen.
  await page.addInitScript(()=>{let a=20261119;Math.random=()=>{a=(a+0x6D2B79F5)|0;let t=Math.imul(a^(a>>>15),1|a);t=(t+Math.imul(t^(t>>>7),61|t))^t;return ((t^(t>>>14))>>>0)/4294967296}});
  await page.setViewportSize({width:320,height:568});
  await openLab(page);
  const smallTargets=()=>page.evaluate(()=>[...document.querySelectorAll('#pathStart,#pathCheck,#pathPractice,#pathNext,#pathQuit,#pathSound,#pathListen,#pathContinue,#pathHome,[data-path-lesson],[data-path-ans],[data-path-tile],[data-path-slot],#advancedHome>summary')]
    .filter(node=>node.offsetParent!==null).map(node=>{const r=node.getBoundingClientRect();return {id:node.id||node.className,w:Math.round(r.width),h:Math.round(r.height)}}).filter(box=>box.w<38||box.h<44));
  const types=new Set();
  for(const lessonNumber of [1,2]){
    expect(await noOverflow(page)).toBeTruthy();
    expect(await smallTargets()).toEqual([]);
    await page.locator('#pathStart').click();
    for(let guard=0;guard<60;guard++){
      if(await page.locator('.path-done').isVisible())break;
      const step=await currentStep(page);
      types.add(step.type);
      expect(await noOverflow(page),`Überlauf im Schritt ${step.id}`).toBeTruthy();
      expect(await smallTargets(),`zu kleine Touchfläche im Schritt ${step.id}`).toEqual([]);
      await answerStep(page);
    }
    await expect(page.locator('.path-done h1')).toHaveText(`Lektion ${lessonNumber} geschafft`);
    expect(await noOverflow(page)).toBeTruthy();
    expect(await smallTargets()).toEqual([]);
    // Die drei Ergebniskacheln stehen nebeneinander, nicht als Turm.
    const tops=await page.locator('.path-result-grid>div').evaluateAll(nodes=>nodes.map(node=>Math.round(node.getBoundingClientRect().top)));
    expect(new Set(tops).size).toBe(1);
    await page.locator('#pathHome').click();
  }
  for(const type of ['teach','sound','letter','read','say','find','build'])expect(types.has(type),`Schrittart ${type} wurde nicht geprüft`).toBeTruthy();
});

test('without the learning-path data file the app still starts with the adaptive training',async({page})=>{
  const errors=[];page.on('pageerror',error=>errors.push(String(error)));
  await page.route('**/alphabet-path-data.js*',route=>route.abort());
  await page.goto('/alphabet-lab.html?debugLearning=1');
  await page.waitForFunction(()=>window.AlphabetLab?.version===6);
  expect(await page.evaluate(()=>typeof window.AlphabetLabPath)).toBe('undefined');
  await expect(page.locator('#pathStart')).toHaveCount(0);
  await expect(page.getByRole('button',{name:'MEIN TRAINING STARTEN'})).toBeVisible();
  await page.getByRole('button',{name:'MEIN TRAINING STARTEN'}).click();
  await expect(page.getByText(/Hauptfrage/)).toBeVisible();
  expect(errors).toEqual([]);
});
