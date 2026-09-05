/* Ukrainischkurs für Joel · Skill Profile v2
   Zeigt zentral gemessene Evidenz und den automatisch gewählten Review-Fokus.
   Keine Selbstwahl des Lernwegs: Diagnose steuert Wiederholung im Hintergrund. */
(()=>{
  const VERSION=2,core=window.UKRAINIAN_LEARNING_CORE;
  if(!core)return;
  function visible(){const p=core.profile();return Object.values(p).filter(x=>x.sessions>0).length>=2}
  function isReview(){return WEEKLY_REVIEW_DAYS.includes(Number(s.day))&&Number(s.day)<D.length-1}
  function renderBox(){
    let box=document.getElementById('skillProfileBox');if(!visible()){if(box)box.hidden=true;return}const cards=document.getElementById('cards');if(!cards)return;
    if(!box){box=document.createElement('section');box.id='skillProfileBox';box.className='card';cards.insertAdjacentElement('afterend',box)}box.hidden=false;
    const p=core.profile(),weak=core.weakest(),focus=isReview()?core.reviewFocus():null,rows=core.skills.map(k=>{const x=p[k],score=x.score==null?'—':x.score+'%',width=x.score==null?0:x.score;return '<div class="sp-row"><div class="sp-meta"><strong>'+x.label+'</strong><span>'+score+' · '+x.sessions+' Messungen</span></div><div class="sp-track"><span style="width:'+width+'%"></span></div></div>'}).join('');
    const adaptive=focus?'<div class="tip"><strong>Heutiger automatischer Review-Fokus: '+p[focus].label+'.</strong> Passende Review-Module erscheinen dadurch häufiger; du wählst nichts selbst aus.</div>':(weak?'<div class="tip">Aktuell schwächster gemessener Bereich: <strong>'+p[weak].label+'</strong>. Am nächsten passenden Review-Tag fließt dieser Wert automatisch in die Aufgabenwahl ein.</div>':'');
    box.innerHTML='<div class="sp-head"><div><div class="label">Adaptives Skill-Profil</div><h2>Was sitzt – und was wird automatisch häufiger wiederholt?</h2></div><div class="pill">5 Bereiche</div></div><p class="small">Die Werte entstehen aus echten Kursleistungen. Der Lernweg bleibt vollständig geführt; das Profil steuert nur die Wiederholungsgewichtung.</p>'+rows+adaptive;
  }
  const css=document.createElement('style');css.textContent='.sp-head,.sp-meta{display:flex;justify-content:space-between;gap:12px}.sp-row{margin:11px 0}.sp-meta span{font-size:.78rem;color:#526b87}.sp-track{height:7px;border-radius:999px;background:rgba(82,107,135,.16);overflow:hidden;margin-top:5px}.sp-track span{display:block;height:100%;background:currentColor;opacity:.7}';document.head.append(css);
  window.UKRAINIAN_SKILL_PROFILE={version:VERSION,skills:core.skills.length,adaptiveReview:true};
  const previousRender=render;render=function(){previousRender();renderBox()};renderBox();
})();