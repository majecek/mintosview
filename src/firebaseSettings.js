import firebase from 'firebase'
require("firebase/firestore");

const FIREBASE_CONFIG = {
    apiKey: "AIzaSyCXOqgSE12q4lJGBflqAy2M00itjUNkFCo",
    authDomain: "mintosview.firebaseapp.com",
    databaseURL: "https://mintosview.firebaseio.com",
    projectId: "mintosview",
    storageBucket: "mintosview.appspot.com",
    messagingSenderId: "789498933128"
}

const FIREBASE_UI_CONFIG = {
    // signInSuccessUrl: '/auth',
    // signInOptions: [
    //     firebase.auth.GoogleAuthProvider.PROVIDER_ID
    // ],
    // tosUrl: '/tos'

    // Popup signin flow rather than redirect flow.
    signInFlow: 'popup',
    // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
    signInSuccessUrl: '/signedIn',
    // We will display Google and Facebook as auth providers.
    signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        // firebase.auth.FacebookAuthProvider.PROVIDER_ID
    ],
    callbacks: {
        signInSuccess: () => false,
    }
}

export const firebaseApp = firebase.initializeApp(FIREBASE_CONFIG)
export const firestore = firebase.firestore()
export const usersColl = firestore.collection("users")

export const firebaseDB = firebaseApp.database()
// export const firebaseAuth = firebaseApp.auth()
// export const firebaseAuthUI = new firebaseui.auth.AuthUI(firebaseAuth)
export const firebaseUIConfig = FIREBASE_UI_CONFIG
