/* Ukrainischkurs für Joel · Active Production v1
   Deutsch -> Ukrainisch ohne Multiple Choice. Review-Tage verlangen freie Produktion,
   damit passives Wiedererkennen nicht als Sprachkönnen durchgeht. */
(() => {
  const VERSION=1;
  const BANK=[
    {min:18,de:'Hallo!',uk:'Привіт'},
    {min:18,de:'Danke!',uk:'Дякую'},
    {min:18,de:'Ich heiße …',uk:'Мене звати…'},
    {min:19,de:'Bitte / gern.',uk:'Будь ласка'},
    {min:20,de:'Ich verstehe nicht.',uk:'Я не розумію',critical:true},
    {min:20,de:'Bitte wiederholen Sie.',uk:'Повторіть, будь ласка'},
    {min:21,de:'Mir geht es gut.',uk:'Мені добре'},
    {min:22,de:'Ich möchte Kaffee.',uk:'Я хочу каву'},
    {min:23,de:'Wo?',uk:'Де?'},
    {min:24,de:'Wo ist der Bahnhof?',uk:'Де вокзал?'},
    {min:25,de:'Bitte langsamer.',uk:'Повільніше, будь ласка'},
    {min:26,de:'Alles gut, danke.',uk:'Все добре, дякую'},
    {min:27,de:'Bis morgen.',uk:'До завтра'},
    {min:28,de:'Die Rechnung, bitte.',uk:'Рахунок, будь ласка'},
    {min:29,de:'Ich weiß nicht.',uk:'Я не знаю'},
    {min:31,de:'Ich brauche Hilfe.',uk:'Мені потрібна допомога',critical:true},
    {min:32,de:'Mir geht es schlecht.',uk:'Мені погано'},
    {min:34,de:'Wo ist die Apotheke?',uk:'Де аптека?'},
    {min:37,de:'Das ist mein Freund.',uk:'Це мій друг'},
    {min:38,de:'Das ist meine Familie.',uk:'Це моя сім’я'},
    {min:39,de:'Ich wohne / lebe …',uk:'Я живу…'},
    {min:39,de:'Ich spreche …',uk:'Я говорю…'},
    {min:40,de:'Wer ist das?',uk:'Хто це?'},
    {min:42,de:'Wie viel kostet das?',uk:'Скільки це коштує?',critical:true},
    {min:43,de:'Wo ist die Haltestelle?',uk:'Де зупинка?',critical:true},
    {min:44,de:'Ich bin jetzt zu Hause.',uk:'Я зараз вдома'},
    {min:46,de:'Ich habe …',uk:'У мене є…'},
    {min:48,de:'Ich kann …',uk:'Я можу…'},
    {min:48,de:'Ich verstehe …',uk:'Я розумію…'},
    {min:49,de:'Ich kann nicht …',uk:'Я не можу…'},
    {min:50,de:'Kannst du …?',uk:'Ти можеш…?'},
    {min:50,de:'Verstehst du?',uk:'Ти розумієш?'},
    {min:50,de:'Wo wohnst du?',uk:'Де ти живеш?'},
    {min:53,de:'Ich möchte essen.',uk:'Я хочу їсти'},
    {min:53,de:'Ich möchte trinken.',uk:'Я хочу пити'},
    {min:54,de:'Wo ist die Toilette?',uk:'Де туалет?'},
    {min:55,de:'Ich gehe …',uk:'Я йду…'},
    {min:55,de:'Ich fahre …',uk:'Я їду…'},
    {min:56,de:'Ich komme aus Deutschland.',uk:'Я з Німеччини',critical:true},
    {min:56,de:'Ich lerne Ukrainisch.',uk:'Я вивчаю українську'}
  ];
  const shuffle=a=>[...a].sort(()=>Math.random()-.5);
  const norm=x=>String(x||'').toLocaleLowerCase('uk').replace(/[ʼ'`]/g,'’').replace(/[…]/g,'').replace(/[.!?,]/g,'').replace(/\s+/g,' ').trim();
  let session=null;
  function ensure(){if(!s.activeProduction||typeof s.activeProduction!=='object')s.activeProduction={version:VERSION,days:{},best:0,totalAttempts:0};s.activeProduction.version=VERSION;s.activeProduction.days=s.activeProduction.days||{};return s.activeProduction}
  function dayState(){const st=ensure();return st.days[date()]||(st.days[date()]={passed:false,best:0})}
  function available(){return BANK.filter(x=>s.day>=x.min)}
  function requiredToday(){return alphabetReady()&&s.day>=20&&WEEKLY_REVIEW_DAYS.includes(s.day)}
  function start(){const pool=available();if(pool.length<5){toast('Freie Produktion öffnet sich nach einigen Wortlektionen.');return}const critical=shuffle(pool.filter(x=>x.critical)).slice(0,1),rest=shuffle(pool.filter(x=>!critical.includes(x))).slice(0,5-critical.length);session={items:shuffle([...critical,...rest]),idx:0,correct:0,criticalMiss:false,misses:[],phase:'test'};renderProduction()}
  function current(){return session?.items?.[session.idx]}
  function answer(v){const q=current(),good=norm(v)===norm(q.uk);if(session.phase==='test'){if(good)session.correct++;else{session.misses.push(q);if(q.critical)session.criticalMiss=true}}if(session.phase==='repair'&&!good){toast('Noch nicht. Richtig ist: '+q.uk);return}toast(good?'Richtig selbst produziert.':'Richtig wäre: '+q.uk);session.idx++;if(session.idx>=session.items.length){if(session.phase==='test'&&session.misses.length){session.items=[...session.misses];session.misses=[];session.idx=0;session.phase='repair';renderProduction();return}finish();return}renderProduction()}
  function finish(){const st=ensure(),ds=dayState(),score=Math.round(session.correct/5*100),passed=session.correct>=4&&!session.criticalMiss;st.best=Math.max(st.best||0,score);st.totalAttempts=(st.totalAttempts||0)+1;ds.best=Math.max(ds.best||0,score);ds.passed=passed;save();session=null;toast(passed?'Freie Produktion bestanden.':'Noch nicht stabil: mindestens 4/5 und die kritische Aufgabe muss im ersten Versuch stimmen.');render()}
  function testHtml(){const q=current(),repair=session.phase==='repair';return '<div class="apd-test"><div class="label">'+(repair?'Fehler-Reparatur':'Freie Produktion · erster Versuch zählt')+'</div><div class="small">'+(session.idx+1)+' / '+session.items.length+'</div><div class="apd-de">'+q.de+'</div><input class="typing-input" id="apdInput" lang="uk" autocapitalize="off" autocomplete="off" autocorrect="off" spellcheck="false" placeholder="Auf Ukrainisch aus dem Kopf …"><div class="actions"><button class="primary" id="apdCheck">Prüfen</button></div>'+(repair?'<div class="tip">Reparatur hilft beim Lernen, erhöht aber die ursprüngliche Punktzahl nicht.</div>':'')+'</div>'}
  function renderProduction(){let box=document.getElementById('activeProduction');if(!alphabetReady()||s.day<20){if(box)box.hidden=true;return}const cards=document.getElementById('cards');if(!cards)return;if(!box){box=document.createElement('section');box.id='activeProduction';box.className='card';cards.insertAdjacentElement('afterend',box)}box.hidden=false;const ds=dayState(),req=requiredToday();box.innerHTML='<div class="apd-head"><div><div class="label">Aktiver Abruf · Schreiben</div><h2>Deutsch sehen, Ukrainisch selbst erzeugen</h2></div><div class="pill">'+(ds.passed?'✓':'5')+'</div></div><p class="small">Keine Antwortknöpfe. Du musst die ukrainische Form selbst aus dem Gedächtnis erzeugen. Satzzeichen werden tolerant behandelt; die Wörter selbst nicht.</p>'+(session?testHtml():'<div class="tip">'+(req?(ds.passed?'✓ Freie Produktion für den Review-Tag erledigt.':'Heute Pflicht: 5 Aufgaben, mindestens 4/5 und eine kritische Alltagssituation im ersten Versuch richtig.'):'Freiwilliges Training; an Review-Tagen wird dieses Set verpflichtend.')+'</div><div class="actions"><button class="'+(ds.passed?'secondary':'primary')+'" id="apdStart">'+(ds.passed?'noch einmal':'5 freie Aufgaben starten')+'</button></div>');const startBtn=document.getElementById('apdStart');if(startBtn)startBtn.onclick=start;const check=document.getElementById('apdCheck'),input=document.getElementById('apdInput');if(check&&input){check.onclick=()=>answer(input.value);input.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();answer(input.value)}};setTimeout(()=>input.focus(),50)}}
  const oldNext=document.getElementById('next')?.onclick;if(document.getElementById('next'))document.getElementById('next').onclick=function(e){if(requiredToday()&&!dayState().passed){renderProduction();document.getElementById('activeProduction')?.scrollIntoView({behavior:'smooth',block:'center'});toast('Review-Tag: erst fünf ukrainische Antworten selbst aus dem Kopf produzieren.');return}return oldNext?.call(this,e)};
  const css=document.createElement('style');css.textContent='.apd-head{display:flex;justify-content:space-between;gap:12px}.apd-test{text-align:center;padding:14px;border-radius:16px;background:#f4f8fc}.apd-de{font-size:1.25rem;font-weight:850;margin:15px}.apd-test .typing-input{max-width:620px;margin:0 auto}';document.head.append(css);
  const previousRender=render;render=function(){previousRender();renderProduction()};ensure();renderProduction();
})();
