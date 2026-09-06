/* Ukrainischkurs für Joel · Spoken Transfer v1
   Audio-first Sprechtransfer auf ausgewählten Review-Tagen.
   Ergänzt bestehende Schreib-/Dialogübungen: Frage hören -> spontan sprechen ->
   eigene Aufnahme rückhören -> Gesagtes tippen. Keine automatische Akzentnote. */
(()=>{
  const VERSION=1,core=window.UKRAINIAN_LEARNING_CORE;if(!core)return;
  const BANK=[
    {requires:['Ти розумієш?','Я розумію…'],q:'Ти розумієш?',a:['Так, я розумію','Я розумію']},
    {requires:['Ти хочеш…?','Я хочу каву'],q:'Ти хочеш каву?',a:['Так, я хочу каву','Я хочу каву']},
    {requires:['Де ти живеш?','у Києві'],q:'Де ти живеш?',a:['Я живу в Києві','Я живу у Києві']},
    {requires:['Куди ти йдеш?','Я йду в магазин'],q:'Куди ти йдеш?',a:['Я йду в магазин']},
    {requires:['Де ти?','Я в ресторані'],q:'Де ти?',a:['Я в ресторані','Я у ресторані']},
    {requires:['Куди ти їдеш?','Я їду в Київ'],q:'Куди ти їдеш?',a:['Я їду в Київ']},
    {requires:['Що ти хочеш?','Я хочу каву'],q:'Що ти хочеш?',a:['Я хочу каву']},
    {requires:['Звідки ти?','Я з Німеччини'],q:'Звідки ти?',a:['Я з Німеччини']},
    {requires:['Чого немає?','У мене немає води'],q:'Чого у тебе немає?',a:['У мене немає води']},
    {requires:['Де ти був?','Я був у готелі'],q:'Де ти був учора?',a:['Я був у готелі','Я був в готелі','Учора я був у готелі','Вчора я був у готелі']},
    {requires:['Я працював · Я працювала','вчора'],q:'Що ти робив учора?',a:['Я працював','Учора я працював','Вчора я працював']},
    {requires:['Що ти будеш робити завтра?','Я буду працювати'],q:'Що ти будеш робити завтра?',a:['Завтра я буду працювати','Я буду працювати завтра','Я буду працювати']},
    {requires:['Ти будеш працювати?','завтра'],q:'Ти будеш працювати завтра?',a:['Так, завтра я буду працювати','Так, я буду працювати завтра','Так, буду']},
    {requires:['Я буду жити в Києві','Ти будеш працювати?'],q:'Де ти будеш жити?',a:['Я буду жити в Києві','Я буду жити у Києві']},
    {requires:['У мене немає квитка','квиток'],q:'У тебе є квиток?',a:['Ні, у мене немає квитка','У мене немає квитка']},
    {requires:['Я з Німеччини','Звідки ти?'],q:'Ти з Німеччини?',a:['Так, я з Німеччини','Я з Німеччини']},
    {requires:['Я зараз вдома','сьогодні'],q:'Ти зараз вдома?',a:['Так, я зараз вдома','Я зараз вдома']},
    {requires:['Я хочу їсти','Ти хочеш…?'],q:'Ти хочеш їсти?',a:['Так, я хочу їсти','Я хочу їсти']},
    {requires:['Мені потрібна допомога','Ти розумієш?'],q:'Тобі потрібна допомога?',a:['Так, мені потрібна допомога','Мені потрібна допомога']},
    {requires:['Я не розумію','Повторіть, будь ласка'],q:'Ти розумієш?',a:['Ні, я не розумію','Я не розумію']}
  ];
  const shuffle=a=>{const x=[...a];for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]]}return x};
  const reviewDays=()=>[...new Set(WEEKLY_REVIEW_DAYS.map(Number))].filter(d=>d<D.length-1).sort((a,b)=>a-b);
  const available=()=>BANK.filter(x=>core.allIntroduced(x.requires));
  const beforeExam=()=>{const n=Number(s.a1Exam?.start);return !Number.isFinite(n)||Number(s.day)<n};
  const reviewIndex=()=>reviewDays().indexOf(Number(s.day));
  const required=()=>{
    if(!alphabetReady()||!beforeExam()||Number(s.day)<20||!WEEKLY_REVIEW_DAYS.includes(Number(s.day))||available().length<6)return false;
    const i=reviewIndex(),focus=core.reviewFocus();return focus==='speaking'||(i>=0&&i%2===0);
  };
  function ensure(){if(!s.spokenTransfer||typeof s.spokenTransfer!=='object')s.spokenTransfer={version:VERSION,days:{}};s.spokenTransfer.version=VERSION;s.spokenTransfer.days=s.spokenTransfer.days||{};return s.spokenTransfer}
  function state(){const root=ensure(),k=String(s.day);return root.days[k]||(root.days[k]={passed:false,strongPassed:false,best:0,strongBest:0,attempts:0,date:'',assisted:false})}
  let session=null,rec={media:null,stream:null,chunks:[],url:'',audio:null};
  function micAvailable(){return !!(navigator.mediaDevices?.getUserMedia&&window.MediaRecorder)}
  function cleanup(){
    const media=rec.media;rec.media=null;if(media){media.ondataavailable=null;media.onstop=null;media.onerror=null;try{if(media.state!=='inactive')media.stop()}catch{}}
    rec.stream?.getTracks?.().forEach(t=>t.stop());rec.stream=null;rec.chunks=[];
    if(rec.audio){try{rec.audio.pause()}catch{}rec.audio.onended=null;rec.audio=null}
    if(rec.url){try{URL.revokeObjectURL(rec.url)}catch{}rec.url=''}
  }
  function resetItem(){cleanup();if(!session)return;session.heard=false;session.plays=0;session.revealed=false;session.recorded=false;session.replayed=false;session.manualSpoken=false}
  function countForToday(){return core.reviewFocus()==='speaking'?4:3}
  function begin(){const pool=available(),count=Math.min(countForToday(),pool.length);session={items:shuffle(pool).slice(0,count),idx:0,correct:0,assisted:false,fallback:false,heard:false,plays:0,revealed:false,recorded:false,replayed:false,manualSpoken:false};renderBox()}
  function current(){return session?.items?.[session.idx]||null}
  function hearQuestion(button){const q=current();if(!q||session.plays>=2)return;if(typeof speak==='function')speak(q.q,button);session.heard=true;session.plays++;renderBox()}
  function revealQuestion(){if(!session)return;session.revealed=true;session.assisted=true;renderBox();toast('Fragetext eingeblendet – dieser Durchgang zählt als unterstützt.')}
  async function recordStart(){
    if(!session?.heard){toast('Erst die Frage hören, dann spontan antworten.');return}
    if(!micAvailable()){session.fallback=true;session.assisted=true;renderBox();toast('Aufnahme auf diesem Gerät nicht verfügbar. Nutze den transparenten Lautsprech-Fallback.');return}
    try{
      cleanup();const stream=await navigator.mediaDevices.getUserMedia({audio:true}),media=new MediaRecorder(stream);rec.stream=stream;rec.media=media;rec.chunks=[];
      media.ondataavailable=e=>{if(rec.media===media&&e.data?.size)rec.chunks.push(e.data)};
      media.onstop=()=>{if(rec.media!==media)return;const chunks=[...rec.chunks],mime=media.mimeType||'audio/webm';rec.media=null;rec.stream?.getTracks?.().forEach(t=>t.stop());rec.stream=null;rec.chunks=[];if(!chunks.length){session.recorded=false;toast('Keine Aufnahme erkannt. Bitte erneut versuchen.');renderBox();return}rec.url=URL.createObjectURL(new Blob(chunks,{type:mime}));session.recorded=true;session.replayed=false;renderBox()};
      media.onerror=()=>{if(rec.media===media){cleanup();session.fallback=true;session.assisted=true;toast('Aufnahmefehler. Der transparente Sprech-Fallback ist aktiv.');renderBox()}};
      media.start();renderBox();
    }catch{cleanup();session.fallback=true;session.assisted=true;toast('Mikrofon nicht verfügbar oder nicht erlaubt. Der transparente Fallback ist aktiv.');renderBox()}
  }
  function recordStop(){if(rec.media&&rec.media.state!=='inactive')rec.media.stop()}
  function replay(){if(!rec.url)return;if(rec.audio){try{rec.audio.pause()}catch{}}const a=new Audio(rec.url);rec.audio=a;a.onended=()=>{if(rec.audio===a)rec.audio=null;session.replayed=true;renderBox()};a.play().catch(()=>toast('Eigene Aufnahme konnte nicht abgespielt werden.'))}
  function manualSpeak(){session.manualSpoken=true;session.fallback=true;session.assisted=true;renderBox();toast('Lautes Sprechen gespeichert. Tippe jetzt exakt, was du gesagt hast.')}
  function ready(){if(!session?.heard)return false;return session.fallback?session.manualSpoken:session.recorded&&session.replayed}
  function submit(value){
    if(!ready()){toast(session?.fallback?'Erst laut antworten.':'Erst aufnehmen und deine eigene Antwort vollständig anhören.');return}
    const item=current(),good=core.accepts(value,item.a);if(good)session.correct++;else toast('Passende Antwort: '+item.a[0]);if(good)toast('Gesprochene Antwort passt.');
    session.idx++;if(session.idx>=session.items.length){finish();return}resetItem();renderBox()
  }
  function finish(){
    const st=state(),total=session.items.length,score=Math.round(session.correct/total*100),passed=session.correct===total,strong=passed&&!session.assisted&&!session.fallback;
    st.best=Math.max(Number(st.best)||0,score);st.strongBest=Math.max(Number(st.strongBest)||0,strong?score:0);st.attempts++;st.date=date();st.passed=passed;st.strongPassed=st.strongPassed||strong;st.assisted=!!session.assisted;
    core.recordSession({skills:['speaking','listening'],correct:session.correct,total,passed,assisted:session.assisted||session.fallback,weight:strong?1.25:.55,module:'spoken-transfer',day:s.day});
    cleanup();session=null;toast(passed?(strong?'Spontaner Sprechtransfer stark bestanden.':'Sprechtransfer bestanden; Unterstützung wird im Skill-Profil schwächer gewichtet.'):'Noch nicht stabil: alle Antworten müssen in einem frischen Durchgang passen.');render()
  }
  function taskHtml(){
    const item=current(),recording=rec.media?.state==='recording';
    const production=session.fallback
      ?'<button class="'+(session.manualSpoken?'secondary':'primary')+'" id="stManual">'+(session.manualSpoken?'✓ laut beantwortet':'Antwort laut sprechen')+'</button>'
      :'<button class="'+(recording?'danger':session.recorded?'secondary':'primary')+'" id="stRecord">'+(recording?'■ Aufnahme stoppen':session.recorded?'● neu aufnehmen':'● Antwort aufnehmen')+'</button>'+(session.recorded?'<button class="'+(session.replayed?'secondary':'primary')+'" id="stReplay">'+(session.replayed?'✓ eigene Antwort gehört':'▶ eigene Antwort anhören')+'</button>':'');
    return '<div class="st-task"><div class="label">Spontan sprechen · '+(session.idx+1)+' / '+session.items.length+'</div><h2>'+(session.revealed?'<span lang="uk">'+item.q+'</span>':'Frage nur hören – nicht mitlesen')+'</h2><p class="small">Antworte sofort mit einem einfachen vollständigen ukrainischen Satz. Maximal zwei Wiedergaben der Frage.</p><div class="actions"><button class="secondary" id="stHear" '+(session.plays>=2?'disabled':'')+'>🔊 Frage hören · '+session.plays+'/2</button><button class="ghost" id="stReveal">Fragetext anzeigen (Unterstützung)</button></div><div class="actions">'+production+'</div><input id="stTranscript" class="typing-input" lang="uk" autocapitalize="off" autocorrect="off" autocomplete="off" spellcheck="false" placeholder="Danach exakt tippen, was du gesagt hast …"><div class="actions"><button class="primary" id="stSubmit" '+(ready()?'':'disabled')+'>Gesprochene Antwort prüfen</button></div>'+(session.assisted?'<div class="tip">Unterstützter Durchgang: fürs Lernen gültig, im Skill-Profil aber bewusst schwächer.</div>':'')+'</div>'
  }
  function renderBox(){
    let box=document.getElementById('spokenTransferBox');if(!required()){if(box)box.hidden=true;return}const cards=document.getElementById('cards');if(!cards)return;if(!box){box=document.createElement('section');box.id='spokenTransferBox';box.className='card';cards.insertAdjacentElement('afterend',box)}box.hidden=false;const st=state(),focus=core.reviewFocus();
    box.innerHTML='<div class="st-head"><div><div class="label">Review · aktiver Sprechtransfer</div><h2>Hören → spontan antworten → rückhören → tippen</h2></div><div class="pill">'+(st.passed?'✓':countForToday()+' Sätze')+'</div></div><p class="small">Dieser Pflichtblock ergänzt die bestehenden getippten Dialoge. Er prüft keine perfekte Aussprache und vergibt keine Fake-Akzentnote. '+(focus==='speaking'?'Sprechen ist heute dein adaptiver Fokus, deshalb kommt eine zusätzliche Frage.':'Auf ausgewählten Review-Tagen werden drei echte Sprechreaktionen trainiert.')+'</p>'+(session?taskHtml():'<div class="tip">'+(st.passed?(st.strongPassed?'✓ Bereits unassistiert mit Aufnahme/Rückhören bestanden.':'✓ Erledigt; ein späterer unassistierter Durchgang kann den Nachweis stärken.'):'Bestehen: alle heutigen Antworten im selben frischen Durchgang passend. Bei verfügbarem Mikrofon gehören Aufnahme und vollständiges Rückhören zwingend dazu.')+'</div><div class="actions"><button class="'+(st.passed?'secondary':'primary')+'" id="stStart">'+(st.passed?'noch einmal':'Sprechtransfer starten')+'</button></div>');
    const start=document.getElementById('stStart');if(start)start.onclick=begin;const hear=document.getElementById('stHear');if(hear)hear.onclick=e=>hearQuestion(e.currentTarget);const reveal=document.getElementById('stReveal');if(reveal)reveal.onclick=revealQuestion;const rb=document.getElementById('stRecord');if(rb)rb.onclick=()=>rec.media?.state==='recording'?recordStop():recordStart();const rp=document.getElementById('stReplay');if(rp)rp.onclick=replay;const man=document.getElementById('stManual');if(man)man.onclick=manualSpeak;const submit=document.getElementById('stSubmit');if(submit)submit.onclick=()=>submitAnswer();
  }
  function submitAnswer(){const input=document.getElementById('stTranscript');submit(input?.value||'')}
  const oldNext=document.getElementById('next')?.onclick;if(document.getElementById('next'))document.getElementById('next').onclick=function(e){if(required()&&!state().passed){renderBox();document.getElementById('spokenTransferBox')?.scrollIntoView({behavior:'smooth',block:'center'});toast('Vor dem nächsten Kurstag erst den heutigen spontanen Sprechtransfer abschließen.');return}return oldNext?.call(this,e)};
  const css=document.createElement('style');css.textContent='.st-head{display:flex;gap:12px;justify-content:space-between;align-items:flex-start}.st-task{padding:14px;border-radius:16px;background:#f4f8fc;margin-top:13px}.st-task h2{margin:10px 0}.st-task .typing-input{margin-top:12px}@media(max-width:520px){.st-head{align-items:center}}';document.head.append(css);
  window.UKRAINIAN_SPOKEN_TRANSFER={version:VERSION,promptCount:BANK.length,audioFirst:true,maxQuestionPlays:2,recordingRequiredWhenAvailable:true,replayRequired:true,reviewRequired:true,noFakeAccentScore:true};
  const previousRender=render;render=function(){previousRender();renderBox()};ensure();renderBox();
})();
