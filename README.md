# Aktueller Fokus: Alphabet Lab V5

Dieses Repository enthält weiterhin den vollständigen Ukrainisch-A1-Kurs. Der aktuelle Haupteinstieg ist jedoch bewusst das **Alphabet Lab**: eine statische, installierbare GitHub-Pages-App für deutschsprachige Anfänger, die zuerst ausschließlich die **33 ukrainischen Buchstaben** sicher beherrschen sollen.

Start: `alphabet-lab.html` bzw. die Repository-Root. Der vollständige spätere Kurs bleibt unter `ukrainischkurs-app.html` erreichbar.

## Lernprinzip

Der Hauptweg folgt einer prüfungsbasierten Führerschein-Lernlogik:

**sehen → erkennen → unterscheiden → hören → erinnern → selbst produzieren → automatisieren**

Fehler werden getrennt repariert und später unabhängig erneut abgerufen. V5 baut auf der live-adaptiven V4-Engine auf und führt freie Zeichenproduktion erst ein, wenn der jeweilige Buchstabe genügend Recognition-, Reverse-, Audio- und Kontext-Evidenz besitzt.

Eine unmittelbar richtige Reparatur ist nur kurzfristige Evidenz und zählt **nicht** wie ein späterer unabhängiger Abruf.

## Mein Training

Der Standardweg ist **MEIN TRAINING STARTEN** mit 20 adaptiven, objektiv automatisch bewerteten Hauptfragen.

Die App pflegt ein persistentes aktuelles Lernfeld mit typischerweise etwa 4–8 Buchstaben. Sichere Buchstaben blockieren den Fortschritt nicht; fällige ältere Buchstaben können sofort wieder als Review oder Schwäche zurückkehren. Neue Buchstaben werden nicht stumpf nach Tagen freigeschaltet: Seit der letzten Einführung müssen normalerweise genügend unabhängige Hauptfragen vergangen sein und der zuletzt neue Buchstabe muss erste Abrufe besitzen oder das Lernfeld außergewöhnlich stabil sein.

Die Auswahlpipeline ist:

1. aktuelles Lernfeld / Due-Reviews / Kontrollzeichen bewerten,
2. Buchstabenbedarf bestimmen,
3. schwächsten sinnvollen Skill bestimmen,
4. Schwierigkeit **für diesen Skill** bestimmen,
5. passende Aufgabenfamilien auswählen,
6. kürzlich benutzte Familien, Wörter, Fonts und Signaturen abwerten bzw. blockieren,
7. optional eine didaktisch freigeschaltete Production-Aufgabe einstreuen,
8. erst dann die konkrete Aufgabe erzeugen.

`?debugLearning=1` aktiviert ausschließlich für Entwicklung zusätzliche Diagnose-/E2E-Hooks.

## Skill-Mastery und Difficulty

Pflichtskills bleiben getrennt:

- Zeichen → Laut
- Laut → Zeichen
- Groß/Klein
- Audio → Zeichen
- Verwechslungsunterscheidung

Zusätzliche Evidenz kommt unter anderem aus Schnellerkennung, visuellem Finden und Kurzgedächtnis. V5 ergänzt bewusst separat:

- `writtenProduction`

Freies Schreiben ist damit **keine Variante von Recognition**, sondern eine eigene Kompetenz mit eigener Confidence, Due-Zeit, Retention, Repairs und Verlauf.

Ein Buchstabe kann beispielsweise visuell sehr stark, auditiv aber weiterhin schwach sein. Die Engine trainiert dann vor allem Audio und relevante Confusions statt erneut massenhaft Groß/Klein abzufragen.

## Freie Zeichenproduktion V5

Production wird erst freigeschaltet, wenn sie didaktisch sinnvoll ist. Ein völlig neuer Buchstabe bekommt keine Audio→Zeichnen-Aufgabe.

Das Gate berücksichtigt unter anderem:

- Zeichen→Laut-Mastery,
- Laut→Zeichen-Mastery,
- Audio→Zeichen-Mastery,
- mehrere unabhängige Hauptversuche,
- erfolgreiche unterschiedliche Aufgabenfamilien,
- bereits vorhandene normale Schreib-/Formpraxis,
- offene schwere Repairs,
- bei schwierigeren Buchstaben zusätzliche Confidence bzw. verteilte Lerntage.

Aktuelle Production-Familien:

