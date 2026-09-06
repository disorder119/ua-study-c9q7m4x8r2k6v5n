# Ukrainischkurs für Joel

Installierbare Lern-App für Ukrainisch, optimiert für einen deutschsprachigen absoluten Anfänger. Fortschritt wird lokal gespeichert.

## Lernweg

Die Alphabetphase arbeitet nach **14+ Mastery**: 14 Tage sind das schnellste Zieltempo, keine Deadline. Tage 1–11 führen höchstens drei neue Zeichen pro Kalendertag ein; danach folgen Kontrast, Automatisierung und Checkpoint. Bei Lücken entstehen zusätzliche Festigungstage.

Die Alphabetfreigabe verlangt mehrere unabhängige Nachweise: 33-Zeichen-Check, Hör-Diktat, Verwechslungstest, mehrtägige Retention, isolierte Kleinbuchstaben, Laut→Zeichen-Abruf und zusätzliche 3-Tage-Retention für besonders schwierige Zeichen.

## Aussprache

Alle 33 Alphabetzeichen besitzen eine menschliche ukrainische Referenz auf Wikimedia Commons. Der Coach kombiniert IPA, konkrete Artikulationshinweise, Referenzhören, Mikrofonaufnahme, eigenes Rückhören, A/B-Vergleich, optionalen ukrainischen SpeechRecognition-Check und verteilte Lautwiederholung. System-TTS bleibt technischer Fallback.

## Vom Alphabet zum echten Lesen

Nach der Alphabetphase folgen zwei Pflichtstufen:

1. **Lese- und Aussprachebrücke** für Betonung, weiche Konsonanten, І/Я/Ю/Є/Ь, Apostroph und Ї.
2. **Variabler Lese-Transfer**: Pro Versuch werden 20 Aufgaben zufällig aus einem größeren Pool von Silben, kontrollierten Nicht-Vokabel-Zeichenketten und einfachen unbekannten Wörtern gezogen. Bedeutung soll beim Dekodieren nicht helfen. Bestehen ab 18/20 im ersten Durchgang; Fehler werden danach repariert.

## Adaptives Wiederholen

Das SRS speichert Lerntage, Intervall, Ease, Rückfälle und Problemstatus. Neue oder fehlerhafte Karten kommen eng zurück; stabile Karten erhalten wachsende Abstände bis maximal 90 Tage. Wiederholte Problemkarten werden als **Schwierig** priorisiert.

Eine richtige Antwort unmittelbar nach einem Fehler ist nur **Reparatur**. Sie erhöht die Langzeitstufe nicht und muss am Folgetag erneut aus dem Gedächtnis bewiesen werden.

Zusätzlich führt der zentrale Lernkern ein Skill-Profil für **Lesen, Hören, Schreiben, Sprechen und Grammatik**. Für die Review-Priorität zählt nicht nur der historische Gesamtdurchschnitt: die jüngsten bis zu acht Messungen werden stärker gewichtet, unterstützte Durchgänge schwächer, und bei ähnlichen Leistungswerten werden länger nicht geprüfte Bereiche moderat vorgezogen.

## A1-Grundkurs

Die frühere Wortphase wurde in zwei Stufen um insgesamt **20 zusätzliche Grundlagenlektionen mit 100 Lernobjekten** erweitert. Themen sind unter anderem Menschen/Familie, zentrale Verbchunks, Verneinung, Fragewörter, Zahlen, Einkaufen, Bus/Zug, Gesundheit/Hilfe, Essen/Trinken, Orte, Bewegung und persönliche Angaben.

Wichtige Sprachmuster werden in kleinen Gates geprüft. Spätere Brücken systematisieren Ort/Richtung, Akkusativ, Zeitformen und praktische Genitivmuster.

## Freie Produktion und Transfer

Auf späteren Review-Tagen reicht Wiedererkennen nicht. Die App verlangt freie ukrainische Eingaben, gemischte Grammatik, unbekannte Lese-/Hörsituationen, Mini-Geschichten, Hör-Diktate und zusammenhängende Dialoge. Kritische Alltagssätze dürfen nicht durch Raten bestanden werden.

## Spontaner Sprechtransfer

Auf ausgewählten späteren Review-Tagen hört der Lernende eine ukrainische Frage ohne mitzulesen und antwortet sofort laut. Bei verfügbarem Mikrofon gehören Aufnahme und vollständiges Rückhören zum Durchgang; danach wird exakt getippt, was gesprochen wurde. Die Frage kann höchstens zweimal abgespielt werden.

Ein eingeblendeter Fragetext oder technischer Mikrofon-Fallback wird transparent als unterstützt markiert und im Skill-Profil schwächer gewichtet. Es gibt bewusst **keine künstliche Akzentnote**.

## Späte Lernwerkzeuge ab v50

Die zusätzlichen Ideen aus allgemeinen Sprachlern-Prompts werden **nicht an den Kursanfang gesetzt**, sondern erst freigeschaltet, wenn die nötige Basis wirklich vorhanden ist.

### Geführter Tagesplan

Der „Daily Lesson Creator“ wurde bewusst nicht als Zufallsgenerator umgesetzt. Nach der ersten systematischen Grammatikbrücke zeigt `ukrainischkurs-daily-coach.js` einen kompakten Plan aus dem echten aktuellen Kurstag, fälligem SRS, adaptivem Review-Fokus und gegebenenfalls Wochencheck. Optionale Praxis wird getrennt markiert.

### Meine Wörter

