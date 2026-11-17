const C='att-shell-v1',FILES=['./','index.html','app.js?v=1','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET'||u.origin!==location.origin)return;
  e.respondWith(caches.open(C).then(async c=>{
    const m=await c.match(e.request,{ignoreSearch:e.request.mode==='navigate'||u.pathname.endsWith('/')||u.pathname.endsWith('index.html')});
    const net=fetch(e.request).then(r=>{if(r&&r.ok)c.put(e.request.mode==='navigate'?new Request(new URL('./',location.href)):e.request,r.clone());return r}).catch(()=>null);
    return m||(await net)||new Response('offline',{status:503});
  }));
});
