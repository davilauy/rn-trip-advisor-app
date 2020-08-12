import * as Firebase from "firebase";

export const reauthenticate = password => {
  const user = Firebase.auth().currentUser;
  const credentials = Firebase.auth.EmailAuthProvider.credential(
    user.email,
    password
  );
  return user.reauthenticateWithCredential(credentials);
};
