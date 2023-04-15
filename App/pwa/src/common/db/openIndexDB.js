export async function openIndexDB(database, ObjectStorage) {
  return new Promise((resolve, reject) => {
    try {
      const request = indexedDB.open(database);
      request.onupgradeneeded = function (event) {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(ObjectStorage)) {
          db.createObjectStore(ObjectStorage, { keyPath: 'name' });
        }
        const transaction = event.target.transaction;
        transaction.oncomplete = function () {};
      };

      request.onsuccess = function (event) {
        resolve(event.target.result);
      };
      request.onerror = function (event) {
        reject(event.target.error);
      };
    } catch (error) {
      reject(error);
    }
  });
}
