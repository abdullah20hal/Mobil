import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import {getAuth,signOut } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDvgRuGs4jLKmCDsQ8jepAKkynuxV8wEic",
  authDomain: "mobilproje-2b869.firebaseapp.com",
  projectId: "mobilproje-2b869",
  storageBucket: "mobilproje-2b869.appspot.com",
  messagingSenderId: "753824940866",
  appId: "1:753824940866:web:ba438883ec70846d5cfedb"
};

export const logoutUser = (navigation) => {
  const auth = getAuth();
  signOut(auth).then(() => {
      console.log('Kullanıcı çıkış yaptı');
      navigation.navigate('Login'); // Kullanıcıyı giriş ekranına yönlendir
  }).catch((error) => {
      console.error('Çıkış yapılırken hata oluştu:', error);
  });
};


// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}




export { firebase };
