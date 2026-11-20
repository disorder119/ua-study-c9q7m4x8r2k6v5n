# Alphabet Lab V7.1

Dieses Repository enthält zwei getrennte Lernoberflächen:

- `alphabet-lab.html` – aktueller Haupteinstieg zum sicheren Lernen aller 33 ukrainischen Buchstaben.
- `ukrainischkurs-app.html` – der bestehende vollständige A1-Kurs; er bleibt unabhängig erhalten.

Die Repository-Root führt zum Alphabet Lab.

## V7.1 · Belegte Lernmethoden im Lernpfad

V7 hat die Reihenfolge umgedreht (erst zeigen, dann fragen). V7.1 macht den Pfad
umfangreicher und richtet ihn an Methoden aus, deren Wirkung in der
Lernforschung gut belegt ist. Jede Methode ist in der App unter „So lernst du
hier – und warum“ mit Quelle genannt.

| Methode | Umsetzung im Pfad | Beleg |
| --- | --- | --- |
| **Abrufübung** (testing effect): Was man aus dem Gedächtnis holt, hält länger als das, was man erneut liest. | Jeder Schritt nach der Lernkarte ist ein Abruf; es gibt keine reinen Leseschleifen. | Roediger & Karpicke (2006) |
| **Freier Abruf statt Auswahl**: Anspruchsvollerer Abruf wirkt stärker als Wiedererkennen aus Optionen. | „Tippe, wie man das liest“: Die Lesung wird frei eingetippt. Großzügig bei gleichwertigen Schreibweisen (w/v, sch/sh, ja/ya), streng bei genau den Fallen (Н ist nie „h“, Р nie „p“, Г nie „g“). Ratewahrscheinlichkeit praktisch null. | Kang, McDermott & Roediger (2007); Slamecka & Graf (1978) |
| **Verteiltes Wiederholen** und **successive relearning**: Abrufe über Tage verteilt schlagen gehäuftes Üben. | Fächersystem je Buchstabe: richtig → nächstes Fach, fällig nach 1, 3, 7, 14, 30, 60 Tagen; falsch → Fach 1, morgen wieder. Die Auffrischung steht auf der Startseite VOR der nächsten Lektion. Gerechnet wird in lokalen Kalendertagen. | Cepeda et al. (2006); Rawson & Dunlosky (2011); Leitner (1972) |
| **Handschrift**: Wer neue Zeichen schreibt, erkennt sie sicherer als wer sie nur ansieht oder tippt. | Zeichen mit neuer Form werden direkt nach der Lernkarte mit dem Finger nachgefahren; in der Auffrischung werden sie aus dem Gedächtnis geschrieben und an der Vorlage selbst kontrolliert. | Longcamp, Zerbato-Poudou & Velay (2005); Longcamp et al. (2008); Wiley & Rapp (2021) |
| **Vortest und Hyperkorrektur**: Erst raten, dann die Auflösung – sofort korrigierte Irrtümer haften besonders gut. | Bei den sechs „falschen Freunden“ (Н Р С В У Х) wird vor der Lernkarte geraten. Ausdrücklich unbewertet: kein Fehler, keine Strafwiederholung, kein Eintrag im Wiederholungsplan. | Richland, Kornell & Kao (2009); Butterfield & Metcalfe (2001) |
| **Interleaving ähnlicher Elemente**: Verwechselbares nebeneinander macht Unterschiede sichtbar. | In der Auffrischung stehen Verwechslungspartner (И/І, Г/Ґ, Ш/Щ, Ц/Ч, Ю/Я) direkt hintereinander und dienen einander als Distraktoren. | Kornell & Bjork (2008); Carvalho & Goldstone (2014) |
| **Sofortige, erklärende Rückmeldung** | Nach jedem Fehler: Lösung, Begründung, Zerlegung des Wortes; derselbe Inhalt kommt später in anderer Form noch einmal. | Pashler, Cepeda, Wixted & Rohrer (2005) |

