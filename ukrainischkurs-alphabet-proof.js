/* Ukrainischkurs für Joel · Alphabet Proof v1
   Zusätzlicher Freigabenachweis: isolierte Kleinbuchstaben, Laut→Zeichen und 3-Tage-Retention schwieriger Zeichen. */
(() => {
  const ORDER='А Б В Г Ґ Д Е Є Ж З И І Ї Й К Л М Н О П Р С Т У Ф Х Ц Ч Ш Щ Ь Ю Я'.split(' ');
  const HARD=['В','Г','Ґ','И','І','Ї','Р','Х','Ж','Ш','Щ','Ц','Ч'];
  let session=null;
  function shuffle(a){return [...a].sort(()=>Math.random()-.5)}
  function ensure(){if(!s.alphabetProof||typeof s.alphabetProof!=='object')s.alphabetProof={version:1,caseReverse:{passed:false,best:0,date:'',attempts:0}};s.alphabetProof.caseReverse=s.alphabetProof.caseReverse||{passed:false,best:0,date:'',attempts:0};return s.alphabetProof}
  function item(letter){return alphabetItems().find(x=>x.c?.[0]?.[0]===letter)}
  function sound(letter){return item(letter)?.c?.[1]||LETTERS.find(x=>x[0]===letter)?.[1]||letter}
  function successDays(letter){const x=item(letter);return [...new Set((x&&s.known?.[x.k]?.successDates||[]).filter(Boolean))].length}
  function hardRetentionCount(){return HARD.filter(l=>successDays(l)>=3).length}
  function hardRetentionReady(){return hardRetentionCount()===HARD.length}
  function caseReady(){return !!ensure().caseReverse.passed}
  const baseReady=alphabetReady;
  alphabetReady=function(){return !!baseReady()&&caseReady()&&hardRetentionReady()}
  const baseRequire=requireAlphabet;
  requireAlphabet=function(){
    if(alphabetReady())return true;
    if(baseReady()&&(!caseReady()||!hardRetentionReady())){
      if(Number(s.day)!==13){s.day=13;save();render()}
      show('learn');setTimeout(()=>document.getElementById('alphabetProof')?.scrollIntoView({behavior:'smooth',block:'start'}),50);
      toast(!caseReady()?'Noch der Kleinbuchstaben-/Rückwärtscheck.':'Schwierige Zeichen brauchen erfolgreiche Abrufe an drei verschiedenen Lerntagen.');return false;
    }
    return baseRequire();
  }
  function options(letter){return shuffle([letter,...ORDER.filter(x=>x!==letter)]).slice(0,4).includes(letter)?shuffle([letter,...shuffle(ORDER.filter(x=>x!==letter)).slice(0,3)]):[letter]}
  function build(){
    const letters=shuffle(ORDER).slice(0,20);
    return letters.map((letter,i)=>({letter,dir:i%2?'soundToLetter':'lowerToSound'}));
  }
  function start(){session={items:build(),idx:0,correct:0,total:20,misses:[],phase:'test'};renderProof()}
  function current(){return session?.items?.[session.idx]}
  function answer(value){
    const q=current(),expected=q.dir==='soundToLetter'?q.letter:sound(q.letter),good=value===expected;
    if(session.phase==='test'){if(good)session.correct++;else session.misses.push(q)}
    if(session.phase==='repair'&&!good){toast('Noch nicht. Richtig ist '+expected+'.');return}
    toast(good?'Richtig.':'Richtig ist '+expected+'.');session.idx++;
    if(session.idx>=session.items.length){
      if(session.phase==='test'&&session.misses.length){session.items=[...session.misses];session.misses=[];session.idx=0;session.phase='repair';renderProof();return}
      finish();return;
    }
    renderProof();
  }
  function finish(){const st=ensure().caseReverse,score=Math.round(session.correct/session.total*100),passed=session.correct>=19;st.best=Math.max(Number(st.best)||0,score);st.passed=passed;st.date=date();st.attempts=(Number(st.attempts)||0)+1;save();session=null;toast(passed?'Kleinbuchstaben und Rückwärtsabruf bestanden.':score+' %. Fehler repariert; für die Freigabe brauchst du mindestens 19/20 in einem frischen Durchgang.');render()}
  function questionHtml(){
    const q=current(),repair=session.phase==='repair',pos=session.idx+1;
    if(q.dir==='lowerToSound'){
      const vals=shuffle([sound(q.letter),...shuffle(ORDER.filter(l=>l!==q.letter).map(sound).filter((x,i,a)=>a.indexOf(x)===i&&x!==sound(q.letter))).slice(0,3)]);
      return '<div class="ap-test"><div class="label">Kleinbuchstabe → Laut'+(repair?' · Reparatur':'')+'</div><div class="small">'+pos+' von '+session.items.length+'</div><div class="ap-letter">'+q.letter.toLocaleLowerCase('uk')+'</div><div class="ap-grid">'+vals.map(x=>'<button class="answer" data-ap="'+x.replace(/"/g,'&quot;')+'">'+x+'</button>').join('')+'</div></div>';
    }
    const vals=shuffle([q.letter,...shuffle(ORDER.filter(l=>l!==q.letter)).slice(0,3)]);
    return '<div class="ap-test"><div class="label">Laut → Zeichen'+(repair?' · Reparatur':'')+'</div><div class="small">'+pos+' von '+session.items.length+'</div><div class="ap-sound">Welches Zeichen klingt wie <strong>'+sound(q.letter)+'</strong>?</div><div class="ap-grid">'+vals.map(l=>'<button class="answer" data-ap="'+l+'">'+(Math.random()<.5?l:l.toLocaleLowerCase('uk'))+'</button>').join('')+'</div></div>';
  }
  function renderProof(){
    let panel=document.getElementById('alphabetProof');
    if(Number(s.day)!==13){if(panel)panel.hidden=true;return}
    const anchor=document.getElementById('alphabetMasteryLab')||document.getElementById('cards');if(!anchor)return;
    if(!panel){panel=document.createElement('section');panel.id='alphabetProof';panel.className='card';anchor.insertAdjacentElement('afterend',panel)}panel.hidden=false;
    const st=ensure().caseReverse,hard=hardRetentionCount();
    panel.innerHTML='<div class="ap-head"><div><div class="label">Zusatznachweis · echte Lesesicherheit</div><h2>Kleinbuchstaben + Rückwärtsabruf</h2></div><div class="pill">'+([st.passed,hardRetentionReady()].filter(Boolean).length)+'/2</div></div><p class="small">Damit Großbuchstaben oder gemeinsame А/а-Karten deine Sicherheit nicht überschätzen, prüft dieser Block Zeichen isoliert. Schwierige Laute müssen außerdem an drei verschiedenen Lerntagen erfolgreich abgerufen worden sein.</p>'+(session?questionHtml():'<div class="ap-status"><div class="am-chip '+(st.passed?'ok':'')+'"><b>'+(st.passed?'✓ ':'')+'20er Mischtest</b><span>'+st.best+' % · Ziel ≥95 %</span></div><div class="am-chip '+(hardRetentionReady()?'ok':'')+'"><b>'+(hardRetentionReady()?'✓ ':'')+'Schwierige Zeichen</b><span>'+hard+' / '+HARD.length+' an 3 Tagen</span></div></div><div class="actions"><button class="'+(st.passed?'secondary':'primary')+'" id="apStart">'+(st.passed?'noch einmal':'20 Fragen starten')+'</button></div>')+'<div class="tip">'+(caseReady()&&hardRetentionReady()?'Zusatznachweis erfüllt.':'Noch offen: '+(!caseReady()?'Kleinbuchstaben-/Rückwärtscheck. ':'')+(!hardRetentionReady()?(HARD.length-hard)+' schwierige Zeichen brauchen noch einen weiteren erfolgreichen Lerntag.':'')+'</div>';
    panel.querySelectorAll('[data-ap]').forEach(b=>b.onclick=()=>answer(b.dataset.ap));const startBtn=document.getElementById('apStart');if(startBtn)startBtn.onclick=start;
  }
  const css=document.createElement('style');css.textContent='.ap-head{display:flex;gap:12px;justify-content:space-between;align-items:flex-start}.ap-status{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:12px}.ap-test{text-align:center;padding:14px;border-radius:16px;background:#f4f8fc}.ap-letter{font-size:3.4rem;font-weight:850;color:var(--d);margin:12px}.ap-sound{font-size:1.1rem;margin:16px}.ap-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.ap-grid .answer{text-align:center}@media(max-width:480px){.ap-status{grid-template-columns:1fr}}';document.head.append(css);
  const previousRender=render;render=function(){previousRender();renderProof()};ensure();renderProof();
})();
