/* Ukrainischkurs für Joel · A1 Evidence Gate v2
   Eine einzige zentrale Abschlussbedingung für die gehärteten A1-Nachweise.
   Einzelmodule verwalten ihre Übungen; dieses Gate entscheidet, ob der
   A1-Meilenstein insgesamt freigegeben ist. */
(()=>{
  const VERSION=2,core=window.UKRAINIAN_LEARNING_CORE;if(!core)return;
  const DOMAINS=['reading','listening','writing','speaking'];
  function originalDomains(){return DOMAINS.every(k=>!!s.a1Exam?.domains?.[k]?.passed&&!!s.a1Exam?.domains?.[k]?.confirmed)}
  function doublePass(state){return !!(state?.qualification?.passed&&state?.confirmation?.passed&&state.qualification.date&&state.confirmation.date&&state.qualification.date!==state.confirmation.date)}
  function humanListening(){const api=window.UKRAINIAN_A1_HUMAN_LISTENING;if(api)return !!api.passed;return doublePass(s.a1HumanListening)}
  function writingQuality(){const api=window.UKRAINIAN_A1_WRITING_QUALITY;if(api)return !!api.passed;return doublePass(s.a1WritingQuality)}
  function humanSpeaking(){const api=window.UKRAINIAN_A1_HUMAN_SPEAKING;if(api)return !!api.passed;return doublePass(s.a1HumanSpeaking)}
  function requirements(){return {originalDomains:originalDomains(),humanListening:humanListening(),writingQuality:writingQuality(),humanSpeaking:humanSpeaking()}}
  function passed(){const r=requirements();return r.originalDomains&&r.humanListening&&r.writingQuality&&r.humanSpeaking}
  core.registerMilestone?.('a1.exam',{requires:['immersion.transfer'],complete:passed});
  window.UKRAINIAN_A1_EVIDENCE_GATE={version:VERSION,centralized:true,requiresOriginalDoublePass:true,requiresHumanListeningDoublePass:true,requiresStructuredWritingDoublePass:true,requiresHumanSpeakingDoublePass:true,requirements,get passed(){return passed()}};
})();
