/* Ukrainischkurs für Joel · Dictation v3
   Hör-Abruf auf gezielten Review-Tagen: hören, selbst tippen, erst danach Feedback. */
(()=>{
  const VERSION=3;
  const ITEMS=[
    {min:42,uk:'Скільки це коштує?',critical:true},
    {min:43,uk:'Де зупинка?',critical:true},
    {min:44,uk:'Мені потрібна допомога',critical:true},
    {min:46,uk:'Я не знаю'},
    {min:48,uk:'Я розумію'},
    {min:49,uk:'Я не розумію',critical:true},
    {min:50,uk:'Ти розумієш?'},
    {min:53,uk:'Я хочу їсти'},
    {min:53,uk:'Я хочу пити'},
    {min:54,uk:'Де туалет?'},
    {min:56,uk:'Я з Німеччини'},
    {min:56,uk:'Я вивчаю українську'},
    {min:56,uk:'Я живу в готелі'},
    {min:56,uk:'Це моя сім’я'}
  ];
  const shuffle=a=>[...a].sort(()=>Math.random()-.5);
  const norm=x=>String(x||'').normalize('NFC').toLocaleLowerCase('uk').replace(/[.!?,…]/g,'').replace(/[ʼ’‘'`]/g,'’').replace(/\s+/g,' ').trim();
  const lateReviews=()=>[...new Set(WEEKLY_REVIEW_DAYS.map(Number))].filter(d=>d>=43&&d<D.length-1).sort((a,b)=>a-b);
  const reviewDay=()=>{const i=lateReviews().indexOf(Number(s.day));return i>=0&&i%2===1};
  function ensure(){if(!s.dictation||typeof s.dictation!=='object')s.dictation={version:VERSION,days:{}};s.dictation.version=VERSION;s.dictation.days=s.dictation.days||{};return s.dictation}
  function state(){const k=String(s.day),st=ensure();return st.days[k]||(st.days[k]={passed:false,best:0,attempts:0,date:''})}
  let session=null;
  function start(){const pool=ITEMS.filter(x=>x.min<=Number(s.day));session={items:shuffle(pool).slice(0,Math.min(4,pool.length)),idx:0,correct:0,criticalMiss:false,heard:false};renderBox()}
  function listen(){const q=session.items[session.idx];session.heard=true;const btn=document.getElementById('dictListen');speak(q.uk,btn)}
  function answer(v){if(!session.heard){toast('Erst anhören.');return}const q=session.items[session.idx],good=norm(v)===norm(q.uk);if(good)session.correct++;else if(q.critical)session.criticalMiss=true;toast(good?'Richtig gehört.':'Richtig ist: '+q.uk);session.idx++;session.heard=false;if(session.idx>=session.items.length){const st=state(),score=Math.round(session.correct/session.items.length*100),passed=session.correct>=Math.max(1,session.items.length-1)&&!session.criticalMiss;st.best=Math.max(st.best||0,score);st.attempts++;st.date=date();st.passed=passed;save();session=null;toast(passed?'Hör-Diktat bestanden.':'Noch nicht stabil: maximal ein unkritischer Fehler; kritische Alltagssätze müssen korrekt verstanden werden.');render();return}renderBox()}
  function renderBox(){let box=document.getElementById('dictationBox');if(!reviewDay()){if(box)box.hidden=true;return}const cards=document.getElementById('cards');if(!cards)return;if(!box){box=document.createElement('section');box.id='dictationBox';box.className='card';cards.insertAdjacentElement('afterend',box)}box.hidden=false;const st=state();if(!session){box.innerHTML='<div class="label">Review · Hör-Diktat</div><h2>Hören → tippen</h2><p class="small">Keine sichtbare Vorlage. Du hörst vier bereits eingeführte Sätze und schreibst, was du verstanden hast. Die Systemstimme ist hier ein technischer Hörkanal, kein Ersatz für Muttersprachler-Audio.</p><div class="tip">'+(st.passed?'✓ Für diesen Review-Tag bestanden.':'Bestehen: höchstens ein unkritischer Fehler; wichtige Sätze zu Orientierung, Hilfe und Nichtverstehen müssen sitzen.')+'</div><div class="actions"><button class="'+(st.passed?'secondary':'primary')+'" id="dictStart">'+(st.passed?'noch einmal':'Hör-Diktat starten')+'</button></div>';document.getElementById('dictStart').onclick=start;return}box.innerHTML='<div class="label">Diktat · '+(session.idx+1)+' / '+session.items.length+'</div><h2>Nur hören</h2><div class="actions"><button class="secondary" id="dictListen">🔊 anhören</button></div><input id="dictInput" class="typing-input" lang="uk" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="Gehörten Satz tippen …"><div class="actions"><button class="primary" id="dictCheck">Prüfen</button></div>';document.getElementById('dictListen').onclick=listen;const inp=document.getElementById('dictInput');document.getElementById('dictCheck').onclick=()=>answer(inp.value);inp.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();answer(inp.value)}}}
  const oldNext=document.getElementById('next')?.onclick;if(document.getElementById('next'))document.getElementById('next').onclick=function(e){if(reviewDay()&&!state().passed){renderBox();document.getElementById('dictationBox')?.scrollIntoView({behavior:'smooth',block:'center'});toast('Vor dem nächsten Tag erst das Hör-Diktat bestehen.');return}return oldNext?.call(this,e)};
  const previousRender=render;render=function(){previousRender();renderBox()};ensure();renderBox();
})();