import { openIndexDB } from './openIndexDB.jsx';
async function addToIndexDbStore(
  database,
  ObjectStorage,
  mode,
  filename,
  fileContext,
  lastmod,
) {
  const db = await openIndexDB(database, ObjectStorage);
  let transaction = db.transaction(ObjectStorage, mode);
  let objStore;
  if (!db.objectStoreNames.contains(ObjectStorage)) {
    objStore = db.createObjectStore(ObjectStorage, { keyPath: 'name' });
  } else {
    objStore = transaction.objectStore(ObjectStorage);
  }
  objStore.put({
    name: filename,
    fileContext,
    lastmod,
  });

  db.close();
  return Promise.resolve();
}

async function getAllFromObjectStorage(database, ObjectStore) {
  const db = await openIndexDB(database, ObjectStore);
  return new Promise((resolve, reject) => {
    if (!db.objectStoreNames.contains(ObjectStore)) {
      console.log(`${ObjectStore} does not exist`);
      resolve(false);
    } else {
      const tx = db.transaction(ObjectStore, 'readonly');
      const objSt = tx.objectStore(ObjectStore);
      const getAllrequest = objSt.getAll();
      getAllrequest.onsuccess = function () {
        const items = getAllrequest.result;
        resolve(items);
      };
      getAllrequest.onerror = function (event) {
        reject(event.target.error);
      };
    }
    db.close();
  });
}

async function removeAlreadyStoredFiles(database, File, ObjectStorage) {
  let storageValue = await getAllFromObjectStorage(database, ObjectStorage);
  if (storageValue) {
    storageValue.forEach(function (obj, objIndex) {
      File.forEach(function (mp4obj, mp4Index) {
        if (storageValue[objIndex].name === File[mp4Index].filename) {
          File.splice(mp4Index, 1);
        }
      });
    });
    return File;
  }
  return [];
}

async function getConvertedBlobVideos() {
  let result = [];
  let storageValue = await getAllFromObjectStorage('db', 'videos').then(
    (indexedDBResult) =>
      indexedDBResult.filter((file) => file.name.includes('mp4')),
  );
  if (storageValue) {
    storageValue.forEach((video) => {
      let url = URL.createObjectURL(
        new Blob([video.fileContext], {
          type: 'video/mp4',
        }),
      );
      result.push({
        name: video.name,
        url: url,
        date: video.lastmod,
      });
    });
    return result;
  }

  return result;
}

async function getObjectStorageIndex(database, OBJECT_STORE, INDEX) {
  const db = await openIndexDB(database, OBJECT_STORE);
  return new Promise((resolve, reject) => {
    try {
      if (db.objectStoreNames.contains(OBJECT_STORE)) {
        const tx = db.transaction(OBJECT_STORE, 'readonly');
        const objSt = tx.objectStore(OBJECT_STORE);
        const request = objSt.get(INDEX);
        request.onsuccess = function () {
          const customer = request.result;
          resolve(customer);
        };
      } else {
        resolve(false);
      }
    } catch (error) {
      reject(error);
    }
    db.close();
  });
}

async function hasObjectStorageDatabase(database, OBJECT_STORE) {
  const db = await openIndexDB(database, OBJECT_STORE);
  return new Promise((resolve) => {
    if (!db.objectStoreNames.contains(OBJECT_STORE)) {
      resolve(false);
    } else {
      resolve(true);
    }
  });
}
async function deleteDBFromIndexDB(database) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase(database);
    request.onsuccess = function () {
      resolve();
    };
    request.onerror = function (error) {
      console.error(`#-- Error deleting database "${database}" --#`);
      console.error(error);
      reject(error);
    };
  });
}

export {
  getObjectStorageIndex,
  addToIndexDbStore,
  removeAlreadyStoredFiles,
  getConvertedBlobVideos,
  hasObjectStorageDatabase,
  deleteDBFromIndexDB,
};
