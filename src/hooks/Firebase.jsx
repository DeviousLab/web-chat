import { auth, realTimeDb, storage } from "../firebase";

export const insert = async ({ key, id, payload }) => {
  await realTimeDb.ref(`${key}/${id}`).set(payload);
};

export const createAccount = async (email, password) =>
  await auth.createUserWithEmailAndPassword(email, password);

export const upload = async ({ key, id, payload, entity, callback }) => {
  const uploadTask = storage.ref(`${key}/${id}`).putString(payload, "data_url");
  uploadTask.on(
    "state_changed",
    null,
    () => {
      storage
        .ref(key)
        .child(id)
        .getDownloadURL()
        .then((url) => {
          callback(entity, url);
        });
    }
  );
};