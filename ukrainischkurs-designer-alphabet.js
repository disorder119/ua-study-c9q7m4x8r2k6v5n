/* Ukrainischkurs für Joel · Disorder119 Designer-Alphabet v1
   Persönliche Mode-/Shop-Merkanker für die ersten 11 Alphabettage.
   Die Anker helfen beim Erinnern, ersetzen aber niemals den echten ukrainischen Laut. */
(()=>{
  const VERSION=1;
  const ORDER='А Б В Г Ґ Д Е Є Ж З И І Ї Й К Л М Н О П Р С Т У Ф Х Ц Ч Ш Щ Ь Ю Я'.split(' ');
  const A={
    'А':{anchor:'Alexander McQueen · Ann Demeulemeester',de:'deine A-Marken',tip:'A → А. Der echte ukrainische Laut ist /a/.'},
    'Б':{anchor:'Balenciaga · Balmain',de:'deine B-Marken',tip:'B → Б. Der echte ukrainische Laut ist /b/.'},
    'В':{anchor:'Vivienne Westwood',de:'Designer-Merkanker',tip:'Wichtig: В sieht wie ein B aus, klingt aber ungefähr W/V.'},
    'Г':{anchor:'гаманець',de:'Portemonnaie / Wallet',tip:'Ein Artikelwort aus deinem Sortiment. Г hat den ukrainischen /ɦ/-Laut.'},
    'Ґ':{anchor:'ґудзик',de:'Knopf',tip:'Mode-Detail mit Ґ: ґудзик.'},
    'Д':{anchor:'Dior · Dsquared2',de:'Designer-Merkanker',tip:'D → Д. Erst Marke merken, dann den echten ukrainischen Laut festigen.'},
    'Е':{anchor:'етикетка',de:'Etikett / Label',tip:'Е wie етикетка – direkt am Kleidungsstück.'},
    'Є':{anchor:'є в наявності',de:'ist auf Lager',tip:'Shop-Satz: є в наявності = ist verfügbar.'},
    'Ж':{anchor:'Jean Paul Gaultier → Жан-Поль Готьє',de:'Designer-Merkanker',tip:'Jean beginnt auf Ukrainisch mit Ж: Жан.'},
    'З':{anchor:'застібка',de:'Verschluss',tip:'З wie застібка – Verschluss an Jacke, Hose oder Tasche.'},
    'И':{anchor:'дизайн',de:'Design',tip:'И steht hier mitten im Wort дизайн. Nicht jeder Merkhaken muss am Wortanfang stehen.'},
    'І':{anchor:'Yves Saint Laurent → Ів Сен-Лоран',de:'Designer-Merkanker',tip:'Yves wird hier Ів geschrieben: І = klares /i/.'},
    'Ї':{anchor:'Україна',de:'Ukraine',tip:'Ї steckt auffällig in Україна – mit eigenem j+i-artigem Klang.'},
    'Й':{anchor:'Yohji Yamamoto → Йоджі Ямамото',de:'Designer-Merkanker',tip:'Yohji liefert dir den Merkhaken für Й.'},
    'К':{anchor:'куртка',de:'Jacke',tip:'К wie куртка – Jacke.'},
    'Л':{anchor:'логотип',de:'Logo',tip:'Л wie логотип – Logo.'},
    'М':{anchor:'Margiela → Маржела',de:'Designer-Merkanker',tip:'M → М. Margiela ist dein persönlicher M-Anker.'},
    'Н':{anchor:'новий товар',de:'neuer Artikel',tip:'Н wie новий – neu.'},
    'О':{anchor:'Ottolinger · окуляри',de:'Designer · Brille',tip:'О funktioniert doppelt: Ottolinger und окуляри = Brille.'},
    'П':{anchor:'Prada · піджак',de:'Designer · Blazer',tip:'П wie Prada – und піджак = Blazer.'},
    'Р':{anchor:'Raf Simons · Rundholz · розмір',de:'Designer · Größe',tip:'Р sieht wie P aus, klingt aber R. Deine R-Marken machen genau das merkbar.'},
    'С':{anchor:'Saint Laurent · спідниця',de:'Designer · Rock',tip:'С sieht wie C aus, klingt aber S. Saint Laurent passt deshalb perfekt.'},
    'Т':{anchor:'топ',de:'Top',tip:'Т wie топ – fast geschenkt.'},
    'У':{anchor:'унісекс',de:'Unisex',tip:'У wie унісекс. Der Buchstabe klingt /u/.'},
    'Ф':{anchor:'футболка',de:'T-Shirt',tip:'Ф wie футболка – T-Shirt.'},
    'Х':{anchor:'худі',de:'Hoodie',tip:'Х wie худі. Der Laut ist rauer als deutsches H.'},
    'Ц':{anchor:'ціна',de:'Preis',tip:'Ц wie ціна – Preis.'},
    'Ч':{anchor:'черевики',de:'Schuhe / Boots',tip:'Ч wie черевики – Schuhe oder Boots.'},
    'Ш':{anchor:'штани · шкіра',de:'Hose · Leder',tip:'Ш liefert dir gleich zwei Shop-Wörter: штани und шкіра.'},
    'Щ':{anchor:'ще один товар',de:'noch ein Artikel',tip:'Щ wie ще – noch / noch einmal.'},
    'Ь':{anchor:'пальто',de:'Mantel',tip:'Ь hat keinen eigenen Laut. In пальто macht das Weichheitszeichen den vorherigen Konsonanten weich.'},
    'Ю':{anchor:'люкс',de:'Luxus',tip:'Ю steckt in люкс – Luxus.'},
    'Я':{anchor:'ярлик',de:'Etikett / Tag',tip:'Я wie ярлик – das Etikett am Artikel.'}
  };
  let quiz=null,audio=null;
  const esc=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const dayLetters=()=>{const d=Number(s.day);return d>=0&&d<=10?ORDER.slice(d*3,d*3+3):[]};
  function ensure(){if(!s.designerAlphabet||typeof s.designerAlphabet!=='object')s.designerAlphabet={version:VERSION,days:{}};s.designerAlphabet.version=VERSION;s.designerAlphabet.days=s.designerAlphabet.days||{};return s.designerAlphabet}
  function stopAudio(){if(audio){try{audio.pause()}catch{}audio=null}}
  function playLetter(letter,button){stopAudio();const src=window.UKRAINIAN_PRONUNCIATION_AUDIO?.[letter];if(src){const a=new Audio(src);audio=a;button.disabled=true;const done=()=>{if(audio===a)audio=null;button.disabled=false};a.onended=done;a.onerror=()=>{done();toast('Menschliche Buchstaben-Referenz gerade nicht erreichbar.')};a.play().catch(()=>{done();toast('Tippe erneut auf Anhören.')});return}if(typeof speak==='function')speak(letter,button)}
  function startQuiz(){const letters=dayLetters();if(!letters.length)return;quiz={letters:[...letters],idx:0,correct:0};renderDesigner()}
  function answer(letter){if(!quiz)return;const target=quiz.letters[quiz.idx],good=letter===target;if(good)quiz.correct++;toast(good?'Merkanker sitzt.':'Noch nicht – der Anker gehört zu '+target+'.');quiz.idx++;if(quiz.idx>=quiz.letters.length){const d=String(Number(s.day)),slot=ensure().days[d]||{best:0,passed:false};slot.best=Math.max(Number(slot.best)||0,quiz.correct);slot.passed=quiz.correct===quiz.letters.length;slot.date=date();ensure().days[d]=slot;save();quiz=null;toast(slot.passed?'3/3 – Designer-Merkanker für heute sitzen.':'Merkcheck beendet. Du kannst ihn direkt noch einmal machen.')}renderDesigner()}
  function card(letter){const x=A[letter];return '<article class="da-card"><div class="da-letter" lang="uk">'+letter+' '+letter.toLocaleLowerCase('uk')+'</div><div class="da-anchor">'+esc(x.anchor)+'</div><div class="small">'+esc(x.de)+'</div><div class="da-tip">'+esc(x.tip)+'</div><button class="secondary da-audio" data-da-audio="'+letter+'">🔊 Buchstabe hören</button></article>'}
  function quizHtml(letters){const target=quiz.letters[quiz.idx],x=A[target],opts=[...letters].sort(()=>Math.random()-.5);return '<div class="da-quiz"><div class="label">3er-Merkcheck · '+(quiz.idx+1)+'/3</div><div class="da-question">Welcher ukrainische Buchstabe gehört zu deinem Merkhaken <strong>'+esc(x.anchor)+'</strong>?</div><div class="da-answers">'+opts.map(l=>'<button class="answer" data-da-choice="'+l+'">'+l+' '+l.toLocaleLowerCase('uk')+'</button>').join('')+'</div></div>'}
  function renderDesigner(){
    const letters=dayLetters(),cards=document.getElementById('cards');let box=document.getElementById('designerAlphabetLesson');
    if(!cards||!letters.length){if(box)box.hidden=true;return}
    if(!box){box=document.createElement('section');box.id='designerAlphabetLesson';box.className='card';cards.insertAdjacentElement('afterend',box)}
    box.hidden=false;const st=ensure().days[String(Number(s.day))]||{};
    box.innerHTML='<div class="top"><div><div class="label">Disorder119-Merkanker · Alphabettag '+(Number(s.day)+1)+'</div><h2>Dein Designer-Alphabet</h2></div><div class="pill">'+(st.passed?'✓ 3/3':'2 Min')+'</div></div><p class="small">Die Marken und Artikel sind nur <strong>Eselsbrücken für das Zeichen</strong>. Für die Aussprache zählt immer der ukrainische Buchstabenlaut über 🔊.</p><div class="da-grid">'+letters.map(card).join('')+'</div>'+(quiz?quizHtml(letters):'<div class="actions"><button class="primary" id="daStart">'+(st.passed?'Merkcheck wiederholen':'3er-Merkcheck starten')+'</button></div>');
    box.querySelectorAll('[data-da-audio]').forEach(b=>b.onclick=()=>playLetter(b.dataset.daAudio,b));box.querySelectorAll('[data-da-choice]').forEach(b=>b.onclick=()=>answer(b.dataset.daChoice));const start=document.getElementById('daStart');if(start)start.onclick=startQuiz;
  }
  const css=document.createElement('style');css.textContent='.da-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:9px;margin:15px 0}.da-card{border:1px solid #d5e4f5;border-radius:17px;background:#fff;padding:14px}.da-letter{font-size:2rem;font-weight:900;color:var(--d);line-height:1}.da-anchor{font-weight:850;margin-top:9px;color:var(--i)}.da-tip{font-size:.82rem;color:var(--m);margin:8px 0 11px}.da-audio{width:100%;padding:9px 10px}.da-question{font-size:1.05rem;margin:13px 0}.da-answers{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.da-answers .answer{text-align:center;font-size:1.3rem}@media(max-width:620px){.da-grid{grid-template-columns:1fr}.da-answers{grid-template-columns:repeat(3,1fr)}}';document.head.append(css);
  window.UKRAINIAN_DESIGNER_ALPHABET={version:VERSION,days:11,anchors:Object.keys(A).length,personalized:true,alphabetGate:false,firstDay:['А','Б','В'],firstDayBrands:['Alexander McQueen','Balenciaga','Vivienne Westwood'],get completedDays(){return Object.values(ensure().days).filter(x=>x?.passed).length}};
  const previousRender=render;render=function(){previousRender();renderDesigner()};ensure();renderDesigner();
})();