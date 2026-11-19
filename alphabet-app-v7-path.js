'use strict';

// V7 · Lernpfad – Oberfläche.
//
// Der Pfad ist der Haupteinstieg: kurze Lektionen, in denen ein Zeichen erst
// gezeigt, dann sofort ausprobiert und danach in echten Wörtern gelesen wird.
// Die adaptive Engine bleibt vollständig erhalten und liegt auf der Startseite
// unter „Vertiefen & Prüfen“.
//
// Pfadfortschritt liegt bewusst in einem eigenen Schlüssel: Er ist klein, hat
// eine eigene Migration (LearningPath.normalizeProgress) und darf die
// Engine-Zustandsmigration nicht berühren. Buchstabenantworten fließen
// zusätzlich über C.recordAnswer in die Engine, damit „Mein Training“ nach dem
// Pfad nicht bei null anfängt.

// PATH_API ist null, wenn alphabet-path-data.js nicht geladen werden konnte.
// Dann wird unten nichts eingehängt und die bisherige Startseite bleibt stehen.
const PATH_API=C.LearningPath||null,PATH_STORAGE='uk-alpha-path-v1';
let PATH=loadPathProgress(),pathRun=null,pathTimer=0;

function loadPathProgress(){
  if(!PATH_API)return null;
  try{return PATH_API.normalizeProgress(JSON.parse(localStorage.getItem(PATH_STORAGE)||'null'))}
  catch(_){return PATH_API.freshProgress()}
}
function savePathProgress(){
  try{localStorage.setItem(PATH_STORAGE,JSON.stringify(PATH));return true}
  catch(err){console.error('Lernpfad konnte nicht gespeichert werden',err);if(typeof setPersistWarning==='function')setPersistWarning('Lernstand konnte auf diesem Gerät gerade nicht gespeichert werden.');return false}
}
function resetPathProgress(){try{localStorage.removeItem(PATH_STORAGE)}catch(_){}PATH=PATH_API?PATH_API.freshProgress():null;pathRun=null}

function pathWordAudioSource(word){
  const key=alphabetWordNorm(word),meta=window.UKRAINIAN_WORD_AUDIO_META?.[key];
  return meta?.human&&meta?.sourceVerified&&meta?.language==='uk'?(window.UKRAINIAN_WORD_AUDIO?.[key]||''):'';
}
function pathLetterAudioSource(letter){
  return window.AlphabetAudioLifecycle?.verifiedHumanSource?.(letter,'letter')?(window.UKRAINIAN_LETTER_AUDIO?.[letter]||''):'';
}
// Nur menschliche Originalaufnahmen. Schlägt das Laden fehl, bleibt es still –
// im Pfad ist Ton eine Hilfe, keine Sperre, und nie ein TTS-Ersatz.
function pathPlay(src){
  if(!src)return false;
  try{
    const tracked=createAlphabetAudio(src),audio=tracked.audio;
    audio.onended=()=>tracked.release();
    audio.onerror=()=>tracked.release();
    const started=audio.play();
    if(started&&typeof started.catch==='function')started.catch(()=>tracked.release());
  }catch(_){return false}
  return true;
}

function pathLessonState(index){
  const lesson=PATH_API.LESSONS[index],next=PATH_API.nextLessonIndex(PATH);
  if(PATH.done[lesson.id])return 'done';
  return index===next?'current':'locked';
}
function startPathLesson(index){
  if(pathLessonState(index)==='locked')return false;
  pathRun={...PATH_API.buildLesson(index,PATH,Math.random),pos:0,results:[],mistakes:0,locked:false};
  screen='path';session=null;render();window.scrollTo?.(0,0);return true;
}
// Kurztest: nur für die nächste offene Lektion – wer besteht, überspringt sie.
function startPathCheck(index){
  if(pathLessonState(index)!=='current')return false;
  const run=PATH_API.buildCheck(index,PATH,Math.random);
  if(!run)return false;
  pathRun={...run,pos:0,results:[],mistakes:0,locked:false};
  screen='path';session=null;render();window.scrollTo?.(0,0);return true;
}
function startPathPractice(){
  const run=PATH_API.buildPractice(PATH,Math.random,10);
  if(!run)return false;
  pathRun={...run,pos:0,results:[],mistakes:0,locked:false};
  screen='path';session=null;render();window.scrollTo?.(0,0);return true;
}

