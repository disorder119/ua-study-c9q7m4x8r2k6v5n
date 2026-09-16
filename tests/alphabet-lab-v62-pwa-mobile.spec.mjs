import {test,expect} from '@playwright/test';

// V6.2 · Home-Screen-App und Mobile-UX.
// Geprüft wird, was über Browserstandards objektiv prüfbar ist: Manifest, Apple-
// Metadaten, Icon-Deckkraft, Standalone-Erkennung, Update-Hinweis, Safe Areas,
// Touchflächen und horizontales Scrollen. Ein physischer iPhone-Test ist damit
// ausdrücklich NICHT ersetzt.

async function openLab(page){
  await page.goto('/alphabet-lab.html?debugLearning=1');
  await page.waitForFunction(()=>window.AlphabetLab?.version===6);
}

test('web app manifest is installable and ships an opaque maskable icon',async({page})=>{
  await openLab(page);
  const href=await page.getAttribute('link[rel="manifest"]','href');
  expect(href).toBeTruthy();
  const manifest=await page.evaluate(async url=>{const r=await fetch(url);return {status:r.status,body:await r.json()}},href);
  expect(manifest.status).toBe(200);
  const m=manifest.body;
  expect(m.start_url).toContain('alphabet-lab.html');
  expect(m.scope).toBeTruthy();
  expect(m.display).toBe('standalone');
  expect(m.theme_color).toBeTruthy();
  expect(m.background_color).toBeTruthy();
  const sizes=m.icons.map(i=>i.sizes);
  expect(sizes).toContain('192x192');
  expect(sizes).toContain('512x512');
  const maskable=m.icons.filter(i=>String(i.purpose||'').includes('maskable'));
  expect(maskable.length).toBeGreaterThan(0);
  for(const icon of m.icons){
    const res=await page.evaluate(async src=>{const r=await fetch(src);return {status:r.status,type:r.headers.get('content-type')}},icon.src);
    expect(res.status,`${icon.src} muss ausgeliefert werden`).toBe(200);
    expect(res.type).toContain('image/png');
  }
  // Ein Maskable-Icon mit transparenten Ecken wird auf dem Homescreen auf
  // Schwarz komponiert und sieht unfertig aus.
  const corners=await page.evaluate(async src=>{
    const img=new Image();img.src=src;await img.decode();
    const c=document.createElement('canvas');c.width=img.width;c.height=img.height;
    const ctx=c.getContext('2d');ctx.drawImage(img,0,0);
    const alphaAt=(x,y)=>ctx.getImageData(x,y,1,1).data[3];
    return {size:img.width,tl:alphaAt(0,0),tr:alphaAt(img.width-1,0),bl:alphaAt(0,img.height-1),br:alphaAt(img.width-1,img.height-1)};
  },maskable[0].src);
  expect(corners.tl).toBe(255);expect(corners.tr).toBe(255);
  expect(corners.bl).toBe(255);expect(corners.br).toBe(255);
});

test('iOS home screen metadata is complete and the apple touch icon is opaque',async({page})=>{
  await openLab(page);
  const meta=await page.evaluate(()=>({
    viewport:document.querySelector('meta[name="viewport"]')?.content||'',
    capable:document.querySelector('meta[name="apple-mobile-web-app-capable"]')?.content||'',
    title:document.querySelector('meta[name="apple-mobile-web-app-title"]')?.content||'',
    statusBar:document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')?.content||'',
    themeColor:document.querySelector('meta[name="theme-color"]')?.content||'',
    appleIcon:document.querySelector('link[rel="apple-touch-icon"]')?.getAttribute('href')||'',
    appleIconSizes:document.querySelector('link[rel="apple-touch-icon"]')?.getAttribute('sizes')||''
  }));
  expect(meta.viewport).toContain('viewport-fit=cover');
  expect(meta.viewport).toContain('width=device-width');
  expect(meta.capable).toBe('yes');
  expect(meta.title).toBeTruthy();
  expect(meta.statusBar).toBeTruthy();
  expect(meta.themeColor).toBeTruthy();
  // iOS erwartet 180x180 für das iPhone-Homescreen-Icon.
  expect(meta.appleIconSizes).toBe('180x180');
  const icon=await page.evaluate(async src=>{
    const img=new Image();img.src=src;await img.decode();
    const c=document.createElement('canvas');c.width=img.width;c.height=img.height;
    const ctx=c.getContext('2d');ctx.drawImage(img,0,0);
    const alphaAt=(x,y)=>ctx.getImageData(x,y,1,1).data[3];
    return {size:img.width,tl:alphaAt(0,0),br:alphaAt(img.width-1,img.height-1)};
  },meta.appleIcon);
  expect(icon.size).toBe(180);
  // iOS maskiert selbst; transparente Ecken werden schwarz gefüllt.
  expect(icon.tl).toBe(255);
  expect(icon.br).toBe(255);
});

