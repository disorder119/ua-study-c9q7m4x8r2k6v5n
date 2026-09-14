# Alphabet Lab V6.1 hardening

V6.1 is a technical hardening release. It deliberately keeps the existing V4/V5/V6 learning model and focuses on durable state, repair correctness, deterministic delivery, reproducible tests, offline/update safety and performance monitoring.

## Confirmed bugs fixed

- cumulative V6 aggregates could shrink after reload because they were rebuilt from bounded logs;
- long-term Production coverage could be lost for the same reason;
- repair-derived Production readiness could remain stale until a rebuild;
- bounded exam history could retain the oldest entries instead of the newest;
- V6 was mirrored to the legacy V3 storage key, doubling storage/write work and complicating reset/migration;
- a reset could leave a V3 state available for later re-import;
- production HTML was also used as its own build source;
- local JS used a service-worker strategy that could return an older cached generation with newer HTML;
- Node performance measurement still loaded the V5 engine;
- CI could modify the PR branch to update generated bundles;
- Playwright was installed from `@latest`;
- audio instances had insufficient generation guards against late events from a previous question;
- V6 progression could deadlock after the initial learning field because the V5 bounded-log unlock counter and the V6 durable unlock counter used incompatible scales;
- a V6.1 migration regression test reassigned a `const` binding and prevented the later release-gate suites from running.

## Architecture

- App version: `6.1.0`
- State schema: `6`
- Aggregate schema: `2`
- Canonical storage: `uk-alpha-lab-v6`
- Deterministic source templates: `alphabet-lab.template.html`, `alphabet-lab-sw.template.js`
- Production bundles: `alphabet-core.bundle.js`, `alphabet-app.bundle.js`
- Build metadata: `alphabet-build.json`
- Build identity: first 12 hex characters of a SHA-256 digest over the declared build sources.

## Durable state rules

Bounded logs remain diagnostic/history data. They are not allowed to redefine already-earned cumulative state downward.

On migration/reload:

- cumulative counts use persisted/derived maxima where appropriate;
- coverage is unioned with still-available history;
- current open repairs are rebuilt exactly from the current repair ledger;
- readiness caches are invalidated whenever repair truth changes.

## Learning progression

V6 owns the unlock throttle on the durable `independentMainCount` scale. The V4 learning-plan selector remains responsible for deciding whether the current active field is ready for another letter, while the obsolete V5 bounded-log throttle is not applied a second time. This keeps the intended spacing rule — normally at least five independent main questions plus evidence on the newest letter — without allowing a learner to become permanently stuck after the first five letters.

## Storage and quota

V6 is the sole normal write target. Legacy keys are migration-only. Persistence is debounced with immediate flushes at lifecycle boundaries. Quota recovery compacts only bounded history; mastery, skill counts, repairs, learning plan, Production state and durable aggregates are preserved. A second failure exposes a small user-visible warning.

## Service worker and update safety

Critical assets are build-versioned. HTML, bundle URLs, build metadata and the service-worker cache share one build ID. A missing JS request never falls back to HTML. External human audio may fail technically without becoming a learner error.

## Build synchronization

Pull-request validation remains read-only. On `main`, `.github/workflows/build-alphabet-lab.yml` deterministically rebuilds and commits only the generated Alphabet-Lab artifacts when declared source files change. This prevents source/bundle drift while keeping generated files out of PR-side mutation.

## CI and tests

Alphabet Lab V6.1 CI is read-only and begins with `node scripts/build-alphabet-lab.mjs --check`. Playwright is pinned in `package-lock.json` and installed with `npm ci`.

The release gate includes the historic A1/Legacy/V2/V3/V4/V5 suites plus V6.1 migration, hardening, fuzz/invariants, wordbank/audio metadata, service-worker generation, mastery/unlock/seed simulations, Node performance, Chromium functional E2E, WebKit functional E2E with iPhone viewport, Chromium performance, offline/update and persistence/storage failure scenarios.

The final measured results and final commit SHA are intentionally not hard-coded here before the final release run. They must only be reported from the completed CI and deployed GitHub Pages build.
