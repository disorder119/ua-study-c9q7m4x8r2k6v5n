(async()=>{
  try{
    const urls=[1,2,3,4,5].map(n=>`./ukrainischkurs-v2.part${n}?v=14`);
    const responses=await Promise.all(urls.map(url=>fetch(url,{cache:'no-store'})));
    if(responses.some(response=>!response.ok))throw new Error('Upgrade-Teile fehlen');
    const code=(await Promise.all(responses.map(response=>response.text()))).join('');
    eval(code);

    const nativeResponse=await fetch('./ukrainischkurs-native-audio.js?v=3',{cache:'no-store'});
    if(!nativeResponse.ok)throw new Error('Native Audio-Referenzen fehlen');
    eval(await nativeResponse.text());

    const pronunciationResponse=await fetch('./ukrainischkurs-pronunciation.js?v=4',{cache:'no-store'});
    if(!pronunciationResponse.ok)throw new Error('Aussprache-Coach fehlt');
    eval(await pronunciationResponse.text());

    const masteryResponse=await fetch('./ukrainischkurs-pronunciation-mastery.js?v=4',{cache:'no-store'});
    if(!masteryResponse.ok)throw new Error('Aussprache-Festigung fehlt');
    eval(await masteryResponse.text());

    const hardeningResponse=await fetch('./ukrainischkurs-quality-hardening.js?v=3',{cache:'no-store'});
    if(!hardeningResponse.ok)throw new Error('Qualitäts-Härtung fehlt');
    eval(await hardeningResponse.text());

    const adaptiveResponse=await fetch('./ukrainischkurs-adaptive-alphabet.js?v=2',{cache:'no-store'});
    if(!adaptiveResponse.ok)throw new Error('Adaptive Alphabet-Mastery fehlt');
    eval(await adaptiveResponse.text());

    const proofResponse=await fetch('./ukrainischkurs-alphabet-proof.js?v=1',{cache:'no-store'});
    if(!proofResponse.ok)throw new Error('Alphabet-Proof fehlt');
    eval(await proofResponse.text());

    const bridgeResponse=await fetch('./ukrainischkurs-reading-bridge.js?v=1',{cache:'no-store'});
    if(!bridgeResponse.ok)throw new Error('Lese-Brücke fehlt');
    eval(await bridgeResponse.text());

    const testResponse=await fetch('./ukrainischkurs-selftest.js?v=4',{cache:'no-store'});
    if(!testResponse.ok)throw new Error('Selbsttest fehlt');
    eval(await testResponse.text());
  }catch(error){
    console.error('Ukrainischkurs-Upgrade konnte nicht geladen werden',error);
    const toast=document.getElementById('toast');
    if(toast){toast.textContent='Die neue Kurslogik konnte nicht geladen werden. Bitte App neu öffnen.';toast.classList.add('show');}
  }
})();
