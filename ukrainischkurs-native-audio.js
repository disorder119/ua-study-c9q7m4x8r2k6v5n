/* Ukrainischkurs für Joel · menschliche ukrainische Originalaufnahmen
   Harte Audio-Policy für das Alphabet Lab:
   - kein Browser-TTS / keine KI-Stimme als Aussprache-Ersatz
   - nur echte menschliche Aufnahmen mit öffentlicher Quellen- und Lizenzzuordnung
   - Quellenstatus wird transparent gespeichert; eine formale Sprecher-Zertifizierung wird
     nur behauptet, wenn die jeweilige Quelle sie ausdrücklich nachweist.
   Wortquellen: Lingua Libre / Wikimedia Commons sowie Shtooka / Wikimedia Commons.
   Isolierte Buchstabenaussprache: Tabrus / Wikimedia Commons, CC BY-SA 4.0.
   Ь hat keinen eigenen Laut und erhält deshalb bewusst keine isolierte Buchstabenaufnahme. */
(() => {
  const BASE='https://commons.wikimedia.org/wiki/Special:Redirect/file/';
  const PAGE='https://commons.wikimedia.org/wiki/File:';
  const norm=x=>String(x||'').normalize('NFC').toLocaleLowerCase('uk').replace(/[ʼ’‘'`]/g,'’').replace(/[.!?,…]/g,'').replace(/\s+/g,' ').trim();
  const AUDIO_POLICY=Object.freeze({mode:'human-only',ttsAllowed:false,aiVoiceAllowed:false,publicSourceRequired:true,formalCertificationClaimed:false,label:'Menschliche Originalaufnahme · Quelle geprüft'});
  const LL={speaker:'Tohaomg',project:'Lingua Libre / Wikimedia Commons',license:'CC BY-SA 4.0',human:true,language:'uk',sourceVerified:true,verification:'Lingua Libre/Wikimedia kennzeichnet die Datei als ukrainische menschliche Ausspracheaufnahme.'};
  const SH={speaker:'Галя Раптова',project:'Shtooka Project / Wikimedia Commons',license:'CC BY 3.0 US',human:true,language:'uk',sourceVerified:true,speakerOrigin:'Kyiv, Ukraine',verification:'Wikimedia Commons: ukrainische Aussprache, menschliche Sprecherin aus Kyiv, Ukraine.'};
  const ZH={speaker:'Женя Музика',project:'Shtooka Project / Wikimedia Commons',license:'CC BY 3.0 US',human:true,language:'uk',sourceVerified:true,verification:'Wikimedia Commons/Shtooka: menschliche ukrainische Ausspracheaufnahme.'};
  const SV={speaker:'Світлана Чурак',project:'Shtooka Project / Wikimedia Commons',license:'CC BY 3.0 US',human:true,language:'uk',sourceVerified:true,verification:'Wikimedia Commons/Shtooka: menschliche ukrainische Ausspracheaufnahme.'};
  const VA={speaker:'Василь Бабич',project:'Wikimedia Commons',license:'Public Domain',human:true,language:'uk',sourceVerified:true,verification:'Wikimedia Commons: menschliche ukrainische Originalaufnahme.'};
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
    'Ь':{file:'Uk-кінь.ogg',label:'кінь',...SH,note:'Ь hat keinen eigenen Laut; die menschliche Aufnahme zeigt die Weichheit des vorherigen Konsonanten.'},
    'Ю':{file:'Uk-юнак.ogg',label:'юнак',...SH},
    'Я':{file:'Uk-яблуко.ogg',label:'яблуко',...SH}
  };
  const audio={},meta={};
  Object.entries(rows).forEach(([letter,row])=>{
    const file=row.file;
    audio[letter]=BASE+encodeURIComponent(file).replace(/%2F/g,'/');
    meta[letter]={...row,kind:'human-word-pronunciation',policy:'human-only',source:PAGE+encodeURIComponent(file).replace(/%2F/g,'/')};
  });
  window.UKRAINIAN_AUDIO_POLICY=AUDIO_POLICY;
  window.UKRAINIAN_PRONUNCIATION_AUDIO=Object.freeze(audio);
  window.UKRAINIAN_PRONUNCIATION_META=Object.freeze(meta);

  // Additional common beginner words with already documented human recordings.
  // They are used only when an exact word match exists. There is never a synthetic fallback.
  const extraWords=[
    {label:'привіт',file:'Uk-привіт.ogg',...SH},
    {label:'дякую',file:'Uk-дякую.ogg',...SV},
    {label:'ні',file:'Uk-ні.ogg',...SH},
    {label:'добре',file:'Uk-добре.ogg',...SH},
    {label:'до побачення',file:'Uk-до побачення.ogg',...ZH},
    {label:'будь ласка',file:'Uk-будь ласка.ogg',...ZH},
    {label:'Мене звати',file:'Uk-Мене звати.ogg',...VA},
    {label:'звати',file:'Uk-звати.ogg',...SH},
    {label:'Я не знаю',file:'Uk-я не знаю.ogg',...SV},
    {label:'Німеччина',file:'Uk-Німеччина.ogg',...ZH},
    {label:'вода',file:'Uk-вода.ogg',...SH},
    {label:'аптека',file:'Uk-аптека.ogg',...SH},
    {label:'магазин',file:'Uk-магазин.ogg',...SH},
    {label:'автобус',file:'Uk-автобус.ogg',...SH},
    {label:'лікар',file:'Uk-лікар.ogg',...SH},
    {label:'тато',file:'Uk-тато.ogg',...SH},
    {label:'брат',file:'Uk-брат.ogg',...SH},
    {label:'туалет',file:'Uk-туалет.ogg',...SH},
    {label:'Україна',file:'Uk-Україна.ogg',...ZH}
  ];
  const wordAudio={},wordMeta={};
  const addWord=row=>{const key=norm(row.label);if(!key)return;const src=BASE+encodeURIComponent(row.file).replace(/%2F/g,'/');wordAudio[key]=src;wordMeta[key]={...row,kind:'human-word-pronunciation',policy:'human-only',source:PAGE+encodeURIComponent(row.file).replace(/%2F/g,'/')};};
  Object.values(rows).forEach(addWord);extraWords.forEach(addWord);
  window.UKRAINIAN_WORD_AUDIO=Object.freeze(wordAudio);
  window.UKRAINIAN_WORD_AUDIO_META=Object.freeze(wordMeta);

  // Wikimedia Commons category “Ukrainian pronunciation of letters by a young male uploaded by Tabrus”
  // contains exactly 32 sound-bearing Ukrainian letters. The files are original human recordings by
  // the uploader and are licensed CC BY-SA 4.0. Commons does not document a formal teaching/speaker
  // certification, so the UI must not invent such a credential. The soft sign Ь is intentionally absent.
  const alphabet='А Б В Г Ґ Д Е Є Ж З И І Ї Й К Л М Н О П Р С Т У Ф Х Ц Ч Ш Щ Ю Я'.split(' ');
  const letterAudio={},letterMeta={};
  alphabet.forEach(letter=>{
    const lower=letter.toLocaleLowerCase('uk');
    const file=`${letter}${lower} – ukrainian.ogg`;
    letterAudio[letter]=BASE+encodeURIComponent(file).replace(/%2F/g,'/');
    letterMeta[letter]={file,label:`${letter}${lower}`,speaker:'Tabrus',project:'Wikimedia Commons',license:'CC BY-SA 4.0',human:true,language:'uk',sourceVerified:true,formalCertificationVerified:false,verification:'Wikimedia Commons führt die Datei als menschliche Aussprache des ukrainischen Buchstabens und als Originalwerk des Uploaders.',kind:'isolated-letter-pronunciation',policy:'human-only',source:PAGE+encodeURIComponent(file).replace(/%2F/g,'/')};
  });
  window.UKRAINIAN_LETTER_AUDIO=Object.freeze(letterAudio);
  window.UKRAINIAN_LETTER_AUDIO_META=Object.freeze(letterMeta);
})();