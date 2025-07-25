import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
//import 'firebase/firestore'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCZLwKCxUQgpCfelmNsTzldC9u_zFjoxMs",
  authDomain: "appalquiler-fafab.firebaseapp.com",
  projectId: "appalquiler-fafab",
  storageBucket: "appalquiler-fafab.firebasestorage.app",
  messagingSenderId: "108684020446",
  appId: "1:108684020446:web:29e332377f4b5fabf6d04f",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
//export const db = getFirestore(app);
