# Alphabet Lab V6.1

Dieses Repository enthält zwei getrennte Lernoberflächen:

- `alphabet-lab.html` – aktueller Haupteinstieg zum sicheren Lernen aller 33 ukrainischen Buchstaben.
- `ukrainischkurs-app.html` – der bestehende vollständige A1-Kurs; er bleibt unabhängig erhalten.

Die Repository-Root führt zum Alphabet Lab.

## Lernprinzip

Der Hauptweg bleibt prüfungsbasiert:

**sehen → erkennen → unterscheiden → hören → erinnern → selbst produzieren → automatisieren**

30 Hauptfragen bleiben 30 unabhängige Hauptfragen. Repairs laufen getrennt, verändern den Hauptscore nicht und zählen nicht wie ein späterer unabhängiger Recall. Recognition-Skills und `writtenProduction` bleiben getrennte Evidenzspuren. `Ь` besitzt keinen erfundenen isolierten Eigenlaut. Human-Audio-Zertifizierung und Audio→Writing verwenden nur menschliche Referenzaufnahmen.

## V6.3 · Abruf statt Wiedererkennung

Vier Antwortoptionen heißen 25 % Trefferquote ohne jedes Wissen, und
Wiedererkennung ist deutlich leichter als Abruf. Für das Behalten über Wochen
zählt aber der Abruf. V6.3 koppelt deshalb die Zahl der Optionen an die bereits
vorhandene Skill-Mastery:

| Mastery | Optionen | Ratewahrscheinlichkeit |
|---|---|---|
| unter 35 % | 4 | 25 % |
| 35–75 % | 6 | 17 % |
| 75–90 % | 8 | 12,5 % |
| ab 90 % | 33 (`alphabet-recall`) | 3 % |

Anfänger starten unverändert mit vier Optionen. Erst wenn ein Skill wirklich
sitzt, verschwindet die Auswahlhilfe schrittweise – auf der höchsten Stufe gibt es
kein engeres Auswahlfeld mehr, sondern das vollständige Alphabet als Raster.
`Ь` bleibt ausgenommen, weil es keinen eigenen isolierten Laut hat.
Kontrastfamilien behalten ihr enges Paar: Dort *ist* die Verwechslung die Aufgabe.

**Dünne Evidenz ist kein Können.** In einer Simulation über 900 Fragen hatte der
Skill `soundToLetter` bei „М" nach 30 Sitzungen drei Versuche, die übrigen
Kernskills 13 bis 23. Ursache war eine Rückkopplung: Drei Versuche, alle richtig,
melden 68 % Mastery und damit wenig Bedarf – ein ehrlich geübter Skill mit echten
Fehlern meldet 53 % und gewinnt jedes Mal. Der ungeübte Skill wurde also gerade
deshalb übersprungen, weil zu wenig über ihn bekannt war. Da die Freischaltung
neuer Buchstaben ein Minimum über *alle* Basisskills verlangt, hielt ein einziger
ausgehungerter Skill den ganzen Buchstaben fest. Skills unterhalb der
Evidenzschwelle, ab der `skillMasteryV4` seinem eigenen Wert traut, bekommen jetzt
einen Bedarfsaufschlag. Wirkung: ausgehungerte Skills pro Lauf von 1,7 auf 0,3,
Skillbalance von 43 % auf 51 %. Der Preis sind rund vier Sitzungen mehr bis zum
vollständigen Alphabet – dafür hat jeder eingeführte Buchstabe in jedem Skill
echte Evidenz.

Verworfen nach Messung: Ein Breitenpfad, der Buchstaben schneller einführt, brachte
nur +1,7 Buchstaben bei 5 Punkten weniger Wissen je Skill und wurde deshalb nicht
übernommen.

## V6.2 · Fragen-Integrität, Wortschatz und Home-Screen-App

V6.2 beantwortet für jede erzeugte Aufgabe eine einzige Frage: **Kann ein deutscher
Anfänger sie aus dem, was er tatsächlich sieht oder hört, eindeutig beantworten?**
`alphabet-core-v62-question-integrity.js` stellt dafür fünf Invarianten her, die
`tests/validate-alphabet-lab-v62-solvability.mjs` für jede Frage prüft:

- **I1 Zielangabe** – Jede Aufgabe, deren Antwort davon abhängt zu wissen, *welcher*
  Buchstabe gemeint ist, nennt ihn im Prompt. Wo die Nennung die Lösung wäre, wird
  über den Ziellaut bzw. die Funktion des Zeichens identifiziert.
