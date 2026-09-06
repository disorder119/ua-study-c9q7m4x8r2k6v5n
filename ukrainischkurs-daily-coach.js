/* Ukrainischkurs für Joel · Daily Coach v1
   Späte Adaption des „Daily Lesson Creator“: erzeugt keinen zufälligen Kurs,
   sondern fasst den bereits geführten heutigen Lernweg kompakt zusammen. */
(()=>{
  const VERSION=1,core=window.UKRAINIAN_LEARNING_CORE;if(!core)return;
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const visible=()=>alphabetReady()&&core.isComplete?.('grammar.location-direction');
  const isReview=()=>WEEKLY_REVIEW_DAYS.includes(Number(s.day))&&Number(s.day)<D.length-1;
  function plan(){const steps=[];let minutes=0;let due=0;try{due=typeof dueCards==='function'?dueCards().length:0}catch{}
    if(due){steps.push({title:'Fällige Wiederholung',detail:due+' Karte'+(due===1?'':'n')+' aus dem SRS zuerst abrufen.',min:5});minutes+=5}
    const lesson=D[Number(s.day)]||[];steps.push({title:'Heutige geführte Lektion',detail:String(lesson[0]||'Aktueller Kurstag'),min:8});minutes+=8;
    if(isReview()){const focus=core.reviewFocus?.();steps.push({title:'Transfer / Review',detail:focus?'Automatischer Schwerpunkt: '+(core.labels[focus]||focus)+'.':'Gemischte Wiederholung bereits eingeführter Inhalte.',min:6});minutes+=6}
    if(window.UKRAINIAN_WEEKLY_EVALUATOR?.required?.()){steps.push({title:'10-Fragen-Wochencheck',detail:'Heute Diagnose in fünf Bereichen; Lösungen erst nach Frage 10.',min:8});minutes+=8}
    const pd=window.UKRAINIAN_PERSONAL_WORDS?.dueCount?.()||0;if(pd){steps.push({title:'Meine Wörter',detail:pd+' persönliche Karte'+(pd===1?'':'n')+' sind fällig. Freiwillig.',min:4});minutes+=4}
    if(isReview()&&core.isComplete?.('speaking.sentences')&&window.UKRAINIAN_REAL_CONVERSATION){steps.push({title:'Optional: Gespräch',detail:'Eine kontrollierte Alltagssituation frei auf Ukrainisch beantworten.',min:5});minutes+=5}
    if(core.isComplete?.('grammar.time')&&window.UKRAINIAN_IMMERSION_TEXTLAB){steps.push({title:'Optional: Immersion',detail:'Nur wenn du noch Energie hast: einen echten ukrainischen Text analysieren.',min:5});minutes+=5}
    return {steps,minutes:Math.max(15,minutes)}
  }
  function renderBox(){let box=document.getElementById('dailyCoachBox');if(!visible()){if(box)box.hidden=true;return}const cards=document.getElementById('cards');if(!cards)return;if(!box){box=document.createElement('section');box.id='dailyCoachBox';box.className='card dc-card';cards.parentNode.insertBefore(box,cards)}box.hidden=false;const p=plan(),requiredMin=p.steps.filter(x=>!x.title.startsWith('Optional')).reduce((n,x)=>n+x.min,0);box.innerHTML='<div class="dc-head"><div><div class="label">Später Verlauf · heutiger Lernplan</div><h2>Was heute wirklich dran ist</h2></div><div class="pill">ca. '+requiredMin+'–'+p.minutes+' Min</div></div><p class="small">Kein zufällig generierter Unterricht: Dieser Plan liest deinen echten Kursstand, fällige Wiederholungen und heutige Review-Pflichten aus.</p><div class="dc-steps">'+p.steps.map((x,i)=>'<div class="dc-step"><span>'+(i+1)+'</span><div><strong>'+esc(x.title)+'</strong><small>'+esc(x.detail)+'</small></div><b>~'+x.min+'m</b></div>').join('')+'</div>'}
  const css=document.createElement('style');css.textContent='.dc-head{display:flex;justify-content:space-between;gap:12px;align-items:center}.dc-steps{display:grid;gap:7px}.dc-step{display:grid;grid-template-columns:28px 1fr auto;gap:9px;align-items:center;padding:9px;border-radius:12px;background:#f4f8fc}.dc-step>span{font-weight:900;text-align:center}.dc-step small{display:block;color:#526b87;margin-top:2px}.dc-step>b{font-size:.78rem}';document.head.append(css);
  window.UKRAINIAN_DAILY_COACH={version:VERSION,guidedNotGenerated:true,plan};const previousRender=render;render=function(){previousRender();renderBox()};renderBox();
})();