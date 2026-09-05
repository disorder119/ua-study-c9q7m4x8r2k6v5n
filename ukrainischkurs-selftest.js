/* Ukrainischkurs für Joel · Laufzeit-Selbsttest v25 */
(() => {
  const problems=[];const ok=(cond,msg)=>{if(!cond)problems.push(msg)};
  try{
    const intro=alphabetItems();ok(intro.length===33,'Alphabet enthält nicht 33 Zeichen');
    const order=intro.map(x=>x.c?.[0]?.[0]).join(' ');ok(order==='А Б В Г Ґ Д Е Є Ж З И І Ї Й К Л М Н О П Р С Т У Ф Х Ц Ч Ш Щ Ь Ю Я','Alphabet-Reihenfolge stimmt nicht');
    const oldDay=s.day;s.day=0;ok(gameLetters().length===3,'Tag-1-Buchstaben-Jagd zeigt nicht exakt 3 Zeichen');s.day=oldDay;
    ok(window.UKRAINIAN_COURSE_LOADER?.version===36,'Loader ist nicht auf v36');ok(window.UKRAINIAN_COURSE_LOADER?.evalFree===true,'Loader meldet keinen eval-freien Modus');ok(window.UKRAINIAN_COURSE_LOADER?.mode==='classic-script','Loader nutzt nicht den klassischen Skriptmodus');
    const core=window.UKRAINIAN_LEARNING_CORE;ok(core?.version>=3,'Zentraler Lernkern ist nicht auf v3');ok(Array.isArray(core?.skills)&&core.skills.length===5,'Lernkern kennt nicht fünf Skillbereiche');
    for(const fn of ['normalize','accepts','introductionDay','introductionDays','isIntroduced','allIntroduced','anchorDay','recordSession','profile','rankedSkills','focusForDay','reviewFocus','isUnlocked','curriculum'])ok(typeof core?.[fn]==='function','Lernkern vermisst '+fn);
    ok(core?.normalize("  Я п'ю воду! ")==='я п’ю воду','Zentrale Apostroph-/Unicode-Normalisierung fehlerhaft');ok(core?.accepts("Я п'ю воду!",['Я п’ю воду'])===true,'Zentrale Antwortbewertung akzeptiert Apostrophvarianten nicht');
    ok(Number(core?.introductionDay('магазин',{cardOnly:true}))>=0,'Curriculum-Suche findet магазин nicht');ok(Number(core?.anchorDay(['магазин','ресторан']))>=0,'Mehrfach-Anker findet bekannte Lernobjekte nicht');
    const curriculum=core?.curriculum?.()||{};ok(!!curriculum['immersion.transfer']&&!!curriculum['a1.final'],'Zentrale Meilensteine für Immersion/Abschluss fehlen');
    ok(window.UKRAINIAN_SKILL_PROFILE?.version>=2&&Number(window.UKRAINIAN_SKILL_PROFILE?.skills)===5&&window.UKRAINIAN_SKILL_PROFILE?.adaptiveReview===true,'Skill-Profil steuert Reviews nicht adaptiv');
    ok(window.UKRAINIAN_ADAPTIVE_REVIEW?.version>=1&&window.UKRAINIAN_ADAPTIVE_REVIEW?.automatic===true,'Automatischer Skill-Review fehlt');
    ok(window.UKRAINIAN_PRONUNCIATION_AUDIO&&Object.keys(window.UKRAINIAN_PRONUNCIATION_AUDIO).length===33,'33 menschliche Alphabet-Audioquellen fehlen');
    ok(window.UKRAINIAN_HUMAN_SENTENCE_AUDIO?.version>=3&&Number(window.UKRAINIAN_HUMAN_SENTENCE_AUDIO?.count)>=12,'12 verifizierte Human-Audios fehlen');
    ok(!!s.alphabetMastery&&!!s.alphabetProof&&!!s.readingBridge&&!!s.readingTransfer,'Alphabet-/Lese-Mastery-Module fehlen');
    ok(!!s.foundationExpansion&&Number(s.foundationExpansion.version)>=3&&window.UKRAINIAN_FOUNDATION_EXPANSION?.dynamicReviews===true,'Foundation v3/dynamische Reviews fehlen');
    ok(!!s.a1Expansion2&&Number(s.a1Expansion2.version)>=2&&window.UKRAINIAN_A1_EXPANSION_2?.dynamicReviews===true,'A1 Expansion 2 v2/dynamische Reviews fehlen');
    ok(!!s.a1GrammarBridge&&Number(s.a1GrammarBridge.version)>=3&&window.UKRAINIAN_A1_GRAMMAR_BRIDGE?.centralScoring===true,'A1-Grammatik v3 nutzt keine zentrale Bewertung');
    ok(!!s.timeBridge&&Number(s.timeBridge.version)>=3&&window.UKRAINIAN_TIME_BRIDGE?.centralScoring===true,'Zeit-Brücke v3 nutzt keine zentrale Bewertung');
    ok(!!s.genitiveBridge&&Number(s.genitiveBridge.version)>=3&&window.UKRAINIAN_GENITIVE_BRIDGE?.centralScoring===true,'Genitiv-Brücke v3 nutzt keine zentrale Bewertung');
    ok(!!s.humanListening&&Number(s.humanListening.version)>=3&&window.UKRAINIAN_HUMAN_LISTENING?.centralScoring===true,'Human-Listening v3 nutzt keine zentrale Bewertung');ok(Number(window.UKRAINIAN_HUMAN_LISTENING?.count)===12,'Human-Listening enthält nicht 12 Diktate');
    ok(!!s.speakingBridge&&Number(s.speakingBridge.version)>=2&&Number(window.UKRAINIAN_SENTENCE_SPEAKING?.count)===12,'Satz-Sprechbrücke fehlt oder hat nicht 12 Ziele');
    ok(!!s.immersionTransfer&&Number(s.immersionTransfer.version)>=3&&window.UKRAINIAN_IMMERSION_TRANSFER?.centralScoring===true,'Immersion v3 nutzt keine zentrale Bewertung');ok(Number(window.UKRAINIAN_IMMERSION_TRANSFER?.activeDays)===6&&Number(window.UKRAINIAN_IMMERSION_TRANSFER?.maxTurns)>=8,'Immersionsumfang ist beschädigt');ok(window.UKRAINIAN_IMMERSION_TRANSFER?.dependencyGate===true,'Immersion hat kein Kompetenz-Gate');
    ok(!!s.openDialogue&&Number(s.openDialogue.version)>=4&&window.UKRAINIAN_OPEN_DIALOGUE?.dynamicAnchors===true&&window.UKRAINIAN_OPEN_DIALOGUE?.centralScoring===true,'Open Dialogue v4 ist nicht vollständig zentralisiert');
    ok(!!s.conversationChain&&Number(s.conversationChain.version)>=4&&window.UKRAINIAN_CONVERSATION_CHAIN?.dynamicAnchors===true&&window.UKRAINIAN_CONVERSATION_CHAIN?.centralScoring===true,'Conversation Chain v4 ist nicht vollständig zentralisiert');ok(Number(window.UKRAINIAN_CONVERSATION_CHAIN?.maxTurns)>=6,'Gesprächskette hat weniger als sechs Züge');
    ok(!!s.freeReadingTransfer&&Number(s.freeReadingTransfer.version)>=3&&window.UKRAINIAN_FREE_READING_TRANSFER?.dynamicAnchor===true,'Freier Lese-Transfer v3 hat keinen dynamischen Anker');
    ok(!!s.comprehensionLab&&Number(s.comprehensionLab.version)>=5&&window.UKRAINIAN_COMPREHENSION_LAB?.dynamicReadingDependencies===true,'Comprehension Lab v5 hat keine dynamischen Leseabhängigkeiten');
    ok(!!s.activeProduction&&Number(s.activeProduction.version)>=5&&window.UKRAINIAN_ACTIVE_PRODUCTION?.centralScoring===true,'Active Production v5 ist nicht zentralisiert');
    ok(!!s.grammarSpiral&&Number(s.grammarSpiral.version)>=5&&window.UKRAINIAN_GRAMMAR_SPIRAL?.centralScoring===true,'Grammar Spiral v5 ist nicht zentralisiert');
    ok(!!s.storyLab&&Number(s.storyLab.version)>=4&&window.UKRAINIAN_STORY_LAB?.dynamicDependencies===true,'Story Lab v4 hat keine dynamischen Abhängigkeiten');
    ok(!!s.dictation&&Number(s.dictation.version)>=5&&window.UKRAINIAN_DICTATION?.centralScoring===true,'Dictation v5 ist nicht zentralisiert');
    ok(!!s.a1CanDo&&Number(s.a1CanDo.version)>=7&&window.UKRAINIAN_A1_CANDO?.centralScoring===true,'Can-do v7 ist nicht zentralisiert');
    ok(!!s.ukKeyboard&&Number(s.ukKeyboard.version)>=2,'Ukrainische Eingabehilfe fehlt');ok(typeof scheduleMeta==='function'&&typeof dueCards==='function','Adaptives SRS fehlt');
    ok(window.UKRAINIAN_DYNAMIC_COURSE_UI?.version>=1&&Number(window.UKRAINIAN_DYNAMIC_COURSE_UI?.length)===D.length,'Dynamische Kursanzeige kennt nicht die echte Kurslänge');
    const description=document.querySelector('meta[name="description"]')?.content||'';ok(description.includes(String(D.length)),'Meta-Beschreibung zeigt nicht die echte Kurslänge');
    ok(D.length>=90,'Grundkurs enthält weniger als 90 geführte Tage');ok(WEEKLY_REVIEW_DAYS.includes(D.length-1),'Letzter Kurstag ist nicht als Review markiert');ok(document.getElementById('next'),'Weiter-Button fehlt');
  }catch(e){problems.push('Selbsttest-Ausnahme: '+e.message)}
  window.UKRAINIAN_COURSE_SELFTEST={ok:problems.length===0,problems,checkedAt:new Date().toISOString()};
  if(problems.length)console.error('Ukrainischkurs Selbsttest:',problems);else console.info('Ukrainischkurs Selbsttest: OK');
})();