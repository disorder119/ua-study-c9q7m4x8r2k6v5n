/* Ukrainischkurs für Joel · Human Listening Bridge v1
   Drei Tage echtes Audio-Diktat mit den 12 verifizierten menschlichen Aufnahmen.
   Keine deutschen Antwortoptionen und kein sichtbares Transkript vor der Antwort. */
(()=>{
  const VERSION=1;
  const start=D.length;
  const GROUPS=[
    ['вода','аптека','магазин','автобус'],
    ['лікар','тато','брат','туалет'],
    ['будь ласка','Я не знаю','Німеччина','Україна']
  ];
  const LESSONS=[
    ['Hören: Alltag ohne Text','Nur hören und ukrainisch schreiben.','Vier bekannte Alltagswörter werden ausschließlich über die Tonspur abgefragt. Keine deutsche Auswahlantwort.',[]],
    ['Hören: Personen und Orientierung','Klangbild statt Kartenbild.','Du musst vier weitere bekannte Wörter aus der Aufnahme selbst rekonstruieren.',[]],
    ['Hören: Phrase und Herkunft','Auch mehrsilbige Formen sicher erkennen.','Zum Abschluss kommen zwei Phrasen und zwei Herkunftswörter. Erst hören, dann ukrainisch tippen.',[]]
  ];
  const TARGETS={};GROUPS.forEach((g,i)=>TARGETS[start+i]=g);
  LESSONS.forEach(x=>D.push(x));
  const norm=x=>String(x||'').normalize('NFC').toLocaleLowerCase('uk').replace(/[ʼ’‘'`]/g,'’').replace(/[.!?,…]/g,'').replace(/\s+/g,' ').trim();
  function ensure(){if(!s.humanListening||typeof s.humanListening!=='object')s.humanListening={version:VERSION,start,days:{}};s.humanListening.version=VERSION;s.humanListening.start=start;s.humanListening.days=s.humanListening.days||{};return s.humanListening}
  function required(){return Array.isArray(TARGETS[Number(s.day)])}
  function state(){const root=ensure(),k=String(s.day);return root.days[k]||(root.days[k]={passed:false,best:0,humanBest:0,attempts:0,date:''})}
  let session=null;
  function startSet(){session={items:[...(TARGETS[Number(s.day)]||[])].sort(()=>Math.random()-.5),idx:0,correct:0,human:0,listened:false,source:'',misses:[]};renderBox()}
  function current(){return session?.items?.[session.idx]||''}
  function play(button){const text=current();if(!text)return;session.listened=false;session.source='loading';renderBox();setTimeout(()=>speak(text,button),0)}
  function sourceLabel(){if(!session)return '';if(session.source==='human')return 'Menschliche Aufnahme';if(session.source==='tts-fallback')return 'System-TTS-Fallback';if(session.source==='loading')return 'Audio wird geladen …';return 'Noch nicht angehört'}
  window.addEventListener('ukrainian-audio-source',e=>{if(!session||norm(e.detail?.text)!==norm(current()))return;session.source=e.detail?.source||'';session.listened=true;renderBox()});
  function answer(value){
    if(!session?.listened){toast(session?.source==='loading'?'Audio wird noch geladen.':'Erst anhören, dann schreiben.');return}
    const wanted=current(),good=norm(value)===norm(wanted);if(good){session.correct++;if(session.source==='human')session.human++}else session.misses.push(wanted);
    toast(good?'Richtig gehört.':'Gehört wurde: '+wanted);session.idx++;
    if(session.idx>=session.items.length){finish();return}
    session.listened=false;session.source='';renderBox()
  }
  function finish(){const st=state(),score=Math.round(session.correct/session.items.length*100),human=session.human,passed=session.correct===session.items.length;st.best=Math.max(st.best||0,score);st.humanBest=Math.max(st.humanBest||0,human);st.attempts++;st.date=date();st.passed=passed;save();session=null;toast(passed?'Audio-Diktat fehlerfrei bestanden.':'Noch nicht stabil: für die Freigabe 4/4 in einem frischen Durchgang.');render()}
  function renderBox(){
    let box=document.getElementById('humanListeningBox');if(!required()){if(box)box.hidden=true;return}const cards=document.getElementById('cards');if(!cards)return;if(!box){box=document.createElement('section');box.id='humanListeningBox';box.className='card';cards.insertAdjacentElement('afterend',box)}box.hidden=false;const st=state();
    if(session){const pos=session.idx+1;box.innerHTML='<div class="hl-head"><div><div class="label">Human-Audio-Diktat · '+pos+' / '+session.items.length+'</div><h2>Nur hören. Dann Ukrainisch schreiben.</h2></div><div class="pill">'+session.correct+'/'+session.idx+'</div></div><p class="small">Kein Transkript und keine deutsche Auswahl. Wenn die externe menschliche Datei technisch nicht lädt, wird der TTS-Fallback ausdrücklich angezeigt.</p><div class="actions"><button class="primary" id="hlListen">🔊 Aufnahme anhören</button></div><div class="hl-source">'+sourceLabel()+'</div><input id="hlInput" class="typing-input" lang="uk" autocapitalize="off" autocorrect="off" autocomplete="off" spellcheck="false" placeholder="Schreibe exakt, was du hörst …"><div class="actions"><button class="primary" id="hlCheck">Prüfen</button></div>';const input=document.getElementById('hlInput'),listen=document.getElementById('hlListen');listen.onclick=()=>play(listen);document.getElementById('hlCheck').onclick=()=>answer(input.value);input.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();answer(input.value)}};setTimeout(()=>input.focus(),0)
    }else box.innerHTML='<div class="hl-head"><div><div class="label">Hörtransfer · menschliche Referenz bevorzugt</div><h2>Klang erkennen, nicht deutsche Hinweise erraten</h2></div><div class="pill">'+(st.passed?'✓':'4/4')+'</div></div><p class="small">Vier bereits gelernte Wörter/Phrasen werden ohne sichtbaren Zieltext diktiert. Bestehen nur mit 4/4 im ersten Durchgang.</p><div class="tip">'+(st.passed?'✓ Diktat bestanden. Bester Durchgang mit menschlicher Quelle: '+st.humanBest+'/4.':'Die App zeigt nach jedem Abspielen transparent, ob die menschliche Commons-Aufnahme oder TTS-Fallback verwendet wurde.')+'</div><div class="actions"><button class="'+(st.passed?'secondary':'primary')+'" id="hlStart">'+(st.passed?'noch einmal':'Diktat starten')+'</button></div>';const startBtn=document.getElementById('hlStart');if(startBtn)startBtn.onclick=startSet
  }
  const oldNext=document.getElementById('next')?.onclick;if(document.getElementById('next'))document.getElementById('next').onclick=function(e){if(required()&&!state().passed){renderBox();document.getElementById('humanListeningBox')?.scrollIntoView({behavior:'smooth',block:'center'});toast('Vor dem nächsten Tag erst das heutige Hör-Diktat fehlerfrei bestehen.');return}return oldNext?.call(this,e)};
  const css=document.createElement('style');css.textContent='.hl-head{display:flex;gap:12px;justify-content:space-between;align-items:flex-start}.hl-source{text-align:center;font-size:.82rem;font-weight:800;margin:8px 0 12px;color:#526b87}';document.head.append(css);
  window.UKRAINIAN_HUMAN_LISTENING={version:VERSION,start,days:GROUPS.length,count:GROUPS.flat().length};
  const previousRender=render;render=function(){previousRender();renderBox()};ensure();renderBox();
})();