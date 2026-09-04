/* Ukrainischkurs für Joel · Laufzeit-Selbsttest v6 */
(() => {
  const problems=[];const ok=(cond,msg)=>{if(!cond)problems.push(msg)};
  try{
    const intro=alphabetItems();ok(intro.length===33,'Alphabet enthält nicht 33 Zeichen');
    const order=intro.map(x=>x.c?.[0]?.[0]).join(' ');ok(order==='А Б В Г Ґ Д Е Є Ж З И І Ї Й К Л М Н О П Р С Т У Ф Х Ц Ч Ш Щ Ь Ю Я','Alphabet-Reihenfolge stimmt nicht');
    const oldDay=s.day;s.day=0;ok(gameLetters().length===3,'Tag-1-Buchstaben-Jagd zeigt nicht exakt 3 Zeichen');s.day=oldDay;
    ok(window.UKRAINIAN_PRONUNCIATION_AUDIO&&Object.keys(window.UKRAINIAN_PRONUNCIATION_AUDIO).length===33,'33 menschliche Audioquellen fehlen');
    ok(!!s.alphabetMastery,'Adaptive Alphabet-Mastery fehlt');ok(!!s.alphabetProof,'Alphabet-Proof fehlt');ok(!!s.readingBridge,'Lese-Brücke fehlt');
    ok(!!s.readingTransfer,'Lese-Transfer fehlt');ok(!!s.foundationExpansion,'Grundkurs-Erweiterung fehlt');ok(!!s.a1CanDo,'A1-Can-do-Abschluss fehlt');
    ok(typeof scheduleMeta==='function'&&typeof dueCards==='function','Adaptives SRS fehlt');
    ok(D.length>=47,'Grundkurs enthält weniger als 47 geführte Tage');
    ok(document.getElementById('next'),'Weiter-Button fehlt');
  }catch(e){problems.push('Selbsttest-Ausnahme: '+e.message)}
  window.UKRAINIAN_COURSE_SELFTEST={ok:problems.length===0,problems,checkedAt:new Date().toISOString()};
  if(problems.length)console.error('Ukrainischkurs Selbsttest:',problems);else console.info('Ukrainischkurs Selbsttest: OK');
})();
