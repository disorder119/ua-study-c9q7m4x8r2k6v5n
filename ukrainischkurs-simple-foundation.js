/* Ukrainischkurs für Joel · einfacher Alphabet-Start v1
   Reduziert die ersten 14 Tage auf einen klaren Einstieg: ansehen -> schreiben -> Mini-Check.
   Aussprache-Coach und isolierte Buchstaben-TTS sind in der Grundlagenphase nicht verpflichtend. */
(()=>{
  const VERSION=1, INTRO_DAYS=11, ALPHABET_DAYS=14;
  const ORDER='А Б В Г Ґ Д Е Є Ж З И І Ї Й К Л М Н О П Р С Т У Ф Х Ц Ч Ш Щ Ь Ю Я'.split(' ');
  const EXAMPLE={
    'А':['автобус','Bus'],'Б':['бабуся','Oma'],'В':['вода','Wasser'],'Г':['гора','Berg'],'Ґ':['ґудзик','Knopf'],'Д':['дім','Haus'],'Е':['екран','Bildschirm'],'Є':['єнот','Waschbär'],'Ж':['жук','Käfer'],'З':['зуб','Zahn'],'И':['син','Sohn'],'І':['ім’я','Name'],'Ї':['їжа','Essen'],'Й':['йогурт','Joghurt'],'К':['кіт','Katze'],'Л':['лампа','Lampe'],'М':['мама','Mama'],'Н':['ніс','Nase'],'О':['око','Auge'],'П':['парк','Park'],'Р':['рука','Hand'],'С':['сир','Käse'],'Т':['так','Ja'],'У':['урок','Lektion'],'Ф':['Франція','Frankreich'],'Х':['хата','Haus'],'Ц':['це','das / dies'],'Ч':['чай','Tee'],'Ш':['школа','Schule'],'Щ':['щука','Hecht'],'Ь':['кінь','Pferd'],'Ю':['юнак','junger Mann'],'Я':['яблуко','Apfel']
  };

  const foundation=()=>Number(s.day)<ALPHABET_DAYS&&!alphabetReady();
  const intro=()=>Number(s.day)<INTRO_DAYS;
  const todayCards=()=>intro()?(D[Number(s.day)]?.[3]||[]):[];
  const todayLetters=()=>todayCards().map(c=>String(c?.[0]||'')[0]).filter(Boolean);
  function ensureSimple(){
    if(!s.simpleFoundation||typeof s.simpleFoundation!=='object')s.simpleFoundation={};
    s.simpleFoundation.version=VERSION;
    s.simpleFoundation.writing=s.simpleFoundation.writing||{};
    return s.simpleFoundation;
  }
  function writingDone(){return !!ensureSimple().writing[Number(s.day)]}
  function markWriting(){ensureSimple().writing[Number(s.day)]=true;save();renderSimpleStart()}
  function seenCount(){return todayCards().filter((_,ci)=>!!s.known[id(Number(s.day),ci)]).length}
  function allSeen(){return !!todayCards().length&&seenCount()===todayCards().length}
  function markSeen(di,ci){
    const k=id(di,ci);
    if(!s.known[k]){s.known[k]=freshMeta();dayHistory().newItems++;study();save()}
    renderAlphabet();renderSimpleStart();
  }
  function playExample(letter,button){
    const row=EXAMPLE[letter];if(!row)return;
    const nativeMeta=window.UKRAINIAN_PRONUNCIATION_META?.[letter],nativeSrc=window.UKRAINIAN_PRONUNCIATION_AUDIO?.[letter];
    if(nativeSrc&&nativeMeta?.label===row[0]){
      const audio=new Audio(nativeSrc);button?.classList.add('playing');let settled=false;const done=()=>{if(settled)return;settled=true;clearTimeout(stuck);button?.classList.remove('playing')};const stuck=setTimeout(done,8000);audio.onended=done;audio.onerror=done;audio.play().then(()=>{if(!settled)markListened()}).catch(done);return;
    }
    const voice=('speechSynthesis'in window)&&speechSynthesis.getVoices().find(v=>v.lang&&v.lang.toLowerCase().startsWith('uk'));
    if(!voice){toast('Für dieses Beispiel ist keine sichere ukrainische Stimme verfügbar. Lesen und Schreiben funktionieren trotzdem.');return}
    if(!window.SpeechSynthesisUtterance)return;
    const u=new SpeechSynthesisUtterance(row[0]);u.lang=voice.lang;u.voice=voice;u.rate=.72;u.pitch=1;
    u.onstart=()=>button?.classList.add('playing');u.onend=()=>button?.classList.remove('playing');u.onerror=()=>button?.classList.remove('playing');
    speechSynthesis.cancel();speechSynthesis.resume();speechSynthesis.speak(u);markListened();
  }

  const css=document.createElement('style');css.id='simpleFoundationStyles';css.textContent=`
    :root{--b:#2f7d57;--d:#174a35;--y:#dff3c9;--g:#2f8f62;--l:#d8e9df;--s:0 14px 40px #1d5c3d18}
    html{background:#f3f8f4}body{background:linear-gradient(145deg,#e8f5ec,#f8fbf8 46%,#f1f7e7)}
    h1 b{color:#4f9a69}.pill{background:#dff3c9;color:#245a3f}.progress{background:#dcebe1}.progress i{background:linear-gradient(90deg,#2f7d57,#75ad76)}
    .tab{background:#e5f1e9;color:#365f49}.tab[aria-selected=true]{background:#2f7d57;color:#fff}.primary{background:#2f7d57;box-shadow:0 5px 12px #2f7d5730}.secondary{background:#e7f2e9;color:#24563e}
    .label{color:#2f7d57}.time,.daily-next,.audio{background:#eef7f0;color:#365f49}.tip{border-left-color:#9ecb73;background:#f4fae9;color:#405333}
    body.foundation-simple main>header+section.card{display:none}
    body.foundation-simple #learn>article.card:first-of-type,body.foundation-simple #learn>article.card.small,body.foundation-simple #dialogCard{display:none!important}
    body.foundation-simple #pronCoach,body.foundation-simple #pronMastery{display:none!important}
    body.foundation-simple .tab[data-view="repeat"],body.foundation-simple .tab[data-view="methods"],body.foundation-simple .tab[data-view="course"],body.foundation-simple .tab[data-view="progress"]{display:none}
    .simple-start{border:1px solid #d9eadf;background:linear-gradient(145deg,#fff,#f2faf4);padding:22px}
    .simple-kicker{font-size:.82rem;font-weight:900;letter-spacing:.06em;text-transform:uppercase;color:#2f7d57}
    .simple-start h2{font-size:clamp(1.55rem,5vw,2.1rem);margin:5px 0 8px;color:#174a35}.simple-start p{margin:0;color:#536d60}
    .simple-steps{display:grid;gap:9px;margin:18px 0}.simple-step{display:grid;grid-template-columns:34px 1fr auto;gap:10px;align-items:center;padding:12px;border:1px solid #dcebe1;border-radius:15px;background:#fff}
    .simple-step>span{width:30px;height:30px;display:grid;place-items:center;border-radius:50%;background:#e6f2e9;color:#2f7d57;font-weight:900}.simple-step.done>span{background:#2f7d57;color:#fff}.simple-step small{display:block;color:#6b7f73;margin-top:2px}.simple-step b{font-size:.78rem;color:#5e7468}
    .simple-main{width:100%;font-size:1.02rem;padding:14px 17px}.simple-secondary-row{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:9px}.simple-secondary-row button{width:100%}
    .simple-note{margin-top:13px;padding:10px 12px;border-radius:12px;background:#eef7f0;color:#486356;font-size:.86rem}
    .simple-letter-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:16px}.simple-letter{border:1px solid #d7e8dd;border-radius:18px;background:#fff;padding:15px;min-width:0}.simple-letter.learned{border-color:#8bc5a0;background:#f3fbf5}.simple-letter-pair{font-size:2.65rem;line-height:1;font-weight:900;color:#174a35}.simple-letter-sound{margin-top:9px;font-weight:850}.simple-letter-help{font-size:.82rem;color:#697e71;margin-top:3px}.simple-example{margin:11px 0 9px;padding:9px;border-radius:11px;background:#eef7f0}.simple-example strong{display:block;color:#174a35}.simple-letter-actions{display:grid;gap:7px}.simple-letter-actions button{width:100%;padding:9px 10px}.simple-seen.done{background:#dff0e4;color:#276542}
    .simple-write-picker{display:flex;gap:7px;flex-wrap:wrap;margin:10px 0 4px}.simple-write-picker button{min-width:55px}.simple-write-picker button.active{background:#2f7d57;color:#fff}.foundation-simple .target-pick{display:none}.foundation-simple #nextTraceLetter{display:none}
    @media(max-width:600px){.simple-letter-grid{grid-template-columns:1fr}.simple-secondary-row{grid-template-columns:1fr}.simple-step{grid-template-columns:34px 1fr}.simple-step>b{grid-column:2}.simple-start{padding:18px}}
  `;document.head.append(css);

  function ensureWriteTab(){
    const nav=document.querySelector('nav');if(!nav||nav.querySelector('[data-view="write"]'))return;
    const alphabetTab=nav.querySelector('[data-view="alphabet"]'),b=document.createElement('button');b.className='tab';b.dataset.view='write';b.setAttribute('aria-selected','false');b.textContent='Schreiben';b.onclick=()=>show('write');
    alphabetTab?.insertAdjacentElement('afterend',b);
  }
  function bindTabs(){document.querySelectorAll('.tab').forEach(b=>{if(!b.dataset.simpleBound){b.dataset.simpleBound='1';b.addEventListener('click',()=>{if(b.dataset.view)show(b.dataset.view)})}})}

  function renderSimpleStart(){
    let box=document.getElementById('simpleFoundationStart');
    if(!foundation()){box?.remove();return}
    const streakEl=$('streak');if(streakEl)streakEl.textContent='Alphabet';
    const learn=$('learn'),anchor=learn?.querySelector('article.card');if(!learn||!anchor)return;
    if(!box){box=document.createElement('article');box.id='simpleFoundationStart';box.className='card simple-start';anchor.insertAdjacentElement('beforebegin',box)}
    const day=Number(s.day),p=lessonState(day);if(p.testPassed)syncLesson(day);
    if(day<INTRO_DAYS){
      const letters=todayLetters(),seen=seenCount(),written=writingDone(),tested=!!p.testPassed,nextAllowed=!!window.UKRAINIAN_LEARNING_STATE_GUARD?.alphabetDayAllowed?.(day+1);
      const primary=!allSeen()?['Alphabet lernen',()=>show('alphabet')]:!written?['Jetzt schreiben',()=>show('write')]:!tested?['Mini-Check starten',()=>document.getElementById('startQuiz')?.click()]:nextAllowed?['Nächsten Buchstabentag starten',()=>advanceLesson()]:['Für heute fertig',()=>toast('Der nächste neue Buchstabentag öffnet sich morgen. Du kannst heute freiwillig weiter schreiben.')];
      box.innerHTML='<div class="simple-kicker">Dein klarer Lernweg</div><h2>Heute nur '+letters.join(' · ')+'</h2><p>Keine sechs Pflichtaufgaben. Du lernst zuerst die Zeichen und schreibst sie. Aussprache kannst du zusätzlich hören, sie blockiert deinen Fortschritt aber nicht.</p><div class="simple-steps">'+
        '<div class="simple-step '+(allSeen()?'done':'')+'"><span>'+(allSeen()?'✓':'1')+'</span><div><strong>Buchstaben ansehen</strong><small>'+seen+' von '+letters.length+' angesehen</small></div><b>2–3 Min.</b></div>'+
        '<div class="simple-step '+(written?'done':'')+'"><span>'+(written?'✓':'2')+'</span><div><strong>Schreiben</strong><small>Einen der heutigen Buchstaben nachzeichnen</small></div><b>3–5 Min.</b></div>'+
        '<div class="simple-step '+(tested?'done':'')+'"><span>'+(tested?'✓':'3')+'</span><div><strong>Mini-Check</strong><small>Nur kurz prüfen, ob du die Laute wiedererkennst</small></div><b>1–2 Min.</b></div></div>'+
        '<button class="primary simple-main" id="simplePrimary">'+primary[0]+'</button><div class="simple-secondary-row"><button class="secondary" id="simpleAlphabet">Alphabet öffnen</button><button class="secondary" id="simpleWrite">Schreiben öffnen</button></div><div class="simple-note">Audio ist nur Hilfe: Es wird ein echtes ukrainisches Beispielwort gesprochen. Isolierte Buchstaben werden nicht mehr an die Systemstimme geschickt.</div>';
      box.querySelector('#simplePrimary').onclick=primary[1];box.querySelector('#simpleAlphabet').onclick=()=>show('alphabet');box.querySelector('#simpleWrite').onclick=()=>show('write');
    }else{
      const tested=!!p.testPassed,names=['Verwechslungen prüfen','Alphabet festigen','Alphabet abschließen'],nextAllowed=day<ALPHABET_DAYS-1&&!!window.UKRAINIAN_LEARNING_STATE_GUARD?.alphabetDayAllowed?.(day+1);
      box.innerHTML='<div class="simple-kicker">Alphabet · fast fertig</div><h2>'+names[day-11]+'</h2><p>Heute gibt es keine neuen Buchstaben. Ein kurzer Check reicht.</p><div class="simple-steps"><div class="simple-step '+(tested?'done':'')+'"><span>'+(tested?'✓':'1')+'</span><div><strong>'+names[day-11]+'</strong><small>Keine Aussprachepflicht, kein Zusatzprogramm</small></div><b>3–5 Min.</b></div></div><button class="primary simple-main" id="simplePrimary">'+(!tested?'Geführten Check starten':nextAllowed?'Nächsten Alphabettag starten':'Für heute fertig')+'</button>';
      box.querySelector('#simplePrimary').onclick=()=>!tested?document.getElementById('startQuiz')?.click():nextAllowed?advanceLesson():toast(day===ALPHABET_DAYS-1?'Alphabet geschafft. Danach öffnet sich der nächste Lernabschnitt.':'Der nächste Alphabettag öffnet sich morgen.');
    }
  }

  const baseAlphabet=renderAlphabet;
  renderAlphabet=function(){
    if(!foundation())return baseAlphabet.apply(this,arguments);
    const section=$('alphabet'),grid=$('alphabetGrid');if(!section||!grid)return;
    const cards=section.querySelectorAll(':scope > article.card'),guide=cards[0],main=cards[1];
    if(guide)guide.innerHTML='<div class="guide-avatar" aria-hidden="true">А</div><div><div class="label">Schritt 1 · Alphabet</div><h2>Erkennen, dann schreiben</h2><p>Heute nur wenige Zeichen. Audio spielt ein Beispielwort – nicht den Buchstabennamen.</p></div>';
    if(main){const h=main.querySelector('h2'),p=main.querySelector('.small');if(h)h.textContent=intro()?'Heutige Buchstaben':'Alphabet festigen';if(p)p.textContent=intro()?'Tippe nur die heutigen Zeichen durch. Danach gehst du direkt zum Schreiben.':'Keine neuen Zeichen – heute nur kurz festigen.';const tools=main.querySelector('.alphabet-tools');if(tools)tools.style.display='none';}
    grid.className='alphabet-grid simple-letter-grid';grid.innerHTML='';
    if(!intro()){
      grid.innerHTML='<article class="simple-letter" style="grid-column:1/-1"><div class="simple-letter-pair">33</div><div class="simple-letter-sound">Alle Buchstaben sind eingeführt</div><div class="simple-letter-help">Nutze auf der Startseite den kurzen Check.</div></article>';
      return;
    }
    const di=Number(s.day);
    todayCards().forEach((c,ci)=>{
      const letter=String(c[0])[0],row=EXAMPLE[letter]||['',''],known=!!s.known[id(di,ci)],card=document.createElement('article');card.className='simple-letter '+(known?'learned':'');
      card.innerHTML='<div class="simple-letter-pair">'+c[0]+'</div><div class="simple-letter-sound">Laut: '+c[1]+'</div><div class="simple-letter-help">'+c[2]+'</div><div class="simple-example"><strong>'+row[0]+'</strong><span>'+row[1]+' · Beispiel für den Laut</span></div><div class="simple-letter-actions"><button class="secondary simple-hear">🔊 Beispielwort hören</button><button class="secondary simple-seen '+(known?'done':'')+'">'+(known?'✓ Angesehen':'Als angesehen markieren')+'</button></div>';
      card.querySelector('.simple-hear').onclick=e=>playExample(letter,e.currentTarget);card.querySelector('.simple-seen').onclick=()=>markSeen(di,ci);grid.append(card);
    });
    const count=$('alphabetCount');if(count)count.textContent=seenCount()+' / '+todayCards().length+' heute';
  };

  const baseWrite=renderWrite;
  renderWrite=function(){
    if(foundation()&&intro()){
      const letters=todayLetters(),current=currentLetter()?.[0];
      if(letters.length&&!letters.includes(current)){s.writing.letter=ORDER.indexOf(letters[0]);s.writing.count=0;s.writing.target=10}
    }
    baseWrite.apply(this,arguments);if(!foundation()||!intro())return;
    const box=$('write')?.querySelector('article.card'),head=box?.querySelector('.practice-head');if(!box||!head)return;
    let picker=document.getElementById('simpleWritePicker');if(!picker){picker=document.createElement('div');picker.id='simpleWritePicker';picker.className='simple-write-picker';head.insertAdjacentElement('afterend',picker)}
    picker.innerHTML='<span class="small" style="width:100%">Welchen Buchstaben möchtest du schreiben?</span>'+todayLetters().map(letter=>'<button class="secondary '+(currentLetter()?.[0]===letter?'active':'')+'" data-simple-letter="'+letter+'">'+letter+'</button>').join('');
    picker.querySelectorAll('[data-simple-letter]').forEach(b=>b.onclick=()=>{const idx=ORDER.indexOf(b.dataset.simpleLetter);if(idx<0)return;s.writing.letter=idx;s.writing.count=0;s.writing.target=10;save();renderWrite()});
    const help=$('traceHelp');if(help)help.innerHTML='Zeichne <strong>'+currentLetter()[0]+'</strong> langsam nach. Ein sauberer Versuch reicht, um den Schreibschritt für heute zu zählen.';
    const title=box.querySelector('h2');if(title)title.textContent='Buchstaben schreiben lernen';
  };

  const baseCountTrace=countTrace;
  countTrace=function(){const before=Number(s.writing?.count)||0;baseCountTrace.apply(this,arguments);if((Number(s.writing?.count)||0)>before)markWriting()};
  if($('countTrace'))$('countTrace').onclick=()=>countTrace();

  const baseLessonComplete=lessonComplete;
  lessonComplete=function(di){if(Number(di)<ALPHABET_DAYS){const p=s.lessonProgress?.[di];return !!(p&&p.testPassed&&p.reviewDone)}return baseLessonComplete.apply(this,arguments)};
  syncLessons();

  const baseProgress=progress;
  progress=function(){const out=baseProgress.apply(this,arguments);if(foundation()){const e=$('streak');if(e)e.textContent='Alphabet'}return out};

  function applyMode(){
    ensureWriteTab();bindTabs();const on=foundation();document.body.classList.toggle('foundation-simple',on);
    const meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.content=on?'#2f7d57':'#155db5';
    const sub=document.querySelector('header .sub');if(sub)sub.textContent=on?'Alphabet zuerst: wenige Zeichen, direkt schreiben, dann kurz prüfen.':'Dein persönlicher Ukrainischkurs.';
    const streakEl=$('streak');if(streakEl&&on)streakEl.textContent='Alphabet';
    renderSimpleStart();
    if(on&&document.querySelector('.view.active')?.id==='alphabet')renderAlphabet();
    if(on&&document.querySelector('.view.active')?.id==='write')requestAnimationFrame(renderWrite);
  }

  const previousRender=render;render=function(){const out=previousRender.apply(this,arguments);applyMode();return out};
  const previousShow=show;show=function(v){const out=previousShow.apply(this,arguments);applyMode();return out};

  window.UKRAINIAN_SIMPLE_FOUNDATION={version:VERSION,threeStepStart:true,pronunciationOptional:true,exampleWordAudio:true,greenTheme:true};
  applyMode();
})();