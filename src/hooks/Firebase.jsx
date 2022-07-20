import { auth, realTimeDb, storage } from "../firebase";
import { ref as ref_database, set, query as query_database, get, orderByChild, equalTo } from "firebase/database";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getDownloadURL, ref as ref_storage, uploadString } from "firebase/storage";

export const insert = async ({ key, id, payload }) => {
  await set(ref_database(realTimeDb, `${key}/${id}`), payload);
};

export const createAccount = async (email, password) => {
  await createUserWithEmailAndPassword(auth, email, password)
    .catch(error => {
      console.log(error);
    })
}

export const upload = async ({ key, id, payload, entity, callback }) => {
  const storageRef = ref_storage(storage, `${key}/${id}`);
  uploadString(storageRef, payload, 'data_url')
    .then((snapshot) => {
      getDownloadURL(snapshot.ref_storage)
        .then((url) => {
          callback(entity, url);
        })
    })
    .catch(error => {
      switch (error.code) {
        case 'storage/unauthorized':
          break;
        case 'storage/canceled':
          break;
        case 'storage/unknown':
          break;
        default:
          break;
      }
    })
};

export const login = async (email, password) => {
  await signInWithEmailAndPassword(auth, email, password)
    .catch(error => {
      console.log(error);
    });
}

export const getSingleDataWithQuery = async ({ key, query, criteria }) => {
  if (!criteria) return;
  const dbRef = query_database(ref_database(realTimeDb, key), orderByChild(query), equalTo(criteria));
  get(dbRef).then(snapshot => {
    if (snapshot.exists()) {
      const val = snapshot.val();
      if (val) {
        const keys = Object.keys(val);
        return val[keys[0]];
      }
    } else {
      console.log("No data available");
    }
  }).catch((error) => {
    console.error(error);
  });
  return null;
};

// const snapshot = await realTimeDb
// .ref()
// .child(key)
// .orderByChild(query)
// .equalTo(criteria)
// .get();
// const val = snapshot.val();
// if (val) {
// const keys = Object.keys(val);
// return val[keys[0]];
// }