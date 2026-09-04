/* Ukrainischkurs für Joel · Adaptive Alphabet-Mastery v1
   14 Tage sind der schnellste Pfad, nicht die Garantie. Freigabe erst nach mehrmodalem Mastery-Nachweis. */
(() => {
  const VERSION=1;
  const ORDER='А Б В Г Ґ Д Е Є Ж З И І Ї Й К Л М Н О П Р С Т У Ф Х Ц Ч Ш Щ Ь Ю Я'.split(' ');
  const HARD=['В','Г','Ґ','И','І','Ї','Р','Х','Ж','Ш','Щ','Ц','Ч'];
  const CONF={
    'В':['Б','У','Н'],'Б':['В','П','Р'],'Г':['Ґ','Х','К'],'Ґ':['Г','К','Д'],'Е':['Є','И','І'],'Є':['Е','Ї','Я'],
    'Ж':['Ш','Щ','Ч'],'З':['С','Ц','Ж'],'И':['І','Е','Ї'],'І':['И','Ї','Й'],'Ї':['І','Й','Є'],'Й':['Ї','І','Я'],
    'Н':['П','И','К'],'П':['Н','Р','Б'],'Р':['П','В','Б'],'С':['З','Ц','Є'],'У':['В','И','Ч'],'Х':['Г','К','Ж'],
    'Ц':['Ч','С','З'],'Ч':['Ц','Ш','Щ'],'Ш':['Щ','Ж','Ч'],'Щ':['Ш','Ж','Ч'],'Ь':['Й','І','Ї'],'Ю':['У','Я','Є'],'Я':['Ю','Є','Ї']
  };
  const CONTRAST=[
    {q:'Welcher Buchstabe steht für klares G wie in „Garten“?',a:'Ґ',o:['Ґ','Г']},
    {q:'Welcher Buchstabe steht für das weiche stimmhafte H /ɦ/?',a:'Г',o:['Г','Ґ']},
    {q:'Welcher Buchstabe steht für das klare I /i/?',a:'І',o:['І','И']},
    {q:'Welcher Buchstabe steht für das offenere kurze I /ɪ/?',a:'И',o:['И','І']},
    {q:'Welcher Buchstabe ist das stimmhafte „sch“ /ʒ/?',a:'Ж',o:['Ж','Ш']},
    {q:'Welcher Buchstabe ist das normale stimmlose „sch“ /ʃ/?',a:'Ш',o:['Ш','Ж']},
    {q:'Welcher Buchstabe steht ungefähr für „schtsch“?',a:'Щ',o:['Щ','Ш']},
    {q:'Welcher Buchstabe steht für „tsch“?',a:'Ч',o:['Ч','Ц']},
    {q:'Welcher Buchstabe steht für „z/ts“ wie in „Zeit“?',a:'Ц',o:['Ц','Ч']},
    {q:'Welcher Buchstabe beginnt am Wortanfang ungefähr mit „je“?',a:'Є',o:['Є','Е']},
    {q:'Welcher Buchstabe sieht wie deutsches B aus, klingt aber W?',a:'В',o:['В','Б']},
    {q:'Welcher Buchstabe sieht wie deutsches P aus, klingt aber R?',a:'Р',o:['Р','П']}
  ];
  const AUDIO_TARGETS=['В','Г','Ґ','Ж','И','І','Ї','Р','Х','Ц','Ч','Ш','Щ'];
  let session=null;

  function shuffle(list){return [...list].sort(()=>Math.random()-.5)}
  function ensure(){
    if(!s.alphabetMastery||typeof s.alphabetMastery!=='object'){
      const legacy=Number(s.day)>=14 || Object.keys(s.done||{}).some(k=>Number(k)>=14&&s.done[k]);
      s.alphabetMastery={version:VERSION,legacyGrandfathered:legacy,visual:{passed:false,best:0,date:''},audio:{passed:false,best:0,date:''},contrast:{passed:false,best:0,date:''},extensionDates:[],mixDates:{}};
    }
    s.alphabetMastery.version=VERSION;
    s.alphabetMastery.visual=s.alphabetMastery.visual||{passed:false,best:0,date:''};
    s.alphabetMastery.audio=s.alphabetMastery.audio||{passed:false,best:0,date:''};
    s.alphabetMastery.contrast=s.alphabetMastery.contrast||{passed:false,best:0,date:''};
    s.alphabetMastery.extensionDates=Array.isArray(s.alphabetMastery.extensionDates)?s.alphabetMastery.extensionDates:[];
    s.alphabetMastery.mixDates=s.alphabetMastery.mixDates||{};
    return s.alphabetMastery;
  }
  function alphaItem(letter){return alphabetItems().find(x=>x.c?.[0]?.[0]===letter)}
  function sound(letter){return alphaItem(letter)?.c?.[1]||LETTERS.find(x=>x[0]===letter)?.[1]||letter}
  function meta(letter){const item=alphaItem(letter);return item?s.known?.[item.k]:null}
  function successDays(letter){return [...new Set((meta(letter)?.successDates||[]).filter(Boolean))].length}
  function retentionCount(){return ORDER.filter(l=>successDays(l)>=2).length}
  function retentionReady(){return retentionCount()===33}
  function weakness(letter){const m=meta(letter)||{};return successDays(letter)*100+(Number(m.correct)||0)*4-(Number(m.wrong)||0)*8-(Number(m.errors)||0)*5}
  function weakLetters(limit=8){return [...ORDER].sort((a,b)=>weakness(a)-weakness(b)).slice(0,limit)}
  function introduced(){const n=s.day<11?Math.min(33,(s.day+1)*3):33;return ORDER.slice(0,n)}
  function recordEvidence(letter,good){
    const item=alphaItem(letter);if(!item)return;
    if(!s.known[item.k])s.known[item.k]=typeof freshMeta==='function'?freshMeta():{answers:0,correct:0,wrong:0,stage:0,successDates:[]};
    if(typeof scheduleMeta==='function')scheduleMeta(s.known[item.k],!!good);
    save();
  }
  function certified(){const m=ensure();return !!(m.legacyGrandfathered||(m.visual.passed&&m.audio.passed&&m.contrast.passed&&retentionReady()))}
  const baseAlphabetReady=alphabetReady;
  alphabetReady=function(){return !!baseAlphabetReady()&&certified()};
  requireAlphabet=function(){
    if(alphabetReady())return true;
    if(Number(s.day)!==13){s.day=13;save();render();}
    show('learn');setTimeout(()=>document.getElementById('alphabetMasteryLab')?.scrollIntoView({behavior:'smooth',block:'start'}),50);
    const m=ensure(),missing=[];
    if(!m.visual.passed)missing.push('33-Zeichen-Check');if(!m.audio.passed)missing.push('Hör-Diktat');if(!m.contrast.passed)missing.push('Verwechslungs-Test');if(!retentionReady())missing.push((33-retentionCount())+' Zeichen brauchen einen zweiten Lerntag');
    toast('Alphabet noch nicht freigegeben: '+missing.join(' · '));return false;
  };

  function optionsForLetter(letter){
    const pool=[letter,...(CONF[letter]||[]),...shuffle(ORDER.filter(x=>x!==letter))];
    return shuffle([...new Set(pool)].slice(0,4));
  }
  function soundOptions(letter){
    const letters=optionsForLetter(letter),vals=letters.map(l=>sound(l));
    const own=sound(letter);if(!vals.includes(own))vals[0]=own;return shuffle([...new Set(vals)]).slice(0,4);
  }
  function masked(label,letter){
    const low=letter.toLocaleLowerCase('uk');
    const i=label.toLocaleLowerCase('uk').indexOf(low);
    return i<0?'＿'+label:label.slice(0,i)+'＿'+label.slice(i+1);
  }
  function buildSession(type){
    if(type==='visual')return {type,phase:'test',items:shuffle(ORDER).map(letter=>({letter})),idx:0,correct:0,total:33,misses:[],threshold:32};
    if(type==='audio')return {type,phase:'test',items:shuffle(AUDIO_TARGETS).map(letter=>({letter})),idx:0,correct:0,total:AUDIO_TARGETS.length,misses:[],threshold:AUDIO_TARGETS.length-1};
    if(type==='contrast')return {type,phase:'test',items:shuffle(CONTRAST),idx:0,correct:0,total:CONTRAST.length,misses:[],threshold:CONTRAST.length};
    const intro=introduced(),pool=[...intro].sort((a,b)=>weakness(a)-weakness(b)).slice(0,Math.min(6,intro.length));
    return {type:'mix',phase:'test',items:shuffle(pool).map(letter=>({letter})),idx:0,correct:0,total:pool.length,misses:[],threshold:pool.length};
  }
  function startTest(type){session=buildSession(type);renderPanels()}
  function current(){return session?.items?.[session.idx]}
  function finishSession(){
    const m=ensure(),ratio=session.total?session.correct/session.total:0,score=Math.round(ratio*100),passed=session.correct>=session.threshold;
    if(session.type==='mix'){
      m.mixDates[date()]={score,total:session.total};save();toast('Mix-Check: '+score+' %. Schwache Zeichen wurden aktualisiert.');session=null;renderPanels();return;
    }
    const slot=m[session.type];slot.best=Math.max(Number(slot.best)||0,score);slot.date=date();slot.passed=!!passed;slot.attempts=(Number(slot.attempts)||0)+1;save();
    toast(passed?'Teilprüfung bestanden.':score+' % beim ersten Durchgang. Die Fehler wurden repariert; für die Freigabe brauchst du einen stärkeren frischen Versuch.');
    session=null;render();
  }
  function afterMainPhase(){
    const missed=[...new Set(session.misses)];
    if(missed.length){
      session.phase='repair';session.items=missed.map(x=>session.type==='contrast'?x:{letter:x});session.idx=0;session.misses=[];renderPanels();return;
    }
    finishSession();
  }
  function advance(){session.idx++;if(session.idx>=session.items.length){if(session.phase==='test')afterMainPhase();else finishSession()}else renderPanels()}
  function answerVisual(value){
    const item=current(),letter=item.letter,good=value===sound(letter);recordEvidence(letter,good);
    if(session.phase==='test'){if(good)session.correct++;else session.misses.push(letter)}
    if(session.phase==='repair'&&!good){toast('Noch nicht. Richtig ist: '+sound(letter));setTimeout(()=>renderPanels(),450);return}
    toast(good?'Richtig.':'Richtig wäre: '+sound(letter));setTimeout(advance,420);
  }
  function answerAudio(value){
    const item=current(),letter=item.letter,good=value===letter;recordEvidence(letter,good);
    if(session.phase==='test'){if(good)session.correct++;else session.misses.push(letter)}
    if(session.phase==='repair'&&!good){toast('Noch nicht. In die Lücke gehört '+letter+'.');setTimeout(()=>renderPanels(),500);return}
    toast(good?'Richtig gehört.':'In die Lücke gehört '+letter+'.');setTimeout(advance,450);
  }
  function answerContrast(value){
    const item=current(),good=value===item.a;recordEvidence(item.a,good);
    if(session.phase==='test'){if(good)session.correct++;else session.misses.push(item)}
    if(session.phase==='repair'&&!good){toast('Noch nicht. Richtig ist '+item.a+'.');setTimeout(()=>renderPanels(),500);return}
    toast(good?'Richtig unterschieden.':'Richtig ist '+item.a+'.');setTimeout(advance,450);
  }
  function playAudio(letter,button){
    const src=window.UKRAINIAN_PRONUNCIATION_AUDIO?.[letter];
    if(src){const a=new Audio(src);button.disabled=true;a.onended=()=>button.disabled=false;a.onerror=()=>{button.disabled=false;toast('Menschliche Referenz gerade nicht erreichbar.');};a.play().catch(()=>{button.disabled=false;toast('Tippe erneut auf Anhören.');});return}
    if(typeof speak==='function')speak(letter,button);
  }
  function sessionHtml(){
    if(!session)return '';
    const item=current(),pos=session.idx+1,total=session.items.length,repair=session.phase==='repair';
    if(!item)return '';
    if(session.type==='visual'||session.type==='mix'){
      const letter=item.letter,pair=alphaItem(letter)?.c?.[0]||letter,opts=soundOptions(letter);
      return '<div class="am-test"><div class="label">'+(session.type==='mix'?'Gemischter Zwischencheck':'33-Zeichen-Check')+(repair?' · Reparatur':'')+'</div><div class="small">Aufgabe '+pos+' von '+total+'</div><div class="am-prompt">'+pair+'</div><div class="small">Welcher Laut gehört dazu?</div><div class="am-grid">'+opts.map(x=>'<button class="answer" data-am-visual="'+x.replace(/"/g,'&quot;')+'">'+x+'</button>').join('')+'</div></div>';
    }
    if(session.type==='audio'){
      const letter=item.letter,meta=window.UKRAINIAN_PRONUNCIATION_META?.[letter],label=meta?.label||letter,blank=masked(label,letter),opts=optionsForLetter(letter);
      return '<div class="am-test"><div class="label">Hör-Diktat'+(repair?' · Reparatur':'')+'</div><div class="small">Aufgabe '+pos+' von '+total+' · nicht raten: zuerst anhören</div><div class="am-prompt am-word">'+blank+'</div><button class="secondary" id="amPlay">🎙️ Menschliche Referenz anhören</button><div class="small">Welches Zeichen fehlt im gehörten Wort?</div><div class="am-grid">'+opts.map(x=>'<button class="answer" data-am-audio="'+x+'">'+x+'</button>').join('')+'</div></div>';
    }
    const opts=shuffle(item.o||[item.a]);
    return '<div class="am-test"><div class="label">Verwechslungs-Test'+(repair?' · Reparatur':'')+'</div><div class="small">Aufgabe '+pos+' von '+total+'</div><div class="am-question">'+item.q+'</div><div class="am-grid two">'+opts.map(x=>'<button class="answer" data-am-contrast="'+x+'">'+x+'</button>').join('')+'</div></div>';
  }
  function renderMastery(){
    if(Number(s.day)!==13){const old=document.getElementById('alphabetMasteryLab');if(old)old.hidden=true;return;}
    const m=ensure();
    if(!m.legacyGrandfathered){const start=new Date((s.courseStartDate||date())+'T12:00:00'),now=new Date(date()+'T12:00:00'),elapsed=Math.floor((now-start)/86400000)+1;if(elapsed>14&&!m.extensionDates.includes(date())){m.extensionDates.push(date());save();}}
    let panel=document.getElementById('alphabetMasteryLab');const cards=document.getElementById('cards');if(!cards)return;
    if(!panel){panel=document.createElement('section');panel.id='alphabetMasteryLab';panel.className='card';cards.insertAdjacentElement('afterend',panel)}panel.hidden=false;
    const retained=retentionCount(),base=lessonState(13),basePct=base.total?Math.round((base.score||0)/base.total*100):0;
    const checks=[['Basis-Checkpoint',!!s.alphabetPhase?.checkpointPassed,basePct+' %'],['33 Zeichen',m.visual.passed,m.visual.best+' %'],['Hör-Diktat',m.audio.passed,m.audio.best+' %'],['Verwechslungen',m.contrast.passed,m.contrast.best+' %'],['2 Lerntage',retentionReady(),retained+' / 33']];
    panel.innerHTML='<div class="am-head"><div><div class="label">Alphabet-Zertifizierung · 14+</div><h2>Du gehst erst weiter, wenn du es wirklich kannst</h2></div><div class="pill">'+checks.filter(x=>x[1]).length+'/'+checks.length+' Nachweise</div></div><p class="small">14 Tage sind das schnellste Ziel. Wenn einzelne Zeichen noch wackeln, verlängert die App automatisch und trainiert nur die Lücken. Kein künstliches Durchfallen, kein automatisches Weiterklicken.</p><div class="am-status">'+checks.map(x=>'<div class="am-chip '+(x[1]?'ok':'')+'"><b>'+(x[1]?'✓ ':'')+x[0]+'</b><span>'+x[2]+'</span></div>').join('')+'</div>'+
      (session?sessionHtml():'<div class="am-actions"><button class="primary" data-am-start="visual">33-Zeichen-Check</button><button class="secondary" data-am-start="audio">Hör-Diktat</button><button class="secondary" data-am-start="contrast">Verwechslungs-Test</button></div>')+
      '<div class="tip">'+(alphabetReady()?'Alphabet wirklich freigegeben: mehrere Testarten + Wiederholung an getrennten Tagen erfüllt.':retained<33?'Noch '+(33-retained)+' Zeichen brauchen mindestens einen weiteren erfolgreichen Abruf an einem anderen Kalendertag. Schwächste aktuell: '+weakLetters(6).join(' · ')+'.':'Die mehrtägige Erinnerung sitzt. Schließe jetzt die noch offenen Teilprüfungen ab.')+'</div>';
    bindPanel(panel);
    const label=document.getElementById('label');if(label){const ext=m.extensionDates.length;label.textContent=ext?'Festigungstag '+(14+ext)+' · Alphabet 14+':'Tag 14 · Alphabet-Zertifizierung';}
    const title=document.getElementById('title');if(title&&!alphabetReady())title.textContent='Alphabet festigen, bis es automatisch sitzt';
  }
  function renderMix(){
    if(Number(s.day)>=13||Number(s.day)<0){const old=document.getElementById('alphabetMix');if(old)old.hidden=true;return;}
    let panel=document.getElementById('alphabetMix');const cards=document.getElementById('cards');if(!cards)return;
    if(!panel){panel=document.createElement('section');panel.id='alphabetMix';panel.className='card';cards.insertAdjacentElement('afterend',panel)}panel.hidden=false;
    const pool=introduced(),weak=[...pool].sort((a,b)=>weakness(a)-weakness(b)).slice(0,6);
    panel.innerHTML='<div class="am-head"><div><div class="label">2-Minuten-Mix</div><h2>Alt + neu mischen statt nur blockweise lernen</h2></div></div><p class="small">Kurzer Abruf aus bereits eingeführten Zeichen. Die App nimmt bevorzugt das, was noch am wenigsten stabil ist.</p>'+(session&&session.type==='mix'?sessionHtml():'<div class="actions"><button class="secondary" data-am-start="mix">'+Math.min(6,pool.length)+' Fragen starten</button><span class="small">Heute schwächer: '+(weak.join(' · ')||'noch keine Daten')+'</span></div>');
    bindPanel(panel);
  }
  function bindPanel(panel){
    panel.querySelectorAll('[data-am-start]').forEach(b=>b.onclick=()=>startTest(b.dataset.amStart));
    panel.querySelectorAll('[data-am-visual]').forEach(b=>b.onclick=()=>answerVisual(b.dataset.amVisual));
    panel.querySelectorAll('[data-am-audio]').forEach(b=>b.onclick=()=>answerAudio(b.dataset.amAudio));
    panel.querySelectorAll('[data-am-contrast]').forEach(b=>b.onclick=()=>answerContrast(b.dataset.amContrast));
    const play=document.getElementById('amPlay');if(play&&session?.type==='audio')play.onclick=()=>playAudio(current().letter,play);
  }
  function renderPanels(){renderMastery();renderMix()}

  const css=document.createElement('style');css.textContent='.am-head{display:flex;gap:12px;justify-content:space-between;align-items:flex-start}.am-status{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px;margin:14px 0}.am-chip{display:flex;justify-content:space-between;gap:8px;padding:9px 10px;border-radius:12px;background:#f1f5f9;color:#526b87;font-size:.82rem}.am-chip.ok{background:#e4faef;color:#126946}.am-actions{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.am-test{margin-top:13px;padding:14px;border-radius:16px;background:#f4f8fc;text-align:center}.am-prompt{font-size:2.7rem;font-weight:850;color:var(--d);margin:10px 0}.am-word{font-size:2rem}.am-question{font-size:1.08rem;font-weight:800;color:var(--d);margin:13px auto;max-width:520px}.am-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-top:12px}.am-grid .answer{text-align:center}.am-grid.two{max-width:420px;margin-left:auto;margin-right:auto}@media(max-width:520px){.am-actions{grid-template-columns:1fr}.am-status{grid-template-columns:1fr}}';document.head.append(css);

  const previousRender=render;
  render=function(){previousRender();renderPanels()};
  ensure();renderPanels();
})();