Dazu kommen Hör-Aufgaben („Welcher Buchstabe ist das?“) ausschließlich mit
menschlichen Originalaufnahmen. Antworten werden erst freigegeben, wenn der Laut
wirklich zu hören war. Ist keine Aufnahme erreichbar, der Ton ausgeschaltet oder
kommt fünf Sekunden lang nichts, wird derselbe Abruf ohne Ton gestellt; „Ohne
Ton antworten“ steht immer zur Verfügung. `Ь` wird nie über das Ohr abgefragt.

Mehr Lesestoff: 446 Wörter (vorher 323), darunter ukrainische Städte, Länder
und Alltagswörter. Wörter, deren Bedeutung sich nicht aus dem Klang erschließt
(так, вода, вхід), werden nicht geraten, sondern gelesen und getippt; die
Bedeutung steht in der Auflösung.

### Was davon belegt ist – und was nicht

- Belegt ist die Wirkung dieser Methoden **allgemein**, überwiegend an anderen
  Lerninhalten und Lernenden. Dass diese App damit zu besserem oder
  dauerhafterem Lernen führt, ist **nicht gemessen**. Dunlosky et al. (2013)
  stufen Abrufübung und verteiltes Lernen als die beiden am besten belegten
  Techniken ein; die übrigen hier haben eine schmalere Datenbasis.
- Die Handschrift-Studien arbeiten mit Stift und Papier oder Tablet; das
  Nachfahren mit dem Finger auf dem Telefon ist dem ähnlich, aber nicht
  dasselbe.
- Schreiben aus dem Gedächtnis wird per **Selbstkontrolle** bewertet. Eine
  automatische Bewertung freier Handschrift wäre unzuverlässig; die
  Selbsteinschätzung kann zu milde ausfallen.
- Die Merksätze auf den Lernkarten sind sprachliche Eselsbrücken. Gut belegt
  sind in die Buchstabenform eingebettete Bilder (Ehri, Deffner & Wilce 1984;
  Shmidman & Ehri 2010); solche Bilder enthält die App nicht. Reine
  Schlüsselwort-Mnemonik stufen Dunlosky et al. (2013) als wenig nachhaltig ein.
- Die Abstände 1/3/7/14/30/60 Tage sind eine übliche Faustregel, kein für diese
  Lernenden optimierter Plan.

### Quellen

