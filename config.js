import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBt8nMp3ImOF4wgbU3XHKT4reiIDCLdPng",
  authDomain: "alisveris-uygulama-e6ba5.firebaseapp.com",
  projectId: "alisveris-uygulama-e6ba5",
  storageBucket: "alisveris-uygulama-e6ba5.appspot.com",
  messagingSenderId: "16399994953",
  appId: "1:16399994953:web:f2570ea585cce580ecaf98"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase };
