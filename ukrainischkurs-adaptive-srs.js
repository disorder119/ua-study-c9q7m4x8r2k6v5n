/* Ukrainischkurs für Joel · Adaptive SRS v1
   Stabilitätsorientierte Wiederholung: neue Karten eng, sichere Karten weiter auseinander,
   Fehler verkürzen Intervalle und wiederholte Problemkarten bleiben sichtbar. */
(() => {
  const VERSION=1;
  const BASE=[1,2,4,7,14,30,60,90];
  function dayAdd(n){const d=new Date();d.setDate(d.getDate()+n);return dayKey(d)}
  function ensureMeta(meta){
    if(!meta||typeof meta!=='object')return meta;
    meta.srsVersion=VERSION;
    meta.ease=Math.max(1.35,Math.min(2.7,Number(meta.ease)||2.15));
    meta.lapses=Math.max(0,Number(meta.lapses)||0);
    meta.interval=Math.max(0,Number(meta.interval)||0);
    meta.successDates=Array.isArray(meta.successDates)?[...new Set(meta.successDates.filter(Boolean))].sort():[];
    meta.recent=Array.isArray(meta.recent)?meta.recent.slice(-8):[];
    return meta;
  }
  const baseFresh=freshMeta;
  freshMeta=function(){return ensureMeta({...baseFresh(),ease:2.15,lapses:0,interval:0,recent:[]})};
  const oldNormalize=normalizeMeta;
  normalizeMeta=function(meta){return ensureMeta(oldNormalize?oldNormalize(meta):meta)};
  Object.values(s.known||{}).forEach(ensureMeta);Object.values(s.sentences||{}).forEach(ensureMeta);

  function nextInterval(meta,newSuccessDay){
    const days=meta.successDates.length;
    if(days<=1)return 1;if(days===2)return 2;if(days===3)return 4;if(days===4)return 7;if(days===5)return 14;
    const previous=Math.max(meta.interval||0,BASE[Math.min(days-1,BASE.length-1)]||14);
    const grown=Math.round(previous*meta.ease);
    return Math.max(14,Math.min(90,grown));
  }
  scheduleMeta=function(meta,correct){
    ensureMeta(meta);meta.answers=(Number(meta.answers)||0)+1;trackAnswer(correct);const today=date();
    meta.recent.push(correct?1:0);meta.recent=meta.recent.slice(-8);
    if(correct){
      const newDay=!meta.successDates.includes(today);if(newDay)meta.successDates.push(today);
      meta.correct=(Number(meta.correct)||0)+1;meta.hits=(Number(meta.hits)||0)+1;meta.wrongStreak=0;
      if(newDay){meta.stage=Math.min(8,(Number(meta.stage)||0)+1);meta.ease=Math.min(2.7,meta.ease+0.04)}
      const interval=nextInterval(meta,newDay);meta.interval=interval;meta.due=dayAdd(interval);
    }else{
      meta.wrong=(Number(meta.wrong)||0)+1;meta.errors=(Number(meta.errors)||0)+1;meta.wrongStreak=(Number(meta.wrongStreak)||0)+1;meta.lapses++;meta.ease=Math.max(1.35,meta.ease-0.18);
      meta.stage=Math.max(0,(Number(meta.stage)||0)-1);meta.interval=0;meta.due=today;meta.leech=meta.lapses>=3;
    }
    meta.lastAnswer=correct?'richtig':'falsch';meta.last=today;meta.reviews=(Number(meta.reviews)||0)+1;
  };

  function urgency(item){const m=ensureMeta(s.known?.[item.k]);if(!m)return 999;let u=0;if(m.due&&m.due<date())u-=20;if(m.due===date())u-=10;u-=Math.min(18,m.lapses*4);u-=Math.min(8,m.wrongStreak*3);u+=Math.min(12,m.successDates.length*2);return u}
  const oldDue=dueCards;
  dueCards=function(){return oldDue().sort((a,b)=>urgency(a)-urgency(b))};

  const oldStatus=learningStatus;
  learningStatus=function(meta){if(!meta)return 'Neu';ensureMeta(meta);if(meta.leech&&meta.successDates.length<4)return 'Schwierig';return oldStatus(meta)};
  learningStatusClass=function(meta){return learningStatus(meta).toLocaleLowerCase('de').replace(/ /g,'-')};

  function patchProgress(){
    const box=document.getElementById('progressDifficult');if(!box)return;
    const difficult=all().filter(x=>s.known?.[x.k]).sort((a,b)=>urgency(a)-urgency(b)).slice(0,6);
    if(!difficult.length)return;
    box.innerHTML=difficult.map(x=>{const m=ensureMeta(s.known[x.k]);return '<div class="coach-item"><strong>'+x.c[0]+'</strong><span>'+learningStatus(m)+' · '+m.lapses+' Fehler-Rückfall'+(m.lapses===1?'':'e')+' · '+(m.due===date()?'heute fällig':'nächste '+(m.due||'offen'))+'</span></div>'}).join('');
  }
  const previousRender=render;render=function(){previousRender();patchProgress()};
  const oldStats=typeof stats==='function'?stats:null;if(oldStats)stats=function(){oldStats();patchProgress()};
})();
