/* Ukrainischkurs für Joel · Open Dialogue v1
   Ukrainische Frage verstehen und eine passende ukrainische Antwort selbst erzeugen.
   Keine Antwortbuttons; nur bereits eingeführte Muster. */
(()=>{
  const VERSION=1;
  const bridgeStart=Number(s.a1GrammarBridge?.start);
  const norm=x=>String(x||'').normalize('NFC').toLocaleLowerCase('uk').replace(/[ʼ’‘'`]/g,'’').replace(/[.!?,…]/g,'').replace(/\s+/g,' ').trim();
  const SETS={};
  SETS[bridgeStart+2]=[
    {q:'Ти розумієш?',context:'Antworte vollständig: „Ja, ich verstehe.“',a:['Так, я розумію']},
    {q:'Ти хочеш каву?',context:'Antworte vollständig: „Ja, ich möchte Kaffee.“',a:['Так, я хочу каву']},
    {q:'Де ти живеш?',context:'Antworte: „Ich wohne in Kyjiw.“',a:['Я живу в Києві','Я живу у Києві']}
  ];
  SETS[bridgeStart+5]=[
    {q:'Куди ти йдеш?',context:'Antworte: „Ich gehe ins Geschäft.“',a:['Я йду в магазин']},
    {q:'Що ти хочеш?',context:'Antworte: „Ich möchte Kaffee.“',a:['Я хочу каву']},
    {q:'Де ти?',context:'Antworte: „Ich bin im Restaurant.“',a:['Я в ресторані','Я у ресторані']}
  ];
  function ensure(){if(!s.openDialogue||typeof s.openDialogue!=='object')s.openDialogue={version:VERSION,days:{}};s.openDialogue.version=VERSION;s.openDialogue.days=s.openDialogue.days||{};return s.openDialogue}
  function required(){return Array.isArray(SETS[Number(s.day)])}
  function state(){const st=ensure(),k=String(s.day);return st.days[k]||(st.days[k]={passed:false,best:0,attempts:0,date:''})}
  let session=null;
  function start(){const items=SETS[Number(s.day)]||[];session={items:[...items].sort(()=>Math.random()-.5),idx:0,correct:0};renderBox()}
  function answer(value){const q=session.items[session.idx],good=q.a.map(norm).includes(norm(value));if(good)session.correct++;toast(good?'Passende Antwort.':'Eine passende Antwort ist: '+q.a[0]);session.idx++;if(session.idx>=session.items.length){const st=state(),score=Math.round(session.correct/session.items.length*100);st.best=Math.max(st.best||0,score);st.attempts++;st.date=date();st.passed=session.correct===session.items.length;save();session=null;toast(st.passed?'Offener Dialog bestanden.':'Noch nicht stabil: alle drei Antworten müssen in einem frischen Durchgang passen.');render();return}renderBox()}
  function renderBox(){let box=document.getElementById('openDialogueBox');if(!required()){if(box)box.hidden=true;return}const cards=document.getElementById('cards');if(!cards)return;if(!box){box=document.createElement('section');box.id='openDialogueBox';box.className='card';cards.insertAdjacentElement('afterend',box)}box.hidden=false;const st=state();if(session){const q=session.items[session.idx];box.innerHTML='<div class="label">Offener Dialog · '+(session.idx+1)+' / '+session.items.length+'</div><h2 lang="uk" class="od-question">'+q.q+'</h2><p class="small">'+q.context+'</p><input id="odInput" class="typing-input" lang="uk" autocapitalize="off" autocorrect="off" autocomplete="off" spellcheck="false" placeholder="Auf Ukrainisch antworten …"><div class="actions"><button class="primary" id="odCheck">Antwort prüfen</button></div>';const inp=document.getElementById('odInput');document.getElementById('odCheck').onclick=()=>answer(inp.value);inp.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();answer(inp.value)}};setTimeout(()=>inp.focus(),0)}else box.innerHTML='<div class="label">Gesprächstransfer</div><h2>Frage verstehen → selbst antworten</h2><p class="small">Die Frage kommt auf Ukrainisch. Du bekommst nur die Situation, keine ukrainische Antwortauswahl.</p><div class="tip">'+(st.passed?'✓ Alle drei Antworten saßen im selben Durchgang.':'Bestehen: 3/3 in einem frischen Durchgang.')+'</div><div class="actions"><button class="'+(st.passed?'secondary':'primary')+'" id="odStart">'+(st.passed?'noch einmal':'Dialog starten')+'</button></div>';const btn=document.getElementById('odStart');if(btn)btn.onclick=start}
  const oldNext=document.getElementById('next')?.onclick;if(document.getElementById('next'))document.getElementById('next').onclick=function(e){if(required()&&!state().passed){renderBox();document.getElementById('openDialogueBox')?.scrollIntoView({behavior:'smooth',block:'center'});toast('Vor dem nächsten Tag erst den offenen ukrainischen Dialog bestehen.');return}return oldNext?.call(this,e)};
  const css=document.createElement('style');css.textContent='.od-question{font-size:1.65rem;margin:12px 0}';document.head.append(css);
  const previousRender=render;render=function(){previousRender();renderBox()};ensure();renderBox();
})();