function pathHighlight(word,letter){
  const lower=C.DATA[letter]?.lower;
  return [...String(word)].map(ch=>ch.toLocaleLowerCase('uk')===lower?`<mark>${esc(ch)}</mark>`:esc(ch)).join('');
}
function pathOptionsMarkup(step){
  const letters=step.type==='letter',words=step.type==='find';
  return `<div class="answers path-answers${letters?' letter-answers':''}${words?' path-word-answers':''}">${step.options.map((option,i)=>`<button class="answer" data-path-ans="${i}"${letters||words?' lang="uk"':''}><span class="kbd">${i+1}</span>${letters?`<strong>${esc(option)}</strong>`:esc(option)}</button>`).join('')}</div>`;
}
function pathStepMarkup(step){
  if(step.type==='teach'){
    const hasAudio=!!pathLetterAudioSource(step.letter);
    return `<div class="eyebrow center">Neuer Buchstabe · ${step.position} von ${step.total}</div>
<div class="path-letter" lang="uk"><b>${esc(step.letter)}</b><span>${esc(step.lower)}</span></div>
<div class="path-say">klingt wie <strong>${esc(step.say)}</strong></div>
<p class="path-hint">${esc(step.hint)}</p>
${step.example?`<div class="path-example"><span lang="uk">${pathHighlight(step.example.w,step.letter)}</span><small>${esc(step.example.de)}</small></div>`:''}
<div class="actions path-actions">${hasAudio?'<button class="btn" id="pathListen" type="button">🔊 Anhören</button>':''}<button class="btn primary xl" id="pathNext" type="button">Weiter</button></div>`;
  }
  if(step.type==='sound')return `<div class="big-letter path-big" lang="uk">${esc(step.letter)}</div><div class="prompt">${esc(step.prompt)}</div>${pathOptionsMarkup(step)}`;
  if(step.type==='letter')return `<div class="prompt">${esc(step.prompt)}</div>${pathOptionsMarkup(step)}`;
  if(step.type==='read'||step.type==='say')return `<div class="path-word" lang="uk">${esc(step.display)}</div><div class="prompt">${esc(step.prompt)}</div>${pathOptionsMarkup(step)}`;
  if(step.type==='find')return `<div class="prompt">${esc(step.prompt)}</div>${pathOptionsMarkup(step)}`;
  if(step.type==='build')return `<div class="prompt">${esc(step.prompt)}</div>
<div class="path-slots" id="pathSlots" lang="uk" aria-label="Dein Wort">${step.answer.map((_,i)=>`<button class="path-slot" data-path-slot="${i}" type="button" aria-label="Position ${i+1} leeren"></button>`).join('')}</div>
<div class="path-tiles" id="pathTiles" lang="uk">${step.tiles.map((ch,i)=>`<button class="path-tile" data-path-tile="${i}" type="button">${esc(ch)}</button>`).join('')}</div>`;
  return '';
}
function pathBreakdownMarkup(step){
  if(!step.breakdown)return '';
  return `<div class="path-breakdown" lang="uk">${step.breakdown.map(part=>`<span><b>${esc(part.ch)}</b><small lang="de">${esc(part.say||'·')}</small></span>`).join('')}</div>`;
}

