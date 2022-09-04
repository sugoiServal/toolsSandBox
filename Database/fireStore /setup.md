# install cli
>[install](https://firebase.google.com/docs/cli#install-cli-mac-linux)
```bash
curl -sL https://firebase.tools | bash
# login via browser (google account)
firebase login
```

# setup in project
```js
import firebase from 'firebase/app'
import 'firebase/firestore'
const firebaseConfig = {
    //...
  };

// init Firebase
firebase.initializeApp(firebaseConfig);
// init Firestore
const projectFirestore = firebase.firestore()

export { projectFirestore }

```
# CRUD
## get all data
```js
import { projectFirestore } from "../firebase/config";
projectFirestore.collection('recipes').get()
      .then((snapshot) => {
        if (snapshot.empty) {
          setError('No Recipe to load')
        } else {
          let results = []
          snapshot.docs.forEach((doc)=>{
            results.push({id: doc.id, ...doc.data()})
          })
          setData(results)
        }
      }).catch(err => {
        setError(err.message)
      })
```
## get one data by id
```js
projectFirestore.collection('recipes').doc(id).get()
      .then((doc)=> {
        if (doc.exists) {
          setData(doc.data())
        } else {
          setError('No Recipe to load')
        }
      })
```
- get only one field
```js
const field value = await projectFirestore.collection('recipes').doc(id).get('myField')
```

## setup listener (each time database change a snapshot is returned)
```js
useEffect(() => {
    setIsPending(true)
    const unsub = projectFirestore.collection('recipes').onSnapshot((snapshot) => {
        if (snapshot.empty) {
            setError('No Recipe to load')
            setIsPending(false)
        } else {
            let results = []
            snapshot.docs.forEach((doc)=>{
              results.push({id: doc.id, ...doc.data()})
            })
            setData(results)
            setIsPending(false)
        }}, (err) => {
          setError(err.message)
          setIsPending(false)
        })
    return () => unsub()
  }, [])

// can also used with where() clause to filter doc to be listened
db.collection("cities").where("state", "==", "CA")
    .onSnapshot((querySnapshot) => {...})
```
- more:
  - [View changes between snapshots](https://firebase.google.com/docs/firestore/query-data/listen#view_changes_between_snapshots)
  - [Detach a listener(unsubscribe)](https://firebase.google.com/docs/firestore/query-data/listen#detach_a_listener)
## Post(Create)
```js
const data = {
      title,
      ingredients: ingredientList,
      method: cookMethod,
      cookingTime: cooktime.toString() + ' minutes'
    } 
await projectFirestore.collection('recipes').add(data)
```


## delete
```js
projectFirestore.collection('recipes').doc(id).delete()
```

## set(set data and id, create new if not exist)
```js
useEffect(() => {
  projectFirestore.collection('recipes').doc("1").set(  {
    "id": "1",
    "title": "Veggie Stew",
    "ingredients": [
      "1 Carrot",
      "1 Leek",
      "200g Tofu",
      "300ml Veg stock"
    ],
    "cookingTime": "45 minutes"
  });
  projectFirestore.collection('recipes').doc("2").set(  {
    "id": "2",
    "title": "Veggie Pizza",
    "ingredients": [
      "1 Base",
      "Tomata pasata",
      "1 Green pepper",
      "100g Mushrooms"
    ],
    "cookingTime": "35 minutes"
  });
}, [])

```
## update
```js
projectFirestore.collection('recipes').doc(id).update({
  title: "something different title"
})

```
### update to an array (push or remove), atomic operation
[link](https://firebase.google.com/docs/firestore/manage-data/add-data#update_elements_in_an_array)
```js
var washingtonRef = db.collection("cities").doc("DC");

// Atomically add a new region to the "regions" array field.
washingtonRef.update({
    regions: firebase.firestore.FieldValue.arrayUnion("greater_virginia")
});

// Atomically remove a region from the "regions" array field. 
washingtonRef.update({
    regions: firebase.firestore.FieldValue.arrayRemove("east_coast")
});
```

# Other
## query
```js
db.collection("cities").where("capital", "==", true)
    .get()
    .then(...)
    .catch(...);
```

|query operators|means|
|-|-|
|< |less than|
|<=| less than or equal to|
|==| equal to|
|> |greater than|
|>=| greater than or equal to|
|!=| not equal to|
|array-contains|array contains a value|
|array-contains-any|array contains any value in a set of values|
|in|field match any value in a set of values|
|not-in|field not in a set of values|

### [compound query](https://firebase.google.com/docs/firestore/query-data/queries#compound_queries)
> You can chain multiple equality operators methods to create more specific queries (logical AND)
```js
const q2 = citiesRef.where("state", "==", "CA").where("population", "<", 1000000);
const q1 = citiesRef.where("state", ">=", "CA").where("state", "<=", "IN");
const q2 = citiesRef.where("state", "==", "CA").where("population", ">", 1000000);
```

## orderBy
```js
projectFirestore.collection('recipes').orderBy("createAt", "desc")
// the first argument is the field name
// second argument is the order
```
## Timestamp
- adding timestamp to data stored in firestore
```js
// import 
import firebase from 'firebase/app'
firebase.initializeApp(firebaseConfig);
const myMoneyFirestore = firebase.firestore()
const timestamp = firebase.firestore.Timestamp 
export {myMoneyFirestore, timestamp}
// use
const createdAt = timestamp.fromDate(new Date())
const addedDocement =  await myMoneyFirestore.collection('collectionName').add({...doc, createdAt: createdAt})
```