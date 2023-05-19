import * as idb from '/javascripts/idb/index.js'

let db;

const BIRD_DB_NAME = 'db_bird_1';
const BIRD_STORE_NAME = 'store_birds';

async function initDatabase() {
    if (!db) {
        db = await idb.openDB(BIRD_DB_NAME, 2, {
            upgrade(upgradeDb, oldVersion, newVersion) {
                if (!upgradeDb.objectStoreNames.contains(BIRD_STORE_NAME)) {
                    let birdDB = upgradeDb.createObjectStore(BIRD_STORE_NAME, {
                        keyPath: 'id',
                        autoIncrement: true
                    });
                    birdDB.createIndex('location', 'location', {unique: false, multiEntry: true});
                }
            }
        });
        console.log('db created');
    }
}
window.initDatabase = initDatabase;

async function storeCachedData(formData, sightingObject) {
    console.log('Inserting' + JSON.stringify(sightingObject));
    if (!db)
        await initDatabase();
    if (db) {
        try {
            let tx = await db.transaction(BIRD_STORE_NAME, 'readwrite');
            let store = await tx.objectStore(BIRD_STORE_NAME);

            // Create a new object with the form data and sighting object
            const data = {
                formData: formData,
                sightingObject: sightingObject
            };

            await store.put(data);
            await tx.complete;
            console.log('Added item to the store' + JSON.stringify(data));
        } catch (error) {
            localStorage.setItem(formData.id, JSON.stringify({ formData: formData, sightingObject: sightingObject }));
        }
    } else {
        localStorage.setItem(formData.id, JSON.stringify({ formData: formData, sightingObject: sightingObject }));
    }
}
window.storeCachedData = storeCachedData;

document.querySelector("form").addEventListener("submit", function(event) {
    event.preventDefault();

    let code=document.querySelector("#code").value;
    let nickname=code.slice(0,-4);
    if (!navigator.onLine) {
        saveOfflineData({
            picture: document.querySelector("#file").files[0],
            location: document.querySelector("#location-input").value,
            time: document.querySelector("#time").value,
            description: document.querySelector("#description").value,
            identification: document.querySelector("#identification").value,
            code: document.querySelector("#code").value,
            witnesses:nickname,
        });
    } else {
        // User is online, submit the form normally
        this.submit();
    }
});

function saveOfflineData(data) {
    const request = indexedDB.open("offlineData", 1);

    request.onupgradeneeded = function(event) {
        const db = event.target.result;
        db.createObjectStore("offlineStore", {autoIncrement: true});
    };

    request.onsuccess = function(event) {
        const db = request.result;
        const tx = db.transaction(["offlineStore"], "readwrite");
        const store = tx.objectStore("offlineStore");
        store.add(data);
    };

    request.onerror = function(event) {
        console.log("Error:", event.target.errorCode);
    };
}

function syncData() {
    const request = indexedDB.open("offlineData", 1);

    request.onsuccess = function(event) {
        const db = request.result;
        const tx = db.transaction(["offlineStore"], "readonly");
        const store = tx.objectStore("offlineStore");

        store.getAll().onsuccess = function(event) {
            // Got all stored data
            let offlineData = event.target.result;

            offlineData.forEach((data, index) => {
                // Send the data to the server
                fetch('/javascripts/save', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                })
                    .then(response => response.json())
                    .then(res => {
                        console.log(res);
                        if(res.success) {
                            // If server responded positively, remove this data from IDB
                            store.delete(index);
                        }
                    })
                    .catch(err => {
                        console.error('Error:', err);
                    });
            });
        };
    };

    request.onerror = function(event) {
        console.log("Error:", event.target.errorCode);
    };
}


async function getCachedData(bird, date) {
    if (!db)
        await initDatabase();
    if (db) {
        try {
            console.log('fetching:'+ bird);
            let tx = await db.transaction(BIRD_STORE_NAME, 'readonly');
            let store = await tx.objectStore(BIRD_STORE_NAME);
            let index = await store.index('location');
            let sightingsList = await index.getAll(IDBKeyRange.only(bird));
            await tx.complete;
            let finalResults=[];
            if (sightingsList && sightingsList.length > 0) {
                let max;
                for (let elem of sightingsList)
                    if (!max || elem.date > max.date)
                        max = elem;
                if (max)
                    finalResults.push(max);
                return finalResults;
            } else {
                const value = localStorage.getItem(bird);
                if (value == null)
                    return finalResults;
                else finalResults.push(value);
                return finalResults;
            }
        } catch (error) {
            console.log(error);
        }
    } else {
        const value = localStorage.getItem(bird);
        let finalResults=[];
        if (value == null)
            return finalResults;
        else finalResults.push(value);
        return finalResults;
    }
}
window.getCachedData= getCachedData;