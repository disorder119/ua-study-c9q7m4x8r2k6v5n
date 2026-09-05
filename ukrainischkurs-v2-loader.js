(async()=>{
  const VERSION='30';
  window.UKRAINIAN_COURSE_LOADER={version:Number(VERSION),mode:'classic-script',evalFree:true};
  const coreErrorKey='__UKRAINIAN_COURSE_CORE_ERROR__';
  const coreDoneKey='__UKRAINIAN_COURSE_CORE_DONE__';
  function runCore(code){
    window[coreErrorKey]=null;window[coreDoneKey]=false;
    const script=document.createElement('script');script.type='text/javascript';
    script.textContent=`try{\n${code}\n}catch(error){window.${coreErrorKey}=error;}finally{window.${coreDoneKey}=true;}\n//# sourceURL=ukrainischkurs-v2-core.js`;
    document.head.append(script);script.remove();
    const error=window[coreErrorKey],done=window[coreDoneKey];delete window[coreErrorKey];delete window[coreDoneKey];
    if(!done)throw new Error('Kernlogik konnte nicht als klassisches Skript ausgeführt werden');
    if(error)throw error;
  }
  function loadScript(path,label){
    return new Promise((resolve,reject)=>{
      const script=document.createElement('script');script.src=path;script.async=false;
      let settled=false;
      const filename=path.split('?')[0].split('/').pop();
      const cleanup=()=>window.removeEventListener('error',onRuntimeError);
      const fail=error=>{if(settled)return;settled=true;cleanup();script.remove();reject(error instanceof Error?error:new Error(label+' konnte nicht geladen werden'))};
      const onRuntimeError=event=>{if(String(event.filename||'').includes(filename))fail(event.error||new Error(label+' meldet einen Laufzeitfehler'))};
      window.addEventListener('error',onRuntimeError);
      script.onerror=()=>fail(new Error(label+' fehlt'));
      script.onload=()=>setTimeout(()=>{if(settled)return;settled=true;cleanup();resolve()},0);
      document.head.append(script);
    });
  }
  try{
    const urls=[1,2,3,4,5].map(n=>`./ukrainischkurs-v2.part${n}?v=${VERSION}`);
    const responses=await Promise.all(urls.map(url=>fetch(url,{cache:'no-store'})));
    if(responses.some(response=>!response.ok))throw new Error('Upgrade-Teile fehlen');
    runCore((await Promise.all(responses.map(response=>response.text()))).join(''));
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
      ['./ukrainischkurs-foundation-expansion.js?v=2','Grundkurs-Erweiterung'],
      ['./ukrainischkurs-a1-expansion-2.js?v=1','A1-Erweiterung 2'],
      ['./ukrainischkurs-a1-grammar-bridge.js?v=1','A1 Grammatik-Brücke'],
      ['./ukrainischkurs-time-bridge.js?v=1','A1 Zeit-Brücke'],
      ['./ukrainischkurs-genitive-bridge.js?v=1','A1 Genitiv-Brücke'],
      ['./ukrainischkurs-word-stress.js?v=2','Verifizierte Wortbetonung'],
      ['./ukrainischkurs-human-sentence-audio.js?v=2','Menschliche A1-Audios'],
      ['./ukrainischkurs-open-dialogue.js?v=2','Offene Dialoge'],
      ['./ukrainischkurs-conversation-chain.js?v=1','Gesprächsketten'],
      ['./ukrainischkurs-free-reading-transfer.js?v=1','Freier Lese-Transfer'],
      ['./ukrainischkurs-comprehension-lab.js?v=2','Verständnis-Labor'],
      ['./ukrainischkurs-active-production.js?v=2','Aktive Produktion'],
      ['./ukrainischkurs-grammar-spiral.js?v=3','Grammatik-Spirale'],
      ['./ukrainischkurs-story-lab.js?v=3','Mini-Geschichten'],
      ['./ukrainischkurs-dictation.js?v=3','Hör-Diktat'],
      ['./ukrainischkurs-a1-cando.js?v=5','A1 Can-do-Abschluss'],
      ['./ukrainischkurs-uk-keyboard.js?v=2','Ukrainische Eingabehilfe'],
      ['./ukrainischkurs-dynamic-course-ui.js?v=1','Dynamische Kursanzeige'],
      ['./ukrainischkurs-selftest.js?v=19','Selbsttest']
    ];
    for(const [path,label] of modules)await loadScript(path,label);
  }catch(error){
    console.error('Ukrainischkurs-Upgrade konnte nicht geladen werden',error);
    const toast=document.getElementById('toast');
    if(toast){toast.textContent='Die neue Kurslogik konnte nicht geladen werden. Bitte App neu öffnen.';toast.classList.add('show');}
  }
})();