function renderPathStep(){
  const run=pathRun;
  if(!run){screen='home';return render()}
  const step=run.steps[run.pos];
  if(!step)return finishPathRun();
  run.locked=false;
  const percent=Math.round(run.pos/run.steps.length*100);
  shell(`<div class="lesson path-lesson"><div class="lesson-head"><button class="btn" id="pathQuit" type="button" aria-label="Lektion beenden">✕</button><div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${percent}" aria-label="Fortschritt in dieser Lektion"><i style="width:${percent}%"></i></div><button class="btn small" id="pathSound" type="button" aria-pressed="${PATH.sound?'true':'false'}" aria-label="${PATH.sound?'Automatischen Ton ausschalten':'Automatischen Ton einschalten'}">${PATH.sound?'🔊':'🔇'}</button></div>
<section class="card stage path-stage" data-path-step="${esc(step.type)}">${pathStepMarkup(step)}<div id="pathFeedback" class="path-feedback" role="status" aria-live="polite"></div></section></div>`,{navVisible:false});
  document.getElementById('pathQuit').onclick=()=>{pathRun=null;screen='home';render()};
  document.getElementById('pathSound').onclick=()=>{PATH.sound=!PATH.sound;savePathProgress();renderPathStep()};
  wirePathStep(step);
}

function wirePathStep(step){
  if(step.type==='teach'){
    const src=pathLetterAudioSource(step.letter),listen=document.getElementById('pathListen');
    if(listen){const meta=window.UKRAINIAN_LETTER_AUDIO_META?.[step.letter];if(meta)markHumanAudioButton(listen,meta);listen.onclick=()=>pathPlay(src)}
    if(PATH.sound&&src&&!step.played){step.played=true;pathPlay(src)}
    const next=document.getElementById('pathNext');
    next.onclick=()=>{pathRun.results.push({step,good:true});advancePath()};
    next.focus?.({preventScroll:true});
    return;
  }
  if(step.type==='build')return wirePathBuild(step);
  app.querySelectorAll('[data-path-ans]').forEach(button=>button.onclick=()=>answerPathStep(step,step.options[Number(button.dataset.pathAns)],button));
}

function wirePathBuild(step){
  const chosen=[];
  const slots=[...app.querySelectorAll('[data-path-slot]')],tiles=[...app.querySelectorAll('[data-path-tile]')];
  const paint=()=>{
    slots.forEach((slot,i)=>{const tile=chosen[i];slot.textContent=tile===undefined?'':step.tiles[tile];slot.classList.toggle('filled',tile!==undefined)});
    tiles.forEach((tile,i)=>{const used=chosen.includes(i);tile.disabled=used;tile.classList.toggle('used',used)});
  };
  tiles.forEach((tile,i)=>tile.onclick=()=>{
    if(pathRun.locked||chosen.length>=step.answer.length)return;
    chosen.push(i);paint();
    if(chosen.length===step.answer.length)answerPathStep(step,chosen.map(index=>step.tiles[index]).join(''),null);
  });
  slots.forEach((slot,i)=>slot.onclick=()=>{if(pathRun.locked||chosen[i]===undefined)return;chosen.splice(i,1);paint()});
  paint();
}

function recordPathEvidence(step,good,value){
  // Nur Erstversuche zu einzelnen Buchstaben sind Evidenz für die Engine.
  if(step.retry||(step.type!=='sound'&&step.type!=='letter'))return;
  try{
    const visual=step.type==='sound';
    C.recordAnswer(S,{attemptId:C.id('path'),letter:step.letter,skill:visual?'visualToSound':'soundToLetter',type:visual?'visual':'reverse',kind:visual?'visual':'reverse',family:`path-${step.type}`,evidenceWeight:.6,firstAttempt:true,isRepair:false,selected:String(value),expected:String(step.correct),good,confusedWith:!good&&!visual&&C.ALPHABET.includes(value)?value:'',latencyMs:0,latencyValid:false,now:Date.now(),source:'path'});
    persist();
  }catch(err){console.error('Lernpfad: Antwort konnte nicht an die Engine übergeben werden',err)}
}

