// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "blog-app-859aa.firebaseapp.com",
    projectId: "blog-app-859aa",
    storageBucket: "blog-app-859aa.appspot.com",
    messagingSenderId: "379355299410",
    appId: "1:379355299410:web:8447aa7217b576b8a2298b",
    measurementId: "G-JFHMQVH9JE"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);