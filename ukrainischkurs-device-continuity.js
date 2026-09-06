/* Ukrainischkurs für Joel · Device Continuity v2
   Sicherer Gerätewechsel für die statische GitHub-Pages-App.
   Kein vorgetäuschter Cloud-Sync: Fortschritt bleibt lokal. Zusätzlich zu geprüften
   Dateien kann v2 einen komprimierten Schnelltransfer-Link im URL-Fragment erzeugen.
   Das Fragment wird nicht an GitHub Pages gesendet. Vor Import/Reset entstehen lokale
   Rettungspunkte; ältere Sicherungen werden nicht still über neueren Stand gelegt. */
(()=>{
  const VERSION=2,FORMAT='ukrainischkurs-handoff-v1',QUICK_PREFIX='UKR-H1.',DEVICE_KEY='ukrainischkurs-device-id-v1',RECOVERY_KEY='ukrainischkurs-recovery-v1',MAX_RECOVERY=3,MAX_LINK_LENGTH=60000;
  const COURSE_VERSION=Number(window.UKRAINIAN_COURSE_LOADER?.version)||0;
  const storage=window.localStorage;
  const now=()=>new Date().toISOString();
  const clone=x=>JSON.parse(JSON.stringify(x));
  function stable(x){if(Array.isArray(x))return '['+x.map(stable).join(',')+']';if(x&&typeof x==='object')return '{'+Object.keys(x).sort().map(k=>JSON.stringify(k)+':'+stable(x[k])).join(',')+'}';return JSON.stringify(x)}
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
    const progress=clone(state);const envelope={format:FORMAT,schema:1,courseVersion:COURSE_VERSION,exportedAt:now(),reason,sourceDeviceId:LOCAL_DEVICE,summary:summary(progress),progress};
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
    throw new Error('invalid')
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
  function bytesToB64url(bytes){let bin='';for(let i=0;i<bytes.length;i+=32768)bin+=String.fromCharCode(...bytes.subarray(i,i+32768));return btoa(bin).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
  function b64urlToBytes(text){const b64=text.replace(/-/g,'+').replace(/_/g,'/')+'==='.slice((text.length+3)%4);const bin=atob(b64),out=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)out[i]=bin.charCodeAt(i);return out}
  async function packText(text){const bytes=new TextEncoder().encode(text);if('CompressionStream'in window){const stream=new Blob([bytes]).stream().pipeThrough(new CompressionStream('gzip'));const packed=new Uint8Array(await new Response(stream).arrayBuffer());return 'G.'+bytesToB64url(packed)}return 'P.'+bytesToB64url(bytes)}
  async function unpackText(packed){const mode=packed.slice(0,2),bytes=b64urlToBytes(packed.slice(2));if(mode==='G.'){if(!('DecompressionStream'in window))throw new Error('compression-unsupported');const stream=new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));return new TextDecoder().decode(await new Response(stream).arrayBuffer())}if(mode==='P.')return new TextDecoder().decode(bytes);throw new Error('quick-format')}
  async function makeQuickCode(state=s){const env=makeEnvelope(state,'schnelltransfer');return QUICK_PREFIX+await packText(JSON.stringify(env))}
  function extractQuickCode(raw){const value=String(raw||'').trim();if(value.startsWith(QUICK_PREFIX))return value;try{const u=new URL(value);const p=new URLSearchParams(u.hash.replace(/^#/,''));const code=p.get('handoff');if(code)return code}catch{}throw new Error('quick-format')}
  async function parseQuickCode(raw){const code=extractQuickCode(raw);if(!code.startsWith(QUICK_PREFIX))throw new Error('quick-format');const text=await unpackText(code.slice(QUICK_PREFIX.length));return parsePackage(text)}
  function baseUrl(){const u=new URL(window.location.href);u.hash='';return u.toString()}
  async function makeHandoffLink(state=s){const code=await makeQuickCode(state);return baseUrl()+'#handoff='+encodeURIComponent(code)}
  function downloadEnvelope(env){const text=JSON.stringify(env,null,2),blob=new Blob([text],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='ukrainisch-geraetewechsel-'+date()+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500)}
  async function copyText(text){if(window.navigator?.clipboard?.writeText){await window.navigator.clipboard.writeText(text);return true}const ta=document.createElement('textarea');ta.value=text;ta.setAttribute('readonly','');ta.style.position='fixed';ta.style.opacity='0';document.body.append(ta);ta.select();const ok=document.execCommand?.('copy');ta.remove();return !!ok}
  async function exportHandoff(){save();const env=makeEnvelope(s,'geraetewechsel'),text=JSON.stringify(env,null,2);try{if(typeof File==='function'&&window.navigator?.share){const f=new File([text],'ukrainisch-geraetewechsel-'+date()+'.json',{type:'application/json'});if(!window.navigator.canShare||window.navigator.canShare({files:[f]})){await window.navigator.share({title:'Ukrainisch-Lernstand',text:'Lernstand für den Gerätewechsel',files:[f]});toast('Lernstand zum Teilen vorbereitet.');return}}}catch(e){if(e?.name==='AbortError')return}downloadEnvelope(env);toast('Gerätewechsel-Datei wurde erstellt.')}
  async function quickHandoff(){
    save();try{const link=await makeHandoffLink(s);if(link.length>MAX_LINK_LENGTH){downloadEnvelope(makeEnvelope(s,'geraetewechsel'));toast('Der Lernstand ist für einen sicheren Link zu groß – Datei wurde erstellt.');return}
      if(window.navigator?.share){try{await window.navigator.share({title:'Ukrainisch-Lernstand',text:'Öffne diesen Link auf deinem anderen Gerät. Der Lernstand steckt nur im URL-Fragment.',url:link});toast('Gerätewechsel-Link geteilt.');return}catch(e){if(e?.name==='AbortError')return}}
      if(await copyText(link)){toast('Gerätewechsel-Link kopiert. Öffne ihn auf dem anderen Gerät.');return}throw new Error('copy')
    }catch{downloadEnvelope(makeEnvelope(s,'geraetewechsel'));toast('Schnelltransfer nicht verfügbar – Sicherungsdatei wurde erstellt.')}
  }
  async function importQuick(raw){try{return applyProgress(await parseQuickCode(raw))}catch(e){const msg=e?.message==='checksum'?'Der Schnelltransfer ist beschädigt.':e?.message==='future-version'?'Der andere Lernstand stammt aus einer neueren Kursversion. Öffne zuerst die aktuelle App.':e?.message==='compression-unsupported'?'Dieses Gerät kann den komprimierten Schnelltransfer nicht lesen. Nutze stattdessen die Datei.':'Kein gültiger Gerätewechsel-Link oder Schnelltransfer-Code.';toast(msg);return false}}
  async function consumeHashHandoff(){const hash=String(window.location?.hash||'');if(!hash.startsWith('#handoff='))return false;let code='';try{code=decodeURIComponent(hash.slice('#handoff='.length))}catch{code=hash.slice('#handoff='.length)}try{window.history?.replaceState?.(null,'',String(window.location.pathname||'')+String(window.location.search||''))}catch{}if(!code)return false;setTimeout(()=>importQuick(code),0);return true}
  function restoreLatest(){const list=readRecovery();if(!list.length){toast('Noch kein lokaler Rettungspunkt vorhanden.');return}applyProgress(parsePackage(list[0]))}
  async function requestPersistence(){try{if(!window.navigator?.storage?.persist){toast('Dieser Browser bietet keinen extra Speicherschutz.');return}const ok=await window.navigator.storage.persist();toast(ok?'Lokaler Speicher wurde als dauerhaft angefragt.':'Browser entscheidet weiter selbst über lokalen Speicher.')}catch{toast('Speicherschutz konnte nicht angefragt werden.')}}
  function renderContinuity(){
    const progressView=document.getElementById('progress');if(!progressView)return;let box=document.getElementById('deviceContinuity');if(!box){box=document.createElement('article');box.id='deviceContinuity';box.className='card';progressView.append(box)}const sm=summary(s),backups=readRecovery();
    box.innerHTML='<div class="dc-head"><div><div class="label">Gerätewechsel</div><h2>Laptop ↔ iPhone</h2></div><div class="pill">Schnelltransfer</div></div><p class="small">Am schnellsten: Erzeuge einen Gerätewechsel-Link und öffne ihn auf dem anderen Gerät. Der Lernstand liegt im URL-Fragment und wird nicht an GitHub Pages übertragen. Vor dem Übernehmen prüft die App Version, Prüfsumme und ob der Zielstand möglicherweise neuer ist.</p><div class="dc-state"><strong>Dieser Stand</strong><span>'+describe(sm)+'</span></div><div class="actions"><button class="primary" id="dcQuick">Link für anderes Gerät</button><button class="secondary" id="dcExport">Datei als Backup</button><label class="secondary" style="cursor:pointer">Backup-Datei laden<input id="dcImport" type="file" accept="application/json,.json" class="sr"></label></div><div class="dc-code"><label for="dcCode"><strong>Link oder Schnelltransfer-Code einfügen</strong></label><textarea id="dcCode" rows="3" placeholder="Hier den Link/Code vom anderen Gerät einfügen"></textarea><div class="actions"><button class="secondary" id="dcCodeImport">Schnelltransfer übernehmen</button><button class="secondary" id="dcRestore">Letzten Rettungspunkt laden</button><button class="ghost" id="dcPersist">Lokalen Speicher schützen</button></div></div><p class="small">'+backups.length+' lokale Rettungspunkt'+(backups.length===1?'':'e')+' vorhanden. Der Link kann persönliche Lernwörter enthalten – nur an dich selbst senden. Vollautomatischer Cloud-Sync bleibt ohne Konto/Backend bewusst deaktiviert.</p>';
    box.querySelector('#dcQuick').onclick=quickHandoff;box.querySelector('#dcExport').onclick=exportHandoff;box.querySelector('#dcImport').onchange=e=>{const f=e.target.files?.[0];if(f)importFile(f);e.target.value=''};box.querySelector('#dcCodeImport').onclick=()=>importQuick(box.querySelector('#dcCode').value);box.querySelector('#dcRestore').onclick=restoreLatest;box.querySelector('#dcPersist').onclick=requestPersistence
  }
  const css=document.createElement('style');css.textContent='.dc-head{display:flex;justify-content:space-between;gap:12px}.dc-state{padding:11px 12px;border-radius:13px;background:#f1f7ff;margin:12px 0}.dc-state strong,.dc-state span{display:block}.dc-state span{font-size:.8rem;color:#526b87;margin-top:3px}.dc-code{margin-top:14px;padding-top:13px;border-top:1px solid #dce7f5}.dc-code textarea{width:100%;margin-top:7px;border:1px solid #bfd8f3;border-radius:12px;padding:10px;color:#15243b;background:#fff;resize:vertical;font:inherit;font-size:.84rem}@media(max-width:540px){.dc-head{display:block}.dc-head .pill{display:inline-block;margin-top:8px}}';document.head.append(css);
  const exportBtn=document.getElementById('export');if(exportBtn){exportBtn.textContent='Gerätewechsel / Backup';exportBtn.onclick=quickHandoff}
  const importInput=document.getElementById('import');if(importInput)importInput.onchange=e=>{const f=e.target.files?.[0];if(f)importFile(f);e.target.value=''};
  for(const id of ['reset','resetProgress']){const btn=document.getElementById(id);if(btn)btn.onclick=()=>{storeRecovery('vor-reset',s);resetProgress();renderContinuity()}}
  const originalSettingsText=document.querySelector('#settings p.small');if(originalSettingsText)originalSettingsText.textContent='Fortschritt bleibt lokal. Für Laptop ↔ iPhone kannst du unter Fortschritt einen Schnelltransfer-Link erzeugen oder eine geprüfte Backup-Datei nutzen.';
  window.addEventListener?.('storage',e=>{if(e.key===KEY&&e.newValue){try{const other=normal(JSON.parse(e.newValue)),a=summary(other),b=summary(s);if(Date.parse(a.updatedAt||'')>Date.parse(b.updatedAt||''))toast('Ein anderer Tab hat einen neueren lokalen Lernstand gespeichert.')}catch{}}});
  const m=ensureMeta();if(!m.updatedAt){m.updatedAt=now();m.lastDeviceId=LOCAL_DEVICE;internalSave=true;try{baseSave()}finally{internalSave=false}}
  window.UKRAINIAN_DEVICE_CONTINUITY={version:VERSION,format:FORMAT,quickPrefix:QUICK_PREFIX,manualHandoff:true,automaticCloudSync:false,checksum:true,recoveryBeforeImport:true,recoveryBeforeReset:true,olderSnapshotGuard:true,courseVersionGuard:true,quickHandoff:true,fragmentTransport:true,compressionWhenAvailable:true,noNetworkUpload:true,deviceId:LOCAL_DEVICE,summary,makeEnvelope,parsePackage,looksOlder,storeRecovery,applyProgress,makeQuickCode,parseQuickCode,makeHandoffLink,importQuick};
  renderContinuity();consumeHashHandoff();
})();