/* Ukrainischkurs für Joel · Dynamic Course UI v1
   Entfernt die alte 30-Tage-Annahme aus der sichtbaren Laufzeit-UI, ohne den
   historischen Basiskern riskant umzuschreiben. Die Anzeige folgt immer D.length. */
(()=>{
  const VERSION=1;
  function courseLength(){return Array.isArray(D)?D.length:0}
  function updateMeta(){
    const meta=document.querySelector('meta[name="description"]');
    if(meta&&courseLength())meta.setAttribute('content',`Ukrainischkurs für Joel: persönlicher geführter Kurs mit ${courseLength()} Kurstagen zum Lesen, Hören, Sprechen, Schreiben und Behalten.`);
  }
  function updateProgressText(){
    const el=document.getElementById('progressText');if(!el||!courseLength())return;
    el.textContent=el.textContent
      .replace(/von\s+30\s+Lektionen\s+fertig/i,`von ${courseLength()} Kurstagen fertig`)
      .replace(/von\s+30\s+Kurstagen\s+fertig/i,`von ${courseLength()} Kurstagen fertig`);
  }
  function updateLessonChrome(){
    const n=courseLength();if(!n)return;
    const label=document.getElementById('label'),next=document.getElementById('next');
    const day=Number(s.day)||0,finalDay=day===n-1,review=WEEKLY_REVIEW_DAYS.includes(day);
    if(label)label.textContent=finalDay?`Tag ${n} · Abschluss`:review?`Tag ${day+1} · Wiederholung`:`Tag ${day+1} von ${n}`;
    if(next)next.textContent=finalDay?'Zur ersten Lektion':'Nächste Lektion';
    updateProgressText();
  }
  const baseProgress=progress;
  progress=function(){const out=baseProgress.apply(this,arguments);updateProgressText();return out};
  const baseRender=render;
  render=function(){const out=baseRender.apply(this,arguments);updateLessonChrome();return out};
  window.UKRAINIAN_DYNAMIC_COURSE_UI={version:VERSION,get length(){return courseLength()}};
  updateMeta();updateLessonChrome();
})();