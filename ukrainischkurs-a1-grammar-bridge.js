/* Ukrainischkurs für Joel · A1 Grammar Bridge v2
   Systematisiert bereits bekannte Chunks: Ort vs. Richtung, einfacher Akkusativ,
   Präsensformen und Bewegung. Bewertung läuft über den zentralen Lernkern. */
(()=>{
  const VERSION=2,core=window.UKRAINIAN_LEARNING_CORE;
  const start=D.length;
  const LESSONS=[
    ['Ort oder Richtung?','Де? und Куди? bewusst unterscheiden.','Bei в/у und на entscheidet die Bedeutung: Ort (де?) nutzt bei diesen Ortsmustern den Lokativ, Richtung (куди?) den Akkusativ.',[
      ['Де ти?','Wo bist du?','de ty'],['Куди ти йдеш?','Wohin gehst du?','ku-dy ty jdesch'],['Я в магазині','Ich bin im Geschäft','ja w ma-ha-sy-ni'],['Я йду в магазин','Ich gehe ins Geschäft','ja jdu w ma-ha-syn'],['Я в ресторані','Ich bin im Restaurant','ja w res-to-ra-ni']
    ]],
    ['Akkusativ als Ziel und Objekt','Nicht die Kasustabelle lernen, sondern das Muster hören.','Bei vielen femininen Wörtern auf -а wird im Akkusativ -у: кава → каву, вода → воду, аптека → аптеку.',[
      ['кава → каву','Kaffee: Grundform → Objektform','ka-wa → ka-wu'],['вода → воду','Wasser: Grundform → Objektform','wo-da → wo-du'],['аптека → аптеку','Apotheke: Grundform → Richtungsform','ap-te-ka → ap-te-ku'],['Я хочу каву','Ich möchte Kaffee','ja cho-tschu ka-wu'],['Я йду в аптеку','Ich gehe in die Apotheke','ja jdu w ap-te-ku']
    ]],
    ['Я und Ти zusammen','Verbformen als Paar statt als Einzelchunks.','Du kennst viele Ich- und Du-Formen schon. Jetzt werden die Endungen bewusst als zusammengehörige Paare abgerufen.',[
      ['Я хочу · Ти хочеш','ich möchte · du möchtest','ja cho-tschu · ty cho-tschesch'],['Я можу · Ти можеш','ich kann · du kannst','ja mo-schu · ty mo-schessch'],['Я знаю · Ти знаєш','ich weiß · du weißt','ja sna-ju · ty sna-jesch'],['Я розумію · Ти розумієш','ich verstehe · du verstehst','ja ro-su-mi-ju · ty ro-su-mi-jesch'],['Я живу · Ти живеш','ich wohne · du wohnst','ja schy-wu · ty schy-wesch']
    ]],
    ['Він und Вона','Dritte Person in häufigen Verben.','Für ein erstes A1-System reichen zunächst einige sehr häufige Formen. Ziel ist Satzbildung mit bekannten Personenwörtern.',[
      ['Він хоче…','Er möchte …','win cho-tsche'],['Вона може…','Sie kann …','wo-na mo-sche'],['Він знає…','Er weiß …','win sna-je'],['Вона розуміє…','Sie versteht …','wo-na ro-su-mi-je'],['Він живе…','Er wohnt / lebt …','win schy-we']
    ]],
    ['Bewegung mit Ziel','Gehen und Fahren nicht mehr isoliert lernen.','Verb + Ziel werden als Einheit geübt. Куди? löst die Richtungsform aus.',[
      ['Я йду в магазин','Ich gehe ins Geschäft','ja jdu w ma-ha-syn'],['Я йду в аптеку','Ich gehe in die Apotheke','ja jdu w ap-te-ku'],['Я йду в ресторан','Ich gehe ins Restaurant','ja jdu w res-to-ran'],['Я їду в Київ','Ich fahre nach Kyjiw','ja ji-du w ky-jiw'],['Куди ти їдеш?','Wohin fährst du?','ku-dy ty ji-desch']
    ]],
    ['Objekte wirklich benutzen','Akkusativ nicht nur erkennen, sondern in Sätzen erzeugen.','Bei vielen unbelebten maskulinen Wörtern bleibt die Form gleich; feminine -а-Wörter zeigen den Wechsel besonders sichtbar.',[
      ['Я беру квиток','Ich nehme das Ticket','ja be-ru kwy-tok'],['Я хочу чай','Ich möchte Tee','ja cho-tschu tschaj'],['Я хочу каву','Ich möchte Kaffee','ja cho-tschu ka-wu'],['Я п’ю воду','Ich trinke Wasser','ja pju wo-du'],['Що ти хочеш?','Was möchtest du?','schtscho ty cho-tschesch']
    ]],
    ['Transfer-Review: Ort, Richtung, Verb','Keine neuen Karten. Alte Muster werden in neuen Kombinationen geprüft.','Heute zählt, ob du selbst entscheidest: де oder куди, welche Verbperson und welche Objektform gebraucht wird.',[]]
  ];
  const fallbackNorm=x=>String(x||'').normalize('NFC').toLocaleLowerCase('uk').replace(/[ʼ’‘'`]/g,'’').replace(/[.!?,…]/g,'').replace(/\s+/g,' ').trim();
  const same=(value,answers)=>core?core.accepts(value,answers):answers.map(fallbackNorm).includes(fallbackNorm(value));
  const RULES={};
  const rule=(offset,title,note,items)=>RULES[start+offset]={title,note,items};
  rule(0,'Де? oder Куди?','Ort und Richtung müssen ohne Antwortbuttons auseinandergehalten werden.',[
    {q:'Du bist im Geschäft.',a:['Я в магазині']},{q:'Du gehst ins Geschäft.',a:['Я йду в магазин']},{q:'Frage: „Wohin gehst du?“',a:['Куди ти йдеш?']}
  ]);
  rule(1,'Akkusativ-Grundmuster','Erzeuge die Ziel-/Objektform selbst.',[
    {q:'Ich möchte Kaffee.',a:['Я хочу каву']},{q:'Ich trinke Wasser.',a:['Я п’ю воду',"Я п'ю воду"]},{q:'Ich gehe in die Apotheke.',a:['Я йду в аптеку']}
  ]);
  rule(2,'Я ↔ Ти','Wechsle die Person ohne Auswahlhilfe.',[
    {q:'Verstehst du?',a:['Ти розумієш?']},{q:'Ich kann …',a:['Я можу…','Я можу']},{q:'Wo wohnst du?',a:['Де ти живеш?']}
  ]);
  rule(3,'Він / Вона','Bilde einfache Aussagen über andere Personen.',[
    {q:'Er möchte …',a:['Він хоче…','Він хоче']},{q:'Sie versteht …',a:['Вона розуміє…','Вона розуміє']},{q:'Er wohnt / lebt …',a:['Він живе…','Він живе']}
  ]);
  rule(4,'Bewegung + Ziel','Wähle die Richtungsform aus der Bedeutung.',[
    {q:'Ich gehe ins Restaurant.',a:['Я йду в ресторан']},{q:'Ich fahre nach Kyjiw.',a:['Я їду в Київ']},{q:'Wohin fährst du?',a:['Куди ти їдеш?']}
  ]);
  rule(5,'Objektproduktion','Objektformen in echten Sätzen.',[
    {q:'Ich nehme das Ticket.',a:['Я беру квиток']},{q:'Ich möchte Kaffee.',a:['Я хочу каву']},{q:'Was möchtest du?',a:['Що ти хочеш?']}
  ]);
  rule(6,'Gemischter Transfer','Jetzt gibt die Aufgabe nicht mehr vor, welcher Grammatikpunkt gemeint ist.',[
    {q:'Du bist im Restaurant.',a:['Я в ресторані']},{q:'Du gehst in die Apotheke.',a:['Я йду в аптеку']},{q:'Sie kann …',a:['Вона може…','Вона може']},{q:'Ich trinke Wasser.',a:['Я п’ю воду',"Я п'ю воду"]},{q:'Wohin gehst du?',a:['Куди ти йдеш?']}
  ]);
  LESSONS.forEach(x=>D.push(x));
  const reviews=[...new Set([...WEEKLY_REVIEW_DAYS.map(Number).filter(d=>d<start),start-1,D.length-1])].sort((a,b)=>a-b);
  WEEKLY_REVIEW_DAYS.splice(0,WEEKLY_REVIEW_DAYS.length,...reviews);
  function ensure(){if(!s.a1GrammarBridge||typeof s.a1GrammarBridge!=='object')s.a1GrammarBridge={version:VERSION,start,rules:{}};s.a1GrammarBridge.version=VERSION;s.a1GrammarBridge.start=start;s.a1GrammarBridge.rules=s.a1GrammarBridge.rules||{};return s.a1GrammarBridge}
  function state(day){const st=ensure();return st.rules[String(day)]||(st.rules[String(day)]={passed:false,best:0,attempts:0,date:''})}
  let session=null;
  function startRule(){const r=RULES[s.day];if(!r)return;session={items:[...r.items].sort(()=>Math.random()-.5),idx:0,correct:0,misses:[]};renderBox()}
  function answer(value){const q=session.items[session.idx],good=same(value,q.a);if(good)session.correct++;else session.misses.push(q);toast(good?'Richtig.':'Muster: '+q.a[0]);session.idx++;if(session.idx>=session.items.length){const st=state(s.day),perfect=session.correct===session.items.length,score=Math.round(session.correct/session.items.length*100);st.best=Math.max(st.best||0,score);st.attempts++;st.date=date();st.passed=perfect;if(core)core.recordSession({skills:['grammar','writing'],correct:session.correct,total:session.items.length,passed:perfect,module:'a1-grammar-bridge',day:s.day});else save();session=null;toast(perfect?'Grammatik-Transfer bestanden.':'Noch nicht stabil: für diese Brücke ist ein frischer fehlerfreier Durchgang nötig.');render();return}renderBox()}
  function renderBox(){let box=document.getElementById('a1GrammarBridge');const r=RULES[s.day];if(!r){if(box)box.hidden=true;return}const cards=document.getElementById('cards');if(!cards)return;if(!box){box=document.createElement('section');box.id='a1GrammarBridge';box.className='card';cards.insertAdjacentElement('afterend',box)}box.hidden=false;const st=state(s.day);if(session){const q=session.items[session.idx];box.innerHTML='<div class="label">A1-Grammatik · '+(session.idx+1)+' / '+session.items.length+'</div><h2>'+r.title+'</h2><p class="agb-q">'+q.q+'</p><input id="agbInput" class="typing-input" lang="uk" autocapitalize="off" autocorrect="off" autocomplete="off" spellcheck="false" placeholder="Ukrainisch selbst bilden …"><div class="actions"><button class="primary" id="agbCheck">Prüfen</button></div>';const inp=document.getElementById('agbInput');document.getElementById('agbCheck').onclick=()=>answer(inp.value);inp.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();answer(inp.value)}};setTimeout(()=>inp.focus(),0)}else box.innerHTML='<div class="label">A1-System · aktive Grammatik</div><h2>'+r.title+'</h2><p class="small">'+r.note+'</p><div class="tip">'+(st.passed?'✓ Heute fehlerfrei produziert.':'Freigabe erst nach einem fehlerfreien Durchgang. Reparaturen helfen beim Lernen, zählen aber nicht rückwirkend.')+'</div><div class="actions"><button class="'+(st.passed?'secondary':'primary')+'" id="agbStart">'+(st.passed?'noch einmal':'Aktiven Test starten')+'</button></div>';const startBtn=document.getElementById('agbStart');if(startBtn)startBtn.onclick=startRule}
  const oldNext=document.getElementById('next')?.onclick;if(document.getElementById('next'))document.getElementById('next').onclick=function(e){if(RULES[s.day]&&!state(s.day).passed){renderBox();document.getElementById('a1GrammarBridge')?.scrollIntoView({behavior:'smooth',block:'center'});toast('Vor dem nächsten Tag erst den heutigen Grammatik-Transfer fehlerfrei produzieren.');return}return oldNext?.call(this,e)};
  const css=document.createElement('style');css.textContent='.agb-q{font-size:1.08rem;font-weight:850;margin:14px 0}';document.head.append(css);
  const previousRender=render;render=function(){previousRender();renderBox()};ensure();renderBox();
})();