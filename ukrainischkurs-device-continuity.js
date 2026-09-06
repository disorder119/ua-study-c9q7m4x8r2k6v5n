/* Ukrainischkurs für Joel · Device Continuity v1
   Sicherer Gerätewechsel für die statische GitHub-Pages-App.
   Kein vorgetäuschter Cloud-Sync: Fortschritt bleibt lokal, kann aber als geprüftes
   Übergabepaket geteilt/importiert werden. Vor Import/Reset entstehen lokale
   Rettungspunkte; ältere Sicherungen werden nicht still über neueren Stand gelegt. */
(()=>{
  const VERSION=1,FORMAT='ukrainischkurs-handoff-v1',DEVICE_KEY='ukrainischkurs-device-id-v1',RECOVERY_KEY='ukrainischkurs-recovery-v1',MAX_RECOVERY=3;
  const COURSE_VERSION=Number(window.UKRAINIAN_COURSE_LOADER?.version)||0;
  const storage=window.localStorage;
  const now=()=>new Date().toISOString();
  const clone=x=>JSON.parse(JSON.stringify(x));
  function stable(x){if(Array.isArray(x))return '['+x.map(stable).join(',')+']';if(x&&typeof x==='object'){return '{'+Object.keys(x).sort().map(k=>JSON.stringify(k)+':'+stable(x[k])).join(',')+'}'}return JSON.stringify(x)}
  function checksum(x){let h=2166136261;for(const ch of stable(x)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return (h>>>0).toString(16).padStart(8,'0')}
  function makeId(){if(window.crypto?.randomUUID)return window.crypto.randomUUID();return 'dev-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,10)}
  function deviceId(){let id='';try{id=storage.getItem(DEVICE_KEY)||'';if(!id){id=makeId();storage.setItem(DEVICE_KEY,id)}}catch{id=makeId()}return id}
  const LOCAL_DEVICE=deviceId();
  function ensureMeta(){
    if(!s.syncMeta||typeof s.syncMeta!=='object')s.syncMeta={schema:1,revision:0,updatedAt:'',lastDeviceId:'',lastImportAt:'',importedFrom:''};
    const m=s.syncMeta;m.schema=1;m.revision=Math.max(0,Number(m.revision)||0);m.updatedAt=String(m.updatedAt||'');m.lastDeviceId=String(m.lastDeviceId||'');m.lastImportAt=String(m.lastImportAt||'');m.importedFrom=String(m.importedFrom||'');return m
  }
  function summary(state=s){const lp=state?.lessonProgress&&typeof state.lessonProgress==='object'?state.lessonProgress:{};return {day:Math.max(0,Number(state?.day)||0),completed:Object.values(lp).filter(x=>x&&x.testPassed&&x.spoken&&x.reviewDone).length,known:Object.keys(state?.known||{}).length,studyDays:new Set(Array.isArray(state?.dates)?state.dates:[]).size,revision:Math.max(0,Number(state?.syncMeta?.revision)||0),updatedAt:String(state?.syncMeta?.updatedAt||'')}}
  function makeEnvelope(state=s,reason='handoff'){
    const progress=clone(state),meta=progress.syncMeta||{};
    const envelope={format:FORMAT,schema:1,courseVersion:COURSE_VERSION,exportedAt:now(),reason,sourceDeviceId:LOCAL_DEVICE,summary:summary(progress),progress};
    envelope.checksum=checksum(progress);return envelope
  }
  function readRecovery(){try{const x=JSON.parse(storage.getItem(RECOVERY_KEY)||'[]');return Array.isArray(x)?x:[]}catch{return []}}
  function storeRecovery(reason,state=s){try{const list=readRecovery();list.unshift(makeEnvelope(state,reason));while(list.length>MAX_RECOVERY)list.pop();let raw=JSON.stringify(list);while(raw.length>1500000&&list.length>1){list.pop();raw=JSON.stringify(list)}storage.setItem(RECOVERY_KEY,raw);return true}catch{return false}}
  const baseSave=save;let internalSave=false;
  save=function(){if(!internalSave){const m=ensureMeta();m.revision++;m.updatedAt=now();m.lastDeviceId=LOCAL_DEVICE}return baseSave()};
  function parsePackage(raw){
    const x=typeof raw==='string'?JSON.parse(raw):raw;if(!x||typeof x!=='object')throw new Error('invalid');
    if(x.format===FORMAT){if(!x.progress||typeof x.progress!=='object')throw new Error('missing-progress');if(x.checksum!==checksum(x.progress))throw new Error('checksum');if(Number(x.courseVersion)>COURSE_VERSION)throw new Error('future-version');return {progress:x.progress,envelope:x,legacy:false}}
    if(x.known&&x.lessonProgress&&Object.prototype.hasOwnProperty.call(x,'day'))return {progress:x,envelope:{courseVersion:0,sourceDeviceId:'legacy',exportedAt:'',summary:summary(x)},legacy:true};
    throw new Error('invalid');
  }
  function looksOlder(incoming,local){
    const it=Date.parse(incoming.updatedAt||''),lt=Date.parse(local.updatedAt||'');if(Number.isFinite(it)&&Number.isFinite(lt)&&it<lt&&incoming.day<=local.day&&incoming.completed<=local.completed)return true;
    return incoming.day<local.day&&incoming.completed<=local.completed&&incoming.known<=local.known&&incoming.studyDays<=local.studyDays
  }
  function describe(x){const d=x.updatedAt?new Date(x.updatedAt).toLocaleString('de-DE'):'ohne Zeitstempel';return `Tag ${x.day+1} · ${x.completed} fertige Lektionen · ${x.known} Karten · ${x.studyDays} Lerntage · ${d}`}
  function applyProgress(parsed){
    const incoming=summary(parsed.progress),local=summary(s);
    if(looksOlder(incoming,local)){const ok=window.confirm?.('Diese Sicherung wirkt älter als der Lernstand auf diesem Gerät.\n\nHier: '+describe(local)+'\nSicherung: '+describe(incoming)+'\n\nTrotzdem ersetzen?');if(!ok)return false}
    else{const ok=window.confirm?.('Lernstand auf diesem Gerät durch diese Sicherung ersetzen?\n\nHier: '+describe(local)+'\nSicherung: '+describe(incoming)+'\n\nVorher wird automatisch ein lokaler Rettungspunkt angelegt.');if(!ok)return false}
    storeRecovery('vor-import',s);
    const oldRevision=Math.max(local.revision,incoming.revision);s=normal(clone(parsed.progress));s.day=Math.max(0,Math.min(D.length-1,Number(s.day)||0));syncLessons();const m=ensureMeta();m.revision=oldRevision+1;m.updatedAt=now();m.lastDeviceId=LOCAL_DEVICE;m.lastImportAt=m.updatedAt;m.importedFrom=String(parsed.envelope?.sourceDeviceId||'unbekannt');internalSave=true;try{baseSave()}finally{internalSave=false}render();stats();renderContinuity();toast(parsed.legacy?'Alte Sicherung sicher übernommen.':'Lernstand vom anderen Gerät übernommen.');return true
  }
  async function importFile(file){try{const text=typeof file.text==='function'?await file.text():await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(String(r.result||''));r.onerror=reject;r.readAsText(file)});return applyProgress(parsePackage(text))}catch(e){const msg=e?.message==='checksum'?'Die Sicherung ist beschädigt oder unvollständig.':e?.message==='future-version'?'Diese Sicherung stammt aus einer neueren Kursversion. Öffne zuerst die aktuelle App.':'Das ist keine gültige Lernstand-Sicherung.';toast(msg);return false}}
  function downloadEnvelope(env){const text=JSON.stringify(env,null,2),blob=new Blob([text],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='ukrainisch-geraetewechsel-'+date()+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500)}
  async function exportHandoff(){save();const env=makeEnvelope(s,'geraetewechsel'),text=JSON.stringify(env,null,2);try{if(typeof File==='function'&&window.navigator?.share){const f=new File([text],'ukrainisch-geraetewechsel-'+date()+'.json',{type:'application/json'});if(!window.navigator.canShare||window.navigator.canShare({files:[f]})){await window.navigator.share({title:'Ukrainisch-Lernstand',text:'Lernstand für den Gerätewechsel',files:[f]});toast('Lernstand zum Teilen vorbereitet.');return}}}catch(e){if(e?.name==='AbortError')return}downloadEnvelope(env);toast('Gerätewechsel-Datei wurde erstellt.')}
  function restoreLatest(){const list=readRecovery();if(!list.length){toast('Noch kein lokaler Rettungspunkt vorhanden.');return}applyProgress(parsePackage(list[0]))}
  async function requestPersistence(){try{if(!window.navigator?.storage?.persist){toast('Dieser Browser bietet keinen extra Speicherschutz.');return}const ok=await window.navigator.storage.persist();toast(ok?'Lokaler Speicher wurde als dauerhaft angefragt.':'Browser entscheidet weiter selbst über lokalen Speicher.')}catch{toast('Speicherschutz konnte nicht angefragt werden.')}}
  function renderContinuity(){
    const progressView=document.getElementById('progress');if(!progressView)return;let box=document.getElementById('deviceContinuity');if(!box){box=document.createElement('article');box.id='deviceContinuity';box.className='card';progressView.append(box)}const sm=summary(s),backups=readRecovery();
    box.innerHTML='<div class="dc-head"><div><div class="label">Gerätewechsel</div><h2>Laptop ↔ iPhone ohne Lernstand-Verlust</h2></div><div class="pill">lokal + Übergabe</div></div><p class="small">Der Browser speichert Fortschritt nur auf dem jeweiligen Gerät. Deshalb gibt es hier ein geprüftes Übergabepaket mit Versions- und Prüfsummencheck. Vor jedem Import oder Zurücksetzen entsteht zusätzlich ein lokaler Rettungspunkt.</p><div class="dc-state"><strong>Dieser Stand</strong><span>'+describe(sm)+'</span></div><div class="actions"><button class="primary" id="dcExport">Gerätewechsel-Datei erstellen</button><label class="secondary" style="cursor:pointer">Datei vom anderen Gerät laden<input id="dcImport" type="file" accept="application/json,.json" class="sr"></label><button class="secondary" id="dcRestore">Letzten Rettungspunkt laden</button><button class="ghost" id="dcPersist">Lokalen Speicher schützen</button></div><p class="small">'+backups.length+' lokale Rettungspunkt'+(backups.length===1?'':'e')+' vorhanden. Für echten automatischen Cloud-Sync wäre ein Konto/Backend nötig; das wird hier bewusst nicht vorgetäuscht.</p>';
    box.querySelector('#dcExport').onclick=exportHandoff;box.querySelector('#dcImport').onchange=e=>{const f=e.target.files?.[0];if(f)importFile(f);e.target.value=''};box.querySelector('#dcRestore').onclick=restoreLatest;box.querySelector('#dcPersist').onclick=requestPersistence
  }
  const css=document.createElement('style');css.textContent='.dc-head{display:flex;justify-content:space-between;gap:12px}.dc-state{padding:11px 12px;border-radius:13px;background:#f1f7ff;margin:12px 0}.dc-state strong,.dc-state span{display:block}.dc-state span{font-size:.8rem;color:#526b87;margin-top:3px}@media(max-width:540px){.dc-head{display:block}.dc-head .pill{display:inline-block;margin-top:8px}}';document.head.append(css);
  const exportBtn=document.getElementById('export');if(exportBtn){exportBtn.textContent='Gerätewechsel / Backup';exportBtn.onclick=exportHandoff}
  const importInput=document.getElementById('import');if(importInput)importInput.onchange=e=>{const f=e.target.files?.[0];if(f)importFile(f);e.target.value=''};
  for(const id of ['reset','resetProgress']){const btn=document.getElementById(id);if(btn)btn.onclick=()=>{storeRecovery('vor-reset',s);resetProgress();renderContinuity()}}
  const originalSettingsText=document.querySelector('#settings p.small');if(originalSettingsText)originalSettingsText.textContent='Fortschritt bleibt lokal auf diesem Gerät. Für Laptop ↔ iPhone nutzt du unter Fortschritt die sichere Gerätewechsel-Datei.';
  window.addEventListener?.('storage',e=>{if(e.key===KEY&&e.newValue){try{const other=normal(JSON.parse(e.newValue)),a=summary(other),b=summary(s);if(Date.parse(a.updatedAt||'')>Date.parse(b.updatedAt||''))toast('Ein anderer Tab hat einen neueren lokalen Lernstand gespeichert.')}catch{}}});
  const m=ensureMeta();if(!m.updatedAt){m.updatedAt=now();m.lastDeviceId=LOCAL_DEVICE;internalSave=true;try{baseSave()}finally{internalSave=false}}
  window.UKRAINIAN_DEVICE_CONTINUITY={version:VERSION,format:FORMAT,manualHandoff:true,automaticCloudSync:false,checksum:true,recoveryBeforeImport:true,recoveryBeforeReset:true,olderSnapshotGuard:true,courseVersionGuard:true,deviceId:LOCAL_DEVICE,summary,makeEnvelope,parsePackage,looksOlder,storeRecovery,applyProgress};
  renderContinuity();
})();