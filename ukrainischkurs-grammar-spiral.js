/* Ukrainischkurs für Joel · Grammar Spiral v1
   Gemischter aktiver Abruf bereits gelernter A1-Muster auf Review-Tagen. */
(()=>{
  const VERSION=1;
  const BANK=[
    {min:39,q:'Schreibe auf Ukrainisch: „mein Freund“',a:['мій друг']},
    {min:39,q:'Schreibe auf Ukrainisch: „meine Familie“',a:['моя сім’я','моя сім\'я']},
    {min:40,q:'Schreibe: „Ich möchte …“',a:['я хочу']},
    {min:40,q:'Schreibe: „Ich habe …“',a:['я маю','у мене є']},
    {min:41,q:'Frage auf Ukrainisch: „Wo?“',a:['де']},
    {min:42,q:'Frage: „Wie viel kostet das?“',a:['скільки це коштує'],critical:true},
    {min:43,q:'Frage: „Wo ist die Haltestelle?“',a:['де зупинка'],critical:true},
    {min:44,q:'Schreibe: „Ich brauche Hilfe.“',a:['мені потрібна допомога'],critical:true},
    {min:45,q:'Schreibe: „Ich bin zu Hause.“',a:['я вдома','я зараз вдома']},
    {min:46,q:'Schreibe: „Ich weiß nicht.“',a:['я не знаю']},
    {min:48,q:'Schreibe: „Ich kann …“',a:['я можу']},
    {min:49,q:'Verneine: „Ich verstehe.“ → „Ich verstehe nicht.“',a:['я не розумію'],critical:true},
    {min:50,q:'Frage: „Verstehst du?“',a:['ти розумієш']},
    {min:50,q:'Frage: „Wo wohnst du?“',a:['де ти живеш']},
    {min:53,q:'Schreibe: „Ich möchte essen.“',a:['я хочу їсти']},
    {min:53,q:'Schreibe: „Ich möchte trinken.“',a:['я хочу пити']},
    {min:54,q:'Frage: „Wo ist die Toilette?“',a:['де туалет']},
    {min:56,q:'Schreibe: „Ich komme aus Deutschland.“',a:['я з німеччини']},
    {min:56,q:'Schreibe: „Ich lerne Ukrainisch.“',a:['я вивчаю українську']},
    {min:56,q:'Schreibe das Altersmuster: „Ich bin … Jahre alt.“',a:['мені років','мені … років']}
  ];
  const shuffle=a=>[...a].sort(()=>Math.random()-.5);
  const norm=x=>String(x||'').toLocaleLowerCase('uk').replace(/[.!?,…]/g,'').replace(/[’']/g,'’').replace(/\s+/g,' ').trim();
  const reviewDay=()=>Number(s.day)>=43&&(WEEKLY_REVIEW_DAYS.includes(Number(s.day))||Number(s.day)===D.length-1);
  const eligible=()=>BANK.filter(x=>x.min<=Number(s.day));
  function ensure(){if(!s.grammarSpiral||typeof s.grammarSpiral!=='object')s.grammarSpiral={version:VERSION,days:{}};s.grammarSpiral.version=VERSION;s.grammarSpiral.days=s.grammarSpiral.days||{};return s.grammarSpiral}
  function state(){const k=String(s.day),st=ensure();return st.days[k]||(st.days[k]={passed:false,best:0,attempts:0,date:''})}
  let session=null;
  function start(){const pool=eligible(),items=shuffle(pool).slice(0,Math.min(6,pool.length));session={items,idx:0,correct:0,criticalMiss:false,misses:[]};renderBox()}
  function answer(v){const q=session.items[session.idx],good=q.a.map(norm).includes(norm(v));if(good)session.correct++;else{session.misses.push(q);if(q.critical)session.criticalMiss=true}toast(good?'Richtig.':'Muster: '+q.a[0]);session.idx++;if(session.idx>=session.items.length){const st=state(),score=Math.round(session.correct/session.items.length*100),passed=session.correct>=Math.max(1,session.items.length-1)&&!session.criticalMiss;st.best=Math.max(st.best||0,score);st.attempts++;st.date=date();st.passed=passed;save();session=null;toast(passed?'Grammatik-Spirale bestanden.':'Noch nicht stabil: maximal ein unkritischer Fehler, kritische Alltagssätze müssen sitzen.');render();return}renderBox()}
  function renderBox(){let box=document.getElementById('grammarSpiral');if(!reviewDay()){if(box)box.hidden=true;return}const cards=document.getElementById('cards');if(!cards)return;if(!box){box=document.createElement('section');box.id='grammarSpiral';box.className='card';cards.insertAdjacentElement('afterend',box)}box.hidden=false;const st=state();if(session){const q=session.items[session.idx];box.innerHTML='<div class="label">Grammatik-Spirale · '+(session.idx+1)+' / '+session.items.length+'</div><h2>Ohne Antwortbuttons</h2><p class="gs-q">'+q.q+'</p><input id="gsInput" class="typing-input" lang="uk" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="Ukrainisch tippen …"><div class="actions"><button class="primary" id="gsCheck">Prüfen</button></div>'}else box.innerHTML='<div class="label">Review · gemischte Grammatik</div><h2>Alte Muster neu abrufen</h2><p class="small">Sechs Aufgaben aus bereits eingeführten Mustern werden gemischt. Keine Regelüberschrift verrät dir vorher, was gebraucht wird.</p><div class="tip">'+(st.passed?'✓ Für diesen Review-Tag bestanden.':'Bestehen: höchstens ein unkritischer Fehler; wichtige Sätze zu Preis, Orientierung, Hilfe und Nichtverstehen müssen korrekt sein.')+'</div><div class="actions"><button class="'+(st.passed?'secondary':'primary')+'" id="gsStart">'+(st.passed?'noch einmal':'Grammatik-Review starten')+'</button></div>';const startBtn=document.getElementById('gsStart');if(startBtn)startBtn.onclick=start;const inp=document.getElementById('gsInput'),check=document.getElementById('gsCheck');if(inp&&check){check.onclick=()=>answer(inp.value);inp.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();answer(inp.value)}};setTimeout(()=>inp.focus(),0)}}
  const oldNext=document.getElementById('next')?.onclick;if(document.getElementById('next'))document.getElementById('next').onclick=function(e){if(reviewDay()&&!state().passed){renderBox();document.getElementById('grammarSpiral')?.scrollIntoView({behavior:'smooth',block:'center'});toast('Vor dem nächsten Tag erst die gemischte Grammatik-Wiederholung bestehen.');return}return oldNext?.call(this,e)};
  const css=document.createElement('style');css.textContent='.gs-q{font-weight:800;font-size:1.06rem;margin:14px 0}';document.head.append(css);
  const previousRender=render;render=function(){previousRender();renderBox()};ensure();renderBox();
})();