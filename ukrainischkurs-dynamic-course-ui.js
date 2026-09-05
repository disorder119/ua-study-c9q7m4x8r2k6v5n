/* Ukrainischkurs für Joel · Dynamic Course UI v2
   Hält alle sichtbaren Kurslängen und Navigationshinweise am echten D.length.
   Entfernt historische 30-Tage-/Monats-Texte aus der laufenden Oberfläche. */
(()=>{
  const VERSION=2;
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
  function updateCourseCopy(){
    const course=document.getElementById('course');if(course){
      const h2=course.querySelector('h2');if(h2)h2.textContent='Dein geführter Ukrainischkurs';
      const info=course.querySelector('p.small');if(info)info.textContent='Die App führt dich automatisch zum nächsten sinnvollen Tag. Frühere freigeschaltete Tage kannst du jederzeit zum Wiederholen öffnen.';
    }
    const keyboard=document.getElementById('keyboardGuide');
    const keyboardMethod=document.getElementById('methodKeyboard')?.closest('.method');
    if(keyboardMethod){const p=keyboardMethod.querySelector('p');if(p)p.textContent='Sobald der geführte Lernweg es freigibt, hörst du Wörter und schreibst sie auf deiner ukrainischen Handy-Tastatur aus dem Kopf.'}
    const locked=document.getElementById('keyboardLocked');if(locked){
      const h2=locked.querySelector('h2');if(h2)h2.textContent='Das öffnet sich automatisch im Lernweg';
      const p=locked.querySelector('p.small');if(p)p.textContent='Zuerst liest und hörst du die Buchstaben sicher. Danach öffnet die App den Schreibtrainer automatisch – du musst nicht selbst entscheiden, wann er sinnvoll ist.';
    }
    if(keyboard){const label=keyboard.querySelector('.label');if(label)label.textContent='Einmal am iPhone einstellen'}
  }
  function updateLessonChrome(){
    const n=courseLength();if(!n)return;
    const label=document.getElementById('label'),next=document.getElementById('next');
    const day=Number(s.day)||0,finalDay=day===n-1,review=WEEKLY_REVIEW_DAYS.includes(day);
    if(label)label.textContent=finalDay?`Tag ${n} · Abschluss`:review?`Tag ${day+1} · Wiederholung`:`Tag ${day+1} von ${n}`;
    if(next)next.textContent=finalDay?'Zur ersten Lektion':'Nächste Lektion';
    updateProgressText();updateCourseCopy();
  }
  const baseProgress=progress;
  progress=function(){const out=baseProgress.apply(this,arguments);updateProgressText();return out};
  const baseRender=render;
  render=function(){const out=baseRender.apply(this,arguments);updateLessonChrome();return out};
  window.UKRAINIAN_DYNAMIC_COURSE_UI={version:VERSION,get length(){return courseLength()},staleCopyFixed:true};
  updateMeta();updateLessonChrome();
})();
