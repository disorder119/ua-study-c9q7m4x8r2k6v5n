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

## A1-Grundkurs

Die frühere Wortphase wurde in zwei Stufen um insgesamt **20 zusätzliche Grundlagenlektionen mit 100 Lernobjekten** erweitert. Themen sind unter anderem:

- Menschen und Familie
- мій / моя / моє / мої
- zentrale Ich- und Du-Verbchunks
- Verneinung
- Fragewörter und echte Fragen
- Zahlen bis 20
- Einkaufen und Preis
- Bus, Zug und Haltestelle
- Gesundheit und Hilfe
- Essen und Trinken als Bedürfnisse
- wichtige Orte
- Gehen, Fahren, Essen und Trinken
- persönliche Angaben und Selbstvorstellung
- flexible Satzrahmen für konkrete Bedürfnisse

Wichtige Sprachmuster werden zunächst in kleinen 3-Fragen-Gates geprüft. Alle drei müssen in einem frischen Durchgang korrekt sein.

## Freie Produktion

Auf späteren Review-Tagen reicht Wiedererkennen nicht. Die App zeigt deutsche Absichten und verlangt die **freie ukrainische Eingabe ohne Antwortbuttons**. Kritische Alltagssätze dürfen nicht durch Raten bestanden werden.

## Verständnis-Labor

Kurze neue Lese- und Hörsituationen prüfen Transfer auf Material, das nicht einfach als Karte wiedererkannt werden kann. Inhalte erscheinen erst, nachdem die dafür nötigen Wörter und Muster eingeführt wurden.

## Grammatik-Spirale

Ab den späteren Review-Tagen werden bereits gelernte Muster **ohne Themenhinweis gemischt**. Die Aufgabe verrät nicht, ob gerade Besitz, Verneinung, Fragebildung, Bedürfnis oder Ortsfrage gebraucht wird. Antworten müssen frei auf Ukrainisch erzeugt werden.

Pro Review werden bis zu sechs gemischte Aufgaben gezogen. Höchstens ein unkritischer Fehler ist erlaubt; wichtige Sätze zu Preis, Orientierung, Hilfe und Nichtverstehen müssen korrekt sein.

## Mini-Geschichten

Das Story Lab verbindet einzelne Sätze zu kurzen zusammenhängenden Texten. Der Text wird einmal gelesen und anschließend **ausgeblendet**. Danach folgen drei Verständnisfragen. Bestehen nur mit 3/3. Damit wird Inhalt über Satzgrenzen hinweg verarbeitet statt nur einzelne Karten zu erkennen.

## Hör-Diktat

Auf Review-Tagen werden bereits eingeführte ukrainische Sätze **ohne sichtbare Vorlage** abgespielt und anschließend frei getippt. Erst nach der Eingabe erscheint die Lösung. Die derzeitige Satzwiedergabe nutzt System-TTS und ist transparent als technischer Hörkanal gekennzeichnet; sie wird nicht als Ersatz für echtes Muttersprachler-Audio ausgegeben.

## Handlungsorientierter Abschluss

Am echten letzten Kurstag folgt ein **16-teiliger Can-do-Check**. Er enthält freie Eingaben, Hörfragen und Verständnis-/Situationsaufgaben. Nichtverstehen, Preis, Haltestelle und Hilfe sind kritische Pflichtsituationen.

Bestehen: mindestens 13/16 im ersten Durchgang und alle kritischen Aufgaben korrekt. Fehler werden anschließend repariert.

## Lernprinzipien

Die App kombiniert aktive Erinnerung, Spacing, Interleaving, Fehler-Reparatur, Mastery Learning, Dekodier-Transfer, freie Produktion, gemischte Grammatik, zusammenhängendes Lesen und Hör-Diktat. Geschwindigkeit ist kein hartes Bestehenskriterium; Genauigkeit und stabile Erinnerung kommen zuerst.

Ein grüner Validator beweist technische Konsistenz der geprüften Regeln, nicht automatisch empirische Lernwirkung. Die reale Lernwirkung muss langfristig zusätzlich mit echten Anfängern und verzögerten Retentionstests gemessen werden.

## Qualitätssicherung

`ukrainischkurs-selftest.js` prüft beim App-Start zentrale Laufzeit-Invarianten. `tests/validate.mjs` läuft bei jedem Push über GitHub Actions und prüft Syntax, Loader/Cache, Alphabet-Mastery, Audioquellen, Lese-Transfer, SRS, A1-Erweiterungen, freie Produktion, Grammatik-Spirale, Mini-Geschichten, Hör-Diktat und Can-do-Abschluss.

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
- `ukrainischkurs-grammar-spiral.js`
- `ukrainischkurs-story-lab.js`
- `ukrainischkurs-dictation.js`
- `ukrainischkurs-a1-cando.js`
- `ukrainischkurs-selftest.js`

Unter **Fortschritt** kann der lokale Lernstand exportiert und wieder importiert werden.
