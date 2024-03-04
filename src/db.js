let request = indexedDB.open('myDB', 1);
let db;
let version = 1;


export const initDB = () => {
  return new Promise((resolve) => {
    request.onupgradeneeded = () => {
      let db = request.result;

      if (!db.objectStoreNames.contains('users')) {
        console.log('Creating users store');
        db.createObjectStore('users', { keyPath: 'id' });
      }
    };

    request.onsuccess = (e) => {
      let db = request.result;
      version = db.version;
      resolve(request.result);
    };

    request.onerror = (e) => {
      resolve(false);
    };
  });
};

export const addData = (storeName, data) => {
  return new Promise((resolve) => {
    let request = indexedDB.open('myDB', 1);

    request.onsuccess = () => {
      console.log('request.onsuccess - addData', data, storeName);
      let db = request.result;
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      store.add(data);
      resolve(data);
    };

    request.onerror = () => {
      const error = request.error?.message
      if (error) {
        resolve(error);
      } else {
        resolve('Unknown error');
      }
    };
  });
};

export const deleteData = (storeName, key) => {
  return new Promise((resolve) => {
    request = indexedDB.open('myDB', version);

    request.onsuccess = () => {
      console.log('request.onsuccess - deleteData', key);
      db = request.result;
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const res = store.delete(key);
      res.onsuccess = () => {
        resolve(true);
      };
      res.onerror = () => {
        resolve(false);
      }
    };
  });
};

export const updateData = (storeName, key, data) => {
  return new Promise((resolve) => {
    request = indexedDB.open('myDB', version);

    request.onsuccess = () => {
      console.log('request.onsuccess - updateData', key);
      db = request.result;
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const res = store.get(key);
      res.onsuccess = () => {
        const newData = { ...res.result, ...data };
        store.put(newData);
        resolve(newData);
      };
      res.onerror = () => {
        resolve(null);
      }
    };
  });
};

export const getStoreData = (storeName) => {
  return new Promise((resolve) => {
    request = indexedDB.open('myDB');

    request.onsuccess = () => {
      console.log('request.onsuccess - getAllData');
      db = request.result;
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const res = store.getAll();
      res.onsuccess = () => {
        resolve(res.result);
      };
    };
  });
};