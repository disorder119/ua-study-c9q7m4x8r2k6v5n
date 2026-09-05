/* Ukrainischkurs für Joel · Disorder119 Resale Practice v1
   15 freiwillige reale Verkaufssituationen mit 60 aktiven Antwortzügen.
   Reiner Zusatz: ersetzt weder Fashion Bridge noch regulären A1-Pfad oder Prüfungen. */
(()=>{
  const VERSION=1,core=window.UKRAINIAN_LEARNING_CORE;if(!core)return;
  const SCENARIOS=[
    {title:'Artikel beschreiben',tag:'Listing',turns:[
      ['Що ви продаєте?','Sag: Ich verkaufe eine Jacke.',['Я продаю куртку.']],
      ['Якого вона кольору?','Sag: Sie ist schwarz.',['Вона чорна.','Куртка чорна.']],
      ['Це нова куртка?','Sag: Ja, sie ist neu.',['Так, вона нова.','Так, куртка нова.']],
      ['Є фото?','Sag: Ja, es gibt Fotos.',['Так, є фото.','Так, фото є.']]
    ]},
    {title:'Größe & Passform',tag:'Sizing',turns:[
      ['Який розмір?','Sag: Größe M.',['Розмір M.','Це розмір M.']],
      ['Куртка велика?','Sag: Ja, sie ist groß.',['Так, вона велика.','Так, куртка велика.']],
      ['Це оверсайз?','Sag: Ja, das ist Oversize.',['Так, це оверсайз.']],
      ['Можна фото ярлика?','Sag: Ja, es gibt ein Foto vom Tag.',['Так, є фото ярлика.','Так, фото ярлика є.']]
    ]},
    {title:'Material',tag:'Material',turns:[
      ['Який матеріал?','Sag: Das ist Leder.',['Це шкіра.']],
      ['Це бавовна?','Sag: Nein, das ist Wolle.',['Ні, це вовна.']],
      ['Це справжня шкіра?','Sag: Ja, das ist echtes Leder.',['Так, це справжня шкіра.']],
      ['Матеріал м’який?','Sag: Ja, das Material ist weich.',['Так, матеріал м’який.']]
    ]},
    {title:'Zustand',tag:'Condition',turns:[
      ['Який стан?','Sag: Der Zustand ist gut.',['Стан хороший.','Хороший стан.']],
      ['Товар вживаний?','Sag: Ja, der Artikel ist gebraucht.',['Так, товар вживаний.']],
      ['Він чистий?','Sag: Ja, er ist sauber.',['Так, він чистий.']],
      ['Стан дуже хороший?','Sag: Ja, sehr gut.',['Так, дуже хороший.','Так, стан дуже хороший.']]
    ]},
    {title:'Defekt ehrlich erklären',tag:'Defect',turns:[
      ['Є дефекти?','Sag: Ja, es gibt einen kleinen Defekt.',['Так, є маленький дефект.']],
      ['Де дефект?','Sag: Der Defekt ist hinten.',['Дефект ззаду.','Він ззаду.']],
      ['Це видно?','Sag: Ja, ein bisschen.',['Так, трохи.']],
      ['Є ще дефекти?','Sag: Nein, keine weiteren Defekte.',['Ні, більше дефектів немає.','Ні, більше немає.']]
    ]},
    {title:'Preis nennen',tag:'Price',turns:[
      ['Яка ціна?','Sag: Der Preis ist 100 Euro.',['Ціна сто євро.','Сто євро.']],
      ['Це дорого?','Sag: Nein, der Preis ist gut.',['Ні, ціна хороша.']],
      ['Ціна остаточна?','Sag: Ja, der Preis ist endgültig.',['Так, ціна остаточна.']],
      ['Можна дешевше?','Sag: Ein bisschen.',['Трохи.','Так, трохи.']]
    ]},
    {title:'Preis verhandeln',tag:'Negotiation',turns:[
      ['Можна знижку?','Sag: Ja, ich kann einen Rabatt machen.',['Так, можу зробити знижку.']],
      ['Дев’яносто євро?','Sag: Nein, 95 Euro.',['Ні, дев’яносто п’ять євро.']],
      ['Добре, дев’яносто п’ять.','Sag: Danke.',['Дякую.']],
      ['Домовилися?','Sag: Ja, abgemacht.',['Так, домовилися.']]
    ]},
    {title:'Maße',tag:'Measurements',turns:[
      ['Яка довжина?','Sag: Die Länge ist 70 Zentimeter.',['Довжина сімдесят сантиметрів.']],
      ['Яка ширина?','Sag: Die Breite ist 50 Zentimeter.',['Ширина п’ятдесят сантиметрів.']],
      ['Можете виміряти?','Sag: Ja, ich kann messen.',['Так, можу виміряти.']],
      ['Коли?','Sag: Heute.',['Сьогодні.']]
    ]},
    {title:'Original & Echtheit',tag:'Authenticity',turns:[
      ['Це оригінал?','Sag: Ja, das ist ein Original.',['Так, це оригінал.']],
      ['Це справжній Prada?','Sag: Ja, das ist echter Prada.',['Так, це справжній Prada.']],
      ['Є етикетка?','Sag: Ja, es gibt ein Etikett.',['Так, є етикетка.']],
      ['Є фото логотипа?','Sag: Ja, es gibt ein Foto vom Logo.',['Так, є фото логотипа.']]
    ]},
    {title:'Fotos & Details',tag:'Photos',turns:[
      ['Можна більше фото?','Sag: Ja, natürlich.',['Так, звичайно.']],
      ['Можна фото спереду?','Sag: Ja, ich schicke ein Foto.',['Так, надішлю фото.','Так, я надішлю фото.']],
      ['Можна фото ззаду?','Sag: Ja, auch von hinten.',['Так, і ззаду.']],
      ['Дякую.','Sag: Bitte / Gern.',['Будь ласка.']]
    ]},
    {title:'Verfügbarkeit',tag:'Availability',turns:[
      ['Товар ще є?','Sag: Ja, der Artikel ist noch da.',['Так, товар ще є.']],
      ['Його вже продали?','Sag: Nein, noch nicht.',['Ні, ще ні.']],
      ['Можна купити сьогодні?','Sag: Ja, heute.',['Так, сьогодні.']],
      ['Добре.','Sag: Danke.',['Дякую.']]
    ]},
    {title:'Reservieren',tag:'Reserve',turns:[
      ['Можете відкласти товар?','Sag: Ja, ich kann ihn reservieren.',['Так, можу відкласти товар.']],
      ['До завтра?','Sag: Ja, bis morgen.',['Так, до завтра.']],
      ['Без оплати?','Sag: Ja.',['Так.']],
      ['Дякую.','Sag: Bitte / Gern.',['Будь ласка.']]
    ]},
    {title:'Versand',tag:'Shipping',turns:[
      ['Коли відправите?','Sag: Ich verschicke morgen.',['Відправлю завтра.','Я відправлю завтра.']],
      ['Є доставка?','Sag: Ja, Lieferung ist möglich.',['Так, є доставка.']],
      ['Посилка готова?','Sag: Ja, das Paket ist fertig.',['Так, посилка готова.']],
      ['Є номер відстеження?','Sag: Ja, es gibt eine Trackingnummer.',['Так, є номер відстеження.']]
    ]},
    {title:'Versand ins Ausland',tag:'International',turns:[
      ['Ви можете відправити в Німеччину?','Sag: Ja, ich kann nach Deutschland schicken.',['Так, можу відправити в Німеччину.']],
      ['Яка адреса?','Sag: Ich schicke die Adresse.',['Я надішлю адресу.','Надішлю адресу.']],
      ['Доставка дорога?','Sag: Nein, nicht teuer.',['Ні, недорога.']],
      ['Коли буде доставка?','Sag: In drei Tagen.',['Через три дні.']]
    ]},
    {title:'Kompletter Käuferchat',tag:'Mini chat',turns:[
      ['Добрий день. Куртка ще є?','Antworte: Guten Tag. Ja, die Jacke ist noch da.',['Добрий день. Так, куртка ще є.']],
      ['Який розмір і матеріал?','Sag: Größe M, Leder.',['Розмір M, шкіра.','Розмір M. Це шкіра.']],
      ['Можна знижку?','Sag: Ja, 10 Euro Rabatt.',['Так, знижка десять євро.','Так, можу зробити знижку десять євро.']],
      ['Добре, я купую.','Sag: Danke, ich verschicke morgen.',['Дякую, відправлю завтра.','Дякую. Я відправлю завтра.']]
    ]}
  ];
  let session=null;
  const esc=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function ensure(){if(!s.resalePractice||typeof s.resalePractice!=='object')s.resalePractice={version:VERSION,best:{},attempts:{}};s.resalePractice.version=VERSION;s.resalePractice.best=s.resalePractice.best||{};s.resalePractice.attempts=s.resalePractice.attempts||{};return s.resalePractice}
  function unlocked(){try{return core.isUnlocked('alphabet.mastery')}catch{return Number(s.day)>=14}}
  function availableCount(){if(!unlocked())return 0;const d=Math.max(0,Number(s.day)||0);return Math.min(SCENARIOS.length,1+Math.floor(Math.max(0,d-14)/5))}
  function activeIndex(){const n=availableCount();if(!n)return 0;const saved=Number(ensure().active);return Number.isInteger(saved)&&saved>=0&&saved<n?saved:(n-1)}
  function speakPrompt(text,button){if(typeof speak==='function')speak(text,button)}
  function setActive(i){const n=availableCount();if(i<0||i>=n)return;ensure().active=i;session=null;save();renderResale()}
  function begin(){const i=activeIndex();session={scenario:i,turn:0,correct:0,assisted:false};renderResale()}
  function check(){if(!session)return;const input=document.getElementById('rpInput'),value=input?.value||'',task=SCENARIOS[session.scenario].turns[session.turn];const good=core.accepts(value,task[2]);if(good)session.correct++;else session.assisted=true;toast(good?'Richtig.':'Noch nicht. Muster: '+task[2][0]);session.turn++;if(session.turn>=4){const st=ensure(),k=String(session.scenario);st.best[k]=Math.max(Number(st.best[k])||0,session.correct);st.attempts[k]=(Number(st.attempts[k])||0)+1;save();toast('Resale-Praxis: '+session.correct+'/4');session=null}renderResale()}
  function reveal(){if(!session)return;session.assisted=true;const task=SCENARIOS[session.scenario].turns[session.turn],hint=document.getElementById('rpHint');if(hint)hint.textContent='Muster: '+task[2][0]}
  function scenarioButtons(){const n=availableCount(),active=activeIndex();return '<div class="rp-tabs">'+SCENARIOS.slice(0,n).map((x,i)=>'<button class="'+(i===active?'primary':'ghost')+'" data-rp-tab="'+i+'">'+(i+1)+'. '+esc(x.tag)+'</button>').join('')+'</div>'}
  function taskHtml(){const task=SCENARIOS[session.scenario].turns[session.turn];return '<div class="rp-task"><div class="label">Käufer · Zug '+(session.turn+1)+'/4</div><div class="rp-buyer" lang="uk">'+esc(task[0])+'</div><button class="ghost" id="rpListen">🔊 Käuferfrage hören</button><div class="small rp-goal">'+esc(task[1])+'</div><input id="rpInput" lang="uk" autocomplete="off" placeholder="Antworte selbst auf Ukrainisch"><div id="rpHint" class="small"></div><div class="actions"><button class="primary" id="rpCheck">Antwort prüfen</button><button class="ghost" id="rpReveal">Muster zeigen</button></div></div>'}
  function renderResale(){let box=document.getElementById('resalePracticeLesson'),cards=document.getElementById('cards');if(!cards||!unlocked()){if(box)box.hidden=true;return}if(!box){box=document.createElement('section');box.id='resalePracticeLesson';box.className='card';const after=document.getElementById('fashionBridgeLesson')||document.getElementById('designerAlphabetLesson')||cards;after.insertAdjacentElement('afterend',box)}box.hidden=false;const i=activeIndex(),sc=SCENARIOS[i],best=Number(ensure().best[String(i)])||0;box.innerHTML='<div class="top"><div><div class="label">Disorder119 Resale-Praxis · freiwilliger Zusatz</div><h2>'+esc(sc.title)+'</h2></div><div class="pill">'+best+'/4</div></div><p class="small">Reale Verkaufssprache zusätzlich zum normalen Kurs. Neue Situationen werden schrittweise freigeschaltet. Sie verändern weder deinen A1-Fortschritt noch die Abschlussprüfung.</p>'+scenarioButtons()+(session?taskHtml():'<div class="actions"><button class="secondary" id="rpStart">4-Zug-Situation starten</button></div>');box.querySelectorAll('[data-rp-tab]').forEach(b=>b.onclick=()=>setActive(Number(b.dataset.rpTab)));const start=document.getElementById('rpStart');if(start)start.onclick=begin;const checkBtn=document.getElementById('rpCheck');if(checkBtn)checkBtn.onclick=check;const revealBtn=document.getElementById('rpReveal');if(revealBtn)revealBtn.onclick=reveal;const listen=document.getElementById('rpListen');if(listen&&session){const task=SCENARIOS[session.scenario].turns[session.turn];listen.onclick=()=>speakPrompt(task[0],listen)}const input=document.getElementById('rpInput');if(input)input.onkeydown=e=>{if(e.key==='Enter')check()}}
  const css=document.createElement('style');css.textContent='.rp-tabs{display:flex;gap:6px;overflow:auto;padding:7px 0 11px}.rp-tabs button{white-space:nowrap;padding:7px 9px;font-size:.75rem}.rp-task{margin-top:10px;border:1px solid #dce8f4;border-radius:15px;padding:13px}.rp-buyer{font-size:1.15rem;font-weight:850;margin:8px 0}.rp-goal{margin:11px 0 7px}.rp-task input{width:100%;box-sizing:border-box;padding:11px 12px;border:1px solid #cfddec;border-radius:11px;font-size:1rem}';document.head.append(css);
  window.UKRAINIAN_RESALE_PRACTICE={version:VERSION,scenarios:SCENARIOS.length,turns:SCENARIOS.reduce((n,x)=>n+x.turns.length,0),optional:true,personalized:true,alphabetDependency:true,centralScoring:true,systemAudio:true,get unlockedScenarios(){return availableCount()},get completedScenarios(){return Object.values(ensure().best).filter(x=>Number(x)>=3).length}};
  const previousRender=render;render=function(){previousRender();renderResale()};ensure();renderResale();
})();