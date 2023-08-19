```c++
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /myTransaction/{document=**} {
      // must be authenticated to create
      allow create: if request.auth != null;

      // logged in user uid must match the document creator to read & delete
      allow read, delete: if request.auth.uid == resource.data.uid;
    }
  }
}
```

```bash
firebase deploy --only firestore
```
