# Ukrainischkurs für Joel

Eine offlinefähige, installierbare Lern-App für Ukrainisch für einen deutschsprachigen absoluten Anfänger. Fortschritt bleibt lokal auf dem Gerät.

## Lernweg

Die Alphabetphase folgt einem **14+-Mastery-Modell**: 14 Tage sind das schnellste Zieltempo, keine Deadline. Tage 1–11 führen höchstens drei neue Zeichen pro Tag ein; danach folgen Kontraste, Automatisierung und Checkpoint. Bei Lücken entstehen automatisch zusätzliche Festigungstage.

Die endgültige Alphabetfreigabe verlangt mehrere unabhängige Nachweise: 33-Zeichen-Check, Hör-Diktat, Verwechslungs-Test, mehrtägige Retention, isolierte Kleinbuchstaben, Laut→Zeichen-Abruf und zusätzliche 3-Tage-Retention für besonders schwierige Zeichen.

## Aussprache

Alle 33 Alphabetzeichen haben eine menschliche ukrainische Referenz auf Wikimedia Commons. Der Aussprache-Coach kombiniert Referenzhören, Mund-/Zungenhinweise, IPA, eigene Mikrofonaufnahme, Rückhören, A/B-Selbstvergleich, optionale ukrainische Spracherkennung und verteilte Lautwiederholung. System-TTS bleibt technischer Fallback.

## Vom Alphabet zum echten Lesen

Nach der Alphabetphase reicht Buchstabenwissen nicht. Vor dem normalen Wortkurs gibt es deshalb zwei Stufen:

1. **Lese- und Aussprachebrücke:** Wortbetonung, weiche Konsonanten, І/Я/Ю/Є/Ь, Apostroph und Ї.
2. **Echter Lese-Transfer:** 20 Aufgaben mit ungelernten Silben und Wörtern. Es wird nicht nach Bedeutung gefragt, sondern geprüft, ob der Lerner Zeichen wirklich verbinden und auf neues Material übertragen kann. Bestehen ab 18/20 im ersten Durchgang; Fehler werden anschließend repariert.

## Wiederholung

Das adaptive SRS speichert neben erfolgreichen Lerntagen auch Intervall, Schwierigkeit, Rückfälle und eine individuelle Ease-Komponente. Neue oder fehlerhafte Karten kommen eng zurück; stabile Karten erhalten wachsende Abstände bis 90 Tage. Wiederholte Problemkarten werden sichtbar als **Schwierig** markiert und in fälligen Wiederholungen priorisiert. Ein richtiger Klick am selben Tag kann einen fehlenden Lerntag nicht ersetzen.

## Grundkurs nach dem Alphabet

Der ursprüngliche Minikurs wurde in **v16** um **10 zusätzliche Grundlagenlektionen mit 50 Lernobjekten** erweitert. Neue Bereiche:

- Menschen benennen und vorstellen
- мій / моя / моє / мої
- fünf verwendbare Я-Verbchunks
- Fragewörter
- Zahlen 6–10
- Einkaufen und Preis
- Bus, Zug und Haltestelle
- Gesundheit und Hilfe
- häufige Ortsmuster
- flexible Überlebens-Satzrahmen

Wichtige Grammatikpunkte werden nicht als große Tabellen präsentiert, sondern über kurze **3-Fragen-Musterchecks**. Bei diesen Gates müssen alle drei Aufgaben in einem frischen Durchgang stimmen, bevor der nächste Kurstag abgeschlossen wird.

## Lernprinzipien

Die App kombiniert kleine neue Blöcke, aktiven Abruf, verteilte Wiederholung, gemischten Abruf, Fehler-Reparatur, Mastery Learning und Transferaufgaben. Geschwindigkeit ist kein hartes Bestehenskriterium; Genauigkeit und stabile Erinnerung kommen zuerst.

Das Ziel ist ein belastbarer Anfängerkurs, nicht eine künstliche Abschlussquote. Ein grüner Validator bedeutet technische Konsistenz der geprüften Regeln, nicht empirisch bewiesene Lernwirkung; diese muss zusätzlich mit echten Anfängern und verzögerten Retentionstests gemessen werden.

## Qualitätssicherung

`ukrainischkurs-selftest.js` prüft beim Start wichtige Laufzeit-Invarianten. `tests/validate.mjs` läuft bei jedem Push über GitHub Actions und prüft unter anderem Syntax, Loader, Offline-Cache, Alphabet, Audioquellen, Mastery-Gates, Lese-Brücke, Lese-Transfer, adaptives SRS und den erweiterten Grundkurs.

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
- `ukrainischkurs-selftest.js`

Unter **Fortschritt** kann der lokale Lernstand exportiert und wieder importiert werden.