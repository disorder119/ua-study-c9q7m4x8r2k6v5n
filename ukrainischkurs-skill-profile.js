/* Ukrainischkurs für Joel · Skill Profile v3
   Zeigt zentral gemessene Evidenz und den automatisch gewählten Review-Fokus.
   Neuere Leistungen zählen stärker; länger nicht geprüfte Bereiche werden leicht vorgezogen. */
(()=>{
  const VERSION=3,core=window.UKRAINIAN_LEARNING_CORE;
  if(!core)return;
  function visible(){const p=core.profile();return Object.values(p).filter(x=>x.sessions>0).length>=2}
  function isReview(){return WEEKLY_REVIEW_DAYS.includes(Number(s.day))&&Number(s.day)<D.length-1}
  function renderBox(){
    let box=document.getElementById('skillProfileBox');if(!visible()){if(box)box.hidden=true;return}const cards=document.getElementById('cards');if(!cards)return;
    if(!box){box=document.createElement('section');box.id='skillProfileBox';box.className='card';cards.insertAdjacentElement('afterend',box)}box.hidden=false;
    const p=core.profile(),weak=core.weakest(),focus=isReview()?core.reviewFocus():null,rows=core.skills.map(k=>{const x=p[k],score=x.score==null?'—':x.score+'%',width=x.score==null?0:x.score,stale=Number(x.staleDays)||0,age=stale>=4?' · seit '+stale+' Tagen nicht geprüft':'';return '<div class="sp-row"><div class="sp-meta"><strong>'+x.label+'</strong><span>'+score+' · '+x.sessions+' Messungen'+age+'</span></div><div class="sp-track"><span style="width:'+width+'%"></span></div></div>'}).join('');
    const adaptive=focus?'<div class="tip"><strong>Heutiger automatischer Review-Fokus: '+p[focus].label+'.</strong> Neuere Leistungen zählen stärker; bei ähnlichen Werten werden länger nicht geprüfte Bereiche leicht vorgezogen.</div>':(weak?'<div class="tip">Aktuell höchste Review-Priorität: <strong>'+p[weak].label+'</strong>. Am nächsten passenden Review-Tag fließen sowohl deine jüngeren Ergebnisse als auch die Zeit seit der letzten Messung ein.</div>':'');
    box.innerHTML='<div class="sp-head"><div><div class="label">Adaptives Skill-Profil</div><h2>Was sitzt – und was wird automatisch häufiger wiederholt?</h2></div><div class="pill">5 Bereiche</div></div><p class="small">Die Werte entstehen aus echten Kursleistungen. Der Lernweg bleibt vollständig geführt; das Profil steuert nur die Wiederholungsgewichtung.</p>'+rows+adaptive;
  }
  const css=document.createElement('style');css.textContent='.sp-head,.sp-meta{display:flex;justify-content:space-between;gap:12px}.sp-row{margin:11px 0}.sp-meta span{font-size:.78rem;color:#526b87;text-align:right}.sp-track{height:7px;border-radius:999px;background:rgba(82,107,135,.16);overflow:hidden;margin-top:5px}.sp-track span{display:block;height:100%;background:currentColor;opacity:.7}@media(max-width:560px){.sp-meta{align-items:flex-start}.sp-meta span{max-width:62%}}';document.head.append(css);
  window.UKRAINIAN_SKILL_PROFILE={version:VERSION,skills:core.skills.length,adaptiveReview:true,recencyAware:true,stalePriority:true};
  const previousRender=render;render=function(){previousRender();renderBox()};renderBox();
})();