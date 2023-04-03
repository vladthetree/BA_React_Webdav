export async function openJustDB(database) {
  return new Promise((resolve, reject) => {
    try {
      let request = indexedDB.open(database);

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
