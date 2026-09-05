/* Ukrainischkurs für Joel · Fashion Bridge v1
   Freiwillige personalisierte Mode-Mikrolektionen nach der Alphabet-Mastery.
   Kein A1-Gate: Zusatzwortschatz aus Verkauf, Artikeln, Materialien und Shop-Situationen. */
(()=>{
  const VERSION=1,core=window.UKRAINIAN_LEARNING_CORE;if(!core)return;
  const TOPICS=[
    {title:'Artikel · Oberteile',brand:'McQueen · Ann Demeulemeester',items:[['куртка','Jacke'],['піджак','Blazer'],['сорочка','Hemd'],['футболка','T-Shirt']]},
    {title:'Artikel · Unterteile & Kleider',brand:'Margiela · Jean Paul Gaultier',items:[['штани','Hose'],['спідниця','Rock'],['сукня','Kleid'],['топ','Top']]},
    {title:'Schuhe & Accessoires',brand:'Prada · Y-3',items:[['взуття','Schuhe'],['черевики','Boots'],['сумка','Tasche'],['окуляри','Brille']]},
    {title:'Materialien',brand:'Rundholz · Yohji Yamamoto',items:[['шкіра','Leder'],['бавовна','Baumwolle'],['вовна','Wolle'],['денім','Denim']]},
    {title:'Farben',brand:'Saint Laurent · Balmain',items:[['чорний','schwarz'],['білий','weiß'],['синій','blau'],['червоний','rot']]},
    {title:'Größe & Passform',brand:'Raf Simons · Balenciaga',items:[['розмір','Größe'],['великий','groß'],['малий','klein'],['оверсайз','Oversize']]},
    {title:'Zustand',brand:'Vintage / Resale',items:[['стан','Zustand'],['новий','neu'],['вживаний','gebraucht'],['дефект','Defekt']]},
    {title:'Preis & Rabatt',brand:'Disorder119 Shop',items:[['ціна','Preis'],['знижка','Rabatt'],['дорого','teuer'],['дешево','günstig']]},
    {title:'Kaufen & Verkaufen',brand:'Disorder119 Shop',items:[['купити','kaufen'],['продати','verkaufen'],['покупець','Käufer'],['продавець','Verkäufer']]},
    {title:'Original & Marke',brand:'Prada · Margiela · McQueen',items:[['бренд','Marke'],['оригінал','Original'],['справжній','echt'],['логотип','Logo']]},
    {title:'Listing & Details',brand:'Disorder119 Artikelbeschreibung',items:[['фото','Foto'],['опис','Beschreibung'],['етикетка','Etikett'],['ярлик','Tag / Schild']]},
    {title:'Versand',brand:'Online-Verkauf',items:[['посилка','Paket'],['доставка','Lieferung'],['адреса','Adresse'],['упаковка','Verpackung']]},
    {title:'Mini-Sätze · Verkauf',brand:'Disorder119 Praxis',items:[['Я продаю куртку.','Ich verkaufe eine Jacke.'],['Я купую взуття.','Ich kaufe Schuhe.'],['Яка ціна?','Wie hoch ist der Preis?'],['Який розмір?','Welche Größe?']]},
    {title:'Mini-Sätze · Beschreibung',brand:'Disorder119 Praxis',items:[['Це шкіра.','Das ist Leder.'],['Стан хороший.','Der Zustand ist gut.'],['Це оригінал?','Ist das ein Original?'],['Є знижка?','Gibt es Rabatt?']]}
  ];
  let quiz=null;
  const esc=x=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function ensure(){if(!s.fashionBridge||typeof s.fashionBridge!=='object')s.fashionBridge={version:VERSION,seen:{},best:{}};s.fashionBridge.version=VERSION;s.fashionBridge.seen=s.fashionBridge.seen||{};s.fashionBridge.best=s.fashionBridge.best||{};return s.fashionBridge}
  function unlocked(){try{return core.isUnlocked('alphabet.mastery')}catch{return Number(s.day)>=14}}
  function topicIndex(){return Math.abs(Number(s.day)||0)%TOPICS.length}
  function shuffle(a){const x=[...a];for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]]}return x}
  function startQuiz(){const topic=TOPICS[topicIndex()];quiz={idx:0,correct:0,items:shuffle(topic.items)};renderFashion()}
  function answer(value){if(!quiz)return;const item=quiz.items[quiz.idx],good=value===item[0];if(good)quiz.correct++;toast(good?'Richtig.':'Richtig wäre: '+item[0]+' = '+item[1]);quiz.idx++;if(quiz.idx>=quiz.items.length){const st=ensure(),k=String(topicIndex());st.best[k]=Math.max(Number(st.best[k])||0,quiz.correct);st.seen[k]=(Number(st.seen[k])||0)+1;save();toast('Fashion-Check: '+quiz.correct+'/4');quiz=null}renderFashion()}
  function questionHtml(){const item=quiz.items[quiz.idx],topic=TOPICS[topicIndex()],distractors=topic.items.filter(x=>x[0]!==item[0]).map(x=>x[0]);const opts=shuffle([item[0],...shuffle(distractors).slice(0,3)]);return '<div class="fb-quiz"><div class="label">Fashion-Check · '+(quiz.idx+1)+'/4</div><div class="fb-q">Wie heißt <strong>'+esc(item[1])+'</strong> auf Ukrainisch?</div><div class="fb-opts">'+opts.map(x=>'<button class="answer" data-fb="'+esc(x)+'" lang="uk">'+esc(x)+'</button>').join('')+'</div></div>'}
  function renderFashion(){let box=document.getElementById('fashionBridgeLesson'),cards=document.getElementById('cards');if(!cards||!unlocked()){if(box)box.hidden=true;return}if(!box){box=document.createElement('section');box.id='fashionBridgeLesson';box.className='card';const after=document.getElementById('designerAlphabetLesson')||cards;after.insertAdjacentElement('afterend',box)}box.hidden=false;const i=topicIndex(),t=TOPICS[i],st=ensure();const best=Number(st.best[String(i)])||0;box.innerHTML='<div class="top"><div><div class="label">Fashion-Ukrainisch · freiwilliger 2-Minuten-Impuls</div><h2>'+esc(t.title)+'</h2></div><div class="pill">'+(best?best+'/4':'Mode')+'</div></div><div class="small">Kontext: <strong>'+esc(t.brand)+'</strong>. Dieser Zusatzwortschatz zählt nicht als A1-Abkürzung, sondern macht den Kurs persönlicher.</div><div class="fb-grid">'+t.items.map(([uk,de])=>'<div class="fb-item"><strong lang="uk">'+esc(uk)+'</strong><span>'+esc(de)+'</span><button class="ghost" data-fb-speak="'+esc(uk)+'">🔊</button></div>').join('')+'</div>'+(quiz?questionHtml():'<div class="actions"><button class="secondary" id="fbStart">4er-Fashion-Check</button></div>');box.querySelectorAll('[data-fb]').forEach(b=>b.onclick=()=>answer(b.dataset.fb));box.querySelectorAll('[data-fb-speak]').forEach(b=>b.onclick=()=>{if(typeof speak==='function')speak(b.dataset.fbSpeak,b)});const start=document.getElementById('fbStart');if(start)start.onclick=startQuiz}
  const css=document.createElement('style');css.textContent='.fb-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px;margin:13px 0}.fb-item{display:grid;grid-template-columns:1fr 1fr auto;gap:8px;align-items:center;border:1px solid #dce8f4;border-radius:12px;padding:9px 10px}.fb-item span{font-size:.8rem;color:var(--m)}.fb-item button{padding:5px 7px}.fb-q{margin:13px 0;font-size:1.05rem}.fb-opts{display:grid;grid-template-columns:repeat(2,1fr);gap:7px}@media(max-width:620px){.fb-grid{grid-template-columns:1fr}.fb-opts{grid-template-columns:1fr}}';document.head.append(css);
  window.UKRAINIAN_FASHION_BRIDGE={version:VERSION,topics:TOPICS.length,items:TOPICS.reduce((n,t)=>n+t.items.length,0),personalized:true,optional:true,alphabetDependency:true,get completedTopics(){return Object.keys(ensure().seen).length}};
  const previousRender=render;render=function(){previousRender();renderFashion()};ensure();renderFashion();
})();