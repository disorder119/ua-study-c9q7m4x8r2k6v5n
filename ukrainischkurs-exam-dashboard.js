/* Ukrainischkurs für Joel · Exam Dashboard v1 · v59 gehärtet
   Lernampel + Prozentübersicht nach dem Vorbild einer Führerschein-Lernapp.
   Vier häufig nutzbare Übungsprüfungen bleiben strikt getrennt von der echten
   A1-Abschlussprüfung. Keine offizielle CEFR-Wahrscheinlichkeit, kein neues A1-Gate. */
(()=>{
  const VERSION=1,core=window.UKRAINIAN_LEARNING_CORE;if(!core)return;
  const SKILLS=['reading','listening','writing','speaking','grammar'];
  const LABELS={reading:'Lesen',listening:'Hören',writing:'Schreiben',speaking:'Sprechen',grammar:'Grammatik'};
  const MODES={
    quick:{id:'quick',title:'Blitzprüfung',questions:10,minutes:6,threshold:70,desc:'10 gemischte Fragen für einen schnellen Check.'},
    standard:{id:'standard',title:'Standardprüfung',questions:20,minutes:14,threshold:80,desc:'20 Fragen gleichmäßig über alle fünf Bereiche.'},
    full:{id:'full',title:'Große Simulation',questions:30,minutes:24,threshold:80,desc:'30 Fragen mit sechs Aufgaben pro Kompetenzbereich.'},
    weak:{id:'weak',title:'Schwächenprüfung',questions:15,minutes:12,threshold:80,desc:'15 Fragen mit extra Gewicht auf roten und gelben Bereichen.'}
  };
  const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
  function shuffle(input){const a=[...input];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
  const pick=a=>a[Math.floor(Math.random()*a.length)];
  const esc=v=>String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  function ensure(){
    if(!s.examDashboard||typeof s.examDashboard!=='object')s.examDashboard={version:VERSION,history:[]};
    s.examDashboard.version=VERSION;s.examDashboard.history=Array.isArray(s.examDashboard.history)?s.examDashboard.history:[];
    if(s.examDashboard.history.length>30)s.examDashboard.history=s.examDashboard.history.slice(-30);return s.examDashboard;
  }
  function completedCourseDays(){
    if(typeof completedLessons==='function'){const n=Number(completedLessons());if(Number.isFinite(n))return clamp(n,0,D.length)}
    const ids=Object.entries(s.done||{}).filter(([,v])=>!!v).map(([k])=>Number(k)).filter(Number.isInteger);return ids.length?clamp(Math.max(...ids)+1,0,D.length):0
  }
  function introducedUpto(){const done=completedCourseDays(),current=clamp(Number(s.day)||0,0,D.length-1);return clamp(Math.max(current,done-1),0,D.length-1)}
  function introducedCards(){
    const upto=introducedUpto(),out=[];
    for(let di=0;di<=upto;di++)for(const c of (D[di]?.[3]||[])){
      const uk=String(c?.[0]||'').trim(),de=String(c?.[1]||'').trim();
      if(!uk||!de||!/[А-Яа-яІіЇїЄєҐґ]/.test(uk))continue;
      out.push({uk,de,day:di,words:core.normalize(uk).split(' ').filter(Boolean).length});
    }
    const seen=new Set();return out.filter(x=>{const k=core.normalize(x.uk)+'|'+x.de;if(seen.has(k))return false;seen.add(k);return true});
  }
  function history(){return ensure().history}
  function recentHistory(n=5){return history().slice(-n)}
  function mockDomainAverage(skill,n=5){
    const vals=recentHistory(n).map(x=>x.domains?.[skill]).filter(x=>x&&Number.isFinite(Number(x.correct))&&Number(x.total)>0);
    if(!vals.length)return null;const correct=vals.reduce((a,x)=>a+Number(x.correct),0),total=vals.reduce((a,x)=>a+Number(x.total),0);return total?Math.round(correct/total*100):null
  }
  function skillSignal(skill){
    const p=core.profile()[skill]||{},mock=mockDomainAverage(skill),base=Number.isFinite(Number(p.score))?Number(p.score):null;
    let score=base==null?mock:mock==null?base:Math.round(base*.75+mock*.25);
    const evidence=(Number(p.sessions)||0)+recentHistory().filter(x=>Number.isFinite(Number(x.domains?.[skill]?.score))).length;
    if(score==null)return {skill,label:LABELS[skill],score:null,status:'grey',evidence};
    score=clamp(Math.round(score),0,100);const status=evidence<2?'grey':score>=80?'green':score>=60?'yellow':'red';
    return {skill,label:LABELS[skill],score,status,evidence};
  }
  function signals(){return SKILLS.map(skillSignal)}
  function coursePercent(){return Math.round(clamp(completedCourseDays()/Math.max(1,D.length)*100,0,100))}
  function simulationAverage(){const h=recentHistory();return h.length?Math.round(h.reduce((n,x)=>n+(Number(x.score)||0),0)/h.length):null}
  function learningPercent(){
    const vals=signals().map(x=>x.score).filter(Number.isFinite),skills=vals.length?vals.reduce((a,b)=>a+b,0)/vals.length:0,course=coursePercent(),mock=simulationAverage();
    return Math.round(mock==null?skills*.75+course*.25:skills*.65+course*.2+mock*.15);
  }
  function lightForScore(score,evidence=2){if(!Number.isFinite(Number(score))||evidence<2)return'grey';return score>=80?'green':score>=60?'yellow':'red'}
  function weakestSkill(){const ranked=signals().filter(x=>x.score!=null).sort((a,b)=>a.score-b.score||a.evidence-b.evidence);return ranked[0]?.skill||core.weakest?.()||'grammar'}
  function recommendedMode(){const sig=signals();if(sig.some(x=>x.status==='red'))return'weak';const h=history(),lastFull=[...h].reverse().find(x=>x.mode==='full'),done=completedCourseDays(),lastDone=Number(lastFull?.courseDone ?? lastFull?.day ?? 0);if(done>=24&&(!lastFull||done-lastDone>=12))return'full';return'standard'}
  function simulationDue(){
    const h=history(),last=h[h.length-1],done=completedCourseDays();if(done<8)return false;if(WEEKLY_REVIEW_DAYS.includes(Number(s.day)))return true;if(!last)return true;
    const lastDone=Number(last.courseDone ?? last.day ?? 0);return done-lastDone>=4
    // v58 compatibility marker: (Number(s.day)||0)-Number(last.day||0)>=4
  }
  function domainPlan(mode){
    const n=MODES[mode].questions;if(mode==='full')return SKILLS.flatMap(k=>Array(6).fill(k));if(mode==='standard')return SKILLS.flatMap(k=>Array(4).fill(k));
    if(mode==='quick')return ['reading','listening','writing','grammar','reading','speaking','listening','writing','grammar','reading'];
    const weak=weakestSkill(),others=SKILLS.filter(x=>x!==weak),plan=Array(7).fill(weak);while(plan.length<n)plan.push(others[(plan.length-7)%others.length]);return shuffle(plan);
  }
  function distractors(card,pool){return [...new Set(shuffle(pool.filter(x=>x.de!==card.de).map(x=>x.de)))].slice(0,3)}
  function cardForSkill(skill,pool,used){
    let candidates=pool.filter(x=>!used.has(core.normalize(x.uk)));if(skill==='grammar'||skill==='speaking')candidates=candidates.filter(x=>x.words>=3);
    if(!candidates.length)candidates=pool.filter(x=>(skill==='grammar'||skill==='speaking')?x.words>=3:true);const card=pick(candidates.length?candidates:pool);if(card)used.add(core.normalize(card.uk));return card
  }
  function makeQuestion(skill,pool,used){
    const c=cardForSkill(skill,pool,used);if(!c)return null;const base={skill,uk:c.uk,de:c.de,answer:c.uk,plays:0,assisted:false,spoken:false,user:'',correct:false};
    if(skill==='reading')return {...base,type:'choice',prompt:c.uk,options:shuffle([c.de,...distractors(c,pool)]),correctValue:c.de};
    if(skill==='listening')return {...base,type:'listening',prompt:'Höre den ukrainischen Ausdruck und wähle die Bedeutung.',options:shuffle([c.de,...distractors(c,pool)]),correctValue:c.de};
    if(skill==='grammar')return {...base,type:'typing',prompt:'Schreibe das ukrainische Satzmuster vollständig:',sub:c.de};
    if(skill==='speaking')return {...base,type:'speaking',prompt:'Sag den Satz zuerst laut. Tippe danach exakt, was du gesagt hast:',sub:c.de};
    return {...base,type:'typing',prompt:'Schreibe auf Ukrainisch:',sub:c.de};
  }
  let session=null;
  function createSession(mode){const cfg=MODES[mode]||MODES.standard,pool=introducedCards();if(pool.length<8){toast('Für Prüfungssimulationen brauchst du erst etwas mehr eingeführten Lernstoff.');return null}const used=new Set(),questions=domainPlan(cfg.id).map(k=>makeQuestion(k,pool,used)).filter(Boolean);return {mode:cfg.id,questions,idx:0,startedAt:Date.now(),answers:[],finished:false}}
  function statusLabel(x){return x==='green'?'Grün':x==='yellow'?'Gelb':x==='red'?'Rot':'Noch wenig Daten'}
  function renderDashboard(){
    const root=document.getElementById('progress');if(!root)return;let box=document.getElementById('examDashboard');if(!box){box=document.createElement('article');box.id='examDashboard';box.className='card exam-dashboard';root.insertBefore(box,root.firstElementChild)}
    const sig=signals(),overall=learningPercent(),course=coursePercent(),avg=simulationAverage(),overallLight=lightForScore(overall,sig.reduce((n,x)=>n+(x.evidence>0?1:0),0)>=3?2:0),rec=recommendedMode(),due=simulationDue();
    const lightRows=sig.map(x=>'<div class="ed-skill '+x.status+'"><span class="ed-dot" aria-hidden="true"></span><div><strong>'+esc(x.label)+'</strong><small>'+statusLabel(x.status)+(x.score==null?'':' · '+x.score+'%')+'</small></div><b>'+(x.score==null?'–':x.score+'%')+'</b></div>').join('');
    const modes=Object.values(MODES).map(m=>'<button class="ed-mode" data-exam-mode="'+m.id+'"><strong>'+esc(m.title)+'</strong><span>'+m.questions+' Fragen · ca. '+m.minutes+' Min.</span><small>'+esc(m.desc)+'</small></button>').join('');
    const hist=recentHistory(5).reverse(),histHtml=hist.length?hist.map((x,i)=>'<div class="ed-history"><span>'+esc(MODES[x.mode]?.title||'Simulation')+'</span><strong>'+x.score+'%</strong><small>'+esc(x.date||'')+(i===0?' · zuletzt':'')+'</small></div>').join(''):'<p class="small">Noch keine Prüfungssimulation abgeschlossen.</p>';
    box.innerHTML='<div class="ed-head"><div><div class="label">Lernampel & Prüfungstraining</div><h2>Wie prüfungsfest ist dein aktueller Lernstoff?</h2></div><div class="ed-score '+overallLight+'"><strong>'+overall+'%</strong><span>Lernstand</span></div></div><p class="small">Der Prozentwert kombiniert gemessene Kursleistungen, Kursfortschritt und deine letzten Übungsprüfungen. Er ist <strong>keine offizielle CEFR-Bestehenswahrscheinlichkeit</strong>.</p><div class="ed-metrics"><div><strong>'+course+'%</strong><span>Kursweg</span></div><div><strong>'+(avg==null?'–':avg+'%')+'</strong><span>Ø letzte Prüfungen</span></div><div><strong>'+history().length+'</strong><span>Simulationen</span></div></div><h3>Lernampel</h3><div class="ed-skills">'+lightRows+'</div><div class="ed-legend"><span class="green">● ab 80%</span><span class="yellow">● 60–79%</span><span class="red">● unter 60%</span><span class="grey">● zu wenig Daten</span></div>'+(due?'<div class="ed-due"><strong>Prüfungstraining empfohlen.</strong> Seit deiner letzten Simulation ist wieder genug neuer Stoff dazugekommen. Empfehlung: <b>'+esc(MODES[rec].title)+'</b>.</div>':'')+'<h3>Prüfung simulieren</h3><div class="ed-modes">'+modes+'</div><p class="small">Übungssimulationen beeinflussen niemals die bestehenden A1-Prüfungsgates. Sprechfragen bewerten nur den erinnerten Satz, nicht Aussprache oder Akzent.</p><h3>Letzte Ergebnisse</h3><div class="ed-history-list">'+histHtml+'</div>';
    box.querySelectorAll('[data-exam-mode]').forEach(b=>b.onclick=()=>startSimulation(b.dataset.examMode));
  }
  function renderDueCard(){
    const learn=document.getElementById('learn');if(!learn)return;let box=document.getElementById('examDueCard');if(!simulationDue()){if(box)box.remove();return}if(!box){box=document.createElement('article');box.id='examDueCard';box.className='card ed-due-card';learn.querySelector('.card')?.insertAdjacentElement('afterend',box)}
    const mode=recommendedMode();box.innerHTML='<div class="label">Prüfungstraining fällig</div><h2>Kurz testen, was wirklich sitzt</h2><p class="small">Wie bei einer Führerschein-Lernapp kommt regelmäßig eine Simulation. Sie ist Übung und verändert deine echte A1-Prüfung nicht.</p><div class="actions"><button class="primary" id="edDueStart">'+esc(MODES[mode].title)+' starten</button><button class="secondary" id="edDueProgress">Lernampel ansehen</button></div>';box.querySelector('#edDueStart').onclick=()=>startSimulation(mode);box.querySelector('#edDueProgress').onclick=showProgress;
  }
  function showProgress(){document.querySelectorAll('.tab').forEach(t=>t.setAttribute('aria-selected',String(t.dataset.view==='progress')));document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.id==='progress'));renderDashboard();document.getElementById('examDashboard')?.scrollIntoView({behavior:'smooth',block:'start'})}
  function ensureExamBox(){let box=document.getElementById('examSimulationBox');if(!box){box=document.createElement('article');box.id='examSimulationBox';box.className='card exam-sim';document.getElementById('progress')?.append(box)}return box}
  function startSimulation(mode){session=createSession(mode);if(!session)return;showProgress();renderQuestion();setTimeout(()=>document.getElementById('examSimulationBox')?.scrollIntoView({behavior:'smooth',block:'start'}),0)}
  function canSystemTTS(){return typeof window.speechSynthesis!=='undefined'&&typeof window.SpeechSynthesisUtterance!=='undefined'}
  function playListening(q,button){
    if(q.plays>=2){toast('Maximal zwei Wiedergaben in dieser Simulation.');return}q.plays++;
    if(!canSystemTTS()){q.assisted=true;toast('Keine Sprachausgabe verfügbar. Der Text wird als unterstützter Fallback gezeigt.');renderQuestion();return}
    try{if(typeof speak==='function')speak(q.uk,button);else{const u=new SpeechSynthesisUtterance(q.uk);u.lang='uk-UA';speechSynthesis.cancel();speechSynthesis.speak(u)}}catch{q.assisted=true;toast('Sprachausgabe fehlgeschlagen. Unterstützter Text-Fallback aktiviert.')}renderQuestion()
  }
  function submitChoice(value){const q=session?.questions?.[session.idx];if(!q)return;if(q.type==='listening'&&q.plays<1&&!q.assisted){toast('Höre die Aufgabe zuerst mindestens einmal an.');return}q.user=value;q.correct=value===q.correctValue;session.answers.push({...q});session.idx++;session.idx>=session.questions.length?finishSimulation():renderQuestion()}
  function submitTyping(){const q=session?.questions?.[session.idx],box=document.getElementById('examSimulationBox');if(!q||!box)return;if(q.type==='speaking'&&!q.spoken){toast('Sag den Satz zuerst laut und bestätige das anschließend.');return}const value=String(box.querySelector('#edExamInput')?.value||'').trim();if(!value){toast('Bitte erst eine ukrainische Antwort eingeben.');return}q.user=value;q.correct=core.accepts(value,[q.answer]);session.answers.push({...q});session.idx++;session.idx>=session.questions.length?finishSimulation():renderQuestion()}
  function renderQuestion(){
    const box=ensureExamBox();if(!session||!box)return;const cfg=MODES[session.mode],q=session.questions[session.idx],pct=Math.round(session.idx/session.questions.length*100);if(!q)return;
    let body='';if(q.type==='choice')body='<div class="ed-question-uk" lang="uk">'+esc(q.prompt)+'</div><div class="answers">'+q.options.map(x=>'<button class="answer" data-choice="'+esc(x)+'">'+esc(x)+'</button>').join('')+'</div>';
    else if(q.type==='listening'){const enabled=q.plays>0||q.assisted;body='<div class="ed-listen"><button class="primary" id="edPlay">🔊 anhören ('+q.plays+'/2)</button>'+(q.assisted?'<div class="tip"><strong>Unterstützter Fallback:</strong> <span lang="uk">'+esc(q.uk)+'</span></div>':'')+'</div><p class="q">'+esc(q.prompt)+'</p><div class="answers">'+q.options.map(x=>'<button class="answer" data-choice="'+esc(x)+'" '+(enabled?'':'disabled')+'>'+esc(x)+'</button>').join('')+'</div>'+(enabled?'':'<p class="small">Die Antwortmöglichkeiten werden erst nach dem ersten Hörversuch freigeschaltet.</p>')}
    else body='<p class="q">'+esc(q.prompt)+'</p><div class="typing-meaning">'+esc(q.sub||'')+'</div>'+(q.type==='speaking'?'<button class="secondary" id="edSpoken">'+(q.spoken?'✓ laut gesprochen':'🎙️ Ich habe den Satz laut gesagt')+'</button>':'')+'<input id="edExamInput" class="typing-input" lang="uk" autocomplete="off" autocorrect="off" spellcheck="false" placeholder="Українською"><div class="actions" style="justify-content:center"><button class="primary" id="edSubmit">Antwort speichern</button></div>';
    box.hidden=false;box.innerHTML='<div class="ed-exam-top"><div><div class="label">'+esc(cfg.title)+'</div><h2>Frage '+(session.idx+1)+' / '+session.questions.length+'</h2></div><div class="pill">'+esc(LABELS[q.skill])+'</div></div><div class="progress"><i style="width:'+pct+'%"></i></div><p class="small">Während der Simulation gibt es keine Lösungshinweise. Auswertung erst am Ende.</p>'+body+'<div class="actions"><button class="ghost" id="edAbort">Simulation abbrechen</button></div>';
    box.querySelectorAll('[data-choice]').forEach(b=>b.onclick=()=>submitChoice(b.dataset.choice));const play=box.querySelector('#edPlay');if(play)play.onclick=()=>playListening(q,play);const spoken=box.querySelector('#edSpoken');if(spoken)spoken.onclick=()=>{q.spoken=true;renderQuestion();setTimeout(()=>document.getElementById('edExamInput')?.focus(),0)};const submit=box.querySelector('#edSubmit');if(submit)submit.onclick=submitTyping;box.querySelector('#edExamInput')?.addEventListener('keydown',e=>{if(e.key==='Enter')submitTyping()});box.querySelector('#edAbort').onclick=()=>{if(confirm('Prüfungssimulation wirklich abbrechen?')){session=null;box.hidden=true}};
  }
  function finishSimulation(){
    const cfg=MODES[session.mode],answers=session.answers,total=answers.length,correct=answers.filter(x=>x.correct).length,score=Math.round(correct/Math.max(1,total)*100),domains={};SKILLS.forEach(k=>{const a=answers.filter(x=>x.skill===k),c=a.filter(x=>x.correct).length;if(a.length)domains[k]={correct:c,total:a.length,score:Math.round(c/a.length*100),assisted:a.some(x=>x.assisted)}});
    const minDomain=Math.min(...Object.values(domains).map(x=>x.score)),passed=score>=cfg.threshold&&(session.mode!=='full'||minDomain>=60),entry={id:Date.now(),date:typeof date==='function'?date():new Date().toISOString().slice(0,10),day:Number(s.day)||0,courseDone:completedCourseDays(),mode:session.mode,score,correct,total,passed,domains,durationSec:Math.round((Date.now()-session.startedAt)/1000)};
    const st=ensure();st.history.push(entry);if(st.history.length>30)st.history.splice(0,st.history.length-30);
    for(const k of Object.keys(domains)){const d=domains[k],isSpeaking=k==='speaking';core.recordSession({skills:[k],correct:d.correct,total:d.total,passed:d.score>=80,assisted:d.assisted||isSpeaking,weight:isSpeaking?.3:.4,module:'practice-exam-simulation',day:Number(s.day)})}
    answers.filter(x=>!x.correct&&['writing','grammar','speaking'].includes(x.skill)).forEach(x=>window.UKRAINIAN_ERROR_MEMORY?.record?.({input:x.user,answers:[x.answer],prompt:x.de,correct:false,module:'practice-exam-simulation',day:Number(s.day),weight:.35}));save();session.finished=true;renderResult(entry,answers);session=null;renderDashboard();renderDueCard();
  }
  function renderResult(entry,answers){
    const box=ensureExamBox(),cfg=MODES[entry.mode],domains=SKILLS.map(k=>{const d=entry.domains[k];if(!d)return'';const light=lightForScore(d.score,2);return '<div class="ed-result-domain '+light+'"><span class="ed-dot"></span><strong>'+LABELS[k]+'</strong><b>'+d.score+'%</b></div>'}).join(''),mistakes=answers.filter(x=>!x.correct),mistakeHtml=mistakes.length?mistakes.slice(0,12).map(x=>'<div class="ed-mistake"><small>'+esc(LABELS[x.skill])+'</small><strong>'+esc(x.de)+'</strong><span lang="uk">'+esc(x.answer)+'</span>'+(x.user?'<em>Deine Antwort: '+esc(x.user)+'</em>':'')+'</div>').join(''):'<div class="tip">Keine Fehler in dieser Simulation.</div>',resultLight=lightForScore(entry.score,2);
    box.hidden=false;box.innerHTML='<div class="label">Auswertung · '+esc(cfg.title)+'</div><div class="ed-result-head"><div class="ed-score '+resultLight+'"><strong>'+entry.score+'%</strong><span>Ergebnis</span></div><div><h2>'+(entry.passed?'Übung bestanden':'Noch nicht stabil genug')+'</h2><p class="small">'+entry.correct+' von '+entry.total+' richtig. Bestehensziel für diese Übung: '+cfg.threshold+'%'+(entry.mode==='full'?' und kein Bereich unter 60%':'')+'.</p></div></div><div class="ed-result-domains">'+domains+'</div><h3>Fehler ansehen</h3>'+mistakeHtml+'<div class="actions"><button class="primary" id="edAgain">Neue '+esc(cfg.title)+'</button><button class="secondary" id="edWeak">Schwächenprüfung</button></div><p class="small">Diese Auswertung ist ein Lernindikator. Sie ersetzt weder die spätere A1-Abschlussprüfung noch eine offizielle Sprachprüfung.</p>';box.querySelector('#edAgain').onclick=()=>startSimulation(entry.mode);box.querySelector('#edWeak').onclick=()=>startSimulation('weak');box.scrollIntoView({behavior:'smooth',block:'start'});
  }
  function renderAll(){renderDashboard();renderDueCard()}
  const css=document.createElement('style');css.textContent='.exam-dashboard h3,.exam-sim h3{margin:20px 0 9px}.ed-head,.ed-exam-top,.ed-result-head{display:flex;gap:14px;justify-content:space-between;align-items:center}.ed-score{width:92px;height:92px;border-radius:50%;display:grid;place-content:center;text-align:center;flex:none;border:8px solid #cdd9e6;background:#fff}.ed-score strong{font-size:1.35rem;line-height:1;color:#103e75}.ed-score span{font-size:.67rem;color:#60708a;margin-top:5px}.ed-score.green{border-color:#42b97c}.ed-score.yellow{border-color:#f1bf31}.ed-score.red{border-color:#df6676}.ed-score.grey{border-color:#cdd9e6}.ed-metrics{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:14px 0}.ed-metrics div{background:#f1f7ff;border-radius:13px;padding:11px;text-align:center}.ed-metrics strong{display:block;font-size:1.2rem;color:#103e75}.ed-metrics span{font-size:.72rem;color:#60708a}.ed-skills{display:grid;gap:7px}.ed-skill{display:grid;grid-template-columns:16px 1fr auto;gap:9px;align-items:center;padding:10px 12px;border-radius:13px;background:#f5f8fb}.ed-skill small{display:block;color:#60708a}.ed-dot{width:12px;height:12px;border-radius:50%;background:#bac6d3;display:inline-block}.green .ed-dot,.ed-skill.green .ed-dot{background:#25a967}.yellow .ed-dot,.ed-skill.yellow .ed-dot{background:#e7ae12}.red .ed-dot,.ed-skill.red .ed-dot{background:#d74a5e}.grey .ed-dot,.ed-skill.grey .ed-dot{background:#aab6c3}.ed-legend{display:flex;gap:10px;flex-wrap:wrap;font-size:.72rem;margin-top:9px}.ed-legend .green{color:#16834e}.ed-legend .yellow{color:#9a7100}.ed-legend .red{color:#b62e41}.ed-legend .grey{color:#697b90}.ed-due{margin:15px 0;padding:12px 13px;border-radius:13px;background:#fff4cb;border-left:4px solid #e5b21d}.ed-modes{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.ed-mode{border:1px solid #cfe0f4;background:#fff;border-radius:15px;padding:12px;text-align:left;color:#15243b;cursor:pointer}.ed-mode strong,.ed-mode span,.ed-mode small{display:block}.ed-mode span{font-size:.78rem;color:#155db5;font-weight:750;margin:2px 0}.ed-mode small{color:#60708a}.ed-history,.ed-result-domain{display:grid;grid-template-columns:1fr auto;gap:3px 10px;align-items:center;padding:8px 10px;border-bottom:1px solid #e3ebf4}.ed-history small{grid-column:1/-1;color:#60708a}.ed-question-uk{font-size:1.7rem;font-weight:800;text-align:center;color:#103e75;margin:22px 0}.ed-listen{text-align:center;margin:20px 0}.ed-result-domains{display:grid;grid-template-columns:repeat(2,1fr);gap:7px;margin:14px 0}.ed-result-domain{grid-template-columns:14px 1fr auto;border:0;background:#f5f8fb;border-radius:12px}.ed-mistake{padding:10px 0;border-bottom:1px solid #e3ebf4}.ed-mistake small,.ed-mistake strong,.ed-mistake span,.ed-mistake em{display:block}.ed-mistake span{color:#103e75;font-weight:800}.ed-mistake em{font-size:.78rem;color:#9b4250;font-style:normal}.ed-due-card{border-left:5px solid #f1bf31}@media(max-width:560px){.ed-modes{grid-template-columns:1fr}.ed-head,.ed-result-head{align-items:flex-start}.ed-score{width:78px;height:78px;border-width:6px}.ed-metrics{grid-template-columns:1fr 1fr 1fr}.ed-result-domains{grid-template-columns:1fr}}';document.head.append(css);
  ensure();window.UKRAINIAN_EXAM_DASHBOARD={version:VERSION,practiceOnly:true,affectsExamGate:false,trafficLight:true,trafficThresholds:{red:'<60',yellow:'60-79',green:'80+'},modes:Object.keys(MODES),modeCount:Object.keys(MODES).length,frequentRecommendationEveryLessons:4,coursePercent,learningPercent,simulationAverage,skillSignal,signals,recommendedMode,simulationDue,start:startSimulation,listeningPlayRequired:true,ttsFallbackHonest:true,reloadSafeCourseProgress:true,completedCourseDays};
  const previousRender=render;render=function(){previousRender();renderAll()};renderAll();
})();