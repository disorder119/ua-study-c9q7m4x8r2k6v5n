/* Ukrainischkurs für Joel · v59 Qualitäts-Selbsttest
   Ergänzt die bisherigen v45/v57/v58 Laufzeittests um echte Stabilitätsinvarianten. */
(()=>{
  const base=window.UKRAINIAN_COURSE_SELFTEST||{ok:false,problems:['v58 Selbsttest fehlt']},problems=[...(base.problems||[])],ok=(c,m)=>{if(!c)problems.push(m)};
  try{
    ok(window.UKRAINIAN_COURSE_LOADER?.version===59,'Loader ist nicht auf v59');
    ok(base.releaseVersion===58,'v59 baut nicht auf dem erfolgreichen v58 Selbsttest auf');
    const restore=window.UKRAINIAN_DEFERRED_DAY_RESTORE;
    ok(restore&&Number(restore.courseLength)===D.length,'Reload-Schutz kennt nicht die echte Kurslänge');
    ok(['none','already-correct','restored','out-of-range'].includes(String(restore?.status)),'Reload-Schutz hat keinen definierten Abschlussstatus');
    if(Number.isInteger(restore?.captured)&&restore.captured>=0&&restore.captured<D.length)ok(Number(s.day)===restore.captured,'Gespeicherter später Kurstag wurde beim Start nicht wiederhergestellt');
    const core=window.UKRAINIAN_LEARNING_CORE;ok(core?.version>=5&&core?.historyWeightAware===true,'Learning Core berücksichtigt Evidenzgewichte im Recent-Score nicht');
    const dash=window.UKRAINIAN_EXAM_DASHBOARD;
    ok(dash?.version===1&&dash?.practiceOnly===true&&dash?.affectsExamGate===false,'Prüfungsdashboard ist nicht sauber A1-neutral');
    ok(dash?.listeningPlayRequired===true&&dash?.ttsFallbackHonest===true,'Hörsimulation erzwingt keinen Hörversuch oder markiert TTS-Fallback nicht ehrlich');
    ok(dash?.reloadSafeCourseProgress===true&&typeof dash?.completedCourseDays==='function','Kursprozent hängt noch vom aktuell geöffneten Rückblicktag ab');
    ok(Number(dash?.modeCount)===4&&dash?.modes?.join(',')==='quick,standard,full,weak','Vier Prüfungssimulationen sind nicht verfügbar');
    ok(Number(window.UKRAINIAN_DYNAMIC_COURSE_UI?.length)===D.length,'Dynamische Kursanzeige kennt nach v59 nicht die echte Kurslänge');
  }catch(e){problems.push('v59 Zusatz-Selbsttest: '+e.message)}
  window.UKRAINIAN_COURSE_SELFTEST={ok:problems.length===0,problems,checkedAt:new Date().toISOString(),baseReleaseVersion:58,releaseVersion:59,browserAuditRequired:true};
  if(problems.length)console.error('Ukrainischkurs v59 Selbsttest:',problems);else console.info('Ukrainischkurs v59 Selbsttest: OK');
})();