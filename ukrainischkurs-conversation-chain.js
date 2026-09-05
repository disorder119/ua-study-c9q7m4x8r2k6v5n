/* Ukrainischkurs für Joel · Conversation Chain v3
   Mehrteilige Gespräche mit sichtbarem Verlauf. Frühe Ketten hängen an konkreten
   eingeführten Lernobjekten; Bewertung und Skill-Evidenz laufen zentral. */
(()=>{
  const VERSION=3,core=window.UKRAINIAN_LEARNING_CORE;
  const speakingStart=Number(s.speakingBridge?.start);
  const fallbackNorm=x=>String(x||'').normalize('NFC').toLocaleLowerCase('uk').replace(/[ʼ’‘'`]/g,'’').replace(/[.!?,…]/g,'').replace(/\s+/g,' ').trim();
  const accepts=(v,a)=>core?core.accepts(v,a):a.map(fallbackNorm).includes(fallbackNorm(v));
  const dayOf=(needle,fallback)=>core?core.introductionDay(needle,{fallback}):fallback;
  const CHAINS={};const attach=(day,items)=>{if(Number.isFinite(day)&&day>=0)CHAINS[day]=items};
  attach(dayOf('Він з Києва',Number(s.genitiveBridge?.start)+2),[
    {q:'Звідки ти?',a:['Я з Німеччини'],hint:'Antworte: Ich komme aus Deutschland.'},
    {q:'Де ти зараз?',a:['Я в Києві','Я у Києві'],hint:'Antworte: Ich bin jetzt in Kyjiw.'},
    {q:'Куди ти йдеш?',a:['Я йду в магазин'],hint:'Antworte: Ich gehe ins Geschäft.'},
    {q:'Чого у тебе немає?',a:['У мене немає води'],hint:'Antworte: Ich habe kein Wasser.'}
  ]);
  attach(dayOf('п’ять квитків',Number(s.genitiveBridge?.start)+4),[
    {q:'Що ти хочеш?',a:['Я хочу каву'],hint:'Antworte: Ich möchte Kaffee.'},
    {q:'Скільки це коштує?',a:['Це десять гривень','Десять гривень'],hint:'Antworte: Das kostet zehn Hrywnja.'},
    {q:'У тебе є квиток?',a:['У мене немає квитка','Ні, у мене немає квитка'],hint:'Antworte: Ich habe kein Ticket.'},
    {q:'Що ти будеш робити завтра?',a:['Завтра я буду працювати','Я буду працювати завтра'],hint:'Antworte: Morgen werde ich arbeiten.'}
  ]);
  if(Number.isFinite(speakingStart))attach(speakingStart+2,[
    {q:'Звідки ти?',a:['Я з Німеччини'],hint:'Ich komme aus Deutschland.'},
    {q:'Де ти зараз?',a:['Я в готелі','Я у готелі'],hint:'Ich bin jetzt im Hotel.'},
    {q:'Чого у тебе немає?',a:['У мене немає води'],hint:'Ich habe kein Wasser.'},
    {q:'Куди ти йдеш?',a:['Я йду в магазин'],hint:'Ich gehe ins Geschäft.'},
    {q:'Де ти був учора?',a:['Вчора я був у готелі','Учора я був у готелі','Вчора я був в готелі','Учора я був в готелі'],hint:'Gestern war ich im Hotel. (männliche Form)'},
    {q:'Що ти будеш робити завтра?',a:['Завтра я буду працювати','Я буду працювати завтра'],hint:'Morgen werde ich arbeiten.'}
  ]);
  function ensure(){if(!s.conversationChain||typeof s.conversationChain!=='object')s.conversationChain={version:VERSION,days:{}};s.conversationChain.version=VERSION;s.conversationChain.days=s.conversationChain.days||{};return s.conversationChain}
  function required(){return Array.isArray(CHAINS[Number(s.day)])}
  function state(){const st=ensure(),k=String(s.day);return st.days[k]||(st.days[k]={passed:false,best:0,attempts:0,date:''})}
  let session=null;
  function startChain(){session={items:CHAINS[Number(s.day)],idx:0,correct:0,history:[],listened:0};renderBox()}
  function answer(value){const item=session.items[session.idx],good=accepts(value,item.a);session.history.push({q:item.q,a:value||'—',good});if(good)session.correct++;toast(good?'Passt.':'Eine passende Antwort ist: '+item.a[0]);session.idx++;if(session.idx>=session.items.length){const st=state(),perfect=session.correct===session.items.length,score=Math.round(session.correct/session.items.length*100);st.best=Math.max(st.best||0,score);st.attempts++;st.date=date();st.passed=perfect;if(core)core.recordSession({skills:['reading','writing','grammar'],correct:session.correct,total:session.items.length,passed:perfect,module:'conversation-chain',day:s.day,assisted:session.listened>0});else save();session=null;toast(perfect?'Gesprächskette bestanden.':'Noch nicht stabil: alle Antworten müssen in einem frischen Gespräch passen.');render();return}renderBox()}
  function historyHtml(){return session.history.map(x=>'<div class="cc-line"><div><b>Partner:</b> <span lang="uk">'+x.q+'</span></div><div><b>Du:</b> <span lang="uk">'+x.a+'</span> '+(x.good?'✓':'✗')+'</div></div>').join('')}
  function renderBox(){let box=document.getElementById('conversationChainBox');if(!required()){if(box)box.hidden=true;return}const cards=document.getElementById('cards');if(!cards)return;if(!box){box=document.createElement('section');box.id='conversationChainBox';box.className='card';cards.insertAdjacentElement('afterend',box)}box.hidden=false;const st=state(),total=CHAINS[Number(s.day)].length;if(session){const item=session.items[session.idx];box.innerHTML='<div class="label">Gesprächskette · '+(session.idx+1)+' / '+session.items.length+'</div><h2>Ein Gespräch zusammenhalten</h2>'+historyHtml()+'<div class="cc-current"><button class="secondary" id="ccListen">🔊</button><span lang="uk">'+item.q+'</span></div><p class="small">'+item.hint+'</p><input id="ccInput" class="typing-input" lang="uk" autocapitalize="off" autocorrect="off" autocomplete="off" spellcheck="false" placeholder="Auf Ukrainisch antworten …"><div class="actions"><button class="primary" id="ccCheck">Antwort senden</button></div>';const inp=document.getElementById('ccInput');document.getElementById('ccCheck').onclick=()=>answer(inp.value);document.getElementById('ccListen').onclick=e=>{session.listened++;speak(item.q,e.currentTarget)};inp.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();answer(inp.value)}};setTimeout(()=>inp.focus(),0)}else box.innerHTML='<div class="label">Gespräch · '+total+' zusammenhängende Züge</div><h2>Nicht Einzelkarten, sondern ein Gespräch</h2><p class="small">Die frühen Ketten hängen direkt an den eingeführten Genitiv-Lernobjekten; Verschiebungen im Kurs verschieben die Übung automatisch mit.</p><div class="tip">'+(st.passed?'✓ Alle '+total+' Antworten passten in einem Gespräch.':'Bestehen: '+total+'/'+total+' in einem frischen Durchgang.')+'</div><div class="actions"><button class="'+(st.passed?'secondary':'primary')+'" id="ccStart">'+(st.passed?'noch einmal':'Gespräch starten')+'</button></div>';const btn=document.getElementById('ccStart');if(btn)btn.onclick=startChain}
  const oldNext=document.getElementById('next')?.onclick;if(document.getElementById('next'))document.getElementById('next').onclick=function(e){if(required()&&!state().passed){renderBox();document.getElementById('conversationChainBox')?.scrollIntoView({behavior:'smooth',block:'center'});toast('Vor dem nächsten Tag erst die heutige Gesprächskette vollständig bestehen.');return}return oldNext?.call(this,e)};
  const css=document.createElement('style');css.textContent='.cc-line{padding:9px 11px;margin:7px 0;border-radius:12px;background:#f4f8fc}.cc-current{display:flex;gap:10px;align-items:center;font-size:1.4rem;font-weight:800;margin:14px 0}.cc-current button{flex:none}';document.head.append(css);
  window.UKRAINIAN_CONVERSATION_CHAIN={version:VERSION,maxTurns:Math.max(...Object.values(CHAINS).map(x=>x.length)),dynamicAnchors:true};
  const previousRender=render;render=function(){previousRender();renderBox()};ensure();renderBox();
})();