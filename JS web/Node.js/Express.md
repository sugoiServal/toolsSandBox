# What is Express
- minimalist web framework for node.
- manage client requests and responses 

|method|desc|
|--|--|
|app.listen([port[, host[, backlog]]][, callback])|Binds and listens for connections on the specified host and port.|
|app.get(path, callback [, callback ...])|Routes HTTP GET requests to the specified path with the specified callback functions.|
|app.post(path, callback [, callback ...])||
|app.delete||
|res.sendFile(path [, options] [, fn])|Transfers the file at the given path.|
|res.redirect([status,] path)|Redirects to the URL derived from the specified path, with specified status, a positive integer that corresponds to an HTTP status code . |
|res.status(code)|Sets the HTTP status for the response. It is a chainable alias, ie it returns an response object|
|app.use([path,] callback [, callback...])|Mounts the specified middleware function or functions at the specified path: the middleware function is executed when the base of the requested path matches path.|

## middlewares
|name|desc|type|
|-|-|-|
|morgan|HTTP request logger|3rd-party|
|express.static|change statics files' accessability from frontend| express 
|express.urlencoded([options])|parses incoming requests with urlencoded payloads and is based on body-parser.|express|
|express.json()|It parses incoming requests with JSON payloads. A new body object containing the parsed data is populated on the request object after the middleware (i.e. **req.body**), or an empty object ({}) if there was no body to parse |express|
## build a server with Express
```js
// the whole chunk of app.get() is actually a switch structure. if any of the get()  got triggered and responses to the client, the express server program stop executing the following codes

// app.use() on the other hand is different. it is middleware, ie chunk of code/functions that got executed like a script

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Blog = require('./models/blog');

// express app
const app = express();

// connect to mongodb 
const dbURI = "mongodb+srv://application0:SugoiServal@cluster0.mowoi4n.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => console.log("connected to DB"))
  .catch(err => console.log(err));

// listen for requests
app.listen(3000);

// use ejs view engine to render HTMLs logic
app.set('view engine', 'ejs');


//Setup middlewares
app.use((req, res, next) => {       // demo: custom middleware need next() to proceed
  console.log('new request made:');
  console.log('host: ', req.hostname);
  console.log('path: ', req.path);
  console.log('method: ', req.method);
  next();
});

app.use(morgan('dev'));         // 3rd-party logger middleware
app.use(express.urlencoded({ extended: true }));      // parse incoming request   
app.use(express.static('public'));  // middleware: make folder "public" visable from frontend


// Server routings
app.get('/', (req, res) => {   // redirects
  res.redirect('/blogs');
});

app.get('/about', (req, res) => {   // send static files
  // res.send('<p>about page</p>');
  res.sendFile('./views/about.html', { root: __dirname });
});

app.get('/blogs/create', (req, res) => {   // render ejs files
  res.render('create', { title: 'Create a new blog' });   // render("file", "parameters:doc")
});

app.get('/blogs', (req, res) => {   // get request, communicate with mongo server via moogoose
  Blog.find().sort({ createdAt: -1 })
    .then(result => {
      res.render('index', { blogs: result, title: 'All blogs' });
    })
    .catch(err => {
      console.log(err);
    });
});

app.get('/blogs/:id', (req, res) => {        // get request by route parameter :id
  const id = req.params.id;   // params.id is basically reflection of :id -- params pass through url
  console.log(id)
  Blog.findById(id)
    .then(result => {
      res.render('details', { blog: result, title: 'Blog Details' });
    })
    .catch(err => {
      console.log(err);
    });
});


app.post('/blogs', (req, res) => {  // post request, from HTML form, parsed by urlencoded() => req.body
  const blog = new Blog(req.body);
  blog.save()
    .then(result => {
      res.redirect('/blogs');
    })
    .catch(err => {
      console.log(err);
    });
});

app.delete('/blogs/:id', (req, res) => {   // delete request by route parameter :id
  const id = req.params.id;
  Blog.findByIdAndDelete(id)
    .then(result => {
      res.json({ redirect: '/blogs' });   // response: tell browser to redirect through json  
    })
    .catch(err => {
      console.log(err);
    });
});

app.use((req, res) => {   // 404 page
  res.status(404).sendFile('./views/404.html', { root: __dirname });
});
```

# router object
- A router object is an isolated instance of middleware and routes. You can think of it as a “mini-application,” capable only of performing middleware and routing functions. Every Express application has a built-in app router.



# status codes
- status code describes the type of response sent to the browser (about how success the request was)

|status code|desc|
|--|--|
|200|OK|
|301|Resource moved|
|404|Not Found|
|500|Internal server error|


|status code|desc|
|--|--|
|100 range|informational response|
|200 range|success code|
|300 range|for redirects|
|400 range|client error codes|
|500 range|server error codes|
