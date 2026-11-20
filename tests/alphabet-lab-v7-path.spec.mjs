import {test,expect} from '@playwright/test';
import '../alphabet-path-data.js';

const PATH_DATA=globalThis.ALPHABET_PATH_DATA;
const lettersOf=count=>PATH_DATA.lessons.slice(0,count).flatMap(lesson=>lesson.letters);
// Wörter, die nur aus den Buchstaben der ersten n Lektionen bestehen.
const wordsUpTo=count=>{const known=new Set(lettersOf(count).map(c=>c.toLocaleLowerCase('uk')));return PATH_DATA.wordRows.filter(([word])=>[...word.toLocaleLowerCase('uk')].every(ch=>known.has(ch)||ch==='’'))};

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

// Zeichnet einen Zickzack-Strich auf die Schreibfläche.
async function drawStroke(page){
  await page.locator('#pathTraceCanvas').evaluate(canvas=>{
    const r=canvas.getBoundingClientRect(),emit=(type,x,y)=>canvas.dispatchEvent(new PointerEvent(type,{bubbles:true,cancelable:true,pointerId:1,pointerType:'touch',clientX:r.left+x,clientY:r.top+y,buttons:type==='pointerup'?0:1}));
    emit('pointerdown',r.width*.2,r.height*.25);
    for(let i=1;i<=30;i++)emit('pointermove',r.width*(.2+.6*i/30),r.height*(i%2?.75:.25));
    emit('pointerup',r.width*.8,r.height*.5);
  });
}
const stepChanged=(page,id)=>page.waitForFunction(previous=>{const now=window.AlphabetLabPath.currentStep();return !now||now.id!==previous},id);

// Beantwortet den aktuellen Schritt über die Oberfläche und geht weiter.
async function answerStep(page,{wrong=false}={}){
  const step=await currentStep(page);
  if(!step)return null;
  if(step.type==='teach'){await page.locator('#pathNext').click();return step}
  if(step.type==='listen'){
    // Externe Aufnahmen sind hier blockiert. „Ohne Ton antworten“ stellt denselben
    // Abruf sofort ohne Ton; falls die App schon selbst umgestellt hat, ist der Knopf weg.
    await page.locator('#pathNoSound').click({timeout:2000}).catch(()=>{});
    await page.waitForFunction(()=>window.AlphabetLabPath.currentStep()?.type!=='listen');
    return answerStep(page,{wrong});
  }
  if(step.type==='trace'){
    await drawStroke(page);
    await page.locator('#pathTraceDone').click();
    await page.locator('#pathFeedback #pathNext').click();
    return step;
  }
  if(step.type==='write'){
    await drawStroke(page);
    await page.locator('#pathTraceDone').click();
    await page.locator(wrong?'#pathSelfBad':'#pathSelfGood').click();
    if(wrong)await page.locator('#pathFeedback #pathNext').click();else await stepChanged(page,step.id);
    return step;
  }
  if(step.type==='type'){
    await page.locator('#pathTypeInput').fill(wrong?'qqxx':step.correct);
    await page.locator('#pathTypeSubmit').click();
    await page.locator('#pathFeedback #pathNext').click();
    return step;
  }
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
  if(wrong||step.word||step.type==='guess'){
    // Wortschritte, Fehler und der Vortest zeigen eine Auflösung und warten auf „Weiter“.
    await expect(page.locator('#pathFeedback #pathNext')).toBeVisible();
    await page.locator('#pathFeedback #pathNext').click();
  }else{
    // Richtige Buchstabenschritte laufen von selbst weiter.
    await stepChanged(page,step.id);
  }
  return step;
}
async function finishRun(page,{wrongAt=[]}={}){
  const seen=[];
  for(let guard=0;guard<70;guard++){
    if(await page.locator('.path-done').isVisible())return seen;
    const step=await answerStep(page,{wrong:wrongAt.includes(seen.length)});
    if(step)seen.push(step);
  }
  throw new Error('Durchgang endete nicht');
}
// Legt einen Lernstand an: n abgeschlossene Lektionen und – wenn angegeben – den
// Wiederholungsplan. due ist relativ zu heute (0 = heute fällig, 5 = in fünf Tagen).
async function seedProgress(page,{lessons,srs}){
  await openLab(page);
  await page.evaluate(([key,ids,plan])=>{
    const today=Math.floor((Date.now()-new Date().getTimezoneOffset()*60000)/86400000),done={};
    for(const id of ids)done[id]={at:Date.now()-3*86400000,runs:1};
    const progress={v:1,done,words:{},letters:{},sound:true};
    if(plan)progress.srs=Object.fromEntries(Object.entries(plan).map(([letter,row])=>[letter,{box:row.box,due:today+row.due,lapses:0,reviews:row.reviews||0}]));
    localStorage.setItem(key,JSON.stringify(progress));
  },[PATH_KEY,PATH_DATA.lessons.slice(0,lessons).map(lesson=>lesson.id),srs||null]);
  await page.reload();
  await page.waitForFunction(()=>window.AlphabetLab?.version===6&&!!window.AlphabetLabPath);
}
const planFor=(letters,row)=>Object.fromEntries(letters.map(letter=>[letter,row]));
const smallTargets=page=>page.evaluate(()=>[...document.querySelectorAll('#pathStart,#pathCheck,#pathPractice,#pathReview,#pathNext,#pathQuit,#pathSound,#pathListen,#pathContinue,#pathHome,#pathPlay,#pathNoSound,#pathTypeInput,#pathTypeSubmit,#pathTraceClear,#pathTraceDone,#pathTraceSkip,#pathSelfGood,#pathSelfBad,[data-path-lesson],[data-path-ans],[data-path-tile],[data-path-slot],#advancedHome>summary,#pathScience>summary')]
  .filter(node=>node.offsetParent!==null).map(node=>{const r=node.getBoundingClientRect();return {id:node.id||node.className,w:Math.round(r.width),h:Math.round(r.height)}}).filter(box=>box.w<38||box.h<44));

// Ohne Service Worker: Sonst holt er externe Aufnahmen am Test vorbei aus dem
// echten Netz, und das Ergebnis hinge davon ab, ob die Maschine Internet hat.
// Offline-Verhalten und Service Worker prüft alphabet-lab-v6-1-offline.spec.mjs.
test.use({serviceWorkers:'block'});

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
    if(step.letter&&!step.word&&!step.ungraded)expect(taught.has(step.letter),`${step.letter} wurde gefragt, bevor es gezeigt wurde`).toBeTruthy();
  }
  expect(new Set(steps.map(step=>step.id)).size,'kein Schritt darf doppelt vorkommen').toBe(steps.length);
  // Lektion 1 enthält bereits freien Abruf: mindestens ein Wort wird getippt.
  expect(steps.some(step=>step.type==='type')).toBeTruthy();
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
  // Was die Lektion von den Wörtern aus ihren sechs Buchstaben nicht gebraucht hat, ist noch neu.
  const fresh=await page.evaluate(()=>window.AlphabetLabPath.freshWords());
  expect(fresh).toBe(wordsUpTo(1).length-read.size);
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
  await page.addInitScript(()=>{let a=20261120;Math.random=()=>{a=(a+0x6D2B79F5)|0;let t=Math.imul(a^(a>>>15),1|a);t=(t+Math.imul(t^(t>>>7),61|t))^t;return ((t^(t>>>14))>>>0)/4294967296}});
  await page.setViewportSize({width:320,height:568});
  await openLab(page);
  const types=new Set();
  for(const lessonNumber of [1,2]){
    expect(await noOverflow(page)).toBeTruthy();
    expect(await smallTargets(page)).toEqual([]);
    await page.locator('#pathStart').click();
    for(let guard=0;guard<70;guard++){
      if(await page.locator('.path-done').isVisible())break;
      const step=await currentStep(page);
      types.add(step.type);
      expect(await noOverflow(page),`Überlauf im Schritt ${step.id}`).toBeTruthy();
      expect(await smallTargets(page),`zu kleine Touchfläche im Schritt ${step.id}`).toEqual([]);
      await answerStep(page);
    }
    await expect(page.locator('.path-done h1')).toHaveText(`Lektion ${lessonNumber} geschafft`);
    expect(await noOverflow(page)).toBeTruthy();
    expect(await smallTargets(page)).toEqual([]);
    // Die drei Ergebniskacheln stehen nebeneinander, nicht als Turm.
    const tops=await page.locator('.path-result-grid>div').evaluateAll(nodes=>nodes.map(node=>Math.round(node.getBoundingClientRect().top)));
    expect(new Set(tops).size).toBe(1);
    await page.locator('#pathHome').click();
  }
  for(const type of ['teach','guess','sound','letter','read','say','type','find','build'])expect(types.has(type),`Schrittart ${type} wurde nicht geprüft`).toBeTruthy();
  // Die Methodenübersicht lässt sich aufklappen, ohne das Layout zu sprengen.
  await page.locator('#pathScience>summary').click();
  await expect(page.locator('#pathScience li')).toHaveCount(6);
  expect(await noOverflow(page)).toBeTruthy();
});

