/* Ukrainischkurs für Joel · Native Reading Guard v1
   Nach dem geführten Alphabet keine lateinische Lautschrift mehr im Hauptlernweg.
   Ziel: direkte Kyrillisch-Laut-Verknüpfung statt dauerhaft falsche deutsche Ersatzlaute.
   Audio, ukrainischer Zieltext und Fehlerkorrektur bleiben vollständig erhalten. */
(()=>{
  const VERSION=1,ALPHABET_DAYS=14;
  function active(){return (Number(s?.day)||0)>=ALPHABET_DAYS}
  function enforce(){
    const on=active();document.body.classList.toggle('native-reading-path',on);
    if(!on)return;
    document.querySelectorAll('#cards .trans,#cards details.pronunciation,#proPronunciation').forEach(el=>{el.hidden=true;el.setAttribute?.('aria-hidden','true')});
    document.body.classList.remove('pro-translit-on');
    const st=s?.professionalPath?.days?.[String(Number(s?.day)||0)];if(st&&st.translit){st.translit=false;try{save()}catch{}}
  }
  const css=document.createElement('style');css.textContent='body.native-reading-path #cards .trans,body.native-reading-path #cards details.pronunciation,body.native-reading-path #proPronunciation{display:none!important}';document.head.append(css);
  const previousRender=render;render=function(){const out=previousRender.apply(this,arguments);enforce();return out};
  const observer=new MutationObserver(()=>queueMicrotask(enforce));observer.observe(document.documentElement,{childList:true,subtree:true});
  window.UKRAINIAN_NATIVE_READING_GUARD={version:VERSION,startsAfterAlphabet:true,alphabetDays:ALPHABET_DAYS,romanizationHidden:true,directCyrillicReading:true,doesNotHideAudio:true,doesNotChangeLessonData:true};
  enforce();
})();