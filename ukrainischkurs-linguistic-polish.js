/* Ukrainischkurs für Joel · Linguistic Polish v1
   Gezielt verifizierte Sprachkorrekturen für natürliches Anfänger-Ukrainisch.
   Keine pauschalen Umschreibungen: nur klar belegte Fälle werden verändert. */
(()=>{
  const VERSION=1,changes=[];
  function resetCardProgress(di,ci){const key=typeof id==='function'?id(di,ci):`d${di}-${ci}`;if(s?.known?.[key])delete s.known[key]}
  D.forEach((day,di)=>(day?.[3]||[]).forEach((card,ci)=>{
    if(String(card?.[0]||'').trim()==='Вітаю'&&String(day?.[0]||'').includes('Hallo')){
      card[0]='Добрий день';card[1]='Guten Tag / Hallo';card[2]='';resetCardProgress(di,ci);changes.push({kind:'card',day:di,from:'Вітаю',to:'Добрий день'});
    }
  }));
  Object.entries(DIALOGS||{}).forEach(([day,d])=>{
    if(String(d?.situation||'').includes('Привіт!')&&String(d?.answer||'').startsWith('Вітаю!')){
      d.answer='Привіт!<br><span class="small">Hi!</span>';changes.push({kind:'dialog',day:Number(day),from:'Вітаю!',to:'Привіт!'});
    }
  });
  try{if(changes.length)save()}catch{}
  window.UKRAINIAN_LINGUISTIC_POLISH={version:VERSION,verifiedCorrectionsOnly:true,naturalBeginnerGreetings:true,progressResetOnChangedCard:true,changes:changes.map(x=>({...x}))};
})();