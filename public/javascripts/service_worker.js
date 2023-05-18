var CACHE_NAME = 'online-first'

var CACHE_FILES = [
	'./',
	'/javascripts/chat.js',
	'/javascripts/menu.js',
	'/controllers/socket-io.js',
	'/util/swagger/index.js',
]

self.addEventListener('install', event => {
	console.log('[ServiceWorker] Installed');

	event.waitUntil(async function () {
		const cache = await caches.open(CACHE_NAME);
		console.log('[ServiceWorker] Caching Files');
		return cache.addAll(CACHE_FILES);
	}());
});

self.addEventListener('activate', event => {
	console.log('[ServiceWorker] Activated');
	//TODO add indexedDB in it.
	// Open or create the IndexedDB database
	const request = indexedDB.open('myDatabase', 1);

	request.onupgradeneeded = event => {
		const db = event.target.result;
		db.createObjectStore('formData', { autoIncrement: true });
	};

	request.onerror = event => {
		console.error('IndexedDB error:', event.target.error);
	};

	request.onsuccess = event => {
		const db = event.target.result;

		function storeFormData(formData) {
			const transaction = db.transaction(['formData'], 'readwrite');
			const objectStore = transaction.objectStore('formData');
			const request = objectStore.add(formData);

			request.onsuccess = () => {
				console.log('Form data stored in IndexedDB.');
			};

			request.onerror = () => {
				console.error('Error storing form data in IndexedDB.');
			};
		}

		// Example usage:
		// Call storeFormData(formData) to store form data
	};
	event.waitUntil(async function () {
		const cachesKeys = await caches.keys();
		const deletePromises = cachesKeys.map((cacheName) => {
			if (cacheName !== CACHE_NAME) {
				console.log('[ServiceWorker] Removing Cached Files from Cache - ', cacheName);
				return caches.delete(cacheName);
			}
		})

		return await Promise.all(deletePromises);
	}());
});

self.addEventListener('fetch', event => {
	console.log('[ServiceWorker] Fetch', event.request.url);

	event.respondWith(async function () {
		try {
			const response = await fetch(event.request);

			if (response.status === 404 || response.status === 500) {
				const cachedResponse = await caches.match(event.request);

				if (cachedResponse) {
					console.log("[ServiceWorker] Found in Cache", event.request.url, cachedResponse);
					return cachedResponse;
				}
			}

			const cachedResponse = await caches.match(event.request);
			if (!cachedResponse) {
				const responseClone = response.clone();
				const cache = await caches.open(CACHE_NAME);
				cache.put(event.request, responseClone);
				console.log('[ServiceWorker] New Data Cached', event.request.url);
			}

			return response;
		} catch (err) {

			const cachedResponse = await caches.match(event.request);

			if (cachedResponse) {
				console.log("[ServiceWorker] Found in Cache", event.request.url, cachedResponse);
				return cachedResponse;
			}
		}
	}());
});
