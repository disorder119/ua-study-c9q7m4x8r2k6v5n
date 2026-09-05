(async()=>{
  const VERSION='41';
  window.UKRAINIAN_COURSE_LOADER={version:Number(VERSION),mode:'external-core-script',evalFree:true,staticCore:true};
  function loadScript(path,label){
    return new Promise((resolve,reject)=>{
      const script=document.createElement('script');script.src=path;script.async=false;
      let settled=false;const filename=path.split('?')[0].split('/').pop();
      const cleanup=()=>window.removeEventListener('error',onRuntimeError);
      const fail=error=>{if(settled)return;settled=true;cleanup();script.remove();reject(error instanceof Error?error:new Error(label+' konnte nicht geladen werden'))};
      const onRuntimeError=event=>{if(String(event.filename||'').includes(filename))fail(event.error||new Error(label+' meldet einen Laufzeitfehler'))};
      window.addEventListener('error',onRuntimeError);script.onerror=()=>fail(new Error(label+' fehlt'));
      script.onload=()=>setTimeout(()=>{if(settled)return;settled=true;cleanup();resolve()},0);document.head.append(script);
    });
  }
  try{
    await loadScript(`./ukrainischkurs-v2-core.js?v=${VERSION}`,'Statischer Kurskern');
    const modules=[
      ['./ukrainischkurs-native-audio.js?v=3','Native Audio-Referenzen'],
      ['./ukrainischkurs-pronunciation.js?v=4','Aussprache-Coach'],
      ['./ukrainischkurs-pronunciation-mastery.js?v=4','Aussprache-Festigung'],
      ['./ukrainischkurs-quality-hardening.js?v=6','Qualitäts-Härtung'],
      ['./ukrainischkurs-adaptive-alphabet.js?v=2','Adaptive Alphabet-Mastery'],
      ['./ukrainischkurs-alphabet-proof.js?v=2','Alphabet-Proof'],
      ['./ukrainischkurs-reading-bridge.js?v=1','Lese-Brücke'],
      ['./ukrainischkurs-reading-transfer.js?v=2','Lese-Transfer'],
      ['./ukrainischkurs-adaptive-srs.js?v=2','Adaptives SRS'],
      ['./ukrainischkurs-learning-core.js?v=3','Zentraler Lernkern'],
      ['./ukrainischkurs-foundation-expansion.js?v=3','Grundkurs-Erweiterung'],
      ['./ukrainischkurs-a1-expansion-2.js?v=2','A1-Erweiterung 2'],
      ['./ukrainischkurs-a1-grammar-bridge.js?v=3','A1 Grammatik-Brücke'],
      ['./ukrainischkurs-time-bridge.js?v=3','A1 Zeit-Brücke'],
      ['./ukrainischkurs-genitive-bridge.js?v=3','A1 Genitiv-Brücke'],
      ['./ukrainischkurs-word-stress.js?v=3','Verifizierte Wortbetonung'],
      ['./ukrainischkurs-human-sentence-audio.js?v=4','Menschliche A1-Audios'],
      ['./ukrainischkurs-human-listening.js?v=3','Human-Audio-Diktat'],
      ['./ukrainischkurs-speaking-bridge.js?v=3','Satz-Sprechbrücke'],
      ['./ukrainischkurs-immersion-transfer.js?v=3','Späte A1-Immersionsphase'],
      ['./ukrainischkurs-open-dialogue.js?v=4','Offene Dialoge'],
      ['./ukrainischkurs-conversation-chain.js?v=4','Gesprächsketten'],
      ['./ukrainischkurs-free-reading-transfer.js?v=3','Freier Lese-Transfer'],
      ['./ukrainischkurs-comprehension-lab.js?v=5','Verständnis-Labor'],
      ['./ukrainischkurs-active-production.js?v=5','Aktive Produktion'],
      ['./ukrainischkurs-grammar-spiral.js?v=5','Grammatik-Spirale'],
      ['./ukrainischkurs-story-lab.js?v=4','Mini-Geschichten'],
      ['./ukrainischkurs-dictation.js?v=5','Hör-Diktat'],
      ['./ukrainischkurs-adaptive-review.js?v=1','Automatischer Skill-Review'],
      ['./ukrainischkurs-a1-exam.js?v=1','CEFR-orientierte A1-Prüfungsphase'],
      ['./ukrainischkurs-a1-cando.js?v=7','A1 Can-do-Abschluss'],
      ['./ukrainischkurs-uk-keyboard.js?v=2','Ukrainische Eingabehilfe'],
      ['./ukrainischkurs-dynamic-course-ui.js?v=2','Dynamische Kursanzeige'],
      ['./ukrainischkurs-skill-profile.js?v=2','Adaptives Skill-Profil'],
      ['./ukrainischkurs-selftest.js?v=30','Selbsttest']
    ];
    for(const [path,label] of modules)await loadScript(path,label);
  }catch(error){
    console.error('Ukrainischkurs-Upgrade konnte nicht geladen werden',error);
    const toast=document.getElementById('toast');if(toast){toast.textContent='Die neue Kurslogik konnte nicht geladen werden. Bitte App neu öffnen.';toast.classList.add('show');}
  }
})();