/* Ukrainischkurs für Joel · Dictation v4
   Hör-Abruf auf adaptiven Review-Tagen: nur tatsächlich eingeführte Sätze,
   gemeinsame Bewertung und höhere Frequenz bei schwachem Hör-Skill. */
(()=>{
  const VERSION=4,core=window.UKRAINIAN_LEARNING_CORE;
  const ITEMS=[
    {uk:'Скільки це коштує?',critical:true},{uk:'Де зупинка?',critical:true},{uk:'Мені потрібна допомога',critical:true},
    {uk:'Я не знаю'},{uk:'Я розумію'},{uk:'Я не розумію',critical:true},{uk:'Ти розумієш?'},
    {uk:'Я хочу їсти'},{uk:'Я хочу пити'},{uk:'Де туалет?'},{uk:'Я з Німеччини'},{uk:'Я вивчаю українську'},
    {uk:'Я живу в готелі'},{uk:'Це моя сім’я'}
  ];
  const shuffle=a=>[...a].sort(()=>Math.random()-.5);
  const fallbackNorm=x=>String(x||'').normalize('NFC').toLocaleLowerCase('uk').replace(/[.!?,…]/g,'').replace(/[ʼ’‘'`]/g,'’').replace(/\s+/g,' ').trim();
  const accepts=(v,a)=>core?core.accepts(v,[a]):fallbackNorm(v)===fallbackNorm(a);
  const available=()=>ITEMS.filter(x=>core?core.isIntroduced(x.uk):true);
  const reviewDays=()=>[...new Set(WEEKLY_REVIEW_DAYS.map(Number))].filter(d=>d<D.length-1).sort((a,b)=>a-b);
  const reviewDay=()=>{const i=reviewDays().indexOf(Number(s.day));if(i<0||available().length<4)return false;const focus=core?.reviewFocus?.();return focus==='listening'||i%3===2};
  function ensure(){if(!s.dictation||typeof s.dictation!=='object')s.dictation={version:VERSION,days:{}};s.dictation.version=VERSION;s.dictation.days=s.dictation.days||{};return s.dictation}
  function state(){const k=String(s.day),st=ensure();return st.days[k]||(st.days[k]={passed:false,best:0,attempts:0,date:''})}
  let session=null;
  function start(){const pool=available();session={items:shuffle(pool).slice(0,Math.min(4,pool.length)),idx:0,correct:0,criticalMiss:false,heard:false};renderBox()}
  function listen(){const q=session.items[session.idx];session.heard=true;const btn=document.getElementById('dictListen');speak(q.uk,btn)}
  function answer(v){if(!session.heard){toast('Erst anhören.');return}const q=session.items[session.idx],good=accepts(v,q.uk);if(good)session.correct++;else if(q.critical)session.criticalMiss=true;toast(good?'Richtig gehört.':'Richtig ist: '+q.uk);session.idx++;session.heard=false;if(session.idx>=session.items.length){const st=state(),score=Math.round(session.correct/session.items.length*100),passed=session.correct>=Math.max(1,session.items.length-1)&&!session.criticalMiss;st.best=Math.max(st.best||0,score);st.attempts++;st.date=date();st.passed=passed;if(core)core.recordSession({skills:['listening','writing'],correct:session.correct,total:session.items.length,passed,module:'dictation',day:s.day});else save();session=null;toast(passed?'Hör-Diktat bestanden.':'Noch nicht stabil: maximal ein unkritischer Fehler; kritische Alltagssätze müssen korrekt verstanden werden.');render();return}renderBox()}
  function renderBox(){let box=document.getElementById('dictationBox');if(!reviewDay()){if(box)box.hidden=true;return}const cards=document.getElementById('cards');if(!cards)return;if(!box){box=document.createElement('section');box.id='dictationBox';box.className='card';cards.insertAdjacentElement('afterend',box)}box.hidden=false;const st=state(),focus=core?.reviewFocus?.();if(!session){box.innerHTML='<div class="label">Review · Hör-Diktat</div><h2>Hören → tippen</h2><p class="small">Keine sichtbare Vorlage. Die Auswahl enthält ausschließlich Sätze, die im Kurs bereits wirklich eingeführt wurden. Die Systemstimme bleibt ein technischer Hörkanal.</p><div class="tip">'+(st.passed?'✓ Für diesen Review-Tag bestanden.':((focus==='listening')?'Heute automatisch verstärkt, weil Hören der aktuelle Review-Fokus ist. ':'')+'Bestehen: höchstens ein unkritischer Fehler; wichtige Sätze müssen sitzen.')+'</div><div class="actions"><button class="'+(st.passed?'secondary':'primary')+'" id="dictStart">'+(st.passed?'noch einmal':'Hör-Diktat starten')+'</button></div>';document.getElementById('dictStart').onclick=start;return}box.innerHTML='<div class="label">Diktat · '+(session.idx+1)+' / '+session.items.length+'</div><h2>Nur hören</h2><div class="actions"><button class="secondary" id="dictListen">🔊 anhören</button></div><input id="dictInput" class="typing-input" lang="uk" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="Gehörten Satz tippen …"><div class="actions"><button class="primary" id="dictCheck">Prüfen</button></div>';document.getElementById('dictListen').onclick=listen;const inp=document.getElementById('dictInput');document.getElementById('dictCheck').onclick=()=>answer(inp.value);inp.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();answer(inp.value)}}}
  const oldNext=document.getElementById('next')?.onclick;if(document.getElementById('next'))document.getElementById('next').onclick=function(e){if(reviewDay()&&!state().passed){renderBox();document.getElementById('dictationBox')?.scrollIntoView({behavior:'smooth',block:'center'});toast('Vor dem nächsten Tag erst das adaptive Hör-Diktat bestehen.');return}return oldNext?.call(this,e)};
  const previousRender=render;render=function(){previousRender();renderBox()};ensure();renderBox();
})();