- Butterfield, B., & Metcalfe, J. (2001). Errors committed with high confidence are hypercorrected. *Journal of Experimental Psychology: Learning, Memory, and Cognition, 27*(6), 1491–1494.
- Carvalho, P. F., & Goldstone, R. L. (2014). Putting category learning in order: Category structure and temporal arrangement affect the benefit of interleaved over blocked study. *Memory & Cognition, 42*(3), 481–495.
- Cepeda, N. J., Pashler, H., Vul, E., Wixted, J. T., & Rohrer, D. (2006). Distributed practice in verbal recall tasks: A review and quantitative synthesis. *Psychological Bulletin, 132*(3), 354–380.
- Dunlosky, J., Rawson, K. A., Marsh, E. J., Nathan, M. J., & Willingham, D. T. (2013). Improving students’ learning with effective learning techniques. *Psychological Science in the Public Interest, 14*(1), 4–58.
- Ehri, L. C., Deffner, N. D., & Wilce, L. S. (1984). Pictorial mnemonics for phonics. *Journal of Educational Psychology, 76*(5), 880–893.
- Kang, S. H. K., McDermott, K. B., & Roediger, H. L. (2007). Test format and corrective feedback modify the effect of testing on long-term retention. *European Journal of Cognitive Psychology, 19*(4–5), 528–558.
- Kornell, N., & Bjork, R. A. (2008). Learning concepts and categories: Is spacing the “enemy of induction”? *Psychological Science, 19*(6), 585–592.
- Leitner, S. (1972). *So lernt man lernen.* Freiburg: Herder.
- Longcamp, M., Zerbato-Poudou, M.-T., & Velay, J.-L. (2005). The influence of writing practice on letter recognition in preschool children: A comparison between handwriting and typing. *Acta Psychologica, 119*(1), 67–79.
- Longcamp, M., Boucard, C., Gilhodes, J.-C., Anton, J.-L., Roth, M., Nazarian, B., & Velay, J.-L. (2008). Learning through hand- or typewriting influences visual recognition of new graphic shapes: Behavioral and functional imaging evidence. *Journal of Cognitive Neuroscience, 20*(5), 802–815.
- Pashler, H., Cepeda, N. J., Wixted, J. T., & Rohrer, D. (2005). When does feedback facilitate learning of words? *Journal of Experimental Psychology: Learning, Memory, and Cognition, 31*(1), 3–8.
- Rawson, K. A., & Dunlosky, J. (2011). Optimizing schedules of retrieval practice for durable and efficient learning: How much is enough? *Journal of Experimental Psychology: General, 140*(3), 283–302.
- Richland, L. E., Kornell, N., & Kao, L. S. (2009). The pretesting effect: Do unsuccessful retrieval attempts enhance learning? *Journal of Experimental Psychology: Applied, 15*(3), 243–257.
- Roediger, H. L., & Karpicke, J. D. (2006). Test-enhanced learning: Taking memory tests improves long-term retention. *Psychological Science, 17*(3), 249–255.
- Shmidman, A., & Ehri, L. (2010). Embedded picture mnemonics to learn letters. *Scientific Studies of Reading, 14*(2), 159–182.
- Slamecka, N. J., & Graf, P. (1978). The generation effect: Delineation of a phenomenon. *Journal of Experimental Psychology: Human Learning and Memory, 4*(6), 592–604.
- Wiley, R. W., & Rapp, B. (2021). The effects of handwriting experience on literacy learning. *Psychological Science* (online 29. Juni 2021). https://doi.org/10.1177/0956797621993111

## V7 · Lernpfad: erst zeigen, dann fragen, dann lesen

Bis V6.3 war das Alphabet Lab ein sehr gründliches Prüfwerkzeug – und genau
daran scheiterte die Motivation: Die erste Frage an einen Anfänger betraf ein
Zeichen, das ihm niemand gezeigt hatte, die Startseite war ein Prüfungs-Dashboard
mit null Prozent überall, und nach hunderten Fragen gab es immer noch nichts zu
LESEN. Der Lernpfad ist deshalb der neue Haupteinstieg:

**zeigen → sofort ausprobieren → echte Wörter entziffern → fertig (5–8 Minuten)**

- **8 Lektionen, 33 Buchstaben.** Lektion 1 beginnt mit sechs Zeichen, die fast
  wie im Deutschen funktionieren (А О К М Т Е); danach kommen die „falschen
  Freunde“ (Н Р С, В У Х), neue Formen, die i-Familie, Г/Ґ, die Zischlaute und
  zum Schluss Я Ю Є Ї Ь.
- **Jeder Buchstabe wird erst erklärt** (Lernkarte mit Lautangabe, Merksatz,
  Beispielwort und – wo vorhanden – menschlicher Originalaufnahme) und erst
  danach gefragt. Kein Distraktor zeigt ein Zeichen, das noch nicht dran war.
- **446 echte ukrainische Wörter** (V7: 323), überwiegend Internationalismen (ресторан,
  таксі, шоколад): Wer sie entziffert, versteht sie. Ein Wort erscheint erst,
  wenn JEDER seiner Buchstaben eingeführt ist – die Lektion eines Wortes wird aus
  seinen Buchstaben berechnet, nie von Hand gesetzt.
- **Keine Wiederholung als Füllstoff.** In einem Durchgang kommt kein Schritt und
  kein Wort zweimal vor. Alte Buchstaben werden über NEUE Wörter wiederholt. Das
  Lesetraining besteht nur aus ungelesenen Wörtern; sind sie aufgebraucht, heißt
  der Knopf ehrlich „Wiederholung“ und stellt jedes Wort in einer anderen
  Aufgabenform als beim letzten Mal.
