let cache = null;
let dataCacheName = 'birdData';
let cacheName = 'birdSightingApp';
let filesToCache = [
    '/stylesheets/upload.css',
    '/image/upload.png',
    '/',
    '/javascripts/chat.js',
    '/javascripts/menu.js',
    '/record/upload'
    // Add other URLs to cache here
];

self.addEventListener('install', function (e) {
    console.log('[ServiceWorker] Install');
    e.waitUntil(
        caches.open(cacheName).then(function (cacheX) {
            console.log('[ServiceWorker] caching app data');
            cache = cacheX;
            return cache.addAll(filesToCache)
        })
    )
});

self.addEventListener('activate', function(e) {
    console.log('[ServiceWorker] Activated');
    e.waitUntil(
        cache.keys().then(function (keyList) {
            return Promise.all(keyList.map(function (key) {
                if (key !== cacheName && key !== dataCacheName) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});

self.addEventListener('fetch', function (e){
    console.log('[Service Worker] Fetch', e.request.url);
    let dataUrl = '/bird_data';
    if (e.request.url.indexOf(dataUrl) > -1) {
        return fetch(e.request)
            .then((response) => {
                return response;
            })
            .catch((error)=> {
                return error;
            })
    } else {
        e.respondWith(
            caches.match(e.request).then(function (response) {
                return response
                    || fetch(e.request)
                        .then(function(response) {
                            if (!response.ok || response.statusCode>299) {
                                console.log("error: " + response.error());
                            } else {
                                cache.add(e.request.url);
                                return(response);
                            }
                        })
                        .catch(function(err) {
                            console.log("error: " + err);
                        })
            })
        );
    }
});