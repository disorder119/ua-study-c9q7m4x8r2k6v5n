/* Ukrainischkurs für Joel · Laufzeit-Selbsttest v3 */
(() => {
  function run(){
    const errors=[],warnings=[];
    const assert=(ok,msg)=>{if(!ok)errors.push(msg)};
    const warn=(ok,msg)=>{if(!ok)warnings.push(msg)};
    try{
      const order='А Б В Г Ґ Д Е Є Ж З И І Ї Й К Л М Н О П Р С Т У Ф Х Ц Ч Ш Щ Ь Ю Я'.split(' ');
      assert(order.length===33&&new Set(order).size===33,'Alphabet muss 33 eindeutige Zeichen enthalten.');
      assert(Array.isArray(D)&&D.length>=14,'Kursdaten fehlen oder sind zu kurz.');
      const intro=D.slice(0,11).flatMap(d=>d?.[3]||[]).map(c=>c?.[0]?.[0]);
      assert(intro.length===33,'Tage 1–11 müssen zusammen genau 33 Buchstaben enthalten.');
      assert(intro.join('')===order.join(''),'Alphabet-Reihenfolge der Einführungstage stimmt nicht.');
      assert(D.slice(0,11).every(d=>(d?.[3]?.length||0)<=3),'Ein Einführungstag enthält mehr als drei neue Zeichen.');
      assert(Array.isArray(LETTERS)&&LETTERS.length===33,'LETTERS muss 33 Einträge enthalten.');
      assert(LETTERS.map(x=>x[0]).join('')===order.join(''),'LETTERS-Reihenfolge stimmt nicht mit dem ukrainischen Alphabet überein.');
      assert(Number.isInteger(s.day)&&s.day>=0&&s.day<D.length,'Aktueller Kurstag liegt außerhalb der Kursdaten.');
      assert(typeof gameLetters==='function','Buchstaben-Jagd fehlt.');
      if(s.day===0)assert(gameLetters().length===3,'Tag 1 der Buchstaben-Jagd darf nur drei bekannte Zeichen enthalten.');
      assert(typeof streak==='function'&&Number.isFinite(streak())&&streak()>=0,'Streak liefert keinen gültigen Wert.');
      assert(typeof alphabetReady==='function','Alphabet-Freigabelogik fehlt.');
      assert(s.alphabetMastery&&typeof s.alphabetMastery==='object','Adaptive Alphabet-Mastery wurde nicht initialisiert.');
      assert(s.alphabetMastery?.visual&&s.alphabetMastery?.audio&&s.alphabetMastery?.contrast,'Mehrmodale Alphabet-Nachweise fehlen.');
      assert(s.readingBridge&&typeof s.readingBridge==='object','Lese-Brücke wurde nicht initialisiert.');
      assert(s.readingBridge?.stress&&s.readingBridge?.soft,'Betonungs- oder Weichheitsmodul fehlt.');
      assert(document.getElementById('markSpoken'),'Aussprache-Abschlussbutton fehlt.');
      assert(document.getElementById('cards'),'Lernkarten-Container fehlt.');
      assert(document.getElementById('daily'),'Tagesplan-Container fehlt.');
      const audio=window.UKRAINIAN_PRONUNCIATION_AUDIO||{},meta=window.UKRAINIAN_PRONUNCIATION_META||{};
      assert(Object.keys(audio).length===33,'Es müssen 33 menschliche Audio-Referenzen aktiv sein.');
      assert(Object.keys(meta).length===33,'Metadaten für alle 33 Audio-Referenzen fehlen.');
      order.forEach(k=>{assert(!!audio[k],'Menschliche Audio-Referenz für '+k+' fehlt.');assert(/^https:\/\//.test(audio[k]||''),'Audio-URL für '+k+' ist nicht HTTPS.');assert(!!meta[k]?.source,'Quellenangabe für '+k+' fehlt.')});
      const keys=all().map(x=>x.k);assert(keys.length===new Set(keys).size,'Doppelte Lernobjekt-IDs gefunden.');
      warn(!document.body.textContent.includes('persönlicher 30-Tage-Kurs'),'Veralteter sichtbarer 30-Tage-Text vorhanden.');
      warn(!document.body.textContent.includes('nach 14 Tagen garantiert'),'Unzulässiges 14-Tage-Erfolgsversprechen sichtbar.');
    }catch(e){errors.push('Selbsttest abgebrochen: '+(e?.message||e))}
    window.UKRAINIAN_COURSE_SELFTEST={time:new Date().toISOString(),errors,warnings,ok:errors.length===0};
    if(errors.length)console.error('Ukrainischkurs Selbsttest:',errors,warnings);else console.info('Ukrainischkurs Selbsttest OK',warnings);
    if(errors.length){const toast=document.getElementById('toast');if(toast){toast.textContent='Interner Kurscheck hat '+errors.length+' Problem'+(errors.length===1?'':'e')+' gefunden.';toast.classList.add('show')}}
  }
  setTimeout(run,0);
})();