- **Fehler werden Lernmaterial:** Die Auflösung erklärt das Zeichen, und derselbe
  Inhalt kommt ein paar Schritte später genau einmal wieder – in ANDERER
  Aufgabenform, damit nicht die Antwort von eben wiedererkannt wird.
- **Viele Aufgabenformen** statt einer: Laut zum Zeichen, Zeichen zum Laut, Wort
  lesen (Bedeutung), Wort aussprechen (mit Fallen wie „pectopah“ für ресторан),
  Wort finden, Wort aus Plättchen schreiben – seit V7.1 außerdem Lesung frei
  tippen, Buchstaben nachfahren und aus dem Gedächtnis schreiben, Laut hören
  und der Vortest bei den falschen Freunden.
- **Kurztest für Vorwissen:** „Kenne ich schon“ prüft jeden Buchstaben der
  Lektion einmal einzeln und in drei Wörtern. Höchstens ein Fehler – dann zählt
  die Lektion als erledigt; sonst ändert sich nichts.
- **Ton ist Hilfe, nie Sperre:** nur menschliche Originalaufnahmen, kein TTS.
  Ist eine Aufnahme nicht erreichbar, läuft die Lektion ohne sie weiter.

Die adaptive Engine bleibt vollständig erhalten und liegt auf der Startseite
unter „Vertiefen & Prüfen“. Buchstabenantworten aus dem Pfad fließen mit
reduziertem Gewicht als Evidenz in die Engine, und die Buchstaben einer
abgeschlossenen Lektion gelten dort als eingeführt – „Mein Training“ fängt nach
dem Pfad also nicht bei null an.

Technik: Der Pfadfortschritt liegt in einem eigenen kleinen Speicherschlüssel
(`uk-alpha-path-v1`) mit eigener Normalisierung; beschädigte Daten führen zu
einem sauberen Neustart des Pfads, ohne den Engine-Zustand zu berühren.
Fortschritt aus V7 (ohne Wiederholungsplan) wird beim ersten Start übernommen:
Alle schon eingeführten Buchstaben sind dann sofort zur Auffrischung fällig.

Der Lernpfad ist ein eigenes Bundle (`alphabet-path.bundle.js`), das nach dem
App-Bundle lädt und sich in dessen Startseite einhängt: Daten in
`alphabet-path-data.js`, Logik in `alphabet-core-v7-path.js`, Wiederholungsplan
in `alphabet-core-v7-review.js`, Schreibfläche in `alphabet-app-v7-trace.js`,
Oberfläche in `alphabet-app-v7-path.js`. Fehlt das Bundle, startet die App ohne
Lernpfad mit der bisherigen Startseite.

Nicht belegt ist, was nur echte Lernende zeigen können: wie viel nach Tagen und
Wochen hängen bleibt. Die Tests sichern Regeln (Lesbarkeit, keine Wiederholung,
eindeutige Lösungen), keine Lernwirkung.

## Lernprinzip

Der adaptive Weg unter „Vertiefen & Prüfen“ bleibt prüfungsbasiert:

**sehen → erkennen → unterscheiden → hören → erinnern → selbst produzieren → automatisieren**

30 Hauptfragen bleiben 30 unabhängige Hauptfragen. Repairs laufen getrennt, verändern den Hauptscore nicht und zählen nicht wie ein späterer unabhängiger Recall. Recognition-Skills und `writtenProduction` bleiben getrennte Evidenzspuren. `Ь` besitzt keinen erfundenen isolierten Eigenlaut. Human-Audio-Zertifizierung und Audio→Writing verwenden nur menschliche Referenzaufnahmen.

## V6.3 · Abruf statt Wiedererkennung

Vier Antwortoptionen heißen 25 % Trefferquote ohne jedes Wissen, und
Wiedererkennung ist deutlich leichter als Abruf. Für das Behalten über Wochen
zählt aber der Abruf. V6.3 koppelt deshalb die Zahl der Optionen an die bereits
vorhandene Skill-Mastery:

