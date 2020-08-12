import firebase from "firebase/app";

const firebaseConfig = {
  apiKey: "<app key>",
  authDomain: "<project id>.firebaseapp.com",
  databaseURL: "https://<project id>.firebaseio.com",
  projectId: "<project id>",
  storageBucket: "<project id>.appspot.com",
  messagingSenderId: "<messaging sender id>",
  appId: "<app id>",
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);
