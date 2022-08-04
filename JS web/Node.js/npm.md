# manage project specific packages
## terms
- dependency: 
  - refers to packages that have been installed locally to this project. Hence the project depends on the packages

```bash
npm init  # This create a package.json file inside the project directory
npm install # or (npm i) install dependency from package.json file
npm install <package> # install as dependency to package.json file
npm install -g <package># install globally to system dir
```




# useful package
|name|desc|
|--|--|
|[nodemon](https://www.npmjs.com/package/nodemon)|auto restart node server when code change detected|
|[lodash](https://www.npmjs.com/package/lodash)|minimalist server logic|
|mongoose|mongodb object modeling, supports both promises and callbacks.|
|morgan|HTTP request logger|
|[json-server](https://www.npmjs.com/package/json-server)|a full fake REST API from json files|