| Mastery | Optionen | Ratewahrscheinlichkeit |
|---|---|---|
| unter 35 % | 4 | 25 % |
| 35–75 % | 6 | 17 % |
| 75–90 % | 8 | 12,5 % |
| ab 90 % | 33 (`alphabet-recall`) | 3 % |

Anfänger starten unverändert mit vier Optionen. Erst wenn ein Skill wirklich
sitzt, verschwindet die Auswahlhilfe schrittweise – auf der höchsten Stufe gibt es
kein engeres Auswahlfeld mehr, sondern das vollständige Alphabet als Raster.
`Ь` bleibt ausgenommen, weil es keinen eigenen isolierten Laut hat.
Kontrastfamilien behalten ihr enges Paar: Dort *ist* die Verwechslung die Aufgabe.

**Dünne Evidenz ist kein Können.** In einer Simulation über 900 Fragen hatte der
Skill `soundToLetter` bei „М" nach 30 Sitzungen drei Versuche, die übrigen
Kernskills 13 bis 23. Ursache war eine Rückkopplung: Drei Versuche, alle richtig,
melden 68 % Mastery und damit wenig Bedarf – ein ehrlich geübter Skill mit echten
Fehlern meldet 53 % und gewinnt jedes Mal. Der ungeübte Skill wurde also gerade
deshalb übersprungen, weil zu wenig über ihn bekannt war. Da die Freischaltung
neuer Buchstaben ein Minimum über *alle* Basisskills verlangt, hielt ein einziger
ausgehungerter Skill den ganzen Buchstaben fest. Skills unterhalb der
Evidenzschwelle, ab der `skillMasteryV4` seinem eigenen Wert traut, bekommen jetzt
einen Bedarfsaufschlag. Wirkung: ausgehungerte Skills pro Lauf von 1,7 auf 0,3,
Skillbalance von 43 % auf 51 %. Der Preis sind rund vier Sitzungen mehr bis zum
vollständigen Alphabet – dafür hat jeder eingeführte Buchstabe in jedem Skill
echte Evidenz.

Verworfen nach Messung: Ein Breitenpfad, der Buchstaben schneller einführt, brachte
nur +1,7 Buchstaben bei 5 Punkten weniger Wissen je Skill und wurde deshalb nicht
übernommen.

## V6.2 · Fragen-Integrität, Wortschatz und Home-Screen-App

V6.2 beantwortet für jede erzeugte Aufgabe eine einzige Frage: **Kann ein deutscher
Anfänger sie aus dem, was er tatsächlich sieht oder hört, eindeutig beantworten?**
`alphabet-core-v62-question-integrity.js` stellt dafür fünf Invarianten her, die
`tests/validate-alphabet-lab-v62-solvability.mjs` für jede Frage prüft:

- **I1 Zielangabe** – Jede Aufgabe, deren Antwort davon abhängt zu wissen, *welcher*
  Buchstabe gemeint ist, nennt ihn im Prompt. Wo die Nennung die Lösung wäre, wird
  über den Ziellaut bzw. die Funktion des Zeichens identifiziert.
- **I2 Eindeutigkeit** – Buchstabenwahl über eine angezeigte Zeichenkette hat genau
  eine passende Option; Wort-, Zähl- und Positionsaufgaben stimmen mit dem
  angezeigten Wort überein.
- **I3 Kein Positionsleak** – Kein Stimulus verrät die Lösung durch seine Position,
  und keine Audiofrage schreibt ihre eigene Lösung als Text daneben.
- **I4 Kein konstanter Erwartungswert** – Keine kategoriale Familie darf über alle
  Buchstaben hinweg überwiegend dieselbe richtige Antwort haben.
- **I5 Optionshygiene** – dublettenfrei, richtige Antwort genau einmal, mindestens
  zwei Optionen.

