/* Ukrainischkurs für Joel · Wortbetonung v1
   Verifizierte Betonungen für häufige A1-Wörter. Akzentzeichen sind Lernhilfe,
   keine normale Schreibpflicht im Ukrainischen. */
(()=>{
  const VERSION=1;
  const ENTRIES=[
    {plain:'потяг',marked:'по́тяг',min:43,source:'https://uk.wiktionary.org/wiki/потяг'},
    {plain:'автобус',marked:'авто́бус',min:43,source:'https://uk.wiktionary.org/wiki/автобус'},
    {plain:'зупинка',marked:'зупи́нка',min:43,source:'https://slovnyk.me/dict/sum/зупинка'},
    {plain:'лікар',marked:'лі́кар',min:44,source:'https://uk.wiktionary.org/wiki/лікар'},
    {plain:'аптека',marked:'апте́ка',min:44,source:'https://uk.wiktionary.org/wiki/аптека'},
    {plain:'допомога',marked:'допомо́га',min:44,source:'https://uk.wiktionary.org/wiki/допомога'},
    {plain:'Україна',marked:'Украї́на',min:45,source:'https://uk.wiktionary.org/wiki/Україна'},
    {plain:'мама',marked:'ма́ма',min:47,source:'https://uk.wiktionary.org/wiki/мама'},
    {plain:'сестра',marked:'сестра́',min:47,source:'https://uk.wiktionary.org/wiki/сестра'},
    {plain:'батьки',marked:'батьки́',min:47,source:'https://uk.wiktionary.org/wiki/батьки'},
    {plain:'розумію',marked:'розумі́ю',min:48,source:'https://uk.wiktionary.org/wiki/розуміти'},
    {plain:'магазин',marked:'магази́н',min:54,source:'https://uk.wiktionary.org/wiki/магазин'}
  ];
  const VOWELS='аеєиіїоуюяАЕЄИІЇОУЮЯ';
  const strip=x=>String(x||'').normalize('NFD').replace(/\u0301/g,'').normalize('NFC');
  const shuffle=a=>[...a].sort(()=>Math.random()-.5);
  function ensure(){if(!s.wordStress||typeof s.wordStress!=='object')s.wordStress={version:VERSION,days:{},best:0};s.wordStress.version=VERSION;s.wordStress.days=s.wordStress.days||{};return s.wordStress}
  function key(){return String(s.day)}
  function state(){const st=ensure();return st.days[key()]||(st.days[key()]={passed:false,best:0,attempts:0,date:''})}
  function eligible(){return ENTRIES.filter(x=>x.min<=Number(s.day))}
  function newToday(){return ENTRIES.filter(x=>x.min===Number(s.day))}
  function reviewDay(){return WEEKLY_REVIEW_DAYS.includes(Number(s.day))&&Number(s.day)>=43&&Number(s.day)<D.length-1}
  function required(){return newToday().length>0||reviewDay()}
  function options(entry){
    const chars=Array.from(strip(entry.plain)),variants=[];
    chars.forEach((ch,i)=>{if(!VOWELS.includes(ch))return;const c=[...chars];c.splice(i+1,0,'\u0301');variants.push(c.join('').normalize('NFC'))});
    const correct=entry.marked.normalize('NFC'),wrong=shuffle(variants.filter(x=>x!==correct));
    return shuffle([correct,...wrong.slice(0,2)]);
  }
  let session=null;
  function sessionItems(){const fresh=newToday();if(fresh.length)return fresh;return shuffle(eligible()).slice(0,Math.min(6,eligible().length))}
  function start(){const items=sessionItems();if(!items.length){toast('Noch keine verifizierten Betonungswörter fällig.');return}session={items:shuffle(items),idx:0,correct:0};renderBox()}
  function answer(v){const q=session.items[session.idx],good=v.normalize('NFC')===q.marked.normalize('NFC');if(good)session.correct++;toast(good?'Betonung richtig.':'Richtig: '+q.marked);session.idx++;if(session.idx>=session.items.length){const st=state(),need=newToday().length?session.items.length:Math.max(1,session.items.length-1),score=Math.round(session.correct/session.items.length*100);st.best=Math.max(st.best||0,score);st.attempts++;st.date=date();st.passed=session.correct>=need;save();session=null;toast(st.passed?'Betonung für heute stabil.':'Noch nicht stabil: starte einen frischen Durchgang.');render();return}renderBox()}
  function sourceSummary(items){return [...new Set(items.map(x=>x.source))].length+' geprüfte Wörterbuchnachweise'}
  function renderBox(){
    let box=document.getElementById('wordStressBox');
    if(!required()){if(box)box.hidden=true;return}
    const cards=document.getElementById('cards');if(!cards)return;
    if(!box){box=document.createElement('section');box.id='wordStressBox';box.className='card';cards.insertAdjacentElement('afterend',box)}
    box.hidden=false;const st=state(),fresh=newToday();
    if(session){const q=session.items[session.idx];box.innerHTML='<div class="label">Betonung · '+(session.idx+1)+' / '+session.items.length+'</div><h2>Welche Schreibweise zeigt die richtige Betonung?</h2><div class="ws-plain" lang="uk">'+strip(q.plain)+'</div><div class="ws-grid">'+options(q).map(x=>'<button class="answer" data-ws="'+x+'" lang="uk">'+x+'</button>').join('')+'</div><p class="small">Der Akzentstrich ist hier nur Lernmarkierung.</p>';box.querySelectorAll('[data-ws]').forEach(b=>b.onclick=()=>answer(b.dataset.ws));return}
    const pool=fresh.length?fresh:eligible();
    box.innerHTML='<div class="label">'+(fresh.length?'Neue Wortbetonung':'Review · Wortbetonung')+'</div><h2>Betonung nicht dem Zufall überlassen</h2><p class="small">Ukrainischer Wortakzent ist beweglich. Deshalb werden nur verifizierte Formen trainiert. Die Akzentzeichen musst du im normalen Schreiben nicht setzen.</p><div class="ws-known">'+(st.passed?'✓ Für heute bestanden.':'Heute: '+(fresh.length?fresh.length+' neue verifizierte Wörter':'6 gemischte Wörter; höchstens ein Fehler')+'.')+'</div><div class="small">'+sourceSummary(pool)+'</div><div class="actions"><button class="'+(st.passed?'secondary':'primary')+'" id="wsStart">'+(st.passed?'noch einmal':'Betonung starten')+'</button></div>';
    document.getElementById('wsStart').onclick=start;
  }
  const oldNext=document.getElementById('next')?.onclick;if(document.getElementById('next'))document.getElementById('next').onclick=function(e){if(required()&&!state().passed){renderBox();document.getElementById('wordStressBox')?.scrollIntoView({behavior:'smooth',block:'center'});toast('Vor dem nächsten Kurstag erst die heutige Wortbetonung sicher abrufen.');return}return oldNext?.call(this,e)};
  const css=document.createElement('style');css.textContent='.ws-plain{font-size:2rem;font-weight:900;text-align:center;margin:16px}.ws-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.ws-grid .answer{text-align:center;font-size:1.05rem}.ws-known{font-weight:800;margin:10px 0}@media(max-width:560px){.ws-grid{grid-template-columns:1fr}}';document.head.append(css);
  const previousRender=render;render=function(){previousRender();renderBox()};ensure();renderBox();
})();
