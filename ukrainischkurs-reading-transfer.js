/* Ukrainischkurs für Joel · Reading Transfer v2
   Prüft Dekodier-Transfer mit einem größeren Aufgabenpool. Pro Versuch werden 20 Aufgaben neu gezogen.
   Kontrollierte Übungsketten sind ausdrücklich keine Vokabeln. */
(() => {
  const VERSION=2;
  const BANK=[
    {kind:'blend',prompt:'ма',q:'Welche Lautfolge liest du?',a:'ma',o:['ma','na','pa','wa']},
    {kind:'blend',prompt:'ні',q:'Welche Lautfolge liest du?',a:'ni',o:['ni','ny','ji','mi']},
    {kind:'blend',prompt:'ша',q:'Welche Lautfolge liest du?',a:'scha',o:['scha','tscha','schtscha','stimmhaftes scha']},
    {kind:'blend',prompt:'чу',q:'Welche Lautfolge liest du?',a:'tschu',o:['tschu','zu','schu','tsu']},
    {kind:'blend',prompt:'ґо',q:'Welche Lautfolge liest du?',a:'go',o:['go','ho','ko','cho']},
    {kind:'blend',prompt:'ха',q:'Welche Lautfolge liest du?',a:'cha',o:['cha','ha','ka','scha']},
    {kind:'blend',prompt:'рі',q:'Welche Lautfolge liest du?',a:'ri',o:['ri','pi','ni','ry']},
    {kind:'blend',prompt:'ца',q:'Welche Lautfolge liest du?',a:'za (ts)',o:['za (ts)','tscha','sa','scha']},
    {kind:'blend',prompt:'ща',q:'Welche Lautfolge liest du?',a:'schtscha',o:['schtscha','scha','tscha','scha-stimmhaft']},
    {kind:'blend',prompt:'ї',q:'Wie beginnt dieser Laut?',a:'ji',o:['ji','i','j','y']},
    {kind:'chain',prompt:'ма · ра',q:'Übungskette, keine Vokabel: zusammenschleifen.',a:'мара',o:['мара','рама','мора','мараа']},
    {kind:'chain',prompt:'ко · са',q:'Übungskette: Welche Zeichenfolge entsteht?',a:'коса',o:['коса','сока','коза','косаa']},
    {kind:'chain',prompt:'ту · ма',q:'Übungskette: Teile in derselben Reihenfolge verbinden.',a:'тума',o:['тума','мута','тома','тумаа']},
    {kind:'chain',prompt:'фе · ра',q:'Übungskette: Welche Zeichenfolge entsteht?',a:'фера',o:['фера','рефа','фара','фераа']},
    {kind:'chain',prompt:'до · су',q:'Übungskette: zusammenschleifen.',a:'досу',o:['досу','судо','досо','досуy']},
    {kind:'chain',prompt:'за · мо',q:'Übungskette: Welche Zeichenfolge entsteht?',a:'замо',o:['замо','моза','зома','жамо']},
    {kind:'chain',prompt:'лу · не',q:'Übungskette: zusammenschleifen.',a:'луне',o:['луне','нелу','лоне','луни']},
    {kind:'chain',prompt:'па · ро',q:'Übungskette: Welche Zeichenfolge entsteht?',a:'паро',o:['паро','ропа','поро','баро']},
    {kind:'word',prompt:'мак',q:'Unbekanntes Wort: Welche Näherung passt?',a:'mak',o:['mak','nak','mat','jak']},
    {kind:'word',prompt:'дим',q:'Welche Lautfolge passt?',a:'dym (kurzes I)',o:['dym (kurzes I)','dim (klares I)','din','tym']},
    {kind:'word',prompt:'жук',q:'Welche Näherung passt?',a:'stimmhaftes sch + uk',o:['stimmhaftes sch + uk','sch + uk','z + uk','tsch + uk']},
    {kind:'word',prompt:'рік',q:'Welche Lautfolge passt?',a:'rik',o:['rik','pik','nik','ryk']},
    {kind:'word',prompt:'хата',q:'Welche Lautfolge passt?',a:'chata',o:['chata','hata','kata','tsata']},
    {kind:'word',prompt:'щука',q:'Welche Lautfolge passt?',a:'schtschuka',o:['schtschuka','schuka','tschuka','schtsuka']},
    {kind:'word',prompt:'сир',q:'Welche Näherung passt?',a:'syr (kurzes I)',o:['syr (kurzes I)','sir (klares I)','zyr','schyr']},
    {kind:'word',prompt:'кіт',q:'Welche Lautfolge passt?',a:'kit',o:['kit','kyt','pit','jit']},
    {kind:'word',prompt:'чай',q:'Welche Lautfolge passt?',a:'tschaj',o:['tschaj','zaj','schaj','tsaj']},
    {kind:'word',prompt:'гора',q:'Achte auf Г. Welche Näherung passt?',a:'hora mit stimmhaftem H',o:['hora mit stimmhaftem H','gora mit G','chora','kora']},
    {kind:'word',prompt:'ґанок',q:'Achte auf Ґ. Welche Näherung passt?',a:'ganok',o:['ganok','hanok','kanok','chanok']},
    {kind:'word',prompt:'нова',q:'Welche Lautfolge passt?',a:'nowa',o:['nowa','noba','nowja','mowa']},
    {kind:'word',prompt:'рука',q:'Welche Lautfolge passt?',a:'ruka',o:['ruka','puka','ruka mit Hals-R als Ziel','luka']},
    {kind:'word',prompt:'море',q:'Welche Lautfolge passt?',a:'more',o:['more','mone','moye','mure']},
    {kind:'word',prompt:'тато',q:'Welche Lautfolge passt?',a:'tato',o:['tato','dato','tuto','nato']},
    {kind:'word',prompt:'сумка',q:'Welche Näherung passt?',a:'sumka',o:['sumka','sunka','schumka','zumka']},
    {kind:'word',prompt:'лампа',q:'Welche Näherung passt?',a:'lampa',o:['lampa','rampa','lamfa','jampa']},
    {kind:'word',prompt:'метро',q:'Welche Näherung passt?',a:'metro',o:['metro','metpo','netro','medro']}
  ];
  let session=null;
  const shuffle=a=>[...a].sort(()=>Math.random()-.5);
  function ensure(){if(!s.readingTransfer||typeof s.readingTransfer!=='object')s.readingTransfer={version:VERSION,passed:false,best:0,attempts:0,date:''};s.readingTransfer.version=VERSION;return s.readingTransfer}
  function ready(){return !!ensure().passed}
  function start(){session={items:shuffle(BANK).slice(0,20),idx:0,correct:0,total:20,misses:[],phase:'test'};renderTransfer()}
  function current(){return session?.items?.[session.idx]}
  function answer(value){const q=current(),good=value===q.a;if(session.phase==='test'){if(good)session.correct++;else session.misses.push(q)}if(session.phase==='repair'&&!good){toast('Noch nicht. Zerlege erst Zeichen für Zeichen.');return}toast(good?'Richtig gelesen.':'Richtig wäre: '+q.a+'. Zerlege und verbinde noch einmal.');session.idx++;if(session.idx>=session.items.length){if(session.phase==='test'&&session.misses.length){session.items=[...session.misses];session.misses=[];session.idx=0;session.phase='repair';renderTransfer();return}finish();return}renderTransfer()}
  function finish(){const st=ensure(),score=Math.round(session.correct/session.total*100),passed=session.correct>=18;st.best=Math.max(st.best||0,score);st.attempts=(st.attempts||0)+1;st.date=date();st.passed=passed;save();session=null;toast(passed?'Lese-Transfer bestanden.':score+' %. Für die Freigabe brauchst du mindestens 18/20 in einem neuen, neu gemischten Durchgang.');render()}
  function sessionHtml(){const q=current(),repair=session.phase==='repair';return '<div class="rt-test"><div class="label">'+(repair?'Reparaturrunde':'Transfer · zufällig aus '+BANK.length+' Aufgaben')+'</div><div class="small">'+(session.idx+1)+' von '+session.items.length+'</div><div class="rt-prompt">'+q.prompt+'</div><div class="rt-q">'+q.q+'</div><div class="rt-grid">'+shuffle(q.o).map(x=>'<button class="answer" data-rt="'+x.replace(/"/g,'&quot;')+'">'+x+'</button>').join('')+'</div></div>'}
  function renderTransfer(){let panel=document.getElementById('readingTransfer'),bridge=s.readingBridge?.completed||s.readingBridge?.legacyGrandfathered;if(Number(s.day)<14||!bridge){if(panel)panel.hidden=true;return}const cards=document.getElementById('cards');if(!cards)return;if(!panel){panel=document.createElement('section');panel.id='readingTransfer';panel.className='card';cards.parentNode.insertBefore(panel,cards)}panel.hidden=false;const st=ensure();panel.innerHTML='<div class="rt-head"><div><div class="label">Lese-Transfer · Pflicht</div><h2>Kannst du wirklich lesen – oder nur bekannte Karten?</h2></div><div class="pill">'+(st.passed?'✓':'20')+'</div></div><p class="small">Jeder Versuch zieht 20 Aufgaben aus einem größeren Pool. Einige kontrollierte Zeichenketten sind absichtlich keine Vokabeln: So kann Bedeutung nicht beim Raten helfen.</p>'+(session?sessionHtml():'<div class="rt-status"><strong>'+(st.passed?'✓ Transfer nachgewiesen':'Noch offen')+'</strong><span class="small">Bestwert '+(st.best||0)+' % · Ziel mindestens 18/20 beim ersten Versuch</span></div><div class="actions"><button class="'+(st.passed?'secondary':'primary')+'" id="rtStart">'+(st.passed?'neuen Transfermix starten':'20 Transferfragen starten')+'</button></div>')+'<div class="tip">'+(st.passed?'Buchstabenwissen wurde auf neues Material übertragen.':'Nicht auf Tempo raten: Zeichen lesen → Silbe bilden → zusammenschleifen.')+'</div>';panel.querySelectorAll('[data-rt]').forEach(b=>b.onclick=()=>answer(b.dataset.rt));const btn=document.getElementById('rtStart');if(btn)btn.onclick=start}
  const baseNext=document.getElementById('next')?.onclick;if(document.getElementById('next'))document.getElementById('next').onclick=function(e){if(Number(s.day)===14&&s.readingBridge?.completed&&!ready()){renderTransfer();document.getElementById('readingTransfer')?.scrollIntoView({behavior:'smooth',block:'start'});toast('Vor der nächsten Wortlektion erst echten Lese-Transfer zeigen.');return}return baseNext?.call(this,e)};
  const css=document.createElement('style');css.textContent='.rt-head{display:flex;justify-content:space-between;gap:12px}.rt-test{text-align:center;padding:14px;border-radius:16px;background:#f4f8fc}.rt-prompt{font-size:2.4rem;font-weight:850;color:var(--d);margin:12px}.rt-q{font-weight:750;margin:8px}.rt-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.rt-status{display:flex;flex-direction:column;gap:4px;padding:12px;border-radius:14px;background:#f4f8fc}@media(max-width:500px){.rt-grid{grid-template-columns:1fr}}';document.head.append(css);
  const previousRender=render;render=function(){previousRender();renderTransfer()};ensure();renderTransfer();
})();
