# Aktueller Fokus: Alphabet Lab V4

Dieses Repository enthält weiterhin den vollständigen Ukrainisch-A1-Kurs. Der aktuelle Haupteinstieg ist jedoch bewusst das **Alphabet Lab**: eine statische, installierbare GitHub-Pages-App für deutschsprachige Anfänger, die zuerst ausschließlich die **33 ukrainischen Buchstaben** sicher beherrschen sollen.

Start: `alphabet-lab.html` bzw. die Repository-Root. Der vollständige spätere Kurs bleibt unter `ukrainischkurs-app.html` erreichbar.

## Lernprinzip

Der Hauptweg folgt bewusst einer prüfungsbasierten Führerschein-Lernlogik:

**Abrufen → Fehler erkennen → getrennt reparieren → später unabhängig erneut abrufen → langfristig wiederholen → automatisieren**

V4 wählt die nächste Hauptfrage erst nach der vorherigen Antwort. Fehler, aktuelle Skill-Mastery, offene Repairs, SRS-Fälligkeit, Confusions, Reaktionszeit, Evidenzmenge und bisherige Aufgabenvielfalt beeinflussen damit noch innerhalb derselben Session die nächste Auswahl.

Eine unmittelbar richtige Reparatur ist nur kurzfristige Evidenz und zählt **nicht** wie ein späterer unabhängiger Abruf.

## Mein Training

Der Standardweg ist **MEIN TRAINING STARTEN** mit 20 adaptiven Hauptfragen.

Die App pflegt ein persistentes aktuelles Lernfeld mit typischerweise etwa 4–8 Buchstaben. Sichere Buchstaben blockieren den Fortschritt nicht; fällige ältere Buchstaben können sofort wieder als Review oder Schwäche zurückkehren. `LEARN_ORDER` bleibt das Grundgerüst für neue Zeichen, vorhandenes Diagnosewissen wird aber berücksichtigt.

Die Auswahlpipeline ist:

1. aktuelles Lernfeld / Due-Reviews / Kontrollzeichen bewerten,
2. Buchstabenbedarf bestimmen,
3. schwächsten sinnvollen Skill bestimmen,
4. Schwierigkeit **für diesen Skill** bestimmen,
5. passende Aufgabenfamilien auswählen,
6. kürzlich benutzte Familien, Wörter, Fonts und Signaturen abwerten bzw. blockieren,
7. erst dann die konkrete Aufgabe erzeugen.

`?debugLearning=1` zeigt für Entwicklungszwecke unter jeder Frage unter anderem Buchstabe, Skill, Mastery, Need-Score, Familie, Schwierigkeit, Auswahlgrund und Signatur.

## Skill-Mastery und Difficulty

Pflichtskills bleiben getrennt:

- Zeichen → Laut
- Laut → Zeichen
- Groß/Klein
- Audio → Zeichen
- Verwechslungsunterscheidung

Zusätzliche Evidenz kommt unter anderem aus Schnellerkennung, visuellem Finden, Kurzgedächtnis und Schreiben.

Ein Buchstabe kann deshalb beispielsweise visuell sehr stark, auditiv aber weiterhin schwach sein. V4 trainiert dann vor allem Audio und relevante Confusions statt erneut massenhaft Groß/Klein abzufragen.

Schwierigkeit steigt pro Skill von klarer Einführung und einfachen Optionen über Worttransfer und Kontraste bis zu Font-Transfer, Flash-Recognition, Pseudowörtern, Gedächtnis und Schreiben aus Erinnerung.

## Aufgabenvielfalt und Anti-Repetition

V4 besitzt mehr als 30 definierte Aufgabenfamilien, darunter Zeichen→Laut, Laut→Zeichen, Human-Audio→Zeichen, Groß/Klein, Pair Match, visuelles Finden, Multi-Select, Zeichen zählen, Wortposition, fehlender Buchstabe, Word Contains, Word Choice, direktes Antippen, Mehrfachvorkommen, Bildanker, ungehighlightete Wörter, Pseudowörter, Silben, Sound-/Visual-Contrast, Latin Trap, Same/Different, Font Recognition, Flash, Memory, Odd One Out, Fehlerkorrektur, Reverse Fake Friend, Audio-Wortposition und Schreiben aus Erinnerung.

