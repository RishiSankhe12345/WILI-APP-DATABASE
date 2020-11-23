import firebase from 'firebase'

const firebaseConfig = {
    apiKey: "AIzaSyBbahSEEZ404ZFwTS7qTCMV5XkChKsLGGk",
    authDomain: "wili-app-d31a1.firebaseapp.com",
    databaseURL: "https://wili-app-d31a1.firebaseio.com",
    projectId: "wili-app-d31a1",
    storageBucket: "wili-app-d31a1.appspot.com",
    messagingSenderId: "122851860510",
    appId: "1:122851860510:web:7e6dd313547bae1dfdce0f"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase.database();