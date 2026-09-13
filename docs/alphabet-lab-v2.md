# Alphabet Lab v2 – Prüfungssimulator

## Ziel
Die erste App-Stufe trainiert ausschließlich das ukrainische Alphabet. Grammatik, Dialoge und normale Vokabelprogression sind absichtlich nicht Teil dieses Bereichs.

## Produktlogik
Der Hauptlernweg ist wie eine Führerschein-Lernapp aufgebaut:

**Prüfung → Fehler → kurze Korrektur → Wiederholung in anderer Form → erneute Prüfung → verzögerter Abruf.**

Fehler werden nicht verworfen. Pro Buchstabe werden Gesamtfehler, konkrete Verwechslungen, Antwortzeit, Fragetypen, Erfolgsserien, Lerntage, Fälligkeit und Langzeit-Mastery gespeichert.

## Prüfungsarten
- Schnellprüfung (10)
- Standardprüfung (30)
- Große Prüfung (50)
- Schwächenprüfung
- Fehlerprüfung
- Fake-Friend-Prüfung
- Speed-Prüfung
- Audio-Prüfung
- 50-Fragen-Startdiagnose
- Schwächen-Battle für konkrete Verwechslungspaare
- Abschluss-, Fake-Friend-, Audio- und Langzeit-Mastery-Checks

Jede Prüfung kann als Lernprüfung mit Sofortkorrektur oder Realprüfung ohne Lösungen bis zum Ende laufen.

## Adaptive Auswahl
Standardprüfungen priorisieren aktuelle Schwächen, frühere Fehler, fällige Wiederholungen und eine kleinere Kontrollgruppe sicherer Zeichen. Fehlerprüfungen ziehen nur aus persistenten Fehlern; Fake-Friend-Prüfungen aus den für deutschsprachige Lernende besonders gefährlichen Zeichen.

Eine falsche Antwort in der Lernprüfung erzeugt zusätzlich eine Reparaturaufgabe einige Fragen später. Dabei wird nach Möglichkeit der Fragetyp gewechselt, damit nicht nur die identische Karte auswendig gelernt wird.

## Datenmodell
`alphabet-core-v2.js` enthält die zentrale Buchstabenquelle und die testbare Lernlogik. `alphabet-app-v2.js` enthält UI, Navigation und Prüfungsablauf. Der bisherige lokale Speicher `uk-alpha-lab-v1` wird in `uk-alpha-lab-v2` migriert; vorhandene Zähler, Retentionstage, Schreibübungen und Confusions bleiben erhalten.

Pro Zeichen werden u. a. gespeichert:
- gesehen / richtig / falsch
- Antwortzeit und Mittelwert
- letzte Antwort / letzter Fehler
- korrekte Serie
- nächste Fälligkeit und Intervallstufe
- Erfolgs- und Schreibtage
- Confusion Matrix
- Statistik je Fragetyp
- Rückfälle

## Mastery
Mastery ist dynamisch. Neue Fehler senken den Wert wieder. Ein Zeichen gilt erst als sicher, wenn genügend Belege aus Genauigkeit, mehreren Fragetypen, zeitlich verteiltem Abruf, Reaktionszeit und Schreiben vorliegen.

Der globale Abschluss verlangt zusätzlich:
- 33/33 Zeichen individuell sicher
- zwei Abschlussprüfungen an verschiedenen Tagen mit mindestens 95 %
- Fake-Friend-Mastery 100 %
- Audio-Mastery mindestens 95 %
- Langzeit-/Mehrtagesevidenz
- ausreichend automatisierte Erkennungszeit

## Audio
Die App verwendet die bereits im Repository vorhandenen menschlichen ukrainischen Wikimedia-/Lingua-Libre-/Shtooka-Referenzwörter. Sie behauptet nicht, dass dies isolierte Phonemaufnahmen seien. Wörter dienen im Alphabet Lab ausschließlich als Laut-/Schriftträger, nicht als Vokabelkurs.

## Handschrift
Die bestehende Canvas-Schreibübung bleibt erhalten. Sie prüft, ob tatsächlich gezeichnet wurde, vergibt aber bewusst keine erfundene Handschrift- oder KI-Qualitätsnote.
