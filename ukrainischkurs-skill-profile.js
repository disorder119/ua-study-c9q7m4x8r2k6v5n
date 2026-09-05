/* Ukrainischkurs für Joel · Skill Profile v1
   Zeigt zentral gemessene Evidenz für Lesen, Hören, Schreiben, Sprechen und Grammatik.
   Keine Selbstwahl des Lernwegs: das Profil ist Diagnose, nicht Kursmenü. */
(()=>{
  const VERSION=1,core=window.UKRAINIAN_LEARNING_CORE;
  if(!core)return;
  function visible(){const p=core.profile();return Object.values(p).filter(x=>x.sessions>0).length>=2}
  function renderBox(){
    let box=document.getElementById('skillProfileBox');if(!visible()){if(box)box.hidden=true;return}const cards=document.getElementById('cards');if(!cards)return;
    if(!box){box=document.createElement('section');box.id='skillProfileBox';box.className='card';cards.insertAdjacentElement('afterend',box)}box.hidden=false;
    const p=core.profile(),weak=core.weakest(),rows=core.skills.map(k=>{const x=p[k],score=x.score==null?'—':x.score+'%',width=x.score==null?0:x.score;return '<div class="sp-row"><div class="sp-meta"><strong>'+x.label+'</strong><span>'+score+' · '+x.sessions+' Messungen</span></div><div class="sp-track"><span style="width:'+width+'%"></span></div></div>'}).join('');
    box.innerHTML='<div class="sp-head"><div><div class="label">Adaptives Skill-Profil</div><h2>Was sitzt – und was braucht mehr Evidenz?</h2></div><div class="pill">5 Bereiche</div></div><p class="small">Die App sammelt die Ergebnisse deiner bestehenden Aufgaben zentral. Du musst daraus nichts auswählen; der geführte Kurs bleibt automatisch.</p>'+rows+(weak?'<div class="tip">Aktuell schwächster gemessener Bereich: <strong>'+p[weak].label+'</strong>. Künftige adaptive Reviews können diesen Wert direkt verwenden.</div>':'');
  }
  const css=document.createElement('style');css.textContent='.sp-head,.sp-meta{display:flex;justify-content:space-between;gap:12px}.sp-row{margin:11px 0}.sp-meta span{font-size:.78rem;color:#526b87}.sp-track{height:7px;border-radius:999px;background:rgba(82,107,135,.16);overflow:hidden;margin-top:5px}.sp-track span{display:block;height:100%;background:currentColor;opacity:.7}';document.head.append(css);
  window.UKRAINIAN_SKILL_PROFILE={version:VERSION,skills:core.skills.length};
  const previousRender=render;render=function(){previousRender();renderBox()};renderBox();
})();