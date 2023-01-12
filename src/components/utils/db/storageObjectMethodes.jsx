import { openIndexDB } from "./openIndexDB.jsx";

async function addToIndexDbStore(
  database,
  ObjectStorage,
  mode,
  filename,
  fileContext
) {
  console.log();
  const db = await openIndexDB(database, ObjectStorage);
  return new Promise((resolve, reject) => {
    let transaction = db.transaction(ObjectStorage, mode);
    console.log(
      `#-- ADDING TO OBJECTSTORAGE ${ObjectStorage} THE FILE ${filename} --#`
    );
    let objStore;
    if (!db.objectStoreNames.contains(ObjectStorage)) {
      objStore = db.createObjectStore(ObjectStorage, { keyPath: "name" });
    } else {
      objStore = transaction.objectStore(ObjectStorage);
    }
    objStore.add({
      name: filename,
      fileContext
    });
    db.close();
    resolve();
  });
}

async function getAllFromObjectStorage(database, ObjectStore) {
  const db = await openIndexDB(database, ObjectStore);
  return new Promise((resolve, reject) => {
    if (!db.objectStoreNames.contains(ObjectStore)) {
      console.log(`{ObjectStore} does not exist`);
      resolve(false);
    } else {
      const tx = db.transaction(ObjectStore, "readonly");
      const objSt = tx.objectStore(ObjectStore);
      const getAllrequest = objSt.getAll();
      getAllrequest.onsuccess = function() {
        const items = getAllrequest.result;
        resolve(items);
      };
      getAllrequest.onerror = function(event) {
        reject(event.target.error);
      };
    }
  });
}

async function getDeviceFromStore(database, ObjectStorage, mode, key) {
  const db = await openIndexDB(database, ObjectStorage);
  return new Promise((resolve, reject) => {});
}

async function removeAlreadyStoredFiles(database, File, ObjectStorage) {
  let storageValue = await getAllFromObjectStorage(database, ObjectStorage);
  storageValue.forEach(function(obj, objIndex) {
    File.forEach(function(mp4obj, mp4Index) {
      if (storageValue[objIndex].name == File[mp4Index].basename) {
        File.splice(mp4Index, 1);
      }
    });
  });
  return File;
}

async function getConvertedBlobVideos() {
  let result = [];
  let storageValue = await getAllFromObjectStorage("db", "videos");

  storageValue.forEach(video => {
    let url = URL.createObjectURL(
      new Blob([video.fileContext], {
        type: "video/mp4"
      })
    );
    result.push({
      name: video.name,
      url: url
    });
  });
  return result;
}

async function getObjectStorageIndex(database, OBJECT_STORE, INDEX) {
  const db = await openIndexDB(database, OBJECT_STORE);
  return new Promise((resolve, reject) => {
    try {
      if (db.objectStoreNames.contains(OBJECT_STORE)) {
        const tx = db.transaction(OBJECT_STORE, "readonly");
        const objSt = tx.objectStore(OBJECT_STORE);
        const request = objSt.get(INDEX);
        request.onsuccess = function() {
          const customer = request.result;
          resolve(customer);
        };
      } else {
        resolve(false);
      }
    } catch (error) {
      reject(error);
    }
  });
}

export {
  getObjectStorageIndex,
  addToIndexDbStore,
  getDeviceFromStore,
  removeAlreadyStoredFiles,
  getConvertedBlobVideos
};
