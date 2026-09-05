/* Ukrainischkurs für Joel · Learning State Guard v1
   Verankert den Kursstart an echter Lernaktivität, trennt Tagesstatus pro Lektion
   und erzwingt höchstens einen neuen Alphabet-Kurstag pro Kalendertag. */
(()=>{
  const VERSION=1,ALPHABET_DAYS=14;
  const lessonDay=()=>Math.max(0,Number(s.day)||0);
  const scopeKey=(d,day)=>String(d||'')+'|'+String(day);
  const validDate=x=>/^\d{4}-\d{2}-\d{2}$/.test(String(x||''));

  function evidenceDates(){
    const out=[];
    (s.dates||[]).forEach(x=>{if(validDate(x))out.push(x)});
    Object.values(s.lessonProgress||{}).forEach(p=>{
      if(!p||typeof p!=='object')return;
      for(const x of [p.completedDate,p.testDate])if(validDate(x))out.push(x);
    });
    Object.values(s.known||{}).forEach(m=>{
      if(!m||typeof m!=='object')return;
      (m.successDates||[]).forEach(x=>{if(validDate(x))out.push(x)});
      if(validDate(m.last))out.push(m.last);
      if(validDate(m.on)&&(Number(m.answers)||Number(m.reviews)||m.selfMarked))out.push(m.on);
    });
    return [...new Set(out)].sort();
  }
  function hasLearningEvidence(){
    if((s.dates||[]).length)return true;
    if(Object.values(s.history||{}).some(h=>(Number(h?.answers)||0)>0||(Number(h?.newItems)||0)>0||(Number(h?.reviews)||0)>0))return true;
    if(Object.values(s.known||{}).some(m=>m&&((Number(m.answers)||0)>0||(Number(m.reviews)||0)>0||m.selfMarked)))return true;
    return Object.values(s.lessonProgress||{}).some(p=>p&&(p.testPassed||p.spoken||p.reviewDone));
  }
  function repairCourseStart(){
    const before=String(s.courseStartDate||''),dates=evidenceDates();
    s.courseStartDate=dates[0]||(hasLearningEvidence()?before:'');
    return before!==String(s.courseStartDate||'');
  }

  const baseStudy=study;
  study=function(){
    if(!s.courseStartDate)s.courseStartDate=date();
    const out=baseStudy.apply(this,arguments);
    const dates=evidenceDates();if(dates.length)s.courseStartDate=dates[0];
    return out;
  };

  function dailyTemplate(d,day){return {...blank().daily,date:d,day}}
  function ensureDailyScoped(){
    const d=date(),day=lessonDay();
    if(!s.dailyByLesson||typeof s.dailyByLesson!=='object')s.dailyByLesson={};
    const current=s.daily&&typeof s.daily==='object'?s.daily:null;
    if(current){
      if(!Number.isFinite(Number(current.day))&&current.date===d)current.day=day;
      if(current.date&&Number.isFinite(Number(current.day)))s.dailyByLesson[scopeKey(current.date,Number(current.day))]={...current};
    }
    const wanted=s.dailyByLesson[scopeKey(d,day)];
    if(!current||current.date!==d||Number(current.day)!==day)s.daily=wanted?{...dailyTemplate(d,day),...wanted,date:d,day}:dailyTemplate(d,day);
    else s.daily={...dailyTemplate(d,day),...current,date:d,day};
    s.dailyByLesson[scopeKey(d,day)]={...s.daily};
    const keys=Object.keys(s.dailyByLesson);if(keys.length>80)keys.sort().slice(0,keys.length-80).forEach(k=>delete s.dailyByLesson[k]);
    return s.daily;
  }
  ensureDaily=ensureDailyScoped;

  function pronunciationTemplate(d,day){return {date:d,day,reference:[],recorded:false,replayed:false,selfPassed:false,manual:false,checked:false,checkPassed:false,contrastCorrect:0,contrastTotal:0}}
  function syncPronunciationDaily(){
    if(!s.pronunciation||typeof s.pronunciation!=='object')return;
    const d=date(),day=lessonDay();
    if(!s.pronunciation.dailyByLesson||typeof s.pronunciation.dailyByLesson!=='object')s.pronunciation.dailyByLesson={};
    const current=s.pronunciation.daily&&typeof s.pronunciation.daily==='object'?s.pronunciation.daily:null;
    if(current){
      if(!Number.isFinite(Number(current.day))&&current.date===d)current.day=day;
      if(current.date&&Number.isFinite(Number(current.day)))s.pronunciation.dailyByLesson[scopeKey(current.date,Number(current.day))]={...current,reference:[...(current.reference||[])]};
    }
    const wanted=s.pronunciation.dailyByLesson[scopeKey(d,day)];
    if(!current||current.date!==d||Number(current.day)!==day)s.pronunciation.daily=wanted?{...pronunciationTemplate(d,day),...wanted,date:d,day,reference:[...(wanted.reference||[])]}:pronunciationTemplate(d,day);
    else s.pronunciation.daily={...pronunciationTemplate(d,day),...current,date:d,day,reference:[...(current.reference||[])]};
    s.pronunciation.dailyByLesson[scopeKey(d,day)]={...s.pronunciation.daily,reference:[...(s.pronunciation.daily.reference||[])]};
    const keys=Object.keys(s.pronunciation.dailyByLesson);if(keys.length>80)keys.sort().slice(0,keys.length-80).forEach(k=>delete s.pronunciation.dailyByLesson[k]);
  }

  const baseSyncLesson=syncLesson;
  syncLesson=function(di){
    const p=s.lessonProgress?.[di];
    if(p&&lessonComplete(di)&&!validDate(p.completedDate))p.completedDate=validDate(p.testDate)?p.testDate:date();
    return baseSyncLesson(di);
  };
  syncLessons();

  function alphabetDayAllowed(di){
    di=Number(di);
    if(di<=0||di>=ALPHABET_DAYS||s.done?.[di])return true;
    if(!s.done?.[di-1])return false;
    const p=s.lessonProgress?.[di-1]||{},completed=validDate(p.completedDate)?p.completedDate:(validDate(p.testDate)?p.testDate:'');
    return !!completed&&completed<date();
  }

  calendar=function(){
    const b=$('calendar'),nextOpen=Math.min(D.length-1,completedLessons());if(!b)return;b.innerHTML='';
    D.forEach((d,i)=>{
      const alphabetLock=i>=ALPHABET_DAYS&&!alphabetReady(),sequenceLock=i>nextOpen,dateLock=i<ALPHABET_DAYS&&!alphabetDayAllowed(i),locked=alphabetLock||sequenceLock||dateLock,e=document.createElement('button');
      e.className='day '+(i===s.day?'now ':'')+(s.done[i]?'done ':'')+(locked?'locked ':'');
      e.innerHTML='Tag '+(i+1)+'<small>'+(dateLock?'öffnet morgen':alphabetLock?'Alphabet zuerst':sequenceLock?'erst die Reihe':s.done[i]?'✓ fertig':i===nextOpen?'jetzt':'wiederholen')+'</small>';
      e.title=dateLock?'Der nächste neue Alphabettag öffnet sich erst am nächsten Kalendertag.':alphabetLock?'Erst den Alphabet-Checkpoint und die Mastery-Nachweise bestehen':sequenceLock?'Schließe zuerst Tag '+(nextOpen+1)+' ab':d[0];
      e.onclick=()=>{
        if(dateLock){toast('Pro Kalendertag öffnet sich höchstens ein neuer Alphabettag. Wiederholen und Zusatzübungen bleiben möglich.');return}
        if(alphabetLock){requireAlphabet();return}
        if(sequenceLock){toast('Lerne zuerst Tag '+(nextOpen+1)+' – die App führt dich Schritt für Schritt.');return}
        s.day=i;ensureDailyScoped();syncPronunciationDaily();save();render();show('learn');
      };
      b.append(e);
    });
  };

  advanceLesson=function(){
    if(!s.done[s.day]){
      const p=lessonState(s.day),missing=!p.testPassed?'Bestehe zuerst den heutigen Abruf-Test.':!p.spoken?'Sprich die heutigen Laute bzw. die Reihe noch laut nach.':'Erledige zuerst die fälligen Wiederholungen.';toast(missing);return;
    }
    const next=s.day===D.length-1?0:s.day+1;
    if(next<ALPHABET_DAYS&&!alphabetDayAllowed(next)){toast('Der nächste neue Alphabettag öffnet sich erst am nächsten Kalendertag. Heute kannst du weiter wiederholen.');return}
    if(next>=ALPHABET_DAYS&&!requireAlphabet())return;
    if(next>completedLessons()){toast('Schließe zuerst den aktuellen Kurstag ab.');return}
    s.day=next;ensureDailyScoped();syncPronunciationDaily();save();render();study();
  };

  const baseRender=render;
  render=function(){ensureDailyScoped();syncPronunciationDaily();return baseRender.apply(this,arguments)};

  const baseReset=resetProgress;
  resetProgress=function(){
    const out=baseReset.apply(this,arguments);
    if(!hasLearningEvidence()){
      s.courseStartDate='';s.dailyByLesson={};
      if(s.pronunciation&&typeof s.pronunciation==='object')s.pronunciation.dailyByLesson={};
      ensureDailyScoped();syncPronunciationDaily();save();render();
    }
    return out;
  };

  const changed=repairCourseStart();ensureDailyScoped();syncPronunciationDaily();if(changed)save();
  if($('next'))$('next').onclick=advanceLesson;
  if($('reset'))$('reset').onclick=resetProgress;
  if($('resetProgress'))$('resetProgress').onclick=resetProgress;

  window.UKRAINIAN_LEARNING_STATE_GUARD={version:VERSION,startOnFirstStudy:true,perDayDailyState:true,perDayPronunciationState:true,strictAlphabetCalendar:true,completionDates:true,alphabetDayAllowed};
})();
