import firebase from 'firebase';
import 'firebase/firestore';

// firebase init goes here
const config = {
  apiKey: 'AIzaSyAuB_vveb5spiHM4SReGRjA_mD1gMyQku8',
  authDomain: 'swd6-mgmt.firebaseapp.com',
  databaseURL: 'https://swd6-mgmt.firebaseio.com',
  projectId: 'swd6-mgmt',
  storageBucket: 'swd6-mgmt.appspot.com',
  messagingSenderId: '471935014158',
  appId: '1:471935014158:web:e35c2a6f6249187129f35f',
  measurementId: 'G-CWCMBZ1Q03',
};
firebase.initializeApp(config);

// firebase utils
const db = firebase.firestore();
const auth = firebase.auth();
const { currentUser } = auth;

// firebase collections
const usersCollection = db.collection('users');
const charactersCollection = db.collection('characters');

export {
  db,
  auth,
  currentUser,
  usersCollection,
  charactersCollection,
};
