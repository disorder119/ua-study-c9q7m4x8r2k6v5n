/* Ukrainischkurs für Joel · Human Sentence Audio v1
   Erste verifizierte menschliche Wort-/Phrasenaufnahmen außerhalb des Alphabets.
   Nur Dateien mit nachvollziehbarer CC-BY-3.0-US-Quelle; sonst fällt speak() auf TTS zurück. */
(()=>{
  const VERSION=1;
  const norm=x=>String(x||'').normalize('NFC').toLocaleLowerCase('uk').replace(/[ʼ’‘'`]/g,'’').replace(/[.!?,…]/g,'').replace(/\s+/g,' ').trim();
  const commonsFile=file=>'https://commons.wikimedia.org/wiki/Special:FilePath/'+encodeURIComponent(file);
  const commonsPage=file=>'https://commons.wikimedia.org/wiki/File:'+encodeURIComponent(file);
  const ITEMS=[
    {text:'будь ласка',file:'Uk-будь ласка.ogg',speaker:'Женя Музика',credit:'Женя Музика, Nicolas Vion / Shtooka Project',license:'CC BY 3.0 US'},
    {text:'Я не знаю',file:'Uk-я не знаю.ogg',speaker:'Світлана Чурак',credit:'Association Shtooka, Світлана Чурак / Shtooka Project',license:'CC BY 3.0 US'},
    {text:'Німеччина',file:'Uk-Німеччина.ogg',speaker:'Женя Музика',credit:'Женя Музика, Nicolas Vion / Shtooka Project',license:'CC BY 3.0 US'}
  ].map(x=>({...x,url:commonsFile(x.file),source:commonsPage(x.file)}));
  const MAP=new Map(ITEMS.map(x=>[norm(x.text),x]));
  window.UKRAINIAN_HUMAN_SENTENCE_AUDIO={version:VERSION,count:ITEMS.length,items:ITEMS.map(x=>({...x}))};
  const baseSpeak=speak;
  let current=null;
  function humanSpeak(item,button){
    try{if(current){current.pause();current=null}const audio=new Audio(item.url);current=audio;if(button){button.disabled=true;button.dataset.humanAudio='1';button.title='Menschliche Aufnahme · '+item.speaker}const done=()=>{if(button)button.disabled=false;if(current===audio)current=null};audio.onended=done;audio.onerror=()=>{done();baseSpeak(item.text,button)};const p=audio.play();if(p&&typeof p.catch==='function')p.catch(()=>{done();baseSpeak(item.text,button)});}catch(e){baseSpeak(item.text,button)}
  }
  speak=function(text,button){const item=MAP.get(norm(text));if(item)return humanSpeak(item,button);return baseSpeak(text,button)};
  function credits(){if(document.getElementById('humanAudioCredits'))return;const details=document.createElement('details');details.id='humanAudioCredits';details.className='human-audio-credits';details.innerHTML='<summary>Audioquellen</summary><div class="small">'+ITEMS.map(x=>'<div><span lang="uk">'+x.text+'</span> — '+x.credit+', '+x.license+' · <a href="'+x.source+'" target="_blank" rel="noopener">Dateiquelle</a></div>').join('')+'<div>Andere spätere Sätze verwenden weiterhin System-TTS; sie werden nicht als menschliche Aufnahme ausgegeben.</div></div>';document.body.append(details)}
  const css=document.createElement('style');css.textContent='.human-audio-credits{max-width:760px;margin:14px auto 28px;padding:0 18px;font-size:.82rem;opacity:.78}.human-audio-credits summary{cursor:pointer;font-weight:700}.human-audio-credits a{color:inherit}';document.head.append(css);credits();
})();