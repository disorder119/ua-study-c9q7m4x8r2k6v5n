/* Ukrainischkurs für Joel · Time Bridge v2
   Kleine A1-Brücke für Zeitbezug: gestern/heute/morgen, Vergangenheit und Zukunft.
   Bewertung und Skill-Evidenz laufen zentral über den Lernkern. */
(()=>{
  const VERSION=2,core=window.UKRAINIAN_LEARNING_CORE;
  const start=D.length;
  const LESSONS=[
    ['Gestern, heute, morgen','Zeit zuerst klar markieren.','Mit wenigen Zeitwörtern kannst du bekannte Sätze sofort zeitlich einordnen.',[
      ['вчора','gestern','wtscho-ra'],['сьогодні','heute','sjo-hod-ni'],['завтра','morgen','saw-tra'],['зараз','jetzt','sa-ras'],['потім','später / danach','po-tim']
    ]],
    ['Vergangenheit: був / була','Im Ukrainischen zeigt die Vergangenheitsform hier das Geschlecht der Person.','Für Joel ist „я був“ die eigene männliche Form; „я була“ brauchst du, wenn eine Frau über sich spricht.',[
      ['Я був у готелі','Ich war im Hotel (Mann)','ja buw u ho-te-li'],['Я була у готелі','Ich war im Hotel (Frau)','ja bu-la u ho-te-li'],['Він був удома','Er war zu Hause','win buw u-do-ma'],['Вона була вдома','Sie war zu Hause','wo-na bu-la wdo-ma'],['Де ти був?','Wo warst du? (zu einem Mann)','de ty buw']
    ]],
    ['Vergangenheit mit bekannten Verben','Bekannte Bedeutungen bekommen jetzt eine Vergangenheitsform.','Lerne die häufigen Formen als Paar. Für die männliche eigene Antwort endet vieles auf -в, die weibliche Form oft auf -ла.',[
      ['Я працював · Я працювала','ich arbeitete (Mann · Frau)','ja pra-zju-waw · pra-zju-wa-la'],['Я жив · Я жила','ich wohnte / lebte (Mann · Frau)','ja schyw · schy-la'],['Я говорив · Я говорила','ich sprach (Mann · Frau)','ja ho-wo-ryw · ho-wo-ry-la'],['Я хотів · Я хотіла','ich wollte (Mann · Frau)','ja cho-tiw · cho-ti-la'],['Вчора я працював','Gestern habe ich gearbeitet (Mann)','wtscho-ra ja pra-zju-waw']
    ]],
    ['Zukunft: буду + Infinitiv','Für eine einfache Anfänger-Zukunft reicht zunächst ein sehr produktives Muster.','Я буду + Infinitiv bedeutet „ich werde …“. Diese analytische Zukunft ist besonders transparent und lässt sich mit bekannten Verben kombinieren.',[
      ['Я буду працювати','Ich werde arbeiten','ja bu-du pra-zju-wa-ty'],['Я буду говорити','Ich werde sprechen','ja bu-du ho-wo-ry-ty'],['Я буду жити в Києві','Ich werde in Kyjiw wohnen','ja bu-du schy-ty w ky-je-wi'],['Я буду їсти','Ich werde essen','ja bu-du ji-sty'],['Я буду пити','Ich werde trinken','ja bu-du py-ty']
    ]],
    ['Ти будеш · Він/Вона буде','Zukunft auch außerhalb der Ich-Perspektive.','Das Vollverb bleibt im Infinitiv; nur буду / будеш / буде trägt hier die Person.',[
      ['Ти будеш працювати?','Wirst du arbeiten?','ty bu-desch pra-zju-wa-ty'],['Ти будеш говорити?','Wirst du sprechen?','ty bu-desch ho-wo-ry-ty'],['Він буде працювати','Er wird arbeiten','win bu-de pra-zju-wa-ty'],['Вона буде жити в Києві','Sie wird in Kyjiw wohnen','wo-na bu-de schy-ty w ky-je-wi'],['Що ти будеш робити завтра?','Was wirst du morgen machen?','schtscho ty bu-desch ro-by-ty saw-tra']
    ]],
    ['Zeit-Transfer','Vergangenheit, Gegenwart und Zukunft gemischt.','Keine neue Tabelle: Entscheide aus der Bedeutung, welche Zeitform gebraucht wird.',[]]
  ];
  const fallbackNorm=x=>String(x||'').normalize('NFC').toLocaleLowerCase('uk').replace(/[ʼ’‘'`]/g,'’').replace(/[.!?,…]/g,'').replace(/\s+/g,' ').trim();
  const accepts=(v,a)=>core?core.accepts(v,a):a.map(fallbackNorm).includes(fallbackNorm(v));
  const RULES={};
  const rule=(offset,title,note,items)=>RULES[start+offset]={title,note,items};
  rule(0,'Zeitwort wählen','Ordne bekannte Aussagen zeitlich ein.',[
    {q:'gestern',a:['вчора']},{q:'heute',a:['сьогодні']},{q:'morgen',a:['завтра']}
  ]);
  rule(1,'був / була','Produziere die passende Vergangenheitsform.',[
    {q:'Ich war im Hotel. (als Mann)',a:['Я був у готелі','Я був в готелі']},{q:'Ich war im Hotel. (als Frau)',a:['Я була у готелі','Я була в готелі']},{q:'Sie war zu Hause.',a:['Вона була вдома','Вона була удома']}
  ]);
  rule(2,'Vergangenheit aktiv','Bilde häufige eigene Aussagen.',[
    {q:'Gestern habe ich gearbeitet. (als Mann)',a:['Вчора я працював','Учора я працював']},{q:'Ich wollte … (als Mann)',a:['Я хотів…','Я хотів']},{q:'Ich sprach … (als Frau)',a:['Я говорила…','Я говорила']}
  ]);
  rule(3,'Я буду + Infinitiv','Bilde Zukunft ohne Antwortauswahl.',[
    {q:'Ich werde arbeiten.',a:['Я буду працювати']},{q:'Ich werde sprechen.',a:['Я буду говорити']},{q:'Ich werde in Kyjiw wohnen.',a:['Я буду жити в Києві','Я буду жити у Києві']}
  ]);
  rule(4,'будеш / буде','Wechsle die Person in der Zukunft.',[
    {q:'Wirst du arbeiten?',a:['Ти будеш працювати?']},{q:'Er wird arbeiten.',a:['Він буде працювати']},{q:'Sie wird in Kyjiw wohnen.',a:['Вона буде жити в Києві','Вона буде жити у Києві']}
  ]);
  rule(5,'Gemischter Zeit-Transfer','Die Aufgabe nennt die Zeit nicht als Grammatiklabel.',[
    {q:'Morgen werde ich arbeiten.',a:['Завтра я буду працювати','Я буду працювати завтра']},{q:'Gestern war ich im Hotel. (als Mann)',a:['Вчора я був у готелі','Учора я був у готелі','Вчора я був в готелі','Учора я був в готелі']},{q:'Sie war zu Hause.',a:['Вона була вдома','Вона була удома']},{q:'Wirst du sprechen?',a:['Ти будеш говорити?']},{q:'Heute bin ich zu Hause.',a:['Сьогодні я вдома','Я сьогодні вдома']}
  ]);
  LESSONS.forEach(x=>D.push(x));
  const reviews=[...new Set([...WEEKLY_REVIEW_DAYS.map(Number).filter(d=>d<start),start-1,D.length-1])].sort((a,b)=>a-b);
  WEEKLY_REVIEW_DAYS.splice(0,WEEKLY_REVIEW_DAYS.length,...reviews);
  function ensure(){if(!s.timeBridge||typeof s.timeBridge!=='object')s.timeBridge={version:VERSION,start,rules:{}};s.timeBridge.version=VERSION;s.timeBridge.start=start;s.timeBridge.rules=s.timeBridge.rules||{};return s.timeBridge}
  function state(day){const st=ensure();return st.rules[String(day)]||(st.rules[String(day)]={passed:false,best:0,attempts:0,date:''})}
  let session=null;
  function startRule(){const r=RULES[s.day];if(!r)return;session={items:[...r.items].sort(()=>Math.random()-.5),idx:0,correct:0};renderBox()}
  function answer(value){const q=session.items[session.idx],good=accepts(value,q.a);if(good)session.correct++;toast(good?'Richtig.':'Muster: '+q.a[0]);session.idx++;if(session.idx>=session.items.length){const st=state(s.day),perfect=session.correct===session.items.length,score=Math.round(session.correct/session.items.length*100);st.best=Math.max(st.best||0,score);st.attempts++;st.date=date();st.passed=perfect;if(core)core.recordSession({skills:['grammar','writing'],correct:session.correct,total:session.items.length,passed:perfect,module:'time-bridge',day:s.day});else save();session=null;toast(perfect?'Zeit-Transfer bestanden.':'Noch nicht stabil: starte einen neuen fehlerfreien Durchgang.');render();return}renderBox()}
  function renderBox(){let box=document.getElementById('timeBridgeBox');const r=RULES[s.day];if(!r){if(box)box.hidden=true;return}const cards=document.getElementById('cards');if(!cards)return;if(!box){box=document.createElement('section');box.id='timeBridgeBox';box.className='card';cards.insertAdjacentElement('afterend',box)}box.hidden=false;const st=state(s.day);if(session){const q=session.items[session.idx];box.innerHTML='<div class="label">Zeit-Transfer · '+(session.idx+1)+' / '+session.items.length+'</div><h2>'+r.title+'</h2><p class="tb-q">'+q.q+'</p><input id="tbInput" class="typing-input" lang="uk" autocapitalize="off" autocorrect="off" autocomplete="off" spellcheck="false" placeholder="Ukrainisch selbst bilden …"><div class="actions"><button class="primary" id="tbCheck">Prüfen</button></div>';const inp=document.getElementById('tbInput');document.getElementById('tbCheck').onclick=()=>answer(inp.value);inp.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();answer(inp.value)}};setTimeout(()=>inp.focus(),0)}else box.innerHTML='<div class="label">A1-Zeitformen · aktiv</div><h2>'+r.title+'</h2><p class="small">'+r.note+'</p><div class="tip">'+(st.passed?'✓ Heute fehlerfrei produziert.':'Freigabe erst nach einem frischen fehlerfreien Durchgang; Reparatur allein zählt nicht.')+'</div><div class="actions"><button class="'+(st.passed?'secondary':'primary')+'" id="tbStart">'+(st.passed?'noch einmal':'Aktiven Test starten')+'</button></div>';const btn=document.getElementById('tbStart');if(btn)btn.onclick=startRule}
  const oldNext=document.getElementById('next')?.onclick;if(document.getElementById('next'))document.getElementById('next').onclick=function(e){if(RULES[s.day]&&!state(s.day).passed){renderBox();document.getElementById('timeBridgeBox')?.scrollIntoView({behavior:'smooth',block:'center'});toast('Vor dem nächsten Tag erst den heutigen Zeit-Transfer fehlerfrei produzieren.');return}return oldNext?.call(this,e)};
  const css=document.createElement('style');css.textContent='.tb-q{font-size:1.08rem;font-weight:850;margin:14px 0}';document.head.append(css);
  const previousRender=render;render=function(){previousRender();renderBox()};ensure();renderBox();
})();