- **Visual Memory → Writing:** Buchstabe kurz sehen, Vorlage verschwindet, danach zeichnen.
- **Sound → Writing:** Lautbeschreibung sehen, ohne sichtbaren Zielbuchstaben zeichnen.
- **Human Audio → Writing:** echte menschliche Referenz hören, anschließend ohne Antwortoptionen zeichnen.
- **Confusion → Writing:** problematische Verwechslungsgruppe ohne Multiple Choice abrufen.
- **Case → Writing:** Groß- oder Kleinform selbst produzieren.

Die Handschrift wird aktuell bewusst **nicht automatisch als korrekt behauptet**. Nach `Jetzt vergleichen` sieht der Nutzer seine Zeichnung und die Referenz und bewertet selbst:

- `Passt`
- `Fast / unsicher`
- `Nochmal`

`Passt` liefert positive Production-Evidenz, `Fast / unsicher` nur Teil-Evidenz und `Nochmal` erzeugt eine spätere Reparatur. Ein einzelnes `Passt` kann Production-Mastery nicht hochfarmen.

Canvas-Metriken wie Stroke-Anzahl, Dauer und Bounding Box können temporär für eine spätere Formanalyse erfasst werden, fließen aber **nicht** als automatische Handschriftnote in Mastery ein.

## Production-Repairs und Score-Trennung

Freie Production läuft außerhalb des objektiven Prüfungsscores. Ein Ergebnis wie `18/20` besteht ausschließlich aus objektiv automatisch bewertbaren Hauptfragen. Selbstbewertete Zeichnungen können daraus weder `19/20` noch `17/20` machen.

Production-Ergebnisse werden separat zusammengefasst. Bei `Nochmal` wird eine Reparatur nach mehreren anderen Hauptfragen eingeplant. Reicht die Session dafür nicht mehr, bleibt sie persistent offen und wird in einer späteren Session mit Abstand rekonstruiert.

Production-Repairs zählen nicht als unabhängiger langfristiger Erstabruf.

## Session-Mix

Normale Sessions bleiben überwiegend Recognition-/Transfer-Training. Production wird abhängig vom Lernstand eingestreut:

- Anfänger: keine oder höchstens sehr wenige freie Aufgaben,
- mittlerer Stand: einige Production-Aufgaben,
- fortgeschritten: regelmäßig Production, aber weiterhin begrenzt,
- 20-Minuten-Intensivmodus: keine Production im frühen Warm-up, später zunehmend mehr in Active/Mixed/Automation.

Ein eigener Production-Test wird erst verfügbar, wenn genügend Buchstaben `writtenProductionReady` erfüllen; vorgesehen sind 5er-, 10er-, 20er- und später umfassendere Checks.

## Aufgabenvielfalt und Anti-Repetition

Die App besitzt mehr als 30 Recognition-/Transfer-Familien plus die neuen Production-Familien. Jede Hauptfrage erhält eine kognitive Signatur aus Buchstabe, Skill, Familie/Variante, Stimulus, Wort, Font, Confusion und Interaktion. Nur eine andere Promptformulierung macht daraus **keine** neue Aufgabe.

Auch Production besitzt eigene Signaturen und Same-Letter-/Same-Family-Bremsen. Dadurch soll kein Muster wie `А zeichnen → А zeichnen → А zeichnen` entstehen.

## Wortbank und Anfänger-Gates

`alphabet-wordbank-v4.js` enthält **198 geprüfte Buchstabenkontexte: sechs pro jedem der 33 Zeichen**. Zielpositionen werden aus dem tatsächlichen Unicode-Wort berechnet und automatisch getestet. Russische Exklusivzeichen wie `ы`, `э`, `ё` und `ъ` sind ausgeschlossen.

Wörter sind ausschließlich Transfermaterial für Buchstabenerkennung, **kein Vokabeltest**. Übersetzung und kleine Emoji/Piktogramm-Anker dienen nur als Gedächtnishilfe.

V5 verschärft frühe Wortgates:

- Difficulty 0: keine unbekannten Nebenbuchstaben,
- Difficulty 1: höchstens ein unbekannter Nebenbuchstabe,
- Difficulty 2: wenige unbekannte Zeichen,
- Difficulty 3+: natürliche freie Wortwahl.

Existiert kein didaktisch geeignetes Wort, wechselt die Engine die Aufgabenfamilie statt ein unnötig schweres Wort zu erzwingen. Auch negative `word-contains`-Stimuli verwenden Novelty-/Exposure-Logik.

## Spezielle Buchstabenpädagogik

Alle 33 Zeichen besitzen zentrale Pädagogikdaten mit sinnvollen Confusions und Lerntempo. Schwierige Zeichen wie Ґ, Є, Ж, И, Ї, Й, Ц, Ч, Ш, Щ und Ь werden langsamer und kontrastreicher aufgebaut.

