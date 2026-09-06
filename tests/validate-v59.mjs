import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

const root=process.cwd(),read=p=>fs.readFileSync(path.join(root,p),'utf8'),errors=[];const assert=(c,m)=>{if(!c)errors.push(m)};

// Zuerst sämtliche v58/v57/... Regressionen unverändert weiter ausführen. Nur die
// absichtlich geänderten Release-/Cachemarker und die v59-Kursfortschrittsberechnung
// werden für diesen historischen Lauf temporär auf v58 gespiegelt.
const lp=path.join(root,'ukrainischkurs-v2-loader.js'),sp=path.join(root,'ukrainisch-lernen-sw.js'),dp=path.join(root,'ukrainischkurs-exam-dashboard.js');
const realLoader=read('ukrainischkurs-v2-loader.js'),realSw=read('ukrainisch-lernen-sw.js'),realDash=read('ukrainischkurs-exam-dashboard.js');
try{
  fs.writeFileSync(lp,realLoader.replace("const VERSION='59'","const VERSION='58'").replace('exam-dashboard.js?v=2','exam-dashboard.js?v=1'),'utf8');
  fs.writeFileSync(sp,realSw.replace("const VERSION='59'","const VERSION='58'"),'utf8');
  const oldCourse="function coursePercent(){return Math.round(clamp(((Number(s.day)||0)+1)/Math.max(1,D.length)*100,0,100))}";
  const currentCourse="function coursePercent(){return Math.round(clamp(completedCourseDays()/Math.max(1,D.length)*100,0,100))}";
  assert(realDash.includes(currentCourse),'v59 Kursfortschrittsfunktion hat unerwartete Form');
  fs.writeFileSync(dp,realDash.replace(currentCourse,oldCourse),'utf8');
  await import(pathToFileURL(path.join(root,'tests/validate-v58.mjs')).href+'?v59base='+Date.now());
}finally{fs.writeFileSync(lp,realLoader,'utf8');fs.writeFileSync(sp,realSw,'utf8');fs.writeFileSync(dp,realDash,'utf8')}

const loader=read('ukrainischkurs-v2-loader.js'),sw=read('ukrainisch-lernen-sw.js'),dash=read('ukrainischkurs-exam-dashboard.js'),core=read('ukrainischkurs-learning-core.js'),self59=read('ukrainischkurs-selftest-v59.js'),base=read('ukrainisch-lernen.html'),app=read('ukrainischkurs-app.html');
assert(loader.includes("const VERSION='59'"),'Loader ist nicht v59');
assert(sw.includes("const VERSION='59'"),'Service Worker ist nicht v59');
assert(loader.includes('persistedDay()')&&loader.includes('restoreDeferredDay()')&&loader.includes('UKRAINIAN_DEFERRED_DAY_RESTORE'),'Später Kurstag wird beim echten Reload nicht geschützt');
assert(loader.indexOf('independence-ladder.js?v=1')<loader.indexOf('restoreDeferredDay()')||loader.includes('if(legacySelftest){restoreDeferredDay()'),'Deferred-Day-Restore liegt nicht nach den Kurserweiterungen');
assert(loader.includes('exam-dashboard.js?v=2')&&loader.includes('selftest-v59.js?v=1'),'v59 Dashboard-/Selbsttest-Cachemarker fehlen');
assert(sw.includes("'./ukrainischkurs-selftest-v59.js'"),'v59 Selbsttest fehlt im Offline-Cache');

// Jede JavaScript-Datei und jedes echte Inline-Script muss syntaktisch parsebar sein.
const jsFiles=fs.readdirSync(root).filter(f=>f.endsWith('.js')).sort();
for(const file of jsFiles){try{new vm.Script(read(file),{filename:file})}catch(e){errors.push(`Syntax ${file}: ${e.message}`)}}
const inline=[...base.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)].map(m=>m[1]).filter(x=>x.trim());
assert(inline.length>=1,'Basis-App enthält kein Inline-Kernscript');inline.forEach((code,i)=>{try{new vm.Script(code,{filename:`ukrainisch-lernen.inline-${i}.js`})}catch(e){errors.push(`Inline-Syntax ${i}: ${e.message}`)}});

// Deterministische App-Hülle: genau Basis + stabile Loader-URL, keine zweite Quelle.
const tag='<script src="./ukrainischkurs-v2-loader.js"></script>',expectedApp=base.replace('</body>',`${tag}\n</body>`);
assert(app===expectedApp,'ukrainischkurs-app.html entspricht nicht deterministisch Basis + Loader');

// Statische DOM-Verträge der Basis-App: keine doppelten IDs und jede direkte $()-
// Referenz des Inline-Kerns hat ein reales Zielelement.
const ids=[...base.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]),idSet=new Set(ids);assert(ids.length===idSet.size,'Basis-App enthält doppelte HTML-IDs');
const dollarRefs=[...new Set(inline.flatMap(code=>[...code.matchAll(/\$\(['"]([^'"]+)['"]\)/g)].map(m=>m[1])))];
for(const id of dollarRefs)assert(idSet.has(id),`Inline-Kern referenziert fehlendes DOM-Ziel #${id}`);

