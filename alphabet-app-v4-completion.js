'use strict';

const taskBodyCompletionBase=taskBody;
taskBody=function(t){
  if(t.interaction==='audioChoice'){
    return `<div class="big-letter">${esc(t.display)}</div><div class="prompt">${esc(t.prompt)}</div><p class="muted center">Höre alle vier menschlichen Buchstabenaufnahmen. Erst danach kannst du eine Aufnahme auswählen.</p><div class="audio-choice-grid">${(t.audioChoiceLetters||t.options||[]).map((c,i)=>`<div class="audio-choice-card"><button class="btn audio-play-candidate" data-play-letter-audio="${esc(c)}" aria-label="Aufnahme ${i+1} abspielen">▶ Aufnahme ${i+1}</button><button class="answer audio-pick-candidate" data-ans="${esc(c)}" disabled aria-label="Aufnahme ${i+1} als Antwort wählen"><span class="kbd">${i+1}</span>Diese Aufnahme wählen</button><small data-audio-choice-status="${esc(c)}">noch nicht gehört</small></div>`).join('')}</div><div id="audioChoiceStatus" class="feedback" role="status" aria-live="polite">0/${(t.audioChoiceLetters||[]).length} Aufnahmen gehört.</div>`;
  }
  return taskBodyCompletionBase(t)
};

function setupAudioChoice(t){
  const heard=new Set(),failures={},all=t.audioChoiceLetters||t.options||[],status=document.getElementById('audioChoiceStatus');
  const refresh=()=>{if(status)status.textContent=`${heard.size}/${all.length} Aufnahmen gehört.${heard.size===all.length?' Jetzt auswählen.':''}`;if(heard.size===all.length){app.querySelectorAll('.audio-pick-candidate').forEach(b=>b.disabled=false);beginTiming()}};
  app.querySelectorAll('[data-play-letter-audio]').forEach(btn=>btn.onclick=()=>{
    const letter=btn.dataset.playLetterAudio,src=window.UKRAINIAN_LETTER_AUDIO?.[letter],small=app.querySelector(`[data-audio-choice-status="${CSS.escape(letter)}"]`);
    if(!src){fallbackAudioChoice(t,`Keine isolierte menschliche Buchstabenaufnahme für ${letter}.`);return}
    btn.disabled=true;if(small)small.textContent='lädt …';const a=new Audio(src);let settled=false;const timeout=setTimeout(()=>{if(!settled){settled=true;a.pause?.();fail()}},9000);
    const fail=()=>{clearTimeout(timeout);failures[letter]=(failures[letter]||0)+1;btn.disabled=false;if(small)small.textContent=failures[letter]<2?'Fehler · erneut versuchen':'nicht erreichbar';if(failures[letter]>=2)fallbackAudioChoice(t,`${letter}: Buchstabenaufnahme zweimal nicht erreichbar.`)};
    a.onplay=()=>{if(small)small.textContent='läuft …'};
    a.onended=()=>{if(settled)return;settled=true;clearTimeout(timeout);heard.add(letter);btn.disabled=false;if(small)small.textContent='gehört ✓';refresh()};
    a.onerror=()=>{if(settled)return;settled=true;fail()};
    a.play().catch(()=>{if(settled)return;settled=true;clearTimeout(timeout);btn.disabled=false;if(small)small.textContent='Tippen zum Starten'})
  });
  refresh()
}
function fallbackAudioChoice(t,msg){
  if(session?.locked)return;toast(msg+' Frage wird ohne Audio ersetzt.');const replacement=C.makeAudioFallback(S,{...t,type:'audio'},session,Math.random);session.mainTasks[session.mainIndex]=replacement;setTimeout(renderExam,300)
}

const renderExamCompletionBase=renderExam;
renderExam=function(){renderExamCompletionBase();const t=session&&currentTask();if(t?.interaction==='audioChoice')setupAudioChoice(t)};

const renderExamMenuCompletionBase=renderExamMenu;
renderExamMenu=function(){renderExamMenuCompletionBase();const nav=app.querySelector('.bottom-nav'),card=document.createElement('section');card.className='card macro-card';card.innerHTML=`<div><div class="eyebrow">Adaptiver Langmodus</div><h2>20-Minuten Intensiv</h2><p>36 Hauptfragen in fünf adaptiven Phasen: Warm-up → Fehler & Schwächen → aktives Lernfeld → Mischprüfung → Automatisierung. Die konkreten Fragen werden weiterhin erst nach deiner letzten Antwort ausgewählt.</p></div><button class="btn primary" id="startMacro">INTENSIV STARTEN</button>`;(nav||app).insertAdjacentElement(nav?'beforebegin':'beforeend',card);document.getElementById('startMacro').onclick=startMacroTraining};
function startMacroTraining(){session=C.createMacroSession(S);screen='exam';renderExam()}

