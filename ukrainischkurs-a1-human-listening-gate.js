/* Ukrainischkurs für Joel · A1 Human Listening Proof v1
   Ergänzt die generierte Satz-Hörprüfung um einen echten Human-Audio-Nachweis.
   Kein TTS-Fallback kann dieses Gate bestehen. Zwei unabhängige Durchgänge an
   verschiedenen Kalendertagen, jeweils mindestens 9/10. */
(()=>{
  const VERSION=1,core=window.UKRAINIAN_LEARNING_CORE;if(!core)return;
  const POOL=[
    {letter:'А',text:'автобус',de:'Bus',wrong:['Zug','Hotel','Apotheke']},
    {letter:'В',text:'вода',de:'Wasser',wrong:['Kaffee','Tee','Essen']},
    {letter:'Г',text:'гора',de:'Berg',wrong:['Meer','Straße','Haus']},
    {letter:'Д',text:'дім',de:'Haus',wrong:['Park','Geschäft','Bahnhof']},
    {letter:'Е',text:'екран',de:'Bildschirm',wrong:['Telefon','Fenster','Lampe']},
    {letter:'Є',text:'єнот',de:'Waschbär',wrong:['Katze','Pferd','Fisch']},
    {letter:'Ж',text:'жук',de:'Käfer',wrong:['Vogel','Hund','Fisch']},
    {letter:'З',text:'зуб',de:'Zahn',wrong:['Hand','Nase','Auge']},
    {letter:'Ї',text:'їжа',de:'Essen',wrong:['Wasser','Arbeit','Hilfe']},
    {letter:'К',text:'кіт',de:'Katze',wrong:['Pferd','Käfer','Waschbär']},
    {letter:'Л',text:'лампа',de:'Lampe',wrong:['Bildschirm','Fenster','Telefon']},
    {letter:'М',text:'мама',de:'Mama',wrong:['Bruder','Sohn','Arzt']},
    {letter:'Н',text:'ніс',de:'Nase',wrong:['Zahn','Hand','Auge']},
    {letter:'П',text:'парк',de:'Park',wrong:['Haus','Schule','Geschäft']},
    {letter:'Р',text:'рука',de:'Hand',wrong:['Nase','Zahn','Auge']},
    {letter:'С',text:'сир',de:'Käse',wrong:['Tee','Apfel','Wasser']},
    {letter:'Ф',text:'Франція',de:'Frankreich',wrong:['Deutschland','Ukraine','Kyiv']},
    {letter:'Ч',text:'чай',de:'Tee',wrong:['Wasser','Käse','Apfel']},
    {letter:'Ш',text:'школа',de:'Schule',wrong:['Hotel','Park','Bahnhof']},
    {letter:'Я',text:'яблуко',de:'Apfel',wrong:['Käse','Tee','Wasser']}
  ];
  const shuffle=(a,r=Math.random)=>{const x=[...a];for(let i=x.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[x[i],x[j]]=[x[j],x[i]]}return x};
  const hash=value=>{let h=2166136261;for(const ch of String(value)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0};
  const rng=seed=>{let x=seed>>>0;return()=>{x+=0x6D2B79F5;let t=x;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}};
  function examListeningDay(){const start=Number(s.a1Exam?.start);return Number.isFinite(start)&&Number(s.day)===start+1}
  function examState(){return s.a1Exam?.domains?.listening||null}
  function ensure(){if(!s.a1HumanListening||typeof s.a1HumanListening!=='object')s.a1HumanListening={version:VERSION,qualification:null,confirmation:null,best:0,attempts:0};const st=s.a1HumanListening;st.version=VERSION;st.best=Number(st.best)||0;st.attempts=Number(st.attempts)||0;return st}
  function stage(){return examState()?.qualified?'confirmation':'qualification'}
  function stageProof(){return ensure()[stage()]||null}
  function stageDone(){const p=stageProof();return !!(p&&p.passed&&p.date)}
  function fullyPassed(){const st=ensure();return !!(st.qualification?.passed&&st.confirmation?.passed&&st.qualification.date&&st.confirmation.date&&st.qualification.date!==st.confirmation.date)}
  function pickItems(){const st=ensure(),phase=stage(),r=rng(hash(`a1-human-listening|${phase}|${st.attempts}`));return shuffle(POOL,r).slice(0,10)}
  let session=null,currentAudio=null;
  function stopAudio(){if(currentAudio){try{currentAudio.pause()}catch{}currentAudio.onended=null;currentAudio.onerror=null;currentAudio=null}}
  function begin(){if(!examListeningDay())return;const existing=stageProof();if(existing?.passed){toast('Der heutige Human-Audio-Nachweis ist bereits bestanden.');return}stopAudio();session={phase:stage(),items:pickItems(),idx:0,correct:0,heard:false,plays:0,sourceReady:false,misses:[]};renderGate()}
  function item(){return session?.items?.[session.idx]||null}
  function options(q){return shuffle([q.de,...q.wrong],rng(hash(`${q.text}|${session.phase}|${session.idx}`)))}
  function source(q){const meta=window.UKRAINIAN_PRONUNCIATION_META?.[q.letter],url=window.UKRAINIAN_PRONUNCIATION_AUDIO?.[q.letter];return meta&&url&&core.normalize(meta.label)===core.normalize(q.text)?{meta,url}:null}
  function play(button){const q=item();if(!q||session.plays>=2)return;const src=source(q);if(!src){toast('Für diese Prüfungsaufgabe fehlt die verifizierte menschliche Quelle. Sie wird nicht als TTS ersetzt.');return}stopAudio();session.heard=false;session.sourceReady=false;button.disabled=true;const a=new Audio(src.url);currentAudio=a;a.onended=()=>{if(currentAudio===a)currentAudio=null;button.disabled=false};a.onerror=()=>{if(currentAudio===a)currentAudio=null;button.disabled=false;session.heard=false;session.sourceReady=false;toast('Menschliche Aufnahme konnte nicht geladen werden. Kein TTS-Ersatz in der Prüfung.');renderGate()};const p=a.play();const ok=()=>{session.plays++;session.heard=true;session.sourceReady=true;button.disabled=false;renderGate()};if(p&&typeof p.then==='function')p.then(ok).catch(()=>{button.disabled=false;session.heard=false;session.sourceReady=false;toast('Menschliche Aufnahme konnte nicht gestartet werden. Kein TTS-Ersatz in der Prüfung.');renderGate()});else ok()}
  function answer(value){const q=item();if(!q||!session.heard||!session.sourceReady){toast('Erst die menschliche Tonspur anhören.');return}const good=value===q.de;if(good)session.correct++;else session.misses.push(q.text);session.idx++;session.heard=false;session.sourceReady=false;session.plays=0;stopAudio();if(session.idx>=session.items.length){finish();return}renderGate()}
  function finish(){const st=ensure(),score=Math.round(session.correct/session.items.length*100),passed=session.correct>=9,phase=session.phase,proof={passed,score,correct:session.correct,total:session.items.length,date:date(),misses:[...session.misses],humanOnly:true};st.best=Math.max(st.best,score);st.attempts++;if(passed)st[phase]=proof;core.recordSession({skills:['listening'],correct:session.correct,total:session.items.length,passed,assisted:false,weight:2.5,module:'a1-human-listening-'+phase,day:s.day,audioQuality:'human'});session=null;save();toast(passed?(phase==='qualification'?'Human-Audio Hören qualifiziert. Für die endgültige Bestätigung brauchst du am nächsten Prüfungstag erneut mindestens 9/10.':'Human-Audio Hören zweifach bestätigt.'):'Human-Audio Hören noch nicht stabil: mindestens 9/10 in einem frischen Durchgang.');render();renderGate()}
  function qualityText(){const st=ensure();if(fullyPassed())return '✓ Human-Audio Hören an zwei verschiedenen Tagen bestätigt.';const p=stageProof();if(p?.passed)return '✓ Dieser Human-Audio-Nachweis ist bestanden.';return 'Pflicht für A1 Hören: 9/10 mit ausschließlich menschlichen Aufnahmen. Kein System-TTS kann dieses Gate bestehen.'}
  function renderGate(){
    let box=document.getElementById('a1HumanListeningGate');if(!examListeningDay()){if(box)box.hidden=true;return}const examBox=document.getElementById('a1ExamBox')||document.getElementById('cards');if(!examBox)return;if(!box){box=document.createElement('section');box.id='a1HumanListeningGate';box.className='card a1-human-listening';examBox.insertAdjacentElement('afterend',box)}box.hidden=false;const st=ensure(),phase=stage(),proof=stageProof();
    if(session){const q=item(),src=source(q),meta=src?.meta;box.innerHTML='<div class="ahl-head"><div><div class="label">A1 Hören · Human-Audio '+(phase==='qualification'?'Qualifikation':'Bestätigung')+'</div><h2>Nur hören – das ukrainische Wort bleibt verborgen</h2></div><div class="pill">'+(session.idx+1)+'/10</div></div><p class="small">Welche Bedeutung hat die menschliche Aufnahme? Maximal zwei Wiedergaben. Kein TTS-Fallback.</p><div class="actions"><button class="secondary" id="ahlPlay" '+(session.plays>=2?'disabled':'')+'>🎙️ Aufnahme anhören · '+session.plays+'/2</button></div><div class="ahl-source">'+(session.sourceReady?'✓ menschliche Quelle · '+(meta?.speaker||'Ukrainisch'):'Originalaufnahme noch nicht gestartet')+'</div><div class="ahl-grid">'+options(q).map(x=>'<button class="answer" data-ahl="'+String(x).replace(/"/g,'&quot;')+'" '+(session.heard&&session.sourceReady?'':'disabled')+'>'+x+'</button>').join('')+'</div>';const playBtn=document.getElementById('ahlPlay');if(playBtn)playBtn.onclick=()=>play(playBtn);box.querySelectorAll('[data-ahl]').forEach(b=>b.onclick=()=>answer(b.dataset.ahl));return}
    box.innerHTML='<div class="ahl-head"><div><div class="label">A1 Hören · Qualitätsnachweis</div><h2>Menschliche Sprache zusätzlich zur Satzprüfung</h2></div><div class="pill">'+(fullyPassed()?'✓':'9/10')+'</div></div><p class="small">Die bestehende Satzprüfung testet Transfer. Dieser zusätzliche Nachweis stellt sicher, dass ein A1-Hörergebnis nicht allein aus synthetischer Sprachausgabe entstehen kann.</p><div class="tip">'+qualityText()+'</div><div class="ahl-history">'+(st.qualification?.passed?'<span>Qualifikation '+st.qualification.score+'% · '+st.qualification.date+'</span>':'<span>Qualifikation offen</span>')+(st.confirmation?.passed?'<span>Bestätigung '+st.confirmation.score+'% · '+st.confirmation.date+'</span>':'<span>Bestätigung offen</span>')+'</div><div class="actions"><button class="'+(proof?.passed?'secondary':'primary')+'" id="ahlStart" '+(proof?.passed?'disabled':'')+'>'+(proof?.passed?'Heute bestanden':phase==='qualification'?'Human-Audio Qualifikation starten':'Human-Audio Bestätigung starten')+'</button></div>';const startBtn=document.getElementById('ahlStart');if(startBtn)startBtn.onclick=begin
  }
  const oldNext=document.getElementById('next')?.onclick;if(document.getElementById('next'))document.getElementById('next').onclick=function(e){if(examListeningDay()&&!fullyPassed()){renderGate();document.getElementById('a1HumanListeningGate')?.scrollIntoView({behavior:'smooth',block:'center'});toast(stage()==='qualification'?'Vor dem nächsten Bereich erst den Human-Audio-Hörnachweis qualifizieren.':'A1 Hören braucht zusätzlich die Human-Audio-Bestätigung an einem zweiten Kalendertag.');return}return oldNext?.call(this,e)};
  core.registerMilestone?.('a1.exam',{requires:['immersion.transfer'],complete:()=>['reading','listening','writing','speaking'].every(k=>!!s.a1Exam?.domains?.[k]?.passed&&!!s.a1Exam?.domains?.[k]?.confirmed)&&fullyPassed()});
  const previousRender=render;render=function(){previousRender();renderGate()};
  const css=document.createElement('style');css.textContent='.ahl-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start}.ahl-source{text-align:center;margin:8px 0 13px;font-size:.82rem;font-weight:800;color:#496858}.ahl-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.ahl-history{display:flex;gap:8px;flex-wrap:wrap;margin:12px 0}.ahl-history span{padding:7px 10px;border-radius:999px;background:#edf6ef;font-size:.8rem;font-weight:800;color:#45624d}@media(max-width:520px){.ahl-grid{grid-template-columns:1fr}}';document.head.append(css);
  ensure();renderGate();
  window.UKRAINIAN_A1_HUMAN_LISTENING={version:VERSION,poolSize:POOL.length,questionsPerAttempt:10,threshold:9,doublePass:true,differentCalendarDays:true,humanAudioOnly:true,noTtsFallback:true,blocksA1Milestone:true,get passed(){return fullyPassed()}};
})();