'use strict';
const BUILD_ID='a611e9bd71f3';
const APP_VERSION='6.1.0';
const CACHE=`alphabet-lab-${BUILD_ID}`;
const PREFIX='alphabet-lab-';
const V=`?v=${BUILD_ID}`;
const FALLBACK_HTML=`./alphabet-lab.html${V}`;
const CRITICAL=[FALLBACK_HTML,`./alphabet-core.bundle.js${V}`,`./alphabet-app.bundle.js${V}`,`./ukrainischkurs-native-audio.js${V}`,`./alphabet-lab.webmanifest${V}`,`./alphabet-build.json${V}`];
const OPTIONAL=[`./index.html${V}`,`./ukrainisch-icon-192.png${V}`,`./ukrainisch-icon-512.png${V}`,`./ukrainisch-icon-apple-180.png${V}`,`./ukrainisch-icon-maskable-512.png${V}`];
const CORE=[...CRITICAL,...OPTIONAL];
const isCodeAsset=url=>/\.(?:js|css|webmanifest|json)$/i.test(url.pathname);
const isImage=url=>/\.(?:png|jpg|jpeg|webp|svg|ico)$/i.test(url.pathname);
const assetMime=url=>url.pathname.endsWith('.js')?'application/javascript; charset=utf-8':url.pathname.endsWith('.css')?'text/css; charset=utf-8':url.pathname.endsWith('.webmanifest')?'application/manifest+json; charset=utf-8':url.pathname.endsWith('.json')?'application/json; charset=utf-8':'application/octet-stream';
const unavailable=url=>new Response('',{status:503,statusText:'Offline asset unavailable',headers:{'Content-Type':assetMime(url),'X-Alphabet-Build':BUILD_ID}});
async function currentCache(){return caches.open(CACHE)}
async function putExact(req,res,{allowOpaque=false}={}){if(res&&(res.ok||(allowOpaque&&res.type==='opaque'))){const c=await currentCache();await c.put(req,res.clone())}return res}
async function networkFirstExact(req){const url=new URL(req.url);try{return await putExact(req,await fetch(req))}catch(_){const hit=await caches.match(req);return hit||unavailable(url)}}
async function cacheFirstExact(req){const url=new URL(req.url),hit=await caches.match(req);if(hit)return hit;try{return await putExact(req,await fetch(req))}catch(_){return unavailable(url)}}
async function navigation(req){try{return await fetch(req)}catch(_){const hit=await caches.match(FALLBACK_HTML);return hit||new Response('Alphabet Lab offline shell unavailable',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8','X-Alphabet-Build':BUILD_ID}})}}
async function cacheCritical(){const cache=await currentCache();for(const url of CRITICAL){const res=await fetch(url,{cache:'reload'});if(!res.ok)throw new Error(`critical asset unavailable: ${url}`);await cache.put(url,res)}}
async function cacheOptional(){const cache=await currentCache();await Promise.allSettled(OPTIONAL.map(async url=>{const res=await fetch(url,{cache:'reload'});if(res.ok)await cache.put(url,res)}))}
async function cacheExternalAudio(req){const hit=await caches.match(req);if(hit)return hit;try{const res=await fetch(req);await putExact(req,res,{allowOpaque:true});return res}catch(_){return new Response('',{status:503,statusText:'Audio offline'})}}
self.addEventListener('install',e=>e.waitUntil(cacheCritical().then(cacheOptional).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith(PREFIX)&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('message',e=>{if(e.data?.type==='ALPHABET_BUILD_ID')e.source?.postMessage?.({type:'ALPHABET_BUILD_ID',buildId:BUILD_ID,appVersion:APP_VERSION})});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;const url=new URL(e.request.url);if(url.origin!==location.origin){if(e.request.destination==='audio'||/\.(?:mp3|ogg|wav)(?:$|\?)/i.test(url.pathname))e.respondWith(cacheExternalAudio(e.request));return}if(e.request.mode==='navigate'){e.respondWith(navigation(e.request));return}const versioned=url.searchParams.get('v')===BUILD_ID;if(isCodeAsset(url)){e.respondWith(versioned?cacheFirstExact(e.request):networkFirstExact(e.request));return}if(isImage(url)){e.respondWith(versioned?cacheFirstExact(e.request):networkFirstExact(e.request));return}e.respondWith(networkFirstExact(e.request))});
self.__ALPHABET_BUILD_ID=BUILD_ID;
self.__ALPHABET_SW_TEST__={BUILD_ID,APP_VERSION,CACHE,PREFIX,CORE,CRITICAL,OPTIONAL,FALLBACK_HTML,isCodeAsset,isImage,assetMime,networkFirstExact,cacheFirstExact,navigation,cacheCritical,cacheOptional};
