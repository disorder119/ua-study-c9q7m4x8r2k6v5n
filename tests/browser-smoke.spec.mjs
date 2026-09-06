import {test,expect} from '@playwright/test';

const APP='/ukrainischkurs-app.html';

async function waitHealthy(page){
  await page.waitForFunction(()=>window.UKRAINIAN_COURSE_SELFTEST?.releaseVersion===59,{timeout:30000});
  const state=await page.evaluate(()=>({
    loader:window.UKRAINIAN_COURSE_LOADER?.version,
    ok:window.UKRAINIAN_COURSE_SELFTEST?.ok,
    problems:window.UKRAINIAN_COURSE_SELFTEST?.problems||[],
    length:Array.isArray(window.D)?window.D.length:D.length,
    ui:window.UKRAINIAN_DYNAMIC_COURSE_UI?.length,
    modes:window.UKRAINIAN_EXAM_DASHBOARD?.modes||[]
  }));
  expect(state.loader).toBe(59);
  expect(state.ok,state.problems.join('\n')).toBe(true);
  expect(state.length).toBe(180);
  expect(state.ui).toBe(180);
  expect(state.modes).toEqual(['quick','standard','full','weak']);
}

function minimalState(day){
  return {
    version:5,day,known:{},sentences:{},done:{},lessonProgress:{},dates:[],history:{},voiceRate:.72,
    writing:{date:'',count:0,target:10,letter:0},
    daily:{date:'',listened:false,spoken:false,game:false,newSeen:false,recall:false,dialog:false}
  };
}

test('vollständiger Start ist in Chromium/WebKit fehlerfrei und mobil ohne Horizontal-Overflow',async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(APP,{waitUntil:'domcontentloaded'});await waitHealthy(page);
  expect(errors).toEqual([]);
  const ui=await page.evaluate(()=>({
    label:document.getElementById('label')?.textContent||'',
    overflow:document.documentElement.scrollWidth-window.innerWidth,
    dashboard:!!document.getElementById('examDashboard'),
    continuity:!!document.getElementById('deviceContinuity')
  }));
  expect(ui.label).toContain('180');
  expect(ui.overflow).toBeLessThanOrEqual(2);
  expect(ui.dashboard).toBe(true);
  expect(ui.continuity).toBe(true);
});

test('gespeicherter später Kurstag 180 bleibt über echte Reloads erhalten',async({page})=>{
  await page.addInitScript(state=>localStorage.setItem('ukrainischkurs-joel-v4',JSON.stringify(state)),minimalState(179));
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(APP,{waitUntil:'domcontentloaded'});await waitHealthy(page);
  let restored=await page.evaluate(()=>({day:s.day,...window.UKRAINIAN_DEFERRED_DAY_RESTORE}));
  expect(restored.captured).toBe(179);expect(restored.day).toBe(179);expect(['restored','already-correct']).toContain(restored.status);
  await page.reload({waitUntil:'domcontentloaded'});await waitHealthy(page);
  restored=await page.evaluate(()=>({day:s.day,...window.UKRAINIAN_DEFERRED_DAY_RESTORE}));
  expect(restored.day).toBe(179);expect(restored.captured).toBe(179);expect(errors).toEqual([]);
});

test('zusätzlicher Modul-Lernstand überlebt Speichern und Reload',async({page})=>{
  await page.goto(APP,{waitUntil:'domcontentloaded'});await waitHealthy(page);
  await page.evaluate(()=>{
    s.day=77;
    s.examDashboard={version:1,history:[{id:123,date:'2026-09-06',day:77,courseDone:70,mode:'quick',score:80,correct:8,total:10,passed:true,domains:{}}]};
    s.auditMarker={nested:{value:'bleibt-erhalten'}};
    save();
  });
  await page.reload({waitUntil:'domcontentloaded'});await waitHealthy(page);
  const persisted=await page.evaluate(()=>({day:s.day,history:s.examDashboard?.history?.length,marker:s.auditMarker?.nested?.value}));
  expect(persisted).toEqual({day:77,history:1,marker:'bleibt-erhalten'});
});

test('Kursprozent basiert auf abgeschlossenem Pfad und fällt beim Zurückblättern nicht ab',async({page})=>{
  await page.goto(APP,{waitUntil:'domcontentloaded'});await waitHealthy(page);
  const pct=await page.evaluate(()=>{
    s.done={};for(let i=0;i<100;i++)s.done[i]=true;s.day=10;
    return window.UKRAINIAN_EXAM_DASHBOARD.coursePercent();
  });
  expect(pct).toBe(56);
});

