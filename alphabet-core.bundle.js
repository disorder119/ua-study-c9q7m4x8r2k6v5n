'use strict';
/* Alphabet Lab V6.1 core bundle · generated deterministically */

/* source: alphabet-core-v3-data.js */
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

/* source: alphabet-core-v3-model.js */
'use strict';

const uniq=a=>[...new Set(a)];
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
function shuffle(a,rng=Math.random){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a}
function id(prefix='id'){return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,9)}`}
function localDateKey(value=Date.now()){const d=value instanceof Date?value:new Date(value);const y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,'0'),day=String(d.getDate()).padStart(2,'0');return `${y}-${m}-${day}`}
function todayFrom(now=Date.now()){return localDateKey(now)}
function localDayNumber(key){const m=String(key||'').match(/^(\d{4})-(\d{2})-(\d{2})$/);return m?new Date(Number(m[1]),Number(m[2])-1,Number(m[3]),12).getTime():NaN}
function daysBetween(a,b){const x=localDayNumber(a),y=localDayNumber(b);return Number.isFinite(x)&&Number.isFinite(y)?Math.round((y-x)/DAY):0}
function skillForKind(kind){return KIND_SKILL[kind]||'visualToSound'}
function freshSkill(){return {attempts:0,independentAttempts:0,repairAttempts:0,correct:0,wrong:0,independentCorrect:0,independentWrong:0,repairCorrect:0,repairWrong:0,recentResults:[],currentStreak:0,lastIndependentAt:0,lastRepairAt:0,lastWrongAt:0,dueAt:0,intervalIndex:0,lapses:0,repairPending:false,repairTarget:'',successDays:[],timedAttempts:0,totalValidLatencyMs:0,legacyAttempts:0}}
function freshLetter(){const skills={};SKILLS.forEach(k=>skills[k]=freshSkill());return {seen:0,correct:0,wrong:0,lastAt:0,lastAnswer:'',lastWrongAnswer:'',lastWrongAt:0,writeDays:[],confusions:{},skills,lapses:0,trapStats:{latinLookalike:{attempts:0,wrong:0,recentWrong:[],lastWrongAt:0,latinTrap:''}}}}
function freshState(){const letters={};ALPHABET.forEach(c=>letters[c]=freshLetter());return {version:VERSION,createdAt:Date.now(),lastStudy:'',studyDays:[],streak:0,xp:0,letters,answerLog:[],examHistory:[],diagnostic:null,badges:[],masteryChecks:{final:[],fake:[],audio:[],retention:[]},bookmarks:[],settings:{audio:true}}}
function normalizeSkill(raw={}){const s={...freshSkill(),...raw};s.successDays=uniq(Array.isArray(raw.successDays)?raw.successDays.filter(Boolean):[]).sort();s.recentResults=Array.isArray(raw.recentResults)?raw.recentResults.slice(-12):[];s.timedAttempts=Math.max(0,Number(raw.timedAttempts)||0);s.totalValidLatencyMs=Math.max(0,Number(raw.totalValidLatencyMs)||0);return s}
function migrateLegacyKindStats(old,out){const map={visual:'visualToSound',reverse:'soundToLetter',audio:'audioToLetter',lowercase:'caseRecognition',uppercase:'caseRecognition',contrast:'confusionDiscrimination',trueFalse:'confusionDiscrimination',memory:'memoryRecognition',find:'findRecognition',speed:'speedRecognition'};for(const [kind,skill] of Object.entries(map)){const k=old.kindStats?.[kind];if(!k)continue;const s=out.skills[skill],n=(Number(k.correct)||0)+(Number(k.wrong)||0);s.attempts+=n;s.independentAttempts+=n;s.correct+=Number(k.correct)||0;s.wrong+=Number(k.wrong)||0;s.independentCorrect+=Number(k.correct)||0;s.independentWrong+=Number(k.wrong)||0;s.legacyAttempts+=n;s.lastIndependentAt=Math.max(s.lastIndependentAt,Number(k.lastAt)||0)} }
function migrateLetter(old={}){const out=freshLetter();out.seen=Number(old.seen)||0;out.correct=Number(old.correct)||0;out.wrong=Number(old.wrong)||0;out.lastAt=Number(old.lastAt||old.last)||0;out.lastAnswer=String(old.lastAnswer||'');out.lastWrongAnswer=String(old.lastWrongAnswer||'');out.lastWrongAt=Number(old.lastWrongAt)||0;out.writeDays=uniq(Array.isArray(old.writeDays)?old.writeDays.filter(Boolean):[]).sort();out.confusions={...(old.confusions||{})};out.lapses=Number(old.lapses)||0;out.trapStats={latinLookalike:{...out.trapStats.latinLookalike,...(old.trapStats?.latinLookalike||{})}};
 if(old.skills){for(const k of SKILLS)out.skills[k]=normalizeSkill(old.skills[k]||{})}
 else if(old.kindStats)migrateLegacyKindStats(old,out);
 else if(out.correct+out.wrong){const s=out.skills.visualToSound,n=out.correct+out.wrong;s.attempts=n;s.independentAttempts=n;s.correct=out.correct;s.wrong=out.wrong;s.independentCorrect=out.correct;s.independentWrong=out.wrong;s.legacyAttempts=n}
 // Legacy timing is deliberately NOT migrated as timed evidence.
 for(const k of SKILLS){out.skills[k].timedAttempts=Number(old.skills?.[k]?.timedAttempts)||0;out.skills[k].totalValidLatencyMs=Number(old.skills?.[k]?.totalValidLatencyMs)||0}
 if(!old.skills&&Array.isArray(old.successDays))out.skills.visualToSound.successDays=uniq(old.successDays.filter(Boolean)).sort();
 return out}
function migrate(raw){const base=freshState();if(!raw||typeof raw!=='object')return base;const out={...base,...raw,version:VERSION,letters:{},masteryChecks:{...base.masteryChecks,...(raw.masteryChecks||{})},settings:{...base.settings,...(raw.settings||{})}};ALPHABET.forEach(c=>out.letters[c]=migrateLetter(raw.letters?.[c]||{}));out.answerLog=Array.isArray(raw.answerLog)?raw.answerLog.slice(-1200):[];out.examHistory=Array.isArray(raw.examHistory)?raw.examHistory.slice(0,80):[];out.studyDays=uniq(Array.isArray(raw.studyDays)?raw.studyDays:(raw.lastStudy?[raw.lastStudy]:[])).sort();out.bookmarks=Array.isArray(raw.bookmarks)?raw.bookmarks.slice(-100):[];out.badges=uniq(Array.isArray(raw.badges)?raw.badges:[]);return out}
function touchStudy(state,now=Date.now()){const day=localDateKey(now);if(!state.studyDays.includes(day))state.studyDays.push(day);state.studyDays=uniq(state.studyDays).sort();const prev=state.lastStudy;if(prev!==day){state.streak=prev&&daysBetween(prev,day)===1?(state.streak||0)+1:1;state.lastStudy=day}return state}
function recentAccuracy(skill,limit=10){const rows=(skill.recentResults||[]).filter(x=>x&&x.independent!==false).slice(-limit);return rows.length?rows.filter(x=>x.good).length/rows.length:null}
function independentAccuracy(skill){const n=skill.independentCorrect+skill.independentWrong;return n?skill.independentCorrect/n:null}
function retentionFactor(skill,hard=false){const need=hard?4:3;return clamp(uniq(skill.successDays||[]).length/need,0,1)}
function avgSkillLatency(skill){return skill.timedAttempts?Math.round(skill.totalValidLatencyMs/skill.timedAttempts):0}
function speedFactor(skill){const avg=avgSkillLatency(skill);if(skill.timedAttempts<3||!avg)return .55;return clamp((3200-avg)/2200,0,1)}
function skillMastery(state,c,skillName,now=Date.now()){const s=state.letters[c].skills[skillName]||freshSkill();const n=s.independentAttempts;if(!n)return 0;const recent=recentAccuracy(s);const life=independentAccuracy(s);const retention=retentionFactor(s,HARD.has(c));let score=((recent==null?life:recent)*.65+(life??0)*.2+retention*.15)*100;const evidence=clamp(n/6,0,1);score*=.45+.55*evidence;if(skillName==='speedRecognition')score=(score*.7+speedFactor(s)*30);if(s.repairPending)score-=12;const freshWrong=(s.recentResults||[]).slice(-5).filter(x=>!x.good).length;score-=freshWrong*4;if(s.dueAt&&s.dueAt<now-14*DAY)score*=.9;return Math.round(clamp(score,0,100))}
function coreSkillScores(state,c,now=Date.now()){return Object.fromEntries(CORE_SKILLS.map(k=>[k,skillMastery(state,c,k,now)]))}
function retentionDaysForLetter(state,c){const days=[];for(const k of CORE_SKILLS)days.push(...(state.letters[c].skills[k]?.successDays||[]));return uniq(days).sort()}
function letterMastery(state,c,now=Date.now()){const scores=Object.values(coreSkillScores(state,c,now));const avg=scores.reduce((a,b)=>a+b,0)/scores.length,min=Math.min(...scores);return Math.round(avg*.6+min*.4)}
function letterReady(state,c,now=Date.now()){const scores=coreSkillScores(state,c,now),m=state.letters[c];return CORE_SKILLS.every(k=>scores[k]>=82)&&retentionDaysForLetter(state,c).length>=(HARD.has(c)?4:3)&&m.writeDays.length>=1&&!CORE_SKILLS.some(k=>m.skills[k].repairPending)}
function letterStatus(state,c,now=Date.now()){const m=state.letters[c],ind=CORE_SKILLS.reduce((a,k)=>a+(m.skills[k]?.independentAttempts||0),0);if(ind===0)return 'Noch nicht gelernt';if(ind<=2)return 'Neu';if(ind<8)return 'Lernen';if(letterReady(state,c,now))return 'Sicher';const scores=Object.values(coreSkillScores(state,c,now)),min=Math.min(...scores);if(min>=72&&retentionDaysForLetter(state,c).length>=2)return 'Stabil';return 'Unsicher'}
function problemFlag(state,c){const m=state.letters[c],rep=CORE_SKILLS.find(k=>m.skills[k]?.repairPending),conf=Object.entries(m.confusions||{}).sort((a,b)=>b[1]-a[1])[0];if(rep)return `offene Reparatur: ${SKILL_LABELS[rep]}`;if(conf&&conf[1]>=2)return `Verwechslung mit ${conf[0]}`;if(LATIN_TRAPS[c]&&m.trapStats.latinLookalike.recentWrong.filter(Boolean).length>=2)return `lateinische ${LATIN_TRAPS[c]}-Falle`;return ''}
function fastThreshold(skill){return skill==='speedRecognition'?1400:skill==='visualToSound'||skill==='soundToLetter'?2200:3000}
function scheduleSkill(s,good,{isRepair=false,latencyMs=0,skill='visualToSound',now=Date.now()}={}){if(isRepair){if(good){s.repairPending=false;s.repairTarget='';s.dueAt=now+30*MIN}else{s.repairPending=true;s.dueAt=now+2*MIN}return s.dueAt}if(!good){s.intervalIndex=Math.max(0,s.intervalIndex-2);s.dueAt=now+INTERVALS[0];s.repairPending=true;return s.dueAt}s.repairPending=false;s.repairTarget='';const slow=latencyMs>0&&latencyMs>fastThreshold(skill)*1.6;s.intervalIndex=slow?Math.max(1,s.intervalIndex):Math.min(INTERVALS.length-1,s.intervalIndex+1);s.dueAt=now+INTERVALS[s.intervalIndex];return s.dueAt}
function noteLatinTrap(letter,good,now){if(!LATIN_TRAPS[letter])return;const t=this||null}
function recordAnswer(state,opts={}){let {letter,good,kind='visual',skill=skillForKind(kind),selected='',expected='',confusedWith='',ms=0,latencyMs=ms,latencyValid=true,now=Date.now(),source='practice',firstAttempt=true,isRepair=false,repairLevel=0,attemptId=id('a'),questionId='',sessionId='',parentAttemptId='',originalQuestionId='',createdFromError=false,scheduledReason='',repairForSkill=''}=opts;if(!ALPHABET.includes(letter))throw new Error('Unknown letter '+letter);if(!SKILLS.includes(skill))skill=skillForKind(kind);const m=state.letters[letter],s=m.skills[skill]||(m.skills[skill]=freshSkill()),day=localDateKey(now),independent=!isRepair&&firstAttempt!==false;touchStudy(state,now);m.seen++;m.lastAt=now;m.lastAnswer=String(selected||'');s.attempts++;if(isRepair)s.repairAttempts++;else s.independentAttempts++;
 if(good){m.correct++;s.correct++;s.currentStreak++;if(isRepair){s.repairCorrect++;s.lastRepairAt=now;state.xp+=3}else{s.independentCorrect++;s.lastIndependentAt=now;state.xp+=kind==='speed'?12:10;if(CORE_SKILLS.includes(skill)&&!s.successDays.includes(day))s.successDays.push(day);if(latencyValid&&Number(latencyMs)>0){s.timedAttempts++;s.totalValidLatencyMs+=Number(latencyMs)}}}
 else{m.wrong++;m.lastWrongAnswer=String(selected||'');m.lastWrongAt=now;s.wrong++;s.currentStreak=0;s.lastWrongAt=now;s.lapses++;m.lapses++;if(isRepair){s.repairWrong++;s.lastRepairAt=now}else{s.independentWrong++;s.lastIndependentAt=now}s.repairPending=true;s.repairTarget=String(confusedWith||selected||'');state.xp+=1;if(confusedWith&&ALPHABET.includes(confusedWith)&&confusedWith!==letter)m.confusions[confusedWith]=(m.confusions[confusedWith]||0)+1}
 if(independent)s.recentResults.push({good:!!good,at:now,independent:true,latencyMs:latencyValid?Number(latencyMs)||0:0});s.recentResults=s.recentResults.slice(-12);scheduleSkill(s,!!good,{isRepair,latencyMs:latencyValid?Number(latencyMs)||0:0,skill,now});if(isRepair&&repairForSkill&&state.letters[letter].skills[repairForSkill]){const origin=state.letters[letter].skills[repairForSkill];if(good){origin.repairPending=false;origin.repairTarget='';origin.dueAt=Math.min(origin.dueAt||Infinity,now+30*MIN)}else{origin.repairPending=true;origin.dueAt=Math.min(origin.dueAt||Infinity,now+2*MIN)}}
 if(LATIN_TRAPS[letter]&&independent&&(skill==='visualToSound'||skill==='confusionDiscrimination')){const t=m.trapStats.latinLookalike;t.attempts++;t.latinTrap=LATIN_TRAPS[letter];if(!good){t.wrong++;t.lastWrongAt=now;t.recentWrong.push(1)}else t.recentWrong.push(0);t.recentWrong=t.recentWrong.slice(-8)}
 const row={attemptId,questionId,sessionId,parentAttemptId,originalQuestionId,letter,skill,type:kind,firstAttempt:!!firstAttempt,isRepair:!!isRepair,repairLevel:Number(repairLevel)||0,createdFromError:!!createdFromError,scheduledReason:String(scheduledReason||''),selected:String(selected||''),expected:String(expected||''),correct:!!good,shownAt:Number(opts.shownAt)||0,answeredAt:now,latencyMs:latencyValid?Math.max(0,Number(latencyMs)||0):0,latencyValid:!!latencyValid,source,date:day};state.answerLog.push(row);state.answerLog=state.answerLog.slice(-1200);return row}
function recordWriting(state,c,now=Date.now()){const day=localDateKey(now),m=state.letters[c],s=m.skills.writing;if(!m.writeDays.includes(day))m.writeDays.push(day);s.attempts++;s.independentAttempts++;s.correct++;s.independentCorrect++;if(!s.successDays.includes(day))s.successDays.push(day);touchStudy(state,now);state.xp+=4;return state}
function topConfusions(state,limit=10){const agg={};for(const c of ALPHABET)for(const [other,n] of Object.entries(state.letters[c].confusions||{})){const key=[c,other].sort().join(' ↔ ');agg[key]=(agg[key]||0)+Number(n||0)}return Object.entries(agg).sort((a,b)=>b[1]-a[1]).slice(0,limit)}
function recentWrongCount(state,c,window=8){let n=0;for(const k of CORE_SKILLS)n+=(state.letters[c].skills[k].recentResults||[]).slice(-window).filter(x=>!x.good).length;return n}
function errorPriority(state,c,now=Date.now()){const m=state.letters[c],open=CORE_SKILLS.filter(k=>m.skills[k].repairPending).length,recent=recentWrongCount(state,c,8),low=100-letterMastery(state,c,now),overdue=CORE_SKILLS.filter(k=>m.skills[k].dueAt&&m.skills[k].dueAt<=now).length,lapses=CORE_SKILLS.reduce((a,k)=>a+m.skills[k].lapses,0),conf=Object.values(m.confusions||{}).reduce((a,b)=>a+Number(b||0),0);return open*40+recent*12+low*.5+overdue*5+Math.min(15,lapses*2)+Math.min(12,conf)-Math.min(12,retentionDaysForLetter(state,c).length*2)}
function weakLetters(state,limit=10,now=Date.now(),rng=Math.random){const arr=ALPHABET.map(c=>({c,score:letterMastery(state,c,now),evidence:CORE_SKILLS.reduce((a,k)=>a+state.letters[c].skills[k].independentAttempts,0),tie:rng()}));return arr.sort((a,b)=>a.score-b.score||a.evidence-b.evidence||a.tie-b.tie).slice(0,limit).map(x=>x.c)}
function errorLetters(state,now=Date.now()){return ALPHABET.filter(c=>state.letters[c].wrong>0||CORE_SKILLS.some(k=>state.letters[c].skills[k].repairPending)).sort((a,b)=>errorPriority(state,b,now)-errorPriority(state,a,now))}
function dueSkillPairs(state,now=Date.now()){const out=[];for(const c of ALPHABET)for(const skill of CORE_SKILLS){const s=state.letters[c].skills[skill];if((s.independentAttempts>0||s.repairPending)&&s.dueAt<=now)out.push({letter:c,skill,dueAt:s.dueAt,repairPending:s.repairPending})}return out.sort((a,b)=>(b.repairPending-a.repairPending)||a.dueAt-b.dueAt)}
function dueLetters(state,now=Date.now()){return uniq(dueSkillPairs(state,now).map(x=>x.letter))}
function secureLetters(state,now=Date.now()){return ALPHABET.filter(c=>letterReady(state,c,now))}
function personalConfusions(state,letter){return Object.entries(state.letters[letter].confusions||{}).sort((a,b)=>b[1]-a[1]).map(x=>x[0]).filter(x=>ALPHABET.includes(x)&&x!==letter)}

/* source: alphabet-core-v3-exam.js */
'use strict';
function buildDistractors({state,letter,skill='visualToSound',count=3,rng=Math.random,repairTarget=''}){const pool=[];pool.push(...personalConfusions(state,letter));if(repairTarget&&ALPHABET.includes(repairTarget)&&repairTarget!==letter)pool.push(repairTarget);pool.push(...(SOUND_GROUPS[letter]||[]));if(FAKE_FRIENDS.includes(letter))pool.push(...FAKE_FRIENDS.filter(x=>x!==letter));pool.push(...shuffle(ALPHABET.filter(x=>x!==letter),rng));return uniq(pool).filter(x=>x!==letter).slice(0,count)}
function prompt(type,rng=Math.random){const list=PROMPTS[type]||PROMPTS.visual;return list[Math.floor(rng()*list.length)]}
function letterOptions(state,letter,skill,rng,count=4,repairTarget=''){return shuffle([letter,...buildDistractors({state,letter,skill,count:count-1,rng,repairTarget})],rng)}
function soundOptions(state,letter,skill,rng,count=4,repairTarget=''){const letters=letterOptions(state,letter,skill,rng,count,repairTarget);return shuffle(uniq([DATA[letter].sound,...letters.filter(x=>x!==letter).map(x=>DATA[x].sound)]).slice(0,count),rng)}
function makeTask(letter,type,state,rng=Math.random,meta={}){const d=DATA[letter],skill=skillForKind(type),base={questionId:id('q'),sessionId:meta.sessionId||'',parentAttemptId:meta.parentAttemptId||'',originalQuestionId:meta.originalQuestionId||'',letter,skill,type,isRepair:!!meta.isRepair,repairLevel:Number(meta.repairLevel)||0,createdFromError:!!meta.createdFromError,scheduledReason:meta.scheduledReason||'exam',firstAttempt:!meta.isRepair};const repairTarget=state.letters[letter].skills[skill]?.repairTarget||'';
 if(type==='visual'||type==='speed'||type==='memory')return {...base,prompt:prompt('visual',rng),display:letter,correct:d.sound,options:soundOptions(state,letter,skill,rng,4,repairTarget)};
 if(type==='reverse'||type==='find')return {...base,prompt:type==='find'?`Wähle ${letter}.`:prompt('reverse',rng),correct:letter,options:letterOptions(state,letter,skill,rng,4,repairTarget)};
 if(type==='audio')return {...base,prompt:letter==='Ь'?'Hör das Referenzwort. Welches Zeichen macht den letzten Konsonanten weich?':`Hör das Referenzwort. Welches Zeichen gehört an Position ${(d.audioIndex??0)+1}?`,correct:letter,options:letterOptions(state,letter,skill,rng,4,repairTarget),audioWord:d.word,audioIndex:d.audioIndex??0,requiresHumanAudio:true};
 if(type==='lowercase')return {...base,prompt:prompt('lowercase',rng),display:letter,correct:d.lower,options:shuffle(uniq([d.lower,...buildDistractors({state,letter,skill,count:3,rng,repairTarget}).map(x=>DATA[x].lower)]),rng)};
 if(type==='uppercase')return {...base,prompt:prompt('uppercase',rng),display:d.lower,correct:letter,options:letterOptions(state,letter,skill,rng,4,repairTarget)};
 if(type==='contrast'){const other=buildDistractors({state,letter,skill,count:1,rng,repairTarget})[0]||SOUND_GROUPS[letter]?.[0]||ALPHABET.find(x=>x!==letter);return {...base,prompt:prompt('contrast',rng),display:`${letter} · ${other}`,correct:letter,options:shuffle([letter,other],rng),confusionTarget:other}}
 if(type==='trueFalse'){const other=buildDistractors({state,letter,skill,count:1,rng,repairTarget})[0],truth=rng()>.45,shown=truth?d.sound:DATA[other].sound;return {...base,prompt:`Richtig oder falsch: ${letter} = ${shown}`,correct:truth?'Richtig':'Falsch',options:['Richtig','Falsch'],asserted:shown,confusionTarget:other}}
 return makeTask(letter,'visual',state,rng,meta)}
function plausibleSyllable(letter,rng=Math.random){if(SPECIAL.includes(letter))return rng()>.5?'нь':'ль';if(VOWELS.includes(letter)){const c=CONSONANTS[Math.floor(rng()*CONSONANTS.length)];return (c+DATA[letter].lower).toLocaleLowerCase('uk')}const v=VOWELS[Math.floor(rng()*VOWELS.length)];return (DATA[letter].lower+DATA[v].lower).toLocaleLowerCase('uk')}
function variantizeTask(base,index,scope,rng=Math.random,state=null){
 if(scope==='audio'||scope==='speed'||scope==='diagnostic'||scope.includes('certification')||base.isRepair)return base;
 const c=base.letter,conf=SOUND_GROUPS[c]||[],pickOthers=n=>shuffle(ALPHABET.filter(x=>x!==c),rng).slice(0,n),slot=index%13,sessionId=base.sessionId||'';
 if(slot===2)return {...base,type:'find',skill:'findRecognition',variant:'visual-chaos',prompt:`Finde ${c} im Zeichenfeld.`,display:'',correct:c,options:shuffle(uniq([c,...conf,...pickOthers(7)]).slice(0,8),rng)};
 if(slot===4){const display=plausibleSyllable(c,rng);return {...base,type:'find',skill:'findRecognition',variant:'nonsense-syllable',display,prompt:`Unsinnssilbe „${display}“: Welches Zielzeichen wird hier trainiert?`,correct:c,options:shuffle(uniq([c,...conf,...pickOthers(3)]).slice(0,4),rng)}}
 if(slot===6){const other=conf[0]||pickOthers(1)[0],wrongLower=DATA[other].lower,correct=`${c} – ${DATA[c].lower}`;return {...base,type:'lowercase',skill:'caseRecognition',variant:'pair-match',display:c,prompt:'Welches Groß-/Klein-Paar gehört korrekt zusammen?',correct,options:shuffle([correct,`${c} – ${wrongLower}`,`${other} – ${DATA[c].lower}`,`${other} – ${wrongLower}`],rng)}}
 if(slot===8){const group=uniq([c,...conf]).slice(0,3),unrelated=ALPHABET.find(x=>!group.includes(x)&&!(SOUND_GROUPS[c]||[]).includes(x))||pickOthers(1)[0];return {...base,type:'contrast',skill:'confusionDiscrimination',variant:'odd-one-out',display:shuffle([...group,unrelated],rng).join(' · '),prompt:`Welches Zeichen passt NICHT zur Verwechslungsgruppe rund um ${c}?`,correct:unrelated,options:shuffle([...group,unrelated],rng)}}
 if(slot===10&&scope!=='fake'){const opts=shuffle(uniq([c,...pickOthers(3)]).slice(0,4),rng),correct=[...opts].sort((a,b)=>ALPHABET.indexOf(a)-ALPHABET.indexOf(b))[0];return {...base,letter:correct,type:'find',skill:'findRecognition',variant:'alphabet-order',prompt:'Welcher dieser Buchstaben kommt im ukrainischen Alphabet zuerst?',correct,options:opts}}
 if(slot===12&&conf.length){const other=conf[0];return {...base,type:'contrast',skill:'confusionDiscrimination',variant:'sound-contrast',display:`${c} · ${other}`,prompt:`Welches Zeichen gehört zum Laut „${DATA[c].short}“?`,correct:c,options:shuffle([c,other],rng)}}
 return base
}
function evidenceCount(state){let n=0;for(const c of ALPHABET)for(const k of CORE_SKILLS)n+=state.letters[c].skills[k].independentAttempts;return n}
function pickFreshSequence(size,rng=Math.random){const seq=[];while(seq.length<size)seq.push(...shuffle(ALPHABET,rng));return seq.slice(0,size)}
function chooseSkillForLetter(state,c,scope,rng=Math.random,now=Date.now()){if(scope==='audio')return 'audioToLetter';if(scope==='speed')return 'speedRecognition';if(scope==='fake')return ['visualToSound','soundToLetter','confusionDiscrimination'][Math.floor(rng()*3)];const due=CORE_SKILLS.filter(k=>state.letters[c].skills[k].dueAt<=now&&(state.letters[c].skills[k].independentAttempts>0||state.letters[c].skills[k].repairPending));if(due.length)return due.sort((a,b)=>skillMastery(state,c,a,now)-skillMastery(state,c,b,now))[0];return [...CORE_SKILLS].sort((a,b)=>skillMastery(state,c,a,now)-skillMastery(state,c,b,now))[0]}
function typeForSkill(skill,rng=Math.random){const map={visualToSound:['visual'],soundToLetter:['reverse'],caseRecognition:['lowercase','uppercase'],audioToLetter:['audio'],confusionDiscrimination:['contrast','trueFalse'],speedRecognition:['speed','memory'],findRecognition:['find'],memoryRecognition:['memory'],trueFalse:['trueFalse']};const list=map[skill]||['visual'];return list[Math.floor(rng()*list.length)]}
function pickLetter(state,scope,rng=Math.random,prev='',now=Date.now()){if(scope==='errors'){const e=errorLetters(state,now);if(e.length)return e[Math.floor(rng()*Math.min(e.length,8))]}if(scope==='fake')return FAKE_FRIENDS[Math.floor(rng()*FAKE_FRIENDS.length)];if(scope==='weak'){const w=weakLetters(state,14,now,rng);return w[Math.floor(rng()*w.length)]}const due=dueSkillPairs(state,now);if(due.length&&rng()<.45)return due[Math.floor(rng()*Math.min(12,due.length))].letter;const weighted=[...errorLetters(state,now).slice(0,8),...weakLetters(state,12,now,rng),...shuffle(ALPHABET,rng)];let c=weighted[Math.floor(rng()*weighted.length)]||ALPHABET[0];if(c===prev){c=weighted.find(x=>x!==prev)||c}return c}
function buildExam(state,{size=30,scope='standard',feedback='learning',rng=Math.random,now=Date.now(),sessionId=id('s')}={}){const tasks=[];const fresh=evidenceCount(state)===0&&scope==='standard';const freshSeq=fresh?pickFreshSequence(size,rng):[];let prev='';for(let i=0;i<size;i++){const c=fresh?freshSeq[i]:pickLetter(state,scope,rng,prev,now),skill=(scope==='standard'&&i<CORE_SKILLS.length*2)?CORE_SKILLS[i%CORE_SKILLS.length]:(fresh?CORE_SKILLS[i%CORE_SKILLS.length]:chooseSkillForLetter(state,c,scope,rng,now)),type=typeForSkill(skill,rng),base=makeTask(c,type,state,rng,{sessionId,scheduledReason:scope});tasks.push(variantizeTask(base,i,scope,rng,state));prev=c}return {size,scope,feedback,sessionId,tasks}}
function repairTask(task,state,rng=Math.random,meta={}){const current=task.skill||skillForKind(task.type),alternates={visualToSound:'soundToLetter',soundToLetter:'visualToSound',caseRecognition:'caseRecognition',audioToLetter:'visualToSound',confusionDiscrimination:'soundToLetter',speedRecognition:'visualToSound',findRecognition:'visualToSound',memoryRecognition:'soundToLetter'};const skill=alternates[current]||'visualToSound',type=typeForSkill(skill,rng);return {...makeTask(task.letter,type,state,rng,{sessionId:meta.sessionId||task.sessionId,parentAttemptId:meta.parentAttemptId||'',originalQuestionId:task.originalQuestionId||task.questionId,isRepair:true,repairLevel:(task.repairLevel||0)+1,createdFromError:true,scheduledReason:'repair'}),repair:true,repairForSkill:current}}
function buildDiagnostic(state,{size=50,rng=Math.random,sessionId=id('diag')}={}){const base=shuffle(ALPHABET,rng).map(c=>makeTask(c,'visual',state,rng,{sessionId,scheduledReason:'diagnostic'})),extras=[];while(extras.length<Math.max(0,size-33)){const c=FAKE_FRIENDS[extras.length%FAKE_FRIENDS.length],type=extras.length%2?'reverse':'contrast';extras.push(makeTask(c,type,state,rng,{sessionId,scheduledReason:'diagnostic'}))}return {size,scope:'diagnostic',feedback:'real',sessionId,tasks:shuffle([...base,...extras],rng)}}
function buildAudioCertification(state,{rng=Math.random,sessionId=id('audio')}={}){return {size:33,scope:'audio-certification',feedback:'real',sessionId,tasks:shuffle(ALPHABET,rng).map(c=>makeTask(c,'audio',state,rng,{sessionId,scheduledReason:'audio-certification'}))}}
function buildFakeCertification(state,{rng=Math.random,sessionId=id('fake')}={}){const tasks=[];for(const c of FAKE_FRIENDS){for(const type of ['visual','reverse','contrast'])tasks.push(makeTask(c,type,state,rng,{sessionId,scheduledReason:'fake-certification'}))}while(tasks.length<30){const c=FAKE_FRIENDS[tasks.length%FAKE_FRIENDS.length],type=['visual','reverse','contrast'][tasks.length%3];tasks.push(makeTask(c,type,state,rng,{sessionId,scheduledReason:'fake-certification'}))}return {size:30,scope:'fake-certification',feedback:'real',sessionId,tasks:shuffle(tasks,rng)}}
function buildFinalCertification(state,{rng=Math.random,sessionId=id('final')}={}){const tasks=[];const push=(c,skill)=>tasks.push(makeTask(c,typeForSkill(skill,rng),state,rng,{sessionId,scheduledReason:'final-certification'}));const shuffled=shuffle(ALPHABET,rng);shuffled.forEach((c,i)=>push(c,i%2?'soundToLetter':'visualToSound'));for(let i=0;i<20;i++)push(shuffled[i%33],i%2?'visualToSound':'soundToLetter');for(let i=0;i<15;i++)push(shuffled[(i*3)%33],'caseRecognition');for(let i=0;i<15;i++)push(shuffled[(i*5)%33],'confusionDiscrimination');for(let i=0;i<10;i++)push(shuffled[(i*7)%33],'audioToLetter');for(let i=0;i<7;i++)push(shuffled[(i*11)%33],'speedRecognition');return {size:100,scope:'final-certification',feedback:'real',sessionId,tasks:shuffle(tasks,rng)}}
function buildCertification(state,type,opts={}){if(type==='audio')return buildAudioCertification(state,opts);if(type==='fake')return buildFakeCertification(state,opts);if(type==='final')return buildFinalCertification(state,opts);const size=opts.size||50;return buildExam(state,{size,scope:'weak',feedback:'real',rng:opts.rng,sessionId:opts.sessionId})}
function recordExam(state,summary){state.examHistory.unshift({...summary});state.examHistory=state.examHistory.slice(0,80);return state}
function addMasteryCheck(state,type,summary){state.masteryChecks[type]=state.masteryChecks[type]||[];state.masteryChecks[type].push(summary);state.masteryChecks[type]=state.masteryChecks[type].slice(-20);return state}
function distinctPassDays(checks,pred){return new Set((checks||[]).filter(pred).map(x=>x.date)).size}
function averageRecognitionMs(state){const vals=[];for(const c of ALPHABET)for(const k of ['visualToSound','soundToLetter','speedRecognition']){const s=state.letters[c].skills[k];if(s.timedAttempts>=3)vals.push(s.totalValidLatencyMs/s.timedAttempts)}return vals.length?Math.round(vals.reduce((a,b)=>a+b,0)/vals.length):0}
function mastered(state,now=Date.now()){const allLetters=ALPHABET.every(c=>letterReady(state,c,now));const finals=distinctPassDays(state.masteryChecks.final,x=>x.accuracy>=.95&&x.total>=100&&x.coverageLetters?.length===33)>=2;const fake=(state.masteryChecks.fake||[]).some(x=>x.accuracy===1&&x.total>=30&&x.coverageLetters?.filter(c=>FAKE_FRIENDS.includes(c)).length>=6);const audio=(state.masteryChecks.audio||[]).some(x=>x.accuracy>=.95&&x.total>=33&&x.humanAudioOnly===true&&x.coverageLetters?.length===33);const retention=(state.masteryChecks.retention||[]).some(x=>x.accuracy>=.95&&x.total>=50)&&ALPHABET.every(c=>retentionDaysForLetter(state,c).length>=(HARD.has(c)?4:3));const avg=averageRecognitionMs(state),speed=avg>0&&avg<=2500;return {done:allLetters&&finals&&fake&&audio&&retention&&speed,allLetters,finals,fake,audio,retention,speed,avgRecognitionMs:avg,readyCount:ALPHABET.filter(c=>letterReady(state,c,now)).length}}
function statsToday(state,now=Date.now()){const day=localDateKey(now),rows=state.answerLog.filter(x=>x.date===day),main=rows.filter(x=>x.firstAttempt&&!x.isRepair),repair=rows.filter(x=>x.isRepair),mainCorrect=main.filter(x=>x.correct).length,repairCorrect=repair.filter(x=>x.correct).length,lat=main.filter(x=>x.latencyValid&&x.latencyMs>0).map(x=>x.latencyMs);return {mainQuestions:main.length,repairQuestions:repair.length,questions:main.length,mainCorrect,mainWrong:main.length-mainCorrect,accuracy:main.length?Math.round(mainCorrect/main.length*100):0,repairCorrect,repairAccuracy:repair.length?Math.round(repairCorrect/repair.length*100):0,avgMs:lat.length?Math.round(lat.reduce((a,b)=>a+b,0)/lat.length):0,exams:state.examHistory.filter(x=>x.date===day).length,openRepairs:ALPHABET.reduce((n,c)=>n+CORE_SKILLS.filter(k=>state.letters[c].skills[k].repairPending).length,0),dueSkills:dueSkillPairs(state,now).length,studyDays:state.studyDays.length}}
function summaryForLetter(state,c,now=Date.now()){const m=state.letters[c],conf=Object.entries(m.confusions||{}).sort((a,b)=>b[1]-a[1])[0]||['',0],skills={};for(const k of SKILLS){const s=m.skills[k];skills[k]={label:SKILL_LABELS[k],mastery:skillMastery(state,c,k,now),attempts:s.attempts,independentAttempts:s.independentAttempts,repairAttempts:s.repairAttempts,accuracy:Math.round((independentAccuracy(s)||0)*100),recent:recentAccuracy(s)==null?null:Math.round(recentAccuracy(s)*100),avgMs:avgSkillLatency(s),dueAt:s.dueAt,repairPending:s.repairPending,successDays:s.successDays.length}}return {letter:c,mastery:letterMastery(state,c,now),status:letterStatus(state,c,now),problem:problemFlag(state,c),seen:m.seen,correct:m.correct,wrong:m.wrong,avgMs:averageLetterLatency(m),lastAnswer:m.lastAnswer,lastWrongAnswer:m.lastWrongAnswer,lastWrongAt:m.lastWrongAt,topConfusion:conf[0],topConfusionCount:conf[1],retentionDays:retentionDaysForLetter(state,c).length,writeDays:m.writeDays.length,lastWriteDate:m.writeDays.at(-1)||'',latinTrap:m.trapStats.latinLookalike,skills}}
function averageLetterLatency(m){const vals=[];for(const k of ['visualToSound','soundToLetter','speedRecognition']){const s=m.skills[k];if(s.timedAttempts)vals.push(s.totalValidLatencyMs/s.timedAttempts)}return vals.length?Math.round(vals.reduce((a,b)=>a+b,0)/vals.length):0}
function openMasteryItems(state,now=Date.now()){const rows=[];for(const c of ALPHABET){const x=summaryForLetter(state,c,now);if(letterReady(state,c,now))continue;const weak=CORE_SKILLS.map(k=>[k,x.skills[k].mastery]).sort((a,b)=>a[1]-b[1])[0];const reason=x.writeDays===0?'Schreiben offen':x.retentionDays<(HARD.has(c)?4:3)?`Retention ${x.retentionDays}/${HARD.has(c)?4:3}`:`${SKILL_LABELS[weak[0]]} ${weak[1]}%`;rows.push({letter:c,reason,status:x.status})}return rows}

function createExamSession(tasks,meta={}){const sid=meta.sessionId||tasks[0]?.sessionId||id('s');return {kind:'exam',sessionId:sid,preset:meta.preset||'custom',title:meta.title||'Prüfung',scope:meta.scope||'custom',feedback:meta.feedback||'learning',mainTasks:[...tasks],mainIndex:0,mainAnswers:[],repairAnswers:[],mainCorrect:0,mainWrong:0,pendingRepairs:[],repairCurrent:null,repairsResolved:0,repairsFailed:0,errors:[],startedAt:Number(meta.startedAt)||Date.now(),finishedAt:0,certification:meta.certification||'',battle:meta.battle||null,locked:false,audioTechnicalFailures:0}}
function scheduleRepairForSession(session,task,state,parentAttemptId='',rng=Math.random){if(session.feedback!=='learning'||task.isRepair)return null;const gap=3+Math.floor(rng()*5),repair=repairTask(task,state,rng,{sessionId:session.sessionId,parentAttemptId});const row={task:repair,dueAfterMainIndex:session.mainIndex+gap+1,gap,originQuestionId:task.questionId,originAttemptId:parentAttemptId,done:false,resolved:false};session.pendingRepairs.push(row);return row}
function dueRepairForSession(session){if(session.feedback!=='learning')return null;return session.pendingRepairs.find(x=>!x.done&&x.dueAfterMainIndex<=session.mainIndex)||null}
function applyMainAnswer(session,row,error=null){session.mainAnswers.push(row);if(row.correct)session.mainCorrect++;else{session.mainWrong++;if(error)session.errors.push(error)}return session}
function applyRepairAnswer(session,row,repairRef){session.repairAnswers.push(row);if(repairRef){repairRef.done=true;repairRef.resolved=!!row.correct}if(row.correct)session.repairsResolved++;else session.repairsFailed++;return session}
function sessionScore(session){const total=session.mainAnswers.length,correct=session.mainCorrect,valid=session.mainAnswers.filter(x=>x.latencyValid&&x.latencyMs>0);return {total,correct,wrong:total-correct,accuracy:total?correct/total:0,avgMs:valid.length?Math.round(valid.reduce((a,x)=>a+x.latencyMs,0)/valid.length):0,repairsTotal:session.repairAnswers.length,repairsCorrect:session.repairAnswers.filter(x=>x.correct).length,repairsOpen:session.pendingRepairs.filter(x=>!x.resolved).length}}
function toggleBookmark(state,target){const key=`${target.letter}|${target.skill}|${target.type}|${target.confusionTarget||''}`;const i=state.bookmarks.findIndex(x=>x.key===key);if(i>=0){state.bookmarks.splice(i,1);return false}state.bookmarks.push({key,letter:target.letter,skill:target.skill||skillForKind(target.type),type:target.type,confusionTarget:target.confusionTarget||'',note:target.note||'',createdAt:Date.now()});state.bookmarks=state.bookmarks.slice(-100);return true}
function isBookmarked(state,target){const key=`${target.letter}|${target.skill}|${target.type}|${target.confusionTarget||''}`;return state.bookmarks.some(x=>x.key===key)}
function taskFromBookmark(state,b,rng=Math.random,sessionId=id('mark')){return makeTask(b.letter,b.type||typeForSkill(b.skill,rng),state,rng,{sessionId,scheduledReason:'bookmark'})}

/* source: alphabet-wordbank-v4.js */
'use strict';
const V4_VERSION=4;
const WORD_BANK_RAW={"А":[["автобус","Bus","🚌"],["мама","Mama","👩"],["кава","Kaffee","☕"],["ананас","Ananas","🍍"],["адреса","Adresse","📍"],["лампа","Lampe","💡"],["брат","Bruder","👦"],["вода","Wasser","💧"],["рука","Hand","✋"],["сад","Garten","🌳"]],"Б":[["бабуся","Oma","👵"],["банк","Bank","🏦"],["хліб","Brot","🍞"],["робота","Arbeit","🧰"],["автобус","Bus","🚌"],["обід","Mittagessen","🍽️"],["брат","Bruder","👦"],["риба","Fisch","🐟"],["дуб","Eiche","🌳"],["небо","Himmel","☁️"]],"В":[["вода","Wasser","💧"],["вікно","Fenster","🪟"],["кава","Kaffee","☕"],["слово","Wort","🔤"],["вовк","Wolf","🐺"],["вечір","Abend","🌆"],["лев","Löwe","🦁"],["острів","Insel","🏝️"],["вулиця","Straße","🛣️"],["новий","neu","🆕"]],"Г":[["гора","Berg","⛰️"],["книга","Buch","📘"],["магазин","Geschäft","🏪"],["нога","Bein","🦵"],["друг","Freund","👤"],["гарний","schön","✨"],["гроші","Geld","💶"],["багато","viel","➕"],["газета","Zeitung","📰"],["вагон","Waggon","🚃"]],"Ґ":[["ґудзик","Knopf","🔘"],["ґанок","Veranda","🏠"],["ґрунт","Boden","🌱"],["аґрус","Stachelbeere","🫐"],["ґрати","Gitter","▦"],["ґава","Krähe","🐦"],["ґедзь","Bremse (Insekt)","🪰"],["дзиґа","Kreisel","🌀"]],"Д":[["дім","Haus","🏠"],["вода","Wasser","💧"],["день","Tag","☀️"],["люди","Menschen","👥"],["сад","Garten","🌳"],["дорога","Straße","🛣️"],["дерево","Baum","🌳"],["одяг","Kleidung","👕"],["дощ","Regen","🌧️"],["мед","Honig","🍯"]],"Е":[["екран","Bildschirm","🖥️"],["телефон","Telefon","📱"],["метро","Metro","🚇"],["море","Meer","🌊"],["аптека","Apotheke","💊"],["кафе","Café","☕"],["день","Tag","☀️"],["небо","Himmel","☁️"],["дерево","Baum","🌳"],["сестра","Schwester","👩"]],"Є":[["єнот","Waschbär","🦝"],["моє","mein","👤"],["твоє","dein","👉"],["єдність","Einheit","🤝"],["Європа","Europa","🌍"],["приємно","angenehm","🙂"],["своє","sein/ihr","👤"],["має","hat","✅"],["читає","liest","📖"],["Єгипет","Ägypten","🇪🇬"]],"Ж":[["жук","Käfer","🪲"],["життя","Leben","🌱"],["ніж","Messer","🔪"],["дружба","Freundschaft","🤝"],["жовтий","gelb","🟨"],["пожежа","Brand","🔥"],["журнал","Zeitschrift","📰"],["кожен","jeder","👥"],["може","kann","✅"],["ножі","Messer (Pl.)","🔪"]],"З":[["зуб","Zahn","🦷"],["зима","Winter","❄️"],["магазин","Geschäft","🏪"],["зараз","jetzt","⏱️"],["ваза","Vase","🏺"],["поїзд","Zug","🚆"],["земля","Erde","🌍"],["казка","Märchen","📖"],["мороз","Frost","🥶"],["зелений","grün","🟩"]],"И":[["син","Sohn","👦"],["книга","Buch","📘"],["машина","Auto","🚗"],["великий","groß","⬆️"],["риба","Fisch","🐟"],["хвилина","Minute","⏱️"],["вони","sie","👥"],["руки","Hände","✋"],["мити","waschen","🧼"],["дим","Rauch","💨"]],"І":[["ім’я","Name","🏷️"],["кіт","Katze","🐱"],["місто","Stadt","🏙️"],["хліб","Brot","🍞"],["стіл","Tisch","🪑"],["лікар","Arzt","🩺"],["гості","Gäste","👥"],["інший","anderer","🔀"],["місяць","Monat","🌙"],["сіль","Salz","🧂"]],"Ї":[["їжа","Essen","🍽️"],["Україна","Ukraine","🇺🇦"],["поїзд","Zug","🚆"],["мої","meine","👤"],["її","ihre","👤"],["приїхати","ankommen","🚉"],["їхати","fahren","🚗"],["з’їсти","aufessen","🍽️"],["країна","Land","🏳️"],["їхній","ihr","👥"]],"Й":[["йогурт","Joghurt","🥣"],["чай","Tee","🍵"],["край","Rand/Region","🗺️"],["мій","mein","👤"],["твій","dein","👉"],["музей","Museum","🏛️"],["майка","T-Shirt","👕"],["район","Bezirk","🗺️"],["зайти","hineingehen","🚪"],["новий","neu","🆕"]],"К":[["кіт","Katze","🐱"],["кава","Kaffee","☕"],["книга","Buch","📘"],["парк","Park","🌳"],["рука","Hand","✋"],["кімната","Zimmer","🚪"],["молоко","Milch","🥛"],["сік","Saft","🧃"],["кухня","Küche","🍳"],["дякую","danke","🙏"]],"Л":[["лампа","Lampe","💡"],["люди","Menschen","👥"],["стіл","Tisch","🪑"],["молоко","Milch","🥛"],["школа","Schule","🏫"],["телефон","Telefon","📱"],["літо","Sommer","☀️"],["сіль","Salz","🧂"],["хліб","Brot","🍞"],["футбол","Fußball","⚽"]],"М":[["мама","Mama","👩"],["метро","Metro","🚇"],["місто","Stadt","🏙️"],["машина","Auto","🚗"],["дім","Haus","🏠"],["молоко","Milch","🥛"],["зима","Winter","❄️"],["сім","sieben","7️⃣"],["кімната","Zimmer","🚪"],["музика","Musik","🎵"]],"Н":[["ніс","Nase","👃"],["ніч","Nacht","🌙"],["вікно","Fenster","🪟"],["книга","Buch","📘"],["ранок","Morgen","🌅"],["Україна","Ukraine","🇺🇦"],["син","Sohn","👦"],["банан","Banane","🍌"],["сон","Schlaf","😴"],["весна","Frühling","🌸"]],"О":[["око","Auge","👁️"],["вода","Wasser","💧"],["молоко","Milch","🥛"],["робота","Arbeit","🧰"],["море","Meer","🌊"],["автобус","Bus","🚌"],["обід","Mittagessen","🍽️"],["вікно","Fenster","🪟"],["осінь","Herbst","🍂"],["метро","Metro","🚇"]],"П":[["парк","Park","🌳"],["поїзд","Zug","🚆"],["аптека","Apotheke","💊"],["суп","Suppe","🍲"],["папір","Papier","📄"],["купити","kaufen","🛍️"],["пиво","Bier","🍺"],["лампа","Lampe","💡"],["степ","Steppe","🌾"],["після","nach","➡️"]],"Р":[["рука","Hand","✋"],["риба","Fisch","🐟"],["робота","Arbeit","🧰"],["парк","Park","🌳"],["море","Meer","🌊"],["ранок","Morgen","🌅"],["сир","Käse","🧀"],["вечір","Abend","🌆"],["лікар","Arzt","🩺"],["дерево","Baum","🌳"]],"С":[["сир","Käse","🧀"],["сад","Garten","🌳"],["слово","Wort","🔤"],["місто","Stadt","🏙️"],["автобус","Bus","🚌"],["сестра","Schwester","👩"],["ліс","Wald","🌲"],["осінь","Herbst","🍂"],["масло","Butter","🧈"],["сонце","Sonne","☀️"]],"Т":[["так","ja","✅"],["телефон","Telefon","📱"],["метро","Metro","🚇"],["аптека","Apotheke","💊"],["стіл","Tisch","🪑"],["автобус","Bus","🚌"],["кіт","Katze","🐱"],["брат","Bruder","👦"],["світ","Welt","🌍"],["тато","Papa","👨"]],"У":[["урок","Lektion","📚"],["рука","Hand","✋"],["суп","Suppe","🍲"],["автобус","Bus","🚌"],["Україна","Ukraine","🇺🇦"],["друг","Freund","👤"],["іду","ich gehe","🚶"],["кенгуру","Känguru","🦘"],["купити","kaufen","🛍️"],["ручка","Stift","🖊️"]],"Ф":[["Франція","Frankreich","🇫🇷"],["фото","Foto","📷"],["кафе","Café","☕"],["телефон","Telefon","📱"],["футбол","Fußball","⚽"],["офіс","Büro","🏢"],["шеф","Chef","👔"],["жираф","Giraffe","🦒"],["ферма","Bauernhof","🚜"],["шафа","Schrank","🚪"]],"Х":[["хата","Haus","🏠"],["хліб","Brot","🍞"],["хвилина","Minute","⏱️"],["тихо","leise","🤫"],["кухня","Küche","🍳"],["їхати","fahren","🚗"],["дах","Dach","🏠"],["сміх","Lachen","😄"],["хвіст","Schwanz","🐾"],["вухо","Ohr","👂"]],"Ц":[["це","dies","👉"],["вулиця","Straße","🛣️"],["піца","Pizza","🍕"],["ціна","Preis","💶"],["сонце","Sonne","☀️"],["олівець","Bleistift","✏️"],["палець","Finger","👆"],["кінець","Ende","🔚"],["цукор","Zucker","🍬"],["місяць","Monat","🌙"]],"Ч":[["чай","Tee","🍵"],["час","Zeit","⏰"],["вечір","Abend","🌆"],["ключ","Schlüssel","🔑"],["очі","Augen","👀"],["ручка","Stift","🖊️"],["ніч","Nacht","🌙"],["чашка","Tasse","☕"],["дочка","Tochter","👧"],["чорний","schwarz","⬛"]],"Ш":[["школа","Schule","🏫"],["машина","Auto","🚗"],["шафа","Schrank","🚪"],["наш","unser","👥"],["гроші","Geld","💶"],["душ","Dusche","🚿"],["шапка","Mütze","🧢"],["груша","Birne","🍐"],["миша","Maus","🐭"],["шість","sechs","6️⃣"]],"Щ":[["щука","Hecht","🐟"],["що","was","❓"],["ще","noch","➕"],["площа","Platz","🏙️"],["дощ","Regen","🌧️"],["щастя","Glück","🍀"],["щітка","Bürste","🪥"],["борщ","Borschtsch","🍲"],["ящірка","Eidechse","🦎"],["щоденник","Tagebuch","📔"]],"Ь":[["кінь","Pferd","🐴"],["день","Tag","☀️"],["сіль","Salz","🧂"],["біль","Schmerz","🤕"],["пальто","Mantel","🧥"],["учитель","Lehrer","👨‍🏫"],["тільки","nur","☝️"],["вільний","frei","🆓"],["маленький","klein","🐁"],["радість","Freude","😊"]],"Ю":[["юнак","junger Mann","🧑"],["юшка","Fischsuppe","🍲"],["меню","Menü","📋"],["малювати","zeichnen","🎨"],["комп’ютер","Computer","💻"],["лютий","Februar","📅"],["любов","Liebe","❤️"],["дякую","danke","🙏"],["юрист","Jurist","⚖️"],["ключ","Schlüssel","🔑"]],"Я":[["яблуко","Apfel","🍎"],["я","ich","👤"],["сім’я","Familie","👨‍👩‍👧"],["м’ясо","Fleisch","🥩"],["ім’я","Name","🏷️"],["п’ятниця","Freitag","📅"],["земля","Erde","🌍"],["ягода","Beere","🫐"],["пляж","Strand","🏖️"],["зоря","Stern","⭐"]]};
const WORD_BANK=[];
for(const [letter,rows] of Object.entries(WORD_BANK_RAW))rows.forEach((row,i)=>{const [word,de,icon]=row,low=letter.toLocaleLowerCase('uk'),chars=[...word.toLocaleLowerCase('uk')],targetIndexes=chars.map((x,j)=>x===low?j:-1).filter(j=>j>=0),position=targetIndexes.length>1?'multiple':targetIndexes[0]===0?'initial':targetIndexes[0]===chars.length-1?'final':'medial';WORD_BANK.push({id:`${low}-${i+1}`,letter,word,de,icon,targetIndexes,position,level:i<2?1:i<4?2:3,common:i<5,audioKey:i===0?letter:null})});
const LETTER_PEDAGOGY={"А":{"confusions":["О","Я"],"pace":"fast","note":"Leichter Start; früh auf Wortposition, Mehrfachvorkommen und Transfer wechseln."},"Б":{"confusions":["В","П"],"note":"Б = B; gezielt gegen В und П.","pace":"normal"},"В":{"confusions":["Б","У"],"latin":"B","note":"Deutsche B-Falle; visuell und auditiv gegen Б absichern.","pace":"normal"},"Г":{"confusions":["Ґ","Х"],"note":"Kein deutsches G; gegen Ґ und Х.","pace":"normal"},"Ґ":{"confusions":["Г","К"],"pace":"slow","note":"Ukrainisch-spezifisch; intensive Г/Ґ-Kontraste."},"Д":{"confusions":["Л","П"],"note":"Formerkennung und Worttransfer.","pace":"normal"},"Е":{"confusions":["Є","И"],"note":"Gegen Є und И.","pace":"normal"},"Є":{"confusions":["Е","Ї"],"pace":"slow","note":"Je-Zuordnung; gegen Е und Ї."},"Ж":{"confusions":["Ш","Щ"],"pace":"slow","note":"Stimmhaftes sch; gegen Ш/Щ."},"З":{"confusions":["С","Ц"],"note":"Stimmhaft /z/ gegen /s/ und Ц.","pace":"normal"},"И":{"confusions":["І","Ї","Е"],"pace":"slow","note":"Starker І/И-Kontrast, später Ї."},"І":{"confusions":["И","Ї","Й"],"note":"Klares I; gegen И, Ї und Й.","pace":"normal"},"Ї":{"confusions":["І","Й","Є"],"pace":"slow","note":"Zwei Punkte als Merkmal; gegen І/Й/Є."},"Й":{"confusions":["І","Ї"],"pace":"slow","note":"Kurzes J; gegen І/Ї."},"К":{"confusions":["Х","Н"],"pace":"fast","note":"Leicht; früh Speed und Worttransfer."},"Л":{"confusions":["Д","П"],"note":"Formerkennung gegen Д/П.","pace":"normal"},"М":{"confusions":["Н","И"],"pace":"fast","note":"Leicht; Basics schnell verlassen."},"Н":{"confusions":["П","И"],"latin":"H","note":"Wichtige deutsche H-Falle.","pace":"normal"},"О":{"confusions":["А","С"],"pace":"fast","note":"Leicht; früh Worttransfer und Position."},"П":{"confusions":["Н","Р","Б"],"note":"Gegen Н/Р/Б.","pace":"normal"},"Р":{"confusions":["П","В"],"latin":"P","note":"Sehr wichtige P-Falle; variable Р/П-Kontraste.","pace":"normal"},"С":{"confusions":["З","Ц"],"latin":"C","note":"Lateinische C-Falle; klingt S.","pace":"normal"},"Т":{"confusions":["П","Г"],"note":"Später typografische Varianten.","pace":"normal"},"У":{"confusions":["В","Ч"],"latin":"Y","note":"Lateinische Y-Falle.","pace":"normal"},"Ф":{"confusions":["О","Х"],"note":"Neue Form, vertrauter Laut.","pace":"normal"},"Х":{"confusions":["Г","К"],"latin":"X","note":"Lateinische X-Falle; /x/.","pace":"normal"},"Ц":{"confusions":["Ч","С"],"pace":"slow","note":"ts gegen tsch und s."},"Ч":{"confusions":["Ц","Ш"],"pace":"slow","note":"tsch gegen ts und sch."},"Ш":{"confusions":["Щ","Ж"],"pace":"slow","note":"Stark gegen Щ/Ж."},"Щ":{"confusions":["Ш","Ж","Ч"],"pace":"slow","note":"Sehr schwierig; variable Ш/Щ-Kontraste."},"Ь":{"confusions":["Й","І"],"pace":"slow","special":"soft-sign","note":"Kein eigener Laut; ausschließlich im Wort-/Funktionskontext."},"Ю":{"confusions":["Я","Є","У"],"note":"Gegen Я/Є/У.","pace":"normal"},"Я":{"confusions":["Ю","Є","Ї"],"note":"Gegen Ю/Є/Ї.","pace":"normal"}};
const FONT_VARIANTS=[{id:'system',label:'Standard',style:'font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif'},{id:'serif',label:'Serif',style:'font-family:Georgia,"Times New Roman",serif'},{id:'sans-wide',label:'Sans',style:'font-family:Arial,Helvetica,sans-serif;letter-spacing:.04em'},{id:'italic',label:'Kursivdruck',style:'font-family:Georgia,"Times New Roman",serif;font-style:italic'}];
const QUESTION_FAMILIES={'visual-to-sound':{skill:'visualToSound',min:0,max:5,weight:1,production:0},'sound-to-letter':{skill:'soundToLetter',min:0,max:5,weight:1,production:1},'audio-to-letter':{skill:'audioToLetter',min:1,max:5,weight:1,usesAudio:true,production:1},'upper-to-lower':{skill:'caseRecognition',min:0,max:3,weight:.8,production:0},'lower-to-upper':{skill:'caseRecognition',min:0,max:3,weight:.8,production:0},'pair-match':{skill:'caseRecognition',min:1,max:4,weight:.85,production:0},'visual-find':{skill:'visualToSound',min:0,max:3,weight:.65,production:0},'multi-select':{skill:'visualToSound',min:2,max:5,weight:.75,production:1},'count-target':{skill:'visualToSound',min:2,max:5,weight:.75,usesWord:true,production:1},'word-position':{skill:'visualToSound',min:2,max:5,weight:.85,usesWord:true,production:1},'missing-letter':{skill:'soundToLetter',min:2,max:5,weight:.9,usesWord:true,production:1},'word-contains':{skill:'visualToSound',min:1,max:3,weight:.65,usesWord:true,production:0},'word-choice':{skill:'visualToSound',min:2,max:5,weight:.8,usesWord:true,production:1},'tap-target':{skill:'visualToSound',min:2,max:5,weight:.8,usesWord:true,production:1},'multi-occurrence':{skill:'visualToSound',min:2,max:5,weight:.85,usesWord:true,production:1},'word-image':{skill:'visualToSound',min:0,max:2,weight:.65,usesWord:true,usesImage:true,production:0},'word-plain':{skill:'visualToSound',min:1,max:5,weight:.8,usesWord:true,production:1},'pseudoword':{skill:'visualToSound',min:2,max:5,weight:.9,production:1},'syllable':{skill:'soundToLetter',min:1,max:4,weight:.85,production:1},'sound-contrast':{skill:'confusionDiscrimination',min:2,max:5,weight:1,production:1},'visual-contrast':{skill:'confusionDiscrimination',min:1,max:5,weight:1,production:1},'latin-trap':{skill:'confusionDiscrimination',min:1,max:5,weight:1,production:1},'same-different':{skill:'caseRecognition',min:2,max:5,weight:.85,usesFontVariation:true,production:0},'font-recognition':{skill:'visualToSound',min:2,max:5,weight:.85,usesFontVariation:true,production:0},'flash-recognition':{skill:'speedRecognition',min:3,max:5,weight:.8,production:1},'memory-pair':{skill:'memoryRecognition',min:2,max:5,weight:.8,production:1},'odd-one-out':{skill:'confusionDiscrimination',min:2,max:5,weight:.8,production:1},'error-correction':{skill:'confusionDiscrimination',min:2,max:5,weight:1,production:1},'reverse-fake-friend':{skill:'soundToLetter',min:2,max:5,weight:1,production:1},'audio-word-position':{skill:'audioToLetter',min:2,max:5,weight:1,usesAudio:true,usesWord:true,production:1},'writing-recall':{skill:'writing',min:4,max:5,weight:0,production:2,countsForMastery:false}};

/* source: alphabet-core-v4-model-a.js */
'use strict';

const LATIN_CONFUSION_LETTER={В:'Б',Н:'Г',Р:'П',С:'Ц',У:'Й',Х:'К'};
const BASIC_SKILLS=['visualToSound','soundToLetter','caseRecognition'];
const LEARNING_STATE_LABELS={locked:'Gesperrt',new:'Neu',learning:'Lernen',weak:'Unsicher',consolidating:'Festigen',review:'Wiederholen',secure:'Sicher'};
const FAMILY_PROMPTS={
 'visual-to-sound':['Wie wird dieses Zeichen gelesen?','Welcher Laut gehört zu diesem Zeichen?','Sprich das Zeichen innerlich: Was passt?','Welche Lautzuordnung ist richtig?','Welche Aussprache gehört hierher?'],
 'sound-to-letter':['Welches ukrainische Zeichen passt zu diesem Laut?','Wähle den Buchstaben für diesen Laut.','Welches Zeichen würdest du schreiben?','Finde die richtige ukrainische Form.','Welcher Buchstabe steht für diese Aussprache?'],
 'audio-to-letter':['Welches Zeichen hörst du im Referenzwort?','Welcher Buchstabe gehört zum gehörten Ziel?','Höre genau: Welches Zeichen wird geprüft?','Welche ukrainische Form passt zum gehörten Wort?'],
 'upper-to-lower':['Welche Kleinform gehört dazu?','Finde die passende Kleinform.','Welche kleine Druckform ist korrekt?','Groß gesehen – welche Kleinform gehört dazu?'],
 'lower-to-upper':['Welche Großform gehört dazu?','Finde die passende Großform.','Welche große Druckform ist korrekt?','Klein gesehen – welche Großform gehört dazu?'],
 'pair-match':['Welches Groß-/Klein-Paar gehört zusammen?','Welche Paarung ist korrekt?','Finde das richtige Formpaar.','Welche zwei Formen sind derselbe Buchstabe?'],
 'visual-find':['Finde das Zielzeichen.','Tippe das gesuchte Zeichen an.','Wo steckt der Zielbuchstabe?','Wähle das richtige Zeichen aus dem Feld.'],
 'multi-select':['Tippe alle Zielzeichen an.','Markiere jedes Vorkommen des Zielzeichens.','Finde alle gleichen Zielbuchstaben.','Welche Positionen gehören zum Zielzeichen?'],
 'count-target':['Wie oft kommt der Zielbuchstabe vor?','Zähle alle Vorkommen des Zielzeichens.','Wie viele Zielzeichen siehst du?','Wie häufig steht der Buchstabe im Wort?'],
 'word-position':['Wo steht der Zielbuchstabe im Wort?','Welche Position hat das Zielzeichen?','Steht der Buchstabe am Anfang, in der Mitte oder am Ende?','Bestimme die Position des Zielzeichens.'],
 'missing-letter':['Welches Zeichen fehlt?','Setze den fehlenden Zielbuchstaben ein.','Welche ukrainische Form gehört in die Lücke?','Vervollständige nur den fehlenden Buchstaben.'],
 'word-contains':['Enthält dieses Wort den Zielbuchstaben?','Kommt das Zielzeichen in diesem Wort vor?','Ist der gesuchte Buchstabe enthalten?','Siehst du den Zielbuchstaben im Wort?'],
 'word-choice':['Welches Wort enthält den Zielbuchstaben?','Finde das Wort mit dem Zielzeichen.','In welchem Wort steckt der Buchstabe?','Welches Wort passt zur Buchstabenaufgabe?'],
 'tap-target':['Tippe direkt auf das Zielzeichen im Wort.','Markiere den Zielbuchstaben im Wort.','Wo genau steht das Zielzeichen?','Tippe das richtige Zeichen im Wort an.'],
 'multi-occurrence':['Markiere alle Zielzeichen im Wort.','Finde jedes Vorkommen im Wort.','Tippe alle gleichen Zielbuchstaben an.','Welche Buchstabenpositionen sind das Ziel?'],
 'word-image':['Bildanker: Welcher Laut gehört zum markierten Zeichen?','Nutze Bild und Wort nur als Anker – welcher Laut passt?','Lies nur das markierte Zielzeichen.','Welche Aussprache gehört zum hervorgehobenen Zeichen?'],
 'word-plain':['Welches Zielzeichen steckt in diesem Wort?','Finde den trainierten Buchstaben im Wort.','Welcher der angebotenen Buchstaben kommt hier vor?','Lies das Wort nur als Buchstaben-Kontext.'],
 'pseudoword':['Finde das Zielzeichen im Nichtwort.','Welcher Buchstabe wird im Pseudowort geprüft?','Ohne Bedeutungshilfe: welches Zielzeichen siehst du?','Lies nur die Formen im Pseudowort.'],
 'syllable':['Welches Zeichen gehört zu diesem Laut in der Silbe?','Wähle den Zielbuchstaben der Silbe.','Welche ukrainische Form passt in die Silbe?','Ordne Laut und Zeichen in der Silbe zu.'],
 'sound-contrast':['Welches Zeichen passt zum Ziellaut?','Unterscheide die beiden Laute: welches Zeichen stimmt?','Welcher Buchstabe gehört zur genannten Aussprache?','Wähle im engen Lautkontrast.'],
 'visual-contrast':['Welches der ähnlichen Zeichen ist das Ziel?','Unterscheide die Formen.','Welcher Buchstabe ist gemeint?','Wähle im engen visuellen Kontrast.'],
 'latin-trap':['Lass dich nicht von der lateinischen Form täuschen. Welcher Laut stimmt?','Dieses Zeichen sieht vertraut aus – welche ukrainische Aussprache ist richtig?','Lateinische Falle: welche Zuordnung stimmt?','Nicht nach lateinischem Aussehen raten. Was ist korrekt?'],
 'same-different':['Sind das zwei Formen desselben ukrainischen Buchstabens?','Gehören beide Formen zum gleichen Buchstaben?','Gleich oder verschieden?','Prüfe die Schriftformen: derselbe Buchstabe?'],
 'font-recognition':['Erkenne den Buchstaben in anderer Druckschrift.','Welche Aussprache gehört zu dieser Schriftvariante?','Übertrage die Form auf den bekannten Buchstaben.','Welche Lautzuordnung bleibt trotz anderer Schrift gleich?'],
 'flash-recognition':['Das Zeichen war nur kurz sichtbar. Welcher Laut gehört dazu?','Erinnere die kurze Einblendung.','Was hast du gerade gesehen?','Kurzer Blick, dann Abruf: welcher Laut passt?'],
 'memory-pair':['Welches Zeichen war eben zu sehen?','Rufe die Form aus dem Kurzgedächtnis ab.','Welche Form wurde kurz gezeigt?','Erinnere den Buchstaben ohne erneute Vorlage.'],
 'odd-one-out':['Welches Zeichen passt nicht in die Verwechslungsgruppe?','Finde den Ausreißer.','Welcher Buchstabe gehört nicht zu den ähnlichen Kandidaten?','Welche Form ist hier der Außenseiter?'],
 'error-correction':['Welche Korrektur ist richtig?','Finde den Fehler in der falschen Zuordnung.','Wie muss die Zuordnung korrekt lauten?','Korrigiere die typische Fehlannahme.'],
 'reverse-fake-friend':['Welcher ukrainische Buchstabe sieht so aus, klingt aber anders?','Finde die bekannte lateinische Falle rückwärts.','Welches Zeichen täuscht deutschsprachige Leser besonders?','Wähle den ukrainischen Buchstaben zur beschriebenen Falle.'],
 'audio-word-position':['Höre das Wort: an welcher Position sitzt das Zielzeichen?','Wo steht der gehörte Zielbuchstabe im Wort?','Ordne das gehörte Wort zur Zielposition.','Höre erst, bestimme dann die Position des Zielzeichens.'],
 'writing-recall':['Schreibe den Buchstaben aus der Erinnerung.','Kurze Vorlage, dann selbst schreiben.','Rufe die Form motorisch ab.','Schreibe ohne sichtbare Vorlage.']
};

function freshExposure(){return {recentSignatures:[],variantCounts:{},promptFamilyCounts:{},wordStats:{},fontStats:{},lastVariants:[]}}
function ensureV4Letter(letter){letter.exposure=letter.exposure&&typeof letter.exposure==='object'?letter.exposure:freshExposure();letter.exposure.recentSignatures=Array.isArray(letter.exposure.recentSignatures)?letter.exposure.recentSignatures.slice(-50):[];letter.exposure.variantCounts=letter.exposure.variantCounts||{};letter.exposure.promptFamilyCounts=letter.exposure.promptFamilyCounts||{};letter.exposure.wordStats=letter.exposure.wordStats||{};letter.exposure.fontStats=letter.exposure.fontStats||{};letter.exposure.lastVariants=Array.isArray(letter.exposure.lastVariants)?letter.exposure.lastVariants.slice(-20):[];for(const k of SKILLS){const s=letter.skills[k];if(!s)continue;s.evidenceWeightSum=Math.max(0,Number(s.evidenceWeightSum)||Number(s.independentAttempts)||0);s.evidenceCorrectSum=Math.max(0,Number(s.evidenceCorrectSum)||Number(s.independentCorrect)||0);s.confidenceEvidence=Math.max(0,Number(s.confidenceEvidence)||s.evidenceWeightSum)}return letter}
function freshLearningPlan(){return {activeLetters:LEARN_ORDER.slice(0,5),introducedLetters:LEARN_ORDER.slice(0,5),lastRecomputedAt:0,lastUnlockedAt:0}}
function freshStateV4(){const s=freshState();s.version=V4_VERSION;s.learningPlan=freshLearningPlan();s.repairs={};s.sessionSnapshots=[];ALPHABET.forEach(c=>ensureV4Letter(s.letters[c]));return s}
function migrateV4(raw){const s=migrate(raw);s.version=V4_VERSION;s.repairs=s.repairs&&typeof s.repairs==='object'?s.repairs:{};s.learningPlan=s.learningPlan&&typeof s.learningPlan==='object'?{...freshLearningPlan(),...s.learningPlan}:freshLearningPlan();s.learningPlan.activeLetters=uniq((s.learningPlan.activeLetters||[]).filter(c=>ALPHABET.includes(c)));s.learningPlan.introducedLetters=uniq((s.learningPlan.introducedLetters||[]).filter(c=>ALPHABET.includes(c)));s.sessionSnapshots=Array.isArray(s.sessionSnapshots)?s.sessionSnapshots.slice(-30):[];ALPHABET.forEach(c=>ensureV4Letter(s.letters[c]));for(const c of ALPHABET)for(const k of CORE_SKILLS){const sk=s.letters[c].skills[k];const existing=Object.values(s.repairs).some(r=>r&&r.open&&r.originLetter===c&&r.originSkill===k);if(sk.repairPending&&!existing){const rid=`legacy-${c}-${k}`;s.repairs[rid]={repairId:rid,originAttemptId:'legacy',originLetter:c,originSkill:k,open:true,createdAt:Number(sk.lastWrongAt)||0,lastRepairAt:0,repairTarget:sk.repairTarget||''}}}recomputeLearningPlan(s,Date.now(),{force:true});return s}

/* source: alphabet-core-v4-model-b.js */
// Rückwärts über die letzten Ergebnisse laufen statt filter()+slice(): identische
// Semantik, aber ohne Zwischenarrays. Die Funktion ist laut CPU-Profil der
// teuerste Einzelposten der Fragegenerierung.
function weightedRecentAccuracy(skill,limit=10){const rows=skill.recentResults;if(!rows||!rows.length)return null;let yes=0,total=0,taken=0;for(let i=rows.length-1;i>=0&&taken<limit;i--){const r=rows[i];if(!r||r.independent===false)continue;taken++;const w=Math.max(.2,Number(r.weight)||1);total+=w;if(r.good)yes+=w}if(!taken)return null;return total?yes/total:null}
function weightedIndependentAccuracy(skill){const den=Math.max(0,Number(skill.evidenceWeightSum)||0);return den?clamp((Number(skill.evidenceCorrectSum)||0)/den,0,1):independentAccuracy(skill)}
function skillConfidence(state,c,skillName){const s=state.letters[c].skills[skillName],e=Math.max(0,Number(s.confidenceEvidence)||Number(s.evidenceWeightSum)||0),days=s.successDays?new Set(s.successDays).size:0;return Math.round(clamp((e/8)*.75+(days/3)*.25,0,1)*100)}
function skillMasteryV4(state,c,skillName,now=Date.now()){const s=state.letters[c].skills[skillName]||freshSkill(),n=s.independentAttempts;if(!n)return 0;const recent=weightedRecentAccuracy(s),life=weightedIndependentAccuracy(s),retention=retentionFactor(s,HARD.has(c));let score=((recent==null?life:recent)*.67+(life??0)*.18+retention*.15)*100;const evidence=clamp((Number(s.evidenceWeightSum)||n)/6,0,1);score*=.42+.58*evidence;if(skillName==='speedRecognition')score=(score*.7+speedFactor(s)*30);if(s.repairPending)score-=12;const freshWrong=(s.recentResults||[]).slice(-5).filter(x=>!x.good).length;score-=freshWrong*4;if(s.dueAt&&s.dueAt<now-14*DAY)score*=.9;return Math.round(clamp(score,0,100))}
function coreSkillScoresV4(state,c,now=Date.now()){return Object.fromEntries(CORE_SKILLS.map(k=>[k,skillMasteryV4(state,c,k,now)]))}
function letterMasteryV4(state,c,now=Date.now()){const scores=Object.values(coreSkillScoresV4(state,c,now)),avg=scores.reduce((a,b)=>a+b,0)/scores.length,min=Math.min(...scores);return Math.round(avg*.58+min*.42)}
function openRepairIds(state,c,skill){return Object.values(state.repairs||{}).filter(r=>r&&r.open&&r.originLetter===c&&r.originSkill===skill).map(r=>r.repairId)}
function syncRepairPending(state,c,skill){const s=state.letters[c].skills[skill],open=openRepairIds(state,c,skill);s.repairPending=open.length>0;if(!s.repairPending)s.repairTarget='';return open}
function letterReadyV4(state,c,now=Date.now()){const scores=coreSkillScoresV4(state,c,now),m=state.letters[c];return CORE_SKILLS.every(k=>scores[k]>=82&&skillConfidence(state,c,k)>=65)&&retentionDaysForLetter(state,c).length>=(HARD.has(c)?4:3)&&m.writeDays.length>=1&&!CORE_SKILLS.some(k=>syncRepairPending(state,c,k).length)}
function secureLettersV4(state,now=Date.now()){return ALPHABET.filter(c=>letterReadyV4(state,c,now))}
function masteredV4(state,now=Date.now()){const allLetters=ALPHABET.every(c=>letterReadyV4(state,c,now));const finals=distinctPassDays(state.masteryChecks.final,x=>x.accuracy>=.95&&x.total>=100&&x.coverageLetters?.length===33)>=2;const fake=(state.masteryChecks.fake||[]).some(x=>x.accuracy===1&&x.total>=30&&x.coverageLetters?.filter(c=>FAKE_FRIENDS.includes(c)).length>=6);const audio=(state.masteryChecks.audio||[]).some(x=>x.accuracy>=.95&&x.total>=33&&x.humanAudioOnly===true&&x.coverageLetters?.length===33&&!x.technicallyIncomplete);const retention=(state.masteryChecks.retention||[]).some(x=>x.accuracy>=.95&&x.total>=50)&&ALPHABET.every(c=>retentionDaysForLetter(state,c).length>=(HARD.has(c)?4:3));const avg=averageRecognitionMs(state),speed=avg>0&&avg<=2500;return {done:allLetters&&finals&&fake&&audio&&retention&&speed,allLetters,finals,fake,audio,retention,speed,avgRecognitionMs:avg,readyCount:ALPHABET.filter(c=>letterReadyV4(state,c,now)).length}}
function learningState(state,c,now=Date.now()){const m=state.letters[c],ind=CORE_SKILLS.reduce((a,k)=>a+(m.skills[k]?.independentAttempts||0),0),introduced=(state.learningPlan?.introducedLetters||[]).includes(c);if(!introduced&&ind===0)return 'locked';if(ind===0)return 'new';if(letterReadyV4(state,c,now))return m.skills&&CORE_SKILLS.some(k=>m.skills[k].dueAt&&m.skills[k].dueAt<=now)?'review':'secure';const scores=coreSkillScoresV4(state,c,now),min=Math.min(...Object.values(scores)),recent=recentWrongCount(state,c,6);if(recent>=2||min<45)return 'weak';if(ind<6)return 'learning';if(min>=68&&retentionDaysForLetter(state,c).length>=1)return 'consolidating';return 'learning'}
function letterStatusV4(state,c,now=Date.now()){return LEARNING_STATE_LABELS[learningState(state,c,now)]||'Lernen'}
function basicReadiness(state,c,now=Date.now()){const vals=BASIC_SKILLS.map(k=>skillMasteryV4(state,c,k,now)),e=BASIC_SKILLS.map(k=>state.letters[c].skills[k].independentAttempts);return {avg:vals.reduce((a,b)=>a+b,0)/3,min:Math.min(...vals),attempted:e.filter(n=>n>0).length}}
function shouldUnlockNextLetter(state,now=Date.now()){const plan=state.learningPlan||freshLearningPlan(),active=(plan.activeLetters||[]).filter(c=>ALPHABET.includes(c));if(active.length<4)return true;if(!active.length)return true;const rows=active.map(c=>basicReadiness(state,c,now)),adequate=rows.filter(r=>r.attempted>=2&&r.avg>=62&&r.min>=48).length;const severe=rows.filter(r=>r.min<25&&r.attempted>=1).length;return adequate>=Math.ceil(active.length*.65)&&severe<=1}
function calculateLearningNeed(state,letter,skill,now=Date.now(),session=null){const s=state.letters[letter].skills[skill],mastery=skillMasteryV4(state,letter,skill,now),recentWrong=(s.recentResults||[]).slice(-5).filter(x=>!x.good).length,overdue=s.dueAt&&s.dueAt<=now?Math.min(20,5+Math.max(0,(now-s.dueAt)/HOUR)):0,repair=openRepairIds(state,letter,skill).length?26:0,conf=skill==='confusionDiscrimination'?Math.min(18,Object.values(state.letters[letter].confusions||{}).reduce((a,b)=>a+Number(b||0),0)*3):0,under=Math.max(0,5-(s.independentAttempts||0))*5,confidencePenalty=(100-skillConfidence(state,letter,skill))*.12;let exposure=0;if(session){const key=`${letter}|${skill}`,n=Number(session.coverageState?.skillCounts?.[key])||0;exposure=n*10;const recent=(session.mainAnswers||[]).slice(-8).filter(x=>x.letter===letter&&x.skill===skill).length;exposure+=recent*8}return Math.round((100-mastery)+recentWrong*12+repair+overdue+conf+under+confidencePenalty-exposure)}
function planCandidateScore(state,c,now){const core=CORE_SKILLS.map(k=>calculateLearningNeed(state,c,k,now)),err=recentWrongCount(state,c,8),due=CORE_SKILLS.filter(k=>state.letters[c].skills[k].dueAt&&state.letters[c].skills[k].dueAt<=now).length,order=LEARN_ORDER.indexOf(c);return Math.max(...core)+err*10+due*6-Math.max(0,order)*.15}
function recomputeLearningPlan(state,now=Date.now(),opts={}){state.learningPlan=state.learningPlan||freshLearningPlan();const p=state.learningPlan,evidenceLetters=ALPHABET.filter(c=>CORE_SKILLS.some(k=>state.letters[c].skills[k].independentAttempts>0));let introduced=uniq([...(p.introducedLetters||[]),...evidenceLetters]).filter(c=>ALPHABET.includes(c));if(!introduced.length)introduced=LEARN_ORDER.slice(0,5);while(introduced.length<5)introduced.push(LEARN_ORDER.find(c=>!introduced.includes(c)));
 const currentActive=(p.activeLetters||[]).filter(c=>introduced.includes(c)&&!letterReadyV4(state,c,now));const avgBasic=currentActive.length?currentActive.reduce((a,c)=>a+basicReadiness(state,c,now).avg,0)/currentActive.length:0;let target=avgBasic>=82?8:avgBasic>=72?7:avgBasic>=60?6:5;
 if(shouldUnlockNextLetter(state,now)&&introduced.length<ALPHABET.length){const next=LEARN_ORDER.find(c=>!introduced.includes(c));if(next){introduced.push(next);p.lastUnlockedAt=now}}
 const urgentOld=ALPHABET.filter(c=>!introduced.includes(c)&&evidenceLetters.includes(c)&&(!letterReadyV4(state,c,now)||recentWrongCount(state,c,8)>0));introduced=uniq([...introduced,...urgentOld]);
 const candidates=introduced.filter(c=>!letterReadyV4(state,c,now)||CORE_SKILLS.some(k=>state.letters[c].skills[k].dueAt&&state.letters[c].skills[k].dueAt<=now));candidates.sort((a,b)=>planCandidateScore(state,b,now)-planCandidateScore(state,a,now)||LEARN_ORDER.indexOf(a)-LEARN_ORDER.indexOf(b));let active=candidates.slice(0,target);
 if(active.length<4){for(const c of introduced){if(!active.includes(c)){active.push(c);if(active.length>=Math.min(target,4))break}}}
 p.activeLetters=active.slice(0,8);p.introducedLetters=uniq(introduced).sort((a,b)=>LEARN_ORDER.indexOf(a)-LEARN_ORDER.indexOf(b));p.lastRecomputedAt=now;return p}
function activeLearningSet(state,now=Date.now()){return recomputeLearningPlan(state,now,{force:true}).activeLetters}
function reviewSetFor(state,now=Date.now()){const active=new Set(activeLearningSet(state,now));return dueLetters(state,now).filter(c=>!active.has(c))}
function difficultyFor(state,letter,skill,now=Date.now()){const mastery=skillMasteryV4(state,letter,skill,now),s=state.letters[letter].skills[skill],avg=avgSkillLatency(s);let d=mastery<15?0:mastery<35?1:mastery<55?2:mastery<75?3:mastery<90?4:5;if(s.independentAttempts<2)d=Math.min(d,1);if(avg&&avg>5000)d=Math.max(0,d-1);if(LETTER_PEDAGOGY[letter]?.pace==='slow'&&s.independentAttempts<5)d=Math.min(d,2);return d}
const WORD_BANK_BY_LETTER=new Map();
// WORD_BANK ist nach dem Laden statisch. Der Index wird einmal gebaut, weil
// wordsForLetter pro erzeugter Frage mehrfach aufgerufen wird.
function wordsForLetter(letter){if(!WORD_BANK_BY_LETTER.size)for(const w of WORD_BANK){if(!WORD_BANK_BY_LETTER.has(w.letter))WORD_BANK_BY_LETTER.set(w.letter,[]);WORD_BANK_BY_LETTER.get(w.letter).push(w)}return WORD_BANK_BY_LETTER.get(letter)||[]}
function wordStat(state,letter,id){return state.letters[letter].exposure.wordStats[id]||{seen:0,correct:0,wrong:0,lastSeenAt:0}}
function pickWord(state,letter,session,rng=Math.random,{multiple=false,audioOnly=false}={}){let pool=wordsForLetter(letter).filter(w=>!multiple||w.targetIndexes.length>1).filter(w=>!audioOnly||w.audioKey===letter);if(!pool.length)pool=wordsForLetter(letter);const used=new Set(session?.usedWordIds||[]);pool.sort((a,b)=>(used.has(a.id)-used.has(b.id))||(wordStat(state,letter,a.id).seen-wordStat(state,letter,b.id).seen)||(a.level-b.level));const best=pool.slice(0,Math.min(3,pool.length));return best[Math.floor(rng()*best.length)]||pool[0]}
function promptForFamily(family,rng=Math.random){const a=FAMILY_PROMPTS[family]||['Wähle die richtige Antwort.'];const i=Math.floor(rng()*a.length);return {text:a[i],id:`${family}-${i+1}`}}
function targetPosition(word){if(word.targetIndexes.length>1)return 'Mehrfach';const i=word.targetIndexes[0];return i===0?'Anfang':i===[...word.word].length-1?'Ende':'Mitte'}
function pseudowordFor(letter,rng=Math.random){const chunks=[];for(let i=0;i<3;i++)chunks.push(plausibleSyllable(i===1?letter:CONSONANTS[Math.floor(rng()*CONSONANTS.length)],rng));return chunks.join('').toLocaleLowerCase('uk')}
function relevantFonts(difficulty){return FONT_VARIANTS.filter(f=>difficulty<2?f.id==='system':difficulty<4?f.id!=='italic':true)}
function familyCandidates(state,letter,skill,difficulty,session){if(letter==='Ь'){const softMap={visualToSound:['visual-find','word-image','word-plain','word-position','word-contains','tap-target','multi-occurrence','count-target'],soundToLetter:['missing-letter','word-choice'],caseRecognition:['same-different','font-recognition','pair-match'],audioToLetter:['audio-word-position'],confusionDiscrimination:['odd-one-out','visual-contrast','error-correction'],speedRecognition:['flash-recognition'],memoryRecognition:['memory-pair'],writing:['writing-recall']};const special=(softMap[skill]||['word-plain']).filter(f=>QUESTION_FAMILIES[f]);return special.length?special:['word-plain']}
 let fam=Object.entries(QUESTION_FAMILIES).filter(([,m])=>m.skill===skill&&difficulty>=m.min&&difficulty<=m.max).map(([k])=>k);
 if(skill==='caseRecognition'&&skillMasteryV4(state,letter,skill)>=75&&!openRepairIds(state,letter,skill).length)fam=fam.filter(x=>!['upper-to-lower','lower-to-upper'].includes(x));
 if(skill==='audioToLetter'&&!WORD_BANK.some(w=>w.letter===letter&&w.audioKey===letter))fam=fam.filter(x=>!QUESTION_FAMILIES[x]?.usesAudio);
 return fam.length?fam:['visual-to-sound']}

/* source: alphabet-core-v4-tasks-a.js */
function buildV4Task(state,letter,skill,difficulty,family,session,rng=Math.random,meta={}){const d=DATA[letter],p=promptForFamily(family,rng),base={questionId:id('q'),sessionId:session?.sessionId||meta.sessionId||'',letter,skill,type:'choice',family,variant:family,promptFamily:family,promptId:p.id,prompt:p.text,difficulty,firstAttempt:!meta.isRepair,isRepair:!!meta.isRepair,repairLevel:Number(meta.repairLevel)||0,createdFromError:!!meta.createdFromError,scheduledReason:meta.scheduledReason||'adaptive',evidenceWeight:QUESTION_FAMILIES[family]?.weight??1,countsForMastery:QUESTION_FAMILIES[family]?.countsForMastery!==false,interaction:'choice'};
 const conf=personalConfusions(state,letter)[0]||LETTER_PEDAGOGY[letter]?.confusions?.[0]||SOUND_GROUPS[letter]?.[0]||ALPHABET.find(c=>c!==letter);
 const letterOpts=(n=4)=>shuffle(uniq([letter,...buildDistractors({state,letter,skill,count:n-1,rng,repairTarget:state.letters[letter].skills[skill]?.repairTarget||''})]).slice(0,n),rng);
 const soundOpts=(n=4)=>shuffle(uniq([d.sound,...letterOpts(n).filter(c=>c!==letter).map(c=>DATA[c].sound)]).slice(0,n),rng);
 const word=()=>pickWord(state,letter,session,rng);
 if(family==='visual-to-sound'){return {...base,type:'visual',display:letter,correct:d.sound,options:soundOpts()}}
 if(family==='sound-to-letter'){return {...base,type:'reverse',display:d.sound,correct:letter,options:letterOpts()}}
 if(family==='audio-to-letter'){return {...base,type:'audio',correct:letter,options:letterOpts(),audioWord:d.word,audioIndex:d.audioIndex??0,requiresHumanAudio:true,audioStimulusId:`human-${letter}`}}
 if(family==='upper-to-lower'){return {...base,type:'lowercase',display:letter,correct:d.lower,options:shuffle(uniq([d.lower,...buildDistractors({state,letter,skill,count:3,rng}).map(c=>DATA[c].lower)]),rng)}}
 if(family==='lower-to-upper'){return {...base,type:'uppercase',display:d.lower,correct:letter,options:letterOpts()}}
 if(family==='pair-match'){const o=conf,correct=`${letter} – ${d.lower}`;return {...base,type:'lowercase',display:letter,correct,options:shuffle([correct,`${letter} – ${DATA[o].lower}`,`${o} – ${d.lower}`,`${o} – ${DATA[o].lower}`],rng),stimulusId:`pair-${o}`}}
 if(family==='visual-find'){return {...base,type:'find',display:'',correct:letter,options:shuffle(uniq([letter,...buildDistractors({state,letter,skill,count:7,rng})]).slice(0,8),rng)}}
 if(family==='multi-select'){const others=shuffle(ALPHABET.filter(c=>c!==letter),rng).slice(0,6),tokens=shuffle([letter,letter,...others],rng);return {...base,type:'multiSelect',interaction:'multiSelect',tokens,correctIndexes:tokens.map((x,i)=>x===letter?i:-1).filter(i=>i>=0),correct:'MULTI',options:[],stimulusId:tokens.join('')}}
 if(family==='count-target'){const w=pickWord(state,letter,session,rng,{multiple:true})||word(),n=w.targetIndexes.length;return {...base,type:'choice',wordId:w.id,display:w.word,icon:w.icon,correct:String(n),options:shuffle(uniq([String(n),'0','1','2','3','4']).slice(0,4),rng),stimulusId:w.id}}
 if(family==='word-position'){const w=word(),pos=targetPosition(w);return {...base,wordId:w.id,display:w.word,icon:w.icon,correct:pos,options:shuffle(['Anfang','Mitte','Ende','Mehrfach'],rng),stimulusId:w.id}}
 if(family==='missing-letter'){const w=word(),idx=w.targetIndexes[0],chars=[...w.word],shown=chars.map((ch,i)=>i===idx?'_':ch).join('');return {...base,type:'find',wordId:w.id,display:shown,correct:d.lower,options:shuffle(uniq([d.lower,...buildDistractors({state,letter,skill,count:3,rng}).map(c=>DATA[c].lower)]),rng),stimulusId:`${w.id}-${idx}`}}
 if(family==='word-contains'){const yes=rng()>.35,w=yes?word():WORD_BANK.find(x=>x.letter!==letter&&!x.word.toLocaleLowerCase('uk').includes(d.lower))||word();return {...base,wordId:w.id,display:w.word,correct:yes?'Ja':'Nein',options:['Ja','Nein'],stimulusId:w.id}}
 if(family==='word-choice'){const good=word(),others=shuffle(WORD_BANK.filter(w=>w.letter!==letter&&!w.word.toLocaleLowerCase('uk').includes(d.lower)),rng).slice(0,3);return {...base,wordId:good.id,correct:good.word,options:shuffle([good,...others],rng).map(w=>w.word),stimulusId:good.id}}
 if(family==='tap-target'||family==='multi-occurrence'){const w=family==='multi-occurrence'?(pickWord(state,letter,session,rng,{multiple:true})||word()):word();return {...base,type:'tapWord',interaction:'multiSelect',wordId:w.id,tokens:[...w.word],correctIndexes:[...w.targetIndexes],correct:'MULTI',options:[],stimulusId:w.id}}
 if(family==='word-image'){const w=word(),marked=[...w.word].map((ch,i)=>w.targetIndexes.includes(i)?`[${ch}]`:ch).join('');return {...base,type:'visual',wordId:w.id,display:marked,icon:w.icon,correct:d.sound,options:soundOpts(),stimulusId:w.id,usesImage:true}}
 if(family==='word-plain'){const w=word();return {...base,type:'find',wordId:w.id,display:w.word,correct:letter,options:letterOpts(),stimulusId:w.id}}
 if(family==='pseudoword'){const ps=pseudowordFor(letter,rng);return {...base,type:'find',display:ps,correct:letter,options:letterOpts(),stimulusId:ps}}
 if(family==='syllable'){const ps=plausibleSyllable(letter,rng);return {...base,type:'reverse',display:ps,prompt:`${p.text} Ziellaut: ${d.short}`,correct:letter,options:letterOpts(),stimulusId:ps}}
 if(family==='sound-contrast'){return {...base,type:'contrast',display:`${letter} · ${conf}`,correct:letter,options:shuffle([letter,conf],rng),confusionTarget:conf,stimulusId:`${letter}-${conf}`}}
 if(family==='visual-contrast'){return {...base,type:'find',display:`${letter} · ${conf}`,correct:letter,options:shuffle([letter,conf,...buildDistractors({state,letter,skill,count:2,rng})],rng).slice(0,4),confusionTarget:conf,stimulusId:`${letter}-${conf}`}}
 if(family==='latin-trap'){const trap=LATIN_TRAPS[letter]||'',trapLetter=LATIN_CONFUSION_LETTER[letter]||conf;return {...base,type:'visual',display:letter,prompt:`${p.text} ${letter} sieht wie „${trap}“ aus.`,correct:d.sound,options:shuffle(uniq([d.sound,DATA[trapLetter]?.sound,...soundOpts()]).slice(0,4),rng),confusionTarget:trapLetter,latinTrap:true,stimulusId:`latin-${trap}`}}
 if(family==='same-different'){const same=rng()>.45,other=same?letter:conf,font=relevantFonts(difficulty),f1=font[Math.floor(rng()*font.length)],f2=font[Math.floor(rng()*font.length)];return {...base,type:'sameDifferent',display:`${letter}|${same?DATA[letter].lower:DATA[other].lower}`,displayParts:[{text:letter,fontId:f1.id,style:f1.style},{text:same?DATA[letter].lower:DATA[other].lower,fontId:f2.id,style:f2.style}],correct:same?'Gleich':'Verschieden',options:['Gleich','Verschieden'],fontId:`${f1.id}-${f2.id}`,stimulusId:`${same?'same':'diff'}-${other}`}}
 if(family==='font-recognition'){const fs=relevantFonts(difficulty),f=fs[Math.floor(rng()*fs.length)];return {...base,type:'visual',display:letter,displayStyle:f.style,fontId:f.id,correct:d.sound,options:soundOpts(),stimulusId:`font-${f.id}`}}
 if(family==='flash-recognition'){return {...base,type:'memory',display:letter,flashMs:difficulty>=5?300:difficulty>=4?400:500,correct:d.sound,options:soundOpts(),stimulusId:`flash-${difficulty}`}}
 if(family==='memory-pair'){return {...base,type:'memory',display:letter,flashMs:700,correct:d.sound,options:soundOpts(),stimulusId:'memory-700'}}
 if(family==='odd-one-out'){const group=uniq([letter,...LETTER_PEDAGOGY[letter].confusions]).slice(0,3),unrelated=ALPHABET.find(c=>!group.includes(c)&&!LETTER_PEDAGOGY[letter].confusions.includes(c))||conf;return {...base,type:'contrast',display:shuffle([...group,unrelated],rng).join(' · '),correct:unrelated,options:shuffle([...group,unrelated],rng),stimulusId:`odd-${group.join('')}-${unrelated}`}}
 if(family==='error-correction'){const wrong=conf;return {...base,type:'visual',display:`${letter} = ${DATA[wrong].sound}`,prompt:p.text,correct:d.sound,options:shuffle(uniq([d.sound,DATA[wrong].sound,...soundOpts()]).slice(0,4),rng),confusionTarget:wrong,stimulusId:`error-${wrong}`}}
 if(family==='reverse-fake-friend'){const trap=LATIN_TRAPS[letter]||'lateinisch';return {...base,type:'reverse',display:trap,prompt:`${p.text} Sieht aus wie ${trap}, klingt aber ${d.short}.`,correct:letter,options:letterOpts(),latinTrap:true,stimulusId:`reverse-latin-${trap}`}}
 if(family==='audio-word-position'){const w=WORD_BANK.find(x=>x.letter===letter&&x.audioKey===letter)||word(),pos=String((DATA[letter].audioIndex??0)+1);return {...base,type:'audio',wordId:w.id,correct:pos,options:shuffle(uniq([pos,'1','2','3','4','5']).slice(0,4),rng),audioWord:w.word,audioIndex:DATA[letter].audioIndex??0,requiresHumanAudio:true,audioStimulusId:`human-${letter}`,stimulusId:`audio-pos-${w.id}`}}
 if(family==='writing-recall'){return {...base,type:'writingRecall',interaction:'writingRecall',display:letter,correct:'SELF',options:[],countsForMastery:false,evidenceWeight:0,stimulusId:`write-${letter}`}}
 return {...base,type:'visual',display:letter,correct:d.sound,options:soundOpts()}
}

/* source: alphabet-core-v4-tasks-b.js */
function questionSignature(task){const opts=(task.options||[]).join(','),stim=task.stimulusId||task.wordId||task.audioStimulusId||'',font=task.fontId||'',conf=task.confusionTarget||'',dir=task.type||'',variant=task.variant||task.family||'';return [task.letter,task.skill,variant,dir,stim,font,conf,task.promptFamily||'',opts].join('|')}
function noveltyScore(task,state,session){const ex=state.letters[task.letter].exposure,sig=questionSignature(task);let score=100;if((session.recentQuestionSignatures||[]).includes(sig))score-=140;if(ex.recentSignatures.includes(sig))score-=55;const fam=task.family||task.variant||task.type,sessionFam=Number(session.coverageState?.familyCounts?.[fam])||0;score-=sessionFam*10;score-=Number(ex.variantCounts[fam]||0)*1.5;if(task.wordId){if((session.usedWordIds||[]).includes(task.wordId))score-=60;score-=Math.min(24,wordStat(state,task.letter,task.wordId).seen*5)}if(task.fontId)score-=Math.min(18,Number(ex.fontStats[task.fontId]||0)*3);const recentSameFamily=(session.mainAnswers||[]).slice(-3).filter(x=>x.letter===task.letter&&x.family===fam).length;score-=recentSameFamily*35;return score}
function noteExposure(state,task,good,now=Date.now()){if(!task||!ALPHABET.includes(task.letter))return;const ex=ensureV4Letter(state.letters[task.letter]).exposure,sig=questionSignature(task),fam=task.family||task.variant||task.type;ex.recentSignatures.push(sig);ex.recentSignatures=ex.recentSignatures.slice(-50);ex.variantCounts[fam]=(ex.variantCounts[fam]||0)+1;ex.promptFamilyCounts[task.promptFamily||fam]=(ex.promptFamilyCounts[task.promptFamily||fam]||0)+1;ex.lastVariants.push(fam);ex.lastVariants=ex.lastVariants.slice(-20);if(task.wordId){const w=ex.wordStats[task.wordId]||(ex.wordStats[task.wordId]={seen:0,correct:0,wrong:0,lastSeenAt:0});w.seen++;good?w.correct++:w.wrong++;w.lastSeenAt=now}if(task.fontId)ex.fontStats[task.fontId]=(ex.fontStats[task.fontId]||0)+1}
function detectLatinTrap(task,selected){const letter=task?.letter;if(!letter||!LATIN_TRAPS[letter])return false;const trap=String(LATIN_TRAPS[letter]).toLocaleLowerCase('de'),s=String(selected||'').trim(),low=s.toLocaleLowerCase('de'),trapLetter=LATIN_CONFUSION_LETTER[letter];if(low===trap.toLocaleLowerCase('de'))return true;if(trapLetter&&s===trapLetter)return true;if(trapLetter&&s===DATA[trapLetter]?.sound)return true;return !!task?.latinTrap&&s!==task.correct&&low.includes(trap)}
function registerRepair(state,{repairId=id('repair'),originAttemptId='',originLetter,originSkill,repairTarget='',now=Date.now()}={}){state.repairs=state.repairs||{};state.repairs[repairId]={repairId,originAttemptId,originLetter,originSkill,repairTarget,open:true,createdAt:now,lastRepairAt:0};syncRepairPending(state,originLetter,originSkill);return state.repairs[repairId]}
const recordAnswerV3=recordAnswer;
function recordAnswerV4(state,opts={}){const letter=opts.letter,skill=opts.skill||skillForKind(opts.kind||opts.type||'visual'),m=state.letters[letter],sk=m.skills[skill],trapBefore=JSON.parse(JSON.stringify(m.trapStats.latinLookalike)),schedBefore=opts.isRepair?{repairPending:sk.repairPending,repairTarget:sk.repairTarget,dueAt:sk.dueAt,intervalIndex:sk.intervalIndex}:null;const clean={...opts,repairForSkill:''};const row=recordAnswerV3(state,clean);m.trapStats.latinLookalike=trapBefore;const w=opts.isRepair?0:clamp(Number(opts.evidenceWeight??opts.task?.evidenceWeight??1),0,1.2);if(!opts.isRepair&&opts.firstAttempt!==false){sk.evidenceWeightSum=(Number(sk.evidenceWeightSum)||0)+w;sk.evidenceCorrectSum=(Number(sk.evidenceCorrectSum)||0)+(opts.good?w:0);sk.confidenceEvidence=(Number(sk.confidenceEvidence)||0)+w;if(sk.recentResults?.length){const last=sk.recentResults[sk.recentResults.length-1];last.weight=w;last.family=opts.task?.family||opts.family||''}}if(opts.isRepair&&schedBefore){sk.repairPending=schedBefore.repairPending;sk.repairTarget=schedBefore.repairTarget;sk.dueAt=schedBefore.dueAt;sk.intervalIndex=schedBefore.intervalIndex}
 if(!opts.isRepair&&!opts.good){const rid=opts.repairId||id('repair');registerRepair(state,{repairId:rid,originAttemptId:row.attemptId,originLetter:letter,originSkill:skill,repairTarget:opts.confusedWith||opts.selected||'',now:opts.now||Date.now()});row.repairId=rid}
 if(opts.isRepair&&opts.repairId){const r=state.repairs?.[opts.repairId];if(r&&r.open){r.lastRepairAt=opts.now||Date.now();if(opts.good){r.open=false}else r.open=true;const origin=state.letters[r.originLetter]?.skills?.[r.originSkill];if(origin){origin.dueAt=(opts.now||Date.now())+(opts.good?30*MIN:2*MIN);if(!opts.good)origin.repairTarget=r.repairTarget||origin.repairTarget;syncRepairPending(state,r.originLetter,r.originSkill)}}}
 syncRepairPending(state,letter,skill);if(LATIN_TRAPS[letter]&&!opts.isRepair&&opts.firstAttempt!==false&&(skill==='visualToSound'||skill==='confusionDiscrimination'||skill==='soundToLetter')){const t=m.trapStats.latinLookalike;t.attempts++;t.latinTrap=LATIN_TRAPS[letter];const trap=detectLatinTrap(opts.task||{letter,correct:opts.expected,family:opts.family},opts.selected);if(!opts.good&&trap){t.wrong++;t.lastWrongAt=opts.now||Date.now();t.recentWrong.push(1)}else t.recentWrong.push(0);t.recentWrong=t.recentWrong.slice(-8)}
 if(opts.task)noteExposure(state,opts.task,!!opts.good,opts.now||Date.now());recomputeLearningPlan(state,opts.now||Date.now(),{force:true});return row}
function repairTaskV4(task,state,rng=Math.random,meta={}){const originSkill=task.skill||skillForKind(task.type),alternatives=CORE_SKILLS.filter(k=>k!==originSkill).sort((a,b)=>calculateLearningNeed(state,task.letter,b)-calculateLearningNeed(state,task.letter,a)),displaySkill=originSkill==='caseRecognition'?'caseRecognition':(alternatives[0]||originSkill),difficulty=Math.max(1,Math.min(4,difficultyFor(state,task.letter,originSkill))),families=familyCandidates(state,task.letter,displaySkill,difficulty,null).filter(f=>f!==task.family);const family=families[0]||'visual-contrast',fakeSession={sessionId:meta.sessionId||task.sessionId||id('r'),coverageState:{skillCounts:{},familyCounts:{}},mainAnswers:[],recentQuestionSignatures:[],usedWordIds:[]};const out=buildV4Task(state,task.letter,displaySkill,difficulty,family,fakeSession,rng,{isRepair:true,repairLevel:(task.repairLevel||0)+1,createdFromError:true,scheduledReason:'repair'});return {...out,isRepair:true,repair:true,firstAttempt:false,repairId:meta.repairId||task.repairId||'',originAttemptId:meta.originAttemptId||meta.parentAttemptId||'',originLetter:task.letter,originSkill,originalQuestionId:task.originalQuestionId||task.questionId,parentAttemptId:meta.parentAttemptId||'',repairForSkill:originSkill}}
function scheduleRepairForSessionV4(session,task,state,parentAttemptId='',rng=Math.random){if(session.feedback!=='learning'||task.isRepair)return null;const ledger=Object.values(state.repairs||{}).find(r=>r.open&&r.originAttemptId===parentAttemptId)||registerRepair(state,{originAttemptId:parentAttemptId,originLetter:task.letter,originSkill:task.skill,repairTarget:task.confusionTarget||'',now:Date.now()}),gap=3+Math.floor(rng()*5),repair=repairTaskV4(task,state,rng,{sessionId:session.sessionId,parentAttemptId,repairId:ledger.repairId,originAttemptId:parentAttemptId});const row={repairId:ledger.repairId,task:repair,dueAfterMainIndex:session.mainIndex+gap+1,gap,originQuestionId:task.questionId,originAttemptId:parentAttemptId,originLetter:task.letter,originSkill:task.skill,done:false,resolved:false};session.pendingRepairs.push(row);return row}

/* source: alphabet-core-v4-selector-a.js */
function createAdaptiveSession(state,meta={}){const sid=meta.sessionId||id('adaptive'),plan=recomputeLearningPlan(state,Date.now(),{force:true});return {kind:'exam',adaptive:true,sessionId:sid,preset:meta.preset||'my-training',title:meta.title||'Mein Training',scope:meta.scope||'adaptive',feedback:meta.feedback||'learning',targetMainCount:Number(meta.targetMainCount)||20,mainTasks:[],mainIndex:0,mainAnswers:[],repairAnswers:[],mainCorrect:0,mainWrong:0,pendingRepairs:[],repairCurrent:null,repairsResolved:0,repairsFailed:0,errors:[],startedAt:Date.now(),finishedAt:0,certification:meta.certification||'',battle:meta.battle||null,fixedLetters:Array.isArray(meta.fixedLetters)?meta.fixedLetters.filter(c=>ALPHABET.includes(c)):[],focused:!!meta.focused,locked:false,audioTechnicalFailures:0,audioRetryBudget:{},audioIncompleteLetters:[],technicalSkips:[],activeLearningSet:[...plan.activeLetters],reviewSet:reviewSetFor(state),recentQuestionSignatures:[],coverageState:{skillCounts:{},familyCounts:{},letterCounts:{}},usedWordIds:[],startSnapshot:snapshotMastery(state,plan.activeLetters),debug:[]}}
function snapshotMastery(state,letters=ALPHABET){const out={};for(const c of letters){out[c]={mastery:letterMasteryV4(state,c),skills:Object.fromEntries(CORE_SKILLS.map(k=>[k,skillMasteryV4(state,c,k)]))}}return out}
function overexposurePenalty(session,c){const last=(session.mainAnswers||[]).slice(-8),count=last.filter(x=>x.letter===c).length;let p=count*12;if(last.at(-1)?.letter===c)p+=22;if(last.slice(-2).every(x=>x?.letter===c)&&last.length>=2)p+=70;if(count>=4)p+=65;return p}
function selectLetterV4(state,session,rng=Math.random,now=Date.now()){const plan=recomputeLearningPlan(state,now,{force:true});session.activeLearningSet=[...plan.activeLetters];session.reviewSet=reviewSetFor(state,now);let pool,reason;const fixed=(session.fixedLetters||[]).filter(Boolean),scope=String(session.scope||'adaptive');
 if(fixed.length){pool=fixed;reason=session.focused?'focused-letter':'battle-pair'}
 else if(scope==='fake'){pool=[...FAKE_FRIENDS];reason='fake-friend-focus'}
 else if(scope==='errors'){pool=errorLetters(state,now).slice(0,12);if(!pool.length)pool=plan.activeLetters;reason='error-focus'}
 else if(scope==='weak'){pool=uniq([...plan.activeLetters,...weakLetters(state,8,now,rng)]).slice(0,12);reason='weak-focus'}
 else if(scope==='audio'){pool=plan.activeLetters.length?plan.activeLetters:LEARN_ORDER.slice(0,5);reason='audio-focus'}
 else if(scope==='speed'){pool=uniq([...plan.activeLetters,...session.reviewSet,...secureLettersV4(state,now)]).slice(0,14);reason='speed-focus'}
 else{const roll=rng();if(roll<.67&&plan.activeLetters.length){pool=plan.activeLetters;reason='active-learning'}else if(roll<.89&&session.reviewSet.length){pool=session.reviewSet;reason='due-review'}else{const secure=secureLettersV4(state,now).filter(c=>!plan.activeLetters.includes(c));pool=secure.length?secure:plan.activeLetters;reason=secure.length?'secure-control':'active-fallback'}}
 if(!pool?.length)pool=plan.activeLetters.length?plan.activeLetters:LEARN_ORDER.slice(0,5);
 const scored=pool.map(c=>{const need=Math.max(...CORE_SKILLS.map(k=>calculateLearningNeed(state,c,k,now,session))),err=recentWrongCount(state,c,6)*10,due=CORE_SKILLS.filter(k=>state.letters[c].skills[k].dueAt&&state.letters[c].skills[k].dueAt<=now).length*5;return {c,score:need+err+due-overexposurePenalty(session,c)+rng()*5}}).sort((a,b)=>b.score-a.score);return {letter:scored[0]?.c||plan.activeLetters[0]||LEARN_ORDER[0],reason,score:scored[0]?.score||0}}
function selectSkillV4(state,letter,session,rng=Math.random,now=Date.now()){const scope=String(session.scope||'adaptive');if(scope==='audio')return {skill:'audioToLetter',score:calculateLearningNeed(state,letter,'audioToLetter',now,session)+30};if(scope==='speed')return {skill:'speedRecognition',score:100-skillMasteryV4(state,letter,'speedRecognition',now)};let skills=[...CORE_SKILLS];if((session.focused||session.battle)&&letterMasteryV4(state,letter,now)>=55)skills.push('speedRecognition','memoryRecognition');if(session.focused&&letterMasteryV4(state,letter,now)>=78)skills.push('writing');if(scope==='fake')skills=['visualToSound','soundToLetter','confusionDiscrimination'];if(letter==='Ь')skills=skills.filter(k=>k!=='audioToLetter'||WORD_BANK.some(w=>w.letter==='Ь'&&w.audioKey==='Ь'));const scores=skills.map(k=>{let n=calculateLearningNeed(state,letter,k,now,session);const key=`${letter}|${k}`,used=Number(session.coverageState.skillCounts[key])||0;n-=used*7;if(k==='caseRecognition'&&skillMasteryV4(state,letter,k,now)>=75)n-=35;if(session.battle&&k==='confusionDiscrimination')n+=28;if(scope==='fake'&&k==='confusionDiscrimination')n+=22;if(openRepairIds(state,letter,k).length)n+=18;return {skill:k,score:n+rng()*4}}).sort((a,b)=>b.score-a.score);return scores[0]}

/* source: alphabet-core-v4-selector-b.js */
function selectFamilyV4(state,letter,skill,difficulty,session,rng=Math.random){let fams=familyCandidates(state,letter,skill,difficulty,session);if(session.focused){const must=['visual-to-sound','sound-to-letter','visual-find','word-plain','sound-contrast','memory-pair','audio-to-letter'];for(const f of must){if(fams.includes(f)&&!session.coverageState.familyCounts[f])return {family:f,reason:'focused-coverage'}}}
 const scored=[];for(const f of fams){let score=70-(Number(session.coverageState.familyCounts[f])||0)*16-(Number(state.letters[letter].exposure.variantCounts[f])||0)*1.2;if(QUESTION_FAMILIES[f].usesWord&&session.usedWordIds.length<Math.max(3,session.mainIndex*.3))score+=12;if(f==='caseRecognition')score-=20;if(skill==='caseRecognition'&&['upper-to-lower','lower-to-upper'].includes(f)&&skillMasteryV4(state,letter,skill)>=70)score-=30;if(session.battle&&['sound-contrast','visual-contrast','audio-to-letter','audio-word-position','pseudoword','flash-recognition'].includes(f))score+=18;scored.push({family:f,score:score+rng()*8})}scored.sort((a,b)=>b.score-a.score);return {family:scored[0]?.family||fams[0],reason:'need+novelty'}}
function selectNextMainQuestion(state,session,rng=Math.random,now=Date.now()){if(!session?.adaptive)throw new Error('adaptive session required');if(session.mainIndex>=session.targetMainCount)return null;const l=selectLetterV4(state,session,rng,now),s=selectSkillV4(state,l.letter,session,rng,now),d=difficultyFor(state,l.letter,s.skill,now);let best=null;for(let tries=0;tries<30;tries++){const f=selectFamilyV4(state,l.letter,s.skill,d,session,rng),task=buildV4Task(state,l.letter,s.skill,d,f.family,session,rng,{scheduledReason:l.reason});task.selectionReason=`${l.reason}; ${SKILL_LABELS[s.skill]} need ${Math.round(s.score)}; ${f.reason}`;task.needScore=Math.round(s.score);task.signature=questionSignature(task);const novelty=noveltyScore(task,state,session);if(!best||novelty>best.novelty)best={task,novelty};if(novelty>=85&&!session.recentQuestionSignatures.includes(task.signature))break}
 const task=best.task;session.recentQuestionSignatures.push(task.signature);session.recentQuestionSignatures=session.recentQuestionSignatures.slice(-50);const fam=task.family||task.type,key=`${task.letter}|${task.skill}`;session.coverageState.skillCounts[key]=(session.coverageState.skillCounts[key]||0)+1;session.coverageState.familyCounts[fam]=(session.coverageState.familyCounts[fam]||0)+1;session.coverageState.letterCounts[task.letter]=(session.coverageState.letterCounts[task.letter]||0)+1;if(task.wordId&&!session.usedWordIds.includes(task.wordId))session.usedWordIds.push(task.wordId);session.debug.push({letter:task.letter,skill:task.skill,mastery:skillMasteryV4(state,task.letter,task.skill,now),needScore:task.needScore,family:task.family,difficulty:task.difficulty,reason:task.selectionReason,signature:task.signature});session.debug=session.debug.slice(-100);return task}
function createFocusedSession(state,letter,opts={}){return createAdaptiveSession(state,{targetMainCount:opts.size||20,title:`${letter} Intensivtraining`,preset:'focused',scope:'focused',feedback:'learning',fixedLetters:[letter],focused:true})}
function createBattleSession(state,pair,opts={}){return createAdaptiveSession(state,{targetMainCount:opts.size||20,title:`${pair[0]} VS ${pair[1]}`,preset:'battle',scope:'battle',feedback:'learning',fixedLetters:pair,battle:pair})}
function sessionQualityMetrics(session){const tasks=session.mainTasks||[],families=tasks.map(t=>t.family||t.type),variants=tasks.map(t=>t.variant||t.family||t.type),stimuli=tasks.map(t=>t.stimulusId||t.wordId||t.display||''),sigs=tasks.map(questionSignature);let maxLetter=0,maxFamily=0,lr=0,fr=0,pl='',pf='';for(const t of tasks){lr=t.letter===pl?lr+1:1;fr=(t.family||t.type)===pf?fr+1:1;maxLetter=Math.max(maxLetter,lr);maxFamily=Math.max(maxFamily,fr);pl=t.letter;pf=t.family||t.type}return {uniqueFamilies:new Set(families).size,uniqueVariants:new Set(variants).size,uniqueStimuli:new Set(stimuli).size,duplicateSignatureCount:sigs.length-new Set(sigs).size,maxSameLetterRun:maxLetter,maxSameFamilyRun:maxFamily}}
function sessionDelta(state,session,now=Date.now()){const before=session.startSnapshot||{},letters=uniq((session.mainAnswers||[]).map(x=>x.letter)),out=[];for(const c of letters){const a=before[c]?.mastery??letterMasteryV4(state,c,session.startedAt),b=letterMasteryV4(state,c,now),skills={};for(const k of CORE_SKILLS){const x=before[c]?.skills?.[k]??0,y=skillMasteryV4(state,c,k,now);if(y!==x)skills[k]=y-x}out.push({letter:c,before:a,after:b,delta:b-a,skills})}return out}
function buildRealExamV4(state,{size=30,scope='standard',rng=Math.random,now=Date.now(),sessionId=id('real')}={}){const session=createAdaptiveSession(state,{sessionId,targetMainCount:size,title:'Realprüfung',preset:scope,scope,feedback:'real'}),tasks=[];for(let i=0;i<size;i++){session.mainIndex=i;const t=selectNextMainQuestion(state,session,rng,now+i);tasks.push(t);session.mainAnswers.push({letter:t.letter,skill:t.skill,family:t.family,correct:true,simulationOnly:true})}return {size,scope,feedback:'real',sessionId,tasks}}
function buildFinalCertificationV4(state,{rng=Math.random,sessionId=id('final')}={}){const base=buildFinalCertification(state,{rng,sessionId});const fakeSession={sessionId,coverageState:{skillCounts:{},familyCounts:{}},mainAnswers:[],recentQuestionSignatures:[],usedWordIds:[]};base.tasks=base.tasks.map((t,i)=>{if(t.letter!=='Ь'||!['visual','reverse','contrast'].includes(t.type))return t;const skill=t.type==='reverse'?'soundToLetter':t.type==='contrast'?'confusionDiscrimination':'visualToSound',family=skill==='soundToLetter'?'missing-letter':skill==='confusionDiscrimination'?'odd-one-out':'word-plain';return buildV4Task(state,'Ь',skill,Math.max(2,difficultyFor(state,'Ь',skill)),family,fakeSession,rng,{sessionId,scheduledReason:'final-certification'})});return base}
function buildCertificationV4(state,type,opts={}){if(type==='final')return buildFinalCertificationV4(state,opts);if(type==='audio')return buildAudioCertification(state,opts);if(type==='fake')return buildFakeCertification(state,opts);const size=opts.size||50;return buildRealExamV4(state,{size,scope:'weak',rng:opts.rng,sessionId:opts.sessionId})}
function technicalAudioFailureDecision(session,task){const key=task.audioStimulusId||task.questionId,n=(session.audioRetryBudget[key]||0)+1;session.audioRetryBudget[key]=n;session.audioTechnicalFailures++;if(n<2)return {action:'retry',attempt:n};if(session.certification||String(session.scope).includes('certification')||String(session.preset).startsWith('mastery-audio')){if(!session.audioIncompleteLetters.includes(task.letter))session.audioIncompleteLetters.push(task.letter);return {action:'skip-incomplete',attempt:n}}return {action:'fallback',attempt:n}}
function makeAudioFallback(state,task,session,rng=Math.random){const skill=task.skill==='audioToLetter'?'confusionDiscrimination':task.skill,d=Math.max(1,difficultyFor(state,task.letter,skill)),f=familyCandidates(state,task.letter,skill,d,session).find(x=>!QUESTION_FAMILIES[x]?.usesAudio)||'visual-contrast';return buildV4Task(state,task.letter,skill,d,f,session,rng,{scheduledReason:'audio-fallback'})}
function summaryForLetterV4(state,c,now=Date.now()){const base=summaryForLetter(state,c,now),skills={};for(const k of SKILLS){const s=state.letters[c].skills[k];skills[k]={...base.skills[k],mastery:skillMasteryV4(state,c,k,now),confidence:skillConfidence(state,c,k)}}return {...base,mastery:letterMasteryV4(state,c,now),status:letterStatusV4(state,c,now),learningState:learningState(state,c,now),skills,trainNow:CORE_SKILLS.map(k=>[k,calculateLearningNeed(state,c,k,now)]).sort((a,b)=>b[1]-a[1]).slice(0,2).map(x=>SKILL_LABELS[x[0]])}}
function openMasteryItemsV4(state,now=Date.now()){const rows=[];for(const c of ALPHABET){const x=summaryForLetterV4(state,c,now);if(letterReadyV4(state,c,now))continue;const weak=CORE_SKILLS.map(k=>[k,x.skills[k].mastery]).sort((a,b)=>a[1]-b[1])[0],reason=x.writeDays===0?'Schreiben offen':x.retentionDays<(HARD.has(c)?4:3)?`Retention ${x.retentionDays}/${HARD.has(c)?4:3}`:`${SKILL_LABELS[weak[0]]} ${weak[1]}%`;rows.push({letter:c,reason,status:x.status})}return rows}

/* source: alphabet-core-v4-hardening.js */
'use strict';

// V4 production hardening: keep the adaptive architecture, but make diversity and
// skill/family matching strict enough to be testable rather than probabilistic.
for(const w of WORD_BANK){
  const required=uniq([...w.word.toLocaleUpperCase('uk')].filter(ch=>ALPHABET.includes(ch)));
  w.knownLettersRequired=required;
}

const familyCandidatesV4Base=familyCandidates;
familyCandidates=function(state,letter,skill,difficulty,session){
  let families=familyCandidatesV4Base(state,letter,skill,difficulty,session);
  if(letter==='Ь'){
    const soft={
      visualToSound:['visual-find','word-image','word-plain','word-position','word-contains','tap-target','multi-occurrence','count-target'],
      soundToLetter:['missing-letter','word-choice'],
      caseRecognition:['same-different','pair-match'],
      audioToLetter:['audio-word-position'],
      confusionDiscrimination:['odd-one-out','visual-contrast','error-correction'],
      speedRecognition:['flash-recognition'],memoryRecognition:['memory-pair'],writing:['writing-recall']
    };
    return (soft[skill]||['word-plain']).filter(f=>QUESTION_FAMILIES[f]);
  }
  families=families.filter(f=>LATIN_TRAPS[letter]||!['latin-trap','reverse-fake-friend'].includes(f));
  const matching=families.filter(f=>QUESTION_FAMILIES[f]?.skill===skill);
  if(matching.length)return matching;
  const all=Object.entries(QUESTION_FAMILIES)
    .filter(([f,m])=>m.skill===skill&&(LATIN_TRAPS[letter]||!['latin-trap','reverse-fake-friend'].includes(f)))
    .filter(([,m])=>!m.usesAudio||WORD_BANK.some(w=>w.letter===letter&&w.audioKey===letter));
  if(!all.length)return ['visual-to-sound'];
  let minDistance=Infinity;
  for(const [,m] of all){const d=difficulty<m.min?m.min-difficulty:difficulty>m.max?difficulty-m.max:0;minDistance=Math.min(minDistance,d)}
  return all.filter(([,m])=>(difficulty<m.min?m.min-difficulty:difficulty>m.max?difficulty-m.max:0)===minDistance).map(([f])=>f);
};

const pickWordV4Base=pickWord;
pickWord=function(state,letter,session,rng=Math.random,{multiple=false,audioOnly=false}={}){
  let pool=wordsForLetter(letter).filter(w=>!multiple||w.targetIndexes.length>1).filter(w=>!audioOnly||w.audioKey===letter);
  if(!pool.length)pool=wordsForLetter(letter);
  if(!pool.length)return pickWordV4Base(state,letter,session,rng,{multiple,audioOnly});
  const introduced=new Set(state.learningPlan?.introducedLetters||[]),used=new Set(session?.usedWordIds||[]);
  const score=w=>{
    const unknown=(w.knownLettersRequired||[]).filter(c=>c!==letter&&!introduced.has(c)).length;
    const stats=wordStat(state,letter,w.id);
    return (used.has(w.id)?1000:0)+unknown*24+stats.seen*7+(w.level||1)*1.5;
  };
  pool=[...pool].sort((a,b)=>score(a)-score(b)||a.id.localeCompare(b.id));
  const bestScore=score(pool[0]),best=pool.filter(w=>score(w)<=bestScore+1.5).slice(0,3);
  return best[Math.floor(rng()*best.length)]||pool[0];
};

const buildV4TaskBase=buildV4Task;
function structuralVariant(task){
  const family=task.family||task.type||'task';
  if(task.wordId)return `${family}:word`;
  if(task.fontId)return `${family}:font:${task.fontId}`;
  if(task.flashMs)return `${family}:flash:${task.flashMs}`;
  if(task.interaction==='multiSelect')return `${family}:multi`;
  if(task.interaction==='writingRecall')return `${family}:write`;
  if(task.confusionTarget)return `${family}:contrast:${task.confusionTarget}`;
  return `${family}:${task.type||'choice'}`;
}
buildV4Task=function(state,letter,skill,difficulty,family,session,rng=Math.random,meta={}){
  const task=buildV4TaskBase(state,letter,skill,difficulty,family,session,rng,meta);
  task.variant=structuralVariant(task);
  task.answerOrderKey=(task.options||[]).join('¦');
  return task;
};

questionSignature=function(task){
  const optionSet=[...(task.options||[])].map(String).sort((a,b)=>a.localeCompare(b,'uk')).join(',');
  const tokenStimulus=(task.tokens||[]).join('');
  const stimulus=task.stimulusId||task.wordId||task.audioStimulusId||tokenStimulus||task.display||'';
  return [task.letter,task.skill,task.family||task.type,task.variant||'',task.type||'',stimulus,task.fontId||'',task.confusionTarget||'',task.interaction||'choice',optionSet].join('|');
};

const FOCUSED_BEGINNER=['visual-to-sound','sound-to-letter','upper-to-lower','visual-find','word-image','word-contains','audio-to-letter','visual-contrast','syllable','word-plain','word-position','pair-match'];
const FOCUSED_APPLICATION=['word-position','count-target','multi-select','missing-letter','word-plain','pseudoword','sound-contrast','visual-contrast','audio-to-letter','font-recognition','memory-pair','sound-to-letter','word-choice','tap-target','pair-match'];
const FOCUSED_ADVANCED=['audio-to-letter','sound-contrast','visual-contrast','word-position','count-target','multi-select','missing-letter','pseudoword','font-recognition','flash-recognition','memory-pair','word-choice','tap-target','multi-occurrence','same-different','error-correction','writing-recall','sound-to-letter'];
const SOFT_FOCUSED=['word-image','word-plain','word-position','word-contains','tap-target','multi-occurrence','count-target','missing-letter','word-choice','visual-contrast','odd-one-out','error-correction','same-different','pair-match','audio-word-position','memory-pair','writing-recall'];
const BATTLE_COVERAGE=['visual-contrast','sound-contrast','audio-to-letter','word-plain','pseudoword','flash-recognition','sound-to-letter','multi-select','memory-pair','word-position'];
const DIRECT_CASE_FAMILIES=new Set(['upper-to-lower','lower-to-upper','pair-match']);

function familySkillFor(letter,family){
  if(letter!=='Ь')return QUESTION_FAMILIES[family]?.skill||'visualToSound';
  if(['missing-letter','word-choice'].includes(family))return 'soundToLetter';
  if(['same-different','pair-match'].includes(family))return 'caseRecognition';
  if(family==='audio-word-position')return 'audioToLetter';
  if(['odd-one-out','visual-contrast','error-correction'].includes(family))return 'confusionDiscrimination';
  if(family==='flash-recognition')return 'speedRecognition';
  if(family==='memory-pair')return 'memoryRecognition';
  if(family==='writing-recall')return 'writing';
  return 'visualToSound';
}
function familyAllowedFor(letter,family){
  if(!QUESTION_FAMILIES[family])return false;
  if(!LATIN_TRAPS[letter]&&['latin-trap','reverse-fake-friend'].includes(family))return false;
  if(letter==='Ь'&&!SOFT_FOCUSED.includes(family))return false;
  return true;
}
function focusedFamilyOrder(state,letter,session,now){
  if(letter==='Ь')return SOFT_FOCUSED;
  const mastery=letterMasteryV4(state,letter,now),caseStrong=skillMasteryV4(state,letter,'caseRecognition',now)>=75&&!openRepairIds(state,letter,'caseRecognition').length;
  const primary=mastery<35?FOCUSED_BEGINNER:mastery<75?FOCUSED_APPLICATION:FOCUSED_ADVANCED;
  const secondary=mastery<35?FOCUSED_APPLICATION:mastery<75?FOCUSED_ADVANCED:FOCUSED_APPLICATION;
  return uniq([...primary,...secondary]).filter(f=>familyAllowedFor(letter,f)).filter(f=>!caseStrong||!DIRECT_CASE_FAMILIES.has(f));
}
function candidateFamiliesFor(state,letter,skill,difficulty,session,now){
  if(session.focused)return focusedFamilyOrder(state,letter,session,now);
  if(session.battle)return uniq([...BATTLE_COVERAGE,...familyCandidates(state,letter,skill,difficulty,session)]).filter(f=>familyAllowedFor(letter,f));
  return familyCandidates(state,letter,skill,difficulty,session).filter(f=>familyAllowedFor(letter,f));
}
function registerSelectedTask(state,session,task,debugMeta,now){
  const sig=questionSignature(task),fam=task.family||task.type,key=`${task.letter}|${task.skill}`;
  task.signature=sig;
  session.recentQuestionSignatures.push(sig);session.recentQuestionSignatures=session.recentQuestionSignatures.slice(-50);
  session.coverageState.skillCounts[key]=(session.coverageState.skillCounts[key]||0)+1;
  session.coverageState.familyCounts[fam]=(session.coverageState.familyCounts[fam]||0)+1;
  session.coverageState.letterCounts[task.letter]=(session.coverageState.letterCounts[task.letter]||0)+1;
  if(task.wordId&&!session.usedWordIds.includes(task.wordId))session.usedWordIds.push(task.wordId);
  session.debug.push({letter:task.letter,skill:task.skill,mastery:skillMasteryV4(state,task.letter,task.skill,now),needScore:task.needScore,family:task.family,difficulty:task.difficulty,reason:task.selectionReason,signature:sig,...debugMeta});
  session.debug=session.debug.slice(-100);
  return task;
}

selectNextMainQuestion=function(state,session,rng=Math.random,now=Date.now()){
  if(!session?.adaptive)throw new Error('adaptive session required');
  if(session.mainIndex>=session.targetMainCount)return null;
  const letterPick=selectLetterV4(state,session,rng,now),letter=letterPick.letter;
  const skillPick=selectSkillV4(state,letter,session,rng,now),baseSkill=skillPick.skill,baseDifficulty=difficultyFor(state,letter,baseSkill,now);
  let families=candidateFamiliesFor(state,letter,baseSkill,baseDifficulty,session,now);
  const unseen=families.filter(f=>!session.coverageState.familyCounts[f]);
  if((session.focused||session.battle)&&unseen.length)families=[...unseen,...families.filter(f=>session.coverageState.familyCounts[f])];
  const usedSignatures=new Set(session.recentQuestionSignatures||[]);
  let bestUnique=null,bestAny=null;
  for(const family of families){
    const skill=familySkillFor(letter,family),meta=QUESTION_FAMILIES[family]||{},raw=difficultyFor(state,letter,skill,now),difficulty=clamp(raw,meta.min??0,meta.max??5);
    const need=calculateLearningNeed(state,letter,skill,now,session),coverageBonus=session.coverageState.familyCounts[family]?0:24;
    for(let attempt=0;attempt<5;attempt++){
      const task=buildV4Task(state,letter,skill,difficulty,family,session,rng,{scheduledReason:letterPick.reason});
      task.needScore=Math.round(need);task.selectionReason=`${letterPick.reason}; ${SKILL_LABELS[skill]||skill} need ${Math.round(need)}; diversity-aware`;
      const sig=questionSignature(task),novelty=noveltyScore(task,state,session),priority=novelty+coverageBonus+clamp(need,0,160)*.9;
      const row={task,novelty,priority,sig};
      if(!bestAny||priority>bestAny.priority)bestAny=row;
      if(!usedSignatures.has(sig)&&(!bestUnique||priority>bestUnique.priority))bestUnique=row;
    }
  }
  if(!bestUnique){
    const broad=Object.keys(QUESTION_FAMILIES).filter(f=>familyAllowedFor(letter,f));
    for(const family of broad){
      const skill=familySkillFor(letter,family),meta=QUESTION_FAMILIES[family],difficulty=clamp(difficultyFor(state,letter,skill,now),meta.min??0,meta.max??5),need=calculateLearningNeed(state,letter,skill,now,session);
      for(let attempt=0;attempt<8;attempt++){
        const task=buildV4Task(state,letter,skill,difficulty,family,session,rng,{scheduledReason:letterPick.reason});
        task.needScore=Math.round(need);task.selectionReason=`${letterPick.reason}; duplicate-avoidance fallback`;
        const sig=questionSignature(task),novelty=noveltyScore(task,state,session),priority=novelty+clamp(need,0,160)*.75;
        if(!usedSignatures.has(sig)&&(!bestUnique||priority>bestUnique.priority))bestUnique={task,novelty,priority,sig};
      }
    }
  }
  const chosen=bestUnique||bestAny;
  if(!chosen)throw new Error(`No adaptive task available for ${letter}`);
  return registerSelectedTask(state,session,chosen.task,{novelty:Math.round(chosen.novelty),priority:Math.round(chosen.priority)},now);
};

const masteredV4Base=masteredV4;
masteredV4=function(state,now=Date.now()){
  const r=masteredV4Base(state,now);
  const audio=(state.masteryChecks.audio||[]).some(x=>x.accuracy>=.95&&x.total>=33&&x.humanAudioOnly===true&&x.coverageLetters?.length===33&&!x.technicalIncomplete&&!x.technicallyIncomplete);
  return {...r,audio,done:r.allLetters&&r.finals&&r.fake&&audio&&r.retention&&r.speed};
};

/* source: alphabet-core-v4-completion.js */
'use strict';

const HUMAN_LETTER_AUDIO_LETTERS=ALPHABET.filter(c=>c!=='Ь');
const MACRO_PHASES=Object.freeze([
  {id:'warmup',label:'Warm-up',from:0,to:3,scope:'adaptive'},
  {id:'errors',label:'Fehler & Schwächen',from:4,to:11,scope:'errors'},
  {id:'active',label:'Aktives Lernfeld',from:12,to:21,scope:'adaptive'},
  {id:'mixed',label:'Mischprüfung',from:22,to:29,scope:'adaptive'},
  {id:'automation',label:'Automatisierung',from:30,to:35,scope:'speed'}
]);

QUESTION_FAMILIES['letter-to-audio-choice']={skill:'visualToSound',min:2,max:5,weight:.95,usesAudio:true,production:1,countsForMastery:true};
FAMILY_PROMPTS['letter-to-audio-choice']=[
  'Welche menschliche Aufnahme gehört zu diesem ukrainischen Buchstaben?',
  'Höre die Kandidaten. Welche Buchstabenaussprache passt zum Zeichen?',
  'Welcher Audio-Kandidat spricht genau diesen Buchstaben aus?',
  'Zeichen gesehen – welche echte Buchstabenaufnahme gehört dazu?',
  'Vergleiche die Aufnahmen: Welche gehört zu diesem Zeichen?'
];

function isolatedHumanAudioSupported(letter){return HUMAN_LETTER_AUDIO_LETTERS.includes(letter)}
function macroPhase(session){const i=Math.max(0,Number(session?.mainIndex)||0);return MACRO_PHASES.find(p=>i>=p.from&&i<=p.to)||MACRO_PHASES.at(-1)}
function createMacroSession(state,opts={}){const s=createAdaptiveSession(state,{targetMainCount:36,title:'20-Minuten Intensiv',preset:'macro-20',scope:'adaptive',feedback:'learning'});s.macro=true;s.phasePlan=MACRO_PHASES.map(x=>({...x}));s.startSnapshot=snapshotMastery(state,activeLearningSet(state));return s}

const buildV4TaskCompletionBase=buildV4Task;
buildV4Task=function(state,letter,skill,difficulty,family,session,rng=Math.random,meta={}){
  if(family==='letter-to-audio-choice'){
    if(!isolatedHumanAudioSupported(letter)){
      const fallback=familyCandidates(state,letter,'visualToSound',difficulty,session).find(f=>f!=='letter-to-audio-choice'&&!QUESTION_FAMILIES[f]?.usesAudio)||'word-plain';
      return buildV4TaskCompletionBase(state,letter,'visualToSound',difficulty,fallback,session,rng,meta);
    }
    const p=promptForFamily(family,rng),conf=uniq([...(LETTER_PEDAGOGY[letter]?.confusions||[]),...personalConfusions(state,letter),...shuffle(HUMAN_LETTER_AUDIO_LETTERS.filter(c=>c!==letter),rng)]).filter(c=>c!==letter&&c!=='Ь').slice(0,3),choices=shuffle(uniq([letter,...conf]).slice(0,4),rng);
    return {questionId:id('q'),sessionId:session?.sessionId||meta.sessionId||'',letter,skill:'visualToSound',type:'audioChoice',family,variant:family,promptFamily:family,promptId:p.id,prompt:p.text,difficulty,firstAttempt:!meta.isRepair,isRepair:!!meta.isRepair,repairLevel:Number(meta.repairLevel)||0,createdFromError:!!meta.createdFromError,scheduledReason:meta.scheduledReason||'adaptive',evidenceWeight:.95,countsForMastery:true,interaction:'audioChoice',display:letter,correct:letter,options:choices,audioChoiceLetters:choices,requiresHumanLetterAudio:true,audioStimulusId:`isolated-letter-choice-${letter}`,stimulusId:`isolated-letter-choice-${choices.slice().sort().join('')}`};
  }
  return buildV4TaskCompletionBase(state,letter,skill,difficulty,family,session,rng,meta)
};

const familyCandidatesCompletionBase=familyCandidates;
familyCandidates=function(state,letter,skill,difficulty,session){
  let fam=familyCandidatesCompletionBase(state,letter,skill,difficulty,session);
  if(letter==='Ь')return fam.filter(f=>f!=='letter-to-audio-choice');
  if(skill==='visualToSound'&&difficulty>=2&&isolatedHumanAudioSupported(letter)&&!fam.includes('letter-to-audio-choice'))fam=[...fam,'letter-to-audio-choice'];
  return fam
};

const selectNextMainQuestionCompletionBase=selectNextMainQuestion;
selectNextMainQuestion=function(state,session,rng=Math.random,now=Date.now()){
  if(!session?.macro)return selectNextMainQuestionCompletionBase(state,session,rng,now);
  const phase=macroPhase(session),oldScope=session.scope;
  if(phase.id==='errors')session.scope=errorLetters(state,now).length?'errors':'weak';
  else if(phase.id==='automation'){
    const active=session.activeLearningSet?.length?session.activeLearningSet:activeLearningSet(state,now),avg=active.length?active.reduce((n,c)=>n+letterMasteryV4(state,c,now),0)/active.length:0;
    session.scope=avg>=55?'speed':'adaptive';
  }else session.scope='adaptive';
  const task=selectNextMainQuestionCompletionBase(state,session,rng,now);session.scope=oldScope;
  if(task){task.macroPhase=phase.id;task.selectionReason=`${phase.label}; ${task.selectionReason||'adaptiv'}`}
  return task
};

/* source: alphabet-core-v5-production-model.js */
'use strict';

const V5_VERSION=5;
const V5_SKILLS=[...SKILLS,'writtenProduction'];
const V5_SKILL_LABELS={...SKILL_LABELS,writtenProduction:'Produktion'};
const PRODUCTION_FAMILIES=Object.freeze({
  'visual-memory-writing':{min:2,max:5,usesAudio:false,label:'Vorlage → Schreiben'},
  'sound-to-writing':{min:3,max:5,usesAudio:false,label:'Laut → Schreiben'},
  'audio-to-writing':{min:4,max:5,usesAudio:true,label:'Audio → Schreiben'},
  'confusion-writing':{min:3,max:5,usesAudio:false,label:'Verwechslung → Schreiben'},
  'case-writing':{min:3,max:5,usesAudio:false,label:'Groß/Klein → Schreiben'}
});
for(const [family,m] of Object.entries(PRODUCTION_FAMILIES))QUESTION_FAMILIES[family]={skill:'writtenProduction',min:m.min,max:m.max,weight:0,production:2,countsForMastery:false,usesAudio:!!m.usesAudio};
if(QUESTION_FAMILIES['letter-to-audio-choice']){QUESTION_FAMILIES['letter-to-audio-choice'].weight=.55;QUESTION_FAMILIES['letter-to-audio-choice'].countsForMastery=false}

function freshProductionSkill(){return {attempts:0,independentAttempts:0,repairAttempts:0,successfulSelfChecks:0,uncertainSelfChecks:0,unsuccessfulSelfChecks:0,repairSuccessful:0,repairUncertain:0,repairFailed:0,successDays:[],recentResults:[],lastSeenAt:0,lastWrongAt:0,lastAudioWritingAt:0,lastFamily:'',lastRating:'',dueAt:0,intervalIndex:0,ease:2.3,repairPending:false,repairTarget:'',confidenceEvidence:0}}
function normalizeProductionSkill(raw={}){const s={...freshProductionSkill(),...(raw||{})};s.successDays=uniq(Array.isArray(raw.successDays)?raw.successDays.filter(Boolean):[]).sort();s.recentResults=Array.isArray(raw.recentResults)?raw.recentResults.slice(-16):[];for(const k of ['attempts','independentAttempts','repairAttempts','successfulSelfChecks','uncertainSelfChecks','unsuccessfulSelfChecks','repairSuccessful','repairUncertain','repairFailed','confidenceEvidence'])s[k]=Math.max(0,Number(s[k])||0);return s}
function ensureProductionLetter(state,c){const m=state.letters[c];m.skills=m.skills||{};m.skills.writtenProduction=normalizeProductionSkill(m.skills.writtenProduction||{});m.productionHistory=Array.isArray(m.productionHistory)?m.productionHistory.slice(-40):[];return m.skills.writtenProduction}
function ensureV5State(state){state.version=Math.max(Number(state.version)||0,V5_VERSION);state.masteryChecks={final:[],fake:[],audio:[],retention:[],production:[],...(state.masteryChecks||{})};state.productionHistory=Array.isArray(state.productionHistory)?state.productionHistory.slice(-180):[];state.learningPlan={...(state.learningPlan||freshLearningPlan()),lastUnlockMainCount:Number(state.learningPlan?.lastUnlockMainCount)||0,lastIntroducedLetter:state.learningPlan?.lastIntroducedLetter||'',lastProductionRecomputedAt:Number(state.learningPlan?.lastProductionRecomputedAt)||0};for(const c of ALPHABET)ensureProductionLetter(state,c);return state}
function freshStateV5(){return ensureV5State(freshStateV4())}
function migrateV5(raw){const state=ensureV5State(migrateV4(raw)),mainCount=(state.answerLog||[]).filter(x=>x.firstAttempt&&!x.isRepair).length;if(!Number.isFinite(state.learningPlan.lastUnlockMainCount)||state.learningPlan.lastUnlockMainCount<0)state.learningPlan.lastUnlockMainCount=mainCount;return state}

function productionConfidence(state,c){const s=ensureProductionLetter(state,c),days=uniq(s.successDays).length,e=Math.min(12,s.confidenceEvidence||0);return Math.round(clamp(e/8*.75+days/3*.25,0,1)*100)}
function productionMastery(state,c,now=Date.now()){const s=ensureProductionLetter(state,c);if(!s.independentAttempts)return 0;const recent=s.recentResults.filter(x=>x&&!x.repair).slice(-10),recentScore=recent.length?recent.reduce((n,x)=>n+(x.rating==='pass'?1:x.rating==='unsure'?.35:0),0)/recent.length:0,den=Math.max(1,s.successfulSelfChecks+s.uncertainSelfChecks+s.unsuccessfulSelfChecks),life=(s.successfulSelfChecks+s.uncertainSelfChecks*.35)/den,ret=clamp(uniq(s.successDays).length/(HARD.has(c)?4:3),0,1),evidence=clamp(s.confidenceEvidence/7,0,1);let score=(recentScore*.52+life*.28+ret*.20)*100*(.4+.6*evidence);if(s.repairPending)score-=12;if(s.dueAt&&s.dueAt<now-14*DAY)score*=.9;return Math.round(clamp(score,0,100))}
function skillMasteryV5(state,c,skill,now=Date.now()){return skill==='writtenProduction'?productionMastery(state,c,now):skillMasteryV4(state,c,skill,now)}
function skillConfidenceV5(state,c,skill){return skill==='writtenProduction'?productionConfidence(state,c):skillConfidence(state,c,skill)}
function severeProductionBlock(state,c){return ['soundToLetter','audioToLetter','confusionDiscrimination'].some(k=>openRepairIds(state,c,k).length&&skillMasteryV4(state,c,k)<62)}
function writtenProductionReady(state,c,now=Date.now()){if(!ALPHABET.includes(c))return false;const m=state.letters[c],visual=skillMasteryV4(state,c,'visualToSound',now),reverse=skillMasteryV4(state,c,'soundToLetter',now),audio=skillMasteryV4(state,c,'audioToLetter',now),coreAttempts=CORE_SKILLS.reduce((n,k)=>n+(m.skills[k]?.independentAttempts||0),0),families=uniq((state.answerLog||[]).filter(x=>x.letter===c&&x.firstAttempt&&!x.isRepair&&x.correct).map(x=>x.type)).length,hasWriting=(m.writeDays||[]).length>0,days=retentionDaysForLetter(state,c).length,conf=(skillConfidence(state,c,'visualToSound')+skillConfidence(state,c,'soundToLetter')+skillConfidence(state,c,'audioToLetter'))/3;if(c==='Ь')return visual>=72&&reverse>=62&&coreAttempts>=7&&families>=2&&hasWriting&&!severeProductionBlock(state,c)&&(days>=2||conf>=72);const base=visual>=70&&reverse>=65&&audio>=60&&coreAttempts>=5&&families>=2&&hasWriting&&!severeProductionBlock(state,c);if(!base)return false;return HARD.has(c)?(days>=2||conf>=72):true}
function productionDifficulty(state,c,now=Date.now()){const base=letterMasteryV4(state,c,now),p=productionMastery(state,c,now),s=ensureProductionLetter(state,c);let d=base<55?2:base<75?3:base<90?4:5;if(s.independentAttempts<2)d=Math.min(d,4);if(p<35)d=Math.min(d,4);if(HARD.has(c)&&s.independentAttempts<2)d=Math.min(d,4);return d}
function audioWrittenProductionReady(state,c,now=Date.now()){return c!=='Ь'&&isolatedHumanAudioSupported(c)&&writtenProductionReady(state,c,now)&&skillMasteryV4(state,c,'audioToLetter',now)>=62&&skillConfidence(state,c,'audioToLetter')>=45&&productionDifficulty(state,c,now)>=4}
function productionStage(state,c,now=Date.now()){if(!writtenProductionReady(state,c,now))return 'locked';const s=ensureProductionLetter(state,c),m=productionMastery(state,c,now),conf=productionConfidence(state,c);if(!s.independentAttempts)return 'open';if(m>=72&&conf>=65&&uniq(s.successDays).length>=2&&!s.repairPending)return 'stable';return 'building'}
function productionStatusLabel(stage){return ({locked:'noch nicht sinnvoll',open:'offen',building:'im Aufbau',stable:'stabil'})[stage]||'im Aufbau'}
function productionNeed(state,c,now=Date.now(),session=null){if(!writtenProductionReady(state,c,now))return -999;const s=ensureProductionLetter(state,c),m=productionMastery(state,c,now),due=s.dueAt&&s.dueAt<=now?16:0,repair=s.repairPending?24:0,under=Math.max(0,4-s.independentAttempts)*8,conf=(100-productionConfidence(state,c))*.12;let exposure=0;if(session){exposure+=(session.productionAnswers||[]).slice(-4).filter(x=>x.letter===c).length*25;if(session.lastProductionLetter===c)exposure+=30}return Math.round((100-m)+due+repair+under+conf-exposure)}
function productionFamiliesFor(state,c,now=Date.now()){if(!writtenProductionReady(state,c,now))return [];const out=['visual-memory-writing'];if(skillMasteryV4(state,c,'soundToLetter',now)>=68)out.push('sound-to-writing');if(audioWrittenProductionReady(state,c,now))out.push('audio-to-writing');if(skillMasteryV4(state,c,'confusionDiscrimination',now)>=62&&(LETTER_PEDAGOGY[c]?.confusions||[]).length)out.push('confusion-writing');if(skillMasteryV4(state,c,'caseRecognition',now)>=72)out.push('case-writing');return uniq(out)}

/* source: alphabet-core-v5-production-tasks.js */
'use strict';

function productionPrompt(c,family,rng=Math.random){
  const d=DATA[c];
  if(family==='sound-to-writing')return `Zeichne den ukrainischen Buchstaben für den Laut ${d.short}.`;
  if(family==='audio-to-writing')return 'Höre genau. Zeichne den Buchstaben aus dem Gedächtnis.';
  if(family==='confusion-writing'){
    const other=LETTER_PEDAGOGY[c]?.confusions?.[0];
    return `Zeichne den ukrainischen Buchstaben für ${d.short}.${other?` Nicht mit ${other} verwechseln.`:''}`;
  }
  if(family==='case-writing')return rng()>.5?'Zeichne die Kleinform des gezeigten Buchstabens.':'Zeichne die Großform des gezeigten Buchstabens.';
  return 'Merke dir die Form. Zeichne den Buchstaben danach aus dem Gedächtnis.';
}
function productionTask(state,c,family,session,rng=Math.random,meta={}){
  const d=DATA[c],difficulty=productionDifficulty(state,c),task={questionId:id('prodq'),sessionId:session?.sessionId||meta.sessionId||'',letter:c,skill:'writtenProduction',type:'writtenProduction',family,variant:family,promptFamily:family,promptId:`${family}-1`,prompt:productionPrompt(c,family,rng),difficulty,firstAttempt:!meta.isRepair,isRepair:!!meta.isRepair,repairLevel:Number(meta.repairLevel)||0,createdFromError:!!meta.createdFromError,scheduledReason:meta.scheduledReason||'production',evidenceWeight:0,countsForMastery:false,objectiveScored:false,interaction:'writtenProduction',correct:'SELF',options:[],referenceUpper:c,referenceLower:d.lower,requiresHumanLetterAudio:false,display:'',stimulusId:`${family}-${c}`};
  if(family==='visual-memory-writing'){task.display=c;task.cueMs=difficulty>=4?900:1500;task.stimulusId=`visual-memory-${c}-${task.cueMs}`}
  if(family==='case-writing'){
    const askLower=rng()>.5;task.display=askLower?c:d.lower;task.caseTarget=askLower?'lower':'upper';task.prompt=`Zeichne die ${askLower?'Kleinform':'Großform'} des gezeigten Buchstabens.`;task.stimulusId=`case-${c}-${task.caseTarget}`;
  }
  if(family==='audio-to-writing'){task.requiresHumanLetterAudio=true;task.audioStimulusId=`isolated-letter-${c}`;task.stimulusId=`audio-writing-${c}`;task.display=''}
  if(family==='confusion-writing'){task.confusionTarget=LETTER_PEDAGOGY[c]?.confusions?.[0]||'';task.stimulusId=`confusion-writing-${c}-${task.confusionTarget}`}
  return task;
}
function selectProductionLetter(state,session,rng=Math.random,now=Date.now()){
  const fixed=session?.fixedProductionLetters?.length?session.fixedProductionLetters:[];
  const pool=uniq([...fixed,...(session?.activeLearningSet||[]),...(session?.reviewSet||[]),...ALPHABET]).filter(c=>writtenProductionReady(state,c,now));
  if(!pool.length)return null;
  return pool.map(c=>({c,score:productionNeed(state,c,now,session)+rng()*5})).sort((a,b)=>b.score-a.score)[0]?.c||null;
}
function selectProductionTask(state,session,rng=Math.random,now=Date.now()){
  const c=selectProductionLetter(state,session,rng,now);if(!c)return null;
  const families=productionFamiliesFor(state,c,now);if(!families.length)return null;
  const recent=new Set((session.productionAnswers||[]).slice(-5).filter(x=>x.letter===c).map(x=>x.family)),history=state.productionHistory||[];
  const scored=families.map(f=>{let score=100;if(recent.has(f))score-=55;score-=history.filter(x=>x.letter===c&&x.family===f).slice(-8).length*5;if(f==='audio-to-writing'&&audioWrittenProductionReady(state,c,now))score+=12;if(f==='case-writing'&&skillMasteryV4(state,c,'caseRecognition',now)>90)score-=20;return {f,score:score+rng()*8}}).sort((a,b)=>b.score-a.score);
  return productionTask(state,c,scored[0].f,session,rng);
}
function productionQuotaForSession(state,session,now=Date.now()){
  if(session?.feedback==='real'||session?.preset==='diagnostic'||session?.certification)return 0;
  if(session?.productionOnly)return Math.max(0,Number(session.productionTargetCount)||0);
  const ready=ALPHABET.filter(c=>writtenProductionReady(state,c,now));if(!ready.length)return 0;
  const avg=ready.reduce((n,c)=>n+letterMasteryV4(state,c,now),0)/ready.length;
  let q=ready.length<3?1:ready.length<8?2:ready.length<16?3:avg>=88?5:4;
  if(session?.macro){const phase=macroPhase(session)?.id;q=phase==='warmup'?0:phase==='errors'?Math.min(1,q):phase==='active'?Math.min(2,q):phase==='mixed'?Math.min(3,q):q}
  return q;
}
function shouldInsertProduction(state,session,now=Date.now()){
  if((!session?.adaptive&&!session?.productionOnly)||session?.preset==='diagnostic')return false;
  const quota=productionQuotaForSession(state,session,now),done=(session.productionAnswers||[]).filter(x=>!x.isRepair).length;
  if(done>=quota)return false;if(session.productionCurrent)return true;if(session.productionOnly)return true;if(session.mainIndex<3)return false;
  const last=Number(session.lastProductionMainIndex??-99);if(session.mainIndex-last<3)return false;
  const remaining=Math.max(0,session.targetMainCount-session.mainIndex),need=quota-done;
  return remaining<=need*3||session.mainIndex%4===0;
}
function initProductionSession(session){
  session.productionAnswers=Array.isArray(session.productionAnswers)?session.productionAnswers:[];
  session.productionCurrent=session.productionCurrent||null;
  session.lastProductionMainIndex=Number.isFinite(session.lastProductionMainIndex)?session.lastProductionMainIndex:-99;
  session.lastProductionLetter=session.lastProductionLetter||'';
  session.productionTechnicalSkips=Array.isArray(session.productionTechnicalSkips)?session.productionTechnicalSkips:[];
  session.productionTargetCount=Number(session.productionTargetCount)||0;
  return session;
}
function createProductionTestSession(state,count=5){
  const eligible=ALPHABET.filter(c=>writtenProductionReady(state,c)),n=Math.max(1,Math.min(Number(count)||5,eligible.length||1));
  const s=createAdaptiveSession(state,{targetMainCount:0,title:`Produktionstest ${n}`,preset:`production-${n}`,scope:'production',feedback:'learning'});
  s.productionOnly=true;s.productionTargetCount=n;s.fixedProductionLetters=eligible.sort((a,b)=>ensureProductionLetter(state,a).independentAttempts-ensureProductionLetter(state,b).independentAttempts).slice(0,n);s.startSnapshot=snapshotMastery(state,eligible);
  return initProductionSession(s);
}
function productionTestAvailability(state){const ready=ALPHABET.filter(c=>writtenProductionReady(state,c)).length;return {ready,test5:ready>=5,test10:ready>=10,test20:ready>=20,full:ready>=28}}

/* source: alphabet-core-v5-production-state.js */
'use strict';

function scheduleProductionSkill(s,rating,now){
  if(rating==='again'){s.intervalIndex=Math.max(0,s.intervalIndex-1);s.dueAt=now+2*MIN;s.ease=Math.max(1.7,s.ease-.15);return}
  s.intervalIndex=rating==='pass'?Math.min(8,s.intervalIndex+1):Math.max(1,s.intervalIndex);
  const base=rating==='pass'?[10*MIN,30*MIN,6*HOUR,DAY,3*DAY,7*DAY,14*DAY,30*DAY,60*DAY][s.intervalIndex]:30*MIN;
  s.dueAt=now+base;s.ease=clamp(s.ease+(rating==='pass'?.05:-.04),1.7,2.7);
}
function recordProductionSelfCheck(state,{letter,family,rating='unsure',now=Date.now(),isRepair=false,repairId='',sessionId='',questionId='',audioSource='',strokeCount=0,durationMs=0,bounds=null}={}){
  if(!ALPHABET.includes(letter))throw new Error('Unknown production letter '+letter);
  if(!['pass','unsure','again'].includes(rating))throw new Error('Unknown production rating '+rating);
  const s=ensureProductionLetter(state,letter),day=localDateKey(now);touchStudy(state,now);s.attempts++;s.lastSeenAt=now;s.lastFamily=family;s.lastRating=rating;if(family==='audio-to-writing')s.lastAudioWritingAt=now;
  if(isRepair){
    s.repairAttempts++;rating==='pass'?s.repairSuccessful++:rating==='unsure'?s.repairUncertain++:s.repairFailed++;
    if(repairId&&state.repairs?.[repairId]){const r=state.repairs[repairId];r.lastRepairAt=now;r.open=rating!=='pass'}
    s.repairPending=openRepairIds(state,letter,'writtenProduction').length>0;s.dueAt=now+(rating==='pass'?30*MIN:2*MIN);
  }else{
    s.independentAttempts++;s.confidenceEvidence+=rating==='pass'?1:rating==='unsure'?.35:.15;
    if(rating==='pass'){s.successfulSelfChecks++;if(!s.successDays.includes(day))s.successDays.push(day)}else if(rating==='unsure')s.uncertainSelfChecks++;else{s.unsuccessfulSelfChecks++;s.lastWrongAt=now}
    s.recentResults.push({rating,at:now,repair:false,family});s.recentResults=s.recentResults.slice(-16);scheduleProductionSkill(s,rating,now);
    if(rating==='again'){
      const rid=repairId||id('prodrepair');state.repairs[rid]={repairId:rid,originAttemptId:questionId||id('proda'),originLetter:letter,originSkill:'writtenProduction',repairTarget:family,open:true,createdAt:now,lastRepairAt:0};s.repairPending=true;s.repairTarget=family;repairId=rid;
    }
  }
  const row={at:now,date:day,letter,family,rating,isRepair,repairId,sessionId,questionId,audioSource:audioSource||'',strokeCount:Number(strokeCount)||0,durationMs:Number(durationMs)||0,bounds:bounds&&typeof bounds==='object'?{w:Number(bounds.w)||0,h:Number(bounds.h)||0}:null};
  state.productionHistory.push(row);state.productionHistory=state.productionHistory.slice(-180);state.letters[letter].productionHistory.push(row);state.letters[letter].productionHistory=state.letters[letter].productionHistory.slice(-40);return row;
}
function productionRepairTask(state,originTask,session,rng=Math.random,meta={}){
  const c=originTask.letter,choices=productionFamiliesFor(state,c).filter(f=>f!==originTask.family);let family=choices.find(f=>f==='visual-memory-writing')||choices[0]||originTask.family;
  if(originTask.family==='audio-to-writing'&&choices.includes('sound-to-writing'))family='sound-to-writing';
  const t=productionTask(state,c,family,session,rng,{isRepair:true,repairLevel:(originTask.repairLevel||0)+1,createdFromError:true,scheduledReason:'production-repair'});
  return {...t,isRepair:true,firstAttempt:false,repairId:meta.repairId||'',originAttemptId:meta.originAttemptId||'',originLetter:c,originSkill:'writtenProduction',originalQuestionId:originTask.originalQuestionId||originTask.questionId,parentAttemptId:meta.originAttemptId||''};
}
function scheduleProductionRepairForSession(session,task,state,repairId,rng=Math.random){
  const gap=3+Math.floor(rng()*5),repair=productionRepairTask(state,task,session,rng,{repairId,originAttemptId:task.questionId});
  const row={repairId,task,dueAfterMainIndex:session.mainIndex+gap+1,gap,originQuestionId:task.questionId,originAttemptId:task.questionId,originLetter:task.letter,originSkill:'writtenProduction',done:false,resolved:false};session.pendingRepairs.push(row);return row;
}
function productionSummary(session){const rows=session?.productionAnswers||[],main=rows.filter(x=>!x.isRepair),rep=rows.filter(x=>x.isRepair);return {total:main.length,pass:main.filter(x=>x.rating==='pass').length,unsure:main.filter(x=>x.rating==='unsure').length,again:main.filter(x=>x.rating==='again').length,repairTotal:rep.length,repairPass:rep.filter(x=>x.rating==='pass').length}}
function productionGate(state,now=Date.now()){
  const stable=ALPHABET.filter(c=>productionMastery(state,c,now)>=60&&productionConfidence(state,c)>=45&&ensureProductionLetter(state,c).independentAttempts>=2);
  const audio=uniq((state.productionHistory||[]).filter(x=>!x.isRepair&&x.family==='audio-to-writing'&&x.rating==='pass'&&x.audioSource==='human').map(x=>x.letter));
  const fake=FAKE_FRIENDS.filter(c=>ensureProductionLetter(state,c).successfulSelfChecks>0),open=Object.values(state.repairs||{}).filter(r=>r.open&&r.originSkill==='writtenProduction');
  return {done:stable.length>=18&&audio.length>=8&&fake.length>=4&&!open.length,stableLetters:stable.length,audioLetters:audio.length,fakeFriends:fake.length,openRepairs:open.length};
}
const masteredV5Base=masteredV4;
function masteredV5(state,now=Date.now()){const base=masteredV5Base(state,now),production=productionGate(state,now);return {...base,production,done:base.done&&production.done}}
const summaryForLetterV5Base=summaryForLetterV4;
function summaryForLetterV5(state,c,now=Date.now()){
  const base=summaryForLetterV5Base(state,c,now),s=ensureProductionLetter(state,c),stage=productionStage(state,c,now),history=(state.productionHistory||[]).filter(x=>x.letter===c&&!x.isRepair),lastError=[...history].reverse().find(x=>x.rating==='again'),lastAudio=[...history].reverse().find(x=>x.family==='audio-to-writing');
  return {...base,production:{mastery:productionMastery(state,c,now),confidence:productionConfidence(state,c),stage,status:productionStatusLabel(stage),ready:writtenProductionReady(state,c,now),audioReady:audioWrittenProductionReady(state,c,now),attempts:s.independentAttempts,pass:s.successfulSelfChecks,unsure:s.uncertainSelfChecks,again:s.unsuccessfulSelfChecks,lastErrorAt:lastError?.at||0,lastAudioAt:lastAudio?.at||0,next:!writtenProductionReady(state,c,now)?'Grundlagen weiter festigen':audioWrittenProductionReady(state,c,now)&&productionMastery(state,c,now)<60?'Audio → Zeichen zeichnen':productionMastery(state,c,now)<70?'Aus Erinnerung schreiben':'Retention + Mischproduktion'}};
}

/* source: alphabet-core-v5-production-repairs.js */
'use strict';

const ensureProductionLetterStableBase=ensureProductionLetter;
ensureProductionLetter=function(state,c){
  const m=state.letters[c];m.skills=m.skills||{};
  if(!m.skills.writtenProduction)return ensureProductionLetterStableBase(state,c);
  const s=m.skills.writtenProduction,defaults=freshProductionSkill();
  for(const [k,v] of Object.entries(defaults))if(s[k]===undefined)s[k]=Array.isArray(v)?[...v]:v;
  s.successDays=uniq(Array.isArray(s.successDays)?s.successDays.filter(Boolean):[]).sort();s.recentResults=Array.isArray(s.recentResults)?s.recentResults.slice(-16):[];
  m.productionHistory=Array.isArray(m.productionHistory)?m.productionHistory.slice(-40):[];return s;
};

function productionSignature(task){return [task.letter,task.family,task.caseTarget||'',task.confusionTarget||'',task.audioStimulusId||'',task.cueMs||''].join('|')}
const selectProductionTaskRepairBase=selectProductionTask;
selectProductionTask=function(state,session,rng=Math.random,now=Date.now()){
  const task=selectProductionTaskRepairBase(state,session,rng,now);if(!task)return task;
  session.productionSignatures=Array.isArray(session.productionSignatures)?session.productionSignatures:[];
  let chosen=task,sig=productionSignature(task);
  if(session.productionSignatures.includes(sig)){
    const alternatives=productionFamiliesFor(state,task.letter,now).filter(f=>f!==task.family);
    for(const f of alternatives){const alt=productionTask(state,task.letter,f,session,rng);const altSig=productionSignature(alt);if(!session.productionSignatures.includes(altSig)){chosen=alt;sig=altSig;break}}
  }
  chosen.productionSignature=sig;session.productionSignatures.push(sig);session.productionSignatures=session.productionSignatures.slice(-30);return chosen;
};
function hydrateProductionRepairs(state,session,rng=Math.random){
  if(session.productionRepairsHydrated)return session;session.productionRepairsHydrated=true;const existing=new Set((session.pendingRepairs||[]).map(r=>r.repairId)),open=Object.values(state.repairs||{}).filter(r=>r.open&&r.originSkill==='writtenProduction'&&!existing.has(r.repairId));
  for(const r of open){if(!ALPHABET.includes(r.originLetter))continue;const family=PRODUCTION_FAMILIES[r.repairTarget]?r.repairTarget:'visual-memory-writing',origin=productionTask(state,r.originLetter,family,session,rng,{scheduledReason:'rehydrated-production-error'}),repair=productionRepairTask(state,origin,session,rng,{repairId:r.repairId,originAttemptId:r.originAttemptId||origin.questionId});session.pendingRepairs.push({repairId:r.repairId,task:repair,dueAfterMainIndex:session.mainIndex+3+Math.floor(rng()*5),gap:3,originQuestionId:origin.questionId,originAttemptId:r.originAttemptId||origin.questionId,originLetter:r.originLetter,originSkill:'writtenProduction',done:false,resolved:false,rehydrated:true})}
  return session;
}
const initProductionSessionRepairBase=initProductionSession;
initProductionSession=function(session,state=null,rng=Math.random){initProductionSessionRepairBase(session);session.productionSignatures=Array.isArray(session.productionSignatures)?session.productionSignatures:[];if(state)hydrateProductionRepairs(state,session,rng);return session};

/* source: alphabet-core-v5-progression.js */
'use strict';

const recomputeLearningPlanV5Base=recomputeLearningPlan;
recomputeLearningPlan=function(state,now=Date.now(),opts={}){
  ensureV5State(state);
  const before=[...(state.learningPlan?.introducedLetters||[])],mainCount=(state.answerLog||[]).filter(x=>x.firstAttempt&&!x.isRepair).length,lastCount=Number(state.learningPlan.lastUnlockMainCount)||0,lastLetter=state.learningPlan.lastIntroducedLetter||before.at(-1)||'',lastAttempts=lastLetter&&state.letters[lastLetter]?CORE_SKILLS.reduce((n,k)=>n+(state.letters[lastLetter].skills[k]?.independentAttempts||0),0):0,high=before.length?before.slice(-5).filter(c=>basicReadiness(state,c,now).avg>=78).length>=4:false,allow=mainCount-lastCount>=5&&(lastAttempts>=2||high),plan=recomputeLearningPlanV5Base(state,now,opts),added=plan.introducedLetters.filter(c=>!before.includes(c));
  if(added.length&&!allow&&before.length>=5){plan.introducedLetters=before;plan.activeLetters=plan.activeLetters.filter(c=>before.includes(c));for(const c of before){if(plan.activeLetters.length>=5)break;if(!plan.activeLetters.includes(c)&&!letterReadyV4(state,c,now))plan.activeLetters.push(c)}}
  else if(added.length){plan.lastUnlockMainCount=mainCount;plan.lastIntroducedLetter=added[0]}
  plan.lastProductionRecomputedAt=now;return plan;
};
// Wird pro Kandidat über die gesamte Wordbank aufgerufen. knownLettersRequired ist
// bereits dublettenfrei und alphabetgefiltert (siehe alphabet-core-v4-hardening.js),
// deshalb ohne uniq/filter-Zwischenarrays und mit zwischengespeichertem Set der
// eingeführten Buchstaben.
const INTRODUCED_SET_CACHE=new WeakMap();
function introducedSetV5(state){
  const plan=state?.learningPlan;if(!plan)return new Set();
  const letters=plan.introducedLetters||[];
  let entry=INTRODUCED_SET_CACHE.get(plan);
  if(!entry||entry.source!==letters||entry.size!==letters.length){entry={source:letters,size:letters.length,set:new Set(letters)};INTRODUCED_SET_CACHE.set(plan,entry)}
  return entry.set;
}
function wordUnknownCountV5(state,w,target){const introduced=introducedSetV5(state),chars=w.knownLettersRequired||[...w.word.toLocaleUpperCase('uk')];let n=0;for(const ch of chars){if(ch===target||!ALPHABET.includes(ch))continue;if(!introduced.has(ch))n++}return n}
function maxUnknownForDifficultyV5(d){return d<=0?0:d===1?1:d===2?3:99}
const pickWordV5Base=pickWord;
pickWord=function(state,letter,session,rng=Math.random,opts={}){
  const difficulty=Number(opts.difficulty??session?.currentDifficulty??2),max=maxUnknownForDifficultyV5(difficulty),multiple=!!opts.multiple,audioOnly=!!opts.audioOnly,used=new Set(session?.usedWordIds||[]);
  let pool=wordsForLetter(letter).filter(w=>(!multiple||w.targetIndexes.length>1)&&(!audioOnly||w.audioKey===letter)&&wordUnknownCountV5(state,w,letter)<=max);
  if(!pool.length&&difficulty>=3)return pickWordV5Base(state,letter,session,rng,opts);if(!pool.length)return null;
  pool.sort((a,b)=>(used.has(a.id)-used.has(b.id))||(wordStat(state,letter,a.id).seen-wordStat(state,letter,b.id).seen)||(a.level-b.level));
  return pool[Math.floor(rng()*Math.min(3,pool.length))]||pool[0];
};
function pickNegativeWordV5(state,letter,session,rng=Math.random,difficulty=2){
  const target=DATA[letter].lower,used=new Set(session?.usedWordIds||[]),max=maxUnknownForDifficultyV5(difficulty);
  let pool=WORD_BANK.filter(w=>w.letter!==letter&&!w.word.toLocaleLowerCase('uk').includes(target)&&wordUnknownCountV5(state,w,letter)<=max);
  if(!pool.length&&difficulty>=3)pool=WORD_BANK.filter(w=>w.letter!==letter&&!w.word.toLocaleLowerCase('uk').includes(target));if(!pool.length)return null;
  pool.sort((a,b)=>(used.has(a.id)-used.has(b.id))||((state.letters[a.letter]?.exposure?.wordStats?.[a.id]?.seen||0)-(state.letters[b.letter]?.exposure?.wordStats?.[b.id]?.seen||0)));
  return pool[Math.floor(rng()*Math.min(5,pool.length))]||pool[0];
}
const familyCandidatesV5Base=familyCandidates;
familyCandidates=function(state,letter,skill,difficulty,session){
  let fam=familyCandidatesV5Base(state,letter,skill,difficulty,session),hasWord=!!pickWord(state,letter,session,()=>.2,{difficulty});
  if(!hasWord)fam=fam.filter(f=>!QUESTION_FAMILIES[f]?.usesWord&&!['word-position','missing-letter','word-contains','word-choice','tap-target','multi-occurrence','word-image','word-plain','count-target'].includes(f));
  return fam.length?fam:familyCandidatesV5Base(state,letter,skill,difficulty,session).filter(f=>!QUESTION_FAMILIES[f]?.usesWord).slice(0,5);
};
const buildV4TaskV5Base=buildV4Task;
buildV4Task=function(state,letter,skill,difficulty,family,session,rng=Math.random,meta={}){
  if(PRODUCTION_FAMILIES[family])return productionTask(state,letter,family,session,rng,meta);if(session)session.currentDifficulty=difficulty;
  const wordFamilies=['count-target','word-position','missing-letter','word-contains','word-choice','tap-target','multi-occurrence','word-image','word-plain'];
  if(wordFamilies.includes(family)&&!pickWord(state,letter,session,rng,{difficulty,multiple:family==='count-target'||family==='multi-occurrence'})){
    const alternatives=familyCandidates(state,letter,skill,difficulty,session).filter(f=>!wordFamilies.includes(f)&&!QUESTION_FAMILIES[f]?.usesWord),fallback=alternatives[0]||'visual-find';
    return buildV4TaskV5Base(state,letter,skill,difficulty,fallback,session,rng,meta);
  }
  const task=buildV4TaskV5Base(state,letter,skill,difficulty,family,session,rng,meta);
  if(family==='word-contains'&&task.correct==='Nein'){const neg=pickNegativeWordV5(state,letter,session,rng,difficulty);if(neg){task.wordId=neg.id;task.display=neg.word;task.stimulusId=neg.id;task.icon=neg.icon}}
  return task;
};

/* source: alphabet-core-v6-hardening.js */
'use strict';

const V6_VERSION=6;
const V6_APP_VERSION='6.1.0';
const V6_AGGREGATE_SCHEMA_VERSION=2;
const V6_SEVERE_REPAIR_SKILLS=new Set(['soundToLetter','audioToLetter','confusionDiscrimination']);
const V6_OBJECTIVE_SKILLS=SKILLS.filter(k=>k!=='writing');
const V6_PRODUCTION_COVERAGE_KEYS={
  'visual-memory-writing':'visualMemory','sound-to-writing':'soundToWriting','audio-to-writing':'audioToWriting','case-writing':'caseWriting','confusion-writing':'confusionWriting'
};
function freshV6Coverage(){return {visualMemory:{},soundToWriting:{},audioToWriting:{},caseWriting:{},confusionWriting:{}}}
function freshV6LetterAggregate(){return {independentMainAttempts:0,correctIndependentAttempts:0,lastIndependentAt:0,successfulFamilies:{},coreIndependentAttempts:0,openRepairCount:0,openSevereRepairCount:0,productionFamilyExposure:{}}}
function freshV6Metrics(){return {aggregateSchemaVersion:V6_AGGREGATE_SCHEMA_VERSION,aggregateReady:false,independentMainCount:0,revision:0,productionRevision:0,readinessRevision:-1,readyProductionLetters:[],productionCoverage:freshV6Coverage(),productionPassCoverage:freshV6Coverage()}}
function positive(n){n=Number(n)||0;return Number.isFinite(n)?Math.max(0,n):0}
function mergeCountMap(a={},b={}){const out={...(a||{})};for(const [k,v] of Object.entries(b||{}))out[k]=Math.max(positive(out[k]),positive(v));return out}
function mergeCoverage(a={},b={}){const out=freshV6Coverage();for(const key of Object.keys(out))out[key]=mergeCountMap(a?.[key],b?.[key]);return out}
function normalizeLetterAggregate(raw={}){const a={...freshV6LetterAggregate(),...(raw||{})};for(const k of ['independentMainAttempts','correctIndependentAttempts','lastIndependentAt','coreIndependentAttempts','openRepairCount','openSevereRepairCount'])a[k]=positive(a[k]);a.successfulFamilies=mergeCountMap({},a.successfulFamilies);a.productionFamilyExposure=mergeCountMap({},a.productionFamilyExposure);return a}
function normalizeExamHistoryNewest(rows,limit=80){
  if(!Array.isArray(rows))return [];
  const tagged=rows.map((row,index)=>({row,index,ts:positive(row?.at||row?.finishedAt||row?.completedAt)||(row?.date?Date.parse(`${row.date}T12:00:00`):0)||0}));
  if(tagged.some(x=>x.ts>0))tagged.sort((a,b)=>b.ts-a.ts||b.index-a.index);
  return tagged.slice(0,Math.max(0,limit)).map(x=>x.row);
}
function durableObjectiveFromSkills(state,c){
  const m=state.letters[c],skills=V6_OBJECTIVE_SKILLS.filter(k=>m.skills?.[k]);
  return {
    attempts:skills.reduce((n,k)=>n+positive(m.skills[k].independentAttempts),0),
    correct:skills.reduce((n,k)=>n+positive(m.skills[k].independentCorrect),0),
    core:CORE_SKILLS.reduce((n,k)=>n+positive(m.skills?.[k]?.independentAttempts),0),
    last:skills.reduce((n,k)=>Math.max(n,positive(m.skills[k].lastIndependentAt)),0)
  };
}
function deriveV6Metrics(state){
  const metrics=freshV6Metrics(),letters={};for(const c of ALPHABET)letters[c]=freshV6LetterAggregate();
  for(const c of ALPHABET){const d=durableObjectiveFromSkills(state,c),a=letters[c];a.independentMainAttempts=d.attempts;a.correctIndependentAttempts=d.correct;a.coreIndependentAttempts=d.core;a.lastIndependentAt=d.last;metrics.independentMainCount+=d.attempts}
  let logMain=0;
  for(const row of state.answerLog||[]){if(!row?.letter||!ALPHABET.includes(row.letter)||row.isRepair||row.firstAttempt===false)continue;logMain++;const a=letters[row.letter];a.lastIndependentAt=Math.max(a.lastIndependentAt,positive(row.answeredAt||row.at));if(row.correct)a.successfulFamilies[row.family||row.type||'unknown']=(a.successfulFamilies[row.family||row.type||'unknown']||0)+1}
  metrics.independentMainCount=Math.max(metrics.independentMainCount,logMain);
  for(const row of state.productionHistory||[]){if(!row?.letter||!ALPHABET.includes(row.letter))continue;const a=letters[row.letter];a.productionFamilyExposure[row.family]=(a.productionFamilyExposure[row.family]||0)+1;if(row.isRepair)continue;const key=V6_PRODUCTION_COVERAGE_KEYS[row.family];if(key){metrics.productionCoverage[key][row.letter]=(metrics.productionCoverage[key][row.letter]||0)+1;if(row.rating==='pass')metrics.productionPassCoverage[key][row.letter]=(metrics.productionPassCoverage[key][row.letter]||0)+1}}
  return {metrics,letters};
}
function mergeDerivedV6Metrics(state){
  const derived=deriveV6Metrics(state),persisted={...freshV6Metrics(),...(state.metrics||{})};
  persisted.independentMainCount=Math.max(positive(persisted.independentMainCount),positive(derived.metrics.independentMainCount),positive(state.learningPlan?.lastUnlockMainCount));
  persisted.productionCoverage=mergeCoverage(persisted.productionCoverage,derived.metrics.productionCoverage);
  persisted.productionPassCoverage=mergeCoverage(persisted.productionPassCoverage,derived.metrics.productionPassCoverage);
  persisted.aggregateSchemaVersion=V6_AGGREGATE_SCHEMA_VERSION;persisted.aggregateReady=true;persisted.revision=positive(persisted.revision);persisted.productionRevision=positive(persisted.productionRevision);persisted.readinessRevision=-1;persisted.readyProductionLetters=[];state.metrics=persisted;
  for(const c of ALPHABET){const old=normalizeLetterAggregate(state.letters[c].learningAggregate),d=derived.letters[c];state.letters[c].learningAggregate={...old,independentMainAttempts:Math.max(old.independentMainAttempts,d.independentMainAttempts),correctIndependentAttempts:Math.max(old.correctIndependentAttempts,d.correctIndependentAttempts),lastIndependentAt:Math.max(old.lastIndependentAt,d.lastIndependentAt),coreIndependentAttempts:Math.max(old.coreIndependentAttempts,d.coreIndependentAttempts),successfulFamilies:mergeCountMap(old.successfulFamilies,d.successfulFamilies),productionFamilyExposure:mergeCountMap(old.productionFamilyExposure,d.productionFamilyExposure)}}
  syncRepairAggregates(state);return state.metrics;
}
function ensureV6Metrics(state,{rebuild=false}={}){
  state.metrics={...freshV6Metrics(),...(state.metrics||{})};state.metrics.productionCoverage=mergeCoverage({},state.metrics.productionCoverage);state.metrics.productionPassCoverage=mergeCoverage({},state.metrics.productionPassCoverage);
  for(const c of ALPHABET)state.letters[c].learningAggregate=normalizeLetterAggregate(state.letters[c].learningAggregate);
  if(rebuild||!state.metrics.aggregateReady||state.metrics.aggregateSchemaVersion!==V6_AGGREGATE_SCHEMA_VERSION)mergeDerivedV6Metrics(state);else syncRepairAggregates(state);
  return state.metrics;
}
function rebuildV6Metrics(state){return mergeDerivedV6Metrics(state)}
function syncRepairAggregates(state,letter=null){
  if(!state?.letters)return state?.metrics;state.metrics={...freshV6Metrics(),...(state.metrics||{})};const letters=(letter?[letter]:ALPHABET).filter(c=>ALPHABET.includes(c)),counts={};for(const c of letters)counts[c]={open:0,severe:0,skills:{}};
  for(const r of Object.values(state.repairs||{})){const bucket=r?.open?counts[r.originLetter]:null;if(!bucket)continue;bucket.open++;if(V6_SEVERE_REPAIR_SKILLS.has(r.originSkill))bucket.severe++;bucket.skills[r.originSkill]=(bucket.skills[r.originSkill]||0)+1}
  let changed=false;
  for(const c of letters){const a=state.letters[c].learningAggregate=normalizeLetterAggregate(state.letters[c].learningAggregate),bucket=counts[c];if(a.openRepairCount!==bucket.open||a.openSevereRepairCount!==bucket.severe)changed=true;a.openRepairCount=bucket.open;a.openSevereRepairCount=bucket.severe;for(const k of [...CORE_SKILLS,'writtenProduction']){const s=state.letters[c].skills?.[k];if(!s)continue;const pending=positive(bucket.skills[k])>0;if(s.repairPending!==pending)changed=true;s.repairPending=pending;if(!pending)s.repairTarget=''}}
  if(changed){state.metrics.revision=positive(state.metrics.revision)+1;state.metrics.readinessRevision=-1;state.metrics.readyProductionLetters=[]}return state.metrics;
}
function restoreV6Extensions(raw,state){
  if(!raw||typeof raw!=='object')return state;
  for(const c of ALPHABET){const src=raw.letters?.[c],dst=state.letters[c];if(!src||!dst)continue;
    if(src.exposure&&typeof src.exposure==='object'){dst.exposure={...dst.exposure,...src.exposure,recentSignatures:Array.isArray(src.exposure.recentSignatures)?src.exposure.recentSignatures.slice(-50):dst.exposure.recentSignatures,lastVariants:Array.isArray(src.exposure.lastVariants)?src.exposure.lastVariants.slice(-20):dst.exposure.lastVariants,variantCounts:{...(dst.exposure.variantCounts||{}),...(src.exposure.variantCounts||{})},promptFamilyCounts:{...(dst.exposure.promptFamilyCounts||{}),...(src.exposure.promptFamilyCounts||{})},wordStats:{...(dst.exposure.wordStats||{}),...(src.exposure.wordStats||{})},fontStats:{...(dst.exposure.fontStats||{}),...(src.exposure.fontStats||{})}}}
    if(src.skills?.writtenProduction)dst.skills.writtenProduction=normalizeProductionSkill(src.skills.writtenProduction);
    if(Array.isArray(src.productionHistory))dst.productionHistory=src.productionHistory.slice(-40);
    if(src.learningAggregate)dst.learningAggregate=normalizeLetterAggregate(src.learningAggregate);
  }
  if(raw.metrics&&typeof raw.metrics==='object')state.metrics=JSON.parse(JSON.stringify(raw.metrics));
  if(Array.isArray(raw.productionHistory))state.productionHistory=raw.productionHistory.slice(-180);
  if(Array.isArray(raw.examHistory))state.examHistory=normalizeExamHistoryNewest(raw.examHistory,80);
  return state;
}
function ensureV6State(state,{rebuild=false}={}){ensureV5State(state);state.version=V6_VERSION;state.answerLog=Array.isArray(state.answerLog)?state.answerLog.slice(-1200):[];state.productionHistory=Array.isArray(state.productionHistory)?state.productionHistory.slice(-180):[];state.examHistory=normalizeExamHistoryNewest(state.examHistory,80);ensureV6Metrics(state,{rebuild});return state}
function freshStateV6(){return ensureV6State(freshStateV5(),{rebuild:true})}
function migrateV6(raw){const state=migrateV5(raw);restoreV6Extensions(raw,state);ensureV6State(state,{rebuild:true});const count=state.metrics.independentMainCount;if(!Number.isFinite(state.learningPlan.lastUnlockMainCount)||state.learningPlan.lastUnlockMainCount<0)state.learningPlan.lastUnlockMainCount=count;state.metrics.independentMainCount=Math.max(state.metrics.independentMainCount,positive(state.learningPlan.lastUnlockMainCount));return state}

const registerRepairV6Base=registerRepair;
registerRepair=function(state,opts={}){const r=registerRepairV6Base(state,opts);syncRepairAggregates(state,r?.originLetter||opts.originLetter||null);return r};
function noteV6ObjectiveAnswer(state,row){ensureV6Metrics(state);if(!row||row.isRepair||row.firstAttempt===false||!ALPHABET.includes(row.letter)){syncRepairAggregates(state,row?.originLetter||row?.letter||null);return row}const a=state.letters[row.letter].learningAggregate;a.independentMainAttempts++;a.correctIndependentAttempts+=row.correct?1:0;a.lastIndependentAt=Math.max(a.lastIndependentAt,positive(row.answeredAt||row.at)||Date.now());if(CORE_SKILLS.includes(row.skill))a.coreIndependentAttempts++;if(row.correct)a.successfulFamilies[row.family||row.type||'unknown']=(a.successfulFamilies[row.family||row.type||'unknown']||0)+1;state.metrics.independentMainCount++;state.metrics.revision++;state.metrics.readinessRevision=-1;syncRepairAggregates(state,row.letter);return row}
function recordAnswerV6(state,opts={}){ensureV6State(state);const row=recordAnswerV4(state,opts);return noteV6ObjectiveAnswer(state,row)}
function recordProductionSelfCheckV6(state,opts={}){ensureV6State(state);const row=recordProductionSelfCheck(state,opts),a=state.letters[row.letter].learningAggregate;a.productionFamilyExposure[row.family]=(a.productionFamilyExposure[row.family]||0)+1;if(!row.isRepair){const key=V6_PRODUCTION_COVERAGE_KEYS[row.family];if(key){state.metrics.productionCoverage[key][row.letter]=(state.metrics.productionCoverage[key][row.letter]||0)+1;if(row.rating==='pass')state.metrics.productionPassCoverage[key][row.letter]=(state.metrics.productionPassCoverage[key][row.letter]||0)+1}}state.metrics.productionRevision++;state.metrics.revision++;state.metrics.readinessRevision=-1;syncRepairAggregates(state,row.letter);return row}

const writtenProductionReadyV6Base=writtenProductionReady;
function writtenProductionReadySyncedV6(state,c,now=Date.now()){
  if(!ALPHABET.includes(c))return false;const m=state.letters[c],a=m.learningAggregate,visual=skillMasteryV4(state,c,'visualToSound',now),reverse=skillMasteryV4(state,c,'soundToLetter',now),audio=skillMasteryV4(state,c,'audioToLetter',now),families=Object.keys(a.successfulFamilies).length,hasWriting=(m.writeDays||[]).length>0,days=retentionDaysForLetter(state,c).length,conf=(skillConfidence(state,c,'visualToSound')+skillConfidence(state,c,'soundToLetter')+skillConfidence(state,c,'audioToLetter'))/3,severe=a.openSevereRepairCount>0;
  if(c==='Ь')return visual>=72&&reverse>=62&&a.coreIndependentAttempts>=7&&families>=2&&hasWriting&&!severe&&(days>=2||conf>=72);
  const base=visual>=70&&reverse>=65&&audio>=60&&a.coreIndependentAttempts>=5&&families>=2&&hasWriting&&!severe;if(!base)return false;return HARD.has(c)?(days>=2||conf>=72):true
}
writtenProductionReady=function(state,c,now=Date.now()){ensureV6Metrics(state);return writtenProductionReadySyncedV6(state,c,now)};
function readyProductionLettersUncachedV6(state,now=Date.now()){ensureV6Metrics(state);return ALPHABET.filter(c=>writtenProductionReadySyncedV6(state,c,now))}
function readyProductionLettersV6(state,now=Date.now()){
  ensureV6Metrics(state);if(state.metrics.readinessRevision===state.metrics.revision&&Array.isArray(state.metrics.readyProductionLetters))return state.metrics.readyProductionLetters;
  const ready=ALPHABET.filter(c=>writtenProductionReadySyncedV6(state,c,now));state.metrics.readyProductionLetters=ready;state.metrics.readinessRevision=state.metrics.revision;return ready
}
productionQuotaForSession=function(state,session,now=Date.now()){
  if(session?.feedback==='real'||session?.preset==='diagnostic'||session?.certification)return 0;if(session?.productionOnly)return Math.max(0,Number(session.productionTargetCount)||0);
  const ready=readyProductionLettersV6(state,now);if(!ready.length)return 0;const avg=ready.reduce((n,c)=>n+letterMasteryV4(state,c,now),0)/ready.length;let q=ready.length<3?1:ready.length<8?2:ready.length<16?3:avg>=88?5:4;if(session?.macro){const phase=macroPhase(session)?.id;q=phase==='warmup'?0:phase==='errors'?Math.min(1,q):phase==='active'?Math.min(2,q):phase==='mixed'?Math.min(3,q):q}return q
};
const selectProductionTaskV6Base=selectProductionTask;
selectProductionTask=function(state,session,rng=Math.random,now=Date.now()){
  ensureV6Metrics(state);const t=selectProductionTaskV6Base(state,session,rng,now);if(!t)return t;const ready=readyProductionLettersV6(state,now),recent=new Set((session.productionAnswers||[]).slice(-4).map(x=>`${x.letter}|${x.family}`));let best=t,bestScore=Infinity;
  for(const c of ready){if(session.lastProductionLetter===c)continue;for(const family of productionFamiliesFor(state,c,now)){const sig=`${c}|${family}`,a=state.letters[c].learningAggregate,n=a.productionFamilyExposure[family]||0,score=n+(recent.has(sig)?20:0)+(V6_PRODUCTION_COVERAGE_KEYS[family]?(state.metrics.productionCoverage[V6_PRODUCTION_COVERAGE_KEYS[family]][c]||0)*2:0);if(score<bestScore){bestScore=score;best=productionTask(state,c,family,session,rng)}}}return best
};

const recomputeLearningPlanV6Base=recomputeLearningPlanV5Base;
recomputeLearningPlan=function(state,now=Date.now(),opts={}){
  ensureV5State(state);ensureV6Metrics(state);const before=[...(state.learningPlan?.introducedLetters||[])],lastCount=Number(state.learningPlan?.lastUnlockMainCount)||0,lastLetter=state.learningPlan?.lastIntroducedLetter||before.at(-1)||'',lastAttempts=lastLetter&&state.letters[lastLetter]?state.letters[lastLetter].learningAggregate.independentMainAttempts:0,high=before.length?before.slice(-5).filter(c=>basicReadiness(state,c,now).avg>=78).length>=4:false,allow=state.metrics.independentMainCount-lastCount>=5&&(lastAttempts>=2||high),plan=recomputeLearningPlanV6Base(state,now,opts),added=plan.introducedLetters.filter(c=>!before.includes(c));
  if(added.length&&!allow&&before.length>=5){plan.introducedLetters=before;plan.activeLetters=plan.activeLetters.filter(c=>before.includes(c));for(const c of before){if(plan.activeLetters.length>=5)break;if(!plan.activeLetters.includes(c)&&!letterReadyV4(state,c,now))plan.activeLetters.push(c)}}else if(added.length){plan.lastUnlockMainCount=state.metrics.independentMainCount;plan.lastIntroducedLetter=added[0]}plan.lastProductionRecomputedAt=now;return plan
};
function productionCoverageSummaryV6(state){ensureV6Metrics(state);const byFamily={},confirmedByFamily={};for(const [key,map] of Object.entries(state.metrics.productionCoverage))byFamily[key]=Object.keys(map||{}).length;for(const [key,map] of Object.entries(state.metrics.productionPassCoverage))confirmedByFamily[key]=Object.keys(map||{}).length;return {byFamily,confirmedByFamily,totalLetters:uniq(Object.values(state.metrics.productionCoverage).flatMap(map=>Object.keys(map||{}))).length,confirmedLetters:uniq(Object.values(state.metrics.productionPassCoverage).flatMap(map=>Object.keys(map||{}))).length}}
function validateStateInvariants(state){const errors=[];if(!state||typeof state!=='object')return {ok:false,errors:['state missing']};for(const c of ALPHABET){const m=state.letters?.[c];if(!m){errors.push(`missing letter ${c}`);continue}const a=normalizeLetterAggregate(m.learningAggregate);for(const [k,v] of Object.entries(a))if(typeof v==='number'&&(!Number.isFinite(v)||v<0))errors.push(`${c}.${k} invalid`)}if((state.answerLog||[]).length>1200)errors.push('answerLog too large');if((state.productionHistory||[]).length>180)errors.push('productionHistory too large');if((state.examHistory||[]).length>80)errors.push('examHistory too large');if((state.sessionSnapshots||[]).length>30)errors.push('sessionSnapshots too large');for(const c of state.learningPlan?.activeLetters||[])if(!ALPHABET.includes(c))errors.push(`unknown active letter ${c}`);const actual=readyProductionLettersUncachedV6(state);const cached=readyProductionLettersV6(state);if(actual.join('')!==cached.join(''))errors.push('readyProductionLetters cache mismatch');try{JSON.stringify(state)}catch(_){errors.push('state not serializable')}return {ok:errors.length===0,errors}}

/* source: alphabet-core-v6-question-fixes.js */
'use strict';

// V6.1 question-integrity hardening.
// Sound-based recognition must always have an unambiguous human-audio cue.
// Visual contrast must name the visual target explicitly, and every choice list
// must contain the correct answer exactly once.
function v61UniqueOptions(task,rng=Math.random,{min=0}={}){
  if(!task||!Array.isArray(task.options))return task;
  const unique=uniq(task.options.filter(x=>x!==undefined&&x!==null&&String(x)!==''));
  if(task.correct!==undefined&&task.correct!==null&&!unique.includes(task.correct))unique.unshift(task.correct);
  if(min>0&&ALPHABET.includes(task.correct)){
    for(const c of shuffle(ALPHABET.filter(c=>c!==task.correct&&!unique.includes(c)),rng)){
      if(unique.length>=min)break;
      unique.push(c)
    }
  }
  task.options=shuffle(unique.slice(0,min>0?Math.max(min,unique.length):unique.length),rng);
  if(min>0&&task.options.length>min)task.options=task.options.slice(0,min);
  return task
}

function v61RequireHumanLetterAudio(task,letter){
  const target=task?.letter||letter;
  if(!task||!target||target==='Ь')return task;
  task.requiresHumanAudio=true;
  task.humanAudioRequired=true;
  task.requiresHumanLetterAudio=true;
  task.letterAudioAvailable=true;
  task.audioKind='letter';
  task.audioStimulusLetter=target;
  task.audioStimulusId=`letter-${target}`;
  delete task.audioWord;
  delete task.audioIndex;
  task.display=task.family==='sound-contrast'&&task.confusionTarget?`${target} · ${task.confusionTarget}`:'';
  return task
}

function v61SoftSignContext(task){
  if(!task||task.letter!=='Ь')return task;
  task.letterAudioAvailable=false;
  task.requiresHumanLetterAudio=false;
  task.softSignContextual=true;
  if(task.type==='audio'){
    task.requiresHumanAudio=true;
    task.humanAudioRequired=true;
    task.audioKind='word-context';
    task.audioStimulusId='human-context-Ь';
    task.prompt='Höre die menschliche Originalaufnahme im Wortkontext. Welches Zeichen macht den Konsonanten weich?'
  }else{
    task.requiresHumanAudio=false;
    task.humanAudioRequired=false;
    task.audioKind='context-only';
    task.display=DATA.Ь.sound;
    task.prompt='Ь hat keinen eigenen isolierten Laut. Welches Zeichen ist das ukrainische Weichheitszeichen?'
  }
  return task
}

const makeTaskQuestionCueBase=makeTask;
makeTask=function(letter,type,state,rng=Math.random,meta={}){
  const task=makeTaskQuestionCueBase(letter,type,state,rng,meta),target=task.letter||letter;
  if(type==='reverse'||task.type==='reverse'){
    if(target==='Ь')v61SoftSignContext(task);
    else{
      task.prompt='Höre die menschliche Originalaufnahme. Welches ukrainische Zeichen hörst du?';
      v61RequireHumanLetterAudio(task,target)
    }
  }
  if(type==='audio'||task.type==='audio'){
    if(target==='Ь')v61SoftSignContext(task);
    else{
      task.prompt='Höre die menschliche Originalaufnahme. Welches Zeichen hörst du?';
      v61RequireHumanLetterAudio(task,target)
    }
  }
  return v61UniqueOptions(task,rng)
};

const variantizeTaskQuestionCueBase=variantizeTask;
variantizeTask=function(base,index,scope,rng=Math.random,state=null){
  const task=variantizeTaskQuestionCueBase(base,index,scope,rng,state),target=task?.letter;
  if(task?.variant==='sound-contrast'){
    task.prompt='Höre die menschliche Originalaufnahme. Welcher der ähnlichen Buchstaben passt?';
    if(target==='Ь')v61SoftSignContext(task);else v61RequireHumanLetterAudio(task,target);
    v61UniqueOptions(task,rng)
  }
  return task
};

const buildV4TaskQuestionCueBase=buildV4Task;
buildV4Task=function(state,letter,skill,difficulty,family,session,rng=Math.random,meta={}){
  const task=buildV4TaskQuestionCueBase(state,letter,skill,difficulty,family,session,rng,meta),target=task.letter||letter;
  if(family==='sound-to-letter'){
    if(target==='Ь')v61SoftSignContext(task);
    else{
      task.prompt='Höre die menschliche Originalaufnahme. Welches ukrainische Zeichen hörst du?';
      v61RequireHumanLetterAudio(task,target)
    }
  }
  if(family==='sound-contrast'){
    if(target==='Ь')v61SoftSignContext(task);
    else{
      task.prompt='Höre die menschliche Originalaufnahme. Welcher der ähnlichen Buchstaben passt?';
      v61RequireHumanLetterAudio(task,target)
    }
    v61UniqueOptions(task,rng)
  }
  if(family==='audio-to-letter'){
    if(target==='Ь')v61SoftSignContext(task);
    else{
      task.prompt='Höre die menschliche Originalaufnahme. Welches Zeichen hörst du?';
      v61RequireHumanLetterAudio(task,target)
    }
    v61UniqueOptions(task,rng)
  }
  if(family==='visual-contrast'){
    const conf=task.confusionTarget||task.options?.find(c=>c!==target)||'';
    task.display=conf?`${target} · ${conf}`:target;
    task.prompt=`Zielzeichen: ${target}. Welches der ähnlichen Zeichen ist exakt ${target}?`;
    v61UniqueOptions(task,rng,{min:4})
  }
  return task
};

/* source: alphabet-core-v62-question-integrity.js */
'use strict';

// Alphabet Lab V6.2 · Fragen-Integrität und Lösbarkeit
//
// Harte Invarianten, die dieses Modul herstellt und die
// tests/validate-alphabet-lab-v62-solvability.mjs für jede erzeugte Frage prüft:
//
//  I1  Zielangabe: Jede Aufgabe, deren Antwort davon abhängt zu wissen, WELCHER
//      Buchstabe gemeint ist, nennt diesen Buchstaben (oder – wo die Nennung die
//      Lösung verraten würde – seinen Laut) im Promptext. Ein deutscher Anfänger
//      wird nie nach „dem Zielzeichen“ gefragt, ohne zu erfahren, welches das ist.
//  I2  Eindeutigkeit bei Buchstabenwahl über eine angezeigte Zeichenkette
//      (word-plain, pseudoword): Genau eine angebotene Option kommt darin vor.
//  I3  Kein Positionsleak: Kein Stimulus verrät die Lösung durch ihre Position
//      (früher stand bei sound-contrast/visual-contrast das Ziel immer vorn).
//  I4  Kein konstanter Erwartungswert: Keine Familie darf über alle Buchstaben
//      hinweg fast immer dieselbe richtige Antwort haben (Auswendiglernen der App).
//  I5  Optionslisten sind dublettenfrei, enthalten die richtige Antwort genau
//      einmal und haben mindestens zwei Einträge.
//
// Die adaptive Architektur (Active Set, Mastery, Confidence, Repairs, SRS,
// Production-Gating, Audio-Readiness) bleibt unverändert; dieses Modul greift
// ausschließlich in die Aufgabenerzeugung ein.

const V62_VERSION=62;

const v62Lower=letter=>DATA[letter]?.lower||String(letter).toLocaleLowerCase('uk');
const v62Cue=letter=>`${letter} ${v62Lower(letter)}`;
const v62Sound=letter=>DATA[letter]?.sound||'';
const v62Chars=word=>[...String(word||'').toLocaleLowerCase('uk')];

// Ja/Nein- und Gleich/Verschieden-Entscheidungen dürfen nicht pro Kandidat neu
// ausgewürfelt werden: Der Selektor bewertet mehrere Kandidaten pro Frageslot und
// bevorzugt dabei den mit dem frischeren Wort. Da Negativwörter aus der gesamten
// Wordbank stammen, wirkten sie immer „frischer“ – dadurch lag die Antwort
// „Nein“ live bei 89 %. Ein stabiler Hash pro Frageslot entkoppelt die
// Klassenwahl von der Kandidatenbewertung.
function v62SlotHash(parts){let h=2166136261;for(const ch of String(parts))h=Math.imul(h^ch.charCodeAt(0),16777619)>>>0;return h>>>0}
const v62SlotCoin=(session,letter,family)=>v62SlotHash(`${session?.sessionId||''}|${session?.mainIndex??0}|${letter}|${family}`)%2===0;
const v62Contains=(word,letter)=>v62Chars(word).includes(v62Lower(letter));

// I1 · Prompttexte, die das Ziel explizit benennen.
const V62_TARGET_PROMPTS={
  'visual-find':letter=>letter==='Ь'
    ?'Gesucht ist das ukrainische Weichheitszeichen – es hat keinen eigenen Laut und macht den Konsonanten davor weich. Welches Zeichen im Feld ist es?'
    :`Ziellaut: ${v62Sound(letter)}. Welches Zeichen im Feld gehört zu diesem Laut?`,
  'multi-select':letter=>`Tippe jedes ${v62Cue(letter)} an – und nur dieses Zeichen.`,
  'count-target':letter=>`Wie oft kommt ${v62Cue(letter)} in diesem Wort vor?`,
  'word-position':letter=>`Wo steht ${v62Cue(letter)} in diesem Wort?`,
  'word-contains':letter=>`Enthält dieses Wort den Buchstaben ${v62Cue(letter)}?`,
  'word-choice':letter=>`Welches dieser Wörter enthält ${v62Cue(letter)}?`,
  'tap-target':letter=>`Tippe ${v62Cue(letter)} im Wort an.`,
  'multi-occurrence':letter=>`Tippe jedes ${v62Cue(letter)} im Wort an.`,
  'missing-letter':letter=>letter==='Ь'
    ?'In diesem Wort fehlt das Zeichen, das den Konsonanten davor weich macht. Welches ist es?'
    :`Welcher Buchstabe fehlt? Ziellaut: ${v62Sound(letter)}.`,
  'confusion-word-choice':letter=>`Welches dieser Wörter enthält ${v62Cue(letter)}?`
};

// Familien, die ohne explizite Zielnennung objektiv unlösbar wären.
const V62_TARGET_REQUIRED=new Set(Object.keys(V62_TARGET_PROMPTS));
// Familien, bei denen der Zielbuchstabe bewusst NICHT genannt wird, weil er die
// Lösung wäre. Dort sichert I2 die Eindeutigkeit.
const V62_UNIQUE_IN_DISPLAY=new Set(['word-plain','pseudoword']);
// Familien, die dauerhaft aus der Auswahl genommen sind (Begründung unten).
const V62_RETIRED=new Set(['odd-one-out','audio-word-position']);

// Ersatz für die stillgelegten Familien, damit Varianz erhalten bleibt.
QUESTION_FAMILIES['confusion-word-choice']={skill:'confusionDiscrimination',min:1,max:5,weight:.9,usesWord:true,production:1};
QUESTION_FAMILIES['audio-word-match']={skill:'audioToLetter',min:2,max:5,weight:1,usesAudio:true,usesWord:true,production:1};
FAMILY_PROMPTS['confusion-word-choice']=['Welches dieser Wörter enthält den Zielbuchstaben?'];
FAMILY_PROMPTS['audio-word-match']=['Höre die menschliche Originalaufnahme. Welches geschriebene Wort hast du gehört?'];

// Die Wordbank ist nach dem Laden statisch. Sie wuchs in V6.2 von 198 auf 328
// Einträge und wird pro Aufgabe mehrfach gefiltert; ein einmaliger Index hält die
// Fragegenerierung schneller als vor der Erweiterung.
const v62WordsFor=letter=>wordsForLetter(letter);

function v62AudioWord(letter){
  return v62WordsFor(letter).find(w=>w.audioKey===letter)||v62WordsFor(letter)[0]||null;
}

// I5 · Optionsliste säubern: dublettenfrei, richtige Antwort genau einmal,
// bei Bedarf mit passenden Füllern auf die Zielgröße gebracht.
// Zufallsauswahl ohne vollständiges Mischen: Die Distraktorpools umfassen fast
// die ganze Wordbank; ein shuffle() über 300 Einträge pro Kandidat ist der
// teuerste Einzelposten der Fragegenerierung.
function v62Sample(list,count,rng=Math.random){
  if(!Array.isArray(list)||!list.length)return [];
  if(list.length<=count)return shuffle(list.slice(),rng);
  const out=[],used=new Set();
  for(let guard=0;out.length<count&&guard<count*12;guard++){
    const index=Math.floor(rng()*list.length);
    if(used.has(index))continue;
    used.add(index);out.push(list[index]);
  }
  return out;
}

function v62CleanOptions(task,rng=Math.random,{size=0,fill=null}={}){
  if(!task||!Array.isArray(task.options)||!task.options.length)return task;
  const correct=task.correct;
  const out=[],seen=new Set();
  const push=value=>{const key=String(value);if(value===undefined||value===null||key===''||seen.has(key))return;seen.add(key);out.push(value)};
  if(correct!=='MULTI'&&correct!=='SELF')push(correct);
  for(const option of task.options)push(option);
  const target=size||out.length;
  if(out.length<target&&typeof fill==='function'){
    for(const candidate of fill()){if(out.length>=target)break;push(candidate)}
  }
  task.options=shuffle(out.slice(0,Math.max(target,2)),rng);
  return task;
}

// I2 · Bei „welcher angebotene Buchstabe steckt in dieser Zeichenkette?“ darf genau
// eine Option tatsächlich vorkommen. Vorher waren bis zu 38 % dieser Aufgaben
// mehrdeutig (mehrere Optionen kamen im Wort/Pseudowort vor).
function v62EnforceUniqueLetterInDisplay(task,rng=Math.random){
  const correct=task.correct;
  if(!ALPHABET.includes(correct))return task;
  const haystack=v62Chars(task.display);
  const keep=[correct],seen=new Set([correct]);
  for(const option of task.options||[]){
    if(seen.has(option)||!ALPHABET.includes(option))continue;
    if(haystack.includes(v62Lower(option)))continue;
    seen.add(option);keep.push(option);
  }
  task.options=keep;
  return v62CleanOptions(task,rng,{size:4,fill:()=>shuffle(ALPHABET.filter(c=>!seen.has(c)&&!haystack.includes(v62Lower(c))),rng)});
}

// Wortwahl für Positionsaufgaben über alle vorhandenen Positionsklassen streuen.
// Vorher stand der Zielbuchstabe in 56 % der Fälle am Wortanfang.
function v62PickPositionDiverseWord(state,letter,session,rng,difficulty){
  const pool=v62EligibleWords(state,letter,difficulty);
  if(pool.length<2)return pickWord(state,letter,session,rng,{difficulty});
  const byPosition=new Map();
  for(const word of pool){
    if(!byPosition.has(word.position))byPosition.set(word.position,[]);
    byPosition.get(word.position).push(word);
  }
  const classes=shuffle([...byPosition.keys()],rng);
  const used=new Set(session?.usedWordIds||[]);
  for(const positionClass of classes){
    const rows=byPosition.get(positionClass),fresh=rows.filter(w=>!used.has(w.id));
    const pick=v62Sample(fresh.length?fresh:rows,1,rng)[0];
    if(pick)return pick;
  }
  return pickWord(state,letter,session,rng,{difficulty});
}

// Negativbeispiel für „enthält das Wort X?“ kommt aus pickNegativeWordV5, das den
// Unbekannt-Filter bereits kennt. Die frühere Schieflage („Nein“ war live in 81 %
// richtig) lag nicht am Pool, sondern daran, dass der Neuheitsscore Kandidaten mit
// noch ungenutzter wordId bevorzugte; deshalb trägt word-contains keine wordId mehr.
function v62NegativeWord(state,letter,session,rng,difficulty){
  if(typeof pickNegativeWordV5==='function'){
    const picked=pickNegativeWordV5(state,letter,session,rng,Number(difficulty)||2);
    if(picked)return picked;
  }
  const pool=WORD_BANK.filter(w=>w.letter!==letter&&!v62Contains(w.word,letter));
  return v62Sample(pool,1,rng)[0]||null;
}

// Anfängertauglichkeit der Wortauswahl liegt bewusst weiterhin bei
// alphabet-core-v5-progression.js: pickWord dort begrenzt die Zahl noch
// unbekannter Buchstaben abhängig von der Schwierigkeit. V6.2 baut darauf auf und
// darf diesen Filter nie lockern – jede eigene Wortwahl läuft deshalb durch
// v62EligibleWords().
function v62UnknownCap(difficulty){
  return typeof maxUnknownForDifficultyV5==='function'?maxUnknownForDifficultyV5(Number(difficulty)||0):99;
}
const V62_ELIGIBLE_CACHE=new Map();
function v62EligibleWords(state,letter,difficulty,rows){
  const pool=rows||wordsForLetter(letter);
  if(typeof wordUnknownCountV5!=='function')return pool;
  const cap=v62UnknownCap(difficulty);
  if(cap>=99)return pool;
  // Der Filter läuft pro Kandidat über bis zu 328 Wörter; das Ergebnis hängt nur
  // von Buchstabe, Kappe und dem Stand der eingeführten Buchstaben ab.
  const introduced=(state?.learningPlan?.introducedLetters||[]).join('');
  const key=`${rows?'bank':'letter'}|${letter}|${cap}|${introduced}`;
  const cached=V62_ELIGIBLE_CACHE.get(key);
  if(cached)return cached;
  const allowed=pool.filter(w=>wordUnknownCountV5(state,w,letter)<=cap);
  const result=allowed.length?allowed:pool;
  if(V62_ELIGIBLE_CACHE.size>600)V62_ELIGIBLE_CACHE.clear();
  V62_ELIGIBLE_CACHE.set(key,result);
  return result;
}

// odd-one-out war zu 94 % mit „А“ zu lösen, weil der Außenseiter deterministisch
// der erste Alphabetbuchstabe außerhalb der Verwechslungsgruppe war; zudem konnte
// ein Anfänger die Gruppenzugehörigkeit nicht aus dem Bildschirm ableiten.
// audio-word-position hatte pro Buchstabe genau ein Audiowort und damit eine
// feste richtige Antwort („1“ in 100 % der real gezogenen Aufgaben).
// Beide sind ersetzt statt repariert, weil ihre Aufgabenform keine variierende,
// objektiv belegbare Lösung zulässt.
const familyAllowedForV62Base=familyAllowedFor;
familyAllowedFor=function(letter,family){
  if(V62_RETIRED.has(family))return false;
  // Beide Prüfungen bleiben bewusst billig: familyAllowedFor läuft pro Kandidat.
  if(family==='confusion-word-choice')return letter!=='Ь'&&!!LETTER_PEDAGOGY[letter]?.confusions?.length;
  if(family==='audio-word-match')return wordsForLetter(letter).length>0;
  return familyAllowedForV62Base(letter,family);
};

function v62ConfusionPartner(state,letter){
  const personal=state&&state.letters?personalConfusions(state,letter)||[]:[];
  const candidates=uniq([...personal,...(LETTER_PEDAGOGY[letter]?.confusions||[]),...(SOUND_GROUPS[letter]||[])]).filter(c=>ALPHABET.includes(c)&&c!==letter);
  return candidates[0]||null;
}

const familyCandidatesV62Base=familyCandidates;
familyCandidates=function(state,letter,skill,difficulty,session){
  let families=familyCandidatesV62Base(state,letter,skill,difficulty,session).filter(f=>!V62_RETIRED.has(f));
  if(skill==='audioToLetter'){
    families=uniq([...families,'audio-to-letter','audio-word-match']).filter(f=>familyAllowedFor(letter,f));
  }
  if(skill==='confusionDiscrimination'&&letter!=='Ь'&&familyAllowedFor(letter,'confusion-word-choice')){
    families=uniq([...families,'confusion-word-choice']);
  }
  return families.length?families:['visual-to-sound'];
};

// Ь bleibt ohne erfundenen Eigenlaut: audioToLetter läuft ausschließlich über den
// Wortkontext (menschliche Originalaufnahme von „кінь“).
const SOFT_SIGN_V62_FAMILIES=['audio-to-letter','audio-word-match','confusion-word-choice'];
for(const family of SOFT_SIGN_V62_FAMILIES)if(!SOFT_FOCUSED.includes(family))SOFT_FOCUSED.push(family);
for(const retired of V62_RETIRED){
  const index=SOFT_FOCUSED.indexOf(retired);
  if(index>=0)SOFT_FOCUSED.splice(index,1);
}

function v62BuildConfusionWordChoice(state,letter,session,rng,task,difficulty){
  const partner=v62ConfusionPartner(state,letter);
  const good=pickWord(state,letter,session,rng,{difficulty});
  if(!good||!partner)return null;
  const partnerWords=v62EligibleWords(state,partner,difficulty).filter(w=>w.word!==good.word&&!v62Contains(w.word,letter));
  const picked=v62Sample(partnerWords,3,rng);
  if(picked.length<3){
    const neutral=v62EligibleWords(state,letter,difficulty,WORD_BANK).filter(w=>w.word!==good.word&&!v62Contains(w.word,letter));
    picked.push(...v62Sample(neutral,3-picked.length,rng));
  }
  const distractors=uniq(picked.map(w=>w.word)).filter(w=>w!==good.word).slice(0,3);
  if(distractors.length<2)return null;
  task.type='choice';
  task.wordId=good.id;
  task.display='';
  task.icon='';
  task.correct=good.word;
  task.options=[good.word,...distractors];
  task.confusionTarget=partner;
  task.stimulusId=`confusion-word-${good.id}-${partner}`;
  task.prompt=`Welches dieser Wörter enthält ${v62Cue(letter)}? Die anderen enthalten ${v62Cue(partner)} oder keines von beiden.`;
  return v62CleanOptions(task,rng,{size:Math.min(4,1+distractors.length)});
}

function v62BuildAudioWordMatch(state,letter,session,rng,task,difficulty){
  const target=v62AudioWord(letter);
  if(!target)return null;
  const pool=v62EligibleWords(state,letter,difficulty,WORD_BANK);
  const distractors=uniq(v62Sample(pool,6,rng).map(w=>w.word)).filter(w=>w!==target.word).slice(0,3);
  if(distractors.length<2)return null;
  task.type='audio';
  // Bewusst ohne wordId: taskBody blendet bei Audiofragen mit wordId das Wort als
  // Text ein – bei „welches Wort hast du gehört?“ wäre das die Lösung.
  task.wordId='';
  task.display='';
  task.correct=target.word;
  task.options=[target.word,...distractors];
  task.audioWord=target.word;
  task.audioKind='word-context';
  task.requiresHumanAudio=true;
  task.humanAudioRequired=true;
  task.requiresHumanLetterAudio=false;
  task.letterAudioAvailable=false;
  task.audioStimulusId=`human-word-${letter}`;
  task.stimulusId=`audio-word-match-${target.id}`;
  task.prompt=`Höre die menschliche Originalaufnahme. Welches geschriebene Wort hast du gehört? Achte besonders auf ${v62Cue(letter)}.`;
  delete task.audioIndex;
  return v62CleanOptions(task,rng,{size:Math.min(4,1+distractors.length)});
}

const buildV4TaskV62Base=buildV4Task;
buildV4Task=function(state,letter,skill,difficulty,family,session,rng=Math.random,meta={}){
  const task=buildV4TaskV62Base(state,letter,skill,difficulty,family,session,rng,meta);
  if(!task)return task;
  const target=task.letter||letter,resolved=task.family||family;

  if(resolved==='confusion-word-choice'){
    const built=v62BuildConfusionWordChoice(state,target,session,rng,task,difficulty);
    if(built)return built;
    return buildV4TaskV62Base(state,target,'confusionDiscrimination',difficulty,'visual-contrast',session,rng,meta);
  }
  if(resolved==='audio-word-match'){
    const built=v62BuildAudioWordMatch(state,target,session,rng,task,difficulty);
    if(built)return built;
    return buildV4TaskV62Base(state,target,'audioToLetter',difficulty,'audio-to-letter',session,rng,meta);
  }

  // I1 · Ziel explizit benennen.
  if(V62_TARGET_REQUIRED.has(resolved)){
    task.targetLetter=target;
    task.targetCue=v62Cue(target);
    task.prompt=V62_TARGET_PROMPTS[resolved](target);
  }

  // Wortauswahl und Antwortverteilung je Familie korrigieren.
  if(resolved==='word-position'){
    const word=v62PickPositionDiverseWord(state,target,session,rng,difficulty);
    if(word){
    task.wordId=word.id;task.display=word.word;task.icon=word.icon;task.stimulusId=word.id;
    task.correct=targetPosition(word);
    task.options=shuffle(['Anfang','Mitte','Ende','Mehrfach'],rng);
    }
  }
  if(resolved==='word-contains'){
    const wantsYes=v62SlotCoin(session,target,'word-contains');
    const word=(wantsYes?pickWord(state,target,session,rng,{difficulty}):v62NegativeWord(state,target,session,rng,difficulty))||pickWord(state,target,session,rng,{difficulty});
    if(word){
    // Bewusst ohne wordId: noveltyScore/registerSelectedTask würden sonst die
    // Nein-Variante bevorzugen, weil deren Wort nicht von den übrigen
    // Wortfamilien desselben Buchstabens „verbraucht“ wird.
    task.wordId='';task.display=word.word;task.icon='';task.stimulusId=`contains-${word.id}`;
    task.correct=v62Contains(word.word,target)?'Ja':'Nein';
    task.options=['Ja','Nein'];
    }
  }
  if(resolved==='word-choice'){
    const good=pickWord(state,target,session,rng,{difficulty});
    if(good){
      const pool=v62EligibleWords(state,target,difficulty,WORD_BANK).filter(w=>w.word!==good.word&&!v62Contains(w.word,target));
      const distractors=uniq(v62Sample(pool,6,rng).map(w=>w.word)).slice(0,3);
      task.wordId=good.id;task.correct=good.word;task.stimulusId=good.id;
      task.options=[good.word,...distractors];
    }
  }
  if(resolved==='count-target'){
    const word=pickWord(state,target,session,rng,{difficulty,multiple:true})||pickWord(state,target,session,rng,{difficulty});
    if(word){
    const count=word.targetIndexes.length;
    task.wordId=word.id;task.display=word.word;task.icon=word.icon;task.stimulusId=word.id;
    task.correct=String(count);
    task.options=[String(count),...['1','2','3','0','4'].filter(x=>x!==String(count))].slice(0,4);
    }
  }
  if(resolved==='same-different'){
    // Vorher 55 % „Gleich“; die Verteilung wird jetzt fair ausgelost.
    const same=v62SlotCoin(session,target,'same-different'),partner=task.confusionTarget||v62ConfusionPartner(state,target)||ALPHABET.find(c=>c!==target);
    const other=same?target:partner;
    const fonts=relevantFonts(difficulty);
    const first=fonts[Math.floor(rng()*fonts.length)],second=fonts[Math.floor(rng()*fonts.length)];
    task.displayParts=[{text:target,fontId:first.id,style:first.style},{text:v62Lower(other),fontId:second.id,style:second.style}];
    task.display=`${target}|${v62Lower(other)}`;
    task.fontId=`${first.id}-${second.id}`;
    task.correct=same?'Gleich':'Verschieden';
    task.options=['Gleich','Verschieden'];
    task.stimulusId=`${same?'same':'diff'}-${other}`;
  }

  if(resolved==='visual-contrast'){
    // Der Prompt nennt das Ziel bereits; die zusätzliche Paaranzeige verriet die
    // Lösung durch ihre Reihenfolge.
    task.display='';
  }

  // I2 · Eindeutigkeit bei Buchstabenwahl über eine angezeigte Zeichenkette.
  if(V62_UNIQUE_IN_DISPLAY.has(resolved))v62EnforceUniqueLetterInDisplay(task,rng);

  // I5 · Generelle Optionshygiene für alle Auswahlaufgaben.
  if(Array.isArray(task.options)&&task.options.length&&task.correct!=='MULTI'&&task.correct!=='SELF'){
    v62CleanOptions(task,rng);
  }

  // I3 · Positionsleak beseitigen: Die Paaranzeige folgt exakt der bereits
  // gemischten Optionsreihenfolge, statt das Ziel immer vorn zu zeigen.
  if(resolved==='sound-contrast'){
    const pair=(task.options||[]).filter(c=>ALPHABET.includes(c));
    task.display=pair.length>=2?pair.join(' · '):'';
  }
  return task;
};

/* source: alphabet-core-v4-export.js */
'use strict';
const familyCandidatesRunBase=familyCandidates;
familyCandidates=function(state,letter,skill,difficulty,session){
  const families=familyCandidatesRunBase(state,letter,skill,difficulty,session),recent=(session?.mainAnswers||[]).slice(-2).map(x=>x.family||x.type);
  if(recent.length===2&&recent[0]===recent[1]){const alternatives=families.filter(f=>f!==recent[0]);if(alternatives.length)return alternatives;const sameSkillAlternatives=Object.entries(QUESTION_FAMILIES).filter(([f,m])=>f!==recent[0]&&m.skill===skill&&familyAllowedFor(letter,f)).filter(([f,m])=>!m.usesAudio||f==='letter-to-audio-choice'||WORD_BANK.some(w=>w.letter===letter&&w.audioKey===letter)).map(([f])=>f);if(sameSkillAlternatives.length)return sameSkillAlternatives}return families
};
const noveltyScoreV4Base=noveltyScore;
noveltyScore=function(task,state,session){let score=noveltyScoreV4Base(task,state,session),family=task.family||task.type,recent=(session.mainAnswers||[]).slice(-3).map(x=>x.family||x.type);if(recent.at(-1)===family)score-=32;if(recent.length>=2&&recent.slice(-2).every(f=>f===family))score-=85;if(recent.length>=3&&recent.every(f=>f===family))score-=180;return score};
const completionAudioLetters=typeof HUMAN_LETTER_AUDIO_LETTERS!=='undefined'?HUMAN_LETTER_AUDIO_LETTERS:[],completionMacroPhases=typeof MACRO_PHASES!=='undefined'?MACRO_PHASES:[],completionCreateMacro=typeof createMacroSession==='function'?createMacroSession:null,completionMacroPhase=typeof macroPhase==='function'?macroPhase:null,completionAudioSupported=typeof isolatedHumanAudioSupported==='function'?isolatedHumanAudioSupported:()=>false;
const v6Available=typeof V6_VERSION!=='undefined',v5Available=typeof V5_VERSION!=='undefined';
const exportSchema=v6Available?V6_VERSION:v5Available?V5_VERSION:V4_VERSION,exportSkills=v5Available?V5_SKILLS:SKILLS,exportSkillLabels=v5Available?V5_SKILL_LABELS:SKILL_LABELS;
const exportFresh=v6Available?freshStateV6:v5Available?freshStateV5:freshStateV4,exportMigrate=v6Available?migrateV6:v5Available?migrateV5:migrateV4;
const exportSkillMastery=v5Available?skillMasteryV5:skillMasteryV4,exportSkillConfidence=v5Available?skillConfidenceV5:skillConfidence;
const exportMastered=v5Available?masteredV5:masteredV4,exportSummary=v5Available?summaryForLetterV5:summaryForLetterV4;
function exportDifficulty(state,c,skill,now=Date.now()){return v5Available&&skill==='writtenProduction'?productionDifficulty(state,c,now):difficultyFor(state,c,skill,now)}
const maybe=(name,fallback=null)=>typeof globalThis[name]==='function'?globalThis[name]:fallback;
globalThis.AlphabetCoreV2=Object.freeze({
  VERSION:v6Available?6:3,APP_VERSION:v6Available?V6_APP_VERSION:'5.0.0',SCHEMA_VERSION:exportSchema,AGGREGATE_SCHEMA_VERSION:v6Available?V6_AGGREGATE_SCHEMA_VERSION:0,DAY,HOUR,MIN,ALPHABET,LEARN_ORDER,FAKE_FRIENDS,LATIN_TRAPS,HARD,VOWELS,CONSONANTS,SPECIAL,DATA,SOUND_GROUPS,CONTRASTS,CORE_SKILLS,SKILLS:exportSkills,KIND_SKILL,SKILL_LABELS:exportSkillLabels,INTERVALS,
  WORD_BANK,LETTER_PEDAGOGY,FONT_VARIANTS,QUESTION_FAMILIES,PRODUCTION_FAMILIES:v5Available?PRODUCTION_FAMILIES:{},LEARNING_STATE_LABELS,HUMAN_LETTER_AUDIO_LETTERS:completionAudioLetters,MACRO_PHASES:completionMacroPhases,
  uniq,clamp,shuffle,id,localDateKey,todayFrom,daysBetween,skillForKind,
  freshState:exportFresh,migrate:exportMigrate,touchStudy,recentAccuracy,independentAccuracy,avgSkillLatency,
  skillMastery:exportSkillMastery,skillConfidence:exportSkillConfidence,productionMastery:v5Available?productionMastery:()=>0,productionConfidence:v5Available?productionConfidence:()=>0,productionStage:v5Available?productionStage:()=> 'locked',productionStatusLabel:v5Available?productionStatusLabel:()=> 'noch nicht sinnvoll',coreSkillScores:coreSkillScoresV4,retentionDaysForLetter,letterMastery:letterMasteryV4,
  letterReady:letterReadyV4,letterStatus:letterStatusV4,learningState,problemFlag,writtenProductionReady:v5Available?writtenProductionReady:()=>false,audioWrittenProductionReady:v5Available?audioWrittenProductionReady:()=>false,productionNeed:v5Available?productionNeed:()=>-999,productionDifficulty:v5Available?productionDifficulty:()=>0,productionFamiliesFor:v5Available?productionFamiliesFor:()=>[],productionGate:v5Available?productionGate:()=>({done:false}),productionCoverageSummary:v6Available?productionCoverageSummaryV6:()=>({byFamily:{},totalLetters:0}),readyProductionLetters:v6Available?readyProductionLettersV6:()=>[],readyProductionLettersUncached:v6Available?readyProductionLettersUncachedV6:()=>[],syncRepairAggregates:v6Available?syncRepairAggregates:()=>null,validateStateInvariants:v6Available?validateStateInvariants:()=>({ok:true,errors:[]}),normalizeExamHistoryNewest:v6Available?normalizeExamHistoryNewest:(rows=>rows||[]),
  recordAnswer:v6Available?recordAnswerV6:recordAnswerV4,recordWriting,recordProductionSelfCheck:v6Available?recordProductionSelfCheckV6:v5Available?recordProductionSelfCheck:()=>null,topConfusions,errorPriority,weakLetters,errorLetters,dueSkillPairs,dueLetters,secureLetters:secureLettersV4,
  calculateLearningNeed,shouldUnlockNextLetter,recomputeLearningPlan,activeLearningSet,reviewSetFor,difficultyFor:exportDifficulty,wordsForLetter,pickWord,pickNegativeWordV5:v5Available?pickNegativeWordV5:()=>null,familyCandidates,familyAllowedFor,
  buildDistractors,makeTask,variantizeTask,buildExam,buildV4Task,questionSignature,noveltyScore,noteExposure,detectLatinTrap,productionTask:v5Available?productionTask:()=>null,selectProductionTask:v5Available?selectProductionTask:()=>null,productionQuotaForSession:v5Available?productionQuotaForSession:()=>0,shouldInsertProduction:v5Available?shouldInsertProduction:()=>false,initProductionSession:v5Available?initProductionSession:s=>s,createProductionTestSession:v5Available?createProductionTestSession:()=>null,productionTestAvailability:v5Available?productionTestAvailability:()=>({ready:0}),productionSummary:v5Available?productionSummary:()=>({total:0,pass:0,unsure:0,again:0,repairTotal:0,repairPass:0}),
  selectNextMainQuestion,selectLetterV4,selectSkillV4,selectFamilyV4,overexposurePenalty,createAdaptiveSession,createFocusedSession,createBattleSession,createMacroSession:completionCreateMacro,macroPhase:completionMacroPhase,isolatedHumanAudioSupported:completionAudioSupported,sessionQualityMetrics,sessionDelta,
  repairTask:repairTaskV4,registerRepair,openRepairIds,syncRepairPending,scheduleRepairForSession:scheduleRepairForSessionV4,productionRepairTask:v5Available?productionRepairTask:()=>null,scheduleProductionRepairForSession:v5Available?scheduleProductionRepairForSession:()=>null,dueRepairForSession,applyMainAnswer,applyRepairAnswer,sessionScore,
  buildDiagnostic,buildExamV4:buildRealExamV4,buildCertification:buildCertificationV4,buildAudioCertification,buildFakeCertification,buildFinalCertification:buildFinalCertificationV4,
  recordExam,addMasteryCheck,averageRecognitionMs,mastered:exportMastered,statsToday,summaryForLetter:exportSummary,openMasteryItems:openMasteryItemsV4,
  createExamSession,toggleBookmark,isBookmarked,taskFromBookmark,plausibleSyllable,technicalAudioFailureDecision,makeAudioFallback,snapshotMastery
});
