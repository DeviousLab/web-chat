import { auth, realTimeDb, storage } from "../firebase";
import { ref as ref_database, set } from "firebase/database";
import { createUserWithEmailAndPassword } from "firebase/auth";
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

// const uploadTask = storage.ref(`${key}/${id}`).putString(payload, "data_url");
// uploadTask.on(
//   "state_changed",
//   null,
//   () => {
//     storage
//       .ref(key)
//       .child(id)
//       .getDownloadURL()
//       .then((url) => {
//         callback(entity, url);
//       });
//   }
// );