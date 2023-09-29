# Build React app

```bash
npm run build # app will be built in `build` folder
```

# Firebase hosting

```bash
npm install -g firebase-tools
firebase login      # Sign in to Google
firebase init
#  What do you want to use as your public directory? `build`
#  Configure as a single-page app (rewrite all urls to /index.html)? (y/N) y for react/vue app
#  File build/index.html already exists. Overwrite? (y/N) n
firebase deploy --only firestore
firebase deploy
```

# redeploy

```bash
# (if require build)
npm run build
firebase deploy
```
