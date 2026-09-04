/* Ukrainischkurs für Joel · Comprehension Lab v1
   Kurze unbekannte Lesetexte und Hörsituationen. Auf Review-Tagen Pflicht,
   damit Kartenwissen in echtes Verstehen übergeht. */
(() => {
  const VERSION=1;
  const READINGS=[
    {min:18,text:'Привіт! Мене звати Олег. Я живу в Києві.',q:'Wo lebt Oleg?',a:'In Kyjiw',o:['In Kyjiw','In Deutschland','Im Hotel']},
    {min:20,text:'Марія зараз вдома. Вона п’є каву.',q:'Was macht Marija?',a:'Sie trinkt Kaffee',o:['Sie trinkt Kaffee','Sie fährt Bus','Sie schläft']},
    {min:22,text:'Я не розумію. Повторіть, будь ласка, повільно.',q:'Was braucht die Person?',a:'Eine langsame Wiederholung',o:['Eine langsame Wiederholung','Die Rechnung','Eine Fahrkarte']},
    {min:24,text:'Сьогодні тепло. Ми разом і йдемо в кафе.',q:'Was machen die Personen?',a:'Sie gehen zusammen in ein Café',o:['Sie gehen zusammen in ein Café','Sie fahren zum Bahnhof','Sie bleiben im Hotel']},
    {min:26,text:'Я хочу чай без цукру. Рахунок, будь ласка.',q:'Was möchte die Person trinken?',a:'Tee ohne Zucker',o:['Tee ohne Zucker','Kaffee mit Milch','Wasser mit Kohlensäure']},
    {min:28,text:'Де вокзал? Він далеко? — Ні, близько.',q:'Wie weit ist der Bahnhof?',a:'Nah',o:['Nah','Weit','Unbekannt']},
    {min:32,text:'Мені погано. У мене болить голова. Мені потрібна допомога.',q:'Was ist die wichtigste Aussage?',a:'Die Person braucht Hilfe',o:['Die Person braucht Hilfe','Die Person möchte einkaufen','Die Person sucht ein Restaurant']},
    {min:37,text:'Це моя сім’я. Це моя мама, а це мій брат.',q:'Wer wird neben der Mutter genannt?',a:'Der Bruder',o:['Der Bruder','Der Vater','Der Freund']},
    {min:40,text:'Я живу в Німеччині, але зараз я в Україні.',q:'Wo ist die Person jetzt?',a:'In der Ukraine',o:['In der Ukraine','In Deutschland','Zu Hause in Kyjiw']},
    {min:43,text:'Скільки це коштує? — Двадцять. Добре, я беру це.',q:'Was entscheidet die Person?',a:'Sie nimmt/kauft es',o:['Sie nimmt/kauft es','Es ist zu teuer','Sie fragt nach dem Weg']},
    {min:48,text:'Я не можу сьогодні. Можливо, завтра.',q:'Wann geht es vielleicht?',a:'Morgen',o:['Morgen','Heute','Gestern']},
    {min:50,text:'Ти розумієш? — Так, але говоріть повільніше, будь ласка.',q:'Was soll das Gegenüber tun?',a:'Langsamer sprechen',o:['Langsamer sprechen','Lauter sprechen','Etwas aufschreiben']},
    {min:52,text:'Я хочу їсти. Де ресторан? — Ресторан тут, близько.',q:'Warum sucht die Person ein Restaurant?',a:'Sie möchte essen',o:['Sie möchte essen','Sie braucht einen Arzt','Sie möchte schlafen']},
    {min:54,text:'Мене звати Андрій. Я з України. Я працюю в банку.',q:'Wo arbeitet Andrij?',a:'In einer Bank',o:['In einer Bank','In einem Hotel','In einem Restaurant']}
  ];
  const LISTENING=[
    {min:18,uk:'Добре, дякую. А ти?',q:'Wie geht es der sprechenden Person?',a:'Gut',o:['Gut','Schlecht','Sie weiß es nicht']},
    {min:20,uk:'Я хочу каву.',q:'Was möchte die Person?',a:'Kaffee',o:['Kaffee','Tee','Wasser']},
    {min:22,uk:'Я не розумію.',q:'Was sagt die Person?',a:'Ich verstehe nicht',o:['Ich verstehe nicht','Ich weiß nicht','Ich möchte nicht']},
    {min:24,uk:'Повторіть, будь ласка.',q:'Worum bittet die Person?',a:'Um Wiederholung',o:['Um Wiederholung','Um die Rechnung','Um Hilfe beim Bezahlen']},
    {min:26,uk:'Де зупинка?',q:'Was sucht die Person?',a:'Die Haltestelle',o:['Die Haltestelle','Die Apotheke','Das Hotel']},
    {min:28,uk:'Рахунок, будь ласка.',q:'Was möchte die Person?',a:'Die Rechnung',o:['Die Rechnung','Die Speisekarte','Eine Fahrkarte']},
    {min:32,uk:'Мені потрібна допомога.',q:'Was braucht die Person?',a:'Hilfe',o:['Hilfe','Kaffee','Ein Telefon']},
    {min:37,uk:'Це моя сім’я.',q:'Worüber spricht die Person?',a:'Über ihre Familie',o:['Über ihre Familie','Über die Arbeit','Über einen Bahnhof']},
    {min:40,uk:'Скільки це коштує?',q:'Was wird gefragt?',a:'Der Preis',o:['Der Preis','Die Uhrzeit','Der Name']},
    {min:43,uk:'Я зараз вдома.',q:'Wo ist die Person?',a:'Zu Hause',o:['Zu Hause','Im Hotel','Im Restaurant']},
    {min:48,uk:'Ти розумієш?',q:'Was wird gefragt?',a:'Ob du verstehst',o:['Ob du verstehst','Ob du Hunger hast','Wo du wohnst']},
    {min:50,uk:'Я не можу.',q:'Was sagt die Person?',a:'Ich kann nicht',o:['Ich kann nicht','Ich will nicht','Ich weiß nicht']},
    {min:52,uk:'Я хочу їсти.',q:'Welches Bedürfnis wird ausgedrückt?',a:'Essen',o:['Essen','Schlafen','Fahren']},
    {min:54,uk:'Я з Німеччини.',q:'Woher kommt die Person?',a:'Aus Deutschland',o:['Aus Deutschland','Aus der Ukraine','Aus Kyjiw']}
  ];
  const shuffle=a=>[...a].sort(()=>Math.random()-.5);
  let session=null;
  function ensure(){if(!s.comprehensionLab||typeof s.comprehensionLab!=='object')s.comprehensionLab={version:VERSION,days:{},bestReading:0,bestListening:0};s.comprehensionLab.version=VERSION;s.comprehensionLab.days=s.comprehensionLab.days||{};return s.comprehensionLab}
  function dayState(){const st=ensure();return st.days[date()]||(st.days[date()]={reading:false,listening:false})}
  function available(type){const bank=type==='reading'?READINGS:LISTENING;return bank.filter(x=>s.day>=x.min)}
  function requiredToday(){return alphabetReady()&&s.day>=18&&WEEKLY_REVIEW_DAYS.includes(s.day)}
  function start(type){const pool=available(type);if(pool.length<3){toast('Dafür brauchst du erst ein paar Wortlektionen.');return}session={type,items:shuffle(pool).slice(0,3),idx:0,correct:0,first:true};renderLab();if(type==='listening')setTimeout(()=>playCurrent(false),120)}
  function current(){return session?.items?.[session.idx]}
  function playCurrent(slow){const q=current();if(!q?.uk)return;const button=document.getElementById(slow?'clSlow':'clListen');if(typeof speak==='function'){
      const old=Number(s.voiceRate)||.72;s.voiceRate=slow?.58:.76;speak(q.uk,button);s.voiceRate=old;
    }}
  function answer(v){const q=current(),good=v===q.a;if(good)session.correct++;toast(good?'Richtig verstanden.':'Richtig wäre: '+q.a);session.idx++;if(session.idx>=session.items.length){finish();return}renderLab();if(session.type==='listening')setTimeout(()=>playCurrent(false),120)}
  function finish(){const st=ensure(),score=Math.round(session.correct/session.items.length*100),passed=session.correct>=2,kind=session.type;st[kind==='reading'?'bestReading':'bestListening']=Math.max(st[kind==='reading'?'bestReading':'bestListening']||0,score);if(passed)dayState()[kind]=true;save();session=null;toast(passed?(kind==='reading'?'Leseverständnis bestanden.':'Hörverständnis bestanden.'):'Noch nicht stabil: mindestens 2 von 3 im ersten Durchgang.');render()}
  function sessionHtml(){const q=current(),pos=session.idx+1;if(session.type==='reading')return '<div class="cl-test"><div class="label">Unbekannter Kurztext · '+pos+' / '+session.items.length+'</div><div class="cl-text" lang="uk">'+q.text+'</div><div class="cl-q">'+q.q+'</div><div class="cl-grid">'+shuffle(q.o).map(x=>'<button class="answer" data-cl="'+x.replace(/"/g,'&quot;')+'">'+x+'</button>').join('')+'</div></div>';
    return '<div class="cl-test"><div class="label">Hören ohne Mitlesen · '+pos+' / '+session.items.length+'</div><div class="actions"><button class="primary" id="clListen">🔊 normal anhören</button><button class="secondary" id="clSlow">🐢 langsamer</button></div><div class="cl-q">'+q.q+'</div><div class="cl-grid">'+shuffle(q.o).map(x=>'<button class="answer" data-cl="'+x.replace(/"/g,'&quot;')+'">'+x+'</button>').join('')+'</div><details class="pronunciation"><summary>Transkript erst nach dem Antworten / zum Kontrollieren</summary><div class="trans" lang="uk">'+q.uk+'</div></details></div>'}
  function renderLab(){let box=document.getElementById('comprehensionLab');if(!alphabetReady()||s.day<18){if(box)box.hidden=true;return}const cards=document.getElementById('cards');if(!cards)return;if(!box){box=document.createElement('section');box.id='comprehensionLab';box.className='card';cards.insertAdjacentElement('afterend',box)}box.hidden=false;const ds=dayState(),required=requiredToday();box.innerHTML='<div class="cl-head"><div><div class="label">Transfer · echtes Verstehen</div><h2>Nicht nur Karten erkennen: kurze neue Situationen</h2></div><div class="pill">'+([ds.reading,ds.listening].filter(Boolean).length)+'/2</div></div><p class="small">Lesen nutzt kurze Texte, die du nicht als Karte auswendig gelernt hast. Beim Hören bleibt das Transkript zunächst verborgen. Auf Wiederholungstagen sind beide Mini-Sets Pflicht.</p>'+(session?sessionHtml():'<div class="cl-panels"><div><strong>'+(ds.reading?'✓ ':'')+'Lesen</strong><p class="small">3 kurze unbekannte Texte · Ziel 2/3.</p><button class="'+(ds.reading?'secondary':'primary')+'" data-cl-start="reading">'+(ds.reading?'noch einmal':'Lese-Set starten')+'</button></div><div><strong>'+(ds.listening?'✓ ':'')+'Hören</strong><p class="small">3 Aussagen ohne sichtbaren Text · Ziel 2/3.</p><button class="'+(ds.listening?'secondary':'primary')+'" data-cl-start="listening">'+(ds.listening?'noch einmal':'Hör-Set starten')+'</button></div></div><div class="tip">'+(required?(ds.reading&&ds.listening?'✓ Review-Transfer heute erledigt.':'Heute ist Review-Tag: Lesen und Hören gehören zum Tagesabschluss.'):'Heute freiwillig; an Review-Tagen wird der Transfer verpflichtend.')+'</div>');box.querySelectorAll('[data-cl-start]').forEach(b=>b.onclick=()=>start(b.dataset.clStart));box.querySelectorAll('[data-cl]').forEach(b=>b.onclick=()=>answer(b.dataset.cl));const l=document.getElementById('clListen'),slow=document.getElementById('clSlow');if(l)l.onclick=()=>playCurrent(false);if(slow)slow.onclick=()=>playCurrent(true)}
  const oldNext=document.getElementById('next')?.onclick;if(document.getElementById('next'))document.getElementById('next').onclick=function(e){const ds=dayState();if(requiredToday()&&(!ds.reading||!ds.listening)){renderLab();document.getElementById('comprehensionLab')?.scrollIntoView({behavior:'smooth',block:'center'});toast('Review-Tag: erst ein kurzes Lese- und Hörverständnis-Set abschließen.');return}return oldNext?.call(this,e)};
  const css=document.createElement('style');css.textContent='.cl-head{display:flex;justify-content:space-between;gap:12px}.cl-panels{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px;margin:12px 0}.cl-panels>div{background:#f4f8fc;border-radius:14px;padding:13px}.cl-test{text-align:center;background:#f4f8fc;border-radius:16px;padding:14px}.cl-text{font-size:1.2rem;font-weight:800;line-height:1.55;margin:12px auto;max-width:620px}.cl-q{font-weight:800;margin:13px 0}.cl-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.cl-grid .answer{text-align:center}@media(max-width:560px){.cl-panels,.cl-grid{grid-template-columns:1fr}}';document.head.append(css);
  const previousRender=render;render=function(){previousRender();renderLab()};ensure();renderLab();
})();
