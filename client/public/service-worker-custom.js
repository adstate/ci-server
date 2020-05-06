const CACHE_NAME = 'ci-cache-v1';
const CACHE_PREFIX = 'ci-cache';
const urlsToCache = [
  '/',
  '/favicon.ico',
  'http://yastatic.net/islands/_/PyVcRbwHetz0gOVWLonWH7Od8zM.woff2',
  'http://yastatic.net/islands/_/7_GKBdKFbUPzKlghJRv55xgz0FQ.woff2',
  'http://yastatic.net/islands/_/6Roy0LCd05cK4nNCipgzheYcNVU.woff2'
];

const staticRegex = /(\/|\.js|\.css|\.html|\.json|\.png|\.jpeg|\.jpg|\.svg|\.woff2|\.woff|\.ico)$/i;

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  if (event.request.method != 'GET' || !staticRegex.test(event.request.url)) {
    return;
  }

  event.respondWith(async function() {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(event.request);

    if (cachedResponse) {
      event.waitUntil(cache.add(event.request));
      return cachedResponse;
    }

    return fetch(event.request);
  }());
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
      caches.keys()
        .then(keyList => {
          return Promise.all(keyList.map(key => {
              if (key.indexOf(CACHE_PREFIX) === 0 && key !== CACHE_NAME) {
                  return caches.delete(key);
              }
          }));
        })
  );
});
