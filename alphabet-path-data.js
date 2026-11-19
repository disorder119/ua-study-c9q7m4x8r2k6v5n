'use strict';

// Alphabet Lab V7 · Lernpfad-Daten.
//
// Reine Daten, getrennt vom Code – wie die Audiodaten in
// ukrainischkurs-native-audio.js. alphabet-core-v7-path.js liest sie beim Start;
// fehlt diese Datei, bleibt die App ohne Lernpfad voll benutzbar.
//
// lessons:    Reihenfolge der Buchstaben. light = fast identisch mit dem
//             lateinischen Alphabet, deshalb weniger Einzelabfragen.
// letterInfo: say  = kurze deutsche Lautangabe (muss eindeutig sein),
//             hint = ein Satz, der das Zeichen verankert.
// wordRows:   [Wort, deutsche Bedeutung, Flag]. Flag 'x': Bedeutung nicht aus
//             dem Klang erschließbar – das Wort wird nur zum Aussprechen genutzt.
//             Die Lektion eines Wortes wird aus seinen Buchstaben BERECHNET;
//             die Zwischenkommentare sind nur Lesehilfe.
globalThis.ALPHABET_PATH_DATA=Object.freeze({
lessons:[
  {id:'l1',title:'Fast geschenkt',tagline:'Sechs Buchstaben, die du praktisch schon kennst.',letters:['А','О','К','М','Т','Е'],light:true},
  {id:'l2',title:'Falsche Freunde',tagline:'Sehen aus wie H, P und C – sind aber N, R und S.',letters:['Н','Р','С']},
  {id:'l3',title:'Noch mehr Verkleidung',tagline:'B, Y, X? Nein: W, U und CH.',letters:['В','У','Х']},
  {id:'l4',title:'Neue Formen',tagline:'Vier neue Zeichen für vier vertraute Laute.',letters:['Б','Д','П','Л']},
  {id:'l5',title:'Die i-Familie',tagline:'Drei Zeichen rund ums i – und ein j.',letters:['И','І','Й']},
  {id:'l6',title:'H, G und Co.',tagline:'Das Г ist kein G. Dazu З und Ф.',letters:['Г','Ґ','З','Ф']},
  {id:'l7',title:'Die Zischer',tagline:'Fünf Zeichen für sch, tsch und z.',letters:['Ж','Ш','Щ','Ч','Ц']},
  {id:'l8',title:'Ja, Ju, Je, Ji',tagline:'Die J-Vokale und das Weichheitszeichen – dann kannst du alles lesen.',letters:['Я','Ю','Є','Ї','Ь']}
],
letterInfo:{
  'А':{say:'a',hint:'Wie das deutsche A.'},
  'О':{say:'o',hint:'Wie O in „offen“.'},
  'К':{say:'k',hint:'Wie K. Der Kleinbuchstabe к sieht aus wie ein kleines großes K.'},
  'М':{say:'m',hint:'Wie M. Achtung: klein м – nicht m.'},
  'Т':{say:'t',hint:'Wie T. Klein: т.'},
  'Е':{say:'e',hint:'Wie E in „Bett“ – immer offen, nie „je“.'},
  'Н':{say:'n',hint:'Sieht aus wie H, ist aber N. Merke: Н wie „Nein, kein H“.'},
  'Р':{say:'r',hint:'Sieht aus wie P, ist aber ein gerolltes R.'},
  'С':{say:'s (scharf)',hint:'Sieht aus wie C, ist aber immer ein scharfes S wie in „Bus“.'},
  'В':{say:'w',hint:'Sieht aus wie B, klingt aber wie W in „Wasser“.'},
  'У':{say:'u',hint:'Sieht aus wie Y, ist aber U.'},
  'Х':{say:'ch',hint:'Sieht aus wie X, klingt wie ch in „Bach“.'},
  'Б':{say:'b',hint:'Das echte B: oben ein Dach, unten ein Bauch. В dagegen ist W.'},
  'Д':{say:'d',hint:'D – wie ein Haus auf zwei Füßen.'},
  'П':{say:'p',hint:'P – wie ein Tor. Verwandt mit dem griechischen π (Pi).'},
  'Л':{say:'l',hint:'L – wie ein Zeltdach. Verwandt mit dem griechischen Λ (Lambda).'},
  'И':{say:'y (dunkles i)',hint:'Ein kurzes, dunkles i – zwischen i und e. Sieht aus wie ein gespiegeltes N.'},
  'І':{say:'i',hint:'Das helle, klare i wie in „Liebe“.'},
  'Й':{say:'j',hint:'J wie in „ja“. Das Häkchen macht aus И ein kurzes j.'},
  'Г':{say:'h',hint:'Kein G! Ein weiches H. In Fremdwörtern steht Г oft, wo wir G oder H schreiben: гітара, гумор.'},
  'Ґ':{say:'g',hint:'Das echte G wie in „gut“ – ein Г mit Häkchen nach oben. Selten.'},
  'З':{say:'s (weich, wie „Sonne“)',hint:'Stimmhaftes S wie in „Sonne“. Sieht aus wie eine 3.'},
  'Ф':{say:'f',hint:'F – ein Kreis mit Strich. Verwandt mit dem griechischen φ (Phi).'},
  'Ж':{say:'sch (weich, wie „Journal“)',hint:'Stimmhaftes sch wie das J in „Journal“. Sieht aus wie ein Käfer.'},
  'Ш':{say:'sch',hint:'sch wie in „Schule“ – drei Zinken.'},
  'Щ':{say:'schtsch',hint:'Ш mit Schwänzchen: sch + tsch, wie in „Borschtsch“.'},
  'Ч':{say:'tsch',hint:'tsch wie in „Tschüss“. Sieht aus wie eine 4.'},
  'Ц':{say:'z (ts)',hint:'Z wie in „Zirkus“ – eine Schale mit Schwänzchen.'},
  'Я':{say:'ja',hint:'ja – sieht aus wie ein gespiegeltes R.'},
  'Ю':{say:'ju',hint:'ju wie in „Jubel“.'},
  'Є':{say:'je',hint:'je wie in „jetzt“. Nicht mit Е verwechseln.'},
  'Ї':{say:'ji',hint:'ji – das і mit zwei Punkten.'},
  'Ь':{say:'– (macht weich)',hint:'Weichheitszeichen: kein eigener Laut. Es macht den Konsonanten davor weich.'}
},
wordRows:[
  // nur А О К М Т Е
  ['мама','Mama'],['тато','Papa'],['атом','Atom'],['томат','Tomate'],['тема','Thema'],['комета','Komet'],['такт','Takt'],['акт','Akt'],['кома','Koma'],['какао','Kakao'],['атака','Attacke'],['тотем','Totem'],
  // + Н Р С
  ['ресторан','Restaurant'],['нота','Note'],['торт','Torte'],['сорт','Sorte'],['монстр','Monster'],['метро','Metro'],['мотор','Motor'],['трактор','Traktor'],['сенсор','Sensor'],['касета','Kassette'],['стрес','Stress'],['тенор','Tenor'],['ракета','Rakete'],['карта','Karte'],['маска','Maske'],['крем','Creme'],['роман','Roman'],['океан','Ozean'],['тест','Test'],['старт','Start'],['текст','Text'],['монета','Münze'],['антена','Antenne'],['оркестр','Orchester'],['сестра','Schwester'],['кран','Kran'],['трон','Thron'],['тон','Ton'],['актор','Schauspieler (Akteur)'],['ректор','Rektor'],['сектор','Sektor'],['нектар','Nektar'],['кратер','Krater'],['тостер','Toaster'],
  // + В У Х
  ['вата','Watte'],['курс','Kurs'],['тур','Tour'],['хор','Chor'],['хаос','Chaos'],['нерв','Nerv'],['вето','Veto'],['кактус','Kaktus'],['сауна','Sauna'],['автомат','Automat'],['авто','Auto'],['уран','Uran'],['характер','Charakter'],['хром','Chrom'],['сервер','Server'],['вектор','Vektor'],['ехо','Echo'],['турне','Tournee'],['страус','Strauß (Vogel)'],['соус','Soße'],['нокаут','Knockout'],['ванна','Badewanne'],['схема','Schema'],['монарх','Monarch'],['хакер','Hacker'],
  // + Б Д П Л
  ['банк','Bank'],['банан','Banane'],['лампа','Lampe'],['парк','Park'],['план','Plan'],['клуб','Klub'],['плакат','Plakat'],['балкон','Balkon'],['блок','Block'],['студент','Student'],['адреса','Adresse'],['доктор','Doktor'],['паспорт','Reisepass'],['спорт','Sport'],['суп','Suppe'],['опера','Oper'],['салат','Salat'],['бар','Bar'],['театр','Theater'],['проблема','Problem'],['поет','Dichter (Poet)'],['бокс','Boxen'],['десерт','Dessert'],['радар','Radar'],['балет','Ballett'],['компас','Kompass'],['салон','Salon'],['долар','Dollar'],['канал','Kanal'],['метал','Metall'],['секунда','Sekunde'],['краб','Krabbe'],['дракон','Drache'],['лак','Lack'],['депо','Depot'],['продукт','Produkt'],['документ','Dokument'],['апарат','Apparat'],['солдат','Soldat'],['стандарт','Standard'],['бутерброд','Butterbrot'],['клоун','Clown'],['адвокат','Anwalt (Advokat)'],
  // + И І Й
  ['кіно','Kino'],['таксі','Taxi'],['радіо','Radio'],['турист','Tourist'],['титан','Titan'],['ритм','Rhythmus'],['клімат','Klima'],['лимон','Zitrone (Limone)'],['йод','Jod'],['трамвай','Tram'],['хокей','Hockey'],['сайт','Website'],['кіоск','Kiosk'],['вірус','Virus'],['аспірин','Aspirin'],['вітамін','Vitamin'],['інтернет','Internet'],['стадіон','Stadion'],['мінус','Minus'],['пілот','Pilot'],['бікіні','Bikini'],['критик','Kritiker'],['клініка','Klinik'],['політика','Politik'],['титул','Titel'],['тип','Typ'],['директор','Direktor'],['університет','Universität'],['койот','Kojote'],['рис','Reis'],['міксер','Mixer'],['апетит','Appetit'],['бандит','Bandit'],['кредит','Kredit'],['ліміт','Limit'],['мотив','Motiv'],['архів','Archiv'],['інститут','Institut'],['пірат','Pirat'],['піаніно','Klavier (Piano)'],['кабіна','Kabine'],['тролейбус','O-Bus (Trolleybus)'],
  // + Г Ґ З Ф
  ['газ','Gas'],['гітара','Gitarre'],['грам','Gramm'],['гол','Tor (Goal)'],['гумор','Humor'],['зебра','Zebra'],['зона','Zone'],['ваза','Vase'],['музей','Museum'],['фото','Foto'],['фірма','Firma'],['кафе','Café'],['фабрика','Fabrik'],['телефон','Telefon'],['факт','Fakt'],['фокус','Fokus'],['футбол','Fußball'],['офіс','Office'],['магазин','Laden (Magazin)'],['йогурт','Joghurt'],['тигр','Tiger'],['ґрунт','Boden (Grund)'],['зиґзаґ','Zickzack'],['ґудзик','Knopf','x'],['грип','Grippe'],['геній','Genie'],['графік','Grafik'],['логіка','Logik'],['програма','Programm'],['група','Gruppe'],['гігант','Gigant'],['горизонт','Horizont'],['гормон','Hormon'],['гімн','Hymne'],['гамбургер','Hamburger'],['візит','Besuch (Visite)'],['музика','Musik'],['приз','Preis'],['казино','Kasino'],['бензин','Benzin'],['форма','Form'],['фрукт','Frucht'],['фігура','Figur'],['сейф','Tresor (Safe)'],['фен','Föhn'],['кефір','Kefir'],['глобус','Globus'],['фонтан','Fontäne'],['зоопарк','Zoo'],['магніт','Magnet'],['сигнал','Signal'],['регіон','Region'],['легенда','Legende'],['агент','Agent'],
  // + Ж Ш Щ Ч Ц
  ['журнал','Journal'],['гараж','Garage'],['жираф','Giraffe'],['шоколад','Schokolade'],['шеф','Chef'],['машина','Maschine / Auto'],['душ','Dusche'],['шанс','Chance'],['шок','Schock'],['чек','Kassenbon (Scheck)'],['чемпіон','Champion'],['матч','Match'],['чат','Chat'],['чай','Tee (Chai)'],['центр','Zentrum'],['цирк','Zirkus'],['піца','Pizza'],['концерт','Konzert'],['цемент','Zement'],['борщ','Borschtsch'],['жакет','Jackett'],['багаж','Gepäck (Bagage)'],['інженер','Ingenieur'],['джаз','Jazz'],['джинси','Jeans'],['шарф','Schal'],['шторм','Sturm'],['шпинат','Spinat'],['штат','Bundesstaat'],['фініш','Ziel (Finish)'],['чіпси','Chips'],['цифра','Ziffer'],['цукор','Zucker'],['офіцер','Offizier'],['процент','Prozent'],['рецепт','Rezept'],['шашлик','Schaschlik'],['штраф','Strafe'],['шахта','Bergwerk (Schacht)'],['шахи','Schach'],['маршрут','Route (Marschroute)'],['брошура','Broschüre'],['жест','Geste'],['монтаж','Montage'],['масаж','Massage'],['пошта','Post'],['акцент','Akzent'],['сцена','Bühne (Szene)'],['цент','Cent'],['що','was','x'],['ще','noch','x'],['дощ','Regen','x'],['плащ','Regenmantel','x'],
  // + Я Ю Є Ї Ь
  ['Європа','Europa'],['євро','Euro'],['Україна','Ukraine'],['меню','Menü'],['юрист','Jurist'],['бюро','Büro'],['костюм','Anzug (Kostüm)'],['Японія','Japan'],['яхта','Jacht'],['ягуар','Jaguar'],['Італія','Italien'],['Австрія','Österreich (Austria)'],['фільм','Film'],['готель','Hotel'],['модель','Modell'],['кабель','Kabel'],['автомобіль','Automobil'],['стиль','Stil'],['альбом','Album'],['Берлін','Berlin'],['комп’ютер','Computer'],['інтерв’ю','Interview'],['ідея','Idee'],['Київ','Kyjiw'],['Англія','England'],['проєкт','Projekt'],['об’єкт','Objekt'],['мільйон','Million'],['бульйон','Brühe (Bouillon)'],['ансамбль','Ensemble'],['шампунь','Shampoo'],['лінія','Linie'],['студія','Studio'],['армія','Armee'],['партія','Partei'],['хімія','Chemie'],['історія','Geschichte (Historie)'],['Польща','Polen'],['Швейцарія','Schweiz'],['ювелір','Juwelier'],['Єгипет','Ägypten'],['поліція','Polizei'],['порція','Portion'],['фантазія','Fantasie'],['копія','Kopie'],['мільярд','Milliarde'],['тюльпан','Tulpe'],['сюрприз','Überraschung (Surprise)'],['Ямайка','Jamaika'],['Ізраїль','Israel'],['мозаїка','Mosaik'],['наївний','naiv'],['пальма','Palme'],['фільтр','Filter'],['нуль','Null'],['роль','Rolle'],['медаль','Medaille'],['тунель','Tunnel'],['апельсин','Orange (Apfelsine)'],['вафля','Waffel']
]
});
