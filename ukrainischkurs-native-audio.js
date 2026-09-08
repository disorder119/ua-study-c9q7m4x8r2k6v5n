/* Ukrainischkurs für Joel · freie menschliche ukrainische Aussprache-Referenzen
   Quellen: Lingua Libre / Wikimedia Commons sowie Shtooka / Wikimedia Commons.
   Der geführte Anfängerstart verwendet nur exakt zum angezeigten Wort passende
   menschliche Aufnahmen; kein synthetisches Audio zählt als Referenz. */
(() => {
  const BASE='https://commons.wikimedia.org/wiki/Special:Redirect/file/';
  const PAGE='https://commons.wikimedia.org/wiki/File:';
  const LL={speaker:'Tohaomg',project:'Lingua Libre / Wikimedia Commons',license:'CC BY-SA 4.0'};
  const SH={speaker:'Галя Раптова',project:'Shtooka Project / Wikimedia Commons',license:'CC BY 3.0 US'};
  const rows={
    'А':{file:'Uk-автобус.ogg',label:'автобус',...SH},
    'Б':{file:'Uk-бабуся.ogg',label:'бабуся',...SH},
    'В':{file:'Uk-вода.ogg',label:'вода',...SH},
    'Г':{file:'Uk-гора.ogg',label:'гора',...SH},
    'Ґ':{file:'Uk-ґудзик.ogg',label:'ґудзик',...SH},
    'Д':{file:'Uk-дім.ogg',label:'дім',...SH},
    'Е':{file:'Uk-екран.ogg',label:'екран',...SH},
    'Є':{file:'LL-Q8798 (ukr)-Tohaomg-єнот.wav',label:'єнот',...LL},
    'Ж':{file:'Uk-жук.ogg',label:'жук',...SH},
    'З':{file:'Uk-зуб.ogg',label:'зуб',...SH},
    'И':{file:'Uk-син.ogg',label:'син',...SH},
    'І':{file:'Uk-ім’я.ogg',label:'ім’я',...SH},
    'Ї':{file:'Uk-їжа.ogg',label:'їжа',...SH},
    'Й':{file:'LL-Q8798 (ukr)-Tohaomg-йогурт.wav',label:'йогурт',...LL},
    'К':{file:'Uk-кіт.ogg',label:'кіт',...SH},
    'Л':{file:'Uk-лампа.ogg',label:'лампа',...SH},
    'М':{file:'Uk-мама.ogg',label:'мама',...SH},
    'Н':{file:'Uk-ніс.ogg',label:'ніс',...SH},
    'О':{file:'Uk-око.ogg',label:'око',...SH},
    'П':{file:'Uk-парк.ogg',label:'парк',...SH},
    'Р':{file:'Uk-рука.ogg',label:'рука',...SH},
    'С':{file:'Uk-сир.ogg',label:'сир',...SH},
    'Т':{file:'Uk-так.ogg',label:'так',...SH},
    'У':{file:'Uk-урок.ogg',label:'урок',...SH},
    'Ф':{file:'LL-Q8798 (ukr)-Tohaomg-Франція.wav',label:'Франція',...LL},
    'Х':{file:'Uk-хата.ogg',label:'хата',...SH},
    'Ц':{file:'Uk-це.ogg',label:'це',...SH},
    'Ч':{file:'Uk-чай.ogg',label:'чай',...SH},
    'Ш':{file:'Uk-школа.ogg',label:'школа',...SH},
    'Щ':{file:'Uk-щука.ogg',label:'щука',...SH},
    'Ь':{file:'Uk-кінь.ogg',label:'кінь',...SH,note:'Ь hat keinen eigenen Laut; die Aufnahme zeigt die Weichheit des vorherigen Konsonanten.'},
    'Ю':{file:'Uk-юнак.ogg',label:'юнак',...SH},
    'Я':{file:'Uk-яблуко.ogg',label:'яблуко',...SH}
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