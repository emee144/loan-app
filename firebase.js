// firebase.js
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence
} from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';
import { setLogLevel } from 'firebase/firestore';
const firebaseConfig = {

  apiKey: "AIzaSyBjz7qJlfxFA8MJwE8nMxCKJ8k6sxMvVlE",

  authDomain: "loanapp-711a0.firebaseapp.com",

  projectId: "loanapp-711a0",

  storageBucket: "loanapp-711a0.firebasestorage.app",

  messagingSenderId: "611858337866",

  appId: "1:611858337866:web:e99ca1cffcf352064716b3"

};
setLogLevel('debug'); // add this in firebase.js

const app = initializeApp(firebaseConfig);

// ✅ Use AsyncStorage persistence for React Native
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

const db = getFirestore(app);

export { auth, db };