test('without the learning-path bundle the app still starts with the adaptive training',async({page})=>{
  const errors=[];page.on('pageerror',error=>errors.push(String(error)));
  await page.route('**/alphabet-path.bundle.js*',route=>route.abort());
  await page.goto('/alphabet-lab.html?debugLearning=1');
  await page.waitForFunction(()=>window.AlphabetLab?.version===6);
  expect(await page.evaluate(()=>typeof window.AlphabetLabPath)).toBe('undefined');
  await expect(page.locator('#pathStart')).toHaveCount(0);
  await expect(page.getByRole('button',{name:'MEIN TRAINING STARTEN'})).toBeVisible();
  await page.getByRole('button',{name:'MEIN TRAINING STARTEN'}).click();
  await expect(page.getByText(/Hauptfrage/)).toBeVisible();
  expect(errors).toEqual([]);
});

// ------------------------------------------------------------------ V7.1
// Belegte Lernmethoden: Vortest, freier Abruf, Handschrift, Hören, verteiltes
// Wiederholen. Geprüft wird das Verhalten an der Oberfläche, nicht die Lernwirkung.

test('false friends: guessing first is explained, clearly ungraded and never counted as a mistake',async({page})=>{
  await seedProgress(page,{lessons:1,srs:planFor(lettersOf(1),{box:2,due:3})});
  await page.locator('#pathStart').click();
  // Erst zwei Aufwärmwörter aus Lektion 1, dann der Vortest zum ersten neuen Buchstaben.
  let guess=await currentStep(page);
  for(let guard=0;guard<4&&guess.type!=='guess';guard++){expect(guess.word,'vor dem Vortest stehen nur Aufwärmwörter').toBeTruthy();await answerStep(page);guess=await currentStep(page)}
  expect(guess.type).toBe('guess');
  expect(guess.ungraded).toBe(true);
  await expect(page.locator('.path-stage .eyebrow')).toContainText('zählt nicht');
  // Auf die Falle hereinfallen: die lateinische Lesung wählen.
  await page.locator(`[data-path-ans="${guess.options.indexOf(guess.trap)}"]`).click();
  await expect(page.locator('#pathFeedback')).toContainText('Genau die Falle');
  await expect(page.locator('#pathFeedback')).toContainText(`„${guess.correct}“`);
  const before=await page.evaluate(()=>window.AlphabetLabPath.runLength());
  await page.locator('#pathFeedback #pathNext').click();
  // Direkt danach kommt die Lernkarte desselben Buchstabens – und keine Strafwiederholung.
  const teach=await currentStep(page);
  expect(teach.type).toBe('teach');expect(teach.letter).toBe(guess.letter);
  expect(await page.evaluate(()=>window.AlphabetLabPath.runLength())).toBe(before);
  const rest=await finishRun(page);
  expect(rest.some(step=>step.retry)).toBeFalsy();
  const [right,total]=(await page.locator('.path-result-grid b').first().textContent()).split(' von ').map(Number);
  expect(right).toBe(total);
  // Kein Fehler in der Engine, kein Rückfall im Wiederholungsplan.
  const wrong=await page.evaluate(letter=>{const skills=window.AlphabetLab.state().letters[letter].skills;return skills.visualToSound.wrong+skills.soundToLetter.wrong},guess.letter);
  expect(wrong).toBe(0);
  await expect(page.locator('#pathSpacing')).toContainText('Morgen');
});

