(()=>{
'use strict';

const STORAGE='uk-alpha-lab-v1';
const APP_VERSION=1;
const DAY=86400000, HOUR=3600000, MIN=60000;
const TODAY=()=>new Date().toISOString().slice(0,10);
const HARD=new Set(['В','Г','Ґ','Е','Є','Ж','З','И','І','Ї','Й','Н','П','Р','С','У','Х','Ц','Ч','Ш','Щ','Ь','Ю','Я']);
const ORDER=['А','І','К','М','О','Т','Е','В','Н','Р','С','У','Х','Б','П','Д','Л','Ф','Г','Ґ','З','Ж','И','Ї','Й','Є','Ц','Ч','Ш','Щ','Ь','Ю','Я'];
const ALPHABET='А Б В Г Ґ Д Е Є Ж З И І Ї Й К Л М Н О П Р С Т У Ф Х Ц Ч Ш Щ Ь Ю Я'.split(' ');
const CONF={
  'А':['О','Я','Д'],'Б':['В','П','Р'],'В':['Б','У','Н'],'Г':['Ґ','Х','К'],'Ґ':['Г','К','Д'],'Д':['Л','А','П'],
  'Е':['Є','И','І'],'Є':['Е','Ї','Я'],'Ж':['Ш','Щ','Ч'],'З':['С','Ц','Ж'],'И':['І','Е','Ї'],'І':['И','Ї','Й'],
  'Ї':['І','Й','Є'],'Й':['Ї','І','И'],'К':['Х','Н','Ж'],'Л':['Д','П','И'],'М':['Н','И','Ш'],'Н':['П','И','К'],
  'О':['А','С','Ю'],'П':['Н','Р','Б'],'Р':['П','В','Б'],'С':['З','Ц','Є'],'Т':['Г','П','І'],'У':['В','И','Ч'],
  'Ф':['О','Х','Р'],'Х':['Г','К','Ж'],'Ц':['Ч','С','З'],'Ч':['Ц','Ш','Щ'],'Ш':['Щ','Ж','Ч'],'Щ':['Ш','Ж','Ч'],
  'Ь':['Й','І','Ї'],'Ю':['У','Я','Є'],'Я':['Ю','Є','Ї']
};
const L={
'А':{lower:'а',ipa:'/a/',sound:'A wie in „Auto“',word:'автобус',de:'Bus',note:'Fast geschenkt: Form und Laut sind vertraut.'},
'Б':{lower:'б',ipa:'/b/',sound:'B wie in „Ball“',word:'бабуся',de:'Oma',note:'Nicht mit В verwechseln: Б = B, В ≈ W/V.'},
'В':{lower:'в',ipa:'/ʋ ~ w/',sound:'ähnlich deutschem W',word:'вода',de:'Wasser',note:'Gefährlicher falscher Freund: sieht wie B aus, ist aber der ukrainische W/V-Laut.'},
'Г':{lower:'г',ipa:'/ɦ/',sound:'stimmhaft gehauchtes H',word:'гора',de:'Berg',note:'Nicht deutsches G. Das harte G ist Ґ.'},
'Ґ':{lower:'ґ',ipa:'/ɡ/',sound:'hartes G wie in „Gast“',word:'ґудзик',de:'Knopf',note:'Kontrastpaar: Г /ɦ/ ↔ Ґ /g/.'},
'Д':{lower:'д',ipa:'/d/',sound:'D wie in „Dach“',word:'дім',de:'Haus',note:'Der Laut ist einfach; die Form ist neu.'},
'Е':{lower:'е',ipa:'/ɛ/',sound:'E wie in „Ecke“',word:'екран',de:'Bildschirm',note:'Nicht mit Є verwechseln: Є beginnt am Wortanfang ungefähr mit „je“.'},
'Є':{lower:'є',ipa:'/jɛ/',sound:'je wie in „jetzt“',word:'єнот',de:'Waschbär',note:'Am Wortanfang meist „je“; nach Konsonanten kann es zusätzlich weich machen.'},
'Ж':{lower:'ж',ipa:'/ʒ/',sound:'stimmhaftes Sch wie im zweiten Laut von „Garage“',word:'жук',de:'Käfer',note:'Kontrast: Ж /ʒ/ ↔ Ш /ʃ/.'},
'З':{lower:'з',ipa:'/z/',sound:'stimmhaftes S wie in „Rose“',word:'зуб',de:'Zahn',note:'Nicht mit С verwechseln: З = /z/, С = /s/.'},
'И':{lower:'и',ipa:'/ɪ/',sound:'kurzes, offeneres I',word:'син',de:'Sohn',note:'Kein perfektes deutsches Gegenstück. Deutlich von І /i/ trennen.'},
'І':{lower:'і',ipa:'/i/',sound:'klares I wie in „Igel“',word:'ім’я',de:'Name',note:'Sieht wie lateinisches I aus und klingt auch so.'},
'Ї':{lower:'ї',ipa:'/ji/',sound:'ji',word:'їжа',de:'Essen',note:'Zwei Punkte sind wichtig: Ї = „ji“.'},
'Й':{lower:'й',ipa:'/j/',sound:'J wie in „Ja“',word:'йогурт',de:'Joghurt',note:'Kurzes j; nicht mit И oder Ї verwechseln.'},
'К':{lower:'к',ipa:'/k/',sound:'K wie in „Katze“',word:'кіт',de:'Katze',note:'Form und Laut sind sehr vertraut.'},
'Л':{lower:'л',ipa:'/l/',sound:'L wie in „Lampe“',word:'лампа',de:'Lampe',note:'Neue Form, vertrauter Laut.'},
'М':{lower:'м',ipa:'/m/',sound:'M wie in „Mama“',word:'мама',de:'Mama',note:'Form und Laut sind vertraut.'},
'Н':{lower:'н',ipa:'/n/',sound:'N wie in „Nase“',word:'ніс',de:'Nase',note:'Falscher Freund: sieht wie H aus, klingt aber N.'},
'О':{lower:'о',ipa:'/ɔ/',sound:'O wie in „Ofen“',word:'око',de:'Auge',note:'Form und Laut sind vertraut.'},
'П':{lower:'п',ipa:'/p/',sound:'P wie in „Park“',word:'парк',de:'Park',note:'Nicht mit Н oder Р verwechseln.'},
'Р':{lower:'р',ipa:'/r/',sound:'gerolltes R',word:'рука',de:'Hand',note:'Falscher Freund: sieht wie P aus, klingt R.'},
'С':{lower:'с',ipa:'/s/',sound:'scharfes S wie in „Hass“',word:'сир',de:'Käse',note:'Falscher Freund: sieht wie C aus, klingt S.'},
'Т':{lower:'т',ipa:'/t/',sound:'T wie in „Tag“',word:'так',de:'Ja',note:'Großbuchstabe ist sehr vertraut; Kleinbuchstaben später separat prüfen.'},
'У':{lower:'у',ipa:'/u/',sound:'U wie in „Uhr“',word:'урок',de:'Lektion',note:'Falscher Freund: sieht wie Y aus, klingt U.'},
'Ф':{lower:'ф',ipa:'/f/',sound:'F wie in „Foto“',word:'Франція',de:'Frankreich',note:'Neue Form, sehr einfacher Laut.'},
'Х':{lower:'х',ipa:'/x/',sound:'CH wie in „Bach“',word:'хата',de:'Haus',note:'Falscher Freund: sieht wie X aus, klingt nicht ks.'},
'Ц':{lower:'ц',ipa:'/t͡s/',sound:'Z wie in „Zeit“',word:'це',de:'das / dies',note:'Kontrast: Ц = ts, Ч = tsch.'},
'Ч':{lower:'ч',ipa:'/t͡ʃ/',sound:'tsch wie in „Tschüss“',word:'чай',de:'Tee',note:'Kontrast: Ч = tsch, Ц = ts.'},
'Ш':{lower:'ш',ipa:'/ʃ/',sound:'Sch wie in „Schule“',word:'школа',de:'Schule',note:'Kontrast: Ш = sch, Ж = stimmhaftes sch, Щ ≈ schtsch.'},
'Щ':{lower:'щ',ipa:'/ʃt͡ʃ/',sound:'ungefähr sch + tsch',word:'щука',de:'Hecht',note:'Nicht auf „sch“ reduzieren; bewusst gegen Ш trainieren.'},
'Ь':{lower:'ь',ipa:'—',sound:'kein eigener Laut',word:'кінь',de:'Pferd',note:'Das Weichheitszeichen verändert den vorigen Konsonanten.'},
'Ю':{lower:'ю',ipa:'/ju/',sound:'ju wie in „Jubel“',word:'юнак',de:'junger Mann',note:'Am Wortanfang „ju“; nach Konsonanten kann es weich machen.'},
'Я':{lower:'я',ipa:'/ja/',sound:'ja',word:'яблуко',de:'Apfel',note:'Am Wortanfang „ja“; nach Konsonanten kann es weich machen.'}
};

const CONTRASTS=[
 ['В','Б','Welcher Buchstabe sieht wie ein lateinisches B aus, klingt aber ungefähr W?','В'],
 ['Н','П','Welcher Buchstabe sieht wie H aus, klingt N?','Н'],
 ['Р','П','Welcher Buchstabe sieht wie P aus, klingt R?','Р'],
 ['С','З','Welcher Buchstabe klingt /s/?','С'],
 ['У','В','Welcher Buchstabe klingt U?','У'],
 ['Х','Г','Welcher Buchstabe klingt wie ch in „Bach“?','Х'],
 ['Г','Ґ','Welcher Buchstabe ist das harte G?','Ґ'],
 ['Г','Ґ','Welcher Buchstabe ist das stimmhaft gehauchte H /ɦ/?','Г'],
 ['І','И','Welcher Buchstabe ist das klare I /i/?','І'],
 ['І','И','Welcher Buchstabe ist das offenere kurze I /ɪ/?','И'],
 ['Е','Є','Welcher Buchstabe beginnt am Wortanfang ungefähr mit „je“?','Є'],
 ['Ж','Ш','Welcher Buchstabe ist das stimmhafte Sch /ʒ/?','Ж'],
 ['Ш','Щ','Welcher Buchstabe steht ungefähr für „schtsch“?','Щ'],
 ['Ц','Ч','Welcher Buchstabe steht für „tsch“?','Ч'],
 ['Ц','Ч','Welcher Buchstabe steht für „ts“ wie deutsches Z?','Ц'],
 ['Ї','Й','Welcher Buchstabe steht für „ji“?','Ї']
];

function freshState(){
  const letters={};
  ALPHABET.forEach(c=>letters[c]={strength:0,due:0,seen:0,correct:0,wrong:0,successDays:[],writeDays:[],last:0,confusions:{}});
  return {version:APP_VERSION,xp:0,streak:0,lastStudy:'',sessions:0,letters,diagnostic:null,badges:[],mastery:{visual:[],reverse:[],lowercase:[],contrast:[],final:false},settings:{audio:true},history:[]};
}
function load(){
  let s;try{s=JSON.parse(localStorage.getItem(STORAGE)||'null')}catch(_){s=null}
  if(!s||!s.letters)s=freshState();
  const base=freshState();
  s={...base,...s,letters:{...base.letters,...s.letters},mastery:{...base.mastery,...s.mastery},settings:{...base.settings,...s.settings}};
  ALPHABET.forEach(c=>s.letters[c]={...base.letters[c],...(s.letters[c]||{})});
  return s;
}
let S=load();
let screen='home',session=null,diagnostic=null,toastTimer=null;
const app=document.getElementById('app');
function save(){localStorage.setItem(STORAGE,JSON.stringify(S))}
function esc(v){return String(v??'').replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]))}
function clamp(n,a,b){return Math.max(a,Math.min(b,n))}
function shuffle(a){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function uniq(a){return [...new Set(a)]}
function addBadge(id,label){if(S.badges.includes(id))return;S.badges.push(id);S.xp+=40;save();modal('🏅',label,'Neue Auszeichnung · +40 XP')}
function touchStudy(){const t=TODAY();if(S.lastStudy!==t){if(S.lastStudy){const d=(new Date(t+'T12:00:00')-new Date(S.lastStudy+'T12:00:00'))/DAY;S.streak=d===1?S.streak+1:1}else S.streak=1;S.lastStudy=t;}save()}
function letterScore(c){const m=S.letters[c];return clamp(Math.round((m.strength/5)*100),0,100)}
function introduced(){return ORDER.filter(c=>S.letters[c].seen>0)}
function masteredLetters(){return ALPHABET.filter(c=>S.letters[c].strength>=4 && S.letters[c].successDays.length>=2)}
function hardRetention(c){return !HARD.has(c)||S.letters[c].successDays.length>=3}
function fullyStable(c){const m=S.letters[c];return m.strength>=4.4 && m.successDays.length>=2 && hardRetention(c) && m.writeDays.length>=1}
function masteryCount(){return ALPHABET.filter(fullyStable).length}
function level(){return Math.floor(S.xp/250)+1}
function dueCount(){return introduced().filter(c=>S.letters[c].due<=Date.now()).length}
function nextNew(){return ORDER.find(c=>S.letters[c].seen===0)}
function dueInterval(strength,good){if(!good)return 2*MIN;if(strength<1)return 5*MIN;if(strength<2)return 25*MIN;if(strength<3)return 6*HOUR;if(strength<4)return DAY;if(strength<4.6)return 3*DAY;return 7*DAY}
function record(c,good,kind='recognition',confusedWith=''){
  const m=S.letters[c],today=TODAY();m.seen++;m.last=Date.now();
  if(good){m.correct++;let gain=kind==='recall'?0.62:kind==='contrast'?0.55:kind==='lowercase'?0.45:0.38;m.strength=clamp(m.strength+gain,0,5);if(['recall','recognition','contrast','lowercase'].includes(kind)&&!m.successDays.includes(today))m.successDays.push(today);S.xp+=10;}
  else{m.wrong++;m.strength=clamp(m.strength-0.75,0,5);S.xp+=1;if(confusedWith)m.confusions[confusedWith]=(m.confusions[confusedWith]||0)+1;}
  m.due=Date.now()+dueInterval(m.strength,good);touchStudy();save();
}
function recordWriting(c){const m=S.letters[c],t=TODAY();if(!m.writeDays.includes(t))m.writeDays.push(t);m.strength=clamp(m.strength+0.16,0,5);S.xp+=4;touchStudy();save()}
function topConfusions(limit=6){
  const rows=[];ALPHABET.forEach(c=>Object.entries(S.letters[c].confusions||{}).forEach(([x,n])=>rows.push({pair:[c,x].sort().join(' ↔ '),n})));
  const agg={};rows.forEach(r=>agg[r.pair]=(agg[r.pair]||0)+r.n);return Object.entries(agg).sort((a,b)=>b[1]-a[1]).slice(0,limit);
}
function weakest(limit=8){return [...ALPHABET].sort((a,b)=>letterScore(a)-letterScore(b)||(S.letters[a].last-S.letters[b].last)).slice(0,limit)}
function topbar(){return `<div class="topbar"><div class="brand">🇺🇦 Alphabet Lab</div><div class="spacer"></div><div class="pill">🔥 ${S.streak}</div><div class="pill">XP ${S.xp}</div><div class="pill">Lv ${level()}</div></div>`}
function render(){if(screen==='home')renderHome();else if(screen==='lesson')renderLesson();else if(screen==='mastery')renderMastery();else if(screen==='science')renderScience();else if(screen==='diagnostic')renderDiagnostic()}

function renderHome(){
  const master=masteryCount(),pct=Math.round(master/33*100),due=dueCount(),next=nextNew(),conf=topConfusions();
  app.innerHTML=topbar()+`
    <section class="card hero">
      <div class="eyebrow">Deutsch → Ukrainisch · nur Alphabet</div>
      <h1>33 Zeichen.<br>Keine Ablenkung.</h1>
      <p>Der Trainer bleibt beim ukrainischen Alphabet, bis du Groß- und Kleinbuchstaben, Lautzuordnung, schwierige Kontraste, Schreiben und verzögerten Abruf stabil beherrschst. Keine Grammatik und kein normaler Vokabelkurs davor.</p>
      <div class="actions">
        <button class="btn primary" id="start">${introduced().length?'Training fortsetzen':'Alphabet starten'}</button>
        <button class="btn" id="diag">${S.diagnostic?'Diagnose wiederholen':'5-Minuten-Diagnose'}</button>
        <button class="btn" id="mastery">Mastery-Tests</button>
        <button class="btn" id="science">Warum diese Methode?</button>
      </div>
    </section>
    <div class="grid">
      <section class="card stat"><strong>${master}/33</strong><span>stabil beherrscht</span></section>
      <section class="card stat"><strong>${due}</strong><span>jetzt fällig</span></section>
      <section class="card stat"><strong>${introduced().length}</strong><span>eingeführt</span></section>
      <section class="card stat"><strong>${next||'✓'}</strong><span>${next?'nächstes neues Zeichen':'alle eingeführt'}</span></section>
    </div>
    <section class="card"><div class="section-title"><h2>Echte Beherrschung</h2><small>${pct}%</small></div><div class="progress"><i style="width:${pct}%"></i></div><p class="muted">Ein Zeichen zählt erst als stabil, wenn es mehrfach aktiv erinnert, an verschiedenen Tagen korrekt abgerufen und mindestens einmal geschrieben wurde. Schwierige Zeichen brauchen zusätzliche Retention.</p></section>
    <div class="section-title"><h2>33 Buchstaben</h2><small>Stärke statt bloßer „gesehen“-Haken</small></div>
    <section class="letters">${ALPHABET.map(c=>`<button class="letter-chip" data-letter="${c}"><b>${c}${L[c].lower}</b><span>${esc(L[c].sound)}</span><div class="meter"><i style="width:${letterScore(c)}%"></i></div></button>`).join('')}</section>
    <div class="section-title"><h2>Deine Problemstellen</h2><small>adaptiv aus echten Fehlern</small></div>
    <section class="card">${conf.length?`<div class="confusion">${conf.map(([p,n])=>`<span>${p} · ${n}×</span>`).join('')}</div>`:`<p class="muted">Noch keine Verwechslungsmuster. Sobald du Fehler machst, priorisiert der Trainer genau diese Paare.</p>`}<div class="section-title"><h2>Aktuell schwächste Zeichen</h2></div><div class="confusion">${weakest().map(c=>`<span>${c} · ${letterScore(c)}%</span>`).join('')}</div></section>
    <section class="card"><div class="section-title"><h2>Mastery-Regeln</h2></div><div class="mastery-grid">
      <div class="mastery-item"><strong>Sehen → Laut</strong><small>33/33 im Abschlusstest</small></div>
      <div class="mastery-item"><strong>Laut/Hinweis → Zeichen</strong><small>33/33 im Abschlusstest</small></div>
      <div class="mastery-item"><strong>Groß ↔ klein</strong><small>33/33</small></div>
      <div class="mastery-item"><strong>Kontrastpaare</strong><small>alle kritischen Verwechslungen korrekt</small></div>
      <div class="mastery-item"><strong>Verzögerter Abruf</strong><small>mind. 2 Lerntage, harte Zeichen 3</small></div>
      <div class="mastery-item"><strong>Schreiben</strong><small>jedes Zeichen motorisch geübt</small></div>
    </div></section>
    <div class="footer">Fortschritt bleibt lokal auf diesem Gerät. Kein Konto nötig.</div>`;
  document.getElementById('start').onclick=()=>startAdaptiveSession();
  document.getElementById('diag').onclick=()=>startDiagnostic();
  document.getElementById('mastery').onclick=()=>{screen='mastery';render()};
  document.getElementById('science').onclick=()=>{screen='science';render()};
  app.querySelectorAll('[data-letter]').forEach(b=>b.onclick=()=>startFocused(b.dataset.letter));
}

function chooseSessionLetters(){
  const due=introduced().filter(c=>S.letters[c].due<=Date.now()).sort((a,b)=>letterScore(a)-letterScore(b));
  const weak=introduced().filter(c=>!due.includes(c)).sort((a,b)=>letterScore(a)-letterScore(b));
  const list=[...due.slice(0,5),...weak.slice(0,2)];
  let newSlots=list.length<5?2:1;
  for(const c of ORDER){if(S.letters[c].seen===0&&newSlots>0){list.push(c);newSlots--}}
  if(!list.length)list.push(...weakest(5));
  return uniq(list).slice(0,7);
}
function startAdaptiveSession(){startSession(chooseSessionLetters(),false)}
function startFocused(c){startSession([c,...CONF[c].slice(0,2)],true)}
function startSession(letters,focused){
  touchStudy();
  const tasks=[];
  letters.forEach(c=>{
    if(S.letters[c].seen===0)tasks.push({type:'intro',c});
    tasks.push({type:'visual',c},{type:'reverse',c});
    if((CONF[c]||[]).length)tasks.push({type:'contrast',c});
    tasks.push({type:'lowercase',c});
    if(S.letters[c].writeDays.length===0||Math.random()<.35)tasks.push({type:'write',c});
  });
  const mixed=[];for(let i=0;i<tasks.length;i+=6)mixed.push(...shuffle(tasks.slice(i,i+6)));
  session={letters,focused,tasks:mixed,index:0,correct:0,answered:0,started:Date.now(),locked:false};
  screen='lesson';render();
}
function currentTask(){return session?.tasks?.[session.index]}
function advance(){session.index++;session.locked=false;if(session.index>=session.tasks.length)return finishTraining();renderLesson()}
function finishTraining(){
  S.sessions++;const accuracy=session.answered?Math.round(session.correct/session.answered*100):100;S.history.unshift({date:TODAY(),accuracy,count:session.answered});S.history=S.history.slice(0,30);if(accuracy===100&&session.answered>=6)addBadge('perfect-session','Perfekte Runde');save();
  const weak=session.letters.sort((a,b)=>letterScore(a)-letterScore(b))[0];modal(accuracy>=90?'✅':'🧠',`${accuracy}% in dieser Runde`,accuracy>=90?'Stark. Jetzt zählt vor allem die nächste Erinnerung nach Abstand.':`Der Trainer merkt sich die Fehler. ${weak} wird früher wiederkommen.`,()=>{screen='home';session=null;render()});
}
function choicesFor(c,count=4){return shuffle(uniq([c,...(CONF[c]||[]),...shuffle(ALPHABET.filter(x=>x!==c))]).slice(0,count))}
function soundChoices(c){return shuffle(choicesFor(c).map(x=>L[x].sound))}
function answer(good,c,kind,button,wrongValue=''){
  if(session.locked)return;session.locked=true;session.answered++;if(good)session.correct++;
  record(c,good,kind,good?'':wrongValue);
  if(button)button.classList.add(good?'correct':'wrong');
  const fb=document.getElementById('feedback');if(fb){fb.className='feedback '+(good?'good':'bad');fb.textContent=good?'Richtig. Abruf zählt.':`Noch nicht. ${c} = ${L[c].sound}`}
  setTimeout(advance,good?520:1050);
}
function play(c,button){
  const src=window.UKRAINIAN_PRONUNCIATION_AUDIO?.[c];
  if(src){const a=new Audio(src);button.disabled=true;const done=()=>button.disabled=false;a.onended=done;a.onerror=()=>{done();tts(c)};a.play().catch(()=>{done();tts(c)});return}
  tts(c);
}
function tts(c){if(!('speechSynthesis' in window))return;const u=new SpeechSynthesisUtterance(L[c].word);u.lang='uk-UA';u.rate=.72;speechSynthesis.cancel();speechSynthesis.speak(u)}
function lessonShell(inner){const p=Math.round(session.index/session.tasks.length*100);return topbar()+`<section class="lesson"><div class="lesson-head"><button class="btn" id="exit">← Menü</button><div class="progress"><i style="width:${p}%"></i></div><span class="tag">${session.index+1}/${session.tasks.length}</span></div>${inner}</section>`}
function renderLesson(){
  const t=currentTask();if(!t)return finishTraining();const c=t.c,d=L[c];let html='';
  if(t.type==='intro')html=`<section class="card stage"><div class="eyebrow">Neu entdecken</div><div class="big-letter">${c}</div><div class="small-letter">klein: <b>${d.lower}</b></div><div class="sound">${esc(d.sound)}</div><div class="ipa">${esc(d.ipa)}</div><div class="word">${d.word}<small>${d.de}</small></div><div class="note">${esc(d.note)}</div><div class="audio-row"><button class="btn" id="play">🔊 Echte ukrainische Wortaufnahme</button></div><button class="btn primary" id="next">Ich habe geschaut und gehört</button></section>`;
  if(t.type==='visual')html=`<section class="card stage"><div class="eyebrow">Aktiver Abruf · sehen → Laut</div><div class="big-letter">${c}</div><div class="prompt">Welcher Laut gehört zu diesem Zeichen?</div><div class="answers">${soundChoices(c).map(x=>`<button class="answer" data-v="${esc(x)}">${esc(x)}</button>`).join('')}</div><div id="feedback" class="feedback"></div></section>`;
  if(t.type==='reverse')html=`<section class="card stage"><div class="eyebrow">Aktiver Abruf · Laut → Zeichen</div><div class="sound">${esc(d.sound)}</div><div class="ipa">${esc(d.ipa)}</div><div class="prompt">Welcher ukrainische Buchstabe passt?</div><div class="answers">${choicesFor(c).map(x=>`<button class="answer" data-c="${x}"><span style="font-size:32px">${x}</span><br><small>${L[x].lower}</small></button>`).join('')}</div><div id="feedback" class="feedback"></div></section>`;
  if(t.type==='contrast'){
    const other=(CONF[c]||[])[0]||choicesFor(c,2).find(x=>x!==c);const opts=shuffle([c,other]);
    html=`<section class="card stage"><div class="eyebrow">Verwechslungs-Training</div><div class="pair">${opts.join(' · ')}</div><div class="prompt">Welches Zeichen steht für: ${esc(d.sound)}?</div><div class="answers">${opts.map(x=>`<button class="answer" data-k="${x}"><span style="font-size:42px">${x}</span><br><small>${esc(L[x].sound)}</small></button>`).join('')}</div><div id="feedback" class="feedback"></div></section>`;
  }
  if(t.type==='lowercase')html=`<section class="card stage"><div class="eyebrow">Groß ↔ klein</div><div class="big-letter">${c}</div><div class="prompt">Welcher Kleinbuchstabe gehört dazu?</div><div class="answers">${shuffle(choicesFor(c).map(x=>L[x].lower)).map(x=>`<button class="answer" data-l="${x}"><span style="font-size:38px">${x}</span></button>`).join('')}</div><div id="feedback" class="feedback"></div></section>`;
  if(t.type==='write')html=`<section class="card stage"><div class="eyebrow">Motorische Spur</div><div class="prompt">Schreibe ${c} mehrmals über die helle Vorlage. Hier wird nicht so getan, als könne eine simple Web-App deine Handschrift zuverlässig benoten – wichtig ist die motorische Übung.</div><div class="canvas-wrap"><canvas class="trace-canvas" id="canvas" width="760" height="760"></canvas><div class="trace-actions"><button class="btn" id="clear">Neu</button><button class="btn primary" id="written">Geschrieben</button></div></div><div class="note">Handschrift wird bewusst eingebaut, weil Studien bei Erwachsenen Vorteile für das Lernen neuer Zeichen und die Generalisierung auf Leseaufgaben zeigen.</div></section>`;
  app.innerHTML=lessonShell(html);document.getElementById('exit').onclick=()=>{screen='home';session=null;render()};
  if(t.type==='intro'){document.getElementById('play').onclick=e=>play(c,e.currentTarget);document.getElementById('next').onclick=()=>{S.letters[c].seen++;S.letters[c].due=Date.now();save();advance()}}
  if(t.type==='visual')app.querySelectorAll('[data-v]').forEach(b=>b.onclick=()=>answer(b.dataset.v===d.sound,c,'recognition',b,b.dataset.v));
  if(t.type==='reverse')app.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>answer(b.dataset.c===c,c,'recall',b,b.dataset.c));
  if(t.type==='contrast')app.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>answer(b.dataset.k===c,c,'contrast',b,b.dataset.k));
  if(t.type==='lowercase')app.querySelectorAll('[data-l]').forEach(b=>b.onclick=()=>answer(b.dataset.l===d.lower,c,'lowercase',b,b.dataset.l));
  if(t.type==='write')setupCanvas(c);
}
function setupCanvas(c){
  const canvas=document.getElementById('canvas'),ctx=canvas.getContext('2d');let drawing=false,last=null,ink=0;
  function guide(){ctx.clearRect(0,0,canvas.width,canvas.height);ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='600 540px system-ui';ctx.fillStyle='#e5e7eb';ctx.fillText(c,380,390);ctx.lineCap='round';ctx.lineJoin='round';ctx.strokeStyle='#111827';ctx.lineWidth=24;ink=0}guide();
  const point=e=>{const r=canvas.getBoundingClientRect(),p=e.touches?.[0]||e;return {x:(p.clientX-r.left)*canvas.width/r.width,y:(p.clientY-r.top)*canvas.height/r.height}};
  const start=e=>{e.preventDefault();drawing=true;last=point(e)};const move=e=>{if(!drawing)return;e.preventDefault();const p=point(e);ctx.beginPath();ctx.moveTo(last.x,last.y);ctx.lineTo(p.x,p.y);ctx.stroke();ink+=Math.hypot(p.x-last.x,p.y-last.y);last=p};const end=()=>{drawing=false;last=null};
  canvas.addEventListener('pointerdown',start);canvas.addEventListener('pointermove',move);window.addEventListener('pointerup',end,{once:false});
  document.getElementById('clear').onclick=guide;document.getElementById('written').onclick=()=>{if(ink<700){toast('Schreibe das Zeichen erst sichtbar nach – ein kurzer Strich reicht nicht.');return}recordWriting(c);advance()};
}