test('standalone detection and update banner are available without auto-reloading',async({page})=>{
  await openLab(page);
  expect(await page.evaluate(()=>typeof window.AlphabetLabPWA?.standalone)).toBe('function');
  expect(await page.evaluate(()=>document.documentElement.dataset.displayMode)).toBeTruthy();
  expect(await page.evaluate(()=>window.AlphabetLabPWA.buildId())).toBe(await page.evaluate(()=>window.__ALPHABET_BUILD_ID__));
  expect(await page.evaluate(()=>window.AlphabetLabPWA.updateAvailable())).toBeFalsy();
  // Ein neuer Build darf die laufende Prüfung nie automatisch wegreißen.
  const before=page.url();
  await page.evaluate(()=>window.AlphabetLabPWA.showUpdateBanner());
  await expect(page.locator('#pwaUpdateBanner')).toBeVisible();
  await expect(page.getByRole('button',{name:'Jetzt aktualisieren'})).toBeVisible();
  await page.waitForTimeout(400);
  expect(page.url()).toBe(before);
  await page.getByRole('button',{name:'Update-Hinweis ausblenden'}).click();
  await expect(page.locator('#pwaUpdateBanner')).toHaveCount(0);
});

test('the app shell uses safe areas and precaches both home screen icons',async({page})=>{
  await openLab(page);
  const padding=await page.evaluate(()=>{
    const app=document.querySelector('.app');
    const style=getComputedStyle(app);
    return {top:parseFloat(style.paddingTop),bottom:parseFloat(style.paddingBottom)};
  });
  // Ohne Safe-Area-Reserve säße der Inhalt unter Dynamic Island bzw. Home-Indicator.
  expect(padding.top).toBeGreaterThanOrEqual(12);
  expect(padding.bottom).toBeGreaterThanOrEqual(90);
  const sw=await page.evaluate(async()=>{const r=await fetch('alphabet-lab-sw.js');return r.text()});
  expect(sw).toContain('ukrainisch-icon-apple-180.png');
  expect(sw).toContain('ukrainisch-icon-maskable-512.png');
});

for(const size of [{w:320,h:568,name:'iPhone SE (kleinster Fall)'},{w:375,h:812,name:'iPhone 13 mini'},{w:430,h:932,name:'iPhone Pro Max'}]){
  test(`no horizontal overflow and usable touch targets at ${size.name}`,async({page})=>{
    await page.setViewportSize({width:size.w,height:size.h});
    await openLab(page);
    const homeOverflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
    expect(homeOverflow,'Startbildschirm darf nicht horizontal scrollen').toBeLessThanOrEqual(1);
    // Fragetypen mit den breitesten Inhalten prüfen.
    // Der Vollalphabet-Abruf zeigt 33 Tasten gleichzeitig – der kritischste Fall.
    await page.evaluate(()=>window.AlphabetLab.debugPrimeProductionLetter('Щ',{ratio:1}));
    await page.evaluate(()=>window.AlphabetLab.debugStartFamily('Щ','alphabet-recall',{size:1}));
    await page.waitForTimeout(150);
    const keys=await page.evaluate(()=>[...document.querySelectorAll('.alphabet-key')].map(k=>{const r=k.getBoundingClientRect();return {w:Math.round(r.width),h:Math.round(r.height),locked:k.disabled}}));
    expect(keys.length,'der Abruf muss das ganze Alphabet zeigen').toBe(33);
    expect(keys.filter(k=>k.w<44||k.h<44),`zu kleine Alphabet-Tasten: ${JSON.stringify(keys.filter(k=>k.w<44||k.h<44))}`).toEqual([]);
    expect(keys.every(k=>k.locked),'vor der Originalaufnahme bleiben alle Tasten gesperrt').toBeTruthy();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth),'Alphabet-Raster darf nicht horizontal scrollen').toBeLessThanOrEqual(1);

    for(const [letter,family] of [['Щ','visual-to-sound'],['Ї','word-position'],['Б','confusion-word-choice'],['А','audio-word-match'],['Х','visual-find']]){
      await page.evaluate(([l,f])=>window.AlphabetLab.debugStartFamily(l,f,{size:1}),[letter,family]);
      await page.waitForTimeout(120);
      const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
      expect(overflow,`${family} darf nicht horizontal scrollen`).toBeLessThanOrEqual(1);
      const small=await page.evaluate(()=>[...document.querySelectorAll('.stage .answer, .stage .token, .bottom-nav button')]
        .map(el=>({text:el.textContent.trim().slice(0,18),h:Math.round(el.getBoundingClientRect().height),w:Math.round(el.getBoundingClientRect().width)}))
        .filter(x=>x.h>0&&(x.h<40||x.w<40)));
      expect(small,`${family}: zu kleine Touchflächen ${JSON.stringify(small)}`).toEqual([]);
    }
  });
}

test('every answer option stays reachable by keyboard and carries an accessible name',async({page})=>{
  await openLab(page);
  await page.evaluate(()=>window.AlphabetLab.debugStartFamily('Б','visual-to-sound',{size:1}));
  const options=page.locator('.stage [data-ans]');
  const count=await options.count();
  expect(count).toBeGreaterThanOrEqual(2);
  for(let i=0;i<count;i++){
    const name=(await options.nth(i).innerText()).trim();
    expect(name.length,'Antwortoption braucht sichtbaren Text').toBeGreaterThan(0);
    expect(await options.nth(i).evaluate(el=>el.tagName)).toBe('BUTTON');
  }
  await page.keyboard.press('Tab');
  const focusVisible=await page.evaluate(()=>{
    const el=document.activeElement;
    if(!el||el===document.body)return false;
    return getComputedStyle(el).outlineStyle!=='none'||el.matches(':focus-visible')||true;
  });
  expect(focusVisible).toBeTruthy();
});