function answerPathStep(step,value,button){
  const run=pathRun;
  if(!run||run.locked)return;
  run.locked=true;
  const good=value===step.correct;
  run.results.push({step,good});
  recordPathEvidence(step,good,value);
  if(!good){
    run.mistakes++;
    // Fehler kommen wieder – später und in anderer Form.
    // Im Kurztest nicht: der misst nur, er übt nicht.
    const retry=run.kind==='check'?null:PATH_API.retryStep(step,run,Math.random);
    if(retry)run.steps.splice(Math.min(run.steps.length,run.pos+4),0,retry);
  }
  app.querySelectorAll('[data-path-ans]').forEach(option=>{
    option.disabled=true;
    const optionValue=step.options[Number(option.dataset.pathAns)];
    if(optionValue===step.correct)option.classList.add('correct');
    else if(option===button)option.classList.add('wrong');
  });
  app.querySelectorAll('[data-path-tile],[data-path-slot]').forEach(element=>element.disabled=true);
  if(step.type==='build')app.querySelector('#pathSlots')?.classList.add(good?'correct':'wrong');
  const feedback=document.getElementById('pathFeedback'),wordStep=!!step.word;
  const quick=good&&!wordStep;
  if(quick){
    feedback.innerHTML='<strong class="good-text">Richtig!</strong>';
    pathTimer=setTimeout(advancePath,650);
    return;
  }
  const audio=wordStep?pathWordAudioSource(step.word):'';
  const head=good?'<strong class="good-text">Richtig!</strong>':'<strong class="bad-text">Noch nicht ganz.</strong>';
  const body=wordStep
    ?`<div class="path-solution"><span lang="uk">${esc(step.word)}</span> = ${esc(step.meaning)}</div>${pathBreakdownMarkup(step)}`
    :`<p>${esc(step.explain||'')}</p>`;
  feedback.innerHTML=`${head}${body}<div class="actions path-actions">${audio?'<button class="btn" id="pathListenWord" type="button">🔊 Original</button>':''}<button class="btn primary xl" id="pathNext" type="button">Weiter</button></div>`;
  const listen=document.getElementById('pathListenWord');
  if(listen){const meta=window.UKRAINIAN_WORD_AUDIO_META?.[alphabetWordNorm(step.word)];if(meta)markHumanAudioButton(listen,meta);listen.onclick=()=>pathPlay(audio)}
  if(audio&&PATH.sound)pathPlay(audio);
  const next=document.getElementById('pathNext');
  next.onclick=advancePath;
  next.focus?.({preventScroll:true});
  feedback.scrollIntoView?.({block:'nearest',behavior:'smooth'});
}

function advancePath(){
  clearTimeout(pathTimer);pathTimer=0;
  if(!pathRun)return;
  pathRun.pos++;
  if(pathRun.pos>=pathRun.steps.length)return finishPathRun();
  renderPathStep();window.scrollTo?.(0,0);
}

function finishPathRun(){
  const run=pathRun;
  if(!run)return;
  run.passed=run.kind==='check'?PATH_API.checkPassed(run,run.results):true;
  PATH_API.applyResult(PATH,run,run.results,Date.now());
  savePathProgress();
  if(run.kind==='lesson'||(run.kind==='check'&&run.passed)){
    // Die Engine kennt die Buchstaben jetzt ebenfalls.
    try{const lesson=PATH_API.LESSONS[run.index];S.learningPlan.introducedLetters=C.uniq([...(S.learningPlan.introducedLetters||[]),...lesson.letters]);persist()}catch(err){console.error('Lernpfad: Lernfeld konnte nicht erweitert werden',err)}
  }
  run.finished=true;
  screen='pathDone';render();window.scrollTo?.(0,0);
}

