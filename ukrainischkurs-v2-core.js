/* Ukrainischkurs für Joel · geführte Alphabetphase v2
   Läuft als Upgrade-Layer nach der bestehenden App und hält alte Lerndaten migrierbar. */
(() => {
  const SCHEMA = 6;
  const ALPHABET_DAYS = 14;
  const INTRO_DAYS = 11;
  const WORD_OFFSET = 7; // alte Wortlektion 8 wird neue Lektion 15
  const OLD_D = D.map(day => [day[0], day[1], day[2], day[3].map(card => [...card])]);
  const OLD_DIALOGS = Object.entries(DIALOGS).map(([key, value]) => [Number(key), value]);

  const LETTER_INFO = {
    'А':{pair:'А а',sound:'A',name:'а (a)',help:'wie A in „Anna“'},
    'Б':{pair:'Б б',sound:'B',name:'бе (be)',help:'wie B in „Ball“'},
    'В':{pair:'В в',sound:'W',name:'ве (we)',help:'wie W in „Wasser“',trap:'В sieht wie B aus, klingt im Ukrainischen aber W.'},
    'Г':{pair:'Г г',sound:'H',name:'ге (he)',help:'ein weiches, stimmhaftes H – keine exakte deutsche Entsprechung'},
    'Ґ':{pair:'Ґ ґ',sound:'G',name:'ґе (ge)',help:'wie G in „Garten“'},
    'Д':{pair:'Д д',sound:'D',name:'де (de)',help:'wie D in „Dach“'},
    'Е':{pair:'Е е',sound:'E',name:'е (e)',help:'wie ein klares E'},
    'Є':{pair:'Є є',sound:'JE',name:'є (je)',help:'am Wortanfang ungefähr „je“; die genaue Aussprache wird später positionsabhängig vertieft'},
    'Ж':{pair:'Ж ж',sound:'stimmhaftes SCH',name:'же (sche)',help:'ähnlich dem Laut in französisch „Journal“ – keine exakte deutsche Entsprechung'},
    'З':{pair:'З з',sound:'stimmhaftes S',name:'зе (se)',help:'wie S in „Rose“'},
    'И':{pair:'И и',sound:'kurzes I',name:'и (y)',help:'etwas offener als deutsches I – keine exakte deutsche Entsprechung'},
    'І':{pair:'І і',sound:'I',name:'і (i)',help:'wie I in „Igel“'},
    'Ї':{pair:'Ї ї',sound:'JI',name:'ї (ji)',help:'ungefähr „ji“'},
    'Й':{pair:'Й й',sound:'J',name:'йот (jot)',help:'wie J in „ja“'},
    'К':{pair:'К к',sound:'K',name:'ка (ka)',help:'wie K in „Kind“'},
    'Л':{pair:'Л л',sound:'L',name:'ел (el)',help:'wie L'},
    'М':{pair:'М м',sound:'M',name:'ем (em)',help:'wie M'},
    'Н':{pair:'Н н',sound:'N',name:'ен (en)',help:'wie N in „Nase“',trap:'Н sieht wie H aus, klingt im Ukrainischen aber N.'},
    'О':{pair:'О о',sound:'O',name:'о (o)',help:'wie O'},
    'П':{pair:'П п',sound:'P',name:'пе (pe)',help:'wie P'},
    'Р':{pair:'Р р',sound:'R',name:'ер (er)',help:'gerolltes bzw. deutliches R',trap:'Р sieht wie P aus, klingt im Ukrainischen aber R.'},
    'С':{pair:'С с',sound:'S',name:'ес (es)',help:'wie stimmloses S in „Sonne“',trap:'С sieht wie C aus, klingt im Ukrainischen aber S.'},
    'Т':{pair:'Т т',sound:'T',name:'те (te)',help:'wie T'},
    'У':{pair:'У у',sound:'U',name:'у (u)',help:'wie U in „Uhr“',trap:'У sieht wie Y aus, klingt im Ukrainischen aber U.'},
    'Ф':{pair:'Ф ф',sound:'F',name:'еф (ef)',help:'wie F'},
    'Х':{pair:'Х х',sound:'CH',name:'ха (cha)',help:'wie CH in „Bach“'},
    'Ц':{pair:'Ц ц',sound:'Z',name:'це (ze)',help:'wie Z in „Zeit“'},
    'Ч':{pair:'Ч ч',sound:'TSCH',name:'че (tsche)',help:'wie „tsch“ in „Tschüss“'},
    'Ш':{pair:'Ш ш',sound:'SCH',name:'ша (scha)',help:'wie SCH in „Schule“'},
    'Щ':{pair:'Щ щ',sound:'SCHTSCH',name:'ща (schtscha)',help:'ungefähr „schtsch“; später wird der Laut genauer trainiert'},
    'Ь':{pair:'Ь ь',sound:'kein eigener Laut',name:'м’який знак (mjakij snak)',help:'Weichheitszeichen: Es macht den Konsonanten davor weich; es ist kein normaler Laut.'},
    'Ю':{pair:'Ю ю',sound:'JU',name:'ю (ju)',help:'am Wortanfang ungefähr „ju“; nach Konsonanten wird die genaue Wirkung später vertieft'},
    'Я':{pair:'Я я',sound:'JA',name:'я (ja)',help:'am Wortanfang ungefähr „ja“; nach Konsonanten wird die genaue Wirkung später vertieft'}
  };
  const ORDER = 'А Б В Г Ґ Д Е Є Ж З И І Ї Й К Л М Н О П Р С Т У Ф Х Ц Ч Ш Щ Ь Ю Я'.split(' ');
  const INTRO_GROUPS = Array.from({length: INTRO_DAYS}, (_, i) => ORDER.slice(i * 3, i * 3 + 3));
  const makeCard = letter => {
    const info = LETTER_INFO[letter];
    return [info.pair, info.sound, info.help];
  };
  const NEW_ALPHABET = INTRO_GROUPS.map((letters, index) => [
    `Alphabet ${index + 1}/11: ${letters.join(' · ')}`,
    `Heute kommen genau ${letters.length} neue Zeichen – nicht mehr. Laut ist wichtiger als Buchstabenname.`,
    index === 0
      ? 'Umschriften sind nur Merkhilfen. Höre hin, sprich nach und rufe die Laute anschließend ohne Hilfe ab.'
      : `Wiederhole zuerst Fälliges. Danach lernst du nur ${letters.join(', ')} und schließt mit aktivem Abruf ab.`,
    letters.map(makeCard)
  ]);
  NEW_ALPHABET.push(
    ['Kontrasttag: ähnliche Zeichen auseinanderhalten','Heute kommt kein neuer Buchstabe. Du trainierst gezielt typische Verwechslungen.','Achte besonders auf Г/Ґ, Е/Є, И/І/Ї/Й, Ж/Ш/Щ/Ч/Ц sowie die falschen Freunde В, Н, Р, С und У.',[]],
    ['Automatisierung: alle 33 Zeichen','Heute kommt nichts Neues. Ziel ist schneller, sicherer Abruf ohne Raten.','Kurze gemischte Aufgaben wechseln Zeichen → Laut und Laut → Zeichen. Genauigkeit bleibt wichtiger als Tempo.',[]],
    ['Alphabet-Checkpoint','Heute entscheidest du nicht selbst, was dran ist: Die App prüft das komplette Alphabet.','Der Checkpoint nutzt alle 33 Zeichen. Erst nach bestandenem Checkpoint öffnet sich der geführte Weg zum Lesen und zu ersten Wörtern.',[]]
  );

  const oldWords = OLD_D.slice(7);
  D.splice(0, D.length, ...NEW_ALPHABET, ...oldWords);
  LETTERS.splice(0, LETTERS.length, ...ORDER.map(letter => [letter, LETTER_INFO[letter].sound]));
  SRS_INTERVALS.splice(0, SRS_INTERVALS.length, 1, 2, 4, 7, 14, 30);
  WEEKLY_REVIEW_DAYS.splice(0, WEEKLY_REVIEW_DAYS.length, 20, 27, D.length - 1);

  // Wort-/Dialog-Funktionen behalten ihre Inhalte, verschieben sich aber hinter die 14 Alphabettage.
  Object.keys(DIALOGS).forEach(key => delete DIALOGS[key]);
  OLD_DIALOGS.forEach(([key, value]) => { DIALOGS[key + WORD_OFFSET] = value; });
  MASTER_SENTENCE_UNLOCKS.forEach((value, index) => { MASTER_SENTENCE_UNLOCKS[index] = value + WORD_OFFSET; });
  GAP_SENTENCE_UNLOCKS.forEach((value, index) => { GAP_SENTENCE_UNLOCKS[index] = value + WORD_OFFSET; });

  function mergeMeta(a, b) {
    if (!a) return b;
    if (!b) return a;
    const best = (Number(a.answers) || 0) >= (Number(b.answers) || 0) ? a : b;
    return {...a, ...b, ...best,
      answers: Math.max(Number(a.answers)||0, Number(b.answers)||0),
      correct: Math.max(Number(a.correct)||0, Number(b.correct)||0),
      wrong: Math.max(Number(a.wrong)||0, Number(b.wrong)||0),
      errors: Math.max(Number(a.errors)||0, Number(b.errors)||0)
    };
  }

  function migrateState() {
    s.alphabetPhase = {...{contrastPassed:false, automationPassed:false, checkpointPassed:false}, ...(s.alphabetPhase || {})};
    s.courseStartDate = s.courseStartDate || [...(s.dates || [])].sort()[0] || date();
    if (Number(s.courseSchema) >= SCHEMA) return;

    const oldKnown = {...(s.known || {})};
    const oldProgress = {...(s.lessonProgress || {})};
    const oldDone = {...(s.done || {})};
    const oldDay = Number(s.day) || 0;
    const migratedKnown = {};

    Object.entries(oldKnown).forEach(([key, meta]) => {
      const match = /^d(\d+)-(\d+)$/.exec(key);
      if (!match) { migratedKnown[key] = meta; return; }
      const di = Number(match[1]), ci = Number(match[2]);
      let newKey = key;
      if (di < 7) {
        const letter = OLD_D[di]?.[3]?.[ci]?.[0]?.[0];
        const pos = ORDER.indexOf(letter);
        if (pos >= 0) newKey = `d${Math.floor(pos/3)}-${pos%3}`;
      } else {
        newKey = `d${di + WORD_OFFSET}-${ci}`;
      }
      migratedKnown[newKey] = mergeMeta(migratedKnown[newKey], meta);
    });
    s.known = migratedKnown;

    const newProgress = {};
    // Jede neue 3er-Gruppe gilt nur dann als bestanden, wenn alle Ursprungstage bereits ihren Test bestanden hatten.
    INTRO_GROUPS.forEach((letters, newDay) => {
      const sourceDays = letters.map(letter => {
        for (let di=0; di<7; di++) for (let ci=0; ci<(OLD_D[di]?.[3]?.length||0); ci++) {
          if (OLD_D[di][3][ci][0][0] === letter) return di;
        }
        return -1;
      });
      const passed = sourceDays.every(di => di >= 0 && oldProgress[di]?.testPassed);
      const spoken = sourceDays.every(di => di >= 0 && oldProgress[di]?.spoken);
      const reviewDone = sourceDays.every(di => di >= 0 && oldProgress[di]?.reviewDone);
      if (passed || spoken || reviewDone) newProgress[newDay] = {testPassed:passed, spoken, reviewDone, testDate:date()};
    });
    Object.entries(oldProgress).forEach(([key, value]) => {
      const di = Number(key);
      if (di >= 7) newProgress[di + WORD_OFFSET] = value;
    });
    s.lessonProgress = newProgress;
    s.done = {};

    // Frühere Wortlektionen werden erst nach dem neuen Alphabet-Checkpoint wieder freigegeben.
    if (oldDay >= 7) s.day = 11;
    else {
      let firstOpen = 0;
      while (firstOpen < INTRO_DAYS && lessonComplete(firstOpen)) firstOpen++;
      s.day = Math.min(firstOpen, INTRO_DAYS - 1);
    }
    s.courseSchema = SCHEMA;
  }

  function normalizeSpacingMeta(meta) {
    if (!meta || typeof meta !== 'object') return meta;
    meta.answers = Number(meta.answers)||0;
    meta.correct = Number(meta.correct)||Number(meta.hits)||0;
    meta.wrong = Number(meta.wrong)||Number(meta.errors)||0;
    if (!Array.isArray(meta.successDates)) meta.successDates = [];
    if (!meta.successDates.length && meta.last && meta.lastAnswer === 'richtig') meta.successDates = [meta.last];
    meta.successDates = [...new Set(meta.successDates.filter(Boolean))].sort();
    const maxStage = meta.successDates.length || (meta.answers ? 1 : 0);
    meta.stage = Math.min(Math.max(0, Number(meta.stage)||0), maxStage);
    return meta;
  }

  const baseFreshMeta = freshMeta;
  freshMeta = function(){ return {...baseFreshMeta(), successDates:[], responseMs:[], confusion:{}}; };
  normalizeMeta = function(meta){ return normalizeSpacingMeta(meta); };
  Object.values(s.known || {}).forEach(normalizeSpacingMeta);
  Object.values(s.sentences || {}).forEach(normalizeSpacingMeta);

  learningStatus = function(meta){
    if (!meta) return 'Neu';
    normalizeSpacingMeta(meta);
    const answers = Number(meta.answers)||0;
    const days = meta.successDates.length;
    if (!answers) return 'Gesehen';
    if (days >= 4 && meta.stage >= 4) return 'Gemeistert';
    if (days >= 3 && meta.stage >= 3) return 'Sicher';
    if (days >= 2) return 'Fast sicher';
    return 'Lernen';
  };
  learningStatusClass = function(meta){ return learningStatus(meta).toLocaleLowerCase('de').replace(/ /g,'-'); };
  scheduleMeta = function(meta, correct){
    normalizeSpacingMeta(meta);
    meta.answers++;
    trackAnswer(correct);
    const today = date();
    if (correct) {
      const newDay = !meta.successDates.includes(today);
      if (newDay) {
        meta.successDates.push(today);
        meta.stage = Math.min(SRS_INTERVALS.length, (meta.stage||0) + 1);
      }
      const wait = SRS_INTERVALS[Math.max(0, (meta.stage||1)-1)] || 1;
      const nextDate = new Date(); nextDate.setDate(nextDate.getDate()+wait);
      meta.due = dayKey(nextDate);
      meta.correct++;
      meta.hits=(meta.hits||0)+1;
      meta.wrongStreak=0;
    } else {
      meta.stage=Math.max(0,(meta.stage||0)-1);
      meta.due=today;
      meta.wrong++;
      meta.errors=(meta.errors||0)+1;
      meta.wrongStreak=(meta.wrongStreak||0)+1;
    }
    meta.lastAnswer=correct?'richtig':'falsch';
    meta.last=today;
    meta.reviews=(meta.reviews||0)+1;
  };

  migrateState();
  syncLessons();

  function dayNumberDiff(from, to) {
    const a = new Date(from+'T12:00:00'), b = new Date(to+'T12:00:00');
    return Math.max(0, Math.floor((b-a)/86400000));
  }
  function calendarAge(){ return dayNumberDiff(s.courseStartDate || date(), date()); }
  function calendarAllows(di){ return di >= ALPHABET_DAYS || di <= calendarAge() || !!s.done[di]; }
  function introducedCount(){ return Math.min(33, Math.max(0, (Math.min(s.day, INTRO_DAYS-1)+1)*3)); }
  function introducedAlphabetItems(){
    const max = Math.min(33, Math.max(3, introducedCount()));
    return all().filter(item => item.di < INTRO_DAYS).slice(0, max);
  }

  alphabetItems = function(){ return all().filter(item => item.di < INTRO_DAYS); };
  alphabetKnown = function(){ return alphabetItems().filter(item => s.known[item.k]); };
  alphabetVerifiedCount = function(){
    let total=0;
    for (let di=0; di<INTRO_DAYS; di++) if (lessonState(di).testPassed) total += D[di][3].length;
    return Math.min(33,total);
  };
  alphabetReady = function(){
    return alphabetVerifiedCount()===33 && !!s.alphabetPhase?.checkpointPassed && Array.from({length:ALPHABET_DAYS},(_,di)=>lessonComplete(di)).every(Boolean);
  };
  requireAlphabet = function(){
    if (alphabetReady()) return true;
    show('learn');
    const missing = 33-alphabetVerifiedCount();
    toast(missing ? `Erst noch ${missing} Buchstaben sicher abrufen – danach folgen Kontrast, Automatisierung und Checkpoint.` : 'Schließe erst Tag 12–14 der Alphabetphase ab.');
    return false;
  };

  transliterationMarkup = function(c,di){
    if (di < INTRO_DAYS) return '<div class="trans">Merkhilfe: '+c[2]+'</div>';
    const label=di<21?'Aussprache anzeigen':'Aussprache nur bei Bedarf';
    return '<details class="pronunciation"><summary>'+label+'</summary><div class="trans">'+c[2]+'</div></details>';
  };

  function letterFromCard(c){ return c?.[0]?.[0] || ''; }
  function letterCardHTML(c, di, ci){
    const letter=letterFromCard(c), info=LETTER_INFO[letter], k=id(di,ci), meta=s.known[k], status=learningStatus(meta);
    return '<article class="word letters '+(meta?'known ':'')+'" data-letter-card="'+ci+'">'+
      '<button class="sound" aria-label="'+letter+' mit Systemstimme anhören">🔊</button>'+
      '<div class="uk">'+info.pair+'</div>'+
      '<div class="meaning">Laut: <strong>'+info.sound+'</strong></div>'+
      '<div class="trans">Buchstabenname: '+info.name+'</div>'+
      '<div class="hint">'+info.help+'</div>'+
      (info.trap?'<div class="tip" style="margin-top:9px">'+info.trap+'</div>':'')+
      '<div class="card-status '+learningStatusClass(meta)+'">'+status+'</div>'+
      '<button class="know">'+(meta?'✓ Angesehen':'Als gesehen markieren')+'</button></article>';
  }

  function renderOnboarding(){
    if (s.onboardingSeen || s.day!==0) return '';
    return '<article class="word" id="alphabetOnboarding" style="grid-column:1/-1;cursor:default;padding-bottom:15px">'+
      '<div class="label">Start in unter 1 Minute</div><h2>Du brauchst keinerlei Vorwissen</h2>'+
      '<p class="small"><strong>Kyrillisch</strong> ist die Schrift, die Ukrainisch benutzt. Das ukrainische Alphabet hat <strong>33 Buchstaben</strong>. Einige sehen deutschen Buchstaben ähnlich, bedeuten aber etwas anderes – zum Beispiel В = W und Р = R.</p>'+
      '<p class="small">Die App führt dich <strong>14 Tage</strong>: höchstens drei neue Zeichen pro Einführungstag, Tag 12 für Verwechslungen, Tag 13 für Automatisierung und Tag 14 als Checkpoint. Wörter im Hauptkurs beginnen erst danach.</p>'+
      '<p class="small">Umschriften sind nur Merkhilfen. Entscheidend ist der Laut. Du musst nie selbst auswählen, was als Nächstes sinnvoll ist.</p>'+
      '<button class="primary" id="finishOnboarding">Verstanden – Tag 1 starten</button></article>';
  }

  function renderSpecialDay(){
    const specs={
      11:{title:'Kontraste, die wirklich verwechselt werden',text:'Heute gibt es keine neuen Zeichen. Der Test mischt bewusst ähnliche Formen und Laute.',pairs:['Г / Ґ','Е / Є','И / І / Ї / Й','Ж / Ш / Щ / Ч / Ц','В / Б','Р / П','С / З','Ш / Щ']},
      12:{title:'Abruf automatisieren',text:'Heute siehst du die 33 Zeichen in wechselnder Richtung. Nicht stumpf wiederholen: erst erinnern, dann antworten.',pairs:['Zeichen → Laut','Laut → Zeichen','falsche Freunde','schwierige Konsonanten','Vokale im Wechsel']},
      13:{title:'Echter Alphabet-Checkpoint',text:'Der Checkpoint prüft alle 33 Zeichen. Mindestens 90 % müssen beim ersten Versuch stimmen; Fehler werden trotzdem sofort repariert.',pairs:['33 Zeichen','gemischte Reihenfolge','erster Versuch zählt','Fehler kommen erneut','erst danach Lesen']}
    }[s.day];
    $('cards').innerHTML='<article class="word" style="grid-column:1/-1;cursor:default;padding-bottom:15px"><h2>'+specs.title+'</h2><p class="small">'+specs.text+'</p><div class="actions">'+specs.pairs.map(x=>'<span class="secondary" style="cursor:default">'+x+'</span>').join('')+'</div></article>';
  }

  updateDaily = function(){
    ensureDaily();
    const p=lessonState(s.day), review=priorDue(s.day).length===0;
    if(review&&p.testPassed&&!p.reviewDone){p.reviewDone=true;syncLesson(s.day);save();}
    if (s.day < INTRO_DAYS) {
      const newCards=D[s.day][3].every((_,ci)=>s.known[id(s.day,ci)]);
      const items=[
        ['Wiederholen',review,review?'heute nichts fällig':'noch '+priorDue(s.day).length+' fällig'],
        ['3 neue Buchstaben',newCards,newCards?'alle drei angesehen':'nur die heutigen Zeichen kennenlernen'],
        ['Hören',!!s.daily.listened,'Systemstimme ist aktuell nur Fallback'],
        ['Nachsprechen',!!s.daily.spoken,'Laute laut produzieren'],
        ['Aktiv abrufen',!!p.testPassed,p.testPassed?'alle heutigen Zeichen beim ersten Versuch richtig':'alle heutigen Zeichen müssen stimmen'],
        ['Buchstaben-Jagd',!!s.daily.game,s.daily.game?'Runde geschafft':'kurze Recognition-Runde']
      ];
      const done=items.filter(x=>x[1]).length;
      const next=!review?'Beginne mit den fälligen Wiederholungen.':!newCards?'Lerne jetzt nur die drei heutigen Buchstaben.':!s.daily.listened?'Höre die drei Zeichen einmal an.':!s.daily.spoken?'Sprich ihre Laute jetzt laut.':!p.testPassed?'Starte den Aktiv-Abruf-Test.':!s.daily.game?'Zum Abschluss eine kurze Buchstaben-Jagd.':'Tagesziel geschafft. Der nächste Einführungstag öffnet sich erst am nächsten Kalendertag.';
      $('daily').innerHTML='<div class="daily-head">Heute '+done+' von '+items.length+' Aufgaben geschafft</div><div class="daily-next"><b>Dein nächster Schritt</b>'+next+'</div>'+items.map(x=>'<div class="daily-item '+(x[1]?'done':'')+'"><b>'+(x[1]?'✓ ':'')+x[0]+'</b><span class="subdone">'+x[2]+'</span></div>').join('');
      $('methodKeyboard').hidden=true;
      renderDialog(); return;
    }
    if (s.day < ALPHABET_DAYS) {
      const phaseNames=['Kontrasttraining','Automatisierung','Checkpoint'];
      const items=[
        ['Fällige Wiederholungen',review,review?'erledigt':'noch '+priorDue(s.day).length+' fällig'],
        ['Laut nachsprechen',!!s.daily.spoken,'kurz aktiv produzieren'],
        [phaseNames[s.day-11],!!p.testPassed,p.testPassed?'bestanden':s.day===13?'mindestens 90 % beim ersten Versuch':'mindestens 85 % beim ersten Versuch']
      ];
      const done=items.filter(x=>x[1]).length;
      $('daily').innerHTML='<div class="daily-head">Alphabet · Tag '+(s.day+1)+' von 14 · '+done+' von '+items.length+' Aufgaben</div><div class="daily-next"><b>Dein nächster Schritt</b>'+(!review?'Zuerst fällige Zeichen wiederholen.':!s.daily.spoken?'Sprich einige schwierige Laute einmal laut.':!p.testPassed?'Starte jetzt den geführten Test.':'Tagesziel geschafft.')+'</div>'+items.map(x=>'<div class="daily-item '+(x[1]?'done':'')+'"><b>'+(x[1]?'✓ ':'')+x[0]+'</b><span class="subdone">'+x[2]+'</span></div>').join('');
      $('methodKeyboard').hidden=true;
      renderDialog(); return;
    }
    // Nach dem Alphabet bleibt die bisherige Tageslogik erhalten, aber mit den verschobenen Wortlektionen.
    const writing=s.writing.date===date()&&s.writing.count>=s.writing.target,
      newCards=D[s.day][3].every((_,ci)=>s.known[id(s.day,ci)]),hasDialog=!!DIALOGS[s.day],practiceDone=hasDialog?!!s.daily.dialog:true,
      items=[['Wiederholen',review,review?'heute nichts fällig':'noch '+priorDue(s.day).length+' fällig'],['Neue Karten',newCards,newCards?'angesehen':'wenige Karten kennenlernen'],['Hören',!!s.daily.listened,'mindestens einmal ohne mitzulesen'],['Nachsprechen',!!s.daily.spoken,'getrennt vom Anhören'],['Schreiben',writing,writing?'heutiges Ziel':'freiwillige Schreibpraxis'],['Aktiv abrufen',!!p.testPassed,p.testPassed?'Abschlusstest bestanden':'mind. 80 % nötig'],hasDialog?['Mini-Dialog',practiceDone,practiceDone?'laut beantwortet':'Antwort erst selbst sagen']:null].filter(Boolean),
      done=items.filter(x=>x[1]).length,
      next=!review?'Beginne mit den fälligen Wiederholungen.':!newCards?'Sieh dir die wenigen neuen Karten an.':!s.daily.listened?'Höre die neuen Karten an.':!s.daily.spoken?'Sprich die Reihe laut nach.':!p.testPassed?'Zum Schluss kommt der Abruf-Test.':!practiceDone?'Runde die Einheit mit dem Mini-Dialog ab.':'Tagesziel geschafft.';
    $('daily').innerHTML='<div class="daily-head">Heute '+done+' von '+items.length+' Aufgaben geschafft</div><div class="daily-next"><b>Dein nächster Schritt</b>'+next+'</div>'+items.map(x=>'<div class="daily-item '+(x[1]?'done':'')+'"><b>'+(x[1]?'✓ ':'')+x[0]+'</b><span class="subdone">'+x[2]+'</span></div>').join('');
    $('methodKeyboard').hidden=!keyboardUnlocked(); renderDialog();
  };

  render = function(){
    const d=D[s.day], spoken=!!s.daily.spoken, alphabetDay=s.day<ALPHABET_DAYS;
    $('label').textContent=alphabetDay?`Tag ${s.day+1} von 14 · Alphabet`:`Lektion ${s.day+1} · nach dem Alphabet`;
    $('title').textContent=d[0]; $('focus').textContent=d[1]; $('tip').textContent=d[2];
    $('markSpoken').textContent=spoken?'✓ Heute laut nachgesprochen':'🗣️ Heute laut nachsprechen'; $('markSpoken').classList.toggle('done',spoken);
    $('cards').innerHTML='';
    if (s.day < INTRO_DAYS) {
      $('speakPrompt').textContent='Höre die Zeichen an und sprich vor allem ihre Laute laut: '+d[3].map(c=>LETTER_INFO[letterFromCard(c)].sound).join(' · ');
      $('cards').innerHTML=renderOnboarding()+d[3].map((c,ci)=>letterCardHTML(c,s.day,ci)).join('');
      $('cards').querySelectorAll('[data-letter-card]').forEach((el,ci)=>{
        const c=d[3][ci], letter=letterFromCard(c);
        el.onclick=e=>{if(!e.target.closest('.know')){speak(letter,el.querySelector('.sound'));markListened()}};
        el.querySelector('.sound').onclick=e=>{e.stopPropagation();speak(letter,e.currentTarget);markListened()};
        el.querySelector('.know').onclick=e=>{e.stopPropagation();toggle(s.day,ci)};
      });
      const intro=$('finishOnboarding'); if(intro) intro.onclick=()=>{s.onboardingSeen=true;save();render()};
    } else if (s.day < ALPHABET_DAYS) {
      $('speakPrompt').textContent='Sprich schwierige Laute bewusst langsam nach, bevor du den Test startest.';
      renderSpecialDay();
    } else {
      $('speakPrompt').textContent='Höre die Reihe an und sprich laut nach: '+d[3].slice(0,2).map(c=>c[0]).join(' · ');
      d[3].forEach((c,ci)=>{let k=id(s.day,ci),meta=s.known[k],status=learningStatus(meta),e=document.createElement('article');e.className='word '+(meta?'known ':'');e.tabIndex=0;e.innerHTML='<button class="sound" aria-label="Anhören">🔊</button><div class="uk">'+c[0]+'</div>'+transliterationMarkup(c,s.day)+'<div class="meaning">'+c[1]+'</div><div class="card-status '+learningStatusClass(meta)+'">'+status+'</div><div class="hint">Ukrainisch · anhören, laut sagen, dann im Test abrufen</div><button class="know">'+(meta?'✓ Angesehen':'Als gesehen markieren')+'</button>';e.onclick=x=>{if(!x.target.closest('.know')){speak(c[0],e.querySelector('.sound'));markListened()}};e.querySelector('.sound').onclick=x=>{x.stopPropagation();speak(c[0],x.currentTarget);markListened()};e.querySelector('.know').onclick=x=>{x.stopPropagation();toggle(s.day,ci)};$('cards').append(e)});
    }
    $('next').textContent=s.day===D.length-1?'Zum Anfang':'Nächster Kurstag';
    audioState(); updateDaily(); progress();
  };

  renderAlphabet = function(){
    const b=$('alphabetGrid'); if(!b)return; b.innerHTML='';
    const verified=alphabetVerifiedCount(); $('alphabetCount').textContent=verified+' / 33 geprüft';
    ORDER.forEach(letter=>{const info=LETTER_INFO[letter],e=document.createElement('button');e.className='alphabet-card';e.type='button';e.setAttribute('aria-label','Buchstabe '+letter+', Laut '+info.sound+', Name '+info.name);e.innerHTML='<div class="alphabet-letter">'+letter+'</div><div class="alphabet-sound">Laut: '+info.sound+'</div><div class="alphabet-help">Name: '+info.name+'</div>';e.onclick=()=>{speak(letter,e);markListened()};b.append(e)});
  };

  progress = function(){
    const due=dueCards().length;
    if (!alphabetReady()) {
      const verified=alphabetVerifiedCount();
      $('bar').style.width=(verified/33*100)+'%';
      $('progressText').textContent=`Alphabet: ${verified} von 33 geprüft · Kurstag ${Math.min(s.day+1,14)} von 14 · ${due} Wiederholung${due===1?'':'en'} fällig`;
    } else {
      const seen=Object.keys(s.known).length,total=all().length,done=Object.keys(s.done).length,safe=Object.values(s.known).filter(meta=>['Sicher','Gemeistert'].includes(learningStatus(meta))).length;
      $('bar').style.width=(done/D.length*100)+'%';
      $('progressText').textContent=seen+' von '+total+' Lernobjekten gesehen · '+safe+' sicher oder gemeistert · '+done+' von '+D.length+' Kurstagen abgeschlossen';
    }
    $('streak').textContent=streak()+' Tage dran';
  };

  gameLetters = function(){
    const max=s.day<INTRO_DAYS?Math.min(33,(s.day+1)*3):33;
    const available=LETTERS.slice(0,max); return available.length>3?available:LETTERS.slice(0,4);
  };
  matchingPool = function(){
    if(s.day<ALPHABET_DAYS)return introducedAlphabetItems();
    const known=all().filter(item=>item.di>=ALPHABET_DAYS&&s.known[item.k]); return known.length>=4?known:all().filter(item=>item.di===s.day);
  };
  mixedItems = function(){
    if(!alphabetReady()) return introducedAlphabetItems();
    const words=all().filter(item=>item.di>=ALPHABET_DAYS&&s.known[item.k]); return words.length?words:all().filter(item=>item.di>=ALPHABET_DAYS&&item.di<=s.day);
  };
  contrastItems = function(){
    const tricky=['В','Н','Р','С','У','Г','Ґ','Е','Є','Ж','З','И','І','Ї','Й','П','Б','Х','Ц','Ч','Ш','Щ','Ь'];
    const pool=s.day<INTRO_DAYS?introducedAlphabetItems():alphabetItems(); return pool.filter(x=>tricky.includes(x.c[0][0]));
  };
  speedPool = function(){ return all().filter(x=>x.di>=ALPHABET_DAYS&&s.known[x.k]); };
  startListening = function(){
    const pool=all().filter(item=>item.di>=ALPHABET_DAYS&&s.known[item.k]);
    if(pool.length<4){toast('Nach dem Alphabet brauchst du zuerst vier bekannte Wörter für dieses Hörtraining.');show('learn');return}
    start(pool,{lesson:false,limit:5,kind:'listening',forceMode:'audioChoice'});
  };
  typingPool = function(){ return all().filter(x=>x.di>=ALPHABET_DAYS&&s.known[x.k]); };
  keyboardUnlocked = function(){ return alphabetReady()&&completedLessons()>=17; };
  masterUnlocked = function(){ return alphabetReady()&&completedLessons()>=15; };
  newDictation = function(){let pool=all().filter(x=>x.di>=ALPHABET_DAYS&&s.known[x.k]);if(!pool.length)return;let choices=pool.filter(x=>!master.dictation||x.k!==master.dictation.k),set=choices.length?choices:pool;master.dictation=set[Math.floor(Math.random()*set.length)];master.dictationAnswered=false;renderDictation()};

  // Quizfrage: Buchstaben bleiben bis Tag 14 Buchstaben und werden nicht versehentlich als Wörter behandelt.
  ask = function(){
    let x=quiz.items[quiz.at],c=x.c;quiz.answered=false;
    $('quizMeta').textContent=x.retry?'Sofort wiederholen · dieselbe Karte noch einmal':quiz.kind==='listening'?'Hörverständnis · Aufgabe '+(quiz.at+1)+' von '+quiz.baseTotal:'Aktiv abrufen · Frage '+(quiz.at+1)+' von '+quiz.baseTotal;
    $('feedback').textContent='';$('continue').hidden=true;$('answers').innerHTML='';
    let word=x.di>=ALPHABET_DAYS,mode=quiz.forceMode||(!word?(quiz.at%2?'letterType':'letterChoice'):(keyboardUnlocked()&&quiz.at%3===0?'ukType':quiz.at%3===1?'audioChoice':'deType'));quiz.mode=mode;
    if(mode==='letterChoice'){
      $('question').innerHTML='Welches Zeichen klingt wie <strong>'+c[1]+'</strong>?';
      let source=quiz.originDay<INTRO_DAYS?all().filter(item=>item.di<INTRO_DAYS&&item.di<=quiz.originDay):alphabetItems(),options=[c,...source.filter(y=>y.k!==x.k&&y.c[1]!==c[1]).sort(()=>Math.random()-.5).slice(0,3).map(y=>y.c)].sort(()=>Math.random()-.5);
      options.forEach(o=>{let b=document.createElement('button');b.className='answer';b.textContent=o[0];b.onclick=()=>answer(b,o===c,c,x.di);$('answers').append(b)});return;
    }
    if(mode==='letterType'){
      $('question').innerHTML='Welchen Laut hat <strong>'+c[0]+'</strong>?';
      makeTypedAnswer('z. B. W oder SCH',input=>{let good=normalAnswer(input.value)===normalAnswer(c[1]);if(!recordQuizAnswer(good,c,x.di))return;input.disabled=true;input.classList.add(good?'good':'bad');$('feedback').textContent=good?'Richtig – '+c[0]+' klingt wie '+c[1]+'.':'Richtig wäre: '+c[1]+'. Diese Karte kommt sofort noch einmal.';});return;
    }
    if(mode==='ukType'){$('question').innerHTML='Deutsch: <strong>'+c[1]+'</strong><br><span class="small">Tippe es auf Ukrainisch.</span>';makeTypedAnswer('Ukrainisch eingeben …',input=>{let good=tolerantMatch(input.value,c[0]);if(!recordQuizAnswer(good,c,x.di))return;input.disabled=true;input.classList.add(good?'good':'bad');$('feedback').textContent=good?'Richtig geschrieben!':'Richtig: '+c[0]+' · diese Karte kommt sofort noch einmal.';});return}
    if(mode==='audioChoice'){$('question').innerHTML='Höre zu: Was bedeutet dieses Wort?';let listen=document.createElement('button');listen.className='secondary';listen.textContent='🔊 Wort anhören';listen.onclick=e=>{speak(c[0],e.currentTarget);markListened()};$('answers').append(listen);let options=[c,...all().filter(y=>y.di===x.di&&y.c!==c).sort(()=>Math.random()-.5).slice(0,3).map(y=>y.c)].sort(()=>Math.random()-.5);options.forEach(o=>{let b=document.createElement('button');b.className='answer';b.textContent=o[1];b.onclick=()=>answer(b,o===c,c,x.di);$('answers').append(b)});return}
    $('question').innerHTML='Was bedeutet <strong>'+c[0]+'</strong>?';makeTypedAnswer('Deutsch eingeben …',input=>{let good=germanMatches(input.value,c[1]);if(!recordQuizAnswer(good,c,x.di))return;input.disabled=true;input.classList.add(good?'good':'bad');$('feedback').textContent=good?'Richtig!':'Richtig: '+c[1]+' · diese Karte kommt sofort noch einmal.';});
  };

  start = function(items,config={}){
    let originDay=config.originDay??s.day,lesson=config.lesson??!items,kind=config.kind||(lesson&&originDay===D.length-1?'final':lesson&&WEEKLY_REVIEW_DAYS.includes(originDay)?'weekly':'daily'),pool=items||D[originDay][3].map((c,ci)=>({c,ci,di:originDay,k:id(originDay,ci)}));
    if(!items&&kind==='weekly')pool=all().filter(item=>item.di<=originDay);
    if(!items&&kind==='final')pool=all();
    let baseItems=[...pool].sort(()=>Math.random()-.5).slice(0,Math.min(config.limit||(kind==='final'?18:kind==='weekly'?10:5),pool.length));
    quiz={items:baseItems,baseItems,baseTotal:baseItems.length,at:0,score:0,answered:false,results:{},modes:{},lesson,originDay,kind,forceMode:config.forceMode||''};
    if(!baseItems.length){toast('Für diesen Test sind noch keine Karten verfügbar.');show('learn');return}
    show('quiz');ask();
  };

  function startAlphabetSpecial(){
    const di=s.day;
    const config=di===11?{items:contrastItems(),limit:12,kind:'contrast'}:di===12?{items:alphabetItems(),limit:18,kind:'automation'}:{items:alphabetItems(),limit:33,kind:'checkpoint'};
    start(config.items,{lesson:false,originDay:di,limit:config.limit,kind:config.kind});
    quiz.specialDay=di;
  }

  const baseNextQuiz=nextQuiz;
  nextQuiz = function(){
    const special=Number.isInteger(quiz.specialDay)?quiz.specialDay:null;
    const origin=quiz.originDay;
    const intro=quiz.lesson&&origin<INTRO_DAYS;
    baseNextQuiz();
    if(quiz.at<quiz.items.length)return;
    if(intro){
      const passed=quiz.score===quiz.baseTotal,p=lessonState(origin);p.testPassed=passed;p.reviewDone=priorDue(origin).length===0;p.score=quiz.score;p.total=quiz.baseTotal;p.testDate=date();syncLesson(origin);save();updateDaily();
      $('answers').innerHTML='<div class="tip">'+(passed?'Alle heutigen Buchstaben waren beim ersten Versuch richtig. '+(p.spoken?(p.reviewDone?'Der Kurstag ist abgeschlossen.':'Erledige noch fällige Wiederholungen.'):'Sprich die Laute noch einmal laut nach.'):'Für einen Einführungstag müssen alle drei Zeichen beim ersten Versuch stimmen. Fehler wurden sofort repariert; starte den kurzen Test später noch einmal.')+'</div><button class="primary" id="back">Zur Lektion</button>';$('back').onclick=()=>show('learn');
    }
    if(special!==null){
      const ratio=quiz.baseTotal?quiz.score/quiz.baseTotal:0,required=special===13?.90:.85,passed=ratio>=required,p=lessonState(special);p.testPassed=passed;p.reviewDone=priorDue(special).length===0;p.score=quiz.score;p.total=quiz.baseTotal;p.testDate=date();
      if(special===11)s.alphabetPhase.contrastPassed=passed;if(special===12)s.alphabetPhase.automationPassed=passed;if(special===13)s.alphabetPhase.checkpointPassed=passed&&alphabetVerifiedCount()===33;
      syncLesson(special);save();updateDaily();
      const pct=Math.round(ratio*100),name=special===11?'Kontrasttraining':special===12?'Automatisierung':'Alphabet-Checkpoint';
      $('quizMeta').textContent=name+' abgeschlossen';$('question').innerHTML=pct+' % beim ersten Versuch';$('answers').innerHTML='<div class="tip">'+(passed?(special===13?'Checkpoint bestanden. Nach Abschluss der übrigen Tagesaufgaben öffnet sich als Nächstes die Lesephase.':'Bestanden. Fällige Fehler bleiben trotzdem automatisch im Wiederholsystem.'):'Noch nicht bestanden. Das ist Lerninformation, kein Verlust: schwierige Zeichen sind jetzt früher fällig.')+'</div><button class="primary" id="back">Zur Lektion</button>';$('back').onclick=()=>show('learn');
    }
  };

  calendar = function(){
    let b=$('calendar'),nextOpen=Math.min(D.length-1,completedLessons());b.innerHTML='';
    D.forEach((d,i)=>{let alphabetLock=i>=ALPHABET_DAYS&&!alphabetReady(),sequenceLock=i>nextOpen,dateLock=i<ALPHABET_DAYS&&!calendarAllows(i),locked=alphabetLock||sequenceLock||dateLock,e=document.createElement('button');e.className='day '+(i===s.day?'now ':'')+(s.done[i]?'done ':'')+(locked?'locked ':'');e.innerHTML='Tag '+(i+1)+'<small>'+(dateLock?'öffnet später':alphabetLock?'Alphabet zuerst':sequenceLock?'erst die Reihe':s.done[i]?'✓ fertig':i===nextOpen?'jetzt':'wiederholen')+'</small>';e.title=dateLock?'Dieser Alphabettag wird nach einem weiteren Kalendertag freigeschaltet.':alphabetLock?'Erst den Alphabet-Checkpoint bestehen':sequenceLock?'Schließe zuerst Tag '+(nextOpen+1)+' ab':d[0];e.onclick=()=>{if(dateLock){toast('Der geführte Alphabetkurs verteilt neue Inhalte bewusst auf echte Kalendertage. Zusatzübungen bleiben verfügbar.');return}if(alphabetLock){requireAlphabet();return}if(sequenceLock){toast('Lerne zuerst Tag '+(nextOpen+1)+' – die App führt dich Schritt für Schritt.');return}s.day=i;save();render();show('learn')};b.append(e)});
  };
  advanceLesson = function(){
    if(!s.done[s.day]){let p=lessonState(s.day),missing=!p.testPassed?'Bestehe zuerst den heutigen Abruf-Test.':!p.spoken?'Sprich die heutigen Laute bzw. die Reihe noch laut nach.':'Erledige zuerst die fälligen Wiederholungen.';toast(missing);return}
    let next=s.day===D.length-1?0:s.day+1;
    if(next<ALPHABET_DAYS&&!calendarAllows(next)){toast('Der nächste Alphabettag öffnet sich am nächsten vorgesehenen Kalendertag. Freies Zusatztraining ist weiterhin möglich.');return}
    if(next>=ALPHABET_DAYS&&!requireAlphabet())return;
    if(next>completedLessons()){toast('Schließe zuerst den aktuellen Kurstag ab.');return}
    s.day=next;save();render();study();
  };

  finalReport = function(){let percent=items=>{let total=items.length,correct=items.filter(item=>quiz.results[item.k]).length;return total?Math.round(correct/total*100):null},letters=quiz.baseItems.filter(item=>item.di<INTRO_DAYS),words=quiz.baseItems.filter(item=>item.di>=ALPHABET_DAYS&&!item.c[0].includes(' ')),sentences=quiz.baseItems.filter(item=>item.di>=ALPHABET_DAYS&&item.c[0].includes(' ')),hearing=quiz.baseItems.filter(item=>quiz.modes[item.k]==='audioChoice'),line=(label,value)=>'<div class="final-line"><span>'+label+'</span><b>'+(value===null?'–':value+' %')+'</b></div>';return '<div class="final-report"><h3>Dein Kursergebnis</h3>'+line('Alphabet',percent(letters))+line('Wortschatz',percent(words))+line('Hören',percent(hearing))+line('Sätze',percent(sentences))+line('Gesamt',Math.round(quiz.score/quiz.baseTotal*100))+'<p class="small">Schwierige Karten bleiben automatisch fällig.</p></div>'};

  const baseRenderKeyboard=renderKeyboard;
  renderKeyboard = function(){baseRenderKeyboard();if(!keyboardUnlocked()){let left=Math.max(0,17-completedLessons());$('keyboardUnlockText').textContent=left?`Noch ${left} geführte Kurstage bis zum Tastaturtrainer. Alphabet-Checkpoint und erste Lese-/Wortlektionen kommen vorher.`:'Der Tastaturtrainer öffnet sich nach der nächsten passenden Wortlektion.';}};
  const baseRenderMaster=renderMaster;
  renderMaster = function(){baseRenderMaster();if(!masterUnlocked())$('masterUnlockText').textContent='Die Satzwerkstatt öffnet sich erst nach bestandenem Alphabet-Checkpoint und den ersten Grundlagen nach dem Alphabet.';};
  speakLesson = function(button){let pool=s.day<INTRO_DAYS?D[s.day][3].map(c=>c[0]):s.day<ALPHABET_DAYS?introducedAlphabetItems().slice(-8).map(x=>x.c[0]):D[s.day][3].map(c=>c[0]);if(pool.length){speak(pool.join('. '),button);markListened()}else toast('Heute steht aktiver Abruf statt neuer Hörkarten im Mittelpunkt.');};

  resetProgress = function(){if(!confirm('Wirklich den gesamten Lernfortschritt auf diesem Gerät löschen?'))return;s=blank();s.courseSchema=SCHEMA;s.courseStartDate=date();s.alphabetPhase={contrastPassed:false,automationPassed:false,checkpointPassed:false};s.onboardingSeen=false;save();render();stats();renderAlphabet();toast('Alles ist zurückgesetzt. Du beginnst wieder bei Tag 1.');show('learn')};
  restore = function(f){let r=new FileReader();r.onload=()=>{try{let x=JSON.parse(r.result);if(!x||typeof x!=='object')throw 0;s=normal(x);if(!Number.isInteger(s.day)||s.day<0||s.day>=Math.max(D.length,30))s.day=0;migrateState();if(!Number.isInteger(s.day)||s.day<0||s.day>=D.length)s.day=0;syncLessons();save();render();stats();renderAlphabet();toast('Fortschritt wurde geladen und auf den aktuellen Kursstand migriert.')}catch{toast('Das ist keine gültige Sicherungsdatei.')}};r.readAsText(f)};

  // Texte der bestehenden Oberfläche an die neue geführte Struktur anpassen.
  const sub=document.querySelector('header .sub'); if(sub)sub.textContent='Dein geführter Lernweg: 14 Tage Alphabet, danach Lesen und alltagstaugliches Ukrainisch.';
  const courseTab=[...document.querySelectorAll('.tab')].find(x=>x.dataset.view==='course'); if(courseTab)courseTab.textContent='Lernweg';
  const courseTitle=document.querySelector('#course h2'); if(courseTitle)courseTitle.textContent='Dein geführter Lernweg';
  const courseText=document.querySelector('#course .small'); if(courseText)courseText.textContent='Du kannst abgeschlossene Tage wiederholen. Neue Alphabettage werden bewusst über echte Kalendertage verteilt.';
  const alphabetText=document.querySelector('#alphabet .top .small'); if(alphabetText)alphabetText.textContent='33 Buchstaben in echter ukrainischer Reihenfolge. Tage 1–11: höchstens drei neue Zeichen; Tage 12–14: Kontrast, Automatisierung, Checkpoint.';
  const methodsTitle=document.querySelector('#methods h2'); if(methodsTitle)methodsTitle.textContent='Zusatzübungen – der Hauptkurs bleibt geführt';
  const methodsIntro=document.querySelector('#methods .small'); if(methodsIntro)methodsIntro.textContent='Diese Übungen sind freiwillig. Sie verändern nicht die Reihenfolge der neuen Inhalte im geführten Hauptkurs.';
  const keyboardTitle=document.querySelector('#keyboardLocked h2'); if(keyboardTitle)keyboardTitle.textContent='Das kommt nach dem Alphabet und den ersten Wörtern';
  const keyboardInfo=document.querySelector('#keyboardLocked .small'); if(keyboardInfo)keyboardInfo.textContent='Zuerst werden die 33 Buchstaben über 14 Tage gefestigt. Danach folgt Lesen; die ukrainische Tastatur wird erst freigeschaltet, wenn sie didaktisch sinnvoll ist.';
  const masterInfo=document.querySelector('#masterLocked .small'); if(masterInfo)masterInfo.textContent='Satztraining bleibt gesperrt, bis das Alphabet abgeschlossen ist und erste Wörter wirklich abrufbar sind.';

  $('startQuiz').onclick=()=>s.day>=11&&s.day<ALPHABET_DAYS?startAlphabetSpecial():start();
  $('methodQuiz').onclick=()=>s.day>=11&&s.day<ALPHABET_DAYS?startAlphabetSpecial():start();
  $('methodListening').onclick=startListening;
  $('methodSpeed').onclick=startSpeed;
  $('continue').onclick=nextQuiz;
  $('next').onclick=advanceLesson;
  $('reset').onclick=resetProgress;
  $('resetProgress').onclick=resetProgress;
  $('import').onchange=e=>e.target.files[0]&&restore(e.target.files[0]);

  // Falls ein alter Stand auf einen heute noch gesperrten Alphabettag zeigte, auf den aktuell sinnvollen Tag zurückführen.
  if(s.day<ALPHABET_DAYS&&!calendarAllows(s.day))s.day=Math.min(calendarAge(),INTRO_DAYS-1);
  syncLessons(); save(); render(); renderAlphabet();
})();