function startDiagnostic(){
  diagnostic={items:shuffle(ALPHABET),index:0,known:[],miss:[],phase:'visual'};screen='diagnostic';render();
}
function renderDiagnostic(){
  const c=diagnostic.items[diagnostic.index];if(!c)return finishDiagnostic();const opts=soundChoices(c);
  app.innerHTML=topbar()+`<section class="lesson"><div class="lesson-head"><button class="btn" id="exit">← Abbrechen</button><div class="progress"><i style="width:${Math.round(diagnostic.index/33*100)}%"></i></div><span class="tag">${diagnostic.index+1}/33</span></div><section class="card stage"><div class="eyebrow">Diagnose · keine Lernhilfe</div><div class="big-letter">${c}</div><div class="prompt">Welcher Laut gehört dazu?</div><div class="answers">${opts.map(x=>`<button class="answer" data-d="${esc(x)}">${esc(x)}</button>`).join('')}</div><div class="feedback" id="feedback"></div></section></section>`;
  document.getElementById('exit').onclick=()=>{screen='home';diagnostic=null;render()};
  app.querySelectorAll('[data-d]').forEach(b=>b.onclick=()=>{const good=b.dataset.d===L[c].sound;(good?diagnostic.known:diagnostic.miss).push(c);diagnostic.index++;renderDiagnostic()});
}
function finishDiagnostic(){
  const score=diagnostic.known.length;S.diagnostic={date:TODAY(),score,known:diagnostic.known,miss:diagnostic.miss};diagnostic.known.forEach(c=>{const m=S.letters[c];m.seen=Math.max(m.seen,1);m.strength=Math.max(m.strength,1.4);m.due=Date.now()});save();
  modal(score>=25?'🎯':'🧭',`${score}/33 spontan erkannt`,score===33?'Sehr stark. Trotzdem folgen Kontrast-, Rückwärts- und Retentionstests.':`Der Kurs startet nicht blind bei A: ${33-score} Zeichen werden stärker priorisiert.`,()=>{screen='home';diagnostic=null;render()});
}