Jede Hauptfrage erhält eine kognitive Signatur aus Buchstabe, Skill, Familie/Variante, Stimulus, Wort, Font, Confusion und Interaktion. Nur eine andere Promptformulierung macht daraus **keine** neue Aufgabe. Auch eine bloß neu gemischte Antwortreihenfolge kann eine Dublette nicht verstecken.

Innerhalb adaptiver Sessions werden identische Signaturen blockiert. Wiederholte Wörter und Prompt-/Family-Muster erhalten starke Neuartigkeitsstrafen. Nach zwei identischen Familien in Folge sucht die Engine gezielt eine andere didaktisch gültige Familie desselben Skills. Derselbe Buchstabe darf in normalen Mixed Sessions nicht als lange Spam-Sequenz dominieren.

## Wortbank und visueller Transfer

`alphabet-wordbank-v4.js` enthält **198 geprüfte Buchstabenkontexte: sechs pro jedem der 33 Zeichen**. Zielpositionen werden aus dem tatsächlichen Unicode-Wort berechnet und automatisch getestet. Russische Exklusivzeichen wie `ы`, `э`, `ё` und `ъ` sind ausgeschlossen.

Wörter sind ausschließlich Transfermaterial für Buchstabenerkennung, **kein Vokabeltest**. Übersetzung und kleine Emoji/Piktogramm-Anker dienen nur als Gedächtnishilfe. Eine deutsche Wortbedeutung beeinflusst die Alphabet-Mastery nicht.

Die Wortauswahl bevorzugt in frühen Phasen Kontexte, deren übrige Buchstaben bereits eingeführt wurden, und wechselt innerhalb einer Session möglichst zu noch nicht verwendeten Beispielen.

## Spezielle Buchstabenpädagogik

Alle 33 Zeichen besitzen eine zentrale V4-Pädagogikkonfiguration mit sinnvollen Confusions und Lerntempo. Leichte Zeichen wie А, О, М und К wechseln nach sicherer Basis schneller zu Transfer, Speed und unterschiedlichen Kontexten. Schwierige Zeichen wie Ґ, Є, Ж, И, Ї, Й, Ц, Ч, Ш, Щ und Ь werden langsamer und kontrastreicher aufgebaut.

`Ь` ist ausdrücklich ein Sonderfall: Es wird **nicht als normaler Lautbuchstabe** trainiert. V4 nutzt dafür Kontext, Wortposition, Einsetzen, Finden, Form-/Funktionsunterscheidung und Schreiben.

## Ehrliche Prüfungsscores und Repairs

Eine 30er Lernprüfung bedeutet weiterhin **30 Hauptfragen**. Reparaturen laufen separat und verändern den Hauptscore nicht.

Jeder Ursprungsfehler besitzt in V4 eine eigene Zuordnung über `repairId`, `originAttemptId`, `originLetter` und `originSkill`. Eine Reparatur kann dadurch keinen anderen offenen Fehler desselben Buchstabens versehentlich schließen.

Repairs erzeugen keinen normalen Retention-Day, keinen normalen SRS-Sprung und keinen Certification-Pass. Die normale adaptive Engine darf den zugrunde liegenden Skill später zusätzlich in einer anderen unabhängigen Form erneut prüfen.

## Audio

Die menschlichen Referenzaufnahmen stammen aus `ukrainischkurs-native-audio.js` und verweisen auf Wikimedia Commons. In gewerteten Audio-Prüfungen und Audio-Certification zählt nur erfolgreich abgespieltes **menschliches Audio**. TTS ist ausschließlich ein freiwilliger Lern-Fallback außerhalb solcher Zertifizierungen.

Technische Audiofehler sind kein Benutzerfehler. Pro Stimulus gibt es ein begrenztes Retry-Budget. Nach dauerhaftem Ausfall wechselt normales Lernen zu einer Nicht-Audioaufgabe; eine Audio-Certification wird stattdessen als technisch unvollständig markiert und kann dadurch nicht fälschlich bestehen.

## Mastery