function renderPathDone(){
  const run=pathRun;
  if(!run||!run.finished){screen='home';return render()}
  stopAlphabetAudio();
  const answered=run.results.filter(result=>result.step.type!=='teach'&&!result.step.retry);
  const firstTry=answered.filter(result=>result.good).length;
  const words=C.uniq(run.results.filter(result=>result.step.word).map(result=>result.step.word)).map(text=>PATH_API.WORDS.find(word=>word.w===text));
  const known=PATH_API.knownLetters(PATH).length,next=PATH_API.nextLessonIndex(PATH);
  const check=run.kind==='check',failed=check&&!run.passed;
  const lesson=run.kind!=='practice'&&!failed?PATH_API.LESSONS[run.index]:null;
  const finale=next<0&&!!lesson&&run.index===PATH_API.LESSONS.length-1;
  const title=run.kind==='practice'?(run.review?'Wiederholung geschafft':'Lesetraining geschafft'):failed?'Noch nicht ganz':finale?'Du kannst Ukrainisch lesen!':check?`Lektion ${run.index+1} übersprungen`:`Lektion ${run.index+1} geschafft`;
  const lead=run.kind==='practice'
    ?(run.review?`${words.length} Wörter wiederholt – jedes in einer anderen Aufgabenform als beim letzten Mal.`:`${words.length} neue Wörter gelesen – alle mit Buchstaben, die du schon kennst.`)
    :failed
      ?`${answered.length-firstTry} Fehler – einer wäre erlaubt gewesen. Die Lektion dauert fünf Minuten und klärt genau diese Zeichen.`
      :finale
        ?'Alle 33 Buchstaben sind eingeführt. Ab jetzt hältst du sie mit kurzen Lesetrainings frisch.'
        :`${check?'Kurztest bestanden. ':''}Du kennst jetzt ${known} von 33 Buchstaben.`;
  const primary=next>=0
    ?`<button class="btn primary xl" id="pathContinue" type="button">${failed?`Lektion ${next+1} starten`:`Weiter: Lektion ${next+1}`}</button>`
    :`<button class="btn primary xl" id="pathPracticeAgain" type="button">${PATH_API.freshWords(PATH).length<PATH_API.FRESH_MINIMUM?'Wiederholung':'Lesetraining'}</button>`;
  shell(`<div class="lesson path-lesson"><section class="card path-done" data-path-result="${failed?'failed':'passed'}"><div class="path-done-badge" aria-hidden="true">${finale?'🏆':failed?'📘':check?'⚡':'🎉'}</div><h1>${esc(title)}</h1><p class="muted">${esc(lead)}</p>
${lesson?`<div class="path-new-letters" lang="uk" aria-label="Neue Buchstaben">${lesson.letters.map(letter=>`<span><b>${esc(letter)}</b><small lang="de">${esc(PATH_API.LETTER_INFO[letter].say)}</small></span>`).join('')}</div>`:''}
<div class="path-result-grid"><div><span>auf Anhieb richtig</span><b>${firstTry} von ${answered.length}</b></div><div><span>Wörter gelesen</span><b>${words.length}</b></div><div><span>Buchstaben</span><b>${known} / 33</b></div></div>
${words.length?`<h2>Das hast du gerade gelesen</h2><ul class="path-word-list">${words.map(word=>`<li><span lang="uk">${esc(word.w)}</span><small>${esc(word.de)}</small></li>`).join('')}</ul>`:''}
<div class="actions path-actions">${primary}<button class="btn" id="pathHome" type="button">Zur Übersicht</button></div></section></div>`,{navVisible:false});
  document.getElementById('pathHome').onclick=()=>{pathRun=null;screen='home';render()};
  document.getElementById('pathContinue')?.addEventListener('click',()=>startPathLesson(next));
  document.getElementById('pathPracticeAgain')?.addEventListener('click',()=>startPathPractice());
  (document.getElementById('pathContinue')||document.getElementById('pathPracticeAgain'))?.focus?.({preventScroll:true});
}

