export async function openIndexDB(databaseb, ObjectStorage) {
  return new Promise((resolve, reject) => {
    try {
      let request = indexedDB.open(databaseb);

      request.onupgradeneeded = function(event) {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(ObjectStorage)) {
          console.log(`Creating new object store ${ObjectStorage}`);
          db.createObjectStore(ObjectStorage, { keyPath: "name" });
        }
        const transaction = event.target.transaction;
        transaction.oncomplete = function() {
          console.log("Transaction completed");
        };
      };

      request.onsuccess = function(event) {
        resolve(event.target.result);
      };
      request.onerror = function(event) {
        reject(event.target.error);
      };
    } catch (error) {
      reject(error);
    }
  });
}
