# auth function
- Firebase manager user' logging in, sign up logout and user session inside the backend which is a black box hidden from the website creator
## setup
```js
// Import the functions you need from the SDKs you need
import firebase from 'firebase/app'
import "firebase/firestore" 

// Your web app's Firebase configuration
const firebaseConfig = {
    //...
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const myMoneyFirestore = firebase.firestore()  // database
const userAuth =  firebase.auth()      // !!! auth module
export {myMoneyFirestore, userAuth}  //export
```


## use
### signup
```js
// signUp
    const res = await userAuth.createUserWithEmailAndPassword(email, password)  // res: null if fail
    await res.user.updateProfile({displayName: displayName})
```
> once signed up the user is automatically logging in in the backend

### logout
```js
// sign out current user
await userAuth.signOut()
```

### login
```js
// login
const res = await userAuth.signInWithEmailAndPassword(email, password)
```

### front ping back for login status/ subscribe to user status change
```js
// fire any time user login/ logout state change
userAuth.onAuthStateChanged((user) => {
    if (user) {
        // user is still signed in (in backend)
    } else {
        // user is signed out (or session ended)
    }
})

// cancel subscription
    // create subscription this way
    const unsub = userAuth.onAuthStateChanged((user) => {
        //...
    })
    // on unsub
    unsub()
```
- Adds an observer for changes to the user's sign-in state.
  - observer is only triggered on sign-in or sign-out.