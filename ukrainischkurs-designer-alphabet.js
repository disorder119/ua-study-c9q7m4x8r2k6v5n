/* Ukrainischkurs für Joel · Disorder119 Designer-Alphabet v3
   Persönliche Mode-/Shop-Merkanker für die ersten 11 Alphabettage.
   Mehrere Marken und Modewörter rotieren als Gedächtnisanker.
   Erst Zeichen erinnern, dann den echten ukrainischen Laut aktiv abrufen.
   Die Merkhilfe bleibt bewusst außerhalb des eigentlichen Alphabet-Mastery-Gates. */
(()=>{
  const VERSION=3;
  const ORDER='А Б В Г Ґ Д Е Є Ж З И І Ї Й К Л М Н О П Р С Т У Ф Х Ц Ч Ш Щ Ь Ю Я'.split(' ');
  const FALSE_FRIENDS={
    'В':'Sieht wie deutsches B aus → liest sich ungefähr W/V.',
    'Н':'Sieht wie deutsches H aus → liest sich N.',
    'Р':'Sieht wie deutsches P aus → liest sich R.',
    'С':'Sieht wie deutsches C aus → liest sich S.',
    'У':'Sieht wie deutsches Y aus → liest sich U.',
    'Х':'Sieht wie deutsches X aus → ukrainischer ch-Laut.'
  };
  const A={
    'А':{brands:['Alexander McQueen','Ann Demeulemeester','Alaïa','Acne Studios'],words:['аксесуар · Accessoire'],tip:'A → А. Mehrere bekannte A-Labels geben dir sofort ein stabiles Bild.'},
    'Б':{brands:['Balenciaga','Balmain','Bottega Veneta','Burberry'],words:['бренд · Marke'],tip:'B → Б. Denk an vier verschiedene B-Labels statt nur an eins.'},
    'В':{brands:['Vivienne Westwood','Valentino','Versace','Vetements'],words:['взуття · Schuhe'],tip:'V/W-Marken helfen gegen die gefährliche B-Optik: В wird W/V gelesen.'},
    'Г':{brands:['Gucci','Ganni'],words:['гаманець · Wallet','ґ? Nein: Г und Ґ getrennt merken'],tip:'Bei Г nur sprachlich plausible Anker verwenden; der echte Laut bleibt ukrainisch.'},
    'Ґ':{brands:[],words:['ґудзик · Knopf','ґудзики · Knöpfe','kleiner Zusatzstrich = Ґ'],tip:'Keine künstliche Designer-Zuordnung erzwingen: Ґ wird über echte Wörter und die Form gelernt.'},
    'Д':{brands:['Dior','Dsquared2','Diesel','Dolce & Gabbana'],words:['дизайнер · Designer'],tip:'Vier D-Marken machen die ungewöhnliche Д-Form leichter abrufbar.'},
    'Е':{brands:['Etro','Eytys'],words:['етикетка · Etikett','елемент · Detail'],tip:'Е mit Label/Etikett koppeln; es ist nicht Є.'},
    'Є':{brands:[],words:['є в наявності · auf Lager','є · es gibt / ist vorhanden','є товар · Artikel vorhanden'],tip:'Є bewusst über echte Shopphrasen lernen; keine falsche internationale Markeninitiale erfinden.'},
    'Ж':{brands:['Jean Paul Gaultier → Жан-Поль Готьє','Jacquemus → Жакмюс','Givenchy → Живанші'],words:['жакет · Jackett'],tip:'Hier zählt die ukrainische Schreibweise: mehrere bekannte Namen beginnen transliteriert mit Ж.'},
    'З':{brands:['Zadig & Voltaire → Задіг','Zara → Зара'],words:['застібка · Verschluss','знижка · Rabatt'],tip:'З über Verschluss/Rabatt und bekannte Z-Namen absichern.'},
    'И':{brands:[],words:['дизайн · Design','виріб · Produkt','стильний · stilvoll'],tip:'И steht oft im Wortinneren. Gerade deshalb mit mehreren Modewörtern statt falschen I-Marken lernen.'},
    'І':{brands:['Issey Miyake → Іссей Міяке','Isabel Marant → Ізабель Марант','Iris van Herpen → Іріс ван Герпен','Yves Saint Laurent → Ів Сен-Лоран'],words:['ім’я бренду · Markenname'],tip:'І ist das klare i. Internationale I-/Yves-Namen liefern mehrere starke Anker.'},
    'Ї':{brands:[],words:['Україна · Ukraine','український · ukrainisch','країна · Land'],tip:'Die zwei Punkte machen Ї einzigartig. Україна bleibt der stärkste natürliche Anker.'},
    'Й':{brands:['Yohji Yamamoto → Йоджі Ямамото','Y-3 → Й-3'],words:['його стиль · sein Stil'],tip:'Yohji und Y-3 passen persönlich besonders gut zu Й.'},
    'К':{brands:['Kenzo','Kiko Kostadinov','Kapital','Comme des Garçons → Ком де Гарсон'],words:['куртка · Jacke'],tip:'К hat viele brauchbare Fashion-Anker; куртка bleibt zusätzlich dein echtes Shopwort.'},
    'Л':{brands:['Loewe','Lemaire','Lanvin','Louis Vuitton'],words:['логотип · Logo'],tip:'Mehrere L-Labels plus логотип machen Л leichter wiedererkennbar.'},
    'М':{brands:['Maison Margiela','Mugler','Miu Miu','Moncler'],words:['матеріал · Material'],tip:'Margiela bleibt dein Hauptanker, aber drei weitere M-Labels verhindern reines Paar-Auswendiglernen.'},
    'Н':{brands:['Nike','New Balance','Nanushka','Nensi Dojaka'],words:['новий товар · neuer Artikel'],tip:'Н sieht H aus, ist aber N. Vier N-Marken zwingen die richtige Lesung.'},
    'О':{brands:['Ottolinger','Off-White','Oakley','Opening Ceremony'],words:['окуляри · Brille','одяг · Kleidung'],tip:'О ist mit Ottolinger plus zwei echten Modewörtern besonders leicht zu verankern.'},
    'П':{brands:['Prada','Palm Angels','Pleats Please','Proenza Schouler'],words:['піджак · Blazer','пальто · Mantel'],tip:'Prada ist der Hauptanker; weitere P-Labels und Kleidungsstücke stabilisieren П.'},
    'Р':{brands:['Raf Simons','Rick Owens','Rundholz','R13'],words:['розмір · Größe'],tip:'Р sieht P aus, ist R. Genau deshalb sind vier R-Marken hier besonders wirksam.'},
    'С':{brands:['Saint Laurent','Sacai','Supreme','Stone Island'],words:['спідниця · Rock','стан · Zustand'],tip:'С sieht C aus, ist S. Mehrere S-Marken machen die richtige Lautspur automatisch.'},
    'Т':{brands:['Tom Ford','Thom Browne','Telfar','Tod’s'],words:['топ · Top','товар · Artikel'],tip:'Т ist freundlich: Markeninitiale, Zeichen und Laut passen gut zusammen.'},
    'У':{brands:['UGG','Undercover','Uniqlo'],words:['унісекс · Unisex'],tip:'У sieht Y aus, klingt U. UGG/Undercover/Uniqlo sind dafür ideale Gegenanker.'},
    'Ф':{brands:['Fendi','Ferragamo','Fear of God','Fila'],words:['футболка · T-Shirt','фото · Foto'],tip:'Ф über mehrere F-Marken und футболка absichern.'},
    'Х':{brands:['Chloé → Хлое'],words:['худі · Hoodie','хороший стан · guter Zustand','хутро · Fell'],tip:'Х nicht wie X lesen. Хлое und худі koppeln die Form an den ch-Laut.'},
    'Ц':{brands:['Zimmermann → Ціммерман'],words:['ціна · Preis','це товар · das ist ein Artikel'],tip:'Ц bekommt einen transliterierten Fashion-Anker und das extrem nützliche Wort ціна.'},
    'Ч':{brands:['Champion → Чемпіон','Charles Jeffrey Loverboy → Чарльз Джеффрі'],words:['черевики · Boots','чорний · schwarz'],tip:'Ч lässt sich über ukrainisch geschriebene Ch-Namen plus черевики merken.'},
    'Ш':{brands:['Chanel → Шанель'],words:['штани · Hose','шкіра · Leder','шарф · Schal'],tip:'Шanель/Шанель plus drei echte Shopwörter geben dir mehrere unabhängige Anker.'},
    'Щ':{brands:[],words:['ще один товар · noch ein Artikel','ще · noch','що це? · was ist das?'],tip:'Щ ist Ш mit zusätzlichem Strich. Echte Wörter sind hier besser als eine erfundene Marke.'},
    'Ь':{brands:[],words:['пальто · Mantel','розмір · Größe','м’який · weich'],tip:'Ь hat keinen eigenen Laut. Modewörter zeigen dir, wo es die Aussprache des Nachbarn beeinflusst.'},
    'Ю':{brands:[],words:['люкс · Luxus','люксовий бренд · Luxusmarke','костюм · Anzug'],tip:'Ю wird über echte Modebegriffe im Wortinneren verankert.'},
    'Я':{brands:[],words:['ярлик · Tag/Etikett','я продаю · ich verkaufe','я купую · ich kaufe'],tip:'Я ist gleichzeitig ein Buchstabe und das Wort „ich“ – perfekt für spätere Shop-Sätze.'}
  };
  let quiz=null,audio=null;
  const esc=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const dayLetters=()=>{const d=Number(s.day);return d>=0&&d<=10?ORDER.slice(d*3,d*3+3):[]};
  const alphaItem=letter=>typeof alphabetItems==='function'?alphabetItems().find(x=>x.c?.[0]?.[0]===letter):null;
  const sound=letter=>alphaItem(letter)?.c?.[1]||((typeof LETTERS!=='undefined'&&Array.isArray(LETTERS))?LETTERS.find(x=>x[0]===letter)?.[1]:null)||letter;
  function ensure(){
    if(!s.designerAlphabet||typeof s.designerAlphabet!=='object')s.designerAlphabet={version:VERSION,days:{},errors:{},cueIndex:{}};
    s.designerAlphabet.version=VERSION;s.designerAlphabet.days=s.designerAlphabet.days||{};s.designerAlphabet.errors=s.designerAlphabet.errors||{};s.designerAlphabet.cueIndex=s.designerAlphabet.cueIndex||{};return s.designerAlphabet
  }
  function memories(letter){const x=A[letter];return [...(x.brands||[]),...(x.words||[])]}
  function cue(letter){const list=memories(letter),st=ensure(),idx=Number(st.cueIndex[letter])||0;return list[idx%list.length]||letter}
  function rotateCue(letter){const st=ensure();st.cueIndex[letter]=(Number(st.cueIndex[letter])||0)+1}
  function stopAudio(){if(audio){try{audio.pause()}catch{}audio=null}}
  function playLetter(letter,button){stopAudio();const src=window.UKRAINIAN_PRONUNCIATION_AUDIO?.[letter];if(src){const a=new Audio(src);audio=a;button.disabled=true;const done=()=>{if(audio===a)audio=null;button.disabled=false};a.onended=done;a.onerror=()=>{done();toast('Menschliche Buchstaben-Referenz gerade nicht erreichbar.')};a.play().catch(()=>{done();toast('Tippe erneut auf Anhören.')});return}if(typeof speak==='function')speak(letter,button)}
  function startQuiz(){const letters=dayLetters();if(!letters.length)return;quiz={phase:'anchor',letters:[...letters],idx:0,anchorCorrect:0,soundCorrect:0,wrong:[],cues:Object.fromEntries(letters.map(l=>[l,cue(l)]))};renderDesigner()}
  function markWrong(letter){const st=ensure();st.errors[letter]=(Number(st.errors[letter])||0)+1;quiz.wrong.push(letter)}
  function next(){
    quiz.idx++;
    if(quiz.idx<quiz.letters.length){renderDesigner();return}
    if(quiz.phase==='anchor'){quiz.phase='sound';quiz.idx=0;renderDesigner();return}
    const d=String(Number(s.day)),slot=ensure().days[d]||{best:0,passed:false};const total=quiz.anchorCorrect+quiz.soundCorrect;
    slot.best=Math.max(Number(slot.best)||0,total);slot.anchorBest=Math.max(Number(slot.anchorBest)||0,quiz.anchorCorrect);slot.soundBest=Math.max(Number(slot.soundBest)||0,quiz.soundCorrect);slot.passed=quiz.anchorCorrect===3&&quiz.soundCorrect===3;slot.date=date();slot.attempts=(Number(slot.attempts)||0)+1;ensure().days[d]=slot;quiz.letters.forEach(rotateCue);save();const passed=slot.passed;quiz=null;toast(passed?'6/6 – Zeichen und Laut sitzen. Beim nächsten Mal kommen andere Modeanker.':'Mini-Training beendet. Fehler und neue Anker kommen beim nächsten Versuch wieder.');renderDesigner()
  }
  function answerChoice(letter){if(!quiz)return;const target=quiz.letters[quiz.idx],good=letter===target;if(quiz.phase==='anchor'){if(good)quiz.anchorCorrect++;else markWrong(target)}else{if(good)quiz.soundCorrect++;else markWrong(target)}toast(good?(quiz.phase==='anchor'?'Zeichen erkannt.':'Laut richtig zugeordnet.'):'Noch nicht – richtig ist '+target+' = '+sound(target)+'.');save();setTimeout(next,330)}
  function chipList(items,cls=''){return items.length?'<div class="da-chips '+cls+'">'+items.map(x=>'<span>'+esc(x)+'</span>').join('')+'</div>':''}
  function card(letter){const x=A[letter],trap=FALSE_FRIENDS[letter];return '<article class="da-card'+(trap?' da-trap':'')+'"><div class="da-cardtop"><div class="da-letter" lang="uk">'+letter+' '+letter.toLocaleLowerCase('uk')+'</div><span class="da-kind">'+esc(trap?'Falscher Freund':x.brands.length?'Designer + Mode':'Modewort')+'</span></div><div class="da-sound">Laut: <strong>'+esc(sound(letter))+'</strong></div>'+(x.brands.length?'<div class="da-sub">Markenanker</div>'+chipList(x.brands,'da-brands'):'')+'<div class="da-sub">Mode-/Shopanker</div>'+chipList(x.words||[],'da-words')+(trap?'<div class="da-warning">⚠ '+esc(trap)+'</div>':'')+'<div class="da-tip">'+esc(x.tip)+'</div><button class="secondary da-audio" data-da-audio="'+letter+'">🔊 echten Buchstaben hören</button></article>'}
  function anchorQuizHtml(letters){const target=quiz.letters[quiz.idx],memory=quiz.cues[target],opts=[...letters].sort(()=>Math.random()-.5);return '<div class="da-quiz"><div class="label">Stufe 1 · Modeanker → Zeichen · '+(quiz.idx+1)+'/3</div><div class="da-question">Welcher ukrainische Buchstabe gehört heute zu <strong>'+esc(memory)+'</strong>?</div><div class="small">Die Anker wechseln bei Wiederholungen.</div><div class="da-answers">'+opts.map(l=>'<button class="answer" data-da-choice="'+l+'">'+l+' '+l.toLocaleLowerCase('uk')+'</button>').join('')+'</div></div>'}
  function soundQuizHtml(letters){const target=quiz.letters[quiz.idx],opts=[...letters].sort(()=>Math.random()-.5);return '<div class="da-quiz"><div class="label">Stufe 2 · Zeichen → Laut · '+(quiz.idx+1)+'/3</div><div class="da-big" lang="uk">'+target+' '+target.toLocaleLowerCase('uk')+'</div><div class="da-question">Wie liest du dieses Zeichen?</div><div class="da-answers">'+opts.map(l=>'<button class="answer da-sound-choice" data-da-choice="'+l+'">'+esc(sound(l))+'</button>').join('')+'</div><button class="ghost da-late-audio" data-da-audio="'+target+'">🔊 erst nach deiner Entscheidung anhören</button></div>'}
  function quizHtml(letters){return quiz.phase==='anchor'?anchorQuizHtml(letters):soundQuizHtml(letters)}
  function reviewHint(){const d=Number(s.day);if(d<=0)return '';const prior=ORDER.slice(0,d*3),errors=ensure().errors||{};const letter=[...prior].sort((a,b)=>(Number(errors[b])||0)-(Number(errors[a])||0))[0];if(!letter)return '';return '<div class="da-review"><strong>10-Sekunden-Rückblick:</strong> '+letter+' '+letter.toLocaleLowerCase('uk')+' = <strong>'+esc(sound(letter))+'</strong> · '+esc(cue(letter))+'</div>'}
  function renderDesigner(){
    const letters=dayLetters(),cards=document.getElementById('cards');let box=document.getElementById('designerAlphabetLesson');
    if(!cards||!letters.length){if(box)box.hidden=true;return}
    if(!box){box=document.createElement('section');box.id='designerAlphabetLesson';box.className='card';cards.insertAdjacentElement('afterend',box)}
    box.hidden=false;const st=ensure().days[String(Number(s.day))]||{};
    box.innerHTML='<div class="top"><div><div class="label">Disorder119 Fashion-Merktraining · Alphabettag '+(Number(s.day)+1)+'</div><h2>Deine 3 Buchstaben aus deinem Modeuniversum</h2></div><div class="pill">'+(st.passed?'✓ 6/6':'3–4 Min')+'</div></div><p class="small">Mehrere Marken und Modewörter bauen pro Zeichen ein ganzes Erinnerungsnetz. Im Quiz rotiert der Anker. Entscheidend bleibt danach immer der <strong>echte ukrainische Laut</strong>.</p>'+reviewHint()+'<div class="da-grid">'+letters.map(card).join('')+'</div>'+(quiz?quizHtml(letters):'<div class="actions"><button class="primary" id="daStart">'+(st.passed?'Mit neuen Ankern wiederholen':'6er-Fashion-Merktraining starten')+'</button></div>');
    box.querySelectorAll('[data-da-audio]').forEach(b=>b.onclick=()=>playLetter(b.dataset.daAudio,b));box.querySelectorAll('[data-da-choice]').forEach(b=>b.onclick=()=>answerChoice(b.dataset.daChoice));const start=document.getElementById('daStart');if(start)start.onclick=startQuiz;
  }
  const css=document.createElement('style');css.textContent='.da-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px;margin:15px 0}.da-card{border:1px solid #d5e4f5;border-radius:17px;background:#fff;padding:14px}.da-card.da-trap{border-width:2px}.da-cardtop{display:flex;align-items:flex-start;justify-content:space-between;gap:8px}.da-letter{font-size:2rem;font-weight:900;color:var(--d);line-height:1}.da-kind{font-size:.68rem;font-weight:850;border-radius:99px;background:#edf5ff;color:#315174;padding:4px 7px;text-align:right}.da-sound{font-size:.82rem;margin-top:8px;color:#405a78}.da-sub{font-size:.7rem;font-weight:900;text-transform:uppercase;letter-spacing:.04em;color:#66809d;margin-top:10px}.da-chips{display:flex;flex-wrap:wrap;gap:5px;margin-top:5px}.da-chips span{display:inline-block;border-radius:999px;padding:5px 8px;font-size:.75rem;background:#f4f7fb;color:#30465f}.da-brands span{font-weight:800;background:#edf4ff}.da-tip{font-size:.82rem;color:var(--m);margin:8px 0 11px}.da-warning{font-size:.8rem;font-weight:800;margin-top:8px;padding:7px 8px;border-radius:10px;background:#fff4d8;color:#745414}.da-audio{width:100%;padding:9px 10px}.da-review{margin:12px 0 3px;padding:9px 11px;border-radius:12px;background:#f1f7ff;color:#405a78;font-size:.84rem}.da-question{font-size:1.05rem;margin:13px 0}.da-big{text-align:center;font-size:3.4rem;font-weight:900;color:var(--d);margin:12px 0}.da-answers{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.da-answers .answer{text-align:center;font-size:1.2rem}.da-sound-choice{font-size:1rem!important}.da-late-audio{display:block;margin:10px auto 0;font-size:.8rem}@media(max-width:620px){.da-grid{grid-template-columns:1fr}.da-answers{grid-template-columns:repeat(3,1fr)}}';document.head.append(css);
  const brandCount=Object.values(A).reduce((n,x)=>n+x.brands.length,0),memoryCount=Object.values(A).reduce((n,x)=>n+memories(ORDER[n>=0?0:0]).length,0);
  window.UKRAINIAN_DESIGNER_ALPHABET={version:VERSION,days:11,anchors:Object.keys(A).length,brandAnchors:brandCount,memoryAnchors:Object.values(A).reduce((n,x)=>n+x.brands.length+x.words.length,0),personalized:true,alphabetGate:false,twoStage:true,soundRecall:true,rotatingCues:true,falseFriends:Object.keys(FALSE_FRIENDS),firstDay:['А','Б','В'],firstDayBrands:['Alexander McQueen','Ann Demeulemeester','Alaïa','Acne Studios','Balenciaga','Balmain','Bottega Veneta','Burberry','Vivienne Westwood','Valentino','Versace','Vetements'],get completedDays(){return Object.values(ensure().days).filter(x=>x?.passed).length}};
  const previousRender=render;render=function(){previousRender();renderDesigner()};ensure();renderDesigner();
})();