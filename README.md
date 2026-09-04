# Ukrainischkurs für Joel

Eine offlinefähige, installierbare Lern-App für Ukrainisch, optimiert für einen deutschsprachigen absoluten Anfänger. Die App läuft auf GitHub Pages, benötigt kein Konto und speichert den Lernfortschritt lokal auf dem Gerät.

## Geführter Lernweg

Die ersten 14 Kurstage gehören ausschließlich dem ukrainischen Alphabet:

- Tage 1–11: alle 33 Buchstaben in echter ukrainischer Alphabet-Reihenfolge, höchstens drei neue Zeichen pro Tag
- Tag 12: gezieltes Kontrast- und Verwechslungstraining
- Tag 13: Automatisierung aller 33 Zeichen
- Tag 14: Alphabet-Checkpoint
- reguläre Wörter im Hauptkurs werden erst nach bestandener Alphabetphase freigeschaltet

Der Hauptkurs entscheidet die Reihenfolge. Zusatzübungen bleiben freiwillig verfügbar, ohne den geführten Lernweg vorzuspringen.

## Lernlogik

Die App nutzt aktiven Abruf, verteilte Wiederholung, sofortiges Feedback und Fehler-Reparaturrunden. Ein Lernobjekt kann nicht mehr durch viele richtige Antworten am selben Kalendertag als gemeistert gelten: erfolgreiche Abrufe müssen sich über mehrere getrennte Tage verteilen.

## Aussprache: Mindestziel 9,5/10

Aussprachelernen ist ein harter Qualitätsbereich des Kurses und darf langfristig nicht unter 9,5/10 bewertet werden. Ein bloßer Lautsprecher-Button oder das manuelle Markieren von „nachgesprochen“ gilt nicht als ausreichendes Training.

Die Alphabetphase enthält deshalb einen verpflichtenden Aussprache-Coach mit:

- IPA und konkreten Mund-/Zungenhinweisen für alle 33 Zeichen
- kurzen ukrainischen Übungssilben statt isolierter TTS-Buchstaben, damit die Systemstimme nicht nur Buchstabennamen vorliest
- normaler und verlangsamter Hörreferenz
- eigener Mikrofonaufnahme, lokalem Rückhören und bewusstem A/B-Selbstvergleich
- optionalem ukrainischem Spracherkennungs-Check als Verständlichkeitsindikator, ausdrücklich nicht als angeblich exakter Akzent-Score
- gezieltem Lautkontrasttraining, unter anderem Г/Ґ, И/І, Ж/Ш, Ш/Щ, З/С und Ц/Ч
- zusätzlichem Aussprachetraining an den Tagen 12–14 mit Fokus auf schwierige bzw. zu wenig geübte Laute
- Browser-Fallback, damit fehlende Aufnahme- oder Spracherkennungsfunktionen den Lernweg nicht blockieren

Zusätzlich arbeitet eine adaptive **Laut-Festigung** über mehrere Kalendertage:

- ab dem zweiten Einführungstag werden automatisch bis zu zwei schwache ältere Laute zurückgeholt
- die Auswahl richtet sich nach bisheriger Trainingsabdeckung statt nur nach der Reihenfolge
- ein Wiederholungslaut muss am Gehör korrekt erkannt und danach erneut aktiv produziert werden
- Hören, aktive Produktion und korrekter Hör-Abruf werden getrennt gespeichert
- pro Laut wird eine mehrtägige Festigung aufgebaut; häufiges Klicken am selben Tag ersetzt keine verteilte Übung
- der angezeigte 0–100-Wert ist ausdrücklich eine Trainingsabdeckungs-Metrik und keine erfundene automatische Akzentnote
- problematische Laute bleiben dadurch sichtbar und kehren automatisch wieder, statt nach ihrem Einführungstag zu verschwinden

Für eine endgültige 9,5/10-Abnahme bleiben professionell geprüfte muttersprachliche Referenzaufnahmen für die Ziellaute und Beispielwörter die bevorzugte Referenz. Die App ist bereits so vorbereitet, dass native Referenzdateien später Vorrang vor System-TTS erhalten können; System-TTS bleibt dann nur Fallback.

## Dateien

- `index.html` – Einstieg für GitHub Pages
- `ukrainischkurs-app.html` – stabiler App-Loader für die aktuelle Kurslogik
- `ukrainisch-lernen.html` – bestehende vollständige Basis-App
- `ukrainischkurs-v2-loader.js` + `ukrainischkurs-v2.part1`–`part5` – aktuelle geführte 14-Tage-Alphabetlogik und State-Migration
- `ukrainischkurs-pronunciation.js` – verpflichtender Aussprache-Coach mit Artikulationshinweisen, Aufnahme, A/B-Vergleich, Kontrasten und Verständlichkeitscheck
- `ukrainischkurs-pronunciation-mastery.js` – adaptive mehrtägige Laut-Festigung mit Schwachstellen-Auswahl, Hör-Abruf und Produktionshistorie
- `ukrainisch-lernen.webmanifest` – PWA-Installation
- `ukrainisch-lernen-sw.js` – Offline-Modus und Cache-Migration
- App-Icons – Home-Bildschirm und Favicon

Unter **Fortschritt** kann der lokale Lernstand exportiert und wieder importiert werden. Alte Sicherungen werden beim Laden auf den aktuellen Kursstand migriert.