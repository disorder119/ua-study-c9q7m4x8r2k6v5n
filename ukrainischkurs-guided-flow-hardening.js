/* Ukrainischkurs für Joel · Guided Flow Hardening v1
   Repariert den geführten Anfängerfluss ohne Lern-Gates zu umgehen.
   Der nächste erlaubte Alphabet-Tag wird ausschließlich über den bestehenden
   geschützten Weiter-Handler gestartet; der Kurstag wird hier niemals direkt verändert. */
(()=>{
  const VERSION=1;
  function state(){const day=Number(s?.day)||0;return s?.guidedAlphabet?.days?.[String(day)]||null}
  function guided(){return document.body.classList.contains('guided-alphabet')}
  function advanceSafely(){
    const next=document.getElementById('next');
    if(!next){if(typeof toast==='function')toast('Der nächste Lerntag konnte nicht geöffnet werden. Bitte die App einmal neu öffnen.');return}
    const before=Number(s.day)||0;next.click();
    queueMicrotask(()=>{
      if((Number(s.day)||0)>before){
        const st=s?.guidedAlphabet?.days?.[String(s.day)];if(st&&st.stage==='complete')st.stage='welcome';
        try{save()}catch{}try{render()}catch{}
      }
    })
  }
  function patchComplete(){
    if(!guided())return;const st=state();if(st?.stage!=='complete')return;
    const root=document.getElementById('guidedAlphabetStart');if(!root)return;
    const buttons=[...root.querySelectorAll('button.guided-primary')];
    const button=buttons.find(b=>(b.textContent||'').trim()==='Morgen weitermachen'||b.getAttribute?.('data-guided-advance')==='1');
    if(!button)return;
    button.setAttribute('data-guided-advance','1');button.textContent='Weiter mit den nächsten Buchstaben';button.disabled=false;button.onclick=advanceSafely;
    let note=document.getElementById('guidedAdvanceNote');if(!note){note=document.createElement('div');note.id='guidedAdvanceNote';note.className='guided-advance-note';button.insertAdjacentElement('beforebegin',note)}
    note.textContent='Der nächste Lerntag ist jetzt freigeschaltet.';
  }
  const observer=new MutationObserver(()=>queueMicrotask(patchComplete));
  function start(){observer.observe(document.documentElement,{childList:true,subtree:true});patchComplete()}
  const css=document.createElement('style');css.textContent='.guided-advance-note{margin:16px 0 2px;padding:11px 13px;border-radius:14px;background:#edf8ee;color:#52705a;font-size:.86rem;font-weight:800}';document.head.append(css);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
  window.UKRAINIAN_GUIDED_FLOW_HARDENING={version:VERSION,functionalNextDayButton:true,usesExistingNextHandler:true,directDayMutation:false,respectsCalendarGate:true};
})();