/* Ukrainischkurs für Joel · adaptive Aussprache-Festigung v3
   Ergänzt den Aussprache-Coach um verteiltes Lauttraining über mehrere Tage.
   Hör-Abruf verwendet ausschließlich menschliche ukrainische Referenzaufnahmen.
   Der angezeigte Wert misst Trainingsabdeckung, nicht objektive Akzentqualität. */
(() => {
  const VERSION=3;
  const ORDER='А Б В Г Ґ Д Е Є Ж З И І Ї Й К Л М Н О П Р С Т У Ф Х Ц Ч Ш Щ Ь Ю Я'.split(' ');
  const DRILL={
    'А':'а','Б':'ба','В':'ва','Г':'га','Ґ':'ґа','Д':'да','Е':'е','Є':'є','Ж':'жа','З':'за','И':'би','І':'бі','Ї':'ї','Й':'ай','К':'ка','Л':'ла','М':'ма','Н':'на','О':'о','П':'па','Р':'ра','С':'са','Т':'та','У':'у','Ф':'фа','Х':'ха','Ц':'ца','Ч':'ча','Ш':'ша','Щ':'ща','Ь':'нь','Ю':'ю','Я':'я'
  };
  const PAIR={В:'Б',Б:'В',Г:'Ґ',Ґ:'Г',Е:'Є',Є:'Е',Ж:'Ш',Ш:'Щ',Щ:'Ш',З:'С',С:'З',И:'І',І:'И',Ї:'Й',Й:'Ї',Ц:'Ч',Ч:'Ц'};
  const NATIVE=window.UKRAINIAN_PRONUNCIATION_AUDIO||{},META=window.UKRAINIAN_PRONUNCIATION_META||{};
  let earTask=null,currentAudio=null;

  function uniq(list){return [...new Set((list||[]).filter(Boolean))].sort()}
  function ensureMastery(){
    if(!s.pronunciation||typeof s.pronunciation!=='object')s.pronunciation={};
    s.pronunciation.masteryVersion=VERSION;
    s.pronunciation.mastery=s.pronunciation.mastery||{letters:{},daily:{}};
    s.pronunciation.mastery.letters=s.pronunciation.mastery.letters||{};
    const m=s.pronunciation.mastery;
    if(!m.daily||m.daily.date!==date()||m.daily.courseDay!==s.day){
      m.daily={date:date(),courseDay:s.day,targets:[],heard:[],produced:[],recalled:[],attempts:0,correct:0};
    }
    return m;
  }
  function stat(letter){
    const m=ensureMastery(),x=m.letters[letter]||(m.letters[letter]={heardDates:[],productionDates:[],recallDates:[],earCorrect:0,earTotal:0,last:'',selfRetries:0});
    x.heardDates=uniq(x.heardDates);x.productionDates=uniq(x.productionDates);x.recallDates=uniq(x.recallDates);
    x.earCorrect=Number(x.earCorrect)||0;x.earTotal=Number(x.earTotal)||0;x.selfRetries=Number(x.selfRetries)||0;
    return x;
  }
  function introducedLetters(){if(s.day<0)return [];const count=s.day<11?Math.min(33,(s.day+1)*3):33;return ORDER.slice(0,count)}
  function currentNewLetters(){if(s.day>=11)return [];return ORDER.slice(s.day*3,Math.min(33,s.day*3+3))}
  function score(letter){const x=stat(letter),heard=Math.min(3,x.heardDates.length)/3,prod=Math.min(3,x.productionDates.length)/3,recall=Math.min(2,x.recallDates.length)/2;const volume=Math.min(1,x.earTotal/4),accuracy=x.earTotal?x.earCorrect/x.earTotal:0;return Math.round(20*heard+30*prod+20*recall+30*volume*accuracy)}
  function status(letter){const n=score(letter);return n>=80?'stabil':n>=60?'fast sicher':n>=30?'im Aufbau':'neu'}
  function weakest(limit=2){const fresh=new Set(currentNewLetters());return introducedLetters().filter(l=>!fresh.has(l)).sort((a,b)=>score(a)-score(b)||((stat(a).last||'')>(stat(b).last||'')?1:-1)||ORDER.indexOf(a)-ORDER.indexOf(b)).slice(0,limit)}
  function syncBaseEvidence(){const m=ensureMastery(),d=s.pronunciation?.daily;if(!d||d.date!==date())return;const active=s.day<11?currentNewLetters():[];active.forEach(letter=>{const x=stat(letter);if((d.reference||[]).includes(letter)){x.heardDates=uniq([...x.heardDates,date()]);x.last=date()}if(d.checkPassed||(d.recorded&&d.replayed&&d.selfPassed)||d.manual){x.productionDates=uniq([...x.productionDates,date()]);x.last=date()}});if(!m.daily.targets.length)m.daily.targets=weakest(2)}
  function record(letter,kind,good=true){const m=ensureMastery(),x=stat(letter),today=date();if(kind==='heard'){x.heardDates=uniq([...x.heardDates,today]);m.daily.heard=uniq([...m.daily.heard,letter])}if(kind==='produced'){x.productionDates=uniq([...x.productionDates,today]);m.daily.produced=uniq([...m.daily.produced,letter])}if(kind==='ear'){x.earTotal++;m.daily.attempts++;if(good){x.earCorrect++;m.daily.correct++;x.recallDates=uniq([...x.recallDates,today]);m.daily.recalled=uniq([...m.daily.recalled,letter])}}if(kind==='retry')x.selfRetries++;x.last=today;save();renderMastery()}
  function stopAudio(){if(!currentAudio)return;try{currentAudio.pause()}catch{}currentAudio=null}
  function playHuman(letter,rate=.76,{recordHeard=true,onReady=null}={}){
    const src=NATIVE[letter],meta=META[letter];if(!src||!meta){toast('Für diesen Laut fehlt eine geprüfte menschliche Referenz. Der Hörnachweis wird nicht gezählt.');return false}
    stopAudio();const a=new Audio(src);currentAudio=a;a.playbackRate=rate<.7?.82:1;try{a.preservesPitch=true}catch{}
    a.onended=()=>{if(currentAudio===a)currentAudio=null};a.onerror=()=>{if(currentAudio===a)currentAudio=null;toast('Die menschliche Referenz konnte nicht geladen werden. Bitte erneut versuchen.')};
    const p=a.play();if(p&&typeof p.then==='function')p.then(()=>{if(recordHeard){record(letter,'heard');markListened()}onReady?.(meta)}).catch(()=>{if(currentAudio===a)currentAudio=null;toast('Die menschliche Referenz konnte nicht abgespielt werden. Kein TTS-Ersatz wird für den Hörnachweis verwendet.')});else{if(recordHeard){record(letter,'heard');markListened()}onReady?.(meta)}return true
  }
  function alternatives(target){const intro=introducedLetters(),pair=PAIR[target],result=[target];if(pair&&intro.includes(pair))result.push(pair);const rest=intro.filter(x=>!result.includes(x)).sort(()=>Math.random()-.5);while(result.length<Math.min(4,intro.length)&&rest.length)result.push(rest.shift());return result.sort(()=>Math.random()-.5)}
  function startEar(letter){earTask={letter,answer:letter,options:alternatives(letter),audioReady:false};renderMastery();setTimeout(()=>playHuman(letter,.72,{recordHeard:false,onReady:()=>{if(earTask?.letter===letter){earTask.audioReady=true;renderMastery()}}}),80)}
  function answerEar(choice){if(!earTask)return;if(!earTask.audioReady){toast('Erst die menschliche Aufnahme vollständig laden und anhören.');return}const target=earTask.answer,good=choice===target;record(target,'ear',good);const result=document.getElementById('pronMasteryResult');if(result)result.textContent=good?'Richtig erkannt. Jetzt den Laut selbst 3× produzieren.':'Noch nicht. Das war '+target+'. Höre das menschliche Referenzwort erneut.';if(good)earTask=null;else{earTask.audioReady=false;setTimeout(()=>playHuman(target,.62,{recordHeard:false,onReady:()=>{if(earTask?.letter===target){earTask.audioReady=true;renderMastery()}}}),200)}renderMastery()}
  function produce(letter){record(letter,'produced');toast(letter+' heute aktiv nachgesprochen.')}
  function reviewReady(){const m=ensureMastery(),targets=m.daily.targets||[];return targets.every(l=>m.daily.recalled.includes(l)&&m.daily.produced.includes(l))}
  function overall(){const list=introducedLetters();if(!list.length)return 0;return Math.round(list.reduce((sum,l)=>sum+score(l),0)/list.length)}
  function weakList(){return introducedLetters().sort((a,b)=>score(a)-score(b)).slice(0,5)}
  function renderMastery(){
    syncBaseEvidence();const base=document.getElementById('pronCoach');if(!base)return;let panel=document.getElementById('pronMastery');if(!panel){panel=document.createElement('section');panel.id='pronMastery';panel.className='card';base.insertAdjacentElement('afterend',panel)}if(s.day>=14){panel.hidden=true;return}panel.hidden=false;
    const m=ensureMastery(),targets=m.daily.targets||[],ready=reviewReady(),value=overall(),weak=weakList();
    const targetHtml=targets.length?targets.map(letter=>{const recalled=m.daily.recalled.includes(letter),produced=m.daily.produced.includes(letter),x=stat(letter),word=META[letter]?.label||'Referenzwort';return '<div class="pm-target"><div class="pm-letter">'+letter+'</div><div><strong>'+score(letter)+'/100 · '+status(letter)+'</strong><div class="small">Menschliches Referenzwort: <span lang="uk">'+word+'</span> · '+x.productionDates.length+' Produktionstag'+(x.productionDates.length===1?'':'e')+' · '+x.earCorrect+'/'+x.earTotal+' Hörabrufe richtig</div></div><div class="pm-actions"><button class="secondary" data-pm-hear="'+letter+'">🎙️ Mensch hören</button><button class="secondary" data-pm-ear="'+letter+'">'+(recalled?'✓ erkannt':'Human-Hör-Abruf')+'</button><button class="'+(produced?'secondary':'primary')+'" data-pm-produce="'+letter+'">'+(produced?'✓ 3× gesprochen':'3× nachsprechen')+'</button></div></div>'}).join(''):'<p class="small">Heute gibt es noch keine älteren Laute. Ab dem nächsten Einführungstag holt der Coach automatisch schwache Laute zurück.</p>';
    const task=earTask?'<div class="pm-test"><strong>Nur das menschliche Referenzwort hören – nicht ablesen:</strong><div class="small">'+(earTask.audioReady?'Tonspur bereit. Welcher Ziellaut wurde trainiert?':'Menschliche Tonspur wird geladen …')+'</div><div class="actions">'+earTask.options.map(l=>'<button class="answer" data-pm-answer="'+l+'" '+(earTask.audioReady?'':'disabled')+'>'+l+'</button>').join('')+'</div><div id="pronMasteryResult" class="small"></div></div>':'';
    panel.innerHTML='<div class="pm-head"><div><div class="label">Laut-Festigung · nur Human-Audio</div><h2>Schwache Laute kommen automatisch zurück</h2></div><div class="pill">'+value+'/100</div></div><p class="small">Der Wert misst nur, wie breit ein Laut über menschliches Hören, eigenes Produzieren und Abruf an mehreren Tagen trainiert wurde. Er ist keine automatische Akzentnote.</p>'+targetHtml+task+'<div class="pm-weak"><strong>Aktuell am wenigsten gefestigt</strong><div class="pm-chips">'+weak.map(l=>'<span>'+l+' '+score(l)+'</span>').join('')+'</div></div><div class="tip">'+(targets.length?(ready?'Tages-Wiederholung erledigt. Die alten Laute wurden mit Human-Audio erkannt und wieder produziert.':'Pflicht vor „nachgesprochen“: jeden Wiederholungslaut mit menschlicher Aufnahme erkennen und anschließend 3× selbst produzieren.'):'Heute liegt der Schwerpunkt auf den neuen Lauten.')+'</div>';
    panel.querySelectorAll('[data-pm-hear]').forEach(b=>b.onclick=()=>playHuman(b.dataset.pmHear,.72));panel.querySelectorAll('[data-pm-ear]').forEach(b=>b.onclick=()=>startEar(b.dataset.pmEar));panel.querySelectorAll('[data-pm-produce]').forEach(b=>b.onclick=()=>produce(b.dataset.pmProduce));panel.querySelectorAll('[data-pm-answer]').forEach(b=>b.onclick=()=>answerEar(b.dataset.pmAnswer));
  }
  const css=document.createElement('style');css.textContent='.pm-head{display:flex;gap:12px;align-items:flex-start;justify-content:space-between}.pm-target{display:grid;grid-template-columns:54px 1fr;gap:10px;padding:12px 0;border-top:1px solid var(--l)}.pm-letter{font-size:2rem;font-weight:850;color:var(--d);text-align:center}.pm-actions{grid-column:1/-1;display:flex;gap:7px;flex-wrap:wrap}.pm-actions button{flex:1;min-width:120px}.pm-test{margin:10px 0;padding:12px;border-radius:14px;background:#edf5ff}.pm-test .actions{display:grid;grid-template-columns:repeat(4,1fr);gap:7px}.pm-test .answer{text-align:center}.pm-weak{margin-top:12px}.pm-chips{display:flex;gap:6px;flex-wrap:wrap;margin-top:7px}.pm-chips span{border-radius:99px;background:#edf2f8;padding:5px 9px;font-size:.78rem;font-weight:800;color:#526b87}@media(max-width:480px){.pm-test .actions{grid-template-columns:repeat(2,1fr)}}';document.head.append(css);
  const baseHandler=$('markSpoken').onclick;$('markSpoken').onclick=function(e){syncBaseEvidence();if(!reviewReady()){renderMastery();document.getElementById('pronMastery')?.scrollIntoView({behavior:'smooth',block:'center'});toast('Erst die heutigen Human-Audio-Aussprache-Wiederholungen abschließen.');return}return baseHandler?.call(this,e)};
  const previousRender=render;render=function(){previousRender();syncBaseEvidence();renderMastery()};syncBaseEvidence();renderMastery();window.UKRAINIAN_PRONUNCIATION_MASTERY_QUALITY={version:VERSION,humanAudioOnly:true,noTtsEvidence:true};
})();