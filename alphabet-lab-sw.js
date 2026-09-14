const CACHE='alphabet-lab-v6-bundles-1';
const PREFIX='alphabet-lab-';
const CRITICAL=['./alphabet-lab.html','./alphabet-core.bundle.js','./alphabet-app.bundle.js','./ukrainischkurs-native-audio.js','./alphabet-lab.webmanifest'];
const OPTIONAL=['./','./ukrainisch-icon-192.png','./ukrainisch-icon-512.png'];
const CORE=[...CRITICAL,...OPTIONAL];
const isAsset=url=>/\.(?:js|css|webmanifest)$/i.test(url.pathname);
const isImage=url=>/\.(?:png|jpg|jpeg|webp|svg|ico)$/i.test(url.pathname);
const assetMime=url=>url.pathname.endsWith('.js')?'application/javascript; charset=utf-8':url.pathname.endsWith('.css')?'text/css; charset=utf-8':url.pathname.endsWith('.webmanifest')?'application/manifest+json; charset=utf-8':'application/octet-stream';
const unavailable=url=>new Response('',{status:503,statusText:'Offline asset unavailable',headers:{'Content-Type':assetMime(url)}});
async function put(req,res,{allowOpaque=false}={}){if(res&&(res.ok||(allowOpaque&&res.type==='opaque'))){const c=await caches.open(CACHE);await c.put(req,res.clone())}return res}
async function networkFirst(req,fallback){try{return await put(req,await fetch(req))}catch(_){const hit=await caches.match(req);if(hit)return hit;if(fallback){const page=await caches.match(fallback);if(page)return page}return unavailable(new URL(req.url))}}
async function staleWhileRevalidate(req){const hit=await caches.match(req),url=new URL(req.url);const net=fetch(req).then(res=>put(req,res)).catch(()=>null);return hit||await net||unavailable(url)}
async function cacheFirst(req){const hit=await caches.match(req);return hit||networkFirst(req)}
async function cacheCritical(){const cache=await caches.open(CACHE);for(const url of CRITICAL){const res=await fetch(url,{cache:'reload'});if(!res.ok)throw new Error(`critical asset unavailable: ${url}`);await cache.put(url,res)}}
async function cacheOptional(){const cache=await caches.open(CACHE);await Promise.allSettled(OPTIONAL.map(async url=>{const res=await fetch(url,{cache:'reload'});if(res.ok)await cache.put(url,res)}))}
async function cacheExternalAudio(req){const hit=await caches.match(req);if(hit)return hit;try{const res=await fetch(req);await put(req,res,{allowOpaque:true});return res}catch(_){return new Response('',{status:503,statusText:'Audio offline'})}}
self.addEventListener('install',e=>e.waitUntil(cacheCritical().then(cacheOptional).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith(PREFIX)&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;const url=new URL(e.request.url);if(url.origin!==location.origin){if(e.request.destination==='audio'||/\.(?:mp3|ogg|wav)(?:$|\?)/i.test(url.pathname))e.respondWith(cacheExternalAudio(e.request));return}if(e.request.mode==='navigate'){e.respondWith(networkFirst(e.request,'./alphabet-lab.html'));return}if(isAsset(url)){e.respondWith(staleWhileRevalidate(e.request));return}if(isImage(url)){e.respondWith(cacheFirst(e.request));return}e.respondWith(networkFirst(e.request));});
self.__ALPHABET_SW_TEST__={CACHE,PREFIX,CORE,CRITICAL,OPTIONAL,isAsset,isImage,assetMime,networkFirst,staleWhileRevalidate,cacheFirst,cacheCritical,cacheOptional};