function latestPass(arr){return Array.isArray(arr)&&arr.length?arr[arr.length-1]:null}
function passedOnDifferentDays(type,n=2){const arr=S.mastery[type]||[];return new Set(arr.filter(x=>x.score===x.total).map(x=>x.date)).size>=n}
function testCard(type,title,desc,passText){const last=latestPass(S.mastery[type]);return `<div class="mastery-item"><strong>${title}</strong><small>${desc}</small><div style="margin:8px 0">${last?`Letzter Versuch: ${last.score}/${last.total} · ${esc(last.date)}`:'Noch nicht geprüft'}</div><button class="btn" data-test="${type}">Test starten</button><div class="tag" style="margin-left:6px">${passText}</div></div>`}
function renderMastery(){
  const stable=masteryCount(),allTests=passedOnDifferentDays('visual',2)&&passedOnDifferentDays('reverse',2)&&passedOnDifferentDays('lowercase',1)&&passedOnDifferentDays('contrast',1);const final=allTests&&stable===33;
  if(final&&!S.mastery.final){S.mastery.final=true;save();addBadge('alphabet-master','Alphabet gemeistert')}
  app.innerHTML=topbar()+`<section class="card hero"><div class="eyebrow">Mastery statt Kalender-Freischaltung</div><h1>Beweise, dass es sitzt.</h1><p>Ein perfekter Test direkt nach dem Lernen reicht nicht. Die wichtigsten Prüfungen müssen an mindestens zwei verschiedenen Tagen perfekt sein; zusätzlich zählt die per-Buchstabe-Retention.</p><div class="actions"><button class="btn" id="back">← Übersicht</button></div></section>
  <section class="card"><div class="section-title"><h2>Retention</h2><small>${stable}/33 stabil</small></div><div class="progress"><i style="width:${Math.round(stable/33*100)}%"></i></div><p class="muted">Normale Zeichen: mindestens zwei erfolgreiche Lerntage. Schwierige/leicht verwechselbare Zeichen: mindestens drei. Jedes Zeichen mindestens einmal schreiben.</p></section>
  <section class="card"><div class="mastery-grid">
    ${testCard('visual','1. Sehen → Laut','Alle 33 Zeichen ohne Hilfen.','2 perfekte Tage')}
    ${testCard('reverse','2. Laut → Zeichen','Aktiver Rückwärtsabruf, damit Wiedererkennen nicht täuscht.','2 perfekte Tage')}
    ${testCard('lowercase','3. Groß → klein','Alle Kleinbuchstaben separat.','1 perfekter Test')}
    ${testCard('contrast','4. Verwechslungen','Kritische Paare wie Г/Ґ, І/И, Ш/Щ, Ц/Ч.','100 %')}
  </div></section>
  <section class="card"><div class="test-score">${final?'33/33':'Noch offen'}</div><p class="prompt">${final?'Alphabet wirklich gemeistert.':'Keine falsche „fertig“-Meldung: Das Abschlussbadge kommt erst nach Tests + Retention + Schreiben.'}</p></section>`;
  document.getElementById('back').onclick=()=>{screen='home';render()};app.querySelectorAll('[data-test]').forEach(b=>b.onclick=()=>startMasteryTest(b.dataset.test));
}
function startMasteryTest(type){
  let items=[];
  if(type==='visual')items=shuffle(ALPHABET).map(c=>({c,type}));
  if(type==='reverse')items=shuffle(ALPHABET).map(c=>({c,type}));
  if(type==='lowercase')items=shuffle(ALPHABET).map(c=>({c,type}));
  if(type==='contrast')items=shuffle(CONTRASTS).map(x=>({x,type}));
  session={masteryType:type,tasks:items,index:0,correct:0,answered:0,locked:false};screen='lesson';renderMasteryQuestion();
}
function renderMasteryQuestion(){
  const t=session.tasks[session.index];if(!t)return finishMasteryTest();let html='';
  if(t.type==='visual'){const c=t.c;html=`<section class="card stage"><div class="eyebrow">Mastery · sehen → Laut</div><div class="big-letter">${c}</div><div class="answers">${soundChoices(c).map(x=>`<button class="answer" data-mv="${esc(x)}">${esc(x)}</button>`).join('')}</div><div id="feedback" class="feedback"></div></section>`}
  if(t.type==='reverse'){const c=t.c;html=`<section class="card stage"><div class="eyebrow">Mastery · Laut → Zeichen</div><div class="sound">${esc(L[c].sound)}</div><div class="ipa">${L[c].ipa}</div><div class="answers">${choicesFor(c).map(x=>`<button class="answer" data-mr="${x}"><span style="font-size:38px">${x}</span></button>`).join('')}</div><div id="feedback" class="feedback"></div></section>`}
  if(t.type==='lowercase'){const c=t.c;html=`<section class="card stage"><div class="eyebrow">Mastery · Groß → klein</div><div class="big-letter">${c}</div><div class="answers">${shuffle(choicesFor(c).map(x=>L[x].lower)).map(x=>`<button class="answer" data-ml="${x}"><span style="font-size:38px">${x}</span></button>`).join('')}</div><div id="feedback" class="feedback"></div></section>`}
  if(t.type==='contrast'){const [a,b,q,correct]=t.x;html=`<section class="card stage"><div class="eyebrow">Mastery · Kontrast</div><div class="pair">${a} · ${b}</div><div class="prompt">${esc(q)}</div><div class="answers">${shuffle([a,b]).map(x=>`<button class="answer" data-mc="${x}"><span style="font-size:42px">${x}</span></button>`).join('')}</div><div id="feedback" class="feedback"></div></section>`}
  app.innerHTML=lessonShell(html);document.getElementById('exit').onclick=()=>{screen='mastery';session=null;render()};
  const done=(good,c,kind,b,wrong='')=>{if(session.locked)return;session.locked=true;session.answered++;if(good)session.correct++;if(c)record(c,good,kind,wrong);b.classList.add(good?'correct':'wrong');const fb=document.getElementById('feedback');fb.className='feedback '+(good?'good':'bad');fb.textContent=good?'Richtig.':'Falsch.';setTimeout(()=>{session.index++;session.locked=false;renderMasteryQuestion()},good?260:700)};
  if(t.type==='visual')app.querySelectorAll('[data-mv]').forEach(b=>b.onclick=()=>done(b.dataset.mv===L[t.c].sound,t.c,'recognition',b,b.dataset.mv));
  if(t.type==='reverse')app.querySelectorAll('[data-mr]').forEach(b=>b.onclick=()=>done(b.dataset.mr===t.c,t.c,'recall',b,b.dataset.mr));
  if(t.type==='lowercase')app.querySelectorAll('[data-ml]').forEach(b=>b.onclick=()=>done(b.dataset.ml===L[t.c].lower,t.c,'lowercase',b,b.dataset.ml));
  if(t.type==='contrast')app.querySelectorAll('[data-mc]').forEach(b=>b.onclick=()=>{const [a,,,correct]=t.x;done(b.dataset.mc===correct,correct,'contrast',b,b.dataset.mc===correct?'':b.dataset.mc)});
}
function finishMasteryTest(){
  const type=session.masteryType,total=session.answered,score=session.correct;S.mastery[type]=S.mastery[type]||[];S.mastery[type].push({date:TODAY(),score,total});S.mastery[type]=S.mastery[type].slice(-12);save();
  modal(score===total?'✅':'🧪',`${score}/${total}`,score===total?'Perfekt. Für robuste Beherrschung zählt bei den Kernrichtungen zusätzlich ein perfekter Test an einem anderen Tag.':'Noch nicht perfekt. Fehler werden im adaptiven Training früher wiederholt.',()=>{screen='mastery';session=null;render()});
}

