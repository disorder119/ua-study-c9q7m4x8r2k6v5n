/* Ukrainischkurs für Joel · CEFR-orientierte A1-Prüfungsphase v1
   Vier getrennte Kompetenzprüfungen (Lesen, Hören, Schreiben, Sprechen/Interaktion)
   mit Parallelformen, verpflichtender Reparatur und frühestem Retake am Folgetag.
   Kein amtliches Zertifikat: die App meldet einen internen CEFR-A1-Kompetenznachweis. */
(()=>{
  const VERSION=1,core=window.UKRAINIAN_LEARNING_CORE;if(!core)return;
  const DOMAINS=['reading','listening','writing','speaking'];
  const LABELS={reading:'Lesen',listening:'Hören',writing:'Schreiben',speaking:'Sprechen & Interaktion'};
  const start=D.length,DOMAIN_DAY={reading:start,listening:start+1,writing:start+2,speaking:start+3},FINAL_DAY=start+4;
  const LESSONS=[
    ['A1-Prüfung · Lesen','Unbekannte kurze Alltagstexte verstehen.','Hinweise, Fahrpläne, kurze Nachrichten und konkrete Alltagsinformationen. Prüfungsform statt Lernkarte.',[]],
    ['A1-Prüfung · Hören','Langsame, klare Alltagssprache verstehen.','Jede Aufgabe muss zuerst ohne sichtbares Transkript gehört werden. Die Tonspur wird nicht eingeblendet.',[]],
    ['A1-Prüfung · Schreiben','Sehr einfache persönliche Informationen und Nachrichten selbst schreiben.','Mehrere Bedeutungsbausteine müssen frei auf Ukrainisch produziert werden; reine Auswahlantworten zählen nicht.',[]],
    ['A1-Prüfung · Sprechen & Interaktion','Einfache Fragen beantworten und selbst stellen.','Aufnahme, Rückhören und zusätzlicher Verständlichkeitsnachweis. Keine automatische Akzentnote.',[]],
    ['A1-Abschluss · Gesamtprofil','Der Kurs endet erst nach bestandenem A1-Gesamtprofil.','Vier Kompetenzprüfungen plus der handlungsorientierte Can-do-Abschluss müssen bestanden sein. Das ist CEFR-orientiert, aber kein amtliches Zertifikat.',[]]
  ];
  LESSONS.forEach(x=>D.push(x));
  WEEKLY_REVIEW_DAYS.splice(0,WEEKLY_REVIEW_DAYS.length,...[...new Set([...WEEKLY_REVIEW_DAYS.map(Number).filter(d=>d<start),FINAL_DAY])].sort((a,b)=>a-b));

  const READING_FORMS=[
    [
      {text:'Аптека сьогодні працює до 18:00.',q:'Bis wann ist die Apotheke heute geöffnet?',a:'18:00',o:['16:00','18:00','20:00']},
      {text:'Автобус до Києва о 10:30. Зупинка біля готелю.',q:'Wo ist die Haltestelle?',a:'Beim Hotel',o:['Beim Hotel','Beim Restaurant','Bei der Apotheke']},
      {text:'Мене звати Олена. Я з України. Зараз я живу в Берліні.',q:'Wo lebt Olena jetzt?',a:'In Berlin',o:['In Kyiv','In Berlin','In Deutschland']},
      {text:'У мене немає квитка. Я йду в магазин, а потім на зупинку.',q:'Was fehlt der Person?',a:'Ein Ticket',o:['Wasser','Ein Ticket','Kaffee']},
      {text:'Кава — 60 гривень. Вода — 35 гривень.',q:'Was kostet weniger?',a:'Wasser',o:['Kaffee','Wasser','Beides gleich']},
      {text:'Завтра я не працюю. Я буду вдома.',q:'Was macht die Person morgen?',a:'Sie ist zu Hause',o:['Sie arbeitet','Sie ist zu Hause','Sie fährt nach Kyiv']},
      {text:'Де туалет? — Праворуч, біля ресторану.',q:'Wo ist die Toilette?',a:'Rechts beim Restaurant',o:['Links beim Hotel','Rechts beim Restaurant','Bei der Haltestelle']},
      {text:'Привіт, Анно! Я в готелі. Зустрінемось о 19:00.',q:'Wann ist das Treffen?',a:'19:00',o:['17:00','18:00','19:00']}
    ],
    [
      {text:'Магазин відкритий сьогодні з 9:00 до 20:00.',q:'Wann schließt das Geschäft?',a:'20:00',o:['18:00','19:00','20:00']},
      {text:'Поїзд до Львова о 08:15. Платформа 3.',q:'Von welchem Bahnsteig fährt der Zug?',a:'3',o:['1','2','3']},
      {text:'Я Марко. Я з Німеччини, але зараз живу в Києві.',q:'Woher kommt Marko?',a:'Aus Deutschland',o:['Aus Deutschland','Aus der Ukraine','Aus Kyiv']},
      {text:'Мені потрібна допомога. Я не розумію українською.',q:'Was braucht die Person?',a:'Hilfe',o:['Kaffee','Hilfe','Ein Hotel']},
      {text:'Два квитки — 100 гривень.',q:'Wie viel kosten zwei Tickets?',a:'100 гривень',o:['50 гривень','100 гривень','200 гривень']},
      {text:'Учора я був у готелі. Сьогодні я в ресторані.',q:'Wo ist die Person heute?',a:'Im Restaurant',o:['Im Hotel','Im Restaurant','Im Geschäft']},
      {text:'Автобус не їде сьогодні. Наступний автобус завтра о 7:00.',q:'Wann fährt der nächste Bus?',a:'Morgen um 7:00',o:['Heute um 7:00','Morgen um 7:00','Morgen um 17:00']},
      {text:'Напиши мені, будь ласка. Я буду вдома після 18:00.',q:'Wann ist die Person zu Hause?',a:'Nach 18:00',o:['Vor 18:00','Nach 18:00','Nur morgens']}
    ],
    [
      {text:'Ресторан працює до 22:00. Кухня — до 21:00.',q:'Bis wann gibt es Essen aus der Küche?',a:'21:00',o:['20:00','21:00','22:00']},
      {text:'Зупинка автобуса ліворуч від аптеки.',q:'Wo liegt die Bushaltestelle?',a:'Links von der Apotheke',o:['Rechts vom Hotel','Links von der Apotheke','Im Geschäft']},
      {text:'Моя сестра живе в Україні, а я живу в Німеччині.',q:'Wer lebt in Deutschland?',a:'Die schreibende Person',o:['Die Schwester','Die schreibende Person','Beide']},
      {text:'Я хочу каву, але у мене немає грошей.',q:'Warum kauft die Person wahrscheinlich keinen Kaffee?',a:'Sie hat kein Geld',o:['Sie mag keinen Kaffee','Sie hat kein Geld','Das Café ist geschlossen']},
      {text:'П’ять квитків коштують 250 гривень.',q:'Wie viel kosten fünf Tickets?',a:'250 гривень',o:['50 гривень','200 гривень','250 гривень']},
      {text:'Зараз я працюю. Завтра я буду відпочивати вдома.',q:'Was passiert morgen?',a:'Die Person ruht sich zu Hause aus',o:['Die Person arbeitet','Die Person ruht sich zu Hause aus','Die Person fährt Bus']},
      {text:'Готель: сніданок з 7:00 до 10:00.',q:'Wann beginnt das Frühstück?',a:'7:00',o:['6:00','7:00','10:00']},
      {text:'Привіт! Я вже в Києві. Побачимось біля вокзалу о 16:30.',q:'Wo treffen sie sich?',a:'Beim Bahnhof',o:['Beim Hotel','Beim Bahnhof','Beim Restaurant']}
    ]
  ];

  const LISTENING_FORMS=[
    [
      {uk:'Я з Німеччини. Зараз я в Києві.',q:'Wo ist die Person jetzt?',a:'In Kyiv',o:['In Deutschland','In Kyiv','Im Bus']},
      {uk:'Мені потрібна вода, будь ласка.',q:'Was braucht die Person?',a:'Wasser',o:['Wasser','Kaffee','Ein Ticket']},
      {uk:'Автобус буде о дев’ятій.',q:'Wann kommt der Bus?',a:'Um 9 Uhr',o:['Um 7 Uhr','Um 9 Uhr','Um 10 Uhr']},
      {uk:'У мене немає квитка.',q:'Was hat die Person nicht?',a:'Ein Ticket',o:['Ein Ticket','Geld','Zeit']},
      {uk:'Учора я працював у готелі.',q:'Wann hat die Person gearbeitet?',a:'Gestern',o:['Gestern','Heute','Morgen']},
      {uk:'Де аптека? — Праворуч.',q:'In welche Richtung muss man?',a:'Nach rechts',o:['Nach links','Nach rechts','Geradeaus']},
      {uk:'Я хочу їсти.',q:'Welches Bedürfnis wird genannt?',a:'Essen',o:['Trinken','Essen','Schlafen']},
      {uk:'Завтра я буду жити в Києві.',q:'Was sagt die Person über morgen?',a:'Sie wird in Kyiv wohnen',o:['Sie arbeitet in Kyiv','Sie wird in Kyiv wohnen','Sie fährt nach Deutschland']}
    ],
    [
      {uk:'Моя сестра живе в Україні.',q:'Wer lebt in der Ukraine?',a:'Die Schwester',o:['Die Schwester','Der Bruder','Der Vater']},
      {uk:'Кава коштує шістдесят гривень.',q:'Was kostet 60 Hrywnja?',a:'Kaffee',o:['Wasser','Kaffee','Ein Ticket']},
      {uk:'Поїзд буде о восьмій п’ятнадцять.',q:'Wann kommt oder fährt der Zug?',a:'Um 8:15',o:['Um 8:15','Um 8:50','Um 9:15']},
      {uk:'Я не розумію. Повторіть, будь ласка.',q:'Was möchte die Person?',a:'Eine Wiederholung',o:['Eine Wiederholung','Eine Rechnung','Eine Adresse']},
      {uk:'Сьогодні я в ресторані.',q:'Wo ist die Person heute?',a:'Im Restaurant',o:['Im Restaurant','Im Hotel','In der Apotheke']},
      {uk:'Я йду в магазин.',q:'Wohin geht die Person?',a:'Ins Geschäft',o:['Ins Hotel','Ins Geschäft','Zum Bahnhof']},
      {uk:'У мене немає часу.',q:'Was fehlt?',a:'Zeit',o:['Geld','Zeit','Wasser']},
      {uk:'Завтра я буду працювати.',q:'Was wird die Person morgen tun?',a:'Arbeiten',o:['Arbeiten','Reisen','Essen']}
    ],
    [
      {uk:'Мене звати Іван. Я живу в Берліні.',q:'Wo lebt Ivan?',a:'In Berlin',o:['In Berlin','In Kyiv','In Lviv']},
      {uk:'Два квитки, будь ласка.',q:'Wie viele Tickets möchte die Person?',a:'Zwei',o:['Eins','Zwei','Fünf']},
      {uk:'Аптека ліворуч від готелю.',q:'Wo ist die Apotheke?',a:'Links vom Hotel',o:['Links vom Hotel','Rechts vom Hotel','Im Hotel']},
      {uk:'Я хочу пити, але у мене немає води.',q:'Was fehlt der Person?',a:'Wasser',o:['Kaffee','Wasser','Essen']},
      {uk:'Учора я був удома.',q:'Wo war die Person gestern?',a:'Zu Hause',o:['Zu Hause','Im Geschäft','Im Zug']},
      {uk:'Скільки це коштує?',q:'Wonach wird gefragt?',a:'Nach dem Preis',o:['Nach der Uhrzeit','Nach dem Preis','Nach dem Weg']},
      {uk:'Звідки ти? — Я з України.',q:'Woher kommt die antwortende Person?',a:'Aus der Ukraine',o:['Aus Deutschland','Aus der Ukraine','Aus Kyiv']},
      {uk:'Зустрінемось о дев’ятнадцятій.',q:'Wann ist das Treffen?',a:'Um 19 Uhr',o:['Um 9 Uhr','Um 17 Uhr','Um 19 Uhr']}
    ]
  ];

  const WRITING_FORMS=[
    [
      {q:'Schreibe 3–4 kurze Sätze an Олена: Du heißt Марко, kommst aus Deutschland, bist jetzt in Kyiv und arbeitest morgen.',criteria:[['мене звати марко','я марко'],['я з німеччини'],['я в києві','зараз я в києві'],['завтра я буду працювати','я буду працювати завтра']]},
      {q:'Schreibe kurz: Du hast kein Ticket, brauchst Hilfe und verstehst nicht.',criteria:[['у мене немає квитка'],['мені потрібна допомога'],['я не розумію']]},
      {q:'Schreibe eine kurze Nachricht: Du willst Kaffee, gehst ins Geschäft und fragst nach dem Preis.',criteria:[['я хочу каву'],['я йду в магазин'],['скільки це коштує','скільки коштує']]}
    ],
    [
      {q:'Schreibe 3–4 kurze Sätze: Du heißt Анна, kommst aus der Ukraine, bist jetzt im Hotel und wohnst in Berlin.',criteria:[['мене звати анна','я анна'],['я з україни'],['я в готелі','зараз я в готелі'],['я живу в берліні']]},
      {q:'Schreibe kurz: Du hast kein Wasser, möchtest trinken und brauchst Hilfe.',criteria:[['у мене немає води'],['я хочу пити'],['мені потрібна допомога']]},
      {q:'Schreibe eine kurze Nachricht: Gestern warst du zu Hause, heute bist du im Restaurant und morgen arbeitest du.',criteria:[['учора я був удома','вчора я був удома','учора я була вдома','вчора я була вдома'],['сьогодні я в ресторані','зараз я в ресторані'],['завтра я буду працювати','я буду працювати завтра']]}
    ],
    [
      {q:'Schreibe 3–4 kurze Sätze: Du heißt Іван, kommst aus Deutschland, lebst in Kyiv und bist jetzt im Restaurant.',criteria:[['мене звати іван','я іван'],['я з німеччини'],['я живу в києві'],['я в ресторані','зараз я в ресторані']]},
      {q:'Schreibe kurz: Du hast kein Geld, möchtest essen und fragst, wo die Apotheke ist.',criteria:[['у мене немає грошей'],['я хочу їсти'],['де аптека']]},
      {q:'Schreibe eine kurze Nachricht: Du gehst ins Geschäft, kaufst Wasser und arbeitest morgen.',criteria:[['я йду в магазин'],['я купую воду','я хочу купити воду'],['завтра я буду працювати','я буду працювати завтра']]}
    ]
  ];

  const SPEAKING_FORMS=[
    {role:'Ти — Марко. Ти з Німеччини. Зараз ти в Києві. У тебе немає квитка. Завтра ти будеш працювати.',items:[
      {q:'Як тебе звати?',a:['Мене звати Марко','Я Марко']},{q:'Звідки ти?',a:['Я з Німеччини']},{q:'Де ти зараз?',a:['Я в Києві']},{q:'Чого у тебе немає?',a:['У мене немає квитка']},{q:'Запитай партнера, де він живе.',a:['Де ти живеш']}
    ]},
    {role:'Ти — Анна. Ти з України. Зараз ти в готелі. Ти хочеш каву. Учора ти працювала.',items:[
      {q:'Як тебе звати?',a:['Мене звати Анна','Я Анна']},{q:'Звідки ти?',a:['Я з України']},{q:'Де ти зараз?',a:['Я в готелі','Я у готелі']},{q:'Що ти хочеш?',a:['Я хочу каву']},{q:'Запитай партнера, звідки він.',a:['Звідки ти']}
    ]},
    {role:'Ти — Іван. Ти живеш у Києві. Зараз ти в ресторані. Ти йдеш в магазин. У тебе немає води.',items:[
      {q:'Де ти живеш?',a:['Я живу в Києві']},{q:'Де ти зараз?',a:['Я в ресторані']},{q:'Куди ти йдеш?',a:['Я йду в магазин']},{q:'Чого у тебе немає?',a:['У мене немає води']},{q:'Запитай партнера, що він буде робити завтра.',a:['Що ти будеш робити завтра']}
    ]}
  ];

  const REPAIR={
    reading:[
      {text:'Готель працює 24 години.',q:'Ist das Hotel rund um die Uhr geöffnet?',a:'Ja',o:['Ja','Nein']},
      {text:'Автобус о 8:00.',q:'Wann fährt der Bus?',a:'8:00',o:['8:00','18:00']},
      {text:'Я в ресторані.',q:'Wo ist die Person?',a:'Im Restaurant',o:['Im Restaurant','Im Hotel']}
    ],
    listening:[
      {uk:'Я з України.',q:'Woher kommt die Person?',a:'Aus der Ukraine',o:['Aus der Ukraine','Aus Deutschland']},
      {uk:'Де зупинка?',q:'Wonach wird gefragt?',a:'Nach der Haltestelle',o:['Nach der Haltestelle','Nach dem Preis']},
      {uk:'Завтра я буду працювати.',q:'Wann arbeitet die Person?',a:'Morgen',o:['Gestern','Morgen']}
    ],
    writing:[
      {q:'Tippe: Ich verstehe nicht.',a:['Я не розумію']},
      {q:'Tippe: Ich komme aus Deutschland.',a:['Я з Німеччини']},
      {q:'Tippe: Morgen werde ich arbeiten.',a:['Завтра я буду працювати','Я буду працювати завтра']}
    ],
    speaking:['Я не розумію','Мені потрібна допомога','Завтра я буду працювати']
  };

  const shuffle=a=>[...a].sort(()=>Math.random()-.5);
  function tomorrow(){const d=new Date();d.setHours(12,0,0,0);d.setDate(d.getDate()+1);return dayKey(d)}
  function ensure(){
    if(!s.a1Exam||typeof s.a1Exam!=='object')s.a1Exam={version:VERSION,start,domains:{},completedAt:''};
    s.a1Exam.version=VERSION;s.a1Exam.start=start;s.a1Exam.domains=s.a1Exam.domains||{};
    DOMAINS.forEach(k=>{const st=s.a1Exam.domains[k]||(s.a1Exam.domains[k]={});Object.assign(st,{passed:!!st.passed,attempts:Number(st.attempts)||0,best:Number(st.best)||0,lastAttemptDate:st.lastAttemptDate||'',passedAt:st.passedAt||'',repairDone:!!st.repairDone,lastMisses:Array.isArray(st.lastMisses)?st.lastMisses:[]})});
    return s.a1Exam;
  }
  function state(domain){return ensure().domains[domain]}
  function domainForDay(){return DOMAINS.find(k=>DOMAIN_DAY[k]===Number(s.day))||''}
  function previousPassed(domain){const i=DOMAINS.indexOf(domain);if(i===0)return core.isUnlocked('a1.final');return state(DOMAINS[i-1]).passed}
  function canAttempt(domain){const st=state(domain);if(st.passed)return true;if(!st.attempts)return true;return st.repairDone&&st.lastAttemptDate!==date()}
  function lockReason(domain){const st=state(domain);if(!previousPassed(domain))return 'Die vorherige A1-Prüfung muss zuerst bestanden werden.';if(st.attempts&&!st.repairDone)return 'Erst die heutige Reparatureinheit vollständig abschließen.';if(st.lastAttemptDate===date())return 'Ein neuer Prüfungsversuch öffnet sich morgen. Heute wird nur repariert.';return ''}
  function formIndex(domain){const forms=domain==='reading'?READING_FORMS:domain==='listening'?LISTENING_FORMS:domain==='writing'?WRITING_FORMS:SPEAKING_FORMS;return state(domain).attempts%forms.length}
  function markPass(domain,score,misses=[]){const st=state(domain);st.attempts++;st.best=Math.max(st.best,score);st.lastAttemptDate=date();st.passed=true;st.passedAt=date();st.repairDone=true;st.lastMisses=misses;s.done[s.day]=date();save()}
  function markFail(domain,score,misses=[]){const st=state(domain);st.attempts++;st.best=Math.max(st.best,score);st.lastAttemptDate=date();st.passed=false;st.repairDone=false;st.lastMisses=misses;save()}
  function recordSkill(domain,correct,total,passed){const skills=domain==='reading'?['reading']:domain==='listening'?['listening']:domain==='writing'?['writing','grammar']:['speaking'];core.recordSession({skills,correct,total,passed,module:'a1-exam-'+domain,day:s.day,weight:1.5})}

  let session=null,repairSession=null;
  function beginDomain(domain){
    if(!previousPassed(domain)){toast(lockReason(domain));return}
    if(!canAttempt(domain)){toast(lockReason(domain));return}
    cleanupSpeaking();repairSession=null;
    const fi=formIndex(domain);
    if(domain==='reading')session={domain,fi,items:shuffle(READING_FORMS[fi]),idx:0,correct:0,misses:[]};
    else if(domain==='listening')session={domain,fi,items:shuffle(LISTENING_FORMS[fi]),idx:0,correct:0,misses:[],listened:false};
    else if(domain==='writing')session={domain,fi,items:WRITING_FORMS[fi],idx:0,correct:0,total:0,misses:[]};
    else session={domain,fi,form:SPEAKING_FORMS[fi],idx:0,correct:0,misses:[],heard:false,recorded:false,replayed:false,transcript:'',evidence:false,evidenceType:''};
    renderExam();
  }
  function answerChoice(value){
    const q=session.items[session.idx];if(session.domain==='listening'&&!session.listened){toast('Erst die Tonspur anhören.');return}
    const good=value===q.a;if(good)session.correct++;else session.misses.push(q.q);session.idx++;
    if(session.idx>=session.items.length){finishChoice();return}if(session.domain==='listening')session.listened=false;renderExam()
  }
  function finishChoice(){const d=session.domain,total=session.items.length,score=Math.round(session.correct/total*100),passed=session.correct>=7;recordSkill(d,session.correct,total,passed);if(passed)markPass(d,score,session.misses);else markFail(d,score,session.misses);session=null;toast(passed?LABELS[d]+' bestanden.':LABELS[d]+' noch nicht auf A1-Nachweisniveau. Heute folgt Reparatur; neuer Versuch frühestens morgen.');render()}
  function answerWriting(value){
    const task=session.items[session.idx],n=core.normalize(value),results=task.criteria.map(group=>group.some(a=>n.includes(core.normalize(a))));const got=results.filter(Boolean).length;
    session.correct+=got;session.total+=task.criteria.length;if(got<task.criteria.length)session.misses.push(task.q);session.idx++;
    if(session.idx>=session.items.length){const score=Math.round(session.correct/session.total*100),passed=session.correct>=8;recordSkill('writing',session.correct,session.total,passed);if(passed)markPass('writing',score,session.misses);else markFail('writing',score,session.misses);session=null;toast(passed?'Schreiben bestanden.':'Schreiben noch nicht bestanden. Reparatur heute, neuer Prüfungsversuch frühestens morgen.');render();return}renderExam()
  }

  let rec={media:null,stream:null,chunks:[],url:'',audio:null};
  function cleanupSpeaking(){
    const m=rec.media;rec.media=null;if(m){m.ondataavailable=null;m.onstop=null;m.onerror=null;try{if(m.state!=='inactive')m.stop()}catch{}}
    rec.stream?.getTracks?.().forEach(t=>t.stop());rec.stream=null;rec.chunks=[];if(rec.audio){try{rec.audio.pause()}catch{}rec.audio=null}if(rec.url){URL.revokeObjectURL(rec.url);rec.url=''}
  }
  function speakingItem(){return session?.form?.items?.[session.idx]}
  function resetSpeakingItem(){cleanupSpeaking();if(!session)return;session.heard=false;session.recorded=false;session.replayed=false;session.transcript='';session.evidence=false;session.evidenceType=''}
  async function recordStart(){
    if(!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder){toast('Für die A1-Sprechprüfung brauchst du auf diesem Gerät eine lokale Audioaufnahme.');return}
    try{cleanupSpeaking();const stream=await navigator.mediaDevices.getUserMedia({audio:true}),media=new MediaRecorder(stream);rec.stream=stream;rec.media=media;rec.chunks=[];media.ondataavailable=e=>{if(rec.media===media&&e.data?.size)rec.chunks.push(e.data)};media.onstop=()=>{if(rec.media!==media)return;const chunks=[...rec.chunks],mime=media.mimeType||'audio/webm';rec.media=null;rec.stream?.getTracks().forEach(t=>t.stop());rec.stream=null;if(!chunks.length){toast('Keine Aufnahme erkannt. Bitte erneut aufnehmen.');renderExam();return}rec.url=URL.createObjectURL(new Blob(chunks,{type:mime}));session.recorded=true;renderExam()};media.onerror=()=>{if(rec.media===media){cleanupSpeaking();toast('Aufnahmefehler. Bitte erneut versuchen.');renderExam()}};media.start();renderExam()}catch{cleanupSpeaking();toast('Mikrofon nicht verfügbar oder nicht erlaubt.')}
  }
  function recordStop(){if(rec.media&&rec.media.state!=='inactive')rec.media.stop()}
  function replaySpeaking(){if(!rec.url)return;if(rec.audio){try{rec.audio.pause()}catch{}}const a=new Audio(rec.url);rec.audio=a;a.onended=()=>{if(rec.audio===a)rec.audio=null;session.replayed=true;renderExam()};a.play().catch(()=>toast('Aufnahme konnte nicht abgespielt werden.'))}
  function recognitionCtor(){return window.SpeechRecognition||window.webkitSpeechRecognition}
  function runRecognition(){const C=recognitionCtor(),item=speakingItem();if(!C){toast('Browser-Spracherkennung ist nicht verfügbar. Nutze die Bestätigung durch eine zweite Person.');return}const r=new C();r.lang='uk-UA';r.interimResults=false;r.maxAlternatives=5;r.onresult=e=>{const alts=[...e.results[0]].map(x=>String(x.transcript||''));const good=alts.some(x=>core.accepts(x,item.a));session.evidence=good;session.evidenceType=good?'recognition':'';toast(good?'Verständlich erkannt.':'Noch nicht eindeutig erkannt. Wiederhole oder nutze eine zweite Person.');renderExam()};r.onerror=()=>toast('Spracherkennung konnte nicht ausgeführt werden.');try{r.start()}catch{toast('Spracherkennung ist gerade nicht verfügbar.')}}
  function reviewerConfirm(){session.evidence=true;session.evidenceType='reviewer';toast('Bestätigung durch zweite Person gespeichert.');renderExam()}
  function submitSpeaking(transcript){
    const item=speakingItem();if(!session.recorded||!session.replayed){toast('Erst aufnehmen und die eigene Antwort vollständig anhören.');return}if(!session.evidence){toast('Zusätzlich braucht diese Antwort einen Verständlichkeitsnachweis: Browser-Erkennung oder zweite Person.');return}
    const good=core.accepts(transcript,item.a);if(good)session.correct++;else session.misses.push(item.q);session.idx++;
    if(session.idx>=session.form.items.length){const total=session.form.items.length,score=Math.round(session.correct/total*100),passed=session.correct===total;recordSkill('speaking',session.correct,total,passed);cleanupSpeaking();if(passed)markPass('speaking',score,session.misses);else markFail('speaking',score,session.misses);session=null;toast(passed?'Sprechen & Interaktion bestanden.':'Sprechen noch nicht bestanden. Reparatur heute, neuer Prüfungsversuch frühestens morgen.');render();return}resetSpeakingItem();renderExam()
  }

  function beginRepair(domain){repairSession={domain,idx:0,heard1:false,spoken:false,heard2:false};renderExam()}
  function finishRepair(){const d=repairSession.domain;state(d).repairDone=true;repairSession=null;save();toast('Reparatur abgeschlossen. Der neue Prüfungsversuch öffnet sich am nächsten Kalendertag.');renderExam()}
  function repairChoice(value){const d=repairSession.domain,q=REPAIR[d][repairSession.idx];if(d==='listening'&&!repairSession.heard1){toast('Erst anhören.');return}if(value!==q.a){toast('Noch nicht. Versuche dieselbe Reparaturaufgabe erneut.');return}repairSession.idx++;repairSession.heard1=false;if(repairSession.idx>=REPAIR[d].length){finishRepair();return}renderExam()}
  function repairWriting(value){const q=REPAIR.writing[repairSession.idx];if(!core.accepts(value,q.a)){toast('Noch nicht. Formuliere den Satz noch einmal.');return}repairSession.idx++;if(repairSession.idx>=REPAIR.writing.length){finishRepair();return}renderExam()}
  function repairSpeakingStep(kind,button){const phrase=REPAIR.speaking[repairSession.idx];if(kind==='hear1'){speak(phrase,button);repairSession.heard1=true}else if(kind==='speak'){if(!repairSession.heard1){toast('Erst die Referenz hören.');return}repairSession.spoken=true}else if(kind==='hear2'){if(!repairSession.spoken){toast('Erst selbst laut sprechen.');return}speak(phrase,button);repairSession.heard2=true}else if(kind==='next'){if(!(repairSession.heard1&&repairSession.spoken&&repairSession.heard2)){toast('Hören → sprechen → erneut hören vollständig durchführen.');return}repairSession.idx++;repairSession.heard1=false;repairSession.spoken=false;repairSession.heard2=false;if(repairSession.idx>=REPAIR.speaking.length){finishRepair();return}}renderExam()}

  function choiceGrid(items){return '<div class="a1x-grid">'+shuffle(items).map(x=>'<button class="answer" data-a1x="'+String(x).replace(/"/g,'&quot;')+'">'+x+'</button>').join('')+'</div>'}
  function renderRepair(box,domain){
    if(!repairSession){box.innerHTML+='<div class="a1x-repair"><h3>Verpflichtende Reparatur</h3><p class="small">Ein Fehlversuch wird nicht am selben Tag weggeübt. Heute reparierst du gezielt; die nächste echte Parallelform öffnet sich morgen.</p><button class="primary" id="a1xRepairStart">Reparatur starten</button></div>';document.getElementById('a1xRepairStart').onclick=()=>beginRepair(domain);return}
    const i=repairSession.idx;if(domain==='reading'){const q=REPAIR.reading[i];box.innerHTML+='<div class="a1x-repair"><div class="label">Reparatur Lesen '+(i+1)+'/3</div><div lang="uk" class="a1x-text">'+q.text+'</div><b>'+q.q+'</b>'+choiceGrid(q.o)+'</div>'}
    else if(domain==='listening'){const q=REPAIR.listening[i];box.innerHTML+='<div class="a1x-repair"><div class="label">Reparatur Hören '+(i+1)+'/3</div><button class="secondary" id="a1xRepairListen">🔊 anhören</button><b>'+q.q+'</b>'+choiceGrid(q.o)+'</div>';document.getElementById('a1xRepairListen').onclick=e=>{speak(q.uk,e.currentTarget);repairSession.heard1=true}}
    else if(domain==='writing'){const q=REPAIR.writing[i];box.innerHTML+='<div class="a1x-repair"><div class="label">Reparatur Schreiben '+(i+1)+'/3</div><b>'+q.q+'</b><input id="a1xRepairInput" class="typing-input" lang="uk"><button class="primary" id="a1xRepairCheck">Prüfen</button></div>';document.getElementById('a1xRepairCheck').onclick=()=>repairWriting(document.getElementById('a1xRepairInput').value)}
    else{const p=REPAIR.speaking[i];box.innerHTML+='<div class="a1x-repair"><div class="label">Reparatur Sprechen '+(i+1)+'/3</div><div class="a1x-text" lang="uk">'+p+'</div><div class="a1x-grid"><button id="a1xr1">1 · hören</button><button id="a1xr2">2 · laut sprechen</button><button id="a1xr3">3 · erneut hören</button><button id="a1xr4" '+(repairSession.heard1&&repairSession.spoken&&repairSession.heard2?'':'disabled')+'>Weiter</button></div></div>';document.getElementById('a1xr1').onclick=e=>repairSpeakingStep('hear1',e.currentTarget);document.getElementById('a1xr2').onclick=e=>repairSpeakingStep('speak',e.currentTarget);document.getElementById('a1xr3').onclick=e=>repairSpeakingStep('hear2',e.currentTarget);document.getElementById('a1xr4').onclick=e=>repairSpeakingStep('next',e.currentTarget)}
    box.querySelectorAll('[data-a1x]').forEach(b=>b.onclick=()=>repairChoice(b.dataset.a1x));
  }

  function renderSession(box){
    const d=session.domain;
    if(d==='reading'){const q=session.items[session.idx];box.innerHTML+='<div class="label">A1 Lesen · '+(session.idx+1)+'/8 · Parallelform '+(session.fi+1)+'</div><div class="a1x-text" lang="uk">'+q.text+'</div><div class="a1x-q">'+q.q+'</div>'+choiceGrid(q.o)}
    else if(d==='listening'){const q=session.items[session.idx];box.innerHTML+='<div class="label">A1 Hören · '+(session.idx+1)+'/8 · Parallelform '+(session.fi+1)+'</div><button class="secondary" id="a1xListen">🔊 Tonspur anhören</button><div class="a1x-q">'+q.q+'</div>'+choiceGrid(q.o);document.getElementById('a1xListen').onclick=e=>{speak(q.uk,e.currentTarget);session.listened=true}}
    else if(d==='writing'){const q=session.items[session.idx];box.innerHTML+='<div class="label">A1 Schreiben · Aufgabe '+(session.idx+1)+'/3 · Parallelform '+(session.fi+1)+'</div><div class="a1x-q">'+q.q+'</div><textarea id="a1xWrite" class="typing-input" lang="uk" rows="5" placeholder="Frei auf Ukrainisch schreiben …"></textarea><button class="primary" id="a1xWriteCheck">Antwort abgeben</button>';document.getElementById('a1xWriteCheck').onclick=()=>answerWriting(document.getElementById('a1xWrite').value)}
    else{const item=speakingItem(),recording=rec.media?.state==='recording';box.innerHTML+='<div class="label">A1 Sprechen & Interaktion · '+(session.idx+1)+'/5 · Parallelform '+(session.fi+1)+'</div><div class="tip" lang="uk">Rolle: '+session.form.role+'</div><div class="a1x-q" lang="uk">'+item.q+'</div><div class="actions"><button class="secondary" id="a1xHearQ">🔊 Frage hören</button><button class="'+(recording?'danger':'primary')+'" id="a1xRecord">'+(recording?'■ Aufnahme stoppen':'● Antwort aufnehmen')+'</button>'+(session.recorded?'<button class="secondary" id="a1xReplay">▶ eigene Antwort anhören</button>':'')+'</div><p class="small">Für einen ernsthaften Sprech-Nachweis musst du die Aufnahme selbst vollständig anhören und zusätzlich die Verständlichkeit belegen. Browser-Erkennung ist nur ein Verständlichkeitsindikator; alternativ bestätigt eine zweite Person.</p><div class="actions"><button class="secondary" id="a1xRecognize">Browser-Verständlichkeit prüfen</button><button class="secondary" id="a1xReviewer">'+(session.evidenceType==='reviewer'?'✓ zweite Person bestätigt':'Zweite Person bestätigt verständlich & passend')+'</button></div><input id="a1xTranscript" class="typing-input" lang="uk" placeholder="Tippe danach exakt, was du gesagt hast …"><button class="primary" id="a1xSpeakSubmit">Antwort abschließen</button>';
      document.getElementById('a1xHearQ').onclick=e=>{speak(item.q,e.currentTarget);session.heard=true};document.getElementById('a1xRecord').onclick=()=>recording?recordStop():recordStart();const rp=document.getElementById('a1xReplay');if(rp)rp.onclick=replaySpeaking;document.getElementById('a1xRecognize').onclick=runRecognition;document.getElementById('a1xReviewer').onclick=reviewerConfirm;document.getElementById('a1xSpeakSubmit').onclick=()=>submitSpeaking(document.getElementById('a1xTranscript').value)}
    box.querySelectorAll('[data-a1x]').forEach(b=>b.onclick=()=>answerChoice(b.dataset.a1x));
  }

  function allDomainsPassed(){return DOMAINS.every(d=>state(d).passed)}
  function finalPassed(){return allDomainsPassed()&&!!s.a1CanDo?.passed}
  function renderFinal(box){const ready=allDomainsPassed(),cando=!!s.a1CanDo?.passed;box.innerHTML='<div class="a1x-head"><div><div class="label">CEFR-orientiertes A1-Gesamtprofil</div><h2>'+(finalPassed()?'A1-Kernkompetenzen intern bestanden':'A1 wird erst nach allen Teilprüfungen abgeschlossen')+'</h2></div><div class="pill">'+(finalPassed()?'✓ A1':'A1')+'</div></div><p class="small">Der Council of Europe beschreibt A1 über konkrete kommunikative Fähigkeiten. Diese interne Prüfung ist daran ausgerichtet, aber sie ist kein amtliches oder akkreditiertes Sprachzertifikat.</p><div class="a1x-status">'+DOMAINS.map(d=>'<div><b>'+LABELS[d]+'</b><span>'+(state(d).passed?'✓ bestanden':'noch offen')+'</span></div>').join('')+'<div><b>Handlungsorientierter Can-do-Check</b><span>'+(cando?'✓ bestanden':ready?'jetzt unten absolvieren':'noch gesperrt')+'</span></div></div>'+(finalPassed()?'<div class="tip">✓ Der geführte Kurs ist abgeschlossen. Du hast alle internen A1-Kompetenzgates bestanden. Für einen offiziell anerkannten Nachweis wäre weiterhin eine externe akkreditierte Prüfung nötig.</div>':'<div class="tip">Der Kurs endet nicht nach einer festen Zahl von Kalendertagen. Fehlversuche erzeugen Reparatur und einen neuen Prüfungsversuch an einem späteren Tag.</div>')}
  function renderExam(){
    let box=document.getElementById('a1ExamBox'),domain=domainForDay();if(!domain&&Number(s.day)!==FINAL_DAY){if(box)box.hidden=true;return}const cards=document.getElementById('cards');if(!cards)return;if(!box){box=document.createElement('section');box.id='a1ExamBox';box.className='card';cards.insertAdjacentElement('afterend',box)}box.hidden=false;
    if(Number(s.day)===FINAL_DAY){renderFinal(box);return}
    const st=state(domain),ready=previousPassed(domain),locked=lockReason(domain);box.innerHTML='<div class="a1x-head"><div><div class="label">A1-Kompetenzprüfung · '+LABELS[domain]+'</div><h2>'+LABELS[domain]+' muss separat bestanden werden</h2></div><div class="pill">'+(st.passed?'✓':st.best?st.best+' %':'A1')+'</div></div><p class="small">Bestanden wird nur der erste Durchgang einer Prüfungsform. Nach einem Fehlversuch folgt verpflichtende Reparatur; ein neuer Prüfungsversuch öffnet sich frühestens am nächsten Kalendertag und nutzt die nächste Parallelform.</p>';
    if(session){renderSession(box);return}
    if(st.passed){box.innerHTML+='<div class="tip">✓ '+LABELS[domain]+' bestanden am '+st.passedAt+'. Bester Wert: '+st.best+' %.</div>';return}
    if(st.attempts&&!st.repairDone){renderRepair(box,domain);return}
    box.innerHTML+='<div class="tip">'+(!ready?'🔒 '+locked:locked?'⏳ '+locked:'Bereit für Prüfungsform '+(formIndex(domain)+1)+'.')+'</div><div class="actions"><button class="primary" id="a1xStart" '+(ready&&!locked?'':'disabled')+'>A1-'+LABELS[domain]+'prüfung starten</button></div>';
    const b=document.getElementById('a1xStart');if(b)b.onclick=()=>beginDomain(domain)
  }

  const oldNext=document.getElementById('next')?.onclick;if(document.getElementById('next'))document.getElementById('next').onclick=function(e){const d=domainForDay();if(d&&!state(d).passed){renderExam();document.getElementById('a1ExamBox')?.scrollIntoView({behavior:'smooth',block:'center'});toast('Diese A1-Teilprüfung muss zuerst bestanden werden.');return}if(Number(s.day)===FINAL_DAY){if(!finalPassed()){renderExam();toast('Kursabschluss erst nach allen vier A1-Teilprüfungen und dem Can-do-Check.');return}s.done[FINAL_DAY]=date();ensure().completedAt=ensure().completedAt||date();save()}return oldNext?.call(this,e)};
  const css=document.createElement('style');css.textContent='.a1x-head{display:flex;justify-content:space-between;gap:12px}.a1x-text{font-size:1.18rem;font-weight:750;padding:14px;margin:12px 0;border-radius:12px;background:rgba(21,93,181,.07)}.a1x-q{font-size:1.08rem;font-weight:800;margin:14px 0}.a1x-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin:12px 0}.a1x-repair{margin-top:16px;padding-top:14px;border-top:1px solid rgba(0,0,0,.1)}.a1x-status{display:grid;gap:7px;margin:14px 0}.a1x-status>div{display:flex;justify-content:space-between;gap:12px;padding:9px 0;border-bottom:1px solid rgba(0,0,0,.08)}textarea.typing-input{min-height:120px;resize:vertical}@media(max-width:520px){.a1x-grid{grid-template-columns:1fr}.a1x-status>div{align-items:flex-start;flex-direction:column}}';document.head.append(css);
  window.UKRAINIAN_A1_EXAM={version:VERSION,start,days:5,domains:[...DOMAINS],parallelForms:3,retakeNextDay:true,repairRequired:true,cefrAligned:true,officialCertificate:false,thresholds:{reading:'7/8',listening:'7/8',writing:'8/10',speaking:'5/5 + Verständlichkeitsnachweis'},get passed(){return finalPassed()}};
  const previousRender=render;render=function(){previousRender();renderExam()};ensure();renderExam();
})();
