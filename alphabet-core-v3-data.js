'use strict';
const VERSION=3;
const DAY=86400000,HOUR=3600000,MIN=60000;
const ALPHABET='А Б В Г Ґ Д Е Є Ж З И І Ї Й К Л М Н О П Р С Т У Ф Х Ц Ч Ш Щ Ь Ю Я'.split(' ');
const LEARN_ORDER=['А','І','К','М','О','Т','Е','В','Н','Р','С','У','Х','Б','П','Д','Л','Ф','Г','Ґ','З','Ж','И','Ї','Й','Є','Ц','Ч','Ш','Щ','Ь','Ю','Я'];
const FAKE_FRIENDS=['В','Н','Р','С','У','Х'];
const LATIN_TRAPS={В:'B',Н:'H',Р:'P',С:'C',У:'Y',Х:'X'};
const HARD=new Set(['В','Г','Ґ','Е','Є','Ж','З','И','І','Ї','Й','Н','П','Р','С','У','Х','Ц','Ч','Ш','Щ','Ь','Ю','Я']);
const VOWELS=['А','Е','Є','И','І','Ї','О','У','Ю','Я'];
const SPECIAL=['Ь'];
const CONSONANTS=ALPHABET.filter(c=>!VOWELS.includes(c)&&!SPECIAL.includes(c));
const SOUND_GROUPS={
  'Г':['Ґ','Х'],'Ґ':['Г','К'],'Е':['Є','И'],'Є':['Е','Ї'],'Ж':['Ш','Щ'],'З':['С','Ц'],'И':['І','Е','Ї'],'І':['И','Ї','Й'],'Ї':['І','Й','Є'],'Й':['Ї','І','И'],
  'Н':['П','И','К'],'П':['Н','Р','Б'],'Р':['П','В','Б'],'С':['З','Ц','Є'],'У':['В','И','Ч'],'Х':['Г','К','Ж'],'Ц':['Ч','С','З'],'Ч':['Ц','Ш','Щ'],
  'Ш':['Щ','Ж','Ч'],'Щ':['Ш','Ж','Ч'],'Ь':['Й','І','Ї'],'Ю':['У','Я','Є'],'Я':['Ю','Є','Ї'],'В':['Б','У','Н'],'Б':['В','П','Р'],
  'А':['О','Я','Д'],'Д':['Л','А','П'],'К':['Х','Н','Ж'],'Л':['Д','П','И'],'М':['Н','И','Ш'],'О':['А','С','Ю'],'Т':['Г','П','І'],'Ф':['О','Х','Р']
};
const DATA={
'А':{lower:'а',ipa:'/a/',sound:'A wie in „Auto“',short:'A',word:'автобус',de:'Bus',note:'Form und Laut sind vertraut.'},
'Б':{lower:'б',ipa:'/b/',sound:'B wie in „Ball“',short:'B',word:'бабуся',de:'Oma',note:'Б = B. Nicht mit В verwechseln.'},
'В':{lower:'в',ipa:'/ʋ ~ w/',sound:'ähnlich deutschem W',short:'W/V',word:'вода',de:'Wasser',note:'Sieht wie B aus, klingt aber ungefähr W/V.'},
'Г':{lower:'г',ipa:'/ɦ/',sound:'stimmhaft gehauchtes H',short:'H/ɦ',word:'гора',de:'Berg',note:'Nicht deutsches G. Das harte G ist Ґ.'},
'Ґ':{lower:'ґ',ipa:'/ɡ/',sound:'hartes G wie in „Gast“',short:'G',word:'ґудзик',de:'Knopf',note:'Ґ = hartes G; Г = /ɦ/.'},
'Д':{lower:'д',ipa:'/d/',sound:'D wie in „Dach“',short:'D',word:'дім',de:'Haus',note:'Vertrauter Laut, neue Form.'},
'Е':{lower:'е',ipa:'/ɛ/',sound:'E wie in „Ecke“',short:'E',word:'екран',de:'Bildschirm',note:'Nicht mit Є verwechseln.'},
'Є':{lower:'є',ipa:'/jɛ/',sound:'je wie in „jetzt“',short:'JE',word:'єнот',de:'Waschbär',note:'Am Wortanfang ungefähr „je“.'},
'Ж':{lower:'ж',ipa:'/ʒ/',sound:'stimmhaftes Sch wie in „Garage“',short:'SCH stimmhaft',word:'жук',de:'Käfer',note:'Kontrast: Ж /ʒ/ ↔ Ш /ʃ/.'},
'З':{lower:'з',ipa:'/z/',sound:'stimmhaftes S wie in „Rose“',short:'S stimmhaft',word:'зуб',de:'Zahn',note:'З = /z/, С = /s/.'},
'И':{lower:'и',ipa:'/ɪ/',sound:'kurzes, offeneres I',short:'I/ɪ',word:'син',de:'Sohn',note:'Kein perfektes deutsches Gegenstück. Von І trennen.',audioIndex:1},
'І':{lower:'і',ipa:'/i/',sound:'klares I wie in „Igel“',short:'I',word:'ім’я',de:'Name',note:'І = klares /i/.'},
'Ї':{lower:'ї',ipa:'/ji/',sound:'ji',short:'JI',word:'їжа',de:'Essen',note:'Die zwei Punkte gehören dazu.'},
'Й':{lower:'й',ipa:'/j/',sound:'J wie in „Ja“',short:'J',word:'йогурт',de:'Joghurt',note:'Kurzes J.'},
'К':{lower:'к',ipa:'/k/',sound:'K wie in „Katze“',short:'K',word:'кіт',de:'Katze',note:'Form und Laut sind vertraut.'},
'Л':{lower:'л',ipa:'/l/',sound:'L wie in „Lampe“',short:'L',word:'лампа',de:'Lampe',note:'Vertrauter Laut, neue Form.'},
'М':{lower:'м',ipa:'/m/',sound:'M wie in „Mama“',short:'M',word:'мама',de:'Mama',note:'Form und Laut sind vertraut.'},
'Н':{lower:'н',ipa:'/n/',sound:'N wie in „Nase“',short:'N',word:'ніс',de:'Nase',note:'Sieht wie H aus, klingt N.'},
'О':{lower:'о',ipa:'/ɔ/',sound:'O wie in „Ofen“',short:'O',word:'око',de:'Auge',note:'Form und Laut sind vertraut.'},
'П':{lower:'п',ipa:'/p/',sound:'P wie in „Park“',short:'P',word:'парк',de:'Park',note:'Nicht mit Н oder Р verwechseln.'},
'Р':{lower:'р',ipa:'/r/',sound:'gerolltes R',short:'R',word:'рука',de:'Hand',note:'Sieht wie P aus, klingt R.'},
'С':{lower:'с',ipa:'/s/',sound:'scharfes S wie in „Hass“',short:'S',word:'сир',de:'Käse',note:'Sieht wie C aus, klingt S.'},
'Т':{lower:'т',ipa:'/t/',sound:'T wie in „Tag“',short:'T',word:'так',de:'Ja',note:'Großbuchstabe vertraut; Kleinbuchstabe separat prüfen.'},
'У':{lower:'у',ipa:'/u/',sound:'U wie in „Uhr“',short:'U',word:'урок',de:'Lektion',note:'Sieht wie Y aus, klingt U.'},
'Ф':{lower:'ф',ipa:'/f/',sound:'F wie in „Foto“',short:'F',word:'Франція',de:'Frankreich',note:'Neue Form, vertrauter Laut.'},
'Х':{lower:'х',ipa:'/x/',sound:'CH wie in „Bach“',short:'CH',word:'хата',de:'Haus',note:'Sieht wie X aus, klingt nicht „ks“.'},
'Ц':{lower:'ц',ipa:'/t͡s/',sound:'Z wie in „Zeit“',short:'TS/Z',word:'це',de:'dies',note:'Ц = ts, Ч = tsch.'},
'Ч':{lower:'ч',ipa:'/t͡ʃ/',sound:'tsch wie in „Tschüss“',short:'TSCH',word:'чай',de:'Tee',note:'Ч = tsch, Ц = ts.'},
'Ш':{lower:'ш',ipa:'/ʃ/',sound:'Sch wie in „Schule“',short:'SCH',word:'школа',de:'Schule',note:'Ш = sch; Щ ≈ schtsch.'},
'Щ':{lower:'щ',ipa:'/ʃt͡ʃ/',sound:'ungefähr sch + tsch',short:'SCHTSCH',word:'щука',de:'Hecht',note:'Bewusst gegen Ш trainieren.'},
'Ь':{lower:'ь',ipa:'—',sound:'kein eigener Laut',short:'WEICHHEITSZEICHEN',word:'кінь',de:'Pferd',note:'Ь macht den vorherigen Konsonanten weich.',audioIndex:3},
'Ю':{lower:'ю',ipa:'/ju/',sound:'ju wie in „Jubel“',short:'JU',word:'юнак',de:'junger Mann',note:'Am Wortanfang „ju“.'},
'Я':{lower:'я',ipa:'/ja/',sound:'ja',short:'JA',word:'яблуко',de:'Apfel',note:'Am Wortanfang „ja“.'}
};
const CONTRASTS=[['В','Б'],['Н','П'],['Р','П'],['С','З'],['У','В'],['Х','Г'],['Г','Ґ'],['І','И'],['Е','Є'],['Ж','Ш'],['Ш','Щ'],['Ц','Ч'],['Ї','Й'],['Б','Ь']];
const CORE_SKILLS=['visualToSound','soundToLetter','caseRecognition','audioToLetter','confusionDiscrimination'];
const SKILLS=[...CORE_SKILLS,'speedRecognition','findRecognition','memoryRecognition','trueFalse','writing'];
const KIND_SKILL={visual:'visualToSound',reverse:'soundToLetter',audio:'audioToLetter',lowercase:'caseRecognition',uppercase:'caseRecognition',contrast:'confusionDiscrimination',trueFalse:'confusionDiscrimination',memory:'memoryRecognition',find:'findRecognition',speed:'speedRecognition'};
const SKILL_LABELS={visualToSound:'Zeichen → Laut',soundToLetter:'Laut → Zeichen',caseRecognition:'Groß/Klein',audioToLetter:'Audio → Zeichen',confusionDiscrimination:'Verwechslungen',speedRecognition:'Schnellerkennung',findRecognition:'Visuelles Finden',memoryRecognition:'Kurzgedächtnis',trueFalse:'Richtig/Falsch',writing:'Schreiben'};
const INTERVALS=[2*MIN,10*MIN,30*MIN,6*HOUR,DAY,3*DAY,7*DAY,14*DAY,30*DAY];
const PROMPTS={
 visual:['Wie wird dieses Zeichen gelesen?','Welcher Laut gehört zu diesem Buchstaben?','Welcher Laut passt zu diesem Zeichen?','Wie würdest du diesen Buchstaben aussprechen?'],
 reverse:['Welcher Buchstabe entspricht diesem Laut?','Wähle das passende ukrainische Zeichen.','Welches Zeichen steht für diesen Laut?'],
 lowercase:['Welcher Kleinbuchstabe gehört dazu?','Finde die passende Kleinform.'],
 uppercase:['Welcher Großbuchstabe gehört dazu?','Finde die passende Großform.'],
 contrast:['Welches Zeichen passt zum genannten Laut?','Unterscheide die beiden Zeichen: Welches ist richtig?']
};