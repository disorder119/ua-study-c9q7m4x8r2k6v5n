'use strict';

let alphabetAudioGeneration=0,alphabetActiveAudio=null;
function stopAlphabetAudio(){alphabetAudioGeneration++;if(alphabetActiveAudio){try{alphabetActiveAudio.onended=null;alphabetActiveAudio.onerror=null;alphabetActiveAudio.onplay=null;alphabetActiveAudio.pause?.();alphabetActiveAudio.currentTime=0}catch(_){}}alphabetActiveAudio=null}
function createAlphabetAudio(src){stopAlphabetAudio();const generation=alphabetAudioGeneration,a=new Audio(src);alphabetActiveAudio=a;return {audio:a,isCurrent:()=>alphabetActiveAudio===a&&alphabetAudioGeneration===generation,release:()=>{if(alphabetActiveAudio===a)alphabetActiveAudio=null}}}
function humanAudioMeta(letter,kind='word'){return kind==='letter'?window.UKRAINIAN_LETTER_AUDIO_META?.[letter]:window.UKRAINIAN_PRONUNCIATION_META?.[letter]}
function verifiedHumanSource(letter,kind='word'){const meta=humanAudioMeta(letter,kind);return !!(meta?.human&&meta?.sourceVerified&&meta?.language==='uk'&&meta?.source)}
function markHumanAudioButton(button,meta){if(!button||!meta)return;button.dataset.audioSource='human';button.dataset.humanAudio='1';button.title=`Menschliche Originalaufnahme · ${meta.speaker||'Quelle geprüft'} · ${meta.project||''}`.trim()}

const renderMediaBase=render;
render=function(){stopAlphabetAudio();clearTimeout(memoryTimer);return renderMediaBase()};
const renderExamMediaBase=renderExam;
renderExam=function(){stopAlphabetAudio();clearTimeout(memoryTimer);return renderExamMediaBase()};

setupAudioQuestion=function(t){const button=document.getElementById('playAudio'),status=document.getElementById('audioStatus');if(!button||!status)return;const qid=t.questionId;button.onclick=()=>{if(!session||currentTask()?.questionId!==qid)return;playHumanExamAudio(t,button,status)}};
playHumanExamAudio=function(t,button,status){
  const useLetter=t.audioKind==='letter'||t.requiresHumanLetterAudio===true;
  const kind=useLetter?'letter':'word';
  const src=useLetter?window.UKRAINIAN_LETTER_AUDIO?.[t.letter]:window.UKRAINIAN_PRONUNCIATION_AUDIO?.[t.letter];
  const meta=humanAudioMeta(t.letter,kind);
  if(t.letter==='Ь'&&useLetter){handleAudioFailure(t,'Ь hat keinen eigenen isolierten Laut. Die Aufgabe wird durch Wortkontext ersetzt.');return}
  if(!src||!verifiedHumanSource(t.letter,kind)){handleAudioFailure(t,'Keine quellengeprüfte menschliche Originalaufnahme verfügbar.');return}
  markHumanAudioButton(button,meta);
  const tracked=createAlphabetAudio(src),a=tracked.audio,qid=t.questionId;button.disabled=true;status.textContent='Originalaufnahme lädt …';let startedAt=0,settled=false;
  const current=()=>tracked.isCurrent()&&session&&currentTask()?.questionId===qid;
  const timeout=setTimeout(()=>{if(settled||!current())return;settled=true;a.pause?.();tracked.release();handleAudioFailure(t,'Audio-Timeout. Die Frage wird nicht gewertet.')},9000);
  a.onplay=()=>{if(!current())return;startedAt=performance.now();status.textContent='Menschliche Originalaufnahme läuft …'};
  a.onended=()=>{if(settled||!current())return;settled=true;clearTimeout(timeout);tracked.release();timing.audioDurationMs=startedAt?Math.round(performance.now()-startedAt):0;beginTiming();status.textContent='Originalaufnahme vollständig gehört. Jetzt antworten.';app.querySelectorAll('[data-ans]').forEach(b=>b.disabled=false);button.disabled=false;t.audioValidated=true;t.audioSource='human';t.audioSourceKind=useLetter?'human-letter-original':'human-word-original';t.audioProvenance=meta?.source||''};
  a.onerror=()=>{if(settled||!current())return;settled=true;clearTimeout(timeout);tracked.release();handleAudioFailure(t,'Menschliche Originalaufnahme nicht erreichbar. Frage wird ersetzt.')};
  a.play().catch(()=>{if(settled||!current())return;settled=true;clearTimeout(timeout);tracked.release();button.disabled=false;status.textContent='Browser hat Audio blockiert. Tippe erneut auf „Audio starten“.'})
};

