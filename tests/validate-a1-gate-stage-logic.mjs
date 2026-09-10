// Ukrainischkurs für Joel · A1-Gate Stage-Logik-Validierung
// Prüft NICHT nur, ob erwartete Textmarker im Quelltext stehen (das tun andere Tests bereits),
// sondern simuliert für jedes doppelt-bestätigte A1-Gate den realistischen ERSTEN Versuch —
// mit leerem eigenen Fortschritt, aber bereits bestandener (unabhängiger) Original-Domain,
// wie es im echten Kursverlauf immer der Fall ist — und verlangt, dass dieser erste Versuch
// wirklich als "qualification" zählt, nicht fälschlich sofort als "confirmation".
//
// Entstanden aus einem realen Fund: ukrainischkurs-a1-human-listening-gate.js entschied den
// Qualifikations-/Bestätigungs-Status anhand des Flags eines ANDEREN, unabhängigen Moduls
// (s.a1Exam.domains.listening.qualified) statt des eigenen Fortschritts. Da dieses fremde Flag
// im echten Kursverlauf schon vor dem ersten Versuch dieses Gates dauerhaft true ist, sprang
// die Stage-Funktion beim allerersten Versuch direkt auf "confirmation" — Qualifikation konnte
// nie gesetzt werden, das Gate war dauerhaft unbestehbar. Alle strukturellen Marker-Tests
// blieben dabei grün, weil sie nur prüften, DASS eine stage()-Funktion existiert, nicht WAS sie
// unter realistischen Bedingungen tatsächlich zurückgibt.
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';

const root = process.cwd();
const read = f => fs.readFileSync(path.join(root, f), 'utf8');
const errors = [];
const assert = (cond, msg) => { if (!cond) errors.push(msg) };

// Splice a probe INSIDE the file's own IIFE (before the closing `})();`) so it shares the
// closure and can see stage()/phase()/slot()/fullyPassed()/passed(), which aren't exported.
function runGateWithProbe(file, probeNames, extraState) {
  const source = read(file);
  const marker = '})();';
  const idx = source.lastIndexOf(marker);
  if (idx < 0) throw new Error(`${file}: erwartetes IIFE-Ende "})();" nicht gefunden`);
  const probeAssignments = probeNames.map(n => `if(typeof ${n}==='function')globalThis.__probe_${n}=${n};`).join('');
  const probed = source.slice(0, idx) + `\n  ${probeAssignments}\n` + source.slice(idx);

  const core = { normalize: v => String(v || '').trim().toLowerCase(), recordSession(){} };
  const dummyEl = () => ({ className:'', textContent:'', innerHTML:'', hidden:false, style:{}, disabled:false, append(){}, addEventListener(){}, querySelectorAll(){return []}, insertAdjacentElement(){}, setAttribute(){}, getAttribute(){return null} });
  const document = { head:{append(){}}, createElement:dummyEl, getElementById(){return null}, querySelectorAll(){return []} };
  // Realistic starting condition: the ORIGINAL, independent exam domains are already fully
  // passed (as they always are by the time a learner reaches these add-on gates), but this
  // gate's OWN progress is completely fresh (null) — this is exactly the real first-attempt
  // condition that triggered the original bug.
  const s = { day: 10, a1Exam: { start: 0, domains: { reading:{passed:true,confirmed:true}, listening:{passed:true,confirmed:true,qualified:true}, writing:{passed:true,confirmed:true}, speaking:{passed:true,confirmed:true} } }, ...extraState };
  const ctx = {
    window: { UKRAINIAN_LEARNING_CORE: core, MediaRecorder: function(){}, SpeechRecognition:undefined },
    navigator: { mediaDevices: { getUserMedia(){} } }, MediaRecorder: function(){},
    s, save(){}, render(){}, toast(){}, document,
    Audio: function(){ this.play=()=>Promise.resolve(); }, URL:{createObjectURL(){return 'blob:x'},revokeObjectURL(){}},
    MutationObserver: function(){ this.observe=()=>{} },
    console, globalThis: null,
  };
  ctx.globalThis = ctx;
  vm.createContext(ctx);
  vm.runInContext(probed, ctx, { filename: path.basename(file) });
  const probes = {};
  for (const n of probeNames) probes[n] = ctx[`__probe_${n}`];
  return { ctx, probes };
}