Ein guter Gesamtdurchschnitt darf keinen schwachen Pflichtskill verdecken. Der Status „Sicher“ verlangt pro Buchstabe ausreichende Evidenz und Confidence in allen Pflichtskills, mehrere unabhängige erfolgreiche Tage, erledigtes Schreiben und keine offenen Repairs.

Globales `UKRAINISCHES ALPHABET GEMEISTERT` verlangt zusätzlich kontrollierte Abschlussprüfungen, Fake-Friend-Mastery, 33/33-Audio-Coverage mit menschlichen Quellen, Langzeit-Retention und ausreichende Automatisierung. Ein einzelner ungelöster Buchstabe blockiert den Abschluss.

Leichte Find-Aufgaben besitzen geringeres Evidenzgewicht und können einen Buchstaben nicht allein bis zur Mastery „hochfarmen“.

## Offline und Persistenz

Die App-Hülle, V3-Basis, V4-Lernengine, Wortbank, Manifest und lokale Assets werden als PWA gecacht. **Menschliche Audioquellen liegen extern auf Wikimedia und benötigen gegebenenfalls Netzwerkzugriff.** Der Service Worker unterscheidet Navigation von JS/Manifest/Assets; eine fehlgeschlagene JavaScript-Anfrage darf niemals HTML als Fallback erhalten.

Fortschritt liegt weiterhin unter dem kompatiblen Browser-Key `uk-alpha-lab-v3`, der gespeicherte Zustand selbst besitzt aber **Schema-Version 4**. V1-, V2- und V3-Lernstände werden ohne Reset migriert. Alte Antworten ohne verlässliche Zeitmessung werden nicht künstlich als getimte Speed-Evidenz übernommen.

## Vollständiger A1-Kurs

Der bestehende große Kurs bleibt vollständig erhalten unter `ukrainischkurs-app.html`. Dazu gehören u. a. der frühere geführte Alphabetpfad, adaptives SRS, Lesebrücken, Grammatik, Hören, Schreiben, Sprechen, A1-Prüfung und spätere A1/A1+-Module. Diese Bereiche werden durch das Alphabet Lab nicht automatisch freigeschaltet oder in das Alphabet Lab gemischt.

Wichtige bestehende Module bleiben unter anderem:

- `ukrainischkurs-adaptive-srs.js`
- `ukrainischkurs-learning-core.js`
- `ukrainischkurs-learning-state-guard.js`
- `ukrainischkurs-adaptive-alphabet.js`
- `ukrainischkurs-alphabet-proof.js`
- `ukrainischkurs-guided-start.js`

## Qualitätssicherung

CI behält sämtliche bisherigen Kurs-, A1-, Legacy-, V2- und V3-Regressionen. Die V4-Suite ergänzt unter anderem:

- exakt 33 ukrainische Zeichen und keine russischen Exklusivzeichen,
- Wordbank-Validierung für 198 Kontexte,
- V1/V2/V3→V4-Migration,
- Active-Learning-Set und Unlock-Logik,
- Skill-spezifische Need- und Difficulty-Berechnung,
- 50 deterministische 20-Fragen-Focused-Sessions für А,
- 100 deterministische normale Adaptive-Sessions,
- eindeutige Question-Signatures und Family-/Letter-Run-Grenzen,
- Word-Variation und Overexposure,
- Live-Adaptivität innerhalb derselben Session,
- Repair-ID-Isolation,
- präzise Latin-Trap-Erkennung,
- begrenzte Audio-Retries und technische Certification-Incompleteness,
- gesonderte Ь-Behandlung,
- vier mehrstufige Joel-Persona-Simulationen.

Zusätzlich läuft Playwright gegen die echte statische App in **Desktop-Chromium** und **iPhone-WebKit** und prüft Startseite/Lernfeld, adaptives Training, Multi-Select, Wort-/Bildaufgabe, Repair-UI, Audio-Control, Ergebnis, Reload/Persistenz, Service Worker und mobiles Overflow-Verhalten.

Ein grüner Validator beweist technische Konsistenz der geprüften Regeln, nicht automatisch empirische Lernwirkung. Die reale Lernwirkung muss weiterhin mit echten Nutzern und verzögerten Retentionstests beobachtet werden.
