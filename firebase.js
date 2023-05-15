import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getDatabase, set, ref, update } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
apiKey: "AIzaSyD4fksvtA972rd4zzV7zqeYoBKBrznzF40",
authDomain: "e-com-web-922a1.firebaseapp.com",
databaseURL: "https://e-com-web-922a1-default-rtdb.europe-west1.firebasedatabase.app",
projectId: "e-com-web-922a1",
storageBucket: "e-com-web-922a1.appspot.com",
messagingSenderId: "1007000057421",
appId: "1:1007000057421:web:6f96ff6f6fe82e5dc30e04",
measurementId: "G-N2PQ736N8C"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const auth = getAuth();