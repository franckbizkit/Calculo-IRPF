const CACHE_NAME = 'cgt-irpf-cache-v4'; // Subimos versión para forzar actualización

// Archivos CRÍTICOS para que la app sea instalable y funcione offline
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icono.png' // CORREGIDO: Apunta a icono.png
];

// 1. INSTALACIÓN: Guarda los archivos en la memoria del dispositivo
self.addEventListener('install', event => {
  self.skipWaiting(); // Fuerza activación inmediata

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Abriendo caché y guardando recursos...');
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.error('Error al guardar en caché:', err))
  );
});

// 2. ACTIVACIÓN: Limpia cachés antiguas
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. INTERCEPTACIÓN (FETCH): Modo Offline
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request)
          .then(networkResponse => {
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache);
            });
            return networkResponse;
          })
          .catch(() => {
            if (event.request.mode === 'navigate') {
              return caches.match('./index.html');
            }
          });
      })
  );
});