test('typed recall: tolerant about spelling variants, strict about the look-alike trap',async({page})=>{
  await seedProgress(page,{lessons:1,srs:planFor(lettersOf(1),{box:2,due:3})});
  await page.locator('#pathStart').click();
  let step=await currentStep(page);
  for(let guard=0;guard<40&&step.type!=='type';guard++){await answerStep(page);step=await currentStep(page)}
  expect(step.type).toBe('type');
  await expect(page.locator('#pathTypeInput')).toBeVisible();
  // Leere Eingabe zählt nicht als Antwort.
  await page.locator('#pathTypeSubmit').click();
  await expect(page.locator('#pathFeedback #pathNext')).toHaveCount(0);
  // Die Falle: kyrillische Zeichen lateinisch gelesen (ресторан → „pectopah“).
  const latin={'н':'h','р':'p','с':'c','в':'b','у':'y','х':'x'};
  const fooled=[...step.word.toLocaleLowerCase('uk')].map((ch,i)=>latin[ch]||step.breakdown[i].say[0]).join('');
  expect(fooled).not.toBe(step.correct);
  const length=await page.evaluate(()=>window.AlphabetLabPath.runLength());
  await page.locator('#pathTypeInput').fill(fooled);
  await page.locator('#pathTypeInput').press('Enter');
  await expect(page.locator('#pathFeedback')).toContainText('Noch nicht ganz');
  await expect(page.locator('#pathFeedback')).toContainText(`„${fooled}“`);
  await expect(page.locator('#pathFeedback')).toContainText(`„${step.correct}“`);
  await expect(page.locator('#pathTypeInput')).toBeDisabled();
  await expect(page.locator('#pathTypeInput')).toHaveClass(/wrong/);
  // Der Fehler kommt später in anderer Form wieder.
  expect(await page.evaluate(()=>window.AlphabetLabPath.runLength())).toBe(length+1);
  await page.locator('#pathFeedback #pathNext').click();
  const rest=await finishRun(page);
  const retry=rest.find(later=>later.retry&&later.word===step.word);
  expect(retry).toBeTruthy();expect(retry.type).not.toBe('type');

  // Zweiter Durchgang derselben Lektion: Großschreibung und Leerzeichen sind egal.
  await page.locator('#pathHome').click();
  await page.locator('[data-path-lesson="1"]').click();
  step=await currentStep(page);
  for(let guard=0;guard<40&&step.type!=='type';guard++){await answerStep(page);step=await currentStep(page)}
  await page.locator('#pathTypeInput').fill(`  ${step.correct.toUpperCase()} `);
  await page.locator('#pathTypeSubmit').click();
  await expect(page.locator('#pathFeedback')).toContainText('Richtig');
  await expect(page.locator('#pathTypeInput')).toHaveClass(/correct/);
  await expect(page.locator('#pathFeedback .path-solution')).toContainText(step.meaning);
});

