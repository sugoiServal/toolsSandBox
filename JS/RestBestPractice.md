- Handle errors gracefully and return standard error codes
- Allow filtering, sorting, and pagination
- Maintain Good Security Practices
- Cache data to improve performance
- Versioning our APIs


- REST API?
    - an application programming interface architecture 
    - `stateless` communication and cacheable data. 
    - can be implement by a number of communication protocols, most commonly `HTTPS`,

- why commonly accepted conventions, 
    - avoid confusing the maintainers of the API and the clients as it’s different from what everyone expects.


# Accept and respond with JSON
- JSON is the standard for transferring data.
    - every networked technology can use it: Eg, JavaScript (Fetch API); Server-side technologies have libraries that decode JSON

- To make sure that REST API server and client communicate with JSON, 
    - we should set `Content-Type` in the response `header` to `application/json `
    - Many server-side app frameworks set the response header automatically. 


- other formats
    - XML 
        - `isn’t widely(easily) supported` by frameworks  
        - can’t manipulate this data as easily on the client-side(browsers)
    - `Form data `
        - it is only good for `send and receive files` between client and server



```js
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

//bodyParser.json() parses the JSON request body string into a JavaScript object
app.use(bodyParser.json());

app.post('/', (req, res) => {
  res.json(req.body);
});

app.listen(3000, () => console.log('server started'));
```


# Naming the Endpoint
### Use nouns instead of verbs in endpoint paths
- We should `use the nouns` which `represent the entity that the endpoint provide`
- We shouldn’t use verbs in our endpoint paths. 
    - HTTP request method already has the verb`(POST, GET, PUT, DELETE)`. 
    - Having verbs makes url unnecessarily long 
- eg: create routes like 
    - GET /articles/ (arrays of articles). 
    - POST /articles/ (adding a new article)
    - PUT /articles/:id  
    - DELETE /articles/:id 
```js
app.get('/articles', (req, res) => {
});

app.post('/articles', (req, res) => {
});

app.put('/articles/:id', (req, res) => {
  const { id } = req.params;
});

app.delete('/articles/:id', (req, res) => {
  const { id } = req.params;
});
```
### Name resource
- Name collections with plural nouns
- Name single resource with id (`/articles/:id`)
- put all other data/payload inside the `request body`

### Use logical nesting on endpoints
- if one object can contain another object, the endpoint reflect that by nesting. 
    - For example, an endpoint to get `all comments for a news article` (comments is a child resource of /articles), we should append the /comments path to the end of the /articles path
```js
app.get('/articles/:articleId/comments', (req, res) => {
  const { articleId } = req.params;
});
```

# Handle errors and return standard error codes
- Handle errors'exception inside the handler method
- make use of field valication

200 OK
201 Created - indicates that the request has been
   fulfilled and has resulted in one or more new resources being
   created.
202 Accepted - indicates that the request has been
   accepted for processing, but the processing has not been completed.
204 No Content - indicates that the server has
   successfully fulfilled the request and that there is no additional
   content (the container is empty)
404 Not Found - if the resource id does not exist 
- A resilient API will send back `4xx status code` when it receives a bad request.
- The `500 status code` should be reserved for actual server/application failures: 
    - unexpected infrastracture scenarios,
    - high resource usage (CPU / Physical Memory)
    - database-related failure

To eliminate confusion for API users when an error occurs, we should handle errors gracefully and return HTTP response codes that indicate what kind of error occurred. This gives maintainers of the API enough information to understand the problem that’s occurred. We don’t want errors to bring down our system, so we can leave them unhandled, which means that the API consumer has to handle them.

Common error HTTP status codes include:

400 Bad Request – This means that client-side input fails validation.
401 Unauthorized – This means the user isn’t not authorized to access a resource. It usually returns when the user isn’t authenticated.
403 Forbidden – This means the user is authenticated, but it’s not allowed to access a resource.
404 Not Found – This indicates that a resource is not found.
500 Internal server error – This is a generic server error. It probably shouldn’t be thrown explicitly.
502 Bad Gateway – This indicates an invalid response from an upstream server.
503 Service Unavailable – This indicates that something unexpected happened on server side (It can be anything like server overload, some parts of the system failed, etc.).
We should be throwing errors that correspond to the problem that our app has encountered. For example, if we want to reject the data from the request payload, then we should return a 400 response as follows in an Express API:

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// existing users
const users = [
  { email: 'abc@foo.com' }
]

app.use(bodyParser.json());

app.post('/users', (req, res) => {
  const { email } = req.body;
  const userExists = users.find(u => u.email === email);
  if (userExists) {
    return res.status(400).json({ error: 'User already exists' })
  }
  res.json(req.body);
});


app.listen(3000, () => console.log('server started'));
In the code above, we have a list of existing users in the users array with the given email.

Then if we try to submit the payload with the email value that already exists in users, we’ll get a 400 response status code with a 'User already exists' message to let users know that the user already exists. With that information, the user can correct the action by changing the email to something that doesn’t exist.

Error codes need to have messages accompanied with them so that the maintainers have enough information to troubleshoot the issue, but attackers can’t use the error content to carry our attacks like stealing information or bringing down the system.

Whenever our API does not successfully complete, we should fail gracefully by sending an error with information to help users make corrective action.

Allow filtering, sorting, and pagination
The databases behind a REST API can get very large. Sometimes, there’s so much data that it shouldn’t be returned all at once because it’s way too slow or will bring down our systems. Therefore, we need ways to filter items.

We also need ways to paginate data so that we only return a few results at a time. We don’t want to tie up resources for too long by trying to get all the requested data at once.

