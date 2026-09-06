/* Ukrainischkurs für Joel · v57 Zusatz-Selbsttest
   Baut auf dem unveränderten v45-Basis-Selbsttest auf und prüft nur die neuen
   v57-Invarianten. */
(()=>{
 const base=window.UKRAINIAN_COURSE_SELFTEST||{ok:false,problems:['Basis-Selbsttest fehlt']},problems=[...(base.problems||[])],ok=(c,m)=>{if(!c)problems.push(m)};
 try{
  ok(window.UKRAINIAN_COURSE_LOADER?.version===57,'Loader ist nicht auf v57 wiederhergestellt');
  const m=window.UKRAINIAN_INDEPENDENCE_LADDER;ok(m?.version===1&&m?.progressive===true&&m?.everyLessonGate===true,'Independence Ladder v1 fehlt');
  ok(Number(m?.lessonCount)===16&&Number(m?.inputItems)===80&&Number(m?.listeningCount)===16&&Number(m?.checkpointCount)===4&&Number(m?.dialogCount)===8,'v57 Umfang ist nicht 16/80/16 Hören/4 Checkpoints/8 Dialoge');
  ok(m?.systemTTSOnly===true&&m?.noHumanAudioClaim===true&&Number(m?.maxListeningPlays)===2,'v57 kennzeichnet System-TTS/Hörlimit nicht ehrlich');
  ok(m?.freeOutputNotGrammarScored===true&&m?.repairRequired===true&&m?.firstAttemptPreserved===true,'v57 freie Produktion oder Reparatur ist didaktisch unsauber');
  ok(m?.cumulativeRecall===true&&m?.errorAware===true&&m?.competencyAware===true&&m?.affectsExamGate===false,'v57 Rückholung/Diagnose/A1-Neutralität ist beschädigt');
  const words=Array.from({length:16},(_,i)=>m.minimumWords(i));ok(words[0]===4&&words[15]===19&&words.every((v,i)=>i===0||v===words[i-1]+1),'Freier Output wächst nicht in jeder Lektion exakt um ein Wort');
  const rates=Array.from({length:16},(_,i)=>m.speechRate(i));ok(rates[0]===.78&&rates[15]===1.08&&rates.every((v,i)=>i===0||v>rates[i-1]),'System-TTS-Tempo steigt nicht in jeder Lektion');
  const dist=Array.from({length:16},(_,i)=>m.memoryDistance(i));ok(dist[0]>=1&&dist[15]===8&&dist.every((v,i)=>i===0||v>=dist[i-1]),'Abrufabstand wächst nicht kontrolliert');
  ok(Number(window.UKRAINIAN_DYNAMIC_COURSE_UI?.length)===D.length,'Dynamische Kursanzeige kennt v57-Länge nicht');
 }catch(e){problems.push('v57 Zusatz-Selbsttest: '+e.message)}
 window.UKRAINIAN_COURSE_SELFTEST={ok:problems.length===0,problems,checkedAt:new Date().toISOString(),baseSelftestVersion:45,releaseVersion:57};
 if(problems.length)console.error('Ukrainischkurs v57 Selbsttest:',problems);else console.info('Ukrainischkurs v57 Selbsttest: OK');
})();