test('handwriting: new shapes are traced after the teaching card, can be skipped and are not graded',async({page})=>{
  await seedProgress(page,{lessons:3,srs:planFor(lettersOf(3),{box:2,due:3})});
  await page.locator('#pathStart').click();
  let step=await currentStep(page);
  for(let guard=0;guard<10&&step.type!=='trace';guard++){expect(['read','type','say','find','teach']).toContain(step.type);await answerStep(page);step=await currentStep(page)}
  expect(step.type).toBe('trace');
  await expect(page.locator('#pathTraceCanvas')).toBeVisible();
  expect(await page.locator('#pathTraceCanvas').evaluate(node=>getComputedStyle(node).touchAction)).toBe('none');
  // Ohne Strich geht „Fertig“ nicht; ein Tupfer reicht nicht.
  await expect(page.locator('#pathTraceDone')).toBeDisabled();
  await page.locator('#pathTraceCanvas').evaluate(canvas=>{const r=canvas.getBoundingClientRect();for(const type of ['pointerdown','pointerup'])canvas.dispatchEvent(new PointerEvent(type,{bubbles:true,pointerId:1,clientX:r.left+50,clientY:r.top+50,buttons:type==='pointerup'?0:1}))});
  await expect(page.locator('#pathTraceDone')).toBeDisabled();
  await drawStroke(page);
  await expect(page.locator('#pathTraceDone')).toBeEnabled();
  // „Löschen“ setzt zurück.
  await page.locator('#pathTraceClear').click();
  await expect(page.locator('#pathTraceDone')).toBeDisabled();
  await drawStroke(page);
  await page.locator('#pathTraceDone').click();
  await expect(page.locator('#pathFeedback #pathNext')).toBeVisible();
  await page.locator('#pathFeedback #pathNext').click();
  expect((await currentStep(page)).id).not.toBe(step.id);

  // Der nächste Buchstabe: Überspringen blockiert niemanden.
  step=await currentStep(page);
  for(let guard=0;guard<10&&step.type!=='trace';guard++){await answerStep(page);step=await currentStep(page)}
  await page.locator('#pathTraceSkip').click();
  expect((await currentStep(page)).id).not.toBe(step.id);
  await finishRun(page);
  const [right,total]=(await page.locator('.path-result-grid b').first().textContent()).split(' von ').map(Number);
  expect(right).toBe(total);
  expect(await page.evaluate(()=>window.__ttsCalls)).toBe(0);
});

test('spaced review: due letters come first, correct recalls move on, a miss comes back tomorrow',async({page})=>{
  const letters=lettersOf(1);
  // Fach 1, reviews 0 → Auswahlform (Laut); alle heute fällig.
  await seedProgress(page,{lessons:1,srs:planFor(letters,{box:1,due:0})});
  await expect(page.locator('.path-hero')).toHaveAttribute('data-path-hero','review');
  await expect(page.locator('.path-hero .eyebrow')).toContainText(`${letters.length} Buchstaben`);
  await expect(page.locator('#pathReview')).toBeVisible();
  // Die nächste Lektion bleibt erreichbar, ist aber nicht mehr der erste Knopf.
  await expect(page.locator('#pathStart')).toHaveText('Lektion 2');
  expect(await page.evaluate(()=>window.AlphabetLabPath.dueLetters().length)).toBe(letters.length);
  await page.locator('#pathReview').click();
  const run=await finishRun(page,{wrongAt:[0]});
  const graded=run.filter(step=>!step.retry);
  expect(graded.length).toBe(letters.length);
  expect(new Set(graded.map(step=>step.srsLetter)).size).toBe(letters.length);
  expect(run.some(step=>step.type==='teach'||step.ungraded),'Auffrischung ist reiner Abruf').toBeFalsy();
  await expect(page.locator('.path-done h1')).toHaveText('Auffrischung geschafft');
  await expect(page.locator('.path-done')).toHaveAttribute('data-path-kind','review');
  await expect(page.locator('#pathSpacing')).toContainText('morgen');
  const plan=await page.evaluate(()=>{const today=Math.floor((Date.now()-new Date().getTimezoneOffset()*60000)/86400000),srs=window.AlphabetLabPath.progress().srs;return Object.fromEntries(Object.entries(srs).map(([letter,row])=>[letter,{box:row.box,inDays:row.due-today,lapses:row.lapses}]))});
  const missed=graded[0].srsLetter;
  for(const letter of letters){
    if(letter===missed)expect(plan[letter]).toEqual({box:1,inDays:1,lapses:1});
    else expect(plan[letter]).toEqual({box:2,inDays:3,lapses:0});
  }
  // Heute ist nichts mehr fällig: Die Startseite führt wieder zur nächsten Lektion.
  await page.locator('#pathHome').click();
  await expect(page.locator('.path-hero')).toHaveAttribute('data-path-hero','lesson');
  await expect(page.locator('#pathReview')).toHaveCount(0);
  await expect(page.locator('#pathStart')).toHaveText('LEKTION 2 STARTEN');
  await expect(page.locator('.path-hero .path-meta')).toContainText('Nächste Auffrischung morgen');
  // Nach einem Neustart ist der Plan noch da.
  await page.reload();
  await page.waitForFunction(()=>!!window.AlphabetLabPath);
  expect(await page.evaluate(letter=>window.AlphabetLabPath.progress().srs[letter].box,missed)).toBe(1);
});

