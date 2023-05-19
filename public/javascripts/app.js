function initBirdSighting() {
    if ('indexedDB' in window) {
        initDatabase();
    }
    else {
        console.log('This browser does not support IndexedDB');
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker
                .register('./javascripts/service-worker.js')
                .then(function() { console.log('Service Worker Registered'); });
        }
        console.log("service worker is ,,,, working!")
    }
}




