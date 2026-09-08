/* Ukrainischkurs für Joel · geführter Alphabet-Start v1
   Ein Bildschirm = eine Aufgabe: sehen -> hören -> malen -> erkennen -> Bild finden -> Lob. */
(()=>{
  const VERSION=1,INTRO_DAYS=11;
  const ORDER='А Б В Г Ґ Д Е Є Ж З И І Ї Й К Л М Н О П Р С Т У Ф Х Ц Ч Ш Щ Ь Ю Я'.split(' ');
  const INFO={
    'А':{small:'а',word:'автобус',de:'Bus',icon:'🚌',sound:'A wie in Auto',steps:['Schräg nach unten','Noch einmal schräg','Kurzer Strich in die Mitte']},
    'Б':{small:'б',word:'банан',de:'Banane',icon:'🍌',sound:'B wie in Ball',steps:['Strich nach unten','Oben einen kurzen Strich','Rechts eine Rundung malen']},
    'В':{small:'в',word:'вода',de:'Wasser',icon:'💧',sound:'W wie in Wasser',steps:['Langer Strich nach unten','Oben einen Bauch','Unten einen Bauch']},
    'Г':{small:'г',word:'гора',de:'Berg',icon:'⛰️',sound:'Hör auf das ukrainische Beispiel',steps:['Strich nach unten','Oben einen Strich nach rechts']},
    'Ґ':{small:'ґ',word:'ґудзик',de:'Knopf',icon:'🔘',sound:'Kräftiger G-Laut',steps:['Strich nach unten','Oben nach rechts','Kleiner Haken nach oben']},
    'Д':{small:'д',word:'дім',de:'Haus',icon:'🏠',sound:'D wie in Dach',steps:['Obere Form malen','Beide Seiten nach unten','Unten die Füße ergänzen']},
    'Е':{small:'е',word:'екран',de:'Bildschirm',icon:'🖥️',sound:'E wie in Ecke',steps:['Langer Strich nach unten','Oben nach rechts','Mitte und unten nach rechts']},
    'Є':{small:'є',word:'єнот',de:'Waschbär',icon:'🦝',sound:'Je-Laut',steps:['Großen Bogen malen','Zwei kurze Striche nach innen']},
    'Ж':{small:'ж',word:'жук',de:'Käfer',icon:'🪲',sound:'Stimmhafter sch-Laut',steps:['Strich durch die Mitte','Schräge Linie links','Schräge Linie rechts']},
    'З':{small:'з',word:'зуб',de:'Zahn',icon:'🦷',sound:'S wie in Sonne, aber stimmhaft',steps:['Obere Rundung','Untere Rundung']},
    'И':{small:'и',word:'син',de:'Sohn',icon:'👦',sound:'Kurzer i-ähnlicher Laut',steps:['Linken Strich nach unten','Schräg nach oben','Rechten Strich nach unten']},
    'І':{small:'і',word:'ім’я',de:'Name',icon:'🏷️',sound:'I wie in Igel',steps:['Langer Strich nach unten']},
    'Ї':{small:'ї',word:'їжа',de:'Essen',icon:'🍽️',sound:'Ji-Laut',steps:['Langer Strich nach unten','Zwei Punkte darüber']},
    'Й':{small:'й',word:'йогурт',de:'Joghurt',icon:'🥣',sound:'Kurzer J-Laut',steps:['Wie И malen','Kleinen Bogen darüber']},
    'К':{small:'к',word:'кіт',de:'Katze',icon:'🐱',sound:'K wie in Katze',steps:['Langer Strich','Oben schräg zur Mitte','Von der Mitte schräg nach unten']},
    'Л':{small:'л',word:'лампа',de:'Lampe',icon:'💡',sound:'L wie in Lampe',steps:['Schräg zur Mitte hoch','Schräg nach unten']},
    'М':{small:'м',word:'мама',de:'Mama',icon:'👩',sound:'M wie in Mama',steps:['Linker Strich','Schräg zur Mitte','Schräg hoch und rechter Strich']},
    'Н':{small:'н',word:'ніс',de:'Nase',icon:'👃',sound:'N wie in Nase',steps:['Linker Strich','Rechter Strich','Querstrich in die Mitte']},
    'О':{small:'о',word:'око',de:'Auge',icon:'👁️',sound:'O wie in Ofen',steps:['Einen großen Kreis malen']},
    'П':{small:'п',word:'парк',de:'Park',icon:'🌳',sound:'P wie in Park',steps:['Linker Strich','Oben nach rechts','Rechter Strich nach unten']},
    'Р':{small:'р',word:'рука',de:'Hand',icon:'✋',sound:'Gerolltes R',steps:['Langer Strich','Oben einen Bauch nach rechts']},
    'С':{small:'с',word:'сир',de:'Käse',icon:'🧀',sound:'S wie in Sonne',steps:['Einen offenen Bogen malen']},
    'Т':{small:'т',word:'так',de:'Ja',icon:'✅',sound:'T wie in Tag',steps:['Oben einen Strich','Von der Mitte nach unten']},
    'У':{small:'у',word:'урок',de:'Lektion',icon:'📚',sound:'U wie in Uhr',steps:['Zwei schräge Linien treffen lassen','Vom Treffpunkt nach unten']},
    'Ф':{small:'ф',word:'фото',de:'Foto',icon:'📷',sound:'F wie in Foto',steps:['Kreis in die Mitte','Strich durch den Kreis']},
    'Х':{small:'х',word:'хата',de:'Haus',icon:'🏡',sound:'Ch wie in Bach',steps:['Schräg nach unten','Andere Schräge kreuzen']},
    'Ц':{small:'ц',word:'це',de:'das / dies',icon:'👉',sound:'Z wie in Zahl',steps:['Zwei Striche verbinden','Kleinen Haken unten ergänzen']},
    'Ч':{small:'ч',word:'чай',de:'Tee',icon:'🍵',sound:'Tsch-Laut',steps:['Kurzen linken Strich','Bogen zur rechten Seite','Rechten Strich nach unten']},
    'Ш':{small:'ш',word:'школа',de:'Schule',icon:'🏫',sound:'Sch wie in Schule',steps:['Drei Striche nach unten','Unten verbinden']},
    'Щ':{small:'щ',word:'щука',de:'Hecht',icon:'🐟',sound:'Weicher schtsch-Laut',steps:['Wie Ш malen','Kleinen Haken unten ergänzen']},
    'Ь':{small:'ь',word:'кінь',de:'Pferd',icon:'🐴',sound:'Weichheitszeichen – kein eigener Laut',steps:['Langer Strich','Unten einen kleinen Bauch']},
    'Ю':{small:'ю',word:'юнак',de:'junger Mann',icon:'🧑',sound:'Ju-Laut',steps:['Linker Strich','Kurzer Querstrich','Rechts einen Kreis']},
    'Я':{small:'я',word:'яблуко',de:'Apfel',icon:'🍎',sound:'Ja-Laut',steps:['Oben einen Bauch','Zur Mitte ziehen','Schräg nach unten']}
  };
  const STAGES=['look','listen','trace','letter','picture','reward'];
  const guided=()=>Number(s.day)<INTRO_DAYS&&!alphabetReady();
  const day=()=>Number(s.day)||0;
  const letters=()=>guided()?(D[day()]?.[3]||[]).map(c=>String(c?.[0]||'')[0]).filter(Boolean):[];
  function store(){
    if(!s.guidedAlphabet||typeof s.guidedAlphabet!=='object')s.guidedAlphabet={version:VERSION,days:{}};
    s.guidedAlphabet.version=VERSION;s.guidedAlphabet.days=s.guidedAlphabet.days||{};
    const k=String(day());
    if(!s.guidedAlphabet.days[k])s.guidedAlphabet.days[k]={index:0,stage:'welcome',done:[]};
    return s.guidedAlphabet.days[k];
  }
  function persist(){try{save()}catch(_){} }
  function current(){const ls=letters(),st=store();st.index=Math.max(0,Math.min(st.index||0,Math.max(0,ls.length-1)));return ls[st.index]||ls[0]||'А'}
  function info(letter){return INFO[letter]||{small:letter.toLowerCase(),word:letter,de:'',icon:'🌱',sound:'Hör dir das Beispiel an',steps:['Fahre die helle Vorlage langsam nach']}}
  function shuffledChoices(values,seed){const a=[...values];for(let i=a.length-1;i>0;i--){const j=(seed+i*7)%(i+1);[a[i],a[j]]=[a[j],a[i]]}return a}
  function letterChoices(letter){const ls=letters();return shuffledChoices([letter,...ls.filter(x=>x!==letter),...ORDER.filter(x=>!ls.includes(x))].slice(0,3),store().index+3)}
  function pictureChoices(letter){const ls=letters();return shuffledChoices([letter,...ls.filter(x=>x!==letter),...ORDER.filter(x=>INFO[x]&&x!==letter&&!ls.includes(x))].slice(0,3),store().index+5)}
  function speakWord(letter,button){
    const row=info(letter),meta=window.UKRAINIAN_PRONUNCIATION_META?.[letter],src=window.UKRAINIAN_PRONUNCIATION_AUDIO?.[letter];
    if(src&&meta?.label===row.word){const a=new Audio(src);button?.classList.add('is-playing');a.onended=()=>button?.classList.remove('is-playing');a.onerror=()=>button?.classList.remove('is-playing');a.play().catch(()=>button?.classList.remove('is-playing'));return true}
    if(!('speechSynthesis'in window)||!window.SpeechSynthesisUtterance)return false;
    const voice=speechSynthesis.getVoices().find(v=>String(v.lang||'').toLowerCase().startsWith('uk'));
    if(!voice)return false;
    const u=new SpeechSynthesisUtterance(row.word);u.lang=voice.lang;u.voice=voice;u.rate=.72;
    u.onstart=()=>button?.classList.add('is-playing');u.onend=()=>button?.classList.remove('is-playing');u.onerror=()=>button?.classList.remove('is-playing');
    speechSynthesis.cancel();speechSynthesis.speak(u);return true;
  }
  function markLegacyLetter(){
    const st=store(),di=day(),ci=st.index;
    try{const k=id(di,ci);if(!s.known[k])s.known[k]=typeof freshMeta==='function'?freshMeta():{seen:1}}catch(_){}
    persist();
  }
  function finishDay(){
    const di=day();
    try{s.simpleFoundation=s.simpleFoundation||{};s.simpleFoundation.writing=s.simpleFoundation.writing||{};s.simpleFoundation.writing[di]=true}catch(_){}
    try{const p=lessonState(di);p.testPassed=true;p.reviewDone=true;if(typeof syncLesson==='function')syncLesson(di)}catch(_){}
    persist();
  }
  function nextStage(stage){store().stage=stage;persist();render()}
  function nextLetter(){
    const st=store(),ls=letters();markLegacyLetter();st.done=Array.from(new Set([...(st.done||[]),current()]));
    if(st.index<ls.length-1){st.index++;st.stage='look';persist();render()}else{st.stage='complete';finishDay();persist();render()}
  }
  function feedback(text,ok=true){const el=document.getElementById('guidedFeedback');if(!el)return;el.textContent=text;el.className='guided-feedback '+(ok?'ok':'try')}
  function primary(label,fn){const b=document.createElement('button');b.className='guided-primary';b.textContent=label;b.onclick=fn;return b}
  function shell(title,eyebrow){
    const root=document.getElementById('guidedAlphabetStart');root.innerHTML='';
    const progress=document.createElement('div');progress.className='guided-top';
    const st=store(),ls=letters();progress.innerHTML='<span class="guided-backmark">🌱</span><div class="guided-mini-progress"><i style="width:'+(((st.index+(st.stage==='reward'||st.stage==='complete'?1:0))/Math.max(1,ls.length))*100)+'%"></i></div><span class="guided-count">'+Math.min(st.index+1,ls.length)+' / '+ls.length+'</span>';
    const card=document.createElement('section');card.className='guided-card';card.innerHTML='<div class="guided-eyebrow">'+eyebrow+'</div><h2>'+title+'</h2>';
    root.append(progress,card);return card;
  }
  function renderWelcome(){
    const l=current(),x=info(l),card=shell(day()===0?'Dein erster Buchstabe':'Dein nächster Buchstabe','Wir starten ganz einfach');
    card.innerHTML+='<div class="guided-hero-letter">'+l+'</div><div class="guided-small-letter">klein: <b>'+x.small+'</b></div><p class="guided-lead">Ich zeige dir alles Schritt für Schritt.</p>';
    card.append(primary('Los geht’s',()=>nextStage('look')));
  }
  function renderLook(){
    const l=current(),x=info(l),card=shell('Schau mal','1 · Anschauen');
    card.innerHTML+='<div class="guided-picture">'+x.icon+'</div><div class="guided-pair">'+l+' <span>'+x.small+'</span></div><div class="guided-word"><b>'+x.word+'</b><span>'+x.de+'</span></div><p class="guided-lead">Merke dir nur das Bild und die Form.</p>';
    card.append(primary('Weiter',()=>nextStage('listen')));
  }
  function renderListen(){
    const l=current(),x=info(l),card=shell('Hör mal','2 · Anhören');
    card.innerHTML+='<div class="guided-picture smallpic">'+x.icon+'</div><div class="guided-word big"><b>'+x.word+'</b><span>'+x.de+'</span></div><div class="guided-soundhint">'+x.sound+'</div>';
    const audio=primary('🔊 Wort anhören',()=>{if(!speakWord(l,audio)){audio.textContent='Audio hier nicht verfügbar';audio.disabled=true;setTimeout(()=>{audio.disabled=false;audio.textContent='Weiter ohne Audio'},600)}});card.append(audio);
    const skip=document.createElement('button');skip.className='guided-secondary';skip.textContent='Weiter';skip.onclick=()=>nextStage('trace');card.append(skip);
  }
  function setupCanvas(){
    const canvas=document.getElementById('guidedCanvas'),ctx=canvas.getContext('2d');let drawing=false,moves=0;
    const fit=()=>{const r=canvas.getBoundingClientRect(),dpr=Math.max(1,window.devicePixelRatio||1);canvas.width=Math.round(r.width*dpr);canvas.height=Math.round(r.height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);ctx.lineWidth=10;ctx.lineCap='round';ctx.lineJoin='round';ctx.strokeStyle='#2f7d57'};fit();
    const pos=e=>{const r=canvas.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}};
    canvas.addEventListener('pointerdown',e=>{e.preventDefault();drawing=true;const p=pos(e);ctx.beginPath();ctx.moveTo(p.x,p.y)});
    canvas.addEventListener('pointermove',e=>{if(!drawing)return;e.preventDefault();const p=pos(e);ctx.lineTo(p.x,p.y);ctx.stroke();moves++;if(moves>8)document.getElementById('guidedTraceDone').disabled=false});
    const end=e=>{if(drawing)e.preventDefault();drawing=false};canvas.addEventListener('pointerup',end);canvas.addEventListener('pointercancel',end);
    document.getElementById('guidedClear').onclick=()=>{ctx.clearRect(0,0,canvas.width,canvas.height);moves=0;document.getElementById('guidedTraceDone').disabled=true};
  }
  function renderTrace(){
    const l=current(),x=info(l),card=shell('Male '+l+' nach','3 · Nachmalen');
    card.innerHTML+='<p class="guided-lead">Fahre die helle Vorlage mit dem Finger oder der Maus nach.</p><div class="guided-trace"><div class="guided-trace-letter">'+l+'</div><span class="guided-start-dot">●</span><canvas id="guidedCanvas"></canvas></div><div class="guided-drawsteps">'+x.steps.map((t,i)=>'<span><b>'+(i+1)+'</b>'+t+'</span>').join('')+'</div><button class="guided-secondary" id="guidedClear">↻ Nochmal malen</button><button class="guided-primary" id="guidedTraceDone" disabled>Geschafft ✓</button>';
    card.querySelector('#guidedTraceDone').onclick=()=>nextStage('letter');setupCanvas();
  }
  function renderLetterQuiz(){
    const l=current(),card=shell('Wo ist '+l+'?','4 · Finden');
    card.innerHTML+='<p class="guided-lead">Tippe auf den richtigen Buchstaben.</p><div class="guided-choice-grid" id="guidedChoices"></div><div id="guidedFeedback" class="guided-feedback"></div>';
    const grid=card.querySelector('#guidedChoices');letterChoices(l).forEach(choice=>{const b=document.createElement('button');b.className='guided-choice letter';b.textContent=choice;b.onclick=()=>{if(choice===l){b.classList.add('right');feedback('Super! ⭐');setTimeout(()=>nextStage('picture'),350)}else{b.classList.add('wrong');feedback('Fast! Probier noch einmal.',false);setTimeout(()=>b.classList.remove('wrong'),450)}};grid.append(b)});
  }
  function renderPictureQuiz(){
    const l=current(),x=info(l),card=shell('Welches Bild gehört zu '+l+'?','5 · Bild finden');
    card.innerHTML+='<p class="guided-lead"><b>'+x.word+'</b> bedeutet <b>'+x.de+'</b>.</p><div class="guided-choice-grid pictures" id="guidedChoices"></div><div id="guidedFeedback" class="guided-feedback"></div>';
    const grid=card.querySelector('#guidedChoices');pictureChoices(l).forEach(choice=>{const y=info(choice),b=document.createElement('button');b.className='guided-choice picture';b.innerHTML='<span>'+y.icon+'</span><small>'+y.de+'</small>';b.onclick=()=>{if(choice===l){b.classList.add('right');feedback('Richtig! ⭐');setTimeout(()=>nextStage('reward'),350)}else{b.classList.add('wrong');feedback('Fast! Schau auf das Wort.',false);setTimeout(()=>b.classList.remove('wrong'),450)}};grid.append(b)});
  }
  function renderReward(){
    const l=current(),x=info(l),card=shell('Super gemacht!','⭐ Geschafft');
    card.innerHTML+='<div class="guided-celebrate">⭐</div><div class="guided-pair reward">'+l+' <span>'+x.small+'</span></div><p class="guided-lead">Du kennst jetzt <b>'+l+'</b>.</p>';
    card.append(primary(store().index>=letters().length-1?'Fertig':'Nächster Buchstabe',nextLetter));
  }
  function renderComplete(){
    const ls=letters(),card=shell('Geschafft! 🎉','Heute fertig');
    card.innerHTML+='<div class="guided-celebrate">🌟</div><p class="guided-lead">Diese Buchstaben hast du heute kennengelernt:</p><div class="guided-doneletters">'+ls.map(l=>'<span>'+l+'</span>').join('')+'</div><div class="guided-picture-row">'+ls.map(l=>'<span title="'+info(l).de+'">'+info(l).icon+'</span>').join('')+'</div>';
    const allowed=!!window.UKRAINIAN_LEARNING_STATE_GUARD?.alphabetDayAllowed?.(day()+1);
    if(allowed)card.append(primary('Weiterlernen',()=>{try{advanceLesson()}catch(_){};setTimeout(()=>mount(true),0)}));else{const done=document.createElement('div');done.className='guided-finish-note';done.textContent='Für heute ist alles geschafft. Morgen geht es weiter.';card.append(done)}
  }
  function render(){
    if(!guided()){cleanup();return}
    const st=store();if(!STAGES.includes(st.stage)&&st.stage!=='welcome'&&st.stage!=='complete')st.stage='welcome';
    if(st.stage==='welcome')renderWelcome();else if(st.stage==='look')renderLook();else if(st.stage==='listen')renderListen();else if(st.stage==='trace')renderTrace();else if(st.stage==='letter')renderLetterQuiz();else if(st.stage==='picture')renderPictureQuiz();else if(st.stage==='reward')renderReward();else renderComplete();
  }
  function cleanup(){document.body.classList.remove('guided-alphabet');document.getElementById('guidedAlphabetStart')?.remove()}
  function mount(){
    if(!guided()){cleanup();return}
    document.body.classList.add('guided-alphabet');
    try{if(typeof show==='function')show('learn')}catch(_){}
    const learn=document.getElementById('learn');if(!learn)return;
    let root=document.getElementById('guidedAlphabetStart');if(!root){root=document.createElement('div');root.id='guidedAlphabetStart';root.className='guided-root';learn.prepend(root)}
    render();
  }
  const css=document.createElement('style');css.id='guidedAlphabetStyles';css.textContent=`
    body.guided-alphabet{background:radial-gradient(circle at 15% 5%,#e5f8df 0 12%,transparent 31%),linear-gradient(180deg,#f5fbf2,#eef8ee 60%,#f8fcf7);color:#244431}
    body.guided-alphabet main{max-width:680px;padding-top:18px}
    body.guided-alphabet main>header,body.guided-alphabet nav,body.guided-alphabet main>section.card,body.guided-alphabet #learn>*:not(#guidedAlphabetStart){display:none!important}
    body.guided-alphabet #learn{display:block!important}
    .guided-root{min-height:calc(100vh - 55px);display:flex;flex-direction:column;justify-content:flex-start;padding:6px 0 28px}
    .guided-top{display:grid;grid-template-columns:38px 1fr auto;gap:11px;align-items:center;margin:4px 3px 15px}.guided-backmark{width:38px;height:38px;display:grid;place-items:center;border-radius:50%;background:#fff;box-shadow:0 6px 18px #315d3c14}.guided-mini-progress{height:11px;border-radius:99px;background:#dfeee0;overflow:hidden}.guided-mini-progress i{display:block;height:100%;background:linear-gradient(90deg,#58a969,#77c874);border-radius:inherit;transition:width .3s}.guided-count{font-size:.82rem;font-weight:900;color:#5d7966}
    .guided-card{background:#fff;border:1px solid #dcebdc;border-radius:28px;padding:28px 24px;box-shadow:0 18px 50px #28563813;text-align:center}.guided-eyebrow{font-size:.78rem;font-weight:900;letter-spacing:.08em;text-transform:uppercase;color:#5a9e67}.guided-card h2{font-size:clamp(1.65rem,6vw,2.35rem);color:#244c32;margin:6px 0 12px}.guided-lead{font-size:1.02rem;color:#607468;margin:12px auto 20px;max-width:430px}.guided-hero-letter{font-size:clamp(7rem,28vw,11rem);font-weight:900;line-height:.92;color:#3f9156;margin:24px 0 4px;text-shadow:0 8px 0 #e2f2e4}.guided-small-letter{font-size:1.05rem;color:#6d8174}.guided-small-letter b{font-size:1.55rem;color:#3e6d4c}.guided-picture{font-size:clamp(6rem,24vw,9rem);line-height:1.1;margin:15px 0}.guided-picture.smallpic{font-size:6rem}.guided-pair{font-size:4rem;font-weight:950;line-height:1;color:#2f7d49}.guided-pair span{font-size:.62em;color:#65a675}.guided-word{margin:16px auto 8px;display:flex;flex-direction:column;gap:3px}.guided-word b{font-size:1.55rem;color:#264e34}.guided-word span{color:#6a7c70}.guided-word.big b{font-size:2rem}.guided-soundhint{display:inline-block;padding:9px 13px;background:#eff8ef;border-radius:14px;color:#4f6f58;margin-bottom:17px}.guided-primary,.guided-secondary{width:100%;border:0;border-radius:16px;padding:15px 18px;font-weight:900;font-size:1.04rem;cursor:pointer}.guided-primary{background:#55a866;color:#fff;box-shadow:0 5px 0 #3e8650;margin-top:10px}.guided-primary:active{transform:translateY(2px);box-shadow:0 3px 0 #3e8650}.guided-primary:disabled{opacity:.42;cursor:not-allowed;box-shadow:none}.guided-secondary{background:#edf7ee;color:#386348;margin-top:10px}.guided-primary.is-playing{background:#3f8f54}.guided-trace{height:310px;max-width:470px;margin:18px auto 12px;position:relative;border:3px dashed #b8ddb9;border-radius:25px;background:#f9fdf8;overflow:hidden}.guided-trace-letter{position:absolute;inset:0;display:grid;place-items:center;font-size:15rem;font-weight:900;color:#dceedd;user-select:none}.guided-start-dot{position:absolute;top:32px;left:50%;transform:translateX(-50%);z-index:1;color:#57aa67;font-size:1.35rem}.guided-trace canvas{position:absolute;inset:0;width:100%;height:100%;touch-action:none}.guided-drawsteps{display:grid;gap:7px;margin:11px auto 15px;max-width:470px;text-align:left}.guided-drawsteps span{display:flex;gap:10px;align-items:center;padding:9px 11px;border-radius:13px;background:#f2f9f2;color:#52695a}.guided-drawsteps b{width:26px;height:26px;display:grid;place-items:center;border-radius:50%;background:#63b372;color:white}.guided-choice-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:11px;margin:22px auto 12px;max-width:500px}.guided-choice{border:2px solid #d8e8d9;background:#fff;border-radius:20px;min-height:118px;cursor:pointer;color:#2e5d3b;transition:.15s}.guided-choice.letter{font-size:3.5rem;font-weight:950}.guided-choice.picture{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px}.guided-choice.picture span{font-size:4rem}.guided-choice.picture small{font-weight:800;color:#688071}.guided-choice.right{background:#e6f7e8;border-color:#5eb66c;transform:scale(1.02)}.guided-choice.wrong{background:#fff5e9;border-color:#e9b35f}.guided-feedback{min-height:30px;font-weight:900}.guided-feedback.ok{color:#31834a}.guided-feedback.try{color:#9a6a25}.guided-celebrate{font-size:6rem;animation:guidedPop .45s ease}.guided-pair.reward{margin:8px 0 18px}.guided-doneletters{display:flex;justify-content:center;gap:12px;flex-wrap:wrap;margin:20px 0}.guided-doneletters span{width:78px;height:78px;display:grid;place-items:center;border-radius:20px;background:#edf8ee;color:#2f7d49;font-size:2.7rem;font-weight:950}.guided-picture-row{display:flex;justify-content:center;gap:17px;font-size:2.7rem;margin:8px 0 18px}.guided-finish-note{margin-top:18px;padding:14px;border-radius:16px;background:#eff8ef;color:#55715d;font-weight:800}@keyframes guidedPop{0%{transform:scale(.55);opacity:.2}70%{transform:scale(1.12)}100%{transform:scale(1);opacity:1}}
    @media(max-width:560px){body.guided-alphabet main{padding:12px 12px 24px}.guided-card{padding:23px 17px;border-radius:24px}.guided-root{min-height:calc(100vh - 30px)}.guided-choice-grid{gap:8px}.guided-choice{min-height:103px}.guided-choice.picture span{font-size:3.35rem}.guided-trace{height:270px}.guided-trace-letter{font-size:12rem}.guided-drawsteps span{font-size:.9rem}}
  `;document.head.append(css);
  const baseRender=typeof render==='function'?render:null;if(baseRender){render=function(){const out=baseRender.apply(this,arguments);setTimeout(mount,0);return out}}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
  window.UKRAINIAN_GUIDED_ALPHABET={version:VERSION,oneScreenOneTask:true,pictureLearning:true,tracing:true};
})();