/* Ukrainischkurs für Joel · Laufzeit-Selbsttest v16 */
(() => {
  const problems=[];const ok=(cond,msg)=>{if(!cond)problems.push(msg)};
  try{
    const intro=alphabetItems();ok(intro.length===33,'Alphabet enthält nicht 33 Zeichen');
    const order=intro.map(x=>x.c?.[0]?.[0]).join(' ');ok(order==='А Б В Г Ґ Д Е Є Ж З И І Ї Й К Л М Н О П Р С Т У Ф Х Ц Ч Ш Щ Ь Ю Я','Alphabet-Reihenfolge stimmt nicht');
    const oldDay=s.day;s.day=0;ok(gameLetters().length===3,'Tag-1-Buchstaben-Jagd zeigt nicht exakt 3 Zeichen');s.day=oldDay;
    ok(window.UKRAINIAN_COURSE_LOADER?.version===27,'Loader ist nicht auf v27');ok(window.UKRAINIAN_COURSE_LOADER?.evalFree===true,'Loader meldet keinen eval-freien Modus');ok(window.UKRAINIAN_COURSE_LOADER?.mode==='classic-script','Loader nutzt nicht den klassischen Skriptmodus');
    ok(window.UKRAINIAN_PRONUNCIATION_AUDIO&&Object.keys(window.UKRAINIAN_PRONUNCIATION_AUDIO).length===33,'33 menschliche Alphabet-Audioquellen fehlen');
    ok(window.UKRAINIAN_HUMAN_SENTENCE_AUDIO?.version>=1,'Menschliches A1-Audio fehlt');ok(Number(window.UKRAINIAN_HUMAN_SENTENCE_AUDIO?.count)>=3,'Weniger als drei verifizierte A1-Human-Audios aktiv');
    ok(!!s.alphabetMastery,'Adaptive Alphabet-Mastery fehlt');ok(!!s.alphabetProof,'Alphabet-Proof fehlt');ok(!!s.readingBridge,'Lese-Brücke fehlt');ok(!!s.readingTransfer,'Lese-Transfer fehlt');
    ok(!!s.foundationExpansion,'Grundkurs-Erweiterung fehlt');ok(Number(s.foundationExpansion.version)>=2,'Grundkurs-Erweiterung ist nicht auf v2');ok(!!s.a1Expansion2,'A1-Erweiterung 2 fehlt');
    ok(!!s.a1GrammarBridge,'A1-Grammatik-Brücke fehlt');ok(Number(s.a1GrammarBridge.version)>=1,'A1-Grammatik-Brücke ist nicht auf v1');ok(Number.isFinite(Number(s.a1GrammarBridge.start)),'Start der A1-Grammatik-Brücke fehlt');
    ok(!!s.wordStress,'Wortbetonungs-Modul fehlt');ok(Number(s.wordStress.version)>=2,'Wortbetonung ist nicht auf v2');
    ok(!!s.openDialogue,'Offene Dialoge fehlen');ok(Number(s.openDialogue.version)>=1,'Offene Dialoge sind nicht auf v1');
    ok(!!s.comprehensionLab,'Verständnis-Labor fehlt');ok(Number(s.comprehensionLab.version)>=2,'Verständnis-Labor ist nicht auf v2');
    ok(!!s.activeProduction,'Aktive Produktion fehlt');ok(Number(s.activeProduction.version)>=2,'Aktive Produktion ist nicht auf v2');
    ok(!!s.grammarSpiral,'Grammatik-Spirale fehlt');ok(Number(s.grammarSpiral.version)>=3,'Grammatik-Spirale ist nicht auf v3');
    ok(!!s.storyLab,'Mini-Geschichten fehlen');ok(Number(s.storyLab.version)>=3,'Story Lab ist nicht auf v3');
    ok(!!s.dictation,'Hör-Diktat fehlt');ok(Number(s.dictation.version)>=3,'Hör-Diktat ist nicht auf v3');
    ok(!!s.a1CanDo,'A1-Can-do-Abschluss fehlt');ok(Number(s.a1CanDo.version)>=3,'Can-do ist nicht auf v3');
    ok(!!s.ukKeyboard,'Ukrainische Eingabehilfe fehlt');ok(Number(s.ukKeyboard.version)>=2,'Eingabehilfe ist nicht auf v2');
    ok(typeof scheduleMeta==='function'&&typeof dueCards==='function','Adaptives SRS fehlt');ok(D.length>=64,'Grundkurs enthält weniger als 64 geführte Tage');ok(WEEKLY_REVIEW_DAYS.includes(D.length-1),'Letzter Kurstag ist nicht als Review markiert');ok(document.getElementById('next'),'Weiter-Button fehlt');
  }catch(e){problems.push('Selbsttest-Ausnahme: '+e.message)}
  window.UKRAINIAN_COURSE_SELFTEST={ok:problems.length===0,problems,checkedAt:new Date().toISOString()};
  if(problems.length)console.error('Ukrainischkurs Selbsttest:',problems);else console.info('Ukrainischkurs Selbsttest: OK');
})();