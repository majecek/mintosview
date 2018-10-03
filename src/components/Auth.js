import { firestore } from '../firebaseSettings';

export function saveUser(user) {
    if (user) {
        console.log("user:", user)
        firestore.collection("users").doc(`${user.uid}`).set({
            displayName: user.displayName,
            email: user.email,
            providerData: user.providerData
        })
        this.setState()
    }

}