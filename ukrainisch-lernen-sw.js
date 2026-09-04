const CACHE='ukrainischkurs-joel-v10';
const ASSETS=['./','./index.html','./ukrainischkurs-app.html','./ukrainisch-lernen.html','./ukrainischkurs-v2-loader.js','./ukrainischkurs-v2.part1','./ukrainischkurs-v2.part2','./ukrainischkurs-v2.part3','./ukrainischkurs-v2.part4','./ukrainischkurs-v2.part5','./ukrainischkurs-native-audio.js','./ukrainischkurs-pronunciation.js','./ukrainischkurs-pronunciation-mastery.js','./ukrainischkurs-quality-hardening.js','./ukrainischkurs-selftest.js','./ukrainisch-lernen.webmanifest','./ukrainisch-lernen-icon.svg','./ukrainisch-icon-180.png','./ukrainisch-icon-192.png','./ukrainisch-icon-512.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);
  if(event.request.mode==='navigate'){
    if(url.pathname.endsWith('/ukrainisch-lernen.html')){
      event.respondWith(caches.match('./ukrainischkurs-app.html').then(hit=>hit||fetch('./ukrainischkurs-app.html')));
      return;
    }
    event.respondWith(fetch(event.request).catch(()=>caches.match('./ukrainischkurs-app.html')));
    return;
  }
  event.respondWith(caches.match(event.request,{ignoreSearch:true}).then(hit=>hit||fetch(event.request).then(response=>{
    if(response&&response.ok&&url.origin===location.origin){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));}
    return response;
  })));
});