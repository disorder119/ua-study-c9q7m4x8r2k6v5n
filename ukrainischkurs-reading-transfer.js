/* Ukrainischkurs für Joel · Reading Transfer v1
   Prüft, ob Buchstabenwissen auf bisher ungesehene Silben/Wörter übertragen wird.
   Keine Vokabelkenntnis erforderlich: Ziel ist Dekodieren, nicht Übersetzen. */
(() => {
  const VERSION=1;
  const TASKS=[
    {kind:'blend',prompt:'ма',q:'Welche Lautfolge liest du?',a:'ma',o:['ma','na','pa','wa']},
    {kind:'blend',prompt:'ні',q:'Welche Lautfolge liest du?',a:'ni',o:['ni','ny','ji','mi']},
    {kind:'blend',prompt:'ша',q:'Welche Lautfolge liest du?',a:'scha',o:['scha','tscha','scha-tsch','scha-stimmhaft']},
    {kind:'blend',prompt:'чу',q:'Welche Lautfolge liest du?',a:'tschu',o:['tschu','zu','schu','tsu']},
    {kind:'blend',prompt:'ґо',q:'Welche Lautfolge liest du?',a:'go',o:['go','ho','ko','cho']},
    {kind:'blend',prompt:'хи',q:'Welche Lautfolge liest du?',a:'chy',o:['chy','hi','ki','schi']},
    {kind:'word',prompt:'мак',q:'Lies von links nach rechts. Welche Näherung passt?',a:'mak',o:['mak','nak','mat','jak']},
    {kind:'word',prompt:'дим',q:'Welche Lautfolge passt?',a:'dym',o:['dym','dim','din','tym']},
    {kind:'word',prompt:'жук',q:'Welche Lautfolge passt?',a:'schuk-stimmhaft',o:['schuk-stimmhaft','schuk','zuk','tschuk']},
    {kind:'word',prompt:'рік',q:'Welche Lautfolge passt?',a:'rik',o:['rik','pik','nik','ryk']},
    {kind:'word',prompt:'хата',q:'Welche Lautfolge passt?',a:'chata',o:['chata','hata','kata','tsata']},
    {kind:'word',prompt:'щука',q:'Welche Lautfolge passt?',a:'schtschuka',o:['schtschuka','schuka','tschuka','schtsuka']},
    {kind:'chunk',prompt:'ма · ли · на',q:'Zieh die Teile im Kopf zusammen.',a:'малина',o:['малина','манила','малина́','млина']},
    {kind:'chunk',prompt:'ка · ва',q:'Welches Wort entsteht?',a:'кава',o:['кава','вака','кафа','гава']},
    {kind:'chunk',prompt:'во · да',q:'Welches Wort entsteht?',a:'вода',o:['вода','бода','вота','фода']},
    {kind:'chunk',prompt:'кни · га',q:'Welches Wort entsteht?',a:'книга',o:['книга','кинига','кніга','книга́']},
    {kind:'novel',prompt:'сумка',q:'Ohne Übersetzung: Welche Näherung passt?',a:'sumka',o:['sumka','sunka','schumka','zumka']},
    {kind:'novel',prompt:'лампа',q:'Ohne Übersetzung: Welche Näherung passt?',a:'lampa',o:['lampa','rampa','lamfa','jampa']},
    {kind:'novel',prompt:'метро',q:'Ohne Übersetzung: Welche Näherung passt?',a:'metro',o:['metro','metpo','netro','medro']},
    {kind:'novel',prompt:'банан',q:'Ohne Übersetzung: Welche Näherung passt?',a:'banan',o:['banan','wanan','panan','banam']}
  ];
  let session=null;
  const shuffle=a=>[...a].sort(()=>Math.random()-.5);
  function ensure(){
    if(!s.readingTransfer||typeof s.readingTransfer!=='object')s.readingTransfer={version:VERSION,passed:false,best:0,attempts:0,date:'',repair:[]};
    s.readingTransfer.version=VERSION;return s.readingTransfer;
  }
  function ready(){return !!ensure().passed}
  function start(){session={items:shuffle(TASKS),idx:0,correct:0,total:TASKS.length,misses:[],phase:'test'};renderTransfer()}
  function current(){return session?.items?.[session.idx]}
  function answer(value){
    const q=current(),good=value===q.a;
    if(session.phase==='test'){if(good)session.correct++;else session.misses.push(q)}
    if(session.phase==='repair'&&!good){toast('Noch nicht. Zerlege erst Zeichen für Zeichen.');return}
    toast(good?'Richtig gelesen.':'Richtig wäre: '+q.a+'. Zerlege das Wort und setze es neu zusammen.');
    session.idx++;
    if(session.idx>=session.items.length){
      if(session.phase==='test'&&session.misses.length){session.items=[...session.misses];session.misses=[];session.idx=0;session.phase='repair';renderTransfer();return}
      finish();return;
    }
    renderTransfer();
  }
  function finish(){
    const st=ensure(),score=Math.round(session.correct/session.total*100),passed=session.correct>=18;
    st.best=Math.max(st.best||0,score);st.attempts=(st.attempts||0)+1;st.date=date();st.passed=passed;save();session=null;
    toast(passed?'Lese-Transfer bestanden.':' '+score+' %. Fehler repariert; für Freigabe brauchst du mindestens 18/20 in einem frischen Durchgang.');render();
  }
  function sessionHtml(){const q=current(),repair=session.phase==='repair';return '<div class="rt-test"><div class="label">'+(repair?'Reparaturrunde':'Unbekanntes Material · erster Versuch zählt')+'</div><div class="small">'+(session.idx+1)+' von '+session.items.length+'</div><div class="rt-prompt">'+q.prompt+'</div><div class="rt-q">'+q.q+'</div><div class="rt-grid">'+shuffle(q.o).map(x=>'<button class="answer" data-rt="'+x.replace(/"/g,'&quot;')+'">'+x+'</button>').join('')+'</div></div>'}
  function renderTransfer(){
    let panel=document.getElementById('readingTransfer');
    const bridge=s.readingBridge?.completed||s.readingBridge?.legacyGrandfathered;
    if(Number(s.day)<14||!bridge){if(panel)panel.hidden=true;return}
    const cards=document.getElementById('cards');if(!cards)return;
    if(!panel){panel=document.createElement('section');panel.id='readingTransfer';panel.className='card';cards.parentNode.insertBefore(panel,cards)}panel.hidden=false;
    const st=ensure();
    panel.innerHTML='<div class="rt-head"><div><div class="label">Lese-Transfer · Pflicht</div><h2>Kannst du wirklich lesen – oder nur Buchstaben wiedererkennen?</h2></div><div class="pill">'+(st.passed?'✓':'20')+'</div></div><p class="small">Hier erscheinen Silben und Wörter, die nicht als Vokabeln gelernt wurden. Du musst nichts übersetzen. Ziel: Zeichen verbinden, Lautfolge erkennen und falsche Freunde vermeiden.</p>'+(session?sessionHtml():'<div class="rt-status"><strong>'+(st.passed?'✓ Transfer nachgewiesen':'Noch offen')+'</strong><span class="small">Bestwert '+(st.best||0)+' % · Ziel mindestens 18/20 beim ersten Versuch</span></div><div class="actions"><button class="'+(st.passed?'secondary':'primary')+'" id="rtStart">'+(st.passed?'noch einmal':'20 Transferfragen starten')+'</button></div>')+'<div class="tip">'+(st.passed?'Du hast Buchstabenwissen auf neues Material übertragen.':'Nicht auf Tempo raten. Erst Zeichen einzeln lesen, dann zusammenschleifen.')+'</div>';
    panel.querySelectorAll('[data-rt]').forEach(b=>b.onclick=()=>answer(b.dataset.rt));const btn=document.getElementById('rtStart');if(btn)btn.onclick=start;
  }
  const baseNext=document.getElementById('next')?.onclick;
  if(document.getElementById('next'))document.getElementById('next').onclick=function(e){
    if(Number(s.day)===14&&s.readingBridge?.completed&&!ready()){renderTransfer();document.getElementById('readingTransfer')?.scrollIntoView({behavior:'smooth',block:'start'});toast('Vor der nächsten Wortlektion erst den echten Lese-Transfer bestehen.');return}
    return baseNext?.call(this,e);
  };
  const css=document.createElement('style');css.textContent='.rt-head{display:flex;justify-content:space-between;gap:12px}.rt-test{text-align:center;padding:14px;border-radius:16px;background:#f4f8fc}.rt-prompt{font-size:2.4rem;font-weight:850;color:var(--d);margin:12px}.rt-q{font-weight:750;margin:8px}.rt-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.rt-status{display:flex;flex-direction:column;gap:4px;padding:12px;border-radius:14px;background:#f4f8fc}@media(max-width:500px){.rt-grid{grid-template-columns:1fr}}';document.head.append(css);
  const previousRender=render;render=function(){previousRender();renderTransfer()};ensure();renderTransfer();
})();