const whyHtmlCompletionBase=whyHtml;
whyHtml=function(t){const phase=session?.macro?C.macroPhase(session):null;return `${phase?`<div class="micro center"><strong>Phase: ${esc(phase.label)}</strong></div>`:''}${whyHtmlCompletionBase(t)}`};

let pronunciationObjectUrl='';
const renderDetailCompletionBase=renderDetail;
renderDetail=function(){renderDetailCompletionBase();appendPronunciationRecorder(selectedLetter||'А')};
function appendPronunciationRecorder(letter){
  const nav=app.querySelector('.bottom-nav'),section=document.createElement('section');section.className='card pronunciation-card';const isolated=C.isolatedHumanAudioSupported(letter);
  section.innerHTML=`<h2>🎙 Aussprache selbst vergleichen</h2><p>${isolated?'Höre zuerst die isolierte menschliche Buchstabenaussprache.':'Ь hat keinen eigenen Laut. Vergleiche hier nur die Aussprache im Referenzwort.'}</p><div class="actions"><button class="btn" id="micReference">🔊 Menschliche Referenz</button><button class="btn primary" id="micStart">● Aufnahme starten</button><button class="btn" id="micStop" disabled>■ Stoppen</button></div><audio id="micPlayback" controls hidden></audio><div id="micStatus" class="feedback" role="status" aria-live="polite">Keine Bewertung: Du hörst dich selbst zurück und vergleichst mit der Referenz. Die Aufnahme wird nicht hochgeladen und zählt nicht zur Mastery.</div>`;
  (nav||app).insertAdjacentElement(nav?'beforebegin':'beforeend',section);setupPronunciationRecorder(letter)
}
function setupPronunciationRecorder(letter){
  const ref=document.getElementById('micReference'),start=document.getElementById('micStart'),stop=document.getElementById('micStop'),playback=document.getElementById('micPlayback'),status=document.getElementById('micStatus');let recorder=null,stream=null,chunks=[],limitTimer=null;
  ref.onclick=()=>{const src=C.isolatedHumanAudioSupported(letter)?window.UKRAINIAN_LETTER_AUDIO?.[letter]:window.UKRAINIAN_PRONUNCIATION_AUDIO?.[letter];if(!src){status.textContent='Menschliche Referenz ist gerade nicht verfügbar.';return}const a=new Audio(src);status.textContent='Menschliche Referenz läuft …';a.onended=()=>status.textContent='Jetzt kannst du dich aufnehmen und direkt vergleichen.';a.onerror=()=>status.textContent='Referenz konnte technisch nicht geladen werden.';a.play().catch(()=>status.textContent='Tippe erneut auf die Referenz, falls der Browser Audio blockiert.')};
  const cleanup=()=>{clearTimeout(limitTimer);stream?.getTracks?.().forEach(t=>t.stop());stream=null;start.disabled=false;stop.disabled=true};
  start.onclick=async()=>{if(!navigator.mediaDevices?.getUserMedia||typeof MediaRecorder==='undefined'){status.textContent='Dieser Browser stellt hier keine Mikrofonaufnahme bereit.';return}try{stream=await navigator.mediaDevices.getUserMedia({audio:true});chunks=[];recorder=new MediaRecorder(stream);recorder.ondataavailable=e=>{if(e.data?.size)chunks.push(e.data)};recorder.onstop=()=>{const blob=new Blob(chunks,{type:recorder.mimeType||'audio/webm'});if(pronunciationObjectUrl)URL.revokeObjectURL(pronunciationObjectUrl);pronunciationObjectUrl=URL.createObjectURL(blob);playback.src=pronunciationObjectUrl;playback.hidden=false;status.textContent='Aufnahme fertig. Höre dich zurück und vergleiche mit der menschlichen Referenz – ohne automatische Note.';cleanup()};recorder.start();start.disabled=true;stop.disabled=false;status.textContent='Aufnahme läuft … maximal 5 Sekunden.';limitTimer=setTimeout(()=>{if(recorder?.state==='recording')recorder.stop()},5000)}catch(_){status.textContent='Mikrofonzugriff wurde nicht erlaubt oder ist nicht verfügbar.';cleanup()}};
  stop.onclick=()=>{if(recorder?.state==='recording')recorder.stop()}
}

const taskBodyStyle=document.createElement('style');taskBodyStyle.textContent=`.audio-choice-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin:18px 0}.audio-choice-card{border:1px solid var(--line,#d1d5db);border-radius:16px;padding:12px;display:grid;gap:9px}.audio-choice-card .answer{width:100%;min-height:52px}.audio-choice-card small{text-align:center;color:#6b7280}.pronunciation-card audio{width:100%;margin-top:14px}.macro-card{display:flex;gap:20px;align-items:center;justify-content:space-between}.macro-card>div{max-width:680px}@media(max-width:760px){.audio-choice-grid{grid-template-columns:1fr}.macro-card{display:block}.macro-card .btn{width:100%;margin-top:12px}}`;document.head.append(taskBodyStyle);
