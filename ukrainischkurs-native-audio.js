/* Ukrainischkurs für Joel · freie ukrainische Muttersprachler-Referenzen
   Quelle: Lingua Libre / Wikimedia Commons. Die Dateien werden unverändert gestreamt.
   Die jeweilige Dateiseite ist die maßgebliche Quelle für Lizenz und Attribution. */
(() => {
  const BASE='https://commons.wikimedia.org/wiki/Special:Redirect/file/';
  const PAGE='https://commons.wikimedia.org/wiki/File:';
  const rows={
    'А':['LL-Q8798 (ukr)-Tohaomg-Албанія.wav','Албанія'],
    'Б':['LL-Q8798 (ukr)-Tohaomg-Білорусь.wav','Білорусь'],
    'В':["LL-Q8798 (ukr)-Tohaomg-В'єтнам.wav","В'єтнам"],
    'Г':['LL-Q8798 (ukr)-Tohaomg-Гана.wav','Гана'],
    'Д':['LL-Q8798 (ukr)-Tohaomg-Данія.wav','Данія'],
    'Е':['LL-Q8798 (ukr)-Tohaomg-Естонія.wav','Естонія'],
    'Є':['LL-Q8798 (ukr)-Tohaomg-Єгипет.wav','Єгипет'],
    'З':['LL-Q8798 (ukr)-Tohaomg-Замбія.wav','Замбія'],
    'І':['LL-Q8798 (ukr)-Tohaomg-Італія.wav','Італія'],
    'Й':['LL-Q8798 (ukr)-Tohaomg-Йорданія.wav','Йорданія'],
    'К':['LL-Q8798 (ukr)-Tohaomg-Канада.wav','Канада'],
    'Л':['LL-Q8798 (ukr)-Tohaomg-Латвія.wav','Латвія'],
    'М':['LL-Q8798 (ukr)-Tohaomg-Малі.wav','Малі'],
    'Н':['LL-Q8798 (ukr)-Tohaomg-Непал.wav','Непал'],
    'О':['LL-Q8798 (ukr)-Tohaomg-Оман.wav','Оман'],
    'П':['LL-Q8798 (ukr)-Tohaomg-Перу.wav','Перу'],
    'Р':['LL-Q8798 (ukr)-Tohaomg-Руанда.wav','Руанда'],
    'С':['LL-Q8798 (ukr)-Tohaomg-Сербія.wav','Сербія'],
    'Т':['LL-Q8798 (ukr)-Tohaomg-Того.wav','Того'],
    'У':['LL-Q8798 (ukr)-Tohaomg-Уганда.wav','Уганда'],
    'Ф':['LL-Q8798 (ukr)-Tohaomg-Франція.wav','Франція']
  };
  const audio={},meta={};
  Object.entries(rows).forEach(([letter,[file,label]])=>{
    audio[letter]=BASE+encodeURIComponent(file).replace(/%2F/g,'/');
    meta[letter]={label,file,speaker:'Tohaomg',project:'Lingua Libre / Wikimedia Commons',source:PAGE+encodeURIComponent(file).replace(/%2F/g,'/'),license:'Freie Creative-Commons-Lizenz; genaue Lizenz auf der Dateiseite'};
  });
  window.UKRAINIAN_PRONUNCIATION_AUDIO=Object.freeze(audio);
  window.UKRAINIAN_PRONUNCIATION_META=Object.freeze(meta);
})();
