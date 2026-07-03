// frontend/services/firebase.js
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey:            "AIzaSyBJsRmRtbZlSqJ1KFCFEOlFWPhC0g-vlZw",
  authDomain:        "school-ride-app-883fe.firebaseapp.com",
  projectId:         "school-ride-app-883fe",
  storageBucket:     "school-ride-app-883fe.firebasestorage.app",
  messagingSenderId: "435338290506",
  appId:             "1:435338290506:web:ad55f73064321ebf878db3",
};

const app  = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});