Zwei Familien sind dauerhaft stillgelegt, weil ihre Aufgabenform keine variierende,
objektiv belegbare Lösung zulässt: `odd-one-out` (die Gruppenzugehörigkeit war für
den Lernenden nicht ableitbar) und `audio-word-position` (pro Buchstabe existiert nur
ein Audiowort, die Antwort war damit konstant). Ersetzt werden sie durch
`confusion-word-choice` (Zielbuchstabe gegen seinen Verwechslungspartner im echten
Wort) und `audio-word-match` (menschliche Wortaufnahme → geschriebenes Wort).

Die Wordbank umfasst 328 echte ukrainische Wörter, mindestens acht pro Buchstaben,
mit Positionsvielfalt (Anfang, Mitte, Ende, mehrfach), soweit die Sprache sie
hergibt – `ц` steht praktisch nie am Wortende, `ь` und `ґ` nie am Wortanfang.
Wortauswahl und Beispielkarten bevorzugen Wörter, die überwiegend aus bereits
eingeführten Buchstaben bestehen.

Für den iPhone-Home-Screen liefert `alphabet-app-v62-pwa.js` Standalone-Erkennung und
einen Update-Hinweis: Eine installierte PWA wird nie geschlossen, lief aber bisher
unbemerkt mit altem HTML gegen einen neueren Service Worker. Es wird nie automatisch
neu geladen – ein Reload mitten in einer Prüfung wäre schlimmer als eine Version
Verzögerung. Die Home-Screen-Icons sind deckend: iOS komponiert transparente Ecken
auf Schwarz, weshalb `ukrainisch-icon-apple-180.png` (180 × 180, randlos) und ein
eigenes Android-Maskable-Icon ausgeliefert werden.

## V6.1-State und Persistenz

Aktueller State: **Schema 6**. Kanonischer Browser-Key ist ausschließlich:

`uk-alpha-lab-v6`

V1/V2/V3/V4/V5-Zustände werden nur als Migrationsquelle gelesen. Nach erfolgreicher Migration wird normal ausschließlich V6 gespeichert. Ein alter Legacy-Key wird nicht dauerhaft gespiegelt.

V6.1 trennt bewusst:

- langfristigen kanonischen Lernzustand,
- begrenzte Diagnose-/History-Logs,
- daraus abgeleiteten State,
- reine Performance-Caches.

Kumulative Aggregate wie unabhängige Hauptantworten und langfristige Production-Coverage dürfen nach History-Truncation oder Reload nicht zurückgehen. Aktuell offene Repairs werden dagegen aus der tatsächlichen Repair-Ledger exakt synchronisiert.

Persistenz ist debounced, wird bei `pagehide`, `visibilitychange`, `beforeunload` und Prüfungsabschluss unmittelbar geflusht und besitzt einen kontrollierten Quota-Fallback. Bei dauerhaft fehlgeschlagenem Speichern erscheint eine kleine sichtbare Warnung statt eines stillen Console-only-Fehlers.

## Adaptive Engine und Production

V4/V5/V6-Lernlogik bleibt erhalten. Die nächste normale adaptive Hauptfrage wird live aus dem aktuellen Zustand gewählt. Pflichtskills bleiben getrennt; schwaches Audio oder eine konkrete Verwechslung kann nicht durch einen starken Case-Skill verdeckt werden.

Freie Production wird erst nach einem Recognition-/Audio-/Retention-Gate freigeschaltet und läuft außerhalb des objektiven Hauptscores. Unterstützt werden u. a.:

- Visual Memory → Writing
- Sound → Writing
- Human Audio → Writing
- Confusion → Writing
- Case → Writing

Selbstbewertung: `Passt`, `Fast / unsicher`, `Nochmal`. Production-Repairs bleiben separate Repairs. Die Oberfläche bezeichnet langfristige Coverage als **ausprobiert**; erfolgreiche Pass-Coverage wird separat im State geführt.

## Build

Die produktive App wird deterministisch aus Source-Dateien erzeugt:

