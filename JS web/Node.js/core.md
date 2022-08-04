# Node.js
- what is it:
  - a Javascript runtime environment in system
  - run JavaScript V8 engine out of browser 
  - supported by a large community
    - packages like Express.js, 
    - package management with npm

- run a script
```bash
node /path/to/script
```
# Global Object 
- similar to Chrome's Window Object
- show Global Objects in Node.js
```js
console.log(global)
global.<TAB>
```
|global funtion|description|
|--|--|
|setInterval|run function every X seconds|
|clearInterval|Cancels a Timeout object created by setInterval().|
|setTimeout|run function after X seconds|
|clearTimeout|Cancels a Timeout object created by setTimeout().|

|global properties|description|
|--|--|
|__dirname|Absolute path to current file's dir|
|__filename|Absolute path to current file|

# User Module
|global properties|type|description|
|--|--|--|
|module.exports|object|create module.exports object|
|require('path/to/module')|function|Used to import modules, JSON, and local files|
```js
// in file people (dependency)
  const people = ['yoshi', 'ryu', 'chun-li', 'mario'];
  const ages = [20, 25, 30, 35];
  module.exports = {
    people, ages
  }
// in main file (functional)
  const data = require('./people');
  const data = require('./people');
  console.log(data.people, data.ages);

  const { people, ages } = require('./people');   //alt
```

# build-in modules
## os
- os informations
```js
const os = require('os');
os.paltform() // show current platform   
os.homedir() // show home dir   
```

## fs: file system
### まとめ
- file operations
  
|||
|--|--|
|readFile()||
|writeFile()||
|existsSync()||
|mkdir()||
|rmdir()||
|unlink()||

- buffer object
  
|||
|--|--|
|toString()| convert data buffer into string|
- stream
  
|||
|--|--|
|createReadStream()||
|createWriteStream()||
|readStream.on()| listener for data read stream|
|writeStream.write()|write stream event trigger|
|readStream.pipe(writeStream)|pipe readStream to writeStream |



### file operations (creating, reading, deleting, moding)

- fs does not block the following codes while reading: the program continue while the file is being read. fs has callbacks, and the callback is called when the reading/writing is finished
```js
const fs = require('fs');

// reading files
  fs.readFile('./docs/blog.txt', (err, data) => {
    if (err) {
      console.log(err);
    }  
    console.log(data.toString());    // data is an buffer object
  }); 
```

```js
// writing/create files (default 'w', overwrite)
  fs.writeFile((file, data, [options], callback))
```
### directory operations

```js
fs.existsSync(path)   // Returns true if the path(dir or file) exists, false otherwise.
fs.mkdir(path[, options], callback)   // Asynchronously creates a directory.
fs.rmdir(path[, options], callback)   // Asynchronous rmdir
fs.unlink(path, callback)             // Asynchronously removes a file or symbolic link.

// eg: deleting files
if (fs.existsSync('./docs/deleteme.txt')) {
  fs.unlink('./docs/deleteme.txt', err => {
    if (err) {
      console.log(err);
    }
    console.log('file deleted');
  });
}
```

### file streams: start using data before it's full loaded
- in a Node.js based HTTP server, request is a readable stream and response is a writable stream
- Express use streams to interact with the client
- streams are being used in every database connection driver 

createReadStream()
createWriteStream()
net.socket

```js
fs.createReadStream(path[, options])
fs.createWriteStream(path[, options])
readable.pipe(destination[, options])
```
```js
const readStream = fs.createReadStream('./docs/blog3.txt', { encoding: 'utf8'});
readStream.on('data', chunk => {      // an eventListener, each time data buffer come in, the callback do something to the buffer(chunk) 
  // process the chunk of data
})

const writeStream = fs.createWriteStream('./docs/blog4.txt'); // write stream to target file

// pipe from readable to writable
  readStream.pipe(writeStream);
```


# http module

> [ref(video)](https://www.youtube.com/watch?v=DQD00NAUPNk&list=PL4cUxeGkcC9jsz4LDYc6kv3ymONOKxwBU&index=4)
## create server
```js
const http = require('http');
// create server, which receive req(with meta info in it), and make response according to callback
    server = http.createServer([options],requestListenerCallback(req, res));
// make server listen to a port and host ip (given in options) for request
    server.listen(options, [callback])
``` 
- name 'localhost' is alias to loopback ip 127.0.0.1

## req object
- some useful fields
```js
req.url         // client requested url
req.method      // request type
```

## res object
|object|type|desc|
|--|--|--|
|response.setHeader(name, value)| function |Sets a single header value for implicit headers. |
|response.end([data[, encoding]][, callback])| function|This method signals to the server that all of the response headers and body have been sent; that server should consider this message complete. The method, response.end(), MUST be called on each response.|
|response.write(chunk[, encoding][, callback])|function|This sends a chunk of the response body. This method may be called multiple times to provide successive parts of the body.chunk can be a string or a buffer.|


```js
const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  console.log(req.url);         // (log on server)
  // set header content type
  res.setHeader('Content-Type', 'text/html');

  // routing based on req.url
  let path = './views/';        // path in server filesystem
  switch(req.url) {
    case '/':
      path += 'index.html';
      res.statusCode = 200;
      break;
    case '/about':
      path += 'about.html';
      res.statusCode = 200;
      break;
    case '/about-me':           // redirection
      res.statusCode = 301;
      res.setHeader('Location', '/about');  
      res.end()
      break;
    default:
      path += '404.html';
      res.statusCode = 404;
  }

  // send html
  fs.readFile(path, (err, data) => {
    if (err) {
      console.log(err);
      res.end();
    }
    //res.write(data);
    res.end(data);
  });


});

// localhost is the default value for 2nd argument
server.listen(3000, 'localhost', () => {
  console.log('listening for requests on port 3000');
});
```
