/* Ukrainischkurs für Joel · Audio-Integritätswache v2
   Synthetische Sprache darf als transparente Übungshilfe existieren, aber niemals
   unbemerkt als hochwertiger Human-Hör-/Sprechnachweis in die Lernstatistik eingehen. */
(()=>{
  const VERSION=2,core=window.UKRAINIAN_LEARNING_CORE;if(!core||typeof speak!=='function')return;
  const norm=text=>core.normalize?core.normalize(text):String(text||'').trim().toLocaleLowerCase('uk-UA');
  const state={syntheticSinceEvidence:false,last:null,events:[],human:0,synthetic:0};
  const baseSpeak=speak;
  const humanBank=()=>window.UKRAINIAN_HUMAN_SENTENCE_AUDIO;
  function patchVisibleSource(source){
    const human=source==='human',text=human?'✓ Menschliche ukrainische Aufnahme':'⚠ Synthetische Tonspur · zählt nur als unterstützte Hörübung';
    for(const id of ['a1xListen','cdListen','a1xRepairListen','listenBtn']){const b=document.getElementById(id);if(!b)continue;b.dataset.audioQuality=source;b.title=text}
    for(const host of ['a1ExamBox','a1CanDo']){const el=document.getElementById(host);if(!el)continue;let badge=el.querySelector('.audio-quality-badge');if(!badge){badge=document.createElement('div');badge.className='audio-quality-badge small';el.append(badge)}badge.textContent=text;badge.dataset.source=source}
  }
  function note(text,source,detail={}){
    const item={time:Date.now(),text:String(text||''),norm:norm(text),source:String(source||''),...detail};state.last=item;state.events.push(item);if(state.events.length>80)state.events.splice(0,state.events.length-80);
    if(source==='human')state.human++;else if(source&&source!=='loading'){state.synthetic++;state.syntheticSinceEvidence=true}
    if(source&&source!=='loading')patchVisibleSource(source);
    try{window.dispatchEvent(new CustomEvent('ukrainian-audio-quality',{detail:item}))}catch{}
  }
  speak=function(text,button){const expected=!!humanBank()?.has?.(text);if(!expected)note(text,'tts-unverified',{reason:'no-exact-human-recording'});return baseSpeak(text,button)};
  window.addEventListener('ukrainian-audio-source',event=>{const d=event.detail||{},source=String(d.source||'');if(source==='human')note(d.text,'human',{speaker:d.speaker||'',license:d.license||''});else if(source)note(d.text,source,{reason:'human-playback-fallback'})});
  const baseRecord=core.recordSession.bind(core);
  core.recordSession=function(meta={}){
    const module=String(meta.module||''),skills=[...(Array.isArray(meta.skills)?meta.skills:[meta.skills])].filter(Boolean),hearing=skills.includes('listening')||module.includes('spoken-transfer');
    const synthetic=hearing&&state.syntheticSinceEvidence;
    const adjusted=synthetic?{...meta,assisted:true,weight:Math.min(Number(meta.weight)||1,.55),audioQuality:'synthetic-or-unverified'}:{...meta,audioQuality:hearing?'human-or-no-audio':'not-applicable'};
    const result=baseRecord(adjusted);
    if(synthetic&&module==='human-listening'){const st=s.humanListening?.days?.[String(meta.day??s.day)];if(st){st.passed=false;st.qualityPassed=false;st.lastAudioQuality='synthetic-or-unverified'}}
    if(synthetic&&module==='spoken-transfer'){const st=s.spokenTransfer?.days?.[String(meta.day??s.day)];if(st){st.strongPassed=false;st.assisted=true;st.lastAudioQuality='synthetic-or-unverified'}}
    if(synthetic&&module.includes('a1-exam')&&skills.includes('listening')){const st=s.a1Exam?.domains?.listening;if(st){st.audioAssisted=true;st.audioQuality='synthetic-or-unverified'}}
    if(synthetic&&module==='a1-cando-listening'){if(s.a1CanDo){s.a1CanDo.listeningAudioAssisted=true;s.a1CanDo.listeningAudioQuality='synthetic-or-unverified'}}
    if(hearing){state.syntheticSinceEvidence=false;try{save()}catch{}}
    return result;
  };
  const css=document.createElement('style');css.textContent='.audio-quality-badge{margin-top:9px;text-align:center;font-weight:750;color:#667a6d}.audio-quality-badge[data-source="human"]{color:#347b4a}';document.head.append(css);
  window.UKRAINIAN_AUDIO_QUALITY={version:VERSION,state,sourceFor:text=>{const n=norm(text);return [...state.events].reverse().find(x=>x.norm===n)?.source||''},last:()=>state.last,resetEvidence:()=>{state.syntheticSinceEvidence=false},isHuman:text=>{const n=norm(text);return [...state.events].reverse().find(x=>x.norm===n)?.source==='human'},marksA1Synthetic:true,syntheticEvidenceAssisted:true};
})();