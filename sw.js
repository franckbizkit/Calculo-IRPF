const CACHE_NAME = 'cgt-irpf-cache-v1';

const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icono.png'
];

// Instalación
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caché abierto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activación y limpieza
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
    })
  );
});

// ESTO ES LO QUE FALTABA: El "portero" que entrega los archivos offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Si lo tiene en caché, lo entrega; si no, va a internet
        return response || fetch(event.request);
      })
  );
});