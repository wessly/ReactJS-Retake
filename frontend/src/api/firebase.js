import firebase from 'firebase'

const config = {
    apiKey: "AIzaSyDy7ew-255sgVv7UvsQbL_hw3OYhTKkhNo",
    authDomain: "kletka-e1873.firebaseapp.com",
    databaseURL: "https://kletka-e1873.firebaseio.com",
    projectId: "kletka-e1873",
    storageBucket: "kletka-e1873.appspot.com",
    messagingSenderId: "403428516152"
};

firebase.initializeApp(config);

export const facebook = new firebase.auth.FacebookAuthProvider();
export const auth = firebase.auth();

export default firebase;