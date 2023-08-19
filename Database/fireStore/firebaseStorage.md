- can store small file in the server and provide access through URL
- can be used for like user thumbnails

### setup 
```js
import firebase/storage
const projectStorage = firebase.storage()
export {projectStorage}
```

### upload
```js
let thumbnail = ... // file object, through upload
const uploadPath = `thumbnails/${user.uid}/${thumbnail.name}`  // create a upload path, incl file name
await projectStorage.ref(uploadPath).put(thumbnail)   // ref setup an upload path, put conduct the upload
```

### [download](https://firebase.google.com/docs/storage/web/download-files)

```js

var pathReference = projectStorage.ref('images/stars.jpg');  // get path ref
const imgURL = await pathReference.getDownloadURL()
```