# Alphabet Lab V6.1

Dieses Repository enthält zwei getrennte Lernoberflächen:

- `alphabet-lab.html` – aktueller Haupteinstieg zum sicheren Lernen aller 33 ukrainischen Buchstaben.
- `ukrainischkurs-app.html` – der bestehende vollständige A1-Kurs; er bleibt unabhängig erhalten.

Die Repository-Root führt zum Alphabet Lab.

## Lernprinzip

Der Hauptweg bleibt prüfungsbasiert:

**sehen → erkennen → unterscheiden → hören → erinnern → selbst produzieren → automatisieren**

30 Hauptfragen bleiben 30 unabhängige Hauptfragen. Repairs laufen getrennt, verändern den Hauptscore nicht und zählen nicht wie ein späterer unabhängiger Recall. Recognition-Skills und `writtenProduction` bleiben getrennte Evidenzspuren. `Ь` besitzt keinen erfundenen isolierten Eigenlaut. Human-Audio-Zertifizierung und Audio→Writing verwenden nur menschliche Referenzaufnahmen.

## V6.1-State und Persistenz

Aktueller State: **Schema 6**. Kanonischer Browser-Key ist ausschließlich:

`uk-alpha-lab-v6`

V1/V2/V3/V4/V5-Zustände werden nur als Migrationsquelle gelesen. Nach erfolgreicher Migration wird normal ausschließlich V6 gespeichert. Ein alter Legacy-Key wird nicht dauerhaft gespiegelt.

V6.1 trennt bewusst:

- langfristigen kanonischen Lernzustand,
- begrenzte Diagnose-/History-Logs,
- daraus abgeleiteten State,
- reine Performance-Caches.

Kumulative Aggregate wie unabhängige Hauptantworten und langfristige Production-Coverage dürfen nach History-Truncation oder Reload nicht zurückgehen. Aktuell offene Repairs werden dagegen aus der tatsächlichen Repair-Ledger exakt synchronisiert.

Persistenz ist debounced, wird bei `pagehide`, `visibilitychange`, `beforeunload` und Prüfungsabschluss unmittelbar geflusht und besitzt einen kontrollierten Quota-Fallback. Bei dauerhaft fehlgeschlagenem Speichern erscheint eine kleine sichtbare Warnung statt eines stillen Console-only-Fehlers.

## Adaptive Engine und Production

V4/V5/V6-Lernlogik bleibt erhalten. Die nächste normale adaptive Hauptfrage wird live aus dem aktuellen Zustand gewählt. Pflichtskills bleiben getrennt; schwaches Audio oder eine konkrete Verwechslung kann nicht durch einen starken Case-Skill verdeckt werden.

Freie Production wird erst nach einem Recognition-/Audio-/Retention-Gate freigeschaltet und läuft außerhalb des objektiven Hauptscores. Unterstützt werden u. a.:

- Visual Memory → Writing
- Sound → Writing
- Human Audio → Writing
- Confusion → Writing
- Case → Writing

Selbstbewertung: `Passt`, `Fast / unsicher`, `Nochmal`. Production-Repairs bleiben separate Repairs. Die Oberfläche bezeichnet langfristige Coverage als **ausprobiert**; erfolgreiche Pass-Coverage wird separat im State geführt.

## Build

Die produktive App wird deterministisch aus Source-Dateien erzeugt:

- `alphabet-lab.template.html` → `alphabet-lab.html`
- `alphabet-lab-sw.template.js` → `alphabet-lab-sw.js`
- Core-Sources → `alphabet-core.bundle.js`
- App-Sources → `alphabet-app.bundle.js`
- Build-Metadaten → `alphabet-build.json`

Build:

```bash
node scripts/build-alphabet-lab.mjs
```

Konsistenzprüfung ohne Schreiben:

```bash
node scripts/build-alphabet-lab.mjs --check
```

Der Build ist byte-deterministisch. `alphabet-build.json` enthält App-Version, Schema-Version, Aggregate-Schema, Build-ID und Bundle-Digests. Die Build-ID wird aus den tatsächlichen Source-Inhalten abgeleitet; es wird keine Uhrzeit eingebaut.

## Service Worker und Offline

HTML und kritische lokale Assets verwenden dieselbe Build-ID. Bundles werden mit `?v=<buildId>` angefordert und in einem Build-spezifischen Cache gespeichert. Damit darf ein neues HTML nicht unbemerkt alte Core-/App-Bundles erhalten.

Offline gilt weiterhin:

- bereits installierte App-Hülle und kritische lokale Assets starten aus dem Cache,
- fehlendes JavaScript bekommt niemals HTML als Ersatz,
- externe Wikimedia-Human-Audioquellen werden nur bedarfsgesteuert gecacht und dürfen technisch ausfallen, ohne einen Benutzerfehler zu erzeugen.

## Tests und Performance

Die Haupt-CI prüft in Reihenfolge A1/Kurs, Alphabet-Legacy, V2, V3, V4, V5 und anschließend V6.1. V6.1 ergänzt explizite Tests für:

- langlebige Aggregate trotz begrenzter Logs,
- sofortige Repair-/Readiness-Invalidierung,
- neueste statt älteste Exam-History,
- Migration und lokale Tagesgrenzen,
- deterministischen Build und stale Artefakte,
- Long-run Fuzz/Invarianten,
- Wordbank/Unicode/Human-Audio-Metadaten,
- Service-Worker-Generationen und Offline-Fallback,
- Mastery/Unlock und viele feste Seeds,
- Storage/Quota/Pagehide/Reset/Double-click,
- Audio-Lifecycle und verspätete Events,
- Chromium Desktop sowie WebKit mit iPhone-Viewport,
- getrennte Chromium-Performance-Budgets.

Playwright ist über `package-lock.json` reproduzierbar gepinnt. CI verwendet `npm ci`; kein `@latest`.

Die Budgets stehen in `tests/performance-budget.json`. Gemessen werden u. a. Bundle-Größe, initiale JS-Requests, App-ready/Interactive, Renderpfade, Question Generation, Production Readiness/Quota, State-Serialisierung, LocalStorage-Schreibzeit und Long Tasks.

Ein grüner Validator beweist die getesteten technischen und fachlichen Invarianten, nicht automatisch empirische Lernwirkung.

## Debugmodus

`alphabet-lab.html?debugLearning=1` aktiviert zusätzliche Diagnose-Hooks für Tests/Entwicklung. Dort können u. a. App-/Schema-/Build-Version, Storage-Key, State-Größe, Persist-Fehler und aktuelle Session-/Selection-Daten geprüft werden. Es werden keine sensitiven externen Daten hinzugefügt.

## A1-Kurs

`ukrainischkurs-app.html` bleibt der große A1-Kurs. Das V6.1-Hardening verändert dessen Lernpfad nicht. Der bestehende `build-app-shell.yml` besitzt weiterhin absichtlich seine historische Auto-Commit-Strategie ausschließlich für die A1-App-Hülle; der Alphabet-Lab-V6.1-Build-Check selbst ist read-only.
