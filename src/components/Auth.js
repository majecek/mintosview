import {firebaseDB, usersColl} from '../firebaseSettings';

export function saveUser(user) {
    console.log(user)
    console.log(user.uid)
    usersColl.doc(`${user.uid}`).set({
        displayName: user.displayName,
        email: user.email,
        providerData: user.providerData
    })

    // firebaseDB.ref(`users/${user.uid}`)
    //     .update({
    //         displayName: user.displayName,
    //         email: user.email,
    //         providerData: user.providerData
    //     })
}