`ukrainischkurs-personal-words.js` erlaubt später eigene Wörter und Sätze aus Alltag, Reisen, Nika oder Disorder119. Diese Karten besitzen ein eigenes 1/2/4/7/14/30/60-Tage-Wiederholungssystem. Eigene Inhalte bleiben **vollständig außerhalb** der A1-Gates und des zentralen Skill-Scores, weil ihre sprachliche Qualität nicht automatisch verifiziert werden kann.

### Grammar Decoder

`ukrainischkurs-grammar-decoder.js` erklärt typische A1-Fehler kurz anhand des erwarteten Musters: unter anderem Ort/Richtung, häufige Akkusativformen, `немає` + Genitiv, Vergangenheit, Zukunft, Person und Verneinung. Die spätere Grammatik-Spirale verwendet diesen Decoder bei Fehlern. Die eigentliche Richtig/Falsch-Bewertung bleibt unverändert im zentralen Lernkern.

### Real Conversation Mode

`ukrainischkurs-real-conversation.js` erscheint erst nach der Satz-Sprechbrücke. Es gibt kontrollierte Situationen zu Café/Restaurant, Reisen/Ticket, Nichtverstehen/Hilfe und Kennenlernen/Alltag. Der Modus verzweigt innerhalb bereits eingeführter A1-Sprache, ist aber bewusst **kein vorgetäuschter KI-Chat**. Er ist freiwillig und verändert keine A1-Bestehenswerte.

### 10-Fragen-Wochencheck

`ukrainischkurs-weekly-evaluator.js` erscheint erst nach der Zeit-Grammatik und nur periodisch auf späteren Review-Tagen, damit der Kurs nicht überladen wird. Der Check enthält je zwei Aufgaben zu Lesen, Hören, Schreiben, Grammatik und spontaner Sprechreaktion. Während des Checks werden **keine Lösungen verraten**; erst nach Frage 10 erscheinen Ergebnis, Lösungen und Fehlerhinweise. Es gibt keine zusätzliche Mindestpunktzahl als A1-Gate – der Check ist Diagnose und speist lediglich das adaptive Skill-Profil.

### Immersion Text Lab

`ukrainischkurs-immersion-textlab.js` nimmt später echte ukrainische Texte entgegen, misst die Wortabdeckung anhand des bereits eingeführten Kursmaterials, markiert bekannte/unbekannte Wörter, liest den Text vor und kann unbekannte Wörter zu „Meine Wörter“ weitergeben. Es behauptet bewusst **keine automatische Übersetzung**, wenn keine verlässliche Übersetzungsengine vorhanden ist. Das Textlabor ist freiwillig und A1-neutral.

## Handlungsorientierter Abschluss

Am echten letzten Kurstag folgt ein **16-teiliger Can-do-Check** mit freien Eingaben, Hörfragen und Verständnis-/Situationsaufgaben. Nichtverstehen, Preis, Haltestelle und Hilfe sind kritische Pflichtsituationen.

Bestehen: mindestens 13/16 im ersten Durchgang und alle kritischen Aufgaben korrekt. Fehler werden anschließend repariert.

## Lernprinzipien

Die App kombiniert aktive Erinnerung, Spacing, Interleaving, Fehler-Reparatur, Mastery Learning, Dekodier-Transfer, freie Produktion, gemischte Grammatik, zusammenhängendes Lesen, Hör-Diktat, spontanes Sprechen und aktualitätsgewichtete adaptive Reviews. Geschwindigkeit ist kein hartes Bestehenskriterium; Genauigkeit und stabile Erinnerung kommen zuerst.

Ein grüner Validator beweist technische Konsistenz der geprüften Regeln, nicht automatisch empirische Lernwirkung. Die reale Lernwirkung muss langfristig zusätzlich mit echten Anfängern und verzögerten Retentionstests gemessen werden.

## Qualitätssicherung

`ukrainischkurs-selftest.js` prüft beim App-Start zentrale Laufzeit-Invarianten. `tests/validate-v50.mjs` übernimmt sämtliche v49-Schutzregeln und prüft zusätzlich die sechs späteren Lernwerkzeuge, Loader-Reihenfolge, Offline-Cache, A1-Neutralität der freiwilligen Module, verzögerte Freischaltung sowie konkrete Grammar-Decoder-Regeln. `tests/validate-a1-options.mjs` bleibt als gesonderter A1-Auswahltest bestehen.

Aktuelle Kernmodule umfassen unter anderem:

- `ukrainischkurs-adaptive-alphabet.js`
- `ukrainischkurs-alphabet-proof.js`
- `ukrainischkurs-adaptive-srs.js`
- `ukrainischkurs-learning-core.js`
- `ukrainischkurs-skill-profile.js`
- `ukrainischkurs-a1-grammar-bridge.js`
- `ukrainischkurs-time-bridge.js`
- `ukrainischkurs-genitive-bridge.js`
- `ukrainischkurs-comprehension-lab.js`
- `ukrainischkurs-active-production.js`
- `ukrainischkurs-grammar-spiral.js`
- `ukrainischkurs-story-lab.js`
- `ukrainischkurs-dictation.js`
- `ukrainischkurs-spoken-transfer.js`
- `ukrainischkurs-grammar-decoder.js`
- `ukrainischkurs-personal-words.js`
- `ukrainischkurs-real-conversation.js`
- `ukrainischkurs-weekly-evaluator.js`
- `ukrainischkurs-immersion-textlab.js`
- `ukrainischkurs-daily-coach.js`
- `ukrainischkurs-a1-cando.js`
- `ukrainischkurs-selftest.js`

Unter **Fortschritt** kann der lokale Lernstand exportiert und wieder importiert werden.
