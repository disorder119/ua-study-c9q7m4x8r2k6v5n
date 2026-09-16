'use strict';

// Any non-<audio> task that depends on pronunciation is human-audio-first.
// The answer stays locked until a source-verified Ukrainian human recording has
// finished. Technical audio failures never become learner errors and never fall
// back to browser TTS or an AI voice.
const renderExamQuestionCueBase=renderExam;
renderExam=function(){
  const out=renderExamQuestionCueBase();
  if(screen!=='exam'||!session)return out;
  const t=currentTask();
  if(!t||t.type==='audio'||t.requiresHumanLetterAudio!==true)return out;
  if(t.letter==='Ь'){
    replaceUnvoicedSoftSignTask(t);
    return out
  }
  const stage=app.querySelector('.stage'),promptEl=stage?.querySelector('.prompt');
  if(!stage||!promptEl||stage.querySelector('#playLetterCue'))return out;
  app.querySelectorAll('[data-ans]').forEach(b=>b.disabled=true);
  timing.startedAt=0;timing.invalid=true;
  const row=document.createElement('div');
  row.className='audio-row reverse-audio-row';
  row.innerHTML='<button class="btn primary" id="playLetterCue" type="button" aria-label="Menschliche Originalaufnahme anhören">🔊 Menschliche Originalaufnahme</button><span id="letterCueStatus" class="muted" role="status" aria-live="polite">Erst vollständig anhören, dann antworten.</span>';
  promptEl.insertAdjacentElement('afterend',row);
  const button=row.querySelector('#playLetterCue'),status=row.querySelector('#letterCueStatus');
  const meta=window.UKRAINIAN_LETTER_AUDIO_META?.[t.letter];
  if(meta)markHumanAudioButton(button,meta);
  button.onclick=()=>playRequiredLetterCue(t,button,status);
  return out
};

function playRequiredLetterCue(t,button,status){
  const src=window.UKRAINIAN_LETTER_AUDIO?.[t.letter],meta=window.UKRAINIAN_LETTER_AUDIO_META?.[t.letter];
  if(!src||!window.AlphabetAudioLifecycle?.verifiedHumanSource?.(t.letter,'letter')){
    replaceRequiredLetterCue(t,'Keine quellengeprüfte menschliche Originalaufnahme verfügbar.');return
  }
  const tracked=createAlphabetAudio(src),a=tracked.audio,qid=t.questionId;
  let settled=false;
  const current=()=>tracked.isCurrent()&&session&&currentTask()?.questionId===qid&&document.contains(button);
  const fail=message=>{if(!current())return;tracked.release();t.requiredHumanAudioFailures=(Number(t.requiredHumanAudioFailures)||0)+1;button.disabled=false;if(t.requiredHumanAudioFailures<2){status.textContent='Originalaufnahme technisch nicht erreichbar · bitte erneut versuchen.';toast(message)}else replaceRequiredLetterCue(t,`${message} Nach zwei Versuchen wird die Audiofrage ersetzt.`)};
  const timeout=setTimeout(()=>{if(settled||!current())return;settled=true;a.pause?.();fail('Audio-Timeout.')},9000);
  button.disabled=true;status.textContent='Originalaufnahme lädt …';
  a.onplay=()=>{if(current())status.textContent='Menschliche Originalaufnahme läuft …'};
  a.onended=()=>{if(settled||!current())return;settled=true;clearTimeout(timeout);tracked.release();t.audioValidated=true;t.audioSource='human';t.audioSourceKind='human-original';t.audioProvenance=meta?.source||'';timing.invalid=false;beginTiming();app.querySelectorAll('[data-ans]').forEach(b=>b.disabled=false);button.disabled=false;status.textContent='Originalaufnahme vollständig gehört. Jetzt antworten.'};
  a.onerror=()=>{if(settled||!current())return;settled=true;clearTimeout(timeout);fail('Menschliche Originalaufnahme nicht erreichbar.')};
  a.play().catch(()=>{if(settled||!current())return;settled=true;clearTimeout(timeout);tracked.release();button.disabled=false;status.textContent='Browser hat Audio blockiert. Tippe erneut auf „Menschliche Originalaufnahme“.'})
}

function replaceRequiredLetterCue(t,msg){
  if(!session||currentTask()?.questionId!==t.questionId)return;
  toast(`${msg} Kein Benutzerfehler; kein TTS-Ersatz.`);
  const replacement=C.buildV4Task(S,t.letter,t.skill||'soundToLetter',Math.max(1,Number(t.difficulty)||1),'visual-find',session,Math.random,{sessionId:session.sessionId,scheduledReason:'human-audio-unavailable',isRepair:!!t.isRepair,repairLevel:t.repairLevel,createdFromError:t.createdFromError});
  replacement.audioFallbackFrom=t.questionId;
  replacement.countsForMastery=false;
  replacement.evidenceWeight=0;
  if(t.isRepair&&session.repairCurrent)session.repairCurrent.task=replacement;else session.mainTasks[session.mainIndex]=replacement;
  setTimeout(renderExam,250)
}

function replaceUnvoicedSoftSignTask(t){
  if(!session||currentTask()?.questionId!==t.questionId||t._softSignReplacing)return;
  t._softSignReplacing=true;
  const replacement=C.buildV4Task(S,'Ь',t.skill||'soundToLetter',Math.max(1,Number(t.difficulty)||1),'missing-letter',session,Math.random,{sessionId:session.sessionId,scheduledReason:'soft-sign-context-no-isolated-sound',isRepair:!!t.isRepair,repairLevel:t.repairLevel,createdFromError:t.createdFromError});
  replacement.softSignContextual=true;
  if(t.isRepair&&session.repairCurrent)session.repairCurrent.task=replacement;else session.mainTasks[session.mainIndex]=replacement;
  setTimeout(renderExam,0)
}
