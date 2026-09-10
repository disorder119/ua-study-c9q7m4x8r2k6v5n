/* Ukrainischkurs für Joel · Status Live-Regions v1
   Aufnahme-/Check-Statustexte werden bei jedem Render komplett neu ins DOM geschrieben
   (innerHTML-Ersatz), ein einmalig gesetztes aria-live würde also nach dem ersten
   Re-Render wieder verschwinden. Dieses Modul beobachtet das DOM von außen und setzt
   aria-live/role=status erneut, sooft die Zielelemente neu erscheinen — ohne die
   Aufnahme-/Render-Logik der Zieldateien selbst anzufassen. */
(()=>{
  const VERSION=1;
  const TARGET_IDS=['pronRecordState','pronCheckState'];
  function patch(){
    for(const id of TARGET_IDS){
      const el=document.getElementById(id);
      if(el&&el.getAttribute('aria-live')!=='polite'){el.setAttribute('aria-live','polite');el.setAttribute('role','status')}
    }
  }
  const observer=new MutationObserver(()=>queueMicrotask(patch));
  function start(){observer.observe(document.documentElement,{childList:true,subtree:true});patch()}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
  window.UKRAINIAN_STATUS_LIVE_REGIONS={version:VERSION,targets:TARGET_IDS.length};
})();
