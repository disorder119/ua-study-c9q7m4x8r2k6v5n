(async()=>{
  try{
    const urls=[1,2,3,4,5].map(n=>`./ukrainischkurs-v2.part${n}?v=6`);
    const responses=await Promise.all(urls.map(url=>fetch(url,{cache:'no-store'})));
    if(responses.some(response=>!response.ok))throw new Error('Upgrade-Teile fehlen');
    const code=(await Promise.all(responses.map(response=>response.text()))).join('');
    eval(code);
  }catch(error){
    console.error('Ukrainischkurs-Upgrade konnte nicht geladen werden',error);
    const toast=document.getElementById('toast');
    if(toast){toast.textContent='Die neue Kurslogik konnte nicht geladen werden. Bitte App neu öffnen.';toast.classList.add('show');}
  }
})();
