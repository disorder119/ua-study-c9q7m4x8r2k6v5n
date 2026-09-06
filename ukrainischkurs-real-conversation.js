/* Ukrainischkurs für Joel · Real Conversation v1
   Späte freiwillige Gesprächssimulation. Kontrollierte A1-Verzweigungen statt
   vorgetäuschtem KI-Chat: nur bereits eingeführte Sprache wird vorausgesetzt. */
(()=>{
  const VERSION=1,core=window.UKRAINIAN_LEARNING_CORE;if(!core)return;
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const SCENARIOS=[
    {id:'cafe',title:'Café / Restaurant',requires:['Що ти хочеш?','Я хочу каву','Рахунок, будь ласка'],turns:[
      {q:'Привіт! Що ти хочеш?',a:['Я хочу каву','Я хочу чай','Я хочу воду'],help:'Sag, was du trinken möchtest.',react:v=>v.includes('чай')?'Добре, чай.':'Добре.'},
      {q:'Ти хочеш їсти?',a:['Так, я хочу їсти','Я хочу їсти','Ні, дякую'],help:'Antworte, ob du essen möchtest.',react:v=>v.includes('ні')?'Добре, тільки напій.':'Добре.'},
      {q:'Все добре?',a:['Так, все добре','Все добре, дякую','Так, дякую'],help:'Sag, dass alles gut ist.',react:()=> 'Чудово.'},
      {q:'Ще щось?',a:['Рахунок, будь ласка','Ні, дякую'],help:'Bitte um die Rechnung oder lehne höflich ab.',react:v=>v.includes('рахунок')?'Так, звичайно.':'Добре.'}
    ]},
    {id:'travel',title:'Unterwegs / Ticket',requires:['Звідки ти?','Я з Німеччини','Куди ти їдеш?','У мене немає квитка'],turns:[
      {q:'Звідки ти?',a:['Я з Німеччини'],help:'Sag, dass du aus Deutschland kommst.',react:()=> 'Добре.'},
      {q:'Куди ти їдеш?',a:['Я їду в Київ','Я їду до Києва'],help:'Sag, dass du nach Kyjiw fährst.',react:()=> 'Зрозуміло.'},
      {q:'У тебе є квиток?',a:['Ні, у мене немає квитка','У мене немає квитка','Так, у мене є квиток'],help:'Antworte, ob du ein Ticket hast.',react:v=>v.includes('немає')?'Тоді тобі потрібен квиток.':'Добре.'},
      {q:'Тобі потрібна допомога?',a:['Так, мені потрібна допомога','Ні, дякую'],help:'Antworte, ob du Hilfe brauchst.',react:v=>v.includes('так')?'Я допоможу.':'Добре.'}
    ]},
    {id:'help',title:'Nicht verstehen / Hilfe',requires:['Я не розумію','Повторіть, будь ласка','Мені потрібна допомога'],turns:[
      {q:'Ти розумієш?',a:['Ні, я не розумію','Я не розумію'],help:'Sag, dass du nicht verstehst.',react:()=> 'Добре, повільніше.'},
      {q:'Ще раз?',a:['Так, повторіть, будь ласка','Повторіть, будь ласка'],help:'Bitte um Wiederholung.',react:()=> 'Так, звичайно.'},
      {q:'Тобі потрібна допомога?',a:['Так, мені потрібна допомога','Мені потрібна допомога'],help:'Sag, dass du Hilfe brauchst.',react:()=> 'Добре, я допоможу.'},
      {q:'Все добре?',a:['Так, дякую','Все добре, дякую','Так, все добре'],help:'Bedanke dich und sage, dass alles gut ist.',react:()=> 'Чудово.'}
    ]},
    {id:'daily',title:'Kennenlernen / Alltag',requires:['Де ти живеш?','Я з Німеччини','Я вивчаю українську'],turns:[
      {q:'Звідки ти?',a:['Я з Німеччини'],help:'Woher kommst du?',react:()=> 'Приємно познайомитися.'},
      {q:'Де ти живеш?',a:['Я живу в Німеччині','Я живу у Німеччині','Я живу в Ашаффенбурзі'],help:'Sag, wo du wohnst.',react:()=> 'Добре.'},
      {q:'Ти говориш українською?',a:['Я вивчаю українську','Трохи','Трохи, я вивчаю українську'],help:'Sag, dass du Ukrainisch lernst oder ein bisschen sprichst.',react:()=> 'Супер!'},
      {q:'Ти розумієш?',a:['Так, я розумію','Трохи','Ні, я не розумію'],help:'Antworte ehrlich, ob du verstehst.',react:v=>v.includes('не розумію')?'Добре, я говоритиму повільніше.':'Добре.'}
    ]}
  ];
  const available=()=>SCENARIOS.filter(x=>core.allIntroduced(x.requires));
  const visible=()=>alphabetReady()&&core.isComplete?.('speaking.sentences')&&available().length>0;
  function ensure(){if(!s.realConversation||typeof s.realConversation!=='object')s.realConversation={version:VERSION,stats:{}};s.realConversation.version=VERSION;s.realConversation.stats=s.realConversation.stats||{};return s.realConversation}
  let session=null;
  function start(id){const sc=available().find(x=>x.id===id);if(!sc)return;session={scenario:sc,idx:0,history:[],correct:0,assisted:false,reaction:''};renderBox();setTimeout(()=>speak(sc.turns[0].q),120)}
  function current(){return session?.scenario?.turns?.[session.idx]||null}
  function help(){if(!session)return;session.assisted=true;renderBox()}
  function answer(value){const t=current(),user=String(value||'').trim();if(!user){toast('Antworte erst auf Ukrainisch.');return}const good=core.accepts(user,t.a);if(good)session.correct++;const reaction=typeof t.react==='function'?t.react(core.normalize(user)):good?'Добре.':'Я зрозумів. Спробуймо далі.';session.history.push({q:t.q,a:user,good,reaction});session.idx++;session.reaction=reaction;if(session.idx>=session.scenario.turns.length){finish();return}renderBox();setTimeout(()=>speak(current().q),350)}
  function finish(){const sc=session.scenario,total=sc.turns.length,score=Math.round(session.correct/total*100),root=ensure(),st=root.stats[sc.id]||(root.stats[sc.id]={best:0,attempts:0,last:''});st.best=Math.max(Number(st.best)||0,score);st.attempts++;st.last=date();save();const assisted=session.assisted;session={...session,finished:true,score,assisted};renderBox();toast('Gespräch beendet: '+score+' %. Das ist freiwillige Praxis, kein A1-Gate.')}
  function historyHtml(){return session.history.map(x=>'<div class="rc-line"><div><b>Partner:</b> <span lang="uk">'+esc(x.q)+'</span></div><div><b>Du:</b> <span lang="uk">'+esc(x.a)+'</span> '+(x.good?'✓':'△')+'</div><div class="small" lang="uk">↳ '+esc(x.reaction)+'</div></div>').join('')}
  function sessionHtml(){if(session.finished)return '<div class="label">Freies Gespräch · abgeschlossen</div><h2>'+esc(session.scenario.title)+'</h2>'+historyHtml()+'<div class="tip"><strong>'+session.score+' % passende A1-Reaktionen.</strong> '+(session.assisted?'Du hast mindestens einmal die deutsche Hilfe eingeblendet. ':'')+'Dieser Modus trainiert Gesprächsfluss und verändert keine A1-Bestehensgates.</div><div class="actions"><button class="secondary" id="rcAgain">Noch einmal</button><button class="ghost" id="rcBack">Andere Situation</button></div>';
    const t=current();return '<div class="label">Real Conversation · '+(session.idx+1)+' / '+session.scenario.turns.length+'</div><h2>'+esc(session.scenario.title)+'</h2>'+historyHtml()+(session.reaction?'<div class="rc-reaction" lang="uk">'+esc(session.reaction)+'</div>':'')+'<div class="rc-current"><button class="secondary" id="rcListen">🔊</button><span lang="uk">'+esc(t.q)+'</span></div>'+(session.assisted?'<div class="tip">Hilfe: '+esc(t.help)+'</div>':'')+'<input id="rcInput" class="typing-input" lang="uk" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="Natürlich auf Ukrainisch antworten …"><div class="actions"><button class="primary" id="rcSend">Antwort senden</button><button class="ghost" id="rcHelp">'+(session.assisted?'Hilfe sichtbar':'Deutsche Hilfe')+'</button></div>'}
  function renderBox(){let box=document.getElementById('realConversationBox');if(!visible()){if(box)box.hidden=true;return}const cards=document.getElementById('cards');if(!cards)return;if(!box){box=document.createElement('section');box.id='realConversationBox';box.className='card';cards.insertAdjacentElement('afterend',box)}box.hidden=false;if(session){box.innerHTML=sessionHtml();if(session.finished){document.getElementById('rcAgain').onclick=()=>start(session.scenario.id);document.getElementById('rcBack').onclick=()=>{session=null;renderBox()};return}const inp=document.getElementById('rcInput');document.getElementById('rcSend').onclick=()=>answer(inp.value);document.getElementById('rcHelp').onclick=help;document.getElementById('rcListen').onclick=e=>speak(current().q,e.currentTarget);inp.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();answer(inp.value)}};setTimeout(()=>inp.focus(),30);return}
    const stats=ensure().stats;box.innerHTML='<div class="label">Später Zusatz · echte Gesprächsreaktion</div><h2>Real Conversation Mode</h2><p class="small">Kein vorgetäuschter KI-Chat: Die Situationen verzweigen kontrolliert innerhalb deines bereits eingeführten A1-Stoffs. Keine Antwortbuttons, deutsche Hilfe nur auf Wunsch.</p><div class="rc-scenarios">'+available().map(sc=>'<button class="answer" data-rc="'+esc(sc.id)+'"><strong>'+esc(sc.title)+'</strong><span>'+(stats[sc.id]?.best!=null?'Bestwert '+stats[sc.id].best+' %':'noch nicht gespielt')+'</span></button>').join('')+'</div><div class="tip">Freiwillige Praxis. Fehler blockieren keinen Kurstag und erzeugen keine künstliche Aussprache- oder A1-Note.</div>';box.querySelectorAll('[data-rc]').forEach(b=>b.onclick=()=>start(b.dataset.rc))}
  const css=document.createElement('style');css.textContent='.rc-scenarios{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.rc-scenarios button{text-align:left}.rc-scenarios span{display:block;font-size:.76rem;color:#526b87;margin-top:3px}.rc-line{padding:8px 10px;border-radius:12px;background:#f4f8fc;margin:6px 0}.rc-current{display:flex;gap:10px;align-items:center;font-size:1.35rem;font-weight:850;margin:14px 0}.rc-current button{flex:none}.rc-reaction{font-weight:750;margin:10px 0}@media(max-width:560px){.rc-scenarios{grid-template-columns:1fr}}';document.head.append(css);
  window.UKRAINIAN_REAL_CONVERSATION={version:VERSION,optional:true,controlledBranches:true,affectsA1:false,scenarioCount:SCENARIOS.length};
  const previousRender=render;render=function(){previousRender();renderBox()};ensure();renderBox();
})();