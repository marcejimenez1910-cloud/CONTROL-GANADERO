const CACHE='ganadero-v1';
const ARCHIVOS=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./icon-maskable-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ARCHIVOS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(
    caches.match(e.request,{ignoreSearch:true}).then(r=>r||fetch(e.request).then(res=>{
      if(res.ok&&new URL(e.request.url).origin===location.origin){const copia=res.clone();caches.open(CACHE).then(c=>c.put(e.request,copia));}
      return res;
    }).catch(()=>e.request.mode==='navigate'?caches.match('./index.html'):undefined))
  );
});
