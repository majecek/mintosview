import React, {Component} from 'react'
import logo from './logo.svg';
import './App.css';
import Button from 'material-ui/Button'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import {firebaseUIConfig, firebaseApp, firestore} from './firebaseSettings'
// import { saveUser } from './components/Auth'
import SheetJSApp from './components/SheetJSApp'

class App extends Component {

    state = {
        signedIn: false,
        signedUser: null,
        userDocRef: null,
        sheetData: null,
    }

    componentDidMount() {
        firebaseApp.auth().onAuthStateChanged((user) => {
            console.log(user)
            if (user) {
                console.log("==>1", user)
                firestore.collection("users").doc(`${user.uid}`).set({
                    displayName: user.displayName,
                    email: user.email,
                    providerData: user.providerData
                })

                this.setState({
                    signedIn: true,
                    signedUser: user.uid,
                    userDocRef: firestore.collection("users").doc(`${user.uid}`)
                });
            } else {
                console.log("==>2", user)
                this.setState({
                    signedIn: false,
                    signedUser: null,
                    userDocRef: null
                });
            }
        });
    }

    // saveUser(user) {
    //     if (user) {
    //         console.log("user:", user)
    //         firestore.collection("users").doc(`${user.uid}`).set({
    //             displayName: user.displayName,
    //             email: user.email,
    //             providerData: user.providerData
    //         })
    //         this.setState()
    //     }
    //
    // }

    render() {
        return (
            <div className="App">

                <Button variant="raised" color="primary">
                    Hello World
                </Button>

                {!this.state.signedIn &&
                    <div>
                        {/*<StyledFirebaseAuth className={styles.firebaseUi} uiConfig={this.uiConfig} firebaseAuth={firebaseApp.auth()}/>*/}
                        <StyledFirebaseAuth uiConfig={firebaseUIConfig} firebaseAuth={firebaseApp.auth()}/>
                    </div>
                }

                {this.state.signedIn &&
                    <div>
                        Hello {firebaseApp.auth().currentUser.displayName}. You are now signed In!
                        <a onClick={() => firebaseApp.auth().signOut()}>Sign-out</a>
                        <SheetJSApp />
                    </div>

                }
                <StyledFirebaseAuth uiConfig={firebaseUIConfig} firebaseAuth={firebaseApp.auth()}/>

                {console.log("->->", this.state.signedIn)}
                {console.log("->->", this.state.signedUser)}
                {console.log("->->", this.state.userDocRef)}
            </div>
        );
    }
}

export default App;