test('progress saved before the review plan existed becomes due instead of being lost',async({page})=>{
  await seedProgress(page,{lessons:2});
  await expect(page.locator('.path-hero')).toHaveAttribute('data-path-hero','review');
  expect(await page.evaluate(()=>window.AlphabetLabPath.dueLetters().length)).toBe(lettersOf(2).length);
  // Eine frisch abgeschlossene Lektion ist dagegen erst morgen fällig.
  await page.evaluate(key=>localStorage.removeItem(key),PATH_KEY);
  await page.reload();
  await page.waitForFunction(()=>!!window.AlphabetLabPath);
  await page.locator('#pathStart').click();
  await finishRun(page);
  await page.locator('#pathHome').click();
  await expect(page.locator('.path-hero')).toHaveAttribute('data-path-hero','lesson');
  expect(await page.evaluate(()=>window.AlphabetLabPath.dueLetters().length)).toBe(0);
  // „Morgen“: die gespeicherten Fälligkeiten liegen dann einen Tag zurück.
  await page.evaluate(key=>{const progress=JSON.parse(localStorage.getItem(key));for(const row of Object.values(progress.srs))row.due-=1;localStorage.setItem(key,JSON.stringify(progress))},PATH_KEY);
  await page.reload();
  await page.waitForFunction(()=>!!window.AlphabetLabPath);
  await expect(page.locator('.path-hero')).toHaveAttribute('data-path-hero','review');
  expect(await page.evaluate(()=>window.AlphabetLabPath.dueLetters().length)).toBe(lettersOf(1).length);
});

test('writing from memory uses an honest self-check and offers a way without drawing',async({page})=>{
  const letters=lettersOf(4);
  // Fach 3, reviews 1 → Schreiben aus dem Gedächtnis für die fälligen Buchstaben.
  const srs={...planFor(letters,{box:3,due:9}),'Б':{box:3,due:0,reviews:1},'Д':{box:3,due:0,reviews:1}};
  await seedProgress(page,{lessons:4,srs});
  await page.locator('#pathReview').click();
  let step=await currentStep(page);
  expect(step.type).toBe('write');
  // Weder Prompt noch Fläche verraten die Form.
  await expect(page.locator('.path-stage .prompt')).not.toContainText(step.letter);
  await expect(page.locator('#pathSelfGood')).toHaveCount(0);
  await drawStroke(page);
  await page.locator('#pathTraceDone').click();
  await expect(page.locator('#pathFeedback')).toContainText('Vergleiche');
  await page.locator('#pathSelfBad').click();
  await expect(page.locator('#pathFeedback')).toContainText('Noch nicht ganz');
  await expect(page.locator('#pathFeedback')).toContainText(step.letter);
  await page.locator('#pathFeedback #pathNext').click();
  const first=step.letter;
  // Zweiter Buchstabe: ohne Zeichnen antworten → derselbe Abruf als Auswahl.
  step=await currentStep(page);
  expect(step.type).toBe('write');
  await page.locator('#pathTraceSkip').click();
  const fallback=await currentStep(page);
  expect(fallback.type).toBe('letter');expect(fallback.letter).toBe(step.letter);expect(fallback.srsLetter).toBe(step.letter);
  await finishRun(page);
  const boxes=await page.evaluate(()=>{const srs=window.AlphabetLabPath.progress().srs;return {b:srs['Б'].box,d:srs['Д'].box}});
  expect(first==='Б'?boxes.b:boxes.d).toBe(1);
  expect(first==='Б'?boxes.d:boxes.b).toBe(4);
});