function renderScience(){
  app.innerHTML=topbar()+`<section class="card hero"><div class="eyebrow">Methodik</div><h1>Warum das so gebaut ist</h1><p>Die App versucht nicht, „wissenschaftlich“ nur als Etikett zu benutzen. Jede Kernfunktion hat einen nachvollziehbaren Lernzweck.</p><div class="actions"><button class="btn" id="back">← Übersicht</button></div></section>
  <section class="card science"><ol>
    <li><strong>Aktiver Abruf statt nur Anschauen.</strong> Nach sehr kurzer Einführung musst du das Zeichen aus dem Gedächtnis abrufen. Retrieval Practice verbessert langfristiges Behalten gegenüber bloßem Wiederlesen. <a href="https://pubmed.ncbi.nlm.nih.gov/33006925/" target="_blank" rel="noreferrer">McDermott 2021</a>.</li>
    <li><strong>Tests zwischen den Lernblöcken.</strong> Kleine Abrufprüfungen werden über das Training verteilt statt nur als großer Endtest. Neuere Experimente zeigen Vorteile interspersed retrieval practice. <a href="https://pubmed.ncbi.nlm.nih.gov/39556402/" target="_blank" rel="noreferrer">Don et al. 2024</a>.</li>
    <li><strong>Spacing.</strong> Richtiges Material verschwindet länger, Fehler kommen früh zurück. Eine aktuelle Meta-Analyse angewandter Lernsettings findet einen moderaten Vorteil verteilter gegenüber massierter Übung. <a href="https://pubmed.ncbi.nlm.nih.gov/40564553/" target="_blank" rel="noreferrer">Mawson & Kang 2025</a>.</li>
    <li><strong>Handschrift.</strong> Neue Zeichen werden nicht nur geklickt. Bei Erwachsenen führte Handschreiben in einer Studie zu schnellerem Lernen und besserer Generalisierung als Tippen/visuelles Training. <a href="https://pubmed.ncbi.nlm.nih.gov/34184564/" target="_blank" rel="noreferrer">Wiley & Rapp 2021</a>.</li>
    <li><strong>Phonologie früh koppeln.</strong> Zeichen werden direkt mit Laut + echtem ukrainischem Beispielwort verbunden; Forschung zum orthografischen Lernen Erwachsener spricht dafür, phonologische Information früh einzubauen.</li>
    <li><strong>Verwechslungslernen.</strong> Für Deutsche gefährliche falsche Freunde und ukrainische Minimal-Kontraste werden absichtlich gegeneinander getestet: В/Б, Н/П, Р/П, Г/Ґ, І/И, Е/Є, Ж/Ш, Ш/Щ, Ц/Ч usw.</li>
    <li><strong>Keine Scheinsicherheit.</strong> Ein Test direkt nach dem Lernen reicht nicht. Abschluss verlangt Wiederholung an unterschiedlichen Tagen, beide Abrufrichtungen, Kleinbuchstaben und Schreiben.</li>
  </ol><p class="muted">Wichtig: Die Forschung stützt die Lernprinzipien, nicht die Behauptung, dass exakt diese konkrete App bereits in einer kontrollierten Studie validiert wäre. Dafür bräuchte es echte Nutzerstudien mit verzögerten Tests.</p></section>`;
  document.getElementById('back').onclick=()=>{screen='home';render()};
}
function toast(msg){let e=document.getElementById('toast');if(!e){e=document.createElement('div');e.id='toast';e.style='position:fixed;left:50%;bottom:24px;transform:translateX(-50%);background:#111827;color:white;padding:10px 14px;border-radius:999px;z-index:50;font-weight:700;max-width:90vw;text-align:center';document.body.append(e)}e.textContent=msg;e.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>e.hidden=true,2200)}
function modal(icon,title,text,onClose){
  const wrap=document.createElement('div');wrap.className='modal';wrap.innerHTML=`<section class="card"><div class="badge">${icon}</div><h2>${esc(title)}</h2><p class="muted">${esc(text)}</p><button class="btn primary" id="modalOk">Weiter</button></section>`;document.body.append(wrap);wrap.querySelector('#modalOk').onclick=()=>{wrap.remove();onClose?.()};
}

window.AlphabetLab={version:APP_VERSION,reset(){if(confirm('Alphabet-Lernstand wirklich löschen?')){localStorage.removeItem(STORAGE);S=freshState();screen='home';render()}},export(){return JSON.stringify(S,null,2)},state:()=>structuredClone(S)};
render();
})();
