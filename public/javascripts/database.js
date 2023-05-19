import * as idb from './idb/index.js';

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