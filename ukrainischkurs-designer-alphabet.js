/* Ukrainischkurs für Joel · Disorder119 Designer-Alphabet v2
   Persönliche Mode-/Shop-Merkanker für die ersten 11 Alphabettage.
   Erst Zeichen erinnern, dann den echten ukrainischen Laut aktiv abrufen.
   Die Merkhilfe bleibt bewusst außerhalb des eigentlichen Alphabet-Mastery-Gates. */
(()=>{
  const VERSION=2;
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
    'А':{anchor:'Alexander McQueen · Ann Demeulemeester',de:'deine A-Marken',kind:'Designer',tip:'A → А. Bekannte Namen geben dir die Form; der Laut bleibt ukrainisch /a/.'},
    'Б':{anchor:'Balenciaga · Balmain',de:'deine B-Marken',kind:'Designer',tip:'B → Б. Stell dir ein Balenciaga- oder Balmain-Label direkt neben Б vor.'},
    'В':{anchor:'Vivienne Westwood · взуття',de:'Designer · Schuhe',kind:'Designer + Shop',tip:'Vivienne/взуття geben dir V/W als Gegengewicht zur irreführenden B-Form.'},
    'Г':{anchor:'гаманець',de:'Portemonnaie / Wallet',kind:'Shopwort',tip:'Г wie гаманець – ein echtes Artikelwort aus deinem Shop-Kontext.'},
    'Ґ':{anchor:'ґудзик',de:'Knopf',kind:'Shopwort',tip:'Der kleine Zusatzstrich unterscheidet Ґ von Г. Ґудзик = Knopf.'},
    'Д':{anchor:'Dior · Dsquared2',de:'Designer-Merkanker',kind:'Designer',tip:'D → Д. Die ungewöhnliche Form wird an zwei sehr bekannte D-Marken gehängt.'},
    'Е':{anchor:'етикетка',de:'Etikett / Label',kind:'Shopwort',tip:'Е wie етикетка – direkt am Kleidungsstück.'},
    'Є':{anchor:'є в наявності',de:'ist auf Lager',kind:'Shopphrase',tip:'Є ist nicht Е: der zusätzliche Mittelstrich gehört zur eigenen je-artigen Variante.'},
    'Ж':{anchor:'Jean Paul Gaultier → Жан-Поль Готьє',de:'Designer-Merkanker',kind:'Designer',tip:'Жан beginnt mit Ж. Die auffällige Form passt zu einem auffälligen Gaultier-Anker.'},
    'З':{anchor:'застібка',de:'Verschluss',kind:'Shopwort',tip:'З wie застібка – Verschluss an Jacke, Hose oder Tasche.'},
    'И':{anchor:'дизайн',de:'Design',kind:'Shopwort',tip:'И steckt in дизайн. Merke zusätzlich: И ist nicht das klare І.'},
    'І':{anchor:'Yves Saint Laurent → Ів Сен-Лоран',de:'Designer-Merkanker',kind:'Designer',tip:'Ів liefert dir das klare І. Optisch fast wie lateinisches I.'},
    'Ї':{anchor:'Україна',de:'Ukraine',kind:'Alltagswort',tip:'Ї fällt durch die zwei Punkte auf. Україна macht dieses Zeichen extrem wiedererkennbar.'},
    'Й':{anchor:'Yohji Yamamoto → Йоджі Ямамото',de:'Designer-Merkanker',kind:'Designer',tip:'Yohji/Йоджі ist dein persönlicher Й-Anker. Das Breve oben gehört immer dazu.'},
    'К':{anchor:'куртка',de:'Jacke',kind:'Shopwort',tip:'К wie куртка – Jacke. Form und Laut sind für deutsche Augen relativ freundlich.'},
    'Л':{anchor:'логотип',de:'Logo',kind:'Shopwort',tip:'Л wie логотип – Logo. Die Form bewusst als eigenes Zeichen abspeichern.'},
    'М':{anchor:'Margiela → Маржела',de:'Designer-Merkanker',kind:'Designer',tip:'M → М. Margiela ist dein persönlicher M-Anker.'},
    'Н':{anchor:'новий товар',de:'neuer Artikel',kind:'Shopphrase',tip:'Н wie новий – neu. Gerade hier die H-Optik aktiv ignorieren.'},
    'О':{anchor:'Ottolinger · окуляри',de:'Designer · Brille',kind:'Designer + Shop',tip:'О funktioniert doppelt: Ottolinger und окуляри = Brille.'},
    'П':{anchor:'Prada · піджак',de:'Designer · Blazer',kind:'Designer + Shop',tip:'П wie Prada und піджак = Blazer. Die Tor-Form gehört zu P.'},
    'Р':{anchor:'Raf Simons · Rundholz · розмір',de:'Designer · Größe',kind:'Designer + Shop',tip:'Raf/Rundholz zwingen dein Gehirn zur richtigen Lesung: Р = R, niemals P.'},
    'С':{anchor:'Saint Laurent · спідниця',de:'Designer · Rock',kind:'Designer + Shop',tip:'Saint Laurent macht die Falle nützlich: С sieht C aus, spricht sich S.'},
    'Т':{anchor:'топ',de:'Top',kind:'Shopwort',tip:'Т wie топ – nahezu geschenkter Mode-Anker.'},
    'У':{anchor:'унісекс',de:'Unisex',kind:'Shopwort',tip:'У wie унісекс. Die Y-Form darf dich nicht täuschen: Laut = U.'},
    'Ф':{anchor:'футболка',de:'T-Shirt',kind:'Shopwort',tip:'Ф wie футболка – T-Shirt. Die runde Mitte ist ein guter visueller Haken.'},
    'Х':{anchor:'худі',de:'Hoodie',kind:'Shopwort',tip:'Х wie худі. X-Form, aber kein deutsches X: ukrainischer ch-Laut.'},
    'Ц':{anchor:'ціна',de:'Preis',kind:'Shopwort',tip:'Ц wie ціна – Preis. Ein sehr nützliches Wort für Kaufen und Verkaufen.'},
    'Ч':{anchor:'черевики',de:'Schuhe / Boots',kind:'Shopwort',tip:'Ч wie черевики – Schuhe oder Boots.'},
    'Ш':{anchor:'штани · шкіра',de:'Hose · Leder',kind:'Shopwort',tip:'Ш liefert dir gleich zwei starke Shop-Wörter: штани und шкіра.'},
    'Щ':{anchor:'ще один товар',de:'noch ein Artikel',kind:'Shopphrase',tip:'Щ ist Ш mit zusätzlichem Abstrich. Ще = noch.'},
    'Ь':{anchor:'пальто',de:'Mantel',kind:'Shopwort',tip:'Ь hat keinen eigenen Laut. In пальто verändert es den vorherigen Konsonanten.'},
    'Ю':{anchor:'люкс',de:'Luxus',kind:'Shopwort',tip:'Ю steckt in люкс – Luxus. Den Kreis rechts als visuelles Merkmal nutzen.'},
    'Я':{anchor:'ярлик',de:'Etikett / Tag',kind:'Shopwort',tip:'Я wie ярлик – Tag/Etikett am Artikel.'}
  };
  let quiz=null,audio=null;
  const esc=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const dayLetters=()=>{const d=Number(s.day);return d>=0&&d<=10?ORDER.slice(d*3,d*3+3):[]};
  const alphaItem=letter=>typeof alphabetItems==='function'?alphabetItems().find(x=>x.c?.[0]?.[0]===letter):null;
  const sound=letter=>alphaItem(letter)?.c?.[1]||((typeof LETTERS!=='undefined'&&Array.isArray(LETTERS))?LETTERS.find(x=>x[0]===letter)?.[1]:null)||letter;
  function ensure(){
    if(!s.designerAlphabet||typeof s.designerAlphabet!=='object')s.designerAlphabet={version:VERSION,days:{},errors:{}};
    s.designerAlphabet.version=VERSION;s.designerAlphabet.days=s.designerAlphabet.days||{};s.designerAlphabet.errors=s.designerAlphabet.errors||{};return s.designerAlphabet
  }
  function stopAudio(){if(audio){try{audio.pause()}catch{}audio=null}}
  function playLetter(letter,button){stopAudio();const src=window.UKRAINIAN_PRONUNCIATION_AUDIO?.[letter];if(src){const a=new Audio(src);audio=a;button.disabled=true;const done=()=>{if(audio===a)audio=null;button.disabled=false};a.onended=done;a.onerror=()=>{done();toast('Menschliche Buchstaben-Referenz gerade nicht erreichbar.')};a.play().catch(()=>{done();toast('Tippe erneut auf Anhören.')});return}if(typeof speak==='function')speak(letter,button)}
  function startQuiz(){const letters=dayLetters();if(!letters.length)return;quiz={phase:'anchor',letters:[...letters],idx:0,anchorCorrect:0,soundCorrect:0,wrong:[]};renderDesigner()}
  function markWrong(letter){const st=ensure();st.errors[letter]=(Number(st.errors[letter])||0)+1;quiz.wrong.push(letter)}
  function next(){
    quiz.idx++;
    if(quiz.idx<quiz.letters.length){renderDesigner();return}
    if(quiz.phase==='anchor'){quiz.phase='sound';quiz.idx=0;renderDesigner();return}
    const d=String(Number(s.day)),slot=ensure().days[d]||{best:0,passed:false};const total=quiz.anchorCorrect+quiz.soundCorrect;
    slot.best=Math.max(Number(slot.best)||0,total);slot.anchorBest=Math.max(Number(slot.anchorBest)||0,quiz.anchorCorrect);slot.soundBest=Math.max(Number(slot.soundBest)||0,quiz.soundCorrect);slot.passed=quiz.anchorCorrect===3&&quiz.soundCorrect===3;slot.date=date();slot.attempts=(Number(slot.attempts)||0)+1;ensure().days[d]=slot;save();const passed=slot.passed;quiz=null;toast(passed?'6/6 – Zeichen und Laut sitzen zusammen.':'Mini-Training beendet. Fehler werden beim nächsten Versuch wieder abgefragt.');renderDesigner()
  }
  function answerChoice(letter){if(!quiz)return;const target=quiz.letters[quiz.idx],good=letter===target;if(quiz.phase==='anchor'){if(good)quiz.anchorCorrect++;else markWrong(target)}else{if(good)quiz.soundCorrect++;else markWrong(target)}toast(good?(quiz.phase==='anchor'?'Zeichen erkannt.':'Laut richtig zugeordnet.'):'Noch nicht – richtig ist '+target+' = '+sound(target)+'.');save();setTimeout(next,330)}
  function card(letter){const x=A[letter],trap=FALSE_FRIENDS[letter];return '<article class="da-card'+(trap?' da-trap':'')+'"><div class="da-cardtop"><div class="da-letter" lang="uk">'+letter+' '+letter.toLocaleLowerCase('uk')+'</div><span class="da-kind">'+esc(trap?'Falscher Freund':x.kind)+'</span></div><div class="da-sound">Laut: <strong>'+esc(sound(letter))+'</strong></div><div class="da-anchor">'+esc(x.anchor)+'</div><div class="small">'+esc(x.de)+'</div>'+(trap?'<div class="da-warning">⚠ '+esc(trap)+'</div>':'')+'<div class="da-tip">'+esc(x.tip)+'</div><button class="secondary da-audio" data-da-audio="'+letter+'">🔊 echten Buchstaben hören</button></article>'}
  function anchorQuizHtml(letters){const target=quiz.letters[quiz.idx],x=A[target],opts=[...letters].sort(()=>Math.random()-.5);return '<div class="da-quiz"><div class="label">Stufe 1 · Merkhaken → Zeichen · '+(quiz.idx+1)+'/3</div><div class="da-question">Welcher ukrainische Buchstabe gehört zu <strong>'+esc(x.anchor)+'</strong>?</div><div class="da-answers">'+opts.map(l=>'<button class="answer" data-da-choice="'+l+'">'+l+' '+l.toLocaleLowerCase('uk')+'</button>').join('')+'</div></div>'}
  function soundQuizHtml(letters){const target=quiz.letters[quiz.idx],opts=[...letters].sort(()=>Math.random()-.5);return '<div class="da-quiz"><div class="label">Stufe 2 · Zeichen → Laut · '+(quiz.idx+1)+'/3</div><div class="da-big" lang="uk">'+target+' '+target.toLocaleLowerCase('uk')+'</div><div class="da-question">Wie liest du dieses Zeichen?</div><div class="da-answers">'+opts.map(l=>'<button class="answer da-sound-choice" data-da-choice="'+l+'">'+esc(sound(l))+'</button>').join('')+'</div><button class="ghost da-late-audio" data-da-audio="'+target+'">🔊 erst nach deiner Entscheidung anhören</button></div>'}
  function quizHtml(letters){return quiz.phase==='anchor'?anchorQuizHtml(letters):soundQuizHtml(letters)}
  function reviewHint(){const d=Number(s.day);if(d<=0)return '';const prior=ORDER.slice(0,d*3),errors=ensure().errors||{};const letter=[...prior].sort((a,b)=>(Number(errors[b])||0)-(Number(errors[a])||0))[0];if(!letter)return '';return '<div class="da-review"><strong>10-Sekunden-Rückblick:</strong> '+letter+' '+letter.toLocaleLowerCase('uk')+' = <strong>'+esc(sound(letter))+'</strong> · '+esc(A[letter].anchor)+'</div>'}
  function renderDesigner(){
    const letters=dayLetters(),cards=document.getElementById('cards');let box=document.getElementById('designerAlphabetLesson');
    if(!cards||!letters.length){if(box)box.hidden=true;return}
    if(!box){box=document.createElement('section');box.id='designerAlphabetLesson';box.className='card';cards.insertAdjacentElement('afterend',box)}
    box.hidden=false;const st=ensure().days[String(Number(s.day))]||{};
    box.innerHTML='<div class="top"><div><div class="label">Disorder119-Merktraining · Alphabettag '+(Number(s.day)+1)+'</div><h2>Deine 3 Buchstaben aus Mode & Shop</h2></div><div class="pill">'+(st.passed?'✓ 6/6':'3 Min')+'</div></div><p class="small">1. Bekanntes Bild im Kopf verankern. 2. Zeichen ohne Hilfe erkennen. 3. Den <strong>echten ukrainischen Laut</strong> abrufen. Marken ersetzen niemals die Aussprache.</p>'+reviewHint()+'<div class="da-grid">'+letters.map(card).join('')+'</div>'+(quiz?quizHtml(letters):'<div class="actions"><button class="primary" id="daStart">'+(st.passed?'6er-Merktraining wiederholen':'6er-Merktraining starten')+'</button></div>');
    box.querySelectorAll('[data-da-audio]').forEach(b=>b.onclick=()=>playLetter(b.dataset.daAudio,b));box.querySelectorAll('[data-da-choice]').forEach(b=>b.onclick=()=>answerChoice(b.dataset.daChoice));const start=document.getElementById('daStart');if(start)start.onclick=startQuiz;
  }
  const css=document.createElement('style');css.textContent='.da-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px;margin:15px 0}.da-card{border:1px solid #d5e4f5;border-radius:17px;background:#fff;padding:14px}.da-card.da-trap{border-width:2px}.da-cardtop{display:flex;align-items:flex-start;justify-content:space-between;gap:8px}.da-letter{font-size:2rem;font-weight:900;color:var(--d);line-height:1}.da-kind{font-size:.68rem;font-weight:850;border-radius:99px;background:#edf5ff;color:#315174;padding:4px 7px;text-align:right}.da-sound{font-size:.82rem;margin-top:8px;color:#405a78}.da-anchor{font-weight:850;margin-top:7px;color:var(--i)}.da-tip{font-size:.82rem;color:var(--m);margin:8px 0 11px}.da-warning{font-size:.8rem;font-weight:800;margin-top:8px;padding:7px 8px;border-radius:10px;background:#fff4d8;color:#745414}.da-audio{width:100%;padding:9px 10px}.da-review{margin:12px 0 3px;padding:9px 11px;border-radius:12px;background:#f1f7ff;color:#405a78;font-size:.84rem}.da-question{font-size:1.05rem;margin:13px 0}.da-big{text-align:center;font-size:3.4rem;font-weight:900;color:var(--d);margin:12px 0}.da-answers{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.da-answers .answer{text-align:center;font-size:1.2rem}.da-sound-choice{font-size:1rem!important}.da-late-audio{display:block;margin:10px auto 0;font-size:.8rem}@media(max-width:620px){.da-grid{grid-template-columns:1fr}.da-answers{grid-template-columns:repeat(3,1fr)}}';document.head.append(css);
  window.UKRAINIAN_DESIGNER_ALPHABET={version:VERSION,days:11,anchors:Object.keys(A).length,personalized:true,alphabetGate:false,twoStage:true,soundRecall:true,falseFriends:Object.keys(FALSE_FRIENDS),firstDay:['А','Б','В'],firstDayBrands:['Alexander McQueen','Balenciaga','Vivienne Westwood'],get completedDays(){return Object.values(ensure().days).filter(x=>x?.passed).length}};
  const previousRender=render;render=function(){previousRender();renderDesigner()};ensure();renderDesigner();
})();