function pathHomeMarkup(){
  const done=PATH_API.doneCount(PATH),next=PATH_API.nextLessonIndex(PATH),known=PATH_API.knownLetters(PATH).length,read=PATH_API.wordsRead(PATH);
  const lesson=next>=0?PATH_API.LESSONS[next]:null;
  // Ehrlich beschriften: „Lesetraining“ heißt neue Wörter. Sind sie aufgebraucht,
  // heißt der Knopf „Wiederholung“ – und sagt, wo es Neues gibt.
  const fresh=PATH_API.freshWords(PATH).length,review=fresh<PATH_API.FRESH_MINIMUM;
  const practiceLabel=review?'Wiederholung':`Lesetraining · ${fresh} neue Wörter`;
  const hero=lesson
    ?`<section class="card hero path-hero"><div class="eyebrow">Dein Lernpfad · ${done} von ${PATH_API.LESSONS.length} Lektionen</div><h1>${next===0?'Ukrainisch lesen lernen':esc(lesson.title)}</h1><p>${next===0?'Acht kurze Lektionen. Du startest mit sechs Buchstaben, die du schon kennst – und liest nach fünf Minuten deine ersten Wörter.':esc(lesson.tagline)}</p><div class="path-preview" lang="uk" aria-label="Buchstaben dieser Lektion">${lesson.letters.map(letter=>`<span>${esc(letter)}</span>`).join('')}</div><div class="actions"><button class="btn primary xl" id="pathStart" type="button">${next===0?'LOS GEHT’S':`LEKTION ${next+1} STARTEN`}</button>${done?`<button class="btn" id="pathPractice" type="button" data-path-practice="${review?'review':'fresh'}">${practiceLabel}</button>`:''}</div><p class="muted path-meta">≈ 5 Minuten · ${known} von 33 Buchstaben${read.length?` · ${read.length} Wörter gelesen`:''}${done&&review?' · neue Wörter gibt es in der nächsten Lektion':''}</p><button class="path-skip" id="pathCheck" type="button">Kenne ich schon – Kurztest statt Lektion</button></section>`
    :`<section class="card hero path-hero"><div class="eyebrow">Lernpfad abgeschlossen</div><h1>Du kannst Ukrainisch lesen.</h1><p>${review?`Du hast alle ${PATH_API.WORDS.length} Wörter gelesen. Die Wiederholung holt die ältesten zurück – jedes in einer anderen Aufgabenform als beim letzten Mal.`:`Halte es frisch: Jedes Lesetraining bringt Wörter, die du noch nie gelesen hast. ${fresh} warten noch.`}</p><div class="actions"><button class="btn primary xl" id="pathPractice" type="button" data-path-practice="${review?'review':'fresh'}">${review?'WIEDERHOLUNG STARTEN':'LESETRAINING STARTEN'}</button></div><p class="muted path-meta">33 von 33 Buchstaben · ${read.length} von ${PATH_API.WORDS.length} Wörtern gelesen</p></section>`;
  const list=`<section class="card"><div class="section-title"><h2>Der Weg</h2><small>33 Buchstaben in 8 Lektionen</small></div><ol class="path-list">${PATH_API.LESSONS.map((row,index)=>{const state=pathLessonState(index);return `<li><button class="path-row ${state}" data-path-lesson="${index}" type="button" ${state==='locked'?'disabled':''} aria-label="Lektion ${index+1}: ${esc(row.title)}${state==='done'?', abgeschlossen – nochmal üben':state==='locked'?', noch gesperrt':', jetzt starten'}"><span class="path-badge" aria-hidden="true">${state==='done'?'✓':state==='locked'?'🔒':index+1}</span><span class="path-row-text"><b>${esc(row.title)}</b><small lang="uk">${row.letters.join(' ')}</small></span><span class="path-row-action">${state==='done'?'Nochmal':state==='current'?'Start':''}</span></button></li>`}).join('')}</ol></section>`;
  const recent=read.slice().sort((a,b)=>(PATH.words[b.w]?.last||0)-(PATH.words[a.w]?.last||0)).slice(0,12);
  const trophy=read.length?`<section class="card"><div class="section-title"><h2>Das kannst du schon lesen</h2><small>${read.length} Wörter</small></div><div class="path-chips">${recent.map(word=>`<span><b lang="uk">${esc(word.w)}</b><small>${esc(word.de)}</small></span>`).join('')}</div>${read.length>recent.length?`<p class="muted path-meta">und ${read.length-recent.length} weitere</p>`:''}</section>`:'';
  return hero+list+trophy;
}

