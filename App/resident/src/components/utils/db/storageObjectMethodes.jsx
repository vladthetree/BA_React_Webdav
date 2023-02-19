import { openIndexDB } from "./openIndexDB.jsx";
import { openJustDB } from "./openJustDB.jsx";

async function addToIndexDbStore(
  database,
  ObjectStorage,
  mode,
  filename,
  fileContext
) {
  console.log("TRIGGER ADD")
  const db = await openIndexDB(database, ObjectStorage);
  // console.log(` addToIndexDbStore database : ${database} and Objectstorage ${ObjectStorage}`)
  let transaction = db.transaction(ObjectStorage, mode);
  // console.log(
  //   `#-- ADDING TO OBJECTSTORAGE ${ObjectStorage} THE FILE ${filename} --#`
  // );
  let objStore;
  if (!db.objectStoreNames.contains(ObjectStorage)) {
    objStore = db.createObjectStore(ObjectStorage, { keyPath: "name" });
  } else {
    objStore = transaction.objectStore(ObjectStorage);
  }

  objStore.add({
    name: filename,
    fileContext,
  });

  db.close();
  return Promise.resolve();
}

async function getAllFromObjectStorage(database, ObjectStore) {
  // console.log(` getAllFromObjectStorage database : ${database} and Objectstorage ${ObjectStore}`)

  // console.log("Object Store")
  // console.log(ObjectStore)
  const db = await openIndexDB(database, ObjectStore);
  return new Promise((resolve, reject) => {
    if (!db.objectStoreNames.contains(ObjectStore)) {
      console.log(`${ObjectStore} does not exist`);
      resolve(false);
    } else {
      const tx = db.transaction(ObjectStore, "readonly");
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
  // console.log(` removeAlreadyStoredFiles database : ${database} and Objectstorage ${ObjectStorage}`)

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
  let storageValue = await getAllFromObjectStorage("db", "videos");
  if (storageValue) {
    storageValue.forEach((video) => {
      let url = URL.createObjectURL(
        new Blob([video.fileContext], {
          type: "video/mp4",
        })
      );
      result.push({
        name: video.name,
        url: url,
      });
    });
    return result;
  }

  return result;
}

async function getObjectStorageIndex(database, OBJECT_STORE, INDEX) {
  // console.log(` getObjectStorageIndex database : ${database} and Objectstorage ${OBJECT_STORE}`)

  const db = await openIndexDB(database, OBJECT_STORE);
  return new Promise((resolve, reject) => {
    try {
      if (db.objectStoreNames.contains(OBJECT_STORE)) {
        const tx = db.transaction(OBJECT_STORE, "readonly");
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
  // console.log(` hasObjectStorageDatabase database : ${database} and Objectstorage ${OBJECT_STORE}`)

  const db = await openIndexDB(database,OBJECT_STORE);
  return new Promise((resolve) => {
    if (!db.objectStoreNames.contains(OBJECT_STORE)) {
      resolve(false);
    } else {
      resolve(true);
    }
  });
}
async function deleteDBFromIndexDB(database) {
  // console.log(` deleteDBFromIndexDB database : ${database} `)

  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase(database);
    request.onsuccess = function () {
      // console.log(`#-- Successfully deleted database "${database}" --#`);
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
