/* Ukrainischkurs für Joel · freie menschliche ukrainische Aussprache-Referenzen
   Quellen: Lingua Libre / Wikimedia Commons sowie Shtooka / Wikimedia Commons.
   Die Dateien werden unverändert gestreamt; die jeweilige Commons-Dateiseite ist
   die maßgebliche Quelle für Lizenz und Attribution. */
(() => {
  const BASE='https://commons.wikimedia.org/wiki/Special:Redirect/file/';
  const PAGE='https://commons.wikimedia.org/wiki/File:';
  const LL={speaker:'Tohaomg',project:'Lingua Libre / Wikimedia Commons',license:'Freie Creative-Commons-Lizenz; genaue Lizenz auf der Dateiseite'};
  const SH={speaker:'Галя Раптова',project:'Shtooka Project / Wikimedia Commons',license:'CC BY 3.0 US'};
  const rows={
    'А':{file:'LL-Q8798 (ukr)-Tohaomg-Албанія.wav',label:'Албанія',...LL},
    'Б':{file:'LL-Q8798 (ukr)-Tohaomg-Білорусь.wav',label:'Білорусь',...LL},
    'В':{file:"LL-Q8798 (ukr)-Tohaomg-В'єтнам.wav",label:"В'єтнам",...LL},
    'Г':{file:'LL-Q8798 (ukr)-Tohaomg-Гана.wav',label:'Гана',...LL},
    'Ґ':{file:'Uk-ґудзик.ogg',label:'ґудзик',...SH},
    'Д':{file:'LL-Q8798 (ukr)-Tohaomg-Данія.wav',label:'Данія',...LL},
    'Е':{file:'LL-Q8798 (ukr)-Tohaomg-Естонія.wav',label:'Естонія',...LL},
    'Є':{file:'LL-Q8798 (ukr)-Tohaomg-Єгипет.wav',label:'Єгипет',...LL},
    'Ж':{file:'Uk-жук.ogg',label:'жук',...SH},
    'З':{file:'LL-Q8798 (ukr)-Tohaomg-Замбія.wav',label:'Замбія',...LL},
    'И':{file:'Uk-син.ogg',label:'син',...SH},
    'І':{file:'LL-Q8798 (ukr)-Tohaomg-Італія.wav',label:'Італія',...LL},
    'Ї':{file:'Uk-їжа.ogg',label:'їжа',...SH},
    'Й':{file:'LL-Q8798 (ukr)-Tohaomg-Йорданія.wav',label:'Йорданія',...LL},
    'К':{file:'LL-Q8798 (ukr)-Tohaomg-Канада.wav',label:'Канада',...LL},
    'Л':{file:'LL-Q8798 (ukr)-Tohaomg-Латвія.wav',label:'Латвія',...LL},
    'М':{file:'LL-Q8798 (ukr)-Tohaomg-Малі.wav',label:'Малі',...LL},
    'Н':{file:'LL-Q8798 (ukr)-Tohaomg-Непал.wav',label:'Непал',...LL},
    'О':{file:'LL-Q8798 (ukr)-Tohaomg-Оман.wav',label:'Оман',...LL},
    'П':{file:'LL-Q8798 (ukr)-Tohaomg-Перу.wav',label:'Перу',...LL},
    'Р':{file:'LL-Q8798 (ukr)-Tohaomg-Руанда.wav',label:'Руанда',...LL},
    'С':{file:'LL-Q8798 (ukr)-Tohaomg-Сербія.wav',label:'Сербія',...LL},
    'Т':{file:'LL-Q8798 (ukr)-Tohaomg-Того.wav',label:'Того',...LL},
    'У':{file:'LL-Q8798 (ukr)-Tohaomg-Уганда.wav',label:'Уганда',...LL},
    'Ф':{file:'LL-Q8798 (ukr)-Tohaomg-Франція.wav',label:'Франція',...LL},
    'Х':{file:'Uk-хата.ogg',label:'хата',...SH},
    'Ц':{file:'Uk-це.ogg',label:'це',...SH},
    'Ч':{file:'Uk-чай.ogg',label:'чай',...SH},
    'Ш':{file:'Uk-школа.ogg',label:'школа',...SH},
    'Щ':{file:'Uk-щука.ogg',label:'щука',...SH},
    'Ь':{file:'Uk-кінь.ogg',label:'кінь',...SH,note:'Ь hat keinen eigenen Laut; die Aufnahme zeigt die Weichheit des vorherigen Konsonanten.'},
    'Ю':{file:'Uk-юнак.ogg',label:'юнак',...SH},
    'Я':{file:'Uk-я.ogg',label:'я',...SH}
  };
  const audio={},meta={};
  Object.entries(rows).forEach(([letter,row])=>{
    const file=row.file;
    audio[letter]=BASE+encodeURIComponent(file).replace(/%2F/g,'/');
    meta[letter]={...row,source:PAGE+encodeURIComponent(file).replace(/%2F/g,'/')};
  });
  window.UKRAINIAN_PRONUNCIATION_AUDIO=Object.freeze(audio);
  window.UKRAINIAN_PRONUNCIATION_META=Object.freeze(meta);
})();
