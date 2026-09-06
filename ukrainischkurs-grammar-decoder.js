/* Ukrainischkurs für Joel · Grammar Decoder v1
   Erklärt ausgewählte A1-Fehler kurz und konkret. Keine neue Prüfungslogik:
   Die eigentliche Bewertung bleibt vollständig im zentralen Lernkern. */
(()=>{
  const VERSION=1,core=window.UKRAINIAN_LEARNING_CORE;if(!core)return;
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const norm=v=>core.normalize(v,{stripStress:true});
  const any=(text,parts)=>parts.some(x=>text.includes(x));
  function explain(input,answers,prompt=''){
    const expected=Array.isArray(answers)?answers:[answers],target=norm(expected[0]||''),given=norm(input),q=String(prompt||'').toLocaleLowerCase('de');
    const base={expected:expected[0]||'',given:String(input||'').trim()||'—'};
    if(any(target,['немає']))return {...base,title:'Verneinung mit „немає“',reason:'Bei „nicht haben / es gibt nicht“ steht im Ukrainischen häufig „немає“; das folgende Nomen bekommt dabei die passende Genitivform.',tips:['„У мене є …“ = ich habe …','„У мене немає …“ = ich habe kein …','Nicht einfach nur „не“ vor den positiven Satz setzen.']};
    if(any(target,['буду ','будеш ','буде ']))return {...base,title:'Zukunft: Person steckt in буду / будеш / буде',reason:'Bei der einfachen Zukunft bleibt das Vollverb im Infinitiv. Die Person wird durch „буду / будеш / буде“ ausgedrückt.',tips:['я буду працювати','ти будеш працювати','він / вона буде працювати']};
    if(any(target,['був','була','працював','працювала','говорив','говорила','хотів','хотіла']))return {...base,title:'Vergangenheit: auf Person und Geschlecht achten',reason:'In diesen A1-Mustern zeigt die Vergangenheitsform das Geschlecht der Person. Für Joel als männlichen Sprecher stehen z. B. „я був“ und „я працював“.',tips:['männlich: був / працював','weiblich: була / працювала','Zeitwort wie вчора kann zusätzlich davor oder danach stehen.']};
    if((q.includes('wohin')||q.includes('geh')||q.includes('fahr')||q.includes('куди'))&&any(target,[' в магазин',' в ресторан',' в аптеку',' в київ']))return {...base,title:'Richtung statt Ort',reason:'Die Aussage beschreibt eine Bewegung zu einem Ziel. Deshalb brauchst du die Richtungsform – nicht die Form für „wo bin ich?“.',tips:['Де? = wo? → Ort','Куди? = wohin? → Richtung','Я в магазині, aber Я йду в магазин.']};
    if((q.includes('wo ')||q.includes('bist')||q.includes('war')||q.includes('де'))&&any(target,['магазині','ресторані','готелі','києві']))return {...base,title:'Ort statt Richtung',reason:'Hier beantwortest du „Де? = Wo?“. Bei den gelernten Ortsmustern brauchst du deshalb die Ortsform.',tips:['Я в магазині = ich bin im Geschäft','Я в ресторані = ich bin im Restaurant','Bewegung wäre dagegen: Я йду в магазин.']};
    if(any(target,['каву','воду','аптеку']))return {...base,title:'Akkusativ bei häufigen -а-Wörtern',reason:'Bei vielen femininen Wörtern auf -а wird für Objekt oder Ziel die Endung -у verwendet.',tips:['кава → каву','вода → воду','аптека → аптеку']};
    if(target.startsWith('ти ')&&given.startsWith('я '))return {...base,title:'Person verwechselt: Ти statt Я',reason:'Die Aufgabe fragt nach „du“. Deshalb muss auch Verb oder Satzanfang zur zweiten Person passen.',tips:['Я хочу → Ти хочеш','Я можу → Ти можеш','Я живу → Ти живеш']};
    if(target.startsWith('я ')&&given.startsWith('ти '))return {...base,title:'Person verwechselt: Я statt Ти',reason:'Die Aufgabe verlangt eine eigene Aussage mit „ich“. Verwende deshalb die Ich-Form.',tips:['Ти хочеш → Я хочу','Ти можеш → Я можу','Ти живеш → Я живу']};
    if(any(target,['не розумію','не можу','не знаю']))return {...base,title:'Verneinung mit „не“',reason:'Bei diesen gelernten Verben steht „не“ direkt vor dem Verb.',tips:['Я розумію → Я не розумію','Я можу → Я не можу','Я знаю → Я не знаю']};
    return {...base,title:'Form noch einmal vergleichen',reason:'Die Bedeutung passt noch nicht exakt zur erwarteten A1-Form. Vergleiche besonders Person, Endung, Verneinung und die Unterscheidung Ort/Richtung.',tips:['Nicht Wort für Wort aus dem Deutschen übertragen.','Prüfe zuerst: Wer? Wann? Wo oder wohin?','Danach die ukrainische Satzform als ganzen Chunk abrufen.']};
  }
  function show(meta={}){
    const e=explain(meta.input,meta.answers,meta.prompt),cards=document.getElementById('cards');if(!cards)return e;
    let box=document.getElementById('grammarDecoderFeedback');if(!box){box=document.createElement('section');box.id='grammarDecoderFeedback';box.className='card';cards.insertAdjacentElement('afterend',box)}
    box.hidden=false;box.innerHTML='<div class="gd-head"><div><div class="label">Warum war das falsch?</div><h2>'+esc(e.title)+'</h2></div><button class="ghost" id="gdClose">Schließen</button></div><p>'+esc(e.reason)+'</p><div class="gd-compare"><div><span>Deine Antwort</span><strong lang="uk">'+esc(e.given)+'</strong></div><div><span>Passendes Muster</span><strong lang="uk">'+esc(e.expected)+'</strong></div></div><ul>'+e.tips.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>';
    document.getElementById('gdClose').onclick=()=>{box.hidden=true};box.scrollIntoView({behavior:'smooth',block:'nearest'});return e;
  }
  const css=document.createElement('style');css.textContent='.gd-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start}.gd-compare{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:12px 0}.gd-compare>div{padding:11px;border-radius:12px;background:#f4f8fc}.gd-compare span{display:block;font-size:.76rem;color:#526b87;margin-bottom:4px}.gd-compare strong{font-size:1.05rem}@media(max-width:560px){.gd-compare{grid-template-columns:1fr}}';document.head.append(css);
  window.UKRAINIAN_GRAMMAR_DECODER={version:VERSION,explain,show,centralScoringUntouched:true};
})();