function checkGate(file, stageFnName, fullyPassedFnName, freshStateKey) {
  // Attempt 1: totally fresh gate state, but the unrelated original exam is already qualified/passed.
  const { probes: p1 } = runGateWithProbe(file, [stageFnName, fullyPassedFnName], { [freshStateKey]: null });
  const firstStage = p1[stageFnName]();
  assert(firstStage === 'qualification',
    `${file}: erster Versuch liefert Stage "${firstStage}" statt "qualification" — Qualifikation kann nie gesetzt werden, das Gate ist dauerhaft unbestehbar (das ist exakt der ursprüngliche Bug)`);

  // Attempt 2: qualification already passed yesterday → must now ask for confirmation.
  const qualifiedYesterday = { version:1, qualification:{passed:true,date:'2026-09-10'}, confirmation:null, best:1, attempts:1, lastAttemptDate:'2026-09-10' };
  const { probes: p2 } = runGateWithProbe(file, [stageFnName, fullyPassedFnName], { [freshStateKey]: qualifiedYesterday });
  const secondStage = p2[stageFnName]();
  assert(secondStage === 'confirmation',
    `${file}: nach bestandener Qualifikation liefert Stage "${secondStage}" statt "confirmation"`);

  // Attempt 3: both passed on two different days → fullyPassed()/passed() must be true.
  const bothPassed = { version:1, qualification:{passed:true,date:'2026-09-10'}, confirmation:{passed:true,date:'2026-09-11'}, best:1, attempts:2, lastAttemptDate:'2026-09-11' };
  const { probes: p3 } = runGateWithProbe(file, [fullyPassedFnName], { [freshStateKey]: bothPassed });
  assert(p3[fullyPassedFnName]() === true,
    `${file}: nach zwei echten Versuchen an verschiedenen Kalendertagen gilt das Gate immer noch nicht als bestanden`);
}

checkGate('ukrainischkurs-a1-human-listening-gate.js', 'stage', 'fullyPassed', 'a1HumanListening');
checkGate('ukrainischkurs-a1-writing-quality-gate.js', 'phase', 'fullyPassed', 'a1WritingQuality');
checkGate('ukrainischkurs-a1-human-speaking-gate.js', 'slot', 'passed', 'a1HumanSpeaking');

// a1-evidence-gate.js: with all four sub-gate APIs reporting passed, the aggregate must pass too.
{
  const source = read('ukrainischkurs-a1-evidence-gate.js');
  const core = { normalize: v => String(v||'').trim().toLowerCase(), recordSession(){}, registerMilestone(){} };
  const s = { day: 10, a1Exam: { start:0, domains: { reading:{passed:true,confirmed:true}, listening:{passed:true,confirmed:true}, writing:{passed:true,confirmed:true}, speaking:{passed:true,confirmed:true} } } };
  const ctx = { window: { UKRAINIAN_LEARNING_CORE: core, UKRAINIAN_A1_HUMAN_LISTENING:{passed:true}, UKRAINIAN_A1_WRITING_QUALITY:{passed:true}, UKRAINIAN_A1_HUMAN_SPEAKING:{passed:true} }, s, console };
  vm.createContext(ctx);
  vm.runInContext(source, ctx, { filename: 'a1-evidence-gate.js' });
  const api = ctx.window.UKRAINIAN_A1_EVIDENCE_GATE;
  assert(!!api, 'a1-evidence-gate: keine öffentliche API gefunden');
  assert(api?.passed === true, 'a1-evidence-gate: mit allen vier erfüllten Teil-Nachweisen muss das Gesamtgate bestehen (Kursabschluss wäre sonst blockiert)');
}

if (errors.length) {
  console.error(`A1-GATE STAGE-LOGIK VALIDIERUNG FEHLGESCHLAGEN (${errors.length})`);
  errors.forEach(e => console.error('- ' + e));
  process.exit(1);
}
console.log('A1-GATE STAGE-LOGIK OK: alle vier doppelt-bestätigten A1-Gates (Hören, Schreiben, Sprechen, zentrales Evidence-Gate) entscheiden ihre Qualifikations-/Bestätigungsstufe anhand des EIGENEN Fortschritts und sind über zwei simulierte Kalendertage tatsächlich bestehbar — nicht nur strukturell korrekt beschriftet.');
