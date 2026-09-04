(async()=>{
  try{
    const urls=[1,2,3,4,5].map(n=>`./ukrainischkurs-v2.part${n}?v=17`);
    const responses=await Promise.all(urls.map(url=>fetch(url,{cache:'no-store'})));
    if(responses.some(response=>!response.ok))throw new Error('Upgrade-Teile fehlen');
    const code=(await Promise.all(responses.map(response=>response.text()))).join('');
    eval(code);

    const load=async(path,label)=>{const r=await fetch(path,{cache:'no-store'});if(!r.ok)throw new Error(label+' fehlt');eval(await r.text())};
    await load('./ukrainischkurs-native-audio.js?v=3','Native Audio-Referenzen');
    await load('./ukrainischkurs-pronunciation.js?v=4','Aussprache-Coach');
    await load('./ukrainischkurs-pronunciation-mastery.js?v=4','Aussprache-Festigung');
    await load('./ukrainischkurs-quality-hardening.js?v=3','Qualitäts-Härtung');
    await load('./ukrainischkurs-adaptive-alphabet.js?v=2','Adaptive Alphabet-Mastery');
    await load('./ukrainischkurs-alphabet-proof.js?v=2','Alphabet-Proof');
    await load('./ukrainischkurs-reading-bridge.js?v=1','Lese-Brücke');
    await load('./ukrainischkurs-reading-transfer.js?v=2','Lese-Transfer');
    await load('./ukrainischkurs-adaptive-srs.js?v=2','Adaptives SRS');
    await load('./ukrainischkurs-foundation-expansion.js?v=1','Grundkurs-Erweiterung');
    await load('./ukrainischkurs-a1-cando.js?v=1','A1 Can-do-Abschluss');
    await load('./ukrainischkurs-selftest.js?v=6','Selbsttest');
  }catch(error){
    console.error('Ukrainischkurs-Upgrade konnte nicht geladen werden',error);
    const toast=document.getElementById('toast');
    if(toast){toast.textContent='Die neue Kurslogik konnte nicht geladen werden. Bitte App neu öffnen.';toast.classList.add('show');}
  }
})();
