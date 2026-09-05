const VERSION='40';
const CACHE=`ukrainischkurs-joel-v${VERSION}`;
const ASSETS=[
  './','./index.html','./ukrainischkurs-app.html','./ukrainisch-lernen.html','./ukrainisch-lernen.webmanifest',
  './ukrainisch-icon-180.png','./ukrainisch-icon-192.png','./ukrainisch-icon-512.png','./ukrainisch-lernen-icon.svg',
  './ukrainischkurs-v2-loader.js','./ukrainischkurs-v2-core.js',
  './ukrainischkurs-native-audio.js','./ukrainischkurs-pronunciation.js','./ukrainischkurs-pronunciation-mastery.js','./ukrainischkurs-quality-hardening.js',
  './ukrainischkurs-adaptive-alphabet.js','./ukrainischkurs-alphabet-proof.js','./ukrainischkurs-reading-bridge.js','./ukrainischkurs-reading-transfer.js',
  './ukrainischkurs-adaptive-srs.js','./ukrainischkurs-learning-core.js','./ukrainischkurs-foundation-expansion.js','./ukrainischkurs-a1-expansion-2.js','./ukrainischkurs-a1-grammar-bridge.js','./ukrainischkurs-time-bridge.js','./ukrainischkurs-genitive-bridge.js','./ukrainischkurs-word-stress.js','./ukrainischkurs-human-sentence-audio.js','./ukrainischkurs-human-listening.js','./ukrainischkurs-speaking-bridge.js','./ukrainischkurs-immersion-transfer.js','./ukrainischkurs-open-dialogue.js','./ukrainischkurs-conversation-chain.js','./ukrainischkurs-free-reading-transfer.js','./ukrainischkurs-comprehension-lab.js','./ukrainischkurs-active-production.js',
  './ukrainischkurs-grammar-spiral.js','./ukrainischkurs-story-lab.js','./ukrainischkurs-dictation.js','./ukrainischkurs-adaptive-review.js','./ukrainischkurs-a1-cando.js','./ukrainischkurs-uk-keyboard.js','./ukrainischkurs-dynamic-course-ui.js','./ukrainischkurs-skill-profile.js','./ukrainischkurs-selftest.js'
];
const offlineAsset=()=>new Response('Offline-Asset nicht verfügbar',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}});
const offlineApp=()=>new Response('App offline nicht verfügbar',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}});
const canonicalRequest=url=>new Request(url.origin+url.pathname,{method:'GET',credentials:'same-origin'});

self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));

async function remember(request,response,canonical){
  if(!response||!response.ok)return response;
  const cache=await caches.open(CACHE);
  await cache.put(request,response.clone());
  if(canonical&&canonical.url!==request.url)await cache.put(canonical,response.clone());
  return response;
}
async function navigationResponse(request,url){
  const canonical=canonicalRequest(url);
  try{return await remember(request,await fetch(request),canonical)}catch{
    const cache=await caches.open(CACHE);
    return (await cache.match(request))||(await cache.match(canonical))||(await cache.match('./ukrainischkurs-app.html'))||offlineApp();
  }
}
async function freshAssetResponse(request,url){
  const canonical=canonicalRequest(url);
  try{return await remember(request,await fetch(request),canonical)}catch{
    const cache=await caches.open(CACHE);
    return (await cache.match(request))||(await cache.match(canonical))||offlineAsset();
  }
}
async function versionedResponse(request,url){
  const requestedVersion=url.searchParams.get('v'),canonical=canonicalRequest(url);
  try{return await remember(request,await fetch(request),canonical)}catch{
    if(requestedVersion&&requestedVersion!==VERSION)return offlineAsset();
    const cache=await caches.open(CACHE);
    return (await cache.match(request))||(await cache.match(canonical))||offlineAsset();
  }
}
async function assetResponse(request,url){
  const canonical=canonicalRequest(url),cache=await caches.open(CACHE);
  const cached=(await cache.match(request))||(await cache.match(canonical));if(cached)return cached;
  try{return await remember(request,await fetch(request),canonical)}catch{return offlineAsset()}
}
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);if(url.origin!==location.origin)return;
  const stableLoader=url.pathname.endsWith('/ukrainischkurs-v2-loader.js')&&!url.searchParams.has('v');
  if(event.request.mode==='navigate'||event.request.destination==='document')event.respondWith(navigationResponse(event.request,url));
  else if(stableLoader)event.respondWith(freshAssetResponse(event.request,url));
  else if(url.searchParams.has('v'))event.respondWith(versionedResponse(event.request,url));
  else event.respondWith(assetResponse(event.request,url));
});
