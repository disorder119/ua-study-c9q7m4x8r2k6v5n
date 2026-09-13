# Aktueller Fokus: Alphabet Lab

Dieses Repository enthält weiterhin den vollständigen Ukrainisch-A1-Kurs. Der aktuelle Haupteinstieg ist jedoch bewusst das **Alphabet Lab**: eine statische, installierbare GitHub-Pages-App für deutschsprachige Anfänger, die zuerst ausschließlich die **33 ukrainischen Buchstaben** sicher beherrschen sollen.

Start: `alphabet-lab.html` bzw. die Repository-Root. Der vollständige spätere Kurs bleibt unter `ukrainischkurs-app.html` erreichbar.

## Lernprinzip

Der Hauptweg folgt bewusst einer prüfungsbasierten Führerschein-Lernlogik:

**Prüfung → Fehler → Lösung → verzögerte Reparatur → späterer unabhängiger Abruf → Langzeitwiederholung → Automatisierung**

Man darf vom ersten Start an Prüfungen machen. Fehler sind der wichtigste Lernstoff. Eine unmittelbar richtige Reparatur ist nur kurzfristige Evidenz und zählt **nicht** wie ein späterer unabhängiger Abruf.

## Was das Alphabet Lab prüft

- 50-Fragen-Startdiagnose ohne Vorab-Theorie
- Lernprüfungen mit exakt definierter Zahl unabhängiger Hauptfragen
- zusätzliche Reparaturfragen, die den Hauptscore nicht verändern
- Realprüfungen ohne Lösungen oder Repairs während des Durchgangs
- Fehler-, Schwächen-, Fake-Friend-, Audio- und Speed-Prüfungen
- getrennte Kernskills pro Buchstabe: Zeichen→Laut, Laut→Zeichen, Groß/Klein, Audio→Zeichen, Verwechslungsunterscheidung
- persönliche Confusion Matrix und deutsch-spezifische Fallen wie В/Н/Р/С/У/Х
- skillbasiertes SRS statt eines einzigen Buchstaben-Intervalls
- recent-performance-lastige Mastery, die nach Rückfällen wieder sinkt
- Handschrift als motorische Übung ohne vorgetäuschte Handschrifterkennung
- markierte Lernziele und optionales geführtes Kurztraining

## Ehrliche Prüfungsscores

Eine 30er Lernprüfung bedeutet **30 Hauptfragen**. Reparaturen laufen separat.

Beispiel:

- Hauptprüfung: 23/30 = 76,7 %
- Fehler: 7
- erfolgreich repariert: 6/7
- weiter offen: 1

Repairs erzeugen keinen normalen Retention-Day, keinen normalen SRS-Sprung und keinen Certification-Pass.

## Mastery

Ein guter Gesamtdurchschnitt darf keinen schwachen Pflichtskill verdecken. Der Status „Sicher“ verlangt pro Buchstabe ausreichende Evidenz in allen Pflichtskills, mehrere unabhängige erfolgreiche Tage, erledigtes Schreiben und keine offenen Repairs.

Globales `UKRAINISCHES ALPHABET GEMEISTERT` verlangt zusätzlich kontrollierte Abschlussprüfungen, Fake-Friend-Mastery, 33/33-Audio-Coverage mit menschlichen Quellen, Langzeit-Retention und ausreichende Automatisierung. Ein einzelner ungelöster Buchstabe blockiert den Abschluss.

## Audio

Die menschlichen Referenzaufnahmen stammen aus `ukrainischkurs-native-audio.js` und verweisen auf Wikimedia Commons. In gewerteten Audio-Prüfungen und Audio-Certification zählt nur erfolgreich abgespieltes **menschliches Audio**. TTS ist ausschließlich ein freiwilliger Lern-Fallback außerhalb solcher Zertifizierungen.

`Ь` wird nicht als isolierter Laut behandelt, sondern kontextuell über ein Wort wie `кінь` geprüft.

## Offline

Die App-Hülle, Kernlogik, Manifest und lokale Assets werden als PWA gecacht. **Menschliche Audioquellen liegen extern auf Wikimedia und benötigen gegebenenfalls Netzwerkzugriff.** Es wird nicht behauptet, dass Audio vollständig offline verfügbar sei.

Der Service Worker unterscheidet Navigation von JS/Manifest/Assets. Eine fehlgeschlagene JavaScript-Anfrage darf niemals HTML als Fallback erhalten.

## Persistenz

Fortschritt liegt lokal im Browser (`uk-alpha-lab-v3`). V1/V2-Lernstände werden migriert. Alte Antworten ohne verlässliche Zeitmessung werden nicht künstlich als getimte Speed-Evidenz übernommen. Detail-Logs und Prüfungshistorie sind begrenzt; aggregierte Skill-Mastery bleibt erhalten.

## Vollständiger A1-Kurs

Der bestehende große Kurs bleibt vollständig erhalten unter `ukrainischkurs-app.html`. Dazu gehören u. a. der frühere geführte Alphabetpfad, adaptives SRS, Lesebrücken, Grammatik, Hören, Schreiben, Sprechen, A1-Prüfung und spätere A1/A1+-Module. Diese Bereiche werden durch das Alphabet Lab nicht automatisch freigeschaltet oder umgeschrieben.

Wichtige bestehende Module bleiben unter anderem:

- `ukrainischkurs-adaptive-srs.js`
- `ukrainischkurs-learning-core.js`
- `ukrainischkurs-learning-state-guard.js`
- `ukrainischkurs-adaptive-alphabet.js`
- `ukrainischkurs-alphabet-proof.js`
- `ukrainischkurs-guided-start.js`

## Qualitätssicherung

CI behält sämtliche bisherigen A1-Regressionen sowie die Legacy- und V2-Alphabettests. Zusätzlich prüft die V3-Suite Repair-Trennung, ehrliche Scores, skillbasierte Mastery, Recent Performance, Pro-Skill-SRS, Audio-Certification, technische Audiofehler, Hidden-Tab-Timing, lokale Tageslogik, Migration, kontrollierte Coverage, Service-Worker-Fallbacks und Mastery-Rückstufung.

Ein grüner Validator beweist technische Konsistenz der geprüften Regeln, nicht automatisch empirische Lernwirkung. Die reale Lernwirkung muss weiterhin mit echten Nutzern und verzögerten Retentionstests beobachtet werden.