const handleAudioFailureMediaBase=handleAudioFailure;
handleAudioFailure=function(t,msg){if(!session||currentTask()?.questionId!==t.questionId)return;return handleAudioFailureMediaBase(t,msg)};

// Alphabet Lab is human-only: never substitute browser/system TTS or an AI voice.
// If the human file cannot be played, the learner gets no synthetic pronunciation.
playLearningAudio=function(c,button){const src=window.UKRAINIAN_PRONUNCIATION_AUDIO?.[c],meta=humanAudioMeta(c,'word');if(!src||!verifiedHumanSource(c,'word')){toast(`${c}: Keine quellengeprüfte menschliche Originalaufnahme verfügbar.`);if(button){button.dataset.audioSource='unavailable';button.title='Keine menschliche Originalaufnahme verfügbar'}return}markHumanAudioButton(button,meta);const tracked=createAlphabetAudio(src),a=tracked.audio;button.disabled=true;const current=()=>tracked.isCurrent()&&document.contains(button);const done=()=>{if(current())button.disabled=false;tracked.release()};a.onended=done;a.onerror=()=>{const valid=current();done();if(valid){button.dataset.audioSource='human-unavailable';toast('Menschliche Originalaufnahme konnte nicht geladen werden. Kein TTS-Ersatz.')}};a.play().catch(()=>{const valid=current();done();if(valid){button.dataset.audioSource='human-unavailable';toast('Originalaufnahme konnte nicht gestartet werden. Kein TTS-Ersatz.')}})};

setupAudioChoice=function(t){const heard=new Set(),failures={},all=t.audioChoiceLetters||t.options||[],status=document.getElementById('audioChoiceStatus'),qid=t.questionId;const current=()=>session&&currentTask()?.questionId===qid;const refresh=()=>{if(!current())return;if(status)status.textContent=`${heard.size}/${all.length} Originalaufnahmen gehört.${heard.size===all.length?' Jetzt auswählen.':''}`;if(heard.size===all.length){app.querySelectorAll('.audio-pick-candidate').forEach(b=>b.disabled=false);beginTiming()}};app.querySelectorAll('[data-play-letter-audio]').forEach(btn=>btn.onclick=()=>{if(!current())return;const letter=btn.dataset.playLetterAudio,src=window.UKRAINIAN_LETTER_AUDIO?.[letter],meta=humanAudioMeta(letter,'letter'),small=app.querySelector(`[data-audio-choice-status="${CSS.escape(letter)}"]`);if(!src||!verifiedHumanSource(letter,'letter')){fallbackAudioChoice(t,`Keine quellengeprüfte isolierte menschliche Buchstabenaufnahme für ${letter}.`);return}markHumanAudioButton(btn,meta);const tracked=createAlphabetAudio(src),a=tracked.audio;btn.disabled=true;if(small)small.textContent='Originalaufnahme lädt …';let settled=false;const valid=()=>current()&&tracked.isCurrent();const timeout=setTimeout(()=>{if(settled||!valid())return;settled=true;a.pause?.();tracked.release();fail()},9000);const fail=()=>{clearTimeout(timeout);if(!current())return;failures[letter]=(failures[letter]||0)+1;btn.disabled=false;if(small)small.textContent=failures[letter]<2?'Fehler · erneut versuchen':'nicht erreichbar';if(failures[letter]>=2)fallbackAudioChoice(t,`${letter}: menschliche Originalaufnahme zweimal nicht erreichbar.`)};a.onplay=()=>{if(valid()&&small)small.textContent='Originalaufnahme läuft …'};a.onended=()=>{if(settled||!valid())return;settled=true;clearTimeout(timeout);tracked.release();heard.add(letter);btn.disabled=false;if(small)small.textContent='Original gehört ✓';refresh()};a.onerror=()=>{if(settled||!valid())return;settled=true;tracked.release();fail()};a.play().catch(()=>{if(settled||!valid())return;settled=true;clearTimeout(timeout);tracked.release();btn.disabled=false;if(small)small.textContent='Tippen zum Starten'})});refresh()};
const fallbackAudioChoiceMediaBase=fallbackAudioChoice;
fallbackAudioChoice=function(t,msg){if(!session||currentTask()?.questionId!==t.questionId)return;return fallbackAudioChoiceMediaBase(t,msg)};
const replaceProductionAudioMediaBase=replaceProductionAudio;
replaceProductionAudio=function(t,msg){if(!session||session.productionCurrent?.questionId!==t.questionId)return;return replaceProductionAudioMediaBase(t,msg)};

window.AlphabetAudioLifecycle=Object.freeze({stop:stopAlphabetAudio,generation:()=>alphabetAudioGeneration,hasActive:()=>!!alphabetActiveAudio,policy:()=>window.UKRAINIAN_AUDIO_POLICY||null,verifiedHumanSource});
