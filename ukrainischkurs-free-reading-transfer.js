/* Ukrainischkurs für Joel · Free Reading Transfer v3
   Kurze unbekannte Kombinationen aus bekanntem Stoff. Text wird nach dem Lesen
   ausgeblendet; Freischaltung und Bewertung laufen vollständig über den Lernkern. */
(()=>{
  const VERSION=3,core=window.UKRAINIAN_LEARNING_CORE;if(!core)return;
  const TARGET_DAY=core.anchorDay(['п’ять квитків','Я буду працювати']);
  const TEXTS=[
    {requires:['У мене немає води','Я йду в магазин','Я буду працювати'],text:'Учора я був у готелі. Сьогодні я в ресторані. У мене немає води. Потім я йду в магазин. Завтра я буду працювати.',qs:[
      {q:'Де ти був учора?',a:['У готелі','Я був у готелі','В готелі','Я був в готелі']},
      {q:'Чого у тебе немає?',a:['Води','У мене немає води']},
      {q:'Що ти будеш робити завтра?',a:['Працювати','Я буду працювати','Завтра я буду працювати']}
    ]},
    {requires:['Я з Німеччини','У мене немає грошей','Я буду говорити'],text:'Я з Німеччини. Зараз я в Києві. У мене немає грошей. Я йду в готель. Завтра я буду говорити українською.',qs:[
      {q:'Звідки ти?',a:['З Німеччини','Я з Німеччини']},
      {q:'Де ти зараз?',a:['У Києві','В Києві','Я в Києві','Я у Києві']},
      {q:'Чого у тебе немає?',a:['Грошей','У мене немає грошей']}
    ]},
    {requires:['Я в магазині','Це десять гривень','У мене немає квитка','Я йду в аптеку'],text:'Сьогодні я в магазині. Я хочу каву. Це десять гривень. У мене немає квитка. Потім я йду в аптеку.',qs:[
      {q:'Де ти сьогодні?',a:['У магазині','В магазині','Я в магазині','Я у магазині']},
      {q:'Скільки коштує кава?',a:['Десять гривень','Це десять гривень']},
      {q:'Чого у тебе немає?',a:['Квитка','У мене немає квитка']}
    ]}
  ];
  function ensure(){if(!s.freeReadingTransfer||typeof s.freeReadingTransfer!=='object')s.freeReadingTransfer={version:VERSION,passed:false,best:0,attempts:0,date:''};s.freeReadingTransfer.version=VERSION;return s.freeReadingTransfer}
  function available(){return TEXTS.filter(x=>core.allIntroduced(x.requires))}
  function required(){return TARGET_DAY>=0&&Number(s.day)===TARGET_DAY&&available().length>0}
  let session=null;
  function begin(){const pool=available(),item=pool[Math.floor(Math.random()*pool.length)];if(!item){toast('Der freie Lese-Transfer wartet noch auf seine Sprachbausteine.');return}session={item,phase:'read',idx:0,correct:0};renderBox()}
  function hideText(){if(!session)return;session.phase='questions';renderBox()}
  function answer(value){const q=session.item.qs[session.idx],good=core.accepts(value,q.a);if(good)session.correct++;toast(good?'Verstanden.':'Eine passende Antwort ist: '+q.a[0]);session.idx++;if(session.idx>=session.item.qs.length){const st=ensure(),perfect=session.correct===session.item.qs.length,score=Math.round(session.correct/session.item.qs.length*100);st.best=Math.max(st.best||0,score);st.attempts++;st.date=date();st.passed=perfect;core.recordSession({skills:['reading','writing'],correct:session.correct,total:session.item.qs.length,passed:perfect,module:'free-reading-transfer',day:s.day});session=null;toast(perfect?'Freier Lese-Transfer bestanden.':'Noch nicht stabil: neuer Text, neuer frischer Versuch.');render();return}renderBox()}
  function renderBox(){let box=document.getElementById('freeReadingTransferBox');if(!required()){if(box)box.hidden=true;return}const cards=document.getElementById('cards');if(!cards)return;if(!box){box=document.createElement('section');box.id='freeReadingTransferBox';box.className='card';cards.insertAdjacentElement('afterend',box)}box.hidden=false;const st=ensure();if(session?.phase==='read'){box.innerHTML='<div class="label">Unbekannter Kurztext</div><h2>Einmal lesen, dann verschwindet der Text</h2><div class="frt-text" lang="uk">'+session.item.text+'</div><p class="small">Keine Übersetzung. Lies auf Bedeutung, nicht Wort für Wort.</p><div class="actions"><button class="primary" id="frtHide">Text ausblenden & Fragen starten</button></div>';document.getElementById('frtHide').onclick=hideText;return}if(session?.phase==='questions'){const q=session.item.qs[session.idx];box.innerHTML='<div class="label">Freies Leseverständnis · '+(session.idx+1)+' / '+session.item.qs.length+'</div><h2 lang="uk">'+q.q+'</h2><p class="small">Der Text bleibt ausgeblendet. Antworte auf Ukrainisch aus dem Gedächtnis.</p><input id="frtInput" class="typing-input" lang="uk" autocapitalize="off" autocorrect="off" autocomplete="off" spellcheck="false" placeholder="Freie Antwort …"><div class="actions"><button class="primary" id="frtCheck">Prüfen</button></div>';const inp=document.getElementById('frtInput');document.getElementById('frtCheck').onclick=()=>answer(inp.value);inp.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();answer(inp.value)}};setTimeout(()=>inp.focus(),0);return}box.innerHTML='<div class="label">Transfer · kein Kartenwissen</div><h2>Unbekannten Kurztext wirklich verstehen</h2><p class="small">Die Aufgabe hängt am tatsächlichen Einführungszeitpunkt ihrer benötigten Lernobjekte – nicht mehr an genitiveStart+4.</p><div class="tip">'+(st.passed?'✓ 3/3 nach ausgeblendetem Text.':'Bestehen: 3/3 in einem frischen Textdurchgang.')+'</div><div class="actions"><button class="'+(st.passed?'secondary':'primary')+'" id="frtStart">'+(st.passed?'neuen Text':'Kurztext starten')+'</button></div>';document.getElementById('frtStart').onclick=begin}
  const oldNext=document.getElementById('next')?.onclick;if(document.getElementById('next'))document.getElementById('next').onclick=function(e){if(required()&&!ensure().passed){renderBox();document.getElementById('freeReadingTransferBox')?.scrollIntoView({behavior:'smooth',block:'center'});toast('Vor dem nächsten Tag erst den unbekannten Kurztext frei verstehen.');return}return oldNext?.call(this,e)};
  const css=document.createElement('style');css.textContent='.frt-text{font-size:1.32rem;line-height:1.65;font-weight:700;padding:16px;border-radius:15px;background:#f6f9fd;margin:14px 0}';document.head.append(css);
  window.UKRAINIAN_FREE_READING_TRANSFER={version:VERSION,dynamicAnchor:true,targetDay:TARGET_DAY};const previousRender=render;render=function(){previousRender();renderBox()};ensure();renderBox();
})();