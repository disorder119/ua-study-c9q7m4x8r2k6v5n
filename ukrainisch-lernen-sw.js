const CACHE='ukrainischkurs-joel-v20';
const ASSETS=[
  './','./index.html','./ukrainischkurs-app.html','./ukrainisch-lernen.html','./ukrainisch-lernen.webmanifest',
  './ukrainisch-icon-180.png','./ukrainisch-icon-192.png','./ukrainisch-icon-512.png','./ukrainisch-lernen-icon.svg',
  './ukrainischkurs-v2-loader.js','./ukrainischkurs-v2.part1','./ukrainischkurs-v2.part2','./ukrainischkurs-v2.part3','./ukrainischkurs-v2.part4','./ukrainischkurs-v2.part5',
  './ukrainischkurs-native-audio.js','./ukrainischkurs-pronunciation.js','./ukrainischkurs-pronunciation-mastery.js','./ukrainischkurs-quality-hardening.js',
  './ukrainischkurs-adaptive-alphabet.js','./ukrainischkurs-alphabet-proof.js','./ukrainischkurs-reading-bridge.js','./ukrainischkurs-reading-transfer.js',
  './ukrainischkurs-adaptive-srs.js','./ukrainischkurs-foundation-expansion.js','./ukrainischkurs-a1-expansion-2.js','./ukrainischkurs-comprehension-lab.js','./ukrainischkurs-active-production.js',
  './ukrainischkurs-grammar-spiral.js','./ukrainischkurs-story-lab.js','./ukrainischkurs-dictation.js','./ukrainischkurs-a1-cando.js','./ukrainischkurs-selftest.js'
];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);
  if(url.origin!==location.origin)return;
  event.respondWith(caches.match(event.request,{ignoreSearch:true}).then(cached=>cached||fetch(event.request).then(response=>{if(response&&response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy))}return response}).catch(()=>caches.match('./ukrainischkurs-app.html'))));
});
