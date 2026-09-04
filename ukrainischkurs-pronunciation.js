/* Ukrainischkurs für Joel · Aussprache-Coach v1
   Ziel: aktives Hören + Produzieren + A/B-Vergleich + Verständlichkeitscheck.
   Keine Scheingenauigkeit: Browser-Spracherkennung wird nur als Verständlichkeitsindikator genutzt. */
(() => {
  const VERSION = 1;
  const INFO = {
    'А':{ipa:'/ɑ/',drill:'а',sample:'мама',cue:'Mund offen, Zunge tief. Kein deutsches langes „a“ ziehen.',mistake:'Nicht zu geschlossen oder zu lang sprechen.'},
    'Б':{ipa:'/b/',drill:'ба',sample:'банк',cue:'Beide Lippen kurz schließen und stimmhaft öffnen.',mistake:'Nicht wie deutsches „p“ verhärten.'},
    'В':{ipa:'/ʋ ~ w/',drill:'ва',sample:'вода',cue:'Sehr weich zwischen deutschem W und englischem w. Unterlippe nicht fest an die Zähne pressen.',mistake:'Nicht automatisch wie deutsches „w“ sprechen.',contrast:'Б'},
    'Г':{ipa:'/ɦ/',drill:'га',sample:'гора',cue:'Stimmhaftes, weiches H aus dem Hals. Die Stimmbänder schwingen.',mistake:'Nicht wie deutsches G sprechen.',contrast:'Ґ'},
    'Ґ':{ipa:'/ɡ/',drill:'ґа',sample:'ґанок',cue:'Klares stimmhaftes G wie in „Garten“.',mistake:'Nicht mit Г verwechseln.',contrast:'Г'},
    'Д':{ipa:'/d/',drill:'да',sample:'дім',cue:'Zungenspitze kurz an den Zahndamm, dann lösen.',mistake:'Nicht unnötig hart ausstoßen.'},
    'Е':{ipa:'/ɛ/',drill:'е',sample:'екран',cue:'Offenes E ähnlich wie in „Bett“.',mistake:'Nicht zu einem deutschen langen „ee“ machen.',contrast:'Є'},
    'Є':{ipa:'/jɛ/',drill:'є',sample:'єнот',cue:'Am Wortanfang mit einem kurzen J-Gleitlaut beginnen: j + offenes e.',mistake:'Nicht einfach nur E sprechen.',contrast:'Е'},
    'Ж':{ipa:'/ʒ/',drill:'жа',sample:'жук',cue:'Stimmhaftes „sch“: gleiche Mundstellung wie Ш, aber mit vibrierender Stimme.',mistake:'Nicht stimmlos wie deutsches „sch“.',contrast:'Ш'},
    'З':{ipa:'/z/',drill:'за',sample:'зуб',cue:'Stimmhaftes S wie in „Rose“; Stimme muss hörbar mitschwingen.',mistake:'Nicht stimmlos wie С.',contrast:'С'},
    'И':{ipa:'/ɪ/',drill:'би',sample:'син',cue:'Kurzes, offeneres I. Entspannt sprechen, nicht so gespannt wie І.',mistake:'Nicht mit dem klaren І verschmelzen.',contrast:'І'},
    'І':{ipa:'/i/',drill:'бі',sample:'ім’я',cue:'Klares, gespanntes I wie in „Igel“ bzw. „Idee“.',mistake:'Nicht zu offen wie И.',contrast:'И'},
    'Ї':{ipa:'/ji/',drill:'ї',sample:'їжа',cue:'Am Anfang deutlich J + I verbinden.',mistake:'Das J nicht verschlucken.',contrast:'І'},
    'Й':{ipa:'/j/',drill:'ай',sample:'йогурт',cue:'Kurzer Gleitlaut wie deutsches J in „ja“.',mistake:'Nicht als eigenen langen Vokal sprechen.',contrast:'Ї'},
    'К':{ipa:'/k/',drill:'ка',sample:'кіт',cue:'Klarer K-Laut hinten im Mund.',mistake:'Nicht zusätzlich ein hörbares H anhängen.'},
    'Л':{ipa:'/l/',drill:'ла',sample:'лампа',cue:'Zungenspitze an den Zahndamm; Luft seitlich vorbeiführen.',mistake:'Nicht verschlucken.'},
    'М':{ipa:'/m/',drill:'ма',sample:'мама',cue:'Lippen schließen, Stimme durch die Nase tragen.',mistake:'Nicht zu kurz abschneiden.'},
    'Н':{ipa:'/n/',drill:'на',sample:'ніс',cue:'Zungenspitze an den Zahndamm, Luft durch die Nase.',mistake:'Das kyrillische Н nie als H lesen.'},
    'О':{ipa:'/ɔ/',drill:'о',sample:'око',cue:'Runder, relativ offener O-Laut.',mistake:'Nicht zu „ou“ diphthongieren.'},
    'П':{ipa:'/p/',drill:'па',sample:'парк',cue:'Lippen schließen und stimmlos öffnen.',mistake:'Nicht unnötig stark behauchen.'},
    'Р':{ipa:'/r/',drill:'ра',sample:'рука',cue:'Zungenspitze locker am Zahndamm vibrieren lassen. Ein kurzer Tap ist anfangs besser als deutsches R.',mistake:'Nicht dauerhaft auf deutsches Hals-R ausweichen.'},
    'С':{ipa:'/s/',drill:'са',sample:'сир',cue:'Stimmloses scharfes S; keine Stimmvibration.',mistake:'Nicht stimmhaft wie З.',contrast:'З'},
    'Т':{ipa:'/t/',drill:'та',sample:'так',cue:'Zungenspitze kurz an den Zahndamm, stimmlos lösen.',mistake:'Nicht übermäßig behauchen.'},
    'У':{ipa:'/u/',drill:'у',sample:'урок',cue:'Lippen runden, klares U ohne Gleitlaut.',mistake:'Nicht „u-o“ daraus machen.'},
    'Ф':{ipa:'/f/',drill:'фа',sample:'фото',cue:'Unterlippe leicht an die oberen Schneidezähne, Luft hindurch.',mistake:'Nicht stimmhaft werden.'},
    'Х':{ipa:'/x/',drill:'ха',sample:'хата',cue:'Reibelaut hinten im Mund wie deutsches „ch“ in „Bach“.',mistake:'Nicht wie K oder H sprechen.'},
    'Ц':{ipa:'/t͡s/',drill:'ца',sample:'це',cue:'T und S als eine einzige schnelle Einheit sprechen.',mistake:'Nicht „t-s“ mit Pause trennen.',contrast:'Ч'},
    'Ч':{ipa:'/t͡ʃ/',drill:'ча',sample:'чай',cue:'Ein kompakter „tsch“-Laut.',mistake:'Nicht zu Ш vereinfachen.',contrast:'Ц'},
    'Ш':{ipa:'/ʃ/',drill:'ша',sample:'школа',cue:'Stimmloses „sch“, Lippen leicht runden.',mistake:'Nicht stimmhaft wie Ж und nicht Щ verkürzen.',contrast:'Щ'},
    'Щ':{ipa:'/ʃt͡ʃ/',drill:'ща',sample:'щука',cue:'Zwei Teile eng verbinden: sch + tsch, ohne Pause.',mistake:'Nicht nur wie deutsches „sch“ sprechen.',contrast:'Ш'},
    'Ь':{ipa:'kein eigener Laut',drill:'нь',sample:'кінь',cue:'Ь wird nicht selbst gesprochen. Es macht den Konsonanten davor weich; achte im Beispiel auf das weiche Н.',mistake:'Kein eigenes „j“ oder „i“ anhängen.'},
    'Ю':{ipa:'/ju/ am Wortanfang',drill:'ю',sample:'юнак',cue:'Am Wortanfang J + U flüssig verbinden.',mistake:'Nicht nur U sprechen.'},
    'Я':{ipa:'/jɑ/ am Wortanfang',drill:'я',sample:'яма',cue:'Am Wortanfang J + A flüssig verbinden.',mistake:'Nicht nur A sprechen.'}
  };

  function ensureState(){
    if(!s.pronunciation || typeof s.pronunciation!=='object') s.pronunciation={};
    s.pronunciation.version=VERSION;
    s.pronunciation.letters=s.pronunciation.letters||{};
    if(!s.pronunciation.daily || s.pronunciation.daily.date!==date()){
      s.pronunciation.daily={date:date(),reference:[],recorded:false,replayed:false,selfPassed:false,manual:false,checked:false,checkPassed:false,contrastCorrect:0,contrastTotal:0};
    }
    return s.pronunciation.daily;
  }

  function todayLetters(){
    if(s.day<11){
      const day=D[s.day];
      return (day?.[3]||[]).map(c=>c?.[0]?.[0]).filter(x=>INFO[x]);
    }
    if(s.day===11)return ['Г','Ґ','И','І'];
    if(s.day===12)return ['Ж','Ш','Щ','Х'];
    if(s.day===13){
      const fallback=['В','Г','Ґ','И','І','Ї','Р','Х','Ж','Ш','Щ','Ц','Ч'];
      return fallback.sort((a,b)=>{const A=s.pronunciation?.letters?.[a]||{},B=s.pronunciation?.letters?.[b]||{};return ((A.recordings||0)+(A.checks||0)+(A.plays||0))-((B.recordings||0)+(B.checks||0)+(B.plays||0))}).slice(0,4);
    }
    return [];
  }

  function activeLetter(){const letters=todayLetters();return letters[0] || 'Г'}

  function noteReference(letter){
    const d=ensureState();
    if(!d.reference.includes(letter))d.reference.push(letter);
    const m=s.pronunciation.letters[letter]||(s.pronunciation.letters[letter]={plays:0,recordings:0,checks:0,last:''});
    m.plays++;m.last=date();save();renderPronunciation();
  }

  function ukrainianVoice(){return ('speechSynthesis'in window)&&speechSynthesis.getVoices().find(v=>v.lang&&v.lang.toLowerCase().startsWith('uk'))}

  function sayReference(letter, slow=false){
    const info=INFO[letter]; if(!info)return;
    const v=ukrainianVoice();
    if(!('speechSynthesis'in window)||!window.SpeechSynthesisUtterance){toast('Auf diesem Gerät ist keine Sprachausgabe verfügbar.');return}
    const u=new SpeechSynthesisUtterance(info.drill);u.lang=v?v.lang:'uk-UA';if(v)u.voice=v;u.rate=slow?.55:.78;u.pitch=1;
    speechSynthesis.cancel();speechSynthesis.resume();speechSynthesis.speak(u);noteReference(letter);markListened();
  }

  let localRec={media:null,stream:null,chunks:[],url:'',started:0};
  async function recordStart(){
    const state=document.getElementById('pronRecordState');
    if(!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder){state.textContent='Keine lokale Aufnahme verfügbar. Nutze den Fallback nach dem Hören der Referenzen.';return}
    try{
      localRec.stream=await navigator.mediaDevices.getUserMedia({audio:true});localRec.chunks=[];localRec.started=Date.now();localRec.media=new MediaRecorder(localRec.stream);
      localRec.media.ondataavailable=e=>{if(e.data?.size)localRec.chunks.push(e.data)};
      localRec.media.onstop=()=>{
        const blob=new Blob(localRec.chunks,{type:localRec.media.mimeType||'audio/webm'});if(localRec.url)URL.revokeObjectURL(localRec.url);localRec.url=URL.createObjectURL(blob);
        localRec.stream?.getTracks().forEach(t=>t.stop());
        const d=ensureState();d.recorded=true;d.replayed=false;d.selfPassed=false;todayLetters().forEach(letter=>{const m=s.pronunciation.letters[letter]||(s.pronunciation.letters[letter]={plays:0,recordings:0,checks:0,last:''});m.recordings++;m.last=date()});
        save();renderPronunciation();
      };
      localRec.media.start();state.textContent='Aufnahme läuft: sprich die heutigen Übungssilben nacheinander.';document.getElementById('pronRecordStart').hidden=true;document.getElementById('pronRecordStop').hidden=false;
    }catch{state.textContent='Mikrofon nicht verfügbar oder nicht erlaubt. Nutze nach dem Hören der Referenzen den Fallback.'}
  }
  function recordStop(){if(localRec.media&&localRec.media.state!=='inactive')localRec.media.stop();const a=document.getElementById('pronRecordStart'),b=document.getElementById('pronRecordStop');if(a)a.hidden=false;if(b)b.hidden=true}

  function recognitionCtor(){return window.SpeechRecognition||window.webkitSpeechRecognition}
  function intelligibilityCheck(){
    const Ctor=recognitionCtor(),state=document.getElementById('pronCheckState'),letters=todayLetters();
    if(!Ctor){state.textContent='Automatischer Verständlichkeitscheck ist in diesem Browser nicht verfügbar. Aufnahme + A/B-Vergleich bleiben die Hauptübung.';return}
    const target=letters[Math.floor(Math.random()*letters.length)]||activeLetter(),word=INFO[target].sample,r=new Ctor();r.lang='uk-UA';r.interimResults=false;r.maxAlternatives=5;
    state.textContent='Höre das Beispiel und sprich es direkt danach nach.';
    r.onresult=e=>{
      const alts=[...e.results[0]].map(x=>String(x.transcript||'').toLocaleLowerCase('uk').trim()),wanted=word.toLocaleLowerCase('uk'),ok=alts.some(x=>x===wanted||x.includes(wanted));
      const d=ensureState();d.checked=true;d.checkPassed=ok;const m=s.pronunciation.letters[target]||(s.pronunciation.letters[target]={plays:0,recordings:0,checks:0,last:''});m.checks++;m.last=date();
      state.textContent=ok?'Verständlich erkannt. Das prüft Verständlichkeit, nicht Akzentfreiheit.':'Noch nicht eindeutig erkannt. Höre die Referenz erneut und achte besonders auf den Ziellaut.';save();
    };
    r.onerror=()=>{state.textContent='Der Verständlichkeitscheck konnte nicht ausgeführt werden. Aufnahme + direkter Hörvergleich sind weiterhin verfügbar.'};
    try{
      const v=ukrainianVoice();
      if(!('speechSynthesis'in window)||!window.SpeechSynthesisUtterance){r.start();return}
      const u=new SpeechSynthesisUtterance(word);u.lang=v?v.lang:'uk-UA';if(v)u.voice=v;u.rate=.74;u.onend=()=>{try{r.start()}catch{state.textContent='Der Verständlichkeitscheck ist gerade nicht verfügbar.'}};speechSynthesis.cancel();speechSynthesis.speak(u);
    }catch{state.textContent='Der Verständlichkeitscheck ist gerade nicht verfügbar.'}
  }

  function startContrast(letter){
    const info=INFO[letter],other=info?.contrast;if(!other||!INFO[other]){toast('Für diesen Laut ist heute kein spezielles Kontrastpaar nötig.');return}
    const target=Math.random()<.5?letter:other,box=document.getElementById('pronContrast');box.dataset.answer=target;box.innerHTML='<div class="small">Welchen Ziellaut hörst du?</div><div class="actions"><button class="secondary" data-pron-answer="'+letter+'">'+letter+' · '+INFO[letter].ipa+'</button><button class="secondary" data-pron-answer="'+other+'">'+other+' · '+INFO[other].ipa+'</button></div><div id="pronContrastResult" class="small"></div>';
    box.querySelectorAll('[data-pron-answer]').forEach(b=>b.onclick=()=>{
      const good=b.dataset.pronAnswer===box.dataset.answer,d=ensureState();d.contrastTotal++;if(good)d.contrastCorrect++;
      document.getElementById('pronContrastResult').textContent=good?'Richtig erkannt.':'Noch einmal hören: Das war '+box.dataset.answer+'.';save();
    });
    setTimeout(()=>sayReference(target,false),80);
  }

  function manualProduction(){
    const d=ensureState(),letters=todayLetters();
    if(!letters.every(l=>d.reference.includes(l))){toast('Höre zuerst alle heutigen Referenzen.');return}
    d.manual=true;save();renderPronunciation();toast('Lautes Nachsprechen als Fallback gespeichert.');
  }

  function selfRate(good){
    const d=ensureState();d.selfPassed=!!good;save();renderPronunciation();
    toast(good?'A/B-Vergleich gespeichert.':'Höre die Referenzen erneut und nimm noch einmal auf.');
  }

  function practiceReady(){
    const d=ensureState(),letters=todayLetters();
    if(!letters.length)return true;
    const heard=letters.every(l=>d.reference.includes(l));
    const recordedReady=d.recorded&&d.replayed&&d.selfPassed;
    const produced=recordedReady||d.checkPassed||d.manual;
    return heard&&produced;
  }

  function completeSpeaking(){
    if(!practiceReady()){
      renderPronunciation();document.getElementById('pronCoach')?.scrollIntoView({behavior:'smooth',block:'center'});toast('Für Aussprache zählen jetzt Hören + eigenes Produzieren + Vergleich.');return;
    }
    ensureDaily();s.daily.spoken=true;lessonState(s.day).spoken=true;syncLesson(s.day);study();save();render();toast('Aussprachetraining für heute vollständig.');
  }

  function renderPronunciation(){
    ensureState();
    let panel=document.getElementById('pronCoach');
    const cards=document.getElementById('cards');if(!cards)return;
    if(!panel){panel=document.createElement('section');panel.id='pronCoach';panel.className='card';cards.parentNode.insertBefore(panel,cards)}
    if(s.day>=14){panel.hidden=true;return}panel.hidden=false;
    const letters=todayLetters(),d=ensureState();
    const rows=letters.map(letter=>{const i=INFO[letter];return '<div class="pron-target"><div class="pron-letter">'+letter+'</div><div><strong>'+i.ipa+' · Übung: '+i.drill+'</strong><div class="small">'+i.cue+'</div><div class="small"><b>Vermeiden:</b> '+i.mistake+'</div></div><div class="pron-buttons"><button class="secondary" data-pron-play="'+letter+'">▶ normal</button><button class="ghost" data-pron-slow="'+letter+'">langsamer</button></div></div>'}).join('');
    const heard=letters.filter(l=>d.reference.includes(l)).length,ready=practiceReady();
    panel.innerHTML='<div class="pron-head"><div><div class="label">Aussprache-Coach · Pflichtteil</div><h2>Hören → Mundstellung → Nachsprechen → Vergleichen</h2></div><div class="pill">'+heard+'/'+letters.length+' gehört</div></div>'+rows+
      '<div class="pron-production"><strong>1. Eigene Stimme aufnehmen</strong><p class="small">Sprich die sichtbaren Übungssilben nacheinander. Danach deine Aufnahme wirklich anhören und mit den Referenzen vergleichen.</p><div class="actions"><button class="primary" id="pronRecordStart">● Aufnahme starten</button><button class="secondary" id="pronRecordStop" hidden>■ Stoppen</button></div><div id="pronRecordState" class="small">'+(d.recorded?'Aufnahme vorhanden – jetzt zurückhören und bewerten.':'Die Aufnahme bleibt lokal auf diesem Gerät und wird nicht hochgeladen.')+'</div><audio id="pronPlayback" controls '+(localRec.url?'':'hidden')+' style="width:100%;margin-top:8px"></audio>'+(d.replayed?'<div class="actions"><button class="secondary" id="pronSelfGood">Klingt nah an der Referenz</button><button class="ghost" id="pronSelfRetry">Noch unsicher</button></div>':'')+'<button class="ghost" id="pronManual">Fallback: 3× laut ohne Aufnahme gesprochen</button></div>'+ 
      '<div class="pron-production"><strong>2. Verständlichkeitscheck</strong><p class="small">Optionaler Browser-Check mit ukrainischer Spracherkennung. Er prüft nur, ob ein Beispielwort verständlich ankommt – nicht, ob dein Akzent perfekt ist.</p><button class="secondary" id="pronCheck">Mikrofon-Check starten</button><div id="pronCheckState" class="small">'+(d.checkPassed?'✓ Heute mindestens einmal verständlich erkannt.':'')+'</div></div>'+ 
      (letters.some(l=>INFO[l].contrast)?'<div class="pron-production"><strong>3. Schwierige Laute auseinanderhalten</strong><p class="small">Höre eine Übung ohne mitzulesen und entscheide, welcher Ziellaut enthalten ist.</p><button class="secondary" id="pronContrastStart">Kontrast hören</button><div id="pronContrast"></div></div>':'')+
      '<div class="tip">'+(ready?'Aussprache-Pflichtteil erfüllt. Du kannst „Heute laut nachgesprochen“ abschließen.':'Noch offen: alle Referenzen hören und danach entweder Aufnahme + Rückhören + Selbstvergleich, einen bestandenen Verständlichkeitscheck oder den Fallback für Geräte ohne Mikro nutzen.')+'</div>';
    panel.querySelectorAll('[data-pron-play]').forEach(b=>b.onclick=()=>sayReference(b.dataset.pronPlay,false));
    panel.querySelectorAll('[data-pron-slow]').forEach(b=>b.onclick=()=>sayReference(b.dataset.pronSlow,true));
    document.getElementById('pronRecordStart').onclick=recordStart;document.getElementById('pronRecordStop').onclick=recordStop;document.getElementById('pronCheck').onclick=intelligibilityCheck;document.getElementById('pronManual').onclick=manualProduction;
    const playback=document.getElementById('pronPlayback');if(localRec.url){playback.src=localRec.url;playback.onplay=()=>{const state=ensureState();if(!state.replayed){state.replayed=true;save();renderPronunciation()}}}
    const good=document.getElementById('pronSelfGood'),retry=document.getElementById('pronSelfRetry');if(good)good.onclick=()=>selfRate(true);if(retry)retry.onclick=()=>selfRate(false);
    const contrast=document.getElementById('pronContrastStart');if(contrast)contrast.onclick=()=>{const l=letters.find(x=>INFO[x].contrast)||letters[0];startContrast(l)};
    document.querySelectorAll('[data-letter-card]').forEach(card=>{
      const letter=card.querySelector('.uk')?.textContent?.trim()?.[0];if(!INFO[letter])return;
      const sound=card.querySelector('.sound');if(sound){sound.setAttribute('aria-label','Ausspracheübung '+INFO[letter].drill+' anhören');sound.onclick=e=>{e.stopPropagation();sayReference(letter,false)}}
      card.onclick=e=>{if(!e.target.closest('.know,.sound'))sayReference(letter,false)};
    });
  }

  const css=document.createElement('style');css.textContent='.pron-head{display:flex;gap:12px;justify-content:space-between;align-items:flex-start}.pron-target{display:grid;grid-template-columns:58px 1fr auto;gap:11px;align-items:center;padding:12px 0;border-top:1px solid var(--l)}.pron-target:first-of-type{border-top:0}.pron-letter{font-size:2.25rem;font-weight:850;color:var(--d);text-align:center}.pron-buttons{display:flex;gap:5px;flex-direction:column}.pron-production{margin-top:14px;padding:13px;border-radius:14px;background:#f4f8fc}.pron-production p{margin:4px 0 9px}.pron-production .small{margin-top:7px}@media(max-width:560px){.pron-head{align-items:center}.pron-target{grid-template-columns:48px 1fr}.pron-buttons{grid-column:1/-1;flex-direction:row}.pron-buttons button{flex:1}}';document.head.append(css);

  const previousRender=render;
  render=function(){previousRender();renderPronunciation()};
  $('markSpoken').onclick=completeSpeaking;
  renderPronunciation();
})();
