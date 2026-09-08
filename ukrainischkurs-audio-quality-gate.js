/* Ukrainischkurs für Joel · Audio-Integritätswache v1
   Synthetische Sprache darf als transparente Übungshilfe existieren, aber niemals
   unbemerkt als hochwertiger Human-Hör-/Sprechnachweis in die Lernstatistik eingehen. */
(()=>{
  const VERSION=1,core=window.UKRAINIAN_LEARNING_CORE;if(!core||typeof speak!=='function')return;
  const norm=text=>core.normalize?core.normalize(text):String(text||'').trim().toLocaleLowerCase('uk-UA');
  const state={syntheticSinceEvidence:false,last:null,events:[],human:0,synthetic:0};
  const baseSpeak=speak;
  const humanBank=()=>window.UKRAINIAN_HUMAN_SENTENCE_AUDIO;
  function note(text,source,detail={}){
    const item={time:Date.now(),text:String(text||''),norm:norm(text),source:String(source||''),...detail};state.last=item;state.events.push(item);if(state.events.length>80)state.events.splice(0,state.events.length-80);
    if(source==='human')state.human++;else if(source&&source!=='loading'){state.synthetic++;state.syntheticSinceEvidence=true}
    try{window.dispatchEvent(new CustomEvent('ukrainian-audio-quality',{detail:item}))}catch{}
  }
  speak=function(text,button){
    const expected=!!humanBank()?.has?.(text);
    if(!expected)note(text,'tts-unverified',{reason:'no-exact-human-recording'});
    return baseSpeak(text,button);
  };
  window.addEventListener('ukrainian-audio-source',event=>{
    const d=event.detail||{},source=String(d.source||'');
    if(source==='human')note(d.text,'human',{speaker:d.speaker||'',license:d.license||''});
    else if(source)note(d.text,source,{reason:'human-playback-fallback'});
  });
  const baseRecord=core.recordSession.bind(core);
  core.recordSession=function(meta={}){
    const skills=[...(Array.isArray(meta.skills)?meta.skills:[meta.skills])].filter(Boolean),hearing=skills.includes('listening')||String(meta.module||'').includes('spoken-transfer');
    const synthetic=hearing&&state.syntheticSinceEvidence;
    const adjusted=synthetic?{...meta,assisted:true,weight:Math.min(Number(meta.weight)||1,.55),audioQuality:'synthetic-or-unverified'}:{...meta,audioQuality:hearing?'human-or-no-audio':'not-applicable'};
    const result=baseRecord(adjusted);
    if(synthetic&&String(meta.module||'')==='human-listening'){
      const st=s.humanListening?.days?.[String(meta.day??s.day)];if(st){st.passed=false;st.qualityPassed=false;st.lastAudioQuality='synthetic-or-unverified'}
    }
    if(synthetic&&String(meta.module||'')==='spoken-transfer'){
      const st=s.spokenTransfer?.days?.[String(meta.day??s.day)];if(st){st.strongPassed=false;st.assisted=true;st.lastAudioQuality='synthetic-or-unverified'}
    }
    if(hearing){state.syntheticSinceEvidence=false;try{save()}catch{}}
    return result;
  };
  window.UKRAINIAN_AUDIO_QUALITY={version:VERSION,state,sourceFor:text=>{const n=norm(text);return [...state.events].reverse().find(x=>x.norm===n)?.source||''},last:()=>state.last,resetEvidence:()=>{state.syntheticSinceEvidence=false},isHuman:text=>{const n=norm(text);return [...state.events].reverse().find(x=>x.norm===n)?.source==='human'}};
})();