test('listening: without a reachable recording or with sound off the same recall works silently',async({page})=>{
  const letters=lettersOf(1);
  // Fach 1, reviews 1 → Hören.
  await seedProgress(page,{lessons:1,srs:{...planFor(letters,{box:2,due:5}),'К':{box:1,due:0,reviews:1}}});
  await page.locator('#pathReview').click();
  // Die Aufnahme ist im Test blockiert: Die App stellt den Schritt von selbst ohne
  // Ton – sofort bei einem Ladefehler, spätestens nach fünf Sekunden ohne Ton.
  expect((await currentStep(page)).type).toBe('listen');
  await page.waitForFunction(()=>window.AlphabetLabPath.currentStep()?.type==='letter',null,{timeout:12000});
  const step=await currentStep(page);
  expect(step.letter).toBe('К');expect(step.srsLetter).toBe('К');
  await expect(page.locator('#pathPlay')).toHaveCount(0);
  await answerStep(page);
  await expect(page.locator('.path-done h1')).toHaveText('Auffrischung geschafft');
  expect(await page.evaluate(()=>window.AlphabetLabPath.progress().srs['К'].box)).toBe(2);
  expect(await page.evaluate(()=>window.__ttsCalls)).toBe(0);

  // Ton ausgeschaltet: Die Hör-Aufgabe wird gar nicht erst gestellt.
  await seedProgress(page,{lessons:1,srs:{...planFor(letters,{box:2,due:5}),'М':{box:1,due:0,reviews:1}}});
  await page.evaluate(key=>{const progress=JSON.parse(localStorage.getItem(key));progress.sound=false;localStorage.setItem(key,JSON.stringify(progress))},PATH_KEY);
  await page.reload();
  await page.waitForFunction(()=>!!window.AlphabetLabPath);
  await page.locator('#pathReview').click();
  expect((await currentStep(page)).type).toBe('letter');
  await expect(page.locator('#pathSound')).toHaveAttribute('aria-pressed','false');
});

