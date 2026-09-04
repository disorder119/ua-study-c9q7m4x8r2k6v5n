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

## Dateien

- `index.html` – Einstieg für GitHub Pages
- `ukrainischkurs-app.html` – stabiler App-Loader für die aktuelle Kurslogik
- `ukrainisch-lernen.html` – bestehende vollständige Basis-App
- `ukrainischkurs-v2-loader.js` + `ukrainischkurs-v2.part1`–`part5` – aktuelle geführte 14-Tage-Alphabetlogik und State-Migration
- `ukrainisch-lernen.webmanifest` – PWA-Installation
- `ukrainisch-lernen-sw.js` – Offline-Modus und Cache-Migration
- App-Icons – Home-Bildschirm und Favicon

Unter **Fortschritt** kann der lokale Lernstand exportiert und wieder importiert werden. Alte Sicherungen werden beim Laden auf den aktuellen Kursstand migriert.