- `alphabet-lab.template.html` → `alphabet-lab.html`
- `alphabet-lab-sw.template.js` → `alphabet-lab-sw.js`
- Core-Sources → `alphabet-core.bundle.js`
- App-Sources → `alphabet-app.bundle.js`
- Lernpfad-Sources → `alphabet-path.bundle.js`
- Build-Metadaten → `alphabet-build.json`

Unverändert ausgeliefert, aber Teil der Build-ID: `ukrainischkurs-native-audio.js`.

Die Bundles enthalten seit V7 keine reinen Kommentar- und Leerzeilen und keine
Code-Einrückung mehr. Der Build erkennt dafür Strings, Regex-Literale,
Kommentare und verschachtelte Template-Literale; Zeilen innerhalb eines
Template-Literals bleiben Byte für Byte erhalten, und endet eine Datei nicht im
Code, bricht der Build ab, statt zu raten. `validate-alphabet-lab-v6-build.mjs`
prüft unabhängig davon, dass die Bundles eine Teilfolge der Quellzeilen sind und
nichts außer Kommentar- und Leerzeilen fehlt.

Build:

```bash
node scripts/build-alphabet-lab.mjs
```

Konsistenzprüfung ohne Schreiben:

```bash
node scripts/build-alphabet-lab.mjs --check
```

Der Build ist byte-deterministisch. `alphabet-build.json` enthält App-Version, Schema-Version, Aggregate-Schema, Build-ID und Bundle-Digests. Die Build-ID wird aus den tatsächlichen Source-Inhalten abgeleitet; es wird keine Uhrzeit eingebaut.

## Service Worker und Offline

HTML und kritische lokale Assets verwenden dieselbe Build-ID. Bundles werden mit `?v=<buildId>` angefordert und in einem Build-spezifischen Cache gespeichert. Damit darf ein neues HTML nicht unbemerkt alte Core-/App-Bundles erhalten.

Offline gilt weiterhin:

- bereits installierte App-Hülle und kritische lokale Assets starten aus dem Cache,
- fehlendes JavaScript bekommt niemals HTML als Ersatz,
- externe Wikimedia-Human-Audioquellen werden nur bedarfsgesteuert gecacht und dürfen technisch ausfallen, ohne einen Benutzerfehler zu erzeugen.

## Tests und Performance

Die Haupt-CI prüft in Reihenfolge A1/Kurs, Alphabet-Legacy, V2, V3, V4, V5 und anschließend V6.1. V6.1 ergänzt explizite Tests für:

- langlebige Aggregate trotz begrenzter Logs,
- sofortige Repair-/Readiness-Invalidierung,
- neueste statt älteste Exam-History,
- Migration und lokale Tagesgrenzen,
- deterministischen Build und stale Artefakte,
- Long-run Fuzz/Invarianten,
- Wordbank/Unicode/Human-Audio-Metadaten,
- Service-Worker-Generationen und Offline-Fallback,
- Mastery/Unlock und viele feste Seeds,
- Storage/Quota/Pagehide/Reset/Double-click,
- Audio-Lifecycle und verspätete Events,
- Chromium Desktop sowie WebKit mit iPhone-Viewport,
- getrennte Chromium-Performance-Budgets.

Playwright ist über `package-lock.json` reproduzierbar gepinnt. CI verwendet `npm ci`; kein `@latest`.

Die Budgets stehen in `tests/performance-budget.json`. Gemessen werden u. a. Bundle-Größe, initiale JS-Requests, App-ready/Interactive, Renderpfade, Question Generation, Production Readiness/Quota, State-Serialisierung, LocalStorage-Schreibzeit und Long Tasks.

