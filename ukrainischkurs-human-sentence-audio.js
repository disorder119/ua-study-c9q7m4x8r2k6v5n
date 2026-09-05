/* Ukrainischkurs für Joel · Human Course Audio v4
   Verifizierte menschliche Wort-/Phrasenaufnahmen außerhalb des Alphabets.
   Die Laufzeit meldet transparent, ob die menschliche Datei oder TTS-Fallback lief.
   Unterbrochene Wiedergaben werden sauber beendet und zugehörige Buttons entsperrt. */
(()=>{
  const VERSION=4;
  const norm=x=>String(x||'').normalize('NFC').toLocaleLowerCase('uk').replace(/[ʼ’‘'`]/g,'’').replace(/[.!?,…]/g,'').replace(/\s+/g,' ').trim();
  const commonsFile=file=>'https://commons.wikimedia.org/wiki/Special:FilePath/'+encodeURIComponent(file);
  const commonsPage=file=>'https://commons.wikimedia.org/wiki/File:'+encodeURIComponent(file);
  const GALIA={speaker:'Галя Раптова',credit:'Галя Раптова, Nicolas Vion / Shtooka Project',license:'CC BY 3.0 US'};
  const ZHENIA={speaker:'Женя Музика',credit:'Женя Музика, Nicolas Vion / Shtooka Project',license:'CC BY 3.0 US'};
  const SVITLANA={speaker:'Світлана Чурак',credit:'Association Shtooka, Світлана Чурак / Shtooka Project',license:'CC BY 3.0 US'};
  const ITEMS=[
    {text:'будь ласка',file:'Uk-будь ласка.ogg',...ZHENIA},
    {text:'Я не знаю',file:'Uk-я не знаю.ogg',...SVITLANA},
    {text:'Німеччина',file:'Uk-Німеччина.ogg',...ZHENIA},
    {text:'вода',file:'Uk-вода.ogg',...GALIA},
    {text:'аптека',file:'Uk-аптека.ogg',...GALIA},
    {text:'магазин',file:'Uk-магазин.ogg',...GALIA},
    {text:'автобус',file:'Uk-автобус.ogg',...GALIA},
    {text:'лікар',file:'Uk-лікар.ogg',...GALIA},
    {text:'тато',file:'Uk-тато.ogg',...GALIA},
    {text:'брат',file:'Uk-брат.ogg',...GALIA},
    {text:'туалет',file:'Uk-туалет.ogg',...GALIA},
    {text:'Україна',file:'Uk-Україна.ogg',...ZHENIA}
  ].map(x=>({...x,url:commonsFile(x.file),source:commonsPage(x.file)}));
  const MAP=new Map(ITEMS.map(x=>[norm(x.text),x]));
  const baseSpeak=speak;
  let current=null;
  function announce(item,source){
    try{window.dispatchEvent(new CustomEvent('ukrainian-audio-source',{detail:{text:item.text,source,speaker:item.speaker,license:item.license}}))}catch{}
  }
  function release(playback){
    if(!playback||playback.released)return;
    playback.released=true;
    playback.audio.onended=null;playback.audio.onerror=null;
    if(playback.button)playback.button.disabled=false;
    if(current===playback)current=null;
  }
  function stopCurrent(){
    const playback=current;if(!playback)return;
    try{playback.audio.pause()}catch{}
    release(playback);
  }
  function fallback(item,button){
    if(button){button.disabled=false;button.dataset.audioSource='tts-fallback';button.title='System-TTS-Fallback · menschliche Datei konnte nicht geladen werden'}
    announce(item,'tts-fallback');baseSpeak(item.text,button);
  }
  function humanSpeak(item,button){
    stopCurrent();
    try{
      const audio=new Audio(item.url),playback={audio,button,released:false};current=playback;let failed=false;
      if(button){button.disabled=true;button.dataset.humanAudio='1';button.dataset.audioSource='loading';button.title='Menschliche Aufnahme wird geladen · '+item.speaker}
      const done=()=>release(playback);
      const failOnce=()=>{if(failed||playback.released)return;failed=true;release(playback);fallback(item,button)};
      audio.onended=done;audio.onerror=failOnce;
      const p=audio.play();
      if(p&&typeof p.then==='function')p.then(()=>{if(failed||playback.released)return;if(button){button.dataset.audioSource='human';button.title='Menschliche Aufnahme · '+item.speaker}announce(item,'human')}).catch(failOnce);
      else if(!playback.released){if(button){button.dataset.audioSource='human';button.title='Menschliche Aufnahme · '+item.speaker}announce(item,'human')}
    }catch{stopCurrent();fallback(item,button)}
  }
  speak=function(text,button){
    const item=MAP.get(norm(text));
    if(item)return humanSpeak(item,button);
    stopCurrent();
    return baseSpeak(text,button)
  };
  window.UKRAINIAN_HUMAN_SENTENCE_AUDIO={version:VERSION,count:ITEMS.length,items:ITEMS.map(x=>({...x})),has:text=>MAP.has(norm(text))};
  function credits(){
    if(document.getElementById('humanAudioCredits'))return;
    const details=document.createElement('details');details.id='humanAudioCredits';details.className='human-audio-credits';
    details.innerHTML='<summary>Audioquellen · '+ITEMS.length+' verifizierte menschliche Aufnahmen</summary><div class="small">'+ITEMS.map(x=>'<div><span lang="uk">'+x.text+'</span> — '+x.credit+', '+x.license+' · <a href="'+x.source+'" target="_blank" rel="noopener">Dateiquelle</a></div>').join('')+'<div>Andere spätere Wörter und Sätze verwenden weiterhin System-TTS. Wenn eine menschliche Datei technisch nicht lädt, wird der Fallback ausdrücklich als TTS gekennzeichnet.</div></div>';
    document.body.append(details)
  }
  const css=document.createElement('style');css.textContent='.human-audio-credits{max-width:760px;margin:14px auto 28px;padding:0 18px;font-size:.82rem;opacity:.78}.human-audio-credits summary{cursor:pointer;font-weight:700}.human-audio-credits a{color:inherit}';document.head.append(css);credits();
})();
