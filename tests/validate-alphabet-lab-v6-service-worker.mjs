import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const meta=JSON.parse(fs.readFileSync(new URL('../alphabet-build.json',import.meta.url),'utf8'));
const src=fs.readFileSync(new URL('../alphabet-lab-sw.js',import.meta.url),'utf8');
const stores=new Map();
const cacheApi={
  async open(name){if(!stores.has(name))stores.set(name,new Map());const m=stores.get(name);return {async put(req,res){m.set(String(typeof req==='string'?req:req.url),res.clone())},async match(req){return m.get(String(typeof req==='string'?req:req.url))||null}}},
  async match(req){const key=String(typeof req==='string'?req:req.url);for(const m of stores.values())if(m.has(key))return m.get(key);return null},
  async keys(){return [...stores.keys()]},async delete(k){return stores.delete(k)}
};
let fetchImpl=async()=>{throw new Error('offline')};const listeners={};const self={addEventListener:(n,f)=>listeners[n]=f,skipWaiting:async()=>{},clients:{claim:async()=>{}}};
const sandbox={self,caches:cacheApi,fetch:(...a)=>fetchImpl(...a),Response,Request,URL,location:{origin:'https://example.test'},console};vm.runInNewContext(src,sandbox);
const api=self.__ALPHABET_SW_TEST__;assert.equal(api.BUILD_ID,meta.buildId);assert(api.CACHE.endsWith(meta.buildId));assert(api.CRITICAL.every(x=>x.includes(`v=${meta.buildId}`)),'every critical asset must be generation-pinned');
const old='old-build-123',oldCache=await cacheApi.open(`alphabet-lab-${old}`);await oldCache.put(`https://example.test/alphabet-core.bundle.js?v=${old}`,new Response('OLD',{headers:{'Content-Type':'application/javascript'}}));
fetchImpl=async req=>new Response('NEW',{status:200,headers:{'Content-Type':'application/javascript'}});const reqB=new Request(`https://example.test/alphabet-core.bundle.js?v=${meta.buildId}`);const online=await api.cacheFirstExact(reqB);assert.equal(await online.text(),'NEW','first request for new build must not reuse old generation');
fetchImpl=async()=>{throw new Error('offline')};const cached=await api.cacheFirstExact(reqB);assert.equal(await cached.text(),'NEW','current generation must work offline after caching');
const missing=new Request(`https://example.test/missing.js?v=${meta.buildId}`);const miss=await api.cacheFirstExact(missing);assert.equal(miss.status,503);assert.match(miss.headers.get('content-type')||'',/javascript/i);assert(!/html/i.test(miss.headers.get('content-type')||''));assert.equal(await miss.text(),'');
stores.set(`alphabet-lab-${old}`,new Map([['x',new Response('x')]]));await new Promise((resolve,reject)=>listeners.activate({waitUntil:p=>Promise.resolve(p).then(resolve,reject)}));assert(!(await cacheApi.keys()).includes(`alphabet-lab-${old}`),'activation must delete old alphabet cache generations');
console.log('Alphabet Lab V6.1 service worker generation/offline regression: OK',meta.buildId);