// Loader ↔ Dateisystem ↔ Offline-Cache müssen vollständig übereinstimmen.
const loaderScripts=[...loader.matchAll(/["'`](\.\/ukrainischkurs-[^?"'`]+\.js)\?v=/g)].map(m=>m[1]);
assert(loaderScripts.length>45,'Loader-Inventar ist unerwartet klein');assert(new Set(loaderScripts).size===loaderScripts.length,'Loader lädt ein Modul doppelt');
for(const rel of loaderScripts)assert(fs.existsSync(path.join(root,rel.slice(2))),`Loader-Datei fehlt: ${rel}`);
const swAssets=new Set([...sw.matchAll(/'((?:\.\/)[^']+)'/g)].map(m=>m[1]));
for(const rel of loaderScripts)assert(swAssets.has(rel),`Geladenes Modul fehlt im Offline-Cache: ${rel}`);
for(const rel of swAssets){if(rel==='./')continue;assert(fs.existsSync(path.join(root,rel.slice(2))),`Service-Worker-Asset fehlt physisch: ${rel}`)}

// Sicherheits-/Persistenz-Sanity: Lernmodule löschen nie pauschal Storage und führen
// keinen dynamischen Code aus. Netzwerkzugriffe bleiben auf Service Worker bzw.
// explizite Medienquellen beschränkt; Dashboard selbst bleibt vollständig lokal.
for(const file of jsFiles.filter(f=>f!=='ukrainisch-lernen-sw.js')){
  const src=read(file);assert(!src.includes('localStorage.clear('),`${file} kann gesamten localStorage löschen`);assert(!/\beval\s*\(/.test(src),`${file} nutzt eval()`);assert(!/new\s+Function\s*\(/.test(src),`${file} nutzt new Function()`);
}
assert(!dash.includes('fetch(')&&!dash.includes('XMLHttpRequest')&&!dash.includes('sendBeacon('),'Prüfungsdashboard sendet oder lädt unerwartet Netzwerkdaten');

// Bekannte historische Problemklassen explizit gegen Regression schützen.
const quality=read('ukrainischkurs-quality-hardening.js'),srs=read('ukrainischkurs-adaptive-srs.js'),stateGuard=read('ukrainischkurs-learning-state-guard.js');
assert(quality.includes('if(!dates.length)return 0')&&quality.includes('streak=function()'),'Streak kann ohne echtes Lernen wieder künstlich steigen');
assert(srs.includes('const BASE=[1,2,4,7,14,30,60,90]')&&srs.includes('repairPending'),'SRS verliert Langzeitintervalle oder Reparaturpflicht');
assert(base.includes('pen.points<12||pen.length<minLength'),'Nachzeichnen akzeptiert wieder bloß einen Minimalstrich');
assert(base.includes("s.day<7?['Buchstaben-Jagd',practiceDone"),'Buchstaben-Jagd fehlt wieder im Tagesziel');
assert(base.includes("function markSpoken()")&&base.includes("function markListened()"),'Hören und Sprechen sind nicht getrennt');
assert(stateGuard.includes('startOnFirstStudy:true')&&stateGuard.includes('strictAlphabetCalendar:true'),'Lernstart/Alphabet-Tageslogik ist nicht gehärtet');

// Neue v59-Funde und Fixes.
assert(core.includes('historyWeightAware:true')&&core.includes('assistance*evidence'),'Recent-Score ignoriert weiterhin niedriger gewichtete Evidenz');
assert(dash.includes('listeningPlayRequired:true')&&dash.includes("q.type==='listening'&&q.plays<1&&!q.assisted"),'Hörfrage kann noch ohne Hörversuch beantwortet werden');
assert(dash.includes("if(!canSystemTTS()){q.assisted=true")&&dash.includes('ttsFallbackHonest:true'),'Fehlendes TTS wird nicht sauber als unterstützt markiert');
assert(dash.includes('completedCourseDays()/Math.max(1,D.length)')&&dash.includes('reloadSafeCourseProgress:true'),'Kursprozent hängt noch vom gerade geöffneten Rückblicktag ab');
assert(dash.includes("resultLight=lightForScore(entry.score,2)"),'Fehlgeschlagene Prüfung kann visuell fälschlich gelb statt rot erscheinen');
assert(!dash.includes('s.a1Exam=')&&!dash.includes('s.a1CanDo.passed=')&&!dash.includes('registerMilestone('),'Übungsprüfungen greifen in echte A1-Gates ein');
assert(self59.includes('releaseVersion:59')&&self59.includes('browserAuditRequired:true'),'v59 Laufzeit-Selbsttest fehlt oder verschweigt Browseraudit');

if(errors.length){console.error(`VALIDIERUNG FEHLGESCHLAGEN (${errors.length})`);errors.forEach(e=>console.error('- '+e));process.exit(1)}
console.log(`VALIDIERUNG OK: v59 hat ${jsFiles.length} JavaScript-Dateien syntaktisch geprüft, Loader/Offline-Assets gegengeprüft, Basis-DOM-Verträge validiert und sämtliche v58→v42 Regressionen weitergeführt. Reload später Kurstage, evidenzgewichteter Recent-Score, verpflichtender Hörversuch/TTS-Fallback und stabiler Kursfortschritt sind statisch abgesichert.`);