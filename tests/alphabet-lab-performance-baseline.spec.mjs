import {test} from '@playwright/test';

const twoFrames=()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));

test('capture browser performance baseline',async({page},testInfo)=>{
  test.skip(testInfo.project.name!=='chromium-desktop-1280');
  await page.addInitScript(()=>{window.__alphaLongTasks=[];try{new PerformanceObserver(list=>window.__alphaLongTasks.push(...list.getEntries().map(e=>e.duration))).observe({entryTypes:['longtask']})}catch(_){}});
  let requests=[];page.on('request',r=>requests.push(r.url()));
  await page.goto('/alphabet-lab.html?debugLearning=1',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>window.AlphabetLab?.version===5);
  const appReady=await page.evaluate(()=>performance.now());
  await page.waitForSelector('button');
  const interactive=await page.evaluate(()=>performance.now());
  const sw=await page.evaluate(async()=>{if(!('serviceWorker'in navigator))return false;await Promise.race([navigator.serviceWorker.ready,new Promise(r=>setTimeout(r,7000))]);return !!navigator.serviceWorker.controller||!!(await navigator.serviceWorker.getRegistration())});
  await page.waitForTimeout(400);
  const coldRequests=requests.length,coldJs=requests.filter(u=>/\.js(?:\?|$)/.test(u)).length;
  requests=[];await page.reload({waitUntil:'domcontentloaded'});await page.waitForFunction(()=>window.AlphabetLab?.version===5);await page.waitForTimeout(400);const warmRequests=requests.length,warmJs=requests.filter(u=>/\.js(?:\?|$)/.test(u)).length;
  const render=async action=>page.evaluate(async action=>{const start=performance.now();if(action==='home')document.querySelector('[data-nav="home"]')?.click();if(action==='alphabet')document.querySelector('[data-nav="alphabet"]')?.click();if(action==='stats')document.querySelector('[data-nav="stats"]')?.click();if(action==='question')window.AlphabetLab.startExam('quick','learning');await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));return performance.now()-start},action);
  const home=await render('home'),alphabet=await render('alphabet');
  const detail=await page.evaluate(async()=>{const start=performance.now();document.querySelector('[data-letter]')?.click();await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));return performance.now()-start});
  const stats=await render('stats'),question=await render('question');
  const storage=await page.evaluate(()=>{const base=window.AlphabetLab.state(),target=540000,raw0=JSON.stringify(base),pad=Math.max(0,target-raw0.length-30),raw=JSON.stringify({...base,__perfPadding:'x'.repeat(pad)}),rows=[];for(let i=0;i<80;i++){const a=performance.now();localStorage.setItem('__alpha_perf__',raw);rows.push(performance.now()-a)}localStorage.removeItem('__alpha_perf__');rows.sort((a,b)=>a-b);const pick=p=>rows[Math.min(rows.length-1,Math.ceil(rows.length*p)-1)];return {bytes:new Blob([raw]).size,p50:pick(.5),p95:pick(.95),max:rows.at(-1)}});
  const longMax=await page.evaluate(()=>Math.max(0,...(window.__alphaLongTasks||[])));
  console.log('ALPHABET_BROWSER_PERF '+JSON.stringify({appReadyMs:appReady,interactiveMs:interactive,serviceWorkerReady:sw,coldRequests,coldJs,warmRequests,warmJs,render:{home,alphabet,detail,stats,question},persist:storage,longTaskMaxMs:longMax}));
});
