/* Ukrainischkurs für Joel · CEFR-orientierte A1-Prüfungsphase v2
   Vier getrennte Kompetenzprüfungen. Jeder Bereich braucht zwei unabhängige
   Bestehensnachweise an verschiedenen Kalendertagen: Qualifikation + Bestätigung.
   Prüfungsdaten werden deterministisch neu kombiniert, damit Auswendiglernen fixer
   Formen nicht genügt. Kein amtliches Zertifikat. */
(()=>{
  const VERSION=2,core=window.UKRAINIAN_LEARNING_CORE;if(!core)return;
  const DOMAINS=['reading','listening','writing','speaking'];
  const LABELS={reading:'Lesen',listening:'Hören',writing:'Schreiben',speaking:'Sprechen & Interaktion'};
  const start=D.length,DOMAIN_DAY={reading:start,listening:start+1,writing:start+2,speaking:start+3},FINAL_DAY=start+4;
  const LESSONS=[
    ['A1-Prüfung · Lesen','Sehr kurze unbekannte Alltagstexte verstehen.','Die Inhalte werden aus bereits bekannten A1-Bausteinen neu kombiniert. Ein einzelner Glückstreffer reicht nicht: Qualifikation und Bestätigung liegen an verschiedenen Tagen.',[]],
    ['A1-Prüfung · Hören','Langsame, klare Alltagssprache verstehen.','Maximal zwei Wiedergaben je Prüfungsaufgabe. Die ukrainische Tonspur bleibt während der Antwort unsichtbar.',[]],
    ['A1-Prüfung · Schreiben','Sehr einfache persönliche Informationen und Nachrichten selbst schreiben.','Drei freie Texte mit zehn Bedeutungsbausteinen. Keine Auswahlantworten und keine sichtbaren Musterlösungen während der Prüfung.',[]],
    ['A1-Prüfung · Sprechen & Interaktion','Einfache Fragen verstehen, beantworten und selbst stellen.','Fragen zuerst nur hören, selbst aufnehmen, vollständig rückhören und Verständlichkeit zusätzlich nachweisen. Keine automatische Akzentnote.',[]],
    ['A1-Abschluss · Gesamtprofil','Der Kurs endet erst nach stabil bestätigtem A1-Gesamtprofil.','Vier doppelt bestätigte Kompetenzprüfungen plus handlungsorientierter Can-do-Abschluss. CEFR-orientiert, aber kein amtliches Zertifikat.',[]]
  ];
  LESSONS.forEach(x=>D.push(x));
  WEEKLY_REVIEW_DAYS.splice(0,WEEKLY_REVIEW_DAYS.length,...[...new Set([...WEEKLY_REVIEW_DAYS.map(Number).filter(d=>d<start),FINAL_DAY])].sort((a,b)=>a-b));

  const NAMES=['Анна','Марко','Іван','Олена'];
  const ORIGINS=[{gen:'Німеччини',de:'Deutschland'},{gen:'України',de:'Ukraine'}];
  const LOCATIONS=[{uk:'в готелі',de:'im Hotel'},{uk:'в ресторані',de:'im Restaurant'},{uk:'в магазині',de:'im Geschäft'},{uk:'в Києві',de:'in Kyiv'}];
  const ABSENT=[{gen:'квитка',de:'ein Ticket'},{gen:'води',de:'Wasser'},{gen:'грошей',de:'Geld'},{gen:'часу',de:'Zeit'}];
  const WANTS=[{uk:'Я хочу каву',de:'Kaffee'},{uk:'Я хочу пити',de:'trinken'},{uk:'Я хочу їсти',de:'essen'}];
  const TIMES=['07:00','08:00','09:00','10:30','16:30','18:00','19:00','20:00'];
  const PRICES=[35,50,60,80,100,120];
  const hash=s=>{let h=2166136261;for(const ch of String(s)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0};
  const rng=seed=>{let x=seed>>>0;return()=>{x+=0x6D2B79F5;let t=x;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}};
  const pick=(a,r)=>a[Math.floor(r()*a.length)];
  const options=(answer,others,r)=>[...new Set([answer,...others])].sort(()=>r()-.5).slice(0,4);
  function attemptRng(domain){const st=state(domain),stage=st.qualified?'confirmation':'qualification';return rng(hash(`${domain}|${stage}|${st.attempts}|a1v2`))}

  function readingForm(){
    const r=attemptRng('reading'),name=pick(NAMES,r),origin=pick(ORIGINS,r),loc=pick(LOCATIONS,r),abs=pick(ABSENT,r),t1=pick(TIMES,r),t2=pick(TIMES.filter(x=>x!==t1),r),p1=pick(PRICES,r),p2=pick(PRICES.filter(x=>x!==p1),r);
    return [
      {text:`Магазин сьогодні працює до ${t1}.`,q:'Bis wann arbeitet das Geschäft heute?',a:t1,o:options(t1,TIMES,r)},
      {text:`Автобус до Києва о ${t2}.`,q:'Wann fährt der Bus nach Kyiv?',a:t2,o:options(t2,TIMES,r)},
      {text:`Мене звати ${name}. Я з ${origin.gen}. Зараз я ${loc.uk}.`,q:'Wo ist die Person jetzt?',a:loc.de,o:options(loc.de,LOCATIONS.map(x=>x.de),r)},
      {text:`У мене немає ${abs.gen}. Я йду в магазин.`,q:'Was fehlt der Person?',a:abs.de,o:options(abs.de,ABSENT.map(x=>x.de),r)},
      {text:`Кава — ${p1} гривень. Вода — ${p2} гривень.`,q:'Was kostet weniger?',a:p1<p2?'Kaffee':'Wasser',o:['Kaffee','Wasser','Beides gleich']},
      {text:`Учора я був у готелі. Сьогодні я ${loc.uk}.`,q:'Wo ist die Person heute?',a:loc.de,o:options(loc.de,LOCATIONS.map(x=>x.de),r)},
      {text:'Завтра я буду працювати.',q:'Wann wird die Person arbeiten?',a:'Morgen',o:['Gestern','Heute','Morgen','Jetzt']},
      {text:`П’ять квитків — ${p1} гривень.`,q:'Wie viele Tickets werden genannt?',a:'Fünf',o:['Eins','Zwei','Fünf','Zehn']},
      {text:`${pick(WANTS,r).uk}. У мене немає грошей.`,q:'Was fehlt der Person?',a:'Geld',o:['Geld','Zeit','Wasser','Ein Ticket']},
      {text:`Я з ${origin.gen}. Я живу в Києві.`,q:'Woher kommt die Person?',a:'Aus '+origin.de,o:options('Aus '+origin.de,['Aus Deutschland','Aus der Ukraine','Aus Kyiv'],r)}
    ];
  }

  function listeningForm(){
    const r=attemptRng('listening'),name=pick(NAMES,r),origin=pick(ORIGINS,r),loc=pick(LOCATIONS,r),abs=pick(ABSENT,r),want=pick(WANTS,r),time=pick(TIMES,r),price=pick(PRICES,r);
    return [
      {uk:`Мене звати ${name}. Я ${loc.uk}.`,q:'Wo ist die Person?',a:loc.de,o:options(loc.de,LOCATIONS.map(x=>x.de),r)},
      {uk:`Я з ${origin.gen}.`,q:'Woher kommt die Person?',a:'Aus '+origin.de,o:options('Aus '+origin.de,['Aus Deutschland','Aus der Ukraine','Aus Kyiv'],r)},
      {uk:`У мене немає ${abs.gen}.`,q:'Was fehlt der Person?',a:abs.de,o:options(abs.de,ABSENT.map(x=>x.de),r)},
      {uk:`Автобус буде о ${time.replace(':00','')}.`,q:'Wann kommt der Bus?',a:time,o:options(time,TIMES,r)},
      {uk:want.uk+'.',q:'Was möchte oder braucht die Person?',a:want.de,o:options(want.de,WANTS.map(x=>x.de),r)},
      {uk:'Я не розумію. Повторіть, будь ласка.',q:'Was möchte die Person?',a:'Eine Wiederholung',o:['Eine Wiederholung','Eine Rechnung','Eine Adresse','Ein Ticket']},
      {uk:'Я йду в магазин.',q:'Wohin geht die Person?',a:'Ins Geschäft',o:['Ins Geschäft','Ins Hotel','In die Apotheke','Nach Deutschland']},
      {uk:'Учора я працював у готелі.',q:'Wann hat die Person gearbeitet?',a:'Gestern',o:['Gestern','Heute','Morgen','Jetzt']},
      {uk:'Завтра я буду працювати.',q:'Was wird die Person morgen tun?',a:'Arbeiten',o:['Arbeiten','Essen','Trinken','Schlafen']},
      {uk:`Кава коштує ${price} гривень.`,q:'Was wird genannt?',a:'Der Preis von Kaffee',o:['Der Preis von Kaffee','Eine Buszeit','Eine Hoteladresse','Ein Name']}
    ];
  }

  function writingForm(){
    const r=attemptRng('writing'),name=pick(NAMES,r),origin=pick(ORIGINS,r),loc=pick(LOCATIONS,r),abs=pick(ABSENT,r),want=pick(WANTS,r);
    return [
      {q:`Schreibe 3–4 kurze Sätze: Du heißt ${name}, kommst aus ${origin.de}, bist jetzt ${loc.de} und arbeitest morgen.`,minWords:8,criteria:[[`мене звати ${name}`,`я ${name}`],[`я з ${origin.gen}`],[`я ${loc.uk}`,`зараз я ${loc.uk}`],['завтра я буду працювати','я буду працювати завтра']]},
      {q:`Schreibe kurz: Dir fehlt ${abs.de}, du brauchst Hilfe und verstehst nicht.`,minWords:6,criteria:[[ `у мене немає ${abs.gen}`],['мені потрібна допомога'],['я не розумію']]},
      {q:`Schreibe eine kurze Nachricht: Du möchtest ${want.de}, gehst ins Geschäft und fragst nach dem Preis.`,minWords:6,criteria:[[want.uk],['я йду в магазин'],['скільки це коштує','скільки коштує']]}
    ];
  }

  function speakingForm(){
    const r=attemptRng('speaking'),name=pick(NAMES,r),origin=pick(ORIGINS,r),loc=pick(LOCATIONS,r),abs=pick(ABSENT,r);
    const currentAnswer=`Я ${loc.uk}`;
    return {role:`Ти — ${name}. Ти з ${origin.gen}. Зараз ти ${loc.uk}. У тебе немає ${abs.gen}. Завтра ти будеш працювати.`,items:[
      {qUk:'Як тебе звати?',a:[`Мене звати ${name}`,`Я ${name}`],meaning:`Ich heiße ${name}`,d:['Ich komme aus '+origin.de,`Ich bin ${loc.de}`]},
      {qUk:'Звідки ти?',a:[`Я з ${origin.gen}`],meaning:'Ich komme aus '+origin.de,d:[`Ich heiße ${name}`,`Ich bin ${loc.de}`]},
      {qUk:'Де ти зараз?',a:[currentAnswer],meaning:`Ich bin ${loc.de}`,d:['Ich komme aus '+origin.de,`Mir fehlt ${abs.de}`]},
      {qUk:'Чого у тебе немає?',a:[`У мене немає ${abs.gen}`],meaning:`Mir fehlt ${abs.de}`,d:[`Ich bin ${loc.de}`,'Ich arbeite morgen']},
      {qUk:'Що ти будеш робити завтра?',a:['Завтра я буду працювати','Я буду працювати завтра'],meaning:'Ich werde morgen arbeiten',d:[`Mir fehlt ${abs.de}`,`Ich bin ${loc.de}`]},
      {instruction:'Stelle deinem Partner die Frage: „Wo wohnst du?“',a:['Де ти живеш'],meaning:'Wo wohnst du?',d:['Woher kommst du?','Was möchtest du?']}
    ]};
  }

  const REPAIR={
    reading:[{text:'Автобус о 8:00.',q:'Wann fährt der Bus?',a:'8:00',o:['8:00','18:00']},{text:'Я в ресторані.',q:'Wo ist die Person?',a:'Im Restaurant',o:['Im Restaurant','Im Hotel']},{text:'У мене немає води.',q:'Was fehlt?',a:'Wasser',o:['Wasser','Kaffee']}],
    listening:[{uk:'Я з України.',q:'Woher kommt die Person?',a:'Aus der Ukraine',o:['Aus der Ukraine','Aus Deutschland']},{uk:'Де зупинка?',q:'Wonach wird gefragt?',a:'Nach der Haltestelle',o:['Nach der Haltestelle','Nach dem Preis']},{uk:'Завтра я буду працювати.',q:'Wann arbeitet die Person?',a:'Morgen',o:['Gestern','Morgen']}],
    writing:[{q:'Tippe: Ich verstehe nicht.',a:['Я не розумію']},{q:'Tippe: Ich komme aus Deutschland.',a:['Я з Німеччини']},{q:'Tippe: Morgen werde ich arbeiten.',a:['Завтра я буду працювати','Я буду працювати завтра']}],
    speaking:['Я не розумію','Мені потрібна допомога','Завтра я буду працювати']
  };
  const shuffle=a=>[...a].sort(()=>Math.random()-.5);
  function ensure(){
    const old=s.a1Exam&&typeof s.a1Exam==='object'?s.a1Exam:null;
    if(!old)s.a1Exam={version:VERSION,start,domains:{},completedAt:''};
    const root=s.a1Exam;root.domains=root.domains||{};
    if(Number(root.version)<VERSION){
      DOMAINS.forEach(k=>{const st=root.domains[k]||{};st.legacyV1Passed=!!st.passed;st.passed=false;st.confirmed=false;st.qualified=false;st.qualificationDate='';st.confirmationDate='';st.repairDone=true;root.domains[k]=st});root.completedAt='';
    }
    root.version=VERSION;root.start=start;
    DOMAINS.forEach(k=>{const st=root.domains[k]||(root.domains[k]={});Object.assign(st,{passed:!!st.passed,confirmed:!!st.confirmed,qualified:!!st.qualified,attempts:Number(st.attempts)||0,best:Number(st.best)||0,lastAttemptDate:st.lastAttemptDate||'',qualificationDate:st.qualificationDate||'',confirmationDate:st.confirmationDate||'',repairDone:st.repairDone!==false,lastMisses:Array.isArray(st.lastMisses)?st.lastMisses:[]})});
    return root;
  }
  function state(domain){return ensure().domains[domain]}
  function domainForDay(){return DOMAINS.find(k=>DOMAIN_DAY[k]===Number(s.day))||''}
  function previousPassed(domain){const i=DOMAINS.indexOf(domain);if(i===0)return core.isUnlocked('a1.exam');return state(DOMAINS[i-1]).passed}
  function stage(domain){return state(domain).qualified?'Bestätigung':'Qualifikation'}
  function canAttempt(domain){const st=state(domain);if(st.passed)return true;if(!st.attempts)return true;return st.repairDone&&st.lastAttemptDate!==date()}
  function lockReason(domain){const st=state(domain);if(!previousPassed(domain))return 'Die vorherige Kompetenzstufe muss zuerst bestanden werden.';if(st.attempts&&!st.repairDone)return 'Erst die verpflichtende Reparatureinheit abschließen.';if(st.lastAttemptDate===date())return st.qualified?'Die unabhängige Bestätigung öffnet sich frühestens morgen.':'Ein neuer Prüfungsversuch öffnet sich morgen.';return ''}
  function recordSkill(domain,correct,total,passed,assisted=false){const skills=domain==='reading'?['reading']:domain==='listening'?['listening']:domain==='writing'?['writing','grammar']:['speaking'];core.recordSession({skills,correct,total,passed,assisted,module:'a1-exam-v2-'+domain,day:s.day,weight:2})}
  function finishAttempt(domain,score,misses,passed){
    const st=state(domain);st.attempts++;st.best=Math.max(st.best,score);st.lastAttemptDate=date();st.lastMisses=misses;
    if(passed){st.repairDone=true;if(!st.qualified){st.qualified=true;st.qualificationDate=date();st.passed=false;st.confirmed=false}else{st.passed=true;st.confirmed=true;st.confirmationDate=date();s.done[s.day]=date()}}
    else{st.repairDone=false;st.passed=false}
    save();return st;
  }

  let session=null,repairSession=null;
  function beginDomain(domain){
    if(!previousPassed(domain)||!canAttempt(domain)){toast(lockReason(domain));return}
    cleanupSpeaking();repairSession=null;
    if(domain==='reading')session={domain,items:readingForm(),idx:0,correct:0,misses:[]};
    else if(domain==='listening')session={domain,items:listeningForm(),idx:0,correct:0,misses:[],plays:0,listened:false};
    else if(domain==='writing')session={domain,items:writingForm(),idx:0,correct:0,total:0,misses:[]};
    else{const form=speakingForm();session={domain,form,idx:0,correct:0,misses:[],qPlays:0,heard:false,recorded:false,replayed:false,evidence:false,evidenceType:'',reviewerOpen:false,assisted:false}}
    renderExam();
  }
  function answerChoice(value){const q=session.items[session.idx];if(session.domain==='listening'&&!session.listened){toast('Erst die Tonspur anhören.');return}const good=value===q.a;if(good)session.correct++;else session.misses.push(q.q);session.idx++;if(session.idx>=session.items.length){finishChoice();return}if(session.domain==='listening'){session.listened=false;session.plays=0}renderExam()}
  function finishChoice(){const d=session.domain,total=session.items.length,score=Math.round(session.correct/total*100),passed=session.correct>=8;recordSkill(d,session.correct,total,passed);const st=finishAttempt(d,score,session.misses,passed);session=null;toast(passed?(st.passed?LABELS[d]+' zweifach bestätigt.':LABELS[d]+' qualifiziert. Morgen folgt eine neue Bestätigungsform.'):LABELS[d]+' noch nicht bestanden. Heute Reparatur, neuer Versuch frühestens morgen.');render()}
  function listenExam(button){if(session.plays>=2){toast('In der Prüfung sind maximal zwei Wiedergaben pro Aufgabe erlaubt.');return}const q=session.items[session.idx];speak(q.uk,button);session.plays++;session.listened=true;renderExam()}
  function answerWriting(value){
    const task=session.items[session.idx],n=core.normalize(value),words=n?n.split(/\s+/).length:0,results=task.criteria.map(group=>group.some(a=>n.includes(core.normalize(a))));let got=results.filter(Boolean).length;if(words<task.minWords)got=0;
    session.correct+=got;session.total+=task.criteria.length;if(got<task.criteria.length)session.misses.push(task.q);session.idx++;
    if(session.idx>=session.items.length){const score=Math.round(session.correct/session.total*100),passed=session.correct>=8;recordSkill('writing',session.correct,session.total,passed);const st=finishAttempt('writing',score,session.misses,passed);session=null;toast(passed?(st.passed?'Schreiben zweifach bestätigt.':'Schreiben qualifiziert. Morgen folgt eine neue Bestätigungsform.'):'Schreiben noch nicht bestanden. Reparatur heute, neuer Versuch frühestens morgen.');render();return}renderExam()
  }

  let rec={media:null,stream:null,chunks:[],url:'',audio:null};
  function cleanupSpeaking(){const m=rec.media;rec.media=null;if(m){m.ondataavailable=null;m.onstop=null;m.onerror=null;try{if(m.state!=='inactive')m.stop()}catch{}}rec.stream?.getTracks?.().forEach(t=>t.stop());rec.stream=null;rec.chunks=[];if(rec.audio){try{rec.audio.pause()}catch{}rec.audio=null}if(rec.url){URL.revokeObjectURL(rec.url);rec.url=''}}
  function speakingItem(){return session?.form?.items?.[session.idx]}
  function resetSpeakingItem(){cleanupSpeaking();if(!session)return;const item=speakingItem();session.qPlays=0;session.heard=!item?.qUk;session.recorded=false;session.replayed=false;session.evidence=false;session.evidenceType='';session.reviewerOpen=false;session.assisted=false}
  function hearSpeakingQuestion(button){const item=speakingItem();if(!item?.qUk)return;if(session.qPlays>=2){toast('Maximal zwei Wiedergaben der Prüfungsfrage.');return}speak(item.qUk,button);session.qPlays++;session.heard=true;renderExam()}
  function revealSpeakingQuestion(){const item=speakingItem();if(!item?.qUk)return;session.assisted=true;toast('Fragetext eingeblendet. Dieser Versuch zählt dadurch nicht als unassistierter A1-Nachweis.');renderExam()}
  async function recordStart(){if(!navigator.mediaDevices?.getUserMedia||!window.MediaRecorder){toast('Für die A1-Sprechprüfung ist eine lokale Audioaufnahme erforderlich.');return}try{cleanupSpeaking();const stream=await navigator.mediaDevices.getUserMedia({audio:true}),media=new MediaRecorder(stream);rec.stream=stream;rec.media=media;rec.chunks=[];media.ondataavailable=e=>{if(rec.media===media&&e.data?.size)rec.chunks.push(e.data)};media.onstop=()=>{if(rec.media!==media)return;const chunks=[...rec.chunks],mime=media.mimeType||'audio/webm';rec.media=null;rec.stream?.getTracks().forEach(t=>t.stop());rec.stream=null;if(!chunks.length){toast('Keine Aufnahme erkannt. Bitte erneut aufnehmen.');renderExam();return}rec.url=URL.createObjectURL(new Blob(chunks,{type:mime}));session.recorded=true;renderExam()};media.onerror=()=>{if(rec.media===media){cleanupSpeaking();toast('Aufnahmefehler. Bitte erneut versuchen.');renderExam()}};media.start();renderExam()}catch{cleanupSpeaking();toast('Mikrofon nicht verfügbar oder nicht erlaubt.')}}
  function recordStop(){if(rec.media&&rec.media.state!=='inactive')rec.media.stop()}
  function replaySpeaking(){if(!rec.url)return;if(rec.audio){try{rec.audio.pause()}catch{}}const a=new Audio(rec.url);rec.audio=a;a.onended=()=>{if(rec.audio===a)rec.audio=null;session.replayed=true;renderExam()};a.play().catch(()=>toast('Aufnahme konnte nicht abgespielt werden.'))}
  function recognitionCtor(){return window.SpeechRecognition||window.webkitSpeechRecognition}
  function runRecognition(){const C=recognitionCtor(),item=speakingItem();if(!C){toast('Browser-Spracherkennung ist nicht verfügbar. Nutze den Prüfermodus mit einer zweiten Person.');return}const r=new C();r.lang='uk-UA';r.interimResults=false;r.maxAlternatives=5;r.onresult=e=>{const alts=[...e.results[0]].map(x=>String(x.transcript||'')),good=alts.some(x=>core.accepts(x,item.a));session.evidence=good;session.evidenceType=good?'recognition':'';toast(good?'Verständlich erkannt.':'Noch nicht eindeutig erkannt. Wiederhole oder nutze den Prüfermodus.');renderExam()};r.onerror=()=>toast('Spracherkennung konnte nicht ausgeführt werden.');try{r.start()}catch{toast('Spracherkennung ist gerade nicht verfügbar.')}}
  function openReviewer(){if(!session.recorded||!session.replayed){toast('Prüfermodus erst nach Aufnahme und vollständigem Rückhören.');return}session.reviewerOpen=true;renderExam()}
  function reviewerCheck(choice,initials){const item=speakingItem();if(String(initials||'').trim().length<2){toast('Die zweite Person trägt mindestens zwei Initialen ein.');return}if(choice!==item.meaning){toast('Der Prüfer hat eine andere Bedeutung verstanden. Antwort erneut aufnehmen.');session.evidence=false;return}session.evidence=true;session.evidenceType='reviewer:'+String(initials).trim().slice(0,6);session.reviewerOpen=false;toast('Verständlichkeit durch zweite Person bestätigt.');renderExam()}
  function submitSpeaking(transcript){const item=speakingItem();if(item.qUk&&!session.heard){toast('Erst die Prüfungsfrage anhören.');return}if(!session.recorded||!session.replayed){toast('Erst aufnehmen und die eigene Antwort vollständig anhören.');return}if(!session.evidence){toast('Zusätzlich braucht die Antwort einen Verständlichkeitsnachweis.');return}const good=!session.assisted&&core.accepts(transcript,item.a);if(good)session.correct++;else session.misses.push(item.qUk||item.instruction);session.idx++;if(session.idx>=session.form.items.length){const total=session.form.items.length,score=Math.round(session.correct/total*100),passed=session.correct===total;recordSkill('speaking',session.correct,total,passed,session.assisted);cleanupSpeaking();const st=finishAttempt('speaking',score,session.misses,passed);session=null;toast(passed?(st.passed?'Sprechen zweifach bestätigt.':'Sprechen qualifiziert. Morgen folgt eine neue Bestätigungsrolle.'):'Sprechen noch nicht bestanden. Reparatur heute, neuer Versuch frühestens morgen.');render();return}resetSpeakingItem();renderExam()}

  function beginRepair(domain){repairSession={domain,idx:0,heard1:false,spoken:false,heard2:false};renderExam()}
  function finishRepair(){const d=repairSession.domain;state(d).repairDone=true;repairSession=null;save();toast('Reparatur abgeschlossen. Der neue Prüfungsversuch öffnet sich am nächsten Kalendertag.');renderExam()}
  function repairChoice(value){const d=repairSession.domain,q=REPAIR[d][repairSession.idx];if(d==='listening'&&!repairSession.heard1){toast('Erst anhören.');return}if(value!==q.a){toast('Noch nicht. Versuche dieselbe Reparaturaufgabe erneut.');return}repairSession.idx++;repairSession.heard1=false;if(repairSession.idx>=REPAIR[d].length){finishRepair();return}renderExam()}
  function repairWriting(value){const q=REPAIR.writing[repairSession.idx];if(!core.accepts(value,q.a)){toast('Noch nicht. Formuliere den Satz noch einmal.');return}repairSession.idx++;if(repairSession.idx>=REPAIR.writing.length){finishRepair();return}renderExam()}
  function repairSpeakingStep(kind,button){const phrase=REPAIR.speaking[repairSession.idx];if(kind==='hear1'){speak(phrase,button);repairSession.heard1=true}else if(kind==='speak'){if(!repairSession.heard1){toast('Erst die Referenz hören.');return}repairSession.spoken=true}else if(kind==='hear2'){if(!repairSession.spoken){toast('Erst selbst laut sprechen.');return}speak(phrase,button);repairSession.heard2=true}else if(kind==='next'){if(!(repairSession.heard1&&repairSession.spoken&&repairSession.heard2)){toast('Hören → sprechen → erneut hören vollständig durchführen.');return}repairSession.idx++;repairSession.heard1=false;repairSession.spoken=false;repairSession.heard2=false;if(repairSession.idx>=REPAIR.speaking.length){finishRepair();return}}renderExam()}

  function choiceGrid(items,attr='data-a1x'){return '<div class="a1x-grid">'+shuffle(items).map(x=>'<button class="answer" '+attr+'="'+String(x).replace(/"/g,'&quot;')+'">'+x+'</button>').join('')+'</div>'}
  function renderRepair(box,domain){if(!repairSession){box.innerHTML+='<div class="a1x-repair"><h3>Verpflichtende Reparatur</h3><p class="small">Die Reparatur trainiert die Kompetenz, aber zählt nicht als Prüfungsbestehen. Ein neuer Nachweis öffnet sich erst am nächsten Kalendertag.</p><button class="primary" id="a1xRepairStart">Reparatur starten</button></div>';document.getElementById('a1xRepairStart').onclick=()=>beginRepair(domain);return}const i=repairSession.idx;if(domain==='reading'){const q=REPAIR.reading[i];box.innerHTML+='<div class="a1x-repair"><div class="label">Reparatur Lesen '+(i+1)+'/3</div><div lang="uk" class="a1x-text">'+q.text+'</div><b>'+q.q+'</b>'+choiceGrid(q.o)+'</div>'}else if(domain==='listening'){const q=REPAIR.listening[i];box.innerHTML+='<div class="a1x-repair"><div class="label">Reparatur Hören '+(i+1)+'/3</div><button class="secondary" id="a1xRepairListen">🔊 anhören</button><b>'+q.q+'</b>'+choiceGrid(q.o)+'</div>';document.getElementById('a1xRepairListen').onclick=e=>{speak(q.uk,e.currentTarget);repairSession.heard1=true}}else if(domain==='writing'){const q=REPAIR.writing[i];box.innerHTML+='<div class="a1x-repair"><div class="label">Reparatur Schreiben '+(i+1)+'/3</div><b>'+q.q+'</b><input id="a1xRepairInput" class="typing-input" lang="uk"><button class="primary" id="a1xRepairCheck">Prüfen</button></div>';document.getElementById('a1xRepairCheck').onclick=()=>repairWriting(document.getElementById('a1xRepairInput').value)}else{const p=REPAIR.speaking[i];box.innerHTML+='<div class="a1x-repair"><div class="label">Reparatur Sprechen '+(i+1)+'/3</div><div class="a1x-text" lang="uk">'+p+'</div><div class="a1x-grid"><button id="a1xr1">1 · hören</button><button id="a1xr2">2 · laut sprechen</button><button id="a1xr3">3 · erneut hören</button><button id="a1xr4" '+(repairSession.heard1&&repairSession.spoken&&repairSession.heard2?'':'disabled')+'>Weiter</button></div></div>';document.getElementById('a1xr1').onclick=e=>repairSpeakingStep('hear1',e.currentTarget);document.getElementById('a1xr2').onclick=e=>repairSpeakingStep('speak',e.currentTarget);document.getElementById('a1xr3').onclick=e=>repairSpeakingStep('hear2',e.currentTarget);document.getElementById('a1xr4').onclick=e=>repairSpeakingStep('next',e.currentTarget)}box.querySelectorAll('[data-a1x]').forEach(b=>b.onclick=()=>repairChoice(b.dataset.a1x))}

  function renderSession(box){
    const d=session.domain;
    if(d==='reading'){const q=session.items[session.idx];box.innerHTML+='<div class="label">A1 Lesen · '+stage(d)+' · '+(session.idx+1)+'/10</div><div class="a1x-text" lang="uk">'+q.text+'</div><div class="a1x-q">'+q.q+'</div>'+choiceGrid(q.o)}
    else if(d==='listening'){const q=session.items[session.idx];box.innerHTML+='<div class="label">A1 Hören · '+stage(d)+' · '+(session.idx+1)+'/10</div><button class="secondary" id="a1xListen">🔊 Tonspur anhören · '+session.plays+'/2</button><div class="a1x-q">'+q.q+'</div>'+choiceGrid(q.o);document.getElementById('a1xListen').onclick=e=>listenExam(e.currentTarget)}
    else if(d==='writing'){const q=session.items[session.idx];box.innerHTML+='<div class="label">A1 Schreiben · '+stage(d)+' · Aufgabe '+(session.idx+1)+'/3</div><div class="a1x-q">'+q.q+'</div><textarea id="a1xWrite" class="typing-input" lang="uk" rows="5" placeholder="Frei auf Ukrainisch schreiben …"></textarea><button class="primary" id="a1xWriteCheck">Antwort abgeben</button>';document.getElementById('a1xWriteCheck').onclick=()=>answerWriting(document.getElementById('a1xWrite').value)}
    else{
      const item=speakingItem(),recording=rec.media?.state==='recording',question=item.qUk?(session.assisted?item.qUk:'Prüfungsfrage nur über Audio'):(item.instruction||'');
      box.innerHTML+='<div class="label">A1 Sprechen & Interaktion · '+stage(d)+' · '+(session.idx+1)+'/6</div><div class="tip" lang="uk">Rolle: '+session.form.role+'</div><div class="a1x-q">'+question+'</div><div class="actions">'+(item.qUk?'<button class="secondary" id="a1xHearQ">🔊 Frage hören · '+session.qPlays+'/2</button><button class="ghost" id="a1xRevealQ">Fragetext anzeigen (zählt nicht)</button>':'')+'<button class="'+(recording?'danger':'primary')+'" id="a1xRecord">'+(recording?'■ Aufnahme stoppen':'● Antwort aufnehmen')+'</button>'+(session.recorded?'<button class="secondary" id="a1xReplay">▶ eigene Antwort vollständig anhören</button>':'')+'</div><p class="small">Der Verständlichkeitsnachweis erfolgt entweder durch Browser-Erkennung oder im Prüfermodus: Eine zweite Person hört deine Aufnahme und wählt aus, was sie verstanden hat.</p><div class="actions"><button class="secondary" id="a1xRecognize">Browser-Verständlichkeit prüfen</button><button class="secondary" id="a1xReviewer">Prüfermodus mit zweiter Person</button></div>'+(session.reviewerOpen?'<div class="a1x-reviewer"><b>Zweite Person: Aufnahme anhören, dann Bedeutung wählen.</b>'+choiceGrid([item.meaning,...item.d],'data-a1review')+'<input id="a1ReviewerInitials" class="typing-input" placeholder="Initialen der zweiten Person"><p class="small">Die App kann die Identität nicht verifizieren; diese Bestätigung ist ein zusätzlicher Verständlichkeitsnachweis, kein amtlicher Prüfakt.</p></div>':'')+'<input id="a1xTranscript" class="typing-input" lang="uk" placeholder="Tippe danach exakt, was du gesagt hast …"><button class="primary" id="a1xSpeakSubmit">Antwort abschließen</button>';
      const h=document.getElementById('a1xHearQ');if(h)h.onclick=e=>hearSpeakingQuestion(e.currentTarget);const reveal=document.getElementById('a1xRevealQ');if(reveal)reveal.onclick=revealSpeakingQuestion;document.getElementById('a1xRecord').onclick=()=>recording?recordStop():recordStart();const rp=document.getElementById('a1xReplay');if(rp)rp.onclick=replaySpeaking;document.getElementById('a1xRecognize').onclick=runRecognition;document.getElementById('a1xReviewer').onclick=openReviewer;document.querySelectorAll('[data-a1review]').forEach(b=>b.onclick=()=>reviewerCheck(b.dataset.a1review,document.getElementById('a1ReviewerInitials')?.value));document.getElementById('a1xSpeakSubmit').onclick=()=>submitSpeaking(document.getElementById('a1xTranscript').value)
    }
    box.querySelectorAll('[data-a1x]').forEach(b=>b.onclick=()=>answerChoice(b.dataset.a1x));
  }

  function allDomainsPassed(){return DOMAINS.every(d=>state(d).passed&&state(d).confirmed)}
  function finalPassed(){return allDomainsPassed()&&!!s.a1CanDo?.passed}
  function renderFinal(box){const ready=allDomainsPassed(),cando=!!s.a1CanDo?.passed;box.innerHTML='<div class="a1x-head"><div><div class="label">CEFR-orientiertes A1-Gesamtprofil</div><h2>'+(finalPassed()?'A1-Kernkompetenzen intern bestanden':'A1 wird erst nach stabilen Doppel-Nachweisen abgeschlossen')+'</h2></div><div class="pill">'+(finalPassed()?'✓ A1':'A1')+'</div></div><p class="small">Jede Kernkompetenz muss an mindestens zwei verschiedenen Kalendertagen in neu kombinierten Prüfungsvarianten bestehen. Das ist ein interner CEFR-orientierter Nachweis, kein amtliches Zertifikat.</p><div class="a1x-status">'+DOMAINS.map(d=>'<div><b>'+LABELS[d]+'</b><span>'+(state(d).passed?'✓ qualifiziert + bestätigt':state(d).qualified?'◐ qualifiziert, Bestätigung offen':'noch offen')+'</span></div>').join('')+'<div><b>Handlungsorientierter Can-do-Check</b><span>'+(cando?'✓ bestanden':ready?'jetzt unten absolvieren':'noch gesperrt')+'</span></div></div>'+(finalPassed()?'<div class="tip">✓ Der geführte Kurs ist abgeschlossen. Für einen offiziell anerkannten Nachweis ist weiterhin eine externe akkreditierte Prüfung erforderlich.</div>':'<div class="tip">Die Kursdauer ist bewusst variabel. Schwächen verlängern die Prüfungsphase automatisch.</div>')}
  function renderExam(){let box=document.getElementById('a1ExamBox'),domain=domainForDay();if(!domain&&Number(s.day)!==FINAL_DAY){if(box)box.hidden=true;return}const cards=document.getElementById('cards');if(!cards)return;if(!box){box=document.createElement('section');box.id='a1ExamBox';box.className='card';cards.insertAdjacentElement('afterend',box)}box.hidden=false;if(Number(s.day)===FINAL_DAY){renderFinal(box);return}const st=state(domain),ready=previousPassed(domain),locked=lockReason(domain);box.innerHTML='<div class="a1x-head"><div><div class="label">A1-Kompetenzprüfung · '+LABELS[domain]+'</div><h2>'+LABELS[domain]+' · '+stage(domain)+'</h2></div><div class="pill">'+(st.passed?'✓':st.best?st.best+' %':'A1')+'</div></div><p class="small">Ein Bereich gilt erst nach zwei unabhängigen Bestehensnachweisen an verschiedenen Tagen als bestätigt. Ein Fehlversuch führt zuerst in Reparatur; derselbe Tag kann nicht erneut als Prüfung zählen.</p>';if(session){renderSession(box);return}if(st.passed){box.innerHTML+='<div class="tip">✓ '+LABELS[domain]+' qualifiziert am '+st.qualificationDate+' und bestätigt am '+st.confirmationDate+'.</div>';return}if(st.attempts&&!st.repairDone){renderRepair(box,domain);return}box.innerHTML+='<div class="tip">'+(!ready?'🔒 '+locked:locked?'⏳ '+locked:st.qualified?'Qualifikation geschafft. Jetzt folgt eine neu kombinierte Bestätigungsprüfung.':'Bereit für die erste Qualifikation.')+'</div><div class="actions"><button class="primary" id="a1xStart" '+(ready&&!locked?'':'disabled')+'>'+stage(domain)+' starten</button></div>';const b=document.getElementById('a1xStart');if(b)b.onclick=()=>beginDomain(domain)}

  const oldNext=document.getElementById('next')?.onclick;if(document.getElementById('next'))document.getElementById('next').onclick=function(e){const d=domainForDay();if(d&&!state(d).passed){renderExam();document.getElementById('a1ExamBox')?.scrollIntoView({behavior:'smooth',block:'center'});toast(state(d).qualified?'Diese Kompetenz braucht noch die Bestätigung an einem späteren Kalendertag.':'Diese A1-Teilprüfung muss zuerst qualifiziert und bestätigt werden.');return}if(Number(s.day)===FINAL_DAY){if(!finalPassed()){renderExam();toast('Kursabschluss erst nach vier doppelt bestätigten A1-Kompetenzen und dem Can-do-Check.');return}s.done[FINAL_DAY]=date();ensure().completedAt=ensure().completedAt||date();save()}return oldNext?.call(this,e)};
  const css=document.createElement('style');css.textContent='.a1x-head{display:flex;justify-content:space-between;gap:12px}.a1x-text{font-size:1.18rem;font-weight:750;padding:14px;margin:12px 0;border-radius:12px;background:rgba(21,93,181,.07)}.a1x-q{font-size:1.08rem;font-weight:800;margin:14px 0}.a1x-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin:12px 0}.a1x-repair,.a1x-reviewer{margin-top:16px;padding-top:14px;border-top:1px solid rgba(0,0,0,.1)}.a1x-status{display:grid;gap:7px;margin:14px 0}.a1x-status>div{display:flex;justify-content:space-between;gap:12px;padding:9px 0;border-bottom:1px solid rgba(0,0,0,.08)}textarea.typing-input{min-height:120px;resize:vertical}@media(max-width:520px){.a1x-grid{grid-template-columns:1fr}.a1x-status>div{align-items:flex-start;flex-direction:column}}';document.head.append(css);
  window.UKRAINIAN_A1_EXAM={version:VERSION,start,days:5,domains:[...DOMAINS],generatedForms:true,doublePass:true,retakeNextDay:true,repairRequired:true,maxListeningPlays:2,controlledVocabulary:true,cefrAligned:true,officialCertificate:false,thresholds:{reading:'8/10 × 2 Tage',listening:'8/10 × 2 Tage',writing:'8/10 Kriterien × 2 Tage',speaking:'6/6 × 2 Tage + Verständlichkeitsnachweis'},get domainsPassed(){return allDomainsPassed()},get passed(){return finalPassed()}};
  const previousRender=render;render=function(){previousRender();renderExam()};ensure();renderExam();
})();