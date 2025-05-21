import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import { initializeApp } from "firebase/app";
import 'firebase/firestore';
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCECjLUf4FEcjFOytuu6KA2_WrqdiNABtU",
  authDomain: "sbtest-5d14c.firebaseapp.com",
  projectId: "sbtest-5d14c",
  storageBucket: "sbtest-5d14c.appspot.com",
  messagingSenderId: "445850698179",
  appId: "1:445850698179:web:1d41650c4a3e705378fd76",
  measurementId: "G-HEP332VST4"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const timestamp = firebase.firestore.FieldValue.serverTimestamp;

export { timestamp };
export default firebaseApp.firestore();
const fire = initializeApp(firebaseConfig);
export const auth = getAuth(fire);
