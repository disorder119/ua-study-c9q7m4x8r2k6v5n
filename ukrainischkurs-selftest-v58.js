/* Ukrainischkurs für Joel · v58 Zusatz-Selbsttest
   Baut auf dem vollständigen v57-Selbsttest auf. */
(()=>{
  const base=window.UKRAINIAN_COURSE_SELFTEST||{ok:false,problems:['v57-Selbsttest fehlt']},problems=[...(base.problems||[])],ok=(c,m)=>{if(!c)problems.push(m)};
  try{
    ok(window.UKRAINIAN_COURSE_LOADER?.version===58,'Loader ist nicht auf v58');
    const d=window.UKRAINIAN_EXAM_DASHBOARD;ok(d?.version===1&&d?.practiceOnly===true&&d?.affectsExamGate===false,'v58 Exam Dashboard fehlt oder greift in A1 ein');
    ok(d?.trafficLight===true&&d?.trafficThresholds?.red==='<60'&&d?.trafficThresholds?.yellow==='60-79'&&d?.trafficThresholds?.green==='80+','Lernampel-Schwellen fehlen');
    ok(Number(d?.modeCount)===4&&Array.isArray(d?.modes)&&d.modes.join(',')==='quick,standard,full,weak','Nicht vier Prüfungssimulationsarten geladen');
    ok(Number(d?.frequentRecommendationEveryLessons)===4,'Prüfungssimulationen werden nicht regelmäßig empfohlen');
    for(const fn of ['coursePercent','learningPercent','simulationAverage','skillSignal','signals','recommendedMode','simulationDue','start'])ok(typeof d?.[fn]==='function','Exam Dashboard vermisst '+fn);
    ok(window.UKRAINIAN_COURSE_SELFTEST?.releaseVersion===57||base.releaseVersion===57,'v58 baut nicht auf bestandenem v57-Selbsttest auf');
  }catch(e){problems.push('v58 Zusatz-Selbsttest: '+e.message)}
  window.UKRAINIAN_COURSE_SELFTEST={ok:problems.length===0,problems,checkedAt:new Date().toISOString(),baseReleaseVersion:57,releaseVersion:58};
  if(problems.length)console.error('Ukrainischkurs v58 Selbsttest:',problems);else console.info('Ukrainischkurs v58 Selbsttest: OK');
})();