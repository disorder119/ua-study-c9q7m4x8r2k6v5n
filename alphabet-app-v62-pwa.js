'use strict';

// V6.2 · Home-Screen-App-Verhalten.
//
// Eine installierte PWA wird auf dem iPhone praktisch nie „geschlossen“. Der
// Service Worker übernahm bisher zwar sofort (skipWaiting + clients.claim),
// die bereits offene Seite lief aber unbemerkt mit dem alten HTML und den alten
// Bundles weiter. Deshalb:
//   1. Der Client fragt den aktiven Service Worker nach seiner Build-ID.
//   2. Weicht sie vom HTML ab, erscheint ein unaufdringliches Update-Banner.
//   3. Beim Zurückkehren in die App wird höchstens alle 15 Minuten nach einer
//      neuen Version gesucht – genug für eine App, die tagelang offen bleibt.
// Es wird nie automatisch neu geladen: ein Reload mitten in einer Prüfung wäre
// schlimmer als eine Version Verzögerung.

const PWA_UPDATE_CHECK_INTERVAL=15*60*1000;
let pwaRegistration=null,pwaLastCheck=0,pwaBannerShown=false,pwaServiceWorkerBuildId='';

const pwaStandalone=()=>{
  try{
    return window.matchMedia?.('(display-mode: standalone)')?.matches===true
      ||window.matchMedia?.('(display-mode: fullscreen)')?.matches===true
      ||window.navigator?.standalone===true;
  }catch(_){return false}
};

function pwaMarkDisplayMode(){
  try{document.documentElement.dataset.displayMode=pwaStandalone()?'standalone':'browser'}catch(_){}
}

function pwaAskBuildId(worker,timeoutMs=1500){
  return new Promise(resolve=>{
    if(!worker)return resolve('');
    let done=false;
    const finish=value=>{if(done)return;done=true;navigator.serviceWorker.removeEventListener('message',onMessage);resolve(value||'')};
    const onMessage=event=>{if(event.data?.type==='ALPHABET_BUILD_ID')finish(event.data.buildId)};
    try{
      navigator.serviceWorker.addEventListener('message',onMessage);
      worker.postMessage({type:'ALPHABET_BUILD_ID'});
      setTimeout(()=>finish(''),timeoutMs);
    }catch(_){finish('')}
  });
}

function pwaShowUpdateBanner(){
  if(pwaBannerShown||document.getElementById('pwaUpdateBanner'))return;
  pwaBannerShown=true;
  const bar=document.createElement('div');
  bar.id='pwaUpdateBanner';
  bar.className='pwa-update-banner';
  bar.setAttribute('role','status');
  bar.setAttribute('aria-live','polite');
  bar.innerHTML='<span>Neue Version installiert.</span><button class="btn small primary" type="button" id="pwaUpdateReload">Jetzt aktualisieren</button><button class="btn small" type="button" id="pwaUpdateLater" aria-label="Update-Hinweis ausblenden">Später</button>';
  document.body.appendChild(bar);
  bar.querySelector('#pwaUpdateReload').onclick=()=>{try{location.reload()}catch(_){}};
  bar.querySelector('#pwaUpdateLater').onclick=()=>{bar.remove()};
}

async function pwaSyncBuildId(){
  const controller=navigator.serviceWorker?.controller;
  if(!controller)return '';
  pwaServiceWorkerBuildId=await pwaAskBuildId(controller);
  const html=window.__ALPHABET_BUILD_ID__||'';
  if(pwaServiceWorkerBuildId&&html&&pwaServiceWorkerBuildId!==html)pwaShowUpdateBanner();
  return pwaServiceWorkerBuildId;
}

async function pwaCheckForUpdate({force=false}={}){
  const now=Date.now();
  if(!force&&now-pwaLastCheck<PWA_UPDATE_CHECK_INTERVAL)return false;
  pwaLastCheck=now;
  try{await pwaRegistration?.update?.()}catch(_){}
  const waiting=pwaRegistration?.waiting;
  if(waiting)pwaShowUpdateBanner();
  await pwaSyncBuildId();
  return !!document.getElementById('pwaUpdateBanner');
}

function pwaInit(){
  pwaMarkDisplayMode();
  try{
    window.matchMedia?.('(display-mode: standalone)')?.addEventListener?.('change',pwaMarkDisplayMode);
  }catch(_){}
  if(!('serviceWorker' in navigator))return;
  navigator.serviceWorker.addEventListener('controllerchange',()=>{pwaSyncBuildId()});
  navigator.serviceWorker.ready.then(registration=>{
    pwaRegistration=registration;
    pwaLastCheck=Date.now();
    registration.addEventListener?.('updatefound',()=>{
      const installing=registration.installing;
      if(!installing)return;
      installing.addEventListener('statechange',()=>{
        if(installing.state==='installed'&&navigator.serviceWorker.controller)pwaShowUpdateBanner();
      });
    });
    return pwaSyncBuildId();
  }).catch(()=>{});
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')pwaCheckForUpdate()});
}

window.AlphabetLabPWA=Object.freeze({
  standalone:pwaStandalone,
  buildId:()=>window.__ALPHABET_BUILD_ID__||'',
  serviceWorkerBuildId:()=>pwaServiceWorkerBuildId,
  updateAvailable:()=>!!document.getElementById('pwaUpdateBanner'),
  checkForUpdate:()=>pwaCheckForUpdate({force:true}),
  showUpdateBanner:pwaShowUpdateBanner
});

pwaInit();
