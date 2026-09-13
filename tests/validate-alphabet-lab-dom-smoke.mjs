import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const coreFiles=['alphabet-core-v3-data.js','alphabet-core-v3-model.js','alphabet-core-v3-exam.js','alphabet-core-v2.js'];
const appFiles=['alphabet-app-v3-shell.js','alphabet-app-v3-exam.js','alphabet-app-v3-ui.js','alphabet-app-v2.js'];
const coreSrc=coreFiles.map(f=>fs.readFileSync(new URL('../'+f,import.meta.url),'utf8')).join('\n');
const appSrc=appFiles.map(f=>fs.readFileSync(new URL('../'+f,import.meta.url),'utf8')).join('\n');
class ClassList{constructor(){this.s=new Set()}add(...x){x.forEach(v=>this.s.add(v))}remove(...x){x.forEach(v=>this.s.delete(v))}contains(x){return this.s.has(x)}}
class El{
  constructor(doc,attrs={}){this.doc=doc;this.id=attrs.id||'';this.dataset=attrs.dataset||{};this.disabled=!!attrs.disabled;this.textContent='';this.hidden=false;this.className='';this.classList=new ClassList();this.onclick=null;this.children=[];this.style={};this._innerHTML=''}
  set innerHTML(v){this._innerHTML=String(v);for(const m of this._innerHTML.matchAll(/<([a-z]+)([^>]*)>/gi)){const attrs=m[2]||'',id=(attrs.match(/\bid="([^"]+)"/)||[])[1]||'';if(id&&!this.doc.byId.has(id))this.doc.byId.set(id,new El(this.doc,{id}))}}
  get innerHTML(){return this._innerHTML}
  focus(){this.doc.activeElement=this}
  click(){if(!this.disabled&&typeof this.onclick==='function')this.onclick({currentTarget:this,preventDefault(){}})}
  setAttribute(){}
  addEventListener(type,fn){if(type==='click')this.onclick=fn}
  append(x){this.children.push(x)} appendChild(x){this.children.push(x)}
  querySelector(sel){return this.children.find(x=>sel==='button'||x.id===sel.replace('#',''))||null}
  querySelectorAll(){return []}
  remove(){} insertAdjacentElement(){} getContext(){return null}
  getBoundingClientRect(){return{left:0,top:0,width:760,height:760}}
}
class AppEl extends El{
  constructor(doc){super(doc,{id:'app'});this.nodes=[]}
  set innerHTML(v){this._innerHTML=String(v);this.nodes=[];this.doc.byId=new Map([['app',this]]);const tagRe=/<([a-z]+)([^>]*)>/gi;let m;while((m=tagRe.exec(this._innerHTML))){const attrs=m[2]||'',id=(attrs.match(/\bid="([^"]+)"/)||[])[1]||'',dataset={};for(const dm of attrs.matchAll(/\bdata-([a-z0-9-]+)="([^"]*)"/gi))dataset[dm[1].replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]=dm[2];const el=new El(this.doc,{id,dataset,disabled:/\bdisabled\b/.test(attrs)});el.tag=m[1].toLowerCase();this.nodes.push(el);if(id)this.doc.byId.set(id,el)}}
  get innerHTML(){return this._innerHTML}
  querySelectorAll(sel){if(sel==='[data-ans]')return this.nodes.filter(x=>'ans'in x.dataset);if(sel==='[data-nav]')return this.nodes.filter(x=>'nav'in x.dataset);if(sel==='[data-start]')return this.nodes.filter(x=>'start'in x.dataset);if(sel==='[data-letter]')return this.nodes.filter(x=>'letter'in x.dataset);if(sel==='[data-pair]')return this.nodes.filter(x=>'pair'in x.dataset);return []}
}
class Doc{constructor(){this.byId=new Map();this.activeElement=null;this.visibilityState='visible';this.listeners={};this.body=new El(this);this.head=new El(this);this.app=new AppEl(this);this.byId.set('app',this.app)}getElementById(id){return this.byId.get(id)||null}createElement(){return new El(this)}addEventListener(n,fn){this.listeners[n]=fn}querySelectorAll(){return []}}
const document=new Doc(),store=new Map();
const localStorage={getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,String(v)),removeItem:k=>store.delete(k)};
const timers=[];const setTimeout=(fn)=>{timers.push(fn);return timers.length};const clearTimeout=()=>{};const runTimer=()=>{const fn=timers.shift();if(fn)fn()};
let perf=0;const performance={now:()=>perf+=700};
const window={document,localStorage,structuredClone:global.structuredClone,confirm:()=>true,speechSynthesis:null,UKRAINIAN_PRONUNCIATION_AUDIO:{},addEventListener(){}};window.window=window;
const math=Object.create(Math);let r=1;math.random=()=>((r=r*48271%2147483647)/2147483647);
const sandbox={window,document,localStorage,structuredClone:global.structuredClone,confirm:()=>true,performance,setTimeout,clearTimeout,Math:math,Date,console,Audio:function(){},SpeechSynthesisUtterance:function(){},globalThis:null};sandbox.globalThis=sandbox;
vm.runInNewContext(coreSrc,sandbox);window.AlphabetCoreV2=sandbox.AlphabetCoreV2;vm.runInNewContext(appSrc,sandbox);
assert(document.app.innerHTML.includes('50-Fragen-Startdiagnose'));
assert(document.app.innerHTML.includes('LERNPRÜFUNG STARTEN'));
window.AlphabetLab.startExam('fake','learning');
assert(document.app.innerHTML.includes('Hauptfrage'));
function targetLetter(){const m=document.app.innerHTML.match(/<div class="big-letter">([^<]+)<\/div>/);if(m)return m[1];const p=document.app.innerHTML.match(/<div class="pair">([^<]+)/);return p?p[1].trim().split(/\s/)[0]:''}
function clickWrong(){const C=window.AlphabetCoreV2,letter=targetLetter(),buttons=document.app.querySelectorAll('[data-ans]').filter(b=>!b.disabled);assert(buttons.length);const correctSound=C.DATA[letter]?.sound;const b=buttons.find(x=>x.dataset.ans!==letter&&x.dataset.ans!==correctSound)||buttons[0];b.click();runTimer()}
clickWrong();let sawRepair=false;for(let i=0;i<9&&!sawRepair;i++){if(document.app.innerHTML.includes('· Reparatur')){sawRepair=true;break}clickWrong()}
assert(sawRepair,'repair should appear after delayed main questions');
const persisted=JSON.parse(store.get('uk-alpha-lab-v3'));assert(persisted.answerLog.some(x=>x.isRepair===false));assert(persisted.answerLog.some(x=>x.correct===false));
console.log('Alphabet Lab lightweight DOM smoke: OK');
