'use strict';

// Add an optional isolated human-audio cue to sound-to-letter questions without
// changing scoring. The textual sound description remains the fallback, so a
// network/audio failure can never turn this into an unanswerable question.
const renderExamQuestionCueBase=renderExam;
renderExam=function(){
  const out=renderExamQuestionCueBase();
  if(screen!=='exam'||!session)return out;
  const t=currentTask();
  if(!t||t.type!=='reverse'||!t.letterAudioAvailable||t.letter==='Ь')return out;
  const stage=app.querySelector('.stage'),promptEl=stage?.querySelector('.prompt');
  if(!stage||!promptEl||stage.querySelector('#playLetterCue'))return out;
  const row=document.createElement('div');
  row.className='audio-row reverse-audio-row';
  row.innerHTML='<button class="btn" id="playLetterCue" type="button">🔊 Laut anhören</button><span id="letterCueStatus" class="muted" role="status" aria-live="polite"></span>';
  promptEl.insertAdjacentElement('afterend',row);
  const button=row.querySelector('#playLetterCue'),status=row.querySelector('#letterCueStatus');
  button.onclick=()=>playOptionalLetterCue(t,button,status);
  return out
};

function playOptionalLetterCue(t,button,status){
  const src=window.UKRAINIAN_LETTER_AUDIO?.[t.letter];
  if(!src){status.textContent='Keine isolierte menschliche Aufnahme verfügbar.';return}
  timing.invalid=true;
  const tracked=createAlphabetAudio(src),a=tracked.audio,qid=t.questionId;
  let settled=false;
  const current=()=>tracked.isCurrent()&&session&&currentTask()?.questionId===qid&&document.contains(button);
  const finish=message=>{if(current()){button.disabled=false;status.textContent=message}tracked.release()};
  const timeout=setTimeout(()=>{if(settled||!current())return;settled=true;a.pause?.();finish('Audio nicht erreichbar. Nutze die Lautbeschreibung.')},9000);
  button.disabled=true;status.textContent='Lädt …';
  a.onplay=()=>{if(current())status.textContent='Audio läuft …'};
  a.onended=()=>{if(settled||!current())return;settled=true;clearTimeout(timeout);finish('Nochmal anhören')};
  a.onerror=()=>{if(settled||!current())return;settled=true;clearTimeout(timeout);finish('Audio nicht erreichbar. Nutze die Lautbeschreibung.')};
  a.play().catch(()=>{if(settled||!current())return;settled=true;clearTimeout(timeout);finish('Tippe erneut, um den Laut abzuspielen.')})
}
