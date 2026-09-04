/* Ukrainischkurs für Joel · Lese- und Aussprachebrücke v1
   Nach dem Alphabet: Betonung und weiche Konsonanten, bevor normale Wortlektionen einfach weiterlaufen. */
(() => {
  const VERSION=1;
  const STRESS=[
    {plain:'привіт',shown:'приві́т',opts:['при́віт','приві́т'],note:'Betonung auf der zweiten Silbe.'},
    {plain:'дякую',shown:'дя́кую',opts:['дя́кую','дяку́ю'],note:'Betonung auf „дя“; das Д ist weich.'},
    {plain:'будь ласка',shown:'будь ла́ска',opts:['бу́дь ласка','будь ла́ска'],note:'In „ласка“ liegt die Betonung auf „ла“.'},
    {plain:'мене',shown:'мене́',opts:['ме́не','мене́'],note:'Betonung auf der zweiten Silbe.'},
    {plain:'звати',shown:'зва́ти',opts:['зва́ти','звати́'],note:'Betonung auf „зва“.'},
    {plain:'українською',shown:'украї́нською',opts:['укра́їнською','украї́нською'],note:'Betonung auf „ї“.'}
  ];
  const SOFT=[
    {word:'ні',q:'Was passiert mit Н vor І in „ні“?',a:'Н wird weich gesprochen.',o:['Н wird weich gesprochen.','Н bleibt genau so hart wie in „на“.'],why:'І zeigt nach einem Konsonanten typischerweise Weichheit an.'},
    {word:'кінь',q:'Welche Aufgabe hat Ь am Ende von „кінь“?',a:'Es macht den Konsonanten davor weich.',o:['Es macht den Konsonanten davor weich.','Es wird als eigenes „i“ gesprochen.'],why:'Ь ist kein eigener Laut; es markiert Weichheit.'},
    {word:'дякую',q:'Wie beginnt „дякую“?',a:'Mit weichem Д; Я folgt direkt nach dem Konsonanten.',o:['Mit weichem Д; Я folgt direkt nach dem Konsonanten.','Mit hartem Д und einem vollständig getrennten „ja“.'],why:'Nach Konsonanten können Я/Ю/Є Weichheit des vorausgehenden Konsonanten anzeigen.'},
    {word:'люди',q:'Was signalisiert Ю in „люди“ nach Л?',a:'Л wird weich; danach folgt der U-Anteil.',o:['Л wird weich; danach folgt der U-Anteil.','Л bleibt hart und Ю ist immer ein separates „ju“.'],why:'Am Wortanfang und nach Konsonanten verhalten sich Я/Ю/Є nicht identisch.'},
    {word:'м’ясо',q:'Was macht der Apostroph in „м’ясо“?',a:'Er trennt: М wird nicht durch Я weich; danach beginnt ein j-Gleitlaut.',o:['Er trennt: М wird nicht durch Я weich; danach beginnt ein j-Gleitlaut.','Er macht М besonders weich.'],why:'Der Apostroph blockiert die sonst erwartbare Weichheitswirkung.'},
    {word:'їжа',q:'Wie beginnt Ї am Wortanfang in „їжа“?',a:'Mit /ji/.',o:['Mit /ji/.','Nur mit /i/ ohne j-Anteil.'],why:'Ї steht für /ji/ und ist gerade für deutsche Anfänger wichtig von І zu trennen.'}
  ];
  let session=null;
  const STRESS_MAP=Object.fromEntries(STRESS.map(x=>[x.plain,x.shown]));

  function shuffle(list){return [...list].sort(()=>Math.random()-.5)}
  function ensure(){
    if(!s.readingBridge||typeof s.readingBridge!=='object'){
      const legacy=Number(s.day)>14 || Object.keys(s.done||{}).some(k=>Number(k)>14&&s.done[k]);
      s.readingBridge={version:VERSION,legacyGrandfathered:legacy,stress:{passed:legacy,best:legacy?100:0},soft:{passed:legacy,best:legacy?100:0},completed:legacy};
    }
    s.readingBridge.version=VERSION;s.readingBridge.stress=s.readingBridge.stress||{passed:false,best:0};s.readingBridge.soft=s.readingBridge.soft||{passed:false,best:0};
    s.readingBridge.completed=!!(s.readingBridge.legacyGrandfathered||(s.readingBridge.stress.passed&&s.readingBridge.soft.passed));return s.readingBridge;
  }
  function complete(){return !!ensure().completed}
  function start(type){const items=type==='stress'?STRESS:SOFT;session={type,phase:'test',items:shuffle(items),idx:0,correct:0,total:items.length,misses:[],threshold:items.length-1};renderBridge()}
  function current(){return session?.items?.[session.idx]}
  function finish(){
    const st=ensure(),score=Math.round(session.correct/session.total*100),passed=session.correct>=session.threshold;
    const slot=session.type==='stress'?st.stress:st.soft;slot.best=Math.max(Number(slot.best)||0,score);slot.passed=passed;slot.date=date();slot.attempts=(Number(slot.attempts)||0)+1;st.completed=!!(st.stress.passed&&st.soft.passed);save();
    toast(passed?'Mini-Test bestanden.':score+' % im ersten Durchgang. Wiederhole diesen Block noch einmal frisch.');session=null;render();
  }
  function next(){session.idx++;if(session.idx>=session.items.length){if(session.phase==='test'&&session.misses.length){session.phase='repair';session.items=[...session.misses];session.misses=[];session.idx=0;renderBridge()}else finish()}else renderBridge()}
  function answer(value){
    const item=current(),correct=item.a||item.shown,good=value===correct;
    if(session.phase==='test'){if(good)session.correct++;else session.misses.push(item)}
    toast(good?'Richtig.':(item.why||item.note||('Richtig ist: '+correct)));
    if(session.phase==='repair'&&!good){setTimeout(()=>renderBridge(),650);return}
    setTimeout(next,520);
  }
  function playWord(word,button){if(typeof speak==='function')speak(word.replace(/\u0301/g,''),button)}
  function sessionHtml(){
    if(!session)return '';
    const item=current(),repair=session.phase==='repair',pos=session.idx+1,total=session.items.length;
    if(session.type==='stress')return '<div class="rb-test"><div class="label">Betonungs-Test'+(repair?' · Reparatur':'')+'</div><div class="small">'+pos+' von '+total+'</div><div class="rb-word">'+item.plain+'</div><button class="secondary" id="rbListen">🔊 Wort anhören</button><p class="small">Welche Lernschreibweise markiert die Betonung richtig?</p><div class="rb-options">'+shuffle(item.opts).map(x=>'<button class="answer" data-rb-answer="'+x+'">'+x+'</button>').join('')+'</div></div>';
    return '<div class="rb-test"><div class="label">Weichheits-Test'+(repair?' · Reparatur':'')+'</div><div class="small">'+pos+' von '+total+'</div><div class="rb-word">'+item.word+'</div><div class="rb-question">'+item.q+'</div><div class="rb-options">'+shuffle(item.o).map(x=>'<button class="answer" data-rb-answer="'+x.replace(/"/g,'&quot;')+'">'+x+'</button>').join('')+'</div></div>';
  }
  function annotateWords(){
    if(Number(s.day)<14)return;
    document.querySelectorAll('#cards .word .uk').forEach(el=>{
      const plain=(el.textContent||'').trim().toLocaleLowerCase('uk'),marked=STRESS_MAP[plain];if(!marked)return;
      const card=el.closest('.word');if(card?.querySelector('.rb-stress-note'))return;
      const note=document.createElement('div');note.className='rb-stress-note small';note.innerHTML='<b>Betonung:</b> '+marked+' <span>· Akzentzeichen nur als Lernhilfe</span>';el.insertAdjacentElement('afterend',note);
    });
  }
  function renderBridge(){
    const st=ensure();
    let panel=document.getElementById('readingBridge');
    if(Number(s.day)<14||st.completed){if(panel)panel.hidden=true;annotateWords();return}
    const cards=document.getElementById('cards');if(!cards)return;
    if(!panel){panel=document.createElement('section');panel.id='readingBridge';panel.className='card';cards.parentNode.insertBefore(panel,cards)}panel.hidden=false;
    panel.innerHTML='<div class="rb-head"><div><div class="label">Lese-Brücke · Pflicht vor normalem Wortlernen</div><h2>Buchstaben kennen reicht noch nicht: Betonung + weiche Konsonanten</h2></div><div class="pill">'+([st.stress.passed,st.soft.passed].filter(Boolean).length)+'/2</div></div><p class="small">Ukrainische Betonung ist nicht zuverlässig aus der Schreibweise vorhersagbar. Deshalb wird sie bei neuen Wörtern als eigener Teil mitgelernt. Außerdem lernst du jetzt, wann І/Я/Ю/Є/Ь einen Konsonanten weich machen und wann ein Apostroph genau das verhindert.</p>'+
      (session?sessionHtml():'<div class="rb-cards"><div><strong>'+(st.stress.passed?'✓ ':'')+'Betonung</strong><p class="small">Lernakzent sehen → hören → ohne Markierung erinnern.</p><button class="'+(st.stress.passed?'secondary':'primary')+'" data-rb-start="stress">'+(st.stress.passed?'noch einmal':'6 Fragen starten')+'</button></div><div><strong>'+(st.soft.passed?'✓ ':'')+'Weichheit</strong><p class="small">І, Я, Ю, Є, Ь und Apostroph positionsabhängig verstehen.</p><button class="'+(st.soft.passed?'secondary':'primary')+'" data-rb-start="soft">'+(st.soft.passed?'noch einmal':'6 Fragen starten')+'</button></div></div>')+
      '<div class="tip">'+(st.stress.passed&&st.soft.passed?'Brücke bestanden. Die normalen Wortlektionen dürfen weitergehen.':'Beide Mini-Tests gehören zur Freigabe der ersten Wortphase. Fehler werden sofort erklärt und anschließend repariert.')+'</div><div class="small rb-source">Betonungsbeispiele orientieren sich an geprüften Anfängerressourcen von Ukrainian Lessons; Akzentzeichen werden nur im Lernmodus gezeigt.</div>';
    panel.querySelectorAll('[data-rb-start]').forEach(b=>b.onclick=()=>start(b.dataset.rbStart));
    panel.querySelectorAll('[data-rb-answer]').forEach(b=>b.onclick=()=>answer(b.dataset.rbAnswer));
    const listen=document.getElementById('rbListen');if(listen&&session?.type==='stress')listen.onclick=()=>playWord(current().plain,listen);
    annotateWords();
  }

  const css=document.createElement('style');css.textContent='.rb-head{display:flex;gap:12px;justify-content:space-between;align-items:flex-start}.rb-cards{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px;margin:14px 0}.rb-cards>div{padding:13px;border-radius:14px;background:#f4f8fc}.rb-cards p{margin:4px 0 10px}.rb-test{text-align:center;margin-top:14px;padding:14px;border-radius:16px;background:#f4f8fc}.rb-word{font-size:2.1rem;font-weight:850;color:var(--d);margin:10px 0}.rb-question{font-weight:800;color:var(--d);margin:10px auto;max-width:560px}.rb-options{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:12px}.rb-options .answer{text-align:center}.rb-stress-note{margin-top:5px;color:#406184}.rb-source{margin-top:10px}@media(max-width:520px){.rb-cards,.rb-options{grid-template-columns:1fr}}';document.head.append(css);

  const baseNext=document.getElementById('next')?.onclick;
  if(document.getElementById('next'))document.getElementById('next').onclick=function(e){
    if(Number(s.day)===14&&alphabetReady()&&!complete()){renderBridge();document.getElementById('readingBridge')?.scrollIntoView({behavior:'smooth',block:'start'});toast('Vor der nächsten Wortlektion erst Betonung und Weichheit abschließen.');return}
    return baseNext?.call(this,e);
  };
  const previousRender=render;
  render=function(){previousRender();renderBridge()};
  ensure();renderBridge();
})();
