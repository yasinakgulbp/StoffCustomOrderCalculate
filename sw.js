const CACHE_NAME = 'mobilya-hesaplayici-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/calculator.js',
  '/constants.js',
  '/settings.js',
  '/expenses.js',
  '/theme.js',
  '/manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
}); 