/* Ukrainischkurs für Joel · Professional Lesson Path v1
   Einheitliche didaktische Oberfläche über ALLE bestehenden Lektionen, ohne D,
   Tagesindizes oder bestehende Mastery-Gates zu verändern.
   Ziele: weniger gleichzeitige neue Chunks, Wiederholungen sichtbar machen,
   Transliteration nur als Notfallhilfe, aktiver Abruf vor dem alten Abschlusstest
   und optionale Zusatzmodule aus dem Hauptlernfluss halten. */
(()=>{
  const VERSION=1,core=window.UKRAINIAN_LEARNING_CORE;
  if(!core||!Array.isArray(D))return;
  const COURSE_LENGTH=D.length;
  const OPTIONAL_IDS=['designerAlphabetLesson','fashionBridgeLesson','resalePracticeLesson','realConversationBox','personalWordsBox'];
  const norm=v=>core.normalize?core.normalize(String(v||''),{stripStress:true}):String(v||'').trim().toLocaleLowerCase('uk');
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const firstSeen=new Map();
  D.forEach((day,di)=>(day?.[3]||[]).forEach(card=>{const key=norm(card?.[0]);if(key&&!firstSeen.has(key))firstSeen.set(key,di)}));
  const audit=D.map((day,di)=>{const items=day?.[3]||[],repeated=items.filter(c=>(firstSeen.get(norm(c?.[0]))??di)<di).length;return {day:di,title:String(day?.[0]||''),items:items.length,newItems:items.length-repeated,repeatedItems:repeated,heavy:items.length>3}});
  function ensure(){
    if(!s.professionalPath||typeof s.professionalPath!=='object')s.professionalPath={version:VERSION,days:{},extrasVisible:false};
    s.professionalPath.version=VERSION;s.professionalPath.days=s.professionalPath.days||{};return s.professionalPath
  }
  function dayState(di=Number(s.day)||0){const root=ensure(),k=String(di);if(!root.days[k]){const items=D[di]?.[3]||[],known=items.map((_,ci)=>!!s.known?.[typeof id==='function'?id(di,ci):`d${di}-${ci}`]);let stage='core';if(known.length&&known.every(Boolean))stage='recall';else if(known.slice(0,Math.min(3,known.length)).every(Boolean)&&items.length>3)stage='extra';root.days[k]={stage,translit:false,recallPassed:false,recallBest:0,recallAttempts:0,coreViewed:false,extraViewed:false}}return root.days[k]}
  function guidedAlphabet(){return document.body.classList.contains('guided-alphabet')||((Number(s.day)||0)<14&&typeof alphabetReady==='function'&&!alphabetReady())}
  function contentLesson(){const d=D[Number(s.day)||0];return !guidedAlphabet()&&!!d&&Array.isArray(d[3])&&d[3].length>0}
  function activate(ci){const di=Number(s.day)||0,k=typeof id==='function'?id(di,ci):`d${di}-${ci}`;if(s.known?.[k])return;try{activateItem({di,ci,c:D[di][3][ci],k})}catch{} }
  function saveSafe(){try{save()}catch{}}
  function setStage(stage){const st=dayState();st.stage=stage;saveSafe();patch()}
  function markRange(indices){indices.forEach(activate);saveSafe()}
  function phaseLabel(di,title){if(di<14)return 'Alphabet';if(/abschluss|prüfung|checkpoint/i.test(title))return 'Nachweis';if(/geschichte|dialog|gespräch|conversation|interaktion|erzählen/i.test(title))return 'Anwenden';if(di>=Math.max(14,COURSE_LENGTH-44))return 'Selbstständiger werden';return 'Grundlagen aufbauen'}
  function updateTheme(){document.body.classList.add('professional-path');const meta=document.querySelector('meta[name="theme-color"]');if(meta)meta.setAttribute('content','#2f7d57')}
  function patchStaticCopy(){
    const alphabet=document.getElementById('alphabet');if(alphabet){const p=alphabet.querySelector('.top p.small');if(p&&/ersten sieben Tage/i.test(p.textContent||''))p.textContent='33 Buchstaben – die App führt dich in kleinen Gruppen durch alle Zeichen. Du musst nicht selbst entscheiden, was als Nächstes kommt.'}
    const methods=document.getElementById('methods');if(methods){const h=methods.querySelector('h2');if(h)h.textContent='Zusätzliche Übungen';const p=methods.querySelector('h2 + p.small');if(p)p.textContent='Diese Übungen sind optional. Dein Hauptlernweg zeigt dir automatisch den nächsten sinnvollen Schritt.'}
    document.querySelectorAll('.label').forEach(el=>{if(el.textContent.trim()==='Pflicht')el.textContent='Nächster Schritt'});
  }
  function duplicateBadges(cards){const di=Number(s.day)||0,items=D[di]?.[3]||[];cards.forEach((card,ci)=>{card.querySelector('.pro-repeat-badge')?.remove();const first=firstSeen.get(norm(items[ci]?.[0]));if(Number.isFinite(first)&&first<di){const badge=document.createElement('span');badge.className='pro-repeat-badge';badge.textContent='↻ Wiederholung';card.append(badge)}})}
  function pronunciation(st){document.body.classList.toggle('pro-translit-on',!!st.translit);document.querySelectorAll('#cards details.pronunciation').forEach(d=>{d.open=!!st.translit});}
  function visibleIndices(st,count){if(st.stage==='core')return Array.from({length:Math.min(3,count)},(_,i)=>i);if(st.stage==='extra')return Array.from({length:Math.max(0,count-3)},(_,i)=>i+3);return st.stage==='done'?Array.from({length:count},(_,i)=>i):[]}
  function lessonCoach(cards){
    const di=Number(s.day)||0,d=D[di],items=d[3],st=dayState(di),info=audit[di],host=document.getElementById('cards');if(!host)return;
    let box=document.getElementById('professionalLessonCoach');if(!box){box=document.createElement('section');box.id='professionalLessonCoach';box.className='pro-coach';host.insertAdjacentElement('beforebegin',box)}
    const indices=visibleIndices(st,items.length),newNow=indices.filter(i=>(firstSeen.get(norm(items[i]?.[0]))??di)===di).length,reviewNow=indices.length-newNow;
    let title='';let text='';let action='';
    if(st.stage==='core'){title=items.length>3?'Erst 3 Kernbausteine':'Diese Bausteine zuerst';text='Nicht alles auf einmal. Schau, hör und versteh nur diese kleine Gruppe.';action=items.length>3?'Weiter zu den nächsten '+(items.length-3):'Weiter zum Erinnern'}
    else if(st.stage==='extra'){title='Jetzt nur noch '+Math.max(0,items.length-3);text='Die erste Gruppe ist weggeräumt. Konzentriere dich nur auf den Rest.';action='Jetzt aus dem Kopf'}
    else if(st.stage==='recall'){title='Ohne Hilfe erinnern';text='Zwei kurze Antworten aus dem Kopf. Erst danach kommt der normale Abschlusstest.';action='2× erinnern starten'}
    else {title='Karten-Teil geschafft';text='Du hast die heutige Sprache nicht nur gesehen, sondern aktiv abgerufen. Jetzt folgt die nächste Kursaufgabe.';action='Zum kurzen Abschlusstest'}
    box.innerHTML='<div class="pro-top"><div><div class="pro-eyebrow">'+esc(phaseLabel(di,d[0]))+' · Schritt für Schritt</div><h3>'+esc(title)+'</h3><p>'+esc(text)+'</p></div><div class="pro-dots"><i class="on"></i><i class="'+(['extra','recall','done'].includes(st.stage)?'on':'')+'"></i><i class="'+(['recall','done'].includes(st.stage)?'on':'')+'"></i></div></div>'+(indices.length?'<div class="pro-load">'+(newNow?'<span>'+newNow+' neu</span>':'')+(reviewNow?'<span>'+reviewNow+' Wiederholung</span>':'')+'</div>':'')+'<div class="pro-actions"><button class="primary" id="proMainAction">'+esc(action)+'</button><button class="ghost" id="proPronunciation">'+(st.translit?'Aussprachehilfe aus':'Aussprachehilfe')+'</button></div>';
    const main=document.getElementById('proMainAction');if(main)main.onclick=()=>{if(st.stage==='core'){markRange(indices);st.coreViewed=true;setStage(items.length>3?'extra':'recall')}else if(st.stage==='extra'){markRange(indices);st.extraViewed=true;setStage('recall')}else if(st.stage==='recall')startRecall();else{const q=document.getElementById('startQuiz');if(q){q.scrollIntoView({behavior:'smooth',block:'center'});q.focus()}}};
    const tr=document.getElementById('proPronunciation');if(tr)tr.onclick=()=>{st.translit=!st.translit;saveSafe();patch()};
    cards.forEach((card,ci)=>{card.hidden=!indices.includes(ci);card.classList.toggle('pro-current',indices.includes(ci))});duplicateBadges(cards);pronunciation(st)
  }
  let recall=null;
  function recallPool(){const di=Number(s.day)||0,items=D[di]?.[3]||[],fresh=items.map((c,i)=>({c,i,fresh:(firstSeen.get(norm(c?.[0]))??di)===di}));return [...fresh.filter(x=>x.fresh),...fresh.filter(x=>!x.fresh)]}
  function startRecall(){const st=dayState(),pool=recallPool(),offset=(Number(st.recallAttempts)||0)%Math.max(1,pool.length),items=[];for(let n=0;n<Math.min(2,pool.length);n++)items.push(pool[(offset+n)%pool.length]);recall={items,idx:0,first:0,retry:false};renderRecall()}
  function renderRecall(){
    const host=document.getElementById('cards');if(!host)return;let box=document.getElementById('professionalRecall');if(!box){box=document.createElement('section');box.id='professionalRecall';box.className='pro-recall';host.insertAdjacentElement('afterend',box)}
    if(!recall){box.hidden=true;return}box.hidden=false;const x=recall.items[recall.idx];box.innerHTML='<div class="pro-eyebrow">Aktiv erinnern · '+(recall.idx+1)+' / '+recall.items.length+'</div><h3>'+esc(x.c[1])+'</h3><p>Wie sagst du das auf Ukrainisch?</p><input id="proRecallInput" class="typing-input" lang="uk" autocapitalize="off" autocorrect="off" spellcheck="false" autocomplete="off" placeholder="Ukrainisch aus dem Kopf …"><div id="proRecallFeedback" class="feedback"></div><div class="pro-actions"><button class="primary" id="proRecallCheck">Prüfen</button></div>';
    const input=document.getElementById('proRecallInput'),check=document.getElementById('proRecallCheck');const submit=()=>{const value=input.value.trim();if(!value)return toast('Schreib zuerst deine Antwort.');const good=core.accepts(value,[x.c[0]]),repair=recall.retry;if(good&&!repair)recall.first++;window.UKRAINIAN_ERROR_MEMORY?.record?.({input:value,answers:[x.c[0]],prompt:x.c[1],correct:good,repair,module:'professional-recall',day:Number(s.day),weight:repair?.4:.65});if(!good){recall.retry=true;document.getElementById('proRecallFeedback').innerHTML='Fast. Schau kurz: <strong lang="uk">'+esc(x.c[0])+'</strong>. Tippe es jetzt selbst.';return}recall.retry=false;recall.idx++;if(recall.idx<recall.items.length)return renderRecall();finishRecall()};check.onclick=submit;input.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();submit()}};setTimeout(()=>input.focus(),20)
  }
  function finishRecall(){const st=dayState(),total=recall.items.length,first=recall.first;st.recallAttempts=(Number(st.recallAttempts)||0)+1;st.recallBest=Math.max(Number(st.recallBest)||0,first);const passed=first===total;st.recallPassed=passed;try{core.recordSession({skills:['writing'],correct:first,total,passed,module:'professional-recall',day:Number(s.day),weight:.55,assisted:false})}catch{}recall=null;if(passed){st.stage='done';saveSafe();toast('Super. Beide Antworten kamen direkt aus dem Kopf.')}else{saveSafe();toast('Gut geübt. Für den sicheren Abruf probierst du die zwei gleich noch einmal.')}patch()}
  function optionalModules(){
    const root=ensure(),guided=guidedAlphabet(),found=OPTIONAL_IDS.map(id=>document.getElementById(id)).filter(Boolean);found.forEach(el=>{el.hidden=guided||!root.extrasVisible;el.classList.toggle('pro-optional',true)});
    let box=document.getElementById('professionalExtras');if(guided||!found.length){if(box)box.hidden=true;return}if(!box){box=document.createElement('section');box.id='professionalExtras';box.className='card pro-extras';const progress=document.getElementById('progress');(progress?.parentElement||document.querySelector('main'))?.append(box)}box.hidden=false;box.innerHTML='<div class="pro-eyebrow">Optional</div><h3>Zusatzübungen</h3><p>Mode, Resale und freie Szenarien sind Bonus. Sie unterbrechen deinen Hauptlernweg nicht.</p><button class="secondary" id="proExtrasToggle">'+(root.extrasVisible?'Zusatzübungen ausblenden':'Zusatzübungen anzeigen')+'</button>';document.getElementById('proExtrasToggle').onclick=()=>{root.extrasVisible=!root.extrasVisible;saveSafe();patch()}
  }
  function simplifyChrome(st){const daily=document.getElementById('daily');if(daily)daily.hidden=true;const voice=document.getElementById('voiceState')?.closest('.audio');if(voice)voice.hidden=true;const speaking=document.querySelector('#learn .speaking');if(speaking)speaking.hidden=!['done'].includes(st.stage);const quiz=document.getElementById('startQuiz');if(quiz)quiz.hidden=st.stage!=='done';const next=document.getElementById('next');if(next)next.hidden=st.stage!=='done'}
  function patch(){
    updateTheme();patchStaticCopy();optionalModules();if(guidedAlphabet()){document.getElementById('professionalLessonCoach')?.remove();document.getElementById('professionalRecall')?.remove();return}if(!contentLesson())return;
    const cards=[...document.querySelectorAll('#cards .word')];if(!cards.length)return;const st=dayState();lessonCoach(cards);simplifyChrome(st);renderRecall()
  }
  const css=document.createElement('style');css.textContent=`
    body.professional-path{--b:#2f7d57;--d:#174a35;--l:#d9eadf;--g:#2f7d57;background:#f3f8f4}
    body.professional-path .primary{background:#2f7d57;box-shadow:0 5px 12px #2f7d5730}body.professional-path .secondary{background:#e8f3eb;color:#174a35}
    body.professional-path .tab[aria-selected=true]{background:#2f7d57}body.professional-path .progress i{background:#2f7d57}
    .pro-coach,.pro-recall{margin:14px 0;padding:16px;border:1px solid #d7e8dc;border-radius:18px;background:#f8fcf9}.pro-top{display:flex;align-items:flex-start;justify-content:space-between;gap:14px}.pro-top h3,.pro-recall h3,.pro-extras h3{margin:3px 0 5px;font-size:1.18rem;color:#174a35}.pro-top p,.pro-recall p,.pro-extras p{margin:0;color:#60756a;font-size:.9rem}.pro-eyebrow{font-size:.74rem;font-weight:900;letter-spacing:.06em;text-transform:uppercase;color:#2f7d57}.pro-dots{display:flex;gap:5px;margin-top:5px}.pro-dots i{width:8px;height:8px;border-radius:50%;background:#d7e4da}.pro-dots i.on{background:#2f7d57}.pro-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:13px}.pro-load{display:flex;gap:6px;margin-top:10px}.pro-load span,.pro-repeat-badge{display:inline-block;border-radius:99px;background:#edf6ef;color:#466252;font-size:.7rem;font-weight:800;padding:3px 7px}.pro-repeat-badge{position:absolute;left:10px;bottom:10px}.word{position:relative}.pro-recall .typing-input{text-align:left;font-size:1.05rem;margin-top:10px}.pro-extras{border-color:#dbe8df;background:#fbfdfb}body:not(.pro-translit-on) #cards .pronunciation,body:not(.pro-translit-on) #cards>.trans{display:none!important}
    @media(max-width:560px){.pro-top{display:block}.pro-dots{margin:8px 0}.pro-actions>*{width:100%}}
  `;document.head.append(css);
  const previousRender=render;render=function(){const out=previousRender.apply(this,arguments);patch();return out};
  window.UKRAINIAN_PROFESSIONAL_PATH={version:VERSION,coversEveryLesson:true,lessonCount:COURSE_LENGTH,mutatesLessonData:false,progressiveReveal:true,coreChunkSize:3,transliterationEmergencyOnly:true,duplicatesMarked:true,optionalModulesCollapsed:true,activeRecallBeforeLegacyQuiz:true,greenSystemTheme:true,audit:()=>audit.map(x=>({...x}))};
  ensure();patch();
})();
