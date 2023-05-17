self.addEventListener('fetch', function(event) {
   event.respondWith(fetch(event.request).catch(function() {
       return handleOfflineRequest(event.request);
   }));
});

function handleOfflineRequest(request) {
    return new Promise(function(resolve, reject) {
        var transaction = db.transaction(['formData'], 'readonly');
        var objectStore = transaction.objectStore('formData');
        var index = objectStore.index('data');

        var requestData = [];

        index.openCursor().onsuccess = function(event) {
            var cursor = event.target.result;
            if(cursor) {
                requestData.push(cursor.value.data);
                cursor.continue();
            } else {
                if(requestData.length > 0) {
                    postDataToServer(requestData).then(function() {
                        resolve(fetch(request));
                    }).catch(function(error) {
                        reject(error);
                    });
                } else {
                    reject('No offline data available.');
                }
            }

        };
    });
}

function postDataToServer(requestData) {
    return new Promise(function(resolve, reject) {
        fetch('/record/upload/add', {
            method: 'POST',
            body: JSON.stringify(requestData),
            headers: {'Content-Type':'appication/json'
            }
        }).then(function(response) {
            if (response.ok) {
                var transaction = db.transaction(['formData'], 'readwrite');
                var objectStore = transaction.objectStore('formData');
                var clearRequest = objectStore.clear();

                clearRequest.onsuccess = function() {
                    resolve();
                };

                clearRequest.onerror = function() {
                    reject('Failed to clear offline data from IndexedDB.');
                };
            } else {
                reject('Failed to post offline data to the server.');
            }
        }).catch(function(error) {
            reject(error);
        });
    });
}