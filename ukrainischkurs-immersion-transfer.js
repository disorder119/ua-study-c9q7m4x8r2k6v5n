/* Ukrainischkurs für Joel · Immersion Transfer v1
   Späte A1-Transferphase: bekannte Sprache ohne deutsche Lösungsvorgaben benutzen.
   Die Stütze wird stufenweise entfernt: ukrainische Rollenkarte -> Audio-first ->
   Gedächtnis -> längeres Gespräch. Keine neue Grammatik, nur Transfer. */
(()=>{
  const VERSION=1;
  const start=D.length;
  const norm=x=>String(x||'').normalize('NFC').toLocaleLowerCase('uk').replace(/[ʼ’‘'`]/g,'’').replace(/[.!?,…]/g,'').replace(/\s+/g,' ').trim();
  const SCENARIOS=[
    {
      title:'Immersion 1 · nur ukrainische Informationen',mode:'card',
      intro:'Die Rollenkarte ist nur auf Ukrainisch. Deutsche Notfallhilfe ist noch möglich, zählt aber als Stütze und verhindert die heutige Freigabe.',
      card:['Ти з Німеччини.','Ти живеш у Києві.','Зараз ти в готелі.','У тебе немає води.','Ти хочеш каву.'],
      items:[
        {q:'Звідки ти?',a:['Я з Німеччини'],de:'Ich komme aus Deutschland.'},
        {q:'Де ти живеш?',a:['Я живу в Києві','Я живу у Києві'],de:'Ich wohne in Kyjiw.'},
        {q:'Де ти зараз?',a:['Я в готелі','Я у готелі'],de:'Ich bin jetzt im Hotel.'},
        {q:'Чого у тебе немає?',a:['У мене немає води'],de:'Ich habe kein Wasser.'},
        {q:'Що ти хочеш?',a:['Я хочу каву'],de:'Ich möchte Kaffee.'}
      ]
    },
    {
      title:'Immersion 2 · Frage zuerst hören',mode:'audio',
      intro:'Die Rollenkarte bleibt ukrainisch. Die Frage erscheint nicht automatisch: erst hören und antworten. Das Einblenden der Frage gilt als Stütze.',
      card:['Ти з Німеччини.','Зараз ти в ресторані.','Ти йдеш в магазин.','У тебе немає квитка.','Ти хочеш каву.'],
      items:[
        {q:'Звідки ти?',a:['Я з Німеччини']},
        {q:'Де ти зараз?',a:['Я в ресторані','Я у ресторані']},
        {q:'Куди ти йдеш?',a:['Я йду в магазин']},
        {q:'Чого у тебе немає?',a:['У мене немає квитка']},
        {q:'Що ти хочеш?',a:['Я хочу каву']}
      ]
    },
    {
      title:'Immersion 3 · gestern, heute, morgen',mode:'card',
      intro:'Zeitformen jetzt ohne deutsche Übersetzungsvorgabe aus einer ukrainischen Rollenkarte abrufen.',
      card:['Учора ти був у готелі.','Учора ти працював.','Зараз ти в ресторані.','Завтра ти будеш працювати.','Ти будеш жити в Києві.'],
      items:[
        {q:'Де ти був учора?',a:['Я був у готелі','Я був в готелі','Учора я був у готелі','Вчора я був у готелі']},
        {q:'Що ти робив учора?',a:['Я працював','Учора я працював','Вчора я працював']},
        {q:'Де ти зараз?',a:['Я в ресторані','Я у ресторані']},
        {q:'Що ти будеш робити завтра?',a:['Я буду працювати','Завтра я буду працювати','Я буду працювати завтра']},
        {q:'Де ти будеш жити?',a:['Я буду жити в Києві','Я буду жити у Києві']}
      ]
    },
    {
      title:'Immersion 4 · Rollenkarte aus dem Gedächtnis',mode:'memory',
      intro:'Lies die ukrainische Rollenkarte einmal. Nach dem Start verschwindet sie vollständig. Danach 6/6 ohne deutsche Hilfe.',
      card:['Ти з Німеччини.','Ти живеш у Києві.','Зараз ти в готелі.','У тебе немає води.','Учора ти працював.','Завтра ти будеш працювати.'],
      items:[
        {q:'Звідки ти?',a:['Я з Німеччини']},
        {q:'Де ти живеш?',a:['Я живу в Києві','Я живу у Києві']},
        {q:'Де ти зараз?',a:['Я в готелі','Я у готелі']},
        {q:'Чого у тебе немає?',a:['У мене немає води']},
        {q:'Що ти робив учора?',a:['Я працював','Учора я працював','Вчора я працював']},
        {q:'Що ти будеш робити завтра?',a:['Я буду працювати','Завтра я буду працювати','Я буду працювати завтра']}
      ]
    },
    {
      title:'Immersion 5 · 8-Zug-Gespräch',mode:'chain',
      intro:'Ein längeres Gespräch mit sichtbarer ukrainischer Rollenkarte. Keine deutschen Lösungshinweise.',
      card:['Ти з Німеччини.','Зараз ти в готелі.','У тебе немає води.','Ти хочеш каву.','Ти йдеш в магазин.','Учора ти був у готелі.','Учора ти працював.','Завтра ти будеш працювати.'],
      items:[
        {q:'Звідки ти?',a:['Я з Німеччини']},
        {q:'Де ти зараз?',a:['Я в готелі','Я у готелі']},
        {q:'Чого у тебе немає?',a:['У мене немає води']},
        {q:'Що ти хочеш?',a:['Я хочу каву']},
        {q:'Куди ти йдеш?',a:['Я йду в магазин']},
        {q:'Де ти був учора?',a:['Я був у готелі','Я був в готелі','Учора я був у готелі','Вчора я був у готелі']},
        {q:'Що ти робив учора?',a:['Я працював','Учора я працював','Вчора я працював']},
        {q:'Що ти будеш робити завтра?',a:['Я буду працювати','Завтра я буду працювати','Я буду працювати завтра']}
      ]
    },
    {
      title:'Immersion 6 · фінальна місія',mode:'memory-chain',
      intro:'Die Rollenkarte ist nur vor dem Start sichtbar. Danach 8 Gesprächszüge aus dem Gedächtnis – ohne deutsche Antwortvorgabe.',
      card:['Ти з Німеччини.','Ти живеш у Києві.','Зараз ти в ресторані.','У тебе немає квитка.','Ти хочеш каву.','Ти йдеш в магазин.','Учора ти працював.','Завтра ти будеш працювати.'],
      items:[
        {q:'Звідки ти?',a:['Я з Німеччини']},
        {q:'Де ти живеш?',a:['Я живу в Києві','Я живу у Києві']},
        {q:'Де ти зараз?',a:['Я в ресторані','Я у ресторані']},
        {q:'Чого у тебе немає?',a:['У мене немає квитка']},
        {q:'Що ти хочеш?',a:['Я хочу каву']},
        {q:'Куди ти йдеш?',a:['Я йду в магазин']},
        {q:'Що ти робив учора?',a:['Я працював','Учора я працював','Вчора я працював']},
        {q:'Що ти будеш робити завтра?',a:['Я буду працювати','Завтра я буду працювати','Я буду працювати завтра']}
      ]
    }
  ];
  const LESSONS=SCENARIOS.map(x=>[x.title,'Bekannte Sprache zunehmend ohne deutsche Stütze aktiv benutzen.',x.intro,[]]);
  LESSONS.push(['Abschluss-Review','Kein neuer Stoff.','Die Immersionsphase ist beendet. Heute folgt der getrennte handlungsorientierte Can-do-Abschluss.',[]]);
  LESSONS.forEach(x=>D.push(x));
  const reviews=[...new Set([...WEEKLY_REVIEW_DAYS.map(Number).filter(d=>d<start),start-1,D.length-1])].sort((a,b)=>a-b);
  WEEKLY_REVIEW_DAYS.splice(0,WEEKLY_REVIEW_DAYS.length,...reviews);

  function ensure(){
    if(!s.immersionTransfer||typeof s.immersionTransfer!=='object')s.immersionTransfer={version:VERSION,start,days:{}};
    if(Number(s.immersionTransfer.version||0)<VERSION)s.immersionTransfer={version:VERSION,start,days:{}};
    s.immersionTransfer.version=VERSION;s.immersionTransfer.start=start;s.immersionTransfer.days=s.immersionTransfer.days||{};return s.immersionTransfer
  }
  function scenario(){const i=Number(s.day)-start;return i>=0&&i<SCENARIOS.length?SCENARIOS[i]:null}
  function required(){return !!scenario()}
  function state(){const root=ensure(),k=String(s.day);return root.days[k]||(root.days[k]={passed:false,best:0,attempts:0,assistedBest:false,date:''})}
  let session=null;
  function begin(){const sc=scenario();if(!sc)return;session={items:sc.items,idx:0,correct:0,assisted:false,history:[],started:true,revealed:false,listened:false};renderBox()}
  function current(){return session?.items?.[session.idx]}
  function useHelp(kind){if(!session)return;session.assisted=true;if(kind==='question')session.revealed=true;renderBox()}
  function listenQuestion(button){const item=current();if(!item)return;session.listened=true;speak(item.q,button);renderBox()}
  function answer(value){
    const sc=scenario(),item=current();if(!item)return;if(sc?.mode==='audio'&&!session.listened){toast('Спочатку послухай питання.');return}
    const good=item.a.map(norm).includes(norm(value));session.history.push({q:item.q,a:value||'—',good});if(good)session.correct++;
    toast(good?'Підходить.':'Правильний варіант: '+item.a[0]);session.idx++;
    if(session.idx>=session.items.length){finish();return}
    session.revealed=false;session.listened=false;renderBox()
  }
  function finish(){const st=state(),total=session.items.length,score=Math.round(session.correct/total*100),perfect=session.correct===total&&!session.assisted;st.best=Math.max(st.best||0,score);st.attempts++;st.date=date();st.assistedBest=st.assistedBest||(!session.assisted&&session.correct===total);st.passed=perfect;save();session=null;toast(perfect?'Immersions-Tag bestanden.':'Noch nicht frei genug: alle Antworten in einem frischen Durchgang und ohne deutsche/Transkript-Hilfe.');render()}
  function cardHtml(sc,hide){if(hide)return '<div class="im-card-hidden">Роль прихована · antworte aus dem Gedächtnis.</div>';return '<div class="im-role"><div class="label">Твоя роль</div>'+sc.card.map(x=>'<div lang="uk">'+x+'</div>').join('')+'</div>'}
  function historyHtml(){if(!session?.history?.length)return '';return '<div class="im-history">'+session.history.map(x=>'<div><b>Партнер:</b> <span lang="uk">'+x.q+'</span><br><b>Ти:</b> <span lang="uk">'+x.a+'</span> '+(x.good?'✓':'✗')+'</div>').join('')+'</div>'}
  function questionHtml(sc,item){
    if(sc.mode==='audio')return '<div class="im-audio-question">'+(session.revealed?'<div lang="uk" class="im-question">'+item.q+'</div>':'<div class="small">Питання приховане · Frage nur hören</div>')+'<div class="actions"><button class="primary" id="imListen">'+(session.listened?'✓ ще раз слухати':'🔊 Слухати')+'</button>'+(session.revealed?'':'<button class="secondary" id="imReveal">Показати питання</button>')+'</div></div>';
    return '<div class="im-question" lang="uk">'+item.q+'</div><div class="actions"><button class="secondary" id="imListen">🔊 Слухати</button></div>'
  }
  function renderBox(){
    let box=document.getElementById('immersionTransferBox');if(!required()){if(box)box.hidden=true;return}const cards=document.getElementById('cards');if(!cards)return;if(!box){box=document.createElement('section');box.id='immersionTransferBox';box.className='card';cards.insertAdjacentElement('afterend',box)}box.hidden=false;const sc=scenario(),st=state();
    if(session){const item=current(),hideCard=sc.mode==='memory'||sc.mode==='memory-chain';box.innerHTML='<div class="im-head"><div><div class="label">Український режим · '+(session.idx+1)+' / '+session.items.length+'</div><h2>'+sc.title+'</h2></div><div class="pill">'+session.correct+'/'+session.idx+'</div></div>'+cardHtml(sc,hideCard)+historyHtml()+questionHtml(sc,item)+(sc.mode==='card'&&item.de?'<div class="actions"><button class="secondary" id="imHelp">Notfallhilfe Deutsch</button></div>':'')+'<input id="imInput" class="typing-input" lang="uk" autocapitalize="off" autocorrect="off" autocomplete="off" spellcheck="false" placeholder="Відповідь українською …"><div class="actions"><button class="primary" id="imCheck">Відповісти</button></div>'+(session.assisted?'<div class="tip">Stütze benutzt: Dieser Durchgang dient dem Lernen, zählt aber nicht als freie Freigabe.</div>':'');const inp=document.getElementById('imInput');document.getElementById('imCheck').onclick=()=>answer(inp.value);inp.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();answer(inp.value)}};const listen=document.getElementById('imListen');if(listen)listen.onclick=()=>listenQuestion(listen);const reveal=document.getElementById('imReveal');if(reveal)reveal.onclick=()=>useHelp('question');const help=document.getElementById('imHelp');if(help)help.onclick=()=>{useHelp('de');toast(item.de)};setTimeout(()=>inp.focus(),0)
    }else box.innerHTML='<div class="im-head"><div><div class="label">Später A1-Transfer · Deutsch wird ausgeblendet</div><h2>'+sc.title+'</h2></div><div class="pill">'+(st.passed?'✓':sc.items.length+'/'+sc.items.length)+'</div></div><p class="small">'+sc.intro+'</p>'+cardHtml(sc,false)+'<div class="tip">'+(st.passed?'✓ Ohne Lösungshilfe bestanden.':'Freigabe nur bei '+sc.items.length+'/'+sc.items.length+' in einem frischen Durchgang ohne deutsche Hilfe bzw. Frage-Reveal.')+'</div><div class="actions"><button class="'+(st.passed?'secondary':'primary')+'" id="imStart">'+(st.passed?'noch einmal':'Український режим starten')+'</button></div>';const startBtn=document.getElementById('imStart');if(startBtn)startBtn.onclick=begin
  }
  const oldNext=document.getElementById('next')?.onclick;if(document.getElementById('next'))document.getElementById('next').onclick=function(e){if(required()&&!state().passed){renderBox();document.getElementById('immersionTransferBox')?.scrollIntoView({behavior:'smooth',block:'center'});toast('Vor dem nächsten Tag erst den heutigen Immersions-Transfer ohne Lösungshilfe bestehen.');return}return oldNext?.call(this,e)};
  const css=document.createElement('style');css.textContent='.im-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start}.im-role{background:#f4f8fc;border-radius:14px;padding:12px 14px;margin:12px 0;line-height:1.55}.im-role [lang="uk"]{font-weight:750}.im-card-hidden{text-align:center;padding:12px;border:1px dashed #a7b8ca;border-radius:14px;margin:12px 0}.im-question{font-size:1.55rem;font-weight:850;margin:15px 0}.im-history{display:grid;gap:7px;margin:12px 0}.im-history>div{background:#f4f8fc;border-radius:12px;padding:9px 11px}.im-audio-question{text-align:center;margin:12px 0}';document.head.append(css);
  window.UKRAINIAN_IMMERSION_TRANSFER={version:VERSION,start,activeDays:SCENARIOS.length,totalDays:LESSONS.length,maxTurns:Math.max(...SCENARIOS.map(x=>x.items.length)),audioFirst:true,memory:true,germanSolutionHintsAfterDay1:false};
  const previousRender=render;render=function(){previousRender();renderBox()};ensure();renderBox();
})();