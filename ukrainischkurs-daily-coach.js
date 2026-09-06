/* Ukrainischkurs für Joel · Daily Coach v2
   Fasst den geführten heutigen Lernweg zusammen und zeigt später zusätzlich den
   wichtigsten Muster-/Fehlerfokus, ohne daraus ein neues Pflichtgate zu machen. */
(()=>{
  const VERSION=2,core=window.UKRAINIAN_LEARNING_CORE;if(!core)return;
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const visible=()=>alphabetReady()&&core.isComplete?.('grammar.location-direction');
  const isReview=()=>WEEKLY_REVIEW_DAYS.includes(Number(s.day))&&Number(s.day)<D.length-1;
  function plan(){const steps=[];let minutes=0,due=0;try{due=typeof dueCards==='function'?dueCards().length:0}catch{}
    if(due){steps.push({title:'Fällige Wiederholung',detail:due+' Karte'+(due===1?'':'n')+' aus dem SRS zuerst abrufen.',min:5});minutes+=5}
    const lesson=D[Number(s.day)]||[];steps.push({title:'Heutige geführte Lektion',detail:String(lesson[0]||'Aktueller Kurstag'),min:8});minutes+=8;
    if(isReview()){const focus=core.reviewFocus?.(),pattern=window.UKRAINIAN_COMPETENCY_MASTERY?.needsPractice?.(1)?.[0],error=window.UKRAINIAN_ERROR_MEMORY?.top?.(1)?.[0];let detail=focus?'Skill-Schwerpunkt: '+(core.labels[focus]||focus)+'.':'Gemischte Wiederholung bereits eingeführter Inhalte.';if(pattern)detail+=' Muster-Fokus: '+pattern.label+' ('+(pattern.score??'—')+' %).';if(error&&error.priority>=20)detail+=' Wiederkehrender Fehler: '+error.label+'.';steps.push({title:'Transfer / Review',detail,min:6});minutes+=6}
    if(window.UKRAINIAN_WEEKLY_EVALUATOR?.required?.()){steps.push({title:'10-Fragen-Wochencheck',detail:'Heute Diagnose in fünf Bereichen; Lösungen und Fehlerklassifikation erst nach Frage 10.',min:8});minutes+=8}
    const pd=window.UKRAINIAN_PERSONAL_WORDS?.dueCount?.()||0;if(pd){steps.push({title:'Meine Wörter',detail:pd+' persönliche Karte'+(pd===1?'':'n')+' sind fällig. Freiwillig.',min:4});minutes+=4}
    if(isReview()&&core.isComplete?.('speaking.sentences')&&window.UKRAINIAN_REAL_CONVERSATION){steps.push({title:'Optional: Gespräch',detail:'Eine kontrollierte Alltagssituation frei auf Ukrainisch beantworten.',min:5});minutes+=5}
    if(core.isComplete?.('grammar.time')&&window.UKRAINIAN_IMMERSION_TEXTLAB){steps.push({title:'Optional: Immersion',detail:'Nur wenn du noch Energie hast: einen echten ukrainischen Text analysieren.',min:5});minutes+=5}
    return {steps,minutes:Math.max(15,minutes)}
  }
  function renderBox(){let box=document.getElementById('dailyCoachBox');if(!visible()){if(box)box.hidden=true;return}const cards=document.getElementById('cards');if(!cards)return;if(!box){box=document.createElement('section');box.id='dailyCoachBox';box.className='card dc-card';cards.parentNode.insertBefore(box,cards)}box.hidden=false;const p=plan(),requiredMin=p.steps.filter(x=>!x.title.startsWith('Optional')).reduce((n,x)=>n+x.min,0);box.innerHTML='<div class="dc-head"><div><div class="label">Später Verlauf · heutiger Lernplan</div><h2>Was heute wirklich dran ist</h2></div><div class="pill">ca. '+requiredMin+'–'+p.minutes+' Min</div></div><p class="small">Kein Zufallsunterricht: Der Plan liest Kurstag, SRS, Skill-Profil und – sobald genügend Evidenz vorliegt – wiederkehrende Fehlertypen und konkrete Kompetenzmuster.</p><div class="dc-steps">'+p.steps.map((x,i)=>'<div class="dc-step"><span>'+(i+1)+'</span><div><strong>'+esc(x.title)+'</strong><small>'+esc(x.detail)+'</small></div><b>~'+x.min+'m</b></div>').join('')+'</div>'}
  const css=document.createElement('style');css.textContent='.dc-head{display:flex;justify-content:space-between;gap:12px;align-items:center}.dc-steps{display:grid;gap:7px}.dc-step{display:grid;grid-template-columns:28px 1fr auto;gap:9px;align-items:center;padding:9px;border-radius:12px;background:#f4f8fc}.dc-step>span{font-weight:900;text-align:center}.dc-step small{display:block;color:#526b87;margin-top:2px}.dc-step>b{font-size:.78rem}';document.head.append(css);
  window.UKRAINIAN_DAILY_COACH={version:VERSION,guidedNotGenerated:true,errorAware:true,competencyAware:true,plan};const previousRender=render;render=function(){previousRender();renderBox()};renderBox();
})();