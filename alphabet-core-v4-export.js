'use strict';
const noveltyScoreV4Base=noveltyScore;
noveltyScore=function(task,state,session){
  let score=noveltyScoreV4Base(task,state,session),family=task.family||task.type;
  const recent=(session.mainAnswers||[]).slice(-3).map(x=>x.family||x.type);
  if(recent.at(-1)===family)score-=32;
  if(recent.length>=2&&recent.slice(-2).every(f=>f===family))score-=85;
  if(recent.length>=3&&recent.every(f=>f===family))score-=180;
  return score;
};
globalThis.AlphabetCoreV2=Object.freeze({
  VERSION:3,SCHEMA_VERSION:V4_VERSION,DAY,HOUR,MIN,ALPHABET,LEARN_ORDER,FAKE_FRIENDS,LATIN_TRAPS,HARD,VOWELS,CONSONANTS,SPECIAL,DATA,SOUND_GROUPS,CONTRASTS,CORE_SKILLS,SKILLS,KIND_SKILL,SKILL_LABELS,INTERVALS,
  WORD_BANK,LETTER_PEDAGOGY,FONT_VARIANTS,QUESTION_FAMILIES,LEARNING_STATE_LABELS,
  uniq,clamp,shuffle,id,localDateKey,todayFrom,daysBetween,skillForKind,
  freshState:freshStateV4,migrate:migrateV4,touchStudy,recentAccuracy,independentAccuracy,avgSkillLatency,
  skillMastery:skillMasteryV4,skillConfidence,coreSkillScores:coreSkillScoresV4,retentionDaysForLetter,letterMastery:letterMasteryV4,
  letterReady:letterReadyV4,letterStatus:letterStatusV4,learningState,problemFlag,
  recordAnswer:recordAnswerV4,recordWriting,topConfusions,errorPriority,weakLetters,errorLetters,dueSkillPairs,dueLetters,secureLetters:secureLettersV4,
  calculateLearningNeed,shouldUnlockNextLetter,recomputeLearningPlan,activeLearningSet,reviewSetFor,difficultyFor,wordsForLetter,pickWord,familyCandidates,
  buildDistractors,makeTask,variantizeTask,buildExam,buildV4Task,questionSignature,noveltyScore,noteExposure,detectLatinTrap,
  selectNextMainQuestion,selectLetterV4,selectSkillV4,selectFamilyV4,overexposurePenalty,createAdaptiveSession,createFocusedSession,createBattleSession,sessionQualityMetrics,sessionDelta,
  repairTask:repairTaskV4,registerRepair,openRepairIds,syncRepairPending,scheduleRepairForSession:scheduleRepairForSessionV4,dueRepairForSession,applyMainAnswer,applyRepairAnswer,sessionScore,
  buildDiagnostic,buildExamV4:buildRealExamV4,buildCertification:buildCertificationV4,buildAudioCertification,buildFakeCertification,buildFinalCertification:buildFinalCertificationV4,
  recordExam,addMasteryCheck,averageRecognitionMs,mastered:masteredV4,statsToday,summaryForLetter:summaryForLetterV4,openMasteryItems:openMasteryItemsV4,
  createExamSession,toggleBookmark,isBookmarked,taskFromBookmark,plausibleSyllable,technicalAudioFailureDecision,makeAudioFallback,snapshotMastery
});
