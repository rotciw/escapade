import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getDatabase } from 'firebase/database';

// Initialize Firebase
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCCRRNxg7EgpXvyNYSoTGlAcZT9sZ_2qZQ',
  authDomain: 'escapadegame1.firebaseapp.com',
  databaseURL: 'https://escapadegame1-default-rtdb.europe-west1.firebasedatabase.app/',
  projectId: 'escapadegame1',
  storageBucket: 'escapadegame1.appspot.com',
  messagingSenderId: '770899393477',
  appId: '1:770899393477:web:7521de702e3119066829ac',
  measurementId: 'G-Q1HLVD0Q9F',
};
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

export const db = database;
