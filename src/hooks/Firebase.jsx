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
  await uploadString(storageRef, payload, 'data_url')
    .then((snapshot) => {
      getDownloadURL(snapshot.ref)
        .then(async (url) => {
          callback(entity, url);
        })
    }
    )
  // const storageRef = ref_storage(storage, `${key}/${id}.jpg`);
  // const uploadTask = uploadBytesResumable(storageRef, payload, 'data_url', { customMetaData: 'image/jpeg' });
  // uploadTask.on('state_changed',
  //   null,
  //   (error) => {
  //     console.log(error);
  //   },
  //   () => {
  //     getDownloadURL(uploadTask.snapshot.ref)
  //       .then(url => {
  //         callback(entity, url);
  //       })
  //   }
  // )
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
  const snapshot = await get(dbRef);
  if (snapshot.exists()) {
    const val = snapshot.val();
    if (val) {
      const keys = Object.keys(val);
      return val[keys[0]];
    }
  }
  return null;
};