`Ь` ist ausdrücklich ein Sonderfall: Es besitzt keinen eigenen Laut. Es erhält niemals eine isolierte Audio→Writing-Aufgabe; Audio wird nur sinnvoll über Kontext und Weichheitsfunktion geprüft.

## Audio

Die menschlichen Referenzaufnahmen stammen aus `ukrainischkurs-native-audio.js` und verweisen auf Wikimedia Commons. In gewerteten Audio-Prüfungen und bei **Audio→Writing** werden nur echte menschliche Quellen akzeptiert. TTS ist ausschließlich ein freiwilliger Lern-Fallback außerhalb solcher Prüfungen.

Technische Audiofehler sind kein Benutzerfehler. Nach begrenzten Retries wird normales Lernen durch eine passende Nicht-Audioaufgabe ersetzt; Zertifizierungen werden bei unvollständiger Human-Audio-Abdeckung nicht fälschlich bestanden.

## Mastery V5

Ein guter Gesamtdurchschnitt darf keinen schwachen Pflichtskill verdecken. Für Anfänger bleibt noch gesperrte Production neutral: `noch nicht sinnvoll` ist nicht dasselbe wie `schlecht`.

Sobald Production didaktisch freigeschaltet ist, entwickelt sie sich separat von `offen` über `im Aufbau` bis `stabil`.

Globales `UKRAINISCHES ALPHABET GEMEISTERT` kann langfristig **nicht mehr allein durch Multiple Choice** erreicht werden. Zusätzlich zu den bisherigen V4-Gates verlangt V5 repräsentative freie Production-Evidenz über mehrere Buchstaben und Tage, Human-Audio→Writing auf mehreren Zeichen, freie Abrufe bei problematischen Fake Friends und keine offenen schweren Production-Repairs.

## Offline und Persistenz

App-Hülle, V3-Basis, V4-Lernengine, V5-Production-Module, Wortbank, Manifest und lokale Assets werden als PWA gecacht. **Menschliche Audioquellen liegen extern auf Wikimedia und benötigen gegebenenfalls Netzwerkzugriff.** Der Service Worker liefert niemals HTML als Fallback für fehlgeschlagenes JavaScript.

Der kompatible Browser-Key bleibt `uk-alpha-lab-v3`; der gespeicherte Zustand besitzt jetzt **Schema-Version 5**. V1-, V2-, V3- und V4-Lernstände werden ohne Fortschrittsverlust migriert.

## Vollständiger A1-Kurs

Der bestehende große Kurs bleibt vollständig erhalten unter `ukrainischkurs-app.html`. Alphabet Lab V5 verändert dessen Lernpfad, Prüfungsgrenzen und Module nicht.

## Qualitätssicherung

CI behält sämtliche bisherigen Kurs-, A1-, Legacy-, V2-, V3- und V4-Regressionen. V5 ergänzt insbesondere automatische Tests für:

- Production-Gates und Audio→Writing-Freischaltung,
- `Ь` ohne isolierte Audio-Production,
- Visual-Memory-/Sound-/Audio-/Confusion-/Case-Writing,
- dreistufige Selbstbewertung,
- verzögerte und persistente Production-Repairs,
- strikte Trennung vom objektiven Hauptscore,
- Anfänger- vs. Fortgeschrittenen-Sessionmix,
- Production-Diversity und Relapse,
- strengere Wortgates und negative Wortvariation,
- Progressionsbremse für neue Buchstaben,
- V1/V2/V3/V4→V5-Migration,
- finale Mastery, die nicht nur mit Multiple Choice erreichbar ist,
- mehrere virtuelle Lerntage,
- Persona A absoluter Anfänger,
- Persona B fünf mittelstarke Buchstaben,
- Persona C sehr starkes А,
- Persona D Р/P Fake Friend,
- Persona E Ш/Щ,
- Persona F fast komplettes Alphabet.

Playwright läuft gegen die echte statische App in **Desktop-Chromium** und **iPhone-WebKit** und prüft zusätzlich echte Canvas-Production, verborgenes Referenzzeichen, Selbstkontrolle, Human-Audio→Writing, Score-Trennung, Reload/Persistenz, Service Worker und mobiles Overflow-Verhalten.

Ein grüner Validator beweist technische Konsistenz der geprüften Regeln, nicht automatisch empirische Lernwirkung. Die reale Lernwirkung muss weiterhin mit echten Nutzern und verzögerten Retentionstests beobachtet werden.