- **I2 Eindeutigkeit** – Buchstabenwahl über eine angezeigte Zeichenkette hat genau
  eine passende Option; Wort-, Zähl- und Positionsaufgaben stimmen mit dem
  angezeigten Wort überein.
- **I3 Kein Positionsleak** – Kein Stimulus verrät die Lösung durch seine Position,
  und keine Audiofrage schreibt ihre eigene Lösung als Text daneben.
- **I4 Kein konstanter Erwartungswert** – Keine kategoriale Familie darf über alle
  Buchstaben hinweg überwiegend dieselbe richtige Antwort haben.
- **I5 Optionshygiene** – dublettenfrei, richtige Antwort genau einmal, mindestens
  zwei Optionen.

Zwei Familien sind dauerhaft stillgelegt, weil ihre Aufgabenform keine variierende,
objektiv belegbare Lösung zulässt: `odd-one-out` (die Gruppenzugehörigkeit war für
den Lernenden nicht ableitbar) und `audio-word-position` (pro Buchstabe existiert nur
ein Audiowort, die Antwort war damit konstant). Ersetzt werden sie durch
`confusion-word-choice` (Zielbuchstabe gegen seinen Verwechslungspartner im echten
Wort) und `audio-word-match` (menschliche Wortaufnahme → geschriebenes Wort).

Die Wordbank umfasst 328 echte ukrainische Wörter, mindestens acht pro Buchstaben,
mit Positionsvielfalt (Anfang, Mitte, Ende, mehrfach), soweit die Sprache sie
hergibt – `ц` steht praktisch nie am Wortende, `ь` und `ґ` nie am Wortanfang.
Wortauswahl und Beispielkarten bevorzugen Wörter, die überwiegend aus bereits
eingeführten Buchstaben bestehen.

Für den iPhone-Home-Screen liefert `alphabet-app-v62-pwa.js` Standalone-Erkennung und
einen Update-Hinweis: Eine installierte PWA wird nie geschlossen, lief aber bisher
unbemerkt mit altem HTML gegen einen neueren Service Worker. Es wird nie automatisch
neu geladen – ein Reload mitten in einer Prüfung wäre schlimmer als eine Version
Verzögerung. Die Home-Screen-Icons sind deckend: iOS komponiert transparente Ecken
auf Schwarz, weshalb `ukrainisch-icon-apple-180.png` (180 × 180, randlos) und ein
eigenes Android-Maskable-Icon ausgeliefert werden.

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

V6.3 ergänzt `tests/validate-alphabet-lab-v63-retrieval.mjs` (Optionsleiter
monoton, Anfängerschutz auf Stufe 0–1, Kontrastpaare unverändert,
Vollalphabet-Abruf für genau 32 Buchstaben, dünn belegte Skills haben mehr
Bedarf als gut belegte).

V6.2 ergänzt `tests/validate-alphabet-lab-v62-solvability.mjs` (Lösbarkeit jeder
Frage, erzwungen über alle Familien und live über den produktiven Selektor) und
`tests/alphabet-lab-v62-pwa-mobile.spec.mjs` (Manifest, Apple-Metadaten,
Icon-Deckkraft, Standalone-Erkennung, Update-Hinweis, Safe Areas, Touchflächen und
horizontales Scrollen auf 320/375/430 px).

Der Node-Performance-Benchmark lädt seit V6.2 denselben Core-Stack, der auch
ausgeliefert wird; vorher maß er eine Teilmenge ohne die Fragen-Integritätsschicht.

Ein grüner Validator beweist die getesteten technischen und fachlichen Invarianten, nicht automatisch empirische Lernwirkung. Ein physischer iPhone-Test ist damit ausdrücklich nicht ersetzt.

## Debugmodus

`alphabet-lab.html?debugLearning=1` aktiviert zusätzliche Diagnose-Hooks für Tests/Entwicklung. Dort können u. a. App-/Schema-/Build-Version, Storage-Key, State-Größe, Persist-Fehler und aktuelle Session-/Selection-Daten geprüft werden. Es werden keine sensitiven externen Daten hinzugefügt.

## A1-Kurs

`ukrainischkurs-app.html` bleibt der große A1-Kurs. Das V6.1-Hardening verändert dessen Lernpfad nicht. Der bestehende `build-app-shell.yml` besitzt weiterhin absichtlich seine historische Auto-Commit-Strategie ausschließlich für die A1-App-Hülle; der Alphabet-Lab-V6.1-Build-Check selbst ist read-only.
