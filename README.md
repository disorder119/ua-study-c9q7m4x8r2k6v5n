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
2. **Variabler Lese-Transfer**: Pro Versuch werden 20 Aufgaben zufällig aus einem Pool von mehr als 30 Silben, kontrollierten Nicht-Vokabel-Zeichenketten und einfachen unbekannten Wörtern gezogen. Bedeutung soll beim Dekodieren nicht helfen. Bestehen ab 18/20 im ersten Durchgang; Fehler werden danach repariert.

Später kommt zusätzlich ein **Verständnis-Labor**: kurze neue Lesetexte sowie ukrainische Aussagen, die zunächst ohne sichtbares Transkript gehört werden. Auf Review-Tagen müssen beide Mini-Sets bestanden werden. So soll vertrautes Kartenmaterial nicht mit echtem Lesen oder Hörverstehen verwechselt werden.

## Adaptives Wiederholen

Das SRS speichert Lerntage, Intervall, Ease, Rückfälle und Problemstatus. Neue oder fehlerhafte Karten kommen eng zurück; stabile Karten erhalten wachsende Abstände bis maximal 90 Tage. Wiederholte Problemkarten werden als **Schwierig** priorisiert.

Wichtig: Eine richtige Antwort unmittelbar nach einem Fehler ist nur **Reparatur**. Sie erhöht die Langzeitstufe nicht und muss am Folgetag erneut aus dem Gedächtnis bewiesen werden. Damit kann unmittelbares Feedback keine echte Retention vortäuschen.

## Grundkurs

Nach der ursprünglichen Wortphase folgen inzwischen **zwei A1-Grundstufen mit zusammen 20 zusätzlichen Lektionen und 100 Lernobjekten**.

Erste Stufe:
- Menschen vorstellen
- мій / моя / моє / мої
- zentrale Я-Verbchunks
- Fragewörter
- Zahlen 6–10
- Einkaufen und Preis
- Bus, Zug und Haltestelle
- Gesundheit und Hilfe
- häufige Ortsmuster
- flexible Satzrahmen

Zweite Stufe:
- Familie
- können / wissen / verstehen / mögen
- Verneinung mit не
- häufige Du-Fragen
- Zahlen 11–20
- Essen und Trinken als Bedürfnisse
- wichtige Orte
- gehen / fahren / essen / trinken / schlafen
- persönliche Angaben und kleine Selbstvorstellung

Wichtige Sprachmuster werden in kleinen 3-Fragen-Gates geprüft. Alle drei müssen in einem frischen Durchgang korrekt sein. Grammatik wird zunächst als verwendbares Muster aufgebaut und nicht als isolierte Tabelle.

## Freie Produktion

Ab der Wortphase gibt es einen eigenen **Deutsch→Ukrainisch-Abruf**. Hier existieren keine Antwortbuttons: Die ukrainische Form muss selbst getippt werden. Auf Review-Tagen ist ein 5er-Set Pflicht. Bestehen: mindestens 4/5 plus die kritische Alltagssituation im ersten Versuch korrekt. Reparaturen nach einem Fehler helfen beim Lernen, ändern aber die ursprüngliche Punktzahl nicht.

## Handlungsorientierter Abschluss

Am echten letzten Kurstag folgt ein **16-teiliger Can-do-Check**:

- 8 freie ukrainische Eingaben
- 4 Höraufgaben
- 4 situationsbezogene Verständnisaufgaben

Kritische Aufgaben prüfen Nichtverstehen, Preis, Haltestelle und Hilfe. Bestehen: mindestens 13/16 im ersten Durchgang und alle vier kritischen Aufgaben korrekt.

## Lernprinzipien

Die App kombiniert aktive Erinnerung, Spacing, Interleaving, Fehler-Reparatur, Mastery Learning, Dekodier-Transfer, unbekannte Kurztexte, Hörverstehen ohne Mitlesen, freie Produktion und handlungsorientierte Aufgaben. Geschwindigkeit ist kein hartes Bestehenskriterium; Genauigkeit und stabile Erinnerung kommen zuerst.

Ein grüner Validator beweist technische Konsistenz der geprüften Regeln, nicht automatisch empirische Lernwirkung. Die reale Lernwirkung muss langfristig zusätzlich mit echten Anfängern und verzögerten Retentionstests gemessen werden.

## Qualitätssicherung

`ukrainischkurs-selftest.js` prüft beim App-Start zentrale Laufzeit-Invarianten. `tests/validate.mjs` läuft bei jedem Push über GitHub Actions und prüft u. a. Syntax, Loader/Cache, Alphabet-Mastery, 33 Audioquellen, Lese-Transfer, adaptives SRS, beide A1-Erweiterungen, Verständnis-Labor, freie Produktion und den Can-do-Abschluss.

Aktuelle Kernmodule:

- `ukrainischkurs-adaptive-alphabet.js`
- `ukrainischkurs-alphabet-proof.js`
- `ukrainischkurs-native-audio.js`
- `ukrainischkurs-pronunciation.js`
- `ukrainischkurs-pronunciation-mastery.js`
- `ukrainischkurs-quality-hardening.js`
- `ukrainischkurs-reading-bridge.js`
- `ukrainischkurs-reading-transfer.js`
- `ukrainischkurs-adaptive-srs.js`
- `ukrainischkurs-foundation-expansion.js`
- `ukrainischkurs-a1-expansion-2.js`
- `ukrainischkurs-comprehension-lab.js`
- `ukrainischkurs-active-production.js`
- `ukrainischkurs-a1-cando.js`
- `ukrainischkurs-selftest.js`

Unter **Fortschritt** kann der lokale Lernstand exportiert und wieder importiert werden.
