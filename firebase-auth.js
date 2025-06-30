import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDF1PXrnhwa7i3L6I8_B2nm_zYWt0ikiSg",
  authDomain: "e-commerce-7c8c5.firebaseapp.com",
  projectId: "e-commerce-7c8c5",
  storageBucket: "e-commerce-7c8c5.appspot.com",
  messagingSenderId: "527907196157",
  appId: "1:527907196157:web:3bce74b8915d437a7f4294",
  measurementId: "G-6KTTSQ7TR5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

window.googleLogin = () => {
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      alert(`Welcome ${user.displayName}`);
      console.log(user);
    })
    .catch((error) => {
      console.error("Login Error:", error);
    });
};