V7 ergänzt `tests/validate-alphabet-lab-v7-path.mjs` (genau 33 Buchstaben,
Lesbarkeit jedes Wortes, kein doppelter Schritt und kein doppeltes Wort je
Durchgang, genau eine richtige Option, keine noch nicht gezeigten Distraktoren,
Wiederholung nach Fehlern in anderer Aufgabenform, Lesetraining nur mit
ungelesenen Wörtern, Kurztest-Regeln, Speichern/Laden, beschädigte Daten) und
`tests/alphabet-lab-v7-path.spec.mjs` (der Pfad im echten Browser: Lernkarte vor
der ersten Frage, Fehler und spätere Wiederholung, Lesetraining, Kurztest,
Abbruch, beschädigter Speicher, Tastatur, 320 px ohne Überlauf und mit
ausreichenden Touchflächen in allen Aufgabenformen, Start ohne Datendatei).
Die Budgets für Core- und App-Bundle sind unverändert; das Lernpfad-Bundle hat
ein eigenes zusätzliches Budget.

V7.1 erweitert beide Dateien: Tipp-Abruf (gültige Schreibweisen, über 300
automatisch erzeugte Lookalike-Fallen, die alle abgelehnt werden müssen),
Wiederholungsplan (Abstände, Rückfall bei Fehlern, Kalendertage, Übernahme alten
Fortschritts, beschädigte Daten), Reihenfolge der Auffrischung, Bewertung des
Nachschreibens, Vortest und Schreibfläche in den Lektionen – und im Browser:
Vortest ohne Wertung, Tippen mit Falle und Schreibvarianten, Nachschreiben mit
Überspringen, Auffrischung über Tage, Selbstkontrolle, Hören mit und ohne
erreichbare Aufnahme (die Wiedergabe selbst nur in Chromium), alles auch auf
320 px. Die Pfad-Tests laufen ohne Service Worker, damit externe Aufnahmen nicht
am Test vorbei aus dem echten Netz geladen werden.

Der Readiness-Cache ist seit V7 zusätzlich an den Tag gebunden. Vorher galt er
allein über die Revisionsnummer und lieferte nach Tagen ohne neue Antwort einen
veralteten Stand – der Fuzz-Test, der mit fester Testuhr gegen die echte Uhr der
Migration verglich, schlug deshalb rund zwei Monate nach seinem Entstehen fehl.

V6.3 ergänzt `tests/validate-alphabet-lab-v63-retrieval.mjs` (Optionsleiter
monoton, Anfängerschutz auf Stufe 0–1, Kontrastpaare unverändert,
Vollalphabet-Abruf für genau 32 Buchstaben, dünn belegte Skills haben mehr
Bedarf als gut belegte).

V6.2 ergänzt `tests/validate-alphabet-lab-v62-solvability.mjs` (Lösbarkeit jeder
Frage, erzwungen über alle Familien und live über den produktiven Selektor) und
`tests/alphabet-lab-v62-pwa-mobile.spec.mjs` (Manifest, Apple-Metadaten,
Icon-Deckkraft, Standalone-Erkennung, Update-Hinweis, Safe Areas, Touchflächen und
horizontales Scrollen auf 320/375/430 px).

Der Node-Performance-Benchmark lädt seit V6.2 denselben Core-Stack, der auch
ausgeliefert wird; vorher maß er eine Teilmenge ohne die Fragen-Integritätsschicht.

Ein grüner Validator beweist die getesteten technischen und fachlichen Invarianten, nicht automatisch empirische Lernwirkung. Ein physischer iPhone-Test ist damit ausdrücklich nicht ersetzt.

## Debugmodus

`alphabet-lab.html?debugLearning=1` aktiviert zusätzliche Diagnose-Hooks für Tests/Entwicklung. Dort können u. a. App-/Schema-/Build-Version, Storage-Key, State-Größe, Persist-Fehler und aktuelle Session-/Selection-Daten geprüft werden. Es werden keine sensitiven externen Daten hinzugefügt.

## A1-Kurs

`ukrainischkurs-app.html` bleibt der große A1-Kurs. Das V6.1-Hardening verändert dessen Lernpfad nicht. Der bestehende `build-app-shell.yml` besitzt weiterhin absichtlich seine historische Auto-Commit-Strategie ausschließlich für die A1-App-Hülle; der Alphabet-Lab-V6.1-Build-Check selbst ist read-only.