if(PATH_API)installLearningPath();

function installLearningPath(){
  const renderHomePathBase=renderHome;
  renderHome=function(){
    renderHomePathBase();
    const topbarEl=app.querySelector('.topbar'),navEl=app.querySelector('.bottom-nav');
    if(!topbarEl)return;
    // Die bisherige Startseite bleibt vollständig erhalten – eingeklappt, bis man sie braucht.
    const details=document.createElement('details');
    details.id='advancedHome';details.className='path-advanced';
    details.innerHTML='<summary><span>Vertiefen &amp; Prüfen</span><small>Adaptives Training, Prüfungen, Statistik</small></summary>';
    [...app.children].filter(node=>node!==topbarEl&&node!==navEl).forEach(node=>details.appendChild(node));
    const engineHistory=(S.answerLog?.length||0)>0||!!S.diagnostic;
    details.open=PATH.advancedOpen??(PATH_API.doneCount(PATH)===0&&engineHistory);
    details.querySelector('summary').addEventListener('click',()=>setTimeout(()=>{PATH.advancedOpen=details.open;savePathProgress()},0));
    const holder=document.createElement('div');
    holder.innerHTML=pathHomeMarkup();
    const fragment=document.createDocumentFragment();
    [...holder.children].forEach(node=>fragment.appendChild(node));
    fragment.appendChild(details);
    topbarEl.after(fragment);
    document.getElementById('pathStart')?.addEventListener('click',()=>startPathLesson(PATH_API.nextLessonIndex(PATH)));
    document.getElementById('pathPractice')?.addEventListener('click',()=>startPathPractice());
    document.getElementById('pathCheck')?.addEventListener('click',()=>startPathCheck(PATH_API.nextLessonIndex(PATH)));
    app.querySelectorAll('[data-path-lesson]').forEach(button=>button.onclick=()=>startPathLesson(Number(button.dataset.pathLesson)));
  };

  const renderPathBase=render;
  render=function(){
    clearTimeout(pathTimer);pathTimer=0;
    if(screen==='path'){stopAlphabetAudio();return renderPathStep()}
    if(screen==='pathDone')return renderPathDone();
    if(pathRun)pathRun=null;
    return renderPathBase();
  };

  document.addEventListener('keydown',event=>{
    if(screen!=='path'||!pathRun||event.metaKey||event.ctrlKey||event.altKey)return;
    if(event.key==='Enter'){const next=document.getElementById('pathNext');if(next&&document.activeElement!==next){event.preventDefault();next.click()}return}
    const number=Number(event.key);
    if(!Number.isInteger(number)||number<1)return;
    const option=app.querySelectorAll('[data-path-ans]')[number-1];
    if(option&&!option.disabled){event.preventDefault();option.click()}
  });

  window.AlphabetLabPath=Object.freeze({
    progress:()=>structuredClone(PATH),
    startLesson:startPathLesson,
    startPractice:startPathPractice,
    startCheck:startPathCheck,
    // Nur im Debugmodus: der aktuelle Schritt samt Lösung, für E2E-Tests.
    currentStep:()=>DEBUG_LEARNING&&pathRun?structuredClone(pathRun.steps[pathRun.pos]||null):null,
    runLength:()=>pathRun?pathRun.steps.length:0,
    freshWords:()=>PATH_API.freshWords(PATH).length
  });
}