test('listening with a human recording: answers unlock only after the sound was actually heard',async({page,browserName})=>{
  test.skip(browserName!=='chromium','Wiedergabe einer eingespielten WAV-Datei wird nur in Chromium geprüft');
  // Stellvertretend für die externe Originalaufnahme: 0,3 s Stille als WAV.
  const samples=2400,wav=Buffer.alloc(44+samples*2);
  wav.write('RIFF',0);wav.writeUInt32LE(36+samples*2,4);wav.write('WAVEfmt ',8);wav.writeUInt32LE(16,16);wav.writeUInt16LE(1,20);wav.writeUInt16LE(1,22);wav.writeUInt32LE(8000,24);wav.writeUInt32LE(16000,28);wav.writeUInt16LE(2,32);wav.writeUInt16LE(16,34);wav.write('data',36);wav.writeUInt32LE(samples*2,40);
  let requested=0;
  await page.route(url=>!/^https?:\/\/127\.0\.0\.1/.test(url.href),route=>{requested++;return route.fulfill({status:200,contentType:'audio/wav',body:wav})});
  await seedProgress(page,{lessons:1,srs:{...planFor(lettersOf(1),{box:2,due:5}),'К':{box:1,due:0,reviews:1}}});
  await page.locator('#pathReview').click();
  const step=await currentStep(page);
  expect(step.type).toBe('listen');
  await expect(page.locator('#pathPlay')).toBeVisible();
  expect(await page.locator('#pathPlay').getAttribute('data-audio-source')).toBe('human');
  // Der Prompt nennt weder Buchstaben noch Laut – man muss hören.
  await expect(page.locator('.path-stage .prompt')).toHaveText('Hör zu: Welcher Buchstabe ist das?');
  await page.locator('#pathPlay').click();
  await expect(page.locator(`[data-path-ans="${step.options.indexOf(step.correct)}"]`)).toBeEnabled();
  expect(requested).toBeGreaterThan(0);
  await page.locator(`[data-path-ans="${step.options.indexOf(step.correct)}"]`).click();
  await expect(page.locator('.path-done h1')).toHaveText('Auffrischung geschafft');
  expect(await page.evaluate(()=>window.AlphabetLabPath.progress().srs['К'].box)).toBe(2);
  expect(await page.evaluate(()=>window.__ttsCalls)).toBe(0);
});

test('320 px: writing, typing and review screens fit and stay tappable',async({page})=>{
  await page.setViewportSize({width:320,height:568});
  const letters=lettersOf(8);
  const srs={...planFor(letters,{box:3,due:9}),'Ж':{box:3,due:0,reviews:1},'Щ':{box:3,due:0,reviews:0},'Ю':{box:1,due:0,reviews:0}};
  await seedProgress(page,{lessons:8,srs});
  await expect(page.locator('.path-hero')).toHaveAttribute('data-path-hero','review');
  expect(await noOverflow(page)).toBeTruthy();
  expect(await smallTargets(page)).toEqual([]);
  await page.locator('#pathReview').click();
  const types=new Set();
  for(let guard=0;guard<12;guard++){
    if(await page.locator('.path-done').isVisible())break;
    const step=await currentStep(page);
    types.add(step.type);
    expect(await noOverflow(page),`Überlauf im Schritt ${step.id}`).toBeTruthy();
    expect(await smallTargets(page),`zu kleine Touchfläche im Schritt ${step.id}`).toEqual([]);
    if(step.type==='write'){
      // Auch die Selbstkontrolle nach dem Schreiben muss passen.
      await drawStroke(page);await page.locator('#pathTraceDone').click();
      expect(await noOverflow(page)).toBeTruthy();
      expect(await smallTargets(page)).toEqual([]);
      await page.locator('#pathSelfGood').click();
      await stepChanged(page,step.id);
    }else await answerStep(page);
  }
  for(const type of ['write','type','sound'])expect(types.has(type),`Schrittart ${type} wurde nicht geprüft`).toBeTruthy();
  await expect(page.locator('.path-done h1')).toHaveText('Auffrischung geschafft');
  expect(await noOverflow(page)).toBeTruthy();
  expect(await smallTargets(page)).toEqual([]);
  // Lektion mit Nachschreiben (Lektion 7 noch einmal): die Schreibfläche mit Vorlage.
  await page.locator('#pathHome').click();
  await page.locator('[data-path-lesson="6"]').click();
  let step=await currentStep(page);
  for(let guard=0;guard<10&&step.type!=='trace';guard++){await answerStep(page);step=await currentStep(page)}
  expect(step.type).toBe('trace');
  expect(await noOverflow(page)).toBeTruthy();
  expect(await smallTargets(page)).toEqual([]);
  const box=await page.locator('#pathTraceCanvas').boundingBox();
  expect(box.width).toBeGreaterThanOrEqual(240);expect(box.height).toBeGreaterThanOrEqual(170);
});
