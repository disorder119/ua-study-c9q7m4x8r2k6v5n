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
- kurzen ukrainischen Übungssilben statt isolierter TTS-Buchstaben
- normaler und verlangsamter Hörreferenz
- eigener Mikrofonaufnahme, lokalem Rückhören und bewusstem A/B-Selbstvergleich
- optionalem ukrainischem Spracherkennungs-Check als Verständlichkeitsindikator, ausdrücklich nicht als angeblich exakter Akzent-Score
- gezieltem Lautkontrasttraining, unter anderem Г/Ґ, И/І, Ж/Ш, Ш/Щ, З/С und Ц/Ч
- zusätzlichem Aussprachetraining an den Tagen 12–14 mit Fokus auf schwierige bzw. zu wenig geübte Laute
- Browser-Fallback, damit fehlende Aufnahme- oder Spracherkennungsfunktionen den Lernweg nicht blockieren

### Freie menschliche ukrainische Audios für alle 33 Zeichen

Für **alle 33 Alphabetzeichen** ist jetzt eine menschliche ukrainische Referenz auf Wikimedia Commons hinterlegt. 21 Zeichen verwenden Lingua-Libre-Aufnahmen von **Tohaomg**, der Ukrainisch als Muttersprache dokumentiert hat. Für die zuvor fehlenden schwierigen Zeichen werden freie ukrainische Shtooka-Aufnahmen einer Sprecherin aus Kyiv verwendet, darunter `ґудзик`, `жук`, `син`, `їжа`, `хата`, `це`, `чай`, `школа`, `щука`, `кінь`, `юнак` und `я`.

Die Shtooka-Dateien sind auf Commons als ukrainische Ausspracheaufnahmen mit Sprecherin aus Kyiv und CC-BY-Lizenz dokumentiert. Da die jeweilige Commons-Seite die Sprecherin nicht ausdrücklich mit dem Label „native speaker“ versieht, wird diese Eigenschaft in der App nicht erfunden. Die Dateien dienen als menschliche ukrainische Aussprache-Referenz. Jede Quelle bleibt mit Dateiname, Sprecher/Urheber, Projekt und Lizenzseite nachvollziehbar.

Bei `Ь` wird bewusst kein eigener Laut vorgespielt: das Beispiel `кінь` demonstriert die Weichheit des vorausgehenden Konsonanten. System-TTS bleibt nur als technischer Fallback verfügbar, falls eine Commons-Aufnahme nicht geladen werden kann.

Die menschlichen Aufnahmen werden online von Wikimedia Commons gestreamt und nicht mit dem lokalen App-Cache ausgeliefert. Damit bleibt die App selbst klein; ohne Internet steht weiterhin die ukrainische Systemstimme als Fallback zur Verfügung.

Zusätzlich arbeitet eine adaptive **Laut-Festigung** über mehrere Kalendertage:

- ab dem zweiten Einführungstag werden automatisch bis zu zwei schwache ältere Laute zurückgeholt
- die Auswahl richtet sich nach bisheriger Trainingsabdeckung statt nur nach der Reihenfolge
- ein Wiederholungslaut muss am Gehör korrekt erkannt und danach erneut aktiv produziert werden
- Hören, aktive Produktion und korrekter Hör-Abruf werden getrennt gespeichert
- pro Laut wird eine mehrtägige Festigung aufgebaut; häufiges Klicken am selben Tag ersetzt keine verteilte Übung
- der angezeigte 0–100-Wert ist ausdrücklich eine Trainingsabdeckungs-Metrik und keine erfundene automatische Akzentnote
- problematische Laute bleiben sichtbar und kehren automatisch wieder

### Noch entscheidend für korrektes Sprechen nach der Alphabetphase

Das Alphabet allein reicht nicht für vollständig natürliche Aussprache. Vor und während des Wortschatzteils müssen deshalb besonders zwei ukrainische Eigenschaften systematisch trainiert werden:

1. **Wortbetonung:** ukrainische Betonung ist nicht zuverlässig aus der Schreibweise vorhersagbar und muss zusammen mit jedem neuen Wort gelernt werden.
2. **Palatalisierung / weiche Konsonanten:** insbesondere `І`, `Є`, `Ю`, `Я` und `Ь` verändern je nach Position die Aussprache des vorausgehenden Konsonanten. Diese Kontextwirkung muss beim Übergang von Buchstaben zu echten Wörtern explizit geübt werden.

Diese beiden Bereiche sind die wichtigste nächste Qualitätsstufe für den späteren Wortkurs.

## Qualitätssicherung

Bekannte Logikfehler werden durch eine zusätzliche Härtung abgefangen. Dazu gehören unter anderem die frühere Tag-1-Buchstaben-Jagd mit einem noch nicht eingeführten vierten Zeichen sowie eine Streak-Anzeige, die mindestens einen Tag anzeigen konnte. Die Aussprache kann auf Geräten mit verfügbarer Aufnahme nicht mehr durch einen simplen manuellen Klick als erledigt gelten; dort zählen Aufnahme, Rückhören und Vergleich. Der manuelle Produktions-Fallback wird nur verwendet, wenn die benötigte Aufnahmefunktion fehlt oder blockiert ist.

Zusätzlich gibt es zwei Testebenen:

1. `ukrainischkurs-selftest.js` prüft beim Start wichtige Laufzeit-Invarianten wie Alphabet-Reihenfolge, 33 Zeichen, eindeutige Lernobjekt-IDs, Tag-1-Spielpool und die menschliche Audioquelle für jedes der 33 Zeichen.
2. `tests/validate.mjs` läuft über GitHub Actions bei jedem Push und prüft JavaScript-Syntax, die zusammengesetzten Kursfragmente, Inline-Skripte, Manifest, Loader, Offline-Cache, Alphabetdaten, Qualitäts-Härtung und die vollständige Audiointegration.

## Dateien

- `index.html` – Einstieg für GitHub Pages
- `ukrainischkurs-app.html` – stabiler App-Loader für die aktuelle Kurslogik
- `ukrainisch-lernen.html` – bestehende vollständige Basis-App
- `ukrainischkurs-v2-loader.js` + `ukrainischkurs-v2.part1`–`part5` – geführte 14-Tage-Alphabetlogik und State-Migration
- `ukrainischkurs-native-audio.js` – freie menschliche ukrainische Referenzen aus Lingua Libre, Shtooka und Wikimedia Commons
- `ukrainischkurs-pronunciation.js` – verpflichtender Aussprache-Coach mit Artikulationshinweisen, Aufnahme, A/B-Vergleich, Kontrasten und Verständlichkeitscheck
- `ukrainischkurs-pronunciation-mastery.js` – adaptive mehrtägige Laut-Festigung mit Schwachstellen-Auswahl, Hör-Abruf und Produktionshistorie
- `ukrainischkurs-quality-hardening.js` – zusätzliche Lernlogik- und Aussprache-Gates sowie Quellenattribution
- `ukrainischkurs-selftest.js` – Laufzeit-Selbsttest
- `tests/validate.mjs` – statische Komplettvalidierung für CI
- `.github/workflows/validate-course.yml` – automatische GitHub-Actions-Prüfung
- `ukrainisch-lernen.webmanifest` – PWA-Installation
- `ukrainisch-lernen-sw.js` – Offline-Modus und Cache-Migration
- App-Icons – Home-Bildschirm und Favicon

Unter **Fortschritt** kann der lokale Lernstand exportiert und wieder importiert werden. Alte Sicherungen werden beim Laden auf den aktuellen Kursstand migriert.
