const CACHE_NAME = 'cgt-irpf-cache-v1';

// Archivos básicos que queremos guardar en caché para que la web funcione sin internet.
// Nota: No incluimos el archivo 'app-release.apk' aquí para no saturar el almacenamiento del dispositivo, 
// la descarga del APK siempre requerirá conexión a internet.
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icono.png'
];

// Evento de instalación: guarda los archivos en caché
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caché abierto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Evento de activación: limpia cachés antiguos si cambias la versión
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