test('Blitzprüfung erzwingt Hören, lässt sich vollständig durchführen und speichert Ergebnis',async({page})=>{
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(APP,{waitUntil:'domcontentloaded'});await waitHealthy(page);
  await page.evaluate(()=>{s.day=30;window.UKRAINIAN_EXAM_DASHBOARD.start('quick')});
  await expect(page.locator('#examSimulationBox')).toBeVisible();
  await page.locator('#examSimulationBox [data-choice]').first().click();
  await expect(page.locator('#edPlay')).toBeVisible();
  const listeningChoices=page.locator('#examSimulationBox [data-choice]');
  await expect(listeningChoices.first()).toBeDisabled();
  await page.locator('#edPlay').click();
  await expect(listeningChoices.first()).toBeEnabled();
  await listeningChoices.first().click();

  for(let guard=0;guard<20;guard++){
    if(await page.locator('#edAgain').count())break;
    const play=page.locator('#edPlay');
    if(await play.count()){
      const choice=page.locator('#examSimulationBox [data-choice]').first();
      if(await choice.isDisabled())await play.click();
      await expect(choice).toBeEnabled();await choice.click();continue;
    }
    const spoken=page.locator('#edSpoken');
    if(await spoken.count()&&!(await spoken.textContent()).includes('✓'))await spoken.click();
    const input=page.locator('#edExamInput');
    if(await input.count()){await input.fill('тест');await page.locator('#edSubmit').click();continue}
    const choice=page.locator('#examSimulationBox [data-choice]').first();
    if(await choice.count()){await choice.click();continue}
    throw new Error('Unbekannter Prüfungszustand');
  }
  await expect(page.locator('#edAgain')).toBeVisible();
  expect(await page.evaluate(()=>s.examDashboard.history.length)).toBe(1);
  await page.reload({waitUntil:'domcontentloaded'});await waitHealthy(page);
  expect(await page.evaluate(()=>s.examDashboard.history.length)).toBe(1);
  expect(errors).toEqual([]);
});

test('Abgebrochene Prüfung schreibt kein falsches Ergebnis',async({page})=>{
  await page.goto(APP,{waitUntil:'domcontentloaded'});await waitHealthy(page);
  await page.evaluate(()=>{s.day=35;window.UKRAINIAN_EXAM_DASHBOARD.start('standard')});
  const before=await page.evaluate(()=>s.examDashboard.history.length);
  page.once('dialog',d=>d.accept());await page.locator('#edAbort').click();
  await expect(page.locator('#examSimulationBox')).toBeHidden();
  expect(await page.evaluate(()=>s.examDashboard.history.length)).toBe(before);
});

test('Gerätewechsel-Code macht lokalen Lernstand verlustfrei prüfbar',async({page})=>{
  await page.goto(APP,{waitUntil:'domcontentloaded'});await waitHealthy(page);
  const result=await page.evaluate(async()=>{
    s.day=88;s.examDashboard={version:1,history:[{id:1,mode:'quick',score:90,domains:{}}]};save();
    const api=window.UKRAINIAN_DEVICE_CONTINUITY,code=await api.makeQuickCode(s),parsed=await api.parseQuickCode(code);
    let corruptRejected=false;try{await api.parseQuickCode(code.slice(0,-1)+(code.endsWith('A')?'B':'A'))}catch{corruptRejected=true}
    return {day:parsed.progress.day,history:parsed.progress.examDashboard?.history?.length,corruptRejected,automatic:api.automaticCloudSync,checksum:api.checksum};
  });
  expect(result.day).toBe(88);expect(result.history).toBe(1);expect(result.corruptRejected).toBe(true);expect(result.automatic).toBe(false);expect(result.checksum).toBe(true);
});

test('Service Worker kann die vollständige App offline erneut starten',async({page,context},testInfo)=>{
  test.skip(testInfo.project.name!=='chromium-desktop','Offline-PWA wird stabil in Chromium geprüft; WebKit wird separat als UI-/Laufzeitbrowser geprüft.');
  await page.goto(APP,{waitUntil:'load'});await waitHealthy(page);
  await page.evaluate(()=>navigator.serviceWorker.ready.then(()=>true));
  await page.reload({waitUntil:'load'});
  await page.waitForFunction(()=>!!navigator.serviceWorker.controller,{timeout:20000});
  await context.setOffline(true);
  try{
    await page.reload({waitUntil:'domcontentloaded',timeout:30000});await waitHealthy(page);
    await expect(page.locator('h1')).toContainText('Ukrainisch');
  }finally{await context.setOffline(false)}
});