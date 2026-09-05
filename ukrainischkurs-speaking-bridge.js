/* Ukrainischkurs für Joel · Speaking Bridge v1
   Ganze bekannte Sätze aktiv sprechen: Referenz hören -> aufnehmen -> eigene Aufnahme
   rückhören -> Referenz erneut hören -> selbst vergleichen. Keine automatische Akzentnote. */
(()=>{
  const VERSION=1;
  const start=D.length;
  const LESSONS=[
    ['Sprechen: wichtige Hilfe-Sätze','Nicht nur Wörter korrekt lesen, sondern einen ganzen Satz flüssig produzieren.','Sprich in Sinnblöcken. Die Aufnahme dient deinem A/B-Vergleich; die App behauptet nicht, Akzentqualität automatisch messen zu können.',[
      ['Я не розумію','Ich verstehe nicht','ja ne ro-su-mi-ju'],
      ['Мені потрібна допомога','Ich brauche Hilfe','me-ni po-trib-na do-po-mo-ha'],
      ['Де зупинка?','Wo ist die Haltestelle?','de su-pyn-ka'],
      ['Скільки це коштує?','Wie viel kostet das?','skil-ky ze kosch-tu-je']
    ]],
    ['Sprechen: Ort, Richtung, Genitiv','Kasusformen müssen beim Sprechen ohne lange Denkpause zusammenbleiben.','Höre besonders auf die Wortenden: магазині / магазин und немає води.',[
      ['Я йду в магазин','Ich gehe ins Geschäft','ja jdu w ma-ha-syn'],
      ['Я в магазині','Ich bin im Geschäft','ja w ma-ha-sy-ni'],
      ['У мене немає води','Ich habe kein Wasser','u me-ne ne-ma-je wo-dy'],
      ['Я з Німеччини','Ich komme aus Deutschland','ja s ni-met-tschy-ny']
    ]],
    ['Sprechen: gestern und morgen','Zeitformen jetzt als ganze Äußerungen sprechen.','Achte darauf, dass Zeitwort und Verbform als eine Aussage klingen, nicht wie einzeln abgelesene Karten.',[
      ['Вчора я був у готелі','Gestern war ich im Hotel (Mann)','wtscho-ra ja buw u ho-te-li'],
      ['Завтра я буду працювати','Morgen werde ich arbeiten','saw-tra ja bu-du pra-zju-wa-ty'],
      ['Що ти будеш робити завтра?','Was wirst du morgen machen?','schtscho ty bu-desch ro-by-ty saw-tra'],
      ['Я буду жити в Києві','Ich werde in Kyjiw wohnen','ja bu-du schy-ty w ky-je-wi']
    ]]
  ];
  const TARGETS={};
  LESSONS.forEach((lesson,offset)=>TARGETS[start+offset]=lesson[3].map(x=>x[0]));
  LESSONS.forEach(x=>D.push(x));
  const reviews=[...new Set([...WEEKLY_REVIEW_DAYS.map(Number).filter(d=>d<start),start-1,D.length-1])].sort((a,b)=>a-b);
  WEEKLY_REVIEW_DAYS.splice(0,WEEKLY_REVIEW_DAYS.length,...reviews);

  function ensure(){
    if(!s.speakingBridge||typeof s.speakingBridge!=='object')s.speakingBridge={version:VERSION,start,days:{}};
    s.speakingBridge.version=VERSION;s.speakingBridge.start=start;s.speakingBridge.days=s.speakingBridge.days||{};
    return s.speakingBridge;
  }
  function dayState(){
    const root=ensure(),key=String(s.day),today=date();
    let st=root.days[key];
    if(!st||st.date!==today)st=root.days[key]={date:today,completed:[],fallback:[],attempts:0};
    st.completed=Array.isArray(st.completed)?st.completed:[];st.fallback=Array.isArray(st.fallback)?st.fallback:[];
    return st;
  }
  function required(){return Array.isArray(TARGETS[Number(s.day)])}
  function allDone(){const list=TARGETS[Number(s.day)]||[],st=dayState();return list.length>0&&list.every(x=>st.completed.includes(x))}
  let session={phrase:'',heardBefore:0,heardAfter:0,recorded:false,replayed:false,manualSpoken:false};
  let rec={media:null,stream:null,chunks:[],url:''};
  function resetPhrase(phrase){
    if(rec.url){URL.revokeObjectURL(rec.url);rec.url=''}
    rec.media=null;rec.stream?.getTracks?.().forEach(t=>t.stop());rec.stream=null;rec.chunks=[];
    session={phrase,heardBefore:0,heardAfter:0,recorded:false,replayed:false,manualSpoken:false};
  }
  function currentPhrase(){
    const list=TARGETS[Number(s.day)]||[],st=dayState();
    return list.find(x=>!st.completed.includes(x))||list[0]||'';
  }
  function listenReference(after=false,button){
    const phrase=session.phrase||currentPhrase();if(!phrase)return;
    speak(phrase,button);markListened();
    if(after)session.heardAfter++;else session.heardBefore++;
    renderBox();
  }
  function micAvailable(){return !!(navigator.mediaDevices?.getUserMedia&&window.MediaRecorder)}
  async function recordStart(){
    const phrase=session.phrase||currentPhrase();if(!phrase)return;
    if(!micAvailable()){toast('Lokale Aufnahme ist auf diesem Gerät nicht verfügbar. Nutze den transparenten Sprech-Fallback.');renderBox();return}
    try{
      if(rec.url){URL.revokeObjectURL(rec.url);rec.url=''}
      rec.stream=await navigator.mediaDevices.getUserMedia({audio:true});rec.chunks=[];rec.media=new MediaRecorder(rec.stream);
      rec.media.ondataavailable=e=>{if(e.data?.size)rec.chunks.push(e.data)};
      rec.media.onstop=()=>{
        const blob=new Blob(rec.chunks,{type:rec.media.mimeType||'audio/webm'});rec.url=URL.createObjectURL(blob);
        rec.stream?.getTracks().forEach(t=>t.stop());rec.stream=null;session.recorded=true;session.replayed=false;session.heardAfter=0;dayState().attempts++;save();renderBox();
      };
      rec.media.start();renderBox();
    }catch{toast('Mikrofon nicht verfügbar oder nicht erlaubt. Du kannst den transparenten Fallback nutzen.');renderBox()}
  }
  function recordStop(){if(rec.media&&rec.media.state!=='inactive')rec.media.stop()}
  function replay(){
    if(!rec.url)return;const a=new Audio(rec.url);a.onended=()=>{session.replayed=true;renderBox()};a.play().catch(()=>toast('Die lokale Aufnahme konnte nicht abgespielt werden.'));
  }
  function manualSpeak(){session.manualSpoken=true;dayState().attempts++;save();renderBox();toast('Lautes Sprechen markiert. Höre die Referenz jetzt noch einmal zum Vergleich.')}
  function readyToConfirm(){
    if(session.heardBefore<1||session.heardAfter<1)return false;
    return micAvailable()?session.recorded&&session.replayed:session.manualSpoken;
  }
  function confirm(){
    if(!readyToConfirm()){toast('Erst Referenz, eigene Produktion und den zweiten Vergleich vollständig durchführen.');return}
    const st=dayState(),phrase=session.phrase;if(!st.completed.includes(phrase))st.completed.push(phrase);
    if(!micAvailable()&&!st.fallback.includes(phrase))st.fallback.push(phrase);
    save();const next=currentPhrase();resetPhrase(next);toast(allDone()?'Sprechbrücke für heute abgeschlossen.':'Satz bestätigt. Nächster Satz.');render();
  }
  function retry(){resetPhrase(session.phrase||currentPhrase());renderBox();toast('Gut: lieber neu aufnehmen als zu früh bestätigen.')}
  function renderBox(){
    let box=document.getElementById('speakingBridgeBox');if(!required()){if(box)box.hidden=true;return}
    const cards=document.getElementById('cards');if(!cards)return;
    if(!box){box=document.createElement('section');box.id='speakingBridgeBox';box.className='card';cards.insertAdjacentElement('afterend',box)}box.hidden=false;
    const st=dayState(),list=TARGETS[Number(s.day)]||[],phrase=currentPhrase();if(session.phrase!==phrase)resetPhrase(phrase);
    const done=st.completed.length,total=list.length,finished=allDone(),mic=micAvailable(),recording=rec.media?.state==='recording';
    const production=mic
      ?'<button class="'+(session.recorded?'secondary':'primary')+'" id="sbRecord">'+(recording?'⏹ Aufnahme stoppen':session.recorded?'✓ neu aufnehmen':'● Satz aufnehmen')+'</button>'+(session.recorded?'<button class="'+(session.replayed?'secondary':'primary')+'" id="sbReplay">'+(session.replayed?'✓ eigene Aufnahme gehört':'▶ eigene Aufnahme hören')+'</button>':'')
      :'<button class="'+(session.manualSpoken?'secondary':'primary')+'" id="sbManual">'+(session.manualSpoken?'✓ laut gesprochen':'Satz 3× laut sprechen')+'</button>';
    box.innerHTML='<div class="sb-head"><div><div class="label">Satz-Aussprache · '+done+' / '+total+'</div><h2>Hören → sprechen → rückhören → vergleichen</h2></div><div class="pill">'+(finished?'✓':done+'/'+total)+'</div></div>'+
      '<p class="small">Keine automatische Akzentnote. Entscheidend ist ein echter A/B-Vergleich. '+(mic?'Die Aufnahme bleibt nur lokal in dieser Sitzung.':'Auf diesem Gerät ist keine lokale Aufnahme verfügbar; deshalb wird transparent auf lautes Sprechen + Doppelreferenz ausgewichen.')+'</p>'+
      (finished?'<div class="tip">✓ Alle vier heutigen Sätze wurden vollständig verglichen.</div>':'<div class="sb-phrase" lang="uk">'+phrase+'</div><div class="sb-steps">'+
      '<button class="'+(session.heardBefore?'secondary':'primary')+'" id="sbHear1">'+(session.heardBefore?'✓ Referenz gehört':'1 · Referenz hören')+'</button>'+production+
      '<button class="'+(session.heardAfter?'secondary':'primary')+'" id="sbHear2">'+(session.heardAfter?'✓ erneut verglichen':'4 · Referenz erneut hören')+'</button></div>'+
      '<div class="tip">Vergleiche: Sind alle Wörter vollständig? Stimmen die deutlichsten Betonungen? Vermeidest du offensichtliche deutsche Buchstaben-Lesefehler?</div><div class="actions"><button class="secondary" id="sbRetry">Noch einmal</button><button class="primary" id="sbConfirm" '+(readyToConfirm()?'':'disabled')+'>Vergleich bestätigen</button></div>');
    const h1=document.getElementById('sbHear1');if(h1)h1.onclick=e=>listenReference(false,e.currentTarget);
    const h2=document.getElementById('sbHear2');if(h2)h2.onclick=e=>listenReference(true,e.currentTarget);
    const rb=document.getElementById('sbRecord');if(rb)rb.onclick=()=>recording?recordStop():recordStart();
    const rp=document.getElementById('sbReplay');if(rp)rp.onclick=replay;
    const man=document.getElementById('sbManual');if(man)man.onclick=manualSpeak;
    const retry=document.getElementById('sbRetry');if(retry)retry.onclick=retry;
    const conf=document.getElementById('sbConfirm');if(conf)conf.onclick=confirm;
  }
  const oldNext=document.getElementById('next')?.onclick;
  if(document.getElementById('next'))document.getElementById('next').onclick=function(e){
    if(required()&&!allDone()){renderBox();document.getElementById('speakingBridgeBox')?.scrollIntoView({behavior:'smooth',block:'center'});toast('Vor dem nächsten Tag erst jeden heutigen Satz vollständig aufnehmen/rückhören und vergleichen.');return}
    return oldNext?.call(this,e)
  };
  const css=document.createElement('style');css.textContent='.sb-head{display:flex;gap:12px;justify-content:space-between;align-items:flex-start}.sb-phrase{font-size:1.65rem;font-weight:850;margin:15px 0}.sb-steps{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.sb-steps button{min-height:48px}@media(max-width:520px){.sb-steps{grid-template-columns:1fr}}';document.head.append(css);
  window.UKRAINIAN_SENTENCE_SPEAKING={version:VERSION,start,count:Object.values(TARGETS).reduce((n,x)=>n+x.length,0)};
  const previousRender=render;render=function(){previousRender();renderBox()};ensure();resetPhrase(currentPhrase());renderBox();
})();