const CACHE='ukrainischkurs-joel-v4';
const ASSETS=['./ukrainisch-lernen.html','./ukrainisch-lernen.webmanifest','./ukrainisch-lernen-icon.svg','./ukrainisch-icon-180.png','./ukrainisch-icon-192.png','./ukrainisch-icon-512.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  if(event.request.mode==='navigate'){
    event.respondWith(fetch(event.request).catch(()=>caches.match('./ukrainisch-lernen.html')));
    return;
  }
  event.respondWith(caches.match(event.request).then(hit=>hit||fetch(event.request)));
});
