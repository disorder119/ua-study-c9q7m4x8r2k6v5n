/* Ukrainischkurs für Joel · A1 Evidence Gate v1
   Eine einzige zentrale Abschlussbedingung für die gehärteten A1-Nachweise.
   Einzelmodule dürfen ihre Übungen verwalten; dieses Gate entscheidet, ob der
   A1-Meilenstein insgesamt freigegeben ist. */
(()=>{
  const VERSION=1,core=window.UKRAINIAN_LEARNING_CORE;if(!core)return;
  const DOMAINS=['reading','listening','writing','speaking'];
  function originalDomains(){return DOMAINS.every(k=>!!s.a1Exam?.domains?.[k]?.passed&&!!s.a1Exam?.domains?.[k]?.confirmed)}
  function humanListening(){const api=window.UKRAINIAN_A1_HUMAN_LISTENING;if(api)return !!api.passed;const st=s.a1HumanListening;return !!(st?.qualification?.passed&&st?.confirmation?.passed&&st.qualification.date&&st.confirmation.date&&st.qualification.date!==st.confirmation.date)}
  function writingQuality(){const api=window.UKRAINIAN_A1_WRITING_QUALITY;if(api)return !!api.passed;const st=s.a1WritingQuality;return !!(st?.qualification?.passed&&st?.confirmation?.passed&&st.qualification.date&&st.confirmation.date&&st.qualification.date!==st.confirmation.date)}
  function requirements(){return {originalDomains:originalDomains(),humanListening:humanListening(),writingQuality:writingQuality()}}
  function passed(){const r=requirements();return r.originalDomains&&r.humanListening&&r.writingQuality}
  core.registerMilestone?.('a1.exam',{requires:['immersion.transfer'],complete:passed});
  window.UKRAINIAN_A1_EVIDENCE_GATE={version:VERSION,centralized:true,requiresOriginalDoublePass:true,requiresHumanListeningDoublePass:true,requiresStructuredWritingDoublePass:true,requirements,get passed(){return passed()}};
})();