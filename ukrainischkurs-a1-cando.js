/* Ukrainischkurs für Joel · A1 Can-do Check v3
   Abschlussprüfung für konkrete Anfängerhandlungen. Freie Produktion, Hören,
   Situationsverständnis und der neue Ort-vs.-Richtung-Transfer werden getrennt geprüft. */
(() => {
  const VERSION=3;
  const TASKS=[
    {mode:'type',q:'Tippe: „Ich verstehe nicht.“',a:'Я не розумію',critical:true},
    {mode:'type',q:'Tippe: „Wie viel kostet das?“',a:'Скільки це коштує',critical:true},
    {mode:'type',q:'Tippe: „Wo ist die Haltestelle?“',a:'Де зупинка',critical:true},
    {mode:'type',q:'Tippe: „Ich brauche Hilfe.“',a:'Мені потрібна допомога',critical:true},
    {mode:'type',q:'Tippe: „Ich komme aus Deutschland.“',a:'Я з Німеччини'},
    {mode:'type',q:'Tippe: „Ich lerne Ukrainisch.“',a:'Я вивчаю українську'},
    {mode:'type',q:'Tippe: „Verstehst du?“',a:'Ти розумієш'},
    {mode:'type',q:'Tippe: „Ich möchte essen.“',a:'Я хочу їсти'},
    {mode:'type',q:'Tippe: „Ich gehe ins Geschäft.“',a:'Я йду в магазин',bridge:true},
    {mode:'type',q:'Tippe: „Ich bin im Geschäft.“',a:'Я в магазині',bridge:true},
    {mode:'choice',q:'Jemand fragt „Як справи?“. Welche einfache Antwort passt?',a:'Все добре, дякую',o:['Все добре, дякую','Де зупинка?','Скільки це коштує?']},
    {mode:'meaning',q:'Was bedeutet „У мене немає…“?',a:'Ich habe kein / keine …',o:['Ich habe kein / keine …','Ich möchte …','Ich weiß …']},
    {mode:'audio',uk:'Я не знаю.',q:'Höre zu. Was bedeutet der Satz?',a:'Ich weiß nicht',o:['Ich weiß nicht','Ich kann nicht','Ich will nicht']},
    {mode:'audio',uk:'Де туалет?',q:'Höre zu. Was sucht die Person?',a:'Die Toilette',o:['Die Toilette','Die Apotheke','Die Haltestelle']},
    {mode:'audio',uk:'Я хочу пити.',q:'Höre zu. Welches Bedürfnis wird genannt?',a:'Trinken',o:['Trinken','Essen','Schlafen']},
    {mode:'audio',uk:'Де ти живеш?',q:'Höre zu. Was wird gefragt?',a:'Wo du wohnst',o:['Wo du wohnst','Wie du heißt','Ob du verstehst']}
  ];
  let session=null;
  const shuffle=a=>[...a].sort(()=>Math.random()-.5);
  const norm=x=>String(x||'').normalize('NFC').toLocaleLowerCase('uk').replace(/[ʼ’‘'`]/g,'’').replace(/[.!?,…]/g,'').replace(/\s+/g,' ').trim();
  function ensure(){if(!s.a1CanDo||typeof s.a1CanDo!=='object')s.a1CanDo={version:VERSION,passed:false,best:0,attempts:0,date:'',criticalPassed:false,bridgePassed:false};s.a1CanDo.version=VERSION;return s.a1CanDo}
  function finalDay(){return s.day===D.length-1}
  function start(){session={items:shuffle(TASKS),idx:0,correct:0,criticalMiss:false,bridgeMiss:false,misses:[],phase:'test'};renderCanDo()}
  function current(){return session?.items?.[session.idx]}
  function answer(value){const q=current(),good=norm(value)===norm(q.a);if(session.phase==='test'){if(good)session.correct++;else{session.misses.push(q);if(q.critical)session.criticalMiss=true;if(q.bridge)session.bridgeMiss=true}}if(session.phase==='repair'&&!good){toast('Noch nicht. Richtig ist: '+q.a);return}toast(good?'Passt.':'Richtig ist: '+q.a);session.idx++;if(session.idx>=session.items.length){if(session.phase==='test'&&session.misses.length){session.items=[...session.misses];session.misses=[];session.idx=0;session.phase='repair';renderCanDo();return}finish();return}renderCanDo()}
  function finish(){const st=ensure(),score=Math.round(session.correct/TASKS.length*100),passed=session.correct>=13&&!session.criticalMiss&&!session.bridgeMiss;st.best=Math.max(st.best||0,score);st.attempts=(st.attempts||0)+1;st.date=date();st.criticalPassed=!session.criticalMiss;st.bridgePassed=!session.bridgeMiss;st.passed=passed;save();session=null;toast(passed?'Can-do-Check bestanden.':'Can-do noch nicht stabil: Ziel 13/16, alle vier Selbsthilfe-Aufgaben und beide Ort/Richtung-Aufgaben müssen im ersten Versuch stimmen.');render()}
  function taskHtml(){const q=current(),repair=session.phase==='repair',head='<div class="label">'+(repair?'Reparatur':'Can-do · erster Versuch zählt')+'</div><div class="small">'+(session.idx+1)+' von '+session.items.length+'</div><div class="cd-q">'+q.q+'</div>';if(q.mode==='type')return head+'<input class="typing-input" id="cdInput" lang="uk" autocapitalize="off" autocorrect="off" autocomplete="off" spellcheck="false" placeholder="Ukrainisch selbst eingeben …"><div class="actions"><button class="primary" id="cdCheck">Prüfen</button></div>'+(repair?'<div class="tip">Die Reparatur hilft beim Lernen, ändert aber die Punktzahl des ersten Durchgangs nicht.</div>':'');const listen=q.mode==='audio'?'<button class="secondary" id="cdListen">🔊 ohne Text anhören</button>':'';return head+listen+'<div class="cd-grid">'+shuffle(q.o).map(x=>'<button class="answer" data-cd="'+x.replace(/"/g,'&quot;')+'">'+x+'</button>').join('')+'</div>'}
  function renderCanDo(){let box=document.getElementById('a1CanDo');if(!finalDay()){if(box)box.hidden=true;return}const cards=document.getElementById('cards');if(!cards)return;if(!box){box=document.createElement('section');box.id='a1CanDo';box.className='card';cards.insertAdjacentElement('afterend',box)}box.hidden=false;const st=ensure();box.innerHTML='<div class="cd-head"><div><div class="label">Abschluss · handlungsorientiert</div><h2>Kannst du die Grundlagen wirklich selbst benutzen?</h2></div><div class="pill">'+(st.passed?'✓':'16')+'</div></div><p class="small">Zehn Aufgaben verlangen freie ukrainische Eingabe, vier prüfen Hören und zwei situationsbezogenes Verstehen. Ort und Richtung müssen aktiv auseinandergehalten werden.</p>'+(session?taskHtml():'<div class="tip">'+(st.passed?'✓ Can-do-Check bestanden.':'Bestehen: mindestens 13/16 im ersten Durchgang, alle vier kritischen Selbsthilfe-Aufgaben und beide Ort/Richtung-Aufgaben korrekt.')+'</div><div class="actions"><button class="'+(st.passed?'secondary':'primary')+'" id="cdStart">'+(st.passed?'noch einmal':'Can-do-Check starten')+'</button></div>');box.querySelectorAll('[data-cd]').forEach(b=>b.onclick=()=>answer(b.dataset.cd));const startBtn=document.getElementById('cdStart');if(startBtn)startBtn.onclick=start;const check=document.getElementById('cdCheck'),input=document.getElementById('cdInput');if(check&&input){check.onclick=()=>answer(input.value);input.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();answer(input.value)}};setTimeout(()=>input.focus(),50)}const listen=document.getElementById('cdListen');if(listen&&current()?.uk)listen.onclick=()=>speak(current().uk,listen)}
  const baseNext=document.getElementById('next')?.onclick;if(document.getElementById('next'))document.getElementById('next').onclick=function(e){if(finalDay()&&!ensure().passed){renderCanDo();document.getElementById('a1CanDo')?.scrollIntoView({behavior:'smooth',block:'center'});toast('Vor dem Kursabschluss erst zeigen, dass du die Grundlagen frei anwenden und verstehen kannst.');return}return baseNext?.call(this,e)};
  const css=document.createElement('style');css.textContent='.cd-head{display:flex;justify-content:space-between;gap:12px}.cd-q{font-size:1.08rem;font-weight:800;margin:14px 0}.cd-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:10px}.cd-grid .answer{text-align:center}@media(max-width:520px){.cd-grid{grid-template-columns:1fr}}';document.head.append(css);
  const previousRender=render;render=function(){previousRender();renderCanDo()};ensure();renderCanDo();
})();