Filtering and pagination both increase performance by reducing the usage of server resources. As more data accumulates in the database, the more important these features become.

Here’s a small example where an API can accept a query string with various query parameters to let us filter out items by their fields:

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// employees data in a database
const employees = [
  { firstName: 'Jane', lastName: 'Smith', age: 20 },
  //...
  { firstName: 'John', lastName: 'Smith', age: 30 },
  { firstName: 'Mary', lastName: 'Green', age: 50 },
]

app.use(bodyParser.json());

app.get('/employees', (req, res) => {
  const { firstName, lastName, age } = req.query;
  let results = [...employees];
  if (firstName) {
    results = results.filter(r => r.firstName === firstName);
  }

  if (lastName) {
    results = results.filter(r => r.lastName === lastName);
  }

  if (age) {
    results = results.filter(r => +r.age === +age);
  }
  res.json(results);
});

app.listen(3000, () => console.log('server started'));
In the code above, we have the req.query variable to get the query parameters. We then extract the property values by destructuring the individual query parameters into variables using the JavaScript destructuring syntax. Finally, we run filter on with each query parameter value to locate the items that we want to return.

Once we have done that, we return the results as the response. Therefore, when we make a GET request to the following path with the query string:

/employees?lastName=Smith&age=30

We get:

[
    {
        "firstName": "John",
        "lastName": "Smith",
        "age": 30
    }
]
as the returned response since we filtered by lastName and age.

Likewise, we can accept the page query parameter and return a group of entries in the position from (page - 1) * 20 to page * 20. 

We can also specify the fields to sort by in the query string. For instance, we can get the parameter from a query string with the fields we want to sort the data for. Then we can sort them by those individual fields.

For instance, we may want to extract the query string from a URL like:

http://example.com/articles?sort=+author,-datepublished

Where + means ascending and - means descending. So we sort by author’s name in alphabetical order and datepublished from most recent to least recent.

Maintain good security practices
Most communication between client and server should be private since we often send and receive private information. Therefore, using SSL/TLS for security is a must.

A SSL certificate isn’t too difficult to load onto a server and the cost is free or very low. There’s no reason not to make our REST APIs communicate over secure channels instead of in the open.

People shouldn’t be able to access more information that they requested. For example, a normal user shouldn’t be able to access information of another user. They also shouldn’t be able to access data of admins.

To enforce the principle of least privilege, we need to add role checks either for a single role, or have more granular roles for each user.

If we choose to group users into a few roles, then the roles should have the permissions that cover all they need and no more. If we have more granular permissions for each feature that users have access to, then we have to make sure that admins can add and remove those features from each user accordingly. Also, we need to add some preset roles that can be applied to a group users so that we don’t have to do that for every user manually.

Cache data to improve performance
We can add caching to return data from the local memory cache instead of querying the database to get the data every time we want to retrieve some data that users request. The good thing about caching is that users can get data faster. However, the data that users get may be outdated. This may also lead to issues when debugging in production environments when something goes wrong as we keep seeing old data.

There are many kinds of caching solutions like Redis, in-memory caching, and more. We can change the way data is cached as our needs change.

For instance, Express has the apicache middleware to add caching to our app without much configuration. We can add a simple in-memory cache into our server like so:

const express = require('express');
const bodyParser = require('body-parser');
const apicache = require('apicache');
const app = express();
let cache = apicache.middleware;
app.use(cache('5 minutes'));

// employees data in a database
const employees = [
  { firstName: 'Jane', lastName: 'Smith', age: 20 },
  //...
  { firstName: 'John', lastName: 'Smith', age: 30 },
  { firstName: 'Mary', lastName: 'Green', age: 50 },
]

app.use(bodyParser.json());

app.get('/employees', (req, res) => {
  res.json(employees);
});

app.listen(3000, () => console.log('server started'));
The code above just references the apicache middleware with apicache.middleware and then we have:

app.use(cache('5 minutes'))

to apply the caching to the whole app. We cache the results for five minutes, for example. We can adjust this for our needs.

If you are using caching, you should also include Cache-Control information in your headers. This will help users effectively use your caching system.

Versioning our APIs
We should have different versions of API if we’re making any changes to them that may break clients. The versioning can be done according to semantic version (for example, 2.0.6 to indicate major version 2 and the sixth patch) like most apps do nowadays.

This way, we can gradually phase out old endpoints instead of forcing everyone to move to the new API at the same time. The v1 endpoint can stay active for people who don’t want to change, while the v2, with its shiny new features, can serve those who are ready to upgrade. This is especially important if our API is public. We should version them so that we won’t break third party apps that use our APIs.

Versioning is usually done with /v1/, /v2/, etc. added at the start of the API path.

For example, we can do that with Express as follows:

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

app.get('/v1/employees', (req, res) => {
  const employees = [];
  // code to get employees
  res.json(employees);
});

app.get('/v2/employees', (req, res) => {
  const employees = [];
  // different code to get employees
  res.json(employees);
});

app.listen(3000, () => console.log('server started'));
We just add the version number to the start of the endpoint URL path to version them.

Conclusion
The most important takeaways for designing high-quality REST APIs is to have consistency by following web standards and conventions. JSON, SSL/TLS, and HTTP status codes are all standard building blocks of the modern web.

Performance is also an important consideration. We can increase it by not returning too much data at once. Also, we can use caching so that we don’t have to query for data all the time.

Paths of endpoints should be consistent, we use nouns only since the HTTP methods indicate the action we want to take. Paths of nested resources should come after the path of the parent resource. They should tell us what we’re getting or manipulating without the need to read extra documentation to understand what it’s doing.