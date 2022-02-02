import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { DocumentSnapshot, getFirestore, QueryDocumentSnapshot } from 'firebase/firestore';
import { IGame } from '../types';

// Initialize Firebase
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCCRRNxg7EgpXvyNYSoTGlAcZT9sZ_2qZQ',
  authDomain: 'escapadegame1.firebaseapp.com',
  projectId: 'escapadegame1',
  storageBucket: 'escapadegame1.appspot.com',
  messagingSenderId: '770899393477',
  appId: '1:770899393477:web:7521de702e3119066829ac',
  measurementId: 'G-Q1HLVD0Q9F',
};
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getFirestore();

export const db = database;
