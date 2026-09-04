/* Ukrainischkurs für Joel · Qualitäts-Härtung v5
   Behebt bekannte Lernlogikfehler und verhindert zu leichtes Abhaken der Aussprache. */
(() => {
  const ORDER='А Б В Г Ґ Д Е Є Ж З И І Ї Й К Л М Н О П Р С Т У Ф Х Ц Ч Ш Щ Ь Ю Я'.split(' ');
  const nativeMeta=window.UKRAINIAN_PRONUNCIATION_META||{};
  const HARD=['В','Г','Ґ','И','І','Ї','Р','Х','Ж','Ш','Щ','Ц','Ч'];
  streak=function(){
    const dates=[...new Set(s.dates||[])].sort().reverse();
    if(!dates.length)return 0;
    let cursor=new Date(),n=0;
    const today=dayKey(cursor);
    if(dates[0]!==today)return 0;
    for(const d of dates){if(d===dayKey(cursor)){n++;cursor.setDate(cursor.getDate()-1)}else if(d<dayKey(cursor))break}
    return n;
  };
  gameLetters=function(){const max=s.day<11?Math.min(33,(s.day+1)*3):33;return LETTERS.slice(0,max)};
  function leastPractised(limit=4){return [...HARD].sort((a,b)=>{const A=s.pronunciation?.letters?.[a]||{},B=s.pronunciation?.letters?.[b]||{};return ((A.recordings||0)+(A.checks||0)+(A.plays||0))-((B.recordings||0)+(B.checks||0)+(B.plays||0))}).slice(0,limit)}
  function currentTargets(){if(s.day<11)return ORDER.slice(s.day*3,Math.min(33,s.day*3+3));if(s.day===11)return ['Г','Ґ','И','І'];if(s.day===12)return ['Ж','Ш','Щ','Х'];if(s.day===13)return leastPractised(4);return []}
  function ensureGate(){if(!s.pronunciation||typeof s.pronunciation!=='object')s.pronunciation={};if(!s.pronunciation.qualityGate||s.pronunciation.qualityGate.date!==date()||s.pronunciation.qualityGate.day!==s.day)s.pronunciation.qualityGate={date:date(),day:s.day,manualProduced:[],micFallback:false};return s.pronunciation.qualityGate}
  function recordingSupported(){return !!(navigator.mediaDevices?.getUserMedia&&window.MediaRecorder)}
  function preferredProductionReady(){const d=s.pronunciation?.daily||{};return !!(d.recorded&&d.replayed&&d.selfPassed)}
  function manualReady(){const g=ensureGate(),targets=currentTargets();return targets.length>0&&targets.every(l=>g.manualProduced.includes(l))}
  function pronunciationGateReady(){if(s.day>=14)return true;const targets=currentTargets();if(!targets.length)return true;const d=s.pronunciation?.daily||{};if(!targets.every(l=>(d.reference||[]).includes(l)))return false;const g=ensureGate();if(preferredProductionReady())return true;return (!recordingSupported()||g.micFallback)&&manualReady()}
  function markManual(letter){const g=ensureGate();if(!g.manualProduced.includes(letter))g.manualProduced.push(letter);save();patchUi()}
  function markMicFailure(){const g=ensureGate();g.micFallback=true;save();patchUi()}
  function sourceLabel(m){return String(m?.project||'').includes('Lingua Libre')?'Muttersprachler-Referenz':'menschliche ukrainische Referenz'}
  function patchAttribution(){
    const coach=document.getElementById('pronCoach');if(!coach)return;
    const entries=currentTargets().map(l=>[l,nativeMeta[l]]).filter(x=>x[1]);
    let credit=document.getElementById('pronNativeCredit');
    if(!entries.length){if(credit)credit.hidden=true;return}
    if(!credit){credit=document.createElement('div');credit.id='pronNativeCredit';credit.className='small';credit.style.marginTop='10px';coach.append(credit)}
    credit.hidden=false;
    credit.innerHTML='<strong>Freie menschliche ukrainische Referenzen:</strong> '+entries.map(([l,m])=>'<a href="'+m.source+'" target="_blank" rel="noopener noreferrer">'+l+' · '+m.label+'</a> ('+m.speaker+')').join(' · ')+'<br>Lingua Libre bzw. Shtooka / Wikimedia Commons · Lizenz und Attribution auf der jeweiligen Quelldatei.';
  }
  function patchNativeLabels(){
    document.querySelectorAll('#pronMastery [data-pm-hear]').forEach(button=>{const letter=button.dataset.pmHear,m=nativeMeta[letter];if(m){button.textContent=String(m.project||'').includes('Lingua Libre')?'🎙️ Muttersprachler':'🎙️ Ukrainisch';button.title=sourceLabel(m)+': '+m.label+' · '+m.speaker+' · Wikimedia Commons'}});
    document.querySelectorAll('#pronCoach [data-pron-play]').forEach(button=>{const letter=button.dataset.pronPlay,m=nativeMeta[letter];if(!m)return;const old=button.onclick;button.textContent='🎙️ Wort';button.title=sourceLabel(m)+': '+m.label+' · '+m.speaker;button.onclick=()=>{const src=window.UKRAINIAN_PRONUNCIATION_AUDIO?.[letter];if(!src){old?.();return}const a=new Audio(src);a.play().catch(()=>old?.());const d=s.pronunciation?.daily;if(d&&!(d.reference||[]).includes(letter)){d.reference=[...(d.reference||[]),letter];save()}}});
    patchAttribution();
  }
  function patchManualPanel(){
    const coach=document.getElementById('pronCoach');if(!coach||s.day>=14)return;
    let box=document.getElementById('pronQualityGate');if(!box){box=document.createElement('div');box.id='pronQualityGate';box.className='pron-production';coach.append(box)}
    const targets=currentTargets(),g=ensureGate();if(!targets.length){box.hidden=true;return}box.hidden=false;
    const fallback=!recordingSupported()||g.micFallback;
    box.innerHTML='<strong>Produktionskontrolle</strong><p class="small">'+(fallback?'Manueller Fallback ist aktiv. Sprich jeden Ziellaut wirklich dreimal laut.':'Auf diesem Gerät ist Aufnahme verfügbar. Für den Pflichtteil zählen Aufnahme → Rückhören → A/B-Selbstvergleich. Der manuelle Fallback wird erst bei einem Mikrofonproblem freigeschaltet.')+'</p>'+(fallback?'<div class="actions">'+targets.map(l=>'<button class="secondary" data-qg-manual="'+l+'">'+(g.manualProduced.includes(l)?'✓ ':'')+l+' 3× gesprochen</button>').join('')+'</div>':'')+'<div class="small">Status: '+(pronunciationGateReady()?'✓ Produktionsnachweis vollständig':'noch offen')+'</div>';
    box.querySelectorAll('[data-qg-manual]').forEach(b=>b.onclick=()=>markManual(b.dataset.qgManual));
    const recordState=document.getElementById('pronRecordState');if(recordState&&!recordState.dataset.qgObserved){recordState.dataset.qgObserved='1';new MutationObserver(()=>{const t=(recordState.textContent||'').toLowerCase();if(t.includes('nicht verfügbar')||t.includes('nicht erlaubt')||t.includes('nicht freigegeben'))markMicFailure()}).observe(recordState,{childList:true,subtree:true,characterData:true})}
    const oldFallback=document.getElementById('pronManual');if(oldFallback)oldFallback.hidden=!fallback;
  }
  function patchUi(){const desc=document.querySelector('meta[name="description"]');if(desc)desc.content='Ukrainischkurs für Joel: adaptiver 14+-Alphabetweg mit Aussprache, Hören, Sprechen, Mastery-Checks und verteiltem Wiederholen.';patchNativeLabels();patchManualPanel();const streakEl=document.getElementById('streak');if(streakEl)streakEl.textContent=streak()+' Tage dran'}
  const previousRender=render;render=function(){previousRender();patchUi()};
  const previousSpoken=$('markSpoken').onclick;$('markSpoken').onclick=function(e){if(!pronunciationGateReady()){patchUi();document.getElementById('pronCoach')?.scrollIntoView({behavior:'smooth',block:'center'});toast('Aussprache noch offen: alle Ziellaute hören und die eigene Produktion vollständig vergleichen.');return}return previousSpoken?.call(this,e)};
  patchUi();
})();